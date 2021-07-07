import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import Qs from 'qs'
import {Card,Modal} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import {baseService} from '@/utils/common';
import {configs, systemConfigPath} from '@/utils/config/systemConfig';
const confirm = Modal.confirm;
//竞价状态
const _BID = baseService.saleBidNew;
//订单状态
const _ORDERSTAUS = baseService.orderStatusNew;
const _MAINBIDOBJ = baseService._saleMainBid_obj;
const statusStyle = baseService.statusStyle
//竞价方式
const _BIDTYPE = baseService.bidType;
const _PRICINGMETHOD = baseService.pricingMethod;
const _icons = {
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
export default class SellerOrderList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultKey: sessionStorage.SaleSceneStatus || null,
            type: {},
            item_cc: {},
            title_cc: '',
            tip_cc: '',
            visible_cc: false,
            detailVisible: false,//保证金管理
            detailUuids: null,
            formList: []
        }
    }

    componentWillMount() {
        api.ajax('get', '@/reuse/organization/queryOrgListByUserId').then(({data}) => {
            this.setState({
                formList: [
                    {
                        type: 'SELECTINPUT',
                        field: 'organizationName',
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
                        field: 'titleNo',
                        label: '名称或单号',
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
                        label: '报名截止时间',
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
                        label: '竞价状态',
                        list: _BID,
                        multiple: true,
                        placeholder: '请选择'
                    },
                    {
                        type: 'SELECT',
                        field: 'pricingMethod',
                        label: '处置方式',
                        list: _PRICINGMETHOD,
                        placeholder: '请选择'
                    }
                ]
            })
        })
    }

    componentWillUnmount() {
        sessionStorage.SaleSceneStatus = ''
    }

    baseParams = {
        tabStatus: sessionStorage.SaleSceneStatus || null
    }
    importantFilter = ['organizationName', 'nameOrCode'];

    columns = [
        {
            title: '订单编号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150,
            fixed: 'left'
        },
        {
            title: '公告名称',
            dataIndex: 'title',
            key: 'title',
            width: 380,
            sorter: true,
            className: 'text_line5_td',
            render: (text, record) => {
                let textitle = text
                text = text && text.length > 50 ? `${text.substr(0, 20)}......${text.substr(text.length - 20, text.length)}` : text
                return (
                    <p title={textitle}>
                        {text}
                    </p>
                )
            }
        },
        {
            title: '销售部门',
            dataIndex: 'organizationName',
            key: 'organizationName',
            width: 180,
            sorter: true,
            render: (text, record) => {
                let textitle = text
                text = text && text.length > 20 ? `${text.substr(0, 8)}......${text.substr(text.length - 8, text.length)}` : text
                return (
                    <p title={textitle}>
                        {text}
                    </p>
                )
            }
        },
        {
            title: '买受人',
            dataIndex: 'buyerCompanyName',
            key: 'buyerCompanyName',
            width: 180,
            sorter: true,
            render: (text, record) => {
                let textitle = text
                text = text && text.length > 20 ? `${text.substr(0, 8)}......${text.substr(text.length - 8, text.length)}` : text
                return (
                    <p title={textitle}>
                        {text}
                    </p>
                )
            }
        },
        {
            title: '订单金额',
            dataIndex: 'amt',
            key: 'amt',
            sorter: true
        },
        {
            title: '状态',
            dataIndex: 'statusStr',
            key: 'statusStr',
            sorter: true
        },
        {
            title: '订单来源',
            dataIndex: 'sourceStr',
            key: 'sourceStr',
            sorter: true
        },
        {
            title: '下单人',
            dataIndex: 'username',
            key: 'username',
            sorter: true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
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
            title: '提货期限',
            dataIndex: 'deliveryTime',
            key: 'deliveryTime',
            width: 120,
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
                  <AuthButton elmType="a" style={{display: 'block'}} onClick={() => {
                      this.handleToOrderDetail(record)
                  }}>查看详情</AuthButton>
                    {
                        this.getAuthButton([10, 15], record.status)
                            ? <AuthButton elmType="a" style={{display: 'block'}} onClick={() => {
                                this.handleToOrder(record)
                            }}>确认订单</AuthButton> : null
                    }
                    {
                        this.getAuthButton([10, 15], record.status)
                            ? <AuthButton elmType="a" style={{display: 'block'}} onClick={() => {
                                this.handleToDelete(record)
                            }}>作废</AuthButton> : null
                    }
                    {
                        (this.getAuthButton([30, 71, 72, 100], record.status) || this.getAuthButton([40, 50], record.status, 2) || this.getAuthButton([100, 9999], record.status, 2))
                            ? <AuthButton elmType="a" style={{display: 'block'}} onClick={() => {
                                this.handleToCreatePack(record)
                            }}>录入榜单</AuthButton> : null
                    }
                    {
                        this.getAuthButton([10], record.status)
                            ? <AuthButton elmType="a" style={{display: 'block'}} onClick={() => {
                                this.handleToDel(record)
                            }}>录入发票</AuthButton> : null
                    }
                    {
                        this.getAuthButton([21, 22], record.status)
                            ? <AuthButton elmType="a" style={{display: 'block'}} onClick={() => {
                                this.handleToCancel(record)
                            }}>结束订单</AuthButton> : null
                    }
              </span>
            )
        }
    ];


    getAuthButton(arr, status, type = 1) {
        if (type == 1) {
            return arr.join(",").indexOf(status) != -1
        }
        if (type == 2) {
            return (status > arr[0]) && (status < arr[1])
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
    //导出
    /* exportList = () => {
         let fieldsValue = this.refs.BaseForm.getFieldsValue()
         this.handleFilter({ ...fieldsValue, is_export: '' })
         let param = Util.deleteEmptyKey({ ...this.baseParams })
         if (Object.keys(param).length) {
             window.open(configs.exportUrl + '/reuse/saleScene/exportData?' + Qs.stringify(param))
         } else {
             window.open(configs.exportUrl + '/reuse/saleScene/exportData')
         }
     }*/


    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.tabStatus = null
            this.setState({
                defaultKey: null
            })
        }
        // 发布时间 creatStartDate creatEndDate
        // 竞价结束时间 offerEndTimeStart offerEndTimeEnd
        // 竞价开始时间 offerStartTimeStart offerStartTimeEnd
        // 下单时间 bidStartDate bidEndDate
        // 报名截止时间 signEndTimeStart signEndTimeEnd
        let params = {
            creatStartDate: null,
            creatEndDate: null,
            offerEndTimeStart: null,
            offerEndTimeEnd: null,
            offerStartTimeStart: null,
            offerStartTimeEnd: null,
            bidStartDate: null,
            bidEndDate: null,
            signEndTimeStart: null,
            signEndTimeEnd: null,
        };
        if (p.creatStartDate) {
            params.creatStartDate = p.creatStartDate[0] ? moment(p.creatStartDate[0]).format('YYYY-MM-DD') : '';
            params.creatEndDate = p.creatStartDate[1] ? moment(p.creatStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.offerEndTimeStart) {
            params.offerEndTimeStart = p.offerEndTimeStart[0] ? moment(p.offerEndTimeStart[0]).format('YYYY-MM-DD') : '';
            params.offerEndTimeEnd = p.offerEndTimeStart[1] ? moment(p.offerEndTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        if (p.offerStartTimeStart) {
            params.offerStartTimeStart = p.offerStartTimeStart[0] ? moment(p.offerStartTimeStart[0]).format('YYYY-MM-DD') : '';
            params.offerStartTimeEnd = p.offerStartTimeStart[1] ? moment(p.offerStartTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        if (p.bidStartDate) {
            params.bidStartDate = p.bidStartDate[0] ? moment(p.bidStartDate[0]).format('YYYY-MM-DD') : '';
            params.bidEndDate = p.bidStartDate[1] ? moment(p.bidStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.signEndTimeStart) {
            params.signEndTimeStart = p.signEndTimeStart[0] ? moment(p.signEndTimeStart[0]).format('YYYY-MM-DD') : '';
            params.signEndTimeEnd = p.signEndTimeStart[1] ? moment(p.signEndTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        if (p.status) {
            if (p.status.includes('0')) {
                params.status = ''
            } else {
                params.status = p.status.join(',')
            }
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

    handelCancel = () => {
        this.setState({
            visible_cc: false
        })
    }

    //查看订单
    handleToOrderDetail = (tr) => {
        if (!tr.reUUids) return;
        window.open(systemConfigPath.jumpPage('/order/orderDetail/' + tr.reUUids))
    }

    //确认订单
    handleToOrder = (tr) => {
        if (!tr.reUUids) return;
        window.open(systemConfigPath.jumpPage('/order/orderConfirm/' + tr.reUUids))
    }

    //作废订单
    handleToDelete = (tr) => {
        // 提交如果校验通过弹出提示
        let _this = this;
        confirm({
            title: '是否确认作废此订单?',
            onOk() {
                api.ajax('get', '@/reuse/order/deleteOrder',{uuids: tr.uuids}).then(r => {
                    location.reload();
                }).catch(r => {
                    _this.setState({
                        loading: false
                    })
                    _this.reloadTableData();
                })
            },
            onCancel() {
                Util.alert('已取消操作');
            },
        });
    }

    /**
     * 录入榜单
     * @param tr
     */
    handleToCreatePack(tr){
        if (!tr.reUUids) return;
        window.open(systemConfigPath.jumpPage('/transaction/listInput' + tr.reUUids))
    }



    render() {
        return (
            <div>
                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter}
                          filterSubmit={this.handleFilter}/>
                <Card className="mt10" bordered={false}>
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_ORDERSTAUS} tabChange={this.tabChange}>
                        <AuthButton onClick={this.exportList}>导出</AuthButton>
                    </BaseTabs>
                    <BaseTable
                        scroll={{x: 1900}}
                        url='@/reuse/order/findSellerPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={true}
                        baseParams={this.baseParams}
                        columns={this.columns}/>
                </Card>

            </div>
        )
    }
}
