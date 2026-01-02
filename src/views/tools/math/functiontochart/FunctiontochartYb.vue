<template>
  <div class="function-plotter">
    <h1>Function Plotter</h1>
    
    <div class="controls">
      <label for="function-input">Enter function (use 'x' as variable):</label>
      <input 
        id="function-input" 
        v-model="functionString" 
        placeholder="e.g., x + Math.sin(x)" 
        @input="plotFunction"
      >
      
      <div class="range-controls">
        <label>X Range:</label>
        <input type="number" v-model.number="xMin" @change="plotFunction"> to
        <input type="number" v-model.number="xMax" @change="plotFunction">
        
        <label>Y Range:</label>
        <input type="number" v-model.number="yMin" @change="plotFunction"> to
        <input type="number" v-model.number="yMax" @change="plotFunction">
      </div>
    </div>
    
    <div class="plot-container">
      <canvas ref="canvas" width="800" height="500"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FunctionPlotter',
  data() {
    return {
      functionString: 'x + Math.sin(x)',
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      ctx: null,
      points: []
    };
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d');
    this.plotFunction();
  },
  methods: {
    plotFunction() {
      if (!this.functionString) return;
      
      try {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
        
        // Draw axes
        this.drawAxes();
        
        // Calculate points
        this.calculatePoints();
        
        // Draw function
        this.drawFunction();
        
      } catch (error) {
        console.error('Error plotting function:', error);
      }
    },
    drawAxes() {
      const canvas = this.$refs.canvas;
      const width = canvas.width;
      const height = canvas.height;
      
      // Calculate origin position
      const xOrigin = width * (-this.xMin) / (this.xMax - this.xMin);
      const yOrigin = height * (1 - (-this.yMin) / (this.yMax - this.yMin));
      
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      
      // X axis
      this.ctx.beginPath();
      this.ctx.moveTo(0, yOrigin);
      this.ctx.lineTo(width, yOrigin);
      this.ctx.stroke();
      
      // Y axis
      this.ctx.beginPath();
      this.ctx.moveTo(xOrigin, 0);
      this.ctx.lineTo(xOrigin, height);
      this.ctx.stroke();
      
      // Draw ticks on X axis
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      for (let x = Math.ceil(this.xMin); x <= this.xMax; x++) {
        if (x === 0) continue; // Skip origin
        const xPos = width * (x - this.xMin) / (this.xMax - this.xMin);
        this.ctx.beginPath();
        this.ctx.moveTo(xPos, yOrigin - 5);
        this.ctx.lineTo(xPos, yOrigin + 5);
        this.ctx.stroke();
        this.ctx.fillText(x.toString(), xPos, yOrigin + 8);
      }
      
      // Draw ticks on Y axis
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';
      for (let y = Math.ceil(this.yMin); y <= this.yMax; y++) {
        if (y === 0) continue; // Skip origin
        const yPos = height * (1 - (y - this.yMin) / (this.yMax - this.yMin));
        this.ctx.beginPath();
        this.ctx.moveTo(xOrigin - 5, yPos);
        this.ctx.lineTo(xOrigin + 5, yPos);
        this.ctx.stroke();
        this.ctx.fillText(y.toString(), xOrigin - 8, yPos);
      }
      
      // Draw origin label
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText('0', xOrigin - 8, yOrigin + 8);
    },
    calculatePoints() {
      const canvas = this.$refs.canvas;
      const width = canvas.width;
      const points = [];
      
      // Create a safe function evaluation
      const func = new Function('x', `return ${this.functionString};`);
      
      // Calculate points along x range
      for (let i = 0; i < width; i++) {
        const x = this.xMin + (i / width) * (this.xMax - this.xMin);
        try {
          const y = func(x);
          points.push({ x, y });
        } catch (e) {
          points.push({ x, y: NaN });
        }
      }
      
      this.points = points;
    },
    drawFunction() {
      const canvas = this.$refs.canvas;
      const width = canvas.width;
      const height = canvas.height;
      const yOrigin = height * (1 - (-this.yMin) / (this.yMax - this.yMin));
      
      this.ctx.strokeStyle = '#f00';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      
      let firstValidPoint = true;
      
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        const xPos = width * (point.x - this.xMin) / (this.xMax - this.xMin);
        const yPos = height * (1 - (point.y - this.yMin) / (this.yMax - this.yMin));
        
        if (isNaN(point.y) || point.y < this.yMin || point.y > this.yMax) {
          firstValidPoint = true;
          continue;
        }
        
        if (firstValidPoint) {
          this.ctx.moveTo(xPos, yPos);
          firstValidPoint = false;
        } else {
          this.ctx.lineTo(xPos, yPos);
        }
      }
      
      this.ctx.stroke();
    }
  }
};
</script>

<style scoped>
.function-plotter {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
}

#function-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  font-size: 16px;
}

.range-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
}

.range-controls label {
  margin-right: 5px;
}

.range-controls input {
  width: 60px;
  padding: 5px;
}

.plot-container {
  border: 1px solid #ddd;
  margin-top: 20px;
}
</style>
