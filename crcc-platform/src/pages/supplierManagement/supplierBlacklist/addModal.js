import { Card, Form, Select, Row, Col, Modal, Button, DatePicker } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import Input from '@/components/baseInput';
const FormItem = Form.Item;
const Option = Select.Option;

class addModal extends React.Component{
  _isUpdate = false

  state = {
    current: 0,
    codeTime: -1,
    codeLoading: false,
    region:[]//选择区域
  }


  componentWillMount(){
    this._isMounted = true;
    this.getRegionList();//获得区域
  }

  componentDidUpdate(){
    if(this._isUpdate != this.props.visible){
      this._isUpdate = this.props.visible;
      this.props.form.resetFields();
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  //发布年份数据
  yearPublishList = [
    {
      id: '2013',
      value: '2013'
    },
    {
      id: '2014',
      value: '2014'
    },
    {
      id: '2015',
      value: '2015'
    },
    {
      id: '2016',
      value: '2016'
    },
    {
      id: '2017',
      value: '2017'
    },
    {
      id: '2018',
      value: '2018'
    },
    {
      id: '2019',
      value: '2019'
    },
  ]

  // 获得区域数据
  getRegionList = () => {
    api.ajax("GET", "@/base/ecProvince/selectArea", {
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        region: r.data.rows,
      })
    }).catch(r => {
    })
  }

  smsCodeBtn = (codeLoading) => {
    let codeTime = codeLoading == 'codeLoading' ? 'codeTime' : 'codeTime2';
    if (this.state[codeTime] >= 0) {
      return <Button type="primary" disabled={true}>短信验证码({this.state[codeTime]})</Button>
    } else {
      return <Button type="primary" loading={this.state[codeLoading]} onClick={() => { this.sendSimCode(codeLoading) }}>发送短信验证码</Button>
    }
  }

  //发送短信验证码
  sendSimCode = (codeLoading = 'codeLoading') => {
    this.setState({
      [codeLoading]: true
    })

    api.ajax('GET', '@/supplier/ecBlacklistCompany/SendVerificationCode', {
      phone: this.props.userPhone,
      verificationCodeType: 1
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
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const { getFieldProps } = this.props.form;
    return(
      <Modal
      title={this.props.title}
      confirmLoading={this.props.confirmLoading}
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}>
        <Card bordered={false}>
          <Form>  
            <FormItem {...formItemLayout} label="企业名称">
              <Input type="text" maxLength='20' {...getFieldProps("companyName",{
                rules: [
                  {
                    required: true,
                    message: "请输入机构名称"
                  }
                ]
              })}
              placeholder="请输入与营业执照一致机构名称"></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="营业执照号">
              <Input type="text" maxLength='30' {...getFieldProps("businessLicenseNo",{
                rules: [
                  {
                    required: true,
                    message: "请输入营业执照号"
                  }
                ]
              })}
              placeholder="请输入营业执照号"></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="评级">
              <Select placeholder="请选择评级"  {...getFieldProps("rating",{
                rules: [
                  {
                    required: true,
                    message: "请选择评级"
                  }
                ]
              })}>
                <Option value="0">黑</Option>
                <Option value="1">灰</Option>
                <Option value="2">黄</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="来源">
              <Select placeholder="请选择来源" {...getFieldProps("souce",{
                rules: [
                  {
                    required: true,
                    message: "请选择来源"
                  }
                ]
              })}>
                <Option value="1">铁建商城</Option>
                <Option value="2">股份公司</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="上报单位">
              <Input type="text" maxLength='30' {...getFieldProps("reportingCompany",{
                rules: [
                  {
                    required: true,
                    message: "请输入上报单位"
                  }
                ]
              })}
              placeholder="请输入上报单位"></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="区域">
              <Select placeholder="请选择区域" {...getFieldProps("area", {
                rules: [
                  {
                    required: true,
                    message: "请选择区域"
                  }
                ]
              })}>
                {Util.getOptionList(this.state.region, 'areaName', 'areaName')}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="发布年份">
              <Select placeholder="请选择发布年份" {...getFieldProps("yearPublished", {
                rules: [
                  {
                    required: true,
                    message: "请选择发布年份"
                  }
                ]
              })}>
                {Util.getOptionList(this.yearPublishList)}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="案情简述">
              <Input type="textarea" maxLength='200' rows={5} {...getFieldProps("remarks",{
                rules: [
                  {
                    required: true,
                    message: "请输入案情简述"
                  }
                ]
              })}></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {this.props.userPhone}
            </FormItem>
            <FormItem {...formItemLayout} label="验证码">
              <Col span='12'>
                <FormItem>
                  <Input type='text'  maxLength='6'
                  {...getFieldProps('verificationCode',{
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
                  {this.smsCodeBtn('codeLoading')}
              </Col>
            </FormItem>
          </Form>
        </Card>
      </Modal>
    )
  }
}

export default Form.create()(addModal);