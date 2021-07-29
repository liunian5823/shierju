const isServer = typeof window === 'undefined';

export const on = (function () {
    if (!isServer && document.addEventListener) {
        return function (el, event, fn) {
            if (el && event && fn) {
                el.addEventListener(event, fn, false)
            }
        }
    } else if (!isServer && document.attachEvent) {
        return function (el, event, fn) {
            if (el && event && fn) {
                el.attachEvent('on' + event, fn)
            }
        }
    }
})()

export const off = (function () {
    if (!isServer && document.removeEventListener) {
        return function (el, event, fn) {
            if (el && event) {
                el.removeEventListener(event, fn, false)
            }
        }
    } else if (!isServer && document.detachEvent) {
        return function (el, event, fn) {
            if (el && event) {
                el.detachEvent('on' + event, fn)
            }
        }
    }
})()

//关闭浏览器
export const closeWin = () => {
    let userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
        window.location.href="about:blank";
        window.close();
    }else if(userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1){
        window.opener=null;
        window.open('about:blank','_self','').close(); 
    }else {
        window.pener = null;
        window.open("about:blank", "_self");
        window.close();
    }
}

const isUndefined = (value) => {
    if(typeof value === 'undefined') {
        return true
    } else {
        return false
    }
}
const isNull = (value) => {
    if(value === null) {
        return true
    } else {
        return false
    }
}
/**
 * 判断是否为 undefined | null | NaN， 
 * 主要用于select下拉的 key 前台只能用字符串，而后台传过来的又是数字，
 * 在赋值的时候先判断然后在转成字符串
*/
export const isNormal = (value) => {
    if(isUndefined(value) || isNull(value) || isNaN(value)) {
        return false
    } else {
        return true
    }
}
//拆解上传文件的url，获得文件名fileName|文件后缀fileSuf
export const filePathDismant = (str) => {
    let v;
    if(str && str.indexOf('?') !== -1) {
        let params = {};
        let arr = str.split('?');
        let left = arr[0].split('.');
        if(arr[1]) {
            (arr[1].split('&')).map(v => {
                const label = v.split('=')[0];
                const value = v.split('=')[1];
                params[label] = value;
            });
        }
        v = {
            fileName: params.filename,
            filePath: str,
            fileSuf: left[left.length-1]
        }
    }
    return v
}
