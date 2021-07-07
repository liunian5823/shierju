# **概述：**
 _reuse 文件下为循环物资的工程代码_  _柯昆—2020/5/21_
 
# **程序代码部分：**

######   bidDetail -  竞价管理详情
######   bidManagement -  竞价管理列表
######   channelManagement -  频道管理
         频道管理组件
          —— model 修改弹框
          —— upload 上传组件
######   mixins -  混合类
######   orderDetails -  订单详情
######   orderInquiry -  订单查询
######   supplDetails -  供求信息详情
######   supplyApproval -  供求信息审核
######   supplyLook -  供求信息查询
######   document.md -  代码文档

# **项目公共修改部分：**

###### src/views/router 下添加了循环物质相关路由
```
// 循环物资
import SupplyLook from 'bundle-loader?lazy&name=SupplyLook!@/pages/reuse/supplyLook';
import SupplyApproval from 'bundle-loader?lazy&name=SupplyApproval!@/pages/reuse/supplyApproval';
import SupplyDetails from 'bundle-loader?lazy&name=supplDetails!@/pages/reuse/supplDetails';
import ReuseOrderInquiry from 'bundle-loader?lazy&name=ReuseOrderInquiry!@/pages/reuse/orderInquiry';
import ReuseOrderInquiryDetails from 'bundle-loader?lazy&name=ReuseOrderInquiryDetails!@/pages/reuse/orderDetails';
import ReuseChannelManagement from 'bundle-loader?lazy&name=ReuseChannelManagement!@/pages/reuse/channelManagement';
import ReuseBidManagement from 'bundle-loader?lazy&name=ReuseBidManagement!@/pages/reuse/bidManagement';
import ReuseBidManagementDetails from 'bundle-loader?lazy&name=ReuseBidManagementDetails!@/pages/reuse/bidDetail';

{ type: "route", path: "/reuse/supplyLook", component: bundle(Empty, SupplyLook, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/supplyLook/details/:uuids", component: bundle(Empty, SupplyDetails, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/supplyApproval", component: bundle(Empty, SupplyApproval, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/supplyApproval/details/:uuids", component: bundle(Empty, SupplyDetails, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/orderInquiry", component: bundle(Empty, ReuseOrderInquiry, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/orderInquiry/details/:uuids", component: bundle(Empty, ReuseOrderInquiryDetails, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/channelManagement", component: bundle(Empty, ReuseChannelManagement, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/bidManagement", component: bundle(Empty, ReuseBidManagement, { type: "callback" }), exact: true },
{ type: "route", path: "/reuse/bidManagement/details/:uuids", component: bundle(Empty, ReuseBidManagementDetails, { type: "callback" }), exact: true },
```
###### src/utils/util 下添加新方法
```
打印
  print(dom) {...}
时间处理
  formatterTime: (value, type = 'datetime') => {...},
  timerCountDown: (dateF, dateS = new Date()) => {...},
```
###### src/utils/urlUtils 下添加新方法
```
图片预览URl处理
  viewImg(url) {...}
```
###### src/utils/validator validator.js 是新添加的文件 
```
检验信息等
// 电话号码
export const phone = {...}
// 数字
export const number = {...}
// 价格
export const price = {...}
// 必填
export const required = (message) => {...};
```
# **注意事项：**
_mixins/index.jsx 是循环物资下的列表公共类,一般列表页面都会继承_

**频道管理的地址需要在系统管理中配置菜单按钮中填写**
