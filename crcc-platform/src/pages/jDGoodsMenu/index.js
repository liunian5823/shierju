import { Card, Form, Button, Select, Radio, Modal} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';
import React from "react";

const FormItem = Form.Item;


class JDGoodsMenu extends React.Component {
    state = {
        loading: false,
        submitFlag:false,
        visible:false,
        loading1: false,
    }

    handleGoBack = () => {
        this.props.history.goBack()
    }

    submitData=()=>{
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if(errors){
                Util.alert("填写商品池编号");
                return
            }
            let url = "@/jetty/JDGoodsThird/updateJDGoodsByPools?pools="+values.pools;
            let msgError = "重置失败";
            if(this.state.submitFlag){
                Util.alert("请不要重复提交");
                return false;
            }
            this.state.submitFlag = true;
            api.ajax("POST", url, values).then(r => {
                this.state.submitFlag = false;
                Util.alert("重置成功");
            }).catch(r => {
                this.state.submitFlag = false;
                Util.alert(msgError);
            })
        });
    }

    /**
     * 更新所有京东商品
     * @returns {boolean}
     */
    updateAll=()=>{
        let url = "@/jetty/JDGoodsThird/getJDGoods";
        let msgError = "重置失败";
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

    updateAddress=()=>{
        let url = "@/supplier/companyBaiDuAddress/start";
        let msgError = "更新失败";
        if(this.state.submitFlag){
            Util.alert("请不要重复提交");
            return false;
        }
        this.state.submitFlag = true;
        api.ajax("GET", url).then(r => {
            this.state.submitFlag = false;
            Util.alert("更新成功");
        }).catch(r => {
            this.state.submitFlag = false;
            Util.alert("更新成功");
        })
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
                <Card title={<div className="xiugaibt">更新全部京东商品</div>}	bordered={false} className="minheight">
                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} onClick={this.showModal}>全部更新</Button>
                    </BaseAffix>
                    <Modal title="全部更新" visible={this.state.visible} loading={this.state.loading}
                           onOk={this.updateAll} onCancel={this.handleCancel}>
                        <p>是否确定更新全部的京东商品？该功能需要长时间等待！！</p>
                    </Modal>
                </Card>

                <Form>
                    <Card title={<div className="xiugaibt">更新商品池</div>}	bordered={false} className="minheight">
                        <FormItem {...formItemLayout} label="商品池编号：" required>
                            <Input type="text" maxLength='30'
                                   placeholder="请填写商品池编号"
                                   {...getFieldProps('pools',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请填写商品池编号"
                                               }
                                           ],
                                       })} />
                            <span> 注：多个商品池编号中间使用“,”间隔 </span>

                        </FormItem>
                    </Card>
                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading1} onClick={this.submitData.bind()}>提交</Button>
                    </BaseAffix>
                </Form>
                <Card title={<div className="xiugaibt">更新供应商地址经纬度</div>}	bordered={false} className="minheight">
                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} onClick={this.updateAddress}>更新地址经纬度</Button>
                    </BaseAffix>
                </Card>

            </div>


        )
    }
}
export default Form.create()(JDGoodsMenu);