<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-y="false">
      <BackgroundVisuals />

      <div class="page-shell">
        <div class="page-header">
          <h1>GHF Express</h1>

          <ion-button
            color="primary"
            aria-label="share app"
            @click="shareApp"
            class="share-button"
          >
            <ion-icon slot="start" :icon="share"></ion-icon>
            <span class="share-button-text">Share App</span>
          </ion-button>
        </div>

        <template v-if="displayBarcode">
          <div class="barcode-card">
            <svg id="barcode"></svg>
          </div>
          <div class="barcode-actions">
            <ion-button
              color="secondary"
              aria-label="edit barcode"
              @click="editBarcode"
            >
              <ion-icon slot="start" :icon="create"></ion-icon>
              <span class="action-button-text">Edit</span>
            </ion-button>
            <ion-button
              color="secondary"
              aria-label="delete barcode"
              @click="showDeleteDialog"
            >
              <ion-icon slot="start" :icon="trash"></ion-icon>
              <span class="action-button-text">Delete</span>
            </ion-button>
          </div>
          <footer class="ion-text-center ion-padding-bottom">
            <SpiffyLink />
            <p class="app-version">v{{ appVersion }}</p>
          </footer>
        </template>

        <template v-else>
          <p class="ion-text-center">Enter your membership ID</p>

          <div class="barcode-input">
            <button
              v-for="(char, idx) in barcodeChars"
              :key="idx"
              type="button"
              aria-label="id number"
              class="barcode-digit"
              :class="{
                'barcode-digit-empty': char === emptyChar,
                'barcode-digit-active': idx === position,
              }"
              @click="position = idx"
            >
              {{ char }}
            </button>
          </div>
          <div class="keypad-panel">
            <div class="keypad-grid">
              <ion-button
                v-for="n in 9"
                :key="n"
                @click="updateBarcode(n.toString())"
                color="tertiary"
              >
                <span class="keypad-digit">{{ n }}</span>
              </ion-button>

              <IconButton
                ariaLabel="backspace"
                :disabled="cannotBackspace"
                @click="deleteDigitFromBarcode"
              >
                <ion-icon
                  slot="icon-only"
                  size="large"
                  :icon="backspace"
                ></ion-icon>
              </IconButton>

              <ion-button color="tertiary" @click="updateBarcode('0')">
                <span class="keypad-digit">0</span>
              </ion-button>

              <IconButton
                ariaLabel="save"
                :disabled="!isValidBarcode"
                @click="saveBarcode"
              >
                <svg
                  class="save-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                  />
                </svg>
              </IconButton>
            </div>
          </div>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { trackEvent } from "@/lib/analytics";
import JsBarcode from "jsbarcode";

import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import { App } from "@capacitor/app";
import { Preferences } from "@capacitor/preferences";
import { Share } from "@capacitor/share";

import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/vue";
import { backspace, create, share, trash } from "ionicons/icons";
import { computed, nextTick, onMounted, ref } from "vue";

import BackgroundVisuals from "@/components/BackgroundVisuals.vue";
import IconButton from "@/components/IconButton.vue";
import SpiffyLink from "@/components/SpiffyLink.vue";

const BARCODE_LENGTH = 6;
const emptyChar = "•";

const barcode = ref(emptyChar.repeat(BARCODE_LENGTH));
const position = ref(0);
const displayBarcode = ref(false);
const appVersion = ref("?.?.?");

const barcodeChars = computed(() =>
  barcode.value.split("").slice(0, BARCODE_LENGTH),
);
const isEmptyBarcode = computed(() =>
  barcodeChars.value.every((char) => char === emptyChar),
);
const isValidBarcode = computed(() =>
  /^\d{6}$/.test(barcodeChars.value.join("")),
);
const cannotBackspace = computed(
  () =>
    position.value === 0 && barcodeChars.value[position.value] === emptyChar,
);

onMounted(async () => {
  await loadStoredBarcode();
  await loadAppVersion();
});

async function loadStoredBarcode() {
  const { value } = await Preferences.get({ key: "barcode" });
  if (value) {
    barcode.value = value
      .padEnd(BARCODE_LENGTH, emptyChar)
      .slice(0, BARCODE_LENGTH);
    await renderBarcode();
  } else {
    barcode.value = emptyChar.repeat(BARCODE_LENGTH);
    displayBarcode.value = false;
  }
}

async function loadAppVersion() {
  try {
    const { version } = await App.getInfo();
    appVersion.value = version;
  } catch {
    appVersion.value = "?.?.?";
  }
}

function updateBarcode(value: string) {
  barcode.value = replaceChar(barcode.value, position.value, value);
  if (position.value < BARCODE_LENGTH - 1) {
    position.value += 1;
  }
}

