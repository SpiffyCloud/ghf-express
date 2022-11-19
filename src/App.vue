<script setup>
import { onMounted, onUpdated, ref, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { Dialog } from '@capacitor/dialog';
import JsBarcode from 'jsbarcode';

"use strict";

const barcode = ref(null);

onMounted(async () => {
  loadBarcode();
});

watch(barcode, renderBarcode, { flush: 'post' })

async function loadBarcode() {
  const { value } = await Preferences.get({ key: 'barcode' });
  if (value) {
    barcode.value = value;
  }
}

async function saveBarcode() {
  await Preferences.set({ key: 'barcode', value: barcode.value });
}

async function deleteBarcode() {
  barcode.value = null;
  await Preferences.remove({ key: 'barcode' });
}

async function askForBarcode() {
  const { value } = await Dialog.prompt({
    message: `What's membership number?`,
  });
  // test value exists and its six digits
  if (value && /^\d{6}$/.test(value)) {
    barcode.value = value;
    saveBarcode();
  }
  else {
    await Dialog.alert({
      message: `Invalid membership number`,
    });
  }
}

// function to generate barcode
function renderBarcode() {
  if (barcode.value) {
    JsBarcode('#barcode', barcode.value, {
      format: "CODE39",
      width: 2,
      height: 100,
      displayValue: true,
      fontOptions: "",
      font: "monospace",
      textAlign: "center",
      textPosition: "top",
      textMargin: 2,
      fontSize: 20,
      background: "#ffffff",
      lineColor: "#000000",
      margin: 10,
    });
  }
};
</script>

<template>
  <header>
    <h1>GHF Express</h1>
  </header>

  <main v-if="!barcode">
    <button @click="askForBarcode">Enter Barcode</button>
  </main>

  <main v-else>
    <p>Scan this card to check into the club</p>
    <div id="barcode-container">
      <img id="barcode" />
    </div>
    <button @click="deleteBarcode">Delete Barcode</button>
  </main>

  <footer>
    <a href="https://github.com/SpiffyCloud/ghf-express" target="_blank">GHF Express v1.0.0 | SpiffyCloud</a>
  </footer>
</template>

<style>
body {
  background-color: #5DBB61;
  padding: 0;
  margin: 0;
}

#app {
  font-family: sans-serif;
  text-align: center;
  background-color: #093565;
  color: white;
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

h1 {
  background-color: #5DBB61;
  margin: 0;
  padding: .5rem;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-grow: 1;
}

#barcode-container {
  background-color: white;
  margin: 0 auto;
  border-radius: .5rem;
  padding: .5rem;
  width: calc(100% - 4rem);
  max-width: 20rem;
}

#barcode-container img {
  width: 100%;
  height: 100%;
}

button {
  background-color: indianred;
  border: none;
  color: inherit;
  font-size: 1rem;
  border-radius: .5rem;
  padding: 1rem 1.5rem;
  margin: 0 auto;
}

a {
  display: block;
  color: inherit;
  width: 100%;
  font-size: .75rem;
  text-decoration: none;
  margin: 1.5rem auto;
}
</style>
