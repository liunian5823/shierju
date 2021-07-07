import { Form, Select, Button, Input, Row, Col, Card } from 'antd';
import WangEditor from '@/components/gaoda/WangEditor'
import Util from '@/utils/util';
import api from "@/framework/axios";
import DetailsView from "../webView/detail";
const FormItem = Form.Item;
const Option = Select.Option;

class ModalFormComponent extends React.Component {
    visible = false;
    state = {
        html: "",
        detailsVisible: false,   //预览弹窗控制
        formData: {},   //当前表单的数据
    }

    editChange = (html) => {
        console.log(html)
        this.setState({
            html
        })
    }
    saveBulletin = (formData) => {
        let _this = this;
        this.setState({
            _loading: true
        })
        api.ajax("POST", "@/message/ecNews/save", {
            // uuids: this.bulletinInfo.uuids,
            ...formData
        }).then(r => {
            if (r.msg === "请求成功") {
                Util.alert('发布成功', { type: 'success' });
                setTimeout(() => {
                    this.props.history.push('/websiteBulletin/websiteBulletin');
                }, 900)
                return
            }

            Util.alert(r.msg, { type: 'error' });

        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
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
            this.saveBulletin({ ...values, content: this.state.html });
        })
    }
    handleCancel = () => {
        this.props.onCancel();
    }

    /**
     * 预览
     */
    handleView = () =>{
        let formData = this.props.form.getFieldsValue();
        formData.content = this.state.html;
        console.log('处理查看 handleView ------------------------ ', formData)

        this.setState({
            formData: formData,
            detailsVisible: true,
        })
    }

    closeDetailsModal=()=>{
        this.setState({
            detailsVisible: false
        })
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }
        const { getFieldProps } = this.props.form;
        return (
            <div>
                <Card bordered={false}>
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
                            <WangEditor initHtml={this.state.html} onChange={this.editChange} uplodImg={true}></WangEditor>
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="center">
                                <Col span={1}>
                                    <Button size="large" onClick={this.handleOk} type="primary">发布</Button>
                                </Col>
                                <Col span={2}>
                                    <Button size="large" onClick={this.handleView} >查看</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Card>
                <DetailsView visible={this.state.detailsVisible} formData={this.state.formData} closeDetailsModal={this.closeDetailsModal}/>
            </div>

        )
    }
}

export default Form.create()(ModalFormComponent);