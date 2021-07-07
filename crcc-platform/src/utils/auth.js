import Cookies from 'js-cookie';
import Util from '@/utils/util';

const authToken = {
  // 当Token超时后采取何种策略
  tokenKey: "platformToken",
  // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到授权页面
  // getNewToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)
  tokenTimeoutMethod: 'getNewToken',

  // 在Cookie中记录登录状态的key
  loginKey: 'isLogin',

  // Token是否超时
  hasToken: function () {
    return Cookies.get(this.tokenKey);
  },

  // 当前是否是登录状态
  isLogin: function () {
    return Cookies.get(this.loginKey);
  },

  // 设置Token
  setToken: function (token) {
    Util.setCookie(this.tokenKey, token);
  },

  // 设置登录状态
  setLoginStatus: function () {
    Util.setCookie(this.loginKey, 'true');
  },

  // 移除Token
  removeToken: function () {
    Cookies.remove(this.tokenKey);
  },

  // 移除登录状态
  removeLoginStatus: function () {
    Cookies.remove(this.loginKey);
  },

};

export default authToken;
