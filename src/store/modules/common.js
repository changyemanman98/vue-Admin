import {GetCategory} from "@/api/news"
const state = {
  // 填入解析后的地址
  qiniuUrl:""
}

const getters = {
  qiniuUrl: state => state.qiniuUrl
}

const actions = {   //可以回调处理事情
  getInfoCategory(content, requestData){
      return new Promise((resolve, reject) => {
        // 接口
        GetCategory({}).then(response => {
          resolve(response.data.data.data)
        }).catch(error => {
          reject(error)
        })
      })
  }
}
  
  export default {
    namespaced : true,
    state,
    getters,
    actions
  };