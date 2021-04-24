import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api"; 
import "./router/promit"
// 自定义全局组件
import "./icons"
// 全局方法引入按钮权限
import { buttonPermission } from "@/utils/buttonPermission";
// 自定义指令处理按钮权限
import "@/utils/buttonPerm";

Vue.prototype.btnPerm = buttonPermission;
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;



// runtime(运行模式)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
