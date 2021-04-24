import Vue from "vue";
import VueRouter from "vue-router";
// 引入布局组件(Layout下是index.vue,则可以省略index.vue,其他文件名不行)
import Layout from "@/views/Layout"
Vue.use(VueRouter);

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

/* 
* 1 系统分配
* 2 角色分配
* 
* 工作时， 动态路由到底是由后台返回出来，还是由前端配?
* 一般由前端配, 可以达到前后端分离的效果
*/
/* 
* 1 默认路由
* 2 动态路由
*/

// 默认路由
export const defaultRouterMap = [
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
  // 404页面
  {
    path: "/page404",
    meta:{
      name:"404",
      icon:"404"
    },
    hidden: true,
    component: Layout,
    children:[
      {
        path: "/404",
        meta:{
          name:"404"
        },
        component: () => import("../views/404.vue"),
      }
    ]
  },
]

// 动态路由
// sale,technician,manager
export const asnycRouterMap = [
  /* 
  *信息管理
  */
  {
    path: "/info",
    name:"info",
    meta:{
      role: ['sale', 'manager'],
      system: 'infoSystem',  //自定义key
      name:"信息管理",
      icon:"info"
    },
    component: Layout,
    children:[
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta:{
          keepAlice: true,
          role: ['sale', 'manager'],
          name:"信息列表"
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta:{
          keepAlice: true,
          role: ['sale', 'manager'],
          name:"信息分类"
        },
        component: () => import("../views/Info/category.vue"),
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta:{
          keepAlice: true,
          role: ['sale'],
          name:"信息详情"
        },
        component: () => import("../views/Info/detailed.vue"),
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
      role: ['sale'],
      system: 'userSystem',  //自定义key
      name:"用户管理",
      icon:"user"
    },
    component: Layout,
    children:[
      {
        path: "/userIndex",
        name: "UserIndex",
        meta:{
          role: ['sale'],
          name:"用户列表"
        },
        component: () => import("../views/User/index.vue"),
      }
    ]
  },
  // 如果页面地址匹配不到路由,会自动匹配 path: "*" 路由, 由重定向跳转到404
  { path: "*", redirect: "/404", hidden: true }
]

export default new VueRouter({
  routes: defaultRouterMap
});


