import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// PWA Service worker
registerSW()

// Extra pull-to-refresh guard (belt-and-suspenders on top of the CSS
// `overscroll-behavior: none` / `overflow: hidden` shell). Only blocks
// downward drags that start on the page background (body/html) while the
// document is at the very top — never touches gestures inside scrollable
// lists, so scrolling inside the app is unaffected.
let touchStartY = 0
document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY
}, { passive: true })

document.addEventListener('touchmove', e => {
  const target = e.target
  const pullingDown = e.touches[0].clientY > touchStartY
  if (window.scrollY <= 0 && pullingDown && (target === document.body || target === document.documentElement)) {
    e.preventDefault()
  }
}, { passive: false })
