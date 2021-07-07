import { Card, Table, Button, Modal,Tabs } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import {NumberFormat} from '@/components/content/Format'
import less from "./index.less";
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class PlatSettlementList extends React.Component {
    _isMounted = false

    state = {
        loading: false,

        tableState1: 0,
        tableState2: 0,
        tableState3: 0,
    }

    bulletinInfo = ""
    activeTab = 1;

    componentWillMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**查询条件 */
    importantFilter = ['settlementNo', 'settlementType']

    formList = [
        {
            type: 'INPUT',
            field: 'settlementNo',
            label: '结算单号',
            placeholder: '请输入'
        },
        {
            type: 'SELECT',
            field: 'settlementType',
            label: '结算单类型',
            placeholder: '请选择',
            list: [{ id: 0, value: '采购商结算单' }, { id: 1, value: '供应商结算单' }]
        },
        {
            type: 'INPUT',
            field: 'companyName',
            label: '企业名称',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'createUserName',
            label: '创建人',
            placeholder: '请输入'
        },
        {
            type: 'RANGE',
            field: 'createTimeArr',
            label: '创建日期',
            placeHolder: '请选择'
        },
        {
            type: 'RANGE',
            field: 'payTimeArr',
            label: '结算日期',
            placeHolder: '请选择'
        },
        {
            type: 'RANGE',
            field: 'withdrawDateArr',
            label: '提款日期',
            placeHolder: '请选择'
        },
        {
            type: 'SELECT',
            field: 'withdrawStatus',
            label: '提款状态',
            placeholder: '请选择',
            list: [{ id:1, value: '可提款' }, { id: 2, value: '已提款' }]
        },
        {
            type: 'SELECT',
            field: 'status',
            label: '结算单状态',
            placeholder: '请选择',
            list: [{ id: 5, value: '待结算' }, { id: 20, value: '结算中' } , { id: 50, value: '已结算' }]
        },
        {
            type: 'INPUTNUMBER',
            field: 'orderCount',
            label: '订单数量',
            placeholder: '请输入'
        },
        {
            type: 'SELECT',
            field: 'settleType',
            label: '结算项目',
            placeholder: '请选择',
            list: [{ id: 0, value: '旧系统结算' },{ id: 1, value: '货款' },{ id: 2, value: '质保金' }]
        },
        {
            type: 'INPUT',
            field: 'amount',
            label: '结算金额',
            placeholder: '请输入',
            className:'less.text_align_right',
        },
        {
            type: 'INPUT',
            field: 'withdrawUserName',
            label: '提款人',
            placeholder: '请输入'
        }
    ]
    handleFilter = (params, isSend = true) => {
        let creatStartDate, creatEndDate, payTimeStartDate,payTimeEndDate,withdrawStartDate,withdrawEndDate;

        if (params.createTimeArr) {
            creatStartDate = params.createTimeArr[0] ? moment(params.createTimeArr[0]).format('YYYY-MM-DD') : '';
            creatEndDate = params.createTimeArr[1] ? moment(params.createTimeArr[1]).format('YYYY-MM-DD') : '';
        }
        if (params.payTimeArr) {
            payTimeStartDate = params.payTimeArr[0] ? moment(params.payTimeArr[0]).format('YYYY-MM-DD') : '';
            payTimeEndDate = params.payTimeArr[1] ? moment(params.payTimeArr[1]).format('YYYY-MM-DD') : '';
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
            creatStartDate,
            creatEndDate,
            payTimeStartDate,
            payTimeEndDate,
            withdrawStartDate,
            withdrawEndDate
        }

        key = 2;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            creatStartDate,
            creatEndDate,
            payTimeStartDate,
            payTimeEndDate,
            withdrawStartDate,
            withdrawEndDate
        }

        key = 3;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            creatStartDate,
            creatEndDate,
            payTimeStartDate,
            payTimeEndDate,
            withdrawStartDate,
            withdrawEndDate
        }

        this.baseParams = {
            ...this.baseParams,
            ...params,
        }
        if (isSend) {
            this.reloadTableData();
        }
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
        queryType: '1'
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
        let url;
        if(0==record.settlementType){
            url = "/financialCenter/purchaserSettlementDetail/";
        }
        if(1==record.settlementType){
            url = "/financialCenter/supplierSettlementDetail/";
        }
        this.props.history.push(url + record.uuids)
    }

    columns = [
        {
            title: '结算单号',
            dataIndex: 'settlementNo',
            key: 'settlementNo',
            width: 200,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '结算单类型',
            dataIndex: 'settlementTypeStr',
            key: 'settlementTypeStr',
            width: 180,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '企业名称',
            dataIndex: 'companyName',
            key: 'companyName',
            width: 240,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: 140,
            sorter: true,
            render: (text, record, index) => {
                let showStr = text;
                if (showStr == null || showStr == "") {
                    showStr = "系统";
                }
                return <span title={showStr}>{showStr}</span>
            }
        },
        {
            title: '创建日期',
            dataIndex: 'createTimeYMDStr',
            key: 'createTimeYMDStr',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '结算日期',
            dataIndex: 'payTimeYMDStr',
            key: 'payTimeYMDStr',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '提款日期',
            dataIndex: 'withdrawDateYMDStr',
            key: 'withdrawDateYMDStr',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '提款状态',
            dataIndex: 'withdrawStatusStr',
            key: 'withdrawStatusStr',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '结算单状态',
            dataIndex: 'statusStr',
            key: 'statusStr',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '订单数量',
            dataIndex: 'orderCount',
            key: 'orderCount',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '结算项目',
            dataIndex: 'settleType',
            key: 'settleType',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                let showStr = "";
                if (record.settlementType == 1) {   //1.供应商
                    //结算方式类型(0:旧系统结算1:货款,2:质保金)
                    if (record.settleType == 1) {
                        showStr = "货款(95%)";
                    } else if (record.settleType == 2){
                        showStr = "质保金(5%)";
                    } else if (record.settleType == 0) {
                        showStr = "旧系统结算";
                    }
                } else {    //采购商
                    showStr = "--";
                }

                return <span title={showStr}>{showStr}</span>
            }
        },
        {
            title: '结算金额（元）',
            dataIndex: 'amount',
            key: 'amount',
            width: 160,
            sorter: true,
            render: (text, record) =>{
                if (text == undefined || text == null || text == "") {
                    return <span style={{textAlign:"right",width:110,display:"inline-block"}} title={text}>{text}</span>
                } else {
                    return <span  style={{textAlign:"right",width:110,display:"inline-block"}} title={text}><NumberFormat value={text}/></span>
                }
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            render: (text, record) => (
                <span>
                  <a onClick={ this.handleToDetails.bind(this,record) }>详情</a>
                </span>
            ),
            width: 80
        }
    ]

    purchaserColumns = [
        {
            title: '结算单号',
            dataIndex: 'settlementNo',
            key: 'settlementNo',
            width: 150,
            sorter: true,
            render: (text, record, index) => {
                return <p style={{width:"150px"}} title={text}>{text}</p>
            }
        },
        {
            title: '结算单类型',
            dataIndex: 'settlementTypeStr',
            key: 'settlementTypeStr',
            width: 120,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '企业名称',
            dataIndex: 'companyName',
            key: 'companyName',
            width: 250,
            sorter: true,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: 120,
            sorter: true,
            render: (text, record, index) => {
                let showStr = text;
                if (showStr == null || showStr == "") {
                    showStr = "系统";
                }
                return <span title={showStr}>{showStr}</span>
            }
        },
        {
            title: '创建日期',
            dataIndex: 'createTimeYMDStr',
            key: 'createTimeYMDStr',
            width: 120,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '结算日期',
            dataIndex: 'payTimeYMDStr',
            key: 'payTimeYMDStr',
            width: 120,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '结算单状态',
            dataIndex: 'statusStr',
            key: 'statusStr',
            width: 120,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '订单数量',
            dataIndex: 'orderCount',
            key: 'orderCount',
            width: 120,
            sorter: true,
            render: (text, record) =>{
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '结算金额（元）',
            dataIndex: 'amount',
            key: 'amount',
            width: 180,
            sorter: true,
            render: (text, record) =>{
                if (text == undefined || text == null || text == "") {
                    return <span style={{textAlign:"right",width:"100%",display:"inline-block"}} title={text}>{text}</span>
                } else {
                    return <span  style={{textAlign:"right",width:"100%",display:"inline-block"}} title={text}><NumberFormat value={text}/></span>
                }
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 80,
            render: (text, record) => (
                <span>
                  <a onClick={ this.handleToDetails.bind(this,record) }>详情</a>
                </span>
            )
        }
    ]

    render() {
        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
                        <TabPane tab="全部" key="1">
                            <BaseTable
                                url="!!/financial/platSettlementController/queryAllPlatSettlementListForPage"
                                tableState={this.state.tableState1}
                                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                                baseParams={this.baseParams1}
                                columns={this.columns}
                                scroll={{ x: 2000 }}
                            />
                        </TabPane>
                        <TabPane tab="供应商结算单" key="2">
                            <BaseTable
                                url="!!/financial/platSettlementController/querySupplierPlatSettlementListForPage"
                                tableState={this.state.tableState2}
                                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                                baseParams={this.baseParams2}
                                columns={this.columns}
                                scroll={{ x: 2000 }}
                            />
                        </TabPane>
                        <TabPane tab="采购商结算单" key="3">
                            <BaseTable
                                url="!!/financial/platSettlementController/queryPurchaserPlatSettlementListForPage"
                                tableState={this.state.tableState3}
                                resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                                baseParams={this.baseParams3}
                                columns={this.purchaserColumns}
                                scroll={{ x: 1300 }}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
}
export default PlatSettlementList;