import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import '../../style/list.css';
import '../../style/index.css';
import { Input, Select, DatePicker, Tabs, Button, Table } from 'antd';
import httpsapi from '@/twbureau/api/api';

const TabPane = Tabs.TabPane;
class disposalList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            belongingCompany: "",
            status: undefined,
            dataSource: [
                {
                    key:"1",
                    type:"1",
                    name:"jfsioe",
                    standards:"m9022",
                    number:34,
                }
            ],columns: [
                {
                  title: '周转类别',
                  dataIndex: 'turnoverCategory',
                  key: 'turnoverCategory ',
                  render: (value, row, index) => {
                    if (value == '0') {
                      return '主材料/设备'
                    } else if (value == '12') {
                      return '辅料/配件'
                    }
                  }
                },
                // {
                //   title: '主材料/设备',
                //   children: []
                // },
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
                  key: 'name',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
                },
                {
                  title: '规格型号',
                  dataIndex: 'standards',
                  key: 'standards',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
                },
                {
                  title: '数量',
                  dataIndex: 'number',
                  key: 'number',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
                },
                {
                  title: '单位',
                  dataIndex: 'unit',
                  key: 'unit',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
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
                      return '—'
                    }
                  }
                },
                {
                  title: '周转次数',
                  dataIndex: 'turnoverTimes;',
                  key: 'turnoverTimes;',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
                },
                {
                  title: '辅料/配件名称',
                  dataIndex: 'ingredientsName;',
                  key: 'ingredientsName;',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
                },
                {
                  title: '辅料/配件子编号',
                  dataIndex: 'receiptNumber;',
                  key: 'receiptNumber;',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
                },
                {
                  title: '辅料/配件数量',
                  dataIndex: 'ingredientsNumber;',
                  key: 'ingredientsNumber;',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }
                  }
                },
                {
                  title: '辅料/配件单位',
                  dataIndex: 'ingredientsUnit;',
                  key: 'ingredientsUnit;',
                  render: (value, row, index) => {
                    if (value == null) {
                      return '—'
                    }else{
                      return value
                    }
                  }
                },
                {
                  title: '所属工程公司',
                  dataIndex: 'companyName',
                  key: 'companyName',
                },
                {
                  title: '资产管理部门',
                  dataIndex: 'departmentName',
                  key: 'departmentName',
                },
                {
                  title: '日期',
                  dataIndex: 'createTime;',
                  key: 'createTime;',
                },
                {
                  title: '操作',
                  key: 'operation',
                  fixed: 'right',
                  width: 200,
                  render: (text, record, index) => <div>
                    <a className="edit" onClick={() => this.inquire(text, record, index)}>查看</a>
                  </div>,
                }
              ],
            obj: "",
        };
    }

    
    componentWillMount() {
        var obj = {};
        obj['status'] = 6;
        obj['page'] = '1';
        obj['rows'] = '10';
        this.setState({
        obj: obj
        }, () => {
        this.getUserInfo();
        });
    } 
        // 资产名称
    handleChange(e) {
        this.setState({
            name: e.target.value
        })
    }
    // 所属工程公司
    belongChange(value) {
        this.setState({
            belongingCompany: value
        })
    }
    // 资产状态  
    statusChange(value) {
        console.log(value);
        this.setState({
            status: value
        })
    }
    search() {
      console.log(this.state)
      var obj = {};
      obj['name'] = this.state.name;
      obj['companyId'] = this.state.belongingCompany;
      obj['status'] =6;
      
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
      httpsapi.ajax("get", "/materialTurnoverApprovalController/turnoverMaterialsPage", this.state.obj).then(r => {
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
    // 查看
    inquire(text, record, index) {
      // console.log(text, record, index)
    }
    render() {
        const tabsData = [
            // {
            //   key: ' ',
            //   name: '全部'
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
        const Assetstates = [
            {
                key: ' ',
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
            },{
                key: '6',
                name: '可处置'
            },{
                key: '9',
                name: '可租赁'
            }, {
                key: '5',
                name: '已周转'
            },  {
                key: '8',
                name: '已处置'
            },  {
                key: '10',
                name: '已租赁'
            }, {
                key: '11',
                name: '报废'
            }]
        return (
            <div>
                <Breadcrumb location={this.props.match} />
                <Search search={this.search.bind(this)}>
                    <div className="search_item">
                        <span className="head">资产名称：</span>
                        <Input className="btn" placeholder="请输入资产名称" value={this.state.name} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="search_item">
                        <span className="head">工程公司/项目部：</span>
                        <Select className="btn" showSearch placeholder="请选择" value={this.state.belongingCompany} onChange={this.belongChange.bind(this)}>
                            <Option value="jack">局/处/项目部</Option>
                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">资产状态：</span>
                        <Select className="btn" showSearch placeholder="请选择" defaultValue={Assetstates} value={this.state.status} onChange={this.statusChange.bind(this)}>
                            {Assetstates.map(Assetstates => (
                                <Select.Option key={Assetstates.key}>{Assetstates.name}</Select.Option>
                            ))}

                        </Select>
                    </div>
                    <div className="search_item">
                        <span className="head">所属工程公司：</span>
                        <Select className="btn" showSearch placeholder="请选择" value={this.state.belongingCompany} onChange={this.belongChange.bind(this)}>
                            <Option value="jack">局/处/项目部</Option>
                        </Select>
                    </div>
                </Search>
                <div className="table">
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
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}
export default withRouter(connect(mapStateToProps)(disposalList))