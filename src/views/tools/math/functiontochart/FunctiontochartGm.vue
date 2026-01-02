<script setup>
import { ref, computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import * as math from 'mathjs';

// 1. Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 2. Reactive State
const formula = ref('x + sin(x)'); // Default function
const xMin = ref(-10);
const xMax = ref(10);
const step = ref(0.5); // Resolution of the graph
const errorMsg = ref('');

// 3. Logic to generate data points
const chartData = computed(() => {
  const labels = [];
  const dataPoints = [];
  errorMsg.value = '';

  try {
    // Compile the expression using mathjs for safety and speed
    const expr = math.compile(formula.value);

    // Loop through the range
    for (let x = parseFloat(xMin.value); x <= parseFloat(xMax.value); x += parseFloat(step.value)) {
      // Fix floating point math issues (e.g. 0.1 + 0.2)
      const currentX = parseFloat(x.toFixed(2));
      
      // Evaluate the user's formula at the current X
      // scope is { x: currentX }
      const y = expr.evaluate({ x: currentX });

      labels.push(currentX);
      dataPoints.push(y);
    }
  } catch (e) {
    // Handle invalid formulas (e.g., user is still typing)
    errorMsg.value = 'Invalid formula';
    return { labels: [], datasets: [] };
  }

  return {
    labels: labels,
    datasets: [
      {
        label: `f(x) = ${formula.value}`,
        backgroundColor: '#42b983',
        borderColor: '#42b983',
        data: dataPoints,
        tension: 0.4, // Makes the line curved/smooth
        pointRadius: 2, // Size of the dots
      }
    ]
  };
});

// 4. Chart Configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: { display: true, text: 'x' },
      grid: { color: '#e5e5e5' }
    },
    y: {
      title: { display: true, text: 'f(x)' },
      grid: { color: '#e5e5e5' }
    }
  }
};
</script>

<template>
  <div class="graph-container">
    <h2>Function Plotter</h2>
    
    <div class="controls">
      <div class="input-group">
        <label>Equation f(x) = </label>
        <input v-model="formula" type="text" placeholder="e.g., x + cos(x)" />
      </div>

      <div class="range-inputs">
        <div class="input-group">
          <label>Min X:</label>
          <input v-model="xMin" type="number" />
        </div>
        <div class="input-group">
          <label>Max X:</label>
          <input v-model="xMax" type="number" />
        </div>
        <div class="input-group">
          <label>Step:</label>
          <input v-model="step" type="number" step="0.1" />
        </div>
      </div>
    </div>

    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.graph-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 20px;
}

.controls {
  background: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.range-inputs {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.chart-wrapper {
  height: 400px; /* Important for Chart.js responsiveness */
  position: relative;
}

.error {
  color: red;
  margin-bottom: 10px;
}
</style>