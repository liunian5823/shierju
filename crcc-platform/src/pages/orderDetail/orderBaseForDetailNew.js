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
                        if(children){//this.props.enableChildrenList
                            return(
                                <span key={k} style={{marginRight:8}}>{children.orderNo}</span>
                            )
                        }
                        // else{
                        //     return(
                        //         <span style={{marginRight:8}}>{children.orderNo}</span>
                        //     )
                        // }
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
    // showAgreementDetail = ()=>{
    //     let uuids = this.state.dataSource.sourceAgreementUuids;
    //     if(uuids){
    //         let params = {};
    //         //longFlag:跳转到询价详情，底部按钮判断使用
    //         params.longFlag = "1";
    //         params.uuids = uuids;
    //         window.open(systemConfigPath.jumpPage(getUrlByParam("/inquiry/agreementDetail",params)));
    //     }else{
    //         message.error("采购协议未找到");
    //     }
    // }

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
            data=<span><span>{paymentMethodStr}</span><span style={{marginLeft:"18px"}}>( {paymentDays} 天)</span></span>;
        }else {
            data=<span>{paymentMethodStr}</span>;
        }
        return data;
    };

    

    render(){
        const { dataSource} = this.state
        let source = "";
        let link = ''
        if(this.state.dataSource.source==1){
            source = "直采";
            link = <p>-</p>
        }else if(this.state.dataSource.source==2){
            source = (<p className="ant-form-text">询价采购</p>);
            link = <a onClick={()=>{this.seeDetails(this.state.dataSource.sourceInquiryUuids)}}> {this.state.dataSource.sourceInquiryNo}</a>
               
        }else if(this.state.dataSource.source==3){//比价暂无
            source = "比价";
        }else if(this.state.dataSource.source==4){//长期采购暂无
            source = (<p className="ant-form-text">协议采购 {this.state.dataSource.agreementSource==1 ? '询价采购' :'竞价采购'}</p>)
            link=<p> {this.state.dataSource.sourceAgreementNo}&nbsp;&nbsp; {this.state.dataSource.agreementSource ==1 ?
                <a onClick={()=>{this.seeDetails(this.state.dataSource.sourceInquiryUuids)}}> {this.state.dataSource.sourceInquiryNo}</a>
                :<a onClick={
                    () => {
                      window.open(systemConfigPath.jumpPage('/platInvoice/bidlist/bidDetail/' + this.state.dataSource.sourceInquiryUuids));
                    }}> {this.state.dataSource.sourceInquiryNo}</a>} </p>
                
        }else if(this.state.dataSource.source==5){//竞价
            source = (<p className="ant-form-text">竞价采购</p>)
            link = <a onClick={
                () => {
                  window.open(systemConfigPath.jumpPage('/platInvoice/bidlist/bidDetail/' + this.state.dataSource.sourceInquiryUuids));
                }}> {this.state.dataSource.sourceInquiryNo}</a>
                
        }

        let paymentMethodStr = "";
        if(this.state.dataSource.oldFlag == 2){
            paymentMethodStr = this.state.dataSource.paymentMethodStr
        }else{
            if(1 == this.state.dataSource.paymentMethod){
                paymentMethodStr = "现付/汇款"
            }else if(4 == this.state.dataSource.paymentMethod){
                paymentMethodStr = "共享中心"
            }else if(5 == this.state.dataSource.paymentMethod){
                paymentMethodStr = "铁建银信"
                paymentMethodStr += "  (" + this.state.dataSource.paymentDays + "天)"
            }else{
                paymentMethodStr = "现付/汇款"
            }
        }
        let modaltype = ''
        let color = ''
        let orderStatus = dataSource.orderStatus;
        let buyerBalanceStatus = dataSource.buyerBalanceStatus;
        let invoiceStatus = dataSource.invoiceStatus;
        let oldFlag = dataSource.oldFlag;
        let closeFlag = dataSource.closeFlag;

        let closeStatusStr = '';
        let orderStatusStr = "";
        let otherStatus = "";
        let balanceStatusStr = "";

        if(1 == closeFlag){
            closeStatusStr = "（申诉中）";
        }
        if(10 == orderStatus){
            color = '#FA9B13';
            orderStatusStr = '待确认';
        }else if(12 == orderStatus){
            color = '#32C5FF';
            orderStatusStr = '物流报价';
            otherStatus = '（报价中）';
        }else if(14 == orderStatus){
            color = '#32C5FF';
            orderStatusStr = '物流报价';
            otherStatus = '（待确认）';
        }else if(20 == orderStatus){
            color = '#32C5FF';
            orderStatusStr = '审核中';
        }else if(23 == orderStatus){
            color = '#FA9B13';
            orderStatusStr = '待确认';
            otherStatus = '（已驳回）';
        }else if(28 == orderStatus){//有结算状态
            color = '#FA9B13';
            orderStatusStr = '发货申请';
            if(30 == buyerBalanceStatus){
                balanceStatusStr = "（待结算）";
            }else if(40 == buyerBalanceStatus || 41 == buyerBalanceStatus){
                balanceStatusStr = "（结算中）";
            }else if(60 == buyerBalanceStatus){
                balanceStatusStr = "（已结算）";
            }
            if(3 == oldFlag){
                if(1 == buyerBalanceStatus || 4 == buyerBalanceStatus){
                    balanceStatusStr = "（待结算）";
                }
            }else{
                if (buyerBalanceStatus == 1) {
                    balanceStatusStr = " (待开票) ";
                 } else if (buyerBalanceStatus == 4) {
                    balanceStatusStr = " (质保期) ";
                 } else if (buyerBalanceStatus == 2) {
                    balanceStatusStr = " (已开票) ";
                 } else if (buyerBalanceStatus == 10) {
                    balanceStatusStr = " (已完成) ";
                 } 
            }
        }else if(30 == orderStatus){//有结算状态
            color = '#FA9B13';
            orderStatusStr = '未发货';
            if(30 == buyerBalanceStatus){
                balanceStatusStr = "（待结算）";
            }else if(40 == buyerBalanceStatus || 41 == buyerBalanceStatus){
                balanceStatusStr = "（结算中）";
            }else if(60 == buyerBalanceStatus){
                balanceStatusStr = "（已结算）";
            }
            if(3 == oldFlag){
                if(1 == buyerBalanceStatus || 4 == buyerBalanceStatus){
                    balanceStatusStr = "（待结算）";
                }
            }else{
                if (buyerBalanceStatus == 1) {
                    balanceStatusStr = " (待开票) ";
                 } else if (buyerBalanceStatus == 4) {
                    balanceStatusStr = " (质保期) ";
                 } else if (buyerBalanceStatus == 2) {
                    balanceStatusStr = " (已开票) ";
                 } else if (buyerBalanceStatus == 10) {
                    balanceStatusStr = " (已完成) ";
                 } 
            }
        }else if(40 == orderStatus){//有结算状态
            color = '#FA9B13';
            orderStatusStr = '待收货';
            if(30 == buyerBalanceStatus){
                balanceStatusStr = "（待结算）";
            }else if(40 == buyerBalanceStatus || 41 == buyerBalanceStatus){
                balanceStatusStr = "（结算中）";
            }else if(60 == buyerBalanceStatus){
                balanceStatusStr = "（已结算）";
            }

            if(3 == oldFlag){
                if(1 == buyerBalanceStatus || 4 == buyerBalanceStatus){
                    balanceStatusStr = "（待结算）";
                }
                if(0 == invoiceStatus){
                    otherStatus = "（未开票）";
                }else if(1 == invoiceStatus){
                    otherStatus = "（已开票）";
                }
            }else{
                if (buyerBalanceStatus == 1) {
                    balanceStatusStr = " (待开票) ";
                 } else if (buyerBalanceStatus == 4) {
                    balanceStatusStr = " (质保期) ";
                 } else if (buyerBalanceStatus == 2) {
                    balanceStatusStr = " (已开票) ";
                 } else if (buyerBalanceStatus == 10) {
                    balanceStatusStr = " (已完成) ";
                 } 
            }
        }else if(50 == orderStatus){//有结算状态
            color = '#32C5FF';
            orderStatusStr = '质保中';
            if(30 == buyerBalanceStatus){
                balanceStatusStr = "（待结算）";
            }else if(40 == buyerBalanceStatus || 41 == buyerBalanceStatus){
                balanceStatusStr = "（结算中）";
            }else if(60 == buyerBalanceStatus){
                balanceStatusStr = "（已结算）";
            }

            if(3 == oldFlag){
                if(1 == buyerBalanceStatus || 4 == buyerBalanceStatus){
                    balanceStatusStr = "（待结算）";
                }
                if(0 == invoiceStatus){
                    otherStatus = "（未开票）";
                }else if(1 == invoiceStatus){
                    otherStatus = "（已开票）";
                }
            }else{
                if (buyerBalanceStatus == 1) {
                    balanceStatusStr = " (待开票) ";
                 } else if (buyerBalanceStatus == 4) {
                    balanceStatusStr = " (质保期) ";
                 } else if (buyerBalanceStatus == 2) {
                    balanceStatusStr = " (已开票) ";
                 } else if (buyerBalanceStatus == 10) {
                    balanceStatusStr = " (已完成) ";
                 } 
            }
        }else if(70 == orderStatus){//有结算状态
            color = '#6DD400';
            orderStatusStr = '已完成';
            if(30 == buyerBalanceStatus){
                balanceStatusStr = "（待结算）";
            }else if(40 == buyerBalanceStatus || 41 == buyerBalanceStatus){
                balanceStatusStr = "（结算中）";
            }else if(60 == buyerBalanceStatus){
                balanceStatusStr = "（已结算）";
            }

            if(3 == oldFlag){
                if(1 == buyerBalanceStatus || 4 == buyerBalanceStatus){
                    balanceStatusStr = "（待结算）";
                }
                if(0 == invoiceStatus){
                    otherStatus = "（未开票）";
                }else if(1 == invoiceStatus){
                    otherStatus = "（已开票）";
                }
            }else {
                if (buyerBalanceStatus == 1) {
                    balanceStatusStr = " (待开票) ";
                 } else if (buyerBalanceStatus == 4) {
                    balanceStatusStr = " (质保期) ";
                 } else if (buyerBalanceStatus == 2) {
                    balanceStatusStr = " (已开票) ";
                 } else if (buyerBalanceStatus == 10) {
                    balanceStatusStr = " (已完成) ";
                 } 
            }
        }else if(100 == orderStatus){//失效
            color = '#E02020';
            orderStatusStr = '作废失效';
        }else if(16 == orderStatus){//失效
            color = '#E02020';
            orderStatusStr = '作废失效';
            otherStatus = "（未成交）";//物流报价未成交48小时
        }

        return(
            <Form>
                <Card  bordered={false} className="mb10 orderbasefor_layer1">
                    <Row {...ComponentDefine.row_}>
                        <Col span={12}>
                            <h2 className={less.order_con_title}>
                                <img src={OrderDetailIcon}/>
                                <em className={less.em}>订单号：</em>
                                <em className={less.em}>{this.state.dataSource.orderNo}</em>
                            </h2>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="订单状态">
                                {/* {this.state.dataSource.orderStatusStr} */}
                                <span style={{ color: color, fontSize:'20px !important' }}>{orderStatusStr}</span>
                                   <span style={{ color: color}}>{otherStatus}</span>
                                   <span style={{ color: color}}>{balanceStatusStr}</span>
                                   <span style={{ color: color}}>{closeStatusStr}</span>
                            </BaseDetails>                                  
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}  style={{marginTop:"30px"}}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="采购单位">
                                {this.state.dataSource.companyName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="供应单位">
                                <p className="ant-form-text" style={{width:'450px'}}>{this.state.dataSource.sellerCompanyName}</p>
                                {/*<p className="ant-form-text"><a className="ant-form-text-btn" href="javascript:void(0);" onClick={this.companyDetail.bind(this,"查看资质")}>查看资质</a></p>*/}
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
                            <BaseDetails title="供货联系人">
                            {this.state.dataSource.contentMan} &nbsp;&nbsp;{this.state.dataSource.storeContactPhone}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row className="margin_top18">
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="采购方式">
                                        {source}
                                    </BaseDetails>
                                </Col>
                    </Row>
                    <Row {...ComponentDefine.row_} className="margin_bottom24">
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="寻源单号">
                                {link}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="货品金额">
                            <span className='red-important' >¥ <NumberFormat value={this.state.dataSource.totalPriceNoTax} /></span>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_} className="margin_bottom24">
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="下单人">
                            <p className="ant-form-text">
                                    {this.state.dataSource.userNo}
                                    &nbsp;&nbsp;{this.state.dataSource.purchasePerson}
                                        &nbsp;&nbsp;{this.state.dataSource.purchasePersonPhone}
                                        </p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="税 额">
                            <span className='red-important' >¥ <NumberFormat value={this.state.dataSource.taxAmount} /></span>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>                    
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="下单日期">
                                {this.state.dataSource.createTime==null?"":moment(this.state.dataSource.createTime).format("YYYY-MM-DD HH:mm:ss")}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="税价合计">
                            <span className='red-important' >¥ <NumberFormat value={this.state.dataSource.totalPrice} /></span>
                            </BaseDetails>
                        </Col>
                            {/* <Row {...ComponentDefine.row_}>
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
                            </Row> */}
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
                                    <BaseDetails title="预计付款日">
                                        {this.state.dataSource.advancePaymentDate==null?"":moment(this.state.dataSource.advancePaymentDate).format("YYYY-MM-DD")}
                                    </BaseDetails>
                                </Col>
                    </Row>
                </Card>
                <Card title='订单信息' bordered={false} className="mb10">
                <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="付款方式">
                           {/* {this.state.dataSource.oldFlag == 3 ? this.paymentMethodShow(this.state.dataSource.paymentMethod,this.state.dataSource.paymentMethodStr,this.state.dataSource.paymentDays) :paymentMethodStr}                            */}
                           {paymentMethodStr}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="结算单号">
                                {this.state.dataSource.settlementNo}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="发货方式">
                                {this.state.dataSource.deliveryStr}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="结算完成日期">
                            {this.state.dataSource.finishTime==null?"":moment(this.state.dataSource.finishTime).format("YYYY-MM-DD")}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="实际发货批次">
                                {this.state.dataSource.actualDeliveryCount ? this.state.dataSource.actualDeliveryCount :'-'}批
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="已支付金额">
                            <span className='red-important'>¥ <NumberFormat value={this.state.dataSource.payidAmount} /></span>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="质保金收取">
                                {this.state.dataSource.warrantyType == 1 ? "收取" : "不收取"}
                            </BaseDetails>
                        </Col>
                        <Col span={6} className="ant-form-item-margin-bottom">
                            <BaseDetails title="待支付金额">
                            <span className='red-important'>¥ <NumberFormat value={this.state.dataSource.restAmount} /></span>
                            </BaseDetails>
                        </Col>
                        <Col span={5} style={{marginTop:'6px',paddingLeft:'0px!important',color:'#999'}}>
                                (<span style={{fontSize:'12px!important'}}>支付中：¥ </span>{this.state.dataSource.payingAmount ? <NumberFormat value={this.state.dataSource.payingAmount}></NumberFormat> : <NumberFormat value={0}></NumberFormat>})
                            </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="质保金比例">
                            <p className="ant-form-text">订单额&nbsp;{this.state.dataSource.qualityRetentionRate ? this.state.dataSource.qualityRetentionRate * 100+'%' :'-'}</p>
                            </BaseDetails>
                        </Col>
                        {this.state.dataSource.oldFlag == 2 ?
                            <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="付款时间">
                            {this.state.dataSource.buyerPayTime==null?"":moment(this.state.dataSource.buyerPayTime).format("YYYY-MM-DD HH:mm:ss")}
                            </BaseDetails>
                            </Col> 
                            :''   
                    }
                    </Row>
                    <Row {...ComponentDefine.row_} className="margin_bottom24">
                    <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="质保金时长">
                            <p className="ant-form-text">收货后&nbsp;{this.state.dataSource.warrantyDay ? this.state.dataSource.warrantyDay :'-'}天</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
            </Form>
        )
    }
}
export default OrderBaseForDetail