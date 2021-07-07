import React from 'react';
import Qs from 'qs'
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Card, Modal, Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './index.less';
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
//竞价状态
const _BID = baseService.buyBid;
const _MAINBIDOBJ = baseService._buyMainBid_obj;
//竞价方式
const _BIDTYPE = baseService.bidType;

class BuyScene extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: {},
            item_cc: {},
            title_cc: '',
            tip_cc: '',
            visible_cc: false,
            defaultKey: sessionStorage.buySceneStatus || null,
            formList: [
                {
                    type: 'INPUT',
                    field: 'saleCompanyName',
                    label: '销售单位',
                    placeholder: '请输入'
                },
                {
                    type: 'SELECTINPUT',
                    field: 'saleDeptId',
                    label: '销售项目部',
                    list: [],
                    placeholder: '请选择',
                    listLabel: 'organizationName'
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
                    list: _BID,
                    placeholder: '请选择'
                }
            ],
            cancleVisible: false,//撤销报名
            cancleData: null,//撤销报名
        }
    }

    componentWillUnmount() {
        sessionStorage.buySceneStatus = ''
    }

    componentWillMount() {
        this.handleSearch()
    }

    handleSearch = val => {
        api.ajax('get', '@/reuse/buyScene/getOrgList').then(res => {
            let formList = this.state.formList
            formList[1].list = res.data
            this.setState({
                formList
            })
        }, error => {
            Util.alert(error.msg, {
                type: 'error'
            })
        })
    }

    /**查询条件 */
    baseParams = {
        tabStatus: sessionStorage.buySceneStatus || null
    }
    importantFilter = ['saleCompanyName', 'saleDeptId'];

    columns = [
        {
            title: '竞价编号',
            dataIndex: 'sceneCode',
            key: 'sceneCode',
            width: 150,
            sorter: true
        },
        {
            title: '公告名称',
            dataIndex: 'sceneTitle',
            key: 'sceneTitle',
            width: 180,
            sorter: true,
            className: 'text_line5_td'
        },
        {
            title: '销售单位',
            dataIndex: 'saleCompanyName',
            key: 'saleCompanyName',
            width: 180,
            sorter: true,
            className: 'text_line5_td'
        },
        {
            title: '销售项目部',
            dataIndex: 'saleDeptName',
            key: 'saleDeptName',
            width: 150,
            sorter: true,
            className: 'text_line5_td'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            sorter: true,
            render: (text, record) => {
                text = ((record.sceneStatus >= 70 && record.sceneStatus < 80) || record.sceneStatus == 30) ? '#0cba5e' : text
                text = (record.sceneStatus >= 40 && record.sceneStatus < 60) ? '#2db7f5' : text
                text = (record.sceneStatus == 10 || (record.sceneStatus >= 60 && record.sceneStatus < 70)) ? '#fa9b13' : text
                text = (record.sceneStatus >= 100 || record.sceneStatus == 72 || record.status == 100) ? '#f15557' : text
                return (
                    <div className="service">
                        <div style={{ color: text }}>{record.statusStr}</div>
                        <div className="note">{record.childStatusStr}</div>
                    </div>
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
            title: '竞价方式',
            dataIndex: 'bidWayStr',
            key: 'bidWayStr',
            sorter: true
        },
        {
            title: '发布时间',
            dataIndex: 'scenePublishTime',
            key: 'scenePublishTime',
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
            dataIndex: 'sceneSignEndTime',
            key: 'sceneSignEndTime',
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
        {
            title: '下单时间',
            dataIndex: 'sceneBidTime',
            key: 'sceneBidTime',
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
                    <AuthButton elmType="a" key="1" onClick={() => { this.handleToDetail(record) }}>查看详情</AuthButton>
                    {
                        (this.getAuthButton(record, { status: [10] }) && record.sceneStatus < 50)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} key="2" onClick={() => { this.handleToDel(record) }}>删除场次</AuthButton> : null
                    }
                    {
                        (this.getAuthButton(record, { status: [10] }) && record.sceneStatus < 50)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} key="3" onClick={() => { this.handleToJoin(record) }}>场次报名</AuthButton> : null
                    }
                    {
                        (this.getAuthButton(record, { status: [21, 22, 23, 24] }, 2) && record.sceneStatus < 50)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} key="4" onClick={() => { this.handleToCancle(record) }}>撤销报名</AuthButton> : null
                    }
                    {
                        (this.getAuthButton(record, { status: [22, 24] }, 2) && record.sceneStatus < 50)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} key="6" onClick={() => { this.handleToOffer(record) }}>预报价</AuthButton> : null
                    }
                    {
                        (this.getAuthButton(record, { status: [21] }, 2) && record.sceneStatus < 50)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} key="7" onClick={() => { this.handleToPayBond(record) }}>缴纳保证金</AuthButton> : null
                    }
                    {
                        (!this.getAuthButton(record, { status: [100] }) && record.sceneStatus == 50)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} key="5" onClick={() => { this.handleToOffer(record, true) }}>报价</AuthButton> : null
                    }
                    {
                        (this.getAuthButton(record, { sceneStatus: [71] }) && record.winningBid == 1)
                            ? <AuthButton elmType="a" style={{ display: 'block' }} key="8" onClick={() => { this.handleToOrder(record) }}>查看订单</AuthButton> : null
                    }
                </span>
            )
        }
    ];

    getAuthButton(tr, obj, type = 1) {
        let { status, sceneStatus } = obj;
        let s1 = true, s2 = true;

        if (type == 1) {
            s1 = status ? status.indexOf(tr.status) != -1 : s1;
            s2 = sceneStatus ? sceneStatus.indexOf(tr.sceneStatus) != -1 : s2;
        } else if (type == 2) {
            s1 = status ? status.indexOf(tr.status) != -1 : s1;
            s2 = sceneStatus ? (tr.sceneStatus > sceneStatus[0] && tr.sceneStatus < sceneStatus[1]) : s2;
        }
        return s1 && s2
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
    exportPage = () => {
        let fieldsValue = this.refs.BaseForm.getFieldsValue()
        this.handleFilter({ ...fieldsValue, is_export: '' })
        let param = Util.deleteEmptyKey({ ...this.baseParams })
        if (Object.keys(param).length) {
            window.open(configs.exportUrl + '/reuse/buyScene/exportData?' + Qs.stringify(param))
        } else {
            window.open(configs.exportUrl + '/reuse/buyScene/exportData')
        }
    }
    //查看详情
    handleToDetail = (tr) => {
        if (!tr.sceneId) return;
        window.open(systemConfigPath.jumpPage('/buy/sceneDetail/' + tr.sceneId))
    }
    //删除场次
    handleToDel = (tr) => {
        let that = this;
        tr.cb = () => {
            if (tr.uuids) {
                api.ajax('POST', '@/reuse/buyScene/delete', {
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

        // Util.confirm('删除场次', {
        //     tip: '确定删除该场次吗？删除后场次信息不能恢复',
        //     iconType: 'del',
        //     width: 500,
        //     content: (
        //         <div>
        //             <p style={{ wordBreak: 'break-all', marginBottom: '4px' }}>竞价场次：{tr.sceneCode}</p>
        //             <p style={{ wordBreak: 'break-all', marginBottom: '4px' }}>场次名称：{tr.sceneTitle}</p>
        //             <p style={{ wordBreak: 'break-all', marginBottom: '4px' }}>销售单位：{tr.saleCompanyName}</p>
        //             <p style={{ wordBreak: 'break-all', marginBottom: '4px' }}>销售部门：{tr.saleDeptName}</p>
        //         </div>
        //     ),
        //     onOk() {
        //         if (tr.uuids) {
        //             api.ajax('POST', '@/reuse/buyScene/delete', {
        //                 uuids: tr.uuids
        //             }).then(res => {
        //                 Util.alert(res.msg || '删除成功', {
        //                     type: 'success'
        //                 })
        //                 that.reloadTableData()
        //             }, error => {
        //                 Util.alert(error.msg || '删除失败', {
        //                     type: 'error'
        //                 })
        //             })
        //         }
        //     }
        // })
    }
    //场次报名
    handleToJoin = (tr) => {
        if (!tr.sceneId) return;
        window.open(systemConfigPath.jumpPage('/desk/bidJoin/' + tr.sceneId))
    }

    //撤销报名
    handleToCancle = (tr) => {
        this.setState({
            cancleVisible: true,
            cancleData: tr,
        })
    }
    //撤销报名-确定
    cancleOk = () => {
        const cancleData = this.state.cancleData;
        const that = this;

        if (cancleData.uuids) {
            this.props.form.validateFields((errors, values) => {
                if (!errors) {
                    api.ajax('POST', '@/reuse/buyScene/cancelSign', {
                        uuids: cancleData.uuids,
                        cancelReason: values.cancelReason
                    }).then(res => {
                        Util.alert(res.msg || '撤销成功', {
                            type: 'success'
                        })
                        that.reloadTableData()
                        that.setState({
                            cancleVisible: false,
                            cancleData: {},
                        })
                    }, error => {
                        Util.alert(error.msg || '撤销失败', {
                            type: 'error'
                        })
                    })
                }
            })
        }
    }
    //缴纳保证金
    handleToPayBond = (tr) => {
        if (!tr.sceneId) return;
        window.open(systemConfigPath.jumpPage('/buy/sceneBond/' + tr.sceneId))
    }
    //报价
    handleToOffer = (tr, bool) => {
        if (!tr.sceneId) return;
        if (bool) {
            api.ajax('get', '@/reuse/sceneOffer/offerCheck', {
                sceneId: tr.sceneId
            }).then(res => {
                window.open(systemConfigPath.jumpPage('/desk/bidHall/' + tr.sceneId))
            }).catch(error => {
                Util.alert(error.msg, {
                    type: 'error'
                })
            })
        } else {
            window.open(systemConfigPath.jumpPage('/desk/bidHall/' + tr.sceneId))
        }

    }
    //查看订单
    handleToOrder = (tr) => {
        if (!tr.sceneId) return;
        window.open(systemConfigPath.jumpPage('/buy/order/' + tr.sceneId))
    }

    handleFilter = (p, isSend = true) => {
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

        if (isSend && p.is_export === undefined) {
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

    render() {
        const { getFieldProps } = this.props.form;

        return (
            <div className={less.buyscene}>
                <BaseForm formList={this.state.formList}
                    ref='BaseForm'
                    importantFilter={this.importantFilter}
                    filterSubmit={this.handleFilter}></BaseForm>
                <Card className="mt10" bordered={false}>
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_BID} tabChange={this.tabChange}>
                        <AuthButton onClick={this.exportPage}>导出</AuthButton>
                    </BaseTabs>
                    <BaseTable
                        scroll={{ x: 2000 }}
                        url='@/reuse/buyScene/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
                <Form>
                    <Modal
                        visible={this.state.cancleVisible}
                        onOk={this.cancleOk}
                        onCancel={() => { this.setState({ cancleVisible: false }) }}
                        title={
                            <span>
                                <Icon className={less.question} type="question-circle" />
                                确定要撤销报名吗？
                            </span>
                        }>
                        <div className={less.cancle}>
                            <FormItem label="撤销理由">
                                <Input
                                    type="textarea"
                                    {...getFieldProps('cancelReason', {
                                        rules: [
                                            { required: true, message: '请输入撤销理由' },
                                        ]
                                    })}
                                    maxLength={200}
                                    placeholder="请输入撤销理由"
                                    autosize={{ minRows: 8, maxRows: 8 }}></Input>
                            </FormItem>
                        </div>
                    </Modal>
                </Form>
                <Modal
                    title={this.state.title_cc}
                    visible={this.state.visible_cc}
                    onOk={this.state.item_cc.cb}
                    onCancel={() => { this.setState({ visible_cc: false }) }}
                >
                    <h3 className="mb20" style={{ wordBreak: 'break-all' }}><Icon type={this.state.type.type} style={this.state.type.style} />{this.state.tip_cc}</h3>
                    <div style={{ paddingLeft: '34px' }}>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>竞价场次：<span className='text_top'>{this.state.item_cc.sceneCode}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>场次名称：<span className='text_top'>{this.state.item_cc.sceneTitle}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>销售单位：<span className='text_top'>{this.state.item_cc.saleCompanyName}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>销售部门：<span className='text_top'>{this.state.item_cc.saleDeptName}</span></p>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(BuyScene)
