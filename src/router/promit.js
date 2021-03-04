import router from "./index";
import store from "../store/index";
import { getToKen, removeToKen, removeUserName } from "@/utils/app";

const whiteRouter = ['/login'];  //indexOf 方法, 判断数组中是否存在某个对象,如果不存在返回-1,若存在返回数组下标
// 路由守卫
router.beforeEach((to, from, next) => {
    if(getToKen()){
        console.log(to);
        if(to.path === "/login")
        {
            removeToKen();
            removeUserName();
            store.commit("app/SET_TOKEN",'');
            store.commit("app/SET_USERNAME",'');
            next();
        }else{
            // 获取用户角色
            // 动态分配路由权限
            next();
        }
        // 路由动态添加,分配菜单,不同角色分配不同菜单
    }else{
        if(whiteRouter.indexOf(to.path) !== -1)
        {
            next()
        }else{
            next('/login')  //路由指向
        }
        /* 
        * 1.直接进入index的时候,参数to变成"/index",触发路由指向,就会跑beforeEach
        * 2.再一次 next 指向了login,再次触发路由指向,再跑beforeEach,参数to被改变成了'/login'
        * 3.白名单判断存在,直接执行next(),因为没有参数,所以不会再跑beforeEach()
        */
    }
  })
  