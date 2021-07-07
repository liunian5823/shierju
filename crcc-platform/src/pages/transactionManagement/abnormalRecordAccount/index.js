import { Card, Button, Tabs } from 'antd';
import api from '@/framework/axios';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';

const TabPane = Tabs.TabPane;

class AbnormalRecordAccount extends React.Component{
  state = {
    loading: false,
    tableState1: 0,
    tableState2: 0,
  }

  _isMounted = false;
  activeTab = 1;

  importantFilter = ['inAcctIdName', 'createTime']
  
  formList = [
    {
      type: 'INPUT',
      field: 'inAcctIdName',
      label: '来款账号名称',
      placeholder: '请输入来款账号名称'
    },
    {
      type: 'INPUT',
      field: 'frontLogNo',
      label: '来款编号',
      placeholder: '请输入来款编号'
    },
    {
      type: 'INPUT',
      field: 'note',
      label: '来款附言',
      placeholder: '请输入来款附言'
    },
    {
      type: 'RANGE',
      field: 'createTime',
      label: '来款时间',
      placeHolder: '请筛选时间段'
    },
    {
      type: 'INPUT',
      field: 'minAmount',
      label: '最小来款金额',
      placeholder: '请输入最小来款金额'
    },
    {
      type: 'INPUT',
      field: 'maxAmount',
      label: '最大来款金额',
      placeholder: '请输入最大来款金额'
    },
    {
      type: 'INPUT',
      field: 'inAcctId',
      label: '来款账号',
      placeHolder: '来款账号'
    }
  ]

  handleFilter = (p, isSend = true) => {

    let startDate, endDate;
    if (params.times) {
      startDate = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      endDate = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }
    let key = this.activeTab;
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      ...p,
      startDate,
      endDate
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
  baseParams2 = {
  }

  columns1 = [
    {
      title: '来款编号',
      dataIndex: 'lkbh',
      key: 'lkbh',
      sorter: true
    },
    {
      title: '来款账号',
      dataIndex: 'lkzh',
      key: 'lkzh',
      sorter: true
    },
    {
      title: '来款账户名称',
      dataIndex: 'lkzhmc',
      key: 'lkzhmc',
      sorter: true
    },
    {
      title: '来款附言',
      dataIndex: 'lkfy',
      key: 'lkfy',
      sorter: true
    },
    {
      title: '金额',
      dataIndex: 'je',
      key: 'je',
      sorter: true
    },
    {
      title: '来款时间',
      dataIndex: 'lksj',
      key: 'lksj',
      sorter: true
    },
    {
      title: '匹配订单数',
      dataIndex: 'ppdds',
      key: 'ppdds',
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      render: (text, record)=>{
        return (<a href="javascript:void(0);" onClick={()=>{this.handleToDetails(record.uuids)}}>处理</a>);
      }
    }
  ]
  columns2 = [
    {
      title: '来款编号',
      dataIndex: 'lkbh',
      key: 'lkbh',
      sorter: true
    },
    {
      title: '来款账号',
      dataIndex: 'lkzh',
      key: 'lkzh',
      sorter: true
    },
    {
      title: '来款账户名称',
      dataIndex: 'lkzhmc',
      key: 'lkzhmc',
      sorter: true
    },
    {
      title: '来款时间',
      dataIndex: 'lksj',
      key: 'lksj',
      sorter: true
    },
    {
      title: '金额',
      dataIndex: 'je',
      key: 'je',
      sorter: true
    },
    {
      title: '处理方式',
      dataIndex: 'clfs',
      key: 'clfs',
      sorter: true
    },
    {
      title: '经办人',
      dataIndex: 'jbr',
      key: 'jbr',
      sorter: true
    },
    {
      title: '处理时间',
      dataIndex: 'clsj',
      key: 'clsj',
      sorter: true
    },
    {
      title: '订单号',
      dataIndex: 'ddh',
      key: 'ddh',
      sorter: true
    },
    {
      title: '来款单位',
      dataIndex: 'lkdw',
      key: 'lkdw',
      sorter: true
    },
    {
      title: '应用项目',
      dataIndex: 'yyxm',
      key: 'yyxm',
      sorter: true
    },
    {
      title: '供应商名称',
      dataIndex: 'gysmc',
      key: 'gysmc',
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      render: (text, record)=>{
        return (<a href="javascript:void(0);" onClick={()=>{this.handleToDetails(record.uuids)}}>查看</a>);
      }
    }
  ]
  
  
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



  handleToDetails = (id) => {
    this.props.history.push('/transaction/handle' + '/' + id)
  }
  handleToAudit = (id) => {
    this.props.history.push('/auditManagement/auditForBasic' + '/' + id)
  }

  handleChangeTab = (key) => {
    this.activeTab = key;
    this.reloadTableData();
  }

  render(){
    return(
      <div>
        <Card bordered={false} className="mb10">
          <BaseForm
            formList={this.formList} 
            importantFilter={this.importantFilter} 
            filterSubmit={this.handleFilter}
          ></BaseForm>
        </Card>
        <Card bordered={false}>
          <div className="toolbar">
            <Button type="primary">导出</Button>
          </div>
          <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}> 
            <TabPane tab="待处理" key="1">
              <BaseTable
                url='@/microservice-finance/ecFinanceHang/preparePage'
                tableState={this.state.tableState1}
                resetTable={(state)=>{this.resetTable(state,'tableState1')}}
                baseParams={this.baseParams1}
                columns={this.columns1}/>
            </TabPane>
            <TabPane tab="已处理" key="2">
              <BaseTable
                url='@/microservice-finance/ecFinanceHang/areadyPage'
                tableState={this.state.tableState2}
                resetTable={(state)=>{this.resetTable(state,'tableState2')}}
                baseParams={this.baseParams2}
                columns={this.columns2}/>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    )
  }
}
export default AbnormalRecordAccount