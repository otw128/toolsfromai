<script setup>
import { ref } from 'vue';
import QRCode from 'qrcode';

// --- State ---
const inputMode = ref('text'); // 'text' or 'kv'
const rawText = ref('');
const kvPairs = ref([{ label: '', value: '' }]); // Start with one empty row
const logoPreview = ref(null); // Stores the Data URL of the uploaded image
const canvasRef = ref(null); // Reference to the <canvas> DOM element
const errorMsg = ref('');

// --- Helper: Load Image Asynchronously ---
// This wraps the native Image loading in a Promise so we can 'await' it
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Allow cross-origin if using external URLs (not strictly needed for local uploads but good practice)
    img.crossOrigin = "Anonymous"; 
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

// --- Actions ---

// 1. Handle File Upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Store the image as a Base64 string to preview and draw later
      logoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 2. Manage Key-Value Rows
const addKvPair = () => {
  kvPairs.value.push({ label: '', value: '' });
};

const removeKvPair = (index) => {
  kvPairs.value.splice(index, 1);
};

// 3. Main Generation Logic
const generateQRCode = async () => {
  errorMsg.value = '';
  
  // A. Determine Content based on Mode
  let content = '';
  if (inputMode.value === 'text') {
    content = rawText.value;
  } else {
    // Filter out incomplete rows and format
    content = kvPairs.value
      .filter(pair => pair.label && pair.value)
      .map(pair => `${pair.label}:${pair.value}`)
      .join('\n');
  }

  if (!content.trim()) {
    errorMsg.value = "Please enter some content to generate a QR code.";
    return;
  }

  try {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');

    // B. Generate the standard QR Code
    // We use Error Correction Level 'H' (High) to allow the logo to cover ~30% of data
    await QRCode.toCanvas(canvas, content, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H', 
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // C. Draw the Logo (if one exists)
    if (logoPreview.value) {
      // 1. Wait for image to fully load in memory
      const img = await loadImage(logoPreview.value);

      // 2. Calculate dimensions
      const qrSize = 300;
      const logoSize = qrSize * 0.2; // Logo is 20% of QR width
      const center = (qrSize - logoSize) / 2;

      // 3. Draw a white background square behind the logo
      // This ensures the logo stands out and isn't transparent over black dots
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(center - 3, center - 3, logoSize + 6, logoSize + 6);

      // 4. Draw the actual image
      ctx.drawImage(img, center, center, logoSize, logoSize);
    }

  } catch (err) {
    console.error(err);
    errorMsg.value = "Failed to generate. If the text is very long, try removing the logo.";
  }
};
</script>

<template>
  <div class="qr-wrapper">
    <div class="qr-card">
      <h2 class="title">QR Generator</h2>

      <div class="tabs">
        <button 
          :class="{ active: inputMode === 'text' }" 
          @click="inputMode = 'text'"
        >
          Raw Text
        </button>
        <button 
          :class="{ active: inputMode === 'kv' }" 
          @click="inputMode = 'kv'"
        >
          Label : Value
        </button>
      </div>

      <div class="input-area">
        
        <div v-if="inputMode === 'text'">
          <textarea 
            v-model="rawText" 
            placeholder="Paste your text or texture data here..." 
            rows="6"
            class="full-width-input"
          ></textarea>
        </div>

        <div v-if="inputMode === 'kv'" class="kv-list">
          <div v-for="(pair, index) in kvPairs" :key="index" class="kv-row">
            <input v-model="pair.label" placeholder="Label" />
            <span class="separator">:</span>
            <input v-model="pair.value" placeholder="Value" />
            
            <button 
              class="icon-btn delete" 
              @click="removeKvPair(index)" 
              v-if="kvPairs.length > 1"
              title="Remove row"
            >
              &times;
            </button>
          </div>
          <button class="add-btn" @click="addKvPair">+ Add Field</button>
        </div>
      </div>

      <div class="upload-area">
        <label class="upload-label">
          <span>Center Logo (Optional)</span>
          <input type="file" accept="image/*" @change="handleImageUpload" />
        </label>
        
        <div v-if="logoPreview" class="preview-container">
          <img :src="logoPreview" alt="Logo Preview" />
          <span class="preview-text">Logo Loaded</span>
        </div>
      </div>

      <div class="actions">
        <button class="generate-btn" @click="generateQRCode">
          Generate QR Code
        </button>
        <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
      </div>

      <div class="canvas-container">
        <canvas ref="canvasRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main Layout */
.qr-wrapper {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f4f6f8;
  min-height: 100vh;
}

.qr-card {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
}

/* Tabs */
.tabs {
  display: flex;
  background: #f0f0f0;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s;
}

.tabs button.active {
  background: white;
  color: #333;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

/* Inputs */
.full-width-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}

.kv-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kv-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kv-row input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.separator {
  font-weight: bold;
  color: #888;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.add-btn {
  background: #f0f9ff;
  color: #0284c7;
  border: 1px dashed #0284c7;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 5px;
  font-weight: 600;
}

/* Upload Area */
.upload-area {
  margin: 25px 0;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.upload-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 500;
  color: #444;
}

.preview-container {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafafa;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #eee;
}

.preview-container img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  background: white;
}

.preview-text {
  font-size: 0.9em;
  color: #666;
}

/* Actions */
.generate-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;
}

.generate-btn:active {
  transform: scale(0.98);
}

.error-text {
  color: #dc2626;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9em;
}

/* Canvas */
.canvas-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

canvas {
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-radius: 4px;
}
</style>