import { createApp } from 'vue'
import App from './App.vue'

require('./style.css')
// #ifdef MOBILE
console.log('main')
// #endif

createApp(App).mount('#app')
