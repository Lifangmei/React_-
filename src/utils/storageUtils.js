/*
进行loacl数据存储管理的工具模块
*/

import store from 'store'

const USER_KEY = 'user_key'

const storageUtils = {
    // 保存用户
    saveUser(userObj){
        store.set(USER_KEY,userObj)
    },
    // 读取用户
    getUser(){
        return store.get(USER_KEY)||{}
    },
    // 删除用户
    removeUser(){
        store.remove(USER_KEY)
    }
}
export default storageUtils