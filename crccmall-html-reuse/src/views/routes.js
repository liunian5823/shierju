import { Spin } from "antd";

import HomeFn from "bundle-loader?lazy&name=home!@/pages/home";
import NoPower from "bundle-loader?lazy&name=NoPower!@/pages/nopwer";
// import Personal from "bundle-loader?lazy&name=home!@/pages/personal/Personal"; // lly调试
import Personal from "bundle-loader?lazy&name=Personal!@/pages/personal/user/EditUser";
// 购方
// import BuyScene from "bundle-loader?lazy&name=buyScene!@/pages/buyScene";
// import BuySceneDetail from "bundle-loader?lazy&name=buySceneDetail!@/pages/buySceneDetail";
// import BuySceneBond from "bundle-loader?lazy&name=buySceneBond!@/pages/buyScene/bond";
// import BuyOrder from "bundle-loader?lazy&name=buyOrder!@/pages/buyScene/order";
// // 销方
// import SaleScene from "bundle-loader?lazy&name=saleScene!@/pages/saleScene";
// import SaleSceneDetail from "bundle-loader?lazy&name=saleSceneDetail!@/pages/saleSceneDetail";
// import SaleSceneOrderDetail from "bundle-loader?lazy&name=saleSceneOrderDetail!@/pages/saleSceneDetail/order";
// import SaleBond from "bundle-loader?lazy&name=saleBond!@/pages/saleBond";
// import BuyBond from "bundle-loader?lazy&name=saleBond!@/pages/buyBond";
// import SaleOrderDetail from "bundle-loader?lazy&name=saleOrderDetail!@/pages/saleScene/order";
// import SaleOrderConfirm from "bundle-loader?lazy&name=saleOrderConfirm!@/pages/saleScene/confirm";
// import SaleOffer from "bundle-loader?lazy&name=saleOrderConfirm!@/pages/saleScene/offer";
// import SaleOfferDetail from "bundle-loader?lazy&name=SaleOfferDetail!@/pages/saleScene/offer_detail";
// // 供应（购）
// import SupplyBuyList from "bundle-loader?lazy&name=supplyDemand!@/pages/supply/buy/list";
// import SupplyBuyDetail from "bundle-loader?lazy&name=buySceneDetail!@/pages/supply/buy/details";
// import SupplyBuyCreateOrder from "bundle-loader?lazy&name=buySceneDetail!@/pages/supply/buy/createOrder";
// import SupplyBuyCreateOrderDetails from "bundle-loader?lazy&name=buySceneDetail!@/pages/supply/buy/orderDetails";
// // 供应（销）
// import SupplySellList from "bundle-loader?lazy&name=buySceneDetail!@/pages/supply/sell/list";
// import SupplySellDetail from "bundle-loader?lazy&name=buySceneDetail!@/pages/supply/sell/details";
// import SupplySellCreateOrder from "bundle-loader?lazy&name=buySceneDetail!@/pages/supply/sell/createOrder";
// // 组织管理
// import OrganizationAuth from "bundle-loader?lazy&name=AuthorityManagement!@/pages/organization/auth/AuthorityManagement";
// import OrganizationAuthAddAndEdit from "bundle-loader?lazy&name=AuthorityManagement!@/pages/organization/auth/AddRole";
// import OrganizationAuthDef from "bundle-loader?lazy&name=AuthorityManagement!@/pages/organization/auth/RoleDetail";
// import OrganizationUser from "bundle-loader?lazy&name=buySceneDetail!@/pages/organization/user/User";
// import OrganizationUserAddAndEdit from "bundle-loader?lazy&name=buySceneDetail!@/pages/organization/user/EditUser";
// import OrganizationUserDetai from "bundle-loader?lazy&name=buySceneDetail!@/pages/organization/user/UserDetail";
// import OrganizationProject from 'bundle-loader?lazy&name=organization!@/pages/organization/project/Organization';//组织管理
// import EditAndAddOrganizationProject from "bundle-loader?lazy&name=EditOrganization!@/pages/organization/project/EditOrganization";
// import ProjectOrganizationDetail from "bundle-loader?lazy&name=OrganizationDetail!@/pages/organization/project/OrganizationDetail";

