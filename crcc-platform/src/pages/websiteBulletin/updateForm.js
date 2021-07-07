import { Modal, Form, Button, Row, Col,InputNumber } from 'antd';
import BaseDetails from '@/components/baseDetails'
import Input from "@/components/baseInput";
import api from "@/framework/axios";
import Util from "@/utils/util";

const FormItem = Form.Item;

class updateForm extends React.Component {


    state = {
    }
    handleCancel = () => {
        this.props.onCancel();
    }

    handelSubmit = () => {
        let fieldsValue = this.props.form.getFieldsValue();
        fieldsValue.uuids=this.props.info.uuids;
        console.log(fieldsValue)
        api.ajax("POST", "@/message/ecNews/saveHelpClass", {
            // uuids: this.bulletinInfo.uuids,
            ...fieldsValue
        }).then(r => {
            if (r.msg === "请求成功") {
                Util.alert('修改成功', { type: 'success' });
                this.handleCancel();
                location.reload();
                return
            }
            Util.alert(r.msg, { type: 'error' });

        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
        })
    }




    render() {
        const { getFieldProps } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        let _title=this.props.info.title;
        let _sort=this.props.info.sort;

        return (
            <Modal
                title="修改"
                wrapClassName="vertical-center-modal"
                visible={this.props.visible}
                onCancel={this.handleCancel}
                footer={<Button type="primary" onClick={this.handelSubmit}>保存</Button>}>

                <Form horizontal>
                    <Row>
                        <Col >
                            <FormItem label={'分类标题'}
                                      labelCol={{ span: 4 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <Input
                                    // placeholder={this.props.info.title}
                                    {...getFieldProps('title',{ initialValue: _title },
                                        {
                                            rules: [
                                                {required: true, message: '请输入分类标题'},
                                                {max: 20, message: '请输入少于20个字符'},
                                            ],
                                        }
                                    )}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <FormItem label={'排序'}
                                      labelCol={{ span: 4 }}
                                      wrapperCol={{ span: 18 }}
                            >
                                <InputNumber
                                    // placeholder={'请输入分类标题'}
                                    {...getFieldProps('sort',{ initialValue:_sort },
                                        {
                                        rules: [
                                            { required: true, message: '请输入数字' },

                                        ],

                                    })}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default Form.create({})(updateForm)
