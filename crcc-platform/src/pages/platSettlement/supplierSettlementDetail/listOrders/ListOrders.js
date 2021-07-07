import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import {NumberFormat} from "@/components/gaoda/Format";
import moment from 'moment';
import api from '@/framework/axios';

class ListOrders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[

            ],
            ordersStatistics:{

            }
        }
    }

    componentWillMount(){
        this.handleSearch();
        this.getOrdersStatistics();
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

    getOrdersStatistics = ()=>{
        let params = {}
        params.uuids = this.props.uuids;
        api.ajax("GET", "!!/financial/platSupplierSettlementController/getOrdersStatistics", {
            ...params
        }).then(r => {
            this.setState({
                ordersStatistics: r.data
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
        title: '质保金比例',
        dataIndex: 'qualityRetentionRate',
        key: 'qualityRetentionRate',
        width:86,
        render: (text, record, index) => (
            <p style={{width:"70px"}}>
                <span title={text?text*100 + '%':"-"}>{text?text*100 + '%':"-"}</span>
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
        width:114,
        render: (text, record, index) => {
            //结算方式类型(0:旧系统结算1:货款,2:质保金)
            let settleType = record.settleType;
            let qualityRetentionRate = record.qualityRetentionRate;
            if(!settleType&&!qualityRetentionRate&&settleType!=0&&qualityRetentionRate!=0){
                return (
                    <p style={{width:"98px",float:"right"}}>
                        -
                    </p>
                );
            }
            let result = undefined;
            if(0 == settleType){
                result = text;
            }else if(1 == settleType){
                result = text*(1-qualityRetentionRate);
            }else if(2 == settleType){
                result = text*qualityRetentionRate;
            }
            return(
                <p style={{width:"98px",float:"right"}}>
                    <span  title={text}>{text?<NumberFormat value={result}/>:"-"}</span>
                </p>
            )
        }
    }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width:52,
        render: (text, record, index) => {
            let param = {}
            param.uuids = record.uuids
            param.goBackUrl = "";
            let href = systemConfigPath.jumpPage( getUrlByParam('/platInvoice/orderDetail', param));
            return(
                <p style={{width:"36px"}}>
                    <a target="_blank" href={href}>查看</a>
                </p>
            )
        }
    }];

    //展示统计信息
    showStatistics = ()=>{
        let result = null;
        if(0==this.state.ordersStatistics.settleType){
            result = (
                <div>
                    <Row style={{padding:"9px 0px 9px 0px"}}>
                        <div style={{float:"right"}}>
                            <span className="sumTotalPricesLabel">订单金额:</span>
                            <span className="sumTotalPrices">
                                {this.state.ordersStatistics.sumTotalPrices?<span>￥ <NumberFormat value={this.state.ordersStatistics.sumTotalPrices}/></span>:<spn>-</spn>}
                            </span>
                        </div>
                    </Row>
                    <Row style={{borderTop:"1px solid rgba(233, 233, 233, 1)", padding:"18px 24px 0px 24px",left: "-24px", boxSizing: "content-box",width: "100%"}}>
                        <div style={{float:"right"}}>
                            <span className="amountLabel">结算金额:</span>
                            <span className="amount">
                                {this.state.ordersStatistics.amount?<span>￥{<NumberFormat value={this.state.ordersStatistics.amount}/>}</span>:<span>-</span>}
                            </span>
                        </div>
                    </Row>
                </div>
            )
        }
        if(1==this.state.ordersStatistics.settleType){
            let otherAmountLabel = "质保金";
            result = (
                <div>
                    <Row style={{padding:"9px 0px 9px 0px"}}>
                        <div style={{float:"right"}}>
                            <span className="sumTotalPricesLabel">订单金额:</span>
                            <span className="sumTotalPrices">{this.state.ordersStatistics.sumTotalPrices?<span>￥{<NumberFormat value={this.state.ordersStatistics.sumTotalPrices}/>}</span>:"-"}</span>
                        </div>
                    </Row>
                    <Row style={{padding:"9px 0px 9px 0px"}}>
                        <div style={{float:"right"}}>
                            <span className="otherAmountLabel">{otherAmountLabel}:</span>
                            <span className="otherAmount">{this.state.ordersStatistics.otherAmount?<span>￥{<NumberFormat value={this.state.ordersStatistics.otherAmount}/>}</span>:"-"}</span>
                        </div>
                    </Row>
                    <Row style={{borderTop:"1px solid rgba(233, 233, 233, 1)", padding:"18px 24px 0px 24px",left: "-24px", boxSizing: "content-box",width: "100%"}}>
                        <div style={{
                            float:"right"
                        }}>
                            <span className="amountLabel">结算金额:</span>
                            <span className="amount">{this.state.ordersStatistics.amount?<span>￥{<NumberFormat value={this.state.ordersStatistics.amount}/>}</span>:"-"}</span>
                        </div>
                    </Row>
                </div>
            )
        }
        if(2==this.state.ordersStatistics.settleType){
            let otherAmountLabel = "已结算货款及物流费";
            result = (
                <div>
                    <Row style={{padding:"9px 0px 9px 0px"}}>
                        <div style={{float:"right"}}>
                            <span className="sumTotalPricesLabel">订单金额:</span>
                            <span className="sumTotalPrices">{this.state.ordersStatistics.sumTotalPrices?<span>￥{<NumberFormat value={this.state.ordersStatistics.sumTotalPrices}/>}</span>:"-"}</span>
                        </div>
                    </Row>
                    <Row style={{padding:"9px 0px 9px 0px"}}>
                        <div style={{float:"right"}}>
                            <span className="otherAmountLabel">{otherAmountLabel}:</span>
                            <span className="otherAmount">{this.state.ordersStatistics.otherAmount?<span>￥{<NumberFormat value={this.state.ordersStatistics.otherAmount}/>}</span>:"-"}</span>
                        </div>
                    </Row>
                    <Row style={{borderTop:"1px solid rgba(233, 233, 233, 1)", padding:"18px 24px 0px 24px",left: "-24px", boxSizing: "content-box",width: "100%"}}>
                        <div style={{float:"right"}}>
                            <span className="amountLabel">结算金额:</span>
                            <span className="amount">{this.state.ordersStatistics.amount?<span>￥{<NumberFormat value={this.state.ordersStatistics.amount}/>}</span>:"-"}</span>
                        </div>
                    </Row>
                </div>
            )
        }
        return result;
    }

    render() {
        return (
            <div className="supplierSettlementDetailListOrders">
                <Table
                    rowSelection={null}
                    onChange = {this.onChange}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource}
                    pagination = {false}
                    scroll = {{x:true}}
                />
                {this.showStatistics()}
            </div>
        )
    }
}

export default Form.create()(ListOrders)