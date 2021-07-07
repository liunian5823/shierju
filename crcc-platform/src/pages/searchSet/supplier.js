import {
    Card,
    Form,
    Button,
    Select,
    Radio,
    Modal
} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';

import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';

import React from "react";



const FormItem = Form.Item;


class SupplierSearchSet extends React.Component {
    state = {
        loading: false,
        submitFlag:false,
        visible:false,
    }

    handleGoBack = () => {
        this.props.history.goBack()
    }

    submitData=()=>{
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if(errors){
                Util.alert("请完善内容");
                return
            }
            let url = "@/catalogue/supplierYellowSolr/addSupplierSolrById";
            let msgError = "重置失败";
            if(this.state.submitFlag){
                Util.alert("请不要重复提交");
                return false;
            }
            this.state.submitFlag = true;
            api.ajax("GET", url, values).then(r => {
                this.state.submitFlag = false;
                Util.alert("重置成功");
            }).catch(r => {
                this.state.submitFlag = false;
                Util.alert(msgError);
            })
        });
    }

    updateAll=()=>{
        let url = "@/catalogue/supplierYellowSolr/addSupplierSolrById";
        let msgError = "重置失败";
        if(this.state.submitFlag){
            Util.alert("请不要重复提交");
            return false;
        }
        this.state.submitFlag = true;
        api.ajax("GET", url).then(r => {
            this.state.submitFlag = false;
            Util.alert("重置成功");
            this.setState({
                visible: false
            });
        }).catch(r => {
            this.state.submitFlag = false;
            Util.alert(msgError);
            this.setState({
                visible: false
            });
        })
    }

    showModal=()=>{
        this.setState({
            visible: true
        });
    }

    handleCancel=()=>{
        this.setState({
            visible: false
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
                    <Card title={<div className="xiugaibt">重置供应商索引</div>}	bordered={false} className="minheight">
                        <FormItem {...formItemLayout} label="开始ID：" required>
                            <Input type="text" maxLength='10'
                                   placeholder="请填写供应商开始ID"
                                   {...getFieldProps('idStart',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请填写供应商开始ID"
                                               }
                                           ],
                                       })} />

                        </FormItem>
                        <FormItem {...formItemLayout} label="结束ID">
                            <Input maxLength='10'
                                   placeholder="请填写供应商结束ID"
                                   {...getFieldProps('idEnd',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请填写供应商结束ID"
                                               }
                                           ],
                                       })} />
                        </FormItem>
                    </Card>
                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                                onClick={this.handleGoBack}>返回</Button>
                        <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading} onClick={this.submitData}>提交</Button>

                        <Button type="primary" style={{ marginRight: "10px" }} onClick={this.showModal}>全部更新</Button>
                    </BaseAffix>
                </Form>
                <Modal title="全部更新" visible={this.state.visible}
                       onOk={this.updateAll} onCancel={this.handleCancel}>
                    <p>是否确定更新全部供应商索引？执行该操作前先将供应商索引清空！！该功能需要长时间等待！！</p>
                </Modal>
            </div>


        )
    }
}
export default Form.create()(SupplierSearchSet);