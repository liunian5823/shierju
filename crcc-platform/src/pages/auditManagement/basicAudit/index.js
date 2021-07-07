import { Card, Button, Tabs, Alert } from 'antd';
import api from '@/framework/axios';
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {systemConfigPath} from "@/utils/config/systemConfig";
import less from './index.less';
import '@/style/reset_antd.css';
import noAuditImg from './img/noAudit.png';
import auditedImg from './img/audited.png';
import workAuditedImg from './img/workAudited.png';
import monthAuditedImg from './img/monthAudited.png';
import Util from '@/utils/util';

const TabPane = Tabs.TabPane;

class basicAudit extends React.Component {
  state = {
    loading: false,
    tableState1: 0,
    tableState2: 0,
    tableState3: 0,
    tableState4: 0,
    totalSupplierQuantity: 0,
	waitConfirmNum: 0,//待审核数量
	currentUserDealNum: 0,//累计处理工单数量
	currentUserDealInWeekNum: 0,//本周处理数量
	currentUserDealInMonthNum: 0,//本月处理数量
	
  }
	
  _isMounted = false;
  activeTab = 1;

  importantFilter = [ 'workOrdersCode','applicationUserName']

  formList = () => [
    {
      type: 'INPUT',
      field: 'workOrdersCode',
      label: '工单号',
      placeholder: '请输入工单号'
    },
	{
	  type: 'INPUT',
	  field: 'applicationUserName',
	  label: '申请人姓名',
	  placeholder: '请输入申请人姓名或手机号'
	},
    {
      type: 'INPUT',
      field: 'workOrdersTitle',
      label: '供应商名称',
      placeholder: '请输入供应商名称'
    },
    {
      type: 'SELECT',
      field: 'isMember',
      label: '企业类型',
      list: [
        {
          id: 1,
          value: '内部单位'
        },
        {
          id: 2,
          value: '外部单位'
        }
      ]
    },
    {
      type: 'INPUT',
      field: 'reviewUser',
      label: '审核人',
      placeholder: '请输入审核人'
    },
    {
      type: 'RANGETIME',
      field: 'reviewTime',
      label: '审核时间',
      placeholder: '请筛选时间段'
    },
	{
      type: 'RANGETIME',
      field: 'applicationTime',
      label: '申请时间',
      placeholder: '请筛选时间段'
    }
  ]

