<template>
  <div class="video-to-gif">
    <h2>Video → GIF Converter</h2>

    <input type="file" accept="video/*" @change="onFileChange" />

    <div class="controls" v-if="videoFile">
      <label>
        Start (s):
        <input type="number" v-model.number="startTime" min="0" />
      </label>

      <label>
        Duration (s):
        <input type="number" v-model.number="duration" min="1" />
      </label>

      <label>
        FPS:
        <input type="number" v-model.number="fps" min="5" max="30" />
      </label>

      <label>
        Width (px):
        <input type="number" v-model.number="width" min="100" />
      </label>

      <button :disabled="loading" @click="convert">
        {{ loading ? "Converting..." : "Convert to GIF" }}
      </button>
    </div>

    <div v-if="gifUrl" class="result">
      <h3>Result</h3>
      <img :src="gifUrl" />
      <br />
      <a :href="gifUrl" download="output.gif">Download GIF</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/util"

const ffmpeg = new FFmpeg()

const videoFile = ref(null)
const gifUrl = ref(null)
const loading = ref(false)

const startTime = ref(0)
const duration = ref(3)
const fps = ref(10)
const width = ref(320)

const onFileChange = (e) => {
  videoFile.value = e.target.files[0]
  gifUrl.value = null
}

const loadFFmpeg = async () => {
  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js",
      wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.wasm",
    })
  }
}

const convert = async () => {
  if (!videoFile.value) return

  loading.value = true
  gifUrl.value = null

  await loadFFmpeg()

  const inputName = "input.mp4"
  const outputName = "output.gif"

  await ffmpeg.writeFile(inputName, await fetchFile(videoFile.value))

  await ffmpeg.exec([
    "-ss", `${startTime.value}`,
    "-t", `${duration.value}`,
    "-i", inputName,
    "-vf", `fps=${fps.value},scale=${width.value}:-1:flags=lanczos`,
    outputName,
  ])

  const gifData = await ffmpeg.readFile(outputName)
  const blob = new Blob([gifData.buffer], { type: "image/gif" })
  gifUrl.value = URL.createObjectURL(blob)

  loading.value = false
}
</script>

<style scoped>
.video-to-gif {
  max-width: 500px;
  font-family: system-ui, sans-serif;
}

.controls label {
  display: block;
  margin: 8px 0;
}

button {
  margin-top: 10px;
  padding: 6px 12px;
}

.result img {
  max-width: 100%;
  border: 1px solid #ccc;
}
</style>
