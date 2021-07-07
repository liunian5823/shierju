import React from 'react';
import Qs from 'qs'
import Util from '@/utils/util'
import {Card, Modal, Button, Icon, message, Col, Row, Form, Input, Select} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import less from  './index.less'
const FormItem = Form.Item;
const Option = Select.Option;
// import SaleBondManage from '../saleBondManage';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
//竞价状态
const _BID = baseService.teansactionDelivery;
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
export default class Account extends React.Component {
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
                value:'用户1',
            }],
            filt:{}
        }
    }
    componentWillMount(){
        this.setState({
            formList: [
                {
                    type: 'INPUT',
                    field: 'bidInvitingName',
                    label: '项目编号/项目名称：',
                    placeholder: '请输入招标方名称'
                },
                {
                    type: 'SELECTINPUT',
                    field: 'SalesType',
                    label: '部门/项目：',
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
                    field: 'biddergName',
                    label: '上级单位：',
                    placeholder: '请输入投标方名称'
                },

                {
                    type: 'SELECTINPUT',
                    field: 'openStatus',
                    label: '开通状态：',
                    list:this.state.selectData.map(v => {
                        return {
                            id: v.id,
                            value: v.value
                        }
                    }),
                    placeholder: '请输入'
                },
                {
                    type: 'SELECTINPUT',
                    field: 'cardStatus',
                    label: '绑卡状态：',
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
                    label: '银行卡账号：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'DATE',
                    field: 'acceptanceDate',
                    label: '开通时间：'
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
            title: '项目编号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150,
        }
        ,{
            title: '类型',
            dataIndex: 'businessType',
            key: 'businessType',
            sorter: true,
            width: 150
        },{
            title: '项目/部门',
            dataIndex: 'disposer',
            key: 'disposer',
            sorter: true,
            width: 150
        },{
            title: '开通状态',
            dataIndex: 'department',
            key: 'department',
            sorter: true,
            width: 150
        },{
            title: '绑卡状态',
            dataIndex: 'person',
            key: 'person',
            sorter: true,
            width: 150
        },{
            title: '开通时间',
            dataIndex: 'buyer',
            key: 'buyer',
            sorter: true,
            width: 150
        },{
            title: '出金账户余额',
            dataIndex: 'buyerContact',
            key: 'buyerContact',
            sorter: true,
            width: 150
        },{
            title: '入金账户余额',
            dataIndex: 'depositAmount',
            key: 'depositAmount',
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
                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.GOjj(record)
                    }}>开通</AuthButton>
                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.GOjj(record)
                    }}>绑卡</AuthButton>

                </span>
            )
        }
    ]

    //查看详情
    handleToDetail = (tr) => {
        console.log(tr.uuids)
        this.props.history.push('/capitalAccoun/accountDetails/' + tr.uuids)
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
//    搜索
    handleChange=(val)=>{
        let ong={};
        ong.code=val;
        this.handleFilter({...ong});
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
        let selectKey1 ='id';
        let selectlabel1 ='value';
        let list=this.state.selectData.map(v => {
            return {
                id: v.id,
                value: v.value
            }
        })
        return (
            <div>

                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter}
                          filterSubmit={this.handleFilter} />
                <Card className="mb10" bordered={false}>
                    <Row claName="reuse_row" >
                        <Col span={6} style={{marginBottom:"10px"}}>
                            <span style={{fontSize:"14px"}}>出金账户余额合计</span>
                            <p style={{fontSize:"24px",fontWeight:"bold"}}>99999999.00元</p>
                        </Col>
                        <Col span={6} style={{marginBottom:"10px"}}>
                            <span style={{fontSize:"14px"}}>入金账户余额合计</span>
                            <p style={{fontSize:"24px",fontWeight:"bold"}}>99999999.00元</p>
                        </Col>
                        <Col span={6} style={{marginBottom:"10px"}}>
                            <span style={{fontSize:"14px"}}>账户余额合计</span>
                            <p style={{fontSize:"24px",fontWeight:"bold"}}>99999999.00元</p>
                        </Col>
                        <Col span={6} style={{marginBottom:"10px"}}>
                            <span style={{fontSize:"14px"}}>冻结金额合计</span>
                            <p style={{fontSize:"24px",fontWeight:"bold"}}>99999999.00元</p>
                        </Col>
                    </Row>
                </Card>
                <Card className="mt10" bordered={false}>
                    <Row className="reuse_row">
                       <div className={less.positiona}>
                           <Col className="reuse_value" span="18">
                               <FormItem
                                   label="资金账户管理"
                                   labelCol={{ span: 4 }}
                                   wrapperCol={{ span: 18 }}
                                   className={less.margbno}
                               >
                                   <Select
                                       placeholder="平安银行资金账户"
                                       autoComplete="off"
                                       className={less.wid100}
                                       showSearch
                                       onChange={this.handleChange}
                                   >
                                       {Util.getOptionList(list, selectKey1, selectlabel1)}
                                   </Select>
                               </FormItem>
                           </Col>
                       </div>
                    </Row>
                    <BaseTabs defaultKey={this.state.defaultKey} tabChange={this.tabChange}>
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