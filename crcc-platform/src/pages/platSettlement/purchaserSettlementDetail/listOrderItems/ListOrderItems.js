import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';

class ListOrderItems extends React.Component {

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
        api.ajax("GET", "!!/financial/platSupplierSettlementController/listOrderItems", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
    }

    columns = [{
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width:150,
        render: (text, record, index) => (
            <p style={{width:"130px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '规格',
        dataIndex: 'specifications',
        key: 'specifications',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '采购量',
        dataIndex: 'originalCount',
        key: 'originalCount',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '实际数量',
        dataIndex: 'count',
        key: 'count',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '单位',
        dataIndex: 'productUnit',
        key: 'productUnit',
        width:70,
        render: (text, record, index) => (
            <p style={{width:"50px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '单价(元)',
        dataIndex: 'originalSalePrice',
        key: 'originalSalePrice',
        className:'text_align_right',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, {
        title: '成交价(元)',
        dataIndex: 'salePrice',
        key: 'salePrice',
        className:'text_align_right',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, {
        title: '总价(元)',
        dataIndex: 'finalPrice',
        key: 'finalPrice',
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
            <div className="purchaserSettlementDetailListOrderItems">
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

export default Form.create()(ListOrderItems)