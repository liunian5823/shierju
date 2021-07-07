import { Table, Card, Button } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import ModalForm from './modalForm';
import AddModal from './addModal';
import UploadModal from './uploadModal';
import AuthButton from '@/components/authButton'

import less from './index.less';

class corporateBlacklist extends React.Component{
  state = {
    loading: false,
    tableState: 0,
    supplierInfo: {},
    blackListShow: false,
    addModal: false,
    uploadShow: false,
    userPhone: ''    
  }
  _isMounted = false;
  _userInfo = null;

  componentWillMount(){
    this._isMounted = true;
    this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
      if (this._userInfo || !obj) { return false }
      this._userInfo = obj;
      this.setState({
        userPhone: obj.phone
      })
      // 获得用户基本信息后执行加载回调
    }.bind(this));//
    PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
  }
  componentWillUnmount(){
    this._isMounted = false;
    PubSub.unsubscribe(this.pubsub_userInfo);
  }

  //查询组件信息
  formList = [
    {
      type: 'INPUT',
      field: 'legalPerson',
      label: '自然人姓名',
      placeholder: '请输入自然人姓名'
    },
    {
      type: 'SELECT',
      field: 'gender',
      label: '性别',
      placeholder: '请选择',
      list: [{ id: '0', value: '男' }, { id: '1', value: '女' }]
    },
    {
      type: 'SELECT',
      field: 'source',
      label: '来源',
      placeholder: '请输入供应商类型',
      list: [
        {
          id: '1',
          value: '铁建商城'
        },
        {
          id: '2',
          value: '股份公司'
        },
      ]
    },
    {
      type: 'RANGE',
      field: 'blackTime',
      label: '拉黑时间',
      placeHolder: '请选择拉黑时间'
    },
    {
      type: 'INPUT',
      field: 'reportingCompany',
      label: '上报单位',
      placeholder: '请输入上报单位'
    },
    {
      type: 'SELECT',
      field: 'effective',
      label: '状态',
      list: [
        {
          id: '0',
          value: '生效'
        },
        {
          id: '1',
          value: '失效'
        },
      ]
    },
    {
      type: 'SELECT',
      field: 'yearPublished',
      label: '发布年份',
      list: [
        {
          id: '2013',
          value: '2013'
        },
        {
          id: '2014',
          value: '2014'
        },
        {
          id: '2015',
          value: '2015'
        },
        {
          id: '2016',
          value: '2016'
        },
        {
          id: '2017',
          value: '2017'
        },
        {
          id: '2018',
          value: '2018'
        },
        {
          id: '2019',
          value: '2019'
        },
      ]
    },
  ]
  importantFilter = ['legalPerson', 'blackTime'];
  handleFilter = (p, isSend = true) => {
    let blackTimeStr, blackTimeEnd;
    if (p.blackTime) {
      blackTimeStr = p.blackTime[0] ? moment(p.blackTime[0]).format('YYYY-MM-DD 00:00:00') : '';
      blackTimeEnd = p.blackTime[1] ? moment(p.blackTime[1]).format('YYYY-MM-DD 23:59：59') : '';
      p.blackTime = null;
    }

    this.baseParams = {
      ...this.baseParams,
      ...p,
      blackTimeStr, 
      blackTimeEnd
    }
    if(isSend){
      this.reloadTableData();
    }
  }

  baseParams = {
    type: 1
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

  columns = () => {
    return [
      {
        title: '姓名',
        dataIndex: 'legalPersonName',
        key: 'legalPersonName',
        width: 100,
        sorter: true
      },
      {
        title: '',
        dataIndex: 'gender',
        key: 'gender',
        width: 80,
        sorter: true,
        render: (text,record)=>(
          <span>
            {text==0?'男':text==1?'女':'-'}
          </span>
        )
      },
      {
        title: '身份证/护照号',
        dataIndex: 'legalPersonId',
        key: 'legalPersonId',
        width: 150,
        sorter: true,
        render:(text)=>(
          <span>
            {Util.formatterData('idcard',text)}
          </span>
        )
      },
      {
        title: '拉黑时间',
        dataIndex: 'blackTime',
        key: 'blackTime',
        width: 150,
        sorter: true,
        render: (text, record) => {
          return text.substring(0,19);
        }
      },
      {
        title: '生效状态',
        dataIndex: 'effective',
        key: 'effective',
        width: 100,
        sorter: true,
        render: (text,record)=>(
          <span>
          {record.effective==0?'生效':'失效'}
          </span>
          )
      },
      {
        title: '评级',
        dataIndex: 'rating',
        key: 'rating',
        width: 100,
        sorter: true
      },
      {
        title: '案情简述',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 250,
        sorter: true
      },
      {
        title: '上报单位',
        dataIndex: 'reportingCompany',
        key: 'reportingCompany',
        width: 120,
        sorter: true
      },
      {
        title: '区域',
        dataIndex: 'area',
        key: 'area',
        width: 150,
        sorter: true
      },
      {
        title: '发布年份',
        dataIndex: 'yearPublished',
        key: 'yearPublished',
        width: 100,
        sorter: true
      },
      {
        title: '来源',
        dataIndex: 'blackType',
        key: 'blackType',
        width: 150,
        sorter: true
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        fixed: 'right',
        width: 120,
        render: (text, record)=>(
          <span>
            <AuthButton elmType="a" onClick={()=>{this.handleToDetails(record.uuids)}}>详情</AuthButton>
            <span className="ant-divider"></span>
            <AuthButton elmType="a" onClick={()=>{this.handleToBlacklist(record)}}>{record.effective=="1"?"移入":"移除"}</AuthButton>
          </span>
        )
      }
    ]
  }
  handleToBlacklist = (obj) => {
    this.blacklistModal = {
      ...this.blacklistModal
    }
    this.setState({
      blackListShow: true,
      supplierInfo: obj
    })
  }
  handleToDetails = (uuids) => {
    this.props.history.push(this.props.history.location.pathname + '/details'+'/'+uuids);
  }

  saveBlacklist = (formData,effective) => {
    let _this = this;
    let verificationCodeType;
    let curE = "";
    if(effective=="1"){
      curE = 0;
      verificationCodeType = 5;
    }else{
      curE = 1;
      verificationCodeType = 6;
    }
    this.setState({
      loading: true
    })
    api.ajax("POST", "@/supplier/ecBlacklistCompany/blackMoveInOrRemove",{
      blackId: this.state.supplierInfo.blackId,
      uuids: this.state.supplierInfo.uuids,
      effective: curE,
      ...formData,
      verificationCodeType
    }).then(r=>{
      if(!_this._isMounted){
        return;
      }
      if(effective == "1"){
        Util.alert("移入成功", {type: 'success'});
      }else{
        Util.alert("移出成功", {type: 'success'});
      }
      this.setState({
        loading: false,
        blackListShow: false
      })
      this.reloadTableData();
    }).catch(r => {
      this.setState({
        loading: false
      })
      Util.alert("移动失败", {type: 'error'});
    })
  }
  cancelBlacklist = () => {
    this.setState({
      blackListShow: false
    })
  }
  blacklistModal = {
    onOk: this.saveBlacklist,
    onCancel: this.cancelBlacklist
  }

  addBlacklist = (formData) => {
    let _this = this;
    this.setState({
      loading: true
    })
    api.ajax("POST", "@/supplier/ecBlacklistCompany/add",{
      ...formData,
      type: 1,
      verificationCodeType: 4
    }).then(r=>{
      if(!_this._isMounted){
        return;
      }
      Util.alert("添加成功", {type: 'success'});
      this.reloadTableData();
      this.setState({
        loading: false,
        addModal: false
      })
    }).catch(r => {
      Util.alert("添加失败", {type: 'error'});
      this.setState({
        loading: false
      })
    })
  }
  cancelAdd = () => {
    this.setState({
      addModal: false
    })
  }
  addBlacklistModal = {
    onOk: this.addBlacklist,
    onCancel: this.cancelAdd
  }
  handleToAdd = () => {
    this.setState({
      addModal: true
    })
  }
  handleToUpload = () => {
    this.setState({
      uploadShow: true
    })
  }
  uploadOnCancel = () => {
    this.setState({
      uploadShow: false
    })
  }

  uploadModalObj = {
    onCancel: this.uploadOnCancel
  }
  //导出
  handleToExport = () => {
    let params = '';
    for(let index in this.baseParams){
      params += index + '=' + this.baseParams[index] + '&'
    }
    window.open(
      window.location.origin +
      '/api' +
      '/supplier/ecBlacklistCompany/exportCompanyBlack' +
      '?' + params
    )
  }

  render(){
    const { selectedRowKeys } = this.state;
    const rowCheckSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys)=>{
        this.setState({
          selectedRowKeys
        })
      }
    }
    return(
      <div>
        <Card bordered={false}>
          <BaseForm
            formList={this.formList}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}></BaseForm>
          <div className="toolbar">
            <AuthButton type="primary" onClick={this.handleToAdd}>添加</AuthButton>
            <AuthButton type="primary" onClick={this.handleToUpload}>导入</AuthButton>
            <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
          </div>
          <BaseTable
            url='@/supplier/ecBlacklistCompany/blacklistCompanyPage'
            tableState={this.state.tableState}
            resetTable={(state)=>{this.resetTable(state,'tableState')}}
            baseParams={this.baseParams}
            columns={this.columns()}
            scroll={{ x: 1700 }}/>
        </Card>
        <ModalForm
          {...this.blacklistModal}
          userPhone={this.state.userPhone}
          confirmLoading={this.state.loading}
          obj={this.state.supplierInfo}
          visible={this.state.blackListShow}></ModalForm>
          <AddModal
          title="添加"
          {...this.addBlacklistModal}
          userPhone={this.state.userPhone}
          confirmLoading={this.state.loading}
          visible={this.state.addModal}></AddModal>
          <UploadModal
          {...this.uploadModalObj}
          confirmLoading={this.state.loading}
          visible={this.state.uploadShow}></UploadModal> 
      </div>
    )
  }
}
export default corporateBlacklist