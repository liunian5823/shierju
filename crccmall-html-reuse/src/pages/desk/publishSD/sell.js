import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PublishSD from './mixins'
import { Form } from 'antd'

class Sell extends PublishSD {
    constructor(props) {
        super(props);
    }
    // 新增接口
    submitUrl = '@/reuse/supplyDemand/insert';
    // 详情接口
    infoUrl = '@/reuse/supplyDemand/info';

    // 返回列表
    returnsList = () => this.props.history.push('/supply/sell');

    render() {
        return super.render();
    }
}
const mapStateToProps = state => {
    return {
        userInfo: state.authReducer.userInfo || {}
    }
}

export default Form.create()(withRouter(connect(mapStateToProps)(Sell)))

