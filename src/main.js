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
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
