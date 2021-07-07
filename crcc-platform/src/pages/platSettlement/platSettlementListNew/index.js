import { Card, Table, Button, Modal, Tabs, Form } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import { NumberFormat } from '@/components/content/Format'
import { getQueryString, getUrlByParam } from '@/utils/urlUtils';
import { systemConfigPath } from '@/utils/config/systemConfig';
import AuthButton from '@/components/authButton';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns'
import less from "./index.less";
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class PlatSettlementList extends React.Component {
    _isMounted = false

    state = {
        loading: false,
        visible: false,
        tableState1: 0,
        tableState2: 0,
        tableState3: 0,
        pageinfo: { current: 1, pageSize: 10 }
    }

    bulletinInfo = ""
    activeTab = 1;

    componentWillMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    //获取页数
    returnPage = (pageinfo) => {
        this.setState({ pageinfo })
    }
    returnPage = (pageinfo) => {
        console.log('pageinfo', pageinfo);
    }
    //处理状态码
    stausToRes = (status) => {
        if (!status) {
            return;
        }
        let tempStatus = '';
        switch (status) {
            case 21:
                tempStatus = ['结算中', '(付款中)'];
                break;
            case 20:
                tempStatus = '结算中';
                break;
            case 50:
                tempStatus = '结算完成';
                break;
            case 60:
                tempStatus = '作废';
                break;
            default:
                break;
        }
        return tempStatus;
    };
    withdrawToRes = (status) => {
        if (!status) {
            return;
        }
        let tempStatus = '';
        switch (status) {
            case 10:
                tempStatus = '不可提现';
                break;
            case 11:
                tempStatus = ['不可提现', '(冻结中)'];
                break;
            case 20:
                tempStatus = ['待提现', '(已解冻)'];
                break;
            case 30:
                tempStatus = '已提现';
                break;
            default:
                break;
        }
        return tempStatus;
    };
    payStaus = (status) => {
        if (!status) {
            return;
        }
        let tempStatus = '';
        switch (status) {
            case 1:
                tempStatus = '网银支付';
                break;
            case 2:
                tempStatus = '资金账户余额';
                break;
            case 3:
                tempStatus = '汇款转账';
                break;
            case 4:
                tempStatus = '共享中心付款';
                break;
            case 5:
                tempStatus = '铁建银信';
                break;
            case 6:
                tempStatus = '其他';
                break;
            default:
                break;
        }
        return tempStatus;
    }

    /**查询条件 */
    importantFilter = ['orderNo', 'payTimeArr']

    formList = [
        {
            type: 'INPUT',
            field: 'orderNo',
            label: '订单号',
            placeholder: '请输入订单号',
        },
        {
            type: 'RANGE',
            field: 'payTimeArr',
            label: '结算日期',
            placeHolder: '请选择'
        },
        {
            type: 'INPUT',
            field: 'settlementNo',
            label: '结算单号',
            placeholder: '请输入结算单号'
        },
        {
            type: 'INPUTNUMBER',
            field: 'orderNum',
            label: '订单数量',
            placeholder: '请输入订单数量'
        },
        {
            type: 'SELECT',
            field: 'organizationId',
            label: '结算项目',
            placeholder: '请选择',
            list: [{ id: 0, value: '旧系统结算' }, { id: 1, value: '货款' }, { id: 2, value: '质保金' }]
        },
        {
            type: 'INPUT',
            field: 'withdrwaUserName',
            label: '提款人',
            placeholder: '请输入姓名'
        },
        {
            type: 'INPUT',
            field: 'buyerCompanyName',
            label: '采购单位',
            placeholder: '请输入采购单位'
        },
        {
            type: 'SELECT',
            field: 'status',
            label: '结算单状态',
            placeholder: '全部',
            list: [{ id: 21, value: '结算中(付款中)' }, { id: 60, value: '作废' }, { id: 20, value: '结算中' }, { id: 50, value: '结算完成' }],
        },
        {
            type: 'SELECT',
            field: 'withdrawStatus',
            label: '提款状态',
            placeholder: '全部',
            list: [{ id: 10, value: '不可提现' }, { id: 11, value: '不可提现（冻结中）' }, { id: 20, value: '待提现（已解冻）' }, { id: 30, value: '已提现' }],
        },
        {
            type: 'INPUT',
            field: 'createUserName',
            label: '创建人',
            placeholder: '请输入姓名'
        },
        {
            type: 'INPUT',
            field: 'amount',
            label: '结算金额',
            placeholder: '请输入金额',
            // className:'less.text_align_right',
        },
        {
            type: 'RANGE',
            field: 'withdrawDateArr',
            label: '提款日期',
            placeHolder: '请选择'
        },
        {
            type: 'RANGE',
            field: 'createTimeArr',
            label: '创建日期',
            placeHolder: '请选择'
        }
    ]
    handleFilter = (params, isSend = true) => {
        let createTimeStart, createTimeEnd, finishTimeStart, finishTimeEnd, withdrawStartDate, withdrawEndDate;

        if (params.createTimeArr) {
            createTimeStart = params.createTimeArr[0] ? moment(params.createTimeArr[0]).format('YYYY-MM-DD') : '';
            createTimeEnd = params.createTimeArr[1] ? moment(params.createTimeArr[1]).format('YYYY-MM-DD') : '';
        }
        if (params.payTimeArr) {
            finishTimeStart = params.payTimeArr[0] ? moment(params.payTimeArr[0]).format('YYYY-MM-DD') : '';
            finishTimeEnd = params.payTimeArr[1] ? moment(params.payTimeArr[1]).format('YYYY-MM-DD') : '';
        }

        if (params.withdrawDateArr) {
            withdrawStartDate = params.withdrawDateArr[0] ? moment(params.withdrawDateArr[0]).format('YYYY-MM-DD') : '';
            withdrawEndDate = params.withdrawDateArr[1] ? moment(params.withdrawDateArr[1]).format('YYYY-MM-DD') : '';
        }

        delete params["createTimeArr"];
        delete params["payTimeArr"];
        delete params["withdrawDateArr"];

        let key = this.activeTab;

        key = 1;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            createTimeStart,
            createTimeEnd,
            finishTimeStart,
            finishTimeEnd,
            withdrawStartDate,
            withdrawEndDate
        }

        key = 2;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            createTimeStart,
            createTimeEnd,
            finishTimeStart,
            finishTimeEnd,
            withdrawStartDate,
            withdrawEndDate
        }

        key = 3;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            createTimeStart,
            createTimeEnd,
            finishTimeStart,
            finishTimeEnd,
            withdrawStartDate,
            withdrawEndDate
        }
        console.log('this.baseParams', this.baseParams);
        this.baseParams = {
            ...this.baseParams,
            ...params,
        }
        console.log('this.baseParams', this.baseParams);
        if (isSend) {
            this.reloadTableData();
        }
    }
    showExportModal = () => {
        this.setState({ visible: true })
    }
    //导出
    export = (type) => {
        let options = {};
        let tableStatus = this.state.activeTab;
        const { pageinfo } = this.state
        this.setState(
            {
                searchList: {
                    ...options,
                },
            },
            () => {
                let searchtype = { ...this.baseParams }
                console.log('导出时的参数', searchtype);
                for (const key in searchtype) {
                    if (searchtype.hasOwnProperty(key)) {
                        const element = searchtype[key];
                        if (element !== undefined) {
                            options[key] = element;
                        }
                    }
                }
                // options.tabStatus = this.state.nowActiveKey;
                options.page = pageinfo.current;
                options.pageSize = pageinfo.pageSize;
                if (type == 'order') {
                    const url = getUrlByParam('platform/settlement/exportPageOrder', options);
                    location.href = systemConfigPath.axiosUrl(url);
                } else {
                    const url = getUrlByParam('platform/settlement/exportPageSettlement', options);
                    location.href = systemConfigPath.axiosUrl(url);
                }

            },
        );
    }
    //详情
    handleToSee = (info) => {
        this.setState({
            seeVisible: true,
            seeModalInfo: info
        })
    }

    reloadTableData(state = 1) {
        let key = this.activeTab;
        this.handelToLoadTable(state, 'tableState' + key);
    }


    /*****
     *
     * baseTable组件的相关方法
     *
     * 1.baseParams //表格参数，默认可以没有
     * 2.handelToLoadTable //
     * 3.resetTable //
     * 4.columns //表头数据
     *
     * *****/
    /*    baseParams = {
        }*/

    baseParams1 = {
        // queryType: '1'
    }
    baseParams2 = {
        queryType: '2'
    }
    baseParams3 = {
        queryType: '3'
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

    handleChangeTab = (key) => {
        this.activeTab = key;
        this.reloadTableData();
    }


    //详情详情，跳转供应商详情页
    handleToDetails = (record) => {
        console.log('888', record)
        let url;
        // if(0==record.settlementType){
        //     url = "/financialCenter/purchaserSettlementDetailNew/";

        // }
        // if(1==record.settlementType){
        //     url = "/financialCenter/supplierSettlementDetailNew/";
        // }
        // url = "/financialCenter/settlementDetailNew/";
        // this.props.history.push(url + record.id)

        this.props.history.push('/financialCenter/platSettlementListNew/settlementDetailNew/'+record.id + '/' + record.uuids)
    }

    columns = [
        {
            title: '结算单号',
            dataIndex: 'settlementNo',
            key: 'settlementNo',
            width: 200,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text ? text : '-'}</span>
            }
        },
        {
            title: '采购商名称',
            dataIndex: 'buyerCompanyName',
            key: 'buyerCompanyName',
            width: 240,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text ? text : '-'}</span>
            }
        },
        {
            title: '供应商名称',
            dataIndex: 'sellerCompanyName',
            key: 'sellerCompanyName',
            width: 240,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text ? text : '-'}</span>
            }
        },
        {
            title: '项目部',
            dataIndex: 'organizationName',
            key: 'organizationName',
            width: 180,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text ? text : '-'}</span>
            }
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: 140,
            sorter: true,
            render: (text, record, index) => {
                return <div>
                    <p>{text ? text : '-'}</p>
                    <p>{record.userNo ? record.userNo : ''}</p>
                </div>
            }
        },
        {
            title: '结算单状态',
            dataIndex: 'status',
            key: 'status',
            width: 180,
            sorter: true,
            render: (text, record, index) => {
                if (!text) {
                    return '--'
                }
                let statusStr = this.stausToRes(text);
                let color;
                let topColor;
                if (statusStr instanceof Array) {
                    switch (statusStr[0]) {
                        case '结算中':
                            topColor = '#54c5f7';
                            break;
                        default:
                            break;
                    }
                    if (statusStr[1] == '(付款中)') {
                        color = statusStr[1] ? '#2DB7F5' : '';
                    }
                    return (
                        <div>
                            <p style={{ color: `${color}` }}>{statusStr[0]}</p>
                            <p style={{ color: `${topColor}` }}>{statusStr[1]}</p>
                        </div>
                    );
                } else {
                    switch (statusStr) {
                        case '结算中':
                            color = '#54c5f7';
                            break;
                        case '结算完成':
                            color = '#2fc371';
                            break;
                        case '作废':
                            color = 'red'
                    }
                    return <div >
                        <p style={{ color: `${color}` }}>{statusStr ? statusStr : '-'}</p>
                    </div>
                }

            }
        },
        {
            title: '提款状态',
            dataIndex: 'withdrawStatus',
            key: 'withdrawStatus',
            width: 180,
            sorter: true,
            render: (text, record, index) => {
                if (!text) {
                    return '--'
                }
                let statusStr = this.withdrawToRes(text);
                let topColor;
                let color;
                if (statusStr instanceof Array) {
                    switch (statusStr[0]) {
                        case '不可提现':
                            topColor = 'red';
                            break;
                        case '待提现':
                            topColor = '#2DB7F5';
                            break;
                        default:
                            break;
                    }
                    // if (statusStr[1] == '(冻结中)' || statusStr[1] == '(已解冻)') {
                    //   color = statusStr[1] ? '#ccc' : '';
                    // }
                    return (
                        <div>
                            <p style={{ color: `${topColor}` }}>{statusStr[0]}</p>
                            <p>{statusStr[1]}</p>
                        </div>
                    );
                } else {
                    let singleColor;
                    switch (statusStr) {
                        case '不可提现':
                            singleColor = 'red';
                            break;
                        case '已提现':
                            singleColor = '#f59a23';
                            break;
                        default:
                            break;
                    }
                    return <p style={{ color: `${singleColor}` }}>{statusStr ? statusStr : '-'}</p>;
                }

            }
        },
        {
            title: '制单时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '完成时间',
            dataIndex: 'finishTime',
            key: 'finishTime',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{text ? text : '-'}</span>
            }
        },
        {
            title: '订单数量',
            dataIndex: 'orderNum',
            key: 'orderNum',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '支付方式',
            dataIndex: 'payFlag',
            key: 'payFlag',
            width: 180,
            sorter: true,
            render: (text, record, index) => {
                if (!text) {
                    return '--'
                }
                let statusStr = this.payStaus(text);
                return <div >
                    {record.status == 21 ? <p>{statusStr ? statusStr : '-'}</p> :'--'}
                </div>
            }
        },
        {
            title: '支付中',
            dataIndex: 'payingAmount',
            key: 'payingAmount',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <div>
                    <span title={text}>{(text || text == 0) ? text.toFixed(2) : '-'}</span>
                </div>
            }
        },
        {
            title: '已付金额',
            dataIndex: 'paidAmount',
            key: 'paidAmount',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{(text || text == 0) ? text.toFixed(2) : '-'}</span>
            }
        },
        {
            title: '冻结中',
            dataIndex: 'frozenAmount',
            key: 'frozenAmount',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{(text || text == 0) ? text.toFixed(2) : '-'}</span>
            }
        },
        {
            title: '已提现金额',
            dataIndex: 'alreadyWithdrawableAmount',
            key: 'alreadyWithdrawableAmount',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{(text || text == 0) ? text.toFixed(2) : '-'}</span>
            }
        },
        {
            title: '未提现金额',
            dataIndex: 'withdrawableAmount',
            key: 'withdrawableAmount',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{(text || text == 0) ? text.toFixed(2) : '-'}</span>
            }
        }, {
            title: '剩余未付',
            dataIndex: 'restAmount',
            key: 'restAmount',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{(text || text == 0) ? text.toFixed(2) : '-'}</span>
            }
        },
        {
            title: '到期未付',
            dataIndex: 'dueUnpayedAmount',
            key: 'dueUnpayedAmount',
            width: 180,
            sorter: true,
            render: (text, record) => {
                return <span title={text}>{(text || text == 0) ? text.toFixed(2) : '-'}</span>
            }
        },
        {
            title: '总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 160,
            sorter: true,
            render: (text, record) => {
                if (!text && text != 0) {
                    return '-'
                }
                return <span style={{ width: 110, display: "inline-block" }} title={text}>{text ? text.toFixed(2) : '-'}</span>
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            render: (text, record) => (
                <AuthButton 
                    elmType="a"
                    onClick={this.handleToDetails.bind(this, record)}>查看详情
                </AuthButton>
            ),
            width: 80
        }
    ]

    render() {
        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <Tabs defaultActiveKey="1" onChange={this.handleChangeTab} tabBarExtraContent={<AuthButton type="primary" onClick={() => { this.showExportModal() }}>导出</AuthButton>}>
                        <TabPane tab="全部" key="1">
                            <BaseTable
                                url="@/platform/settlement/findSettlementForPage"
                                tableState={this.state.tableState1}
                                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                                baseParams={this.baseParams1}
                                columns={this.columns}
                                scroll={{ x: 2000 }}
                                returnPage={this.returnPage}
                            />
                        </TabPane>

                    </Tabs>
                </Card>
                <Modal
                    title='选择导出类型'
                    visible={this.state.visible}
                    onCancel={()=>{this.setState({visible:false})}}
                    footer={
                        <div>
                            <Button type='primary' onClick={() => { this.export('order') }}>按订单导出</Button>
                            <Button onClick={() => { this.export('settlement') }} style={{ backgroundColor: 'green', color: 'white' }}>按结算单导出</Button>
                        </div>
                    }
                >
                </Modal>
            </div>
        )
    }
}

export default Form.create()(PlatSettlementList);