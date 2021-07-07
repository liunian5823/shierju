import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Card,
  Select,
  Tabs,
  Table,
  Divider,
  Tag,
  Pagination,
} from 'antd';
import { DatePicker } from 'antd';
const Option = Select.Option;
import StopReacson from './stopReacson';
import CusPopover from '../components/cusPopover/index.js';
import less from './index.less';
import Util from '@/utils/util';
import util from '../../../utils/util';
import { getQueryString, getUrlByParam } from '@/utils/urlUtils';
import { systemConfigPath } from '@/utils/config/systemConfig';

const { TabPane } = Tabs;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
class AdvancedSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colSpan: 18,
      colSearch: 6,
      expand: false,
      isBlock: 'none',
      //全部数据列表
      allDataList: [],
      total: 0,
      //搜索输入内容
      searchList: {},
      //部门列表
      organizationList: [],
      //竞价单分类列表
      goodsClassLevelOneList: [],
      //终止弹窗状态
      stopVisible: false,
      //当前列表数据
      curData: {},
      activeKey: '1', //默认选中全部tab卡
      nowActiveKey: '1',
      pageSize: 10, //导出用
      page: 1,
    };
  }
  componentWillMount() {
    this.getAllDataList({
      rows: this.state.pageSize,
      page: 1,
    });
    this.getGoodsClassLevelOneList();
    this.getOrganizationList();
  }
  //获取全部列表
  getAllDataList(options) {
    axios
      .post('@/platform/contend/page', options)
      .then((res) => {
        if (res.code == 200) {
          this.setState({
            allDataList: res.data.rows,
            total: res.data.total,
          });
        } else {
          Util.alert(res.msg, { type: 'error' });
        }
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  }
  //获取竞价单分类列表
  getGoodsClassLevelOneList = () => {
    axios
      .get('@/inquiry/management/getGoodsClassLevelOne', {
        params: {},
      })
      .then((r) => {
        if (r != null) {
          this.setState({
            goodsClassLevelOneList: r.data.rows,
          });
        }
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  };
  //获取项目部下拉数据
  getOrganizationList = () => {
    axios
      .get('@/platform/join/getOrg', {
        params: {},
      })
      .then((r) => {
        this.setState({
          organizationList: r.data,
        });
      })
      .catch((err) => {
        Util.alert(err.msg, { type: 'error' });
      });
  };
  toggle = () => {
    if (this.state.isBlock === 'none') {
      this.setState({
        isBlock: 'block',
        colSpan: 24,
        colSearch: 24,
      });
    } else {
      this.setState({
        isBlock: 'none',
        colSpan: 18,
        colSearch: 6,
      });
    }
    this.setState({
      expand: !this.state.expand,
    });
  };
  //切换tabs调用
  tabsChange = (key) => {
    let options = {};
    this.setState({
      activeKey: key,
      nowActiveKey: key,
    });
    if (key == 1) {
      options = {
        ...this.state.searchList,
        rows: this.state.pageSize,
        page: 1,
      };
    } else {
      options = {
        ...this.state.searchList,
        tabStatus: key,
        rows: this.state.pageSize,
        page: 1,
      };

      console.log('我要输出', this.state.activeKey);
      console.log('我要输出#########', key);
    }
    this.getAllDataList(options);
  };
  //切换页面调用
  pageChange = (page) => {
    let options = {
      ...this.state.searchList,
      rows: this.state.pageSize,
      page,
      tabStatus: this.state.activeKey,
    };
    this.setState({
      page: page,
    });
    this.getAllDataList(options);
  };
  //点击搜索调用
  handleSearch = (orderParams, type, e) => {
    console.log('ooo',this.state.tableOrder);
    let searchData = this.props.form.getFieldsValue();
    if (type == 'export') {
      return searchData;
    }
    if (!orderParams) {
      orderParams = this.state.tableOrder;
    }
    if (e != null) {
      e.preventDefault();
    }

    console.log('搜索条件', searchData);
    let tempOptions = Object.keys(searchData).filter((key) => {
      return (
        searchData[key] &&
        key !== 'bidDate' &&
        key !== 'publishDate' &&
        key != 'startDate'
      );
    });
    let options = {};

    let tableStatus = this.state.searchList.tabStatus;
    if (tableStatus) {
      options.tabStatus = tableStatus;
    }
    //排序
    if (orderParams != null) {
      options.orderKey = orderParams.field;
      options.order = orderParams.order;
      let sortValue = 1;
      if (options.order == 'ascend') {
        sortValue = 0;
      }
      if (options.orderKey == 'sn') {
        options.sortSn = sortValue;
      } else if (options.orderKey == 'name') {
        options.sortName = sortValue;
      } else if (options.orderKey == 'companyName') {
        options.companyNameSort = sortValue;
      } else if (options.orderKey == 'organizationName') {
        options.sortOrginazation = sortValue;
      } else if (options.orderKey == 'statusFlag') {
        options.sortStatus = sortValue;
      } else if (options.orderKey == 'userName') {
        options.sortUserName = sortValue;
      } else if (options.orderKey == 'publishDate') {
        options.publishDateSort = sortValue;
      } else if (options.orderKey == 'applyEndDate') {
        options.applyEndDateSort = sortValue;
      } else if (options.orderKey == 'startDate') {
        options.sortStartDate = sortValue;
      } else if (options.orderKey == 'endDate') {
        options.sortEndDate = sortValue;
      } else if (options.orderKey == 'completeTime') {
        options.completeTime = sortValue;
      }
    }

    if (searchData.complete) {
      options.completeStart = util.formatterTime(
        searchData.complete[0],
        'start',
      );
      options.completeEnd = util.formatterTime(searchData.complete[1], 'end');
    }
    if (searchData.publish) {
      options.publishStart = util.formatterTime(searchData.publish[0], 'start');
      options.publishEnd = util.formatterTime(searchData.publish[1], 'end');
    }
    if (searchData.apply) {
      options.applyStart = util.formatterTime(searchData.apply[0], 'start');
      options.applyEnd = util.formatterTime(searchData.apply[1], 'end');
    }
    if (searchData.startDate) {
      options.startDate = util.formatterTime(searchData.startDate[0], 'start');
      options.endDate = util.formatterTime(searchData.startDate[1], 'end');
    }
    if (searchData.endTime) {
      options.endStartTime = util.formatterTime(searchData.endTime[0], 'start');
      options.endEndDate = util.formatterTime(searchData.endTime[1], 'end');
    }

    tempOptions.forEach((key) => {
      options[key] = searchData[key];
    });
    console.log('status', options.status);
    if (type !== 'sort') {
      this.setState({ activeKey: '1' })
    }
    this.setState(
      {
        searchList: {
          ...options,
        },

        nowActiveKey: options.status,
        page: 1,
      },
      () => {
        options.rows = this.state.searchList.rows || 10;
        options.page = 1;
        // options.status= this.state.activeKey == '1' ? '' : this.state.activeKey
        this.getAllDataList(options);
      },
    );
  };
  handlePageSize = (current, pageSize) => {
    let options = {
      rows: pageSize,
      page: 1,
    };
    this.setState(
      {
        currentPage: 1,
        pageSize: pageSize,
      },
      () => {
        this.getAllDataList(options);
      },
    );
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  //点击场次终止调用
  stopChange = (record) => {
    this.setState({
      stopVisible: true,
      curData: record,
    });
  };
  //关闭弹窗
  closeModal() {
    this.setState({
      stopVisible: false,
    });
  }
  //跳转至详情页
  goDetail(uuids) {
    let param = {};
    param.uuids = uuids;
    param.goBackUrl = '/platInvoice/bidList';
    this.props.history.push('/bidDetail/' + uuids);
  }

  //导出竞价
  exprotBidding = (key) => {
    let options = {};
    let tableStatus = this.state.searchList.tabStatus;
    this.setState(
      {
        searchList: {
          ...options,
        },
      },
      () => {
        let searchtype = this.handleSearch('', 'export', '');
        console.log('导出时的参数', searchtype);
        for (const key in searchtype) {
          if (searchtype.hasOwnProperty(key)) {
            const element = searchtype[key];
            if (element !== undefined) {
              options[key] = element;
            }
          }
        }
        console.log('参数', options);
        // options.tabStatus = this.state.nowActiveKey;
        options.page = this.state.page;
        options.pageSize = this.state.pageSize;
        const url = getUrlByParam('/platform/contend/exportPage', options);
        console.log('url', url);
        location.href = systemConfigPath.axiosUrl(url);
      },
    );
  };

  //处理状态码
  stausToRes = (status) => {
    if (!status) {
      return;
    }
    let tempStatus = '';
    switch (status) {
      case 10:
        tempStatus = '待发布';
        break;
      case 19:
        tempStatus = ['审核中', '(驳回)'];
        break;
      case 20:
        tempStatus = '审核中';
        break;
      case 301:
        tempStatus = ['发布中', '(无需确认)'];
        break;
      case 302:
        tempStatus = ['发布中', '(待确认保证金)'];
        break;
      case 311:
        tempStatus = ['保证金', '(无需确认)'];
        break;
      case 312:
        tempStatus = ['保证金', '(待确认保证金)'];
        break;
      case 32:
        tempStatus = '竞价中';
        break;
      case 33:
        tempStatus = '待择标';
        break;
      case 331:
        tempStatus = '待择标';
        break;
      case 39:
        tempStatus = ['下单中', '(已驳回)'];
        break;
      case 40:
        tempStatus = ['下单中', '(审核中)'];
        break;
      case 50:
        tempStatus = '已完成';
        break;
      case 501:
        tempStatus = '已完成';
        break;
      case 502:
        tempStatus = '已完成';
        break;
      case 503:
        tempStatus = '已完成';
        break;
      case 51:
        tempStatus = ['已完成', '(流标)'];
        break;
      case 60:
        tempStatus = '失效/作废';
        break;

      case 602:
        tempStatus = '失效/作废';
        break;
      case 603:
        tempStatus = '失效/作废';
        break;
      default:
        break;
    }
    return tempStatus;
  };

  render() {
    const dateStyle = {
      textAlign: 'right',
      marginRight: '20px',
      width: '70px',
    };
    const dataSource = [
      {
        key: 1,
        sn: 'JJ89331111111111111',
        name:
          '竞价测试01竞价测试01竞价测试01竞价测试01竞价测试01竞价测试01竞价测试01竞价测试01部门部门部门部门部门部门',
        companyName:
          '采购用户有限公司采购用户有限公司采购用户有限公司采购用户有限公司采购用户有限公司采购用户有限公司部门部门部门',
        organizationName:
          '部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门部门',
        status: '保证金',
        userName: '测试',
        publishDate: '2020年02月02日12:12:12',
        applyEndDate: '2020年02月02日12:12:12',
        startDate: '2020年02月02日12:12:12',
        endDate: '2020年02月02日12:12:12',
        completeTime: '2020年02月02日12:12:12',
        applyCount: '2',
        quotationCount: '1',
        '14': '查看详情/终止',
      },
    ];

    const columns = [
      {
        title: '竞价单号',
        dataIndex: 'sn',
        key: 'sn',
        width: 155,
        defaultSortOrder: 'descend',
        sorter: true,
      },
      {
        title: '竞价公告名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        sorter: true,
        render: (text) => {
          if (!text) {
            return <CusPopover content="--"></CusPopover>;
          }
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '采购单位',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 150,
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text) => {
          if (!text) {
            return <CusPopover content="--"></CusPopover>;
          }
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '项目部',
        dataIndex: 'organizationName',
        key: 'organizationName',
        defaultSortOrder: 'descend',
        width: 150,
        sorter: true,
        render: (text) => {
          if (!text) {
            return <CusPopover content="--"></CusPopover>;
          }
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '状态',
        dataIndex: 'statusFlag',
        width: 120,
        key: 'statusFlag',
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          let statusStr = this.stausToRes(text);
          if (statusStr instanceof Array) {
            return (
              <div>
                <p style={{ color: '#FA9B13' }}>{statusStr[0]}</p>
                <p>{statusStr[1]}</p>
              </div>
            );
          }
          return <p style={{ color: '#FA9B13' }}>{statusStr}</p>;
        },
      },
      {
        title: '发布人',
        dataIndex: 'userName',
        key: 'userName',
        defaultSortOrder: 'descend',
        width: 90,
        sorter: true,
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          return (
            <div>
              <p>{text}</p>
              <p>{record.userNo}</p>
            </div>
          );
        }
        // render: () => {
        //   return (
        //     <div>
        //       <p>测试</p>
        //       <p>11121324324</p>
        //     </div>
        //   )
        // }
      },
      {
        title: '竞价发布日期',
        dataIndex: 'publishDate',
        key: 'publishDate',
        width: 120,
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text) => {
          if (!text) {
            return '--';
          }
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '报名截止日期',
        dataIndex: 'applyEndDate',
        key: 'applyEndDate',
        defaultSortOrder: 'descend',
        width: 120,
        sorter: true,
        render: (text) => {
          if (!text) {
            return '--';
          }
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '竞价开始日期',
        dataIndex: 'startDate',
        key: 'startDate',
        width: 120,
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text) => {
          if (!text) {
            return '--';
          }
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '竞价截止日期',
        dataIndex: 'endDate',
        key: 'endDate',
        width: 120,
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text) => {
          if (!text) {
            return '--';
          }
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '完成日期',
        dataIndex: 'completeTime',
        key: 'completeTime',
        width: 90,
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text) => {
          if (!text) {
            return '--';
          }
          let timeAry = text.split(' ');
          return (
            <div style={dateStyle}>
              <p>{timeAry[0]}</p>
              <p>{timeAry[1]}</p>
            </div>
          );
        },
      },
      {
        title: '已报名',
        dataIndex: 'applyCount',
        key: 'applyCount',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
          if (!a || !b) {
            return;
          }
          return a.applyCount - b.applyCount;
        },
      },
      {
        title: '报价轮次',
        dataIndex: 'quotationCount',
        key: 'quotationCount',
        width: 110,
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
          if (!a || !b) {
            return;
          }
          return a.quotationCount - b.quotationCount;
        },
      },
      {
        title: '操作',
        key: '14',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <div>
                <a
                  href="javascript:;"
                  onClick={() => {
                    // this.goDetail(record.uuids)
                    // this.props.history.push(
                    //   '/platInvoice/bidlist/bidDetail/' + record.uuids,
                    // );
                    window.open(systemConfigPath.jumpPage('platInvoice/bidlist/bidDetail/' + record.uuids));
                  }}
                >
                  查看详情
                </a>
              </div>
              <div>
                <a
                  href="javascript:;"
                  onClick={() => {
                    this.stopChange(record);
                  }}
                >
                  场次终止
                </a>
              </div>
            </div>
          );
        },
      },
    ];

    const page = false;
    const { isBlock } = this.state;
    function showTotal(total) {
      return `共 ${total} 条`;
    }
    const { getFieldProps } = this.props.form;
    return (
      <div className={less.bidlist_container}>
        <Card>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch.bind(this, '', '')}
          >
            <Row gutter={24}>
              <Col span={this.state.colSpan}>
                <Col
                  span={this.state.expand ? 8 : 12}
                  key={1}
                  style={{ display: 'block' }}
                >
                  <Form.Item
                    label={<span>竞价单</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Input
                      {...getFieldProps('sn')}
                      placeholder="请输入竞价单号/竞价单名称"
                    />
                  </Form.Item>
                </Col>
                <Col
                  span={this.state.expand ? 8 : 12}
                  key={2}
                  style={{ display: 'block' }}
                >
                  <Form.Item
                    label={<span>发布单位</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Input
                      {...getFieldProps('companyName')}
                      placeholder="请输入发布单位"
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={3} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>状态</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Select
                      size="default"
                      placeholder="请选择"
                      {...getFieldProps('status')}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="1">全部</Option>
                      <Option value="10">待发布</Option>
                      <Option value="20">审核中</Option>
                      <Option value="30">发布中</Option>
                      <Option value="31">保证金</Option>
                      <Option value="32">竞价中</Option>
                      <Option value="33">待择标</Option>
                      <Option value="40">下单中</Option>
                      <Option value="50">已完成</Option>
                      <Option value="60">失效/作废</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8} key={4} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>竞价发布日期</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <RangePicker
                      {...getFieldProps('publish')}
                      style={{}}
                      getCalendarContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={5} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>竞价类型</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Select
                      size="default"
                      placeholder="请选择"
                      {...getFieldProps('purchaseType')}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="1">单次采购</Option>
                      <Option value="2">协议采购</Option>
                      {/* {this.state.goodsClassLevelOneList.map((item) => {
                        return <Option key={item.id}>{item.name}</Option>
                      })} */}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8} key={6} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>项目部</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Select
                      {...getFieldProps('organizationId')}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      {this.state.organizationList.map((item) => {
                        return (
                          <Option key={item.id} title={item.organizationName}>
                            {item.organizationName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8} key={7} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>竞价完结时间</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <RangePicker
                      style={{}}
                      {...getFieldProps('complete')}
                      getCalendarContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={8} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>竞价开始日期</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <RangePicker
                      style={{}}
                      {...getFieldProps('startDate')}
                      getCalendarContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={9} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>竞价结束时间</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <RangePicker
                      style={{}}
                      {...getFieldProps('endTime')}
                      getCalendarContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={10} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>报名截止日期</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <RangePicker
                      style={{}}
                      {...getFieldProps('apply')}
                      getCalendarContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={11} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>商品</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Input
                      placeholder="商品名称"
                      {...getFieldProps('materialName')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={12} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>商品分类</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Select
                      size="default"
                      placeholder="请选择"
                      {...getFieldProps('materialsType')}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      {this.state.goodsClassLevelOneList.map((item) => {
                        return <Option key={item.name}>{item.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8} key={13} style={{ display: isBlock }}>
                  <Form.Item
                    label={<span>订单号</span>}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Input
                      placeholder="请输入订单号"
                      {...getFieldProps('orderNo')}
                    />
                  </Form.Item>
                </Col>
              </Col>

              <Col span={this.state.colSearch} style={{ textAlign: 'right' }}>
                <Button
                  style={{ marginLeft: 8, marginRight: 8 }}
                  onClick={this.handleReset}
                >
                  清空
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: '10px' }}
                >
                  搜索
                </Button>
                <a href="javascript:;" onClick={this.toggle}>
                  {!this.state.expand ? '展开' : '收起'}
                  <Icon type={this.state.expand ? 'up' : 'down'} />
                </a>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          extra={
            <Button
              type="primary"
              style={{ marginTop: '20px' }}
              onClick={this.exprotBidding}
            >
              导出竞价
            </Button>
          }
        >
          <div style={{ marginTop: '36px' }}>
            <Row gutter={24}>
              <Col span={24}>
                <Tabs
                  activeKey={this.state.activeKey}
                  span={24}
                  onChange={this.tabsChange}
                >
                  <TabPane tab="全部" key="1"></TabPane>
                  <TabPane tab="待发布" key="10"></TabPane>
                  <TabPane tab="审核中" key="20"></TabPane>
                  <TabPane tab="发布中" key="30"></TabPane>
                  <TabPane tab="保证金" key="31"></TabPane>
                  <TabPane tab="竞价中" key="32"></TabPane>
                  <TabPane tab="待择标" key="33"></TabPane>
                  <TabPane tab="下单中" key="40"></TabPane>
                  <TabPane tab="已完成" key="50"></TabPane>
                  <TabPane tab="失效/作废" key="60"></TabPane>
                </Tabs>
                <div className="bid_list_container">
                  <Table
                    columns={columns}
                    dataSource={this.state.allDataList}
                    pagination={page}
                    scroll={{ x: 1650 }}
                    onChange={(pagination, filters, sorter) => {
                      this.setState({ tableOrder: sorter });
                      this.handleSearch(sorter, 'sort');
                    }}
                  />
                </div>
              </Col>
              {/* <Col span={4}> */}
              {/* <Table columns={ columns2 } dataSource={ dataSource2 } pagination={ page } className='table2' /> */}
              {/* </Col> */}
            </Row>
            <div className={less.pageNav}>
              <Pagination
                total={this.state.total}
                showSizeChanger
                showQuickJumper
                showTotal={showTotal}
                onChange={this.pageChange}
                onShowSizeChange={this.handlePageSize}
              />
            </div>
          </div>
        </Card>
        <StopReacson
          stopVisible={this.state.stopVisible}
          closeModal={this.closeModal.bind(this)}
          curData={this.state.curData}
          getAllDataList={this.getAllDataList.bind(this)}
        ></StopReacson>
      </div>
    );
  }
}
const BidList = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);
export default BidList;
