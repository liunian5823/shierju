import {Card, Button, Table, Switch, message, Tabs} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {exportFile} from '@/utils/urlUtils';
import {getUrlByParam, getQueryString} from '@/utils/urlUtils';
import {NumberFormat} from '@/components/content/Format'
import less from './index.less';

const TabPane = Tabs.TabPane;
class financeHang extends React.Component {
    state = {
        loading: false,
        tableState: 0,
    }
    activeTab = '1';//当前激活的tab
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
            field: 'sellerCompanyName',
            label: '供应商名称',
            placeholder: '请输入',
        },
        {
            type: 'INPUT',
            field: 'buyerCompanyName',
            label: '采购商名称',
            placeholder: '请输入',
        },
        {
            type: 'INPUT',
            field: 'orderNo',
            label: '订单编号',
            placeholder: '请输入',
        }
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
        accountState: 0
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

    //待处理
    columns1 = () => {
        return [
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账户名称',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款附言',
                dataIndex: 'note',
                key: 'note',
                width: 200
            },
            {
                title: '来款时间',
                dataIndex: 'acctDate',
                key: 'acctDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    let result = "-";
                    if(text&&8 == text.length){
                        result = text.substring(0,4)+"-"+text.substring(4,6)+"-"+text.substring(6,text.length);
                    }else{
                        result = text;
                    }
                    return ( <p>{result}</p>)
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
                        <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
                    </p>
                )
            },
            {
                title: '疑似单数',
                dataIndex: 'orderCount',
                key: 'orderCount',
                width: 150
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 150,
                render: (text, record) => (
                    <p style={{width: "134px"}}>
                        <a onClick={this.handle.bind(this, record.uuids)}>处理</a>
                    </p>
                )
            }
        ]
    }

    //已处理
    columns2 = () => {
        return [
            {
                title: '来款账户名称',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 120,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款时间',
                dataIndex: 'acctDate',
                key: 'acctDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    let result = "-";
                    if(text&&8 == text.length){
                        result = text.substring(0,4)+"-"+text.substring(4,6)+"-"+text.substring(6,text.length);
                    }else{
                        result = text;
                    }
                    return ( <p>{result}</p>)
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
                        <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
                    </p>
                )
            },
            {
                title: '处理方式',
                dataIndex: 'typeStr',
                key: 'typeStr',
                width: 100
            },
            {
                title: '经办人',
                dataIndex: 'handleCreateUserName',
                key: 'handleCreateUserName',
                width: 200
            },
            {
                title: '处理时间',
                dataIndex: 'handleTime',
                key: 'handleTime',
                width: 120,
                sorter: true,
                render: (text, record, index) => (
                        <span title={text?moment(text).format('YYYY-MM-DD'):"-"}>{text?moment(text).format('YYYY-MM-DD'):"-"}</span>
                )
            },
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 200
            },
            {
                title: '来款单位',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 200
            },
            {
                title: '应用项目部',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 200
            },
            {
                title: '供应商名称',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 200
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'right',
                width: 150,
                render: (text, record) => (
                    <p style={{width: "134px"}}>
                        <a onClick={this.detail.bind(this, record.uuids)}>查看</a>
                    </p>
                )
            }
        ]
    }

    //全部
    columns3 = () => {
        return [
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账户名称',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "220px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 160,
                render:(text,record)=> {
                    return  <span style={{width: "200px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款附言',
                dataIndex: 'note',
                key: 'note',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "240px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款时间',
                dataIndex: 'acctDate',
                key: 'acctDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    let result = "-";
                    if(text&&8 == text.length){
                        result = text.substring(0,4)+"-"+text.substring(4,6)+"-"+text.substring(6,text.length);
                    }else{
                        result = text;
                    }
                    return ( <p style={{width: "140px"}}>{result}</p>)

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
                        <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
                    </p>
                )
            },
            {
                title: '处理方式',
                dataIndex: 'typeStr',
                key: 'typeStr',
                width: 100
            },
            {
                title: '状态',
                dataIndex: 'accountStateStr',
                key: 'accountStateStr',
                width: 100,
                render: (text,record)=>{
                    let style = ''
                    if(record.accountState == 2){
                        style = less.state2
                    }
                    if(record.accountState == 1){
                        style = less.state1
                    }

                    return( <p style={{width:"100px"}} className={style}>{text}</p>)
                }
            },
            {
                title: '经办人',
                dataIndex: 'handleCreateUserName',
                key: 'handleCreateUserName',
                width: 130
            },
            {
                title: '处理时间',
                dataIndex: 'handleTime',
                key: 'handleTime',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                        <span title={text?moment(text).format('YYYY-MM-DD'):"-"}>{text?moment(text).format('YYYY-MM-DD'):"-"}</span>
                )
            },
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 160
            },
            {
                title: '来款单位',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 200
            },
            {
                title: '应用项目部',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 200
            },
            {
                title: '供应商名称',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 200
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'right',
                width: 150,
                render: (text, record) => (
                    <p style={{width: "134px"}}>
                        <a onClick={this.detail.bind(this, record.uuids)}>查看</a>
                    </p>
                )
            }
        ]
    }

    // 系统处理中
    columns4 = () => {
        return [
            {
                title: '来款银行',
                dataIndex: 'bankName',
                key: 'bankName',
                width: 200,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账户名称',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width: 180,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width: 120,
                render:(text,record)=> {
                    return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
            },
            {
                title: '来款附言',
                dataIndex: 'note',
                key: 'note',
                width: 200
            },
            {
                title: '来款时间',
                dataIndex: 'acctDate',
                key: 'acctDate',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    let result = "-";
                    if(text&&8 == text.length){
                        result = text.substring(0,4)+"-"+text.substring(4,6)+"-"+text.substring(6,text.length);
                    }else{
                        result = text;
                    }
                    return ( <p>{result}</p>)

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
                        <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
                    </p>
                )
            },
            {
                title: '处理方式',
                dataIndex: 'typeStr',
                key: 'typeStr',
                width: 100
            },
            {
                title: '状态',
                dataIndex: 'accountStateStr',
                key: 'accountStateStr',
                width: 100,
                render: (text,record)=>{
                    let style = ''
                    if(record.accountState == 2){
                        style = less.state2
                    }
                    if(record.accountState == 1){
                        style = less.state1
                    }

                    return( <p style={{width:"80px"}} className={style}>{text}</p>)
                }
            },
            {
                title: '经办人',
                dataIndex: 'handleCreateUserName',
                key: 'handleCreateUserName',
                width: 130
            },
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 160
            },
            {
                title: '来款单位',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 200
            },
            {
                title: '应用项目部',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 200
            },
            {
                title: '供应商名称',
                dataIndex: 'sellerCompanyName',
                key: 'sellerCompanyName',
                width: 200
            }
        ]
    }

    //导出
    exportExcel = () => {
        let key = this.activeTab;
        if (1 == key) {
            //待处理
            this.baseParams.accountState = 0
        } else if (2 == key) {
            //已处理
            this.baseParams.accountState = 1
        } else if (3 == key) {
            //全部
            this.baseParams.accountState = undefined
        } else if (4 == key) {
            // 系统处理中
            this.baseParams.accountState = 4
        }
        exportFile("/financial/financeHang/exportExcel", this.baseParams);
    }

    //处理
    handle = (uuids) => {
        let params = {};
        params.uuids = uuids
        this.props.history.push(getUrlByParam("/financialCenter/handleFinanceHang", params));
    }

    //查看
    detail = (uuids) => {
        let params = {};
        params.uuids = uuids
        this.props.history.push(getUrlByParam("/financialCenter/detailFinanceHang", params));
    }

    //tabs切换事件
    onTabsChange = (key) => {
        if (1 == key) {
            //待处理
            this.baseParams.accountState = 0
        } else if (2 == key) {
            //已处理
            this.baseParams.accountState = 1
        } else if (3 == key) {
            //全部
            this.baseParams.accountState = undefined
        }  else if (4 == key) {
            // 系统处理中
            this.baseParams.accountState = 4
        }
        this.activeTab = key;
        this.reloadTableData();
    }

    render() {
        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter}
                              filterSubmit={this.handleFilter}></BaseForm>
                    <div className="exporttoolbarHang" style={{textAlign:"right"}}>
                        <Button type="primary" onClick={this.exportExcel} style={{position:"relative",top:"26px",zIndex:"99"}}>导出</Button>
                    </div>
                    <Tabs defaultActiveKey="1" onChange={this.onTabsChange}>
                        <TabPane tab="待处理" key="1">
                            <BaseTable
                                url='!!/financial/financeHang/listFinanceHangsForPage'
                                tableState={this.state.tableState1}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState1')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns1()}
                                scroll={{x: 1400}}
                            />
                        </TabPane>
                        <TabPane tab="已处理" key="2">
                            <BaseTable
                                url='!!/financial/financeHang/listFinanceHangsForPage'
                                tableState={this.state.tableState2}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState2')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns2()}
                                scroll={{x: 2200}}
                            />
                        </TabPane>
                        <TabPane tab="全部" key="3">
                            <BaseTable
                                url='!!/financial/financeHang/listFinanceHangsForPage'
                                tableState={this.state.tableState3}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState3')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns3()}
                                scroll={{x: 2800}}
                            />
                        </TabPane>
                        <TabPane tab="系统处理中" key="4">
                            <BaseTable
                                url='!!/financial/financeHang/listFinanceHangsForPage'
                                tableState={this.state.tableState4}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState4')
                                }}
                                baseParams={this.baseParams}
                                columns={this.columns4()}
                                scroll={{x: 2800}}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
}
export default financeHang;