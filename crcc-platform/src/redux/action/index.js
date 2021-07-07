/*
 * action 类型
 */
import api from '@/framework/axios';//请求接口的封装

export const type = {
  SWITCH_MENU: 'SWITCH_MENU',
  SET_TOKEN: 'SET_TOKEN',
  SET_AUTH: 'SET_AUTH',
  SET_USERINFO:'SET_USERINFO'
}

// 菜单点击切换，修改面包屑名称
export function switchMenu(menuPath) {
  return {
    type: type.SWITCH_MENU,
    menuPath
  }
}


// 菜单点击切换，修改面包屑名称
export function setToken(token) {
  return {
    type: type.SET_TOKEN,
    token
  }
}


// 设置权限与菜单
function setAuth(data) {
  let authMenuList = data.authMenuList;
  let menuList = data.menuList;
  return {
    type: type.SET_AUTH,
    authMenuList,
    menuList,
  }
}

export function setUserInfo(userInfo) {
    return {
        type: type.SET_USERINFO,
        userInfo,
    }
}


//二分排序
function quickSort(arr) {
  if (arr.length == 0) {
    return [];
  }
  var cIndex = Math.floor(arr.length / 2);
  var c = arr.splice(cIndex, 1);
  var l = [];
  var r = [];


  if (c[0].children) {
    c[0].children = quickSort(c[0].children)
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].sort < c[0].sort) {
      l.push(arr[i])
    } else {
      r.push(arr[i])
    }
  }
  return quickSort(l).concat(c, quickSort(r))
}


export function setUserAuth() {
  let premesSonType = window.localStorage.getItem('premesSonType');
  let postUrl = premesSonType=='PTZX'? '@/sso/loginControl/getUserAuthTree?type=5&premesSonType=PTZX':
    premesSonType ? 
    `@/sso/loginControl/getUserAuthTree?type=5&premesSonType=${premesSonType}`:
    '@/sso/loginControl/getUserAuthTree?type=5&premesSonType=PTZX';
  //从服务器异步获取
  return (dispatch, getState) => {
    api.ajax('POST', postUrl).then(r => {
	  const resData = r.data;
      if (!resData) { return }
      let authMenuList = [];
      // 将菜单数据扁平化为一级
      function flatNavList(arr) {
        arr.map((v) => {   
          if (v.children && v.children.length) {
            flatNavList(v.children);
          }
          authMenuList.push({ ...v });
        });
      }

      flatNavList(resData);

      dispatch(setAuth({
        authMenuList,
        menuList: quickSort(resData)
      }));
    })
  }
}