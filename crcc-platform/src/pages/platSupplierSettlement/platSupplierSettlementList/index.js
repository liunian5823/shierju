import { Card, Table, Button, Modal,Tabs } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import {NumberFormat} from '@/components/content/Format'
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class PlatSettlementList extends React.Component {
    _isMounted = false

    state = {
        loading: false
    }

    bulletinInfo = ""

    componentWillMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**查询条件 */
    importantFilter = ['settlementNo', 'orderNo']

    formList = [
        {
            type: 'INPUT',
            field: 'settlementNo',
            label: '结算单号',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'orderNo',
            label: '订单编号',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'buyerName',
            label: '采购商',
            placeholder: '请输入'
        },
        {
            type: 'RANGE',
            field: 'createTimeArr',
            label: '创建日期',
            placeHolder: '请筛选时间段'
        }
    ]
    handleFilter = (params, isSend = true) => {
        let creatStartDate, creatEndDate;
        if (params.createTimeArr) {
            creatStartDate = params.createTimeArr[0] ? moment(params.createTimeArr[0]).format('YYYY-MM-DD') : '';
            creatEndDate = params.createTimeArr[1] ? moment(params.createTimeArr[1]).format('YYYY-MM-DD') : '';
        }
        delete params["createTimeArr"];

        this.baseParams = {
            ...this.baseParams,
            ...params,
        }
        if (isSend) {
            this.handelToLoadTable();
        }
    }


    //详情
    handleToSee = (info) => {
        this.setState({
            seeVisible: true,
            seeModalInfo: info
        })
    }

    /**
     * tab 切换事件
     * @param key
     */
    tabsChange = (key) => {
        this.setState({
            searchForm: {
                state: key
            }
        }, () => {
            this.handelToLoadTable(state, 'tableState' + key);
        })
    }

    reloadTableData(state) {
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
    baseParams = {
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

    //详情详情，跳转供应商详情页
    handleToDetails = (id) => {
        this.props.history.push('/platSupplierSettlement/platSupplierSettlementDetail' + '/' + id)
    }
    columns = [
        {
            title: '结算单号',
            dataIndex: 'settlementNo',
            key: 'settlementNo',
            width: 180,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '采购商',
            dataIndex: 'buyerName',
            key: 'buyerName',
            width: 240,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '创建日期',
            dataIndex: 'createTimeYMDStr',
            key: 'createTimeYMDStr',
            width: 200,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '订单数量',
            dataIndex: 'orderCount',
            key: 'orderCount',
            width: 120,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },
        {
            title: '金额(元)',
            dataIndex: 'amount',
            key: 'amount',
            width: 180,
            render: (text, record) =>{
                if (text == undefined || text == null || text == "") {
                    return <span title={text}>{text}</span>
                } else {
                    return <span title={text}><NumberFormat value={text}/></span>
                }
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <span>
                  <a onClick={ this.handleToDetails.bind(this,record.id) }>详情</a>
                </span>
            ),
            width: 80
        }
    ]

    render() {
        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <BaseTable
                        url="!!/financial/platSupplierSettlementController/querySupplierSettlementListForPage"
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns}
                    />
                </Card>
            </div>
        )
    }
}
export default PlatSettlementList;