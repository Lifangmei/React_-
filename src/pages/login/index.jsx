/*
登录的路由组件
*/

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { login } from '../../redux/actions'
import { LoginForm, ProFormText} from '@ant-design/pro-form'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './index.less'
import logo from '../../assets/images/logo.png'

class Login extends Component {
  // onFinish会在表单提交且数据验证成功才执行回调
  onFinish = async (values) => {
    const {username,password} = values
    // 调用分发异步action的函数
    this.props.login(username,password)
    // // 发送登录的ajax请求，获取请求结果   
    // const result = await reqLogin(username,password)
    // if(result.status === 0){
    //   message.success('登录成功！')
    //   // 保存用户到内存中
    //   memoryUtils.user = result.data
    //   // 保存用户到loacl中
    //   storageUtils.saveUser(result.data)      
    //   this.props.history.replace('/home')
    // }else{
    //   // 登录失败获取错误信息
    //   const msg = result.msg
    //   message.error(msg)
    // }   
  }
  // 自定义验证用户名
  validateUser = (_,value) => {
    if(!value){
      return Promise.reject(new Error('用户名必须输入！'))
     }else if(value.length<4||value.length>12){
      return Promise.reject('用户名长度必须为4-12位！')
     }else if(!/^\w+$/.test(value)){
      return Promise.reject('用户名必须由字母、数字或下划线组成！') 
     }else{
      return Promise.resolve()
     }
  }
  // 自定义验证密码
  validatePwd = (_,value) => {
    if(!value){
     return Promise.reject(new Error('密码必须输入！'))
    }else if(value.length<4||value.length>12){
     return Promise.reject('密码长度必须为4-12位！')
    }else if(!/^\w+$/.test(value)){
     return Promise.reject('密码必须由字母、数字或下划线组成！') 
    }else{
     return Promise.resolve()
    }
  }
  render() {
    // 判断redux中是否有user，如果有就自动登录
    const {user} = this.props
    if(user._id){
      return <Redirect to='/home'/>
    }
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>React：后台管理应用</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          {/* 使用antd中的高级表单登录组件 */}
          <LoginForm onFinish={this.onFinish}>
              {/* 用户名输入框 */}
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} style={{color:'rgba(0,0,0,.25)'}}/>,
                }}
                placeholder='用户名'
                // 用户名设置默认值
                initialValue='admin'
                // 表单用户名的自定义验证
                rules={[
                  {
                    validator:this.validateUser
                  }
                ]}
              />
              {/* 密码输入框 */}
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} style={{color:'rgba(0,0,0,.25)'}}/>,
                }}
                placeholder={'密码'}
                // 表单密码的自定义验证
                rules={[
                  {
                    validator:this.validatePwd
                  }
                ]}
              />
          </LoginForm>
        </section>
      </div>
    )
  }
}
// 创建并暴露容器组件
export default connect(
  state => ({user:state.user}),
  {login}
)(Login)