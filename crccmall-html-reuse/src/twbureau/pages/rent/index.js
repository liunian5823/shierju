import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import '../../style/list.css'
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';
import api from '@/framework/axios';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
class Rent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leasee: "",
      lessor: "",
      type: "",
      receiptNumber: "",
      name: "",
      period1: "",
      period2: "",
      expire: undefined,
      dataSource: [],
      columns: [
        {
          title: '单据编号',
          dataIndex: 'receiptNumber',
          key: 'receiptNumber',
          width:180,
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (value == '总计') {
              obj.props.colSpan = 1;
            }
            return obj
          }
        },
        {
          title: '出租方',
          dataIndex: 'lessor',
          key: 'lessor',
        },
        {
          title: '承租方',
          dataIndex: 'tenantry',
          key: 'tenantry',
        },
        {
          title: '资产分类',
          dataIndex: 'type',
          key: 'type',
          render: (value, row, index) => {
            if (value == '1') {
              return '周转材料'
            } else if (value == '2') {
              return '施工设备'
            } else {
              return '其他循环物资'
            }
          }
        },
        {
          title: '资产名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '规格型号',
          dataIndex: 'standards',
          key: 'standards',
        },
        {
          title: '数量',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
        },
        {
          title: '租赁开始时间',
          dataIndex: 'leaseStarttime',
          key: 'leaseStarttime',
        },
        {
          title: '租赁结束时间',
          dataIndex: 'leaseEndtime',
          key: 'leaseEndtime',
        },
        {
          title: '租赁天数',
          dataIndex: 'leasePeriod',
          key: 'leasePeriod',
        },
        {
          title: '单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
        },
        {
          title: '总租金',
          dataIndex: 'totalRent',
          key: 'totalRent',
        },
        {
          title: '租赁到期',
          dataIndex: 'leaseIsexpire',
          key: 'leaseIsexpire',
          render: (value, row, index) => {
            if (value == '1') {
              return '是'
            } else if (value == '2') {
              return '否'
            } else {
              return '即将到期'
            }
          }
        }
      ],
      obj: ""
    };
  }
  renderContent(value, row, index) {
    const obj = {
      children: value,
      props: {},
    };
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    return obj;
  };
  componentWillMount() {
    var obj = {};
    obj['type'] = this.state.type;
    obj['page'] = '1';
    obj['rows'] = '10';
    this.setState({
      obj: obj
    }, () => {
      this.getUserInfo();
    });
  }
  // 资产分类
  typeChange(value) {
    // console.log(value);
    this.setState({
      type: value
    })
  }
  // 单据编号
  handleChange(e) {
    this.setState({
      receiptNumber: e.target.value
    })
  }
  // 租赁周期
  periodChange(date, dateString) {
    console.log(dateString);
    this.setState({
      period1: dateString[0],
      period2: dateString[1]
    }, () => {
      console.log(this.state.period1, this.state.period2);
    })
  }
  // 租赁到期
  expireChange(value) {
    console.log(value);
    this.setState({
      expire: value
    })
  }
  callback(key) {
    var obj = {};
    obj['page'] = '1';
    obj['rows'] = '10';
    obj['type'] = key;
    this.setState({
      type: key
    })
    this.setState({
      obj: obj
    }, () => {
      console.log(obj);
      this.getUserInfo();
    });
  }
  search() {
    // console.log(this.state)
    var obj = {};
    obj['tenantry'] = this.state.leasee
    obj['lessor'] = this.state.lessor
    obj['type'] = this.state.type;
    obj['receiptNumber'] = this.state.receiptNumber
    obj['name'] = this.state.name;
    obj['leaseStarttime'] = this.state.period1;
    obj['leaseEndtime'] = this.state.period2;
    obj['leaseIsexpire'] = this.state.expire;
    obj['page'] = '1';
    obj['rows'] = '10';
    this.setState({
      obj: obj
    }, () => {
      this.getUserInfo();
    });
  }
  // 获取列表数据
  getUserInfo = () => {
    api.ajax("get", "http://10.10.9.175:9999/rentalInfo/page", this.state.obj).then(r => {
      console.log(r.data.rows);
      for (var i = 1; i < r.data.rows.length + 1; i++) {
        r.data.rows[i - 1]['key'] = i
      }
      var dataSources = r.data.rows;
      this.setState({ dataSource: dataSources });
    }).catch(r => {
      console.log(r)
    })
  }
  render() {
    const tabsData = [{
      key: ' ',
      name: '全部'
    }, {
      key: '1',
      name: '周转材料'
    }, {
      key: '2',
      name: '施工设备'
    }, {
      key: '3',
      name: '其他循环物资'
    }]
    return (
      <div>
        <Breadcrumb location={this.props.match} />
        <Search search={this.search.bind(this)}>
          <div className="search_item">
            <span className="head">承租方：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="jack">局/处/项目部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="head">出租方：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="jack">局/处/项目部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="head">资产分类：</span>
            <Select className="btn" showSearch defaultValue={tabsData} placeholder="请选择" value={this.state.type} onChange={this.typeChange.bind(this)}>
              {
                tabsData.map((type) => (
                  <Select.Option key={type.key}>{type.name}</Select.Option>
                ))
              }
            </Select>
          </div>
          <div className="search_item">
            <span className="head">单据编号：</span>
            <Input className="btn" placeholder="请输入" value={this.state.receiptNumber} onChange={this.handleChange.bind(this)} />
          </div>
          <div className="search_item">
            <span className="head">资产名称：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="jack">全部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="head">租赁周期：</span>
            <RangePicker className="btn" onChange={this.periodChange.bind(this)} />
          </div>
          <div className="search_item">
            <span className="head">租赁到期：</span>
            <Select className="btn" showSearch placeholder="请选择" value={this.state.expire} onChange={this.expireChange.bind(this)} >
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="1">是</Select.Option>
              <Select.Option value="0">否</Select.Option>
              <Select.Option value="2">即将到期</Select.Option>
            </Select>
          </div>
        </Search>
        <div className="table">
          {/* <Tabs onChange={this.callback.bind(this)} activeKey={this.state.type}>
              {
                tabsData.map((item, index) => {
                  return (
                    <TabPane tab={item.name} key={item.key}> */}
          <Table
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            scroll={{ x: 1800 }}
            pagination={{
              position: ["bottomCenter"],
              size: "small",
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
          {/* </TabPane>
                  )
                })
              }
            </Tabs> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(Rent))