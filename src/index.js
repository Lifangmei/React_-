/*
入口文件
*/

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import store from './redux/store'

// 渲染APP组件标签到index页面中的div上
ReactDOM.render(
    <Provider store={store}>
      <App/>  
    </Provider>
,document.getElementById('root'))