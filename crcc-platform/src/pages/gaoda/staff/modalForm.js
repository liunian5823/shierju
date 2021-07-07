import React from 'react';
// import less from './index.less';
import api from '@/framework/axios';
import { Modal, Form, Row, Col, Input, Select, DatePicker } from 'antd';

class ModalForm extends React.Component {
  state = {
    deptOptions: [],
    roleOptions: [],
  }

  visible = false

  componentDidUpdate(){
    if(this.visible != this.props.visible) {
      this.visible = this.props.visible;
      if (!this.props.visible) return;
      // 重置表单验证
      this.props.form.resetFields();
      this.params = {
        ...this.props.data,
      }
      this.fillDefaultValue()

    }
  }
  componentWillMount() {
    this.getDefaultData()
  }

  //from配置
  formConfig = () => {
    const { deptOptions, roleOptions } = this.state;
    return [
      {
        label: '所属部门',
        prop: 'dept_id',
        type: 'SELECT',
        placeholder: '请选择所属部门',
        rules: [
          { required: true, message: '请选择所属部门' },
        ],
        options: deptOptions
      },
      {
        label: '角色',
        prop: 'role_id',
        type: 'SELECT',
        placeholder: '请选择角色',
        rules: [
          { required: true, message: '请选择角色' },
        ],
        options: roleOptions
      },
      {
        label: '员工类别',
        prop: 'staff_type',
        type: 'SELECT',
        placeholder: '请选择员工类别',
        // rules: [
        //   { required: true, message: '请选择员工类别' },
        // ],
        options: [
          {
            label: '正式员工',
            value: '正式员工'
          },
          {
            label: '实习生',
            value: '实习生'
          }
        ]
      },
      {
        label: '员工名称',
        prop: 'staff_name',
        type: 'INPUT',
        placeholder: '请输入员工名称',
        rules: [
          { required: true, message: '请输入员工名称' },
          { max: 20, message: '请输入少于20个字符' },
        ],
      },
      {
        label: '助记码',
        prop: 'staff_zjm',
        type: 'INPUT',
        placeholder: '请输入助记码',
        // rules: [
        //   { required: true, message: '请输入助记码' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '工种名称',
        prop: 'work_type',
        type: 'INPUT',
        placeholder: '请输入工种名称',
        // rules: [
        //   { required: true, message: '请输入工种名称' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '民族',
        prop: 'nation',
        type: 'INPUT',
        placeholder: '请输入民族',
        // rules: [
        //   { required: true, message: '请输入民族' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '籍贯',
        prop: 'native_place',
        type: 'INPUT',
        placeholder: '请输入籍贯',
        // rules: [
        //   { required: true, message: '请输入籍贯' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '手机号',
        prop: 'phone',
        type: 'INPUT',
        placeholder: '请输入手机号',
        // rules: [
        //   { required: true, message: '请输入手机号' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '性别',
        prop: 'sex',
        type: 'SELECT',
        placeholder: '请选择性别',
        // rules: [
        //   { required: true, message: '请选择性别' },
        // ],
        options: [
          {
            label: '男',
            value: '男'
          },
          {
            label: '女',
            value: '女'
          }
        ]
      },
      {
        label: '身份证号码',
        prop: 'id_carid',
        type: 'INPUT',
        placeholder: '请输入身份证号码',
        // rules: [
        //   { required: true, message: '请输入身份证号码' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '出生日期',
        prop: 'birth_date',
        type: 'DATE',
        placeholder: '请输入出生日期',
        // rules: [
        //   { required: true, message: '请输入出生日期' }
        // ],
      },
      {
        label: '邮箱',
        prop: 'email',
        type: 'INPUT',
        placeholder: '请输入邮箱',
        // rules: [
        //   { required: true, message: '请输入邮箱' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '学历',
        prop: 'education',
        type: 'INPUT',
        placeholder: '请输入学历',
        // rules: [
        //   { required: true, message: '请输入学历' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
      {
        label: '地址',
        prop: 'addr',
        type: 'INPUT',
        placeholder: '请输入地址',
        // rules: [
        //   { required: true, message: '请输入地址' },
        //   { max: 20, message: '请输入少于20个字符' },
        // ],
      },
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
  //获取固定数据
  getDefaultData = () => {
    this.getDepartmentOptions();
    this.getRoleOptions();
  }
  // 部门信息
  getDepartmentOptions = () => {
    api.ajax('get', '@/inquiry/gddept/get')
    .then(res => {
      this.setState({
        deptOptions: (res.data || []).map(v => {
          return {value: (v.id).toString(), label: v.deptName}
        })
      })
    })
    .catch(res => {});
  }
  // 角色信息
  getRoleOptions = () => {
    api.ajax('get', '@/inquiry/gdrole/get')
    .then(res => {
      this.setState({
        roleOptions: (res.data || []).map(v => {
          return {value: (v.id).toString(), label: v.roleName}
        })
      })
    })
    .catch(res => {});
  }

  render(){
    const { getFieldProps } = this.props.form;
    const formConfig = this.formConfig();
    
    return (
      <Modal
        width={800}
        maskClosable={false}
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.props.loading}>
        <Form horizontal>
          <Row type="flex" gutter={16}>
            {
              formConfig.map((row, index) => {
                return (
                  <Col span="12" key={index}>
                    <Form.Item label={row.label}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}>
                      {
                        row.type === 'INPUT' 
                        ? <Input
                          placeholder={row.placeholder}
                          {...getFieldProps(row.prop, {
                            rules: row.rules || []
                          })}
                        />  : row.type === 'SELECT' 
                        ? <Select
                          placeholder={row.placeholder}
                          {...getFieldProps(row.prop, {
                            rules: row.rules || []
                          })}>
                          {
                            row.options.map(option => {
                              return <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                            })
                          }
                        </Select> : row.type === 'DATE'
                        ? <DatePicker
                          showTime
                          format={ row.format || "yyyy-MM-dd" }
                          style={{ width: '100%' }}
                          {...getFieldProps(row.prop, {
                            rules: row.rules || []
                          })}
                        /> : null
                      }
                      
                    </Form.Item>
                  </Col>
                )
              })
            }
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({})(ModalForm)