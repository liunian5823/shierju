import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio,Pagination } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import {NumberFormat} from '@/components/gaoda/Format';
import CheckSettleModal from './checksettlemodal';//发票信息
import api from '@/framework/axios';

class ListInvoices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[

            ],
            total:0,
            pageSize: 10,
            page:1,
            passVisible:false
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
        api.ajax("GET", "@/platform/settlementDetail/getInvoiceBySettlementId", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data,
                total: r.data.total,
            })
        });
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
      passChange = (type,record) => {
        this.setState({
          passVisible: true,
          type
        });
        //查看发票
        let params = {
            uuids: record.uuids
        }
        axios.get('@/settlement/detail/getInvoiceInfo', { params }).then((res) => {
            console.log('666',res)
            this.setState({ invoiceData: res.data })
        })
    
      };
      closeModal = () => {
        this.setState({ passVisible: false })
    }

    columns = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width:240,
        render: (text, record, index) => (
            <p style={{width:"220px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    },{
        title: '发票类型',
        dataIndex: 'invType',
        key: 'invType',
        width:120,
        render: (text, record, index) => {
            let invType = "-"
            if(1==text){
                invType = "专票";
            }
            if(2==text){
                invType = "普票";
            }
            if(3==text){
                invType = "其他";
            }
            return(
                <p style={{width:"100px"}} className="table_overflow_twoLine">
                    <span title={invType}>{invType}</span>
                </p>
            )
        }
    },{
        title: '发票代码',
        dataIndex: 'invCode',
        key: 'invCode',
        width:240,
        render: (text, record, index) => (
            <p style={{width:"220px"}} className="table_overflow_twoLine">
                <span title={text}>{text?text:'-'}</span>
            </p>
        ),
    },{
        title: '发票号',
        dataIndex: 'invNo',
        key: 'invNo',
        width:240,
        render: (text, record, index) => (
            <p style={{width:"220px"}} className="table_overflow_twoLine">
                <span title={text}>{text?text:'-'}</span>
            </p>
        ),
    },{
        title: '开票日期',
        dataIndex: 'invCreateTime',
        key: 'invCreateTime',
        width: 180,
        sorter: true,
        render: (text, record) =>{
            return <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
        }
    }, {
        title: '税率',
        dataIndex: 'invTaxRates',
        key: 'invTaxRates',
        width:70,
        render: (text, record, index) => (
            <p style={{width:"50px"}} className="table_overflow_twoLine">
                <span title={text?text*100 + '%':"-"}>{(text || text==0)?text*100 + '%':"-"}</span>
            </p>
        ),
    },{
        title: '税额(元)',
        dataIndex: 'invTax',
        key: 'invTax',
        className:'text_align_right',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },{
        title: '商品金额',
        dataIndex: 'invProductprice',
        key: 'invProductprice',
        className:'text_align_right',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, {
        title: '税价合计(元)',
        dataIndex: 'invTotalPrice',
        key: 'invTotalPrice',
        className:'text_align_right',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },{
        title: '操作',
        dataIndex: '',
        key: '',
        width: 100,
        render: (text, record, index) => (
            <p>
                <span><a onClick={() => {this.passChange('invoice',record)}}>查看详情</a></span>
            </p>
        ),
    }];

    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
          }
        return (
            <div className="purchaserSettlementDetailListInvoices">
                <Table
                    rowSelection={null}
                    // onChange = {this.onChange}
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
                // onChange={this.pageChange}
                onShowSizeChange={this.onShowSizeChange}
              />
             
            </div>
            <CheckSettleModal
                show={this.state.passVisible}
                close={this.closeModal}
                invoiceData={this.state.invoiceData}
               > 
            </CheckSettleModal>
            </div>
        )
    }
}

export default Form.create()(ListInvoices)