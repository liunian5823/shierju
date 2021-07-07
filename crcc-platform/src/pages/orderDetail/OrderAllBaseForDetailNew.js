import {Timeline,Select,Card, Form,Row, Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,Modal,DatePicker,Tabs } from 'antd';
import OrderDetailIcon from "@/static/iconfont/order_detail_icon.png";
import BaseDetails from '@/components/baseDetails';
import moment from 'moment';
import OrderBaseForDetailNew from './orderBaseForDetailNew';
import less from './orderDetail.less'
import {NumberFormat} from '@/components/content/Format'
import BaseAffix from "@/components/baseAffix";

class OrderAllBaseForDetail extends React.Component {
    state = {
        dataSource:{}
    }
    _isMounted = false;

    /**
     * 参数变化时触发
     * @param props
     */
    componentWillReceiveProps(props){
        this.refresh(props);
    }

    /**
     * 刷新订单详情全部基础数据
     */
    refresh = (props)=>{
        if(props.data){
            this.setState({
                dataSource:props.data
            })
        }else if(props.uuids){
            const params = {};
            params.uuids = props.uuids;
            axios.get("!!/order/order/getOrderById",{
                params:params
            }).then(r=>{
                this.setState({
                    uuids:props.uuids,
                    dataSource:r
                })
            })
        }
    }

    //联系供应商
    contactSeller = (key)=> {
        console.log('联系供应商');
        alert("未研发");
    }

    render() {
        return (
            <div className="order-allBaseDetail">
                <OrderBaseForDetailNew enableChildrenList={this.props.enableChildrenList} data={this.state.dataSource} refresh={this.props.refresh}/>
                <Form horizontal>
                    <Card bordered={false} className="mb10" title="开票信息">
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="发票类型">
                                    {this.state.dataSource.invoiceTypeStr}
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="收票人姓名">
                                    {this.state.dataSource.receiverInvoiceName}
                                </BaseDetails>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="发票名头">
                                    {this.state.dataSource.invoiceHeader}
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="收票人电话">
                                    {this.state.dataSource.receiverInvoicePhone}
                                </BaseDetails>
                            </Col>
                           
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="开票电话">
                                    {this.state.dataSource.registrationPhone}
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="收票地址">
                                    {this.state.dataSource.receiverInvoiceAdds}
                                </BaseDetails>
                            </Col>
                            
                        </Row>
                        <Row className="margin_bottom24">
                            <Col span={24} className="ant-form-item-margin-bottom">
                                <BaseDetails title="公司地址">
                                    {this.state.dataSource.registrationAdds}
                                </BaseDetails>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <Row>   
                                <BaseDetails title="纳税人识别号">
                                    {this.state.dataSource.registrationNumber}
                                </BaseDetails>
                                </Row>
                                <Row>
                                <BaseDetails title="基本账户">
                                    {this.state.dataSource.registrationBank}
                                </BaseDetails>
                                </Row>
                                <Row>
                                <BaseDetails title="开户行名称">
                                    {this.state.dataSource.registrationBankName}
                                </BaseDetails>                         
                                </Row>
                                
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                            <Row>
                                <BaseDetails title="备注信息">
                                    {this.state.dataSource.registrationRemark}
                                </BaseDetails>                         
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <Card bordered={false} className="mb10" title="收货地址">
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="收货人">
                                    {this.state.dataSource.receiveName}&nbsp;&nbsp;{this.state.dataSource.receivePhone}
                                </BaseDetails>
                            </Col>
                            {/* <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="联系电话">
                                    {this.state.dataSource.receivePhone}
                                </BaseDetails>
                            </Col> */}
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span={24} className="ant-form-item-margin-bottom">
                                <BaseDetails title="收货地址">
                                    {this.state.dataSource.receiveAddress}
                                </BaseDetails>
                            </Col>
                        </Row>
                    </Card>
                    <Card bordered={false} className="mb10" title="留言备注">
                        <Row {...ComponentDefine.row_}>
                            <Col span={24}>
                                <div dangerouslySetInnerHTML={{__html: this.state.dataSource.comments}}></div>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>
        )
    }
}

export default OrderAllBaseForDetail