import { Modal, Form, Button , Row, Col} from 'antd';
import {NumberFormat} from '@/components/content/Format'
import './index.css';
const FormItem = Form.Item;

class invoiceModal extends React.Component {
    state = {
    }
    handleCancel = () => {
        this.props.onCancel();
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal className="platInvoiceModalCss"
                title="查看"
                wrapClassName="vertical-center-modal"
                visible={this.props.visible}
                onCancel={this.handleCancel}
                footer={<Button type="primary" onClick={this.handleCancel}>关闭</Button>}>
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="发票号">
                                {this.props.info.invNo}
                            </FormItem>
                        </Col>
                        <Col span={12} >
                            <FormItem {...formItemLayout} label="发票抬头">
                                <span className="plat_table_text" title={this.props.info.title}>
                                    {this.props.info.title}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="开具时间">
                                {this.props.info.createTimeStr}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="开票金额">
                                {(this.props.info.amount == undefined || this.props.info.amount == null)?"":<NumberFormat value={this.props.info.amount}/>}元
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="发票税额">
                                {(this.props.info.tax == undefined || this.props.info.tax == null)?"":<NumberFormat value={this.props.info.tax}/>}元
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="税价合计">
                                {(this.props.info.totalTax == undefined || this.props.info.totalTax == null)?"":<NumberFormat value={this.props.info.totalTax}/>}元
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default invoiceModal;