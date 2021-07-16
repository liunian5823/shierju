import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import api from '@/framework/axios';
import '../../style/detail.css'
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import { Table } from 'antd';
import ExTable from '@/twbureau/components/exTable';

// 设备 履带挖掘机
const Device = () => {
  return (
      <div className="device">
        <div className="title">{xiangqing.name}</div>
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
const Info = () => {
  return (
    <div className="info">
      <div className="title">台账信息</div>
      <div className="content">
        <div className="item">所属工程公司：XXXX公司</div>
        <div className="item">项目名称：XXX项目部</div>
        <div className="item">材料类别：周转材料</div>
        <div className="item">所在地：北京市 北京市 海淀区</div>
        <div className="remarks">
          <span>备注：</span>
          <div>XX项目已施工完毕，现申请周转XX项目已施工完毕，现申请周转XX项目已施工完毕，现申 请周转XX项目已施工完毕，现申请周转</div>
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
      key: '2',
      children: [
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
      <ExTable
        dataSource={dataSource}
        columns={columns}
        title= {renderHeader}
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
const renderHeader = (currentPageData) => {
  return(
    <div style={{color: "red"}}>时间</div>
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
class GoodDetail extends React.Component {
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
      xiangqing:"",
    }
  }
  componentWillMount() {
   
    this.getUserInfo()
  }
  getUserInfo = () => {
    console.log(this.props.location.state.id)
    console.log(this.props.location.state.type)
    api.ajax("get", "http://10.10.9.175:9999/materialController/getMaterial/" + this.props.location.state.id + "/"+this.props.location.state.type, {}).then(r => {
      console.log(r)
      var xiangqings = r.data
      this.setState({
        xiangqing:xiangqings
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
  moveLeft() {
    if (this.state.imgIndex > 0) {
      this.setState({
        imgIndex: this.state.imgIndex - 1
      })
    }
  }
  moveRight() {
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
        <Device></Device>
        <Info></Info>
        <div className="goods_images">
          <div className="title">资产图片</div>
          <div className="box">
            <div className="left" style={{visibility: imgIndex > 0 ? "visible" : "hidden"}} onClick={this.moveLeft.bind(this)}></div>
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
            <div className="right" style={{visibility: imgIndex < images.length - 6  ? "visible" : "hidden"}} onClick={this.moveRight.bind(this)}></div>
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
export default withRouter(connect(mapStateToProps)(GoodDetail))