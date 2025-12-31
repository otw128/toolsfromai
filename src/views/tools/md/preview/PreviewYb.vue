<template>
  <div class="mermaid-preview">
    <div class="editor-section">
      <h2>Mermaid Editor</h2>
      <textarea
        v-model="mermaidCode"
        @input="updateDiagram"
        placeholder="Enter your Mermaid diagram code here..."
        spellcheck="false"
      ></textarea>
      <div class="controls">
        <button @click="formatCode" class="btn">
          <i class="fas fa-indent"></i> Format
        </button>
        <button @click="clearEditor" class="btn btn-danger">
          <i class="fas fa-trash"></i> Clear
        </button>
        <button @click="exportAsSVG" class="btn btn-success">
          <i class="fas fa-download"></i> Export SVG
        </button>
      </div>
      <div v-if="error" class="error-message">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>

    <div class="preview-section">
      <h2>Diagram Preview</h2>
      <div class="preview-container" ref="previewContainer">
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Rendering diagram...
        </div>
        <div v-else-if="!mermaidCode.trim()" class="empty-preview">
          Enter Mermaid code to see the diagram here
        </div>
        <div v-else class="diagram-container" ref="diagramContainer"></div>
      </div>
      <div class="zoom-controls">
        <button @click="zoomIn" class="btn">
          <i class="fas fa-search-plus"></i> Zoom In
        </button>
        <button @click="zoomOut" class="btn">
          <i class="fas fa-search-minus"></i> Zoom Out
        </button>
        <button @click="resetZoom" class="btn">
          <i class="fas fa-expand"></i> Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import mermaid from 'mermaid';
import { beautify } from 'js-beautify';

export default {
  name: 'MermaidPreview',
  data() {
    return {
      mermaidCode: `graph TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E`,
      loading: false,
      error: null,
      zoomLevel: 1,
      translate: { x: 0, y: 0 },
      startPoint: { x: 0, y: 0 },
      startTranslate: { x: 0, y: 0 },
      isPanning: false,
    };
  },
  mounted() {
    this.initMermaid();
    this.updateDiagram();
    this.setupPanning();
  },
  methods: {
    initMermaid() {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
        },
        securityLevel: 'loose',
      });
    },
    async updateDiagram() {
      const code = this.mermaidCode.trim();
      if (!code) {
        this.error = null;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // Clear previous diagram
        const container = this.$refs.diagramContainer;
        if (container) {
          container.innerHTML = '';
        }

        // Render new diagram
        const { svg } = await mermaid.render('mermaid-diagram', code);
        if (container) {
          container.innerHTML = svg;
          this.makeDiagramInteractive();
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    formatCode() {
      try {
        this.mermaidCode = beautify(this.mermaidCode, {
          indent_size: 2,
          indent_char: ' ',
          max_preserve_newlines: 1,
          preserve_newlines: true,
        });
      } catch (err) {
        console.error('Error formatting code:', err);
      }
    },
    clearEditor() {
      if (confirm('Are you sure you want to clear the editor?')) {
        this.mermaidCode = '';
        this.error = null;
      }
    },
    exportAsSVG() {
      const container = this.$refs.diagramContainer;
      if (!container || !container.firstChild) {
        alert('No diagram to export. Please generate a diagram first.');
        return;
      }

      const svgElement = container.firstChild.cloneNode(true);
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      // Add namespaces if not present
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "mermaid-diagram.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    makeDiagramInteractive() {
      const svgElement = this.$refs.diagramContainer?.firstChild;
      if (!svgElement) return;

      svgElement.style.transformOrigin = '0 0';
      svgElement.style.transform = `translate(${this.translate.x}px, ${this.translate.y}px) scale(${this.zoomLevel})`;
      svgElement.style.cursor = 'grab';
    },
    setupPanning() {
      const container = this.$refs.previewContainer;
      if (!container) return;

      container.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'svg') {
          this.isPanning = true;
          this.startPoint = { x: e.clientX, y: e.clientY };
          this.startTranslate = { ...this.translate };
          e.target.style.cursor = 'grabbing';
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.isPanning) return;

        const dx = e.clientX - this.startPoint.x;
        const dy = e.clientY - this.startPoint.y;

        this.translate.x = this.startTranslate.x + dx;
        this.translate.y = this.startTranslate.y + dy;

        this.makeDiagramInteractive();
      });

      document.addEventListener('mouseup', () => {
        this.isPanning = false;
        const svgElement = this.$refs.diagramContainer?.firstChild;
        if (svgElement) {
          svgElement.style.cursor = 'grab';
        }
      });
    },
    zoomIn() {
      this.zoomLevel *= 1.2;
      this.makeDiagramInteractive();
    },
    zoomOut() {
      this.zoomLevel /= 1.2;
      this.makeDiagramInteractive();
    },
    resetZoom() {
      this.zoomLevel = 1;
      this.translate = { x: 0, y: 0 };
      this.makeDiagramInteractive();
    },
  },
};
</script>

<style scoped>
.mermaid-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 100%;
  padding: 20px;
}

.editor-section,
.preview-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

textarea {
  flex-grow: 1;
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  margin-bottom: 15px;
}

textarea:focus {
  outline: 2px solid #42b983;
  border-color: transparent;
}

.preview-container {
  flex-grow: 1;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: auto;
  position: relative;
  min-height: 300px;
}

.diagram-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

.controls,
.zoom-controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.btn:hover {
  background: #3aa876;
}

.btn-danger {
  background: #e74c3c;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-success {
  background: #42b983;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  border-left: 4px solid #f5c6cb;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #42b983;
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 768px) {
  .mermaid-preview {
    grid-template-columns: 1fr;
  }
}
</style>
