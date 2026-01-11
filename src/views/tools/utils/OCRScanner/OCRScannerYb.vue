<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <p>This Vue component was automatically created.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('OCRScanner - Yb')
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
}
</style>