// //审批
// import VerifySetUp from "bundle-loader?lazy&name=verifySetUp!@/pages/verify/setUp";
// import VerifySetUpAdd from "bundle-loader?lazy&name=verifySetUpAdd!@/pages/verify/setUp/add";
// import VerifyManage from "bundle-loader?lazy&name=verifyManage!@/pages/verify/manage";
// import VerifyManageApproval from "bundle-loader?lazy&name=verifyManageApproval!@/pages/verify/manage/approval";
// import VerifyOrder from "bundle-loader?lazy&name=verifyOrder!@/pages/verify/order";
// import VerifyOrderApproval from "bundle-loader?lazy&name=verifyOrderApproval!@/pages/verify/order/approval";
// // 中标结果审核
// import VerifyExamine from "bundle-loader?lazy&name=VerifyExamine!@/pages/verify/examine";
// import VerifyExamineDelVsrify from "bundle-loader?lazy&name=VerifyExamineDelVsrify!@/pages/verify/delvsrify";

// // 交易管理
// import TransactionDelivery from "bundle-loader?lazy&name=TransactionDelivery!@/pages/transaction/delivery";//列表
// import TransactionDeliverySeller from "bundle-loader?lazy&name=TransactionDeliverySeller!@/pages/transaction/deliverySeller";//列表
// import TransactioDetil from "bundle-loader?lazy&name=TransactioDetil!@/pages/transaction/trandelDetil";//详情
// import listInput from "bundle-loader?lazy&name=listInput!@/pages/transaction/listInput";//榜单录入

// // 财务管理
// import CapitalAccoun from "bundle-loader?lazy&name=CapitalAccoun!@/pages/capitalAccoun/account";
// import AccountDetails from "bundle-loader?lazy&name=AccountDetails!@/pages/capitalAccoun/accountDetails";//详情
// import StatementCont from "bundle-loader?lazy&name=StatementCont!@/pages/capitalAccoun/statementCont";
// import StatementDetails from "bundle-loader?lazy&name=StatementDetails!@/pages/capitalAccoun/statementDetails";//详情
// import BuildDetails from "bundle-loader?lazy&name=BuildDetails!@/pages/capitalAccoun/buildDetails";//详情

// /**
//  * desk
//  */
// import PublishScene from "bundle-loader?lazy&name=publishScene!@/pages/desk/publishScene";
// import PublishSceneSuccess from "bundle-loader?lazy&name=publishSceneSuccess!@/pages/desk/publishScene/success";
// import PublishSDBuy from "bundle-loader?lazy&name=publishSD!@/pages/desk/publishSD/buy";
// import PublishSDSell from "bundle-loader?lazy&name=publishSD!@/pages/desk/publishSD/sell";
// import PublishSDBuyEdit from "bundle-loader?lazy&name=publishSD!@/pages/desk/publishSD/buyEdit";
// import PublishSDSellEdit from "bundle-loader?lazy&name=publishSD!@/pages/desk/publishSD/sellEdit";
// import PublishSDSellOrBuy from "bundle-loader?lazy&name=publishSD!@/pages/desk/publishSD/sellOrBuy";
// import BidHall from "bundle-loader?lazy&name=bidHall!@/pages/desk/hall";
// import AuctionHall from "bundle-loader?lazy&name=AuctionHall!@/pages/desk/auctionHall";
// import BuySceneOffer from "bundle-loader?lazy&name=bidHall!@/pages/desk/hall/offer";
// import SceneJoin from "bundle-loader?lazy&name=sceneJoin!@/pages/desk/sceneJoin";
// import SceneJoinSuccess from "bundle-loader?lazy&name=sceneJoinSuccess!@/pages/desk/sceneJoin/success";

// import personnelAccountAudit from "bundle-loader?lazy&name=personnelAccountAudit!@/pages/personnelAccountAudit";
// import PersonnelAccountAuditEdit from 'bundle-loader?lazy&name=personnelAccountAuditEdit!@/pages/personnelAccountAudit/edit';//人员审核-编辑
// import PersonnelAccountAuditDetails from 'bundle-loader?lazy&name=personnelAccountAuditDetails!@/pages/personnelAccountAudit/details';//人员审核-详情
// /*****消息中心*****/

// import MessageList from 'bundle-loader?lazy&name=messageList!@/pages/message/messageList';//消息列表
// // import Announcement from 'bundle-loader?lazy&name=announcement!@/pages/announcement/Announcement';//消息列表


// import OrderSellerList from 'bundle-loader?lazy&name=messageList!@/pages/order/sellerOrderList';//销售方订单列表
// import OrderBuyerList from 'bundle-loader?lazy&name=messageList!@/pages/order/buyerOrderList';//采购方订单列表

