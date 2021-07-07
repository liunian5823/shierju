import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Card, Select, Tabs, Table, Divider, Tag, Pagination, RangePicker, message } from 'antd';
const FormItem = Form.Item;
import { DatePicker } from 'antd';
import CusPopover from '../components/cusPopover/index.js';
import { systemConfigPath } from '@/utils/config/systemConfig';
const { TabPane } = Tabs;
import less from './index.less';
class RegList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colSpan: 18,
      colSearch: 6,
      expand: false,
      isBlock: 'none',
      //列表数据
      allRegList: [],
      total: 0,
      //搜索列表
      searchList: {},

      //排序
      tableOrder: null,
      activeKey: '1',
      pageSize: 10,
    };
  }
  componentWillMount() {
    this.getAllRegData();
  }
  //点击搜索调用
  handleSearch = (orderParams, type, e) => {
    console.log(this.state.tableOrder);
    console.log(orderParams);
    if (!orderParams) {
      orderParams = this.state.tableOrder;
    }
    if (e != null) {
      e.preventDefault();
    }

    let searchData = this.props.form.getFieldsValue();

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
      if (options.orderKey == 'workOrdersCode') {
        options.workOrdersCodeSorts = sortValue;
      } else if (options.orderKey == 'name') {
        options.nameSorts = sortValue;
      } else if (options.orderKey == 'contendSn') {
        options.contendSnSorts = sortValue;
      } else if (options.orderKey == 'companyName') {
        options.companyNameSorts = sortValue;
      } else if (options.orderKey == 'supplierName') {
        options.supplierNameSorts = sortValue;
      } else if (options.orderKey == 'organizationName') {
        options.organizationNameSorts = sortValue;
      } else if (options.orderKey == 'status') {
        options.statusSorts = sortValue;
      } else if (options.orderKey == 'createTime') {
        options.createTimeSorts = sortValue;
      } else if (options.orderKey == 'platAcceptTime') {
        options.platAcceptTimeSorts = sortValue;
      } else if (options.orderKey == 'platTime') {
        options.platTimeSorts = sortValue;
      } else if (options.orderKey == 'userName') {
        options.userNameSorts = sortValue;
      }
    }
    tempOptions.forEach((key) => {
      options[key] = searchData[key];
    });
    if (type !== 'sort') {
      this.setState({ activeKey: '1' })
    }
    this.setState(
      {
        searchList: {
          ...options,
        },
        page: 1,

      },
      () => {
        options.rows = this.state.searchList.rows || 10;
        options.page = 1;
        options.status = this.state.activeKey == '1' ? '' : this.state.activeKey
        this.getAllRegData(options);
      },
    );
  };
  //切换tabs调用
  tabsChange = (key) => {
    let options = {};
    this.setState({ activeKey: key });
    if (key == 1) {
      options = {
        ...this.state.searchList,
        rows: this.state.pageSize,
        page: 1,
      };
    } else {
      options = {
        ...this.state.searchList,
        status: key,
        rows: this.state.pageSize,
        page: 1,
      };
    }
    this.getAllRegData(options);
  };

  //获取全部列表数据
  getAllRegData(
    options = {
      rows: this.state.pageSize,
      page: 1,
      status: this.state.activeKey == '1' ? '' : this.state.activeKey
    },
  ) {
    axios
      .post('@/platform/quit/platPage', options)
      .then((res) => {
        if (res.code == 200) {
          this.setState({
            allRegList: res.data.rows || [],
            total: res.data.total,
          });
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  }
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
  //切换页面调用
  pageChange = (page) => {
    let options = {
      ...this.state.searchList,
      rows: this.state.pageSize,
      page,
      status: this.state.activeKey == '1' ? '' : this.state.activeKey
    };
    this.getAllRegData(options);
  };
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      searchList: {},
    });
  };

  //状态处理
  makeStatusToStr(status) {
    if (!status) {
      return '';
    }
    let statusStr = '';
    switch (status) {
      case 1:
        statusStr = '采购处理';
        break;
      case 2:
        statusStr = '采购处理完成';
        break;
      case 3:
        statusStr = '待受理';
        break;
      case 4:
        statusStr = '待处理';
        break;
      case 5:
        statusStr = '已处理';
        break;
      default:
        break;
    }
    return statusStr;
  }
  makeAddressStatus(status) {
    let statusAryOrStr = '查看详情';
    switch (status) {
      case 3:
        statusAryOrStr = ['查看详情', '受理'];
        break;
      case 4:
        statusAryOrStr = ['查看详情', '释放受理', '处理悔标'];
        break;
      case 5:
        statusAryOrStr = '查看详情';
        break;
      default:
        break;
    }
    return statusAryOrStr;
  }
  //跳转
  doAnyChange(e, record) {
    console.log(e.target.innerText);
    switch (e.target.innerText) {
      case '查看详情':
        this.props.history.push(
          `/platInvoice/reglist/regdetailView/view/${record.uuids}/${record.contendUuids}`,
        );
        break;
      case '受理':
        this.props.history.push(
          `/platInvoice/reglist/regdetailAcceptance/acceptance/${record.uuids}/${record.contendUuids}`,
        );
        break;
      case '处理悔标':
        this.props.history.push(
          `/platInvoice/reglist/regdetailHandle/handle/${record.uuids}/${record.contendUuids}`,
        );
        break;
      case '释放受理':
        this.props.history.push(
          `/platInvoice/reglist/regdetailAcceptance/reacceptance/${record.uuids}/${record.contendUuids}`,
        );
        break;
      default:
        break;
    }
    // console.log(record.uuids, '-------');
    // this.props.history.push(`/regdetail/${record.uuids}`);
  }
  handlePageSize = (current, pageSize) => {
    let options = {
      rows: pageSize,
      page: 1,
    };
    this.setState({
      currentPage: 1,
      pageSize: pageSize,
    }, () => { this.getAllRegData(options); });
  };
  render() {
    const { getFieldProps } = this.props.form;
    let isBlock = this.state.isBlock;
    const dateStyle = {
      textAlign: 'right',
      marginRight: '20px',
      width: '70px',
    };
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrdersCode',
        key: 'workOrdersCode',
        width: 120,
        defaultSortOrder: 'descend',
        sorter: true,
      },
      {
        title: '业务类型',
        dataIndex: '2',
        key: '2',
        width: 100,
        sorter: (a, b) => { },
        render: () => {
          return '悔标处理';
        },
      },
      {
        title: '业务名称',
        dataIndex: 'name',
        key: 'name',
        width: 130,
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
        title: '业务单号',
        dataIndex: 'contendSn',
        key: 'contendSn',
        defaultSortOrder: 'descend',
        width: 160,
        sorter: true,
      },
      {
        title: '采购商名称',
        dataIndex: 'companyName',
        key: 'companyName',
        defaultSortOrder: 'descend',
        width: 130,
        sorter: true,
        render: (text) => {
          if (!text) {
            return <CusPopover content="--"></CusPopover>;
          }
          return <CusPopover content={text}></CusPopover>;
        },
      },
      {
        title: '供应商名称',
        dataIndex: 'supplierName',
        key: 'supplierName',
        defaultSortOrder: 'descend',
        width: 120,
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
        width: 120,
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
        dataIndex: 'status',
        key: 'status',
        defaultSortOrder: 'descend',
        sorter: true,
        width: 100,
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          let statusStr = this.makeStatusToStr(text);
          return <div style={{ color: '#FF9C3F' }}>{statusStr}</div>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        defaultSortOrder: 'descend',
        width: 100,
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
        title: '受理时间',
        dataIndex: 'platAcceptTime',
        key: 'platAcceptTime',
        defaultSortOrder: 'descend',
        width: 100,
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
        title: '处理时间',
        dataIndex: 'platTime',
        key: 'platTime',
        defaultSortOrder: 'descend',
        width: 100,
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
        title: '发起人',
        dataIndex: 'userName',
        key: 'userName',
        defaultSortOrder: 'descend',
        width: 100,
        sorter: true,
        render: (text, record) => {
          if (!text) {
            return '--';
          }
          return (
            <div>
              <p>{text}</p>
              <p>{record.phone}</p>
            </div>
          );
        },
      },
      {
        title: '操作',
        key: '13',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          if (!record.status) {
            return (
              <div>
                <a
                  href="javascript:;"
                  onClick={() => {
                    this.goRegDetail(record);
                  }}
                >
                  查看详情
                </a>
              </div>
            );
          }
          let tempStatus = this.makeAddressStatus(record.status);

          return (
            <div>
              {tempStatus instanceof Array ? (
                tempStatus.map((item, index) => {
                  return (
                    <div key={index}>
                      <a
                        href="javascript:;"
                        onClick={(e) => {
                          this.doAnyChange(e, record);
                        }}
                      >
                        {item}
                      </a>
                    </div>
                  );
                })
              ) : (
                  <div>
                    <a
                      href="javascript:;"
                      onClick={(e) => {
                        this.doAnyChange(e, record);
                      }}
                    >
                      {tempStatus}
                    </a>
                  </div>
                )}
            </div>
          );
        },
      },
    ];

    const dataSource = [
      {
        key: '1',
        uuids: '1111111111',
        sn: '00001',
        '2': '悔标处理',
        name:
          '竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称竞价单名称',
        contendSn: '12345678901234567',
        companyName:
          '采购商名称采购商名称采购商名称采购商名称采购商名称采购商名称采购商名称采购商名称采购商名称采购商名称采购商名称采购商名称',
        supplierName:
          '供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称供应商名称',
        organizationName:
          '项目部名称供应商名称供应商名称供应商名称项目部名称供应商名称供应商名称供应商名称项目部名称供应商名称供应商名称供应商名称',
        createTime: '2020-12-12 12:12:12',
        platAcceptTime: '2020-12-12 12:12:12',
        platTime: '2020-12-12 12:12:12',
        userName: '汤姆',
        phone: '15800000000',
        status: 4,
        '13': '查看/受理/重新受理',
      },
    ];
    const page = false;
    function showTotal(total) {
      return `共 ${total} 条`;
    }

    return (
      <div className={less.reg_list_container}>
        <Card>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch.bind(this, '')}
          >
            <Row gutter={24}>
              <Col span={this.state.colSpan}>
                <Col
                  span={this.state.expand ? 8 : 12}
                  key={1}
                  style={{ display: 'block' }}
                >
                  <Form.Item
                    label="竞价单名称"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input
                      {...getFieldProps('name')}
                      placeholder="请输入竞价单名称"
                    />
                  </Form.Item>
                </Col>
                <Col
                  span={this.state.expand ? 8 : 12}
                  key={2}
                  style={{ display: 'block' }}
                >
                  <Form.Item
                    label="竞价单编号"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input
                      {...getFieldProps('sn')}
                      placeholder="请输入竞价单编号"
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={3} style={{ display: isBlock }}>
                  <Form.Item
                    label="工单号"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input
                      {...getFieldProps('workOrdersCode')}
                      placeholder="请输入工单号"
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={4} style={{ display: isBlock }}>
                  <Form.Item
                    label="采购商名称"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input
                      placeholder="请输入采购商名称"
                      {...getFieldProps('companyName')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8} key={5} style={{ display: isBlock }}>
                  <Form.Item
                    label="供应商名称"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input
                      placeholder="请输入供应商名称"
                      {...getFieldProps('supplierName')}
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
                <Button type="primary" htmlType="submit">
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

        <Card>
          <div>
            <Row gutter={24}>
              <Col span={24}>
                <Tabs
                  activeKey={this.state.activeKey}
                  span={24}
                  onChange={this.tabsChange}
                >
                  <TabPane tab="全部" key="1"></TabPane>
                  <TabPane tab="待受理" key="3"></TabPane>
                  <TabPane tab="受理中" key="4"></TabPane>
                  <TabPane tab="已处理" key="5"></TabPane>
                </Tabs>
              </Col>
            </Row>
            <div>
              <Table
                columns={columns}
                dataSource={this.state.allRegList}
                pagination={page}
                scroll={{ x: 1600 }}
                onChange={(pagination, filters, sorter) => {
                  this.setState({ tableOrder: sorter });
                  this.handleSearch(sorter, 'sort');
                }}
              />
            </div>
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
      </div>
    );
  }
}

export default Form.create({})(RegList);