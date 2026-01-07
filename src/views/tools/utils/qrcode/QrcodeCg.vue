<template>
  <div class="qr-code-generator">
    <h2>QR Code Generator</h2>

    <div>
      <label for="inputMode">Choose Input Mode:</label>
      <select v-model="inputMode" id="inputMode">
        <option value="text">Text</option>
        <option value="labelValue">Label:Value Format</option>
      </select>
    </div>

    <div v-if="inputMode === 'text'">
      <label for="textInput">Enter Information (long text):</label>
      <textarea v-model="userInput" id="textInput" rows="5" placeholder="Enter your information here..."></textarea>
    </div>

    <div v-if="inputMode === 'labelValue'">
      <label for="labelValueInput">Enter Information (label:value):</label>
      <textarea v-model="userInput" id="labelValueInput" rows="5" placeholder="name:stephen, email:test@example.com"></textarea>
    </div>

    <div>
      <label for="imageUpload">Upload Image:</label>
      <input type="file" id="imageUpload" @change="handleImageUpload" />
    </div>

    <div>
      <button @click="generateQRCode">Generate QR Code</button>
    </div>

    <div v-if="qrCode">
      <div class="qr-code">
        <qrcode :value="qrCode" :size="250" />
        <div v-if="image" class="qr-image">
          <img :src="image" alt="centered image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode.vue"; // Import the QRCode Vue component

export default {
  components: {
    QRCode,
  },
  data() {
    return {
      inputMode: "text", // default input mode is text
      userInput: "", // stores input
      qrCode: "", // stores QR code data
      image: null, // stores uploaded image
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result; // Store base64 encoded image data
        };
        reader.readAsDataURL(file);
      }
    },
    generateQRCode() {
      if (!this.userInput) {
        alert("Please enter some information.");
        return;
      }
      this.qrCode = this.userInput; // Set the user input as QR code content
    },
  },
};
</script>

<style scoped>
.qr-code {
  position: relative;
  display: inline-block;
  width: 250px;
  height: 250px;
}

.qr-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px; /* Adjust the size of the image */
  height: 50px;
}

textarea {
  width: 100%;
  margin-top: 5px;
  padding: 5px;
}

input[type="file"] {
  margin-top: 10px;
}

button {
  margin-top: 20px;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
