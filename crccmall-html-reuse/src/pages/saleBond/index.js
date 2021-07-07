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
    { id: '20', value: '未确认' },
    { id: '30', value: '已确认' },
    { id: '40', value: '未退还' },
    { id: '50', value: '已退还' },
    { id: '60', value: '已没收' },
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

export default class SaleBond extends React.Component {
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
    importantFilter = ['buyerCompanyName', 'saleDeptName'];


    componentWillMount() {
        api.ajax('get', '@/reuse/organization/queryOrgListByUserId').then(({ data }) => {
            this.setState({
                formList: [
                    {
                        type: 'INPUT',
                        field: 'buyerCompanyName',
                        label: '采购单位',
                        placeholder: '请输入'
                    },
                    {
                        type: 'SELECTINPUT',
                        field: 'organizationName',
                        label: '销售项目部',
                        list: data.map(v => {
                            return {
                                id: v.organizationName,
                                value: v.organizationName
                            }
                        }),
                        placeholder: '请输入'
                    },
                    {
                        type: 'INPUT',
                        field: 'nameOrCode',
                        label: '竞价名称或单号',
                        placeholder: '请输入'
                    },
                    {
                        type: 'RANGE',
                        field: 'creatStartDate',
                        label: '发布日期'
                    },
                    {
                        type: 'RANGE',
                        field: 'bidStartDate',
                        label: '下单时间'
                    },
                    {
                        type: 'RANGE',
                        field: 'offerStartTimeStart',
                        label: '竞价开始时间'
                    },
                    {
                        type: 'RANGE',
                        field: 'offerEndTimeStart',
                        label: '竞价结束时间'
                    },
                    {
                        type: 'RANGE',
                        field: 'signEndTimeStart',
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
                        field: 'status',
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
            title: '采购商名称',
            dataIndex: 'buyerCompanyName',
            key: 'buyerCompanyName',
            sorter: true,
            width: 130,
            className: 'text_line5_td'
        },
        {
            title: '竞价编号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150,
        },
        {
            title: '公告名称',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            width: 130,
            className: 'text_line5_td'
        },
        {
            title: '销售部门',
            dataIndex: 'saleDeptName',
            key: 'saleDeptName',
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
            render: (text, record, index) => {
                let color = colors[record.bondStatus]
                return (
                    <span style={{ color }}>
                        <p>{record.bondStatusStr}</p>
                    </span>
                )
            }
        },
        {
            title: '竞价状态',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            width: 110,
            render: (text, record) => {
                let item = _MAINBIDOBJ[text] || {};
                return (
                    <div style={item.style}>{record.statusStr}</div>
                )
            }
        },
        {
            title: '保证金金额(元)',
            dataIndex: 'bondAmt',
            key: 'bondAmt',
            sorter: true,
            className: 'text_right',
            width: 130,
            render: text => {
                return toFixed(text, 2)
            }
        },
        {
            title: '来款时间',
            dataIndex: 'bondPayTime',
            key: 'bondPayTime',
            sorter: true,
            className: 'text_right',
            width: 100,
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
            title: '确认时间',
            dataIndex: 'confirmTime',
            key: 'confirmTime',
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
        },
        {
            title: '处理时间',
            dataIndex: 'occupyTime',
            key: 'occupyTime',
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
        },
        {
            title: '竞价开始时间',
            dataIndex: 'offerStartTime',
            key: 'offerStartTime',
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
            title: '竞价方式',
            dataIndex: 'bidWayStr',
            key: 'bidWayStr',
            sorter: true,
            width: 100,
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
                    <AuthButton elmType="a" key="2" onClick={() => { this.handleToManage(record) }}>保证金管理</AuthButton>
                </span>
            )
        }
    ];

    //tab切换tableData
    tabChange = (prop) => {
        this.setState({
            defaultKey: prop === '0' ? null : prop
        })
        this.baseParams.tabStatus = prop === '0' ? null : prop;
        this.reloadTableData()
    }
    //导出
    exportList = () => {
        let fieldsValue = this.refs.BaseForm.getFieldsValue()
        this.handleFilter({ ...fieldsValue, is_export: '' })
        let param = Util.deleteEmptyKey({ ...this.baseParams })
        if (Object.keys(param).length) {
            window.open(configs.exportUrl + '/reuse/bondDeal/exportData?' + Qs.stringify(param))
        } else {
            window.open(configs.exportUrl + '/reuse/bondDeal/exportData')
        }
    }
    //详情
    handleToDetail = (tr) => {
        if (!tr.uuids) return;
        this.setState({
            detailUuids: tr.uuids,
            bondDealUuids: tr.bondDealUuids,
            detailVisible: true
        })
    }
    //保证金管理
    handleToManage = (tr) => {
        if (!tr.uuids) return;
        this.setState({
            manageUuids: tr.uuids,
            manageStatus: tr.status,
            manageVisible: true
        })
    }

    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.tabStatus = null
            this.setState({
                defaultKey: null
            })
        }
        let params = {
            bidStartDate: null,//下单时间
            bidEndDate: null,
            creatStartDate: null,//发布日期
            creatEndDate: null,
            offerStartTimeStart: null,//竞价开始时间
            offerStartTimeEnd: null,
            offerEndTimeStart: null,//竞价结束时间
            offerEndTimeEnd: null,
            signEndTimeStart: null,//报名截止时间
            signEndTimeEnd: null,
        };
        if (p.bidStartDate) {
            params.bidStartDate = p.bidStartDate[0] ? moment(p.bidStartDate[0]).format('YYYY-MM-DD') : '';
            params.bidEndDate = p.bidStartDate[1] ? moment(p.bidStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.creatStartDate) {
            params.creatStartDate = p.creatStartDate[0] ? moment(p.creatStartDate[0]).format('YYYY-MM-DD') : '';
            params.creatEndDate = p.creatStartDate[1] ? moment(p.creatStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.offerStartTimeStart) {
            params.offerStartTimeStart = p.offerStartTimeStart[0] ? moment(p.offerStartTimeStart[0]).format('YYYY-MM-DD') : '';
            params.offerStartTimeEnd = p.offerStartTimeStart[1] ? moment(p.offerStartTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        if (p.offerEndTimeStart) {
            params.offerEndTimeStart = p.offerEndTimeStart[0] ? moment(p.offerEndTimeStart[0]).format('YYYY-MM-DD') : '';
            params.offerEndTimeEnd = p.offerEndTimeStart[1] ? moment(p.offerEndTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        if (p.signEndTimeStart) {
            params.signEndTimeStart = p.signEndTimeStart[0] ? moment(p.signEndTimeStart[0]).format('YYYY-MM-DD') : '';
            params.signEndTimeEnd = p.signEndTimeStart[1] ? moment(p.signEndTimeStart[1]).format('YYYY-MM-DD') : '';
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
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_BONDSTATUS} tabChange={this.tabChange}>
                        <AuthButton  onClick={this.exportList} type="primary">导出</AuthButton>
                    </BaseTabs>
                    <BaseTable
                        scroll={{ x: 1400 }}
                        url='@/reuse/bondDeal/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>

                <Modal
                    title="保证金管理"
                    maskClosable={false}
                    width={1000}
                    visible={this.state.manageVisible}
                    onOk={() => { this.setState({ manageVisible: false }) }}
                    onCancel={() => { this.setState({ manageVisible: false }) }}
                    footer={
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            {/* <Button type="primary" onClick={() => { this.setState({ manageVisible: false }) }}>关闭</Button> */}
                            <Button type="primary"  onClick={() => { this.colseNew() }}>关闭</Button>
                        </div>
                    }>
                    <SaleBondManage uuids={this.state.manageUuids} manageStatus={this.state.manageStatus}></SaleBondManage>
                </Modal>

                <Modal
                    title="查看详情"
                    maskClosable={false}
                    width={1000}
                    visible={this.state.detailVisible}
                    onOk={() => { this.setState({ detailVisible: false }) }}
                    onCancel={() => { this.setState({ detailVisible: false }) }}
                    footer={
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            <Button type="primary" onClick={() => { this.setState({ detailVisible: false }) }}>关闭</Button>
                        </div>
                    }>
                    {/* <SaleBondDetail uuids={this.state.detailUuids}></SaleBondDetail> */}
                    <SaleBondDetail uuids={this.state.bondDealUuids}></SaleBondDetail>
                </Modal>
            </div>
        )
    }
}
