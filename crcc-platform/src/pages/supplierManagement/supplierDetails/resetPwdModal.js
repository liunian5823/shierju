import { Modal, Row, Col } from 'antd';
import BaseDetails from '@/components/baseDetails';

class ResetPwdModal extends React.Component{
  handleOk = () => {
    this.props.onOk();
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  render(){
    return(
      <Modal
        title='重置密码'
        wrapClassName="vertical-center-modal"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText='重置'>
        <Row gutter={16}>
          <Col span={20}>
            <BaseDetails title='公司名称'>
              {this.props.info.companyName}
            </BaseDetails> 
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={20}>
            <BaseDetails title='姓名'>
              {this.props.info.name}
            </BaseDetails>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={20}>
            <BaseDetails title='手机号'>
              {this.props.info.phone}
            </BaseDetails>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={20}>
            <BaseDetails title='邮箱'>
              {this.props.info.email}
            </BaseDetails>
          </Col>
        </Row>
      </Modal>
    )
  }
}
export default ResetPwdModal