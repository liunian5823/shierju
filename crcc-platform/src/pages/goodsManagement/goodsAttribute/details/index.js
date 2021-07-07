import {
    Card,
    Form,
    Button,
    Select,
    Radio,
    Row,
    Col,
    DatePicker,
    Checkbox,
    Table,
    Badge,
    Modal,
    Alert,
    Icon, InputNumber,
    CheckboxGroup
} from 'antd';
// import PrintProvider  from 'react-easy-print';
import api from '@/framework/axios';
import Util from '@/utils/util';

import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';

import './index.less';
import React from "react";



const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;


class GoodsAttitudeDetails extends React.Component {
    state = {
        loading: false,
        id:0,
        isModify:true,
        name:"",
        remark:"",
        type:0,
        searchSign:1,
        skuSign:1,
        sort:1,
        ifSystem:1,
        uuid:0,
        uuids:"",
        submitFlag:false,
    }
    _isMounted = false;


    componentWillMount() {
        this._isMounted = true;
        this.state.id = this.props.match.params.uuids;
        if(this.state.id != "addGoodsAttitude"){
            //测试用
            // //初始化
            // this.setState({
            //     name:"测试",
            //     remark:"测试",
            //     type:3,
            //     searchSgin:1,
            //     skuSign:1,
            //     sort:1,
            // });
            this.getPageData();
        }
        else{
            this.state.isModify = false;
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleGoBack = () => {
        this.props.history.goBack()
    }
    getPageData = (flag=null) => {
        let _this = this;
        let param = {};

        if(!flag){
            param.uuid = this.state.id;
        }
        api.ajax("GET", "@/merchandise/ecGoodsProperty/page", param).then(r => {
            if (!_this._isMounted) {
                return;
            }
            if(r.data.rows.length>0)
            this.setState(r.data.rows[0]);
        })

    }

    onChange=(event,name,isNumber=null)=>{
        console.log(event.target.value);
        //进行限制
        if(isNumber){
            if(event.target.value){
                // event.target.value = event.target.value.replace(/[^\d]/g,'');
                if (event.target.value.length == 1) {
                    event.target.value = event.target.value.replace(/[^1-9]/g, '');
                } else {
                    event.target.value = event.target.value.replace(/\D/g, '');
                }
                if(event.target.value > 999999999)
                    event.target.value = 999999999
            }
        }
        this.state[name] = event.target.value;
        this.setState(this.state);
    }

    getValueByName=(name)=>{
        return this.state[name];
    }

    submitData=()=>{
        let _this = this;
        this.props.form.validateFieldsAndScroll((errors, values) => {

            if(values.name == ""){
                Util.alert("属性名称不能为空");
                return ;
            }

            let url = "@/merchandise/ecGoodsProperty/saveGoodsProperty";
            //如果是修改
            let msg = "添加成功";
            let msgError = "添加失败";
            if(_this.state.isModify){
                url = "@/merchandise/ecGoodsProperty/updateGoodsProperty";
                msg = "修改成功";
                msgError = "修改失败";
                values.id = _this.state.id;
                values.uuid = _this.state.uuid;
                values.uuids = _this.state.uuids;
            }
            values.ifSystem = 1;
            if(this.state.submitFlag){
                Util.alert("请不要重复提交");
                return false;
            }
            this.state.submitFlag = true;
            api.ajax("POST", url, values).then(r => {
                if (!_this._isMounted) {
                    return;
                }
                this.state.submitFlag = false;
                Util.alert("保存成功");
            }).catch(r => {
                this.state.submitFlag = false;
                Util.alert(msgError);
            })
        });

    }


    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (


            <div >
                <Form>
                    <Card title={<div className="xiugaibt">{this.state.isModify==true?"修改属性":"新增属性"}</div>}	bordered={false} className="minheight">
                        <FormItem {...formItemLayout} label="属性名称：" required>
                            <Input type="text" maxLength='10'
                                   placeholder="请填写常用的商品属性的名称；例如：颜色；尺寸等"
                                   {...getFieldProps('name',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请填写常用的商品属性的名称；例如：颜色；尺寸等"
                                               }
                                           ],

                                           onChange:(event)=>{
                                               this.onChange(event,"name");
                                           },
                                           initialValue:this.state.name,
                                       })} />

                        </FormItem>
                        <FormItem {...formItemLayout} label="排序：">
                            <Input maxLength='5'
                                    placeholder="请填写整数，类型列表将会根据排序进行由小到大排列显示(最大长度为5位数)"
                                    {...getFieldProps('sort',
                                        {
                                            onChange:(event)=>{
                                                this.onChange(event,"sort",true);
                                            },
                                            initialValue:this.state.sort+"",
                                        })} />
                        </FormItem>


                        <FormItem {...formItemLayout} label="SKU属性标识：">
                            <RadioGroup
                                disabled={false}
                                {...getFieldProps('skuSign',
                                    {
                                        onChange:(event)=>{
                                            this.onChange(event,"skuSign");
                                        },
                                        initialValue:this.state.skuSign,
                                    })} >
                                <Radio key="a" value={1}>是</Radio>
                                <Radio key="b" value={0}>否</Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem {...formItemLayout} label="搜索属性标识：">
                            <RadioGroup
                                disabled={false}
                                {...getFieldProps('searchSign',
                                    {
                                        onChange:(event)=>{
                                            this.onChange(event,"searchSign");
                                        },
                                        initialValue:this.state.searchSign,
                                    })} >
                                <Radio key="a" value={1}>是</Radio>
                                <Radio key="b" value={0}>否</Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem {...formItemLayout} label="类型：">
                            <RadioGroup
                                disabled={false}
                                {...getFieldProps('type',
                                    {
                                        onChange:(event)=>{
                                            this.onChange(event,"type");
                                        },
                                        initialValue:this.state.type,
                                    })} >
                                <Radio key="a" value={0}>文本</Radio>
                                <Radio key="b" value={1}>多选</Radio>
                                <Radio key="c" value={2}>单选</Radio>
                                <Radio key="d" value={3}>下拉</Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem {...formItemLayout} label="备注：">
                            <Input type="textarea" id="control-textarea" maxLength='400' rows={5}
                                   {...getFieldProps('remark',
                                       {
                                           onChange:(event)=>{
                                               this.onChange(event,"remark");
                                           },
                                           initialValue:this.state.remark,
                                       })} />
                        </FormItem>



                    </Card>

                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                                onClick={this.handleGoBack}>返回</Button>
                        <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading} onClick={this.submitData}>提交</Button>
                    </BaseAffix>
                </Form>
            </div>


        )
    }
}
export default Form.create()(GoodsAttitudeDetails);