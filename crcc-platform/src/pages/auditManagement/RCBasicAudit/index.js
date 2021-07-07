import { Card, Alert, Tabs } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {systemConfigPath} from "@/utils/config/systemConfig";
import less from './index.less';

const TabPane = Tabs.TabPane;
class RCBasicAudit extends React.Component {
  state = {
    _loading: false,
    tableState1: 0,
    tableState2: 0,
    tableState3: 0,
    total1:0,
    total2:0,
    total3:0,
    totalSupplierQuantity: 0,
    mainCommodityData: []
  }

  _isMounted = false;
  activeTab = 1;

  importantFilter = ['name', 'createTime']

  formList = () => [
    {
      type: 'RANGE',
      field: 'applyTime',
      label: '申请时间',
      placeHolder: '请筛选时间段'
    },
    {
      type: 'INPUT',
      field: 'name',
      label: '公司名称',
      placeholder: '请输入公司名称'
    },
    {
      type: 'SELECT',
      field: 'factoryType',
      label: '供应商类型',
      list: [
        {
          id: '1',
          value: '厂家'
        },
        {
          id: '2',
          value: '贸易集成商'
        },
        {
          id: '3',
          value: '个体户'
        }
      ]
    },
    {
      type: 'SELECT',
      field: 'exportQualification',
      label: '出口资质',
      placeholder: '出口资质',
      list: [
        {
          id: '1',
          value: '有出口资质'
        },
        {
          id: '2',
          value: '无出口资质'
        }
      ]
    },
    {
      type: 'INPUT',
      field: 'legalPersonName',
      label: '法人姓名',
      placeHolder: '法人姓名'
    },
    {
      type: 'SELECT',
      field: 'mainBusiness',
      label: '经营类目',
      placeholder: '经营类目',
      list: this.state.mainCommodityData,
      listLabel: 'name',//select的显示内容
      listKey: 'id',//select的value
    },
    {
      type: 'SELECT',
      field: 'source',
      label: '供应商来源',
      placeholder: '供应商来源',
      list: [
        {
          id: '0',
          value: '自主注册'
        },
        {
          id: '3',
          value: '平台注册'
        },
        {
          id: '4',
          value: '广联达'
        }
      ]
    },
    {
      type: 'INPUT',
      field: 'approvalUser',
      label: '审核人',
      placeholder: '审核人'
    },
    {
      type: 'RANGETIME',
      field: 'auditTime',
      label: '审核时间',
      placeHolder: '请筛选时间段'
    },
  ]


