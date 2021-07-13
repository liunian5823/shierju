import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Card, Modal, Button, Tabs } from 'antd';
import head from './head.png'
import './index.css'

const echarts = require('echarts')
const TabPane = Tabs.TabPane;
// 个人信息
const Info = ({}) => {
    let userName = "kkk"
    return (
        <div className="user_info">
            <img src={head}></img>
            <div className="info">
                <span className="line1">好，您好{userName}，祝今天工作顺利！</span>
                <span className="line2">流转物资管理系统</span>
                <p className="line3">上次登录时间：2021年5月20日</p>
                <p className="line3">登录地点：2021年5月20日</p>
            </div>
            <div className="data">
                <div className="item">
                    总资产数：83028040492
                </div>
                <div className="item">
                    已处置：83028040492
                </div>
                <div className="item">
                    在用：83028040492
                </div>
                <div className="item">
                    已周转：83028040492
                </div>
                <div className="item">
                    闲置：83028040492
                </div>
                <div className="item">
                    已租赁：83028040492
                </div>
            </div>
        </div>
    )
}
// 审批管理
const Approve = ({}) => {
    const data = [
        {
            title: "订单审批",
            imgSrc: "./static/img/twbureau/order@2x.png",
            children: [
                {
                    state: "待审批",
                    num: "23"
                },
                {
                    state: "已驳回",
                    num: "142324"
                }
            ]
        },
        {
            title: "竞价审批",
            imgSrc: "./static/img/twbureau/jingjia@2x.png",
            children: [
                {
                    state: "待审批",
                    num: "23"
                },
                {
                    state: "已驳回",
                    num: "142324"
                }
            ]
        },
        {
            title: "物资状态审批",
            imgSrc: "./static/img/twbureau/state@2x.png",
            children: [
                {
                    state: "待审批",
                    num: "23"
                },
                {
                    state: "已驳回",
                    num: "142324"
                }
            ]
        },
        {
            title: "周转审批",
            imgSrc: "./static/img/twbureau/zhouzhuansp@2x.png",
            children: [
                {
                    state: "待审批",
                    num: "23"
                },
                {
                    state: "已驳回",
                    num: "142324"
                }
            ]
        },
        {
            title: "委托审批",
            imgSrc: "./static/img/twbureau/weituo@2x.png",
            children: [
                {
                    state: "待审批",
                    num: "23"
                },
                {
                    state: "已驳回",
                    num: "142324"
                }
            ]
        }
    ]
    return (
        <div className="approve">
            <div className="title">审批管理</div>
            <div className="main">
            {
                data.map((item, index) => {
                    return (
                        <div className="item" key={index}>
                            <div className="head">
                                <img src={item.imgSrc} />
                                <p>{item.title}</p>
                            </div>
                            {
                                item.children.map((child, secIndx) => {
                                    return (
                                        <div className="body" key={index*10+secIndx}>
                                            <p className="num">{child.num}</p>
                                            <p className="state">{child.state}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

// 公告
const Report = ({}) => {
    return (
        <div className="report">
            <div className="head">
                <span className="title">公告</span>
                <span className="more">{'更多>'}</span>
            </div>
            <div className="body">
                <div className="item">
                    <span>【网站新闻】系统升级维护通知</span>
                    {/* <span>{moment(item.newsTime).format("YYYY/MM/DD")}</span> */}
                    <span>2021/05/24</span>
                </div>
                <div className="item">
                    <span>【网站新闻】系统升级维护通知</span>
                    {/* <span>{moment(item.newsTime).format("YYYY/MM/DD")}</span> */}
                    <span>2021/05/24</span>
                </div>
            </div>
        </div>
    )
}
// 交易管理
const Trading = ({}) => {
    let info = {  
    }
    return (
        <div className="trading">
            <div className="title">交易管理</div>
            <div className="info">
                <div className="head">
                    <img src="./static/img/twbureau/gongqiu@2x.png" />
                    <p>供求信息</p>
                </div>
                <div className="body">
                    <p className="num">232</p>
                    <p className="state">草稿</p>
                </div>
                <div className="body">
                    <p className="num">121</p>
                    <p className="state">发布中</p>
                </div>
                <div className="body">
                    <p className="num">4134142</p>
                    <p className="state">已成交</p>
                </div>
            </div>
            <div className="order">
                <div className="head">
                    <img src="./static/img/twbureau/jingjiad@2x.png" />
                    <p>竞价单</p>
                </div>
                <div className="body_box">
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                    <div className="body">
                        <p className="num">232</p>
                        <p className="state">草稿</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
// 消息提醒
const Message = ({}) => {
    return (
        <div className="report">
            <div className="head">
                <span className="title">消息提醒</span>
                <span className="more">{'更多>'}</span>
            </div>
            <div className="body">
                <div className="item">
                    <span>2021/05/24 9:00:00</span>
                    <span>您的委托已经</span>
                    <span className="blue">审核通过</span>
                </div>
                <div className="item">
                    <span>2021/05/24 9:00:00</span>
                    <span>您的委托已经</span>
                    <span className="red">审核拒绝</span>
                </div>
            </div>
        </div>
    )
}
// 排行榜
const Rank = ({}) => {
    const tabsData = [{
        key: '0', 
        name: '在用资产月排行'
      }, {
        key: '1',
        name: '闲置资产月排行'
      }, {
        key: '2',
        name: '租赁资产月排行'
      }
    ]
    return (
        <div className="rank">
            <Tabs className="tabs">
                  {
                    tabsData.map((item, index) => {
                      return (
                        <TabPane tab={item.name} key={item.key}>
                           <div className="pane">
                               <div className="chart">
                                <div id="forms" style={{width:'650px',height:'280px',marginTop: '25px'}}></div>
                               </div>
                               <div className="report">
                                    <div className="head">
                                        <span className="title">项目部排行</span>
                                    </div>
                                    <div className="body">
                                        <div className="item">
                                            <div className="first"></div>
                                            <span className="name">MMMM项目部</span>
                                            <span>2342,323</span>
                                        </div>
                                        <div className="item">
                                            <div className="second"></div>
                                            <span className="name">MMMM项目部</span>
                                            <span>2342,323</span>
                                        </div>
                                        <div className="item">
                                            <div className="third"></div>
                                            <span className="name">MMMM项目部</span>
                                            <span>2342,323</span>
                                        </div>
                                        <div className="item">
                                            <div className="sort">4</div>
                                            <span className="name">MMMM项目部</span>
                                            <span>2342,323</span>
                                        </div>
                                    </div>
                                </div>
                           </div>
                        </TabPane>
                      )
                    })
                  }
                </Tabs>
        </div>
    )
}
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.showBarChart()
    }
    showBarChart = () => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('forms'));
        // 绘制图表
        myChart.setOption({   
            title: {
                text: '资产数量'
            },
            tooltip: {},
            // legend: {
            //     data:['销量1']
            // },
            xAxis: {
                data: ["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"]
            },
            yAxis: {},
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: [250, 500, 750, 1000, 402, 880, 300, 100, 1000, 402, 880, 300, 100]
                }
            ]
        });
    }
    render() {
        return (
            <div>
                <Info></Info>
                <div className="float_box">
                    <Approve></Approve>
                    <Report></Report>
                    <Trading></Trading>
                    <Message></Message>
                </div>
                <Rank></Rank>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // token: state.token,
        // showContent: state.contentReducer.showContent,
        // userInfo: state.authReducer.userInfo || {}
    }
}

export default withRouter(connect(mapStateToProps)(Home))

