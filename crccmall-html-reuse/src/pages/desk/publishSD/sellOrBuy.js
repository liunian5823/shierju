import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PublishSD from './mixins'
import { Form } from 'antd'

class Sell extends PublishSD {
    constructor(props) {
        super(props);
    }
    // 新增接口
    sellSubmitUrl = '@/reuse/supplyDemand/insert';

    buySubmitUrl = '@/reuse/supplyDemand/insert';

    //编辑接口
    submitUrl = '@/reuse/supplyDemand/update';

    // 详情接口
    infoUrl = '@/reuse/supplyDemand/info';

    // 返回列表
    returnsList = () => {
        if (this.state.submitForm.type == 1) {
            this.props.history.push('/supply/sell');
        } else {
            this.props.history.push('/supply/sell');
        }
    }

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

