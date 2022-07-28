import React, { Component } from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class SaleBar extends Component {
  // 初始化销量状态
  state = {
    sales:[5201,4058,6280,5185,4260,4802,5320,5920,5204,4085,5968,5205]
  }
  // 获取柱状图的配置对象
  getOption = () => {
    const {sales} = this.state
    return {
      tooltip:{},  // 提示框组件
      legend:{
        data:['销量']
      },
      xAxis: {
        data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
      },
      yAxis: {},
      series: [
        {
          name:'销量',
          data: sales,
          type: 'bar'
        }
      ]
    }
  }
  render() {
    return (
        <Card title='销售趋势'>
          <ReactEcharts option={this.getOption()}/>
        </Card>
    )
  }
}
