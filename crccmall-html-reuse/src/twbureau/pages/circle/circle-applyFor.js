import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import '../../style/list.css';
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
class circle_applyFor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey:"1",
            name: "",
            companyId: undefined,
            type: "1",
            toDepartmentId: undefined,
            docNumber: "",
            dataSource: [],
            columns: [
                {
                    title: '单据编号',
                    dataIndex: 'turnoverNumber',
                    key: 'turnoverNumber',
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
                        } else if (value == '3') {
                            return '其他循环物资'
                        } else {
                            return ''
                        }
                    }
                },
                // {
                //     title: '资产名称',
                //     dataIndex: 'assetName',
                //     key: 'assetName'
                // },
                // {
                //     title: '规格型号',
                //     dataIndex: 'specification',
                //     key: 'specification',
                // },
                // {
                //     title: '申请调入数量',
                //     dataIndex: 'appliedNumber',
                //     key: 'appliedNumber',
                // },
                {
                    title: '调出工程公司',
                    dataIndex: 'upCompany',
                    key: 'upCompany',
                },
                {
                    title: '周出项目部',
                    dataIndex: 'upDepartment',
                    key: 'upDepartment',
                },
                {
                    title: '调入工程公司',
                    dataIndex: 'toCompany',
                    key: 'toCompany',
                },
                {
                    title: '调入项目部',
                    dataIndex: 'toDepartment',
                    key: 'toDepartment',
                },
                {
                    title: '提交时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                },
                {
                    title: '审核状态',
                    dataIndex: 'approvaStatus',
                    key: 'approvaStatus',
                    render: (value, row, index) => {
                        if (value == "1") {
                            return "审核中"
                        } else if (value == "2") {
                            return "审核通过"
                        } else {
                            return "审核拒绝"
                        }
                    }
                },
                {
                    title: '审核人员',
                    dataIndex: 'approvalUserName',
                    key: 'approvalUserName',
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 185,
                    render: (text, record, index) => {
                        if (text.approvaStatus == '3') {
                            return <div >
                                <a className="edit">重新提交</a>
                                <a className="edit">作废</a>
                                <a className="edit" onClick={() => this.inquire(text, record, index)}>查看</a>
                            </div>
                        } else {
                            return <div >
                                <a className="edit" onClick={() => this.inquire(text, record, index)}>查看</a>
                            </div>
                        }

                    },
                }
            ],
            obj: "",
        };

    }

    componentWillMount() {
        var obj = {};
        obj['pageFlag'] = '1';
        obj['type'] = this.state.type;
        obj['page'] = '1';
        obj['rows'] = '10';
        this.setState({
            obj: obj
        }, () => {
            this.getUserInfo();
        });
    }
    callback(key) {
      var obj = {};
      obj['pageFlag'] = '1';
      obj['page'] = '1';
      obj['rows'] = '10';
      obj['type'] = key;
      this.setState({
        obj: obj,
        activeKey:key
      }, () => {
        console.log(obj);
        this.getUserInfo();
      });
    }
    search() {
        this.setState({
          activeKey:this.state.type
        })
        // console.log(this.state)
        var obj = {};
        obj['name'] = this.state.name
        obj['companyId'] = this.state.companyId
        obj['type'] = this.state.type;
        obj['toDepartmentId'] = this.state.toDepartmentId;
        obj['docNumber'] = this.state.docNumber;
        obj['pageFlag'] = '1';
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
        api.ajax("get", "http://10.10.9.66:9999/materialTurnoverApprovalController/turnoverApplyforPage", this.state.obj).then(r => {
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
    // 查看
    inquire(text, record, index) {
      // console.log(text, record, index)
     this.props.history.push('/tw/circle/detail/' + text.id )
    }

    inputChange(type, e) {
        // console.log(type,e.target.value);
        if (type == 'name') {
            // 资产名称
            this.setState({
                name: e.target.value
            })
        } else {
            // 单据编号
            this.setState({
                docNumber: e.target.value
            })
        }
    }
    selectChange(type, value) {
        if (type == 'company') {
            // 所属工程公司/项目部：
            this.setState({
                companyId: value
            })
        } else if (type == '资产分类') {
            // 资产分类
            this.setState({
                type: value
            })
        } else {
            // 周转部门
            this.setState({
                toDepartmentId: value
            })
        }
    }
    handleClick() {
        console.log('456')
    }

    render() {
        const tabsData = [
            // {
            //     key: ' ',
            //     name: '全部'
            // },
            {
                key: '1',
                name: '周转材料'
            },
            {
                key: '2',
                name: '施工设备'
            },
            {
                key: '3',
                name: '其他循环物资'
            }
        ]
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search.bind(this)}>
                    {/* <div className="search_item">
                        <span className="head">资产名称：</span>
                        <Input className="btn" placeholder="请输入资产名称" value={this.state.name} onChange={this.inputChange.bind(this, "name")} />
                    </div> */}
                    <div className="search_item">
                        <span className="head">所属工程公司/项目部：</span>
                        <Select className="btn" showSearch placeholder="请选择" value={this.state.companyId} onChange={this.selectChange.bind(this, 'company')}>
                            <Select.Option value="jack">局/处/项目部</Select.Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">资产分类：</span>
                        <Select className="btn" showSearch defaultValue={tabsData} placeholder="请选择" value={this.state.type} onChange={this.selectChange.bind(this, '资产分类')}>
                            {
                                tabsData.map((item) => (
                                    <Select.Option key={item.key}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">周转部门：</span>
                        <Select className="btn" showSearch placeholder="请选择" value={this.state.toDepartmentId} onChange={this.selectChange.bind(this, '周转部门')}>
                            <Select.Option value="jack">局/处/项目部</Select.Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">单据编号：</span>
                        <Input className="btn" placeholder="请输入" value={this.state.docNumber} onChange={this.inputChange.bind(this, "num")} />
                    </div>
                </Search>
                <div className="table">
                    <Tabs onChange={this.callback.bind(this)} activeKey={this.state.activeKey}>
                        {
                            tabsData.map((item, index) => {
                                return (
                                    <TabPane tab={item.name} key={item.key}>
                                        <Table
                                            dataSource={this.state.dataSource}
                                            columns={this.state.columns}
                                            scroll={{ x: 1500 }}
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
export default circle_applyFor