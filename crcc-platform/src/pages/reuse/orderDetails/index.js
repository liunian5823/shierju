import React from 'react';
import './index.css'
import {
    Table, Form, Button, Input, Row, Col
} from 'antd';
import give from '@/static/svg/give.svg'
import api from "@/framework/axios";

const FormItem = Form.Item;
import { required } from '@/utils/validator'
import Util from "@/utils/util";
import BaseAffix from "@/components/baseAffix";
import { configs } from '@/utils/config/systemConfig';
import download from "@/pages/reuse/utils/isViewDown";
import ToggleTable from "@/components/toggleTable";

function toFixed(num, d) {
    if (!num) { return '0.00' }
    var s = num + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 0) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return num + "";
}

let { resourceUrl } = configs;
const _supplyMainBid = [
    {
        value: '待确认',
        id: '10',
        note: '',
        style: {
            color: '#fcc372'
        }
    },
    {
        value: '待审批',
        id: '20',
        style: {
            color: '#3ac8f7'
        }
    },
    {
        value: '已驳回',
        id: '15',
        note: '',
        style: {
            color: '#D5D5D5'
        }
    },
    {
        value: '已成交',
        id: '50',
        note: '',
        style: {
            color: '#6ad59c'
        }
    }
];

class CreateOrder extends React.Component {
    refs = null;

    constructor(props) {
        super(props);
        this.state = {
            datum: {
                reApprovalLogList: [],
                reApprovalFlowPlus: {}
            },
            tableData: [],
            tabKey: 0,
            isOpen: false,
        }
    }

    componentDidMount() {
        this.columnsArr.goodsList = this.columns;
        this.initialization();
    }

