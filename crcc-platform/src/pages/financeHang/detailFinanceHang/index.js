import { Card, Row, Col, Button, Table, Switch, message, Tabs, Popconfirm } from 'antd';
import api from '@/framework/axios';
import {exportFile} from '@/utils/urlUtils';
import {getUrlByParam, getQueryString} from '@/utils/urlUtils';
import BaseDetails from '@/components/baseDetails';
import BaseAffix from '@/components/baseAffix';
import {NumberFormat} from "@/components/gaoda/Format";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import less from './index.less';
import './index.css';

class detailFinanceHang extends React.Component{
    state = {
        financeHang:{},
        listFinanceHangHandleOrders:[],
        financeHangHandle:{},
        loading: false,
        tableState: 0,
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
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
        api.ajax("GET", "!!/financial/financeHang/listFinanceHangHandleOrders", {
            uuids:getQueryString("uuids")
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                listFinanceHangHandleOrders: r.data
            })
        })
        api.ajax("GET", "!!/financial/financeHang/getFinanceHangHandle", {
            uuids:getQueryString("uuids")
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                financeHangHandle: r.data
            })
        })
    }
    componentWillUnmount(){
        this._isMounted = false;
    }

    baseParams = {

    }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }

    columns = () => {
        return [
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 250
            },
            {
                title: '采购单位',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 250
            },
            {
                title: '项目部',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 250
            },
            {
                title: '供应商',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 250
            },
            {
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 150,
                sorter: true,
                render: (text, record, index) => (
                    <p style={{width:"80px"}}  className={less.tableColumnWidth}>
                        <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
                    </p>
                ),
            },
            {
                title: '状态(附言码)',
                dataIndex: 'tradeNo',
                key: 'tradeNo',
                width: 200
            },
            {
                title: '订单金额(元)',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                width: 150,
                sorter: true,
                render: (text, record, index) => (
                    <p style={{width:"130px"}}  className={less.tableColumnWidth}>
                        <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
                    </p>
                ),
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key: 'handle',
                width:200,
                fixed: 'right',
                render: (text, record, index) => {
                    let param = {}
                    param.uuids = record.uuids
                    param.goBackUrl = "";
                    let href = systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetail', param));
                    return(
                        <p style={{width:"130px"}}>
                            <a target="_blank" href={href}>查看</a>
                        </p>
                    )
                }
            }
        ]
    }

    goBack = ()=>{
        this.props.history.push("/financialCenter/financeHang");
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
        return(
            <div className={less.detailFinanceHang}>
                <Card title="来款信息" bordered={false} className={less.incomingInformation+" mb10"}>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <span className={less.label}>来款账户名称</span>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <span className={less.label}>来款金额(元)</span>
                        </Col>
                        <Col span={12} className={less.leftCol}  style={{paddingBottom:"16px"}}>
                            <span className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"30"}}>{this.state.financeHang.inAcctIdName}</span>
                        </Col>
                        <Col span={12} className={less.rightCol}  style={{paddingBottom:"16px"}}>
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
                <Card title="订单信息" bordered={false} className="mb10">
                    <Table pagination={false} dataSource={this.state.listFinanceHangHandleOrders} columns={this.columns()} scroll={{ x: 500 }}/>
                </Card>
                <Card title="处理记录" bordered={false} className="mb10">
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="经办人">
                                {this.state.financeHangHandle.createUserName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="处理方式">
                                {this.state.financeHangHandle.typeStr}
                            </BaseDetails>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="联系电话">
                                {this.state.financeHangHandle.phone}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="处理时间">
                                {this.state.financeHangHandle.createTime?moment(this.state.financeHangHandle.createTime).format("YYYY-MM-DD"):"-"}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="备注信息">
                                {this.state.financeHangHandle.remark}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="处理附件">
                                <a target="_blank" href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.financeHangHandle.filePath)}>{this.state.financeHangHandle.fileName}</a>
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <BaseAffix>
                    <Button type="primary" onClick={this.goBack}>返回</Button>
                </BaseAffix>
            </div>
        )
    }
}

export default detailFinanceHang;