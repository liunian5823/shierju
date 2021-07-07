import { Card, Button, Tabs } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import CapitalModal from './capitalModal';
import {exportFile} from "@/utils/urlUtils";
import {NumberFormat} from '@/components/content/Format'
import less from './index.less';
const TabPane = Tabs.TabPane;
class capitalAccountManagement extends React.Component{
    state = {
        loading: false,
        tableState1: 0,
        tableState2: 0,
        tableState3: 0,
        modalVisible: false,
    };
    _isMounted = false;
    activeTab = 1;
    importantFilter = ['qaCompanyName', 'createTime'];
    formList = [
        {
            type: 'INPUT',
            field: 'qaCompanyName',
            label: '公司名称',
            placeholder: '请输入公司名称'
        },
        {
            type: 'RANGE',
            field: 'createTime',
            label: '开通时间',
            placeholder: '请筛选时间段'
        },
        {
            type: 'INPUT',
            field: 'companyNo',
            label: '企业编号',
            placeholder: '请输入企业编号'
        },
        {
            type: 'INPUT',
            field: 'managentPhone',
            label: '管理员手机号',
            placeholder: '请输入管理员手机号'
        }
    ];
    handleFilter = (p, isSend = true) => {
        let createStartDate, createEndDate;
        if (p.createTime) {
            createStartDate = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD') : '';
            createEndDate = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD') : '';
            delete p.createTime
        }
        let key = this.activeTab;
        this.baseParams = {
            ...p,
            createStartDate,
            createEndDate,
        }
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...this.baseParams,
        };

