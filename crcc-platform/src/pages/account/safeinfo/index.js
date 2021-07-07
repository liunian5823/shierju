import { Card, Row, Col, Icon, Button, Form, Rate } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import less from './index.less'
import BaseDetails from '@/components/baseDetails'
import ModalrePwd from './rePwd';
import ModalreEmail from './reEmail';
import ModalrePhone from './rePhone';

class Info extends React.Component {

  _isMounted = false
  _userInfo = null

  state = {
    //账户信息
    accountInfo: {},
    // 状态，
    pwdStatus: '',
    emailStatus: '',
    phoneStatus: '',
    idcardStatus: 0,
    // 修改密码弹窗
    ModalrePwdShow: false,
    // 修改验证邮箱
    ModalreEmailShow: false,
    // 修改绑定手机号
    ModalrePhoneShow: false,
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidMount() {
    this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
      if (this._userInfo || !obj) { return false }
      this._userInfo = obj;
      // 获得用户基本信息后执行加载回调
      this.initDataFn();
    }.bind(this));//
    PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
  }

  componentWillUnmount() {
    this._isMounted = false;
    PubSub.unsubscribe(this.pubsub_userInfo);
  }

  initDataFn = () => {
    this.getaccountInfo();
  }

  getaccountInfo = () => {
    api.ajax("GET", "@/platform/ecUser/get", {
      uuids: this._userInfo.uuids
    }).then(r => {
      if (!this._isMounted) { return }
      this.getLastLoginInfo(r.data.id)

      let phoneStatus = r.data.phoneBindStatus == 1 ? 2 : 1;
      let pwdStatus = r.data.passwordStatus - 1;
      let emailStatus = 0;
      if (r.data.mailBindStatus == 2 && r.data.email) {
        //状态是解绑但是有邮箱
        emailStatus = 1
      } else if (r.data.mailBindStatus == 1) {
        //状态是绑定
        emailStatus = 2
      }
      this.setState({
        accountInfo: r.data,
        emailStatus,
        pwdStatus,
        phoneStatus
      })
    }).catch(r => {
      Util.alert(r.msg, { type: "error" })
    })
  }

  // 获取最后登录信息
  getLastLoginInfo = (id) => {
    api.ajax("POST", "@/sso/ecLoginError/queryLastLoginInfo", {
      loginUserId: id
    }).then(r => {
      if (!this._isMounted) { return }

    }).catch(r => {
      Util.alert(r.msg, { type: "error" })
    })
  }

  openModal = (modalName, show = false, isSuccess = false) => {
    if (isSuccess) {
      this.getaccountInfo();
    }
    this.setState({
      [modalName]: show
    })
  }

  toRePwd = () => {
    this.openModal('ModalrePwdShow', true);
  }

  toReEmail = () => {
    this.openModal('ModalreEmailShow', true);
  }

  toRePhone = () => {
    this.openModal('ModalrePhoneShow', true);
  }

  //渲染性别
  renderGenter = (value) => {
    if (value == 1) {
      return '男'
    } else if (value == 0) {
      return '女'
    } else {
      return null
    }
  }

  //隐藏中间值，默认是隐藏手机号
  renderHideInfo = (value, type = 'phone') => {
    switch (key) {
      case value:

        break;

      default:
        break;
    }
  }

  // 安全等级
  renderSafeLeavel = (leavel) => {
    if (leavel >= 4) {
      return <span className={[less.leavel_text, less.success].join(' ')}>较好</span>
    } else if (leavel >= 3) {
      return <span className={[less.leavel_text, less.warning].join(' ')}>良好</span>
    } else {
      return <span className={[less.leavel_text, less.error].join(' ')}>较差</span>
    }
  }

  //安全提示语言
  renderSafeTip = (leavel, msg) => {
    if (leavel >= 4) {
      return <span className={[less.leavel_text, less.success].join(' ')}>{msg}</span>
    } else {
      return msg
    }
  }

  //渲染icon
  renderIcon = (key) => {
    switch (this.state[key]) {
      case 0:
        return <Icon type="cross-circle" className={[less.icon, less.error].join(' ')} />
        break;
      case 1:
        return <Icon type="exclamation-circle" className={[less.icon, less.warning].join(' ')} />
        break;
      case 2:
        return <Icon type="check-circle" className={[less.icon, less.success].join(' ')} />
        break;
      default:
        return <Icon type="cross-circle" className={[less.icon, less.error].join(' ')} />
        break;
    }
  }

  //提示语言
  renderTips = (key, msg) => {
    switch (this.state[key]) {
      case 0:
        return <span className={less.error}>{msg}</span>
        break;
      case 1:
        return <span className={less.warning}>{msg}</span>
        break;
      case 2:
        return <span className={less.success}>{msg}</span>
        break;
      default:
        return <span className={less.warning}>{msg}</span>
        break;
    }
  }

  //操作按钮
  renderBtns = (key, type) => {
    if (type == 0) {
      return <Button type="primary" onClick={this.toRePwd}>修改密码</Button>
    } else if (type == 1) {
      switch (this.state[key]) {
        case 0:
          return <Button type="primary" onClick={this.toReEmail}>绑定邮箱</Button>
          break;
        case 1:
          return <Button type="primary" onClick={this.toReEmail}>验证邮箱</Button>
          break;
        case 2:
          return <Button ton type="primary" onClick={this.toReEmail}>解绑邮箱</Button>
          break;
        default:
          return <Button type="primary" onClick={this.toReEmail}>解绑邮箱</Button>
          break;
      }
    } else if (type == 2) {
      return <Button type="primary" onClick={this.toRePhone}>重新绑定</Button>
    } else if (type == 3) {
      return <Button type="primary" disabled={true}>暂未开放</Button>
    }
  }

  render() {
    const accountInfo = this.state.accountInfo;
    const securityLevel = accountInfo.securityLevel || 0;

    return (
      <div>
        <Card bordered={false} title="账户信息" key={1} className="mb10">
          <Row className={less.account_info}>
            <Col span={12} key="1" className={less.base_info}>
              <Row>
                <Col span={22} key={2}>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="姓名">
                        {accountInfo.username}
                      </BaseDetails>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="性别">
                        {this.renderGenter(accountInfo.gender)}
                      </BaseDetails>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="联系电话">
                        {Util.formatterData('phone', accountInfo.phone)}
                      </BaseDetails>
                    </Col>

                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="电子邮箱">
                        {Util.formatterData('email', accountInfo.email)}
                      </BaseDetails>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={12} key="2" className={less.base_info}>
              <Row>
                <Col span={22} offset={1} >
                  <Row className={less.row}>
                    <BaseDetails title="安全等级">
                      <Rate disabled value={securityLevel} />
                      {this.renderSafeLeavel(securityLevel)}
                    </BaseDetails>
                  </Row>
                  <Row className={less.row}>
                    <BaseDetails title="安全建议">
                      {this.renderSafeTip(securityLevel, accountInfo.safetyAdvice)}
                    </BaseDetails>
                  </Row>
                  <Row key="3" className={less.row}>
                    <BaseDetails title="最后登录时间">
                      {accountInfo.lastLoginTime}
                    </BaseDetails>
                  </Row>
                  <Row className={less.row}>
                    <BaseDetails title="最后登录地点">
                      {accountInfo.lastLoginAddress}
                    </BaseDetails>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="安全中心" className="mb10" bodyStyle={{ paddingTop: 0 }}>
          <Row className={less.card_row}>
            <Col span={4} className={less.border_right}>
              {this.renderIcon('pwdStatus')}
              <span className={less.title}>登录密码</span>
            </Col>
            <Col span={20}>
              <Row>
                <Col span={16} className={less.tip}>
                  {this.renderTips('pwdStatus', accountInfo.passwordMsg)}
                </Col>
                <Col span={8} className={less.btn_group}>
                  {this.renderBtns('pwdStatus', 0)}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={less.card_row}>
            <Col span={4} className={less.border_right}>
              {this.renderIcon('emailStatus')}
              <span className={less.title}>邮箱验证</span>
            </Col>
            <Col span={20}>
              <Row>
                <Col span={16} className={[less.tip].join(' ')}>
                  {this.renderTips('emailStatus', accountInfo.mailBindMsg)}
                </Col>
                <Col span={8} className={less.btn_group}>
                  {this.renderBtns('emailStatus', 1)}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={less.card_row}>
            <Col span={4} className={less.border_right}>
              {this.renderIcon('phoneStatus')}
              <span className={less.title}>手机验证</span>
            </Col>
            <Col span={20}>
              <Row>
                <Col span={16} className={less.tip}>
                  {this.renderTips('phoneStatus', accountInfo.phoneBindMsg)}
                </Col>
                <Col span={8} className={less.btn_group}>
                  {this.renderBtns('phoneStatus', 2)}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={less.card_row}>
            <Col span={4} className={less.border_right}>
              {this.renderIcon('idcardStatus')}
              <span className={less.title}>实名注册</span>
            </Col>
            <Col span={20}>
              <Row>
                <Col span={16} className={less.tip}>
                  {/* {this.renderTips('idcardStatus', accountInfo.realNameVerificationMsg)} */}
                  {this.renderTips('idcardStatusNull', '该功能暂未开放')}
                </Col>
                <Col span={8} className={less.btn_group}>
                  {this.renderBtns('idcardStatus', 3)}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        {/* 修改密码弹窗 */}
        <ModalrePwd
          title="修改密码"
          visible={this.state.ModalrePwdShow}
          onOk={this.openModal}
          accountInfo={accountInfo}
        />
        {/* 修改密码弹窗 */}
        <ModalreEmail
          title="修改邮箱"
          visible={this.state.ModalreEmailShow}
          onOk={this.openModal}
          accountInfo={accountInfo}
        />
        {/* 修改密码弹窗 */}
        <ModalrePhone
          title="重新绑定手机号码"
          visible={this.state.ModalrePhoneShow}
          onOk={this.openModal}
          accountInfo={accountInfo}
        />
      </div>
    )
  }
}

export default Form.create()(Info);