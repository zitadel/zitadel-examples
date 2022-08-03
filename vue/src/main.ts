import "./assets/main.css";

import { createApp } from "vue";

import App from "./App.vue";
import mainOidc from "./auth/auth";
import router from "./router";
import type { OidcAuth } from "vue-oidc-client/vue3";

mainOidc.startup().then((ok) => {
  if (ok) {
    const app = createApp(App);

    app.use(router);

    app.config.globalProperties.$oidc = mainOidc as OidcAuth;

    app.mount("#app");
  } else {
    console.log("Startup was not ok");
  }
});
