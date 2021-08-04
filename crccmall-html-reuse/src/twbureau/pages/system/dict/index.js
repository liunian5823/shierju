import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import './index.css';
import '../../../style/model.css';
import { Input, Select, Modal } from 'antd';

class Dict extends  React.Component{
  constructor(props){
    super(props)
    this.state = {
      list: [{
        name: '周转材料-钢模板子类目',
        param: 'fadsdfajfd',
        status: '1',
        key: 0,
        content:[{
          key: 'a',
          name: '平面钢模板',
          value: 'value1'
        }, {
          key: 'b',
          name: '异型钢模板',
          value: 'value2'
        }]
      }, {
        name: '周转材料-其他周转材料子类目',
        param: 'fadsdfajfd',
        status: '0',
        key: 1,
        content:[{
          key: 'a2',
          name: '平面钢模板2',
          value: 'value1'
        }, {
          key: 'b2',
          name: '异型钢模板2',
          value: 'value2'
        }]
      }],
      current: 0,
      child: 0,
      curItem: {
        name: '',
        param: '',
        status: '',
        key: null,
      },
      curChild: {
        key: null,
        name: '',
        value: ''
      },
      dicVisible: false,
      contentVisible: false,
      isDictEdit: false,
      isContentEdit: false
    }
  }
  choseItem(key) {
    this.setState({
      current: key
    })
  }
  chooseChild(key) {
    this.setState({
      child: key
    })
  }
  delete = () => {
    let { list, current } = this.state
    list.splice(current, 1)
    this.setState({
      list: list,
      current: 0,
      child: (list[0] && list[0].content) ? list[0].content[0].key : null
    })
  }
  deleteChild = () => {
    let { list, current, child } = this.state
    if (list[current] && list[current].content) {
      list[current].content.splice(child, 1)
    }
    this.setState({
      list: list,
      child: (list[current] && list[current].content) ? 0 : null
    })
  }
  moveUp = () => {
    let { list, current, child } = this.state
    if (child == 0) {
      return
    }
    let temp = list[current].content[child]
    list[current].content[child] = list[current].content[child - 1]
    list[current].content[child - 1] = temp
    this.setState({
      list: list,
      child: child - 1
    })
  }
  moveDown = () => {
    let { list, current, child } = this.state
    if (child == list[current].content.length - 1) {
      return
    }
    let temp = list[current].content[child]
    list[current].content[child] = list[current].content[child + 1]
    list[current].content[child + 1] = temp
    this.setState({
      list: list,
      child: child + 1
    })
  }
  add = () => {
    let obj = {
      name: '',
      param: '',
      status: '',
      key: null
    }
    this.setState({
      curItem: obj,
      dicVisible: true,
      isDictEdit: false
    })
  }
  edit = () => {
    let {list, current} = this.state
    let obj = list[current]
    this.setState({
      curItem: obj,
      dicVisible: true,
      isDictEdit: true
    })
  }
  addChild = () => {
    let obj = {
      name: '',
      value: ''
    }
    this.setState({
      curChild: obj,
      contentVisible: true,
      isContentEdit: false
    })
  }
  editChild = () => {
    let {list, current, child} = this.state
    let obj = list[current].content[child]
    this.setState({
      curChild: obj,
      contentVisible: true,
      isContentEdit: true
    })
  }
  handleOk = () => {
    let { list, current, curItem, isDictEdit } = this.state
    if (isDictEdit) {
      list[current] = curItem
    } else {
      list.push(curItem)
    }
    this.setState({
      list: list,
      dicVisible: false
    })
  }
  handleCancel = () => {
    this.setState({
      dicVisible: false
    })
  }
  handleContentOk = () => {
    let { list, current, curChild, isContentEdit } = this.state
    if (isContentEdit) {
      list[current].content[child] = curChild
    } else {
      list[current].content.push(curChild)
    }
    this.setState({
      list: list,
      contentVisible: false
    })
  }
  handleContentCancel = () => {
    this.setState({
      contentVisible: false
    })
  }
  contentChange = (value, field) => {
    let { curChild } = this.state
    curChild[field] = value
    this.setState({
      curChild: curChild
    })
  }
  dicChange = (value, field) => {
    let { curItem } = this.state
    curItem[field] = value
    this.setState({
      curItem: curItem
    })
  }
  componentDidMount() {}
  render() {
    let { list, current, child, curItem, curChild } = this.state
    return (
      <div className="dict">
        <Breadcrumb location={this.props.match} />
        <Search>
          <div className="search_item">
            <span className="title">字典名称：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="0">全部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="title">字典内容配置：</span>
            <Input className="btn" />
          </div>
          <div className="search_item">
            <span className="title">启动状态：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="0">全部</Option>
            </Select>
          </div>
        </Search>
        <div className="main">
          <div className="list">
            <div className="handle">
              <img src="./static/img/twbureau/add.png" onClick={this.add}/>
              <img src="./static/img/twbureau/edit.png" onClick={this.edit}/>
              <img src="./static/img/twbureau/delete.png" onClick={this.delete}/>
            </div>
            <div className="head">
              <label style={{width: "40px"}}>序号</label>
              <label style={{width: "250px"}}>字典名称</label>
              <label style={{width: "120px"}}>字典参数</label>
              <label>启动状态</label>
            </div>
              {
                list.map((item, index) => {
                  return (<div className="item" key={item.key} onClick={this.choseItem.bind(this, index)}>
                    <label style={current == index ? {color: "#2B86EE", width: "40px"} : {width: "40px"}}>{index + 1}</label>
                    <label style={current == index ? {color: "#2B86EE", width: "250px"} : {width: "250px"}}>{item.name}</label>
                    <label style={current == index ? {color: "#2B86EE", width: "120px"} : {width: "120px"}}>{item.param}</label>
                    <label style={current == index ? {color: "#2B86EE"} : {}}>{item.status == '1' ? '开启' : '关闭'}</label>
                    <div style={current == index ? {opacity: 1} : {}} className="arrow"></div>
                  </div>)
                })
              }
            </div>
          <div className="detail">
            <div className="handle">
              <img src="./static/img/twbureau/add.png" onClick={this.addChild}/>
              <img src="./static/img/twbureau/edit.png" onClick={this.editChild}/>
              <img src="./static/img/twbureau/delete.png" onClick={this.deleteChild}/>
              <img src="./static/img/twbureau/up.png" onClick={this.moveUp}/>
              <img src="./static/img/twbureau/down.png" onClick={this.moveDown}/>
            </div>
            <div className="head">
              <label style={{width: "40px"}}>序号</label>
              <label style={{width: "100px"}}>字典内容配置</label>
              <label>字典值</label>
            </div>
            {
                list[current] && list[current].content.map((item, index) => {
                  return (<div className="item" key={item.key} onClick={this.chooseChild.bind(this, index)}>
                    <label style={child == index ? {color: "#2B86EE", width: "40px"} : {width: "40px"}}>{index + 1}</label>
                    <label style={child == index ? {color: "#2B86EE", width: "100px"} : {width: "100px"}}>{item.name}</label>
                    <label style={child == index ? {color: "#2B86EE"} : {}}>{item.value}</label>
                  </div>)
                })
              }
          </div>
        </div>
        <Modal
           title="数据字典配置"
           visible={this.state.dicVisible}
           onOk={this.handleOk}
           onCancel={this.handleCancel}
        >
          <div className="config-item">
            <label>字典名称：</label>
            <Input className="btn" value={curItem.name} onChange={(e) => {this.dicChange(e.target.value, 'name')}}/>
          </div>
          <div className="config-item">
            <label>字典参数：</label>
            <Input className="btn" value={curItem.param} onChange={(e) => {this.dicChange(e.target.value, 'param')}}/>
          </div>
          <div className="config-item">
            <label>启动状态：</label>
            <Select className="btn" showSearch placeholder="请选择" value={curItem.status} onChange={(e) => {this.dicChange(e, 'status')}}>
              <Select.Option value="1">启动</Select.Option>
              <Select.Option value="0">关闭</Select.Option>
            </Select>
          </div>
        </Modal>
        <Modal
           title="数据内容配置"
           visible={this.state.contentVisible}
           onOk={this.handleContentOk}
           onCancel={this.handleContentCancel}
        >
          <div className="config-item">
            <label>字典内容配置：</label>
            <Input className="btn" value={curChild.name} onChange={(e) => {this.contentChange(e.target.value, 'name')}}/>
          </div>
          <div className="config-item">
            <label>字典值：</label>
            <Input className="btn" value={curChild.value} onChange={(e) => {this.contentChange(e.target.value, 'value')}}/>
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
export default withRouter(connect(mapStateToProps)(Dict))