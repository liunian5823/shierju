import { Card, Table } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'

import less from './index.less';

class supplierCertification extends React.Component {
  state = {
    loading: false,
    dataSource: {},
    tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
  }

  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  importantFilter = ['recommendPerson', 'recommendCompanyName']

  formList = [
    {
      type: 'INPUT',
      field: 'companyName',
      label: '公司名称',
      placeholder: '公司名称'
    },
    {
      type: 'INPUT',
      field: 'legalPersonName',
      label: '法人姓名',
      placeHolder: '法人姓名'
    },
    {
      type: 'INPUT',
      field: 'phone',
      label: '联系电话',
      placeholder: '联系电话'
    },
    {
      type: 'INPUT',
      field: 'recommendCompanyName',
      label: '所推荐路局',
      placeholder: '所推荐路局'
    },
    {
      type: 'INPUT',
      field: 'recommendPerson',
      label: '推荐人',
      placeholder: '推荐人'
    },
    {
      type: 'RANGE',
      field: 'createTime',
      label: '推荐时间',
      placeHolder: '推荐时间'
    }
  ]

  handleFilter = (p, isSend = true) => {
    this.baseParams.page = 1;

    let createTimeStart, createTimeEnd
    if (p.createTime) {
      createTimeStart = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD') : '';
      createTimeEnd = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD') : '';
    }
    this.baseParams = {
      ...this.baseParams,
      ...p,
      createTime: '',
      createTimeStart,
      createTimeEnd
    }
    if (isSend) {
      this.handelToLoadTable();
    }
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

  columns = () => {
    return [
      {
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true
      },
      {
        title: '法人姓名',
        dataIndex: 'legalPersonName',
        key: 'legalPersonName',
        sorter: true
      },
      {
        title: '联系电话',
        dataIndex: 'recommendPhone',
        key: 'recommendPhone',
        sorter: true
      },
      {
        title: '所推荐路局',
        dataIndex: 'recommendCompanyName',
        key: 'recommendCompanyName',
        sorter: true
      },
      {
        title: '推荐人',
        dataIndex: 'recommendPerson',
        key: 'recommendPerson',
        sorter: true
      },

      {
        title: '推荐时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        render: (text, record) => (
          <div>
            {moment(record.createTime).format("YYYY-MM-DD")}
          </div>
        )
      }
    ]
  }

  render() {
    return (
      <Card bordered={false}>
        <BaseForm
          formList={this.formList}
          importantFilter={this.importantFilter}
          filterSubmit={this.handleFilter}
        ></BaseForm>
        <BaseTable
          url="@/supplier/ecRecommend/page"
          tableState={this.state.tableState}
          resetTable={(state) => { this.resetTable(state, 'tableState') }}
          baseParams={this.baseParams}
          columns={this.columns()}
        />
      </Card>
    )
  }
}

export default supplierCertification;