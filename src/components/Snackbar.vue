<template>
  <div v-if="visible" class="snackbar">{{ message }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

function show(msg: string, duration = 2500) {
  message.value = msg
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #323232;
  color: #fff;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
</style>
