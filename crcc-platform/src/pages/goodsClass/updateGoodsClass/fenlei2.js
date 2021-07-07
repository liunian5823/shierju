import React from 'react';
import { Card, Row, Col, Form, Tree, Button, Input, Breadcrumb, Modal} from 'antd';
import Util from '@/utils/util'
import api from '@/framework/axios'//请求接口的封装
import less from './fenlei1.less'

let Search = Input.Search;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const searchInput = "searchInput2";
export default class Fenlei extends React.Component {
	constructor(props){
		super(props);
	}

	_isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
	_userInfo = null
	state = {
		loading: false,
		commonUseGoodsCLass: [],	//常用分类
		// 表格数据
		tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		commonUseGoodsCLassId:null,
		btnPrimary:null,
		noBtnPrimary: less.noBtnPrimary,
		// 渲染树
		tree1: [],
		tree2: [],
		tree3: [],
		// 选择树
		treeChecked1: { checked: [], halfChecked: [] },
		treeChecked2: { checked: [], halfChecked: [] },
		treeChecked3: { checked: [], halfChecked: [] },
		treeSelect1: [],
		treeSelect2: [],
		treeSelect3: [],
		//分类选中的样式
		goodsClassSelected: less.goodsClassSelected,
		//保存当前选中的一级、二级、三级分类id和name
		tempGoodsClass: {
			goodsClass1:null,
			goodsClassName1:null,
			goodsClass2:null,
			goodsClassName2:null,
			goodsClass3:null,
			goodsClassName3:null,
		}

	}

