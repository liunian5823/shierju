import React from 'react';
import { Form, Card, Row, Col, Switch, Popconfirm, Modal } from 'antd';
const FormItem = Form.Item;
import Util from '@/utils/util'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import api from '@/framework/axios';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';

class VerifySetUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            batchSet: true,
            key_tb: 1,
            formList: [
                {
                    type: 'SELECT',
                    field: 'deptId',
                    label: '审批部门',
                    placeholder: '请选择',
                    list: [],
                    listLabel: 'organizationName',
                },
                {
                    type: 'INPUT',
                    field: 'name',
                    label: '模板名称',
                    placeholder: '请输入'
                },
            ]
        }
    }

    baseParams = {}
    importantFilter = ['deptId', 'name'];


    columns = [
        {
            title: '模板名称',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            className: 'text_line5_td',
            render(text) {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '应用部门',
            dataIndex: 'depts',
            key: 'depts',
            width: 100,
            className: 'text_line5_td',
            render(text, record, index) {
                let str = '全部';
                if (record.depts && record.depts.length) {
                    str = record.depts.map(v => v.deptName).join(',')
                }
                return <span title={str}>{str}</span>
            }
        },
        {
            title: '审批方式',
            dataIndex: 'mode',
            key: 'mode',
            render(text, record, index) {
                let modes = {
                    1: '依次审批',
                    2: '会签',
                    3: '或签'
                }
                return (
                    <span>{modes[text]}</span>
                )
            }
        },
        {
            title: '审批人',
            dataIndex: 'users',
            key: 'users',
            render(text, record, index) {
                let str = record.users && record.users.length || 0;
                return <span className="reuse_money">{str}人</span>
            }
        },
        {
            title: '金额(万元)',
            dataIndex: 'lowQuota',
            className: 'text_right',
            key: 'lowQuota',
            render(text, record, index) {
                let str = `${record.lowQuota || 0}-${record.highQuota || 0}`;
                return <span className="reuse_money">{str}</span>
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            className: 'text_right',
            key: 'createTime',
        },
        {
            title: '状态',
            dataIndex: 'isEnable',
            key: 'isEnable',
            render: (text, record) => (
                <span>
                    {record.isDefault == '1' ? <span style={{ color: '#50bf19' }}>开</span> : <Switch
                        defaultChecked={text == 1}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        onChange={e => this.statusCahnge(e, record)}></Switch>}
                </span>
            )
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 100,
            fixed: 'right',
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                    <AuthButton elmType="a" key="1" onClick={() => { this.handleEdit(record) }}>编辑</AuthButton>
                    {record.isDefault != '1' && <AuthButton elmType="a" key="2" elmName="删除">
                        <Popconfirm title="确定删除？" onConfirm={() => { this.handleDel(record) }}>
                            <span>删除</span>
                        </Popconfirm>
                    </AuthButton>}
                </span>
            )
        }
    ];

    componentWillMount() {
        this.handleInit()
        this.getApprovalStas()
    }
    //初始
    handleInit = () => {
        this.getApprovalDpt()
    }

    getApprovalStas = () => {
        api.ajax('GET', '@/reuse/approval/set/get')
            .then(res => {
                this.setState({
                    batchSet: res.data && res.data.isEnable == 1
                })
            })
    }


    //审批部门数据
    getApprovalDpt = () => {
        api.ajax('GET', '@/reuse/organization/queryOrganizationList')
            .then(res => {
                if (res.data) {
                    let { formList } = this.state;
                    formList.forEach(v => {
                        if (v.field == 'deptId') {
                            v.list = res.data || []
                        }
                    })

                    this.setState({
                        formList
                    })
                }
            })
    }

    //新增
    handleAdd = () => {
        this.props.history.push('/verify/setUpAdd')
        // window.open(systemConfigPath.jumpPage('/verify/setUpAdd'))
    }
    //批量
    batchSetChange = (batchSet) => {
        let that = this;
        let title = '确定关闭吗？'
        if (batchSet) {
            title = '确定开启吗？'
        }
        Modal.confirm({
            title: title,
            onOk() {
                api.ajax('POST', '@/reuse/approval/set/upd', {
                    isEnable: batchSet ? 1 : 0
                }).then((res) => {
                    Util.alert(res.msg || '设置成功', { type: 'success' })
                    that.setState({
                        batchSet
                    })
                })
            }
        })
    }
    //编辑
    handleEdit = (tr) => {
        api.ajax('get', '@/reuse/approval/manage/getOrderCountForApproval', {
            uuids: tr.uuids
        }).then(res => {
            this.props.history.push('/verify/setUpAdd/' + tr.uuids)
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        })
    }

    //删除
    handleDel = (tr) => {
        api.ajax('POST', '@/reuse/approval/manage/del', {
            uuids: tr.uuids
        }).then(res => {
            Util.alert(res.msg || '删除成功', { type: 'success' })
            this.reloadTableData();
        }, error => {
            Util.alert(error.msg || '删除失败', { type: 'error' })
        })
    }

    //改变状态
    statusCahnge = (isEnable, { uuids }) => {
        api.ajax('POST', '@//reuse/approval/manage/status', {
            uuids, isEnable: +isEnable
        }).then(res => {
            Util.alert(res.msg || '删除成功', { type: 'success' })
            this.reloadTableData();
        }, error => {
            // this.props.history.replace()
            // this.reloadTableData();
            Util.alert(error.msg || '删除失败', { type: 'error' })
            this.setState({
                key_tb: Math.random()
            })
        })
    };

    handleFilter = (p) => {
        this.baseParams = {
            ...this.baseParams,
            ...p,
        }
        this.reloadTableData();
    }
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }


    render() {
        return (
            <div>
                <BaseForm formList={this.state.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                    <Row className="reuse_autoButtonGroup">
                        <AuthButton
                            elmType="switch"
                            elmName="状态总开关"
                            onChange={this.batchSetChange}
                            checked={this.state.batchSet}></AuthButton>
                        <AuthButton
                            className="ml20"
                            onClick={this.handleAdd}
                            type="primary">新增审批模板</AuthButton>
                    </Row>
                    <BaseTable
                        key={this.state.key_tb}
                        url='@/reuse/approval/manage/page'
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
            </div>
        )
    }
}

export default Form.create()(VerifySetUp)
