/*
Category组件中修改分类对应的Form组件
*/

import React, { PureComponent } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

export default class UpdateForm extends PureComponent {
  // 对标签属性进行限制  
  static propTypes = {
    categoryName:PropTypes.string,
    setForm:PropTypes.func.isRequired
  }
  // 创建ref容器来保存Form标签  
  formRef = React.createRef()
  // 组件挂载完毕时通过props将Form标签传递给父组件  
  componentDidMount(){
      this.props.setForm(this.formRef.current)
  }
  render() {
    // 接收父组件传递过来的商品分类名称
    const {categoryName} = this.props
    return (
        <Form ref={this.formRef}>
            <Form.Item 
                name="categoryName"
                initialValue={categoryName}
                rules={[
                    {required: true, whitespace:true, message: '分类名称必须输入!'}
                ]}
            >       
                <Input placeholder='请输入分类名称' allowClear autoComplete="off"/>
            </Form.Item>
        </Form>
    )
  }
}
