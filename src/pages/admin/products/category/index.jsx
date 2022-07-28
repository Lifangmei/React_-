import React, { Component } from 'react'
import {Card,Button,Table,ConfigProvider,message,Modal} from 'antd'
import {ArrowRightOutlined,PlusOutlined}from '@ant-design/icons'
// 引入antd中文语言包
import zhCN from 'antd/es/locale/zh_CN'
import { reqCategoryList,reqAddCategory, reqUpdateCategory } from '../../../../api'
import AddForm from './form/add-form'
import UpdateForm from './form/update-form'

export default class Category extends Component {
  // 初始化状态，定义商品分类列表和加载效果等
  state = {
    loading:false,  //加载效果
    categoryList:[],  //一级分类列表
    subCategoryList:[],  //二级分类列表
    parentId:'0',  //二级分类列表对应的父ID
    parentName:'',  //二级分类列表对应的父分类名称
    showModal:0 //0表示都不显示，1表示显示添加分类框，2表示显示修改分类框
  }
  // 获取商品一级/二级分类列表的方法
  getCategoryList = async (parentId) => {
   // 发送请求前显示加载效果
   this.setState({loading:true})
   // 如果没有传参数就获取state中的parentId 
   parentId = parentId || this.state.parentId
   // 发送请求获取商品分类列表
   const result =  await reqCategoryList(parentId)
   if(result.status === 0){
     // 请求成功后更新状态中的一级/二级分类列表
     const categoryList = result.data
     // 判断需要更新的是一级分类列表还是二级分类列表
     parentId==='0'?
     this.setState({loading:false,categoryList}):
     this.setState({loading:false,subCategoryList:categoryList})
   }else{
     message.error('获取商品分类列表失败！')
   }
  }
  // 回退到一级商品分类列表的方法
  showCategoryList = () => {
    // 清空状态中保存的二级分类列表的相关信息
    this.setState({
      parentId:'0',
      parentName:'',
      subCategoryList:[]
    })
  }
  // 展示二级商品分类列表的方法
  showSubCategoryList = (category) => {
    // 获取选中的父分类的id和name并更新状态
    const {_id,name} = category
    this.setState({
      parentId:_id,
      parentName:name
    },()=>{
      // 状态更新完并且重新调用render后发送请求获取二级分类列表
      this.getCategoryList()
    })
  }
  // 初始化Table中所有列的数组的方法
  initColumns = () => {
    this.columns = [
      {
        title: '商品分类',
        dataIndex: 'name'
      },
      {
        title: '操作',
        align: 'center',
        width: 500,
        render: (category) => {
          return (
            <span>
              <Button type='link' onClick={()=>this.showUpdate(category)}>修改分类</Button>
              {
                category.parentId==='0'?
                <Button type='link' onClick={()=>this.showSubCategoryList(category)}>查看子分类</Button>
                :null
              }
            </span>
          )
        }
      }
    ]
  }
  // 显示添加分类框的方法
  showAdd = () =>{
    this.setState({showModal:1})
  }
  // 添加分类框确定的方法
  handleAdd = () => {
    // 表单验证通过后才能执行
    this.form.validateFields().then(async (values)=>{
      // 点击确定后隐藏Modal框
      this.setState({showModal:0})
      // 从子组件的form节点拿到选中的分类和添加的分类名
      const {parentId,categoryName} = values
      // 发送添加分类请求
      const result = await reqAddCategory(parentId,categoryName)
      if(result.status === 0){
        // 请求发送成功后判断选中的分类是否是当前所处分类
        if(parentId===this.state.parentId){
          // 如果是，重新获取分类列表并显示
          this.getCategoryList()
        }else if(parentId==='0'){
          // 如果当前在二级分类下，选中的是一级分类，就重新获取一级分类列表
          // 但是当前所处的parentId不是'0'，所以不会导致页面跳转到一级分类下
          this.getCategoryList('0')
        }
      } 
    })    
  }
  // 显示修改分类框的方法
  showUpdate = (category) =>{
    // 保存当前选中的商品分类
    this.category = category
    // 显示Modal框
    this.setState({showModal:2})
  }
  // 修改分类框确定的方法
  handleUpdate = () => {
    // 表单验证通过后才能执行
    this.form.validateFields().then(async (values)=>{
      // 点击确定后隐藏Modal框
      this.setState({showModal:0})
      // 获取请求需要的参数
      const categoryId = this.category._id
      const {categoryName} = values
      // 发送修改分类的请求
      const result = await reqUpdateCategory(categoryId,categoryName)
      if(result.status === 0){
        // 请求成功后更新分类列表
        this.getCategoryList()
      }  
    })     
  }
  // Modal框取消的方法
  handleCancel = () => {
    // 使Modal框隐藏
    this.setState({showModal:0})
  }
  // 在第一次调用render之前就初始化Table的所有列
  constructor(){
    super()
    this.initColumns()
  }
  // 组件挂载完毕后发送异步请求获取商品一级分类列表
  componentDidMount(){
    this.getCategoryList()
  }
  render() {
    const category = this.category || {}
    const {loading,categoryList,subCategoryList,parentId,parentName,showModal} = this.state
    // 根据当前列表展开情况设置页面title
    const title = (parentId==='0')?
    <span style={{padding:'4px 15px'}}>一级分类列表</span>
    :(
      <span>
        <Button type='link' style={{fontSize:16}} onClick={this.showCategoryList}>一级分类列表</Button>
        <ArrowRightOutlined style={{fontSize:12,marginRight:15}}/>
        <span>{parentName}</span>
      </span>
    )       
    return (
      <Card title={title} extra={<Button type="primary" onClick={this.showAdd}><PlusOutlined/>添加</Button>}>
        {/* 使用antd的汉化包 */}
        <ConfigProvider locale={ zhCN }>
          {/* 配置Table来显示商品分类列表 */}
          <Table 
            rowKey='_id'
            bordered
            loading={loading}
            pagination={{defaultPageSize:5,showQuickJumper:true}}
            dataSource={parentId==='0'?categoryList:subCategoryList}
            columns={this.columns}
          />
        </ConfigProvider> 
        {/* 添加分类框 */}
        <Modal title="添加分类" destroyOnClose='true' visible={showModal===1} onOk={this.handleAdd} onCancel={this.handleCancel}>          
          {/* 通过props实现父子间通信 */}
          <AddForm categoryList={categoryList} parentId={parentId} setForm={form=>this.form=form}/>
        </Modal>
        {/* 修改分类框 */}
        <Modal title="修改分类" destroyOnClose='true' visible={showModal===2} onOk={this.handleUpdate} onCancel={this.handleCancel}>
          {/* 通过props实现父子间通信 */}
          <UpdateForm categoryName={category.name} setForm={form=>this.form=form}/>
        </Modal>       
      </Card>      
    )
  }
}
