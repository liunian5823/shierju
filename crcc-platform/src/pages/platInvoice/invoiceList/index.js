import { Card, Table, Button, Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import './index.css';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import InvoiceModal from '@/pages/platInvoice/invoiceList/invoiceModal';
import {NumberFormat} from '@/components/content/Format'
const confirm = Modal.confirm;

class InvoiceList extends React.Component {
  _isMounted = false

  state = {
    loading: false,
    modalvisible: false,
    seeVisible: false,
    seeModalInfo: ""
  }

  bulletinInfo = ""

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

    /**查询条件 */
    importantFilter = ['orderNo', 'invType']

    formList = [
        {
            type: 'INPUT',
            field: 'orderNo',
            label: '订单号',
            placeholder: '请输入'
        },
        {
            type: 'SELECT',
            field: 'invType',
            label: '发票类型',
            placeholder: '请选择',
            list: [
                {
                    id: '1',
                    value: '增值税专用发票'
                },{
                    id: '2',
                    value: '增值税普通发票'
                }
            ]
        },
        {
            type: 'INPUT',
            field: 'purchasePerson',
            label: '采购商',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'supplierName',
            label: '供应商',
            placeholder: '请输入'
        }
    ]
  handleFilter = (params, isSend = true) => {
    this.baseParams = {
      ...this.baseParams,
      ...params,
    }
    if (isSend) {
      this.handelToLoadTable();
    }
  }


  //发票详情
  handleToSee = (info) => {
    this.setState({
      seeVisible: true,
      seeModalInfo: info
    })
  }

  cancelSeeModal = () => {
    this.setState({
      seeVisible: false
    })
  }
  seeInitModal = {
    onCancel: this.cancelSeeModal
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
  columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 130,
      sorter: (a,b)=>a.orderNo- b.orderNo,
      render: (text, record, index) => {
          return <span title={text}>{text}</span>
      }
    },
    {
      title: '发票类型',
      dataIndex: 'invTypeStr',
      key: 'invTypeStr',
      width: 130,
      sorter: (a,b)=>a.invType- b.invType,
      render: (text, record, index) => {
          return <span title={text}>{text}</span>
      }
    },
    {
      title: '发票号',
      dataIndex: 'invNo',
      key: 'invNo',
      width: 90,
      sorter: (a,b)=>a.invNo- b.invNo,
      render: (text, record, index) => {
          return <span title={text}>{text}</span>
      }
    },
    {
      title: '采购商',
      dataIndex: 'purchasePerson',
      key: 'purchasePerson',
      width: 160,
      sorter: (a,b)=>a.purchasePerson- b.purchasePerson,
      render: (text, record, index) => {
          return <span title={text}>{text}</span>
      }
    },
    {
        title: '供货商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        width: 160,
        sorter: (a,b)=>a.supplierName- b.supplierName,
        render: (text, record, index) => {
            return <span title={text}>{text}</span>
        }
    },
    {
        title: '开具时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
        width: 110,
        sorter: (a,b)=>a.createTime- b.createTime,
        render: (text, record, index) => {
            return <span title={text}>{text}</span>
        }
    },
    {
        title: '发票金额（元）',
        dataIndex: 'amount',
        key: 'amount',
        width: 150,
        sorter: (a,b)=>a.amount- b.amount,
        render: (text, record) =>{
            if (text == undefined || text == null || text == "") {
                return <span title={text}>{text}</span>
            } else {
                return <span title={text}><NumberFormat value={text}/></span>
            }
        }
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (text, record) => (
        <span>
          {/*<a>详情</a>*/}
          <a onClick={ this.handleToSee.bind(this,record) }>详情</a>
        </span>
      ),
      width: 80
    }
  ]

  render() {
     return (
        <div>
            <Card bordered={false}>
                <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                <BaseTable
                    url="!!/financial/platInvoiceController/queryPlatInvoiceListForPage"
                    tableState={this.state.tableState}
                    resetTable={(state) => { this.resetTable(state, 'tableState') }}
                    baseParams={this.baseParams}
                    columns={this.columns}
                />
            </Card>
            <InvoiceModal
                {...this.seeInitModal}
                info={this.state.seeModalInfo}
                visible={this.state.seeVisible}>
            </InvoiceModal>
        </div>
     )
  }
}
export default InvoiceList;