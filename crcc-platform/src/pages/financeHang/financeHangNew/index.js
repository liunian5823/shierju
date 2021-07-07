import { Card, Button, Table, Switch, message, Tabs, Modal, Form, Input } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import AuthButton from '@/components/authButton';
import BaseTableNew from '@/components/baseTableNew'
import { exportFile } from '@/utils/urlUtils';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { connect } from 'react-redux';
import { getUrlByParam, getUrlByParamNew, getQueryString } from '@/utils/urlUtils';
import { systemConfig, systemConfigPath } from '@/utils/config/systemConfig'
import { NumberFormat } from '@/components/content/Format'
import less from './index.less';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const FormItem = Form.Item;
class financeHang extends React.Component {
    state = {
        loading: false,
        tableState: 0,
        visible: false,
        //列表中是否展示复选框
        haveSelection: true,
        modeData: [],
        id: '',
        auditMas: '',//备注信息
        acceptTip: {},
        handleTip: {},
        disabled: false
    }
    activeTab = '3';//当前激活的tab
    _isMounted = false;

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    importantFilter = ['inAcctIdName', 'inAcctId']

    formList = [
        {
            type: 'INPUT',
            field: 'inAcctIdName',
            label: '来款账户名',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'inAcctId',
            label: '来款账号',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'note',
            label: '来款附言',
            placeholder: '请输入'
        },
        {
            type: 'RANGE',
            field: 'acctDate',
            label: '来款时间',
            placeHolder: '请选择'
        },
        {
            type: 'INPUT',
            field: 'inAmount',
            label: '来款金额',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'bankName',
            label: '来款银行',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'settlementNo',
            label: '结算单编号',
            placeholder: '请输入',
        },
        {
            type: 'SELECT',
            field: 'type',
            label: '处理方式',
            placeholder: '请选择',
            list: [{ id: 1, value: '退款' }, { id: 2, value: '匹配订单' }]
        },

        {
            type: 'INPUT',
            field: 'createUser',
            label: '处理人',
            placeholder: '请输入名字/编号/手机号',
        },
        {
            type: 'RANGE',
            field: 'createTime',
            label: '处理时间',
            placeHolder: '请选择'
        },
        {
            type: 'INPUT',
            field: 'reviewUser',
            label: '审核人',
            placeholder: '请输入名字/编号/手机号',
        },
        {
            type: 'SELECT',
            field: 'checkStatus',
            label: '审核结果',
            placeholder: '请选择',
            list: [{ id: 1, value: '通过' }, { id: 2, value: '驳回' }]
        }
    ]

    handleFilter = (p, isSend = true) => {
        console.log('9990', p)
        let createTimeStart, createTimeEnd, acctDateStart, acctDateEnd;
        if (p.acctDate) {
            acctDateStart = p.acctDate[0] ? moment(p.acctDate[0]).format('YYYY-MM-DD') : '';
            acctDateEnd = p.acctDate[1] ? moment(p.acctDate[1]).format('YYYY-MM-DD') : '';
            //delete p.acctDate
        }
        if (p.createTime) {
            createTimeStart = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD') : '';
            createTimeEnd = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD') : '';
        }
        delete p["acctDate"];
        delete p["createTime"];

        this.baseParams = {
            ...this.baseParams,
            ...p,
            createTimeStart,
            createTimeEnd,
            acctDateStart,
            acctDateEnd
        }
        if (isSend) {
            console.log('调用了了');
            this.reloadTableData();
        }
    }

