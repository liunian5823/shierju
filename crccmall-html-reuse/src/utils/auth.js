import Cookies from 'js-cookie';

const authToken = {
  // 当Token超时后采取何种策略
  tokenKey: "token",
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
    // 设置token，并填写有效期
    var maxAge = new Date(new Date().getTime() + 30 * 60 * 1000);
    Cookies.set(this.tokenKey, token, {
      expires: maxAge
    });
  },

  // 设置登录状态
  setLoginStatus: function () {
    // 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
    var maxAge = new Date(new Date().getTime() + 30 * 60 * 1000);
    Cookies.set(this.loginKey, 'true', {
      expires: maxAge
    });
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
