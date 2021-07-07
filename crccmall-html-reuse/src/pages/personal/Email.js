import { Rate, Switch, Radio, Popconfirm, message, Timeline, Select, Card, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs } from 'antd';
import { systemConfig, systemConfigPath } from '../../utils/config/systemConfig';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import { Gswitch, Gcontext } from 'components/content/Gswitch';//打开其它页面使用
import "./personal.css";

class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,//修改密码按钮loading
            sendCodeButton: true,//默认显示获取验证码标签
            sendCodeButtonHTML: "获取验证码",//手机验证码发送按钮
        }
    }

    //父组件数据变更时执行
    componentWillReceiveProps(nextProps) {
        //每次打开模态框时执行
        if (this.props.visible != nextProps.visible && nextProps.visible) {
            clearInterval(this.state.interval);
            this.setState({
                loading: false,
                sendCodeButton: true,
                sendCodeButtonHTML: "获取验证码",
            })
            this.props.form.setFieldsValue({
                email: 1 == this.props.mailBindStatus ? this.props.email : null,
                emailCode: null
            });
        }
    }

    //新增修改邮箱保存confirm
    confirm = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            } else {
                this.save();
            }
        });
    }

    //修改邮箱保存
    save = () => {
        this.setState({
            loading: true
        })
        let formData = this.props.form.getFieldsValue();
        const params = {};
        let mailBindStatus;
        if (this.props.mailBindStatus == 1) {//已绑定,需解绑
            mailBindStatus = 2;
        } else if (this.props.mailBindStatus == 2) {//未绑定,需绑定
            mailBindStatus = 1;
        }
        params.mailBindStatus = mailBindStatus;//邮箱绑定状态
        params.uuids = this.props.safeUuids;//用户安全中心uuids
        params.email = formData.email;//绑定邮箱
        params.emailCode = formData.emailCode;//邮箱验证码
        axios.post("@/purchaser/personal/handMailBind", {
            ...params
        }).then(r => {
            this.setState({
                loading: false
            })
            if (r) {
                message.success("保存成功");
                this.props.close();
            }
        }, () => {
            this.setState({
                loading: false
            })
        });
    }

    //发送邮箱验证码
    sendEmailCode = () => {
        let that = this;
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors.email) {
                return;
            } else {
                let formData = this.props.form.getFieldsValue();
                const params = {};
                params.email = formData.email;
                axios.get("@/purchaser/personal/sendEmailCode", {
                    params
                }).then(r => {//成功

                }, () => {//失败

                });
            }
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
        });
    }

    render() {
        if (this.props.mailBindStatus == 1) {//已绑定邮箱

        } else if (this.props.mailBindStatus == 2) {//未绑定邮箱

        }

        const { getFieldProps } = this.props.form;
        const leftSpan = 1;
        const span = 20;
        return (
            <Modal ref="modal" className="personalEmail padding-bottom-0"
                width={550}
                visible={this.props.visible}
                title="修改绑定邮箱" onOk={this.handleOk} onCancel={this.props.close}
                footer={[
                    <Popconfirm placement="topLeft" title={"确认保存吗?"} onConfirm={this.confirm}>
                        <Button type="primary" loading={this.state.loading}>修改</Button>
                    </Popconfirm>
                ]}
            >
                <Row {...ComponentDefine.row_}>
                    <Col span={leftSpan} />
                    <Col span={span}>
                        <Form.Item required
                            {...ComponentDefine.form_.layout}
                            label={getDetailsLabel("邮箱账号")}>
                            <Input disabled={1 == this.props.mailBindStatus ? true : false}
                                placeholder="请输入电子邮箱账号" maxLength={40}
                                {...getFieldProps(`email`, {
                                    rules: [
                                        { required: true, message: "请输入电子邮箱账号" },
                                        { pattern: RegularDefine.isEmail(), message: '请输入正确的电子邮箱' }
                                    ]
                                })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row {...ComponentDefine.row_}>
                    <Col span={leftSpan} />
                    <Col span={span}>
                        <Form.Item required className="code_formItem"
                            {...ComponentDefine.form_.layout}
                            label={getDetailsLabel("邮箱验证码")}>
                            <Input placeholder="请登录邮箱查收并在此输入验证码"
                                maxLength={6}
                                {...getFieldProps(`emailCode`, {
                                    rules: [
                                        { required: true, message: "请输入验证码" }
                                    ]
                                })}
                            />
                            <div className="code_span" style={{ display: this.state.sendCodeButton ? "none" : "block" }}>
                                <span >{this.state.sendCodeButtonHTML}</span>
                            </div>
                            <div className="code_a" style={{ display: this.state.sendCodeButton ? "block" : "none" }}>
                                <a onClick={this.sendEmailCode}>{this.state.sendCodeButtonHTML}</a>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default Form.create()(Email)