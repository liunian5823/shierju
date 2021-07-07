import React, { Component } from 'react';
import { Modal, Spin, Form, Icon, Popover, Input, message, Upload, Button,Radio } from 'antd';
const FormItem = Form.Item;
import api from '@/framework/axios';
import SystemConfig from '../../../utils/config/systemConfig';
import { connect } from 'react-redux';
import {getUrlByParam, getQueryString} from '@/utils/urlUtils';
import less from './index.less';

const RadioGroup = Radio.Group;
class reject extends Component {

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
      upLoadStatus: false,
      disabled:false
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
    axios.get("@/settlement/pay/sendCodes", {
      params: { phone: this.props.phone }
    }).then(r => {
      if (r.code == 200) {
        message.success('发送成功')
      }
    }).catch(err => {
      message.error(err.msg)
    });

  }
  //弹框点击确定调用
  handleConfirm=()=> {

   
    this.props.form.validateFields((err, values) => {
      
      if (err) return;
      let params = {...values}
      if(this.props.listFinanceHangHandleOrders.type == 3){
        this.props.listFinanceHangHandleOrders.type = 1
      }else if(this.props.listFinanceHangHandleOrders.type == 1){
        this.props.listFinanceHangHandleOrders.type =2
      }
      params.financeHangId = this.props.financeHang.financeId
      params.financeHangUuids= this.props.financeHang.uuids
      params.remark=values.reason
      // params.workOrdersId=this.props.listFinanceHangHandleOrders.workOrdersId
      params.workOrdersId=getQueryString("workOrdersId")
      params.settlementUuids = this.props.listFinanceHangHandleOrders.uuids
      params.approvalType=this.props.type
      params.type=this.props.listFinanceHangHandleOrders.type
      axios.get("@/contend/phone/msg/provingPhoneMsg", {
        params: { phone: this.props.phone, code: values.code }
      }).then(r=>{
        if (r.data == true){
          this.setState({
            loading: true
          },()=>{
            api.ajax('GET','@/settlement/pay/check', 
        {...params}
      ).then((res) => {
        if (res.code == 200) {
          this.setState({
            loading: true
          })
          message.success('驳回成功！')
          this.props.closeModal();
          this.props.history.push("/financialCenter/financeReview");

        } else{
          message.error('驳回失败')
        }
        
      }).catch((err) => {
        // message.error('驳回失败！')
      })
          })
        }else {
          message.error('验证码错误')
          this.setState({
            phoneStatus : false
          })
        }
      })
      

    })
  }

  // getInitialState=()=> {
  //   return {
  //     value: 1,
  //   };
  // }
  onChange=(e)=> {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  render() {
    const { getFieldProps } = this.props.form;
    const phoneStr = this.props.phone ? this.props.phone.slice(0, 3) + '***' + this.props.phone.slice(this.props.phone.length - 4) : '000***0000';
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
          title={<span className={less.tip_title}>挂账审批</span>}
          visible={this.props.stopVisible}
          onOk={this.handleConfirm.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width='600'
        >
          <div className={less.reason_modal_container}>
            <Spin spinning={false}>
              <Form>
                <FormItem label={<span style={{ width: '70px' }}>审批状态</span>} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  <p style={{ width: '450px' }}>驳回</p>
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>备注</span>} >
                  <Input type='textarea' style={{ width: '420px', height: '126px', resize: 'none' }} maxLength="200"
                    {...getFieldProps('reason', {
                      rules: [
                        { required: true, message: '请输入说明' },
                      ],
                    })}
                    placeholder="请输入说明" autosize={{ minRows: 5, maxRows: 5 }} />
                  <div className={less.count_tip}>
                    <span>{this.props.form.getFieldValue('reason') ? this.props.form.getFieldValue('reason').length : 0}/200</span>
                  </div>
                </FormItem>
                <FormItem label={<span style={{ width: '70px' }}>验证方式</span>} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                <RadioGroup onChange={this.onChange} value={this.state.value} {...getFieldProps('type', {
                      initialValue:2,
                      rules: [
                        { required: true, message: '请选择验证方式' },
                      ],
                    })}>
                    <Radio key="a" value={1} disabled={!this.state.disabled}>签章</Radio>
                    <Radio key="b" value={2} defaultChecked={true}>手机验证</Radio>
                </RadioGroup>
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
Form.create({})(reject)
export default connect(mapStateToProps)(Form.create({})(reject));