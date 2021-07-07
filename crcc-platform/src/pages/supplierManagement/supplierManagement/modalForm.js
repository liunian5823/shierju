import { Form, Button, Select, Modal, Input, Upload, Icon } from 'antd';
import Util from '@/utils/util';

const FormItem = Form.Item;

class ModalFormComponent extends React.Component{
  visible = false;
  state={
    fileList: {}
  }

  componentDidUpdate(){
    if(this.visible != this.props.visible){
      this.visible = this.props.visible;
      this.props.form.resetFields();
      this.setState({
        fileList: {}
      })
    }
  }

  initFormItem = () => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let formList = this.props.formList;
    let formItemList = [];
    if(formList && formList.length>0){
      formList.forEach((o,i)=>{
        switch (o.el){
          case "INPUT":
            let INPUT = <FormItem key={i}
              label={o.label}
              {...formItemLayout}>
              <Input
                type={o.type}
                placeholder={o.placeholder}
                {...getFieldProps(o.key,
                {
                  rules: [
                    {
                      required: true,
                      message: `请输入${o.placeholder}`
                    }
                  ]
                })}/>
            </FormItem>
            formItemList.push(INPUT);
            break;
          case "SELECT":
            let SELECT = "";
            if(this.props.type=="resetAdmin"){
              SELECT = <FormItem key={i}
                label={o.label}
                {...formItemLayout}>
                <Select
                  placeholder={o.placeholder}
                  {...getFieldProps(o.key,{
                    rules: [
                      {
                        required: true,
                        message: `请输入${o.placeholder}`
                      }
                    ],
                    onChange: this.handleSelectChange
                  })}>
                  {Util.getOptionList(o.list)}  
                </Select>
              </FormItem>
            }else{
              SELECT = <FormItem key={i}
                label={o.label}
                {...formItemLayout}>
                <Select
                  placeholder={o.placeholder}
                  {...getFieldProps(o.key,
                  {
                    rules: [
                      {
                        required: true,
                        message: `请输入${o.placeholder}`
                      }
                    ]
                  })}>
                  {Util.getOptionList(o.list)}  
                </Select>
              </FormItem>
            }
            formItemList.push(SELECT);
            break;
          case "UPLOAD":
            let UPLOAD = <FormItem key={i}
              label={o.label}
              {...formItemLayout}>
              <Upload {...o.props}
                onChange={this.handleUploadChange}
                showUploadList={false}>
                <Button type="ghost">
                  <Icon type="upload"/>点击上传
                </Button>
              </Upload>
            </FormItem>
            formItemList.push(UPLOAD);
            break;
          default:
            let OTHER = <FormItem key={i}
              label={o.label}
              {...formItemLayout}>
              {o.value}
            </FormItem>
            formItemList.push(OTHER);
        }
      })
    }
    return formItemList;
  }
  isEmptyObject = (obj) => {
    for(let cur in this.state.fileList){
      return false;
    }
    return true;
  }
  
  getUploadList = () => {
    const formItemLayout = {
      wrapperCol: { span: 14, offset: 6 },
    };
    if(this.isEmptyObject(this.state.fileList)){
      return;
    }
    let FORMITEM = <FormItem
    {...formItemLayout}>
      <a href={this.state.fileList.response.url}>{this.state.fileList.name}</a>
    </FormItem>;
    return FORMITEM;
  }
  handleUploadChange = (info) => {
    console.log(info);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      Util.alert(`${info.file.name} 上传成功。`, {type: 'success'});
      this.setState({
        fileList: info.file
      })
    } else if (info.file.status === 'error') {
      Util.alert(`${info.file.name} 上传失败。`, {type: 'error'});
    }
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors,values)=>{
      if(!!errors){
        console.log('Errors in form!!!');
        return;
      }
      if(this.props.type=="dispose"){
        this.props.onOk(values);
      }else if(this.props.type=="resetInformation"){
        this.props.onOk();
      }else if(this.props.type=="resetAdmin"){
        let url = "";
        if(!this.isEmptyObject(this.state.fileList)){
          url = this.state.fileList.response.url
        }
        this.props.onOk(url);
      }
    })
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  handleResetPsw = () => {
    this.props.resetPsw();
  }
  handleSelectChange = (value) => {
    this.props.initSelectUser(value);
  }

  //供应商管理， 处理供应商信息底部按钮
  FooterBtn = () => {
    if(this.props.type=="dispose"){
      return [
        <Button type="primary" key={1} onClick={this.handleCancel}>取消</Button>,
        <Button type="primary" key={2} onClick={this.handleOk} loading={this.props.confirmLoading}>处理</Button>
      ]
    }else if(this.props.type=="resetInformation"){
      return [
        <Button type="primary" key={1} onClick={this.handleCancel}>返回</Button>,
        <Button type="primary" key={2} onClick={this.handleResetPsw}>重置密码</Button>,
        <Button type="primary" key={3} onClick={this.handleOk}>重置管理员</Button>
      ]
    }else if(this.props.type=="resetAdmin"){
      return [
        <Button type="primary" key={1} onClick={this.handleCancel}>取消</Button>,
        <Button type="primary" key={2} onClick={this.handleOk}>确认</Button>
      ]
    }

  }

  render() {
    return(
      <Modal
      title={this.props.title}
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      footer={this.FooterBtn()}
      onCancel={this.handleCancel}>
        <Form>
          {this.initFormItem()}
          {this.getUploadList()}
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalFormComponent);