import React from 'react';
import { Row, Col, Menu, Icon } from 'antd';
import less from './index.less';

import img_down1 from './img/down01.png';
import img_down2 from './img/down02.png';
import img_down3 from './img/down03.png';
import img_down4 from './img/down04.png';
import img_down5 from './img/down05.png';
import img_code from './img/code.jpg';

export default class DeskFooter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    _nav = [
        {
            key: '1',
            span: 5,
            icon: img_down1,
            title: '官方授权',
            name: '新手入门',
            children:[
                {key: '1.1', name:'登录与密码'},
                {key: '1.2', name:'注册流程'},
                {key: '1.3', name:'关于我们'},
                {key: '1.4', name:'商城宣传片'},
            ]
        },
        {
            key: '2',
            span: 5,
            icon: img_down2,
            title: '免费试用',
            name: '采购商指南',
            children:[
                {key: '2.1', name:'下载流程'},
                {key: '2.2', name:'审批流程'},
                {key: '2.3', name:'付款流程'},
            ]
        },
        {
            key: '3',
            span: 5,
            icon: img_down3,
            title: '资源共享',
            name: '供应商指南',
            children:[
                {key: '3.1', name:'交易流程'},
                {key: '3.2', name:'违规流程'},
                {key: '3.3', name:'资金账户常见问题'},
            ]
        },
        {
            key: '4',
            span: 5,
            icon: img_down4,
            title: '专享服务',
            name: '客户须知',
            children:[
                {key: '4.1', name:'客户咨询'},
                {key: '4.2', name:'纠纷处理'},
                {key: '4.3', name:'常见问题'},
                {key: '4.4', name:'营业执照'},
                {key: '4.5', name:'禁止转载声明'},
            ]
        },
        {
            key: '5',
            span: 4,
            icon: img_down5,
            title: '合规管理',
            name: '联系我们',
            code: img_code,
            tel: '400-607-2808',
            tip: '官方微信公众号'
        }
    ]

    getChildren = (arr) => {
        return (
            arr.map(val => {
                return <li key={val.key}><a href={val.href}>{val.name}</a></li>
            })
        )
    }

    render() {
        return (
            <div className={less.footer}>
                <div className={less.content}>
                    <Row>
                        {
                            this._nav.map(v => {
                                return (
                                    <Col span={v.span} key={v.key}>
                                        <div className={less.item}>
                                            <div className={less.title}>
                                                <img src={v.icon}></img>
                                                <span>{v.title}</span>
                                            </div>
                                            <div className={less.links}>
                                                <div className={less.name}>{v.name}</div>
                                                {
                                                    v.children ? 
                                                    <ul>{this.getChildren(v.children)}</ul> 
                                                    : (
                                                        <div>
                                                            <p className={less.tel}>{v.tel}</p>
                                                            <div className={less.code}>
                                                                <img src={v.code}></img>
                                                            </div>
                                                            <p className={less.tip}>{v.tip}</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                        <Col span={4}>
                            
                        </Col>
                    </Row>
                </div>
                <div className={less.record}>
                    <div className={less.record_box}>
                        <p>中铁建金服科技（天津）有限公司 | 京ICP备14043188号-3 | 京公网安备1101073605-18001 | 经营证照</p>
                        <p>友情链接：中铁建股份有限公司 | 中铁建资产管理有限公司 | 铁建银信</p>
                        <p>Copyright©2019 www.crccmall.com All rights reserved</p>
                    </div>  
                </div>
            </div>
        )
    }
}

