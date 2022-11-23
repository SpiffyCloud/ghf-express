<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { Preferences } from "@capacitor/preferences";
import JsBarcode from "jsbarcode";
import Barcode from "@/components/Barcode.vue";
import KeyPad from "@/components/KeyPad.vue";
import GraphicBottomBottom from "@/components/graphics/GraphicBottomBottom.vue";
import GraphicBottomTop from "@/components/graphics/GraphicBottomTop.vue";
import GraphicTopBottom from "@/components/graphics/GraphicTopBottom.vue";
import GraphicTopTop from "@/components/graphics/GraphicTopTop.vue";

onMounted(async () => {
  loadBarcode();
});

const barcode = ref(Array(6));
const barcodeIndex = ref(0);

function keyEntered(key) {
  barcode.value[barcodeIndex.value] = key;
  barcodeIndex.value++;
}

function backspace() {
  if (barcodeIndex.value !== 0) {
    barcodeIndex.value--;
  }
  barcode.value[barcodeIndex.value] = undefined;
}

const barcodeIsValid = computed(() => {
  return !barcode.value.includes(undefined);
});

const membershipId = computed(() => {
  return barcode.value.toString().replaceAll(",", "");
});

const instructions = computed(() => {
  if (barcodeIsValid.value) {
    return "Scan the barcode to check into the club";
  }
  return "Enter your 6 digit membership ID";
});

const barcodeHeight = computed(() => {
  if (window.innerHeight >= 896) {
    return 150;
  }
  return 100;
});

watch(barcodeIsValid, renderBarcode, { flush: "post" });

// function to generate barcode
function renderBarcode() {
  if (barcodeIsValid.value) {
    JsBarcode(".barcode", membershipId.value, {
      format: "CODE39",
      width: 2,
      height: barcodeHeight.value,
      displayValue: true,
      fontOptions: "",
      font: "sans-serif",
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 5,
      fontSize: 20,
      background: "var(--color-secondary)",
      lineColor: "var(--color-primary)",
      margin: 10,
    });
    saveBarcode();
  }
}

async function loadBarcode() {
  const { value } = await Preferences.get({ key: "barcode" });
  if (value) {
    barcode.value = value;
  }
}

async function saveBarcode() {
  await Preferences.set({ key: "barcode", value: membershipId.value });
}

async function deleteBarcode() {
  barcode.value = Array(6);
  barcodeIndex.value = 0;
  await Preferences.remove({ key: "barcode" });
}
</script>

<template>
  <header>
    <h1>GHF Express</h1>
  </header>

  <main>
    <p>{{ instructions }}</p>
    <Transition name="push">
      <Barcode v-if="barcodeIsValid" @delete="deleteBarcode" />
      <KeyPad
        v-else
        :barcode="barcode"
        :barcodeIndex="barcodeIndex"
        @backspace="backspace"
        @key="keyEntered"
      />
    </Transition>
  </main>

  <footer>
    <a href="https://github.com/SpiffyCloud/ghf-express" target="_blank"
      >GHF Express v1.0.0 | SpiffyCloud</a
    >
  </footer>

  <div class="theme">
    <GraphicTopBottom />
    <GraphicTopTop />
    <GraphicBottomBottom />
    <GraphicBottomTop />
  </div>
</template>

<style>
:root {
  --color-primary: #093565;
  --color-secondary: white;
  --color-field: #072d54;
  --color-button: rgba(255, 255, 255, 0.25);
  --color-button-press: rgba(255, 255, 255, 0.5);
  --color-danger: indianred;
  --color-button-danger: rgba(205, 92, 92, 0.5);
  --theme-top: #0046ad;
  --theme-bottom: #04387c;
}

body {
  padding: 0;
  margin: 0;
  background-color: var(--color-primary);
}

#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: var(--color-secondary);
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-top: 2rem;
}

h1 {
  margin: 0;
  padding-top: 2rem;
}

p {
  padding-top: 4rem;
}

@media screen and (min-height: 896px) {
  h1 {
    padding-top: 4rem;
  }

  p {
    padding-top: 6rem;
    font-size: 1.25rem;
  }
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

a {
  display: block;
  color: var(--color-button-press);
  width: 100%;
  font-size: 0.75rem;
  text-decoration: none;
  margin: 1.5rem auto;
}

.theme {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
}

.theme svg {
  position: absolute;
}

.push-enter-from {
  opacity: 0;
}

.push-enter-to {
  opacity: 1;
}
.push-enter-active {
  transition: all ease-out 3s;
}

.push-leave-from {
  opacity: 1;
}

.push-leave-to {
  opacity: 0;
}

.push-leave-active {
  transition: all ease-out 3s;
}
</style>
