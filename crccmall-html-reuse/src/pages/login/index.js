import { connect } from 'react-redux';
import { setToken } from '@/redux/action/index';
import api from '@/framework/axios';//请求接口的封装
import Auth from '@/utils/auth';
import Util from '@/utils/util'
import { Form, Input, Button, Card } from 'antd';
import less from './index.less';
const FormItem = Form.Item;

class Login extends React.Component {

  state = {
    loading: false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.submit(values);
    });
  }

  toRegister = () => {
    this.props.history.push("/register")
  }

  submit = (params) => {

    if (this.state.loading) {
      return
    } else {
      this.setState({
        loading: true
      })
    }
    
    api.ajax('POST', '@/sso/loginControl/login', {
      ...params
    }).then(r => {
      this.setState({
        loading: false
      })

      let resData = JSON.parse(r.data)
      /**resData字段: 
       * access_token: "xxx"
       * token_type: "bearer"
       * refresh_token: "xxx"
       * expires_in: 7199
       * scope: "all"
       * jti: "xxx"
       * userType: "3"
       * companyId: 25614
      */
      const { dispatch } = this.props;
      dispatch(setToken(resData.access_token));//将cookie存入redux
      Auth.setLoginStatus();//设置cookie为登录状态
      Auth.setToken(resData.access_token);//设置cookie为登录状态

      this.props.history.push('/');
    }).catch(r => {
      this.setState({
        loading: false
      })
      Util.alert(r.msg, { type: "error" })
    })
  }

  render() {
    const { getFieldProps } = this.props.form;
    // 表单栅格布局
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    
    return (
      <Card bordered={false} className={less.login_card}>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem
            label="账户"
            {...formItemLayout}
          >
            <Input placeholder="请输入账户名"
              {...getFieldProps('userAccount', {
                initialValue: '17777777736',
                rules: [
                  { required: true, min: 5, message: '用户名至少为 5 个字符' },
                ],
              })}
            />
          </FormItem>
          <FormItem
            label="密码"
            {...formItemLayout}
          >
            <Input type="password" placeholder="请输入密码"
              {...getFieldProps('password', {
                initialValue: '123456xZ',
                rules: [
                  { required: true, message: '请输入密码' },
                ]
              })}
            />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className={less.login_btn} loading={this.state.loading}>登录</Button>
          </FormItem>
          <div style={{ textAlign: "right" }}>
            {/* <Checkbox {...getFieldProps('agreement')}>记住我</Checkbox> */}
            {/* <a href="javascript:void(0)" onClick={this.toRegister}>去注册</a> */}
          </div>
        </Form>
      </Card>
    )
  }
}


export default connect()(Form.create()(Login))