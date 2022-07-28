/*
发送异步ajax请求的函数模块
封装axios库
返回promise对象
统一处理请求异常：返回一个自己创建的promise对象
*/

import axios from 'axios'
import {message} from 'antd'

message.config({
    top: 100,
  });

export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject)=>{
        // 执行异步ajax请求
        let promise
        if(type==='GET'){
            promise = axios.get(url,{params:data})
        }else{
            promise = axios.post(url,data)
        }
        // 请求成功
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{// 请求失败，使用antd中的message组件提示错误信息
            message.error('请求出错'+error.message)
            reject()
        })        
    })   
}

