import {
  Card,
  Form,
  Select,
  Row,
  Col,
  Modal,
  Button,
  DatePicker,
  Pagination,
} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util.js';
import Input from '@/components/baseInput';
const FormItem = Form.Item;
const Option = Select.Option;

class addModal extends React.Component {
  _isUpdate = false;

  state = {
    current: 0,
    codeTime: -1,
    codeLoading: false,
    region: [], //选择区域
    provinces: [], //选择省份
    // isShow: false
    isToggleOn: false,
    display: 'none',
    info: {
      company_name: null,
      credit_code: null,
      oper_name: null,
    },
  };

  componentWillMount() {
    this._isMounted = true;
    this.getRegionList(); //获得区域
    // this.getProviceList();//获得省份
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
      id: '2010',
      value: '2010',
    },
    {
      id: '2011',
      value: '2011',
    },
    {
      id: '2012',
      value: '2012',
    },
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
    {
      id: '2020',
      value: '2020',
    },
    {
      id: '2021',
      value: '2021',
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

  // 获得省份数据
  // getProviceList = () =>{
  //   api.ajax("get", "@/base/ecProvince/selectProvince",{
  //   }).then(r=>{
  //     console.log('r',r)
  //   }).catch(r => {

  //   })
  // }

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

    api
      .ajax('GET', '@/platform/blacklist/company/SendVerificationCode', {
        phone: this.props.userPhone,
        verificationCodeType: 1,
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
      this.props.onOk(values);
    });
  };
  handleCancel = () => {
    this.setState({ info: {} });
    this.props.onCancel();
  };

  handleClick = () => {
    let params = this.props.form.getFieldsValue();
    api
      .ajax('GET', '@/platform/blacklist/company/searchCompany', {
        keyword: params.keyword,
      })
      .then((r) => {
        if (r.data && r.data.infomation) {
          this.setState({
            info: r.data.infomation,
          });
        }
        this.setState({
          isToggleOn: true,
          display: 'block',
        });
        params.companyName = this.state.info.company_name;
        params.businessLicenseNo = this.state.info.credit_code;
        params.enterpriseLegalPerson = this.state.info.oper_name;
        this.props.form.setFieldsValue(params);
      })
      .catch((r) => {
        this.setState({
          isToggleOn: false,
          display: 'none',
        });
      });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        title={this.props.title}
        confirmLoading={this.props.confirmLoading}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Card bordered={false}>
          <Form>
            <FormItem>
              <Col>
                <FormItem {...formItemLayout}>
                  <Input
                    type="text"
                    {...getFieldProps('keyword')}
                    placeholder="请输入全部公司名称或者统一社会信用代码"
                    style={{ width: 350 }}
                  ></Input>
                </FormItem>
              </Col>
              <Col span="10" style={{ textAlign: 'right', top: -8 }}>
                <Button type="primary" onClick={this.handleClick}>
                  搜索
                </Button>
              </Col>
            </FormItem>
            <FormItem>
              <div
                style={{
                  width: '100%',
                  height: 32,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 5,
                  textAlign: 'center',
                }}
              >
                <Col span="12">公司名称</Col>
                <Col span="12">统一社会信用代码</Col>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 42,
                  textAlign: 'center',
                  lineHeight: '50px',
                  display: this.state.display,
                }}
              >
                <Col span="12">{this.state.info.company_name}</Col>
                <Col span="12">{this.state.info.credit_code}</Col>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="公司名称">
              <Input
                type="text"
                maxLength="20"
                {...getFieldProps('companyName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入公司名称',
                    },
                  ],
                })}
                placeholder="请输入公司名称"
              ></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="社会信用代码">
              <Input
                type="text"
                maxLength="30"
                {...getFieldProps('businessLicenseNo', {
                  rules: [
                    {
                      required: true,
                      message: '请输入统一社会信用代码',
                    },
                  ],
                })}
                placeholder="请输入统一社会信用代码"
              ></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="法人姓名">
              <Input
                value={this.state.info.oper_name}
                type="text"
                maxLength="20"
                {...getFieldProps('enterpriseLegalPerson', {
                  rules: [
                    {
                      required: true,
                      message: '请输入法人姓名',
                    },
                  ],
                })}
                placeholder="请输入法人姓名"
              ></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="法人身份证号码">
              <Input
                type="text"
                maxLength="18"
                {...getFieldProps('enterpriseLegalPersonId')}
                placeholder="请输入法人身份证号码"
              ></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="评级">
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
            </FormItem>
            <FormItem {...formItemLayout} label="来源">
              <Select
                placeholder="请选择来源"
                {...getFieldProps('souce', {
                  rules: [
                    {
                      required: true,
                      message: '请选择来源',
                    },
                  ],
                })}
              >
                <Option value="1">铁建商城</Option>
                <Option value="2">股份公司</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="上报单位">
              <Input
                type="text"
                maxLength="30"
                {...getFieldProps('reportingCompany', {
                  rules: [
                    {
                      required: true,
                      message: '请输入上报单位',
                    },
                  ],
                })}
                placeholder="请输入上报单位"
              ></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="区域">
              <Select
                placeholder="请选择区域"
                {...getFieldProps('area', {
                  rules: [
                    {
                      required: true,
                      message: '请选择区域',
                    },
                  ],
                })}
              >
                {Util.getOptionList(this.state.region, 'areaName', 'areaName')}
              </Select>
            </FormItem>
            {/* <FormItem {...formItemLayout} label="省份">
              <Select placeholder="请选择省份" {...getFieldProps("provice", {
                rules: [
                  {
                    required: true,
                    message: "请选择省份"
                  }
                ]
              })}>
                {Util.getOptionList(this.state.provices, 'proviceName', 'proviceName')}
              </Select>
            </FormItem> */}
            <FormItem {...formItemLayout} label="发布年份">
              <Select
                placeholder="请选择发布年份"
                {...getFieldProps('yearPublished', {
                  rules: [
                    {
                      required: true,
                      message: '请选择发布年份',
                    },
                  ],
                })}
              >
                {Util.getOptionList(this.yearPublishList)}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="案情简述">
              <Input
                type="textarea"
                maxLength="200"
                rows={5}
                {...getFieldProps('remarks', {
                  rules: [
                    {
                      required: true,
                      message: '请输入案情简述',
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

export default Form.create()(addModal);
