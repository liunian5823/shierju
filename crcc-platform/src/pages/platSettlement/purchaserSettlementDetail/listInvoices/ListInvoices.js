import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import {NumberFormat} from '@/components/gaoda/Format';
import api from '@/framework/axios';

class ListInvoices extends React.Component {

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
        api.ajax("GET", "!!/financial/platSupplierSettlementController/listInvoices", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r
            })
        });
    }

    columns = [{
        title: '发票抬头',
        dataIndex: 'title',
        key: 'title',
        width:240,
        render: (text, record, index) => (
            <p style={{width:"220px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '发票类型',
        dataIndex: 'invType',
        key: 'invType',
        width:120,
        render: (text, record, index) => {
            let invType = "-"
            if(1==text){
                invType = "增值税专用发票";
            }
            if(2==text){
                invType = "增值税普通发票";
            }
            return(
                <p style={{width:"100px"}} className="table_overflow_twoLine">
                    <span title={invType}>{invType}</span>
                </p>
            )
        }
    }, {
        title: '发票号',
        dataIndex: 'invNo',
        key: 'invNo',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '发票代码',
        dataIndex: 'invCode',
        key: 'invCode',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '税额(元)',
        dataIndex: 'tax',
        key: 'tax',
        className:'text_align_right',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, {
        title: '税率',
        dataIndex: 'taxRates',
        key: 'taxRates',
        width:70,
        render: (text, record, index) => (
            <p style={{width:"50px"}} className="table_overflow_twoLine">
                <span title={text?text*100 + '%':"-"}>{text?text*100 + '%':"-"}</span>
            </p>
        ),
    }, {
        title: '税价合计(元)',
        dataIndex: 'totalTax',
        key: 'totalTax',
        className:'text_align_right',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }];

    render() {
        return (
            <div className="purchaserSettlementDetailListInvoices">
                <Table
                    rowSelection={null}
                    onChange = {this.onChange}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource}
                    pagination = {false}
                    scroll = {{x:true}}
                />
            </div>
        )
    }
}

export default Form.create()(ListInvoices)