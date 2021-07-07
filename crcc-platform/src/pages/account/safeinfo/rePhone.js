import { Modal, Form, Input, Row, Col, Steps, Icon } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import less from './index.less'

const Step = Steps.Step;
const FormItem = Form.Item;

class ModalForm extends React.Component {
  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  _visible = false
  _modalName = "ModalrePhoneShow"
  _clientId = null
  _clientTime = null
  params = {}

  state = {
    _loading: false,
    codeLoading: false,
    codeTime: -1,
    codeLoading2: false,
    codeTime2: -1,

    currentStep: 0,
    result: false
  }

  componentWillMount() {
    this._isMounted = true;
    this._clientId = Util.randomString(64)
    // 每10分钟刷新一次
    this._clientTime = setInterval(() => {
      this._clientId = Util.randomString(64)
      this.getImg();
    }, 60000)
  }

  componentDidMount() {
    // this.getImg()
  }

  componentWillUnmount() {
    clearInterval(this._clientTime);
    this._isMounted = false;
  }

  componentWillUpdate() {
    this._visible = this.props.visible
  }

  componentDidUpdate() {
    if (this._visible != this.props.visible) {
      this.props.form.resetFields();
      let oldPhone = Util.formatterData('phone', this.props.accountInfo.phone)
      this.props.form.setFieldsValue({ "oldPhone": oldPhone });
      this.getImg();
    }
  }

  // //获得图形验证码
  getImg = () => {
    let elmImg = document.getElementById('img');

    elmImg.src =  'https://test.crccmall.com:8443/api' + '/sso/ecCaptchaController/ecCaptcha' + '?' + 'clientId=' + this._clientId + '&_=' + Math.random();
    // ？？？？？ elmImg.src =  SystemConfig.configs.ecCaptchaUrl + '/sso/ecCaptchaController/ecCaptcha' + '?' + 'clientId=' + this._clientId + '&_=' + Math.random();
  }

  //验证图片验证码
  validateImg = (key, codeLoading) => {
    this.props.form.validateFields(['captchaCode'], (errors, values) => {
      if (!!errors) {
        this._getSmsCode = false;
        return;
      }
      if (this._getSmsCode) {
        return;
      }
      this._getSmsCode = true;
      api.ajax('POST', '@/sso/ecCaptchaController/validateCaptchaCode', {
        ...values,
        clientId: this._clientId
      }).then(r => {
        this._getSmsCode = false;
        this.sendSimCode(key, codeLoading)
      }).catch(r => {
        this._getSmsCode = false;
        Util.alert(r.msg, { type: 'error' })
        this.getImg()
      })
    })
  }

  //发送短信验证码
  sendSimCode = (key, codeLoading = 'codeLoading') => {
    let type = codeLoading == "codeLoading" ? 6 : 5;
    this.props.form.validateFields([key], (errors, values) => {
      if (!!errors && !this.state[codeLoading]) {
        return;
      } else {
        this.setState({
          [codeLoading]: true
        })
      }
      let phone = key == "oldPhone" ? this.props.accountInfo.phone : values[key];
      api.ajax('GET', '@/sso/loginControl/sendSmsCode', {
        phone,
        type
      }).then(r => {
        this.setState({
          [codeLoading]: false
        })
        this.toTiming(true, codeLoading);
      }).catch(r => {
        this.setState({
          [codeLoading]: false
        })
        Util.alert(r.msg, { type: 'error' })
      })
    })
  }

  //开始计时
  toTiming = (reset = false, codeLoading = 'codeLoading') => {
    if (!this._isMounted) { return }
    let codeTime = codeLoading == 'codeLoading' ? 'codeTime' : 'codeTime2';
    let time = this.state[codeTime];
    if (reset) {
      time = 61
    }
    if (time >= 0) {
      this.setState({
        [codeTime]: --time
      })
      setTimeout(() => { this.toTiming(false, codeLoading) }, 1000);
    } else {
      // 如果倒计时结束
      this._clientId = Util.randomString(64)
      this.getImg();
    }
  }


  handelSubmit = () => {
    let currentStep = this.state.currentStep;
    let validateList = [];
    if (currentStep == 0) {
      validateList = ['oldPhoneCode']
      this.props.form.validateFields(validateList, (errors, values) => {
        if (!!errors) {
          return;
        }
        this.props.form.resetFields(['captchaCode'])
        this.params = {
          ...values,
          oldPhone: this.props.accountInfo.phone
        }
        this.setState({
          currentStep: ++currentStep
        })
        // 更换clientId
        this._clientId = Util.randomString(64)
        this.getImg();
      })
    } else if (currentStep == 1) {
      validateList = ['newPhone', 'newPhoneCode']
      this.props.form.validateFields(validateList, (errors, values) => {
        if (!!errors) {
          return;
        }
        this.toSubmit(values)
      })
    } else {
      this.handelCancle();
    }
  }

  // 提交数据到后台
  toSubmit = (values) => {
    this.setState({
      _loading: true
    })
    api.ajax("put", "@/sso/loginControl/phoneRepreatBind", {
      ...this.params,
      ...values,
      uuids: this.props.accountInfo.epscUuids,
      userUuids: this.props.accountInfo.uuids
    }).then(r => {
      if (!this._isMounted) { return }
      this.setState({
        _loading: false,
        currentStep: 2,
      })
    }).catch(r => {
      Util.alert(r.msg, { type: "error" })
      this.setState({
        _loading: false
      })
      this.props.form.resetFields(['captchaCode'])
      this._clientId = Util.randomString(64)
      this.getImg();
    })
  }

