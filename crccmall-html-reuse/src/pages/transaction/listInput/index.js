import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin,Card ,Popconfirm,message,Radio,Alert} from 'antd';
import NewForm from '@/components/newForm';
import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import less from './index.less';
import FormList from "./formList";
import ToggleTable from '@/components/toggleTable';

const _MAINBIDOBJ = baseService._saleMainBid_obj;
export default class ListInlut extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            orderData: {},
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
            time:60,
            btnDisable:false,
            btnContent: '发送验证码',
            rest:false,
            loading:false,
        }

    }
    config = {
        span: [5, 15],
        codeTime: 60,
    }
    columns = [
        {
            title: '物料名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width: 150,
        }
        ,{
            title: '规格',
            dataIndex: 'spec',
            key: 'spec',
            width: 150,
        },{
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
            width: 100
        },{
            title: '物料描述',
            dataIndex: 'quality',
            key: 'quality',
            width: 100
        },{
            title: '采购数量',
            dataIndex: 'num',
            key: 'num',
            width: 100
        },{
            title: '提货数量（净重）',
            dataIndex: 'Purchase',
            key: 'Purchase',
            width: 100,
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                  <Input placeholder="0.00吨"
                  />
                </span>
            )
        },{
            title: '扣量',
            dataIndex: 'disposerNum',
            key: 'disposerNum',
            width: 100,
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                  <Input placeholder="0.00%"
                  />
                </span>
            )
        },{
            title: '结算重量',
            dataIndex: 'taxamount',
            key: 'taxamount',
            width: 100,
            render: (text) => <a href="#" style={{fontSize:'14px',color:'#0091FF',fontWeight:"bold",display:"block"}}>111</a>,
        },{
            title: '税价合计',
            dataIndex: 'totalprice',
            key: 'totalprice',
            width: 100,
            render: (text) => <a href="#" style={{fontSize:'14px',color:'#FA9B13',fontWeight:"bold",display:"block"}}>{text}</a>,
        },{
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: 100,
            render: (text) => <a href="#" style={{fontSize:'14px',color:'#0091FF',fontWeight:"bold",display:"block"}}>{text}</a>,
        },{
            title: '税额',
            dataIndex: 'enclosure',
            key: 'enclosure',
            width: 100,
            render: (text) => <a href="#" style={{fontSize:'14px',color:'#0091FF',fontWeight:"bold",display:"block"}}>{text}</a>,

        },{
            title: '单位价格',
            dataIndex: 'enclosurePrice',
            key: 'enclosurePrice',
            width: 100,
            render: (text) => <a href="#" style={{fontSize:'14px',color:'#0091FF',fontWeight:"bold",display:"block"}}>{text}</a>,
        }
    ]

    componentWillMount() {
        this.handleInit();
        this.setState({
            formList: [
                {
                    type: 'RADIO',
                    field: 'SalesType',
                    label:"确认结果:",
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
                },
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
        })
    }
    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.uuids != nextProps.uuids) {
            this.createBaseInfo(nextProps.uuids)
        }
    }
    //初始
    handleInit = () => {
        this.createBaseInfo()
    }

    //基本信息
    createBaseInfo = () => {
        this._uuids = this.props.match.params.uuids;
        let params = {
            businessId: this._uuids,
            source: 1
        }
        if(this._uuids) {
            api.ajax('GET', '@/reuse/order/info', params)
                .then(res => {
                    if (res.data) {
                        this.setState({
                            orderData: res.data
                        })

                    } else {
                        this.setState({
                            spinning: false
                        })
                    }
                }, error => {

                })
        }
    }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }

    //确定
    handleToClick = () => {
        this.setState({
            detailVisible: true
        })
    }

    handleSubmit=()=>{
        const { SalesType }=this.refs.BaseForm.getFieldsValue();
        const { bidInvitingName }=this.refs.BaseForm.getFieldsValue();
        if(SalesType==undefined || SalesType==''){
            message.error('请选择确认结果');
        }else if(bidInvitingName==undefined || SalesType==''){
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





    render() {
        const { span } = this.config;
        const { orderData}  = this.state;
        const goodsList = orderData.goodsList || [];
        return (
            <div className={less.bondDetail}>
                <Spin spinning={this.state.spinning}>
                    <div className={less.card}>

                        <Card className="mb10" bordered={false}>
                            <div className={less.flex}>
                                <div className={less.topMesage}>
                                    <Row className={less.title}>
                                        <Col span={20}>
                                            <p className={less.title_text} style={{ wordBreak: 'break-all' }}>创建提货单</p>
                                        </Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>订单单号</Col>
                                        <Col className={less.textcolor} span={span[1]}>{orderData.code || '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>结算单单号</Col>
                                        <Col className={less.textcolor} span={span[1]}>1234567890123456789</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>创建时间</Col>
                                        <Col className="reuse_value" span={span[1]}>{orderData.createTime}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>销售单位</Col>
                                        <Col className="reuse_value" span={span[1]}>{orderData.saleCompanyName}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>销 售 部 门</Col>
                                        <Col className="reuse_value" span={span[1]}>{orderData.saleDeptName}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>提货单位</Col>
                                        <Col className="reuse_value" span={span[1]}>
                                            {orderData.buyerCompanyName}<a href={"javascript:;"} className={less.textcolor}>查看企业详细信息</a>
                                        </Col>
                                    </Row>
                                  {/*  <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>复核人</Col>
                                        <Col className="reuse_value" span={span[1]}>张三 188 8888 8888</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>完成时间：</Col>
                                        <Col className="reuse_value" span={span[1]}>2021-01-20 15:25:23</Col>
                                    </Row>*/}
                                </div>
                            </div>
                        </Card>



                        <div className="reuse_baseTitle"></div>
                        <Card className="mb20" bordered={false} title="录入提货单">
                            <Button type="primary" onClick={this.exportList} style={{position:"absolute",top:"10px",right:"10px"}}>下载磅单</Button>
                            <ToggleTable no_selection={true}
                                         dataSource={goodsList || []}
                                         columns={this.columns}
                                        ></ToggleTable>
                        </Card>
                        <Card  className="mb20" bordered={false}>
                            <div className={less.listinput}>
                                <Row className="reuse_row">
                                    <p>
                                        1.首次出价需高于开盘价。
                                        2.出价金额需高于当前最高报价加最低调价幅度。
                                        3.若已开启自动延长规则，则买方在竞价结束前2分钟出价后，竞价结束时间将会自动延时5分钟。
                                    </p>
                                    <p>
                                        1.首次出价需高于开盘价。
                                        2.出价金额需高于当前最高报价加最低调价幅度。
                                        3.若已开启自动延长规则，则买方在竞价结束前2分钟出价后，竞价结束时间将会自动延时5分钟。
                                    </p>
                                    <p>
                                        1.首次出价需高于开盘价。
                                        2.出价金额需高于当前最高报价加最低调价幅度。
                                        3.若已开启自动延长规则，则买方在竞价结束前2分钟出价后，竞价结束时间将会自动延时5分钟。
                                    </p>
                                </Row>
                            </div>
                            <div className={less.listinputright}>
                                <div className={less.disleft} style={{marginLeft:"200px"}}>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="5">税额</Col>
                                        <Col className={less.colorbottred} span="15">¥1234.00</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="5">金额</Col>
                                        <Col className={less.colorbottred} span="15">¥12345678.00</Col>
                                    </Row>
                                    <Row className="reuse_row" style={{borderBottom:"1px solid black"}}>
                                        <Col className="reuse_label" span="8">扣量金额</Col>
                                        <Col className={less.colorbottred} span="12">-¥1234.00</Col>
                                    </Row>
                                </div>
                            </div>
                            <Row className={less.wid50}>
                                <Col className={less.fonts20} span="15">税价合计:</Col>
                                <Col className={less.fontsred20} span="9">¥0</Col>
                            </Row>
                        </Card>
                        <Card className="mb20" bordered={false} title="提货单信息">
                            <div style={{width:'500px'}}>
                                <FormList></FormList>
                            </div>
                        </Card>
                        <Card className="fixed_button">
                            <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                <Button  onClick={this.props.callBack}>返回</Button>
                                <Button type="primary" onClick={this.handleToClick}>递交提货单</Button>
                            </div>
                        </Card>
                        <Modal
                            title="请仔细核对提货单！"
                            maskClosable={false}
                            width={488}
                            visible={this.state.detailVisible}
                            onOk={this.handleSubmit}
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
                                        <Col className="reuse_label" span="5">净重合计</Col>
                                        <Col className="reuse_value" span="15">9999.00吨</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="5">结算金额</Col>
                                        <Col className="reuse_value" span="15">7,800.00元</Col>
                                    </Row>
                                </div>
                                <div className={less.padlr100}>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="8">预付款总金额</Col>
                                        <Col className="reuse_value" span="12">10,000.00元</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="8">当前预付款余额</Col>
                                        <Col className="reuse_value" span="12">8,000.00元</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="8">当前应付</Col>
                                        <Col className="reuse_value" span="12">7,800.00元</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="8">本次结算后余额</Col>
                                        <Col className="reuse_value" span="12">200.00元</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="5">预付款充足</Col>
                                        <Col className="reuse_value" span="15">无需补缴</Col>
                                    </Row>
                                </div>
                            </div>
                            <NewForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter} wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>

                            <Alert message=""
                                   description="确认提货单后，系统将根据提货单金额及预付款情况自动生成结算单。可以在结算单管理中随时查阅。"
                                   type="info"
                                   showIcon
                            />
                        </Modal>


                    </div>

                </Spin>
            </div>
        )
    }
}
