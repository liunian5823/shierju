import {   Timeline,Select,Card, Form,Row, Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,Modal,DatePicker,Tabs } from 'antd';
import OrderDetailIcon from '@/static/iconfont/order_detail_icon.png';
import moment from 'moment';
import {NumberFormat} from '@/components/content/Format'
import BaseDetails from "@/components/baseDetails";
import { exportFile, getUrlByParam } from '@/utils/urlUtils';
import { systemConfigPath } from '@/utils/config/systemConfig';
import OrderDetail from "@/pages/orderDetail/orderDetail";
import less from './orderDetail.less'
// import systemConfigPath from '../../utils/config/systemConfig'


class OrderBaseForDetail extends React.Component {
    state = {
        id:this.props.id,
        dataSource:{}
    }

    /**
     * 参数变化时触发
     * @param props
     */
    componentWillReceiveProps(props){
        this.refresh(props);
    }

    showChildrenList = ()=>{
        if(this.state.dataSource.childrenList!=null){
            return(
                this.state.dataSource.childrenList.map(
                    (children,k)=>{
                        if(true){//this.props.enableChildrenList
                            return(
                                <span key={k} style={{marginRight:8}}>{children.orderNo}</span>
                            )
                        }else{
                            return(
                                <span style={{marginRight:8}}>{children.orderNo}</span>
                            )
                        }
                    }
                )
            )
        }
    }

