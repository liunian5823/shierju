import { Button, Switch } from 'antd'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

/***
 * 1.传入属性会继承到输出的元素上
 * 2.elmType 可选择、 默认输入button
 * 
 * ***/
class AuthButton extends React.Component {

    _childList = []

    getThisPathList = (arr) => {
        //获得当前页面菜单的按钮组
        let url = "#";
        let urlArr = this.props.match.url.split('/')
        url += urlArr.join('/');
        // 2020年3月20日11:05:06 -end
        for (let i = 0; i < arr.length; i++) {
            if (url == arr[i].url && arr[i].children) {
                this._childList = arr[i].children;
            }
            if (arr[i].url && arr[i].children) {
                this.getThisPathList(arr[i].children)
            }
        }
    }

    render() {
        // 处理权限
        let isAllow = false;//是否允许操作或显示

        this.getThisPathList(this.props.menuList);
        const childList = this._childList;
        
        for (var j = 0; j < childList.length; j++) {
            if (childList[j].name == this.props.elmName || childList[j].name == this.props.children) {
                isAllow = true;
                break;
            }
        }
        switch (this.props.elmType) {
            case 'content':
                if (isAllow) {
                    return this.props.children
                } else {
                    return null
                }
                break;
            case 'switch':
                if (isAllow) {
                    return <Switch {...this.props} />
                } else {
                    return <Switch {...this.props} disabled={true} />
                }
                break;
            case 'a':
                if (isAllow) {
                    return <a href='javascript: void(0)' {...this.props}>{this.props.children}</a>
                } else {
                    return null
                }
                break;
            default:
                if (isAllow) {
                    return <Button {...this.props}>{this.props.children}</Button>
                } else {
                    return null
                }
                break;
        }
    }
}

const mapStateToProps = state => {
    return {
        menuList: (state.ebikeData && state.ebikeData.menuList) || []
    }
}

export default withRouter(connect(mapStateToProps)(AuthButton))