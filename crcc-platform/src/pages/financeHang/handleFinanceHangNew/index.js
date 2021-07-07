import { Card, Row, Col, Button, Table, Switch, message, Tabs, Popconfirm, Form, Input, Modal, Upload, Icon,Pagination } from 'antd';
import api from '@/framework/axios';
import {getDetailsLabel, detailsLayout} from  '@/components/gaoda/Details';
import {NumberFormat} from "@/components/gaoda/Format";
import {exportFile} from '@/utils/urlUtils';
import {getUrlByParam, getQueryString,getUrlByParamNew} from '@/utils/urlUtils';
import BaseDetails from '@/components/baseDetails';
import BaseTable from '@/components/baseTable';
import BaseAffix from '@/components/baseAffix';
import Refund from '../refundNew';
import MatchingOrder from '../matchingOrderNew';
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import less from './index.less';
import './index.css';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class handleFinanceHang extends React.Component{
    state = {
        financeHang:{},
        financeHangHandle:[],
        findFinanceReview:[],
        listFinanceHangOrders:[],
        listFinanceHangHandleOrders:[],
        selectedRow:{},
        refundModalVisible:false,
        matchingOrderModalVisible:false,
        loading: false,
        flagMore:1,//可以点击更多
        payWayList: [],
        auditMas:'',//备注信息
        marks:'',
        findHistory:{},
        findBuyerCompany:[],
        selectedId:'',
        selectUuids:'',
        getApprovalStatus:{},
        counts:5,
        total:0,
        total2:0,
        pageSize: 10,
        page:1,
        getHistoryFinanceVo:[],
        getHistoryDeptVos:[]

    }

    _isMounted = false;


    componentWillMount(){
        this._isMounted = true;
        let params={}
        params.workOrdersId = this.props.match.params.workOrdersId
        // 挂账基本信息
        // api.ajax("GET", "@/platform/financehang/findFinancePendingByWorkOrdersId", params
        api.ajax("GET", "@/platform/financehang/findFinanceAccepteByWorkOrdersId", {
            id:this.props.match.params.id
        }
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                financeHang: r.data
            })
        })
        // 疑似订单列表
        // this.search(1,10);
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
                listFinanceHangOrders: r.data.financeHangVoList,
                payWayList:r.data.financeHangVoList,
                selectedRow:{}
            })
        })
        // api.ajax("GET", "@/platform/financehang/findFinanceAccountSingularByWorkOrdersId", {}
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
        api.ajax("GET", "@/platform/financehang/findReviewLogByWorkOrdersId", {
            id: this.props.match.params.id
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
            id:this.props.match.params.id
        }
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            console.log('nnnnnnnnn',r.data)
            this.setState({
                findFinanceReview: r.data
            })
        })
        //备注回显
        api.ajax("GET", "@/platform/financehang/findUserRemarksByWorkOrdersId", {id:this.props.match.params.id}
            // uuids:getQueryString("uuids")
        ).then((r) => {
            if (!this._isMounted) {
                return;
            }
            console.log('999999999999999999',r)
            this.setState({
                auditMas: r.data ? r.data.userRemarks : ''
            })
        })
        
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    //选择疑似订单
    paymentOptionClick(type) {
        console.log('2hh2',this.state.payWayList)
        let tempAry = this.state.payWayList.map((item, index) => {
            console.log('88-------------',index)
          let status = true;
          if (index == type) {
            status = false
            this.setState({
                selectedRow:this.state.listFinanceHangOrders[index],
                selectedId:this.state.listFinanceHangOrders[index].id,
                selectUuids:this.state.listFinanceHangOrders[index].uuids,
            })
          }
          
          return status
        });
        console.log('2222222222222222',tempAry)
        this.setState({
            payWayList: tempAry
        })
        // let lists = this.state.payWayList;
        //     if(lists.includes(false)){
        //         this.setState({
                

        //                 })
                    
        //     }

    
      }

      //匹配订单
      matchingOrder = ()=>{
          console.log('%%%%',this.state.payWayList)
          let lists = this.state.payWayList;
            if(lists.includes(false)){
                this.setState({
                    matchingOrderModalVisible:true,
                    // selectedRow:this.state.listFinanceHangHandleOrders[index]

                        })
                        api.ajax("GET", "@/platform/config/getApprovalStatus").then((r) => {
                            console.log('gg',r.data.approval)
                            this.setState({
                                getApprovalStatus: r.data
                            })
                            console.log('ddd',this.state.getApprovalStatus.approval)
                    })
                    
            }else{
                message.error("请选择结算单");
                return;
            }
        
    }
    //释放处理
    release = () =>{
              api.ajax("GET", "@/platform/financehang/release", {id:this.props.match.params.id,workOrdersId:this.props.match.params.workOrdersId}
              // uuids:getQueryString("uuids")
                  ).then((r) => {
                      if(r.code !=200){
                          message.error(r.msg)
                      }else{
                          message.success(r.msg)
                          this.timerEnd = setTimeout(()=>{
                              this.props.history.push("/financialCenter/financeHangNew");
                              window.location.reload();
                          },500)
                      }
                  //     this.setState({
                  //     release: r.data
                  // })
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
    refund = ()=>{
        let lists = this.state.payWayList;
            if(lists.includes(false)){
                this.setState({
                    refundModalVisible:true,
                    // selectedRow:this.state.listFinanceHangHandleOrders[index]

                        })
                        api.ajax("GET", "@/platform/config/getApprovalStatus").then((r) => {
                            console.log('gg',r.data.approval)
                            this.setState({
                                getApprovalStatus: r.data
                            })
                            console.log('ddd',this.state.getApprovalStatus.approval)
                    })
                    
            }else{
                message.error("请选择结算单");
                return;
            }
    }
      formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
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

    columns = () => {
        return [
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 188,
                render: (text, record, index) => (
                    <p style={{width:"172px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '采购单位',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 300,
                render: (text, record, index) => (
                    <p style={{width:"284px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '项目部',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 300,
                render: (text, record, index) => (
                    <p style={{width:"284px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '供应商',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 300,
                render: (text, record, index) => (
                    <p style={{width:"284px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                width: 128,
                render: (text, record, index) => (
                    <p style={{width:"112px"}} className={less.tableColumnWidth}>
                        <span title={text?moment(text).format("YYYY-MM-DD"):""}>{text?moment(text).format("YYYY-MM-DD"):""}</span>
                    </p>
                ),
            },
            {
                title: '状态(附言码)',
                dataIndex: 'tradeNo',
                key: 'tradeNo',
                width: 100,
                render: (text, record, index) => (
                    <p style={{width:"84px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '订单金额(元)',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                sorter: true,
                width: 150,
                render: (text, record, index) => (
                    <p style={{width:"134px"}} className={less.tableColumnWidth}>
                        <span title={text}><NumberFormat value={text}/></span>
                    </p>
                ),
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key: 'handle',
                width:60,
                fixed: 'right',
                render: (text, record, index) => {
                    let param = {}
                    param.uuids = record.uuids
                    param.goBackUrl = "";
                    let href = systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetail', param));
                    return(
                        <p style={{width:"50px"}}>
                            <a target="_blank" href={href}>查看</a>
                        </p>
                    )
                }
            }
        ]
    }

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

    search = (current, pageSize)=>{
        console.log('**',this.props.form.getFieldValue("keyword"))
        const param = {}
        // param.settlementNo = getQueryString("uuids")
        param.key = this.props.form.getFieldValue("keyword")
        param.page = current
        param.rows= pageSize
        let listFinanceHangOrders = this.state.listFinanceHangOrders
        console.log('33333',listFinanceHangOrders[0])
        param.id = this.props.match.params.id
        api.ajax("GET", "@/platform/financehang/findFinanceAccountSingularByWorkOrdersId", param).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                //listFinanceHangOrders,
                payWayList: r.data,
                // payWayList: listFinanceHangOrders,
                selectedRow: {},
                listFinanceHangOrders: r.data
            })
        })
    }
    
    searchs = (current, pageSize,flag)=>{
        // if(pageSize <= 5){
        //     message.warning('没有更多了！')
        // }else{
        //     const param = {}
        // this.setState(state=>{
        //     return {
        //         counts:state.counts+5
        //     }
        // })
        // param.page = current
        // param.rows= pageSize
        // param.id = this.props.match.params.id
        // param.start = this.state.counts
        // api.ajax("GET", "@/platform/financehang/findFinanceAccountSingularByWorkOrdersId", param).then((r) => {
        //     if (!this._isMounted) {
        //         return;
        //     }
        //     this.setState({
        //         listFinanceHangOrders: r.data,
        //         payWayList:r.data,
        //         selectedRow:{}
        //     })
        // })
        // }
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
        this.setState({
            flagMore : 2
        })
            if(this.state.flagMore == 1){
                api.ajax("GET", "@/platform/financehang/findFinanceAccountSingular", params).then((r) => {
                    if (!this._isMounted) {
                        return;
                    }
                    let listFinanceHangOrders = this.state.listFinanceHangOrders
                    if (r.data.financeHangVoList.length > 0) {
                        r.data.financeHangVoList.map((item, index) => {
                            let res = listFinanceHangOrders.every((item2, index) => {
                                return item2.id!==item.id
                            })
                            if (res) {
                                this.setState({
                                    flagMore : 1
                                })
                                listFinanceHangOrders.push(item)
                            }
                        })
                    }
                    else {
                        message.info('没有更多数据')
                    }
                    this.setState({
                        listFinanceHangOrders,
                        // payWayList: r.data,
                        payWayList: listFinanceHangOrders,
                        selectedRow: {},
                        sfinanceHang: r.data,
                        
                    })
                })
            }
        // })
            
           
        
        
        
    }

    reset = ()=>{
        this.props.form.resetFields();
        this.search(1, this.state.listFinanceHangOrders.pageSize);
    }

    goBack = ()=>{
        window.close()
    }

    
    save = ()=>{
        if(!this.state.auditMas){
            message.error('请输入备注信息')
        }else{
            api.ajax('GET','@/platform/financehang/updateUserRemarks',{
                id:this.props.match.params.id,
                userRemarks:this.state.auditMas
            }).then(r=>{
                if(r.code == 200){
                    message.success(r.msg)
                    location.reload();
                }
                
                this.setState({
                    auditMas:r.data
                })
            }).catch(err=>{
                
            })
        }
        
    }

    

    onModalCancel = ()=>{
        this.setState({
            refundModalVisible:false,
            matchingOrderModalVisible:false
        })
    }

    onSelect = (record, selected, selectedRows)=>{
        if(selected){
            this.setState({
                selectedRow:record,
            })
        }
    }
    showModal=() =>{
        this.setState({
                visible: true,
              })
        
        let params={};
        setTimeout(() => { 
            params.page =this.state.page,
            params.rows = this.state.pageSize
            params.id = this.props.match.params.id
            params.inAcctId = this.state.financeHang.inAcctId
            params.settlementId = this.state.selectedId
            api.ajax("GET", "@/platform/settlement/getHistory", params).then((r) => {
                this.setState({
                    findHistory: r.data,
                })
        })
        api.ajax("GET", "@/platform/settlement/getHistoryFinanceVo", params).then((r) => {
            this.setState({
                getHistoryFinanceVo: r.data.rows,
                total:r.data.total
            })
    })
    api.ajax("GET", "@/platform/settlement/getHistoryDeptVos", params).then((r) => {
        this.setState({
            getHistoryDeptVos: r.data.rows,
            total2:r.data.total

        })
})
         }, 1000);
         
      }
      getInitialState=()=> {
        return { visible: false}
      }
      handleCancel=(e)=> {
        this.setState({
          visible: false,
        });
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
    platDetail=()=>{
        setTimeout(()=>{
            // this.props.history.push('/financialCenter/platSettlementListNew/settlementDetailNew/'+this.state.selectedId+'/'+this.state.selectUuids);
            window.open(systemConfigPath.jumpPage(getUrlByParamNew('/financialCenter/platSettlementListNew/settlementDetailNew/'+this.state.selectedId+'/'+this.state.selectUuids)))
        },500)
        
      
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

    stausToRes = (status) => {
        if (!status) {
          return;
        }
        let tempStatus = '-';
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
    //操作日志
    columns3 = [
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
    columns2 = [
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

    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
          }
          function showTotal2(total2) {
            return `共 ${total2} 条`;
          }
        const that = this
        const { getFieldProps } = this.props.form;
        const payWayList = this.state.payWayList;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 20 },
    };
        const rowSelection = {
            type:"radio",
            onSelect: this.onSelect
        };
        // const pagination = {
        //     current:this.state.listFinanceHangOrders.pageNum,
        //     pageSize:this.state.listFinanceHangOrders.pageSize,
        //     total: this.state.listFinanceHangOrders.total,
        //     showTotal:total => `共 ${total} 条`,
        //     showQuickJumper: true,
        //     showSizeChanger: true,
        //     onShowSizeChange(current, pageSize) {
        //         that.search(current, pageSize);
        //     },
        //     onChange(current) {
        //         that.search(current, this.pageSize);
        //     },
        // };

        return(
            <div className={less.handle}>
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
                            <p style={{width:'2px',height:'300px',backgroundColor:'#ccc',marginLeft:'150px'}}></p>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <p>来款金额（元）：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"24",paddingBottom:"16px"}}>{this.state.financeHang.inAmount?<NumberFormat value={this.state.financeHang.inAmount}/>:"-"}</p>
                            </Row>
                            <Row>
                                <p>来款附言：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"24",paddingBottom:"16px"}}>{this.state.financeHang.note?this.state.financeHang.note:"-"}</p>
                            </Row>
                        </Col>
                        <Col span={6}>
                             <p>处理状态</p>
                            <p className={less.text} style={{color:"#39c7ff",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>{this.state.financeHang.statusStr}</p>
                            <p>受理人：{this.state.financeHang.acceptorUsername}</p>
                            <p>受理时间：{this.state.financeHang.acceptTime}</p>
                        </Col>  
                    </Row>
                </Card>
                <Card title="疑似结算单" bordered={false} className={less.suspectedOrders+" mb10"}
                    extra={
                        <div className={less.extra}>
                            <div className={less.erer}>
                            <Input style={{width:"350px"}}type="text" {...getFieldProps('keyword')} placeholder="结算单号/来款附言/采购商名称/项目部/付款人手机号"/>
                            </div>
                            {/* <Button type="primary" onClick={this.search.bind(this,1,this.state.listFinanceHangOrders.pageSize)} style={{margin:"0 8px"}}>搜索</Button> */}
                            <Button type="primary" onClick={this.search.bind(this,1,this.state.listFinanceHangOrders.length)} style={{margin:"0 8px"}}>搜索</Button>
                            <Button type="ghost" onClick={this.reset}>重置</Button>
                        </div>
                    }
                >
                        {(this.state.listFinanceHangOrders).map((item,index)=>(
                    <div className={less.amd_pay + ' ' + (!payWayList[index]  ? less.pay_way_click_color : '')} onClick={() => {this.paymentOptionClick(index) }}>
                    <Row>
                        {/* <div className={less.icon_img}>已选中</div> */}
                        <Col span={8}>
                            <Row className={less.rightCol}>
                                <span className={less.label}>采购公司：</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"24",paddingBottom:"16px"}}>
                                <span className={less.text}>{item.buyerCompanyName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <span className={less.label}>采购项目：</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"24",paddingBottom:"16px"}}>
                                <span className={less.text}>{item.organizationName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <BaseDetails title="采购账户">
                                {item.companyName}
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
                                <span className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"24",paddingBottom:"16px"}}>{item.payCode?item.payCode:"-"}</span>
                        <span style={{color:"#39c7ff",marginLeft:'44px',cursor:'pointer'}} onClick={this.showModal}>查看历史来款（{item.historNum}）</span>
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
                                columns = {this.columns4()}
                                dataSource = {this.state.getHistoryFinanceVo}
                                scroll = {{x:true}}
                                pagination = {false}
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
                                columns = {this.columns5()}
                                dataSource = {this.state.getHistoryDeptVos}
                                pagination = {false}
                                scroll = {{x:true}}
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
                                {item.settlementNo}
                                <span style={{color:"#39c7ff",marginLeft:'44px',cursor:'pointer'}} onClick={this.platDetail}>查看结算单详情</span>
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="结算金额">
                                {item.totalAmount?<NumberFormat value={item.totalAmount}/>:'-'}
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="未付金额">
                                {item.restAmount || item.restAmount == 0?<NumberFormat value={item.restAmount}/>:'-'}
                                </BaseDetails>
                            </Row>
                        </Col>
                    </Row>
                    </div>
                    
                ))
                  
                }
                <div className={less.more} onClick={this.searchs.bind(this,1,this.state.listFinanceHangOrders.length,this.state.flagMore)}>查看更多++</div>  
                </Card>
                <Card title="操作日志">
                    <Table columns={this.columns3} dataSource={this.state.financeHangHandle} pagination={false} />
                </Card>
                <Card title="备注" bordered={false} className={less.incomingInformation+" mb10"}>
                <Table columns={this.columns2} pagination={false} dataSource={this.state.findFinanceReview}/>
                </Card>
                <Card title="备注" bordered={false} className={less.incomingInformation+" mb10"}>
                    <FormItem   {...formItemLayout} label="备注信息">
                            <Input  type="textarea" maxLength='400' rows={5} value={this.state.auditMas} onChange={(e)=>this.onChange(e,"auditMas")}/>
                          </FormItem>
                </Card>
                <BaseAffix>
                    <Popconfirm placement="top" title={"确认退款吗?"} onConfirm={this.refund}>
                        <Button type="ghost" loading={this.state.loading} style={{marginRight: "10px"}}>退款</Button>
                    </Popconfirm>
                    {/* <Button type="ghost" loading={this.state.loading} style={{marginRight: "10px"}} onClick={()=>{this.props.history.push("/financialCenter/financeHangNew")}}>关闭</Button> */}
                    <Button type="ghost" loading={this.state.loading} style={{marginRight: "10px"}} onClick={this.goBack}>关闭</Button>
                    <Button type="ghost" loading={this.state.loading} onClick={this.save} style={{marginRight: "10px"}}>保存</Button>
                    <Popconfirm placement="top" title={"您是否确认释放处理"} onConfirm={this.release}>
                        <Button type="primary" loading={this.state.loading} style={{marginRight: "10px"}}>释放</Button>
                    </Popconfirm>
                    <Popconfirm placement="top" title={"确认匹配结算单吗?"} onConfirm={this.matchingOrder}>
                        <Button type="primary" loading={this.state.loading} style={{marginRight: "10px"}}>匹配结算单</Button>
                    </Popconfirm>
                    
                    {/* <Button type="ghost" loading={this.state.loading} onClick={this.goBack}>返回</Button> */}
                    
                </BaseAffix>
                <Refund
                    getApprovalStatus={this.state.getApprovalStatus}
                    financeHang = {this.state.financeHang}
                    selectedRow = {this.state.selectedRow}
                    visible = {this.state.refundModalVisible}
                    onCancel = {this.onModalCancel}
                    history = {this.props.history}
                />
                <MatchingOrder
                    getApprovalStatus={this.state.getApprovalStatus}
                    financeHang = {this.state.financeHang}
                    selectedRow = {this.state.selectedRow}
                    visible = {this.state.matchingOrderModalVisible}
                    onCancel = {this.onModalCancel}
                    history = {this.props.history}
                />
            </div>
        )
    }
}

export default Form.create()(handleFinanceHang);