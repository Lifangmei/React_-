/*
包含应用中所有接口请求函数的模块
每个函数返回的都是promise对象
*/

import ajax from './ajax'

// 登录
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
// 天气查询
const key = 'd5e4b31f5e6871d78c57ea8320890d53'
export const reqWeather = citycode => ajax('https://restapi.amap.com/v3/weather/weatherInfo',{key,city:citycode,extensions:'base'})
// IP定位
export const reqIp = () => ajax('https://restapi.amap.com/v3/ip',{key})
// 获取一级/二级分类的列表
export const reqCategoryList = (parentId) => ajax('/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (parentId,categoryName) => ajax('/manage/category/add',{parentId,categoryName},'POST')
// 修改分类
export const reqUpdateCategory = (categoryId,categoryName) => ajax('/manage/category/update',{categoryId,categoryName},'POST')
// 获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize})
// 搜索商品分页列表
export const reqSearchProducts = (pageNum,pageSize,searchName,searchType) => ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})
// 根据ID获取分类
export const reqCategory = categoryId => ajax('/manage/category/info',{categoryId})
// 更新商品状态（上级/下架）
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')
// 删除图片
export const reqDeleteImg = name => ajax('/manage/img/delete',{name},'POST')
// 添加/修改商品
export const reqAddOrUpdateProduct = product => ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')
// 获取职位列表
export const reqPositions = () => ajax('/manage/role/list')
// 添加职位
export const reqAddPosition = roleName => ajax('/manage/role/add',{roleName},'POST')
// 更新职位
export const reqUpdatePosition = position => ajax('/manage/role/update',position,'POST')
// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')
// 删除用户
export const reqDeleteUser = userId => ajax('/manage/user/delete',{userId},'POST')
// 添加用户
export const reqAddUser = userObj => ajax('/manage/user/add',userObj,'POST')
// 修改用户
export const reqUpdateUser = userObj => ajax('/manage/user/update',userObj,'POST')