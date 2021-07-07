import { Modal, Form, Input, Row, Col, Button } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import less from './index.less'

const FormItem = Form.Item;

class ModalForm extends React.Component {
  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  _visible = false
  _modalName = 'ModalreEmailShow'

  state = {
    _loading: false,
    codeLoading: false,
    codeTime: -1,
  }

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillUpdate() {
    this._visible = this.props.visible
  }

  componentDidUpdate() {
    if (this._visible != this.props.visible) {
      this.props.form.resetFields();
      this.props.form.setFieldsValue({ "email": this.props.accountInfo.email })
    }
  }

  //发送短信验证码
  sendEmailCode = (key) => {
    this.props.form.validateFields([key], (errors, values) => {
      if (!!errors && !this.state.codeLoading) {
        this._getSmsCode = false;
        return;
      } else {
        this.setState({
          codeLoading: true
        })
      }
      if (this._getSmsCode) {
        return
      }
      this._getSmsCode = true;
      api.ajax('GET', '@/sso/loginControl/sendEmailCode', {
        email: values[key],
        uuids: this.props.accountInfo.uuids
      }).then(r => {
        this.setState({
          codeLoading: false
        })
        this._getSmsCode = false;
        this.props.form.setFieldsValue({ "smsCode": r.data })
        this.toTiming(true);
      }).catch(r => {
        this._getSmsCode = false;
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


  handelSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.setState({
        _loading: true
      })
      let mailBindStatus = this.props.accountInfo.mailBindStatus == 1 ? 2 : 1;
      api.ajax("POST", "@/sso/loginControl/handMailBind", {
        ...values,
        mailBindStatus,
        uuids: this.props.accountInfo.epscUuids,//用户安全中心uuids
        userUuids: this.props.accountInfo.uuids
      }).then(r => {
        if (!this._isMounted) { return }
        this.setState({
          _loading: false,
          codeTime: -1
        })
        Util.alert(r.msg, { type: "success" })
        this.props.onOk(this._modalName, false, true);
      }).catch(r => {
        Util.alert(r.msg, { type: "error" })
        this.setState({
          _loading: false
        })
      })
    })
  }

  handelCancle = () => {
    this.props.form.resetFields();
    this.props.onOk(this._modalName);
  }

  emailCodeBtn = (key) => {
    if (this.state.codeTime >= 0) {
      return <span className={less.code_btn}>验证码({this.state.codeTime})</span>
    } else {
      return <a href='javascript:void(0)' className={less.code_btn} onClick={() => { this.sendEmailCode(key) }}>获取验证码</a>
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handelSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.state._loading}
      >
        <Form horizontal>
          <Row gutter={16}>
            <Col span="22">
              <FormItem label={'绑定邮箱'}
                {...formItemLayout}
              >
                <Input
                  maxLength={50}
                  placeholder={'请输入绑定邮箱'}
                  disabled={this.props.accountInfo.mailBindStatus == 1}
                  {...getFieldProps('email', {
                    rules: [
                      { required: true, message: '请输入绑定邮箱' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="22">
              <FormItem label={'邮箱验证码'}
                required
                {...formItemLayout}
              >
                <Row>
                  <Col span={24} className={less.code_box}>
                    <FormItem>
                      <Input
                        maxLength={6}
                        placeholder={'请输入邮箱验证码'}
                        {...getFieldProps('emailCode', {
                          rules: [
                            { required: true, message: '请输入邮箱验证码' },
                          ],
                        })}
                      />
                    </FormItem>
                    {this.emailCodeBtn('email')}
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)