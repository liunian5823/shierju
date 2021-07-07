import {Select,Card,Form,Row,Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,message,Modal,DatePicker,Tabs,Checkbox,Pagination,Popconfirm,Switch,Spin} from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import less from './index.less'
import './supplyContractTemplate.css';

const FormItem = Form.Item;
class SupplyContractTemplateModal extends React.Component {

    state = {
        id:"",
        supplierUserShowPhone:"",
        sendObtainCodeButtonHTML:"获取验证码",
        // 提现供应商管理员电话
        supplierUserPhone:"",
        sendObtainCodeButton:true,
        phoneObtainCodePlaceholder:"请先获取验证码",
    }

    componentWillMount() {
    }
    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps){
        console.log();
        if(!this.props.visble&& nextProps.visble){
            this.props.form.resetFields();
            this.setState({
                id:nextProps.id
            })
            this.querySupplierUserPhone();
        }
    };

    handelSubmit = () => {
        let that = this;
        //直接ajax提交
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                that.saveLoading = false;
                return;
            }else{
                if(that.saveLoading){
                    return
                }
                that.saveLoading = true;

                //短信验证 绑卡手机号
                let checkPhone = that.state.supplierUserPhone;
                let scene = "INVALID_CONTRACT";
                that.provingPhoneMsg(that.props.form.getFieldValue("obtainPhoneYzm"), checkPhone, scene).then(function(r){
                    /*let r = true;*/
                    debugger
                    if(r.data){

                        api.ajax('GET', '!!/common/contractTemplate/updateContractTemplateToVoid', {
                            id:that.state.id,
                            approvalReason:values.approvalReason
                        }).then((r, err) => {
                            if (r.data >= 0) {
                                that.props.callback();
                                message.success('操作成功');
                                that.props.form.resetFields();
                                that.saveLoading = false;
                            } else {
                                message.error('操作失败');
                                that.saveLoading = false;
                            }
                        });
                    } else {
                        message.error('短信验证码错误,请重新填写');
                        that.saveLoading = false;
                    }
                });
            }
        });
    }

    // 查询当前操作人电话
    querySupplierUserPhone=()=>{
        let _this = this;
        api.ajax('GET', '!!/common/contractTemplate/currentOperatorTelephone', {
        }).then((r, err) => {
            if (r.data) {
                _this.setState({
                    supplierUserPhone:r.data.supplierUserPhone,
                    supplierUserShowPhone:r.data.supplierUserShowPhone
                });
            } else {
                message.error('查询当前操作人电话失败');
            }
        });
    }

    //短信码验证
    provingPhoneMsg=(code, phone, scene)=>{
        return new Promise((resolve, reject)=> {
            api.ajax('GET', '!!/common/phoneMsg/provingPhoneMsg', {
                    phone : phone,
                    code : code,
                    scene :scene
            }).then(r => {
                resolve(r);
            })
        })
    }

    // 提现 发送手机验证码
    sendObtainPhoneCode=()=>{
        let _this = this;
        const params = {};
        let scene = 'INVALID_CONTRACT';
        let phone = this.state.supplierUserPhone;
        //发送验证码
        api.ajax('GET', '!!/common/phoneMsg/sendSimpleSms', {
            scene,phone
        }).then((r, err) => {
            _this.setState({
                sendObtainCodeButton : false,
                sendObtainCodeButtonHTML : "验证码(60s)",
                phoneObtainCodePlaceholder:"已发送至 "+this.state.supplierUserShowPhone+" 的手机"
            })
            _this.setObtainIntervalTime(this);
            message.success("短信验证码已发送");
            _this.props.form.resetFields(["obtainPhoneYzm"]);
        });
    }

    //提现 验证码倒计时
    setObtainIntervalTime = (that)=>{
        //获取验证码倒计时
        let intervalTime = 60;
        let interval = setInterval(function(){
            let time = intervalTime;
            if(time == 1){
                that.setState({
                    sendObtainCodeButton : true,
                    sendObtainCodeButtonHTML : "获取验证码"
                })
                clearInterval(interval);
            }else{
                intervalTime -= 1;
                that.setState({
                    sendObtainCodeButton : false,
                    sendObtainCodeButtonHTML : "验证码("+intervalTime+"s)"
                })
            }
        }, 1000)
        this.setState({
            interval:interval
        })
    }

    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }

        return (
            <Modal
                title="作废理由"
                visible={this.props.visble}
                onOk={this.handelSubmit}
                onCancel={this.props.onClose}
                wrapClassName="vertical-center-modal"
            >
                <Form horizontal>
                    <Row gutter={16}>
                        <Col span="22">

                            <FormItem label={'手机号'}
                                      required
                                      {...formItemLayout}
                            >
                                <Row>
                                    <Col span={24}>
                                        <FormItem>
                                            <Input disabled
                                                   {...getFieldProps(`obtainPhone`, {
                                                       initialValue:this.state.supplierUserShowPhone,
                                                   })}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label={'验证码'}
                                      required
                                      {...formItemLayout}
                            >
                                <Row>
                                    <Col span={24}>
                                        <FormItem>
                                            <Input style={{width:"228px"}} placeholder={this.state.phoneObtainCodePlaceholder}
                                                   {...getFieldProps('obtainPhoneYzm', {
                                                       validateTrigger:"",
                                                       rules: [
                                                           {required: true, message: '请输入短信验证码' }
                                                       ]
                                                   })} />
                                            <Button type="primary" disabled={this.state.sendObtainCodeButton?false:true}
                                                    onClick={this.sendObtainPhoneCode} className="obtainPhoneYzmUnBindBtnCss">
                                                {this.state.sendObtainCodeButtonHTML}</Button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label={'作废理由'}
                                      required
                                      {...formItemLayout}
                            >
                                <Row>
                                    <Col span={24}>
                                        <FormItem>
                                            <Input maxLength={255} {...getFieldProps('approvalReason', {
                                                rules: [
                                                    { required: true, message: '请输入作废理由' },
                                                ],
                                            })} type="textarea" placeholder="请输入作废理由" autosize={{ minRows: 2, maxRows: 6 }} />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </FormItem>

                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
export default Form.create({})(SupplyContractTemplateModal)