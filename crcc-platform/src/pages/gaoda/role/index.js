import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Card, Modal } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import ModalForm from './modalForm';

class Role extends React.Component {
  state = {
    loading: false,
    tableState: 0,
    pageList: [],
    modalVisible: false,
    modal: {
      visible: false,
      title: '新增角色',
      loading: false,
    },
    modalData: {},
  }
  _isMounted = false;
  /**查询条件 */
  baseParams = {}
  importantFilter = ['role_name'];
  formList = () => {
    return [
      {
        type: 'INPUT',
        field: 'role_name',
        label: '角色名称',
        placeholder: '角色名称'
      }
    ]
  }

  componentWillMount() {
    this._isMounted = true;
    // this.getPageList()
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  columns = () => {
    return [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        sorter: true
      },
      {
        title: '备注',
        dataIndex: 'roleRemark',
        key: 'roleRemark',
        sorter: true
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <span>
            <AuthButton elmType="a" onClick={() => { this.handleToEdit(record) }}>编辑</AuthButton>
            <span className="ant-divider"></span>
            <AuthButton elmType="a" onClick={() => { this.handleToDel(record) }}>删除</AuthButton>
          </span>)
      }
    ]
  }
  
  openModal = (boo) => {
    let visible = !!boo;
    this.setState({
      modalVisible: visible
    })
  }

  //添加
  addDepartment = () => {
    this.setState({
      modalData: {},
      modal: {
        ...this.state.modal,
        title: '新增角色'
      }
    })
    this.openModal(true)
  }
  //编辑
  handleToEdit = (data) => {
    this.setState({
      modalData: {
        role_name: data.roleName,
        role_remark:  data.roleRemark,
        ...data
      },
      modal: {
        ...this.state.modal,
        title: '编辑角色'
      }
    })
    this.openModal(true)
  }
  //保存-确定
  modalOnOk = (data) => {
    const _this = this;
    const modalData = {
      id: _this.state.modalData.id,
      ...data
    };
    const url = modalData.id ? '@/inquiry/gdrole/update' : '@/inquiry/gdrole/save';

    api.ajax('get', url, modalData)
    .then(res => {
      Util.alert(res.msg, { type: 'success' })
      _this.openModal(false)
      _this.reloadTableData(2);
    })
    .catch(err => {
      Util.alert(err.msg || "保存失败", { type: 'error' });
    })
  }
  //取消
  modalOnCancel = () => {
    this.openModal(false)
  }
  //删除
  handleToDel = (data) => {
    const _this = this;
    const {id, roleName } = data;

    Modal.confirm({
      title: `您是否确认要删除 ${roleName} 吗？`,
      onOk() {
        api.ajax('post', '@/inquiry/gdrole/delete', {
          id: id
        })
        .then(res => {
          Util.alert(res.msg, { type: 'success' });
          _this.reloadTableData(2);
        })
        .catch(res => {
          Util.alert(res.msg, { type: 'error' })
        })
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }
  handleFilter = (p, isSend = true) => {
    let createTimeStart, createTimeEnd;
    if (p.createTimeArr) {
      createTimeStart = p.createTimeArr[0] ? moment(p.createTimeArr[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      createTimeEnd = p.createTimeArr[1] ? moment(p.createTimeArr[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    }
    this.baseParams = {
      ...this.baseParams,
      ...p,
      createTimeStart,
      createTimeEnd
    }
    if (isSend) {
      this.reloadTableData();
    }
  }
  resetTable = (state, tableState = 'tableState') => {
    console.log('this is resetTable: ', state);
    
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  reloadTableData = (state = 1) => {
    this.handelToLoadTable(state, 'tableState');
  }
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }

  render() {
    return (
      <div>
        <Card bordered={false}>
          <BaseForm formList={this.formList()}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}></BaseForm>
          <div className="toolbar">
            <AuthButton type="primary" onClick={this.addDepartment}>新增</AuthButton>
          </div>
          <BaseTable
            url='@/inquiry/gdrole/getForPage'
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns()} />
        </Card>
        <ModalForm
          title={this.state.modal.title}
          visible={this.state.modalVisible}
          loading={this.state.modal.loading}
          onOk={this.modalOnOk}
          onCancel={this.modalOnCancel}
          data={this.state.modalData}
        ></ModalForm>
      </div>
    )
  }
}

export default Role