import { Card, Row, Col, Form, Input, Select, Radio, Button,Modal } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util';
import less from './index.less'

const confirm = Modal.confirm;

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Edit extends React.Component {

  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行

  state = {
    roleList: []
  }

  componentWillMount() {
    this._isMounted = true;
    if (this.props.match.params.uuids) {
      this.getData(this.props.match.params.uuids);
    }
    this.getBaseData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //获得角色信息
  getBaseData = () => {
    api.ajax('GET', '@/sso/ecRole/page', {
      type: "5"
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        roleList: r.data.rows
      })
    }).catch(r => {

    })
  }

  getData = (uuids) => {
    api.ajax('GET', '@/platform/ecUser/get', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      r.data.roleId = r.data.roleId.toString();
      this.props.form.setFieldsValue(r.data);
    }).catch(r => {

    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      if (this.props.match.params.uuids) {
        this.toSubmit(values);
        return
      }
      let _this = this;
      confirm({
        title: '确定新增该用户？',
        content: '用户密码将以短信形式发送到该用户手机。',
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
    const uuids = this.props.match.params.uuids || '';
    api.ajax('POST', '@/sso/ecUser/save', {
      ...values,
      uuids,
      userType: '5',
	  subPlatformId: 5
    }).then(r => {
      Util.alert(r.msg, { type: 'success' })
      this.props.history.goBack();
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' })
    })
  }

  handleBack = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }



  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }

    return (
      <Card bordered={false}>
        <Row>
          <Col span={16} offset={4}>
            <Form horizontal>

              <FormItem
                {...formItemLayout}
                label="姓名"
              >
                <Input

                  {...getFieldProps('username', {
                    rules: [
                      { required: true, message: '请输入姓名' },
                      { max: 6, message: '请输入少于6个字' },
                    ],
                  })}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="性别"
              >
                <RadioGroup
                  {...getFieldProps('gender', {
                    initialValue: 1,
                  })}
                >
                  <Radio key="1" value={1}>男</Radio>
                  <Radio key="2" value={2}>女</Radio>
                </RadioGroup>
              </FormItem>
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
                  {Util.getOptionList(this.state.roleList, 'id', 'name')}
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="手机号"
              >
                <Input
                  min={1} max={11}
                  {...getFieldProps('phone', {
                    rules: [
                      { required: true, message: '请输入手机号' },
                      { pattern: /^[0-9]{11}$/, message: '请输入11位手机号' },
                      { pattern: /^[1][0-9]{10}$/, message: '请输入正确的手机号' },
                    ],
                  })}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="邮箱"
              >
                <Input
                  maxLength={50}
                  {...getFieldProps('email', {
                    rules: [
                      { required: true, message: '请输入邮箱' },
                      { max: 50, message: '请输入少于50个字符' },
                      { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入格式正确的邮箱' },
                    ],
                  })}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                <Input
                  type="textarea"
                  rows={4}
                  {...getFieldProps('remark', {
                    rules: [
                      { max: 200, message: '请输入少于200个字符' },
                    ],
                  })}
                />
              </FormItem>
              <FormItem
                wrapperCol={{ span: 16, offset: 6 }}
              >
                <div className={less.btns}>
                  <Button type="primary" onClick={this.handleSubmit} className="mr10">保存</Button>
                  <Button type="primary" onClick={this.handleBack}>返回</Button>
                </div>
              </FormItem>
            </Form>
          </Col>
        </Row>

      </Card>
    )
  }
}

export default Form.create()(Edit)