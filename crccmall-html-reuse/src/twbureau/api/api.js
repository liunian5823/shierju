import '@/framework/axios/axios';
import qs from 'qs'
const apis = 'http://10.10.9.175:9999'
// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null || o[key] === '') {
      delete o[key];
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

export default class httpsapi {

  static jsonp(url) {
    //json请求
    return new Promise((resolve, reject) => {
      JsonP(apis+url, {
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

  static ajax(method, url, params, options = {}) {
    if (params) {
      params = filterNull(params);
    }
    console.log(apis+url,options)
    return new Promise((resolve, reject) => {
      axios({
        method: method,
        url: apis+url,
        // baseURL: root,
        timeout: 40000,
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        data: method === 'POST' || method === 'post' || method === 'PUT' || method === 'put' ? params : null,
        params: method === 'GET' || method === 'get' ? params : null,
        withCredentials: true,
        ...options
      }).then((res) => {
        if (res.code == '403') {
          window.location.href = SystemConfig.configs.loginUrl;
        }
        if (res.code == '200' || res.code == '000000') {
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        //请求失败
        reject(err);
      })
    })
  }
  static File( url, params) {
    if (params) {
      params = filterNull(params);
    }
    return new Promise((resolve, reject) => {
      var a = { responseType: "blob" };
      axios
        .post(apis+url, qs.parse(params), a)
        .then(res => {
          console.log(res)
          resolve(res);
        })
        .catch(err => {
          reject(err.response);
        });
    });
  }
  
}
