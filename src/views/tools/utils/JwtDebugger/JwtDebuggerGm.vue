<script setup>
import { ref, computed, watch } from 'vue';

// --- State ---
const rawToken = ref('');
// Default initial state
const headerInput = ref('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
const payloadInput = ref('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
const secret = ref('secret');
const isDecoding = ref(false);

// --- Helpers for Base64URL (Modern & Unicode Safe) ---
const base64UrlDecode = (str) => {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.stringify(JSON.parse(jsonPayload), null, 2);
  } catch (e) {
    return null; 
  }
};

const base64UrlEncode = (str) => {
  try {
    return window.btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    return '';
  }
};

// --- Reactive Logic ---

// 1. If user changes the TOKEN (Top Box) -> Update JSON (Bottom Boxes)
watch(rawToken, (newToken) => {
  if (isDecoding.value) return; // Prevent infinite loop

  const parts = newToken.split('.');
  if (parts.length >= 2) {
    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);

    if (header) headerInput.value = header;
    if (payload) payloadInput.value = payload;
  }
});

// 2. If user changes JSON (Bottom Boxes) -> Update TOKEN (Top Box)
// We watch Header, Payload, or Secret changes
watch([headerInput, payloadInput, secret], () => {
  isDecoding.value = true;
  
  const encodedHeader = base64UrlEncode(headerInput.value);
  const encodedPayload = base64UrlEncode(payloadInput.value);
  
  // Note: Real signature generation requires a crypto lib. 
  // We simulate the signature part here for UI demonstration.
  const signature = "SIGNATURE_HASH"; 
  
  rawToken.value = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  // Unlock the watcher after updates settle
  setTimeout(() => { isDecoding.value = false; }, 0);
}, { immediate: true }); 

</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-8 flex flex-col gap-6">
    
    <header class="flex justify-between items-end pb-2 border-b border-slate-200">
      <div>
        <h1 class="text-3xl font-extrabold text-indigo-600 tracking-tight">JWT Debugger</h1>
        <p class="text-slate-500 text-sm mt-1">Vue 3 + Tailwind CSS • Bi-directional Editing</p>
      </div>
      <div class="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
        <span class="px-2 py-1 bg-rose-100 text-rose-600 rounded">Header</span>
        <span class="px-2 py-1 bg-violet-100 text-violet-600 rounded">Payload</span>
        <span class="px-2 py-1 bg-cyan-100 text-cyan-600 rounded">Signature</span>
      </div>
    </header>

    <section class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <label class="text-sm font-semibold text-slate-700 uppercase tracking-wide">Encoded Token</label>
        <button 
          @click="navigator.clipboard.writeText(rawToken)"
          class="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition"
        >
          Copy to clipboard
        </button>
      </div>
      
      <div class="relative group">
        <textarea
          v-model="rawToken"
          class="w-full h-32 p-4 font-mono text-base bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition resize-none text-slate-600 break-all"
          placeholder="Paste JWT here..."
        ></textarea>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
      
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-rose-600 uppercase tracking-wide border-l-4 border-rose-500 pl-2">Header</label>
        <div class="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative focus-within:ring-2 focus-within:ring-rose-100 focus-within:border-rose-300 transition">
           <textarea
            v-model="headerInput"
            class="w-full h-full min-h-[200px] p-4 font-mono text-sm text-slate-700 resize-none outline-none"
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-violet-600 uppercase tracking-wide border-l-4 border-violet-500 pl-2">Payload</label>
        <div class="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-300 transition">
           <textarea
            v-model="payloadInput"
            class="w-full h-full min-h-[200px] p-4 font-mono text-sm text-slate-700 resize-none outline-none"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </section>

    <section class="bg-cyan-50 border border-cyan-100 rounded-lg p-4 flex items-center gap-4">
      <div class="text-cyan-700 font-bold text-sm uppercase whitespace-nowrap">Verify Signature</div>
      <input 
        v-model="secret"
        type="text" 
        placeholder="your-256-bit-secret"
        class="w-full bg-white border border-cyan-200 text-cyan-800 text-sm px-3 py-2 rounded focus:outline-none focus:border-cyan-400 font-mono"
      >
    </section>

  </div>
</template>

<style scoped>
/* Custom scrollbar for a cleaner look */
textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track {
  background: transparent; 
}
textarea::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; 
  border-radius: 4px; 
}
textarea::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8; 
}
</style>