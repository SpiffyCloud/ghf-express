<template>
  <button
    v-bind="$attrs"
    class="icon-button"
    :aria-label="ariaLabel"
    :disabled="disabled"
    type="button"
    @click="emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    ariaLabel: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  (event: "click", value: MouseEvent): void;
}>();
</script>

<style scoped>
.icon-button {
  padding: 1rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  background: transparent;
  border: none;
  transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

.icon-button:active {
  transform: scale(0.95);
  background-color: var(--ion-color-secondary);
}

.icon-button:disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
