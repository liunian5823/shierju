/**
 * Created by zhouby on 2018/4/17/017.
 */
// 高达临时测试
const temporaryConfig = {
  axiosUrlQM: '/api/platform',
  axiosUrl: '/test',
  uploadUrl: 'https://106.39.82.13:8443/api/base/file',
  resourceUrl: 'https://106.39.82.13:8443/',
  ecCaptchaUrl: 'https://106.39.82.13:8443/api',
};
//test
const systemConfig_production_test = {
  axiosUrlQM: '/api/platform',
  axiosUrl: '/api',
  uploadUrl: '/api/base/file',
  resourceUrl: 'https://106.39.82.13:8443/', //资源服务器域名
  ecCaptchaUrl: '/api', //图片验证码url

  projectNameGaoda: '/static/platform/index.html#',
  // projectNameGaoda: 'http://localhost:3000/#',
  projectCrccmallPath: '/static/crccmall/#',
  axiosUrlGaoda: '/api',
  dfsPath: '/',
  downUrl: '/',
  ec_axiosUrl: '/edsServer',
  purchaserUrl: '/static/purchaser/#',
};
//dev
const systemConfig_development_check = {
  axiosUrlQM: '/api/platform',
  axiosUrl: '/crcc', //测试环境
  // axiosUrl: "/demo",//预发部环境
  uploadUrl: 'https://106.39.82.14:8443/api/base/file',
  resourceUrl: 'https://106.39.82.14:8443/', //资源服务器域名
  ecCaptchaUrl: 'https://106.39.82.14:8443/api', //图片验证码url
  // ecCaptchaUrl: 'https://106.39.82.14:8443/api',//预发部环境//图片验证码url
  // ecCaptchaUrl: 'http://192.168.77.227:8046',

  projectNameGaoda: '/#',
  projectCrccmallPath: 'http://localhost:5000/#',
  axiosUrlGaoda: '', //高达开发环境
  dfsPath: 'http://192.168.1.247:8888/',
  downUrl: 'https://106.39.82.14:8443/', //高达资源下载
  // ...temporaryConfig
  ec_axiosUrl: '/edsServer',
  purchaserUrl: '/static/purchaser/#',
};

//demo
const systemConfig_production_demo = {
  axiosUrlQM: '/api/platform',
  axiosUrl: '/api',
  uploadUrl: '/api/base/file',
  resourceUrl: '/', //资源服务器域名
  ecCaptchaUrl: '/api', //图片验证码url

  projectNameGaoda: '/#',
  projectCrccmallPath: '/static/crccmall/#',
  axiosUrlGaoda: '/api',
  dfsPath: '/',
  downUrl: '/',
  ec_axiosUrl: '/edsServer',
  purchaserUrl: '/static/purchaser/#',
};
//生产
const systemConfig_production_build = {
  axiosUrlQM: '/api/platform',
  axiosUrl: '/api',
  uploadUrl: '/api/base/file',
  resourceUrl: 'https://www.crccmall.com/', //资源服务器域名
  ecCaptchaUrl: '/api', //图片验证码url

  projectNameGaoda: '/static/platform/index.html#',
  projectCrccmallPath: '/static/crccmall/#',
  axiosUrlGaoda: '/api',
  dfsPath: 'https://img.crccmall.com/',
  downUrl: 'http://www.crccmall.com/',
  ec_axiosUrl: '/edsServer',
  purchaserUrl: '/static/purchaser/#',
};
const getSystemConfig = () => {
  //本地开发
  if (process.env.SYS_ENV === 'start') {
    return systemConfig_production_test;
  }

  if (process.env.SYS_ENV === 'test') {
    return systemConfig_production_test;
  }
  if (process.env.SYS_ENV === 'dev') {
    return systemConfig_development_check;
  }
  if (process.env.SYS_ENV === 'demo') {
    return systemConfig_production_demo;
  }
  if (process.env.SYS_ENV === 'build') {
    return systemConfig_production_build;
  }
};
const configs = {
  ...getSystemConfig(),
};
const systemConfigPath = {
  axiosUrl: (url) => {
    return configs.axiosUrl + url;
  },
  dfsPathUrl: (url) => {
    return configs.dfsPath + url;
  },
  jumpPage: (url) => {
    return configs.projectNameGaoda + url;
  },
  jumpCrccmallPage: (url) => {
    return configs.projectCrccmallPath + url;
  },
  axiosUrlGaoda: (url) => {
    return configs.axiosUrlGaoda + url;
  },
  jumpPurchaser: (url) => {
    return configs.purchaserUrl + url;
  },
};
/*
 * 判断当前环境
 */
const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

module.exports = { configs, systemConfigPath, isProduction };
