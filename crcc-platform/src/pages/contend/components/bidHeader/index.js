import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import less from './index.less';
// import logo from '../../../../static/img/long_term_detail_header.png';
import headerBidTitle from '../../../../static/img/header_bid_title.png';
import headerBidStatus from '../../../../static/img/header_bid_status.png';
import CardInfo from '../cardInfo/index.js';
import util from '../../../../utils/util';

class BidHeader extends Component {
  componentDidMount() {

  }
  makeStatus(status) {
    if (!status) {
      return;
    }
    let tempStatus = '';
    switch (status) {
      case 10:
        tempStatus = '待发布';
        break;
      case 19:
        tempStatus = ['审核中', '(驳回)'];
        break;
      case 20:
        tempStatus = '审核中';
        break;
      case 301:
        tempStatus = ['发布中', '(无需确认)'];
        break;
      case 302:
        tempStatus = ['发布中', '(待确认保证金)'];
        break;
      case 311:
        tempStatus = ['保证金', '(无需确认)'];
        break;
      case 312:
        tempStatus = ['保证金', '(待确认保证金)'];
        break;
      case 32:
        tempStatus = '竞价中';
        break;
      case 33:
        tempStatus = '待择标';
        break;
      case 331:
        tempStatus = '待择标';
        break;
      case 39:
        tempStatus = ['下单中', '(已驳回)'];
        break;
      case 40:
        tempStatus = ['下单中', '(审核中)'];
        break;
      case 50:
        tempStatus = '已完成';
        break;
      case 501:
        tempStatus = '已完成';
        break;
      case 502:
        tempStatus = '已完成';
        break;
      case 503:
        tempStatus = '已完成';
        break;
      case 51:
        tempStatus = ['已完成', '(流标)'];
        break;
      case 60:
        tempStatus = '失效/作废';
        break;
      default:
        break;
    }
    return tempStatus;
  }
  render() {
    let bidInfo = this.props.allInfoData || {};
    let curStatus = this.makeStatus(bidInfo.statusFlag);
    let purchaseType = '--';
    if (bidInfo.purchaseType) {
      switch (bidInfo.purchaseType) {
        case 1:
          purchaseType = '单次采购';
          break;
        case 2:
          purchaseType = '长期协议';
          break;
      }
    }
    const baseInfo = {
      bottomData1: [
        {
          title: '竞价单号:',
          content: bidInfo.sn ? bidInfo.sn : '--'
        },
        {
          title: '采购类型:',
          content: (
              // <span>{purchaseType + '/'}<a href='javascript:;'>{bidInfo.agreementNo ? bidInfo.agreementNo : '--'}</a></span>
              (purchaseType) 
          )
        },
        {
          title: '采购单位:',
          content: bidInfo.companyName ? bidInfo.companyName : '--'
        },
        {
          title: '采购部门:',
          content: bidInfo.organizationName ? bidInfo.organizationName : '--'
        },
        {
          title: '采购员:',
          content: (bidInfo.userName ? bidInfo.userName : '--') + '/' + (bidInfo.purchasePersonPhone ? bidInfo.purchasePersonPhone : '--')
        },
        {
          title: '竞价分类:',
          content: bidInfo.materialsType ? bidInfo.materialsType : '--'
        },
        {
          title: '应用领域:',
          content: bidInfo.majorName ? bidInfo.majorName : '--'
        },
        {
          title: '竞价类型:',
          content: !bidInfo.type ? '--' : bidInfo.type == 1 ? '现货/标准品' : '加工/定制品'
        },
        {
          title: '竞价联系人:',
          content: (bidInfo.contactMan ? bidInfo.contactMan : '--') + '/' + (bidInfo.contactPhone ? bidInfo.contactPhone : '--')
        },
        {
          title: '竞价方式:',
          content: !bidInfo.way ? '--' : bidInfo.way == 1 ? '公开竞价' : '邀请竞价'
        },
        {
          title: '竞价发布日期:',
          content: bidInfo.publishDate ? bidInfo.publishDate : '--'
        },
        {
          title: '报名截止日期:',
          content: bidInfo.applyEndDate ? bidInfo.applyEndDate : '--'
        },
        {
          title: '竞价开始日期:',
          content: bidInfo.startDate ? bidInfo.startDate : '--'
        },
        {
          title: '竞价截止日期:',
          content: bidInfo.endDate ? bidInfo.endDate : '--'
        },
        {
          title: '择标人:',
          content: (bidInfo.selectPeople ? bidInfo.selectPeople : '--') + '/' + (bidInfo.selectPeoplePhone ? bidInfo.selectPeoplePhone : '--')
        },
        {
          title: '中标日期:',
          content: bidInfo.bidDate ? bidInfo.bidDate : '--'
        }
      ],
      bottomData2: [
        {
          title: '报名截止日期:',
          content: (
            <div className={less.bottom_info_container}>
              <span>
                2020-02-20
              </span>
              <span>
                将于
              </span>
              <span className={less.tips_color}>
                1
              </span>
              <span>
                天后截止
              </span>
              <span>
                <span className={less.tips_color}>*</span>
                <span className={less.tips_content}>
                  采购商无法在此时间后报名参与竞价,已报名采购商可继续在竞价开始日期前缴纳保证金。
                </span>
              </span>
            </div>
          )
        },
        {
          title: '竞价开始日期:',
          content: (
            <div className={less.bottom_info_container}>
              <span>
                2019-11-04--15:32
              </span>
              <span>
                <span className={less.tips_color}>*</span>
                <span className={less.tips_content}>
                  采购商无法在此时间后报名参与竞价,已报名采购商可继续在竞价开始日期前缴纳保证金。
                </span>
              </span>
            </div>
          )
        },
        {
          title: '竞价截止日期:',
          content: '2019-11-04--15:32'
        },
        {
          title: '结束自动延长:',
          content: (
            <div className={less.bottom_info_container}>
              <span>
                开启
              </span>
              <span>
                <span className={less.tips_color}>*</span>
                <span className={less.tips_content}>
                  采购商无法在此时间后报名参与竞价,已报名采购商可继续在竞价开始日期前缴纳保证金。
                </span>
              </span>
            </div>
          )
        }
      ]
    }
    return (
      <div className={less.bid_header_container}>
        <Card title='竞价基本信息'>
          <div className={less.bid_header_title}>
            <div className={less.bid_header_title_left}>
              <img src={headerBidTitle} alt="" />
              <h2>{bidInfo.name}</h2>
            </div>
  
          </div>
          <div className={less.bid_header_body}>
            <Row>
              <Col span={20}>
                <CardInfo bottomData={baseInfo.bottomData1} width={{ width: '100px' }} widthP={{ width: '650px' }}></CardInfo>
              </Col>
              <Col span={4}>
              <div className={less.bid_header_title_right}>
              {
                function () {
                  if (curStatus && curStatus instanceof Array) {
                    return (
                      <div>
                        <p><img src={headerBidStatus} alt="" /> <span className={curStatus[0] == '未发布' | curStatus[0] == '失效作废' ? '' : less.res_state}>{curStatus[0]}</span></p>
                        <p>{curStatus[1]}</p>
                      </div>
                    )
                  }
                  return curStatus && <p><img src={headerBidStatus} alt="" /><span className={curStatus[0] == '未发布' | curStatus[0] == '失效作废' ? '' : less.res_state}>{curStatus}</span></p>
                }()
              }
            </div>
              </Col>
            </Row>
            {/* <div>
              {
                baseInfo.bottomData2.map((item, index) => {
                  return (
                    <div key={index} className={less.may_info_data}>
                      <span style={{ width: '100px'}}>{item.title}</span>
                      <div>{item.content}</div>
                    </div>
                  )

                })
              }

            </div> */}

          </div>
        </Card>
      </div>
    );
  }
}

export default BidHeader;