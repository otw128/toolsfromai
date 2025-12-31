<template>
  <div class="mermaid-container">
    <div v-if="svgContent" v-html="svgContent" class="mermaid-svg"></div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import mermaid from 'mermaid';

// 1. Define Props
const props = defineProps({
  code: {
    type: String,
    required: true,
    default: 'graph TD\nA[Start] --> B[End]'
  }
});

// 2. State
const svgContent = ref('');
const error = ref(null);

// 3. Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default', // Options: 'default', 'forest', 'dark', 'neutral'
  securityLevel: 'loose',
});

// 4. Rendering Logic
const renderDiagram = async () => {
  try {
    // Reset error state
    error.value = null;

    // Validate syntax first (optional but prevents console spam)
    await mermaid.parse(props.code);

    // Generate a unique ID for the diagram rendering process
    const id = `mermaid-${Date.now()}`;
    
    // Render the SVG
    // mermaid.render returns an object { svg } in v10+
    const { svg } = await mermaid.render(id, props.code);
    
    svgContent.value = svg;

  } catch (e) {
    // If syntax is invalid, display the error
    svgContent.value = ''; // Clear the diagram
    error.value = e.message;
    console.warn('Mermaid Syntax Error:', e);
  }
};

// 5. Watchers
// Watch for changes in the code prop and re-render
watch(() => props.code, renderDiagram);

// Render on initial mount
onMounted(renderDiagram);
</script>

<style scoped>
.mermaid-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.mermaid-svg {
  max-width: 100%;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  width: 100%;
}
</style>