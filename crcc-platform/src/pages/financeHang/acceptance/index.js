import { Card, Row, Col, Button, Table, Switch, message, Tabs, Popconfirm, Modal } from 'antd';
import api from '@/framework/axios';
// import LoadMore from '../components/loadMore';
import {exportFile} from '@/utils/urlUtils';
import {getUrlByParam, getQueryString} from '@/utils/urlUtils';
import BaseDetails from '@/components/baseDetails';
import BaseTable from '@/components/baseTable';
import BaseAffix from '@/components/baseAffix';
import {NumberFormat} from "@/components/gaoda/Format";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import less from './index.less';
import './index.css';

const TabPane = Tabs.TabPane;
class detailFinanceHang extends React.Component{
    state = {
        financeHang:{},
        listFinanceHangHandleOrders:[],
        financeHangHandle:[],
        loading: false,
        tableState: 0,
        payWayList: [],
        findHistory:{},
        findBuyerCompany:[],
        selectedId:'',
        counts:5,
        listFinanceHangOrders:[],
        sfinanceHang: {}
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        let params={}
        params.id = this.props.match.params.id
        // params.workOrdersId = this.props.match.params.workOrdersId
        api.ajax("GET", "@/platform/financehang/findFinanceAccepteByWorkOrdersId",params
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                financeHang: r.data
            })
        })
        api.ajax("GET", "@/platform/financehang/findFinanceAccountSingular", {
            id: this.props.match.params.id
        }
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            console.log('r', r);
            this.setState({
                sfinanceHang: r.data,
                listFinanceHangHandleOrders: r.data.financeHangVoList,
                payWayList:r.data.financeHangVoList
            })
        })
        // api.ajax("GET", "@/platform/financehang/findFinanceAccountSingularByWorkOrdersId", params
        //     // uuids:getQueryString("uuids")
        // ).then((r) => {
        //     if (!this._isMounted) {
        //         return;
        //     }
        //     this.setState({
        //         listFinanceHangHandleOrders: r.data,
        //         payWayList:r.data
        //     })
        // })
        api.ajax("GET", "@/platform/financehang/getHandlLog",params
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                financeHangHandle: r.data
            })
        })
        // this.history()
        this.stausToRes(this.state.financeHang.accountState)
    }
    componentWillUnmount(){
        this._isMounted = false;
        
    }

    baseParams = {

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
    //选择疑似订单
    paymentOptionClick(type) {
        // console.log('29992',this.state.payWayList)
        let tempAry = this.state.payWayList.map((item, index) => {
            // console.log('88-------------',index)
          let status = true;
          if (index == type) {
            status = false
            this.setState({
                selectedId:this.state.listFinanceHangHandleOrders[index].id
            })
          }
          return status
        });
        // console.log('tempAry',tempAry)
        this.setState({
            payWayList: tempAry
        })
    
      }
      //点击受理理调用
  regPlatform=()=> {
    let params={}
    params.id = this.props.match.params.id
    params.workOrdersId = this.props.match.params.workOrdersId
    let lists = this.state.payWayList;
    // console.log('888888888',lists.includes(false))
    // if(lists.includes(false)){
        api.ajax("GET", "@/platform/financehang/financeAccept", params
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if(r.code == 200){
                message.success('受理成功')
                setTimeout(()=>{
                    window.close();
                    // this.props.history.push("/financialCenter/financeHangNew");
                    // location.reload()
                },1000)
            }
            this.setState({
                financeAccept: r.data
            })
        }).catch((err)=>{
            console.log('88888888888')
            if(err.code== 40000){
                message.error(err.msg)
            }
        })
    // }else{
    //     message.error("请选择订单");
    //         return;
    // }
  }
  history = () =>{
    let param={};
        setTimeout(() => { 
            param.id = this.props.match.params.id
            param.inAcctId = this.state.financeHang.inAcctId
            param.settlementId = this.state.selectedId
            api.ajax("GET", "@/platform/settlement/getHistory", param).then((r) => {
                this.setState({
                    findHistory: r.data
                })
        })
         }, 1000);
  }

