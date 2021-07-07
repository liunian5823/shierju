import { Form, Input, Select, Button, DatePicker, Row, Col, Icon, Card, Cascader, Radio, Upload } from 'antd';

const FormItem = Form.Item;
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
    initFormList = () => {
        const { getFieldProps } = this.props.form;
        const formItemList = [];
        var itemList= <Col span="24" key="SalesType">
                            <FormItem label="登记人"
                             labelCol={{ span: 6 }}
                             wrapperCol={{ span: 18 }}
                                >
                                <Input
                                    type="input"
                                    autoComplete="off"
                                    {...getFieldProps("SalesType")}
                                />
                            </FormItem>

                            <FormItem label="登记时间"
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <Input
                                    type="input"
                                    autoComplete="off"
                                    {...getFieldProps("SalesTime")}
                                />
                            </FormItem>

                            <FormItem label="提货人"
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <FormItem label="姓名："
                                          labelCol={{ span: 8 }}
                                          wrapperCol={{ span:15 }}
                                          style={{width:"175px",float:"left"}}
                                >
                                    <Input
                                        type="input"
                                        autoComplete="off"
                                        {...getFieldProps("SalesName")}
                                    />
                                </FormItem>
                                <FormItem label="电话："
                                          labelCol={{ span: 8 }}
                                          wrapperCol={{ span: 15 }}
                                          style={{width:"175px",float:"left"}}
                                >
                                    <Input
                                        type="input"
                                        autoComplete="off"
                                        {...getFieldProps("SalesPhone")}
                                    />
                                </FormItem>
                            </FormItem>

                            <FormItem label="附件"
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <Upload >
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem label="备注信息："
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <Input
                                    type="textarea"
                                    autoComplete="off"
                                    maxlength="500"
                                    {...getFieldProps("SalesTime")}
                                />
                            </FormItem>
                        </Col>;
        formItemList.push(itemList);
        return formItemList
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
                </Row>
                {/*{this.isShow()}*/}
            </Form>
            // </Card>
        )
    }
}

export default Form.create({})(FilterForm)
