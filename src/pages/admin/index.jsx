/*
后台管理的路由组件
*/
import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout } from 'antd'
import 'antd/dist/antd.less'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from './home'
import Category from './products/category'
import Product from './products/product'
import User from './user'
import Role from './authority'
import Bar from './charts/bar'
import Line from './charts/line'
import Pie from './charts/pie'
import NotFound from './not-found'

const { Footer, Sider, Content } = Layout

class Admin extends Component {
  render() {
    // 判断redux中是否有user，如果没有就跳转到登录页面
    const {user} = this.props
    if(!user||!user._id){
      return <Redirect to='/login'/>
    }
    return (
        <Layout style={{minHeight:'100%'}}>
          <Sider>
            <LeftNav />
          </Sider>
          <Layout>
            <Header/>
            <Content style={{margin:20,backgroundColor:'#fff'}}>
              <Switch>
                {/* 只输入根路径时跳转到首页 */}
                <Redirect exact from='/' to='/home'/>
                <Route path='/home' component={Home}/>
                <Route path='/products/category' component={Category}/>
                <Route path='/products/product' component={Product}/>
                <Route path='/user' component={User}/>
                <Route path='/authority' component={Role}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                {/* 输入其它路径跳转到404页面 */}
                <Route component={NotFound}/>                
              </Switch>
            </Content>
            <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
    )
  }
}
// 创建并暴露容器组件
export default connect(
  state => ({user:state.user}),
  {}
)(Admin)