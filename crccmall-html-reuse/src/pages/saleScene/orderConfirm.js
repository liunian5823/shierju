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
import less from './orderConfirm.less';
import download from "business/isViewDown";
//竞价状态
const _approvalStatusGroup = baseService.approvalStatusGroup;

class SaleOrderConfirm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: true,
            orderData: {},
            approvalType: {},

            defaultKey: '1',
            confirmData: {
                approvalType: '1',
                deptId: undefined,
                fileStr: null,
            }
        }
    }
    _uuids = null
    _type = null
    //审批方式
    _approvalGroup = [
        { id: '1', status: '30', value: '审批通过', style: { color: '#43CD89' } },
        { id: '2', status: '22', value: '驳回', style: { color: '#F50F50' } },
    ]
    _confirmGroup = [
        { value: '1', label: '线下' },
        { value: '2', label: '线上', disabled: true },
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
            render(text, record) {
                return <span className="color_a">{text}/{record.unit}</span>
            }
        },
        {
            title: '单价(元)',
            key: 'price',
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
            key: 'orderBy',
            dataIndex: 'orderBy',
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
        },
        {
            title: '审批时间',
            key: 'approvalTime',
            dataIndex: 'approvalTime',
            width: 100,
        },
        {
            title: '审批状态',
            key: 'statusFlag',
            dataIndex: 'statusFlag',
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
            width: 200,
        },
        {
            title: '时间',
            key: 'createTime',
            dataIndex: 'createTime',
            width: 200,
        },
        {
            title: '事件',
            key: 'remark',
            dataIndex: 'remark'
        },
    ]

    getOptions = (arr, value = 'value', label = 'label') => {
        return (
            arr.map(v => {
                return <Option value={v[value]} key={v[value]}>{v[label]}</Option>
            })
        )
    }

    componentWillMount() {
        this.handleInit()
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
            businessId: this._uuids,
            source: 1
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
        if (location.href.includes('sale')) {
            window.open(systemConfigPath.jumpPage('/sale/sceneDetail/' + uuid));
        } else {
            window.open(systemConfigPath.jumpPage('/buy/sceneDetail/' + uuid));
        }
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
                            <p><span className="color_e font14">{numeral(orderData.amt || 0).format('0,0.00')}</span>元</p>
                        </Col>
                        <Col span={6} className="font14">
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
                    <Col className="reuse_label" span={span[0]}>联系人/电话</Col>
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

        return (
            <div>
                <Row>
                    <Col className={less.label} span={3}>审批方式</Col>
                    <Col span={18}>
                        <FormItem>
                            <RadioGroup
                                {...getFieldProps('approvalType', {
                                    initialValue: confirmData.approvalType,
                                    rules: [
                                        { required: true, message: '请选择审批人' },
                                    ],
                                    onChange: (el) => { this.valueChange(el, 'approvalType') }
                                })}>
                                {
                                    this._confirmGroup.map(item => {
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
                                    tipText="支持格式为doc、xlsx、pdf、jpb、png单个文件"
                                    uploadSuccess={this.uploadSucFile}
                                    disabled={false}></UploadFile>

                                {
                                    confirmData.fileStr
                                        ? <a className="reuse_link"
                                            href="javascript:void(0);"
                                            onClick={() => download(confirmData.fileName, systemConfigPath.fileDown(confirmData.filePath))}
                                        >
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
                                <Col className={less.label} span={6}>模板名称</Col>
                                <Col span={18}>
                                    <FormItem>--</FormItem>
                                </Col>
                            </Col>
                            <Col span={12}>
                                <Col className={less.label} span={6}>审批机制</Col>
                                <Col span={18}>
                                    <FormItem>--</FormItem>
                                </Col>
                            </Col>
                            <Col>
                                <Col className={less.label} span={3}>审批人</Col>
                                <Col span={18}>
                                    <FormItem>
                                        <Select
                                            style={{ width: '180px' }}
                                            {...getFieldProps('deptId', {
                                                initialValue: confirmData.deptId,
                                                rules: [
                                                    { required: true, message: '请选择审批人' },
                                                ],
                                                onChange: (el) => { this.valueChange(el, 'deptId') }
                                            })}
                                            placeholder="请选择">
                                            {this.getOptions([
                                                { value: '1', label: '人1' },
                                                { value: '2', label: '人2' },
                                            ])}
                                        </Select>
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
        })
    }

    //返回
    toBack = () => {
        this.props.history.push('/verify/order')
    }
    //下单
    toOrder = () => {
        if (this.state.orderData.status != 10) {
            Util.alert('非下单状态!')
            return;
        }
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let { confirmData } = this.state;
                let params = {
                    ...confirmData
                }
                params.amt = this.state.orderData.amt;
                params.uuids = this.state.orderData.uuids;
                if (params.approvalType == '1' && !params.fileStr) {
                    Util.alert('请上传审批文件')
                    return;
                }

                api.ajax('POST', '@/reuse/order/confirmSceneOrder', params)
                    .then(res => {
                        this.handleInit()
                        // Util.alert(error.msg, 'success')
                        Util.alert(res.msg, { type: 'success' })
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
        const { orderData, approvalType, defaultKey } = this.state;
        const { goodsList = [], reApprovalLogList = [], logList = [] } = orderData;
        let sumAmt = 0;
        if (goodsList.length) sumAmt = goodsList[0].sumAmt;

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
                                        <span>订单金额：<span className="color_e font14">￥{numeral(sumAmt || 0).format('0,0.00')}</span>元</span>
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
                                                                onClick={() => download(orderData.approvalFileName, systemConfigPath.fileDown(orderData.approvalFile))}
                                                            >
                                                                <span>{orderData.approvalFileName}</span>
                                                            </a>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </div> : null
                                    }
                                    {
                                        orderData.approvalType == '2'
                                            ? <div>
                                                <Row className="reuse_row" gutter={20}>
                                                    <Col className="reuse_label" span={6}>审批方式</Col>
                                                    <Col className="reuse_value" span={18}>线上审批</Col>
                                                </Row>
                                                <Row className="reuse_row" gutter={20}>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批模板</Col>
                                                        <Col className="reuse_value" span={18}>{orderData.tempName || '--'}</Col>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Col className="reuse_label" span={6}>审批金额</Col>
                                                        <Col className="reuse_value" span={18}>{orderData.amt || '--'}</Col>
                                                    </Col>
                                                </Row>
                                            </div> : null
                                    }
                                    {
                                        (orderData.approvalType == '1' || orderData.approvalType == '2') ? '' : '暂无数据'
                                    }
                                    <ToggleTable no_selection={true}
                                        dataSource={reApprovalLogList}
                                        columns={this.approvalNotes}></ToggleTable>
                                </TabPane>
                                <TabPane tab="订单日志" key="3">
                                    <ToggleTable no_selection={true}
                                        dataSource={logList}
                                        columns={this.orderNotes}></ToggleTable>
                                </TabPane>
                            </Tabs>
                        </Card>
                        {
                            (orderData.status == 10 && this._type == 'confirm')
                                ? <Card className="mt10" title="审批信息">{this.getConfirmInfo()}</Card>
                                : null
                        }
                        <Card className="mt10">
                            <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                <Button onClick={closeWin}>取消</Button>
                                {
                                    (orderData.status == 10 && this._type == 'confirm')
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

export default Form.create()(SaleOrderConfirm)
