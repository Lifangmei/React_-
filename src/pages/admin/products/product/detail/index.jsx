/*
Product组件的详情子组件
*/
import React, { Component } from 'react'
import {Card,List} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import './index.less'
import {BASE_IMG_URL} from '../../../../../utils/constants'
import { reqCategory } from '../../../../../api'

export default class ProductDetail extends Component {
  // 初始化状态
  state = {
    cName1:'',  //一级分类的名称
    cName2:''   //二级分类的名称
  }
  // 组件挂载完毕时获取商品详情
  async componentDidMount(){
    // 从商品中获取分类ID和父分类ID
    const {pCategoryId,categoryId} = this.props.location.state.product
    if(pCategoryId === '0'){
      // 如果是一级分类下的商品，只需获取一级分类名称
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    }else{
      // 如果是二级分类下的商品，需要获取一级分类名称和二级分类名称
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({cName1,cName2})
    }
  }
  render() {
    const {cName1,cName2} = this.state
    // 获取商品信息
    const {name,desc,price,detail,imgs} = this.props.location.state.product
    // 定义Card的title内容
    const title = (
      <span>
        <ArrowLeftOutlined 
          style={{fontSize:12,marginRight:15,color:'#1DA57A'}}
          onClick={()=>this.props.history.goBack()}
        />
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <List.Item className='detail-list'>
            <span className='detail-list-left'>商品名称：</span>
            <span>{name}</span>
          </List.Item>
          <List.Item className='detail-list'>
            <span className='detail-list-left'>商品描述：</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item className='detail-list'>
            <span className='detail-list-left'>商品价格：</span>
            <span>{price}元</span>
          </List.Item>
          <List.Item className='detail-list'>
            <span className='detail-list-left'>所属分类：</span>
            <span>{cName1}{cName2?' --> '+cName2:''}</span>
          </List.Item>
          <List.Item className='detail-list'>
            <span className='detail-list-left'>商品图片：</span>
            <span>
              {
                imgs.map(img=>(
                  <img key={img} className='detail-list-img' src={BASE_IMG_URL+img} alt={name}/>
                ))
              }
            </span>
          </List.Item>
          <List.Item className='detail-list'>
            <span className='detail-list-left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </List.Item>
        </List>
      </Card>
    )
  }
}