  handelCancle = () => {
    this.props.form.resetFields();
    this.props.onOk(this._modalName,false,this.state.result);
    this.setState({
      currentStep: 0,
      result: false
    })
  }

  smsCodeBtn = (key, codeLoading) => {
    let codeTime = codeLoading == 'codeLoading' ? 'codeTime' : 'codeTime2';
    if (this.state[codeTime] >= 0) {
      return <span className={less.code_btn}>验证码({this.state[codeTime]})</span>
    } else {
      return <a href="javascript:void(0)" className={less.code_btn} onClick={() => { this.validateImg(key, codeLoading) }}>获取验证码</a>
    }
  }

  //渲染步骤
  renderSteps = (currentStep) => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }

    switch (currentStep) {
      case 0:
        return [<Row gutter={16} key={1}>
          <Col span="24">
            <FormItem label={'原手机号'}
              {...formItemLayout}
            >
              <Input
                placeholder={'请输入原手机号'}
                disabled
                {...getFieldProps('oldPhone', {
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={2}>
          <Col span="24">
            <FormItem label={'图形验证'}
              required
              {...formItemLayout}
            >
              <Row>
                <Col span={16}>
                  <FormItem>
                    <Input
                      maxLength={4}
                      placeholder={'请输入图形验证码'}
                      {...getFieldProps('captchaCode', {
                        rules: [
                          { required: true, message: '请输入图形验证码' },
                        ],
                      })}
                    />
                  </FormItem>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <img src="" id="img" style={{ height: '32px' }} onClick={this.getImg} />
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={3}>
          <Col span="24">
            <FormItem label={'验证码'}
              required
              {...formItemLayout}
            >
              <Row>
                <Col span={24} className={less.code_box}>
                  <FormItem>
                    <Input
                      maxLength={6}
                      placeholder={'请输入原手机验证码'}
                      {...getFieldProps('oldPhoneCode', {
                        rules: [
                          { required: true, message: '请输入原手机验证码' },
                        ],
                      })}
                    />
                  </FormItem>
                  {this.smsCodeBtn('oldPhone', 'codeLoading')}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        ]
        break;
      case 1:
        return [
          <Row gutter={16} key={4}>
            <Col span="24">
              <FormItem label={'新手机号'}
                {...formItemLayout}
              >
                <Input
                  maxLength={11}
                  placeholder={'请输入新手机号'}
                  {...getFieldProps('newPhone', {
                    rules: [
                      { required: true, message: '请输入新手机号' },
                      { pattern: /^[1][0-9]{10}$/, message: '请输入正确的手机号' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={2}>
            <Col span="24">
              <FormItem label={'图形验证'}
                required
                {...formItemLayout}
              >
                <Row>
                  <Col span={16}>
                    <FormItem>
                      <Input
                        maxLength={4}
                        placeholder={'请输入图形验证码'}
                        {...getFieldProps('captchaCode', {
                          rules: [
                            { required: true, message: '请输入图形验证码' },
                          ],
                        })}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <img src="" id="img" style={{ height: '32px' }} onClick={this.getImg} />
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={6}>
            <Col span="24">
              <FormItem label={'验证码'}
                required
                {...formItemLayout}
              >
                <Row>
                  <Col span={24} className={less.code_box}>
                    <FormItem>
                      <Input
                        maxLength={6}
                        placeholder={'请输入新手机验证码'}
                        {...getFieldProps('newPhoneCode', {
                          rules: [
                            { required: true, message: '请输入新手机验证码' },
                          ],
                        })}
                      />
                    </FormItem>
                    {this.smsCodeBtn('newPhone', 'codeLoading2')}
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
        ]
        break;
      case 2:
        if (this.state.result == true) {
          return (
            <div className={less.result_box}>
              <div>
                <Icon type="check-circle" className={[less.icon, less.success].join(' ')} />
              </div>
              <h3 className={less.title}>修改成功</h3>
            </div>
          )
        }
        return (
          <div className={less.result_box}>
            <div>
              <Icon type="cross-circle" className={[less.icon, less.error].join(' ')} />
            </div>
            <h3 className={less.title}>修改失败</h3>
          </div>
        )
        break;

      default:
        return null
        break;
    }
  }

  renderSubmitBtnText = (currentStep) => {
    // okText
    switch (currentStep) {
      case 0:
        return '下一步'
        break;
      case 1:
        return '下一步'
        break;

      default:
        return '完成'
        break;
    }
  }

  render() {


    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handelSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.state._loading}
        okText={this.renderSubmitBtnText(this.state.currentStep)}
      >
        <Form horizontal>
          <div style={{ padding: '0 20px' }}>
            <Steps current={this.state.currentStep}>
              <Step title="验证当前手机" />
              <Step title="绑定新手机" />
              <Step title="完成验证" />
            </Steps>
            <div className="mt20">
              {this.renderSteps(this.state.currentStep)}
            </div>
          </div>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)