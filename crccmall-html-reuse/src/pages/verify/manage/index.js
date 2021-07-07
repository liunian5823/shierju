import React from 'react';
import Qs from 'qs'
import Util from '@/utils/util'
import { Form, Card, Row, Col, Modal } from 'antd';
const FormItem = Form.Item;

import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import BaseTabs from '@/components/baseTabs';
import api from '@/framework/axios';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import { baseService } from '@/utils/common';
//审核状态
const _ApprovalManageGroup = baseService.approvalManageGroup;
const _saleMainBid_obj = baseService._saleMainBid_obj;

export default class VerifyManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formList: [],
            defaultKey: sessionStorage.VerifyManageStatus || '1',
            batchSet: true,
        }
    }

    componentWillUnmount() {
        sessionStorage.VerifyManageStatus = ''
    }

    getXmbList() {
        api.ajax('get', '@/reuse/organization/queryOrgListByUserId').then(({ data }) => {
            this.setState({
                formList: [
                    {
                        type: 'RANGE',
                        field: 'creatStartDate',
                        label: '发布日期',
                    },
                    {
                        type: 'INPUT',
                        field: 'code',
                        label: '竞价编号',
                        placeholder: '请输入'
                    },
                    {
                        type: 'INPUT',
                        field: 'title',
                        label: '公告名称',
                        placeholder: '请输入',
                        className: 'text_line5_td'
                    },
                    {
                        type: 'SELECTINPUT',
                        field: 'organizationName',
                        label: '项目部',
                        list: data.map(v => {
                            return {
                                id: v.organizationName,
                                value: v.organizationName
                            }
                        }),
                        placeholder: '请输入'
                    },
                    {
                        type: 'SELECT',
                        field: 'bidWay',
                        label: '竞价方式',
                        placeholder: '请选择',
                        list: baseService.bidTypeGroup
                    },
                    {
                        type: 'RANGE',
                        field: 'signEndTimeStart',
                        label: '报名截止时间',
                        placeholder: '请输入'
                    },
                ]
            })
        })
    }

    baseParams = {
        queryState: sessionStorage.VerifyManageStatus || '1'
    }
    importantFilter = ['creatStartDate', 'code'];


    columns = [
        {
            title: '竞价编号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150
        },
        {
            title: '公告名称',
            dataIndex: 'title',
            sorter: true,
            key: 'title',
            className: 'text_line5_td',
            width: 150
        },
        {
            title: '销售项目部',
            dataIndex: 'saleDeptName',
            key: 'saleDeptName',
            sorter: true,
            width: 150
        },
        {
            title: '竞价方式',
            dataIndex: 'bidWayStr',
            key: 'bidWayStr',
            sorter: true,
            width: 100
        },
        {
            title: '报名截止时间',
            dataIndex: 'signEndTime',
            key: 'signEndTime',
            sorter: true,
            width: 120,
            className: 'text_right',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? text.substr(0, 10) : ''}</p>
                        <p>{text ? text.substr(10) : ''}</p>
                        <p>{text ? '' : '--'}</p>
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'approvalStatusStr',
            key: 'approvalStatusStr',
            width: 100,
            sorter: true,
            render(text, record) {
                let status = _saleMainBid_obj[record.status] || {};
                return (
                    <span style={status.style}>{text}</span>
                )
            }
        },
        {
            title: '处理人',
            dataIndex: 'approvalDealUser',
            key: 'approvalDealUser',
            width: 100,
            sorter: true,
        },
        {
            title: '处理时间',
            dataIndex: 'approvalDealTime',
            key: 'approvalDealTime',
            width: 100,
            sorter: true,
            className: 'text_right',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? text.substr(0, 10) : ''}</p>
                        <p>{text ? text.substr(10) : ''}</p>
                        <p>{text ? '' : '--'}</p>
                    </div>
                )
            }
        },
        {
            title: '递交时间',
            dataIndex: 'commitTime',
            key: 'commitTime',
            width: 100,
            sorter: true,
            className: 'text_right',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? text.substr(0, 10) : ''}</p>
                        <p>{text ? text.substr(10) : ''}</p>
                        <p>{text ? '' : '--'}</p>
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 100,
            fixed: 'right',
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                    <AuthButton elmType="a" key="1" onClick={() => { this.handleToDetail(record) }}>查看详情</AuthButton>
                    {
                        [21].indexOf(record.status) != -1
                            ? <AuthButton elmType="a" key="2" onClick={() => { this.handleToApproval(record) }}>审批</AuthButton>
                            : null
                    }
                </span>
            )
        }
    ];

    componentWillMount() {
        this.handleInit()
        this.getXmbList()
    }
    //初始
    handleInit = () => {

    }

    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.queryState = null
            this.setState({
                defaultKey: '0'
            })
        }
        let params = {
            creatStartDate: null,
            creatEndDate: null,
            signEndTimeStart: null,
            signEndTimeEnd: null
        }
        if (p.creatStartDate) {
            params.creatStartDate = p.creatStartDate[0] ? moment(p.creatStartDate[0]).format('YYYY-MM-DD') : '';
            params.creatEndDate = p.creatStartDate[1] ? moment(p.creatStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.signEndTimeStart) {
            params.signEndTimeStart = p.signEndTimeStart[0] ? moment(p.signEndTimeStart[0]).format('YYYY-MM-DD') : '';
            params.signEndTimeEnd = p.signEndTimeStart[1] ? moment(p.signEndTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        this.baseParams = {
            ...this.baseParams,
            ...p,
            ...params,
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

    //查看详情
    handleToDetail = (tr) => {
        this.props.history.push('/verify/manageApproval/' + tr.uuids)
    }

    //审批
    handleToApproval = (tr) => {
        this.props.history.push('/verify/manageApproval/' + tr.uuids + '?type=approval')
    }

    //导出
    exportList = () => {
        let fieldsValue = this.refs.BaseForm.getFieldsValue()
        this.handleFilter({ ...fieldsValue, is_export: '' })
        let param = Util.deleteEmptyKey({ ...this.baseParams})
        if (Object.keys(param).length) {
            window.open(configs.exportUrl + '/reuse/sceneApproval/exportData?' + Qs.stringify(param))
        } else {
            window.open(configs.exportUrl + '/reuse/sceneApproval/exportData')
        }
    }
    //tab切换
    tabChange = (key) => {
        this.setState({
            defaultKey: key
        })
        this.baseParams.queryState = key == '0' ? null : key;
        this.reloadTableData()
    }

    render() {
        return (
            <div>
                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_ApprovalManageGroup} tabChange={this.tabChange}>
                        <AuthButton
                            onClick={this.exportList}
                            type="primary">导出</AuthButton>
                    </BaseTabs>
                    <BaseTable
                        scroll={{ x: 1200 }}
                        url='@/reuse/sceneApproval/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
            </div>
        )
    }
}
