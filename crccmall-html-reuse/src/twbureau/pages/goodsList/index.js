import React from 'react';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import Search from '@/twbureau/components/search';
import api from '@/framework/axios';
import './index.css';
import { Input, Select, DatePicker, Tabs, Button, Table, Cascader } from 'antd';
import options from '../../util/address';

const TabPane = Tabs.TabPane;
const classification = [
  {
    key: ' ',
    name: '周转材料'
  }, {
    key: '1',
    name: '施工设备'
  }, {
    key: '2',
    name: '其他'
  },
]
class GoodsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      projectname: "",
      projectname1: "",
      datePicker: "",
      projectname2: "",
      datePicker1: "",
      specification: "",
      projectname3: "",
      projectname4: "",
      projectname5: "",
      mames: "",
      status: "",
      dataSource: [],
      columns: [
        {
          title: '资产分类',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '资产名称',
          dataIndex: 'name',
          key: 'name',
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
          title: '原值',
          dataIndex: 'originalValue',
          key: 'originalValue',
        },
        {
          title: '进场类别',
          dataIndex: 'approachType',
          key: 'approachType',
        },
        {
          title: '所属工程公司',
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
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 100,
          render: (text, record, index) => <a onClick={() => this.inquire(text, record, index)}>查询</a>,
        }
      ],
      statistics: {
        totalCount: '1'
      },
      obj: "",
    };

  }

  componentWillMount() {
    this.getUserInfo()
  }
  search() {
    console.log(this.state)
    var obj = {};
    obj['name'] = this.state.value;
    obj['standards'] = this.state.specification;
    obj['companyId'] = this.state.projectname;
    obj['status'] = this.state.projectname1;
    obj['exitTime'] = this.state.datePicker;
    obj['type'] = this.state.projectname2;
    obj['buyTime'] = this.state.datePicker1;
    obj['provinceId'] = this.state.projectname3;
    obj['cityId'] = this.state.projectname4;
    obj['countyId'] = this.state.projectname5;
    obj['page'] = '1';
    obj['rows'] = '10';
    this.setState({
      obj: obj
    }, () => {
      this.getUserInfo();
    });
  }
 
  getUserInfo = () => {
    api.ajax("get", "http://10.10.9.175:9999/materialController/page", this.state.obj).then(r => {


      for (var i = 1; i < r.data.rows.length + 1; i++) {
        r.data.rows[i - 1]['key'] = i
      }
      var dataSources = r.data.rows;
      this.setState({ dataSource: dataSources });
      this.huoqushuliang();
    }).catch(r => {
      console.log(r)
    })
  }
  huoqushuliang() {
    api.ajax("get", "http://10.10.9.175:9999/materialController/getstatusCount", this.state.obj).then(r => {
      console.log(r)
      var statisticss = r.data;
      this.setState({ statistics: statisticss });
    }).catch(r => {
      console.log(r)
    })
  }
  callback(key) {
    var obj = {};
    obj['status'] = key
    obj['page'] = '1';
    obj['rows'] = '10';
    console.log(key);
    this.setState({
      obj: obj
    }, () => {
      this.getUserInfo();
    });
  }
  projectname(key) {
    console.log(key)
    this.setState({
      projectname: key
    })
  }
  projectname1(key) {
    this.setState({
      projectname1: key
    })
  }
  datePicker(e) {
    var d = new Date(e);
    var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.setState({
      datePicker: datetime
    })
  }
  projectname2(key) {
    this.setState({
      projectname2: key
    })
  }
  datePicker1(e) {
    var d = new Date(e);
    var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.setState({
      datePicker1: datetime
    })

  }
  specification(e) {
    this.setState({
      specification: e.target.value
    })
  }
  daochu(){
    api.File("post", "@/materialRevolvingController/revolvingExport", {}).then(r => {
      console.log(r)
    
    }).catch(r => {
      console.log(r)
      // var a = r.headers["content-disposition"].split(
      //   "filename*=UTF-8''"
      // )[1];
      var title = decodeURIComponent('123');
      var url = window.URL.createObjectURL(new Blob([r.data]));
      var link = document.createElement("a");
      link.style.display = "none";
      link.href = url;

      link.setAttribute("download", title);
      document.body.appendChild(link);
      link.click();
    })
  }
  // projectname3(key) {
  //   this.setState({
  //     projectname3: key
  //   })
  // }
  // projectname4(key) {
  //   this.setState({
  //     projectname4: key
  //   })
  // }
  // projectname5(key) {
  //   this.setState({
  //     projectname5: key
  //   })
  // }
  onAddressChange = (value) => {
    this.setState({
      projectname3: value[0],
      projectname4: value[1],
      projectname5: value[2]
    })
  }
  inquire(text, record, index) {
    // console.log(text, record, index)
   this.props.history.push('/tw/goods/detail/' + text.id + '/' + text.type)

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
    return (
      <div>
        <Breadcrumb location={this.props.match} />
        <Search search={this.search.bind(this)}>
          <div className="search_item">
            <span className="head">资产名称：</span>
            <Input className="btn" placeholder="请输入资产名称" value={this.state.value} onChange={this.handleChange.bind(this)} />
          </div>
          <div className="search_item">
            <span className="head">所属工程公司/项目部：</span>
            <Select className="btn" showSearch placeholder="请选择" value={this.state.projectname} onChange={this.projectname.bind(this)}>
              <Option value="jack" >局/处/项目部</Option>
            </Select>
          </div>
          <div className="search_item">
            <span className="head" >资产状态：</span>
            <Select className="btn" defaultValue={tabsData} showSearch placeholder="请选择" value={this.state.projectname1} onChange={this.projectname1.bind(this)}>
              {tabsData.map(item => (
                <Option key={item.key}>{item.name}</Option>
              ))}

            </Select>
          </div>
          <div className="search_item">
            <span className="head" >预计退场时间：</span>
            <DatePicker className="btn" onChange={this.datePicker.bind(this)} />
          </div>
          <div className="search_item">
            <span className="head" >资产分类：</span>
            <Select className="btn" showSearch defaultValue={classification} placeholder="请选择" value={this.state.projectname2} onChange={this.projectname2.bind(this)}>
              {classification.map(Assetstates => (
                <Option key={Assetstates.key}>{Assetstates.name}</Option>
              ))}

            </Select>
          </div>
          <div className="search_item">
            <span className="head" >购入时间：</span>
            <DatePicker className="btn" value={this.state.datePicker1} onChange={this.datePicker1.bind(this)} />
          </div>
          <div className="search_item">
            <span className="head" >规格：</span>
            <Input className="btn" placeholder="请输入规格" value={this.state.specification} onChange={this.specification.bind(this)} />
          </div>
          <div className="search_item">
            <span className="head" >所在地：</span>
            {/* <Select className="address" showSearch placeholder="省" value={this.state.projectname3} onChange={this.projectname3.bind(this)}>
              <Option value="jack">北京市1</Option>
            </Select>
            <Select className="address" showSearch placeholder="市" value={this.state.projectname4} onChange={this.projectname4.bind(this)}>
              <Option value="jack">北京市</Option>
            </Select>
            <Select className="address" showSearch placeholder="县" value={this.state.projectname5} onChange={this.projectname5.bind(this)}>
              <Option value="jack">海淀区</Option>
            </Select> */}
            <Cascader className="btn" options={options} placeholder="请选择地区" onChange={this.onAddressChange} />
          </div>
        </Search>
        <div className="total">
          <div className="item">
            <div className="number">{this.state.statistics.totalCount}</div>
            <div className="head">总资产数</div>
          </div>
          <div className="item">
            <div className="number">{this.state.statistics.inuseCount}</div>
            <div className="head">在用</div>
          </div>
          <div className="item">
            <div className="number">{this.state.statistics.leaveUnusedCount}</div>
            <div className="head">闲置</div>
          </div>
          <div className="item">
            <div className="number">{this.state.statistics.haveTurnoverCount}</div>
            <div className="head">已周转</div>
          </div>
          <div className="item">
            <div className="number">{this.state.statistics.hasDisposalCount}</div>
            <div className="head">已处置</div>
          </div>
          <div className="item">
            <div className="number">{this.state.statistics.hasleaseCount}</div>
            <div className="head">已租赁</div>
          </div>
        </div>
        <div className="table goodsList">
          <Tabs onChange={this.callback.bind(this)}>
            {
              tabsData.map((item, index) => {
                return (

                  <TabPane tab={item.name} key={item.key}    >
                    <Table
                      dataSource={this.state.dataSource}
                      columns={this.state.columns}
                      scroll={{ x: 1300 }}
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
          <Button className="export" type="primary" onClick={this.daochu.bind(this)}>导出</Button>
        </div>
      </div>
    )
  }
}
// function callback(key) {
//   console.log(key);
// }
export default GoodsList