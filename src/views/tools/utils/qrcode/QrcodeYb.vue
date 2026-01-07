<template>
  <div class="qr-generator">
    <h2>QR Code Generator</h2>
    
    <div class="generator-container">
      <!-- Left Panel: Input Sections -->
      <div class="input-panel">
        <!-- Input Mode Selection -->
        <div class="mode-selector">
          <label>
            <input 
              type="radio" 
              v-model="inputMode" 
              value="text" 
            />
            <span>Text Input Mode</span>
          </label>
          <label>
            <input 
              type="radio" 
              v-model="inputMode" 
              value="keyValue" 
            />
            <span>Label:Value Input Mode</span>
          </label>
        </div>

        <!-- Text Input Mode -->
        <div v-if="inputMode === 'text'" class="input-section">
          <h3>Enter Text Content</h3>
          <textarea 
            v-model="textInput" 
            placeholder="Enter any text or data to encode in QR code"
            rows="8"
          ></textarea>
        </div>

        <!-- Key-Value Input Mode -->
        <div v-if="inputMode === 'keyValue'" class="input-section">
          <h3>Enter Data as Label:Value Pairs</h3>
          <div class="format-preview">
            <div class="preview-header">
              <span>Preview Format:</span>
              <span class="format-info">(Will be nicely formatted in QR code)</span>
            </div>
            <div class="format-example">
              <code>{{ formatPreview }}</code>
            </div>
          </div>
          <div class="key-value-inputs">
            <div v-for="(pair, index) in keyValuePairs" :key="index" class="key-value-row">
              <div class="input-group">
                <input 
                  type="text" 
                  v-model="pair.key" 
                  placeholder="Label (e.g., Name)"
                  class="key-input"
                  @input="updatePreview"
                />
                <span class="separator">:</span>
                <input 
                  type="text" 
                  v-model="pair.value" 
                  placeholder="Value (e.g., Stephen)"
                  class="value-input"
                  @input="updatePreview"
                />
              </div>
              <button 
                v-if="keyValuePairs.length > 1" 
                @click="removeKeyValuePair(index)"
                class="remove-btn"
              >
                ×
              </button>
            </div>
            <button @click="addKeyValuePair" class="add-btn">
              + Add Another Field
            </button>
          </div>
        </div>

        <!-- Logo Upload Section -->
        <div class="logo-section">
          <h3>QR Code Logo (Optional)</h3>
          <div class="logo-upload">
            <input 
              type="file" 
              id="logo-upload" 
              accept="image/*" 
              @change="handleLogoUpload"
              class="file-input"
            />
            <label for="logo-upload" class="upload-label">
              <div v-if="logoUrl" class="logo-preview">
                <img :src="logoUrl" alt="Logo Preview" />
                <button @click="removeLogo" class="remove-logo-btn">Remove</button>
              </div>
              <div v-else class="upload-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Upload Logo (Max 500KB)</span>
                <span class="upload-hint">Logo will be placed at QR code center</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Right Panel: QR Code Display -->
      <div class="display-panel">
        <h3>Generated QR Code</h3>
        
        <div class="qr-display-container">
          <!-- Fixed-size QR Code Container -->
          <div class="fixed-qr-container">
            <div ref="qrCodeElement" class="qr-code"></div>
            <div v-if="logoUrl" class="logo-overlay">
              <img :src="logoUrl" alt="Logo" />
            </div>
          </div>

          <!-- Default Message (Before Generation) -->
          <div v-if="!qrCodeGenerated" class="placeholder-message">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M9 3v4"/>
              <path d="M15 3v4"/>
              <path d="M9 17v4"/>
              <path d="M15 17v4"/>
              <path d="M3 9h4"/>
              <path d="M3 15h4"/>
              <path d="M17 9h4"/>
              <path d="M17 15h4"/>
            </svg>
            <p>Your QR Code will appear here</p>
            <p class="placeholder-subtitle">Enter data and click "Generate QR Code"</p>
          </div>
        </div>

        <!-- Output Preview -->
        <div v-if="qrCodeGenerated" class="output-preview">
          <h4>What the scanned QR code will show:</h4>
          <div class="preview-content">
            <pre>{{ formattedDataForDisplay }}</pre>
          </div>
        </div>

        <!-- QR Code Options -->
        <div class="qr-options">
          <div class="option-group">
            <label>Size:</label>
            <input 
              type="range" 
              v-model="qrSize" 
              min="400" 
              max="600" 
              step="50"
              class="size-slider"
            />
            <span class="size-value">{{ qrSize }}px</span>
          </div>
          <div class="option-group">
            <label>Error Correction:</label>
            <select v-model="errorCorrection" class="error-select">
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button 
            @click="generateQRCode" 
            :disabled="!hasContent"
            class="generate-btn"
          >
            {{ qrCodeGenerated ? 'Regenerate QR Code' : 'Generate QR Code' }}
          </button>

          <button 
            v-if="qrCodeGenerated" 
            @click="downloadQRCode"
            class="download-btn"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'QrCodeGenerator',
  
  data() {
    return {
      inputMode: 'text',
      textInput: '',
      keyValuePairs: [
        { key: 'Name', value: '' },
        { key: 'Email', value: '' },
        { key: 'Phone', value: '' }
      ],
      logoUrl: null,
      logoFile: null,
      qrCodeGenerated: false,
      qrSize: 500,
      errorCorrection: 'M',
      qrCodeDataUrl: '',
      formatPreview: 'Name:\nEmail:\nPhone:'
    };
  },
  
  computed: {
    hasContent() {
      if (this.inputMode === 'text') {
        return this.textInput.trim().length > 0;
      } else {
        return this.keyValuePairs.some(pair => 
          pair.key.trim() && pair.value.trim()
        );
      }
    },
    
    formattedData() {
      if (this.inputMode === 'text') {
        return this.textInput;
      } else {
        // Enhanced formatting with proper spacing
        const validPairs = this.keyValuePairs.filter(pair => 
          pair.key.trim() && pair.value.trim()
        );
        
        if (validPairs.length === 0) return '';
        
        // Create a nicely formatted text with labels aligned
        const maxLabelLength = Math.max(...validPairs.map(pair => pair.key.length));
        const formattedLines = validPairs.map(pair => {
          const label = pair.key.padEnd(maxLabelLength, ' ');
          return `${label}: ${pair.value}`;
        });
        
        return formattedLines.join('\n');
      }
    },
    
    formattedDataForDisplay() {
      if (this.inputMode === 'text') {
        return this.textInput;
      } else {
        const validPairs = this.keyValuePairs.filter(pair => 
          pair.key.trim() && pair.value.trim()
        );
        
        if (validPairs.length === 0) return 'No data entered';
        
        const maxLabelLength = Math.max(...validPairs.map(pair => pair.key.length));
        const formattedLines = validPairs.map(pair => {
          const label = pair.key.padEnd(maxLabelLength, ' ');
          return `${label}: ${pair.value}`;
        });
        
        return formattedLines.join('\n');
      }
    }
  },
  
  methods: {
    addKeyValuePair() {
      this.keyValuePairs.push({ key: '', value: '' });
      this.updatePreview();
    },
    
    removeKeyValuePair(index) {
      this.keyValuePairs.splice(index, 1);
      this.updatePreview();
    },
    
    updatePreview() {
      const validPairs = this.keyValuePairs.filter(pair => 
        pair.key.trim() || pair.value.trim()
      );
      
      if (validPairs.length === 0) {
        this.formatPreview = 'Name:\nEmail:\nPhone:';
        return;
      }
      
      const previewLines = validPairs.map(pair => {
        const label = pair.key.trim() || 'Label';
        const value = pair.value.trim() || 'Value';
        return `${label}: ${value}`;
      });
      
      this.formatPreview = previewLines.join('\n');
    },
    
    handleLogoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (file.size > 500 * 1024) {
        alert('File size must be less than 500KB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      this.logoFile = file;
      this.logoUrl = URL.createObjectURL(file);
      
      if (this.qrCodeGenerated) {
        this.generateQRCode();
      }
    },
    
    removeLogo() {
      this.logoUrl = null;
      this.logoFile = null;
      
      const fileInput = document.getElementById('logo-upload');
      if (fileInput) {
        fileInput.value = '';
      }
      
      if (this.qrCodeGenerated) {
        this.generateQRCode();
      }
    },
    
    async generateQRCode() {
      if (!this.hasContent) {
        alert('Please enter some content for the QR code');
        return;
      }
      
      try {
        const qrOptions = {
          width: this.qrSize,
          margin: 4,
          errorCorrectionLevel: this.errorCorrection,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        };
        
        this.qrCodeDataUrl = await QRCode.toDataURL(this.formattedData, qrOptions);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = this.qrSize;
          canvas.height = this.qrSize;
          
          ctx.drawImage(img, 0, 0, this.qrSize, this.qrSize);
          
          if (this.logoUrl) {
            const logoImg = new Image();
            logoImg.onload = () => {
              const logoSize = this.qrSize * 0.2;
              const logoX = (this.qrSize - logoSize) / 2;
              const logoY = (this.qrSize - logoSize) / 2;
              
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
              
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
              
              this.updateQRCodeDisplay(canvas.toDataURL());
            };
            logoImg.src = this.logoUrl;
          } else {
            this.updateQRCodeDisplay(this.qrCodeDataUrl);
          }
        };
        
        img.src = this.qrCodeDataUrl;
        this.qrCodeGenerated = true;
      } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Error generating QR code. Please try again.');
      }
    },
    
    updateQRCodeDisplay(dataUrl) {
      const qrElement = this.$refs.qrCodeElement;
      if (qrElement) {
        qrElement.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = 'Generated QR Code';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        
        qrElement.appendChild(img);
        this.qrCodeDataUrl = dataUrl;
      }
    },
    
    downloadQRCode() {
      if (!this.qrCodeDataUrl) return;
      
      const link = document.createElement('a');
      link.href = this.qrCodeDataUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
    // Format for better readability when scanned
    formatDataForQR() {
      if (this.inputMode === 'text') {
        return this.textInput;
      } else {
        const validPairs = this.keyValuePairs.filter(pair => 
          pair.key.trim() && pair.value.trim()
        );
        
        if (validPairs.length === 0) return '';
        
        // Create a nicely formatted text with proper spacing
        const maxLabelLength = Math.max(...validPairs.map(pair => pair.key.length));
        const formattedText = validPairs.map(pair => {
          const label = pair.key.padEnd(maxLabelLength, ' ');
          return `${label}: ${pair.value}`;
        }).join('\n');
        
        // Add a header and footer for better readability
        const header = '='.repeat(30) + '\n';
        const footer = '\n' + '='.repeat(30);
        return header + formattedText + footer;
      }
    }
  },
  
  watch: {
    qrSize() {
      if (this.qrCodeGenerated) {
        this.generateQRCode();
      }
    },
    errorCorrection() {
      if (this.qrCodeGenerated) {
        this.generateQRCode();
      }
    },
    inputMode() {
      this.updatePreview();
    },
    keyValuePairs: {
      handler() {
        this.updatePreview();
      },
      deep: true
    }
  },
  
  mounted() {
    this.updatePreview();
  }
};
</script>

