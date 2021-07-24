import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import '../../style/list.css';
import '../../style/index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';
import Status from '@/twbureau/components/status';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
class equipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            belongingCompany: undefined,
            status: "",
            exitTime: "",
            category: undefined,
            buyTime: "",
            manageNumber: "",
            identifierNum: "",
            dataSource: [],
            columns: [
                {
                    title: '编号',
                    dataIndex: 'identifierNum',
                    key: 'identifierNum'
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
                    render: (value, row, index) => {
                        if (value == '1') {
                            return '在用'
                        } else if (value == '2') {
                            return '闲置'
                        } else if (value == '3') {
                            return '可周转'
                        } else if (value == '4') {
                            return '周转中'
                        } else if (value == '5') {
                            return '已周转'
                        } else if (value == '6') {
                            return '可处置'
                        } else if (value == '7') {
                            return '处置中'
                        } else if (value == '8') {
                            return '已处置'
                        } else if (value == '9') {
                            return '可租赁'
                        } else if (value == '10') {
                            return '已租赁'
                        } else if (value == '11') {
                            return '报废'
                        } else if (value == '12') {
                            return '报损'
                        } else {
                            return ''
                        }
                    }
                },
                {
                    title: '原值',
                    dataIndex: 'originalValue',
                    key: 'originalValue',
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
                    title: '管理号码',
                    dataIndex: 'manageNumber',
                    key: 'manageNumber',
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 200,
                    render: (text, record, index) => <div>
                        <a className="edit" onClick={() => this.inquire(text, record, index)}>查询</a>
                        <a className="edit">修改</a>
                        <a className="edit" onClick={() => this.changeStatus(text)}>更新状态</a>
                    </div>,
                }
            ],
            showStatus: false,
            statusObj:"",
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
        obj['name'] = this.state.name
        obj['belongingCompany'] = this.state.belongingCompany
        obj['status'] = this.state.status;
        obj['exitTime'] = this.state.exitTime
        obj['category'] = this.state.category;
        obj['buyTime'] = this.state.buyTime;
        obj['manageNumber'] = this.state.manageNumber;
        obj['identifierNum'] = this.state.identifierNum;
        obj['page'] = '1';
        obj['rows'] = '10';
        this.setState({
            obj: obj
        }, () => {
            this.getUserInfo();
        });

    }
    // 查询 
    inquire(text, record, index) {
        // console.log(text)
        this.props.history.push('/tw/equipment/detail/' + text.id)
    }
    // 获取列表数据
    getUserInfo = () => {
        api.ajax("get", "http://10.10.9.175:9999/materialEquipmentController/page", this.state.obj).then(r => {
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
    inputChange(type,e) {
        // console.log(type,e.target.value);
        if (type == 'name') {
            // 资产名称
            this.setState({
                name: e.target.value
            })
        } else if (type == 'manage') {
            // 管理号码
            this.setState({
                manageNumber: e.target.value
            })
        } else {
            // 编号
            this.setState({
                identifierNum: e.target.value
            })
        }
    }
    selectChange(value, type) {
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
        } else {
            // 进场类别
            this.setState({
                category: value
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
    changeStatus (e){
        console.log(e.id);
        this.state.statusObj = {}
        this.state.process=[]
        var status = {}
        var process1=[]
        var that=this
        status['name'] = e.name;// 资产名称
        status['type'] = e.type; // 资产类别
        status['standards'] = e.standards; // 规格型号
        status['department'] = e.department; // 资产管理部门
        status['befoeupdateStatus'] = e.status; // 更新前资产状态
        status['afterupdateStatus'] = e.afterupdateStatus; // 更新后资产状态
        status['number1'] = e.number; //数量
        status['unit1'] = e.unit; //单位
        status['updateType'] = e.updateType == '0' ? 'all' : 'part'; // all-全部更新；part-部分更新
        status['restStatus'] = e.updateRemainderStatus;//剩余物资状态
        status['number2'] = e.updateAfterNumber; //数量 
        status['unit2'] = e.unit; //单位
        status['remark'] = e.remark; // 备注
        that.setState({
            statusObj: status,
            showStatus: true,
        });
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
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search.bind(this)}>
                    <div className="search_item">
                        <span className="head">资产名称：</span>
                        <Input className="btn" placeholder="请输入资产名称" value={this.state.name} onChange={this.inputChange.bind(this,'name')} />
                    </div>
                    <div className="search_item">
                        <span className="head">所属工程公司/项目部：</span>
                        <Select className="btn" showSearch placeholder="请选择" value={this.state.belongingCompany} onChange={this.selectChange.bind(this, 'belong')}>
                            <Option value="jack">局/处/项目部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">资产状态：</span>
                        <Select className="btn" showSearch defaultValue={tabsData} placeholder="请选择" value={this.state.status} onChange={this.selectChange.bind(this, "status")}>
                            {
                                tabsData.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">预计退场时间：</span>
                        <DatePicker className="btn" onChange={this.timeChange.bind(this, "exit")} />
                    </div>
                    <div className="search_item">
                        <span className="head">进场类别：</span>
                        <Select className="btn" showSearch defaultValue={categoryArr} placeholder="请选择" value={this.state.category} onChange={this.selectChange.bind(this, "category")}>
                            {
                                categoryArr.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">购入时间：</span>
                        <DatePicker className="btn" onChange={this.timeChange.bind(this, "buy")} />
                    </div>
                    <div className="search_item">
                        <span className="head">管理号码：</span>
                        <Input className="btn" placeholder="请输入管理号码" value={this.state.manageNumber} onChange={this.inputChange.bind(this,'manage')} />
                    </div>
                    <div className="search_item">
                        <span className="head">编号：</span>
                        <Input className="btn" placeholder="请输入编号" value={this.state.identifierNum} onChange={this.inputChange.bind(this,"Num")} />
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
                <Status visible={this.state.showStatus} step="update" status={this.state.statusObj} history={this.props.history}/>
            </div>
        )
    }
}
// function callback(key) {
//   console.log(key);
// }
export default equipment