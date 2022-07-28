import React, { Component } from 'react'
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Pie extends Component {
  // 初始化销量和库存状态
  state = {
    sales1:[
      { value: 120, name: '电脑' },
      { value: 259, name: '手机' },
      { value: 306, name: '服装' },
      { value: 250, name: '食品' },
      { value: 154, name: '水果' },
      { value: 80, name: '玩具' },
      { value: 60, name: '家具' }
    ],
    stores1:[100, 102, 154, 80, 66, 60, 40],
    sales2:[
      { value: 56, name: '华为', itemStyle:{color:'#c25051'},key:0},
      { value: 32, name: '三星', itemStyle:{color:'#c23531'},key:1},
      { value: 40, name: 'OPPO', itemStyle:{color:'#c23531'},key:2},
      { value: 45, name: '小米', itemStyle:{color:'#c23531'},key:3},
      { value: 36, name: 'VIVO', itemStyle:{color:'#c23531'},key:4},
      { value: 50, name: '苹果', itemStyle:{color:'#c23531'},key:5}
    ],
    stores2:[22, 11, 24, 17, 18, 10]
  }
  // 为饼状图一创建ref容器
  pieRef = React.createRef()
  // 获取饼状图1的配置对象
  getOption1 = () => {
    const {sales1} = this.state
    return {
      title:{
        text:'商品品类每周销售量占比'
      },
      tooltip: {},
      legend: {
        orient: 'vertical',
        top: '10%',
        left: '75%',
        itemGap:25,
        itemHeight:25,
        itemWidth:40,
        textStyle:{fontSize:15,}
      },
      series: [
        {
          name: '商品品类',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: sales1
        }
      ]
    }    
  }
  // 获取饼状图2的配置对象
  getOption2 = () => {
    const {sales2} = this.state
    return {
      backgroundColor: '#2c343c',
      title: {
        text: '手机品牌每周销售量占比',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {},
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: '品牌',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: sales2.sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          // itemStyle: {
          //   color: '#c23531',
          //   shadowBlur: 200,
          //   shadowColor: 'rgba(0, 0, 0, 0.5)'
          // },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    }    
  }
  // 更新数据
  update = () => {
    this.setState(state => ({
      sales1:state.sales1.map((sale,key)=>{
        // 如果剩下的库存大于等于5，则销量加1
        if(state.stores1[key]>=5){
          sale.value += 5
        }else{
          // 如果剩下的库存小于5，则销量加上剩余的所有库存
          sale.value += state.stores1[key]
        }
        return sale
      }),
      stores1:state.stores1.map(store=>{
        // 如果剩下的库存大于5，则库存减5
        // 如果剩下的库存小于5，则剩余的所有库存清空
        const newStore = (store-5)>0?(store-5):0
        return newStore
      }),
      sales2:state.sales2.map(sale=>{
        // 如果剩下的库存大于等于1，则销量加1
        if(state.stores2[sale.key]>=1){
          sale.value += 1
        }else{
          // 如果剩下的库存小于1，则销量加上剩余的所有库存
          // 这里使用sale中的key使为了解决饼状图2数据更新时索引好像不对的问题
          sale.value += state.stores2[sale.key]
        }
        return sale
      }),
      stores2:state.stores2.map(store=>{
        // 如果剩下的库存大于1，则库存减1
        // 如果剩下的库存小于1，则剩余的所有库存清空
        const newStore = (store-1)>0?(store-1):0
        return newStore
      })
    }))
  }
  // 组件更新后重新获取饼状图1的option，解决它不更新的问题
  componentDidUpdate(){
    // 获取饼状图1的实例
    const instance = this.pieRef.current.getEchartsInstance()
    if(instance){
      // 重新设置option
      instance.setOption(this.getOption1())
    }
  }
  render() {
    return (
        <div>
          <Card>
            <Button type='primary' onClick={this.update}>更新数据</Button>
          </Card>
          <Card>
            <ReactEcharts ref={this.pieRef} option={this.getOption1()} style={{height:300}}/>
          </Card>
          <Card>
            <ReactEcharts option={this.getOption2()} style={{height:300}}/>
          </Card>
        </div>
    )
  }
}

