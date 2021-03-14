import Vue from "vue";
import VueRouter from "vue-router";
// 引入布局组件(Layout下是index.vue,则可以省略index.vue,其他文件名不行)
import Layout from "@/views/Layout"

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta:{
      name:"主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta:{
      name:"登录"
    },
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/console",
    name:"Console",
    redirect: "index",
    meta:{
      name:"控制台",
      icon:"console"
    },
    component: Layout,
    children:[
      {
        path: "/index",
        name: "Index",
        component: () => import("../views/Console/index.vue"),
        meta:{
          name:"首页"
        }
      }
    ]
  },
  /* 
  *信息管理
  */
  {
    path: "/info",
    name:"info",
    meta:{
      name:"信息管理",
      icon:"info"
    },
    component: Layout,
    children:[
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta:{
          name:"信息列表"
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta:{
          name:"信息分类"
        },
        component: () => import("../views/Info/category.vue"),
      }
    ]
  },
  /* 
  *用户管理
  */
  {
    path: "/user",
    name:"User",
    meta:{
      name:"用户管理",
      icon:"user"
    },
    component: Layout,
    children:[
      {
        path: "/userIndex",
        name: "UserIndex",
        meta:{
          name:"用户列表"
        },
        component: () => import("../views/User/index.vue"),
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;


