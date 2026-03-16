import "bootstrap";
import "./assets/css/dx.material.custom-mpm.css";
import "./assets/css/custom.css";
import "devextreme/dist/css/dx.light.css";
import "./assets/css/app.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import config from "devextreme/core/config";
config({ licenseKey: import.meta.env.VITE_LICENSE_KEY_DEVEXTREME });

import { createPinia } from "pinia";
import { createApp } from "vue";
import router from "./routes/router";
import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);
router.isReady().then(() => {
    app.mount("#app");
});