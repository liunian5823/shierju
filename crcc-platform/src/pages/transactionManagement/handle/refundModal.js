import { Card, Form, Modal, Input, Row, Col, Button } from 'antd';
import Util from '@/utils/util';
import BaseDetails from '@/components/baseDetails';
import UploadList from '@/components/uploadList';

import less from './index.less';

const FormItem = Form.Item;

class refundModal extends React.Component {
  state = {
    loading: false,
    codeTime: -1,
    codeLoading: false,
  }
  visible = false
  componentDidUpdate() {
    if (this.visible != this.props.visible) {
      this.visible = this.props.visible;
      this.props.form.resetFields();
    }
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  smsCodeBtn = (key) => {
    if (this.state.codeTime >= 0) {
      return <Button type="primary" disabled={true}>验证码({this.state.codeTime})</Button>
    } else {
      return <Button type="primary" loading={this.state.codeLoading} onClick={() => { this.sendSimCode(key) }}>获取验证码</Button>
    }
  }
  //发送短信验证码
  sendSimCode = (key) => {
    // this.props.form.validateFields([key], (errors, values) => {
    //   if (!!errors && !this.state.codeLoading) {
    //     return;
    //   } else {
    //     this.setState({
    //       codeLoading: true
    //     })
    //   }
    this.setState({
      codeLoading: true
    })
    let phone = '1234566789';
    api.ajax('GET', '@/sso/loginControl/sendSmsCode', {
      phone
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
    // })
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
      setTimeout(() => { this.toTiming(false) }, 1000);
    }
  }
  //文件上传成功
  uploadSucFile = (rsp) => {
    this.setState({
      file: rsp
    })
  }

  handleOk = () => {
    this.props.onOk();
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    return (
      <Modal
        title='退款'
        width='850'
        wrapClassName="vertical-center-modal"
        visible={this.props.visible}
        confirmLoading={this.state.loading}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={8}>
              <Col span={24}>
                <span className={less.box}>采购单位</span>
              </Col>
              <Col span={24}>
                <span className={less.box}><span className={less.text}>123</span></span>
              </Col>
            </Col>
            <Col span={8}>
              <Col span={24}>
                <span className={less.box}>采购部门</span>
              </Col>
              <Col span={24}>
                <span className={less.box}><span className={less.text}>123</span></span>
              </Col>
            </Col>
            <Col span={8}>
              <Col span={24}>
                <span className={less.box}>退款金额</span>
              </Col>
              <Col span={24}>
                <span className={less.box}><span className={less.text}>123</span></span>
              </Col>
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={8}>
              <BaseDetails title="订单编号">
                123123123123
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="订单金额">
                123123123123
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <BaseDetails title="下单日期">
                123123123123
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="下单人">
                123123123123
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="联系电话">
                123123123123
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <BaseDetails title="来款账号">
                123123123123
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="来款账户名">
                123123123123
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="来款金额">
                123123123123
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Form>
          <FormItem
            label="上传附件"
            {...formItemLayout}>
            <UploadList uploadSucFile={this.uploadSucFile} />
          </FormItem>
          <FormItem
            label="退款附言"
            {...formItemLayout}>
            <Input type="textarea"
              rows={4}
              {...getFieldProps('refundRemak', {
                rules: [
                  {
                    required: true,
                    message: '请填写退款附言'
                  }
                ]
              })}>
            </Input>
          </FormItem>
          <FormItem
            label="备注"
            {...formItemLayout}>
            <Input type="textarea"
              rows={4}
              {...getFieldProps('remark', {
                rules: [
                  {
                    required: true,
                    message: '请填写备注'
                  }
                ]
              })}>
            </Input>
          </FormItem>
          <FormItem
            label="验证码"
            {...formItemLayout}>
            <Col span={12}>
              <FormItem>
                <Input type="text"
                  {...getFieldProps('code', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码'
                      }
                    ]
                  })}
                  placeholder="请输入验证码" />
              </FormItem>
            </Col>
            <Col span={4} offset={2}>
              {this.smsCodeBtn('code')}
            </Col>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(refundModal);