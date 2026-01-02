<template>
  <div class="converter-container">
    <h2>Video to GIF Converter</h2>

    <div v-if="!gifUrl" class="upload-section">
      <input 
        type="file" 
        accept="video/*" 
        @change="handleFileUpload" 
        :disabled="isConverting"
      />
      <p v-if="!ffmpegLoaded" class="loading-text">Loading FFmpeg core...</p>
    </div>

    <div v-if="isConverting" class="progress-section">
      <p>Converting... {{ progress }}%</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="log-message">{{ logMessage }}</p>
    </div>

    <div v-if="gifUrl" class="result-section">
      <h3>Conversion Complete!</h3>
      <img :src="gifUrl" alt="Converted GIF" class="gif-preview" />
      
      <div class="actions">
        <a :href="gifUrl" download="output.gif" class="btn primary">Download GIF</a>
        <button @click="reset" class="btn secondary">Convert Another</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
const ffmpegLoaded = ref(false);
const isConverting = ref(false);
const progress = ref(0);
const logMessage = ref('');
const gifUrl = ref(null);

// Load FFmpeg on mount
onMounted(async () => {
  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    
    // Subscribe to log events
    ffmpeg.on('log', ({ message }) => {
      logMessage.value = message;
      console.log(message);
    });

    // Subscribe to progress events
    ffmpeg.on('progress', ({ progress: p }) => {
      progress.value = Math.floor(p * 100);
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    ffmpegLoaded.value = true;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    logMessage.value = 'Error loading FFmpeg core.';
  }
});

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isConverting.value = true;
  progress.value = 0;
  
  try {
    // 1. Write the file to FFmpeg's virtual file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));

    // 2. Run the FFmpeg command
    // -i input.mp4: input file
    // -t 5: limit to first 5 seconds (optional, remove for full video)
    // -vf "fps=10,scale=320:-1": reduce fps and resize for web optimization
    // output.gif: output file name
    await ffmpeg.exec([
      '-i', 'input.mp4', 
      '-t', '5', 
      '-vf', 'fps=10,scale=320:-1:flags=lanczos', 
      '-c:v', 'gif',
      'output.gif'
    ]);

    // 3. Read the result
    const data = await ffmpeg.readFile('output.gif');

    // 4. Create a URL for the image
    gifUrl.value = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' })
    );
  } catch (error) {
    console.error('Conversion failed:', error);
    logMessage.value = 'Conversion failed. Check console for details.';
  } finally {
    isConverting.value = false;
  }
};

const reset = () => {
  gifUrl.value = null;
  progress.value = 0;
  logMessage.value = '';
};
</script>

<style scoped>
.converter-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: sans-serif;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin: 10px 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #42b883; /* Vue Green */
  transition: width 0.3s ease;
}

.gif-preview {
  max-width: 100%;
  border-radius: 4px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  border: none;
  font-weight: bold;
}

.primary {
  background-color: #42b883;
  color: white;
}

.secondary {
  background-color: #35495e;
  color: white;
}

.log-message {
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>