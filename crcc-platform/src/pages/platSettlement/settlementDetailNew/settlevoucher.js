import {
    Select,
    Card,
    Form,
    Row,
    Col,
    Input,
    InputNumber,
    Button,
    Icon,
    Table,
    Divider,
    Menu,
    Dropdown,
    Modal,
    DatePicker,
    Tabs,
    message,
    Popconfirm,
    Radio,
    Tooltip,
    Checkbox,
    Upload,
    Cascader,
    Alert,
    TimePicker
} from 'antd';
import { systemConfig, systemConfigPath } from '@/utils/config/systemConfig';
import { NumberFormat } from '../../../../src/components/content/Format'
import { getDetailsLabel } from '../../../../src/components/page/Details';
import "./payment.css"
import CusPopover from '../../../../src/components/cusPopover';
import { getQueryString, getUrlByParam } from '@/utils/urlUtils';
import BaseDetails from '@/components/baseDetails';
import titleImg from '../../../static/iconfont/settlementDetail.png';
import OrderDetailIcon from '../../../static/img/order_detail_icon.png';
import { connect } from 'react-redux';
import api from '@/framework/axios';
import OffLineTishi from "../../../static/img/off_tishi.png"
import BaseAffix from '@/components/baseAffix';

import './voucher.less'
class SettleVoucher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderInfo: {
                totalPrice: "",
                orderGoods: []

            },
            dataSource: {},
            voucherData: {},
            payInfo: {},
            flag: false,
            findPurchaseSettlement:{}
        }
    }


    /**
     * 初始化
     */
    componentDidMount() {

        this.getData()
        this.getOrder()
        this.getAccount()
    }
   
    getData = () => {
        const uuids = getQueryString('uuids')
        let params = { uuids: `${uuids}` }
        axios.get('@/settlement/detail/getPurchaseSettlement', { params: params }).then((res) => {
            let sourcedataSource = this.state.dataSource
            let dataSource = Object.assign({}, this.state.dataSource, res)
            dataSource.takeOutPrice = sourcedataSource.takeOutPrice
            dataSource.settlementRestAmount = sourcedataSource.settlementRestAmount
            dataSource.account = sourcedataSource.account
            this.setState({ 
                orderIdList: res.orderIdList,
                 dataSource:res.data

                })
        })
        axios.get('@/settlement/detail/getOrderBySettlementId', { params: params }).then((res) => {
            this.setState({ selectOrderList: res.rows })
        })
    }
    getOrder = () => {
        const uuids = getQueryString('uuids')
        let params = { uuids: `${uuids}` }
        axios.get('@/settlement/payDetail/getPayOrderInfo', { params }).then((res) => {
            this.setState({ orderList: res.orderVoList, dataSource: res }, () => { this.getData() })
        })
    }
    getAccount = () => {
        const uuids = getQueryString('uuids')
        let params = { uuids: `${uuids}` }
        axios.get('@/settlement/payDetail/getReceivingAccount', { params }).then((res) => {
            this.setState({ voucherData: res.data})
        })
    }
    export = () => {
        let params = {
            uuids: this.state.dataSource.uuids
        }
        const url = getUrlByParam("/order/pdf/createReceivingAccount", params);
        window.location.href = systemConfigPath.axiosUrl(url);
    }
    goodsColumns = [
        {
            title: '订单号',
            dataIndex: 'orderNo',
            key: '',
            width: 120,
            render: (text, record) => { return (<p style={{ width: '180px' }}>{text}</p>) }
        },
        {
            title: '下单人',
            dataIndex: 'userName',
            key: '',
            width: 80,
            render: (text, record) => {
                return (
                    <div style={{ width: '80px' }}>
                        <p>{text}</p>
                        <p>{record.userNo}</p>
                    </div>)
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 100,
            render: (text, record) => {
                let moment = require('moment')
                return (<p style={{ width: '100px' }}>{text ? moment(text).format('YYYY-MM-DD') : '- -'}</p>)
            }
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            key: '',
            width: 100,
            render: (text, record) => {
                let type = '- -'
                switch (text) {
                    case 10:
                        type = '待确认'
                        break;
                    case 12:
                        type = '待物流报价'
                        break;
                    case 14:
                        type = '物流报价待确认'
                        break;
                    case 16:
                        type = '物流报价未成交（48小时未确认）'
                        break;
                    case 20:
                        type = '已确认待审核'
                        break;
                    case 23:
                        type = '审核驳回'
                        break;
                    case 25:
                        type = '审核通过待付款'
                        break;
                    case 26:
                        type = '付款中'
                        break;
                    case 30:
                        type = '待发货'
                        break;
                    case 40:
                        type = '待收货'
                        break;
                    case 50:
                        type = '已收货'
                        break;
                    case 70:
                        type = '订单完成'
                        break;
                    case 100:
                        type = '订单取消'
                        break;
                    case 110:
                        type = '订单退款'
                        break;
                }
                return (<p style={{ width: '100' }}>{type}</p>)
            }
        },
        {
            title: '总金额(元)',
            dataIndex: 'totalPrice',
            key: '',
            width: 110,
            render: (text, record) => { return (<p style={{ width: '110' }}>{text ? <span><NumberFormat value={text}></NumberFormat></span> : '- -'}</p>) }
        },
        {
            title: '本次支付金额(元)',
            dataIndex: 'payingAmount',
            key: '',
            width: 110,
            render: (text, record) => { return (<p style={{ width: '110' }}>{text >= 0 ? <span><NumberFormat value={text}></NumberFormat> </span> : '- -'}</p>) }
        },
        {
            title: '本次支付比例',
            dataIndex: 'totalPriceNoTax',
            key: '',
            width: 110,
            render: (text, record) => { return (<p style={{ width: '110px' }}>{((record.payingAmount / record.totalPrice) * 100).toFixed(2) + '%'}</p>) }
        },
        //restAmount
        {
            title: '本次剩余未付金额(元)',
            dataIndex: 'restAmount',
            key: '',
            width: 140,
            render: (text, record) => { return (<p style={{ width: '110' }}>{text >= 0 ? <span><NumberFormat value={text}></NumberFormat> </span> : '- -'}</p>) }
        },
    ];

    /**
     * 关闭页面
     */
    closeWindow = () => {
        window.close();
    }

    render() {
        const { voucherData, dataSource, orderList } = this.state
        let showAccount = true

        if (dataSource.payOrder && dataSource.payOrder.payWay && dataSource.payOrder.payWay == 4) {
            //console.log('dataSource.payOrder.payWay', dataSource.payOrder.payWay);
            showAccount = false
        }
        return (
            <div>
                <div className="choose_bank off_line_pay">
                    <div className="pay_order_index">
                    <Card bordered={false} className="mb10">
                    <Row  {...ComponentDefine.row_} style={{paddingBottom:"18px"}}>
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
                        <Col>
                        <BaseDetails title="采购商">
                                    {this.state.dataSource.companyName}
                        </BaseDetails></Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <BaseDetails title="项目部">
                                {this.state.dataSource.deptName}
                            </BaseDetails>
                        </Col>
                        <Col span={8} style={{boxSizing: 'border-box',paddingLeft: '10px'}}>
                            <BaseDetails title="付款账号">
                                {showAccount && voucherData.account ? voucherData.account : '- -'}
                            </BaseDetails>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <span style={{fontSize:"14px!important"}}>付款金额</span>
                                <div>
                                <span style={{
                                    // color:"rgba(0, 0, 0, 0.85)",
                                    color:'#2db7f5',
                                    fontSize:"20px!important",
                                    lineHeight:"28px"
                                }}>
                                    ￥&nbsp;{this.state.voucherData.amount || this.state.voucherData.amount==0 ?<NumberFormat value={this.state.voucherData.amount}/>:'-' }
                                </span>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <BaseDetails title="供应商">
                                {this.state.dataSource.supplierCompanyName}
                            </BaseDetails>
                        </Col>
                        <Col span={8} style={{boxSizing: 'border-box',paddingLeft: '10px'}}>
                            <BaseDetails title="付款账户名称">
                                {showAccount && voucherData.accountName ? voucherData.accountName : '- -'}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <BaseDetails title="支付单号">
                                {this.state.voucherData.serialNumber}
                            </BaseDetails>
                        </Col>
                    </Row>
                    
                    
                </Card>
                        <div className="offLine_card_ran margin_top10">
                            <div style={{ top: "10px", position: "relative" }}>
                                <img src={OffLineTishi} />
                                <span className="content margin_left_8"><span style={{ "color": "rgba(0, 0, 0, 0.65)" }}>转账时，请务必在“用途/附言/摘要/备注”处仅填写付款识别码，如填写错误或包含除识别码外其他内容将导致付款失败！</span></span>
                                <span className="content margin_left_48" style={{ "color": "rgba(0, 0, 0, 0.65)" }}>识别码:</span>
                                <span className="content_money">{voucherData.postscript}</span>
                            </div>
                        </div>
                        <Card title="收款人账户信息" className="offLine_sh_info_card margin_top10">
                            <Row className="offLine_sh_info_main">
                                <Row className="offLine_sh_info_content">
                                    <span className="offLine_sh_info_content_title">收款人账户信息</span>
                                    <table className={"offLine_sh_info_table"} cellPadding="0" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                <td width="152" className="td_one"><span>银行户名</span></td>
                                                <td width="362">平安银行电子商务交易资金待清算专户（铁建商城）</td>
                                                <td width="88" className="td_three"><span
                                                    className="td_three_xx">*</span><span>必填</span></td>
                                            </tr>
                                            <tr>
                                                <td width="152" className="td_one"><span>银行账号</span></td>
                                                <td width="362">15000091380762</td>
                                                <td width="88" className="td_three"><span
                                                    className="td_three_xx">*</span><span>必填</span></td>
                                            </tr>
                                            <tr>
                                                <td width="152" className="td_one"><span>收款银行</span></td>
                                                <td width="362">平安银行股份有限公司</td>
                                                <td width="88" className="td_three"><span
                                                    className="td_three_xx">*</span><span>必填</span></td>
                                            </tr>
                                            <tr>
                                                <td width="152" className="td_one"><span>开户地</span></td>
                                                <td width="362">天津市</td>
                                                <td width="88" className="td_three"><span
                                                    className="td_three_xx">*</span><span>必填</span></td>
                                            </tr>
                                            <tr>
                                                <td width="152" className="td_one"><span>支行</span></td>
                                                <td width="362">平安银行股份有限公司天津分行营业部</td>
                                                <td width="88" className="td_three"><span
                                                    className="td_three_xx">*</span><span>必填</span></td>
                                            </tr>
                                            <tr>
                                                <td width="152" className="td_one"><span>识别码</span></td>
                                                <td width="362" className="td_two_random">{voucherData.postscript ? voucherData.postscript : '- -'}</td>
                                                <td width="88" className="td_three"><span
                                                    className="td_three_xx">*</span><span>必填</span></td>
                                            </tr>
                                            <tr>
                                                <td width="152" className="td_one"><span>银联号</span></td>
                                                <td width="362">307110004315</td>
                                                <td width="88" className="td_three">非必填</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/*<Row className={"margin_top_16"}
                                         style={{whiteSpace: "nowrap"}}>1、使用网银转账时请务必将付款识别码填写到用途附言或备注中（若这样都有的话请全部填写）；</Row>
                                    <Row style={{marginTop: "8px"}}>2、柜台转账请将付款识别码填写到用途中</Row>*/}
                                    <Row style={{ marginTop: "8px" }}>该结算单供应商信息为：{dataSource.supplierCompanyName}，平安网银子账号为：{voucherData.sellCustId ? voucherData.sellCustId : '- -'}，如有供应商向您询问可为其提供查询使用。</Row>
                                </Row>
                            </Row>
                        </Card>
                        {/*<Card title="用途/附言/摘要/备注" className="offLine_remark margin_top10">
                            <Input type="textarea" disabled readonly="readonly"
                                   style={{width: "984px", height: "88px", resize: "none"}} rows="3"/>
                        </Card>*/}

                        <Card title="订单信息" className="offLine_goods_card margin_top10">
                            <Table rowKey="orderLogTable"
                                {...ComponentDefine.table_} rowSelection={null} pagination={false}
                                columns={this.goodsColumns} dataSource={voucherData.orderList} />
                            {/* <Row className='orderex' type='flex' justify='end'>
                                {
                                    <Col span={6}>
                                        <Row><Col><span>货品总额:</span><span>{dataSource.settlementTotalPriceNoTax > 0 ? <span>￥<NumberFormat value={dataSource.settlementTotalPriceNoTax}></NumberFormat></span> : '- -'}</span></Col></Row>
                                        <Row><Col><span>税额:</span><span>{dataSource.settlementTotalAmount >= 0 ? <span>￥<NumberFormat value={dataSource.settlementTotalAmount}></NumberFormat></span> : '- -'}</span></Col></Row>
                                        <Row className='line'><div></div></Row>
                                        <Row><Col><span>税价合计:</span><span>{dataSource.settlementTotalPrice ? <span>￥<NumberFormat value={dataSource.settlementTotalPrice}></NumberFormat></span> : '- -'}</span></Col></Row>
                                        <Row><Col><span>物流费:</span><span>{dataSource.freightAmount || dataSource.freightAmount == 0 ? <span>￥<NumberFormat value={dataSource.freightAmount}></NumberFormat></span> : '- -'}</span></Col></Row>
                                    </Col>
                                }
                            </Row> */}
                        </Card>
                    </div>

                </div>
                {/* <DetailsBtns>
                    <PermissionsBtn noauth>
                        <Button type="ghost" onClick={() => { this.export() }}>打印</Button>
                        <Button type="ghost" onClick={this.closeWindow}>关闭</Button>
                    </PermissionsBtn>
                </DetailsBtns> */}
                <BaseAffix>
                    <Button type="ghost" style={{marginRight:"10px"}} onClick={() => { this.export() }}>打印</Button>
                    <Button type="primary" style={{marginRight:"10px"}} onClick={this.closeWindow}>关闭</Button>   
 
                </BaseAffix>
            </div>
        )
    }
}


let mapStateToProps = state => {
    // const { userInfo } = state.authReducer;
    // return {
    //     userInfo,
    // };
};

export default connect(mapStateToProps)(Form.create()(SettleVoucher))