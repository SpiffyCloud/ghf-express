<script setup>
import { computed } from "@vue/reactivity";
const emit = defineEmits(["key", "backspace"]);
const props = defineProps(["barcode", "barcodeIndex", "instructions"]);

const disableBackspace = computed(() => props.barcodeIndex === 0);

function keyEntered(event) {
  emit("key", event.target.textContent);
}
</script>

<template>
  <main>
    <p>{{ instructions }}</p>
    <div class="digits">
      <div class="digits-text" v-for="(digit, index) in barcode" :key="index">
        {{ digit }}
      </div>
    </div>
    <div class="keypad">
      <div @click="keyEntered" class="keypad__key">1</div>
      <div @click="keyEntered" class="keypad__key">2</div>
      <div @click="keyEntered" class="keypad__key">3</div>
      <div @click="keyEntered" class="keypad__key">4</div>
      <div @click="keyEntered" class="keypad__key">5</div>
      <div @click="keyEntered" class="keypad__key">6</div>
      <div @click="keyEntered" class="keypad__key">7</div>
      <div @click="keyEntered" class="keypad__key">8</div>
      <div @click="keyEntered" class="keypad__key">9</div>
      <div class="keypad__key empty"></div>
      <div @click="keyEntered" class="keypad__key">0</div>
      <div
        @click="emit('backspace')"
        :class="{ disabled: disableBackspace }"
        class="keypad__key backspace"
      >
        &#9003;
      </div>
    </div>
  </main>
</template>

<style>
.digits {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  justify-content: center;
  padding: 0 1rem;
}

.digits-text {
  color: inherit;
  border-radius: 0.5rem;
  background-color: var(--color-field);
  box-shadow: inset 0px 6px 8px rgba(0, 0, 0, 0.4);
  font-size: 3rem;
  width: 3.25rem;
  height: 4.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (min-height: 896px) {
  .digits-text {
    font-size: 3.5rem;
    width: 4rem;
    height: 5rem;
  }
}

.keypad {
  height: 33vh;
  min-height: 10rem;
  max-height: 50vh;
  max-width: 50rem;
  width: calc(100% - 1rem);
  justify-self: center;
  margin: 0 auto;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.25rem 0.25rem;
}

.keypad__key {
  font-size: 2.5rem;
  background-color: var(--color-button);
  backdrop-filter: blur(1rem);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background ease-out 100ms;
}

.keypad__key:active {
  background-color: var(--color-button-press);
}

.keypad__key.empty,
.keypad__key.backspace {
  background: none;
  backdrop-filter: none;
}

.keypad__key.backspace.disabled {
  pointer-events: none;
  color: var(--color-button-press);
}

.backspace:active {
  background: var(--color-danger);
}

@media screen and (max-height: 896px) {
  .keypad__key.backspace {
    font-size: 2rem;
  }
}

p {
  padding-top: 4rem;
}

@media screen and (min-height: 896px) {
  p {
    padding-top: 6rem;
    font-size: 1.25rem;
  }
}
</style>
