import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import '../../style/list.css';
import '../../style/index.css';
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table, Cascader } from 'antd';
import options from '../../util/address';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
class bidding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            belongingCompany: undefined,
            status: "",
            exitTime: "",
            approachType: undefined,
            buyTime: "",
            standards:"",
            materialType:undefined,
            provinceId: "",
            cityId: "",
            countyId: "",
            projectType:undefined,
            dataSource: [
                {
                    code:"23124324",
                    title:"sfefse",
                    saleDeptName:'西郊',
                }
            ],
            columns: [
                {
                    title: '竞价编号',
                    dataIndex: 'code',
                    key: 'code'
                },
                {
                    title: '公告名称',
                    dataIndex: 'title',
                    key: 'title',
                },
                {
                    title: '销售部门',
                    dataIndex: 'saleDeptName',
                    key: 'saleDeptName'
                },
                {
                    title: '报名数',
                    dataIndex: 'applyNumber',
                    key: 'applyNumber',
                },
                {
                    title: '状态',
                    dataIndex: 'standards',
                    key: 'standards',
                },
                {
                    title: '竞价方式',
                    dataIndex: 'bidWayName',
                    key: 'bidWayName',
                },
                {
                    title: '处置方式',
                    dataIndex: 'pricingMethodName',
                    key: 'pricingMethodName',
                },
                {
                    title: '发布时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                },
                {
                    title: '报名截止',
                    dataIndex: 'signEndTime',
                    key: 'signEndTime',
                },
                {
                    title: '竞价开始',
                    dataIndex: 'offerStartTime',
                    key: 'offerStartTime',
                },
                {
                    title: '竞价结束',
                    dataIndex: 'offerEndTime',
                    key: 'offerEndTime',
                },
                {
                    title: '完成时间',
                    dataIndex: 'finishTime',
                    key: 'finishTime',
                },
                {
                    title: '出价次数',
                    dataIndex: 'quotePeopleNumber',
                    key: 'quotePeopleNumber',
                },
                {
                    title: '出价人数',
                    dataIndex: 'quoteTimes',
                    key: 'quoteTimes',
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 200,
                    render: () => <div>
                        <a className="edit">查询</a>
                        <a className="edit">编辑</a>
                        <a className="edit">删除</a>
                        <a className="edit">复制</a>
                    </div>,
                }
            ],
            obj: "",
        };

    }
    componentWillMount(){}
    inputChange(type, e) {
        // console.log(type,e.target.value);
    }
    selectChange(type,value) {
        // console.log(value);
    }
    timeChange(type, data, dateString) {
        // console.log(dateString);
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
            name: '待发布'
        }, {
            key: '2',
            name: '报名中'
        }, {
            key: '3',
            name: '待竞价(保证金)'
        }, {
            key: '4',
            name: '竞价中'
        }, {
            key: '5',
            name: '待开标'
        }, {
            key: '6',
            name: '开标审批'
        }, {
            key: '7',
            name: '已完成'
        }, {
            key: '8',
            name: '失效作废'
        }]
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search.bind(this)}>
                    <div className="search_item">
                        <span className="head">项目部：</span>
                        <Select className="btn" showSearch placeholder="请选择项目部">
                            <Option value="jack">项目部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">名称/单号：</span>
                        <Input className="btn" placeholder="请输入名称或单号"/>
                    </div>
                    <div className="search_item">
                        <span className="head">发布日期：</span>
                        <RangePicker className="btn"/>
                    </div>
                    <div className="search_item">
                        <span className="head">竞价开始时间：</span>
                        <RangePicker className="btn"/>
                    </div>
                    <div className="search_item">
                        <span className="head">报名截止时间：</span>
                        <RangePicker className="btn"/>
                    </div>
                    <div className="search_item">
                        <span className="head">竞价结束时间：</span>
                        <RangePicker className="btn"/>
                    </div>
                    <div className="search_item">
                        <span className="head">下单日期：</span>
                        <RangePicker className="btn"/>
                    </div>
                    <div className="search_item">
                        <span className="head">竞价方式：</span>
                        <Select className="btn" showSearch placeholder="请选择竞价方式">
                            <Option value=" ">全部</Option>
                            <Option value="1">邀请竞价</Option>
                            <Option value="2">公开竞价</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">竞价状态：</span>
                        <Select className="btn" showSearch placeholder="请选择竞价状态">
                            <Option value="1">竞价状态</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">处置方式：</span>
                        <Select className="btn" showSearch placeholder="请选择竞价方式">
                            <Option value=" ">全部</Option>
                            <Option value="1">按批次计价</Option>
                            <Option value="2">按重量计价</Option>
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
                                            scroll={{ x: 2000 }}
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
                    <div className="export">
                        <Button type="primary">导出</Button>
                        <Button >发布竞价单</Button>
                    </div>
                </div>
            </div>
        )
    }
}
export default bidding