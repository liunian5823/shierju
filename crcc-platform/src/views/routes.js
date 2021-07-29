import { Spin } from "antd";

const Empty = props => <div><Spin />Loading</div>;
import NoAu from "@/pages/notFound";

import HomeFn from "bundle-loader?lazy&name=home!@/pages/home";
/***平台管理后台***/
/*系统管理*/
import Menu from 'bundle-loader?lazy&name=menu!@/pages/sys/menu';//菜单管理
/*组织管理*/
import SubAccount from 'bundle-loader?lazy&name=subAccount!@/pages/orgManagement/subAccount';//子账户管理
import SubAccountDetails from 'bundle-loader?lazy&name=subAccountDetails!@/pages/orgManagement/subAccount/details';//子账户管理-详情
import Role from 'bundle-loader?lazy&name=role!@/pages/orgManagement/role';//角色管理
import RoleEdit from 'bundle-loader?lazy&name=roleEdit!@/pages/orgManagement/role/edit';//角色权限修改
import RoleDetails from 'bundle-loader?lazy&name=roleDetails!@/pages/orgManagement/role/details';//角色权限详情

/*消息中心*/
import MessageList from 'bundle-loader?lazy&name=messageList!@/pages/message/messageList';//消息列表
// 个人中心消息列表
import CenterMessageList from 'bundle-loader?lazy&name=centerMessageList!@/pages/centerMessage/messageList';//消息列表
// 二三类消息
import MessageListNew from 'bundle-loader?lazy&name=messageListNew!@/pages/messageNew/messageList';//消息列表
// 物资循环消息
import MessageListReuse from 'bundle-loader?lazy&name=messageListReuse!@/pages/messageReuse/messageList';//消息列表
// 电子招标消息
import MessageListTender from 'bundle-loader?lazy&name=messageListTender!@/pages/messageTender/messageList';//消息列表
/* 合同管理*/
import signatureManagementList from 'bundle-loader?lazy&name=signatureManagementList!@/pages/contractManagement/signatureManagementList';//平台协议签章管理
import supplySignatureManagementList from 'bundle-loader?lazy&name=supplySignatureManagementList!@/pages/contractManagement/supplySignatureManagementList';//平台补充协议签章管理
/*供应商管理-新加*/
import MaterialsUserManage from 'bundle-loader?lazy&name=materialsUserManage!@/pages/materialsUserManage/supplierManagement';//供应商管理
import MaterialsUserManageAdd from 'bundle-loader?lazy&name=materialsUserManageAdd!@/pages/materialsUserManage/addSupplier';//添加供应商
import MaterialsUserManageDetails from 'bundle-loader?lazy&name=materialsUserManageDetails!@/pages/materialsUserManage/supplierDetails';//供应商详情

/*供应商管理*/
import SupplierManagement from 'bundle-loader?lazy&name=supplierManagement!@/pages/supplierManagement/supplierManagement';//供应商管理
import AddSupplier from 'bundle-loader?lazy&name=addSupplier!@/pages/supplierManagement/addSupplier';//添加供应商
import SupplierDetails from 'bundle-loader?lazy&name=supplierDetails!@/pages/supplierManagement/supplierDetails';//供应商详情

import SupplierEvaluation from 'bundle-loader?lazy&name=supplierEvaluation!@/pages/supplierManagement/supplierEvaluation';//供应商评价
import SupplierBlacklist from 'bundle-loader?lazy&name=supplierBlacklist!@/pages/supplierManagement/supplierBlacklist';//供应商黑名单
import SupplierBlacklistDetails from 'bundle-loader?lazy&name=supplierBlacklistDetails!@/pages/supplierManagement/supplierBlacklistDetails';//供应商黑名单详情

import CorporateBlacklist from 'bundle-loader?lazy&name=corporateBlacklist!@/pages/supplierManagement/corporateBlacklist';//法人黑名单
import CorporateBlacklistDetails from 'bundle-loader?lazy&name=corporateBlacklistDetails!@/pages/supplierManagement/corporateBlacklistDetails';//法人黑名单详情
import ViolationRecordQuery from 'bundle-loader?lazy&name=violationRecordQuery!@/pages/supplierManagement/violationRecordQuery';//违规记录查询
import SupplyImportExcel  from 'bundle-loader?lazy&name=supplyImportExcel!@/pages/supplierManagement/supplyImportExcel';//导入供应商


import supplierBlacklistNew from 'bundle-loader?lazy&name=supplierBlacklist!@/pages/supplierManagement/supplierBlacklistNew';//供应商黑名单
import supplierBlacklistDetailsNew from 'bundle-loader?lazy&name=supplierBlacklistDetails!@/pages/supplierManagement/supplierBlacklistDetailsNew';//供应商黑名单详情


/*采购商管理*/
import Purchaser from 'bundle-loader?lazy&name=purchaser!@/pages/purchaser/purchaser';//采购商管理
import AddPurchaser from 'bundle-loader?lazy&name=addPurchaser!@/pages/purchaser/addPurchaser';//新增采购商
import EditPurchaser from 'bundle-loader?lazy&name=editPurchaser!@/pages/purchaser/editPurchaser';//编辑采购商
import DetailPurchaser from 'bundle-loader?lazy&name=detailPurchaser!@/pages/purchaser/detailPurchaser';//采购商详情
import DetailOrganization from 'bundle-loader?lazy&name=detailOrganization!@/pages/purchaser/detailOrganization';//组织机构详情
/*推荐供应商统计*/
import TwoLevelCompany from 'bundle-loader?lazy&name=twoLevelCompany!@/pages/recommendedSupplierStatistics/twoLevelCompany';//局级列表
import ThreeLevelCompany from 'bundle-loader?lazy&name=threeLevelCompany!@/pages/recommendedSupplierStatistics/threeLevelCompany';//处级列表
import ThreeLevelCompanyUser from 'bundle-loader?lazy&name=threeLevelCompanyUser!@/pages/recommendedSupplierStatistics/threeLevelCompanyUser';//处级下采购商人员列表
import RecommendedSupplier from 'bundle-loader?lazy&name=recommendedSupplier!@/pages/recommendedSupplierStatistics/recommendedSupplier';//供应商名单
/*挂账异常*/
import FinanceHang from 'bundle-loader?lazy&name=financeHang!@/pages/financeHang/financeHang';//挂账异常
import DetailFinanceHang from 'bundle-loader?lazy&name=detailFinanceHang!@/pages/financeHang/detailFinanceHang';//详情
import HandleFinanceHang from 'bundle-loader?lazy&name=handleFinanceHang!@/pages/financeHang/handleFinanceHang';//处理

/*新挂账异常*/
import FinanceHangNew from 'bundle-loader?lazy&name=financeHangNew!@/pages/financeHang/financeHangNew';//挂账异常
import DetailFinanceHangNew from 'bundle-loader?lazy&name=detailFinanceHangNew!@/pages/financeHang/detailFinanceHangNew';//详情
import HandleFinanceHangNew from 'bundle-loader?lazy&name=handleFinanceHangNew!@/pages/financeHang/handleFinanceHangNew';//处理
import Acceptance from 'bundle-loader?lazy&name=acceptance!@/pages/financeHang/acceptance';//受理

/*挂账复核*/
import FinanceReview from 'bundle-loader?lazy&name=financeReview!@/pages/financeReview/financeReview';//列表
import DetailFinanceReview from 'bundle-loader?lazy&name=detailFinanceReview!@/pages/financeReview/detailFinanceReview';//详情
import AuditFinanceReview from 'bundle-loader?lazy&name=auditFinanceReview!@/pages/financeReview/auditFinanceReview';//审核

/*结算单详情*/
import SettlementDetailNew from 'bundle-loader?lazy&name=settlementDetailNew!@/pages/platSettlement/settlementDetailNew/SettlementDetail';
// //结算单查看付款凭证
import SettleVoucher from 'bundle-loader?lazy&name=settlevouchers!@/pages/platSettlement/settlementDetailNew/settlevoucher';
/*采购商结算单详情*/
import PurchaserSettlementDetail from 'bundle-loader?lazy&name=purchaserSettlementDetail!@/pages/platSettlement/purchaserSettlementDetail/SettlementDetail';
/*新采购商结算单详情*/
// import PurchaserSettlementDetailNew from 'bundle-loader?lazy&name=purchaserSettlementDetail!@/pages/platSettlement/purchaserSettlementDetailNew/SettlementDetail';

