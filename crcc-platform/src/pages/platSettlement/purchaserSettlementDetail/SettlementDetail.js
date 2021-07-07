import { Select,Card,Form,Row,Col,Input,Button, Icon, Table, Divider, Menu, Dropdown, Modal, message, DatePicker, Tabs,Checkbox, Pagination,Popconfirm} from 'antd';
import {tablePagination_, btnName_} from "@/utils/config/componentDefine"
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import BaseAffix from '@/components/baseAffix';
import moment from 'moment';
import api from '@/framework/axios';
import {NumberFormat} from "@/components/gaoda/Format";
import BaseDetails from '@/components/baseDetails';
import ListOrders from './listOrders/ListOrders';
import ListOrderItems from './listOrderItems/ListOrderItems';
import ListInvocies from './listInvoices/ListInvoices';
import ListSettlementLogs from './listSettlementLogs/ListSettlementLogs';
import titleImg from '../../../static/iconfont/settlementDetail.png';
import {exportFile} from '@/utils/urlUtils';
import "./settlementDetail.css";

const TabPane = Tabs.TabPane;
class SettlementDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:{

            }
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
        let exportUrl = "/financial/platSupplierSettlementController/purchaserDownload";
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
        params.type = "0"   //采购商;
        //window.location.href = systemConfigPath.axiosUrl(getUrlByParam(exportUrl, params));
        window.open(systemConfigPath.axiosUrl(getUrlByParam(exportUrl, params)));
    }

    render() {
        return (
            <div id="purchaserSettlementDetail" className="purchaserSettlementDetail">
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
                        <Col span={6}>
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
                        <Col span={6}>
                            <Row>
                                <span style={{fontSize:"14px!important"}}>结算金额</span>
                            </Row>
                            <Row>
                                <span style={{color:"rgba(0, 0, 0, 0.85)",
                                    fontSize:"20px!important",
                                    lineHeight:"28px"
                                }}>
                                    {this.state.dataSource.amount?<span>¥ <NumberFormat value={this.state.dataSource.amount}/></span>:<span>-</span>}
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
                                {this.state.dataSource.payTime?moment(this.state.dataSource.payTime).format("YYYY-MM-DD"):"-"}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10">
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
                    {/*<Button type="ghost" style={{marginRight:"10px"}} onClick={()=>{$("#purchaserSettlementDetail").print()}}>打印</Button>*/}
                    <Button type="ghost" style={{marginRight:"10px"}} onClick={this.viewPrint}>打印</Button>
                    <Button type="ghost" style={{marginRight:"10px"}} onClick={this.download}>下载pdf</Button>
                    <Button type="primary" onClick={()=>{this.props.history.push("/financialCenter/platSettlementList")}}>返回</Button>
                </BaseAffix>
            </div>
        );
    }
}
export default Form.create()(SettlementDetail)