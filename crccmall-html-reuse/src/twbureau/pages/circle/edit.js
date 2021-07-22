import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import '../../style/detail.css';
import '../../style/edit.css';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import { Table, Button, Upload, Icon, message, Input, Modal, Select } from 'antd';

const Option = Select.Option;
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
class CircleEdit extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: '1',
          key: '1',
          width: 100
        }, {
          title: '调出部门',
          dataIndex: '2',
          key: '2',
          width: 100
        }, 
        {
          title: '材料类型',
          dataIndex: '3',
          key: '3',
          width: 100
        }, {
          title: '资产名称',
          dataIndex: '4',
          key: '4',
          width: 100
        },
        {
          title: '规格型号',
          dataIndex: '5',
          key: '5',
          width: 100
        },
        {
          title: '闲置数量',
          dataIndex: '6',
          key: '6',
          width: 100
        },
        {
          title: '单位',
          dataIndex: '7',
          key: '7',
          width: 100
        },
        {
          title: '购置原值(元)',
          dataIndex: '8',
          key: '8',
          width: 100
        },
        {
          title: '申请调入数量',
          dataIndex: '9',
          key: '9',
          width: 150,
          render: (text) => {
            return (
              <Input onBlur={this.applyNum} value={text}/>
            )
          }
        },
        {
          title: '周转价',
          dataIndex: '10',
          key: '10',
          width: 100,
          render: (text) => {
            return (
              <Input onBlur={this.price} value={text}/>
            )
          }
        },
        {
          title: '已周转次数',
          dataIndex: '11',
          key: '11',
          width: 150
        },
        {
          title: '周转后状态',
          dataIndex: '12',
          key: '12',
          width: 150,
          render: (value) => {
            return (
              <Select showSearch
                style={{ width: 120 }}
                onChange={this.handleChange}
                defaultValue={value}
              >
                <Option value="0">可周转</Option>
                <Option value="1">在用</Option>
                <Option value="2">闲置</Option>
                <Option value="3">可处置</Option>
                <Option value="4">可租赁</Option>
              </Select>
            )
          }
        }
      ],
      dataSource: [
        {
          1: 1,
          2: "XXX项目部",
          3: "周转材料",
          4: "XXX名称",
          5: "SSS",
          6: "10",
          7: "个",
          8: "1,000",
          9: "20",
          10: "800",
          11: "22",
          12: "2",
          13: "可周转"
        }
      ],
      columns2: [
        {
          title: '操作',
          width: 0,
          dataIndex: '0',
          key: '0',
          render: (value) => {
            return (
              <a href="javescript:;">删除</a>
            )
          }
        },
        {
          title: '序号',
          dataIndex: '1',
          key: '1',
          width: 50
        }, {
          title: '调出部门',
          dataIndex: '2',
          key: '2',
          width: 100
        }, 
        {
          title: '材料类型',
          dataIndex: '3',
          key: '3',
          width: 100
        }, {
          title: '资产名称',
          dataIndex: '4',
          key: '4',
          width: 100
        },
        {
          title: '规格型号',
          dataIndex: '5',
          key: '5',
          width: 100
        },
        {
          title: '闲置数量',
          dataIndex: '6',
          key: '6',
          width: 100
        },
        {
          title: '单位',
          dataIndex: '7',
          key: '7',
          width: 100
        },
        {
          title: '购置原值(元)',
          dataIndex: '8',
          key: '8',
          width: 100
        },
        {
          title: '申请调入数量',
          dataIndex: '9',
          key: '9',
          width: 150
        },
        {
          title: '周转价',
          dataIndex: '10',
          key: '10',
          width: 100
        },
        {
          title: '已周转次数',
          dataIndex: '11',
          key: '11',
          width: 150
        },
        {
          title: '周转后状态',
          dataIndex: '12',
          key: '12',
          width: 150
        }
      ],
      value: 'wqoewqeqwjkwqjfkqwflk',
      visible: false,
      showAddGoods: false
    }
  }
  handleChange = (e) => {}
  applyNum = (e) => {
    console.log(e.target.value)
  }
  price = (e) => {
    console.log(e.target.value)
  }
  submit = () => {
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
    message.success('提交成功');
  };
  error = () => {
    message.error('出错啦~');
  };
  // 通过 rowSelection 对象表明需要行选择
  rowSelection = {
    onChange(selectedRowKeys, selectedRows) {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect(record, selected, selectedRows) {
      console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
      console.log(selected, selectedRows, changeRows);
    },
  };
  addGoodsCancel = () => {
    this.setState({
      showAddGoods: false
    })
  }
  addGoodsCertain = () => {
  }
  addGoods = () => {
    this.setState({
      showAddGoods: true
    })
  }
  render () {
    return (
      <div>
        <ApplyInfo />
        <div className="circle">
          <div className="title">
            物资详情
            <Button className="button" onClick={this.addGoods} type="primary">添加周转物资</Button>
          </div>
          <Table
            scroll = {{x: 944}}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
          />
        </div>
        <div className="file">
          <div className="title">
            附件<span className="little">最多上传5个格式为doc、xlsx、pdf、jpg、png单个文件，体积小于5M的图片</span>
          </div>
          <Upload className="upload" {...this.state.uploadFileConfig} fileList={this.state.fileList} onChange={this.fileUploadChange}>
            <Button type="ghost">
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        </div>
        <div className='remark'>
          <div className="title">备注</div>
          <Input className="content" type="textarea" value={this.state.value} />
        </div>
        <div className="bottom">
          <Button>关闭</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submit}>提交</Button>
        </div>
        <Modal 
          title="选择产品列表" 
          width="805px" 
          visible={this.state.showAddGoods}
          onCancel={this.addGoodsCancel}
          onOk={this.addGoodsCertain}
          okText="确认添加"
          cancelText="关闭"
        >
          <div className="search">
            <div className="search_item">
              <span className="name">资产分类：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">局/处/项目部</Option>
              </Select>
            </div>
            <div className="search_item">
              <span className="name">资产名称：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">局/处/项目部</Option>
              </Select>
            </div>
            <div className="btn_box">
              <Button type="primary">搜索</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button>重置</Button>
            </div>
          </div>
          <Table
            scroll = {{x: 768}}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            rowSelection={this.rowSelection}
          />
          <Table
            scroll = {{x: 768}}
            dataSource={this.state.dataSource}
            columns={this.state.columns2}
          />
        </Modal>
        <Modal title="提示" width="320px" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          <p>请确认是否提交</p>
        </Modal>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(CircleEdit))