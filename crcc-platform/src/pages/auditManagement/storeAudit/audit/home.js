import React from 'react';
import {Card,Col,Row,Icon,Tree,Button,Table,Input,Modal,Form,InputNumber,TreeSelect,Switch,message, Transfer, Carousel, Menu, Dropdown} from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import { setToken } from '@/redux/action/index';
import dd1 from "./img/1.png";
import dd2 from "./img/2.png";
import dd3 from "./img/3.png";
import dd4 from "./img/4.png";

import less from "./index.less";
import StatisticsStore from "./statistics";
import defaultBanner from "./img/defaultBanner.jpg";

const imageOrigin = SystemConfig.configs.resourceUrl;
const confirm = Modal.confirm;

// 公司信息
const menu =(
    <div className={less.leimu_tanchukuang}>
        <div className={less.informationlei}>
            <p>主营产品：<span>商城类目</span></p>
            <p>经营模式：<span>代理经销</span></p>
            <p>所在地：<span>北京市</span></p>
            <p>成交订单：<span><b>999</b>笔</span></p>
            <p>成交金额：<span><b>999,999.00</b>元</span></p>
            <p>合作单位：<span><b>10</b>家</span></p>
        </div>
        <div className={less.inforbutton}><a>访问门户</a><a className={less.shouchanghong}>收藏店铺</a></div>
    </div>
)


export default class HomeStore extends React.Component {

    state = {
        portalId: "",    //店铺模板的id
        skin: 'red',           //门户模板的皮肤
        companyId: '',      //公司id
        showBannerList:[],      //保存当前用于展示的banner数组
        showcaseArr:[],     //保存当前店铺的橱窗列表
        showSkinClass: "box_waicheng_red",       //设置皮肤颜色
    }

    componentDidMount(){
        //必须在这里声明，所以 ref 回调可以引用它
        this.props.onRefIndex(this);
    }

    /**
     * 设置当前门户模板的id
     * @param _portalId  门户模板的id
     * @param skin  皮肤
     */
    setPortalTemplateId=(_portalId, _skin, _companyId)=>{
        //获取当前的模板id并保存
        let portalId = this.state.portalId;
        let skin = this.state.skin;
        let companyId = this.state.companyId;
        portalId = _portalId;
        skin = _skin;
        companyId = _companyId;
        this.setState({
            portalId,
            skin,
            companyId
        })
        this.initDataFn();
    }

    //
    setShowSkinClass=(skinClass)=>{
        let showSkinClass = this.state.showSkinClass;
        showSkinClass = skinClass;
        this.setState({
            showSkinClass
        })
    }

    initDataFn = () => {
        //查询当前的店铺统计信息
        this.childStatistics.setStatisticsCompanyId(this.state.companyId);
        //查询当前的橱窗列表
        this.queryShowcase();
        //查询当前banner列表
        this.queryStoreBanner();
    }

    //查询当前的banner图片
    queryStoreBanner=()=>{
        let companyId = this.state.companyId;
        let portalTemplateId = this.state.portalId;
        let that = this;
        api.ajax(
            'GET',
            '@/portal/ecStoreImg/allStoreBanner',
            {companyId,portalTemplateId}
        ).then(
            r=>{
                let showBannerList = this.state.showBannerList;
                showBannerList = [];
                showBannerList = r.data.rows;
                that.setState({
                    showBannerList
                })
            }
        ).catch(
            r=>{
                console.log("查询当前店铺的banner失败！", r);
                return;
            }
        )
    }


    /**
     * 橱窗查询展示
     * 参数 companyId
     */
    queryShowcase=()=>{
        let companyId = this.state.companyId;
        let portalTemplateId = this.state.portalId;
        api.ajax(
            'GET',
            '@/portal/ecShowcase/allShowcase',
            {companyId,portalTemplateId}
        ).then(
            r=>{
                //赋值
                let showcaseArr = this.state.showcaseArr;
                showcaseArr = [];
                showcaseArr = r.data.rows;
                this.setState({
                    showcaseArr
                })
            }
        ).catch(
            r=>{
                console.log("查询橱窗列表失败！", r);
                return;
            }
        )
    }

    //导航菜单
    getInitialState=()=>{
        current: 'mail'
    }

    handleClick=(e)=>{
        console.log('click ', e);
        this.setState({
            current: e.key,
        })
    }

    //点击轮播图片链接地址
    clickBanner=(url)=>{
        if(url){
            window.open(url);
        }
    }

    //点击橱窗商品，跳转橱窗商品详情页面
    clickShowCaseGoods=(id)=>{
        if(id){
            let protocol = window.location.protocol;
            let host = window.location.host;
            console.log("clickShowCaseGoods ----------- ", protocol, href)
            let href = `${protocol}//${host}/cms/goods/showOne?goodsId=${id}`;
            window.open(href);
        }

    }
    //
    onRefStatistics=(ref)=>{
        this.childStatistics = ref;
    }

    render(){
        let showBannerList= this.state.showBannerList;
        let showcaseArr = this.state.showcaseArr;   //
        return(
            <div className={less[this.state.showSkinClass]}>
                <div className={less.box_waicheng}>
                    <div className={less.banner_tu}>
                        <Carousel autoplay className>
                            {
                                showBannerList.length == 0
                                    ?
                                    <div ><img src={defaultBanner}/></div>
                                    :
                                    showBannerList.map((item, index)=>{
                                            return(
                                                <div><a onClick={this.clickBanner.bind(this, item.url)}><img src={imageOrigin + item.src} /></a></div>
                                            )
                                        }
                                    )
                            }
                        </Carousel>
                    </div>
                    <div>
                        <StatisticsStore onRefStatistics={this.onRefStatistics} />
                    </div>
                    <div>
                        <div>
                            {
                                showcaseArr.map((item, index) => {
                                    return (
                                        <div className={less.card_pinpai} key={index}>
                                            <div className={less.tianjia_chuchuang}>
                                                <div className={less.chuchuang_biaoti}>{item.name}</div>
                                            </div>
                                            <div className={less.gutter_example}>
                                                <Row>
                                                    {
                                                        item.goodsList.map((it, index)=>{
                                                            return (
                                                                <Col className={less.gutter_row} key={index} onClick={this.clickShowCaseGoods.bind(this,   item.id)}>
                                                                    <div className={less.gutter_box}>
                                                                        <img src={it.url.indexOf("http")>-1?it.url:imageOrigin + it.url} className={less.goods_img}/>
                                                                    </div>
                                                                    <div className={less.gutter_text}>
                                                                        {it.name}
                                                                    </div>
                                                                    <div className={less.gutter_wuliu}>
                                                                        <strong>¥{it.price}</strong>
                                                                        <span>{it.mailFlag == 1?"卖家承担运费":"买家承担运费"}</span>
                                                                    </div>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