        if(isSend){
            this.reloadTableData();
        }
    };
    componentWillMount(){
        this._isMounted = true;
    };
    componentWillUnmount(){
        this._isMounted = false;
    };

    handleExport = () => {
        exportFile("/financial/ecFinanceInfo/exportDataOfCapitalInfo",this['baseParams' + this.activeTab])
    };

    baseParams = {};
    baseParams1 = {};
    baseParams2= {companyType: 1};
    baseParams3 = {companyType: 0};

    // 打开查看页
    openDetails = (companyId) =>{
        this.props.history.push('/financialCenter/capitalAccount/details/'+ companyId );
    };

    columns = () => {
        return [
            {
                title: '序号',
                key: 'indexkey',
                width: 50,
                render: (text,record,index)=>{
                    return(<p className={less.nowrap2} style={{width:"50px"}}><span title={index +1 }>{index +1}</span></p>)
                },
            },
            {
                title: '企业编号',
                dataIndex: 'companyNo',
                key: 'companyNo',
                width: 150,
                render: (text) => {
                    return(<p className={less.nowrapEllipsis} style={{width:"160px"}}><span title={text}>{text}</span></p>)
                }
            },
            {
                title: '企业类型',
                dataIndex: 'type',
                key: 'companyType',
                width:80,
                sorter: true,
                render: (text) => {
                    return(<p className={less.nowrapEllipsis} style={{width:"87px"}}><span title={text}>{text}</span></p>)
                }
            },
            {
                title: '公司名称',
                dataIndex: 'companyName',
                key: 'companyName',
                render: (text) => {
                    return(<p className={less.nowrapEllipsis} style={{width:"236px"}}><span title={text}>{text}</span></p>)
                }
            },
            {
                title: '开通时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width:80,
                sorter: true,
                render: (text) => {
                    return(<p className={less.nowrapEllipsis} style={{width:"87px"}}><span title={text}>{text}</span></p>)
                }
            },
            {
                title: '在途金额（元）',
                dataIndex: 'transitAmt',
                className:'text_align_right',
                key: 'transitAmt',
                width: 130,
                render: (text)=>{
                    return(<p className={less.nowrapEllipsis} style={{width:"130px"}}><NumberFormat value={text}/></p>)
                },
                sorter: true
            },
            {
                title: '冻结金额（元）',
                dataIndex: 'frozeAmt',
                className:'text_align_right',
                key: 'frozeAmt',
                width: 130,
                render: (text)=>{
                    return(<p className={less.nowrapEllipsis} style={{width:"130px"}}><NumberFormat value={text}/></p>)
                },
                sorter: true
            },
            {
                title: '可提现金额（元）',
                dataIndex: 'availAmt',
                key: 'availAmt',
                className:'text_align_right',
                width: 130,
                render: (text)=>{
                    return(<p className={less.nowrapEllipsis} style={{width:"140px"}}><NumberFormat value={text}/> </p>)
                },
                sorter: true
            },
            {
                title: '总金额（元）',
                dataIndex: 'totalAmt',
                className:'text_align_right',
                key: 'totalAmt',
                width:130,
                render: (text)=>{
                    return(<p className={less.nowrapEllipsis} style={{width:"130px"}}><NumberFormat value={text}/></p>)
                },
                sorter: true
            },
            {
                title: '操作',
                dataIndex: '',
                fixed: 'right',
                key: 'x',
                width: 60,
                render: (text, record)=>{
                    return(
                        <p  style={{width:"60px"}}>
                            <a href="javascript:void(0);" onClick={this.openDetails.bind(this,record.companyId)}>查看</a>
                        </p>
                    )
                }
            }
        ]
    };
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    };
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    };
    reloadTableData(state = 1) {
        let key = this.activeTab;
        this.handelToLoadTable(state, 'tableState' + key);
    }
    handleChangeTab = (key) => {
        this.activeTab = key;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...this.baseParams,
        };
        this.reloadTableData();
    };
    modalOk = () => {
        this.setState({
            modalVisible: false
        })
    };
    modalCancel = (isRefresh) => {debugger
        this.setState({
            modalVisible: false
        })
        if(isRefresh) {
            this.reloadTableData();
        }

    };
    modalEvent = {
        onCancel: this.modalCancel,
        reloadTableData:  this.reloadTableData
    };
    handleOpen = () => {
        this.setState({
            modalVisible: true
        })
    };
    render(){
        return(
            <div className={"capitalAccountManagement"}>
                <Card bordered={false}>
                    <BaseForm
                        formList={this.formList}
                        importantFilter={this.importantFilter}
                        filterSubmit={this.handleFilter}/>
                    <div className={less.capitalAccountbar}>
                        <Button  className="mr10" onClick={this.handleExport}>导出</Button>
                        <Button  className="mr10" type="primary" onClick={this.handleOpen}>开通账户</Button>
                    </div>
                    <Tabs defaultActiveKey="1"
                          onChange={this.handleChangeTab}>
                        <TabPane tab="全部" key="1">
                            <BaseTable
                                url='!!/financial/ecFinanceInfo/queryAccountPage'
                                tableState={this.state.tableState1}
                                resetTable={(state)=>{this.resetTable(state,'tableState1')}}
                                baseParams={this.baseParams1}
                                columns={this.columns()}
                                scroll={{x: 1200 } }
                            />
                        </TabPane>
                        <TabPane tab="供应商" key="2">
                            <BaseTable
                                url='!!/financial/ecFinanceInfo/queryAccountPage'
                                tableState={this.state.tableState2}
                                resetTable={(state)=>{this.resetTable(state,'tableState2')}}
                                baseParams={this.baseParams2}
                                columns={this.columns()}
                                scroll={{x: 1200 } }
                            />
                        </TabPane>
                        <TabPane tab="采购商" key="3">
                            <BaseTable
                                url='!!/financial/ecFinanceInfo/queryAccountPage'
                                tableState={this.state.tableState3}
                                resetTable={(state)=>{this.resetTable(state,'tableState3')}}
                                baseParams={this.baseParams3}
                                columns={this.columns()}
                                scroll={{x: 1200 } }
                            />
                        </TabPane>
                    </Tabs>
                </Card>
                <CapitalModal
                    visible={this.state.modalVisible}
                    {...this.modalEvent}/>
            </div>
        )
    }
}
export default capitalAccountManagement;