/*
Product组件的添加修改子组件
*/

import React, { Component } from 'react'
import { Card,Form,Input,InputNumber,Cascader,Button, message } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { reqCategoryList,reqAddOrUpdateProduct } from '../../../../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const {Item} = Form
const {TextArea} = Input

export default class ProductAddUpdate extends Component {
  // 初始化状态
  state = {
    options:[]  //Cascader组件的选项列表
  }
  // 用于保存Form组件标签
  formRef = React.createRef()
  // 用于保存PicturesWall组件标签
  pictureRef = React.createRef()
  // 用于保存RichTextEditor组件标签
  textRef = React.createRef()
  // 表单提交的回调
  finish = async () => {
    // 获取表单中的各项数据
    const {name,desc,price,category} = this.formRef.current.getFieldsValue()
    // 从分类数据category数组中获取父分类ID
    let pCategoryId,categoryId
    if(category.length===1){ //一级分类
      pCategoryId = '0'
      categoryId = category[0]
    }else{ //二级分类
      pCategoryId = category[0]
      categoryId = category[1]
    }    
    // 获取PicturesWall组件中的图片信息
    const imgs = this.pictureRef.current.getImgs()
    // 获取RichTextEditor组件中的图片详情信息
    const detail = this.textRef.current.getDetail()
    // 封装发送请求需要的参数对象
    const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
    if(this.isUpdate){ //如果是修改商品，还需加上当前商品的ID
      product._id = this.product._id
    }
    // 发送请求添加/修改商品
    const result = await reqAddOrUpdateProduct(product)
    if(result.status === 0){
      message.success(`${this.isUpdate?'修改':'添加'}成功！`)
      this.props.history.goBack()
    }else{
      message.error(`${this.isUpdate?'修改':'添加'}成功！`)
    }   
  }
  // 获取一级/二级分类列表的方法
  getCategoryList = async parentId => {
    // 发送请求获取商品分类列表
    const result = await reqCategoryList(parentId)
    if(result.status === 0){
      // 请求发送成功后保存获取到的商品分类列表
      const categoryList = result.data
      // 判断获取的是一级还是二级分类列表
      if(parentId === '0'){
        // 如果是一级分类列表，根据商品分类列表生成Cascader组件的选项列表
        this.initOptions(categoryList)
      }else{
        // 如果是二级分类列表，直接返回
        return categoryList
      }     
    }
  }
  // 将商品分类列表加工成Cascader组件选项列表的方法
  initOptions = async categoryList => {
    // 加工生成Cascader组件选项列表options
    const options = categoryList.map(item=>({
      value:item._id,
      label:item.name,
      isLeaf:false
    }))
    const {isUpdate,product} = this
    const {pCategoryId} = product
    if(isUpdate&&pCategoryId!=='0'){
      const subCategoryList = await this.getCategoryList(pCategoryId)
      const subOptions = subCategoryList.map(item=>({
        value:item._id,
        label:item.name,
        isLeaf:true
      }))
      const targetOption = options.find(option=>option.value===pCategoryId)
      // 将二级选项列表设为当前一级选项的子选项
      targetOption.children = subOptions
    }
    // 更新state中的options
    this.setState({options})
  }
  // Cascader组件加载二级选项列表的方法
  loadData= async (selectedOptions) => {
    // 获取当前选中的一级选项
    const targetOption = selectedOptions[0]
    // 显示选项正在加载的效果
    targetOption.loading = true
    // 发送请求获取商品二级分类列表
    const subCategoryList = await this.getCategoryList(targetOption.value)
    // 关闭选项正在加载的效果
    targetOption.loading = false
    if(subCategoryList&&subCategoryList.length>0){
      // 如果获取到了二级分类列表，将其加工成Cascader组件的二级选项列表
      const subOptions = subCategoryList.map(item=>({
        value:item._id,
        label:item.name,
        isLeaf:true
      }))
      // 将二级选项列表设为当前一级选项的子选项
      targetOption.children = subOptions
    }else{
      // 如果没有获取到二级分类列表，就将当前一级选项设为没有子选项
      targetOption.isLeaf = true
    }
    // 更新state中Cascader组件的选项列表options
    this.setState({options:[...this.state.options]})  
  }
  // 在组件第一次render()前先获取state参数
  constructor(props){
    super(props)
    const product = this.props.location.state
    this.isUpdate = !!product  //用来标识是修改商品还是添加商品
    this.product = product || {}  //用来保存当前商品，如果是添加商品，就使其为空对象
  }
  // 组件挂载完毕后获取一级分类列表
  componentDidMount(){
    this.getCategoryList('0')
  }
  render() {
    const {isUpdate,product} = this
    // category用来保存商品分类的默认值
    const category = []
    // 获取当前商品所属的分类ID
    const {pCategoryId,categoryId,detail} = product
    // 如果当前状态是修改商品，就往category里添加相应分类的ID
    if(isUpdate){
      if(pCategoryId==='0'){
        // 如果是一级分类下的商品，只需要添加一个分类ID
        category.push(categoryId)
      }else{
        // 如果是二级分类下的商品，需要添加两个分类ID
        category.push(pCategoryId)
        category.push(categoryId)
      }
    }
    const title = (
      <span>
        <ArrowLeftOutlined 
          style={{fontSize:12,marginRight:15,color:'#1DA57A'}}
          onClick={()=>this.props.history.goBack()}
        />
        <span>{isUpdate?'修改商品':'添加商品'}</span>
      </span>
    )
    const layout = {
      labelCol: { span: 2 },  //表单左侧label长度
      wrapperCol: { span: 8 },  //表单右侧容器长度
    }    
    return (
      <Card title={title}>
        <Form {...layout} onFinish={this.finish} ref={this.formRef}>
          <Item label='商品名称' initialValue={product.name} name='name' rules={[{required:true,message:'请输入商品名称！'}]}>
            <Input allowClear></Input>
          </Item>
          <Item label='商品描述' initialValue={product.desc} name='desc' rules={[{required:true,message:'商品描述必须输入！'}]}>
            <TextArea placeholder='请输入商品描述' autoSize={{minRows:2,maxRows:6}}/>
          </Item>
          <Item label='商品价格' initialValue={product.price} name='price' rules={[{required:true,message:'请输入商品价格，商品价格不能低于0.01元！'}]}>
            <InputNumber type='number' min={0.01} addonAfter='元'></InputNumber>
          </Item>
          <Item label='商品分类' initialValue={category} name='category' rules={[{required:true,message:'请选择商品分类！'}]}>
            <Cascader options={this.state.options} loadData={this.loadData}/>
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pictureRef} product={product}/>
          </Item>
          <Item label='商品详情' wrapperCol={{span:20,}}>
            <RichTextEditor ref={this.textRef} detail={detail}/>
          </Item>
          <Button type='primary' htmlType='submit' style={{marginLeft:12}}>提交</Button>
        </Form>
      </Card>
    )
  }
}