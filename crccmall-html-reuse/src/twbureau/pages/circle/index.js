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
class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      belongingCompany: "",
      status: undefined,
      exitTime: "",
      type: "1",
      buyTime: "",
      classify: undefined,
      dataSource: [{
        type: "1"
      }],
      columns: [
        {
          title: '周转类别',
          dataIndex: 'key',
          key: 'key'
        },
        // {
        //   title: '主材料/设备',
        //   children: []
        // },
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
          key: 'name'
        },
        {
          title: '规格型号',
          dataIndex: 'standards',
          key: 'standards',
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
        },
        {
          title: '资产状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '周转次数',
          dataIndex: 'num1',
          key: 'num1',
        },
        {
          title: '辅料/配件名称',
          dataIndex: 'num',
          key: 'num2',
        },
        {
          title: '辅料/配件子编号',
          dataIndex: 'num3',
          key: 'num3',
        },
        {
          title: '辅料/配件数量',
          dataIndex: 'num4',
          key: 'num4',
        },
        {
          title: '辅料/配件单位',
          dataIndex: 'num5',
          key: 'num5',
        },
        {
          title: '所属工程公司',
          dataIndex: 'companyName',
          key: 'companyName',
        },
        {
          title: '资产管理部门',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 200,
          render: () => <div>
            <a className="edit">申请调拨</a>
            <a className="edit">查看</a>
          </div>,
        }
      ],
      obj: "",
    };
  }

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
  // 资产名称
  handleChange(e) {
    this.setState({
      name: e.target.value
    })
  }
  // 所属工程公司/项目部：
  belongChange(value) {
    this.setState({
      belongingCompany: value
    })
  }
  // 资产状态  
  statusChange(value) {
    console.log(value);
    this.setState({
      status: value
    })
  }
  // 预计退场时间
  exitTimeChange(date, dateString) {
    // console.log(dateString);
    this.setState({
      exitTime: dateString
    })
  }
  // 资产分类
  typeChange(value) {
    // console.log(value);
    this.setState({
      type: value
    })
  }
  // 购入时间
  buyTimeChange(date, dateString) {
    // console.log(dateString);
    this.setState({
      buyTime: dateString
    })
  }
  // 分类
  classifyChange(value) {
    console.log(value);
    this.setState({
      classify: value
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
    console.log(this.state)
    var obj = {};
    obj['name'] = this.state.name;
    obj['standards'] = this.state.belongingCompany;
    obj['status'] = this.state.status;
    obj['exitTime'] = this.state.exitTime;
    obj['type'] = this.state.type;
    obj['buyTime'] = this.state.buyTime;
    obj['classify'] = this.state.classify;
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
    api.ajax("get", "http://10.10.9.175:9999/materialTurnoverApprovalController/turnoverMaterialsPage", this.state.obj).then(r => {
      console.log(r.data.rows);
      for (var i = 1; i < r.data.rows.length + 1; i++) {
        r.data.rows[i - 1]['key'] = i
      }
      var dataSources = r.data.rows;
      // this.setState({ dataSource: dataSources });
    }).catch(r => {
      console.log(r)
    })
  }
  render() {
    const tabsData = [
      // {
      //   key: ' ',
      //   name: '全部'
      // },
      {
        key: '1',
        name: '周转材料'
      },
      {
        key: '2',
        name: '施工设备'
      },
      {
        key: '3',
        name: '其他循环物资'
      }
    ]
    const Assetstates = [
      {
        key: ' ',
        name: '全部资产状态'
      }, {
        key: '1',
        name: '在用'
      }, {
        key: '2',
        name: '闲置'
      }, {
        key: '3',
        name: '可周转'
      }, {
        key: '4',
        name: '周转中'
      }, {
        key: '5',
        name: '闲置'
      }, {
        key: '6',
        name: '可周转'
      }, {
        key: '7',
        name: '周转中'
      }
    ]
    return (
      <div>
        <Breadcrumb location={this.props.match} />
        <Search search={this.search.bind(this)}>
          <div className="search_item">
            <span className="title">资产名称：</span>
            <Input className="btn" placeholder="请输入资产名称" value={this.state.name} onChange={this.handleChange.bind(this)} />
          </div>
          <div className="search_item">
            <span className="title">所属工程公司/项目部：</span>
            <Select className="btn" showSearch placeholder="请选择" value={this.state.belongingCompany} onChange={this.belongChange.bind(this)}>
              <Option value="jack">局/处/项目部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="title" >资产状态：</span>
            <Select className="btn" showSearch placeholder="请选择" defaultValue={Assetstates} value={this.state.status} onChange={this.statusChange.bind(this)}>
              {Assetstates.map(Assetstates => (
                <Select.Option key={Assetstates.key}>{Assetstates.name}</Select.Option>
              ))}

            </Select>
          </div>
          <div className="search_item">
            <span className="title" >预计退场时间：</span>
            <DatePicker className="btn" onChange={this.exitTimeChange.bind(this)} />
          </div>
          <div className="search_item">
            <span className="title" >资产分类：</span>
            <Select className="btn" showSearch defaultValue={tabsData} placeholder="请选择" value={this.state.type} onChange={this.typeChange.bind(this)}>
              {
                tabsData.map((type) => (
                  <Select.Option key={type.key}>{type.name}</Select.Option>
                ))
              }
            </Select>
          </div>
          <div className="search_item">
            <span className="title" >购入时间：</span>
            <DatePicker className="btn" onChange={this.buyTimeChange.bind(this)} />
          </div>
          <div className="search_item">
            <span className="title" >分类：</span>
            <Select className="btn" showSearch placeholder="请选择" value={this.state.classify} onChange={this.classifyChange.bind(this)}>
              <Option value="全部">全部</Option>
            </Select>
          </div>
        </Search>
        <div className="table">
          <Tabs onChange={this.callback.bind(this)} activeKey={this.state.type}>
            {
              tabsData.map((item, index) => {
                return (
                  <TabPane tab={item.name} key={item.key}>
                    <Table
                      dataSource={this.state.dataSource}
                      columns={this.state.columns}
                      scroll={{ x: 1950 }}
                      pagination={{
                        position: ["bottomCenter"],
                        size: "small",
                        showSizeChanger: true,
                        showQuickJumper: true
                      }}
                    />
                  </TabPane>
                )
              })
            }
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}
export default withRouter(connect(mapStateToProps)(Circle))