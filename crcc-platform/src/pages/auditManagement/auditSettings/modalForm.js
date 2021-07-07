import { Form, Button, Select, Modal, Upload, Icon, Switch } from 'antd';
import Util from '@/utils/util';
import Input from '@/components/baseInput';

const FormItem = Form.Item;

class ModalFormComponent extends React.Component{
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  }
  _isClear = false;
  componentDidUpdate(){
    if(this._isClear!=this.props.visible){
      this._isClear = this.props.visible;
      this.props.form.resetFields();
    }
  }
  initFormItem = () => {
    const { getFieldProps } = this.props.form;
    let formList = this.props.formList;
    let formItemList = [];
    if(formList && formList.length>0){
      formList.forEach((o,i)=>{
        switch (o.el){
          case "INPUT":
            let INPUT = <FormItem key={i}
              label={o.label}
              {...this.formItemLayout}>
              <Input maxLength='30'
                type={o.type}
                placeholder={o.placeholder}
                {...getFieldProps(o.key,
                  {
                    rules: [
                      {
                        required: true,
                        message: o.placeholder
                      }
                    ],
                    initialValue: o.value
                  })}/>
            </FormItem>
            formItemList.push(INPUT);
            break;
          case "SELECT":
            let SELECT = <FormItem key={i}
              label={o.label}
              {...this.formItemLayout}>
              <Select
                placeholder={o.placeholder}
                {...getFieldProps(o.key,
                {
                  rules: [
                    {
                      required: true,
                      message: o.placeholder
                    }
                  ]
                })}>
                {Util.getOptionList(o.list)}  
              </Select>
            </FormItem>
            formItemList.push(SELECT);
            break;
          case "UPLOAD":
            let UPLOAD = <FormItem key={i}
              label={o.label}
              {...this.formItemLayout}>
              <Upload {...o.props}>
                <Button type="ghost">
                  <Icon type="upload"/>点击上传
                </Button>
              </Upload>
            </FormItem>
            formItemList.push(UPLOAD);
            break;
          case "SWITCH":
            let SWITCH = <FormItem key={i}
              label={o.label}
              {...this.formItemLayout}>
              <Switch {...getFieldProps(o.key)} checkedChildren="开" unCheckedChildren="关" /> 
            </FormItem>
            formItemList.push(SWITCH);
            break;
          default:
            let OTHER = <FormItem key={i}
              label={o.label}
              {...this.formItemLayout}>
              {o.value}
            </FormItem>
            formItemList.push(OTHER);
        }
      })
    }
    return formItemList;
  }
  handleOk = () => {

    this.props.form.validateFieldsAndScroll((errors,values)=>{
      if(!!errors){
        console.log('Errors in form!!!');
        return;
      }
      this.props.onOk(values);
    })
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  render(){
    return(
      <div>
        <Modal
          title={this.props.title}
          confirmLoading={this.props.confirmLoading}
          wrapClassName="vertical-center-modal"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <Form>
            {this.initFormItem()}
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(ModalFormComponent);