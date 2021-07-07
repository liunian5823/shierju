import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin } from 'antd';
const FormItem = Form.Item;
import { connect } from 'react-redux';

import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './index.less';
import FormatDate from "@/utils/date";

//保证金状态
const _BONDSTATUS = baseService._bondMain;
const _BONDSTATUS_OBJ = baseService._bondMain_obj;

class SaleBondManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bondData: {},
            openData: {},
            handleVisible: false,//保证金处理
            verificationCode: null,//验证码
            codeTimeText: '获取验证码',
            isCodeing: false,
        }
    }
    _codeTimer = null
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
            render: text => {
                return text || '--'
            }
        },
        {
            title: '保证金状态',
            key: 'bondStatusStr',
            dataIndex: 'bondStatusStr',
            width: 90,
            render: (text, record, index) => {
                let style = {}
                if (record.status && _BONDSTATUS_OBJ[record.status]) {
                    style = _BONDSTATUS_OBJ[record.status].style
                }
                return (
                    <span style={style}>
                        <p>{text}</p>
                        {/* <p>{record.payTime || '---'}</p> */}
                        <div>
                            <p>{record.payTime ? record.payTime.substr(0, 10) : ''}</p>
                            <p>{record.payTime ? record.payTime.substr(10) : ''}</p>
                        </div>
                        <p>{record.payTime ? '' : '--'}</p>
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
            title: '缴纳账户',
            key: 'payAccountName',
            dataIndex: 'payAccountName',
            width: 110,
            render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
        },
        {
            title: '缴纳账户号',
            key: 'payAccountNo',
            dataIndex: 'payAccountNo',
            width: 110,
            render: text => {
                return <div className='text_line4' title={text}>{text || '--'}</div>
            }
        },
        {
            title: '汇款凭证',
            key: 'fileName',
            dataIndex: 'fileName',
            width: 100,
            render: (text, record, index) => {
                return (
                    record.filePath ? <span>
                        <a style={{ whiteSpace: 'initial' }} href={systemConfigPath.fileDown(record.filePath)} download={record.fileName} target="_blank"
                           title={text} className="reuse_link text_line4">{record.fileName}</a>
                    </span> : '无'
                )
            }
        },
        {
            title: '处理记录',
            key: 'dealRemark',
            dataIndex: 'dealRemark',
            width: 100,
            render: (text, record, index) => {
                let color = null;
                if (record.dealRemark === '返还' || record.dealRemark === '退还') {
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
                        <p>{record.dealTime ? '' : '--'}</p>
                    </span>
                )
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 100,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    <div>
                        {/* {
                            record.status ? <span className="reuse_link">查看记录</span> : null
                        } */}
                        {
                            record.status == 10 ? <span className="reuse_link" onClick={() => { this.handleToCall(record) }}>催缴</span> : null
                        }
                        {
                            record.status == 20 ? <span className="reuse_link" onClick={() => { this.handleToConfirm(record) }}>确认</span> : null
                        }

                        {
                            [40, 30].indexOf(record.status) !== -1 && this.props.manageStatus > 50 ? <span className="reuse_link" onClick={() => { this.handleToCapture(record) }}>没收</span> : null
                        }
                        {
                            [40, 30].indexOf(record.status) !== -1 && this.props.manageStatus > 50 ? <span className="reuse_link" onClick={() => { this.handleToBack(record) }}>返还</span> : null
                        }
                        {/* <span className="reuse_link" onClick={() => {this.handleToCall(record)}}>催缴</span>
                        <span className="reuse_link" onClick={() => {this.handleToConfirm(record)}}>确认</span>
                        <span className="reuse_link" onClick={() => {this.handleToCapture(record)}}>没收</span>
                        <span className="reuse_link" onClick={() => {this.handleToBack(record)}}>返还</span> */}
                    </div>
                )
            }
        }
    ]

    componentWillMount() {
        this.handleInit()
    }

    componentWillUnmount() {
        this.endCountDown()
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
        api.ajax('GET', '@/reuse/bondDeal/findByScene', {
            sceneId: uuids
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
        let statusStyle = {};
        if (bondData.status) {
            statusStyle = _BONDSTATUS_OBJ[bondData.status] ? _BONDSTATUS_OBJ[bondData.status].style : {};
        }

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
                <Row className="reuse_row">
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

    //催缴
    handleToCall = (tr) => {
        if (!tr.uuids) return;
        api.ajax('POST', '@/reuse/bondDeal/urge', {
            uuids: tr.uuids,
            phone: tr.contactsTel
        }).then(res => {
            this.getBondData()
            Util.alert(res.msg, { type: 'success' })
            // this.props.colseNew();
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        })
    }
    //返还1
    handleToBack = (tr) => {
        this.endCountDown()
        this.props.form.resetFields();
        let openData = tr;
        openData._type = '1';
        this.setState({
            openData,
            handleVisible: true,
            verificationCode: null,
        })
        // this.props.colseNew();
    }
    //确认2
    handleToConfirm = (tr) => {
        this.endCountDown()
        this.props.form.resetFields();
        let openData = tr;
        openData._type = '2';
        this.setState({
            openData,
            handleVisible: true,
            verificationCode: null,
        })
        // this.props.colseNew();
    }
    //没收3
    handleToCapture = (tr) => {
        this.endCountDown()
        this.props.form.resetFields();
        let openData = tr;
        openData._type = '3';
        this.setState({
            openData,
            handleVisible: true,
            verificationCode: null,
        })
        // this.props.colseNew();
    }
    //保证金处理
    handleOk = () => {
        const openData = this.state.openData;
        if (!openData && !this.state.verificationCode) return;
        if (!(/^\d{6}$/.test(this.state.verificationCode))) { //error
            Util.alert('错误！！请输入6位数字验证码', { type: 'error' })
            return;
        }
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let url = '';
                let params = {
                    uuids: openData.uuids,
                    phone: this.props.userInfo.phone,
                    code: this.state.verificationCode
                }
                if (openData._type == '1') {
                    url = '@/reuse/bondDeal/back'
                }
                if (openData._type == '2') {
                    url = '@/reuse/bondDeal/confirm'
                }
                if (openData._type == '3') {
                    url = '@/reuse/bondDeal/occupy'
                    params.occupyReason = this.occupyReason
                }
                api.ajax('POST', url, params).then(res => {
                    Util.alert(res.msg || '成功', { type: 'success' })

                    this.getBondData()
                    this.setState({
                        openData: {},
                        handleVisible: false,
                        verificationCode: null,
                    })
                }, error => {
                    Util.alert(error.msg || '失败', { type: 'error' })
                })
            }
        })
    }
    handleCancel = () => {
        this.setState({
            handleVisible: false,
        })
    }
    //开始验证倒计时
    startCountDown = () => {
        if (this.state.isCodeing) return;
        let { codeTime } = this.config;
        let that = this;
        if (that._codeTimer) that._codeTimer = null;
        this.setState({
            isCodeing: true,
            codeTimeText: '倒计时' + codeTime + 's'
        })

        that._codeTimer = setInterval(function () {
            --codeTime;
            that.setState({
                codeTimeText: '倒计时' + codeTime + 's'
            })
            if (codeTime <= 0) {
                that.setState({
                    codeTimeText: '获取验证码',
                    isCodeing: false,
                })
                clearInterval(that._codeTimer)
            }
        }, 1000)
    }
    //结束验证倒计时
    endCountDown = () => {
        this.setState({
            codeTimeText: '获取验证码',
            isCodeing: false,
        })
        if (this._codeTimer) {
            clearInterval(this._codeTimer)
        }
    }
    //获取验证码
    getCode = () => {
        if (!this.props.userInfo.phone) return;

        api.ajax('GET', '@/reuse/bondDeal/sendSimpleSms', {
            phone: this.props.userInfo.phone
        }).then(res => {
            Util.alert(res.msg || '发送成功', { type: 'success' })
            this.startCountDown()
        }, error => {
            Util.alert(error.msg || '发送失败', { type: 'error' })
        })
    }
    //验证码change
    verificationCodeChange = (el) => {
        this.setState({
            verificationCode: el.target.value
        })
    }
    //验证码change
    occupyReasonChange = (el) => {
        this.occupyReason = el.target.value
    }


    render() {
        const { getFieldProps } = this.props.form;
        const { codeTimeText, isCodeing, openData, bondData } = this.state;
        const { bondDealList = [] } = bondData;
        let phone = '';
        if (this.props.userInfo.phone) {
            phone = this.props.userInfo.phone.slice(0, 5) + '****' + this.props.userInfo.phone.slice(this.props.userInfo.phone.length - 4)
        }

        return (
            <div className={less.bondDetail}>
                <Spin spinning={this.state.spinning}>
                    <Form>
                        <div className={less.card}>{this.createBaseInfo()}</div>
                        <div className={less.card}>
                            <div className="reuse_baseTitle">保证金处理</div>
                            <div>
                                <Table style={{tableLayout:"fixed"}}
                                    scroll={{ x: 900, y: 400 }}
                                    dataSource={bondDealList}
                                    columns={this.bondCols}
                                    pagination={false}></Table>
                            </div>
                        </div>

                        <Modal
                            title={
                                <span>
                                    <Icon className="color_b"
                                        style={{ fontWeight: 'normal' }}
                                        type="question-circle"></Icon>
                                    <span className="ml10">保证金处理</span>
                                </span>
                            }
                            maskClosable={false}
                            width={500}
                            visible={this.state.handleVisible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}>
                            <div>
                                <Row className="reuse_row">
                                    请核实实际业务后，谨慎操作。
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}>竞价单号</Col>
                                    <Col className="reuse_value" span={18}>{bondData.code || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}>销售项目部</Col>
                                    <Col className="reuse_value" span={18}>{bondData.saleDeptName || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}>采购单位</Col>
                                    <Col className="reuse_value" span={18}>{openData.buyerCompanyName || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}>保证金金额</Col>
                                    <Col className="reuse_value" span={18}><span className={less.money}>{bondData.bondAmt}</span>元</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}>业务类型</Col>
                                    <Col className="reuse_value" span={18}>
                                        {
                                            openData._type == '1' ? '返还' : null
                                        }
                                        {
                                            openData._type == '2' ? '确认' : null
                                        }
                                        {
                                            openData._type == '3' ? '没收' : null
                                        }
                                    </Col>
                                </Row>
                                {openData._type == '3' && <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}>没收理由</Col>
                                    <Col className="reuse_value" span={18}>
                                        <FormItem>
                                            <Input
                                                type="textarea"
                                                {...getFieldProps(`occupyReason`, {
                                                    rules: [
                                                        { required: true, message: '请输入没收理由' }
                                                    ],
                                                    onChange: this.occupyReasonChange
                                                })}
                                                maxLength={200}
                                                placeholder="请输入没收理由"></Input>
                                        </FormItem>
                                    </Col>
                                </Row>}
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={5}>手机验证码</Col>
                                    <Col className="reuse_value" span={18}>
                                        <Row>
                                            <Col span={16}>
                                                <FormItem>
                                                    <Input
                                                        {...getFieldProps('verificationCode', {
                                                            initialValue: this.state.verificationCode,
                                                            rules: [
                                                                { required: true, message: '请输入验证码' }
                                                            ],
                                                            onChange: this.verificationCodeChange,
                                                        })}
                                                        size="default"
                                                        placeholder={phone}></Input>
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <Button type="primary"
                                                    onClick={this.getCode}
                                                    style={{ width: '100%', marginTop: '2px' }}
                                                    size="default"
                                                    disabled={isCodeing}>
                                                    {codeTimeText}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Modal>
                    </Form>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        userInfo: state.authReducer.userInfo || {}
    }
}
export default Form.create()(connect(mapStateToProps)(SaleBondManage))
