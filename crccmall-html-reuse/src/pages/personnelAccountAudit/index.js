import { Card, Modal, Form, Tabs, Button, Input, Table, Pagination } from 'antd'
import AuthButton from '@/components/authButton'
import { tablePagination_, btnName_ } from "@/utils/config/componentDefine"
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import BaseForm from '@/components/baseForm'
import { connect } from 'react-redux';
import BaseTable from '@/components/baseTable'
import less from './index.less'
import './index.css'
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class Audit extends React.Component {

	_isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
	_userInfo = null

	state = {
		tabsKey: '0',//tabs查询条件
		loading: false,
		roleList: [],
		// 表格数据
		tableState0: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState1: 0,
		tableState2: 0,
		tableState3: 0
	}

	formList = [{
		type: 'INPUT',
		field: 'searchInput',
		label: '员工姓名',
		placeholder: '请输入姓名、手机号、邮箱'
	}, {
		type: 'RANGE',
		field: 'times',
		label: '申请时间',
		placeholder: '请选择筛选时间段'
	}, {
		type: 'SELECT',
		field: 'applicationType',
		label: '申请方式',
		placeholder: '请选择',
		list: [{ id: '1', value: '自主注册' }, { id: '2', value: '邀请注册' }]
	}, {
		type: 'INPUT',
		field: 'approvalUser',
		label: '审核员',
		placeholder: '请输入姓名'
	}]

	importantFilter = ['searchInput', 'times']

	componentWillMount() {
		this._isMounted = true;


		this._userInfo = this.props.userInfo
		this.initDataFn();
	}

	componentWillUnmount() {
		this._isMounted = false;
		PubSub.unsubscribe(this.pubsub_userInfo);
	}

	initDataFn = () => {
		this.baseParams1 = {
			...this.baseParams1,
			companyId: this._userInfo.companyId
		}
		this.baseParams2 = {
			...this.baseParams2,
			companyId: this._userInfo.companyId
		}
		this.baseParams3 = {
			...this.baseParams3,
			companyId: this._userInfo.companyId
		}
		this.baseParams0 = {
			...this.baseParams0,
			companyId: this._userInfo.companyId
		}
		// 进入页面加载数据
		this.handelToLoadTable(1, "tableState0");
	}

	handleFilter = (params, isSend = true) => {
		let key = this.state.tabsKey;
		//根据formList生成的表单输入条件过滤
		let createTimeStartStr, createTimeEndStr;
		if (params.times) {
			createTimeStartStr = params.times[0] ? moment(params.times[0]).format('YYYY-MM-DD') : '';
			createTimeEndStr = params.times[1] ? moment(params.times[1]).format('YYYY-MM-DD') : '';
		}
		var phonereg = /^[1][0-9]{10}$/;
		var emailreg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if (phonereg.test(params.searchInput) && !emailreg.test(params.searchInput)) {
			params.phone = params.searchInput;
			params.email = "";
			params.username = "";
		} else if (!phonereg.test(params.searchInput) && emailreg.test(params.searchInput)) {
			params.email = params.searchInput;
			params.phone = "";
			params.username = "";
		} else {
			params.username = params.searchInput;
			params.phone = "";
			params.email = "";
		}
		params.searchInput = "";

		this['baseParams' + key] = {
			...this['baseParams' + key],
			...params,
			createTimeStartStr,
			createTimeEndStr
		}

		if (isSend) {
			this.reloadTableData();
		}
	}

	handleToEdit = (uuids) => {
		this.props.history.push(this.props.history.location.pathname + '/edit' + '/' + uuids);
	}

	handleToDetails = (uuids) => {
		this.props.history.push(this.props.history.location.pathname + '/details' + '/' + uuids);
	}

	baseParams1 = {
		subPlatformId: 6,
		status: 1
	}

	baseParams2 = {
		subPlatformId: 6,
		status: 2
	}
	baseParams3 = {
		subPlatformId: 6,
		status: 3
	}
	baseParams0 = {
		subPlatformId: 6,
		status: ""
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
		let key = this.state.tabsKey;
		if (this._userInfo) {
			this.handelToLoadTable(state, 'tableState' + key);
		}
	}

	tabsChange = (key) => {
		this.setState({
			tabsKey: key
		}, () => {
			this.reloadTableData();
		})

	}
	columns = [{
		title: '姓名',
		dataIndex: 'username',
		key: 'username',
		sorter: true,
		width: 150,
		render: (text) => {
			return <span title={text}>{text}</span>
		}
	}, {
		title: '申请方式',
		dataIndex: 'applicationType',
		key: 'applicationType',
		width: 100,
		render: (text) => {
			if (text != null) {
				if (text == 1) {
					return <span title="自主注册">自主注册</span>
				} else {
					return <span title="邀请注册">邀请注册</span>
				}
			}
		}
	}, {
		title: '审核人',
		dataIndex: 'approvalUser',
		key: 'approvalUser',
		sorter: true,
		width: 100,
		render: (text) => {
			return <span title={text}>{text}</span>
		}
	}, {
		title: '审核时间',
		dataIndex: 'approvalTime',
		key: 'approvalTime',
		sorter: true,
		className: 'text_right',
		width: 150,
		render: (text) => {
			return <span title={text ? moment(text).format("YYYY-MM-DD") : ""}>{text ? moment(text).format("YYYY-MM-DD") : "--"}</span>
		}
	}, {
		title: '申请时间',
		dataIndex: 'createTime',
		key: 'createTime',
		className: 'text_right',
		sorter: true,
		width: 150,
		render: (text) => {
			return <span title={text ? moment(text).format("YYYY-MM-DD") : ""}>{text ? moment(text).format("YYYY-MM-DD") : "--"}</span>
		}
	}, {
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		render: (text) => {
			if (text != null) {
				if (text == 3) {
					return <span title="待审核" className="yellow">待审核</span>
				} else if (text == 2) {
					return <span title="驳回" className="red">驳回</span>
				} else if (text == 1) {
					return <span title="通过" className="green">通过</span>
				} else {
					return <span title="其他">其他</span>
				}
			}
		}
	}, {
		title: '操作',
		key: 'cz',
		width: 100,
		render: (text, record) => {
			if (record.status == 3 && this.state.tabsKey == 3) {
				return (<span>
					<a onClick={() => this.handleToDetails(record.uuids)} style={{ marginRight: '10px' }}>查看</a>
					<a onClick={() => this.handleToEdit(record.uuids)}>审核</a>
					{/**
					 * <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</AuthButton>
					<AuthButton elmType="a" onClick={() => this.handleToEdit(record.uuids)}>审核</AuthButton>**/}
				</span>)
			} else {
				return (
					<span>
						{/**
				 * <AuthButton elmType="a" onClick={() => this.handleToDetails(record.uuids)}>查看</AuthButton>
				 * **/}
						<a onClick={() => this.handleToDetails(record.uuids)}>查看</a>
					</span>
				)
			}

		}
	}];


	render() {
		return (
			<div>
				<BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
				<Card>
					<Tabs activeKey={this.state.tabsKey} defaultActiveKey="0" onChange={this.tabsChange}>
						<TabPane tab="全部" key="0">
							<BaseTable
								sort_key='querysort'
								res_key='rows'
								notInit={true}
								url="@/sso/ecSubAccount/page"
								tableState={this.state.tableState0}
								resetTable={(state) => { this.resetTable(state, 'tableState0') }}
								baseParams={this.baseParams0}
								columns={this.columns}
								indexkeyWidth={50}
							/>
						</TabPane>
						<TabPane tab="待审核" key="3">
							<BaseTable
								sort_key='querysort'
								res_key='rows'
								notInit={true}
								url="@/sso/ecSubAccount/page"
								tableState={this.state.tableState3}
								resetTable={(state) => { this.resetTable(state, 'tableState3') }}
								baseParams={this.baseParams3}
								columns={this.columns}
								indexkeyWidth={50}
							/>
						</TabPane>
						<TabPane tab="通过" key="1">
							<BaseTable
								sort_key='querysort'
								res_key='rows'
								notInit={true}
								url="@/sso/ecSubAccount/page"
								tableState={this.state.tableState1}
								resetTable={(state) => { this.resetTable(state, 'tableState1') }}
								baseParams={this.baseParams1}
								columns={this.columns}
								indexkeyWidth={50}
							/>
						</TabPane>
						<TabPane tab="驳回" key="2">
							<BaseTable
								sort_key='querysort'
								res_key='rows'
								notInit={true}
								url="@/sso/ecSubAccount/page"
								tableState={this.state.tableState2}
								resetTable={(state) => { this.resetTable(state, 'tableState2') }}
								baseParams={this.baseParams2}
								columns={this.columns}
								indexkeyWidth={50}
							/>
						</TabPane>
					</Tabs>
				</Card>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		userInfo: state.authReducer.userInfo || {}
	}
}

export default Form.create()(connect(mapStateToProps)(Audit))