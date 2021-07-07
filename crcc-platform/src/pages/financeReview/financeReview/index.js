import { Card, Button, Table, Switch, message, Tabs ,Modal,Form,Input} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns'
import { exportFile } from '@/utils/urlUtils';
import api from '@/framework/axios';
import { getUrlByParam, getQueryString } from '@/utils/urlUtils';
import { NumberFormat } from '@/components/content/Format'
import less from './index.less';
import AuthButton from '@/components/authButton';
import { systemConfigPath } from '@/utils/config/systemConfig';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class financeReview extends React.Component {
    state = {
        loading: false,
        tableState: 0,
        workOrdersId: '',
        getApprovalStatus: {},
        //审批按钮状态
        approvalStatus: false,
        auditMas:'',//备注信息
        pageinfo: { current: 1, pageSize: 10 }
    }
    activeTab = '1';//当前激活的tab
    _isMounted = false;

    componentWillMount() {
        this._isMounted = true;
        api.ajax("GET", "@/platform/config/getApprovalStatus", {
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            if (r.code == 200) {
                this.setState({
                    getApprovalStatus: r.data,
                    approvalStatus: r.data.approval == 1 ? true : false
                });
            }
        })
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
            list: [{ id: 1, value: '退款' }, { id: 3, value: '匹配订单' }]
        },
        {
            type: 'INPUT',
            field: 'handlerUser',
            label: '处理人',
            placeholder: '请输入处理人名字/编码/手机号',
        },
        {
            type: 'RANGE',
            field: 'handlerDate',
            label: '处理时间',
            placeHolder: '请选择'
        },
        {
            type: 'INPUT',
            field: 'reviewUser',
            label: '审核人',
            placeholder: '请输入审核人名字/编码/手机号',
        },
        {
            type: 'INPUT',
            field: 'checkStatus',
            label: '审核结果',
            placeholder: '请输入',
            list: [{ id: 1, vaue: '通过' }, { id: 2, value: '驳回' }]
        },

    ]

    handleFilter = (p, isSend = true) => {
        let createTimeStart, createTimeEnd;
        if (p.acctDate) {
            createTimeStart = p.acctDate[0] ? moment(p.acctDate[0]).format('YYYY-MM-DD') : '';
            createTimeEnd = p.acctDate[1] ? moment(p.acctDate[1]).format('YYYY-MM-DD') : '';
            //delete p.acctDate
        }
        delete p["acctDate"];

        this.baseParams = {
            ...this.baseParams,
            ...p,
            createTimeStart,
            createTimeEnd
        }
        if (isSend) {
            this.reloadTableData();
        }
    }

    baseParams = {
        // accountState: 0,
        checkStatus:1
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
    //处理状态码
    stausToRes = (status) => {
        if (!status) {
            return;
        }
        let tempStatus = '';
        switch (status) {
            case 1:
                tempStatus = '待审核';
                break;
            case 2:
                tempStatus = '通过';
                break;
            case 3:
                tempStatus = '驳回';
                break;
            case 4:
                tempStatus = '待受理';
                break;
            case 5:
                tempStatus = '待处理';
                break;
            case 6:
                tempStatus = '已完成';
                break;
            default:
                break;
        }
        // console.log('885558', tempStatus)
        return tempStatus;
    };

    //付款方式
    payFlag = (status) => {
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
    };

    //处理结果
    type = (status) => {
        if (!status) {
            return;
        }
        let tempStatus = '';
        switch (status) {
            case 1:
                tempStatus = '退款';
                break;
            case 3:
                tempStatus = '匹配';
                break;
            default:
                break;
        }
        return tempStatus;
    };
    onChange=(event,name,isNumber=null)=>{
        //进行限制
        if(isNumber){
          if(event.target.value){
            // event.target.value = event.target.value.replace(/[^\d]/g,'');
            if (event.target.value.length == 1) {
              event.target.value = event.target.value.replace(/[^1-9]/g, '');
            } else {
              event.target.value = event.target.value.replace(/\D/g, '');
            }
            if(event.target.value > 999999999)
              event.target.value = 999999999
          }
        }
        this.state[name] = event.target.value;
        this.setState(this.state);
      }

    remark=(id)=> {
        this.setState({
          visible: true,
          id:id

        });
      }
      remarkOk=()=> {
        // this.setState({
        //   visible: false,
        // });
        if(!this.state.auditMas){
            message.error('请输入备注信息')
        }else{
            api.ajax('GET','@/platform/financehang/updateUserRemarks',{
                id:this.state.id,
                userRemarks:this.state.auditMas
            }).then(r=>{
                if(r.code == 200){
                    message.success(r.msg)
                    // location.reload();
                }
                
                this.setState({
                    auditMas:r.data,
                    visible: false,
                })
            }).catch(err=>{
                
            })
        }
      }
      remarkCancel=(e)=> {
        console.log(e);
        this.setState({
          visible: false,
        });
      }

    //获取页数
    returnPage = (pageinfo) => {
        this.setState({ pageinfo })
    }
    //待审核
    columns1 = () => {
        return [
            {
                title: '工单号',
                dataIndex: 'workOrdersCode',
                key: 'workOrdersCode',
                width: 150,
                sorter: true,
                render: (text, record) => {
                    return <span style={{ width: "150px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账户名称',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 200,
                sorter: true,
                render: (text, record) => {
                    return <span style={{ width: "180px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 180,
                sorter: true,
                render: (text, record) => {
                    return <span style={{ width: "170px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款金额(元）',
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
                title: '来款附言',
                dataIndex: 'note',
                key: 'note',
                sorter: true,
                width: 130,
                render: (text, record, index) => (
                    <p>
                        <span title={text}>{text ? text: "-"}</span>
                    </p>
                )
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
                         {/* <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p> */}
                    </div>
                )
            },
            {
                title: '审批状态',
                dataIndex: 'workOrdersState',
                key: 'workOrdersState',
                sorter: true,
                width: 130,
                render: (text, record, index) => {
                    if (!text) {
                        return '--'
                    }
                    // console.log('ggg', text)
                    let statusStr = this.stausToRes(text);
                    let color;
                    switch (statusStr) {
                        case '待审核':
                            color = '#64d3ff';
                            break;
                        case '通过':
                            color = '#8bdd34';
                            break;
                        case '驳回':
                            color = 'red';
                            break;
                    }
                    return <div >
                        <p style={{ color: `${color}` }}>{statusStr}</p>
                    </div>
                }
            },
            {
                title: '处理人',
                dataIndex: 'handlerUser',
                key: 'handlerUser',
                width: 100,
                sorter: true,
            },
            {
                title: '受理时间',
                dataIndex: 'acceptTime',
                key: 'acceptTime',
                width: 120,
                sorter: true,
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
                width: 120,
                sorter: true,
                render: (text, record, index) => (
                    <div>
                         <span title={text ? moment(text).format('YYYY-MM-DD') : "-"}>{text ? moment(text).format('YYYY-MM-DD') : "-"}</span>
                         <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p>
                    </div>
                )
            },
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                width: 200,
                sorter: true,

            },
            {
                title: '付款方式',
                dataIndex: 'payFlag',
                key: 'payFlag',
                width: 200,
                sorter: true,
                render: (text, record, index) => {
                    if (!text) {
                        return '--'
                    }
                    let payType = this.payFlag(text)
                    return <div>
                        <p>{payType}</p>
                    </div>
                },
            },
            {
                title: '处理结果',
                dataIndex: 'type',
                key: 'type',
                width: 200,
                sorter: true,
                render: (text, record, index) => {
                    if (!text) {
                        return '--'
                    }
                    let types = this.type(text)
                    return <div>
                        <p>{types ? types :'-'}</p>
                    </div>
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'right',
                width: 150,
                render: (text, record) => {
                    
                    if (record.workOrdersState == 1) {
                        return <div style={{ width: "134px" }}>
                            <p><AuthButton elmType="a" onClick={this.detail.bind(this, record.workOrdersId,record.financeHangId)}>查看详情</AuthButton></p>
                            <p><AuthButton elmType="a" onClick={this.audit.bind(this,  record.workOrdersId,record.financeHangId)}>审核</AuthButton></p>
                            <p><AuthButton elmType="a" onClick={this.remark.bind(this, record.financeHangId)}>备注</AuthButton></p>
                        </div>
                    } else {
                        return<div>
                            <AuthButton elmType="a" href="javascript:;" style={{ width: "134px" }} onClick={this.detail.bind(this, record.workOrdersId,record.financeHangId)}>查看详情</AuthButton>
                            <p onClick={this.remark.bind(this, record.financeHangId)}><AuthButton elmType="a" href="javascript:;">备注</AuthButton></p>
                        </div> 
                        
                    }
                }
            }
        ]
    }
    //全部
    columns2 = () => {
        return [
            {
                title: '工单号',
                dataIndex: 'workOrdersCode',
                key: 'workOrdersCode',
                width: 150,
                sorter: true,
                render: (text, record) => {
                    return <span style={{ width: "150px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账户名称',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 200,
                sorter: true,
                render: (text, record) => {
                    return <span style={{ width: "180px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 180,
                sorter: true,
                render: (text, record) => {
                    return <span style={{ width: "170px" }} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款金额(元）',
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
                title: '来款附言',
                dataIndex: 'note',
                key: 'note',
                sorter: true,
                width: 130,
                render: (text, record, index) => (
                    <p>
                        <span title={text}>{text ? text: "-"}</span>
                    </p>
                )
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
                         {/* <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p> */}
                    </div>
                )
            },
            {
                title: '处理状态',
                dataIndex: 'workOrdersState',
                key: 'workOrdersState',
                sorter: true,
                width: 130,
                render: (text, record, index) => {
                    if (!text) {
                        return '--'
                    }
                    // console.log('ggg', text)
                    let statusStr = this.stausToRes(text);
                    let color;
                    switch (statusStr) {
                        case '待复核':
                            color = '#fad05d';
                            break;
                        case '通过':
                            color = '#8bdd34';
                            break;
                        case '驳回':
                            color = 'red';
                            break;
                    }
                    return <div >
                        <p style={{ color: `${color}` }}>{statusStr}</p>
                    </div>
                }
            },
            {
                title: '审批人',
                dataIndex: 'reviewUser',
                key: 'reviewUser',
                width: 200,
                sorter: true,
            },
            {
                title: '审批时间',
                dataIndex: 'reviewTime',
                key: 'reviewTime',
                width: 120,
                sorter: true,
                render: (text, record, index) => (
                    <div>
                         <span title={text ? moment(text).format('YYYY-MM-DD') : "-"}>{text ? moment(text).format('YYYY-MM-DD') : "-"}</span>
                         <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p>
                    </div>
                   
                )
            },
            {
                title: '处理人',
                dataIndex: 'handlerUser',
                key: 'handlerUser',
                width: 100,
                sorter: true,
            },
            {
                title: '受理时间',
                dataIndex: 'acceptTime',
                key: 'acceptTime',
                width: 120,
                sorter: true,
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
                width: 120,
                sorter: true,
                render: (text, record, index) => (
                    <div>
                         <span title={text ? moment(text).format('YYYY-MM-DD') : "-"}>{text ? moment(text).format('YYYY-MM-DD') : "-"}</span>
                         <p title={text ? moment(text).format('HH:mm:ss') : "-"}>{text ? moment(text).format('HH:mm:ss') : "-"}</p>
                    </div>
                )
            },
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                width: 200,
                sorter: true,

            },
            {
                title: '付款方式',
                dataIndex: 'payFlag',
                key: 'payFlag',
                width: 200,
                sorter: true,
                render: (text, record, index) => {
                    if (!text) {
                        return '--'
                    }
                    let payType = this.payFlag(text)
                    return <div>
                        <p>{payType}</p>
                    </div>
                },
            },
            {
                title: '处理结果',
                dataIndex: 'type',
                key: 'type',
                width: 200,
                sorter: true,
                render: (text, record, index) => {
                    if (!text) {
                        return '--'
                    }
                    let types = this.type(text)
                    return <div>
                        <p>{types ? types :'-'}</p>
                    </div>
                },
            },
            {
                title: '操作',
                dataIndex: 'operations',
                key: 'operations',
                fixed: 'right',
                width: 150,
                render: (text, record) => {
                    if (record.workOrdersState == 1) {
                        return <div style={{ width: "134px" }}>
                            <p onClick={this.detail.bind(this, record.workOrdersId,record.financeHangId)}><a href="javascript:;">查看详情</a></p>
                            <p onClick={this.audit.bind(this, record.workOrdersId,record.financeHangId)}><a href="javascript:;">审核</a></p>
                            <p onClick={this.remark.bind(this, record.financeHangId)}><a href="javascript:;">备注</a></p>
                        </div>
                    } else {
                        return <div>
                            <p style={{ width: "134px" }} onClick={this.detail.bind(this, record.workOrdersId,record.financeHangId)}><a href="javascript:;">查看详情</a></p>
                            <p style={{ width: "134px" }} onClick={this.remark.bind(this, record.financeHangId)}><a href="javascript:;">备注</a></p>
                        </div>
                    }
                }
            }
        ]
    }

    

    // //导出
    // exportExcel = () => {
    //     let key = this.activeTab;
    //     if (1 == key) {
    //         //待处理
    //         this.baseParams.checkStatus = 0
    //     } else if (2 == key) {
    //         //已处理
    //         this.baseParams.checkStatus = 1
    //     } else if (3 == key) {
    //         //全部
    //         this.baseParams.checkStatus = undefined
    //     } else if (4 == key) {
    //         // 系统处理中
    //         this.baseParams.checkStatus = 4
    //     }
    //     exportFile("/financial/financeHang/exportExcel", this.baseParams);
    // }
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
                    const url = getUrlByParam('platform/settlement/exportPageAccount', options);
                    location.href = systemConfigPath.axiosUrl(url);
                }
            },
        );
    }
    //处理
    // handle = (uuids) => {
    //     let params = {};
    //     params.uuids = uuids
    //     this.props.history.push(getUrlByParam("/financialCenter/detailFinanceReview", params));
    // }

    //查看
    detail = (workOrdersId,financeHangId) => {
        console.log('888',workOrdersId,financeHangId)
        this.setState({
            workOrdersId: workOrdersId,
            financeHangId:financeHangId
        })
        let params = {};
        params.workOrdersId = workOrdersId
        params.id = financeHangId
        this.props.history.push(getUrlByParam("/financialCenter/detailFinanceReview", params));
    }
    audit = (workOrdersId,financeHangId) => {
        this.setState({
            workOrdersId: workOrdersId,
            financeHangId
        })
        let params = {};
        params.workOrdersId = workOrdersId
        params.id= financeHangId
        this.props.history.push(getUrlByParam("/financialCenter/auditFinanceReview", params));
    }

    //tabs切换事件
    onTabsChange = (key) => {
        if (1 == key) {
            //待复核
            this.baseParams.checkStatus = 1
        } else if (2 == key) {
            //全部
            this.baseParams.checkStatus = undefined
        } else if (3 == key) {
            // 已通过
            this.baseParams.checkStatus = 2
        } else if (4 == key) {
            // 驳回
            this.baseParams.checkStatus = 3
        }
        this.activeTab = key;
        this.reloadTableData();
    }

    switchChange = (checked) => {
        this.setState({
            approvalStatus: checked
        });
        let options = {};
        if (!checked) {
            options.configValue = 0;

        } else {
            options.configValue = 1;
        }
        this.approvalOnOff(options);
        
    }
    //审批状态存入后台
  approvalOnOff(options = {
    configValue: 0
  }) {
    api.ajax("POST", "@/platform/config/updateStatus", options).then((r) => {
        if (!this._isMounted) {
            return;
        }
        if (r.code == 200) {
            message.success('审批状态存储成功')
        }
    })
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
                        <AuthButton elmType="switch" defaultChecked={false} onChange={this.switchChange} checked={this.state.approvalStatus} checkedChildren="审批" style={{ position: "relative", top: "27px", zIndex: "100", right: '17px' }} >审批</AuthButton>

                        <AuthButton type="primary" onClick={this.export} style={{ position: "relative", top: "26px", zIndex: "99" }}>导出</AuthButton>
                    </div>
                    <Tabs defaultActiveKey="1" onChange={this.onTabsChange} >
                        <TabPane tab="待审核" key="1">
                            <BaseTable
                                url='@/platform/checkingOnAccount/findCheckingOnAccountListForPage'
                                tableState={this.state.tableState1}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState1')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns1()}
                                scroll={{ x: 1400 }}
                            />
                        </TabPane>
                        <TabPane tab="通过" key="3">
                            <BaseTable
                                url='@/platform/checkingOnAccount/findCheckingOnAccountListForPage'
                                tableState={this.state.tableState3}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState3')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns2()}
                                scroll={{ x: 2800 }}
                            />
                        </TabPane>
                        <TabPane tab="驳回" key="4">
                            <BaseTable
                                url='@/platform/checkingOnAccount/findCheckingOnAccountListForPage'
                                tableState={this.state.tableState4}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState4')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns2()}
                                scroll={{ x: 2200 }}
                            />
                        </TabPane>
                        <TabPane tab="全部" key="2">
                            <BaseTable
                                url='@/platform/checkingOnAccount/findCheckingOnAccountListForPage'
                                tableState={this.state.tableState2}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState2')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns2()}
                                scroll={{ x: 2500 }}
                                returnPage={this.returnPage}
                            />
                        </TabPane>

                    </Tabs>
                </Card>
                <Modal title="备注" visible={this.state.visible}
                    onOk={this.remarkOk} onCancel={this.remarkCancel} okText='保存'
                    >
                    <FormItem   {...formItemLayout} label="备注信息">
                            {/* <Input  type="textarea" maxLength='400' rows={5} value={this.state.auditMas} onChange={(e)=>this.onChange(e,"auditMas")}/> */}
                            <Input  type="textarea" maxLength='400' rows={5} value={this.state.auditMas} onChange={(e)=>this.onChange(e,"auditMas")}/>
                          </FormItem>
                </Modal>
            </div>
        )
    }
}
export default financeReview;