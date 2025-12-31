<template>
  <div class="mermaid-preview">
    <div class="editor-container">
      <label for="mermaid-editor">Mermaid Code:</label>
      <textarea
        id="mermaid-editor"
        v-model="code"
        placeholder="Enter Mermaid code here..."
        spellcheck="false"
      ></textarea>
    </div>

    <div class="preview-container">
      <label>Diagram Preview:</label>
      <div 
        ref="diagramContainer" 
        class="diagram-container"
        :class="{ 'error': error }"
      >
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else-if="!code.trim()" class="placeholder">
          Enter Mermaid code to preview
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Reactive state
const code = ref(`graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Action 1]
  B -->|No| D[Action 2]
  C --> E[End]
  D --> E`)
const error = ref(null)
const diagramContainer = ref(null)

// Initialize Mermaid
let mermaidInstance = null

async function initMermaid() {
  if (!mermaidInstance) {
    // Dynamically import Mermaid
    const mermaid = await import('mermaid')
    mermaid.default.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })
    mermaidInstance = mermaid.default
  }
}

// Render diagram
async function renderDiagram() {
  if (!diagramContainer.value) return
  
  // Clear container
  diagramContainer.value.innerHTML = ''
  error.value = null

  if (!code.value.trim()) return

  try {
    await initMermaid()
    const { svg } = await mermaidInstance.render('mermaid-diagram', code.value)
    diagramContainer.value.innerHTML = svg
  } catch (err) {
    console.error('Mermaid render error:', err)
    error.value = err.message || 'Invalid Mermaid syntax'
  }
}

// Watch for code changes (with debounce)
let debounceTimer = null
watch(code, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(renderDiagram, 500)
})

// Initial render on mount
onMounted(renderDiagram)
</script>

<style scoped>
.mermaid-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .mermaid-preview {
    flex-direction: row;
  }
}

.editor-container,
.preview-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

label {
  padding: 12px 16px;
  background: #4a6cf7;
  color: white;
  font-weight: bold;
}

textarea {
  width: 100%;
  height: 400px;
  padding: 16px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  border: none;
  resize: none;
  box-sizing: border-box;
}

.diagram-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.placeholder,
.error-message {
  color: #666;
  padding: 20px;
}

.error {
  background-color: #ffebee;
}

.error-message {
  color: #d32f2f;
  font-weight: 500;
}
</style>