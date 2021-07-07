/**
 * 底部悬浮按钮组
 * 带权限拦截功能
 *
 * Created by zhouby on 2018/6/24/024.
 */

import {Affix} from 'antd';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {Menu, Dropdown, Button, Icon} from 'antd';
import  './detailsBtns.css'


class DetailsBtns extends React.Component {
    componentDidMount() {
        setTimeout(function () {
            window.scrollTo(0, 1)
            window.scrollTo(0, 0)
        }, 0)
    };

    render() {
        return (
            <div>
                <Affix offsetBottom={0}>
                    <div className="detailsBtns" style={this.props.style}>
                        {this.props.children}
                    </div>
                </Affix>
            </div>
        )
    }
}
/*
 * 按照权限拦截按钮
 * noauth 不进行权限拦截
 * only 单一按钮权限拦截
 * switch 单一按钮,switch组件
 * name switch组件需要添加name匹配
 * */
class PermissionsBtn_ extends React.Component {

    dfs=(item,name)=>{
        if(Array.isArray(item)){
            for(let i=0;i<item.length;i++){
                let n = this.dfs(item[i],name)
                if(n){
                    return n;
                }
            }
            return [];
        }
        if(item.url&&item.url.indexOf("#")==0) {
            let url = item.url;
            if(url.substring(1,url.length)==name){
                return  item.children;
            }
        }
        if(item.url&&item.url==name){
            return item.children?item.children:[];
        }
        if(item.children){
            for(let i=0;i<item.children.length;i++){
                let n=this.dfs(item.children[i],name)
                if(n){
                    return n;
                }
            }
        }
    }

    //switch单独处理
    switch=(menu,pathname,name)=>{
        let btns = this.dfs(menu,pathname);
        let f=false;
        //多环境配置,开发本地测试不添加按钮权限
        if(process.env.NODE_ENV === 'development'){
            return this.props.children;
        }
        for(let i=0;i<btns.length;i++){
            if(name==btns[i].name){
                return this.props.children;
            }
        }
        return <Switch disabled {...this.props.children.props}/>
    }

    childrenRender() {
        let menu = this.props.menu;
        let children = this.props.children;
        //pathname
        let pathname=this.props.location.pathname;
        //按钮组里面不会有switch,switch只会出现在单组件里面
        if(this.props.only&&this.props.children&&this.props.children.props&&this.props.children.props.prefixCls=="ant-switch") {
            return this.switch(menu,pathname,this.props.name);
        }

        if (!children) {
            return (
                <div className="list-btns"></div>
            )
        }
        if (!Array.isArray(children)) {
            children = [children];
        }
        // 当前页所有按钮权限
        let btns = this.dfs(menu,pathname);
        children = children.filter((r) => {
            //判断按钮是否显示,不显示的按钮直接过滤掉
            if(r.props.style&&r.props.style.display=="none"){
                return false;
            }
            //不需要权限拦截
            if(this.props.noauth){
                return true;
            }
            //判断按钮权限
            let f=false;
            //多环境配置,开发本地测试不添加按钮权限
            if(process.env.NODE_ENV === 'development'){
                f=true;
            }
            for(let i=0;i<btns.length;i++){
                let name;
                //Popconfirm
                if(r.props.children&&r.props.children.props&&r.props.children.props.children){
                    name=r.props.children.props.children
                }
                //按钮
                if(typeof r.props.children ==='string'){
                    name=r.props.children;
                }
                if(!name)return false;
                if(btns[i].name==name){
                    f=true;
                    break;
                }
            }
            return f;
        })
        if(this.props.only){
            //按钮组里面不会有switch,switch只会出现在单组件里面
            //啥权限没有
            if(children.length==0){
                return null;
            }
            if(children.length==1){
                return React.cloneElement(children[0], {type:"primary"});
            }
        }

        //需要取4以上按钮放到下拉菜单里,并且第一个显示蓝色
        if (children.length > 5) {
            return (
                <div className="btns list-btns">
                    {
                        // React.cloneElement(children[0], {type: "primary"})
                    }
                    {children.slice(0, 4)}
                    <Dropdown overlay={
                        <Menu>
                            {
                                children.slice(4, children.length).map((c) => {
                                    return (
                                        <Menu.Item>
                                            <span {...c.props}>{c.props.children}</span>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                    }>
                        <Button>更多</Button>
                    </Dropdown>
                </div>
            )
        } else {
            return (
                <div className="btns list-btns">
                    {
                        children.length > 0 ? children.slice(0, children.length) : ""
                    }
                </div>
            )
        }
    }

    render() {
        return this.childrenRender();
    }
}
const mapStateToProps = state => {
    return {
        menu:  state.authReducer.userInfo ? state.authReducer.userInfo.menu : []
    };
};

const mapDispatchProps = dispatch => ({});
let PermissionsBtn = withRouter(connect(mapStateToProps, mapDispatchProps)(PermissionsBtn_));
export {
    DetailsBtns, PermissionsBtn
}