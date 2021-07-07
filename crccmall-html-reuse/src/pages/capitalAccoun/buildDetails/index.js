import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Modal, Button, Icon, Spin ,Card, message, Tag, Alert} from 'antd';
const confirm = Modal.confirm;
import { baseService } from '@/utils/common';
import less from './index.less';
import BaseTable from "components/baseTable";
import BuildList from "./bulidList";
//保证金状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;
export default class BuildDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bondData: {},
            detailVisible: false,//确定
            formList:[],
            selectData:[{
                id:"001",
                value:'用户1'
            }],
            radio:[{
                id:"001",
                value:"确认无误"
            },{
                id:"002",
                value:"信息有误，驳回"
            }],
            loading:false,
            account:true,//付款
            buildList:[],
            fileList:[],
            buildStatus:1,
            listLength:0
        }

    }
    config = {
        span: [5, 15],
        codeTime: 60,
    }
    columns = [
        {
            title: '物料名称',
            dataIndex: 'code',
            key: 'code',
            width: 150,
        }
        ,{
            title: '规格',
            dataIndex: 'Specifications',
            key: 'Specifications',
            width: 150,
        },{
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
            width: 100
        },{
            title: '物料描述',
            dataIndex: 'Material',
            key: 'Material',
            width: 100
        },{
            title: '采购数量',
            dataIndex: 'disposer',
            key: 'disposer',
            width: 100
        },{
            title: '金额/单价',
            dataIndex: 'Purchase',
            key: 'Purchase',
            width: 100
        },{
            title: '税额',
            dataIndex: 'disposer',
            key: 'disposer',
            width: 100
        },{
            title: '单位价格',
            dataIndex: 'taxamount',
            key: 'taxamount',
            width: 100
        },{
            title: '税价合计',
            dataIndex: 'totalprice',
            key: 'totalprice',
            width: 100
        },{
            title: '附件',
            dataIndex: 'enclosure',
            key: 'enclosure',
            width: 100
        }
    ]

    componentWillMount() {
        this.handleInit();
        this.setState({
            formList: [
                {
                    type: 'PHONECODE',
                    phoneCode:true,
                    field: 'bidInvitingName',
                    label: '输入手机验证码:',
                    placeholder: '输入手机验证码',
                    rules:[{
                        required: true,
                        message: '输入手机验证码'
                    }],
                },
                {
                    type: 'INPUT',
                    inputType:"textarea",
                    field: 'seySom',
                    label: '付款说明:',
                    placeholder: '请输入',

                }

            ]
            ,
            buildList:[
                {
                    buildNum:"123456",
                    djMain:"sdasda",
                    time:"1213",
                    thr:'1331',
                    id:1,
                    file:this.state.radio.map(v=>{
                        return {
                            value: v.value
                        }
                    }),
                    mack:"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一",
                    allTon:"999999",
                    couTon:"22",
                    filanTon:"123131"
                },
                {
                    buildNum:"123456",
                    djMain:"sdasda",
                    time:"1213",
                    thr:'1331',
                    id:2,
                    file:this.state.radio.map(v=>{
                        return {
                            value: v.value
                        }
                    }),
                    mack:"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一",
                    allTon:"999999",
                    couTon:"22",
                    filanTon:"123131"
                },
                {
                    buildNum:"123456",
                    djMain:"sdasda",
                    time:"1213",
                    thr:'1331',
                    id:3,
                    file:this.state.radio.map(v=>{
                        return {
                            value: v.value
                        }
                    }),
                    mack:"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一",
                    allTon:"999999",
                    couTon:"22",
                    filanTon:"123131"
                },
                {
                    buildNum:"123456",
                    djMain:"sdasda",
                    time:"1213",
                    thr:'1331',
                    id:4,
                    file:this.state.radio.map(v=>{
                        return {
                            value: v.value
                        }
                    }),
                    mack:"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一",
                    allTon:"999999",
                    couTon:"22",
                    filanTon:"123131"
                },,
                {
                    buildNum:"123456",
                    djMain:"sdasda",
                    time:"1213",
                    thr:'1331',
                    id:5,
                    file:this.state.radio.map(v=>{
                        return {
                            value: v.value
                        }
                    }),
                    mack:"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一",
                    allTon:"999999",
                    couTon:"22",
                    filanTon:"123131"
                },
                {
                    buildNum:"123456",
                    djMain:"sdasda",
                    time:"1213",
                    thr:'1331',
                    id:2,
                    file:this.state.radio.map(v=>{
                        return {
                            value: v.value
                        }
                    }),
                    mack:"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一",
                    allTon:"999999",
                    couTon:"22",
                    filanTon:"123131"
                }
            ]
        })


    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        if (this.props.uuids != nextProps.uuids) {
            this.getBondData(nextProps.uuids)
        }
    }

    //初始
    handleInit = () => {
        this.getBondData()
    }
    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.tabStatus = null
            // this.setState({
            //     defaultKey: null
            // })
            this.reloadTableData();
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
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    //获取数据
    getBondData = (id) => {
        let uuids = id || this.props.uuids;
        if (!uuids) return;
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/bondDeal/info', {
            uuids: uuids
        }).then(res => {
            if (res.data) {
                this.setState({
                    bondData: res.data,
                    spinning: false
                })
            } else {
                this.setState({
                    bondData: {}
                })
            }
        }, error => {
            this.setState({
                bondData: {}
            })
            Util.alert(error.msg, { type: 'error' })
        })
    }

    showConfirm=()=>{
        confirm({
            title: '汇款/转账？',
            content: '确认使用汇款/转账的付款方式，前往打印支付信息',
            onOk() {
            },
            onCancel() {
            },
        });
    };
    handleSubmit=()=>{

        const { bidInvitingName }=this.refs.BaseForm.getFieldsValue();
        if(bidInvitingName==undefined || bidInvitingName==''){
            message.error('请填写手机验证码');
        }else{
            message.success("提交成功");
            this.setState({
                detailVisible: false
            });
            console.log(this.refs.BaseForm.getFieldsValue());
            this.refs.BaseForm.resetFields()
        }

    }

    hideModal=()=> {
        this.setState({
            detailVisible: false
        })

    }

    //基本信息
    createBaseInfo = () => {
        const { bondData } = this.state;
        const { span } = this.config;
        const { bondDeal = {} } = this.state.bondData;
        const formItemLayout = {
            labelCol: { span: 7},
            wrapperCol: { span: 13 },
        };
        const formItemMoney = {
            labelCol: { span: 6 },
            wrapperCol: { span: 3 },
        };
        let statusStyle = {};
        if (bondData.status) {
            statusStyle = _MAINBIDOBJ[bondData.status].style;
        }
        return (
            <div>
                <Card className="mb10" bordered={false}>
                    <Row className={less.title}>
                        <Col span={20}>
                            <p className={less.title_text} style={{ wordBreak: 'break-all' }}>结算单单号：3214563854365656454</p>
                        </Col>
                    </Row>
                    <div className={less.flex}>
                        <div className={less.topMesage}>

                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>支付单创建时间：</Col>
                                <Col className="reuse_value" span={span[1]}>1234567890123456789</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>销售单位：</Col>
                                <Col className="reuse_value" span={span[1]}>2021-11-01 14:24:20</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>采购单位：</Col>
                                <Col className="reuse_value" span={span[1]}>2021-01-20 15:25:23</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>付款申请人：</Col>
                                <Col className="reuse_value" span={span[1]}>费县利君板材厂</Col>
                            </Row>
                        </div>
                        <div className={less.rightspan}>
                            <Row className="reuse_row">
                                <Col span={6} style={{borderRight:"1px dashed black",marginRight:"10px"}}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>业务类型</p>
                                        <Tag closable color="blue" closable={false}>保证金</Tag>
                                    </div>
                                </Col>
                                <Col span={13}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>支付金额</p>
                                        <p className={less.colorred}>1,999,999.99 元</p>
                                        <p className={less.main}>柒仟捌佰元整</p>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Card>
                <Card style={{borderColor:"red",backgroundColor:"#FFF1F0"}}>
                    提示：<br/>
                    转账时，请务必在“用途/附言/摘要/备注”处仅填写付款识别码，如填写错误或包含除识别码外其他内容将导致付款失败！<br/>
                    识别码：
                    <span style={{fontSize:"20px",color:"#E02020"}}>“保证金ASDF12545”</span>
                </Card>
                <div className="reuse_baseTitle"></div>

                <Card className="mb20" bordered={false} title="收款人账户信息" style={{backgroundColor:"#FFF6E1"}}>
                    <div className={less.autoposi} >
                        <Row className="reuse_row" style={{padding:"0px",height:"41px"}}>
                            <Col className="reuse_value" className={`${less.linhcenter}`} span={3} style={{backgroundColor:"#E6F2FF"}}>银行户名</Col>
                            <Col className="reuse_value" span={18} className={`${less.linhcenter}`}>平安银行电子商务交易资金待清算专户（铁建商城）</Col>
                            <Col className="reuse_value"span={3} className={`${less.linhcenter}`} style={{color:"red"}}>必填信息</Col>
                        </Row>
                        <Row className="reuse_row" style={{padding:"0px",height:"41px"}}>
                            <Col className="reuse_value" className={`${less.linhcenter}`} span={3} style={{backgroundColor:"#E6F2FF"}}>银行账号</Col>
                            <Col className="reuse_value" span={18} className={`${less.linhcenter}`}>15000091380762</Col>
                            <Col className="reuse_value"span={3} className={`${less.linhcenter}`} style={{color:"red"}}>必填信息</Col>
                        </Row>
                        <Row className="reuse_row" style={{padding:"0px",height:"41px"}}>
                            <Col className="reuse_value" className={`${less.linhcenter}`} span={3} style={{backgroundColor:"#E6F2FF"}}>收款银行</Col>
                            <Col className="reuse_value" span={18} className={`${less.linhcenter}`}>平安银行电子商务交易资金待清算专户（铁建商城）</Col>
                            <Col className="reuse_value"span={3} className={`${less.linhcenter}`} style={{color:"red"}}>必填信息</Col>
                        </Row>
                        <Row className="reuse_row" style={{padding:"0px",height:"41px"}}>
                            <Col className="reuse_value" className={`${less.linhcenter}`} span={3} style={{backgroundColor:"#E6F2FF"}}>开户地</Col>
                            <Col className="reuse_value" span={18} className={`${less.linhcenter}`}>天津市</Col>
                            <Col className="reuse_value"span={3} className={`${less.linhcenter}`} style={{color:"red"}}>必填信息</Col>
                        </Row>
                        <Row className="reuse_row" style={{padding:"0px",height:"41px"}}>
                            <Col className="reuse_value" className={`${less.linhcenter}`} span={3} style={{backgroundColor:"#E6F2FF"}}>支行</Col>
                            <Col className="reuse_value" span={18} className={`${less.linhcenter}`}>平安银行股份有限公司天津分行营业部</Col>
                            <Col className="reuse_value"span={3} className={`${less.linhcenter}`} style={{color:"red"}}>必填信息</Col>
                        </Row>
                        <Row className="reuse_row" style={{padding:"0px",height:"41px"}}>
                            <Col className="reuse_value" className={`${less.linhcenter}`} span={3} style={{backgroundColor:"#E6F2FF"}}>识别码</Col>
                            <Col className="reuse_value" span={18} className={`${less.linhcenter}`} style={{color:"red",fontWeight:"bold"}}>59844324</Col>
                            <Col className="reuse_value"span={3} className={`${less.linhcenter}`} style={{color:"red"}}>必填信息</Col>
                        </Row>
                        <Row className="reuse_row" style={{padding:"0px",height:"41px"}}>
                            <Col className="reuse_value" className={`${less.linhcenter}`} span={3} style={{backgroundColor:"#E6F2FF"}}>银联号</Col>
                            <Col className="reuse_value" span={18} className={`${less.linhcenter}`}>307110004315</Col>
                            <Col className="reuse_value"span={3} className={`${less.linhcenter}`} style={{color:"red"}}>必填信息</Col>
                        </Row>
                    </div>
                    <div className={less.autoposi} style={{backgroundColor:"transparent"}}>
                        *该订单供应商信息为：线上供应商测试公司一，平安网银子账号为：TJ281503008948363264，如有供应商向您询问可为其提供查询使用。
                    </div>

                </Card>
                <Card className="mb20" bordered={false} title="标的物明细">
                    <BaseTable
                        scroll={{ x: 1900 }}
                        url='@/reuse/saleScene/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={true}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
                <Card  className="mb20" bordered={false}>
                    <div className={less.wid40}>
                        <div className={less.disleft}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="10">处置/计价方式</Col>
                                <Col className={less.colorbottred} span="10">按重量计价</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="8">单位价格</Col>
                                <Col className={less.colorbottred} span="12">1234.99元/吨</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="8">提货量净重</Col>
                                <Col className={less.colorbottred} span="12">0.12吨</Col>
                            </Row>
                        </div>
                        <div className={less.disleft}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="10">税额（9%）</Col>
                                <Col className={less.colorbottred} span="10">¥1234.00</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">金额</Col>
                                <Col className={less.colorbottred} span="15">¥12345678.00</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="12">扣量金额(0.7%)</Col>
                                <Col className={less.colorbottred} span="10">-¥1234.00</Col>
                            </Row>
                        </div>
                    </div>
                    <Row className={less.wid50}>
                        <Col className={less.fonts20} span="8">税价合计:</Col>
                        <Col className={less.fontsred20} span="12">¥0</Col>
                    </Row>
                </Card>
                <Card className={less.mb100} bordered={false} title="竞价单信息 ">
                    <Row className="reuse_row">
                        <Col className="reuse_label" span={3}>竞价单名称</Col>
                        <Col className="reuse_value" span={span[1]}>一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十</Col>
                    </Row>
                    <Row className="reuse_row">
                        <Col className="reuse_label"  span={3}>销售单位</Col>
                        <Col className="reuse_value" span={span[1]}>北京地铁局</Col>
                    </Row>
                    <Row className="reuse_row">
                        <Col className="reuse_label"  span={3}>销售部门</Col>
                        <Col className="reuse_value" span={span[1]}>北京地铁二十五号线北京至西伯利亚段</Col>
                    </Row>

                    <Row className="reuse_row">
                        <Col className="reuse_label"  span={3}>竞价单号</Col>
                        <Col className="reuse_value" span={span[1]}>854854854854</Col>
                    </Row>
                    <Row className="reuse_row">
                        <Col className="reuse_label"  span={3}>竞价开始日期 </Col>
                        <Col className="reuse_value" span={span[1]}>2020/12/12    12:12:12</Col>
                    </Row>
                    <Row className="reuse_row">
                        <Col className="reuse_label"  span={3}>竞价结束日期 </Col>
                        <Col className="reuse_value" span={span[1]}>2020/12/12    12:12:12</Col>
                    </Row>
                </Card>


                <Card className={less.mb100} bordered={false}>
                    <Row className={less.title}>
                        <Col span={20}>
                            <p className={less.title_text} style={{ wordBreak: 'break-all' }}>结算单单号：3214563854365656454</p>
                        </Col>
                    </Row>
                    <div className={less.flex}>
                        <div className={less.topMesage}>

                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>订单来源</Col>
                                <Col className="reuse_value" span={span[1]}>
                                    竞价交易<a href={"javascript:;"} className={less.textcolor}>1234567890123456789</a>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>订单类型</Col>
                                <Col className="reuse_value" span={span[1]}>2021-11-01 14:24:20</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>创建日期</Col>
                                <Col className="reuse_value" span={span[1]}>2021-01-20 15:25:23</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>销售单位</Col>
                                <Col className="reuse_value" span={span[1]}>费县利君板材厂</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>销售部门</Col>
                                <Col className="reuse_value" span={span[1]}>费县利君板材厂</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>销方联系人</Col>
                                <Col className="reuse_value" span={span[1]}>费县利君板材厂</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>买受人</Col>
                                <Col className="reuse_value" span={span[1]}>
                                    北京地铁局<a href={"javascript:;"} className={less.textcolor}>查看企业详细信息</a>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>买方联系人</Col>
                                <Col className="reuse_value" span={span[1]}>费县利君板材厂</Col>
                            </Row>
                            <div className={less.borderbottom}></div>

                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>货品所在地</Col>
                                <Col className="reuse_value" span={span[1]}>北京市 东城区</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>提货期限</Col>
                                <Col className="reuse_value" span={span[1]}>2020/12/12前</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>付款方式</Col>
                                <Col className="reuse_value" span={span[1]}>无要求</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>付款时间</Col>
                                <Col className="reuse_value" span={span[1]}>成交后 1天内</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>税率</Col>
                                <Col className="reuse_value" span={span[1]}>含税 1%</Col>
                            </Row>
                        </div>
                        <div className={less.rightspan}>
                            <Row className="reuse_row">
                                <Col span={13}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>支付金额</p>
                                        <p className={less.colorred}>1,999,999.99 元</p>
                                        <p className={less.main} style={statusStyle}>储蓄金额合计</p>
                                        <p className={less.colorred}>1,999,999.99 元</p>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Card>
                {/*<Card className={less.mb100} bordered={false}>*/}
                    <BuildList buildList={this.state.buildList} listLength={this.state.buildList.length}/>
                {/*</Card>*/}
                <Card className="fixed_button">
                    <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                        <Button  type="primary" onClick={this.props.callBack}>关闭</Button>
                        <Button type="primary" onClick={this.showConfirm}>下载PDF</Button>
                    </div>
                </Card>

            </div>
        )
    }

    //过滤保证金缴纳方式
    filterBondType = (text) => {
        let arr = [];
        if (text) {
            let textArr = text.split(',');
            baseService.bondTypeGroup.forEach(v => {
                if (textArr.indexOf(v.id) !== -1) {
                    arr.push(v.value)
                }
            })
        }
        return arr.join(',')
    }

    render() {
        const { bondDealList = [] } = this.state.bondData;

        return (
            <div className={less.bondDetail}>
                <Spin spinning={this.state.spinning}>
                    <div className={less.card}>{this.createBaseInfo()}</div>
                </Spin>
            </div>
        )
    }
}
