import './assets/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import idsrvAuth, { mainOidc } from './auth/auth';
import router from './router';

mainOidc.startup().then((ok) => {
  if (ok) {
    const app = createApp(App);

    app.use(createPinia());
    app.use(router);

    app.config.globalProperties.$oidc = idsrvAuth;

    app.mount("#app");
  } else {
    console.log("Startup was not ok");
  }
});
