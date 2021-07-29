import { Card, Button, Switch,Modal,Tabs,Row,Col } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import less from "./index.less";
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

class xhFinanceHangApproval extends React.Component {
    state = {
        info:{},
        tableState0: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState1: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState2: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState3: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    }

    _isMounted = false;
    activeTab = "0"
    componentWillMount() {
        this._isMounted = true;
        this.handelToLoadTable(1, 'tableState1');
        this.getInfo();

    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**查询条件 */
    importantFilter = ['findAcctIdName', 'findNote']

    formList = () => {
        return [
            {
                type: 'INPUT',
                field: 'findAcctIdName',
                label: '来款账户名',
                placeholder: '来款账户名'
            },
            {
                type: 'INPUT',
                field: 'findNote',
                label: '来款附言',
                placeholder: '来款附言'
            },
            {
                type: 'INPUT',
                field: 'findInAmount',
                label: '来款金额',
                placeHolder: '来款金额'
            },
            {
                type: 'INPUT',
                field: 'findAcceptanceUser',
                label: '受理人',
                placeholder: '受理人'
            },
            {
                type: 'INPUT',
                field: 'findComplexUser',
                label: '复核人',
                placeholder: '复核人'
            },
            {
                type: 'INPUT',
                field: 'findOrderNo',
                label: '工单号',
                placeholder: '工单号'
            },
            {
                type: 'RANGETIME',
                field: 'findCreatTame',
                label: '来款时间',
                placeHolder: '请筛选时间段'
            },
            {
                type: 'INPUT',
                field: 'findBankName',
                label: '来款银行',
                placeholder: '工单号'
            },
            {
                type: 'SELECT',
                field: 'factoryType',
                label: '业务类型',
                placeholder: '请输入业务类型',
                list: [
                    {
                        id: '1',
                        value: '保证金'
                    },
                    {
                        id: '2',
                        value: '预付货款'
                    },
                    {
                        id: '3',
                        value: '货款'
                    },
                    {
                        id: '4',
                        value: '服务费'
                    },
                    {
                        id: '5',
                        value: '手续费'
                    },
                    {
                        id: '6',
                        value: '沉默保证金'
                    },
                    {
                        id: '7',
                        value: '充值'
                    }
                ]
            }, {
                type: 'INPUT',
                field: 'findBusinessNo',
                label: '业务单号',
                placeholder: '业务单号'
            }
        ]
    }


    handleFilter = (p, isSend = true) => {
        let key = this.activeTab;
        let findCreatTameSta, findCreatTameEnd;
        if (p.findCreatTame) {
            findCreatTameSta = p.findCreatTame[0] ? moment(p.findCreatTame[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            findCreatTameEnd = p.findCreatTame[1] ? moment(p.findCreatTame[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            p.findCreatTame = null;
        }

        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
            findCreatTameSta,
            findCreatTameEnd
        }
        if (isSend) {
            this.reloadTableData();
        }
    }


    baseParams0 = {
        findTable:0
    }
    baseParams1 = {
        findTable:1
    }
    baseParams2 = {
        findTable:2
    }
    baseParams3 = {
        findTable:3
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
        this.resetTable(state, 'tableState'+key);
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        console.log("handelToLoadTable",tableState);
        this.setState({
            [tableState]: state
        })
    }
    columns = () => {
        return [
            {
                title: '工单编号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 250,
                sorter: true
            },
            {
               title: '来款银行',
               dataIndex: 'bankName',
               key: 'bankName',
               width: 150,
               sorter: true
           },
           {
               title: '流水号',
               dataIndex: 'frontLogNo',
               key: 'frontLogNo',
               width: 200,
               sorter: true
           },
           {
               title: '来款账户名',
               dataIndex: 'inAcctIdName',
               key: 'inAcctIdName',
               width: 250,
               sorter: true
           },
           {
               title: '来款账户号',
               dataIndex: 'inAcctId',
               key: 'inAcctId',
               width: 150,
               sorter: true
           },
           {
               title: '来款附言',
               dataIndex: 'note',
               key: 'note',
               width: 200,
               sorter:true
           },
           {
               title: '来款金额',
               dataIndex: 'inAmount',
               key: 'inAmount',
               width: 200,
               sorter: true
           },
          {
               title: '来款时间',
               dataIndex: 'acctDate',
               key: 'acctDate',
               width: 170,
               sorter: true
           },
           {
               title: '状态',
               dataIndex: 'workOrdersStateStr',
               key: 'workOrdersStateStr',
               width: 150,
               sorter: true
           },
           {
               title: '处理结果',
               dataIndex: 'typeStr',
               key: 'typeStr',
               width: 150,
               sorter: true
           },
           {
               title: '业务类型',
               dataIndex: 'businessTypeStr',
               key: 'businessTypeStr',
               width: 150,
               sorter: true
           },
           {
               title: '业务单号',
               dataIndex: 'businessNo',
               key: 'businessNo',
               width: 150,
               sorter: true
           },
           {
               title: '付款单号',
               dataIndex: 'payOrderNo',
               key: 'payOrderNo',
               width: 150,
               sorter: true
           },
           {
               title: '受理人',
               dataIndex: 'acceptanceUser',
               key: 'acceptanceUser',
               width: 150,
               sorter: true
           },
           {
               title: '受理时间',
               dataIndex: 'acceptanceTime',
               key: 'acceptanceTime',
               width: 150,
               sorter: true
           },
           {
               title: '处理时间',
               dataIndex: 'handleTime',
               key: 'handleTime',
               width: 150,
               sorter: true
           },
           {
               title: '复核人',
               dataIndex: 'complexUser',
               key: 'complexUser',
               width: 150,
               sorter: true
           },
           {
               title: '复合时间',
               dataIndex: 'complexTime',
               key: 'complexTime',
               width: 150,
               sorter: true
           },
           {
               title: '完成时间',
               dataIndex: 'finishTime',
               key: 'finishTime',
               width: 150,
               sorter: true
           },
           {
               title: '操作',
               dataIndex: '',
               key: 'x',
               width: 150,
               fixed: 'right',
               render: (text, record) => (
                   <span>
                     <AuthButton elmType="a" onClick={() => { }}>查看</AuthButton>
                      <span className="ant-divider"></span>
                     <AuthButton elmType="a" onClick={() => {this.toApproval(record)}}>审核</AuthButton>
                  </span>
               )
           }
        ]
    }

    //审核详情页面
    toApproval  = (record) => {
       if (record.workUuids) return
        this.props.history.push('/xhFinanceHang/financeApprovalDetail/'+ record.workUuids)
    }

    //切换tab页时
    handleTabChange = (key) => {
        this.activeTab = key;
        this.reloadTableData();
    }

    /**
     * 获取统计数据
     * @returns {*}
     */
    getInfo = () => {
        api.ajax("GET", "@//platform/xhFinanceHangFind/getListTotalAmt").then(r => {
            this.setState({
                info: r.data
            });
        }).catch(r => {

        })
    }


    render() {
        const { info } = this.state;

        return (
            <div>
                    <Card bordered={false}>
                        <BaseForm formList={this.formList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    </Card>
                    <Card style={{marginTop:5,marginBottom:5}}>
                        <Row span={24}>
                            <Col span={3}>
                                <p className={less.orangeFont13}>未受理</p>
                                <p className={less.orangeFont18}>{info.unprocessedAmt}元</p>
                            </Col>
                            <Col span={3} className={less.marginLeft23}>
                                <p className={less.blueFont13}>处理中</p>
                                <p className={less.blueFont18}>{info.processingAmt}元</p>
                            </Col>
                            <Col span={3} className={less.marginLeft23}>
                                <p className={less.blueFont13}>复合中</p>
                                <p className={less.blueFont18}>{info.approvalAmt}元</p>
                            </Col>
                            <Col span={3}className={less.marginLeft23}>
                                <p className={less.greenFont13}>已处理</p>
                                <p className={less.greenFont18}>{info.completeAmt}元</p>
                            </Col>
                            <Col span={3}className={less.marginLeft23}>
                                <p className={less.blackFont13}>退款</p>
                                <p className={less.blackFont18}>{info.refundAmt}元</p>
                            </Col>
                            <Col span={3}className={less.marginLeft23}>
                                <p className={less.blackFont13}>清分</p>
                                <p className={less.blackFont18}>{info.liquidationAmt}元</p>
                            </Col>
                            <Col span={3}className={less.marginLeft23}>
                                <p className={less.blackFont13NoBorder}>总来款金额</p>
                                <p className={less.blackFont18NoBorder}>{info.totalAmt}元</p>
                            </Col>
                        </Row>
                    </Card>
                    <Card>
                        <Tabs onTabClick={this.handleTabChange}>
                            <TabPane tab="待处理" key="1" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/xhFinanceHang/findFinanceApprovalForPage'
                                    tableState={this.state.tableState1}
                                    resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                                    baseParams={this.baseParams1}
                                    columns={this.columns()}
                                    scroll={{ x: 2200 }} />
                            </TabPane>
                            <TabPane tab="已完成" key="2" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/xhFinanceHang/findFinanceApprovalForPage'
                                    tableState={this.state.tableState2}
                                    resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                                    baseParams={this.baseParams2}
                                    columns={this.columns()}
                                    scroll={{ x: 2200 }} />
                            </TabPane>
                            <TabPane tab="待受理" key="3" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/xhFinanceHang/findFinanceApprovalForPage'
                                    tableState={this.state.tableState3}
                                    resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                                    baseParams={this.baseParams3}
                                    columns={this.columns()}
                                    scroll={{ x: 2200 }} />
                            </TabPane>
                            <TabPane tab="全部" key="0" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/xhFinanceHang/findFinanceApprovalForPage'
                                    tableState={this.state.tableState0}
                                    resetTable={(state) => { this.resetTable(state, 'tableState0') }}
                                    baseParams={this.baseParams0}
                                    columns={this.columns()}
                                    scroll={{ x: 2200 }} />
                            </TabPane>
                        </Tabs>
                </Card>
            </div>
        )
    }
}
export default xhFinanceHangApproval;