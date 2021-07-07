/***
 * store 数据处理
 *
 * */
import {createStore, applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from './../reducer';

const middleware = applyMiddleware(
    thunk // 允许我们 dispatch() 函数
);

// , compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default () => {
    return createStore(reducer,compose(middleware))
};
