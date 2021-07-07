// 开发环境
const systemConfig_development_start = {
    tenderingUrl: "http://localhost:1212/#",
    axiosUrl: "/api",
    hostUrl: "http://192.168.0.223:8000#",
    resourceUrl: "https://106.39.82.13:8443/",//资源服务器域名
    uploadUrl: "/api/common/upload/file",//统一文件上传
    //统一文件下载(例:downUrl + '?filePath=group1/M00/00/42/wKhCZl6WebqAYqbcABmFYB9Tcoo94.jpeg?filename=timg%20(2).jpg' )
    //不支持文件展示
    downUrl: "https://106.39.82.13:8443/common/upload/exportFastdfsFile/",
    exportUrl: "https://106.39.82.13:8443/api",//导出文件url
    //文件展示（例:fileUrl + 'group1/M00/00/42/wKhCZl6WebqAYqbcABmFYB9Tcoo94.jpeg'）
    //文件下载（例:fileUrl + 'group1/M00/00/42/wKhCZl6WebqAYqbcABmFYB9Tcoo94.jpeg?filename=timg (2).jpg'）
    //即有?filename=xxx 为下载，没有为展示
    fileUrl: "https://106.39.82.13:8443/",
    //大频道
    channelUrl: "https://106.39.82.13:8443/static/crccmall/#",
    loginUrl: `/#/login?callback=${encodeURIComponent(window.location.href)}`,
    ecCaptchaUrl: '/reuse',
    gaodaprojectName: '#',
    gaodaShopProjectName: '/static/crccmall/#',
    gaodaAxiosUrl: "/api",
    gaodadfsPath: "https://106.39.82.13:8443/api/",
    gaodaIm: "",
    oldMallPath: "",
    GDmallUrl: "https://test.crccmall.com:8443",
    //其他公司提供 top组件 所用参数
    platforms: "http://localhost:8001/#",
    crccmallUrl: "/static/crccmall/#",
    JstagePath: "/static/stage/#"
};
// test环境
const systemConfig_development_test = {
    tenderingUrl: "http://localhost:1212/#",
    axiosUrl: "/api",
    hostUrl: "http://192.168.0.223:8000#",
    resourceUrl: "https://106.39.82.13:8443/",//资源服务器域名
    uploadUrl: "https://106.39.82.13:8443/api/common/upload/file",//统一文件上传
    //统一文件下载(例:downUrl + '?filePath=group1/M00/00/42/wKhCZl6WebqAYqbcABmFYB9Tcoo94.jpeg?filename=timg%20(2).jpg' )
    //不支持文件展示
    downUrl: "https://106.39.82.13:8443/common/upload/exportFastdfsFile/",
    exportUrl: "https://106.39.82.13:8443/api",//导出文件url
    //文件展示（例:fileUrl + 'group1/M00/00/42/wKhCZl6WebqAYqbcABmFYB9Tcoo94.jpeg'）
    //文件下载（例:fileUrl + 'group1/M00/00/42/wKhCZl6WebqAYqbcABmFYB9Tcoo94.jpeg?filename=timg (2).jpg'）
    //即有?filename=xxx 为下载，没有为展示
    fileUrl: "https://106.39.82.13:8443/",
    //大频道
    channelUrl: "https://106.39.82.13:8443/static/crccmall/#",
    loginUrl: `/static/crccmall/index.html#/login?callback=${encodeURIComponent(window.location.href)}`,
    ecCaptchaUrl: '/reuse',
    gaodaprojectName: '#',
    gaodaShopProjectName: '/static/crccmall/#',
    gaodaAxiosUrl: "https://106.39.82.13:8443/api/reuse",
    gaodadfsPath: "https://106.39.82.13:8443/api/",
    gaodaIm: "",
    oldMallPath: "",
    GDmallUrl: "https://106.39.82.13:8443",
    //其他公司提供 top组件 所用参数
    platforms: "http://localhost:8001/#",
    crccmallUrl: "/static/crccmall/#",
    JstagePath: "/static/stage/#"
};

// www2环境
const systemConfig_development_check = {
    // 招投标地址
    tenderingUrl: "/static/tendering/#",
    GDmallUrl: "https://106.39.82.14:8443/",
    axiosUrl: "/api",
    resourceUrl: "https://106.39.82.14:8443/",
    uploadUrl: "https://106.39.82.14:8443/api/common/upload/file",
    downUrl: "https://106.39.82.14:8443/api/common/upload/exportFastdfsFile/",
    exportUrl: "https://106.39.82.14:8443/api",
    fileUrl: "https://106.39.82.14:8443/",
    channelUrl: "https://106.39.82.14:8443/static/crccmall/#",
    loginUrl: `/static/crccmall/index.html#/login?callback=${encodeURIComponent(window.location.href)}`,
    ecCaptchaUrl: '/reuse',
    gaodaprojectName: '/static/reuse/#',
    gaodaShopProjectName: '/static/crccmall/#',
    gaodaAxiosUrl: "https://106.39.82.14:8443/api/reuse",
    gaodadfsPath: "https://106.39.82.14:8443/api/",
    gaodaIm: "",
    oldMallPath: "",
    platforms: "http://localhost:8001/#",
    crccmallUrl: "/static/crccmall/#",
    JstagePath: "/static/stage/#"
};

