/*
用于管理state和reducer的redux核心模块store
*/

import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from './reducer'

export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))