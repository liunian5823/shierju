import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin,Card ,Popconfirm,message,Radio,Alert} from 'antd';
const confirm = Modal.confirm;
import NewForm from '@/components/newForm';
import { baseService } from '@/utils/common';
import less from './index.less';

//保证金状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;
export default class StatementDetails extends React.Component {
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
            fileList:[]
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
                    mack:"1323131313321323333333333",
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
                    mack:"1323131313321323333333333",
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
                        "fileName":"单位名称",
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
                        "fileName":"单位名称",
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
    //付款方式
    showPayType = () => {
        this.setState({
            detailVisible: true
        })
    };
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
        //   const multiSelectProps = getFieldProps('multiSelect', {
        //     rules: [
        //       { required: true, message: '请选择您喜欢的颜色', type: 'array' },
        //     ],
        //   });
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
                                <Col className="reuse_label" span={span[0]}>结算单创建时间</Col>
                                <Col className={less.textcolor} span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>结算完成时间</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>销售单位</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>销 售 部 门</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>订单单号</Col>
                                <Col className={less.textcolor} span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>提货单单号</Col>
                                <Col className={less.textcolor} span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row mb20">
                                <Col className="reuse_label" span={span[0]}>提货单位</Col>
                                <Col className="reuse_value" span={span[1]}>
                                    {   bondData.enclosure.length>0 ? bondData.enclosure.map((item) => {
                                        return <p>{item.fileName}<a href={item.filePath}> {item.businessId}</a> <br/></p>
                                    }):"暂无单位"}
                                </Col>
                            </Row>
                            <Row className="reuse_row mt20">
                                <Col className="reuse_label" span={span[0]}>复核人</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                        </div>
                        <div className={less.rightspan}>

                            <Row className="reuse_row">
                                <Col span={12}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>提货状态</p>
                                        <p className={less.note}>{bondData.approvalStatusStr}</p>

                                    </div>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>业务类型</p>
                                        <p className={less.notedetal}>{bondData.workOrder}</p>

                                    </div>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>提货单金额</p>
                                        <p className={less.colorred}>{bondData.workOrder}</p>
                                        <p className={less.main}>柒仟捌佰元整</p>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Card>
                <div className="reuse_baseTitle"></div>
                {this.state.account?
                <Card className="mb20" bordered={false} title="请选择付款方式">
                    <Card className={less.cardacc} onClick={this.showConfirm}>
                        <Row claName="reuse_row">
                            <Col span={3} className={less.fonts18}>
                                <Icon type="exception" />
                            </Col>
                            <Col span={15} className={less.huikuan} style={{fontWeight:"bold"}}>
                                汇款/转账
                            </Col>
                        </Row>
                        <Row claName="reuse_row" style={{color:"#7F7F7F",fontSize:"13px",marginTop:"20px"}}>
                            生成并打印支付单，通过财务共享中心或其他支付通道向平台指定账号付款
                        </Row>
                    </Card>
                    <Card className={less.cardacc} onClick={this.showPayType}>
                        <Row claName="reuse_row">
                            <Col span={3} className={less.fonts18}>
                                <Icon type="share-alt" />
                            </Col>
                            <Col span={15} className={less.huikuan} style={{fontWeight:"bold"}}>
                                资金账户余额
                            </Col>
                        </Row>
                        <Row claName="reuse_row" style={{color:"#7F7F7F",fontSize:"13px",marginTop:"20px"}}>
                            使用所属单位的资金账户可用金额世界付款
                        </Row>
                    </Card>
                </Card>

                    :''
                }
                <Card className="mb20" bordered={false} title="付款信息">


                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>付款人</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label"  span={2}>付款方式</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label"  span={2}>付款时间</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                            </Row>

                            <Row className="reuse_row">
                                <Col className="reuse_label"  span={2}>付款说明</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.forfeitureReason}</Col>
                            </Row>
                </Card>
                <Card className={less.mb100} bordered={false} title="结算日志">

                </Card>
                <Card className="fixed_button">
                    <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                        <Button  onClick={this.props.callBack}>关闭</Button>
                        {this.state.account?
                            <Button type="primary" onClick={this.showConfirm}>付款</Button>
                            :
                            ''
                        }
                    </div>
                </Card>
                <Modal
                    title="付款方式-资金账户余额"
                    maskClosable={false}
                    width={488}
                    visible={this.state.detailVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => { this.setState({ detailVisible: false }) }}
                    footer={[
                        <Button type="primary" onClick={this.handleSubmit} key={'submit'}>
                            确认付款
                        </Button>,
                        <Button  onClick={this.hideModal} >
                            取消
                        </Button>
                    ]}
                >
                    <div>
                        <div className={less.dasling}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">付款方式</Col>
                                <Col className="reuse_value" span="15">9999.00吨</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">结算单号</Col>
                                <Col className="reuse_value" span="15">7,800.00元</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">采购部门</Col>
                                <Col className="reuse_value" span="15">7,800.00元</Col>
                            </Row>
                        </div>
                        <div className={less.dasling}>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">应付金额</Col>
                                <Col className="reuse_value" span="15" style={{color:"red"}}>10,000.00元</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">项目余额</Col>
                                <Col className="reuse_value" span="15" style={{color:"red"}}>8,000.00元</Col>
                            </Row>
                        </div>
                    </div>
                    <NewForm ref='BaseForm' handleSubmit={this.handleSubmit} formList={this.state.formList} importantFilter={this.importantFilter} wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>


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