    aaa=()=>{
        alert(3)
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
                    dataSource:r
                })
            })
        }
    }

    // imInit = ()=>{
    //     let that = this;
    //     this.a = new im(
    //         //当前登录人
    //         {
    //             "id":this.props.userInfo.companyId+"-"+this.state.dataSource.uuids,
    //             "name":this.props.userInfo.username,
    //             "companyId":this.props.userInfo.companyId,
    //             "companyName":this.props.userInfo.companyName
    //         },
    //         //采购商:联系供应商
    //         {
    //             "id":this.state.dataSource.sellerCompanyId+"-"+this.state.dataSource.uuids,
    //             "name":"供应商",
    //             "companyId":this.state.dataSource.sellerCompanyId,
    //             "companyName":this.state.dataSource.sellerCompanyName
    //         },
    //         {
    //             unreadMessages:function(s){
    //                 that.setState({
    //                     acount:s
    //                 })
    //             }
    //         }
    //     )
    //     this.a.connect();
    // }

    //询价单详情
    showInquiryDetail = ()=>{
        let params = {};
        //longFlag:跳转到询价详情，底部按钮判断使用
        params.longFlag = "1";
        params.uuids = this.state.dataSource.sourceInquiryUuids;
        params.id = this.state.dataSource.sourceInquiryId;
        window.open(systemConfigPath.jumpPage(getUrlByParam("/backlog/inquiryDetail",params)));
    }

    //协议采购详情
    showAgreementDetail = ()=>{
        let uuids = this.state.dataSource.sourceAgreementUuids;
        if(uuids){
            let params = {};
            //longFlag:跳转到询价详情，底部按钮判断使用
            params.longFlag = "1";
            params.uuids = uuids;
            window.open(systemConfigPath.purchaseManagerUrl(getUrlByParam("/inquiry/agreementDetail",params)));
        }else{
            message.error("采购协议未找到");
        }
    }

    // 查看详情
    seeDetails = ( uuids ) => {
        window.open(systemConfigPath.jumpPage(getUrlByParam("/platInvoice/inquiryDetail/" + uuids)));
    }

    //订单详情
    showOrderDetail = (uuids)=>{
        let params = {};
        params.longFlag = "1";
        params.uuids = uuids;
        window.open(systemConfigPath.jumpPage(getUrlByParam("/backlog/orderDetail",params)));
    }

    // //查看供应商资质
    // companyDetail = (key)=> {
    //     let params = {};
    //     params.sellerUuids = this.state.dataSource.sellerCompanyUuids;
    //     window.open(systemConfigPath.jumpPage(getUrlByParam("/supplier/supplierAptitudeDetail",params)));
    // }

    //联系供应商
    contactSeller = (key)=> {
        this.a.openSessionWin();
    }

    //联系采购商
    contactBuyer = (key)=> {
        this.a.openSessionWin();
    };
  //税额显示
    taxRatesShow=(taxRates)=>{
        if(taxRates != null && taxRates !=""){
            taxRates = taxRates*100 +"%"
        }
        return taxRates;
    };

    //
    paymentMethodShow=(paymentMethod,paymentMethodStr,paymentDays)=>{
        let data="";
        if(paymentMethod ==5){
            data=<span><span>{paymentMethodStr}</span><span style={{marginLeft:"24px"}}>( {paymentDays} 天)</span></span>;
        }else {
            data=<span>{paymentMethodStr}</span>;
        }
        return data;
    };

    render(){
        let source = "";
        if(this.state.dataSource.source==1){
            source = "直采";
        }else if(this.state.dataSource.source==2){
            source = (<p className="ant-form-text">询价单
            <span>
            (<a onClick={()=>{this.seeDetails(this.state.dataSource.sourceInquiryUuids)}}> {this.state.dataSource.sourceInquiryNo}</a>)
                </span></p>);
        }else if(this.state.dataSource.source==3){//比价暂无
            source = "比价";
        }else if(this.state.dataSource.source==4){//长期采购暂无
            source = (<p className="ant-form-text">采购计划
            <span>
            (<a onClick={()=>{this.showAgreementDetail()}}> {this.state.dataSource.sourceAgreementNo}</a>)
                </span></p>);
        }else if(this.state.dataSource.source==5){//竞价
                        source = (<p className="ant-form-text">竞价单
                         <span>
                         (<a onClick={
                            () => {
                              // this.goDetail(record.uuids)
                              // this.props.history.push('/bidDetail/'+record.uuids);
            //                   window.open(systemConfigPath.jumpPage('/platInvoice/bidlist/bidDetail/' + this.state.dataSource.ecUuids));
                            }}> {this.state.dataSource.sn}</ a>)
                             </span></p >);
                    }
        else if(this.state.dataSource.source==5){//竞价
            source = (<p className="ant-form-text">竞价单
             <span>
             (<a onClick={
                () => {
                  // this.goDetail(record.uuids)
                  // this.props.history.push('/bidDetail/'+record.uuids);
                  window.open(systemConfigPath.jumpPage('/bidDetail/' + this.state.dataSource.ecUuids));
                }}> {this.state.dataSource.sn}</a>)
                 </span></p>);
        }
        return(
            <Form>
                <Card  bordered={false} className="mb10 orderbasefor_layer1">
                    <Row>
                        <Col span={12}>
                            <h2 className={less.order_con_title}>
                                <img src={OrderDetailIcon}/>
                                <em className={less.em}>订单号：</em>
                                <em className={less.em}>{this.state.dataSource.orderNo}</em>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row className="margin_top18">
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="订单来源">
                                        {source}
                                    </BaseDetails>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="下单日期">
                                        {this.state.dataSource.createTime==null?"":moment(this.state.dataSource.createTime).format("YYYY-MM-DD HH:mm:ss")}
                                    </BaseDetails>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="期望到货日">
                                        {this.state.dataSource.exceptionReceiveDate==null?"":moment(this.state.dataSource.exceptionReceiveDate).format("YYYY-MM-DD")}
                                    </BaseDetails>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="收货时间">
                                        {this.state.dataSource.confirmReceivedTime==null?"":moment(this.state.dataSource.confirmReceivedTime).format("YYYY-MM-DD")}
                                    </BaseDetails>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="预计提款时间">
                                        <span style={{color:"red"}}>
                                            {this.state.dataSource.receivedTime
                                                ?"预计"+moment(this.state.dataSource.receivedTime).format("YYYY年MM月DD日")+"可提款"
                                                :"确认收货后7个工作日可提款"
                                            }
                                        </span>
                                    </BaseDetails>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span="8">
                                    <p className={less.order_con_layer1_p}>订单状态</p>
                                    <span className={less.order_con_layer1_span}>{this.state.dataSource.orderStatusStr}</span>
                                </Col>
                                <Col span="8">
                                    <p className={less.order_con_layer2_p}>订单金额</p>
                                    <span className={less.order_con_layer1_span}>¥ <NumberFormat value={this.state.dataSource.totalPrice} /></span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10">
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="发货方式">
                                {this.state.dataSource.deliveryStr}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="付款方式">
                                {this.paymentMethodShow(this.state.dataSource.paymentMethod,this.state.dataSource.paymentMethodStr,this.state.dataSource.paymentDays)}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        {/* <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="订单税点">
                                {this.taxRatesShow(this.state.dataSource.taxRates)}
                            </BaseDetails>
                        </Col> */}
                         <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="订单税额">
                                <NumberFormat value={this.state.dataSource.taxAmount} />元
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="付款时间">
                                {this.state.dataSource.buyerPayTime==null?"":moment(this.state.dataSource.buyerPayTime).format("YYYY-MM-DD HH:mm:ss")}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="关联订单">
                                {this.showChildrenList()}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="预计付款时间">
                                {this.state.dataSource.advancePaymentDate==null?"":moment(this.state.dataSource.advancePaymentDate).format("YYYY-MM-DD")}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_} className="margin_bottom24">
                        
                    </Row>
                    <Row {...ComponentDefine.row_} style={{marginTop:"30px"}}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="采购单位">
                                {this.state.dataSource.companyName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="采购人">
                                {this.state.dataSource.purchasePerson}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_} className="margin_bottom24">
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="采购部门">
                                {this.state.dataSource.projectName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="联系电话">
                                {this.state.dataSource.purchasePersonPhone}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}  style={{marginTop:"30px"}}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="供应单位">
                                <p className="ant-form-text">{this.state.dataSource.sellerCompanyName}</p>
                                {/*<p className="ant-form-text"><a className="ant-form-text-btn" href="javascript:void(0);" onClick={this.companyDetail.bind(this,"查看资质")}>查看资质</a></p>*/}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="联系人姓名">
                                <p className="ant-form-text">{this.state.dataSource.contentMan}</p>
                                {/*<p className="ant-form-text"><a className="ant-form-text-btn" href="javascript:void(0);" onClick={this.contactSeller.bind(this,"联系供应商")}>联系供应商</a></p>*/}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="店铺名称">
                                {this.state.dataSource.storeName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="联系电话">
                                {this.state.dataSource.storeContactPhone}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
            </Form>
        )
    }
}
export default OrderBaseForDetail