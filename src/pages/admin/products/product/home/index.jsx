/*
Product组件的主体内容子组件
*/

import React, { Component } from 'react'
import {Card,Select,Input,Button,Table, message,ConfigProvider} from 'antd'
// 引入antd中文语言包
import zhCN from 'antd/es/locale/zh_CN'
import {PlusOutlined}from '@ant-design/icons'
import { reqProducts, reqSearchProducts,reqUpdateStatus } from '../../../../../api'
import { PAGE_SIZE } from '../../../../../utils/constants'

export default class ProductHome extends Component {
  // 初始化状态
  state = {
    total:0,  //商品综述
    products:[],  //商品列表
    loading:false,  //加载效果
    searchName:'',  //搜索分页的搜索名称
    searchType:'productName',  //搜索分页的搜索类型
  }
  // 获取商品分页列表的方法
  getProducts = async (pageNum) => {
    // 保存当前所在页
    this.pageNum = pageNum
    // 发送请求前显示加载效果
    this.setState({loading:true})
    const {searchName,searchType} = this.state
    let result
    //如果搜索框有内容，就发送搜索商品分页列表请求，否则发送获取商品分页列表请求
    if(searchName){
      result = await reqSearchProducts(pageNum,PAGE_SIZE,searchName,searchType)
    }else{
      result = await reqProducts(pageNum,PAGE_SIZE)
    }   
    if(result.status === 0){
      // 发送请求成功后更新商品信息，并取消加载效果
      const {total,list} = result.data
      this.setState({
        total,
        products:list,
        loading:false
      })
    }
  }
  // 更新商品状态的方法
  updateStatus = async (productId,status) => {
    // 发送请求更新商品状态
    const result = await reqUpdateStatus(productId,status)
    if(result.status === 0){
      // 更新成功后重新获取当前商品页列表
      message.success('商品更新成功')
      this.getProducts(this.pageNum)
    }
  }
  // 初始化Table中所有列的数组的方法
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        align:'center',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        align:'center',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        align: 'center',
        dataIndex: 'price',
        render: price => '￥'+ price
      },
      {
        title: '状态',
        width: 200,
        align: 'center',
        render: product => {
          // 获取当前商品的信息，并设置新状态
          const {status,_id} = product
          const newStatus = (status===1)?2:1
          return (
            <span>
              <span>{status===1?'在售':'已下架'}</span> &nbsp;&nbsp;
              <Button
                type='primary'
                // 点击按钮发送请求更新商品状态
                onClick={()=>this.updateStatus(_id,newStatus)}
              >
                {status===1?'下架':'上架'}
              </Button>
            </span>
          )
        }    
      },
      {
        title: '操作',
        width: 150,
        align: 'center',
        render: (product) => {
          return (
            <span>
              <Button
                type='link'
                // 点击按钮时将当前商品作为state参数传递给detail组件
                onClick={()=>this.props.history.push('/products/product/detail',{product})}
              >详情</Button>
              <Button
                type='link'
                onClick={()=>this.props.history.push('/products/product/addupdate/',product)}
              >修改</Button>
            </span>
          )
        }
      }
    ]
  }
  // 在第一次调用render之前就初始化Table的所有列
  constructor(){
    super()
    this.initColumns()
  }
  // 组件挂载完毕时获取商品分类列表
  componentDidMount(){
    this.getProducts(1)
  }
  render() {
    const {total,products,loading,searchName,searchType} = this.state
    const title = (
      <span>
        <Select style={{width:150}} value={searchType} onChange={value=>this.setState({searchType:value})}>
          <Select.Option value='productName'>按名称搜索</Select.Option>                    
          <Select.Option value='productDesc'>按描述搜索</Select.Option>                    
        </Select>
        <Input 
          style={{width:150,margin:'0 10px'}}
          value={searchName}
          onChange={event=>this.setState({searchName:event.target.value})}
          placeholder='关键字'
          allowClear
          />
        <Button
          type='primary'
          onClick={()=>{
            // 获取第一页的搜索结果
            this.getProducts(1)     
          }}
        >
           搜索
        </Button>
      </span>
    )
    const extra = <Button type="primary" onClick={()=>this.props.history.push('/products/product/addupdate')}><PlusOutlined/>添加商品</Button>
    return (
      <Card title={title} extra={extra}>
        <ConfigProvider locale={ zhCN }>
          <Table
          rowKey='_id'
          bordered
          loading={loading}          
          pagination={{
            // 当前显示页由保存的页码控制
            current:this.pageNum,
            total,
            defaultPageSize:PAGE_SIZE,
            showQuickJumper:true,
            // 页码改变时会调用getProducts函数
            onChange:(page)=>{
              this.getProducts(page)
            }
          }}
          dataSource={products}
          columns={this.columns} 
        />
        </ConfigProvider>
      </Card>
    )
  }
}
