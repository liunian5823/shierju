import React from 'react';
import Qs from 'qs'
import { Card } from 'antd';
import Util from '@/utils/util'
import { configs, systemConfigPath } from '@/utils/config/systemConfig';

import BaseForm from '@/components/baseForm';
import AuthButton from '@/components/authButton';
import BaseTabs from '@/components/baseTabs';
import OrderTable from './table';
import api from '@/framework/axios';
import { baseService } from '@/utils/common';
//审核状态
const _ApprovalManageGroup = baseService.approvalManageGroup;

export default class VerifyOrder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultKey: sessionStorage.VerifyOrderStatus || '1',
            tableState: 1,
        }
    }

    componentWillUnmount() {
        sessionStorage.VerifyOrderStatus = ''
    }

    baseParams = {
        queryState: sessionStorage.VerifyOrderStatus || '1'
    }
    importantFilter = ['saleCompanyName', 'code'];
    formList = [
        {
            type: 'INPUT',
            field: 'saleCompanyName',
            label: '销售单位',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'code',
            label: '订单号',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'saleDeptName',
            label: '销售项目部',
            placeholder: '请输入'
        },
        {
            type: 'RANGE',
            field: 'creatStartDate',
            label: '下单时间',
        },
        {
            type: 'SELECT',
            field: 'source',
            label: '订单来源',
            placeholder: '请选择',
            list: baseService.approvalSourceGroup
        },
        {
            type: 'SELECT',
            field: 'status',
            label: '订单状态',
            placeholder: '请选择',
            list: baseService.approvalStatusGroup
        },
        {
            type: 'INPUT',
            field: 'business',
            label: '竞价单',
            placeholder: '请输入公告名称或单号'
        },
    ]

    _sortColumns = [
        {
            key: 'confirmTime',
            value: '下单时间',
            sort: true,
        },
        // {
        //     key: 'dhTime',
        //     value: '期望到货',
        //     // sort: true,
        // },
        {
            key: 'amt',
            value: '金额',
            sort: true,
        },
        {
            key: 'status',
            value: '状态',
            sort: true,
            // filter: true,
        }
    ]

    _bodyColumns = [
        {
            key: 'goodsName',
            dataIndex: 'goodsName',
            render: text => {
                return <div style={{ wordBreak: 'break-all' }} className='text_line5' title={text}>{text}</div>
            }
        },
        {
            key: 'num',
            dataIndex: 'num',
            render(text) {
                return <span>x{text}</span>
            }
        },
        {
            key: 'confirmTime',
            dataIndex: 'confirmTime',
            rowSpan: true,
            style: {
                textAlign: 'center',
                verticalAlign: 'baseline',
            },
            render(text, record, index, list, item) {
                let children = (
                    <span>
                        <p>下单时间:</p>
                        <p className="mt10">{item.confirmTime}</p>
                        {/* <p className="mt20">期望到货:</p>
                        <p className="mt10">-</p> */}
                    </span>
                )
                const obj = {
                    children,
                    props: {}
                }
                if (index == 0) {
                    obj.props.rowSpan = list.length
                }
                if (index > 0) {
                    obj.props.rowSpan = 0
                }
                return obj
            }
        },
        {
            key: 'amt',
            dataIndex: 'amt',
            rowSpan: true,
            style: {
                textAlign: 'center',
                verticalAlign: 'baseline',
            },
            render: (text, record, index, list, item) => {
                let children = (
                    <span>
                        <p className="mt10 color_e font14">￥{numeral(item.amt || 0).format('0,0.00')}</p>
                        <p className="mt10">{item.payWayStr}</p>
                    </span>
                )
                const obj = {
                    children,
                    props: {}
                }
                if (index == 0) {
                    obj.props.rowSpan = list.length
                }
                if (index > 0) {
                    obj.props.rowSpan = 0
                }
                return obj
            }
        },
        {
            key: 'statusStr',
            dataIndex: 'statusStr',
            style: {
                textAlign: 'center',
                verticalAlign: 'baseline',
            },
            render(text, record, index, list, item) {
                let style = {};
                baseService.approvalStatusGroup.forEach(v => {
                    if (v.id == item.status) {
                        style = v.style
                    }
                });
                let children = <span style={style}>{item.statusStr}</span>;
                const obj = {
                    children,
                    props: {}
                }
                if (index == 0) {
                    obj.props.rowSpan = list.length
                }
                if (index > 0) {
                    obj.props.rowSpan = 0
                }
                return obj
            }
        },
        {
            key: 'x',
            dataIndex: 'x',
            width: 100,
            style: {
                textAlign: 'center',
                verticalAlign: 'baseline',
            },
            render: (text, record, index, list, item) => {
                let children = (
                    <div>
                        <AuthButton elmType="a" onClick={() => { this.handleToView(item) }}>查看订单</AuthButton>
                        {
                            item.status == 20 && item.permitApproval === 1
                                ? <AuthButton elmType="a" onClick={() => { this.handleToVerify(item) }}>审核订单</AuthButton>
                                : null
                        }
                    </div>
                )
                const obj = {
                    children,
                    props: {}
                }
                if (index == 0) {
                    obj.props.rowSpan = list.length
                }
                if (index > 0) {
                    obj.props.rowSpan = 0
                }
                return obj
            }
        },
    ]

    //查看订单
    handleToView = (item) => {
        this.props.history.push('/verify/orderApproval/' + item.uuids)
    }
    //审核订单
    handleToVerify = (item) => {
        this.props.history.push('/verify/orderApproval/' + item.uuids + '?type=approval')
    }

    exportList = () => {
        let fieldsValue = this.refs.BaseForm.getFieldsValue()
        this.handleFilter({ ...fieldsValue, is_export: '' })
        let param = Util.deleteEmptyKey({ ...this.baseParams })
        if (Object.keys(param).length) {
            window.open(configs.exportUrl + '/reuse/orderApprove/exportData?' + Qs.stringify(param))
        } else {
            window.open(configs.exportUrl + '/reuse/orderApprove/exportData')
        }
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
        }
        if (p.creatStartDate) {
            params.creatStartDate = p.creatStartDate[0] ? moment(p.creatStartDate[0]).format('YYYY-MM-DD') : '';
            params.creatEndDate = p.creatStartDate[1] ? moment(p.creatStartDate[1]).format('YYYY-MM-DD') : '';
        }
        this.baseParams = {
            ...this.baseParams,
            ...p,
            ...params,
        }
    }

    //tab切换
    tabChange = (key) => {
        this.setState({
            defaultKey: key
        })
        this.baseParams.queryState = key == '0' ? null : key;
        this.setState({
            tableState: 1
        })
    }

    render() {
        return (
            <div>
                <BaseForm
                    ref='BaseForm'
                    formList={this.formList}
                    importantFilter={this.importantFilter}
                    filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                    <BaseTabs
                        defaultKey={this.state.defaultKey}
                        tabsList={_ApprovalManageGroup}
                        tabChange={this.tabChange}></BaseTabs>

                    <OrderTable
                        exportList={this.exportList}
                        url="@/reuse/orderApprove/findPage"
                        exportUrl="/reuse/orderApprove/exportData"
                        tableState={this.state.tableState}
                        baseParams={this.baseParams}
                        bodyColumns={this._bodyColumns}
                        sortColumns={this._sortColumns}></OrderTable>
                </Card>
            </div>
        )
    }
}
