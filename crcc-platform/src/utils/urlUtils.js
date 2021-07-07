import { filterNull } from '@/framework/axios';
import { configs } from './config/systemConfig';

function getQueryString(name) {
    let reg = new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.href.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}

function exportFile(url, param) {
    window.location.href = SystemConfig.configs.axiosUrlGaoda + getUrlByParam(url, filterNull(param))
}

function getUrlByParam(url, data) {
    if (url.indexOf("?") == -1) {
        url += "?";
    }
    let i = 0;
    for (let k in data) {
        let value = data[k] !== undefined ? data[k] : '';
        let f = "";
        if (i != 0) {
            f = "&"
        }
        url = url + f + k + '=' + encodeURIComponent(value);
        i++;
    }
    return url;
}
function getUrlByParamNew(url, data) {
    // if (url.indexOf("?") == -1) {
    //     url += "?";
    // }
    let i = 0;
    for (let k in data) {
        let value = data[k] !== undefined ? data[k] : '';
        let f = "";
        if (i != 0) {
            f = "&"
        }
        url = url + f + k + '=' + encodeURIComponent(value);
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

function viewImg(url) {
    if (url) {
        if (url.indexOf('http') === 0) return url;
        if (url) {
            let arr = url.split('?');
            return `${configs.resourceUrl}${arr[0]}`
        }
    }
    return '';
}
function getSearchByHistory(url) {
    let str = url;
    let params = {};
    if (typeof url == 'string') {
        if (str.indexOf('?') !== -1) {
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
export {
    getQueryString, getUrlByParam,getUrlByParamNew, randomString, exportFile, viewImg, getSearchByHistory
}
