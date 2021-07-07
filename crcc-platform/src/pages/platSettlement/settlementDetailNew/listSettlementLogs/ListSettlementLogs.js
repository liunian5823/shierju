import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio,Pagination } from 'antd';

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

            ],
            total:0,
            pageSize: 10,
            page:1,
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
        // params.settlementId = this.props.settlementId
        api.ajax("GET", "@/platform/settlementDetail/getSettlementLog", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data.rows,
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

    columns = [{
        title: '操作人',
        dataIndex: 'userName',
        key: 'userName',
        width:120,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="table_overflow_twoLine">
                <span>{record.userNo?record.userNo:'-'}</span>&nbsp;&nbsp;
                <span title={text}>{text?text:'-'}</span>
            </p>
        )
    }, {
        title: '事件',
        dataIndex: 'remarks',
        key: 'remarks',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"200px"}}>
                <span title={text}>{text?text:'-'}</span>
            </p>
        )
    }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:100,
        render: (text, record, index) => (
            <div className="columnWidth">
                {/* <span title={text}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
                <p title={text}>{text?moment(text).format("hh:mm:ss"):"-"}</p> */}
                <span title={text}>{text ? text : '-'}</span>
            </div>
        )
    }];

    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
          }
        return (
            <div className="purchaserSettlementDetailListSettlementLogs">
                <Table
                    rowSelection={null}
                    onChange = {this.onChange}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource}
                    pagination = {false}
                    scroll = {{x:true}}
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

export default Form.create()(ListSettlementLogs)