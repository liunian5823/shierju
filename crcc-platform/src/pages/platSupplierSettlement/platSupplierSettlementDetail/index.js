import { Tabs, Row, Col, Button, Table, Card,Form,Icon } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';
import {NumberFormat} from '@/components/content/Format'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class PlatSettlementDetail extends React.Component{
    state = {
        dataSource:{
            orderList:[]//订单
        }
    }

    _isMounted = false;

    _uuids = "";
    _companyId = "";

    componentWillMount(){
        this._isMounted = true;
        const id = this.props.match.params.id;
        this.getSettlementDetails(id);
    }

    //查询结算单详情
    getSettlementDetails=(id)=>{
        let _this = this;
        api.ajax('GET','!!/financial/platSupplierSettlementController/querySupplierEcSettlementById',{
            id:id
        }).then(r => {
            if(!_this._isMounted){
                return;
            }
            _this.setState({
                dataSource: r.data
            },()=>{

            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //订单清单列表
    orderRecordColumns = () => {
        return [
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width:"150",
                render: (text, record) =>{
                    return <span title={text}>{text}</span>
                }
            },
            {
                title: '商品数量',
                dataIndex: 'productCount',
                key: 'productCount',
                width:"150",
                render: (text, record) =>{
                    return <span title={text}>{text}</span>
                }
            },
            {
                title: '商品总额(元)',
                dataIndex: 'productPrice',
                key: 'productPrice',
                width:"150",
                render: (text, record) =>{
                    if (text == undefined || text == null || text == "") {
                        return <span title={text}>{text}</span>
                    } else {
                        return <span title={text}><NumberFormat value={text}/></span>
                    }
                }
            },
            {
                title: '运费(元)',
                dataIndex: 'freight',
                key: 'freight',
                width:"150",
                render: (text, record) =>{
                    if (text == undefined || text == null || text == "") {
                        return <span title={text}>{text}</span>
                    } else {
                        return <span title={text}><NumberFormat value={text}/></span>
                    }
                }
            },
            {
                title: '金额(元)',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                width:"150",
                render: (text, record) =>{
                    if (text == undefined || text == null || text == "") {
                        return <span title={text}>{text}</span>
                    } else {
                        return <span title={text}><NumberFormat value={text}/></span>
                    }
                }
            }
        ]
    }

    handleCancel = () => {
        this.props.history.push('/platSupplierSettlement/settlementList');
    }

    //点击结算单日志
    commentsBtn=(index)=>{
        let showFlag = (this.state.dataSource.orderList[index].showFlag == undefined || this.state.dataSource.orderList[index].showFlag == false)?true:false;
        let obj = this.state.dataSource.orderList[index];
        obj.showFlag = showFlag;
        this.setState({
            dataSource:{
                orderList:this.state.dataSource.orderList
            }
        },()=>{
            console.log(this.state.dataSource.orderList);
            console.log(this.state.dataSource.orderList[index]);
        });
    }

    render(){
        //结算单日志
        let comments = "";
        if (this.state.dataSource.orderList.length>0) {
            comments = this.state.dataSource.orderList.map((item, index)=>{
                return (
                    <div style={{marginBottom:"10px"}} key={index}>
                        <div>
                            <Icon type={item.showFlag?"circle-o-up":"circle-o-down"} onClick={this.commentsBtn.bind(this,index)} />
                            <span style={{marginLeft:"10px"}}>{item.orderNo}</span>
                        </div>
                        <div>
                            <span style={{display:item.showFlag?"block":"none",marginLeft:"40px"}} title={item.comments}>{item.comments}</span>
                        </div>
                    </div>
                );
            });
        } else {
            comments = (
                <div></div>
            );
        }

        return (
            <div>
                <Card bordered={false} className="mb10" title="" >
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="制单日期">
                                {this.state.dataSource.orderList.length == 0?"":this.state.dataSource.orderList[0].createTimeYMD}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="结算时间">
                                {this.state.dataSource.createTimeYMDStr}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="创建人">
                                {this.state.dataSource.createUserName}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="付款人">
                                {this.state.dataSource.createUserName}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="订单数量">
                                {this.state.dataSource.orderCount}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="结算单金额">
                                {(this.state.dataSource.amount == undefined || this.state.dataSource.amount == null)?"":<NumberFormat value={this.state.dataSource.amount}/>}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="采购商">
                                {this.state.dataSource.buyerName}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="结算状态">
                                {this.state.dataSource.statusStr}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="采购人">
                                {this.state.dataSource.buyerName}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="联系电话">
                                {this.state.dataSource.buyerContactPhone}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10" title="备注" >
                    <Row>
                        <Col span={24}>
                            <BaseDetails title="">

                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10" title="订单清单" >
                    <Row>
                        <Col span={24}>
                            <Table
                                {...ComponentDefine.table_}
                                columns={this.orderRecordColumns()}
                                loading={this.loading}
                                pagination={false}
                                rowSelection={null}
                                dataSource={this.state.dataSource.orderList}></Table>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10" title="结算单日志" >
                    <Row>
                        <Col span={24}>
                            <BaseDetails title="">
                                {comments}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <BaseAffix>
                    <Button style={{marginRight: "10px"}} onClick={this.handleCancel}>关闭</Button>
                </BaseAffix>
            </div>
        );
    }
}

export default PlatSettlementDetail;