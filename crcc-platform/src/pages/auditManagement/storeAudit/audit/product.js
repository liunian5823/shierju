import React from 'react';
import {Card,Col,Row,Icon,Tree,Button,Table,Input,Modal,Form,InputNumber,TreeSelect,Switch,message, Transfer, Carousel, Menu, Dropdown, Breadcrumb, Pagination, Checkbox} from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import { setToken } from '@/redux/action/index';

import jj from "./img/jj.png";
import "./portal.css";
import less from "./product.less";
import noData from "./img/noData.png";

const FormItem = Form.Item;

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
}

// 左边菜单
const TreeNode = Tree.TreeNode;


class GoodsClass extends React.Component{

    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
    _userInfo = null
    _storeInfo = null
    gc_custom_idArr=[]
    oneArr=[]

    state = {
        loading: false,//是否正在加载
        visible: false,//弹窗model是否显示
        goodsClassList:[], //左侧商品分类

        gc_custom_idArr:[],//默认选中的商品分类id数组

    }


    componentWillMount() {

        //对url请求参数中分类id数据的处理
        if(this.props.paramsObj){
            let paramsObj = this.props.paramsObj;
            if(paramsObj.gc_custom_ids){
                let gc_custom_idArr = paramsObj.gc_custom_ids.split(",");
                this.gc_custom_idArr = gc_custom_idArr.map((item,index)=>{
                    return item+""
                })
                this.oneArr=[this.gc_custom_idArr[0]]
            }
        }

        this._isMounted = true;
        this.pubsub_userInfo = PubSub.subscribe('PubSub_SendCompany', function (topic, obj) {
            if (this._userInfo || !obj) { return false }
            this._userInfo = obj;
            // 获得用户基本信息后执行加载回调
            this.initDataFn();
        }.bind(this));//
    }

    componentWillUnmount() {
        this._isMounted = false;
        PubSub.unsubscribe(this.pubsub_userInfo);
        PubSub.unsubscribe(this.pubsub_storeInfo);
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nextProps) {

    }

    initDataFn = () => {
        this.baseParams = {
            ...this.baseParams,
            companyId: this._userInfo.companyId
        }
        this.pubsub_storeInfo = PubSub.subscribe('PubSub_SendStore', function (topic, obj) {
            if (this._storeInfo || !obj) { return false }
            this._storeInfo = obj;
            // 获得店铺信息后执行加载回调
            this.handelToLoadData();
        }.bind(this));//

    }


    handleOk = () => {
        this.setState({
            visible: false
        })
    }

    //初始化参数
    baseParams = {  //BaseTable 请求的参数

    }
    //加载数据
    handelToLoadData = () => {
        let {classType} = this._storeInfo;
        if(classType==1){//开启自定义分类
            this.getGoodsCustomClass(-1,0);
        }else{
            //展示商城分类
            this.getGoodsClass();
        }

    }
    //查询左侧自定义分类信息
    getGoodsCustomClass=(pId, level, index)=>{
        let companyId = this._userInfo.companyId;
        //查询一级分类的信息
        api.ajax(
            'GET',
            '@/portal/ecGoodsCustomClass/getAllShowGoodsCusClass',
            {pId, companyId}
        ).then(r=>{
            if (!this._isMounted) {
                return;
            }
            this.setState({
                goodsClassList:r.data.rows
            })

        }).catch(r=>{
            console.log("分类查询失败！");
            // Util.alert("分类查询失败！","error");
        })
    }

    //查询左侧商城分类信息
    getGoodsClass=()=>{
        let paramsObj = this.props.paramsObj;
        let companyId = this._userInfo.companyId;
        //查询一级分类的信息
        api.ajax(
            'GET',
            '@/merchandise/ecGoods/getGoodsClassFromSolr',
            {companyId,}
        ).then(r=>{
            if (!this._isMounted) {
                return;
            }
            this.setState({
                goodsClassList:r.data.rows,
            })

        }).catch(r=>{
            //Util.alert("分类查询失败！","error");
            console.log("分类查询失败！")
        })
    }

