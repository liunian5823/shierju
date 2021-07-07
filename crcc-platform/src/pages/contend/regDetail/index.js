import React, { Component } from 'react';
import CardInfo from '../components/cardInfo/index.js';
import {
  Card,
  Table,
  Button,
  Icon,
  Radio,
  Form,
  Input,
  Upload,
  message,
  Modal,
} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
import LoadMore from '../components/loadMore';
import less from './index.less';
import PlatForm from './platForm';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
class RegDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      radioVal: '1',
      regInfo: {},
      //处理悔标弹窗状态
      handleVisible: false,
      //用户详情
      allInfoData: {},
      regQuitLogList: [],
      platFormMethed: () => { },
    };
  }
  componentWillMount() {
    console.log('props', this.props);
    // const rect = document.getElementById('card').getClientRects()
    // document.getElementById('pageBtns').style.width = rect[0].width + 'px';
    let uuids = this.props.match.params.uuids;
    let contendUuids = this.props.match.params.contendUuids;
    this.getRegInfo(uuids);
    this.getAllInfoData(contendUuids);
    this.getQuitLogList(contendUuids);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  //获取用户详情
  getAllInfoData(uuids) {
    axios
      .get('@/platform/contend/detail', {
        params: {
          uuids,
        },
      })
      .then((res) => {
        console.log(res.data, '-----');
        if (res.code == 200) {
          this.setState({
            allInfoData: res.data || {},
          });
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  }
  //日志列表

  getQuitLogList(uuids) {
    axios
      .get('@/platform/log/quitLog', {
        params: {
          uuids,
        },
      })
      .then((res) => {
        if (res.code == 200) {
          this.setState({
            regQuitLogList: res.data || [],
          });
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  }
  //获取悔标详情
  getRegInfo(uuids) {
    axios
      .get('@/platform/quit/get', {
        params: {
          uuids,
        },
      })
      .then((res) => {
        if (res.code == 200) {
          this.setState({
            regInfo: res.data || {},
          });
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  }
  //点击处理调用
  regPlatform(text) {
    let tempOp = this.state.platFormMethed();
    let options = {
      uuids: this.props.match.params.uuids,
      workUuids: this.state.regInfo.workUuids,
    };
    if (text === '处理悔标') {
      if (!tempOp) return;
      this.setState({
        handleVisible: true,
      });
    } else if (text === '受理悔标' || text === '重新受理') {
      this.acceptanceRegChange(options);
    }
    else if (text === '释放受理') {
      this.reacceptanceRegChange(options);
    }
  }
  //处理弹窗确定调用
  regPlatformModalOk() {
    let tempOp = this.state.platFormMethed();
    let options = {
      uuids: this.props.match.params.uuids,
      workUuids: this.state.regInfo.workUuids,
    };
    options.platReason = tempOp.platReason;
    options.platResult = tempOp.platResult;
    options.platFileUrl = tempOp.filePath;
    options.platFileName = tempOp.fileName;
    options.memo = tempOp.memo;
    this.handleControlClick(options);
  }
  regPlatformModalCancel = () => {
    this.setState({
      handleVisible: false,
    });
  };
  //受理悔标
  acceptanceRegChange = (options) => {
    axios
      .post('@/platform/quit/accept', options)
      .then((r) => {
        if (r.code == 200) {
          message.success(r.msg);
          this.timer = setTimeout(() => {
            this.props.history.push('/platInvoice/reglist');
            // window.open(systemConfigPath.jumpPage(`/regdetail/handle/${record.uuids}/${record.contendUuids}`));
            // this.props.history.push(`/platInvoice/reglist/regdetail/handle/${this.props.match.params.uuids}/${this.props.match.params.contendUuids}`);
          }, 1000);
        } else {
          message.error(r.msg);
        }
      })
      .catch((err) => {
        message.error(err.msg);
      });
  };
  //释放受理
  reacceptanceRegChange = (options) => {
    axios
      .post('@/platform/quit/release', options)
      .then((r) => {
        if (r.code == 200) {
          message.success(r.msg);
          this.timer = setTimeout(() => {
            this.props.history.push('/platInvoice/reglist');
            // window.open(systemConfigPath.jumpPage(`/regdetail/handle/${record.uuids}/${record.contendUuids}`));
            // this.props.history.push(`/platInvoice/reglist/regdetail/handle/${this.props.match.params.uuids}/${this.props.match.params.contendUuids}`);
          }, 1000);
        } else {
          message.error(r.msg);
        }
      })
      .catch((err) => {
        message.error(err.msg);
      });
  };
  //处理悔标操作
  handleControlClick(options = {}) {
    axios
      .post('@/platform/quit/process', options)
      .then((r) => {
        if (r.code == 200) {
          message.success(r.msg);
          this.timer = setTimeout(() => {
            this.props.history.push('/platInvoice/regList');
          }, 2000);
        } else {
          message.error(r.msg);
        }
      })
      .catch((err) => {
        message.error(err.msg);
      });
  }
  //返回
  goBack = () => {
    this.props.history.push('/platInvoice/reglist');
  };
  radioChange = (e) => {
    this.setState({
      radioVal: e.target.value,
    });
  };
  //判断操作按钮显示方式
  makeBtnContrl = () => {
    let btnControlAry = [];
    if (this.props.match.params.type === 'view') {
      btnControlAry = [];
    } else if (this.props.match.params.type === 'acceptance') {
      btnControlAry = ['受理悔标'];
    } else if (this.props.match.params.type === 'handle') {
      btnControlAry = ['处理悔标', '重新受理'];
    } else if (this.props.match.params.type === 'reacceptance') {
      btnControlAry = ['释放受理'];
    }
    return btnControlAry;
  };

  //调用form子组件方法
  changePlatFormMetheds(callback) {
    this.setState({
      platFormMethed: callback,
    });
  }
  jump = () => {
    window.open(systemConfigPath.jumpPage(`platInvoice/bidlist/bidDetail/${this.props.match.params.contendUuids}`));
    // window.open(
    //   `/#/platInvoice/bidlist/bidDetail/${this.props.match.params.contendUuids}`,
    // );
    ;
  }
  render() {
    const regInfo = this.state.regInfo;
    const allInfoData = this.state.allInfoData;
    const bidInfoLeft = [
      {
        title: '竞价单:',
        content: <a onClick={this.jump}>{allInfoData.name || '--'}</a>,
      },
      {
        title: '竞价单号:',
        content: allInfoData.sn || '--',
      },
      {
        title: '工单号:',
        content: regInfo.workOrdersCode || '--',
      },
      {
        title: '采购商名称:',
        content: allInfoData.companyName || '--',
      },
      {
        title: '项目部:',
        content: allInfoData.organizationName || '--',
      },
      {
        title: '采购商联系人:',
        content:
          (allInfoData.contactMan || '--') +
          '/' +
          (allInfoData.contactPhone || '--'),
      },
    ];
    const bidInfoRight = [
      // {
      //   title: '供应商名称:',
      //   content: regInfo.supplierName  || '--'
      // },
      // {
      //   title: '供应商联系人:',
      //   content: allInfoData.contactMan  || '--' + allInfoData.contactPhone  || '--'
      // },
      {
        title: '保证金金额:',
        content: allInfoData.margin || '--',
      },
      {
        title: '报价金额:',
        content: regInfo.quotationPrice || '--',
      },
      {
        title: '竞价截止时间:',
        content: allInfoData.endDate || '--',
      },
    ];
    const bidInfoWidth = {
      width: '100px',
    };

    const dataSource = [
      {
        key: '1',
        '1': '北京有限公司',
        '2': '2020-2-18 20:58:52',
        '3':
          '发起竞价悔标，供应商选择悔标结果，并附上理由；采购商查看，并给予处理意见',
      },
      {
        key: '2',
        '1': '北京有限公司',
        '2': '2020-2-18 20:58:52',
        '3':
          '发起竞价悔标，供应商选择悔标结果，并附上理由；采购商查看，并给予处理意见',
      },
      {
        key: '3',
        '1': '北京有限公司',
        '2': '2020-2-18 20:58:52',
        '3':
          '发起竞价悔标，供应商选择悔标结果，并附上理由；采购商查看，并给予处理意见',
      },
      {
        key: '4',
        '1': '北京有限公司',
        '2': '2020-2-18 20:58:52',
        '3':
          '发起竞价悔标，供应商选择悔标结果，并附上理由；采购商查看，并给予处理意见',
      },
    ];

    const dateStyle = {
      textAlign: 'right',
      marginRight: '20px',
      width: '70px',
    };
    const columns = [
      {
        title: '操作人',
        width: 100,
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '操作时间',
        width: 100,
        dataIndex: 'operatorTime',
        key: 'operatorTime',
        render: (text) => {
          if (!text) {
            return '--';
          }
          let textAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{textAry[0]}</p>
              <p>{textAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '事件说明',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];

    //悔标申请数据
    const regApplyData = {
      bottomData: [
        {
          title: '悔标供应商:',
          content: regInfo.supplierName || '--',
        },
        {
          title: '申请人:',
          content: regInfo.userName || '--' + regInfo.phone || '--',
        },
        {
          title: '悔标理由:',
          content: regInfo.supplierReason || '--',
        },
        {
          title: '悔标结果:',
          content: !regInfo.supplierResult
            ? '--'
            : regInfo.supplierResult == 1
              ? '扣除保证金'
              : '不扣除保证金',
        },
        {
          title: '附件:',
          content: regInfo.supplierFileUrl ? (
            <a
              href={SystemConfig.systemConfigPath.dfsPathUrl(
                regInfo.supplierFileUrl
              )}
              download={regInfo.supplierFileName}
            >
              {regInfo.supplierFileName}
            </a>
          ) : (
              '无'
            ),
        },
      ],
    };
    //悔标处理数据
    const regHandleData = {
      bottomData: [
        {
          title: '处理采购商:',
          content: regInfo.purchaseCompanyName || '--',
        },
        {
          title: '处理人:',
          content:
            (regInfo.purchaserUserName || '--') +
            '/' +
            (regInfo.purchaserUserPhone || '--'),
        },
        {
          title: '处理意见:',
          content: regInfo.platReason || '--',
        },
        {
          title: '处理结果:',
          content: !regInfo.purchaserResult
            ? '--'
            : regInfo.purchaserResult == 1
              ? '同意'
              : '不同意',
        },
      ],
    };
    let btnControlAry = this.makeBtnContrl();
    let platResult = this.state.platFormMethed()
      ? this.state.platFormMethed().platResult
      : '--';
    if (platResult == 1) {
      platResult = '扣除保证金';
    } else if (platResult == 2) {
      platResult = '不扣除保证金';
    }
    //当前页面操作
    const type = this.props.match.params.type;
    const disStatus = type === 'handle' ? 'block' : 'none';
    return (
      <div className={less.reg_detail_container}>
        <div id="pageBtns" className={less.reg_control}>
          <Button type="ghost" onClick={this.goBack}>
            返回
          </Button>
          {btnControlAry.map((item, index) => {
            return (
              <Button
                type="primary"
                key={index}
                onClick={() => {
                  this.regPlatform(item);
                }}
              >
                {item}
              </Button>
            );
          })}
        </div>
        <CardInfo
          title="竞价信息"
          leftData={bidInfoLeft}
          rightData={bidInfoRight}
          width={bidInfoWidth}
        ></CardInfo>
        <CardInfo
          title="悔标申请"
          bottomData={regApplyData.bottomData}
          width={bidInfoWidth}
        ></CardInfo>
        <CardInfo
          title="悔标处理"
          bottomData={regHandleData.bottomData}
          width={bidInfoWidth}
        ></CardInfo>
        <div style={{ display: disStatus }}>
          <PlatForm
            changePlatFormMetheds={this.changePlatFormMetheds.bind(this)}
          // that={this}
          ></PlatForm>
        </div>

        <Card title="处理日志">
          <LoadMore
            columns={columns}
            dataSource={this.state.regQuitLogList}
          ></LoadMore>
        </Card>
        {/* 处理悔标弹窗 */}
        <Modal
          title="处理悔标"
          visible={this.state.handleVisible}
          onOk={() => {
            this.regPlatformModalOk();
          }}
          onCancel={this.regPlatformModalCancel}
        >
          <div className={less.reg_handle_container}>
            <Icon type="exclamation-circle" />
            <span>悔标处理意见:</span>
            <span>{platResult}</span>
          </div>
        </Modal>
      </div>
    );
  }
}

export default RegDetail;
