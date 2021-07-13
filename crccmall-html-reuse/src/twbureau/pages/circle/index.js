import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import '../../style/list.css'
import  './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          key: '1',
          name: '周转材料',
          age: 'sjdsj',
          address: '西湖dfadjak区湖底公园1号',
          guige: 'aaa'
        },
        {
          key: '2',
          name: '周转材料2',
          age: "jasdjdfkak",
          address: 'dfafdafdafd',
          guige: 'ddd'
        },
      ],
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
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '资产名称',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: '规格',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '数量',
          dataIndex: 'guige',
          key: 'guige',
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
      ]
    };
}

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
              <span className="title">资产名称：</span>
              <Input className="btn" placeholder="请输入资产名称" />
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
              <DatePicker className="btn"/>
            </div>
            <div className="search_item">
              <span className="title" >资产分类：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">全部</Option>
              </Select>
            </div>
            <div className="search_item">
              <span className="title" >购入时间：</span>
              <DatePicker className="btn"/>
            </div>
            <div className="search_item">
              <span className="title" >分类：</span>
              <Select className="btn" showSearch placeholder="请选择">
                <Option value="jack">全部</Option>
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
export default withRouter(connect(mapStateToProps)(Circle))