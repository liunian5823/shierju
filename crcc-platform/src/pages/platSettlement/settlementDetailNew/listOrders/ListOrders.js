import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio,Pagination } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';
import warning from '@/static/img/orderwarning.png';
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
            //全部数据列表
            allDataList: [],
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
        api.ajax("GET", "@/platform/settlementDetail/getOrderBySettlementId", {
            ...params
        }).then(r => {
            // console.log('888888888888888',r.data)
            if(r.code==200){
              this.setState({
                dataSource: r.data,
                total: r.data.total,
                allDataList: r.data.rows,
            })
            }
            
        });
        // setTimeout(()=>{
        //     this.props.getMoney(this.state.dataSource)
        // },2000);
        
        
        
        
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
              tempStatus = '物流报价未成交（48小时未确认）';
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
                tempStatus = '未发货';
                break;
            case 40:
                tempStatus = '待收货';
                break;
            case 50:
                tempStatus = '质保中';
                break;
            case 70:
                tempStatus = '已完成';
                break;
            case 100:
                tempStatus = '作废失效';
                break;
            case 110:
                tempStatus = '订单退款';
                break;
            default:
              break;
          }
          return tempStatus;
      }

    pageChange = (page) => {
        
        this.handleSearch({
          settlementId : this.props.settlementId,
           page :page,
          rows : this.state.pageSize
       
   });
      };

      handleSorter = (orderParams, type, e) => {
        console.log('859',orderParams);
        
        let params = {};
    
        // let tableStatus = this.state.searchList.tabStatus;
        // if (tableStatus) {
        //   params.tabStatus = tableStatus;
        // }
        //排序
        if (orderParams != null) {
          params.orderKey = orderParams.field;
        //   params.sort = orderParams.order;
          let sortValue = 0;
          console.log('888888888888888',orderParams.order)
          if (orderParams.order == 'ascend') {
              console.log('bhhfdfhd')
              params.sort = 'asc'
          }else{
              params.sort ='desc'
          }
          if (params.orderKey == 'orderNo') {
            params.orderNoSort = sortValue;
          } else if (params.orderKey == 'qualityRetentionPrice') {
            params.qualityRetentionPriceSort = sortValue;
          } else if (params.orderKey == 'taxAmount') {
            params.taxAmountSort = sortValue;
          } else if (params.orderKey == 'productPrice') {
            params.productPriceSort = sortValue;
          } else if (params.orderKey == 'totalPrice') {
            params.totalPriceSort = sortValue;
          } else if (params.orderKey == 'payedAmount') {
            params.payedAmountSort = sortValue;
          } else if (params.orderKey == 'restAmount') {
            params.restAmountSort = sortValue;
          } else if (params.orderKey == 'orderStatus') {
            params.orderStatusSort = sortValue;
          } else if (params.orderKey == 'advancePaymentDate') {
            params.advancePaymentDateSort = sortValue;
          } else if (params.orderKey == 'confirmTime') {
            params.confirmTimeSort = sortValue;
          } else if (params.orderKey == 'receiveTimeSort') {
            params.receiveTimeSort = sortValue;
          }
        }
    
        
        if (type !== 'sort') {
          this.setState({ activeKey: '1' })
        }
        this.setState(
          {
            page: 1,
          },
          () => {
            params.rows = 10;
            params.page = 1;
            params.settlementId = this.props.settlementId,
            this.handleSearch(params);
          },
        );
      };
      //订单详情页跳转
      // handleToDetails=(uuids)=>{
      //   let params = {}
      //   params.uuids = uuids
      //   this.props.history.push(getUrlByParam('/platInvoice/orderDetail',params))

      // }
    columns = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width:188,
        sorter: true,
        render: (text, record, index) => {
            // <p style={{width:"172px"}}>
            //     <span title={text}>{text}</span>
            // </p>
            return (
              <p style={{ width: '180px',position:'relative' }}>
                  {record.closeFlag == '1' || record.orderStatus == 100 ? <img style={{ position: 'absolute', top: '-25px', left: '-8px' }} src={warning}></img> : null}
                  {text}
              </p>
          );
        }
    },
    {
        title: '质保金',
        dataIndex: 'qualityRetentionPrice',
        key: 'qualityRetentionPrice',
        width:120,
        sorter: true,
        render: (text, record, index) => (
            <div style={{width:"120px"}}>
              <p>{record.retentionReceiver ? moment(record.retentionReceiver).format('YYYY-MM-DD') : `收货日+${record.paymentDays ? record.paymentDays : 90}天`}</p>
                <p title={text}>￥{(text || text==0)?<NumberFormat value={text}/>:"-"}</p>
            </div>
        )
    }, 
    {
        title: '税额',
        dataIndex: 'taxAmount',
        key: 'taxAmount',
        width:188,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, 
    {
        title: '商品金额',
        dataIndex: 'totalPriceNoTax',
        key: 'totalPriceNoTax',
        width:188,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },
    {
        title: '税价合计',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width:188,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },
    {
        title: '已付金额',
        dataIndex: 'payedAmount',
        key: 'payedAmount',
        width:188,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },
    {
        title: '剩余应付',
        dataIndex: 'restAmount',
        key: 'restAmount',
        width:188,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },
    {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width:168,
        sorter: true,
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
                  case '未发货':
                    color = '#F5C27F';
                    break;
                  case '质保中':
                    color = '#95D3A7';
                    break;
                  case '已完成':
                    color = '#99D4AA'
                    break;
                  case '作废失效':
                    color = 'red'
                    break;
              }
          return <div >
              <p style={{color: `${color}`}}>{statusStr?statusStr:'-'}</p>
          </div>
            
          
      }
    },
    {
        title: '预计付款日期',
        dataIndex: 'advancePaymentDate',
        key: 'advancePaymentDate',
        width:158,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    },
    {
        title: '下单日期',
        dataIndex: 'confirmTime',
        key: 'confirmTime',
        width:88,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    }, {
        title: '收货日期',
        dataIndex: 'receiveTime',
        key: 'receiveTime',
        width:88,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    },
    {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width:44,
        render: (text, record, index) => {
            let param = {}
            param.uuids = record.uuids
            param.goBackUrl = "/financialCenter/settlementDetailNew/"+this.props.settlementId;
            let href = systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetailNew', param));
            return(
                <p style={{width:"28px"}}>
                    <a target="_blank" href={href}>查看</a>
                    {/* <a target="_blank" onClick={this.handleToDetails(record.uuids)}>查看</a> */}
                </p>
            )
        }
    }];

    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
          }
        return (
            <div className="purchaserSettlementDetailListOrders">
                <Table
                    rowSelection={null}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource.rows}
                    pagination = {false}
                    scroll = {{x:true}}
                    onChange = {(pagination,filters,sorter)=>{
                        this.handleSorter(sorter,'sort')
                    }}
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
            </div>
            
        )
    }
}

export default Form.create()(ListOrders)