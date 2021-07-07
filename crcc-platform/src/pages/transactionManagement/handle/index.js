import { Row, Col, Button, Card, Form, Input } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseDetails from '@/components/baseDetails';
import BaseTable from '@/components/baseTable';
import RefundModal from './refundModal';
import MatchingOrder from './matchingOrderModal';

import less from './index.less';

const FormItem = Form.Item;

class Handle extends React.Component{
  state = {
    loading: false,
    tableState1: 0,
    refundShow: false,//退款弹框
    matchingOrderShow: false,//匹配订单弹框
  }
  _isMounted = false;

  componentWillMount(){
    this._isMounted = true;
  }
  componentWillUnmount(){
    this._isMounted = false;
  }

  baseParams1 = {
  }

  columns = [
    {
      title: '订单号',
      dataIndex: 'ddh',
      key: 'ddh',
      sorter: true
    },
    {
      title: '采购单位',
      dataIndex: 'cgdw',
      key: 'cgdw',
      sorter: true
    },
    {
      title: '供应商',
      dataIndex: 'gys',
      key: 'gys',
      sorter: true
    },
    {
      title: '下单时间',
      dataIndex: 'sdsj',
      key: 'sdsj',
      sorter: true
    },
    {
      title: '数量',
      dataIndex: 'sl',
      key: 'sl',
      sorter: true
    },
    {
      title: '订单金额',
      dataIndex: 'ddje',
      key: 'ddje',
      sorter: true
    },
    {
      title: '采购人',
      dataIndex: 'cgr',
      key: 'cgr',
      sorter: true
    },
    {
      title: '采购人电话',
      dataIndex: 'cgrdh',
      key: 'cgrdh',
      sorter: true
    },
    {
      title: '联系人',
      dataIndex: 'lxr',
      key: 'lxr',
      sorter: true
    },
    {
      title: '联系人电话',
      dataIndex: 'lxrdh',
      key: 'lxrdh',
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      render: (text, record)=>{
        return (<a href="javascript:void(0);" onClick={()=>{this.handleToDetails(record.uuids)}}>查看</a>);
      }
    }
  ]
  
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
  reloadTableData(state = 1) {
    let key = this.activeTab;
    this.handelToLoadTable(state, 'tableState' + key);
  }

  handleSearch = () => {
    let searchName = this.props.form.getFieldValue('searchName');
    this.baseParams1 = {
      searchName
    }
    this.reloadTableData();
  }
  handleReset = () => {
    this.props.form.resetFields(['searchName']);
    this.baseParams1 = {}
    this.reloadTableData();
  }

  handleToRefund = () => {
    this.setState({
      refundShow: true
    })
  }
  
  refund = () => {
    this.setState({
      refundShow: false
    })
  }
  cancelRefund = () => {
    this.setState({
      refundShow: false
    })
  }

  refundModalObj = {
    onOk: this.refund,
    onCancel: this.cancelRefund
  }

  handleToMatchingOrder = () => {
    this.setState({
      matchingOrderShow: true
    })
  }

  okMatchingOrder = () => {
    this.setState({
      matchingOrderShow: false
    })
  }

  cancelMatchingOrder = () => {
    this.setState({
      matchingOrderShow: false
    })
  }

  matchingOrderModal = {
    onOk: this.okMatchingOrder,
    onCancel: this.cancelMatchingOrder
  }

  render(){
    const { getFieldProps } = this.props.form;
    return(
      <div>
        <Card bordered={false} title="来款信息" className="mb10">
          <Row gutter={16}>
            <Col span={12}>
              <span className={less.box}>来款账户名称</span>
            </Col>
            <Col span={12}>
              <span className={less.box}>来款金额</span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <span className={less.box}><span className={less.money}>账号123</span></span>
            </Col>
            <Col span={12}>
              <span className={less.box}><span className={less.money}>￥123</span></span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="来款账号">
                111
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="来款时间">
                123123123123
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="来款编号">
                111
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="来款附言">
                123123123123
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="疑似订单"
          extra={
            <Form inline>
              <FormItem>
                <Input {...getFieldProps('searchName')} placeholder="请输入订单号或者采购商名称"/>
              </FormItem>
              <Button type="primary" onClick={this.handleSearch}>查询</Button>
              <Button type="ghost" onClick={this.handleReset} className="ml10">重置</Button>
            </Form>
          }>
          <BaseTable
            url='@/microservice-finance/ecOrder/doubtfulOrder'
            tableState={this.state.tableState1}
            resetTable={(state)=>{this.resetTable(state,'tableState1')}}
            baseParams={this.baseParams1}
            columns={this.columns}/> 
        </Card>
        <Card bordered={false} style={{textAlign: 'center'}}>
          <Button type="ghost" onClick={this.handleToRefund}>退款</Button>
          <Button type="primary" onClick={this.handleToMatchingOrder} className="ml10">匹配订单</Button>
        </Card>
        <RefundModal
          visible={this.state.refundShow}
          {...this.refundModalObj}/>
        <MatchingOrder
          visible={this.state.matchingOrderShow}
          {...this.matchingOrderModal}/>  
      </div>
    )
  }
}

export default Form.create()(Handle);