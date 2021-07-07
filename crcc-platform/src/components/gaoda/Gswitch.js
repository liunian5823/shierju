/**
 * Created by zhouby on 2018/4/18/018.
 */

import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {
    Select,
    Card,
    Form,
    Col,
    Input,
    Button,
    Icon,
    Table,
    Divider,
    Menu,
    Dropdown,
    Modal,
    Radio,
    Checkbox
} from 'antd';
import ReactDom from 'react-dom';
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import {showContent, hideContent} from '@/redux/gaoda/content/ContentAction'

class Gswitch_ extends React.Component {
    static defaultProps = {
        switchShow: "",
        contentTitle: ""
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
    };

    componentWillUnmount() {
        this.props.hideContent({
            showContent: false,
            contentTitle: ""
        });
        ReactDom.unmountComponentAtNode(document.getElementById("index_detail"));
    };

    componentWillReceiveProps(nextProps) {
        if(this.props.switchShow!=nextProps.switchShow){
            this.receive = false;
        }else{
            this.receive = true;
        }
    }
    indexDetail_=(r)=>{
        this.indexDetail=r;
    }
    renderElement() {
        if(this.receive&&this.indexDetail&&this.indexDetail.forceUpdate){
            this.indexDetail.forceUpdate();
            return null;
        }
        if (Array.isArray(this.props.children)) {
            let element,isShow=false,title="";
            this.props.children.map((context, index) => {
                //显示对应ref的标签
                if (context.ref == this.props.switchShow) {
                    isShow = true;
                    title = context.props.title;
                    element = React.cloneElement(context, {indexDetail:this.indexDetail_,show: true, key: index});
                }
            })
            if(element){
                ReactDom.unmountComponentAtNode(document.getElementById("index_detail"));
                this.props.showContent({
                    showContent: isShow,
                    contentTitle: title
                });
            }else{
                this.props.showContent({
                    showContent: isShow,
                    contentTitle: ''
                });
                // ReactDom.unmountComponentAtNode(document.getElementById("index_detail"));
            }
            return element ? element : (null);
        } else {
            if (this.props.children.ref == this.props.switchShow) {
                ReactDom.unmountComponentAtNode(document.getElementById("index_detail"));
                this.props.showContent({
                    showContent: true,
                    contentTitle: this.props.children.props.title
                });
                return React.cloneElement(this.props.children, {indexDetail:this.indexDetail_,show: true});
            } else {
                this.props.showContent({
                    showContent: false,
                    contentTitle: ""
                });
                // ReactDom.unmountComponentAtNode(document.getElementById("index_detail"));
                return (null);
            }
        }
    }

    render() {
        return (
            <div>
                {this.renderElement()}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {};
};

const mapDispatchProps = dispatch => ({
    showContent: bindActionCreators(showContent, dispatch),
    hideContent: bindActionCreators(hideContent, dispatch)
});
let Gswitch = connect(mapStateToProps, mapDispatchProps)(Gswitch_);


class Gcontext extends React.Component {
    static defaultProps = {
        show: true
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (this.props.show) {
            this.props.indexDetail(ReactDom.unstable_renderSubtreeIntoContainer(
                this,
                this.props.children,
                document.getElementById("index_detail")))
        }
        return <div></div>
    }
}
export {
    Gswitch,
    Gcontext
}