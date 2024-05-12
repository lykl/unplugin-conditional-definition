import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

// #ifdef MOBILE
console.log('MOBILE')
// #endif

createApp(App).mount('#root')
