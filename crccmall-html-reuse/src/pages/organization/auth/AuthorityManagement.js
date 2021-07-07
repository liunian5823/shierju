import { Card, Form, Button, Table, Popconfirm, message } from 'antd';
import { tablePagination_ } from "@/utils/config/componentDefine"
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns'
import { Gswitch, Gcontext } from 'components/content/Gswitch'
import AddRole from "./AddRole";
import RoleDetail from "./RoleDetail";
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

class AuthorityManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            switchShow: "",
            id: "",
            uuids: ""
        }
    }

    /**
     * 初始化
     */
    componentWillMount() {
        this.handleSearch(1, tablePagination_.defaultPageSize);
    }

    /**
     * 搜索
     * @param page
     * @param pageSize
     * @param event
     */
    handleSearch = (page, pageSize, params, event) => {
        if (params == undefined) {
            params = {};
        }
        // let params = {};
        params.page = page;
        params.rows = pageSize;
        axios.get("@/reuse/adminInformationController/getRoleInfo", {
            params: params
        }).then(({ data: r }) => {
            let dataSource = [];
            if (r.rows.length > 0) {
                dataSource = r;
            }
            this.setState({
                dataSource: dataSource
            })
        })
    }

    columns = [{
        title: '序号',
        dataIndex: 'index',
        width: 100,
        render: (text, record, index) => {
            return index + 1;
        }
    }, {
        title: '角色',
        dataIndex: 'name',
        width: 200,
        sorter: true
    }, {
        title: '权限',
        dataIndex: 'premesName',
        width: 250,
        sorter: true,
        render: (text, record) => {
            if (text != null) {
                if (text.length < 30) {
                    return <span title={text}>{text}</span>
                } else {
                    return <span title={text}>{text.substring(0, 10)}...</span>
                }
            }
        }
    }, {
        title: '人数',
        dataIndex: 'num',
        width: 100,
        sorter: true
    }, {
        title: '操作',
        dataIndex: 'address2',
        width: 155,
        render: (text, record) => {
            if (record.roleFlag == 1) {
                return <span>
                    <PermissionsBtn only>
                        <a onClick={this.roleDetailBtn.bind(this, record.uuids)}>详情</a>
                    </PermissionsBtn>
                    <span className="ant-divider"></span>
                    <PermissionsBtn only>
                        <Popconfirm title="确定同意复制该角色?" onConfirm={this.roleCopyBtn.bind(this, record.uuids)}>
                            <a>复制</a>
                        </Popconfirm>
                    </PermissionsBtn>
                </span>
            } else {
                return <span>
                    <PermissionsBtn only>
                        <a onClick={this.roleDetailBtn.bind(this, record.uuids)}>详情</a>
                    </PermissionsBtn>
                    <span className="ant-divider"></span>
                    <PermissionsBtn only>
                        <a onClick={this.addRole.bind(this, record.uuids, record.id)}>修改</a>
                    </PermissionsBtn>
                    <span className="ant-divider"></span>
                    <PermissionsBtn only>
                        <Popconfirm title="确定同意删除该角色?" onConfirm={this.delRoleBtn.bind(this, record.uuids, record.num)}>
                            <a>删除</a>
                        </Popconfirm>
                    </PermissionsBtn>
                    <span className="ant-divider"></span>
                    <PermissionsBtn only>
                        <Popconfirm title="确定同意复制该角色?" onConfirm={this.roleCopyBtn.bind(this, record.uuids)}>
                            <a>复制</a>
                        </Popconfirm>
                    </PermissionsBtn>
                </span>
            }
        }
    }
    ];

    //新增或者修改角色
    addRole = (uuids, id) => {
        this.setState({
            switchShow:"addRole",
            id:id,
            uuids:uuids
        })
       /* window.sessionStorage.setItem('authShow', "addRole");
        window.sessionStorage.setItem('authUuids', uuids);
        window.sessionStorage.setItem('authId', id);
        window.open(systemConfigPath.jumpPage('/organization/authAddAndEdit'));*/
    };

    //查看角色详情页
    roleDetailBtn = (uuids) => {
        this.setState({
            switchShow:"roleDetail",
            uuids:uuids
        })
    };

    //关闭页面
    closeDetail = () => {
        this.setState({
            switchShow: ""
        })
    };

    //删除角色方法
    delRoleBtn = (uuids, num) => {
        if (num == 0) {
            let uu = uuids + ",";
            axios.post("@/reuse/adminInformationController/delRole", {
                uu: uu
            }).then((r, err) => {
                if (r.code == '000000') {
                    message.success('操作成功');
                    this.handleSearch(1, tablePagination_.defaultPageSize);
                } else {
                    message.error(r.msg || "删除失败");
                }
            }, (e) => {
                message.error(e.msg || "删除失败");
            })
        } else {
            // Modal.error({
            //     title: '提示',
            //     content: '该角色已关联人员,无法删除',
            // });
            message.error('该角色已关联人员,无法删除');
            return;
        }
    };

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


    roleCopyBtn = (uuids) => {
        if (this.deleFlag) {
            return
        }
        this.deleFlag = true;
        axios.get("@/reuse/adminInformationController/copyRole?uu=" + uuids, {

        }).then((r, err) => {
            if (r.data >= 0) {
                message.success('操作成功');
                this.handleSearch(1, tablePagination_.defaultPageSize);
                this.deleFlag = false;
            }
        }, () => {
            this.deleFlag = false;
        })
    };



    //回调功能
    callBack = () => {
        this.setState({
            switchShow: ""
        })
        this.handleSearch(1, tablePagination_.defaultPageSize);
    };

    onShowSizeChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };
    onChange = (pagination, filters, sorter) => {
        let params = {};
        if (sorter.field) {
            params.querysort = sorter.field;
        }
        if (sorter.order) {
            params.order = sorter.order.replace("end", "");
        }
        params.page = pagination.current;
        params.pageSize = pagination.pageSize;
        this.handleSearch(params.page, params.pageSize, params);
    };
    showTotal = (total) => {
        return `共 ${this.state.totals} 条`;
    };

    render() {
        const { getFieldProps } = this.props.form;
        const pagination = ComponentDefine.getPagination_(this.state.dataSource);
        return (
            <div>
                <Card className="margin-top24 ant-card-extra-top-8" title="角色信息"
                    extra={<PermissionsBtn only><Button type="primary" onClick={this.addRole.bind(this, "", "")}>添加</Button></PermissionsBtn>}>
                    <Table rowKey="authorId"
                        {...ComponentDefine.table_}
                        pagination={pagination}
                        rowSelection={null}
                        dataSource={this.state.dataSource.rows}
                        columns={this.columns}
                        onChange={this.onChange}
                    />
                </Card>
                <Gswitch switchShow={this.state.switchShow}>
                    <Gcontext ref="addRole" title="权限配置">
                        <AddRole callBack={this.callBack} id={this.state.id} uuids={this.state.uuids}/>
                    </Gcontext>
                    <Gcontext ref="roleDetail" title="权限详情">
                        <RoleDetail uuids={this.state.uuids} callBack={this.callBack}/>
                    </Gcontext>
                </Gswitch>
            </div>
        )
    }

}
export default Form.create()(AuthorityManagement)
