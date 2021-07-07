import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { setToken,setUserInfo } from '@/redux/action/index';
import api from '@/framework/axios';//请求接口的封装
import Auth from '@/utils/auth';

import Top from '@/components/top';
import LeftNav from '@/components/leftNav';

import PageNavs from '@/components/pageNav';
import less from '@/style/common.less';


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
    } else {
      this.props.history.push("/login")
    }
    // console.log(Auth.hasToken());

    //获得用户信息并分发给其他组件
    api.ajax("POST", "@/sso/loginControl/getUserBaseInfo", {
    }).then(r => {
      if (!this._isMounted) { return }
      this._userInfo = JSON.parse(r.data)
      const { dispatch } = this.props;
      dispatch(setUserInfo(JSON.parse(r.data)))
      PubSub.publish('PubSub_SendUser', JSON.parse(r.data));
      this.setState({
        userInfo: JSON.parse(r.data)
      })
    }).catch(r => {

    })


    this.pubsub_getUser = PubSub.subscribe('PubSub_GetUser', function (topic, message) {
      PubSub.publish('PubSub_SendUser', this._userInfo);
    }.bind(this));
  }

  componentDidMount() {
    if (this.props.token) {
    } else if (!this.props.token && Auth.hasToken()) {
      const { dispatch } = this.props;
      dispatch(setToken(Auth.hasToken()));//将cookie存入redux
    } else {
      this.props.history.push("/login")
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    this._userInfo = null
  }

  render() {
    return (
      <div className={less.main_page}>
        <LeftNav />
        <div className={less.main_wrapper}>
          <Top userInfo={this.state.userInfo} />
          <PageNavs />
          <div className={less.main_content}>
            <div className={less.body} id="main">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.token
  }
}

export default withRouter(connect(mapStateToProps)(Admin))