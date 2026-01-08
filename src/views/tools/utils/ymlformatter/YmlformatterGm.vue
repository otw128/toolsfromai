<template>
  <div class="yaml-container">
    <div class="header">
      <h2>YAML Formatter & Preview (JS)</h2>
      <div class="controls">
        <button @click="formatYaml" :disabled="!isValid">Format / Pretty Print</button>
        <span v-if="error" class="status error">Invalid YAML</span>
        <span v-else class="status success">Valid YAML</span>
      </div>
    </div>

    <div class="editor-layout">
      <div class="pane input-pane">
        <h3>Input</h3>
        <textarea 
          v-model="rawYaml" 
          placeholder="Paste messy YAML here..."
          spellcheck="false"
        ></textarea>
      </div>

      <div class="pane preview-pane">
        <h3>Formatted Preview</h3>
        <pre><code class="language-yaml" v-html="highlightedYaml"></code></pre>
      </div>
    </div>
    
    <div v-if="error" class="error-log">
      {{ error.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import yaml from 'js-yaml';
import hljs from 'highlight.js/lib/core';
import yamlLang from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/atom-one-dark.css'; // Import a theme

// Register YAML language for highlighting
hljs.registerLanguage('yaml', yamlLang);

const rawYaml = ref('foo: bar\nlist:\n- item1\n-   item2');
const formattedYaml = ref('');
const error = ref(null);

// Check validity continuously
const isValid = computed(() => error.value === null);

// Function to safely parse and highlight
const processYaml = () => {
  try {
    // 1. Parse string to JS Object (Validates syntax)
    const obj = yaml.load(rawYaml.value);
    
    // 2. If valid, error is cleared
    error.value = null;

    // 3. Just highlighting the raw input for now (real-time preview)
    // If you want the preview to ALWAYS be formatted, skip to step 4.
    const code = hljs.highlight(rawYaml.value, { language: 'yaml' }).value;
    return code;
  } catch (e) {
    error.value = e;
    // Return un-highlighted raw text on error to avoid UI jumping
    return rawYaml.value; // Or escapeHtml(rawYaml.value)
  }
};

const highlightedYaml = computed(() => {
    if (!rawYaml.value) return '';
    
    // If we want to show the Formatted version constantly:
    // return hljs.highlight(formattedYaml.value || rawYaml.value, { language: 'yaml' }).value;
    
    // If we want to highlight exactly what the user types (until they click Format):
    if (error.value) return rawYaml.value;
    return hljs.highlight(rawYaml.value, { language: 'yaml' }).value;
});

// The "Format" button action
const formatYaml = () => {
  try {
    const obj = yaml.load(rawYaml.value);
    // Dump converts JS Object back to clean YAML string
    const cleanYaml = yaml.dump(obj, {
      indent: 2,
      lineWidth: 80,
      noRefs: true
    });
    
    rawYaml.value = cleanYaml; // Update input to match formatted
  } catch (e) {
    error.value = e;
  }
};

// Initial check
watch(rawYaml, () => {
  try {
    yaml.load(rawYaml.value);
    error.value = null;
  } catch (e) {
    error.value = e;
  }
});
</script>

<style scoped>
.yaml-container {
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-layout {
  display: flex;
  gap: 20px;
  height: 600px;
}

.pane {
  flex: 1;
  display: flex;
  flex-direction: column;
}

textarea {
  flex: 1;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 1px solid #333;
  padding: 10px;
  font-family: monospace;
  resize: none;
  border-radius: 4px;
}

pre {
  flex: 1;
  margin: 0;
  background: #282c34;
  border-radius: 4px;
  overflow: auto;
  padding: 10px;
}

code {
  font-family: monospace;
}

.status {
  margin-left: 10px;
  font-weight: bold;
}

.status.error { color: #ff6b6b; }
.status.success { color: #51cf66; }

.error-log {
  margin-top: 10px;
  padding: 10px;
  background: #fff0f0;
  color: #d63031;
  border: 1px solid #fab1a0;
  border-radius: 4px;
  font-family: monospace;
}
</style>