import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import EditModel from './model'
class ChannelManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            data: null,
            modelVisible: false,
            refresh: true,
        };
    };
    iframe = null;
    _childList = [];

    getThisPathList = (arr) => {
        //获得当前页面菜单的按钮组
        let url = "#/";
        let urlArr = this.props.match.url.split('/');
        if (urlArr.length >= 2) {
            url += urlArr[1] + '/' + urlArr[2]
        } else {
            url += urlArr[1]
        }
        for (let i = 0; i < arr.length; i++) {
            if (url == arr[i].url && arr[i].children) {
                this._childList = arr[i].children;
            }
            if (url.indexOf(arr[i].url) >= 0 && arr[i].url && arr[i].children) {
                this.getThisPathList(arr[i].children)
            }
        }
    };

    componentDidMount() {
        let _this = this;
        window.addEventListener('message', function (e) {
            let data = JSON.parse(e.data);
            _this.setState({
                ...data
            }, () => _this.switchModel())
        });
    }
    // 显示/ 隐藏 model
    switchModel = e => {
        if (this.state.modelVisible) {
            this.setState({
                modelVisible: !this.state.modelVisible,
                data: null,
                type: null,
                refresh: false
            }, () => {
                if (e !== true) {
                    this.setState({
                        refresh: true
                    });
                }
            });
        } else {
            this.setState({
                modelVisible: !this.state.modelVisible
            })
        }
    };
    url = 'http://localhost';
    render() {
        this.getThisPathList(this.props.menuList);
        const childList = this._childList;
        let url = location.origin + '/static/crccmall/#/reuse/home';
        if (childList[0]) {
            url = childList.find(value => value.name === "链接前台首页").url;
        }
        let modelOption = {
            visible: this.state.modelVisible,
            data: this.state.data,
            type: this.state.type,
            closeBack: this.switchModel
        };
        return (
            <div style={{ height: '100%' }}>
                <EditModel {...modelOption} src={url} />
                <iframe id="channelManagement" name="ifrmname" ref={ref => this.iframe = ref} src={url} width="100%" height="100%" frameBorder="0" />
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        menuList: state.menuList
    }
};
export default withRouter(connect(mapStateToProps)(ChannelManagement))
