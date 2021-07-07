import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { setToken } from '@/redux/action/index';
import { Row, Col, Button, Icon, Dropdown, Menu } from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import Auth from '@/utils/auth';
import less from './index.less';
import { setUserAuth } from '@/redux/action/index';
import down from "./img/down.png";
import Personal from "./img/Personal.png";
import Platform from "./img/Platform.png";
import workAudited from "./img/workAudited.png";
import loop from "./img/loop.png";
import Network from "./img/network.png";
import Network2 from "./img/network2.png";
import zhaobiao from "./img/zhaobiao.png";
import workAudited2 from "./img/workAudited2.png";
import loop2 from "./img/loop2.png";
import zhaobiao2 from "./img/zhaobiao2.png";

class Top extends React.Component {
  state = {
    premesSonType: window.localStorage.getItem('premesSonType')?window.localStorage.getItem('premesSonType'):'PTZX'
  }
  _isMounted = false;

  componentWillMount() {
    console.log(window.localStorage.getItem('premesSonType'), "window.localStorage.getItem('premesSonType')");
    if(!window.localStorage.getItem('premesSonType')){
      window.localStorage.setItem('premesSonType','PTZX')
    }
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
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
        this.props.history.push('/login')
      }).catch(r => {
        Util.alert(r.msg, { type: "error" })
      })
    } else {
      this.props.history.push('/login');
    }
  }

  toMessage = () => {
    this.props.history.push('/message/messageList')
  }

  handleChangeMenu=( key)=> {
    this.setState({
      premesSonType: key.key
    },()=>{
      const { dispatch } = this.props;
      window.localStorage.setItem('premesSonType', key.key)
      dispatch(setUserAuth());
	  if(key.key == 'ZWMS' || key.key == 'ZXHS' || key.key == 'DZZB' || key.key == 'ZWMP'){
		  this.props.history.push('/home')
	  }
    })
  }
  handleChangeMenuNew=( key)=> {
    const { dispatch } = this.props;
    this.setState({
      premesSonType: key
    })
    window.localStorage.setItem('premesSonType', key)
    dispatch(setUserAuth());
    if(key == 'PTZX' || key == 'PTMM'){
      this.props.history.push('/home')
    }
  }
  componentDidUpdate(a,b){
    console.log(a,b, 123);
  }
  render() {
    const menu = (
      <Menu onClick={this.handleChangeMenu.bind(this)}>
        <Menu.Item value="运营管理后台" key="HT">
          <div className={less.menu_item_div}>
            <img src={Network} width={15} />运营管理后台
          </div>
        </Menu.Item>
        <Menu.Item value="物资销售" key="ZWMS">
          <div className={less.menu_item_div}>
            <img src={workAudited} width={15} />二三类物资
          </div>
        </Menu.Item>
        <Menu.Item value="物资循环" key="ZXHS">
          <div className={less.menu_item_div}>
            <img src={loop} width={15} />物资循环
          </div>
        </Menu.Item>
		<Menu.Item value="供应商管理" key="ZWMP">
		  <div className={less.menu_item_div}>
		    <img src={zhaobiao} width={15} />供应商管理
		  </div>
		</Menu.Item>
        <Menu.Item value="电子招标" key="DZZB">
          <div className={less.menu_item_div}>
            <img src={zhaobiao} width={15} />电子招标
          </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={less.main_top}>
        <div style={{display: 'flex'}}>
          <Dropdown overlay={menu} arrow>
            <a
              style={{background: this.state.premesSonType != 'PTZX' && this.state.premesSonType != 'PTMM' ? '#002453' : '#004197'}}
              className={less.ant_dropdown_link}>
              <img src={
                this.state.premesSonType == 'HT' ? Network2:
                this.state.premesSonType == 'ZWMS' ? workAudited2:
                this.state.premesSonType == 'ZXHS' ? loop2:
                this.state.premesSonType == 'DZZB' ? zhaobiao2: Network2
              } width={15} />
              {
                this.state.premesSonType == 'HT' ? '运营管理后台':
                this.state.premesSonType == 'ZWMS' ? '二三类物资':
                this.state.premesSonType == 'ZXHS' ? '物资循环':
                this.state.premesSonType == 'DZZB' ? '电子招标': '运营管理后台'
              }
              <img src={down} width={12}/>
            </a>
          </Dropdown>
          <a onClick={this.handleChangeMenuNew.bind(this, 'PTZX')}
            className={less.ant_dropdown_link}
            style={{display: 'flex', paddingLeft: 20 ,background: this.state.premesSonType == 'PTZX' ? '#002453' : '#004197'}}>
            <img src={Personal} width={15} />
            个人中心
          </a>
          <a onClick={this.handleChangeMenuNew.bind(this, 'PTMM')}
            className={less.ant_dropdown_link}
            style={{display: 'flex', paddingLeft: 20 ,background: this.state.premesSonType == 'PTMM' ? '#002453' : '#004197'}}>
            <img src={Platform} width={15} />
            管理中心
          </a>
        </div>
        <div className={less.main_right}>
          <Row className={less.header_top}>
            <Col span="12" offset={12} className={less.right_info}>
              <Button className={less.msgIcon} shape="circle" onClick={this.toMessage}>
                <Icon type="notification" />
              </Button>
              <Button className={less.userImg} shape="circle" onClick={this.outLogin} title="退出">
                <Icon type="poweroff" />
              </Button>
              <span className={less.username}>{this.props.userInfo?this.props.userInfo.username:''}</span>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(Top))