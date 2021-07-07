import { Modal, Form, Input, Select, Button, DatePicker, Row, Col } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class FilterForm extends React.Component {
  initFormList = () => {
    const { getFieldProps } = this.props.form;
    const formList = this.props.formList;
    const formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label;
        let field = item.field;
        let placeholder = item.placeholder;
        let initialValue = item.initialValue || '';
        switch (item.type) {
          case 'INPUT':
            const INPUT = <Col span="12" key={field}>
              <FormItem label={label}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  placeholder={placeholder}
                  {...getFieldProps(field, {
                    initialValue: initialValue
                  })}
                />
              </FormItem>
            </Col>
            formItemList.push(INPUT);
            break;

          case 'SELECT':
            const SELECT = <Col span="12" key={field}>
              <FormItem label={label}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  placeholder={placeholder}
                  {...getFieldProps(field, {
                    initialValue: initialValue
                  })}
                >
                  {Util.getOptionList(item.list,false)}
                </Select>
              </FormItem>
            </Col>
            formItemList.push(SELECT);
            break;
          case 'RANGE':
            const RANGE = <Col span="12" key={field}>
              <FormItem label={label}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  {...getFieldProps(field, {
                    initialValue: initialValue
                  })}
                />
              </FormItem>
            </Col>
            formItemList.push(RANGE);
            break;
          default:
            break;
        }

      });
    }
    return formItemList;
  }

  handelSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();
    this.props.onOk(true,fieldsValue);
  }

  handelReset = () => {
    this.props.form.resetFields();
    this.props.onOk(false);
  }

  render() {
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handelSubmit}
        onCancel={this.handelSubmit}
      >
        <Form horizontal>
          <Row gutter={16}>
            {this.initFormList()}
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(FilterForm)