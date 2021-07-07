import { Card, Form, Button, Select, Radio, Modal} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';
import React from "react";

const FormItem = Form.Item;


class BiddingMenu extends React.Component {
    state = {
        loading: false,
        submitFlag:false,
        visible:false,
        loading1: false,
    }

    handleGoBack = () => {
        this.props.history.goBack()
    }

    /**
     * 同步所有交易用户
     * @returns {boolean}
     */
    updateAll=()=>{
        let url = "@/platform/bidOpen/bidSyncCompany";
        let msgError = "同步失败";
        if(this.state.submitFlag){
            Util.alert("请不要重复提交");
            return false;
        }
        this.state.submitFlag = true;

        this.setState({
            visible: false,
            loading: false
        });

        api.ajax("POST", url).then(r => {
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
    submitData=()=>{
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if(errors){
                Util.alert("填写公司Id");
                return
            }
            let url = "@/platform/bidOpen/bidSyncCompany?pools="+values.pools;
            let msgError = "同步失败";
            if(this.state.submitFlag){
                Util.alert("请不要重复提交");
                return false;
            }
            this.state.submitFlag = true;
            api.ajax("POST", url, values).then(r => {
                this.state.submitFlag = false;
                Util.alert("同步成功");
            }).catch(r => {
                this.state.submitFlag = false;
                Util.alert(msgError);
            })
        });
    }



    showModal=()=>{
        this.setState({
            visible: true,
            loading: true
        });
    }

    handleCancel=()=>{
        this.setState({
            visible: false,
            loading: false
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
                <Card title={<div className="xiugaibt">同步交易用户</div>}	bordered={false} className="minheight">
                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} onClick={this.showModal}>全部同步</Button>
                    </BaseAffix>
                    <Modal title="全部同步" visible={this.state.visible} loading={this.state.loading}
                           onOk={this.updateAll} onCancel={this.handleCancel}>
                        <p>是否确定同步所有发生交易的用户？</p>
                    </Modal>
                </Card>


                <Form>
                    <Card title={<div className="xiugaibt">同步公司用户</div>}	bordered={false} className="minheight">
                        <FormItem {...formItemLayout} label="公司Id：" required>
                            <Input type="text" maxLength='30'
                                   placeholder="请填写公司Id"
                                   {...getFieldProps('pools',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请填写公司Id"
                                               }
                                           ],
                                       })} />
                            <span> 注：多个公司Id中间使用“,”间隔 </span>

                        </FormItem>
                    </Card>
                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading1} onClick={this.submitData.bind()}>提交</Button>
                    </BaseAffix>
                </Form>
            </div>


        )
    }
}
export default Form.create()(BiddingMenu);