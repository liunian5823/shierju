import React from 'react';
import Qs from 'qs'
import Util from '@/utils/util'
import {Card, Modal, Button, Icon, message, Row, Col, Switch} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from "./index.less";
//竞价状态
const _BID = baseService.review;

export default class AccountClear extends React.Component {
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
                    type: 'INPUT',
                    field: 'SalesType',
                    label: '来款账户名、来款帐号：',
                    placeholder: '请输入'
                },
                {
                    type: 'INPUT',
                    field: 'bidInvitingName',
                    label: '来款附言：',
                    placeholder: '请输入招标方名称'
                },
                {
                    type: 'INPUT',
                    field: 'biddergName',
                    label: '来款金额：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'SELECTINPUT',
                    field: 'disposerType',
                    label: '审批状态：',
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
                    field: 'orderNumbers',
                    label: '受理人：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'INPUT',
                    field: 'StatementNumbers',
                    label: '复核人：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'INPUT',
                    field: 'StatementNumber',
                    label: '工单号：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'RANGE',
                    field: 'acceptanceDate',
                    label: '来款时间：'
                },
                {
                    type: 'INPUT',
                    field: 'cgutio',
                    label: '来款银行：',
                    placeholder: '请输入投标方名称'
                }, {
                    type: 'SELECTINPUT',
                    field: 'buildrTypes',
                    label: '业务类型：：',
                    list:this.state.selectData.map(v => {
                        return {
                            id: v.id,
                            value: v.value
                        }
                    }),
                    placeholder: '请输入'
                },{
                    type: 'INPUT',
                    field: 'cgutios',
                    label: '业务单号：',
                    placeholder: '请输入投标方名称'
                }, {
                    type: 'SELECTINPUT',
                    field: 'buildrType',
                    label: '处理结果：',
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
            title: '来款银行',
            dataIndex: 'businessType',
            key: 'businessType',
            sorter: true,
            width: 150
        },{
            title: '流水号',
            dataIndex: 'disposer',
            key: 'disposer',
            sorter: true,
            width: 150
        },{
            title: '来款账户名',
            dataIndex: 'department',
            key: 'department',
            sorter: true,
            width: 150
        },{
            title: '来款账户号',
            dataIndex: 'person',
            key: 'person',
            sorter: true,
            width: 150
        },{
            title: '来款附言',
            dataIndex: 'buyer',
            key: 'buyer',
            sorter: true,
            width: 150
        },{
            title: '来款金额',
            dataIndex: 'buyerContact',
            key: 'buyerContact',
            sorter: true,
            width: 150
        },{
            title: '来款时间',
            dataIndex: 'depositAmount',
            key: 'depositAmount',
            sorter: true,
            width: 150
        },{
            title: '状态',
            dataIndex: 'finesAmount',
            key: 'finesAmount',
            sorter: true,
            width: 150,
            render: (text) => (
                <span style={{color:"red"}}>{text}</span>
            )
        },{
            title: '处理结果',
            dataIndex: 'confiscationsActual',
            key: 'confiscationsActual',
            sorter: true,
            width: 150
        },{
            title: '业务类型',
            dataIndex: 'creationTime',
            key: 'creationTime',
            sorter: true,
            width: 150
        },{
            title: '业务单号',
            dataIndex: 'acceptanceTime',
            key: 'acceptanceTime',
            sorter: true,
            width: 150
        },{
            title: '付款单号',
            dataIndex: 'Acceptor',
            key: 'Acceptor',
            sorter: true,
            width: 150
        },{
            title: '受理人',
            dataIndex: 'treatmentResults',
            key: 'treatmentResults',
            sorter: true,
            width: 150
        },{
            title: '受理时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '处理时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '复核人',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '复核时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '完成时间',
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
                    }}>审核</AuthButton>
                </span>
            )
        }
    ]

    //查看详情
    handleToDetail = (tr) => {
        console.log(tr.uuids)
        this.props.history.push('/capitalAccoun/accountclearDetail/' + tr.uuids)
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
    shOnchange=(checked)=>{
        console.log(`switch to ${checked}`);
    }
    createCardInfo = () =>{
        return (
            <div>
            <Row claName="reuse_row" >
                <Col span={5} style={{marginBottom:"10px"}}>
                    <span style={{color:"#FA6400",fontSize:"14px"}}>未受理</span>
                    <p style={{color:"#FA6400",fontSize:"24px"}}>99999999.00元</p>
                </Col>
                <Col span={5} style={{marginBottom:"10px"}}>
                    <span style={{color:"#32C5FF",fontSize:"14px"}}>处理中</span>
                    <p style={{color:"#32C5FF",fontSize:"24px"}}>99999999.00元</p>
                </Col>
                <Col span={5} style={{marginBottom:"10px"}}>
                    <span style={{color:"#32C5FF",fontSize:"14px"}}>复核中</span>
                    <p style={{color:"#32C5FF",fontSize:"24px"}}>99999999.00元</p>
                </Col>
                <Col span={5} style={{marginBottom:"10px"}}>
                    <span style={{color:"#0CBA5E",fontSize:"14px"}}>已处理</span>
                    <p style={{color:"#0CBA5E",fontSize:"24px"}}>99999999.00元</p>
                </Col>
                <Col span={5} style={{marginBottom:"10px"}}>
                    <span style={{fontSize:"14px"}}>退款</span>
                    <p style={{fontSize:"24px"}}>99999999.00元</p>
                </Col>
                <Col span={5} style={{marginBottom:"10px"}}>
                    <span style={{fontSize:"14px"}}>清分</span>
                    <p style={{fontSize:"24px"}}>99999999.00元</p>
                </Col>
                <Col span={5} style={{marginBottom:"10px"}}>
                    <span style={{fontSize:"14px"}}>总来款金额</span>
                    <p style={{fontSize:"24px"}}>99999999.00元</p>
                </Col>
            </Row>
            </div>
        )
    }
    render() {

        return (
            <div>
                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter}
                          filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                    {this.createCardInfo()}
                </Card>
                <Card className="mt10" bordered={false}>
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_BID} tabChange={this.tabChange}>
                        <Switch heckedChildren="审核" unCheckedChildren="审核"  defaultChecked={false} onChange={this.shOnchange} />
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