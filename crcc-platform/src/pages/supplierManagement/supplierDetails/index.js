import { Tabs, Form, Row, Col, Button, Table, Card , Modal , Select, Switch, Spin } from 'antd';
import Album from 'uxcore-album';
import api from '@/framework/axios';
import Util from '@/utils/util';
import ModalForm from './modalForm';
import AuthButton from '@/components/authButton';
import BaseTable from '@/components/baseTable';
import BaseDetails from '@/components/baseDetails';
import DisposeModal from './disposeModal';
import SupplierBlacklistModal from './supplierBlacklistModal';
import CorporateBlacklistModal from './corporateBlacklistModal';
import EvaluationModal from './evaluationModal';
import ResetPwdModal from './resetPwdModal';
import ModalreAdmin from './reAdmin';
import ModalreSubAdmin from './reSubAdmin';
import MySuppliers from './mySuppliers';
import {systemConfigPath} from "@/utils/config/systemConfig";
import Input from '@/components/baseInput';
import less from './index.less';
import React from "react";
import StatisticsStore from "./statistics";
import {NumberFormat} from '@/components/content/Format'
import SearchInput from '@/components/searchInput'
import ViolationModal from "../../materialsUserManage/supplierManagement/violationModal";
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Photo } = Album;
const confirm = Modal.confirm;

class SupplierDetails extends React.Component {
  state = {
    taxpayersEligibleProperties: 1,
    invoiceTypeData: [{value: '1', label: '增值税专用发票'},{value: '2', label: '增值税普通发票'}],//发票类型
    projectTypeArr:[
      {value:1,text:"市政工程"},
      {value:2,text:"建筑工程"},
      {value:3,text:"轨道工程"},
      {value:4,text:"桥梁工程"},
      {value:5,text:"铁路工程"},
      {value:6,text:"公路工程"},
      {value:7,text:"隧道工程"},
    ],
    projectStatusArr:[
      {value:1,text:"筹备"},
      {value:2,text:"实施"},
      {value:3,text:"暂停"},
      {value:4,text:"废止"},
    ],
    projectStatus: [],
    projectType: [],
    querysort: '',
    order: '',
    supplierInfo: {},
    supplierTitle: {},
    adminInfo: {},
    companyStatus: 0,//公司状态
    imgModalShow: false,
    imgList: [],
    navPlatformsId: '',
    nameOrPhone: '',
    orgList: [],
    navPlatforms: [],//子平台列表
    disposeShow: false,
    disposeIndex: 1,
    supplierUsersInfo: [],
    ModalreAdminShow: false,
	ModalreSubAdminShow: false,
    MySuppliersShow: false,
    userInfo: {},
    resetPwdShow: false,
    resetPwdInfo: {},
      proUserCount: null,//项目员工数量
    clarification: {},//说明材料
    clarificationDocumentHistory: [],
    accountList: {}, // 子账号列表
    userList: {},//子账号信息
    informationChangeRecord: {},//信息变更记录
    // adminList: {},//管理员记录
	subPlatformId:0,
    tableState: 0,//管理员记录
    recordOfViolation: [],//门户记录
    portalVisible: false,   //门户开启显示
    portalLoading: false,   //门户开启提交按钮
    status: true,   //店铺状态 true 门户启用 ，false 门户关闭
    storeStatus: true,    //店铺状态  true 开启， false 关闭
    remarks:'',   //门户管理备注
    storeUuids: '', //店铺的uuids
    signStatus:[], //签章状态
    AreaList:[], //供货区域

    employed: false,    //店铺自营状态
    employedStatus: false,    //店铺自营弹窗状态控制
    employedVisible: false,   //自营弹窗
    employedLoading: false,   //自营更改提交加载中
    accountVisible: false, // 子账号信息查看弹框
    accountObj: {}, // 子账号信息详情
    projectVisible: false, // 项目信息查看弹框
    projectObj: {}, // 项目信息详情
    recordOfEmployed: [],//自营变更记录
      employedTotal: null,//自营变更记录数量
    projectMembers: [], // 项目成员数据
    employedRemarks:'' ,    //自营记录备注

    tempGoodsStatus: false,   //商品弹窗开关
    goodsStatus: false,   //商品管理状态
    goodsVisible: false,   //商品弹窗
    goodsLoading: false,   //商品更改提交加载中
    recordOfGoods: [],    //商品变更记录
    goodsRemarks: '', //商品管理备注

    tempDealStatus: false,   //交易弹窗开关
    dealStatus: false,   //交易管理状态
    dealVisible: false,   //交易弹窗
    dealLoading: false,   //交易更改提交加载中
    recordOfDeal: [],   //交易变更记录
    accountOfDeal: [],   //岗位信息_子账号信息查看
    dealRemarks:'',     //交易管理备注
    evaluateObj: {}, // 评价信息
    capitalAmount:{},//资金账户
    capitalAmountType: 3,//资金账户默认显示子平台
      statisticData: {},//统计数据
    useSubPlatformList: [],// 已开通子平台列表
      punlishDays: null,  //封停时间
      punishDisabled: false,  //封停时间选择控制
      companyLabel: [],       //企业标签数据
      companyLabelObj: {},    //当前编辑的企业标签
      companyLabelVisible: false,     //企业标签修改弹窗控制
      companyLabelLoading: false,     //企业标签弹窗提交按钮
      companyLabelStatus: false,      //企业标签修改状态

      storeSwitch: {},        //保存店铺开关
      storeSwitchVisible: false,    //店铺开关的弹窗控制
      currentSwitchName: null,    //当前选中的开关
      currentStoreSwitchStatus: false,     //当前选中的开关的状态
      storeStatusLoading: false,      //开关提交按钮控制
      violationModalShow: false,        //处罚弹窗控制
      vioLoading: false,                //处罚加载控制
      loadDataFlag: false,//加载中
  }
  _isMounted = false;

