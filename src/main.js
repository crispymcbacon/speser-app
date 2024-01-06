import './assets/app.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './lib/router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Toast css

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true
  }); // Toast

app.mount('#app')
