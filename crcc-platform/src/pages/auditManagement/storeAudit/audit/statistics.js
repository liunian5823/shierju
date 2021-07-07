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
import dz1 from "./img/dz1.png";
import dz2 from "./img/dz2.png";
import dz3 from "./img/dz3.png";
import dz4 from "./img/dz4.png";
import dz5 from "./img/dz5.png";


import less from "./contact.less";
import dd1 from "./img/1.png";
import dd2 from "./img/2.png";
import dd3 from "./img/3.png";
import dd4 from "./img/4.png";

export default class StatisticsStore extends React.Component{
    state = {
        companyId: '',    //公司的id
        countInfo:{},//平台交易统计信息
    }

    componentDidMount() {
        this.props.onRefStatistics(this);
    }

    //设置当前公司的id
    setStatisticsCompanyId=(_companyId)=>{
        //获取当前的模板id并保存
        let companyId = this.state.companyId;
        companyId = _companyId;
        this.state.companyId = companyId;
        this.setState({
            companyId
        })
        this.initDataFn();
    }

    //
    initDataFn = () => {
        //查询当前的统计信息
        this.queryStatistics();
    }

    //查询当前店铺信息
    queryStatistics=()=>{
        let companyId = this.state.companyId;
        if(companyId){
            api.ajax(
                'GET',
                '@/supplier/ecCompanyInfoSupplier/getCompanyExchangeRecord',
                {companyId}
            ).then(
                r => {
                    const countInfo = r.data;
                    this.setState({countInfo})
                }
            ).catch(
                r => {
                    //Util.alert(r.msg, { type: "error" })
                    console.log(r.msg)
                }
            )
        }
    }


    render() {
        const{countInfo} = this.state;
        return(
            <ul className={less.tongji}>
                <li>
                    <img src={dd1} />
                    <div>
                        <p>
                            <strong>
                                {
                                    countInfo&&countInfo.orderNum>=0?`${countInfo.orderNum}`:"-"
                                }
                            </strong>
                            <span>{
                                countInfo&&countInfo.orderNum>=0?"笔":""
                            }</span>
                        </p>
                        <p>累计订单数</p>
                    </div>
                </li>
                <li>
                    <img src={dd2} />
                    <div>
                        <p>

                            <strong>
                                {
                                    countInfo&&countInfo.buyerNum>=0?`${countInfo.buyerNum}`:"-"
                                }
                            </strong>
                            <span>{
                                countInfo&&countInfo.buyerNum>=0?"位":""
                            }</span>
                        </p>
                        <p>累计买家数</p>
                    </div>
                </li>
                <li>
                    <img src={dd3} />
                    <div>
                        <p>
                            <strong>
                                {
                                    countInfo&&countInfo.quotationNum>=0?`${countInfo.quotationNum}`:"-"
                                }
                            </strong>
                            <span>
                                        {
                                            countInfo&&countInfo.quotationNum>=0?"次":""
                                        }
                                    </span>
                        </p>
                        <p>累计报价数</p>
                    </div>
                </li>
                <li>
                    <img src={dd4} />
                    <div>
                        <p><strong>100%</strong></p>
                        <p>好评率</p>
                    </div>
                </li>
            </ul>
        )
    }
}