  _uuids = "";
  _companyId = "";
    componentDidMount() {
    }
  componentWillMount() {
    this._isMounted = true;
    const id = this.props.match.params.id;
    this._uuids = id;
    this.getSupplierDetails(id);
    this.getRecordOfViolation(id);
    //查询自营设置修改记录
    this.getRecordOfEmployed(id);
    //查询交易管理的修改记录
    //this.getRecordOfStatus(id, 'deal');
    this.getClarificationData(id);
    this.querySubPlatformList(); // 获得子平台类别
    this.getRailwayBank(id);
    this.areaClass(); // 供货区域

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // 项目成员分页查询
  queryOrgUserList = (obj) => {
    api.ajax('POST', '@/platform/extra/company/queryOrgUserList', {
      companyId: obj.companyId,
      orgSubId: obj.orgSubId
    }).then(r => {
        if (r.msg === '请求成功') {
            this.setState({
              projectMembers: r.data? r.data.rows: [],
                proUserCount: r.data? r.data.rows ? r.data.rows.length : '-' : '-'
            });
        }
    }).catch(r => {
    });
  }

  // 子账号岗位信息接口
  queryUserRoleByUserId = (record) => {
    api.ajax('POST', '@/platform/extra/company/queryUserRoleByUserId', {
      companyId:record.companyId,
      subPlatformId:record.subPlatformId,
      id:record.id
    }).then(r => {
        if (r.msg === '请求成功') {
            this.setState({
              accountOfDeal: r.data? r.data.rows: []
            });
        }
    }).catch(r => {
    });
  }

  // 开通子平台列表接口
  getUseSubPlatformList = (companyId) => {
    api.ajax('GET', '@/platform/extra/company/queryUseSubPlatformListByCompanyId', {
      companyId
    }).then(r => {
        if (r.msg === '请求成功') {
            this.setState({
              useSubPlatformList: r.data
            });
        }
    }).catch(r => {
    });
  }


  // 获取子平台数据 (第一步列表)
  querySubPlatformList = () => {
    api.ajax("GET", "@/sub/subPlatform/querySubPlatformListByUserAndCompany", {
    }).then(r => {
      
      if(r.code == "200"){
        let spUuid = r.data.filter(i =>{
          //测试已开通显示
          // if(i.spType === 8)
          //   return i.companyId = 1;
        });
        this.setState({
          navPlatforms: r.data
        })
        this._companyInfo.spUuids = spUuid[0].uuids
      }
    }).catch(r => {

    });
  }


  // 先查询地域 (供货区域)
  areaClass = () => {
    api.ajax('GET', '@/base/ecProvince/selectArea', {}).then(r => {
        if (r.msg === '请求成功') {
            this.setState({
                AreaList: r.data.rows
            });
        }
    }).catch(r => {
    });
  }

  areaOptions = (supplyArea) => {
    var options = '';
    this.state.AreaList.map((v, index) => {
      if(supplyArea && supplyArea.indexOf(v.areaCode) !==-1) {
        options = options+v.areaName+' ';
      }
    });
    return options;
  }

    //加载供应商累计报价数
    queryRhSupplierQuotationCount = (id) => {
        let _this = this;
        api.ajax('GET', '@/inquiry/inquiryListController/getRhSupplierQuotationCount', {
            companyId: id
        }).then(r => {
            if (!_this._isMounted) {
                return;
            }
            let count = 0;
            if(r.data) {
                count = r.data.quoCount;
            }
            let {statisticData} = this.state;
            statisticData.textT1 = "累计报价数";
            statisticData.valueV1 = count;
            this.setState({
                getRhSupplierQuotationCount: count,
                statisticData: {...statisticData},
                loadDataFlag: false
            });
        }).catch(r => {
            let {statisticData} = this.state;
            statisticData.textT1 = "累计报价数";
            this.setState({
                statisticData: {...statisticData},
                loadDataFlag: false
            });
        })
    }
    //加载供应商累计订单数
    queryRhSupplierOrderCount = (id) => {
        let _this = this;
        api.ajax('GET', '@/order/supplierOrderController/getRhSupplierOrderCount', {
            companyId: id
        }).then(r => {
            if (!_this._isMounted) {
                return;
            }
            let count = 0;
            if(r.data){
                count = r.data.orderCount;
            }
            let {statisticData} = this.state;
            statisticData.textT2 = "累计订单数";
            statisticData.valueV2 = count;
            this.setState({
                getRhSupplierOrderCount: count,
                statisticData: {...statisticData},
                loadDataFlag: false
            })
        }).catch(r => {
            let {statisticData} = this.state;
            statisticData.textT2 = "累计订单数";
            this.setState({
                statisticData: {...statisticData},
                loadDataFlag: false
            })
        })
    }
    //加载供应商累计成交额
    queryRhSupplierTotalPrice = (id) => {
        let _this = this;
        api.ajax('GET', '@/order/supplierOrderController/getRhSupplierTotalPrice', {
            companyId: id
        }).then(r => {
            if (!_this._isMounted) {
                return;
            }
            let count = 0;
            if(r.data){
                count = r.data.totalPrice;
            }
            let {statisticData} = this.state;
            statisticData.textT3 = "累计成交额"+(count>10000?"(万元)":"(元)");
            statisticData.valueV3 = (count>10000?(count/10000).toFixed(4):count.toFixed(2));
            this.setState({
                getRhSupplierTotalPrice: "¥"+(count>10000?(count/10000).toFixed(4)+"万元":count.toFixed(2)+"元"),
                statisticData: {...statisticData},
                loadDataFlag: false
            })
        }).catch(r => {
            let {statisticData} = this.state;
            statisticData.textT3 = "累计成交额(元)";
            this.setState({
                statisticData: {...statisticData},
                loadDataFlag: false
            })
        })
    }
    //加载供应商上加商品数量
    queryGoodsTotalCount = (id) => {
        let _this = this;
        api.ajax('GET', '@/merchandise/ecGoods/page', {
            companyId: id,status:0
        }).then(r => {
            if (!_this._isMounted) {
                return;
            }
            let count = 0;
            if(r.data){
                count = r.data.total;
            }
            let {statisticData} = this.state;
            statisticData.textT4 = "上架商品数量";
            statisticData.valueV4 = count;
            this.setState({
                queryGoodsTotalCount: count,
                statisticData: {...statisticData},
                loadDataFlag: false
            })
        }).catch(r => {
            let {statisticData} = this.state;
            statisticData.textT4 = "上架商品数量";
            this.setState({
                statisticData: {...statisticData},
                loadDataFlag: false
            })
        })
    }
    //签章状态
    queryForceContractSignStatus = (companyId) => {
        api.ajax('GET', '@/common/settledContractController/queryForceContractSignStatus', {
            companyId
        }).then(r => {
            if(r.data){
                this.setState({
                    signStatus: r.data
                })
            }
        }).catch(r => {
        })
    }
  //获取供应商信息
  getSupplierDetails = (id) => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecCompanySupplier/getCompanyInfo', {
      uuids: id
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      let companyStatus = 0
      if (r.data.blackCompanyType == 1 || r.data.blackPersonType == 1) {
        companyStatus = 1;
      }
      let supplierTitle = {
        blackCompanyType: r.data.blackCompanyType,
        blackPersonType: r.data.blackPersonType,
        recommendFlag: r.data.recommendFlag,
        recommendCompanyName: r.data.recommendCompanyName,  //推荐人的公司名称
        rating: r.data.rating
      }
      this.setState({
        supplierInfo: r.data.vo,
        supplierTitle,
        companyStatus
      })
      this._companyId = r.data.vo.companyId;
      this.getAdminInfo(r.data.vo.companyId);
        //查询违规记录
      this.getRecordOfStatus(r.data.vo.companyId)
      this.getUserList(r.data.vo.companyId);
      this.getCompanyChangeRecord(r.data.vo.companyId);
      this.queryStoreStatus(r.data.vo.companyId);
      this.queryRhSupplierQuotationCount(r.data.vo.companyId);
      this.getUseSubPlatformList(r.data.vo.companyId);
      this.queryRhSupplierOrderCount(r.data.vo.companyId);
      this.queryRhSupplierTotalPrice(r.data.vo.companyId);
      this.queryGoodsTotalCount(r.data.vo.companyId);
      this.queryForceContractSignStatus(r.data.vo.companyId);
      this.getCompanyLevelInfo(this._companyId);
      this.queryUserPageByCompanySub(this._companyId, {});
      this.queryOrgPageByCompanySub(this._companyId, {});
      this.baseParams = {
        companyId: r.data.vo.companyId
      }
      this.handelToLoadTable();
        //查询当前公司的标签状态
        this.queryCompanylabel(r.data.vo.companyId)
        //查询当前公司的开关状态
        this.queryStoreSwitchStatus(r.data.vo.companyId)
      this.queryAccountByCompanySub(this._companyId, this.state.capitalAmountType);//资金账户
        //查询备注信息
        this.queryCompanyRecord(r.data.vo.companyId);
    })
  }

  // 查询当前的信息
  getCompanyLevelInfo=(companyId)=>{
    api.ajax(
        'GET',
        '@/platform/extra/company/getCompanyLevelInfo',
        {companyId}
    ).then(
        r => {
            const evaluateObj = r.data;
            this.setState({evaluateObj})
        }
    ).catch(
        r => {
            Util.alert(r.msg, { type: "error" })
        }
    )
}

  //查询店铺的关停状态
  queryStoreStatus=(companyId)=>{
    let _this = this;
    api.ajax('GET', '@/portal/ecStore/queryStoreStatus', {
      companyId
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      if(r.data){
        let status = this.state.status;
        let storeStatus = this.state.storeStatus;
        let employed = this.state.employed;
        let employedStatus = this.state.employedStatus;
        let companyStatus = this.state.companyStatus;
        let blackCompanyType = this.state.supplierTitle.blackCompanyType;
        let blackPersonType = this.state.supplierTitle.blackPersonType;
        let goodsStatus = this.state.goodsStatus;
        let tempGoodsStatus = this.state.tempGoodsStatus;
        let dealStatus = this.state.dealStatus;
        let tempDealStatus = this.state.tempDealStatus;

        if(blackCompanyType == 1 || blackPersonType == 1){  //当黑名单为关闭，整体状态也是异常的
          companyStatus = 1;
        }

        if(r.data.status == 0){
          status = true;
          storeStatus = true;
        }else{      //门户关闭
          status = false;
          storeStatus = false;
          companyStatus = 1;
        }

        if(r.data.employed == 0){
          employed = true;
          employedStatus = true;
        }else{
          employed == false;
          employedStatus = false;
        }
        if(r.data.goodsSwitch == 0){
          goodsStatus = true;
          tempGoodsStatus = true;
        }else{    //商品关闭
          goodsStatus == false;
          tempGoodsStatus = false;
          companyStatus = 1;
        }
        //交易管理
        if(r.data.dealSwitch == 0){
          dealStatus = true;
          tempDealStatus = true;
        }else{
          dealStatus = false;
          tempDealStatus = false;
          companyStatus = 1;
        }

        this.setState({
          status,
          storeStatus,
          companyStatus,
          employed,
          employedStatus,
          goodsStatus,
          tempGoodsStatus,
          dealStatus,
          tempDealStatus
        })
      }
      return;
    }).catch(r => {
      console.log("查询当前店铺状态失败：", r);
    })
  }

  //查询银信认证状态
  getRailwayBank = (uuids) => {
    api.ajax("GET", "@/supplier/ecCompanySupplier/chinaRailwayBank", {
      uuids
    }).then(r => {
      if (!this._isMounted) { return }
      const status = JSON.parse(r.data.data).compStatus == 40 ? 1 : 0;
      this.setState({
        supplierTitle: {
          ...this.state.supplierTitle,
          silverLetterFlag: status,
        }
      })
    }).catch(r => {
        Util.alert('查询银信认证状态'+(r.msg?r.msg:r.message), { type: 'error' });
    })
  }

  //说明材料
  params = {
    _url: '@/base/ecUpload/all',
    method: 'GET',
    rows: 10,
    page: 1
  }
  //澄清文件表头信息
  ClarificationColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        render: (text, record, index) => (
          <span>{index*1 + 1}</span>
        )
      },
      {
        title: '文件名称',
        dataIndex: 'urlName',
        key: 'urlName',
        width: 400,
        render: (text, record, index) => {
          if (text && text.length >= 15) {
            return <span title={text}>{text}...</span>
          } else if (!text) {
            return <span>{record.url}</span>
          }
          return <span>{text}</span>
        }
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
        render: (text, record, index) => {
          return <span>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):'--'}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'url',
        key: 'url',
        width: 100,
        render: (text, record, index) => (
          <a href={SystemConfig.configs.resourceUrl + text} target="_blank" download={record.urlName}>下载</a>
        )
      }
    ]
  }

  //企业用户子账号列表
  queryUserPageByCompanySub = (companyId, obj) => {
    let {querysort, order} = this.state;
    api.ajax('POST', '@/platform/extra/company/queryUserPageByCompanySub', {
      companyId,
      querysort,
      order,
      nameOrPhone: obj.nameOrPhone,
      subPlatformId: obj.subPlatformId
    }).then(r => {
      this.setState({
        accountList: r.data
      })
    })
  }
  getSearchInput = () =>{}

  //获得澄清文件
  getClarificationData = (uuids) => {
    api.ajax('GET', '@/supplier/ecCompanySupplier/queryClarificationDocumentByCompanyUuids', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        clarificationDocumentHistory: r.data
      })
    })
  }
  //子账号表头信息
  SubAccountInformationColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        sorter:true,
          width: 60,
        render: (text, record, index) => (
          <span>{index*1+1}</span>
        )
      },
      {
        title: '用户姓名',
        dataIndex: 'username',
        sorter:true,
          width: 140,
        key: 'username'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        sorter:true,
        key: 'gender',
          width: 60,
        render: (text, record) => (
          <span>{record.gender == "1" ? "男" : "女"}</span>
        )
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
          width: 130,
        key: 'phone'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },
        {
            title: "角色",
            dataIndex: 'roleName',
            sorter:true,
            width: 160,
            key: 'roleName'
        },
      {
        title: '创建时间',
        dataIndex: 'createTimeStr',
        sorter:true,
          width: 150,
        key: 'createTimeStr'
      },
      {
        title: "有效期",
        sorter:true,
        dataIndex: 'validStr',
          width: 150,
        key: 'validStr',
          render: (text, record) => (
              <span>{record && record.validStr == '2500-12-31 00:00:00' ? '长期' :  moment(record.validStr).format("YYYY-MM-DD")}</span>
          )
      },
      {
        title: "状态",
        sorter:true,
        dataIndex: 'state',
        key: 'state',
          width: 100,
        render: (text, record) => (
          <span>{
            record.state==1?"启用":
            record.state==2?"停用": "-"}</span>
        )
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => (
          <a href="javascript:void(0);" onClick={() => (this.handleViewDetails(record))}>查看</a>
        )
      }
    ]
  }
  //项目信息表头信息
  SubProjectInformationColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        sorter:true,
        width:60,
        render: (text, record, index) => (
          <span>{index*1+1}</span>
        )
      },
      {
        title: '项目编号',
        dataIndex: 'organizationNo',
        sorter:true,
        width:200,
        key: 'organizationNo'
      },
      {
        title: '项目名称',
        dataIndex: 'organizationName',
        sorter:true,
        key: 'organizationName'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width:80,
        filters: [
          {
            text: '部门',
            value: 0
          },
          {
            text: '项目',
            value: 1
          }
        ],
        render: (text, record) => {
          if(text == 0 || text == "0"){
            return "部门";
          } else if(text == 1 || text == "1") {
            return "项目";
          } else {
            return "-";
          }
        }
      },
      {
        title: '负责人',
        dataIndex: 'ownUserName',
        key: 'ownUserName',
        width:120
      },
      {
        title: '员工数',
        dataIndex: 'count',
        sorter:true,
        width:100,
        key: 'count'
      },
      {
        title: '立项时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width: 100,
        sorter: true,
        render: (text, record)=> {
            if(text){
                return(
                    <div style={{width: "100px"}}>
                        <span>{ text ? moment(text).format('YYYY-MM-DD') : '--'}</span>
                    </div>
                )
            }else{
                return "-"
            }
        }
      },
      {
        title: "预计完工",
        dataIndex: 'endTime',
        key: 'endTime',
        width: 100,
        sorter: true,
        render: (text, record)=>{
            if(text){
                return(
                    <div style={{width:"100px"}}>
                        <span>{ text? moment(text).format('YYYY-MM-DD') : '--'}</span>
                    </div>
                )
            }else{
                return "-"
            }
        }
      },
      {
        title: "状态",
        dataIndex: 'projectStatus',
        key: 'projectStatus',
        width:120,
        filters: this.state.projectStatusArr,
        render: (text, record) => (
          <span>{
            text
            ?
            this.state.projectStatusArr.map((projectStatus) => {
              return text==projectStatus.value?projectStatus.text:null
            })
            :
            "-"
          }</span>
        )
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        width:80,
        fixed: 'right',
        render: (text, record) => (
          <a href="javascript:void(0);" onClick={() => (this.handleViewProject(record))}>查看</a>
        )
      }
    ]
  }
  // 查看项目信息
  handleViewProject=(record)=>{
    this.queryOrgUserList(record);
    api.ajax('GET', '@/platform/extra/company/getOrgDetail', {
      uuids: record.uuids
    }).then(r => {
      this.setState({
        projectVisible: true,
        projectObj: r.data
      })
    }).catch(r => {})
  }
  handleProjectCancel=()=>{
    this.setState({
      projectVisible: false,
      projectObj: {}
    })
  }
  // 查看子账号信息
  handleViewDetails=(record)=>{
    this.queryUserRoleByUserId(record);
    api.ajax('GET', '@/platform/extra/company/getUserDetail', {
      uuids: record.uuids,
      companyId: record.companyId,
      subPlatformId: record.subPlatformId
    }).then(r => {
      this.setState({
        accountVisible: true,
        accountObj: r.data
      })
    }).catch(r => {})
  }
  handleAccountCancel=()=>{
    this.setState({
      accountVisible: false,
      accountObj: {}
    })
  }
  //子账号信息
  getUserList = (companyId) => {
    let _this = this;
    api.ajax('POST', '@/sso/ecUser/getUserListForCompany', {
      companyId
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        userList: r.data
      })
    }).catch(r => {
    })
  }
  // 企业用户项目分页查询
  queryOrgPageByCompanySub = (companyId, obj) => {
    let _this = this;
    let {projectStatus, projectType, querysort, order} = this.state;
    api.ajax('POST', '@/platform/extra/company/queryOrgPageByCompanySub', {
      companyId,
      projectStatusList: projectStatus,
      projectTypeList: projectType,
      querysort,
      order,
      subPlatformId:obj.subPlatformId,
      organizationName:obj.organizationName
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        orgList: r.data ? r.data.rows:[]
      })
    }).catch(r => {
    })
  }

  //显示资金账户内容
    showAccountHtml=()=>{
        let {loadDataFlag} = this.state;
        if(loadDataFlag){
            return (<div><Spin /></div>)
        }else{
            return (<div><Row gutter={24} style={{marginTop: "5px",marginBottom: "20px"}}>
                <Col span={20}>
                    <span><strong>开通状态：</strong><span style={{color:this.state.capitalAmount.openFlag == 0?"green":"red"}}>{this.state.capitalAmount ? this.state.capitalAmount.openFlag == 0 ? "正常":"异常" : '-'}</span></span>
                </Col>
                <Col span={4} style={{display:"none"}}>
                    <a href="javascript:void(0)" onClick={this.openDetails.bind()}>查看资金账户</a>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={6}>
                    <div>总金额：</div><div><span style={{fontSize: "28px"}}>{this.state.capitalAmount.totalAmt ? this.state.capitalAmount.totalAmt : "-"}</span> 元</div>
                </Col>

                <Col span={6}>
                    <div>冻结金额：</div><div><span style={{fontSize: "28px"}}>{this.state.capitalAmount.frozeAmt ? this.state.capitalAmount.frozeAmt : "-"}</span> 元</div>
                </Col>

                <Col span={6}>
                    <div>在途金额：</div><div><span style={{fontSize: "28px"}}>
                                      {this.state.capitalAmount.totalAmt ? (this.state.capitalAmount.totalAmt - (this.state.capitalAmount.frozeAmt ? this.state.capitalAmount.frozeAmt : 0) - (this.state.capitalAmount.wayingAmt ? this.state.capitalAmount.wayingAmt : 0)).toFixed(2) : "-"}</span> 元</div>
                </Col>

                <Col span={6}>
                    <div>可用金额：</div><div><span style={{fontSize: "28px"}}>{this.state.capitalAmount.wayingAmt ? this.state.capitalAmount.wayingAmt : "-"}</span> 元</div>
                </Col>
            </Row></div>)
        }
    }
    //资金账户
    queryAccountByCompanySub = (companyId, subId) => {
      this.setState({
          loadDataFlag: true
      })
        api.ajax('GET', '@/financial/accountBindsController/getAdminCapitalAmount', {
            companyId,
            subPlatform: subId,
            bankType: "00003"
        }).then(r => {
            this.setState({
                capitalAmount: r.data,
                loadDataFlag: false
            })
        }).catch(r => {
            let data = {wayingAmt: null,totalAmt: null,frozeAmt: null};
            this.setState({
                capitalAmount: data,
                loadDataFlag: false
            })
        })
    }
  //信息变更记录
  params3 = {
    _url: "@/supplier/ecCompanyChangeRecord/page",
    method: 'GET',
    rows: 10,
    page: 1
  }
  //信息变更记录
  InformationChangeRecordColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
          width: 60,
        render: (text, record, index) => (
          <span>{index + ((this.params3.page - 1) * this.params3.rows) + 1}</span>
        )
      },
      {
        title: '变更时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
          width: 150,
        render: (text, record) => (
          <span>{record.updateTime ? moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
        )
      },
      {
        title: '变更项目',
        dataIndex: 'changeField',
        key: 'changeField',
          width: 160
      },
      {
        title: "变更前",
        dataIndex: 'beforeContent',
        key: 'beforeContent'
      },
      {
        title: '变更后',
        dataIndex: 'afterContent',
        key: 'afterContent'
      }
    ]
  }
  //信息变更记录
  getCompanyChangeRecord = (companyId) => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecCompanyChangeRecord/page', {
      companyId
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        informationChangeRecord: r.data
      })
    }).catch(r => {
    })
  }

  //管理员记录
  baseParams = {
  }
  resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }
  //管理员记录
  AdminListColumns = () => {
    return [
      {
        title: '变更时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
        sorter:true,
          width: 170
      },
      {
        title: '操作人',
        dataIndex: 'createUser',
        sorter:true,
          width: 150,
        key: 'createUser'
      },
      {
        title: "变更前",
        dataIndex: 'beforeChange',
          width: 250,
        key: 'beforeChange'
      },
      {
        title: '变更后',
        dataIndex: 'afterChange',
          width: 250,
        key: 'afterChange'
      },
      {
        title: '授权书',
        dataIndex: 'confirmFilePath',
        key: 'confirmFilePath',
        render: (text, record) => {
          if (!text) { return null }
          return <a href={SystemConfig.configs.resourceUrl + text} target="_blank">下载</a>
        }
      }
    ]
  }

  params5 = {
    _url: '@/base/ecUpload/all',
    method: 'GET',
    rows: 10,
    page: 1
  }

  //门户记录
  RecordOfViolationColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => (
          <span>{index + ((this.params5.page - 1) * this.params5.rows) + 1}</span>
        )
      },
      {
        title: '处理时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '处理类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => (
          <span>{record.processingType == "2" ? "拉黑店铺" : record.processingType == "3" ? "拉黑法人" : record.processingType == "4" ? "门户封停" : record.processingType == '5' ? "门户开启" : "封停"}</span>
        )
      },
      {
        title: '处理人',
        dataIndex: 'processingPerson',
        key: 'processingPerson'
      },
      {
        title: '处理原因',
        dataIndex: 'processingReasons',
        key: 'processingReasons'
      },
    ]
  }

  //获取门户记录
  getRecordOfViolation = (uuids) => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecCompanyViolation/companyViolationPage', {
      uuids
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        recordOfViolation: r.data.rows
      })
    }).catch(r => {

    })
  }
  //项目信息查看表头
  projectColumns=()=> {
    return [
      {
        title: '员工编号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 70
      },
      {
        title: '姓名',
        dataIndex: 'username',
        width: 80,
        key: 'username'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 40,
        render: (text, record) => (
          <span>{record.gender == "1" ? "男" : "女"}</span>
        )
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        width: 80
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',width: 80,
        key: 'email'
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 70
      },
      {
        title: '添加时间',
        dataIndex: 'dispatchDate',
        key: 'dispatchDate',width: 100,
        render: (text, record, index) => {
            return(<p className={[less.nowrapEllipsis]} style={{width:"100px"}}>
              {moment(text).format("YYYY-MM-DD HH:mm:ss")}</p>)
        }
      }
    ]
  }
  //子账号信息查看表头
  accountColumns=()=> {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        render: (text, record, index) => (
            <span>{index + ((this.params5.page - 1) * this.params5.rows) + 1}</span>
        )
      },
      {
        title: '项目/部门',
        dataIndex: 'organizationName',
        key: 'organizationName'
      },
      {
        title: '职务',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 130,
        render: text => {
            return <div className='text_line4' title={text}>{text || '--'}</div>
        }
      }
    ]
  }
  //自营记录表头
  RecordOfEmployedColumns = (dataType) => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
          width: 60,
        render: (text, record, index) => (
            <span>{index + ((this.params5.page - 1) * this.params5.rows) + 1}</span>
        )
      },
      {
        title: '处理时间',
        dataIndex: 'createTime',
        key: 'createTime',
          width: 200,
        render: (text, record) => {
          return(<p style={{width:"140px"}}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):"--"}</p>)
        }
      },
      {
        title: '处理类型',
        dataIndex: 'result',
        key: 'result',
          width: 180,
        render: (text, record) => {
            if(record.result != null){
                return (<span>{record.result == 1 ? "拉黑公司" : record.result == 2 ? "交易关闭" : record.result == 3 ? "限制提现" : record.result == 4 ? "关闭店铺" : record.result == 5 ? "限制登录" : record.result == 6 ? "商品关闭" : "-"}</span>)
            }else if(dataType == "employed") {
                return (<span>{record.type == 5 ? "开户自营" : record.type == 6 ? "自营关闭" : "-"}</span>);
            }else{
                return (<span>{record.punlishBehavior == "1"?"资质造假":
                    record.punlishBehavior == "2"?"知识侵权":
                        record.punlishBehavior == "3"?"违规发布":
                            record.punlishBehavior == "4"?"恶意报价":
                                record.punlishBehavior == "5"?"围标串标":
                                    record.punlishBehavior == "6"?"扰乱秩序":
                                        record.punlishBehavior == "7"?"拒绝履约":
                                            record.punlishBehavior == "8"?"履约欺诈":
                                                record.punlishBehavior == "9"?"质量缺陷":
                                                    record.punlishBehavior == "10"?"服务怠慢":
                                                        record.punlishBehavior == "11"?"税务违规":"-"}</span>)
            }

        }

      },
      {
        title: '处理人',
        dataIndex: 'userName',
        key: 'userName',
          width: 160,
          render: (text, record) => {
              if(dataType == "employed") {
                  return (<span>{record.createUserName}</span>);
              }
            return text ? text : "-";
        }
      },
      {
        title: '处理原因',
        dataIndex: 'processingPersonReasons',
        key: 'processingPersonReasons',
          render: (text, record) => {
              if(dataType == "employed") {
                  return (<span>{record.remarks}</span>);
              }
            return text ? text : "-";
          }
      },
    ]
  }


  //获取违规记录
  getRecordOfStatus = (companyId) => {
      if(companyId){
          api.ajax('GET', '@/platform/ecCompanyViolation/getViolationListByCompanyId', {
              companyId
          }).then(r => {
              this.setState({
                  recordOfDeal: r.data
              })

          }).catch(r => {

          })
      }

  }

  getAdminInfo = (companyId) => {
    let _this = this;
    api.ajax('GET', '@/sso/ecUser/queryAdminInfoByCompanyId', {
      companyId
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        adminInfo: r.data
      })
    })
  }

  //澄清文件下载
  handleDownload = (id) => {

  }

  // 开通子平台
  handleOpenPlatform=(platform)=>{
    if(platform.spType != 7) {
      return;
    } else {
        if(platform.status == 3){
          Util.alert(platform.spName+'业务已开通,无需重复开通!');
          return;
        }
        this.setState({
          MySuppliersShow: true
        })
      /*if(platform.companyId == -1 && platform.approvalStatus == 1) {
        return;
      } else {

      }*/
      }
    }
  //展示图片
  handleShowImg = (imgList) => {
    if (imgList.length == 0) {
      Util.alert('暂无图片')
      return;
    }
    let photoElm = []

    let baseUrl = SystemConfig.configs.resourceUrl;
    imgList.map((item, i) => {
      photoElm.push(
        <Photo
          src={baseUrl + item}
          key={i}
        />,
      )
    })

    Album.show({
      photos: photoElm,
    });
  }

  cancelImgModal = () => {
    this.setState({
      imgModalShow: false
    })
  }

  imgModal = {
    onCancel: this.cancelImgModal
  }

  //获取公司类型
  getFactoryType = (type) => {
    let factoryType = "";
    switch (type) {
      case 1:
        factoryType = "厂家";
        break;
      case 2:
        factoryType = "贸易集成商";
        break;
      case 3:
        factoryType = "个体户";
        break;
    }
    return factoryType;
  }
  //发票类型
  getTaxType = (type) => {
    let taxType = [];
    let typeArr = type?type.split(','):[]
    if(typeArr.indexOf('1') != -1) {
      taxType.push(`增值税专用发票`);
    }
    if(typeArr.indexOf('2') != -1) {
      taxType.push(`增值税普通发票`);
    }
    return taxType.join();
  }
  //出口资质
  getExportQualification = (type) => {
    let exportQualification = "";
    switch (type) {
      case 1:
        exportQualification = "有出口资质";
        break;
      case 2:
        exportQualification = "无出口资质";
        break;
    }
    return exportQualification;
  }
  //证件类型
  getLegalPersonIdType = (type) => {
    let legalPersonIdType = "";
    switch (type) {
      case 1:
        legalPersonIdType = "身份证";
        break;
      case 2:
        legalPersonIdType = "护照";
        break;
      case 3:
        legalPersonIdType = "其他";
        break;
    }
    return legalPersonIdType;
  }
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14, offset: 1 },
  };

  //根据证件类型的不同初始化页面信息
  getLegalPersonId = (type) => {
    if (type == 1) {
      return (
        <Col span={12}>
          <BaseDetails title="法人身份证号码">
            {this.state.supplierInfo.legalPersonId}
          </BaseDetails>
        </Col>
      )
    } else {
      return (
        <Col span={12}>
          <BaseDetails title="法人护照号">
            {this.state.supplierInfo.legalPersonId}
          </BaseDetails>
        </Col>
      )
    }
  }
  getLegalPersonIdPage = (type) => {
    if (type == 1) {
      return (
        <Col span={12}>
          <BaseDetails title="身份证图片">
            {this.state.supplierInfo.legalPersonPath1
              ? '': '-'}
            <a href="javascript:void(0);" style={{display: this.state.supplierInfo.legalPersonPath1
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath1]))}>
                {this.state.supplierInfo.legalPersonIdType == 1 ? "查看正面":"查看影像"}</a>
            &nbsp;&nbsp;
            {this.state.supplierInfo.legalPersonPath2
              ? '': '-'}
            <a href="javascript:void(0);" style={{display: this.state.supplierInfo.legalPersonPath2
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath2]))}>查看反面</a>
          </BaseDetails>
        </Col>
      )
    } else {
      return (
        <Col span={12}>
          <BaseDetails title="护照图片">
          {this.state.supplierInfo.legalPersonPath1
              ? '': '-'}
            <a href="javascript:void(0);" style={{display: this.state.supplierInfo.legalPersonPath1
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath1]))}>查看</a>
          </BaseDetails>
        </Col>
      )
    }
  }

  //三证合一
  getThreeInOne = (type) => {
    let threeInOne = "";
    switch (type) {
      case "1":
        threeInOne = "三证合一";
        break;
      case "0":
        threeInOne = "未三证合一";
        break;
    }
    return threeInOne;
  }

  //根据有效期结束时间的值判断显示内容
  initDate = (start, end) => {
    if (end == 1) {
      if(!start) {
        return " -- 长期";
      }
      return moment(start).format("YYYY-MM-DD") + " -- 长期";
    } else {
      if(!start || !end) {
        return " -- ";
      }
      return moment(start).format("YYYY-MM-DD") + " -- " + moment(end).format("YYYY-MM-DD");
    }
  }

  //初始化注册资本显示数据
  initMoney = (money) => {
    if (money > 0) {
      return money + "万";
    } else {
      return "无";
    }
  }

  //初始化三证合一页面
  getThreeInOnePage = (type) => {
    if (type == "1") {
      return [
        <Row key="1">
          <Col span={12}>
            <BaseDetails title="营业执照号">
              {this.state.supplierInfo.businessLicense}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="执照有效期">
              {this.initDate(this.state.supplierInfo.businessStartTime, this.state.supplierInfo.businessEndTime)}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key="2">
          <Col span={12}>
            <BaseDetails title="公司所在地">
              {this.state.supplierInfo.areaStr}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="注册资本">
              {this.initMoney(this.state.supplierInfo.registeredCapital)}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key="3">
          <Col span={12}>
            <BaseDetails title="详细地址">
              {this.state.supplierInfo.address}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="营业执照图片">
            {this.state.supplierInfo.businessLicensePath
              ? '': '-'}
              <a href="javascript:void(0);" style={{display: this.state.supplierInfo.businessLicensePath
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.businessLicensePath]))}>点击查看</a>
            </BaseDetails>
          </Col>
        </Row>
      ]
    } else {
      return [
        <Row key="1">
          <Col span={12}>
            <BaseDetails title="营业执照号">
              {this.state.supplierInfo.businessLicense}
                <a href="javascript:void(0);" style={{display: this.state.supplierInfo.businessLicensePath
                        ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.businessLicensePath]))}>点击查看</a>

            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="营业执照图片">
            {this.state.supplierInfo.businessLicensePath
              ? '': '-'}
              <a href="javascript:void(0);" style={{display: this.state.supplierInfo.businessLicensePath
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.businessLicensePath]))}>点击查看</a>
            </BaseDetails>
          </Col>
        </Row>,
        <Row key="2">
          <Col span={12}>
            <BaseDetails title="执照有效期">
              {this.initDate(this.state.supplierInfo.businessStartTime, this.state.supplierInfo.businessEndTime)}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="公司所在地">
              {this.state.supplierInfo.areaStr}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key="5">
          <Col span={12}>
            <BaseDetails title="注册资本">
              {this.initMoney(this.state.supplierInfo.registeredCapital)}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="详细地址">
              {this.state.supplierInfo.address}
            </BaseDetails>
          </Col>
        </Row>
      ]
    }
  }
  //来黑企业/自然人
  handleBlack = (index) => {
    if (index == 1) {//自然人
      if (this.state.supplierTitle.blackPersonType == 0) {//未来黑
        this.setState({
          disposeShow: true,
          disposeIndex: 1
        })
      } else {//拉黑
        // this.setState({
        //   corporateBlackListShow: true
        // })
      }
    } else {//供应商
      if (this.state.supplierTitle.blackCompanyType == 0) {//未拉黑
        this.setState({
          disposeShow: true,
          disposeIndex: 2
        })
      } else {//拉黑
        // this.setState({
        //   supplierBlackListShow: true
        // })
      }
    }

  }

  //拉黑提交按钮事件
  setDispose = (formData) => {
    let _this = this;
    api.ajax("POST", "@/supplier/ecBlacklistCompany/save", {
      companyId: this.state.supplierInfo.companyId,
      ...formData,
      souce: 1
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
      let obj = {
        ...this.state.supplierTitle
      }
      if (this.state.disposeIndex == 1) {
        obj.blackPersonType = 1;
      } else {
        obj.blackCompanyType = 1;
      }
      this.setState({
        disposeShow: false,
        supplierTitle: obj
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }
  //供应商管理，取消按钮事件
  cancelDispose = () => {
    this.setState({
      disposeShow: false
    })
  }
  //处理弹框数据
  disposeModal = {
    onOk: this.setDispose,
    onCancel: this.cancelDispose
  }

  disposeFormList = () => {
    return {
      name: this.state.supplierInfo.name,
      legalPersonName: this.state.supplierInfo.legalPersonName,
      legalPersonId: this.state.supplierInfo.legalPersonId,
      businessLicense: this.state.supplierInfo.businessLicense
    }
  }

  //供应商黑名单移除操作
  saveSupplierBlacklist = (formData, effective = '2') => {
    let _this = this;
    let curE = "";
    if (effective == "1") {
      curE = 0;
    } else {
      curE = 1;
    }
    api.ajax("POST", "@/supplier/ecBlacklistCompany/blackMoveInOrRemove", {
      companyId: this.state.supplierInfo.companyId,
      uuids: this.state.supplierInfo.uuids,
      effective: curE,
      ...formData
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      if (effective == "1") {
        Util.alert(r.msg, { type: 'success' });
      } else {
        Util.alert(r.msg, { type: 'success' });
      }
      this.setState({
        supplierBlackListShow: false
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }
  //供应商黑名单取消
  cancelSupplierBlacklist = () => {
    this.setState({
      supplierBlackListShow: false
    })
  }

  supplierBlacklistModal = {
    onOk: this.saveSupplierBlacklist,
    onCancel: this.cancelSupplierBlacklist
  }

  saveCorporateBlacklist = (formData, effective = '2') => {
    let _this = this;
    let curE = "";
    if (effective == "1") {
      curE = 0;
    } else {
      curE = 1;
    }
    api.ajax("POST", "@/supplier/ecBlacklistCompany/blackMoveInOrRemove", {
      companyId: this.state.supplierInfo.companyId,
      uuids: this.state.supplierInfo.uuids,
      effective: curE,
      ...formData
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      if (effective == "1") {
        Util.alert(r.msg, { type: 'success' });
      } else {
        Util.alert(r.msg, { type: 'success' });
      }
      this.setState({
        corporateBlackListShow: false
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }
  cancelCorporateBlacklist = () => {
    this.setState({
      corporateBlackListShow: false
    })
  }
  CorporateBlacklistModal = {
    onOk: this.saveCorporateBlacklist,
    onCancel: this.cancelCorporateBlacklist
  }

  //评级
  evaluationFormList = () => {
    return [
      {
        label: "公司名称",
        value: this.state.supplierInfo.name
      }, {
        label: "法人姓名",
        value: this.state.supplierInfo.legalPersonName
      }, {
        label: "法人身份证号码",
        value: this.state.supplierInfo.legalPersonId
      }, {
        label: "营业执照号",
        value: this.state.supplierInfo.businessLicense
      }, {
        el: "SELECT",
        placeholder: "请选择评价类型",
        key: "rating",
        list: [
          {
            id: "3",
            value: "普通"
          },{
            id: "0",
            value: "青铜"
          }, {
            id: "1",
            value: "白银"
          }, {
            id: "2",
            value: "黄金"
          }
        ],
        label: "评价类型"
      }
    ]
  }
  saveEvaluation = (formData) => {
    let _this = this;
    api.ajax("POST", "@/supplier/ecCompanyEvaluation/save", {
      companyId: this.state.supplierInfo.companyId,
      ...formData
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
      let cur = {
        ...this.state.supplierTitle
      }
      cur.rating = formData.rating
      this.setState({
        evaluationShow: false,
        supplierTitle: cur
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.setState({
        evaluationShow: false,
      })
    })
  }
  cancelEvaluation = () => {
    this.setState({
      evaluationShow: false
    })
  }
  evaluationModal = {
    onOk: this.saveEvaluation,
    onCancel: this.cancelEvaluation
  }
  handleEvalution = () => {
    this.setState({
      evaluationShow: true
    })
  }

  //重置密码
  handleResetPwd = (item) => {
    let info = {};
    info.companyName = this.state.supplierInfo.name;
    if (!item) {//当item不存在的情况是管理员重置密码，存在的情况是子账号重置密码
      item = {
        ...this.state.adminInfo
      };
      if (!item.uuids) {
        Util.Alert('没有获得管理员信息', { type: 'error' });
        return;
      }
    }
    info.name = item.username;
    info.phone = item.phone;
    info.email = item.email;
    info.uuids = item.uuids;
    this.setState({
      resetPwdShow: true,
      resetPwdInfo: info
    })
  }
  
  ResetPwd = () => {
    let _this = this;
    api.ajax('GET', '@/sso/loginControl/resetPwd', {
      uuids: this.state.resetPwdInfo.uuids
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
      this.getUseSubPlatformList(this.state.supplierInfo.companyId);
      this.setState({
        resetPwdShow: false
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.setState({
        resetPwdShow: false
      })
    })
  }
  cancelResetPwd = () => {
    this.setState({
      resetPwdShow: false
    })
  }

  resetPwdModal = {
    onOk: this.ResetPwd,
    onCancel: this.cancelResetPwd
  }

  handleResetSubAdminPwd = (uuids,phone) => {
    let _this = this;
    confirm({
      title: `确认重置密码吗？`,
      content:`密码将随机生成并以短信形式发送至号码为 ${phone} 的手机上。`,
      onOk() {
        _this.resetPwdSubmit(uuids)
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }
  
  resetPwdSubmit = (uuids) => {
    api.ajax('GET', '@/sso/loginControl/resetPwd', {
      uuids
    }).then(r => {
      Util.alert(r.msg, { type: 'success' })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' })
    })
  }
  
  // 重置管理员按钮事件
  openModal = (modalName, show = false, isSuccess = false) => {
    const id = this.props.match.params.id;
    this.getSupplierDetails(id);
    if (isSuccess) {
      this.getAdminInfo(this._companyId);
    }
    this.setState({
      [modalName]: show
    })
  }

  // 重置管理员按钮事件
  openReSubAdminModal = (modalName, subPlatformId, show = false, isSuccess = false) => {
    this.setState({
      subPlatformId: subPlatformId,
	  [modalName]: show
    })
  }

  initSelectUser = (value) => {
    this.state.supplierUsersInfo.forEach((o, i) => {
      if (o.id == value) {
        this.setState({
          userInfo: o
        })
      }
    })
  }
  getUserList = () => {
    let listArray = [];
    this.state.supplierUsersInfo.forEach((o, i) => {
      let curObj = {};
      curObj.id = o.id;
      curObj.value = o.username;
      listArray.push(curObj);
    })
    return listArray;
  }
  resetAdminFormList = () => {
    return [
      {
        label: "公司名称",
        value: this.state.supplierInfo.name
      }, {
        el: "SELECT",
        label: "管理员姓名",
        placeholder: "请选择管理员",
        key: "type",
        list: this.getUserList()
      }, {
        label: "管理员手机号",
        value: this.state.userInfo.phone
      }, {
        label: "管理员邮箱",
        value: this.state.userInfo.email
      }, {
        el: "UPLOAD",
        label: "确认文件",
        props: {
          name: 'file',
          action: 'http://localhost:3001/upload'
        }
      }
    ]
  }

  renderFactoryType=(factoryType)=>{
    if(factoryType==1){
      return <span title="生产制造型企业">产</span>
    }else if(factoryType==2){
      return <span title="贸易销售型企业">贸</span>
    }else if(factoryType==3){
      return <span title="个体工商户">个</span>
    }else{
      return null
    }
  }

  //渲染评价数据
  renderRating = (rating) => {
      return <span>{rating == '0' ? '铜' : rating == '1' ? '银' : rating == '2' ? '金' : '普'}</span>

  }

  /**
   * portal modal弹窗
   * @returns {*}
   */
  //关闭 portal  modal方法
  closePortalModal=()=>{
    this.setState({
      portalVisible: false,
      portalLoading: false
    });
  }
  //显示弹窗modal
  showBannerModal=()=>{
    this.setState({
      portalVisible: true

    });
  }

  //确定按钮
  handlePortalOk=()=>{
    //调用保存方法
    this.savePortalData();
  }

  //返回按钮
  handlePortalCancel=(e)=>{
    this.closePortalModal();
  }

  //点击开关按钮的change事件
  clickStoreStatus=()=>{
    let {status, punlishDays} = this.state;
    if(status){
      status = false;
    }else{
      status = true;
      punlishDays = null;
    }
    this.setState({
      status, punlishDays
    })
  }

  //门户封停日期选择
  punishDateChange=(val)=>{
      this.setState({
          punlishDays: val
      })
  }

  //提交门户审核
  savePortalData=()=>{
    let status = this.state.status;
    let storeStatus = this.state.storeStatus;
    if(status == storeStatus){
      Util.alert('未发生更改');
      return;
    }else{
      let _this = this;
      confirm({
        title: '确认提交',
        content: '确认提交当前内容吗？',
        onOk() {
          //保存
          _this.submitPortalData();
        },
        onCancel() {
          Util.alert('已取消操作');
        },
      });
    }
  }

  //查看供应商门户
  toStorePage = (id)=>{
    if(id){
      api.ajax(
          'GET',
          '@/portal/ecPortal/getPortalByCompanyId',
          {companyId:id}
      ).then(
          r=>{
            let portal = r.data;
            if(portal){
              let uuids = portal.uuids;
              let url = "/portal/"+uuids+"/homeStore";
              // this.props.history.push(url);
              window.open(systemConfigPath.jumpCrccmallPage(url));
            }else{
              Util.alert("该商家未发布门户，无法访问。");
            }
          }
      ).catch(
          r=>{
            Util.alert("该商家未发布门户，无法访问。");
          }
      )
    }
  }

  //保存当前的门户开启状态
  submitPortalData=()=>{
     let params = {};
    //转圈
    this.setState({
      portalLoading: true
    })
    //  companyId status remarks
    params.companyId = this._companyId;
    let status = this.state.status==true?'0':'1';
    let remarks = $("#remarks").val();
    let tempFlag = this.checkFieldRequire(remarks);
    if(!tempFlag){
      //暂时注掉，要放开的
      this.setState({
        portalLoading: false
      })
      //将当前的val设置为''
      $("#remarks").val('');
      Util.alert("处理原因不能为空！");
      return;
    }

    params.remarks = remarks;
    params.status = status;

    //如果是门户关闭，需校验当前选择的关闭时间
    if(status == '1'){
        let punlishDays = this.state.punlishDays;
        if(punlishDays == '' || punlishDays == null || punlishDays == undefined){
            //暂时注掉，要放开的
            this.setState({
                portalLoading: false
            })
            Util.alert("请选择关闭的时间！");
            return;
        }else{
            params.punlishDays = punlishDays;
        }
    }

    //查询门户记录的店铺uuids
    let uuids = this._uuids;

    //校验当前处理原因是否填写
    if(this.checkFieldRequire(remarks)){
      api.ajax(
          'POST',
          '@/portal/ecStore/setStoreStatus',
          {...params}
      ).then(
          r=>{
            Util.alert("保存成功！");
            //将当前的门户审核的理由置空
            this.setState({
              portalLoading: false,
              remarks:''
            })
            //设置详情页面中的当前门户的显示和关闭modal
            let storeStatus = this.state.storeStatus;
            let companyStatus = this.state.companyStatus;
            let blackCompanyType = this.state.supplierTitle.blackCompanyType;
            let blackPersonType = this.state.supplierTitle.blackPersonType;
            let goodsStatus = this.state.goodsStatus;

            if(status == 0){
              storeStatus = true;
              companyStatus = 0;
            }else{    //店铺关闭
              storeStatus = false;
              companyStatus = 1;
            }
            if(blackCompanyType == 1 || blackPersonType == 1 || goodsStatus == false){
              companyStatus = 1;
            }
            this.setState({
              storeStatus,
              companyStatus
            })
            //刷新门户当前的记录
            this.getRecordOfViolation(uuids);
            this.closePortalModal();
          }
      ).catch(
          r=>{
            Util.alert(r.msg, { type: "error" });
            return;
          }
      )
    }else{
      this.setState({
        portalLoading: false
      })
    }
  }

  //校验字段是否填写
  checkFieldRequire=(str)=>{
    if(str == '' || str == undefined || str == null) return false;
    if(str.trim() == '') return false;
    return true;
  }

  //1 显示自营弹窗
  showEmployedModal=(type)=>{
    this.setState({
      employedVisible: true
    })
  }

  //2 关闭自营弹窗
  handleEmployedCancel=()=>{
    this.setState({
      employedVisible: false
    })
  }

  //3 自营弹窗ok
  handleEmployedOk=()=>{
    this.saveEmployedData();
  }

  //4 自营弹窗点击开关按钮的change事件
  clickEmployedStatus=()=>{
    let employedStatus = this.state.employedStatus;
    if(employedStatus){
      employedStatus = false;
    }else{
      employedStatus = true;
    }
    this.setState({
      employedStatus
    })
  }

  //提交自营管理
  saveEmployedData=()=>{
    //判断下是否更改状态
    let employed = this.state.employed;
    let employedStatus = this.state.employedStatus;
    if(employed == employedStatus){
      Util.alert('未发生更改');
      return;
    }else{
      //转圈
      /*this.setState({
        employedLoading: true
      })*/
      let _this = this;
      confirm({
        title: '确认提交',
        content: '确认提交当前内容吗？',
        onOk() {
          //保存
          _this.submitEmployedInfo();
        },
        onCancel() {
          Util.alert('已取消操作');
          //取消转圈
          /*this.setState({
            employedLoading: false
          })*/
        },
      });
    }
  }

  //5 自营信息修改提交方法
  submitEmployedInfo=()=>{
    let uuids = this._uuids;
    let companyId = this._companyId;
    let employed = this.state.employed;
    let tempEmployedStatus = this.state.employedStatus;
    employed = tempEmployedStatus;
    //加载中
    this.setState({
      employedLoading: true
    })
    let employedStatus = tempEmployedStatus == true?'0':'1';
    let employedRemarks = $("#employedRemarks").val();
    if(this.checkFieldRequire(employedRemarks)){
      let params = {
        employedStatus,
        employedRemarks,
        companyId
      }
      api.ajax(
          'POST',
          '@/portal/ecStore/updateStoreEmployed',
          {
            employedStatus,
            employedRemarks,
            companyId
           }
      ).then(
          r=>{
            //刷新下当前的列表
            this.getRecordOfStatus(companyId, 'employed');
            Util.alert("保存成功！");
            //取消加载中，关闭弹窗,将审核理由置空
            this.setState({
              employedLoading: false,
              employedVisible: false,
              employed,
              employedRemarks:''
            })
          }
      ).catch(
          r=>{
            //取消加载中，关闭弹窗
            this.setState({
              employedLoading: false
            })
            Util.alert(r.msg, { type: "error" });
            return;
          }
      )
    }else{
        //取消加载
        this.setState({
          employedLoading: false
        })
        //将当前的val设置为''
        $("#employedRemarks").val('');
        Util.alert("处理原因不能为空！");
        return;
    }
  }


   /**
   * 商品管理开关
   * @returns {*}
   */
  //关闭 goods  modal方法
  closeGoodsModal=()=>{
    this.setState({
      goodsVisible: false,
      goodsLoading: false
    });
  }
  //显示弹窗modal
  showGoodsModal=()=>{
    this.setState({
      goodsVisible: true

    });
  }

  //确定按钮
  handleGoodsOk=()=>{
    //调用保存方法
    this.saveGoodsData();
  }

  //返回按钮
  handleGoodsCancel=(e)=>{
    this.closeGoodsModal();
  }

  //商品弹窗点击开关按钮的change事件
  clickGoodsStatus=()=>{
    let {tempGoodsStatus, punlishDays} = this.state;
    if(tempGoodsStatus){
      tempGoodsStatus = false;
    }else{
      tempGoodsStatus = true;
      punlishDays = null;
    }
    this.setState({
      tempGoodsStatus,
      punlishDays
    })
  }

  //提交商品管理
  saveGoodsData=()=>{
    let goodsStatus = this.state.goodsStatus;
    let tempGoodsStatus = this.state.tempGoodsStatus;
    if(goodsStatus == tempGoodsStatus){
      Util.alert('未发生更改');
      return;
    }else{
      //转圈
      /*this.setState({
        goodsLoading: true
      })*/
      let _this = this;
      confirm({
        title: '确认提交',
        content: '确认提交当前内容吗？',
        onOk() {
          //保存
          _this.submitGoodsInfo();
        },
        onCancel() {
          //取消转圈
          // _this.closeGoodsModal();
          Util.alert('已取消操作');
        },
      });
    }
  }
  //商品管理的保存方法
  submitGoodsInfo=()=>{
    let uuids = this._uuids;
    let companyId = this._companyId;
    let goodsStatus = this.state.goodsStatus;
    let tempGoodsStatus = this.state.tempGoodsStatus;
    //公司状态,法人黑名单,企业黑名单,自营状态
    let companyStatus = this.state.companyStatus;
    let blackCompanyType = this.state.blackCompanyType;
    let blackPersonType = this.state.blackPersonType;
    let storeStatus = this.state.storeStatus;

    goodsStatus = tempGoodsStatus;
    let goodsSwitch = tempGoodsStatus == true?'0':'1';
    let goodsRemarks = $("#goodsRemarks").val();
    let punlishDays = this.state.punlishDays;
    if(this.checkFieldRequire(goodsRemarks)){
      //转圈
      this.setState({
        goodsLoading: true
      })
      api.ajax(
          'POST',
          '@/portal/ecStore/updateStoreGoodsStatus',
          {
            goodsSwitch,
            goodsRemarks,
            companyId,
            punlishDays
          }
      ).then(
          r=>{
            if(goodsSwitch == 0){
              companyStatus = 0;
            }else{
              companyStatus = 1
            }
            //更新下当前的总状态字段
            if(blackCompanyType == 1 || blackPersonType == 1 || storeStatus == false){  //当黑名单为关闭，整体状态也是异常的
              companyStatus = 1;
            }
            //刷新下当前的列表
            this.getRecordOfStatus(companyId, 'goods');
            Util.alert("保存成功！");
            //修改当前商品管理的状态
            this.setState({
              goodsLoading: false,
              goodsVisible: false,
              goodsStatus,
              companyStatus,
              goodsRemarks:''
            })
          }
      ).catch(
          r=>{
            //取消加载中
            this.setState({
              goodsLoading: false
            })
            Util.alert(r.msg, { type: "error" });
            return;
          }
      )
    }else{
      //取消加载
      this.setState({
        goodsLoading: false
      })
      //将当前的val设置为''
      $("#goodsRemarks").val('');
      Util.alert("处理原因不能为空！");
      return;
    }
  }


  /**
   * 交易管理开关
   * @returns {*}
   */
    closeDealModal=()=>{
    this.setState({
      dealVisible: false,
      dealLoading: false
    });
  }
  //显示弹窗modal
  showDealModal=()=>{
    // Util.alert("交易开关功能暂未开通，敬请期待！"); return;
    this.setState({
      dealVisible: true

    });
  }

  //确定按钮
  handleDealOk=()=>{

    //校验当前的处理结果是否变更
    let dealStatus = this.state.dealStatus;
    let tempDealStatus = this.state.tempDealStatus;
    if(dealStatus == tempDealStatus){
      Util.alert("未发生更改！");
      return;
    }

    //校验是否填写的当前的处理原因  dealRemarks
    let dealRemarks = $("#dealRemarks").val();
    if(!this.checkFieldRequire(dealRemarks)){ //未填写处理原因
      //将当前的val设置为''
      $("#dealRemarks").val('');
      Util.alert("处理原因不能为空！");
      return;
    }
    //调用保存方法
    this.saveDealData();
  }

  //返回按钮
  handleDealCancel=(e)=>{
    this.closeDealModal();
  }

  //交易弹窗点击开关按钮的change事件
  clickDealStatus=()=>{
    let {tempDealStatus, punlishDays} = this.state;
    if(tempDealStatus){
      tempDealStatus = false;
    }else{
      tempDealStatus = true;
      punlishDays = null;
    }
    this.setState({
      tempDealStatus,
      punlishDays
    })
  }

  //提交交易管理
  saveDealData=()=>{
    let _this = this;
    //转圈
    /*this.setState({
      dealLoading: true
    })*/
    confirm({
      title: '确认提交',
      content: '确认提交当前内容吗？',
      onOk() {
        //保存
        _this.submitStoreDealStatus();
        // console.log("保存交易管理的更改")
        // _this.closeDealModal();
      },
      onCancel() {
        Util.alert('已取消操作');
        _this.closeGoodsModal();
      },
    });
  }

  //交易管理的保存方法
  submitStoreDealStatus=()=>{
    let uuids = this._uuids;
    let companyId = this._companyId;
    let dealStatus = this.state.dealStatus;
    let tempDealStatus = this.state.tempDealStatus;
    //公司状态,法人黑名单,企业黑名单,自营状态,商品状态
    let companyStatus = this.state.companyStatus;
    let blackCompanyType = this.state.blackCompanyType;
    let blackPersonType = this.state.blackPersonType;
    let storeStatus = this.state.storeStatus;
    let goodsStatus = this.state.goodsStatus;

    dealStatus = tempDealStatus;
    let dealSwitch = tempDealStatus == true?'0':'1';
    let dealRemarks = $("#dealRemarks").val();
    let punlishDays = this.state.punlishDays;
    if(this.checkFieldRequire(dealRemarks)){
      //转圈
      this.setState({
        dealLoading : true
      })
      api.ajax(
          'POST',
          '@/portal/ecStore/updateStoreDealStatus',
          {
            dealSwitch,
            dealRemarks,
            companyId,
            punlishDays
          }
      ).then(
          r=>{
            if(dealSwitch == 0){
              companyStatus = 0;
            }else{
              companyStatus = 1
            }
            //更新下当前的总状态字段
            if(blackCompanyType == 1 || blackPersonType == 1 || storeStatus == false || goodsStatus == false){  //当黑名单为关闭，整体状态也是异常的
              companyStatus = 1;
            }
            //刷新下当前的列表
            this.getRecordOfStatus(companyId, 'deal');
            Util.alert("保存成功！");
            //修改当前交易管理的状态
            this.setState({
              dealLoading: false,
              dealVisible: false,
              dealStatus,
              companyStatus,
              dealRemarks:''
            })
          }
      ).catch(
          r=>{
            //取消加载中
            this.setState({
              dealLoading: false
            })
            Util.alert(r.msg, { type: "error" });
            return;
          }
      )
    }else{
      //取消加载
      this.setState({
        goodsLoading: false
      })
      //将当前的val设置为''
      $("#goodsRemarks").val('');
      Util.alert("处理原因不能为空！");
      return;
    }
  }

  onChange=(event,name,isNumber=null)=>{
    //进行限制
    if(isNumber){
      if(event.target.value){
        // event.target.value = event.target.value.replace(/[^\d]/g,'');
        if (event.target.value.length == 1) {
          event.target.value = event.target.value.replace(/[^1-9]/g, '');
        } else {
          event.target.value = event.target.value.replace(/\D/g, '');
        }
        if(event.target.value > 999999999)
          event.target.value = 999999999
      }
    }
    this.state[name] = event.target.value;
    this.setState(this.state);
  }

  // 查看企业资质
  companyInfomation=()=>{
    window.open(systemConfigPath.jumpCrccmallPage('/qualification/basicInfomation?companyName='+this.state.adminInfo.companyName));
  }

  onRefStatistics=(ref)=>{
    this.childStatistics = ref;
  }

  resetInputRef = (ref)=>{
    this.searchInputRef=ref;
  }

   //搜索关键词改变时
   keyWordsOnChange = (value)=>{
    this.setState({goods_keywords:value});
  }

  changeTabs=(key)=>{
    if(key == 5) {
      this.queryUserPageByCompanySub(this._companyId, {});
    }
    if(key == 13) {
      this.queryOrgPageByCompanySub(this._companyId, {});
    }
    this.setState({
      projectStatus:[],
      projectType:[],
      querysort:'',
      order:'',
      navPlatformsId: ''
    })
  }
// 查看资金账户
    openDetails = () =>{
        let companyId=this._companyId;
        this.props.history.push('/financialCenter/capitalAccount/details/'+ companyId );
    };



    //-------------------- 修改公司标签  start ---------------------

    //查询该公司的标签
    queryCompanylabel=(companyId)=>{
        api.ajax(
            'GET',
            '@/platform/ecCompanyLabel/getCompanyLabelByCompanyId',
            {
                companyId,
                subId: 3
            }
        ).then(r=>{
            //处理标签展示
            this.setState({
                companyLabel: r.data
            })

        }).catch(r=>{
            // console.log('queryCompanylabel catch ----------------- ', r);
            Util.alert(r.msg, {type : 'error'})
        })
    }

    //标签展示方法
    showCompanyLabel = (companyLabel) => {
        if(!companyLabel || companyLabel.length <=0 ) return;
        let _this = this;
        let _list = [];
        companyLabel.map((item, index)=>{
            let classO = less.spangrany;
            if(item.labelState == 0)
                classO = '';
            if(item.isManual == 0){     //自动状态展示标签
                _list.push(
                    <span className={classO} title={item.labelName}>{item.labelSimpleName}</span>
                )
            }else{      //手动状态展示标签
                _list.push(
                    <span id={index} className={classO} title={item.labelName} onClick={_this.clickCompanyLabel.bind(_this, item)} >{item.labelSimpleName}</span>
                )
            }
        })
        return _list;
    }

    //标签点击事件
    clickCompanyLabel = (label) => {
        this.setState({
            companyLabelObj: label,
            companyLabelVisible: true,
            companyLabelStatus: label.labelState==0 ? true : false
        })
    }

    //标签修改弹窗关闭事件
    closeCompanyLabel = () => {
        //清空理由
        $("#labelRemarks").val('')
        this.setState({
            companyLabelObj: {},
            companyLabelVisible: false,
            companyLabelStatus: false,
            companyLabelLoading: false
        })
    }

    //标签状态改变
    clickCompanyLabelStatus = () =>{
        let companyLabelStatus = this.state.companyLabelStatus;
        if(companyLabelStatus){
            companyLabelStatus = false;
        }else{
            companyLabelStatus = true;
        }
        this.setState({
            companyLabelStatus
        })
    }

    //标签修改确定按钮
    companyLabelOk = () => {
        //
        this.setState({
            companyLabelLoading: true
        })
        //选择的状态
        let {companyLabelObj, companyLabelStatus} = this.state;
        //判断状态是否发生更改
        let _status = companyLabelStatus == true ? 0 : 1;
        if(_status == companyLabelObj.labelState){      //状态未发生更改
            Util.alert("状态未发生更改！");
            this.setState({
                companyLabelLoading: false
            })
            return;
        }

        //获取理由
        let labelRemarks = $("#labelRemarks").val();
        if(!this.checkFieldRequire(labelRemarks)){
            Util.alert("请填写理由！");
            this.setState({
                companyLabelLoading: false
            })
            return;
        }
        let companyId = this._companyId;
        let _this = this;
        confirm({
            title: '确认提交',
            content: '确认提交当前内容吗？',
            onOk() {
                //保存
                api.ajax(
                    'POST',
                    '@/platform/ecCompanyLabel/operationCompanyLabel',
                    {
                        companyId: companyId,
                        subId: 3,
                        labelId: companyLabelObj.labelId,
                        labelState: _status,
                        reason: labelRemarks,
                        companyLabelUuids: companyLabelObj.companyLabelUuids
                    }
                ).then(r=>{
                    //保存成功
                    Util.alert('操作成功！', {type: 'success'});
                    //关闭弹窗
                    _this.closeCompanyLabel();
                    //重新查询当前的标签
                    _this.queryCompanylabel(companyId);
                    //查询自营设置修改记录
                    _this.getRecordOfEmployed(_this._uuids, 1, 10);
                }).catch(r=>{
                    Util.alert(r.msg, {type : 'error'})
                    _this.setState({
                        companyLabelLoading: false
                    })
                })
            },
            onCancel() {
                Util.alert('已取消操作');
            },
        });

        //如果是修改自营，手动调用修改自营请求
        if(companyLabelObj.labelId == 4){
            _this.syncEmployedStatus(companyId, _status, labelRemarks)
        }
    }

    // 同步自营信息修改提交方法
    syncEmployedStatus=(companyId, employedStatus, employedRemarks)=>{
        api.ajax(
            'POST',
            '@/portal/ecStore/updateStoreEmployed',
            {
                employedStatus,
                employedRemarks,
                companyId
            }
        ).then(r=>{}).catch(r=>{
            // console.log('syncEmployedStatus catch ------------ ', r)
            Util.alert(r.msg, {type : 'error'})
        })
    }

    //-------------------- 修改公司标签  end ---------------------

    //-----------修改公司开关  start ------------------------

    //查询当前店铺的开关状态
    queryStoreSwitchStatus = (companyId) => {
        if(!companyId)
            return

        api.ajax(
            'GET',
            '@/portal/ecStore/queryStoreSwitchStatus',
            {companyId}
        ).then(r=>{
            this.setState({
                storeSwitch: r.data
            })
        }).catch(r=>{
            // console.log('queryStoreSwitchStatus --------------- ', e)
            //Util.alert('店铺开关状态查询失败，请刷新页面！')
            return;
        })

    }

    //编辑店铺状态的弹窗
    showStoreSwitchModel=(switchType)=>{
        // console.log('showStoreSwitchModel ------------------ ', switchType)
        let status = this.getSwitchStatusByName(switchType);
        this.setState({
            storeSwitchVisible: true,
            currentSwitchName: switchType,
            currentStoreSwitchStatus: status == 0 ? true : false,
            punlishDays: null
        })
    }

    //返回按钮
    closeStoreSwitchModal=()=>{
        $('#remarks').val('');
        this.setState({
            storeSwitchVisible: false,
            currentSwitchName: null,
            currentStoreSwitchStatus: false,
            storeStatusLoading: false,
            punlishDays: null
        })
    }

    //点击开关按钮的change事件
    clickStoreSwitchStatus=()=>{
        let {currentStoreSwitchStatus, punlishDays} = this.state;
        if(currentStoreSwitchStatus){
            currentStoreSwitchStatus = false;
        }else{
            currentStoreSwitchStatus = true;
            punlishDays = null;
        }
        this.setState({
            currentStoreSwitchStatus, punlishDays
        })
    }

    //通过名称获取对应的开关状态
    getSwitchStatusByName=(name)=>{
        let {storeSwitch} = this.state;
        switch (name) {
            case '门户':
                return storeSwitch.status
            case '商品':
                return storeSwitch.goodsSwitch
            case '交易':
                return storeSwitch.dealSwitch
            case '登录':
                return storeSwitch.loginSwitch
            case '提现':
                return storeSwitch.moneySwitch
            default:
                return null;
        }
    }

    //开关确定的按钮
    handleSwitchOk = () => {
        let params = {};
        //
        this.setState({
            storeStatusLoading: true
        })
        //
        let {currentSwitchName, currentStoreSwitchStatus} = this.state;
        let _status = currentStoreSwitchStatus == true ? 0 : 1;
        //原状态
        let oldStatus = this.getSwitchStatusByName(currentSwitchName);
        if(_status == oldStatus){
            Util.alert("状态未发生更改！");
            this.setState({
                storeStatusLoading: false
            })
            return;
        }
        let remarks = $('#remarks').val();
        if(!this.checkFieldRequire(remarks)){
            Util.alert("请填写理由！");
            this.setState({
                storeStatusLoading: false
            })
            return;
        }
        let companyId = this._companyId;
        let _this = this;

        confirm({
            title: '确认提交',
            content: '确认提交当前内容吗？',
            onOk() {
                // console.log('1111--------------- ', currentSwitchName)
                if(currentSwitchName == '门户'){
                    _this.savePortalSwitch(companyId, _status, remarks);
                }else if(currentSwitchName == '商品'){
                    _this.saveGoodsSwitch(companyId, _status, remarks);
                }else{
                    _this.saveStoreSwitch(companyId, _status, remarks, currentSwitchName);
                }

            },
            onCancel() {
                Util.alert('已取消操作');
            },
        });
    }


    //保存当前的门户开启状态
    savePortalSwitch=(companyId, status, remarks, )=>{
        // console.log('  ----------------- ' )
        let params = {companyId, remarks, status};

        //如果是门户关闭，需校验当前选择的关闭时间
        if(status == '1'){
            let {punlishDays} = this.state;
            if(punlishDays == '' || punlishDays == null || punlishDays == undefined){
                //暂时注掉，要放开的
                this.setState({
                    storeStatusLoading: false
                })
                Util.alert("请选择关闭的时间！");
                return;
            }else{
                params.punlishDays = punlishDays;
            }
        }

        //查询门户记录的店铺uuids
        let uuids = this._uuids;
        let _this = this;
        //校验当前处理原因是否填写
        if(_this.checkFieldRequire(remarks)){
            api.ajax(
                'POST',
                '@/portal/ecStore/setStoreStatus',
                {...params}
            ).then(
                r=>{
                    Util.alert("保存成功！");
                    //刷新开关
                    _this.queryStoreSwitchStatus(companyId);
                    //刷新门户当前的记录
                    _this.getRecordOfViolation(uuids);
                    _this.closeStoreSwitchModal();
                }
            ).catch(r=>{
                Util.alert(r.msg, { type: "error" });
                return;
            })
        }else{
            this.setState({
                storeStatusLoading: false
            })
        }
    }

    //商品管理的保存方法
    saveGoodsSwitch=(companyId, goodsSwitch, goodsRemarks )=>{
        let params = {companyId, goodsSwitch, goodsRemarks};
        //如果是商品关闭，需校验当前选择的关闭时间
        if(goodsSwitch == '1'){
            let {punlishDays} = this.state;
            if(punlishDays == '' || punlishDays == null || punlishDays == undefined){
                this.setState({
                    storeStatusLoading: false
                })
                Util.alert("请选择关闭的时间！");
                return;
            }else{
                params.punlishDays = punlishDays;
            }
        }
        //查询门户记录的店铺uuids
        let uuids = this._uuids;
        let _this = this;
        if(this.checkFieldRequire(goodsRemarks)){
            api.ajax(
                'POST',
                '@/portal/ecStore/updateStoreGoodsStatus',
                {...params}
            ).then(
                r=>{
                    Util.alert("保存成功！");
                    //刷新开关
                    _this.queryStoreSwitchStatus(companyId);
                    //刷新下当前的列表
                    _this.getRecordOfStatus(companyId, 'goods');
                    _this.closeStoreSwitchModal();
                }
            ).catch(
                r=>{
                    // console.log('saveGoodsSwitch  catch --------------- ', r)
                    Util.alert(r.msg, { type: "error" });
                    this.setState({
                        storeStatusLoading: false
                    })
                    return;
                }
            )
        }else{
            //取消加载
            this.setState({
                storeStatusLoading: false
            })
        }
    }

    //保存交易、提现、登录
    saveStoreSwitch=(companyId, status, remarks, statusType )=>{
        // console.log('saveStoreSwitch ----------------- ' )
        let params = {companyId, status, remarks, statusType};

        //如果是状态关闭，需校验当前选择的关闭时间
        if(status == '1'){
            let {punlishDays} = this.state;
            if(punlishDays == '' || punlishDays == null || punlishDays == undefined){
                //暂时注掉，要放开的
                this.setState({
                    storeStatusLoading: false
                })
                Util.alert("请选择关闭的时间！");
                return;
            }else{
                params.punlishDays = punlishDays;
            }
        }

        //查询门户记录的店铺uuids
        let uuids = this._uuids;
        let _this = this;
        //校验当前处理原因是否填写
        if(_this.checkFieldRequire(remarks)){
            api.ajax(
                'POST',
                '@/portal/ecStore/updateStoreSwitch',
                {...params}
            ).then(
                r=>{
                    Util.alert("保存成功！");
                    //刷新开关
                    _this.queryStoreSwitchStatus(companyId);
                    //刷新门户当前的记录
                    _this.getRecordOfViolation(uuids);
                    _this.closeStoreSwitchModal();
                }
            ).catch(r=>{
                Util.alert(r.msg, { type: "error" });
                return;
            })
        }else{
            this.setState({
                storeStatusLoading: false
            })
        }
    }
    //-----------修改公司开关  end ------------------------

    //-----------------处罚 start---------------------------
    openViolation = () => {
        this.setState({
            violationModalShow: true
        })
    }

    violationFormList = () => {
        return {
            companyId: this.state.supplierInfo.companyId,
            companyName: this.state.supplierInfo.name,
            bussinessLisence: this.state.supplierInfo.businessLicense,
            companyUUIDS:this.state.supplierInfo.uuids
        }
    }

    //供应商管理，取消按钮事件
    cancelDispose = () => {
        this.setState({
            violationModalShow: false
        })
    }


    //处罚提交按钮事件
    setViolation = (formData) => {
        //提交
        this.setState({
            vioLoading:true
        })
        api.ajax("POST", "@/platform/ecCompanyViolation/save", {
            ...formData,
        }).then(r => {
            Util.alert(r.msg, {type: 'success'})
            //刷新开关
            this.queryStoreSwitchStatus(formData.companyId);
            this.setState({
                violationModalShow: false,
                vioLoading: false
            })
        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
            this.setState({
                vioLoading: false
            })
        })
    }
    //-----------------处罚 end---------------------------

    showRecordTable = (typeName) =>{
        console.log('===========',(typeName == "自营"),typeName)
        if(typeName == "自营"){
            return (<div style={{margin:"10px 0px"}}>
                <div key={1}>变更记录</div>
                <div key={2}>
                    <Table
                        {...ComponentDefine.table_}
                        pagination={{total:this.state.employedTotal,onChange:(page, pageSize)=>{this.getRecordOfEmployed(this._uuids,page, pageSize);}}}
                        columns={this.RecordOfEmployedColumns('employed')}
                        loading={this.loading}
                        dataSource={this.state.recordOfEmployed}></Table>
                </div>
            </div>);
        }
        return "";
    }


    //获取修改记录 自营employed
    getRecordOfEmployed = (uuids,page, pageSize) => {
        pageSize = pageSize?pageSize:10;
        api.ajax('GET', '@/supplier/ecCompanyViolation/storeRecordPage', {
            uuids: uuids,types: 'employed',page,rows:pageSize
        }).then(r => {
            this.setState({
                recordOfEmployed: r.data.rows,
                employedTotal: r.data.total
            })
        }).catch(r => {

        })
    }

    //查询备注记录
    queryCompanyRecord = (companyId) => {
        api.ajax('GET', '@/platform/ecCompanyInfoSupplier/getCompanyInfoByCompanyId', {
            companyId
        }).then(r => {
            $('#record').val(r.data);//this.props.form.setFieldsValue({"record": r.data});
        }).catch(r => {
        });
    }
    //更新备注
    updateCompanyRecord = () => {
        let companyId = this._companyId;
        let record = $('#record').val();
        api.ajax('GET', '@/platform/ecCompanyInfoSupplier/updateCompanyInfoByCompanyId', {
            companyId,
            record
        }).then(r => {
            Util.alert("保存成功！");
        }).catch(r => {
        });
    }

  render() {
    // let {useSubPlatformList, accountVisible, accountObj, projectVisible, projectObj} = this.state;
    let {useSubPlatformList, accountVisible, accountObj, projectVisible, projectObj,
      companyLabel, companyLabelObj, companyLabelVisible, companyLabelLoading, storeSwitch, storeSwitchVisible, currentSwitchName} = this.state;
    const accountInfo = this.state.adminInfo;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div>
        {/* 项目信息查看 */}
        <div>
          <Modal title={"查看项目信息"} visible={projectVisible}
                 onCancel={this.handleProjectCancel}
                 width={"800px"}
                 footer={[
                   <Button key="back" type="ghost" size="large" onClick={this.handleProjectCancel}>关闭</Button>
                 ]}
          >
            <div>
              <div>
                <Row>
                  <Col span={24}>
                    <BaseDetails title="项目名称">
                      {projectObj.organizationName}
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="类型">
                      {projectObj.type == 0 ? "部门" : projectObj.type == 1 ? "项目" : "-"}
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="编号">
                      {projectObj.organizationNo?projectObj.organizationNo:'-'}
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="共享中心编号">
                      {projectObj.orgId?projectObj.orgId:'-'}
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="工程类型">
                      {projectObj.projectType
                        ?this.state.projectTypeArr.map((projectType) => {
                          return projectObj.projectType==projectType.value?<p className="ant-form-text">{projectType.text}</p>:null
                        })
                        :<p className="ant-form-text">-</p>
                      }
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="状态">
                      {
                        projectObj.projectStatus
                        ?
                        this.state.projectStatusArr.map((projectStatus) => {
                          return projectObj.projectStatus==projectStatus.value?projectStatus.text:null
                        })
                        :
                        "-"
                      }
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="创建日期">
                     {projectObj.createTime?moment(projectObj.createTime).format("YYYY-MM-DD"):'--'}
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="项目周期">
                      {projectObj.beginTime?moment(projectObj.beginTime).format("YYYY/MM/DD"):"/"}
                      <span style={{marginLeft:"10px",marginRight:"10px"}}>-</span>
                      {projectObj.endTime?moment(projectObj.endTime).format("YYYY/MM/DD"):"/"}
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="项目经理">
                      {projectObj.ownUserName?projectObj.ownUserName:'-'}
                      ({projectObj.ownUserPhone?projectObj.ownUserPhone:'-'})
                    </BaseDetails>
                  </Col>
                  <Col span={24}>
                    <BaseDetails title="项目地址">
                      {projectObj.detailAddress?projectObj.detailAddress:'-'}
                    </BaseDetails>
                  </Col>
                </Row>
              </div>
              <div>
                <h2 style={{borderBottom: '1px solid #e9e9e9', lineHeight: 2, marginBottom: 10}}>统计</h2>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="员工数量">
                      {this.state.proUserCount?this.state.proUserCount:'-'}
                    </BaseDetails>
                  </Col>
                  <Col span={12}>
                    <BaseDetails title="订单数">
                      {projectObj.orderCount?projectObj.orderCount:'-'}
                    </BaseDetails>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="询价总单数">
                      {projectObj.inquiryCount?projectObj.inquiryCount:'-'}
                    </BaseDetails>
                  </Col>
                  <Col span={12}>
                    <BaseDetails title="累计采购金额">
                      ¥ <NumberFormat value={projectObj.sumTotalPrice} />
                    </BaseDetails>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="询价单成交额">
                      {projectObj.sumTotalPrice?projectObj.sumTotalPrice:'-'}
                    </BaseDetails>
                  </Col>
                  <Col span={12}>
                    <BaseDetails title="项目可用金额">
                      ¥ <NumberFormat value={projectObj.account} />
                    </BaseDetails>
                  </Col>
                </Row>
              </div>
              <div>
                <h2 style={{borderBottom: '1px solid #e9e9e9', lineHeight: 2}}>项目成员</h2>
                <Table
                  {...ComponentDefine.table_}
                  columns={this.projectColumns()}
                  scroll={{ y: 300 }}
                  rowKey="id"
                  dataSource={this.state.projectMembers}></Table>
              </div>
            </div>
          </Modal>
        </div>
        {/* 子账号查看 */}
        <div>
          <Modal title={"查看"} visible={accountVisible}
                 onCancel={this.handleAccountCancel}
                 width={"800px"}
                 footer={[
                   <Button key="back" type="ghost" size="large" onClick={this.handleAccountCancel}>关闭</Button>
                 ]}
          >
            <div>
              <div>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="员工编号">
                      {accountObj.userNo}
                    </BaseDetails>
                  </Col>
                  <Col span={12}>
                    <BaseDetails title="邮箱">
                      {accountObj.email}
                    </BaseDetails>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="姓名">
                      {accountObj.username}
                    </BaseDetails>
                  </Col>
                  <Col span={12}>
                    <BaseDetails title="创建时间">
                      {accountObj.createTimeStr}
                    </BaseDetails>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="性别">
                      {accountObj.gender== "1" ? "男" : "女"}
                    </BaseDetails>
                  </Col>
                  <Col span={12}>
                    <BaseDetails title="有效期">
                      {accountObj && accountObj.validStr == '2500-12-31 00:00:00' ? '长期' :  moment(accountObj.validStr).format("YYYY-MM-DD")}
                    </BaseDetails>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="身份证号">
                      {accountObj.citizenCode?accountObj.citizenCode:'-'}
                      <a href="javascript:void(0);" style={{display: accountObj.citizenPhotoPath
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([accountObj.citizenPhotoPath]))}>查看影像</a>
                    </BaseDetails>
                  </Col>
                  <Col span={12}>
                    <BaseDetails title="当前状态">
                      {
                        accountObj.state==1?"启用":
                        accountObj.state==2?"停用":"-"}
                    </BaseDetails>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <BaseDetails title="联系电话">
                      {accountObj.phone}
                    </BaseDetails>
                  </Col>
                </Row>
              </div>
              <div>
                <h2 style={{borderBottom: '1px solid #e9e9e9', lineHeight: 2}}>岗位信息</h2>
                <Table
                  {...ComponentDefine.table_}
                  columns={this.accountColumns()}
                  rowKey="id"
                  scroll={{ y: 300 }}
                  dataSource={this.state.accountOfDeal}></Table>
              </div>
            </div>
          </Modal>
        </div>

        <Card bordered={false} className="mb10">
          <div className={less.infoContent_wrap}>
            <div className={less.logoDiv}>
              <img src={require('./logo.png')} />
              <span className={less.member_label}>{this.state.supplierInfo.isMember==1?'铁建成员单位':'非铁建成员单位'}</span>
            </div>

            <div className={less.infoContent_content}>
              <h2>{this.state.supplierInfo.name?this.state.supplierInfo.name:'-'}
                <span className={less.member_label} style={{width: 70,marginLeft: 10, display: this.state.supplierInfo.level ? "inline":'none'}}>{this.state.supplierInfo.level==2?'局级单位':this.state.supplierInfo.level==3?'处级单位':''}</span></h2>
                <p>统一社会信用代码：{this.state.supplierInfo.businessLicense?this.state.supplierInfo.businessLicense:''}</p>
                <div className={less.optionBar}>
                  {this.state.useSubPlatformList.map((platform, k) => {
                    return (
                      <span key={platform.id} onClick={() => (this.handleOpenPlatform(platform))} className={
                          platform.status == 3 ? less.lightGreen: less.lightAsh }>
                        {platform.spName}
                      </span>
                    )
                  })}
                </div>
              <h3>创建时间：{this.state.supplierInfo.createrDate?this.state.supplierInfo.createrDate:'-'}</h3>
              <div className={less.optionBar}>
                <span className={this.state.supplierTitle.blackCompanyType == 0 ? less.lightGreen : less.lightRed}
                  onClick={() => (this.handleBlack(2))}>{this.state.supplierTitle.blackCompanyType == 0 ? '企业未拉黑' : '已列入企业黑名单'}</span>
                <span className={this.state.supplierTitle.blackPersonType == 0 ? less.lightGreen : less.lightRed}
                      onClick={() => (this.handleBlack(1))}>{this.state.supplierTitle.blackPersonType == 0 ? '自然人未拉黑' : "已拉黑自然人"}</span>
              </div>
            </div>

            <div className={less.subform_p} style={{borderLeft: '1px dashed #e9e9e9'}}>
              <div style={{flex: 1}}>
                <BaseDetails title="管理员" width="110px">
                  {accountInfo.username}
                </BaseDetails>
                <BaseDetails title="手机号" width="110px">
                  {accountInfo.phone}
                </BaseDetails>
                <BaseDetails title="电子邮箱" width="110px">
                  {accountInfo.email}
                </BaseDetails>
                <BaseDetails title="任职时间" width="110px">
                  {accountInfo.appointmentDate?moment(accountInfo.appointmentDate).format("YYYY-MM-DD"):'--'}
                </BaseDetails>
                <BaseDetails title="授权文件" width="110px">
                  {accountInfo.recommendFilePath? '':'-'}
                  <a style={{display: accountInfo.recommendFilePath?'inline':'none'}} href={SystemConfig.configs.resourceUrl + accountInfo.recommendFilePath} target="_blank">下载</a>
                </BaseDetails>
              </div>
              <div>
                <Button type="primary" onClick={() => this.openModal('ModalreAdminShow', true)}>修改管理员</Button>
                <Button onClick={() => (this.handleResetPwd())}>重置密码</Button>
              </div>
            </div>

          </div>
        </Card>
          {/*处罚弹窗*/}
          <ViolationModal
              onOk = {this.setViolation}
              onCancel = { this.cancelDispose}
              visible={this.state.violationModalShow}
              confirmLoading={this.state.vioLoading}
              formData={this.violationFormList()}
          />
        {/*<div>
          <Modal title={"修改自营状态"} visible={this.state.employedVisible}
                 onCancel={this.handleEmployedCancel}
                 width={"800px"}
                 footer={[
                   <Button key="back" type="ghost" size="large" onClick={this.handleEmployedCancel}>返 回</Button>,
                   <Button key="submit" type="primary" size="large" loading={this.state.employedLoading} onClick={this.handleEmployedOk}>
                     提 交
                   </Button>,
                 ]}
          >
            <div>
              <div>自营开启：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.employedStatus} onChange={this.clickEmployedStatus}/></div>
              <div>处理原因：<Input type="textarea" maxLength="200" id={"employedRemarks"} rows={3} value={this.state.employedRemarks} onChange={(e)=>this.onChange(e,"employedRemarks")}/></div>
            </div>
          </Modal>
        </div>*/}

        <Card bordered={false} className="mb10" title="子平台业务管理">
          <Tabs defaultActiveKey="0">
            {
              useSubPlatformList.map((item, index) =>{
                return (
                  <TabPane tab={item.spName} disabled={item.status!==3? true: false} key={index}>
                    <div className={less.subform_wrap}>
                      <div className={less.subform_p} style={{"flex": 2}}>
                        <div>
                          <BaseDetails title="平台开通状态">
                            {
                              item.approvalStatus==1?"待审核":
                              item.approvalStatus==2?"通过":
                              item.approvalStatus==3?"驳回":
                            "未开通"}
                            </BaseDetails>
                          <BaseDetails title="注册渠道">
                            {
                              item.regType === 1 ? '自主注册' :
                              item.regType === 2 ? '管理员开通' :
                              '-'
                            }
                          </BaseDetails>
                          <BaseDetails title="员工数量">
                            {item.userCount}
                          </BaseDetails>
                          <BaseDetails title="项目部数量">
                            {item.orgCount}
                          </BaseDetails>
                        </div>
                      </div>

                        {/*企业标签的弹窗-新*/}
                        <div>
                            <Modal title={`修改${companyLabelObj.labelName}状态`} visible={companyLabelVisible}
                                   onCancel={this.closeCompanyLabel}
                                   width={"800px"}
                                   footer={[
                                       <Button key="back" type="ghost" size="large" onClick={this.closeCompanyLabel}>返 回</Button>,
                                       <Button key="submit" type="primary" size="large" loading={companyLabelLoading} onClick={this.companyLabelOk}>
                                           提 交
                                       </Button>,
                                   ]}
                            >
                                <div>
                                    <div>{companyLabelObj.labelName}开启：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.companyLabelStatus} onChange={this.clickCompanyLabelStatus}/></div>
                                    <div>处理原因：<Input type="textarea" maxLength="200" id={"labelRemarks"} rows={5}/></div>
                                </div>
                                {this.showRecordTable(companyLabelObj.labelName)}
                            </Modal>
                        </div>

                      <div className={less.subform_p}>
                        <div className={less.infoContent}>
                          <div className={less.infoDiv}>
                            <span className={less.name} onClick={()=>{this.toStorePage(this.state.supplierInfo.companyId)}}>{this.state.supplierInfo.name}</span>

                              {/* 二级标签，黑名单/警示、保证金、银信、自营、铁建推荐、十佳、百强、等级 */}
                              <div style={{display: item.spType==3?'block':'none'}} className={less.levelBar}>
                                  {/*<span className={less.spangrany} title={"黑名单/警示"}>黑</span>
                                  <span className={less.spangrany} title={"质保金"}>保</span>
                                  <span className={this.state.supplierTitle.silverLetterFlag == 1 ? '': less.spangrany} title={"铁建银信"}>信</span>
                                  <span className={less.spangrany} title={"铁建自营"} onClick={this.showEmployedModal.bind(this, '自')} >自</span>
                                  <span className={less.spangrany} title={"铁建推荐"}>荐</span>
                                  <span className={less.spangrany} title={"十佳"}>佳</span>
                                  <span className={less.spangrany} title={"百强"}>强</span>
                                  <span className={less.spangrany} title={"等级"}>等</span>*/}
                                  {this.showCompanyLabel(companyLabel)}


                                  {/*{this.renderFactoryType(this.state.supplierInfo.factoryType)}
                                  {this.renderRating(this.state.supplierTitle.rating)}*/}
                                  {/*<a href="javascript:void(0);" onClick={this.handleEvalution}>评级</a>*/}
                              </div>

                            {/*三级*/}
                            <div style={{display: item.spType==3?'block':'none'}} className={less.optionBar}>
                                {/*<span className={this.state.companyStatus == 1 ? less.red : less.green}>{this.state.companyStatus == 1 ? '状态异常' : "状态正常"}</span>*/}
                                <span className={storeSwitch.status == 0 ? less.lightGreen : less.lightRed} onClick={this.showStoreSwitchModel.bind(this, '门户')}>{storeSwitch.status == 0 ? "门户开启中":"门户关闭中"}</span>
                                <span className={storeSwitch.goodsSwitch == 0 ? less.lightGreen : less.lightRed} onClick={this.showStoreSwitchModel.bind(this, '商品')}>{storeSwitch.goodsSwitch == 0 ? "商品开启中":"商品关闭中"}</span>
                                <span className={storeSwitch.dealSwitch ==0 ? less.lightGreen : less.lightRed} onClick={this.showStoreSwitchModel.bind(this, '交易')}>{storeSwitch.dealSwitch ==0 ? "交易开启中":"交易关闭中"}</span>
                                <span className={storeSwitch.moneySwitch ==0 ? less.lightGreen : less.lightRed} onClick={this.showStoreSwitchModel.bind(this, '提现')}>{storeSwitch.moneySwitch ==0 ? "提现开启中":"提现关闭中"}</span>
                                <span className={storeSwitch.loginSwitch ==0 ? less.lightGreen : less.lightRed} onClick={this.showStoreSwitchModel.bind(this, '登录')}>{storeSwitch.loginSwitch ==0 ? "登录开启中":"登录关闭中"}</span>

                                <Modal title={`编辑${currentSwitchName}状态`} visible={storeSwitchVisible}
                                       onCancel={this.closeStoreSwitchModal}
                                       width={"800px"}
                                       footer={[
                                           <Button key="back" type="ghost" size="large" onClick={this.closeStoreSwitchModal}>返 回</Button>,
                                           <Button key="submit" type="primary" size="large" loading={this.state.storeStatusLoading} onClick={this.handleSwitchOk}>
                                               提 交
                                           </Button>,
                                       ]}
                                >
                                    <div>
                                        <div>{currentSwitchName}开关：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.currentStoreSwitchStatus} onChange={this.clickStoreSwitchStatus}/></div>
                                        <diV style={{'marginTop': '5px'}}>处罚期限：
                                            <Select
                                                style={{'width': '100px'}}
                                                onChange={this.punishDateChange}
                                                value={this.state.punlishDays}
                                                disabled={this.state.currentStoreSwitchStatus}
                                            >
                                                <Option key={'7'} value={7}>7天</Option>
                                                <Option key={'30'} value={30}>30天</Option>
                                                <Option key={'90'} value={90}>90天</Option>
                                                <Option key={'10000'} value={10000}>永久</Option>
                                            </Select>
                                        </diV>
                                        <div>处理原因：<Input type="textarea" maxLength="200" rows={5} id={"remarks"} /></div>
                                    </div>
                                </Modal>

                                {/*<Modal title={"编辑门户状态"} visible={this.state.portalVisible}
                                    onCancel={this.handlePortalCancel}
                                    width={"800px"}
                                    footer={[
                                      <Button key="back" type="ghost" size="large" onClick={this.handlePortalCancel}>返 回</Button>,
                                      <Button key="submit" type="primary" size="large" loading={this.state.portalLoading} onClick={this.handlePortalOk}>
                                        提 交
                                      </Button>,
                                    ]}
                              >
                                <div>
                                    <div>店铺开启：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.status} onChange={this.clickStoreStatus}/></div>
                                    <diV style={{'marginTop': '5px'}}>处罚期限：
                                        <Select
                                            style={{'width': '100px'}}
                                            onChange={this.punishDateChange}
                                            value={this.state.punlishDays}
                                            disabled={this.state.status}
                                        >
                                            <Option key={'7'} value={7}>7天</Option>
                                            <Option key={'30'} value={30}>30天</Option>
                                            <Option key={'90'} value={90}>90天</Option>
                                            <Option key={'10000'} value={10000}>永久</Option>
                                        </Select>
                                    </diV>
                                    <div>处理原因：<Input type="textarea" maxLength="200" rows={3} id={"remarks"} value={this.state.remarks} onChange={(e)=>this.onChange(e,"remarks")}/></div>
                                </div>
                              </Modal>


                              <Modal title={"编辑商品状态"} visible={this.state.goodsVisible}
                                    onCancel={this.handleGoodsCancel}
                                    width={"800px"}
                                    footer={[
                                      <Button key="back" type="ghost" size="large" onClick={this.handleGoodsCancel}>返 回</Button>,
                                      <Button key="submit" type="primary" size="large" loading={this.state.goodsLoading} onClick={this.handleGoodsOk}>
                                        提 交
                                      </Button>,
                                    ]}
                              >
                                <div>
                                    <div>商品开启：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.tempGoodsStatus} onChange={this.clickGoodsStatus}/></div>
                                    <diV style={{'marginTop': '5px'}}>处罚期限：
                                        <Select
                                            style={{'width': '100px'}}
                                            onChange={this.punishDateChange}
                                            value={this.state.punlishDays}
                                            disabled={this.state.tempGoodsStatus}
                                        >
                                            <Option key={'7'} value={7}>7天</Option>
                                            <Option key={'30'} value={30}>30天</Option>
                                            <Option key={'90'} value={90}>90天</Option>
                                            <Option key={'10000'} value={10000}>永久</Option>
                                        </Select>
                                    </diV>
                                    <div>处理原因：<Input type="textarea" maxLength="200" id={"goodsRemarks"} rows={3} value={this.state.goodsRemarks} onChange={(e)=>this.onChange(e,"goodsRemarks")}/></div>
                                </div>
                              </Modal>


                              <Modal title={"编辑交易状态"} visible={this.state.dealVisible}
                                    onCancel={this.handleDealCancel}
                                    width={"800px"}
                                    footer={[
                                      <Button key="back" type="ghost" size="large" onClick={this.handleDealCancel}>返 回</Button>,
                                      <Button key="submit" type="primary" size="large" loading={this.state.dealLoading} onClick={this.handleDealOk}>
                                        提 交
                                      </Button>,
                                    ]}
                              >
                                <div>
                                    <div>交易开启：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.tempDealStatus} onChange={this.clickDealStatus}/></div>
                                    <diV style={{'marginTop': '5px'}}>处罚期限：
                                        <Select
                                            style={{'width': '100px'}}
                                            onChange={this.punishDateChange}
                                            value={this.state.punlishDays}
                                            disabled={this.state.tempDealStatus}
                                        >
                                            <Option key={'7'} value={7}>7天</Option>
                                            <Option key={'30'} value={30}>30天</Option>
                                            <Option key={'90'} value={90}>90天</Option>
                                            <Option key={'10000'} value={10000}>永久</Option>
                                        </Select>
                                    </diV>
                                    <div>处理原因：<Input type="textarea" maxLength="200" id={"dealRemarks"} rows={3} value={this.state.dealRemarks} onChange={(e)=>this.onChange(e,"dealRemarks")}/></div>
                                </div>
                              </Modal>


                              <Modal title={"编辑资金账户状态"} visible={this.state.dealVisible}
                                    onCancel={this.handleDealCancel}
                                    width={"800px"}
                                    footer={[
                                      <Button key="back" type="ghost" size="large" onClick={this.handleDealCancel}>返 回</Button>,
                                      <Button key="submit" type="primary" size="large" loading={this.state.dealLoading} onClick={this.handleDealOk}>
                                        提 交
                                      </Button>,
                                    ]}
                              >
                                <div>
                                  <div>自己账户开启：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.tempDealStatus} onChange={this.clickDealStatus}/></div>
                                  <div>处理原因：<Input type="textarea" maxLength="200" id={"dealRemarks"} rows={3} value={this.state.dealRemarks} onChange={(e)=>this.onChange(e,"dealRemarks")}/></div>
                                </div>
                              </Modal>


                              <Modal title={"编辑登录状态"} visible={this.state.dealVisible}
                                    onCancel={this.handleDealCancel}
                                    width={"800px"}
                                    footer={[
                                      <Button key="back" type="ghost" size="large" onClick={this.handleDealCancel}>返 回</Button>,
                                      <Button key="submit" type="primary" size="large" loading={this.state.dealLoading} onClick={this.handleDealOk}>
                                        提 交
                                      </Button>,
                                    ]}
                              >
                                <div>
                                  <div>登录开启：<Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.tempDealStatus} onChange={this.clickDealStatus}/></div>
                                  <div>处理原因：<Input type="textarea" maxLength="200" id={"dealRemarks"} rows={3} value={this.state.dealRemarks} onChange={(e)=>this.onChange(e,"dealRemarks")}/></div>
                                </div>
                              </Modal>*/}
                            </div>
                            {/*<div style={{display: item.spType==3?'block':'none'}} className={less.supplierSource}>
                              <span style={{"cursor":"pointer"}} className={this.state.supplierInfo.showType == 1 ? less.choose : ''}>认证商家</span>
                            </div>*/}
                          </div>
                        </div>
                      </div>

                      <div className={less.subform_p} style={{"flex": 3}}>
                        <div style={{flex: 1}}>
                          <BaseDetails title="管理员" width="110px">
                            {item.adminName}
                          </BaseDetails>
                          <BaseDetails title="手机号" width="110px">
                            {item.adminPhone}
                          </BaseDetails>
                          <BaseDetails title="电子邮箱" width="110px">
                            {item.adminEmail}
                          </BaseDetails>
                          <BaseDetails title="任职时间" width="110px">
                            {item.createTime?moment(item.createTime).format("YYYY-MM-DD"):'--'}
                          </BaseDetails>
                          <BaseDetails title="授权文件" width="110px">
                           {item.authorizationPath? '':'-'}
                            <a style={{display: item.authorizationPath?'inline':'none'}} href={SystemConfig.configs.resourceUrl + item.authorizationPath} target="_blank">下载</a>
                          </BaseDetails>
                        </div>
                        <div>
                          <AuthButton onClick={() => this.openReSubAdminModal('ModalreSubAdminShow', item.id,true)}>变更管理员</AuthButton>
                          <Button onClick={() => (this.handleResetSubAdminPwd(item.adminUuids,item.adminPhone))}>重置密码</Button>
                          <Button onClick={() => (this.openViolation())}>处罚</Button>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                )
              })
            }

          </Tabs>
          <div className={less.evaluate_wrap}>
            <StatisticsStore onRefStatistics={this.onRefStatistics} evaluateObj={this.state.evaluateObj} />
          </div>
        </Card>

        <Card bordered={false} className="mb10" title="企业基本信息" extra={<div lassName="ant-card-extra-div"><Button type="primary" onClick={() => (this.companyInfomation())}>查看企业资质</Button></div>}>
          <Row>
            <Col span={12}>
              <BaseDetails title="企业名称">
                {this.state.supplierInfo.name}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="来源信息">
                {this.state.supplierInfo.source == "0" ? "自主注册" : this.state.supplierInfo.source == "1" ? "铁建推荐" : this.state.supplierInfo.source == "3" ? "后台添加" : "广联达"}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="企业简称">
                {this.state.supplierInfo.companyReferred}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="入驻时间">
                {this.state.supplierInfo.createTime?moment(this.state.supplierInfo.createTime).format("YYYY-MM-DD"):'--'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="统一社会信用代码">
                {this.state.supplierInfo.businessLicense}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="执照有效期">
                {this.initDate(this.state.supplierInfo.businessStartTime, this.state.supplierInfo.businessEndTime)}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="上级单位">
                {this.state.supplierInfo.pName}
              </BaseDetails>
            </Col>
            <Col span={12}>
                <BaseDetails title="签章状态">
                    {
                      this.state.signStatus.length ?
                        this.state.signStatus.map((item,index)=>{
                          return (<div key={index}><span>{item.contractName+" : "}</span><span style={{color:item.contractState==3?"green":"red"}}>{item.contractState==0?"未签章":item.contractState==1?"待平台签章":item.contractState==2?"待生效":item.contractState==3?"已生效":""}</span></div>)
                        })
                       : <span style={{color:"red"}}>未签章</span>
                    }
                </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="公司类型">
              {/* 0：采购商；1：供应商 */}
                {this.state.adminInfo.companyType==0?'采购商':
                this.state.adminInfo.companyType==1?'供应商':'-'
                }
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="注册资金">
                {this.state.supplierInfo.registeredCapital?this.state.supplierInfo.registeredCapital+'万元':'无'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="公司地址">
                {this.state.supplierInfo.address}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="主营类目">
                {this.state.supplierInfo.mainStr}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="主营品牌">
                {this.state.supplierInfo.businessBrand}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="主营产品">
                {this.state.supplierInfo.businessProduct}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="供货区域">
                {this.areaOptions(this.state.supplierInfo.supplyArea)}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="公司网址">
                {this.state.supplierInfo.companyUrl}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="公司简介">
                {this.state.supplierInfo.remarks}
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <p style={{textAlign: 'right', height: 20, lineHeight: '20px', marginBottom: 10}}>本数据每周一更新</p>
        <Card bordered={false} title="企业详细信息" bodyStyle={{ paddingTop: '16px' }}>
          <Tabs defaultActiveKey="1" onChange={this.changeTabs}>
            <TabPane tab="机构法人信息" key="1">
              <Row>
                <Col span={12}>
                  <BaseDetails title="公司名称">
                    {this.state.supplierInfo.name}
                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="法人代表姓名">
                    {this.state.supplierInfo.legalPersonName}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="营业执照号">
                    {this.state.supplierInfo.businessLicense}
                      <a href="javascript:void(0);" style={{display: this.state.supplierInfo.businessLicensePath
                              ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.businessLicensePath]))}>点击查看</a>

                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="联系电话">
                    {this.state.supplierInfo.contactPhone}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="执照有效期">
                  {this.initDate(this.state.supplierInfo.businessStartTime, this.state.supplierInfo.businessEndTime)}
                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="证件类型">
                    {this.getLegalPersonIdType(this.state.supplierInfo.legalPersonIdType)}
                  </BaseDetails>
                </Col>
              </Row>
                <Row key="5">
                    <Col span={12}>
                        <BaseDetails title="注册资本">
                            {this.initMoney(this.state.supplierInfo.registeredCapital)}
                        </BaseDetails>
                    </Col>
                    <Col span={12}>
                        <BaseDetails title="证件号码">
                            {this.state.supplierInfo.legalPersonId?this.state.supplierInfo.legalPersonId:'-'}
                            &nbsp;&nbsp;
                            <a href="javascript:void(0);" style={{display: this.state.supplierInfo.legalPersonPath1
                                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath1]))}>
                                {this.state.supplierInfo.legalPersonIdType == 1 ? "查看正面":"查看影像"}
                            </a>
                            &nbsp;&nbsp;
                            <a href="javascript:void(0);" style={{display: this.state.supplierInfo.legalPersonPath2
                                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath2]))}>查看反面</a>
                        </BaseDetails>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <BaseDetails title="公司所在地">
                            {this.state.supplierInfo.address}
                        </BaseDetails>
                    </Col>
                </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="经营范围">
                    {this.state.supplierInfo.mainStr}
                  </BaseDetails>
                </Col>
              </Row>
            </TabPane>
            {/*<TabPane tab="证照信息" key="2">
              {this.getThreeInOnePage(this.state.supplierInfo.threeInOne)}
            </TabPane>*/}
            <TabPane tab="税务财务信息" key="3">
              <Row>
                <Col span={12}>
                  <BaseDetails title="发票类型">
                    {this.getTaxType(this.state.supplierInfo.taxType)}
                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="开户银行">
                    {this.state.supplierInfo.institutionalBank}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="纳税人属性">
                    {this.state.supplierInfo.taxpayerAttribute == 1 ? "一般纳税人" : this.state.supplierInfo.taxpayerAttribute == 2 ? "小规模纳税人" : "-"}
                    &nbsp;&nbsp;
                    <a href="javascript:void(0);" style={{display: this.state.supplierInfo.vatPayerPath
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.vatPayerPath]))}>执照影像</a>
                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="机构基本账号">
                    {this.state.supplierInfo.companyBaseAccount}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="开户许可证">
                    <a href="javascript:void(0);" style={{display: this.state.supplierInfo.accountPermitPath
                    ? 'inline': 'none'}} onClick={() => (this.handleShowImg([this.state.supplierInfo.accountPermitPath]))}>查看影像</a>
                  </BaseDetails>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="澄清文件" key="4">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    columns={this.ClarificationColumns()}
                    dataSource={this.state.clarificationDocumentHistory}
                    scroll={{ y: 300 }}
                    pagination={false}></Table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="子账号信息" key="5">
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <span onClick={()=>{
                        this.setState({
                          navPlatformsId: ''
                        }, ()=>{
                          this.queryUserPageByCompanySub(this._companyId, {subPlatformId: '', nameOrPhone: this.state.nameOrPhone});
                        })
                      }} className={this.state.navPlatformsId == '' ? less.lightAsh_nav: less.lightAsh_nav_Not}>
                    全部
                  </span>
                  {this.state.useSubPlatformList.map((platform, k) => {
                    return (
                      <span key={platform.spType} onClick={()=>{
                        this.setState({
                          navPlatformsId: platform.spType,

                        }, ()=>{
                          this.queryUserPageByCompanySub(this._companyId, {subPlatformId: platform.spType, nameOrPhone: this.state.nameOrPhone});
                        })
                      }} className={this.state.navPlatformsId == platform.spType ? less.lightAsh_nav: less.lightAsh_nav_Not}>
                        {platform.spName}
                      </span>
                    )
                  })}
                </div>
                <div className={less.leimucc}>
                  <SearchInput placeholder="请输入"
                    onSearch={value => {
                      this.setState({
                        nameOrPhone: value
                      },()=>{
                        this.queryUserPageByCompanySub(this._companyId, {subPlatformId: this.state.navPlatformsId, nameOrPhone: value})
                      })
                    }}
                    style={{ width: 300 }} resetInputRef={this.resetInputRef}
                    keyWordsOnChange={this.keyWordsOnChange}/>
                </div>
              </div>
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    columns={this.SubAccountInformationColumns()}
                    loading={this.loading}
                    dataSource={this.state.accountList.rows}
                    onChange={this.onChangeSubTable}
                    scroll={{ y: 300 }}
                    pagination={false}></Table>
                </Col>
              </Row>
            </TabPane>
              <TabPane tab="项目信息" key="13">
                  <Row gutter={16}>
                      <Col span={24}>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <div>
                      <span onClick={()=>{
                          this.setState({
                              navPlatformsId: ''
                          }, ()=>{
                              this.queryOrgPageByCompanySub(this._companyId, {subPlatformId: '', organizationName: this.state.nameOrPhone});
                          })
                      }} className={this.state.navPlatformsId == '' ? less.lightAsh_nav: less.lightAsh_nav_Not}>
                        全部
                      </span>
                                  {this.state.useSubPlatformList.map((platform, k) => {
                                      return (
                                          <span key={platform.spType} onClick={()=>{
                                              this.setState({
                                                  navPlatformsId: platform.spType,
                                              }, ()=>{
                                                  this.queryOrgPageByCompanySub(this._companyId, {subPlatformId: platform.spType, organizationName: this.state.nameOrPhone});
                                              })
                                          }} className={this.state.navPlatformsId == platform.spType ? less.lightAsh_nav: less.lightAsh_nav_Not}>
                            {platform.spName}
                          </span>
                                      )
                                  })}
                              </div>
                              <div className={less.leimucc}>
                                  <SearchInput placeholder="请输入"
                                               onSearch={value => {
                                                   this.setState({
                                                       nameOrPhone: value
                                                   },()=>{
                                                       this.queryOrgPageByCompanySub(this._companyId, {subPlatformId: this.state.navPlatformsId, organizationName: value})
                                                   })
                                               }}
                                               style={{ width: 300 }} resetInputRef={this.resetInputRef}
                                               keyWordsOnChange={this.keyWordsOnChange}/>
                              </div>
                          </div>
                          <Table
                              {...ComponentDefine.table_}
                              columns={this.SubProjectInformationColumns()}
                              dataSource={this.state.orgList}
                              onChange={this.onChangeTable}
                              scroll={{ y: 300 }}
                              pagination={false}></Table>
                      </Col>
                  </Row>
              </TabPane>
            <TabPane tab="信息变更记录" key="6">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    columns={this.InformationChangeRecordColumns()}
                    loading={this.loading}
                    dataSource={this.state.informationChangeRecord.rows}></Table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="管理员记录" key="7">
              <Row gutter={16}>
                <Col span={24}>
                  <BaseTable
                    notInit={true}
                    url='@/sso/ecManagerChangeRecord/page'
                    tableState={this.state.tableState}
                    resetTable={(state) => { this.resetTable(state, 'tableState') }}
                    baseParams={this.baseParams}
                    columns={this.AdminListColumns()}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="数据统计" key="8">
                <Row gutter={16}>
                    <Col span={24}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>

                                {this.state.useSubPlatformList.map((platform, k) => {
                                    if(platform.id == 3 || platform.id == 4 || platform.id == 6){
                                        return (
                                            <span key={platform.spType} onClick={()=>{
                                                this.setState({
                                                    capitalAmountType: platform.spType,
                                                }, ()=>{
                                                    this.queryStatisticDataByCompanySub(this._companyId, platform.spType);
                                                })
                                            }} className={this.state.capitalAmountType == platform.spType ? less.lightAsh_nav: less.lightAsh_nav_Not}>
                                            {platform.spName}
                                          </span>
                                        )
                                    }
                                })}
                            </div>

                        </div>
                        <div>
                            {this.statisticDataHtml()}
                        </div>
                    </Col>
                </Row>
            </TabPane>
            {/*<TabPane tab="门户记录" key="9">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    pagination={false}
                    scroll={{ y: 300 }}
                    columns={this.RecordOfViolationColumns()}
                    loading={this.loading}
                    dataSource={this.state.recordOfViolation}></Table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="自营记录" key="10">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    pagination={false}
                    scroll={{ y: 300 }}
                    columns={this.RecordOfEmployedColumns()}
                    loading={this.loading}
                    dataSource={this.state.recordOfEmployed}></Table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="商品记录" key="11">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    pagination={false}
                    scroll={{ y: 300 }}
                    columns={this.RecordOfEmployedColumns()}
                    loading={this.loading}
                    dataSource={this.state.recordOfGoods}></Table>
                </Col>
              </Row>
            </TabPane>*/}
            <TabPane tab="违规记录" key="12">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    pagination={false}
                    scroll={{ y: 300 }}
                    columns={this.RecordOfEmployedColumns()}
                    loading={this.loading}
                    dataSource={this.state.recordOfDeal}></Table>
                </Col>
              </Row>
            </TabPane>


              <TabPane tab="资金账户" key="14">
                  <Row gutter={16}>
                      <Col span={24}>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <div>

                                  {this.state.useSubPlatformList.map((platform, k) => {
                                      return (
                                          <span key={platform.spType} onClick={()=>{
                                              this.setState({
                                                  capitalAmountType: platform.spType,
                                              }, ()=>{
                                                  this.queryAccountByCompanySub(this._companyId, platform.spType);
                                              })
                                          }} className={this.state.capitalAmountType == platform.spType ? less.lightAsh_nav: less.lightAsh_nav_Not}>
                                            {platform.spName}
                                          </span>
                                      )
                                  })}
                              </div>

                          </div>
                          {this.showAccountHtml()}
                      </Col>
                  </Row>
              </TabPane>
          </Tabs>
          
        </Card>
        
        <Card bordered={false} style={{margin: '10px 0' }} title="备注">
            <Form>
            <Row gutter={24}>
                <Col span={24}>
                    <Input type="textarea" maxLength="4000" id={"record"} rows={9}/>
              </Col>
          </Row>
            </Form>
        </Card>

        <Card bordered={false} style={{margin: '10px 0'}}>
          <div style={{textAlign:'center'}}>
            <Button style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
              <Button type="primary" style={{ marginRight: "10px" }} onClick={this.updateCompanyRecord}>保存</Button>
          </div>
        </Card>

        <ModalForm
          title="图片展示"
          {...this.imgModal}
          visible={this.state.imgModalShow}
          imgList={this.state.imgList}>
        </ModalForm>
        <DisposeModal
          {...this.disposeModal}
          visible={this.state.disposeShow}
          confirmLoading={this.state.loading}
          formData={this.disposeFormList()}
          disposeIndex={this.state.disposeIndex} />
        <SupplierBlacklistModal
          {...this.supplierBlacklistModal}
          obj={this.state.supplierInfo}
          visible={this.state.supplierBlackListShow}
        ></SupplierBlacklistModal>
        <CorporateBlacklistModal
          {...this.CorporateBlacklistModal}
          obj={this.state.supplierInfo}
          visible={this.state.corporateBlackListShow}
        ></CorporateBlacklistModal>
        <EvaluationModal
          title="评级"
          {...this.evaluationModal}
          visible={this.state.evaluationShow}
          formList={this.evaluationFormList()}></EvaluationModal>
        {/* 变更管理员 */}
        <ModalreAdmin
          title="变更管理员"
          visible={this.state.ModalreAdminShow}
          onOk={this.openModal}
          accountInfo={accountInfo}
          companyId={this.state.supplierInfo.companyId}
        />
		{/* 变更子平台管理员 */}
		<ModalreSubAdmin
		  title="变更子平台管理员"
		  visible={this.state.ModalreSubAdminShow}
		  onOk={this.openReSubAdminModal}
		  accountInfo={accountInfo}
		  companyId={this.state.supplierInfo.companyId}
		  companyName={this.state.supplierInfo.name}
		  subPlatformId={this.state.subPlatformId}
		/>
        {/* 申请开通子平台 */}
        <MySuppliers
          title="申请开通子平台"
          visible={this.state.MySuppliersShow}
          onOk={()=>{
            this.setState({
              MySuppliersShow: false
            },()=>{
              location.reload();
            })
          }}
          accountInfo={this.state.supplierInfo}
        />
        <ResetPwdModal
          {...this.resetPwdModal}
          visible={this.state.resetPwdShow}
          info={this.state.resetPwdInfo}></ResetPwdModal>
      </div>
    )
  }

  handleGoBack = () => {
    window.close();
  }

  onChangeSubTable=(pagination, filters, sorter, extra)=>{
    this.setState({
        querysort: sorter.field,
        order: sorter.order=='ascend'?'asc':sorter.order=='descend'?'desc':''
    },()=>{
      this.queryUserPageByCompanySub(this._companyId, {subPlatformId: this.state.navPlatformsId, organizationName: this.state.nameOrPhone});
    })
  }
  onChangeTable=(pagination, filters, sorter, extra)=>{
    this.setState({
        projectStatus: filters.projectStatus,
        projectType: filters.type,
        querysort: sorter.field,
        order: sorter.order=='ascend'?'asc':sorter.order=='descend'?'desc':''
    },()=>{
      this.queryOrgPageByCompanySub(this._companyId, {subPlatformId: this.state.navPlatformsId, organizationName: this.state.nameOrPhone});
    })
  }
//统计数据  根据子平台查询数据
    queryStatisticDataByCompanySub(_companyId, spType) {
        this.setState({
            loadDataFlag: true
        });
      if(spType == 3){
          this.queryRhSupplierQuotationCount(_companyId);
          this.queryRhSupplierOrderCount(_companyId);
          this.queryRhSupplierTotalPrice(_companyId);
          this.queryGoodsTotalCount(_companyId);
      } else {
          let url = "@/contend/notice/queryCountOrder";
          if(spType == 6){
              url = "@/reuse/index/getStatisByCompanyId";
          }
          this.queryStatisticData(_companyId, url, spType);
      }
    }

    //显示内容  统计数据
    statisticDataHtml = () => {
        let {loadDataFlag} = this.state;
        if(loadDataFlag){
            return (<Spin />)
        }else{
            return (<Row gutter={24}>
                <Col span={6}>
                    <div>{this.state.statisticData.textT1}：</div><div><span style={{fontSize: "28px"}}>{this.state.statisticData.valueV1 ? this.state.statisticData.valueV1 : "-"}</span></div>
                </Col>

                <Col span={6}>
                    <div>{this.state.statisticData.textT2}：</div><div><span style={{fontSize: "28px"}}>{this.state.statisticData.valueV2 ? this.state.statisticData.valueV2 : "-"}</span></div>
                </Col>

                <Col span={6}>
                    <div>{this.state.statisticData.textT3}：</div><div><span style={{fontSize: "28px"}}>{this.state.statisticData.valueV3 ? this.state.statisticData.valueV3 : "-"}</span></div>
                </Col>

                <Col span={6}>
                    <div>{this.state.statisticData.textT4}：</div><div><span style={{fontSize: "28px"}}>{this.state.statisticData.valueV4 ? this.state.statisticData.valueV4 : "-"}</span></div>
                </Col>
            </Row>);
        }

    }

    queryStatisticData = (companyId, url, subId) => {
        let {statisticData} = this.state;
        api.ajax('GET', url, {
            companyId
        }).then(r => {
            if(subId == 4){
                let count = r.data.orderAmount?r.data.orderAmount:0;
                statisticData.textT1 = "询/竞价单数";
                statisticData.valueV1 = r.data.sourceCount;
                statisticData.textT2 = "订单数";
                statisticData.valueV2 = r.data.orderCount;
                statisticData.textT3 = "订单金额"+(count>10000?"(万元)":"(元)");
                statisticData.valueV3 = (count>10000?(count/10000).toFixed(4):count.toFixed(2));
                count = r.data.paidAmount?r.data.paidAmount:0;
                statisticData.textT4 = "已付金额"+(count>10000?"(万元)":"(元)");
                statisticData.valueV4 = (count>10000?(count/10000).toFixed(4):count.toFixed(2));
            } else if(subId == 6){
                let count = r.data.orderAmount?r.data.orderAmount:r.data.orderAmt?r.data.orderAmt:0;
                statisticData.textT1 = "竞价单数";
                statisticData.valueV1 = r.data.sceneCount;
                statisticData.textT2 = "供求信息数";
                statisticData.valueV2 = r.data.supplyDemandCount;
                statisticData.textT3 = "订单数";
                statisticData.valueV3 = r.data.orderCount;
                statisticData.textT4 = "订单金额"+(count>10000?"(万元)":"(元)");
                statisticData.valueV4 = (count>10000?(count/10000).toFixed(4):count.toFixed(2));
            }
            this.setState({
                statisticData: statisticData,
                loadDataFlag: false
            });
        }).catch(r => {
            // console.log('统计数据出错',r);
            if(subId == 4){
                statisticData.textT1 = "询/竞价单数";
                statisticData.textT2 = "订单数";
                statisticData.textT3 = "订单金额(元)";
                statisticData.textT4 = "已付金额(元)";
            } else if(subId == 6){
                statisticData.textT1 = "竞价单数";
                statisticData.textT2 = "供求信息数";
                statisticData.textT3 = "订单数";
                statisticData.textT4 = "订单金额(元)";
            }
            statisticData.valueV1 = null;
            statisticData.valueV2 = null;
            statisticData.valueV3 = null;
            statisticData.valueV4 = null;
            this.setState({
                statisticData: statisticData,
                loadDataFlag: false
            });
        })
    }
}

export default SupplierDetails;