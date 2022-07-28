/*
authority组件中设置职位权限对应的Form组件
*/

import React, { PureComponent } from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../../../config/menuConfig'

export default class AuthForm extends PureComponent {
  // 对标签属性进行限制  
  static propTypes = {
    position:PropTypes.object,
    getMenus:PropTypes.func.isRequired
  }
  // 选中树节点时的方法  
  onCheck = checkedKeys => {
    // 更新state中的权限列表
    this.setState({checkedKeys})
    // 把新的权限列表传递给父组件
    this.props.getMenus(checkedKeys)
  }
  // 在第一次render()前获取当前职位的权限
  constructor(props){
    super(props)
    // 获取已有权限
    const {menus} = this.props.position
    // 初始化state中的权限列表
    this.state = {checkedKeys:menus}
  }
  render() {
    const {position} = this.props
    const {checkedKeys} = this.state
    return (
        <div>            
            <Form.Item label='职位名称'>      
                <Input value={position.name} disabled/>
            </Form.Item>
            <Tree
                checkable
                defaultExpandAll='true'
                // 根据数组数据生成树节点
                treeData={menuList}
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}
            />
        </div>
    )
  }
}