<style scoped>
.qr-generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: 2.2rem;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.generator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  min-height: 600px;
}

.input-panel, .display-panel {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.mode-selector {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
}

.mode-selector label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  flex: 1;
  justify-content: center;
}

.mode-selector label:hover {
  border-color: #4CAF50;
  background-color: #f1f8e9;
  transform: translateY(-2px);
}

.mode-selector input[type="radio"]:checked + span {
  color: #4CAF50;
  font-weight: 600;
}

.input-section {
  flex: 1;
  margin-bottom: 25px;
}

.input-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.format-preview {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.preview-header span:first-child {
  font-weight: 600;
  color: #2c3e50;
}

.format-info {
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
}

.format-example {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 100px;
  overflow-y: auto;
}

.format-example code {
  color: #e83e8c;
  background: transparent;
  padding: 0;
}

textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s;
  min-height: 150px;
  font-family: 'Courier New', monospace;
}

textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.key-value-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.key-value-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-group {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
}

.separator {
  font-weight: 600;
  color: #495057;
  font-size: 1.1rem;
}

.key-input, .value-input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;
}

.key-input {
  flex: 1;
  min-width: 120px;
}

.value-input {
  flex: 2;
  min-width: 150px;
}

.key-input:focus, .value-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #ff3742;
  transform: scale(1.1);
}

