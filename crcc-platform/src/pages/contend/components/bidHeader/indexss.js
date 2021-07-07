import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import less from './index.less';

class BidHeader extends Component {
  render() {
    // console.log(less);
    return (
      <div>
        <Card>
          <h1 className={less.bid_header_title}>xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单xxxx采购单</h1>
          <Row>
            <Col span={9}>
              <div className={less.bid_header_left}>
                <div>
                  <span>采购单位:</span>
                  <p>中铁十八局集团第二工程有限公司</p>
                </div>
                <div>
                  <span>采购部门:</span>
                  <p>部门一</p>
                </div>
                <div>
                  <span>竞价单号:</span>
                  <p>JJ89778</p>
                </div>
                <div>
                  <span>竞价分类:</span>
                  <p>五金工具</p>
                </div>
                <div>
                  <span>应用领域:</span>
                  <p>桥梁工程</p>
                </div>
                <div>
                  <span>竞价类型:</span>
                  <p>现货/标准品</p>
                </div>
                <div>
                  <span>竞价联系人:</span>
                  <p>于一(18673627289)</p>
                </div>
                <div>
                  <span>择标人:</span>
                  <p>于一(18673627289)</p>
                </div>
              </div>
            </Col>
            <Col span={9}>
              <div className={less.bid_header_mid}>
                <ul className={less.bid_state}>
                  <span>竞价状态</span>
                  <span className={less.large} style={this.props.color ? this.props.color : {}}>{this.props.bidState ? this.props.bidState : '已完成'}</span>
                </ul>

                <div>
                  <div>
                    <span>竞价方式:</span>
                    <p>公开竞价/邀请竞价</p>
                  </div>
                  <div>
                    <span>竞价发布日期:</span>
                    <p>2020年2月20日16:33:20</p>
                  </div>
                  <div>
                    <span>报名截止日期:</span>
                    <p>2020年2月20日16:33:20</p>
                  </div>
                  <div>
                    <span>竞价开始日期:</span>
                    <p>2020年2月20日16:33:20</p>
                  </div>
                  <div>
                    <span>竞价截止日期:</span>
                    <p>2020年2月20日16:33:20</p>
                  </div>
                  <div>
                    <span>中标日期:</span>
                    <p>2020年2月20日16:33:20</p>
                  </div>
                </div>

              </div>
            </Col>
            <Col span={6}>
              <div className={less.bid_header_right}>
                <span>采购员</span>
                <h2>于一（18514571273)</h2>
              </div>
            </Col>

          </Row>
        </Card>
      </div>
    );
  }
}

export default BidHeader;