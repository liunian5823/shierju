import { Card, Form, Select, Row, Col, Modal, Button, DatePicker, Radio } from "antd";
import api from "@/framework/axios";
import Util from "@/utils/util";
import Input from "@/components/baseInput";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class addModal extends React.Component {
  _isUpdate = false;

  state = {
    current: 0,
    codeTime: -1,
    codeLoading: false,
    region: [] //选择区域
  };

  componentWillMount() {
    this._isMounted = true;
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
  
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.props.onOk(values);
    });
  };
  handleCancel = () => {
    this.props.onCancel();
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        title={this.props.title}
        confirmLoading={this.props.confirmLoading}
        wrapClassName="vertical-center-modal"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Card bordered={false}>
          <Form>
            <FormItem {...formItemLayout} label="定时任务名称">
              <Input
                type="text"
                maxLength="20"
                {...getFieldProps("jobName", {
                  rules: [
                    {
                      required: true,
                      message: "请输入定时任务名称"
                    }
                  ]
                })}
                placeholder="请输入定时任务名称"
              />
            </FormItem>
            <FormItem {...formItemLayout} label="定时任务组别">
              <Input
                type="text"
                maxLength="30"
                {...getFieldProps("jobGroup", {
                  rules: [
                    {
                      required: true,
                      message: "请输入定时任务组别"
                    }
                  ]
                })}
                placeholder="请输入定时任务组别"
              />
            </FormItem>
            <FormItem {...formItemLayout} label="是否开启">
              <RadioGroup {...getFieldProps("jobStatus",{
                    rules: [
                      {
                        required: true,
                        message: "是否开启"
                      }
                    ],
              })}>
                <Radio key="a" value={0}>关闭</Radio>
                <Radio key="b" value={1}>开启</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="cron表达式">
              <Input
                type="text"
                maxLength="30"
                {...getFieldProps("cronExpression", {
                  rules: [
                    {
                      required: true,
                      message: "请输入cron表达式"
                    }
                  ]
                })}
                placeholder="请输入cron表达式"
              />
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              <RadioGroup {...getFieldProps("description",{
                  rules: [
                    {
                      required: true,
                      message: "请描述"
                    }
                  ]
                })}>
                <Radio key="a" value={0}>集群全部执行</Radio>
                <Radio key="b" value={1}>单节点执行</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="类路径">
              <Input
                type="text"
                maxLength="100"
                {...getFieldProps("beanClass", {
                  rules: [
                    {
                      required: true,
                      message: "请输入类路径"
                    }
                  ]
                })}
                placeholder="请输入类路径"
              />
            </FormItem>
            <FormItem {...formItemLayout} label="顺序执行">
              <RadioGroup {...getFieldProps("isConcurrent",{
                  rules: [
                    {
                      required: true,
                      message: "是否需要顺序执行"
                    }
                  ]
                })}>
                <Radio key="a" value={0}>是</Radio>
                <Radio key="b" value={1}>否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="springId">
              <Input
                type="text"
                maxLength="30"
                {...getFieldProps("springId", {
                  rules: [
                    {
                      required: true,
                      message: "请输入springId"
                    }
                  ]
                })}
                placeholder="请输入springId"
              />
            </FormItem>
            <FormItem {...formItemLayout} label="方法名">
              <Input
                type="text"
                maxLength="30"
                {...getFieldProps("methodName", {
                  rules: [
                    {
                      required: true,
                      message: "请输入方法名"
                    }
                  ]
                })}
                placeholder="请输入方法名"
              />
            </FormItem>
            {/*<FormItem {...formItemLayout} label="手机号">
              {this.props.userPhone}
            </FormItem>*/}
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(addModal);
