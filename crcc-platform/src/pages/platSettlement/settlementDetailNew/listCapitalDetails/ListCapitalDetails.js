import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon,Pagination, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';
import BaseDetail from '@/components/baseDetailsNews';
import BaseDetails from '@/components/baseDetails';
import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';
import CusPopover from '@/components/cusPopover';
import moment from 'moment';
import BaseTable from '@/components/baseTable'

class ListOrders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[

            ],
            total:0,
            pageSize: 10,
            page:1,
            payDetail:{},
            getOther:{},
            //记录资金明细凭证是解冻还是冻结
            capitalType: '',
            getShare:{},
            getOrderYx:{},
            getOrder:{},
            getShareType:''

            // visible:'false',
            // visible1:'false',
        }
    }

    componentWillMount(){
        this.handleSearch({
            settlementId : this.props.settlementId,
             page :1,
            rows : 10
         
     })
    }

    componentWillReceiveProps(props){

    }

    handleSearch = (params)=>{
        // let params = {}
        // params.settlementId = this.props.settlementId;
        // params.page = 1;
        // params.rows = 10;
        api.ajax("GET", "@/platform/settlementDetail/getCapitalDetails", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data,
                total: r.data.total,
            })
        });
    }
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
              tempStatus = '共享中心';
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
      typeStaus = (status) => {
        if (!status) {
            return;
          }
          let tempStatus = '';
          switch (status) {
            case 1:
              tempStatus = '付款';
              break;
            case 2:
              tempStatus = '往来';
              break;
            case 3:
              tempStatus = '冻结';
              break;
            case 4:
              tempStatus = '解冻';
              break;
            case 5:
              tempStatus = '提现';
              break;
            default:
              break;
          }
          return tempStatus;
      }
      onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        let params = {
          rows: pageSize,
          page: 1,
          settlementId :this.props.settlementId,
        };
        this.setState(
          {
            currentPage: 1,
            pageSize: pageSize,
          },
          () => {
            this.handleSearch(params);
          },
        );
      };

      //查看凭证
      showModal=(record) =>{
        if(record.payWay == 3 || record.businessType == 5){ //汇款转账
            //查看汇款转账支付凭证
        api.ajax("GET", "@/platform/settlementDetail/getShareCenterDocument", {
            serialNumber:record.serialNumber
        }).then(r => {
            this.setState({
                getOrder:r.data,
                visible: true,
                getShareType:record.businessType
            })
        });
        }else if(record.payWay == 6){//其他
            //查看其他支付凭证
        api.ajax("GET", "@/settlement/payDetail/getOtherPaymentDocument", {
            serialNumber:record.serialNumber
        }).then(r => {
            this.setState({
                getOther:r.data,
                visible1: true,
                getShareType:record.businessType
            })
        });
        }else if(record.payWay == 2){//资金账户
             //资金帐户余额付款凭证
        api.ajax("GET", "@/settlement/payDetail/getFundAccountDocument", {
            serialNumber:record.serialNumber
        }).then(r => {
            this.setState({
                payDetail:r.data,
                visible2: true,
                getShareType:record.businessType
            })
        });
        }else if(record.payWay == 4){//共享
            api.ajax("GET", "@/platform/settlementDetail/getShareCenterDocument", {
                serialNumber:record.serialNumber
            }).then(r => {
                this.setState({
                    getShare:r.data,
                    visible3: true,
                    getShareType:record.businessType
                })
            });
        }else{ //铁建银信
            //查看银信支付凭证
        api.ajax("GET", "@/settlement/payDetail/getOrderYxDocument", {
        // api.ajax("GET", "@/platform/settlementDetail/getShareCenterDocument", {
            serialNumber:record.serialNumber
        }).then(r => {
            this.setState({
                getOrderYx:r.data,
                visible4: true,
            })
        });
        }
      }
      handleOk=()=> {
        console.log('点击了确定');
        this.setState({
          visible: false,
          visible1: false,
          visible2: false,
          visible3: false,
          visible4: false,
        });
      }
      handleCancel=(e)=> {
        console.log(e);
        this.setState({
          visible: false,
          visible1: false,
          visible2: false,
          visible3: false,
          visible4: false,
        });
      }

      
    

    

    columns = [{
        title: '流水号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        width:200,
        render: (text, record, index) => (
            <p style={{width:"200px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    },{
        title: '付款方式',
        dataIndex: 'payWay',
        key: 'payWay',
        width: 180,
        sorter: true,
        render: (text, record, index) => {
            if(!text || record.businessType == 3 || record.businessType == 4){
                return '--'
            }else{
                let statusStr = this.payStaus(text);
            return <div >
                <p>{statusStr?statusStr:'-'}</p>
            </div>
            }
            
            }
    },
    {
        title: '业务类型',
        dataIndex: 'businessType',
        key: 'businessType',
        width: 180,
        sorter: true,
        render: (text, record, index) => {
            if(!text){
                return '--'
            }
            let statusStr = this.typeStaus(text);
            let color;
            switch (statusStr) {
                case '付款':
                    color = '#77D9A5'
                    break;
                case '往来':
                    color = '#DDBC9A'
                    break;
                case '冻结':
                    color = '#FF5D5D'
                    break;
                case '解冻':
                    color = '#77D1F9'
                    break;
                case '提现':
                    color = '#77D1F9'
                    break;
                default:
                    break;
            }
            return <div >
                <p style={{color: `${color}`}}>{statusStr?statusStr:'-'}</p>
            </div>
            }
    },
    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text == 0)? text.toFixed(2) :'-'}</span>
            </p>
        )
    }, 
    {
        title: '剩余未结',
        dataIndex: 'restAmount',
        key: 'restAmount',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text == 0)? text.toFixed(2) :'-'}</span>
            </p>
        )
    }, 
    {
        title: '入账时间',
        dataIndex: 'entryTime',
        key: 'entryTime',
        width:88,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    },
    {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width:100,
        fixed: 'right',
        render: (text, record, index) => {
            return(
                <p style={{width:"100px" ,color:'#2db7f5',cursor:'pointer'}}>
                    <span onClick={this.showModal.bind(this,record)}>查看凭证</span>
                </p>
            )
        }
    }];

    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
          }
        let businessType = this.state.getOther.businessType;
        let capitalType = '';
        let businessTypeStr = '';
        if ("1" == businessType) {
            businessTypeStr = "其他";
        } else if ("2" == businessType) {
            businessTypeStr = "其他承兑汇票";
        } else if ("3" == businessType) {
            businessTypeStr = "线下付款";
        }else if( '4' == businessType){
            businessTypeStr = "铁建银信";
        }else {
            businessTypeStr = "- -";
        }

        // switch (this.state.getShare.businessType) {
        //     case 3:
        //         capitalType = 'frozen'
        //         break;
        //     case 4:
        //         capitalType = 'thaw'
        //         break;
        //     default:
        //         break;
        // }
        // this.setState({ capitalType })
        return (
            <div className="purchaserSettlementDetailListOrders">
                <Table
                    rowSelection={null}
                    onChange = {this.onChange}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource.rows}
                    pagination = {false}
                    scroll = {{x:true}}
                />
                <div style={{float: 'right',margin: '16px 0'}}>
                <Pagination
                total={this.state.total}
                showSizeChanger
                showQuickJumper
                showTotal={showTotal}
                onChange={this.pageChange}
                onShowSizeChange={this.onShowSizeChange}
              />
              </div>

              <Modal
                    // title={'汇款转账凭证'}
                    title={this.state.getShareType == 3 ? '冻结凭证' : this.state.getShareType == 4 ? '解冻凭证' :this.state.getShareType == 5?'提现凭证':'汇款转账凭证'}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    className='capital'
                    width={700}
                    footer=""
                >
                    <div>
                    <Row>
                            <BaseDetails title="支付单号">
                            {this.state.getOrder && this.state.getOrder.payOrderId ? this.state.getOrder.payOrderId : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="项目名称">
                            {this.state.getOrder && this.state.getOrder.deptName ? <CusPopover width={500} content={this.state.getOrder.deptName}></CusPopover> : '- -'}
                            </BaseDetails>
                        </Row>
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        {this.state.getShareType == 3 ? 
                        <div>
                            <Row>
                            <Col span={12}>
                            <BaseDetails title="冻结金额">
                            {this.state.getOrder && this.state.getOrder.payAmount ? <span><NumberFormat value={this.state.getOrder.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            </Row>
                            <Row>
                            <Col span={12}>
                            <BaseDetails title="冻结账号">
                            {this.state.getOrder && this.state.getOrder.sellInAcctId ? this.state.getOrder.sellInAcctId : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="冻结流水号">
                            {this.state.getOrder && this.state.getOrder.serialNumber ? this.state.getOrder.serialNumber : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        </div> : this.state.getShareType == 4 ? <div>
                            <Row>
                            <Col span={12}>
                            <BaseDetails title="解冻金额">
                            {this.state.getOrder && this.state.getOrder.payAmount ? <span><NumberFormat value={this.state.getOrder.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            </Row>
                            <Row>
                            <Col span={12}>
                            <BaseDetails title="解冻账号">
                            {this.state.getOrder && this.state.getOrder.sellInAcctId ? this.state.getOrder.sellInAcctId : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="解冻流水号">
                            {this.state.getOrder && this.state.getOrder.serialNumber ? this.state.getOrder.serialNumber : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        </div> : this.state.getShareType == 5 ?
                        <div>
                            <Row>
                            <Col>
                            <BaseDetails title="提现金额">
                            {this.state.getOrder && this.state.getOrder.payAmount ? <span><NumberFormat value={this.state.getOrder.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            </Row>
                            <Row>
                            <Col>
                            <BaseDetails title="提现账号">
                            {this.state.getOrder && this.state.getOrder.sellInAcctId ? this.state.getOrder.sellInAcctId : '- -'}
                            </BaseDetails>
                            </Col>
                            <Row>
                            <Col>
                            <BaseDetails title="提现流水号">
                            {this.state.getOrder && this.state.getOrder.serialNumber ? this.state.getOrder.serialNumber : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        </Row>
                        </div>:
                        <div>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款金额">
                            {this.state.getOrder && this.state.getOrder.payAmount ? <span><NumberFormat value={this.state.getOrder.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="付款账户">
                            {this.state.getOrder && this.state.getOrder.inAcctIdName ? this.state.getOrder.inAcctIdName : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款银行">
                            {this.state.getOrder && this.state.getOrder.bankName ? this.state.getOrder.bankName : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <BaseDetails title="付款流水号">
                            {this.state.getOrder && this.state.getOrder.serialNumber ? this.state.getOrder.serialNumber : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <Col span={16}>
                            <BaseDetails title="付款日期">
                            {this.state.getOrder.createTime?moment(this.state.getOrder.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        <Row>
                            <BaseDetails title="收款账户">
                            {this.state.getOrder && this.state.getOrder.sellInAcctIdName ? this.state.getOrder.sellInAcctIdName : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="收款人账号">
                            {this.state.getOrder && this.state.getOrder.sellInAcctId ? this.state.getOrder.sellInAcctId : '- -'}
                            </BaseDetails>
                        </Row>
                        </div>}
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="创建时间">
                            {this.state.getOrder.createTime?moment(this.state.getOrder.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="冻结时间">
                                {this.state.getShareType == 3 ? (this.state.getOrder.createTime?moment(this.state.getOrder.createTime).format("YYYY-MM-DD HH:mm:ss"):'-') :'--' }
                            </BaseDetail>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="完成时间">
                            {/* {this.state.getOrder.completeTime?moment(this.state.getOrder.completeTime).format("YYYY-MM-DD HH:mm:ss"):'-'} */}
                            {'--'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="解冻时间">
                            {this.state.getShareType == 4 ? (this.state.getOrder.createTime?moment(this.state.getOrder.createTime).format("YYYY-MM-DD HH:mm:ss"):'-') :'--'}
                            </BaseDetail>
                            </Col>
                            <Row>
                            <Col span={16}>
                            <BaseDetail title="操作人">
                            <p>{this.state.getOrder.userName}&nbsp;&nbsp; {this.state.getOrder.userNo}</p>
                            
                            
                            </BaseDetail>
                            </Col>
                        </Row>
                        </Row>
                    </div>
                </Modal>
                <Modal
                    // title='其他支付凭证'
                    title={this.state.getShareType == 3 ? '冻结凭证' : this.state.getShareType == 4 ? '解冻凭证' :'其他支付凭证'}
                    visible={this.state.visible1}
                    onCancel={this.handleCancel}
                    className='capital'
                    width={700}
                    footer=""
                >
                    <div>
                        <Row>
                            <BaseDetails title="支付单号">
                            {this.state.getOther && this.state.getOther.payOrderId ? this.state.getOther.payOrderId : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="项目名称">
                            {this.state.getOther && this.state.getOther.deptName ? <CusPopover width={500} content={this.state.getOther.deptName}></CusPopover> : '- -'}
                            </BaseDetails>
                        </Row>
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        {this.state.getShareType == 3 ? 
                        <div>
                        <Row>
                       <Col span={12}>
                       <BaseDetails title="冻结金额">
                       {this.state.getOther && this.state.getOther.payAmount ? <span><NumberFormat value={this.state.getOther.payAmount}></NumberFormat>元</span> : '- -'}
                       
                       </BaseDetails>
                       </Col>
                       <Col span={12}>
                       <BaseDetails title="冻结日期">
                       {this.state.getOther && this.state.getOther.createTime ? moment(this.state.getOther.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                       </BaseDetails>
                       </Col>
                   </Row>
                   <Row>
                       <BaseDetails title="冻结账号">
                       {this.state.getOther && this.state.getOther.sellInAcctId ? this.state.getOther.sellInAcctId : '- -'}
                       </BaseDetails>
                   </Row>
                   <Row>
                       <BaseDetails title="冻结流水号">
                       {this.state.getOther && this.state.getOther.serialNumber ? this.state.getOther.serialNumber : '- -'}
                       </BaseDetails>
                   </Row>
                   </div> : this.state.getShareType == 4 ? 
                   <div>
                   <Row>
                  <Col span={12}>
                  <BaseDetails title="解冻金额">
                  {this.state.getOther && this.state.getOther.payAmount ? <span><NumberFormat value={this.state.getOther.payAmount}></NumberFormat>元</span> : '- -'}
                  
                  </BaseDetails>
                  </Col>
                  <Col span={12}>
                  <BaseDetails title="解冻日期">
                  {this.state.getOther && this.state.getOther.createTime ? moment(this.state.getOther.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                  </BaseDetails>
                  </Col>
              </Row>
              <Row>
                  <BaseDetails title="解冻账号">
                  {this.state.getOther && this.state.getOther.sellInAcctId ? this.state.getOther.sellInAcctId : '- -'}
                  </BaseDetails>
              </Row>
              <Row>
                  <BaseDetails title="解冻流水号">
                  {this.state.getOther && this.state.getOther.serialNumber ? this.state.getOther.serialNumber : '- -'}
                  </BaseDetails>
              </Row>
              </div>:
                        <div>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款金额">
                            {/* {this.state.getOther.payAmount} */}
                            {this.state.getOther && this.state.getOther.payAmount ? <span><NumberFormat value={this.state.getOther.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="业务类型">
                            {businessTypeStr}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title={(businessTypeStr=='其他承兑汇票' || businessTypeStr=='铁建银信' )?'票据编号':'付款账户'}>
                            {this.state.getOther.accountName}
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            {(businessTypeStr=='其他承兑汇票' || businessTypeStr=='铁建银信' )?'':
                            <BaseDetails title="付款账号">
                            {this.state.getOther.paymentAccount}
                            </BaseDetails>
                            }
                            
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                            <BaseDetails title="附件">
                            {this.state.getOther.fileName}
                            {
                                this.state.getOther && this.state.getOther.filePath ? <a style={{ marginLeft: '10px' }} href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.getOther.filePath)} >下载</a> : null
                            }
                            </BaseDetails>
                            </Col>
                        </Row>
                        </div>
                        }
                        
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="创建时间">
                            {this.state.getOther.createTime?moment(this.state.getOther.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="冻结时间">
                            {this.state.getShareType == 3 ? (this.state.getOther.createTime?moment(this.state.getOther.createTime).format("YYYY-MM-DD HH:mm:ss"):'--') :'--'}
                            </BaseDetail>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="完成时间">
                            {this.state.getOther.createTime?moment(this.state.getOther.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="解冻时间">
                            {this.state.getShareType == 4 ? (this.state.getOther.createTime?moment(this.state.getOther.createTime).format("YYYY-MM-DD HH:mm:ss"):'-') :'--'}
                            </BaseDetail>
                            </Col>
                            <Row>
                            <Col span={16}>
                            <BaseDetail title="操作人">
                            <p>{this.state.getOther.userName}&nbsp;&nbsp;{this.state.getOther.userNo}</p>
                            
                            </BaseDetail>
                            </Col>
                        </Row>
                        </Row>
                    </div>
                </Modal>
                <Modal
                    // title='资金账户支付凭证'
                    title={this.state.getShareType == 3 ? '冻结凭证' : this.state.getShareType == 4 ? '解冻凭证' :'资金账户支付凭证'}
                    visible={this.state.visible2}
                    onCancel={this.handleCancel}
                    className='capital'
                    width={700}
                    footer=""
                >
                    <div>
                        <Row>
                            <BaseDetails title="支付单号">
                            {this.state.payDetail && this.state.payDetail.payOrderId ? this.state.payDetail.payOrderId : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="项目名称">
                            {this.state.payDetail && this.state.payDetail.deptName ? <CusPopover width={500} content={this.state.payDetail.deptName}></CusPopover> : '- -'}
                            </BaseDetails>
                        </Row>
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        {this.state.getShareType == 3 ? 
                        <div>
                        <Row>
                       <Col span={12}>
                       <BaseDetails title="冻结金额">
                       {this.state.payDetail && this.state.payDetail.payAmount ? <span><NumberFormat value={this.state.payDetail.payAmount}></NumberFormat>元</span> : '- -'}
                       
                       </BaseDetails>
                       </Col>
                       </Row>
                       <Row>
                       <BaseDetails title="冻结账号">
                       {this.state.payDetail && this.state.payDetail.sellInAcctId ? this.state.payDetail.sellInAcctId : '- -'}
                       </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="冻结流水号">
                            {this.state.payDetail && this.state.payDetail.serialNumber ? this.state.payDetail.serialNumber : '- -'}
                            </BaseDetails>
                        </Row>
                       <Row>
                       <Col span={12}>
                       <BaseDetails title="冻结日期">
                       {this.state.payDetail && this.state.payDetail.createTime ? moment(this.state.payDetail.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                       </BaseDetails>
                       </Col>
                   </Row>
                   
                   
                   </div> : this.state.getShareType == 4 ? 
                   <div>
                   <Row>
                  <Col span={12}>
                  <BaseDetails title="解冻金额">
                  {this.state.payDetail && this.state.payDetail.payAmount ? <span><NumberFormat value={this.state.payDetail.payAmount}></NumberFormat>元</span> : '- -'}
                  
                  </BaseDetails>
                  </Col>
                  </Row>
                  <Row>
                  <BaseDetails title="解冻账号">
                  {this.state.payDetail && this.state.payDetail.sellInAcctId ? this.state.payDetail.sellInAcctId : '- -'}
                  </BaseDetails>
                   </Row>
                   <Row>
                       <BaseDetails title="解冻流水号">
                       {this.state.payDetail && this.state.payDetail.serialNumber ? this.state.payDetail.serialNumber : '- -'}
                       </BaseDetails>
                   </Row>
                  <Row>
                  <Col span={12}>
                  <BaseDetails title="解冻日期">
                  {this.state.payDetail && this.state.payDetail.createTime ? moment(this.state.payDetail.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                  </BaseDetails>
                  </Col>
              </Row>
              
              
              </div> :
                        <div>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款金额">
                            {/* {this.state.payDetail.payAmount} */}
                            {this.state.payDetail && this.state.payDetail.payAmount ? <span><NumberFormat value={this.state.payDetail.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="收款账户">
                            {this.state.payDetail && this.state.payDetail.bankAccount ? this.state.payDetail.bankAccount :'--'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款账户">
                            {this.state.payDetail && this.state.payDetail.inAcctIdName ? this.state.payDetail.inAcctIdName : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <BaseDetails title="付款流水号">
                            {this.state.payDetail && this.state.payDetail.serialNumber ? this.state.payDetail.serialNumber : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <Col span={16}>
                            <BaseDetails title="付款日期">
                            {this.state.payDetail.createTime?moment(this.state.payDetail.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        </div>}
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="创建时间">
                            {this.state.payDetail.createTime?moment(this.state.payDetail.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            
                            <BaseDetail title="冻结时间">
                            {this.state.getShareType == 3 ? (this.state.payDetail.createTime?moment(this.state.payDetail.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'):'--'}
                           
                            </BaseDetail>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="完成时间">
                                {'--'}
                            {/* {this.state.payDetail.completeTime?moment(this.state.payDetail.completeTime).format("YYYY-MM-DD HH:mm:ss"):'-'} */}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="解冻时间">
                            {this.state.getShareType == 4 ? (this.state.payDetail.createTime?moment(this.state.payDetail.createTime).format("YYYY-MM-DD HH:mm:ss"):'-') :'--'} 
                            </BaseDetail>
                            </Col>
                            <Row>
                            <Col span={16}>
                            <BaseDetail title="操作人">
                            <p>{this.state.payDetail.userName}&nbsp;&nbsp; {this.state.payDetail.userNo}</p>
                            {/* {this.state.payDetail.userNo} */}
                            </BaseDetail>
                            </Col>
                        </Row>
                        </Row>
                    </div>
                </Modal>
                <Modal
                    // title='共享中心支付凭证'
                    title={this.state.getShareType == 3 ? '冻结凭证' : this.state.getShareType == 4 ? '解冻凭证' :'共享中心支付凭证'}
                    visible={this.state.visible3}
                    onCancel={this.handleCancel}
                    className='capital'
                    width={700}
                    footer=""
                >
                    <div>
                        <Row>
                            <BaseDetails title="支付单号">
                            {this.state.getShare && this.state.getShare.payOrderId ? this.state.getShare.payOrderId : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="项目名称">
                            {this.state.getShare && this.state.getShare.deptName ? <CusPopover width={500} content={this.state.getShare.deptName}></CusPopover> : '- -'}
                            </BaseDetails>
                        </Row>
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        {this.state.getShareType == 3 ?
                        <div>
                             <Row>
                            <Col span={12}>
                            <BaseDetails title="冻结金额">
                            {this.state.getShare && this.state.getShare.payAmount ? <span><NumberFormat value={this.state.getShare.payAmount}></NumberFormat>元</span> : '- -'}
                            
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="冻结日期">
                            {this.state.getShare && this.state.getShare.createTime ? moment(this.state.getShare.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <BaseDetails title="冻结账号">
                            {this.state.getShare && this.state.getShare.sellInAcctId ? this.state.getShare.sellInAcctId : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="冻结流水号">
                            {this.state.getShare && this.state.getShare.serialNumber ? this.state.getShare.serialNumber : '- -'}
                            </BaseDetails>
                        </Row>
                        </div> :
                        (this.state.getShareType == 4 ? 
                            <div>
                             <Row>
                            <Col span={12}>
                            <BaseDetails title="解冻金额">
                            {this.state.getShare && this.state.getShare.payAmount ? <span><NumberFormat value={this.state.getShare.payAmount}></NumberFormat>元</span> : '- -'}
                            
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <BaseDetails title="解冻账号">
                            {this.state.getShare && this.state.getShare.sellInAcctId ? this.state.getShare.sellInAcctId : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="解冻流水号">
                            {this.state.getShare && this.state.getShare.serialNumber ? this.state.getShare.serialNumber : '- -'}
                            </BaseDetails>
                        </Row>
                        </div>:
                          
                            <div>
                                <Row>
                            <Col span={12}>
                            <BaseDetails title="付款类型">
                            {this.state.getShare && this.state.getShare.type ? this.state.getShare.type == '1' ? '现金支付类' : this.state.getShare.type == '2' ? '票据支付类' : '非付款类' : '- -'}
                            
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="付款账户">
                            {this.state.getShare && this.state.getShare.inAcctId ? this.state.getShare.inAcctId : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款金额">
                            {this.state.getShare && this.state.getShare.payAmount ? <span><NumberFormat value={this.state.getShare.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="付款银行">
                            {this.state.getShare && this.state.getShare.bankName ? this.state.getShare.bankName : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款流水号">
                            {this.state.getShare && this.state.getShare.serialNumber ? this.state.getShare.serialNumber : '- -'}
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="付款账户">
                            {this.state.getShare && this.state.getShare.inAcctIdName ? this.state.getShare.inAcctIdName : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <BaseDetails title="付款日期">
                            {this.state.getShare && this.state.getShare.createTime ? moment(this.state.getShare.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                            </BaseDetails>
                        </Row>
                                </div>
                        )
                    }
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="创建时间">
                            {this.state.getShare && this.state.getShare.createTime ? moment(this.state.getShare.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="冻结时间">
                            {this.state.getShareType == 3 ? (this.state.getShare && this.state.getShare.createTime ? moment(this.state.getShare.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -') :'--'}
                            </BaseDetail>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="完成时间">
                            {/* {this.state.getOrderYx && this.state.getOrderYx.createTime  ? moment(this.state.getOrderYx.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'} */}
                            {'--'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="解冻时间">
                            {this.state.getShareType == 4 ? (this.state.getShare && this.state.getShare.createTime  ? moment(this.state.getShare.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -') :'--'}
                            </BaseDetail>
                            </Col>
                            <Row>
                            <Col span={16}>
                            <BaseDetail title="操作人">
                            <p>{this.state.getShare && this.state.getShare.userName ? this.state.getShare.userName : '- -'}&nbsp;&nbsp;{this.state.getShare.userNo}</p>
                            {/* <p>{this.state.getShare && this.state.getShare.userNo ? this.state.getShare.userNo : '- -'}</p> */}
                            </BaseDetail>
                            </Col>
                        </Row>
                        </Row>
                    </div>
                </Modal>
                <Modal
                    title='铁建银信支付凭证'
                    visible={this.state.visible4}
                    onCancel={this.handleCancel}
                    className='capital'
                    width={700}
                    footer=""
                >
                    <div>
                        <Row>
                            <BaseDetails title="支付单号">
                            {this.state.getOrderYx && this.state.getOrderYx.payOrderId ? this.state.getOrderYx.payOrderId : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="项目名称">
                            {this.state.getOrderYx && this.state.getOrderYx.deptName ? <CusPopover width={500} content={this.state.getOrderYx.deptName}></CusPopover> : '- -'}
                            </BaseDetails>
                        </Row>
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="付款金额">
                            {this.state.getOrderYx && this.state.getOrderYx.payAmount ? <span><NumberFormat value={this.state.getOrderYx.payAmount}></NumberFormat>元</span> : '- -'}
                            </BaseDetails>
                            </Col>
                            <Col span={12}>
                            <BaseDetails title="收款账户">
                            {'--'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetails title="银信单据号">
                            {this.state.getOrderYx && this.state.getOrderYx.billNo ? this.state.getOrderYx.billNo : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <BaseDetails title="承兑日期">
                            {this.state.getOrderYx && this.state.getOrderYx.acceptanceTime ? moment(this.state.getOrderYx.acceptanceTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <Col span={16}>
                            <BaseDetails title="开立时间">
                            {this.state.getOrderYx && this.state.getOrderYx.openDate ? moment(this.state.getOrderYx.openDate).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                            </BaseDetails>
                            </Col>
                        </Row>
                        <p style={{width:'100%',height:'2px',backgroundColor:'#f2f2f2',marginBottom:'10px'}}></p>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="创建时间">
                            {this.state.getOrderYx && this.state.getOrderYx.createTime ? moment(this.state.getOrderYx.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="冻结时间">
                                {'--'}
                            {/* {this.state.getOrderYx && this.state.getOrderYx.createTime ? moment(this.state.getOrderYx.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'} */}
                            </BaseDetail>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                            <BaseDetail title="完成时间">
                            {/* {this.state.getOrderYx && this.state.getOrderYx.createTime  ? moment(this.state.getOrderYx.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'} */}
                            {'--'}
                            </BaseDetail>
                            </Col>
                            <Col span={12}>
                            <BaseDetail title="解冻时间">
                            {this.state.getOrderYx && this.state.getOrderYx.unfreezeTime  ? moment(this.state.getOrderYx.unfreezeTime).format('YYYY-MM-DD HH:mm:ss') : '- -'}
                            </BaseDetail>
                            </Col>
                            <Row>
                            <Col span={16}>
                            <BaseDetail title="操作人">
                            <p>{this.state.getOrderYx && this.state.getOrderYx.userName ? this.state.getOrderYx.userName : '- -'}&nbsp;&nbsp;{this.state.getOrderYx && this.state.getOrderYx.userNo ? this.state.getOrderYx.userNo : '- -'}</p>
                            {/* <p></p> */}
                            </BaseDetail>
                            </Col>
                        </Row>
                        </Row>
                    </div>
                </Modal>
            </div>

            
        )
    }
}

export default Form.create()(ListOrders)