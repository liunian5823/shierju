import { Modal, Form, Input, Row, Col, Steps, Icon, Select, Upload, Button } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import less from './index.less'

const Step = Steps.Step;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ModalForm extends React.Component {
  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  _userInfo = null
  _visible = false
  _modalName = "ModalreAdminShow"
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
    result: false,

    confirmFilePath: "",
    fileList: []
  }

  componentWillMount() {
    this._isMounted = true;
    this._clientId = Util.randomString(64)
    // 每10分钟刷新一次
    this._clientTime = setInterval(() => {
      this._clientId = Util.randomString(64)
      this.getImg();
    }, 600000)
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
      //this.props.form.setFieldsValue({ "phone": this.props.accountInfo.phone });
      this.params = { ...this.params, companyId: this.props.accountInfo.companyId };
      this.getImg();
    }
  }

  // //获得图形验证码
  getImg = () => {
    let elmImg = document.getElementById('img');
    if(elmImg){
      elmImg.src = SystemConfig.configs.ecCaptchaUrl + '/sso/ecCaptchaController/ecCaptcha' + '?' + 'clientId=' + this._clientId + '&_=' + Math.random();
    }
  }

  //验证图片验证码
  validateImg = (key, codeLoading) => {
    this.props.form.validateFields([key, 'captchaCode'], (errors, values) => {
      if (!!errors) {
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
        this.sendSimCode(key, codeLoading)
      }).catch(r => {
        this._getSmsCode = false;
        Util.alert(r.msg, { type: 'error' })
        this.getImg();
      })
    })
  }

  //发送短信验证码
  sendSimCode = (key, codeLoading = 'codeLoading') => {
    let type = codeLoading == "codeLoading" ? 2 : 9;
    this.props.form.validateFields([key], (errors, values) => {
      if (!!errors && !this.state[codeLoading]) {
        return;
      } else {
        this.setState({
          [codeLoading]: true
        })
      }
      api.ajax('GET', '@/sso/loginControl/sendSmsCode', {
        phone: values[key],
        type
      }).then(r => {
        this._clientId = Util.randomString(64)
        this._getSmsCode = false;
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
      // 更换clientId
      this._clientId = Util.randomString(64)
    }
    if (time >= 0) {
      this.setState({
        [codeTime]: --time
      })
      setTimeout(() => { this.toTiming(false, codeLoading) }, 1000);
    }
  }

  //上传前禁止提交
  beforeUpload = (file) => {
    const isPdf = file.type === 'application/pdf';
    const isWord = file.type === 'application/msword';
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isPNG = file.type === 'image/png';
    const isJPEG = file.type === 'image/jpeg';
    const isJPG = file.type === 'image/jpg';
    if (!isPdf && !isWord && !isPNG && !isJPEG && !isJPG && !isDocx) {
      Util.alert('请上传png/jpg/word/pdf格式的文件', { type: "error" })
      return false;
    }
    if (file.size > (1048 * 1048 * 5)) {
      Util.alert('上传的文件不能大于5M，请压缩后上传', { type: "error" })
      return false;
    }

    // 澄清文件上传中禁止提交
    this.setState({
      _loading: true
    })
    return true;
  }

  //上传文件成功
  uploadProps = (info) => {
    let fileList = info.fileList;
    if (info.file.status === 'done') {
      let isSuccess = true;
      if (isSuccess) {
        fileList = fileList.slice(-1);
      } else {
        fileList = fileList.slice(0, fileList.length - 1);
      }
      this.setState({
        _loading: false
      })
    } else if (info.file.status === 'error') {
      Util.alert('上传失败', { type: "error" });
      this.setState({
        _loading: false
      })
    }
    this.setState({
      fileList: fileList
    })
    this.props.form.setFieldsValue({ confirmFilePath: fileList })
  }


  handelSubmit = () => {
    let currentStep = this.state.currentStep;
    let validateList = [];
    if (currentStep == 0) {
      validateList = ['phone', 'username']
      this.props.form.validateFields(validateList, (errors, values) => {
        if (!!errors) {
          return;
        }
        this.toOneSubmit(values);
      })
    } else if (currentStep == 1) {
      validateList = ['newUsername', 'gender', 'citizenCode', 'newPhone', 'newPhoneCode', 'email', 'address', 'confirmFilePath']
      this.props.form.validateFields(validateList, (errors, values) => {
        if (!!errors) {
          return;
        }
        // let newValues= JSON.parse(JSON.stringify(values).replace(/newUsername/g,"username"));
        this.toValidatePhone(values)
      })
    } else {
      this.handelCancle();
    }
  }

  // 第一步 验证旧管理员手机号码
  toOneSubmit = (values) => {
    let currentStep = this.state.currentStep;
    this.setState({
      _loading: true
    })
    api.ajax('GET', '@/sso/loginControl/validateUsername', {
      ...this.params,
      type: 2,
      ...values,
    }).then(r => {
      this.setState({
        _loading: false,
        currentStep: ++currentStep
      })
      this.props.form.resetFields(['captchaCode'])
      this.getImg();
    }).catch(r => {
      this.setState({
        _loading: false
      })
      Util.alert(r.msg, { type: "error" });
      this.props.form.resetFields(['captchaCode', 'verifyCode'])
      this.getImg();
    })
  }

  toValidatePhone = (values) => {
    this.setState({
      _loading: true
    })
    api.ajax("GET", "@/sso/ecUser/checkAdminPhoneAndExist", {
      phone: values.newPhone,
      ...this.params,
    }).then(r => {
      if (!this._isMounted) { return }
      if (r.msg) {
        let _this = this;
        confirm({
          title: r.msg,
          onOk() {
            _this.toSubmit(values);
          },
          onCancel() {
            Util.alert('已取消操作');
          },
        });
      } else {
        this.toSubmit(values);
      }
    }).catch(r => {
      Util.alert(r.msg, { type: "error" })
      this.setState({
        _loading: false
      })
    })
  }

  // 提交数据到后台
  toSubmit = (values) => {
    let currentStep = this.state.currentStep;
	const username = values.newUsername;
    const confirmFilePath = (values.confirmFilePath && values.confirmFilePath.fileList && values.confirmFilePath.fileList.length > 0) ? values.confirmFilePath.fileList[0].response.data : '';//处理说明材料的提交数据
    api.ajax("POST", "!!/purchaser/adminInformationController/changeAdmin", {
      ...values,
      changeType:1,//1:公司管理员变更
      confirmFilePath:confirmFilePath,
      username:username,
      userType:3,
      ...this.params,
      companyId: this.props.companyId
    }).then(r => {
      if (!this._isMounted) { return }
      this.setState({
        _loading: false,
        currentStep: ++currentStep,
        result: true,
      })

      this.props.onOk(this._modalName, false, this.state.result);
    }).catch(r => {
      Util.alert(r.msg, { type: "error" })
      this.setState({
        _loading: false,
        result: false,
      })
    })
  }

  handelCancle = () => {
    this.props.form.resetFields();
    this.props.onOk(this._modalName, false, this.state.result);
    this.setState({
      currentStep: 0,
      result: false,
      confirmFilePath: ""
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
      wrapperCol: { span: 18 }
    }

    switch (currentStep) {
      case 0:
        return [<Row gutter={16} key={1}>
          <Col span="22">
            <FormItem label={'原手机号'}
              {...formItemLayout}
            >
              <Input
                maxLength={11}
                placeholder={'请输入原手机号'}
                {...getFieldProps('phone', {
                  rules: [
                    { required: true, message: '请输入原手机号' },
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>,

        <Row gutter={16} key={3}>
          <Col span="22">
            <FormItem label={'姓名'}
              required
              {...formItemLayout}
            >
              <Row>
                <Col span={24} className={less.code_box}>
                  <FormItem>
                    <Input
                      maxLength={30}
                      placeholder={'请输入姓名'}
                      {...getFieldProps('username', {
                        rules: [
                          { required: true, message: '请输入姓名' },
                        ],
                      })}
                    />
                  </FormItem>
                  {/*{this.smsCodeBtn('phone', 'codeLoading')}*/}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        ]
        break;
      case 1:
        return [
          <Row gutter={16} key={11}>
            <Col span="22">
              <FormItem label={'新管理员姓名'}
                {...formItemLayout}
              >
                <Input
                  maxLength={11}
                  placeholder={'请输入新管理员姓名'}
                  {...getFieldProps('newUsername', {
                    rules: [
                      { required: true, message: '请输入新管理员姓名' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={12}>
            <Col span="22">
              <FormItem label={'性别'}
                {...formItemLayout}
              >
                <Select
                  {...getFieldProps('gender', {
                    initialValue: "1",
                  })}
                >
                  <Option value="1">先生</Option>
                  <Option value="0">女士</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={13}>
            <Col span="22">
              <FormItem label={'身份证号码'}
                {...formItemLayout}
              >
                <Input
                  maxLength={18}
                  placeholder={'请输入身份证号码'}
                  {...getFieldProps('citizenCode', {
                    rules: [
                      { required: true, message: '请输入身份证号码' },
                      { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={14}>
            <Col span="22">
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
            <Col span="22">
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
          <Row gutter={16} key={15}>
            <Col span="22">
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
          </Row>,
          <Row gutter={16} key={16}>
            <Col span="22">
              <FormItem label={'电子邮箱'}
                {...formItemLayout}
              >
                <Input
                  maxLength={50}
                  placeholder={'请输入电子邮箱'}
                  {...getFieldProps('email', {
                    rules: [
                      { required: true, message: '请输入邮箱' },
                      { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入格式正确的邮箱' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={17}>
            <Col span="22">
              <FormItem label={'通讯地址'}
                {...formItemLayout}
              >
                <Input
                  maxLength={60}
                  placeholder={'请输入通讯地址'}
                  {...getFieldProps('address', {
                  })}
                />
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={18}>
            <Col span="22">
              <FormItem label={'备注'}
                {...formItemLayout}
              >
                <Input
                  maxLength={120}
                  placeholder={'请输入备注'}
                  {...getFieldProps('remarks', {
                  })}
                />
              </FormItem>
            </Col>
          </Row>,
          <Row gutter={16} key={19}>
            <Col span="22">
              <FormItem
                {...formItemLayout}
                label="授权文件"
              >
                <Upload
                  key={'up'}
                  {...ComponentDefine.upload_suntray.uploadProps}
                  fileList={this.state.fileList}
                  beforeUpload={this.beforeUpload}
                  {...getFieldProps('confirmFilePath', {
                    rules: [
                      { required: true, message: '请上传凭证' }
                    ],
                    onChange: (info) => {
                      this.uploadProps(info)
                    }
                  })}
                >
                  <Button type="ghost" key={1}> <Icon type="upload" />点击上传</Button>
                  <a href="/api/sso/ecManagerChangeRecord/downAuthorizationFile" target="_blank" style={{ marginLeft: 5 }}>下载模版</a>
                  <span style={{ marginLeft: 5 }} key={2}>支持扩展名：.png .jpg .doc .pdf</span>
                </Upload>
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
        maskClosable={false}
        okText={this.renderSubmitBtnText(this.state.currentStep)}
      >
        <Form horizontal>
          <div style={{ padding: '0 20px' }}>
            <Steps current={this.state.currentStep}>
              <Step title="验证当前管理员" />
              <Step title="确定新管理员" />
              <Step title="操作完成" />
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