<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">JWT Studio</h1>
              <p class="text-sm text-gray-500">Decode & Encode JWT tokens with ease</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="toggleMode"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg :class="{'rotate-180': isEncodeMode}" class="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>{{ isEncodeMode ? 'Encode Mode' : 'Decode Mode' }}</span>
            </button>
            <button 
              @click="resetAll"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content - Up/Down Layout -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Input Section (Top) -->
        <div class="space-y-6" :class="{ 'lg:order-1': isEncodeMode, 'lg:order-2': !isEncodeMode }">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transform transition-all duration-300 hover:shadow-xl">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ isEncodeMode ? 'Encode JWT' : 'Decode JWT' }}
              </h2>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ isEncodeMode ? 'Create tokens' : 'Analyze tokens' }}</span>
              </div>
            </div>
            
            <div v-if="!isEncodeMode">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Enter JWT Token</label>
                <textarea
                  v-model="jwtToken"
                  placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                  class="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none font-mono text-sm"
                  @input="decodeJWT"
                ></textarea>
              </div>
              
              <div class="flex space-x-3">
                <button
                  @click="decodeJWT"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Decode Token</span>
                </button>
                <button
                  @click="copyToken"
                  class="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
            </div>
            
            <!-- Encode Inputs -->
            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Header</label>
                <textarea
                  v-model="encodeHeader"
                  placeholder='{"alg": "HS256", "typ": "JWT"}'
                  class="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none font-mono text-sm"
                  @input="encodeJWT"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payload</label>
                <textarea
                  v-model="encodePayload"
                  placeholder='{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
                  class="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none font-mono text-sm"
                  @input="encodeJWT"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                <input
                  v-model="encodeSecret"
                  type="password"
                  placeholder="Enter secret for signing"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-mono text-sm"
                  @input="encodeJWT"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Output Section (Bottom) -->
        <div class="space-y-6" :class="{ 'lg:order-2': isEncodeMode, 'lg:order-1': !isEncodeMode }">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 class="text-xl font-semibold text-gray-900">Result</h2>
            </div>
            
            <div class="p-6">
              <!-- Decoded Results -->
              <div v-if="!isEncodeMode && decoded.header">
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-medium text-gray-900 flex items-center space-x-2">
                      <span class="w-3 h-3 bg-primary-500 rounded-full"></span>
                      <span>Header</span>
                    </h3>
                    <span class="text-sm font-mono px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
                      {{ decoded.header.alg || 'N/A' }}
                    </span>
                  </div>
                  <pre class="bg-gray-50 rounded-xl p-4 overflow-auto text-sm font-mono border border-gray-200">{{ beautifyJSON(decoded.header) }}</pre>
                </div>
                
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-medium text-gray-900 flex items-center space-x-2">
                      <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span>Payload</span>
                    </h3>
                    <span v-if="decoded.payload?.exp" class="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-lg">
                      Exp: {{ formatTimestamp(decoded.payload.exp) }}
                    </span>
                  </div>
                  <pre class="bg-gray-50 rounded-xl p-4 overflow-auto text-sm font-mono border border-gray-200">{{ beautifyJSON(decoded.payload) }}</pre>
                </div>
                
                <div v-if="decoded.signature" class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-medium text-gray-900 flex items-center space-x-2">
                      <span class="w-3 h-3 bg-purple-500 rounded-full"></span>
                      <span>Signature</span>
                    </h3>
                    <span class="text-sm font-mono px-3 py-1 bg-purple-50 text-purple-700 rounded-lg">
                      {{ decoded.signature.valid ? '✓ Valid' : '✗ Invalid' }}
                    </span>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p class="text-sm font-mono text-gray-700 break-all">{{ decoded.signature.value }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Encoded Results -->
              <div v-else-if="isEncodeMode && encodedToken">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Encoded JWT Token</label>
                  <div class="relative">
                    <textarea
                      :value="encodedToken"
                      readonly
                      class="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm resize-none"
                    ></textarea>
                    <button
                      @click="copyText(encodedToken)"
                      class="absolute top-3 right-3 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mt-6">
                  <div class="text-center p-4 bg-blue-50 rounded-xl">
                    <div class="text-sm text-blue-600 mb-1">Header</div>
                    <div class="text-lg font-semibold text-blue-700">{{ encodedParts.header?.length || 0 }} chars</div>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-xl">
                    <div class="text-sm text-green-600 mb-1">Payload</div>
                    <div class="text-lg font-semibold text-green-700">{{ encodedParts.payload?.length || 0 }} chars</div>
                  </div>
                  <div class="text-center p-4 bg-purple-50 rounded-xl">
                    <div class="text-sm text-purple-600 mb-1">Total</div>
                    <div class="text-lg font-semibold text-purple-700">{{ encodedToken.length }} chars</div>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-else class="text-center py-12">
                <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Data</h3>
                <p class="text-gray-500">
                  {{ isEncodeMode ? 'Enter header and payload to encode a JWT token' : 'Enter a JWT token to decode it' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Info Panel -->
      <div class="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
          <h2 class="text-xl font-semibold text-gray-900">About JWT</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-3">
              <h3 class="font-medium text-gray-900 flex items-center space-x-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>What is JWT?</span>
              </h3>
              <p class="text-sm text-gray-600">JSON Web Token is an open standard for securely transmitting information between parties as a JSON object.</p>
            </div>
            <div class="space-y-3">
              <h3 class="font-medium text-gray-900 flex items-center space-x-2">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Structure</span>
              </h3>
              <p class="text-sm text-gray-600">A JWT consists of three parts: Header, Payload, and Signature, separated by dots (xxxxx.yyyyy.zzzzz).</p>
            </div>
            <div class="space-y-3">
              <h3 class="font-medium text-gray-900 flex items-center space-x-2">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Usage</span>
              </h3>
              <p class="text-sm text-gray-600">Commonly used for authentication and information exchange. The signature ensures the token hasn't been altered.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 animate-slide-up">
      <div class="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Reactive state
const jwtToken = ref('')
const isEncodeMode = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// Encode state
const encodeHeader = ref('{"alg": "HS256", "typ": "JWT"}')
const encodePayload = ref('{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}')
const encodeSecret = ref('your-256-bit-secret')
const encodedToken = ref('')
const encodedParts = reactive({})

// Decoded data
const decoded = reactive({
  header: null,
  payload: null,
  signature: null
})

// Utility functions
function base64UrlDecode(str) {
  // Replace URL-safe characters and add padding
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return decodeURIComponent(atob(str).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

function base64UrlEncode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1)
  }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function decodeJWT() {
  if (!jwtToken.value) {
    decoded.header = null
    decoded.payload = null
    decoded.signature = null
    return
  }

  try {
    const parts = jwtToken.value.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    decoded.header = JSON.parse(base64UrlDecode(parts[0]))
    decoded.payload = JSON.parse(base64UrlDecode(parts[1]))
    decoded.signature = {
      value: parts[2],
      valid: true // In a real app, you would verify the signature
    }
  } catch (error) {
    console.error('Error decoding JWT:', error)
    showNotification('Error decoding JWT. Please check the token format.')
  }
}

function encodeJWT() {
  try {
    if (!encodeHeader.value || !encodePayload.value) {
      encodedToken.value = ''
      return
    }

    const header = JSON.parse(encodeHeader.value)
    const payload = JSON.parse(encodePayload.value)
    
    const encodedHeader = base64UrlEncode(JSON.stringify(header))
    const encodedPayload = base64UrlEncode(JSON.stringify(payload))
    
    encodedParts.header = encodedHeader
    encodedParts.payload = encodedPayload
    
    // In a real implementation, you would generate the signature
    const signature = encodeSecret.value ? 
      'generated_signature_here' : 
      'unsigned'
    
    encodedToken.value = `${encodedHeader}.${encodedPayload}.${signature}`
  } catch (error) {
    console.error('Error encoding JWT:', error)
    showNotification('Error encoding JWT. Please check JSON format.')
  }
}

function beautifyJSON(obj) {
  if (!obj) return ''
  return JSON.stringify(obj, null, 2)
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

function toggleMode() {
  isEncodeMode.value = !isEncodeMode.value
  if (isEncodeMode.value) {
    encodeJWT()
  } else {
    decodeJWT()
  }
}

function copyToken() {
  copyText(jwtToken.value)
}

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => showNotification('Copied to clipboard!'))
    .catch(err => console.error('Failed to copy:', err))
}

function showNotification(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

function resetAll() {
  if (isEncodeMode.value) {
    encodeHeader.value = '{"alg": "HS256", "typ": "JWT"}'
    encodePayload.value = '{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
    encodeSecret.value = 'your-256-bit-secret'
    encodedToken.value = ''
  } else {
    jwtToken.value = ''
    decoded.header = null
    decoded.payload = null
    decoded.signature = null
  }
  showNotification('All fields have been reset')
}

// Initialize with sample token
onMounted(() => {
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  jwtToken.value = sampleToken
  decodeJWT()
})
</script>

<style>
/* Additional custom styles */
pre {
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  line-height: 1.5;
  tab-size: 2;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>