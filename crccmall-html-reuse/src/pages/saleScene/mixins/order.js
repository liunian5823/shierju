import React from 'react';
import { Spin, Card, Row, Col, Button, Icon, Modal, Form, Input, Tabs, Radio, Select } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import ToggleTable from '@/components/toggleTable';
import UploadFile from '@/components/uploadFile';
import api from '@/framework/axios';
import Util from '@/utils/util';
import { closeWin, filePathDismant } from '@/utils/dom';
import { baseService } from '@/utils/common';
import { getSearchByHistory } from '@/utils/urlUtils';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './order.less';
import download from "business/isViewDown";
//竞价状态
const _approvalStatusGroup = baseService.approvalStatusGroup;

class Order extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            _confirmGroup: [
                { value: '1', label: '线下' },
                { value: '2', label: '线上' },
            ],
            temp_info: {
                userGroup: []
            },
            spinning: true,
            orderData: {},
            approvalType: {},

            defaultKey: '1',
            confirmData: {
                approvalType: '1',
                deptId: undefined,
                fileStr: null,
                fileName: null,
            }
        }
    }
    _uuids = null
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
            dataIndex: 'price',
            width: 100,
            className: 'text_right',
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
            className: 'text_line4_td',
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
            className: 'text_line4_td',
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

    getApprovalStas = () => {
        return api.ajax('GET', '@/reuse/orderApprove/set/get')
            .then(res => {
                this.isEnable = res.data && res.data.isEnable == 1
                this.setState({
                    _confirmGroup: [
                        { value: '1', label: '线下审批' },
                        { value: '2', label: '线上审批', disabled: !this.isEnable },
                    ]
                })
            })
    }

    getOptions = (arr, value = 'value', label = 'label') => {
        return (
            arr.map(v => {
                return <Option value={v[value]} key={v[value]}>{v[label]}</Option>
            })
        )
    }

    //获取页面数据
    getOrderInfo = (params) => {
        if (!params) return;
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/order/info', params)
            .then(res => {
                if (res.data) {
                    let approvalType = res.data.approvalType
                    if (approvalType == '2') {
                        if (this.isEnable) {

                        } else {
                            approvalType = '1'
                        }
                    }
                    this.setState({
                        spinning: false,
                        orderData: res.data || {},
                        confirmData: {
                            approvalType,
                            fileStr: res.data.approvalFile,
                            fileName: res.data.approvalFileName,
                        }
                    }, () => {
                        if (approvalType == '2') {
                            api.ajax('get', '@/reuse/orderApprove/accord', {
                                deptId: this.state.orderData.saleDeptId,
                                quota: this.state.orderData.amt / 10000
                            })
                                .then(res => {
                                    this.setState({
                                        temp_info: res.data || {}
                                    })
                                }, error => {
                                    Util.alert(error.msg, 'error')
                                })
                        }
                    })
                } else {
                    this.setState({
                        spinning: false
                    })
                }
            }, error => {
                this.setState({
                    spinning: false
                })
                Util.alert(error.msg, { type: 'error' })
            })
    }

    toDetail = (uuid) => {
        if (location.href.includes('sale')) {
            window.open(systemConfigPath.jumpPage('/sale/sceneDetail/' + uuid));
        } else {
            window.open(systemConfigPath.jumpPage('/buy/sceneDetail/' + uuid));
        }
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
            <div className={less.info}>
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
                    <Col className="reuse_label" span={span[0]}>发布人/电话</Col>
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
                    <Col className="reuse_label" span={span[0]}>联系人/电话</Col>
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
    //审批信息
    getConfirmInfo = () => {
        const { confirmData } = this.state;
        const { getFieldProps } = this.props.form;
        let modes = {
            1: '依次审批',
            2: '会签',
            3: '或签'
        }

        return (
            <div>
                <Row>
                    <Col className={less.label} span={3}><span style={{ color: 'red' }}>*</span> 审批方式:</Col>
                    <Col span={18}>
                        <FormItem>
                            <RadioGroup
                                {...getFieldProps('approvalType', {
                                    initialValue: confirmData.approvalType,
                                    rules: [
                                        { required: true, message: '请选择审批方式' },
                                    ],
                                    onChange: (el) => { this.valueChange(el, 'approvalType') }
                                })}>
                                {
                                    this.state._confirmGroup.map(item => {
                                        return <Radio key={item.value} value={item.value} disabled={item.disabled}>{item.label}</Radio>
                                    })
                                }
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                {
                    confirmData.approvalType == '1'
                        ? <Row>
                            <Col className={less.label} span={3}><span style={{ color: '#ed332a' }}></span> 审批文件</Col>
                            <Col span={18}>
                                <UploadFile
                                    tip
                                    tipText="支持格式为doc、xlsx、pdf、jpg、png单个文件"
                                    uploadSuccess={this.uploadSucFile}
                                    disabled={false}></UploadFile>
                                <p>&nbsp;</p>
                                {
                                    confirmData.fileStr
                                        ? <a className="reuse_link"
                                            href="javascript:void(0);"
                                            onClick={() => download(confirmData.fileName || confirmData.fileStr, systemConfigPath.fileDown(confirmData.fileStr))}>
                                            <Icon type="paper-clip" />
                                            <span>{confirmData.fileName || confirmData.fileStr}</span>
                                        </a> : null
                                }
                            </Col>
                        </Row> : null
                }
                {
                    confirmData.approvalType == '2'
                        ? <Row>
                            <Col span={12}>
                                <Col className={less.label} span={6}>模板名称:</Col>
                                <Col span={18}>
                                    <FormItem>{this.state.temp_info.name}</FormItem>
                                </Col>
                            </Col>
                            <Col span={12}>
                                <Col className={less.label} span={6}>审批机制:</Col>
                                <Col span={18}>
                                    <FormItem>{modes[this.state.temp_info.mode]}</FormItem>
                                </Col>
                            </Col>
                            <Col>
                                <Col className={less.label} span={3}>审批人:</Col>
                                <Col span={18}>
                                    <FormItem>
                                        {this.state.temp_info.userGroup.map((ele, index) => {
                                            return <FormItem style={{ marginRight: '20px', display: 'inline-block' }}>
                                                {ele[0].groupName}：
                                                <Select
                                                    style={{ width: '180px' }}
                                                    {...getFieldProps(`examType_${index}`, {
                                                        rules: [
                                                            { required: true, message: '请选择审批人' },
                                                        ],
                                                        onChange: (el) => { this.valueChange(el, `examType_${index}`) }
                                                    })}
                                                    placeholder="请选择">
                                                    {this.getOptions(
                                                        ele.map(elem => {
                                                            return { value: elem.userId, label: elem.userName }
                                                        })
                                                    )}
                                                </Select>
                                            </FormItem>
                                        })}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Row> : null
                }
            </div>
        )
    }
    uploadSucFile = (file) => {
        let { confirmData } = this.state;
        confirmData.fileStr = file.response.data;
        confirmData.fileName = filePathDismant(file.response.data).fileName;
        this.setState({
            confirmData
        })
    }
    //onCange
    valueChange = (el, label) => {
        let { confirmData } = this.state;
        let value = el;
        if (value.target) {
            value = el.target.value
        }
        confirmData[label] = value;
        this.setState({
            confirmData
        }, () => {
            if (label == 'approvalType' && this.state.confirmData.approvalType == 2) {
                api.ajax('get', '@/reuse/orderApprove/accord', {
                    deptId: this.state.orderData.saleDeptId,
                    quota: this.state.orderData.amt / 10000
                })
                    .then(res => {
                        this.setState({
                            temp_info: res.data || {}
                        })
                    }, error => {
                        Util.alert(error.msg, 'error')
                    })
            }
        })

    }
    //下单
    toOrder = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let { confirmData } = this.state;
                let params = {
                    ...confirmData
                }
                if (params.approvalType == 2) {
                    for (const key in params) {
                        if (params.hasOwnProperty(key) && key.startsWith('examType_')) {
                            let index = key.split('_')[1]
                            // params[key] = this.state.temp_info.userGroup[index][0].groupName + '-' + params[key]
                            params[key] = +index + 1 + '-' + params[key]
                        }
                    }
                    params.tempId = this.state.temp_info.uuids
                    let arr = []
                    for (let index = 0; index < this.state.temp_info.userGroup.length; index++) {
                        arr.push(index)
                    }
                    params.examKeysStr = arr.join('-')
                }
                params.amt = this.state.orderData.amt;
                params.uuids = this.state.orderData.uuids;
                // if (params.approvalType == '1' && !params.fileStr) {
                //     Util.alert('请上传审批文件')
                //     return;
                // }

                api.ajax('POST', '@/reuse/order/confirmSceneOrder', params)
                    .then(res => {
                        this.handleInit()
                        // Util.alert(res.msg, 'success')
                        Util.alert(res.msg, { type: 'success' })
                        sessionStorage.SaleSceneStatus = '60'
                        this.props.history.push('/order/orderSellerList')
                    }, error => {
                        // Util.alert(error.msg, 'error')
                        Util.alert(error.msg, { type: 'error' })
                    })
            }
        })
    }
    //tab切换
    tabChange = (prop) => { }

    render() {
        const { orderData = {}, approvalType, defaultKey } = this.state;
        const goodsList = orderData.goodsList || [],
            reApprovalLogList = orderData.reApprovalLogList || [],
            reApprovalFlowPlus = orderData.reApprovalFlowPlus || {},
            logList = orderData.logList || [];
        let sumAmt = 0;
        if (goodsList.length) sumAmt = goodsList[0].sumAmt;
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
                        <Card className="mt10 baseTabs" style={{ marginBottom: ((orderData.status == 10 || orderData.status == 15) && this._type == 'confirm') ? '' : '80px' }}>
                            <Tabs defaultActiveKey={defaultKey}
                                onChange={this.tabChange}>
                                <TabPane tab="商品信息" key="1">
                                    <ToggleTable no_selection={true}
                                        dataSource={goodsList || []}
                                        columns={this.goodsCols}></ToggleTable>
                                    <div className="mt10 mb10 text_r">
                                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>订单金额：<span className="color_e font20">￥{numeral(orderData.amt || 0).format('0,0.00')}</span>元</span>
                                    </div>
                                </TabPane>
                                <TabPane tab="审批记录" key="2">
                                    {/* 1 线下, 2 线上 */}
                                    {
                                        orderData.approvalType == '1'
                                            ? <div>
                                                <Row className="reuse_row" gutter={20}>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批方式</Col>
                                                        <Col className="reuse_value" span={18}>线下审批</Col>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批附件</Col>
                                                        <Col className="reuse_value" span={18}>
                                                            <a className="reuse_link"
                                                                href="javascript:void(0);"
                                                                onClick={() => download(orderData.approvalFileName, systemConfigPath.fileDown(orderData.approvalFile), true)}
                                                            >
                                                                <span>{orderData.approvalFileName || '--'}</span>
                                                            </a>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                                <ToggleTable no_selection={true}
                                                    dataSource={reApprovalLogList}
                                                    columns={this.approvalNotes}></ToggleTable>
                                            </div>
                                            : null
                                    }
                                    {
                                        orderData.approvalType == '2'
                                            ? <div>
                                                <Row className="reuse_row" gutter={20}>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批方式</Col>
                                                        <Col className="reuse_value" span={18}>线上审批</Col>
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
                                    {
                                        (orderData.approvalType == '1' || orderData.approvalType == '2') ? '' : '暂无数据'
                                    }
                                </TabPane>
                                <TabPane tab="订单日志" key="3">
                                    <ToggleTable no_selection={true}
                                        dataSource={logList}
                                        columns={this.orderNotes}></ToggleTable>
                                </TabPane>
                            </Tabs>
                        </Card>
                        {
                            ((orderData.status == 10 || orderData.status == 15) && this._type == 'confirm')
                                ? <Card className="mt10" style={{ marginBottom: '80px' }} title="审批信息">{this.getConfirmInfo()}</Card>
                                : null
                        }
                        <Card className="fixed_button">
                            <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                <Button onClick={closeWin}>关闭</Button>
                                {
                                    ((orderData.status == 10 || orderData.status == 15) && this._type == 'confirm')
                                        ? <Button type="primary" onClick={this.toOrder}>下单</Button>
                                        : null
                                }
                            </div>
                        </Card>
                    </Form>
                </div>
            </Spin>
        )
    }
}

export default Order
