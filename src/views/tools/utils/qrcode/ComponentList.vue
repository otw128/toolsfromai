<script setup>
const files = [
  {
    name: 'QrcodeCg.vue',
    path: '/tools/utils/qrcode/QrcodeCg.vue'
  },
  {
    name: 'QrcodeGm.vue',
    path: '/tools/utils/qrcode/QrcodeGm.vue'
  },
  {
    name: 'QrcodeQw.vue',
    path: '/tools/utils/qrcode/QrcodeQw.vue'
  },
  {
    name: 'QrcodeYb.vue',
    path: '/tools/utils/qrcode/QrcodeYb.vue'
  }
]
</script>

<template>
  <div class="body-container">
    <div class="container">
      <div class="header">
        <h1>QR Code Components</h1>
        <p>Select a Vue component to view</p>
      </div>
      <div class="file-list">
        <RouterLink
          v-for="file in files"
          :key="file.name"
          :to="file.path"
          class="file-item"
        >
          <div class="file-icon">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
            </svg>
          </div>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
          </div>
          <div class="arrow">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M10 17l5-5-5-5v10z"/>
            </svg>
          </div>
        </RouterLink>
      </div>
      <div class="back-link">
        <RouterLink to="/">← Back to Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body-container {
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
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
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
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
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 175, 25, 0.3);
}

.file-item:hover .file-name {
  color: white;
}

.file-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
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
  fill: #f5af19;
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
  color: #f5af19;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.back-link a:hover {
  color: #f12711;
  text-decoration: underline;
}
</style>
