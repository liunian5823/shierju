import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import '../../style/list.css'
import './index.css';
import '../../style/model.css';
import { Input, Select, DatePicker, Tabs, Button, Table, Modal } from 'antd';

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: '0',
          key: '0'
        },{
          title: '操作人',
          dataIndex: '1',
          key: '1'
        },{
          title: '操作时间',
          dataIndex: '2',
          key: '2'
        },{
          title: '操作事件',
          dataIndex: '3',
          key: '3'
        },{
          title: '操作',
          dataIndex: '4',
          key: '4',
          render: () => {
            return (
              <a target="javascript:;" onClick={this.showDetail}>操作</a>
            )
          }
        }
      ],
      dataSource: [
        {
          0: '311',
          1: '角色1',
          2: '2021.7.22 12:00:99',
          3: '登陆'
        }
      ],
      visible: false
    }
  }
  showDetail = () => {
    this.setState({
      visible: true
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    return (
      <div className="logs">
        <Breadcrumb location={this.props.match} />
        <Search>
          <div className="search_item">
            <span className="title">操作人：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="0">全部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="title">操作时间：</span>
            <DatePicker className="btn" />
          </div>
        </Search>
        <div className="table">
        <Table
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={{
            position: ["bottomCenter"],
            size: "small",
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
        </div>
        <Modal
          width="710px"
          title="操作日志详情"
          visible={this.state.visible}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>关 闭</Button>
          ]}
        >
          <div className="content">
            <div>操作事件：登录</div>
            <div>操作类型：0001211</div>
            <div>创建公司ID：0001211</div>
            <div>公司名称：0001211</div>
            <div>操作员ID：0001211</div>
            <div>操作员姓名：测试2</div>
            <div>IP地址：196.168.10.10</div>
            <div>操作时间：2021.9.23 12:12:12</div>
            <div className="line">操作数据：Uejqwjfqfjsjafdkjasjfdasfdjsavjaksjvnnawefowjvwkv</div>
            <div className="line">操作参数：jfssksksksksk</div>
          </div>
        </Modal>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(Logs))