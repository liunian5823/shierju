import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Modal, Tabs, Button, Spin,Card ,message} from 'antd';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
import NewForm from '@/components/newForm';
import { baseService } from '@/utils/common';
import less from './index.less';
import BuildList from "./bulidList";
import UploadFile from '@/components/uploadFile';
import {filePathDismant} from "@/utils/dom";
import BaseTable from "@/components/baseTable";
//保证金状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;
export default class AccountclearDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bondData: {},
            defaultKey: '1',//tab选中字段
            detailVisible: false,//确定
            formList:[],
            textarea:[],
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
            formData: {
                payWay: '0',
                payAccountName: '',
                payAccountNo: '',
                remark: null,
                fileName: null,//线下必传
                filePath: null,//线下必传
            },
            loading:false,
            account:true,//付款
            buildList:[],
            fileList:[],
            operationClum:[]//具体操作
        }

    }
    config = {
        span: [5, 15],
        codeTime: 60,
    }
    componentWillMount() {
        this.handleInit();
        this.setState({
            formList: [
                {
                    type: 'INPUT',
                    inputType:"textarea",
                    field: 'seySom',
                    label: '说明:',
                    placeholder: '请输入',

                },
                {
                    type: 'PHONECODE',
                    phoneCode:true,
                    field: 'bidInvitingName',
                    label: '手机验证码:',
                    placeholder: '输入手机验证码',
                    rules:[{
                        required: true,
                        message: '输入手机验证码'
                    }],
                }
            ]
            ,
            buildList:[
                {
                    compName:"公司一",
                    djMain:"预付货款/服务费/手续费/货款",
                    payBuild:"66664546545654",
                    payMan:"王某某   153 4848 4848",
                    comp:'中铁二十二局集团有限公司',
                    payAmount:"99999999.00",
                    mckCode:"GX0201212121299",
                    thb:'12345678901234567890',
                    tht:'2021-11-01 14:24:20',
                    thd:'454876545564655465',
                    thp:'454876545564655465',
                    id:1,
                    allTon:"30"
                },
                {
                    compName:"公司二",
                    djMain:"预付货款/服务费/手续费/货款",
                    payBuild:"66664546545654",
                    payMan:"王某某   153 4848 4848",
                    comp:'中铁二十二局集团有限公司',
                    payAmount:"99999999.00",
                    mckCode:"GX0201212121299",
                    thb:'12345678901234567890',
                    tht:'2021-11-01 14:24:20',
                    thd:'454876545564655465',
                    thp:'454876545564655465',
                    id:2,
                    allTon:"30"
                },
                {
                    compName:"公司三",
                    djMain:"预付货款/服务费/手续费/货款",
                    payBuild:"66664546545654",
                    payMan:"王某某   153 4848 4848",
                    comp:'中铁二十二局集团有限公司',
                    payAmount:"99999999.00",
                    mckCode:"GX0201212121299",
                    thb:'12345678901234567890',
                    tht:'2021-11-01 14:24:20',
                    thd:'454876545564655465',
                    thp:'454876545564655465',
                    id:3,
                    allTon:"30"
                }
            ],
            textarea:[
                {
                    type: 'INPUT',
                    inputType:"textarea",
                    field: 'seySom',
                    label: '备注:',
                    placeholder: '请输入',

                }
            ],
            operationClom:[
                {
                    title: '操作人',
                    dataIndex: 'operationHumen',
                    key: 'operationHumen',
                    width: 150,
                },
                {
                    title: '操作时间',
                    dataIndex: 'operationDate',
                    key: 'operationDate',
                    width: 150,
                },{
                    title: '具体操作',
                    dataIndex: 'operation',
                    key: 'operationDetil',
                    width: 150,
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
    //tab切换
    tabChange = (item) => {
        this.setState({
            defaultKey: item
        })
    }
    //初始
    handleInit = () => {
        this.getBondData()
    }

    // reloadTableData(state = 1) {
    //     this.handelToLoadTable(state, 'tableState');
    // }
    // handelToLoadTable = (state = 1, tableState = 'tableState') => {
    //     this.setState({
    //         [tableState]: state
    //     })
    // }
    // resetTable = (state, tableState = 'tableState') => {
    //     if (state != this.state[tableState]) {
    //         this.setState({
    //             [tableState]: state
    //         });
    //     }
    // }
    createSceneList = () => {
        const {defaultKey}=this.state;
        const left=2;
        const right=20;
        return (
            <div>
                <Tabs activeKey={defaultKey}  onChange={this.tabChange}>
                    <TabPane tab={`保证金（${left}）`} key="1">
                        saedsa
                    </TabPane>
                    <TabPane tab={`其他（${right}）`} key="2">
                        <div  style={{height:"1000px",overflow:"auto"}}>
                            <BuildList buildList={this.state.buildList}></BuildList>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
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
                "approvalStatusStr":"处理中",
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
    showModal=()=>{
        this.setState({
            detailVisible: true
        })
    }
    //上传成功
    uploadSuccess = (file) => {
       const formData = this.state.formData;
        const f = filePathDismant(file.response.data);

        this.setState({
            formData: {
                ...formData,
                filePath: f.filePath,
                fileName: f.fileName
            }
        })
    }
    //基本信息
    createBaseInfo = () => {
        const { bondData } = this.state;
        const { span } = this.config;
        const { formData } = this.state;
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
                <Card className="mb10" bordered={false} title="来款信息（工单号：1231231232）">
                    <div className={less.flex}>
                        <div className={less.topMesage}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={6} style={{fontWeight:"bold"}}>来款账户</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_value" span={24} style={{fontWeight:"bold",fontSize:"20px",color:"#000000"}}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>来款账号</Col>
                                <Col className={less.textcolor} span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>流水号</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.biddingList}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>来款时间</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.thisWeek}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>来款银行</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.thisMont}</Col>
                            </Row>
                        </div>
                        <div className={less.rightspan}>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <Row className="reuse_row">
                                        <Col span={24}>
                                            <div className={less.title_status}>
                                                <p className={less.main} style={statusStyle}>来款金额（元）:</p>
                                                <p className={less.note}>{bondData.disposerType}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col span={24}>
                                            <div className={less.title_status}>
                                                <p className={less.main} style={statusStyle}>来款附言:</p>
                                                <p className={less.notedetal}>{bondData.forfeitureReason}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row className="reuse_row">
                                        <Col span={24}>
                                            <div className={less.title_status}>
                                                <p className={less.main} style={statusStyle}>处理状态</p>
                                                <p className={less.note} style={{fontSize:"22px",color:"#32C5FF"}}>{bondData.approvalStatusStr}</p>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="reuse_row">
                                        <Col span={24}>
                                            <Col className="reuse_label" span={span[0]}>受理人</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.buyerType}</Col>

                                        </Col>
                                        <Col span={24}>
                                            <Col className="reuse_label" span={7}>受理时间</Col>
                                            <Col className="reuse_value" span={17}>{bondData.disposerBuyerType}</Col>
                                        </Col>
                                        <Col span={24}>
                                                <NewForm ref='topForm'  formList={this.state.textarea}  wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Card>
                <div className="reuse_baseTitle"></div>
                <Card className="mb20" bordered={false} title="疑似结算单">
                    {this.createSceneList()}
                </Card>

                <Card className="mb20" bordered={false} title="操作日志">
                    <BaseTable
                        url='@/reuse/saleScene/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={true}
                        baseParams={this.baseParams}
                        columns={this.state.operationClom} />
                </Card>

                <Card className="mb20" bordered={false} title="详细信息">
                   <Row className="reuse_row" span={24}>
                       <Col className="reuse_value" span={8}>
                           <Row className="reuse_row">
                               <Col className="reuse_label" span={6}>付款人</Col>
                               <Col className="reuse_value" span={18}>{bondData.disposerHumn}</Col>
                           </Row>
                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>付款方式</Col>
                               <Col className="reuse_value" span={18}>{bondData.buyerType}</Col>
                           </Row>
                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>付款时间</Col>
                               <Col className="reuse_value" span={18}>{bondData.disposerCode}</Col>
                           </Row>

                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>付款说明</Col>
                               <Col className="reuse_value" span={18}>{bondData.disposerCode}</Col>
                           </Row>
                       </Col>
                       <Col className="reuse_value" span={8}>
                           <Row className="reuse_row">
                               <Col className="reuse_label" span={6}>业务类型</Col>
                               <Col className="reuse_value" span={18}>{bondData.disposerType}</Col>
                           </Row>
                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>业务单号</Col>
                               <Col className="reuse_value" span={18} className={less.textcolor}>{bondData.workOrder}</Col>
                           </Row>
                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>附件</Col>
                               <Col className="reuse_value" span={18} className={less.textcolor}>
                                   {   bondData.enclosure.length>0 ? bondData.enclosure.map((item) => {
                                       return <p><a href={item.filePath}> {item.fileName}</a> <a href={item.filePath} className={less.textcolor}>下载</a> <br/></p>
                                   }):"暂无附件"}
                               </Col>
                           </Row>

                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>处理说明</Col>
                               <Col className="reuse_value" span={18}>{bondData.forfeitureReason}</Col>
                           </Row>
                       </Col>
                       <Col className="reuse_value" span={8}>
                           <Row className="reuse_row">
                               <Col className="reuse_label" span={6}>复核人</Col>
                               <Col className="reuse_value" span={18}>{bondData.disposerHumn}</Col>
                           </Row>
                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>复核时间</Col>
                               <Col className="reuse_value" span={18} >{bondData.biddingList}</Col>
                           </Row>
                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>审批结果</Col>
                               <Col className="reuse_value" span={18}>{bondData.biddingList}</Col>
                           </Row>

                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>完成时间</Col>
                               <Col className="reuse_value" span={18}>{bondData.biddingList}</Col>
                           </Row>
                           <Row className="reuse_row">
                               <Col className="reuse_label"  span={6}>复核说明</Col>
                               <Col className="reuse_value" span={18}>{bondData.biddingList}</Col>
                           </Row>
                       </Col>
                   </Row>
                </Card>

                <Card className="fixed_button">
                    <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                        <Button  onClick={this.props.callBack}>退款</Button>
                        <Button  onClick={this.props.callBack}>关闭</Button>
                        <Button  onClick={this.props.callBack}>保存</Button>
                        <Button type="primary" onClick={this.showModal}>释放</Button>
                        <Button type="primary" onClick={this.showModal}>匹配</Button>
                    </div>
                </Card>
                <Modal
                    title="挂帐处理确认"
                    maskClosable={false}
                    width={488}
                    visible={this.state.detailVisible}
                    onCancel={() => { this.setState({ detailVisible: false }) }}
                    footer={[
                        <Button type="primary" onClick={this.handleSubmit} key={'submit'}>
                            确认
                        </Button>,
                        <Button  onClick={this.hideModal} >
                            取消
                        </Button>
                    ]}
                >
                    <div>
                        <div className={less.dasling}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">来款账户名</Col>
                                <Col className="reuse_value" span="15">9999.00吨</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">来款账户号</Col>
                                <Col className="reuse_value" span="15">7,800.00元</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">付款企业名称</Col>
                                <Col className="reuse_value" span="15">7,800.00元</Col>
                            </Row>
                        </div>
                        <div className={less.dasling}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">业务类型</Col>
                                <Col className="reuse_value" span="15">预付货款/服务费/手续费/货款</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">来款金额</Col>
                                <Col className="reuse_value" span="15">99999999.00元</Col>
                            </Row>
                        </div>
                    </div>
                    <div className={less.dasling}>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span="5">上传附件</Col>
                            <Col className="reuse_value" span="15">
                               <UploadFile
                                    className={'upload_s'}
                                    disabled={!!formData.filePath}
                                    tip
                                    tipText=" "
                                    uploadSuccess={this.uploadSuccess}></UploadFile>
                            </Col>
                        </Row>
                    </div>
                    <NewForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter} wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>
                </Modal>
            </div>
        )
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
