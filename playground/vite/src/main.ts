import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// #ifdef MOBILE
console.log('test')
// #endif

createApp(App).mount('#app')
