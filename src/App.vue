<script setup>
import { onMounted } from 'vue';
import JsBarcode from 'jsbarcode';

onMounted(() => {
  const membershipID = "288936";
  JsBarcode("#barcode", membershipID, {
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
});
</script>

<template>
  <header>
    <h1>GHF Express</h1>
  </header>

  <main>
    <p>Scan this card to check into the club</p>
    <div id="barcode-container">
      <img id="barcode" />
    </div>
    <button>Delete Barcode</button>
  </main>

  <footer>
    <a href="https://github.com/SpiffyCloud/ghf-express" target="_blank">GHF Express v1.0.0 | Made by SpiffyCloud</a>
  </footer>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
}

#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background-color: #093565;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h1 {
  color: white;
  background-color: #5DBB61;
  margin: 0;
  padding: 1rem;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex-grow: 1;
}

#barcode-container {
  width: calc(100% - 4rem);
  max-width: 20rem;
  height: 10rem;
  background-color: white;
  margin: 0 auto;
  border-radius: .5rem;
  padding: .5rem;
}

#barcode-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

button {
  background-color: indianred;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  margin: 0 auto;
  color: inherit;
  border-radius: .5rem;
}

a {
  display: block;
  color: inherit;
  width: 100%;
  font-size: .75rem;
  text-decoration: none;
  margin: .75rem auto;
}
</style>
