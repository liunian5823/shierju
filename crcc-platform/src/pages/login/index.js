import { Form, Input, Button, Row, Col, Card } from 'antd';
import { connect } from 'react-redux';
import { setToken } from '@/redux/action/index';
import DragValidate from '@/components/drapValidate';
import api from '@/framework/axios';//请求接口的封装
import Auth from '@/utils/auth';
import Util from '@/utils/util';
import less from './index.less';
import logo from './logo.png';
const FormItem = Form.Item;

class Login extends React.Component {

  _isMounted = false
  _clientId = null
  _clientTime = null

  state = {
    loading: false,
    codeLoading: false,
    codeTime: -1,
    active: 1,
    drapStatus: false
  }

  componentWillMount() {
    this._isMounted = true;
    this._clientId = Util.randomString(64)
    // 每10分钟刷新一次
    this._clientTime = setInterval(() => {
      this._clientId = Util.randomString(64)
      //this.getImg();
      this.forceUpdate();
    }, 60000)
  }
  componentDidMount() {
    this.getImg()
    let paddingTop = document.body.clientHeight - 560;
    this.refs.login_bg.style.paddingTop = paddingTop > 0 ? (paddingTop / 2) + 'px' : 0;
  }

  componentWillUnmount() {
    clearInterval(this._clientTime);
    this._isMounted = false;
  }

  //滑动验证结果
  drapResult = (result) => {
    this.setState({
      drapStatus: result
    })
  }

  handleToReLogin = () => {
    let href = window.location.href.split('#')[0] + '#/relogin'
    window.open(href);
    // this.props.history.push('/relogin')
  }

  // //获得图形验证码
  getImg = () => {
    let elmImg = document.getElementById('img');

    elmImg.src =  SystemConfig.configs.ecCaptchaUrl + '/sso/ecCaptchaController/ecCaptcha' + '?' + 'clientId=' + this._clientId + '&_=' + Math.random();
  }

  //发送短信验证码
  sendSimCode = () => {
    this.props.form.validateFields(['phone'], (errors, values) => {
      if (!!errors && !this.state.codeLoading) {
        return;
      } else {
        this.setState({
          codeLoading: true
        })
      }
      api.ajax('GET', '@/sso/loginControl/sendSmsCode', {
        phone: values.phone,
        type: 7,
        flag: 5,//平台用户
      }).then(r => {
        this.setState({
          codeLoading: false
        })
        this.toTiming(true);
      }).catch(r => {
        this.setState({
          codeLoading: false
        })
        Util.alert(r.msg, { type: 'error' })
      })
    })
  }

  //开始计时
  toTiming = (reset = false) => {
    if (!this._isMounted) { return }
    let time = this.state.codeTime;
    if (reset) {
      time = 61
    }
    if (time >= 0) {
      this.setState({
        codeTime: --time
      })
      setTimeout(() => { this.toTiming() }, 1000);
    }
  }

  smsCodeBtn = () => {
    if (this.state.codeTime >= 0) {
      return <Button disabled={true} className={less.sms_btn} >短信验证码({this.state.codeTime})</Button>
    } else {
      return <Button type="primary" className={less.sms_btn} disabled={!this.state.drapStatus} loading={this.state.codeLoading} onClick={this.sendSimCode}>发送短信验证码</Button>
    }
  }

  //提交数据
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log('收到表单值：', this.props.form.getFieldsValue());

