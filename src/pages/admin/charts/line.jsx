import React, { Component } from 'react'
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Line extends Component {
  // 初始化销量和库存状态
  state = {
    sales:[56, 32, 40, 45, 36, 50],
    stores:[22, 11, 24, 17, 18, 10]
  }
  // 获取折线图的配置对象
  getOption = () => {
    const {sales,stores} = this.state
    return {
      title:{
        text:'手机品牌每周销售量统计'
      },
      tooltip:{},  // 提示框组件
      legend:{
        data:['销量','库存']
      },
      xAxis: {
        data: ['华为', '三星', 'OPPO',  '小米', 'VIVO', '苹果']
      },
      yAxis: {},
      series: [
        {
          name:'销量',
          data: sales,
          type: 'line'
        },
        {
          name:'库存',
          data: stores,
          type: 'line'
        }
      ]
    }
  }
  // 更新折线图数据
  update = () => {
    this.setState(state => ({
      sales:state.sales.map((sale,key)=>{
        // 如果剩下的库存大于等于1，则销量加1
        if(state.stores[key]>=1){
          return sale+1
        }else{
          // 如果剩下的库存小于1，则销量加上剩余的所有库存
          return sale+state.stores[key]
        }
      }),
      stores:state.stores.map(store=>{
        // 如果剩下的库存大于1，则库存减1
        // 如果剩下的库存小于1，则剩余的所有库存清空
        const newStore = (store-1)>0?(store-1):0
        return newStore
      })
    }))
  }
  render() {
    const title = <Button type='primary' onClick={this.update}>更新数据</Button>
    return (
        <Card title={title}>
          <ReactEcharts option={this.getOption()} style={{height:500}}/>
        </Card>
    )
  }
}
