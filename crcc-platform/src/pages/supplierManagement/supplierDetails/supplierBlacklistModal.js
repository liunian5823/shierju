import { Card, Form, Modal, Input } from 'antd';

const FormItem = Form.Item;

class supplierBlacklistModal extends React.Component{
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
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const { getFieldProps } = this.props.form;
    return(
      <Modal
      title='移除'
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}>
        <Card bordered={false}>
          <Form>
            <FormItem {...formItemLayout} label="公司名称">
              {this.props.obj.name}
            </FormItem>
            <FormItem {...formItemLayout} label="营业执照号">
              {this.props.obj.businessLicense}
            </FormItem>
            <FormItem {...formItemLayout} label="案情简述">
              <Input type="textarea" {...getFieldProps("remarks",{
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

export default Form.create()(supplierBlacklistModal);