      this.submit(values);
    });
  }
  //真正提交数据
  submit = (params) => {
    // 获得登录ipƒ
    let loginIpStr = window.returnCitySN ? JSON.stringify(window.returnCitySN) : '';

    if (this.state.loading) {
      return
    } else {
      this.setState({
        loading: true
      })
    }

    let sendUrl = params.password ? '@/sso/loginControl/login' : '@/sso/loginControl/loginWithPhoneAndSmsCode';

    api.ajax('POST', sendUrl, {
      ...params,
      clientId: this._clientId,
      loginIpStr
    }).then(r => {
      this.setState({
        loading: false
      })


      let resData = JSON.parse(r.data)
      
      if (resData.userType != 5) {
        // 如果登录身份不是供应商采购商，则不跳转
        Util.alert("当前登录的用户不是平台用户", { type: "error" })
        return;
      }

      const { dispatch } = this.props;
      dispatch(setToken(resData.access_token));//将cookie存入redux
      Auth.setLoginStatus();//设置cookie为登录状态
      Auth.setToken(resData.access_token);//设置cookie为登录状态

      this.props.history.push('/');
    }).catch(r => {
      this.setState({
        loading: false
      })
      Util.alert(r.msg, { type: "error" })
      if (this.state.active == 1) {
        this.getImg()
      }
    })
  }


  //
  onChangeForm = (type) => {
    if (type == this.state.active) { return }
    this.setState({
      active: type,
      codeTime: -1,
      drapStatus: false
    })
    if (type == 1) {
      setTimeout(() => {
        this.getImg()
      }, 300);
    }
  }

  renderForm = (type) => {
    const { getFieldProps } = this.props.form;
    if (type == 1) {
      return [
        <Row key={1}>
          <Col span={24}>
            <FormItem
            >
              <Input
                maxLength={20}
                placeholder="请输入账户名/手机号"
                {...getFieldProps('userAccount', {
                  rules: [
                    { required: true, message: '请输入账户名/手机号' },
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row key={2}>
          <Col span={24}>
            <FormItem
            >
              <Input
                maxLength={32}
                type="password"
                placeholder="请输入密码"
                {...getFieldProps('password', {
                  rules: [
                    { required: true, message: '请输入密码' },
                  ]
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row key="3">
          <Col span={16}>
            <FormItem
            >
              <Input type="text" placeholder="图形验证码"
                {...getFieldProps('captchaCode', {
                  rules: [
                    { required: true, message: '请输入图形验证码' },
                  ]
                })}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <div className={less.validate_img} onClick={this.getImg}>
              <img src="" alt="" id="img" />
            </div>
          </Col>
        </Row>
      ]
    } else if (type == 2) {
      return [
        <Row key={11}>
          <Col span={24}>
            <FormItem
            >
              <Input placeholder="请输入手机号"
                maxLength={11}
                {...getFieldProps('phone', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入手机号' },
                    { pattern: /^[1][0-9]{10}$/, message: '请输入正确的手机号' },
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row key={1112}>
          <Col span={24}>
            <FormItem
            >
              <DragValidate drapResult={this.drapResult}></DragValidate>
            </FormItem>
          </Col>
        </Row>,
        <Row key={12}>
          <Col span={14}>
            <FormItem>
              <Input placeholder="请输入短信验证码"
                maxLength={6}
                {...getFieldProps('smsCode', {
                  rules: [
                    { required: true, message: '请输入短信验证码' },
                  ],
                })}
              />
            </FormItem>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            {this.smsCodeBtn()}
          </Col>
        </Row>
      ]
    }
  }

  render() {

    return (
      <div className={[less.login_bg, 'login_area'].join(' ')} ref="login_bg">
        <Card bordered={false} className={less.login_card}  >
          <div className={less.logo}>
            <img src={logo} alt="" />
          </div>
          <h2 className={less.title}>
            铁建商城平台综合管理系统
          </h2>
          <div className={less.tab_area}>
            <div className={[less.tab_item].join(' ')}>
              <a href="javascript:void(0)"
                className={this.state.active == 1 ? less.active : ''}
                onClick={() => {
                  this.onChangeForm(1)
                }}
              >
                账户密码登录
                </a>
            </div>
            <div className={less.tab_item}>
              <a href="javascript:void(0)"
                className={this.state.active == 2 ? less.active : ''}
                onClick={() => {
                  this.onChangeForm(2)
                }}
              >
                手机号登录
                </a>
            </div>
          </div>
          <Form horizontal onSubmit={this.handleSubmit}>
            {this.renderForm(this.state.active)}
            <Row className="mb10">
              <Col span="24">
                <Button type="primary" htmlType="submit" className={less.login_btn} loading={this.state.loading}>登录</Button>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <div className={less.text_right}>
                  <a href="javascript:void(0)" onClick={this.handleToReLogin}>忘记密码?</a>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    )
  }
}


export default connect()(Form.create()(Login))


