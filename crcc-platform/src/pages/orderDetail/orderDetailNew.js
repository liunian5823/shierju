import {
    Timeline,Select,Card, Form,Row, Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,Modal,DatePicker,Tabs,Radio } from 'antd';
import moment from 'moment';
import OrderAllBaseForDetailNew from './OrderAllBaseForDetailNew';
import OrderExpressInfo from './OrderExpressInfo';
import OrderDeliveryInfo from './OrderDeliveryInfo';
import BaseDetails from "@/components/baseDetails";
import {NumberFormat} from '@/components/content/Format'
import BaseAffix from "@/components/baseAffix";
import OrderContractTab from './orderContractTab/OrderContractTab';//订单合同
import { systemConfigPath } from '@/utils/config/systemConfig';
import CheckSettleModal from './checksettlemodal';//发票信息
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import  less from './orderDetail.less'

const TabPane = Tabs.TabPane;
class OrderDetail extends React.Component {
    state = {
        dataSource:{//基础数据
            ecApprovalFlowPlus:{},
            tabShowState:{}
        },
        tab:{//下方tab页展示状态
        },
        relationOrderInfo:[],
        passVisible: false,
        invoiceData:{}

    }

    //初始化时触发
    componentWillMount(){
        this.refresh(getQueryString('uuids'));
        //关联订单
        axios.get("@/order/order/relationOrderInfo", {
            params : {uuids:getQueryString('uuids')}
        }).then(r => {
            this.setState({
                relationOrderInfo: r.data
            })
        });
    }

    //刷新订单详情数据
    refresh = (uuids)=>{
        if(uuids){
            const params = {};
            params.uuids = uuids;
            // axios.get("!!/order/order/getOrderById",{
            axios.get("@/platform/order/detail/getOrderById",{
                params:params
            }).then(r=>{
                console.log('555',r)
                this.setState({
                    // dataSource:r.data,
                    dataSource:r,
                })
            })
        }
    }

    handleCancel = () => {
        let flag = getQueryString('flag');
        if(flag) {
            this.props.history.goBack();
        }
        let goBackUrl = getQueryString('goBackUrl');
        goBackUrl = unescape(goBackUrl)
        if(goBackUrl){
            this.props.history.push(goBackUrl);
        }else{
            window.close();
        }
    }

