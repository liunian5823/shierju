import React from 'react';
import api from '@/framework/axios'//请求接口的封装
import {Carousel,Row, Col, Tabs, Modal, Button, Input, Icon, Transfer} from 'antd';
import UploadImg from '@/components/uploadImgrh';
import BaseTable from '@/components/baseTable';
import Album from 'uxcore-album';
import Util from '@/utils/util';
import bj1 from "./img/bj1.jpg";
//小图片
import areaPic from './img/area.png'
import brandPic from './img/brand.png'
import classPic from './img/class_pic.png'
import partnerPic from './img/partner.png'
import rankingPic from './img/ranking_list.png'
import recommendSupplierPic from './img/recommend_supplier.png'
import supplierMapPic from './img/supplier_map.png'


import dt from "./img/dt.svg";
import ditu from "./img/ditu.png";

import  "./index.css"
import less from "./index.less";
import Footer from "../../footer/Footer";

/*banner*/
function onChange(a, b, c) {
    //console.log(a, b, c);
}


const { Photo } = Album;
// table标签
const TabPane = Tabs.TabPane;
function callback(key) {
  //console.log(key);
}
const imageOrigin = SystemConfig.configs.resourceUrl;


export default class StorePlatform extends React.Component {

	_isMounted = false

	state = {
		bannerArr:[], 	//轮播图
		crccCircle:'',	//铁建商圈
		areaCircleObj:'',	//区域商圈
		areaCircleArr:[],	//八大区域
		partnerObj:'',		//战略合作
		supplierMap:'',		//供应商地图
		partnerArr:[],		//战略合作数组
		recommendBrandObj:'',		//品牌推荐
		recommendBrandArr:[],		//品牌推荐数组
		recommendSupplierObj:'',	//推荐供应商
		recommendSupplierArr:[],	//推荐供应商数组
		currentEditObj:{id:"",title:"", src:"bj1", url:"",customClassId:"", customClassName:"",storeRemarks:'', type:""},		//当前编辑对象
		currentFlag:'',	//当前编辑对象
		imageSize:'1920px * 450px',		//图片建议尺寸
		visible2:false,       	//图片、链接
		loading2:false,			//图片、链接提交按钮
		visible5:false,       	//图片
		loading5:false,			//图片提交按钮
		visible0:false,       	//图片、标题、链接
		loading0:false,			//图片、标题、链接 提交按钮
		visible4:false,       	//分类
		loading4:false,			//分类提价按钮
		visible6:false,       	//名称
		loading6:false,			//名称提价按钮
		tableState1: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState5: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState0: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState4: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState6: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		mockData:[],		//当前分类全部的数组
		targetKeys:[],		//当前已选分类id
		currentEditSelectClass:[],		//保存当前点击的广告位已选择的分类
	}

