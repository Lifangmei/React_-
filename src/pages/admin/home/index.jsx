import React, { Component } from 'react'
import {Row,Col,Card,Statistic,DatePicker,Timeline} from 'antd'
import {StockOutlined,ArrowUpOutlined,ArrowDownOutlined} from '@ant-design/icons'
import moment from 'moment'
import HomeLine from './charts/home-line'
import SaleBar from './charts/sale-bar'
import VisitBar from './charts/visit-bar'
import './index.less'

const {RangePicker} = DatePicker
export default class Home extends Component {
  // 初始化状态
  state = {
    activeTabKey:'visit', // Card默认选中tab的key
    tabList:[
      {
        key: 'visit',
        tab: '访问量',
      },
      {
        key: 'sale',
        tab: '销售量',
      }
    ],  // Card的tab列表
    contentList:{
      visit: (
        <Row gutter={16}>
          <Col span={18}><VisitBar/></Col>
          <Col span={6}>
            <Card title='任务'>
              <Timeline>
                <Timeline.Item>新版本迭代会</Timeline.Item>
                <Timeline.Item>完成网站设计初版</Timeline.Item>
                <Timeline.Item color="red">
                  <p>联调接口</p>
                  <p>功能验收</p>
                </Timeline.Item>
                <Timeline.Item>
                  <p>登录功能设计</p>
                  <p>权限验证</p>
                  <p>页面排版</p>
                </Timeline.Item>
              </Timeline>
            </Card>
          </Col>
        </Row>
      ),
      sale:<SaleBar/>,
    }  //Card的tab列表对应内容区
  }
  
  render() {
    const {activeTabKey,tabList,contentList} = this.state
    // 自定义日期格式 
    const dateFormat = 'YYYY-MM-DD'
    // 自定义日期范围选择框
    const extra = (
      <RangePicker
        defaultValue={[moment('2022/01/01', dateFormat), moment('2022/03/01', dateFormat)]}
        format={dateFormat}
      />
    )
    return (
      <div className='home'>
        <Row gutter={80} className='home-top'>
          <Col span={6} >
            <Card 
              title='本周销售总量'
              extra={<StockOutlined style={{color:'gray'}}/>}
              headStyle={{color:'gray'}}
              bodyStyle={{textAlign:'center'}}
              
            >
              <Statistic                
                value={1229}
                valueStyle={{fontWeight:'bold',fontSize:30,color:'rgb(64 61 61 / 75%)'}}
                suffix='件'
              />
              <Statistic                
                value='10'
                valueStyle={{color: '#cf1322',fontSize:15}}
                prefix='周同比'
                suffix={<span>
                  % &nbsp;
                  <ArrowDownOutlined/>
                </span>}
              />
              <Statistic                
                value='8'
                valueStyle={{color: '#3f8600',fontSize:15}}
                prefix='日同比'
                suffix={<span>
                  % &nbsp;
                  <ArrowUpOutlined/>
                </span>}
              />
            </Card>
          </Col>
          <Col span={18} style={{marginTop:-25}}>
            <HomeLine/>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card              
              tabBarExtraContent={extra}
              style={{ width: '100%' }}
              tabList={tabList}
              activeTabKey={activeTabKey}
              onTabChange={key => this.setState({activeTabKey:key})}
            >
              {contentList[activeTabKey]}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
