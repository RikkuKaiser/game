import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.mount('#app')

// ✅ Registrar el Service Worker si es compatible
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker registrado', reg))
      .catch(err => console.error('❌ Error al registrar SW', err))
  })
}

