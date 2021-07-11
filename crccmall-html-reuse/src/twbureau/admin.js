import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { setToken } from '@/redux/action/index';
import api from '@/framework/axios';//请求接口的封装
import Auth from '@/utils/auth';
import Util from '@/utils/util';

import Top from '@/twbureau/components/top';
import LeftNav from '@/twbureau/components/leftNav';
import less from '@/style/twcommon.less';

class Admin extends React.Component {
  _isMounted = false
  _userInfo = null

  state = {
    userInfo: {}
  }

  componentWillMount() {
    this._isMounted = true
    //获得用户token;
    if (this.props.token) {

    } else if (!this.props.token && Auth.hasToken()) {
      const { dispatch } = this.props;
      dispatch(setToken(Auth.hasToken()));//将cookie存入redux
    }
    else {
      // Util.toLogin();
    }
    //获得用户信息并分发给其他组件
    // this.getUserInfo();


    this.pubsub_getUser = PubSub.subscribe('PubSub_GetUser', function (topic, obj) {
      PubSub.publish('PubSub_SendUser', this._userInfo);
    }.bind(this));
  }

  /**
  * 获得用户基础数据
  */
  getUserInfo = () => {
    api.ajax("POST", "@/sso/loginControl/getUserBaseInfo", {
    }).then(r => {
      if (!this._isMounted) { return }
      this._userInfo = JSON.parse(r.data)
      PubSub.publish('PubSub_SendUser', JSON.parse(r.data));
      window.gaodauuids = JSON.parse(r.data).companyCompanyUuids;
      window.localStorage.setItem('xnwz_user_info', r.data)
      this.setState({
        userInfo: JSON.parse(r.data)
      })
    }).catch(r => {
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    this._userInfo = null
  }


  render() {
    return (
      <div className={less.main_page}>
        <Top userInfo={this.props.userInfo} />
        <div className={less.main_wrapper} >
          <div className={less.main_scroll} id="main">
            <div className={less.main_center} >
              <LeftNav />
              <div className={less.main_content}>
                <div className={less.body} id="main" style={{
                  display: this.props.showContent ? "none" : "block"
                }}>
                  {this.props.children}
                </div>
                <div style={{
                  display: !this.props.showContent ? "none" : "block"
                }} id="index_detail"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
    showContent: state.contentReducer.showContent,
    userInfo: state.authReducer.userInfo || {}
  }
}

export default withRouter(connect(mapStateToProps)(Admin))
