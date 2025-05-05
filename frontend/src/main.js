import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/authStore';

import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const app = createApp(App);
const pinia = createPinia();


app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.restoreUser(); 

app.mount('#app');