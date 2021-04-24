import Vue from "vue";
import store from "@/store/index";
// 自定义指令
Vue.directive("btnPerm",{
    // 父级未渲染
    bind:function(el,bingind,vnode){
      // el
      // 操作DOM
      if(bingind.def.hasBtnPerm(bingind.value)) {
        el.style.display = "inline-block";
      }
    },
    // 操作父节点
    inserted:function(){},
    update:function(){},
    componentUpdated:function(){},
    unbind:function(){},
    hasBtnPerm:function(permission){
      const button = store.getters["app/buttonPermission"];
      const roles = store.getters["app/roles"];  // 获取角色
      // 如果是超管直接开放所有按钮
      if(roles.includes("admin")) { return true; }
      return button.indexOf(permission) != -1;
    }
  })