function deleteDigitFromBarcode() {
  barcode.value = replaceChar(barcode.value, position.value, emptyChar);
  if (position.value > 0 && barcodeChars.value[position.value] === emptyChar) {
    position.value -= 1;
  }
}

async function saveBarcode() {
  if (isEmptyBarcode.value || !isValidBarcode.value) return;
  await Preferences.set({ key: "barcode", value: barcode.value });
  await renderBarcode();
}

async function renderBarcode() {
  position.value = barcode.value === "" ? 0 : barcode.value.length - 1;
  displayBarcode.value = true;
  await nextTick();

  try {
    JsBarcode("#barcode", barcode.value, {
      format: "CODE39",
      width: 2,
      height: 110,
      displayValue: true,
      font: "Menlo",
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 16,
      fontSize: 24,
      background: "white",
      lineColor: "black",
      margin: 16,
    });

    const svg = document.querySelector("#barcode");
    if (svg) {
      svg.querySelectorAll("rect").forEach((rect) => {
        rect.setAttribute("rx", "2");
        rect.setAttribute("ry", "2");
      });
    }

    await trackEvent("barcode_displayed");
  } catch {
    displayBarcode.value = false;
  }
}

async function deleteBarcode() {
  try {
    await Preferences.clear();
  } catch {
    // Ignore storage failures (web/private mode/etc) and still reset UI.
  } finally {
    barcode.value = emptyChar.repeat(BARCODE_LENGTH);
    position.value = 0;
    displayBarcode.value = false;
    await trackEvent("barcode_deleted");
  }
}

function editBarcode() {
  displayBarcode.value = false;
  position.value = Math.min(BARCODE_LENGTH - 1, barcode.value.length - 1);
  void trackEvent("barcode_edited");
}

async function showDeleteDialog() {
  const title = "Are you sure you want to delete your barcode?";

  try {
    const result = await ActionSheet.showActions({
      title,
      options: [
        { title: "Delete Barcode", style: ActionSheetButtonStyle.Destructive },
        { title: "Cancel", style: ActionSheetButtonStyle.Cancel },
      ],
    });

    if (result.index === 0) {
      await deleteBarcode();
    }
  } catch {
    // Fallback if plugin is unavailable/misconfigured.
    if (window.confirm(title)) {
      await deleteBarcode();
    }
  }
}

async function shareApp() {
  try {
    await Share.share({
      title: "Share GHF Express",
      text: "Hey, check out the fastest way to get into GHF!",
      url: "https://apps.apple.com/us/app/ghf-express/id6737064794",
    });
    await trackEvent("app_shared");
  } catch {
    // ignore
  }
}

function replaceChar(source: string, index: number, value: string) {
  return source.slice(0, index) + value + source.slice(index + 1);
}
</script>

<style scoped>
.page-shell {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
  gap: 1.5rem;
}

.share-button {
  width: fit-content;
}

.share-button-text,
.action-button-text,
.keypad-digit {
  font-weight: 700;
}

.share-button-text,
.action-button-text {
  padding-left: 0.375rem;
}

.barcode-card {
  background: #ffffff;
  margin: 0 auto;
  border-radius: 1rem;
  padding: 0.5rem;
}

.barcode-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 0 2.5rem;
  width: 100%;
}

.app-version {
  padding: 0.75rem 0;
  font-size: 0.75rem;
  line-height: 1.5;
}

.barcode-input {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.barcode-digit {
  background: var(--ion-color-secondary);
  outline: none;
  font-size: 2.25rem;
  font-weight: 700;
  padding: 1rem 0;
  width: 3rem;
  text-align: center;
  border-radius: 0.75rem;
  border: none;
  color: var(--ion-color-secondary-contrast);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.barcode-digit:focus {
  background: var(--ion-color-tertiary);
}

.barcode-digit-empty {
  color: rgba(var(--ion-color-secondary-contrast-rgb), 0.3);
}

.barcode-digit-active {
  animation: blink 1.2s infinite;
}

.keypad-panel {
  background: rgba(var(--ion-color-primary-rgb), 0.4);
  backdrop-filter: blur(6px);
  width: 100%;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  width: 100%;
  padding: 0 1rem 2.5rem;
}

.keypad-digit {
  font-size: 1.5rem;
  padding: 0.25rem 0;
  display: inline-block;
}

.save-icon {
  width: 1.5rem;
  fill: var(--ion-color-secondary-contrast);
}

@keyframes blink {
  0%,
  100% {
    background-color: var(--ion-color-secondary);
  }
  50% {
    background-color: var(--ion-color-tertiary);
  }
}
</style>
