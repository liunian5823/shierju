
import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import less from './index.less';
class BidInfo extends Component {

  render() {

    let leftChildren = [];
    let rightChildren = [];
    let bottomChildren = [];
    if (this.props.children && !(this.props.children instanceof Array)) {
      bottomChildren.push(this.props.children);
    }
    if (this.props.children instanceof Array) {
      this.props.children.forEach( (item) => {
        if (item.props.position === 'left') {
          leftChildren.push(item);
        }
        if (item.props.position === 'right') {
          rightChildren.push(item);
        }      
        if (item.props.position === 'bottom') {
          bottomChildren.push(item);
        }
      });
    }

    return (
      <div className={this.props.className || '' }>
        <Card title={ this.props.title ? this.props.title : ''} extra={this.props.extra}>
          <Row>
            <Col span={12}>
              <div className={ less.base_content_left }>
                { leftChildren.length > 0 ? leftChildren : ''}
              </div>
            </Col>
            <Col span={12}>
              <div className={ less.base_content_right }>
                { rightChildren.length > 0 ? rightChildren : ''}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={ less.base_content_bottom }>
                { bottomChildren.length > 0 ? bottomChildren : ''}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default BidInfo;