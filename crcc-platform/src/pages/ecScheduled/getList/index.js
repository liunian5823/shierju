import { Input, Table, Card, Button, Modal } from "antd";
import api from "@/framework/axios";
import Util from "@/utils/util";
import BaseForm from "@/components/baseForm";
import BaseTable from "@/components/baseTable";
import AddModal from "./addModal";
import ModalForm from "./modalForm";
import AuthButton from "@/components/authButton";

import less from "./index.less";

class supplierBlacklist extends React.Component {
  state = {
    loading: false,
    tableState: 0,
    supplierInfo: {},
    blackListShow: false,
    addModal: false,
    userPhone: "",
    visibles: false,
    jobStatus: "",
    cron: "",
    jobId: "",
    TimeVisibles: false,
    modalData: ''
  };
  _isMounted = false;
  _userInfo = null;

  componentWillMount() {
    this._isMounted = true;
    this.pubsub_userInfo = PubSub.subscribe(
      "PubSub_SendUser",
      function(topic, obj) {
        if (this._userInfo || !obj) {
          return false;
        }
        this._userInfo = obj;
        this.setState({
          userPhone: obj.phone
        });
        // 获得用户基本信息后执行加载回调
      }.bind(this)
    ); //
    PubSub.publish("PubSub_GetUser", {}); //主动获取用户信息数据
  }
  componentWillUnmount() {
    this._isMounted = false;
    PubSub.unsubscribe(this.pubsub_userInfo);
  }
  importantFilter = ["companyNmae", "blackTime"];

