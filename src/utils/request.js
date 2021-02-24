import axios from "axios";
import { Message } from "element-ui"

// 创建一个axios,赋值给service

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devapi';

const service = axios.create({
    baseURL: BASEURL,
    timeout: 15000,  //超时
    // 网络请求接口,假设5000
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求前做什么
    // 后台需要前端这边传相关的参数(在请求头添加参数)
    // Token
    // userId
    // sui
    // 业务需求
    
    // 最终目的是在请求头添加参数
    config.headers['Token'] = "11111";
    config.headers['userId'] = "22222";
    config.headers['sui'] = "33333";

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
})

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对相应数据做些什么
    let data = response.data;
    // 业务需求

    if (data.resCode !== 0) {
        Message.error(data.message);
        return Promise.reject(data);
    } else {
        return response;
    }
}, function (error) {
    // 对响应数据错误做些什么
    return Promise.reject(error);
})

export default service;

/* 
 *使用export default时,文件不能同时存在多个default
 *文件import引用时可以不带花括号
 */