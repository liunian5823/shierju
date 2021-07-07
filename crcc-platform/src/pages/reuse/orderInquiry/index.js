import List from '../mixins/list';
import AuthButton from '@/components/authButton'
import { exportFile } from "../utils/util";
function toFixed(num, d) {
  if (!num) { return '0.00' }
  var s = num + "";
  if (!d) d = 0;
  if (s.indexOf(".") == -1) s += ".";
  s += new Array(d + 1).join("0");
  if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
    var s = "0" + RegExp.$2,
      pm = RegExp.$1,
      a = RegExp.$3.length,
      b = true;
    if (a == d + 2) {
      a = s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 0) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] == 10) {
            a[i] = 0;
            b = i != 1;
          } else break;
        }
      }
      s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

    }
    if (b) s = s.substr(1);
    return (pm + s).replace(/\.$/, "");
  }
  return num + "";
}

const supplyMainBid = [
  {
    value: '待确认',
    id: '10',
    note: '',
    style: {
      color: '#fcc372'
    }
  },
  {
    value: '待审批',
    id: '20',
    style: {
      color: '#3ac8f7'
    }
  },
  {
    value: '已驳回',
    id: '15',
    note: '',
    style: {
      color: '#D5D5D5'
    }
  },
  {
    value: '已成交',
    id: '50',
    note: '',
    style: {
      color: '#6ad59c'
    }
  }
];

class supplierManagement extends List {
  formList = () => {
    return [
      {
        type: 'INPUT',
        field: 'code',
        label: '订单号',
        placeholder: '订单号'
      },
      {
        type: 'SELECT',
        field: 'source',
        label: '订单类型',
        placeholder: '请选择订单类型',
        list: [
          {
            id: '1',
            value: '竞价'
          },
          {
            id: '2',
            value: '供求'
          }
        ]
      },
      {
        type: 'INPUT',
        field: 'buyerCompanyName',
        label: '采购单位',
        placeHolder: '采购单位'
      },
      {
        type: 'INPUT',
        field: 'sceneTitleOrNo',
        label: '竞价单号',
        placeholder: '竞价单号'
      },
      {
        type: 'INPUT',
        field: 'saleCompanyName',
        label: '供货单位',
        placeholder: '供货单位'
      },
      {
        type: 'INPUT',
        field: 'saleDeptName',
        label: '供货项目部',
        placeholder: '供货项目部'
      },
      {
        type: 'RANGE',
        field: 'createStartDate',
        label: '下单日期',
        placeHolder: '请筛选下单日期'
      },
      {
        type: 'SELECT',
        field: 'status',
        label: '状态',
        placeholder: '请选择状态',
        list: [
          {
            id: '10',
            value: '待确认'
          },
          {
            id: '15',
            value: '已驳回'
          },
          {
            id: '20',
            value: '待审批'
          }, {
            id: '50',
            value: '已完成'
          }
        ]
      },
    ]
  };
  initUrl = '**/reuse/order/findPage';
  handleToExport = () => {
    exportFile('/reuse/order/export', this.baseParams)
  };
  columns = () => {
    return [
      {
        title: '订单号',
        dataIndex: 'code',
        key: 'code',
        width: 150,
        sorter: true
      },
      {
        title: '订单类型',
        dataIndex: 'sourceStr',
        key: 'sourceStr',
        width: 150,
        sorter: true
      },
      {
        title: '采购单位',
        dataIndex: 'buyerCompanyName',
        key: 'buyerCompanyName',
        width: 200,
        sorter: true
      },
      {
        title: '供货单位',
        dataIndex: 'saleCompanyName',
        key: 'saleCompanyName',
        width: 250,
        sorter: true
      },
      {
        title: '供货项目部',
        dataIndex: 'saleDeptName',
        key: 'saleDeptName',
        width: 250,
        sorter: true
      },
      {
        title: '订单状态',
        dataIndex: 'statusStr',
        key: 'statusStr',
        width: 150,
        sorter: true,
        render: (text, record) => {
          let style = supplyMainBid.find(value => record.status == value.id);
          return (
            <span style={style ? style.style : null}>
              {text}
            </span>
          )
        }
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 170,
        sorter: true,
      },
      {
        title: '订单金额（元）',
        dataIndex: 'amt',
        key: 'amt',
        width: 140,
        sorter: true,
        className: 'text_right',
        render: (text) => (<div style={{ color: '#f6342b', paddingRight: '15px' }}>{toFixed(text, 2)}</div>)
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
