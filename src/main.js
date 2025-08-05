import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'vue-sonner'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// PWA Service worker
const updateSW = registerSW({
  onNeedRefresh() {
    toast('Nueva versión disponible', {
      description: 'Haz clic para actualizar',
      action: {
        label: 'Actualizar',
        onClick: () => {
          updateSW(true)
        }
      },
      duration: 10000
    })
  },
  onOfflineReady() {
    console.log('App lista para funcionar sin conexión.')
  }
})
