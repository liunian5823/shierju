import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Card, Modal, Button } from 'antd';
import Qs from 'qs'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import SaleBondDetail from '../saleBondDetail';
import SaleBondManage from '../saleBondManage';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
function toFixed(num, d) {
    if (!num) { return '0.00' }
    var s = num + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 0) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return num + "";
}
const _MAINBIDOBJ = baseService._saleMainBid_obj;
//保证金状态
const _BIDBOND = [
    { id: '10', value: '未缴纳' },
    { id: '20', value: '已缴纳' },
    { id: '30', value: '未退还' },
    { id: '40', value: '已退还' },
    { id: '50', value: '已没收' },
    { id: '60', value: '罚款中' },
    { id: '70', value: '作废' },
];
//竞价方式
const _BIDTYPE = baseService.bidType;
//保证金状态
const _BONDSTATUS = baseService._bondMain;
const _BONDSTATUS_OBJ = baseService._bondMain_obj;

const colors = {
    '10': '#fa9b13',
    '20': '#fa9b13',
    '30': '#0cba5e',
    '40': '#fa9b13',
    '50': '#0cba5e',
    '60': '#f15557',
}

export default class BuyBond extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formList: [],
            defaultKey: sessionStorage.SaleSceneStatus || null,
            manageVisible: false,//保证金管理
            manageUuids: null,
            detailVisible: false,//查看详情
            detailUuids: null,
            bondDealUuids: null,
        }
    }

    /**查询条件 */
    baseParams = {}
    importantFilter = ['saleDeptName', 'nameOrCode'];


    componentWillMount() {
        api.ajax('get', '@/reuse/organization/queryOrgListByUserId').then(({ data }) => {
            this.setState({
                formList: [
                    {
                        type: 'SELECTINPUT',
                        field: 'saleDeptName',
                        label: '销售项目部',
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
                        field: 'nameOrCode',
                        label: '竞价名称/单号',
                        placeholder: '请输入'
                    },
                    {
                        type: 'RANGE',
                        field: 'bidStartDate',
                        label: '下单时间'
                    },
                    {
                        type: 'RANGE',
                        field: 'offerEndTime',
                        label: '竞价开始时间'
                    },
                    {
                        type: 'RANGE',
                        field: 'signEndTime',
                        label: '报名截止时间'
                    },
                    {
                        type: 'SELECT',
                        field: 'bidWay',
                        label: '竞价方式',
                        list: _BIDTYPE,
                        placeholder: '请选择'
                    },
                    {
                        type: 'SELECT',
                        field: 'sceneStatus',
                        label: '状态',
                        list: _BIDBOND,
                        placeholder: '请选择'
                    }
                ]
            })
        })
    }

    columns = [
        {
            title: '竞价编号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 130,
            className: 'text_line5_td'
        },
        {
            title: '竞买人企业名称',
            dataIndex: 'buyerCompanyName',
            key: 'buyerCompanyName',
            sorter: true,
            width: 150,
        },
        {
            title: '保证金金额',
            dataIndex: 'amt',
            key: 'amt',
            sorter: true,
            width: 130,
            className: 'text_line5_td'
        },
        {
            title: '来款时间',
            dataIndex: 'payTime',
            key: 'payTime',
            sorter: true,
            width: 130,
        },
        {
            title: '保证金状态',
            sorter: true,
            key: 'bondStatusStr',
            dataIndex: 'bondStatusStr',
            className: 'text_center',
            width: 110,
        },
        {
            title: '处理状态',
            dataIndex: 'dealStatusStr',
            key: 'dealStatusStr',
            sorter: true,
            width: 110,
        },
        {
            title: '处理时间',
            dataIndex: 'dealTime',
            key: 'dealTime',
            sorter: true,
            className: 'text_right',
            width: 130,
        },
        {
            title: '公告名称',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            className: 'text_right',
            width: 100,
        },
        {
            title: '销售部门',
            dataIndex: 'saleDeptName',
            key: 'saleDeptName',
            sorter: true,
            width: 100,
            className: 'text_right'
        },
     /*   {
            title: '竞价状态',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            width: 100,
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
        },*/
        {
            title: '报名截止',
            dataIndex: 'signEndTime ',
            key: 'signEndTime ',
            sorter: true,
            width: 120,
            className: 'text_right'
        },
        {
            title: '竞价开始',
            dataIndex: 'offerStartTime',
            key: 'offerStartTime',
            sorter: true,
            width: 100,
        },
        {
            title: '竞价结束',
            dataIndex: 'offerEndTime',
            key: 'offerEndTime',
            sorter: true,
            width: 100,
        },
        {
            title: '竞价方式',
            dataIndex: 'bidWay',
            key: 'bidWay',
            sorter: true,
            width: 100,
            render: (text, record) => (
                <span>
                    {record.bidWay == '1' ? '公开': '邀请'}
                </span>
            )
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 120,
            fixed: 'right',
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                    <AuthButton elmType="a" key="1" onClick={() => { this.handleToDetail(record) }}>查看详情</AuthButton>
                </span>
            )
        }
    ];

    //tab切换tableData
    tabChange = (prop) => {
        this.setState({
            defaultKey: prop === '0' ? null : prop
        })
        this.baseParams.bondStatus = prop === '0' ? null : prop;
        this.reloadTableData()
    }
