/*
右侧展示区顶部组件
*/

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { message,Modal,Button } from 'antd'
import {connect} from 'react-redux'
import { logout } from '../../redux/actions'
import './index.less'
import { reqIp, reqWeather } from '../../api/index'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

class Header extends Component {
  // 初始化时间、地点和天气状态
  state = {
    currentTime:formateDate(Date.now()),
    city:'正在定位...',
    weather:'正在查询...',
    temperature:''
  }
  // 发送请求获取天气信息的方法
  getWeather = async  () => {
    // 发送IP定位请求获取当前城市和城市编码
    const ip = await reqIp()
    let adcode
    if(ip.status === '1'){
      // 定位成功就更新城市和城市编码
      const {city} = ip
      adcode = ip.adcode
      this.setState({city})
    }else{
      message.error('获取定位失败')
    }
    // 根据城市编码获取城市天气信息
    const result = await reqWeather(adcode)
    if(result.status === '1'){
      // 获取天气信息成功就更新天气状态
      const {weather,temperature} = result.lives[0]
      this.setState({weather,temperature:temperature+'℃'})
    }else{
      message.error('获取天气信息失败')
    }
  }
  // 退出登录的方法
  logout = () => {
    Modal.confirm({
      title: '您想要退出当前登录吗？',
      okText: '确认',
      cancelText: '取消',   
      onOk: () => {        
        // 确认退出时调用分发action的函数
        this.props.logout()
      }
    })
  }
  // 在第一次调用render之前就获取天气信息
  constructor(props){
    super(props)
    this.getWeather()
  }
  // 组件挂载完毕时开启定时器，实时更新时间 
  componentDidMount(){
    this.timer = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000);
  }
  // 组件将要卸载时关闭定时器
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  render() {
    // 获取当前对应title
    const title = this.props.headTitle
    // 获取最新状态数据
    const {currentTime,city,weather,temperature} = this.state
    // 获取当前登录的用户名
    const username = this.props.user.username
    return (
      <div className='header'>
          <div className="header-top">
            <span>欢迎，{username}</span>
            <Button type='link' onClick={this.logout}>退出</Button>
          </div>
          <div className="header-bottom">
            <div className="header-bottom-left">{title}</div>
            <div className="header-bottom-right">
              <span>{currentTime}</span>
              <span>
                {city}：{weather}，{temperature}
              </span>
            </div>
          </div>
      </div>
    )
  }
}
// 创建并暴露容器组件
export default connect(
  state => ({headTitle:state.headTitle,user:state.user}),
  {logout}
)(withRouter(Header))  // 包装一般组件Header，使其具有路由组件特有的API