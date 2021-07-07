import { Card, Row, Col, Form, Select, Radio, Button, Modal, DatePicker, Table } from 'antd'
import BaseTable from '@/components/baseTable'
import api from '@/framework/axios'//请求接口的封装
import { tablePagination_, btnName_ } from '@/utils/config/componentDefine'
import Util from '@/utils/util'
import Input from '@/components/baseInput'
import BaseAffix from '@/components/baseAffix';
import UploadImg from '@/components/uploadImg'
import less from './index.less'
import { connect } from 'react-redux';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Edit extends React.Component {

	_isMounted = false
	_userInfo = null
	_companyId = null

	state = {
		_loading: false,
		_roleList: [],
		userId: 0,
		roleSource: {
			list: []
		},
		userType: "3",//用户类型
		userPhotoPath: "",
		citizenPhotoPath: "",
		citizenPhotoPath2: "",
		rejectVisible: false,
		passVisible: false
	}

	componentWillMount() {
		this._userInfo = this.props.userInfo
		this.initDataFn();
	}

	componentWillUnmount() {
		this._isMounted = false;
		PubSub.unsubscribe(this.pubsub_userInfo);
	}

	//初始化数据
	initDataFn = () => {
		this._companyId = this._userInfo.companyId;
		this.getBaseData();
	}

	getBaseData = () => {
		let operId = "";
		const companyId = this._companyId;
		const params = {};
		params.uuids = this.props.match.params.uuids;//申请uuids
		api.ajax("GET", "@/sso/ecSubAccount/getSubAccountApply", {
			...params
		}).then(r => {
			if (r && r.code == 200) {
				this.setState({
					dataSource: r.data,
					userId: r.data.createUser
				}, () => {
					operId = r.data.createUser;
					if (r.data.gender == 1) {
						r.data.gender = "男"
					} else {
						r.data.gender = "女"
					}
					if (r.data.applicationType == 1) {
						r.data.applicationType = "自主注册"
					} else {
						r.data.applicationType = "邀请注册"
					}
					if (r.data.cardType == 0) {
						r.data.cardType = "身份证"
					} else {
						r.data.cardType = "护照"
					}

					//获取岗位
					api.ajax('GET', '@/sso/ecUser/queryUserRoleByUserId', {
						userId: operId,
						subPlatformId: 6
					}).then(r => {
						this.setState({
							roleList: r.data
						})
					}).catch(r => {
						Util.alert(r.msg, { type: 'error' })
					})
				});
				//获取备选角色列表
				api.ajax('GET', '@/sso/ecRole/page', {
					queryPurAdminFlag: 43200,
					type: "6",
					companyId
				}).then(r => {
					this.setState({
						_roleList: r.data.rows
					})
				}).catch(r => {
					Util.alert(r.msg, { type: "error" })
				})

				this.props.form.setFieldsValue({
					...r.data
				});
			}
		});
	}

	columns = [
		{
			title: '项目编号',
			dataIndex: 'id',
			key: 'id',
			width: "20%",
			render: (text, record, index) => {
				return <span title={index + 1}>{index + 1}</span>
			}
		},
		{
			title: '职务',
			dataIndex: 'roleName',
			key: 'roleName',
			width: "30%",
			render: (text, record, index) => {
				return <span title={text}>{text}</span>
			}
		}, {
			title: '创建时间',
			dataIndex: 'createTime',
			key: 'createTime',
			width: 180,
			render: (text, record, index) => {
				return <span>{moment(text).format("YYYY-MM-DD HH:mm")}</span>
			}
		}
	];


	//返回列表页
	handleBack = (e) => {
		e.preventDefault();
		this.props.history.goBack();
	}

	closeDetail = () => {
		if (this.state.rejectVisible) {
			this.setState({
				rejectVisible: false,
			});
		}
		if (this.state.passVisible) {
			this.setState({
				passVisible: false,
			});
		}
	}

	reject = () => {
		this.setState({
			rejectVisible: true
		});
	}

	pass = () => {
		this.setState({
			passVisible: true
		});
	}

	goReject = () => {
		let params = {}
		params.subPlatformId = 6;
		params.uuids = this.props.match.params.uuids;//修改时有主键
		params.status = 2;
		params.approvalReason = this.props.form.getFieldValue("approvalReason");

		api.ajax("POST", "@/sso/ecSubAccount/reviewSubAccount", {
			...params
		}, {
			headers: {
				change_content_type: true
			}
		}).then(r => {
			Util.alert(r.msg, {
				type: "success",
				callback: () => {
					this.setState({
						rejectVisible: false
					})
					this.props.history.goBack();
				}
			})
		}).catch(r => {
			Util.alert(r.msg, { type: 'error' })
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();

		this.props.form.validateFieldsAndScroll((errors, values) => {
			if (!!errors) {
				return;
			}

			let _this = this;
			confirm({
				title: '确认通过审核吗？',
				onOk() {
					_this.goPass(values);
				},
				onCancel() {
					Util.alert('已取消操作');
				},
			});
		})
	}

	goPass = (values) => {
		const params = {};
		params.subPlatformId = 6;
		params.uuids = this.props.match.params.uuids;//修改时有主键
		params.status = 1;
		params.roleId = values.roleId;
		params.createUser = this.state.userId;
		params.companyId = this._companyId;

		api.ajax("POST", "@/sso/ecSubAccount/reviewSubAccount", {
			...params
		}, {
			headers: {
				change_content_type: true
			}
		}).then(r => {
			Util.alert(r.msg, {
				type: "success",
				callback: () => {
					this.setState({
						rejectVisible: false
					})
					this.props.history.goBack();
				}
			})
		}).catch(r => {
			Util.alert(r.msg, { type: 'error' })
		});
	}

	render() {
		const { getFieldProps } = this.props.form;
		const pagination = ComponentDefine.getPagination_(this.state.roleSource, this.onChange, this.onShowSizeChange);
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 18 }
		}
		const formItemLayout2 = {
			labelCol: { span: 2 },
			wrapperCol: { span: 21 }
		}
		const span = 12;

		return (
			<div>
				<Card bordered={false} className="mb10" title="帐号信息">
					<Form>
						<row {...ComponentDefine.row_}>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="注册渠道"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`applicationType`)}
									/>
								</FormItem>
							</Col>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="申请项目部"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										value="当前公司"
									/>
								</FormItem>
							</Col>
						</row>
						<row {...ComponentDefine.row_}>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="真实姓名"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`username`)}
									/>
								</FormItem>
							</Col>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="性 别"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`gender`)}
									/>
								</FormItem>
							</Col>
						</row>
						<row {...ComponentDefine.row_}>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="手机号码"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`phone`)}
									/>
								</FormItem>
							</Col>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="电子邮箱"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`email`)}
									/>
								</FormItem>
							</Col>
						</row>
						<row {...ComponentDefine.row_}>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="证件类型"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`cardType`)}
									/>
								</FormItem>
							</Col>
							<Col span={span} className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout}
									label="证件号码"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`citizenCode`)}
									/>
								</FormItem>
							</Col>
						</row>
						<row {...ComponentDefine.row_}>
							<Col className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout2}
									label="申请理由"
								>
									<Input placeholder="-"
										maxLength={40} disabled={true}
										{...getFieldProps(`applicationReason`)}
									/>
								</FormItem>
							</Col>
						</row>
						<row {...ComponentDefine.row_}>
							<Col className="ant-form-item-margin-bottom">
								<FormItem
									{...formItemLayout2}
									label="任职情况"
								>
									<Table rowKey="roleTable" className="roleTable"
										{...ComponentDefine.table_}
										rowSelection={null}
										border={true}
										dataSource={this.state.roleList}
										columns={this.columns} />
								</FormItem>
							</Col>
						</row>
					</Form>
				</Card>
				<BaseAffix>
					<Button type="back" onClick={this.handleBack} className="mr10">返回</Button>
					<Button type="back" onClick={this.reject} className="mr10">驳回</Button>
					<Button type="primary" onClick={this.pass} className="mr10">通过</Button>
				</BaseAffix>
				<Modal
					title="权限配置"
					wrapClassName="org_modal"
					visible={this.state.passVisible}
					width={550}
					onCancel={this.closeDetail}
					footer={[
						<Button type="back" onClick={this.closeDetail}>关闭</Button>,
						<Button type="primary" onClick={this.handleSubmit}>通过</Button>
					]}
				>
					<Row {...ComponentDefine.row_}>
						<Col span={24} className="ant-form-item-margin-bottom">
							<FormItem
								{...formItemLayout}
								label="选择角色"
							>
								<Select style={{ width: 400 }}
									placeholder="请选择角色"
									{...getFieldProps('roleId', {
										rules: [
											{ required: true, message: '请选择角色' },
										],
									})}
								>
									{Util.getOptionList(this.state._roleList, 'id', 'name')}
								</Select>
							</FormItem>
						</Col>
					</Row>
				</Modal>
				<Modal
					title="审批意见"
					wrapClassName="reject_modal"
					visible={this.state.rejectVisible}
					width={550}
					onCancel={this.closeDetail}
					footer={[
						<Button type="back" onClick={this.closeDetail}>关闭</Button>,
						<Button type="primary" onClick={this.goReject}>驳回</Button>
					]}
				>
					<Row {...ComponentDefine.row_}>
						<Col span={24}>
							<FormItem>
								<Input placeholder="请输入审批意见"
									type="textarea" rows={5} size='large' maxLength={200}
									{...getFieldProps(`approvalReason`)}
								/>
							</FormItem>
						</Col>
					</Row>
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		userInfo: state.authReducer.userInfo || {}
	}
}

export default Form.create()(connect(mapStateToProps)(Edit))