import { NavLink } from 'react-router-dom';
import { Menu, Icon, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { switchMenu, setUserAuth, setToken } from '@/redux/action/index';
import { systemConfigPath } from "@/utils/config/systemConfig";
import less from './index.less';
// import logo from './logo.png';

const SubMenu = Menu.SubMenu;

class LeftNav extends React.Component {
    state = {
        menuTreeNode: '',
        currentKey: ['home'],
        defaultOpenKeys: [],
        openKeys: [],
    }
    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行

    componentWillMount() {
        this._isMounted = true;
        let currentKey = window.location.hash.split('/');
        currentKey[1] = currentKey[1] ? currentKey[1] : 'home';
        if (currentKey.length >= 3) {
            currentKey = '#/' + currentKey[1] + '/' + currentKey[2]
        } else {
            currentKey = '#/' + currentKey[1]
        }

        //反选当前菜单，2020-09-21 by jm
        let openKeys = [];
        if (currentKey.startsWith('#/sale')) {
            openKeys = ['/saleScene'];
            if (currentKey.startsWith('#/sale/bond')) {
                currentKey = '#/sale/bond';
            } else {
                currentKey = '#/sale/scene';
            }
        } else if (currentKey.startsWith('#/buy')) {
            openKeys = ['/buyScene'];
            currentKey = '#/buy/scene';
        } else if (currentKey.startsWith('#/supply')) {
            openKeys = ['/supply'];
            currentKey = '#/supply/sell';
        } else if (currentKey.startsWith('#/organization')) {
            openKeys = ['/organization'];
        } else if (currentKey.startsWith('#/verify')) {
            openKeys = ['/approval'];
            if (currentKey.startsWith('#/verify/setUp')) {
                currentKey = '#/verify/setUp';
            } else if (currentKey.startsWith('#/verify/manage')) {
                currentKey = '#/verify/manage';
            } else if (currentKey.startsWith('#/verify/order')) {
                currentKey = '#/verify/order';
            }
        }

        //
        const { dispatch } = this.props;
        // 获取左侧菜单数据
        dispatch(setUserAuth());
        this.setState({
            currentKey: [currentKey],
            openKeys: openKeys
        });
        // this.getCurrentKey()
    }

    getCurrentKey = () => {
        let path = window.location.hash;
        let currentKey = [];
        this.props.menuList.map(v => {
            let url = v.url.indexOf(':') !== -1 ? v.url.substring(0, v.url.indexOf(':') - 1) : v.url;
            const exp = new RegExp(url);
            if (exp.test(path)) {
                currentKey = []
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handelClickMenu = ({ item, key }) => {
        if (key === '#/home') {
            this.setState({ openKeys: [] });
        }
        if (key == this.state.currentKey) {
            return false;
        }
        // 事件派发，自动调用reducer，通过reducer保存到store对象中
        const { dispatch } = this.props;
        dispatch(switchMenu(item.props.eventKey));
        this.setState({
            currentKey: [key]
        })
    }

    // 菜单渲染
    renderMenu = (data) => {
        var match = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
        return data.map((item, index) => {
            if (item.children && item.children.length > 0) {
                if (item.children[0].premesType != 2) {
                    let key = item.url || item.id;
                    return (
                        <SubMenu title={
                            <span style={{
                                fontSize: "14px !important"
                            }}>
                                <i style={{
                                    marginRight: 10,
                                    fontSize: "15px !important"
                                }}
                                    className={"iconfont icon-" + item.icon} />
                                {item.name}
                            </span>
                        } key={key}>
                            {this.renderMenu(item.children)}
                        </SubMenu>
                    )
                }
            }

            let ele = null, _url = null, key = null;

            if (!item.url) {
                //二级菜单没有url
                key = item.id;
                _url = '404';
                ele = <NavLink to={_url} replace>{item.name}</NavLink>
            } else if (item.url.indexOf("#") != -1) {
                key = item.url;
                _url = item.url.replace("#", '');
                ele = <NavLink to={_url} replace>{item.name}</NavLink>
            } else if (match.test(item.url)) {
                key = item.id;
                _url = item.url
                ele = <a href={_url}>{item.name}</a>
                ele = item.name
            } else if (item.url) {
                key = item.id;
                // _url = '/seller/' + item.url
                _url = item.url
                ele = <a href={_url}>{item.name}</a>
            } else {
                //如果是xxx返回404
                key = item.id;
                _url = '404';
                ele = <NavLink to={_url} replace>{item.name}</NavLink>
            }
            return (
                <Menu.Item title={item.name} key={key} style={{fontSize: "14px !important"}}>
                    {item.name == '首页' && <span style={{fontSize: "14px !important"}}>
                        <i style={{
                            marginRight: 10,
                            fontSize: "15px !important"
                        }}
                            className={"iconfont icon-shouye"}/>
                    </span>}
                    {ele}
                </Menu.Item>
            )
        });
    }

    onOpenChange = (item) => {
        if(!item || !item.key) return;
        const curKeys = item.key;
        let { openKeys } = this.state;
        if(item.open) {
            //打开
            openKeys = [curKeys]
        } else {
            //关闭
            openKeys = []
        }
        this.setState({ openKeys })
    }

    render() {
        const menuList = this.renderMenu(this.props.menuList);

        return (
            <div className={less.main_leftNav}>
                <div className={less.leftNav_wrapper}>
                    <Menu
                        style={{ border: 0 }}
                        className={less.main_leftNav_menu}
                        defaultOpenKeys={this.state.defaultOpenKeys}
                        selectedKeys={this.state.currentKey}
                        mode="inline"
                        openKeys={this.state.openKeys}
                        onClick={this.handelClickMenu}
                        onOpen={this.onOpenChange}
                        onClose={this.onOpenChange}
                    >
                        {/* <Menu.Item title={"首页"} key={"#/home"}><a href={systemConfigPath.jumpPage('/home')}>首页</a></Menu.Item> */}
                        {/* <Menu.Item title={"首页"} key={"#/buyHome"}>
                            <NavLink to={"/buyHome"} replace>首页（购方）</NavLink>
                        </Menu.Item>
                        <Menu.Item title={"首页"} key={"#/sellHome"}>
                            <NavLink to={"/sellHome"} replace>首页（销方）</NavLink>
                        </Menu.Item> */}
                        {menuList}
                    </Menu>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        menuList: state.ebikeData.menuList
    }
}

export default connect(mapStateToProps)(LeftNav)
