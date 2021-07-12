import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import '../../style/list.css'
import  './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
class GoodsList extends React.Component {
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
              title: '资产分类',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '资产名称',
              dataIndex: 'age',
              key: 'age',
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
              width: 100,
              render: () => <a>查询</a>,
            }
          ]
        };
    }

    componentWillMount() {}
    render() {
        const tabsData = [{
          key: 'all', 
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
                  <div className="number">23132</div>
                  <div className="title">已租赁</div>
                </div>
              </div>
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
                <Button className="export" type="primary">导出</Button>
              </div>
            </div>
        )
    }
}

export default GoodsList