	componentWillMount() {
		this._isMounted = true;
		this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
			if (this._userInfo || !obj) { return false }
			this._userInfo = obj;
			// 获得用户基本信息后执行加载回调
			this.initDataFn();
		}.bind(this));//
		PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
	}

	componentWillUnmount() {
		this._isMounted = false;
		PubSub.unsubscribe(this.pubsub_userInfo);
	}

	initDataFn = () => {
		// 进入页面加载常用分类
		// this.getCommonUseGoodsClass();
		//进入页面获取一级分类
		this.getGoodsClassList(-1, 1);
		this.handleReSelectGoodsClass();
	}

	//当重新选择分类时调用
	handleReSelectGoodsClass =()=>{
		let _currentGoodsClass = this.props.currentGoodsClass;
		if(!(_currentGoodsClass === undefined)){
			this.getCommonUseGoodsClass2(
				_currentGoodsClass.goodsClass1,
				_currentGoodsClass.goodsClass2,
				_currentGoodsClass.goodsClass3,
				2,
				_currentGoodsClass.goodsClassName1,
				_currentGoodsClass.goodsClassName2,
				_currentGoodsClass.goodsClassName3
			);
		}
	}
	//将当前的商品分类传给父组件
	handPublish = () =>{
		this.props.handleGetGoodsClassOld(this.state.tempGoodsClass);
	}


	/**
	 * 通过分类名称搜索
	 */
	searchGoodsClass = () =>
		<div className={less.leimucc}>
			<InputGroup>
				<Input placeholder="请输入类目名称" id={searchInput}/>
				<div className="ant-input-group-wrap">
					<Button type="primary" onClick={this.getSearchInput.bind(this)}>找分类</Button>
				</div>
			</InputGroup>
		</div>
	//发送请求查询
	getSearchInput = () =>{
		//获取searchInput输入的内容
		let _search_input = $("#searchInput2").val();
		if(_search_input.trim() == ""){
			Util.alert("请输入类目名称");
			return;
		}
		api.ajax('GET', '@/platform/ecGoodsClass/getGoodsClassByName',
			{
				goodsClassName: _search_input,
				ver:1
			}
		).then(r =>{
			//获取查询的分类的level
			if(r.data.level ==1){
				this.setState({
					//设置一级分类的id和name
					tempGoodsClass: {
						goodsClass1: r.data.level1Id,
						goodsClassName1: r.data.level1Name,
						goodsClass2:null,
						goodsClassName2:null,
						goodsClass3:null,
						goodsClassName3:null,
					},
					tree2: [],
					tree3: []
				})
				return;
			}
			//通过一级分类的id查询所有的二级分类给tree2
			this.getCommonUseGoodsClass2(r.data.level1Id, r.data.level2Id, r.data.level3Id, 2, r.data.level1Name, r.data.level2Name, r.data.level3Name);
		}).catch(r => {
			this.setState({
				loading: false
			})
			Util.alert('暂未查询到该类目', { type: 'error' });
			return;
		})
	}


	/**
	 * 点击常用分类获取数据
	 * @param pid1
	 * @param pid2
	 * @param pid3
	 * @param level
	 * @param name1
	 * @param name2
	 * @param name3
	 */
	getCommonUseGoodsClass2 = (pid1, pid2, pid3, level, name1, name2, name3) =>{
		let pid;
		if(level == 2) pid=pid1;
		if(level == 3) pid=pid2;
		if(level == 0) {
			return;
		};

		api.ajax('GET', '@/platform/ecGoodsClass/getGoodsClassList',
			{
				companyId: this._userInfo.companyId,
				goodsClassPId: pid,
				level: level,
				ver:1
			}
		).then(r => {
			if(level == 2){
				this.setState({
					tree2: r.data,
					tree3: [],
					//设置一级分类的id
					tempGoodsClass:{
						goodsClass1: pid1,
						goodsClassName1: name1,
						goodsClass2: null,
						goodsClassName2:null,
						goodsClass3: null,
						goodsClassName3:null
					}

				})
			}
			if(level == 3){
				this.setState({
					tree3: r.data,
					tempGoodsClass:{
						goodsClass1:this.state.tempGoodsClass.goodsClass1,
						goodsClassName1: this.state.tempGoodsClass.goodsClassName1,
						goodsClass2: pid2,
						goodsClassName2: name2,
						goodsClass3: null,
						goodsClassName3: null
					}
				})
			}
			level ++;
			if(level == 4){
				this.setState({
					tempGoodsClass:{
						goodsClass1:this.state.tempGoodsClass.goodsClass1,
						goodsClassName1: this.state.tempGoodsClass.goodsClassName1,
						goodsClass2:this.state.tempGoodsClass.goodsClass2,
						goodsClassName2: this.state.tempGoodsClass.goodsClassName2,
						goodsClass3: pid3,
						goodsClassName3: name3
					}
				})
				return;
			}
			this.getCommonUseGoodsClass2(pid1, pid2, pid3, level, name1, name2, name3);
			//
		}).catch(r => {})
	}

	/**
	 * 处理分类点击事件
	 * @param pid
	 * @param level
	 * @param goodsClassName
	 */
	handleClickGoodsClass = (pid, level, goodsClassName) =>{
		//删除掉常用分类保存的id
		/*this.setState({
			commonUseGoodsCLassId:null
		})*/
		if(level == 0){
			this.setState({
				tempGoodsClass:{
					goodsClass1:this.state.tempGoodsClass.goodsClass1,
					goodsClassName1:this.state.tempGoodsClass.goodsClassName1,
					goodsClass2:this.state.tempGoodsClass.goodsClass2,
					goodsClassName2:this.state.tempGoodsClass.goodsClassName2,
					goodsClass3: pid,
					goodsClassName3: goodsClassName
				}
			})
			return ;
		}
		if(level == 2){	//点击一级分类
			this.setState({
				//设置一级分类的id
				tempGoodsClass:{
					goodsClass1: pid,
					goodsClassName1: goodsClassName,
					goodsClass2:null,
					goodsClassName2:null,
					goodsClass3:null,
					goodsClassName3:null,
				},
				tree2: [],
				tree3: []
			})
		}
		if(level == 3){	//点击二级分类\
			let{tempGoodsClass} = this.state;
			this.setState({
				tempGoodsClass:{
					goodsClass1:this.state.tempGoodsClass.goodsClass1,
					goodsClassName1:this.state.tempGoodsClass.goodsClassName1,
					goodsClass2: pid,
					goodsClassName2: goodsClassName,
					goodsClass3: null,
					goodsClassName3: null
				},
				tree3: []
			})
		}
		this.getGoodsClassList(pid,level, goodsClassName);
	}

	/**
	 * 将选中的分类放置到当前选择分类中
	 */
	showSelectedGoodsClass = () => {
		if(this.state.tempGoodsClass.goodsClassName1 == null) return(<span className={less.currentSelectedGoodsClass}></span>)
		if(this.state.tempGoodsClass.goodsClassName2 == null) return(<span className={less.currentSelectedGoodsClass}>{this.state.tempGoodsClass.goodsClassName1}&nbsp;&gt;&nbsp;</span>)
		if(this.state.tempGoodsClass.goodsClassName3 == null) return(<span className={less.currentSelectedGoodsClass}>{this.state.tempGoodsClass.goodsClassName1}&nbsp;&gt;&nbsp;{this.state.tempGoodsClass.goodsClassName2}&nbsp;&gt;&nbsp;</span>)
		return(<span className={less.currentSelectedGoodsClass}>{this.state.tempGoodsClass.goodsClassName1}&nbsp;&gt;&nbsp;{this.state.tempGoodsClass.goodsClassName2}&nbsp;&gt;&nbsp;{this.state.tempGoodsClass.goodsClassName3}</span>)
	}

	/**
	 * 根据商品分类和商品的pid查询商品分类列表
	 * @param pid	点击分类的id
	 * @param level	要查询分类的pid是当前点击分类的id的level
	 */
	getGoodsClassList = (pid, level, goodsClassName) =>{
		api.ajax('GET', '@/platform/ecGoodsClass/getGoodsClassList',
			{
				companyId: this._userInfo.companyId,
				goodsClassPId: pid,
				level: level,
				ver:1
			}
		).then(r => {
			//数据是r.data
			if(!this._isMounted)
				return;
			if(level == 1){
				this.setState({
					tree1: r.data
				})
			}
			if(level == 2){
				this.setState({
					tree2: r.data,
				})
			}
			if(level == 3){
				this.setState({
					tree3: r.data,
				})
			}

		}).catch(r => {})
	}
	//查询常用分类数据
	/*getCommonUseGoodsClass = () => {
		api.ajax(
			'GET','@/merchandise/ecGoodsClass/getUseGoodsClass',
			{
				companyId: this._userInfo.companyId
			}
		).then(r => {
			//数据是r.data
			if(!this._isMounted)
				return;
			this.setState({
				commonUseGoodsCLass: r.data
			})
		}).catch(r => {})
	}*/
	/*常用分类*/
	//点击常用分类触发事件
	handleCommonUseGoodsClass = (levelId1, name1, levelId2, name2, levelId3, name3) => {
		//debugger;
		//添加样式
		this.setState({
			commonUseGoodsCLassId: levelId3,
			btnPrimary: less["click-btn-primary"],
		})
		//通过选择的常用分类查询
		this.getCommonUseGoodsClass2(levelId1, levelId2, levelId3, 2, name1, name2, name3);
	}

	render(){
		//发布信息
		{this.handPublish()}
		return(
			<div className={less.rightClass}>
				<div className={less["cy-fl"]}>
					<Card bordered={false} title="旧分类选择" extra={this.searchGoodsClass()}>
						<Row className={less.xzmingcheng}>
							<Col span="8" >
								<h4>一级分类</h4>
								<div className={less.middleGoodsClass}>
									<ul>
									{
										this.state.tree1.map((item, index) =>{
											return (
												<li className={this.state.tempGoodsClass.goodsClass1==item.id?this.state.goodsClassSelected:null} id={item.id} onClick={this.handleClickGoodsClass.bind(this, item.id, 2, item.name)}>{item.name}</li>
											)
										})
									}
									</ul>
								</div>
							</Col>
							<Col span="8">
								<h4>二级分类</h4>
								<div className={less.middleGoodsClass}>
									<ul>
										{
											this.state.tree2.map((item, index) =>{
												return (
													<li className={this.state.tempGoodsClass.goodsClass2==item.id?this.state.goodsClassSelected:null} id={item.id} onClick={this.handleClickGoodsClass.bind(this, item.id, 3, item.name)}>{item.name}</li>
												)
											})
										}
									</ul>
								</div>
							</Col>
							<Col span="8">
								<h4>三级分类</h4>
								<div className={less.middleGoodsClass}>
									<ul>
										{
											this.state.tree3.map((item, index) =>{
												return (
													<li className={this.state.tempGoodsClass.goodsClass3==item.id?this.state.goodsClassSelected:null} id={item.id} onClick={this.handleClickGoodsClass.bind(this, item.id, 0, item.name)}>{item.name}</li>
												)
											})
										}
									</ul>
								</div>
							</Col>
						</Row>
						<div className={less["xz-fl"]}>
							<span>当前选择分类：</span>
							{this.showSelectedGoodsClass()}
						</div>
					</Card>
				</div>
	  		</div>
		)
	}

}