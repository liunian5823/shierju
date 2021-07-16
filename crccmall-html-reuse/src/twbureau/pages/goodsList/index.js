import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
class GoodsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      mames: "",
      status: "",
      dataSource: [],
      columns: [
        {
          title: '资产分类',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '资产名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '规格',
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
          title: '原值',
          dataIndex: 'originalValue',
          key: 'originalValue',
        },
        {
          title: '进场类别',
          dataIndex: 'approachType',
          key: 'approachType',
        },
        {
          title: '所属工程公司',
          dataIndex: 'belongingCompany',
          key: 'belongingCompany',
        },
        {
          title: '资产管理部门',
          dataIndex: 'department',
          key: 'department',
        },
        {
          title: '购入时间',
          dataIndex: 'buyTime',
          key: 'buyTime',
        },
        {
          title: '预计退场时间',
          dataIndex: 'exitTim',
          key: 'exitTim',
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 100,
          render: () => <a>查询</a>,
        }
      ]
    };

  }

  componentWillMount() {
    this.getUserInfo()
  }
  search(){
    
  }
  handleChange(e){
    this.setState({
        value : e.target.value
    })
}
  getUserInfo = () => {
    api.ajax("get", "http://10.10.9.175:9999/materialController/page", {
      page: "1",
      rows: "10",
      status:this.state.status
    }).then(r => {


      for(var i = 1 ; i < r.data.rows.length + 1;i++){
        r.data.rows[i-1]['key'] = i
      }
      var dataSources = r.data.rows;
      this.setState({dataSource : dataSources });
    }).catch(r => {
      console.log(r)
    })
  }
  callback(key) {
    this.setState({
      status: key
    }, () => {
      this.getUserInfo();
    }
    );

  }
  handleClick() {
    console.log('456')
  }

  render() {
    const tabsData = [{
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
    }]
    return (
      <div>
        <Breadcrumb location={this.props.match} />
        <Search search={this.search}>
          <div className="search_item">
            <span className="title">资产名称：</span>
            <Input className="btn" placeholder="请输入资产名称" value={this.state.value} onChange={this.handleChange.bind(this)} />
          </div>
          <div className="search_item">
            <span className="title">所属工程公司/项目部：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="jack">局/处/项目部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="title" >资产状态：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="jack">全部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="title" >预计退场时间：</span>
            <DatePicker className="btn" />
          </div>
          <div className="search_item">
            <span className="title" >资产分类：</span>
            <Select className="btn" showSearch placeholder="请选择">
              <Option value="jack">全部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="title" >购入时间：</span>
            <DatePicker className="btn" />
          </div>
          <div className="search_item">
            <span className="title" >规格：</span>
            <Input className="btn" placeholder="请输入规格" />
          </div>
          <div className="search_item">
            <span className="title" >所在地：</span>
            <Select className="address" showSearch placeholder="省">
              <Option value="jack">北京市</Option>
            </Select>
            <Select className="address" showSearch placeholder="市">
              <Option value="jack">北京市</Option>
            </Select>
            <Select className="address" showSearch placeholder="县">
              <Option value="jack">海淀区</Option>
            </Select>
          </div>
        </Search>
        <div className="total">
          <div className="item">
            <div className="number">82312819</div>
            <div className="title">总资产数</div>
          </div>
          <div className="item">
            <div className="number">23132</div>
            <div className="title">在用</div>
          </div>
          <div className="item">
            <div className="number">341234</div>
            <div className="title">闲置</div>
          </div>
          <div className="item">
            <div className="number">23132</div>
            <div className="title">已周转</div>
          </div>
          <div className="item">
            <div className="number">23132</div>
            <div className="title">已处置</div>
          </div>
          <div className="item">
            <div className="number">{this.state.value}</div>
            <div className="title">已租赁</div>
          </div>
        </div>
        <div className="table">
          <Tabs onChange={this.callback.bind(this)}>
            {
              tabsData.map((item, index) => {
                return (

                  <TabPane tab={item.name} key={item.key}    >
                    <Table
                      dataSource={this.state.dataSource}
                      columns={this.state.columns}
                      scroll={{ x: 1300 }}
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
          <Button className="export" type="primary">导出</Button>
        </div>
      </div>
    )
  }
}
// function callback(key) {
//   console.log(key);
// }
export default GoodsList