// // 保证金管理详情-集中管理
// import marginDetail from "bundle-loader?lazy&name=marginDetail!@/pages/wk/marginDetail";
// import singleQuotes from "bundle-loader?lazy&name=marginDetail!@/pages/wk/singleQuotes";

// 循环物资
import circulation from "bundle-loader?lazy&name=Home!@/twbureau/pages/index/index";
import goodsList from "bundle-loader?lazy&name=goodsList!@/twbureau/pages/goodsList/index";
import circleList from "bundle-loader?lazy&name=circleList!@/twbureau/pages/circle/index";
import rentList from "bundle-loader?lazy&name=rentList!@/twbureau/pages/rent/index";
import goodsDetail from "bundle-loader?lazy&name=goodsList!@/twbureau/pages/goodsList/detail"
import goodsEdit from "bundle-loader?lazy&name=goodsEdit!@/twbureau/pages/goodsList/edit"

import NoAu from "@/pages/notFound";

import { bundle } from "../components/Bundle";


const Empty = props => <div><Spin />Loading</div>;
const routes = [
    { type: "redirect", exact: true, strict: true, from: "/", to: "/home" },
    { type: "route", path: "/home", component: bundle(Empty, HomeFn, { type: "callback" }) },
    { type: "route", path: "/sellHome", component: bundle(Empty, HomeFn, { type: "callback" }) },
    { type: "route", path: "/buyHome", component: bundle(Empty, HomeFn, { type: "callback" }) },
    { type: "route", path: "/403", component: bundle(Empty, NoPower, { type: "callback" }) },
    { type: "route", path: "/personal", component: bundle(Empty, Personal, { type: "callback" }) },
//     /* 销方 */
//     //竞价销售
//     { type: "route", path: "/sale/scene", component: bundle(Empty, SaleScene, { type: "callback" }) },
//     //竞价场次详情
//     { type: "route", path: "/sale/sceneDetail/:uuids?", component: bundle(Empty, SaleSceneDetail, { type: "callback" }) },
//     //场次详情-查看订单
//     { type: "route", path: "/sale/sceneOrderDetail/:uuids?", component: bundle(Empty, SaleSceneOrderDetail, { type: "callback" }) },
//     //销方保证金管理
//     { type: "route", path: "/sale/bond", component: bundle(Empty, SaleBond, { type: "callback" }) },
//     //采方保证金管理
//     { type: "route", path: "/buy/bond", component: bundle(Empty, BuyBond, { type: "callback" }) },

//     //报价详情
//     { type: "route", path: "/sale/offer/:uuids", component: bundle(Empty, SaleOffer, { type: "callback" }) },
//     //查看报价
//     { type: "route", path: "/sale/offer_detail/:uuids", component: bundle(Empty, SaleOfferDetail, { type: "callback" }) },

//     /* 购方 */
//     //竞价销售
//     { type: "route", path: "/buy/scene", component: bundle(Empty, BuyScene, { type: "callback" }) },
//     //竞价场次详情
//     { type: "route", path: "/buy/sceneDetail/:uuids?", component: bundle(Empty, BuySceneDetail, { type: "callback" }) },
//     //购方订单
//     { type: "route", path: "/buy/order/:uuids?", component: bundle(Empty, BuyOrder, { type: "callback" }) },
//     //保证金管理
//     { type: "route", path: "/buy/sceneBond/:uuids", component: bundle(Empty, BuySceneBond, { type: "callback" }) },
//     //供求信息管理(购方)
//     { type: "route", path: "/supply/buy", component: bundle(Empty, SupplyBuyList, { type: "callback" }) },
//     { type: "route", path: "/supply/buyDetail/:uuids?", component: bundle(Empty, SupplyBuyDetail, { type: "callback" }) },
//     { type: "route", path: "/supply/buyCreateOrder/:uuids?", component: bundle(Empty, SupplyBuyCreateOrder, { type: "callback" }) },
//     { type: "route", path: "/supply/buyOrderDetail/:uuids?", component: bundle(Empty, SupplyBuyCreateOrderDetails, { type: "callback" }) },
//     // 供求信息管理(销方)
//     { type: "route", path: "/supply/sell", component: bundle(Empty, SupplySellList, { type: "callback" }) },
//     { type: "route", path: "/supply/sellDetail/:uuids?", component: bundle(Empty, SupplySellDetail, { type: "callback" }) },
//     { type: "route", path: "/supply/sellCreateOrder/:uuids?", component: bundle(Empty, SupplySellCreateOrder, { type: "callback" }) },
//     { type: "route", path: "/supply/sellOrderDetail/:uuids?", component: bundle(Empty, SupplyBuyCreateOrderDetails, { type: "callback" }) },
//     // 组织管理
//     { type: "route", path: "/organization/auth", component: bundle(Empty, OrganizationAuth, { type: "callback" }) },
//     { type: "route", path: "/organization/authAddAndEdit", component: bundle(Empty, OrganizationAuthAddAndEdit, { type: "callback" }) },
//     { type: "route", path: "/organization/authDefinitely", component: bundle(Empty, OrganizationAuthDef, { type: "callback" }) },
//     { type: "route", path: "/organization/user", component: bundle(Empty, OrganizationUser, { type: "callback" }) },
//     { type: "route", path: "/organization/userAddAndEdit", component: bundle(Empty, OrganizationUserAddAndEdit, { type: "callback" }) },
//     { type: "route", path: "/organization/userDefinitely", component: bundle(Empty, OrganizationUserDetai, { type: "callback" }) },
//     { type: "route", path: "/organization/project", component: bundle(Empty, OrganizationProject, { type: "callback" }) },
//     { type: "route", path: "/organization/EditAndAddProject", component: bundle(Empty, EditAndAddOrganizationProject, { type: "callback" }) },
//     { type: "route", path: "/organization/projectDef", component: bundle(Empty, ProjectOrganizationDetail, { type: "callback" }) },
//     //审批
//     { type: "route", path: "/verify/setUp", component: bundle(Empty, VerifySetUp, { type: "callback" }) },
//     { type: "route", path: "/verify/setUpAdd/:uuids?", component: bundle(Empty, VerifySetUpAdd, { type: "callback" }) },
//     { type: "route", path: "/verify/manage", component: bundle(Empty, VerifyManage, { type: "callback" }) },
//     { type: "route", path: "/verify/manageApproval/:uuids", component: bundle(Empty, VerifyManageApproval, { type: "callback" }) },
//     { type: "route", path: "/verify/order", component: bundle(Empty, VerifyOrder, { type: "callback" }) },
//     { type: "route", path: "/verify/orderApproval/:uuids", component: bundle(Empty, VerifyOrderApproval, { type: "callback" }) },
//     { type: "route", path: "/verify/examine/", component: bundle(Empty, VerifyExamine, { type: "callback" }) },
//     { type: "route", path: "/verify/delVsrify/:uuids/:bidUUIDS", component: bundle(Empty, VerifyExamineDelVsrify, { type: "callback" }) },

//     { type: "route", path: "/organization/personnelAccountAudit/details/:uuids", component: bundle(Empty, PersonnelAccountAuditDetails, { type: "callback" }) },
//     { type: "route", path: "/organization/personnelAccountAudit/edit/:uuids?", component: bundle(Empty, PersonnelAccountAuditEdit, { type: "callback" }) },
//     { type: "route", path: "/organization/personnelAccountAudit", component: bundle(Empty, personnelAccountAudit, { type: "callback" }) },

 
//      // 交易管理
//      { type: "route", path: "/transaction/delivery", component: bundle(Empty, TransactionDelivery, { type: "callback" }) },
//      { type: "route", path: "/transaction/deliverySeller", component: bundle(Empty, TransactionDeliverySeller, { type: "callback" }) },
//      { type: "route", path: "/transaction/trandelDetil", component: bundle(Empty, TransactioDetil, { type: "callback" }) },
//      { type: "route", path: "/transaction/listInput/:uuids", component: bundle(Empty, listInput, { type: "callback" }) },
 
//      // 财务管理
//      { type: "route", path: "/capitalAccoun/account", component: bundle(Empty, CapitalAccoun, { type: "callback" }) },
//      { type: "route", path: "/capitalAccoun/accountDetails/", component: bundle(Empty, AccountDetails, { type: "callback" }) },
//      { type: "route", path: "/capitalAccoun/statementCont", component: bundle(Empty, StatementCont, { type: "callback" }) },
//      { type: "route", path: "/capitalAccoun/statementDetails/", component: bundle(Empty, StatementDetails, { type: "callback" }) },
//      { type: "route", path: "/capitalAccoun/buildDetails/", component: bundle(Empty, BuildDetails, { type: "callback" }) },
     
//      // 竞价管理 保证金管理详情-集中管理
//      { type: "route", path: "/buy/marginDetail/:uuids", component: bundle(Empty, marginDetail, { type: "callback" }) },
//      { type: "route", path: "/singleQuotes", meta: { title: '保证金管理详情-集中管理' }, component: bundle(Empty, singleQuotes, { type: "callback" }) },

//     /****消息中心***/
	
//     { type: "route", path: "/message/messageList", component: bundle(Empty, MessageList, { type: "callback" }) },
//     // { type: "route", path: "/announcement/Announcement", component: bundle(Empty, Announcement, { type: "callback" }) },

//     //订单列表
//     { type: "route", path: "/order/orderSellerList", component: bundle(Empty, OrderSellerList, { type: "callback" }) },

//     { type: "route", path: "/order/orderBuyerList", component: bundle(Empty, OrderBuyerList, { type: "callback" }) },
//     //查看订单
//     { type: "route", path: "/order/orderDetail/:uuids", component: bundle(Empty, SaleOrderDetail, { type: "callback" }) },
//     //确认订单
//     { type: "route", path: "/order/orderConfirm/:uuids", component: bundle(Empty, SaleOrderConfirm, { type: "callback" }) },


//     { type: "route", component: NoAu },

];
const deskRoutes = [
//     //竞价销售(销方)-发布场次
//     { type: "route", path: "/desk/saleScene/add/:uuids?", meta: { title: '循环物资竞价销售' }, component: bundle(Empty, PublishScene, { type: "callback" }) },
//     { type: "route", path: "/desk/saleScene/success", meta: { title: '循环物资竞价销售' }, component: bundle(Empty, PublishSceneSuccess, { type: "callback" }) },
//     //供求信息管理(购方)-供求信息发布/编辑
//     { type: "route", path: "/desk/supply/buy/add/:uuids?", meta: { title: '求购信息发布' }, component: bundle(Empty, PublishSDBuy, { type: "callback" }) },
//     { type: "route", path: "/desk/supply/sellOrBuy/add/:uuids?", meta: { title: '供求信息发布' }, component: bundle(Empty, PublishSDSellOrBuy, { type: "callback" }) },
//     //供求信息管理(销方)-供求信息发布/编辑
//     { type: "route", path: "/desk/supply/sell/add/:uuids?", meta: { title: "供应信息发布" }, component: bundle(Empty, PublishSDSell, { type: "callback" }) },
//     //供求信息管理(购方)-供求信息编辑
//     { type: "route", path: "/desk/supply/buy/edit/:uuids?", meta: { title: '供求信息编辑' }, component: bundle(Empty, PublishSDBuyEdit, { type: "callback" }) },
//     //供求信息管理(销方)-供求信息编辑
//     { type: "route", path: "/desk/supply/sell/edit/:uuids?", meta: { title: "供求信息编辑" }, component: bundle(Empty, PublishSDSellEdit, { type: "callback" }) },
//     //竞价大厅
//     { type: "route", path: "/desk/bidHall/:uuids", meta: { title: '循环物资竞价大厅' }, component: bundle(Empty, BidHall, { type: "callback" }) },
//     //竞价大厅-销方
//     { type: "route", path: "/desk/auctionHall/:uuids", meta: { title: '循环物资竞价大厅' }, component: bundle(Empty, AuctionHall, { type: "callback" }) },
//     //报价详情
//     { type: "route", path: "/desk/sceneOffer/:uuids", meta: { title: '报价详情' }, component: bundle(Empty, BuySceneOffer, { type: "callback" }) },
//     //竞价报名
//     { type: "route", path: "/desk/bidJoin/:uuids", meta: { title: '竞价单详情' }, component: bundle(Empty, SceneJoin, { type: "callback" }) },
//     { type: "route", path: "/desk/bidJoinSuccess/:uuids", meta: { title: '竞价单详情' }, component: bundle(Empty, SceneJoinSuccess, { type: "callback" }) },

    { type: "route", component: NoAu },

];
// lly新增
const twRoutes = [
    { type: "route", path: "/tw/cirHome", component: bundle(Empty, circulation, { type: "callback" }) },
    { type: "route", path: "/tw/goods/list", component: bundle(Empty, goodsList, { type: "callback" }) },
    { type: "route", path: "/tw/circle/list", component: bundle(Empty, circleList, { type: "callback" }) },
    { type: "route", path: "/tw/rent/list", component: bundle(Empty, rentList, { type: "callback" }) },
    { type: "route", path: "/tw/goods/detail", component: bundle(Empty, goodsDetail, { type: "callback" }) },
    { type: "route", path: "/tw/goods/edit", component: bundle(Empty, goodsEdit, { type: "callback" }) },

]
export {
    routes,
    deskRoutes,
    twRoutes
}
