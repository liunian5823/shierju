import { Form,Popconfirm, Select, Button,Tooltip, Input, Row, Col, Card,Radio, message } from 'antd';
import WangEditor from '@/components/gaoda/WangEditor'
import Util from '@/utils/util';
import api from "@/framework/axios";
import DetailsView from "../webView/detail";
import BaseAffix from '@/components/baseAffix';
import {systemConfigPath} from "@/utils/config/systemConfig";
import { getUrlByParam, getQueryString } from '@/utils/urlUtils';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ModalFormComponent extends React.Component {
    visible = false;
    _isMounted = false
    state = {
        loading: false,
        html: "",
        detailsVisible: false,   //预览弹窗控制
        formData: {},   //当前表单的数据
        value: 1,
        value2:1,
        preservation:{}
    }


    componentWillMount() {
        this._isMounted = true;
        api.ajax("GET", "@/platform/platformNews/editDrafts", {
            uuids:this.props.match.params.uuids
        }).then(r => {
            if (r.code == 200) {
            }

        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
        })
      }
      componentWillUnmount() {
        this._isMounted = false;
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
        api.ajax("GET", "@/platform/platformNews/release", {
            ...formData
        }).then(r => {
            if (r.code == 200) {
                console.log('666',r)
                Util.alert('发布成功', { type: 'success' });
                setTimeout(() => {
                    this.props.history.push('/websiteBulletin/websiteBulletinNew');
                }, 900)
                return
            }

        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
        })
    }
    handleOk = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            this.saveBulletin({ ...values});
        })
    }
    handleCancel = () => {
        this.props.onCancel();
    }
    onChange=(e)=> {
        console.log('radio checked', e.target.value);
        this.setState({
          value: e.target.value,
        });
      }
      topChange=(e)=> {
        console.log('radio checked', e.target.value);
        this.setState({
          value2: e.target.value,
        });
      }

    /**
     * 预览
     */
    handleView = () =>{
        if(this.state.preservation.uuids){
            let uuids =this.state.preservation.uuids
            let url="/webNewsDetail/"+uuids;
            window.open(systemConfigPath.jumpCrccmallPage(url))
        }else{
            message.error('请先保存后再预览');
        }
        
    }

    goBack = ()=>{
        window.close()
    }

    save = ()=>{
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            this.saveForm({ ...values});
               
        })
        
        
    }
    saveForm = (params) =>{
        api.ajax('GET','@/platform/platformNews/preservation',{
            ...params
        }).then(r=>{
            if(r.code == 200){
                message.success(r.msg);
            }
            this.setState({
                preservation:r.data
            })
           
        }).catch(err=>{
            
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
                        <FormItem {...formItemLayout} label="公告标题">
                            <Input type="text" {...getFieldProps("title", {
                                rules: [
                                    {
                                        required: true,
                                        message: "标题不能为空"
                                    }
                                ]
                            })}></Input>
                        </FormItem>
                        <FormItem {...formItemLayout} label="公告类型">
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
                        <FormItem {...formItemLayout} label="是否展示">
                            <RadioGroup value={this.state.value}
                                {...getFieldProps("showFlag", {
                                    onChange: this.onChange,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择是否展示"
                                        }
                                    ]
                                })}
                                placeholder="请选择是否展示">
                                <Radio key="1" value={1}>展示到前台</Radio>
                                <Radio key="0" value={0}>暂不展示到前台</Radio>
                                
                            </RadioGroup>
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否置顶">
                            <RadioGroup value={this.state.value2}
                                {...getFieldProps("topFlag", {
                                    initialValue: 1,
                                    onChange: this.topChange,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择是否置顶"
                                        }
                                    ]
                                })}
                                placeholder="请选择是否置顶">
                                <Radio key="0" value={0}>不置顶</Radio>
                                <Radio key="1" value={1}>置顶</Radio>
                                
                                
                            </RadioGroup>
                        </FormItem>
                        {this.props.form.getFieldValue('topFlag') == '1' ? (
                            <FormItem {...formItemLayout} label="置顶排序">
                            <Input type="text" {...getFieldProps("sort", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入排序数值"
                                    }
                                ]
                            })}
                            placeholder="请输入排序数值"
                            ></Input>
                        </FormItem>
                        ):''}
                        
                        <FormItem {...formItemLayout} label="公告内容">
                            <WangEditor
                            initHtml={this.state.html}
                            onChange={this.editChange}
                            uplodImg={true}
                            {...getFieldProps("content", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入内容"
                                    }
                                ]
                            })}></WangEditor>
                        </FormItem>

                        {/* <FormItem>
                            <Row type="flex" justify="center">
                                <Col span={1}>
                                    <Button size="large" onClick={this.handleOk} type="primary">发布</Button>
                                </Col>
                                <Col span={2}>
                                    <Button size="large" onClick={this.handleView} >查看</Button>
                                </Col>
                            </Row>
                        </FormItem> */}
                    </Form>
                </Card>
                <BaseAffix>
                    <Button type="ghost" loading={this.state.loading} style={{marginRight: "10px"}} onClick={this.goBack}>关闭</Button>
                    <Tooltip title="保存至草稿箱">
                    <Button type="ghost" loading={this.state.loading} onClick={this.save} style={{marginRight: "10px"}}>保存</Button>
                    </Tooltip>
                    <Button type="ghost" loading={this.state.loading} onClick={this.handleView} style={{marginRight: "10px"}}>预览</Button>
                    <Popconfirm placement="top" title={"您是否确认发布公告"} onConfirm={this.handleOk}>
                        <Button type="primary" loading={this.state.loading} style={{marginRight: "10px"}}>发布</Button>
                    </Popconfirm>
                    
                </BaseAffix>
                <DetailsView visible={this.state.detailsVisible} formData={this.state.formData} closeDetailsModal={this.closeDetailsModal}/>
            </div>

        )
    }
}

export default Form.create()(ModalFormComponent);