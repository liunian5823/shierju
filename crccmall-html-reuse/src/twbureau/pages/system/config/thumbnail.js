import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import './index.css';
import '../../../style/model.css';
import { Input, Button, Select, Icon, Upload } from 'antd';

class Thumbnail extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      list: [{
        name: '周转材料-缩略图配置',
        key: 0,
        field: '0',
        options: [
          {
            value: '0',
            file: {
              url: './static/img/twbureau/jingjia@2x.png'
            }
          },
          {
            value: '1',
            file: {}
          }
        ]
      }, {
        name: '施工设备-缩略图配置',
        key: 1
      }],
      imageConfig: {
        action: '/upload.do',
        listType: 'picture-card',
        accept: 'image/png,image/jpg'
      }
    }
  }
  choseItem(key) {
    this.setState({
      current: key
    })
  }
  delete(option, index) {
    let list = this.state.list
    let options = list[this.state.current].options || []
    list[this.state.current].options = options.splice(index, 1)
    this.setState({
      list: list
    })
  }
  addOptions = () => {
    let list = this.state.list
    let options = list[this.state.current].options || []
    let newObj = {
      value: '',
      file: {}
    }
    options.push(newObj)
    list[this.state.current].options = options
    this.setState({
      list: list
    })
  }
  onChange = (file, fileList) => {
    // 确保只有一个文件
    fileList = [file]
    console.log(fileList)
  }
  moveUp(option, index) {
    if (index == 0) {
      return
    }
    let list = this.state.list
    let options = list[this.state.current].options
    let upOption = options[index - 1]
    options[index] = upOption
    options[index - 1] = option
    this.setState({
      list: list
    })
  }
  moveDown(option, index) {
    let list = this.state.list
    if (index == list.length - 1) {
      return
    }
    let options = list[this.state.current].options
    let downOption = options[index + 1]
    options[index] = downOption
    options[index + 1] = option
    this.setState({
      list: list
    })
  }
  render() {
    let { list, current, imageConfig } = this.state
    return (
      <div className="thumbnail">
        <Breadcrumb location={this.props.match} />
        <div className="main">
          <div className="list">
              <div className="head"><label>序号</label>配置项</div>
              {
                list.map((item, index) => {
                  return (<div className="item" key={item.key} onClick={this.choseItem.bind(this, item.key)}>
                    <label style={current == item.key ? {color: "#2B86EE"} : {}}><label>{index + 1}</label>{item.name}</label>
                    <div style={current == item.key ? {opacity: 1} : {}} className="arrow"></div>
                  </div>)
                })
              }
            </div>
            <div className="edit">
              <div className="head">编辑</div>
              <div className="item">
                <label><span className="star">*</span>字段名称(不能为空)：</label>
                <Select className="btn" showSearch defaultValue={list[current].field} placeholder="请选择">
                  <Option value="0">钢模板</Option>
                  <Option value="1">台车</Option>
                  <Option value="2">挂篮</Option>
                </Select>
            </div>
            <div className="item">
              <label><span className="star">*</span>选项内容（至少有一项）：</label>
              <Button type="primary" className="addOption" onClick={this.addOptions}>增加选项</Button>
            </div>
            {
              list[current].options ? list[current].options.map((option, index) => {
                return (<div className="card">
                  <div className="left">
                    <img className="close" src="./static/img/twbureau/close@2x.png" onClick={this.delete.bind(this, option, index)}/>
                    <Select className="select" showSearch placeholder="请选择" defaultValue={option.value}>
                      <Option value="0">平面刚模板</Option>
                      <Option value="1">异型钢模板</Option>
                    </Select>
                    <div className="text">图标：支持上传png、jpg等常用格式图片</div>
                    <div className="image" style={{backgroundImage:`url(${option.file.url})`, backgroundSize: 'cover'}}>
                      <Upload {...imageConfig} className={`upload ${option.file.url ? 'opacity0' : 'opacity1'}`}>
                        <Icon type="plus" />
                        <div className="ant-upload-text">上传照片</div>
                      </Upload>
                    </div>
                  </div>
                  <div className="right">
                    <Button className="button" onClick={this.moveUp.bind(this, option, index)}>
                      <Icon type="up" />上移
                    </Button>
                    <Button className="button" onClick={this.moveDown.bind(this, option, index)}>
                      <Icon type="down" />下移
                    </Button>
                  </div>
                </div>)
              }) : <div></div>
            }
            <div className="bottom">
              <Button type="ghost">预览</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary">保存</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(Thumbnail))