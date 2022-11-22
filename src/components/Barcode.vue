<script setup>
const emit = defineEmits('delete')
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
  border-radius: .5rem;
  padding: .5rem;
  width: calc(100% - 4rem);
  max-width: 20rem;
}

.barcode-sticker svg {
  width: 100%;
  height: 100%;
}

.button {
  color: var(--color-danger);
  background-color: transparent;
  border: none;
  font-size: 1rem;
  border-radius: .5rem;
  padding: 1rem 2rem;
  margin: 0 auto;
  margin-bottom: 2rem;
}

.button:active {
  background-color: var(--color-button-danger);
}
</style>