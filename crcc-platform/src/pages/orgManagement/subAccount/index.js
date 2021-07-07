import { Card, Switch, Icon, Button, Modal } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import AuthButton from '@/components/authButton'
import ModalForm from './modalForm'
import less from './index.less'

const confirm = Modal.confirm;

class Details extends React.Component {

  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行

  state = {
    loading: false,
    // 
    tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    roleList: [],
    //弹窗
    modal: {
      show: false,
      uuids: '',
      title: ''
    },
  }

  renderFormList = () => {
    return [
      {
        type: 'SELECT',
        field: 'roleId',
        label: '角色',
        placeholder: '请选择角色',
        list: this.state.roleList,
        listLabel: 'name',//select的显示内容
        listKey: 'id',//select的value
      },
      {
        type: 'INPUT',
        field: 'username',
        label: '姓名',
        placeholder: '请输入姓名'
      },
      {
        type: 'INPUT',
        field: 'phone',
        label: '手机号',
        placeholder: '请输入手机号'
      },
      {
        type: 'INPUT',
        field: 'email',
        label: '邮箱',
        placeholder: '请输入邮箱'
      },
      {
        type: 'SELECT',
        field: 'gender',
        label: '性别',
        placeholder: '请选择',
        list: [{ id: '1', value: '男' }, { id: '0', value: '女' }]
      },
      {
        type: 'SELECT',
        field: 'state',
        label: '状态',
        placeholder: '请选择',
        list: [{ id: '1', value: '启用' }, { id: '2', value: '禁用' }]
      },
      {
        type: 'RANGETIME',
        field: 'times',
        label: '创建时间',
        placeholder: '请选择筛选时间段'
      },
    ]
  }

  importantFilter = ['roleId', 'username']

