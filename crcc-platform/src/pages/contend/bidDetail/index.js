import React, { Component } from 'react';
import {
  Card,
  Row,
  Col,
  Tabs,
  Table,
  Button,
  Icon,
  Modal,
  Checkbox,
  message,
} from 'antd';
import CusPopover from '../components/cusPopover';
const TabPane = Tabs.TabPane;
import LoadMore from '../components/loadMore';
import Util from '@/utils/util';
import { getQueryString, getUrlByParam } from '@/utils/urlUtils';
import SearchBar from '../../../components/gaoda/SearchBar';
import SelectArea from '../../../components/selectArea/SelectAreaGaoDa';
import BidHeader from '../components/bidHeader/index.js';
import BidTable from '../components/bidTable/index.js';
import BidInfo from '../components/bidInfo/index.js';
import CardInfo from '../components/cardInfo/index.js';
import Cuspopover from '../components/cusPopover/index.js';
import logo from '../../../static/img/BackToTop.png';
import { systemConfigPath } from '@/utils/config/systemConfig';
import BaseAffix from '@/components/baseAffix';
import {NumberFormat} from "@/components/gaoda/Format";
const CheckboxGroup = Checkbox.Group;

import less from './index.less';
class BidDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      timerCountDown: {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      },
      allInfoData: {},
      loadMoreOrderStatus: false,
      //竞价单日志状态
      loadMoreRecord: false,
      //竞价单日志数据
      contendLogList: [],
      //订单信息
      orderList: [],
      //报名详情信息
      applyList: [],
      showBeforePublish: false,
      //报价清单列表
      contendRecordList: [],
      saveMoneyVisible: false, //节资率modal显示
      defaultSaveMoneyCheckValue: [], //默认的节资率弹窗选中数据
      quotations: [], //报价信息集合
      activeKey: 1,
    };
  }
  componentWillMount() {
    this.getAllData(this.props.match.params);
    this.getContendLogList(this.props.match.params);
    this.getOrderList(this.props.match.params);
    this.getApplyList(this.props.match.params);
    this.getContendRecord(this.props.match.params);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tabsChange = (key) => {
    this.setState(
      {
        activeKey: key,
      },
      () => {
        this.render();
      },
    );
  };
  //获取页面数据
  getAllData(params) {
    // axios.get('@/contend/purchase/detail', {
    axios
      .get('@/platform/contend/detail', {
        params,
      })
      .then((r) => {
        if (r != null) {
          this.setState(
            {
              allInfoData: r.data,
            },
            () => {
              let obj = r.data;
              if (
                (obj && obj.status && obj.status == 10) ||
                obj.status == 20 ||
                obj.status == 19
              ) {
                this.setState({
                  showBeforePublish: true,
                });
              }
            },
          );
        }
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  }
  //获取竞价单日志数据
  getContendLogList(params) {
    // axios.get('@/contend/log/contendLogList', {
    axios
      .get('@/platform/log/contendLogList', {
        params,
      })
      .then((r) => {
        if (r != null) {
          this.setState({
            contendLogList: r.data,
          });
        }
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  }
  //获取订单信息
  getOrderList(params) {
    // axios.get('@/contend/purchase/orderList', {
    axios
      .get('@/platform/contend/orderList', {
        params,
      })
      .then((r) => {
        if (r != null) {
          this.setState({
            orderList: r.data,
          });
        }
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  }
  //获取报名详情信息

  getApplyList(params) {
    // axios.get('@/contend/join/applyList', {
    axios
      .get('@/platform/join/applyList', {
        params,
      })
      .then((r) => {
        if (r != null) {
          this.setState({
            applyList: r.data,
          });
        }
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  }
  //获取报价清单列表
  getContendRecord(params) {
    // axios.get('@contend/quotation/contendRecord', {
    axios
      .get('@/platform/quotation/contendRecord', {
        params,
      })
      .then((r) => {
        if (r != null) {
          this.setState({
            contendRecordList: r.data,
          });
        }
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  }

  /**
   * 批量下载文件
   */
  downloadAll = () => {
    let data =
      this.state.allInfoData && this.state.allInfoData.fileList
        ? this.state.allInfoData.fileList
        : [];
    for (let index = 0; index < data.length; index++) {
      this.download(
        data[index].fileName,
        SystemConfig.systemConfigPath.dfsPathUrl(
          data[index].fileUrl + '?filename=' + data[index].fileName,
        ),
      );
    }
  };

  download = (name, href) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // 防止影响页面
    iframe.style.height = 0; // 防止影响页面
    iframe.src = href;
    document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
    // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
    setTimeout(() => {
      iframe.remove();
    }, 5 * 60 * 1000);
  };

  loadMore = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
  loadMoreOrder = () => {
    this.setState({
      loadMoreOrderStatus: !this.state.loadMoreOrderStatus,
    });
  };
  searchMore = () => {
    this.setState({
      loadMoreRecord: !this.state.loadMoreRecord,
    });
  };
  goTop = () => {
    document.getElementById('main').scrollTop = 0;
  };
  //跳转到bondadm
  goBondAdm(uuids) {
    this.props.history.push(`/bondadm/${uuids}`);
  }
  //返回上一级
  goBack = () => {
    //this.props.history.goBack();
    window.close();
  };
  //跳转至c
  goOfferDetail = () => {
    this.props.history.push('/offerdetail');
  };

  print = () => {
    let printDiv = $('#react-print').clone(true);
    printDiv.attr('id', 'react-print-clone');
    let children = $(window.document.body).children();
    //将所有的元素全部隐藏
    for (let index = 0; index < children.length; index++) {
      $(children[index]).hide();
    }
    printDiv.show();
    $(window.document.body).append(printDiv);
    window.print();
    for (let index = 0; index < children.length; index++) {
      $(children[index]).show();
    }
    $('#react-print-clone').remove();
  };

  //倒计时计算
  timerCountDown(dateF, dateS = new Date()) {
    if (!dateF) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    }
    let date1 = new Date(dateF);
    let date2 = new Date(dateS);
    let dateS1 = date1.getTime();
    let dateS2 = date2.getTime();
    let dateMinus = dateS1 - dateS2;
    if (dateMinus <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    }
    let days = (dateMinus / (24 * 60 * 60 * 1000)).toFixed(0);
    days = days < 10 ? '0' + days : days;
    let dayRemainder = dateMinus % (24 * 60 * 60 * 1000);
    let hours = (dayRemainder / (60 * 60 * 1000)).toFixed(0);
    hours = hours < 10 ? '0' + hours : hours;
    let hourRemainder = dayRemainder % (60 * 60 * 1000);
    let minutes = (hourRemainder / (60 * 1000)).toFixed(0);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let minutesRemainder = hourRemainder % (60 * 1000);
    let seconds = (minutesRemainder / 1000).toFixed(0);
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }
  //跳转至singleoffer
  goSingleOffer = (record) => {
    this.props.history.push(
      `/singleoffer/${record.uuids}/${this.props.match.params.uuids}/${record.contendUuids}`,
    );
  };
  //导出节资率
  showSaveMoney = () => {
    this.setState({
      saveMoneyVisible: true,
    });
  };
  //隐藏节资率
  hideSaveMoney = () => {
    this.setState({
      saveMoneyVisible: false,
    });
  };

  //导出竞价
  //   exprot = rateType => {
  //     let params = {}
  //     params.rateType = rateType;
  //     const url = getUrlByParam("contend/purchase/quotationNewExportData",params);
  //     window.location.href = systemConfigPath.axiosUrl(url);
  //     setTimeout(function () {
  //         Util.alert("导出成功");
  //     }, 2000)
  // }

  //导出节资率
  exprotSaveMoneyData = (rateType) => {
    let defaultSaveMoneyCheckValue = this.state.defaultSaveMoneyCheckValue;
    //超过三家询价,没有默认选择
    let quotationUuids = [];
    let params = {};
    // if (defaultSaveMoneyCheckValue.length == 0) {

    // } else {
    // }
    quotationUuids = defaultSaveMoneyCheckValue;

    // if (quotationUuids.length < 1) {
    //     message.error('请最少选择一家供应商报价进行导出!');
    //     return;
    // }
    params.uuids = this.state.allInfoData.uuids;
    params.rateType = rateType;
    // params.rateCompanyIds = quotationUuids.join(",");
    //   let applyList = this.state.applyList;
    //   for (let i = 0; i < applyList.length; i++) {
    //     params.rateCompanyIds = applyList[i].id;
    // }
    const url = getUrlByParam(
      '/contend/purchase/quotationNewExportData',
      params,
    );
    window.location.href = systemConfigPath.axiosUrl(url);
    setTimeout(function () {
      Util.alert('导出成功');
    }, 2000);
    this.closeExportModal();
  };

  closeExportModal = () => {
    this.setState({
      exportQuoVisible: false,
      saveMoneyVisible: false,
    });
  };
  //节资率
  getSMQuotationsCheckbox = () => {
    //询价中状态不处理
    // let data = this.state.dataSource;
    // if (data.statusFlag == 1) {
    //     return;
    // }
    let options = [];
    let applyList = this.state.applyList;
    // if (applyList.length > 3) {
    for (let i = 0; i < applyList.length; i++) {
      options.push({
        label:
          applyList[i].companyName +
          '' +
          '￥' +
          this.formatMallValence(applyList[i].taxTotalPrice),
        value: applyList[i].id,
      });
    }
    // } else {
    //     for (let i = 0; i < applyList.length; i++) {
    //         options.push({ label: applyList[i].companyName + "" + "￥" + this.formatMallValence(applyList[i].taxTotalPrice), value: applyList[i].id })
    //     }
    // }
    return options;
  };
  formatMallValence = (money) => {
    return money ? money.toFixed(2) : '0';
  };

  //订单详情，跳转订单详情页
  bidDetails = (uuids) => {
    let param = {}
    param.uuids = uuids
    param.goBackUrl = '/platInvoice/orderManagement';
    // this.props.history.push(getUrlByParam('/platInvoice/orderDetail', param));
    window.open(systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetailNew', param)))
}

  //节资率
  quotationsCheckboxChange1 = (v) => {
    console.log('999', v);
    this.setState({
      defaultSaveMoneyCheckValue: v,
    });
  };
  render() {
    let allInfoData = this.state.allInfoData;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState(
        {
          timerCountDown: Util.timerCountDown(allInfoData.endDate),
        },
        () => {
          if (
            this.state.timerCountDown.days == '00' &&
            this.state.timerCountDown.hours == '00' &&
            this.state.timerCountDown.minutes == '00' &&
            this.state.timerCountDown.seconds == '00'
          ) {
            clearInterval(this.timer);
          }
        },
      );
    }, 1000);

    const dateStyle = {
      textAlign: 'right',
      marginRight: '20px',
      width: '70px',
    };
    const columns = [
      {
        title: '公司名称',
        dataIndex: 'companyName',
        width: 140,
        sorter: (a, b) => {
          if (!a.companyName) {
            return;
          }
          return a.companyName.localeCompare(b.companyName);
        },
        render: (text) => {
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '联系方式',
        dataIndex: 'contactPerson',
        width: 110,
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          return (
            <div>
              <p>{record.contactPerson}</p>
              <p>{record.contactPhone}</p>
            </div>
          );
        },
        sorter: (a, b) => {
          if (!a.contactPerson) {
            return;
          }
          return a.contactPerson.localeCompare(b.contactPerson);
        },
      },
      {
        title: '报名日期',
        dataIndex: 'acceptTime',
        width: 110,
        render: (text) => {
          if (!text) {
            return '--';
          }
          const a = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{a[0]}</p>
              <p>{a[1]}</p>
            </div>
          );
        },
        sorter: (a, b) => {
          if (!a.acceptTime) {
            return;
          }
          return (
            a.acceptTime.replace(/-| |:/g, '') -
            b.acceptTime.replace(/-| |:/g, '')
          );
        },
      },
      {
        title: '保证金状态',
        dataIndex: 'marginStatus',
        width: 100,
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          let textStatus = '';
          if (record.marginStatus == '1') {
            textStatus = '无需缴纳';
          } else if (record.marginStatus == '2') {
            textStatus = '未缴纳';
          } else if (record.marginStatus == '3') {
            textStatus = '已缴纳';
          }
          let color = '';
          color =
            textStatus == '无需缴纳'
              ? '#000000'
              : textStatus == '已缴纳'
                ? '#74D54E'
                : '#FE4D4D';
          return (
            <div>
              <p style={{ color: color }}>
                <span>{textStatus}</span>
              </p>
              <p style={{ color: color }}>
                {record.marginConfirmTime
                  ? record.marginConfirmTime.split(' ')[0]
                  : ''}
              </p>
            </div>
          );
        },
        sorter: (a, b) => {
          if (!a.depDate) {
            return;
          }
          return (
            a.depDate.replace(/-| |:/g, '') - b.depDate.replace(/-| |:/g, '')
          );
        },
      },
      {
        title: '报价有效期',
        dataIndex: 'validityQuotation',
        width: 110,
        sorter: (a, b) => {
          if (!a.validityQuotation) {
            return;
          }
          return (
            a.validityQuotation.replace(/-| |:/g, '') -
            b.validityQuotation.replace(/-| |:/g, '')
          );
        },
        render: (text) => {
          if (!text) {
            return '--';
          }
          return <span>{text.split(' ')[0]}</span>;
        },
      },
      {
        title: '报价状态',
        dataIndex: 'quotationStatus',
        width: 100,
        render: (text) => {
          if (!text) {
            return '--';
          }
          const color = text === 1 ? '#72b523' : '#e1475b';
          return (
            <span style={{ color }}>{text == 1 ? '报价有效' : '报价无效'}</span>
          );
        },
        sorter: (a, b) => {
          if (!a.quotationStatus) {
            return;
          }
          return a.quotationStatus - b.quotationStatus;
        },
      },
      {
        title: '税额',
        dataIndex: 'tax',
        width: 110,
        sorter: (a, b) => {
          if (!a.tax) {
            return;
          }
          return a.tax - b.tax;
        },
      },
      {
        title: '税价合计',
        dataIndex: 'taxTotalPrice',
        width: 110,
        sorter: (a, b) => {
          if (!a.taxTotalPrice) {
            return;
          }
          return a.taxTotalPrice - b.taxTotalPrice;
        },
      },
      {
        title: '预计到货日',
        dataIndex: 'deliveryDate',
        width: 110,
        sorter: (a, b) => {
          if (!a.deliveryDate) {
            return;
          }
          return (
            a.deliveryDate.replace(/-| |:/g, '') -
            b.deliveryDate.replace(/-| |:/g, '')
          );
        },
        render: (text) => {
          if (!text) {
            return '--';
          }
          return <span>{text.split(' ')[0]}</span>;
        },
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   fixed: 'right',
      //   render: (text, record) => {
      //     return <a href="javascript:;" onClick={() => this.goSingleOffer(record)}>查看报价</a>
      //   },
      // }
    ];

    const data = [
      {
        key: '1',
        companyName: '胡斌',
        contactPerson: '测试17582734617',
        acceptTime: '2020-2-1812:12:12',
        marginConfirmTime: '已缴纳2020-2-18',
        validityQuotation: '2020-2-18',
        deliveryDate: '2020-2-20',
        tax: '2344545',
        taxTotalPrice: '2344545',
        quotationStatus: '报价有效',
        operation: '查看报价',
      },
      {
        key: '2',
        name: '胡斌',
        tell: '测试17582734617',
        regDate: '2020-2-1812:12:12',
        depDate: '已缴纳2020-2-18',
        effDate: '2020-2-18',
        estDate: '2020-2-20',
        taxAmount: '2344545',
        total: '2344545',
        state: '报价无效',
        operation: '查看报价',
      },
    ];

    //清单
    const columns2 = [
      {
        title: '报价次序',
        dataIndex: 'quotationTimes',
        sorter: (a, b) => {
          return a.quotationTimes - b.quotationTimes;
        },
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        width: 120,
        render: (text) => {
          return <CusPopover content={text}></CusPopover>;
        },
        sorter: (a, b) => {
          return a.companyName.localeCompare(b.companyName);
        },
      },
      {
        title: '报价时间',
        dataIndex: 'quotationTime',
        render: (text) => {
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
        sorter: (a, b) => {
          return (
            a.quotationTime.replace(/-| |:/g, '') -
            b.quotationTime.replace(/-| |:/g, '')
          );
        },
      },
      {
        title: '降幅比例',
        dataIndex: 'discountRange',
        sorter: (a, b) => {
          return a.discountRange - b.discountRange;
        },
        render: (text) => {
          if (!text) {
            return '--'
          }
          return text + '%'
        }
      },
      {
        title: '降幅金额',
        dataIndex: 'discountAmount',
        sorter: (a, b) => {
          return a.discountRange - b.discountRange;
        },
      },
      {
        title: '税额',
        dataIndex: 'tax',
        sorter: (a, b) => {
          return a.tax - b.tax;
        },
      },
      {
        title: '货品金额',
        dataIndex: 'totalPrice',
        sorter: (a, b) => {
          return a.totalPrice - b.totalPrice;
        },
      },
      {
        title: '含税合计',
        dataIndex: 'taxTotalPrice',
        sorter: (a, b) => {
          return a.taxTotalPrice - b.taxTotalPrice;
        },
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   render: (text) => {
      //     return <a href="javascript:;" onClick={() => this.goSingleOffer(record)}>查看报价</a>
      //   }
      // }
    ];

    function onChange(pagination, filters, sorter) {
      // 点击分页、筛选、排序时触发
      //console.log('各类参数是', pagination, filters, sorter);
    }

    const columns3 = [
      {
        title: '商品类别',
        dataIndex: 'productCategory',
        key: 'productCategory',
        render: (text) => {
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text) => {
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '规格',
        dataIndex: 'specifications',
        key: 'specifications',
        render: (text) => {
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render: (text) => {
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '物料描述',
        dataIndex: 'materialDescription',
        render: (text) => {
          return <CusPopover content={text}></CusPopover>;
        },
        key: 'materialDescription',
      },
      {
        title: '采购数量',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => {
          return a.count - b.count;
        },
      },
      {
        title: '附件',
        dataIndex: 'enclosure',
        key: 'enclosure',
        render: (text, record) => {
          if (!record.fileUrl) {
            return '无';
          }
          return (
            <a
              href={SystemConfig.systemConfigPath.dfsPathUrl(
                record.fileUrl + '?filename=' + record.fileName,
              )}
              download={record.fileName}
            >
              下载
            </a>
          );
        },
      },
    ];

    const columns4 = [
      {
        title: '操作人',
        dataIndex: 'operatorName',
        width: 100,
        key: 'operatorName',
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          return (
            <div>
              <p>{text}</p>
              <p>{record.userNo ? record.userNo : record.operatorId}</p>
            </div>
          );
        }
      },
      {
        title: '操作时间',
        dataIndex: 'operatorTime',
        width: 100,
        key: 'operatorTime',
        render: (text) => {
          if (!text) {
            return '--';
          }
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '事件说明',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '附件',
        width: 100,
        dataIndex: 'enclosure',
        key: 'enclosure',
        render: (text, record) => {
          if (!record.fileName || !record.fileUrl) {
            return '无';
          }
          return <a>下载</a>;
        },
      },
    ];

    const data4 = [
      {
        key: '1',
        operatorName: '测试账号',
        operatorTime: '2020-2-18 20:58:52',
        remark: '发布询价单提交审核',
      },
      {
        key: '2',
        operatorName: '测试账号',
        operatorTime: '2020-2-18 20:58:52',
        remark:
          '发起竞价悔标，供应商选择悔标结果，并附上理由；采购商查看，并给予处理意见',
      },
      {
        key: '3',
        operatorName: '测试账号',
        operatorTime: '2020-2-18 20:58:52',
        remark:
          '发起竞价悔标，供应商选择悔标结果，并附上理由；采购商查看，并给予处理意见',
      },
    ];

    const columns5 = [
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
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 180,
      },
      {
        title: '下单人',
        dataIndex: 'userName',
        key: 'userName',
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          return (
            <div>
              <p>{text}</p>
              <p>{record.phone}</p>
            </div>
          );
        },
      },
      {
        title: '金额（元）',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render:(text,record)=>{
          return <p>{text ? <NumberFormat value={text}/> : '--'}</p>
      }
      },
      {
        title: '下单时间',
        dataIndex: 'confirmTime',
        key: 'confirmTime',
        render: (text) => {
          if (!text) {
            return '--';
          }
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width:120,
        render:(text,record)=>{
          let orderStatus = record.orderStatus;
          let status = "";
          if(orderStatus == 10 || orderStatus == 23){
              status ="待确认";
          }else if(orderStatus == 20){
              status ="审核中";
          }else if(orderStatus == 30){
              status ="未发货";
          }else if(orderStatus == 40){
              status ="待收货";
          }else if(orderStatus == 50){
              status ="质保中";
          }else if(orderStatus == 70){
              status ="已完成";
          }else if(orderStatus == 100){
              status ="失效";
          }
          return <p>{status}</p>
      }
      },
      {
        title: '附属状态',
        dataIndex: 'affiliatedStatus',
        key: 'affiliatedStatus',
        width:200,
        render:(text,record)=>{
          let oldFlag = record.oldFlag;
          let orderStatus = record.orderStatus;
          let invoiceStatus = record.invoiceStatus;
          let buyerBalanceStatus = record.buyerBalanceStatus;
          let otherStatus = '';
          let balanceStatusStr = '';
          let orderFlagStr = '';
  
          if(oldFlag == 3){
              if(orderStatus == 100){
                 otherStatus = '--';
              }
              if(40 == orderStatus   ||   50 == orderStatus  || 70 == orderStatus){
                  if(0 == invoiceStatus){
                        otherStatus = "（未开票）";
                  }else if(1 == invoiceStatus){
                        otherStatus = "（已开票）";
                  }
              } 
              if(30 == orderStatus   || 40 == orderStatus   ||   50 == orderStatus  || 70 == orderStatus){
                  if(1 == buyerBalanceStatus || 4 == buyerBalanceStatus){
                        balanceStatusStr = "（待结算）";
                  }
                  if(30 == buyerBalanceStatus){
                        balanceStatusStr = "（待结算）";
                  }else if(40 == buyerBalanceStatus || 41 == buyerBalanceStatus){
                        balanceStatusStr = "（结算中）";
                  }else if(60 == buyerBalanceStatus){
                         balanceStatusStr = "（已结算）";
                  }
              }
              if(23 == orderStatus){
                  orderFlagStr = "（已驳回）"
              }
              if(10 == orderStatus){
                  orderFlagStr = "--"
              }
          }else{
              if (buyerBalanceStatus == 1) {
                    balanceStatusStr = " (待开票) ";
              } else if (buyerBalanceStatus == 4) {
                    balanceStatusStr = " (质保期) ";
              } else if (buyerBalanceStatus == 2) {
                    balanceStatusStr = " (已开票) ";
              } else if (buyerBalanceStatus == 10) {
                    balanceStatusStr = " (已完成) ";
              }else{
                balanceStatusStr = "--";
              }
              if(23 == orderStatus){
                  orderFlagStr = "（已驳回）"
              }
          }
              return <p>{otherStatus}{balanceStatusStr}{orderFlagStr}</p>
          }
      },
      {
        title: '操作',
        dataIndex: 'enclosure',
        key: 'enclosure',
        render: (text,record) => <a onClick={() => this.bidDetails(record.uuids)}>查看</a>,
      },
    ];

    const purchaseTitleWidth = { width: '80px' };
    const purchaseSetWidth = { width: '90px' };
    const bidSetWidth = { width: '120px' };
    const setwnameData = {
      leftData: [
        {
          title: '保证金缴纳:',
          content:
            allInfoData.marginType == 2
              ? '缴纳' + '/' + allInfoData.margin + '元'
              : '不缴纳',
        },
        {
          title: '缴纳规则:',
          content: !allInfoData.payType
            ? '--'
            : allInfoData.payType == 1
              ? '线上缴纳'
              : '线下缴纳',
        },
      ],
      rightData: [
        {
          title: '收款账户开户行:',
          content: allInfoData.accountBank ? allInfoData.accountBank : '--',
        },
        {
          title: '收款账户账号:',
          content: allInfoData.accountNumber ? allInfoData.accountNumber : '--',
        },
        {
          title: '收款账户名称:',
          content: allInfoData.accountName ? allInfoData.accountName : '--',
        },
        {
          title: '来款备注:',
          content: allInfoData.accountRemark ? allInfoData.accountRemark : '--',
        },
      ],
    };
    let offerMinusTime = {};
    if (
      this.state.contendRecordList &&
      this.state.contendRecordList.length < 1
    ) {
      offerMinusTime = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    } else {
      let startDate = this.state.contendRecordList[
        this.state.contendRecordList.length - 1
      ].quotationTime;
      let endDate =
        this.state.contendRecordList[0] &&
        this.state.contendRecordList[0].quotationTime;
      offerMinusTime = Util.timerCountDown(endDate, startDate);
    }
    //供应商要求
    const supplierData = [
      {
        title: '注册资金:',
        content: allInfoData.registeredCapital
          ? allInfoData.registeredCapital + ' 万元以上'
          : '--',
      },
      {
        title: '证照要求:',
        content: allInfoData.documentClaimName || '--',
      },
      {
        title: '经营地址:',
        content: (
          <SelectArea
            type="detail"
            areaData={allInfoData.areaRes ? allInfoData.areaRes : '不限制'}
          ></SelectArea>
        ),
      },
      // {
      //   title: '经营地址:',
      //   content:
      //     (
      //     <SelectArea
      //       type="detail"
      //       areaData={allInfoData.areaRes}
      //       style={{ display: 'inline' }}
      //     ></SelectArea>
      //     allInfoData.areaRes || '不限制'
      //   )
      // }
    ];

    return (
      <div id="react-print" >
        <div className={less.approval_container}>
          <BidHeader allInfoData={this.state.allInfoData}></BidHeader>

          {/* <div className={less.info_control_btn}> */}
          {/* <BaseAffix>
          <Button type='ghost' onClick={this.goBack}>关闭</Button>
          <Button type='primary' onClick={this.print}  >打印</Button> */}
          {/* <div className={less.go_top} onClick={this.goTop}>
            <img src={logo} alt="" />
          </div> */}
          {/* </BaseAffix> */}
          {/* </div> */}

          <div className={less.approval_info_container}>
            <Tabs activeKey={this.state.activeKey} onChange={this.tabsChange}>
              <TabPane
                tab="竞价详情"
                key="1"
                disabled={this.state.showBeforePublish}
              >
                <BidTable
                  title="报名详情"
                  extraS={
                    <div extraS="extraS" className={less.card_info_banner}>
                      <span>{`共${this.state.applyList.length}家`}</span>
                    </div>
                  }
                  extraBtn={
                    <div extraS="extraBtn" className={less.card_info_banner}>
                      <Button
                        type="primary"
                        onClick={this.showSaveMoney.bind()}
                      >
                        导出报价
                      </Button>
                      {/* <Button type='primary'>节资率</Button> */}
                    </div>
                  }
                >
                  <LoadMore
                    columns={columns}
                    dataSource={this.state.applyList}
                    x={1200}
                  ></LoadMore>
                </BidTable>
                <BidTable
                  title="竞价出价记录"
                  extraS={
                    <div className={less.card_info_banner}>
                      <span>{`共计${this.state.contendRecordList.length}次报价`}</span>
                    </div>
                  }
                  extraBtn={
                    <div
                      className={less.time_count + ' ' + less.card_info_banner}
                    >
                      <span>{`用时: ${offerMinusTime.days}天${offerMinusTime.hours}小时${offerMinusTime.minutes}分${offerMinusTime.seconds}秒`}</span>
                      <span>{`剩余时间: ${this.state.timerCountDown.days}天${this.state.timerCountDown.hours}小时${this.state.timerCountDown.minutes}分${this.state.timerCountDown.seconds}秒`}</span>
                    </div>
                  }
                >
                  <LoadMore
                    columns={columns2}
                    dataSource={this.state.contendRecordList}
                  ></LoadMore>
                </BidTable>
              </TabPane>
              <TabPane tab="详情信息" key="2">
                <div className={less.buyer_req}>
                  <BidInfo title="采购要求">
                    <div position="left">
                      <div>
                        <span style={purchaseTitleWidth}>付款方式:</span>
                        <p>
                          {!allInfoData.payWay
                            ? '--'
                            : allInfoData.payWay == 1
                              ? '现付/汇款'
                              : '铁建银信'}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>付款账期:</span>
                        <p>{allInfoData.payDay || '--'}</p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>发票要求:</span>
                        <p>
                          {!allInfoData.invoice
                            ? '--'
                            : allInfoData.invoice == 1
                              ? '增值税专用发票'
                              : '增值税通用发票'}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>预计付款日:</span>
                        <p>
                          {allInfoData.advancePaymentDate
                            ? allInfoData.advancePaymentDate.slice(0, 10)
                            : '--'}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>期望到货日:</span>
                        <p>
                          {allInfoData.expectReceiptDate
                            ? allInfoData.expectReceiptDate.slice(0, 10)
                            : '--'}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>发货要求:</span>
                        <p>
                          {!allInfoData.deliveryType
                            ? '--'
                            : allInfoData.deliveryType == 1
                              ? '统一发货'
                              : '分批发货'}
                        </p>
                      </div>
                    </div>
                    <div position="right">
                      <div>
                        <span style={purchaseTitleWidth}>采购类型:</span>
                        <p>
                          {!allInfoData.purchaseType
                            ? '--'
                            : allInfoData.purchaseType == 1
                              ? '单次采购'
                              : '长期协议'}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>协议有效期:</span>
                        <p>
                          {(allInfoData.agreementStartDate
                            ? allInfoData.agreementStartDate
                            : '--') +
                            '/' +
                            (allInfoData.agreementEndDate
                              ? allInfoData.agreementEndDate
                              : '--')}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>质保金收取:</span>
                        <p>
                          {!allInfoData.warranty
                            ? '--'
                            : allInfoData.warranty == 1
                              ? '收取'
                              : '不收取'}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>质保金比例:</span>
                        <p>
                          {allInfoData.warrantyRatio
                            ? allInfoData.warrantyRatio + '%'
                            : '--'}
                        </p>
                      </div>
                      <div>
                        <span style={purchaseTitleWidth}>质保期:</span>
                        <p>
                          {allInfoData.warrantyDay
                            ? allInfoData.warrantyDay + '天'
                            : '--'}
                        </p>
                      </div>
                    </div>
                  </BidInfo>
                </div>

                <BidInfo title="收货地址">
                  <div position="left">
                    <div>
                      <span>收货人:</span>
                      <p>
                        {(allInfoData.consigneeName
                          ? allInfoData.consigneeName
                          : '--') +
                          '/' +
                          (allInfoData.consigneePhone
                            ? allInfoData.consigneePhone
                            : '--')}
                      </p>
                    </div>
                    <div>
                      <span>收货地址:</span>
                      <p>{allInfoData.address ? allInfoData.address : '--'}</p>
                    </div>
                  </div>
                </BidInfo>

                <Card title="供应商要求">
                  <CardInfo bottomData={supplierData}></CardInfo>
                </Card>

                <Card title="补充说明">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: allInfoData.explanation
                        ? allInfoData.explanation
                        : '--',
                    }}
                    style={{ fontSize: '14px' }}
                  ></div>
                </Card>

                <Card
                  title="竞价附件"
                  extra={
                    <Button
                      type="primary"
                      style={{ marginTop: '-4px' }}
                      onClick={this.downloadAll.bind(this)}
                    >
                      下载全部附件
                    </Button>
                  }
                >
                  <div className={less.bid_enclosure}>
                    {allInfoData.fileList && allInfoData.fileList.length > 0
                      ? allInfoData.fileList.map((item, index) => {
                        return (
                          <a
                            href={SystemConfig.systemConfigPath.dfsPathUrl(
                              item.fileUrl + '?filename=' + item.fileName,
                            )}
                            key={index}
                          >
                            {item.fileName}
                          </a>
                        );
                      })
                      : '--'}
                  </div>
                </Card>

                <BidInfo title="竞价设置">
                  <div position="left">
                    <div>
                      <span style={purchaseSetWidth}>隐私设置:</span>
                      <p>
                        {!allInfoData.privacy
                          ? '--'
                          : allInfoData.privacy == 1
                            ? '公开联系人信息'
                            : '联系人信息报名后可见'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>自动延长设置:</span>
                      <p>
                        {!allInfoData.extendFlag
                          ? '--'
                          : allInfoData.extendFlag == 1
                            ? '允许自动延长'
                            : '不允许自动延长'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>差价限制:</span>
                      <p>
                        {!allInfoData.priceLimit
                          ? '--'
                          : allInfoData.priceLimit == 1
                            ? '小于全场最低价'
                            : '小于上次报价'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>调价方式:</span>
                      <p>
                        {!allInfoData.priceWay
                          ? '--'
                          : allInfoData.priceWay == 1
                            ? '按比例调整'
                            : '按金额调整'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>调价幅度:</span>
                      <p>
                        {allInfoData.priceRange
                          ? allInfoData.priceRange +
                          (allInfoData.priceWay == 1 ? '%' : '元')
                          : '--'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>开盘价格:</span>
                      <p>
                        {!allInfoData.openingPriceFlag
                          ? '--'
                          : allInfoData.openingPriceFlag == 1
                            ? '设置开盘价' +
                            '/' +
                            (allInfoData.openingPrice
                              ? allInfoData.openingPrice
                              : '--')
                            : '不设开盘价'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>保密规则:</span>
                      <p>
                        {!allInfoData.secretRules
                          ? '--'
                          : allInfoData.secretRules == 1
                            ? '供应商竞价大厅不可见其他供应商名称 '
                            : '供应商竞价大厅可见其他供应商名称'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>成交公告:</span>
                      <p>
                        {!allInfoData.showNotice
                          ? '--'
                          : allInfoData.showNotice == 1
                            ? '自动发布竞价公示 '
                            : '手动发布竞价公示'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>竞价单位:</span>
                      <p>
                        {!allInfoData.showUnit
                          ? '--'
                          : allInfoData.showUnit == 1
                            ? '显示当前发布单位名称 '
                            : '隐藏当前发布单位名称'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>自动匹配:</span>
                      <p>
                        {!allInfoData.matching
                          ? '--'
                          : allInfoData.matching == 1
                            ? '邮件/站内信通知 '
                            : '短信通知'}
                      </p>
                    </div>
                    <div>
                      <span style={purchaseSetWidth}>竞价方式:</span>
                      <p>
                        {!allInfoData.way
                          ? '--'
                          : allInfoData.way == 1
                            ? '公开竞价 '
                            : '邀请竞价'}
                      </p>
                    </div>
                  </div>
                  <div position="right">
                    <div>
                      <span style={{ width: '120px' }}>竞价有人数限制:</span>
                      <a href="javascript:;">
                        {allInfoData.limitPeople
                          ? allInfoData.limitPeople + '人'
                          : '--'}
                      </a>
                    </div>
                  </div>

                  <div
                    position="bottom"
                    style={{
                      display: `${allInfoData.way == 1 ? 'none' : 'block'}`,
                    }}
                  >
                    <div>
                      <span style={purchaseSetWidth}>邀请名单:</span>
                      <div style={{ display: 'inline-block', width: '800px' }}>
                        <ul className={less.wname_list_container}>
                          {allInfoData.contendWhitelists &&
                            allInfoData.contendJoins.length > 0 ? (
                              allInfoData.contendJoins.map((item, index) => {
                                let tempName = item.companyName || '--';
                                let tempStatus =
                                  item.applyStatus == 2 ? '已报名' : '未报名';
                                let signUp = item.applyStatus == 2 ? true : false;
                                if (tempName.length > 20) {
                                  tempName =
                                    tempName.slice(0, 10) +
                                    '...' +
                                    tempName.slice(tempName.length - 9);
                                }
                                return (
                                  <li key={index} className={less.wname_list}>
                                    <p>{tempName}</p>
                                    <span
                                      className={
                                        signUp
                                          ? less.already_color
                                          : less.unready_color
                                      }
                                    >
                                      {tempStatus}
                                    </span>
                                  </li>
                                );
                              })
                            ) : (
                              <p>--</p>
                            )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </BidInfo>
              </TabPane>
              <TabPane tab="商品信息" key="3">
                <BidTable>
                  <div className={less.table_container}>
                    <div className={less.order_total}>
                      <span>{`共${allInfoData.contendProducts
                        ? allInfoData.contendProducts.length
                        : 0
                        }件商品`}</span>
                    </div>
                    <LoadMore
                      columns={columns3}
                      dataSource={allInfoData.contendProducts}
                    ></LoadMore>
                  </div>
                </BidTable>
              </TabPane>

              <TabPane tab="保证金" key="4">
                {/* <Card title='保证金设置' extra={<Button type='primary' style={{ marginTop: '4px' }} onClick={this.goBondAdm.bind(this, this.state.allInfoData.uuids)}>保证金管理</Button>}> */}
                {/* <Card title='保证金设置' extra={<Button type='primary' style={{ marginTop: '4px' }}>保证金管理</Button>}> */}
                <CardInfo
                  leftData={setwnameData.leftData}
                  rightData={setwnameData.rightData}
                  type='bid'
                  width={bidSetWidth}
                ></CardInfo>
                <div className={less.wname_line}></div>
                <div className={less.wname_list_banner}>
                  <span>保证金白名单:</span>
                  <div style={{ display: 'inline-block', width: '760px' }}>
                    <ul className={less.wname_list_container}>
                      {allInfoData.contendWhitelists &&
                        allInfoData.contendWhitelists.length > 0 ? (
                          allInfoData.contendWhitelists.map((item, index) => {
                            let tempName = item.companyName || '--';
                            let tempStatus =
                              item.apply == 2 ? '已报名' : '未报名';
                            let signUp = item.apply == 2 ? true : false;
                            if (tempName.length > 20) {
                              tempName =
                                tempName.slice(0, 10) +
                                '...' +
                                tempName.slice(tempName.length - 9);
                            }
                            return (
                              <li key={index} className={less.wname_list}>
                                <p>{tempName}</p>
                                <span
                                  className={
                                    signUp
                                      ? less.already_color
                                      : less.unready_color
                                  }
                                >
                                  {tempStatus}
                                </span>
                              </li>
                            );
                          })
                        ) : (
                          <p className={less.wname_list_temp}>--</p>
                        )}
                    </ul>
                  </div>
                </div>
                {/* </Card> */}
              </TabPane>
              <TabPane
                tab="订单信息"
                key="5"
                disabled={this.state.showBeforePublish}
              >
                <BidTable>
                  <div className={less.table_container}>
                    <div className={less.order_total}>
                      <span>{`共${this.state.orderList.length}笔订单`}</span>
                    </div>
                    <LoadMore
                      columns={columns5}
                      dataSource={this.state.orderList}
                    ></LoadMore>
                  </div>
                </BidTable>
              </TabPane>
              <TabPane tab="竞价单日志" key="6">
                <BidTable>
                  <div className={less.table_container}>
                    <LoadMore
                      columns={columns4}
                      dataSource={this.state.contendLogList}
                    ></LoadMore>
                  </div>
                </BidTable>
              </TabPane>
            </Tabs>
          </div>
          <BaseAffix>
            <div className={less.info_control_btn}>
              <Button type="ghost" onClick={this.goBack}>
                关闭
              </Button>
              <Button type="primary" onClick={this.print}>
                打印
              </Button>
              <div className={less.go_top} onClick={this.goTop}>
                <img src={logo} alt="" />
              </div>
            </div>
          </BaseAffix>
        </div>
        {/*节资率*/}
        <Modal
          title="导出报价（节资率）"
          visible={this.state.saveMoneyVisible}
          width={550}
          onCancel={this.hideSaveMoney}
          footer={
            [
              <Button type="ghost" onClick={this.hideSaveMoney}>
                取消
            </Button>,
              <Button
                type="primary"
                onClick={this.exprotSaveMoneyData.bind(this, 1)}
              >
                导出
            </Button>,
            ]}
        >
          <Tabs>
            <TabPane tab="行业标准" key="1">
              <p className={less.tip}>
                说明：以中标人报价金额与行内商品标准价格比对计算节资率
              </p>
              <div className={less.telTips}>
                <p>
                  计算公式：(含税中标金额-行业商品标准金额)/含税中标金额*100
                </p>
              </div>
            </TabPane>
            {/* <TabPane tab="商品规则" key="2">
                        <div className={less.export_modal_class}>
                          <div className={less.telTipsTop}>
                            <span>选择有效报价</span>
                            <span style={{ marginLeft: "25%" }}>报价金额</span>
                          </div>
                          <CheckboxGroup defaultValue={this.state.defaultSaveMoneyCheckValue} options={this.getSMQuotationsCheckbox()} onChange={this.quotationsCheckboxChange1} />
                        </div>
                        <div className={less.telTips}>
                            <p>说明：在选择的供应商中以商城排除规则（大于或小于其中标价的250%）计算节资率</p>
                            <p>计算公式：（有效报价合计/有效报价供应商数-中标金额）/中标金额*100%</p>
                        </div>
                        </TabPane>
                        <TabPane tab="手动选择" key="3">
                        <div className={less.export_modal_class}>
                          <div className={less.telTipsTop}>
                            <span>选择有效报价</span>
                            <span style={{ marginLeft: "25%" }}>报价金额</span>
                          </div>
                          <CheckboxGroup defaultValue={this.state.defaultSaveMoneyCheckValue} options={this.getSMQuotationsCheckbox()} onChange={this.quotationsCheckboxChange1} />
                        </div>
                        <div className={less.telTips}>
                            <p>计算公式：平均报价金额=有效报价金额合计/有效报价数量</p>
                            <p>（平均报价金额-报价金额）/平均金额*100%</p>
                        </div>
                        </TabPane> */}
          </Tabs>
        </Modal>
      </div >
    );
  }
}

export default BidDetail;
