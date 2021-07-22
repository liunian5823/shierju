import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import api from '@/framework/axios';
import '../../style/detail.css'
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import { Table } from 'antd';

// 设备 履带挖掘机
const Device = (e) => {
  console.log(e)
  return (
      <div className="device">
        <div className="title">{e.location.prodottoId}</div>
        <div className="content">
          <div>闲置1台 ｜ 调拨锁定0台</div>
          <div>资产管理部门：XXXXX部门</div>
          <div>资产管理员：张三</div>
          <a>查看联系方式</a>
        </div>
      </div>
  )
}

// 台账信息
const Info = (e) => {
  return (
    <div className="info">
      <div className="title">台账信息</div>
      <div className="content">
        <div className="item">所属工程公司：{e.location.belongingCompany}</div>
        <div className="item">资产管理部门：{e.location.department}</div>
        <div className="item">项目名称：{e.location.projectName}</div>
        <div className="item">管理号码：{e.location.manageNumber}</div>
        <div className="item">资产分类：{e.location.type}</div>
        <div className="item">型号：{e.location.modelNumber}</div>
        <div className="item">资产名称：{e.location.assetsAlias}</div>
        <div className="item">装机功率：{e.location.installedPower}</div>
        <div className="item">规格：{e.location.standards}</div>
        <div className="item">购置年月：{e.location.buyTime}</div>
        <div className="item">生产厂家：{e.location.manufacturer}</div>
        <div className="item">在用数量：{e.location.number}</div>
        <div className="item">原值：{e.location.originalValue}</div>
        <div className="item">所在地：{e.location.provinceName}{e.location.cityName}{e.location.countyName}</div>
        <div className="item">资产状态：{e.location.status}</div>
        <div className="item">预计退场时间：{e.location.exitTime}</div>
        <div className="item">进场类别：{e.location.category}</div>
        <div className="item">周转次数：{e.location.turnoverTimes}</div>
        <div className="remarks">
          <span>备注：</span>
          <div>{e.location.remark}</div>
        </div>
      </div>
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
// 物资循环明细
const Circle = () => {
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
      <div className="title">物资循环明细</div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          size: "small",
          showSizeChanger: true,
          showQuickJumper: true,
          current: 1, total: 10
        }}
      />
    </div>
  )
}
// 物资循环日志
const Log = () => {
  let columns = [{
      title: '序号',
      dataIndex: '1',
      key: '1',
      width: '100px'
  }, {
    title: '日期',
    dataIndex: '2',
    key: '2',
  }, {
    title: '事件',
    dataIndex: '3',
    key: '3',
  }, {
    title: '描述',
    dataIndex: '4',
    key: '4'
  }]
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
    <div className="log">
      <div className="title">物资循环日志</div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          size: "small",
          showSizeChanger: true,
          showQuickJumper: true}}
      />
    </div>
  )
}
class detailRests extends React.Component {
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
      xiangqing:[],
    }
  }
  componentWillMount() {
   
    this.getUserInfo()
  }
  getUserInfo = () => {    
    api.ajax("get", "http://10.10.9.175:9999/inForApproval/getByTypeAndprodottoId?type=" + this.props.match.params.type + "&prodottoId=" + this.props.match.params.prodottoId, {}).then(r => {
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
  render() {
    let { imgIndex, images } = this.state;
    return (
      <div className="detail">
        <Breadcrumb location={this.props.match}/>
        <Device location={this.state.xiangqing}></Device>
        <Info location={this.state.xiangqing}></Info>
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
        <Circle />
        <Log />
      </div>
    )
  }
} 
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(detailRests))