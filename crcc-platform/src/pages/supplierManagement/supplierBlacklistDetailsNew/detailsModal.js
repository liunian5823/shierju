import { Card, Row, Col, Modal } from 'antd';
import api from '@/framework/axios';
import BaseDetails from '@/components/baseDetails';

class ModalFormComponent extends React.Component {
  _isUpdate = false;

  componentDidUpdate() {
    if (this._isUpdate != this.props.visible) {
      this._isUpdate = this.props.visible;
      // this.props.form.resetFields();
    }
  }
  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    return (
      <Modal
        title="详情"
        wrapClassName="vertical-center-modal"
        width={1200}
        visible={this.props.visible}
        onCancel={this.handleCancel}
        footer={<span></span>}
      >
        <Card bordered={false}>
          <Row>
            <Col span={14}>
              <BaseDetails title="操作时间">
                {moment(this.props.info.createTime).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </BaseDetails>
            </Col>
            <Col span={10}>
              <BaseDetails title="处理人">
                {this.props.info.processingPerson}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <BaseDetails title="处理结果">
                {this.props.info.effective == '1'
                  ? '失效'
                  : this.props.info.effective == '0'
                  ? '已拉黑'
                  : '未拉黑'}
              </BaseDetails>
            </Col>
            <Col span={10}>
              <BaseDetails title="来源">
                {this.props.info.souce == '1' ? '铁建商城' : '股份公司'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <BaseDetails title="评级">
                {this.props.info.rating == '0'
                  ? '黑'
                  : this.props.info.rating == '1'
                  ? '灰'
                  : '黄'}
              </BaseDetails>
            </Col>
            <Col span={10}>
              <BaseDetails title="上报单位">
                {this.props.info.reportingCompany}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <BaseDetails title="区域">{this.props.info.area}</BaseDetails>
            </Col>
            <Col span={10}>
              <BaseDetails title="发布年份">
                {this.props.info.yearPublished}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <BaseDetails title="省份">{this.props.info.province}</BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="所在地">
                {this.props.info.address}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="案情简述">
                {this.props.info.remarks}
              </BaseDetails>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}

export default ModalFormComponent;
