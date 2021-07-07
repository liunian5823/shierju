import { Card, Form, Row, Col, Modal, Button, Select, DatePicker } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util.js';
import Input from '@/components/baseInput';
const FormItem = Form.Item;
const Option = Select.Option;

class ModalFormComponent extends React.Component {
  _isUpdate = false;
  state = {
    current: 0,
    codeTime: -1,
    codeLoading: false,
    region: [],
  };

  componentWillMount() {
    this._isMounted = true;
    this.getRegionList(); //获得区域
  }

  componentDidUpdate() {
    if (this._isUpdate != this.props.visible) {
      this._isUpdate = this.props.visible;
      this.props.form.resetFields();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //发布年份数据
  yearPublishList = [
    {
      id: '2013',
      value: '2013',
    },
    {
      id: '2014',
      value: '2014',
    },
    {
      id: '2015',
      value: '2015',
    },
    {
      id: '2016',
      value: '2016',
    },
    {
      id: '2017',
      value: '2017',
    },
    {
      id: '2018',
      value: '2018',
    },
    {
      id: '2019',
      value: '2019',
    },
  ];

  // 获得区域数据
  getRegionList = () => {
    api
      .ajax('GET', '@/base/ecProvince/selectArea', {})
      .then((r) => {
        if (!this._isMounted) {
          return;
        }
        this.setState({
          region: r.data.rows,
        });
      })
      .catch((r) => {});
  };

  smsCodeBtn = (codeLoading) => {
    let codeTime = codeLoading == 'codeLoading' ? 'codeTime' : 'codeTime2';
    if (this.state[codeTime] >= 0) {
      return (
        <Button type="primary" disabled={true}>
          短信验证码({this.state[codeTime]})
        </Button>
      );
    } else {
      return (
        <Button
          type="primary"
          loading={this.state[codeLoading]}
          onClick={() => {
            this.sendSimCode(codeLoading);
          }}
        >
          发送短信验证码
        </Button>
      );
    }
  };

  //发送短信验证码
  sendSimCode = (codeLoading = 'codeLoading') => {
    this.setState({
      [codeLoading]: true,
    });
    let verificationCodeType;
    if (this.props.obj.effective && this.props.obj.effective == '1') {
      verificationCodeType = 2;
    } else {
      verificationCodeType = 3;
    }
    api
      .ajax('GET', '@/platform/blacklist/company/SendVerificationCode', {
        phone: this.props.userPhone,
        verificationCodeType,
      })
      .then((r) => {
        this.setState({
          [codeLoading]: false,
        });
        this.toTiming(true, codeLoading);
      })
      .catch((r) => {
        this.setState({
          [codeLoading]: false,
        });
        Util.alert(r.msg, { type: 'error' });
      });
  };

  //开始计时
  toTiming = (reset = false, codeLoading = 'codeLoading') => {
    if (!this._isMounted) {
      return;
    }
    let codeTime = codeLoading == 'codeLoading' ? 'codeTime' : 'codeTime2';
    let time = this.state[codeTime];
    if (reset) {
      time = 61;
    }
    if (time >= 0) {
      this.setState({
        [codeTime]: --time,
      });
      setTimeout(() => {
        this.toTiming(false, codeLoading);
      }, 1000);
    }
  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      this.props.onOk(values, this.props.obj.effective);
    });
  };
  handleCancel = () => {
    this.props.onCancel();
  };

  getTitle = () => {
    if (this.props.obj.effective && this.props.obj.effective == '1') {
      return '移入';
    } else {
      return '移除';
    }
  };

  initNode = () => {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const { getFieldProps } = this.props.form;
    if (this.props.obj.effective && this.props.obj.effective == '1') {
      return [
        <FormItem {...formItemLayout} label="评级" key="1">
          <Select
            placeholder="请选择评级"
            {...getFieldProps('rating', {
              rules: [
                {
                  required: true,
                  message: '请选择评级',
                },
              ],
            })}
          >
            <Option value="0">黑</Option>
            <Option value="1">灰</Option>
            <Option value="2">黄</Option>
          </Select>
        </FormItem>,
      ];
    }
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        title={this.getTitle()}
        confirmLoading={this.props.confirmLoading}
        wrapClassName="vertical-center-modal"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Card bordered={false}>
          <Form>
            <FormItem {...formItemLayout} label="公司名称">
              {this.props.obj.name}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="社会信用代码"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 17 }}
            >
              {this.props.obj.businessLicense}
            </FormItem>
            {this.initNode()}
            <FormItem {...formItemLayout} label="案情简述">
              <Input
                type="textarea"
                {...getFieldProps('remarks', {
                  rules: [
                    {
                      required: true,
                      message: '请输入案情简述',
                    },
                    {
                      max: 200,
                      message: '最多输入200个字符',
                    },
                  ],
                })}
              ></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {this.props.userPhone}
            </FormItem>
            <FormItem {...formItemLayout} label="验证码">
              <Col span="12">
                <FormItem>
                  <Input
                    type="text"
                    maxLength="6"
                    {...getFieldProps('verificationCode', {
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码',
                        },
                      ],
                    })}
                    placeholder="请输入验证码"
                  />
                </FormItem>
              </Col>
              <Col span="12" style={{ textAlign: 'right' }}>
                {this.smsCodeBtn('codeLoading')}
              </Col>
            </FormItem>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(ModalFormComponent);