    onSelect = (selectedKeys,e) =>{
        let classIdArr = [];
        if(selectedKeys && selectedKeys.length>0){
            classIdArr.push(...selectedKeys);//添加被选中的key
            let nodeArr = e.node.props.children;
            if(nodeArr){
                for(let node of nodeArr){
                    classIdArr.push(...this.getAllClassIds(node))//添加其子节点的key
                }
            }
        }

        //将默认选中的置空
        if(this.gc_custom_idArr){
            this.gc_custom_idArr = [];
            this.oneArr=[];
        }

        this.props.getSelectedIds(classIdArr);
        // this.props.getSelectedIds(selectedKeys);

    }

    //递归获取分类id
    getAllClassIds = (item)=>{
        let arr = [];
        arr.push(item.key);
        if(item.props.children){
            for(let ele of item.props.children){
                let cArr = this.getAllClassIds(ele);
                for (let value of cArr){
                    arr.push(value);
                }
            }
        }
        return arr;
    }

    handleTitle = title =>{
        let titleName = title
        if (titleName && titleName.length > 10) {
            titleName = `${titleName.substring(0, 10)}...`;
        }
        return titleName;
    }

    render() {

        const loop = data => data.map((item) => {
            if (item.list && item.list.length) {
                let titleName = this.handleTitle(item.name);
                return <TreeNode key={item.id} title={titleName}>{loop(item.list)}</TreeNode>;
            }
            let titleName = this.handleTitle(item.name);
            return <TreeNode key={item.id} title={titleName} />;
        });
        return (
            <Tree defaultExpandAll={true} onSelect={this.onSelect} defaultSelectedKeys={this.oneArr} defaultExpandedKeys={this.gc_custom_idArr}>
                {loop(this.state.goodsClassList)}
            </Tree>
        );
    }
}




// 搜索
import classNames from 'classnames';
const InputGroup = Input.Group;

const SearchInput = React.createClass({
    getInitialState() {
        let paramsObj = this.props.paramsObj;
        let defaultValue=paramsObj?paramsObj.search_goods_keywords?paramsObj.search_goods_keywords:'':''
        return {
            value: defaultValue,
            focus: false,
        };
    },
    handleInputChange(e) {
        this.setState({
            value: e.target.value,
        });
    },
    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    },
    handleSearch() {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    },
    resetInput(){
        this.setState({value:""})
    },
    componentDidMount() {
        this.props.resetInputRef(this);
    },
    render() {

        const { style, size, placeholder } = this.props;
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.value.trim(),
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus,
        });
        return (
            <div className="ant-search-input-wrapper" style={style}>
                <InputGroup className={searchCls}>
                    <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange}
                           onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
                    />
                    <div className="ant-input-group-wrap">
                        <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch} />
                    </div>
                </InputGroup>
            </div>
        );
    },
});








const imageOrigin = SystemConfig.configs.resourceUrl;
export default class ProductStore extends React.Component{
    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
    _userInfo = null
    _initCount=0
    _storeName=null
    _storeInfo = null

    state = {
        showSkinClass: "box_waicheng_red",       //默认红色

        loading: false,//是否正在加载
        visible: false,//弹窗model是否显示
        pageSize:12,//每页显示的条数
        current:1,//当前页码
        total:0,//总数据条数
        goodsList:[],//商品列表
        brandList:[],//品牌列表
        gc_ids:"",//被选中的商品分类id及其子分类的id组成的字符串,以逗号分隔
        brandIds:[],//选中的品牌id数组
        brandNames:[],//选中的品牌名称数组
        brandTarget:[],//选中的品牌对象数组
        startPrice:"",//开始的价格
        endPrice:"",//最大的价格
        priceType:false,//false为自定义价格 true为价格区段

        mail_flag:"",//0否 1是 支持物流
        orderBy:"",//排序字段
        reverse:"",//排序 true:为降序,false:升序
        goods_keywords:"",//查询关键字
        searchConditionItem:[],//在上方回显的查询条件
        isDisplayPrice:true,//是否显示品牌查询
        isDisplayBrand:true,//是否显示价格查询

        isDisplayBrandMore:false,//是否展示更多品牌

    }

