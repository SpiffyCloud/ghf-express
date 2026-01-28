<template>
  <div class="background-shape background-shape-top">
    <svg
      viewBox="0 0 881 540"
      fill="none"
      class="background-shape-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.759426 0L0.759399 540C487.417 540 755.777 370 880.759 0.000136538L0.759426 0Z"
        class="background-shape-primary"
      />
      <path
        d="M0.759426 0L0.75946 436C316.378 338.808 490.665 203.467 578.759 0.000106021L0.759426 0Z"
        class="background-shape-secondary"
      />
    </svg>
  </div>
  <div class="background-shape background-shape-bottom">
    <svg
      viewBox="0 0 925 496"
      fill="none"
      class="background-shape-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M924.128 496V0C413.138 0 131.36 156.148 0.128174 496H924.128Z"
        class="background-shape-primary"
      />
      <path
        d="M924.128 496V95C587.892 95 402.48 221.241 316.128 496H924.128Z"
        class="background-shape-secondary"
      />
    </svg>
  </div>
</template>

<style scoped>
.background-shape {
  position: absolute;
  max-width: 75vw;
  max-height: 25vh;
}

.background-shape-top {
  top: 0;
  left: 0;
}

.background-shape-bottom {
  bottom: 0;
  right: 0;
}

.background-shape-svg {
  width: 100%;
}

.background-shape-primary {
  fill: var(--ion-color-secondary);
}

.background-shape-secondary {
  fill: var(--ion-color-tertiary);
}
</style>
