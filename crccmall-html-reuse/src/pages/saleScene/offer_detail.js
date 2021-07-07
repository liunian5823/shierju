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

function toFixed(num, d) {
    if (!num) { return '0.00' }
    var s = num + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 0) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return num + "";
}
//竞价状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;
//流标理由
const _FAILGROUP = baseService.failGroup;

function getDuration(my_time) {
    var days = my_time / 1000 / 60 / 60 / 24;
    var daysRound = Math.floor(days);
    var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
    var hoursRound = Math.floor(hours);
    var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
    var minutesRound = Math.floor(minutes);
    var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    var time = daysRound + '天' + hoursRound + '小时' + minutesRound + '分' + Math.ceil(seconds) + '秒'
    return time;
}

class SaleSceneOffer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            signPurchaserList: [],
            systemTime: null,//系统时间
            waste_time: '',
            sceneCountDownText: '',
            spinning: false,
            bidData: {
                goodsList: [],
                fileList: []
            },
            offerData: {
                fileList: [],
                offerList: []
            },
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
            render: text => {
                return <div title={text}>{text || '--'}</div>
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

    //场次倒计时
    setSceneCountDown = (s, e) => {
        if (this.sceneCountDownTimer) this.sceneCountDownTimer = null;
        if (!s || !e) return;
        let that = this;
        let start = new Date(s).getTime();
        let end = new Date(e).getTime();
        let systemTime = this.state.systemTime;

        this.sceneCountDownTimer = setInterval(() => {
            if (!systemTime) {
                systemTime = this.state.systemTime;
                return;
            }
            systemTime += 1000;
            let text = '';

            if (systemTime <= start) {
                text = '距离场次开始：' + FormatDate.formatTimeCountDown(start - systemTime).text;
            } else if (systemTime > start && systemTime <= end) {
                text = '距离场次结束：' + FormatDate.formatTimeCountDown(end - systemTime).text;
            } else if (systemTime > end) {
                text = '场次已结束'
            }
            that.setState({
                sceneCountDownText: text
            })

            if (systemTime > end) {
                this.clearSceneCountDown()
            }
        }, 1000)
    }
    //清除场次倒计时
    clearSceneCountDown = () => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
    }

    //获取系统时间
    getSystemTime = () => {
        return api.ajax('GET', '@/reuse/index/getSysDate')
            .then(res => {
                this.setState({
                    systemTime: res.data || new Date().getTime()
                })
            })
    }
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
        this.getSystemTime().then(() => {
            this.getSceneInfo(this._uuids, this._offerId)
        })

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
        api.ajax('GET', '@/reuse/sceneOffer/info', params).then(res => {
            if (res.data) {
                this.setState({
                    spinning: false,
                    bidData: res.data.scene || {},
                    offerData: res.data.offer || {},
                    statis: res.data.statis || null,
                    amt: res.data.productAmt
                }, () => {
                    this.getJjjl()
                    this.setState({
                        waste_time: this.state.bidData.status == 50 ? getDuration(this.state.systemTime - new Date(this.state.bidData.offerStartTime)) : getDuration(new Date(this.state.bidData.offerEndTime) - new Date(this.state.bidData.offerStartTime)),
                    })
                    this.setSceneCountDown(this.state.bidData.offerStartTime, this.state.bidData.offerEndTime)
                })
            }
        })
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
                        <span>{bidData.createUserName}</span>
                        <span className='ml10'>{bidData.createUserTel}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价分类</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.classifyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>应用领域</Col>
                    <Col className="reuse_value" span={span[1]}>{this.filterUseArea(bidData.useArea)}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价联系人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span style={{ marginRight: '10px' }}>{bidData.contacts}</span>
                        <span>{bidData.contactsTel}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>允许看货期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.khStartTime}</span>
                        <span style={{ margin: '0 10px' }}>-</span>
                        <span>{bidData.khEndTime}</span>
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
                        <span>{bidData.offerStartTime}</span>
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

    //竞价记录
    bidRecord = [
        {
            title: '序号',
            key: 'indexKey',
            width: 80,
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: '参与竞价企业名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
            sorter: true
        },
        {
            title: '报价时间',
            key: 'createTime',
            dataIndex: 'createTime',
            sorter: true
        },
        {
            title: '增幅比例',
            key: 'increRate',
            dataIndex: 'increRate',
            className: 'text_right',
            sorter: true,
            render(text, record, index) {
                return (
                    <span>{text}%</span>
                )
            }
        },
        {
            title: '增幅金额(元)',
            key: 'increAmt',
            dataIndex: 'increAmt',
            className: 'text_right',
            sorter: true,
            render: t => <span>{toFixed(t, 2)}</span>
        },
        {
            title: '总价(元)',
            key: 'offerAmt',
            dataIndex: 'offerAmt',
            className: 'text_right',
            sorter: true,
            render: t => <span>{toFixed(t, 2)}</span>
        },
        {
            title: '操作',
            key: 'x',
            dataIndex: 'x',
            width: 120,
            render: (text, record, index) => {
                return (
                    <span className="reuse_link" onClick={() => { this.offerDetail(record) }}>查看报价</span>
                )
            }
        },
    ]

    //报价详情
    offerDetail = (tr) => {
        if (tr.uuids && tr.sceneId) {
            window.open(systemConfigPath.jumpPage('/sale/offer/' + tr.sceneId + '?offerId=' + tr.uuids))
        }
    }

    //获取已报名采购商
    getJjjl = (params = {}) => {
        if (!this.state.offerData.buyerCompanyId) {
            return
        }
        api.ajax('GET', '@/reuse/sceneOffer/findList', {
            sceneId: this._uuids,
            buyerCompanyId: this.state.offerData.buyerCompanyId,
            ...params
        }).then(res => {
            this.setState({
                signPurchaserList: res.data || [],
            })
        }).catch(res => {

        })
    }

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
                        <Card title="竞价产品" className="mt10" extra={extra}>
                            <ToggleTable dataSource={this.state.bidData.goodsList}
                                no_selection={true}
                                columns={this.offerListCols}
                                scroll={{ x: 1200 }}
                                pagination={false} />
                            <div className="mt10 mb10 text_r">
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>合计：<span className="color_e bo_25">￥{numeral(this.state.amt || 0).format('0,0.00')}</span>元</span>
                            </div>
                        </Card>
                        <Card title="竞价附件" className="mt10">
                            <div className="padding-g margin-g" style={{ overflow: 'hidden' }}>
                                {
                                    this.state.bidData.fileList && this.state.bidData.fileList.length ?
                                        this.state.bidData.fileList.map((v, index) => {
                                            return (
                                                <Col span={8} key={index}>
                                                    <Icon type="paper-clip"></Icon>
                                                    <span className='text_line1' style={{ display: 'inline-block', maxWidth: '200px', 'verticalAlign': '-6px' }} title={v.fileName}>{v.fileName}</span>
                                                    <a href="javascript:void(0);"
                                                        onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath), true)}
                                                        className="reuse_link">下载</a>
                                                </Col>
                                            )
                                        })
                                        : '--'
                                }
                            </div>
                        </Card>
                        <Card title="补充说明" className="mt10">
                            <div className={less.exp}>
                                <div dangerouslySetInnerHTML={{
                                    __html: this.state.bidData.remark
                                }}></div>
                            </div>
                        </Card>

                        <Card title="报价信息" className="mt10">
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3} style={{ color: 'red' }}>最终报价排名</Col>
                                    <Col className="reuse_value" span={20}>{this.state.offerData.rank || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>报价有效期</Col>
                                    <Col className="reuse_value" span={20}>{this.state.offerData.effectiveDate || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>报价附件</Col>
                                    <Col className="reuse_value" span={20}>
                                        {
                                            this.state.offerData.fileList && this.state.offerData.fileList.length ?
                                                this.state.offerData.fileList.map((v, index) => {
                                                    return (
                                                        <Col span={8} key={index}>
                                                            <Icon type="paper-clip"></Icon>
                                                            <span className='text_line1' style={{ display: 'inline-block', maxWidth: '200px', 'verticalAlign': '-6px' }} title={v.fileName}>{v.fileName}</span>
                                                            <a href="javascript:void(0);"
                                                                onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath), true)}
                                                                className="reuse_link">下载</a>
                                                        </Col>
                                                    )
                                                })
                                                : '--'
                                        }
                                    </Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>报价信息说明</Col>
                                    <Col className="reuse_value" span={20}>{this.state.offerData.remark || '--'}</Col>
                                </Row>
                            </div>
                        </Card>
                        <Card title="竞价记录" className="mt10" style={{ marginBottom: '90px' }}>
                            <div className={less.record}>
                                <p className={less.rest}>
                                    <span className={less.rest_time}>{this.state.sceneCountDownText}</span>
                                </p>
                                <p>共计 <span>{this.state.signPurchaserList ? this.state.signPurchaserList.length : 0}</span> 次报价
                            {this.state.bidData.status < 50 ? null : <span className='ml10'>用时 {this.state.waste_time}</span>}</p>
                            </div>
                            <ToggleTable
                                no_selection={true}
                                sortChange={this.getJjjl}
                                dataSource={this.state.signPurchaserList || []}
                                columns={this.bidRecord}></ToggleTable>
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
