import { Card, Modal } from 'antd'
import AuthButton from '@/components/authButton'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import less from './index.less'

const confirm = Modal.confirm;

class Role extends React.Component {
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行

  state = {
    _loading: false,

    tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
  }

  formList = [
    {
      type: 'INPUT',
      field: 'name',
      label: '角色',
      placeholder: '请输入角色',
    }
  ]

  importantFilter = ['name']

  componentWillMount() {
    this._isMounted = true;
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
    this.props.history.push(this.props.history.location.pathname + '/edit');
  }

  handleToEdit = (uuids,id) => {
    this.props.history.push(this.props.history.location.pathname + '/edit' + '/' + uuids+'/'+id);
  }

  handleToDel = (record) => {
    if (record.num > 0) {
      Util.alert('删除角色前请将人员清空', { type: 'error' })
      return
    }
    let _this = this;
    confirm({
      title: '该操作将删除角色',
      content: '是否确认删除该角色？',
      onOk() {
        _this.delSubmit(record.uuids)
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

  handleToDetails = (uuids,id) => {
    this.props.history.push(this.props.history.location.pathname + '/details/' + uuids+'/'+id);
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
    title: '角色',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    width: 200
  }, {
    title: '权限',
    dataIndex: 'premesName',
    key: 'premesName',
    sorter: true,
    width: 500
  }, {
    title: '人数',
    dataIndex: 'num',
    key: 'num',
    sorter: true,
    width: 100
  }, {
    title: '操作',
    key: 'options',
    width: 200,
    render: (text, record) => {
      if (record.roleFlag == 1) {
        //系统角色
        return <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids,record.id)}>详情</AuthButton>
      } else {
        return (
          <span>
            <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids,record.id)}>详情</AuthButton>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToDetails(record.uuids)}>详情</a> */}
            <span className="ant-divider"></span>
            <AuthButton elmType="a" onClick={() => this.handleToEdit(record.uuids,record.id)}>修改</AuthButton>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToEdit(record.uuids)}>修改</a> */}
            <span className="ant-divider"></span>
            <AuthButton elmType="a" onClick={() => this.handleToDel(record)}>删除</AuthButton>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToDel(record.uuids)}>删除</a> */}
          </span>
        )
      }
    },
  }]

  render() {
    return (
      <Card bordered={false}>
        <div>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
        </div>
        <div className="toolbar">
          <AuthButton type="primary" onClick={this.handleToAdd}>新增</AuthButton>
          {/* <Button type="primary" onClick={this.handleToAdd}>新增</Button> */}
        </div>
        <BaseTable
          url="@/sso/ecRole/page"
          tableState={this.state.tableState}
          resetTable={(state) => { this.resetTable(state, 'tableState') }}
          baseParams={this.baseParams}
          columns={this.columns}
          indexkeyWidth={120}
        />
      </Card>
    )
  }
}

export default Role