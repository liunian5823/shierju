import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import Qs from 'qs'
import { Card, Modal, Button, Icon, message } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import SaleBondDetail from '../saleBondDetail';
import SaleBondManage from '../saleBondManage';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';

//竞价状态
const _BID = baseService.saleBidNew;
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
export default class SaleScene extends React.Component {
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
        api.ajax('get', '@/reuse/organization/queryOrgListByUserId').then(({ data }) => {
            this.setState({
                formList: [
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
            title: '竞价编号',
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
                text = text.length > 50 ? `${text.substr(0,20)}......${text.substr(text.length-20,text.length)}` : text
                return (
                    <p title={textitle}>
                       {text}
                    </p>
                )
            }
        },
        {
            title: '销售部门',
            dataIndex: 'saleDeptName',
            key: 'saleDeptName',
            width: 180,
            sorter: true,
            render: (text, record) => {
                let textitle = text
                text = text.length > 20 ? `${text.substr(0,8)}......${text.substr(text.length-8,text.length)}` : text
                return (
                    <p title={textitle}>
                       {text}
                    </p>
                )
            }
        },
        {
            title: '报名数',
            dataIndex: 'signNum',
            key: 'signNum',
            sorter: true
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (text, record) => {
                let item = _MAINBIDOBJ[text] || {};
                let childStatusStrStyle = statusStyle[record.childStatusStr] || {}
                let childStatusStr = record.childStatusStr ? "("+record.childStatusStr+")" : "";
                return (
                    <div className="service">
                        <div style={item.style}>{record.statusStr}</div>
                        <div className="note" style={childStatusStrStyle.style}>{childStatusStr}</div>
                    </div>
                )
            }
        },
        {
            title: '竞价方式',
            dataIndex: 'bidWayStr',
            key: 'bidWayStr',
            sorter: true
        },
        {
            title: '发布时间',
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
            title: '报名截止时间',
            dataIndex: 'signEndTime',
            key: 'signEndTime',
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
            title: '竞价开始时间',
            dataIndex: 'offerStartTime',
            key: 'offerStartTime',
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
            title: '竞价结束时间',
            dataIndex: 'offerEndTime',
            key: 'offerEndTime',
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
      /*  {
            title: '下单时间',
            dataIndex: 'bidTime',
            key: 'bidTime',
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
        },*/
        {
            title: '完成时间',
            dataIndex: 'finishTime',
            key: 'finishTime',
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
            title: '出价次数',
            dataIndex: 'offerNum',
            key: 'offerNum',
            className: 'text_right',
            sorter: true
        },
        {
            title: '出价人数',
            dataIndex: 'buyerNum',
            key: 'buyerNum',
            className: 'text_right',
            sorter: true
        },
        {
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

                    {
                        this.getAuthButton([30,40,41,42,50,60,61,62,63,64,65], record.status)
                        ?<AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                            this.GOjj(record)
                         }}>竞价大厅</AuthButton> : null
                    }

                    {
                        this.getAuthButton([10], record.status)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToEdit(record)
                            }}>编辑场次</AuthButton> : null
                    }


                    <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                        this.handleToCopy(record)
                    }}>发布相似</AuthButton>

                    {
                        this.getAuthButton([10], record.status)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToDel(record)
                            }}>删除场次</AuthButton> : null
                    }
                    {
                        this.getAuthButton([21, 22], record.status)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToCancel(record)
                            }}>撤销场次</AuthButton> : null
                    }
                    {
                        (this.getAuthButton([30], record.status) || this.getAuthButton([50], record.status, 2))
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToVoid(record)
                            }}>作废场次</AuthButton> : null
                    }
                    {
                        this.getAuthButton([22], record.status)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToCommit(record)
                            }}>再次递交</AuthButton> : null
                    }
                    {
                        (this.getAuthButton([71, 72], record.status) || this.getAuthButton([40, 50], record.status, 2) )
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToBond(record)
                            }}>保证金管理</AuthButton> : null
                    }
                    {
                        this.getAuthButton([61, 62, 63], record.status)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToFail(record)
                            }}>流标</AuthButton> : null
                    }
                    {
                        this.getAuthButton([63], record.status)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToAgainCommit(record)
                            }}>重新递交</AuthButton> : null
                    }
                    {
                        this.getAuthButton([30], record.status)  && record.signNewStatus > 0
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToDetail(record)
                            }}>确认名单</AuthButton> : null
                    }
                    {
                        this.getAuthButton([60], record.status)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} onClick={() => {
                                this.handleToDetail(record)
                            }}>择标</AuthButton> : null
                    }
                </span>
            )
        }
    ];
    GOjj = (tr) => {
        window.open(systemConfigPath.jumpPage('/desk/auctionHall/' + tr.uuids))
        // api.ajax('get', '@/reuse/sceneOffer/offerCheck', {
        //     sceneId: tr.uuids
        // }).then(res => {
        //     window.open(systemConfigPath.jumpPage('/desk/bidHall/' + tr.uuids))
        // },err =>{
        //     message.error(err.msg)
        // })
    }

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
    //发布场次
    addBidScene = () => {
        window.open(systemConfigPath.jumpPage('/desk/saleScene/add'))
    }
    //场次详情
    handleToDetail = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/sale/sceneDetail/' + tr.uuids))
    }
    //编辑场次
    handleToEdit = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/desk/saleScene/add/' + tr.uuids))
    }
    //删除场次
    handleToDel = (tr) => {
        let that = this;
        tr.cb = () => {
            if (tr.uuids) {
                api.ajax('POST', '@/reuse/saleScene/delete', {
                    uuids: tr.uuids
                }).then(res => {
                    Util.alert(res.msg || '删除成功', {
                        type: 'success'
                    })
                    this.setState({
                        visible_cc: false
                    })
                    that.reloadTableData()
                }, error => {
                    Util.alert(error.msg || '删除失败', {
                        type: 'error'
                    })
                })
            }
        }
        this.setState({
            type: _icons.del,
            item_cc: tr,
            visible_cc: true,
            title_cc: '删除场次',
            tip_cc: '确定删除该场次吗？删除后场次信息不能恢复'
        })
    }
    //撤销场次
    handleToCancel = (tr) => {
        let that = this;
        tr.cb = () => {
            if (tr.uuids) {
                api.ajax('POST', '@/reuse/saleScene/back', {
                    uuids: tr.uuids
                }).then(res => {
                    Util.alert(res.msg || '撤销成功', {
                        type: 'success'
                    })
                    this.setState({
                        visible_cc: false
                    })
                    that.reloadTableData()
                }, error => {
                    Util.alert(error.msg || '撤销失败', {
                        type: 'error'
                    })
                })
            }
        }
        this.setState({
            type: _icons.del,
            item_cc: tr,
            visible_cc: true,
            title_cc: '撤销场次',
            tip_cc: '确定撤销该场次吗？'
        })
    }
    //再次递交场次
    handleToCommit = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/desk/saleScene/add/' + tr.uuids))
    }
    //作废场次
    handleToVoid = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/sale/sceneDetail/' + tr.uuids + '?type=void'))
    }
    //流标
    handleToFail = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/sale/sceneDetail/' + tr.uuids + '?type=fail'))
        return;
    }
    //保证金管理
    handleToBond = (tr) => {
        this.setState({
            detailUuids: tr.uuids,
            manageStatus: tr.status,
            detailVisible: true
        })
    }
    //发布相似
    handleToCopy = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/desk/saleScene/add/' + tr.uuids + '?type=copy'))
    }

    //查看订单
    handleToOrderDetail = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/sale/orderDetail/' + tr.uuids))
    }

    //重新递交
    handleToAgainCommit = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/sale/orderConfirm/' + tr.uuids))
    }

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

    render() {

        return (
            <div>
                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter}
                    filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_BID} tabChange={this.tabChange}>
                        <AuthButton onClick={this.exportList}>导出</AuthButton>
                        <AuthButton type="primary" onClick={this.addBidScene}>发布竞价单</AuthButton>
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

                <Modal
                    title="保证金管理"
                    maskClosable={false}
                    width={1000}
                    visible={this.state.detailVisible}
                    onOk={() => {
                        this.setState({ detailVisible: false })
                    }}
                    onCancel={() => {
                        this.setState({ detailVisible: false })
                    }}
                    footer={
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            <Button type="primary" onClick={() => {
                                this.setState({ detailVisible: false })
                            }}>关闭</Button>
                        </div>
                    }>
                    {/* <SaleBondDetail uuids={this.state.detailUuids}></SaleBondDetail> */}
                    <SaleBondManage uuids={this.state.detailUuids} manageStatus={this.state.manageStatus}>></SaleBondManage>
                </Modal>

                <Modal
                    title={this.state.title_cc}
                    visible={this.state.visible_cc}
                    onOk={this.state.item_cc.cb}
                    onCancel={() => { this.setState({ visible_cc: false }) }}
                >
                    <h3 className="mb20" style={{ wordBreak: 'break-all' }}><Icon type={this.state.type.type} style={this.state.type.style} />{this.state.tip_cc}</h3>
                    <div style={{ paddingLeft: '34px' }}>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>竞价场次：<span className='text_top'>{this.state.item_cc.code}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>场次名称：<span className='text_top'>{this.state.item_cc.title}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>销售单位：<span className='text_top'>{this.state.item_cc.saleCompanyName}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>销售部门：<span className='text_top'>{this.state.item_cc.saleDeptName}</span></p>
                    </div>
                </Modal>
            </div>
        )
    }
}
