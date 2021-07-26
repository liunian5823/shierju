import Util from '@/utils/util'
import Qs from 'qs'
const isGaoda = function (url) {
    if (
        url.indexOf("/common/") > -1 ||
        url.indexOf("/reuse/") > -1
    ) {
        return true;
    }
}

axios.interceptors.request.use((config) => {
    // if (config.method == "post" && isGaoda(config.url)) {
    //     config.data = Qs.stringify(config.data);
    // }
    // if (isGaoda(config.url)) {
    //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // }
    // if (isGaoda(config.url)) {
    //     if (config.url.indexOf("@") != -1) {
    //         config.url = config.url.replace("@", SystemConfig.configs.gaodaAxiosUrl);
    //     }
    // } else {
    //     if (config.url.indexOf("@") != -1) {
    //         config.url = config.url.replace("@", SystemConfig.configs.axiosUrl);
    //     }
    // }
    
    if (config.url.indexOf("@") != -1) {
        config.url = config.url.replace("@", SystemConfig.configs.axiosUrl);
    }
    if (config.method == "post" && isGaoda(config.url)){
        config.data = Qs.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  
    if (config.headers['change_content_type']) {
        config.headers['Content-Type'] = 'application/json'
        delete config.headers['change_content_type']
    }
    // config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['If-Modified-Since'] = '0';
    if (config.headers['Sub-Platform'] === '0') {
        delete config.headers['Sub-Platform'];
    } else {
        config.headers['Sub-Platform'] = 6;
    }

    // 使用 HTTP 基础验证，并提供凭据

    // config.headers['Authorization'] = window.reduxState.ebikeData.token || '';
    config.headers['Authorization'] = CooKie.get('token');
    config.headers['token'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTEwMTUwOTgsInVzZXJfbmFtZSI6IjIwMjM0IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImp0aSI6IjM0OWVkNTFhLTAzNjctNDUwNC1hYzI1LTNmMzUzODA1YzdmZSIsImNsaWVudF9pZCI6InN1bnRyYXkiLCJzY29wZSI6WyJhbGwiXX0.gv8H-JLXukr6syxsDSb34CKgim_ieWeBMkoOP932Tr4";
    // config.headers['Authorization'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTEwMTUwOTgsInVzZXJfbmFtZSI6IjIwMjM0IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImp0aSI6IjM0OWVkNTFhLTAzNjctNDUwNC1hYzI1LTNmMzUzODA1YzdmZSIsImNsaWVudF9pZCI6InN1bnRyYXkiLCJzY29wZSI6WyJhbGwiXX0.gv8H-JLXukr6syxsDSb34CKgim_ieWeBMkoOP932Tr4";
    return config;
   
});

const errMsg = "系统错误!请重试,或联系管理员.";
axios.interceptors.response.use((response) => {
    if (response.data == undefined || (response.data && (response.data.status == "FAILURE" || response.data.code == "400000"))) {
      
        Util.alert(errMsg, { type: "error" });
        return undefined;
    }

    return response.data;
  
}, (err) => {
    console.log('123')
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误'
                break

            case 401:
                err.message = '未授权，请登录'
                break

            case 403:
                Util.toLogin()
                err.message = '拒绝访问'
                break
        }
    }
    return Promise.reject(err);
})