  handleFilter = (p, isSend = true) => {

	let applicationTimeStartStr, applicationTimeEndStr, reviewTimeStartStr, reviewTimeEndStr
    if (p.applicationTime) {
      applicationTimeStartStr = p.applicationTime[0] ? moment(p.applicationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      applicationTimeEndStr = p.applicationTime[1] ? moment(p.applicationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
        p.applicationTime = null;
    }

    if (p.reviewTime) {
      reviewTimeStartStr = p.reviewTime[0] ? moment(p.reviewTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      reviewTimeEndStr = p.reviewTime[1] ? moment(p.reviewTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
        p.reviewTime = null;
    }

    let key = this.activeTab;
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      ...p,
      applicationTimeStartStr,
      applicationTimeEndStr,
      reviewTimeStartStr,
      reviewTimeEndStr
    }
    if (isSend) {
      this.reloadTableData();
    }
  }
  componentDidMount() {
  }
  componentWillMount() {
    this._isMounted = true;
    this.getStatisticNum();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  baseParams1 = {
	  workOrdersType: 1,
	  workOrdersTypeTwo: 2
  }
  baseParams2 = {
    workOrdersType: 1,
	workOrdersTypeTwo: 2,
	workOrdersState: 1
  }
  baseParams3 = {
	workOrdersType: 1,
	workOrdersTypeTwo: 2,
    workOrdersState: 2
  }
  baseParams4 = {
	workOrdersType: 1,
	workOrdersTypeTwo: 2,
    workOrdersState: 3
  }
  
  getStatisticNum = () => {
	  let paramMap = {
	  			firstType:"firstType"
	  		}
    api.ajax('POST', '@/platform/workOrders/getStatisticNum',{
		...paramMap
	}).then(r => {
	  if (!this._isMounted) {
	    return;
	  }
      if (r.code == "200" || r.code == 200) {
        this.setState({
  		  waitConfirmNum: r.data.waitConfirmNum,//待审核数量
  		  currentUserDealNum: r.data.currentUserDealNum,//累计处理工单数量
  		  currentUserDealInWeekNum: r.data.currentUserDealInWeekNum,//本周处理数量
  		  currentUserDealInMonthNum: r.data.currentUserDealInMonthNum//本月处理数量
  	  });
      }
    })
  } 
  
  columns = (params) => {
      return [
        {
          title: '工单号',
          dataIndex: 'workOrdersCode',
          key: 'indexkey',
          witdh: 110
        },
		{
		  title: '级别',
		  dataIndex: 'level',
		  key: 'level',
		  witdh: 120,
		  render: (text, record) => {
			  //单位级别 1 股份公司  2 局级公司  3 处级公司
			if(text == 1 || text == "1"){
				return "股份公司";
			} else if(text == 2 || text == "2") {
				return "局级公司";
			}  else if(text == 3 || text == "3") {
				return "处级公司";
			} 
			return '-';
		  }
		},
		{
		  title: '企业类型',
		  dataIndex: 'enterpriseType',
		  key: 'enterpriseType',
		  witdh: 110,
		  render: (text, record) => {
			if(text == 1 || text == "1"){
				return "内部企业";
			} else if(text == 2 || text == "2") {
				return "外部企业";
			} 
		  }
		},
		{
          title: '公司名称',
          dataIndex: 'workOrdersTitle',
          key: 'workOrdersTitle',
          witdh: 180,
		  render: (text, record) => {
			if(text && text.length > 20){
				return text?text.substr(0,15)+"...":'-';
			} 
			return text;
		  }
        },
        {
          title: '营业执照号',
          dataIndex: 'businessLicense',
          key: 'businessLicense',
          witdh: 120
        },
		{
		  title: '申请人姓名',
		  dataIndex: 'applicationUserName',
		  key: 'applicationUserName',
		  witdh: 120
		},
		{
		  title: '申请人手机号',
		  dataIndex: 'applicationUserPhoneNo',
		  key: 'applicationUserPhoneNo',
		  witdh: 120
		},
        {
          title: '申请时间',
          dataIndex: 'applicationTime',
          key: 'applicationTime',
          witdh: 160,
          sorter: true,
          render: (text, record) => {
            return text? text.substr(0, 19): '-';
          }
        },
		{
		  title: '状态',
		  dataIndex: 'workOrdersState',
		  key: 'workOrdersState',
		  witdh: 90,
		  render: (text, record) => {
			if(text == 1 || text == "1"){
				return <span style={{color:'#E96C47'}}>待审核</span>;
			} else if(text == 2 || text == "2") {
				return <span style={{color:'#4CD91F'}}>通过</span>;
			} else if(text == 3 || text == "3") {
				return <span style={{color:'#DD2F26'}}>驳回</span>;
			}
		  }
		},
        {
          title: '审核人',
          dataIndex: 'reviewUser',
          key: 'reviewUser',
          witdh: 120,
		  render: (text, record) => {
			if(text){
				return text;
			} else {
				return "-";
			}
		  }
        },
        {
          title: '审核时间',
          dataIndex: 'reviewTime',
          key: 'reviewTime',
          witdh: 160,
          sorter: true,
		  render: (text, record) => {
			if(text){
				return text?text.substr(0,10):'';
			} else {
				return "-";
			}
		  }
        },
        {
          title: '操作',
          dataIndex: 'x',
          witdh: 80,
          key: 'x',
          render: (text, record) => {
            if (record.workOrdersState == "1" || record.workOrdersState == 1 ) {
				return (
				  <span>
				    <AuthButton elmType="a" onClick={() => { this.handleToDetails(record.companyUuids+"!!"+record.uuids, record.workOrdersState) }}>详情</AuthButton>
				    <span className="ant-divider"></span>
				    <AuthButton elmType="a" onClick={() => this.handleToAudit(record.companyUuids+"!!"+record.uuids)}>审核</AuthButton>
                    <span className="ant-divider"></span>
                    <AuthButton elmType="a" onClick={() => this.handleToAuditMatic(record.companyUuids)}>检查</AuthButton>
				  </span>
				)
            } else {
              return <AuthButton elmType="a" onClick={() => { this.handleToDetails(record.companyUuids+"!!"+record.uuids, record.workOrdersState) }}>详情</AuthButton>
            }
          }
        }
      ]
  }
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }
  resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  reloadTableData(state = 1) {
    let key = this.activeTab;
    this.handelToLoadTable(state, 'tableState' + key);
  }
  handleToDetails = (id, workOrdersState) => {
    window.open(window.location.href.split('#/')[0]+'#' + this.props.history.location.pathname + '/details' + '/' + id + '/' + workOrdersState);
  }
  handleToAudit = (id) => {
    this.props.history.push(this.props.history.location.pathname + '/audit' + '/' + id)
  }
  handleToAuditMatic = (companyUUIds) =>{
      api.ajax("GET", "@/platform/workOrders/auditMatic", {
          companyUUIds: companyUUIds
      }).then(r => {
          Util.alert(r.msg, { type: 'success' });
      }).catch(r => {
          Util.alert(r.msg, { type: 'error' });
      })
  }

  handleChangeTab = (key) => {
    this.activeTab = key;
    this.reloadTableData();
  }
	
	

  //导出
  handleToExport = () => {
    let key = this.activeTab;
    let params = '';
    let p = this['baseParams'+key];
    if (p.applicationTime) {
      p.applicationTimeStart = p.applicationTime[0] ? moment(p.applicationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      p.applicationTimeEnd = p.applicationTime[1] ? moment(p.applicationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
      p.applicationTime = '';
    } else {
      p.applicationTimeStart = '';
      p.applicationTimeEnd = '';
    }
    for (let index in this['baseParams'+key]) {
      if (this['baseParams'+key][index]) {
        params += index + '=' + this['baseParams'+key][index] + '&'
      }
    }
    // selectType 区分 子平台还是公司请求 = company 为公司  = sub为 子平台 必传
    // exportName 问导出文件名 后台无法指定文件名 前端传递 必传 可传递 菜单名
    window.open(
      window.location.origin +
      '/api' +
      '/platform/workOrders/export' +
      '?selectType=company&exportName=基础审核导出&' + params
    )
  }
  
  renderTongJi = () =>{
	  
	  return (<div className={less.tongji}>
			<div className={less.box} style={{width: '24%',marginRight: '1%'}}>
				<div className={less.tonjiIcon}><img src={noAuditImg}/></div>
				<div className={less.tonjitxt}>
					<p><span>待审核</span><a>查看报表</a></p>
					<p><span className={less.number}>{this.state.waitConfirmNum}任务</span></p>
				</div>
			</div>
			<div className={less.box} style={{width: '24%',marginRight: '1%'}}>
				<div className={less.tonjiIcon}><img src={auditedImg}/></div>
				<div className={less.tonjitxt}>
					<p><span>累计处理</span><a>查看报表</a></p>
					<p><span className={less.number}>{this.state.currentUserDealNum}任务</span></p>
				</div>
			</div>
			<div className={less.box} style={{width: '24%',marginRight: '1%'}}>
				<div className={less.tonjiIcon}><img src={workAuditedImg}/></div>
				<div className={less.tonjitxt}>
					<p><span>本周完成任务数</span><a>查看报表</a></p>
					<p><span className={less.number}>{this.state.currentUserDealInWeekNum}任务</span></p>
				</div>
			</div>
			<div className={less.box} style={{width: '25%'}}>
				<div className={less.tonjiIcon}><img src={monthAuditedImg}/></div>
				<div className={less.tonjitxt}>
					<p><span>本月完成任务数(1日至今日)</span><a>查看报表</a></p>
					<p><span className={less.number}>{this.state.currentUserDealInMonthNum}任务</span></p>
				</div>
			</div>
		</div>);
  }

  render() {
    return (
      <div className={"abc"}>
		<Card bordered={false} className={[less.tongjiCard, "tongjiCard"].join(' ')}>{this.renderTongJi()}</Card>
        <Card bordered={false}>
          <BaseForm
            formList={this.formList()}
            importantFilter={this.importantFilter}
            filterSubmit={this.handleFilter}
          ></BaseForm>
          <div className="toolbar">
            <Button type="primary" onClick={this.handleToExport}>导出</Button>
          </div>
          <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
            <TabPane tab="全部" key="1">
              <BaseTable
                url='@/platform/workOrders/getEcCompanyWorkOrdersByPage'
                tableState={this.state.tableState1}
                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                baseParams={this.baseParams1}
                columns={this.columns("paramsOne")} />
            </TabPane>
            <TabPane tab="待审核" key="2">
              <BaseTable
                url='@/platform/workOrders/getEcCompanyWorkOrdersByPage'
                tableState={this.state.tableState2}
                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                baseParams={this.baseParams2}
                columns={this.columns("paramsTwo")} />
            </TabPane>
            <TabPane tab="通过" key="3">
              <BaseTable
                url='@/platform/workOrders/getEcCompanyWorkOrdersByPage'
                tableState={this.state.tableState3}
                resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                baseParams={this.baseParams3}
                columns={this.columns("paramsThree")} />
            </TabPane>
			<TabPane tab="驳回" key="4">
			  <BaseTable
			    url='@/platform/workOrders/getEcCompanyWorkOrdersByPage'
			    tableState={this.state.tableState4}
			    resetTable={(state) => { this.resetTable(state, 'tableState4') }}
			    baseParams={this.baseParams4}
			    columns={this.columns("paramsThree")} />
			</TabPane>
          </Tabs>
        </Card>
      </div>
    )
  }
}

export default basicAudit