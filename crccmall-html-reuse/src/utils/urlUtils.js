import { configs } from './config/systemConfig'
function getQueryString(name) {
    let reg = new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.href.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}
function getUrlByParam(url,data){
    if(url.indexOf("?")==-1){
        url+="?";
    }
    let i=0;
    for(let k in data){
        let value=data[k]!==undefined ? data[k] :'';
        let f ="";
        if(i!=0){
            f="&"
        }
        url =url+f+k+'='+encodeURIComponent(value);
        i++;
    }
    return url;
}
function randomString(len) {
    len = len || 64;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
function getUrlByParamNew(url,data){
    if(data && Object.keys(data).length>0){
        if(url.indexOf("?")==-1){
            url+="?";
        }
        let i=0;
        for(let k in data){
            let value=data[k]!==undefined ? data[k] :'';
            let f ="";
            if(i!=0){
                f="&"
            }
            url =url+f+k+'='+encodeURIComponent(value);
            i++;
        }
    }
    return url;
}

function getSearchByHistory(url) {
    let str = url;
    let params = {};
    if(typeof url == 'string') {
        if(str.indexOf('?') !== -1) {
            str = str.substr(str.indexOf('?') + 1)
        }
        let arr = [];
        arr = str.split('&');
        arr.forEach(v => {
            const label = decodeURIComponent(v.split('=')[0]);
            const value = decodeURIComponent(v.split('=')[1]);
            params[label] = value;
        })
    }
    return params
}
function viewImg(url) {
    if (url) {
        let arr = url.split('?');
        return `${configs.resourceUrl}${arr[0]}`
    }
    return '';
}
function pathToName(item,name){
    if(Array.isArray(item)){
        for(let i=0;i<item.length;i++){
            let n = pathToName(item[i],name)
            if(n){
                return n;
            }
        }
        return null;
    }
    if(item.url==undefined){
        return null;
    }
    if(item.url&&item.url.indexOf("#")==0) {
        let url = item.url;
        if(url.substring(1,url.length)==name){
            return item;
        }
    }
    if(item.url&&item.url==name){
        return item;
    }
    if(item.children){
        for(let i=0;i<item.children.length;i++){
            let n=pathToName(item.children[i],name)
            if(n){
                return n;
            }
        }
    }
}

//根据url获取子平台名称
function getPlatformName() {
    let platform = "个人中心";
    let url = window.location.href;//当前浏览器url
    if(url.indexOf("/system") > -1){
        platform = "系统设置";
    }
    return platform;
}

//根据url获取子平台类型
function getPlatformType() {
    let platform = 10;
    let url = window.location.href;//当前浏览器url
    if(url.indexOf("/system") > -1){
        platform = 11;
    }
    return platform;
}

export  {
    viewImg,
    getQueryString,
    getUrlByParam,
    getUrlByParamNew,
    randomString,
    pathToName,
    getSearchByHistory,
    getPlatformName,
    getPlatformType
}
