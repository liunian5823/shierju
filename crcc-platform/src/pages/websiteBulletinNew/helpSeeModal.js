import { Modal, Form, Button, Row, Col } from 'antd';
import BaseDetails from '@/components/baseDetails'

const FormItem = Form.Item;

class seeModal extends React.Component {
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
            <Modal
                title="查看"
                wrapClassName="vertical-center-modal"
                visible={this.props.visible}
                onCancel={this.handleCancel}
                footer={<Button type="primary" onClick={this.handleCancel}>关闭</Button>}>
                <Row gutter={16}>
                    <Col span={12}>
                        <BaseDetails title="信息标题" >
                            {this.props.info.title}
                        </BaseDetails>
                    </Col>
                    <Col span={12}>
                        <BaseDetails title="信息类型" >
                            帮助中心
                        </BaseDetails>
                    </Col>
                    <Col span={12}>
                        <BaseDetails title="发布人" >
                            {this.props.info.releaseName}
                        </BaseDetails>
                    </Col>
                    <Col span={12}>
                        <BaseDetails title="发布时间" >
                            {moment(this.props.info.newsTime).format('YYYY-MM-DD HH:mm')}
                        </BaseDetails>
                    </Col>
                    <Col span={24}>
                        <BaseDetails title="信息内容" >
                            <div dangerouslySetInnerHTML={{ __html: this.props.info.content }} />
                        </BaseDetails>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default seeModal;