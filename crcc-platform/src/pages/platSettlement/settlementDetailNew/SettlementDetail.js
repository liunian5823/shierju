import { Select,Card,Row,Col,Input,Button,Form, Icon, Table, Divider, Menu, Dropdown, Modal, message, DatePicker, Tabs,Checkbox, Pagination,Popconfirm,Alert, Tooltip} from 'antd';
import {tablePagination_, btnName_} from "@/utils/config/componentDefine"
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import BaseAffix from '@/components/baseAffix';
import moment from 'moment';
import { connect } from 'react-redux';
import api from '@/framework/axios';
import {NumberFormat} from "@/components/gaoda/Format";
import BaseDetails from '@/components/baseDetails';
import ListOrders from './listOrders/ListOrders';
import ListOrderItems from './listOrderItems/ListOrderItems';
import ListInvocies from './listInvoices/ListInvoices';
import ListCapitalDetails from './listCapitalDetails/ListCapitalDetails';
import ListShareBill from './listShareBill/ListShareBill';
import ListEcAcceptanceBill from './listEcAcceptanceBill/ListEcAcceptanceBill';

import ListSettlementLogs from './listSettlementLogs/ListSettlementLogs';
import titleImg from '../../../static/iconfont/settlementDetail.png';
import {exportFile} from '@/utils/urlUtils';
import "./settlementDetail.css";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class SettlementDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:{

            },
            dataSettlement:{},
            money:{},
            docunment:{},
            getOrderList:[],
            offLine:{},
            //发送验证码按钮状态
            phoneStatus: false,
            //验证码倒计时
            countDown: 60,
            phone:'',
            visible:false,
            visible2:false,
        }
    }

    componentWillMount() {
        this.handleSearch();
        this.getPhone();
        

    };
    // getMoney(msg){
    //     this.setState({
    //         money:msg
    //     })
        

    // }

    //加载数据
    handleSearch = ()=>{
        let params = {};
        params.id = this.props.match.params.id;
        api.ajax("GET", "@/platform/settlementDetail/findPurchaseSettlement", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
    }

    getPhone = () =>{
        api.ajax("GET", "@/platform/financehang/thawingPhone", {
        }
        ).then((r) => {
            if(r.code == 200){
                this.setState({
                    phone:r.data
                })
            }
        })
    }

    download = ()=>{
        let exportUrl = "/financial/platSupplierSettlementController/purchaserDownload";
        let params = {}
        params.id = this.props.match.params.id;
        params.filename = this.state.dataSource.settlementNo;
        exportFile(exportUrl,params);
    }

    showModal=()=> {
        this.setState({
          visible: true,
        });
      }
      showModalGoods=()=> {
        this.setState({
          visible2:true,
        });
      }

      handleOk(type) {
        this.props.form.validateFields((err,values)=>{
            console.log('999',err)
            if (err) return;
            const { dataSource } = this.state
             let params = {
            uuids: dataSource.uuids
        }
        console.log('9999999',type)
        axios.get("@/contend/phone/msg/provingPhoneMsg", {
            params: { phone: this.state.phone, code: values.code }
          }).then((r)=>{
              if(r.data){
                if(type == 2){
                    axios.get('@/settlement/settlement/thawingGoods', { params }).then((res) => {
                        if (res.data.code = '000000') {
                            message.success(res.data.msg);
                            setTimeout(()=>{
                                this.setState({ 
                                    visible: false,
                                    phoneStatus : false
                                 })
                                 location.reload();
                            },1000)
                            
                        }
                    })
                }else{
                    axios.get('@/settlement/settlement/thawingWarranty', { params }).then((res) => {
                        if (res.data.code = '000000') {
                            message.success(res.data.msg);
                            setTimeout(()=>{
                                this.setState({ 
                                    visible: false,
                                    phoneStatus : false
                                 })
                                 location.reload();
                            },1000)
                            
                        }
                    })
                }
              }else{
                message.error(r.msg);
                this.setState({
                    phoneStatus : false
                  })
              }
            

          })
        
        
        

        })
        
      }
      handleCancel=(e)=> {
        console.log(e);
        this.setState({
          visible: false,
          visible2:false,
        });
      }

    //打印
    viewPrint=()=>{
        // let exportUrl = "/financial/platSupplierSettlementController/viewPrint.pdf";
        // let params = {}
        // params.id = this.props.match.params.id;
        // params.type = "0"   //采购商;
        // //window.location.href = systemConfigPath.axiosUrl(getUrlByParam(exportUrl, params));
        // window.open(systemConfigPath.axiosUrl(getUrlByParam(exportUrl, params)));
         let url = getUrlByParam('/order/pdf/createPurchasePdf', {
            uuids: this.state.dataSource.uuids,
        });
        window.open(systemConfigPath.axiosUrl(url))
    }

    getInitialState=()=> {
        return { visible: false };
      }
      jumpVoucher = () => {
        let params = {
            uuids: this.state.dataSource.uuids,
        }
        window.open(systemConfigPath.jumpPage(getUrlByParam('/financialManagement/settlevoucher', params)))
      }
    //获取手机验证码
  sendMobileCode() {
    this.setState({
      phoneStatus: true
    }, () => {
      let tempNum = 59;
      this.phoneTimer = setInterval(() => {
        if (tempNum <= 0) {
          this.setState({
            phoneStatus: false
          });
          clearInterval(this.phoneTimer);

        }
        this.setState({
          countDown: tempNum
        })
        tempNum -= 1
      }, 1000);
    })
    axios.get("@/settlement/pay/sendCodes", {
      params: { phone: this.state.phone }
    }).then(r => {
      if (r.code == 200) {
        message.success('发送成功')
      }
    }).catch(err => {
      message.error(err.msg)
    });

  }
      //支付方式
      payStaus = (status) => {
        if (!status) {
            return;
          }
          let tempStatus = '';
          switch (status) {
            case 1:
              tempStatus = '网银支付';
              break;
            case 2:
              tempStatus = '资金账户余额';
              break;
            case 3:
              tempStatus = '汇款转账';
              break;
            case 4:
              tempStatus = '共享中心付款';
              break;
            case 5:
                tempStatus = '铁建银信';
                break;
            case 6:
                tempStatus = '其他';
                break;
            default:
              break;
          }
          return tempStatus;
      }
      //订单状态
      orderStaus = (status) => {
        if (!status) {
            return;
          }
          let tempStatus = '';
          switch (status) {
            case 10:
              tempStatus = '待确认';
              break;
            case 12:
              tempStatus = '待物流报价';
              break;
            case 14:
              tempStatus = '物流报价待确认';
              break;
            case 16:
              tempStatus = '物流报价未成交';
              break;
            case 20:
                tempStatus = '已确认待审核';
                break;
            case 23:
                tempStatus = '审核驳回';
                break;
            case 25:
                tempStatus = '审核通过待付款';
                break;
            case 26:
                tempStatus = '付款中';
                break;
            case 28:
                tempStatus = '发货申请';
                break;
            case 30:
                tempStatus = '待发货';
                break;
            case 40:
                tempStatus = '已发货待收货';
                break;
            case 50:
                tempStatus = '已收货';
                break;
            case 70:
                tempStatus = '订单完成';
                break;
            case 100:
                tempStatus = '订单取消';
                break;
            case 110:
                tempStatus = '订单退款';
                break;
            default:
              break;
          }
          return tempStatus;
      }
      columns = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width:180,
        render: (text, record, index) => (
            <p style={{width:"180px"}}>
                <span title={text}>{text?text:'-'}</span>
            </p>
        )
    },
    {
        title: '下单人',
        dataIndex: 'userName',
        key: 'userName',
        width:100,
        render: (text, record, index) => (
            <div style={{width:"100px"}}>
                <p title={text}>{text?text:'-'}</p>
                <p title={record.userNo}>{record.userNo?record.userNo:'-'}</p>
            </div>
        )
    }, 
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:88,
        render: (text, record, index) => (
            <div style={{width:"62px"}}>
                <p style={{textAlign:'right'}} title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</p>
                <p style={{textAlign:'right'}} title={text?moment(text).format("HH:mm:ss"):"-"}>{text?moment(text).format("HH:mm:ss"):"-"}</p>
            </div>
        )
    },
    {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width:108,
        render: (text, record, index) => {
            if(!text){
                return '--'
            }
            let statusStr = this.orderStaus(text);
            let color;
                switch (statusStr){
                    case '待发货':
                        color = '#fad369';
                        break;
                }
            return <div >
                <p style={{color: `${color}`}}>{statusStr?statusStr:'-'}</p>
            </div>
              
            
        }
    },
    // {
    //     title: '税额',
    //     dataIndex: 'taxAmount',
    //     key: 'taxAmount',
    //     className:'text_align_right',
    //     width:116,
    //     render: (text, record, index) => (
    //         <p style={{width:"98px",float:"right"}}>
    //             <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
    //         </p>
    //     )
    // },
     {
        title: '总金额(元)',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        className:'text_align_right',
        width:116,
        render: (text, record, index) => (
            <p style={{width:"98px",float:"right"}}>
                <span title={text}>{text || text == 0?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },
    // {
    //     title: '税价合计',
    //     dataIndex: 'totalPrice',
    //     key: 'totalPrice',
    //     className:'text_align_right',
    //     width:116,
    //     render: (text, record, index) => (
    //         <p style={{width:"98px",float:"right"}}>
    //             <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
    //         </p>
    //     )
    // }
    {
        title: '本次支付金额(元)',
        dataIndex: 'payingAmount',
        key: 'payingAmount',
        className:'text_align_right',
        width:116,
        render: (text, record, index) => (
            <p style={{width:"98px",float:"right"}}>
                <span title={text}>{text || text == 0?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },
    {
        title: '本次支付比例',
        dataIndex: 'payingAmountRate',
        key: 'payingAmountRate',
        className:'text_align_right',
        width:116,
        render: (text, record, index) => (
            <p style={{width:"98px",float:"right"}}>
                <span title={text}>{((record.payingAmount/record.totalPrice)*100).toFixed(2)+'%'}</span>
            </p>
        )
    },
];

    render() {
        const { getFieldProps } = this.props.form;
        const phoneStr = this.state.phone ? this.state.phone.slice(0, 3) + '***' + this.state.phone.slice( this.state.phone.length - 4) : '000***0000';
        return (
            <div id="purchaserSettlementDetail" className="purchaserSettlementDetail">
                <Card bordered={false} className="mb10">
                    <Row  {...ComponentDefine.row_} style={{paddingBottom:"18px"}}>
                        <img src={titleImg} style={{display:"inline-block", verticalAlign: "middle", paddingRight:"8px"}}/>
                        <div style={{display:"inline-block", verticalAlign: "middle",paddingLeft:"0px"}}>
                            <span style={{
                                color:"rgba(0, 0, 0, 0.85)",
                                fontSize:"20px!important",
                                lineHeight:"28px"
                            }}>
                                结算单号:
                            </span>
                            <span style={{
                                paddingLeft: "0px",
                                color:"rgba(0, 0, 0, 0.85)",
                                fontSize:"20px!important",
                                lineHeight:"28px"
                            }}>
                                {this.state.dataSource.settlementNo}
                            </span>
                        </div>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Row>
                                <BaseDetails title="采购单位">
                                    {this.state.dataSource.buyerCompanyName}
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="项目部">
                                    {this.state.dataSource.organizationName}
                                </BaseDetails>
                            </Row>
                            <Row>
                        <Col>
                                <BaseDetails title="供应商">
                                    {this.state.dataSource.sellerCompanyName}
                                </BaseDetails>
                        </Col> 
                    </Row>
                    <Row>
                    <Col span={24}>
                            <BaseDetails title="制单日期">
                                {this.state.dataSource.createTime}
                            </BaseDetails>
                        </Col>      
                    </Row>
                    <Row>
                        <Col span={24}>
                            <BaseDetails title="完成日期">
                                {this.state.dataSource.finishTime?moment(this.state.dataSource.finishTime).format("YYYY-MM-DD"):"-"}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                    <Col span={12}>
                            <BaseDetails title="订单数量">
                                {this.state.dataSource.orderNum}
                            </BaseDetails>
                        </Col>    
                    </Row>
                    <Row>
                    <Col span={24}>
                            <BaseDetails title="制单人">
                                {/* {this.state.dataSource.createUserName / this.state.dataSource.userNo / this.state.dataSource.personPhone} */}
                                {this.state.dataSource.userNo}&nbsp;&nbsp;{this.state.dataSource.createUserName}&nbsp;&nbsp;{this.state.dataSource.personPhone}
                            </BaseDetails>
                        </Col>    
                    </Row>
                    <Row>
                    <Col>
                            <BaseDetails title="备注信息">
                                {this.state.dataSource.remarks}
                            </BaseDetails>
                        </Col>    
                    </Row>
                        </Col>
                        <Col span={1}/>
                        <Col span={8}>
                            <Row>
                                <span style={{fontSize:"14px!important"}}>结算状态</span>
                            </Row>
                            <Row style={{margin:'10px 0'}}>
                                <span style={{
                                    // color:"rgba(0, 0, 0, 0.85)",
                                    color:'#2db7f5',
                                    fontSize:"20px!important",
                                    lineHeight:"28px"
                                }}>
                                    {this.state.dataSource.statusStr}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                    {(this.state.dataSource.payFlag == 3 || this.state.dataSource.payFlag==4)?
                                (<span style={{color:"#ccc"}}>|</span>) :''   
                                }
                                    &nbsp;&nbsp; 
                                    {(this.state.dataSource.payFlag == 3 || this.state.dataSource.payFlag==4)?
                                (<span style={{fontSize:"14px!important",color:'#2db7f5'}} onClick={this.jumpVoucher}>查看收款账户</span>):''    
                                }
                                {/* <span style={{fontSize:"14px!important",color:'#2db7f5'}} onClick={this.showModal}>查看收款账户</span> */}
                                    
                                </span> 
                                
                            </Row>
                            <Row>
                                {(this.state.dataSource.payFlag == 3 || this.state.dataSource.payFlag==4 || this.state.dataSource.payFlag==5)?
                            (<p style={{fontSize:'14px!important'}}>({this.payStaus(this.state.dataSource.payFlag)}/{(this.state.dataSource.payingAmount || this.state.dataSource.payingAmount==0)?this.state.dataSource.payingAmount.toFixed(2) + '元':'-'})</p>) :''   
                            }
                            
                            </Row>
                            <Row>
                                <p style={{width:'210px',height:'2px',backgroundColor:'#ccc',margin:'10px 0'}}></p>
                            </Row>
                            <Row span={12}>
                                <BaseDetails title="税额合计">
                                    {(this.state.dataSource.settlementTotalAmount || this.state.dataSource.settlementTotalAmount == 0 )?this.state.dataSource.settlementTotalAmount.toFixed(2) + '元':'-'}
                                </BaseDetails>
                            </Row>
                            <Row span={12}>
                                <BaseDetails title="不含税合计">
                                    {(this.state.dataSource.settlementTotalPriceNoTax || this.state.dataSource.settlementTotalPriceNoTax==0)?this.state.dataSource.settlementTotalPriceNoTax.toFixed(2) + '元':'-'}
                                </BaseDetails>
                            </Row>
                            <Row span={12}>
                                <BaseDetails title="结算总金额">
                                    {(this.state.dataSource.settlementTotalPrice || this.state.dataSource.settlementTotalPrice == 0)?this.state.dataSource.settlementTotalPrice.toFixed(2) + '元':'-'}
                                </BaseDetails>
                            </Row>
                            <Row span={12}>
                                <BaseDetails title="质保金合计">
                                    {(!this.state.dataSource.settlementWarranty && this.state.dataSource.settlementWarranty!=0) ? '-' : this.state.dataSource.settlementWarranty.toFixed(2) + '元'}
                                    &nbsp;&nbsp;<Tooltip title="全部订单质保金合计。">
                                        <Icon type="question-circle-o"></Icon>
                                    </Tooltip>
                                </BaseDetails>
                            </Row>
                        </Col>
                        {/* <Col span={6}>
                            <Row>
                                <span style={{fontSize:"14px!important"}}>结算金额</span>
                            </Row>
                            <Row>
                                <span style={{color:"rgba(0, 0, 0, 0.85)",
                                    fontSize:"20px!important",
                                    lineHeight:"28px"
                                }}>
                                    {this.state.dataSource.amount?<span>¥ <NumberFormat value={this.state.dataSource.amount}/></span>:<span>-</span>}
                                </span>
                            </Row>
                        </Col> */}
                    </Row>
                    
                    
                </Card>
                <Card title="结算情况" bordered={false} className="mb10">
                <div>
                    <Row>
                        <Col span={10}>
                            <Row>
                                <BaseDetails title="已付金额">
                                    {(this.state.dataSource.paidAmount || this.state.dataSource.paidAmount==0)?this.state.dataSource.paidAmount.toFixed(2) + '元':'-'}
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="剩余未支付/应付">
                                    {(this.state.dataSource.restAmount || this.state.dataSource.restAmount == 0)? this.state.dataSource.restAmount.toFixed(2) + '元': '-'}
                                    <span style={{fontSize:'12px!important',marginLeft:'10px',color:'#999'}}>(<span style={{fontSize:'12px!important'}}>支付中：</span>{this.state.dataSource.payingAmount ? <span style={{color:'#999',}}><NumberFormat value={this.state.dataSource.payingAmount}></NumberFormat><span style={{fontSize:'12px!important'}}>元</span></span> : <span style={{color:'#999'}}><NumberFormat value={0}></NumberFormat><span style={{fontSize:'12px!important'}}>元</span></span>})</span>
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="已到期未付">
                                    {(this.state.dataSource.dueUnpayedAmount || this.state.dataSource.dueUnpayedAmount == 0) ? this.state.dataSource.dueUnpayedAmount.toFixed(2) + '元' : '-'}
                                    <Tooltip title="已过预计付款日的订单金额合计，为避免造成不必要的纠纷，请尽快支付！">
                                        <Icon type="question-circle-o"></Icon>
                                    </Tooltip>
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="异常订单金额">
                                    {(this.state.dataSource.abnormalAmount || this.state.dataSource.abnormalAmount == 0)? this.state.dataSource.abnormalAmount.toFixed(2) + '元' :'-'}
                                    <Tooltip title="订单异常情况：包括订单取消、订单申诉，订单改价等一些列订单金额发生变化与当前结算金额不一致的订单。
注：支付前请核实实际情况后谨慎操作！">
                                        <Icon type="question-circle-o"></Icon>
                                    </Tooltip>
                                </BaseDetails>
                            </Row>
                        </Col>
                        <Col span={4} style={{height:'140px',width:'2px',backgroundColor:'#ccc',marginRight:'20px'}}></Col>
                        <Col span={10}>
                        <Row>
                                <BaseDetails title="当前冻结质保金">
                                    {(this.state.dataSource.frozenWarranty || this.state.dataSource.frozenWarranty == 0) ? this.state.dataSource.frozenWarranty.toFixed(2) + '元':'-'}
                                </BaseDetails>
                                { this.state.dataSource.frozenWarranty? <span onClick={this.showModal}><a style={{ marginLeft: '10px',position: 'absolute',top: 0,left: '200px',fontSize: '14px' }}>解冻</a></span>:''}
                            </Row>
                            <Row style={{position: 'relative'}}>
                                <BaseDetails title="当前冻结货款">
                                    {(this.state.dataSource.frozenGoods || this.state.dataSource.frozenGoods == 0)?this.state.dataSource.frozenGoods.toFixed(2) + '元':'-'}
                                </BaseDetails>
                                {/* <span onClick={() => { this.unfreeze() }}><a style={{ marginLeft: '10px' }}>解冻</a></span> */}
                                { this.state.dataSource.frozenGoods? <span onClick={this.showModalGoods}><a style={{ marginLeft: '10px',position: 'absolute',top: 0,left: '200px',fontSize: '14px' }}>解冻</a></span>:''}
                                
                            </Row>
                            <div>
                                <Modal title="解冻" visible={this.state.visible}
                                onOk={this.handleOk.bind(this,1)} onCancel={this.handleCancel}
                                width={480}
                                >
                                {/* <FormItem className={less.mobile_code} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>手机验证码</span>} > */}
                                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>手机验证码</span>} >
                                <Input
                                    style={{ width: '236px' }}
                                    {...getFieldProps('code', {
                                    rules: [
                                        { required: true, message: '请输入手机验证码' },
                                        // { validator: this.provingPhoneMsg, validateTrigger: 'onBlur' },
                                    ],
                                    })}
                                    placeholder={phoneStr} />
                                <Button type="primary" size="large" onClick={this.sendMobileCode.bind(this)} disabled={this.state.phoneStatus}>
                                    {
                                    !this.state.phoneStatus ? '获取验证码' : this.state.countDown
                                    }
                                </Button>
                                </FormItem>
                                </Modal>
                                <Modal title="解冻2" visible={this.state.visible2}
                                onOk={this.handleOk.bind(this,2)} onCancel={this.handleCancel}
                                width={480}
                                >
                                {/* <FormItem className={less.mobile_code} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>手机验证码</span>} > */}
                                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>手机验证码</span>} >
                                <Input
                                    style={{ width: '236px' }}
                                    {...getFieldProps('code', {
                                    rules: [
                                        { required: true, message: '请输入手机验证码' },
                                        // { validator: this.provingPhoneMsg, validateTrigger: 'onBlur' },
                                    ],
                                    })}
                                    placeholder={phoneStr} />
                                <Button type="primary" size="large" onClick={this.sendMobileCode.bind(this)} disabled={this.state.phoneStatus}>
                                    {
                                    !this.state.phoneStatus ? '获取验证码' : this.state.countDown
                                    }
                                </Button>
                                </FormItem>
                                </Modal>
                            </div>
                            <Row>
                                <BaseDetails title="累计已解冻">
                                    {(this.state.dataSource.releaseAmount || this.state.dataSource.releaseAmount == 0)?this.state.dataSource.releaseAmount.toFixed(2) + '元':'-'}
                                    <Tooltip title="已实际支付到账并解冻完成，供应商可提现的金额合计。">
                                        <Icon type="question-circle-o"></Icon>
                                    </Tooltip>
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="可提现金额">
                                {(this.state.dataSource.withdrawableAmount || this.state.dataSource.withdrawableAmount == 0)?this.state.dataSource.withdrawableAmount.toFixed(2) + '元':'-'}
                                </BaseDetails>
                            </Row>
                        </Col>
                    </Row>
                </div>
                </Card>
                <Card bordered={false} className="mb10">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="订单信息" key="1">
                            {/* <ListOrders settlementId={this.props.match.params.id} getMoney={this.getMoney.bind(this)}/> */}
                            <ListOrders settlementId={this.props.match.params.id} />
                        
                            <Row className="rows" style={{textAlign:"right",paddingBottom:"10px",borderBottom:'1px solid #e9e9e9',marginTop: '50px'}}>
                        <Col span={24} className="margin_top8">
                            <div>
                                <span>货品总额：</span>
                                <span className="font-color085 font-size18" style={{color:"rgba(222,37,4,1)"}}>¥</span>
                                <span className="price-number">
                                <span className="price-number-total"><NumberFormat value={this.state.dataSource.settlementTotalPriceNoTax}/></span></span>
                                    </div>
                                        </Col>
                                        <Col span={24} className="margin_top8">
                                    <div>
                                    <span>税额：</span>
                                    <span className="font-color085 font-size18" style={{color:"rgba(222,37,4,1)"}}>¥</span>
                                                            <span className="price-number">
                                                            <span className="price-number-total"><NumberFormat value={this.state.dataSource.settlementTotalAmount}/></span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row style={{textAlign:"right"}}>
                                                    <Col span={24}>
                                                        <div style={{top:"10px",fontSize:'16px',fontWeight:700}}>
                                                            <span>税价合计：</span>
                                                            <span className="font-color085 font-size24" style={{color:"rgba(222,37,4,1)"}}>¥</span>
                                                            <span className="price-number-total"><NumberFormat value={this.state.dataSource.settlementTotalPrice}/></span>
                                                        </div>
                                                    </Col>
                                                    <Col span={24} className="margin_top8">
                                                        <div style={{top:"10px", height:"40px",fontSize:'16px',fontWeight:700}}>
                                                            <span>物流：</span>
                                                            <span className="font-color085 font-size18" style={{color:"rgba(222,37,4,1)"}}>¥</span>
                                                            <span className="price-number">
                                                            <span className="price-number-total"><NumberFormat value={this.state.dataSource.freightAmount}/></span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                
                        </TabPane>
                        <TabPane tab="商品信息" key="2">
                            <ListOrderItems settlementId={this.props.match.params.id}/>
                        </TabPane>
                        <TabPane tab="发票信息" key="3">
                            <ListInvocies settlementId={this.props.match.params.id}/>
                        </TabPane>
                        <TabPane tab="资金明细" key="5">
                            <ListCapitalDetails settlementId={this.props.match.params.id}/>
                        </TabPane>
                        <TabPane tab="共享单据" key="6">
                            <ListShareBill settlementId={this.props.match.params.id}/>
                        </TabPane>
                        <TabPane tab="承兑汇票" key="7">
                            <ListEcAcceptanceBill settlementId={this.props.match.params.id}/>
                        </TabPane>
                        <TabPane tab="结算日志" key="4">
                            <ListSettlementLogs settlementId={this.props.match.params.id}/>
                        </TabPane>
                    </Tabs>
                    
                </Card>
                <BaseAffix>
                    {/*<Button type="ghost" style={{marginRight:"10px"}} onClick={()=>{$("#purchaserSettlementDetail").print()}}>打印</Button>*/}
                    <Button type="primary" style={{marginRight:"10px"}} onClick={()=>{this.props.history.push("/financialCenter/platSettlementListNew")}}>返回</Button>
                    <Button type="ghost" style={{marginRight:"10px"}} onClick={this.viewPrint}>打印</Button>
                    {/* <Button type="ghost" style={{marginRight:"10px"}} onClick={this.download}>下载pdf</Button> */}
                    
                </BaseAffix>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
      userInfo: state.userInfo
    }
  }
  Form.create({})(SettlementDetail)
export default connect(mapStateToProps)(Form.create()(SettlementDetail))