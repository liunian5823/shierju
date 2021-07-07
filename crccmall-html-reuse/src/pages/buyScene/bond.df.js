import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Form, Row, Col, Radio, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import less from './bond.less';
import UploadFile from '@/components/uploadFile';
import { filePathDismant } from '@/utils/dom';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import download from "business/isViewDown";

const _BONDGROUP = [
    { id: '1', value: '转账汇款' },
    { id: '2', value: '账户余额' },
    { id: '3', value: '线下缴纳' },
];

class PayBond extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sceneData: {},
            formData: {
                payWay: '1',
                payUserId: null,
                remark: null,
                fileName: null,//线下必传
                filePath: null,//线下必传
            },

            codeTimeText: '获取验证码',
            isCodeing: false,
        }
    }

    config = {
        autosize: {
            minRows: 6,
            maxRows: 6
        },
        maxlength: 300,
        codeTime: 60,
    }

    componentWillMount() {
        this.handleInit()
    }
    componentWillUnmount() {
        this.endCountDown()
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.sceneId != nextProps.sceneId) {
            this.getBondInfo(nextProps.sceneId)
        }
    }

    handleInit = () => {
        if (this.props.sceneId) {
            this.getBondInfo()
        }
    }

    getBondInfo = (id) => {
        this.endCountDown()
        let sceneId = id || this.props.sceneId;
        if (!sceneId) return;

        api.ajax('GET', '@/reuse/bondDeal/payInfo', {
            scendId: sceneId,
        }).then(res => {
            if (res.data) {
                this.setState({
                    sceneData: res.data,
                })
            }
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        })
    }
    //onchange事件
    valueChange = (el, label) => {
        const formData = this.state.formData;
        let value = el.target ? el.target.value : el;

        this.setState({
            formData: {
                ...formData,
                [label]: value
            }
        })
    }

    //汇款
    createRemit = () => {
        const { sceneData, formData } = this.state;
        const { autosize, maxlength } = this.config;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>保证金金额</Col>
                    <Col className="reuse_value" span={18}>{sceneData.bondAmt || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>收款账户名</Col>
                    <Col className="reuse_value" span={18}>{sceneData.account || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>收款账户</Col>
                    <Col className="reuse_value" span={18}>{sceneData.accountNo || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>开户行</Col>
                    <Col className="reuse_value" span={18}>{sceneData.openBank || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>来款备注</Col>
                    <Col className="reuse_value pdt20">
                        <Input
                            defaultValue={formData.remark}
                            onChange={(el) => { this.valueChange(el, 'remark') }}
                            type="textarea"
                            autosize={autosize}
                            maxLength={maxlength}
                            placeholder="请输入"></Input>
                        <p className="text_r">{formData.remark && formData.remark.length}/{maxlength}</p>
                    </Col>
                </Row>
            </div>
        )
    }

    //余额-线上
    createOnline = () => {
        const { sceneData, formData, isCodeing, codeTimeText } = this.state;
        const { getFieldProps } = this.props.form;
        const { autosize, maxlength } = this.config;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>保证金金额</Col>
                    <Col className="reuse_value" span={18}>{sceneData.bondAmt || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>项目余额</Col>
                    <Col className="reuse_value" span={18}>--</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>手机号码</Col>
                    <Col className="reuse_value" span={18}>{sceneData.contactsTel || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>短信验证</Col>
                    <Col className="reuse_value" span={18}>
                        <Row>
                            <Col span={16}>
                                <FormItem>
                                    <Input
                                        {...getFieldProps('noteCode', {
                                            initialValue: this.state.verificationCode,
                                            rules: [
                                                { required: true, message: '请输入验证码' }
                                            ],
                                            onChange: (el) => { this.valueChange(el, 'noteCode') },
                                        })}
                                        size="default"
                                        placeholder={sceneData.contactsTel}></Input>
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
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>付款说明</Col>
                    <Col className="reuse_value pdt20">
                        <Input
                            defaultValue={formData.remark}
                            onChange={(el) => { this.valueChange(el, 'remark') }}
                            type="textarea"
                            autosize={autosize}
                            maxLength={maxlength}
                            placeholder="请输入"></Input>
                        <p className="text_r">{formData.remark && formData.remark.length}/{maxlength}</p>
                    </Col>
                </Row>
            </div>
        )
    }
    //获取验证码
    getCode = () => {
        if (!this.state.sceneData.contactsTel) return;

        api.ajax('GET', '@/reuse/bondDeal/sendSimpleSms', {
            phone: this.state.sceneData.contactsTel
        }).then(res => {
            Util.alert(res.msg || '发送成功', { type: 'success' })
            this.startCountDown()
        }, error => {
            Util.alert(error.msg || '发送失败', { type: 'error' })
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

    //线下
    createUnderline = () => {
        const { sceneData, formData } = this.state;
        const { autosize, maxlength } = this.config;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>保证金金额</Col>
                    <Col className="reuse_value" span={18}>{sceneData.bondAmt || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>收款账户名</Col>
                    <Col className="reuse_value" span={18}>{sceneData.account || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>收款账户</Col>
                    <Col className="reuse_value" span={18}>{sceneData.accountNo || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>开户行</Col>
                    <Col className="reuse_value" span={18}>{sceneData.openBank || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>来款备注</Col>
                    <Col className="reuse_value pdt20">
                        <Input
                            defaultValue={formData.remark}
                            onChange={(el) => { this.valueChange(el, 'remark') }}
                            type="textarea"
                            autosize={autosize}
                            maxLength={maxlength}
                            placeholder="请输入"></Input>
                        <p className="text_r">{formData.remark && formData.remark.length}/{maxlength}</p>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>保证金操作人</Col>
                    <Col className="reuse_value" span={18}>--</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>保证金凭证</Col>
                    <Col className="reuse_value" span={18}>
                        <UploadFile
                            disabled={!!formData.filePath}
                            tip
                            uploadSuccess={this.uploadSuccess}></UploadFile>

                        {
                            formData.filePath ?
                                <div className="mt10">
                                    <a className="reuse_link"
                                        href="javascript:void(0);"
                                        onClick={() => download(FormData.fileName, systemConfigPath.fileDown(formData.filePath))}
                                    >
                                        <Icon type="paper-clip" />
                                        {formData.fileName}
                                    </a>
                                    <span className={less.fileDel} onClick={this.fileDel}>删除</span>
                                </div> : '--'
                        }
                    </Col>
                </Row>
            </div>
        )
    }
    //上传成功
    uploadSuccess = (file) => {
        const formData = this.state.formData;
        const f = filePathDismant(file.response.data);

        this.setState({
            formData: {
                ...formData,
                filePath: f.filePath,
                fileName: f.fileName
            }
        })
    }
    //删除文件
    fileDel = () => {
        let that = this;
        const formData = that.state.formData;

        Util.confirm('删除文件', {
            type: 'del',
            content: `确定删除该 ${formData.fileName}？`,
            onOk() {
                that.setState({
                    formData: {
                        ...formData,
                        filePath: null,
                        fileName: null
                    }
                })
                Util.alert('删除成功', { type: 'success' })
            }
        })
    }

    //关闭
    payCancle = () => {
        this.props.bondCancle()
    }
    //付款
    payOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.props.bondOk(
                    {
                        ...this.state.formData,
                        sceneId: this.props.sceneId
                    },
                    values
                )
            }
        })
    }

    render() {
        const { sceneData, formData } = this.state;

        return (
            <div className={less.payBond}>
                <Form>
                    <Row className="reuse_row">
                        <Col className="reuse_label" span={5}>保证金付款方式</Col>
                        <Col className="reuse_value" span={18}>
                            <RadioGroup onChange={(el) => { this.valueChange(el, 'payWay') }}
                                value={formData.payWay}>
                                {
                                    _BONDGROUP.map(v => {
                                        return <Radio key={v.id} value={v.id}>{v.value}</Radio>
                                    })
                                }
                            </RadioGroup>
                        </Col>
                    </Row>
                    <div>
                        {
                            formData.payWay == '1' ? this.createRemit() : null
                        }
                        {
                            formData.payWay == '2' ? this.createOnline() : null
                        }
                        {
                            formData.payWay == '3' ? this.createUnderline() : null
                        }
                    </div>
                </Form>
                <div className={["reuse_baseButtonGroup", less.btns].join(' ')}>
                    <Button type="ghost" onClick={this.payCancle} size="large">关闭</Button>
                    <Button type="primary" onClick={this.payOk} size="large">付款</Button>
                </div>
            </div>
        )
    }
}

export default Form.create()(PayBond)
