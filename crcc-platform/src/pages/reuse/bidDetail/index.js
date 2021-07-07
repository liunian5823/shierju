import React from 'react';
import api from '@/framework/axios';
import less from './index.less';
import '@/style/index.css'
import Util from '@/utils/util'
import { Card, Row, Col, Tabs, Button, Icon, Form } from 'antd';
const TabPane = Tabs.TabPane;
import { baseService } from '@/utils/common';
import FormatDate from '@/utils/date'
import { configs } from '@/utils/config/systemConfig';
import ToggleTable from '@/components/toggleTable';
import BaseAffix from "@/components/baseAffix";
import download from "@/pages/reuse/utils/isViewDown";
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
const label = {
    textAlignLast: 'justify'
}
const rows = {
    padding: '5px'
}
const text = {
    boxSizing: 'border-box',
    paddingLeft: '20px'
}
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
function getSearchByHistory(url) {
    let str = url;
    let params = {};
    if (typeof url == 'string') {
        if (str.indexOf('?') !== -1) {
            str = str.substr(str.indexOf('?') + 1)
        }
        let arr = [];
        arr = str.split('&');
        arr.forEach(v => {
            const label = decodeURIComponent(v.split('=')[0]);
            const value = decodeURIComponent(v.split('=')[1]);
            params[label] = value;
        })
    }
    return params
}

class SaleSceneDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            systemTime: null,
            waste_time: '',
            _type: null,//作废-void,
            defaultKey: '1',//tab选中字段
            bidData: {},
            signPurchaserLoading: false,//已报名采购商loading
            signPurchaserList: [],//已报名采购商数据
            bidRecordLoading: false,//竞价记录loading
            bidRecordList: [],//竞价记录数据
            sceneCountDownText: '',//场次倒计时-显示
            sceneTotleText: '',//场次倒报价用时
            bidJournalLoading: false,//竞价日志loading
            bidJournalList: [],//竞价日志数据

            offerViewList: [],//查看报价数据
            offerViewVisible: false,
            offerDetaillist: [],//报价详情
            offerDetailVisible: false,

            //作废
            voidVisible: false,
            cancelReason: '',
            //流标
            failVisible: false,
            failReason: '',
            failType: null,
        }
    }
    sceneCountDownTimer = null//场次倒计时-计时器
    config = {
        span: [3, 20],
        bondSpan: [5, 18],
        detailSpan: [3, 20],
        autosize: {
            minRows: 6,
            maxRows: 6
        },
        maxLength: 200
    }
    componentWillMount() {
        this.handleInit()
    }
    componentWillUnmount() {
        this.clearSceneCountDown()
    }

    //获取系统时间
    getSystemTime = () => {
        return api.ajax('GET', '**/reuse/scene/getSysDate')
            .then(res => {
                this.setState({
                    systemTime: res.data || new Date().getTime()
                })
            })
    }

    //竞价产品
    productsCols = [
        {
            title: '序号',
            key: 'indexkey',
            width: 80,
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: '商品类别',
            key: 'classifyName',
            dataIndex: 'classifyName',
            width: 110,
            render: text => {
                return <div title={text}>
                    {text || '--'}
                </div>
            }
        },
        {
            title: '物料编码',
            key: 'goodsCodeSect',
            dataIndex: 'goodsCodeSect',
            width: 130,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>
                    {text || '--'}
                </div>
            }
        },
        {
            title: '物料名称',
            key: 'goodsName',
            dataIndex: 'goodsName',
            width: 130,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>
                    {text || '--'}
                </div>
            }
        },
        {
            title: '规格',
            key: 'spec',
            dataIndex: 'spec',
            width: 130,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>
                    {text || '--'}
                </div>
            }
        },
        {
            title: '品牌',
            key: 'brand',
            dataIndex: 'brand',
            width: 130,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>
                    {text || '--'}
                </div>
            }
        },
        {
            title: '物料描述',
            key: 'desc',
            dataIndex: 'desc',
            width: 130,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>
                    {text || '--'}
                </div>
            }
        },
        {
            title: '质量状况',
            key: 'quality',
            dataIndex: 'quality',
            width: 130,
            className: 'text_line4_td',
            render: text => {
                return <div title={text}>
                    {text || '--'}
                </div>
            }
        },
        {
            title: '附件',
            key: 'fileName',
            width: 130,
            dataIndex: 'fileName',
            render: (text, record, index) => (
                text ? <a className="reuse_link text_line4" title={text}
                    href="javascript:void(0);"
                    onClick={() => download(record.fileName, configs.downUrl + record.filePath, true)}
                >
                    <Icon type="paper-clip" />
                    <span>{record.fileName}</span>
                </a>
                    : '无'
            )
        },
        {
            title: '销售数量(单位)',
            key: 'num',
            dataIndex: 'num',
            width: 120,
            fixed: 'right',
            className: 'text_right',
            render: (text1, record) => <span className='reuse_money'>{text1 || '--'} {record.unit}</span>
        },
    ]
    //已报名采购商
    signPurchaser = [
        {
            title: '采购商名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
            width: 200,
            className: 'text_line4_td',
        },
        {
            title: '联系方式',
            key: 'contacts',
            dataIndex: 'contacts',
            width: 200,
            render: (text, record, index) => {
                return (
                    <span>
                        <p className="text_line4" title={text}>{record.contacts}</p>
                        <p>{record.contactsTel}</p>
                    </span>
                )
            }
        },
        {
            title: '报名日期',
            key: 'signTime',
            dataIndex: 'signTime',
            sorter: true,
            width: 200,
        },
        {
            title: '保证金到账日',
            key: 'bondPayTime',
            dataIndex: 'bondPayTime',
            sorter: true,
            width: 200,
            render: (text, record, index) => {
                let color
                color = record.status == 22 ? '#999' : ''
                color = record.status == 24 ? '#0cba5e' : color
                color = record.status == 21 || record.status == 23 ? '#f15557' : color
                return (
                    <span>
                        <p style={{ color }}>{record.bondStatusStr || '--'}</p>
                        <p>{record.bondPayTime || '--'}</p>
                    </span>
                )
            }
        },
        {
            title: '报价有效期',
            key: 'effectiveDate',
            dataIndex: 'effectiveDate',
            sorter: true,
            render: text => {
                return text || '--'
            }
        },
        {
            title: '总价(元)',
            key: 'offerAmt',
            dataIndex: 'offerAmt',
            sorter: true,
            className: 'text_right',
            render: text => {
                return text ? toFixed(text, 2) : '--'
            }
        },
    ]
    //订单信息
    bidOrder = [
        {
            title: '订单号',
            key: 'code',
            dataIndex: 'code'
        },
        {
            title: '下单人',
            key: 'confirmUserName',
            dataIndex: 'confirmUserName'
        },
        {
            title: '联系方式',
            key: 'contacts',
            dataIndex: 'contacts',
            render: (text, record, index) => {
                return (
                    <span>
                        <p>{record.contacts}</p>
                        <p>{record.contactsTel}</p>
                    </span>
                )
            }
        },
        {
            title: '下单日期',
            key: 'confirmTime',
            dataIndex: 'confirmTime'
        },
        {
            title: '订单金额(元)',
            key: 'amt',
            dataIndex: 'amt',
            className: 'text_right',
            render: text => {
                return toFixed(text, 2)
            }
        },
        {
            title: '状态',
            key: 'statusStr',
            dataIndex: 'statusStr'
        },
    ]
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
            title: '参加企业名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName'
        },
        {
            title: '报价时间',
            key: 'createTime',
            dataIndex: 'createTime',
            className: 'text_right',
            sorter: true
        },
        {
            title: '增幅比例',
            key: 'increRate',
            className: 'text_right',
            dataIndex: 'increRate',
            render: (text, record, index) => (
                <span>{text}%</span>
            ),
            sorter: true
        },
        {
            title: '增幅金额(元)',
            key: 'increAmt',
            className: 'text_right',
            dataIndex: 'increAmt',
            render: text => {
                return toFixed(text, 2)
            },
            sorter: true
        },
        {
            title: '总价(元)',
            key: 'offerAmt',
            className: 'text_right',
            dataIndex: 'offerAmt',
            render: text => {
                return toFixed(text, 2)
            },
            sorter: true
        },
    ]
    //竞价日志
    bidJournal = [
        {
            title: '操作人',
            key: 'createUserName',
            width: 130,
            dataIndex: 'createUserName',
            render: (text, record) => {
                return <div>{text}({record.userNo || '--'})</div>
            }
        },
        {
            title: '操作时间',
            width: 90,
            className: 'text_right',
            key: 'createTime',
            dataIndex: 'createTime',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? text.substr(0, 10) : ''}</p>
                        <p>{text ? text.substr(10) : ''}</p>
                        <p>{text ? '' : '--'}</p>
                    </div>
                )
            }
        },
        {
            title: '事件说明',
            key: 'remark',
            dataIndex: 'remark'
        },
    ]
    //初始
    handleInit = () => {
        const search = this.props.history.location.search;
        if (search) {
            let params = getSearchByHistory(search);
            if (params.type) {
                this.setState({
                    _type: params.type
                })
            }
        }
        const uuids = this.props.match.params.uuids;
        this.getSystemTime().then(() => {
            if (uuids) {
                this.getSceneInfo(uuids)
            }
        })

    }
    //获取页面数据
    getSceneInfo = (uuids) => {
        api.ajax('GET', '**/reuse/scene/info', {
            uuids
        }).then(res => {
            if (res.data) {
                let signPurchaserList = res.data.signList || [];
                let sceneTotleText = '';
                if (res.data.offerStartTime) {
                    let now = new Date().getTime();
                    let start = new Date(res.data.offerStartTime).getTime();
                    if (now >= start) {
                        sceneTotleText = FormatDate.formatTimeCountDown(now - start).text
                    }
                }
                let bidRecordList = res.data.offerList || [];
                let bidJournalList = res.data.logList || [];
                this.setState({
                    bidData: res.data,
                    bidRecordList,
                    sceneTotleText,
                    bidJournalList,
                    signPurchaserList
                }, () => {
                    this.setState({
                        waste_time: this.state.bidData.status == 50 ? getDuration(this.state.systemTime - new Date(this.state.bidData.offerStartTime)) : getDuration(new Date(this.state.bidData.offerEndTime) - new Date(this.state.bidData.offerStartTime)),
                    })
                    this.setSceneCountDown(res.data.offerStartTime, res.data.offerEndTime)
                });

            }
        }, e => Util.alert(e.msg))
    }
    //tab切换
    tabChange = (item) => {
        if (item == 2) {
            this.getJjjl()
        } else if (item == 4) {
            this.getJjjl1()
        }
    };

    //场次基本信息
    createSceneInfo = () => {
        const { bidData } = this.state;
        const { span } = this.config;
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
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价编号</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.code || '----'}</Col>
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
                        <span>{bidData.createUserName || '--'}</span>&nbsp;
                        <span>{bidData.createUserTel || '--'}</span>
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
                        <span>{bidData.contacts || '--'}</span>
                        <span style={{ marginLeft: '10px' }}>{bidData.contactsTel || '--'}</span>
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
                        <span>{bidData.signEndTime || '--'}</span>
                        <span className="ml20">
                            {bidData.signEndTimeStr || '--'}
                        </span>
                        <span className="reuse_tip ml20">采购商无法在此时间后报名参与竞价，已报名采购商可继续在竞价开始日期前缴纳保证金</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价开始日期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.offerStartTime || '--'}</span>
                        <span className="reuse_tip ml20">竞价开始时采购未缴纳保证金或采购未确认保证金到账视为报名无效，无法参与竞价</span>
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
                        <span className="reuse_tip ml20">如果拍卖结束前2分钟出价，拍卖结束时间会自动延时5分钟</span>
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

    getJjjl = (params = {}) => {
        api.ajax('GET', '**/reuse/sceneSign/findList', {
            sceneId: this.props.match.params.uuids,
            ...params
        }).then(res => {
            this.setState({
                signPurchaserList: res.data || [],
            })
        }).catch(res => {

        })
    }

    getJjjl1 = (params = {}) => {
        api.ajax('GET', '**/reuse/sceneOffer/findList', {
            sceneId: this.props.match.params.uuids,
            ...params
        }).then(res => {
            this.setState({
                bidRecordList: res.data || [],
            })
        }).catch(res => {

        })
    }

    //其他信息
    createSceneList = () => {
        const {
            defaultKey, bidData,
            signPurchaserList, signPurchaserLoading,
            bidRecordList, bidRecordLoading,
            bidJournalList, bidJournalLoading,
        } = this.state;
        const { bondSpan, detailSpan } = this.config;
        const { goodsList = [], bondWhiteList = [], signList = [], fileList = [], order = {}, inviteList = [] } = bidData;

        return (
            <div className={['baseTabs', less.tabs].join(' ')} style={{ border: 'none' }}>
                <Tabs defaultActiveKey={defaultKey}
                    onChange={this.tabChange}>
                    <TabPane tab="竞价产品" key="1">
                        <div className={less.products}>
                            <ToggleTable dataSource={goodsList} columns={this.productsCols}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="已报名采购商" key="2">
                        <div className={less.products}>
                            <ToggleTable
                                sortChange={this.getJjjl}
                                dataSource={signPurchaserList}
                                columns={this.signPurchaser}
                                loading={signPurchaserLoading}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="竞价详情" key="3">
                        <div className={less.detail}>
                            <div className="reuse_baseTitle">竞价要求</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>付款方式</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.payWayStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>货品所在地</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.provinceName || '--'}{bidData.cityName || '--'}{bidData.countyName || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>看货地址</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.khAddress || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>存储方式/时间</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.storageWayStr || '--'}/{bidData.storageTime || '--'}天</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>付款时间</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>成交后<span className={less.payTime}> {bidData.payTime || '--'} </span>天内</Col>
                                </Row>
                            </div>
                            <div className="reuse_baseTitle mt20">竞价及隐私信息</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>隐私设置</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.privacySetStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>成交公告</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.dealNoticeStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>调价方式</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.adjustWayStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>增加幅度</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}><span className="reuse_money">{bidData.increRange}</span>{bidData.adjustWay == 1 ? '%' : '元'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>开盘价格</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}><span className="reuse_money">{bidData.startPrice || '--'}</span> 元</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>成交底价</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}><span className="reuse_money">{bidData.basePrice || '--'}</span> 元</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>最低参与企业数</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.minSign == 0 ? '无限制' : bidData.minSign}</Col>
                                </Row>
                            </div>
                            <div className="reuse_baseTitle mt10"></div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>竞价方式</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.bidWayStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>邀请名单</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>
                                        {
                                            inviteList && inviteList.length ? inviteList.map((v, index) => {
                                                return (
                                                    <Col span={12} key={index}>
                                                        <span className={less.whiteList_item}>{v.buyerCompanyName}</span>
                                                    </Col>
                                                )
                                            })
                                                : '--'
                                        }
                                    </Col>
                                </Row>
                            </div>
                            <div className="reuse_baseTitle mt20">竞价附件</div>
                            <Row className={less.enclosure}>
                                {
                                    fileList && fileList.length ? fileList.map((v, index) => {
                                        return (
                                            <Col span={8} key={index}>
                                                <Icon type="paper-clip"></Icon>
                                                <span>{v.fileName}</span>
                                                <a
                                                    href="javascript:void(0);"
                                                    onClick={() => download(v.fileName, configs.downUrl + v.filePath, true)}
                                                    className="linkButton">查看</a>
                                            </Col>
                                        )
                                    })
                                        : '--'
                                }
                            </Row>
                            <div className="reuse_baseTitle mt20">补充说明</div>
                            <div className={less.exp}>
                                <div style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{
                                    __html: bidData.remark || '--'
                                }}></div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="竞价记录" key="4">
                        <div className={less.products}>
                            <div className={less.record}>
                                <p className={less.rest}><span className={less.rest_time}>{this.state.sceneCountDownText || '--'}</span></p>
                                <p>共计 <span>{bidRecordList.length}</span> 次报价
                            {this.state.bidData.status < 50 ? null : <span className='ml10'>用时 {this.state.waste_time}</span>}</p>
                            </div>
                            <ToggleTable
                                sortChange={this.getJjjl1}
                                dataSource={bidRecordList}
                                columns={this.bidRecord}
                                loading={bidRecordLoading}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="订单信息" key="5">
                        <div className={less.products}>
                            <ToggleTable
                                dataSource={[order]}
                                columns={this.bidOrder}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="保证金" key="6">
                        <div className={less.bond}>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金缴纳</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bidData.bondTypeStr || '--'}</Col>
                                </Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>收款账户名</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bidData.account || '--'}</Col>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金金额</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}><span className="reuse_money">{bidData.bondAmt || '--'}</span>元</Col>
                                </Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金收款账户</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bidData.accountNo || '--'}</Col>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}></Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>开户行</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bidData.openBank || '--'}</Col>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}></Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>来款备注</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bidData.bondRemark || '--'}</Col>
                                </Col>
                            </Row>
                            <Row className={less.whiteList}>
                                <Col span={2}>保证金白名单：</Col>
                                <Col span={20}>
                                    {
                                        bondWhiteList && bondWhiteList.length ? bondWhiteList.map((v, index) => {
                                            return (
                                                <Col span={12} key={index}>
                                                    <span className={less.whiteList_item}>{v.buyerCompanyName}</span>
                                                </Col>
                                            )
                                        })
                                            : '--'
                                    }
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane tab="竞价日志" key="7">
                        <div className={less.products}>
                            <ToggleTable
                                dataSource={bidJournalList}
                                columns={this.bidJournal}
                                loading={bidJournalLoading}></ToggleTable>
                        </div>
                    </TabPane>
                </Tabs>
                {/*<div className={["reuse_baseButtonGroup", less.options].join(' ')}>*/}
                {/*    {*/}
                {/*        defaultKey == '1' ? <Button type="primary" key="1" onClick={this.exportGoodsList}>导出商品清单</Button> : null*/}
                {/*    }*/}
                {/*    {*/}
                {/*        defaultKey == '6' ? <Button type="primary" key="6" onClick={() => {this.setState({offerDetailVisible: true})}}>保证金管理</Button> : null*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
        )
    }
    //场次倒计时
    setSceneCountDown = (s, e) => {
        if (this.sceneCountDownTimer) this.sceneCountDownTimer = null;
        if (!s || !e) return;
        let that = this;

        this.sceneCountDownTimer = setInterval(() => {
            const now = new Date().getTime();
            let start = new Date(s).getTime();
            let end = new Date(e).getTime();
            let text = '';

            if (now <= start) {
                text = '距离场次开始：' + FormatDate.formatTimeCountDown(start - now).text;
            } else if (now > start && now <= end) {
                text = '距离场次结束：' + FormatDate.formatTimeCountDown(end - now).text;
            } else if (now > end) {
                text = '场次已结束'
            }
            that.setState({
                sceneCountDownText: text
            })
            if (now > end) {
                this.clearSceneCountDown()
            }
        }, 1000)
    }
    //清除场次倒计时
    clearSceneCountDown = () => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
    }
    handleGoBack = () => {
        if (this.props.history.length > 1) {
            this.props.history.goBack();
        } else {
            window.close();
        }
    };
    dom = null;
    render() {
        const { _type } = this.state;
        return (
            <div className={less.scene_detail} >
                <Form>
                    <div ref={ref => this.dom = ref}>
                        <Card className="mt10" style={{ border: 'none' }}>
                            <div className="reuse_baseTitle">场次基本信息</div>
                            {this.createSceneInfo()}
                        </Card>
                        <Card className="mt10" style={{ border: 'none' }}>
                            {this.createSceneList()}
                        </Card>
                    </div>
                    <BaseAffix>
                        <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
                        <Button onClick={() => Util.print(this.dom)} type={_type ? null : 'primary'}>打印</Button>
                    </BaseAffix>
                </Form>
            </div>
        )
    }
}

export default Form.create()(SaleSceneDetail)