/*供应商结算单详情*/
import SupplierSettlementDetail from 'bundle-loader?lazy&name=supplierSettlementDetail!@/pages/platSettlement/supplierSettlementDetail/SettlementDetail';
/*新供应商结算单详情*/
// import SupplierSettlementDetailNew from 'bundle-loader?lazy&name=supplierSettlementDetail!@/pages/platSettlement/supplierSettlementDetailNew/SettlementDetail';

/*供应商资质*/
import SupplierAptitudeDetail from 'bundle-loader?lazy&name=supplierAptitudeDetail!@/pages/supplierAptitudeDetail';//供应商资质
/*询价单管理(有详情)*/
import InquiryManagement from 'bundle-loader?lazy&name=inquiryManagement!@/pages/inquiryManagement/inquiryManagement';//询价单管理
import InquiryDetail from 'bundle-loader?lazy&name=inquiryDetail!@/pages/inquiryDetail/inquiryDetail';//询价单详情
import InquiryWithoutDetail from 'bundle-loader?lazy&name=inquiryManagement!@/pages/inquiry/inquiryWithoutDetail';//询价单管理(不带详情)
/*审核管理*/
import AuditAppeal from 'bundle-loader?lazy&name=auditAppeal!@/pages/auditManagement/auditAppeal';//申诉管理
import BasicAudit from 'bundle-loader?lazy&name=basicAudit!@/pages/auditManagement/basicAudit';//基础审核
import AuditSettings from 'bundle-loader?lazy&name=auditSettings!@/pages/auditManagement/auditSettings';//审核设置
import AuditForBasic from 'bundle-loader?lazy&name=auditForBasic!@/pages/auditManagement/auditForBasic';//基础审核页面
import BasicAuditDetails from 'bundle-loader?lazy&name=basicAuditDetails!@/pages/auditManagement/basicAuditDetails';//基础审核详情页面
import BgAuditDetails from 'bundle-loader?lazy&name=bgAuditDetails!@/pages/auditManagement/bgAuditDetails';//背景审核详情页面
import RCBasicAudit from 'bundle-loader?lazy&name=RCBasicAudit!@/pages/auditManagement/RCBasicAudit';//重新认证基础审核
import RCAuditForBasic from 'bundle-loader?lazy&name=RCAuditForBasic!@/pages/auditManagement/RCAuditForBasic';//重新认证基础审核页面
import BackgroundAudit from 'bundle-loader?lazy&name=backgroundAudit!@/pages/auditManagement/backgroundAudit';//背景审核
import AuditForBg from 'bundle-loader?lazy&name=auditForBg!@/pages/auditManagement/auditForBg';//背景审核页面
import RCAuditDetails from 'bundle-loader?lazy&name=RCAuditDetails!@/pages/auditManagement/RCAuditDetails';//重新审核详情页面
import SubPlatformAudit from 'bundle-loader?lazy&name=SubPlatformAudit!@/pages/auditManagement/subPlatformAudit';// 物资循环审核_列表
import SubPlatformDetails from 'bundle-loader?lazy&name=subPlatformDetails!@/pages/auditManagement/subPlatformDetails';// 物资循环审核_详情
import SuppliesPurchase from 'bundle-loader?lazy&name=SuppliesPurchase!@/pages/auditManagement/suppliesPurchase';// 物资采购审核_列表
import SuppliesPurchaseDetails from 'bundle-loader?lazy&name=SuppliesPurchaseDetails!@/pages/auditManagement/suppliesPurchaseDetails';// 物资采购审核_详情
import SuppliesSale from 'bundle-loader?lazy&name=SuppliesSale!@/pages/auditManagement/suppliesSale';// 物资销售审核_列表
import SuppliesSaleDetails from 'bundle-loader?lazy&name=SuppliesSaleDetails!@/pages/auditManagement/suppliesSaleDetails';// 物资销售审核_详情
import OfficeSupplies from 'bundle-loader?lazy&name=OfficeSupplies!@/pages/auditManagement/officeSupplies';// 办公用品审核_列表
import OfficeSuppliesDetails from 'bundle-loader?lazy&name=OfficeSuppliesDetails!@/pages/auditManagement/officeSuppliesDetails';// 办公用品审核_详情
/*认证中心*/
import SupplierCertification from 'bundle-loader?lazy&name=supplierCertification!@/pages/authenticationCenter/supplierCertification';//各局推荐供应商认证
/*账户安全*/
import SafeInfo from 'bundle-loader?lazy&name=supplierCertification!@/pages/account/safeinfo';//各局推荐供应商认证
/*帮助中心*/
import HelpCenter from 'bundle-loader?lazy&name=helpCenter!@/pages/websiteBulletin/helpCenter';
import HelpCenterClassModalForm from 'bundle-loader?lazy&name=websiteBulletin!@/pages/websiteBulletin/helpClassmodalForm.js';// 新增分类
import HelpAddCenter from 'bundle-loader?lazy&name=websiteBulletin!@/pages/websiteBulletin/helpAddCenter.js';// 发布帮助信息


/*网站公告*/
import WebsiteBulletin from 'bundle-loader?lazy&name=websiteBulletin!@/pages/websiteBulletin';
import WebsiteBulletinModalForm from 'bundle-loader?lazy&name=websiteBulletin!@/pages/websiteBulletin/modalForm_1.js';// 发布信息

/*新网站公告*/
import WebsiteBulletinNew from 'bundle-loader?lazy&name=websiteBulletinNew!@/pages/websiteBulletinNew';
import WebsiteBulletinModalFormNew from 'bundle-loader?lazy&name=websiteBulletinNew!@/pages/websiteBulletinNew/modalForm_1.js';// 发布信息
import WebsiteBulletinDraft from 'bundle-loader?lazy&name=websiteBulletinNew!@/pages/websiteBulletinNew/modalForm_1Draft.js';// 发布信息


/*基本设置*/
import BrandManagement from 'bundle-loader?lazy&name=brandManagement!@/pages/basicSetup/brandManagement'; //品牌管理
import AddBrand from 'bundle-loader?lazy&name=addBrand!@/pages/basicSetup/addBrand';//品牌添加编辑
import CommodityClassification from 'bundle-loader?lazy&name=commodityClassification!@/pages/basicSetup/commodityClassification';//商品分类管理
import ContrabandManagement from 'bundle-loader?lazy&name=contrabandManagement!@/pages/basicSetup/contrabandManagement';//违禁词管理
//财务中心
import CapitalAccountManagement from 'bundle-loader?lazy&name=capitalAccountManagement!@/pages/financialCenter/capitalAccountManagement';//资金账户管理
import CapitalAccountDetails from 'bundle-loader?lazy&name=capitalAccountDetails!@/pages/financialCenter/capitalAccountDetails';//资金账户详情
import CapitalAccount from 'bundle-loader?lazy&name=capitalAccount!@/pages/financialCenter/capitalAccount';//资金账户
import PaymentsBalance from 'bundle-loader?lazy&name=paymentsBalance!@/pages/financialCenter/paymentsBalance';//收支明细
import CapitalFlow from 'bundle-loader?lazy&name=capitalFlow!@/pages/financialCenter/capitalFlow';//新收支明细
import FundsAccount from 'bundle-loader?lazy&name=fundsAccount!@/pages/financialCenter/fundsAccount';//新收支明细

