import { Card, Button, Switch,Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import ViolationModal from './violationModal';
const confirm = Modal.confirm;
class supplierManagement extends React.Component {
  state = {
    loading: false,
    tableState: 0,
    supplierInfo: {}, // 供应商信息
    adminInfo: {}, //管理员信息
    supplierUsersInfo: [], //本公司不是管理员的用户信息列表
    userInfo: {}, //选中的管理员
    resetInformationShow: false, // 重置信息弹框显示标识
    resetAdminShow: false, // 重置管理员弹框显示标识
    mainCommodityData: [],//主营类目
    plainOptions: [], // 专业领域
    provinceList: [],//省数据
    violationModalShow:false,
    companyId : '',
    companyName :'',
    bussinessLisence:'',
    companyUUIDS:"",
  }

  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
    this.getMainCommodityData()
    //专业领域
    this.getProfessionalFields();
    // //获取省/市/县
    this.getProvinceList();
    
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  // 获取省数据
  getProvinceList = () => {
    api.ajax("GET", "@/base/ecProvince/selectAll").then(r => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        provinceList: r.data.rows,
      })
    })
  }

  /**查询条件 */
  importantFilter = ['name', 'legalPersonName']

  formList = () => {
    return [
      {
        type: 'INPUT',
        field: 'name',
        label: '公司名称',
        placeholder: '公司名称'
      },{
        type: 'INPUT',
        field: 'businessLicense',
        label: '营业执照号',
        placeHolder: '营业执照号'
      },
     {
        type: 'INPUT',
        field: 'legalPersonName',
        label: '法人名称',
        placeholder: '法人名称'
      },
      {
        type: 'INPUT',
        field: 'legalPersonId',
        label: '法人身份证号',
        placeholder: '法人身份证号'
      }, {
        type: 'INPUT',
        field: 'contactName',
        label: '管理员姓名',
        placeholder: '管理员姓名'
      },
      {
        type: 'INPUT',
        field: 'contactPhone',
        label: '管理员电话',
        placeholder: '管理员电话'
      },
      {
        type: 'INPUT',
        field: 'citizenCode',
        label: '管理员身份证号',
        placeholder: '管理员身份证号'
      },
      {
        type: 'INPUT',
        field: 'email',
        label: '管理员邮箱',
        placeholder: '管理员邮箱'
      },
      {
        type: 'SELECT',
        field: 'factoryType',
        label: '厂家类型',
        placeholder: '请输入厂家类型',
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
        field: 'isMember',
        label: '企业类型',
        placeholder: '请选择企业类型',
        list: [
          {
            id: 1,
            value: '内部'
          },
          {
            id: 2,
            value: '外部'
          }
        ]
      },
      {
        type: 'SELECT',
        field: 'subIds',
        label: '子平台开通',
        placeholder: '请选择',
        list: [
          {
            id: 3,
            value: '物资销售'
          },
          {
            id: 4,
            value: '物资采购'
          },
          {
            id: 6,
            value: '物资循环'
          },
          {
            id: 7,
            value: '供应商管理'
          },
          {
            id: 9,
            value: '电子招投标'
          }
        ]
      },
      {
        type: 'SELECT',
        field: 'source',
        label: '来源信息',
        placeholder: '请输入来源信息',
        list: [
          {
            id: '0',
            value: '自主注册'
          },
          {
            id: '3',
            value: '后台添加'
          },
          {
            id: '4',
            value: '广联达'
          },
          {
            id: '5',
            value: '程序添加'
          }
        ]
      },
      {
        type: 'SELECT',
        field: 'mainBusiness',
        label: '主营类目',
        placeholder: '请选择主营类目',
        list: this.state.mainCommodityData,
        listLabel: 'name',//select的显示内容
        listKey: 'id',//select的value
      },
      {
        type: 'SELECT',
        field: 'expertiseArea',
        label: '专业领域',
        placeholder: '请选择专业领域',
        list: this.state.plainOptions,
        listLabel: 'pfName',//select的显示内容
        listKey: 'id',//select的value
      },
      {
        type: 'SELECT',
        field: 'cityCode',
        label: '公司所在地',
        placeholder: '公司所在地',
        list: this.state.provinceList,
        listLabel: 'provinceName',//select的显示内容
        listKey: 'provinceCode'
      },
      {
        type: 'RANGETIME',
        field: 'createTimeArr',
        label: '入驻时间',
        placeHolder: '请筛选时间段'
      },
      {
        type: 'SELECT',
        field: 'blackType',
        label: '账户状态',
        placeholder: '账户状态',
        list: [
          {
            id: '1',
            value: '自然人拉黑'
          },
          {
            id: '2',
            value: '企业拉黑'
          }
        ]
      }
    ]
  }

  // 获取主营商品数据信息
  getMainCommodityData = () => {
    let _this = this;
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
  // 获取专业领域
  getProfessionalFields = () => {
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('GET', '@/platform/ecProfessionalField/getProfessionalFields').then(r => {
        this.setState({
          plainOptions: r.data? r.data: []
      })
    }).catch(r => {
      this.setState({
        loading: false
      })
    })
  }

  handleFilter = (p, isSend = true) => {
    let createTimeStart, createTimeEnd;
    if (p.createTimeArr) {
      createTimeStart = p.createTimeArr[0] ? moment(p.createTimeArr[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      createTimeEnd = p.createTimeArr[1] ? moment(p.createTimeArr[1]).format('YYYY-MM-DD HH:mm:ss') : '';
      p.createTimeArr = null;
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


  baseParams = {
    type:1
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
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        sorter: true
      },
      {
        title: '法人姓名',
        dataIndex: 'legalPersonName',
        key: 'legalPersonName',
        width: 150,
        sorter: true
      },
      {
        title: '联系电话',
        dataIndex: 'contactPhone',
        key: 'contactPhone',
        width: 200,
        sorter: true
      },
      {
        title: '营业执照号',
        dataIndex: 'businessLicense',
        key: 'businessLicense',
        width: 250,
        sorter: true
      },
	  {
	    title: '公司类型',
		dataIndex: 'type',
		key: 'type',
		width: 150,
	    sorter: true,
	    render: (text, record) => (
	        <span>
	        {record.type == "1" ? "供应商" : "采购商"}
	      </span>
	    )
	  },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 250,
        sorter: true
      },
      {
        title: '入驻时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 250,
        sorter: true,
        render: (text, record, index) => {
          return(<p style={{width:"140px"}}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}</p>)
        }
      },


      /*{
        title: '审批时间',
        dataIndex: 'approvalTime',
        key: 'approvalTime',
        width:200,
        render: (text, record, index) => {
          return(<p className="orderDetailTableColumnWidth" style={{width:"140px"}}><span title={text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):""}</span></p>)
        }*/
      {
        title: '厂商类型',
        dataIndex: 'factoryType',
        key: 'factoryType',
        width: 170,
        sorter: true,
        render: (text, record) => (
            <span>
            {record.factoryType == "1" ? "厂家" : record.factoryType == "2" ? "贸易集成商" : "个体户"}
          </span>
        )
      },
      {
        title: '来源信息',
        dataIndex: 'source',
        key: 'source',
        width: 150,
        sorter: true,
        render: (text, record) => (
            <span>
            {record.source == "0" ? "自主注册" : record.source == "1" ? "各局推荐" : record.source == "3" ? "后台添加" :  
            record.source == "4" ? "广联达" : record.source == "5" ? "程序添加" : "-"}
          </span>
        )
      },
      {
        title: '账户状态',
        dataIndex: 'blackType',
        key: 'blackType',
        width: 150,
        sorter: true,
        render: (text, record) => (
            <span>
            {record.blackType == 1 ? "法人拉黑" : record.blackType == 2 ? "公司拉黑" : record.isSuspend == 0 ? "门户开启" : "门户关闭"}
          </span>
        )
      },
      // {
      //   title: '门户状态',
      //   dataIndex: 'portalStatus',
      //   key: 'portalStatus',
      //   width: 100,
      //   sorter: true,
      //   render: (text, record) => (
      //     <Switch checkedChildren="开" unCheckedChildren="关"
      //       defaultChecked={record.portalStatus == 1}
      //       onChange={(checked) => { this.handleSwitchChange(checked, record) }} />
      //   )
      // },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
            <span>
              <AuthButton elmType="a" onClick={() => { this.handleToDetails(record.uuids) }}>详情</AuthButton>
               <span className="ant-divider"></span>
              <AuthButton elmType="a" onClick={() => { this.openBidding(record.id) }}>开通招投标</AuthButton>
                 <span className="ant-divider"></span>
               <AuthButton elmType="a" onClick={() => { this.openViolation(record.id,record.name,record.businessLicense,record.uuids) }}>处罚</AuthButton>
          </span>)
      }
    ]
  }
  //门户状态 开关
  handleSwitchChange = (checked, record) => {
    let _this = this;
    api.ajax('GET', '@/protal/ecStore/storeOpen', {
      companyid: record.id,
      classType: checked ? 1 : 0
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.reloadTableData();
    })
  }
  //供应商详情，跳转供应商详情页
  handleToDetails = (id) => {
    window.open(SystemConfig.systemConfigPath.jumpPage(this.props.history.location.pathname + '/details/' + id))
  }

  //开通招投标用户
  openBidding  = (id) =>{
    confirm({
      title: '是否同步招投标系统？',
      onOk() {
        api.ajax("GET","@/platform/bidOpen/bidSyncCompany", {
          pools:id
        }).then((r) => {
          Util.alert('开通成功！')
        }).catch(e => {
          Util.alert('开通失败！')
        })
      },
      onCancel() {
        Util.alert('操作已取消')
      },
    });
  }

  addSupplier = () => {
    this.props.history.push(this.props.history.location.pathname + '/add');
  }
  addPurchaser  = ()=>{
    this.props.history.push('/purchaser/addPurchaser')
  }

  //导出
  handleToExport = () => {
    let params = '';
    let p = this.baseParams;
    if (p.createTimeArr) {
      p.createTimeStart = p.createTimeArr[0] ? moment(p.createTimeArr[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      p.createTimeEnd = p.createTimeArr[1] ? moment(p.createTimeArr[1]).format('YYYY-MM-DD HH:mm:ss') : '';
      p.createTimeArr = '';
    } else {
      p.createTimeStart = '';
      p.createTimeEnd = '';
    }
    for (let index in this.baseParams) {
      if (this.baseParams[index]) {
        params += index + '=' + this.baseParams[index] + '&'
      }
    }

    window.open(
        window.location.origin +
        '/api' +
        '/supplier/ecCompanySupplier/export' +
        '?' + params
    )
  }

  openViolation = (id,companyName,bussinessLisence,uuids) => {
    this.setState({
      companyId:id,
      companyName:companyName,
      bussinessLisence:bussinessLisence,
      companyUUIDS:uuids,
      violationModalShow: true
    })
  }

  violationFormList = () => {
    return {
      companyId: this.state.companyId,
      companyName: this.state.companyName,
      bussinessLisence: this.state.bussinessLisence,
      companyUUIDS:this.state.companyUUIDS
    }
  }

  //供应商管理，取消按钮事件
  cancelDispose = () => {
    this.setState({
      violationModalShow: false
    })
  }


  //处罚提交按钮事件
  setViolation = (formData) => {
    api.ajax("POST", "@/platform/ecCompanyViolation/save", {
      ...formData,
    }).then(r => {
      this.setState({
        violationModalShow: false
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
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
            <BaseForm formList={this.formList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
            <div className="toolbar">
              <AuthButton type="primary" onClick={this.addSupplier}>添加供应商</AuthButton>
              <AuthButton type="primary" onClick={this.addPurchaser}>添加采购商</AuthButton>
              {/* <Button type="primary">配置</Button> */}
              <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
            </div>
            <BaseTable
                url='@/supplier/ecCompanySupplier/queryCompanySupplierListByAdmin'
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns()}
                scroll={{ x: 2200 }} />
          </Card>
          <ViolationModal
            onOk = {this.setViolation}
            onCancel = { this.cancelDispose}
            visible={this.state.violationModalShow}
            confirmLoading={this.state.loading}
            formData={this.violationFormList()}
          />
        </div>
    )
  }
}
export default supplierManagement;