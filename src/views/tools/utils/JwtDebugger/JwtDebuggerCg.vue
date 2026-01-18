<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
    <!-- Header -->
    <h1 class="text-4xl font-bold text-blue-600 mb-6">JWT Encoder/Decoder</h1>

    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
      <div class="mb-4">
        <label for="jwtInput" class="block text-lg font-semibold text-gray-700 mb-2">JWT Input</label>
        <textarea
          id="jwtInput"
          v-model="jwtInput"
          rows="5"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste your JWT here..."
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="flex justify-between items-center mb-4">
        <button
          @click="encodeJWT"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Encode JWT
        </button>
        <button
          @click="decodeJWT"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Decode JWT
        </button>
      </div>

      <!-- Output -->
      <div class="mt-4">
        <label for="jwtOutput" class="block text-lg font-semibold text-gray-700 mb-2">Output</label>
        <textarea
          id="jwtOutput"
          v-model="jwtOutput"
          rows="5"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          readonly
          placeholder="Your encoded/decoded JWT will appear here..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jwtInput: '',
      jwtOutput: '',
    };
  },
  methods: {
    // Method to encode the JWT
    encodeJWT() {
      try {
        const payload = JSON.parse(this.jwtInput);
        const base64Url = this.encodeBase64(JSON.stringify(payload));
        const header = { alg: 'HS256', typ: 'JWT' };
        const base64Header = this.encodeBase64(JSON.stringify(header));
        const signature = 'dummy-signature'; // Add your own signing logic here

        this.jwtOutput = `${base64Header}.${base64Url}.${signature}`;
      } catch (e) {
        this.jwtOutput = 'Invalid JSON input';
      }
    },

    // Method to decode the JWT
    decodeJWT() {
      try {
        const parts = this.jwtInput.split('.');
        if (parts.length === 3) {
          const decodedPayload = this.decodeBase64(parts[1]);
          this.jwtOutput = JSON.stringify(JSON.parse(decodedPayload), null, 2);
        } else {
          this.jwtOutput = 'Invalid JWT format';
        }
      } catch (e) {
        this.jwtOutput = 'Invalid JWT format';
      }
    },

    // Helper to encode to Base64 URL
    encodeBase64(str) {
      return btoa(unescape(encodeURIComponent(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    },

    // Helper to decode Base64 URL
    decodeBase64(str) {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(escape(atob(str)));
    },
  },
};
</script>

<style scoped>
textarea:focus {
  box-shadow: 0 0 5px 2px rgba(66, 153, 225, 0.5);
}
</style>
