import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Card, Modal, Button } from 'antd';
import Util from '@/utils/util';
import head from './head.png'
import gqxx from './供求信息.svg'
import jjd from './竞价单.svg'
import ddsp from './审批.svg'
import jjsp from './竞价审批.svg'
import './index.css';
import api from '@/framework/axios';
import moment from 'moment'
import Password from '@/pages/personal/Password';//修改密码
import { systemConfigPath, configs } from "@/utils/config/systemConfig";

// 个人信息
const Info = ({ userInfo, history, login_info, openPassword, userDetail }) => {
    let info = userInfo ? JSON.parse(JSON.stringify(userInfo)) : {};
    const toInfo = () => {
        // Util.alert('功能暂未开放！')
        // history.push('/personal')
        window.sessionStorage.setItem('userShow', 2);
        window.sessionStorage.setItem('userUuids', userInfo.uuids);
        window.open(systemConfigPath.jumpPage('/personal'));
    }
    const toPwd = () => {
        Util.alert('功能暂未开放！')
    }

    return (
        <div className="home-content-info" >
            <div>
                <img src={userDetail.userPhotoPath ? configs.fileUrl + userDetail.userPhotoPath : head} alt="" style={{ borderRadius: '50%', border: '1px solid #ccc' }} />
                <div>
                    <h2>{info.username}({info.phone})</h2>
                    <p>{info.companyName}</p>
                    <p style={{ fontSize: '14px', color: '#2db7f5' }}><span onClick={toInfo}>个人信息</span> | <span onClick={openPassword}>修改密码</span></p>
                </div>
            </div>
            <p>
                <span>上次登录：{moment(login_info[0].loginTime).format('YYYY年MM月DD日 HH:mm:ss')}</span>
                <span>登录地点：{login_info[0].loginAddress}</span>
            </p>
        </div>
    )
};
function toSupply(status = '', history) {
    checkHomeAuth('/supply/sell', history).then(() => {
        sessionStorage.SupplyStatus = status
        //history.push('/supply/sell')
        window.open(systemConfigPath.jumpPage('/supply/sell'))
    })
}
function toSaleScene(status = '', history) {
    checkHomeAuth('/sale/scene', history).then(() => {
        sessionStorage.SaleSceneStatus = status
        //history.push('/sale/scene')
        window.open(systemConfigPath.jumpPage('/sale/scene'))
    })
}