searchs = (current, pageSize)=>{
    let info = this.state.sfinanceHang
        let params = {
            start: info.start,
            end: info.end,
            num: info.num,
            level: info.level,
            inAcctId: `${info.inAcctId}`,
            inAmount: info.inAmount,
            id: info.id
        }
        api.ajax("GET", "@/platform/financehang/findFinanceAccountSingular", params).then((r) => {
            if (!this._isMounted) {
                return;
            }
            let listFinanceHangHandleOrders = this.state.listFinanceHangHandleOrders
            if (r.data.financeHangVoList.length > 0) {
                r.data.financeHangVoList.map((item, index) => {
                    let res = listFinanceHangHandleOrders.every((item2, index) => {
                        return item2.id!==item.id
                    })
                    if (res) {
                        listFinanceHangHandleOrders.push(item)
                    }
                })
                this.paymentOptionClick(pageSize - 1)
                console.log('kkkk', listFinanceHangHandleOrders)
            }
            else {
                message.info('没有更多数据')
            }
            this.setState({
                listFinanceHangOrders: r.data,
                listFinanceHangHandleOrders,
                // payWayList: r.data,
                payWayList: listFinanceHangHandleOrders,
                selectedRow: {},
                sfinanceHang: r.data
            })
        })
    
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

    
    // columns = () => {
    //     return [
    //         {
    //             title: '订单号',
    //             dataIndex: 'orderNo',
    //             key: 'orderNo',
    //             width: 250
    //         },
    //         {
    //             title: '采购单位',
    //             dataIndex: 'buyerCompanyName',
    //             key: 'buyerCompanyName',
    //             width: 250
    //         },
    //         {
    //             title: '项目部',
    //             dataIndex: 'organizationName',
    //             key: 'organizationName',
    //             width: 250
    //         },
    //         {
    //             title: '供应商',
    //             dataIndex: 'sellerCompanyName',
    //             key: 'sellerCompanyName',
    //             width: 250
    //         },
    //         {
    //             title: '下单时间',
    //             dataIndex: 'createTime',
    //             key: 'createTime',
    //             width: 150,
    //             sorter: true,
    //             render: (text, record, index) => (
    //                 <p style={{width:"80px"}}  className={less.tableColumnWidth}>
    //                     <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
    //                 </p>
    //             ),
    //         },
    //         {
    //             title: '状态(附言码)',
    //             dataIndex: 'tradeNo',
    //             key: 'tradeNo',
    //             width: 200
    //         },
    //         {
    //             title: '订单金额(元)',
    //             dataIndex: 'totalPrice',
    //             key: 'totalPrice',
    //             width: 150,
    //             sorter: true,
    //             render: (text, record, index) => (
    //                 <p style={{width:"130px"}}  className={less.tableColumnWidth}>
    //                     <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
    //                 </p>
    //             ),
    //         },
    //         {
    //             title: '操作',
    //             dataIndex: 'handle',
    //             key: 'handle',
    //             width:200,
    //             fixed: 'right',
    //             render: (text, record, index) => {
    //                 let param = {}
    //                 param.uuids = record.uuids
    //                 param.goBackUrl = "";
    //                 let href = systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetail', param));
    //                 return(
    //                     <p style={{width:"130px"}}>
    //                         <a target="_blank" href={href}>查看</a>
    //                     </p>
    //                 )
    //             }
    //         }
    //     ]
    // }
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
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "220px"}} className={less.plat_table_text} title={text}>{text}</span>
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
            }
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
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "220px"}} className={less.plat_table_text} title={text}>{text}</span>
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

    goBack = ()=>{
        this.props.history.push("/financialCenter/financeHang");
    }

    back=()=>{
        window.close()
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
    showModal=() =>{
        this.setState({
                visible: true,
              })
        this.history();
        
        
      }
    //   getInitialState=()=> {
    //     return { visible: false}
    //   }
      handleCancel=(e)=> {
        this.setState({
          visible: false,
        });
      }

    stausToRes = (status) => {
        if (!status) {
          return;
        }
        let tempStatus = '';
        switch (status) {
          case 1:
            tempStatus = '待处理';
            break;
          case 2:
            tempStatus = '审核中';
            break;
          case 3:
            tempStatus = '系统处理中';
            break;
          case 4:
            tempStatus = '处理完成';
            break;
          case 5:
            tempStatus = '待受理';
            break;
          default:
            break;
        }
       
        return tempStatus;
        
      };
      platDetail=()=>{
          setTimeout(()=>{
            // console.log('llll',this.state.selectedId)
            //   let params={};
            //   params.id =this.state.selectedId
              this.props.history.push('/financialCenter/settlementDetailNew/'+this.state.selectedId);
          },500)
          
        
      }
    

    render() {
        const payWayList = this.state.payWayList;
        const dateStyle = {
            textAlign: 'right',
            marginRight: '20px',
            width: '70px',
          };
        const columns2 = [
            {
              title: '操作人',
              width: 150,
              dataIndex: 'username',
              key: 'username',
              render:(text,record)=>{
                  return (
                    <div>
                    <p>{text?text:'--'}</p>
                    <p>{record.userNo?record.userNo:''}</p>
                </div>
                  )
              }
            
            },
            {
              title: '操作时间',
              width: 200,
              dataIndex: 'createTime',
              key: 'createTime',
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
              title: '具体操作',
              dataIndex: 'remarks',
              key: 'remarks',
            },
          ];
        return(
            <div className={less.detailFinanceHang}>
                {/* <Card title="来款信息" extra={<span style={{fontSize:'14px',color:"rgba(0,0,0,0.85)"}}>(工单号：{this.state.financeHang.inAcctIdName})</span>} bordered={false} className={less.incomingInformation+" mb10"}> */}
                <Card title="来款信息" bordered={false} className={less.incomingInformation+" mb10"}>
                    <Row>
                        <Col span={8}>
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
                        <Col span={4}>
                            <p style={{width:'2px',height:'300px',backgroundColor:'#ccc',marginLeft:'160px'}}></p>
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
                            <p>受理人：{this.state.financeHang.acceptorUsername}</p>
                            <p>受理时间：{this.state.financeHang.acceptTime}</p>
                        </Col>  
                    </Row>
                </Card>
                <Card title="疑似结算单" bordered={false} className={less.incomingInformation+" mb10"}>
                {(this.state.listFinanceHangHandleOrders).map((item,index)=>(
                    <div className={less.amd_pay + ' ' + (!payWayList[index] ? less.pay_way_click_color : '')} onClick={() => {this.paymentOptionClick(index) }}>
                    <Row>
                        {/* <div className={less.icon_img}>已选中</div> */}
                        <Col span={8}>
                            <Row className={less.rightCol}>
                                <span className={less.label}>采购公司：</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>
                                <span className={less.text}>{item.buyerCompanyName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <span className={less.label}>采购账户：</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>
                                <span className={less.text}>{item.companyName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <BaseDetails title="采购项目">
                                {item.organizationName}
                                </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="付款人">
                            {item.buyerUsername}&nbsp;&nbsp;{item.userNo?item.userNo:'-'}&nbsp;&nbsp;{item.buyerPhone?item.buyerPhone:'-'}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="供应商">
                            {item.sellerCompanyName}
                            </BaseDetails>
                            </Row>
                        </Col>
                        <Col span={4}>
                        </Col>
                        <Col span={12}>
                            <Row>
                            <Col span={12}>
                                            <p>付款单金额：</p>
                                            <p className={less.text} style={{ color: "rgba(0,0,0,0.85)", fontWeight: "bold", fontSize: "30", paddingBottom: "16px" }}>{item.amount ? <NumberFormat value={item.amount} /> : "-"}</p>
                                        </Col>
                                        <Col span={12} style={{ textAlign: 'right', paddingTop: '10px', paddingRight: '10px' }}>
                                            <p style={{ marginBottom: '3px' }}><span>项目部匹配次数:</span><span style={{ marginLeft: '10px' }}>{item.deptNum}</span></p>
                                            <p><span>结算单匹配次数:</span><span style={{ marginLeft: '10px' }}>{item.settlementNum}</span></p>
                                        </Col>
                            </Row>
                            <Row>
                                <p>来款附言：</p>
                                <span className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30",paddingBottom:"16px"}}>{item.payCode?item.payCode:"-"}</span>
                <span style={{color:"#39c7ff",marginLeft:'44px',cursor:'pointer'}} onClick={this.showModal}>查看历史来款（{item.deptNum+item.settlementNum}）</span>
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
                                {this.state.findHistory.frontLogNo}
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
                        <TabPane tab={`采购商来款记录(${this.state.findHistory.historyFinanceVos ?this.state.findHistory.historyFinanceVos.length: 0})`} key="1">
                            <Table
                                rowSelection={null}
                                columns = {this.columns4()}
                                dataSource = {this.state.findHistory.historyFinanceVos}
                                pagination = {false}
                                scroll = {{x:true}}
                            />
                        </TabPane>
                        <TabPane tab={`项目部来款记录(${this.state.findHistory.historyDeptVos?this.state.findHistory.historyDeptVos.length:0})`} key="2">
                        <Table
                                rowSelection={null}
                                columns = {this.columns5()}
                                dataSource = {this.state.findHistory.historyDeptVos}
                                pagination = {false}
                                scroll = {{x:true}}
                            />
                        </TabPane>
                    </Tabs>
                                </Modal>
                            </Row>
                            <Row>
                                <BaseDetails title="结算单号">
                                {item.settlementNo}
                                <span style={{color:"#39c7ff",marginLeft:'44px',cursor:'pointer'}} onClick={this.platDetail}>查看结算单详情</span>
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="结算金额">
                                {item.totalAmount?<NumberFormat value={item.totalAmount}/>:"-"}
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="未付金额">
                                {item.restAmount?<NumberFormat value={item.restAmount}/>:"-"}
                                </BaseDetails>
                            </Row>
                        </Col>
                    </Row>
                    </div>
                ))
                    
                }
                <div className={less.more} onClick={this.searchs.bind(this,1,this.state.listFinanceHangHandleOrders.length)}>查看更多++</div>  
                </Card>
                <Card title="操作日志">
                    <Table dataSource={this.state.financeHangHandle} columns={columns2} pagination={false}/>
        </Card>
                <BaseAffix>
                    {/* <Button type="primary" onClick={()=>{this.props.history.push("/financialCenter/financeHangNew")}}>返回</Button> */}
                    <Button type="primary" onClick={this.back}>返回</Button>
                    {/* <Button type="primary" style={{marginLeft:'16px'}} onClick={() => {this.regPlatform()}}>受理</Button> */}
                    <Popconfirm placement="top" title={"确认受理吗?"} onConfirm={this.regPlatform}>
                        <Button type="primary" style={{marginLeft: "10px"}}>受理</Button>
                    </Popconfirm>
                </BaseAffix>
            </div>
        )
    }
}

export default detailFinanceHang;