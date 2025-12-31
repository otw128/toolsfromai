<template>
  <div class="mermaid-preview">
    <textarea
      v-model="code"
      class="editor"
      placeholder="Write Mermaid diagram here..."
    />

    <div class="preview">
      <div ref="mermaidEl" class="mermaid"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import mermaid from "mermaid"

const mermaidEl = ref(null)

const code = ref(`
graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Ship it 🚀]
  B -- No --> D[Fix it 🔧]
  D --> B
`)

mermaid.initialize({
  startOnLoad: false,
  theme: "default", // "dark" | "forest" | "neutral"
})

const renderMermaid = async () => {
  if (!mermaidEl.value) return

  try {
    const id = "mermaid-" + Math.random().toString(36).slice(2)
    const { svg } = await mermaid.render(id, code.value)
    mermaidEl.value.innerHTML = svg
  } catch (err) {
    mermaidEl.value.innerHTML = `
      <pre style="color:red; white-space: pre-wrap;">
${err.message}
      </pre>
    `
  }
}

onMounted(renderMermaid)

watch(code, renderMermaid)
</script>

<style scoped>
.mermaid-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 100%;
}

.editor {
  width: 100%;
  height: 100%;
  min-height: 300px;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
}

.preview {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  overflow: auto;
  border: 1px solid #ddd;
}
</style>
