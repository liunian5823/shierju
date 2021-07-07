import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { setUserAuth } from '@/redux/action/index';
import less from './index.less';
import logo from './logo.png';


const SubMenu = Menu.SubMenu;

class LeftNav extends React.Component {
    state = {
        menuTreeNode: '',
        currentKey: [],
        defaultOpenKeys: []
    }

    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行

    componentWillMount() {
        this._isMounted = true;
        let currentKey = window.location.hash.split('/');
        let defaultOpenKeys = window.location.hash.split('/');
        defaultOpenKeys = '#/' + defaultOpenKeys[1];
        currentKey[1]=currentKey[1]?currentKey[1]:'home';
        if (currentKey.length >= 3) {
            currentKey = '#/' + currentKey[1] + '/' + currentKey[2]
        } else {
            currentKey = '#/' + currentKey[1]
        }
        // 
        const { dispatch } = this.props;

        dispatch(setUserAuth());

        this.setState({
            currentKey: [currentKey],
            defaultOpenKeys: [defaultOpenKeys]
        });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handelClickMenu = ({ item, key }) => {
        if (!this._isMounted) { return }
        if (key == this.state.currentKey) {
            return false;
        }
        let currentKey = [item.props.eventKey]
        // 事件派发，自动调用reducer，通过reducer保存到store对象中
        // const { dispatch } = this.props;
        // dispatch(switchMenu(item.props.eventKey));
        this.setState({
            currentKey
        });
    }

    // 菜单渲染
    renderMenu = (data) => {
        var match = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
        return data.map((item, index) => {
            if (item.children && item.children.length > 0) {
                if (item.children[0].premesType != 2) {
                    let key = item.url || item.id;
                    return (
                        <SubMenu title={item.name} key={key}>
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
                _url = '/admin/' + item.url
                ele = <a href={_url}>{item.name}</a>
            } else {
                //如果是xxx返回404
                key = item.id;
                _url = '404';
                ele = <NavLink to={_url} replace>{item.name}</NavLink>
            }
            return (
                <Menu.Item title={item.name} key={key}>
                    {ele}
                </Menu.Item>
            )
        });
    }

    render() {
        const menuList = this.renderMenu(this.props.menuList);
        return (
            <div className={less.main_leftNav}>
                <div className={less.main_leftNav_logo}>
                    <img src={logo} alt="" />
                </div>
                <Menu
                    style={{ border: 0, background: '#002A61' }}
                    className={less.main_leftNav_menu}
                    defaultOpenKeys={this.state.defaultOpenKeys}
                    selectedKeys={this.state.currentKey}
                    mode="inline"
                    theme="dark"
                    onClick={this.handelClickMenu}
                >
                    {menuList}
                </Menu>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        menuList: state.menuList
    }
}

export default connect(mapStateToProps)(LeftNav)
