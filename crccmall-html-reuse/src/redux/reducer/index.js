/***
 * reducer 数据处理
 * 
 * */
import { type } from './../action';
import { combineReducers } from 'redux'
import * as contentReducer from '../gaoda/content/ContentReducer';
import * as AuthReducer from '../gaoda/auth/AuthReducer';

const initalState = {
  menuPath: '/home',
  token: '',
  isLogin: true,
  menuList: [],
  authMenuList: [],
}

const ebikeData = (state = initalState, action) => {
  switch (action.type) {
    case type.SWITCH_MENU:
      return {
        ...state,
        menuPath: action.menuPath
      }
      break;
    case type.SET_TOKEN:
      let isLogin = action.token ? true : false;
      return {
        ...state,
        isLogin,
        token: action.token
      }
      break;
    case type.SET_AUTH:
      return {
        ...state,
        menuList: action.menuList,
        authMenuList: action.authMenuList
      }
      break;
    default:
      return { ...state };
      break;
  }
}
export default combineReducers({
    ebikeData:ebikeData,
    ...contentReducer,
    ...AuthReducer
})
