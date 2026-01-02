<template>
  <div class="function-tochart-index">
    <h1>函数绘图工具集合</h1>
    <p class="subtitle">选择不同的绘图方式来可视化数学函数</p>

    <div class="tools-grid">
      <div 
        class="tool-card" 
        :class="{ active: currentTool === 'yb' }"
        @click="switchTool('yb')"
      >
        <div class="tool-icon">📊</div>
        <h3>基础绘图器yb</h3>
        <p>使用 Canvas API 绘制，支持自定义 X/Y 范围</p>
      </div>

      <div 
        class="tool-card" 
        :class="{ active: currentTool === 'gm' }"
        @click="switchTool('gm')"
      >
        <div class="tool-icon">📈</div>
        <h3>Chart.js 绘图gm</h3>
        <p>基于 Chart.js，支持平滑曲线和交互式图表</p>
      </div>

      <div 
        class="tool-card" 
        :class="{ active: currentTool === 'qw' }"
        @click="switchTool('qw')"
      >
        <div class="tool-icon">🎯</div>
        <h3>Math.js 绘图qw</h3>
        <p>使用 Math.js 解析表达式，支持复杂数学函数</p>
      </div>

      <div 
        class="tool-card" 
        :class="{ active: currentTool === 'cg' }"
        @click="switchTool('cg')"
      >
        <div class="tool-icon">✏️</div>
        <h3>自定义绘图cg</h3>
        <p>简化版 Canvas 绘图，快速可视化函数</p>
      </div>
    </div>

    <div class="tool-container">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'

const currentTool = ref('yb')

const componentMap = {
  yb: defineAsyncComponent(() => import('./FunctiontochartYb.vue')),
  gm: defineAsyncComponent(() => import('./FunctiontochartGm.vue')),
  qw: defineAsyncComponent(() => import('./FunctiontochartQw.vue')),
  cg: defineAsyncComponent(() => import('./FunctiontochartCg.vue'))
}

const currentComponent = computed(() => componentMap[currentTool.value])

const switchTool = (tool) => {
  currentTool.value = tool
}
</script>

<style scoped>
.function-tochart-index {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.tool-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.tool-card:hover {
  border-color: #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.tool-card.active {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.tool-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.tool-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.tool-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.tool-container {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  min-height: 500px;
}
</style>
