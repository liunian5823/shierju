import { Card, Button, Tabs, Alert } from 'antd';
import api from '@/framework/axios';
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getUrlByParam} from '@/utils/urlUtils';

import less from './index.less';

const TabPane = Tabs.TabPane;

class queryBackLogByName extends React.Component {
  state = {
    loading: false,
    tableState1: 0,
    tableState2: 0,
    tableState3: 0,
    tableState7: 0,
    total1:0,
    total2:0,
    total3:0,
    totalSupplierQuantity: 0,
    mainCommodityData: []
  }

  _isMounted = false;
  activeTab = 1;

  importantFilter = [ 'nameOrphone','createTime']

  formList = () => [
    {
      type: 'INPUT',
      field: 'nameOrphone',
      placeholder: '供应商名称/管理员姓名/管理员手机号'
    }
  ]

  handleFilter = (p, isSend = true) => {

    let createTimeStart, createTimeEnd, approvalDateStart, approvalDateEnd;
    if (p.createTime) {
      createTimeStart = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      createTimeEnd = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }

    if (p.approvalDate) {
      approvalDateStart = p.approvalDate[0] ? moment(p.approvalDate[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      approvalDateEnd = p.approvalDate[1] ? moment(p.approvalDate[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }

    let key = this.activeTab;
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      ...p,
      createTimeStart,
      createTimeEnd,
      approvalDateStart,
      approvalDateEnd
    }
    if (isSend) {
      this.reloadTableData();
    }
  }

  componentWillMount() {
    this._isMounted = true;
    this.getTotalData('待审核','total1');
    this.getMainCommodityData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  // 获取主营商品数据信息
  getMainCommodityData = () => {
    let _this = this;
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('GET', '@/base/ecGoodsClass/all', {
      level: 1
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        loading: false,
        mainCommodityData: r.data.rows
      })
    }).catch(r => {
      this.setState({
        loading: false
      })
    })
  }

  baseParams1 = {
    //status: '待审核'
    querysort: "createTime",
    order: "desc"
  }
  baseParams2 = {
    status: '审核不通过'
  }
  baseParams3 = {
    status: '审核通过'
  }
  baseParams7 = {
  }
  columns = (params) => {
    if (params == 'paramsOne') {
      return [
        {
          title: '公司名称',
          dataIndex: 'name',
          key: 'name',
          witdh: 120,
          sorter: true
        },
        {
          title: '管理员',
          dataIndex: 'adminName',
          key: 'adminName',
          witdh: 120,
          sorter: true
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          key: 'phone',
          witdh: 160,
          sorter: true,
          render: (text, record) => {
            return text ? text.substring(0, 19):'--';
          }
        },
        {
          title: '业务类型',
          dataIndex: 'businessType',
          key: 'businessType',
          witdh: 90,
          sorter: true
        },
        {
          title: '事项',
          dataIndex: 'backMatter',
          key: 'backMatter',
          witdh: 90,
          sorter: true
        },
        {
          title: '申请时间',
          dataIndex: 'createTime',
          key: 'createTime',
          witdh: 90,
          sorter: true,
          render: (text, record) => {
            return text ? text.substring(0, 10) :'--' ;
          }
        },
        {
          title: '处理时间',
          dataIndex: 'dealTime',
          key: 'dealTime',
          witdh: 90,
          sorter: true,
          render: (text, record) => {
            return text ? text.substring(0, 10):'--' ;
          }
        },
        {
          title: '办理人',
          dataIndex: 'dealPerson',
          key: 'dealPerson',
          witdh: 90,
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          witdh: 90,
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'x',
          witdh: 80,
          key: 'x',
          render: (text, record) => {
            if (record.status == "已处理") {
              return <AuthButton elmType="a" onClick={() => { this.handleToDetails(record.uuids,record.backMatter,record.checkuuids) }}>查看</AuthButton>
            } else{
              return (
                <span>
                  <AuthButton elmType="a" onClick={() => { this.handleToDetails(record.uuids,record.backMatter,record.checkuuids) }}>查看</AuthButton>
                  <span className="ant-divider"></span>
                  <AuthButton elmType="a" onClick={() => {this.handleToAudit(record.uuids,record.backMatter,record.checkuuids) }}>处理</AuthButton>
                </span>
              )
            }
          }
        }
      ]
    }
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
  handleToDetails = (id,backMatter,checkuuids) => {
    if(backMatter.indexOf('基础审核') != -1) {
      this.props.history.push('/auditManagement/basicAudit' + '/details' + '/' + id + '/' + record.workOrdersState);
    }else if(backMatter.indexOf('背景审核') != -1) {
      this.props.history.push('/auditManagement/backgroundAudit' + '/details' + '/' + id);
    }else {
      this.props.history.push('/auditManagement/RCBasicAudit' + '/details' + '/' + checkuuids);
    }
    //window.open(systemConfigPath.jumpPage(getUrlByParam('/auditManagement/basicAudit' + '/details' + '/' + id,params)));
    //this.props.history.push(this.props.history.location.pathname + '/details' + '/' + id)
  }
  handleToAudit = (id,backMatter,checkuuids) => {
    if(backMatter == "基础审核待审核") {
      this.props.history.push(this.props.history.location.pathname + '/audit' + '/' + id);
    }else if(backMatter == "背景审核待审核") {
      this.props.history.push(this.props.history.location.pathname + '/audits' + '/' + id);
    }else {
      this.props.history.push(this.props.history.location.pathname + '/auditss' + '/' + checkuuids);
    }
  }

  handleChangeTab = (key) => {
    this.activeTab = key;
    if (key == 1) {
      this.getTotalData('待审核','total1');
    } else if (key == 2) {
      this.getTotalData('审核不通过','total2');
    } else if (key == 3) {
      this.getTotalData('审核通过','total3');
    }
    this.reloadTableData();
  }

  //获得当前筛选项目供应商总数量
  getTotalData = (status, key) => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecUserApprovalLog/basicAuditCount', {
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

  render() {
    return (
      <div>
        <Card bordered={false}>
          <BaseForm
            formList={this.formList()}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}
          ></BaseForm>
          {/*<div className="toolbar">
            <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
          </div>*/}
              <BaseTable
                url='@/supplier/ecUserApprovalLog/queryBackLogByName'
                tableState={this.state.tableState1}
                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                baseParams={this.baseParams1}
                columns={this.columns("paramsOne")} />
        </Card>
      </div>
    )
  }
}

export default queryBackLogByName