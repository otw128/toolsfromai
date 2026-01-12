<template>
  <div class="converter-container">
    
    <div class="card">
      <h2>1. File to Base64</h2>
      <div class="input-group">
        <label for="fileInput" class="custom-file-upload">
          {{ fileName || "Choose a file..." }}
        </label>
        <input 
          id="fileInput" 
          type="file" 
          @change="handleFileUpload" 
        />
      </div>

      <div v-if="base64Output" class="result-container">
        <div class="result-header">
          <strong>Base64 Output:</strong>
          <button @click="copyToClipboard">Copy</button>
        </div>
        <textarea readonly :value="base64Output" rows="5"></textarea>
      </div>
    </div>

    <div class="card">
      <h2>2. Base64 to File</h2>
      <p>Paste your Base64 string below to download it as a file.</p>
      
      <textarea 
        v-model="base64Input" 
        placeholder="Paste data:image/png;base64,..." 
        rows="5"
      ></textarea>

      <div class="actions">
        <input 
          v-model="downloadFileName" 
          type="text" 
          placeholder="Filename (e.g., my-image.png)" 
          class="filename-input"
        />
        <button @click="downloadFileFromBase64" :disabled="!base64Input">
          Download File
        </button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- STATE: File to Base64 ---
const fileName = ref('');
const base64Output = ref('');

// --- STATE: Base64 to File ---
const base64Input = ref('');
const downloadFileName = ref('downloaded-file');
const error = ref('');

// --- FUNCTION: File to Base64 ---
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name;
  
  // Auto-fill the download filename for convenience if they want to convert it back immediately
  downloadFileName.value = file.name; 

  const reader = new FileReader();
  reader.onload = () => {
    base64Output.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(base64Output.value);
  alert('Copied!');
};

// --- FUNCTION: Base64 to File ---
const downloadFileFromBase64 = () => {
  error.value = '';
  
  try {
    const base64Str = base64Input.value.trim();

    if (!base64Str.startsWith('data:')) {
      throw new Error("Invalid Base64 format. Must start with 'data:...'");
    }

    // 1. Split the string to separate the MIME type from the data
    // Format is "data:image/png;base64,iVBORw0KGgo..."
    const arr = base64Str.split(',');
    if (arr.length < 2) throw new Error("Invalid Base64 data.");

    const mimeMatch = arr[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]); // Decode Base64
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    // 2. Convert raw string to byte array
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // 3. Create a Blob (Binary Large Object)
    const blob = new Blob([u8arr], { type: mimeType });

    // 4. Create a virtual link and trigger click to download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Use user provided filename or default
    link.download = downloadFileName.value || `file.${mimeType.split('/')[1]}`; 
    
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    error.value = err.message;
    console.error(err);
  }
};
</script>

<style scoped>
.converter-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

h2 { margin-top: 0; }

textarea {
  width: 100%;
  resize: vertical;
  font-family: monospace;
  padding: 8px;
  margin-top: 10px;
  box-sizing: border-box; 
}

.input-group { margin-bottom: 1rem; }
input[type="file"] { display: none; }

.custom-file-upload, button {
  padding: 8px 16px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  display: inline-block;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.filename-input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error { color: red; margin-top: 10px; }
</style>