import ContractTemplate from 'bundle-loader?lazy&name=contractTemplate!@/pages/contract/contractTemplate';//入驻合同模板管理
import AddContractTemplate from 'bundle-loader?lazy&name=addContractTemplate!@/pages/contract/addContractTemplate';//入驻合同模板管理
import SupplyContractTemplate from 'bundle-loader?lazy&name=supplyContractTemplate!@/pages/contract/supplyContractTemplate';//入驻合同补充模板管理
import AddSupplyContractTemplate from 'bundle-loader?lazy&name=addSupplyContractTemplate!@/pages/contract/addSupplyContractTemplate';//入驻合同补充模板管理
//统计分析  echarts
import HandleEcharts from 'bundle-loader?lazy&name=handleEcharts!@/pages/authenticationCenter/handleEcharts'//供应商用户统计
import GoodsClassify from 'bundle-loader?lazy&name=goodsClassify!@/pages/authenticationCenter/goodsClassify'//商城类目分布
import PurchasingOrderCounts from 'bundle-loader?lazy&name=purchasingOrderCounts!@/pages/authenticationCenter/purchasingOrderCounts'//采购单位订单统计
import PurchasingInquiryCounts from 'bundle-loader?lazy&name=purchasingInquiryCounts!@/pages/authenticationCenter/purchasingInquiryCounts'//采购单位询价统计
import SupplierSpread from 'bundle-loader?lazy&name=supplierSpread!@/pages/authenticationCenter/supplierSpread'//供应商分布统计
import CountsAndSpread from 'bundle-loader?lazy&name=countsAndSpread!@/pages/authenticationCenter/countsAndSpread'//商城点击量及分布
// import OrderContract from 'bundle-loader?lazy&name=OrderContract!@/pages/authenticationCenter/orderContract'//订单合同
/**交易管理 */
import AbnormalRecordAccount from 'bundle-loader?lazy&name=abnormalRecordAccount!@/pages/transactionManagement/abnormalRecordAccount';//挂账异常记录
import Handle from 'bundle-loader?lazy&name=handle!@/pages/transactionManagement/handle';//处理
import Details from 'bundle-loader?lazy&name=details!@/pages/transactionManagement/details';//详情
/* 招标公告 中标公告 */
import WinningAnnouncement from 'bundle-loader?lazy&name=winningAnnouncement!@/pages/tenderNotice/winningAnnouncement';
/* 招标公告 招标订单管理 */
import BidOrderList from 'bundle-loader?lazy&name=bidOrderList!@/pages/tenderNotice/bidOrderList';
/***发票管理****/
import PlatInvoice from 'bundle-loader?lazy&name=platInvoice!@/pages/platInvoice/invoiceList';
/***结算单管理****/
import PlatSettlementList from 'bundle-loader?lazy&name=platSettlementList!@/pages/platSettlement/platSettlementList';
/***新结算单管理****/
import PlatSettlementListNew from 'bundle-loader?lazy&name=platSettlementList!@/pages/platSettlement/platSettlementListNew';
/***广告位推荐采购清单管理****/
import PurchaseListAddition from 'bundle-loader?lazy&name=purchaseListAddition!@/pages/purchaser/purchaseListAddition';//各局采购清单
/***广告位合作采购单位清单管理****/
import CooperatorsListAddition from 'bundle-loader?lazy&name=purchaseListAddition!@/pages/purchaser/cooperatorsListAddition';//各局合作采购单位清单

/***商品管理--商品审核***/
import CommodityAudit from 'bundle-loader?lazy&name=commodityAudit!@/pages/goodsManagement/commodityAudit';
import CGAudit from 'bundle-loader?lazy&name=cGAudit!@/pages/goodsManagement/commodityAudit/audit';
/***商品管理--商品管理***/
import Goods from 'bundle-loader?lazy&name=goods!@/pages/goodsManagement/goods';
import GoodsDetails from 'bundle-loader?lazy&name=goodsDetails!@/pages/goodsManagement/goods/details';
/***类型管理--商品管理***/
import GoodsType from 'bundle-loader?lazy&name=goodsType!@/pages/goodsManagement/goodsType';
import GoodsTypeDetails from 'bundle-loader?lazy&name=goodsDetails!@/pages/goodsManagement/goodsType/details';
/***属性管理--商品管理***/
import GoodsAttribute from 'bundle-loader?lazy&name=goodsAttribute!@/pages/goodsManagement/goodsAttribute';
import GoodsAttributeDetails from 'bundle-loader?lazy&name=goodsAttributeDetails!@/pages/goodsManagement/goodsAttribute/details';
/* 待办查询 */
import QueryBackLogByName from 'bundle-loader?lazy&name=queryBackLogByName!@/pages/ecUserApprovalLog/queryBackLogByName';
import QueryBackLogByNameBasic from 'bundle-loader?lazy&name=queryBackLogByNameBasic!@/pages/ecUserApprovalLog/queryBackLogByNameBasic';
import QueryBackLogByNameBasics from 'bundle-loader?lazy&name=queryBackLogByNameBasics!@/pages/ecUserApprovalLog/queryBackLogByNameBasics';
import QueryBackLogByNameBasicss from 'bundle-loader?lazy&name=queryBackLogByNameBasicss!@/pages/ecUserApprovalLog/queryBackLogByNameBasicss';
import QueryBackLogByNameDetails from 'bundle-loader?lazy&name=queryBackLogByNameDetails!@/pages/ecUserApprovalLog/queryBackLogByNameDetails';
import ThirdGoodsStatistics from 'bundle-loader?lazy&name=thirdGoodsStatistics!@/pages/officeGoodsStatistics/thirdGoodsStatistics';
/**门户管理**/
//待审核
import StoreAudit from 'bundle-loader?lazy&name=storeAudit!@/pages/auditManagement/storeAudit';
import storeAuditInfo from 'bundle-loader?lazy&name=audit!@/pages/auditManagement/storeAudit/audit';

import GetList from 'bundle-loader?lazy&name=getList!@/pages/ecScheduled/getList';
// 搜索设置
import GoodsSearchSet from 'bundle-loader?lazy&name=goodsSearchSet!@/pages/searchSet/goodsSet';
import StoreSearchSet from 'bundle-loader?lazy&name=storeSearchSet!@/pages/searchSet/storeSet';
//供应商名录
import SupplierYellow from  'bundle-loader?lazy&name=supplierYellow!@/pages/searchSet/supplier';

// /* 异常订单处理 */
import QueryAllPage from 'bundle-loader?lazy&name=queryAllPage!@/pages/ecOrderClose/queryAllPage';
import QueryAcceptanceModal from 'bundle-loader?lazy&name=audit!@/pages/ecOrderClose/queryAcceptanceModal';//受理
import QueryCheckModal from 'bundle-loader?lazy&name=audit!@/pages/ecOrderClose/queryCheckModal';//处理
import QuerySeeModal from 'bundle-loader?lazy&name=audit!@/pages/ecOrderClose/querySeeModal';//查看信息
/***投诉建议信息中心***/
//投诉建议信息中心
import ComplaintsList from 'bundle-loader?lazy&name=complaintsList!@/pages/complaintsInfoCenter/complaintsList';
//投诉建议信息中心/收藏夹
import FavoriteList from 'bundle-loader?lazy&name=complaintsList!@/pages/complaintsInfoCenter/favoriteList';

/***开发用****/
// import Tables from 'bundle-loader?lazy&name=supplierCertification!@/pages/_dev';//各局推荐供应商认证


import OrderManagement from 'bundle-loader?lazy&name=orderManagement!@/pages/orderManagement/orderManagement';//订单管理
import OrderDetail from 'bundle-loader?lazy&name=orderDetail!@/pages/orderDetail/orderDetail';//订单详情

import OrderDetailNew from 'bundle-loader?lazy&name=orderDetailNew!@/pages/orderDetail/orderDetailNew';//新订单详情

/*频道管理*/
import StorePlatform from 'bundle-loader?lazy&name=storePlatform!@/pages/pageChannel/storePlatform';//商家平台
import CrccIndex from 'bundle-loader?lazy&name=crccIndex!@/pages/pageChannel/crccIndex';//首页设置
import InqueryBanner from 'bundle-loader?lazy&name=crccIndex!@/pages/pageChannel/inqueryBanner';//询价采购轮播图片
//京东商品专用
import JDGoodsMenu from 'bundle-loader?lazy&name=jDGoodsMenu!@/pages/jDGoodsMenu';
//招投标同步账户菜单
import BiddingMenu from 'bundle-loader?lazy&name=biddingMenu!@/pages/biddingMenu';

/*统计分析--年末统计*/
import YearStatistic from 'bundle-loader?lazy&name=yearStatistic!@/pages/statistic/yearStatistic';//平台采购规模统计
import YearJZLStatistic from 'bundle-loader?lazy&name=yearJZLStatistic!@/pages/statistic/yearJZLStatistic';//节资率统计
import YearOrderCountStatistic from 'bundle-loader?lazy&name=yearOrderCountStatistic!@/pages/statistic/yearOrderCountStatistic';//成交订单数量局级统计

