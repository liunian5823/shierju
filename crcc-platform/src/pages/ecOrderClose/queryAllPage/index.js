import { Card, Tabs, Alert, Button } from "antd";
import api from "@/framework/axios";
import AuthButton from "@/components/authButton";
import BaseForm from "@/components/baseForm";
import BaseTable from "@/components/baseTable";

const TabPane = Tabs.TabPane;

class queryAllPage extends React.Component {
  state = {
    loading: false,
    tableState1: 0,
    tableState2: 0,
    tableState3: 0,
    tableState4: 0,
    tableState7: 0,
    total1: 0,
    total2: 0,
    total3: 0,
    totalSupplierQuantity: ""
  };

  _isMounted = false;
  activeTab = 1;

  importantFilter = ["orderNo", "orderStatus"];

  formList = () => [
    {
      type: "INPUT",
      field: "orderNo",
      label: "订单号",
      placeholder: "请输入订单号"
    },
    {
      type: "INPUT",
      field: "buyerCompanyName",
      label: "采购商名称",
      placeholder: "请输入采购商名称"
    },
    {
      type: "INPUT",
      field: "sellerCompanyName",
      label: "供应商名称",
      placeholder: "请输入供应商名称"
    },
    {
      type: "INPUT",
      field: "appealUsername",
      label: "申诉人",
      placeholder: "请输入申诉人"
    },
    {
      type: "RANGE",
      field: "createTime",
      label: "申诉时间",
      placeholder: "请筛选时间段"
    },
    {
      type: "INPUT",
      field: "solutionUsername",
      label: "处理人",
      placeholder: "请输入处理人"
    },
    {
      type: "RANGE",
      field: "solutionTime",
      label: "处理时间",
      placeholder: "请筛选时间段"
    },
    {
      type: "SELECT",
      field: "orderStatus",
      label: "订单状态",
       list: [
        {
          id: '26',
          value: '付款中'
        },
        {
          id: '30',
          value: '待发货'
        },
        {
          id: '40',
          value: '待收货'
        },
        {
          id: '50',
          value: '已收货'
        }
      ]
    },
    {
      type: "SELECT",
      field: "flag",
      label: "申诉状态",
      placeholder: "-",
       list: [
        {
          id: '0',
          value: '处理完成'
        },
        {
          id: '1',
          value: '受理中'
        },
        {
          id: '2',
          value: '待受理'
        }
      ]
    },
    {
      type: "SELECT",
      field: "type",
      label: "申诉方",
       list: [
        {
          id: '1',
          value: '卖方'
        },
        {
          id: '2',
          value: '买方'
        }
      ]
    }
  ];

