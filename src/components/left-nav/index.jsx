/*
左侧导航区组件
*/

import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd'
import {connect} from 'react-redux'
import {setHeadTitle} from '../../redux/actions'
import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu } = Menu
class LeftNav extends Component { 
  // 判断当前登录用户是否对某项菜单拥有权限的方法
  hasAuth = item => {
    // 获取菜单项的相关信息
    const {key,isPublic} = item
    // 获取当前登录用户的权限列表
    const menus = this.props.user.role.menus
    // 获取当前登录用户的用户名
    const {username} = this.props.user
    // 符合以下条件认为有权限
    if(username==='admin'||isPublic||menus.indexOf(key)!==-1){
      return true
    }else if(item.children){
      return !!item.children.find(cItem => menus.indexOf(cItem.key)!==-1)
    }
    // 上述条件都不符合则没有权限
    return false
  }
  // 根据menu数组生成对应标签数组
  getMenuNodes = (menuList) => {
    // 获取当前路径
    const path = this.props.location.pathname
    return menuList.map(item => {
      // 根据是否有权限决定哪些菜单项需要显示
      if(this.hasAuth(item)){
        if(!item.children){//获取一级菜单
          // 让页面更新使显示正确的头部标题
          if(path.indexOf(item.key)===0){
            this.props.setHeadTitle(item.title)
          }
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              {/* 点击菜单项时切换头部标题 */}
              <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>{item.title}</Link> 
            </Menu.Item>
          )
        }else{
          // 判断当前子数组是否需要默认展开          
          // 如果当前处于product组件或其子组件，就让products保持展开状态
          const citem = item.children.find(citem => path.indexOf(citem.key)===0)
          if(citem) this.openKey = item.key
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {/* 利用递归获取二级菜单 */}
              {this.getMenuNodes(item.children)}              
            </SubMenu>
          )
        }
      }
    })
  }
  // 在第一次调用render之前就准备好menu标签数组
  constructor(props){
    super(props)
    this.menuNodes = this.getMenuNodes(menuList)
  } 
  render() { 
    let path = this.props.location.pathname
    // 如果当前处于product组件或其子组件，就让product保持选中状态
    if(path.indexOf('/products/product')===0){
      path = '/products/product'
    }
    return (
      <div className='left-nav'>
          <Link className='left-nav-header' to='/'>
            <img src={logo} alt="logo" />
            <h1>硅谷后台</h1>
          </Link>
          <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[this.openKey]}>            
             {
               // 动态获取menu数据 
               this.menuNodes
             } 
          </Menu>
      </div>
    )
  }
}
// 创建并暴露容器组件
export default connect(
  state => ({user:state.user}),
  {setHeadTitle}
)(withRouter(LeftNav))  // 包装一般组件LeftNav，使其具有路由组件特有的API