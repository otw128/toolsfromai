<template>
  <div>
    <h2>Convert Video to GIF</h2>
    <input type="file" accept="video/*" @change="handleFileUpload" />
    <br /><br />

    <div v-if="loading">Converting... (this may take a while)</div>

    <div v-if="gifUrl">
      <h3>Preview:</h3>
      <img :src="gifUrl" alt="Converted GIF" style="max-width: 100%;" />
      <br /><br />
      <a :href="gifUrl" download="output.gif">Download GIF</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
const loading = ref(false);
const gifUrl = ref('');

const loadFFmpeg = async () => {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
};

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  loading.value = true;
  gifUrl.value = '';

  try {
    if (!ffmpeg.loaded) {
      await loadFFmpeg();
    }

    // Write the video file to FFmpeg's virtual file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));

    // Run FFmpeg command to convert video to GIF
    // You can adjust fps, scale, etc.
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-t', '5',               // limit to first 5 seconds
      '-vf', 'fps=10,scale=320:240:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
      '-loop', '0',
      'output.gif'
    ]);

    // Read the output GIF
    const data = await ffmpeg.readFile('output.gif');
    const blob = new Blob([data], { type: 'image/gif' });
    gifUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Conversion failed:', error);
    alert('Failed to convert video. Check console for details.');
  } finally {
    loading.value = false;
  }
};
</script>