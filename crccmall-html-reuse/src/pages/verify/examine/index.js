import React from 'react';
import Qs from 'qs'
import Util from '@/utils/util'
import { Card, Modal, Button, Icon, message } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
// import SaleBondManage from '../saleBondManage';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import api from '@/framework/axios';
//竞价状态
const _BID = baseService.approvalManageGroup;
const _MAINBIDOBJ = baseService._saleMainBid_obj;
const statusStyle = baseService.statusStyle
//竞价方式
const _BIDTYPE = baseService.bidType;
const _PRICINGMETHOD = baseService.pricingMethod;
const _icons = {
    save: {
        type: 'question-circle',
        style: {
            color: '#fa0',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
            verticalAlign: '-2px'
        }
    },
    del: {
        type: 'cross-circle',
        style: {
            color: '#F5222D',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
            verticalAlign: '-2px'
        }
    },
}
export default class Examine extends React.Component {
    constructor(props){
        super(props)
        this.state={
            defaultKey: sessionStorage.SaleSceneStatus || "0",
            type: {},
            item_cc: {},
            title_cc: '',
            tip_cc: '',
            visible_cc: false,
            detailVisible: false,//保证金管理
            detailUuids: null,
            job_number:'',
            formList: [],
            selectData:[{
                id:"001",
                value:'用户1'
            },{
                id:"002",
                value:'用户2'
            }]
        }
    }
    componentWillMount(){
        this.getXmbList()
    }


    componentWillUnmount() {
        sessionStorage.SaleSceneStatus = ''
    }


    getXmbList() {
        api.ajax('get', '@/reuse/organization/queryOrgListByUserId').then(({ data }) => {
            this.setState({
                formList: [
                    {
                        type: 'SELECTINPUT',
                        field: 'saleDeptID',
                        label: '项目部',
                        list: data.map(v => {
                            return {
                                id: v.id,
                                value: v.organizationName
                            }
                        }),
                        placeholder: '请输入'
                    },
                    {
                        type: 'INPUT',
                        field: 'titleAndCode',
                        label: '名称/单号：',
                        placeholder: '请搜索名称或单号'
                    },
                    {
                        type: 'INPUT',
                        field: 'saleCompanyName',
                        label: '竞买人企业名称：',
                        placeholder: '请输入投标方名称'
                    },
                    {
                        type: 'RANGE',
                        field: 'offerStartTime',
                        label: '竞价开始时间：',
                        placeholder: '开始日期    ~    结束日期'
                    },
                    {
                        type: 'RANGE',
                        field: 'offerEndTime',
                        label: '竞价结束时间：',
                        placeholder: '开始日期    ~    结束日期'
                    },
                    {
                        type: 'RANGE',
                        field: 'signEndTime',
                        label: '报名截止时间：',
                        placeholder: '开始日期    ~    结束日期'
                    },{
                        type: 'SELECTINPUT',
                        field: 'bidWay',
                        label: '竞价方式：',
                        list: baseService.bidTypeGroup,
                        placeholder: '请输入'
                    },
                    {
                        type: 'RANGE',
                        field: 'chooseTime',
                        label: '下单日期：',
                        placeholder: '开始日期    ~    结束日期'
                    }
                ]
            })
        })
    }

    baseParams = {
        dealStatus: sessionStorage.SaleSceneStatus || null
    }
    importantFilter = ['saleDeptID', 'titleAndCode'];

