import { Modal, Form, Select, DatePicker, Row, Col } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Input from '@/components/baseInput'
import Util from '@/utils/util';

const FormItem = Form.Item;
const Option = Select.Option;

const confirm = Modal.confirm;
class ModalForm extends React.Component {


  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  state = {
    _loading: false
  }

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (this.visible != this.props.visible) {
      this.visible = this.props.visible;
      if (!this.props.visible) {
        // 重置数据
        this.props.form.resetFields();
        return
      }
      //父组件传递的数据发生变化

      //如果是修改加载数据
      if (this.props.uuids) {
        this.getData(this.props.uuids)
      }
    }
  }

  // 获得数据
  getData = (uuids) => {
    api.ajax('GET', '@/platform/ecUser/get', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      r.data.roleId = r.data.roleId ? r.data.roleId.toString() : '';
      r.data.roleId = r.data.roleId.indexOf(',') > 0 ? '' : r.data.roleId;//多个角色必须选择一个
      r.data.gender = (r.data.gender == 0 || r.data.gender == 1) ? r.data.gender.toString() : '1';
      this.props.form.setFieldsValue(r.data);
    }).catch(r => {
    })
  }

  //ok
  handelSubmit = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      if (this.props.uuids) {
        this.toSubmit(values);
        return
      }
      let _this = this;
      confirm({
        title: '确认保存吗？',
        content: '添加帐号后生成随机密码将以短信的形式发送至该员工的手机。',
        onOk() {
          _this.toSubmit(values);
        },
        onCancel() {
          Util.alert('已取消操作');
        },
      });
    })
  }

  toSubmit = (values) => {
    const uuids = this.props.uuids || '';
    this.setState({
      _loading: true
    })
    api.ajax('POST', '@/sso/ecUser/save', {
      ...values,
      uuids,
      userType: '5',
	  subPlatformId: 5
    }).then(r => {
      this.setState({
        _loading: false
      })
      Util.alert(r.msg, { type: 'success' })
      this.props.onOk(false, 'success');
    }).catch(r => {
      this.setState({
        _loading: false
      })
      Util.alert(r.msg, { type: 'error' })
    })
  }

  //cancle
  handelCancle = () => {
    this.props.form.resetFields();
    this.props.onOk(false);
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }

    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handelSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.state._loading}
      >
        <Form horizontal>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="姓名"
              >
                <Input
                  maxLength={20}
                  {...getFieldProps('username', {
                    rules: [
                      { required: true, message: '请输入姓名' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="性别"
              >
                <Select
                  placeholder="请输入角色"
                  {...getFieldProps('gender', {
                    initialValue: "1",
                    rules: [
                      { required: true, message: '请输入选择性别' },
                    ],
                  })}
                >
                  <Option key="1" value="1">男</Option>
                  <Option key="2" value="0">女</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="角色"
              >
                <Select
                  placeholder="请输入角色"
                  {...getFieldProps('roleId', {
                    rules: [
                      { required: true, message: '请输入选择角色' },
                    ],
                  })}
                >
                  {Util.getOptionList(this.props.roleList, 'id', 'name')}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="手机号"
              >
                <Input
                  maxLength={11}
                  {...getFieldProps('phone', {
                    rules: [
                      { required: true, message: '请输入手机号' },
                      { pattern: /^[0-9]{11}$/, message: '请输入11位手机号' },
                      { pattern: /^[1][0-9]{10}$/, message: '请输入正确的手机号' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="邮箱"
              >
                <Input
                  maxLength={50}
                  {...getFieldProps('email', {
                    rules: [
                      { required: true, message: '请输入邮箱' },
                      { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入格式正确的邮箱' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                <Input
                  type="textarea"
                  rows={4}
                  maxLength={200}
                  {...getFieldProps('remark', {
                  })}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)