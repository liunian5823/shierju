import { Card, Button } from 'antd';
import api from '@/framework/axios';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import Util from '@/utils/util';
import ModalForm from './modalForm';
import AuthButton from '@/components/authButton'

import less from './index.less';

class supplierEvaluation extends React.Component {
  state = {
    loading: false,
    tableState: 0,
    supplierInfo: {}, // 供应商信息
    evaluationShow: false, // 处理弹框显示标识
  }
  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  //查询组件信息
  formList = [
    {
      type: 'INPUT',
      field: 'name',
      label: '公司名称',
      placeholder: '公司名称'
    },
    {
      type: 'INPUT',
      field: 'legalPersonName',
      label: '法人名称',
      placeholder: '法人名称'
    },
    {
      type: 'INPUT',
      field: 'contactPhone',
      label: '联系电话',
      placeholder: '联系电话'
    },
    {
      type: 'INPUT',
      field: 'businessLicense',
      label: '营业执照号',
      placeHolder: '营业执照号'
    },
    {
      type: 'INPUT',
      field: 'email',
      label: '电子邮箱',
      placeholder: '电子邮箱'
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
      field: 'rating',
      label: '评价',
      placeholder: '评价',
      list: [
        {
          id: "0",
          value: "青铜"
        }, {
          id: "1",
          value: "白银"
        }, {
          id: "2",
          value: "黄金"
        },{
          id : "3",
          value : "普通"
        }
      ]
    },
    {
      type: 'RANGE',
      field: 'timeOfAdmission',
      label: '入驻时间',
      placeHolder: '请筛选时间段'
    }
  ]
  importantFilter = ['name', 'legalPersonName']
  handleFilter = (p, isSend = true) => {
    let createStartTime, createEndTime;
    if (p.timeOfAdmission) {
      createStartTime = p.timeOfAdmission[0] ? moment(p.timeOfAdmission[0]).format('YYYY-MM-DD 00:00:00') : '';
      createEndTime = p.timeOfAdmission[1] ? moment(p.timeOfAdmission[1]).format('YYYY-MM-DD 23:59:59') : '';
      p.timeOfAdmission = null;
    }

    this.baseParams = {
      ...this.baseParams,
      ...p,
      createStartTime,
      createEndTime
    }
    if (isSend) {
      this.reloadTableData();
    }
  }
  baseParams = {
    type:1,
    status:2
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
        width: 120,
        sorter: true
      },
      {
        title: '法人姓名',
        dataIndex: 'legalPersonName',
        key: 'legalPersonName',
        width: 120,
        sorter: true
      },
      {
        title: '联系电话',
        dataIndex: 'contactPhone',
        key: 'contactPhone',
        width: 120,
        sorter: true
      },
      {
        title: '营业执照号',
        dataIndex: 'businessLicense',
        key: 'businessLicense',
        width: 150,
        sorter: true
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 150,
        sorter: true
      },
      {
        title: '入驻时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
        sorter: true
      },
      {
        title: '供应商类型',
        dataIndex: 'factoryType',
        key: 'factoryType',
        width: 150,
        sorter: true
      },
      {
        title: '评价',
        dataIndex: 'rating',
        key: 'rating',
        width: 150,
        sorter: true,
        render: (text, record) => {
          if (text == 0) {
            return <div className={less.tong}>铜</div>
          } else if (text == 1) {
            return <div className={less.yin}>银</div>
          } else if (text == 2) {
            return <div className={less.jin}>金</div>
          } else if(text == 3) {
            return <div className={less.pu}>普</div>
          }
          return '-'
        }
      },
      {
        title: '来源信息',
        dataIndex: 'source',
        key: 'source',
        width: 150,
        sorter: true
      },
      {
        title: '账户状态',
        dataIndex: 'blackType',
        key: 'blackType',
        width: 100,
        sorter: true
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <AuthButton elmType="a" onClick={() => { this.handleToEvaluation(record) }}>评价</AuthButton>
        )
      }
    ]
  }
  handleToEvaluation = (record) => {
    console.log(record);
    this.setState({
      supplierInfo: record,
      evaluationShow: true
    })
  }

  //评价弹框
  evaluationFormList = () => {
    return [
      {
        label: "公司名称",
        value: this.state.supplierInfo.name
      }, {
        label: "法人姓名",
        value: this.state.supplierInfo.legalPersonName
      }, {
        label: "法人身份证号码",
        value: this.state.supplierInfo.legalPersonId
      }, {
        label: "营业执照号",
        value: this.state.supplierInfo.businessLicense
      }, {
        el: "SELECT",
        placeholder: "请选择评价类型",
        key: "rating",
        list: [
          {
            id: "3",
            value: "普通"
          },{
            id: "0",
            value: "青铜"
          }, {
            id: "1",
            value: "白银"
          }, {
            id: "2",
            value: "黄金"
          }
        ],
        label: "评价类型"
      }
    ]
  }
  saveEvaluation = (formData) => {
    let _this = this;
    this.setState({
      loading: true
    })
    api.ajax("POST", "@/supplier/ecCompanyEvaluation/save", {
      companyId: this.state.supplierInfo.id,
      ...formData
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert("处理成功", { type: 'success' });
      this.reloadTableData();
      this.setState({
        evaluationShow: false,
        loading: false
      })
    }).catch(r => {
      this.setState({
        loading: false
      })
      Util.alert("处理失败", { type: 'error' });
    })
  }
  cancelEvaluation = () => {
    this.setState({
      evaluationShow: false
    })
  }
  evaluationModal = {
    onOk: this.saveEvaluation,
    onCancel: this.cancelEvaluation
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
      '/supplier/ecCompanyEvaluation/exportCompanyEvaluation' +
      '?' + params
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
            formList={this.formList}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}></BaseForm>
          <div className={less.optionBtn}>
            {/* <Button type="primary">配置</Button> */}
            <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
          </div>
          <BaseTable
            url='@/supplier/ecCompanyEvaluation/supplierEvaluationPage'
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns()}
            scroll={{ x: 1600 }} />
        </Card>
        <ModalForm
          title="供应商评级"
          {...this.evaluationModal}
          confirmLoading={this.state.loading}
          visible={this.state.evaluationShow}
          formList={this.evaluationFormList()}
          rating={this.state.supplierInfo.rating}>
        </ModalForm>
      </div>
    )
  }
}
export default supplierEvaluation;