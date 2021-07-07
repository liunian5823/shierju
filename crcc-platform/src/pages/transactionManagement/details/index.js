import { Row, Col, Table, Card } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseDetails from '@/components/baseDetails';

import less from './index.less';
class details extends React.Component{
  state = {
    loading: false,
    dataSource: [],//订单信息
  }
  _isMounted = false;
  componentWillMount(){
    this._isMounted = true;
  }
  componentWillUnmount(){
    this._isMounted = false;
  }

  columns = [
    {
      title: '订单号',
      dataIndex: 'ddh',
      key: 'ddh',
    },
    {
      title: '采购单位',
      dataIndex: 'cgdw',
      key: 'cgdw',
    },
    {
      title: '供应商',
      dataIndex: 'gys',
      key: 'gys',
    },
    {
      title: '下单时间',
      dataIndex: 'xdsj',
      key: 'xdsj',
    },
    {
      title: '数量',
      dataIndex: 'sl',
      key: 'sl',
    },
    {
      title: '订单金额',
      dataIndex: 'ddje',
      key: 'ddje',
    },
    {
      title: '采购人',
      dataIndex: 'cgr',
      key: 'cgr',
    },
    {
      title: '采购人电话',
      dataIndex: 'cgrdh',
      key: 'cgrdh',
    },
    {
      title: '联系人',
      dataIndex: 'lxr',
      key: 'lxr',
    },
    {
      title: '联系人电话',
      dataIndex: 'lxrdh',
      key: 'lxrdh',
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      render: (text, record) => (
        <a href="javascript:void(0);">查看</a>
      )
    },
  ]

  render() {
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
        <Card bordered={false} title="订单信息" className="mb10">
          <Table
            dataSource={this.state.dataSource}
            columns={this.columns}
            pagination={false}/>
        </Card>
        <Card bordered={false} title="处理记录">
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="经办人">
                张媛媛
                <a href='javascript:void(0);'>查看</a>
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="联系电话">
                123123123123
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="处理方式">
                匹配订单
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="处理时间">
                2017-09-09
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="附件">
                xxxx.png
                <a href="javascript:void(0);">查看</a>
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="备注">
                sfasdfsaf
              </BaseDetails>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
export default details;