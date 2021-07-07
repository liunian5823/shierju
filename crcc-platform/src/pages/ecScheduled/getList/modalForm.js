import { Form, Button, Select, Modal, Upload, Icon, Switch, Radio } from 'antd';
import Util from '@/utils/util';
import Input from '@/components/baseInput';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class ModalFormComponent extends React.Component{
  state = {
    value: 'start'
  }
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
          case "RADIO":
            let RADIO = <FormItem {...this.formItemLayout} label="更改状态">
              {/*<RadioGroup {...getFieldProps(o.key,{
                    rules: [
                      {
                        required: true,
                        message: "请更改状态"
                      }
                    ],
              })}>
                <Radio value={'stop'}>关闭</Radio>
                <Radio value={'start'}>开启</Radio>
              </RadioGroup>*/}
              <RadioGroup
                {...getFieldProps(o.key,
                  {
                    initialValue: formList[0].value,
                    rules: [
                      {
                        required: true,
                        message: "请更改状态"
                      }
                    ],
                    onChange:()=>{
                      this.props.form.resetFields(['remark'])
                    }
                  })}>
                <Radio key="a" value={'stop'}>关闭</Radio>
                <Radio key="b" value={'start'}>开启</Radio>
              </RadioGroup>
            </FormItem>
            formItemList.push(RADIO);
            break;
          case "SWITCH":
            let SWITCH = <FormItem key={i}
              label={o.label}
              {...this.formItemLayout}>
              <Switch {...getFieldProps(o.key)} checkedChildren="是" unCheckedChildren="否" /> 
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