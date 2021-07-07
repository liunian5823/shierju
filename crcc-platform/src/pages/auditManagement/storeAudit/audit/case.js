import React, { Component } from 'react';
import {Card,Col,Row,Icon,Tree,Button,Table,Input,Modal,Form,InputNumber,TreeSelect,Switch,message, Transfer, Carousel, Menu, Dropdown, Breadcrumb, Pagination } from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'

import less from "./case.less";

import Swiper from 'swiper/dist/js/swiper.min'
import noData from "./img/noData.png";
import 'swiper/dist/css/swiper.min.css'

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};  //左右规格
const FormItem = Form.Item;
const confirm = Modal.confirm;
const imageOrigin = SystemConfig.configs.resourceUrl;
class StoreCase extends React.Component{


    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
    _userInfo = null
    _storeId = null
    _storeTemplateId
    _initCount=0

    constructor(props){
        super(props);
    }
    state = {
        loading: false,
        tableState: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        visible: false,
        pageSize:10,//每页显示的条数
        current:1,//当前页码
        total:0,//总数据条数

        storeCaseList:[],

        modalContent: {},
        goodsInfos:[],//存储被选中的商品数据
        goodsIds:[],
        isReset:{isResetTransfer:false,isResetInitData:false},//是否重置transfer组件 和是否重置transfer的初始化数据
        isEdit:false,
        showSkinClass: "box_waicheng_red",       //设置皮肤颜色
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

    componentDidMount(){

        new Swiper('.swiper-container', {
            loop: true,     //循环
            clickable: true,
            autoplay:{      //自动播放，注意：直接给autoplay:true的话，在点击之后不能再自动播放了
                delay: 2500,
                disableOnInteraction: false,    //户操作swiper之后，是否禁止autoplay。默认为true：停止。
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,    // 允许点击跳转
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.storeId && nextProps.storeTemplateId){
            this._initCount ++;
            this._storeId = nextProps.storeId;
            this._storeTemplateId = nextProps.storeTemplateId;
            if(this._initCount==1){
                this.handelToLoadData();
            }
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
    }


    handleOk = () => {
        this.setState({
            visible: false
        })
    }



    //初始化参数
    baseParams = {  //BaseTable 请求的参数
        'statusArr[0]':1,
        'statusArr[1]':2,
        'statusArr[2]':3,
        'statusArr[3]':4
    }
    //加载数据
    handelToLoadData = (state = 1, tableState = 'tableState') => {
        const storeTemplateId = this._storeTemplateId;

        let {current,pageSize} = this.state;

        api.ajax('GET', '@/portal/ecStoreCase/queryStoreCaseInfoPage', {
            page:current,
            rows:pageSize,
            storeId: this._storeId,
            portalTemplateId:storeTemplateId,
        }).then(r => {
            if (!this._isMounted) {
                return;
            }
            this.state.total = r.data.total;
            this.setState({
                [tableState]: state,
                storeCaseList:r.data.rows,
                total:r.data.total,
            })

        }).catch(r => {
            //Util.alert(r.msg, { type: "error" })
            console.log(r.msg)
        })

    }
    resetData = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
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


    leftMove = (index,pre) =>{
        var page = 1;
        var i = 11; //每版放4个图片
        var content = $("div#swiper"+index);
        var content_list = $("div#wrapper"+index);
        console.log("content_list","======="+content_list)
        var count = content_list.find(".swiper-slide").length;
        console.log("content_list",count.length)
        var v_width = 100;
        var actIndex = parseInt($("div#actIndex"+index).html());
        if(count < i || actIndex == i)
            return;
        actIndex -= 1;
        var v_width = 106;
        console.log("actIndex","======="+actIndex);
        $("div#actIndex"+index).html(actIndex);
        if( !content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
            content_list.animate({ left : '+='+v_width }, "slow");  //通过改变left值，达到每次换一个版面
        }
    }
    rightMove =(index,next)=>{
        var page = 1;
        var i = 11; //每版放11个图片
        var content = $("div#swiper"+index);
        var content_list = $("div#wrapper"+index);
        var count = content_list.find(".swiper-slide").length;
        var actIndex = parseInt($("div#actIndex"+index).html());
        if(count < i || actIndex == count)
            return;
        actIndex += 1;
        var v_width = 106;
        console.log("actIndex","======="+actIndex);
        $("div#actIndex"+index).html(actIndex);
        if(!content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
            content_list.animate({ left : '-='+v_width }, "slow");
        }
    }


    showCaseList = () =>{
        const {storeCaseList} = this.state;
        let htmlList=null;
        if(storeCaseList && storeCaseList.length>0){
            htmlList = storeCaseList.map((item,index)=>{
                const {storeCase,caseGoodsList} = item;
                const likey = 100 + index;
                return (
                    <li key={likey}>
                        <h1>{storeCase.title}</h1>
                        <p>
                            {storeCase.remark}
                        </p>
                        <div id={"actIndex"+index} style={{display:"none"}}>11</div>
                        <div className={less.gundongtu}>
                            <div className={["swiper-container",less.swiper_container].join(' ')} id={"swiper"+index}>
                                <div className={["swiper-wrapper",less.swiper_wrapper].join(' ')} id={"wrapper"+index}>
                                    {this.showCaseGoodsList(caseGoodsList)}
                                </div>
                                <div className={["swiper-pagination",less.swiper_pagination].join(' ')}></div>
                            </div>
                            <div className={["swiper-button-warp",less.swiper_button_warp].join(' ')}>
                                <div className={["swiper-button-next",less.swiper_button_next].join(' ')} onClick={()=>{this.rightMove(index,this)}}><Icon type="right" /></div>
                                <div className={["swiper-button-prev",less.swiper_button_prev].join(' ')} onClick={()=>{this.leftMove(index,this)}}><Icon type="left" /></div>
                            </div>
                        </div>
                    </li>

                )
            })
        }
        return htmlList==null?"":htmlList;
    }

    showCaseGoodsList = (caseGoodsList) =>{
        let imgList = null;
        if(caseGoodsList && caseGoodsList.length>0){
            imgList = caseGoodsList.map((item,index)=>{
                const {goodsId,goodsImg} = item;
                return (
                    <div key={index} className="swiper-slide" style={{width:"105px"}}><img src={goodsImg.indexOf("http")>-1?goodsImg:imageOrigin+goodsImg} style={{width:"100px"}}/>&nbsp;&nbsp;</div>
                )
            })
        }
        return imgList==null?"":imgList
    }

    //商品详情
    handleToDetails = (id) => {
        if(id){
            let protocol = window.location.protocol;
            let host = window.location.host;
            let href = `${protocol}//${host}/cms/goods/showOne?goodsId=${id}`;
            window.open(href);
        }
        // this.props.history.push(this.props.history.location.pathname + '/details' + '/' + uuids);
    }

    render() {

        const { getFieldProps } = this.props.form;
        const textareaProps = getFieldProps('remark', {
            rules: [
                { required: true, message: '请填写文例信息' },
            ],
        });

        return(
            <div className={less[this.state.showSkinClass]}>
            <div className={less.company_case}>
                <div className={less.crumbse}>
                <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <Icon type="home" />
                        <span>首页</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        公司案例
                    </Breadcrumb.Item>
                </Breadcrumb>
                </div>
                <ul className={less.liebiao_case}>
                {
                    this.showCaseList()
                }
                </ul>

                <div className={less.fanye} style={this.state.total>0?{}:{display:"none"}}>
                    <Pagination onChange={this.currentPageOnChange}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                total={this.state.total}
                                showTotal={()=>{return `共有${this.state.total}条记录`}}
                                showQuickJumper={true}
                                defaultPageSize={10}
                                pageSizeOptions={['10', '20', '50', '100', '1000']}
                                showSizeChanger={true}
                                onShowSizeChange={this.pageSizeOnChange}
                    />
                </div>
                <div style={this.state.total>0?{display:"none"}:{}}>
                    <div className={less.wushuju}>
                        <div className={less.suojin}>
                            <img src={noData}/>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;暂无公司案例</div>
                        </div>
                    </div>
                </div>

            </div>
            </div>
        )
    }
}

export default Form.create({})(StoreCase)
