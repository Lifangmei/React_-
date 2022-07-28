import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button,Row,Col} from 'antd'
import {setHeadTitle} from '../../../redux/actions'
import './index.less'

class NotFound extends Component {
  // 回到首页的方法
  goHome = () =>{
    this.props.setHeadTitle('首页')
    this.props.history.replace('/home')
  }
  render() {
    return (
      <Row className='not-found'>
          <Col span={12} className='not-found-left'></Col>
          <Col span={12} className='not-found-right'>
              <h1>404</h1>
              <h2>抱歉，您访问的页面不存在</h2>
              <Button type='primary' onClick={this.goHome}>回到首页</Button>
          </Col>
      </Row>
    )
  }
}
// 创建并暴露容器组件
export default connect(
    null,
    {setHeadTitle}
)(NotFound)