  resetTable = (state, tableState = "tableState") => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  };

  columns = () => {
    return [
      {
        title: "定时任务名称",
        dataIndex: "jobName",
        key: "jobName",
        witdh: 100,
        sorter: true
      },
      {
        title: "定时任务组别",
        dataIndex: "jobGroup",
        key: "jobGroup",
        witdh: 100,
        sorter: true
      },
      {
        title: "是否开启",
        dataIndex: "jobStatus",
        key: "jobStatus",
        width: 100,
        sorter: true,
        render: (text, record) => {
          return(
            <span>
              {record.jobStatus == "0" ? "关闭" : "开启"}
            </span>
          )
        }
      },
      {
        title: "cron表达式",
        dataIndex: "cronExpression",
        key: "cronExpression",
        width: 120,
        sorter: true
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        width: 100,
        sorter: true,
        render: (text, record) => {
          return(
            <span>
              {record.description == "0" ? "集群全部执行" : "单节点执行"}
            </span>
          )
        }
      },
      {
        title: "类路径",
        dataIndex: "beanClass",
        key: "beanClass",
        witdh: 90,
        sorter: true
      },
      {
        title: "是否需要顺序执行",
        dataIndex: "isConcurrent",
        key: "isConcurrent",
        witdh: 90,
        sorter: true,
        render: (text, record) => {
          return(
            <span>
              {record.isConcurrent == "0" ? "是" : "否"}
            </span>
          )
        }
      },
      {
        title: "springId",
        dataIndex: "springId",
        key: "springId",
        witdh: 90,
        sorter: true,
      },
      {
        title: "方法名",
        dataIndex: "methodName",
        key: "methodName",
        witdh: 90,
        sorter: true
      },
      {
        title: "定时任务Id",
        dataIndex: "id",
        key: "id",
        witdh: 90,
        sorter: true
      },
      {
        title: "操作",
        dataIndex: "x",
        witdh: 80,
        key: "x",
        render: (text, record) => {
          return (
            <div>
              <span
                style={{ cursor: 'pointer' ,color: '#2db7f5'}}
                onClick={() => {
                  this.handleChange(record.jobStatus, record.id);
                }}
              >
                更改
              </span>
              <span className="ant-divider" />
              <span
                style={{ cursor: 'pointer' ,color: '#2db7f5'}}
                onClick={() => {
                  this.handleModify(record.cronExpression, record.id);
                }}
              >
                修改
              </span>
            </div>
          );
        }
      }
    ];
  };i
  //更改状态弹框
  handleChange = (jobStatus, jobId) => {
    this.setState({
      visibles: true,
      jobStatus: jobStatus,
      jobId: jobId
    });
  };
  //修改时间弹框
  handleModify = (cronExpression, jobId) => {
    this.setState({
      TimeVisibles: true,
      cron: cronExpression,
      jobId: jobId
    });
  };
  //  修改时间请求
  handleOks = (formData) => {
    let _this = this;
    formData.jobId = this.state.jobId
    api
      .ajax("GET", "@/scheduled/ecScheduled/updateCron", {
        ...formData
      })
      .then(r => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert("修改时间成功", { type: "success" });
        _this.setState({
          loading: false,
          TimeVisibles: false
        });
        location.reload();
      })
      .catch(r => {
        Util.alert("修改时间失败", { type: "error" });
        _this.setState({
          loading: false,
          TimeVisibles: false
        });
      });
  };
  //更改状态请求
  handleOk = (formData) => {
    let _this = this;
    formData.jobId = this.state.jobId
    api
      .ajax("GET", "@/scheduled/ecScheduled/changeStatus", {
        ...formData
      })
      .then(r => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert("更改状态成功", { type: "success" });
        _this.setState({
          loading: false,
          visibles: false
        });
        location.reload();
      })
      .catch(r => {
        Util.alert("更改状态失败", { type: "error" });
        _this.setState({
          loading: false,
          visibles: false
        });
      });
  };
  //
  handleCancel = e => {
    this.setState({
      visibles: false,
      TimeVisibles: false
    });
  };
  cancelBlacklist = () => {
    this.setState({
      blackListShow: false
    });
  };
  addBlacklist = formData => {
    let _this = this;
    this.setState({
      loading: true
    });
    api
      .ajax("POST", "@/scheduled/ecScheduled/save", {
        ...formData
      })
      .then(r => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert("添加成功", { type: "success" });
        this.setState({
          loading: false,
          addModal: false
        });
      })
      .catch(r => {
        Util.alert("添加失败", { type: "error" });
        this.setState({
          loading: false
        });
      });
  };
  cancelAdd = () => {
    this.setState({
      addModal: false
    });
  };
  addBlacklistModal = {
    onOk: this.addBlacklist,
    onCancel: this.cancelAdd
  };
  //添加
  handleToAdd = () => {
    this.setState({
      addModal: true
    });
  };
  //初始化
  handleToUpload = () => {
    let _this = this;
    this.setState({
      loading: true
    });
    api
      .ajax("GET", "@/scheduled/ecScheduled/initJob", {})
      .then(r => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert("初始化成功", { type: "success" });
        this.setState({
          loading: false
        });
      })
      .catch(r => {
        Util.alert("初始化失败", { type: "error" });
        this.setState({
          loading: false
        });
      });
  };
  //所有定时任务查询
  baseParams1 = {
    querysort: "createTime",
    order: "desc",
    page: "1",
    rows: "10"
  };
  //弹框
  modalFormList = type => {
    switch (type) {
      case 1:
      return [
        {
          el: "RADIO",
          key: "status",
          type: "text",
          label: "更改状态",
          value: this.state.jobStatus == "0" ? 'stop' : 'start'
        }
      ]
        break;
      case 2:
        return [
          {
            el: "INPUT",
            key: "cron",
            type: "text",
            label: "修改时间",
            placeholder: "请修改时间",
            value: this.state.modalData ? this.state.modalData.cron : this.state.cron
          }
        ];
        break;
    }
  };
  modalConfigs = () => {
    return {
      title: "修改时间",
      onOk: this.handleOks,
      onCancel: this.handleCancel
    };
  };
  modalConfig = () => {
    return {
      title: "更改状态",
      onOk: this.handleOk,
      onCancel: this.handleCancel
    };
  };
  render() {
    const { selectedRowKeys } = this.state;
    const rowCheckSelection = {
      type: "checkbox",
      selectedRowKeys,
      onChange: selectedRowKeys => {
        this.setState({
          selectedRowKeys
        });
      }
    };
    return (
      <div>
        <Card bordered={false}>
          <div className="toolbar">
            <Button type="primary" onClick={this.handleToUpload}>
              初始化
            </Button>
            <Button type="primary" onClick={this.handleToAdd}>
              添加
            </Button>
          </div>
          <BaseTable
            url="@/scheduled/ecScheduled/getList"
            tableState={this.state.tableState}
            resetTable={state => {
              this.resetTable(state, "tableState");
            }}
            baseParams={this.baseParams1}
            columns={this.columns()}
          />
        </Card>
        <AddModal
          title="添加"
          {...this.addBlacklistModal}
          //userPhone={this.state.userPhone}
          confirmLoading={this.state.loading}
          visible={this.state.addModal}
        />
     
          <ModalForm
            {...this.modalConfig()}
            title="更改状态"
            confirmLoading={this.state.loading}
            visible={this.state.visibles}
            formList={this.modalFormList(1)}
          />     
          <ModalForm
            {...this.modalConfigs()}
            confirmLoading={this.state.loading}
            visible={this.state.TimeVisibles}
            formList={this.modalFormList(2)}
          />
      </div>
    );
  }
}
export default supplierBlacklist;
