import { Form, Input, Select, Button, DatePicker, Row, Col, Icon, Card, Cascader, Radio } from 'antd';
import Util from '@/utils/util'
import less from './index.less'
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
class FilterForm extends React.Component {
    constructor(props){
        super(props)
        console.log(props.onSubmit)
    }
    state = {
        isFilterMore: 1,//0收起 1展开,
        validateStatus:'',
        help:'',
        time:60,
        btnDisable:false,
        btnContent: '发送验证码',
        rest:false,
        loading:false
    }
    timeChange;


    // 倒计时
    click=()=>{

        let ti = this.state.time;

        if (ti > 0 && this.state.rest===false) {
            //当ti>0时执行更新方法
            ti = ti - 1;
            this.setState({
                time: ti,
                btnContent: ti + "s后重新获取",
            });
        }else{
            //当ti=0时执行终止循环方法
            clearInterval(timeChange);
            this.setState({
                btnDisable: false,
                time: 60,
                btnContent: "发送验证码",
                rest:false,
                loading:false
            });
        }
    }
    sendCode=()=>{
        this.setState({
            loading:true,
            btnContent: "正在发送",
        })
        const _that=this

        setTimeout(function(){
            _that.setState({
                btnDisable: true,
                btnContent: "60s后重新获取",
                rest:false,
                loading:false
            });
            console.log(this.timeChange)
            this.timeChange = setInterval(_that.click,1000);
        },1000)
    }

    restClick=()=>{
        this.refs.BaseForm.resetFields()
        this.setState({
            btnDisable: false,
            time:60,
            btnContent: "发送验证码",
            rest:true,
            loading:false
        });
    }

    handleChange(value) {
    }
    componentWillMount() {
        if (this.props.importantFilter) {
            this.setState({
                isFilterMore: 0
            })
        }
        if(this.props.isAutoHeight){
            this.setState({
                isFilterMore: 1
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
                let rules = item.rules || [];
                let disabled = item.disabled || false;
                let defaultValue = item.defaultValue || '';
                let span = item.span || 18;
                let inputType = item.inputType || 'text';
                let extra = item.extra || '';
                // if (importantFilter.length > 0 && this.state.isFilterMore == 0 && !importantFilter.includes(field)) {
                //     // 有重要过滤条件&&关闭高级过滤&&值不再重要参数区间
                //     return false;
                // }
                switch (item.type) {
                    /* 输入框 */
                    case 'INPUT':
                        const INPUT = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: span }}
                                      extra={extra}
                            >
                                <Input
                                    type={inputType}
                                    maxLength={maxLength}
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    disabled={disabled}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue,
                                        rules:rules
                                    })}
                                    defaultValue={defaultValue}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(INPUT);
                        break;
                    /* textarea */
                    case 'TEXTAREA':
                        const TEXTAREA = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: span }}

                            >
                                <Input
                                    maxLength={maxLength}
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    disabled={disabled}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue,
                                        rules:rules
                                    })}
                                    type
                                    defaultValue={defaultValue}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(TEXTAREA);
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
                                        initialValue: initialValue,
                                        rules:rules
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
                        const SELECT =<Row gutter={16} className="baseForm-row"> <Col span="24" key={field}>
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
                                                initialValue: initialValue,
                                                rules:rules
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
                                                initialValue: initialValue,
                                                rules:rules
                                            })}
                                            style={{ verticalAlign: 'top' }}
                                        >
                                            {Util.getOptionList(item.list, selectKey, selectlabel)}
                                        </Select>}
                            </FormItem>
                        </Col></Row>
                        formItemList.push(SELECT);
                        break;
                    case 'DATE':
                        const DATE = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <DatePicker
                                    format="yyyy/MM/dd"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue,
                                        rules:rules
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(DATE);
                        break;
                    /* 时间选择-单选(DatePicker) */
                    case 'DATETIME':
                        const DATETIME = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <DatePicker
                                    showTime
                                    format="yyyy/MM/dd HH:mm:ss"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue,
                                        rules:rules
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(DATETIME);
                        break;
                    /* 日期选择-连选(RangePicker) */
                    case 'RANGE':
                        const RANGE = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <RangePicker
                                    format="yyyy/MM/dd"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue,
                                        rules:rules
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(RANGE);
                        break;
                    /* 时间选择-连选(RangePicker) */
                    case 'RANGETIME':
                        const RANGETIME = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <RangePicker
                                    showTime
                                    format="yyyy/MM/dd HH:mm:ss"
                                    style={{ width: '100%' }}
                                    {...getFieldProps(field, {
                                        initialValue: initialValue,
                                        rules:rules
                                    })}
                                />
                            </FormItem>
                        </Col>
                        formItemList.push(RANGETIME);
                        break;
                    /* radio单选*/
                    case 'RADIO':
                        const RADIO = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}

                            >
                                <RadioGroup
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    {...getFieldProps(field, {
                                        initialValue: initialValue,
                                        rules:rules
                                    })}

                                    style={{ verticalAlign: 'top' }}
                                >
                                    {Util.getRadioList(item.list, selectKey, selectlabel)}
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        formItemList.push(RADIO);
                        break;
                    case 'PHONECODE':
                        const PHONECODE = <Col span="24" key={field}>
                            <FormItem label={label}
                                      labelCol={{ span: 8 }}
                                      wrapperCol={{ span: 16 }}
                                      extra={extra}
                            >
                                <Col span="8">
                                    <Input
                                        type={inputType}
                                        maxLength={maxLength}
                                        placeholder={placeholder}
                                        autoComplete="off"
                                        disabled={disabled}
                                        {...getFieldProps(field, {
                                            initialValue: initialValue,
                                            rules:rules
                                        })}
                                        defaultValue={defaultValue}
                                    />
                                </Col>
                                <Col span="4" className={less.ml20}>
                                    <Button type="primary" loading={this.state.loading}  onClick={this.sendCode} disabled={this.state.btnDisable} >{this.state.btnContent}</Button>
                                </Col>
                            </FormItem>
                        </Col>
                        formItemList.push(PHONECODE);
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
        console.log(fieldsValue)
        // this.props.filterSubmit(fieldsValue);
    }

    getFieldsValue = () => {
        return this.props.form.getFieldsValue()
    }

    handelReset = (type) => {
        if (type == 2) {
            this.props.form.resetFields();
            this.handleSubmits()
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
            // <Card bordered={false} className="mb10" bodyStyle={{ paddingBottom: '4px' }}>
            <Form horizontal>
                <Row className="baseForm-row">
                    <Col span={isFilterMore ? 24 : 24} key={1} style={{  height: isFilterMore ? '' : '100px' }}>
                        {/* <Row gutter={16} className="baseForm-row"> */}
                        {this.initFormList()}
                        {/* </Row> */}
                    </Col>
                    {this.props.btnShow?
                        <Col span={isFilterMore ? 24 : 4} key={2}>
                            <div style={{ textAlign: 'right', marginBottom: isFilterMore ? '20px' : '0' }}>
                                <Button type="primary" onClick={this.handleSubmit}
                                        style={{ marginRight: '10px' }}>绑卡</Button>

                            </div>
                        </Col>
                        :
                        ''
                    }

                </Row>
                {/*{this.isShow()}*/}
            </Form>
            // </Card>
        )
    }
}

export default Form.create({})(FilterForm)
