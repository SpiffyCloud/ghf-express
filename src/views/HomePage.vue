<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-y="false">
      <BackgroundVisuals />

      <div
        class="relative z-10 flex flex-col items-center justify-between h-full"
      >
        <div class="flex flex-col items-center pt-10 gap-6">
          <h1>GHF Express</h1>

          <ion-button
            color="primary"
            aria-label="share app"
            @click="shareApp"
            class="w-fit"
          >
            <ion-icon slot="start" :icon="share"></ion-icon>
            <span class="pl-1.5 font-bold">Share App</span>
          </ion-button>
        </div>

        <template v-if="displayBarcode">
          <div class="bg-white mx-auto rounded-2xl p-2">
            <svg id="barcode"></svg>
          </div>
          <div class="grid grid-cols-2 gap-4 px-10 w-full">
            <ion-button
              color="secondary"
              aria-label="edit barcode"
              @click="editBarcode"
            >
              <ion-icon slot="start" :icon="create"></ion-icon>
              <span class="pl-1.5 font-bold">Edit</span>
            </ion-button>
            <ion-button
              color="secondary"
              aria-label="delete barcode"
              @click="showDeleteDialog"
            >
              <ion-icon slot="start" :icon="trash"></ion-icon>
              <span class="pl-1.5 font-bold">Delete</span>
            </ion-button>
          </div>
          <footer class="text-center ion-padding-bottom">
            <SpiffyLink />
            <p class="py-3 text-xs">v{{ appVersion }}</p>
          </footer>
        </template>

        <template v-else>
          <p class="text-center">Enter your membership ID</p>

          <div class="flex gap-2 justify-center">
            <button
              v-for="(char, idx) in barcodeChars"
              :key="idx"
              type="button"
              aria-label="id number"
              class="focus:bg-navy-600 focus:animate-blink bg-navy-800 outline-none text-4xl font-bold py-4! w-12 text-center rounded-lg!"
              :class="{
                'text-white/30': char === emptyChar,
                'animate-blink': idx === position,
              }"
              @click="position = idx"
            >
              {{ char }}
            </button>
          </div>
          <div class="bg-navy-900/40 backdrop-blur-sm w-full">
            <div
              class="grid grid-cols-3 gap-2 w-full ion-padding-horizontal pb-10"
            >
              <ion-button
                v-for="n in 9"
                :key="n"
                @click="updateBarcode(n.toString())"
                color="tertiary"
              >
                <span class="font-bold text-2xl py-1">{{ n }}</span>
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
                <span class="font-bold text-2xl py-1">0</span>
              </ion-button>

              <IconButton
                ariaLabel="save"
                :disabled="!isValidBarcode"
                @click="saveBarcode"
              >
                <svg
                  class="w-6 fill-white"
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
