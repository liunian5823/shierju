import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import '../../style/list.css';
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
class applyFor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            dataSource: [
                {
                    code: "213243235",
                    type: "1",
                    name: "jiwjieiwo",
                    standards: "m-8912",
                    number: 10,
                    unit: "个",
                    beforeStatus: "",
                    backStatus: "",
                    belongingCompany: "",
                    department: "dfs",
                    documentStatus: "",
                    auditor: "",
                    submit:"",
                },
                {
                    code: "46484641",
                    type: "2",
                    name: "sefea",
                    standards: "m-4812",
                    number: 10,
                    unit: "个",
                    status: "1",
                    beforeStatus: "",
                    backStatus: "",
                    belongingCompany: "",
                    department: "dfs",
                    documentStatus: "",
                    auditor: "",
                    submit:"0",
                },
            ],
            columns: [
                {
                    title: '单据编号',
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
                    dataIndex: 'beforeStatus',
                    key: 'beforeStatus',
                },
                {
                    title: '更新后资产状态',
                    dataIndex: 'backStatus',
                    key: 'backStatus',
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
                    dataIndex: 'documentStatus',
                    key: 'documentStatus',
                },
                {
                    title: '审核人员',
                    dataIndex: 'auditor',
                    key: 'auditor',
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 200,
                    render: () => <div>
                        <a className="edit">重新提交</a>
                        <a className="edit">作废</a>
                        <a className="edit">查看</a>
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
    handleClick() {
        console.log('456')
    }

    render() {
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
                        <span className="title" >更新前资产状态：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value="jack">全部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >更新后资产状态：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value="jack">全部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >资产分类：</span>
                        <Select className="btn" showSearch placeholder="请选择">
                            <Option value="jack">全部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="title" >单据编号：</span>
                        <Input className="btn" placeholder="请输入" />
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
            </div>
        )
    }
}
// function callback(key) {
//   console.log(key);
// }
export default applyFor