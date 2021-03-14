import { Login } from "@/api/login";
import { setToKen, setUserName, getUserName, removeToKen, removeUserName } from "@/utils/app";

const state = {
  isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
  to_ken: '',
  username: getUserName() || ''
};

const getters = {  //computed
  isCollapse: state => state.isCollapse,
  username: state => state.username
};

const mutations = {   //必须的 同步 没有回调处理事情
  SET_COLLAPSE(state){
    state.isCollapse = !state.isCollapse;
    sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse))
  },
  SET_TOKEN(state, value){
    state.to_ken = value;
  },
  SET_USERNAME(state, value){
    state.username = value;
  }
};

const actions = {   //可以回调处理事情
  // 登录
  login({commit}, requestData){
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData).then(response => {
        // token username
        let data = response.data.data;
        // 普通的
        // content.commit('SET_TOKEN', data.token);
        // content.commit('SET_USERNAME', data.username);
        // 解构的
        commit('SET_TOKEN', data.token);
        commit('SET_USERNAME', data.username);
        setToKen(data.token);
        setUserName(data.username);
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  exit({commit}){
    return new Promise((resolve, reject) => {
      removeUserName();
      removeToKen();
      commit('SET_USERNAME', '');
      commit('SET_TOKEN', '');
      resolve();
    })
  }
};



export default {
  namespaced : true,
  state,
  getters,
  mutations,
  actions
};
