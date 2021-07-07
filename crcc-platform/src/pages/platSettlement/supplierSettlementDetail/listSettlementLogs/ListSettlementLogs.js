import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';
import moment from 'moment';

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
        params.uuids = this.props.uuids;
        api.ajax("GET", "!!/financial/platSupplierSettlementController/listSettlementLogs", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
    }

    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width:50,
        render: (text, record, index) => {
            let result = index+1;
            return(
                <p style={{width:"30px"}} className="table_overflow_twoLine">
                    <span title={result}>{result}</span>
                </p>
            )
        }
    }, {
        title: '事件',
        dataIndex: 'remake',
        key: 'remake',
        width:500,
        render: (text, record, index) => (
            <p style={{width:"480px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '操作人',
        dataIndex: 'username',
        key: 'username',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="columnWidth">
                <span title={text}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    }];

    render() {
        return (
            <div className="supplierSettlementDetailListSettlementLogs">
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

export default Form.create()(ListSettlementLogs)