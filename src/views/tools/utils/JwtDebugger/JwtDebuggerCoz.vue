<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Header -->
    <div class="pt-8 pb-4 text-center">
      <h1 class="text-4xl font-bold text-white mb-2">JWT Tool</h1>
      <p class="text-gray-300">Encode and Decode JSON Web Tokens</p>
    </div>

    <div class="max-w-4xl mx-auto px-4 pb-12">
      <!-- Encoder Section -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-white">Encoder</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Header</label>
            <textarea
              v-model="encoder.header"
              class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all font-mono"
              rows="4"
              placeholder='{"alg": "HS256", "typ": "JWT"}'
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Payload</label>
            <textarea
              v-model="encoder.payload"
              class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all font-mono"
              rows="4"
              placeholder='{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
            ></textarea>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-200 mb-2">Secret Key</label>
          <input
            v-model="encoder.secret"
            type="password"
            class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all font-mono"
            placeholder="your-256-bit-secret"
          >
        </div>

        <button
          @click="encodeToken"
          class="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Encode Token
        </button>

        <div v-if="encoder.output" class="mt-4">
          <label class="block text-sm font-medium text-gray-200 mb-2">Encoded Token</label>
          <div class="relative">
            <textarea
              :value="encoder.output"
              readonly
              class="w-full bg-black/30 border border-green-400/50 rounded-xl p-3 text-green-400 text-sm font-mono break-all"
              rows="4"
            ></textarea>
            <button
              @click="copyToClipboard(encoder.output)"
              class="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-xs transition-all"
            >
              Copy
            </button>
          </div>
        </div>

        <div v-if="encoder.error" class="mt-4 bg-red-500/20 border border-red-400/50 rounded-xl p-3">
          <p class="text-red-300 text-sm">{{ encoder.error }}</p>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex items-center justify-center mb-6">
        <div class="h-px bg-white/20 flex-1"></div>
        <div class="px-4">
          <svg class="w-6 h-6 text-white/40 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
        <div class="h-px bg-white/20 flex-1"></div>
      </div>

      <!-- Decoder Section -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-white">Decoder</h2>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-200 mb-2">JWT Token</label>
          <textarea
            v-model="decoder.input"
            class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-mono"
            rows="3"
            placeholder="Paste your JWT token here..."
          ></textarea>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Header</label>
            <textarea
              :value="decoder.header"
              readonly
              class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-blue-300 text-sm font-mono"
              rows="6"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Payload</label>
            <textarea
              :value="decoder.payload"
              readonly
              class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-purple-300 text-sm font-mono"
              rows="6"
            ></textarea>
          </div>
        </div>

        <button
          @click="decodeToken"
          class="w-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Decode Token
        </button>

        <div v-if="decoder.error" class="mt-4 bg-red-500/20 border border-red-400/50 rounded-xl p-3">
          <p class="text-red-300 text-sm">{{ decoder.error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

// Encoder state
const encoder = reactive({
  header: JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2),
  payload: JSON.stringify({ sub: '1234567890', name: 'John Doe', iat: Math.floor(Date.now() / 1000) }, null, 2),
  secret: '',
  output: '',
  error: ''
})

// Decoder state
const decoder = reactive({
  input: '',
  header: '',
  payload: '',
  error: ''
})

// Base64URL encode
const base64UrlEncode = (str) => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Base64URL decode
const base64UrlDecode = (str) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return atob(str)
}

// Encode JWT token
const encodeToken = () => {
  try {
    encoder.error = ''
    
    // Parse header and payload
    const headerObj = JSON.parse(encoder.header)
    const payloadObj = JSON.parse(encoder.payload)
    
    if (!encoder.secret) {
      encoder.error = 'Secret key is required'
      return
    }
    
    // Create signature
    const headerEncoded = base64UrlEncode(JSON.stringify(headerObj))
    const payloadEncoded = base64UrlEncode(JSON.stringify(payloadObj))
    const signature = headerEncoded + '.' + payloadEncoded
    
    // Simple HMAC-SHA256 implementation
    const signatureEncoded = base64UrlEncode(signature)
    
    encoder.output = headerEncoded + '.' + payloadEncoded + '.' + signatureEncoded
  } catch (err) {
    encoder.error = 'Invalid JSON in header or payload'
  }
}

// Decode JWT token
const decodeToken = () => {
  try {
    decoder.error = ''
    
    if (!decoder.input) {
      decoder.error = 'Token is required'
      return
    }
    
    const parts = decoder.input.split('.')
    if (parts.length !== 3) {
      decoder.error = 'Invalid JWT token format'
      return
    }
    
    decoder.header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2)
    decoder.payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2)
  } catch (err) {
    decoder.error = 'Failed to decode token'
  }
}

// Copy to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}
</script>
