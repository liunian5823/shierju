import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import httpsapi from '@/twbureau/api/api';
import '../../style/list.css';
import '../../style/index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';
import Status from '@/twbureau/components/status';

class applyFor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "1",
            name: "",
            belongingCompany: undefined,
            beforeStatus: undefined,
            backStatus: undefined,
            type: undefined,
            identifierNum: "",
            dataSource: [],
            columns: [
                {
                    title: '单据编号',
                    dataIndex: 'receiptNumber',
                    key: 'receiptNumber',
                    width: 160
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
                    title: '更新前资产状态',
                    dataIndex: 'befoeupdateStatus',
                    key: 'befoeupdateStatus',
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
                    title: '更新后资产状态',
                    dataIndex: 'afterupdateStatus',
                    key: 'afterupdateStatus',
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
                    title: '单据状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (value, row, index) => {
                        if (value == "1") {
                            return "审核中"
                        } else if (value == "2") {
                            return "审核通过"
                        } else if (value == "3") {
                            return "审核拒绝"
                        }else if (value == "4") {
                            return "审核拒绝待提交"
                        }
                    }
                },
                {
                    title: '审核人员',
                    dataIndex: 'approver',
                    key: 'approver',
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width:185,
                    render: (value) => {
                        if (value.status == '1' || value.status == '4') {
                            return <div >
                                <a className="edit">重新提交</a>
                                <a className="edit">作废</a>
                                <a className="edit" onClick={() => this.changeStatus(value)}>查看</a>
                            </div>
                        } else {
                            return <div >
                                <a className="edit" onClick={() => this.changeStatus(value)}>查看</a>
                            </div>
                        }

                    },
                }
            ],
            showStatus: false,
            statusObj:"",
            process:[],
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
        obj['befoeupdateStatus'] = this.state.beforeStatus;
        obj['afterupdateStatus'] = this.state.backStatus
        obj['type'] = this.state.type;
        obj['receiptNumber'] = this.state.identifierNum;
        obj['status'] = this.state.status;
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
        httpsapi.ajax("get", "/inForApproval/page", this.state.obj).then(r => {
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

    inputChange(type, e) {
        // console.log(type,e.target.value);
        if (type == 'name') {
            // 资产名称
            this.setState({
                name: e.target.value
            })
        } else {
            // 编号
            this.setState({
                identifierNum: e.target.value
            })
        }
    }
    selectChange(type, value) {
        if (type == 'belong') {
            // 所属工程公司/项目部：
            this.setState({
                belongingCompany: value
            })
        } else if (type == '更新前') {
            // 更新前资产状态
            this.setState({
                beforeStatus: value
            })
        } else if (type == '更新后') {
            // 更新后资产状态
            this.setState({
                backStatus: value
            })
        } else {
            // 资产分类
            this.setState({
                type: value
            })
        }
    }
    handleClick() {
        console.log('456')
    }
    changeStatus (e){       
        this.state.statusObj = {}
        this.state.process=[]
        var status = {}
        var process1=[]
        var that=this
        httpsapi.ajax("get", "/inForApproval/get?id="+ e.id, {}).then(r => {
            status['prodottoId'] = r.data.prodottoId;// 产品id
            status['name'] = r.data.name;// 资产名称
            status['type'] = r.data.type; // 资产类别
            status['standards'] = r.data.standards; // 规格型号
            status['department'] = r.data.department; // 资产管理部门
            status['befoeupdateStatus'] = r.data.befoeupdateStatus; // 更新前资产状态
            status['afterupdateStatus'] = r.data.afterupdateStatus; // 更新后资产状态
            status['number1'] = r.data.number; //数量
            status['unit1'] = r.data.unit; //单位
            status['updateType'] = r.data.updateType =='0' ? 'all' : 'part'; // all-全部更新；part-部分更新
            status['restStatus'] = r.data.updateRemainderStatus;//剩余物资状态
            status['number2'] = r.data.updateAfterNumber; //数量 
            status['unit2'] = r.data.unit; //单位
            status['remark'] = r.data.remark; // 备注
            for (var i = 1; i < r.data.statusUpdateApprovals.length+ 1; i++) {
                var processObj = {}
                var element = r.data.statusUpdateApprovals[i - 1]
                processObj['head'] = element.department;
                processObj['name'] = element.approver;
                processObj['dateTime'] = element.createTime;
                processObj['status'] = element.sort == "0" ? "审核通过" : element.sort == "0" ? "审核拒绝" : "审核中"; // 0通过，1拒绝，2审核中
                processObj['statusKey'] = element.sort == "0" ? "agree" : element.sort == "0" ? "refuse" : "waitting"; // agree通过 refuse拒绝 waitting审核中
                processObj['explain'] = element.remark;
                process1.push(processObj)
                that.setState({
                    process:process1,
                });
            }
            that.setState({
                statusObj: status,
                showStatus: true,
            });
        }).catch(r => {
            console.log(r)
        })
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
        const tabsData2 = [{
            key: ' ',
            name: '全部'
        }, {
            key: '1',
            name: '周转材料'
        }, {
            key: '2',
            name: '施工设备'
        }, {
            key: '3',
            name: '其他'
        }]
        let process = [
            {
              head: '项目部XX部长',
              name: '张三三',
              dateTime: '2021.08.23 12:00:00',
              status: '审核通过',
              statusKey: 'agree', // agree通过 refuse拒绝 waitting审核中
              explain: '我是审批说明'
            },
            {
              head: '项目管理员',
              name: '李四小',
              dateTime: '2021.08.23 12:00:00',
              status: '审核中',
              statusKey: 'waitting', // agree通过 refuse拒绝 waitting审核中
              explain: '我是审批说明'
            },
            {
              head: '项目管理员',
              name: '李四',
              dateTime: '2021.08.23 12:00:00',
              status: '拒绝',
              statusKey: 'refuse', // agree通过 refuse拒绝 waitting审核中
              explain: '我是审批说明'
            } 
        ]
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search.bind(this)}>
                    <div className="search_item">
                        <span className="head">资产名称：</span>
                        <Input className="btn" placeholder="请输入资产名称" value={this.state.name} onChange={this.inputChange.bind(this, "name")} />
                    </div>
                    <div className="search_item">
                        <span className="head">所属工程公司/项目部：</span>
                        <Select className="btn" showSearch placeholder="请选择" value={this.state.belongingCompany} onChange={this.selectChange.bind(this, 'belong')}>
                            <Select.Option value="jack">局/处/项目部</Select.Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">更新前资产状态：</span>
                        <Select className="btn" showSearch defaultValue={tabsData} placeholder="请选择" value={this.state.beforeStatus} onChange={this.selectChange.bind(this, '更新前')}>
                            {
                                tabsData.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">更新后资产状态：</span>
                        <Select className="btn" showSearch defaultValue={tabsData} placeholder="请选择" value={this.state.backStatus} onChange={this.selectChange.bind(this, '更新后')}>
                            {
                                tabsData.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">资产分类：</span>
                        <Select className="btn" showSearch defaultValue={tabsData2} placeholder="请选择" value={this.state.type} onChange={this.selectChange.bind(this, '资产分类')}>
                            {
                                tabsData2.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">单据编号：</span>
                        <Input className="btn" placeholder="请输入" value={this.state.identifierNum} onChange={this.inputChange.bind(this, "num")} />
                    </div>
                </Search>
                <div className="table">
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
                </div>
                <Status visible={this.state.showStatus} step="look" status={this.state.statusObj} process={this.state.process} history={this.props.history}/>
            </div>
        )
    }
}
// function callback(key) {
//   console.log(key);
// }
export default applyFor