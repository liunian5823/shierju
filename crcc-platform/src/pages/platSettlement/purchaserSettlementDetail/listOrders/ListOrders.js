import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';
import moment from 'moment';

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
        params.uuids = this.props.uuids;
        api.ajax("GET", "!!/financial/platSupplierSettlementController/listOrders", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
    }

    columns = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '项目名称',
        dataIndex: 'organizationName',
        key: 'organizationName',
        width:150,
        render: (text, record, index) => (
            <p style={{width:"134px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '供应商',
        dataIndex: 'sellerCompanyName',
        key: 'sellerCompanyName',
        width:150,
        render: (text, record, index) => (
            <p style={{width:"134px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '下单日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width:88,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    }, {
        title: '收货日期',
        dataIndex: 'receivedTime',
        key: 'receivedTime',
        width:88,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    }, {
        title: '订单金额(元)',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        className:'text_align_right',
        width:116,
        render: (text, record, index) => (
            <p style={{width:"98px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, {
        title: '结算金额(元)',
        dataIndex: 'totalPrice',
        key: 'settlementAmount',
        className:'text_align_right',
        width:116,
        render: (text, record, index) => (
            <p style={{width:"98px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width:44,
        render: (text, record, index) => {
            let param = {}
            param.uuids = record.uuids
            param.goBackUrl = "";
            let href = systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetail', param));
            return(
                <p style={{width:"28px"}}>
                    <a target="_blank" href={href}>查看</a>
                </p>
            )
        }
    }];

    render() {
        return (
            <div className="purchaserSettlementDetailListOrders">
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

export default Form.create()(ListOrders)