/*
权限管理的路由组件
*/

import React, { Component } from 'react'
import {connect} from 'react-redux'
import {logout} from '../../../redux/actions'
import {Card,Button,Table,ConfigProvider,Modal, message} from 'antd'
// 引入antd中文语言包
import zhCN from 'antd/es/locale/zh_CN'
import { reqAddPosition, reqPositions, reqUpdatePosition } from '../../../api'
import { PAGE_SIZE } from '../../../utils/constants'
import {formateDate} from '../../../utils/dateUtils'
import AddForm from './form/add-form'
import AuthForm from './form/auth-form'

class Authority extends Component {
  // 初始化状态
  state = {
    // 职位列表
    positions:[],
    // 选中的职位
    position:{},
    isShowAdd:false,  //标识是否显示添加职位的Modal框
    isShowAuth:false,  //标识是否显示设置职位权限的Modal框
  }
  // 添加职位Modal框点击确认的方法
  handleAdd = () => {
    // 表单验证
    this.form.validateFields().then(async values=>{
      // 点击确认隐藏Modal框
      this.setState({isShowAdd:false})
      // 获取表单数据
      const {positionName} = values
      // 发送请求创建职位
      const result = await reqAddPosition(positionName)
      if(result.status === 0){
        message.success('创建职位成功')
        // 获取新创建的职位，更新到state中
        const position = result.data
        this.setState(state=>({
          positions:[...state.positions,position]
        }))
      }else{
        message.error('创建职位失败')
      }
    })
  }
  // 设置职位权限的Modal框点击确认的方法
  handleSet = async () => {
    // 点击确认隐藏Modal框
    this.setState({isShowAuth:false})
    // 获取当前选中的职位和所有职位列表
    const {position} = this.state
    // 更新当前选中的职位的权限
    position.menus = this.menus
    // 将当前登录的用户设为授权人
    position.auth_name = this.props.user.username
    // 设置授权时间
    position.auth_time = Date.now()
    // 发送请求更新后台当前职位的权限
    const result = await reqUpdatePosition(position)
    if(result.status ===0 ){
      // 判断当前修改的职位是否是当前登录用户所属职位
      if(position._id===this.props.user.role_id){
        // 如果是，调用分发action的函数，重新登录
        this.props.logout()
        message.success('当前用户权限已更新，请重新登录')
      }else{
        message.success('设置权限成功')
        // 更新所有职位列表
        // this.setState({positions:[...positions]})
        this.getPositions()
      }
    }   
  }
  // 获取所有职位列表的方法
  getPositions = async () => {
    // 发送请求获取职位列表
    const result = await reqPositions()
    if(result.status === 0){
      const positions = result.data
      // 更新state中的职位列表
      this.setState({positions})
    }
  }
  // 设置Table的行属性的方法
  onRow = position => {
    return {
      onClick: () => {
        // 点击行时更新state中选中的职位
        this.setState({position})
      }    
    }
  }
  // Table单选按钮选中状态变化时的回调
  onChange = (_,selectedRows) => {
    // 选中某个按钮时把该行职位设为state中选中的职位
    this.setState({position:selectedRows[0]})
  }
  // 初始化Table的columns的方法
  initColumns = () => {
    this.columns = [
      {
        title:'职位名称',
        align:'center',
        dataIndex:'name'
      },
      {
        title:'创建时间',
        align:'center',
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:'授权时间',
        align:'center',
        dataIndex:'auth_time',
        render:formateDate
      },
      {
        title:'授权人',
        align:'center',
        dataIndex:'auth_name'
      }
    ]
  }
  // 在第一次render()前初始化columns
  constructor(props){
    super(props)
    this.initColumns()
  }
  // 组件挂载完毕时发送请求获取所有职位列表
  componentDidMount(){
    this.getPositions()
  }
  render() {
    const {positions,position,isShowAdd,isShowAuth} = this.state
    // 设置Card的title
    const title = (
      <span>
        <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建职位</Button> &nbsp;&nbsp;
        {/* 选中某一个职位后设置职位权限按钮才可用 */}
        <Button type='primary' disabled={!position._id} onClick={()=>this.setState({isShowAuth:true})}>设置职位权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <ConfigProvider locale={ zhCN }>
          <Table
            bordered
            rowKey='_id'
            dataSource={positions}
            columns={this.columns}
            // 设置表格行可以单选，并根据state中的position使某一行被选中,必须搭配onChange使点击按钮时position更新
            rowSelection={{type:'radio',selectedRowKeys:[position._id],onChange:this.onChange}}
            // 设置行属性
            onRow={this.onRow}
            pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}          
          />
        </ConfigProvider>
        <Modal title="创建职位" destroyOnClose='true' visible={isShowAdd} onOk={this.handleAdd} onCancel={()=>this.setState({isShowAdd:false})}>
          {/* 通过setForm接收表单数据 */}
          <AddForm setForm={(form)=>this.form=form}/>
        </Modal>
        <Modal title="设置职位权限" destroyOnClose='true' visible={isShowAuth} onOk={this.handleSet} onCancel={()=>this.setState({isShowAuth:false})}>
          {/* 通过props属性传递当前选中的position，并接收新的权限列表menus */}
          <AuthForm position={position} getMenus={(menus)=>this.menus=menus}/>
        </Modal>
      </Card>
    )
  }
}
// 创建并暴露容器组件
export default connect(
  state => ({user:state.user}),
  {logout}
)(Authority)

