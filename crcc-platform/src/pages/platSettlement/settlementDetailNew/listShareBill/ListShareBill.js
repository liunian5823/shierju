import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';
import moment from 'moment';
import BaseTable from '@/components/baseTable'

class ListOrders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[

            ]
        }
    }

    componentWillMount(){
        this.handleSearch();
    }

    componentWillReceiveProps(props){

    }

    handleSearch = ()=>{
        let params = {}
        params.settlementId = this.props.settlementId;
        params.page = 1;
        params.rows = 10;
        api.ajax("GET", "@/platform/settlementDetail/getShareBill", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
    }

    columns = [{
        title: '流水号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    },{
        title: '共享单号',
        dataIndex: 'shareNo',
        key: 'shareNo',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    },{
        title: '单据类型',
        dataIndex: 'billType',
        key: 'billType',
        width:120,
        render: (text, record, index) => {
            let billType = "-"
            if(1==text){
                billType = "合同付款";
            }
            if(2==text){
                billType = "红冲单";
            }
            return(
                <p style={{width:"100px"}} className="table_overflow_twoLine">
                    <span title={billType}>{billType}</span>
                </p>
            )
        }
    },
    {
        title: '付款方式',
        dataIndex: 'mode',
        key: 'mode',
        width:120,
        render: (text, record, index) => {
            let mode = "-"
            if(1==text){
                mode = "现付";
            }
            if(2==text){
                mode = "银信";
            }
            if(3==text){
                mode = "冲销";
            }
            return(
                <p style={{width:"100px"}} className="table_overflow_twoLine">
                    <span title={mode}>{mode}</span>
                </p>
            )
        }
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width:120,
        render: (text, record, index) => {
            let type = "-"
            if(1==text){
                type = "现金支付类";
            }
            if(2==text){
                type = "票据支付类";
            }
            if(3==text){
                type = "非付款类";
            }
            return(
                <p style={{width:"100px"}} className="table_overflow_twoLine">
                    <span title={type}>{type}</span>
                </p>
            )
        }
    },
    {
        title: '金额',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
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
        className:'text_align_right',
        width:116,
        render: (text, record, index) => (
            <p style={{width:"98px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, 
    ];

    render() {
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
            </div>
        )
    }
}

export default Form.create()(ListOrders)