import React, { Component } from 'react'
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component {
  // 初始化销量和库存状态
  state = {
    sales:[120, 259, 306, 250, 154, 80, 60],
    stores:[100, 102, 154, 80, 66, 60, 40]
  }
  // 获取柱状图的配置对象
  getOption = () => {
    const {sales,stores} = this.state
    return {
      title:{
        text:'商品品类每周销售总况'
      },
      tooltip:{},  // 提示框组件
      legend:{
        data:['销量','库存']
      },
      xAxis: {
        data: ['电脑', '手机', '服装',  '食品', '水果','玩具', '家具']
      },
      yAxis: {},
      series: [
        {
          name:'销量',
          data: sales,
          type: 'bar'
        },
        {
          name:'库存',
          data: stores,
          type: 'bar'
        }
      ]
    }
  }
  // 更新柱状图数据
  update = () => {
    this.setState(state => ({
      sales:state.sales.map((sale,key)=>{
        // 如果剩下的库存大于等于5，则销量加5
        if(state.stores[key]>=5){
          return sale+5
        }else{
          // 如果剩下的库存小于5，则销量加上剩余的所有库存
          return sale+state.stores[key]
        }
      }),
      stores:state.stores.map(store=>{
        // 如果剩下的库存大于5，则库存减5
        // 如果剩下的库存小于5，则剩余的所有库存清空
        const newStore = (store-5)>0?(store-5):0
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
