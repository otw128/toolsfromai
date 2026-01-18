<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">JWT Toolkit</h1>
        <p class="text-gray-600">Encode and decode JSON Web Tokens with ease</p>
      </header>

      <!-- Encoder Section -->
      <section class="bg-white rounded-2xl shadow-xl p-6 mb-8 transition-all hover:shadow-2xl">
        <div class="flex items-center mb-4">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <h2 class="text-xl font-semibold text-gray-800">JWT Encoder</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Header Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Header</label>
            <textarea 
              v-model="encoder.header"
              class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder='{"alg": "HS256", "typ": "JWT"}'
            ></textarea>
          </div>
          
          <!-- Payload Input -->
          <div>
            <label class="block text-sm fontereum text-gray-700 mb-2">Payload</label>
            <textarea 
              v-model="encoder.payload"
              class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder='{"sub": "1234567890", "name": "John Doe"}'
            ></textarea>
          </div>
        </div>
        
        <!-- Secret Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
          <input 
            v-model="encoder.secret"
            type="password"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Enter secret key for signing"
          >
        </div>
        
        <!-- Token Output -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Encoded JWT</label>
          <div class="relative">
            <input 
              :value="encodedToken"
              readonly
              class="w-full p-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
            >
            <button 
              @click="copyToClipboard(encodedToken)"
              class="absolute right-3 top-3 text-gray-500 hover:text-indigo-600 transition"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Encode Button -->
        <button
          @click="encodeJWT"
          :disabled="!encoder.header || !encoder.payload"
          class="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-md transition transform hover:-translate-y-0.5"
        >
          Encode JWT
        </button>
      </section>

      <!-- Decoder Section -->
      <section class="bg-white rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl">
        <div class="flex items-center mb-4">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <h2 class="text-xl font-semibold text-gray-800">JWT Decoder</h2>
        </div>
        
        <!-- JWT Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">JWT Token</label>
          <textarea 
            v-model="decoder.token"
            class="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-mono text-sm"
            placeholder="Paste your JWT token here..."
          ></textarea>
        </div>
        
        <!-- Decode Button -->
        <button
          @click="decodeJWT"
          :disabled="!decoder.token"
          class="w-full py-3 px-4 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-md transition transform hover:-translate-y-0.5"
        >
          Decode JWT
        </button>
        
        <!-- Decoded Output -->
        <div v-if="decodedData" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Header Output -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="font-medium text-gray-700 mb-2 flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Header
              </h3>
              <pre class="text-sm overflow-x-auto whitespace-pre-wrap break-words">{{ decodedData.header }}</pre>
            </div>
            
            <!-- Payload Output -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="font-medium text-gray-700 mb-2 flex items-center">
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Payload
              </h3>
              <pre class="text-sm overflow-x-auto whitespace-pre-wrap break-words">{{ decodedData.payload }}</pre>
            </div>
          </div>
          
          <!-- Signature -->
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="font-medium text-gray-700 mb-2 flex items-center">
              <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Signature
            </h3>
            <p class="font-mono text-sm break-all">{{ decodedData.signature }}</p>
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {{ errorMessage }}
        </div>
      </section>
      
      <!-- Footer -->
      <footer class="mt-12 text-center text-gray-600 text-sm">
        <p>JWT tokens should never contain sensitive information as they can be easily decoded</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Base64 utility functions
const base64UrlDecode = (str) => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = 4 - (base64.length % 4)
  return base64 + '='.repeat(pad)
}

const base64UrlEncode = (str) => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Encoder state
const encoder = ref({
  header: '{"alg":"HS256","typ":"JWT"}',
  payload: '{"sub":"1234567890","name":"John Doe","iat":1516239022}',
  secret: 'your-secret-key'
})

// Decoder state
const decoder = ref({
  token: ''
})

// Computed encoded token
const encodedToken = computed(() => {
  try {
    const header = base64UrlEncode(JSON.stringify(JSON.parse(encoder.value.header)))
    const payload = base64UrlEncode(JSON.stringify(JSON.parse(encoder.value.payload)))
    return `${header}.${payload}` // Note: Actual signature requires crypto, this is simplified
  } catch {
    return 'Invalid JSON in header or payload'
  }
})

// Decoded data
const decodedData = ref(null)
const errorMessage = ref('')

// Encode JWT (simplified - no actual signature generation)
const encodeJWT = () => {
  // In a real implementation, you would generate the signature using crypto libraries
  // This example shows the structure without actual cryptographic signing
  console.log('Encoded token (without signature):', encodedToken.value)
}

// Decode JWT
const decodeJWT = () => {
  errorMessage.value = ''
  decodedData.value = null
  
  try {
    const tokenParts = decoder.value.token.split('.')
    if (tokenParts.length !== 3) {
      throw new Error('Invalid JWT structure')
    }
    
    const header = JSON.parse(atob(base64UrlDecode(tokenParts[0])))
    const payload = JSON.parse(atob(base64UrlDecode(tokenParts[1])))
    
    decodedData.value = {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: tokenParts[2]
    }
  } catch (error) {
    errorMessage.value = 'Failed to decode JWT: ' + error.message
  }
}

// Copy to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      // Optional: Show success feedback
      console.log('Copied to clipboard')
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}
</script>

<style scoped>
/* Custom scrollbar for pre elements */
pre {
  max-height: 200px;
  overflow-y: auto;
}
pre::-webkit-scrollbar {
  width: 6px;
}
pre::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
pre::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}
pre::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>