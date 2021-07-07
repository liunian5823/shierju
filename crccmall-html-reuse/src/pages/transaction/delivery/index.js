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
//提货单状态
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
export default class Delivery extends React.Component {
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
                    field: 'organizationName',
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
                    field: 'takeCode',
                    label: '提货单号：',
                    placeholder: '请输入提货单号'
                },
                {
                    type: 'INPUT',
                    field: 'saleCompanyName',
                    label: '销售单位：',
                    placeholder: '请输入销售单位'
                },
                {
                    type: 'INPUT',
                    field: 'orderCode',
                    label: '订单单号：',
                    placeholder: '请输入订单单号'
                },
                {
                    type: 'RANGE',
                    field: 'finishDate ',
                    label: '完成日期：'
                },
                {
                    type: 'INPUT',
                    field: 'settlementCode',
                    label: '结算单单号：',
                    placeholder: '请输入结算单单号'
                },
                {
                    type: 'RANGE',
                    field: 'creatDate ',
                    label: '创建时间：'
                },
                {
                    type: 'INPUT',
                    field: 'buyerCompanyName ',
                    label: '采购单位：',
                    placeholder: '请输入采购单位'
                },{
                    type: 'SELECTINPUT',
                    field: 'status',
                    label: '提货单状态：',
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
            title: '提货单编号',
            dataIndex: 'takeCode',
            key: 'takeCode',
            sorter: true,
            width: 150,
        }
        ,{
            title: '订单编号',
            dataIndex: 'orderCode',
            key: 'orderCode',
            sorter: true,
            width: 150
        },{
            title: '销售单位',
            dataIndex: 'saleCompanyName',
            key: 'saleCompanyName',
            sorter: true,
            width: 150
        },{
            title: '提货单位',
            dataIndex: 'buyerCompanyName',
            key: 'buyerCompanyName',
            sorter: true,
            width: 150
        },{
            title: '订单金额',
            dataIndex: 'orderAmt',
            key: 'orderAmt',
            sorter: true,
            width: 150
        },{
            title: '确认重量',
            dataIndex: 'takeTotalCount',
            key: 'takeTotalCount',
            sorter: true,
            width: 150
        },{
            title: '磅单金额',
            dataIndex: 'takeAmt',
            key: 'takeAmt',
            sorter: true,
            width: 150
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            width: 150,
            render: (text, record) => {
                return (
                    <div className="service">
                        <div>{record.statusStr}</div>
                    </div>
                )
            }

        },{
            title: '登记人',
            dataIndex: 'takeContacts',
            key: 'takeContacts',
            sorter: true,
            width: 150
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            width: 150
        },{
            title: '完成时间',
            dataIndex: 'completionTime',
            key: 'completionTime',
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
                        this.checkPound(record)
                    }}>确认磅单</AuthButton>
                </span>
            )
        }
    ]

    //查看详情
    handleToDetail = (tr) => {
        console.log(tr.uuids)
        // this.props.history.push('/transaction/trandelDetil/' + tr.uuids)
        this.props.history.push({pathname: '/transaction/trandelDetil/',state: {uuids}})
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
            let params = {
                creatStartDate: null,
                creatEndDate: null,
                finishStartDate: null,
                finishEndDate: null,
            };
            if (p.creatDate) {
                params.creatStartDate = p.creatDate[0] ? moment(p.creatDate[0]).format('YYYY-MM-DD') : '';
                params.creatEndDate = p.creatDate[1] ? moment(p.creatDate[1]).format('YYYY-MM-DD') : '';
            }
            if (p.finishDate) {
                params.finishStartDate = p.finishDate[0] ? moment(p.finishDate[0]).format('YYYY-MM-DD') : '';
                params.finishEndDate = p.finishEndDate[1] ? moment(p.finishEndDate[1]).format('YYYY-MM-DD') : '';
            }
            this.baseParams = {
                ...this.baseParams,
                ...p,
                ...params
            }
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
                        url='@/reuse/takeDelivery/findPage?type=2'
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