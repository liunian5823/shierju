import { Switch, message, Card, Form, Col, Button, Table, Modal } from 'antd';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import { tablePagination_, } from "@/utils/config/componentDefine";//分页等公共组件
import moment from 'moment';//时间格式转换
import Head from '@/static/img/head.png';//默认头像
import CardPng from '@/static/img/card.png';//默认身份证
import Passport from '@/static/img/passport.png';//默认护照

import "./user.css";
import { session } from "@/utils/storage";
import history from "@/utils/history";

class UserDetail extends React.Component {
   /* static defaultProps = {
        uuids: session.getItem('userUuids'),
        switchShow: session.getItem('userShow'),
        close() {
            history.push('/organization/user');
        }
    };*/
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            tableData: [
                //下方操作记录
            ],
            visible: false,//证件展示开关
            loading: false,//重置密码loading
            roleSource: {
                list: []
            },
        }
    }
    tableChange = (pagination, filters, sorter) => {
        let searchData = {};
        if (filters.state && filters.state.length == 1) {
            searchData.state = filters.state[0];
        }
        if (sorter.columnKey) {
            searchData.querysort = sorter.columnKey;
            searchData.order = sorter.order.replace("end", "");
        }
        this.handleSearch(pagination.current, pagination.pageSize);
    }
    tableChange1 = (pagination, filters, sorter) => {
        let searchData = {};
        if (filters.state && filters.state.length == 1) {
            searchData.state = filters.state[0];
        }
        if (sorter.columnKey) {
            searchData.querysort = sorter.columnKey;
            searchData.order = sorter.order.replace("end", "");
        }
        this.handleSearch1(pagination.current, pagination.pageSize);
    }
    componentWillMount() {
        this.refresh();
    };
    refresh = () => {
        //查询账户基本信息
        const params = {};
        params.uuids = this.props.uuids;
        axios.get("@/reuse/user/getUserDetail", {
            params: params
        }).then(({ data: r }) => {
            if (r.userPhotoPath == "deleted") {
                r.userPhotoPath = ""
            }
            if (r.citizenPhotoPath == "deleted") {
                r.citizenPhotoPath = ""
            }
            if (r.citizenPhotoPath2 == "deleted") {
                r.citizenPhotoPath2 = ""
            }
            this.setState({
                dataSource: r
            }, () => {
                this.handleSearch(1, tablePagination_.defaultPageSize);
                this.handleSearch1(1, tablePagination_.defaultPageSize);
            });
        });

    };
    //列表相关
    handleSearch = (page, pageSize, event) => {
        const params = {};
        params.page = page
        params.pageSize = pageSize
        params.uuids = this.props.uuids;
        //岗位信息列表
        axios.get("@/reuse/orgRoleListController/queryOrgRoleListForPage", {
            params: params
        }).then(r => {
            this.setState({
                roleSource: r.data
            }, () => {

            })
        });
    };
    handleSearch1 = (page, pageSize, event) => {
        const params = {};
        params.page = page
        params.pageSize = pageSize
        params.sort = 'id'
        params.dir = 'desc'
        params.uuids = this.props.uuids;
        //查询账户操作日志

        axios.get("@/reuse/user/commonLogPage", {
            params: {
                ...params,
                companyId: this.state.dataSource.companyId
            }
        }).then(r => {
            this.setState({
                tableData: r.data
            });
        })
    };
    onChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };
    onShowSizeChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };

    roleColumn = [
        {
            title: '序号',
            dataIndex: 'xuhao',
            key: 'xuhao',
            width: "50",
            render: (text, record, index) => {
                return <span title={index + 1}>{index + 1}</span>
            }
        },
        {
            title: '部门',
            dataIndex: 'organizationName',
            key: 'organizationName',
            width: "400",
            render: (text) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '加入时间',
            dataIndex: 'dispatchDateStr',
            key: 'dispatchDateStr',
            width: "150",
            render: (text) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '职务',
            dataIndex: 'roleName',
            key: 'roleName',
            width: "150",
            render: (text) => {
                return <span title={text}>{text}</span>
            }
        }
    ];

    columns = [{
        title: '登录ip',
        dataIndex: 'ipAddress',
        key: 'ipAddress',
    }, {
        title: '操作时间',
        dataIndex: 'operTime',
        key: 'operTime',
        render: (text) => (
            <div>
                {text == null ? text : moment(text).format("YYYY-MM-DD HH:mm:ss")}
            </div>
        ),
    }, {
        title: '事件',
        dataIndex: 'content',
        key: 'content',
    }];

    //确认密码
    confirm = () => {
        this.setState({
            loading: true
        })
        Modal.confirm({
            title: '确认保存吗？',
            content: "密码将随机生成并发送至于账号绑定的手机号为"
                //+(this.state.dataSource.phone?this.state.dataSource.phone.substr(0, 3) + '****' + this.state.dataSource.phone.substr(7):"***********")
                + this.state.dataSource.phone
                + "的手机上。",
            okText: "确定",
            cancelText: '取消',
            onOk: this.resetPassword,
            onCancel: () => {
                this.setState({
                    loading: false
                })
            }
        });
    }
    //重置密码
    resetPassword = () => {
        const params = {};
        params.uuids = this.props.uuids;
        axios.get("@/reuse/user/resetPwd", {
            params: params
        }).then(r => {
            if (r) {
                this.setState({
                    loading: false
                })
                message.success("密码已重置");
            }
        }, () => {
            this.setState({
                loading: false
            })
        });
    }

    //展示身份证图片
    showImg = () => {
        this.setState({
            visible: true
        });
    }

    //停用启用账号
    onChangeState = (bool) => {
        let record = this.state.dataSource
        let state = bool
        //公司管理处理
        let arr = record.roleId.trim(',').split(',');
        if (arr.includes('13')) {//包含公司管理
            message.error("公司管理不可停用");
            return;
        }
        //提示语调整
        const params = {};
        let titleText = ""
        let contentText = "";
        let messageText = "";
        if (state) {//将要开启
            params.state = 1;
            titleText = "确认开启账号吗?"
            contentText = "开启账号后，该账号将恢复使用，是否确认开启？"
            messageText = "账号已恢复";
        } else {//将要关闭
            params.state = 0;
            titleText = "确认关闭账号吗?"
            contentText = "关闭账号后，该账号将无法登陆，是否确认关闭？"
            messageText = "账号已关闭";
        }

        Modal.confirm({
            title: titleText,
            content: contentText,
            okText: "确定",
            cancelText: '取消',
            onOk: () => {
                //请求
                let uuids = record.uuids;
                params.uuids = uuids
                axios.post("@/reuse/user/changeState", {
                    ...params
                }).then(r => {
                    if (r) {
                        message.success(r.msg);
                        record.state = bool ? 1 : 0
                        this.setState({
                            dataSource: record
                        })
                    }
                });
            }
        });
    }

    closeModal = () => {
        this.setState({
            visible: false
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
    };

    //查看证件展示
    cardTypeShow = () => {
        if (this.state.dataSource && this.state.dataSource.cardType == 0) {//身份证
            return (
                <div>
                    <img alt="图片加载失败" style={{ width: "520px", height: "290px" }} src={this.state.dataSource.citizenPhotoPath ? SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.citizenPhotoPath) : CardPng} />
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
    };

    render() {
        const pagination = ComponentDefine.getPagination_(this.state.roleSource);
        const pagination1 = ComponentDefine.getPagination_(this.state.tableData);
        let cardTypeStr = "";
        if (this.state.dataSource && this.state.dataSource.cardType == 0) {//身份证
            cardTypeStr = "身份证号";
        } else if (this.state.dataSource && this.state.dataSource.cardType == 1) {//护照
            cardTypeStr = "护照号码";
        } else {
            cardTypeStr = "身份证号";
        }
        return (
            <div className="userDetail">
                <Card className="card-margin-bottom" title="账号信息" extra={<Switch checked={this.state.dataSource.state == 1} onChange={this.onChangeState} />}>
                    <row>
                        <img className="userDetail_img" alt="example" src={this.state.dataSource.userPhotoPath ? SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.userPhotoPath) : Head} />
                        <Col span={9}>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("员工姓名")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.username ? this.state.dataSource.username : "—"}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("员工性别")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.gender == "0" ? "女士" : this.state.dataSource.gender == "1" ? "先生" : "—"}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel(cardTypeStr)}
                                    >
                                        {this.state.dataSource.citizenCode ? <p className="ant-form-text">{this.state.dataSource.citizenCode}</p> : <none></none>}
                                        {this.cardTypeAShow()}
                                    </Form.Item>
                                </Col>
                            </row>
                        </Col>
                        <Col span={8}>
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
                                        {/*<p className="ant-form-text">{this.state.dataSource.phone?this.state.dataSource.phone.substr(0, 3) + '****' + this.state.dataSource.phone.substr(7):""}</p>*/}
                                        <p className="ant-form-text">{this.state.dataSource.phone}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                            <row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("通信地址")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.address}</p>
                                    </Form.Item>
                                </Col>
                            </row>
                        </Col>
                        <Col span={3} style={{ position: "relative", top: "26px" }}>
                            <PermissionsBtn only>
                                <Button type="primary" loading={this.state.loading} onClick={this.confirm}>重置密码</Button>
                            </PermissionsBtn>
                        </Col>
                    </row>
                </Card>
                <Card title="岗位信息" className="card-margin-bottom">
                    <Table
                        {...ComponentDefine.table_}
                        rowKey="roleOrg"
                        columns={this.roleColumn}
                        scroll={{ x: 950 }}
                        rowSelection={null}
                        pagination={pagination}
                        dataSource={this.state.roleSource.list}
                        onChange={this.tableChange}
                    />
                </Card>
                <Card title="操作日志" style={{ marginBottom: '60px' }}>
                    <Table
                        {...ComponentDefine.table_}
                        rowKey="ecOrganization"
                        rowSelection={null}
                        pagination={pagination1}
                        columns={this.columns}
                        dataSource={this.state.tableData.list}
                        onChange={this.tableChange1}
                    />
                </Card>
                <div className="fixed_button">
                    <DetailsBtns>
                        <PermissionsBtn noauth>
                            <Button onClick={this.props.callback}>返回</Button>
                        </PermissionsBtn>
                    </DetailsBtns>
                </div>

                {/*身份证展示模态框*/}
                <Modal ref="modal"
                    width={550}
                    visible={this.state.visible}
                    title="查看证件" onOk={this.handleOk} onCancel={this.closeModal}
                    footer={[
                    ]}
                >
                    {this.cardTypeShow()}
                </Modal>
            </div>
        )
    }
}

export default UserDetail
