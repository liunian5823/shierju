import { Form, Input, Select, Button, DatePicker, Row, Col, Icon, Card, Cascader } from 'antd';
import Util from '@/utils/util'
import less from './index.less';

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
                let placeholder = item.placeholder;
                let initialValue = item.initialValue || '';
                let maxLength = item.maxLength || 200;
                if (importantFilter.length > 0 && this.state.isFilterMore == 0 && !importantFilter.includes(field)) {
                    // 有重要过滤条件&&关闭高级过滤&&值不再重要参数区间
                    return false;
                }
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
                    /* TODO 还没使用 */
                    case 'SELECT|INPUT':
                        const selectBefore = (
                            <Select
                                {...getFieldProps(fieldSelect, {
                                    initialValue: initialValue
                                })} style={{ width: '90px' }}>
                                {Util.getOptionList(item.list)}
                            </Select>
                        )
                        const SELECTANDINPUT = <Col span="12" key={field}>
                            <FormItem>
                                <Input
                                    addonBefore={selectBefore}
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    {...getFieldProps(field, {})}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(SELECTANDINPUT);
                        break;
                    /* 日期选择 */
                    case 'RANGE':
                        const RANGE = <Col span="12" key={field}>
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
                    /* 时间选择 */
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
                    /* 关联搜索 */
                    case 'ASSOCIATIVE':
                        const ASSOCIATIVE = <Col span={12}>
                            <FormItem>
                                <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
                                    <Option value="jack">商品0</Option>
                                    <Option value="lucy">商品1</Option>
                                    <Option value="yiminghe">商品2</Option>
                                </Select>

                            </FormItem>
                            <FormItem>
                                <Input placeholder="货号 / 商品" {...getFieldProps('password')} />
                            </FormItem>

                        </Col>
                        formItemList.push(ASSOCIATIVE)
                        break
                    case 'LINKAGE':
                        const { options, loadData, onChange } = item;
                        const LINKAGE = <Col span="12" key={field}>
                            <FormItem label={label}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
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
        if (this.state.isFilterMore === 0) {
            return <div type="primary" className="showBtn" onClick={() => {
                this.handelReset(1)
            }}>高级搜索<i className="iconfont icon-gaojisousuo" /></div>

        } else if (this.state.isFilterMore === 1) {
            return <div type="primary" className="showBtn" onClick={() => {
                this.handelReset(0)
            }}>高级搜索<i className="iconfont icon-gaojisousuo-copy" /></div>
        } else {
            return null
        }
    }

    render() {
        return (
            <Card bordered={false} className="mb10" bodyStyle={{ paddingBottom: '4px' }}>
                <Form horizontal>
                    <Row className="reuse_baseForm">
                        <Col span="20" key={1}>
                            <Row gutter={16}>
                                {this.initFormList()}
                            </Row>
                        </Col>
                        <Col span="4" key={2}>
                            <div style={{ textAlign: 'right' }}>
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