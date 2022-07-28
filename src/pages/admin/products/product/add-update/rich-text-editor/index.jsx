/*
用于添加或修改商品详情的组件
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Editor} from 'react-draft-wysiwyg'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
  // 对传入的props属性进行限制
  static propTypes={
    detail:PropTypes.string
  }  
  // 编辑器中内容变化时将新的内容实时更新到state中 
  onEditorStateChange = (editorState) => this.setState({editorState})
  // 将编辑器中的富文本转换成html格式的文本
  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  // 在第一次render()前先获取商品详情  
  constructor(props){
      super(props)
      const {detail} = this.props
      let editorState
      // 如果detail有值，说明当前处于修改商品状态中
      if(detail){
        // 将商品详情的html文本转换为富文本
        const blocksFromHtml = htmlToDraft(detail)
        const { contentBlocks, entityMap } = blocksFromHtml
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
        editorState = EditorState.createWithContent(contentState)
      }else{ // 如果没有值，就创建个空的editorState
        editorState = EditorState.createEmpty()
      }
      // 初始化状态
      this.state = {
        editorState
      }
  }
  render() {
    const {editorState} = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{border:'1px solid #aaa',height:150,paddingLeft:10}}
        onEditorStateChange={this.onEditorStateChange}
      />
    )
  }
}
