import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin } from 'antd';
const FormItem = Form.Item;

import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './index.less';
import FormatDate from "@/utils/date";
import download from "business/isViewDown";

//保证金状态
const _BONDSTATUS = baseService._bondMain;
const _BONDSTATUS_OBJ = baseService._bondMain_obj;

export default class SaleBondDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bondData: {},
        }
    }
    config = {
        span: [3, 20],
        codeTime: 60,
    }
    //保证金列表
    bondCols = [
        {
            title: '采购商名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
            width: 150,
            render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
        },
        {
            title: '联系方式',
            key: 'contacts',
            dataIndex: 'contacts',
            width: 110,
            render: (text, record, index) => {
                return (
                    <span>
                        <p className="text_line4" title={text}>{record.contacts}</p>
                        <p>{record.contactsTel}</p>
                    </span>
                )
            }
        },
        {
            title: '报名日期',
            key: 'signTime',
            dataIndex: 'signTime',
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
            title: '缴纳方式',
            key: 'payWayStr',
            dataIndex: 'payWayStr',
            width: 100,
        },
        {
            title: '保证金状态',
            key: 'bondStatusStr',
            dataIndex: 'bondStatusStr',
            width: 100,
            render: (text, record, index) => {
                let style = {}
                if (record.status && _BONDSTATUS_OBJ[record.status]) {
                    style = _BONDSTATUS_OBJ[record.status].style ? _BONDSTATUS_OBJ[record.status].style : {}
                }
                return (
                    <span style={style}>
                        <p>{text}</p>
                        {/* <p>{record.payTime || '---'}</p> */}
                        <p>{record.payTime ? record.payTime.substr(0, 10) : ''}</p>
                        <p>{record.payTime ? record.payTime.substr(10) : ''}</p>
                        <p>{record.payTime ? '' : '---'}</p>
                    </span>
                )
            }
        },
        {
            title: '确认状态',
            key: 'confirmStatusStr',
            dataIndex: 'confirmStatusStr',
            width: 100,
            render: (text, record, index) => {
                let color = record.confirmStatusStr === '未确认' ? 'color_b' : 'color_c';
                return (
                    <span className={color}>
                        <p>{text}</p>
                        {/* <p>{record.confirmTime || '---'}</p> */}
                        <p>{record.confirmTime ? record.confirmTime.substr(0, 10) : ''}</p>
                        <p>{record.confirmTime ? record.confirmTime.substr(10) : ''}</p>
                        <p>{record.confirmTime ? '' : '---'}</p>
                    </span>
                )
            }
        },
        {
            title: '汇款凭证',
            key: 'fileName',
            dataIndex: 'fileName',
            render: (text, record, index) => {
                return (
                    record.filePath ? <span>
                        <a className="reuse_link text_line4"
                           style={{ whiteSpace: 'initial' }}
                           href="javascript:void(0);"
                           title={text}
                           onClick={() => download(record.fileName, systemConfigPath.fileDown(record.filePath))}>{record.fileName}</a>
                    </span> : '无'
                )
            }
        },
        {
            title: '处理记录',
            key: 'dealRemark',
            dataIndex: 'dealRemark',
            render: (text, record, index) => {
                let color = null;
                if (record.dealRemark === '返还') {
                    color = 'color_c';
                }
                if (record.dealRemark === '没收') {
                    color = 'color_e';
                }
                return (
                    <span className={color} style={{ fontSize: '12px' }}>
                        <p>{text}</p>
                        {/* <p>{record.dealTime || '---'}</p> */}
                        <p>{record.dealTime ? record.dealTime.substr(0, 10) : ''}</p>
                        <p>{record.dealTime ? record.dealTime.substr(10) : ''}</p>
                        <p>{record.dealTime ? '' : '---'}</p>
                    </span>
                )
            }
        }
    ]

    componentWillMount() {
        this.handleInit()
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
    //获取数据
    getBondData = (id) => {
        let uuids = id || this.props.uuids;
        if (!uuids) return;
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/bondDeal/info', {
            uuids: uuids
        }).then(res => {
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

    //基本信息
    createBaseInfo = () => {
        const { bondData } = this.state;
        const { span } = this.config;
        const { bondDeal = {} } = this.state.bondData;

        return (
            <div>
                <Row className={less.title}>
                    <p className={less.title_text} style={{ wordBreak: 'break-all' }}>{bondData.title}</p>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价单号</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.code || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售单位</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.saleCompanyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售项目部</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.saleDeptName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价联系人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span style={{ marginRight: '10px' }}>{bondData.contacts}</span>
                        <span className="ml20">{bondData.contactsTel}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>报名截止日期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {
                            bondData.status > 30
                                ? <span>{bondData.signEndTime}&nbsp;已截止</span>
                                : <span>
                                    <span>{bondData.signEndTime}</span>
                                    <span className="ml20">
                                        {bondData.signEndTimeStr}
                                    </span>
                                </span>
                        }
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价开始日期</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.offerStartTime || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价截止日期</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.offerEndTime || '--'}</Col>
                </Row>
                <div className="reuse_baseTitle"></div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金缴纳方式</Col>
                    <Col className="reuse_value" span={span[1]}>{this.filterBondType(bondData.bondType)}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金金额</Col>
                    <Col className="reuse_value" span={span[1]}><span className={less.money}>{bondData.bondAmt || '--'}</span> 元</Col>
                </Row>
                {/* <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>收款账户名</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.account || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金收款账户</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.accountNo || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>开户行</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.openBank || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>来款备注</Col>
                    <Col className="reuse_value" span={span[1]}>{bondData.bondRemark || '--'}</Col>
                </Row> */}
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>缴纳时间</Col>
                    <Col className="reuse_value" span={span[1]}>{bondDeal.payTime || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>缴纳账户</Col>
                    <Col className="reuse_value" span={span[1]}>{bondDeal.payAccountName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>缴纳账号</Col>
                    <Col className="reuse_value" span={span[1]}>{bondDeal.payAccountNo || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>缴纳凭证</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {/* {bondDeal.fileName || '--'}
                        {
                            bondDeal.filePath != ""
                                ? <Button type="primary" onClick={() => { }}>下载</Button>
                                : <span> </span>
                        } */}
                        {
                            bondDeal.filePath ? <span>
                                <a style={{ whiteSpace: 'initial' }} href={systemConfigPath.fileDown(bondDeal.filePath)} download={bondDeal.fileName} target="_blank"
                                    className="reuse_link text_line4">{bondDeal.fileName}</a>
                            </span> : '--'
                        }
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>缴纳备注</Col>
                    <Col className="reuse_value" span={span[1]}>{bondDeal.remark || '--'}</Col>
                </Row>
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
