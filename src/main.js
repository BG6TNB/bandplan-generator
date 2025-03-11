import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import pdfFrame from "@i2d/pdf-frame-vue";

createApp(App).component("pdfFrame", pdfFrame).mount('#app')
