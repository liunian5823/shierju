import { Card, Button, Tabs } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {exportFile} from "@/utils/urlUtils";
import {NumberFormat} from "@/components/gaoda/Format";
import less from './index.less';
import './capitalFlow.css';

const TabPane = Tabs.TabPane;

class CapitalFlow extends React.Component{
    state = {
        loading: false,
        tableState1: 0,
        tableState2: 0,
    }
    activeTab = '1';//当前激活的tab
    _isMounted = false;
    importantFilter = ['bankName', 'createTime'];
    formList = [
        {
            type: 'INPUT',
            field: 'bankName',
            label: '银行名称',
            placeholder: '请输入银行名称'
        },
        {
            type: 'INPUT',
            field: 'bankNo',
            label: '银行账号',
            placeholder: '请输入银行账号'
        },
        {
            type: 'RANGE',
            field: 'createTime',
            label: '交易时间',
            placeholder: '请筛选时间段'
        },
        {
            type: 'INPUT',
            field: 'remarks',
            label: '备注(附言码)',
            placeholder: '请输入备注(附言码)'
        }
    ]
    handleFilter = (p, isSend = true) => {
        if (p.createTime) {
            p.createStartDate = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD') : '';
            p.createEndDate = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD') : '';
            p.createStartAcctDate = p.createTime[0] ? moment(p.createTime[0]).format('YYYYMMDD') : '';
            p.createEndAcctDate = p.createTime[1] ? moment(p.createTime[1]).format('YYYYMMDD') : '';
        }else {
            p.createStartDate ="";
            p.createEndDate ="";
            p.createStartAcctDate ="";
            p.createEndAcctDate ="";
        }

        p.createTime=null;

        let key = this.activeTab;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
        }
        if(isSend){
            this.reloadTableData();
        }
    }
    componentWillMount(){
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    baseParams1 = {
        companyType: 2
    }
    baseParams2 = {
        companyType: 1
    }



    columns1 = () => {
        //327 276 219  130 130 494
        return [
            {
                title: '银行名称',
                dataIndex: 'bankName',
                key: 'bankName',
                width:"327px",
                render: (text, record)=>{
                    return <span style={{}} title={text}>{text}</span>
                }
            },
            {
                title: '银行户名',
                dataIndex: 'companyName',
                key: 'companyName',
                width:"276px",
                render: (text, record) =>{
                    return <span style={{}} title={text}>{text}</span>
                }
            },
            {
                title: '银行账号',
                dataIndex: 'bankNo',
                key: 'bankNo',
                width:"219px",
                render: (text, record) =>{
                    return <span style={{}} title={text}>{text}</span>
                }
            },
            {
                title: '交易时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                width:"140px",
                render: (text) => {
                    return <p style={{}}>{moment(text).format("YYYY-MM-DD")}</p>
                }
            },
            {
                title: "金额(元)",
                dataIndex: 'transactionMonery',
                key: 'transactionMonery',
                sorter: true,
                width:"130px",
                className:'text_align_right',
                render: (text,record,index) =>{
                    return(<p className={less.nowrapEllipsis} style={{}}><NumberFormat value={text}/></p>)
                }
            },
            {
                title: '备注(供应商名称/采购商名称+提现)',
                dataIndex: 'remarksStr',
                key: 'remarksStr',
                width:"484px",
                render: (text,record,index) =>{
                    return <span style={{}} title={text}>{text}</span>
                }
            }
        ]
    }
    columns2 = () => {
        return [
            {
                title: '银行名称',
                dataIndex: 'bankName',
                key: 'bankName',
                width:"197px",
                render: (text, record)=>{
                    return <span style={{}} title={text}>{text}</span>
                }
            },
            {
                title: '银行户名',
                dataIndex: 'inAcctIdName',
                key: 'inAcctIdName',
                width:"456px",
                render: (text, record) =>{
                    return <span style={{}} title={text}>{text}</span>
                }
            },
            {
                title: '银行账号',
                dataIndex: 'inAcctId',
                key: 'inAcctId',
                width:236,
                render: (text, record) =>{
                    return <span style={{}} title={text}>{text}</span>
                }
            },
            {
                title: '交易时间',
                dataIndex: 'acctDateStr',
                key: 'acctDateStr',
                sorter: true,
                width:"140px",
                render: (text) => {
                    return <span style={{}}>{text}</span>
                }
            },
            {
                title: '金额(元)',
                dataIndex: 'inAmount',
                key: 'inAmount',
                sorter: true,
                width:"130px",
                className:'text_align_right',
                render: (text,record,index) =>{
                    return <span style={{}} className={less.nowrapEllipsis}><NumberFormat value={text}/></span>
                }
            },
            {
                title: '备注(附言码)',
                dataIndex: 'note',
                key: 'note',
                width:"394px",
                render: (text, record) =>{
                    return <span style={{}} title={text}>{text}</span>
                }
            }
        ]
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
    reloadTableData(state = 1) {
        let key = this.activeTab;
        this.handelToLoadTable(state, 'tableState' + key);
    }

    // 收支明细-导出
    inquiryExport=()=>{
        let key = this.activeTab;
        if ( key == 1 ){
            exportFile("/financial/capitalFlow/exportDataFinanceInfoLog",this.baseParams1)
        } else if ( key == 2 ){
            exportFile("/financial/capitalFlow/exportDataFinanceHang",this.baseParams2)
        }
    }


    handleChangeTab = (key) => {
        this.activeTab = key;
        this.reloadTableData();
    }

    render(){
        return(
            <div>
                <Card bordered={false} className="capitalFlow">
                    <BaseForm
                        formList={this.formList}
                        importantFilter={this.importantFilter}
                        filterSubmit={this.handleFilter}/>
                    <div className="exporttoolbar">
                        <Button type="primary" onClick={this.inquiryExport} style={{marginLeft:"8px"}}>导出</Button>
                    </div>
                    <Tabs defaultActiveKey="1"
                          onChange={this.handleChangeTab}>
                        <TabPane tab="出金" key="1">
                            <BaseTable
                                url='!!/financial/capitalFlow/listForPageFinanceInfoLog'
                                tableState={this.state.tableState1}
                                resetTable={(state)=>{this.resetTable(state,'tableState1')}}
                                baseParams={this.baseParams1}
                                columns={this.columns1()}
                                scroll={{x: 1400}}
                            />
                        </TabPane>
                        <TabPane tab="入金" key="2">
                            <BaseTable
                                url='!!/financial/capitalFlow/listForPageFinanceHang'
                                tableState={this.state.tableState2}
                                resetTable={(state)=>{this.resetTable(state,'tableState2')}}
                                baseParams={this.baseParams2}
                                columns={this.columns2()}
                                scroll={{x: 1400}}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
}
export default CapitalFlow