import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { setToken } from '@/redux/action/index';
import { Row, Col, Button, Icon, Popover } from 'antd';
import Auth from '@/utils/auth';
import api from '@/framework/axios'//请求接口的封装
import { systemConfigPath } from '@/utils/config/systemConfig'
import Util from '@/utils/util'
import less from './index.less';



class Top extends React.Component {

  _isMounted = false

  state = {
    companyName: '供应商管理系统',
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {
    if (this.props.userInfo.userType && this.props.userInfo.userType != 3) {
      this.outLogin()
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toHome = () => {
    //window.location.href = "/seller/index"
    //this.props.history.push('/')
    //跳转商城首页
    window.location.href = systemConfigPath.jumpCrccmallPage('/home');
  }

  outLogin = () => {
    // TO-DO 这里临时设置为清除后台登录状态成功后
    if (Auth.hasToken()) {
      api.ajax("POST", "@/sso/loginControl/loginOut", {
      }).then(r => {
        if (!this._isMounted) { return }
        const { dispatch } = this.props;
        dispatch(setToken(''));
        Auth.removeToken();//设置cookie为登录状态
        //Util.toLogin()
        //this.props.history.push('/');
        window.open(systemConfigPath.jumpCrccmallPage("/home"));
      }).catch(r => {
        Util.alert(r.msg, { type: "error" })
      })
    } else {
      Util.toLogin()
    }
  }

  toMessage = () => {
    this.props.history.push('/message/messageList')
  }

  render() {
    const popover = <div><p>{this.props.userInfo.companyName}</p><p>{this.props.userInfo.email}</p></div>
    return (
      <div className={less.main_top}>
        <div className={less.top_container}>
          <Row className={less.header_top}>
            <Col span="12">
              <div className={less.logo} onClick={this.toHome}>
                {/* <img src={logo} alt="" /> */}
                LOGO
              </div>
            </Col>
            <Col span="12" className={less.right_info}>
              <Button className={less.msgIcon} shape="circle" onClick={this.toMessage}>
                <Icon type="notification" />
              </Button>
              <Button className={less.userImg} shape="circle" onClick={this.outLogin} title="退出">
                <Icon type="poweroff" />
              </Button>
              <Popover content={popover} placement="bottom">
                <span className={less.username}>
                  <span className="mr10">{this.props.userInfo.username}</span>
                  <Icon type="caret-down" />
                </span>
              </Popover>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(Top))