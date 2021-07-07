import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Card, Form, Row, Col, Radio, Input, Button, Icon, Spin, Modal, Popconfirm } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import history from "@/utils/history";

import less from './bond.less';
import UploadFile from '@/components/uploadFile';
import { closeWin, isNormal, filePathDismant } from '@/utils/dom';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import { baseService } from '@/utils/common';
import FormatDate from '@/utils/date';
import download from "business/isViewDown";

const _BONDGROUP = [
    { id: '1', value: '转账汇款' },
    { id: '2', value: '账户余额' },
    { id: '3', value: '线下缴纳' },
];
const _MAINBIDOBJ = baseService._saleMainBid_obj;

class PayBond extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            sceneData: {},
            //（0无需缴纳、1汇款转账、2资金账余额、3线下）
            formData: {
                payWay: '0',
                payAccountName: '',
                payAccountNo: '',
                remark: null,
                fileName: null,//线下必传
                filePath: null,//线下必传
            },
            //线下
            underlineVisivle: false,

            codeTimeText: '获取验证码',
            isPaying: false,
        }
    }
    _uuids = null
    config = {
        span: [3, 21],
        autosize: {
            minRows: 6,
            maxRows: 6
        },
        maxlength: 200,
        codeTime: 60,
    }

    componentWillMount() {
        this.handleInit()
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

    handleInit = () => {
        this._uuids = this.props.match.params.uuids;
        if (this._uuids) {
            this.getBondInfo(this._uuids)
        }
    }

    getBondInfo = (sceneId) => {
        this.setState({
            spinning: true
        })
        if (!sceneId) return;
        api.ajax('GET', '@/reuse/buyScene/info', {
            sceneId
        }).then(res => {
            if (res.data) {
                this.setState({
                    spinning: false,
                    sceneData: res.data,
                })
            }
        }, error => {
            Util.alert(error.msg, 'error')
        })
    }

    //场次基本信息
    createSceneInfo = () => {
        const { sceneData } = this.state;
        const { span } = this.config;
        let statusStyle = {};
        if (sceneData.status) {
            statusStyle = _MAINBIDOBJ[sceneData.status].style;
        }

        return (
            <div className={less.info}>
                <Row className={less.title}>
                    <Col span={20}>
                        <p className={less.title_text} style={{ wordBreak: 'break-all' }}>{sceneData.title}</p>
                    </Col>
                    <Col span={4}>
                        <div className={less.title_status}>
                            <p className={less.main} style={statusStyle}>{sceneData.statusStr}</p>
                            <p className={less.note}>{sceneData.childStatusStr}</p>
                        </div>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价编号</Col>
                    <Col className="reuse_value" span={span[1]}>{sceneData.code || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售单位</Col>
                    <Col className="reuse_value" span={span[1]}>{sceneData.saleCompanyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售项目部</Col>
                    <Col className="reuse_value" span={span[1]}>{sceneData.saleDeptName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售对象</Col>
                    <Col className="reuse_value" span={span[1]}>{sceneData.saleTargetStr || '--'}</Col>
                </Row>
                {/*<Row className="reuse_row">*/}
                {/*    <Col className="reuse_label" span={span[0]}>发布人</Col>*/}
                {/*    <Col className="reuse_value" span={span[1]}>*/}
                {/*        <span>{sceneData.createUserName}</span>*/}
                {/*        <span>{sceneData.createUserTel}</span>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价分类</Col>
                    <Col className="reuse_value" span={span[1]}>{sceneData.classifyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>应用领域</Col>
                    <Col className="reuse_value" span={span[1]}>{this.filterUseArea(sceneData.useArea)}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价联系人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span style={{ marginRight: '10px' }}>{sceneData.contacts}</span>
                        <span>{sceneData.contactsTel}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>允许看货期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{sceneData.khStartTime}</span>
                        <span style={{ margin: '0 10px' }}>-</span>
                        <span>{sceneData.khEndTime}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>报名截止日期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {
                            sceneData.status > 30
                                ? <span>{sceneData.signEndTime} &nbsp; 已截止</span>
                                : <span>
                                    <span>{sceneData.signEndTime}</span>
                                    <span className="ml20">
                                        {sceneData.signEndTimeStr}
                                    </span>
                                </span>
                        }
                        <span className={["reuse_tip", less.tip].join(' ')}>采购商无法在此时间后报名参与竞价，已报名采购商可继续在竞价开始日期前缴纳保证金</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价开始日期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{sceneData.offerStartTime}</span>
                        <span className={["reuse_tip", less.tip].join(' ')}>竞价开始时采购未缴纳保证金或销售方未确认保证金到账视为报名无效，无法参与竞价</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价截止日期</Col>
                    <Col className="reuse_value" span={span[1]}>{sceneData.offerEndTime}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>结束自动延长</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{sceneData.extendStr ? '开启' : '关闭'}</span>
                        <span className={["reuse_tip", less.tip].join(' ')}>如果竞价结束前2分钟出价，竞价结束时间会自动延时5分钟</span>
                    </Col>
                </Row>
            </div>
        )
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

    //保证金要求
    createDemand = () => {
        const { sceneData } = this.state;
        const bondData = (sceneData.bondDealList && sceneData.bondDealList.length) ? sceneData.bondDealList[0] : {};
        const { span } = this.config;
        const demandSpan = [6, 18];

        return (
            <div className={less.demand}>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金缴纳</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {sceneData.bondTypeStr || '--'}
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金金额</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {sceneData.bondAmt || '--'}元
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金状态</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {sceneData.bondStatusStr || '--'}
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <div className={less.down}>
                        <Col span={12}>
                            <Col className="reuse_label" span={demandSpan[0]}>保证金缴纳方式</Col>
                            <Col className="reuse_value" span={demandSpan[1]}>
                                {bondData.payWayStr || '--'}
                            </Col>
                        </Col>
                        <Col span={12}>
                            <Col className="reuse_label" span={demandSpan[0]}>付款状态</Col>
                            <Col className="reuse_value" span={demandSpan[1]}>
                                {bondData.statusStr || '--'}
                            </Col>
                        </Col>
                    </div>
                </Row>
                <Row className="reuse_row">
                    <Col span={12}>
                        <Col className="reuse_label" span={demandSpan[0]}>保证金缴纳时间</Col>
                        <Col className="reuse_value" span={demandSpan[1]}>
                            {bondData.payTime || '--'}
                        </Col>
                    </Col>
                    <Col span={12}>
                        <Col className="reuse_label" span={demandSpan[0]}>保证金缴纳人</Col>
                        <Col className="reuse_value" span={demandSpan[1]}>
                            <span>{bondData.payUserName || '--'}</span>
                            <span className="pdl10">{bondData.payUserTel || '--'}</span>
                        </Col>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金确认时间</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {bondData.confirmTime || '--'}
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>退还保证金时间</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {bondData.returnTime || '--'}
                    </Col>
                </Row>
            </div>
        )
    }
    //缴纳保证金
    createPay = () => {
        const { sceneData } = this.state;
        const { bondType } = sceneData;
        const { payWay } = this.state.formData;
        let isDisabled = bondType == '1';
        let suatus = null;
        if (sceneData.bondDealList && sceneData.bondDealList.length) {
            status = sceneData.bondDealList[0].status;
        }
        const payList = [
            { type: '1', disabled: !(bondType == '2' || bondType == '2,3'), icon: 'pay-circle-o', title: '汇款/转账', text: '生成并打印支付单，通过财务共享中心或其他支付通道向平台指定账号付款。' },
            { type: '3', disabled: !(bondType == '3' || bondType == '2,3'), icon: 'pay-circle-o', title: '线下支付', text: '线下汇款至循环物资竞价发起方提供的银行账户。' },
            { type: '2', disabled: !(bondType == '2' || bondType == '2,3'), icon: 'pay-circle-o', title: '资金账户余额', text: '线上直接久其财务共享中心与铁建银信，推送订单等信息直接发起银信申请。' },
        ];

        return (
            <div className={less.pay}>
                <Row gutter={40}>
                    {
                        payList.map((item, index) => {
                            return (
                                <Col span={8}>
                                    <div className={[
                                        less.pay_item,
                                        payWay == item.type ? less.is_active : '',
                                        item.disabled ? less.is_disabled : '',
                                    ].join(' ')}
                                        key={index}
                                        onClick={() => { this.handlePayType(item) }}>
                                        <div className={less.pay_title}>
                                            <Icon type="pay-circle-o" />
                                            <span className="pdl10">{item.title}</span>
                                        </div>
                                        <p>{item.text}</p>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <div className={less.pay_btn}>
                    {
                        (!isDisabled && status == 10) ? <Button type="primary" onClick={this.openPay}>付款</Button> : null
                    }
                </div>
            </div>
        )
    }
    //选中付款方式
    handlePayType = (item) => {
        if (item.disabled) return;
        let formData = this.state.formData;
        formData.payWay = formData.payWay == '0' ? item.type : '0';

        this.setState({
            formData
        })
    }
    openPay = () => {
        const { bondDealList } = this.state.sceneData;
        const payWay = this.state.formData.payWay;
        if (['1', '2', '3'].indexOf(payWay) == -1) {
            Util.alert('请选择付款方式!')
            return;
        }
        //目前只做 线下付款
        if (bondDealList.length && payWay == '3') {
            this.setState({
                underlineVisivle: true
            })
        }
    }

    //线下
    createUnderline = () => {
        const { sceneData, formData } = this.state;
        const { autosize, maxlength } = this.config;
        const { getFieldProps } = this.props.form;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>缴纳规则</Col>
                    <Col className="reuse_value" span={18}>线下</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>收款账户账户名</Col>
                    <Col className="reuse_value" span={18}>{sceneData.account || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>收款账户账号</Col>
                    <Col className="reuse_value" span={18}>{sceneData.accountNo || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>收款账户开户行</Col>
                    <Col className="reuse_value" span={18}>{sceneData.openBank || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>来款备注</Col>
                    <Col className="reuse_value" span={18}>{sceneData.bondRemark || '--'}</Col>
                </Row>
                <div style={{ margin: '30px 0', height: '1px', background: '#eee' }}></div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}><span style={{ color: "#ed332a" }}>*</span>&nbsp;交款账户名称</Col>
                    <Col className="reuse_value" span={18}>
                        <FormItem>
                            <Input
                                {...getFieldProps('payAccountName', {
                                    initialValue: formData.payAccountName,
                                    rules: [
                                        { required: true, message: '请输入' }
                                    ]
                                })}
                                maxLength={50}
                                placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}><span style={{ color: "#ed332a" }}>*</span>&nbsp;交款账号</Col>
                    <Col className="reuse_value" span={18}>
                        <FormItem>
                            <Input
                                {...getFieldProps('payAccountNo', {
                                    initialValue: formData.payAccountNo,
                                    rules: [
                                        { required: true, message: '请输入' }
                                    ]
                                })}
                                maxLength={30}
                                placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="reuse_row reuse_row_s">
                    <Col className="reuse_label" span={5}><span style={{ color: "#ed332a" }}>*</span>&nbsp;上传凭证</Col>
                    <Col className="reuse_value" span={18}>
                        <UploadFile
                            className={'upload_s'}
                            disabled={!!formData.filePath}
                            tip
                            tipText="允许格式为doc、xlsx、pdf、jpg、png单个文件,文件体积小于5MB的文件"
                            uploadSuccess={this.uploadSuccess}></UploadFile>

                        {
                            formData.filePath ?
                                <div className="mt10">
                                    <a className="reuse_link"
                                        href="javascript:void(0);"
                                        onClick={() => download(formData.fileName, systemConfigPath.fileDown(formData.filePath))}
                                    >
                                        <Icon type="paper-clip" />
                                        {formData.fileName}
                                    </a>
                                    <span className={less.fileDel} onClick={this.fileDel}>删除</span>
                                </div> : ''
                        }
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={5}>备注</Col>
                    <Col className="reuse_value" span={18}>
                        <Input
                            defaultValue={formData.remark}
                            onChange={(el) => { this.valueChange(el, 'remark') }}
                            type="textarea"
                            autosize={autosize}
                            maxLength={maxlength}
                            placeholder="请输入"></Input>
                        <p className="text_r">{formData.remark ? formData.remark.length : 0}/{maxlength}</p>
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
            tip: `确定删除该 ${formData.fileName}？`,
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
    //线下付款-确定
    underlineOk = () => {
        const { bondDealList } = this.state.sceneData;
        if (!bondDealList.length) return;
        const { formData } = this.state;
        if (formData.payWay == '3' && !formData.filePath) {
            Util.alert('请上传保证金凭证')
            return;
        }
        this.props.form.validateFields((errors, values) => {
            if (!errors) {

                let params = {
                    ...formData,
                    ...values,
                    sceneId: this._uuids
                }

                let url = '@/reuse/bondDeal/pay'
                if (this.pay_again) {
                    url = '@/reuse/bondDeal/againPay'
                }

                api.ajax('POST', url, params)
                    .then(res => {
                        if (res.code === '000000') {
                            Util.alert(res.msg, { type: 'success' })
                            this.setState({ underlineVisivle: false })
                            this.props.history.push('/buy/scene');
                        } else {
                            Util.alert(res.msg, { type: 'error' })
                        }
                    }, error => {
                        Util.alert(error.msg, { type: 'error' })
                    })
            }
        })
    }
    underlineCancel = () => {
        this.pay_again = false
        this.setState({ underlineVisivle: false })
    }

    payAgain = () => {
        const { bondDealList } = this.state.sceneData;
        //目前只做 线下付款
        if (bondDealList.length) {
            api.ajax('get', '@/reuse/bondDeal/info', {
                uuids: bondDealList[0].uuids
            }).then(res => {
                let data = res.data
                this.pay_again = true
                this.setState({
                    underlineVisivle: true,
                    formData: {
                        payWay: data.payWay,
                        payAccountName: data.payAccountName,
                        payAccountNo: data.payAccountNo,
                        remark: data.remark,
                        fileName: data.fileName,//线下必传
                        filePath: data.filePath,//线下必传
                    },
                })
            })

        }
    }

    render() {
        const { sceneData } = this.state;
        const bondData = (sceneData.bondDealList && sceneData.bondDealList.length) ? sceneData.bondDealList[0] : {};
        return (
            <div className={less.payBond}>
                <Spin spinning={this.state.spinning}>
                    <div ref={ref => this.refs = ref}>
                        <Card title="场次基本信息">
                            {this.createSceneInfo()}
                        </Card>
                        <Card className="mt10" title="保证金要求">
                            {this.createDemand()}
                        </Card>
                        <Card className="mt10" title="缴纳保证金" extra={<Popconfirm title="您确定要重新付款吗?" onConfirm={this.payAgain}><Button type='primary' disabled={bondData.status != 20}>重新支付</Button></Popconfirm>}>
                            {this.createPay()}
                        </Card>
                    </div>
                </Spin>
                <Card className="mt10">
                    <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                        <Button type="ghost" onClick={closeWin}>关闭</Button>
                        <Button type="primary" onClick={() => Util.print(this.refs)}>打印</Button>
                    </div>
                </Card>

                <Modal
                    title={
                        <span>
                            <Icon className="color_b pdl10 pdr10" type="exclamation-circle" style={{ fontWeight: 'normal' }} />
                            <span>递交保证金</span>
                        </span>
                    }
                    visible={this.state.underlineVisivle}
                    width="600"
                    onCancel={this.underlineCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.underlineCancel}>取 消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.isPaying} onClick={this.underlineOk}>
                            付 款
                        </Button>
                    ]}>
                    <div>{this.createUnderline()}</div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(PayBond)
