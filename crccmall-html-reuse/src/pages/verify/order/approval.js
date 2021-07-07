import React from 'react';
import { Spin, Card, Row, Col, Button, Icon, Modal, Form, Input, Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import ToggleTable from '@/components/toggleTable';
import api from '@/framework/axios';
import Util from '@/utils/util';
import FormatDate from '@/utils/date';
import { baseService } from '@/utils/common';
import { getSearchByHistory } from '@/utils/urlUtils';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './approval.less';
import download from "business/isViewDown";
//竞价状态
const _approvalStatusGroup = baseService.approvalStatusGroup;

class VerifyApproval extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user_info: {},
            spinning: true,
            orderData: {},
            approvalType: {},
            approvalVisible: false,
            defaultKey: '1'
        }
    }
    _uuids = null
    _type = null
    //审批方式
    _approvalGroup = [
        { id: '1', status: '30', value: '审批通过', style: { color: '#43CD89' } },
        { id: '2', status: '22', value: '驳回', style: { color: '#F50F50' } },
    ]

    config = {
        span: [3, 20],
        autosize: {
            minRows: 6,
            maxRows: 6
        },
        maxLength: 200
    }
    //竞价产品
    goodsCols = [
        {
            title: '物料名称',
            key: 'goodsName',
            dataIndex: 'goodsName',
            width: 100,
            className: 'text_line4_td'
        },
        {
            title: '规格',
            key: 'spec',
            dataIndex: 'spec',
            width: 100,
            className: 'text_line4_td'
        },
        {
            title: '品牌',
            key: 'brand',
            dataIndex: 'brand',
            width: 100,
            className: 'text_line4_td'
        },
        {
            title: '质量状况',
            key: 'quality',
            dataIndex: 'quality',
            width: 100,
            className: 'text_line4_td'
        },
        {
            title: '订单数量(单位)',
            key: 'num',
            dataIndex: 'num',
            width: 100,
            className: 'text_right',
            render(text, record) {
                return <span className="color_a">{text}/{record.unit}</span>
            }
        },
        {
            title: '单价(元)',
            key: 'price',
            className: 'text_right',
            dataIndex: 'price',
            width: 100,
            render(text, record) {
                return <span className="color_a">{numeral(text || 0).format('0,0.00')}</span>
            }
        },
    ]
    //审批记录
    approvalNotes = [
        {
            title: '审批次序',
            key: 'level',
            dataIndex: 'level',
            width: 100,
        },
        {
            title: '审批人',
            key: 'createUserName',
            dataIndex: 'createUserName',
            width: 100,
        },
        {
            title: '职务',
            key: 'roleName',
            dataIndex: 'roleName',
            width: 100,
            className: 'text_line4_td'
        },
        {
            title: '审批时间',
            key: 'createTime',
            dataIndex: 'createTime',
            width: 100,
            className: 'text_right',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? text.substr(0, 10) : ''}</p>
                        <p>{text ? text.substr(10) : ''}</p>
                        <p>{text ? '' : '--'}</p>
                    </div>
                )
            }
        },
        {
            title: '审批状态',
            key: 'resultStr',
            dataIndex: 'resultStr',
            width: 100,
            render: (text, record) => {
                let style = {};
                this._approvalGroup.forEach(v => {
                    if (v.id == record.result) style = v.style;
                })

                return <span style={style}>{text}</span>
            }
        },
        {
            title: '审批意见',
            key: 'approvalReason',
            dataIndex: 'approvalReason'
        },
    ]
    approvalNotes_2 = [
        {
            title: '审批次序',
            key: 'orderByStr',
            dataIndex: 'orderByStr',
            width: 100,
        },
        {
            title: '审批人',
            key: 'approvalUserName',
            dataIndex: 'approvalUserName',
            width: 100,
        },
        {
            title: '职务',
            key: 'roleName',
            dataIndex: 'roleName',
            width: 100,
            className: 'text_line4_td'
        },
        {
            title: '审批时间',
            key: 'approvalTime',
            dataIndex: 'approvalTime',
            width: 100,
            className: 'text_right',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? text.substr(0, 10) : ''}</p>
                        <p>{text ? text.substr(10) : ''}</p>
                        <p>{text ? '' : '--'}</p>
                    </div>
                )
            }
        },
        {
            title: '审批状态',
            key: 'statusFlagStr',
            dataIndex: 'statusFlagStr',
            width: 100,
            render: (text, record) => {
                let style = {};
                this._approvalGroup.forEach(v => {
                    if (v.id == record.status) style = v.style;
                })

                return <span style={style}>{text}</span>
            }
        },
        {
            title: '审批意见',
            key: 'remarks',
            dataIndex: 'remarks'
        },
    ]
    //订单日志
    orderNotes = [
        {
            title: '序号',
            key: 'indexkey',
            width: 80,
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: '操作人',
            key: 'createUserName',
            dataIndex: 'createUserName',
            width: 150,
        },
        {
            title: '时间',
            key: 'createTime',
            dataIndex: 'createTime',
            width: 150,
        },
        {
            title: '事件',
            key: 'remark',
            dataIndex: 'remark'
        },
    ]

    componentWillMount() {
        this.handleInit()
        this.getUser()
    }

    getUser = () => {
        let that = this;
        api.ajax('get', '@/common/user/getUser').then((res) => {
            if (res.data) {
                this.setState({
                    user_info: res.data
                })
            }
        }).catch(function (r) {
        })
    }

    handleInit = () => {
        const search = this.props.history.location.search;
        if (search) {
            let params = getSearchByHistory(search);
            if (params.type) {
                this._type = params.type;
            }
        }

        this._uuids = this.props.match.params.uuids;
        if (this._uuids) {
            this.getOrderInfo()
        }
    }

    //获取页面数据
    getOrderInfo = () => {
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/order/info', {
            uuids: this._uuids
        }).then(res => {
            if (res.data) {
                this.setState({
                    spinning: false,
                    orderData: res.data
                })
            } else {
                this.setState({
                    spinning: false,
                    orderData: {}
                })
            }
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        })
    }

    //过滤地域
    filterUseArea = (useArea) => {
        let area = [];
        if (useArea) {
            let areaArr = useArea.split(',');
            baseService.useAreaGroup.forEach(v => {
                if (areaArr.indexOf(v.id) !== -1) {
                    area.push(v.value)
                }
            })
        }
        return area.join(',')
    }

    toDetail = (uuid) => {
        window.open(systemConfigPath.jumpPage('/sale/sceneDetail/' + uuid));
    }

    //场次基本信息
    createOrderInfo = () => {
        const { orderData } = this.state;
        const { span } = this.config;
        let style = {};
        _approvalStatusGroup.forEach(v => {
            if (v.id == orderData.status) {
                style = v.style
            }
        });

        return (
            <div className={less.info} style={{fontSize :'14px !important' }}>
                <div className={less.info_status}>
                    <Row gutter={40}>
                        <Col span={18}>
                            <p className="font16">订单金额</p>
                            <p><span className="color_e font18">{numeral(orderData.amt || 0).format('0,0.00')}</span>元</p>
                        </Col>
                        <Col span={6} className="font18">
                            <p className="font16">状态</p>
                            <p style={style}>{orderData.statusStr}</p>
                        </Col>
                    </Row>
                </div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>订单号</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.code || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>订单来源</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.sourceStr}(<a onClick={() => this.toDetail(orderData.businessId)} style={{ color: '#61ccfa', textDecoration: 'underline' }}>{orderData.businessCode}</a>)</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>下单日期</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.confirmTime || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售单位</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.saleCompanyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售项目部</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.saleDeptName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售联系人/电话</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{orderData.contacts}</span>
                        <span className="ml10">{orderData.contactsTel}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>采购单位</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.buyerCompanyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>采购联系人/电话</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{orderData.offerContacts}</span>
                        <span className="ml10">{orderData.offerContactsTel}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>付款方式</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.payWayStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>付款时间</Col>
                    <Col className="reuse_value" span={span[1]}>成交后 {orderData.payTime} 天内</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>货品所在地</Col>
                    <Col className="reuse_value" span={span[1]}>{orderData.goodsAddr || '--'}</Col>
                </Row>
            </div>
        )
    }

    //返回
    toBack = () => {
        this.props.history.push('/verify/order')
    }
    openApproval = (n) => {
        this.props.form.resetFields()
        this.setState({
            remark: '',
            approvalType: this._approvalGroup[n],
            approvalVisible: true,
        })
    }
    //审批确认
    toApproval = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const { approvalType, orderData } = this.state;
                //1通过，2驳回
                let url;
                let params = {
                    businessId: orderData.uuids,
                    businessNo: orderData.code,
                    approvalType: orderData.approvalType,
                    remarks: values.remark,
                    amount: orderData.amt,
                    msgPhone: orderData.contactsTel,
                    receiveCompanyId: orderData.createCompanyId,
                }
                if (approvalType.id == '1') {
                    url = '@/reuse/orderApprove/adopt'
                }
                if (approvalType.id == '2') {
                    url = '@/reuse/orderApprove/refuse'
                }
                if (!url) return;
                api.ajax('POST', url, params).then(res => {
                    this.setState({
                        approvalVisible: false
                    })
                    if (approvalType.id == '2' || approvalType.id == '1') {
                        setTimeout(() => {
                            this.props.history.push('/verify/order')
                        }, 1000)
                    }
                    this.handleInit()
                    Util.alert(res.msg, { type: 'success' })
                }, error => {
                    Util.alert(error.msg, { type: 'error' })
                })
            }
        })
    }
    //理由onchang
    remarkChange = (el) => {
        this.setState({
            remark: el.target.value
        })
    }
    //tab切换
    tabChange = (prop) => {

    }

    render() {
        const { orderData, approvalType, remark, defaultKey } = this.state;
        const { getFieldProps } = this.props.form;
        let goodsList = orderData.goodsList || [],
            reApprovalLogList = orderData.reApprovalLogList || [],
            reApprovalFlowPlus = orderData.reApprovalFlowPlus || {}
        let logList = orderData.logList || []
        let modes = {
            1: '依次审批',
            2: '会签',
            3: '或签'
        }

        return (
            <Spin spinning={this.state.spinning}>
                <div className={less.order}>
                    <Form>
                        <Card title="订单详情">
                            <div>{this.createOrderInfo()}</div>
                        </Card>
                        <Card className="mt10 baseTabs">
                            <Tabs defaultActiveKey={defaultKey}
                                onChange={this.tabChange}>
                                <TabPane tab="商品信息" key="1">
                                    <ToggleTable no_selection={true}
                                        dataSource={goodsList}
                                        columns={this.goodsCols}></ToggleTable>
                                    <div className="mt10 mb10 text_r">
                                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>订单金额：<span className="color_e font20">￥{numeral(orderData.amt).format('0,0.00')}</span>元</span>
                                    </div>
                                </TabPane>
                                <TabPane tab="审批记录" key="2">
                                    {/* 1 线下, 2 线上 */}
                                    {
                                        orderData.approvalType == '1'
                                            ? <div style={{fontSize :'14px !important' }}>
                                                <Row className="reuse_row" gutter={20}>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={3}>审批方式</Col>
                                                        <Col className="reuse_value" span={18}>
                                                            {
                                                                orderData.approvalType == '1' ? '线下' : '线上'
                                                            }
                                                        </Col>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批附件</Col>
                                                        <Col className="reuse_value" span={18}>
                                                            {orderData.approvalFileName ? <a className="reuse_link"
                                                                href="javascript:void(0);"
                                                                onClick={() => download(orderData.approvalFileName, systemConfigPath.fileDown(orderData.approvalFile), true)}
                                                            >
                                                                <span>{orderData.approvalFileName}</span>
                                                            </a> : '--'}
                                                        </Col>
                                                    </Col>
                                                </Row>
                                                <ToggleTable no_selection={true}
                                                    dataSource={reApprovalLogList}
                                                    columns={this.approvalNotes}></ToggleTable>
                                            </div> : null
                                    }
                                    {
                                        orderData.approvalType == '2'
                                            ? <div style={{fontSize :'14px !important' }}>
                                                <Row className="reuse_row" gutter={20}>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批方式</Col>
                                                        <Col className="reuse_value" span={18}>
                                                            {
                                                                orderData.approvalType == 1 ? '线下' : '线上'
                                                            }
                                                        </Col>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批机制</Col>
                                                        <Col className="reuse_value" span={18}>{modes[orderData.reApprovalFlowPlus.mode]}</Col>
                                                    </Col>

                                                </Row>
                                                <Row className="reuse_row" gutter={20}>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批模板</Col>
                                                        <Col className="reuse_value" span={18}>{orderData.reApprovalFlowPlus.tempName || '--'}</Col>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批金额</Col>
                                                        <Col className="reuse_value" span={18}>{orderData.reApprovalFlowPlus.lowQuota} - {orderData.reApprovalFlowPlus.highQuota}万元</Col>
                                                    </Col>
                                                </Row>
                                                <ToggleTable no_selection={true}
                                                    dataSource={reApprovalFlowPlus.approvalList}
                                                    columns={this.approvalNotes_2}></ToggleTable>
                                            </div> : null
                                    }
                                </TabPane>
                                <TabPane tab="订单日志" key="3">
                                    <ToggleTable no_selection={true}
                                        dataSource={logList}
                                        columns={this.orderNotes}></ToggleTable>
                                </TabPane>
                            </Tabs>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                <Button className="fontS" onClick={this.toBack}>返回</Button>
                                {
                                    (this._type == 'approval' && orderData.status == 20 && !(orderData.approvalType == 2 && !orderData.reApprovalFlowPlus.currentUserId.split(',').includes(String(this.state.user_info.id))))
                                        ? <Button className="fontS" onClick={() => { this.openApproval(1) }}>驳回</Button>
                                        : null
                                }
                                {
                                    (this._type == 'approval' && orderData.status == 20 && !(orderData.approvalType == 2 && !orderData.reApprovalFlowPlus.currentUserId.split(',').includes(String(this.state.user_info.id))))
                                        ? <Button className="fontS" onClick={() => { this.openApproval(0) }} type="primary">通过</Button>
                                        : null
                                }
                            </div>
                        </Card>

                        <Modal
                            title="审批意见"
                            width={500}
                            visible={this.state.approvalVisible}
                            onOk={this.toApproval}
                            onCancel={() => { this.setState({ approvalVisible: false }) }}>
                            <Row className={less.modal_title}>
                                <Col className="reuse_label" span={5}>
                                    <span>业务类型</span>
                                </Col>
                                <Col className="reuse_value" span={18}>
                                    <span style={approvalType.style}>{approvalType.value || '--'}</span>
                                </Col>
                            </Row>
                            <FormItem>
                                <Input
                                    type="textarea"
                                    maxLength={200}
                                    placeholder="请输入审批意见"
                                    {...getFieldProps('remark', {
                                        rules: [
                                            { required: approvalType.value == '驳回', message: '请输入审批意见' }
                                        ],
                                        onChange: this.remarkChange
                                    })}
                                    autosize={{ minRows: 4, maxRows: 6 }}></Input>
                                <p className="text_r float_r">{remark ? remark.length : 0}/200</p>
                            </FormItem>
                        </Modal>
                    </Form>
                </div>
            </Spin>
        )
    }
}

export default Form.create()(VerifyApproval)
