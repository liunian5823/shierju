import { Tabs, Row, Col, Button, Table, Card , Modal , Switch } from 'antd';
import Album from 'uxcore-album';
import api from '@/framework/axios';
import Util from '@/utils/util';
import ModalForm from './modalForm';
import BaseTable from '@/components/baseTable';
import BaseDetails from '@/components/baseDetails';
import DisposeModal from './disposeModal';
import SupplierBlacklistModal from './supplierBlacklistModal';
import CorporateBlacklistModal from './corporateBlacklistModal';
import EvaluationModal from './evaluationModal';
import ResetPwdModal from './resetPwdModal';
import ModalreAdmin from './reAdmin';
import {systemConfigPath} from "@/utils/config/systemConfig";
import Input from '@/components/baseInput';
import less from './index.less';
import React from "react";

const TabPane = Tabs.TabPane;
const { Photo } = Album;
const confirm = Modal.confirm;

class SupplierDetails extends React.Component {
  state = {
    supplierInfo: {},
    supplierTitle: {},
    adminInfo: {},
    companyStatus: 0,//公司状态
    imgModalShow: false,
    imgList: [],
    disposeShow: false,
    disposeIndex: 1,
    supplierUsersInfo: [],
    ModalreAdminShow: false,
    userInfo: {},
    resetPwdShow: false,
    resetPwdInfo: {},

    clarification: {},//说明材料
    clarificationDocumentHistory: [],
    userList: {},//子账号信息
    informationChangeRecord: {},//信息变更记录
    // adminList: {},//管理员记录
    tableState: 0,//管理员记录
    recordOfViolation: [],//门户记录
    portalVisible: false,   //门户开启显示
    portalLoading: false,   //门户开启提交按钮
    status: true,   //店铺状态 true 门户启用 ，false 门户关闭
    storeStatus: true,    //店铺状态  true 开启， false 关闭
    remarks:'',   //门户管理备注
    storeUuids: '', //店铺的uuids
    signStatus:[], //签章状态

    employed: false,    //店铺自营状态
    employedStatus: false,    //店铺自营弹窗状态控制
    employedVisible: false,   //自营弹窗
    employedLoading: false,   //自营更改提交加载中
    recordOfEmployed: [],//自营变更记录
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
    dealRemarks:'',     //交易管理备注

  }
  _isMounted = false;

  _uuids = "";
  _companyId = "";

  componentWillMount() {
    this._isMounted = true;
    const id = this.props.match.params.id;
    this._uuids = id;
    this.getSupplierDetails(id);
    this.getRecordOfViolation(id);
    //查询下自营修改记录
    this.getRecordOfStatus(id, 'employed');
    //查询下商品管理的修改记录
    this.getRecordOfStatus(id, 'goods');
    //查询交易管理的修改记录
    this.getRecordOfStatus(id, 'deal');
    this.getClarificationData(id);
    this.getRailwayBank(id);
  }

