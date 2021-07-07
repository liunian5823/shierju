import { Card, Button, Modal } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable';

const confirm = Modal.confirm;

class Role extends React.Component {
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行

  state = {
    loading: false,
    tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
  }

  formList = [
    {
      type: 'INPUT',
      field: 'name',
      label: '角色名',
      placeholder: '请输入角色名',
    }
  ]

  importantFilter = ['role', 'name', 'tel']

  componentWillMount() {
    this._isMounted = true;
    // 进入页面加载数据
    // this.tableSearch()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFilter = (params, isSend = true) => {
    //根据formList生成的表单输入条件过滤
    this.baseParams = {
      ...this.baseParams,
      ...params,
    }
    if (isSend) {
      this.handelToLoadTable();
    }
  }

  handleToAdd = () => {
    this.props.history.push('/sys/roleEdit');
  }

  handleToEdit = (uuids) => {
    this.props.history.push('/sys/roleEdit' + '/' + uuids);
  }

  handleToDel = (uuids) => {
    let _this = this;
    confirm({
      title: '您是否确认要删除该条记录吗？',
      onOk() {
        _this.delSubmit(uuids)
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }

  delSubmit = (uuids) => {
    api.ajax('PUT', '@/sso/ecRole/delete', [
      uuids
    ]).then(r => {
      Util.alert(r.msg, { type: 'success' });
      this.handelToLoadTable(2);
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }


  handleToDetails = (uuids) => {
    this.props.history.push('/sys/roleDetails' + '/' + uuids);
    
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
   * 
   * *****/
  baseParams = {
    type: 5
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
  columns = [{
    title: '角色名',
    dataIndex: 'name',
    key: 'name',
    width: 200
  }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  }, {
    title: '人数',
    dataIndex: 'num',
    key: 'num',
    sorter: true,
    width: 80
  }, {
    title: '操作',
    key: 'options',
    width: 160,
    render: (text, record) => (
      <span>
        <a href="javascript:void(0)" onClick={() => this.handleToDetails(record.uuids)}>详情</a>
        <a href="javascript:void(0)" onClick={() => this.handleToEdit(record.uuids)}>修改</a>
        <a href="javascript:void(0)" onClick={() => this.handleToDel(record.uuids)}>删除</a>
      </span>
    ),
  }]

  render() {

    return (
      <Card bordered={false}>
        <div>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
        </div>
        <div className="toolbar">
          <Button type="primary" onClick={this.handleToAdd}>新增</Button>
        </div>
        <BaseTable
          url="@/sso/ecRole/page"
          tableState={this.state.tableState}
          resetTable={(state) => { this.resetTable(state, 'tableState') }}
          baseParams={this.baseParams}
          columns={this.columns}
        />
      </Card>
    )
  }
}

export default Role