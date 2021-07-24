import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import api from '@/framework/axios';
import '../../style/detail.css'
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import { Table, Button, Input, Form, Radio, Modal, message } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
        <Button className="button" type="primary">导出Excel</Button>
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
class CircleDetail extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      imgIndex: 0,
      images: [
        {source: './static/img/twbureau/order@2x.png'}, 
        {source: './static/img/twbureau/jingjia@2x.png'},
        {source: './static/img/twbureau/order@2x.png'}, 
        {source: './static/img/twbureau/jingjia@2x.png'},
        {source: './static/img/twbureau/order@2x.png'}, 
        {source: './static/img/twbureau/jingjia@2x.png'},
        {source: './static/img/twbureau/order@2x.png'}, 
        {source: './static/img/twbureau/jingjia@2x.png'},
        {source: './static/img/twbureau/order@2x.png'}, 
        {source: './static/img/twbureau/jingjia@2x.png'}
      ],
      verify: 1,
      remark: 'wewqe',
      visible: false
    }
  }
  componentWillMount() {
    this.getUserInfo();
  }
  getUserInfo = () => {
    api.ajax("get", "http://10.10.9.175:9999/materialTurnoverApprovalController/getMaterialApproval/" + this.props.match.params.id ,{}).then(r => {
      console.log(r)
      var xiangqings = r.data
      this.setState({
        xiangqing: xiangqings
      })
    }).catch(r => {
      console.log(r)
    })
  }
  componentDidMount() {
    // 图片查看器
    const viewer = new Viewer(document.getElementById('images'), {
      inline: false,
      viewed() {
        viewer.zoomTo(1);
      },
    });
  }
  moveLeft = () => {
    if (this.state.imgIndex > 0) {
      this.setState({
        imgIndex: this.state.imgIndex - 1
      })
    }
  }
  moveRight = () => {
    if (this.state.imgIndex < this.state.images.length - 6) {
      this.setState({
        imgIndex: this.state.imgIndex + 1
      })
    }
  }
  onVerifyChange = (e) => {
    this.setState({
      verify: e.target.value
    })
  }
  onRemarkChange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }
  vertifyCertain = (e) => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      visible: false,
    });
    this.success()
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  success = () => {
    message.success('单据已审核拒绝');
  };
  error = () => {
    message.error('出错啦~');
  };
  render() {
    let { imgIndex, images } = this.state;
    return (
      <div className="detail">
        <Breadcrumb location={this.props.match}/>
        <ApplyInfo />
        <GoodsDetail />
        <div className="goods_images">
          <div className="title">资产图片</div>
          <div className="box">
            <div className="left" style={{visibility: imgIndex > 0 ? "visible" : "hidden"}} onClick={this.moveLeft}></div>
            <div className="slider">
              <ul id="images" style={{left: `-${imgIndex * 137}px`}}>
                {
                  images.map((image, index) => {
                    return (
                      <li key={index}>
                        <img src={image.source} alt="Picture 1"></img>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="right" style={{visibility: imgIndex < images.length - 6  ? "visible" : "hidden"}} onClick={this.moveRight}></div>
          </div>
        </div>
        <Enclosure />
        <Remark />
        <Process />
        {/* 审批 */}
        <div className="vertify-box">
          <div className="title">审批</div>
          <div className="vertify">
            <Form>
              <FormItem
                  className="whole"
                  label="审批结果："
                >
                  <RadioGroup onChange={this.onVerifyChange} value={this.state.verify}>
                    <Radio key="all" value={1}>审核通过</Radio>
                    <Radio key="part" value={0}>审核拒绝</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem
                className="whole"
                label="备注："
              >
                <Input className="textarea" type="textarea" onChange={this.onRemarkChange} value={this.state.remark} />
              </FormItem>
            </Form>
          </div>
        </div>
        <div className="bottom">
          {/* <Button type="primary">关闭</Button> */}
          {/* 审核按钮 */}
          <Button>取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.vertifyCertain}>确认</Button>
        </div>
        <Modal title="提示" width="320px" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          <p>请确认是否审核拒绝</p>
        </Modal>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(CircleDetail))