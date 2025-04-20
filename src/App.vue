<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameBoard from './components/GameBoard.vue'
import Snackbar from './components/Snackbar.vue'

const deferredPrompt = ref<Event | null>(null)
const showInstallPrompt = ref(false)

const snackbarRef = ref<InstanceType<typeof Snackbar> | null>(null)

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator.standalone === true)
  )
}

onMounted(() => {
  if (isInStandaloneMode()) return

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    snackbarRef.value?.show('✅ ¡App instalada!')
    showInstallPrompt.value = false
    deferredPrompt.value = null
  })
})

function installApp() {
  if (!deferredPrompt.value) return

  // @ts-ignore
  deferredPrompt.value.prompt()
  // @ts-ignore
  deferredPrompt.value.userChoice.then((choiceResult: any) => {
    if (choiceResult.outcome === 'accepted') {
      snackbarRef.value?.show('✅ Instalación aceptada')
    } else {
      snackbarRef.value?.show('❌ Instalación cancelada')
    }
    showInstallPrompt.value = false
    deferredPrompt.value = null
  })
}
</script>

<template>
  <div class="app-wrapper">
    <button
      v-if="showInstallPrompt"
      @click="installApp"
      class="install-button"
    >
      📲 Instalar App
    </button>

    <GameBoard />
    <Snackbar ref="snackbarRef" />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.install-button {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
html, body {
  overscroll-behavior-y: contain;
  touch-action: manipulation; /* evita gestos innecesarios */
}
</style>
