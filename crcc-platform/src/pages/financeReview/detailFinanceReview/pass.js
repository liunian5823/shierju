import React, { Component } from 'react';
import { Modal, Spin, Form, Icon, Popover, Input, message, Upload, Button } from 'antd';
const FormItem = Form.Item;
import SystemConfig from '../../../utils/config/systemConfig';
import { connect } from 'react-redux';
import less from './index.less';
class pass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileName: '',
      filePath: '',
      //发送验证码按钮状态
      phoneStatus: false,
      //验证码倒计时
      countDown: 60,
      upLoadStatus: false
    }
  }
  handleCancel = () => {
    this.props.closeModal();
  }
  //处理字符串过长
  makeStrLength = (str) => {
    let newStr = '';

    newStr = str.slice(0, 15) + '...' + str.slice(str.length - 15);

    return newStr;
  }
  //获取手机验证码
  sendMobileCode() {
    this.setState({
      phoneStatus: true
    }, () => {
      let tempNum = 59;
      this.phoneTimer = setInterval(() => {
        if (tempNum <= 0) {
          this.setState({
            phoneStatus: false
          });
          clearInterval(this.phoneTimer);

        }
        this.setState({
          countDown: tempNum
        })
        tempNum -= 1
      }, 1000);
    })
    axios.get("@/contend/phone/msg/sendCodes", {
      params: { phone: this.props.userInfo.phone }
    }).then(r => {
      if (r.code == 200) {
        message.success('发送成功')
      }
    }).catch(err => {
      message.error(err.msg)
    });

  }
  //弹框点击确定调用
  handleConfirm() {

    this.props.form.validateFields((err, values) => {
      if (err) return;
      axios.get('@/contend/phone/msg/provingPhoneMsg', {
        params: {
          phone: this.props.userInfo.phone,
          code: values.code
        }
      }).then((res) => {
        if (res.data === true) {
          this.setState({
            loading: true
          })
          let options = {
            uuids: this.props.curData.uuids,
            reason: values.reason,
            fileName: this.state.fileName,
            filePath: this.state.filePath
          }
 
          axios.post('@/platform/contend/stop', options).then((res) => {
            this.setState({ loading: false })
            if (res.code == 200) {
              message.success('请求成功');
              this.props.closeModal();
              this.props.getAllDataList({rows:10,page:1});
            } else {
              message.error(res.msg)
            }
          }).catch((err) => {
            this.setState({
              loading: false
            })
            message.error(err.msg)
          })

        } else {
          message.error(res.msg)
        }
      }).catch((err) => {
        message.error(err.msg)
      })

    })
  }
  render() {
    const { getFieldProps } = this.props.form;
    const phoneStr = this.props.userInfo.phone ? this.props.userInfo.phone.slice(0, 4) + 'XXXX' + this.props.userInfo.phone.slice(this.props.userInfo.phone.length - 4) : '000XXXX0000';
    const reasonData = this.props.curData || {};
    const uploadProps = {
      name: 'file',
      action: SystemConfig.systemConfigPath.axiosUrl('/common/upload/file?maxSize=5'),
      accept: 'image/jpeg,image/jpg,image/png,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf',
      multiple: true,
      onChange:(info) => {
        if (info.fileList.length <= 0) {
          this.setState({
            upLoadStatus: false
          })
        }
        if (!info.file.response) {
          return;
        }
        if (info.file.status == 'done') {
          message.success('上传成功');
          this.setState({
            fileName: info.file.name,
            filePath: info.file.response.data,
            upLoadStatus: true
          })
        } else {
          message.success(info.file.response && info.file.response.msg);
        }
      },
    };
    return (
      <div>
        <Modal
          title={<span className={less.tip_title}><Icon type="exclamation-circle" />终止原因</span>}
          visible={this.props.stopVisible}
          onOk={this.handleConfirm.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width='600'
        >
          <div className={less.reason_modal_container}>
            <Spin spinning={false}>
              <Form>
                <FormItem label={<span style={{ width: '70px' }}>审批状态</span>} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  <p style={{ width: '450px' }}>{reasonData.sn}</p>
                </FormItem>
                <FormItem label={<span style={{ width: '70px' }}>竞价单名称</span>} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  {
                    reasonData.name && reasonData.name.length > 30 ? (<Popover content={reasonData.name}>
                      <p style={{ width: '450px' }}>{this.makeStrLength(reasonData.name)}</p>
                    </Popover>) : <p style={{ width: '450px' }}>{reasonData.name}</p>
                  }
                </FormItem>
                <div style={{ borderTop: '1px solid #d9d9d9', marginBottom: '8px' }}></div>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>终止原因</span>} >
                  <Input type='textarea' style={{ width: '420px', height: '126px', resize: 'none' }} maxLength="200"
                    {...getFieldProps('reason', {
                      rules: [
                        { required: true, message: '请输入终止原因' },
                      ],
                    })}
                    placeholder="请输入处理意见" autosize={{ minRows: 5, maxRows: 5 }} />
                  <div className={less.count_tip}>
                    <span>{this.props.form.getFieldValue('reason') ? this.props.form.getFieldValue('reason').length : 0}/200</span>
                  </div>
                </FormItem>
                <FormItem className={less.upload_item} label={<span style={{ width: '70px' }}>上传附件</span>} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                  <Upload {...uploadProps}
                  >
                    <Button type="ghost" disabled={this.state.upLoadStatus}>
                      <Icon type="upload" /> 点击上传
                  </Button>
                  </Upload>
                  <span className={less.ant_form_text}>请上传格式为doc、xlsx、pdf、jpg、png且体积小于5MB的文件</span>

                </FormItem>
                <FormItem className={less.mobile_code} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>手机验证码</span>} >
                  <Input
                    style={{ width: '319px' }}
                    {...getFieldProps('code', {
                      rules: [
                        { required: true, message: '请输入手机验证码' },
                        // { validator: this.provingPhoneMsg, validateTrigger: 'onBlur' },
                      ],
                    })}
                    placeholder={phoneStr} />
                  <Button type="primary" size="large" onClick={this.sendMobileCode.bind(this)} disabled={this.state.phoneStatus}>
                    {
                      !this.state.phoneStatus ? '获取验证码' : this.state.countDown
                    }
                  </Button>
                </FormItem>
              </Form>

            </Spin>

          </div>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  }
}
Form.create({})(pass)
export default connect(mapStateToProps)(Form.create({})(pass));