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
            belongingCompany:undefined,
            status: "",
            exitTime:"",
            category: undefined,
            buyTime:"",
            standards:"",
            provinceName:undefined,
            cityName:undefined,
            countyName: undefined,
            materialType: undefined,
            projectType: undefined,
            dataSource: [],
            columns: [
                {
                    title: '编号',
                    dataIndex: 'documentNumber',
                    key: 'documentNumber'
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
                    dataIndex: 'projectName',
                    key: 'projectName'
                },
                {
                    title: '工程类型',
                    dataIndex: 'projectType',
                    key: 'projectType',
                    render: (value, row, index) => {
                        if (value == '1') {
                            return '铁路'
                        } else if (value == '2') {
                            return '公路'
                        } else if (value == '3') {
                            return '水利'
                        }  else if (value == '4') {
                            return '市政'
                        } else if (value == '5') {
                            return '电气化'
                        } else {
                            return '房建'
                        }
                    }
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
            obj:"",
        };

    }


    componentWillMount() {
        var obj = {};
        obj['status'] = this.state.status;
        obj['page'] = '1';
        obj['rows'] = '10';
        this.setState({
            obj: obj
        }, () => {
            this.getUserInfo();
        });
    }
    search() {
        // console.log(this.state)
        var obj = {};
        obj['projectName'] = this.state.name
        obj['belongingCompany'] = this.state.belongingCompany
        obj['status'] = this.state.status;
        obj['exitTime'] = this.state.exitTime
        obj['category'] = this.state.category;
        obj['buyTime'] = this.state.buyTime;
        obj['materialType'] = this.state.materialType;
        obj['standards'] = this.state.standards;
        obj['provinceName'] = this.state.provinceName;
        obj['cityName'] = this.state.cityName;
        obj['countyName'] = this.state.countyName;
        obj['projectType'] = this.state.projectType;
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
        api.ajax("get", "http://10.10.9.175:9999/materialOtherController/page", this.state.obj).then(r => {
            console.log(r.data.rows);
            for (var i = 1; i < r.data.rows.length + 1; i++) {
                var element = r.data.rows[i - 1]
                element['key'] = i
                element['address'] = element.provinceName + element.cityName + element.countyName
            }
            var dataSources = r.data.rows;
            this.setState({ dataSource: dataSources });
        }).catch(r => {
            console.log(r)
        })
    }
    inputChange(type,e) {
        console.log(type,e.target.value);
        if (type == 'name') {
            // 资产名称
            this.setState({
                name: e.target.value
            })
        } else {
            // 规格
            this.setState({
                status: e.target.value
            })
        }
    }
    selectChange(value, type) {
        console.log(value,type);
        if (type == 'belong') {
            // 所属工程公司/项目部：
            this.setState({
                belongingCompany: value
            })
        }else if (type == 'status') {
            // 资产状态
            this.setState({
                status: value
            })
        } else if (type == '进场类别') {
            // 进场类别
            this.setState({
                category: value
            })
        } else if (type == '类型') {
            // 类型
            this.setState({
                materialType: value
            })
        } else {
            // 工程类型
            this.setState({
                projectType: value
            })
        }
    }
    timeChange(type, data, dateString) {
        if (type == 'exit') {
            // 预计退场时间
            this.setState({
                exitTime: dateString
            })
        } else {
            // 购入时间 
            this.setState({
                buyTime: dateString
            })
        }
    }
    callback(key) {
        var obj = {};
        obj['page'] = '1';
        obj['rows'] = '10';
        obj['status'] = key;
        this.setState({
            status: key
        }, () => {
            console.log(this.state.status);
        })
        this.setState({
            obj: obj
        }, () => {
            console.log(obj);
            this.getUserInfo();
        });
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
        }, {
            key: '11',
            name: '报废'
        }, {
            key: '12',
            name: '报损'
        }]
        const categoryArr = [{
            key: ' ',
            name: '全部'
        }, {
            key: '1',
            name: '自购'
        }, {
            key: '2',
            name: '调入'
        }]
        const materialTypeArr = [{
            key: ' ',
            name: '全部'
        }, {
            key: '1',
            name: 'A'
        }, {
            key: '2',
            name: 'B'
        }, {
            key: '3',
            name: 'C'
        }]
        const projectTypeArr = [{
            key: ' ',
            name: '全部'
        }, {
            key: '1',
            name: '铁路'
        }, {
            key: '2',
            name: '公路'
        }, {
            key: '3',
            name: '水利'
        }, {
            key: '4',
            name: '市政'
        }, {
            key: '5',
            name: '电气化'
        }, {
            key: '6',
            name: '房建'
        }]
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search}>
                    <div className="search_item">
                        <span className="title">资产名称：</span>
                        <Input className="btn" placeholder="请输入资产名称" value={this.state.name} onChange={this.inputChange.bind(this,"name")} />
                    </div>
                    <div className="search_item">
                        <span className="title">所属工程公司/项目部：</span>
                        <Select className="btn" showSearch placeholder="请选择" value={this.state.belongingCompany} onChange={this.selectChange.bind(this, 'belong')}>
                            <Option value="jack">局/处/项目部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >资产状态：</span>
                        <Select className="btn" showSearch defaultValue={tabsData} placeholder="请选择" value={this.state.status} onChange={this.selectChange.bind(this, "status")}>
                            {
                                tabsData.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >预计退场时间：</span>
                        <DatePicker className="btn" onChange={this.timeChange.bind(this, "exit")} />
                    </div>
                    <div className="search_item">
                        <span className="title" >进场类别：</span>
                        <Select className="btn" showSearch defaultValue={categoryArr} placeholder="请选择" value={this.state.category} onChange={this.selectChange.bind(this, "进场类别")}>
                            {
                                categoryArr.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >购入时间：</span>
                        <DatePicker className="btn" onChange={this.timeChange.bind(this, "buy")} />
                    </div>
                    <div className="search_item">
                        <span className="title">类型：</span>
                        <Select className="btn" showSearch defaultValue={materialTypeArr} placeholder="请选择" value={this.state.materialType} onChange={this.selectChange.bind(this,'类型')}>
                            {
                                materialTypeArr.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >规格：</span>
                        <Input className="btn" placeholder="请输入"  value={this.state.standards} onChange={this.inputChange.bind(this,"规格")} />
                    </div>
                    <div className="search_item">
                        <span className="title" >所在地：</span>
                        <Select className="address" showSearch placeholder="省">
                            <Option value="jack">北京市1</Option>
                        </Select>
                        <Select className="address" showSearch placeholder="市">
                            <Option value="jack">北京市</Option>
                        </Select>
                        <Select className="address" showSearch placeholder="县">
                            <Option value="jack">海淀区</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title">工程类型：</span>
                        <Select className="btn" showSearch defaultValue={projectTypeArr} placeholder="请选择" value={this.state.projectType} onChange={this.selectChange.bind(this,'工程类型')}>
                            {
                                projectTypeArr.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
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