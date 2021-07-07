import { Form, Input, Button, Row, Col, Icon, Steps, Card } from 'antd';
import { connect } from 'react-redux';
import api from '@/framework/axios';//请求接口的封装
import DragValidate from '@/components/drapValidate';
import Util from '@/utils/util';
import less from './index.less';
const FormItem = Form.Item;
const Step = Steps.Step;

class Login extends React.Component {

  _isMounted = false
  _params = {}//保存表单提交信息
  _isSuccess = true//重置密码失败

  state = {
    loading: false,
    codeLoading: false,
    canNext: false,
    codeTime: -1,
    currentStep: 0,
    drapStatus: false
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  drapResult = (result) => {
    this.setState({
      drapStatus: result
    })
  }

  handleToLogin = () => {
    this.props.history.push('/login')
  }

  // //获得图形验证码
  // getImg = () => {
  //   api.ajax('POST', '@/sso/imageServelt', {
  //   }).then(r => {
  //     console.log(r);
  //   }).catch(r => {
  //     Util.alert(r.msg, { type: "error" })
  //   })
  // }

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
        type: 8//忘记密码时发送
      }).then(r => {
        this.setState({
          codeLoading: false,
          canNext: true
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
      return <Button disabled={true} className={less.sms_btn}>短信验证码({this.state.codeTime})</Button>
    } else {
      return <Button type="primary" className={less.sms_btn} disabled={!this.state.drapStatus} loading={this.state.codeLoading} onClick={this.sendSimCode}>发送短信验证码</Button>
    }
  }

  //验证短信验证码
  validSmsCode = () => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this._params = values;
      const {phone,smsCode} = values;
      api.ajax('GET', '@/sso/loginControl/commonValidateSmsCode', {
        phone,
        verifyCode:smsCode,
        type: 8//忘记密码时发送
      }).then(r => {
        if (!this._isMounted) {
          return;
        }
        this.nextStepForm();
      }).catch(r => {
        if(r.code=="100106"){
          this._phoneTime++;
          if(this._phoneTime>=4){
            Util.alert("短信验证码多次错误,请换种方式重试!",{type: "error",callback:this.reloadPage()});
          }else{
            Util.alert(r.msg, { type: "error" })
          }
        }else{
          Util.alert(r.msg, { type: "error" })
        }
      })
    });
  }

  // 校验两次密码
  checkPass = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  checkPass2 = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }

  //提交数据
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      this.submit({
        ...values,
        ...this._params
      });
    });
  }
  //真正提交数据
  submit = (params) => {
    if (this.state.loading) {
      return
    } else {
      this.setState({
        loading: true
      })
    }
    api.ajax('POST', '@/sso/loginControl/forgetPwdReset', {
      ...params
    }).then(r => {
      this.setState({
        loading: false
      })

      this.nextStepForm();
    }).catch(r => {
      this.setState({
        loading: false
      })
      Util.alert(r.msg, { type: "error" })
      this._isSuccess = false;
      this.nextStepForm();
    })
  }



  //下一步
  nextStepForm = () => {
    let step = ++this.state.currentStep;
    this.setState({
      currentStep: step,
      codeTime: -1
    })
  }

  renderForm = (type) => {
    const { getFieldProps } = this.props.form;
    if (type == 0) {
      return [
        <Row key={11}>
          <Col span={24}>
            <FormItem
            >
              <Input placeholder="请输入手机号"
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
        <Row key={111}>
          <Col span={24}>
            <FormItem
            >
              <DragValidate drapResult={this.drapResult} ></DragValidate>
            </FormItem>
          </Col>
        </Row>,
        <Row key={12}>
          <Col span={14}>
            <FormItem>
              <Input placeholder="请输入短信验证码"
                {...getFieldProps('smsCode', {
                  rules: [
                    { pattern: /^[\d]{6}$/, message: '请输入正确的短信验证码' },
                    { required: true, message: '请输入短信验证码' },
                  ],
                })}
              />
            </FormItem>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            {this.smsCodeBtn()}
          </Col>
        </Row>,
        <Row className="mb10" key={3}>
          <Col span="24">
            <Button type="primary"
              disabled={!this.state.canNext}
              className={less.login_btn}
              loading={this.state.loading}
              onClick={this.validSmsCode}
            >
              下一步
            </Button>
          </Col>
        </Row>
      ]
    } else if (type == 1) {
      return [
        <Row key={1}>
          <Col span={24}>
            <FormItem
            >
              <Input type="password" placeholder="请输入密码"
                {...getFieldProps('password', {
                  rules: [
                    { required: true, message: '请输入密码' },
                    { pattern: /^(?!^(\d+|[a-zA-Z]+|[_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+)$)^[\w_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]{8,32}$/, message: '密码中包含数字和大小写字母，8位～32位' },
                    { validator: this.checkPass },
                  ]
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row key={2}>
          <Col span={24}>
            <FormItem
            >
              <Input type="password" placeholder="请输入密码"
                {...getFieldProps('confirmPassword', {
                  rules: [
                    { required: true, message: '请输入密码' },
                    { pattern: /^(?!^(\d+|[a-zA-Z]+|[_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+)$)^[\w_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]{8,32}$/, message: '密码中包含数字和大小写字母，8位～32位' },
                    { validator: this.checkPass2, }
                  ]
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row className="mb10" key={3}>
          <Col span="24">
            <Button type="primary" onClick={this.handleSubmit} className={less.login_btn} loading={this.state.loading}>完成</Button>
          </Col>
        </Row>
      ]
    } else if (type == 2) {
      if (this._isSuccess) {
        return [
          <div className={less.relogin_result} key={1}>
            <div className={less.icon_box}>
              <Icon type="check-circle" className={[less.icon, less.success].join(' ')} />
            </div>
            <h2 className={less.title}>
              修改密码完成
            </h2>
          </div>,
          <Row className="mb10" key={3}>
            <Col span="24" style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={this.handleToLogin}>返回登录</Button>
            </Col>
          </Row>
        ]
      } else {
        return [
          <div className={less.relogin_result} key={1}>
            <div className={less.icon_box}>
              <Icon type="cross-circle" className={[less.icon, less.error].join(' ')} />
            </div>
            <h2 className={less.title}>
              修改密码失败
            </h2>
          </div>,
          <Row className="mb10" key={3}>
            <Col span="24" style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={this.handleToLogin}>返回登录</Button>
            </Col>
          </Row>
        ]
      }
    }
  }

  render() {

    return (
      <div className={[less.login_bg, 'login_area'].join(' ')}>
        <Card bordered={false} className={less.login_card}>
          <h2 className={less.title}>
            找回密码
          </h2>
          <div className={less.step_area}>
            <Steps current={this.state.currentStep}>
              <Step title="手机找回" />
              <Step title="重置密码" />
              <Step title="操作完成" />
            </Steps>
          </div>
          <Form horizontal>
            {this.renderForm(this.state.currentStep)}
          </Form>
        </Card>
      </div>
    )
  }
}


export default connect()(Form.create()(Login))