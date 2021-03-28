const state = {
    id: '' || sessionStorage.getItem('infoId'),
    title: '' || sessionStorage.getItem('infoTitle')
  }
  
  const getters = {  //computed
    infoId: state => state.id,
    infoTitle: state => state.title
  }
  
  const mutations = {   //必须的 同步 没有回调处理事情
    UPDATA_STATE_VALUE(state,params){
        for(let key in params){
            // 储存值
            state[key] = params[key].value;
            // 是否存储session
            if(params[key].session){
                sessionStorage.setItem(params[key].sessionKey, params[key].value);
            }
        }
    },


    // SET_ID(state,value){
    //     state.id = value;
    //     sessionStorage.setItem('infoId', value);
    // },
    // SET_TITLE(state,value){
    //     state.title = value;
    //     sessionStorage.setItem('infoTitle', value);
    // }
  }
  
  const action = {   //必须的 同步 没有回调处理事情
    
  }

  export default{
    namespaced:true,
    state,
    getters,
    mutations,
    action
  }