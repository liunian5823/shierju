import React from 'react';
import {Card,Col,Row,Icon,Tree,Button,Table, Breadcrumb, Pagination, Checkbox,Tooltip} from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'



import zy1 from "./img/zy1.png";
import zy2 from "./img/zy2.png";
import zy3 from "./img/zy3.png";
import rz1 from "./img/rz1.png";
import rz2 from "./img/rz2.png";
import rz3 from "./img/rz3.png";
import rz4 from "./img/rz4.png";
import rz11 from "./img/rz11.png";
import rz22 from "./img/rz22.png";
import rz33 from "./img/rz33.png";
import rz44 from "./img/rz44.png";
import companySrc from "./img/jj.png";
import dd1 from "./img/1.png";
import dd2 from "./img/2.png";
import dd3 from "./img/3.png";
import dd4 from "./img/4.png";
import yyzz from "./img/yyzz.png";

import rz1_cha from "./img/rz11-tong.png";
import rz1_liang from "./img/rz11-yin.png";
import rz1_you from "./img/rz11-jin.png";
import rz1_pu from "./img/rz1-pu.png";
import rz2_jin from "./img/rz2-jin.png";
import rz2_tong from "./img/rz2-tong.png";
import rz2_yin from "./img/rz2-yin.png";
import rz3_chang from "./img/rz3-chang.png";
import rz3_ge from "./img/rz3-ge.png";
import rz3_mao from "./img/rz3-mao.png";

import less from "./information.less";
import StatisticsStore from "./statistics";

import Swiper from 'swiper/dist/js/swiper.min'
import 'swiper/dist/css/swiper.min.css'
import Album from 'uxcore-album';
const { Photo } = Album;
const imageOrigin = SystemConfig.configs.resourceUrl;
export default class InforStore extends React.Component{


    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
    _initCount=0
    _initCount2=0

    constructor(props){
        super(props);
    }
    boxsize={width:"300px",height:"300px",border:"1px dashed #d9d9d9"};
    iconstyle={"font-size":"40px","margin-bottom":"0px",color:"#ccc",position:"absolute",top:"110px",left:"130px"};
    textstyle={position:"absolute",top:"160px",left:"90px", width:"120px","padding-top":"8px"};
    noimg = {width: "100%",height: "100%","line-height": "240px","font-size": "21px"};
    noimgInco={display:"none"};
    state = {
        loading: false,
        tableState: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        visible: false,
        v_width:0,

        companyBaseInfo:{}, //企业基本信息
        storeInfo:{},//店铺信息
        countInfo:{},//平台交易统计信息
        companyLicenseFields:[],//公司资质图片路径数组
        companyLicenses:[],//公司企业资质ec_store_img表中的部分
        companyRemark:"",//公司简介文字信息
        companyIntroSrc:"",//公司简介图片
        companySimpleInfo:{},
        storeTemplateId:null,//店铺模板id
        showSkinClass:'box_waicheng_red',   //
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
    }

