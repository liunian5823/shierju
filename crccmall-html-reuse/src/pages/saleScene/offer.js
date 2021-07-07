import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Card, Row, Col, Tabs, Button, Table, Icon, Modal, Form, Input, Select, Spin } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
import { baseService } from '@/utils/common';
import less from './offer.less';
import FormatDate from '@/utils/date';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import { closeWin } from '@/utils/dom';
import { getSearchByHistory } from '@/utils/urlUtils';
import ToggleTable from '@/components/toggleTable';
import download from "business/isViewDown";
//竞价状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;
//流标理由
const _FAILGROUP = baseService.failGroup;

class SaleSceneOffer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bidData: {},
            offerList: [],
            amt: 0,
            statis: null,
        }
    }
    _uuids = null
    _offerId = null
    componentWillMount() {
        this.handleInit()
    }
    //查看报价
    offerListCols = [
        {
            title: '商品类别',
            key: 'classifyName',
            dataIndex: 'classifyName',
            width: 100,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料编码',
            key: 'goodsCodeSect',
            dataIndex: 'goodsCodeSect',
            width: 100,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>{text || '--'}</div>
            }
        },
        {
            title: '物料名称',
            key: 'goodsName',
            dataIndex: 'goodsName',
            width: 100,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>{text || '--'}</div>
            }
        },
        {
            title: '规格',
            key: 'spec',
            dataIndex: 'spec',
            width: 100,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>{text || '--'}</div>
            }
        },
        {
            title: '品牌',
            key: 'brand',
            dataIndex: 'brand',
            width: 100,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>{text || '--'}</div>
            }
        },
        {
            title: '物料描述',
            key: 'desc',
            dataIndex: 'desc',
            width: 100,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>{text || '--'}</div>
            }
        },
        {
            title: '质量状况',
            key: 'quality',
            dataIndex: 'quality',
            width: 100,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '附件',
            key: 'fileName',
            dataIndex: 'fileName',
            width: 100,
            className: 'text_line4_td',
            render: (text, record, index) => (
                text ? <span>
                    <a className="color_a"
                        href="javascript:void(0);"
                        onClick={() => download(record.fileName, systemConfigPath.fileDown(record.filePath), true)}
                    >{text}</a>
                </span> : '无'
            )
        },
        {
            title: '销售数量(单位)',
            key: 'num',
            dataIndex: 'num',
            fixed: 'right',
            className: 'text_right text_line1_td',
            width: 120,
            render: (text, record, index) => {
                text = text ? text + '/' + record.unit : '--'
                return <span className="reuse_money" title={text}>{text}</span>
            }
        },
        {
            title: '单价(元)',
            key: 'price',
            dataIndex: 'price',
            className: 'text_right text_line1_td',
            fixed: 'right',
            width: 100,
            render: (text, record, index) => {
                text = numeral(text || 0).format('0,0.00')
                return <span className="reuse_money" title={text}>{text}</span>
            }
        },
        {
            title: '金额(元)',
            key: 'sumAmt',
            fixed: 'right',
            className: 'text_right text_line1_td',
            dataIndex: 'sumAmt',
            width: 100,
            render: (text, record, index) => {
                text = numeral(text || 0).format('0,0.00')
                return <span className="reuse_money" title={text}>{text}</span>
            }
        },
    ]
    //初始
    handleInit = () => {
        const search = this.props.history.location.search;
        if (search) {
            let params = getSearchByHistory(search);
            if (params.offerId) {
                this._offerId = params.offerId
            }
        }
        this._uuids = this.props.match.params.uuids;
        this.getSceneInfo(this._uuids, this._offerId)
        // if(this._uuids && this._offerId) {
        //     this.getSceneInfo(this._uuids, this._offerId)
        // }
    }
    //获取页面数据
    getSceneInfo = (uuids, offerId) => {
        let params = {
            sceneId: uuids,
        }
        if (offerId) {
            params.offerId = offerId
        }
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/sceneOfferDetail/findList', params).then(res => {
            if (res.data) {
                this.setState({
                    spinning: false,
                    bidData: res.data.scene || {},
                    offerList: res.data.data || [],
                    statis: res.data.statis || null,
                    amt: res.data.sumAmt
                })
            }
        })
        // api.ajax('GET', '@/reuse/sceneOffer/info', params).then(res => {
        //     if(res.data) {
        //         // this.setState({
        //         //     spinning: false,
        //         //     bidData: res.data.scene || {},
        //         //     offerList: res.data.data || [],
        //         //     amt: res.data.sumAmt
        //         // })
        //         console.log(res.data);
        //     }
        // })
    }

    //场次基本信息
    createSceneInfo = () => {
        const { bidData } = this.state;
        const span = [3, 20];
        let statusStyle = {};
        if (bidData.status) {
            statusStyle = _MAINBIDOBJ[bidData.status].style;
        }

        return (
            <div className={less.info}>
                <Row className={less.title}>
                    <Col span={20}>
                        <p className={less.title_text} style={{ wordBreak: 'break-all' }}>{bidData.title}</p>
                    </Col>
                    <Col span={4}>
                        <div className={less.title_status}>
                            <p className={less.main} style={statusStyle}>{bidData.statusStr}</p>
                            <p className={less.note}>{bidData.childStatusStr}</p>
                        </div>
                    </Col>
                </Row>
                {/*<Row className="reuse_row">*/}
                {/*    <Col className="reuse_label" span={span[0]}>竞价标题</Col>*/}
                {/*    <Col className="reuse_value" span={span[1]}>{bidData.title || '----'}</Col>*/}
                {/*</Row>*/}
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价编号</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.code || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售单位</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.saleCompanyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售项目部</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.saleDeptName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售对象</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.saleTargetStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>发布人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.createUserName || '--'}</span>
                        <span className='ml10'>{bidData.createUserTel || '--'}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价分类</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.classifyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>应用领域</Col>
                    <Col className="reuse_value" span={span[1]}>{this.filterUseArea(bidData.useArea) || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价联系人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span style={{ marginRight: '10px' }}>{bidData.contacts || '--'}</span>
                        <span>{bidData.contactsTel || '--'}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>允许看货期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.khStartTime || '--'}</span>
                        <span style={{ margin: '0 10px' }}>-</span>
                        <span>{bidData.khEndTime || '--'}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>报名截止日期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {
                            bidData.status > 30
                                ? <span>{bidData.signEndTime}&nbsp;已截止</span>
                                : <span>
                                    <span>{bidData.signEndTime}</span>
                                    <span className="ml20">
                                        {bidData.signEndTimeStr}
                                    </span>
                                </span>
                        }
                        <span className="reuse_tip ml20">采购商无法在此时间后报名参与竞价，已报名采购商可继续在竞价开始日期前缴纳保证金</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价开始日期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.offerStartTime || '--'}</span>
                        <span className="reuse_tip ml20">竞价开始时采购未缴纳保证金或销售方未确认保证金到账视为报名无效，无法参与竞价</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价截止日期</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.offerEndTime || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>结束自动延长</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.extend ? '是' : '否'}</span>
                        <span className="reuse_tip ml20">如果竞价结束前2分钟出价，竞价结束时间会自动延时5分钟</span>
                    </Col>
                </Row>
            </div>
        )
    }
    //过滤地域
    filterUseArea = (useArea) => {
        let area = [];
        if (useArea) {
            let areaArr = useArea.split(',');
            baseService.useAreaGroup.forEach(v => {
                if (areaArr.indexOf(v.id) !== -1) {
                    area.push(v.value)
                }
            })
        }
        return area.join(',')
    }

    //竞价要求
    createDemand = () => {
        const detailSpan = [3, 20];
        const { bidData } = this.state;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={detailSpan[0]}>付款方式</Col>
                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.payWayStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={detailSpan[0]}>货品所在地</Col>
                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.provinceName}{bidData.cityName}{bidData.countyName}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={detailSpan[0]}>看货地址</Col>
                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.khAddress || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={detailSpan[0]}>存储方式/时间</Col>
                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.storageWayStr}/{bidData.storageTime}天</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={detailSpan[0]}>付款时间</Col>
                    <Col className="reuse_value" span={detailSpan[1]}>成交后<span className='color_e font14'> {bidData.payTime} </span>天内</Col>
                </Row>
            </div>
        )
    };

    render() {
        let statis = this.state.statis;
        let extra = statis ? <span style={{ fontSize: '16px' }}>
            共<span className="color_e"> {statis.sumNum ? statis.sumNum : 0} </span>次&nbsp;
            当前为第<span className="color_e"> {statis.rowNo ? statis.rowNo : 0} </span>次&nbsp;&nbsp;
            出价时间<span className="color_e"> {moment(statis.offerTime ? statis.offerTime : 0).format('YYYY-MM-DD HH:mm:ss')} </span>
        </span> : null;
        return (
            <div className={less.scene_detail}>
                <Spin spinning={this.state.spinning}>
                    <div ref={(ref) => this.refs = ref}>
                        <Card title="场次基本信息" className="mt10">
                            {this.createSceneInfo()}
                        </Card>
                        <Card title="竞价要求" className="mt10">
                            {this.createDemand()}
                        </Card>
                        <Card title="竞价产品" className="mt10" extra={extra} style={{ marginBottom: '90px' }}>
                            <ToggleTable dataSource={this.state.offerList}
                                columns={this.offerListCols}
                                scroll={{ x: 1200 }}
                                pagination={false} />
                            <div className="mt10 mb10 text_r">
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>合计：<span className="color_e bo_25">￥{numeral(this.state.amt || 0).format('0,0.00')}</span>元</span>
                            </div>
                        </Card>
                    </div>
                    <Card className="fixed_button">
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            <Button onClick={closeWin}>关闭</Button>
                        </div>
                    </Card>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(SaleSceneOffer)
