<template>
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h1>Function Plotter</h1>
    
    <!-- Input section -->
    <div style="margin-bottom: 20px;">
      <label for="functionInput">Enter function f(x): </label>
      <input 
        id="functionInput"
        v-model="userFunction"
        type="text" 
        placeholder="e.g., x + sin(x)"
        style="width: 300px; padding: 5px; margin-right: 10px;"
        @keyup.enter="plotFunction"
      >
      <button @click="plotFunction" style="padding: 5px 10px;">Plot</button>
    </div>

    <!-- Canvas container -->
    <div style="position: relative; width: 600px; height: 400px; border: 1px solid #ccc;">
      <canvas 
        ref="plotCanvas" 
        width="600" 
        height="400"
        style="background-color: #f9f9f9;"
      ></canvas>
      
      <!-- Error message overlay -->
      <div 
        v-if="errorMessage"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
               background: rgba(255, 0, 0, 0.8); color: white; padding: 10px; border-radius: 4px;">
        {{ errorMessage }}
      </div>
    </div>
    
    <!-- Instructions -->
    <p style="margin-top: 15px; color: #666; max-width: 600px;">
      Supported operations: +, -, *, /, ^ (power)<br>
      Functions: sin, cos, tan, log, sqrt, abs, etc.<br>
      Constants: pi, e<br>
      Example: <code>x + sin(x)</code>, <code>x^2 - 2*x + 1</code>
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as math from 'mathjs';

export default {
  name: 'FunctionPlotter',
  setup() {
    const plotCanvas = ref(null);
    const userFunction = ref('x + sin(x)');
    const errorMessage = ref('');

    // Initialize canvas context
    let ctx = null;
    const xAxis = 200; // y=0 line position (pixels from top)
    const yAxis = 300; // x=0 line position (pixels from left)
    const scaleX = 30; // pixels per unit (x-axis)
    const scaleY = 30; // pixels per unit (y-axis)

    // Draw coordinate axes
    const drawAxes = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, 600, 400);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, xAxis);
      ctx.lineTo(600, xAxis);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(yAxis, 0);
      ctx.lineTo(yAxis, 400);
      ctx.stroke();
      
      // Axis labels
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText('x', 580, xAxis - 5);
      ctx.fillText('y', yAxis + 5, 15);
    };

    // Plot the function
    const plotFunction = () => {
      errorMessage.value = '';
      drawAxes();
      
      try {
        // Parse user input
        const expr = math.compile(userFunction.value);
        const scope = { x: 0 };
        
        // Set up drawing
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let firstPoint = true;
        let prevY = 0;
        
        // Plot points from x = -10 to x = 10
        for (let screenX = 0; screenX <= 600; screenX += 1) {
          // Convert screen coordinate to mathematical x
          const x = (screenX - yAxis) / scaleX;
          scope.x = x;
          
          let y;
          try {
            y = expr.evaluate(scope);
            // Handle non-numeric results
            if (typeof y !== 'number' || !isFinite(y)) {
              throw new Error('Invalid value');
            }
          } catch (e) {
            // Skip invalid points (asymptotes, etc.)
            if (!firstPoint) {
              ctx.stroke(); // End current segment
              ctx.beginPath();
              firstPoint = true;
            }
            continue;
          }
          
          // Convert mathematical y to screen coordinate
          const screenY = xAxis - y * scaleY;
          
          // Start new path or draw line
          if (firstPoint) {
            ctx.moveTo(screenX, screenY);
            firstPoint = false;
          } else {
            // Check for discontinuities (large jumps)
            if (Math.abs(screenY - prevY) > 500) {
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
          prevY = screenY;
        }
        ctx.stroke();
      } catch (error) {
        console.error('Plotting error:', error);
        errorMessage.value = 'Invalid function. Please check your input.';
      }
    };

    // Initialize canvas on mount
    onMounted(() => {
      ctx = plotCanvas.value.getContext('2d');
      drawAxes();
      plotFunction(); // Plot initial function
    });

    return {
      plotCanvas,
      userFunction,
      errorMessage,
      plotFunction
    };
  }
};
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>