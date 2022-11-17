/*
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 16:24:34
 * @FilePath: \web-project\src\main.js
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/styles/index.scss'; // global css
import ElementUI from 'element-ui';

createApp(App).use(store).use(router).use(ElementUI).mount("#app");
