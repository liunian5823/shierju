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
//竞价状态
const _approvalStatusGroup = baseService.approvalStatusGroup;

class BuyOrder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: true,
            orderData: {},
            defaultKey: '1',
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
        },
        {
            title: '审批时间',
            key: 'createTime',
            dataIndex: 'createTime',
            width: 100,
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
    //tab切换
    tabChange = (prop) => { }

    render() {
        const { orderData, defaultKey } = this.state;
        const { goodsList = [], logList = [] } = orderData;
        let sumAmt = 0;
        if (goodsList.length) sumAmt = goodsList[0].sumAmt;

        return (
            <Spin spinning={this.state.spinning}>
                <div className={less.order}>
                    <Form>
                        <Card title="订单详情">
                            <div>{this.createOrderInfo()}</div>
                        </Card>
                        <Card className="mt10 baseTabs" style={{ marginBottom: '80px' }}>
                            <Tabs defaultActiveKey={defaultKey}
                                onChange={this.tabChange}>
                                <TabPane tab="商品信息" key="1">
                                    <ToggleTable no_selection={true}
                                        dataSource={goodsList}
                                        columns={this.goodsCols}></ToggleTable>
                                    <div className="mt10 mb10 text_r">
                                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>订单金额：<span className="color_e font20">￥{numeral(orderData.amt || 0).format('0,0.00')}</span>元</span>
                                    </div>
                                </TabPane>
                                <TabPane tab="订单日志" key="3">
                                    <ToggleTable no_selection={true}
                                        dataSource={logList}
                                        columns={this.orderNotes}></ToggleTable>
                                </TabPane>
                            </Tabs>
                        </Card>
                        <Card className="fixed_button">
                            <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                <Button onClick={closeWin}>关闭</Button>
                            </div>
                        </Card>
                    </Form>
                </div>
            </Spin>
        )
    }
}

export default Form.create()(BuyOrder)
