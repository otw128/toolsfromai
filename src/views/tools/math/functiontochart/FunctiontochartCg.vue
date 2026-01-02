<template>
  <canvas
    ref="canvas"
    :width="width"
    :height="height"
    style="border: 1px solid #ccc"
  />
</template>

<script setup>
import { onMounted, ref, watch } from "vue"

const canvas = ref(null)

const width = 800
const height = 500

// Coordinate system
const xMin = -10
const xMax = 10
const yMin = -10
const yMax = 10

// ---- Define your functions here ----
const f = (x) => Math.sin(x)
const g = (x) => x + f(x) // y = x + f(x)

const draw = () => {
  const ctx = canvas.value.getContext("2d")
  ctx.clearRect(0, 0, width, height)

  const scaleX = width / (xMax - xMin)
  const scaleY = height / (yMax - yMin)

  const toCanvasX = (x) => (x - xMin) * scaleX
  const toCanvasY = (y) => height - (y - yMin) * scaleY

  // ---- Draw axes ----
  ctx.strokeStyle = "#aaa"
  ctx.lineWidth = 1

  // X-axis
  ctx.beginPath()
  ctx.moveTo(0, toCanvasY(0))
  ctx.lineTo(width, toCanvasY(0))
  ctx.stroke()

  // Y-axis
  ctx.beginPath()
  ctx.moveTo(toCanvasX(0), 0)
  ctx.lineTo(toCanvasX(0), height)
  ctx.stroke()

  // ---- Draw function y = x + f(x) ----
  ctx.strokeStyle = "#007bff"
  ctx.lineWidth = 2
  ctx.beginPath()

  let first = true
  for (let x = xMin; x <= xMax; x += 0.01) {
    const y = g(x)
    const cx = toCanvasX(x)
    const cy = toCanvasY(y)

    if (first) {
      ctx.moveTo(cx, cy)
      first = false
    } else {
      ctx.lineTo(cx, cy)
    }
  }
  ctx.stroke()
}

onMounted(draw)
</script>
