import React, { Component } from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class VisitBar extends Component {
  // 初始化访问量状态
  state = {
    sales:[11201,10058,13280,12185,10260,10802,11320,12920,12204,10085,12968,11205]
  }
  // 获取柱状图的配置对象
  getOption = () => {
    const {sales} = this.state
    return {
      tooltip:{},  // 提示框组件
      legend:{
        data:['访问量']
      },
      xAxis: {
        data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
      },
      yAxis: {},
      series: [
        {
          name:'访问量',
          data: sales,
          type: 'bar',
          itemStyle:{color:'#1DA57A'}
        }
      ]
    }
  }
  render() {
    return (
        <Card title='访问趋势'>
          <ReactEcharts option={this.getOption()}/>
        </Card>
    )
  }
}
