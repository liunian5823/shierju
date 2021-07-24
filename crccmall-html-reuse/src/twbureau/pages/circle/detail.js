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
const ApplyInfo = (e) => {
  return (
      <div className="apply">
        <div className="title">申请人信息</div>
        <div className="content">
          <div>申请日期：{e.location.createTime}</div>
          <div>所属工程公司：{e.location.toCompany}</div>
          <div>项目名称： {e.location.projectName}</div>
          <div>部门省份：{e.location.provinceName}{e.location.cityName}{e.location.countyName}</div>
          <div>申请人姓名：{e.location.applyforUserName}</div>
        </div>
      </div>
  )
}
// 物资详情
const GoodsDetail = (e) => {
  let columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    }, {
      title: '周转部门',
      dataIndex: 'upCompany',
      key: 'upCompany'
    }, 
    {
      title: '材料类型',
      dataIndex: 'type',
      key: 'type',
      render: (value, row, index) => {
          if (value == '1') {
              return '周转材料'
          } else if (value == '2') {
              return '施工设备'
          } else if (value == '3') {
              return '其他循环物资'
          } else {
              return ''
          }
      }
    }, {
      title: '资产名称',
      dataIndex: 'assetName',
      key: 'assetName'
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
    }, {
      title: '闲置数量',
      dataIndex: 'leaveCount',
      key: 'leaveCount'
    }, 
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '购置原值 (元)',
      dataIndex: 'originalValue',
      key: 'originalValue'
    }, 
    {
      title: '申请周转数量',
      dataIndex: 'appliedNumber',
      key: 'appliedNumber',
    }, {
      title: '周转价 (元)',
      dataIndex: 'turnoverPrice',
      key: 'turnoverPrice'
    }, 
    {
      title: '已周转次数',
      dataIndex: 'turnoverTime',
      key: 'turnoverTime',
    }, {
      title: '周转后状态',
      dataIndex: 'status',
      key: 'status',
      render: (value, row, index) => {
          if (value == '1') {
              return '在用'
          } else if (value == '2') {
              return '闲置'
          } else if (value == '3') {
              return '可周转'
          } else if (value == '4') {
              return '周转中'
          } else if (value == '5') {
              return '已周转'
          } else if (value == '6') {
              return '可处置'
          } else if (value == '7') {
              return '处置中'
          } else if (value == '8') {
              return '已处置'
          } else if (value == '9') {
              return '可租赁'
          } else if (value == '10') {
              return '已租赁'
          } else if (value == '11') {
              return '报废'
          } else if (value == '12') {
              return '报损'
          } else {
              return ''
          }
      }
    }
  ]
  let dataSource = e.location
  return (
    <div className="circle">
      <div className="title">
        物资详情
        <Button className="button" type="primary">导出Excel</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 1500 }}
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
const Process = (e) => {
  let process=e.location
  // let process = [
  //   {
  //     head: '项目部XX部长',
  //     name: '张三三',
  //     dateTime: '2021.08.23 12:00:00',
  //     status: '审核通过',
  //     statusKey: 'agree', // agree通过 refuse拒绝 waitting审核中
  //     explain: '我是审批说明'
  //   },
  //   {
  //     head: '项目管理员',
  //     name: '李四小',
  //     dateTime: '2021.08.23 12:00:00',
  //     status: '审核中',
  //     statusKey: 'waitting', // agree通过 refuse拒绝 waitting审核中
  //     explain: '我是审批说明'
  //   },
  //   {
  //     head: '项目管理员',
  //     name: '李四',
  //     dateTime: '2021.08.23 12:00:00',
  //     status: '拒绝',
  //     statusKey: 'refuse', // agree通过 refuse拒绝 waitting审核中
  //     explain: '我是审批说明'
  //   } 
  // ]
  return (
    <div className="audit">
      <div className="title">审批流程</div>
      <div className="process">
        {
          process.map((item, index) => {
            return (
              <div key={index} className={`item ${item.statusKey}`}>
                <div className="head"><div></div><span>{item.turnoverApprovalId}</span></div>
                <div className="content">
                  <div className="name">{item.approver}</div>
                  <div className="date">{item.approvalTime}</div>
                  <div className="status">{item.state=="0" ? "审核通过" : element.state == "1" ? "审核拒绝" : element.state == "2" ? "审核中" : ""}</div>
                  <div className="explain">审批说明：{item.remark}</div>
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
      visible: false,
      xiangqing: [],
    }
  }
  componentWillMount() {
    this.getUserInfo();
  }
  getUserInfo = () => {
    api.ajax("get", "http://10.10.9.175:9999/materialTurnoverApprovalController/getMaterialApproval/" + this.props.match.params.id ,{}).then(r => {
      console.log(r)
      var xiangqings = r.data
      for (let index = 0;  index< xiangqings.approvalRematerialInfoList.length; index++) {
        const element = xiangqings.approvalRematerialInfoList[index];
        element['index']=index+1
        element['upCompany']=this.props.match.params.upCompany
      }      
      for (let index2 = 0;  index2< xiangqings.approvalProcessList.length; index2++) {
        const element2 = xiangqings.approvalProcessList[index2];
        element2['statusKey']=element['state']=="0" ? "agree" : element['state'] == "1" ? "refuse" : element['state'] == "2" ? "waitting" : ""
      }
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
        <ApplyInfo  location={this.state.xiangqing}/>
        <GoodsDetail location={this.state.xiangqing.approvalRematerialInfoList}/>
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
        <Process location={this.state.xiangqing.approvalProcessList}/>
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