    //1.1商品信息下方订单改价信息
    showEcOrderChangePrice = (ecOrderChangePrice)=>{
        if(ecOrderChangePrice&&ecOrderChangePrice.orderChangePriceId){
            return(
                <div>
                    <div className={less.table_all}>
                        <div className={less.table_all_left}>
                            <p className={less.table_all_leftP}>本订单已改价！<em className={less.table_all_leftPem}>（改价时间{ecOrderChangePrice.changePriceTime?moment(ecOrderChangePrice.changePriceTime).format("YYYY-MM-DD HH:mm:ss"):""}）</em>
                                <br/>改价理由：<i className={less.table_all_leftPi}>{ecOrderChangePrice.changePriceReason}</i></p>
                        </div>
                        {/* <div className={less.table_all_p}>原货品金额：<label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.originalProductPrice}/></label></div>
                        <div className={less.table_all_p}>原物流费：<label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.originalFreight}/></label></div>
                        <div className={less.table_all_p}>原总金额：<label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.orderOriginalPrice}/></label></div>
                        <div className={less.table_all_p}>差额：<label className={less.table_all_p_cur}>￥<NumberFormat value={ecOrderChangePrice.orderChangePrice}/></label></div> */}

<Row >
                        <Col span="8" style={{textAlign:'right'}}>
                            <div className={less.table_all_p}><span className={less.sp}>原货品金额：</span><label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.originalProductNoTaxPrice} /></label></div>
                            <div className={less.table_all_p}><span className={less.sp}>原税额：</span><label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.orderOriginalTax} /></label></div>
                            <div className={less.table_all_p}><span className={less.sp}>原物流费：</span><label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.originalFreight} /></label></div>
                        </Col>
                        <Col span="6" style={{paddingRight:10}}>
                            <div className={less.table_all_p}><span className={less.sp}>货品金额：</span><label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.totalPriceNoTax} /></label></div>
                            <div className={less.table_all_p}><span className={less.sp}>税额：</span><label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.taxAmount} /></label></div>
                            <div className={less.table_all_p}><span className={less.sp}>物流费：</span><label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.freight} /></label></div>
                            <div className={less.table_all_p}><span className={less.sp}>差额：</span><label className={less.table_all_pLabel}>￥<NumberFormat value={ecOrderChangePrice.orderChangePrice} /></label></div>
                        </Col>
                    </Row>

                    </div>
                    <div className={less.table_all_all}>
                        <div className={less.table_all_p}>税价合计：<label>￥<NumberFormat value={ecOrderChangePrice.totalPrice}/></label></div>
                    </div>
                </div>
            )
        }
    }

    //2.收货信息
    showEcDeliveryOrderRel = ()=>{
        return (
            <OrderDeliveryInfo uuids={this.state.dataSource.uuids}
            dataSource={this.state.dataSource}
            />
        )
    }

    //4.物流信息
    showEcExpressOrderRel = (ecExpressOrderRel)=>{
        return (
            <OrderExpressInfo uuids={this.state.dataSource.uuids}/>
        )
    }
    //5.开票信息
    showEcInvoice = (ecInvoices)=>{
        if(ecInvoices!=null){
            return (
                ecInvoices.map((ecInvoice,index)=>{
                    let ecInvoiceCardClass = "card-margin-bottom";
                    if(ecInvoices.length == index+1){
                        ecInvoiceCardClass = "";
                    }
                    return(<Card className={ecInvoiceCardClass}>
                            <Form horizontal >
                                <Row>
                                    <Col span={12} className="ant-form-item-margin-bottom">
                                        <BaseDetails title="发票抬头">
                                            {ecInvoice.title}
                                        </BaseDetails>
                                    </Col>
                                    <Col span={12} className="ant-form-item-margin-bottom">
                                        <BaseDetails title="发票类型">
                                            {ecInvoice.invTypeStr}
                                        </BaseDetails>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} className="ant-form-item-margin-bottom">
                                        <BaseDetails title="发票号">
                                            {ecInvoice.invNo}
                                        </BaseDetails>
                                    </Col>
                                    <Col span={12} className="ant-form-item-margin-bottom">
                                        <BaseDetails title="发票代码">
                                            {ecInvoice.invCode}
                                        </BaseDetails>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} className="ant-form-item-margin-bottom">
                                        <BaseDetails title="纳税人识别号">
                                            {ecInvoice.taxpayerNumber}
                                        </BaseDetails>
                                    </Col>
                                    <Col span={12} className="ant-form-item-margin-bottom">
                                        <BaseDetails title="税价合计">
                                            {ecInvoice.totalTax}
                                        </BaseDetails>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="ant-form-item-margin-bottom">
                                        <BaseDetails title="影像文件">
                                            <p className="ant-form-text">{ecInvoice.invoicePath?<a href={SystemConfig.systemConfigPath.dfsPathUrl(ecInvoice.invoicePath)} target="_blank">{ecInvoice.invoiceName}</a>:"-"}</p>
                                        </BaseDetails>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                })
            )
        }
    }

    passChange = (type,record) => {
        this.setState({
          passVisible: true,
          type
        });
        //查看发票
        let params = {
            uuids: record.uuids
        }
        axios.get('@/settlement/detail/getInvoiceInfo', { params }).then((res) => {
            console.log('666',res)
            this.setState({ invoiceData: res.data })
        })
    
      };
      closeModal = () => {
        this.setState({ passVisible: false })
    }

    //商品信息
    columns_1 = [{
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width:150,
        render: (text, record, index) => (
            <p style={{width:"100px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width:90,
        render: (text, record, index) => (
            <p style={{width:"74px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '规格',
        dataIndex: 'specifications',
        key: 'specifications',
        width:150,
        render: (text, record, index) => (
            <p style={{width:"100px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '采购量',
        dataIndex: 'originalCount',
        key: 'originalCount',
        width:90,
        render: (text, record, index) => (
            <p style={{width:"74px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '实际数量',
        dataIndex: 'count',
        key: 'count',
        width:90,
        render: (text, record, index) => (
            <p style={{width:"74px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '单位',
        dataIndex: 'productUnit',
        key: 'productUnit',
        width:90,
        render: (text, record, index) => (
            <p style={{width:"74px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    },{
        title: '税率',
        dataIndex: 'taxRate',
        key: 'taxRate',
        width:60,
        render: (text, record, index) => (
            <p style={{width:"44px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text*100}%</span>
            </p>
        ),
    }, {
        title: '含税单价(元)',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width:90,
        render: (text, record, index) => (
            <p style={{width:"74px"}} className="orderDetailTableColumnWidth">
                <span title={text}><NumberFormat value={text}/></span>
            </p>
        ),
    },
    //  {
    //     title: '成交价(元)',
    //     dataIndex: 'salePrice',
    //     key: 'salePrice',
    //     width:90,
    //     render: (text, record, index) => (
    //         <p style={{width:"74px"}} className="orderDetailTableColumnWidth">
    //             <span title={text}><NumberFormat value={text}/></span>
    //         </p>
    //     ),
    // }
    {
        title: '差额(元)',
        dataIndex: 'orderChangePrice',
        key: 'orderChangePrice',
        width: 104,
        render: (text, record, index) => (
            <p style={{ width: "84px" }} className="orderDetailTableColumnWidth">
                <span title={text}><NumberFormat value={text} /></span>
            </p>
        ),
    },
    {
        title: '税额(元)',
        dataIndex: 'tax',
        key: 'tax',
        width: 104,
        render: (text, record, index) => (
            <p style={{ width: "84px" }} className="orderDetailTableColumnWidth">
                <span title={text}><NumberFormat value={text} /></span>
            </p>
        ),
    },
    {
        title: '货品金额(元)',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width: 104,
        render: (text, record, index) => (
            <p style={{ width: "84px" }} className="orderDetailTableColumnWidth">
                <span title={text}><NumberFormat value={text} /></span>
            </p>
        ),
    },
    {
        title: '总价(元)',
        dataIndex: 'finalPrice',
        key: 'finalPrice',
        width:90,
        render: (text, record, index) => (
            <p style={{width:"74px"}} className="orderDetailTableColumnWidth">
                <span title={text}><NumberFormat value={text}/></span>
            </p>
        ),
    }];
    //收货信息
    columns_2 = [{
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '品牌',
        dataIndex: 'proBrand',
        key: 'proBrand',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '规格',
        dataIndex: 'proStandard',
        key: 'proStandard',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '采购量',
        dataIndex: 'purchaseCount',
        key: 'purchaseCount',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '实际数量',
        dataIndex: 'shipmentQuantity',
        key: 'shipmentQuantity',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '成交价(元)',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}><NumberFormat value={text}/></span>
            </p>
        ),
    }, {
        title: '到货数量',
        dataIndex: 'shipmentQuantity',
        key: 'receivedQuantity',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '返还金额',
        dataIndex: 'backPrice',
        key: 'backPrice',
        width:100,
        render: (text, record, index) => (
            <p style={{width:"84px"}} className="orderDetailTableColumnWidth">
                <span title={text}><NumberFormat value={text}/></span>
            </p>
        ),
    }];
    //审批次序
    orderByArr = ["零","一","二","三","四","五"]
    //审批信息
    columns_3 = [{
        title: '审批次序',
        dataIndex: 'orderBy',
        key: 'orderBy',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"60px"}}><span title={text?this.orderByArr[text]+"级审批":""}>{text?this.orderByArr[text]+"级审批":""}</span></p>)
        },
    }, {
        title: '审批人',
        dataIndex: 'approvalUserName',
        key: 'approvalUserName',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"180px"}}><span title={text}>{text}</span></p>)
        },
    }, {
        title: '审批时间',
        dataIndex: 'approvalTime',
        key: 'approvalTime',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"140px"}}><span title={text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}</span></p>)
        },
    }, {
        title: '审批状态',
        dataIndex: 'statusFlag',
        key: 'statusFlag',
        width:200,
        render: (text, record, index) => {
            //审批状态标识（1-待审批；2-不通过；3-通过；4-本次业务审批完成，但本人未审批<适用或签和会签审批不通过>）
            let result = "";
            if(text==1){
                result = "待审批"
            }else if(text==2){
                result = "不通过"
            }else if(text==3){
                result = "通过"
            }else if(text==4){
                result = "未审批"
            }
            return(<p className="orderDetailTableColumnWidth" style={{width:"60px"}}><span title={result}>{result}</span></p>)
        },
    }, {
        title: '审批意见',
        dataIndex: 'remarks',
        key: 'remarks',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"180px"}}><span title={text}>{text}</span></p>)
        },
    }];

    //发票信息
    columns_5 = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },{
            title: '发票类型',
            dataIndex: 'invTypeStr',
            key: 'invTypeStr',
            render: (text, record, index) => {
                return(<p><span>{text}</span></p>)
            },
        },{
        title: '发票号',
        dataIndex: 'invNo',
        key: 'invNo',
        width: 100,
        render: (text, record, index) => (
            <p>
                <span title={text}>{text}</span>
            </p>
        ),
    },{
        title: '发票代码',
        dataIndex: 'invCode',
        key: 'invCode',
        width: 120,
        render: (text, record, index) => (
            <p>
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '开票日期',
        dataIndex: 'openInvoiceTime',
        key: 'openInvoiceTime',
        width: 100,
        render: (text, record, index) => (
            <p>
               {text == null ? "-" : moment(text).format("YYYY/MM/DD")}
            </p>
        ),
    }, {
        title: '税率',
        dataIndex: 'taxRates',
        key: 'taxRates',
        width: 80,
        render: (text, record, index) => {
            return(<p>
                {text ? (text * 100 ) + '%' : 0 == text ? '0%' : '-'}</p>)
        },
    },{
        title: '税额',
        dataIndex: 'tax',
        key: 'tax',
        render: (text, record, index) => {
            if(text != null){
                return <p>￥<NumberFormat value={text}/></p>
            }else{
                return <p>-</p>
            }
        }
    },{
        title: '金额',
        dataIndex: 'invoiceAmount',
        key: 'invoiceAmount',
        width: 100,
        render: (text, record, index) => {
            if(text != null){
                return <p>￥<NumberFormat value={text}/></p>
            }else{
                return <p>-</p>
            }
        },
    }, {
        title: '税价合计',
        dataIndex: 'totalTax',
        key: 'totalTax',
        width: 100,
        render: (text, record, index) => {
            return(<p style={{width:"100px"}}>￥<NumberFormat value={text}/></p>)
        },
    }, {
        title: '操作',
        dataIndex: '',
        key: '',
        width: 100,
        render: (text, record, index) => (
            <p>
                <span><a onClick={() => {this.passChange('invoice',record)}}>查看详情</a></span>
            </p>
        ),
    }];

    //线下审批
    columns_examiningOffline = [{
        title: '审批次序',
        dataIndex: 'orderBy',
        key: 'orderBy',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"60px"}}><span title={this.orderByArr[index+1]+"级审批"}>{this.orderByArr[index+1]+"级审批"}</span></p>)
        },
    }, {
        title: '审批人',
        dataIndex: 'userName',
        key: 'userName',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"180px"}}><span title={text}>{text}</span></p>)
        },
    }, {
        title: '审批时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"140px"}}><span title={text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}</span></p>)
        },
    }, {
        title: '审批状态',
        dataIndex: 'result',
        key: 'result',
        width:200,
        render: (text, record, index) => {
            //线下审批状态标识（1-通过；2-不通过;）
            let result = "";
            if(text==1){
                result = "通过"
            }else if(text==2){
                result = "不通过"
            }
            return(<p className="orderDetailTableColumnWidth" style={{width:"60px"}}><span title={result}>{result}</span></p>)
        },
    }, {
        title: '审批意见',
        dataIndex: 'approvalReason',
        key: 'approvalReason',
        width:200,
        render: (text, record, index) => {
            return(<p className="orderDetailTableColumnWidth" style={{width:"180px"}}><span title={text}>{text}</span></p>)
        },
    }];
    columns_4= [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
    }, {
        title: '下单人',
        dataIndex: 'createUserName',
        key: 'createUserName',
        render: (text, record, index) => (
            <p>
                <span title={text}>{text}&nbsp;&nbsp;{record.userNo}</span>
            </p>
        ),
        
    },{
        title: '下单日期',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => (
            <p>
                <span title={text?moment(text).format("YYYY/MM/DD HH:mm:ss"):""}>{text?moment(text).format("YYYY/MM/DD HH:mm:ss"):""}</span>
            </p>
        ),
    },{
        title: '订单金额',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: (text, record, index) => (
            <p>
                <span title={text}><NumberFormat value={text} /></span>
            </p>
        ),
    },{
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
            let type = ''
                        let color = ''
                        switch (text) {
                            case 10:
                                type = '待确认'
                                color = '#FA9B13'
                                break;
                            case 20:
                                type = '审核中'//待审核
                                color = '#32C5FF';
                                break;
                            case 23:
                                type = '待确认'//审核驳回
                                color = '#FA9B13';
                                break;
                            case 30:
                                type = '未发货'
                                color = '#FA9B13'
                                break;
                            case 40:
                                type = '待收货'
                                color = '#FA9B13';
                                break;
                            case 50:
                                type = '质保中'
                                color = '#32C5FF'
                                break;
                            case 70:
                                type = '已完成'
                                color = '#6DD400'
                                break;
                            case 100:
                                type = '作废失效'
                                color = '#E02020'
                                break;
                        }

                        return (
                            <p className="tableColumnWidth" style={{ width: '100px' }}>
                                <span style={{ color: color }} title={type}>
                                    {type}
                                </span>
                            </p>
                        );
        },
    },{
            title: '操作',
            dataIndex: 'operators',
            key: 'operators',
            render: (text, record, index) => (
                <p>
                    <a target='_blank' href={systemConfigPath.jumpPage(`/platInvoice/orderDetailNew?state=1&uuids=${record.uuids}`)}>查看订单</a>
                </p>
            ),
        },
    ];

    //结算记录
    columns_6 = [{
        title: '序号',
        dataIndex: 'a',
        key: 'a',
    }, {
        title: '类型',
        dataIndex: 'b',
        key: 'b',
    }, {
        title: '事件',
        dataIndex: 'c',
        key: 'c',
    }, {
        title: '结算单号',
        dataIndex: 'd',
        key: 'd',
    }, {
        title: '出入金类型',
        dataIndex: 'e',
        key: 'e',
    }, {
        title: '金额',
        dataIndex: 'f',
        key: 'f',
    }, {
        title: '时间',
        dataIndex: 'g',
        key: 'g',
    }];

    //订单日志
    columns_7 = [{
        title: '序号',
        dataIndex: 'a',
        key: 'a',
        render: (text, record, index) => (
            <span>
                {index+1}
            </span>
        ),
    },  {
        title: '操作人',
        dataIndex: 'logUserName',
        key: 'logUserName',
        render:(text,record)=>(
            <div>
                <p>{text}</p>
                <p>{record.userNo}</p>
            </div>
        )
    }, {
        title: '时间',
        dataIndex: 'dealTime',
        key: 'dealTime',
        render: (text, record) => (
            <div>
                {text?moment(text).format("YYYY/MM/DD HH:mm:ss"):""}
            </div>
        ),
    },{
        title: '事件',
        dataIndex: 'content',
        key: 'content',
    },];

    render() {
        let url = (this.state.dataSource.orderDeliveryVo?this.state.dataSource.orderDeliveryVo.signPath:'')
        let arr =[];
        let orderFileVoList= this.state.dataSource.orderFileVoList;
        let tabShowState = this.state.dataSource.tabShowState?this.state.dataSource.tabShowState:{};
        if(tabShowState.orderGoods){//商品信息:订单改价时替换为父组件传参
            let t1 =
                <TabPane tab="商品信息" key="1">
                    <Table columns={this.columns_1} dataSource={this.state.dataSource.orderGoods} pagination={false} scroll={{ x: 976 }}/>
                    {this.showEcOrderChangePrice(this.state.dataSource)}
                </TabPane>;
            if(this.props.t1!=null){//商品改价调用
                arr.push(<TabPane tab="商品信息" key="1">{this.props.t1}{this.showEcOrderChangePrice(this.state.dataSource)}</TabPane>);
            }else{
                arr.push(t1);
            }
        }
        // if(tabShowState.ecApprovalFlowPlus){//审批信息
        let t3 = null;
        if(this.state.dataSource.approvalType&&this.state.dataSource.approvalType == 2){//线上
            let mode = this.state.dataSource.ecApprovalFlowPlus.mode;
            let modeStr = "";
            if(mode == 1){
                modeStr = "依次审批";
            }else if(mode == 2){
                modeStr = "会签";
            }else if(mode == 3){
                modeStr = "或签";
            }
            t3 =
                <TabPane tab="审批信息" key="3" disabled={!tabShowState.ecApprovalFlowPlus}>
                    <Form horizontal >
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="审批方式">
                                    线上审批
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="审批方式">
                                    {modeStr}
                                </BaseDetails>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="审批模板">
                                    {this.state.dataSource.ecApprovalFlowPlus.tempName}
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="审批金额">
                                    <p className="ant-form-text">{this.state.dataSource.ecApprovalFlowPlus.lowQuota}<em> - </em>{this.state.dataSource.ecApprovalFlowPlus.highQuota}<em>元</em></p>
                                </BaseDetails>
                            </Col>
                        </Row>
                    </Form>
                    <Table columns={this.columns_3} dataSource={this.state.dataSource.ecApprovalFlowPlus.approvalList} pagination={false}/>
                </TabPane>;
        }else{//线下
            t3 =
                <TabPane tab="审批信息" key="3" disabled={!tabShowState.ecApprovalFlowPlus}>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="审批方式">
                                <p className="ant-form-text">线下审批</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={24} className="ant-form-item-margin-bottom">
                            <BaseDetails title="审批附件">
                                {/* <p className="ant-form-text"><a href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.approvalFile)} target="_blank">{this.state.dataSource.approvalFileName}</a></p> */}
                                {orderFileVoList && orderFileVoList != [] ? orderFileVoList.map((item,index)=>{
                                            let url = item.fileUrl + "?filename=" + item.fileName;
                                    return <p className="ant-form-text"><a target="_blank" download={item.fileName} href={SystemConfig.systemConfigPath.dfsPathUrl(url)}>{item.fileName}</a></p>
                                }):'未上传附件'}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Table columns={this.columns_examiningOffline} dataSource={this.state.dataSource.ecApprovalLogList} pagination={false}/>
                </TabPane>;
        }
        arr.push(t3);
    // }

    if(1 == this.state.dataSource.subFlag || 1 == this.state.dataSource.divFlag){
        let t9 = <TabPane tab="关联订单" key="9"><Table columns={this.columns_4} dataSource={this.state.relationOrderInfo} pagination={false} scroll={{ x: 976 }} /></TabPane>;
        arr.push(t9);
    }else{
        let t9 = <TabPane tab="关联订单" key="9" disabled></TabPane>;
        arr.push(t9);
    }

        
        // if(tabShowState.ecOrderDeliveryItem){//收货信息
            let t2 = <TabPane tab="收货信息" key="2" disabled={!tabShowState.ecOrderDeliveryItem}>
                {/* {this.showEcDeliveryOrderRel()} */}
                <Row>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="收货人">
                                <p className="ant-form-text">{this.state.dataSource.orderDeliveryVo ? this.state.dataSource.orderDeliveryVo.consignee :''}</p>
                            </BaseDetails>
                        </Col>

                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="签收单">
                            <p className="ant-form-text"><a target="_blank" download={this.state.dataSource.orderDeliveryVo ? this.state.dataSource.orderDeliveryVo.signName :''} href={SystemConfig.systemConfigPath.dfsPathUrl(url)}>{this.state.dataSource.orderDeliveryVo ? this.state.dataSource.orderDeliveryVo.signName:''}</a></p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="备注信息">
                            <p className="ant-form-text">{this.state.dataSource.orderDeliveryVo ? this.state.dataSource.orderDeliveryVo.consigneeRemark:''}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                <Table columns={this.columns_2} dataSource={this.state.dataSource.ecOrderDeliveryItem} pagination={false} scroll={{ x: 976 }} />
                </TabPane>;
/*
            let t2 = <TabPane tab="收货信息" key="2"><Table columns={this.columns_2} dataSource={this.state.dataSource.ecOrderDeliveryItem} pagination={false} scroll={{ x: 976 }}/></TabPane>;
*/
            arr.push(t2);
        // }
        
        // if(tabShowState.ecExpressOrderRel){//物流信息
            let t4 = <TabPane tab="物流信息" key="4" disabled={!tabShowState.ecExpressOrderRel}>{this.showEcExpressOrderRel(this.state.dataSource.ecExpressOrderRel)}</TabPane>;
            arr.push(t4);
        // }
        // if(tabShowState.ecInvoice){//发票信息
            let t5 = <TabPane tab="发票信息" key="5" disabled={!tabShowState.ecInvoice}>
                {/* {this.showEcInvoice(this.state.dataSource.ecInvoice)} */}
                <Table columns={this.columns_5} dataSource={this.state.dataSource.ecInvoice} pagination={false} scroll={{ x: 976 }} />
                </TabPane>;
            arr.push(t5);
        // }
        // if(tabShowState.tabSix){//结算记录
        if(this.state.dataSource.oldFlag != 3){
            let t6 = <TabPane tab="结算记录" key="6" disabled={!tabShowState.tabSix}><Table columns={this.columns_6} dataSource={this.data} pagination={false}/></TabPane>;
            arr.push(t6);
        }

        let t8 = <TabPane tab="订单合同" key="8" disabled={!tabShowState.orderContract}><OrderContractTab uuids={this.state.dataSource.uuids} /></TabPane>;
        arr.push(t8);
            
        // }
        // if(tabShowState.sysOperLogList){//订单日志
            let t7 = <TabPane tab="订单日志" key="7" disabled={!tabShowState.sysOperLogList}><Table columns={this.columns_7} dataSource={this.state.dataSource.orderLogs} pagination={false}/></TabPane>;
            arr.push(t7);
        // }
        
        return (
            <div className="orderDetail">
                <OrderAllBaseForDetailNew enableChildrenList={this.props.enableChildrenList} data={this.state.dataSource} refresh={this.refresh}/>
                <Card bordered={false} className="mb10">
                    <Tabs>
                        {arr}
                    </Tabs>
                </Card>
                <BaseAffix>
                    <Button type="primary" style={{marginRight: "10px"}} onClick={this.handleCancel}>{getQueryString('goBackUrl')?"返回":"关闭"}</Button>
                </BaseAffix>
                <CheckSettleModal
                show={this.state.passVisible}
                close={this.closeModal}
                invoiceData={this.state.invoiceData}
               >
                
        </CheckSettleModal>
            </div>
        )
        
    }
}

export default OrderDetail