/***
 * store 数据处理
 * 
 * */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './../reducer';


export default () => { return createStore(reducer, applyMiddleware(thunk)) };
