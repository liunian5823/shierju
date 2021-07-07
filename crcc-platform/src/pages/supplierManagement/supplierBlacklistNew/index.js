import { Row, Col, Table, Card, Button, Tabs, Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util.js';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import ModalForm from './modalForm';
import AddModal from './addModal';
import EditModal from './editModal';
import UploadModal from './uploadModal';
import AuthButton from '@/components/authButton';

import less from './index.less';

class supplierBlacklist extends React.Component {
  state = {
    loading: false,
    tableState1: 0,
    tableState2: 0,
    tableState3: 0,
    supplierInfo: {},
    blackListShow: false,
    editModal: false,
    addModal: false,
    uploadShow: false,
    userPhone: '',
  };
  _isMounted = false;
  _userInfo = null;
  activeTab = 1;

  componentWillMount() {
    this._isMounted = true;
    this.pubsub_userInfo = PubSub.subscribe(
      'PubSub_SendUser',
      function (topic, obj) {
        if (this._userInfo || !obj) {
          return false;
        }
        this._userInfo = obj;
        this.setState({
          userPhone: obj.phone,
        });
        // 获得用户基本信息后执行加载回调
      }.bind(this),
    ); //
    PubSub.publish('PubSub_GetUser', {}); //主动获取用户信息数据
  }
  componentWillUnmount() {
    this._isMounted = false;
    PubSub.unsubscribe(this.pubsub_userInfo);
  }

  //查询组件信息
  formList = [
    {
      type: 'INPUT',
      field: 'name',
      label: '供应商',
      placeholder: '供应商名称/统一社会信用代码',
    },
    {
      type: 'INPUT',
      field: 'enterpriseLegalPerson',
      label: '法人',
      placeholder: '法人名称/身份证号码',
    },
    {
      type: 'SELECT',
      field: 'effective',
      label: '黑名单状态',
      placeholder: '全部',
      list: [
        {
          id: '0',
          value: '已拉黑',
        },
        {
          id: '1',
          value: '未拉黑',
        },
      ],
    },
    {
      type: 'SELECT',
      field: 'factoryType',
      label: '供应商类型',
      placeholder: '请输入供应商类型',
      list: [
        {
          id: '1',
          value: '厂家',
        },
        {
          id: '2',
          value: '贸易集成商',
        },
        {
          id: '3',
          value: '个体户',
        },
      ],
    },
    {
      type: 'SELECT',
      field: 'rating',
      label: '评级',
      placeholder: '全部',
      list: [
        {
          id: '0',
          value: '黑',
        },
        {
          id: '1',
          value: '灰',
        },
        {
          id: '2',
          value: '黄',
        },
      ],
    },
    {
      type: 'SELECT',
      field: 'souce',
      label: '来源',
      placeholder: '请输入供应商类型',
      list: [
        {
          id: '1',
          value: '铁建商城',
        },
        {
          id: '2',
          value: '股份公司',
        },
      ],
    },
    {
      type: 'RANGE',
      field: 'blackTime',
      label: '拉黑时间',
      placeHolder: '请选择拉黑时间',
    },
  ];

  importantFilter = ['name', 'blackTime'];
  handleFilter = (p, isSend = true) => {
    let blackTimeStr, blackTimeEnd;
    if (p.blackTime) {
      blackTimeStr = p.blackTime[0]
        ? moment(p.blackTime[0]).format('YYYY-MM-DD')
        : '';
      blackTimeEnd = p.blackTime[1]
        ? moment(p.blackTime[1]).format('YYYY-MM-DD')
        : '';
    }
    delete p.blackTime;
    let key = this.activeTab;
    for (let i = 1; i < 4; i++) {
      this['baseParams' + i] = {
        ...p,
        blackTimeStr,
        blackTimeEnd,
        ...this['baseParams' + i]
      };
    }

    if (isSend) {
      this.reloadTableData();
    }
  };

  handleChangeTab = (key) => {
    this.activeTab = key;
    this.reloadTableData();
  };

  baseParams1 = {};

  baseParams2 = {
    tabStatus: 1,
  };

  baseParams3 = {
    tabStatus: 0,
  };

  resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state,
      });
    }
  };
  reloadTableData(state = 1) {
    let key = this.activeTab;
    this.handelToLoadTable(state, 'tableState' + key);
  }
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state,
    });
  };

  columns = () => {
    return [
      {
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        sorter: true,
      },
      {
        title: '统一社会信用代码',
        dataIndex: 'businessLicense',
        key: 'businessLicense',
        width: 150,
        sorter: true,
      },
      {
        title: '黑名单状态',
        dataIndex: 'effective',
        key: 'effective',
        width: 120,
        sorter: true,
        render: (text, record) => {
          return <span>{record.effective == 1 ? '未拉黑' : '已拉黑'} </span>;
        },
      },
      {
        title: '评级',
        dataIndex: 'rating',
        key: 'rating',
        width: 120,
        sorter: true,
        render: (text, record) => {
          if (record.rating == null) {
            return <span title={text}>{'-'}</span>;
          }
          if (record.rating == 0) {
            return <span>{'黑'} </span>;
          } else if (record.rating == 1) {
            return <span>{'灰'} </span>;
          } else if (record.rating == 2) {
            return <span>{'黄'} </span>;
          }
        },
      },
      {
        title: '法人姓名',
        dataIndex: 'enterpriseLegalPerson',
        key: 'enterpriseLegalPerson',
        width: 120,
        sorter: true,
      },
      {
        title: '法人身份证号码',
        dataIndex: 'enterpriseLegalPersonId',
        key: 'enterpriseLegalPersonId',
        width: 150,
        sorter: true,
      },
      {
        title: '来源',
        dataIndex: 'blackType',
        key: 'blackType',
        width: 100,
        sorter: true,
        render: (text, record) => {
          if (record.souce == null) {
            return <span title={text}>{'-'}</span>;
          }
          if (record.souce == 1) {
            return <span>{'铁建商城'} </span>;
          } else if (record.souce == 2) {
            return <span>{'股份公司'} </span>;
          } else {
            return <span>{'封停'} </span>;
          }
        },
      },
      {
        title: '拉黑时间',
        dataIndex: 'blackTime',
        key: 'blackTime',
        width: 200,
        sorter: true,
        render: (text, record) => {
          return text.substring(0, 19);
        },
      },
      {
        title: '发布年份',
        dataIndex: 'yearPublished',
        key: 'yearPublished',
        width: 150,
        sorter: true,
      },
      {
        title: '区域',
        dataIndex: 'area',
        key: 'area',
        width: 150,
        sorter: true,
      },
      {
        title: '省份',
        dataIndex: 'province',
        key: 'province',
        width: 150,
        sorter: true,
      },
      {
        title: '所在地',
        dataIndex: 'address',
        key: 'address',
        width: 150,
        sorter: true,
      },
      {
        title: '入驻时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
        sorter: true,
      },
      {
        title: '供应商类型',
        dataIndex: 'factoryType',
        key: 'factoryType',
        width: 180,
        sorter: true,
        render: (text, record) => (
          <span>
            {record.factoryType == '1'
              ? '厂家'
              : record.factoryType == '2'
                ? '贸易集成商'
                : record.factoryType == '3'
                  ? '个体户'
                  : ''}
          </span>
        ),
      },
      {
        title: '上报单位',
        dataIndex: 'reportingCompany',
        key: 'reportingCompany',
        width: 120,
        sorter: true,
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        fixed: 'right',
        width: 120,
        render: (text, record) => (
          <span>
            <AuthButton
              elmType="a"
              onClick={() => {
                this.handleToDetails(record.uuids);
              }}
            >
              详情
            </AuthButton>
            <span className="ant-divider" style={{ margin: '3px' }}></span>
            <AuthButton
              elmType="a"
              onClick={() => {
                this.handleToBlacklist(record);
              }}
            >
              {record.effective == '1' ? '移入' : '移除'}
            </AuthButton>
            <span className="ant-divider" style={{ margin: '3px' }}></span>
            <AuthButton
              elmType="a"
              onClick={() => {
                this.editModal(record);
              }}
            >
              编辑
            </AuthButton>
          </span>
        ),
      },
    ];
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = () => {
    this.setState({
      visible: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleToEdit = (obj) => {
    this.blacklistModal = {
      ...this.blacklistModal,
    };
    this.setState({
      blackListShow: true,
      supplierInfo: obj,
    });
  };
  handleToBlacklist = (obj) => {
    this.blacklistModal = {
      ...this.blacklistModal,
    };
    this.setState({
      blackListShow: true,
      supplierInfo: obj,
    });
  };
  handleToDetails = (uuids) => {
    this.props.history.push(
      this.props.history.location.pathname + '/details' + '/' + uuids,
    );
  };
  saveBlacklist = (formData, effective) => {
    let verificationCodeType;
    let _this = this;
    let curE = '';
    if (effective == '1') {
      curE = 0;
      verificationCodeType = 2;
    } else {
      curE = 1;
      verificationCodeType = 3;
    }
    this.setState({
      loading: true,
    });
    api
      .ajax('POST', '@/platform/blacklist/company/platBlackMoveInOrRemove', {
        blackId: this.state.supplierInfo.blackId,
        uuids: this.state.supplierInfo.uuids,
        phone: '13651141500',
        effective: curE,
        ...formData,
        verificationCodeType,
      })
      .then((r) => {
        if (!_this._isMounted) {
          return;
        }

        Util.alert(r.msg, { type: 'success' });
        this.timerEnd = setTimeout(() => {
          window.location.reload();
        }, 500);

        this.setState({
          loading: false,
          blackListShow: false,
        });
        this.reloadTableData();
      })
      .catch((r) => {
        this.setState({
          loading: false,
        });
        Util.alert(r.msg, { type: 'error' });
      });
  };
  cancelBlacklist = () => {
    this.setState({
      blackListShow: false,
    });
  };
  blacklistModal = {
    onOk: this.saveBlacklist,
    onCancel: this.cancelBlacklist,
  };
  addBlacklist = (formData) => {
    let _this = this;
    this.setState({
      loading: true,
    });
    api
      .ajax('POST', '@/platform/blacklist/company/companyBlackListInsert', {
        ...formData,
        type: 2,
        verificationCodeType: 1,
      })
      .then((r) => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert('添加成功', { type: 'success' });
        this.reloadTableData();
        this.setState({
          loading: false,
          addModal: false,
        });
      })
      .catch((r) => {
        Util.alert(`${r.msg}`, { type: 'error' });
        this.setState({
          loading: false,
        });
      });
  };
  cancelAdd = () => {
    this.setState({
      addModal: false,
    });
  };
  addBlacklistModal = {
    onOk: this.addBlacklist,
    onCancel: this.cancelAdd,
  };
  handleToAdd = () => {
    this.setState({
      addModal: true,
    });
  };
  handleToUpload = () => {
    this.setState({
      uploadShow: true,
    });
  };
  uploadOnCancel = () => {
    this.setState({
      uploadShow: false,
    });
  };

  uploadModalObj = {
    onCancel: this.uploadOnCancel,
  };
  //导出
  handleToExport = () => {
    let params = '';
    for (let index in this.baseParams) {
      params += index + '=' + this.baseParams[index] + '&';
    }
    window.open(
      window.location.origin +
      '/api' +
      '/platform/blacklist/company/platExportCompanyBlack' +
      '?' +
      params,
    );
  };
  cancelEdit = () => {
    this.setState({
      editModal: false,
    });
  };
  editModal = (obj) => {
    this.editBlacklistModal = {
      ...this.editBlacklistModal,
    };
    this.setState({
      editModal: true,
      supplierInfo: obj,
    });
  };
  editBlacklist = (formData) => {
    let _this = this;
    this.setState({
      loading: true,
    });
    api
      .ajax('POST', '@/platform/blacklist/company/platUpdate', {
        ...formData,
        verificationCodeType: 1,
      })
      .then((r) => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert('编辑成功', { type: 'success' });
        this.reloadTableData();
        this.setState({
          loading: false,
          editModal: false,
        });
      })
      .catch((r) => {
        Util.alert('编辑失败', { type: 'error' });
        this.setState({
          loading: false,
        });
      });
  };
  editBlacklistModal = {
    onOk: this.editBlacklist,
    onCancel: this.cancelEdit,
  };

  render() {
    const { TabPane } = Tabs;
    const { selectedRowKeys } = this.state;

    const divStyle = {
      marginBottom: 0,
      float: 'right',
      display: 'inline',
      // borderBottom: '1px solid #d9d9d9',
      // paddingBottom: '7px'
    };
    const rowCheckSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys,
        });
      },
    };

    return (
      <div>
        <Card bordered={false}>
          <Row>
            <BaseForm
              formList={this.formList}
              importantFilter={this.importantFilter}
              filterSubmit={this.handleFilter}
            ></BaseForm>
          </Row>
          <Tabs defaultActiveKey="1" onChange={this.handleChangeTab} tabBarExtraContent={<div className="toolbar">
            <AuthButton type="primary" onClick={this.handleToAdd}>
              添加
                </AuthButton>
            <AuthButton type="primary" onClick={this.handleToUpload}>
              导入
                </AuthButton>
            <AuthButton type="primary" onClick={this.handleToExport}>
              导出
                </AuthButton>
          </div>}>
            <TabPane tab="全部" key="1">
              <BaseTable
                url="@/platform/blacklist/company/platBlacklistCompanyList"
                tableState={this.state.tableState1}
                resetTable={(state) => {
                  this.resetTable(state, 'tableState1');
                }}
                baseParams={this.baseParams1}
                columns={this.columns()}
                scroll={{ x: 2000 }}
              />
            </TabPane>
            <TabPane tab="未拉黑" key="2">
              <BaseTable
                url="@/platform/blacklist/company/platBlacklistCompanyList"
                tableState={this.state.tableState2}
                s
                resetTable={(state) => {
                  this.resetTable(state, 'tableState2');
                }}
                baseParams={this.baseParams2}
                columns={this.columns()}
                scroll={{ x: 2000 }}
              />
            </TabPane>
            <TabPane tab="已拉黑" key="3" className={less.tabplane}>
              <BaseTable
                url="@/platform/blacklist/company/platBlacklistCompanyList"
                tableState={this.state.tableState3}
                resetTable={(state) => {
                  this.resetTable(state, 'tableState3');
                }}
                baseParams={this.baseParams3}
                columns={this.columns()}
                scroll={{ x: 2000 }}
              />
            </TabPane>
          </Tabs>
        </Card>
        <ModalForm
          {...this.blacklistModal}
          userPhone={this.state.userPhone}
          confirmLoading={this.state.loading}
          obj={this.state.supplierInfo}
          visible={this.state.blackListShow}
        ></ModalForm>
        <EditModal
          {...this.editBlacklistModal}
          userPhone={this.state.userPhone}
          confirmLoading={this.state.loading}
          obj={this.state.supplierInfo}
          visible={this.state.editModal}
        ></EditModal>
        <AddModal
          title="添加"
          {...this.addBlacklistModal}
          userPhone={this.state.userPhone}
          confirmLoading={this.state.loading}
          visible={this.state.addModal}
        ></AddModal>
        <UploadModal
          {...this.uploadModalObj}
          confirmLoading={this.state.loading}
          visible={this.state.uploadShow}
        ></UploadModal>
      </div>
    );
  }
}
export default supplierBlacklist;
