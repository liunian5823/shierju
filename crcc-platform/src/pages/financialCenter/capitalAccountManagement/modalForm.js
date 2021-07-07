import { Card, Form, Row, Col, Modal, Input } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';

const FormItem = Form.Item;

class ModalFormComponent extends React.Component{
  state = {
    index: 1
  }
  _isMounted = false;
  componentWillMount(){
    this._isMounted = true;
  }
  componentWillUnmount(){
    this._isMounted = false;
  }
  _isUpdate = false;
  componentDidUpdate(){
    if(this._isUpdate != this.props.visible){
      this._isUpdate = this.props.visible;
      this.props.form.resetFields();
    }
  }
  handleOk = () => {
    if(this.state.index==1){
      this.props.form.validateFieldsAndScroll((errors,values)=>{
        if(!!errors){
          console.log('Errors in form!!!');
          return;
        }
        let _this = this;
        api.ajax('GET','@/supplier/ecCompanySupplier/queryCompanyByNameOrBusinessLicense',{
          ...values
        }).then(r=>{
          if(!_this._isMounted){
            return;
          }
          this.setState({
            index: 2,
            info: r.data
          })
        }).catch(r=>{
          Util.alert(r.msg,{type:'error'});
        })
      })
    }else{
      api.ajax('POST','@/microservice-finance/openAccount/openAccount',{
        companyUuids: this.state.info.uuids,
        bankCode: 'PA'
      }).then(r=>{
        if(!_this._isMounted){
          return;
        }
        this.setState({
          index: 1
        })
        Util.alert(r.msg,{type:'success'});
        this.props.onOk();
      }).catch(r=>{
        Util.alert(r.msg,{type:'error'});
      })      
    }
  }
  handleCancel = () => {
    this.setState({
      index: 1
    })
    this.props.onCancel();
  }

  initPageNode = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    const { getFieldProps } = this.props.form;
    if(this.state.index==1){
      return[
        <Row gutter={16} key='1'>
          <Col span={24}>
            <FormItem {...formItemLayout} label="公司名称">
              <Input type="text"
                {...getFieldProps('name',{
                  rules: [
                    {
                      required: true,
                      message: '请输入公司名称'
                    }
                  ]
                })}/>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='2'>
          <Col span={24}>
            <FormItem {...formItemLayout} label="营业执照号">
              <Input type="text"
                {...getFieldProps('businessLicense',{
                  rules: [
                    {
                      required: true,
                      message: '亲输入营业执照号'
                    }
                  ]
                })}/>
            </FormItem>
          </Col>
        </Row>
      ]
    }else{
      return[
        <Row gutter={16} key='3'>
          <Col span={24}>
            <FormItem {...formItemLayout} label="公司名称">
              {this.state.info.name}
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='4'>
          <Col span={24}>
            <FormItem {...formItemLayout} label="营业执照号">
              {this.state.info.businessLicense}
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='5'>
          <Col span={24}>
            <FormItem {...formItemLayout} label="法人姓名">
              {this.state.info.legalPersonName}
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key='6'>
          <Col span={24}>
            <FormItem {...formItemLayout} label="法人身份证号码">
              {this.state.info.legalPersonId}
            </FormItem>
          </Col>
        </Row>
      ]
    }
  }

  render() {
    return(
      <Modal
      title='开通账户'
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      okText={this.state.index==1?'查询':'开通账户'}>
        <Card bordered={false}>
          <Form>
            {this.initPageNode(this.state.index)}
          </Form>
        </Card>
      </Modal>
    )
  }
}

export default Form.create()(ModalFormComponent);