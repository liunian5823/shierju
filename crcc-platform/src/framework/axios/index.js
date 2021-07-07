import './axios';

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null || o[key] === '' || o[key] === undefined) {
      delete o[key];
      continue
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim();
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key]);
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key]);
    }
  }
  return o;
}

export { filterNull };

export default class Api {

  static jsonp(url) {
    //json请求
    return new Promise((resolve, reject) => {
      JsonP(url, {
        param: 'callback'
      }, function (err, res) {
        // to-do
        if (res.status == "success") {
          resolve(res);
        } else {
          reject(res.message);
        }
      })
    })
  }

  static ajax(method, url, params, options) {
    if (options) {
      var exportFile = options.export ? true : false;
      var resDataType = options.resDataType ? true : false;
    }
    if (params) {
      params = filterNull(params);
    }
    return new Promise((resolve, reject) => {
      axios({
        method: method,
        url: url,
        // baseURL: root,
        timeout: 20000,
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        data: method === 'POST' || method === 'post' || method === 'PUT' || method === 'put' ? params : null,
        params: method === 'GET' || method === 'get' ? params : null,
        withCredentials: true
      }).then((res) => {
        if (exportFile == true) {
          resolve(res);
        }
        if (resDataType) {
          resolve(res);
        }
        if (res.code == '403') {
          window.location.href = window.location.href.split('#')[0] + '#login'
        }
        if (res.code == '200' || res.code == '000000' || res.code == '444444') {
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        //请求失败
        reject(err);
        console.log('axios/index.js', err);
      })
    })
  }
}
