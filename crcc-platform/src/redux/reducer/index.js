/***
 * reducer 数据处理
 * 
 * */
import { type } from './../action';

const initalState = {
  menuPath: '/home',
  token: '',
  isLogin: true,
  menuList: [],
  authMenuList: [],
  userInfo:{}
}

const ebikeData = (state = initalState, action) => {
  console.log(action.userInfo)
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
    case type.SET_USERINFO:
      return {
          ...state,
          userInfo: action.userInfo
      }
      break;

    default:
      return { ...state };
      break;
  }
}
export default ebikeData;
