import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Card, Modal } from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import ModalForm from './modalForm';

class Staff extends React.Component {
  state = {
    loading: false,
    tableState: 0,
    pageList: [],
    modalVisible: false,
    modal: {
      title: '添加部门',
      loading: false,
    },
    modalData: {},
  }
  _isMounted = false;
  /**查询条件 */
  baseParams = {}
  importantFilter = ['staff_name','staff_zjm'];
  formList = () => {
    return [
      {
        type: 'INPUT',
        field: 'staff_name',
        label: '职员名称',
        placeholder: '职员名称'
      },
      {
        type: 'INPUT',
        field: 'staff_zjm',
        label: '助记号',
        placeholder: '助记号'
      }
    ]
  }

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  columns = () => {
    return [
      {
        title: '职员名称',
        dataIndex: 'staffName',
        key: 'staffName',
        width: 120,
      },
      {
        title: '所属部门',
        dataIndex: 'deptId',
        key: 'deptId',
        width: 120,
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        key: 'roleId',
        width: 120,
      },
      {
        title: '员工类别',
        dataIndex: 'staffType',
        key: 'staffType',
        width: 120,
      },
      {
        title: '助记码',
        dataIndex: 'staffZjm',
        key: 'staffZjm',
        width: 120,
      },
      {
        title: '工种名称',
        dataIndex: 'workType',
        key: 'workType',
        width: 120,
      },
      {
        title: '民族',
        dataIndex: 'nation',
        key: 'nation',
        width: 80,
      },
      {
        title: '籍贯',
        dataIndex: 'nativePlace',
        key: 'nativePlace',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: 100,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 80,
      },
      {
        title: '身份证号码',
        dataIndex: 'idcArid',
        key: 'idcArid',
        width: 120,
      },
      {
        title: '出生日期',
        dataIndex: 'birthDate',
        key: 'birthDate',
        width: 100,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 100,
      },
      {
        title: '学历',
        dataIndex: 'education',
        key: 'education',
        width: 80,
      },
      {
        title: '地址',
        dataIndex: 'addr',
        key: 'addr',
        width: 120,
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
      modalData: {}
    })
    this.openModal(true)
  }
  //编辑
  handleToEdit = (data) => {
    this.setState({
      modalData: { 
        id: data.id,
        dept_id: (data.deptId).toString(), 
        role_id: (data.roleId).toString(), 
        staff_type: data.staffType, 
        staff_name: data.staffName, 
        staff_zjm: data.staffZjm, 
        work_type: data.workType, 
        nation: data.nation, 
        native_place: data.nativePlace, 
        phone: data.phone, 
        sex: data.sex, 
        id_carid: data.idcArid, 
        birth_date: data.birthDate ? moment(data.birthDate).format('YYYY-MM-DD') : '', 
        email: data.email, 
        education: data.education, 
        addr: data.addr
      }
    })
    this.openModal(true)
  }
  // 确定
  modalOnOk = (data) => {
    const _this = this;
    let _data = data;
    _data.birth_date = moment(_data.birthDate).format('YYYY-MM-DD');

    const modalData = {
      id: _this.state.modalData.id,
      ..._data
    };
    const url = modalData.id ? '@/inquiry/gdstaff/update' : '@/inquiry/gdstaff/save';

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
  // 取消
  modalOnCancel = () => {
    this.openModal(false)
  }
  //删除
  handleToDel = (data) => {
    const _this = this;
    const {id, staffName } = data;

    Modal.confirm({
      title: `您是否确认要删除 ${staffName} 吗？`,
      onOk() {
        api.ajax('post', '@/inquiry/gdstaff/delete', {
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
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  reloadTableData(state = 1) {
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
            url='@/inquiry/gdstaff/getForPage'
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns()}
            scroll={{x: 1900}} />
        </Card>
        <ModalForm
          indexkeyWidth={120}
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

export default Staff