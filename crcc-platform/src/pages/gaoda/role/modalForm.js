import React from 'react';
// import less from './index.less';
import api from '@/framework/axios';
import { Modal, Form, Row, Col, Input, Select } from 'antd';

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

  //from配置
  formConfig = () => {
    return [
      {
        label: '角色名称',
        prop: 'role_name',
        type: 'INPUT',
        placeholder: '请输入角色名称',
        rules: [
          { required: true, message: '请输入角色名称' },
          { max: 20, message: '请输入少于20个字符' },
        ]
      },
      {
        label: '备注',
        prop: 'role_remark',
        type: 'INPUT',
        placeholder: '请输入备注',
        rules: [],
      }
    ]
  }
  

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
    const formConfig = this.formConfig();
    
    return (
      <Modal
        maskClosable={false}
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.props.loading}>
        <Form horizontal>
          {
            formConfig.map((row, index) => {
              return (
                <Row gutter={16} key={index}>
                  <Col span="24">
                    <Form.Item label={row.label}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}>
                      {
                        row.type === 'INPUT' 
                        ? <Input
                          placeholder={row.placeholder}
                          {...getFieldProps(row.prop, {
                            rules: row.rules
                          })}
                        />  : row.type === 'SELECT' 
                        ? <Select
                          placeholder={row.placeholder}
                          {...getFieldProps(row.prop, {
                            rules: row.rules
                          })}>
                          {
                            row.options.map(option => {
                              return <Select.Option value={option.value}>{option.label}</Select.Option>
                            })
                          }
                        </Select> : null
                      }
                      
                    </Form.Item>
                  </Col>
                </Row>
              )
            })
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create({})(ModalForm)