import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin,Card ,Popconfirm,message,Radio,Alert} from 'antd';
import moment from 'moment';
import NewForm from '@/components/newForm';
import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import less from './index.less';
//保证金状态
const _BONDSTATUS = baseService._bondMain;
const _BONDSTATUS_OBJ = baseService._bondMain_obj;
const _MAINBIDOBJ = baseService._saleMainBid_obj;
export default class TrandelDetil extends React.Component {
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
                id:"0",
                value:"确认无误"
            },{
                id:"1",
                value:"信息有误，驳回"
            }],
            time:60,
            btnDisable:false,
            btnContent: '发送验证码',
            rest:false,
            loading:false,
            roleSource: {
                list: []
            },
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

    operationClom=[
        {
            title: '操作人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: 150,
        },
        {
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
        },{
            title: '具体操作',
            dataIndex: 'remark',
            key: 'remark',
            width: 150,
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
        // console.log( this.props.location.state.uuids)
        let uuids = "1" || this.props.uuids;
        if (!uuids) return;
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/takeDelivery/takeDeliveryDetail', {
            uuids: uuids
        }).then(res => {
            console.log(res)
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
    //确定
    handleToClick = () => {
        this.setState({
            detailVisible: true
        })
    }
    // 释放确定
    handleToRelease = () => {
        message.info('释放');
    }
    handleSubmit=()=>{
        const { SalesType }=this.refs.BaseForm.getFieldsValue();
        const { bidInvitingName }=this.refs.BaseForm.getFieldsValue();
        // const uuids=this.props.location.state.uuids;
        if(SalesType==undefined || SalesType==''){
            message.error('请选择确认结果');
        }else if(bidInvitingName==undefined || SalesType==''){
            message.error('请填写手机验证码');
        }else{
            let {SalesType}=this.refs.BaseForm.getFieldsValue();
            console.log(SalesType)
            api.ajax('GET', '@/reuse/takeDelivery//confirmTakeDelivery', {
                takeUuids: "1",type:SalesType,content:"sads"
            }).then(res => {
                message.success(res.msg);
                this.state.bondData.statusStr="已完成"
                this.setState({
                    detailVisible: false,
                    bondData:this.state.bondData
                });
            }).catch(err=>{
                message.error(err.msg);
            })
            this.setState({
                detailVisible: false
            });

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

        // if (bondData.status) {
        //     statusStyle = _MAINBIDOBJ[bondData.status].style;
        // }
        //   const multiSelectProps = getFieldProps('multiSelect', {
        //     rules: [
        //       { required: true, message: '请选择您喜欢的颜色', type: 'array' },
        //     ],
        //   });
        return (
            <div>
                <Card className="mb10" bordered={false}>
                    <div className={less.flex}>
                        <div className={less.topMesage}>
                            <Row className={less.title}>
                                <Col span={20}>
                                    <p className={less.title_text} style={{ wordBreak: 'break-all' }}>asdadasasd</p>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>订单号</Col>
                                <Col className={less.textcolor} span={span[1]}>{bondData.orderCode}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>提货单创建时间</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.createTime}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>提货完成时间</Col>
                                <Col className="reuse_value" span={span[1]}>{moment(bondData.finishTime).format("YYYY-MM-DD HH:mm:ss")}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>提货单位</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.buyerCompanyName}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>复核人</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.confimrUser}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>销售单位</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.saleCompanyName}</Col>
                            </Row>
                            <Row className="reuse_row mb20">
                                <Col className="reuse_label" span={span[0]}>销售部门</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.saleDeptName}</Col>
                            </Row>
                            <Row className="reuse_row mt20">
                                <Col className="reuse_label" span={span[0]}>结算单单号</Col>
                                <Col className={less.textcolor} span={span[1]}>
                                <p><a href={"javascript:;"}> {bondData.settlementNo}</a> <br/></p>
                                 {/* {   bondData.enclosure.length>0 ? bondData.enclosure.map((item) => {
                                     return <p><a href={item.filePath}> {item.fileName}</a> <br/></p>
                                 }):"暂无结算单单号"} */}
                                </Col>
                            </Row>
                        </div>
                        <div className={less.rightspan}>

                            <Row className="reuse_row">
                                <Col span={12}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>提货状态</p>
                                        <p className={less.note}>{bondData.statusStr}</p>

                                    </div>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>提货单金额</p>
                                        <p className={less.colorred}>{bondData.takeAmt}</p>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <div className={less.title_status}>
                                        <p className={less.main} style={statusStyle}>提货重量</p>
                                        <p className={less.colorred}>{bondData.takeTotaCount}</p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
                <div className="reuse_baseTitle"></div>
                <Card className="mb20" bordered={false} title="标的物清单">
                    <BaseTable
                        scroll={{ x: 1900 }}
                        url='@/reuse/saleScene/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={false}
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
                                <Col className="reuse_label" span="5">税额</Col>
                                <Col className={less.colorbottred} span="15">¥{bondData.taxAmount}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="5">金额</Col>
                                <Col className={less.colorbottred} span="15">¥{bondData.price}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span="8">扣量金额</Col>
                                <Col className={less.colorbottred} span="12">-¥{bondData.taxAmount}</Col>
                            </Row>
                        </div>
                    </div>
                    <Row className={less.wid50}>
                        <Col className={less.fonts20} span="8">税价合计:</Col>
                        <Col className={less.fontsred20} span="12">¥{bondData.sumAmt}</Col>
                    </Row>
                </Card>
                <Card className="mb20" bordered={false} title="提货单信息">
                    <div className={less.flex}>
                        <div className={less.disleft}>

                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>登记人</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.createUser}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>登记时间</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.createTime}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>提货人</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.takeContacts}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>附件</Col>
                                <Col className="reuse_value" span={span[1]}>
                                <a href={bondData.filePath} style={{marginRigt:"10px"}}> {bondData.fileName}</a>
                                
                                    {/* {   bondData.fileName.length>0 ? bondData.fileName.map((item) => {
                                        return <a href={item.filePath} style={{marginRigt:"10px"}}> {item.fileName}</a>
                                    }):"暂无附件"} */}
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={span[0]}>备注信息</Col>
                                <Col className="reuse_value" span={span[1]}>{bondData.remark}</Col>
                            </Row>
                        </div>
                        <div className={less.disright}>
                            <div className={less.borderbottom}>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span="10">提货数量/净重合计</Col>
                                    <Col className={less.colorbottred} span="10">{bondData.takeTotalCount}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span="10">（扣量 0.5%）扣量合计</Col>
                                    <Col className={less.colorbottred} span="10">{bondData.takeOff}</Col>
                                </Row>
                            </div>
                            <Row className='reuse_row'>
                                <Col className={less.fonts20} span="8">结算重量:</Col>
                                <Col className={less.fontsred20} span="12">{bondData.takeCount}</Col>
                            </Row>
                        </div>
                    </div>
                </Card>
                <Card className={less.mb100} bordered={false} title="提货单日志">
                    {/* <BaseTable

                        url='@/reuse/takeDelivery/takeDeliveryDetail'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={false}
                        baseParams={this.baseParams}
                        columns={this.operationClom} /> */}


                    <Table
                        rowKey="roleOrg"
                        columns={this.operationClom}
                        scroll={{ x: 900 }}
                        rowSelection={null}
                        dataSource={this.state.bondData.orderLog}
                        onChange={this.tableChange}
                    />
                </Card>
                <Card className="fixed_button">
                    <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                        <Button  onClick={this.props.callBack}>返回</Button>
                        <Button type="primary" onClick={this.handleToClick}>确认提货单</Button>
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
                                <Col className="reuse_value" span="15">{bondData.takeTotalCount}吨</Col>
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
                    <NewForm ref='BaseForm'  formList={this.state.formList} importantFilter={this.importantFilter} wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>

                    <Alert message=""
                           description="确认提货单后，系统将根据提货单金额及预付款情况自动生成结算单。可以在结算单管理中随时查阅。"
                           type="info"
                           showIcon
                    />
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
                    {/* <div className={less.card}>
                        <div className="reuse_baseTitle">保证金处理</div>
                        <div>
                            <Table
                                scroll={{ x: 800, y: 400 }}
                                dataSource={bondDealList}
                                columns={this.bondCols}
                                pagination={false}></Table>
                        </div>
                    </div> */}
                </Spin>
            </div>
        )
    }
}