    componentDidMount(){
        new Swiper('.swiper-container', {
            /*slidesPerView: 3,
            spaceBetween: 30,*/
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.storeInfo){
            this._initCount ++;
            if(this._initCount==1){
                this.setState({storeInfo:nextProps.storeInfo})
            }
        }
        if(nextProps.companySimpleInfo){
            this.setState({companySimpleInfo:nextProps.companySimpleInfo});
        }
        if(nextProps.storeTemplateId){
            this.setState({storeTemplateId:nextProps.storeTemplateId})
            this._initCount2 ++;
            if(this._initCount2==1) {
                this.handleToLoadOtherInfo(nextProps.storeTemplateId);
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
        this.handelToLoadData();
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
        //获取公司基本信息
        api.ajax('GET', '@/supplier/ecCompanyInfoSupplier/getCompanyBaseInfo', {
            ...this.baseParams,
        }).then(r => {
            if (!this._isMounted) {
                return;
            }

            const companyBaseInfo = r.data;
            this.setState({companyBaseInfo})


        }).catch(r => {
            //Util.alert(r.msg, { type: "error" })
            console.log(r.msg)
        })


        //查询当前的店铺统计信息
        this.childStatistics.setStatisticsCompanyId(this._userInfo.companyId);

    }

    handleToLoadOtherInfo = (id)=>{
        //获取公司简介,公司简介图片,公司资质字段
        api.ajax('GET', '@/portal/ecPortal/getById', {
            id
        }).then(r => {
            if (!this._isMounted) {
                return;
            }

            const portalInfo = r.data;
            if(portalInfo){
                const {companyIntro,companyIntroSrc,companyLicenseFields} = portalInfo;
                let companyLicenseFieldsArr = [];
                if(companyLicenseFields){
                    companyLicenseFieldsArr = companyLicenseFields.split(",");
                }
                this.setState({companyRemark:companyIntro,companyIntroSrc,companyLicenseFields:companyLicenseFieldsArr})
            }

        }).catch(r => {
            //Util.alert(r.msg, { type: "error" })
            console.log(r.msg)
        })

        //获取ec_store_img表中的企业资质信息
        api.ajax('GET', '@/portal/ecStoreImg/all', {
            portalTemplateId:id,
            type:2
        }).then(r => {
            if (!this._isMounted) {
                return;
            }

            let {companyLicenses} = this.state;
            companyLicenses = r.data.rows;
            this.setState({companyLicenses});

        }).catch(r => {
            //Util.alert(r.msg, { type: "error" })
            console.log(r.msg)
        })
    }

    leftMove = (pre) =>{
        var i = 5; //每版放5个图片
        var content_list = $("ul#zz_ul");
        var count = content_list.find("li").length;
        var actIndex = parseInt($("div#actIndex").html());
        if(count < i || actIndex == i)
            return;
        actIndex -= 1;
        var v_width = 235;
        this.state.v_width = this.state.v_width +v_width;
        $("div#actIndex").html(actIndex);
        if( !content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
            content_list.css({ transform : "translate3d("+this.state.v_width+"px, 0px, 0px)" });
        }
    }
    rightMove =(next)=>{
        var i = 5; //每版放11个图片
        var content_list = $("ul#zz_ul");
        var count = content_list.find("li").length;
        var actIndex = parseInt($("div#actIndex").html());
        if(count < i || actIndex == count)
            return;
        actIndex += 1;
        var v_width = -235;
        this.state.v_width = this.state.v_width +v_width;
        $("div#actIndex").html(actIndex);
        if(!content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
            content_list.css({ transform : "translate3d("+this.state.v_width+"px, 0px, 0px)" });
        }
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

    showImageInfo = ()=>{
        const{companyInfo} = this.state.companyBaseInfo;
        const{companyLicenseFields,companyLicenses} = this.state;
        if(companyInfo){
            let {accountPermitPath,businessLicensePath,taxRegistrationPath,companyQualificationPath,organizationCertificatePath,taxEligibilityPath} = companyInfo;
            let pathArr = [{name:"开户许可证",imgPath:accountPermitPath,key:"accountPermitPath"},{name:"营业执照",imgPath:businessLicensePath,key:"businessLicensePath"},{name:"税务登记证",imgPath:taxRegistrationPath,key:"taxRegistrationPath"},{name:"企业资质",imgPath:companyQualificationPath,key:"companyQualificationPath"},{name:"组织机构代码证",imgPath:organizationCertificatePath,key:"organizationCertificatePath"},{name:"纳税证明",imgPath:taxEligibilityPath,key:"taxEligibilityPath"}];
            if((!companyLicenses || companyLicenses.length<1) && (!companyLicenseFields || companyLicenseFields.length < 1)){
                this.noimgInco = {display:"none"}
                return (<li style={this.noimg}>暂无可展示的内容</li>);
            }
            this.noimgInco={display:"block"};
            let liArr = [];
            pathArr.map((item,index)=>{
                if(item.imgPath){
                    let fieldIndex = companyLicenseFields.findIndex(field => field === item.key);
                    if(fieldIndex>-1){
                        liArr.push(<li onClick={this.showPic.bind(this, item.imgPath)} key={index} className={less.swiper_slide}><a><img src={imageOrigin+item.imgPath} /></a><span>{item.name}</span></li>)
                    }
                }
            })

            if(companyLicenses&&companyLicenses.length){
                let cLArr = companyLicenses.map((item,index)=>{
                    return (<li onClick={this.showPic.bind(this, item.src)} key={(index+1)+liArr.length} className={less.swiper_slide}><a><img src={imageOrigin+item.src} /></a><span>{item.title}</span></li>)
                })

                liArr = [...liArr,...cLArr];
            }

            return liArr;
        }
        return "";
    }


    //上传图片成功
    uploadSuccess = (imgUrl, filename) => {
        this.setState({
            [filename]: imgUrl
        })
    }

    //
    onRefStatistics=(ref)=>{
        this.childStatistics = ref;
    }

    showCompanyImg =()=>{
        let {companyIntroSrc} = this.state;
        if(companyIntroSrc){
            return (
                <img src={imageOrigin+companyIntroSrc} />
            )
        }else{
            return (
                <img src={companySrc} />
            )
        }
    }

/*    showCompanyAuthInfo=() =>{
        let {companySimpleInfo} = this.state;
        let {companyRating,factoryType,bankStatus} = companySimpleInfo;
        let yesArr = new Array();
        let noArr = new Array();
        if(companyRating!=undefined && companyRating!=null){

            switch (companyRating) {
                case 0:
                    yesArr.push(<li><img src={rz1_cha} />供应商等级</li>);
                    break;
                case 1:
                    yesArr.push(<li><img src={rz1_liang} />供应商等级</li>);
                    break;
                case 2:
                    yesArr.push(<li><img src={rz1_you} />供应商等级</li>);
                    break;
                default:
                    noArr.push(<li><img src={rz11} />供应商等级</li>);
            }
        }else{
            noArr.push(<li><img src={rz11} />供应商等级</li>);
        }
        if(factoryType){

            switch (factoryType) {
                case 1:
                    yesArr.push(<li><img src={rz3_chang} />供应商类型</li>);
                    break;
                case 2:
                    yesArr.push(<li><img src={rz3_mao} />供应商类型</li>);
                    break;
                case 3:
                    yesArr.push(<li><img src={rz3_ge} />供应商类型</li>);
                    break;
                default:
                    noArr.push(<li><img src={rz33} />供应商类型</li>);
            }
        }else{
            noArr.push(<li><img src={rz33} />供应商类型</li>);
        }
        if(bankStatus){
            yesArr.push(<li><img src={rz4} />铁建银信</li>);
        }else{
            noArr.push(<li><img src={rz44} />铁建银信</li>);
        }
        noArr.push(<li><img src={rz22} />质保金认证</li>);
        let allArr = [...yesArr,...noArr];

        return allArr.map((item,index)=>{
            return item;
        })

    }*/

    showCompanyAuthInfo=() =>{
        let {companySimpleInfo} = this.state;
        let {companyRating,factoryType,bankStatus} = companySimpleInfo;
        let yesArr = new Array();
        let noArr = new Array();
        if(companyRating!=undefined && companyRating!=null){

            switch (companyRating) {
                case 0:
                    yesArr.push(<Tooltip placement="bottom" title={"铜牌等级供应商"}><li><img src={rz1_cha} />供应商等级</li></Tooltip>);
                    break;
                case 1:
                    yesArr.push(<Tooltip placement="bottom" title={"银牌等级供应商"}><li><img src={rz1_liang} />供应商等级</li></Tooltip>);
                    break;
                case 2:
                    yesArr.push(<Tooltip placement="bottom" title={"金牌等级供应商"}><li><img src={rz1_you} />供应商等级</li></Tooltip>);
                    break;
                default:
                    noArr.push(<Tooltip placement="bottom" title={"普通等级供应商"}><li><img src={rz1_pu} />供应商等级</li></Tooltip>);
            }
        }else{
            noArr.push(<Tooltip placement="bottom" title={"普通等级供应商"}><li><img src={rz1_pu} />供应商等级</li></Tooltip>);
        }
        if(factoryType){

            switch (factoryType) {
                case 1:
                    yesArr.push(<Tooltip placement="bottom" title={"生产制造型企业"}><li><img src={rz3_chang} />供应商类型</li></Tooltip>);
                    break;
                case 2:
                    yesArr.push(<Tooltip placement="bottom" title={"贸易销售型企业"}><li><img src={rz3_mao} />供应商类型</li></Tooltip>);
                    break;
                case 3:
                    yesArr.push(<Tooltip placement="bottom" title={"个体工商户"}><li><img src={rz3_ge} />供应商类型</li></Tooltip>);
                    break;
                default:
                    noArr.push(<Tooltip placement="bottom" title={""}><li><img src={rz33} />供应商类型</li></Tooltip>);
            }
        }else{
            noArr.push(<Tooltip placement="bottom" title={""}><li><img src={rz33} />供应商类型</li></Tooltip>);
        }
        if(bankStatus){
            yesArr.push(<Tooltip placement="bottom" title={"供应商可接受铁建银信支付"}><li><img src={rz4} />铁建银信</li></Tooltip>);
        }else{
            noArr.push(<Tooltip placement="bottom" title={"供应商暂不接受铁建银信支付"}><li><img src={rz44} />铁建银信</li></Tooltip>);
        }
        noArr.push(<Tooltip placement="bottom" title={"供应商未缴纳企业质量保证金"}><li><img src={rz22} />质保金认证</li></Tooltip>);
        let allArr = [...yesArr,...noArr];

        return allArr.map((item,index)=>{
            return item;
        })

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
    //展示营业期限
    showRuningTime = (start,end)=>{
        if(!start||!end){
            return ""
        }
        if (end == 1) {
            return moment(start).format("YYYY-MM-DD") + " -- 长期";
        } else {
            return moment(start).format("YYYY-MM-DD") + "--" + moment(end).format("YYYY-MM-DD");
        }
    }

    render() {

        const{companyInfo,company,mainBusinessName} = this.state.companyBaseInfo;
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
                                企业信息
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className={less.information_company}>
                        <h1 className={less.biaoti_infor}>
                            {company&&company.name?company.name:""}
                            {(function(){
                                let showTypeSrc = "";
                                if(companyInfo&&companyInfo.showType){
                                    const showType = companyInfo.showType;
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
                                    if(companyInfo.employed == 0){
                                        showTypeSrc = zy1;
                                    }
                                }
                                return ( <img src={showTypeSrc} />);

                            })()}
                        </h1>
                        <ul className={less.renzheng}>
                            {
                                this.showCompanyAuthInfo()
                            }
                        </ul>
                        <table className={less.biaoge_infor} cellPadding={0} cellSpacing={0} border="1" width="100%">
                            <tbody>
                            <tr>
                                <td className={less.hongse_bt}>法定代表人：</td>
                                <td>
                                    {companyInfo&&companyInfo.legalPersonName?companyInfo.legalPersonName:""}
                                </td>
                                <td className={less.hongse_bt}>企业类型：</td>
                                <td>
                                    {
                                        (function () {
                                            let typeName = "";
                                            if(companyInfo&&companyInfo.factoryType){
                                                const factoryType = companyInfo.factoryType;
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
                                </td>
                            </tr>
                            <tr>
                                <td className={less.hongse_bt}>社会统一信用代码：</td>
                                <td>
                                    {company&&company.businessLicense?company.businessLicense:""}
                                </td>
                                <td className={less.hongse_bt}>主营项目：</td>
                                <td>{mainBusinessName?mainBusinessName:""}</td>
                            </tr>
                            <tr>
                                <td className={less.hongse_bt}>注册资本：</td>
                                <td>{companyInfo&&companyInfo.isRegisteredCapital!=null?companyInfo.isRegisteredCapital==1?"无":`${companyInfo.registeredCapital}万元`:""}</td>
                                <td className={less.hongse_bt}>出口资质：</td>
                                <td>{companyInfo&&companyInfo.exportQualification?companyInfo.exportQualification==1?`有出口资质`:`无出口资质`:""}</td>
                            </tr>
                            <tr>
                                <td className={less.hongse_bt}>营业期限：</td>
                                <td>{this.showRuningTime(companyInfo?companyInfo.businessStartTime:"",companyInfo?companyInfo.businessEndTime:"")}</td>
                                <td className={less.hongse_bt}>纳税人资格属性：</td>
                                <td>{companyInfo&&companyInfo.taxpayerAttribute?companyInfo.taxpayerAttribute==1?`一般纳税人`:`小规模纳税人`:""}</td>
                            </tr>
                            <tr>
                                <td className={less.hongse_bt}>注册地址：</td>
                                <td>
                                    {this.showAreaInfo(companyInfo?companyInfo.areaStr:"",company?company.address:"")}
                                </td>
                                <td className={less.hongse_bt}>入驻时间：</td>
                                <td>
                                    {company&&company.enterTime?moment(company.enterTime).format("YYYY-MM-DD"):""}
                                </td>
                            </tr>
                            <tr>
                                <td className={less.hongse_bt}>供应商类型：</td>
                                <td>
                                    {(function(){
                                        let showTypeName = "";
                                        if(companyInfo&&companyInfo.showType){
                                            const showType = companyInfo.showType;
                                            switch (showType) {
                                                case 1:
                                                    showTypeName = "认证商家"
                                                    break;
                                                case 2:
                                                    showTypeName = "铁建推荐"
                                                    break;
                                                case 3:
                                                    showTypeName = "铁建自营"
                                                    break;
                                            }
                                            if(companyInfo.employed == 0){
                                                showTypeName = "铁建自营"
                                            }
                                        }
                                        return showTypeName;

                                    })()}
                                </td>
                                <td className={less.hongse_bt}>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                        <Row className={less.gongsijianjie}>
                            <Col span={8}>
                                {/*<img src={companySrc} />*/}
                                <div className={less.updeat_quxian}>
                                    {
                                        this.showCompanyImg()
                                    }
                                </div>
                            </Col>
                            <Col span={16}>
                                <h1>{company&&company.name?company.name:""}</h1>
                                <div className={less.companyRemark}>
                                    <div dangerouslySetInnerHTML={{__html: this.state.companyRemark?this.state.companyRemark:this.state.storeInfo.companyRemark?this.state.storeInfo.companyRemark:""}}></div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className={less.jilu_jiaoyi}>
                        <h1 className={less.pingtai_jy}>平台交易记录<b className={less.pingfen}>综合评分：-</b></h1>
                        <StatisticsStore onRefStatistics={this.onRefStatistics} />
                    </div>
                    <div className={less.jilu_jiaoyi} style={{overflow:"hidden"}}>
                        <h1 className={less.pingtai_jy}>企业资质</h1>
                        <div id={"actIndex"} style={{display:"none"}}>5</div>
                        <div className={less.swiper_button_warp}>
                            <div className={less.swiper_button_next} style={this.noimgInco} onClick={()=>{this.rightMove(this)}}><Icon type="right" /></div>
                            <div className={less.swiper_button_prev} style={this.noimgInco} onClick={()=>{this.leftMove(this)}}><Icon type="left" /></div>
                        </div>
                        <ul className={less.zizhi} id={"zz_ul"} style={{transform: "translate3d(0,0,0)"}}>
                            {
                                this.showImageInfo()
                            }
                        </ul>
                        <div className={less.clearfancun}>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


