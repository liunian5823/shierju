import { Card, Button, Switch,Modal,Tabs,Row,Col } from 'antd';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import BaseForm from '@/components/baseForm';
import { systemConfigPath} from '@/utils/config/systemConfig'
class ContractGoodsList extends React.Component {
    state = {
        tableState: 0,//tableState0//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页
        visible:false,
        page:1,
        rows:10
    }

    _isMounted = false;

    componentWillMount() {
        this._isMounted = true;
        this.handelToLoadTable(1, 'tableState');
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**查询条件 */
    importantFilter = ['contractName', 'contractNo'];

    formList = () => {
        return [
            {
                type: 'INPUT',
                field: 'contractName',
                label: '合同名称',
                placeholder: '请输入合同名称'
            },
            {
                type: 'INPUT',
                field: 'contractNo',
                label: '采购合同号',
                placeholder: '请输入采购合同号'
            },
            {
                type: 'INPUT',
                field: 'buyerCompanyName',
                label: '采购公司名称',
                placeholder: '请输入采购公司名称'
            },
            {
                type: 'INPUT',
                field: 'spec',
                label: '型号',
                placeholder: '请输入型号'
            },

            {
                type: 'SELECT',
                field: 'status',
                label: '状态',
                placeholder: '请选择状态',
                list: [
                    {
                        id: '10',
                        value: '待关联'
                    },
                    {
                        id: '20',
                        value: '待提交'
                    },
                    {
                        id: '30',
                        value: '待审核'
                    },
                    {
                        id: '40',
                        value: '待上架'
                    },
                    {
                        id: '50',
                        value: '审核驳回'
                    },
                    {
                        id: '60',
                        value: '已上架'
                    },
                    {
                        id: '70',
                        value: '已下架'
                    }
                ]
            }
        ]
    }


    handleFilter = (params, isSend = true) => {
        this.baseParams = {
            ...params
        }
        if(isSend){
            this.handelToLoadTable();
        }
    }


    baseParams = {};



    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }

    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }
    columns = () => {
        return [
            {
                title: '合同名称',
                dataIndex: 'contractName',
                key: 'contractName',
                width: 150,
                sorter: true
            }, {
                title: '采购公司名',
                dataIndex: 'buyerCompanyName',
                key: 'buyerCompanyName',
                width: 150,
                sorter: true,
            }, {
                title: '采购合同编号',
                dataIndex: 'buyerContractNo',
                key: 'buyerContractNo',
                width: 150,
                sorter: true,
            }, {
                title: '供应商名',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: 150,
                sorter: true,
            }, {
                title: '商品名称',
                dataIndex: 'brand',
                key: 'brand',
                width: 100,
                sorter: true,
            }, {
                title: '品牌',
                dataIndex: 'spec',
                key: 'spec',
                width: 100,
                sorter: true,
            },{
                title: '型号',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                width: 100,
                sorter: true,
            }, {
                title: '税率',
                dataIndex: 'goodsNameOld',
                key: 'goodsNameOld',
                width: 150,
                sorter:true,
            }, {
                title: '成本单价（不含税）',
                dataIndex: 'showCompanyName',
                key: 'showCompanyName',
                width: 150,
                sorter:true,
            }, {
                title: '税额',
                dataIndex: 'showCompanyName',
                key: 'showCompanyName',
                width: 150,
                sorter:true,
            }, {
                title: '价税合计',
                dataIndex: 'showCompanyName',
                key: 'showCompanyName',
                width: 150,
                sorter:true,
            }, {
                title: '状态',
                dataIndex: 'showCompanyName',
                key: 'showCompanyName',
                width: 150,
                sorter:true,
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'x',
                width: 150,
                fixed: 'right',
                render: (text, record) => (
                    <div>
                        <AuthButton  elmType="a" onClick={this.toDetail.bind(this, record.uuids, record.status)}>查看</AuthButton>
                        {record.status==30 ? <span><span className="ant-divider"></span>  <AuthButton  elmType="a" onClick={this.toDetail.bind(this, record.uuids, record.status)}>审核</AuthButton> </span>: ''}
                    </div>
                )
            }
        ]
    }

    //
    toDetail=(uuids, status)=>{
        if (uuids){
            window.open(systemConfigPath.jumpPage('/firsthand/contractGoodsDetail?uuids=' + uuids + '&status=' + status));
        }
    }


    render() {
        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                </Card>
                <Card>
                    <BaseTable
                        notInit={true}
                        url='@/platform/firsthand/goods/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns()}
                        scroll={{ x: 900 }} />

                </Card>
            </div>
        )
    }
}
export default ContractGoodsList;