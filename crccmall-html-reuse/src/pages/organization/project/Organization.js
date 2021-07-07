import { Popconfirm, message, Timeline, Select, Card, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs } from 'antd';
import { getDetailsLabel } from 'components/page/Details';
import { PermissionsBtn } from 'components/content/DetailsBtns';
import SearchBar from 'components/page/SearchBar';//上下结构搜索容器
import { tablePagination_, btnName_ } from "@/utils/config/componentDefine";//分页等公共组件
import moment from 'moment';//时间格式转换
import EditOrganization from './EditOrganization';//新增/修改组织机构
import EditDefaultOrganization from './EditDefaultOrganization';//修改默认部门
import OrganizationDetail from './OrganizationDetail';//查看详情
import { Gswitch, Gcontext } from 'components/content/Gswitch';//打开其它页面使用
import "./organization.css";
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
class Organization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {

            },
            managerList: [],
            organization: {//当前正在修改的部门/公司

            },
            switchShow: 0,//当前打开的窗口
            loading: false

        }
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

    componentWillMount() {
        this.handleSearch(1, tablePagination_.defaultPageSize);
    };

    handleSearch = (page, pageSize, searchData, event) => {
        this.setState({ loading: true })
        let formDtaa = this.props.form.getFieldsValue();
        const params = { ...formDtaa, ...searchData }
        params.page = page;
        params.pageSize = pageSize;
        event && event.preventDefault();
        axios.get("@/reuse/organization/queryOrganizationListForPage", {
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
    resetForm = () => {
        this.props.form.resetFields();
        this.handleSearch(1, tablePagination_.defaultPageSize);
    }

    //排序
    tableChange = (pagination, filters, sorter) => {
        let searchData = {};
        if (sorter.columnKey) {
            searchData.querysort = sorter.columnKey.replace("Str", "");
            searchData.order = sorter.order.replace("end", "");
        }
        this.handleSearch(pagination.current, pagination.pageSize, searchData);
    }

    //打开新增/修改组织机构窗口
    openEditOrganization = (switchShow, record) => {
        this.setState({
            organization:{//当前正在修改的部门/公司
                ...record
            },
            switchShow:switchShow,
        });
        /*window.sessionStorage.setItem('projectShow', switchShow);
        window.sessionStorage.setItem('projectOrganization', JSON.stringify(record));
        window.open(systemConfigPath.jumpPage(switchShow == 3 ? '/organization/projectDef' : '/organization/EditAndAddProject'));*/
    };

    //回到当前窗口
    closeContent = () => {
        this.setState({
            switchShow: 0
        });
    }

    //新增/修改组织机构保存成功回调
    editOrganizationCallBack = () => {
        this.closeContent();//关闭窗口
        this.handleSearch(1, tablePagination_.defaultPageSize);//刷新列表
    }

    //删除组织机构

    deleteOrganization = (uuids) => {
        const params = {};
        params.uuids = uuids
        axios.get("@/reuse/organization/deleteOrganization", {
            params: params

        }).then(r => {
            if (r.code == '000000') {
                message.success("删除成功");
                this.handleSearch(1, tablePagination_.defaultPageSize);
            } else {
                message.error(r.msg || "删除失败");
            }
        }, e => message.error(e.msg || "删除失败"));
    };

    columns = [{
        title: '编号',
        dataIndex: 'num',
        key: 'num',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "50px" }}><span>{index + 1}</span></p>
        },
    }, {
        title: '类型',
        dataIndex: 'typeStr',
        key: 'typeStr',
        sorter: true,
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "50px" }}><span>{text}</span></p>
        },
    }, {
        title: '项目/部门名称',
        dataIndex: 'organizationName',
        key: 'organizationName',
        sorter: true,
        width: 180,
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth text_line5" style={{ width: "180px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '负责人',
        dataIndex: 'ownUserName',
        key: 'ownUserName',
        sorter: true,
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '员工',
        dataIndex: 'count',
        key: 'count',
        sorter: true,
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "50px" }}><span>{text}</span></p>
        },
    }, {
        title: '立项时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        //className: 'text_right',
        sorter: true,
        render: (text, record) => {
            if (record.type == 0) {//部门
                return (
                    <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span>-</span></p>
                )
            } else if (record.type == 1) {//项目
                return (
                    <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span>{text == null ? text : moment(text).format("YYYY-MM-DD")}</span></p>
                )
            }
        },

    }, {
        title: '预计完工',
        dataIndex: 'endTime',
        sorter: true,
        //className: 'text_right',
        key: 'endTime',
        render: (text, record) => {
            if (record.type == 0) {//部门
                return (
                    <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span>-</span></p>
                )
            } else if (record.type == 1) {//项目
                return (
                    <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span>{text == null ? text : moment(text).format("YYYY-MM-DD")}</span></p>
                )
            }
        },
    }, {
        title: '操作',
        key: 'cz',
        width: 130,
        render: (text, record) => {
            if (record.isDefault == 0) {//普通部门
                return (
                    <span>
                        <PermissionsBtn only>
                            <a onClick={this.openEditOrganization.bind(this, 3, record)}>查看</a>
                        </PermissionsBtn>
                        <span className="ant-divider"></span>
                        <PermissionsBtn only>
                            <a onClick={this.openEditOrganization.bind(this, 2, record)}>修改</a>
                        </PermissionsBtn>
                        <span className="ant-divider"></span>
                        <PermissionsBtn only>
                            <Popconfirm title="确认删除组织机构" onConfirm={this.deleteOrganization.bind(this, record.uuids)}><a>删除</a></Popconfirm>
                        </PermissionsBtn>
                    </span>
                )
            } else if (record.isDefault == 1) {//当前公司默认部门
                return (
                    <span>
                        <PermissionsBtn only>
                            <a onClick={this.openEditOrganization.bind(this, 3, record)}>查看</a>
                        </PermissionsBtn>
                        <span className="ant-divider"></span>
                        <PermissionsBtn only>
                            <a onClick={this.openEditOrganization.bind(this, 2, record)}>修改</a>
                        </PermissionsBtn>
                    </span>
                )
            }
        },
    }];

    render() {
        const { getFieldProps } = this.props.form;
        const pagination = ComponentDefine.getPagination_(this.state.dataSource);

        return (
            <div>
                <Card className="card-margin-bottom">
                    <Form>
                        <SearchBar>
                            <SearchBar.Param>
                                <FormItem label={getDetailsLabel("组织类型")} {...ComponentDefine.form_.layout}>
                                    <Select {...getFieldProps('type')} placeholder="请选择">
                                        <Option value="0">部门</Option>
                                        <Option value="1">项目</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label={getDetailsLabel("组织名称")} {...ComponentDefine.form_.layout}>
                                    <Input {...getFieldProps('organizationName')} placeholder="请输入" />
                                </FormItem>
                                <FormItem label={getDetailsLabel("负责人")} {...ComponentDefine.form_.layout}>
                                    <Input {...getFieldProps('ownUserName')} placeholder="请输入" />
                                </FormItem>
                            </SearchBar.Param>
                            <SearchBar.Btns>
                                <Button onClick={this.handleSearch.bind(this, 1, pagination.pageSize, {})} type="primary">{btnName_.search}</Button>
                                <Button onClick={this.resetForm} type="ghost">{btnName_.reset}</Button>
                            </SearchBar.Btns>
                        </SearchBar>
                    </Form>
                </Card>
                <Card
                    className="ant-card-extra-top-8"
                    title="部门管理"
                    extra={
                        <PermissionsBtn only>
                            <Button type="primary" onClick={this.openEditOrganization.bind(this, 1, {})}>添加组织机构</Button>
                        </PermissionsBtn>
                    }
                >
                    <Table rowKey="ecOrganization"
                        {...ComponentDefine.table_}
                        rowSelection={null}
                        loading={this.state.loading}
                        pagination={pagination}
                        columns={this.columns}
                        dataSource={this.state.dataSource.list}
                        onChange={this.tableChange}
                    />
                </Card>
                <Gswitch switchShow={this.state.switchShow}>
                    <Gcontext ref="1" title="新增组织机构">
                        <EditOrganization
                            switchShow={this.state.switchShow}
                            close={this.closeContent}
                            callback={this.editOrganizationCallBack}
                        />
                    </Gcontext>
                    <Gcontext ref="2" title="修改组织机构">
                        <EditOrganization
                            organization={this.state.organization}
                            switchShow={this.state.switchShow}
                            close={this.closeContent}
                            callback={this.editOrganizationCallBack}
                        />
                    </Gcontext>
                    <Gcontext ref="21" title="修改组织机构">
                        <EditDefaultOrganization
                            organization={this.state.organization}
                            switchShow={this.state.switchShow}
                            close={this.closeContent}
                            callback={this.editOrganizationCallBack}
                        />
                    </Gcontext>
                    <Gcontext ref="3" title="组织机构详情">
                        <OrganizationDetail
                            organization={this.state.organization}
                            switchShow={this.state.switchShow}
                            close={this.closeContent}
                        />
                    </Gcontext>
                </Gswitch>
            </div>
        )
    }
}

export default Form.create()(Organization)
