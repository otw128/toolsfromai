<template>
  <div class="yaml-container">
    <h2>YAML Formatter & Preview</h2>

    <div class="editor">
      <textarea
        v-model="rawYaml"
        placeholder="Paste YAML here..."
        @input="formatYaml"
      ></textarea>
    </div>

    <div class="actions">
      <button @click="formatYaml">Format</button>
      <button @click="clear">Clear</button>
    </div>

    <div class="error" v-if="error">
      ❌ {{ error }}
    </div>

    <div class="preview" v-if="formattedYaml">
      <h3>Formatted YAML</h3>
      <pre>{{ formattedYaml }}</pre>
    </div>

    <div class="preview" v-if="parsedObject">
      <h3>Parsed Preview (JSON)</h3>
      <pre>{{ parsedObject }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import yaml from 'js-yaml'

const rawYaml = ref('')
const formattedYaml = ref('')
const parsedObject = ref('')
const error = ref('')

const formatYaml = () => {
  error.value = ''
  formattedYaml.value = ''
  parsedObject.value = ''

  if (!rawYaml.value.trim()) return

  try {
    const obj = yaml.load(rawYaml.value)
    formattedYaml.value = yaml.dump(obj, {
      indent: 2,
      lineWidth: 80,
      noRefs: true
    })
    parsedObject.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    error.value = e.message
  }
}

const clear = () => {
  rawYaml.value = ''
  formattedYaml.value = ''
  parsedObject.value = ''
  error.value = ''
}
</script>

<style scoped>
.yaml-container {
  max-width: 1000px;
  margin: auto;
  font-family: system-ui, sans-serif;
}

.editor textarea {
  width: 100%;
  height: 220px;
  font-family: monospace;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.actions {
  margin: 12px 0;
}

button {
  margin-right: 8px;
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.preview {
  margin-top: 16px;
}

pre {
  background: #0f172a;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
}

.error {
  color: #dc2626;
  margin-top: 10px;
}
</style>
