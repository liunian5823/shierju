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
                title: '?????????',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 250
            },
            {
                title: '????????????',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 250
            },
            {
                title: '?????????',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 250
            },
            {
                title: '?????????',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 250
            },
            {
                title: '????????????',
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
                title: '??????(?????????)',
                dataIndex: 'tradeNo',
                key: 'tradeNo',
                width: 200
            },
            {
                title: '????????????(???)',
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
                title: '??????',
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
                            <a target="_blank" href={href}>??????</a>
                        </p>
                    )
                }
            }
        ]
    }

    goBack = ()=>{
        this.props.history.push("/financialCenter/financeHang");
    }

    //????????????
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
                <Card title="????????????" bordered={false} className={less.incomingInformation+" mb10"}>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <span className={less.label}>??????????????????</span>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <span className={less.label}>????????????(???)</span>
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
                            <BaseDetails title="????????????">
                                {this.state.financeHang.inAcctId}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="????????????">
                                {this.acctDate()}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="?????????">
                                {this.state.financeHang.frontLogNo}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="????????????">
                                {this.state.financeHang.note}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={less.leftCol}>
                            <BaseDetails title="????????????">
                                {this.state.financeHang.bankName}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card title="????????????" bordered={false} className="mb10">
                    <Table pagination={false} dataSource={this.state.listFinanceHangHandleOrders} columns={this.columns()} scroll={{ x: 500 }}/>
                </Card>
                <Card title="????????????" bordered={false} className="mb10">
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="?????????">
                                {this.state.financeHangHandle.createUserName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="????????????">
                                {this.state.financeHangHandle.typeStr}
                            </BaseDetails>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="????????????">
                                {this.state.financeHangHandle.phone}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="????????????">
                                {this.state.financeHangHandle.createTime?moment(this.state.financeHangHandle.createTime).format("YYYY-MM-DD"):"-"}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="????????????">
                                {this.state.financeHangHandle.remark}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="????????????">
                                <a target="_blank" href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.financeHangHandle.filePath)}>{this.state.financeHangHandle.fileName}</a>
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <BaseAffix>
                    <Button type="primary" onClick={this.goBack}>??????</Button>
                </BaseAffix>
            </div>
        )
    }
}

export default detailFinanceHang;