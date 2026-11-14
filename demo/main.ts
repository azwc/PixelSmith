import { createApp } from 'vue'
import PixelSmith from '../src/vue'
import '../src/styles/index.css'
import './styles/demo.css'
import App from './App.vue'

createApp(App).use(PixelSmith).mount('#app')
