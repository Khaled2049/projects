import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BaseCard from './components/base/BaseCard.vue';
import BaseButton from './components/base/BaseButton.vue';
import BaseBadge from './components/base/BaseBadge.vue';

createApp(App)
    .component('base-card', BaseCard)
    .component('base-button', BaseButton)
    .component('base-badge', BaseBadge)
    .use(store).use(router)
    .mount('#app')
