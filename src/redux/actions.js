/*
用于创建多个action的工厂函数模块
*/

import { message } from "antd"
import { reqLogin } from "../api"
import storageUtils from "../utils/storageUtils"
import { SET_HEAD_TITLE, RECEIVE_USER, RESET_USER } from "./action-types"

// 用于设置头部标题的action
export const setHeadTitle = headTitle => ({type:SET_HEAD_TITLE,data:headTitle})

// 用于接收用户对象的action
export const receiveUser = user => ({type:RECEIVE_USER,data:user})

// 用于登录用户的异步action
export const login = (username,password) => {
    return async dispatch => {
        // 发送登录请求
        const result = await reqLogin(username,password)
        if(result.status === 0){
            // 登录成功后获取当前登录用户并保存到local中
            const user = result.data
            storageUtils.saveUser(user)
            // 分发action更新redux中的user
            dispatch(receiveUser(user))
            message.success('登录成功')
        }else{
            // 登录失败提示错误信息
            message.error(result.msg)
        }
    }
}

// 用于退出登录的action
export const logout = () => {
    // 清空local中保存的用户
    storageUtils.removeUser()
    return {type:RESET_USER}
}