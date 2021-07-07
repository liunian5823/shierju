import React from 'react'
import {Radio, Card,Col,Row,Icon,Tree,Button,Table,Input,Modal,Form,InputNumber,TreeSelect,Switch,message, Transfer, Carousel, Menu, Dropdown,Tooltip} from 'antd';
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig'
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import api from '@/framework/axios'//请求接口的封装
import logo from "./img/logo.png";
import zy3 from "./img/zy3.png";
import zy1 from "./img/zy1.png";
import zy2 from "./img/zy2.png";
import dp from "./img/dp.png";
import gg from "./img/gg.jpg";
import HomeStore from "./home";
import InforStore from "./information";
import ProductStore from "./product";
import ContactStore from "./contact";
import StoreCase from "./case";
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import Footer from "@/pages/footer/Footer";
import BaseInput from '@/components/baseInput';
import less from "./index.less";

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};
const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class Portal extends React.Component{

    _isMounted = false
    _store = null;

    state = {
        showTab: 'homeStore',    //保存当前点击tab页面id
        id: '', //当前门户模板的id
        skin:'red',     //当前门户的皮肤
        showStoreCustomClass: [],       //保存当前店铺自定义分类
        companyName: '',        //保存当前公司的名称
        companyId: '',      //公司id
        storeId: '',        //店铺id
        uuids:'',       //门户的uuids
        companySimpleInfo:{},
        showSkinClass:  "box_waicheng_red",     //展示皮肤默认红色
        paramsObj:null,//url携带的参数对象
        approvalResult: 0,  //默认审核状态 驳回
        auditMas:'',     //审核意见
        remarks:'',    //备注

    }

    componentWillMount() {
        this._isMounted = true;
        //获取当前参数中的门户模板的id
        let _uuids = this.props.match.params.uuids || '';
        if(_uuids != undefined){
            //对url上请求参数的处理
            let params = this.props.match.params.params || '';
            let paramsObj = null;
            if(params){
                paramsObj = JSON.parse(params);
                this.state.paramsObj = paramsObj;
            }


            let uuids = this.state.uuids;
            uuids = _uuids;
            this.setState({
                uuids,
                paramsObj,
            })
            //查询当前的门户信息
            this.queryPortalByUuids(false,uuids);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //传递给子组件的方法
    onRefIndex=(ref)=>{
        this.childCom = ref;
    }

    //
    initData=()=>{
        let _info = {companyId:this.state.companyId}
        PubSub.publish('PubSub_SendCompany', _info);
        //查询当前公司信息
        this.queryCompanyInfo();
        //查询当前店铺信息
        this.queryStoreInfo();
    }

    //重新渲染皮肤颜色
    refreshSkinClass=(skin)=>{
        let showSkinClass = this.state.showSkinClass;
        //重新渲染当前的皮皮肤
        if(skin == 'red'){
            showSkinClass = "box_waicheng_red";
        }
        if(skin == 'orange'){
            showSkinClass = "box_waicheng_orange";
        }
        if(skin == 'blue'){
            showSkinClass = "box_waicheng_blue";
        }
        this.setState({
            showSkinClass
        })
        //刷新子组件中的皮肤
        this.refreshChildSkinClass(showSkinClass);
    }

    //重新刷子组件中的皮肤
    refreshChildSkinClass=(showSkinClass)=>{
        this.childContact.setShowSkinClass(showSkinClass);
        this.childCom.setShowSkinClass(showSkinClass);
    }

    //查询当前门户信息
    queryPortalByUuids=(flag, uuids)=>{
        let _this = this;
        let param = {};
        if(!flag){
            param.uuids = this.state.id;
        }
        //设置是审核状态的商品
        param.approvalFlag = 1;
        //还原
        this.resetDefaultData();
        api.ajax(
            'GET',
            '@/portal/ecPortal/getAuditPortalById',
            {uuids}
        ).then(
            r=>{
                //显示审核部分
                _this.sh_button(false);
                let companyId = this.state.companyId;
                let storeId = this.state.storeId;
                let skin = this.state.skin;
                let id = this.state.id;
                let remarks = this.state.remarks;
                let showSkinClass = this.state.showSkinClass;
                let uuids = this.state.uuids;
                companyId =r.data.companyId;
                storeId = r.data.storeId;
                skin = r.data.skin;
                id = r.data.id;
                remarks = r.data.remarks;
                uuids = r.data.uuids;
                if(skin == 'blue'){
                    showSkinClass = "box_waicheng_blue";
                }
                if(skin == 'orange'){
                    showSkinClass = "box_waicheng_orange";
                }
                this.setState({
                    companyId,
                    storeId,
                    skin,
                    id,
                    remarks,
                    showSkinClass,
                    uuids
                })
                this.initData();
                //调用home组件
                this.childCom.setPortalTemplateId(id, r.data.skin, companyId);
                //给联系我们子组件设置店铺id
                this.childContact.setContactStoreId(r.data.storeId);
                this.childContact.setPortalId(r.data.id);
                //刷新子组件皮肤
                this.refreshChildSkinClass(showSkinClass);
            }
        ).catch(
            r=>{
                if(!r.data || r.data.length<=0){
                    if(r.code == '90038'){
                        Util.alert(r.msg)
                    }
                    //Util.alert(r.msg);
                    console.log(r.msg)
                }
            }
        )
    }

    //查询当前公司信息
    queryCompanyInfo=()=>{
        let companyId = this.state.companyId;
        api.ajax(
            'GET',
            '@/portal/ecStore/queryCompanyById',
            {companyId}
        ).then(
            r=>{
                let companyName = this.state.companyName;
                companyName = r.data.name;
                this.childContact.setContactCompanyName(companyName);
                this.setState({
                    companyName
                })

                let cuuids = r.data.uuids;
                //获取是否支持铁建银信的信息
                api.ajax("GET", "@/supplier/ecCompanySupplier/chinaRailwayBank", {
                    uuids:cuuids
                })
                    .then(r => {
                        if (!this._isMounted) {
                            return;
                        }
                        const status = JSON.parse(r.data.data).compStatus;
                        let {companySimpleInfo} = this.state;
                        companySimpleInfo.bankStatus = status;
                        this.setState({
                            companySimpleInfo
                        });
                    }).catch(r => {});

                //获取公司等级信息和公司类型新消息
                api.ajax("GET", "@/supplier/ecCompanyInfoSupplier/getCompanySimpleInfo", {
                    id:companyId
                })
                    .then(r => {
                        if (!this._isMounted) {
                            return;
                        }
                        let {companySimpleInfo} = this.state;
                        companySimpleInfo.companyRating = r.data.companyRating;//供应商等级
                        companySimpleInfo.showType = r.data.showType;//展示类型1、认证商家 2、铁建推荐3、铁建自营（更换employed字段展示）
                        companySimpleInfo.factoryType = r.data.factoryType;//// 1.生产厂家 2.贸易集成商 3 个体工商户
                        companySimpleInfo.employed = r.data.employed;//是否自营（0是，1否）
                        companySimpleInfo.mainBusinessName = r.data.mainBusinessName;//公司地址
                        companySimpleInfo.address = r.data.address;//公司地址
                        companySimpleInfo.areaStr = r.data.areaStr;//公司省市区信息
                        companySimpleInfo.orderNum = r.data.orderNum;//成交订单数
                        companySimpleInfo.orderTotalPrice = r.data.orderTotalPrice;//成交订单总金额
                        companySimpleInfo.orderBuyerCount = r.data.orderBuyerCount;//合作单位数量
                        //this.state.companySimpleInfo = companySimpleInfo;
                        this.setState({
                            companySimpleInfo
                        });
                    }).catch(r => {});
            }
        ).catch(
            r=>{
                //Util.alert("查询公司信息失败！");
                console.log("查询公司信息失败！");
                return;
            }
        )
    }

    //查询当前店铺信息
    queryStoreInfo=()=>{
        let companyId = this.state.companyId;
        api.ajax(
            'GET',
            '@/portal/ecStore/selectStoreBycompanyId',
            {companyId}
        ).then(
            r=>{
                this._store = r.data;
                this.publishStoreInfo();
            }
        ).catch(
            r=>{
                //Util.alert("查询店铺信息失败！");
                console.log("查询店铺信息失败！")
                return;
            }
        )
    }

    publishStoreInfo = ()=>{
        PubSub.publish('PubSub_SendStore', this._store);
        let {classType} = this._store;
        if(classType==1){//开启自定义分类
            //查询店铺自定义分类
            this.queryStoreCustomClass();
        }else{
            //展示商城分类
            this.getGoodsClass();
        }

    }

    //查询当前店铺的分类
    queryStoreCustomClass=()=>{
        let companyId = this.state.companyId;
        let pId = -1;
        api.ajax(
            'GET',
            '@/portal/ecGoodsCustomClass/getAllShowGoodsCusClass',
            {pId, companyId}
        ).then(r=>{
            let showStoreCustomClass = this.state.showStoreCustomClass;
            showStoreCustomClass = [];
            showStoreCustomClass = r.data.rows;
            this.setState({
                showStoreCustomClass
            })
        }).catch(r=>{
            console.log("分类查询失败！")
            // Util.alert("分类查询失败！");
        })
    }

    //查询左侧商城分类信息
    getGoodsClass=()=>{
        let companyId = this.state.companyId;
        api.ajax(
            'GET',
            '@/merchandise/ecGoods/getGoodsClassFromSolr',
            {companyId,}
        ).then(r=>{
            let showStoreCustomClass = this.state.showStoreCustomClass;
            showStoreCustomClass = [];
            showStoreCustomClass = r.data.rows;
            this.setState({
                showStoreCustomClass
            })

        }).catch(r=>{
            console.log("分类查询失败！");
        })
    }

    //
    clickTab=(tabName)=>{
        let showTab = this.state.showTab;
        showTab = tabName;
        this.setState({
            showTab
        })
    }

    //传递给子组件联系我们的方法
    onRefContact=(ref)=>{
        this.childContact = ref;
    }

    //收藏店铺
    /*clickFavoriteStore=()=>{
        //店铺的信息
        let storeId = this.state.storeId;
        console.log("收藏的店铺id是：", storeId)
        api.ajax(
            'GET',
            '@/portal/ecStore/favoriteStore',
            {storeId}
        ).then(
            r=>{
                Util.alert("收藏成功!");
                return;
            }
        ).catch(
            r=>{
                console.log("收藏失败！", r );
                Util.alert(r.msg, {type: "error"});
                return;
            }
        )
    }*/

/*    //店铺相关评级展示
    showStoreRating =(type)=>{
        let {companySimpleInfo} = this.state;
        if(type=="companyRating"){//供应商等级
            let companyRating = companySimpleInfo.companyRating;
            if(companyRating!=undefined && companyRating!=null){
                if(companyRating==0){
                    return <a>{`差`}</a>;
                }else if(companyRating==1){
                    return <a>{`良`}</a>;
                }else if(companyRating==2){
                    return <a>{`优`}</a>;
                }else {
                    return ""
                }
            }else{
                return "";
            }
        }else if(type=="factoryType"){//供应商类型
            let factoryType = companySimpleInfo.factoryType;
            if(factoryType){
                if(factoryType==1){
                    return <a>{`厂`}</a>
                }else if(factoryType==2){
                    return <a>{`贸`}</a>
                }else if(factoryType==3){
                    return <a>{`个`}</a>
                }else{
                    return "";
                }
            }else{
                return "";
            }
        }else if(type=="bankStatus"){//铁建银信
            let bankStatus = companySimpleInfo.bankStatus;
            if(bankStatus){
                if(bankStatus==40){//审批通过
                    return <a>{`铁`}</a>;
                }else{
                    return ""
                }
            }else{
                return "";
            }
        }
    }*/


    //店铺相关评级展示
    showStoreRating =(type)=>{
        let {companySimpleInfo} = this.state;
        if(type=="companyRating"){//供应商等级
            let companyRating = companySimpleInfo.companyRating;
            if(companyRating!=undefined && companyRating!=null){
                if(companyRating==0){
                    return <Tooltip placement="bottom" title={"铜牌等级供应商"}><a>{`铜`}</a></Tooltip>;
                }else if(companyRating==1){
                    return <Tooltip placement="bottom" title={"银牌等级供应商"}><a>{`银`}</a></Tooltip>;
                }else if(companyRating==2){
                    return <Tooltip placement="bottom" title={"金牌等级供应商"}><a>{`金`}</a></Tooltip>;
                }else {
                    return <Tooltip placement="bottom" title={"普通等级供应商"}><a>{`普`}</a></Tooltip>
                }
            }else{
                return <Tooltip placement="bottom" title={"普通等级供应商"}><a>{`普`}</a></Tooltip>;
            }
        }else if(type=="factoryType"){//供应商类型
            let factoryType = companySimpleInfo.factoryType;
            if(factoryType){
                if(factoryType==1){
                    return <Tooltip placement="bottom" title={"生产制造型企业"}><a>{`产`}</a></Tooltip>
                }else if(factoryType==2){
                    return <Tooltip placement="bottom" title={"贸易销售型企业"}><a>{`贸`}</a></Tooltip>
                }else if(factoryType==3){
                    return <Tooltip placement="bottom" title={"个体工商户"}><a>{`个`}</a></Tooltip>
                }else{
                    return "";
                }
            }else{
                return "";
            }
        }else if(type=="bankStatus"){//铁建银信
            let bankStatus = companySimpleInfo.bankStatus;
            if(bankStatus){
                if(bankStatus==40){//审批通过
                    return <Tooltip placement="bottom" title={"供应商可接受铁建银信支付"}><a>{`信`}</a></Tooltip>;
                }else{
                    return ""
                }
            }else{
                return "";
            }
        }
    }


    showCompanyMenuInfo = ()=>{
        let {companySimpleInfo} = this.state;
        if(companySimpleInfo){
            return (
                <div className={less.leimu_tanchukuang}>
                    <div className={less.informationlei}>
                        <p>主营产品：<span>{companySimpleInfo&&companySimpleInfo.mainBusinessName?companySimpleInfo.mainBusinessName:""}</span></p>
                        <p>经营模式：<span>
                        {
                            (function () {
                                let typeName = "";
                                if(companySimpleInfo&&companySimpleInfo.factoryType){
                                    const factoryType = companySimpleInfo.factoryType;
                                    switch (factoryType) {
                                        case 1:
                                            typeName = "生产厂家"
                                            break;
                                        case 2:
                                            typeName = "贸易集成商"
                                            break;
                                        case 3:
                                            typeName = "个体工商户"
                                            break;
                                    }
                                }
                                return typeName;
                            })()
                        }
                    </span></p>
                        <p>所在地：<span>{this.showAreaInfo(companySimpleInfo?companySimpleInfo.areaStr:"",companySimpleInfo?companySimpleInfo.address:"")}</span></p>
                        <p>成交订单：<span><b>{companySimpleInfo&&companySimpleInfo.orderNum?companySimpleInfo.orderNum:"0"}</b>笔</span></p>
                        <p>成交金额：<span><b>{this.showTotalPrice(companySimpleInfo.orderTotalPrice)}</b>元</span></p>
                        <p>合作单位：<span><b>{companySimpleInfo&&companySimpleInfo.orderBuyerCount?companySimpleInfo.orderBuyerCount:"0"}</b>家</span></p>
                    </div>
                    <div className={less.inforbutton}><a>访问门户</a><a className={less.shouchanghong}>收藏店铺</a></div>
                </div>
            )
        }

    }
    //展示地址信息
    showAreaInfo = (areaStr,address)=>{
        if(address){

            if(areaStr){
                return `${areaStr}-${address}`
            }else{
                return address
            }

        }
        return ""

    }

    //格式化钱的显示
    showTotalPrice = (price)=>{
        if(price){
            try {
                let money = parseFloat(price);
                if (money >= 10000)
                    return (money / 10000).toFixed(2) + "万";
                else
                    return money.toFixed(2);
            } catch (e) {
                return "0"
            }
        }else{
            return "0"
        }
    }


    //审核功能
    //审核状态该表的字段
    onChangeApprovalResult=(e)=>{
        console.log("onChangeApprovalResult --- ", e)
        let approvalResult = this.state.approvalResult;
        approvalResult = e;
        this.setState({
            approvalResult
        })
    }

    //返回方法
    handleGoBack = () => {
        this.props.history.goBack()
    }

    //提交
    handleSubmit=()=>{
        let _this = this;
        if(this.state.approvalResult == 0 && !this.state.auditMas){
            Util.alert("请填写审核意见!");
            return;
        }
        api.ajax("POST", "@/portal/ecPortal/approvalPortal", {
            uuids: this.state.uuids,
            status:(this.state.approvalResult==1?2:3),//2 发布中，审核通过 ; 3 发布失败，审核不通过;
            auditReason:this.state.auditMas//,//审核意见
        }).then(r => {
            let msg = this.state.approvalResult==1?"操作成功，门户审核已通过":"操作成功，门户审核已驳回";

            //还原值
            _this.resetDefaultData();
            _this.sh_button();
            //自动走下一个
            Util.alert(msg,{callback:this.toNextEvaluatePortam});
        }).catch(r => {
            if(r.code == "90057"){
                Util.alert(r.msg);
                return;
            }
            Util.alert("操作失败，请稍后再试");
        });

    }

    //进入下一个待审核商品
    toNextEvaluatePortam = ()=>{
        var main = document.getElementById('main');
        main.scrollTop = 0;
        this.queryPortalByUuids(true, null);
    }

    //
    resetDefaultData=()=>{
        this.state.auditMas = "";
        this.state.approvalResult = 0;
        this.setState({
            auditMas:"",
            approvalResult:0,
        });
    }

    //
    sh_button=(falg=true)=>{
        if(falg == true){
            $("#handleSubmit").hide();
            $("#divauditMas").hide();
            console.log("隐藏审核模块")
        }
        else if(falg  == false){
            $("#handleSubmit").show();
            $("#divauditMas").show();
            console.log("显示审核模块")
        }

    }
    //审核意见的输入控制
    onChange=(event,name,isNumber=null)=>{
        //进行限制
        if(isNumber){
            if(event.target.value){
                if (event.target.value.length == 1) {
                    event.target.value = event.target.value.replace(/[^1-9]/g, '');
                } else {
                    event.target.value = event.target.value.replace(/\D/g, '');
                }
                if(event.target.value > 999999999)
                    event.target.value = 999999999
            }
        }
        this.state[name] = event.target.value;
        this.setState(this.state);
    }

    handleTitle = title =>{
        let titleName = title
        if (titleName && titleName.length > 10) {
            titleName = `${titleName.substring(0, 10)}...`;
        }
        return titleName;
    }


    render(){
        let {companySimpleInfo} = this.state;
        let showStoreCustomClass = this.state.showStoreCustomClass;        //保存店铺自定义分类的数据
        return(
            <div className={less[this.state.showSkinClass]}>
                <div className={less.top_quyu}>
                    <div className={less.logo}>
                        <img src={logo} />
                    </div>
                    <div className={less.shangjia}>
                        <Dropdown overlay={this.showCompanyMenuInfo()} trigger={['hover']}>
                            <div>
                                <a className={less.ant_dropdown_link} href="#">
                                    {this.state.companyName} <Icon type="caret-down" />
                                </a>
                                <div className={less.tuijian}>
                                    {(function(){
                                        let showTypeSrc = "";
                                        if(companySimpleInfo&&companySimpleInfo.showType){
                                            const showType = companySimpleInfo.showType;
                                            switch (showType) {
                                                case 1:
                                                    showTypeSrc = zy2
                                                    break;
                                                case 2:
                                                    showTypeSrc = zy3
                                                    break;
                                                case 3:
                                                    showTypeSrc = zy1
                                                    break;
                                            }
                                        }
                                        if(companySimpleInfo && companySimpleInfo.employed == 0) showTypeSrc = zy1;
                                        return ( <img src={showTypeSrc} />);

                                    })()}
                                    {this.showStoreRating("companyRating")}
                                    {this.showStoreRating("factoryType")}
                                    {this.showStoreRating("bankStatus")}
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                    <div className={less.sousuo}>
                        <div className={less.shouchangdp} >
                            <img src={dp} />收藏店铺
                        </div>
                        <Input id={"storeSearchInput"} placeholder="请在此输入您想要采购的商品" defaultValue={this.state.paramsObj?this.state.paramsObj.search_goods_keywords?this.state.paramsObj.search_goods_keywords:"":""} className={less.sskuang} />
                        <Button type="primary" size="large" className={less.bendian}>搜本店</Button>
                        <Button type="primary" size="large" className={less.quanzhan}>搜全站</Button>
                    </div>
                </div>
                <div className={less.guanggao}>
                    {/*<Icon type="cross-circle" />*/}
                    <a href={'https://www.crccmall.com/static/crccmall/index.html#/register'} target={'_block'}><img src={gg} /></a>
                </div>
                <div className={less.nav}>
                    <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" className={less.naohanglan}>
                        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>全部商品分类</span></span>} className={less.classification}>
                            {
                                showStoreCustomClass.map((item, index)=>{
                                    let titleName = this.handleTitle(item.name);
                                    if(item.list && item.list.length){
                                        return(
                                            <SubMenu key={`class1_${index}`} title={titleName}>
                                                {
                                                    item.list.map((it, index)=>{
                                                        let titleName2 = this.handleTitle(it.name);
                                                        if(it.list && it.list.length){
                                                            return (
                                                                <SubMenu key={`class2_${index}`} title={titleName2}>
                                                                    {
                                                                        it.list.map((itt, index)=>{
                                                                            let titleName3 = this.handleTitle(itt.name);
                                                                            return (
                                                                                <Menu.Item key={`class3_${index}`}>{titleName3}</Menu.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </SubMenu>
                                                            )
                                                        }else{
                                                            return (
                                                                <Menu.Item key={`class3_${index}`}>{titleName2}</Menu.Item>
                                                            )
                                                        }
                                                    })
                                                }
                                            </SubMenu>
                                        )
                                    }else{
                                        return (
                                            <Menu.Item key={`class3_${index}`}>{titleName}</Menu.Item>
                                        )
                                    }

                                })
                            }
                        </SubMenu>
                        <Menu.Item>
                            <a onClick={this.clickTab.bind(this, "homeStore")} className={this.state.showTab == 'homeStore'?less.beijing_show:less.beijing_hide}>首页</a>
                        </Menu.Item>
                        <Menu.Item>
                            <a  onClick={this.clickTab.bind(this, "inforStore")} className={this.state.showTab == 'inforStore'?less.beijing_show:less.beijing_hide}>企业信息</a>
                        </Menu.Item>
                        <Menu.Item>
                            <a onClick={this.clickTab.bind(this, "productStore")} className={this.state.showTab == 'productStore'?less.beijing_show:less.beijing_hide}>供应产品</a>
                        </Menu.Item>
                        <Menu.Item>
                            <a onClick={this.clickTab.bind(this, "caseStore")} className={this.state.showTab == 'caseStore'?less.beijing_show:less.beijing_hide}>公司案例</a>
                        </Menu.Item>
                        <Menu.Item>
                            <a  onClick={this.clickTab.bind(this, "contactStore")} className={this.state.showTab == 'contactStore'?less.beijing_show:less.beijing_hide}>联系方式</a>
                        </Menu.Item>
                    </Menu>
                </div>
                {/*/!*首页*!/*/}
                <div className={this.state.showTab == 'homeStore'?less.custom_show:less.custom_hide}>
                    <HomeStore onRefIndex={this.onRefIndex}/>
                </div>
                {/*公司案例*/}
                <div className={this.state.showTab == 'caseStore'?less.custom_show:less.custom_hide}>
                    <StoreCase storeId={this._store?this._store.id:null} skinClass={this.state.showSkinClass} storeTemplateId={this.state.id}/>
                </div>
                {/*/!*企业信息*!/*/}
                <div className={this.state.showTab == 'inforStore'?less.custom_show:less.custom_hide}>
                    <InforStore storeInfo={this._store?this._store:null} companySimpleInfo={this.state.companySimpleInfo} storeTemplateId={this.state.id} skinClass={this.state.showSkinClass} />
                </div>
                {/*/!*联系方式*!/*/}
                <div className={this.state.showTab == 'contactStore'?less.custom_show:less.custom_hide}>
                    <ContactStore onRefContact={this.onRefContact}/>
                </div>
                {/*/!*供应产品*!/*/}
                <div className={this.state.showTab == 'productStore'?less.custom_show:less.custom_hide}>
                    <ProductStore onRefProduct={this.onRefProduct} storeName={this._store?this._store.storeName:null} skinClass={this.state.showSkinClass} paramsObj={this.state.paramsObj}/>
                </div>
                <div className={less.bottomxx}>
                    <Footer/>
                </div>
                <div>
                    <Form>
                        <div id="divauditMas">
                            <Card className={less.kapian} title="审核意见"	bordered={false} >
                                <div>
                                    <FormItem {...formItemLayout} label="审核结果">
                                        <Radio key="a" value={1} checked={this.state.approvalResult==1?true:false} onChange={this.onChangeApprovalResult.bind(this, 1)}>审核通过</Radio>
                                        <Radio key="b" value={0} checked={this.state.approvalResult==0?true:false} onChange={this.onChangeApprovalResult.bind(this, 0)}>驳回</Radio>
                                    </FormItem>
                                    <FormItem   {...formItemLayout} required={this.state.approvalResult==0?true:false} label="审核意见">
                                        <BaseInput  type="textarea" maxLength='400' rows={5} value={this.state.auditMas} onChange={(e)=>this.onChange(e,"auditMas")}/>
                                    </FormItem>
                                    <FormItem   {...formItemLayout} className={this.state.remarks?less.custom_show:less.custom_hide} label="备注">
                                        <span>{this.state.remarks}</span>
                                    </FormItem>
                                </div>
                            </Card>
                        </div>
                        <BaseAffix>
                            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                                    onClick={this.handleGoBack}>返回</Button>
                            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                                    onClick={() => (this.queryPortalByUuids(true, null))}>上一个</Button>
                            <Button id="handleSubmit" type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                                    onClick={this.handleSubmit.bind()}>提交</Button>
                            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                                    onClick={() => (this.toNextEvaluatePortam())}>下一个</Button>
                        </BaseAffix>
                    </Form>
                </div>
            </div>
        )
    }
}