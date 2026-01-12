<template>
  <div class="file-converter-container">
    <h2>File ↔ Base64 Converter</h2>
    
    <!-- Tabs -->
    <div class="tabs">
      <button 
        @click="activeTab = 'fileToBase64'" 
        :class="{ active: activeTab === 'fileToBase64' }"
      >
        File to Base64
      </button>
      <button 
        @click="activeTab = 'base64ToFile'" 
        :class="{ active: activeTab === 'base64ToFile' }"
      >
        Base64 to File
      </button>
    </div>

    <!-- File to Base64 Section -->
    <div v-show="activeTab === 'fileToBase64'" class="conversion-section">
      <div class="upload-section">
        <input 
          type="file" 
          ref="fileInput"
          @change="handleFileUpload"
          accept="*/*"
        />
        
        <button @click="triggerFileInput" :disabled="isUploading">
          {{ isUploading ? 'Converting...' : 'Select File' }}
        </button>
      </div>

      <div v-if="fileInfo" class="file-info">
        <p><strong>File Name:</strong> {{ fileInfo.name }}</p>
        <p><strong>File Size:</strong> {{ formatFileSize(fileInfo.size) }}</p>
        <p><strong>File Type:</strong> {{ fileInfo.type || 'Unknown' }}</p>
      </div>

      <div v-if="base64Result" class="result-section">
        <h3>Base64 Result:</h3>
        <textarea 
          v-model="base64Result" 
          readonly 
          class="base64-textarea"
        ></textarea>
        
        <button @click="copyToClipboard" class="action-button">
          {{ copyButtonText }}
        </button>
      </div>
    </div>

    <!-- Base64 to File Section -->
    <div v-show="activeTab === 'base64ToFile'" class="conversion-section">
      <div class="input-section">
        <label for="base64Input">Base64 String:</label>
        <textarea 
          id="base64Input"
          v-model="base64Input"
          placeholder="Paste base64 string here..."
          class="base64-textarea"
        ></textarea>
      </div>

      <div class="filename-section">
        <label for="fileName">File Name:</label>
        <input 
          id="fileName"
          v-model="fileName"
          type="text"
          placeholder="example.jpg"
          class="filename-input"
        />
      </div>

      <div class="button-section">
        <button 
          @click="convertBase64ToFile" 
          :disabled="isConverting || !base64Input"
          class="convert-button"
        >
          {{ isConverting ? 'Converting...' : 'Convert & Download' }}
        </button>
      </div>

      <div v-if="convertedFileInfo" class="file-info">
        <p><strong>Converted File:</strong> {{ convertedFileInfo.name }}</p>
        <p><strong>File Size:</strong> {{ formatFileSize(convertedFileInfo.size) }}</p>
        <p><strong>MIME Type:</strong> {{ convertedFileInfo.type || 'Unknown' }}</p>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('fileToBase64')
const fileInput = ref(null)
const fileInfo = ref(null)
const base64Result = ref('')
const base64Input = ref('')
const fileName = ref('')
const convertedFileInfo = ref(null)
const isUploading = ref(false)
const isConverting = ref(false)
const error = ref('')
const copyButtonText = ref('Copy to Clipboard')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  
  if (!file) return
  
  isUploading.value = true
  error.value = ''
  base64Result.value = ''
  
  // Store file info
  fileInfo.value = {
    name: file.name,
    size: file.size,
    type: file.type
  }
  
  // Convert file to base64
  const reader = new FileReader()
  
  reader.onload = (e) => {
    base64Result.value = e.target.result
    isUploading.value = false
  }
  
  reader.onerror = () => {
    error.value = 'Error reading file'
    isUploading.value = false
  }
  
  reader.readAsDataURL(file)
}

const convertBase64ToFile = () => {
  try {
    isConverting.value = true
    error.value = ''
    
    // Remove data URL prefix if present
    let base64Data = base64Input.value.trim()
    let mimeType = 'application/octet-stream'
    
    // Extract MIME type from data URL
    const dataUrlMatch = base64Data.match(/^data:([^;]+);base64,/)
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1]
      base64Data = base64Data.substring(dataUrlMatch[0].length)
    }
    
    // Decode base64
    const byteString = atob(base64Data)
    const byteArray = new Uint8Array(byteString.length)
    
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i)
    }
    
    // Create blob and file
    const blob = new Blob([byteArray], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    // Set default filename if not provided
    let downloadFileName = fileName.value.trim()
    if (!downloadFileName) {
      // Try to guess extension from MIME type
      const extensionMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'application/json': 'json',
        'text/html': 'html',
        'application/zip': 'zip'
      }
      downloadFileName = `converted_file.${extensionMap[mimeType] || 'bin'}`
    }
    
    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = downloadFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    // Store converted file info
    convertedFileInfo.value = {
      name: downloadFileName,
      size: blob.size,
      type: mimeType
    }
    
    isConverting.value = false
    
  } catch (err) {
    error.value = 'Invalid base64 string. Please check your input.'
    isConverting.value = false
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(base64Result.value)
    .then(() => {
      copyButtonText.value = 'Copied!'
      setTimeout(() => {
        copyButtonText.value = 'Copy to Clipboard'
      }, 2000)
    })
    .catch(() => {
      error.value = 'Failed to copy to clipboard'
    })
}
</script>

<style scoped>
.file-converter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.tabs button {
  background-color: transparent;
  color: #666;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.tabs button:hover {
  background-color: #f5f5f5;
}

.tabs button.active {
  background-color: #4CAF50;
  color: white;
}

.conversion-section {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.upload-section,
.input-section,
.filename-section,
.button-section {
  margin-bottom: 20px;
}

input[type="file"] {
  display: none;
}

button {
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed;
}

.action-button,
.convert-button {
  background-color: #4CAF50;
  margin-top: 10px;
}

.action-button:hover,
.convert-button:hover {
  background-color: #45a049;
}

.base64-textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
  margin-top: 5px;
}

.filename-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 5px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.file-info {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #4CAF50;
}

.file-info p {
  margin: 5px 0;
  color: #666;
}

.result-section {
  margin-top: 20px;
}

.result-section h3 {
  color: #333;
  margin-bottom: 10px;
}

.error-message {
  color: #f44336;
  background-color: #ffebee;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  border-left: 4px solid #f44336;
}
</style>