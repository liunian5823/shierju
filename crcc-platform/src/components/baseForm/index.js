import { Form, Input, Select, Button, DatePicker, Row, Col, Icon,Cascader, InputNumber ,Checkbox } from 'antd';
import Util from '@/utils/util'
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
class FilterForm extends React.Component {
  state = {
    isFilterMore: '',//0收起 1展开
  }

  reloadTimes = 0

  componentWillMount() {
    if (this.props.importantFilter) {
      this.setState({
        isFilterMore: 0
      })
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.reloadTimes < nextprops.reloadTimes) {
      this.reloadTimes = nextprops.reloadTimes;
      this.handelReset(0);
    }
  }

  initFormList = () => {
    const { getFieldProps } = this.props.form;
    const importantFilter = this.props.importantFilter || [];
    const formList = this.props.formList;
    const formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label;
        let field = item.field;
        let fieldSelect = item.fieldSelect || '';
        let placeholder = item.placeholder;
        let initialValue = item.initialValue || '';
        let maxLength = item.maxLength || 200;
        let minValue = item.minValue || 0;
        if (importantFilter.length > 0 && this.state.isFilterMore == 0 && !importantFilter.includes(field)) {
          // 有重要过滤条件&&关闭高级过滤&&值不再重要参数区间
          return false;
        }
        let spanArea = this.state.isFilterMore == 0 ? 12 : 8;
        switch (item.type) {
          case 'INPUT':
            const INPUT = <Col span={spanArea} key={field}>
              <FormItem label={label}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Input
                  maxLength={maxLength}
                  placeholder={placeholder}
                  autoComplete="off"
                  {...getFieldProps(field, {
                    initialValue: initialValue
                  })}
                />
              </FormItem>
            </Col>
            formItemList.push(INPUT);
            break;

            case 'INPUTNUMBER':
                const INPUTNUMBER = <Col span={spanArea} key={field}>
                    <FormItem label={label}
                              labelCol={{ span: 6 }}
                              wrapperCol={{ span: 18 }}
                    >
                        <InputNumber
                            maxLength={maxLength}
                            placeholder={placeholder}
                            min={minValue}
                            autoComplete="off"
                            {...getFieldProps(field, {
                                initialValue: initialValue
                            })}
                        />
                    </FormItem>
                </Col>
                formItemList.push(INPUTNUMBER);
                break;


          case 'SELECT':
            // 判断需要字段与否
            let selectKey = item.listKey || 'id';
            let selectlabel = item.listLabel || 'value';

            const SELECT = <Col span={spanArea} key={field}>
              <FormItem label={label}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Select
                  placeholder={placeholder}
                  autoComplete="off"
                  {...getFieldProps(field, {
                    initialValue: initialValue
                  })}
                >
                  <Option value="">全部</Option>
                  {Util.getOptionList(item.list, selectKey, selectlabel)}
                </Select>
              </FormItem>
            </Col>
            formItemList.push(SELECT);
            break;
          case 'SELECT|INPUT':
            const selectBefore = (
              <Select
                {...getFieldProps(fieldSelect, {
                  initialValue: initialValue
                })} style={{ width: '90px' }}>
                {Util.getOptionList(item.list)}
              </Select>
            )
            const SELECTANDINPUT = <Col span={spanArea} key={field}>
              <FormItem >
                <Input
                  addonBefore={selectBefore}
                  placeholder={placeholder}
                  autoComplete="off"
                  {...getFieldProps(field, {
                  })}
                />
              </FormItem>
            </Col>
            formItemList.push(SELECTANDINPUT);
            break;
          case 'RANGE':
            const RANGE = <Col span={spanArea} key={field}>
              <FormItem label={label}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
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
          case 'RANGETIME':
            const RANGETIME = <Col span={spanArea} key={field}>
              <FormItem label={label}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <RangePicker
                  showTime
                  format="yyyy/MM/dd HH:mm"
                  style={{ width: '100%' }}
                  {...getFieldProps(field, {
                    initialValue: initialValue
                  })}
                />
              </FormItem>
            </Col>
            formItemList.push(RANGETIME);
            break;
          case 'DATEPICKER':
              const datePicker  = <Col span={spanArea} key={field}>
                  <FormItem label={label}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                  >
                      <DatePicker
                          showTime
                          format="yyyy/MM/dd HH:mm"
                          style={{ width: '100%' }}
                          {...getFieldProps(field, {
                              initialValue: initialValue
                          })}
                      />
                  </FormItem>
              </Col>
              formItemList.push(datePicker);
              break;
          case 'LINKAGE':
            const {options,loadData,onChange} = item;
            const LINKAGE = <Col span={spanArea} key={field}>
              <FormItem label={label}
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
              >
                <Cascader
                    placeholder={placeholder}
                    options={options}
                    loadData={loadData}
                    onChange={onChange}
                    allowClear
                    changeOnSelect
                    {...getFieldProps(field, {
                      initialValue: initialValue
                    })}
                />

              </FormItem>
            </Col>
            formItemList.push(LINKAGE);
            break;
          case 'CHECKBOX':
                const CHECKBOX = <Col span={item.span} key={field}>
                    <FormItem label={label}
                              labelCol={{span: 3}}
                              wrapperCol={{span: 18}}
                    >
                        <CheckboxGroup
                            options={item.options}
                            {...getFieldProps(field, {

                            })}
                        />

                    </FormItem>
                </Col>
                formItemList.push(CHECKBOX);
                break;
          default:
            break;
        }

      });
    }
    return formItemList;
  }

  handleSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();
    this.props.filterSubmit(fieldsValue);
  }

  handelReset = (type) => {
    if (type == 1) {
      //如果是展开
      this.setState({
        isFilterMore: type
      })
      return
    }
    this.props.form.resetFields();
    let fieldsValue = this.props.form.getFieldsValue();
    this.props.filterSubmit(fieldsValue, true);

    if (type < 2) {
      this.setState({
        isFilterMore: type
      })
    }
  }

  isShow = () => {
    let isShowMore = (this.props.showMore)||(this.props.importantFilter && this.props.formList.length > this.props.importantFilter.length) ? true : false;
    if (this.state.isFilterMore === 0 && isShowMore) {
      return <a href="javascript:void(0)" className="" onClick={() => { this.handelReset(1) }}>展开<Icon type="down" /></a>
    } else if (this.state.isFilterMore === 1 && isShowMore) {
      return <a href="javascript:void(0)" className="" onClick={() => { this.handelReset(0) }}>收起<Icon type="up" /></a>
    } else {
      return null
    }
  }

  render() {
    let spanArr = this.state.isFilterMore == 0 ? [16, 8] : [24, 24];
    let btnTextAlgin = this.state.isFilterMore == 0 ? 'left' : 'right';
    let marginBtm = this.state.isFilterMore == 0 ? '0' : '20px';

    return (
      <Form horizontal>
        <Row className="baseForm" gutter={16}>
          <Col span={spanArr[0]} key={1}>
            <Row gutter={16}>
              {this.initFormList()}
            </Row>
          </Col>
          <Col span={spanArr[1]} key={2}>
            <div style={{ textAlign: btnTextAlgin, marginBottom: marginBtm }}>
              <Button type="primary" onClick={this.handleSubmit} className="mr10">查询</Button>
              <Button onClick={() => { this.handelReset(2) }} className="mr10">重置</Button>
              {this.isShow()}
            </div>
          </Col>
        </Row>
      </Form>
    )

  }
}
export default Form.create({})(FilterForm)