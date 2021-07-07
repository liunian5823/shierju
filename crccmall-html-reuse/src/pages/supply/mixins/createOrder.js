import React from 'react';
import '../style/createOrder.css'
import {
    Table, Form, Button, Input, Row, Col, Popconfirm
} from 'antd';
import { baseService } from '@/utils/common'
import { closeWin } from "@/utils/dom";
import give from '@/static/svg/give.svg'
import api from "@/framework/axios";
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
const FormItem = Form.Item;
import { phone, required } from '@/utils/validator'
import Util from "@/utils/util";
const { _supplyMainBid } = baseService;
class CreateOrder extends React.Component {
    refs = null;
    constructor(props) {
        super(props);
        this.state = {
            datum: null,
            tableData: [],
            tabKey: 0,
        }
    }
    // 列表
    buyOrderInfo = [
        { label: '订单号', value: 'code' },
        { label: '订单来源', value: 'sourceStr', high: 'businessCode' },
        { label: '下单日期', value: 'bidTime' },
        { label: '销售单位', value: { value: 'saleCompanyName', span: 8, prop: 'saleCompanyName', hint: '请输入销售单位', type: 'input', rules: [required('请输入销售单位')] }, edit: true, required: true },
        { label: '销售项目部', value: { value: 'saleDeptName', span: 8, prop: 'saleDeptName', hint: '请输入销售项目部', type: 'input', rules: [required('请输入销售项目部')] }, edit: true, required: true },
        // { label: '销售项目部', value: 'saleDeptName'},
        {
            label: '联系人/电话', value: [
                { value: 'contacts', span: 8, prop: 'contacts', hint: '请输入联系人', type: 'input', rules: [required('请输入联系人')] },
                { value: 'contactsTel', span: 12, prop: 'contactsTel', hint: '请输入电话', type: 'number', rules: [required('请输入电话'), phone] }
            ], edit: true, required: true
        },
        { label: '采购单位', value: 'buyerCompanyName', maxLength: 200 },
        { label: '联系人/电话', value: ['offerContacts', 'offerContactsTel'] },
        { label: '付款方式', value: 'payWayStr' },
        { label: '付款时间', value: 'payTime' },
        { label: '货品所在地', value: 'goodsAddr' },
    ];
    sellOrderInfo = [
        { label: '订单号', value: 'code' },
        { label: '订单来源', value: 'sourceStr', high: 'businessCode' },
        { label: '下单日期', value: 'bidTime' },
        { label: '销售单位', value: 'saleCompanyName' },
        { label: '销售项目部', value: 'saleDeptName' },
        { label: '联系人/电话', value: ['contacts', 'contactsTel'] },
        { label: '采购单位', value: { value: 'buyerCompanyName', span: 8, prop: 'buyerCompanyName', hint: '请输入采购单位', type: 'input', rules: [required('请输入采购单位')], maxLength: 200 }, edit: true, required: true },
        {
            label: '联系人/电话', value: [
                { value: 'offerContacts', span: 8, prop: 'offerContacts', hint: '请输入联系人', type: 'input', rules: [required('请输入联系人')], maxLength: 50 },
                { value: 'offerContactsTel', span: 12, prop: 'offerContactsTel', hint: '请输入电话', type: 'number', rules: [required('请输入电话'), phone] }
            ], edit: true, required: true
        },
        { label: '付款方式', value: 'payWayStr' },
        { label: '付款时间', value: 'payTime' },
        { label: '货品所在地', value: 'goodsAddr' },
    ];
    componentDidMount() {
        this.columnsArr.goodsList = this.columns;
        this.initialization();
    }