function toBuyScene(status = '', history) {
    checkHomeAuth('/buy/scene', history).then(() => {
        sessionStorage.buySceneStatus = status
        //history.push('/buy/scene')
        window.open(systemConfigPath.jumpPage('/buy/scene'))
    })
}
function toVerifyOrder(status = '', history) {
    checkHomeAuth('/verify/order', history).then(() => {
        sessionStorage.VerifyOrderStatus = status
        //history.push('/verify/order')
        window.open(systemConfigPath.jumpPage('/verify/order'))
    })
}
function toVerifyManage(status = '', history) {
    checkHomeAuth('/verify/manage', history).then(() => {
        sessionStorage.VerifyManageStatus = status
        //history.push('/verify/manage')
        window.open(systemConfigPath.jumpPage('/verify/manage'))
    })
}
function checkHomeAuth(menuUrl, history) {
    return api.ajax('get', '@/reuse/home/checkHomeAuth', {
        menuUrl
    }).then(res => {
        if (res.data !== true) {
            history.push('/403')
            throw new Error
        }
    })
}
const Trading = ({ loading, salerStats, history, buyerStats }) => {
    return (
        <Card title="交易管理" loading={loading} style={{ margin: '0 15px 15px 0' }}>
            <div className="list">
                <div className="list-item">
                    <img src={gqxx} alt="" />
                    <p>供求信息</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSupply(10, history) }}>{salerStats.supplyDemandDraft}</span>
                    <p>草稿</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSupply(30, history) }}>{salerStats.supplyDemandPublishing}</span>
                    <p>发布中</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSupply(50, history) }}>{salerStats.supplyDemandDeal}</span>
                    <p>已成交</p>
                </div>
            </div>
            <div className="list">
                <div className="list-item">
                    <img src={jjd} alt="" />
                    <p>竞价单</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSaleScene(10, history) }}>{salerStats.sceneReleased}</span>
                    <p>待发布</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSaleScene(50, history) }}>{salerStats.sceneBidding}</span>
                    <p>竞价中</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSaleScene(60, history) }}>{salerStats.sceneOpenBid}</span>
                    <p>待开标</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSaleScene(70, history) }}>{salerStats.sceneFinish}</span>
                    <p>已完成</p>
                </div>
            </div>
            <div className="list">
                <div className="list-item">
                    {/* <img src={jjd} alt="" />
                    <p>竞价单</p> */}
                </div>
                <div className="list-item">
                    <span onClick={() => { toBuyScene(10, history) }}>{buyerStats.signRegistration}</span>
                    <p>待报名</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toBuyScene(20, history) }}>{buyerStats.signBond}</span>
                    <p>待缴纳保证金</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toBuyScene(30, history) }}>{buyerStats.signQuote}</span>
                    <p>待报价</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toBuyScene(50, history) }}>{buyerStats.sceneFinish}</span>
                    <p>已成交</p>
                </div>
            </div>
        </Card>
    )
};
const Approve = ({ loading, salerStats, history }) => {
    return (
        <Card loading={loading} title="审批管理" style={{ margin: '0 15px 15px 0' }}>
            <div className="list-warp">
                <div className="list">
                    <div className="list-item">
                        <img src={ddsp} alt="" />
                        <p>订单审批</p>
                    </div>
                    <div className="list-item">
                        <span onClick={() => { toVerifyOrder(1, history) }}>{salerStats.orderPendingApproval}</span>
                        <p>待审批</p>
                    </div>
                    <div className="list-item">
                        <span onClick={() => { toVerifyOrder(3, history) }}>{salerStats.orderRejected}</span>
                        <p>已驳回</p>
                    </div>
                </div>
                <div className="list">
                    <div className="list-item">
                        <img src={jjsp} alt="" />
                        <p>竞价审批</p>
                    </div>
                    <div className="list-item">
                        <span onClick={() => { toVerifyManage(1, history) }}>{salerStats.scenePendingApproval}</span>
                        <p>待审批</p>
                    </div>
                    <div className="list-item">
                        <span onClick={() => { toVerifyManage(3, history) }}>{salerStats.sceneRejected}</span>
                        <p>已驳回</p>
                    </div>
                </div>
            </div>
        </Card>
    )
};
const Order = ({ loading, salerStats, history }) => {
    return (
        <Card loading={loading} title="订单管理" style={{ margin: '0 15px 0 0' }}>
            <div className="list">
                <div className="list-item">
                    <img src={ddsp} alt="" />
                    <p>订单管理</p>
                </div>
                <div className="list-item">
                    <span onClick={() => { toSupply(50, history) }}>{salerStats.orderSupplyDemandDeal}</span>
                    <p>供求信息成交</p>
                </div>
                <div className="list-item">
                    <span onClick={() => toSaleScene(70, history)}>{salerStats.orderSceneDeal}</span>
                    <p>竞价成交</p>
                </div>
            </div>
        </Card>
    )
};
const Notice = ({ loading, notice_list, noticeDetail,reportList,handleNewJumpPage,messageList }) => {
    const noticeList = notice_list;
    let newsTypes = ['', '网站新闻', '系统公告', '友情链接', '会员协议', '帮助中心', '视频公告']
    return (
        <div>
        <Card className="home-log"
            loading={loading}
            title="公告"
            extra={<a className="more" target='_blank' href="/static/crccmall/#/webNews/news">更多 <em>&gt;&gt;</em></a>}
            style={{ width: '328px', height: '400px' }}>
            <div className="content">
                {
                    reportList ? reportList.map((item,index) => {
                        console.log('kkkh',item)
                        return (
                            <div className="row">
                                <p title={item.title} className="reportList" onClick={handleNewJumpPage(this,item.uuids,1,index)}>【{item.newsType == 1?"网站新闻":"系统公告"}】{item.title}</p>
                                {/* <p title={item.title} className="reportList" onClick={() => { noticeDetail(item) }}>{item.title}</p> */}
                                <span>{moment(item.newsTime).format("YYYY/MM/DD")}</span>
                            </div>
                        )
                        
                    }):''
                }
            </div>
        </Card>
        <Card className="home-log"
            loading={loading}
            title="消息"
            extra={<a className="more" target='_blank' href="/static/crccmall/#/webNews/news">更多 <em>&gt;&gt;</em></a>}
            style={{ width: '328px', height: '400px' }}>
            <div className="content">
                {
                    messageList ? messageList.map((item,index) => {
                        console.log('kkkh',item)
                        return (
                            <div className="row">
                                <p title={item.title} className="reportList" onClick={handleNewJumpPage(this,item.uuids,1,index)}>【{item.messageType == 1?"系统消息":"交易消息"}】{item.tittle}</p>
                                {/* <p title={item.title} className="reportList" onClick={() => { noticeDetail(item) }}>{item.title}</p> */}
                                <span>{moment(item.newsTime).format("YYYY/MM/DD")}</span>
                            </div>
                        )
                        
                    }):''
                }
            </div>
        </Card>
        </div>
        // <Card loading={loading} className="home-log" title="公告"  extra={<a className="more" onClick={()=>{window.open(systemConfigPath.jumpCrccmallPage("/webNews/news"))}}>更多<em>&gt;&gt;</em></a>} >
        //     {reportList!=null?reportList.map((item, index) => {
        //         return(<div className={index>0?"content":""}>
        //             <a title={item.title} onClick={this.handleNewJumpPage.bind(this,item.uuids,1,index)} style={{ width: '300px', height: '400px' }}>
        //                 <span className={less.msg_title}>【{item.newsType == 1?"网站新闻":"系统公告"}】{item.title}</span>
        //             </a>
        //                 <span className="font-color045" style={{float:"right"}}>{moment(item.newsTime).format("YYYY/MM/DD")}</span>
        //                 </div>
        //                )
        //         }):""
        //     }
        // </Card>
    )
};
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            login_info: [{}],
            notice_list: [],
            passwordVisible: false,
            salerStats: {},
            buyerStats: {},
            notice_detail: {},
            showDetailVisible: false,
            userDetail: {},
            reportList:[],  //新闻公告
            messageList:[],     //消息列表
        }
    }

    componentWillMount() {
        this.queryRecentLoginFourTime()
        this.getGg()
        this.queryCurrentReport();
        this.queryMessage()
    }

    queryRecentLoginFourTime() {
        api.ajax('GET', '@/reuse/personal/queryRecentLoginFourTime', {
            uuids: this.props.userInfo.uuids,
            companyId: this.props.userInfo.companyId
        }).then(res => {
            this.setState({
                login_info: res.data
            })
        }).catch(res => {

        })
    }

    //获取当前的新闻公告信息
    queryCurrentReport=()=>{
        api.ajax(
            'GET',
            '@/message/ecNews/noPageNewsList',
            {}
        ).then(
            r=>{
                let reportList = this.state.reportList;
                reportList = r.data.rows;
                this.setState({
                    reportList
                })
            }
        ).catch(
            r=>{}
        )
    }

    //获取当前的消息信息
    queryMessage=()=>{
        api.ajax(
            'GET',
            '@/message/ecMessage/noPageMessageList',
            {}
        ).then(
            r=>{
                let messageList = this.state.messageList;
                messageList = r.data.rows;
                this.setState({
                    messageList
                })
            }
        ).catch(
            r=>{}
        )
    }

    getGg() {
        api.ajax('GET', '@/reuse/home/index', { page: 1, rows: 10 }).then(res => {
            this.setState({
                notice_list: res.data.newsMap.rows,
                salerStats: res.data.salerStats,
                buyerStats: res.data.buyerStats,
                userDetail: res.data.userDetail,
            })
        }).catch(res => {

        })
    }

    closePassword = () => {
        this.setState({
            passwordVisible: false
        });
    }

    openPassword = () => {
        this.setState({
            passwordVisible: true
        });
    }

    notticeDetail = (item) => {
        this.setState({
            notice_detail: item,
            showDetailVisible: true
        });
    }

    //新闻公告跳转
    handleNewJumpPage=(uuids)=>{
        if(uuids){
            window.open(systemConfigPath.jumpCrccmallPage("/webNewsDetail/"+uuids));
        }
    }

    closeDetail = () => {
        this.setState({
            showDetailVisible: false
        });
    }

    render() {
        let { loading } = this.state;
        //userInfo.userType: 3（销方），4（购方）
        let userInfo = this.props.userInfo;

        return (
            <div className="home">
                <div className="home-content">
                    <Card loading={loading} style={{ margin: '0 15px 15px 0' }}>
                        <Info openPassword={this.openPassword} userInfo={userInfo} userDetail={this.state.userDetail} login_info={this.state.login_info} history={this.props.history} />
                    </Card>
                    <Trading history={this.props.history} loading={loading} salerStats={this.state.salerStats} buyerStats={this.state.buyerStats} />
                    <Approve history={this.props.history} loading={loading} salerStats={this.state.salerStats} />
                    <Order history={this.props.history} loading={loading} salerStats={this.state.salerStats} />
                </div>
                <Notice loading={loading} noticeDetail={this.notticeDetail} handleNewJumpPage = {this.handleNewJumpPage} notice_list={this.state.notice_list} reportList={this.state.reportList} messageList={this.state.messageList}/>
                <Password
                    visible={this.state.passwordVisible}
                    close={this.closePassword}
                    userInfo={userInfo}
                />
                <Modal
                    title={this.state.notice_detail.title}
                    wrapClassName="revoke_inquiry_modal"
                    visible={this.state.showDetailVisible}
                    width={550}
                    onOk={this.closeDetail}
                    onCancel={this.closeDetail}
                    footer={[
                        <Button type="primary" onClick={this.closeDetail}>确定</Button>
                    ]}
                >
                    <div dangerouslySetInnerHTML={{ __html: this.state.notice_detail.content }}></div>
                    <p style={{ marginTop: "20px", textAlign: "right" }}>{moment(this.state.notice_detail.newsTime).format("YYYY-MM-DD HH:mm")}</p>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        showContent: state.contentReducer.showContent,
        userInfo: state.authReducer.userInfo || {}
    }
}

export default withRouter(connect(mapStateToProps)(Home))