    componentWillMount() {
        this._isMounted = true;
        this.pubsub_userInfo = PubSub.subscribe('PubSub_SendCompany', function (topic, obj) {
            if (this._userInfo || !obj) { return false }
            this._userInfo = obj;
            // 获得用户基本信息后执行加载回调
            this.initDataFn();
        }.bind(this));//
    }

    componentWillUnmount() {
        this._isMounted = false;
        PubSub.unsubscribe(this.pubsub_userInfo);
        PubSub.unsubscribe(this.pubsub_storeInfo);
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.storeName){
            this._initCount ++;
            this._storeName = nextProps.storeName;
        }
        if(nextProps.skinClass){
            let showSkinClass = this.state.showSkinClass;
            showSkinClass = nextProps.skinClass;
            this.setState({
                showSkinClass
            })
        }
    }

    initDataFn = () => {
        this.baseParams = {
            ...this.baseParams,
            companyId: this._userInfo.companyId
        }

        //根据url上的参数初始化数据
        if(this.props.paramsObj){
            let paramsObj = this.props.paramsObj;
            if(paramsObj.selectAllClassIds){//商品分类id
                let selectAllClassIds = paramsObj.selectAllClassIds;
                this.state.gc_ids = selectAllClassIds;
            }
            if(paramsObj.search_goods_keywords){//搜索关键词
                let search_goods_keywords = paramsObj.search_goods_keywords;
                this.state.goods_keywords = search_goods_keywords;
            }
        }

        this.pubsub_storeInfo = PubSub.subscribe('PubSub_SendStore', function (topic, obj) {
            if (this._storeInfo || !obj) { return false }
            this._storeInfo = obj;
            // 获得用户基本信息后执行加载回调
            this.handelToLoadData();
            this.getGoodsBrandList();
        }.bind(this));//
    }


    handleOk = () => {
        this.setState({
            visible: false
        })
    }

    //初始化参数
    baseParams = {  //BaseTable 请求的参数

    }

    //获取有商品的品牌数据
    getGoodsBrandList =()=>{
        let {classType} = this._storeInfo;
        let paramsObj = this.props.paramsObj;//url上的请求参数
        let {gc_ids,brandList} = this.state;
        api.ajax(
            'GET',
            '@/merchandise/ecGoods/getGoodsBrandFromSolr',
            {
                ...this.baseParams,
                classType,
                gc_ids,
                ...paramsObj,
            }
        ).then(r=>{
            if (!this._isMounted) {
                return;
            }
            if(r.data){
                brandList = r.data;
            }else{
                brandList = [];
            }
            this.setState({
                brandList,
            })

        }).catch(r=>{
            console.log("商品品牌加载失败");
        })
    }

    //加载数据
    handelToLoadData = () => {

        let {classType} = this._storeInfo;

        this.setState({loading:true});
        let {current,pageSize,gc_ids,startPrice,endPrice,mail_flag,orderBy,reverse,goods_keywords,brandIds,isDisplayBrand,brandNames} = this.state;
        let brand_ids = "";
        if(brandIds && brandIds.length>0){
            if(!isDisplayBrand){
                brand_ids = brandIds.join(",");
            }else{
                /*brandIds=[];
                brandNames=[];
                this.state.brandIds = brandIds;
                this.state.brandNames=brandNames;
                this.setState({brandIds,brandNames});*/
            }
        }
        api.ajax(
            'GET',
            '@/merchandise/ecGoods/getGoodsListFromSolr',
            {
                ...this.baseParams,
                classType,
                current,
                pageSize,

                gc_ids,
                startPrice,
                endPrice,
                mail_flag,
                orderBy,
                reverse,
                goods_keywords,
                brand_ids,
            }
        ).then(r=>{
            if (!this._isMounted) {
                return;
            }
            this.setState({loading:false});

            this.setState({
                total:r.data.total,
                goodsList:r.data.data,
            })

        }).catch(r=>{
            this.setState({loading:false});
            console.log("商品列表加载失败")
            // Util.alert("商品列表加载失败","error");
        })
    }

    //
    setShowSkinClass=(skinClass)=>{
         let showSkinClass = this.state.showSkinClass;
         showSkinClass = skinClass;
         this.setState({
             showSkinClass
         })
    }

    //当左侧分类数据改变时
    getSelectedIds = (selectedClassIds) =>{
        let gc_ids = "";
        if(selectedClassIds && selectedClassIds.length>0){
            gc_ids = selectedClassIds.join(",");
        }
        this.state.gc_ids = gc_ids;
        this.setState({gc_ids});
        this.resetGoodsListPage();
        this.getGoodsBrandList();
    }

    //重置列表页

    resetGoodsListPage =()=>{
        let {brandTarget} = this.state;
        let initState = {
            pageSize:12,//每页显示的条数
            current:1,//当前页码
            total:0,//总数据条数
            goodsList:[],//商品列表
            brandList:[],//品牌列表
            brandIds:[],//选中的品牌id数组
            brandNames:[],//选中的品牌名称数组
            brandTarget:[],//选中的品牌对象数组
            startPrice:"",//开始的价格
            endPrice:"",//最大的价格
            priceType:false,//false为自定义价格 true为价格区段

            mail_flag:"",//0否 1是 支持物流
            orderBy:"",//排序字段
            reverse:"",//排序 true:为降序,false:升序
            goods_keywords:"",//查询关键字
            searchConditionItem:[],//在上方回显的查询条件
            isDisplayPrice:true,//是否显示品牌查询
            isDisplayBrand:true,//是否显示价格查询

            isDisplayBrandMore:false,//是否展示更多品牌

        }
        
        //将选中的品牌取消掉
        /*if(brandTarget && brandTarget.length>0){
            for (let target of brandTarget) {
                target.checked = false;
            }
        }*/
        //初始化state的相应值
        for (let pro in initState) {
            this.state[pro] = initState[pro];
        }

        //重置searchInput的值
        this.searchInputRef.resetInput();
        //对自定义价格的处理
        $("#storeStartPrice").val("");
        $("#storeEndPrice").val("");

        this.setState({...initState});
        this.handelToLoadData()

    }


    //分页相关的两个方法
    //当页码改变时触发
    currentPageOnChange = (current)=>{
        console.log("current",current)
        this.state.current = current;
        this.setState({current:current});
        this.handelToLoadData();
    }
    //当pageSize改变时,触发
    pageSizeOnChange = (current,rows)=>{
        this.setState({pageSize:rows,current:1});
        this.state.current = 1;
        this.state.pageSize = rows;
        this.handelToLoadData();
    }

    //排序点击事件
    orderOnClick =(orderByP,reverseP)=>{
        let {orderBy,reverse} = this.state;
        if(orderBy==orderByP){
            if(reverse){
                reverse = reverse=="false"?"true":"false";
            }else{
                reverse="false";
            }
        }else{
            reverse="false";
        }
        this.state.reverse = reverse;
        this.state.orderBy = orderByP;
        this.state.mail_flag = "";
        this.state.current = 1;
        this.setState({orderBy:orderByP,reverse,current:1,mail_flag:""})

        this.handelToLoadData();
    }
    //免费送货点击事件
    selfOnClick=()=>{
        this.state.mail_flag = "1";
        this.state.current = 1;
        this.setState({mail_flag:"1",orderBy:"mail_flag",current:1,reverse:""});
        this.handelToLoadData();
    }

    //价格验证
    priceCommonValidate = (id)=>{
        id = '#'+ id;
        let value = $(id).val();
        let numAndFloat = /(^[0-9]{1,16}([\.]{1})$)|(^[0-9]{1,16}$)|(^[0-9]{1,16}([\.]{1})[0-9]{1,2}$)/;    //只能输入整数和小数的正则表达式

        let {startPrice,endPrice}=this.state;
        if(id.indexOf('storeStartPrice') > -1){    //供应价
            if(value!='' && !numAndFloat.test(value)){
                $("#storeStartPrice").val(startPrice);
            }else{
                this.state.startPrice = value;
            }
        }
        if(id.indexOf('storeEndPrice') > -1){    //供应价
            if(value!='' && !numAndFloat.test(value)){
                $("#storeEndPrice").val(endPrice);
            }else{
                this.state.endPrice = value;
            }
        }

    }
    //自定义价格确认按钮点击事件
    priceOnClick = ()=>{
        let startPrice = $("#storeStartPrice").val();
        let endPrice = $("#storeEndPrice").val();
        this.state.startPrice=startPrice;
        this.state.endPrice=endPrice;
        this.state.priceType=false;
        this.state.current = 1;
        this.setState({startPrice,endPrice,current:1,priceType:false});

        //将价格区段的相关信息删除
        let {searchConditionItem} = this.state;
        if(searchConditionItem.length>0){
            let findIndex = searchConditionItem.findIndex(field=>field.type=="price");
            if(findIndex>-1){
                searchConditionItem.splice(findIndex,1);
                this.state.searchConditionItem=searchConditionItem;
                this.setState({searchConditionItem});
            }
        }

        this.handelToLoadData();
    }
    //根据关键字查询
    keywordSearch = (value) =>{
        this.state.goods_keywords = value;
        this.state.current = 1;
        this.setState({goods_keywords:value,current:1});
        this.handelToLoadData();
    }

    //根据价格区段查询
    priceSearch = (startPrice,endPrice,str)=>{
        this.state.startPrice=startPrice;
        this.state.endPrice=endPrice;
        this.state.isDisplayPrice=false;
        this.state.current = 1;

        let {searchConditionItem} = this.state;
        searchConditionItem.push({type:"price",info:str});
        this.setState({startPrice,endPrice,current:1,priceType:true,isDisplayPrice:false,searchConditionItem});


        //对自定义价格的处理
        $("#storeStartPrice").val("");
        $("#storeEndPrice").val("");

        this.handelToLoadData();
    }

    //当品牌的复选框改变时触发
    brandOnChange = (e,brandName,brandId)=>{
        let {brandIds,brandNames,brandTarget} = this.state;
        let target = e.target;
        if(target.checked){
            brandIds.push(brandId);
            brandNames.push(brandName);
            brandTarget.push(target);
        }else{
            let findIndex = brandIds.findIndex(field=>field==brandId);
            if(findIndex>-1){
                brandIds.splice(findIndex,1);
            }

            let strIndex = brandNames.findIndex(field=>field==brandName);
            if(strIndex>-1){
                brandNames.splice(strIndex,1);
            }

            let tarIndex = brandTarget.findIndex(field=>field.dataBrandId==brandId);
            if(tarIndex>-1){
                brandTarget.splice(tarIndex,1);
            }
        }
        this.state.brandIds = brandIds;
        this.state.brandNames = brandNames;
        this.state.brandTarget = brandTarget;
        this.setState({brandIds,brandNames,brandTarget});

    }
    //当点击单个品牌时触发
    singleBrandOnClick = (e,brandName,brandId)=>{
        let brandIds = [brandId];
        let brandNames = [brandName];
        this.state.brandIds = brandIds;
        this.state.brandNames = brandNames;
        this.setState({brandIds,brandNames});
        this.brandConfirmOnClick();
    }
    //当点击品牌确定按钮时
    brandConfirmOnClick =()=>{
        let {brandIds,brandNames,searchConditionItem,isDisplayBrand,isDisplayBrandMore} = this.state;
        if(brandIds && brandIds.length>0){
            isDisplayBrandMore = false;
            isDisplayBrand = false;
            this.state.isDisplayBrand = isDisplayBrand;
            this.state.current = 1;
            searchConditionItem.push({type:"brand",info:brandNames.join(",")});
            this.setState({current:1,isDisplayBrand,searchConditionItem,isDisplayBrandMore});
            this.handelToLoadData();
        }else{
            Util.alert("请选择品牌！");
        }
    }
    //点击品牌右侧更多或收起按钮时
    displayBrandMoreOnClick =()=>{
        let {isDisplayBrandMore,brandIds,brandNames,brandTarget} = this.state;
        if(isDisplayBrandMore){
            isDisplayBrandMore = false;

            if(brandTarget.length>0){
                for (let target of brandTarget) {
                    target.checked = false;
                }
            }

            this.state.brandIds=[];
            this.state.brandNames=[];
            this.state.brandTarget=[];
            this.setState({isDisplayBrandMore,brandIds,brandNames,brandTarget})
        }else{
            isDisplayBrandMore = true;
            this.setState({isDisplayBrandMore})
        }
    }

    //当点击某个条件的取消按钮时
    searchConditionCancel = (item)=>{
        let {searchConditionItem,isDisplayPrice,isDisplayBrand,brandIds,brandNames,startPrice,endPrice,priceType} = this.state;
        if(searchConditionItem.length>0){
            let findIndex = searchConditionItem.findIndex(field=>field.type==item.type);
            if(findIndex>-1){
                searchConditionItem.splice(findIndex,1);

                let type = item.type;
                if(type=="brand"){
                    isDisplayBrand = true;
                    brandIds=[];
                    brandNames=[];
                    this.state.isDisplayBrand = isDisplayBrand;
                    this.state.brandIds=brandIds;
                    this.state.brandNames=brandNames;
                }else if(type=="price"){
                    isDisplayPrice=true;
                    if(priceType){
                        startPrice="";
                        endPrice="";
                    }
                    this.state.isDisplayPrice = isDisplayPrice;
                    this.state.startPrice=startPrice;
                    this.state.endPrice=endPrice;
                }
                this.state.current = 1;
                this.setState({searchConditionItem,isDisplayPrice,isDisplayBrand,brandIds,brandNames,startPrice,endPrice,priceType,current:1});
                this.handelToLoadData();
            }
        }
    }

    //展示品牌
    showBrand = ()=>{
        let {isDisplayBrand,brandList,isDisplayBrandMore} = this.state;
        if(isDisplayBrand){
            if(isDisplayBrandMore){
                return (
                    <li style={brandList&&brandList.length>0?{}:{display:"none"}}>
                        <div className={less.choosed_left}>品牌</div>
                        <ul style={{height:"auto"}} className={less.choosed_center}>
                            {
                                brandList.map((item,index)=>{
                                    if(item.brand_name){
                                        return (
                                            <li><Checkbox dataBrandId={item.id} dataBrandName={item.brand_name} onChange={(e)=>this.brandOnChange(e,item.brand_name,item.id)}>{item.brand_name}</Checkbox></li>
                                        )
                                    }else{
                                        return "";
                                    }
                                })
                            }
                        </ul>
                        {this.showBrandRightButton()}
                    </li>
                )
            }else{
                return (
                    <li style={brandList&&brandList.length>0?{}:{display:"none"}}>
                        <div className={less.choosed_left}>品牌</div>
                        <ul style={{height:"35px"}} className={less.choosed_center}>
                            {
                                brandList.map((item,index)=>{
                                    if(item.brand_name){
                                        return (
                                            <li onClick={(e)=>{this.singleBrandOnClick(e,item.brand_name,item.id)}}>{item.brand_name}</li>
                                        )
                                    }else{
                                        return "";
                                    }
                                })
                            }
                        </ul>
                        {this.showBrandRightButton()}
                    </li>
                )
            }
        }else {
            return ""
        }
    }

    //展示品牌右侧按钮
    showBrandRightButton = ()=>{
        let {isDisplayBrandMore} = this.state;
        if(isDisplayBrandMore){
            return (
                <div className={less.choosed_right}>
                    <button onClick={this.displayBrandMoreOnClick}>收起</button>
                    <button onClick={this.brandConfirmOnClick} className={less.queding}>确定</button>
                </div>
            )
        }else{
            return (
                <div className={less.choosed_right}>
                    <button onClick={this.displayBrandMoreOnClick}>更多</button>
                </div>
            )
        }
    }


    //展示价格
    showPrice = ()=>{
        let {isDisplayPrice} = this.state;
        if(isDisplayPrice){
            return (
                <li>
                    <div className={less.choosed_left}>价格</div>
                    <ul className={less.choosed_center}>
                        <li onClick={()=>{this.priceSearch("0","30000","3万以下")}}><span>3万以下</span></li>
                        <li onClick={()=>{this.priceSearch("30000","50000","3-5万")}}><span>3-5万</span></li>
                        <li onClick={()=>{this.priceSearch("50000","100000","5-10万")}}><span>5-10万</span></li>
                        <li onClick={()=>{this.priceSearch("100000","200000","10-20万")}}><span>10-20万</span></li>
                        <li onClick={()=>{this.priceSearch("200000","500000","20-50万")}}><span>20-50万</span></li>
                        <li onClick={()=>{this.priceSearch("500000","","50万以上")}}><span>50万以上</span></li>
                    </ul>
                </li>
            )
        }else{
            return ""
        }
    }

    //展示查询条件
    showConditionInfo =()=>{
        let {searchConditionItem} = this.state;
        if(searchConditionItem && searchConditionItem.length>0){
            let codi = searchConditionItem.map((item,index)=>{
                return (
                    <a key={index} className={less.xbt_xzan}>
                        {item.info}<Icon onClick={()=>{this.searchConditionCancel(item)}} type="cross" />
                    </a>
                )
            })
            return codi;
        }else{
            return "";
        }
    }

    showFixPrice = (price)=>{
        if(price){
            try {
                return parseFloat(price).toFixed(2)
            } catch (e) {
                return 0
            }
        }else{
            return 0
        }
    }

    resetInputRef = (ref)=>{
        this.searchInputRef=ref;
    }

    render() {
        let {goodsList} = this.state;
        if(!goodsList){
            goodsList = []
        }
        return(
            <div className={[this.state.showSkinClass,less[this.state.showSkinClass]].join(' ')}>
                <div className={less.company_case}>
                <div className={less.crumbse}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <Icon type="home" />
                            <span>首页</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            供应产品
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className={less.chanpin}>
                    <div className={less.cp_left}>
                        <h3 className={less.flbioati}>产品分类</h3>
                        <div className={less.demo_kuang}  id={"rhTree"}>
                            <GoodsClass getSelectedIds={this.getSelectedIds} paramsObj={this.props.paramsObj}/>
                        </div>
                    </div>
                    <div className={less.cp_right}>
                        <div className={less.saixuan}>
                            <ul>
                                <li className={less.choosed}>
                                    <div className={less.choosed_left}>所有分类</div>
                                    <div className={less.choosed_center}>
                                        {
                                            this.showConditionInfo()
                                        }
                                    </div>
                                    <span className={less.choosed_right}>当前共<strong>{this.state.total}</strong>条信息</span>
                                </li>
                                {
                                    this.showBrand()
                                }
                                {/*{
                                    this.showPrice()
                                }*/}
                            </ul>
                        </div>
                        <div className={less.sx_fenlei}>
                            <a className={this.state.orderBy==""?less.xzbztyanse:""} onClick={()=>{this.orderOnClick("","")}}>综合</a>
                            <a className={this.state.orderBy=="mail_flag"?less.xzbztyanse:""} onClick={this.selfOnClick}>免费送货</a>
                            <a onClick={()=>{this.orderOnClick("sale_count","")}}>
                                成交额<span>
                                <Icon type="caret-up" className={this.state.orderBy=="sale_count" && this.state.reverse=="false"?less.xuanzhongzt:""} />
                                <Icon type="caret-down" className={this.state.orderBy=="sale_count" && this.state.reverse=="true"?less.xuanzhongzt:""}/>
                                </span>
                                </a>
                            <a onClick={()=>{this.orderOnClick("price","")}}>价格<span>
                                <Icon type="caret-up"  className={this.state.orderBy=="price" && this.state.reverse=="false"?less.xuanzhongzt:""}/>
                                <Icon type="caret-down" className={this.state.orderBy=="price" && this.state.reverse=="true"?less.xuanzhongzt:""}/>
                                </span>
                                </a>
                            <a onClick={()=>{this.orderOnClick("create_time","")}}>时间<span>
                                <Icon type="caret-up" className={this.state.orderBy=="create_time" && this.state.reverse=="false"?less.xuanzhongzt:""}/>
                                <Icon type="caret-down" className={this.state.orderBy=="create_time" && this.state.reverse=="true"?less.xuanzhongzt:""}/>
                                </span>
                                </a>
                            <a>价格区间<span>
                                <Input id={`storeStartPrice`} onChange={this.priceCommonValidate.bind(this,"storeStartPrice")} size="small" />--<Input id={`storeEndPrice`} onChange={this.priceCommonValidate.bind(this,"storeEndPrice")} size="small"/>
                                <Button size="small" onClick={this.priceOnClick}>确定</Button>
                                </span>
                                </a>
                            <div className={less.liebiaossk}>
                            <SearchInput placeholder=""
                                         onSearch={value => {this.keywordSearch(value)}} style={{ width: 200 }} resetInputRef={this.resetInputRef} paramsObj={this.props.paramsObj}/>
                            </div>
                        </div>
                        <div className={less.lieb_spin}>
                            <Row>
                            {
                                goodsList.map((item,index)=>{
                                    return (
                                        <Col key={index} className={less.gutter_row}>
                                            <div className={less.gutter_box}>
                                                <img src={item.img_url.indexOf("http")>-1?item.img_url:imageOrigin+item.img_url} className={less.goods_img}/>
                                            </div>
                                            <div dangerouslySetInnerHTML={{__html: item.goods_name}} className={less.gutter_text}>
                                            </div>
                                            <div className={less.gutter_wuliu}>
                                                <strong>¥{this.showFixPrice(item.price)}</strong>
                                                <span>{item.mail_flag==1?`免运费`:`买家承担运费`}</span>
                                            </div>
                                        </Col>
                                    )
                                })
                            }
                            </Row>
                        </div>
                        <div className={less.fanye} style={this.state.total>0?{}:{display:"none"}}>
                            <Pagination onChange={this.currentPageOnChange}
                                        current={this.state.current}
                                        pageSize={this.state.pageSize}
                                        total={this.state.total}
                                        showTotal={()=>{return `共有${this.state.total}条记录`}}
                                        showQuickJumper={true}
                                        defaultPageSize={10}
                                        pageSizeOptions={['10', '12', '20', '50', '100', '1000']}
                                        showSizeChanger={true}
                                        onShowSizeChange={this.pageSizeOnChange}
                            />
                        </div>
                        <div style={this.state.total>0?{display:"none"}:{}}>
                            <div className={less.wushuju}>
                                <div className={less.suojin}>
                                <img src={noData}/>
                                <div>抱歉亲！未找到你想要的商品</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={less.clearfancun}>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}


