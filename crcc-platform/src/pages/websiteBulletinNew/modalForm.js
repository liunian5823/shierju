import { Form, Select, Modal, Input } from 'antd';
import WangEditor from '@/components/gaoda/WangEditor'
import Util from '@/utils/util';

const FormItem = Form.Item;
const Option = Select.Option;

class ModalFormComponent extends React.Component {
  visible = false;
  state = {
    html: "",
  }

  componentDidUpdate() {
    if (this.visible != this.props.visible) {
      this.visible = this.props.visible;
      if (this.props.info) {
        this.props.form.setFieldsValue(this.props.info);
        console.log(info);
      } else {
        this.props.form.resetFields();
        this.setState({
          html:''
        })
      }
    }
  }

  editChange = (html) => {
    console.log(html)
    this.setState({
      html
    })
  }

  handleOk = () => {
    const content = this.state.html.replace(/<[^>]+>/g, "");
    if (!content) {
      Util.alert('请在富文本编辑框内输入您的公告内容', { type: 'error' })
      return;
    }
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.props.onOk({ ...values, content: this.state.html });
    })
  }
  handleCancel = () => {
    this.props.onCancel();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        title={this.props.title}
        wrapClassName="vertical-center-modal"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        confirmLoading={this.props.loading}
        okText="发布">
        <Form>
          <FormItem {...formItemLayout} label="信息标题">
            <Input type="text" {...getFieldProps("title", {
              rules: [
                {
                  required: true,
                  message: "标题不能为空"
                }
              ]
            })}></Input>
          </FormItem>
          <FormItem {...formItemLayout} label="信息类型">
            <Select
              {...getFieldProps("newsType", {
                rules: [
                  {
                    required: true,
                    message: "请选择信息类型"
                  }
                ]
              })}
              placeholder="请选择信息类型">
              <Option value={2}>新闻动态</Option>
              <Option value={1}>网站公告</Option>
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="信息内容">
            <WangEditor initHtml={this.state.html} onChange={this.editChange}></WangEditor>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalFormComponent);