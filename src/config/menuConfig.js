/*
用于存储左侧导航栏的菜单数据
*/

import {HomeOutlined,ShopOutlined,BarsOutlined,ShoppingCartOutlined,UserOutlined,SafetyCertificateOutlined,AreaChartOutlined,BarChartOutlined,LineChartOutlined,PieChartOutlined} from '@ant-design/icons'

const menuList = [
    {
        title:'首页',
        key:'/home',
        icon:<HomeOutlined/>,
        isPublic:true  //当前菜单项是公开的
    },
    {
        title:'商品',
        key:'/products',
        icon:<ShopOutlined/>,
        children:[
            {
                title:'品类管理',
                key:'/products/category',
                icon:<BarsOutlined/>
            },
            {
                title:'商品管理',
                key:'/products/product',
                icon:<ShoppingCartOutlined/>
            },
        ]
    },
    {
        title:'用户管理',
        key:'/user',
        icon:<UserOutlined/>
    },
    {
        title:'权限管理',
        key:'/authority',
        icon:<SafetyCertificateOutlined/>
    },
    {
        title:'销售统计',
        key:'/charts',
        icon:<AreaChartOutlined/>,
        children:[
            {
                title:'品类总况',
                key:'/charts/bar',
                icon:<BarChartOutlined/>
            },
            {
                title:'手机销量',
                key:'/charts/line',
                icon:<LineChartOutlined/>
            },
            {
                title:'销量占比',
                key:'/charts/pie',
                icon:<PieChartOutlined/>
            }
        ]
    }
]

export default menuList