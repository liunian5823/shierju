import { Icon, Card, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { NavLink, Link } from 'react-router-dom';
import less from './index.less';


class PageNav extends React.Component {

    getMenuObj = (arr, pathSnippets, result = [], url = "#", index = 0) => {
        if (arr == [] || index == (pathSnippets.length)) {
            return result;
        }
        url += '/' + pathSnippets[index];
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].url == url && arr[j].children) {
                result.push(arr[j])
                return this.getMenuObj(arr[j].children, pathSnippets, result, url, ++index);
            } else if (arr[j].premesType == 2) {
                let urlAndParams = arr[j].url ? arr[j].url.split(':').filter(i => i) : [];
                if (urlAndParams.length > 0 && urlAndParams[0] == pathSnippets[index] && (urlAndParams.length + index) == pathSnippets.length) {
                    result.push(arr[j])
                    return result
                }
                if (arr[j].url == pathSnippets[index]) {
                    result.push(arr[j])
                    return result
                }
            } else if (arr[j].url == url && arr[j].premesType == 1 && (index == (pathSnippets.length - 1))) {
                result.push(arr[j])
                return result
            }
        }
        return result
    }

    createBreadcrumb = (currentUrl) => {
        let _url = ''
        let pathSnippets = currentUrl.split('/').filter(i => i);
        let breadcrumbList = [];
        let pathObjList = this.getMenuObj(this.props.menuList, pathSnippets);
        for (let j = 0; j < pathObjList.length; j++) {
            _url += '/' + pathSnippets[j];
            //只有一个的情況下
            if (j == 0 && j == (pathObjList.length - 1)) {
                breadcrumbList.push(<Breadcrumb.Item key={_url}><Icon type="environment-o" className={less.icon_color} />当前位置：<NavLink to={_url} replace>{pathObjList[j].name}</NavLink></Breadcrumb.Item>);
            } else if (j == 0) {
                //多个情况下的第一个
                breadcrumbList.push(<Breadcrumb.Item key={_url}><Icon type="environment-o" className={less.icon_color} />当前位置：{pathObjList[j].name}</Breadcrumb.Item>);
            } else if (j == (pathObjList.length - 1)) {
                if (this.props.contentTitle) {
                    breadcrumbList.push(
                        <Breadcrumb.Item key={this.props.location.pathname}>
                            <NavLink to={this.props.location.pathname} replace>{pathObjList[j].name}</NavLink>
                        </Breadcrumb.Item>
                    );
                } else {
                    breadcrumbList.push(<Breadcrumb.Item key={_url}>{pathObjList[j].name}</Breadcrumb.Item>);
                }
            } else if (j != 0) {
                breadcrumbList.push(<Breadcrumb.Item key={_url}><NavLink to={_url} replace>{pathObjList[j].name}</NavLink></Breadcrumb.Item>);
            }
        }
        if (this.props.contentTitle) {
            breadcrumbList.push(<Breadcrumb.Item key={this.props.contentTitle}>{this.props.contentTitle}</Breadcrumb.Item>);
        }

        if (breadcrumbList.length == 0) {
            breadcrumbList.push(<Breadcrumb.Item key={_url}><Icon type="environment-o" className={less.icon_color} />当前位置：</Breadcrumb.Item>)
        }
        return breadcrumbList;
    }
    //获取面包屑
    getBreadcrumb = () => {
        let obj = this.getUrlAndName(this.props.menuList);
        let name = '#' + this.props.history.location.pathname;
        // let name = this.props.history.location.pathname;
        let list = [];
        for (const key in obj) {
            let url = key.indexOf(':') !== -1 ? key.substring(0, key.indexOf(':') - 1) : key;
            const exp = new RegExp(url);
            if (exp.test(name)) {
                list = obj[key].map((item, index) => {
                    return (
                        <Breadcrumb.Item key={item.url}>
                            {
                                (index == 1 && item.url.indexOf('#') != -1)
                                    ? <Link to={item.url.replace('#', '')} replace>{item.name}</Link>
                                    : <span>{item.name}</span>
                            }
                        </Breadcrumb.Item>
                    )
                })
            }
        }

        list.unshift(
            <span key="head">
                <Icon type="environment-o" className={less.icon_color} />当前位置：
            </span>
        )

        if (name.includes('sellDetail')) {
            list.push(
                <Breadcrumb.Item key='gyxq'>
                    供求详情
                        </Breadcrumb.Item>
            )
        }

        if (name.includes('sceneDetail')) {
            list.push(
                <Breadcrumb.Item key='ckxq'>
                    查看详情
                        </Breadcrumb.Item>
            )
        }
        if (name.includes('sellOrderDetail')) {
            list.push(
                <Breadcrumb.Item key='ckdD'>
                    查看订单
                        </Breadcrumb.Item>
            )
        }
        if (name.includes('sellCreateOrder')) {
            list.push(
                <Breadcrumb.Item key='scdD'>
                    生成订单
                        </Breadcrumb.Item>
            )
        }
        if (name.includes('orderDetail')) {
            list.push(
                <Breadcrumb.Item key='ckdd'>
                    <span className={less.detail_font}>竞价销售管理 &nbsp; &gt;&nbsp; 竞价单管理  &nbsp;&gt;&nbsp; </span>
                    <span> 查看订单</span>
                        </Breadcrumb.Item>
            )
        }
        
        if (name.includes('orderConfirm')) {
            list.push(
                <Breadcrumb.Item key='qrdd'>
                    <span className={less.detail_font}>竞价销售管理 &nbsp; &gt;&nbsp; 竞价单管理  &nbsp;&gt;&nbsp; </span>
                    <span> 确认订单</span>
                        </Breadcrumb.Item>
            )
        }
        // offer_detail
        if (name.includes('offer_detail')) {
            list.push(
                <Breadcrumb.Item key='bjxq'>
                    {/* <span className={less.detail_font}>竞价销售管理 &nbsp; &gt;&nbsp; 竞价单管理  &nbsp;&gt;&nbsp; 查看详情  &nbsp;&gt;&nbsp;</span> */}
                    <span className={less.detail_font}>竞价销售管理 &nbsp; &gt;&nbsp; 竞价单管理  &nbsp;&gt;&nbsp; </span>
                    <span> 报价详情</span>
                        </Breadcrumb.Item>
            )
        }
        if (name.includes('buy/order')) {
            list.push(
                <Breadcrumb.Item key='CKDD'>
                    <span className={less.detail_font}>竞价采购管理 &nbsp; &gt;&nbsp;竞价报名  &nbsp;&gt;&nbsp; </span>
                    <span> 查看订单</span>
                        </Breadcrumb.Item>
            )
        }
        return list;
    }
    //获取所有路由对应的名称
    getUrlAndName = (menuList, value) => {
        let p = {};
        for (let i = 0; i < menuList.length; i++) {
            let menu = menuList[i];
            let v = value ? [...value] : [];
            v.push({ ...menu })
            if (menu.children) {
                p[menu.url] = v;
                p = { ...p, ...this.getUrlAndName(menu.children, v) }
            } else {
                p[menu.url] = v;
            }
        }
        return p
    }

    render() {
        // const breadcrumbList = this.createBreadcrumb(this.props.history.location.pathname);
        const breadcrumbList = this.getBreadcrumb();

        return (
            <div className={less.breadcrumb_box}>
                <Card bordered={false} bodyStyle={{ padding: '8px 24px' }}>

                    <Breadcrumb separator=">">
                        {breadcrumbList}
                    </Breadcrumb>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        menuList: state.ebikeData.menuList,
        contentTitle: state.contentReducer.contentTitle,
    }
}
export default withRouter(connect(mapStateToProps)(PageNav));
