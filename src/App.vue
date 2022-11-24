<script setup>
import { onMounted, ref, computed } from "vue";
import { Preferences } from "@capacitor/preferences";
import Barcode from "@/components/Barcode.vue";
import KeyPad from "@/components/KeyPad.vue";
import GraphicBottomBottom from "@/components/graphics/GraphicBottomBottom.vue";
import GraphicBottomTop from "@/components/graphics/GraphicBottomTop.vue";
import GraphicTopBottom from "@/components/graphics/GraphicTopBottom.vue";
import GraphicTopTop from "@/components/graphics/GraphicTopTop.vue";

onMounted(async () => {
  loadBarcode();
});

async function loadBarcode() {
  const { value } = await Preferences.get({ key: "barcode" });
  if (value) {
    barcode.value = value;
    hasBarcode.value = true;
  }
}

async function deleteBarcode() {
  barcode.value = Array(6);
  barcodeIndex.value = 0;
  hasBarcode.value = false;
  await Preferences.remove({ key: "barcode" });
}

const hasBarcode = ref(false);
const barcode = ref(Array(6));
const barcodeIndex = ref(0);

const barcodeIsValid = computed(() => {
  return !barcode.value.includes(undefined);
});

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
</script>

<template>
  <header>
    <h1>GHF Express</h1>
  </header>

  <Transition :name="hasBarcode ? '' : 'fade'" mode="out-in">
    <Barcode
      v-if="barcodeIsValid"
      instructions="Scan the barcode to check into the club"
      :barcode="barcode"
      @delete="deleteBarcode"
    />
    <KeyPad
      v-else
      instructions="Enter your 6-digit membership ID"
      :barcode="barcode"
      :barcodeIndex="barcodeIndex"
      @backspace="backspace"
      @key="keyEntered"
    />
  </Transition>

  <footer>
    <a href="https://github.com/SpiffyCloud/ghf-express" target="_blank">
      GHF Express v1.0.0 | SpiffyCloud
    </a>
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

@media screen and (min-height: 896px) {
  h1 {
    padding-top: 4rem;
  }
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

a {
  display: block;
  color: var(--color-button-press);
  width: 75%;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
