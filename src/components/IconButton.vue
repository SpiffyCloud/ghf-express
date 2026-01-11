<template>
  <button
    v-bind="$attrs"
    class="p-4 rounded-xl! flex items-center justify-center active:scale-95 active:bg-navy-800 touch-manipulation disabled:pointer-events-none disabled:opacity-40"
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
