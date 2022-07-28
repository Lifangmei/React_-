/*
用于接收当前state和action，并返回新的state的reducer函数模块
*/

import {combineReducers} from 'redux'
import storageUtils from '../utils/storageUtils'
import { SET_HEAD_TITLE, RECEIVE_USER, RESET_USER } from './action-types'

//用于管理头部标题的reducer
const initHeadTitle = '首页'
function headTitle(state=initHeadTitle,action){
    const {type,data} = action
    switch (type){
        case SET_HEAD_TITLE:
            return data
        default:
            return state
    }
}

//用于管理当前登录用户的reducer
const initUser = storageUtils.getUser()
function user(state=initUser,action){
    const {type,data} = action
    switch (type){
        case RECEIVE_USER:
            return data
        case RESET_USER:
            return {}
        default:
            return state
    }
}

// 合并并暴露总的reducer
export default combineReducers({
    headTitle,
    user
})