    // 列表
    columns = [
        {
            title: '竞价编号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150,
        }
        ,{
            title: '公告名称',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            width: 150
        },{
            title: '中标企业名称',
            dataIndex: 'bidCompanyName',
            key: 'bidCompanyName',
            sorter: true,
            width: 150
        },{
            title: '中标金额',
            dataIndex: 'bidAmt',
            key: 'bidAmt',
            sorter: true,
            width: 150
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            width: 150
        },{
            title: '处理时间',
            dataIndex: 'dealTime',
            key: 'dealTime',
            sorter: true,
            width: 150
        },{
            title: '审核状态',
            dataIndex: 'dealStatus',
            key: 'dealStatus',
            sorter: true,
            width: 150,
            render: (text, record) => {
                return  (
                    <span>{record.dealStatus == 1 ? '待审核' :record.dealStatus == 2 ? '审核通过' : '审核驳回' }</span>
                )
            }
        },{
            title: '审批人',
            dataIndex: 'dealUserName',
            key: 'dealUserName',
            sorter: true,
            width: 150
        },{
            title: '择标人',
            dataIndex: 'chooseUsername',
            key: 'chooseUsername',
            sorter: true,
            width: 150
        },{
            title: '竞价结束',
            dataIndex: 'offerEndTime',
            key: 'offerEndTime',
            sorter: true,
            width: 150
        },{
            title: '销售部门',
            dataIndex: 'saleDeptName',
            key: 'saleDeptName',
            sorter: true,
            width: 150
        },{
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 100,
            fixed: 'right',
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.handleToDetail(record)
                    }}>查看详情</AuthButton>

                    {record.dealStatus==1 ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.GOjj(record)
                    }}>审核</AuthButton> : '' }

                </span>
            )
        }
    ]

    //查看详情
    handleToDetail = (tr) => {
        console.log(tr.uuids)
        this.props.history.push('/verify/delVsrify/' + tr.sceneId+'/'+tr.uuids)
    }
    getAuthButton(arr, status, type = 1) {
        if (type == 1) {
            return arr.join(",").indexOf(status) != -1
        }
        if (type == 2) {
            return (status > arr[0]) && (status < arr[1])
        }
    }
    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.dealStatus = null
            this.setState({
                defaultKey: 0
            })
        }
        let params = {
            offerStartTimeStart: null,
            offerStartTimeEnd: null,
            offerEndTimeStart: null,
            offerEndTimeEnd: null,
            signEndTimeStart: null,
            signEndTimeEnd: null,
        }

        if (p.offerStartTime) {
            params.offerStartTimeStart = p.offerStartTime[0] ? moment(p.offerStartTime[0]).format('YYYY-MM-DD') : '';
            params.offerStartTimeEnd = p.offerStartTimeEnd[1] ? moment(p.offerStartTimeEnd[1]).format('YYYY-MM-DD') : '';
            delete p.offerStartTime
        }

        if (p.offerEndTime) {
            params. offerEndTimeStart = p.offerEndTime[0] ? moment(p.offerEndTime[0]).format('YYYY-MM-DD') : '';
            params. offerEndTimeEnd = p.offerEndTime[1] ? moment(p.offerEndTime[1]).format('YYYY-MM-DD') : '';
            delete p.offerEndTime
        }

        if (p.signEndTime) {
            params. signEndTimeStart = p.signEndTime[0] ? moment(p.signEndTime[0]).format('YYYY-MM-DD') : '';
            params. signEndTimeEnd = p.signEndTime[1] ? moment(p.signEndTime[1]).format('YYYY-MM-DD') : '';
            delete p.signEndTime
        }
        this.baseParams = {
            ...this.baseParams,
            ...p,
            ...params,
        }
        this.reloadTableData();

    }

    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
//导出
    exportList = () => {
        let fieldsValue = this.refs.BaseForm.getFieldsValue()
        this.handleFilter({ ...fieldsValue, is_export: '' })
        let param = Util.deleteEmptyKey({ ...this.baseParams })
        if (Object.keys(param).length) {
            window.open(configs.exportUrl + '/reuse/saleScene/exportData?' + Qs.stringify(param))
        } else {
            window.open(configs.exportUrl + '/reuse/saleScene/exportData')
        }
    }
//tab切换tableData
    tabChange = (prop) => {
        this.setState({
            defaultKey: prop === '0' ? null : prop
        })
        this.baseParams.dealStatus = prop === '0' ? null : prop;
        this.reloadTableData()
    }
    render() {

        return (
            <div>
                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter}
                          filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_BID} tabChange={this.tabChange}>
                        <AuthButton onClick={this.exportList} type="primary">导出</AuthButton>
                    </BaseTabs>
                    <BaseTable
                        scroll={{ x: 1900 }}
                        url='@/reuse/newBidApprove/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={true}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
            </div>
        )
    }
}