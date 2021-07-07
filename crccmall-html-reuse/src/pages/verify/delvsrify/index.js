import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin,Card ,Popconfirm,message,Radio,Alert} from 'antd';
import ToggleTable from '@/components/toggleTable';
const FormItem = Form.Item;
const createForm = Form.create;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
import BaseForm from '@/components/baseForm';
import NewForm from '@/components/newForm';
import { closeWin } from '@/utils/dom';
import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './index.less';
import FormatDate from "@/utils/date";
import download from "business/isViewDown";


//保证金状态
const _BONDSTATUS = baseService._bondMain;
const _BONDSTATUS_OBJ = baseService._bondMain_obj;
const _MAINBIDOBJ = baseService._saleMainBid_obj;

export default class DelVsrify extends React.Component {
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
                id:"2",
                value:"通过"
            },{
                id:"3",
                value:"驳回"
            }],
            time:60,
            btnDisable:false,
            btnContent: '发送验证码',
            rest:false,
            loading:false,
            cardTitle:"标的物清单",
            humenNumber:2,
            bidInfoData : {},
            bidCompanyInfo : {},
            signPurchaserList : [],
            signPurchaserLoading: false,//已报名采购商loading
        }

    }
    config = {
        span: [5, 15],
        codeTime: 60,
    }
    _uuids = null
    _bidUUIDS = null

    baseParams = {
        uuids: this.props.match.params.uuids,
        bidUuids :this.props.match.params.bidUUIDS
    }



    columns = [
        {
            title: '物料名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width: 110,
        }
        ,{
            title: '规格',
            dataIndex: 'spec',
            key: 'spec',
            width: 90,
        },{
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
            width: 90
        },{
            title: '物料描述',
            dataIndex: 'desc',
            key: 'desc',
            width: 90
        },{
            title: '采购数量',
            dataIndex: 'num',
            key: 'num',
            width: 90,
            render: (text, record) => {
                return <span>{Util.toFixed(record.num,2)+'/'+record.unit}</span>
            }
        },{
            title: '金额/单价',
            dataIndex: 'price',
            key: 'price',
            width: 90,
            render: (text, record) => {
                return <span>{Util.toFixed(record.price,2)}</span>
            }
        },{
            title: '税额',
            dataIndex: 'taxRate',
            key: 'taxRate',
            width: 90,
            render: (text, record) => {
                return <span>{(this.state.bondData.biddersTaxFalg == 2 && this.state.bondData.biddersTax) ? Util.computeTax(record.sumAmt, this.state.bondData.biddersTax) : '-'}</span>
            }
        },{
            title: '单位价格',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: 90,
            render: (text, record) => {
                return <span>{(this.state.bondData.pricingMethod == 1 ) ? '-' : Util.computeUnitPrice(record.sumAmt,record.num)+'/'+record.unit}</span>

            }
        },{
            title: '税价合计',
            dataIndex: 'sumAmt',
            key: 'sumAmt',
            width: 90,
            render: (text, record) => {
                return <span>{Util.toFixed(record.sumAmt,2)}</span>
            }
        },{
            title: '附件',
            dataIndex: 'fileName',
            key: 'fileName',
            width: 90,
            render: (text, record, index) => (
                record.filePath ? <span>
                    <a className="reuse_link text_line4"
                       href="javascript:void(0);"
                       onClick={() => download(record.fileName, systemConfigPath.fileDown(record.filePath), true)}>
                        <Icon type="paper-clip" />
                        <span title={text}>{record.fileName}</span>
                    </a>
                </span> : '无'
            )
        }
    ]


    //竞买人名单
    jingmaicolumns = [
        {
            title: '竞买人名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
        },
        {
            title: '联系方式',
            key: 'contacts',
            dataIndex: 'contacts',
            className: 'text_right',
        },
        {
            title: '保证金状态',
            key: 'bondStatusStr',
            dataIndex: 'bondStatusStr',
            className: 'text_right',
        },
        {
            title: '报名状态',
            key: 'status',
            dataIndex: 'status',
            className: 'text_right',
            render: (text, record) => {
                return(
                    <div>
                        <p>{record.statusStr}</p>
                        <p></p>
                    </div>
                )
            }
        },
        {
            title: '报名日期',
            key: 'signTime',
            dataIndex: 'signTime',
            className: 'text_right',
        },
        {
            title: '税额',
            key: 'taxRate',
            dataIndex: 'taxRate',
            className: 'text_right',
            render: (text, record) => {
                return <span>{(this.state.bondData.biddersTaxFalg == 2 && this.state.bondData.biddersTax) ? Util.computeTax(record.offerAmt, this.state.bondData.biddersTax) : '-'}</span>
            }
        },
        {
            title: '税价合计',
            key: 'offerAmt',
            dataIndex: 'offerAmt',
            className: 'text_right',
        },
        {
            title: '报价有效期',
            key: 'effectiveDate',
            dataIndex: 'effectiveDate',
            className: 'text_right',
        },
        {
            title: '操作',
            key: 'x',
            dataIndex: 'x',
            width: 120,
            render: (text, record, index) => {
                return (
                    <div>
                        <p className="reuse_link" onClick={() => { }}>查看详情</p>
                    </div>
                )
            }
        },]

    componentWillMount() {
        this.handleInit();
        this.setState({
            formList: [
                {
                    type: 'RADIO',
                    field: 'dealStatus',
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
                    type: 'INPUT',
                    phoneCode:true,
                    inputType:"textarea",
                    field: 'approvalReason',
                    label: '填写审核意见',
                    placeholder: '请输入',
                    rules:[{
                        required: true,
                        message: '请输入'
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
        this._uuids = this.props.match.params.uuids;
        this._bidUUIDS = this.props.match.params.bidUUIDS;
        if (this._uuids) {
            this.getBondData(this._uuids);
            this.getBidData(this._uuids,this._bidUUIDS);
            this.getSignPurchaser();
        }

    }



    //获取基本信息数据
    getBondData = (uuids) => {
        if (!uuids) return;
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/saleScene/querySaleSceneInfo', {
            uuids: uuids
        }).then(res => {
            if (res.data) {
                this.setState({
                    bondData: res.data,
                    spinning: false
                })

                console.log("bondData",this.state.bondData);
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

    //中标人及报价信息
    getBidData = (uuids,bidUUIDS) => {
        if (!uuids || !bidUUIDS) return;
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/newBidApprove/queryBidCompanyInfo', {
            uuids: uuids,
            bidUuids : bidUUIDS
        }).then(res => {
            if (res.data) {
                console.log("res",res.data.companyInfo.name);
                this.setState({
                    bidInfoData: res.data,
                    bidCompanyInfo : res.data.companyInfo,
                    spinning: false
                })
                console.log("bidInfoData",this.state.bidInfoData);
            } else {
                this.setState({
                    bidInfoData: {}
                })
            }
        }, error => {
            this.setState({
                bidInfoData: {}
            })
            Util.alert(error.msg, { type: 'error' })
        })
    }


    //获取已报名采购商
    getSignPurchaser = (params = {}) => {
        const uuids = this.props.match.params.uuids;
        if (!uuids) return;
        this.setState({
            signPurchaserLoading: true,
        })
        api.ajax('GET', '@/reuse/buyScene/findBidderList', {
            sceneId: uuids,
            ...params
        }).then(res => {
            this.setState({
                signPurchaserList: res.data || [],
                signPurchaserLoading: false,
            })
        }).catch(res => {
            this.setState({
                signPurchaserLoading: false,
            })
        })
    }

    //确定
    handleToClick = () => {
        this.setState({
            detailVisible: true
        })
    };

    //返回
    toBack = () => {
        this.props.history.push('/verify/examine/')
    }
    handleSubmit=()=>{
        const {dealStatus, approvalReason}=this.refs.BaseForm.getFieldsValue();
        if(dealStatus==undefined){
            message.error('请选择确认结果');
        }else  if(approvalReason==undefined){
            message.error('请输入审核意见');
        }else{
            console.log(this.refs.BaseForm.getFieldsValue());
            const params = this.refs.BaseForm.getFieldsValue();
            api.ajax('GET', '@/reuse/newBidApprove/approvalBid', {
                uuids: this._bidUUIDS,
                dealStatus : params.dealStatus,
                approvalReason :params.approvalReason
            }).then(res => {
                this.refs.BaseForm.resetFields();
                this.setState({
                    detailVisible: false
                })
            }).catch(res => {
                this.refs.BaseForm.resetFields();
                this.setState({
                    detailVisible: false
                })
            })
        }
    };

    hideModal=()=> {
        this.setState({
            detailVisible: false
        })

    };




    render() {
        const { bondDealList = [] } = this.state.bondData;
        const { span } = this.config;
        const { bondData,bidInfoData,bidCompanyInfo,signPurchaserList,signPurchaserLoading } = this.state;
        return (
            <div className={less.bondDetail}>
                <Spin spinning={this.state.spinning}>
                    <div>
                        <Card className="mb10" bordered={false}>
                            <Row className={less.title}>
                                <Col span={24}>
                                    <p className={less.title_text} style={{ wordBreak: 'break-all' }}>{bondData.title}</p>
                                </Col>
                            </Row>
                            <div className={less.flex}>
                                <div className={less.topMesage}>

                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>竞价单号</Col>
                                        <Col className={less.textcolor} span={span[1]}>{bondData.code}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>销售单位</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.saleCompanyName}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>销售部门</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.saleDeptName}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>竞价开始时间</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.offerStartTime}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>竞价截止时间</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.offerEndTime}</Col>
                                    </Row>


                                </div>
                                <div className={less.rightspan}>

                                    <Row className="reuse_row">
                                        <Col span={12}>
                                            <div className={less.title_status}>
                                                <p className={less.main} >竞价状态：</p>
                                                <p className={less.note}>{bondData.statusStr}</p>

                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Card>
                        <div className="reuse_baseTitle"></div>
                        <Card className="mb20" bordered={false} title="竞买人要求">
                            <div className={less.flex}>
                                <div className={less.disleft}>

                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>付款方式</Col>
                                        <Col className={less.textcolor} span={span[1]}>{bondData.payWayStr}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>付款时间</Col>
                                        <Col className="reuse_value" span={span[1]}>成交后<span> {bondData.payTime || '--'} </span>天内</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>货品所在地</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.provinceName + "/" + bondData.cityName + "/" + bondData.countyName}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>看货地址</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.khAddress || '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>储存方式</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.evaluationPrice == 1 ? "室内" : bondData.evaluationPrice == 2 ? "室外" : bondData.evaluationPrice == 3 ? "其他" : '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>提货时间：</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.deliveryTime || '--'}</Col>
                                    </Row>
                                </div>
                                <div className={less.disright}>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={6}>竞买人企业类型</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.biddersType == 1 ? "个体工商户" : bondData.biddersType == 2 ? "企业主体" : bondData.biddersType == 3 ? "无要求" : '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={6}>竞买人注册资本</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.biddersRegistered ? `${bondData.biddersRegistered}万元` : '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={6}>竞买人经营地址</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.biddersProvince || "--"}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={6}>竞买人资质许可</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.biddersQualification ? bondData.biddersQualification : bondData.biddersQualificationOther ? bondData.biddersQualificationOther : '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={6}>竞买人报价税率</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.biddersTaxFalg == 1 ? "报价不含税" : "报价含税" + bondData.biddersTax + "%"}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={6}>拆卸情况：</Col>
                                        <Col className="reuse_value" span={span[1]}>{bondData.disassembleFlag==1 ? "需买方自行拆卸" : "无需拆卸可直接清运"}</Col>
                                    </Row>
                                </div>
                            </div>
                        </Card>
                        <Card className="mb20" bordered={false} title="中标人及报价信息">
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>供应商名称</Col>
                                <Col className="reuse_value" span={span[1]}><span>{bidCompanyInfo.name}</span><a href={"javascript:;"} >  &nbsp;&nbsp;&nbsp;{bondData.disposerType}</a></Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>注册资本</Col>
                                <Col className="reuse_value" span={span[1]}>{bidCompanyInfo.registeredCaptial}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>企业类型</Col>
                                <Col className="reuse_value" span={span[1]}>{bidCompanyInfo.factoryType == 1 ? '厂家' : bidCompanyInfo.factoryType == 2 ? '集成商' : '个体户'}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>公司所在地</Col>
                                <Col className="reuse_value" span={span[1]}>{bidCompanyInfo.address}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>报价联系人</Col>
                                <Col className="reuse_value" span={span[1]}>{bidCompanyInfo.offerUserName}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>报价有效期</Col>
                                <Col className="reuse_value" span={span[1]}>{bidCompanyInfo.effective_date}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>报价说明</Col>
                                <Col className="reuse_value" span={span[1]}>{bidCompanyInfo.remark}</Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col className="reuse_label" span={2}>报价附件</Col>
                                <Col className="reuse_value" span={span[1]}>
                                    {   (bidInfoData.attachmentMap && bidInfoData.attachmentMap.length>0 )? bidInfoData.attachmentMap.map((item) => {
                                        return <p><a href={item.url}> {item.name}</a> <br/></p>
                                    }):"暂无附件"}
                                </Col>
                            </Row>
                        </Card>
                        <Card className="mb20" bordered={false} title={this.state.cardTitle}>
                            <BaseTable
                                url='@/reuse/newBidApprove/queryOfferDetail'
                                tableState={this.state.tableState}
                                indexkey_fixed={false}
                                baseParams={this.baseParams}
                                columns={this.columns} />
                        </Card>
                        <Card  className="mb20" bordered={false}>
                            <div className={less.wid40}>
                                <div className={less.disleft}>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="10">处置/计价方式</Col>
                                        <Col className={less.colorbottred} span="10">{bondData.pricingMethod ==1 ? '按批次计价' : '按重量计价'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="8">单位价格</Col>
                                        <Col className={less.colorbottred} span="12">{bondData.pricingMethod ==1 ?'-' : Util.computeUnitPrice(bidCompanyInfo.sumAmt,bidCompanyInfo.sumNum)}</Col>
                                    </Row>
                                </div>
                                <div className={less.disleft}>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="5">税额</Col>
                                        <Col className={less.colorbottred} span="15">{(bondData.biddersTaxFalg == 2 && bondData.biddersTax) ? Util.computeTax(bidCompanyInfo.sumAmt, bondData.biddersTax) : '-'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span="5">金额</Col>
                                        <Col className={less.colorbottred} span="15">{(bondData.biddersTaxFalg == 2 && bondData.biddersTax) ? bidCompanyInfo.sumAmt-Util.computeTax(bidCompanyInfo.sumAmt, bondData.biddersTax) : bidCompanyInfo.sumAmt}</Col>
                                    </Row>
                                </div>
                            </div>
                            <Row className={less.wid50}>
                                <Col className={less.fonts20} span="8">税价合计:</Col>
                                <Col className={less.fontsred20} span="12">¥{bidCompanyInfo.sumAmt}</Col>
                            </Row>
                        </Card>
                        <Card className="mb20" bordered={false} title="竞买人名单">

                            <ToggleTable no_selection={true}
                                         sortChange={this.getSignPurchaser}
                                         dataSource={signPurchaserList || []}
                                         columns={this.jingmaicolumns}
                                         loading={signPurchaserLoading}>
                            </ToggleTable>

                       {/*     <BaseTable
                                url='@/reuse/saleScene/findPage'
                                tableState={this.state.tableState}
                                indexkey_fixed={false}
                                baseParams={this.baseParams}
                                columns={this.jingmaicolumns} />*/}
                        </Card>
                        {/*<Card className={less.mb100} bordered={false} title="审批记录">
                            <div className={less.borderbottom}>
                                <div className={less.flex}>
                                    <div className={less.disleft}>

                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={span[0]}>审批方式</Col>
                                            <Col className={less.textcolor} span={span[1]}>{bondData.workOrder}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={span[0]}>模版名称</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={span[0]}>审批金额</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={span[0]}>审批机制</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={span[0]}>审批附件</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                                        </Row>
                                    </div>
                                    <div className={less.disright}>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={6}>择标人</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={6}>择标时间</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.workOrder}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={6}>备注</Col>
                                            <Col className="reuse_value" span={span[1]}>{bondData.forfeitureReason}</Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                            <BaseTable
                                url='@/reuse/saleScene/findPage'
                                tableState={this.state.tableState}
                                indexkey_fixed={false}
                                baseParams={this.baseParams}
                                columns={this.columns} />
                        </Card>*/}
                        <Card className="fixed_button">
                            <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                <Button  onClick={this.toBack}>关闭</Button>
                                <Button type="primary" onClick={this.handleToClick}>审 核</Button>
                                <Button type="primary" >下载PDF</Button>
                            </div>
                        </Card>
                        <Modal
                            title="请仔细核对提货单！"
                            maskClosable={false}
                            width={488}
                            visible={this.state.detailVisible}
                            onCancel={() => { this.setState({ detailVisible: false }) }}
                            footer={[

                                <Button  onClick={this.hideModal} >
                                    取消
                                </Button>,
                                <Button type="primary" onClick={this.handleSubmit} key={'submit'}>
                                    递交
                                </Button>
                            ]}
                        >

                            <NewForm ref='BaseForm'  formList={this.state.formList} importantFilter={this.importantFilter} wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>


                        </Modal>
                    </div>
                </Spin>
            </div>
        )
    }
}
