import React from 'react';
import Qs from 'qs'
import Util from '@/utils/util'
import { Card, Modal, Button, Icon, message } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
//竞价状态
const _BID = baseService.statementCont;

export default class StatementCont extends React.Component {
    constructor(props){
        super(props)
        this.state={
            defaultKey: sessionStorage.SaleSceneStatus || "1",
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
            }]
        }
    }
    componentWillMount(){
        this.setState({
            formList: [
                {
                    type: 'SELECTINPUT',
                    field: 'SalesType',
                    label: '销售项目部：',
                    list:this.state.selectData.map(v => {
                        return {
                            id: v.id,
                            value: v.value
                        }
                    }),
                    placeholder: '请输入'
                },
                {
                    type: 'INPUT',
                    field: 'bidInvitingName',
                    label: '提货单号：',
                    placeholder: '请输入招标方名称'
                },
                {
                    type: 'INPUT',
                    field: 'biddergName',
                    label: '销售单位：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'INPUT',
                    field: 'orderNumbers',
                    label: '订单单号：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'RANGE',
                    field: 'acceptanceDate',
                    label: '完成日期：'
                },
                {
                    type: 'INPUT',
                    field: 'StatementNumbers',
                    label: '结算单单号：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'RANGE',
                    field: 'createeDate',
                    label: '创建时间：'
                },
                {
                    type: 'INPUT',
                    field: 'cgutio',
                    label: '采购单位：',
                    placeholder: '请输入投标方名称'
                },{
                    type: 'SELECTINPUT',
                    field: 'disposerType',
                    label: '提货单状态：',
                    list:this.state.selectData.map(v => {
                        return {
                            id: v.id,
                            value: v.value
                        }
                    }),
                    placeholder: '请输入'
                }, {
                    type: 'SELECTINPUT',
                    field: 'buildrType',
                    label: '订单类型：',
                    list:this.state.selectData.map(v => {
                        return {
                            id: v.id,
                            value: v.value
                        }
                    }),
                    placeholder: '请输入'
                }
            ]
        })
    }
    componentWillUnmount() {
        sessionStorage.SaleSceneStatus = ''
    }

    baseParams = {
        tabStatus: sessionStorage.SaleSceneStatus || null
    }
    importantFilter = ['organizationName', 'nameOrCode'];

    // 列表
    columns = [
        {
            title: '工单号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150,
        }
        ,{
            title: '状态',
            dataIndex: 'businessType',
            key: 'businessType',
            sorter: true,
            width: 150
        },{
            title: '处置方企业名称',
            dataIndex: 'disposer',
            key: 'disposer',
            sorter: true,
            width: 150
        },{
            title: '处置方项目部',
            dataIndex: 'department',
            key: 'department',
            sorter: true,
            width: 150
        },{
            title: '处置方联系人',
            dataIndex: 'person',
            key: 'person',
            sorter: true,
            width: 150
        },{
            title: '买受企业名称',
            dataIndex: 'buyer',
            key: 'buyer',
            sorter: true,
            width: 150
        },{
            title: '买受方联系人',
            dataIndex: 'buyerContact',
            key: 'buyerContact',
            sorter: true,
            width: 150
        },{
            title: '保证金金额',
            dataIndex: 'depositAmount',
            key: 'depositAmount',
            sorter: true,
            width: 150
        },{
            title: '申请罚没金额',
            dataIndex: 'finesAmount',
            key: 'finesAmount',
            sorter: true,
            width: 150
        },{
            title: '实际罚没金额',
            dataIndex: 'confiscationsActual',
            key: 'confiscationsActual',
            sorter: true,
            width: 150
        },{
            title: '创建时间',
            dataIndex: 'creationTime',
            key: 'creationTime',
            sorter: true,
            width: 150
        },{
            title: '受理时间',
            dataIndex: 'acceptanceTime',
            key: 'acceptanceTime',
            sorter: true,
            width: 150
        },{
            title: '受理人',
            dataIndex: 'Acceptor',
            key: 'Acceptor',
            sorter: true,
            width: 150
        },{
            title: '处理结果',
            dataIndex: 'treatmentResults',
            key: 'treatmentResults',
            sorter: true,
            width: 150
        },{
            title: '处理时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 120,
            fixed: 'right',
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.handleToDetail(record)
                    }}>查看详情</AuthButton>
                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.GOjj(record)
                    }}>付款</AuthButton>
                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.GOjj(record)
                    }}>查看收款账户</AuthButton>
                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.GOjj(record)
                    }}>重新支付</AuthButton>

                </span>
            )
        }
    ]

    //查看详情
    handleToDetail = (tr) => {
        console.log(tr.uuids)
        this.props.history.push('/capitalAccoun/statementDetails/' + tr.uuids)
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
            this.baseParams.tabStatus = null
            // this.setState({
            //     defaultKey: null
            // })
            this.reloadTableData();
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
        this.baseParams.tabStatus = prop === '0' ? null : prop;
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
                        url='@/reuse/saleScene/findPage'
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