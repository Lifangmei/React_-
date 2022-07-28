import React, { Component } from 'react'
import { Switch,Route,Redirect } from 'react-router-dom'
import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/products/product' component={ProductHome} exact/>
        <Route path='/products/product/detail' component={ProductDetail}/>
        <Route path='/products/product/addupdate' component={ProductAddUpdate}/>
        <Redirect to='/products/product'/>
     </Switch>
    )
  }
}