	componentWillMount() {
		this._isMounted = true;
		//请求数据
		this.initData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	initData=()=>{
		//查询数据
		this.queryAllData();
	}

	//初始化查询数据
	queryAllData=()=>{
		let channel = 1;
		api.ajax(
			'GET',
			'@/portal/ecNavAdv/all',
			{channel}
		).then(
			r=>{
				//console.log("查询当前数据为：", r)
				let bannerArr = this.state.bannerArr;
				let crccCircle = this.state.crccCircle;
				let areaCircleObj = this.state.areaCircleObj;
				let areaCircleArr = this.state.areaCircleArr;
				let partnerObj = this.state.partnerObj;
				let partnerArr = this.state.partnerArr;
				let recommendBrandObj = this.state.recommendBrandObj;
				let recommendBrandArr = this.state.recommendBrandArr;
				let recommendSupplierObj = this.state.recommendSupplierObj;
				let recommendSupplierArr = this.state.recommendSupplierArr;
				let supplierMap = this.state.supplierMap;
				recommendSupplierArr = [];


				bannerArr = r.data.bannerArr;
				crccCircle = r.data.crccCircle;
				areaCircleObj = r.data.areaCircleObj;
				areaCircleArr = r.data.areaCircleList;
				partnerObj = r.data.partnerObj;
				partnerArr = r.data.partnerList;
				recommendBrandObj = r.data.recommendBrandObj;
				recommendBrandArr = r.data.recommendBrandList;
				recommendSupplierObj = r.data.recommendSupplierObj;
				supplierMap = r.data.supplierMap;
				let supplierArr = r.data.recommendSupplierList;

				//处理下当前的推荐供应商数组，两个一组
				let tempArr = [];
				for (let i = 0; i < supplierArr.length; i++) {
					let twoArr = [];
					let fourArr = [];
					//获取当前已经添加的分类信息数组
					let classInfo = supplierArr[i].classInfo;
					if(classInfo){
						for (let j = 0; j< classInfo.length; j++){
							if(j<2){
								twoArr.push(classInfo[j]);
							}else{
								fourArr.push(classInfo[j]);
							}
						}
					}
					supplierArr[i].twoArr = twoArr;
					supplierArr[i].fourArr = fourArr;
					tempArr.push(supplierArr[i]);
					if(i % 2 == 1){
						recommendSupplierArr.push(tempArr);
						tempArr = [];
					}
				}
				this.setState({
					bannerArr,
					crccCircle,
					areaCircleObj,
					areaCircleArr,
					partnerObj,
					partnerArr,
					recommendBrandObj,
					recommendBrandArr,
					recommendSupplierObj,
					recommendSupplierArr,
					supplierMap
				})



			}
		).catch(
			r=>{
				//console.log("查询当前数据失败：", r)
			}
		)

	}

	/**
	 * modal弹窗1  图片和链接的
	 * @returns {*}
	 */
		//关闭 banner  modal方法
	closeModal=(_type)=>{
		if(_type == 'banner'){
			this.setState({
				visible1: false,
				loading1: false
			});
		}
		if(_type == 'area'){
			this.setState({
				visible5: false,
				loading5: false
			});
		}
		if(_type == 'partner'){
			this.setState({
				visible1: false,
				loading1: false
			});
		}
		if(_type == 'supplier'){
			this.setState({
				visible5: false,
				loading5: false
			});
		}
		if(_type == 'supplierInfo'){
			this.setState({
				visible0: false,
				loading0: false
			});
		}
		if(_type == 'class'){
			this.setState({
				visible4: false,
				loading4: false
			});
		}
		if(_type == 'title'){
		    this.setState({
                visible6: false,
                loading6: false
            })
        }
	}

	//显示弹窗modal
	showModal=(type)=>{
		if(type == 'banner'){
			this.boxsize={width:"640px",height:"150px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"30px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"50px",left:"320px"};
			this.textstyle={position:"absolute",top:"90px",left:"275px", width:"120px","padding-top":"8px"}
			this.setState({
				visible1: true,
				imageSize:'1920px * 450px'
			});
		}
		if(type == 'area'){
			this.boxsize={width:"175px",height:"175px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"20px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"70px",left:"85px"};
			this.textstyle={position:"absolute",top:"100px",left:"40px", width:"120px","padding-top":"8px"}
			this.setState({
				visible5: true,
				imageSize:'175px * 175px'
			})
		}
		if(type == 'partner'){
			this.boxsize={width:"309px",height:"150px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"30px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"50px",left:"150px"};
			this.textstyle={position:"absolute",top:"90px",left:"110px", width:"120px","padding-top":"8px"}
			this.setState({
				visible1: true,
				imageSize:'175px * 85px'
			});
		}
		if(type == 'supplier'){
			this.boxsize={width:"160px",height:"207px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"20px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"100px",left:"75px"};
			this.textstyle={position:"absolute",top:"130px",left:"30px", width:"120px","padding-top":"8px"}
			this.setState({
				visible5: true,
				imageSize:'160px * 207px'
			})
		}
		if(type == 'supplierInfo'){
			this.boxsize={width:"175px",height:"175px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"20px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"70px",left:"85px"};
			this.textstyle={position:"absolute",top:"100px",left:"40px", width:"120px","padding-top":"8px"}
			this.setState({
				visible0: true,
				imageSize:'75px * 75px'
			})
		}
		if(type == 'class'){
            this.setState({
                visible4: true
            })
		}
		if(type == 'title'){
            this.setState({
                visible6: true
            })
        }
	}

	//确定按钮
	handleOk=(type)=>{
		//暂时注掉，要放开的
		if(type == 'banner'){
			this.setState({
				loading1: true
			});
		}
		if(type == 'area'){
			this.setState({
				loading5: true
			});
		}
		if(type == 'partner'){
			this.setState({
				loading1: true
			});
		}
		if(type == 'supplier'){
			this.setState({
				loading5: true
			});
		}
		if(type == 'supplierInfo'){
			this.setState({
				loading0: true
			});
		}
		if(type == 'class'){
			this.setState({
				loading4: true
			});
		}
		if(type == 'title'){
            this.setState({
                loading6: true
            });
        }
		//调用保存方法
		this.submitData();
	}

	//返回按钮
	handleCancel=()=>{
		let type = this.state.currentFlag;
		this.closeModal(type);
	}

	//编辑方法
	clickEdit=(id, title, src, url, type, customClassId, customClassName,storeRemarks, flag)=>{
		let currentEditObj = this.state.currentEditObj;
		let currentFlag= this.state.currentFlag;
		currentEditObj.id = id;
		currentEditObj.title = title;
		currentEditObj.src = src;
		currentEditObj.url = url;
		currentEditObj.customClassId = customClassId;
		currentEditObj.customClassName = customClassName;
		currentEditObj.type = type;
		currentFlag = flag;
		currentEditObj.storeRemarks = storeRemarks;
		this.setState({
			currentEditObj,
			currentFlag
		})

		//设置当前的参数
		this.baseParams = {
			advId:id,
			type:type
		}
		//设置当前列
		this.setTableColumn(flag);

		this.showModal(flag);
	}

	setTableColumn=(flag)=>{
		if(flag == 'banner' || flag == 'partner'){
			this.columns = [
				{
					title: '操作人',
					dataIndex: 'username',
					key: 'username',
					//width: 100
				},{
					title: '更新日期',
					dataIndex: 'createTime',
					key: 'createTime',
					//width: 170,
					render: (text) => {
						return moment(text).format("YYYY-MM-DD HH:mm:ss")
					}
				},{
					title: '图片查看',
					dataIndex: 'src',
					key: 'src',
					//width: 170,
					render: (text) => {
						return <div title = {text} onClick={this.showPic.bind(this, text)}>查看</div>
					}
				},{
					title: '链接地址',
					dataIndex: 'url',
					key: 'url',
					//width: 170
				},
			]
			//加载数据
			this.handelToLoadTable(1, 'tableState1');
		}
		if(flag == 'area' || flag == 'supplier'){
			this.columns = [
				{
					title: '操作人',
					dataIndex: 'username',
					key: 'username',
					//width: 100
				},{
					title: '更新日期',
					dataIndex: 'createTime',
					key: 'createTime',
					//width: 170,
					render: (text) => {
						return moment(text).format("YYYY-MM-DD HH:mm:ss")
					}
				},{
					title: '图片查看',
					dataIndex: 'src',
					key: 'src',
					//width: 170,
					render: (text) => {
						return <div title = {text} onClick={this.showPic.bind(this, text)}>查看</div>
					}
				}
			]
			//加载数据
			this.handelToLoadTable(1, 'tableState5');
		}
		if(flag == 'supplierInfo'){
            this.columns = [
                {
                    title: '操作人',
                    dataIndex: 'username',
                    key: 'username',
                    //width: 100
                },{
                    title: '更新日期',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    //width: 170,
                    render: (text) => {
                        return moment(text).format("YYYY-MM-DD HH:mm:ss")
                    }
                },{
                    title: '标题',
                    dataIndex: 'title',
                    key: 'title',
                    //width: 170,
                },{
                    title: '图片查看',
                    dataIndex: 'src',
                    key: 'src',
                    //width: 170,
                    render: (text) => {
                        return <div title = {text} onClick={this.showPic.bind(this, text)}>查看</div>
                    }
                },{
                    title: '链接地址',
                    dataIndex: 'url',
                    key: 'url',
                    //width: 170
                },
            ]
            //加载数据
            this.handelToLoadTable(1, 'tableState0');
		}
		if(flag == 'class'){
            this.columns = [
                {
                    title: '操作人',
                    dataIndex: 'username',
                    key: 'username',
                    //width: 100
                },{
                    title: '更新日期',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    //width: 170,
                    render: (text) => {
                        return moment(text).format("YYYY-MM-DD HH:mm:ss")
                    }
                },{
                    title: '分类',
                    dataIndex: 'class',
                    key: 'class',
                    //width: 170,
                }
            ]
            //加载数据
            this.handelToLoadTable(1, 'tableState4');
		}
		if(flag == 'title'){
            this.columns = [
                {
                    title: '操作人',
                    dataIndex: 'username',
                    key: 'username',
                    //width: 100
                },{
                    title: '更新日期',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    //width: 170,
                    render: (text) => {
                        return moment(text).format("YYYY-MM-DD HH:mm:ss")
                    }
                },{
                    title: '大标题',
                    dataIndex: 'title',
                    key: 'title',
                    //width: 170,
                },{
					title: '小标题',
					dataIndex: 'storeRemarks',
					key: 'storeRemarks',
					//width: 170,
				}
            ]
            //加载数据
            this.handelToLoadTable(1, 'tableState6');
        }

	}

	//提交数据
	submitData=()=>{
		let params = this.state.currentEditObj;
		let _type = this.state.currentFlag;
		api.ajax(
			'POST',
			'@/portal/ecNavAdv/update',
			params
		).then(
			r=>{
				Util.alert("保存成功！");
				//更新数据
				this.queryAllData();
				//关闭弹窗
				this.closeModal(_type);
				return;
			}
		).catch(
			r=>{
				//console.log("更新失败", r)
			}
		)
	}


	//校验图片输入的url合法性
	checkInputUrl=()=>{
		let url = $("#input_url").val();
		if(url == '') return;
		let currentEditObj = this.state.currentEditObj;
		if(url.indexOf('crccmall.com') == -1 ){
			currentEditObj.url = '';
			$("#input_url").val('');
			Util.alert("不允许输入站外链接");
			return;
		}else{
			currentEditObj.url = url;
			this.setState({
				currentEditObj
			})
		}
	}

	//上传图片成功
	uploadSuccess = (imgUrl, filename) => {
		//赋值
		let currentEditObj = this.state.currentEditObj;
		currentEditObj.src = imgUrl;
		this.setState({
			currentEditObj
		})
	}

	//输入框的change事件
	changeInput=()=>{
		let val = $("#input_url").val();
		let currentEditObj = this.state.currentEditObj;
		currentEditObj.url = val;
		this.setState({
			currentEditObj
		})
	}

	//title 输入框的change事件
	changeInputTitle=()=>{
		let val = $("#input_title").val();
		let currentEditObj = this.state.currentEditObj;
		currentEditObj.title = val;
		this.setState({
			currentEditObj
		})
	}

	/*****
	 *
	 * baseTable组件的相关方法
	 *
	 * 1.baseParams //表格参数，默认可以没有
	 * 2.handelToLoadTable //
	 * 3.resetTable //
	 * 4.columns //表头数据
	 *
	 * *****/
	baseParams = {  //BaseTable 请求的参数
	}
	//加载table
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

	columns = []

	//分类选择的穿梭框
	handleChange=(targetKeys)=>{
		if(targetKeys.length > 6){
			Util.alert("橱窗商品最多添加6个！");
			return;
		}else{
			let currentEditObj = this.state.currentEditObj;
			//组合当前选择的分类id
			if(targetKeys.length ==0 ){
				currentEditObj.customClassId = '';
			}else{
				let str = '';
				for (let i = 0; i < targetKeys.length; i++) {
					str = str + targetKeys[i];
					if(i < targetKeys.length-1){
						str += ',';
					}
				}
				currentEditObj.customClassId = str;
			}
			//获取当前的添加商品数量
			this.setState({
				targetKeys,
				currentEditObj
			});
		}

	}

	//clickClass
	clickClass=(id, title, src, url, type, customClassId, customClassName,storeRemarks, flag, pId)=>{
		//将数据添加到当前点击对象中
		this.clickEdit(id, title, src, url, type, customClassId, customClassName,storeRemarks, flag);
		//通过一级分类的id查询当前二级分类
		api.ajax(
			'GET',
			'@/portal/ecNavAdv/queryCLassNameByPid',
			{pId}
		).then(
			r=>{
				let mockData = this.state.mockData;
				let targetKeys = this.state.targetKeys;
				mockData = [];
				targetKeys = [];
				let resultData = r.data;
				if(resultData.length > 0){
					for (let i = 0; i < resultData.length ; i++) {
						let _class = resultData[i];
						const currentClass = {
							key: _class.id+"",
							name: _class.name,
						}
						mockData.push(currentClass);
					}
				}
				//设置已选择的分类数组
				if(customClassId && customClassId.length > 0){
					targetKeys = customClassId.split(",");
				}
				this.setState({
					mockData,
					targetKeys
				})
				//显示当前的分类弹窗
				this.showModal('class');
			}
		).catch(r=>{
		})
	}

	//展示图片
	showPic=(path)=>{
		let photoElm = [];
		photoElm.push(
			<Photo
				src={imageOrigin + path}
			/>,
		)
		Album.show({
			photos: photoElm,
		});
	}

	//品牌商圈修改时change事件
    changeBigTitle=(flag)=>{
		let val;
		let currentEditObj = this.state.currentEditObj;
		if(flag == 'big'){
			val = $("#input_title_big").val();
			currentEditObj.title = val;
		}else{
			val = $("#input_title_little").val();
        	currentEditObj.storeRemarks = val;
		}
		this.setState({
			currentEditObj
		})
    }

	render() {
		let bannerArr = this.state.bannerArr;
		let currentObj = this.state.currentEditObj;	//banner
		let areaArr = this.state.areaCircleArr;		//区域商圈
		let partnerArr = this.state.partnerArr;		//战略合作
		let brandArr = this.state.recommendBrandArr;	//推荐品牌
		let supplierArr = this.state.recommendSupplierArr;

		let crccCircle = this.state.crccCircle;     //品类商圈
		let areaCircleObj = this.state.areaCircleObj;       //区域商圈
        let partnerObj = this.state.partnerObj;  //战略合作
        let recommendBrandObj = this.state.recommendBrandObj;
        let recommendSupplierObj = this.state.recommendSupplierObj;
        let supplierMap = this.state.supplierMap;
        return(
			<div>
				<div>
					{/* 1 图片、标题、链接*/}
					<Modal visible={this.state.visible0}
						   onCancel={this.handleCancel.bind()}
						   width={"800px"}
                           footer={[]}
					>
						<div className={less.padingzhi}>
						<div className={less.tishiyu}>
							<strong>上传图片:</strong>
							请上传格式为PNG/JPG文件体积小于2MB的图片;请确认图片各项内容清晰以便审核;图片尺寸：{this.state.imageSize}
						</div>
						<div className={less.upimages}>
							<div>
								<UploadImg type="head" title="上传图片" filename={'file'} uploadSuccess={this.uploadSuccess} imgUrl={currentObj.src} custom_hide={true} uploadPath={true} boxsize={this.boxsize} iconstyle={this.iconstyle} textstyle={this.textstyle} noWatermark={true}/>
							</div>
							<div className={less.lianjiedz} >
								<span className={less.biaotidzlj}>标题:</span>
								<Input id={"input_title"} placeholder={"标题"}  onChange={this.changeInputTitle.bind()} value={currentObj.title} maxLength={100}/>
							</div>
							<div className={less.lianjiedz}>
								<span className={less.biaotidzlj}>链接地址:</span>
								<Input id={"input_url"} placeholder={"链接地址"} onBlur={this.checkInputUrl.bind()} onChange={this.changeInput.bind()} value={currentObj.url} maxLength={200}/>
							</div>
						</div>
                        <div className={less.commitibutton}>
                            <Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
                            <Button key="submit1" type="primary" size="large" loading={this.state.loading0} onClick={this.handleOk}>提 交</Button>
                        </div>
                        <div className={less.fanyelei}>
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecNavAdv/logPage"
                                tableState={this.state.tableState0}
                                resetTable={(state) => { this.resetTable(state, 'tableState0') }}
                                baseParams={this.baseParams}
                                columns={this.columns}
                                indexkeyWidth={60}
                            />
                        </div>
						</div>
					</Modal>
					{/* 2 图片 链接*/}
					<Modal visible={this.state.visible1}
						   onCancel={this.handleCancel.bind()}
						   width={"800px"}
                           footer={[]}
					>
						<div className={less.padingzhi}>
						<div className={less.tishiyu}>
							<strong>上传图片:</strong>
							请上传格式为PNG/JPG文件体积小于2MB的图片请确认图片各项内容清晰以便审核;图片尺寸：{this.state.imageSize}
						</div>
						<div className={less.upimages}>
							<div>
								<UploadImg type="head" title="上传图片" filename={'file'} uploadSuccess={this.uploadSuccess} imgUrl={currentObj.src} custom_hide={true} uploadPath={true} boxsize={this.boxsize} iconstyle={this.iconstyle} textstyle={this.textstyle}  noWatermark={true}/>
							</div>
							<div className={less.lianjiedz}>
								<span className={less.biaotidzlj}>链接地址:</span>
								<Input id={"input_url"} placeholder={"链接地址"} onBlur={this.checkInputUrl.bind()} onChange={this.changeInput.bind()} value={currentObj.url}/>
							</div>
						</div>
						<div className={less.commitibutton}>
                            <Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
                            <Button key="submit1" type="primary" size="large" loading={this.state.loading1} onClick={this.handleOk}>提 交</Button>
                        </div>
						<div className={less.fanyelei}>
							<BaseTable
								notInit={true}
								url="@/portal/ecNavAdv/logPage"
								tableState={this.state.tableState1}
								resetTable={(state) => { this.resetTable(state, 'tableState1') }}
								baseParams={this.baseParams}
								columns={this.columns}
								indexkeyWidth={60}
							/>
						</div>
						</div>
					</Modal>
					{/* 3 图片*/}
					<Modal visible={this.state.visible5}
						   onCancel={this.handleCancel.bind()}
						   width={"800px"}
                           footer={[]}
					>
						<div className={less.padingzhi}>
						<div className={less.tishiyu}>
							<strong>上传图片:</strong>
							请上传格式为PNG/JPG文件体积小于2MB的图片请确认图片各项内容清晰以便审核;图片尺寸：{this.state.imageSize}
						</div>
						<div className={less.upimages}>
							<div>
								<UploadImg type="head" title="上传图片" filename={'file'} uploadSuccess={this.uploadSuccess} imgUrl={currentObj.src} custom_hide={true} uploadPath={true} boxsize={this.boxsize} iconstyle={this.iconstyle} textstyle={this.textstyle}  noWatermark={true}/>
							</div>
						</div>
                        <div className={less.commitibutton}>
                            <Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
                            <Button key="submit1" type="primary" size="large" loading={this.state.loading5} onClick={this.handleOk}>提 交</Button>
                        </div>
						<div className={less.fanyelei}>
							<BaseTable
								notInit={true}
								url="@/portal/ecNavAdv/logPage"
								tableState={this.state.tableState5}
								resetTable={(state) => { this.resetTable(state, 'tableState5') }}
								baseParams={this.baseParams}
								columns={this.columns}
								indexkeyWidth={60}
							/>
						</div>
						</div>
					</Modal>
					{/* 4 分类*/}
					<Modal visible={this.state.visible4}
						   onCancel={this.handleCancel.bind()}
						   width={"800px"}
                           footer={[]}
					>
						<div className={["padingzhi",less.padingzhi].join(' ')}>
						<Transfer
							dataSource={this.state.mockData}
							showSearch
							searchPlaceholder={"请输入二级分类名称"}
							listStyle={{
								width: 320,
								height: 450,
							}}
							operations={['添加', '移除']}
							titles={['可选分类', '已选分类']}
							targetKeys={this.state.targetKeys}
							onChange={this.handleChange}
							render={item => `${item.name}`}
						/>
                        <div className={less.commitibutton}>
                            <Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
                            <Button key="submit1" type="primary" size="large" loading={this.state.loading4} onClick={this.handleOk}>提 交</Button>
                        </div>
                        <div className={less.fanyelei}>
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecNavAdv/logPage"
                                tableState={this.state.tableState4}
                                resetTable={(state) => { this.resetTable(state, 'tableState4') }}
                                baseParams={this.baseParams}
                                columns={this.columns}
                                indexkeyWidth={60}
                            />
                        </div>
						</div>
					</Modal>
                    {/* 5 编辑名称*/}
                    <Modal visible={this.state.visible6}
                           onCancel={this.handleCancel.bind()}
                           width={"800px"}
                           footer={[]}
                    >
						<div className={less.padingzhi}>
							<div className={less.lianjiedz}>
								<span className={less.biaotidzlj}>大标题设置:</span>
								<Input id={"input_title_big"} value={currentObj.title} onChange={this.changeBigTitle.bind(this, 'big')} />
							</div>
							<div className={less.lianjiedz}>
								<span className={less.biaotidzlj}>小标题设置:</span>
								<Input id={"input_title_little"} value={currentObj.storeRemarks} onChange={this.changeBigTitle.bind(this, 'little')} />
							</div>
                        <div className={less.commitibutton}>
                            <Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
                            <Button key="submit1" type="primary" size="large" loading={this.state.loading6} onClick={this.handleOk}>提 交</Button>
                        </div>
                        <div className={less.fanyelei}>
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecNavAdv/logPage"
                                tableState={this.state.tableState6}
                                resetTable={(state) => { this.resetTable(state, 'tableState6') }}
                                baseParams={this.baseParams}
                                columns={this.columns}
                                indexkeyWidth={60}
                            />
                        </div>
						</div>
                    </Modal>
				</div>
				{/*top区域*/}
				{/*<ShopHead/>*/}
                {/*banner*/}
                <Carousel className={less.banner}>
					{
						bannerArr.map(
							(item, index)=>{
								return(
									<div key={`banner${index}`} onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'banner')}><h3><img src={item.src==null?bj1:imageOrigin+item.src}/></h3></div>
								)
							}
						)
					}
                </Carousel>
				{/*入驻动态*/}
				<div className={less.jy_dt}>
					<h1><img src={dt}/>最新入驻<span>|</span></h1>
					<div className={less.two}>
						<ul>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部项目部门中国局人服</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部项目部门中国局人服</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部项目部门中国局人服</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部项目部门中国局人服</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部项目部门中国局人服</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部项目部门中国局人服</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部项目部门中国局人服</i></a></li>
							<li><a ><i>中国局人服务商项目部门中国局人服务商项目部</i></a></li>
						</ul>
					</div>
				</div>
				{/*品类商圈*/}
				<Row className={less.shangquan}>
					<Col className={less.leftpash}>
						<div className={less.quanzi}>
							<h1 className={less.cgbt} onClick={this.clickEdit.bind(this, crccCircle.id, crccCircle.title, crccCircle.src, crccCircle.url, crccCircle.type, crccCircle.customClassId, crccCircle.customClassName,crccCircle.storeRemarks, 'title')}>
								<strong><img src={classPic}/>{crccCircle.title}</strong>
								<span>{crccCircle.storeRemarks}</span>
							</h1>
							<div className={less.sq_conter}>
								<ul className={less.list_group}>
									<li><a >五金工具/附件</a><span>999家</span></li>
									<li><a >焊接机电/轴承耗材</a><span>999家</span></li>
									<li><a >劳保安防/日杂用品</a><span>999家</span></li>
									<li><a >电工电料/灯具照明</a><span>999家</span></li>
									<li><a >给排水材料/管件</a><span>999家</span></li>
								</ul>
								<ul className={less.list_group}>
									<li><a >机械设备及附件</a><span>999家</span></li>
									<li><a >水暖管通/阀门</a><span>999家</span></li>
									<li><a >紧固件/密封</a><span>999家</span></li>
									<li><a >装饰装修/防水保温</a><span>999家</span></li>
									<li><a >办公用品</a><span>999家</span></li>
								</ul>
								<ul className={less.list_group}>
									<li><a >消防器材</a><span>999家</span></li>
									<li><a >油漆涂料/化工辅助</a><span>999家</span></li>
									<li><a >管材/板材/型材</a><span>999家</span></li>
									<li><a >建筑施工材料</a><span>999家</span></li>
								</ul>
							</div>
						</div>
						<div className={less.quanzi}>
							<h1 className={less.cgbt}  onClick={this.clickEdit.bind(this, areaCircleObj.id, areaCircleObj.title, areaCircleObj.src, areaCircleObj.url, areaCircleObj.type, areaCircleObj.customClassId, areaCircleObj.customClassName,areaCircleObj.storeRemarks, 'title')}>
								<strong><img src={areaPic}/>{areaCircleObj.title}</strong>
								<span>{areaCircleObj.storeRemarks}</span></h1>
							<div className={less.sq_conter}>
								<Row gutter={16} className={less.ant_row}>
									{
										areaArr.map(
											(item, index)=>{
												return (
													<Col key={`area${index}`} className={less.gutter_row} span={6} onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'area')}>
														{/*<span className={less.rb_circle}>{item.title}</span>*/}
														<img src={item.src == null?bj1:imageOrigin + item.src}/>
													</Col>
												)
											}
										)
									}
								</Row>
							</div>
						</div>
					</Col>
					<Col className={less.rightpull}>
						<h1 className={less.cgbt}><strong><img src={rankingPic}/>排行榜</strong><span> </span></h1>
						<div className={less.sq_conter1}>
							<Tabs defaultActiveKey="1" onChange={callback}>
								<TabPane tab={<div className={less.table_gao}>成交金额</div>} key="1">
									<ul className={less.panghang}>
										<li><i className={less.hongse}>1</i><a >北京市建筑工程研究院有限责任公司</a><span>999万元</span></li>
										<li><i className={less.hongse}>2</i><a >南昌聚博工程材料有限公司</a><span>999万元</span></li>
										<li><i className={less.hongse}>3</i><a >广东太氧谷环保科技有限公司</a><span>999万元</span></li>
										<li><i>4</i><a >广东建远建筑装配工业有限公司</a><span>999万元</span></li>
										<li><i>5</i><a >南昌聚博工程材料有限公司</a><span>999万元</span></li>
										<li><i>6</i><a >北京市建筑工程研究院有限责任公司</a><span>999万元</span></li>
										<li><i>7</i><a >南昌聚博工程材料有限公司</a><span>999万元</span></li>
										<li><i>8</i><a >广东太氧谷环保科技有限公司</a><span>999万元</span></li>
										<li><i>9</i><a >广东建远建筑装配工业有限公司</a><span>999万元</span></li>
										<li><i>10</i><a >南昌聚博工程材料有限公司</a><span>999万元</span></li>
										<li><i>11</i><a >北京市建筑工程研究院有限责任公司</a><span>999万元</span></li>
										<li><i>12</i><a >南昌聚博工程材料有限公司</a><span>999万元</span></li>
										<li><i>13</i><a >广东太氧谷环保科技有限公司</a><span>999万元</span></li>
										<li><i>14</i><a >广东建远建筑装配工业有限公司</a><span>999万元</span></li>
										<li><i>15</i><a >南昌聚博工程材料有限公司</a><span>999万元</span></li>
									</ul>
								</TabPane>
								<TabPane tab={<div className={less.table_gao}>报价次数</div>} key="2">
									<ul className={less.panghang}>
										<li><i className={less.hongse}>1</i><a >北京市建筑工程研究院有限责任公司</a><span>9999笔</span></li>
										<li><i className={less.hongse}>2</i><a >南昌聚博工程材料有限公司</a><span>9999笔</span></li>
										<li><i className={less.hongse}>3</i><a >广东太氧谷环保科技有限公司</a><span>9999笔</span></li>
										<li><i>4</i><a >广东建远建筑装配工业有限公司</a><span>9999笔</span></li>
										<li><i>5</i><a >南昌聚博工程材料有限公司</a><span>9999笔</span></li>
										<li><i>6</i><a >北京市建筑工程研究院有限责任公司</a><span>9999笔</span></li>
										<li><i>7</i><a >南昌聚博工程材料有限公司</a><span>9999笔</span></li>
										<li><i>8</i><a >广东太氧谷环保科技有限公司</a><span>9999笔</span></li>
										<li><i>9</i><a >广东建远建筑装配工业有限公司</a><span>9999笔</span></li>
										<li><i>10</i><a >南昌聚博工程材料有限公司</a><span>9999笔</span></li>
										<li><i>11</i><a >北京市建筑工程研究院有限责任公司</a><span>9999笔</span></li>
										<li><i>12</i><a >南昌聚博工程材料有限公司</a><span>9999笔</span></li>
										<li><i>13</i><a >广东太氧谷环保科技有限公司</a><span>9999笔</span></li>
										<li><i>14</i><a >广东建远建筑装配工业有限公司</a><span>9999笔</span></li>
										<li><i>15</i><a >南昌聚博工程材料有限公司</a><span>9999笔</span></li>
									</ul>
								</TabPane>
							</Tabs>
						</div>
					</Col>
				</Row>
				{/*战略合作*/}
				<div className={less.shangquan1}>
					<h1 className={less.cgbt} onClick={this.clickEdit.bind(this, partnerObj.id, partnerObj.title, partnerObj.src, partnerObj.url, partnerObj.type, partnerObj.customClassId, partnerObj.customClassName,partnerObj.storeRemarks, 'title')}>
						<strong ><img src={partnerPic}/>{partnerObj.title}</strong>
						<span>{partnerObj.storeRemarks}</span></h1>
					<div className={less.sq_conter1}>
						<Row className={less.ant_row1}>
							{
								partnerArr.map(
									(item,index)=>{
										return(
											<Col key={`partner${index}`} className={less.gutter_row} span={4} onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'partner')}>
												<img className={less.areaImage} src={item.src == null?bj1:imageOrigin + item.src}/>
											</Col>
										)
									}
								)
							}
						</Row>
					</div>
				</div>
				{/*品牌专区*/}
				<div className={less.shangquan1}>
					<h1 className={less.cgbt}  onClick={this.clickEdit.bind(this, recommendBrandObj.id, recommendBrandObj.title, recommendBrandObj.src, recommendBrandObj.url, recommendBrandObj.type, recommendBrandObj.customClassId, recommendBrandObj.customClassName,recommendBrandObj.storeRemarks, 'title')}>
						<strong><img src={brandPic}/>{recommendBrandObj.title}</strong>
						<span>{recommendBrandObj.storeRemarks}</span></h1>
					<div className={less.sq_conter1}>
						<div className={less.ant_row2}>
							<ul>
								{
									brandArr.map(
										(item, index)=>{
											return(
												<li key={`brand${index}`} onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'partner')}>
													<img src={item.src == null?bj1:imageOrigin+item.src}/>
												</li>
											)
										}
									)
								}
							</ul>
						</div>
					</div>
				</div>
				{/*推荐供应商*/}
				<div className={less.shangquan1}>
					<h1 className={less.cgbt} onClick={this.clickEdit.bind(this, recommendSupplierObj.id, recommendSupplierObj.title, recommendSupplierObj.src, recommendSupplierObj.url, recommendSupplierObj.type, recommendSupplierObj.customClassId, recommendSupplierObj.customClassName,recommendSupplierObj.storeRemarks, 'title')}>
						<strong><img src={recommendSupplierPic}/>{recommendSupplierObj.title}</strong>
						<span>{recommendSupplierObj.storeRemarks}</span>
					</h1>
					{
						supplierArr.map(
							(item,index)=>{
								return(
									<div key={`supplier${index}`} className={less.louceng}>
										{
											item.map(
												(it, index)=>{
													return (
														<div key={`supplierInfo${index}`} className={less.floor}>
															<div className={less.gys_left}>
																<h1>
																	<strong>{it.className}</strong>
																	<span>
																		<a onClick={this.clickClass.bind(this, it.id, it.title, it.src, it.url,it.type, it.customClassId, it.customClassName,it.storeRemarks, 'class', it.classId)}>
																			{
																				it.twoArr.length == 0
																				?
																				'点击编辑分类'
																				:
																				it.twoArr.map(
																					(itTwo, index)=>{
																						if(index == 0){
																							return(
																								<span>{itTwo.name}</span>
																							)
																						}else{
																							return(
																								<span>|{itTwo.name}</span>
																							)
																						}

																					}
																				)
																			}

																		</a>
																	</span>
																	<a >查看更多></a>
																</h1>
																<img src={it.src == null?bj1:imageOrigin+it.src} onClick={this.clickEdit.bind(this, it.id, it.title, it.src, it.url, it.type, it.customClassId, it.customClassName,it.storeRemarks, 'supplier')} />
															</div>
															<div className={less.gys_right}>
																<Row>
																	{
																		it.child.map(
																			(itt, index)=>{
																				return(
																					<Col span={8} className={less.sj_xinxi} onClick={this.clickEdit.bind(this, itt.id, itt.title, itt.src, itt.url, itt.type, itt.customClassId, itt.customClassName,itt.storeRemarks, 'supplierInfo')}>
																						<a >
																							<img src={itt.src == null?ditu:itt.src.indexOf("https://") > -1?itt.src:imageOrigin+itt.src}/>
																							<span>{itt.title==''?'点击编辑':itt.title}</span>
																						</a>
																					</Col>
																				)
																			}
																		)
																	}
																	<Col span={24} className={less.bs_xinxi} onClick={this.clickClass.bind(this, it.id, it.title, it.src, it.url,it.type, it.customClassId, it.customClassName,it.storeRemarks, 'class', it.classId)}>
																		{
																			it.fourArr.map(
																				(itFour, index)=>{
																					return(
																						<a>{itFour.name}</a>
																					)
																				}
																			)
																		}
																	</Col>
																</Row>
															</div>
														</div>
													)
												}
											)
										}
									</div>
								)
							}
						)
					}


				</div>
				{/*供应商地图*/}
				<div className={less.shangquan1}>
					<h1 className={less.cgbt}  onClick={this.clickEdit.bind(this, supplierMap.id, supplierMap.title, supplierMap.src, supplierMap.url, supplierMap.type, supplierMap.customClassId, supplierMap.customClassName,supplierMap.storeRemarks, 'title')}>
						<strong><img src={supplierMapPic}/>{supplierMap.title}</strong>
						<span>{supplierMap.storeRemarks}</span>
					</h1>
					<img src={ditu}/>
				</div>
				<div className={less.clear}>
				</div>
				{/*右侧固定导航*/}
				<ul className={less.fixedmeau}>
					<li className={less.lcxz}><i>1F</i><span>1F</span></li>
					<li><i>2F</i><span>2F</span></li>
					<li><i>3F</i><span>3F</span></li>
					<li><i>4F</i><span>4F</span></li>
					<li><i>5F</i><span>5F</span></li>
					<li><i>6F</i><span>6F</span></li>
					<li><i>7F</i><span>7F</span></li>
					<li className={less.totop}>
						<Icon type="up" />
						<span><Icon type="up" /></span>
					</li>
					<li className={less.yjfk}>
						<Icon type="edit"/>
						<span>意见反馈</span>
					</li>
				</ul>
				<div>
					<Footer/>
				</div>
			</div>
		)
	}
}