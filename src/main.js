import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api"; 
import "./icons"
import "./router/promit"

Vue.use(VueCompositionApi);
Vue.use(ElementUI);
Vue.config.productionTip = false;


// runtime(运行模式)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
