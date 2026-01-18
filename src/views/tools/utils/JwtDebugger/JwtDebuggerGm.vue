<script setup>
import { ref, computed, watch } from 'vue';

// --- State ---
const rawToken = ref('');
const headerInput = ref('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
const payloadInput = ref('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
const secret = ref('your-256-bit-secret');
const is decoding = ref(false);

// --- Utilities ---

// Base64URL Decode (Handling the URL safe characters)
const base64UrlDecode = (str) => {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.stringify(JSON.parse(jsonPayload), null, 2);
  } catch (e) {
    return null;
  }
};

// Base64URL Encode
const base64UrlEncode = (str) => {
  try {
    return window.btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    return '';
  }
};

// --- Logic ---

// 1. Watch for changes in the RAW TOKEN (Decoder Logic)
watch(rawToken, (newToken) => {
  if (is decoding.value) return; // Prevent loop
  
  const parts = newToken.split('.');
  if (parts.length === 3 || parts.length === 2) {
    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);

    if (header) headerInput.value = header;
    if (payload) payloadInput.value = payload;
  }
});

// 2. Watch for changes in JSON INPUTS (Encoder Logic)
// Note: We are simulating the signature here as browser-side crypto is complex 
// for a single snippet. In a real app, use 'jose' or 'jsonwebtoken'.
const encodedHeader = computed(() => base64UrlEncode(headerInput.value));
const encodedPayload = computed(() => base64UrlEncode(payloadInput.value));

watch([headerInput, payloadInput, secret], () => {
  isDecoding.value = true;
  // Reconstruct token: Header.Payload.Signature(Mock)
  // We keep the signature part generic or empty since we aren't doing actual HMAC calculation here
  // to avoid external dependencies.
  rawToken.value = `${encodedHeader.value}.${encodedPayload.value}.SIGNATURE_PLACEHOLDER`;
  
  // Reset flag after a tick
  setTimeout(() => { isDecoding.value = false; }, 0);
});

// Helper to determine text color based on JWT part convention
const colorMap = {
  header: 'text-rose-500',
  payload: 'text-violet-500',
  signature: 'text-cyan-500'
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-10 flex flex-col gap-6">
    
    <div class="flex justify-between items-center mb-2">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">JWT Debugger</h1>
        <p class="text-slate-500 mt-1">Encode and decode JSON Web Tokens in real-time.</p>
      </div>
      <div class="flex gap-2">
        <span class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wide">Header</span>
        <span class="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wide">Payload</span>
        <span class="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wide">Signature</span>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
      <div class="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
        <h2 class="font-semibold text-slate-700 uppercase text-sm tracking-wider">Encoded Token</h2>
        <button 
          @click="navigator.clipboard.writeText(rawToken)"
          class="text-xs bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 py-1 rounded transition"
        >
          Copy Token
        </button>
      </div>
      <div class="relative group">
        <textarea
          v-model="rawToken"
          class="w-full h-40 p-6 font-mono text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-slate-600 break-all"
          placeholder="Paste your JWT here..."
        ></textarea>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
      
      <div class="bg-white rounded-2xl shadow-xl border-l-4 border-rose-500 overflow-hidden flex flex-col">
        <div class="bg-rose-50/50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
          <h2 class="font-bold text-rose-600 uppercase text-sm tracking-wider">Header</h2>
          <span class="text-xs text-rose-400 font-mono">Algorithm & Token Type</span>
        </div>
        <textarea
          v-model="headerInput"
          class="w-full h-full min-h-[250px] p-6 font-mono text-sm text-slate-700 focus:outline-none focus:bg-slate-50 resize-none"
          spellcheck="false"
        ></textarea>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border-l-4 border-violet-500 overflow-hidden flex flex-col">
        <div class="bg-violet-50/50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
          <h2 class="font-bold text-violet-600 uppercase text-sm tracking-wider">Payload</h2>
          <span class="text-xs text-violet-400 font-mono">Data Claims</span>
        </div>
        <textarea
          v-model="payloadInput"
          class="w-full h-full min-h-[250px] p-6 font-mono text-sm text-slate-700 focus:outline-none focus:bg-slate-50 resize-none"
          spellcheck="false"
        ></textarea>
      </div>

    </div>

    <div class="bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500 overflow-hidden">
       <div class="bg-cyan-50/50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
          <h2 class="font-bold text-cyan-600 uppercase text-sm tracking-wider">Verify Signature</h2>
        </div>
        <div class="p-6 flex flex-col md:flex-row gap-4 items-center">
          <div class="font-mono text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded border border-slate-200 select-none">
            HMACSHA256(
            <span class="text-rose-500">base64UrlEncode(header)</span> + "." +
            <span class="text-violet-500">base64UrlEncode(payload)</span>,
            <span class="text-cyan-600">your-256-bit-secret</span>
            )
          </div>
          <input 
            v-model="secret"
            type="text" 
            placeholder="Enter your secret key"
            class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-mono text-cyan-700"
          >
        </div>
    </div>

  </div>
</template>

<style scoped>
/* Custom Scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track {
  background: #f1f5f9; 
}
textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}
textarea::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>