import { message, Modal, Form, Button , Row, Col} from 'antd';
import {NumberFormat} from '@/components/content/Format'
import api from '@/framework/axios';

const FormItem = Form.Item;
class userDetailModalModal extends React.Component {

    state = {
        userDetail:{}
    }

    componentWillReceiveProps (nextProps){
        //每次打开模态框触发:初始化人员详情
        if(!this.props.visible&&nextProps.visible){
            api.ajax("GET", "!!/purchaser/purchaser/getUserDetail",{
                uuids:this.props.data.uuids
            }).then((r) => {
                this.setState({
                    userDetail:r.data
                })
            },(r)=>{
                message.error(r.msg);
            })
        }
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal
                title="查看"
                wrapClassName="vertical-center-modal"
                visible={this.props.visible}
                onCancel={this.handleCancel}
                footer={<Button type="primary" onClick={this.handleCancel}>关闭</Button>}>
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="员工姓名">
                                {this.props.data.username?this.props.data.username:"-"}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="电子邮箱">
                                {this.props.data.email?this.props.data.email:"-"}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="员工性别">
                                {this.props.data.gender==1?"先生":this.props.data.gender==0?"女士":"-"}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="手机号码">
                                {this.props.data.phone?this.props.data.phone:"-"}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={this.state.userDetail.cardType == 0?"身份证号码":this.state.userDetail.cardType == 1?"护照号码":"证件号码"}>
                                {this.state.userDetail.citizenCode?this.state.userDetail.citizenCode:"-"}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="通信地址">
                                {this.state.userDetail.address?this.state.userDetail.address:"-"}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default userDetailModalModal;