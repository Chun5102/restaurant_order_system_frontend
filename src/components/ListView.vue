<template>
  <div class="menu-list">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 40rem;
}
</style>