/*    //导出
    exportList = () => {
        let fieldsValue = this.refs.BaseForm.getFieldsValue()
        this.handleFilter({ ...fieldsValue, is_export: '' })
        let param = Util.deleteEmptyKey({ ...this.baseParams })
        if (Object.keys(param).length) {
            window.open(configs.exportUrl + '/reuse/bondDeal/exportData?' + Qs.stringify(param))
        } else {
            window.open(configs.exportUrl + '/reuse/bondDeal/exportData')
        }
    }*/
    //详情
    handleToDetail = (tr) => {
        if (!tr.bondUuids) return;
        window.open(systemConfigPath.jumpPage('/buy/marginDetail/' + tr.bondUuids))
    }


    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.bondStatus = null
            this.setState({
                defaultKey: null
            })
        }
        let params = {
            bidStartDate: null,//下单时间
            bidEndDate: null,
            offerEndTimeStart: null,//竞价开始时间
            offerEndTimeEnd: null,
            signEndTimeStart: null,//报名截止时间
            signEndTimeEnd: null,
        };
        if (p.bidStartDate) {
            params.bidStartDate = p.bidStartDate[0] ? moment(p.bidStartDate[0]).format('YYYY-MM-DD') : '';
            params.bidEndDate = p.bidStartDate[1] ? moment(p.bidStartDate[1]).format('YYYY-MM-DD') : '';
            delete p.bidStartDate
        }
        if (p.offerEndTime) {
            params.offerEndTimeStart = p.offerEndTime[0] ? moment(p.offerEndTime[0]).format('YYYY-MM-DD') : '';
            params.offerEndTimeEnd = p.offerEndTime[1] ? moment(p.offerEndTime[1]).format('YYYY-MM-DD') : '';
            delete p.offerEndTime
        }
        if (p.signEndTime) {
            params.signEndTimeStart = p.signEndTimeStart[0] ? moment(p.signEndTimeStart[0]).format('YYYY-MM-DD') : '';
            params.signEndTimeEnd = p.signEndTimeStart[1] ? moment(p.signEndTimeStart[1]).format('YYYY-MM-DD') : '';
            delete p.signEndTime
        }
        this.baseParams = {
            ...this.baseParams,
            ...p,
            ...params
        }

        if (p.is_export === undefined) {
            this.reloadTableData();
        }
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
    colseNew(){
        this.setState({ manageVisible: false })
        this.reloadTableData();
    };

    render() {

        return (
            <div>
                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                  {/*  <BaseTabs defaultKey={this.state.defaultKey} tabsList={_BONDSTATUS} tabChange={this.tabChange}>
                        <AuthButton  onClick={this.exportList} type="primary">导出</AuthButton>
                    </BaseTabs>*/}
                    <BaseTable
                        scroll={{ x: 1400 }}
                        url='@/reuse/newBondDeal/manageBondPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
            </div>
        )
    }
}