  componentWillMount() {
    this._isMounted = true;
    // 进入页面加载数据
    this.getBaseData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //获得角色信息
  getBaseData = () => {
    api.ajax('GET', '@/sso/ecRole/page', {
      queryPurAdminFlag: 2,
      type: "5"
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        roleList: r.data.rows
      })
    }).catch(r => {
    })
  }


  handleFilter = (params, isSend = true) => {
    //根据formList生成的表单输入条件过滤
    let createTimeStartStr, createTimeEndStr;
    if (params.times) {
      createTimeStartStr = params.times[0] ? moment(params.times[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      createTimeEndStr = params.times[1] ? moment(params.times[1]).format('YYYY-MM-DD HH:mm:ss') : '';
	  delete params.times
    }
    this.baseParams = {
      ...this.baseParams,
      ...params,
      createTimeStartStr,
      createTimeEndStr
    }
    if (isSend) {
      this.handelToLoadTable();
    }
  }


  //新增
  handleToAdd = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        title: '新增',
        uuids: '',
        show: true
      }
    })
  }

  //修改
  handleToEdit = (uuids) => {
    this.setState({
      modal: {
        ...this.state.modal,
        title: '修改',
        uuids: uuids,
        show: true
      }
    })
  }

  handleChangeStatus = (record, checked) => {
    let state = checked ? 1 : 2;
    let _this = this;
    let msg = state == 1 ? '该账号将恢复使用，是否确认开启？' : '关闭账号后，该账号将无法登陆，是否确认关闭？';
    confirm({
      title: '该操作将修改账户状态',
      content: msg,
      onOk() {
        _this.statusSubmit(record, state)
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }

  statusSubmit = (record, state) => {
    api.ajax('POST', '@/sso/ecUser/changeState', {
		id:record.id,
		companyId:record.companyId,
		subPlatformId:5,
		uuids:record.uuids,
		state: state
    }).then(r => {
      if (!this._isMounted) {
        //如果没有被挂载 终止ajax
        return;
      }
      Util.alert(r.msg, { type: 'success' });
      this.handelToLoadTable(2);
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.handelToLoadTable(2);
    })
  }

  handleToDel = (uuids) => {
    let _this = this;
    confirm({
      title: '该操作将删除账户',
      content: '删除子账号后该账号将无法登陆，是否确认删除？',
      onOk() {
        _this.delSubmit(uuids)
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }

  delSubmit = (uuids) => {
    api.ajax('PUT', '@/sso/ecUser/delete', {
      uuids
    }).then(r => {
      Util.alert(r.msg, { type: 'success' });
      this.handelToLoadTable(2);
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }

  handleToDetails = (uuids,managerFlag) => {
    this.props.history.push(this.props.history.location.pathname + '/details' + '/' + uuids+'/'+managerFlag);
  }

  //打开关闭弹窗
  openModal = (ok) => {
    let show = ok ? true : false;
    this.setState({
      modal: {
        ...this.state.modal,
        show
      },
    })
  }

  //弹窗事件
  modalHandle = (ok, params) => {
    if (ok) {
      // 保存
      this.handelToLoadTable(2);
    } else {
      this.openModal(ok)
      if (params == 'success') {
        this.handelToLoadTable(2);
      }
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
    userType: 5,
    subPlatformId: 5
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
    title: '姓名',
    dataIndex: 'username',
    key: 'username',
    sorter: true,
    width: 100
  }, {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    sorter: true,
    width: 60,
    render: (text, record) => {
      if (text == 1) {
        return <span>男</span>
      } else if (text == 0) {
        return <span>女</span>
      } else {
        return '-'
      }
    },
  }, {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName',
    width: 150,
    sorter: true,
    render: (text, record, index) => {
      if (text.length < 18) {
        return <span>{text}</span>
      } else {
        return <span title={text}>{text.substring(0, 18)}...</span>
      }
    }
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    sorter: true,
    width: 100,
  }, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
    width: 160
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true,
    width: 180,
    render: (text, record, index) => (
      <span>{record.createTimeStr}</span>
    )
  }, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    filters: [{
      text: '启用',
      value: 1,
    }, {
      text: '禁用',
      value: 2,
    }],
    onFilter: (value, record) => {
      if (value == record.state) {
        return true
      } else {
        return false
      }
    },
    width: 80,
    render: (text, record, index) => {
		return <AuthButton elmType="switch" elmName="启用" checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} checked={text == 1 ? true : false} onChange={(checked) => { this.handleChangeStatus(record, checked) }} disabled={record.managerFlag == 1}/>
      },
  }, {
    title: '操作',
    key: 'options',
    width: 160,
    render: (text, record) => {
      if (record.managerFlag == 1) {
        return <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids,record.managerFlag)}>详情</AuthButton>
      } else {
        return (
          <span>
            <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids,record.managerFlag)}>详情</AuthButton>
            <span className="ant-divider"></span>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToDetails(record.uuids)}>详情</a> */}
            <AuthButton elmType="a" onClick={() => this.handleToEdit(record.uuids)}>修改</AuthButton>
            <span className="ant-divider"></span>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToEdit(record.uuids)}>修改</a> */}
            <AuthButton elmType="a" onClick={() => this.handleToDel(record.uuids)}>删除</AuthButton>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToDel(record.uuids)}>删除</a> */}
          </span> 
        )
      }
    }
  }]


  render() {
    return (
      <div>
        <Card bordered={false}>
          <div>
            <BaseForm
              formList={this.renderFormList()}
              importantFilter={this.importantFilter}
              filterSubmit={this.handleFilter}
            />
          </div>
          <div className="toolbar">
            <AuthButton type="primary" onClick={this.handleToAdd}>新增</AuthButton>
            {/* <Button type="primary" onClick={this.handleToAdd}>新增</Button> */}
          </div>
          <BaseTable
            url="@/platform/ecUser/page"
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns}
            indexkeyWidth={60}
          />
        </Card>
        <ModalForm
          title={this.state.modal.title}
          visible={this.state.modal.show}
          onOk={this.modalHandle}
          uuids={this.state.modal.uuids}
          roleList={this.state.roleList}
        />
      </div>
    )
  }
}

export default Details