    initialization() {
        const uuids = this.props.match.params.uuids;
        let params = this.type === 'info' ? {
            businessId: uuids,
            source: 2
        } : {
                uuids
            };
        if (uuids) {
            api.ajax('GET', this.initUrl, params).then(res => {
                if (res.data) {
                    res.data.goodsList = res.data.goodsList.map(value => {
                        return {
                            ...value,
                            unit: value.unit ? value.unit : '件'
                        }
                    })
                    this.setState({
                        datum: res.data,
                    }, () => this.switchTab(0));
                }
            }, e => Util.alert(e.msg, {
                type: 'error'
            }))
        }
    };
    // 列表事件
    goodListValueChange = (el, label, propname = 'value') => {
        const datum = this.state.datum;
        let values = el;
        if (values && values.target) {
            values = el.target[propname]
        }
        let goodsList = datum.goodsList.map((value, key) => {
            if (label === `goodsList[${key}].price`) {
                value.price = values;
            }
            if (label === `goodsList[${key}].num`) {
                value.num = values;
            }
            if (label === `goodsList[${key}].unit`) {
                value.unit = values;
            }
            return value
        });

        this.setState({
            datum: {
                ...datum,
                goodsList
            },
        })
    };
    //统一处理 普通onChange事件
    valueChange = (el, label, propname = 'value') => {
        const datum = this.state.datum;
        let value = el;
        if (value && value.target) {
            value = el.target[propname]
        }
        this.setState({
            datum: {
                ...datum,
                [label]: value
            },
        })
    };
    // 提交
    submit = () => {
        const uuids = this.props.match.params.uuids;
        this.props.form.validateFields((errors) => {
            if (!errors) {
                let data = JSON.parse(JSON.stringify(this.state.datum));
                data.goodsList = JSON.stringify(data.goodsList);
                data.amt = this.amt;
                let _this = this;
                api.ajax('post', this.submitUrl, data).then(data => {
                    if (data.code === '000000') {
                        Util.confirm('生成订单成功', {
                            tip: '是否返回列表？',
                            onOk() {
                                _this.props.history.push(_this.listRouter)
                            },
                            onCancel() {
                                _this.props.history.push(_this.deRouter + uuids)
                            }
                        })
                    }
                }, e => {
                    Util.alert(e.msg || '生成失败', {
                        type: 'error'
                    })
                })
            }
        });
    };
    // 求和
    sum = (arr) => {
        if (!arr.length) return 0;
        return arr.reduce(function (prev, curr) {
            return prev * curr;
        }).toFixed(2);
    };
    columnsArr = [
        {
            title: '审核人',
            width: 100,
            dataIndex: 'createUserName',
            key: 'createUserName',
        },
        {
            title: '审核时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
        },
        {
            title: '审核意见',
            dataIndex: 'remark',
            key: 'remark',
        }
    ];
    logoC = [
        {
            title: '操作人',
            width: 100,
            dataIndex: 'createUserName',
            key: 'createUserName',
        },
        {
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
        },
        { title: '事件', dataIndex: 'remark', key: 'remark' },
    ];
    get amt() {
        const goodsList = this.state.datum.goodsList.map(value => {
            return value.num * value.price
        });
        return this.sum(goodsList);
    }
    // 切换表格
    switchTab = (tabKey) => {
        let prop = ['goodsList', 'reApprovalLogList', 'logList'];
        let tableData = this.state.datum[prop[tabKey]];
        this.setState({
            tableData,
            tabKey
        });
    };

    toDetail = (uuid) => {
        window.open(systemConfigPath.jumpPage('/supply/sellDetail/' + uuid));
    }

