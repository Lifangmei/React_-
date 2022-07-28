import React, { Component } from 'react'
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Line extends Component {
  // 初始化销量和访问量状态
  state = {
    sales:[5201,4058,6280,5185,4260,4802,5320,5920,5204,4085,5968,5205],
    visits:[11201,10058,13280,12185,10260,10802,11320,12920,12204,10085,12968,11205]
  }
  // 获取折线图的配置对象
  getOption = () => {
    const {sales,visits} = this.state
    return {
      tooltip:{},  // 提示框组件
      legend:{
        data:['访问量','销售量'],
        bottom:10
      },
      xAxis: {
        data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
      },
      yAxis: {},
      series: [
        {
          name:'访问量',
          data: visits,
          type: 'line'
        },
        {
          name:'销售量',
          data: sales,
          type: 'line'
        }
      ]
    }
  }
  render() {
    return (
          <ReactEcharts option={this.getOption()} style={{height:250}}/>        
    )
  }
}