  handleFilter = (p, isSend = true) => {
    let startTimeC, endTimeC, startTimeS, endTimeS;
    if (p.createTime) {
      startTimeC = p.createTime[0]
        ? moment(p.createTime[0]).format("YYYY-MM-DD HH:mm:ss")
        : "";
        endTimeC = p.createTime[1]
        ? moment(p.createTime[1]).format("YYYY-MM-DD HH:mm:ss")
        : "";
        delete p.createTime
    }

    if (p.solutionTime) {
      startTimeS = p.solutionTime[0]
        ? moment(p.solutionTime[0]).format("YYYY-MM-DD HH:mm:ss")
        : "";
        endTimeS = p.solutionTime[1]
        ? moment(p.solutionTime[1]).format("YYYY-MM-DD HH:mm:ss")
        : "";
        delete p.solutionTime
    }

    let key = this.activeTab;
    this["baseParams" + key] = {
      ...this["baseParams" + key],
      ...p,
      startTimeC,
      endTimeC,
      startTimeS,
      endTimeS
    };
    if (isSend) {
      this.reloadTableData();
    }
  };

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  baseParams1 = {
    //status: "全部"
  };
  baseParams2 = {
    flag: "2"
  };
  baseParams3 = {
    flag: "0"
  };
  baseParams4 = {
    flag: "1"
  };
  columns = params => {
    if (params == "paramsOne") {
      return [
        {
          title: "订单号",
          dataIndex: "orderNo",
          key: "orderNo",
          sorter: true,
          width: 180
        },
        {
          title: "采购商",
          dataIndex: "buyerCompanyName",
          key: "buyerCompanyName",
          sorter: true,
          width: 195
        },
        {
          title: "供应商",
          dataIndex: "sellerCompanyName",
          key: "sellerCompanyName",
          sorter: true,
          width: 195
        },
        {
          title: "申诉方",
          dataIndex: "type",
          key: "type",
          sorter: true,
          width: 100,
          render:(text) => {
              if(text == '1'){
                return '卖方'
              }else if(text == '2'){
                return '买方'
              }else{
                return '-'
              }
          }
        },
        {
          title: "申诉人",
          dataIndex: "appealUsername",
          key: "appealUsername",
          sorter: true,
          width: 100
        },
        {
          title: "申诉时间",
          dataIndex: "createTime",
          key: "createTime",
          sorter: true,
          width: 150,
          render: (text) => {
            if(text){
              return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }
          }
        },
        {
          title: "处理人",
          dataIndex: "solutionUsername",
          key: "solutionUsername",
          sorter: true,
          width: 100
        },
        {
          title: "处理时间",
          dataIndex: "solutionTime",
          key: "solutionTime",
          sorter: true,
          width: 150,
          render: (text) => {
            if(text){
              return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }else{
              return '-'
            }
          }
        },
        {
          title: "订单状态",
          dataIndex: "orderStatus",
          key: "orderStatus",
          sorter: true,
          width: 90,
          render: (text) => {
            switch (text) {
              case '26': return '付款中';
              case '30': return '待发货';
              case '40': return '待收货';
              case '50': return '已收货';
              default: return '-'
            }
          }
        },
        {
          title: "申诉状态",
          dataIndex: "flag",
          key: "flag",
          sorter: true,
          width: 100,
          render: (text)=>{
            switch (text) {
              case '0': return '处理完成';
              case '1': return '受理中';
              case '2': return '待受理';
              default: return '-'
            }
          }
        },
        {
          title: "操作",
          key: "options",
          width: 120,
          render: (text, record) => {
            if (record.flag == "0") {
              return (
                <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
              );
            } else if (record.flag == "1") {
              return (
                <span>
                  <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
                  <span className="ant-divider" />
                  <a><AuthButton elmType="a" onClick={() => this.handleToAcceptance(record.uuids)}>处理</AuthButton></a>
                </span>
              );
            } else {
              return (
                <span>
                  <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
                  <span className="ant-divider" />
                  <a><AuthButton elmType="a" onClick={() => this.handleToDeal(record.uuids)}>受理</AuthButton></a>
                </span>
              );
            }
          }
        }
      ];
    } else if (params == "paramsTwo" || params == "paramsFour") {
      return [
        {
          title: "订单号",
          dataIndex: "orderNo",
          key: "orderNo",
          sorter: true,
          width: 180
        },
        {
          title: "采购商",
          dataIndex: "buyerCompanyName",
          key: "buyerCompanyName",
          sorter: true,
          width: 195
        },
        {
          title: "供应商",
          dataIndex: "sellerCompanyName",
          key: "sellerCompanyName",
          sorter: true,
          width: 195
        },
        {
          title: "申诉方",
          dataIndex: "type",
          key: "type",
          sorter: true,
          width: 100,
          render:(text) => {
            if(text == '1'){
              return '卖方'
            }else if(text == '2'){
              return '买方'
            }else{
              return '-'
            }
          }
        },
        {
          title: "申诉人",
          dataIndex: "appealUsername",
          key: "appealUsername",
          sorter: true,
          width: 100
        },
        {
          title: "申诉时间",
          dataIndex: "createTime",
          key: "createTime",
          sorter: true,
          width: 140,
          render: (text) => {
            if(text){
              return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }
          }
        },
        {
          title: "处理人",
          dataIndex: "solutionUsername",
          key: "solutionUsername",
          sorter: true,
          width: 100
        },
        {
          title: "受理时间",
          dataIndex: "recpTime",
          key: "recpTime",
          sorter: true,
          width: 140,
          render: (text) => {
            if(text){
              return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }else{
              return '-'
            }
          }
        },
        {
          title: "订单状态",
          dataIndex: "orderStatus",
          key: "orderStatus",
          sorter: true,
          width: 100,
          render: (text) => {
            switch (text) {
              case '26': return '付款中';
              case '30': return '待发货';
              case '40': return '待收货';
              case '50': return '已收货';
              default: return '-'
            }
          }
        },
        {
          title: "申诉状态",
          dataIndex: "flag",
          key: "flag",
          sorter: true,
          width: 100,
          render: (text)=>{
            switch (text) {
              case '0': return '处理完成';
              case '1': return '受理中';
              case '2': return '待受理';
              default: return '-'
            }
          }
        },
        {
          title: "操作",
          key: "options",
          width: 120,
          render: (text, record) => {
            if (record.flag == "0") {
              return (
                <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
              );
            } else if (record.flag == "1") {
              return (
                <span>
                  <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
                  <span className="ant-divider" />
                  <a><AuthButton elmType="a" onClick={() => this.handleToAcceptance(record.uuids)}>处理</AuthButton></a>
                </span>
              );
            } else {
              return (
                <span>
                  <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
                  <span className="ant-divider" />
                  <a><AuthButton elmType="a" onClick={() => this.handleToDeal(record.uuids)}>受理</AuthButton></a>
                </span>
              );
            }
          }
        }
      ];
    } else {
      return [
        {
          title: "订单号",
          dataIndex: "orderNo",
          key: "orderNo",
          sorter: true,
          width: 180
        },
        {
          title: "采购商",
          dataIndex: "buyerCompanyName",
          key: "buyerCompanyName",
          sorter: true,
          width: 195
        },
        {
          title: "供应商",
          dataIndex: "sellerCompanyName",
          key: "sellerCompanyName",
          sorter: true,
          width: 195
        },
        {
          title: "申诉方",
          dataIndex: "type",
          key: "type",
          sorter: true,
          width: 100,
          render:(text) => {
            if(text == '1'){
              return '卖方'
            }else if(text == '2'){
              return '买方'
            }else{
              return '-'
            }
          }
        },
        {
          title: "申诉人",
          dataIndex: "appealUsername",
          key: "appealUsername",
          sorter: true,
          width: 100
        },
        {
          title: "申诉时间",
          dataIndex: "createTime",
          key: "createTime",
          sorter: true,
          width: 140,
          render: (text) => {
            if(text){
              return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }
          }
        },
        {
          title: "处理人",
          dataIndex: "solutionUsername",
          key: "solutionUsername",
          sorter: true,
          width: 100
        },
        {
          title: "处理时间",
          dataIndex: "solutionTime",
          key: "solutionTime",
          sorter: true,
          width: 140,
          render: (text) => {
            if(text){
              return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }else{
              return '-'
            }
          }
        },
        {
          title: "受理时间",
          dataIndex: "recpTime",
          key: "recpTime",
          sorter: true,
          width: 140,
          render: (text) => {
            if(text){
              return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }else{
              return '-'
            }
          }
        },
        {
          title: "订单状态",
          dataIndex: "orderStatus",
          key: "orderStatus",
          sorter: true,
          width: 100,
          render: (text) => {
            switch (text) {
              case '26': return '付款中';
              case '30': return '待发货';
              case '40': return '待收货';
              case '50': return '已收货';
              default: return '-'
            }
          }
        },
        {
          title: "申诉状态",
          dataIndex: "flag",
          key: "flag",
          sorter: true,
          width: 100,
          render: (text)=>{
            switch (text) {
              case '0': return '处理完成';
              case '1': return '受理中';
              case '2': return '待受理';
              default: return '-'
            }
          }
        },
        {
          title: "操作",
          key: "options",
          width: 120,
          render: (text, record) => {
            if (record.flag == "0") {
              return (
                <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
              );
            } else if (record.flag == "1") {
              return (
                <span>
                  <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
                  <span className="ant-divider" />
                  <a><AuthButton elmType="a" onClick={() => this.handleToAcceptance(record.uuids)}>处理</AuthButton></a>
                </span>
              );
            } else {
              return (
                <span>
                  <a><span elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</span></a>
                  <span className="ant-divider" />
                  <a><AuthButton elmType="a" onClick={() => this.handleToDeal(record.uuids)}>受理</AuthButton></a>
                </span>
              );
            }
          }
        }
      ];
    }
  };
  handelToLoadTable = (state = 1, tableState = "tableState") => {
    this.setState({
      [tableState]: state
    });
  };
  reloadTableData(state = 1) {
    let key = this.activeTab;
    this.handelToLoadTable(state, "tableState" + key);
  }
  resetTable = (state, tableState = "tableState") => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  };
  //查看
  handleToDetails = id => {
    this.props.history.push(
      "/ecUserApprovalLog/querySeeModal" + "/audit" + "/" + id
    );
  };
  //受理
  handleToAcceptance = id => {
    this.props.history.push(
      "/ecUserApprovalLog/queryCheckModal" + "/audit" + "/" + id
    );
  };
  //处理
  handleToDeal = id => {
    this.props.history.push(
      "/ecUserApprovalLog/queryAcceptanceModal" + "/audit" + "/" + id
    );
  };

  handleChangeTab = key => {
    this.activeTab = key;
    this.reloadTableData();
  };

  //导出
  handleToExport = () => {
    let key = this.activeTab;
    let params = "";
    let p = this["baseParams" + key];
    if (p.createTime) {
      p.createTimeStart = p.createTime[0]
        ? moment(p.createTime[0]).format("YYYY-MM-DD HH:mm:ss")
        : "";
      p.createTimeEnd = p.createTime[1]
        ? moment(p.createTime[1]).format("YYYY-MM-DD HH:mm:ss")
        : "";
      p.createTime = "";
    } else {
      p.createTimeStart = "";
      p.createTimeEnd = "";
    }

    for (let index in this["baseParams" + key]) {
      if (this["baseParams" + key][index]) {
        params += index + "=" + this["baseParams" + key][index] + "&";
      }
    }
    window.open(
      window.location.origin +
        "/api" +
        "/supplier/ecUserApprovalLog/bankExport" +
        "?" +
        params
    );
  };

  render() {
    return (
      <div>
        <Card bordered={false}>
          <BaseForm
            formList={this.formList()}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}
          />
          {/*<div className="toolbar">
            <AuthButton type="primary" onClick={this.handleToExport}>
              导出
            </AuthButton>
          </div>*/}
          <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
            <TabPane tab="全部" key="1">
              <BaseTable
                url="@/order/ecOrderClose/queryAllOrder"
                tableState={this.state.tableState1}
                resetTable={state => {
                  this.resetTable(state, "tableState1");
                }}
                baseParams={this.baseParams1}
                columns={this.columns("paramsOne")}
                scroll={{x:1800}}
              />
            </TabPane>
            <TabPane tab="待受理" key="2">
              <BaseTable
                url="@/order/ecOrderClose/queryAllOrder"
                tableState={this.state.tableState2}
                resetTable={state => {
                  this.resetTable(state, "tableState2");
                }}
                baseParams={this.baseParams2}
                columns={this.columns("paramsTwo")}
                scroll={{x:1800}}
              />
            </TabPane>
            <TabPane tab="受理中" key="4">
              <BaseTable
                url="@/order/ecOrderClose/queryAllOrder"
                tableState={this.state.tableState4}
                resetTable={state => {
                  this.resetTable(state, "tableState4");
                }}
                baseParams={this.baseParams4}
                columns={this.columns("paramsFour")}
                scroll={{x:1800}}
              />
            </TabPane>
            <TabPane tab="处理完成" key="3">
              <BaseTable
                url="@/order/ecOrderClose/queryAllOrder"
                tableState={this.state.tableState3}
                resetTable={state => {
                  this.resetTable(state, "tableState3");
                }}
                baseParams={this.baseParams3}
                columns={this.columns("paramsThree")}
                scroll={{x:1800}}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default queryAllPage;
