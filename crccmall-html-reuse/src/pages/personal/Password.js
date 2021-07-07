import { Rate, Switch, Radio, Popconfirm, message, Timeline, Select, Card, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs } from 'antd';
import { systemConfig, systemConfigPath } from '../../utils/config/systemConfig';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import { Gswitch, Gcontext } from 'components/content/Gswitch';//打开其它页面使用
import PasswordLevel from 'business/personal/passwordLevel/PasswordLevel';//密码等级验证
import "./personal.css";
import api from '@/framework/axios';

class Password extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,//修改密码按钮loading
            newPassBarShow: false, // 是否显示密码强度提示条
            newPassStrength: 'L', // 密码强度
            confirmPassBarShow: false, // 是否显示密码强度提示条
            confirmPassStrength: 'L', // 密码强度
        }
    }

    //父组件数据变更时执行
    componentWillReceiveProps(nextProps) {
        //每次打开模态框时执行
        if (this.props.visible != nextProps.visible && nextProps.visible) {
            this.setState({
                loading: false,
                newPassBarShow: false,
                newPassStrength: 'L',
                confirmPassBarShow: false,
                confirmPassStrength: 'L',
            })
            this.props.form.setFieldsValue({
                oldPassword: null,
                newPassword: null,
                confirmPassword: null,
            });
        }
    }

    //修改密码后重新登录
    logout = () => {
        // if(process.env.SYS_ENV === 'production_test'){
        //     window.location.href=SystemConfig.configs.logoutUrl;
        //     return
        // }
        // if(process.env.SYS_ENV === 'production_deploy'){
        //     window.location.href=SystemConfig.configs.logoutUrl;
        //     return
        // }
        api.ajax("POST", "@/sso/loginControl/loginOut", {
        }).then(res => {
            window.location.reload();
        })
        // axios.get('@/common/user/logout', {
        // }).then(function (response) {
        //     window.location.reload();
        // })
    }

    //确认修改密码
    confirm = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            } else {
                this.save()
            }
        });
    }

    //修改密码保存
    save = () => {
        this.setState({
            loading: true
        })
        let formData = this.props.form.getFieldsValue();
        const params = {};
        params.password = formData.oldPassword;
        params.newPassword = formData.newPassword;
        params.confirmPassword = formData.confirmPassword;
        api.ajax('get', "@/reuse/personal/modifyPwd", {
            ...params,
            uuids: this.props.userInfo.uuids,
            userId: this.props.userInfo.id
        }).then(r => {
            message.success("密码已修改");
            this.logout();
        }, (e) => {
            message.error(e.msg);
            this.setState({
                loading: false
            })
        });
    }

    // 新密码校验:
    newPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (form.getFieldValue('newPassword')) {
            form.validateFields(['confirmPassword'], { force: true });
        }
        callback();
    }

    //确认密码校验:一致性校验
    confirmPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两次输入的密码不一致！');
        } else {
            callback();
        }
    }

    render() {
        const { getFieldProps } = this.props.form;
        const leftSpan = 1;
        const span = 17;
        return (
            <Modal ref="modal" className="personalPassword"
                width={550}
                visible={this.props.visible}
                title="修改登录密码" onOk={this.handleOk} onCancel={this.props.close}
                footer={[
                    <Popconfirm placement="topLeft" title={"是否确认修改密码?"} onConfirm={this.confirm}>
                        <Button type="primary" loading={this.state.loading}>修改</Button>
                    </Popconfirm>
                ]}
            >
                <Row {...ComponentDefine.row_}>
                    <Col span={leftSpan} />
                    <Col span={span}>
                        <Form.Item required
                            {...ComponentDefine.form_.layout}
                            label={getDetailsLabel("旧密码")}>
                            <Input placeholder="请输入旧密码"
                                type="password" maxLength={32}
                                {...getFieldProps(`oldPassword`, {
                                    rules: [
                                        { required: true, message: "请输入" }
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
                            label={getDetailsLabel("新密码")}>
                            <Input placeholder="请输入新 密码"
                                type="password" maxLength={32}
                                {...getFieldProps(`newPassword`, {
                                    rules: [
                                        { required: true, message: "请输入新密码" },
                                        { pattern: RegularDefine.password(), message: '密码中包含数字和大小写字母或特殊字符，8位～32位' },
                                        { validator: this.newPassword }
                                    ]
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <PasswordLevel value={this.props.form.getFieldValue("newPassword")} />
                    </Col>
                </Row>
                <Row {...ComponentDefine.row_}>
                    <Col span={leftSpan} />
                    <Col span={span}>
                        <Form.Item required
                            {...ComponentDefine.form_.layout}
                            label={getDetailsLabel("确认新密码")}>
                            <Input placeholder="请确认新密码"
                                type="password" maxLength={32}
                                {...getFieldProps(`confirmPassword`, {
                                    rules: [
                                        { required: true, message: "请确认新密码" },
                                        { pattern: RegularDefine.password(), message: '密码中包含数字和大小写字母或特殊字符，8位～32位' },
                                        { validator: this.confirmPassword }
                                    ]
                                })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default Form.create()(Password)