    baseParams = {
        accountState: undefined
    }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }

    reloadTableData(state = 1) {
        let key = this.activeTab;
        this.handelToLoadTable(state, 'tableState' + key);
    }

    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }

    remark = (record) => {
        this.setState({
            visible: true,
            id: record.financeId

        });
    }
    remarkOk = () => {
        // this.setState({
        //   visible: false,
        // });
        if (!this.state.auditMas) {
            message.error('请输入备注信息')
        } else {
            api.ajax('GET', '@/platform/financehang/updateUserRemarks', {
                id: this.state.id,
                userRemarks: this.state.auditMas
            }).then(r => {
                if (r.code == 200) {
                    message.success(r.msg)
                    // location.reload();
                }

                this.setState({
                    auditMas: r.data,
                    visible: false,
                })
            }).catch(err => {

            })
        }
    }
    remarkCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    //处理状态码
    stausToRes = (text) => {
        if (!text) {
            return;
        }
        let color = '';
        switch (text) {
            case '待受理':
                color = '#fad05d';
                break;
            case '待处理':
                color = '#64d3ff';
                break;
            case '审核中':
                color = '#fad05d';
                break;
            case '系统处理中':
                color = '#fad05d';
                break;
            case '驳回':
                color = 'red';
                break;
            case '处理完成':
                color = '#b1e876';
                break;
        }
        return color;
    };
    //付款方式
    payFlags = (status) => {
        if (!status) {
            return '-';
        }
        let tempStatus = '';
        switch (status) {
            case 3:
                tempStatus = '汇款转账';
                break;
            case 4:
                tempStatus = '共享中心';
                break;
            case 5:
                tempStatus = '铁建银信';
                break;
            default:
                tempStatus = '其他';
                break;
        }
        return tempStatus;

    }
    //审批结果
    checkStatusToRes = (status) => {
        if (!status) {
            return;
        }
        let tempStatus = '';
        switch (status) {
            case 1:
                tempStatus = '待复核';
                break;
            case 2:
                tempStatus = '通过';
                break;
            case 3:
                tempStatus = '驳回';
                break;
            case 4:
                tempStatus = '无需复核';
                break;
            default:
                break;
        }
        return tempStatus;

    }
    //处理结果
    typeToRes = (status) => {
        if (!status) {
            return;
        }
        let tempStatus = '';
        switch (status) {
            case 1:
                tempStatus = '退款';
                break;
            case 3:
                tempStatus = '匹配结算单';
                break;
            default:
                break;
        }
        return tempStatus;

    }

    checkToRes = (status) => {
        if (!status) {
            return;
        }
        let checkStatus = '';
        switch (status) {
            case 1:
                checkStatus = '审核中';
                break;
            case 3:
                checkStatus = ['审核中', '(驳回)'];
                break;
            default:
                break;
        }
        return checkStatus;

    }

    release = (record) => {
        confirm({
            title: '您是否确认释放处理',
            placement: "topRight",
            onOk() {
                api.ajax("GET", "@/platform/financehang/release", { id: record.financeId, workOrdersId: record.workOrdersId }
                    // uuids:getQueryString("uuids")
                ).then((r) => {
                    if (r.code != 200) {
                        message.error(r.msg)
                    } else {
                        message.success(r.msg)
                        this.timerEnd = setTimeout(() => {
                            window.location.reload();
                        }, 500)
                    }
                    //     this.setState({
                    //     release: r.data
                    // })
                })
            }
        })


    }

    accept = (record) => {
        confirm({
            title: '您是否确认受理',
            placement: "topRight",
            onOk() {
                let params = {}
                params.id = record.financeId
                params.workOrdersId = record.workOrdersId
                // console.log('888888888',lists.includes(false))
                // if(lists.includes(false)){
                api.ajax("GET", "@/platform/financehang/financeAccept", params
                    // uuids:getQueryString("uuids")
                ).then((r) => {
                    if (r.code == 200) {
                        message.success('受理成功')
                        setTimeout(() => {
                            window.open(systemConfigPath.jumpPage(getUrlByParamNew(`/financialCenter/handleFinanceHangNew/${record.workOrdersId}/${record.financeId}`)));
                        }, 1000)
                    }
                    this.setState({
                        financeAccept: r.data
                    })
                }).catch((err) => {
                    if (err.code == 40000) {
                        message.error(err.msg)
                    }
                })
            }
        })

    }
    allRelease = () => {
        console.log('-----------', this.state.modeData)
        let modeDatas = this.state.modeData
        let options = {}
        let batchRelaseVos = []
        let obj = {}
        if (this.state.modeData.length <= 0) {
            Util.alert("未选中任何值");
            return;
        } else {
            confirm({
                title: '您是否确认批量释放',
                placement: "topRight",
                onOk() {
                    modeDatas.map((item, index) => {

                        obj = `{"financeId":${item.financeId},"workOrdersId":${item.workOrdersId}}`
                        obj = JSON.parse(obj)
                        batchRelaseVos.push(obj)


                    })
                    options = { batchRelaseVos: batchRelaseVos }
                    api.ajax("POST", "@/platform/financehang/batchRelease", options
                        // uuids:getQueryString("uuids")
                    ).then((r) => {
                        if (r.code != 200) {
                            message.error(r.msg)
                        } else {
                            message.success(r.msg)
                            this.timerEnd = setTimeout(() => {
                                window.location.reload();
                            }, 500)
                        }
                        //       this.setState({
                        //       release: r.data
                        //   })
                    })
                }
            })
        }



    }
    //设置被选中的列表项
    setSelectedItems = (items, index) => {

        this.setState({
            modeData: items
        })
        // this.state.modeData = items;
        // console.log('&&&&&&&',items)
    }

    rowSelection = () => {

    }


    //全部
    columns3 = () => {
        return [
            {
                title: '工单号',
                dataIndex: 'workOrdersCode',
                key: 'workOrdersCode',
                width: 200,
                sorter: true,
                render: (text, record, index) => {
                    return <span title={text}>{text ? text : '-'}</span>
                }
            },
            {
                title: '结算单号',
                dataIndex: 'settlementNo',
                key: 'settlementNo',
                sorter: true,
                width: 160
            },
            {
                title: '来款账户名称',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                sorter: true,
                width: 200,
                render: (text, record) => {
                    return <span style={{ width: "200px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                sorter: true,
                width: 160,
                render: (text, record) => {
                    return <span style={{ width: "150px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款金额(元)',
                dataIndex: 'inAmount',
                key: 'inAmount',
                sorter: true,
                width: 130,
                render: (text, record, index) => (
                    <p>
                        <span title={text}>{text ? <NumberFormat value={text} /> : "-"}</span>
                    </p>
                )
            },
            {
                title: '疑似单数',
                dataIndex: 'num',
                key: 'num',
                sorter: true,
                width: 100,
                render: (text, record) => {
                    return <span style={{ width: "100px" }} className={less.plat_table_text} title={text}>{text || text == 0 ? text : '-'}</span>
                }
            },
            {
                title: '来款附言',
                dataIndex: 'note',
                key: 'note',
                sorter: true,
                width: 200,
                render: (text, record) => {
                    return <span style={{ width: "200px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '处理状态',
                dataIndex: 'statusStr',
                key: 'statusStr',
                sorter: true,
                width: 100,
                render: (text, record) => {
                    if (!text) {
                        return '--';
                    }
                    let statusStr = this.stausToRes(text);
                    if (text == '驳回') {
                        return (
                            <div>
                                <p style={{ color: '#fad05d' }}>待处理</p>
                                <p style={{ width: "200px", color: 'red' }} title={text}>{`(驳回)`}</p>
                            </div>
                        )
                    } else {
                        return <span style={{ width: "200px", color: `${statusStr}` }} title={text}>{text}</span>
                    }

                }
                //     render: (text,record)=>{
                //         if(!text){
                //             return '--'
                //         }
                //         console.log('9999999999',text)
                //         let statusStr = this.stausToRes(text);
                //         let checkStr = this.checkToRes(record.checkStatus)
                //         let color;
                //         let topColor;
                //         if(record.checkStatus != 1 && record.checkStatus!=3){
                //             switch (statusStr){
                //                 case '待受理':
                //                     color = '#fad05d';
                //                     break;
                //                 case '待处理':
                //                     color = '#64d3ff';
                //                     break;
                //                 case '审核中':
                //                     color = '#fad05d';
                //                     break;
                //                 case '系统处理中':
                //                     color = '#fad05d';
                //                     break;
                //                 case '已完成':
                //                     color = '#b1e876';
                //                     break;
                //             }
                //             return (<div>
                //                 <p style={{color: `${color}`}}>{statusStr}</p>
                //             </div>)
                //         }else{
                //             if (checkStr instanceof Array) {
                //                 switch (checkStr[0]) {
                //                   case '审核中':
                //                     topColor = '#fad05d';
                //                     break;
                //                 }
                //                 if (checkStr[1] == '(驳回)') {
                //                     color = checkStr[1] ? 'red' : '';
                //                   }
                //                   return (
                //                     <div>
                //                       <p style={{ color: `${topColor}` }}>{checkStr[0]}</p>
                //                       <p style={{ color: `${color}` }}>{checkStr[1]}</p>
                //                     </div>
                //                   );
                //             }else{
                //                 console.log('kfkkkkkk',checkStr)
                //                 let singleColor;
                // switch (checkStr) {
                //   case '审核中':
                //     singleColor = '#fad05d';
                //     break;
                // }
                // return <p style={{ color: `${singleColor}` }}>{checkStr}</p>;
                //             }

                //         }   
                // }
            },
            {
                title: '来款时间',
                dataIndex: 'acctDate',
                key: 'acctDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                    <div>
                        <span title={text ? moment(text).format('YYYY-MM-DD') : "-"}>{text ? moment(text).format('YYYY-MM-DD') : "-"}</span>
                    </div>
                )
            },
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                sorter: true,
                width: 200,
                render: (text, record) => {
                    return <span style={{ width: "180px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '付款方式',
                dataIndex: 'payFlag',
                key: 'payFlag',
                sorter: true,
                width: 100,
                render: (text, record) => {
                    if (!text) {
                        return '--'
                    }
                    let statusStr = this.payFlags(text);
                    return <p>{statusStr}</p>
                }
            },
            {
                title: '受理人',
                dataIndex: 'acceptorUsername',
                key: 'acceptorUsername',
                sorter: true,
                width: 130
            },
            {
                title: '受理时间',
                dataIndex: 'acceptTime',
                key: 'acceptTime',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                    <div>
                        <span title={text ? moment(text).format('YYYY-MM-DD') : "-"}>{text ? moment(text).format('YYYY-MM-DD') : "-"}</span>
                        <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p>
                    </div>
                )
            },
            {
                title: '处理时间',
                dataIndex: 'handlerDate',
                key: 'handlerDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                    <div>
                        <span title={text ? moment(text).format('YYYY-MM-DD') : "-"}>{text ? moment(text).format('YYYY-MM-DD') : "-"}</span>
                        <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p>
                    </div>
                )
            },
            {
                title: '处理结果',
                dataIndex: 'type',
                key: 'type',
                sorter: true,
                width: 130,
                render: (text, record) => {
                    if (!text) {
                        return '--'
                    }
                    let checkStr = this.typeToRes(text)
                    return <p>{checkStr}</p>
                }
            },
            {
                title: '审批人',
                dataIndex: 'approvalName',
                key: 'approvalName',
                sorter: true,
                width: 130
            },
            {
                title: '审批时间',
                dataIndex: 'approvalTime',
                key: 'approvalTime',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                    <div>
                        <span title={text ? moment(text).format('YYYY-MM-DD') : "-"}>{text ? moment(text).format('YYYY-MM-DD') : "-"}</span>
                        <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p>
                    </div>
                )
            },
            {
                title: '审批结果',
                dataIndex: 'checkStatus',
                key: 'checkStatus',
                sorter: true,
                width: 200,
                render: (text, record) => {
                    if (!text) {
                        return '--'
                    }
                    let checkStr = this.checkStatusToRes(text)
                    return <p>{checkStr}</p>
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'right',
                width: 150,
                render: (text, record) => {
                    // <p style={{width: "134px"}}>
                    //     <a onClick={this.detail.bind(this, record.id)}>查看</a>
                    // </p>
                    let address = [];
                    if (record.statusStr == '待处理' && record.approvalId == this.props.userInfo.id) {
                        address = ['查看详情', '处理', '释放', '备注']
                    } else if (record.statusStr == '待受理') {
                        address = ['查看详情', '受理', '备注']
                    } else if (record.statusStr == '驳回') {
                        address = ['查看详情', '处理', '释放', '备注']
                    } else if (record.approvalId != this.props.userInfo.id) {
                        address = ['查看详情', '备注']
                    } else {
                        address = ['查看详情', '备注']
                    }
                    return (

                        <div>
                            { address instanceof Array ?
                                (address.map((item, index) => {
                                    return (
                                        <p key={index}>
                                            <AuthButton
                                                elmType="a"
                                                href="javascript:;"
                                                onClick={(e) => {
                                                    this.doAnyChange(e, record);
                                                }}
                                            >
                                                {item}
                                           
                                            </AuthButton>
                                        </p>
                                    );
                                })) : (
                                    <div>
                                        <AuthButton 
                                            elmType="a"
                                            href="javascript:;"
                                            onClick={(e) => {
                                                this.doAnyChange(e, record);
                                            }}
                                        >
                                            {tempStatus}
                                        
                                        </AuthButton>
                                    </div>
                                )}
                        </div>
                    );
                }
            }
        ]
    }


    // //导出
    // exportExcel = () => {
    //     let key = this.activeTab;
    //     if (1 == key) {
    //         //待处理
    //         this.baseParams.accountState = 5
    //     } else if (2 == key) {
    //         //待处理
    //         this.baseParams.accountState = 1
    //     } else if (3 == key) {
    //         //已处理/已完成
    //         this.baseParams.accountState = 4
    //     } else if (4 == key) {
    //         //全部
    //         this.baseParams.accountState = undefined
    //     } else if (5 == key) {
    //         // 系统处理中
    //         this.baseParams.accountState = 3
    //     } else if (6 == key) {
    //         //审核中
    //         this.baseParams.accountState = 2
    //     }
    //     exportFile("/financial/financeHang/exportExcel", this.baseParams);
    // }
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
                // options.page = pageinfo.current;
                // options.pageSize = pageinfo.pageSize;
                //const url = getUrlByParam('/platform/settlement/exportPageAccount', options);
                const url = getUrlByParam('/platform/settlement/exportPageAccount', options);
                location.href = systemConfigPath.axiosUrl(url);
            },
        );
    }
    //跳转
    doAnyChange(e, record) {
        switch (e.target.innerText) {
            case '查看详情':
                // this.props.history.push(getUrlByParam("/financialCenter/detailFinanceHangNew", record.workOrdersId));
                // this.props.history.push(`/financialCenter/detailFinanceHangNew/${record.workOrdersId}/${record.financeId}`);
                window.open(systemConfigPath.jumpPage(getUrlByParamNew(`/financialCenter/detailFinanceHangNew/${record.workOrdersId}/${record.financeId}`)));
                break;
            case '受理':
                // this.props.history.push(getUrlByParam("/financialCenter/acceptance", record.workOrdersId));
                // this.props.history.push(`/financialCenter/acceptance/${record.workOrdersId}/${record.financeId}`);

                api.ajax("GET", "@/platform/financehang/acceptTip", {
                    workOrdersId: record.workOrdersId
                }
                    // uuids:getQueryString("uuids")
                ).then((r) => {
                    if (!this._isMounted) {
                        return;
                    }
                    this.setState({
                        acceptTip: r
                    })
                    if (r.code == 200) {
                        // window.open(systemConfigPath.jumpPage(getUrlByParamNew(`/financialCenter/acceptance/${record.workOrdersId}/${record.financeId}`)));
                        this.accept(record)
                    } else {

                    }
                }).catch((err) => {
                    if (err.code == 40000) {
                        message.error(err.msg)
                    }
                })


                break;
            case '处理':
                // this.props.history.push(`/financialCenter/handleFinanceHangNew/${record.workOrdersId}/${record.financeId}`);
                api.ajax("GET", "@/platform/financehang/handleTip", {
                    id: record.financeId
                }
                    // uuids:getQueryString("uuids")
                ).then((r) => {
                    if (!this._isMounted) {
                        return;
                    }
                    this.setState({
                        handleTip: r
                    })
                    if (r.code == 200) {
                        window.open(systemConfigPath.jumpPage(getUrlByParamNew(`/financialCenter/handleFinanceHangNew/${record.workOrdersId}/${record.financeId}`)));

                    } else {

                    }
                }).catch((err) => {
                    if (err.code == 4000) {
                        message.error(err.msg)
                    }
                })


                break;
            case '释放':
                api.ajax("GET", "@/platform/financehang/getWorkOrdersState", {
                    workOrdersId: record.workOrdersId
                }
                    // uuids:getQueryString("uuids")
                ).then((r) => {
                    if (!this._isMounted) {
                        return;
                    }
                    if (r.code == 200) {
                        if(r.data.workOrdersState ==1 || r.data.workOrdersState ==2 || r.data.workOrdersState ==4 || r.data.workOrdersState ==6){
                            message.error('工单状态已经改变，请刷新后重试!')
                        }else{
                            this.release(record)
                        }

                    }
                }).catch((err) => {
                    if (err.code == 4000) {
                        message.error(err.msg)
                    }
                })
               
                break;
            case '备注':
                this.remark(record)
                break;
            default:
                break;
        }
        // console.log(record.uuids, '-------');
        // this.props.history.push(`/regdetail/${record.uuids}`);
    }

    //处理
    // handle = (id) => {
    //     let params = {};
    //     params.id = id
    //     this.props.history.push(getUrlByParam("/financialCenter/handleFinanceHangNew", params));
    // }
    // acceptance=(workOrdersId)=>{
    //     let params = {};
    //     params.workOrdersId = workOrdersId
    //     this.props.history.push(getUrlByParam("/financialCenter/acceptance", params));
    // }

    //查看
    // detail = (id) => {
    //     let params = {};
    //     params.id = id
    //     this.props.history.push(getUrlByParam("/financialCenter/detailFinanceHangNew", params));
    // }

    //tabs切换事件
    onTabsChange = (key) => {
        if (1 == key) {
            //待处理
            this.baseParams.accountState = 1
        } else if (2 == key) {
            //已处理
            this.baseParams.accountState = 4
        } else if (3 == key) {
            //全部
            this.baseParams.accountState = undefined
        } else if (4 == key) {
            // 系统处理中
            this.baseParams.accountState = 3
        } else if (5 == key) {
            //审核中
            this.baseParams.accountState = 2
        }
        else if (6 == key) {
            //待受理
            this.baseParams.accountState = 5
        }
        this.activeTab = key;
        this.reloadTableData();
    }
    onChange = (event, name, isNumber = null) => {
        //进行限制
        if (isNumber) {
            if (event.target.value) {
                // event.target.value = event.target.value.replace(/[^\d]/g,'');
                if (event.target.value.length == 1) {
                    event.target.value = event.target.value.replace(/[^1-9]/g, '');
                } else {
                    event.target.value = event.target.value.replace(/\D/g, '');
                }
                if (event.target.value > 999999999)
                    event.target.value = 999999999
            }
        }
        this.state[name] = event.target.value;
        this.setState(this.state);
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        };

        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter}
                        filterSubmit={this.handleFilter}></BaseForm>
                    <div className="exporttoolbarHang" style={{ textAlign: "right" }}>
                    <AuthButton type="primary" onClick={this.allRelease} style={{ position: "relative", top: "26px", zIndex: "99", marginRight: '15px' }}>批量释放</AuthButton>
                    <AuthButton type="primary" onClick={this.export} style={{ position: "relative", top: "26px", zIndex: "99" }}>导出</AuthButton>
                    </div>
                    <Tabs defaultActiveKey="3" onChange={this.onTabsChange}>
                        <TabPane tab="全部" key="3">
                            <BaseTable
                                url='@/platform/financehang/findFinanceHangForPage'
                                tableState={this.state.tableState3}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState3')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns3()}
                                scroll={{ x: 2500 }}
                            />
                        </TabPane>
                        <TabPane tab="待受理" key="6">
                            <BaseTable
                                url='@/platform/financehang/findFinanceHangForPage'
                                tableState={this.state.tableState6}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState6')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns3()}
                                scroll={{ x: 1400 }}
                            />
                        </TabPane>
                        <TabPane tab="待处理" key="1">
                            <BaseTableNew

                                url='@/platform/financehang/findFinanceHangForPage'
                                tableState={this.state.tableState1}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState1')
                                }}
                                baseParams={this.baseParams}
                                haveSelection={this.state.haveSelection}
                                setSelectedItems={this.setSelectedItems}
                                columns={this.columns3()}
                                scroll={{ x: 1400 }}
                            />
                        </TabPane>
                        <TabPane tab="审核中" key="5">
                            <BaseTable
                                url='@/platform/financehang/findFinanceHangForPage'
                                tableState={this.state.tableState5}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState5')
                                }}
                                baseParams={this.baseParams}
                                // haveSelection={this.state.haveSelection}
                                // setSelectedItems={this.setSelectedItems}
                                columns={this.columns3()}
                                scroll={{ x: 1400 }}
                            />
                        </TabPane>
                        <TabPane tab="系统处理中" key="4">
                            <BaseTable
                                url='@/platform/financehang/findFinanceHangForPage'
                                tableState={this.state.tableState4}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState4')
                                }}
                                baseParams={this.baseParams}
                                // haveSelection={this.state.haveSelection}
                                // setSelectedItems={this.setSelectedItems}
                                columns={this.columns3()}
                                scroll={{ x: 2800 }}
                            />
                        </TabPane>
                        <TabPane tab="已处理/已完成" key="2">
                            <BaseTable
                                url='@/platform/financehang/findFinanceHangForPage'
                                tableState={this.state.tableState2}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState2')
                                }}
                                baseParams={this.baseParams}
                                // haveSelection={this.state.haveSelection}
                                // setSelectedItems={this.setSelectedItems}
                                columns={this.columns3()}
                                scroll={{ x: 2200 }}
                            />
                        </TabPane>


                    </Tabs>
                </Card>
                <Modal title="备注" visible={this.state.visible}
                    onOk={this.remarkOk} onCancel={this.remarkCancel} okText='保存'
                >
                    <FormItem   {...formItemLayout} label="备注信息">
                        {/* <Input  type="textarea" maxLength='400' rows={5} value={this.state.auditMas} onChange={(e)=>this.onChange(e,"auditMas")}/> */}
                        <Input type="textarea" maxLength='400' rows={5} value={this.state.auditMas} onChange={(e) => this.onChange(e, "auditMas")} />
                    </FormItem>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    }
}
Form.create({})(financeHang)
export default connect(mapStateToProps)(Form.create({})(financeHang));

// export default financeHang;