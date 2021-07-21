import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import api from '@/framework/axios';
import '../../style/detail.css'
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import { Table, Button, Input } from 'antd';

// 申请人信息
const ApplyInfo = () => {
  return (
      <div className="apply">
        <div className="title">申请人信息</div>
        <div className="content">
          <div>申请日期：2021-06-05</div>
          <div>所属工程公司：XXX公司</div>
          <div>项目名称： XXX项目部</div>
          <div>部门省份：北京市 北京市 海淀区</div>
          <div>申请人姓名：张三</div>
        </div>
      </div>
  )
}
// 物资详情
const GoodsDetail = () => {
  let columns = [
    {
      title: '序号',
      dataIndex: '1',
      key: '1',
    }, {
      title: '时间',
      dataIndex: '2',
      key: '2'
    }, 
    {
      title: '事件',
      dataIndex: '3',
      key: '3',
    }, {
      title: '描述',
      dataIndex: '4',
      key: '4'
    }
  ]
  let dataSource = [
    {
      1: 1,
      2: "2020-10-01 08:00:00",
      3: "物资录入",
      4: "初始信息：录入物资信息，物资状态为在用"
    }, {
      1: 1,
      2: "2020-10-01 08:00:00",
      3: "物资录入",
      4: "初始信息：录入物资信息，物资状态为在用"
    }
  ]
  return (
    <div className="circle">
      <div className="title">
        物资详情
        <Button className="export" type="primary">导出Excel</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  )
}
// 附件
const Enclosure = () => {
  let files = [
    "标的图片.jpg",
    "34hj4hjh54 cvcvvccvbc cvcvjhj.jpg",
    "34hj4hjh54 cvcvvccvbc ……jhj.jpg"
  ]
  return (
    <div className="enclosure">
      <div className="title">附件</div>
      <div className="box">
        {
          files.map((file, index) => {
            return (<a href={file} className="item" key={index}>{file}</a>)
          })
        }
      </div>
    </div>
  )
}
// 备注
const Remark = () => {
  let value = "XX项目已施工完毕，现申请周转XX项目已施工完毕，现申请周转XX项目已施工完毕，现申请周转XX项目已施工完毕，现申请周转"
  return (
    <div className='remark'>
      <div className="title">备注</div>
      <Input className="content" disabled type="textarea" value={value} />
    </div>
  )
}
// 审批流程
const Process = () => {
  let process = [
    {
      head: '项目部XX部长',
      name: '张三三',
      dateTime: '2021.08.23 12:00:00',
      status: '审核通过',
      statusKey: 'agree', // agree通过 refuse拒绝 waitting审核中
      explain: '我是审批说明'
    },
    {
      head: '项目管理员',
      name: '李四小',
      dateTime: '2021.08.23 12:00:00',
      status: '审核中',
      statusKey: 'waitting', // agree通过 refuse拒绝 waitting审核中
      explain: '我是审批说明'
    },
    {
      head: '项目管理员',
      name: '李四',
      dateTime: '2021.08.23 12:00:00',
      status: '拒绝',
      statusKey: 'refuse', // agree通过 refuse拒绝 waitting审核中
      explain: '我是审批说明'
    } 
  ]
  return (
    <div className="audit">
      <div className="title">审批流程</div>
      <div className="process">
        {
          process.map((item, index) => {
            return (
              <div key={index} className={`item ${item.statusKey}`}>
                <div className="head"><div></div><span>{item.head}</span></div>
                <div className="content">
                  <div className="name">{item.name}</div>
                  <div className="date">{item.dateTime}</div>
                  <div className="status">{item.status}</div>
                  <div className="explain">审批说明：{item.explain}</div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
// 底部
const Bottom = () => {
  return (
    <div className="bottom">
      <Button type="primary">关闭</Button>
    </div>
  )
}
class CircleDetail extends React.Component{
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillMount() {
  }
  render(){
    return (
      <div className="detail">
        <Breadcrumb location={this.props.match}/>
        <ApplyInfo />
        <GoodsDetail />
        <Enclosure />
        <Remark />
        <Process />
        <Bottom />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(CircleDetail))