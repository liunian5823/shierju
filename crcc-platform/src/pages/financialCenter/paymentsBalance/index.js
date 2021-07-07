import { Card, Button } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';

class paymentsBalance extends React.Component{
  state = {
    loading: false,
    tableState1: 0,
  }
  _isMounted = false;
  importantFilter = ['companyId', 'createTime'];
  formList = [
    {
      type: 'INPUT',
      field: 'companyId',
      label: '收款方',
      placeHolder: '请输入收款方'
    },
    {
      type: 'INPUT',
      field: 'createUserId',
      label: '付款方',
      placeHolder: '请输入付款方'
    },
    {
      type: 'RANGE',
      field: 'createTime',
      label: '打款日期',
      placeHolder: '请筛选时间段'
    },
    {
      type: 'INPUT',
      field: 'bankHtId',
      label: '流水号',
      placeHolder: '请输入流水号'
    }
  ]
  handleFilter = (p, isSend = true) => {
    let createStartDate, createEndDate;
    if (p.createTime) {
      createStartDate = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      createEndDate = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }
    this['baseParams1'] = {
      ...this['baseParams1'],
      ...p,
      createStartDate,
      createEndDate
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

  }
  columns = () => {
    return [
      {
        title: '公司编号',
        dataIndex: 'companyNo',
        key: 'companyNo',
      },
      {
        title: '采购商/供应商',
        dataIndex: 'companyType',
        key: 'companyType',
        render: (text, record)=>{
          return(
            <span>
              {record.companyType==1?'采购商':record.companyType==2?'供应商':''}
            </span>
          )
        }
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName'
      },
      {
        title: '开通时间',
        dataIndex: 'creatTime',
        key: 'creatTime',
        sorter: true
      },
      {
        title: '可提现金额',
        dataIndex: 'withdrawMoney',
        key: 'withdrawMoney',
        sorter: true
      },
      {
        title: '冻结金额',
        dataIndex: 'frozenMoney',
        key: 'frozenMoney',
        sorter: true
      },
      {
        title: '总金额',
        dataIndex: 'totalAmt',
        key: 'totalAmt',
        sorter: true
      },
      {
        title: '在途金额',
        dataIndex: 'wayMoney',
        key: 'wayMoney',
        sorter: true
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (text, record)=>{
          return(
            <a href="javascript:void(0);">查看</a>
          )
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
    this.handelToLoadTable(state, 'tableState1');
  }
  render(){
    return(
      <div>
        <Card bordered={false}>
          <BaseForm
            formList={this.formList}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}/>
          <div className="toolbar">
            <Button type="primary">导出</Button>
          </div>
          <BaseTable
            url='@/microservice-finance/ecFinanceInfoLog/platformDetailPage'
            tableState={this.state.tableState1}
            resetTable={(state)=>{this.resetTable(state,'tableState1')}}
            baseParams={this.baseParams1}
            columns={this.columns()}/>  
        </Card>
      </div>
    )
  }
}
export default paymentsBalance