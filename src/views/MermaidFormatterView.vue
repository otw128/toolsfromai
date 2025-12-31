<script setup>
const files = [
  {
    name: 'mermaid-cg.html',
    size: '1.14 KB',
    path: '/web/md/mermaid/mermaid-cg.html'
  },
  {
    name: 'mermaid-gm.html',
    size: '3.59 KB',
    path: '/web/md/mermaid/mermaid-gm.html'
  },
  {
    name: 'mermaid-qw.html',
    size: '4.28 KB',
    path: '/web/md/mermaid/mermaid-qw.html'
  },
  {
    name: 'mermaid-yb.html',
    size: '24.45 KB',
    path: '/web/md/mermaid/mermaid-yb.html'
  }
]
</script>

<template>
  <div class="body-container">
    <div class="container">
      <div class="header">
        <h1>Mermaid Files</h1>
        <p>Select a file to view</p>
      </div>
      <div class="file-list">
        <a
          v-for="file in files"
          :key="file.name"
          :href="file.path"
          class="file-item"
        >
          <div class="file-icon">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
            </svg>
          </div>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-size">{{ file.size }}</div>
          </div>
          <div class="arrow">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M10 17l5-5-5-5v10z"/>
            </svg>
          </div>
        </a>
      </div>
      <div class="back-link">
        <RouterLink to="/">← Back to Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  text-align: center;
}

.header h1 {
  color: white;
  font-size: 28px;
  font-weight: 600;
}

.header p {
  color: rgba(255, 255, 255, 0.9);
  margin-top: 8px;
  font-size: 14px;
}

.file-list {
  padding: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.file-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.file-item:hover .file-name {
  color: white;
}

.file-item:hover .file-size {
  color: rgba(255, 255, 255, 0.8);
}

.file-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
}

.file-icon svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.file-item:hover .file-icon {
  background: white;
}

.file-item:hover .file-icon svg {
  fill: #667eea;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.file-size {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.arrow {
  opacity: 0;
  transition: all 0.3s ease;
}

.file-item:hover .arrow {
  opacity: 1;
  transform: translateX(5px);
}

.back-link {
  padding: 20px;
  text-align: center;
  border-top: 1px solid #eee;
}

.back-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.back-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>
