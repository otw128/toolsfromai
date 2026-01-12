<template>
  <div class="file-uploader">
    <!-- Mode Toggle -->
    <div class="mode-toggle">
      <div class="toggle-buttons">
        <button 
          @click="activeMode = 'file-to-base64'" 
          :class="{ active: activeMode === 'file-to-base64' }"
          class="toggle-btn"
        >
          File → Base64
        </button>
        <button 
          @click="activeMode = 'base64-to-file'" 
          :class="{ active: activeMode === 'base64-to-file' }"
          class="toggle-btn"
        >
          Base64 → File
        </button>
      </div>
    </div>

    <!-- File to Base64 Section -->
    <div v-if="activeMode === 'file-to-base64'" class="conversion-section">
      <h2 class="section-title">Convert File to Base64</h2>
      
      <!-- Upload Area -->
      <div 
        class="upload-area"
        :class="{ 'drag-over': isDragOver, 'has-file': file }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="upload-content">
          <div class="upload-icon">
            <svg v-if="!file" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <img v-else-if="isImage" :src="filePreview" :alt="file.name" class="file-preview" />
            <div v-else class="file-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
              <span class="file-extension">{{ fileExtension }}</span>
            </div>
          </div>
          
          <div class="upload-text">
            <template v-if="!file">
              <h3>Drop your file here or click to browse</h3>
              <p>Supports: Images, PDF, TXT, DOC, etc. (Max: 10MB)</p>
            </template>
            <template v-else>
              <h3>{{ file.name }}</h3>
              <p>{{ formatFileSize(file.size) }}</p>
            </template>
          </div>
          
          <button v-if="!file" class="browse-btn">
            Browse Files
          </button>
        </div>
        
        <input
          ref="fileInput"
          type="file"
          @change="handleFileSelect"
          style="display: none"
        />
      </div>
      
      <!-- File Actions -->
      <div v-if="file" class="file-actions">
        <div class="action-buttons">
          <button @click="convertToBase64" :disabled="isConverting" class="btn convert-btn">
            <span v-if="!isConverting">Convert to Base64</span>
            <span v-else class="loading">Converting...</span>
          </button>
          <button @click="clearFile" class="btn clear-btn">Clear</button>
        </div>
      </div>
      
      <!-- Base64 Output -->
      <div v-if="base64Result" class="result-section">
        <div class="result-header">
          <h3>Base64 Result</h3>
          <div class="result-actions">
            <button @click="copyToClipboard" class="btn copy-btn">
              {{ copyButtonText }}
            </button>
            <button @click="downloadBase64" class="btn download-btn">Download as Text</button>
          </div>
        </div>
        
        <div class="result-info">
          <div class="info-item">
            <span>MIME Type:</span>
            <code>{{ mimeType }}</code>
          </div>
          <div class="info-item">
            <span>Base64 Size:</span>
            <code>{{ base64Size }}</code>
          </div>
        </div>
        
        <div class="base64-output">
          <textarea 
            ref="base64Textarea"
            v-model="base64Result"
            @click="selectAllText"
            placeholder="Base64 output will appear here..."
            rows="6"
          ></textarea>
          
          <div v-if="isImage" class="preview-section">
            <h4>Preview:</h4>
            <img :src="'data:' + mimeType + ';base64,' + base64Result" :alt="file?.name" class="image-preview" />
          </div>
        </div>
      </div>
    </div>

    <!-- Base64 to File Section -->
    <div v-else class="conversion-section">
      <h2 class="section-title">Convert Base64 to File</h2>
      
      <!-- Base64 Input Area -->
      <div class="base64-input-section">
        <div class="input-header">
          <h3>Enter Base64 String</h3>
          <div class="input-actions">
            <button @click="clearBase64Input" class="btn clear-btn" :disabled="!base64Input">Clear</button>
            <button @click="loadExample" class="btn example-btn">Load Example</button>
          </div>
        </div>
        
        <div class="mime-input-group">
          <label for="mimeType">MIME Type:</label>
          <div class="mime-select">
            <select v-model="selectedMimeType" id="mimeType">
              <option value="">Auto Detect / Custom</option>
              <option value="image/jpeg">image/jpeg (JPEG Image)</option>
              <option value="image/png">image/png (PNG Image)</option>
              <option value="image/gif">image/gif (GIF Image)</option>
              <option value="image/svg+xml">image/svg+xml (SVG Image)</option>
              <option value="application/pdf">application/pdf (PDF Document)</option>
              <option value="text/plain">text/plain (Text File)</option>
              <option value="application/json">application/json (JSON File)</option>
              <option value="application/octet-stream">application/octet-stream (Binary)</option>
            </select>
            <input 
              v-if="selectedMimeType === ''" 
              v-model="customMimeType"
              type="text" 
              placeholder="Enter custom MIME type"
              class="custom-mime-input"
            />
          </div>
        </div>
        
        <div class="filename-input-group">
          <label for="filename">Filename:</label>
          <input 
            v-model="outputFilename" 
            type="text" 
            id="filename"
            placeholder="Enter output filename (e.g., image.jpg)"
            class="filename-input"
          />
        </div>
        
        <textarea
          v-model="base64Input"
          placeholder="Paste your Base64 string here..."
          class="base64-input"
          rows="8"
        ></textarea>
        
        <div v-if="validationError" class="error-message">
          {{ validationError }}
        </div>
        
        <div v-if="isBase64Valid && base64Input" class="base64-info">
          <div class="info-item">
            <span>Estimated File Size:</span>
            <code>{{ formatFileSize(estimatedFileSize) }}</code>
          </div>
          <div class="info-item">
            <span>Input Length:</span>
            <code>{{ base64Input.length }} characters</code>
          </div>
        </div>
        
        <div class="conversion-actions">
          <button 
            @click="convertBase64ToFile" 
            :disabled="!isBase64Valid || isConvertingToFile" 
            class="btn convert-to-file-btn"
          >
            <span v-if="!isConvertingToFile">Convert Base64 to File</span>
            <span v-else class="loading">Converting...</span>
          </button>
        </div>
      </div>
      
      <!-- Result Section -->
      <div v-if="convertedFile" class="result-section">
        <div class="result-header">
          <h3>Converted File</h3>
          <div class="result-actions">
            <button @click="downloadConvertedFile" class="btn download-file-btn">Download File</button>
          </div>
        </div>
        
        <div class="file-info">
          <div class="info-item">
            <span>Filename:</span>
            <code>{{ convertedFile.name }}</code>
          </div>
          <div class="info-item">
            <span>File Size:</span>
            <code>{{ formatFileSize(convertedFile.size) }}</code>
          </div>
          <div class="info-item">
            <span>MIME Type:</span>
            <code>{{ convertedFile.type }}</code>
          </div>
        </div>
        
        <div v-if="isImageOutput" class="preview-section">
          <h4>Preview:</h4>
          <img :src="convertedFileUrl" :alt="convertedFile.name" class="image-preview" />
        </div>
        
        <div v-else class="file-details">
          <h4>File Details:</h4>
          <div class="file-type-indicator">
            <div class="file-type-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
            </div>
            <div class="file-type-info">
              <p><strong>Type:</strong> {{ getFileTypeName(convertedFile.type) }}</p>
              <p><strong>Extension:</strong> {{ getFileExtension(convertedFile.name) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-message global-error">
      {{ error }}
    </div>

    <!-- Mode History -->
    <div v-if="conversionHistory.length > 0" class="history-section">
      <h3>Recent Conversions</h3>
      <div class="history-list">
        <div 
          v-for="(item, index) in conversionHistory.slice().reverse()" 
          :key="index" 
          class="history-item"
          @click="loadFromHistory(item)"
        >
          <div class="history-icon">
            <span v-if="item.mode === 'file-to-base64'">📁→🔤</span>
            <span v-else>🔤→📁</span>
          </div>
          <div class="history-details">
            <div class="history-name">{{ item.filename }}</div>
            <div class="history-info">
              <span class="history-mode">{{ item.mode === 'file-to-base64' ? 'File → Base64' : 'Base64 → File' }}</span>
              <span class="history-size">{{ formatFileSize(item.size) }}</span>
            </div>
          </div>
          <div class="history-time">{{ formatTimeAgo(item.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// Refs
const file = ref(null);
const fileInput = ref(null);
const base64Textarea = ref(null);
const isDragOver = ref(false);
const isConverting = ref(false);
const isConvertingToFile = ref(false);
const base64Result = ref('');
const base64Input = ref('');
const error = ref('');
const copyButtonText = ref('Copy to Clipboard');
const activeMode = ref('file-to-base64');
const selectedMimeType = ref('');
const customMimeType = ref('');
const outputFilename = ref('');
const convertedFile = ref(null);
const convertedFileUrl = ref('');
const validationError = ref('');
const conversionHistory = ref([]);

// Computed properties
const isImage = computed(() => {
  if (!file.value) return false;
  return file.value.type.startsWith('image/');
});

const filePreview = computed(() => {
  if (!file.value || !isImage.value) return '';
  return URL.createObjectURL(file.value);
});

const fileExtension = computed(() => {
  if (!file.value) return '';
  const parts = file.value.name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
});

const mimeType = computed(() => {
  if (!file.value) return '';
  return file.value.type || 'application/octet-stream';
});

const base64Size = computed(() => {
  if (!base64Result.value) return '0 bytes';
  const bytes = (base64Result.value.length * 3) / 4;
  return formatFileSize(bytes);
});

const isBase64Valid = computed(() => {
  if (!base64Input.value.trim()) return false;
  return validateBase64(base64Input.value.trim());
});

const estimatedFileSize = computed(() => {
  if (!base64Input.value.trim()) return 0;
  const base64Str = base64Input.value.trim();
  return Math.ceil(base64Str.length * 3 / 4);
});

const isImageOutput = computed(() => {
  if (!convertedFile.value) return false;
  return convertedFile.value.type.startsWith('image/');
});

const currentMimeType = computed(() => {
  if (selectedMimeType.value) return selectedMimeType.value;
  if (customMimeType.value) return customMimeType.value;
  return detectMimeTypeFromBase64(base64Input.value);
});

// Watch for mode changes
watch(activeMode, (newMode) => {
  clearErrors();
  if (newMode === 'base64-to-file') {
    // Auto-fill filename if we have a MIME type
    if (currentMimeType.value && !outputFilename.value) {
      const ext = getExtensionFromMimeType(currentMimeType.value);
      if (ext) {
        outputFilename.value = `converted_file.${ext}`;
      }
    }
  }
});

// Watch for base64 input changes
watch(base64Input, (newValue) => {
  if (newValue.trim()) {
    validateBase64Input(newValue.trim());
    
    // Auto-detect MIME type if not specified
    if (!selectedMimeType.value && !customMimeType.value) {
      const detectedMime = detectMimeTypeFromBase64(newValue.trim());
      if (detectedMime && detectedMime !== 'application/octet-stream') {
        selectedMimeType.value = detectedMime;
      }
    }
    
    // Auto-suggest filename
    if (!outputFilename.value && currentMimeType.value) {
      const ext = getExtensionFromMimeType(currentMimeType.value);
      if (ext) {
        outputFilename.value = `converted_file.${ext}`;
      }
    }
  }
});

watch(currentMimeType, (newMimeType) => {
  if (newMimeType && base64Input.value.trim() && !outputFilename.value) {
    const ext = getExtensionFromMimeType(newMimeType);
    if (ext) {
      outputFilename.value = `converted_file.${ext}`;
    }
  }
});

// Methods
const handleDragOver = (e) => {
  isDragOver.value = true;
  e.dataTransfer.dropEffect = 'copy';
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e) => {
  isDragOver.value = false;
  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) {
    validateAndSetFile(droppedFile);
  }
};

const triggerFileInput = () => {
  if (!file.value) {
    fileInput.value.click();
  }
};

const handleFileSelect = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    validateAndSetFile(selectedFile);
  }
};

const validateAndSetFile = (selectedFile) => {
  error.value = '';
  base64Result.value = '';
  validationError.value = '';
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (selectedFile.size > maxSize) {
    error.value = 'File size exceeds 10MB limit';
    return;
  }
  
  file.value = selectedFile;
};

const convertToBase64 = () => {
  if (!file.value) {
    error.value = 'Please select a file first';
    return;
  }
  
  isConverting.value = true;
  error.value = '';
  validationError.value = '';
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    // The result includes the data URL prefix
    const dataUrl = e.target.result;
    // Extract just the base64 part (after the comma)
    const base64 = dataUrl.split(',')[1];
    base64Result.value = base64;
    isConverting.value = false;
    
    // Add to history
    addToHistory({
      mode: 'file-to-base64',
      filename: file.value.name,
      size: file.value.size,
      mimeType: file.value.type
    });
  };
  
  reader.onerror = () => {
    error.value = 'Error reading file. Please try again.';
    isConverting.value = false;
  };
  
  reader.readAsDataURL(file.value);
};

const validateBase64Input = (input) => {
  validationError.value = '';
  
  if (!input.trim()) {
    return;
  }
  
  // Remove any whitespace
  const cleanInput = input.replace(/\s/g, '');
  
  // Check length
  if (cleanInput.length % 4 !== 0) {
    validationError.value = 'Invalid Base64 length. String length should be a multiple of 4.';
    return false;
  }
  
  // Check for invalid characters
  const validChars = /^[A-Za-z0-9+/=]*$/;
  if (!validChars.test(cleanInput)) {
    validationError.value = 'Invalid Base64 character detected. Only A-Z, a-z, 0-9, +, /, and = are allowed.';
    return false;
  }
  
  return true;
};

const validateBase64 = (input) => {
  if (!input.trim()) return false;
  
  const cleanInput = input.replace(/\s/g, '');
  
  if (cleanInput.length % 4 !== 0) {
    return false;
  }
  
  const validChars = /^[A-Za-z0-9+/=]*$/;
  if (!validChars.test(cleanInput)) {
    return false;
  }
  
  return true;
};

const convertBase64ToFile = () => {
  if (!isBase64Valid.value) {
    validationError.value = 'Please enter a valid Base64 string';
    return;
  }
  
  isConvertingToFile.value = true;
  error.value = '';
  validationError.value = '';
  
  try {
    // Clean the base64 string
    const base64Data = base64Input.value.trim().replace(/\s/g, '');
    
    // Determine MIME type
    let mimeType = currentMimeType.value;
    if (!mimeType) {
      mimeType = detectMimeTypeFromBase64(base64Data) || 'application/octet-stream';
    }
    
    // Convert base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create blob
    const blob = new Blob([bytes], { type: mimeType });
    
    // Determine filename
    let filename = outputFilename.value.trim();
    if (!filename) {
      const ext = getExtensionFromMimeType(mimeType) || 'bin';
      filename = `converted_file.${ext}`;
    }
    
    // Create file object
    convertedFile.value = new File([blob], filename, { type: mimeType });
    
    // Create object URL for preview/download
    if (convertedFileUrl.value) {
      URL.revokeObjectURL(convertedFileUrl.value);
    }
    convertedFileUrl.value = URL.createObjectURL(blob);
    
    // Add to history
    addToHistory({
      mode: 'base64-to-file',
      filename: filename,
      size: blob.size,
      mimeType: mimeType
    });
    
  } catch (err) {
    error.value = 'Error converting Base64 to file: ' + err.message;
  } finally {
    isConvertingToFile.value = false;
  }
};

const detectMimeTypeFromBase64 = (base64Str) => {
  // Check for common data URL patterns
  if (base64Str.startsWith('data:')) {
    const match = base64Str.match(/^data:([^;]+);/);
    if (match) return match[1];
  }
  
  // Check for magic numbers in the first few bytes
  try {
    const binaryStr = atob(base64Str.substring(0, 100)); // Check first 100 chars
    const bytes = new Uint8Array(binaryStr.length);
    
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    
    // Check for common file signatures
    if (bytes.length >= 4) {
      // PNG
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        return 'image/png';
      }
      // JPEG
      if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
        return 'image/jpeg';
      }
      // GIF
      if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        return 'image/gif';
      }
      // PDF
      if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
        return 'application/pdf';
      }
    }
  } catch (e) {
    // If detection fails, return default
  }
  
  return 'application/octet-stream';
};

