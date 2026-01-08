<template>
  <div class="yaml-editor">
    <h2>YAML Formatter & Preview</h2>
    
    <!-- Input Area -->
    <div class="input-section">
      <label for="yaml-input">Enter YAML:</label>
      <textarea
        id="yaml-input"
        v-model="rawYaml"
        placeholder="Paste your YAML here..."
        spellcheck="false"
      ></textarea>
    </div>

    <!-- Output Area -->
    <div class="output-section">
      <label>Formatted YAML:</label>
      <pre v-if="formattedYaml" class="formatted-output"><code>{{ formattedYaml }}</code></pre>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="placeholder">Formatted output will appear here...</div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading">Processing...</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Reactive state
const rawYaml = ref('')
const formattedYaml = ref('')
const error = ref('')
const loading = ref(false)

// Initialize Pyodide once
let pyodidePromise = null

async function initPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = import('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js')
      .then(async ({ loadPyodide }) => {
        const pyodide = await loadPyodide()
        // Install PyYAML package
        await pyodide.loadPackage('micropip')
        const micropip = pyodide.pyimport('micropip')
        await micropip.install('PyYAML')
        return pyodide
      })
  }
  return pyodidePromise
}

// Process YAML whenever input changes
watch(rawYaml, async (newYaml) => {
  if (!newYaml.trim()) {
    formattedYaml.value = ''
    error.value = ''
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const pyodide = await initPyodide()
    
    // Run Python code in Pyodide
    const result = pyodide.runPython(`
      import yaml
      import sys
      
      # Capture stdout
      from io import StringIO
      old_stdout = sys.stdout
      sys.stdout = captured_output = StringIO()
      
      try:
          # Parse and re-dump YAML with proper formatting
          data = yaml.safe_load('''${newYaml.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')
          yaml.dump(data, sys.stdout, 
                    default_flow_style=False, 
                    indent=2,
                    width=1000,
                    allow_unicode=True)
          result = captured_output.getvalue()
      except Exception as e:
          print(f"ERROR: {str(e)}")
          result = None
      finally:
          sys.stdout = old_stdout
      
      result
    `)
    
    if (result === null) {
      // Error message is captured in stdout when exception occurs
      const errorMsg = pyodide.globals.get('captured_output').getvalue()
      error.value = errorMsg.replace('ERROR: ', '')
    } else {
      formattedYaml.value = result
    }
  } catch (err) {
    console.error('Pyodide error:', err)
    error.value = 'Failed to process YAML. Check console for details.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.yaml-editor {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.input-section,
.output-section {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

.formatted-output {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  overflow-x: auto;
  white-space: pre;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
}

.error {
  color: #d32f2f;
  padding: 12px;
  background-color: #ffebee;
  border-radius: 4px;
  font-family: monospace;
}

.placeholder {
  color: #666;
  font-style: italic;
  padding: 15px 0;
}

.loading {
  text-align: center;
  color: #1976d2;
  font-style: italic;
}
</style>