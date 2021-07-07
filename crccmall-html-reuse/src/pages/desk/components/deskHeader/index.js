import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Menu, Icon, Popover, Tooltip } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
import { deskRoutes } from '@/views/routes';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import Auth from '@/utils/auth';
import api from '@/framework/axios';
import less from './index.less';
import logo from './logo.png';

const _METAS = deskRoutes.filter(v => v.meta);

class DeskHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    menu = [
        {
            key: 'kf',
            title: '联系客服',
            icon: 'down',
            children: [
                {
                    key: 'kf_online',
                    title: '在线咨询',
                    harf: '#'
                },{
                    key: 'kf_method',
                    title: '在线咨询',
                    harf: '#'
                },{
                    key: 'kf_help',
                    title: '帮助中心',
                    harf: '#'
                },{
                    key: 'kf_proposal',
                    title: '投诉建议',
                    harf: '#'
                }
            ]
        },
        {
            key: 'nav',
            title: '网站导航',
            icon: 'down',
            children: [
                {
                    key: 'nav_home',
                    title: '首页',
                    harf: '#'
                },{
                    key: 'nav_inquiry',
                    title: '询价采购',
                    harf: '#'
                },{
                    key: 'nav_platform',
                    title: '商家平台',
                    harf: '#'
                },{
                    key: 'nav_autotrophy',
                    title: '铁建自营',
                    harf: '#'
                },{
                    key: 'nav_poor',
                    title: '扶贫专区',
                    harf: '#'
                },{
                    key: 'nav_bid',
                    title: '招标采购',
                    harf: '#'
                },{
                    key: 'nav_finance',
                    title: '金融服务',
                    harf: '#'
                },{
                    key: 'nav_reuse',
                    title: '循环物资',
                    harf: '#'
                }
            ]
        }
    ]

    creatMenu = () => {
        let menu = this.menu;

        const getMenuItem = (arr) => {
            let list = [];
            list = arr.map((item, index) => {
                return (
                    <MenuItem key={item.key}><a href={item.harf}>{item.title}</a></MenuItem>
                )
            })
            return list
        }
        const getMenu = () => {
            let list = [];
            list = menu.map((item) => {
                if(item.children && item.children.length) {
                    return (
                        <SubMenu key={item.key} title={
                            <span>{item.title} <Icon type={item.icon}></Icon></span>
                        }>
                            {getMenuItem(item.children)}
                        </SubMenu>
                    )
                } else {
                    return <MenuItem key={item.key}>{item.title}</MenuItem>
                }
            })
            return list
        }

        return (
            <Menu className={less.menu} mode="horizontal">
                <SubMenu key="kf" title={<span>联系客服</span>}>
                                        <Menu.Item key="lx_menu"><a onClick={this.lxkfShow}>在线咨询</a></Menu.Item>
                                        <Menu.Item key="lx_our"><a href={systemConfigPath.jumpShopPage("/webNewsDetail/277684185084338176")}>联系客服</a></Menu.Item>
                                        <Menu.Item key="lx_help"><a href={systemConfigPath.jumpShopPage("/helpCenter/indexCenter")}>帮助中心</a></Menu.Item>
                                        <Menu.Item key="lx_con"><a onClick={this.tsjyShow}>投诉建议</a></Menu.Item>
                                    </SubMenu>

                                    <SubMenu key="map" title={<span>网站导航</span>}>
                                        <Menu.Item key="1"><a href={systemConfigPath.jumpShopPage("/")}  title="首页">首页</a></Menu.Item>
                                        <Menu.Item key="2"><a href={systemConfigPath.jumpShopPage("/inquiry/home")}  title="二三类采购">二三类采购</a></Menu.Item>
                                        <Menu.Item key="3"><a href={systemConfigPath.jumpShopPage("/reuse/home")} title="循环物资">循环物资</a></Menu.Item>
                                        <Menu.Item key="4"><a href={systemConfigPath.mallIndexUrl("/cms/bangongIndex")} title="办公专区">办公专区</a></Menu.Item>
                                        <Menu.Item key="5"><a href={systemConfigPath.mallIndexUrl("/cms/autotrophy")} title="铁建自营">铁建自营</a></Menu.Item>
                                        <Menu.Item key="6"><a href={systemConfigPath.jumpTenderingPage("/home")} title="招标采购">招标采购</a></Menu.Item>
                                        <Menu.Item key="7"><a href={systemConfigPath.mallIndexUrl("/cms/poorIndex")} title="扶贫专区">扶贫专区</a></Menu.Item>
                                        <Menu.Item key="8"><a href={systemConfigPath.mallIndexUrl("/cms/finance/service")} title="金融服务">金融服务</a></Menu.Item>
                                        <Menu.Item key="9">
                                            <Tooltip placement="bottomLeft" title="暂未开通，敬请期待">
                                                <a href="#" title="供应商名录">供应商名录</a>
                                            </Tooltip>
                                        </Menu.Item> 
                                    </SubMenu>
            </Menu>
        )
    }
    getMetaTitle = () => {
        let pathName = this.props.location.pathname;
        let meta = {};
        _METAS.forEach(v => {
            if(v.meta && v.meta.title) {
                let path = v.path;
                if(path.indexOf(':') !== -1) {
                    path = path.substring(0, path.indexOf(':') - 1)
                }
                const exp = new RegExp(path)
                if(exp.test(pathName)) {
                    meta = v.meta;
                }
            }
        })
        return meta
    }
    //首页
    toHome = () => {
        window.open(systemConfigPath.jumpCrccmallPage('/home'), '_self')
    }
    //登录
    toLogin = () => {
        window.open(systemConfigPath.jumpCrccmallPage('/login'), '_self')
    }
    //注册
    toRegister = () => {
        window.open(systemConfigPath.jumpCrccmallPage('/register'), '_self')
    }
    //退出
    loginOut = () => {
        // TO-DO 这里临时设置为清除后台登录状态成功后
        let flag = 500;
        if (Auth.hasToken()) {
            api.ajax("POST", "@/sso/loginControl/loginOut", {
            }).then(r => {
                flag = r.code;
                const { dispatch } = this.props;
                dispatch(setToken(''));
                Auth.removeToken();
                window.location.href=systemConfigPath.jumpCrccmallPage("/home");
                window.location.reload();
            }).catch(r => {
                if(flag == 200 || flag == "200"){
                    window.location.href=systemConfigPath.jumpCrccmallPage("/home");
                    window.location.reload();
                }
                Util.alert(r.msg, { type: "error" })
            })
        } else {
            window.location.href=systemConfigPath.jumpCrccmallPage("/home");
        }
    }
    //返回首页
    goHome = () => {
        // window.open(systemConfigPath.jumpPage("/home");
        this.props.history.push("/home")
    }

    render() {
        const meta = this.getMetaTitle()
        const { userInfo = {} } = this.props;

        return (
            <div className={less.header}>
                <div className={less.head_top}>
                    <Row className={less.main}>
                        <Col span={12}>
                            <span className={[less.link, less.line].join(' ')} onClick={this.toHome}> 门户首页 </span>
                            {
                                userInfo 
                                ? <Popover placement="bottom" 
                                    content={
                                        <div className={less.userInfo}>
                                            <div className={less.name}>{userInfo.companyName}</div>
                                            <div className={less.out}>
                                                <span className={less.out_btn} onClick={this.loginOut}>退出</span>
                                            </div>
                                        </div>
                                    } >
                                    <span className={less.link}  onClick={this.goHome}> {userInfo.username} </span>
                                </Popover> 
                                : <span>
                                    <span className={less.link} onClick={this.toLogin}> 请登录 </span>
                                    <span> 或 </span>
                                    <span className={less.link} onClick={this.toRegister}> 注册 </span>
                                </span>
                            }
                        </Col>
                        <Col span={12} className="reuse_baseMenu">{this.creatMenu()}</Col>
                    </Row>
                </div>
                <div className={less.head_center}>
                    <Row className={less.center_content}>
                        <Row className={less.main}>
                            <Col span={5}>
                                <img src={logo}></img>
                            </Col>
                            <Col span={10}>
                                <span className={less.title}>{typeof meta.title === "function" ? meta.title() : meta.title}</span>
                            </Col>
                        </Row>
                    </Row>
                </div>
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
  
export default withRouter(connect(mapStateToProps)(DeskHeader))
