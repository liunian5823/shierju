import { Card, Row, Col, Button, Table, Switch, message, Tabs, Popconfirm ,Modal,Pagination} from 'antd';
import api from '@/framework/axios';
import {exportFile} from '@/utils/urlUtils';
import {getUrlByParam,getUrlByParamNew, getQueryString} from '@/utils/urlUtils';
import BaseDetails from '@/components/baseDetails';
import BaseTable from '@/components/baseTable';
import BaseAffix from '@/components/baseAffix';
import {NumberFormat} from "@/components/gaoda/Format";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import less from './index.less';
import './index.css';
const TabPane = Tabs.TabPane;
class DetailFinanceReview extends React.Component{
    state = {
        financeHang:{},
        listFinanceHangHandleOrders:{},
        payWayList: [],
        financeHangHandle:[],
        loading: false,
        tableState: 0,
        type:'',
        //终止弹窗状态
      stopVisible: false,
      findHistory:{},
      total:0,
        total2:0,
        pageSize: 10,
        page:1,
        getHistoryFinanceVo:[],
        getHistoryDeptVos:[],
        findFinanceReview: [],
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        // let params={}
        // params.workOrdersId = this.props.workOrdersId
        // console.log('********',params.workOrdersId)
        api.ajax("GET", "@/platform/financehang/findFinanceAccepteByWorkOrdersId", {
        id:getQueryString("id")
    }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                financeHang: r.data
            })
        })
        api.ajax("GET", "@/platform/checkingOnAccount/findCheckingOnAccountBySingular",{ 
            workOrdersId:getQueryString("workOrdersId")
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                listFinanceHangHandleOrders: r.data,
                payWayList:r.data
            })
        })
        api.ajax("GET", "@/platform/financehang/findReviewLogByWorkOrdersId", {
            id:getQueryString("id")
        }
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                financeHangHandle: r.data
            })
        })
        api.ajax("GET", "@/platform/financehang/getHandlLog", {
            id:getQueryString("id")
        }
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                findFinanceReview: r.data
            })
        })
        this.stausToRes(this.state.financeHang.accountState)
    }
    componentWillUnmount(){
        this._isMounted = false;
    }

    baseParams = {

    }
    paymentOptionClick(type) {
        console.log('22',type)
        let tempAry = this.state.payWayList.map((item, index) => {
            console.log('88-------------',index)
          let status = true;
          if (index == type) {
            status = false
          }
          return status
        });
        console.log('2222222222222222',tempAry)
        this.setState({
            payWayList: tempAry
        })
    
      }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }
    stausToRes = (status) => {
        if (!status) {
          return;
        }
        let tempStatus = '';
        switch (status) {
            case 1:
                tempStatus = '待审核';
                break;
              case 2:
                tempStatus = '通过';
                break;
              case 3:
                tempStatus = '驳回';
                break;
              case 4:
                tempStatus = '待受理';
                break;
              case 5:
                tempStatus = '待处理';
                break;
              case 6:
                tempStatus = '已完成';
                break;
              default:
                break;
        }
       
        return tempStatus;
        
      };
    
      columns4 = () => {
        return [
            {
                title: '来款账户',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 180,
                render:(text,record)=> {
                    return  <span style={{width: "170px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '结算单',
                dataIndex: 'settlementNo',
                key: 'settlementNo',
                width: 160,
                render:(text,record)=> {
                    return  <span style={{width: "200px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '结算单创建人',
                dataIndex: 'createUserName',
                key: 'createUserName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "240px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款金额（元）',
                dataIndex: 'inAmount',
                key: 'inAmount',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    return <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>

                }
            },
            {
                title: '流水号',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                sorter: true,
                width: 130,
                render: (text, record, index) => (
                    <p>
                        <span title={text}>{text?text:"-"}</span>
                    </p>
                )
            },
            {
                title: '来款时间',
                dataIndex: 'acctDate',
                key: 'acctDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                        <span title={text?moment(text).format('YYYY-MM-DD'):"-"}>{text?moment(text).format('YYYY-MM-DD'):"-"}</span>
                )
            },
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                width: 100,
                render: (text,record)=>{
                    return( <p style={{width:"100px"}}>{text?text:'-'}</p>)
                }
            },
            {
                title: '处理人',
                dataIndex: 'acceptorUsername',
                key: 'acceptorUsername',
                width: 130
            },
            {
                title: '处理结果',
                dataIndex: 'flag',
                key: 'flag',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    if(!text){
                        return '--'
                    }
                    let statusStr = this.orderStaus(text);
                    return <div >
                    <p>{statusStr?statusStr:'-'}</p>
                </div>
                }  
            },
            {
                title: '处理时间',
                dataIndex: 'acceptTime',
                key: 'acceptTime',
                width: 160,
                render:(text)=>{
                    return <p>{text?text:'-'}</p>
                    
                }
            },
        ]
    }
    columns5 = () => {
        return [
            {
                title: '来款账户',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 180,
                render:(text,record)=> {
                    return  <span style={{width: "170px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '结算单',
                dataIndex: 'settlementNo',
                key: 'settlementNo',
                width: 160,
                render:(text,record)=> {
                    return  <span style={{width: "200px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '结算单创建人',
                dataIndex: 'createUserName',
                key: 'createUserName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "240px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款金额（元）',
                dataIndex: 'inAmount',
                key: 'inAmount',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    return <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>

                }
            },
            {
                title: '流水号',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                sorter: true,
                width: 130,
                render: (text, record, index) => (
                    <p>
                        <span title={text}>{text?text:"-"}</span>
                    </p>
                )
            },
            {
                title: '来款时间',
                dataIndex: 'acctDate',
                key: 'acctDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                        <span title={text?moment(text).format('YYYY-MM-DD'):"-"}>{text?moment(text).format('YYYY-MM-DD'):"-"}</span>
                )
            },
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                width: 100,
                render: (text,record)=>{
                    return( <p style={{width:"100px"}}>{text?text:'-'}</p>)
                }
            },
            {
                title: '处理人',
                dataIndex: 'acceptorUsername',
                key: 'acceptorUsername',
                width: 130
            },
            {
                title: '处理结果',
                dataIndex: 'flag',
                key: 'flag',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    if(!text){
                        return '--'
                    }
                    let statusStr = this.orderStaus(text);
                    return <div >
                    <p>{statusStr?statusStr:'-'}</p>
                </div>
                }  
            },
            {
                title: '处理时间',
                dataIndex: 'acceptTime',
                key: 'acceptTime',
                width: 160,
                render:(text)=>{
                    return <p>{text?text:'-'}</p>
                    
                }
            },
            {
                title: '项目部名称',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 100,
                render: (text,record)=>{
                    return( <p style={{width:"100px"}}>{text?text:'-'}</p>)
                }
            },
        ]
    }

    columns = () => {
        return [
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 250
            },
            {
                title: '采购单位',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 250
            },
            {
                title: '项目部',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 250
            },
            {
                title: '供应商',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 250
            },
            {
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 150,
                sorter: true,
                render: (text, record, index) => (
                    <p style={{width:"80px"}}  className={less.tableColumnWidth}>
                        <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
                    </p>
                ),
            },
            {
                title: '状态(附言码)',
                dataIndex: 'tradeNo',
                key: 'tradeNo',
                width: 200
            },
            {
                title: '订单金额(元)',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                width: 150,
                sorter: true,
                render: (text, record, index) => (
                    <p style={{width:"130px"}}  className={less.tableColumnWidth}>
                        <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
                    </p>
                ),
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key: 'handle',
                width:200,
                fixed: 'right',
                render: (text, record, index) => {
                    let param = {}
                    param.uuids = record.uuids
                    param.goBackUrl = "";
                    let href = systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetail', param));
                    return(
                        <p style={{width:"130px"}}>
                            <a target="_blank" href={href}>查看</a>
                        </p>
                    )
                }
            }
        ]
    }

    goBack = ()=>{
        this.props.history.push("/financialCenter/financeReview");
    }

    

    
    //来款时间
    acctDate = ()=>{
        let result = undefined;
        let acctDate = this.state.financeHang.acctDate;
        if(acctDate&&8 == acctDate.length){
            result = acctDate.substring(0,4)+"-"+acctDate.substring(4,6)+"-"+acctDate.substring(6,acctDate.length);
        }else{
            result = acctDate;
        }
        return result;
    }
    orderStaus = (status) => {
        if (!status) {
            return;
          }
          let tempStatus = '';
          switch (status) {
            case 1:
              tempStatus = '处理中';
              break;
            case 2:
              tempStatus = '处理失败';
              break;
            case 3:
              tempStatus = '处理成功';
              break;
            case 4:
              tempStatus = '系统处理中';
              break;
            default:
              break;
          }
          return tempStatus;
      }
    showModal=() =>{
        this.setState({
          visible: true,
        });
        // let params={};
        setTimeout(() => { 
            // params.id = this.props.match.params.id
            // params.inAcctId = this.state.financeHang.inAcctId
            // params.settlementId = this.state.listFinanceHangHandleOrders.id
            api.ajax("GET", "@/platform/settlement/getHistory", {
                id:getQueryString("id"),
                page:this.state.page,
                rows:this.state.pageSize,
                inAcctId:this.state.financeHang.inAcctId,
                settlementId:this.state.listFinanceHangHandleOrders.id
            }).then((r) => {
                console.log('999',r.data)
                this.setState({
                    findHistory: r.data
                })
        })
        api.ajax("GET", "@/platform/settlement/getHistoryFinanceVo", {
            id:getQueryString("id"),
            page:this.state.page,
            rows:this.state.pageSize,
            inAcctId:this.state.financeHang.inAcctId,
            settlementId:this.state.listFinanceHangHandleOrders.id
        }).then((r) => {
            this.setState({
                getHistoryFinanceVo: r.data.rows,
                total:r.data.total
            })
    })
    api.ajax("GET", "@/platform/settlement/getHistoryDeptVos", {
        id:getQueryString("id"),
        page:this.state.page,
        rows:this.state.pageSize,
        inAcctId:this.state.financeHang.inAcctId,
        settlementId:this.state.listFinanceHangHandleOrders.id
    }).then((r) => {
        this.setState({
            getHistoryDeptVos: r.data.rows,
            total2:r.data.total

        })
})
         }, 1000);
      }
      pageChange = (page) => {
        this.setState({
            page:page
        })
        this.showModal(page)
      };

      onShowSizeChange = (current, pageSize) => {

        this.setState(
          {
            currentPage: 1,
            pageSize: pageSize,
          },
          () => {
            this.showModal();
          },
        );
      };
      getInitialState=()=> {
        return { visible: false,visible1: false}
      }
      handleCancel=(e)=> {
        this.setState({
          visible: false,
        });
      }

      
      
      handleOk=()=> {
        console.log('点击了确定');
        this.setState({
          visible: false,
        });
      }
    //   onShowModal=() =>{
    //     this.setState({
    //       visible1: true,
    //     });
    //   }
    //   onCancel=(e)=> {
    //     this.setState({
    //       visible1: false,
    //     });
    //   }
    //   onOk=()=> {
    //     console.log('点击了确定');
    //     this.setState({
    //       visible1: false,
    //     });
    //   }
    //驳回
  rejectChange = (type) => {
    this.setState({
      rejectVisible: true,
      type
    });
  };
  //通过
  passChange = (type) => {
    this.setState({
      passVisible: true,
      type
    });
  };
  //关闭弹窗
  closeModal() {
    this.setState({
      rejectVisible: false,
      passVisible: false,
    });
  }
  platDetail = (id,uuids) => {
    setTimeout(() => {
        window.open(systemConfigPath.jumpPage(getUrlByParamNew('/financialCenter/platSettlementListNew/settlementDetailNew/'+id+'/'+uuids)))
    }, 500)


}

    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
          }
          function showTotal2(total2) {
            return `共 ${total2} 条`;
          }
        const payWayList = this.state.payWayList;
        const columns3 = [
            {
                title: '操作人',
                width: 100,
                dataIndex: 'username',
                key: 'username',
                render: (text, record) => {
                    return (
                        <div>
                            <p>{text ? text : '--'}</p>
                            <p>{record.userNo ? record.userNo : '--'}</p>
                        </div>

                    );
                },
            },
            {
                title: '时间',
                width: 180,
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text) => {
                    if (!text) {
                        return '--';
                    }
                    // let textAry = text.split(' ');
                    return (
                        //   <div style={dateStyle}>
                        <p>{text}</p>

                        //   </div>
                    );
                },
            },
            {
                title: '事件',
                dataIndex: 'remarks',
                key: 'remarks',
                render: (text) => {
                    return (
                        <p>{text ? text : '--'}</p>
                    );
                },
            },
            {
                title: '匹配单据',
                dataIndex: 'settlementNo',
                key: 'settlementNo',
                render: (text) => {
                    return (
                        <p>{text ? text : '--'}</p>
                    );
                },
            },
            
        ];
        const columns2 = [
            {
                title: '备注人',
                width: 100,
                dataIndex: 'username',
                key: 'username',
                render: (text, record) => {
                    return (
                        <div>
                            <span>{text ? text : '-'}</span>&nbsp;&nbsp;
                            <span>{record.userNo ? record.userNo : ''}</span>
                        </div>
                    )
                }
            },
            {
                title: '时间',
                width: 200,
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text) => {
                    if (!text) {
                        return '--';
                    }
                    // let textAry = text.split(' ');
                    return (
                        //   <div style={dateStyle}>
                        <p>{text}</p>
                        // <p>{textAry[1]}</p>
                        //   </div>
                    );
                },
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                render: (text) => {
                    return (
                        <p>{text ? text : '--'}</p>
                    );
                },
            },
        ];
        // console.log('99999&&&&&9999999999',payWayList)
        return(
            <div className={less.detailFinanceHang}>
                <Card title="来款信息" bordered={false} className={less.incomingInformation+" mb10"}>
                    <Row>
                        <Col span={7}>
                            <Row className={less.rightCol}>
                                <span className={less.label}>来款账户</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>
                                <span className={less.text}>{this.state.financeHang.inAcctIdName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <BaseDetails title="来款账号">
                                {this.state.financeHang.inAcctId}
                                </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="流水号">
                                {this.state.financeHang.serialNumber}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="来款时间">
                                {this.acctDate()}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="来款银行">
                                {this.state.financeHang.bankName}
                            </BaseDetails>
                            </Row>
                        </Col>
                        <Col span={5}>
                            <p style={{width:'2px',height:'300px',backgroundColor:'#ccc',marginLeft:'200px'}}></p>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <p>来款金额（元）：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>{this.state.financeHang.inAmount?<NumberFormat value={this.state.financeHang.inAmount}/>:"-"}</p>
                            </Row>
                            <Row>
                                <p>来款附言：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>{this.state.financeHang.note?this.state.financeHang.note:"-"}</p>
                            </Row>
                        </Col>
                        <Col span={6}>
                             <p>处理状态</p>
                            <p className={less.text} style={{color:"#39c7ff",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>{this.state.financeHang.statusStr}</p>
                            <p>处理人：{this.state.financeHang.acceptorUsername}</p>
                            <p>处理时间：{this.state.financeHang.acceptTime}</p>
                        </Col>  
                    </Row>
                </Card>
                {this.state.listFinanceHangHandleOrders ? (<Card title="疑似结算单" bordered={false} className={less.incomingInformation+" mb10"}>
                
                <div>
                <Row>
                    {/* <div className={less.icon_img}>已选中</div> */}
                    <Col span={9}>
                        <Row className={less.rightCol}>
                            <span className={less.label}>采购公司：</span>
                        </Row>
                        <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>
                            <span className={less.text}>{this.state.listFinanceHangHandleOrders?this.state.listFinanceHangHandleOrders.buyerCompanyName:'-'}</span>
                        </Row>
                        <Row className={less.rightCol}>
                            <span className={less.label}>采购项目：</span>
                        </Row>
                        <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>
                            <span className={less.text}>{this.state.listFinanceHangHandleOrders ? this.state.listFinanceHangHandleOrders.organizationName :'-'}</span>
                        </Row>
                        <Row className={less.rightCol}>
                            <BaseDetails title="采购账户">
                            {this.state.listFinanceHangHandleOrders ? this.state.listFinanceHangHandleOrders.companyName : '-'}
                            
                            </BaseDetails>
                        </Row>
                        <Row className={less.rightCol}>
                        <BaseDetails title="付款人">
                            {this.state.listFinanceHangHandleOrders ? this.state.listFinanceHangHandleOrders.buyerUsername :'-'}&nbsp;&nbsp;({this.state.listFinanceHangHandleOrders.userNo ? this.state.listFinanceHangHandleOrders.userNo :'-'})&nbsp;&nbsp;{this.state.listFinanceHangHandleOrders.buyerPhone ? this.state.listFinanceHangHandleOrders.buyerPhone :'-'}
                        </BaseDetails>
                        </Row>
                        <Row className={less.rightCol}>
                        <BaseDetails title="供应商">
                        {this.state.listFinanceHangHandleOrders ? this.state.listFinanceHangHandleOrders.sellerCompanyName : '-'}
                        </BaseDetails>
                        </Row>
                    </Col>
                    <Col span={3}>
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Col span={12}>
                            <p>付款单金额：</p>
                            <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>{this.state.listFinanceHangHandleOrders?<NumberFormat value={this.state.listFinanceHangHandleOrders.amount}/>:"-"}</p>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right', paddingTop: '10px', paddingRight: '10px' }}>
                                            <p style={{ marginBottom: '3px' }}><span>项目部匹配次数:</span><span style={{ marginLeft: '10px' }}>{this.state.listFinanceHangHandleOrders.deptNum}</span></p>
                                            <p><span>结算单匹配次数:</span><span style={{ marginLeft: '10px' }}>{this.state.listFinanceHangHandleOrders.settlementNum}</span></p>
                                        </Col>
                            
                        </Row>
                        <Row>
                            <p>来款附言：</p>
                            <span className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>{this.state.listFinanceHangHandleOrders?this.state.listFinanceHangHandleOrders.payCode:"-"}</span>
                            <span style={{color:"#39c7ff",marginLeft:'44px',cursor:'pointer'}} onClick={this.showModal}>查看历史来款（{this.state.listFinanceHangHandleOrders.historNum}）</span>
                            <Modal title="历史来款" visible={this.state.visible} 
                                 onCancel={this.handleCancel} footer='' width={1050}>
                                    <Row>
                        <Col span={8}>
                            <Row className={less.rightCol}>
                                <span className={less.label}>来款账户</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>
                                <span className={less.text}>{this.state.findHistory.inAcctIdName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <BaseDetails title="来款账号">
                                {this.state.findHistory.inAcctId}
                                </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="流水号">
                                {this.state.findHistory.serialNumber}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="来款时间">
                                {this.acctDate()}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="来款银行">
                                {this.state.findHistory.bankName}
                            </BaseDetails>
                            </Row>
                        </Col>
                        <Col span={5}>
                            <p style={{width:'2px',height:'300px',backgroundColor:'#ccc',marginLeft:'150px'}}></p>
                        </Col>
                        <Col span={11}>
                            <Row>
                                <p>来款金额（元）：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>{this.state.findHistory.inAmount?<NumberFormat value={this.state.findHistory.inAmount}/>:"-"}</p>
                            </Row>
                            <Row>
                                <p>来款附言：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>{this.state.findHistory.note?this.state.findHistory.note:"-"}</p>
                            </Row>
                        </Col> 
                    </Row>
                    <hr style={{marginTop:'12px',backgroundColor:'#ccc'}}></hr>
                    <Tabs defaultActiveKey="1" onChange={this.onTabsChange}>
                                                <TabPane tab={`采购商来款记录(${this.state.total})`} key="1">
                                                    <Table
                                                        rowSelection={null}
                                                        columns={this.columns4()}
                                                        dataSource = {this.state.getHistoryFinanceVo}
                                                        pagination={false}
                                                        scroll={{ x: true }}
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
                                                </TabPane>
                                                <TabPane tab={`项目部来款记录(${this.state.total2})`} key="2">
                                                    <Table
                                                        rowSelection={null}
                                                        columns={this.columns5()}
                                                        dataSource = {this.state.getHistoryDeptVos}
                                                        pagination={false}
                                                        scroll={{ x: true }}
                                                    />
                                                    <div style={{float: 'right',margin: '16px 0'}}>
                                                        <Pagination
                                                            total={this.state.total2}
                                                            showSizeChanger
                                                            showQuickJumper
                                                            showTotal={showTotal2}
                                                            onChange={this.pageChange}
                                                            onShowSizeChange={this.onShowSizeChange}
                                                        />      
                                                    </div>
                                                </TabPane>
                                            </Tabs>
                                </Modal>
                        </Row>
                        <Row>
                            <BaseDetails title="结算单号">
                            {this.state.listFinanceHangHandleOrders.settlementNo}
                            <span style={{color:"#39c7ff",marginLeft:'44px',cursor:'pointer'}} onClick={this.platDetail.bind(this,this.state.listFinanceHangHandleOrders.id,this.state.listFinanceHangHandleOrders.uuids)}>查看结算单详情</span>
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="结算金额">
                            {this.state.listFinanceHangHandleOrders.totalAmount?<NumberFormat value={this.state.listFinanceHangHandleOrders.totalAmount}/>:'-'}
                            </BaseDetails>
                        </Row>
                        <Row>
                            <BaseDetails title="未付金额">
                            {(this.state.listFinanceHangHandleOrders.restAmount || this.state.listFinanceHangHandleOrders.restAmount==0)?<NumberFormat value={this.state.listFinanceHangHandleOrders.restAmount}/>:'-'}
                            </BaseDetails>
                        </Row>
                    </Col>
                </Row>
                </div>
            
            </Card>):''}
            <Card title="操作日志">
                    <Table columns={columns3} dataSource={this.state.financeHangHandle} pagination={false} />
                </Card>
                <Card title="备注">
                    <Table columns={columns2} dataSource={this.state.findFinanceReview} pagination={false} />
                </Card>
            {/* <Card title="操作日志">
            <Table columns={columns2} dataSource={this.state.financeHangHandle} pagination={false}/>
                                                        
                </Card> */}
                {this.state.financeHang.fileName ?
                <Card title="附件" style={{marginTop:'10px'}}>
                <Row>
                    <BaseDetails title="附件">
                    <span title={this.state.financeHang.fileName}><a href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.financeHang.filePath + '?filename='+this.state.financeHang.fileName)} download={this.state.financeHang.fileName} target="_blank">{this.state.financeHang.fileName}</a></span>
                    </BaseDetails>
                </Row>
                </Card>:''
                }
                <BaseAffix>
                    {/* <Button type="primary"onClick={() => {this.rejectChange(2)}}>驳回</Button> */}
                    <Button type="primary" onClick={this.goBack} style={{margin:'16px'}}>关闭</Button>
                    {/* <Button type="primary" onClick={() => {this.passChange(1)}}>通过</Button> */}
                </BaseAffix>
                {/* <Reject
                financeHang = {this.state.financeHang}
                listFinanceHangHandleOrders={this.state.listFinanceHangHandleOrders}
                type ={this.state.type}
                stopVisible={this.state.rejectVisible}
                closeModal={this.closeModal.bind(this)}
                ></Reject>
                <Pass
                stopVisible={this.state.passVisible}
                closeModal={this.closeModal.bind(this)}
                ></Pass> */}
            </div>
        )
    }
}

export default DetailFinanceReview;