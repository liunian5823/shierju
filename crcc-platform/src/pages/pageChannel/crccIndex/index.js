import React from 'react';
import api from '@/framework/axios'//请求接口的封装
import {Carousel,Row, Col, Tabs, Modal, Button, Input, Icon, Transfer} from 'antd';
import UploadImg from '@/components/uploadImgrh';
import BaseTable from '@/components/baseTable';
import Album from 'uxcore-album';
import Util from '@/utils/util';
import bj1 from "./img/bj1.jpg";
import xtub1 from "./img/xtub1.png";
import xtub2 from "./img/xtub2.png";
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
import '../../footer/footer.css'		//底部样式引用
import  "./index.css"
import less from "./index.less";
import s1 from "../../footer/img/s1.png";
import s2 from "../../footer/img/s2.png";
import s3 from "../../footer/img/s3.png";
import s4 from "../../footer/img/s4.png";
import pp1 from "./img/morentu.jpg";
import pp2 from "./img/pp2.png";
import pp3 from "./img/pp3.png";
import pp4 from "./img/pp4.png";
import pp5 from "./img/pp5.png";
import a1 from "./img/a1.png";
import a2 from "./img/a2.png";
import a3 from "./img/a3.png";
import ewm from "../../footer/img/ewm.jpg";
import moren2 from './img/moren2.jpg'
import defaultBanner from './img/defaultBanner.jpg'
/*banner*/
function onChange(a, b, c) {
    //console.log(a, b, c);
}




const { Photo } = Album;
// table标签
const TabPane = Tabs.TabPane;
const imageOrigin = SystemConfig.configs.resourceUrl;
/*新闻、公告*/
function callback(key) {
	// console.log(key);
}

export default class StorePlatform extends React.Component {

	_isMounted = false

