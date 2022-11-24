<script setup>
const emit = defineEmits(["delete"]);
</script>

<template>
  <div class="barcode-container">
    <div class="barcode-sticker">
      <svg class="barcode"></svg>
    </div>
  </div>
  <button @click="emit('delete')" class="button">Delete</button>
</template>

<style>
.barcode-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.barcode-sticker {
  background-color: var(--color-secondary);
  margin: 0 auto;
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: calc(100% - 4rem);
  max-width: 20rem;
  box-shadow: 0px 16px 16px rgba(0, 0, 0, 0.4);
}

.barcode-sticker svg {
  width: 100%;
  height: 100%;
}

.button {
  color: var(--color-danger);
  font-family: inherit;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  margin: 0 auto;
  margin-bottom: 2rem;
  transition: background ease-out 100ms;
}

.button:active {
  background-color: var(--color-button-danger);
}

@media screen and (min-height: 896px) {
  .button {
    font-size: 1.25rem;
  }
}
</style>