  componentWillMount() {
    this._isMounted = true;
    this.getTotalData('待审核', 'total1');
    this.getMainCommodityData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChangeTab = (key) => {
    this.activeTab = key;
    if (key == 1) {
      this.getTotalData('待审核', 'total1');
    } else if (key == 2) {
      this.getTotalData('审核不通过', 'total2');
    } else if (key == 3) {
      this.getTotalData('审核通过', 'total3');
    }
    this.reloadTableData();
  }

  handleFilter = (p, isSend = true) => {
    let createTimeStart, createTimeEnd, approvalDateStart, approvalDateEnd,applyTimeStart,applyTimeEnd;
    if (p.createTime) {
      createTimeStart = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      createTimeEnd = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }

    if (p.auditTime) {
      approvalDateStart = p.auditTime[0] ? moment(p.auditTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      approvalDateEnd = p.auditTime[1] ? moment(p.auditTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }

    if (p.applyTime) {
      applyTimeStart = p.applyTime[0] ? moment(p.applyTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      applyTimeEnd = p.applyTime[1] ? moment(p.applyTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }

    let key = this.activeTab;
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      ...p,
      createTimeStart,
      createTimeEnd,
      approvalDateStart,
      approvalDateEnd,
      applyTimeEnd,
      applyTimeStart
    }
    if (isSend) {
      this.reloadTableData();
    }
  }

  

  // 获取主营商品数据信息
  getMainCommodityData = () => {
    let _this = this;
    if (this.state._loading) return false;
    this.setState({
      _loading: true,
    })
    api.ajax('GET', '@/base/ecGoodsClass/all', {
      level: 1
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        _loading: false,
        mainCommodityData: r.data.rows
      })
    }).catch(r => {
      this.setState({
        _loading: false
      })
    })
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
  baseParams1 = {
    status: '待审核'
  }
  baseParams2 = {
    status: '审核不通过'
  }
  baseParams3 = {
    status: '审核通过'
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
  columns = (params) => {
    if (params == 'paramsOne') {
      return [
        {
          title: '公司名称',
          dataIndex: 'name',
          key: 'name',
          sorter: false
        },
        {
          title: '法人姓名',
          dataIndex: 'legalPersonName',
          key: 'legalPersonName',
          sorter: false
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          key: 'applyTime',
          width:180,
          sorter: true
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          key: 'status',
          width:120,
          sorter: false
        },
        {
          title: '操作',
          dataIndex: 'x',
          key: 'x',
          width:120,
          render: (text, record) => (
            <span>
              <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids)}>详情</AuthButton>
              <span className="ant-divider"></span>
              <AuthButton elmType="a" onClick={() => this.handleToAudit(record.uuids)}>审核</AuthButton>
            </span>
          )
        }
      ]
    }else{
      return [
        {
          title: '公司名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '法人姓名',
          dataIndex: 'legalPersonName',
          key: 'legalPersonName'
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          key: 'applyTime',
          width:180,
          sorter: true
        },
        {
          title: '审核人',
          dataIndex: 'approvalUser',
          key: 'approvalUser'
        },
        {
          title: '审核时间',
          dataIndex: 'approvalDate',
          key: 'approvalDate',
          width:180,
          sorter: true
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          key: 'status',
          width:120
        },
        {
          title: '操作',
          dataIndex: 'x',
          key: 'x',
          width:80,
          render: (text, record) => (
            <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids)}>详情</AuthButton>
          )
        }
      ]
    }
  }

  handleToDetails = (id) => {
    window.open(window.location.href.split('#/')[0]+'#' + this.props.history.location.pathname + '/details' + '/' + id);
  }
  handleToAudit = (id) => {
    this.props.history.push(this.props.history.location.pathname + '/audit' + '/' + id);
  }

  //
  getTotalData = (status, key) => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecCompanyCheck/queryAgainBasicAuditCount', {
      status
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        [key]: r.data
      })
    }).catch(r => {
    })
  }

  //导出
  handleToExport = () => {
    let params = '';
    for (let index in this.baseParams) {
      params += index + '=' + this.baseParams[index] + '&'
    }
    window.open(
      window.location.origin +
      '/api' +
      '/supplier/ecCompanyCheck/export'
    )
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowCheckSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys
        })
      }
    }
    return (
      <div>
        <Card bordered={false}>
          <BaseForm
            formList={this.formList()}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}
          ></BaseForm>
          <div className="toolbar">
            <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
          </div>
          <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
            <TabPane tab="待审核" key="1">
              <Alert message={"供应商数量：" + this.state.total1} type="info" showIcon />
              <BaseTable
                url='@/supplier/ecCompanyCheck/basicAuditPage'
                tableState={this.state.tableState1}
                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                baseParams={this.baseParams1}
                columns={this.columns('paramsOne')} />
            </TabPane>
            <TabPane tab="驳回记录" key="2">
              <Alert message={"供应商数量：" + this.state.total2} type="info" showIcon />
              <BaseTable
                url='@/supplier/ecCompanyCheck/basicAuditPage'
                tableState={this.state.tableState2}
                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                baseParams={this.baseParams2}
                columns={this.columns('paramsTwo')} />
            </TabPane>
            <TabPane tab="通过记录" key="3">
              <Alert message={"供应商数量：" + this.state.total3} type="info" showIcon />
              <BaseTable
                url='@/supplier/ecCompanyCheck/basicAuditPage'
                tableState={this.state.tableState3}
                resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                baseParams={this.baseParams3}
                columns={this.columns('paramsThree')} />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    )
  }
}

export default RCBasicAudit