	state = {
		bannerArr:[], 	//轮播图
		threeList:[],	//轮播图右侧三个小广告
		fiveList:[],	//轮播图下方五个小广告
		recommendSupplierArr:[],	//推荐供应商数组
		fourList:[],	//底部四图（授、免、享、购）
		shoppingObj:[],		//购物指南
		shoppingList:[],	//购物指南子数组
		enterObj:[],		//购物指南
		enterList:[],		//购物指南子数组
		shareObj:[],		//购物指南
		shareList:[],		//购物指南子数组
		serviceObj:[],		//购物指南
		serviceList:[],		//购物指南子数组
		weChatObj:[],		//微信图
		recordObj:{},		//底部备案号
		recommendSupplierObj:'',	//推荐供应商
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
		loading4:false,			//分类提交按钮
		visible6:false,       	//名称
		loading6:false,			//名称提交按钮
		visible7:false,       	//名称、链接
		loading7:false,			//名称、链接提交按钮
		visible8:false,       	//底部大标题
		loading8:false,			//底部大标题提交按钮
		tableState1: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState5: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState0: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState4: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState6: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState7: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
		tableState8: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
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
		let channel = 2;
		api.ajax(
			'GET',
			'@/portal/ecNavAdv/all',
			{channel}
		).then(
			r=>{
				let bannerArr = this.state.bannerArr;
				let threeList = this.state.threeList;
				let fiveList = this.state.fiveList;
				let fourList = this.state.fourList;
				let shoppingObj = this.state.shoppingObj;
				let shoppingList = this.state.shoppingList;
				let enterObj = this.state.enterObj;
				let enterList = this.state.enterList;
				let shareObj = this.state.shareObj;
				let shareList = this.state.shareList;
				let serviceObj = this.state.serviceObj;
				let serviceList = this.state.serviceList;
				let weChatObj = this.state.weChatObj;
				let recommendSupplierObj = this.state.recommendSupplierObj;
				let recommendSupplierArr = this.state.recommendSupplierArr;
				let recordObj = this.state.recordObj;
				recommendSupplierArr = [];


				bannerArr = r.data.bannerList;
				threeList = r.data.threeList;
				fiveList = r.data.fiveList;
				fourList = r.data.fourList;
				shoppingObj = r.data.shoppingObj;
				shoppingList = r.data.shoppingList;
				enterObj = r.data.enterObj;
				enterList = r.data.enterList;
				shareObj = r.data.shareObj;
				shareList = r.data.shareList;
				serviceObj = r.data.serviceObj;
				serviceList = r.data.serviceList;
				weChatObj = r.data.weChatObj;
				recommendSupplierObj = r.data.recommendSupplierObj;
				recordObj = r.data.recordObj;
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
					threeList,
					fiveList,
					recommendSupplierArr,
					fourList,
					shoppingObj,
					shoppingList,
					enterObj,
					enterList,
					shareObj,
					shareList,
					serviceObj,
					serviceList,
					weChatObj,
					recommendSupplierObj,
					recordObj
				})
			}
		).catch(
			r=>{
				console.log("查询当前数据失败：", r)
			}
		)

	}

	/**
	 * modal弹窗1  图片和链接的
	 * @returns {*}
	 */
		//关闭 banner  modal方法
	closeModal=(_type)=>{
		if(_type == 'banner' || _type == 'fivePic'){
			this.setState({
				visible1: false,
				loading1: false
			});
		}
		if(_type == 'supplier' || _type == 'pic' || _type == 'footerFour'){
			this.setState({
				visible5: false,
				loading5: false
			});
		}
		if(_type == 'supplierInfo' || _type == 'thireePic'){
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
		if(_type == 'smartTitle'){
		    this.setState({
                visible8: false,
                loading8: false
            })
        }
		if(_type == 'titleAndLink'){
		    this.setState({
                visible7: false,
                loading7: false
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
		if(type == 'supplier'){
			this.boxsize={width:"160px",height:"207px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"20px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"100px",left:"75px"};
			this.textstyle={position:"absolute",top:"130px",left:"30px", width:"120px","padding-top":"8px"}
			this.setState({
				visible5: true,
				imageSize:'160px * 207px'
			})
		}
		if(type == 'supplierInfo' || type == 'thireePic'){
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
		if(type == 'smartTitle'){
			this.setState({
				visible8: true
			})
		}
		if(type == 'titleAndLink'){
			this.setState({
				visible7: true
			})
		}
		if(type == 'pic'){
			this.boxsize={width:"150px",height:"150px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"20px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"75px",left:"75px"};
			this.textstyle={position:"absolute",top:"100px",left:"25px", width:"120px","padding-top":"8px"}
			this.setState({
				visible5: true,
				imageSize:'150px * 150px'
			})
		}
		if(type == 'footerFour'){
			this.boxsize={width:"280px",height:"80px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"20px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"30px",left:"140px"};
			this.textstyle={position:"absolute",top:"60px",left:"90px", width:"120px","padding-top":"8px"}
			this.setState({
				visible5: true,
				imageSize:'140px * 40px'
			})
		}
		if(type == 'fivePic'){
			this.boxsize={width:"231px",height:"151px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
			this.iconstyle={"font-size":"20px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"70px",left:"115px"};
			this.textstyle={position:"absolute",top:"95px",left:"65px", width:"120px","padding-top":"8px"}
			this.setState({
				visible1: true,
				imageSize:'231px * 151px'
			})
		}
	}

	//确定按钮
	handleOk=(type)=>{
		//暂时注掉，要放开的
		if(type == 'banner' || type == 'fivePic'){
			this.setState({
				loading1: true
			});
		}
		if(type == 'supplier' || type == 'pic' || type == 'footerFour' ){
			this.setState({
				loading5: true
			});
		}
		if(type == 'supplierInfo' || type == 'thireePic'){
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
		if(type == 'smartTitle'){
            this.setState({
                loading8: true
            });
        }
		if(type == 'titleAndLink'){
            this.setState({
                loading7: true
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
		if(flag == 'banner' || flag == 'fivePic'){
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
						return <div title = {text} onClick={this.showPic.bind(this, text)}><a>查看</a></div>
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
		if(flag == 'supplier' || flag == 'pic' || flag == 'footerFour'){
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
						return <div title = {text} onClick={this.showPic.bind(this, text)}><a>查看</a></div>
					}
				}
			]
			//加载数据
			this.handelToLoadTable(1, 'tableState5');
		}
		if(flag == 'supplierInfo' || flag == 'thireePic'){
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
                        return <div title = {text} onClick={this.showPic.bind(this, text)}><a>查看</a></div>
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
		if(flag == 'smartTitle'){
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
				}
			]
			//加载数据
			this.handelToLoadTable(1, 'tableState8');
		}
		if(flag == 'titleAndLink'){
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
					title: '链接地址',
					dataIndex: 'url',
					key: 'url',
					//width: 170,
				}
			]
			//加载数据
			this.handelToLoadTable(1, 'tableState7');
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
				console.log("更新失败", r)
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
		}else if(flag == 'little'){
			val = $("#input_title_little").val();
        	currentEditObj.storeRemarks = val;
		}else if(flag == 'big2'){
			val = $("#input_title_big2").val();
			currentEditObj.title = val;
		}else if(flag == 'big3'){
			val = $("#input_title_big3").val();
			currentEditObj.title = val;
		}
		this.setState({
			currentEditObj
		})
    }

	render() {
		//console.log("render ===== ", this.state)
		let currentObj = this.state.currentEditObj;
		let bannerArr = this.state.bannerArr;  	//banner
		let supplierArr = this.state.recommendSupplierArr;
		let threeList = this.state.threeList;
        let fiveList = this.state.fiveList;
        let fourList = this.state.fourList;
        let shoppingObj = this.state.shoppingObj;
        let shoppingList = this.state.shoppingList;
        let enterObj = this.state.enterObj;
        let enterList = this.state.enterList;
        let shareObj = this.state.shareObj;
        let shareList = this.state.shareList;
        let serviceObj = this.state.serviceObj;
        let serviceList = this.state.serviceList;
        let weChatObj = this.state.weChatObj;
        let recommendSupplierObj = this.state.recommendSupplierObj;
        let recordObj = this.state.recordObj;
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
					{/* 6 编辑底部大标题*/}
					<Modal visible={this.state.visible8}
						   onCancel={this.handleCancel.bind()}
						   width={"800px"}
						   footer={[]}
					>
						<div className={less.padingzhi}>
							<div className={less.lianjiedz}>
								<span className={less.biaotidzlj}>大标题设置:</span>
								<Input id={"input_title_big2"} value={currentObj.title} onChange={this.changeBigTitle.bind(this, 'big2')} />
							</div>
							<div className={less.commitibutton}>
								<Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
								<Button key="submit1" type="primary" size="large" loading={this.state.loading8} onClick={this.handleOk}>提 交</Button>
							</div>
							<div className={less.fanyelei}>
								<BaseTable
									notInit={true}
									url="@/portal/ecNavAdv/logPage"
									tableState={this.state.tableState8}
									resetTable={(state) => { this.resetTable(state, 'tableState8') }}
									baseParams={this.baseParams}
									columns={this.columns}
									indexkeyWidth={60}
								/>
							</div>
						</div>
					</Modal>
					{/* 5 编辑底部标题加链接*/}
					<Modal visible={this.state.visible7}
						   onCancel={this.handleCancel.bind()}
						   width={"800px"}
						   footer={[]}
					>
						<div className={less.padingzhi}>
							<div className={less.lianjiedz}>
								<span className={less.biaotidzlj}>大标题设置:</span>
								<Input id={"input_title_big3"} value={currentObj.title} onChange={this.changeBigTitle.bind(this, 'big3')} />
							</div>
							<div className={less.lianjiedz}>
								<span className={less.biaotidzlj}>链接地址:</span>
								<Input id={"input_url"} placeholder={"链接地址"} onBlur={this.checkInputUrl.bind()} onChange={this.changeInput.bind()} value={currentObj.url}/>
							</div>
							<div className={less.commitibutton}>
								<Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
								<Button key="submit1" type="primary" size="large" loading={this.state.loading7} onClick={this.handleOk}>提 交</Button>
							</div>
							<div className={less.fanyelei}>
								<BaseTable
									notInit={true}
									url="@/portal/ecNavAdv/logPage"
									tableState={this.state.tableState7}
									resetTable={(state) => { this.resetTable(state, 'tableState7') }}
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
                <div className={less.banner}>
					{/*商城公告*/}
					<div className={less.bnconter}>
						<div className={less.mallNotice}>
							<div className={less.login}>
								<div className={less.right_header}>
									<Icon type="user" />
									<p className={less.color333}>HI，您好！</p>
									<p className={less.color97}>欢迎来到铁建商城</p>
								</div>
								<div className={[less.right_header, less.degnlu].join(' ')}>
									<i className="ico ico_tx pull_left"></i>
									<p className={less.color333}>HI，您好！</p>
									<p className={less.color97}>欢迎来到铁建商城</p>
								</div>
								<div className={less.mallNotice_a}>
									<a href="javascript:void(0);" className={[less.btn_index, less.btn_login].join(' ')}>登 录</a>
									<a href="javascript:void(0);" className={[less.btn_index, less.btn_register].join(' ')}>注册</a>
									<a href="javascript:void(0);" className={less.btn_supply}>供应商入驻</a>
								</div>
							</div>
							<div className={less.jianyi}>
								{
									threeList.map(
										(item, index) => {
											return (
												<a onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName, item.storeRemarks, 'thireePic')}>
													<img src={item.src == null ? a1 : imageOrigin + item.src}/>{item.title}
												</a>
											)
										}
									)
								}
							</div>
							<div className={[less.gonggao, "tab_gongg"].join(' ')}>
								<Tabs defaultActiveKey="1" onChange={callback}>
									<TabPane tab="网站公告" key="1">
										<ul className={less.slidingList}>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);" className={less.more}>更多>></a></li>
										</ul>
									</TabPane>
									<TabPane tab="新闻动态" key="2">
										<ul className={less.slidingList}>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);">系统公告将于2019.1.2日正式发布</a></li>
											<li><a href="javascript:void(0);" className={less.more}>更多>></a></li>
										</ul>
									</TabPane>
								</Tabs>

							</div>
						</div>
					</div>
					<Carousel>
						{
							bannerArr.map(
								(item, index)=>{
									return(
										<div key={`banner${index}`} onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'banner')}><h3><img src={item.src?imageOrigin+item.src:defaultBanner}/></h3></div>
									)
								}
							)
						}
					</Carousel>
				</div>
				<div className={less.jiaoyi}>
					{/*交易动态*/}
					<div className={less.jy_dt}>
						<h1><img src={dt}/>交易动态<span>|</span></h1>
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
					{/*广告图栏目分类*/}
					<div className={less.column}>
						<div className={less.guanggao}>
							{
								fiveList.map(
									(item, index)=>{
										return(
											<a  onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'fivePic')}>
												<img style={{"width":"231px","height":"151px"}} src={item.src == null?pp1:imageOrigin + item.src}/>
											</a>
										)
									}
								)
							}

							{/*<a><img src={pp2}/></a>
							<a><img src={pp3}/></a>
							<a><img src={pp4}/></a>
							<a><img src={pp5}/></a>*/}
						</div>
					</div>
				</div>
				<div className={less.nr}>
					{/*采购频道*/}
					<div className={less.caigou}>
						<h1 className={less.cgbt}>
							<strong><img src={xtub1}/>采购信息</strong>
							<span>汇集优质采购需求</span>
						</h1>
						<div className={less.cg_Company}>
							<div className={less.biaoti}>采购单位<a href="javascript:void(0);">查看更多>></a></div>
							<ul className={less.list_group}>
								<li><a
									href="javascript:void(0);">北京市建筑工程研究院有限责任公司</a><span><i>999笔</i>可报价</span></li>
								<li><a href="javascript:void(0);">南昌聚博工程材料有限公司</a><span><i>999笔</i>可报价</span>
								</li>
								<li><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a><span><i>999笔</i>可报价</span>
								</li>
								<li><a
									href="javascript:void(0);">广东建远建筑装配工业有限公司</a><span><i>999笔</i>可报价</span></li>
								<li><a href="javascript:void(0);">南昌聚博工程材料有限公司</a><span><i>999笔</i>可报价</span>
								</li>
							</ul>
							<ul className={less.list_group}>
								<li><a
									href="javascript:void(0);">北京市建筑工程研究院有限责任公司</a><span><i>999笔</i>可报价</span></li>
								<li><a href="javascript:void(0);">南昌聚博工程材料有限公司</a><span><i>999笔</i>可报价</span>
								</li>
								<li><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a><span><i>999笔</i>可报价</span>
								</li>
								<li><a
									href="javascript:void(0);">广东建远建筑装配工业有限公司</a><span><i>999笔</i>可报价</span></li>
								<li><a href="javascript:void(0);">南昌聚博工程材料有限公司</a><span><i>999笔</i>可报价</span>
								</li>
							</ul>
						</div>
						<div className={["caigouxqiu",less.cg_demand].join(' ')}>
							<div className={less.biaoti}>采购需求<a href="javascript:void(0);">查看更多>></a></div>
							<Tabs defaultActiveKey="1" onChange={callback}>
								<TabPane tab="实时商机" key="1">
									<div className={less.cjgao}>
									<table cellPadding={0} cellSpacing={0} className={less.table_hover}>
										<thead>
										<tr>
											<th>询价单名称</th>
											<th><span className={less.jzrz}>截止日期</span></th>
										</tr>
										</thead>
										<tbody>
										<tr>
											<td><a href="javascript:void(0);">北京市建筑工程研究院有限责任公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东建远建筑装配工业有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">南昌聚博工程材料有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										</tbody>
									</table>
									</div>
								</TabPane>
								<TabPane tab="成交公告" key="2">
									<div className={less.cjgao}>
									<table cellPadding={0} cellSpacing={0} className={less.table_hover}>
										<thead>
										<tr>
											<th>询价单名称</th>
											<th><span className={less.jzrz}>截止日期</span></th>
										</tr>
										</thead>
										<tbody>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">南昌聚博工程材料有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东建远建筑装配工业有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">北京市建筑工程研究院有限责任公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										</tbody>
									</table>
									</div>
								</TabPane>
							</Tabs>
						</div>
						<div className={["caigouxqiu",less.cg_demand,less.cg_you].join(' ')}>
							<div className={less.biaoti}>招标信息<a href="javascript:void(0);">查看更多>></a></div>
							<Tabs defaultActiveKey="1" onChange={callback}>
								<TabPane tab="招标公告" key="1">
									<div className={less.cjgao}>
									<table cellPadding={0} cellSpacing={0} className={less.table_hover}>
										<thead>
										<tr>
											<th>询价单名称</th>
											<th><span className={less.jzrz}>截止日期</span></th>
										</tr>
										</thead>
										<tbody>
										<tr>
											<td><a href="javascript:void(0);">北京市建筑工程研究院有限责任公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东建远建筑装配工业有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">南昌聚博工程材料有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										</tbody>
									</table>
									</div>
								</TabPane>
								<TabPane tab="澄清补疑" key="2">
									<div className={less.cjgao}>
									<table cellPadding={0} cellSpacing={0} className={less.table_hover}>
										<thead>
										<tr>
											<th>询价单名称</th>
											<th><span className={less.jzrz}>截止日期</span></th>
										</tr>
										</thead>
										<tbody>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">南昌聚博工程材料有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东建远建筑装配工业有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">北京市建筑工程研究院有限责任公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										</tbody>
									</table>
									</div>
								</TabPane>
								<TabPane tab="中标公告" key="3">
									<div className={less.cjgao}>
									<table cellPadding={0} cellSpacing={0} className={less.table_hover}>
										<thead>
										<tr>
											<th>询价单名称</th>
											<th><span className={less.jzrz}>截止日期</span></th>
										</tr>
										</thead>
										<tbody>
										<tr>
											<td><a href="javascript:void(0);">北京市建筑工程研究院有限责任公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东建远建筑装配工业有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">南昌聚博工程材料有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										<tr>
											<td><a href="javascript:void(0);">广东太氧谷环保科技有限公司</a></td>
											<td><span>2018-12-27</span></td>
										</tr>
										</tbody>
									</table>
									</div>
								</TabPane>
							</Tabs>
						</div>
						<div className="clear"></div>
					</div>
				</div>
				{/*优质供应商*/}
				<div className={less.shangquan1}>
					<h1 className={less.cgbt} onClick={this.clickEdit.bind(this, recommendSupplierObj.id, recommendSupplierObj.title, recommendSupplierObj.src, recommendSupplierObj.url, recommendSupplierObj.type, recommendSupplierObj.customClassId, recommendSupplierObj.customClassName,recommendSupplierObj.storeRemarks, 'title')}>
						<strong><img src={xtub2}/>{recommendSupplierObj.title}</strong>
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
																<img src={it.src?imageOrigin+it.src:moren2} onClick={this.clickEdit.bind(this, it.id, it.title, it.src, it.url, it.type, it.customClassId, it.customClassName,it.storeRemarks, 'supplier')} />
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
					<div>
						<div className="dibu qingchu">

							<div className="db-2">
								<div className="db-1">
									{
										fourList.map(
											(item, index)=>{
												return(
													<a href="javascript:void(0);"  onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'footerFour')}>
														<img style={{"width":"140px","height":"40px"}} src={item.src == null?'':imageOrigin + item.src}/>
													</a>
												)
											}
										)
									}
								</div>
								<dl>

									<dt><a onClick={this.clickEdit.bind(this, shoppingObj.id, shoppingObj.title, shoppingObj.src, shoppingObj.url, shoppingObj.type, shoppingObj.customClassId, shoppingObj.customClassName,shoppingObj.storeRemarks, 'smartTitle')}>{shoppingObj.title?shoppingObj.title:"点击编辑"}</a></dt>
									<dd>
										{
											shoppingList.map(
												(item, index)=>{
													return(
															<a href="javascript:void(0);" onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'titleAndLink')}>
																{item.title == ""?'点击编辑':item.title}
															</a>
														)
												}
											)
										}
									</dd>
								</dl>
								<dl>
									<dt><a onClick={this.clickEdit.bind(this, enterObj.id, enterObj.title, enterObj.src, enterObj.url, enterObj.type, enterObj.customClassId, enterObj.customClassName,enterObj.storeRemarks, 'smartTitle')}>{enterObj.title?enterObj.title:"点击编辑"}</a></dt>
									<dd>
										{
											enterList.map(
												(item, index)=>{
													return(
														<a href="javascript:void(0);" onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'titleAndLink')}>
															{item.title == ''?'点击编辑':item.title}
														</a>
													)
												}
											)
										}
									</dd>
								</dl>
								<dl>

									<dt><a onClick={this.clickEdit.bind(this, shareObj.id, shareObj.title, shareObj.src, shareObj.url, shareObj.type, shareObj.customClassId, shareObj.customClassName,shareObj.storeRemarks, 'smartTitle')}>{shareObj.title?shareObj.title:"点击编辑"}</a></dt>
									<dd>
										{
											shareList.map(
												(item, index)=>{
													return(
														<a href="javascript:void(0);" onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'titleAndLink')}>
															{item.title == ''?'点击编辑':item.title}
														</a>
													)
												}
											)
										}
									</dd>
								</dl>
								<dl>

									<dt><a onClick={this.clickEdit.bind(this, serviceObj.id, serviceObj.title, serviceObj.src, serviceObj.url, serviceObj.type, serviceObj.customClassId, serviceObj.customClassName,serviceObj.storeRemarks, 'smartTitle')}>{serviceObj.title?serviceObj.title:"点击编辑"}</a></dt>
									<dd>
										{
											serviceList.map(
												(item, index)=>{
													return(
														<a href="javascript:void(0);" onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'titleAndLink')}>
															{item.title == ''?'点击编辑':item.title}
														</a>
													)
												}
											)
										}
									</dd>
								</dl>
								<dl className="ewm">
									<dd>
										<a style={{height:"150px"}} onClick={this.clickEdit.bind(this, weChatObj.id, weChatObj.title, weChatObj.src, weChatObj.url, weChatObj.type, weChatObj.customClassId, weChatObj.customClassName,weChatObj.storeRemarks, 'pic')}>
											<img src={weChatObj.src == null?ewm:imageOrigin+weChatObj.src}/>
										</a>
									</dd>
									<dt>关注铁建，获得更多信息！</dt>
								</dl>
							</div>
							<div className="db-4"  onClick={this.clickEdit.bind(this, recordObj.id, recordObj.title, recordObj.src, recordObj.url, recordObj.type, recordObj.customClassId, recordObj.customClassName,recordObj.storeRemarks, 'title')}>
								{recordObj.title}<br/>
								{recordObj.storeRemarks}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}