  componentWillUnmount() {
    this._isMounted = false;
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
            this.setState({
                getRhSupplierQuotationCount: count
            });
        }).catch(r => {

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
            this.setState({
                getRhSupplierOrderCount: count
            })
        }).catch(r => {

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
            this.setState({
                getRhSupplierTotalPrice: "¥"+(count>10000?(count/10000)+"万元":count+"元")
            })
        }).catch(r => {

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
            this.setState({
                queryGoodsTotalCount: count
            })
        }).catch(r => {

        })
    }
    //加载供应商上加商品数量
    queryForceContractSignStatus = (id) => {
        let _this = this;
        let signStatus = [];
        api.ajax('GET', '@/common/settledContractController/queryForceContractSignStatus', {
            companyId: _this._companyId
        }).then(r => {
            if (!_this._isMounted) {
                return;
            }
            if(r.data){
                this.setState({
                    signStatus: r.data
                })
            }
        }).catch(r => {
        })
    }
    //加载供应商资金账户
    queryRhCapitalAmount = (id) => {
        let _this = this;
        api.ajax('GET', '@/financial/accountBindsController/getRhCapitalAmount', {
            companyId: id
        }).then(r => {
            if (!_this._isMounted) {
                return;
            }
            this.setState({
                capitalAmount: r.data
            })
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
      this.getUserList(r.data.vo.companyId);
      this.getCompanyChangeRecord(r.data.vo.companyId);
      this.queryStoreStatus(r.data.vo.companyId);
      this.queryRhSupplierQuotationCount(r.data.vo.companyId);
      this.queryRhSupplierOrderCount(r.data.vo.companyId);
      this.queryRhSupplierTotalPrice(r.data.vo.companyId);
      this.queryGoodsTotalCount(r.data.vo.companyId);
      this.queryRhCapitalAmount(r.data.vo.companyId);
      this.queryForceContractSignStatus(this._companyId);
      this.baseParams = {
        companyId: r.data.vo.companyId
      }
      this.handelToLoadTable()
    })
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
          <span>{index + 1}</span>
        )
      },
      {
        title: '文件名称',
        dataIndex: 'urlName',
        key: 'urlName',
        width: 400,
        render: (text, record, index) => {
          if (text && text.length >= 15) {
            return <span title={text}>{text.substring(0, 13)}...</span>
          } else if (!text) {
            return <span>{record.url.substring(record.url.length-13)}</span>
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
          return <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>
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

  //子账号信息
  params2 = {
    _url: "@/sso/ecUser/getUserListForCompany",
    method: 'POST',
    rows: 10,
    page: 1
  }
  //子账号表头信息
  SubAccountInformationColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => (
          <span>{index + ((this.params2.page - 1) * this.params2.rows) + 1}</span>
        )
      },
      {
        title: '用户姓名',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (text, record) => (
          <span>{record.gender == "1" ? "男" : "女"}</span>
        )
      },
      {
        title: "角色",
        dataIndex: 'roleName',
        key: 'roleName'
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '创建时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr'
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => (
          <a href="javascript:void(0);" onClick={() => (this.handleResetPwd(record))}>重置密码</a>
        )
      }
    ]
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
        render: (text, record, index) => (
          <span>{index + ((this.params3.page - 1) * this.params3.rows) + 1}</span>
        )
      },
      {
        title: '变更时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text, record) => (
          <span>{record.updateTime ? moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
        )
      },
      {
        title: '变更项目',
        dataIndex: 'changeField',
        key: 'changeField'
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
        key: 'createTimeStr'
      },
      {
        title: '操作人',
        dataIndex: 'createUser',
        key: 'createUser'
      },
      {
        title: "变更前",
        dataIndex: 'beforeChange',
        key: 'beforeChange'
      },
      {
        title: '变更后',
        dataIndex: 'afterChange',
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
      console.log("获取门户记录 ------------", r)
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        recordOfViolation: r.data.rows
      })
    }).catch(r => {

    })
  }

  //自营记录表头
  RecordOfEmployedColumns = () => {
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
        key: 'createTime',
        render: (text, record) => {
          return(<p style={{width:"140px"}}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}</p>)
        }
      },
      {
        title: '处理类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => (
            <span>{record.type == "1" ? "封停店铺" : record.type == "2" ? "关闭门户" : record.type == "3" ? "开启店铺" : record.type == '4' ? "开启门户" : record.type == '5' ? "开启自营" : record.type == '6' ? "关闭自营" : record.type == '7' ? "商品开启" : record.type == '8' ? "商品关闭" :record.type == '9' ? "交易开启" :record.type == '10' ? "交易关闭" :  "-"}</span>
        )
      },
      {
        title: '处理人',
        dataIndex: 'createUserName',
        key: 'createUserName'
      },
      {
        title: '处理原因',
        dataIndex: 'remarks',
        key: 'remarks'
      },
    ]
  }


  //获取修改记录 自营employed  商品goods
  getRecordOfStatus = (uuids, types) => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecCompanyViolation/storeRecordPage', {
      uuids,types
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      if(types == 'employed'){
        this.setState({
          recordOfEmployed: r.data.rows
        })
      }
      if(types == 'goods'){
        this.setState({
          recordOfGoods: r.data.rows
        })
      }
      if(types == 'deal'){
        this.setState({
          recordOfDeal: r.data.rows
        })
      }
    }).catch(r => {

    })
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
            <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath1]))}>查看正面</a>
            &nbsp;&nbsp;
            <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath2]))}>查看反面</a>
          </BaseDetails>
        </Col>
      )
    } else {
      return (
        <Col span={12}>
          <BaseDetails title="护照图片">
            <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.legalPersonPath1]))}>查看</a>
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
      return moment(start).format("YYYY-MM-DD") + " -- 长期";
    } else {
      return moment(start).format("YYYY-MM-DD") + "--" + moment(end).format("YYYY-MM-DD");
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
            <BaseDetails title="是否三证合一">
              {this.getThreeInOne(this.state.supplierInfo.threeInOne)}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="营业执照号">
              {this.state.supplierInfo.businessLicense}
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
        <Row key="3">
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
        </Row>,
        <Row key='4'>
          <Col span={12}>
            <BaseDetails title="营业执照图片">
              <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.businessLicensePath]))}>点击查看</a>
            </BaseDetails>
          </Col>
        </Row>
      ]
    } else {
      return [
        <Row key="1">
          <Col span={12}>
            <BaseDetails title="是否三证合一">
              {this.getThreeInOne(this.state.supplierInfo.threeInOne)}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="营业执照号">
              {this.state.supplierInfo.businessLicense}
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
        </Row>,
        <Row key="4">
          <Col span={12}>
            <BaseDetails title="组织机构代码证">
              {this.state.supplierInfo.organizationCertificateCode}
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="营业执照图片">
              <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.businessLicensePath]))}>点击查看</a>
            </BaseDetails>
          </Col>
        </Row>,
        <Row key="6">
          <Col span={12}>
            <BaseDetails title="组织机构代码证图片">
              <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.organizationCertificatePath]))}>点击查看</a>
            </BaseDetails>
          </Col>
          <Col span={12}>
            <BaseDetails title="税务登记证">
              {this.state.supplierInfo.taxRegistrationNumber}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key="3">
          <Col span={12} offset={12}>
            <BaseDetails title="税务登记证图片">
              <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.taxRegistrationPath]))}>点击查看</a>
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

  // 重置管理员按钮事件
  openModal = (modalName, show = false, isSuccess = false) => {
    if (isSuccess) {
      this.getAdminInfo(this._companyId);
    }
    this.setState({
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
    let status = this.state.status;
    if(status){
      status = false;
    }else{
      status = true;
    }
    this.setState({
      status
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
    //转圈
    this.setState({
      portalLoading: true
    })
    //  companyId status remarks
    let companyId = this._companyId;
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
    //查询门户记录的店铺uuids
    let uuids = this._uuids;

    //校验当前处理原因是否填写
    if(this.checkFieldRequire(remarks)){
      api.ajax(
          'POST',
          '@/portal/ecStore/setStoreStatus',
          {companyId, status, remarks}
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

    // 查看资金账户
    openDetails = () =>{
        let companyId=this.state.supplierInfo.companyId;
        this.props.history.push('/financialCenter/capitalAccount/details/'+ companyId );
    };

  //  自营

  //1 显示自营弹窗
  showEmployedModal=()=>{
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
          console.log("保存交易管理的更改")
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
            this.getRecordOfStatus(uuids, 'employed');
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
    let tempGoodsStatus = this.state.tempGoodsStatus;
    if(tempGoodsStatus){
      tempGoodsStatus = false;
    }else{
      tempGoodsStatus = true;
    }
    this.setState({
      tempGoodsStatus
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
          console.log("保存商品管理的更改")
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
            companyId
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
            this.getRecordOfStatus(uuids, 'goods');
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

  //商品弹窗点击开关按钮的change事件
  clickDealStatus=()=>{
    let tempDealStatus = this.state.tempDealStatus;
    if(tempDealStatus){
      tempDealStatus = false;
    }else{
      tempDealStatus = true;
    }
    this.setState({
      tempDealStatus
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

  //商品管理的保存方法
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
            companyId
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
            this.getRecordOfStatus(uuids, 'deal');
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


  render() {
    const accountInfo = this.state.adminInfo;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div>
        <Card bordered={false} className="mb10">
          <div className={less.infoContent}>
            <div className={less.logoDiv}>
              <img src={require('./logo.png')} />
            </div>
            <div className={less.infoDiv}>
              <span className={less.name} onClick={()=>{this.toStorePage(this.state.supplierInfo.companyId)}}>{this.state.supplierInfo.name}</span>
              <div className={less.optionBar}>
                <span className={this.state.companyStatus == 1 ? less.red : less.green}>{this.state.companyStatus == 1 ? '状态异常' : "状态正常"}</span>
                <span className={this.state.storeStatus == true ? less.lightGreen : less.lightRed} onClick={this.showBannerModal}>{this.state.storeStatus == true?"门户开启中":"门户关闭中"}</span>
                <Modal title={"编辑门户状态"} visible={this.state.portalVisible}
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
                    <div>处理原因：<Input type="textarea" maxLength="200" rows={3} id={"remarks"} value={this.state.remarks} onChange={(e)=>this.onChange(e,"remarks")}/></div>
                  </div>
                </Modal>

                <span className={this.state.goodsStatus == true ? less.lightGreen : less.lightRed} onClick={this.showGoodsModal}>{this.state.goodsStatus == true?"商品开启中":"商品关闭中"}</span>
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
                    <div>处理原因：<Input type="textarea" maxLength="200" id={"goodsRemarks"} rows={3} value={this.state.goodsRemarks} onChange={(e)=>this.onChange(e,"goodsRemarks")}/></div>
                  </div>
                </Modal>

                <span className={this.state.dealStatus == true ? less.lightGreen : less.lightRed} onClick={this.showDealModal}>{this.state.dealStatus == true?"交易开启中":"交易关闭中"}</span>
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
                    <div>处理原因：<Input type="textarea" maxLength="200" id={"dealRemarks"} rows={3} value={this.state.dealRemarks} onChange={(e)=>this.onChange(e,"dealRemarks")}/></div>
                  </div>
                </Modal>
                <span className={this.state.supplierTitle.blackCompanyType == 0 ? less.lightGreen : less.lightRed}
                  onClick={() => (this.handleBlack(2))}>{this.state.supplierTitle.blackCompanyType == 0 ? '企业未拉黑' : '已列入企业黑名单'}</span>
                <span className={this.state.supplierTitle.blackPersonType == 0 ? less.lightGreen : less.lightRed}
                  onClick={() => (this.handleBlack(1))}>{this.state.supplierTitle.blackPersonType == 0 ? '自然人未拉黑' : "已拉黑自然人"}</span>
              </div>
              <div className={less.levelBar}>
                <span className={less.spangrany} title={"质保金"}>保</span>
                <span className={this.state.supplierTitle.silverLetterFlag == 1 ? '': less.spangrany} title={"铁建银信"}>信</span>
                {this.renderFactoryType(this.state.supplierInfo.factoryType)}
                {this.renderRating(this.state.supplierTitle.rating)}
                <a href="javascript:void(0);" onClick={this.handleEvalution}>评级</a>
              </div>
              <div className={less.supplierSource}>
                <span style={{"cursor":"pointer"}} className={this.state.supplierInfo.showType == 1 ? less.choose : ''}>认证商家</span>
                <span style={{"cursor":"pointer"}} className={this.state.supplierInfo.showType == 2 ? less.choose : ''} title={(this.state.supplierInfo.showType == 2 && this.state.supplierTitle.recommendCompanyName!='')?'由 '+this.state.supplierTitle.recommendCompanyName+" 推荐": ''}>铁建推荐</span>
                <span style={{"cursor":"pointer"}} className={this.state.employed == true ? less.choose : ''} onClick={this.showEmployedModal.bind()} >铁建自营</span>
              </div>
            </div>
          </div>
        </Card>
        <div>
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
        </div>
        <Card bordered={false} className="mb10"
          title="管理员信息"
          /*extra={<div lassName="ant-card-extra-div"><Button className="mr10" onClick={() => this.openModal('ModalreAdminShow', true)}>修改管理员</Button><Button type="primary" onClick={() => (this.handleResetPwd())}>重置密码</Button>


          </div>}*/>
          <Row>
            <Col span={12}>
              <BaseDetails title="管理员">
                {this.state.adminInfo.username}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="电子邮箱">
                {this.state.adminInfo.email}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="手机号码">
                {this.state.adminInfo.phone}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="任职时间">
                {this.state.adminInfo.appointmentDate}
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} className="mb10"
          title="资金账户"
          extra={<div lassName="ant-card-extra-div"><a href="javascript:void(0)" onClick={this.openDetails.bind()}>查看资金账户</a></div>}>
          <Row>
            <Col span={12}>
              <BaseDetails title="总金额" type="big_money">
                  ¥{!this.state.capitalAmount?'0.00':this.state.capitalAmount.totalAmt==0?'0.00':this.state.capitalAmount.totalAmt}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="质保金金额" type="big_money">
                  ¥{!this.state.capitalAmount?'0.00':this.state.capitalAmount.qualityRetentionPrice ==0? '0.00' : this.state.capitalAmount.qualityRetentionPrice}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="冻结金额">
                ¥{!this.state.capitalAmount?'0.00':this.state.capitalAmount.frozeAmt == 0 ? '0.00' : this.state.capitalAmount.frozeAmt}元
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="在途金额">
                ¥{!this.state.capitalAmount?'0.00':this.state.capitalAmount.wayingAmt==0?'0.00':this.state.capitalAmount.wayingAmt}元
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="可用金额">
                ¥{!this.state.capitalAmount?'0.00':this.state.capitalAmount.availAmt==0?'0.00':this.state.capitalAmount.availAmt}元
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} className="mb10" title="公司信息">
          <Row>
            <Col span={12}>
              <BaseDetails title="公司名称">
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
              <BaseDetails title="注册资本">
                {this.initMoney(this.state.supplierInfo.registeredCapital)}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="入驻时间">
                {this.state.supplierInfo.createTime}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="公司类型">
                {this.getFactoryType(this.state.supplierInfo.factoryType)}
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
              <BaseDetails title="主营类目">
                {this.state.supplierInfo.mainStr}
              </BaseDetails>
            </Col>
            <Col span={12}>
                <BaseDetails title="签章状态">
                    {
                        this.state.signStatus.map((item,index)=>{
                            return (<div key={index}><span>{item.contractName+" : "}</span><span>{item.contractState==0?"未签章":item.contractState==1?"待平台签章":item.contractState==2?"待生效":item.contractState==3?"已生效":""}</span></div>)
                        })
                    }
                </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="公司地址">
                {this.state.supplierInfo.areaStr + '-' + this.state.supplierInfo.address}
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} bodyStyle={{ paddingTop: '16px' }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="机构法人信息" key="1">
              <Row>
                <Col span={12}>
                  <BaseDetails title="公司名称">
                    {this.state.supplierInfo.name}
                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="证件类型">
                    {this.getLegalPersonIdType(this.state.supplierInfo.legalPersonIdType)}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="公司类型">
                    {this.getFactoryType(this.state.supplierInfo.factoryType)}
                  </BaseDetails>
                </Col>
                {this.getLegalPersonId(this.state.supplierInfo.legalPersonIdType)}
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="出口资质">
                    {this.getExportQualification(this.state.supplierInfo.exportQualification)}
                  </BaseDetails>
                </Col>
                {this.getLegalPersonIdPage(this.state.supplierInfo.legalPersonIdType)}
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="主营类目">
                    {this.state.supplierInfo.mainStr}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="法人姓名">
                    {this.state.supplierInfo.legalPersonName}
                  </BaseDetails>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="证照信息" key="2">
              {this.getThreeInOnePage(this.state.supplierInfo.threeInOne)}
            </TabPane>
            <TabPane tab="税务财务信息" key="3">
              <Row>
                <Col span={12}>
                  <BaseDetails title="发票类型">
                    {this.getTaxType(this.state.supplierInfo.taxType)}
                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="开户许可证号">
                    {this.state.supplierInfo.accountPermitNumber}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="开户银行">
                    {this.state.supplierInfo.institutionalBank}
                  </BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="纳税人属性">
                    {this.state.supplierInfo.taxpayerAttribute == 1 ? "一般纳税人" : this.state.supplierInfo.taxpayerAttribute == 2 ? "小规模纳税人" : "-"}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="机构基本账号">
                    {this.state.supplierInfo.companyBaseAccount}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <BaseDetails title="开户许可证">
                    <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.supplierInfo.accountPermitPath]))}>点击查看</a>
                  </BaseDetails>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="说明材料" key="4">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    columns={this.ClarificationColumns()}
                    dataSource={this.state.clarificationDocumentHistory}
                    pagination={false}></Table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="子账号信息" key="5">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    columns={this.SubAccountInformationColumns()}
                    loading={this.loading}
                    dataSource={this.state.userList.rows}
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
                  {/* <Table
                    {...ComponentDefine.table_}
                    columns={this.AdminListColumns()}
                    loading={this.loading}
                    dataSource={this.state.adminList.rows}
                    pagination={false}></Table> */}
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="数据信息" key="8">
              <Row gutter={16}>
                {/* <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    columns={this.SubAccountInformationColumns()}
                    loading={this.loading}
                    dataSource={this.state.userList.rows}></Table>
                </Col> */}
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <BaseDetails title="累计报价数" children={this.state.getRhSupplierQuotationCount}></BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="累计订单数" children={this.state.getRhSupplierOrderCount}></BaseDetails>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <BaseDetails title="累计成交额" children={this.state.getRhSupplierTotalPrice}></BaseDetails>
                </Col>
                <Col span={12}>
                  <BaseDetails title="上架商品数量" children={this.state.queryGoodsTotalCount}></BaseDetails>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="门户记录" key="9">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    pagination={false}
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
                    columns={this.RecordOfEmployedColumns()}
                    loading={this.loading}
                    dataSource={this.state.recordOfGoods}></Table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="交易记录" key="12">
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    {...ComponentDefine.table_}
                    pagination={false}
                    columns={this.RecordOfEmployedColumns()}
                    loading={this.loading}
                    dataSource={this.state.recordOfDeal}></Table>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
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
        />
        <ResetPwdModal
          {...this.resetPwdModal}
          visible={this.state.resetPwdShow}
          info={this.state.resetPwdInfo}></ResetPwdModal>
      </div>
    )
  }
}

export default SupplierDetails;