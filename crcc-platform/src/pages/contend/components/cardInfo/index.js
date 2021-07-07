
import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import less from './index.less';
class CardInfo extends Component {

  render() {
    const { leftData, rightData, bottomData, width } = this.props
    console.log(leftData);
    const dis=this.props.type&&this.props.type=='bid'?'inline':'inline-block'
    return (
      <div>
        <Card title={ this.props.title ? this.props.title : ''} extra={this.props.extra }>
          <Row>
            <Col span={12}>
              <div className={ less.base_content_left }>
                {leftData ? leftData.map((item, index) => {
                  
                  return (
                    <div key={index}>
                      <span style={width }>{item.title}</span>
                      <p>{item.content}</p>
                    </div>
                  )
                }) : null}
              </div>
            </Col>
            <Col span={12}>
              <div className={ less.base_content_right }>
              {rightData ? rightData.map((item, index) => {
                  return (
                    <div key={index}>
                      <span style={width}>{item.title}</span>
                      <p style={{display: `${dis}`,wordBreak: 'break-all'}}>{item.content}</p>
                    </div>
                  )
                }) : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className= { less.base_content_bottom}>
              {bottomData ? bottomData.map((item, index) => {
                  return (
                    <div key={index}>
                      <span style={width }>{item.title}</span>
                      <p>{item.content}</p>
                    </div>
                  )
                }) : null}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default CardInfo;