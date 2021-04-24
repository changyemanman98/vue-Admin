import Vue from "vue";

// 自定义全局组件
import Svgicon from "./Svgicon.vue";
Vue.component('svg-icon',Svgicon);

/* 
* require.context 读取指定目录所有文件
* require.context(‘./svg’, false, /\.svg$/) 参数说明：
* 第一个：目录
* 第二个：是否遍历子级目录
* 第三个：定义遍历文件规则
*/
const req = require.context('./svg',false,/\.svg$/) //正则表示读取以.svg格式的文件
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)