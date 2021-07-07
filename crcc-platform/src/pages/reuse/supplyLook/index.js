import List from '../mixins/list';
import AuthButton from '@/components/authButton'
import { exportFile } from "../utils/util";

const serviceStyle = {
  style1: {
    color: "#5CC7F8",//蓝色
  },
  style2: {
    color: "#FB9F1D",//橙色
  },
  style3: {
    color: "#18C16E",//绿色
  },
  style4: {
    color: "#D5D5D5",//灰色
  },
  style5: {
    color: "#e96c47",//红色
  },
}
// 供应需求状态
// 10 草稿，20 待审核，25 已驳回，30 发布中，40 已失效，50 已成交，60 已过期
const supplyMainBid = [
  {
    value: '草稿',
    id: '10',
    note: '',
    style: serviceStyle.style1
  },
  {
    value: '待审核',
    id: '20',
    style: serviceStyle.style2
  },
  {
    value: '已驳回',
    id: '25',
    note: '',
    style: serviceStyle.style5
  },
  {
    value: '发布中',
    id: '30',
    note: '',
    style: serviceStyle.style2
  },
  {
    value: '已失效',
    id: '40',
    note: '',
    style: serviceStyle.style4
  },
  {
    value: '已成交',
    id: '50',
    note: '',
    style: serviceStyle.style2
  },
  {
    value: '已过期',
    id: '60',
    note: '',
    style: serviceStyle.style4
  }
];

class supplierManagement extends List {
  formList = () => {
    return [
      {
        type: 'INPUT',
        field: 'codeOrName',
        label: '标题/编号',
        placeholder: '标题/编号'
      },
      {
        type: 'INPUT',
        field: 'goodsName',
        label: '商品名称',
        placeholder: '商品名称'
      },
      {
        type: 'INPUT',
        field: 'publishCompanyName',
        label: '单位名称',
        placeHolder: '单位名称'
      },
      {
        type: 'INPUT',
        field: 'publishProjectName',
        label: '项目名称',
        placeholder: '项目名称'
      },
      {
        type: 'INPUT',
        field: 'contacts',
        label: '联系人/电话',
        placeholder: '联系人/电话'
      },
      {
        type: 'RANGE',
        field: 'effectiveStartDate',
        label: '截止日期',
        placeHolder: '请筛选截止日期'
      },
      {
        type: 'RANGE',
        field: 'approvalStartDate',
        label: '审核日期',
        placeHolder: '请筛选审核日期'
      },
      {
        type: 'RANGE',
        field: 'creatStartDate',
        label: '发布日期',
        placeHolder: '请筛选发布日期'
      },
      {
        type: 'SELECT',
        field: 'type',
        label: '消息类型',
        placeholder: '请选择消息类型',
        list: [
          {
            id: '1',
            value: '供应'
          },
          {
            id: '2',
            value: '求购'
          },
        ]
      },
      {
        type: 'SELECT',
        field: 'status',
        label: '状态',
        placeholder: '请选择状态',
        list: [
          {
            id: '20',
            value: '待审核'
          },
          {
            id: '25',
            value: '已驳回'
          },
          {
            id: '30',
            value: '发布中'
          }, {
            id: '40',
            value: '已失效'
          }, {
            id: '50',
            value: '已成交'
          }
        ]
      },
    ]
  };
  initUrl = '**/reuse/supplyDemand/findPage';
  handleToExport = () => {
    exportFile('/reuse/supplyDemand/export', this.baseParams)
  };
  columns = () => {

    return [
      {
        title: '供求编号',
        dataIndex: 'code',
        key: 'code',
        width: 150,
        sorter: true
      },
      {
        title: '消息类型',
        dataIndex: 'typeStr',
        key: 'typeStr',
        width: 150,
        sorter: true
      },
      {
        title: '信息标题',
        dataIndex: 'noticeName',
        key: 'noticeName',
        width: 200,
        sorter: true
      },
      {
        title: '单位名称',
        dataIndex: 'publishCompanyName',
        key: 'publishCompanyName',
        width: 250,
        sorter: true
      },
      {
        title: '项目名称',
        dataIndex: 'publishProjectName',
        key: 'publishProjectName',
        width: 250,
        sorter: true
      },
      {
        title: '状态',
        dataIndex: 'statusStr',
        key: 'statusStr',
        width: 150,
        sorter: true,
        render: (text, record) => {
          let color = ''
          color = record.status == 10 ? '#fa9b13' : color
          color = record.status >= 20 && record.status < 40 ? '#2db7f5' : color
          color = record.status == 50 ? '#0cba5e' : color
          color = record.status == 40 ? '#f15557' : color
          return (
            <span style={{ color }}>
              {text}
            </span>
          )
        }
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
        key: 'contacts',
        width: 170,
        sorter: true,
      },
      {
        title: '联系电话',
        dataIndex: 'contactsTel',
        key: 'contactsTel',
        width: 150,
        sorter: true,
      },
      {
        title: '发布时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
        sorter: true,
      },
      {
        title: '截止时间',
        dataIndex: 'effectiveDateStr',
        key: 'effectiveDateStr',
        width: 150,
        sorter: true,
      },
      {
        title: '审核时间',
        dataIndex: 'approvalTime',
        key: 'approvalTime',
        width: 150,
        sorter: true,
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 80,
        fixed: 'right',
        render: (text, record) => (
          <span>
            <AuthButton elmType="a" onClick={() => {
              this.handleToDetails(record.uuids)
            }}>查看详情</AuthButton>
          </span>)
      }
    ]
  };
  handleToDetails = (id) => {
    this.props.history.push(this.props.history.location.pathname + '/details' + '/' + id)
  };
  render() {
    return super.render()
  }
}

export default supplierManagement;
