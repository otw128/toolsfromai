<template>
  <div class="converter-container">
    <h1>Video to GIF Converter</h1>
    
    <div class="upload-section">
      <input type="file" id="videoInput" accept="video/*" @change="handleFileUpload" />
      <label for="videoInput" class="upload-btn">Choose Video File</label>
      <p v-if="selectedFile">{{ selectedFile.name }}</p>
    </div>

    <div class="controls" v-if="selectedFile">
      <div class="control-group">
        <label>Start Time (seconds):</label>
        <input type="number" v-model.number="startTime" min="0" step="0.1" />
      </div>
      
      <div class="control-group">
        <label>Duration (seconds):</label>
        <input type="number" v-model.number="duration" min="0.1" step="0.1" />
      </div>
      
      <div class="control-group">
        <label>FPS:</label>
        <input type="number" v-model.number="fps" min="1" max="60" />
      </div>
      
      <div class="control-group">
        <label>Width (px):</label>
        <input type="number" v-model.number="width" min="100" />
      </div>
      
      <button @click="convertToGif" :disabled="isConverting">
        {{ isConverting ? 'Converting...' : 'Convert to GIF' }}
      </button>
    </div>

    <div v-if="gifUrl" class="result-section">
      <h2>Result</h2>
      <img :src="gifUrl" alt="Converted GIF" />
      <a :href="gifUrl" download="converted.gif" class="download-btn">Download GIF</a>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default {
  name: 'VideoToGifConverter',
  data() {
    return {
      selectedFile: null,
      startTime: 0,
      duration: 5,
      fps: 10,
      width: 500,
      gifUrl: null,
      isConverting: false,
      error: null,
      ffmpeg: null
    };
  },
  async mounted() {
    this.ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      this.gifUrl = null;
      this.error = null;
    },
    async convertToGif() {
      if (!this.selectedFile) {
        this.error = 'Please select a video file first';
        return;
      }

      this.isConverting = true;
      this.error = null;

      try {
        // Write the file to FFmpeg's virtual file system
        await this.ffmpeg.writeFile('input.mp4', await fetchFile(this.selectedFile));

        // Run the FFmpeg command to convert video to GIF
        await this.ffmpeg.exec([
          '-i', 'input.mp4',
          '-ss', this.startTime.toString(),
          '-t', this.duration.toString(),
          '-vf', `fps=${this.fps},scale=${this.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
          '-loop', '0',
          'output.gif'
        ]);

        // Read the result
        const data = await this.ffmpeg.readFile('output.gif');

        // Create a URL for the GIF
        this.gifUrl = URL.createObjectURL(
          new Blob([data], { type: 'image/gif' })
        );
      } catch (err) {
        console.error('Conversion error:', err);
        this.error = 'Conversion failed. Please try another video or adjust parameters.';
      } finally {
        this.isConverting = false;
      }
    }
  }
};
</script>

<style scoped>
.converter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.upload-section {
  margin: 20px 0;
  text-align: center;
}

.upload-btn {
  display: inline-block;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #369f6e;
}

input[type="file"] {
  display: none;
}

.controls {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.control-group {
  margin-bottom: 10px;
}

.control-group label {
  display: inline-block;
  width: 150px;
}

button {
  display: block;
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result-section {
  margin-top: 20px;
  text-align: center;
}

.download-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #4285f4;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.error-message {
  color: #ff4444;
  margin-top: 15px;
  text-align: center;
}
</style>
