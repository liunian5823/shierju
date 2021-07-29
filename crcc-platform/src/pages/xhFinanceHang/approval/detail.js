import {Card, Button, Switch, Modal, Tabs, Row, Col, Table, Form, Input, Radio} from 'antd';
import React from "react";
import api from '@/framework/axios';
import Util from '@/utils/util'
import BaseInput from '@/components/baseInput';


import less from "./detail.less";



const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class xhFinanceHangApprovalDetail extends React.Component {

    state = {
        info:{},
        sameStatement : {},
        payUuids:'',
        dataSource:[],


        phone: '',
        appLoading: false,
        visible: false,
        approvalType: 1,
        codeName: '获取验证码',
        codeDisabled: false,
        codeInputDisabled: false,
    }
    columns = [
        {
            title: '操作人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: 150,
            sorter: true
        },{
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            sorter: true
        },{
            title: '具体操作',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 190,
            sorter: true
        }
    ];
    _isMounted = false;
    _uuids  = '';
    _clientId = null;

    componentWillMount() {
        this._isMounted = true;
        this._clientId = Util.randomString(20)
        this._uuids = this.props.match.params.uuids;
        console.log("  this._uuids",  this._uuids);
        this.getInfo(this._uuids);
        //
        this.getPhone();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //获取当前审核的手机号码
    getPhone=()=>{
        api.ajax(
            'GET',
            '@/platform/xhFinanceHang/getPhone?type=2',
            {}
        ).then(r=>{
            this.setState({
                phone: r.data
            })
        })
    }

    getInfo = (uuids) =>{
        if(!uuids) return
        api.ajax("GET", "@/platform/xhFinanceHang/getMasterData", {
            workUuids: this._uuids
        }).then(r => {
            this.setState({
                info: r.data,
                payUuids:r.data.payUuids,
                dataSource:r.data.flog,
            });
            this.getSameStatement(r.data.payUuids);
            console.log("getInfo  r.data", r.data)
        }).catch(r => {

        })
    }

    getSameStatement = (payUuids) =>{
        if(!payUuids) return
        api.ajax("GET", "@/platform/xhFinanceHangFind/getPayOrder", {
            payUuids: payUuids
        }).then(r => {
            this.setState({
                sameStatement: r.data
            });
            console.log("getInfo  r.data", r.data)
        }).catch(r => {

        })
    }

    handleTitle = (workNo) => {
        let str = '来款信息';
        if(!workNo) return str;
        console.log("workNo!!!!!",workNo);
        return (
           str+"（工单号："+workNo+"）"
        )
    }

    /**
     * 审核弹框显示
     * @returns {*}
     */
    handApproval = () => {
        console.log('handApproval ---------------- ')
        this.setState({
            visible: true
        })
    }

    //跳转列表刷新
    toPageList=()=>{
        //关闭当前页面
        window.close();
        // window.opener.location.reload();   //刷新父页面
    }

    handleOK=()=>{
        //校验参数
        this.props.form.validateFields((errors, values)=>{
            if (!!errors) {
                return;
            }
            //加载中
            this.setState({
                appLoading: true
            })
            let{info, approvalType} = this.state;
            let params = {};
            params.verCode = values.verCode;
            params.remarks = values.remarks;
            params.approvalType = approvalType;
            params.handUuids = info.handUuids;
            params.workUuids = info.workUuids;
            api.ajax(
                'GET',
                '@/platform/xhFinanceHang/hangApproval',
                {...params}
            ).then(r=>{
                //审核成功
                Util.alert('操作成功！', {type: 'success'});
                //关闭当前页面刷新列表
                this.toPageList();
            }).catch(r=>{
                Util.alert(r.msg, {type: 'error'});
                return;
            })
            console.log('handleOK  values ------------ ', values)
        })
    }

    handleCancel=()=>{
        this.setState({
            visible: false
        })
    }

    //获取验证码
    getCode = () => {
        let _this = this;
        let params = {};
        params.type = type;
        params.code = this._clientId;
        api.ajax(
            'GET',
            '@/platform/xhFinanceHang/sendCheckCode',
            {...params}
        ).then(r=>{
            _this.props.form.setFieldsValue({ verCode: "" });
            _this.getCodeName();
            _this.setState({
                codeInputDisabled: false
            });
        })

    };

    //验证码倒计时
    getCodeName = () => {
        this.setState({
            codeDisabled: true
        })
        let that = this;
        let intervalTime = 60;
        let interval = setInterval(function() {
            let time = intervalTime;
            if (time == 1) {
                that.setState({
                    codeName: "获取验证码",
                    codeDisabled: false
                });
                clearInterval(interval);
            } else {
                intervalTime -= 1;
                that.setState({
                    codeName: "验证码(" + intervalTime + "s)"
                });
            }
        }, 1000);
    };

    //复核结果
    handleAuditChange=(e)=>{
        this.setState({
            approvalType: e.target.value
        })
    }




    render() {
        const { info,sameStatement, visible, approvalType, codeInputDisabled, codeDisabled, codeName, appLoading, phone} = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        const { getFieldProps } = this.props.form;

        return (
            <div>
                <Card bordered={false} className="mb10" title={this.handleTitle(info.orderNo)}>
                    <Row span={24}>
                        <Col span={16}>
                            <Row span={24}>
                                <Col span={12}>
                                    <p className={less.fontWeight700}>来款账户： </p>
                                    <p className={less.fontSize18}>{info.inAcctIdName}</p>
                                    <Row span={24}>
                                        <Col span={12}>
                                            <p className={less.marginBottom10}>来款账号：</p>
                                            <p className={less.marginBottom10}>流水号：</p>
                                            <p className={less.marginBottom10}>来款时间：</p>
                                            <p className={less.marginBottom10}>来款银行：</p>
                                        </Col>
                                        <Col>
                                            <p className={less.marginBottom10}>{info.inAcctId}</p>
                                            <p className={less.marginBottom10}>{info.frontLogNo}</p>
                                            <p className={less.marginBottom10}>{info.acctDate}</p>
                                            <p className={less.marginBottom10}> {info.bankName}</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <p className={[less.fontWeight700,less.marginBottom10].join(' ')} >来款金额（元）：</p>
                                    <p className={[less.fontSize18,less.marginBottom20].join(' ')} > {info.inAmount}</p>
                                    <p className={[less.fontWeight700,less.marginBottom10].join(' ')}>来款附言</p>
                                    <p className={less.fontSize18}>{info.note}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col  span={8}>
                            <p className={[less.fontWeight700,less.marginBottom10].join(' ')}>处理状态</p>
                            <p className={[less.fontSize18,less.marginBottom20].join(' ')}>{info.workOrdersStateStr}</p>
                            <Row span={24}>
                                <Col span={12}>
                                    <p>受理人：</p>
                                    <p>受理时间：</p>
                                </Col>
                                <Col>
                                    <p> {info.acceptanceUser}</p>
                                    <p> {info.acceptanceTime}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                <Card  bordered={false} className="mb10" title="疑似结算单">
                    <Row span={24} className={less.marginBottom10}>
                        <Col span={12}>买受人公司名称：</Col>
                        <Col span={12}><span>支付金额（元）：</span> <span className={less.marginLeft250}>关联{sameStatement.relationCount}次</span></Col>
                    </Row>
                    <Row span={24} className={less.marginBottom10}>
                        <Col span={12} className={less.fontSize18}>{sameStatement.buyCompanyName} </Col>
                        <Col span={12} className={less.fontSize18}>{sameStatement.amount}</Col>
                    </Row>
                    <Row span={24} className={less.marginBottom10}>
                        <Col span={12}>业务类型：</Col>
                        <Col span={12}>附言码：</Col>
                    </Row>
                    <Row span={24} className={less.marginBottom10}>
                        <Col span={12} className={less.fontSize18}>{sameStatement.typeStr}</Col>
                        <Col span={12} className={less.fontSize18}>{sameStatement.payCode}</Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Row span={24} className={less.marginBottom10} >
                                <Col span={5}>打款账户号：</Col>
                                <Col span={19}>{sameStatement.userPayAccountNo}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={5}>付款人：</Col>
                                <Col span={19}>{sameStatement.payUserName}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={5}>处置方公司：</Col>
                                <Col span={19}>{sameStatement.sellerCompanyName}</Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={5}>结算单号：</Col>
                                <Col span={19}>{sameStatement.settlementNo}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={5}>付款时间：</Col>
                                <Col span={19}>{sameStatement.payTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={5}>订单编号：</Col>
                                <Col span={19}>{sameStatement.orderNo}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={5}>支付单号：</Col>
                                <Col span={19}>{sameStatement.payNo}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                <Card  bordered={false} className="mb10" title="操作日志">
                    <Table
                        dataSource={this.state.dataSource}
                        columns={this.columns}
                        loading={false}
                        scroll={{ x: 1500 }}
                    />
                </Card>
                <Card  bordered={false} className="mb10" title="详细信息">
                    <Row span={24}>
                        <Col span={8}>
                            <Row span={24} className={less.marginBottom10} >
                                <Col span={12}>受理人：</Col>
                                <Col span={12}>{info.acceptanceUser}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>受理时间：</Col>
                                <Col span={12}>{info.acceptanceTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}></Col>
                                <Col span={12}></Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>处理时间：</Col>
                                <Col span={12}>{info.handleTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>处理结果：</Col>
                                <Col span={12}>{info.typeStr}</Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>业务类型：</Col>
                                <Col span={12}>{info.businessTypeStr}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>业务单号：</Col>
                                <Col span={12}>{info.businessNo}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}></Col>
                                <Col span={12}></Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>附件：</Col>
                                <Col span={12}>{info.fileName}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>处理说明：</Col>
                                <Col span={12}>{info.refundRemak}</Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>复核人：</Col>
                                <Col span={12}>{info.complexUser}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>复核时间：</Col>
                                <Col span={12}>{info.complexTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>审批结果：</Col>
                                <Col span={12}>{info.checkStatusStr}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>完成时间：</Col>
                                <Col span={12}>{info.finishTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={12}>复核说明：</Col>
                                <Col span={12}>{info.remak}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <div style={{textAlign:'center'}}>
                        <Button style={{ marginRight: "10px" }} >关闭</Button>
                        <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handApproval}>审核</Button>
                    </div>
                </Card>

                {/*挂账复核弹窗*/}
                <Modal
                    title={'挂账匹配复核'}
                    visible={visible}
                    onOk={this.handleOK}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button loading={appLoading} type={'ghost'} onClick={this.handleCancel}>返回</Button>,
                        <Button loading={appLoading} type={'primary'} onClick={this.handleOK}>确定</Button>
                    ]}
                >
                    <Form>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"来款账户名"}
                            >
                                {info.inAcctIdName}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"来款账户号"}
                            >
                                {info.inAcctId}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"付款企业名称"}
                            >
                                {info.inAcctIdName}
                            </FormItem>
                        </Row>

                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"业务类型"}
                            >
                                {info.businessTypeStr}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"来款金额"}
                            >
                                {info.inAmount}
                            </FormItem>
                        </Row>

                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"处置方式"}
                            >
                                {info.typeStr}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"审核结果"}
                                required
                            >
                                <RadioGroup onChange={this.handleAuditChange} value={approvalType}>
                                    <Radio key="1" value={1}>通过</Radio>
                                    <Radio key="2" value={2}>驳回</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Row>

                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"说明"}
                            >
                                <BaseInput
                                    type="textarea"
                                    rows={3}
                                    maxLength={200}
                                    {...getFieldProps(`remarks`, {
                                        rules: [
                                            { required: true, message: "请输入说明" },
                                        ]
                                    })}
                                />
                            </FormItem>
                        </Row>

                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"手机验证码"}
                            >
                                <Input
                                    placeholder={phone}
                                    maxLength={6}
                                    className={less.width210}
                                    disabled={codeInputDisabled}
                                    {...getFieldProps(`verCode`, {
                                        rules: [
                                            { required: true, message: "请输入验证码" },
                                            { pattern: /^\d{6}$/, message: "请输入验证码" }
                                        ]
                                    })}
                                />
                                <Button type="primary" onClick={this.getCode} disabled={codeDisabled} className={less.marginLeft5}>
                                    {codeName}
                                </Button>
                            </FormItem>
                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }


}
export default Form.create()(xhFinanceHangApprovalDetail);