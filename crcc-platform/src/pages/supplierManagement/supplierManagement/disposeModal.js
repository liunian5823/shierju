import { Form, Select, Modal, Input, InputNumber, Checkbox } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';

const FormItem = Form.Item;

class DisposeModal extends React.Component {
  visible = false;
  state = {
    type: '4',//处理类型
    isClose: false,//是否永久关闭
    region: []
  }

  componentWillMount() {
    this._isMounted = true;
    this.getRegionList();//获得区域
  }

  componentDidUpdate() {
    if (this.visible != this.props.visible) {
      this.visible = this.props.visible;
      this.props.form.resetFields();
      this.setState({
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // 获得区域数据
  getRegionList = () => {
    api.ajax("GET", "@/base/ecProvince/selectArea", {
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        region: r.data.rows,
      })
    }).catch(r => {
    })
  }

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.props.onOk(values);
    })
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  handleSelectChange = (value) => {
    this.setState({
      type: value
    })
  }
  handleClose = (e) => {
    this.props.form.resetFields(['days'])
    this.setState({
      isClose: e.target.checked
    })
  }

  initFormItemByType = (type) => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    if (type == '4' || type == '3') {
      return [
        <FormItem key='1'
          label='关闭天数'
          {...formItemLayout}>
          <InputNumber
            type="text"
            placeholder="请输入关闭天数"
            disabled={this.state.isClose}
            {...getFieldProps('days',
              {
                rules: [
                  {
                    required: !this.state.isClose,
                    message: '请输入关闭天数'
                  }
                ]
              })} />
        </FormItem>,
        <FormItem key='2'
          label=' '
          {...formItemLayout}>
          <Checkbox
            checked={this.state.isClose}
            onChange={this.handleClose}>永久关闭</Checkbox>
        </FormItem>
      ]
    } else {
      return [
        <FormItem key='3'
          label="评级"
          {...formItemLayout}>
          <Select
            placeholder='请选择评级'
            {...getFieldProps('rating',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择评级'
                  }
                ]
              })}>
            {Util.getOptionList([
              {
                id: '0',
                value: "黑"
              },
              {
                id: "1",
                value: "灰"
              }, {
                id: "2",
                value: "黄"
              }
            ])}
          </Select>
        </FormItem>,
        <FormItem key='4'
          label="上报单位"
          {...formItemLayout}>
          <Input
            type='text'
            placeholder='请输入上报单位'
            {...getFieldProps('reportingCompany',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入上报单位'
                  }
                ]
              })} />
        </FormItem>,
        <FormItem {...formItemLayout} label="区域" key='5'>
          <Select placeholder="请选择区域" {...getFieldProps("area", {
            rules: [
              {
                required: true,
                message: "请选择区域"
              }
            ]
          })}>
            {Util.getOptionList(this.state.region, 'areaName', 'areaName')}
          </Select>
        </FormItem>
      ]
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <Modal
        title='供应商处理'
        wrapClassName="vertical-center-modal"
        confirmLoading={this.props.confirmLoading}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Form>
          <FormItem
            label='公司名称'
            {...formItemLayout}>
            {this.props.formData.name}
          </FormItem>
          <FormItem
            label="法人姓名"
            {...formItemLayout}>
            {this.props.formData.legalPersonName}
          </FormItem>
          <FormItem
            label='法人身份证号码'
            {...formItemLayout}>
            {this.props.formData.legalPersonId}
          </FormItem>
          <FormItem
            label="营业执照号"
            {...formItemLayout}>
            {this.props.formData.businessLicense}
          </FormItem>
          <FormItem
            label="处理类型"
            {...formItemLayout}>
            <Select
              placeholder='请选择处理类型'
              {...getFieldProps('type',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入处理类型'
                    }
                  ],
                  initialValue: this.state.type,
                  onChange: this.handleSelectChange
                })}>
              {Util.getOptionList([
                {
                  id: '4',
                  value: "关闭门户"
                },
                {
                  id: "3",
                  value: "封停"
                }, {
                  id: "2",
                  value: "拉黑企业"
                }, {
                  id: "1",
                  value: "拉黑自然人"
                }
              ])}
            </Select>
          </FormItem>
          {this.initFormItemByType(this.state.type)}
          <FormItem
            label="案情简述"
            {...formItemLayout}>
            <Input
              type="textarea"
              placeholder="案情简述"
              {...getFieldProps('remarks',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入案情简述'
                    }
                  ]
                })} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(DisposeModal);