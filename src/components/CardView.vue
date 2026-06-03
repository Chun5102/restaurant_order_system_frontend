<template>
  <div class="card-grid">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 40rem;
}
</style>
