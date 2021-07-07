import { Select,Card,Form,Row,Col,Input,Button, Icon, Table, Divider, Menu, Dropdown, Modal, message, DatePicker, Tabs,Checkbox, Pagination,Popconfirm} from 'antd';

import {tablePagination_, btnName_} from "@/utils/config/componentDefine"
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {getDetailsLabel} from  '@/components/gaoda/Details';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {NumberFormat} from '@/components/gaoda/Format'
import api from '@/framework/axios';
import BaseDetails from '@/components/baseDetails';
import BaseAffix from '@/components/baseAffix';
import {exportFile} from '@/utils/urlUtils';
import ListOrders from './listOrders/ListOrders';
import ListOrderItems from './listOrderItems/ListOrderItems';
import ListInvocies from './listInvoices/ListInvoices';
import ListSettlementLogs from './listSettlementLogs/ListSettlementLogs';
import titleImg from '../../../static/iconfont/settlementDetail.png';
import "./settlementDetail.css"

const TabPane = Tabs.TabPane;
class SettlementDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[

            ]
        }
    }

    componentWillMount() {
        this.handleSearch();
    };

    //加载数据
    handleSearch = ()=>{
        let params = {};
        params.uuids = this.props.match.params.uuids;
        api.ajax("GET", "!!/financial/platSupplierSettlementController/getSettlement", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
    }

    download = ()=>{
        let exportUrl = "/financial/platSupplierSettlementController/supplierDownload";
        let params = {}
        params.uuids = this.props.match.params.uuids;
        params.filename = this.state.dataSource.settlementNo;
        exportFile(exportUrl,params);
    }

    //打印
    viewPrint=()=>{
        let exportUrl = "/financial/platSupplierSettlementController/viewPrint.pdf";
        let params = {}
        params.uuids = this.props.match.params.uuids;
        params.type = "1"   //供应商;
        //window.location.href = systemConfigPath.axiosUrl(getUrlByParam(exportUrl, params));
        window.open(systemConfigPath.axiosUrl(getUrlByParam(exportUrl, params)));
    }

    render() {
        return (
            <div id="supplierSettlementDetail" className="supplierSettlementDetail">
                <Card bordered={false} className="mb10">
                    <Row {...ComponentDefine.row_} style={{paddingBottom:"18px"}}>
                        <img src={titleImg} style={{display:"inline-block", verticalAlign: "middle", paddingRight:"8px"}}/>
                        <div style={{display:"inline-block", verticalAlign: "middle",paddingLeft:"0px"}}>
                            <span style={{
                                color:"rgba(0, 0, 0, 0.85)",
                                fontSize:"20px!important",
                                lineHeight:"28px"
                            }}>
                                结算单号:
                            </span>
                            <span style={{
                                paddingLeft: "0px",
                                color:"rgba(0, 0, 0, 0.85)",
                                fontSize:"20px!important",
                                lineHeight:"28px"
                            }}>
                                {this.state.dataSource.settlementNo}
                            </span>
                        </div>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Row>
                                <BaseDetails title="供应商名称">
                                    {this.state.dataSource.supplierCompanyName}
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="创建人">
                                    {this.state.dataSource.createUserName}
                                </BaseDetails>
                            </Row>
                        </Col>
                        <Col span={1}/>
                        <Col span={4}>
                            <Row>
                                <span style={{fontSize:"14px!important"}}>结算状态</span>
                            </Row>
                            <Row>
                                <span style={{
                                    color:"rgba(0, 0, 0, 0.85)",
                                    fontSize:"20px!important",
                                    lineHeight:"28px"
                                }}>
                                    {this.state.dataSource.statusStr}
                                </span>
                            </Row>
                        </Col>
                        <Col span={4}>
                            <Row>
                                <span style={{paddingLeft: "21px"}}>提款状态</span>
                            </Row>
                            <Row>
                                <span style={{
                                    paddingLeft: "21px",
                                    color:"rgba(0, 0, 0, 0.85)",
                                    fontSize:"20px!important",
                                    lineHeight:"28px"
                                }}>
                                    {this.state.dataSource.withdrawStatusStr}
                                </span>
                            </Row>
                        </Col>
                        <Col span={4}>
                            <Row>
                                <span style={{fontSize:"14px!important"}}>结算金额</span>
                            </Row>
                            <Row>
                                <span style={{color:"rgba(0, 0, 0, 0.85)",
                                    fontSize:"20px!important",
                                    lineHeight:"28px"
                                }}>
                                    {this.state.dataSource.amount?<span>¥ <NumberFormat value={this.state.dataSource.amount}/></span>:"-"}
                                </span>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="制单日期">
                                {this.state.dataSource.createTimeYMDStr}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="订单数量">
                                {this.state.dataSource.orderCount}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="结算日期">
                                {this.state.dataSource.payTimeYMDStr}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="结算项目信息">
                                {this.state.dataSource.settleTypeStr}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="提款日期">
                                {this.state.dataSource.withdrawDate?moment(this.state.dataSource.withdrawDate).format("YYYY-MM-DD"):"-"}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="提款人">
                                {this.state.dataSource.withdrawUserName}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10 overFlowVisible">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="订单信息" key="1">
                            <ListOrders uuids={this.props.match.params.uuids}/>
                        </TabPane>
                        <TabPane tab="商品信息" key="2">
                            <ListOrderItems uuids={this.props.match.params.uuids}/>
                        </TabPane>
                        <TabPane tab="发票信息" key="3">
                            <ListInvocies uuids={this.props.match.params.uuids}/>
                        </TabPane>
                        <TabPane tab="结算日志" key="4">
                            <ListSettlementLogs uuids={this.props.match.params.uuids}/>
                        </TabPane>
                    </Tabs>
                </Card>
                <BaseAffix>
                    {/*<Button type="ghost" style={{marginRight:"10px"}} onClick={()=>{$("#supplierSettlementDetail").print()}}>打印</Button>*/}
                    <Button type="ghost" style={{marginRight:"10px"}} onClick={this.viewPrint}>打印</Button>
                    <Button type="ghost" style={{marginRight:"10px"}} onClick={this.download}>下载pdf</Button>
                    <Button type="primary" onClick={()=>{this.props.history.push("/financialCenter/platSettlementList")}}>返回</Button>
                </BaseAffix>
            </div>
        );
    }
}
export default Form.create()(SettlementDetail)