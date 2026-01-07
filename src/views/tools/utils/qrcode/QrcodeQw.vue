<template>
  <div class="qr-generator">
    <!-- Input Mode Toggle -->
    <div class="mode-toggle">
      <button 
        :class="{ active: inputMode === 'bulk' }"
        @click="inputMode = 'bulk'"
      >
        Bulk Input
      </button>
      <button 
        :class="{ active: inputMode === 'label-value' }"
        @click="inputMode = 'label-value'"
      >
        Label-Value Pairs
      </button>
    </div>

    <!-- Bulk Input Mode -->
    <div v-if="inputMode === 'bulk'" class="input-section">
      <textarea 
        v-model="bulkText"
        placeholder="Enter all information here..."
        rows="5"
      ></textarea>
    </div>

    <!-- Label-Value Mode -->
    <div v-else class="input-section">
      <div class="label-value-pair" v-for="(pair, index) in labelValuePairs" :key="index">
        <input 
          v-model="pair.label" 
          placeholder="Label"
          @input="updateData"
        >
        <span>:</span>
        <input 
          v-model="pair.value" 
          placeholder="Value"
          @input="updateData"
        >
        <button @click="removePair(index)">×</button>
      </div>
      <button @click="addPair">+ Add Pair</button>
    </div>

    <!-- Logo Upload -->
    <div class="logo-upload">
      <label>Upload Logo (optional):</label>
      <input 
        type="file" 
        accept="image/*" 
        @change="handleLogoUpload"
      >
      <div v-if="logoPreview" class="logo-preview">
        <img :src="logoPreview" alt="Logo Preview">
      </div>
    </div>

    <!-- Generate Button -->
    <button 
      @click="generateQR" 
      :disabled="!qrData"
      class="generate-btn"
    >
      Generate QR Code
    </button>

    <!-- QR Code Display -->
    <div v-if="qrCodeUrl" class="qr-display">
      <img :src="qrCodeUrl" alt="Generated QR Code">
      <p>Scan to view data</p>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import QrCodeWithLogo from 'qrcode-with-logo'

export default {
  name: 'QRGenerator',
  data() {
    return {
      inputMode: 'bulk', // 'bulk' or 'label-value'
      bulkText: '',
      labelValuePairs: [{ label: '', value: '' }],
      logoFile: null,
      logoPreview: null,
      qrData: '',
      qrCodeUrl: null
    }
  },
  watch: {
    bulkText(newVal) {
      if (this.inputMode === 'bulk') {
        this.qrData = newVal
      }
    }
  },
  methods: {
    addPair() {
      this.labelValuePairs.push({ label: '', value: '' })
    },
    removePair(index) {
      if (this.labelValuePairs.length > 1) {
        this.labelValuePairs.splice(index, 1)
        this.updateData()
      }
    },
    updateData() {
      if (this.inputMode === 'label-value') {
        const validPairs = this.labelValuePairs.filter(pair => 
          pair.label.trim() && pair.value.trim()
        )
        this.qrData = validPairs
          .map(pair => `${pair.label.trim()}:${pair.value.trim()}`)
          .join('\n')
      }
    },
    handleLogoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.logoFile = file
        this.logoPreview = URL.createObjectURL(file)
      }
    },
    async generateQR() {
      if (!this.qrData) return
      
      try {
        if (this.logoFile) {
          // Generate QR with logo using qrcode-with-logo
          const canvas = document.createElement('canvas')
          await QrCodeWithLogo.toCanvas({
            canvas,
            content: this.qrData,
            width: 300,
            logo: {
              image: this.logoFile,
              radius: 8,
              width: 60,
              height: 60
            }
          })
          this.qrCodeUrl = canvas.toDataURL()
        } else {
          // Generate standard QR code
          this.qrCodeUrl = await QRCode.toDataURL(this.qrData, {
            width: 300,
            margin: 2
          })
        }
      } catch (error) {
        console.error('QR Generation failed:', error)
        alert('Failed to generate QR code')
      }
    }
  }
}
</script>

<style scoped>
.qr-generator {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.mode-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.mode-toggle button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.mode-toggle button.active {
  background: #4CAF50;
  color: white;
}

.input-section {
  margin-bottom: 20px;
}

.input-section textarea,
.input-section input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.label-value-pair {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.label-value-pair input {
  flex: 1;
}

.label-value-pair button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ff4d4d;
  color: white;
  border: none;
  cursor: pointer;
}

.logo-upload {
  margin: 20px 0;
}

.logo-upload input {
  margin-top: 8px;
}

.logo-preview {
  margin-top: 10px;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 8px;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.generate-btn {
  width: 100%;
  padding: 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin: 20px 0;
}

.generate-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.qr-display {
  text-align: center;
}

.qr-display img {
  max-width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.qr-display p {
  margin-top: 10px;
  color: #666;
}
</style>