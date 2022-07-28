/*
用于添加或修改商品图片的组件
*/

import React,{Component} from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../../../../../api'
import { BASE_IMG_URL } from '../../../../../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class PicturesWall extends Component {
  // 对标签属性进行限制 
  static propTypes={
    product:PropTypes.object.isRequired
  }
  // 初次渲染组件前先处理一些数据
  constructor(props){
    super(props)
    // 获取商品的图片
    const {imgs} = this.props.product
    let fileList = []
    // 如果是修改商品，就默认商品显示图片
    if(imgs&&imgs.length>0){
      //将imgs加工成图片列表
      fileList = imgs.map((img,index)=>({
          uid: -index,
          name: img,
          status: 'done',
          url:BASE_IMG_URL+img
      }))
    }
    // 初始化状态
    this.state = {
      previewVisible: false,  //标识Modal框是否显示
      previewImage: '',  //Modal框的图片
      previewTitle: '',  //Modal框的title
      // 图片墙的图片列表
      fileList
    }
  }
  // Modal框关闭时使其隐藏
  handleCancel = () => this.setState({ previewVisible: false })
  // 点击预览图片时查看大图的方法
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    // 使Modal框显示
    const {name} = this.props.product
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: name
    })
  }
  // 图片墙内容有变化时更新其图片列表
  handleChange = async ({file,fileList }) => {
    // 上传请求成功时修改当前上传的图片信息
    if(file.status === 'done'){
      // 请求上传图片返回的响应数据保存在response中
      const result = file.response
      if(result.status ===0){
        message.success('上传图片成功')
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      }else{
        message.error('上传图片失败')
      }
    }else if(file.status === 'removed'){//删除图片时
      // 发送请求删除图片
      const result = await reqDeleteImg(file.name)
      if(result.status === 0){
        message.success('删除图片成功')
      }else{
        message.error('删除图片失败')
      }
    }
    // 更新图片列表
    this.setState({ fileList })
  }
  // 用于向父组件传递图片信息
  getImgs= () =>{
    return this.state.fileList.map(file=>file.name)
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
      <>
        <Upload
          action='/manage/img/upload'  //上传图片的接口地址
          name='image'  //请求参数名
          accept='image/*'  //只接收图片格式
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }
}