.add-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  align-self: flex-start;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.logo-section {
  margin-top: auto;
}

.logo-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.file-input {
  display: none;
}

.upload-label {
  display: block;
  cursor: pointer;
  border: 3px dashed #d1d9e6;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s;
  background: #f8fafc;
}

.upload-label:hover {
  border-color: #4CAF50;
  background: #f1f8e9;
  transform: translateY(-2px);
}

.logo-preview {
  position: relative;
  display: inline-block;
}

.logo-preview img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.remove-logo-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff4757;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
}

.remove-logo-btn:hover {
  background: #ff3742;
  transform: scale(1.1);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #64748b;
}

.upload-placeholder svg {
  stroke: #94a3b8;
}

.upload-hint {
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
}

.display-panel {
  display: flex;
  flex-direction: column;
}

.display-panel h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.qr-display-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  min-height: 500px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.fixed-qr-container {
  width: 500px;
  height: 500px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  border: 1px solid #e2e8f0;
}

.qr-code {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.logo-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
  z-index: 10;
}

.logo-overlay img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 4px;
}

.placeholder-message {
  text-align: center;
  color: white;
  padding: 20px;
}

.placeholder-message svg {
  margin-bottom: 20px;
  opacity: 0.8;
}

.placeholder-message p {
  font-size: 1.2rem;
  margin: 10px 0;
  font-weight: 500;
}

.placeholder-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: normal;
}

.output-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #e9ecef;
}

.output-preview h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.preview-content {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  max-height: 150px;
  overflow-y: auto;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  color: #495057;
}

.preview-content pre {
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  white-space: pre-wrap;
  word-break: break-all;
}

.qr-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.option-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.option-group label {
  font-weight: 600;
  color: #2d3748;
  min-width: 140px;
  font-size: 0.95rem;
}

.size-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: linear-gradient(90deg, #4CAF50, #2196F3);
  border-radius: 3px;
  outline: none;
}

.size-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  border: 3px solid white;
}

.size-value {
  font-weight: 600;
  color: #4CAF50;
  min-width: 60px;
  text-align: right;
  font-size: 1.1rem;
}

.error-select {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.error-select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.generate-btn, .download-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.generate-btn {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
  background: linear-gradient(135deg, #45a049, #1B5E20);
}

.generate-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.download-btn {
  background: linear-gradient(135deg, #2196F3, #0D47A1);
  color: white;
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
  background: linear-gradient(135deg, #1976D2, #0D47A1);
}
</style>