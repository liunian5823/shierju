import { NavLink } from 'react-router-dom';
import { Menu, Icon, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { switchMenu, setUserAuth, setToken } from '@/redux/action/index';
import { systemConfigPath } from "@/utils/config/systemConfig";
import less from './index.less';
import './index.css'
import { withRouter } from 'react-router'

const SubMenu = Menu.SubMenu;

class LeftNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultOpenKeys: ['twHome'],
            currentKey: ['basicInfo']
        };
    }
    componentWillMount() {

    }
    handelClickMenu = ({ item, key }) => {
        console.log(item, key)
        this.setState({currentKey: [...key]})
        this.props.history.push({ pathname: key})
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
            key: '/tw/cirHome', 
            route: '',
            name: '首页',
            icon: './static/img/twbureau/home@2x.png'
        }, {
            key: 'goodsManage', 
            route: '',
            name: '循环物资管理',
            icon: './static/img/twbureau/xunhuan@2x.png',
            subMenu: [{
                key: '/tw/goods/list', 
                route: '',
                name: '循环物资一览'
            },{
                key: '/tw/goods/equipment', 
                route: '',
                name: '施工设备管理'
            },{
                key: '/tw/goods/rests', 
                route: '',
                name: '其他循环物资管理'
            },{
                key: '/tw/goods/applyFor', 
                route: '',
                name: '物资状态更新申请'
            },{
                key: '/tw/goods/audit', 
                route: '',
                name: '物资状态更新审核'
            },{
                key: '/tw/goods/updateQuery', 
                route: '',
                name: '物资状态更新查询'
            }]
        }, {
            key: 'cirManage', 
            route: '',
            name: '物资周转管理',
            icon: './static/img/twbureau/zhouzhuan@2x.png',
            subMenu: [{
                key: '/tw/circle/list', 
                route: '',
                name: '物资周转列表'
            },{
                key: '/tw/circle/applyFor', 
                route: '',
                name: '物资周转申请'
            },{
                key: '/tw/circle/audit', 
                route: '',
                name: '物资周转审核'
            },{
                key: '/tw/circle/query', 
                route: '',
                name: '物资周转查询'
            }]
        }, {
            key: 'rentManage', 
            route: '',
            name: '物资租赁管理',
            icon: './static/img/twbureau/rent@2x.png',
            subMenu: [{
                key: '/tw/rent/list', 
                route: '',
                name: '物资租赁明细'
            }]
        }]
        return (
            <div className={less.main_leftNav}>
                <div className={less.leftNav_wrapper}>
                    <Menu
                        style={{ border: 0 }}
                        className={less.main_leftNav_menu}
                        defaultOpenKeys={this.state.defaultOpenKeys}
                        selectedKeys={this.state.currentKey}
                        defaultSelectedKeys={this.state.currentKey}
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
export default withRouter(connect(mapStateToProps)(LeftNav))
