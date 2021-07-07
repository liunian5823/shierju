import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin,Card ,Popconfirm,message,Radio,Alert} from 'antd';

import BaseForm from '@/components/baseForm';
import NewFrom from '@/components/newForm';
import { closeWin } from '@/utils/dom';
import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './index.less';
import FormatDate from "@/utils/date";
import download from "business/isViewDown";
import NewForm from "components/newForm";
import AuthButton from "components/authButton";
import BaseTabs from "components/baseTabs";

//出入金明细
const _BID = baseService.CashDetail;
const _MAINBIDOBJ = baseService._saleMainBid_obj;
export default class AccountDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultKey: sessionStorage.SaleSceneStatus || "1",
            spinning: false,
            bondData: {},
            detailVisible: false,//确定
            formList:[],
            alertList:[],
            selectData:[{
                id:"001",
                value:'用户1'
            }],
            radio:[{
                id:"001",
                value:"平安银行"
            },{
                id:"002",
                value:"其他银行"
            }],
            time:60,
            btnDisable:false,
            btnContent: '发送验证码',
            rest:false,
            loading:false,
            isShow:false,
            isAutoHeight:true,
            btnShow:true
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

        //模拟接口请求
        this.setState({//等同于 下面请求接口成功的this.setState
            bondData:{
                "workOrder":"12345678901234567",
                "biddingList":"12345678901234567",
                "thisWeek":"682",
                "thisMont":"682",
                "approvalStatusStr":"待提货",
                "disposerType":"成员单位",
                "disposerName":"中国铁建电气化局集团第三十五局北方工程有限公司",
                "disposerComName":"中国铁建电气化局集团第三十五局北方工程有限公司",
                "creditCode":"48621452145214521452",
                "disposerHumn":"张三 188 8888 8888",
                "forfeitureReason":"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三",
                "enclosure":[
                    {
                        "businessId":"350429657306652672",
                        "createTime":null,
                        "createUserId":null,
                        "delFlag":null,
                        "fileName":"1234567890123456789",
                        "filePath":"group1/M00/00/D9/wKhCZmC9ex2Ab0xWAAI93eqnJbM740.jpg?filename=营业执照样例.jpg",
                        "fileSuf":"jpg",
                        "id":null,
                        "page":1,
                        "pageSize":10,
                        "type":1,
                        "updateTime":null,
                        "updateUserId":null,
                        "uuids":"350429657346498560"
                    },{
                        "businessId":"350429657306652672",
                        "createTime":null,
                        "createUserId":null,
                        "delFlag":null,
                        "fileName":"1234567890123456789",
                        "filePath":"group1/M00/00/D9/wKhCZmC9ex2Ab0xWAAI93eqnJbM740.jpg?filename=营业执照样例.jpg",
                        "fileSuf":"jpg",
                        "id":null,
                        "page":1,
                        "pageSize":10,
                        "type":1,
                        "updateTime":null,
                        "updateUserId":null,
                        "uuids":"350429657346498560"
                    }
                ],
                "buyerType": "非成员单位",
                "disposerBuyerType": "阜城县瑞亨建筑工程有限公司",
                "disposerCode": "48621452145214521452",
                "buyerHumn": "48621452145214521452",
                "mask": "一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三",
                "Acceptor": "4862145214",
                "acceptorTime": "4862145214",
                "handleTime": "4862145214",
                "handleResult": "4862145214",
                "handlePrice": "4862145214",
                "enclosureFile": "4862145214",
                "remask": "4862145214",
                "registrant":'王某 134 3456 2345',
                "registrantTime":'王某 134 3456 2345',
                "shipper":'李四 188 88888888',
                "remark":'一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一',
            },
            spinning: false
        })
        // let uuids = id |
        // let uuids = id || this.props.uuids;
        // if (!uuids) return;
        // this.setState({
        //     spinning: true
        // })
        // api.ajax('GET', '@/reuse/bondDeal/info', {
        //     uuids: uuids
        // }).then(res => {
        //     if (res.data) {
        //         this.setState({
        //             bondData: res.data,
        //             spinning: false
        //         })
        //     } else {
        //         this.setState({
        //             bondData: {}
        //         })
        //     }
        // }, error => {
        //     this.setState({
        //         bondData: {}
        //     })
        //     Util.alert(error.msg, { type: 'error' })
        // })
    }
    //确定
    handleToClick = (e) => {
        e.preventDefault();
        this.refs.BaseForm.validateFields((errors, values) => {
            if (errors) {
                console.log(errors);
            }else {
                this.setState({
                    detailVisible: true
                })
                console.log(values);
            }
        });


    }
    // 释放确定

    hideModal=()=> {
        this.setState({
            detailVisible: false
        })

    };
    handleCash=(e)=>{
        e.preventDefault();
        this.refs.AlertForm.validateFields((errors, values) => {
            if (errors) {
                console.log(errors);
            }else {
                this.setState({
                    detailVisible: false
                })
                console.log(values);
            }
        });

    };
    handleSubmit=()=>{
        console.log(this.refs.BaseForm.getFieldsValue())
        this.refs.BaseForm.resetFields()
    }
    //tab切换tableData
    tabChange = (prop) => {
        this.setState({
            defaultKey: prop === '0' ? null : prop
        })
        this.baseParams.tabStatus = prop === '0' ? null : prop;
        this.reloadTableData()
    };
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    };
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
        console.log(1)
    };
    toBack=()=>{
        this.props.history.push('/capitalAccoun/account')
    }
    componentWillMount() {
        this.handleInit();
        this.setState({
            formList: [
                {
                    type: 'INPUT',
                    field: 'bidName',
                    label: '账户名称：',
                    placeholder: '',
                    initialValue:'中国铁建电气化局集团第三十五局铁路第十段建筑项目中段',
                    disabled:true,
                    span:12,
                    rules:[{
                        required: true,
                        message: '请选择确认结果'
                    }]
                },
                {
                    type: 'INPUT',
                    field: 'bidNumber',
                    label: '营业执照号：',
                    placeholder: '',
                    initialValue:"123456780121321",
                    disabled:true,
                    span:8,
                    rules:[{
                        required: true,
                        message: '请选择确认结果'
                    }]
                },
                {
                    type: 'INPUT',
                    field: 'publicNumber',
                    label: '对公银行帐号：',
                    placeholder: '请输入对公银行账号',
                    span:8,
                    rules:[{
                        required: true,
                        message: '请选择确认结果'
                    }]
                },
                {
                    type: 'INPUT',
                    field: 'authenticationPhome',
                    label: '鉴权验证手机号：',
                    placeholder: '',
                    initialValue:"153 1234 1223",
                    disabled:true,
                    extra:"*本手机号用于接收银行账单及绑卡、转账提现短信验证码。如需更改请使用上方修改银行预留手机号功能修改。" ,
                    span:8,
                    rules:[{
                        required: true,
                        message: '请选择确认结果'
                    }]
                },
                {
                    type: 'INPUT',
                    field: 'legalName',
                    label: '法人代表姓名:',
                    placeholder: '王大壮',
                    initialValue:"王大壮",
                    span:8,
                    rules:[{
                        required: true,
                        message: '请选择确认结果'
                    }]
                },
                {
                    type: 'INPUT',
                    field: 'legalUserCard',
                    label: '法人代表身份证：',
                    placeholder: '130633***48',
                    initialValue:"130633***48",
                    span:8,
                    rules:[{
                        required: true,
                        message: '请选择确认结果'
                    }]

                },
                {
                    type: 'RADIO',
                    field: 'SalesType',
                    label:"所属银行:",
                    span:8,
                    list:this.state.radio.map(v => {
                        return {
                            id: v.id,
                            value: v.value
                        }
                    }),
                    rules:[{
                        required: true,
                        message: '请选择确认结果'
                    }]
                }
            ],
            alertList:[
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
                }
        ]
        });

    }
    baseParams = {
        tabStatus: sessionStorage.SaleSceneStatus || null
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
                            <p className={less.title_text} style={{ wordBreak: 'break-all' }}>中国铁建电气化局集团第三十五局铁路第十段建筑项目中段</p>
                        </Col>
                    </Row>
                    <div className={less.flex}>
                        <div className={less.topMesage}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>商城项目编号</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>项目创建时间</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>


                        </div>
                        <div className={less.rightspan}>

                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>共享中心编号</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>立项状态</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>

                        </div>
                    </div>
                    <div className={less.flex}>
                        <div className={less.topMesage}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>账户类型</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>申请人</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>开户时间</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                        </div>
                        <div className={less.rightspan}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={6}>开户预留联系人</Col>
                                <Col className="reuse_value" span={14}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={6}>开户预留手机号</Col>
                                <Col className="reuse_value" span={14}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={6}>开户预留邮箱</Col>
                                <Col className="reuse_value" span={14}>{bondData.workOrder}</Col>
                            </Row>
                        </div>
                    </div>
                </Card>
                <div className="reuse_baseTitle"></div>
                <Card className="mb20" bordered={false} title="资金帐户详情">
                    <div className={less.flex}>
                        <div className={less.detaileft}>
                            <div className={less.toptipsleft}>收金账户总金额</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className={less.fonts28} span={16}><span className={less.colorleft}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={4}><span className={less.fontwblod}>可用金额</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fontwblod}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={4}><span className={less.fontwblod}>在途金额</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fontwblod}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={4}><span className={less.fontwblod}>冻结金额</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fontwblod}>{bondData.workOrder}</span></Col>
                                </Row>

                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={4}><span className={less.fonts14}>会员代码</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fonts14}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={4}><span className={less.fonts14}>子账户编号</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fonts14}>{bondData.workOrder}</span></Col>
                                </Row>
                            </div>
                        </div>
                        <div className={less.detairight}>
                            <div className={less.toptipsright}>出金账户总金额</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className={less.fonts28} span={16}><span className={less.colorright}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}><span className={less.fontwblod}>可用金额</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fontwblod}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}><span className={less.fontwblod}>在途金额</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fontwblod}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}><span className={less.fontwblod}>冻结金额</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fontwblod}>{bondData.workOrder}</span></Col>
                                </Row>


                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}><span className={less.fonts14}>会员代码</span></Col>
                                    <Col className="reuse_value" span={16}><span className={less.fonts14}>{bondData.workOrder}</span></Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}><span className={less.fonts14}>子账户编号</span></Col>
                                    <Col className="reuse_value" span={15}><span className={less.fonts14}>{bondData.workOrder}</span></Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Card>
                {this.state.isShow?
                    <Card className="mb20" bordered={false} title="对公银行卡" >
                        <NewFrom ref='BaseForm'   formList={this.state.formList} isAutoHeight={this.state.isAutoHeight} importantFilter={this.importantFilter} wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>
                        <Row className="reuse_row">
                            <Col className={less.texright} span={5}>绑卡流程:</Col>
                            <Col className="reuse_value" span={15}>
                                <div className={less.colorbacl}>
                                    1.为确认此卡为贵公司所有，平安银行将向您的对公银行账户汇入一笔金额为<span className={less.colornother}>0.01-1元的验证金。</span><br/>
                                    2.该验证金额在您递交申请后即时到账，您需要<span className={less.colornother}>登陆贵公司对公账户网银查询来款明细。</span><br/>
                                    3.接下来<span className={less.colornother}>需要将该验证金的数额正确回填</span>，验证成功后绑卡成功。
                                </div>
                            </Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className={less.cardledt} span={5}>请确认信息填写完整，并仔细阅读绑卡流程后，点击绑卡按钮</Col>
                        <Button type="primary" onClick={this.handleToClick}>绑卡</Button>
                        </Row>
                    </Card>
                    :
                    <Card className="mb20" bordered={false} title="对公银行卡" >
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={2}>银行卡类型</Col>
                            <Col className="reuse_value" span={15}>{bondData.workOrder}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={2}>开户银行</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={2}>开户行</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={2}>账户名称</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={2}>银行卡帐号</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                        </Row>
                    </Card>
                }

                <Card className="mb20" bordered={false} title="出入金明细">
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_BID} tabChange={this.tabChange}>

                    </BaseTabs>
                    <BaseTable

                        url='@/reuse/saleScene/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={false}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>

                <Card className="fixed_button">
                    <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                        <Button  onClick={this.toBack}>返回</Button>
                    </div>
                </Card>
                <Modal
                    title="预留手机号验证！"
                    maskClosable={false}
                    width={488}
                    visible={this.state.detailVisible}
                    onCancel={() => { this.setState({ detailVisible: false }) }}
                    footer={[
                        <Button type="primary" onClick={this.handleCash} key={'submit'}>
                            确认
                        </Button>,
                        <Button  onClick={this.hideModal} >
                            取消
                        </Button>
                    ]}
                >
                    <NewForm ref='AlertForm'  formList={this.state.alertList} isAutoHeight={this.state.isAutoHeight} importantFilter={this.importantFilter} wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>
                    <Row className="reuse_row">
                        <Col className="reuse_value" >
                            *本手机号用于接收银行账单及绑卡、转账提现短信验证码。<br/>
                            如需更改请使用上方修改银行预留手机号功能修改。
                    </Col>
                    </Row>
                </Modal>
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
