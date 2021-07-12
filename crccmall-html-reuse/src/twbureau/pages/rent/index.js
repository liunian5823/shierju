import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import '../../style/list.css'
import  './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
class Rent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          1: 'UP1340124819024089',
          2: 'XXX项目部',
          3: 'XXX项目部',
          4: '周转材料',
          5: 'XX名称'
        },
        {
          1: 'UP1340124819024089',
          2: 'XXX项目部',
          3: 'XXX项目部',
          4: '周转材料',
          5: 'XX名称'
        },
        {
          1: '总计',
          4: '周转材料',
          5: 'XX名称'
        }
      ],
      columns: [
        {
          title: '单据编号',
          dataIndex: '1',
          key: '1',
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
          dataIndex: '2',
          key: '2',
        },
        {
          title: '承租方',
          dataIndex: '3',
          key: '3',
        },
        {
          title: '资产分类',
          dataIndex: '4',
          key: '4',
        },
        {
          title: '资产名称',
          dataIndex: '5',
          key: '5',
        }
      ]
    };
}
renderContent (value, row, index) {
  const obj = {
    children: value,
    props: {},
  };
  if (index === 4) {
    obj.props.colSpan = 0;
  }
  return obj;
};
componentWillMount() {}
render() {
    const tabsData = [{
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
          <Breadcrumb location={this.props.match}/>
          <Search>
          <div className="search_item">
              <span className="title">承租方：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">局/处/项目部</Option>
              </Select>
            </div>
            <div className="search_item">
              <span className="title">出租方：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">局/处/项目部</Option>
              </Select>
            </div>
            <div className="search_item">
              <span className="title" >资产分类：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">全部</Option>
              </Select>
            </div>
            <div className="search_item">
              <span className="title">单据编号：</span>
              <Input className="btn" placeholder="请输入" />
            </div>
            <div className="search_item">
              <span className="title" >资产名称：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">全部</Option>
              </Select>
            </div>
            <div className="search_item">
              <span className="title" >租赁周期：</span>
              <RangePicker className="btn"/>
            </div>
            <div className="search_item">
              <span className="title" >租赁到期：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="all">全部</Option>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
                <Option value="2">即将到期</Option>
              </Select>
            </div>
          </Search>
          <div className="table">
            <Tabs>
              {
                tabsData.map((item, index) => {
                  return (
                    <TabPane tab={item.name} key={item.key}>
                      <Table
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                        pagination={{
                          position: ["bottomCenter"],
                          size: "small",
                          showSizeChanger: true,
                          showQuickJumper: true}}
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
export default withRouter(connect(mapStateToProps)(Rent))