import YearStatisticByJu from 'bundle-loader?lazy&name=yearStatisticByJu!@/pages/statistic/yearStatisticByJu';//局级平台采购规模统计
import YearJZLStatisticByJu from 'bundle-loader?lazy&name=yearJZLStatisticByJu!@/pages/statistic/yearJZLStatisticByJu';//局级节资率统计
import YearMarriedStatisticByJu from 'bundle-loader?lazy&name=yearMarriedStatisticByJu!@/pages/statistic/yearMarriedStatisticByJu';//局级撮合交易统计

import YearInquiryCountStatistic from 'bundle-loader?lazy&name=yearInquiryCountStatistic!@/pages/statistic/yearInquiryCountStatistic';//询价单数量局级统计
import YearMarriedStatistic from 'bundle-loader?lazy&name=yearMarriedStatistic!@/pages/statistic/yearMarriedStatistic';//撮合交易统计
import QuotationOrderTransaction from 'bundle-loader?lazy&name=quotationOrderTransaction!@/pages/statistic/quotationOrderTransaction';//询报价订单交易统计
import InquiryAndQuotation from 'bundle-loader?lazy&name=inquiryAndQuotation!@/pages/statistic/inquiryAndQuotation';//询报价业务交易总金额统计
import PaymentAmount from 'bundle-loader?lazy&name=paymentAmount!@/pages/statistic/paymentAmount';//支付金额统计
import AmountOfArrears from 'bundle-loader?lazy&name=amountOfArrears!@/pages/statistic/amountOfArrears';//欠款金额统计
import PurchasedItems from 'bundle-loader?lazy&name=purchasedItems!@/pages/statistic/purchasedItems';//采购项目部数量统计
import PurchaseAccount from 'bundle-loader?lazy&name=purchaseAccount!@/pages/statistic/purchaseAccount';//采购账号数量统计
import SupplierRegistration from 'bundle-loader?lazy&name=supplierRegistration!@/pages/statistic/supplierRegistration';//供应商注册数量统计
import SupplierCertificationTotal from 'bundle-loader?lazy&name=supplierCertificationTotal!@/pages/statistic/supplierCertificationTotal';//供应商认证数量统计
import QuotationOrderTransactionChu from 'bundle-loader?lazy&name=quotationOrderTransaction!@/pages/statistic/quotationOrderTransactionChu';//询报价订单交易统计（处级）
import InquiryAndQuotationChu from 'bundle-loader?lazy&name=inquiryAndQuotation!@/pages/statistic/inquiryAndQuotationChu';//询报价业务交易总金额统计(处级)
import YearOrderCountStatisticByChu from 'bundle-loader?lazy&name=yearOrderCountStatisticByChu!@/pages/statistic/yearOrderCountStatisticByChu';//处级成交订单数量局级统计
import YearInquiryCountStatisticByChu from 'bundle-loader?lazy&name=yearInquiryCountStatisticByChu!@/pages/statistic/yearInquiryCountStatisticByChu';//处级询价单数量局级统计

//-基本信息、法律诉讼、经营风险、经营状况
import BasicInfomation from "bundle-loader?lazy&name=basicInfomation!@/pages/busunessQualification/basicInfomation";
import LawLitigation from "bundle-loader?lazy&name=lawLitigation!@/pages/busunessQualification/lawLitigation";
import ManagementRisk from "bundle-loader?lazy&name=managementRisk!@/pages/busunessQualification/managementRisk";
import ManagementState from "bundle-loader?lazy&name=managementState!@/pages/busunessQualification/managementState";

//电子招标-- 招标公告
/* 招标公告 中标公告 */
import WinningAnnouncement1 from 'bundle-loader?lazy&name=winningAnnouncement!@/pages/bidNotice/winningAnnouncement';
/* 招标公告 招标订单管理 */
import BidOrderList1 from 'bundle-loader?lazy&name=bidOrderList!@/pages/bidNotice/bidOrderList';
/* 招标公告 发布 */
import reportBid from 'bundle-loader?lazy&name=reportBid!@/pages/bidNotice/reportBid';

/*
* 高达临时测试
*/
//-部门
import Department from 'bundle-loader?lazy&name=department!@/pages/gaoda/department';
//-职员
import DepartmentStaff from 'bundle-loader?lazy&name=departmentStaff!@/pages/gaoda/staff';
//-角色
import DepartmentRole from 'bundle-loader?lazy&name=departmentRole!@/pages/gaoda/role';


import { bundle } from "../components/Bundle";
import contractTemplate from "@/pages/contract/contractTemplate";

//运营平台交易管理
import BidListFn from 'bundle-loader?lazy&name=department!@/pages/contend/bidList/index.js';
import RegListFn from 'bundle-loader?lazy&name=department!@/pages/contend/regList/index.js';
import RegDetailFn from 'bundle-loader?lazy&name=department!@/pages/contend/regDetail/index.js';
import BidDetail from 'bundle-loader?lazy&name=department!@/pages/contend/bidDetail/index.js';//竞价单详情
// 循环物资
import SupplyLook from 'bundle-loader?lazy&name=SupplyLook!@/pages/reuse/supplyLook';
import SupplyApproval from 'bundle-loader?lazy&name=SupplyApproval!@/pages/reuse/supplyApproval';
import SupplyDetails from 'bundle-loader?lazy&name=supplDetails!@/pages/reuse/supplDetails';
import ReuseOrderInquiry from 'bundle-loader?lazy&name=ReuseOrderInquiry!@/pages/reuse/orderInquiry';
import ReuseOrderInquiryDetails from 'bundle-loader?lazy&name=ReuseOrderInquiryDetails!@/pages/reuse/orderDetails';
import ReuseChannelManagement from 'bundle-loader?lazy&name=ReuseChannelManagement!@/pages/reuse/channelManagement';
import ReuseBidManagement from 'bundle-loader?lazy&name=ReuseBidManagement!@/pages/reuse/bidManagement';
import ReuseBidManagementDetails from 'bundle-loader?lazy&name=BidManagementDetails!@/pages/reuse/bidDetail';

//商品分类修改
import UpdateGoodsClass from 'bundle-loader?lazy&name=updateGoodsClass!@/pages/goodsClass/updateGoodsClass';


// 客服中心
import CustomerMargin from "bundle-loader?lazy&name=customerMargin!@/pages/customer/margin";
import CustomerDel from "bundle-loader?lazy&name=CustomerDel!@/pages/customer/del";

//不明来款清分
// import AccountClear from "bundle-loader?lazy&name=AccountClear!@/pages/capitalAccoun/accountClear";
// import AccountclearDetail from "bundle-loader?lazy&name=AccountclearDetail!@/pages/capitalAccoun/AccountclearDetail";//详情

//不明来款清分-复核
// import AccountReview from "bundle-loader?lazy&name=AccountReview!@/pages/capitalAccoun/accountReview";

//挂账清分列表
import XhFinanceHang from "bundle-loader?lazy&name=XhFinanceHang!@/pages/xhFinanceHang/clearing";
//挂账清分详情页面
import XhFinanceHangDetail from "bundle-loader?lazy&name=xhFinanceHangDetail!@/pages/xhFinanceHang/clearing/detail";

//挂账清分复核列表
import XHFinanceApprovalHangList from "bundle-loader?lazy&name=XHFinanceApprovalHangList!@/pages/xhFinanceHang/approval";
//挂账清分复核审核页面
import XHFinanceApprovalHangDetail from "bundle-loader?lazy&name=XHFinanceApprovalHangDetail!@/pages/xhFinanceHang/approval/detail";

//供应商直采审核列表
import fristHandApprovalList from "bundle-loader?lazy&name=XHFinanceApprovalHangDetail!@/pages/fristHandApproval/list";

//直采专区栏位
import FirsthandDpBoothGoodsList from "bundle-loader?lazy&name=FirsthandDpBoothGoodsList!@/pages/firsthand/boothGoods";
//合同关联商品列表
import ContractGoodsList from "bundle-loader?lazy&name=FirsthandDpBoothGoodsList!@/pages/firsthand/contractGoods";
import ContractApprovalDetail from "bundle-loader?lazy&name=contractApprovalDetail!@/pages/firsthand/detail";
import FirsthandContractRelease from "bundle-loader?lazy&name=firsthandContractRelease!@/pages/firsthand/firsthandContractRelease";
import FirsthandContractList from "bundle-loader?lazy&name=firsthandContractRelease!@/pages/firsthand/firsthandContractList";
import ContractDetail from "bundle-loader?lazy&name=contractDetail!@/pages/firsthand/contractDetail";