const getExtensionFromMimeType = (mimeType) => {
  const mimeToExt = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'application/json': 'json',
    'application/xml': 'xml',
    'application/zip': 'zip',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'video/mp4': 'mp4',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };
  
  return mimeToExt[mimeType] || null;
};

const getFileTypeName = (mimeType) => {
  const mimeNames = {
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/svg+xml': 'SVG Image',
    'application/pdf': 'PDF Document',
    'text/plain': 'Text File',
    'application/json': 'JSON File',
    'application/octet-stream': 'Binary File',
  };
  
  return mimeNames[mimeType] || mimeType;
};

const getFileExtension = (filename) => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'Unknown';
};

const downloadConvertedFile = () => {
  if (!convertedFile.value) return;
  
  const element = document.createElement('a');
  element.href = convertedFileUrl.value;
  element.download = convertedFile.value.name;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const clearFile = () => {
  file.value = null;
  base64Result.value = '';
  error.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const clearBase64Input = () => {
  base64Input.value = '';
  convertedFile.value = null;
  validationError.value = '';
  outputFilename.value = '';
  selectedMimeType.value = '';
  customMimeType.value = '';
  
  if (convertedFileUrl.value) {
    URL.revokeObjectURL(convertedFileUrl.value);
    convertedFileUrl.value = '';
  }
};

const clearErrors = () => {
  error.value = '';
  validationError.value = '';
};

const copyToClipboard = async () => {
  if (!base64Result.value) return;
  
  try {
    await navigator.clipboard.writeText(base64Result.value);
    copyButtonText.value = 'Copied!';
    setTimeout(() => {
      copyButtonText.value = 'Copy to Clipboard';
    }, 2000);
  } catch (err) {
    // Fallback for older browsers
    base64Textarea.value.select();
    document.execCommand('copy');
    copyButtonText.value = 'Copied!';
    setTimeout(() => {
      copyButtonText.value = 'Copy to Clipboard';
    }, 2000);
  }
};

const downloadBase64 = () => {
  if (!base64Result.value) return;
  
  const element = document.createElement('a');
  const fileBlob = new Blob([base64Result.value], { type: 'text/plain' });
  element.href = URL.createObjectURL(fileBlob);
  element.download = `${file.value?.name || 'converted'}.base64.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const selectAllText = () => {
  if (base64Textarea.value) {
    base64Textarea.value.select();
  }
};

const loadExample = () => {
  // Load a simple example base64 (a small transparent PNG)
  base64Input.value = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  selectedMimeType.value = 'image/png';
  outputFilename.value = 'example.png';
};

const addToHistory = (item) => {
  const historyItem = {
    ...item,
    timestamp: new Date().getTime(),
    id: Date.now()
  };
  
  conversionHistory.value.push(historyItem);
  
  // Keep only last 5 items
  if (conversionHistory.value.length > 5) {
    conversionHistory.value.shift();
  }
  
  // Save to localStorage
  localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory.value));
};

const loadFromHistory = (item) => {
  if (item.mode === 'file-to-base64') {
    activeMode.value = 'file-to-base64';
    // Note: Can't reload files from history due to browser security restrictions
  } else {
    activeMode.value = 'base64-to-file';
    // Can't reload base64 from history for privacy reasons
  }
};

const formatTimeAgo = (timestamp) => {
  const now = new Date().getTime();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Load history from localStorage
onMounted(() => {
  const savedHistory = localStorage.getItem('conversionHistory');
  if (savedHistory) {
    try {
      conversionHistory.value = JSON.parse(savedHistory);
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (filePreview.value) {
    URL.revokeObjectURL(filePreview.value);
  }
  if (convertedFileUrl.value) {
    URL.revokeObjectURL(convertedFileUrl.value);
  }
});
</script>

<style scoped>
.file-uploader {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mode-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-buttons {
  display: inline-flex;
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
  border: 2px solid #e5e7eb;
}

.toggle-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
  min-width: 150px;
}

.toggle-btn:hover {
  color: #374151;
  background-color: #e5e7eb;
}

.toggle-btn.active {
  background-color: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
}

.conversion-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-title {
  text-align: center;
  color: #374151;
  font-size: 1.5rem;
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.upload-area {
  border: 3px dashed #d1d5db;
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  position: relative;
  overflow: hidden;
}

.upload-area:hover:not(.has-file) {
  border-color: #667eea;
  background-color: #f0f4ff;
}

.upload-area.drag-over {
  border-color: #667eea;
  background-color: #e0e7ff;
  transform: scale(1.01);
}

.upload-area.has-file {
  border-color: #10b981;
  background-color: #f0fdf4;
  cursor: default;
  padding: 40px 20px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.upload-icon {
  color: #667eea;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-area.has-file .upload-icon {
  color: #10b981;
}

.file-preview {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: contain;
  border: 2px solid #e5e7eb;
  background: white;
  padding: 4px;
}

.file-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-extension {
  position: absolute;
  bottom: -8px;
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.upload-text h3 {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: #374151;
}

.upload-text p {
  color: #6b7280;
  font-size: 0.95rem;
}

.browse-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 1rem;
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.file-actions {
  display: flex;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.convert-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.convert-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.convert-to-file-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  width: 100%;
  padding: 14px 30px;
  font-size: 1.1rem;
}

.convert-to-file-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
}

.clear-btn {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.clear-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.example-btn {
  background: #3b82f6;
  color: white;
}

.example-btn:hover {
  background: #2563eb;
}

.copy-btn {
  background-color: #3b82f6;
  color: white;
  padding: 8px 20px;
  min-width: auto;
}

.copy-btn:hover {
  background-color: #2563eb;
}

.download-btn, .download-file-btn {
  background-color: #8b5cf6;
  color: white;
  padding: 8px 20px;
  min-width: auto;
}

.download-btn:hover, .download-file-btn:hover {
  background-color: #7c3aed;
}

.error-message {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  margin-top: 10px;
}

.global-error {
  margin-top: 20px;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.result-section {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.result-header h3 {
  color: #374151;
  font-size: 1.3rem;
}

.result-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.result-info, .file-info, .base64-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  background-color: #f9fafb;
  padding: 15px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item span {
  font-size: 0.9rem;
  color: #6b7280;
}

.info-item code {
  background-color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.base64-output textarea, .base64-input {
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  background-color: #f9fafb;
  color: #374151;
  margin-bottom: 20px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.base64-input {
  background-color: #1f2937;
  color: #f3f4f6;
  border-color: #4b5563;
}

.base64-output textarea:focus, .base64-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.preview-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.preview-section h4 {
  margin-bottom: 15px;
  color: #374151;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: block;
  margin: 0 auto;
}

.base64-input-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.input-header h3 {
  color: #374151;
  font-size: 1.2rem;
}

.input-actions {
  display: flex;
  gap: 10px;
}

.mime-input-group, .filename-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mime-input-group label, .filename-input-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.mime-select {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mime-select select, .filename-input, .custom-mime-input {
  padding: 10px 12px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.mime-select select:focus, .filename-input:focus, .custom-mime-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.conversion-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.file-details {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.file-details h4 {
  margin-bottom: 15px;
  color: #374151;
}

.file-type-indicator {
  display: flex;
  align-items: center;
  gap: 20px;
}

.file-type-icon {
  color: #667eea;
  flex-shrink: 0;
}

.file-type-info p {
  margin-bottom: 5px;
  color: #374151;
}

.file-type-info strong {
  color: #4b5563;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.history-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
}

.history-section h3 {
  margin-bottom: 15px;
  color: #374151;
  font-size: 1.2rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  transform: translateX(5px);
}

.history-icon {
  font-size: 1.2rem;
  width: 40px;
  text-align: center;
}

.history-details {
  flex: 1;
}

.history-name {
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-info {
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
  color: #6b7280;
}

.history-mode {
  background-color: #e0e7ff;
  color: #4f46e5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.history-size {
  color: #6b7280;
}

.history-time {
  font-size: 0.85rem;
  color: #9ca3af;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .app {
    border-radius: 10px;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  .toggle-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .toggle-btn {
    width: 100%;
  }
  
  .upload-area {
    padding: 40px 15px;
  }
  
  .input-header, .result-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .input-actions, .result-actions {
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .history-time {
    align-self: flex-end;
  }
}
</style>