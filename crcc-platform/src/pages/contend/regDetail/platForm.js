import React, { Component } from 'react';
import { Card, Form, Upload, Icon, Radio, Input, Button, message } from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
import less from './platForm.less';
class platForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      filePath: '',
      loading: false,

    }
  }
  changePayOk = () => {
    const { validateFields } = this.props.form;
    let options = null;
    validateFields((err, values) => {
      if (err) return;
      options = {
        ...values,
        fileName:this.state.fileName,
        filePath:this.state.filePath
      }
    })
    return options;

  }
  componentDidMount() {
    // let that = this.props.that;
    this.props.changePlatFormMetheds(this.changePayOk);
    // that.regPlatform = that.regPlatform.bind(this, this.changePayOk)
  }

  render() {
    const { getFieldProps } = this.props.form;
    const uploadProps = {
      name: 'file',
      action: SystemConfig.systemConfigPath.axiosUrl('/common/upload/file?maxSize=5'),
      accept: 'image/jpeg,image/jpg,image/png,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf',
      multiple: true,

    };
    return (
      <div>
        <Card>
          <div className={less.under_line_container}>
            <Form>
              <FormItem label={<span>悔标处理结果</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <RadioGroup {...getFieldProps('platResult', {
                  rules: [
                    { required: true, message: '请选择悔标处理结果' },
                  ]
                })}>
                  <Radio value={1}>扣除保证金</Radio>
                  <Radio value={2}>不扣除保证金</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label={<span >悔标处理意见</span>} >
                <Input type='textarea' style={{ width: '750px', height: '126px', resize: 'none' }} maxLength="200"
                  {...getFieldProps('platReason', {
                    rules: [
                      { required: true, message: '请选择处理意见' },
                    ]
                  })}
                  placeholder="请输入处理意见" autosize={{ minRows: 5, maxRows: 5 }} />
                <div className={less.count_tip}>
                  <span>{this.props.form.getFieldValue('platReason') ? this.props.form.getFieldValue('platReason').length : 0}/200</span>
                </div>
              </FormItem>
              <FormItem label={<span>上传附件</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <Upload {...uploadProps} {...getFieldProps('file', {
                  onChange: (info) => {
                    if (!info.file.response) {
                      return;
                    }
                    if (info.file.status == 'done') {
                      this.setState({
                        fileName: info.file.name,
                        filePath: info.file.response.data
                      })
                    } else {
                      message.error(info.file.response && info.file.response.msg)
                    }
                  },
                })}
                >
                  <Button type="ghost" disabled={this.state.filePath}>
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload>
                <span className={less.ant_form_text}>请上传格式为doc、xlsx、pdf、jpg、png且体积小于5MB的文件</span>
              </FormItem>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label={<span >备注</span>} >
                <Input type='textarea' style={{ width: '750px', height: '126px', resize: 'none' }} maxLength="200"
                  {...getFieldProps('memo')}
                  placeholder="请输入..." autosize={{ minRows: 5, maxRows: 5 }} />
                <div className={less.count_tip}>
                  <span>{this.props.form.getFieldValue('memo') ? this.props.form.getFieldValue('memo').length : 0}/200</span>
                </div>
              </FormItem>
            </Form>

          </div>
        </Card>
      </div>
    );
  }
}

export default Form.create()(platForm);