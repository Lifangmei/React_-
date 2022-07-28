/*
authority组件中添加职位对应的Form组件
*/

import React, { PureComponent } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

export default class AddForm extends PureComponent {
  // 对标签属性进行限制  
  static propTypes = {
    setForm:PropTypes.func.isRequired
  }
  // 创建ref容器来保存Form标签  
  formRef = React.createRef()
  // 组件挂载完毕时通过props将Form标签传递给父组件  
  componentDidMount(){
    this.props.setForm(this.formRef.current)
  }
  render() {
    return (
        <Form ref={this.formRef}>            
            <Form.Item 
                name='positionName'
                label='职位名称'
                rules={[
                    {required: true, whitespace:true, message: '职位名称必须输入!'},
                ]}
            >      
                <Input placeholder='请输入职位名称' allowClear autoComplete='off'/>
            </Form.Item>
        </Form>
    )
  }
}
