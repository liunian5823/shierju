import Util from '@/utils/util'
import Qs from 'qs'
axios.interceptors.request.use((config) => {
    if (config.url.indexOf("#") != -1) {
        config.url = config.url.replace("#", SystemConfig.configs.ec_axiosUrl);
    }
	if (config.url.indexOf("/purchaser/adminInformationController/changeAdmin") != -1 || config.url.indexOf("/purchaser/bidinformation/insertInformationForPlatform") != -1) {
	    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;';
		config.data = Qs.stringify(config.data);
	}
    if (config.url.indexOf("@") != -1) {
        config.url = config.url.replace("@", SystemConfig.configs.axiosUrl);
    }
    if (config.url.indexOf("!!") != -1) {
        config.url = config.url.replace("!!", SystemConfig.configs.axiosUrlGaoda);
    }
    if (config.url.indexOf("**") != -1) {
        config.url = config.url.replace("**", SystemConfig.configs.axiosUrlQM);
    }

    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['If-Modified-Since'] = '0';
	config.headers['Sub-Platform'] = '5';
    // 使用 HTTP 基础验证，并提供凭据
    config.headers['Authorization'] = window.reduxState.token || '';
    return config
})
const errMsg = "系统错误!请重试,或联系管理员.";
axios.interceptors.response.use((response) => {
    // if (response.status == 403) {
    //     //403说明这里未登录
    //     Util.toLogin()
    // }
    if (response.data == undefined || (response.data && response.data.status == "FAILURE")) {
        if (response.data.msg) {
            Util.alert(response.data.msg, { type: "error" });
        } else {
            Util.alert(errMsg, { type: "error" });
        }
        return undefined;
    }
    return response.data;
}, (err) => {
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
