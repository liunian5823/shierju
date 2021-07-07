import { Form, Button, Select, Modal, Input, Upload, Icon, Steps, Card, Row, Col } from 'antd';
import Util from '@/utils/util';

const FormItem = Form.Item;
const Step = Steps.Step;

class resetAdminModal extends React.Component{
  visible = false;
  state={
    current: 0,
    codeTime: -1,
    codeLoading: false,
    codeTime: -1,
    codeLoading: false,
  }

  smsCodeBtn = (key, codeLoading) => {
    let codeTime = codeLoading == 'codeLoading' ? 'codeTime' : 'codeTime2';
    if (this.state[codeTime] >= 0) {
      return <Button type="primary" disabled={true}>短信验证码({this.state[codeTime]})</Button>
    } else {
      return <Button type="primary" loading={this.state[codeLoading]} onClick={() => { this.sendSimCode(key, codeLoading) }}>发送短信验证码</Button>
    }
  }

  //发送短信验证码
  sendSimCode = (key, codeLoading = 'codeLoading') => {
    let type = codeLoading == "codeLoading" ? 6 : 5;
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
    }
    if (time >= 0) {
      this.setState({
        [codeTime]: --time
      })
      setTimeout(() => { this.toTiming(false, codeLoading) }, 1000);
    }
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
      wrapperCol: { span: 18 },
    };
    if(this.state.current==0){
      return[
        <Row gutter={16} key='1'>
          <Col span='22'>
            <FormItem
            label='手机号'
            {...formItemLayout}>
            <Input type='text'
              {...getFieldProps('phone',{
                rules: [
                  {
                    required: true,
                    message: '请输入当前管理员手机号'
                  }
                ]
              })}
              placeholder="请输入当前管理员手机号"/>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='2'>
          <Col span='22'>
            <FormItem
            label='验证码'
            {...formItemLayout}>
              <Col span='12'>
                <FormItem>
                  <Input type='text'
                  {...getFieldProps('code',{
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码'
                      }
                    ]
                  })}
                  placeholder='请输入验证码'/>
                </FormItem>
              </Col>
              <Col span='12' style={{textAlign: 'right'}}>
                {this.smsCodeBtn('phone','codeLoading')}
              </Col> 
            </FormItem>
          </Col>
        </Row> 
      ]
    }else if(this.state.current==1){
      return[
        <Row gutter={16} key='3'>
          <Col span='22'>
            <FormItem
            label='新管理员信息'
            {...formItemLayout}>
            <Input type='text'
              {...getFieldProps('adminInfo',{
                rules: [
                  {
                    required: true,
                    message: '请输入新管理员信息'
                  }
                ]
              })}
              placeholder='请输入新管理员信息'/>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='4'>
          <Col span='22'>
            <FormItem
            label='身份证号码'
            {...formItemLayout}>
            <Input type='text'
              {...getFieldProps('ID',{
                rules: [
                  {
                    required: true,
                    message: '请输入身份证号码'
                  }
                ]
              })}
              placeholder='请输入身份证号码'/>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='5'>
          <Col span='22'>
            <FormItem
            label='手机号'
            {...formItemLayout}>
            <Input type='text'
              {...getFieldProps('phone',{
                rules: [
                  {
                    required: true,
                    message: '请输入手机号'
                  }
                ]
              })}
              placeholder='请输入手机号'/>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='6'>
          <Col span='22'>
            <FormItem
              label='验证码'
              {...formItemLayout}>
                <Col span='12'>
                  <FormItem>
                    <Input type='text'
                    {...getFieldProps('code',{
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码'
                        }
                      ]
                    })}
                    placeholder='请输入验证码'/>
                  </FormItem>
                </Col>
                <Col span='12' style={{ textAlign: 'right' }}>
                  {this.smsCodeBtn('newPhone', 'codeLoading2')}
                </Col>
            </FormItem>
          </Col>
        </Row>,
        <FormItem key='7'
        label='电子邮箱'
        {...formItemLayout}>
        <Input type='text'
        maxLength={50}
          {...getFieldProps('email',{
            rules: [
              {
                required: true,
                message: '请输入邮箱'
              }
            ]
          })}
          placeholder='请输入邮箱'/>
        </FormItem>,  
        <FormItem key='8'
        label='通讯地址'
        {...formItemLayout}>
        <Input type='text'
          {...getFieldProps('address',{
            rules: [
              {
                required: true,
                message: '请输入通讯地址'
              }
            ]
          })}
          placeholder='请输入通讯地址'/>
        </FormItem>,  
        <FormItem key='9'
        label='备注'
        {...formItemLayout}>
        <Input type='text'
          {...getFieldProps('remarks',{
            rules: [
              {
                required: true,
                message: '请填写备注'
              }
            ]
          })}
          placeholder='请填写备注'/>
        </FormItem>
      ]
    }else{
      return[
        <div style={{textAlign: 'center'}}>
          <Icon key='10' type="check-circle" style={{color: 'rgb(82, 196, 26)', fontSize: '45px'}} />
          <p style={{fontSize: '20px',fontWeight: '500',color: 'rgba(0,0,0,0.85)','lineHeight': '32px'}}>操作完成</p>
        </div>
      ]
    }






    // let formList = this.props.formList;
    // let formItemList = [];
    // if(formList && formList.length>0){
    //   formList.forEach((o,i)=>{
    //     switch (o.el){
    //       case "INPUT":
    //         let INPUT = <FormItem key={i}
    //           label={o.label}
    //           {...formItemLayout}>
    //           <Input
    //             type={o.type}
    //             placeholder={o.placeholder}
    //             {...getFieldProps(o.key,
    //             {
    //               rules: [
    //                 {
    //                   required: true,
    //                   message: `请输入${o.placeholder}`
    //                 }
    //               ]
    //             })}/>
    //         </FormItem>
    //         formItemList.push(INPUT);
    //         break;
    //       case "SELECT":
    //         let SELECT = "";
    //         SELECT = <FormItem key={i}
    //           label={o.label}
    //           {...formItemLayout}>
    //           <Select
    //             placeholder={o.placeholder}
    //             {...getFieldProps(o.key,{
    //               rules: [
    //                 {
    //                   required: true,
    //                   message: `请输入${o.placeholder}`
    //                 }
    //               ],
    //               onChange: this.handleSelectChange
    //             })}>
    //             {Util.getOptionList(o.list)}  
    //           </Select>
    //         </FormItem>
    //         formItemList.push(SELECT);
    //         break;
    //       case "UPLOAD":
    //         let UPLOAD = <FormItem key={i}
    //           label={o.label}
    //           {...formItemLayout}>
    //           <Upload {...o.props}
    //             onChange={this.handleUploadChange}
    //             showUploadList={false}>
    //             <Button type="ghost">
    //               <Icon type="upload"/>点击上传
    //             </Button>
    //           </Upload>
    //         </FormItem>
    //         formItemList.push(UPLOAD);
    //         break;
    //       default:
    //         let OTHER = <FormItem key={i}
    //           label={o.label}
    //           {...formItemLayout}>
    //           {o.value}
    //         </FormItem>
    //         formItemList.push(OTHER);
    //     }
    //   })
    // }
    // return formItemList;
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
    let current = this.state.current;
    if(current == 2){
      current = 0;
    }else{
      current++;
    }
    this.setState({
      current
    })
    // this.props.form.validateFieldsAndScroll((errors,values)=>{
    //   if(!!errors){
    //     console.log('Errors in form!!!');
    //     return;
    //   }
    //   let url = "";
    //   if(!this.isEmptyObject(this.state.fileList)){
    //     url = this.state.fileList.response.url
    //   }
    //   this.props.onOk(url);
    // })
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  handleSelectChange = (value) => {
    this.props.initSelectUser(value);
  }

  render() {
    return(
      <Modal
      title="重置管理员"
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      onCancel={this.handleCancel}
      footer={[
        <Button type='primary' loading={this.state.loading} onClick={this.handleOk}>
          {this.state.current==0?'下一步':this.state.current==1?'确定':'完成'}
        </Button>
      ]}>
        <Card bordered={false}>
          <Steps current={this.state.current}>
            <Step title='验证当前管理员'/>
            <Step title='确定管理员'/>
            <Step title='操作完成'/>
          </Steps>
          <Card bordered={false}>
            <Form>
              {this.initFormItem()}
              {/* {this.getUploadList()} */}

            </Form>
          </Card>
        </Card>
      </Modal>
    )
  }
}

export default Form.create()(resetAdminModal);