import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import './index.css';
import '../../../style/model.css';
import { Input, Button, Select, Modal, Table } from 'antd';

// 资产状态更新配置
class Status extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModel: false,
      current: 0, // 当前选中的字典
      // 字典列表
      list: [{
        name: '在用资产状态到期提醒配置',
        key: 0
      }, {
        name: '周转材料-转处置材料配置',
        key: 1
      }],
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          key: 'key',
        },
        {
          title: '值',
          dataIndex: 'value',
          key: 'value',
        },{
          title: '操作',
          render: () => {
            return <a href="javascript:;">删除</a>
          }
        }
      ],
      dataSource: [{
        key: 1,
        value: 5
      },{
        key: 2,
        value: 10
      },{
        key: 3,
        value: 15
      }]
    }
  }
  choseItem(key) {
    this.setState({
      current: key
    })
  }
  showModel = () => {
    this.setState({
      showModel: true
    })
  }
  closeModel = () => {
    this.setState({
      showModel: false
    })
  }
  addOption = () => {
    let newItem = {
      key: 4,
      value: 20
    }
    let list = this.state.dataSource
    list.push(newItem)
    this.setState({
      dataSource: list
    })
  }
  render() {
    let { showModel, dataSource, columns, list, current } = this.state
    return (
      <div className="goods_status">
        <Breadcrumb location={this.props.match} />
        <div className="main">
          <div className="search">
            <label>字典名称：</label>
            <Input placeholder="搜索" />
            <Button type="primary">搜索</Button>
          </div>
          <div className="list">
            <div className="head">字典名称</div>
            {
              list.map((item) => {
                return (<div className="item" key={item.key} onClick={this.choseItem.bind(this, item.key)}>
                  <label style={current == item.key ? {color: "#2B86EE"} : {}}>{item.name}</label>
                  <div style={current == item.key ? {opacity: 1} : {}} className="arrow"></div>
                </div>)
              })
            }
          </div>
          <div className="edit">
            <div className="head">编辑</div>
            <div className="item">
              <label><span className="star">*</span>字段名称(不能为空)：</label>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="0">其他材料-转报废状态配置</Option>
              </Select>
            </div>
            <div className="item">
              <label><span className="star">*</span>选项内容（至少有一项）：</label>
            </div>
            <div className="item">
              <label><span className="star">*</span>提前X天开始提醒</label>
              <Select className="btn" showSearch placeholder="请选择">
                {
                  dataSource.map((option) => {
                    return <Option value={option.key}>{option.value}</Option>
                  })
                }
              </Select>
              <Button type="primary" onClick={this.showModel}>编辑</Button>
            </div>
            <div className="item">
              <label><span className="star">*</span>提醒内容：</label>
              <Input type="textarea" className="textarea" placeholder="请输入" />
            </div>
            <Button className="save" type="primary">保存</Button>
          </div>
        </div>
        <Modal
          title="编辑"
          width="285px"
          visible={showModel}
          onCancel={this.closeModel}
          footer={[
            <Button type="primary" size="small">保存</Button>
          ]}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            size="small"
            pagination={false}
            scroll={{y: 350}}
          />
          <a href="javascript:;" style={{lineHeight: "30px"}} onClick={this.addOption}>添加新选项</a>
        </Modal>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(Status))