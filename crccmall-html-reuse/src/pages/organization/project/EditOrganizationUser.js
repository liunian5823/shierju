import { Select, Card, Form, Input, Button, Table, Modal } from 'antd';
import "./organization.css";

const Option = Select.Option;//下拉内容
const InputGroup = Input.Group;

class EditOrganizationUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {

            },
            roleList: [],//职务下拉
            userListUp: {

            },
            userListDown: [],
            selectedRowsObj: {},//选中行数对象
            selectedRowKeys: []//选中行数key
        }
    }

    //父组件数据变更时执行
    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {//模态框初始化动作
            //清空顶部列表查询条件
            this.props.form.setFieldsValue({
                key: ""
            });
            //获取顶部员工列表
            this.handleSearch(1, 5, {});
            //获取角色下拉
            this.getRoleList();
            //刷新底部已选择账户信息
            let userListDown = JSON.parse(JSON.stringify(nextProps.userList));
            let selectedRowsObj = {}
            for (let i = 0; i < userListDown.length; i++) {
                selectedRowsObj[userListDown[i].userId] = userListDown[i];
            }
            let selectedRowKeys = Object.keys(selectedRowsObj);
            this.setState({
                selectedRowsObj: selectedRowsObj,
                selectedRowKeys: selectedRowKeys,
                userListDown: userListDown
            });
        }
    }
    //获取职务下拉
    getRoleList = () => {
        axios.get("@/reuse/organization/getRoleList").then(r => {
            this.setState({
                roleList: r.data.rows
            });
        });
    }
    //当前公司全部员工信息搜索与分页
    handleSearch = (page, pageSize, searchData, event) => {
        const params = { ...searchData, ...this.props.form.getFieldsValue() };
        let key = this.props.form.getFieldValue("key");
        if (key) {
            //params.phone = key;
            params.username = key;
        }
        params.page = page;
        params.pageSize = pageSize;
        //event && event.preventDefault();
        axios.get("@/reuse/organization/getUserListForPage", {
            params: params
        }).then(r => {
            //数据结构对应
            if (r.data.rows) {
                for (let i = 0; i < r.data.rows.length; i++) {
                    r.data.rows[i]["userName"] = r.data.rows[i].username;//保存使用
                    r.data.rows[i]["userId"] = r.data.rows[i].id;//保存使用
                    r.data.rows[i]["id"] = r.data.rows[i].id + "";//对应选中使用
                    delete r.data.rows[i].roleId;
                }
            }
            //重新赋值
            this.setState({
                userListUp: r.data
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
        if (sorter.columnKey) {
            searchData.querysort = sorter.columnKey.replace("Str", "");
            searchData.order = sorter.order.replace("end", "");
        }
        this.handleSearch(pagination.current, pagination.pageSize, searchData);
    }

    //当前公司全部员工信息分页列表
    columnsUp = [{
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "150px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        sorter: true,
        render: (text, record, index) => {
            let genderStr;
            if (text == 0) {
                genderStr = "女"
            } else if (text == 1) {
                genderStr = "男"
            }
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={genderStr}>{genderStr}</span></p>
        }
    }, {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "150px" }}><span title={text}>{text}</span></p>
        },
    }];
    //当前部门已关联员工列表
    columnsDown = [{
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "150px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        sorter: (a, b) => a.gender - b.gender,
        render: (text, record, index) => {
            let genderStr;
            if (text == 0) {
                genderStr = "女"
            } else if (text == 1) {
                genderStr = "男"
            }
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={genderStr}>{genderStr}</span></p>
        }
    }, {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "150px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '职务',
        dataIndex: 'roleId',
        key: 'roleId',
        width: 200,
        render: (text, record, index) => {
            const id = "userId" + record.userId
            const { getFieldProps } = this.props.form;
            return (
                <Form.Item style={{ "width": "200px" }}>
                    <Select
                        style={{ "width": "150px" }}
                        placeholder={"请选择"}
                        {...getFieldProps(id, {
                            initialValue: text,
                            rules: [
                                { required: true, message: '请选择' }
                            ]
                        })}
                    >
                        {this.state.roleList.map((item, index) => {
                            return (
                                <Option key={index} value={item.id}>{item.name}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
            )
        }

    }, {
        title: '操作',
        key: 'cz',
        width: '100',
        render: (text, record) => (
            <span>
                <a onClick={this.deleteUser.bind(this, record)}>删除</a>
            </span>
        )
    }];

    //移除一个已经选中的员工
    deleteUser = (record) => {
        let a = this.state.selectedRowKeys.filter((r) => r != record.userId);
        let b = this.state.userListDown.filter((r) => r.userId != record.userId);
        this.setState({
            selectedRowKeys: a,
            userListDown: b
        });
    }

    //保存选择的员工
    handleOk = (list) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            let formdata = this.props.form.getFieldsValue();

            for (let i = 0; i < list.length; i++) {
                list[i]["roleId"] = formdata["userId" + list[i]["userId"]]
            }
            //修正roleName
            let roleList = this.state.roleList;
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < roleList.length; j++) {
                    if (roleList[j].id == list[i].roleId) {
                        list[i]['roleName'] = roleList[j].name
                    }
                }
            }
            this.props.handleOk(list);
        })
    }

    //下方员工列表标题与清空按钮
    titleButton = () => {
        return (
            <div><span>已选员工</span><a style={{ marginLeft: "40px" }} onClick={() => {
                this.setState({
                    selectedRowsObj: {},
                    selectedRowKeys: [],
                    userListDown: []
                });
            }}>清空</a></div>
        )
    }

    render() {
        //列表选中,分页,与表单获取元素方法
        let that = this;
        const { getFieldProps } = this.props.form;
        const paginationUp = ComponentDefine.getPagination_(this.state.userListUp);
        paginationUp.defaultPageSize = 5
        paginationUp.showSizeChanger = false;
        let rowSelectionUp = {
            userListDown: that.state.userListDown,
            selectedRowsObj: that.state.selectedRowsObj,
            selectedRowKeys: that.state.selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
            },
            onSelect(record, selected, selectedRows) {
                if (selected) {//添加
                    this.selectedRowKeys.unshift(record.id)
                    this.userListDown.unshift(record);
                } else {//移除
                    this.userListDown = this.userListDown.filter((r) => r.userId != record.userId);
                    this.selectedRowKeys = this.selectedRowKeys.filter((r) => r != record.userId);
                }
                that.setState({
                    selectedRowsObj: this.selectedRowsObj,
                    selectedRowKeys: this.selectedRowKeys,
                    userListDown: this.userListDown
                });
            },
            onSelectAll(selected, selectedRows, changeRows) {
                if (selected) {//全部选中
                    for (let i = 0; i < changeRows.length; i++) {
                        let record = changeRows[i];
                        this.selectedRowKeys.unshift(record.id)
                        this.userListDown.unshift(record);
                    }
                } else {//全部取消
                    for (let i = 0; i < changeRows.length; i++) {
                        let record = changeRows[i];
                        this.userListDown = this.userListDown.filter((r) => r.userId != record.userId);
                        this.selectedRowKeys = this.selectedRowKeys.filter((r) => r != record.userId);
                    }
                }
                that.setState({
                    selectedRowsObj: this.selectedRowsObj,
                    selectedRowKeys: this.selectedRowKeys,
                    userListDown: this.userListDown
                });
            }
        }

        return (
            <div className="editOrganizationUser">
                <Modal className="modal_main modal_900"
                    title="关联员工"
                    visible={this.props.visible}
                    width="56%"
                    onOk={this.handleOk.bind(this, this.state.userListDown)}
                    onCancel={this.props.handleCancel}
                >
                    <Card className="card-margin-bottom border_none" title="员工信息"
                        extra={<div className="search_tabs_input">
                            <InputGroup >
                                <Input placeholder="请输入员工姓名或手机号"
                                    {...getFieldProps(`nameOrPhone`)}
                                />
                                <div className="ant-input-group-wrap">
                                    <Button onClick={this.handleSearch.bind(this, 1, 5, {})} icon="search" />
                                </div>
                            </InputGroup>
                        </div>
                        }
                    >
                        <Table rowKey={record => record.id}
                            {...ComponentDefine.table_}
                            pagination={paginationUp}
                            columns={this.columnsUp}
                            dataSource={this.state.userListUp.rows}
                            rowSelection={rowSelectionUp}
                            onChange={this.tableChange}
                        />
                    </Card>
                    <Card className="card-margin-bottom border_none edituser-yxyg" title={this.titleButton()}>
                        <Table rowKey={record => record.userId}
                            {...ComponentDefine.table_}
                            pagination={false}
                            columns={this.columnsDown}
                            dataSource={this.state.userListDown}
                            rowSelection={null}
                        />
                    </Card>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(EditOrganizationUser)