// demo环境
const systemConfig_production_demo = {
    // 招投标地址
    tenderingUrl: "/static/tendering/#",
    GDmallUrl: "",
    axiosUrl: "/api",
    resourceUrl: "/",
    uploadUrl: "/api/common/upload/file",
    downUrl: "/api/common/upload/exportFastdfsFile",
    exportUrl: "/api",
    fileUrl: "/",
    channelUrl: "/static/crccmall/#",
    loginUrl: `/static/crccmall/index.html#/login?callback=${encodeURIComponent(window.location.href)}`,
    ecCaptchaUrl: '/reuse',
    gaodaprojectName: '/static/reuse/#',
    gaodaShopProjectName: '/static/crccmall/#',
    gaodaAxiosUrl: "/api/reuse",
    gaodadfsPath: "/api/",
    gaodaIm: "",
    oldMallPath: "",
    platforms: "/",
    crccmallUrl: "/static/crccmall/#",
    JstagePath: "/static/stage/#"
};

// www环境
const systemConfig_production_build = {
    // 招投标地址
    tenderingUrl: "/static/tendering/#",
    GDmallUrl: "",
    axiosUrl: "/api",
    //开发环境没项目名
    resourceUrl: "https://img.crccmall.com/",
    uploadUrl: "https://www.crccmall.com/api/common/upload/file",
    downUrl: "https://www.crccmall.com/api/common/upload/exportFastdfsFile",
    exportUrl: "https://www.crccmall.com/api",
    fileUrl: "https://img.crccmall.com/",
    channelUrl: "https://www.crccmall.com/static/crccmall/#",
    loginUrl: `/static/crccmall/index.html#/login?callback=${encodeURIComponent(window.location.href)}`,
    ecCaptchaUrl: '/reuse',
    gaodaprojectName: '/static/reuse/#',
    gaodaShopProjectName: '/static/crccmall/#',
    gaodaAxiosUrl: "https://www.crccmall.com/api/reuse",
    gaodadfsPath: "https://www.crccmall.com/api/",
    gaodaIm: "",
    oldMallPath: "",
    platforms: "http://localhost:8001/#",
    crccmallUrl: "/static/crccmall/#",
    JstagePath: "/static/stage/#"
};
const getSystemConfig = () => {
    //本地开发
    if (process.env.SYS_ENV === 'start') {
        return systemConfig_development_start;
    }

    if (process.env.SYS_ENV === 'test') {
        return systemConfig_development_test;
    }
    if (process.env.SYS_ENV === 'dev') {
        return systemConfig_development_check;
    }
    if (process.env.NODE_ENV === 'demo') {
        return systemConfig_production_demo;
    }
    if (process.env.SYS_ENV === 'build') {
        return systemConfig_production_build;
    }

}
const configs = {
    ...getSystemConfig(),
    webCtx: '/#'
};
const systemConfigPath = {
    jumpStagePage: ( url ) => {
        return configs.JstagePath + url;
    },
    jumpTenderingPage: (url) => {
        return configs.tenderingUrl + url;
    },
    mallIndexUrl: (url) => {
        return configs.GDmallUrl + url;
    },
    axiosUrl: (url) => {
        return configs.axiosUrl + url;
    },
    dfsPathUrl: (url) => {
        return configs.gaodadfsPath + url;
    },
    jumpPage: (url) => {
        return configs.gaodaprojectName + url;
    },
    jumpOldMallPage: (url) => {
        return configs.oldMallPath + url;
    },
    jumpCrccmallPage: (url) => {
        return configs.gaodaShopProjectName + url;
    },
    jumpShopPage: (url) => {
        return configs.crccmallUrl + url;
    },
    jumpPlatforms: (url) => {
        return configs.platforms + url;
    },
    fileDown: (url) => {
        return configs.fileUrl + url
    },
}
const constant = {
    responseSuccessCode: "000000"
}
/*
 * 判断当前环境
 */
const isProduction = () => {
    return process.env.NODE_ENV === 'production' && process.env.SYS_ENV !== 'test';
}

module.exports = { configs, systemConfigPath, isProduction, constant };