    render() {
        let { datum } = this.state;
        const { getFieldProps } = this.props.form;
        if (!datum) return null;
        let status = _supplyMainBid.find(v => +v.id === datum.status);
        let columns = this.state.tabKey === 0 ? this.columns : this.state.tabKey === 1 ? this.columnsArr : this.logoC;
        return (
            <Form className="create">
                <p className="titleLittle bottomBor bgfff" style={{ padding: "10px 25px" }}>订单详情</p>
                <div className="flex vessel">
                    <div className="flexAuto padding-g">
                        {
                            (this.type === 'info' ? this.orderInfo : datum.supplyDemandType === 1 ? this.sellOrderInfo : this.buyOrderInfo).map(({ value, label, edit, required, high }, key) => {
                                if (edit) {
                                    if (Array.isArray(value)) {
                                        return (
                                            <div className="listContent flex" key={key}>
                                                <span className={['listLabel', 'textDark', required ? 'required' : 'requiredF'].join(" ")}>{label}</span>
                                                <Form.Item wrapperCol={{
                                                    span: 22
                                                }}>
                                                    <Input.Group compact>
                                                        <Row gutter={8}>
                                                            {
                                                                value.map(({ span, hint, value, prop, rules, maxLength }, indet, arr) => {
                                                                    return (
                                                                        <Col span={span} key={indet}>
                                                                            <FormItem
                                                                                noStyle
                                                                            >
                                                                                <Input {...getFieldProps(prop, {
                                                                                    rules,
                                                                                    initialValue: datum[value],
                                                                                    onChange: (el) => { this.valueChange(el, prop) }
                                                                                })} maxLength={maxLength} placeholder={hint} />
                                                                            </FormItem>
                                                                        </Col>
                                                                    )
                                                                })
                                                            }
                                                        </Row>
                                                    </Input.Group>
                                                </Form.Item>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="listContent flex" key={key}>
                                                <span className={['listLabel', 'textDark', value.prop === 'saleDeptName' ? '' : 'required'].join(" ")}>{label}</span>
                                                <FormItem
                                                    name={value.prop}
                                                    noStyle
                                                >
                                                    <Input style={{ width: '400px' }} {...getFieldProps(value.prop, {
                                                        initialValue: datum[value.value],
                                                        rules: value.prop === 'saleDeptName' ? [] : value.rules || [],
                                                        onChange: (el) => { this.valueChange(el, value.prop) }
                                                    })} maxLength={value.maxLength} placeholder={value.hint} />
                                                </FormItem>
                                            </div>
                                        )
                                    }
                                } else {
                                    return (
                                        <div className="listContent" key={key}>
                                            <span className="listLabel textDark">{label}</span>
                                            {Array.isArray(value) ? value.map(v => datum[v]).join(" ") :
                                                value === 'payTime' ?
                                                    !!datum[value] ? `成交后${datum[value]}天内` : '-'
                                                    :
                                                    datum[value] || '-'}
                                            {high ? (<span>(<a onClick={() => this.toDetail(datum['businessId'])} style={{ color: '#61ccfa', textDecoration: 'underline' }}>{datum[high]}</a>)</span>) : ''}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className="titleLittle colorGrey padding-g alignRight">
                        订单金额
                        <div className="price" content="元">{this.amt}</div>
                    </div>
                    <div className="titleLittle colorGrey padding-g alignRight">
                        状态
                        <div className="status" style={status.style}>{datum.statusStr}</div>
                    </div>
                </div>
                <div className="flex margin-s margin-top padding-g padding-way bottomBor bgfff fontSize_new">
                    {
                        ['商品信息', '审批记录', '订单日志'].map((value, key) => (
                            <div className={this.state.tabKey === key ? "classifyActive" : "classify"} onClick={() => { this.switchTab(key) }}>
                                {value}
                            </div>
                        ))
                    }
                </div>
                <div className="padding-g bgfff">
                    <Table columns={columns} dataSource={this.state.tableData} pagination={false} />
                    {/* <p className="padding-s bgGrey margin-l margin-row cursor alignCenter">
                        展开全部 <img width={10} height={10} src={give} alt="" />
                    </p> */}
                    <p className="titleLittle alignRight padding-s padding-row ">
                        订单金额：<span className="price" content="元">￥{this.amt}</span>
                    </p>
                </div>
                <div className="butList bgfff margin-s margin-top">

                    <Button onClick={closeWin}>关闭</Button>
                    &nbsp;&nbsp;
                    {
                        this.type !== 'info' &&
                        <Popconfirm title="确定同意生成订单吗?" onConfirm={this.submit}>
                            <Button type="primary">生成订单</Button>
                        </Popconfirm>

                    }
                </div>
            </Form>
        )
    }
}
export default CreateOrder
