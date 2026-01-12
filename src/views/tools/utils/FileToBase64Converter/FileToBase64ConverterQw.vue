<template>
  <div class="converter-container">
    <!-- File to Base64 Section -->
    <section class="card">
      <h2>File to Base64</h2>
      <input 
        type="file" 
        @change="handleFileUpload" 
        accept="*/*"
        class="file-input"
      />
      <div v-if="base64Result" class="result">
        <h3>Base64 Result:</h3>
        <textarea 
          v-model="base64Result" 
          readonly
          rows="5"
          cols="80"
        ></textarea>
        <div class="button-group">
          <button @click="copyToClipboard(base64Result)">Copy</button>
          <button @click="clearBase64">Clear</button>
        </div>
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
    </section>

    <!-- Base64 to File Section -->
    <section class="card">
      <h2>Base64 to File</h2>
      <textarea 
        v-model="base64Input"
        placeholder="Paste Base64 string here (e.g., data:image/png;base64,...)"
        rows="5"
        cols="80"
        class="base64-input"
      ></textarea>
      <div class="button-group">
        <button 
          @click="convertBase64ToFile" 
          :disabled="!base64Input"
        >
          Convert to File
        </button>
        <button 
          @click="clearBase64Input"
          :disabled="!base64Input"
        >
          Clear
        </button>
      </div>
      
      <div v-if="downloadUrl" class="download-section">
        <h3>Download File:</h3>
        <a 
          :href="downloadUrl" 
          :download="suggestedFilename"
          class="download-link"
        >
          {{ suggestedFilename }}
        </a>
        <button @click="revokeDownloadUrl" class="revoke-btn">
          Clear Download
        </button>
      </div>
      
      <div v-if="conversionError" class="error">
        {{ conversionError }}
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// File to Base64
const base64Result = ref('')
const error = ref('')

// Base64 to File
const base64Input = ref('')
const downloadUrl = ref('')
const suggestedFilename = ref('')
const conversionError = ref('')

// File to Base64 Conversion
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  base64Result.value = ''
  error.value = ''
  
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    base64Result.value = e.target.result
  }
  reader.onerror = () => {
    error.value = 'Failed to read file'
  }
  reader.readAsDataURL(file)
}

// Base64 to File Conversion
const convertBase64ToFile = () => {
  conversionError.value = ''
  downloadUrl.value = ''
  
  try {
    // Validate Base64 format
    if (!base64Input.value.startsWith('data:')) {
      throw new Error('Invalid Base64 format. Must start with "data:"')
    }

    // Extract MIME type and base64 data
    const [header, base64Data] = base64Input.value.split(',')
    if (!header || !base64Data) {
      throw new Error('Invalid Base64 format')
    }

    const mimeTypeMatch = header.match(/data:(.*?);base64/)
    if (!mimeTypeMatch) {
      throw new Error('Unable to detect MIME type')
    }

    const mimeType = mimeTypeMatch[1]
    
    // Decode Base64
    const byteString = atob(base64Data)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    // Create Blob and URL
    const blob = new Blob([uint8Array], { type: mimeType })
    downloadUrl.value = URL.createObjectURL(blob)
    
    // Generate filename
    const extension = mimeType.split('/')[1] || 'bin'
    const timestamp = Date.now()
    suggestedFilename.value = `converted_file_${timestamp}.${extension}`
    
  } catch (err) {
    conversionError.value = `Conversion failed: ${err.message}`
    console.error(err)
  }
}

// Utility Functions
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    alert('Failed to copy to clipboard')
  }
}

const clearBase64 = () => {
  base64Result.value = ''
  error.value = ''
}

const clearBase64Input = () => {
  base64Input.value = ''
  conversionError.value = ''
}

const revokeDownloadUrl = () => {
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = ''
    suggestedFilename.value = ''
  }
}

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value)
  }
})
</script>

<style scoped>
.converter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  color: #333;
  margin-top: 0;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.file-input, .base64-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}

.button-group {
  margin: 15px 0;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background-color: #1565c0;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result, .error {
  margin-top: 15px;
  padding: 12px;
  border-radius: 4px;
}

.result {
  background-color: #e8f4fc;
  border: 1px solid #b3daff;
}

.error {
  background-color: #ffeaea;
  border: 1px solid #ffcaca;
  color: #d32f2f;
}

.download-section {
  margin-top: 15px;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 4px;
  border: 1px solid #a5d6a7;
}

.download-link {
  display: inline-block;
  padding: 8px 12px;
  background: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-right: 10px;
}

.download-link:hover {
  background: #388e3c;
}

.revoke-btn {
  background-color: #f44336;
}

.revoke-btn:hover {
  background-color: #d32f2f;
}
</style>