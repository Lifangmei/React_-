/*
Category组件中添加分类对应的Form组件
*/

import React, { PureComponent } from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

export default class AddForm extends PureComponent {
  // 对标签属性进行限制  
  static propTypes = {
    categoryList:PropTypes.array.isRequired,
    parentId:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }
  // 创建ref容器来保存Form标签  
  formRef = React.createRef()
  // 组件挂载完毕时通过props将Form标签传递给父组件  
  componentDidMount(){
    this.props.setForm(this.formRef.current)
  }
  render() {
    const {categoryList,parentId} = this.props
    return (
        <Form ref={this.formRef}>
            {/* 初始值根据当前的parentId决定 */}
            <Form.Item name='parentId' initialValue={parentId}>
                <Select>
                    <Select.Option value='0'>一级分类</Select.Option>
                    {
                        //根据一级分类列表显示
                        categoryList.map(item=><Select.Option value={item._id} key={item._id}>{item.name}</Select.Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item 
                name='categoryName'
                rules={[
                    {required: true, whitespace:true, message: '分类名称必须输入!'},
                ]}
            >      
                <Input placeholder='请输入分类名称' allowClear autoComplete='off'/>
            </Form.Item>
        </Form>
    )
  }
}