    initialization() {
        const uuids = this.props.match.params.uuids;
        let params = {
            uuids
        };
        if (uuids) {
            api.ajax('GET', this.initUrl, params).then(res => {
                if (res.data) {
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
    sum = (arr) => {
        if (!arr.length) return 0;
        return arr.reduce(function (prev, curr) {
            return prev * curr;
        });
    };
    //审批方式
    _approvalGroup = [
        { id: '1', value: '审批通过', style: { color: '#43CD89' } },
        { id: '2', value: '驳回', style: { color: '#F50F50' } },
    ]
    columnsArr = [
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
            render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
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
                });
                return <span style={style}>{text}</span>
            }
        },
        {
            title: '审批意见',
            key: 'approvalReason',
            dataIndex: 'approvalReason',
            render: text => {
                return text || '--'
            }
        },
    ];
    //审批记录
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
            render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
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
            dataIndex: 'remarks',
            render: text => {
                return text || '--'
            }
        },
    ]
    logoC = [
        {
            title: '操作人',
            width: 150,
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
        const goodsList = (this.state.datum.goodsList || []).map(value => {
            return value.num * value.price
        });
        return this.sum(goodsList);
    }

    // 切换表格
    switchTab = (tabKey) => {
        let prop = ['goodsList', 'reApprovalLogList', 'logList'];
        let tableData = this.state.datum[prop[tabKey]];
        if (Array.isArray(tableData) && this.state.isOpen) {
            if (tableData.length > 3) {
                tableData = tableData.slice(0, 3)
            }
        }
        this.setState({
            tableData,
            tabKey
        });
    };
    switchOpen = () => {
        this.setState({
            isOpen: !this.state.isOpen
        }, () => {
            this.switchTab(this.state.tabKey)
        })
    };
    handleGoBack = () => {
        this.props.history.goBack()
    };
    // type
    type = 'info';
    // 详情接口
    initUrl = '**/reuse/order/info';
    // 列表
    orderInfo = [
        { label: '订单号', value: 'code' },
        { label: '订单来源', value: 'sourceStr', high: 'businessCode' },
        { label: '下单日期', value: 'createTime' },
        { label: '供货单位', value: 'saleCompanyName' },
        { label: '供货项目部', value: 'saleDeptName' },
        { label: '联系人/电话', value: ['contacts', 'contactsTel'] },
        { label: '采购单位', value: 'buyerCompanyName' },
        { label: '联系人/电话', value: ['offerContacts', 'offerContactsTel'] },
        { label: '付款方式', value: 'payWayStr' },
        { label: '付款时间', value: 'payTime' },
        { label: '货品所在地', value: 'goodsAddr' },
    ];
    columns = [
        {
            title: '物料名称', dataIndex: 'goodsName', key: 'goodsName', render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
        },
        {
            title: '规格', dataIndex: 'spec', key: 'spec', render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
        },
        {
            title: '品牌', dataIndex: 'brand', key: 'brand', render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
        },
        {
            title: '质量状况', dataIndex: 'quality', key: 'quality', render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
        },
        {
            title: '订单数量/单位',
            dataIndex: 'num',
            key: 'num',
            width: '180',
            className: 'text_right',
            render: (value, data) => <span className='reuse_money'>{`${value} ${data.unit}`}</span>
        },
        {
            title: '单价（元）',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            className: 'text_right',
            render: (value) => <span className='reuse_money'>{toFixed(value, 2)}</span>
        },
    ];

    toDetail = (source,uuid) => {
        if (source === 1) {
            window.open(window.location.href.split('#')[0] + '#/reuse/bidManagement/details/' + uuid);
        } else {
            window.open(window.location.href.split('#')[0] + '#/reuse/supplyLook/details/' + uuid);
        }
    };

    render() {
        let { datum } = this.state;
        const reApprovalLogList = datum.reApprovalLogList || [],
            reApprovalFlowPlus = datum.reApprovalFlowPlus || {}
        const { getFieldProps } = this.props.form;
        if (!datum) return null;
        let status = _supplyMainBid.find(v => +v.id === datum.status) || {};
        let columns = this.state.tabKey === 0 ? this.columns : this.state.tabKey === 2 ? this.logoC : this.state.datum.approvalType == 1 ? this.columnsArr : this.approvalNotes_2;
        let modes = {
            1: '依次审批',
            2: '会签',
            3: '或签'
        };

        return (
            <Form className="create">
                <p className="titleLittle bottomBor bgfff" style={{ padding: "10px 25px" }}>订单详情</p>
                <div className="flex vessel">
                    <div className="flexAuto padding-g">
                        {
                            this.orderInfo.map(({ value, label, edit, required, high }, key) => {
                                if (edit) {
                                    if (Array.isArray(value)) {
                                        return (
                                            <div className="listContent flex" key={key}>
                                                <span
                                                    className={['listLabel', 'textDark', required ? 'required' : 'requiredF'].join(" ")}>{label}</span>
                                                <Form.Item wrapperCol={{
                                                    span: 22
                                                }}>
                                                    <Input.Group compact>
                                                        <Row gutter={8}>
                                                            {
                                                                value.map(({ span, hint, value, prop, rules }, indet, arr) => {
                                                                    return (
                                                                        <Col span={span} key={indet}>
                                                                            <FormItem
                                                                                noStyle
                                                                            >
                                                                                <Input {...getFieldProps(prop, {
                                                                                    rules,
                                                                                    initialValue: datum[value],
                                                                                    onChange: (el) => {
                                                                                        this.valueChange(el, prop)
                                                                                    }
                                                                                })} placeholder={hint} />
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
                                                <span
                                                    className={['listLabel', 'textDark', required ? 'required' : ''].join(" ")}>{label}</span>
                                                <FormItem
                                                    name={value.prop}
                                                    noStyle
                                                >
                                                    <Input {...getFieldProps(value.prop, {
                                                        initialValue: datum[value.value],
                                                        rules: value.rules,
                                                        onChange: (el) => {
                                                            this.valueChange(el, value.prop)
                                                        }
                                                    })} placeholder={value.hint} />
                                                </FormItem>
                                            </div>
                                        )
                                    }
                                } else {
                                    return (
                                        <Row className="reuse_row" key={key}>
                                            <Col className="reuse_label" span={3}>{label}</Col>
                                            <Col className="reuse_value" span={20}>
                                                {Array.isArray(value) ? value.map(v => datum[v]).join(" ") :
                                                    value === 'payTime' ?
                                                        !!datum[value] ? `成交后${datum[value]}天后` : '-'
                                                        :
                                                        datum[value] || '-'}
                                                {high ? (<span>(<a onClick={() => this.toDetail(datum['source'],datum['businessId'])} style={{ color: '#61ccfa', textDecoration: 'underline', cursor: 'pointer' }}>{datum[high]}</a>)</span>) : ''}
                                            </Col>
                                        </Row>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className="titleLittle colorGrey padding-g alignRight">
                        订单金额
                        <div className="price" content="元">{toFixed(datum.amt, 2)}</div>
                    </div>
                    <div className="titleLittle colorGrey padding-g alignRight">
                        状态
                        <div className="status" style={status.style}>{datum.statusStr}</div>
                    </div>
                </div>
                <div className="flex margin-s margin-top padding-g padding-way bottomBor bgfff">
                    {
                        ['商品信息', '审批记录', '订单日志'].map((value, key) => (
                            <div className={this.state.tabKey === key ? "classifyActive" : "classify"} onClick={() => {
                                this.switchTab(key);
                            }}>
                                {value}
                            </div>
                        ))
                    }
                </div>
                <div className="padding-g bgfff">
                    {
                        this.state.tabKey === 1 && <div>
                            {/* 1 线下, 2 线上 */}
                            {
                                datum.approvalType == '1'
                                    ? <div>
                                        <Row className="reuse_row" gutter={20}>
                                            <Col span={12}>
                                                <Col className="reuse_label" span={6}>审批方式</Col>
                                                <Col className="reuse_value" span={18}>线下审批</Col>
                                            </Col>
                                            <Col span={12}>
                                                <Col className="reuse_label" span={6}>审批附件</Col>
                                                <Col className="reuse_value" span={18}>
                                                    <span>{datum.approvalFileName}</span>
                                                    {datum.approvalFileName ? <a
                                                        href="javascript:void(0);"
                                                        onClick={() => download(datum.approvalFileName, resourceUrl + datum.approvalFile, true)}
                                                        className="linkButton">下载</a> : '--'}
                                                </Col>
                                            </Col>
                                        </Row>
                                        <ToggleTable columns={columns} dataSource={reApprovalLogList} pagination={false} />
                                    </div> : null
                            }
                            {
                                datum.approvalType == '2'
                                    ? <div>
                                        <Row className="reuse_row" gutter={20}>
                                            <Col span={12}>
                                                <Col className="reuse_label" span={6}>审批方式</Col>
                                                <Col className="reuse_value" span={18}>线上审批</Col>
                                            </Col>
                                            <Col span={12}>
                                                <Col className="reuse_label" span={6}>审批机制</Col>
                                                <Col className="reuse_value" span={18}>{modes[reApprovalFlowPlus.mode]}</Col>
                                            </Col>
                                        </Row>
                                        <Row className="reuse_row" gutter={20}>
                                            <Col span={12}>
                                                <Col className="reuse_label" span={6}>审批模板</Col>
                                                <Col className="reuse_value" span={18}>{reApprovalFlowPlus.tempName || '--'}</Col>
                                            </Col>
                                            <Col span={12}>
                                                <Col className="reuse_label" span={6}>审批金额</Col>
                                                <Col className="reuse_value" span={18}>{reApprovalFlowPlus.lowQuota} - {reApprovalFlowPlus.highQuota}万元</Col>
                                            </Col>
                                        </Row>
                                        <ToggleTable columns={columns} dataSource={reApprovalFlowPlus.approvalList} pagination={false} />
                                    </div> : null
                            }
                            {
                                (datum.approvalType == '1' || datum.approvalType == '2') ? '' : '暂无数据'
                            }
                        </div>

                    }

                    {
                        this.state.tabKey === 0 && <ToggleTable columns={columns} dataSource={this.state.tableData} pagination={false} />
                    }

                    {
                        this.state.tabKey === 2 && <ToggleTable columns={columns} dataSource={this.state.tableData} pagination={false} />
                    }

                    {/*<p className="padding-s bgGrey margin-l margin-row cursor alignCenter" onClick={this.switchOpen}>
                        {this.state.isOpen ? '展开全部' : '收起全部'} <img width={10} height={10} src={give} alt="" />
                    </p>*/}
                    <p className="titleLittle alignRight padding-s padding-row ">
                        订单金额：<span className="price" content="元">￥{toFixed(datum.amt, 2)}</span>
                    </p>
                </div>
                <BaseAffix>
                    <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
                </BaseAffix>
            </Form>
        )
    }
}

export default Form.create()(CreateOrder)
