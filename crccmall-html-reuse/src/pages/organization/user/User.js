import {
    Switch, Popconfirm, message, Timeline, Select, Card, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs
} from 'antd';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import SearchBar from 'components/page/SearchBar';//上下结构搜索容器
import { tablePagination_, btnName_ } from "@/utils/config/componentDefine";//分页等公共组件
import moment from 'moment';//时间格式转换
import { Gswitch, Gcontext } from 'components/content/Gswitch';//打开其它页面使用
import EditUser from './EditUser';//新增/修改员工
import UserDetail from './UserDetail';//员工详情
import "./user.css";
import { systemConfigPath } from "@/utils/config/systemConfig";
function thClick() {
    let sort = this.querySelector('.ant-table-column-sorter')
    if (sort) {
        let up = sort.querySelector('.ant-table-column-sorter-up')
        let down = sort.querySelector('.ant-table-column-sorter-down')
        if (up.classList.contains('on')) {
            down.click()
        } else {
            up.click()
        }
    }
}

const FormItem = Form.Item;//表单项
const Option = Select.Option;//下拉内容
const RangePicker = DatePicker.RangePicker;//日期组件
class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                //列表数据
            },
            loading: true,
            userList: [],
            switchShow: 0,//当前打开的窗口
            uuids: ''//当前查看或修改的账户的uuids
        }
    }

    componentWillMount() {
        //列表:人员管理
        this.handleSearch(1, tablePagination_.defaultPageSize);
        axios.get("@/reuse/user/getRoleList").then(r => {
            this.setState({
                userList: r.data.rows,
                loading: false
            });
        });
    };

    handleSearch = (page, pageSize, searchData, event) => {
        this.setState({
            loading: true
        });
        let formData = this.props.form.getFieldsValue();
        let params = { ...formData, ...searchData };
        params.page = page;
        params.pageSize = pageSize;
        params.subPlatformId = 6;
        if (formData.creactTime) {
            if (formData.creactTime[0] != null && formData.creactTime[1] != null)
                params.createTimeStartStr = moment(formData.creactTime[0]).format("YYYY-MM-DD")
            params.createTimeEndStr = moment(formData.creactTime[1]).format("YYYY-MM-DD")
            delete params.creactTime
        }
        axios.get("@/reuse/user/queryUserListForPage", {
            params: params
        }).then(r => {
            this.setState({
                dataSource: r.data,
                loading: false
            });
        });
    };
    onChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };
    onShowSizeChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };

    //排序
    tableChange = (pagination, filters, sorter) => {
        let searchData = {};
        if (filters.state && filters.state.length == 1) {
            searchData.state = filters.state[0];
        }
        if (sorter.columnKey) {
            searchData.querysort = sorter.columnKey;
            searchData.order = sorter.order.replace("end", "");
        }
        this.handleSearch(pagination.current, pagination.pageSize, searchData);
    }

    //重置表单
    resetForm = () => {
        this.props.form.resetFields();
        this.handleSearch(1, tablePagination_.defaultPageSize);
    }

    //打开指定窗口
    openContebt = (switchShow, uuids) => {
        this.setState({
            switchShow:switchShow,
            uuids:uuids
        })
        /*window.sessionStorage.setItem('userShow', switchShow);
        window.sessionStorage.setItem('userUuids', uuids);
        window.open(systemConfigPath.jumpPage(switchShow == 3 ? '/organization/userDefinitely' : '/organization/userAddAndEdit'));*/
    };

    //回到当前窗口
    closeContent = () => {
        this.setState({
            switchShow: 0
        });
    }

    //新增/修改账户保存成功回调
    editUserCallBack = () => {
        this.closeContent();//关闭窗口
        this.handleSearch(1, tablePagination_.defaultPageSize);//刷新列表
        //this.handleSearch(this.state.dataSource.pageNum,this.state.dataSource.pageSize);//刷新列表
    }
    //详情回调
    userDetailCallBack = () => {
        this.closeContent();//关闭窗口
        this.handleSearch(1, tablePagination_.defaultPageSize);//刷新列表
        //this.handleSearch(this.state.dataSource.pageNum,this.state.dataSource.pageSize);//刷新列表
    }

    //停用启用账号
    onChangeState = (record, state, refresh) => {
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
                        if (refresh) { refresh() } else {
                            this.handleSearch(this.state.dataSource.pageNum, this.state.dataSource.pageSize);
                        }
                        message.success(r.msg);
                    }
                });
            }
        });
    }

    componentDidMount() {
        document.querySelectorAll('th>span').forEach(ele => {
            ele.addEventListener('click', thClick)
        })
    }

    componentWillUnmount() {
        document.querySelectorAll('th>span').forEach(ele => {
            ele.removeEventListener('click', thClick)
        })
    }

    //删除账户
    deleteUser = (id,companyId) => {
        const params = {};
        params.userId = id;
        params.companyId = companyId;
        axios.post("@/reuse/user/deleteUser", {
            ...params
        }).then(r => {
            if (r.code == '000000') {
                message.success("删除成功");
                this.handleSearch(this.state.dataSource.pageNum, this.state.dataSource.pageSize);
            } else {
                message.error(r.msg || "删除失败");
            }
        }, e => message.error(e.msg || "删除失败"));
    }

    columns = [{
        title: '员工编号',
        dataIndex: 'userNo',
        key: 'userNo',
        sorter: true,
        width:120,
        render: (text) => {
            return <p className="user-tableColumnWidth" style={{width:"50px"}}><span title={text}>{text}</span></p>
        },
    }, {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
        sorter: true,
        width: 87,
        render: (text) => {
            return <p className="user-tableColumnWidth" style={{ width: "80px" }}><span title={text}>{text}</span></p>
        }
    }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        sorter: true,
        width: 92,
        render: (text) => {
            //return <p className="user-tableColumnWidth" style={{width:"90px"}}><span>{text?text.substr(0, 3) + '****' + text.substr(7):""}</span></p>
            return <p className="user-tableColumnWidth" style={{ width: "90px" }}><span title={text}>{text}</span></p>
        }
    }/*, {
        title: '推荐码',
        dataIndex: 'recommendCode',
        key: 'recommendCode',
        width: 72,
        render: (text) => {
            return <p className="user-tableColumnWidth" style={{ width: "70px" }}><span title={text}>{text}</span></p>
        }
    }*/, {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        width: 100,
        render: (text) => {
            return <p className="user-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        }
    }/*, {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        sorter: true,
        width: 102,
        render: (text) => {
            return <p className="user-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        }
    }*/, {
        title: '创建时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
        //className: 'text_right',
        sorter: true,
        width: 150,
        render: (text) => {
            return <p className="user-tableColumnWidth" style={{ width: "150px" }}><span title={text}>{text}</span></p>
        }
    }, {
        title: '账号有效期',
        dataIndex: 'validStr',
        key: 'validStr',
        width:100,
        render:(text)=>{
            return <p className="user-tableColumnWidth" style={{width:"150px"}}><span title={text}>{text=="2500-12-31 00:00:00"?"永久有效":moment(text).format("YYYY-MM-DD")}</span></p>
        }
    }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        filters: [
            { text: '停用', value: '0' },
            { text: '启用', value: '1' },
        ],
        width: 60,
        render: (text, record) => {
            let boolean = false;
            if (text == 0) {
                boolean = false;
            } else if (text == 1) {
                boolean = true;
            }
            return (
                <PermissionsBtn only switch name="启用/停用人员">
                    <Switch checked={boolean} onChange={this.onChangeState.bind(this, record)} />
                </PermissionsBtn>
            )
        },
    }, {
        title: '操作',
        key: 'cz',
        width: 130,
        render: (text, record) => {
            let arr = record.roleId.trim(',').split(',');
            if (arr.includes('13')) {//包含公司管理
                return (<span>
                    <a onClick={this.openContebt.bind(this, "3", record.uuids)}>查看</a>
                </span>)
            } else {
                return (<span>
                    <PermissionsBtn only>
                        <a onClick={this.openContebt.bind(this, "3", record.uuids)}>查看</a>
                    </PermissionsBtn>
                    <span className="ant-divider"></span>
                    <PermissionsBtn only>
                        <a onClick={this.openContebt.bind(this, "2", record.uuids)}>修改</a>
                    </PermissionsBtn>
                    <span className="ant-divider"></span>
                    <PermissionsBtn only>
                        <Popconfirm title="是否确认删除该人员?" onConfirm={this.deleteUser.bind(this, record.id,record.companyId)}><a>删除</a></Popconfirm>
                    </PermissionsBtn>
                </span>)
            }
        }
    }];

    render() {
        const { getFieldProps } = this.props.form;
        const pagination = ComponentDefine.getPagination_(this.state.dataSource);
        let tabBtn = (
            <PermissionsBtn only>
                <Button type="primary" onClick={this.openContebt.bind(this, "1")}>添加员工</Button>
            </PermissionsBtn>
        )

        return (
            <div key="user" className="user">
                <Card className="card-margin-bottom">
                    <SearchBar>
                        <SearchBar.Param>
                            <FormItem label={getDetailsLabel("创建时间")} {...ComponentDefine.form_.layout}>
                                <RangePicker
                                    {...getFieldProps(`creactTime`)}
                                    style={{ "width": "100%" }}
                                    format="yyyy/MM/dd"
                                />
                            </FormItem>
                            {/*<FormItem label={getDetailsLabel("人员角色")} {...ComponentDefine.form_.layout}>
                                <Select {...getFieldProps('roleId')} placeholder="请选择" style={{ width: "100%" }}>
                                    {this.state.userList.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.name}</Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>*/}
                            <FormItem label={getDetailsLabel("人员姓名")} {...ComponentDefine.form_.layout}>
                                <Input {...getFieldProps('username')} placeholder="请输入姓名" />
                            </FormItem>
                            <FormItem label={getDetailsLabel("手机号")} {...ComponentDefine.form_.layout}>
                                <Input {...getFieldProps('phone')} placeholder="请输入" />
                            </FormItem>
                            {/*<FormItem label={getDetailsLabel("人员邮箱")} {...ComponentDefine.form_.layout}>
                                <Input {...getFieldProps('email')} placeholder="请输入邮箱" />
                            </FormItem>*/}
                        </SearchBar.Param>
                        <SearchBar.Btns>
                            <Button type="primary" onClick={this.handleSearch.bind(this, 1, pagination.pageSize, {})} htmlType="submit">{btnName_.search}</Button>
                            <Button type="ghost" onClick={this.resetForm}>{btnName_.reset}</Button>
                        </SearchBar.Btns>
                    </SearchBar>
                </Card>
                <Card className="margin-top24 ant-card-extra-top-8" title="人员信息" extra={tabBtn}>
                    <Table rowKey="ecOrganization"
                        {...ComponentDefine.table_}
                        rowSelection={null}
                        loading={this.state.loading}
                        pagination={pagination}
                        columns={this.columns}
                        dataSource={this.state.dataSource.rows}
                        onChange={this.tableChange}
                    />
                </Card>
                <Gswitch switchShow={this.state.switchShow}>
                    <Gcontext ref="1" title="添加员工">
                        <EditUser
                            switchShow={this.state.switchShow}
                            close={this.closeContent}
                            callback={this.editUserCallBack}
                        />
                    </Gcontext>
                    <Gcontext ref="2" title="编辑员工">
                        <EditUser
                            switchShow={this.state.switchShow}
                            close={this.closeContent}
                            callback={this.editUserCallBack}
                            uuids={this.state.uuids}
                        />
                    </Gcontext>
                    <Gcontext ref="3" title="员工详情">
                        <UserDetail
                            uuids={this.state.uuids}
                            onChangeState={this.onChangeState}
                            switchShow={this.state.switchShow}

                            callback={this.userDetailCallBack}
                        />
                    </Gcontext>
                </Gswitch>
            </div>
        )
    }
}

export default Form.create()(User)
