const state = {
  isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
};

const getters = {  //computed
  isCollapse: state => state.isCollapse
};

const mutations = {   //必须的 同步 没有回调处理事情
  SET_COLLAPSE(state){
    state.isCollapse = !state.isCollapse;

    sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse))
  }
};

const actions = {   //可以回调处理事情
  // 登录
  login(content, requestData){
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
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
