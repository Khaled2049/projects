import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BaseCard from './components/base/BaseCard.vue';
import BaseButton from './components/base/BaseButton.vue';
import BaseBadge from './components/base/BaseBadge.vue';
import BaseSpinner from './components/base/BaseSpinner.vue';
import BaseDialog from './components/base/BaseDialog.vue';

createApp(App)
    .component('base-card', BaseCard)
    .component('base-button', BaseButton)
    .component('base-badge', BaseBadge)
    .component('base-spinner', BaseSpinner)
    .component('base-dialog', BaseDialog)
    .use(store).use(router)
    .mount('#app')
