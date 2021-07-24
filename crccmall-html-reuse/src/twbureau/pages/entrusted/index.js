import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import '../../style/list.css';
import '../../style/index.css';
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
class entrusted extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
                {
                    code:"23124324",
                    deptName:'西郊',
                }
            ],
            columns: [
                {
                    title: '委托需求编号',
                    dataIndex: 'code',
                    key: 'code'
                },
                {
                    title: '委托部门',
                    dataIndex: 'deptName',
                    key: 'deptName'
                },
                {
                    title: '委托标题',
                    dataIndex: 'title',
                    key: 'title',
                },
                {
                    title: '委托工单状态',
                    dataIndex: 'standards',
                    key: 'standards',
                },
                {
                    title: '递交时间',
                    dataIndex: 'time',
                    key: 'time',
                },
                {
                    title: '受理人',
                    dataIndex: 'acceptance',
                    key: 'acceptance',
                },
                {
                    title: '受理时间',
                    dataIndex: 'acceptanceTime',
                    key: 'acceptanceTime',
                },
                {
                    title: '委托人',
                    dataIndex: 'entrusted',
                    key: 'entrusted',
                },
                {
                    title: '看货对接',
                    dataIndex: 'look',
                    key: 'look',
                },
                {
                    title: '完成/关闭时间',
                    dataIndex: 'finishTime',
                    key: 'finishTime',
                },
                {
                    title: '处理结果',
                    dataIndex: 'result',
                    key: 'result',
                }
            ],
            obj: "",
        };

    }
    componentWillMount(){}
    selectChange(type,value) {
        // console.log(value);
    }
    callback(key) {
    }
    search(){}
    render(){        
        const tabsData = [{
            key: ' ',
            name: '全部'
        }, {
            key: '1',
            name: '待受理'
        }, {
            key: '2',
            name: '受理中'
        }, {
            key: '3',
            name: '已完成'
        }, {
            key: '4',
            name: '已关闭'
        }]
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search.bind(this)}>
                    <div className="search_item">
                        <span className="head">单据状态：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value="1">1</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">资产分类：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value=" ">全部</Option>
                            <Option value="1">周转材料</Option>
                            <Option value="2">施工设备</Option>
                            <Option value="3">其他循环物资</Option>
                        </Select>
                    </div>
                </Search>
                <div className="table biddingTab">
                    <Tabs onChange={this.callback.bind(this)}>
                        {
                            tabsData.map((item, index) => {
                                return (
                                    <TabPane tab={item.name} key={item.key}    >
                                        <Table
                                            dataSource={this.state.dataSource}
                                            columns={this.state.columns}
                                            scroll={{ x: 1400 }}
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
                    <Button className="export" type="primary">新建委托需求</Button>
                </div>
            </div>
        )
    }
}
export default entrusted