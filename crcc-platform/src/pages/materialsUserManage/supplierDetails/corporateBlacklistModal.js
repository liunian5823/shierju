import { Card, Form, Row, Col, Modal, Input } from 'antd';

const FormItem = Form.Item;

class corporateBlacklistModal extends React.Component{
  _isUpdate = false;
  componentDidUpdate(){
    if(this._isUpdate != this.props.visible){
      this._isUpdate = this.props.visible;
      this.props.form.resetFields();
    }
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors,values)=>{
      if(!!errors){
        return;
      }
      this.props.onOk(values);
    })
  }
  handleCancel = () => {
    this.props.onCancel();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const { getFieldProps } = this.props.form;
    return(
      <Modal
      title="移除"
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}>
        <Card bordered={false}>
          <Form>
            <FormItem {...formItemLayout} label="姓名">
              {this.props.obj.legalPersonName}
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              {(this.props.obj.legalPersonId+'').substring(16,1)%2==0?'女':'男'}
            </FormItem>
            <FormItem {...formItemLayout} label="身份证号码">
              {this.props.obj.legalPersonId}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="案情简述">
              <Input type="textarea" {...getFieldProps("remark",{
                rules: [
                  {
                    required: true,
                    message: "请输入案情简述"
                  }
                ]
              })}></Input>
            </FormItem>
          </Form>
        </Card>
      </Modal>
    )
  }
}

export default Form.create()(corporateBlacklistModal);