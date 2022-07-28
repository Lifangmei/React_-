import React, { Component } from 'react'
import {Card,Button,Table,Modal,ConfigProvider, message} from 'antd'
// 引入antd中文语言包
import zhCN from 'antd/es/locale/zh_CN'
import { reqAddUser, reqUpdateUser, reqDeleteUser, reqUsers } from '../../../api'
import { formateDate } from '../../../utils/dateUtils'
import {PAGE_SIZE} from '../../../utils/constants'
import UserForm from './form/user-form'

export default class User extends Component {
  // 初始化状态
  state = { 
    users:[],  //用户列表
    roles:[],  //职位列表
    isShow:false,  //标识Modal框是否显示
    user:{},  //选中的用户
  }
  // 删除用户的方法
  deleteUser = (user) => {
    // 弹出Modal确认框
    Modal.confirm({
      title:`确认删除${user.username}吗？`,
      onOk: async () => {
        // 点击确认时发送请求删除用户
        const result = await reqDeleteUser(user._id)
        if(result.status ===0){
          message.success('删除用户成功')
          // 删除用户后更新用户列表
          this.getUsers()
        }
      }
    })
  }
  // Modal框点击确认的方法
  addOrUpdate = () => {
    // 表单验证
    this.form.validateFields().then(async values=>{
      // 关闭Modal框
      this.setState({isShow:false})
      // 提取表单数据，生成相应用户
      const newUser = values
      let result
      const {user} = this.state
      // 判断当前处于添加状态还是修改状态
      if(user._id){
        // 获取当前选中用户的ID
        newUser._id = user._id
        // 发送请求修改用户
        result = await reqUpdateUser(newUser)
      }else{
        // 发送请求添加新用户
        result = await reqAddUser(newUser)
      }
      if(result.status === 0){
        message.success(`${user._id?'修改':'创建'}用户成功`)
        // 添加/修改用户成功后更新用户列表
        this.getUsers()
      }
    })
  }
  // 获取用户列表的方法
  getUsers = async () => {
    // 发送请求获取用户列表
    const result = await reqUsers()
    if(result.status === 0){
      // 取出用户列表和职位列表
      const {users,roles} = result.data
      // 初始化职位列表，获得包含职位名的对象
      this.initRoles(roles)
      // 更新state中的用户列表和职位列表
      this.setState({
        users,
        roles
      })
    }
  }
  // 将职位数组加工成一个对象，属性名是ID，属性值是name
  initRoles = (roles) => {
    this.roleNames = roles.reduce((pre,role)=>{
      pre[role._id] = role.name
      return pre
    },{})
  }
  // 初始化Table列信息的方法
  initColumns = () => {
    this.columns = [
      {
        title:'用户',
        align:'center',
        dataIndex:'username'
      },      
      {
        title:'电话',
        align:'center',
        dataIndex:'phone'
      },
      {
        title:'邮箱',
        align:'center',
        dataIndex:'email'
      },      
      {
        title:'所属职位',
        align:'center',
        dataIndex:'role_id',
        // 根据职位ID获得职位名
        render:(role_id) => this.roleNames[role_id]
      },
      {
        title:'注册时间',
        align:'center',
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:'操作',
        align:'center',
        width:200,
        render:(user) => (
          <span>
            <Button type='link' onClick={()=>this.setState({isShow:true,user})}>修改</Button>
            <Button type='link' onClick={()=>this.deleteUser(user)}>删除</Button>
          </span>
        )
      },
    ]
  }
  // 在第一次render()前就初始化Table的列信息
  constructor(props){
    super(props)
    this.initColumns()
  }
  // 组件挂载完毕后获取所有用户列表
  componentDidMount(){
    this.getUsers()
  }
  render() {
    const {users,roles,isShow,user} = this.state
    const title = <Button type='primary' onClick={()=>this.setState({isShow:true,user:{}})}>创建用户</Button>
    return (
      <Card title = {title}>
        <ConfigProvider locale={ zhCN }>
          <Table
            bordered
            rowKey='_id'
            dataSource={users}
            columns={this.columns}          
            pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
          />
        </ConfigProvider>
        <Modal title={user._id?'修改用户':'创建用户'} destroyOnClose='true' visible={isShow} onOk={this.addOrUpdate} onCancel={()=>this.setState({isShow:false})}>
          <UserForm setForm={form=>this.form=form} roles={roles} user={user}/>
        </Modal>
      </Card>
    )
  }
}
