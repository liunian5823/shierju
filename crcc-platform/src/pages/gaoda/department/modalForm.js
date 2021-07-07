import React from 'react';
// import less from './index.less';
import api from '@/framework/axios';
import { Modal, Form, Row, Col, Input } from 'antd';

class ModalForm extends React.Component {
  state = {}

  visible = false

  componentDidUpdate(){
    if(this.visible != this.props.visible) {
      this.visible = this.props.visible;
      if (!this.props.visible) return;
      // 重置数据
      this.props.form.resetFields();
      this.params = {
        ...this.props.data,
      }
      this.fillDefaultValue()

    }
  }
  // componentDidMount() {
  //   this.fillDefaultValue()
  // }
  //设置form默认数据
  fillDefaultValue = () => {
    this.props.form.setFieldsValue({
      ...this.props.data
    });
  }

  //确定
  handleSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onOk(fieldsValue);
      }
    });
    
  }
  //取消
  handelCancle = () => {
    this.props.onCancel();
  }
  render(){
    const { getFieldProps } = this.props.form;
    
    return (
      <Modal
        maskClosable={false}
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.props.loading}>
        <Form horizontal>
          <Row gutter={16}>
            <Col span="24" key={'dept_name'}>
              <Form.Item label={'部门名称'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}>
                <Input
                  placeholder={'请输入部门名称'}
                  {...getFieldProps('dept_name', {
                    rules: [
                      { required: true, message: '请输入部门名称' },
                      { max: 20, message: '请输入少于20个字符' },
                    ]
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24" key={'dept_remark'}>
              <Form.Item label={'备注'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}>
                <Input
                  placeholder={'请输入备注'}
                  {...getFieldProps('dept_remark', {})}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({})(ModalForm)