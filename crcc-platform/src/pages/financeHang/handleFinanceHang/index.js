import { Card, Row, Col, Button, Table, Switch, message, Tabs, Popconfirm, Form, Input, Modal, Upload, Icon } from 'antd';
import api from '@/framework/axios';
import {getDetailsLabel, detailsLayout} from  '@/components/gaoda/Details';
import {NumberFormat} from "@/components/gaoda/Format";
import {exportFile} from '@/utils/urlUtils';
import {getUrlByParam, getQueryString} from '@/utils/urlUtils';
import BaseDetails from '@/components/baseDetails';
import BaseAffix from '@/components/baseAffix';
import Refund from '../refund';
import MatchingOrder from '../matchingOrder';
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import less from './index.less';
import './index.css';

class handleFinanceHang extends React.Component{
    state = {
        financeHang:{},
        listFinanceHangOrders:{},
        selectedRow:{},
        refundModalVisible:false,
        matchingOrderModalVisible:false,
        loading: false,
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        // 挂账基本信息
        api.ajax("GET", "!!/financial/financeHang/getFinanceHang", {
            uuids:getQueryString("uuids")
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                financeHang: r.data
            })
        })
        // 疑似订单列表
        this.search(1,10);
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    columns = () => {
        return [
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 188,
                render: (text, record, index) => (
                    <p style={{width:"172px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '采购单位',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 300,
                render: (text, record, index) => (
                    <p style={{width:"284px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '项目部',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 300,
                render: (text, record, index) => (
                    <p style={{width:"284px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '供应商',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 300,
                render: (text, record, index) => (
                    <p style={{width:"284px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                width: 128,
                render: (text, record, index) => (
                    <p style={{width:"112px"}} className={less.tableColumnWidth}>
                        <span title={text?moment(text).format("YYYY-MM-DD"):""}>{text?moment(text).format("YYYY-MM-DD"):""}</span>
                    </p>
                ),
            },
            {
                title: '状态(附言码)',
                dataIndex: 'tradeNo',
                key: 'tradeNo',
                width: 100,
                render: (text, record, index) => (
                    <p style={{width:"84px"}} className={less.tableColumnWidth}>
                        <span title={text}>{text}</span>
                    </p>
                ),
            },
            {
                title: '订单金额(元)',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                sorter: true,
                width: 150,
                render: (text, record, index) => (
                    <p style={{width:"134px"}} className={less.tableColumnWidth}>
                        <span title={text}><NumberFormat value={text}/></span>
                    </p>
                ),
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key: 'handle',
                width:60,
                fixed: 'right',
                render: (text, record, index) => {
                    let param = {}
                    param.uuids = record.uuids
                    param.goBackUrl = "";
                    let href = systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetail', param));
                    return(
                        <p style={{width:"50px"}}>
                            <a target="_blank" href={href}>查看</a>
                        </p>
                    )
                }
            }
        ]
    }

    search = (current, pageSize)=>{
        const param = {}
        param.uuids = getQueryString("uuids")
        param.keyword = this.props.form.getFieldValue("keyword")
        param.page = current
        param.rows= pageSize
        api.ajax("GET", "!!/financial/financeHang/listFinanceHangOrdersForPage", param).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                listFinanceHangOrders: r.data,
                selectedRow:{}
            })
        })
    }

    reset = ()=>{
        this.props.form.resetFields();
        this.search(1, this.state.listFinanceHangOrders.pageSize);
    }

    goBack = ()=>{
        this.props.history.push("/financialCenter/financeHang");
    }

    refund = ()=>{
        if(JSON.stringify(this.state.selectedRow) == "{}"){
            message.error("请选择订单");
            return;
        }
        this.setState({
            refundModalVisible:true
        })
    }

    matchingOrder = ()=>{
        if(JSON.stringify(this.state.selectedRow) == "{}"){
            message.error("请选择订单");
            return;
        }
        this.setState({
            matchingOrderModalVisible:true
        })
    }

    onModalCancel = ()=>{
        this.setState({
            refundModalVisible:false,
            matchingOrderModalVisible:false
        })
    }

    onSelect = (record, selected, selectedRows)=>{
        if(selected){
            this.setState({
                selectedRow:record,
            })
        }
    }

    //来款时间
    acctDate = ()=>{
        let result = undefined;
        let acctDate = this.state.financeHang.acctDate;
        if(acctDate&&8 == acctDate.length){
            result = acctDate.substring(0,4)+"-"+acctDate.substring(4,6)+"-"+acctDate.substring(6,acctDate.length);
        }else{
            result = acctDate;
        }
        return result;
    }

    render() {
        const that = this
        const { getFieldProps } = this.props.form;
        const rowSelection = {
            type:"radio",
            onSelect: this.onSelect
        };
        const pagination = {
            current:this.state.listFinanceHangOrders.pageNum,
            pageSize:this.state.listFinanceHangOrders.pageSize,
            total: this.state.listFinanceHangOrders.total,
            showTotal:total => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                that.search(current, pageSize);
            },
            onChange(current) {
                that.search(current, this.pageSize);
            },
        };

        return(
            <div className={less.handle}>
                <Card title="来款信息" bordered={false} className={less.incomingInformation+" mb10"}>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <span className={less.label} >来款账户名称</span>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <span className={less.label}>来款金额(元)</span>
                        </Col>
                        <Col span={12} className={less.leftCol} style={{paddingBottom:"16px"}}>
                            <span className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30"}}>{this.state.financeHang.inAcctIdName}</span>
                        </Col>
                        <Col span={12} className={less.rightCol} style={{paddingBottom:"16px"}}>
                            <span className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30"}}>{this.state.financeHang.inAmount?<NumberFormat value={this.state.financeHang.inAmount}/>:"-"}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="来款账号">
                                {this.state.financeHang.inAcctId}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="来款时间">
                                {this.acctDate()}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="流水号">
                                {this.state.financeHang.frontLogNo}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="来款附言">
                                {this.state.financeHang.note}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={less.leftCol}>
                            <BaseDetails title="来款银行">
                                {this.state.financeHang.bankName}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card title="疑似订单" bordered={false} className={less.suspectedOrders+" mb10"}
                    extra={
                        <div className={less.extra}>
                            <div className={less.erer}>
                            <Input style={{width:"350px"}}type="text" {...getFieldProps('keyword')} placeholder="可输入订单号/采购商名称/附言码进行筛选"/>
                            </div>
                            <Button type="primary" onClick={this.search.bind(this,1,this.state.listFinanceHangOrders.pageSize)} style={{margin:"0 8px"}}>查询</Button>
                            <Button type="ghost" onClick={this.reset}>重置</Button>
                        </div>
                    }
                >
                    <Table pagination={pagination} dataSource={this.state.listFinanceHangOrders.list} columns={this.columns()} rowSelection={rowSelection} scroll={{ x: 1635 }}/>
                </Card>
                <BaseAffix>
                    <Popconfirm placement="top" title={"确认匹配订单吗?"} onConfirm={this.matchingOrder}>
                        <Button type="primary" loading={this.state.loading} style={{marginRight: "10px"}}>匹配订单</Button>
                    </Popconfirm>
                    <Popconfirm placement="top" title={"确认退款吗?"} onConfirm={this.refund}>
                        <Button type="ghost" loading={this.state.loading} style={{marginRight: "10px"}}>退款</Button>
                    </Popconfirm>
                    <Button type="ghost" loading={this.state.loading} onClick={this.goBack}>返回</Button>
                </BaseAffix>
                <Refund
                    financeHang = {this.state.financeHang}
                    selectedRow = {this.state.selectedRow}
                    visible = {this.state.refundModalVisible}
                    onCancel = {this.onModalCancel}
                    history = {this.props.history}
                />
                <MatchingOrder
                    financeHang = {this.state.financeHang}
                    selectedRow = {this.state.selectedRow}
                    visible = {this.state.matchingOrderModalVisible}
                    onCancel = {this.onModalCancel}
                    history = {this.props.history}
                />
            </div>
        )
    }
}

export default Form.create()(handleFinanceHang);