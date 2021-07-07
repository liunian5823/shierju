import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import {NumberFormat} from '@/components/gaoda/Format';
import moment from 'moment';
import api from '@/framework/axios';

class ListSettlementLogs extends React.Component {

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
        api.ajax("GET", "!!/financial/platSupplierSettlementController/listSettlementLogs", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r
            })
        });
    }

    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width:80,
        render: (text, record, index) => {
            let pageNum = this.state.dataSource.pageNum;
            let pageSize = this.state.dataSource.pageSize;
            let result = (pageNum-1)*pageSize+index+1;
            return(
                <p style={{width:"64px"}} className="table_overflow_twoLine">
                    <span title={result}>{result}</span>
                </p>
            )
        }
    }, {
        title: '事件',
        dataIndex: 'remarks',
        key: 'remarks',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '操作人',
        dataIndex: 'createUserName',
        key: 'createUserName',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="columnWidth">
                <span title={text}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    }, {
        title: '提款人',
        dataIndex: 'c',
        key: 'c',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '提款时间',
        dataIndex: 'e',
        key: 'e',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="columnWidth">
                <span title={text}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    }];

    render() {
        return (
            <div className="purchaserSettlementDetailListSettlementLogs">
                <Table
                    rowSelection={null}
                    onChange = {this.onChange}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource.list}
                    pagination = {false}
                    scroll = {{x:true}}
                />
            </div>
        )
    }
}

export default Form.create()(ListSettlementLogs)