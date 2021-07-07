import { Card, Row, Col, Button, Modal, Switch, Tabs, Table } from 'antd'
import Album from 'uxcore-album';
import { tablePagination_, btnName_ } from '@/utils/config/componentDefine'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import BaseDetails from '@/components/baseDetails'
import BaseTable from '@/components/baseTable'
import BaseAffix from '@/components/baseAffix';
import less from './index.less'

import head_default from './head.png'
const confirm = Modal.confirm;

const { Photo } = Album;
const TabPane = Tabs.TabPane;
class Details extends React.Component {
	_isMounted = false

	state = {
		loading: false,
		// 个人信息
		dataSource: {},
		state: 0,
		// 图片
		citizenPhotoPath: "",
		citizenPhotoPath2: "",
		roleList: []
	}

	componentWillMount() {
		this._isMounted = true;
		// 进入页面加载数据
		const uuids = this.props.match.params.uuids;
		this.getData(uuids);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	getData(uuids) {
		let operId = "";
		const params = {};
		params.uuids = uuids;//申请uuids
		api.ajax("GET", "@/sso/ecSubAccount/getSubAccountApply", {
			...params
		}).then(r => {

			if (r && r.code == 200) {
				operId = r.data.createUser;
				this.setState({
					dataSource: r.data
				}, () => {
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
			}
		});

	}

	handleShowImg = (imgKeyList) => {
		let photoElm = [];
		let imgList = [];
		imgKeyList.map((item, i) => {
			if (this.state[item]) {
				imgList.push(this.state[item])
			}
		})
		if (imgList.length == 0) {
			Util.alert('暂无图片')
			return;
		}
		let baseUrl = SystemConfig.configs.resourceUrl;
		imgList.map((item, i) => {
			photoElm.push(
				<Photo
					src={baseUrl + item}
					key={i}
				/>,
			)
		})

		Album.show({
			photos: photoElm,
		});
	}

	handleBack = (e) => {
		e.preventDefault();
		this.props.history.goBack();
	}

	//渲染性别
	renderGenter = (value) => {
		if (value == 1) {
			return '男'
		} else if (value == 0) {
			return '女'
		} else {
			return null
		}
	}

	roleColumns = [{
		title: '项目编号',
		dataIndex: 'id',
		key: 'id',
		width: 120,
	}, {
		title: '职务',
		dataIndex: 'roleName',
		key: 'roleName',
		width: 180,
	}, {
		title: '创建时间',
		dataIndex: 'createTime',
		key: 'createTime',
		width: 180,
		render: (text, record, index) => {
			return <span>{moment(text).format("YYYY-MM-DD HH:mm")}</span>
		}
	}]

	render() {
		const pagination = ComponentDefine.getPagination_(this.state.dataSource, this.onChange, this.onShowSizeChange);

		return (
			<div>
				<Card bordered={false} className="mb10" title="帐号信息">
					<Row>
						<Col span={30}>
							<BaseDetails title="真实姓名" >
								{this.state.dataSource.username}
							</BaseDetails>
							<BaseDetails title="性别" >
								{this.renderGenter(this.state.dataSource.gender)}
							</BaseDetails>
							<BaseDetails title="手机号码" >
								{this.state.dataSource.phone}
							</BaseDetails>
							<BaseDetails title="电子邮箱" >
								{this.state.dataSource.email}
							</BaseDetails>
							<BaseDetails title="证件类型" >
								{this.state.dataSource.cardType == 2 ? '护照' : '身份证'}
							</BaseDetails>
							<BaseDetails title="证件号码">
								{Util.formatterData('cardId', this.state.dataSource.citizenCode)}
								<a href="javascript:void(0)" className={less.link} onClick={() => { this.handleShowImg(['citizenPhotoPath', 'citizenPhotoPath2']) }}>查看影像</a>
							</BaseDetails>
							<BaseDetails title="注册渠道" >
								{this.state.dataSource.cardType == 1 ? '自主注册' : '邀请注册'}
							</BaseDetails>
							<BaseDetails title="申请项目部" >
								{this.state.dataSource.orgSubPlatformUuids ? this.state.dataSource.orgSubPlatformUuids : "当前公司"}
							</BaseDetails>
							<BaseDetails title="申请理由" >
								{this.state.dataSource.applicationReason}
							</BaseDetails>
							<BaseDetails title="任职情况" >
								<Table rowKey="roleTable" className="roleTable"
									{...ComponentDefine.table_}
									pagination={pagination}
									rowSelection={null}
									scroll={{ x: 780 }}
									border={true}
									dataSource={this.state.roleList}
									columns={this.roleColumns} />
							</BaseDetails>
						</Col>
					</Row>
				</Card>
				<BaseAffix>
					<Button type="back" onClick={this.handleBack}>返回</Button>
				</BaseAffix>
			</div>
		)
	}
}

export default Details