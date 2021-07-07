import React from 'react';
import {Card,Col,Row,Icon,Tree,Button,Table,Input,Modal,Form,InputNumber,TreeSelect,Switch,message, Transfer, Carousel, Menu, Dropdown, Breadcrumb, Pagination, Checkbox} from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import UploadImg from '@/components/uploadImg'
import Auth from '@/utils/auth';
import { setToken } from '@/redux/action/index';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';


import zy1 from "./img/zy1.png";
import zy2 from "./img/zy2.png";
import zy3 from "./img/zy3.png";
import dz1 from "./img/dz1.png";
import dz2 from "./img/dz2.png";
import dz3 from "./img/dz3.png";
import dz4 from "./img/dz4.png";
import dz5 from "./img/dz5.png";
import zwkf from "./img/zwkf.jpg";

import less from "./contact.less";

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};  //左右规格
const FormItem = Form.Item;

export default class ContactStore extends React.Component{
    count = 0;
    state = {
        storeId: '',    //店铺的id
        companyName: '',       //保存当前公司名称
        showType: '',        //保存当前公司的商品来源 0铁建自营，1各局推荐，2商家平台
        portalId:'',//门户模板id
    }

    componentDidMount() {
        this.props.onRefContact(this);
    }
    setPortalId=(id)=>{
        this.setState({
            portalId:id
        })
        console.log('======setPortalId:',this.state.portalId)
        this.child.setPortalId(id);
        this.queryPortal();
    }
    //设置当前店铺的id
    setContactStoreId=(_storeId)=>{
        //获取当前的模板id并保存
        let storeId = this.state.storeId;
        storeId = _storeId;
        this.setState({
            storeId
        })
        this.initDataFn();
    }

    //设置当前公司的name
    setContactCompanyName=(_name)=>{
        let companyName = this.state.companyName;
        companyName = _name;
        this.setState({
            companyName
        })
    }

    //
    initDataFn = () => {
        //查询当前店铺的信息
        this.queryStoreId();
    }
    queryPortal=()=>{
        let id = this.state.portalId;
        console.log('====queryPortal:',this.state.portalId)
        if(id){
            api.ajax(
                'GET',
                '@/portal/ecPortal/queryPortalById',
                {id}
            ).then(
                r => {
                    this.child.setValue(r.data);
                    this.createMap(r.data.address);
                }
            ).catch(
                r => {
                    //console.log("查询店铺信息失败！", r)
                }
            )
        }
    }

    //查询当前店铺信息
    queryStoreId=()=>{
        let id = this.state.storeId;
        if(id){
            api.ajax(
                'GET',
                '@/portal/ecStore/getStoreById',
                {id}
            ).then(
                r => {
                    let  showType = this.state.showType;
                    let goodsSource = r.data.goodsSource;
                    if(goodsSource == 1){
                        showType = zy2;
                    }
                    if(goodsSource == 2){
                        showType = zy3;
                    }
                    if(goodsSource == 3){
                        showType = zy1;
                    }
                    if(r.data.employed == 0){
                        showType = zy1;
                    }
                    this.setState({
                        showType
                    })
                    this.child.setValue(r.data);
                    this.queryPortal();
                    this.createMap(r.data.address);
                }
            ).catch(
                r => {
                    console.log("查询店铺信息失败！", r)
                }
            )
        }
    }

    createMap=(address)=>{
        let count = this.count;
        count ++;
        const { BMap } = window;
        var map = new BMap.Map("storeMap"); // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 15); // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom();                 //启用滚轮放大缩小

        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(address, function(point){
            if (point) {
                map.centerAndZoom(point, 16);
                map.addOverlay(new BMap.Marker(point));
                if(count == 1){
                    map.panBy(250, 250);//中心点偏移多少像素（width,height）为div 宽高的1/2;
                }
            }else{
                //Util.alert("您选择地址没有解析到结果!");
            }
        });

    }


    //测试调用子组件的方法
    onRef = (ref) => {
        this.child = ref;
    }

    render() {
        return(
            <div className={less.company_case}>
                <div className={less.crumbse}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <Icon type="home" />
                            <span>首页</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            联系方式
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className={less.information_company}>
                    <h1 className={less.biaoti_infor}>{this.state.companyName}<img src={this.state.showType} /></h1>
                    <div className={less.lianxifangshi}>
                        <Row>
                            <Col span={12}>
                                <Contact onRef={this.onRef} createMap={this.createMap}/>
                            </Col>
                            <Col span={12}>
                                <div>
                                    <div className={less.dimh}>
                                        <img src={zwkf}/>
                                    </div>
                                    <div id={"storeMap"}></div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

class contact extends React.Component{
    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
    state = {
        saveLoading: false,     //保存按钮的样式
        id:'',  //店铺id
        storeObj : '',        //保存当前店铺信息
        portalId:'',//门户模板id
        loading: false,
    }

    componentDidMount(){
        //必须在这里声明，所以 ref 回调可以引用它
        this.props.onRef(this);
    }
    setPortalId=(id)=>{
        let portalId = id;
        this.setState({
            portalId
        })
    }
    //
    setValue=(params)=>{
        let storeObj = this.state.storeObj;
        storeObj = params;
        this.setState({
            storeObj
        })
    }

    //
    refreshMap=()=>{
        //获取当前地址信息
        let storeAddress = this.props.form.getFieldValue('address');
        this.props.createMap(storeAddress);
    }


     render(){
         const { getFieldProps } = this.props.form;
         let obj = this.state.storeObj;
         return(
             <div>
                 <h1 className={less.lxrxinxi}>
                     联系人信息
                 </h1>
                 <ul className={less.lianxiren}>
                     <li><img src={dz1} />联系人：<span className={less.lxr_daan}>{obj.contentMan}</span></li>
                     <li><img src={dz2} />电话：<span className={less.lxr_daan}>{obj.storeContactPhone}</span></li>
                     <li><img src={dz3} />邮箱：<span className={less.lxr_daan}>{obj.contentEmail}</span></li>
                 </ul>
                 <h1 className={less.lxrxinxi}>
                     企业联系方式
                 </h1>
                 <ul className={less.lianxiren}>
                     <li><img src={dz2} />电话：<span className={less.lxr_daan}>{obj.fixedPhone}</span></li>
                     <li><img src={dz3} />邮箱：<span className={less.lxr_daan}>{obj.email}</span></li>
                     <li><img src={dz4} />邮编：<span className={less.lxr_daan}>{obj.zipCode}</span></li>
                     <li><img src={dz5} />地址：<span className={less.lxr_daan}>{obj.address}</span></li>
                 </ul>
             </div>
         )
     }
}

const Contact = Form.create({})(contact);


