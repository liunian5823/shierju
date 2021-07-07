import { Steps, Rate, Switch, Radio, Popconfirm, message, Timeline, Select, Card, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs } from 'antd';
import { systemConfig, systemConfigPath } from '../../utils/config/systemConfig';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import { Gswitch, Gcontext } from 'components/content/Gswitch';//打开其它页面使用
import "./personal.css";
import personalPhoneShape from '../../static/img/personal_phone_shape.png';

const Step = Steps.Step;//步骤条
class Phone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    //父组件数据变更时执行
    componentWillReceiveProps(nextProps) {
        //每次打开模态框时执行
        if (this.props.visible != nextProps.visible && nextProps.visible) {
            clearInterval(this.state.interval);
            let clientId = this.randomString();
            this.setState({
                loading: false,
                current: 0,
                currentStr: "下一步",
                sendCodeButton: true,
                sendCodeButtonHTML: "获取验证码",
                clientId: clientId,
                ecCaptcha: systemConfigPath.axiosUrl("/purchaser/personal/ecCaptcha?clientId=" + clientId + "&_=" + Math.random()),
            })
            this.props.form.setFieldsValue({
                oldPhone: nextProps.phone,//旧手机号码
                oldImgKey: null,//旧手机图形验证码
                oldCodeKey: null,//旧手机验证码

                newPhone: null,//新手机号码
                newImgKey: null,//新手机图形验证码
                newCodeKey: null,//新手机验证码
            });
        }
    }

    //保存confirm
    confirm = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            } else {
                if (this.state.current == 0) {//第一步
                    clearInterval(this.state.interval);
                    //
                    this.toSubmit(values);
                } else if (this.state.current == 1) {//第二步
                    //保存重新绑定信息并进入第三部
                    let formData = this.props.form.getFieldsValue();
                    const params = {};
                    params.uuids = this.props.uuids;//安全中心的uudis
                    params.oldPhone = this.state.oldPhone;//旧手机号码
                    params.oldPhoneCode = this.state.oldCodeKey;//旧手机验证码
                    params.newPhone = formData.newPhone;//新手机号码
                    params.newPhoneCode = formData.newCodeKey;//新手机验证码
                    params.currentStep = this.state.current;
                    axios.post("@/purchaser/personal/phoneRepreatBind", {
                        ...params
                    }).then(r => {
                        clearInterval(this.state.interval);
                        this.setState({
                            loading: false
                        })
                        if (r) {
                            this.setState({
                                current: 2,
                                currentStr: "完成",
                            })
                        }
                    }, () => {
                        this.setState({
                            loading: false
                        })
                    });
                } else if (this.state.current == 2) {//第三步
                    //完成
                    this.props.close();
                }
            }
        });
    }

    toSubmit = (values) => {
        this.setState({
            loading: true
        })
        let formData = this.props.form.getFieldsValue();
        let clientId = this.randomString();
        axios.post("@/purchaser/personal/phoneRepreatBind", {
            oldPhoneCode: formData.oldCodeKey,
            oldPhone: formData.oldPhone,
            currentStep: this.state.current
        }).then(r => {
            //设置获取验证码可点击
            this.onClickBtn();
            //进入第二步,并且初始化验证码
            this.setState({
                loading: false,
                current: 1,
                currentStr: "下一步",
                sendCodeButton: true,
                sendCodeButtonHTML: "获取验证码",
                clientId: clientId,
                ecCaptcha: systemConfigPath.axiosUrl("/purchaser/personal/ecCaptcha?clientId=" + clientId + "&_=" + Math.random()),
                oldPhone: formData.oldPhone,//旧手机号码
                oldCodeKey: formData.oldCodeKey,//旧手机验证码
            })
        }).catch(r => {
            // Util.alert(r.msg, { type: "error" })
            this.props.form.resetFields(['oldImgKey'])
            this.setState({
                loading: false,
                clientId: clientId,
                ecCaptcha: systemConfigPath.axiosUrl("/purchaser/personal/ecCaptcha?clientId=" + clientId + "&_=" + Math.random())
            })
            //设置获取验证码可点击
            this.onClickBtn();
        })
    }

    //图形验证码64位随机数
    randomString(len) {
        len = len || 64;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    //刷新图形验证码
    refreshEcCaptcha = () => {
        if (this.state.current == 0) {//第一步
            this.props.form.validateFieldsAndScroll(["oldPhone"], (errors, values) => {
                if (!!errors) {
                    return;
                } else {
                    let clientId = this.randomString();
                    this.setState({
                        clientId: clientId,
                        ecCaptcha: systemConfigPath.axiosUrl("/purchaser/personal/ecCaptcha?clientId=" + clientId + "&_=" + Math.random())
                    })
                }
            });
        } else if (this.state.current == 1) {//第二部
            this.props.form.validateFieldsAndScroll(["newPhone"], (errors, values) => {
                if (!!errors) {
                    return;
                } else {
                    let clientId = this.randomString();
                    this.setState({
                        clientId: clientId,
                        ecCaptcha: systemConfigPath.axiosUrl("/purchaser/personal/ecCaptcha?clientId=" + clientId + "&_=" + Math.random())
                    })
                }
            });
        } else {
        }
    }

    //获取短信验证码
    sendSmsCode = () => {
        this.offClickBtn();
        if (this.state.current == 0) {//第一步
            this.props.form.validateFieldsAndScroll(["oldPhone", "oldImgKey"], (errors, values) => {
                if (!!errors) {
                    this.onClickBtn();
                    return;
                } else {
                    const params = {};
                    params.clientId = this.state.clientId;
                    params.captchaCode = this.props.form.getFieldValue("oldImgKey");
                    axios.post("@/purchaser/personal/validateCaptchaCode", {
                        ...params
                    }).then(r => {//图形验证码正确
                        if (r) {
                            const params = {};
                            params.type = 6;
                            params.phone = this.props.form.getFieldValue("oldPhone");
                            //发送验证码
                            axios.get("@/purchaser/personal/sendSmsCode", {
                                params
                            }).then(r => {
                                this.setIntervalTime(this);
                                message.success("短信验证码已发送");
                            }).catch(r => {
                                this.onClickBtn();
                            });
                        }
                    }).catch(r => {
                        this.onClickBtn();
                    });
                }
            });
        } else if (this.state.current == 1) {//第二步
            this.props.form.validateFieldsAndScroll(["newPhone", "newImgKey"], (errors, values) => {
                if (!!errors) {
                    this.onClickBtn();
                    return;
                } else {
                    const params = {};
                    params.clientId = this.state.clientId;
                    params.captchaCode = this.props.form.getFieldValue("newImgKey");
                    axios.post("@/purchaser/personal/validateCaptchaCode", {
                        ...params
                    }).then(r => {//图形验证码正确
                        if (r) {
                            const params = {};
                            params.type = 5;
                            params.phone = this.props.form.getFieldValue("newPhone");
                            //发送验证码
                            axios.get("@/purchaser/personal/sendSmsCode", {
                                params
                            }).then(r => {
                                this.setIntervalTime(this);
                                message.success("短信验证码已发送");
                            }).catch(r => {
                                this.onClickBtn();
                            });
                        }
                    }).catch(r => {
                        this.onClickBtn();
                    });
                }
            });
        } else {
            this.onClickBtn();
        }
    }

    onClickBtn = () => {
        $('.getCode').css("pointer-events", "auto");
    }


    offClickBtn = () => {
        $('.getCode').css("pointer-events", "none");
    }

    //验证码倒计时
    setIntervalTime = (that) => {
        //获取验证码倒计时
        let intervalTime = 60;
        let interval = setInterval(function () {
            let time = intervalTime;
            if (time == 1) {
                that.setState({
                    sendCodeButton: true,
                    sendCodeButtonHTML: "获取验证码"
                })
                clearInterval(interval);
                //设置获取验证码可点击
                this.onClickBtn();
            } else {
                intervalTime -= 1;
                that.setState({
                    sendCodeButton: false,
                    sendCodeButtonHTML: "验证码(" + intervalTime + ")"
                })
            }
        }, 1000)
        this.setState({
            interval: interval
        })
    }

    //返回当前部分页面
    showPhone = () => {
        const { getFieldProps } = this.props.form;
        const leftSpan = 1;
        const span = 20;
        if (this.state.current == 0) {//验证当前手机
            return (
                <div>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("当前手机号")}>
                                <Input disabled={true}
                                    {...getFieldProps(`oldPhone`, {
                                        rules: [
                                            { required: true, message: "请输入手机号码" },
                                            { pattern: RegularDefine.telephone(), message: '请输入正确的手机号码' }
                                        ]
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("图片验证")}>
                                <Input placeholder="请输入验证码"
                                    style={{ width: "212px" }} maxLength={4}
                                    {...getFieldProps(`oldImgKey`, {
                                        rules: [
                                            { required: true, message: "请输入验证码" }
                                        ]
                                    })}
                                />
                                <img className="img_code" title="点击图片重新获取验证码" onClick={this.refreshEcCaptcha.bind(this, "oldPhone")} src={this.state.ecCaptcha} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item required className="code_formItem"
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("验证码")}>
                                <Input placeholder="请输入验证码"
                                    maxLength={6}
                                    {...getFieldProps(`oldCodeKey`, {
                                        rules: [
                                            { required: true, message: "请输入验证码" }
                                        ]
                                    })}
                                />
                                <div className="code_span" style={{ display: this.state.sendCodeButton ? "none" : "block" }}>
                                    <span >{this.state.sendCodeButtonHTML}</span>
                                </div>
                                <div className="code_a" style={{ display: this.state.sendCodeButton ? "block" : "none" }}>
                                    <a className='getCode' onClick={this.sendSmsCode}>{this.state.sendCodeButtonHTML}</a>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            )
        } else if (this.state.current == 1) {//绑定新手机
            return (
                <div>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("新手机号")}>
                                <Input placeholder="请输入新手机号"
                                    {...getFieldProps(`newPhone`, {
                                        rules: [
                                            { required: true, message: "请输入手机号码" },
                                            { pattern: RegularDefine.telephone(), message: '请输入正确的手机号码' }
                                        ]
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("图片验证")}>
                                <Input placeholder="请输入验证码"
                                    style={{ width: "212px" }} maxLength={4}
                                    {...getFieldProps(`newImgKey`, {
                                        rules: [
                                            { required: true, message: "请输入验证码" }
                                        ]
                                    })}
                                />
                                <img className="img_code" title="点击图片重新获取验证码" onClick={this.refreshEcCaptcha.bind(this, "oldPhone")} src={this.state.ecCaptcha} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item required className="code_formItem"
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("验证码")}>
                                <Input placeholder="请输入验证码"
                                    maxLength={6}
                                    {...getFieldProps(`newCodeKey`, {
                                        rules: [
                                            { required: true, message: "请输入验证码" }
                                        ]
                                    })}
                                />
                                <div className="code_span" style={{ display: this.state.sendCodeButton ? "none" : "block" }}>
                                    <span >{this.state.sendCodeButtonHTML}</span>
                                </div>
                                <div className="code_a" style={{ display: this.state.sendCodeButton ? "block" : "none" }}>
                                    <a className='getCode' onClick={this.sendSmsCode}>{this.state.sendCodeButtonHTML}</a>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            )
        } else if (this.state.current == 2) {//完成
            return (
                <div>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <div style={{
                                position: "relative",
                                marginBottom: "40px",
                                textAlign: "center",
                                top: "20px",
                                marginBottom: "40px"
                            }}
                            >
                                <img src={personalPhoneShape}></img>
                                <p style={{
                                    fontSize: "20px!important",
                                    fontWeight: "bold",
                                    color: "rgba(0,0,0,0.85)"
                                }}>操作成功</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
    }

    render() {
        const { getFieldProps } = this.props.form;
        const leftSpan = 1;
        const span = 20;
        return (
            <Modal ref="modal" className="personalPhone"
                width={550}
                visible={this.props.visible}
                title="重新绑定手机号" onOk={this.handleOk} onCancel={this.props.close}
                footer={[
                    <Button type="primary" loading={this.state.loading} onClick={this.confirm}>{this.state.currentStr}</Button>
                ]}
            >
                <Row className="margin-20-0">
                    <Col span={leftSpan} />
                    <Col span={span}>
                        <Steps size="small" current={this.state.current}>
                            <Step title="验证当前手机" />
                            <Step title="绑定新手机" />
                            <Step title="完成验证" />
                        </Steps>
                    </Col>
                </Row>
                {this.showPhone()}
            </Modal>
        )
    }
}

export default Form.create()(Phone)