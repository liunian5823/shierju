import { Modal, Form, Input, Row, Col } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import PwdLevel from '@/components/pwdLevel';
import Util from '@/utils/util';
import Auth from '@/utils/auth';

const FormItem = Form.Item;

class ModalForm extends React.Component {
  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  _modalName = "ModalrePwdShow"
  _visible = false

  state = {
    _loading: false,

    pwdLevel1: '',
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
      this.setState({
        pwdLevel1: ''
      })
    }
  }

  outLogin = () => {
    // TO-DO 这里临时设置为清除后台登录状态成功后
    if (Auth.hasToken()) {
      api.ajax("POST", "@/sso/loginControl/loginOut", {
      }).then(r => {
        if (!this._isMounted) { return }
        Auth.removeToken();//设置cookie为登录状态
        Util.toLogin()
      }).catch(r => {
        Util.alert(r.msg, { type: "error" })
      })
    } else {
      Util.toLogin()
    }
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
    if (value && value !== getFieldValue('newPassword')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
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
      api.ajax("POST", "@/sso/loginControl/modifyPwd", {
        ...values,
        id: this.props.accountInfo.id,
        uuids: this.props.accountInfo.uuids
      }).then(r => {
        if (!this._isMounted) { return }
        this.setState({
          _loading: false
        })
        Util.alert(r.msg, { type: "success" })
        this.props.onOk(this._modalName, false, true);
        this.outLogin()
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
    this.setState({
      pwdLevel1: '',
    })
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
            <Col span={20}>
              <FormItem label={'旧密码'}
                {...formItemLayout}
              >
                <Input
                  type="password"
                  maxLength={32}
                  placeholder={'请输入密码'}
                  {...getFieldProps('password', {
                    rules: [
                      { required: true, message: '请输入密码' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <FormItem label={'新密码'}
                {...formItemLayout}
              >
                <Input
                  maxLength={32}
                  type="password"
                  placeholder={'请输入新密码'}
                  {...getFieldProps('newPassword', {
                    validate: [{
                      rules: [
                        { pattern: /^(?!^(\d+|[a-zA-Z]+|[_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+)$)^[\w_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]{8,32}$/, message: '密码中包含数字和大小写字母或特殊字符，8位～32位' },
                        { validator: this.checkPass },
                      ],
                      trigger: 'onBlur',
                    }, {
                      rules: [
                        { required: true, message: '请输入新密码' },
                      ],
                      trigger: 'onChange',
                    }],
                    onChange: (e) => {
                      this.setState({
                        pwdLevel1: e.target.value
                      })
                    }
                  })}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <PwdLevel value={this.state.pwdLevel1} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <FormItem label={'确认新密码'}
                {...formItemLayout}
              >
                <Input
                  maxLength={32}
                  type="password"
                  placeholder={'请输入确认新密码'}
                  {...getFieldProps('confirmPassword', {
                    validate: [{
                      rules: [
                        { pattern: /^(?!^(\d+|[a-zA-Z]+|[_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+)$)^[\w_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]{8,32}$/, message: '密码中包含数字和大小写字母或特殊字符，8位～32位' },
                        { validator: this.checkPass2 },
                      ],
                      trigger: 'onBlur',
                    }, {
                      rules: [
                        { required: true, message: '请输入新密码' },
                      ],
                      trigger: 'onChange',
                    }],
                    onChange: (e) => {
                      this.setState({
                        pwdLevel2: e.target.value
                      })
                    }
                  })
                  }
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)