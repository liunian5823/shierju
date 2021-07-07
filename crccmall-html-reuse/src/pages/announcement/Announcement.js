import React from 'react'
import { Rate, Switch, Radio, Popconfirm, message, Timeline, Select, Card, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs } from 'antd';
import { systemConfig, systemConfigPath } from '../../utils/config/systemConfig';
import { getDetailsLabel } from 'components/page/Details';
import { getQueryString, getUrlByParam } from '../../utils/urlUtils';
import api from '../../framework/axios'//请求接口的封装
import SearchBar from 'components/page/SearchBar';
import { tablePagination_, btnName_ } from "../../utils/config/componentDefine";
import moment from 'moment';
import { NumberFormat } from 'components/content/Format'
import './index.less'
import Util from '../../utils/util';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      sortType: ['', ''],
      tabsKey: 4, //tabs查询条件
      deplist: [],
      //loading
      loading: false,
      //作废
      blankOutModalvisible: false, //模态框开关
      blankOutUuids: null, //订单合同uuids
      page: 1,
      pageSize: 10,
      contractSignState: -1, //0待签章1采购商已签章2供应商已签章3双方都已签章
      contractState: -1, //0 已生效 1作废
      type: '',
      canalModal: false,
      repaymodal: false,
      //重新付款uuids
      uuids: '',
      canalInfo: {},
      id: '',
      cancalcodeTime: -1,
      repaycodeTime: -1,
      loginPerson: {},
      bottom:false,
      visible: false,
      queryDetails:{},
      modeData:[],
    };
  }

  componentWillMount() {
    this.refresh();
  }
 
  componentDidMount = () => {
    
  }

  componentWillUnmount = () => {
    this.setState({ switchShow: '' })
  }
 
  //发布平台
  newsType = (type) => {
    let tempStatus = '--';
    switch (type) {
      case 1:
        tempStatus = '网站公告';
        break;
      case 2:
        tempStatus = '新闻动态';
        break;
      case 7:
        tempStatus = '维护公告';
        break;
      case 8:
        tempStatus = '招募公告';
        break;
      case 9:
        tempStatus = '通报公告';
        break;
      default:
        break;
      }
      return tempStatus;
  }

 
  //排序方法
  handleSort = (pagination, filters, sorter) => {
    let dataSource = this.state.dataSource
    console.log(dataSource)
   
    dataSource.pageNum = pagination.current
    dataSource.pageSize = pagination.pageSize
    
    let sortName = sorter.columnKey;
    let sortType = sorter.order;
    let sort = this.state.sortType;
    sort[0] = sortName;
    sort[1] = sortType;
    this.setState({ 
      dataSource,
      sortType: sort ,
      page: pagination.current,
      pageSize: pagination.pageSize,
    },() => {
      this.handleSearch(pagination.current, pagination.pageSize);
    })
}
  
 

  refresh = () => {
    this.handleSearch(1, tablePagination_.defaultPageSize);
  };
  

  handleSearch = (page, pageSize) => {

    let params = this.props.form.getFieldsValue();
    if (params.times) {
      params.beginTime = params.times[0] ? moment(params.times[0]).format('YYYY-MM-DD 00:00:00') : '';
      params.endTime = params.times[1] ? moment(params.times[1]).format('YYYY-MM-DD 23:59:59') : '';
      params.times = undefined;
    }
   
    params.platform = 2;
    params.page = page;
    params.rows = pageSize;
    if (this.state.sortType[0]) {
      params[this.state.sortType[0]] = this.state.sortType[1] == 'ascend' ? '0' : '1';
    }
    axios
      .get(
        '@/message/ecNews/pageForNewsList',
        {
          params: params,
        },
      )
      .then((r) => {
        console.log(r)
        let dataSource = r
        dataSource.pageNum = page
        dataSource.pageSize = pageSize
        this.setState({
          dataSource: r.data
        });
      });
  };

  resetForm = () => {
    this.props.form.resetFields();
    this.handleSearch(1, tablePagination_.defaultPageSize);
  };
  

  handleToDetails = (record) => {
    let data = this.state.dataSource;
    let list = data.rows;
    for(let i = 0; i < list.length; i++){
      if(record.id == list[i].id){
        list[i].isRead = 1;
      }
    }

    this.setState({
      dataSource : data
    });

   
    api.ajax("GET", "@/message/ecNews/findNewsByuuids", {uuids:record.uuids}
    ).then((r) => {
        
    })
  }
 
  columns = () => {
    let result = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 70,
        render: (text, record, index) => {
            return index + 1;
        }
    },
      {
        title: '公告类型',
        dataIndex: 'newsType',
        key: 'newsTypeSort',
        sorter: true,
        width: 90,
        render:(text,record)=>{
        let statusStr = this.newsType(text);
        return <div >
                <p>{statusStr}</p>
          </div>
        
        }
      },
      {
        title: '发布时间',
        dataIndex: 'newsTime',
        key: 'newsTimeSort',
        sorter: true,
        width: 90,
        render: (text) => {
          return <div>
            <p>{moment(text).format("YYYY-MM-DD")}</p>
            <p>{moment(text).format("HH:mm:ss")}</p>
          </div>
        }
      },
      {
         title: '公告标题',
         dataIndex: 'title',
         key: 'titleSort',
         sorter: true,
         width: 160,
         render: (text, record) => {
          if (text.length < 20) {
            return <span>{text}</span>
          } else {
            return <span title={text}>{text.substring(0, 20)}...</span>
          }
        },
       }, 
      {
        title: '公告内容',
        dataIndex: 'content',
        key: 'contentSort',
        sorter: true,
        width:260,
        render: (text, record) => {
          text = text.replace(/<[^>]+>/g, "");
          if (text.length < 20) {
            return <span>{text}</span>
          } else {
            return <span>{text.substring(0, 20)}...</span>
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'isRead',
        key: 'isReadSort',
        width: 70,
        sorter: true,
        render: (text) => {
          if (1 == text) {
            return <span className="allready_read">已读</span>
          } else{
            return <span className="not_read">未读</span>
          }
        },
      }, {
        title: '操作',
        key: 'options',
        width: 70,
        render: (text, record) => {
          return(
            <div>
                <p><a href="javascript:void(0)" onClick={() => this.handleToDetails(record)}>查看</a></p>
            </div>
          )
    }
      }];
    return result;
  };
  
  
  
  //发布平台
  tempStaus = (status) => {
    if (!status && status!=0) {
        return;
      }
      let tempStatus = '';
      switch (status) {
        case 0:
          tempStatus = '铁建商城';
          break;
        case 3:
          tempStatus = '物资销售';
          break;
        case 4:
          tempStatus = '物资采购';
          break;
        case 6:
          tempStatus = '物资循环';
          break;
        case 9:
            tempStatus = '招标采购';
            break;
        default:
          break;
      }
      return tempStatus;
  }
  // onChange = (page, pageSize) => {
  //   this.handleSearch(page, pageSize);
  // };
  render() {
    const { getFieldProps } = this.props.form;
    const pagination = ComponentDefine.getPagination_(
      this.state.dataSource,
      this.onChange,
    );
    
    //let suIds = this.tempStaus(this.state.queryDetails.subId)
    return (
      <div className="orderContract">
        <Card className="card-margin-bottom">
          <SearchBar>
            <SearchBar.Param>
            <FormItem
                label={getDetailsLabel('公告类型')}
                {...ComponentDefine.form_.layout}
              >
                <Select
                  {...getFieldProps('newsType')}
                  placeholder="请选择公告类型"
                  style={{ width: '100%' }}
                >
                  <Option key={0}>全部</Option>
                  <Option key={1} value={1}>网站公告</Option>
                  <Option key={2} value={2}>新闻动态</Option>
                  <Option key={7} value={7}>维护公告</Option>
                  <Option key={8} value={8}>招募公告</Option>
                  <Option key={9} value={9}>通报公告</Option>
                </Select>
              </FormItem>
              <FormItem
                label={getDetailsLabel('公告标题')}
                {...ComponentDefine.form_.layout}
              >
                <Input
                  {...getFieldProps('title')}
                  placeholder="请输入公告标题"
                />
              </FormItem>
              <FormItem
                label={getDetailsLabel('公告内容')}
                {...ComponentDefine.form_.layout}
              >
                <Input
                  {...getFieldProps('content')}
                  placeholder="请输入公告内容"
                />
              </FormItem>
              <FormItem
                label={getDetailsLabel('发布时间')}
                {...ComponentDefine.form_.layout}
              >
                <RangePicker
                  {...getFieldProps(`times`)}
                  style={{ width: '100%' }}
                  format="yyyy/MM/dd"
                />
              </FormItem>
            </SearchBar.Param>
            <SearchBar.Btns>
              <Button
                type="primary"
                onClick={this.handleSearch.bind(this, 1, pagination.pageSize)}
              >
                {btnName_.search}
              </Button>
              <Button type="ghost" onClick={this.resetForm}>
                {btnName_.reset}
              </Button>
            </SearchBar.Btns>
          </SearchBar>
        </Card>
        <Card title="公告">
          <Tabs onChange={this.tabsChange}>
            <TabPane tab="全部" key={4}></TabPane>
          </Tabs>
          <Table
            columns={this.columns()}
            dataSource={this.state.dataSource.rows}
            pagination={pagination}
            onChange={this.handleSort}
            // scroll={{ x: 1100 }}
          />
        </Card>
      </div>
    );
  }
}

export default Form.create()(Announcement);