/***
 * 1.路由需要填入类型，地址，组件，
 * 2.如果该地址有子地址，需要增加进行精准匹配： exact:true
 *
 * ***/
const routes = [
	{ type: "redirect", exact: true, strict: true, from: "/", to: "/home" },
	// 循环物资
	{ type: "route", path: "/reuse/supplyLook", component: bundle(Empty, SupplyLook, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/supplyLook/details/:uuids", component: bundle(Empty, SupplyDetails, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/supplyApproval", component: bundle(Empty, SupplyApproval, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/supplyApproval/details/:uuids", component: bundle(Empty, SupplyDetails, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/supplyApproval/audit/:uuids", component: bundle(Empty, SupplyDetails, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/orderInquiry", component: bundle(Empty, ReuseOrderInquiry, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/orderInquiry/details/:uuids", component: bundle(Empty, ReuseOrderInquiryDetails, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/bidManagement", component: bundle(Empty, ReuseBidManagement, { type: "callback" }), exact: true },
    { type: "route", path: "/reuse/bidManagement/details/:uuids", component: bundle(Empty, ReuseBidManagementDetails, { type: "callback" }), exact: true },
	{ type: "route", path: "/reuse/channelManagement", component: bundle(Empty, ReuseChannelManagement, { type: "callback" }), exact: true },
	/*竞价管理 */
	{ type: "route", path: "/platInvoice/bidlist/bidDetail/:uuids", component: bundle(Empty, BidDetail, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/reglist/regdetailView/:type/:uuids/:contendUuids", component: bundle(Empty, RegDetailFn, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/reglist/regdetailAcceptance/:type/:uuids/:contendUuids", component: bundle(Empty, RegDetailFn, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/reglist/regdetailHandle/:type/:uuids/:contendUuids", component: bundle(Empty, RegDetailFn, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/bidlist", component: bundle(Empty, BidListFn, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/reglist", component: bundle(Empty, RegListFn, { type: "callback" }) },

	{ type: "route", path: "/home", component: bundle(Empty, HomeFn, { type: "callback" }) },
	{ type: "route", path: "/message/messageList", component: bundle(Empty, MessageList, { type: "callback" }) },
	// 二三类消息
	{ type: "route", path: "/messageNew/messageList", component: bundle(Empty, MessageListNew, { type: "callback" }) },
	// 物资循环消息
	{ type: "route", path: "/messageReuse/messageList", component: bundle(Empty, MessageListReuse, { type: "callback" }) },
	// 电子招标消息
	{ type: "route", path: "/messageTender/messageList", component: bundle(Empty, MessageListTender, { type: "callback" }) },
	// 个人中心消息列表
	{ type: "route", path: "/message/centerMessageList", component: bundle(Empty, CenterMessageList, { type: "callback" }) },
    { type: "route", path: "/contract/signatureManagementList", component: bundle(Empty, signatureManagementList, { type: "callback" }) },/*平台协议签章管理*/
    { type: "route", path: "/contract/supplySignatureManagementList", component: bundle(Empty, supplySignatureManagementList, { type: "callback" }) },/*平台补充协议签章管理*/
	/***平台管理后台***/
	/*系统管理*/
	{ type: "route", path: "/sys/menu", component: bundle(Empty, Menu, { type: "callback" }) },
	/*组织管理*/
	{ type: "route", path: "/orgManagement/subAccount", component: bundle(Empty, SubAccount, { type: "callback" }), exact: true },
	{ type: "route", path: "/orgManagement/subAccount/details/:uuids?/:managerFlag?", component: bundle(Empty, SubAccountDetails, { type: "callback" }) },
	{ type: "route", path: "/orgManagement/role", component: bundle(Empty, Role, { type: "callback" }), exact: true },
	{ type: "route", path: "/orgManagement/role/edit/:uuids?/:id?", component: bundle(Empty, RoleEdit, { type: "callback" }) },
	{ type: "route", path: "/orgManagement/role/details/:uuids/:id", component: bundle(Empty, RoleDetails, { type: "callback" }) },

	/* 供应商管理-新加的 */
	{ type: "route", path: "/materialsUser/materialsUserManage", component: bundle(Empty, MaterialsUserManage, { type: "callback" }), exact: true },
	{ type: "route", path: "/materialsUser/materialsUserManage/add", component: bundle(Empty, MaterialsUserManageAdd, { type: "callback" }) },
	{ type: "route", path: "/materialsUser/materialsUserManage/details/:id", component: bundle(Empty, SupplierDetails, { type: "callback" }) },
	/* 供应商管理 */
	{ type: "route", path: "/supplierManagement/supplierManagement", component: bundle(Empty, SupplierManagement, { type: "callback" }), exact: true },
	{ type: "route", path: "/supplierManagement/supplierManagement/add", component: bundle(Empty, AddSupplier, { type: "callback" }) },
	{ type: "route", path: "/supplierManagement/supplierManagement/details/:id", component: bundle(Empty, MaterialsUserManageDetails, { type: "callback" }) },

	{ type: "route", path: "/supplierManagement/supplierEvaluation", component: bundle(Empty, SupplierEvaluation, { type: "callback" }) },
	{ type: "route", path: "/supplierManagement/supplierBlacklist", component: bundle(Empty, SupplierBlacklist, { type: "callback" }), exact: true },
	{ type: "route", path: "/supplierManagement/supplierBlacklist/details/:uuids", component: bundle(Empty, SupplierBlacklistDetails, { type: "callback" }) },

	{ type: "route", path: "/supplierManagement/corporateBlacklist", component: bundle(Empty, CorporateBlacklist, { type: "callback" }), exact: true },
	{ type: "route", path: "/supplierManagement/corporateBlacklist/details/:uuids", component: bundle(Empty, CorporateBlacklistDetails, { type: "callback" }) },
	{ type: "route", path: "/supplierManagement/vrq", component: bundle(Empty, ViolationRecordQuery, { type: "callback" }) },
	{ type: "route", path: "/ecUserApprovalLog/queryBackLogByName", component: bundle(Empty, QueryBackLogByName, { type: "callback" }), exact: true },//客服中心，代办查询
	{ type: "route", path: "/officeGoodsStatistics", component: bundle(Empty, ThirdGoodsStatistics, { type: "callback" }), exact: true }, //办公用品导入统计 周宝
	{ type: "route", path: "/ecUserApprovalLog/queryBackLogByName/audit/:uuids", component: bundle(Empty, QueryBackLogByNameBasic, { type: "callback" }) },
	{ type: "route", path: "/ecUserApprovalLog/queryBackLogByName/audits/:uuids", component: bundle(Empty, QueryBackLogByNameBasics, { type: "callback" }) },
	{ type: "route", path: "/ecUserApprovalLog/queryBackLogByName/auditss/:uuids", component: bundle(Empty, QueryBackLogByNameBasicss, { type: "callback" }) },
	{ type: "route", path: "/ecUserApprovalLog/queryBackLogByName/details/:id", component: bundle(Empty, QueryBackLogByNameDetails, { type: "callback" }) },
	{ type: "route", path: "/supplierManagement/supplyImportExcel", component: bundle(Empty, SupplyImportExcel, { type: "callback" }) },
	/* 黑名单 */
	{ type: "route", path: "/supplierManagement/supplierBlacklistNew", component: bundle(Empty, supplierBlacklistNew, { type: "callback" }), exact: true },
	{ type: "route", path: "/supplierManagement/supplierBlacklistNew/details/:uuids", component: bundle(Empty, supplierBlacklistDetailsNew, { type: "callback" }) },


	/* 采购商管理 */
	{ type: "route", path: "/purchaser/purchaser", component: bundle(Empty, Purchaser, { type: "callback" }) },
	{ type: "route", path: "/purchaser/addPurchaser", component: bundle(Empty, AddPurchaser, { type: "callback" }) },
	{ type: "route", path: "/purchaser/editPurchaser/:uuids", component: bundle(Empty, EditPurchaser, { type: "callback" }) },
	{ type: "route", path: "/purchaser/detailPurchaser/:uuids/:companyId", component: bundle(Empty, DetailPurchaser, { type: "callback" }) },
	{ type: "route", path: "/purchaser/detailOrganization/:uuids", component: bundle(Empty, DetailOrganization, { type: "callback" }) },
	/* 推荐供应商统计 */
    { type: "route", path: "/purchaser/twoLevelCompany", component: bundle(Empty, TwoLevelCompany, { type: "callback" })},
    { type: "route", path: "/purchaser/threeLevelCompany", component: bundle(Empty, ThreeLevelCompany, { type: "callback" })},
    { type: "route", path: "/purchaser/threeLevelCompanyUser", component: bundle(Empty, ThreeLevelCompanyUser, { type: "callback" })},
    { type: "route", path: "/purchaser/recommendedSupplier", component: bundle(Empty, RecommendedSupplier, { type: "callback" })},
	/*挂账异常记录*/
    { type: "route", path: "/financialCenter/financeHang", component: bundle(Empty, FinanceHang, { type: "callback" })},
    { type: "route", path: "/financialCenter/detailFinanceHang", component: bundle(Empty, DetailFinanceHang, { type: "callback" })},
	{ type: "route", path: "/financialCenter/handleFinanceHang", component: bundle(Empty, HandleFinanceHang, { type: "callback" })},
	/*新挂账异常记录*/
    { type: "route", path: "/financialCenter/financeHangNew", component: bundle(Empty, FinanceHangNew, { type: "callback" })},
    { type: "route", path: "/financialCenter/detailFinanceHangNew/:workOrdersId/:id", component: bundle(Empty, DetailFinanceHangNew, { type: "callback" })},
    { type: "route", path: "/financialCenter/handleFinanceHangNew/:workOrdersId/:id", component: bundle(Empty, HandleFinanceHangNew, { type: "callback" })},
    { type: "route", path: "/financialCenter/acceptance/:workOrdersId/:id", component: bundle(Empty, Acceptance, { type: "callback" })},
	
	/*挂账复核记录*/
    { type: "route", path: "/financialCenter/financeReview", component: bundle(Empty, FinanceReview, { type: "callback" })},
    // { type: "route", path: "/financialCenter/detailFinanceReview/:workOrdersId", component: bundle(Empty, DetailFinanceReview, { type: "callback" })},
    { type: "route", path: "/financialCenter/detailFinanceReview", component: bundle(Empty, DetailFinanceReview, { type: "callback" })},
    { type: "route", path: "/financialCenter/auditFinanceReview", component: bundle(Empty, AuditFinanceReview, { type: "callback" })},

	/* 新结算单详情 */
	{ type: "route", path: "/financialCenter/platSettlementListNew/settlementDetailNew/:id/:uuids", component: bundle(Empty, SettlementDetailNew, { type: "callback" })},
	{ type: "route", path: "/financialManagement/settlevoucher", component: bundle(Empty, SettleVoucher, { type: "callback" })},
	// <Route path="/financialManagement/settlevoucher" component={createComponent(SettleVoucher)}></Route>
	/* 采购商结算单详情 */
	{ type: "route", path: "/financialCenter/purchaserSettlementDetail/:uuids", component: bundle(Empty, PurchaserSettlementDetail, { type: "callback" })},
	/* 新采购商结算单详情 */
    // { type: "route", path: "/financialCenter/purchaserSettlementDetailNew/:uuids", component: bundle(Empty, PurchaserSettlementDetailNew, { type: "callback" })},

	/* 供应商结算单详情 */
	{ type: "route", path: "/financialCenter/supplierSettlementDetail/:uuids", component: bundle(Empty, SupplierSettlementDetail, { type: "callback" })},
	/* 新供应商结算单详情 */
    // { type: "route", path: "/financialCenter/supplierSettlementDetailNew/:uuids", component: bundle(Empty, SupplierSettlementDetailNew, { type: "callback" })},

	/*供应商资质*/
    { type: "route", path: "/supplier/recommendedSupplier", component: bundle(Empty, SupplierAptitudeDetail, { type: "callback" })},
    //询价单管理
    { type: "route", path: "/platInvoice/inquiryManagement", component: bundle(Empty, InquiryManagement, { type: "callback" }) },
    { type: "route", path: "/platInvoice/inquiryDetail/:uuids", component: bundle(Empty, InquiryDetail, { type: "callback" }) },
    { type: "route", path: "/inquiry/inquiryWithoutDetail", component: bundle(Empty, InquiryWithoutDetail, { type: "callback" }) },
	/* 审核管理 */
	{ type: "route", path: "/auditManagement/auditAppeal", component: bundle(Empty, AuditAppeal, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/basicAudit", component: bundle(Empty, BasicAudit, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/basicAudit/audit/:uuids", component: bundle(Empty, AuditForBasic, { type: "callback" }) },
	{ type: "route", path: "/auditManagement/basicAudit/details/:id/:state", component: bundle(Empty, BasicAuditDetails, { type: "callback" }) },
	{ type: "route", path: "/auditManagement/backgroundAudit", component: bundle(Empty, BackgroundAudit, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/backgroundAudit/audit/:cuuids/:wuuids", component: bundle(Empty, AuditForBg, { type: "callback" }) },
	{ type: "route", path: "/auditManagement/backgroundAudit/details/:id", component: bundle(Empty, BgAuditDetails, { type: "callback" }) },
	{ type: "route", path: "/auditManagement/RCBasicAudit", component: bundle(Empty, RCBasicAudit, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/RCBasicAudit/audit/:uuids", component: bundle(Empty, RCAuditForBasic, { type: "callback" }) },
	{ type: "route", path: "/auditManagement/RCBasicAudit/details/:uuids", component: bundle(Empty, RCAuditDetails, { type: "callback" }) },
	{ type: "route", path: "/auditManagement/auditSettings", component: bundle(Empty, AuditSettings, { type: "callback" }) },
	{ type: "route", path: "/auditManagement/subPlatformAudit", component: bundle(Empty, SubPlatformAudit, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/subPlatformAudit/audit/:types/:appuuids/:companyId", component: bundle(Empty, SubPlatformDetails, { type: "callback" })},
	{ type: "route", path: "/auditManagement/suppliesPurchase", component: bundle(Empty, SuppliesPurchase, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/suppliesPurchase/audit/:types/:appuuids/:companyId", component: bundle(Empty, SuppliesPurchaseDetails, { type: "callback" })},
	{ type: "route", path: "/auditManagement/suppliesSale", component: bundle(Empty, SuppliesSale, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/suppliesSale/audit/:types/:appuuids/:companyId", component: bundle(Empty, SuppliesSaleDetails, { type: "callback" })},
	{ type: "route", path: "/auditManagement/officeSupplies", component: bundle(Empty, OfficeSupplies, { type: "callback" }), exact: true },
	{ type: "route", path: "/auditManagement/officeSupplies/audit/:types/:appuuids/:companyId", component: bundle(Empty, OfficeSuppliesDetails, { type: "callback" })},

	/* 统计分析 echarts */
	{ type: "route", path: "/authenticationCenter/HandleEcharts", component: bundle(Empty, HandleEcharts, { type: "callback" }), exact: true },
	{ type: "route", path: "/authenticationCenter/GoodsClassify", component: bundle(Empty, GoodsClassify, { type: "callback" }), exact: true },
	{ type: "route", path: "/authenticationCenter/PurchasingOrderCounts", component: bundle(Empty, PurchasingOrderCounts, { type: "callback" }), exact: true },
	{ type: "route", path: "/authenticationCenter/PurchasingInquiryCounts", component: bundle(Empty, PurchasingInquiryCounts, { type: "callback" }), exact: true },
	{ type: "route", path: "/authenticationCenter/SupplierSpread", component: bundle(Empty, SupplierSpread, { type: "callback" }), exact: true },
	{ type: "route", path: "/authenticationCenter/CountsAndSpread", component: bundle(Empty, CountsAndSpread, { type: "callback" }), exact: true },
	// { type: "route", path: "/authenticationCenter/OrderContract", component: bundle(Empty, OrderContract, { type: "callback" }), exact: true },

	// /* 定时任务 */
	{ type: "route", path: "/ecScheduled/GetList", component: bundle(Empty, GetList, { type: "callback" }), exact: true },

	/* 搜索设置 */

	{ type: "route", path: "/sys/goodsSearchSet", component: bundle(Empty, GoodsSearchSet, { type: "callback" }), exact: true },
	{ type: "route", path: "/sys/storeSearchSet", component: bundle(Empty, StoreSearchSet, { type: "callback" }), exact: true },

	/* 异常订单处理 */
	{ type: "route", path: "/ecUserApprovalLog/QueryAllPage", component: bundle(Empty, QueryAllPage, { type: "callback" }), exact: true },
	{ type: "route", path: "/ecUserApprovalLog/QueryAcceptanceModal/audit/:id", component: bundle(Empty, QueryAcceptanceModal, { type: "callback" }) },
	{ type: "route", path: "/ecUserApprovalLog/QueryCheckModal/audit/:id", component: bundle(Empty, QueryCheckModal, { type: "callback" }) },
	{ type: "route", path: "/ecUserApprovalLog/QuerySeeModal/audit/:id", component: bundle(Empty, QuerySeeModal, { type: "callback" }) },

	/* 认证中心 */
	{ type: "route", path: "/authenticationCenter/supplierCertification", component: bundle(Empty, SupplierCertification, { type: "callback" }) },

	/* 账户安全 */
	{ type: "route", path: "/account/safeinfo", component: bundle(Empty, SafeInfo, { type: "callback" }) },

    { type: "route", path: '/financialCenter/capitalFlow', component: bundle(Empty, CapitalFlow, { type: "callback" }) },
    { type: "route", path: '/financialCenter/fundsAccount', component: bundle(Empty, FundsAccount, { type: "callback" }) },
    { type: "route", path: '/contract/contractTemplate', component: bundle(Empty, ContractTemplate, { type: "callback" }) },
    { type: "route", path: '/contract/addContractTemplate', component: bundle(Empty, AddContractTemplate, { type: "callback" }) },
    { type: "route", path: '/contract/supplyContractTemplate', component: bundle(Empty, SupplyContractTemplate, { type: "callback" }) },
    { type: "route", path: '/contract/addSupplyContractTemplate', component: bundle(Empty, AddSupplyContractTemplate, { type: "callback" }) },

	/*帮助中心*/
    { type: "route", path: "/websiteBulletin/HelpCenter/:helpClass", component: bundle(Empty, HelpCenter, { type: "callback" }), exact: true },
    { type: "route", path: "/websiteBulletin/HelpCenter/:hc/edit/:uuids/:helpClass", component: bundle(Empty, HelpCenterClassModalForm, { type: "callback" }) },
    { type: "route", path: "/websiteBulletin/HelpCenter/:hc/add/:helpClass/:classId", component: bundle(Empty, HelpAddCenter, { type: "callback" }) },


	/*网站公告*/
	{ type: "route", path: "/websiteBulletin/websiteBulletin", component: bundle(Empty, WebsiteBulletin, { type: "callback" }), exact: true },
	{ type: "route", path: "/websiteBulletin/websiteBulletin/edit", component: bundle(Empty, WebsiteBulletinModalForm, { type: "callback" }) },

	/*新网站公告*/
	{ type: "route", path: "/websiteBulletin/websiteBulletinNew", component: bundle(Empty, WebsiteBulletinNew, { type: "callback" }), exact: true },
	{ type: "route", path: "/websiteBulletin/websiteBulletinNew/edit", component: bundle(Empty, WebsiteBulletinModalFormNew, { type: "callback" }) },
	{ type: "route", path: "/websiteBulletin/websiteBulletinNew/draft/:uuids", component: bundle(Empty, WebsiteBulletinDraft, { type: "callback" }) },

	/*基本设置*/
	{ type: "route", path: "/basicSetup/brandManagement", component: bundle(Empty, BrandManagement, { type: 'callback' }) },
	{ type: "route", path: "/basicSetup/addBrand/:uuids?", component: bundle(Empty, AddBrand, { type: 'callback' }) },
	{ type: "route", path: "/basicSetup/commodityClassification", component: bundle(Empty, CommodityClassification, { type: 'callback' }) },
	{ type: 'route', path: "/basicSetup/contrabandManagement", component: bundle(Empty, ContrabandManagement, { type: 'callback' }) },
	/* 结算单列表 */
	{ type: "route", path: "/financialCenter/platSettlementList", component: bundle(Empty, PlatSettlementList, { type: "callback" }) },
	/* 新结算单列表 */
	{ type: "route", path: "/financialCenter/platSettlementListNew", component: bundle(Empty, PlatSettlementListNew, { type: "callback" }) },
	/* 发票列表 */
	{ type: "route", path: "/platInvoice/invoiceList", component: bundle(Empty, PlatInvoice, { type: "callback" }) },
	/*财务中心*/
	{ type: "route", path: '/financialCenter/capitalAccount', component: bundle(Empty, CapitalAccountManagement, { type: "callback" }),exact: true },
	{ type: "route", path: '/financialCenter/capitalAccount/details/:companyId', component: bundle(Empty, CapitalAccountDetails, { type: "callback" }),exact: true },
	{ type: "route", path: '/financialCenter/capital', component: bundle(Empty, CapitalAccount, { type: "callback" }) },
	{ type: "route", path: '/financialCenter/paymentsBalance', component: bundle(Empty, PaymentsBalance, { type: "callback" }) },
	/**交易管理 */
	{ type: "route", path: '/transaction/abnormalRecordAccount', component: bundle(Empty, AbnormalRecordAccount, { type: "callback" }) },
	{ type: "route", path: '/transaction/handle', component: bundle(Empty, Handle, { type: "callback" }) },
	{ type: "route", path: '/transaction/details', component: bundle(Empty, Details, { type: "callback" }) },
	/* 招标公告-中标公告 */
	{ type: "route", path: "/tenderNotice/winningAnnouncement", component: bundle(Empty, WinningAnnouncement, { type: "callback" }) },
	{ type: "route", path: "/tenderNotice/bidOrderList", component: bundle(Empty, BidOrderList, { type: "callback" }) },

	/**广告位推荐采购清单管理*/
    { type: "route", path: '/purchaser/purchaseListAddition', component: bundle(Empty, PurchaseListAddition, { type: "callback" }) },
	/**广告位推荐合作单位管理*/
    { type: "route", path: '/purchaser/cooperatorsListAddition', component: bundle(Empty, CooperatorsListAddition, { type: "callback" }) },


	/***商品管理--商品审核***/
	{ type: "route", path: '/goodsManagement/commodityAudit', component: bundle(Empty, CommodityAudit, { type: "callback" }), exact: true },
	{ type: "route", path: '/goodsManagement/commodityAudit/audit/:uuids', component: bundle(Empty, CGAudit, { type: "callback" })},
	/***商品管理--商品管理***/
	{ type: "route", path: '/goodsManagement/goods', component: bundle(Empty, Goods, { type: "callback" }), exact: true },
	{ type: "route", path: '/goodsManagement/goods/details/:uuids', component: bundle(Empty, GoodsDetails, { type: "callback" })},
	/***类型管理--商品管理***/
	{ type: "route", path: '/goodsManagement/goodsType', component: bundle(Empty, GoodsType, { type: "callback" }), exact: true },
	{ type: "route", path: '/goodsManagement/goodsType/details/:uuids', component: bundle(Empty, GoodsTypeDetails, { type: "callback" })},
	/***属性管理--商品管理***/
	{ type: "route", path: '/goodsManagement/goodsAttribute', component: bundle(Empty, GoodsAttribute, { type: "callback" }), exact: true },
	{ type: "route", path: '/goodsManagement/goodsAttribute/details/:uuids', component: bundle(Empty, GoodsAttributeDetails, { type: "callback" })},

	/* 开发用 */
	// { type: "route", path: "/dev/table", component: bundle(Empty, Tables, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/inquiryManagement", component: bundle(Empty, InquiryManagement, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/inquiryDetail/:uuids/:statusStr", component: bundle(Empty, InquiryDetail, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/orderManagement", component: bundle(Empty, OrderManagement, { type: "callback" }) },
	{ type: "route", path: "/platInvoice/orderDetail", component: bundle(Empty, OrderDetail, { type: "callback" }) },
	// 新订单详情页
	{ type: "route", path: "/platInvoice/orderDetailNew", component: bundle(Empty, OrderDetailNew, { type: "callback" }) },

	/**门户管理**/
	//待审核
	{ type: "route", path: '/auditManagement/storeAudit', component: bundle(Empty, StoreAudit, { type: "callback" }), exact: true },
	{ type: "route", path: '/auditManagement/storeAudit/audit/:uuids', component: bundle(Empty, storeAuditInfo, { type: "callback" }), exact: true },

	//投诉建议列表
	{ type: "route", path: '/complaintsInfoCenter/complaintsList', component: bundle(Empty, ComplaintsList, { type: "callback" }), exact: true },
	//投诉建议收藏夹
	{ type: "route", path: '/complaintsInfoCenter/favoriteList', component: bundle(Empty, FavoriteList, { type: "callback" }), exact: true },

	/*频道管理*/
	{ type: "route", path: '/pageChannel/storePlatform', component: bundle(Empty, StorePlatform, { type: "callback" }), exact: true },
	{ type: "route", path: '/pageChannel/crccIndex', component: bundle(Empty, CrccIndex, { type: "callback" }), exact: true },
	{ type: "route", path: '/pageChannel/inqueryBanner', component: bundle(Empty, InqueryBanner, { type: "callback" }), exact: true },

	/* 京东商品 */
	{ type: "route", path: "/sys/JDGoodsMenu", component: bundle(Empty, JDGoodsMenu, { type: "callback" }), exact: true },

	/* 招投标导入 */
	{ type: "route", path: "/sys/BiddingMenu", component: bundle(Empty, BiddingMenu, { type: "callback" }), exact: true },

	/* 年终统计 */
	{ type: "route", path: "/static/yearStatistic", component: bundle(Empty, YearStatistic, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/yearMarriedStatistic", component: bundle(Empty, YearMarriedStatistic, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/yearJZLStatistic", component: bundle(Empty, YearJZLStatistic, { type: "callback" }), exact: true },

	{ type: "route", path: "/static/yearStatisticByJu", component: bundle(Empty, YearStatisticByJu, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/yearMarriedStatisticByJu", component: bundle(Empty, YearMarriedStatisticByJu, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/yearJZLStatisticByJu", component: bundle(Empty, YearJZLStatisticByJu, { type: "callback" }), exact: true },

	{ type: "route", path: "/static/yearInquiryCountStatisticByChu", component: bundle(Empty, YearInquiryCountStatisticByChu, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/yearOrderCountStatisticByChu", component: bundle(Empty, YearOrderCountStatisticByChu, { type: "callback" }), exact: true },



	{ type: "route", path: "/static/yearInquiryCountStatistic", component: bundle(Empty, YearInquiryCountStatistic, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/yearOrderCountStatistic", component: bundle(Empty, YearOrderCountStatistic, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/quotationOrderTransaction", component: bundle(Empty, QuotationOrderTransaction, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/inquiryAndQuotation", component: bundle(Empty, InquiryAndQuotation, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/paymentAmount", component: bundle(Empty, PaymentAmount, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/amountOfArrears", component: bundle(Empty, AmountOfArrears, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/purchasedItems", component: bundle(Empty, PurchasedItems, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/purchaseAccount", component: bundle(Empty, PurchaseAccount, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/supplierRegistration", component: bundle(Empty, SupplierRegistration, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/supplierCertificationTotal", component: bundle(Empty, SupplierCertificationTotal, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/quotationOrderTransactionChu", component: bundle(Empty, QuotationOrderTransactionChu, { type: "callback" }), exact: true },
	{ type: "route", path: "/static/inquiryAndQuotationChu", component: bundle(Empty, InquiryAndQuotationChu, { type: "callback" }), exact: true },

	//高达临时测试
	{ type: "route", path: "/gaoda/department", component: bundle(Empty, Department, { type: "callback" }), exact: true },
	{ type: "route", path: "/gaoda/staff", component: bundle(Empty, DepartmentStaff, { type: "callback" }), exact: true },
	{ type: "route", path: "/gaoda/role", component: bundle(Empty, DepartmentRole, { type: "callback" }), exact: true },

	//商品分类修改
	{ type: "route", path: "/goodsClass/updateGoodsClass", component: bundle(Empty, UpdateGoodsClass, { type: "callback" }), exact: true },
	//门户-企业资质
	{ type: "route", path: "/qualification/basicInfomation", component: bundle(Empty, BasicInfomation, { type: "callback" }), exact: true },
	{ type: "route", path: "/qualification/lawLitigation", component: bundle(Empty, LawLitigation, { type: "callback" }), exact: true  },
	{ type: "route", path: "/qualification/managementRisk", component: bundle(Empty, ManagementRisk, { type: "callback" }) , exact: true },
	{ type: "route", path: "/qualification/managementState", component: bundle(Empty, ManagementState, { type: "callback" }), exact: true  },

	{ type: "route", path: "/sys/supplierSearchSet", component: bundle(Empty, SupplierYellow, { type: "callback" }), exact: true  },

	/* 招标公告-中标公告 */
	{ type: "route", path: "/bidNotice/winningAnnouncement", component: bundle(Empty, WinningAnnouncement1, { type: "callback" }) },
	{ type: "route", path: "/bidNotice/bidOrderList", component: bundle(Empty, BidOrderList1, { type: "callback" }) },
	{ type: "route", path: "/bidNotice/reportBid", component: bundle(Empty, reportBid, { type: "callback" }) },


	 // 客服中心
     { type: "route", path: "/customer/margin", component: bundle(Empty, CustomerMargin, { type: "callback" }) },
     { type: "route", path: "/customer/del/:uuids", component: bundle(Empty, CustomerDel, { type: "callback" }) },
     // 财务管理
	/* { type: "route", path: "/capitalAccoun/accountClear/", component: bundle(Empty, AccountClear, { type: "callback" }) },
     { type: "route", path: "/capitalAccoun/accountclearDetail/", component: bundle(Empty, AccountclearDetail, { type: "callback" }) },
	 { type: "route", path: "/capitalAccoun/accountReview/", component: bundle(Empty, AccountReview, { type: "callback" }) },//复核*/
	 //循环物资挂账清分列表
	 { type: "route", path: "/xhFinanceHang/financeList", component: bundle(Empty, XhFinanceHang, { type: "callback" }) },//挂账清分

	 { type: "route", path: "/xhFinanceHang/financeDetail/:uuids", component: bundle(Empty, XhFinanceHangDetail, { type: "callback" }) },//挂账清分

	 //循环物资挂账清分复核列表
	 { type: "route", path: "/xhFinanceHang/financeApprovalList", component: bundle(Empty, XHFinanceApprovalHangList, { type: "callback" }) },//复核

	 //循环物资挂账清分复核详情
	 { type: "route", path: "/xhFinanceHang/financeApprovalDetail/:uuids", component: bundle(Empty, XHFinanceApprovalHangDetail, { type: "callback" }) },//复核

	//直采供应商审核
	{ type: "route", path: "/firsthand/approvalSupplierList", component: bundle(Empty, 	fristHandApprovalList, { type: "callback" }) },//复核


	//直采专区栏位
	{ type: "route", path: "/firsthand/boothGoods", component: bundle(Empty, FirsthandDpBoothGoodsList, { type: "callback" }) },
	//合同关联商品管理
	{ type: "route", path: "/firsthand/contractGoodsList", component: bundle(Empty, ContractGoodsList, { type: "callback" }) },
	{ type: "route", path: "/firsthand/contractGoodsDetail", component: bundle(Empty, ContractApprovalDetail, { type: "callback" }) },
	//直采合同新增
	{ type: "route", path: "/firsthand/firsthandContractRelease", component: bundle(Empty, FirsthandContractRelease, { type: "callback" }) },
	{ type: "route", path: "/firsthand/firsthandContractList", component: bundle(Empty, FirsthandContractList, { type: "callback" }) },
	{ type: "route", path: "/firsthand/contractDetail", component: bundle(Empty, ContractDetail, { type: "callback" }) },


	{ type: "route", component: NoAu },


];
export default routes;
