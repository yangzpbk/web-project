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
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as Icons from '@element-plus/icons-vue';

const app = createApp(App).use(store).use(router).use(ElementPlus);

// element-ui 的 icon
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

app.mount("#app");
