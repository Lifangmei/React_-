/*
authority组件中添加职位对应的Form组件
*/

import React, { PureComponent } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

export default class UserForm extends PureComponent {
  // 对标签属性进行限制  
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    roles:PropTypes.array.isRequired,
    user:PropTypes.object,
  }
  // 创建ref容器来保存Form标签  
  formRef = React.createRef()
  // 组件挂载完毕时通过props将Form标签传递给父组件  
  componentDidMount(){
    this.props.setForm(this.formRef.current)
  }
  render() {
    const {roles,user} = this.props
    // 从user中取出对应的数据
    const {username,phone,email,role_id} = user
    // 表单的样式设置
    const layout = {
      labelCol: { span: 5 },  //表单左侧label长度
      wrapperCol: { span: 15 },  //表单右侧容器长度
    }  
    return (
        <Form ref={this.formRef} {...layout}>
          <Form.Item label='用户名'>
            <Form.Item 
                name='username'
                noStyle
                initialValue={username}
                rules={[
                    {required: true, whitespace:true, message: '请输入用户名!'},
                ]}
            >      
                <Input allowClear autoComplete='off'/>
            </Form.Item>
          </Form.Item>  
          {
            //如果是修改用户状态，就不需要密码输入框
            user._id?null:(
              <Form.Item label='密码' >
                <Form.Item 
                    name='password'
                    noStyle
                    rules={[
                        {required: true, whitespace:true, message: '请输入密码!'},
                    ]}
                >      
                    <Input type='password' allowClear autoComplete='off'/>
                </Form.Item>
              </Form.Item>
            )
          }
          <Form.Item label='电话'>
            <Form.Item 
                name='phone'
                noStyle
                initialValue={phone}
                rules={[
                    {required: true, whitespace:true, message: '请输入电话号!'},
                ]}
            >      
                <Input allowClear autoComplete='off'/>
            </Form.Item>
          </Form.Item>
          <Form.Item label='邮箱'>
            <Form.Item 
                name='email'
                noStyle
                initialValue={email}
                rules={[
                    {required: true, whitespace:true, message: '请输入邮箱号!'},
                ]}
            >      
                <Input allowClear autoComplete='off'/>
            </Form.Item>
          </Form.Item>
          <Form.Item label='职位'>
            <Form.Item 
                name='role_id'
                noStyle
                initialValue={role_id}
                rules={[
                    {required: true, whitespace:true, message: '请输入所属职位!'},
                ]}
            >      
                <Select>
                  {
                    roles.map(role=>(
                      <Select.Option value={role._id} key={role._id}>
                        {role.name}
                      </Select.Option>
                    ))
                  }
                </Select>
            </Form.Item>
          </Form.Item>
         
        </Form>
    )
  }
}
