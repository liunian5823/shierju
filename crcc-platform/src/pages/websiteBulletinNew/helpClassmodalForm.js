import { Form, Select, Button, Row, Col, Card } from 'antd';
import Input from '@/components/baseInput';
import WangEditor from '@/components/gaoda/WangEditor'
import Util from '@/utils/util';
import api from "@/framework/axios";
import HelpDetailsView from "../webView/helpDetailView";

const FormItem = Form.Item;
const Option = Select.Option;

class HelpClassmodalForm extends React.Component {
    visible = false;
    state = {
        html: "",
        helpClass:this.props.match.params.helpClass,
        param:{
            helpType:-1,
            newsType:5,
            helpClass:this.props.match.params.helpClass
        },
        selectList: [],
        uuids:this.props.match.params.uuids,
        content:'',
        detailsVisible: false,   //预览弹窗控制
        formData: {},   //当前表单的数据
    }
    componentWillMount() {
        this.selectClass();
        this.getHelpInfo(this.props.match.params.uuids)

    }
    //根据uuids查询信息进行回显
    getHelpInfo = (uuids) => {
        api.ajax("GET", "@/message/ecNews/crccPortal/getInfo", {
            uuids
        }).then(r => {
            // let cone="";
            // this.state.selectList.map((item,index)=>{
            //     if (r.data.helpType==item.id) {
            //         cone= item.title;
            //     }
            // })
            this.props.form.setFieldsValue(r.data);
            this.props.form.setFieldsValue({helpType: r.data.helpType});
            const html=r.data.content;
            this.setState({
                html,
            })
        }).catch(r => {
            Util.alert(r.msg, {type: 'error'})
        })
    }


    //先查询分类信息
    selectClass=()=>{
        let param=this.state.param;
        api.ajax("GET", "@/message/ecNews/page", {
            ...param
        }).then(r => {
            if (r.msg === "请求成功") {
                this.setState({
                    selectList: r.data.rows
                })
            }

        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
        })
    }


    optionsList = () => {
        const options = [];
            this.state.selectList.map((v) => {
                options.push(<Option value={v.id} key={v.id}>{v.title}</Option>)
            });
        return options
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
        formData.newsType=5;
        formData.uuids=this.state.uuids;
        formData.helpClass=this.state.helpClass;
        api.ajax("POST", "@/message/ecNews/save", {
            // uuids: this.bulletinInfo.uuids,
            ...formData
        }).then(r => {
            if (r.msg === "请求成功") {
                Util.alert('保存成功', { type: 'success' });
                if (this.state.helpClass==1){
                    setTimeout(() => {
                        this.props.history.push('/websiteBulletin/HelpCenter/supplier');
                    }, 900)
                }else{
                    setTimeout(() => {
                        this.props.history.push('/websiteBulletin/HelpCenter/buy');
                    }, 900)
                }
            }

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
        if (this.state.helpClass==1){
            setTimeout(() => {
                this.props.history.push('/websiteBulletin/HelpCenter/supplier');
            }, 900)
        }else{
            setTimeout(() => {
                this.props.history.push('/websiteBulletin/HelpCenter/buy');
            }, 900)
        }
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
                            <Input
                                maxLength={60}
                                {...getFieldProps('title', {
                                    rules: [
                                        { required: true, message: '标题不能为空' },
                                        { max:60, message:'字数达到限制'},
                                    ],
                                })} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="信息类型">
                            <Select
                                {...getFieldProps("helpType", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择信息类型"
                                        }
                                    ],
                                })}
                                placeholder="请选择信息类型"
                            >
                                {/*下拉选择*/}
                                {this.optionsList()}
                            </Select>
                        </FormItem>
                        <FormItem {...formItemLayout} label="信息内容">
                            <WangEditor initHtml={this.state.html} onChange={this.editChange} uplodImg={true}></WangEditor>
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="center">
                                <Col span={1}>
                                    <Button size="large" onClick={this.handleCancel} type="primary">返回</Button>
                                </Col>
                                <Col span={1}>
                                    <Button size="large" onClick={this.handleOk} type="primary">发布</Button>
                                </Col>
                                <Col span={1}>
                                    <Button size="large" onClick={this.handleView} >查看</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Card>
                <HelpDetailsView visible={this.state.detailsVisible} formData={this.state.formData} closeDetailsModal={this.closeDetailsModal}/>
            </div>

        )
    }
}
export default Form.create()(HelpClassmodalForm);