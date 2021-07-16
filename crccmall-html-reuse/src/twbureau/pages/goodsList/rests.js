import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import '../../style/list.css';
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
class Rests extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            dataSource: [
                {
                    code: "213243235",
                    type:"1",
                    name:"jiwjieiwo",
                    standards:"m-8912",
                    number:10,
                    unit:"个",
                    status:"2",
                    originalValue:"1,021.234",
                    belongingCompany:"jiwoj",
                    department:"xiiang",
                    buyTime:"2021-02-09",
                    exitTim:"2021-07-12",
                    phone:"13245614561"
                },
                {
                    code: "46484641",
                    type:"2",
                    name:"sefea",
                    standards:"m-4812",
                    number:10,
                    unit:"个",
                    status:"1",
                    originalValue:"1,021.234",
                    belongingCompany:"jiwoj",
                    department:"xiiang",
                    buyTime:"2021-02-09",
                    exitTim:"2021-07-12",
                    phone:"13245614561"
                },
            ],
            columns: [
                {
                    title: '编号',
                    dataIndex: 'code',
                    key: 'code'
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
                    key: 'name'
                },
                {
                    title: '工程类型',
                    dataIndex: 'projectTypeName',
                    key: 'projectTypeName',
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
                    title: '所属工程公司',
                    width: 250,
                    dataIndex: 'belongingCompany',
                    key: 'belongingCompany',
                },
                {
                    title: '资产管理部门',
                    dataIndex: 'department',
                    key: 'department',
                },
                {
                    title: '所在地',
                    dataIndex: 'address',
                    key: 'address',
                },
                {
                    title: '购入时间',
                    dataIndex: 'buyTime',
                    key: 'buyTime',
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 200,
                    render: () => <div>
                        <a className="edit">查询</a>
                        <a className="edit">修改</a>
                        <a className="edit">更新状态</a>
                    </div>,
                }
            ],
        };

    }

    componentWillMount() { }
    search() {

    }
    nameChange(e) {
        this.setState({
            name: e.target.value
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
            name: '全部'
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
            name: '已周转'
        }, {
            key: '6',
            name: '可处置'
        }, {
            key: '7',
            name: '处置中'
        }, {
            key: '8',
            name: '已处置'
        }, {
            key: '9',
            name: '可租赁'
        }, {
            key: '10',
            name: '已租赁'
        },  {
            key: '11',
            name: '报废'
        }, {
            key: '12',
            name: '报损'
        }]
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search}>
                    <div className="search_item">
                        <span className="title">资产名称：</span>
                        <Input className="btn" placeholder="请输入资产名称" value={this.state.name} onChange={this.nameChange.bind(this)} />
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
                        <span className="title" >进场类别：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value="jack">全部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >购入时间：</span>
                        <RangePicker className="btn" />
                    </div>
                    <div className="search_item">
                        <span className="title">类型：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value="jack">全部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >规格：</span>
                        <Input className="btn" placeholder="请输入" />
                    </div>
                    <div className="search_item">
                        <span className="title" >所在地：</span>
                        <Input className="btn" placeholder="请输入" />
                    </div>
                    <div className="search_item">
                        <span className="title">工程类型：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value="jack">全部</Option>
                        </Select>
                    </div>
                </Search>
                <div className="table">
                    <div className='table-btn'>
                        <div className='table-btn-left'>
                            <Button type="primary">+ 录入资产信息</Button>
                            <Button>导入台账信息</Button>
                            <Button>台账模板下载</Button>
                        </div>
                        <Button className='table-btn-right' type="primary">导出</Button>
                    </div>
                    <Tabs onChange={this.callback.bind(this)}>
                        {
                            tabsData.map((item, index) => {
                                return (

                                    <TabPane tab={item.name} key={item.key}    >
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
// function callback(key) {
//   console.log(key);
// }
export default Rests