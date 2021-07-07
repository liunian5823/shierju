import { Rate, message, Select, Card, Form, Row, Col, Button, Table, Modal, DatePicker, Tabs } from 'antd';
import { getDetailsLabel } from 'components/page/Details';
import { PermissionsBtn } from 'components/content/DetailsBtns';
import moment from 'moment';//时间格式转换
import { tablePagination_ } from "../../utils/config/componentDefine";//分页等公共组件
import { Gswitch, Gcontext } from 'components/content/Gswitch';//打开其它页面使用
import EditPersonal from './EditPersonal';//修改个人信息
import Password from './Password';//修改密码
import Email from './Email';//重新绑定邮箱
import Phone from './Phone';//重新绑定手机
import "./personal.css";
import Head from '../../static/img/head.png';
import CardPng from '../../static/img/card.png';//默认身份证
import Passport from '../../static/img/passport.png';//默认护照
import Safe from '../../static/img/safe.png';
import Warning from '../../static/img/warning.png';
import Error from '../../static/img/error.png';

class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                //账户信息
            },
            recentLoginFourTime: [],//最近四次登录日志
            tableData: {
                //岗位信息
            },
            userPhotoPath: Head,//默认头像
            switchShow: 0,//其它页面
            visible: false,//证件展示开关
            passwordVisible: false,//密码
            emailVisible: false,//邮箱
            emailButtonStr: "",
            phoneVisible: false,//手机
            shimingVisible: false,//实名
        }
    }

    componentWillMount() {
        this.refresh();
    }

    //刷新账户安全信息
    refresh = () => {
        //查询账户安全信息
        axios.get("@/purchaser/personal/getUser").then(r => {
            //性别处理
            let genderStr = "—";
            if (r.gender == 0) {
                genderStr = "女士";
            } else if (r.gender == 1) {
                genderStr = "先生";
            }
            //证件类型
            let cardType = 0;
            if (r.cardType == 1) {//护照
                cardType = 1;
            }
            //头像,身份证护照地址拼接
            let userPhotoPath = r.userPhotoPath;
            if (userPhotoPath && userPhotoPath != "deleted") {
                userPhotoPath = SystemConfig.systemConfigPath.dfsPathUrl(userPhotoPath);
            } else {
                userPhotoPath = Head;
            }
            if (r.citizenPhotoPath == "deleted") {
                r.citizenPhotoPath = ""
            }
            if (r.citizenPhotoPath2 == "deleted") {
                r.citizenPhotoPath2 = ""
            }
            //邮箱绑定状态
            let mailBindStatus = r.mailBindStatus;
            let emailButtonStr;
            if (mailBindStatus == 1) {//已绑定邮箱
                emailButtonStr = "解绑邮箱";
            } else if (mailBindStatus == 2) {//未绑定邮箱
                emailButtonStr = "绑定邮箱";
            }
            //账户安全页四种安全措施级别初始化
            let t = 1 == r.phoneBindStatus ? 2 : 1
                , n = r.passwordStatus - 1
                , a = 0;
            2 == r.mailBindStatus && r.email ? a = 1 : 1 == r.mailBindStatus && (a = 2);
            this.setState({
                dataSource: r,
                genderStr: genderStr,
                userPhotoPath: userPhotoPath,
                emailButtonStr: emailButtonStr,
                emailStatus: a,
                pwdStatus: n,
                phoneStatus: t,
                cardType: cardType
            });
        });
        //查询账户登录日志
        axios.post("@/purchaser/personal/queryRecentLoginFourTime").then(r => {
            this.setState({
                recentLoginFourTime: r
            });
        });
        //查询岗位信息
        this.handleSearch(1, tablePagination_.defaultPageSize);
    }

    //岗位列表查询方法
    handleSearch = (page, pageSize, event) => {
        let params = {}
        params.page = page
        params.pageSize = pageSize
        event && event.preventDefault();
        axios.get("@/purchaser/personal/getJobList", {
            params: params
        }).then(r => {
            this.setState({
                tableData: r
            });
        });
    };
    //岗位列表分页相关
    onChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };
    //岗位列表分页相关
    onShowSizeChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };
    //岗位列表colomn
    columns = [{
        title: '部门名称',
        dataIndex: 'orgName',
        key: 'orgName',
    }, {
        title: '加入时间',
        dataIndex: 'dispatchDate',
        key: 'dispatchDate',
        render: (text, record) => (
            <div>
                {text ? moment(text).format("YYYY/MM/DD HH:mm:ss") : ""}
            </div>
        )
    }, {
        title: '职务',
        dataIndex: 'roleName',
        key: 'roleName',
    }];

    //展示身份证图片
    showImg = () => {
        this.setState({
            visible: true
        });
    }

    //查看证件展示
    cardTypeAShow = () => {
        if (this.state.dataSource && this.state.dataSource.cardType == 0) {//身份证
            if (this.state.dataSource.citizenPhotoPath || this.state.dataSource.citizenPhotoPath2) {
                return (
                    <p className="ant-form-text"><a className="ant-form-text-btn" onClick={this.showImg}>查看证件</a></p>
                )
            }
        } else if (this.state.dataSource && this.state.dataSource.cardType == 1) {//护照
            if (this.state.dataSource.citizenPhotoPath) {
                return (
                    <p className="ant-form-text"><a className="ant-form-text-btn" onClick={this.showImg}>查看证件</a></p>
                )
            }
        }
    }

    //查看证件展示
    cardTypeShow = () => {
        if (this.state.dataSource && this.state.dataSource.cardType == 0) {//身份证
            return (
                <div>
                    <img alt="图片加载失败" style={{
                        width: "520px",
                        height: "290px",
                        float: "left",
                        marginBottom: "24px"
                    }} src={this.state.dataSource.citizenPhotoPath ? SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.citizenPhotoPath) : CardPng} />
                    <img alt="图片加载失败" style={{ width: "520px", height: "290px" }} src={this.state.dataSource.citizenPhotoPath2 ? SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.citizenPhotoPath2) : CardPng} />
                </div>
            )
        } else if (this.state.dataSource && this.state.dataSource.cardType == 1) {//护照
            return (
                <div>
                    <img alt="图片加载失败" style={{ width: "520px", height: "290px" }} src={this.state.dataSource.citizenPhotoPath ? SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.citizenPhotoPath) : Passport} />
                </div>
            )
        }
    }

    //关闭身份证展示模态框
    closeModal = () => {
        this.setState({
            visible: false
        });
    }

    //编辑个人信息成功回调
    editUserCallBack = () => {
        this.closeContent();//关闭窗口
        this.refresh();//重新查询个人信息
    }

    //打开编辑个人信息窗口
    openContent = () => {
        this.setState({
            switchShow: 2
        });
    }

    //回到当前窗口
    closeContent = () => {
        this.setState({
            switchShow: 0
        });
    }

    //打开修改密码窗口
    openPassword = () => {
        this.setState({
            passwordVisible: true
        });
    }
    //关闭修改密码窗口
    closePassword = () => {
        this.setState({
            passwordVisible: false
        });
    }
    //打开邮箱绑定窗口
    openEmail = () => {
        this.setState({
            emailVisible: true
        });
    }
    //关闭邮箱绑定窗口
    closeEmail = () => {
        this.setState({
            emailVisible: false
        }, () => {
            this.refresh();
        });
    }
    //打开手机绑定窗口
    openPhone = () => {
        this.setState({
            phoneVisible: true
        });
    }
    //关闭手机绑定窗口
    closePhone = () => {
        this.setState({
            phoneVisible: false
        }, () => {
            this.refresh();
        });
    }
    //打开实名认证窗口
    openRealName = () => {
        message.error("该功能暂未开放");
        return;
    }

    //返回账户安全等级
    renderSafeLevel = () => {
        let securityLevel = this.state.dataSource.securityLevel;
        if (securityLevel > 4) {
            return <p className="ant-form-text"><Rate disabled value={this.state.dataSource.securityLevel} /><span className="c_52C41A">较好</span></p>
        } else if (securityLevel > 3) {
            return <p className="ant-form-text"><Rate disabled value={this.state.dataSource.securityLevel} /><span className="c_FAAD14">良好</span></p>
        } else {
            return <p className="ant-form-text"><Rate disabled value={this.state.dataSource.securityLevel} /><span className="c_E4393C">较差</span></p>
        }
    }

    //创建图标
    renderIcon = (t) => {
        if (t == 0) {//错误
            return (
                <img className="img" src={Error} />
            )
        } else if (t == 1) {//警告
            return (
                <img className="img" src={Warning} />
            )
        } else if (t == 2) {//安全
            return (
                <img className="img" src={Safe} />
            )
        } else {//错误
            return (
                <img className="img" src={Error} />
            )
        }
    }

    //返回最近四次的登录日志
    queryRecentLoginFourTime = () => {
        if (this.state.recentLoginFourTime) {
            return (
                <div style={{ marginTop: "-9px" }}>
                    {this.state.recentLoginFourTime.map((item, index) => {
                        return (
                            <p className="ant-form-text margin-top-8">
                                <span>{moment(item.loginTime).format("YYYY-MM-DD HH:mm:ss")} </span>
                                <span>{item.loginAddress}</span>
                                <span>{0 == item.loginStatus ? "未发现异常" : ""}</span>
                            </p>)
                    })}
                </div>
            )
        }
    }

    render() {
        let leftSpan = 18;
        let rightSpan = null;
        const pagination = ComponentDefine.getPagination_(this.state.tableData, this.onChange, this.onShowSizeChange);
        return (
            <div className="personal">
                {/*个人信息*/}
                <Card title="账号信息" className="card-margin-bottom ant-card-extra-top-8"
                    extra={<PermissionsBtn only><Button onClick={this.openContent}>修改个人信息</Button></PermissionsBtn>}
                >
                    <row>
                        <img className="userDetail_img" alt="example" src={this.state.userPhotoPath} />
                        <Col span={9}>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("姓  名")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.username}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("性  别")}
                                    >
                                        <p className="ant-form-text">{this.state.genderStr}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("电子邮箱")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.email}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("手机号码")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.phone}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("身份证号")}
                                    >
                                        {this.state.dataSource.citizenCode ? <p className="ant-form-text">{this.state.dataSource.citizenCode}</p> : <none></none>}
                                        <p className="ant-form-text"><a className="ant-form-text-btn" onClick={this.showImg}>查看证件</a></p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("通信地址")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.address ? this.state.dataSource.address : "—"}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("推荐码")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.recommendCode ? this.state.dataSource.recommendCode : "—"}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                        </Col>
                        <Col className="border_F3F3F3" span={1}>
                        </Col>
                        <Col span={11}>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item className="safe_level"
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("安全等级")}
                                    >
                                        {this.renderSafeLevel()}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("安全建议")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.safetyAdvice}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("近期登陆")}
                                    >
                                        {this.queryRecentLoginFourTime()}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </row>
                </Card>
                {/*账户安全信息*/}
                <Card className="card-margin-bottom card2" title="安全中心">
                    <Row className="row">
                        <Col span={leftSpan}>
                            <div>
                                {this.renderIcon(this.state.pwdStatus)}
                                <span className="span">登录密码<em className="em"></em>{this.state.dataSource.passwordMsg}</span>
                            </div>
                        </Col>
                        <Col span={rightSpan}>
                            <div className="button-div">
                                <PermissionsBtn only>
                                    <Button className="btn88" onClick={this.openPassword}>修改密码</Button>
                                </PermissionsBtn>
                            </div>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span={leftSpan}>
                            <div>
                                {this.renderIcon(this.state.emailStatus)}
                                <span className="span">邮箱验证<em className="em"></em>{this.state.dataSource.mailBindMsg}</span>
                            </div>
                        </Col>
                        <Col span={rightSpan}>
                            <div className="button-div">
                                <PermissionsBtn only>
                                    <Button onClick={this.openEmail}>{this.state.emailButtonStr ? this.state.emailButtonStr : "绑定邮箱"}</Button>
                                </PermissionsBtn>
                            </div>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span={leftSpan}>
                            <div>
                                {this.renderIcon(this.state.phoneStatus)}
                                <span className="span">手机验证<em className="em"></em>{this.state.dataSource.phoneBindMsg}</span>
                            </div>
                        </Col>
                        <Col span={rightSpan}>
                            <div className="button-div">
                                <PermissionsBtn only>
                                    <Button onClick={this.openPhone}>重新绑定</Button>
                                </PermissionsBtn>
                            </div>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span={leftSpan}>
                            <div>
                                {this.renderIcon(this.state.qweasdzxc)}
                                <span className="span">实名认证<em className="em"></em><span>该功能暂未开放</span></span>
                                {/*{this.state.dataSource.realNameVerificationMsg}*/}
                            </div>
                        </Col>
                        <Col span={rightSpan}>
                            <div className="button-div" style={{ marginBottom: "22px", marginRight: "8px" }}>
                                {/*<PermissionsBtn></PermissionsBtn>*/}
                                <Button disabled={true} type="ghost" onClick={this.openRealName}>暂未开放</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                {/*岗位信息列表*/}
                <Card className="card3" title="岗位信息">
                    <Table columns={this.columns} dataSource={this.state.tableData.list} pagination={pagination} />
                </Card>
                {/*编辑个人信息窗口*/}
                <Gswitch switchShow={this.state.switchShow}>
                    <Gcontext ref="2" title="编辑个人信息">
                        <EditPersonal
                            switchShow={3}
                            user={this.state.dataSource}
                            close={this.closeContent}
                            callback={this.editUserCallBack}
                        />
                    </Gcontext>
                </Gswitch>
                {/*身份证展示模态框*/}
                <Modal ref="modal" className="personalShowCardModal"
                    width={566}
                    visible={this.state.visible}
                    title="查看证件" onOk={this.handleOk} onCancel={this.closeModal}
                    footer={[]}
                >
                    {this.cardTypeShow()}
                </Modal>
                {/*密码*/}
                <Password
                    visible={this.state.passwordVisible}
                    close={this.closePassword}
                />
                {/*邮箱*/}
                <Email
                    visible={this.state.emailVisible}
                    mailBindStatus={this.state.dataSource.mailBindStatus}
                    email={this.state.dataSource.email}
                    safeUuids={this.state.dataSource.epscUuids}
                    close={this.closeEmail}
                />
                {/*手机*/}
                <Phone
                    uuids={this.state.dataSource.epscUuids}
                    phone={this.state.dataSource.phone}
                    visible={this.state.phoneVisible}
                    close={this.closePhone}
                />
            </div>
        )
    }
}

export default Personal