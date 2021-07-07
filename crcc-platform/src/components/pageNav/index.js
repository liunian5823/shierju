import { Icon, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom';
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
      if (j == 0 && j == (pathObjList.length - 1)) {
        breadcrumbList.push(<Breadcrumb.Item key={_url}><Icon type="environment-o" />当前位置：<NavLink to={_url} replace>{pathObjList[j].name}</NavLink></Breadcrumb.Item>);
      } else if (j == 0) {
        breadcrumbList.push(<Breadcrumb.Item key={_url}><Icon type="environment-o" />当前位置：{pathObjList[j].name}</Breadcrumb.Item>);
      } else if (j == (pathObjList.length - 1)) {
        breadcrumbList.push(<Breadcrumb.Item key={_url}>{pathObjList[j].name}</Breadcrumb.Item>);
      } else if (j != 0) {
        breadcrumbList.push(<Breadcrumb.Item key={_url}><NavLink to={_url} replace>{pathObjList[j].name}</NavLink></Breadcrumb.Item>);
      }
    }
    if(pathObjList.length==0){
      breadcrumbList.push(<Breadcrumb.Item key={0}><Icon type="environment-o" />当前位置：</Breadcrumb.Item>);
    }

    return breadcrumbList;
  }

  render() {
    const breadcrumbList = this.createBreadcrumb(this.props.history.location.pathname);
    return (
      <div className={less.page_nav} style={{ "padding": "10px 24px" }}>
        <Breadcrumb separator=">">
          {breadcrumbList}
        </Breadcrumb>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    menuList: state.menuList,
  }
}

export default withRouter(connect(mapStateToProps)(PageNav))