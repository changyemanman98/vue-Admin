import {GetCategory} from "@/api/news"
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
    actions
  };