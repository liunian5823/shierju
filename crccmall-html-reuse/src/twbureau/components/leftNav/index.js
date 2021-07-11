import { NavLink } from 'react-router-dom';
import { Menu, Icon, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { switchMenu, setUserAuth, setToken } from '@/redux/action/index';
import { systemConfigPath } from "@/utils/config/systemConfig";
import less from './index.less';
// import logo from './logo.png';

const SubMenu = Menu.SubMenu;

class LeftNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount() {

    }
    handelClickMenu = ({ item, key }) => { 
    }
    render() {
        const MenuIcon = ({imgSrc}) => (
             <Icon component={() => (
                 <img
                     className={less.icon}
                     src={imgSrc}
                     alt="icon"
                 />
             )}/>
        );
        const menu = [{
            key: 'twHome', 
            route: '',
            name: '首页',
            icon: './static/img/twbureau/home@2x.png'
        }, {
            key: 'materialManage', 
            route: '',
            name: '循环物资管理',
            icon: './static/img/twbureau/xunhuan@2x.png',
            subMenu: [{
                key: 'basicInfo', 
                route: '',
                name: '循环物资一览'
            }]
        }]
        return (
            <div className={less.main_leftNav}>
                <div className={less.leftNav_wrapper}>
                    {/* <img src="./static/img/twbureau/xunhuan@2x.png" />
                <MenuIcon imgSrc={'./static/img/twbureau/home@2x.png'}/> */}
                    <Menu
                        style={{ border: 0 }}
                        className={less.main_leftNav_menu}
                        defaultOpenKeys={this.state.defaultOpenKeys}
                        selectedKeys={this.state.currentKey}
                        mode="inline"
                        onClick={this.handelClickMenu}
                    >
                        {
                            menu.map((item, index) => {
                                if (item.subMenu) {
                                    return (
                                    <SubMenu key={item.key} title={
                                        <div className={less.flex}>
                                            <img src={item.icon} className={less.icon}/>
                                            <span>{item.name}</span>
                                        </div>
                                    }>
                                        {
                                            item.subMenu.map((subitem, subIndex) => {
                                                return (
                                                    <Menu.Item key={subitem.key}>
                                                        {subitem.name}
                                                    </Menu.Item>
                                                )
                                            })
                                        }
                                    </SubMenu>)
                                } else {
                                    return (
                                        <Menu.Item key={item.key} className={less.flex}>
                                            <img src={item.icon} className={less.icon}/>
                                            {item.name}
                                        </Menu.Item>
                                        )
                                }
                            }) 
                        }
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
