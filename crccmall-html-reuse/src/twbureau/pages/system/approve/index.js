import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import '../../../style/list.css'
import './index.css';
import '../../../style/model.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

class Approve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: '0',
          key: '0'
        },{
          title: '工程公司',
          dataIndex: '1',
          key: '1'
        },{
          title: '操作时间',
          dataIndex: '2',
          key: '2'
        },{
          title: '项目部',
          dataIndex: '3',
          key: '3'
        },{
          title: '状态',
          dataIndex: '4',
          key: '4',
          render: (value) => {
            // 根据不同的值设置字体颜色
            return (
              value == "开启" ? <span style={{color: 'green'}}>开启</span> : <span></span>
            )
          }
        },{
          title: '操作',
          dataIndex: '5',
          key: '5',
          render: () => {
            return (
              <a target="javascript:;" onClick={this.edit}>编辑</a>
            )
          }
        }
      ],
      dataSource: [
        {
          0: '1',
          1: 'XXX公司',
          2: 'XXX项目部',
          3: '开启'
        }
      ],
      visible: false
    }
  }
  edit = () => {
    // 传参 this.props.history.push({pathname:"/tw/system/approve/edit", query: {id: xx}})
    // 使用this.props.location.query接收参数
    this.props.history.push('/tw/system/approve/edit')
  }
  render() {
    return (
      <div className="approve">
        <Breadcrumb location={this.props.match} />
        <Search>
          <div className="search_item">
            <span className="title">审批部门：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="0">全部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="title">模板名称：</span>
            <Input className="btn" />
          </div>
        </Search>
        <div className="table">
          <div className="btn_box">
            <Button type="primary" className="button" onClick={this.edit}>添加项目审批</Button>
          </div>
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
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(Approve))