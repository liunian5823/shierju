import { Form, Input, Select, Button, DatePicker, Row, Col, Icon, Card, Cascader } from 'antd';
import Util from '@/utils/util'
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class FilterForm extends React.Component {
    state = {
        isFilterMore: ''//0收起 1展开
    }

    handleChange(value) {
    }

    componentWillMount() {
        if (this.props.importantFilter) {
            this.setState({
                isFilterMore: 0
            })
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
                let initialValue = item.initialValue || undefined;
                let placeholder = item.placeholder;
                let maxLength = item.maxLength || 200;
                // if (importantFilter.length > 0 && this.state.isFilterMore == 0 && !importantFilter.includes(field)) {
                //     // 有重要过滤条件&&关闭高级过滤&&值不再重要参数区间
                //     return false;
                // }
                switch (item.type) {
                    /* 输入框 */
                    case 'INPUT':
                        const INPUT = <Col span="12" key={field}>
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
                    /* 带搜索的选择框 */
                    case 'SELECTINPUT':
                        // 判断需要字段与否
                        let selectKey1 = item.listKey || 'id';
                        let selectlabel1 = item.listLabel || 'value';
                        const SELECT1 = <Col span="12" key={field}>
                            <FormItem label={label}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                <Select
                                    filterOption={(input, option) => {
                                        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    }
                                    showSearch
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    {...getFieldProps(field, {
                                        initialValue: initialValue
                                    })}
                                >
                                    {Util.getOptionList(item.list, selectKey1, selectlabel1)}
                                </Select>
                            </FormItem>
                        </Col>
                        formItemList.push(SELECT1);
                        break;
                    /* 单选框 */
                    case 'SELECT':
                        // 判断需要字段与否
                        let selectKey = item.listKey || 'id';
                        let selectlabel = item.listLabel || 'value';
                        const SELECT = <Col span="12" key={field}>
                            <FormItem label={label}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                {
                                    item.multiple ?
                                        <Select
                                            multiple
                                            placeholder={placeholder}
                                            autoComplete="off"
                                            {...getFieldProps(field, {
                                                initialValue: initialValue
                                            })}
                                            style={{ verticalAlign: 'top' }}
                                        >
                                            {Util.getOptionList(item.list, selectKey, selectlabel)}
                                        </Select>
                                        :
                                        <Select
                                            placeholder={placeholder}
                                            autoComplete="off"
                                            {...getFieldProps(field, {
                                                initialValue: initialValue
                                            })}
                                            style={{ verticalAlign: 'top' }}
                                        >
                                            {Util.getOptionList(item.list, selectKey, selectlabel)}
                                        </Select>}
                            </FormItem>
                        </Col>
                        formItemList.push(SELECT);
                        break;
                    /* 日期选择-单选(DatePicker) */
                    case 'DATE':
                        const DATE = <Col span="12" key={field}>
                            <FormItem label={label}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                <DatePicker
                                    format="yyyy/MM/dd"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(DATE);
                        break;
                    /* 时间选择-单选(DatePicker) */
                    case 'DATETIME':
                        const DATETIME = <Col span="12" key={field}>
                            <FormItem label={label}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                <DatePicker
                                    showTime
                                    format="yyyy/MM/dd HH:mm:ss"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(DATETIME);
                        break;
                    /* 日期选择-连选(RangePicker) */
                    case 'RANGE':
                        const RANGE = <Col span="12" key={field}>
                            <FormItem label={label}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                <RangePicker
                                    format="yyyy/MM/dd"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(RANGE);
                        break;
                    /* 时间选择-连选(RangePicker) */
                    case 'RANGETIME':
                        const RANGETIME = <Col span="12" key={field}>
                            <FormItem label={label}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                <RangePicker
                                    showTime
                                    format="yyyy/MM/dd HH:mm:ss"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(RANGETIME);
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

    getFieldsValue = () => {
        return this.props.form.getFieldsValue()
    }

    handelReset = (type) => {
        if (type == 2) {
            this.props.form.resetFields();
            this.handleSubmit()
        } else {
            this.setState({
                isFilterMore: type
            })
        }
        // if (type == 1) {
        //     //如果是展开
        //     this.setState({
        //         isFilterMore: type
        //     })
        //     return
        // }
        // this.props.form.resetFields();
        // let fieldsValue = this.props.form.getFieldsValue();
        // this.props.filterSubmit(fieldsValue, true);

        // if (type < 2) {
        //     this.setState({
        //         isFilterMore: type
        //     })
        // }
    }

    isShow = () => {
        if (this.state.isFilterMore === 0) {
            return <div type="primary" className="showBtn" onClick={() => {
                this.handelReset(1)
            }}>高级搜索
                <Icon type="double-right" style={{ marginLeft: '4px', transform: 'rotateZ(90deg)' }}></Icon>
            </div>

        } else if (this.state.isFilterMore === 1) {
            return <div type="primary" className="showBtn" onClick={() => {
                this.handelReset(0)
            }}>高级搜索
                <Icon type="double-right" style={{ marginLeft: '4px', transform: 'rotateZ(-90deg)' }}></Icon>
            </div>
        } else {
            return null
        }
    }

    render() {
        const isFilterMore = this.state.isFilterMore;

        return (
            <Card bordered={false} className="mb10" bodyStyle={{ paddingBottom: '4px' }}>
                <Form horizontal>
                    <Row className="baseForm">
                        <Col span={isFilterMore ? 24 : 20} key={1} style={{ overflow: 'hidden', height: isFilterMore ? '' : '50px' }}>
                            <Row gutter={16} className="baseForm-row">
                                {this.initFormList()}
                            </Row>
                        </Col>
                        <Col span={isFilterMore ? 24 : 4} key={2}>
                            <div style={{ textAlign: 'right', marginBottom: isFilterMore ? '20px' : '0' }}>
                                <Button type="primary" onClick={this.handleSubmit}
                                    style={{ marginRight: '10px' }}>搜索</Button>
                                <Button onClick={() => {
                                    this.handelReset(2)
                                }}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                    {this.isShow()}
                </Form>
            </Card>
        )
    }
}

export default Form.create({})(FilterForm)
