<template>
  <div class="file-upload">
    <h2>Upload a File</h2>
    <input type="file" @change="handleFileUpload" />
    <div v-if="base64Data">
      <h3>Base64 Data</h3>
      <textarea v-model="base64Data" rows="10" cols="50" readonly></textarea>
      <button @click="convertBase64ToFile">Convert Base64 to File</button>
    </div>
    <div v-if="file">
      <h3>Converted File</h3>
      <a :href="fileUrl" download="converted-file">Download Converted File</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      base64Data: null,
      file: null,
      fileUrl: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.base64Data = reader.result.split(',')[1]; // Extract base64 part
        };
        reader.readAsDataURL(file);
      }
    },
    convertBase64ToFile() {
      if (this.base64Data) {
        const byteCharacters = atob(this.base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: 'application/octet-stream' });
        this.file = blob;
        this.fileUrl = URL.createObjectURL(blob);
      }
    },
  },
};
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

textarea {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

a {
  margin-top: 20px;
  text-decoration: none;
  color: #007bff;
}
</style>
