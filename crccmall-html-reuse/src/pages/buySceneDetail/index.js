import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Card, Row, Col, Tabs, Button, Table, Icon, Modal, Spin } from 'antd';
const TabPane = Tabs.TabPane;
import Print from 'react-to-print'
import { baseService } from '@/utils/common';
import less from './index.less';
import FormatDate from '@/utils/date';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import { closeWin, isNormal, filePathDismant } from '@/utils/dom';
import BaseTable from '@/components/baseTable';
import ToggleTable from '@/components/toggleTable';
import download from "business/isViewDown";
//竞价状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;

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


export default class SaleSceneDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            defaultKey: '1',//tab选中字段
            bidData: {},
            bidJournalLoading: false,//竞价日志loading
            bidJournalList: [],//竞价日志数据

            offerViewList: [],//查看报价数据
            offerViewVisible: false,
            offerDetaillist: [],//报价详情
            offerDetailVisible: false,
            bidRecordLoading: false,//竞价记录loading
            bidRecordList: [],//竞价记录数据
            sceneCountDownText: '',//场次倒计时-显示
            sceneTotleText: '',//场次倒报价用时

            systemTime: null,//系统时间
            bidRecordLiRank: '',//竞价记录排名
        }
    }
    _uuids = null
    sceneCountDownTimer = null//场次倒计时-计时器
    config = {
        span: [3, 20],
        bondSpan: [5, 19],
        detailSpan: [3, 20],
        orderSpan: [4, 19]
    }
    componentWillMount() {
        this.handleInit()
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
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料名称',
            key: 'goodsName',
            dataIndex: 'goodsName',
            width: 100,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '规格',
            key: 'spec',
            dataIndex: 'spec',
            width: 100,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '品牌',
            key: 'brand',
            dataIndex: 'brand',
            width: 100,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料描述',
            key: 'desc',
            dataIndex: 'desc',
            width: 100,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
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
            key: 'filePath',
            dataIndex: 'filePath',
            width: 100,
            className: 'text_line4_td',
            render: (text, record, index) => (
                text ?
                    <span>
                        <a className="color_a"
                            href="javascript:void(0);"
                            onClick={() => download(record.fileName, systemConfigPath.fileDown(record.filePath), true)}
                        >
                            <Icon type="paper-clip" />
                            <span title={text}>{record.fileName}</span>
                        </a>
                    </span> : '无'
            )
        },
        {
            title: '单价(元)',
            key: 'price',
            className: 'text_right',
            dataIndex: 'price',
            width: 100,
        },
        {
            title: '总价(元)',
            key: 'sumAmt',
            className: 'text_right',
            dataIndex: 'sumAmt',
            width: 100,
        },
        {
            title: '销售数量(单位)',
            key: 'num',
            dataIndex: 'num',
            className: 'text_right text_line1_td',
            width: 120,
            fixed: 'right',
            render: (t, r) => {
                t = t ? t + '/' + r.unit : '--'
                return <div className='text_right reuse_money' title={t}><span>{t}</span></div>
            }
        },
    ]
    //竞价日志
    bidJournal = [
        {
            title: '操作人',
            key: 'createUserName',
            width: 180,
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
        // {
        //     title: '参加企业名称',
        //     key: 'buyerCompanyName',
        //     dataIndex: 'buyerCompanyName',
        //     width: 200,
        //     className: 'text_line4_td',
        // },
        {
            title: '报价时间',
            key: 'createTime',
            width: 120,
            sorter: true,
            dataIndex: 'createTime',
            className: 'text_right',
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
            title: '增幅比例',
            key: 'increRate',
            sorter: true,
            className: 'text_right',
            dataIndex: 'increRate',
            render: (text, record, index) => (
                <span>{text}%</span>
            )
        },
        {
            title: '增幅金额(元)',
            key: 'increAmt',
            sorter: true,
            className: 'text_right',
            dataIndex: 'increAmt',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? toFixed(text, 2) : '--'}</p>
                    </div>
                )
            }
        },
        {
            title: '总价(元)',
            key: 'offerAmt',
            sorter: true,
            className: 'text_right',
            dataIndex: 'offerAmt',
            render: (text, record) => {
                return (
                    <div>
                        <p>{text ? toFixed(text, 2) : ''}</p>
                    </div>
                )
            }
        },
        {
            title: '操作',
            key: 'x',
            dataIndex: 'x',
            width: 120,
            render: (text, record, index) => {
                return (
                    // <span className="reuse_link" onClick={() => {
                    //     this.offerDetail(record) 
                    // }}>报价详情</span>
                    <span className="reuse_link" onClick={() => {
                        this.offerView(record)
                    }}>查看报价</span>
                )
            }
        },
    ]
    //查看报价
    offerViewCols = [
        {
            title: '商品类别',
            key: 'classifyName',
            dataIndex: 'classifyName',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料编码',
            key: 'goodsCodeSect',
            dataIndex: 'goodsCodeSect',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料名称',
            key: 'goodsName',
            dataIndex: 'goodsName',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '规格',
            key: 'spec',
            dataIndex: 'spec',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '品牌',
            key: 'brand',
            dataIndex: 'brand',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料描述',
            key: 'desc',
            dataIndex: 'desc',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '销售数量',
            key: 'num',
            dataIndex: 'num'
        },
        {
            title: '计量单位',
            key: 'unit',
            dataIndex: 'unit'
        },
        {
            title: '质量状况',
            key: 'quality',
            dataIndex: 'quality',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '附件',
            key: 'fileName',
            dataIndex: 'fileName',
            className: 'text_line4_td',
            render: (text, record, index) => {
                return (
                    record.filePath ? <span>
                        <a style={{ whiteSpace: 'initial' }} href={systemConfigPath.fileDown(record.filePath)} download={record.fileName} target="_blank"
                           title={text} className="reuse_link text_line4">{record.fileName}</a>
                    </span> : '无'
                )
            }
            // render: (text, record, index) => (
            //     text ?
            //         <span>
            //             <a className="color_a"
            //                 href="javascript:void(0);"
            //                 onClick={() => download(record.fileName, systemConfigPath.fileDown(record.filePath), true)}
            //             >
            //                 <Icon type="paper-clip" />
            //                 <span title={text}>{record.fileName}</span>
            //             </a>
            //         </span> : '无'
            // )
        },
        {
            title: '单价(元)',
            key: 'price',
            className: 'text_right',
            dataIndex: 'price'
        },
        {
            title: '金额(元)',
            key: 'sumAmt',
            className: 'text_right',
            dataIndex: 'sumAmt'
        },
    ]
    //报价详情
    offerDetailCols = [
        {
            title: '商品类别',
            key: 'classifyName',
            dataIndex: 'classifyName'
        },
    ]
    //初始
    handleInit = () => {
        this._uuids = this.props.match.params.uuids;
        // if (this._uuids) {
        //     this.getSceneInfo(this._uuids)
        // }

        this.getSystemTime().finally(() => {
            if (this._uuids) {
                this.getSceneInfo(this._uuids)
            }
        })
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
    //获取页面数据
    getSceneInfo = (sceneId) => {
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/buyScene/info', {
            sceneId
        }).then(res => {
            if (res.data) {
                this.setState({
                    bidData: res.data,
                    spinning: false,
                    waste_time: res.data.status == 50 ? getDuration(this.state.systemTime - new Date(res.data.offerStartTime)) : getDuration(new Date(res.data.offerEndTime) - new Date(res.data.offerStartTime)),
                })
                this.setSceneCountDown(res.data.offerStartTime, res.data.offerEndTime)
            }
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        })
    }
    //tab切换
    tabChange = (item) => {
        this.setState({
            defaultKey: item
        })
        if (item == '7') {
            this.getBidJournal()
        }
        if (item == '9') {
            this.getBidRecord()
        }
    }
    //获取竞价日志
    getBidJournal = () => {
        if (!this._uuids) return;
        this.setState({
            bidJournalLoading: true,
        })
        api.ajax('GET', '@/reuse/sceneLog/findOfferLogs', {
            sceneId: this._uuids,
        }).then(res => {
            this.setState({
                bidJournalList: res.data || [],
                bidJournalLoading: false,
            })
        }, error => {
            this.setState({
                bidJournalLoading: false,
            })
            Util.alert(error.msg, { type: 'error' })
        })
    }
    //获取竞价记录
    getBidRecord = (params = {}) => {
        const uuids = this.props.match.params.uuids;
        if (!uuids) return;
        this.setState({
            bidRecordLoading: true,
        })
        api.ajax('GET', '@/reuse/sceneOffer/myOfferList', {
            // sceneId: uuids,
            // ...params
            sceneId: this._uuids,
            ...params
        }).then(res => {
            let sceneTotleText = '';
            if (this.state.bidData.offerStartTime) {
                let now = new Date().getTime();
                let start = new Date(this.state.bidData.offerStartTime).getTime();
                if (now >= start) {
                    sceneTotleText = FormatDate.formatTimeCountDown(now - start).text
                }
            }
            this.setState({
                bidRecordLiRank : res.data.rank || '',
                bidRecordList: res.data.offerList || [],
                bidRecordLoading: false,
                sceneTotleText,
            })
        }).catch(res => {
            this.setState({
                bidRecordLoading: false,
            })
        })
    }

    // 查看报价
    offerView = (tr) => {
        if (tr.uuids && tr.sceneId) {
            api.ajax('GET', '@/reuse/sceneOfferDetail/findList', {
                sceneId: tr.sceneId,
                offerId: tr.uuids
            }).then(res => {
                this.setState({
                    offerViewList: res.data.data || [],
                    offerViewVisible: true,
                })
            }).catch(res => {
                this.setState({
                    offerViewVisible: true,
                })
            })
        }
        // if (tr.uuids && tr.sceneId) {
        //     window.open(systemConfigPath.jumpPage('/sale/offer/' + tr.sceneId + '?offerId=' + tr.uuids))
        //     return;
        // }
    }
    offerViewClose = () => {
        this.setState({
            offerViewVisible: false,
        })
    }

    // 报价详情
    offerDetail = (tr) => {
        if (tr.uuids && tr.sceneId) {
            api.ajax('GET', '@/reuse/sceneOffer/info', {
                sceneId: tr.sceneId,
                uuids: tr.uuids
            }).then(res => {
                this.setState({
                    offerViewList: res.data.scene.goodsList || [],
                    offerViewVisible: true,
                })
            }).catch(res => {
                this.setState({
                    offerViewVisible: true,
                })
            })
        }
    }
    offerDetailClose = () => {
        this.setState({
            offerDetailVisible: false
        })
    }

    toDetail = (uuid) => {
        window.open(systemConfigPath.jumpPage('/buy/order/' + uuid));
    }

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
                {/*{*/}
                {/*    (bidData.status >= 60 && bidData.status <70) ? null :  <Row className="reuse_row">*/}
                {/*        <Col className="reuse_label" span={span[0]}>发布人</Col>*/}
                {/*        <Col className="reuse_value" span={span[1]}>*/}
                {/*            <span>{bidData.createUserName}</span>*/}
                {/*            <span>{bidData.createUserTel}</span>*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*}*/}

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
                                ? <span>{bidData.signEndTime} &nbsp; 已截止</span>
                                : <span>
                                    <span>{bidData.signEndTime}</span>
                                    <span className="ml20">
                                        {bidData.signEndTimeStr}
                                    </span>
                                </span>
                        }
                        <span className={["reuse_tip", less.tip].join(' ')}>采购商无法在此时间后报名参与竞价，已报名采购商可继续在竞价开始日期前缴纳保证金</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价开始日期</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.offerStartTime || '--'}</span>
                        <span className={["reuse_tip", less.tip].join(' ')}>竞价开始时采购未缴纳保证金或销售方未确认保证金到账视为报名无效，无法参与竞价</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价截止日期</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.offerEndTime || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>结束自动延长</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.extendStr}</span>
                        <span className={["reuse_tip", less.tip].join(' ')}>如果竞价结束前2分钟出价，竞价结束时间会自动延时5分钟</span>
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
    refs = null;
    //其他信息
    createSceneList = () => {
        const {
            defaultKey,
            bidData,
            bidJournalList,
            bidJournalLoading,
            bidRecordList,
            bidRecordLoading,
            bidRecordLiRank,
        } = this.state;
        const { bondSpan, detailSpan,orderSpan } = this.config;
        const { goodsList = [], fileList = [] } = bidData;
        const bidOrderDate = bidData.order || {};
        let bondData = {};//保证金
        if (bidData.bondDealList && bidData.bondDealList.length) {
            bondData = bidData.bondDealList[0] || {}
        }
        let signInfo = {};//报名信息
        if (bidData.signList && bidData.signList.length) {
            signInfo = bidData.signList[0] || {}
        }
        return (
            <div className={['baseTabs', less.tabs].join(' ')} >
                <Tabs defaultActiveKey={defaultKey}
                    onChange={this.tabChange}>
                    <TabPane tab="竞价产品" key="1">
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={goodsList}
                                columns={this.productsCols}
                                scroll={{ x: 1200 }}></ToggleTable>
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
                                    <Col className="reuse_label" span={detailSpan[0]}>付款时间</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>成交后<span className={less.payTime}> {bidData.payTime} </span>日内</Col>
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
                            </div>
                            <div className="reuse_baseTitle mt20">报名信息</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>联系方式</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>
                                        <span>{signInfo.contacts}</span>
                                        <span className="ml20">{signInfo.contactsTel}</span>
                                    </Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>报名日期</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{signInfo.signTime || '--'}</Col>
                                </Row>
                            </div>
                            <div className="reuse_baseTitle mt20">竞价及隐私信息</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>增加幅度</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}><span className="reuse_money">{bidData.increRange}</span>{bidData.adjustWay == 1 ? '%' : '元'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>开盘价格</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}><span className="reuse_money">{bidData.startPrice}</span>元</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>最低参与企业数</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.minSign == 0 ? '无限制' : bidData.minSign}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>竞价方式</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.bidWayStr || '--'}</Col>
                                </Row>
                            </div>
                            <div className="reuse_baseTitle mt20">竞价附件</div>
                            <Row className={less.enclosure}>
                                {
                                    fileList.length ?
                                        fileList.map((v, index) => {
                                            return (
                                                <Col span={8} key={index}>
                                                    <Icon type="paper-clip"></Icon>
                                                    <span className='text_line1' style={{ display: 'inline-block', maxWidth: '234px', 'verticalAlign': '-6px' }} title={v.fileName}>{v.fileName}</span>
                                                    <a className="reuse_link"
                                                        href="javascript:void(0);"
                                                        onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath), true)}
                                                    >下载</a>
                                                </Col>
                                            )
                                        })
                                        : '--'
                                }
                            </Row>
                            <div className="reuse_baseTitle mt20">补充说明</div>
                            <div className={less.exp}>
                                <div dangerouslySetInnerHTML={{
                                    __html: bidData.remark || '--'
                                }}></div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="订单信息" key="5">
                        <div className={less.order}>
                            <Row>
                                <Col span={14}>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={orderSpan[0]}>订单号</Col>
                                        <Col className="reuse_value" span={orderSpan[1]}>{bidOrderDate.code ? <a onClick={() => this.toDetail(bidOrderDate.businessId)} style={{ color: '#61ccfa', textDecoration: 'underline' }}>{bidOrderDate.code}</a> : '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={orderSpan[0]}>下单日期</Col>
                                        <Col className="reuse_value" span={orderSpan[1]}>{bidOrderDate.bidTime || '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={orderSpan[0]}>采购单位</Col>
                                        <Col className="reuse_value" span={orderSpan[1]}>{bidOrderDate.buyerCompanyName || '--'}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={orderSpan[0]}>联系人/电话</Col>
                                        <Col className="reuse_value" span={orderSpan[1]}>
                                            <span>{bidOrderDate.contacts || '--'}</span>
                                            <span className="ml20">{bidOrderDate.contactsTel || '--'}</span>
                                        </Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={orderSpan[0]}>付款方式</Col>
                                        <Col className="reuse_value" span={orderSpan[1]}>{bidOrderDate.payWayStr || '--'}</Col>
                                    </Row>
                                </Col>
                                <Col span={10}>
                                    <div className={less.order_major} style={{ textAlign: 'right' }}>
                                        <Col span={14}>
                                            <p className="font16">订单金额</p>
                                            <p><span className="color_e font18">{bidOrderDate.amt ? numeral(bidOrderDate.amt).format('0,0.00') : '--'}</span>元</p>
                                        </Col>
                                        <Col span={10}>
                                            <p className="font16">状态</p>
                                            <p className={less.order_status}>{bidOrderDate.statusStr || '--'}</p>
                                        </Col>
                                    </div>
                                </Col>
                            </Row>
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
                                    <Col className="reuse_value" span={bondSpan[1]}><span>{bidData.bondAmt || '--'}</span>元</Col>
                                </Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金收款账户</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bidData.accountNo || '--'}</Col>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金状态</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bidData.bondStatusStr || '--'}</Col>
                                </Col>
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
                            <div className="reuse_baseTitle"></div>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金缴纳时间</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bondData.payTime || '--'}</Col>
                                </Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金操作人</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>
                                        <span>{bondData.payUserName || '--'}</span>
                                        <span className="ml20">{bondData.payUserTel || '--'}</span>
                                    </Col>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金确认时间</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bondData.confirmTime || '--'}</Col>
                                </Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>保证金凭证</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>
                                        {bondData.filePath ? <a className="reuse_link"
                                            href="javascript:void(0);"
                                            onClick={() => download(bondData.fileName, systemConfigPath.fileDown(bondData.filePath))}
                                        >{bondData.fileName}</a> : '--'}
                                    </Col>
                                </Col>
                            </Row>
                            <Row className="reuse_row">
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>退还保证金时间</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>
                                        {bondData.returnTime || '--'}
                                    </Col>
                                </Col>
                                <Col span={12}>
                                    <Col className="reuse_label" span={bondSpan[0]}>缴纳方式</Col>
                                    <Col className="reuse_value" span={bondSpan[1]}>{bondData.payWayStr || '--'}</Col>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane tab="竞价日志" key="7">
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={bidJournalList}
                                columns={this.bidJournal}
                                loading={bidJournalLoading}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="竞价记录" key="9">
                        <div className={less.products}>
                            <div className={less.record}>
                                <p className={less.rest_ranking}>
                                    排名第&nbsp;
                                    {/* <span className={less.rest_ranking_color}>{('第' + bidRecordList.rank || '--' )}</span> */}
                                    <span className={less.rest_ranking_color}>{( bidRecordLiRank || '--' )}</span>
                                </p>
                                <p className={less.rest}>
                                    <span className={less.rest_time}>{this.state.sceneCountDownText}</span>
                                </p>
                                <p>共计 <span>{(bidRecordList || []).length}</span> 次报价
                            {this.state.bidData.status < 50 ? null : <span className='ml10'>用时 {this.state.waste_time}</span>}</p>
                            </div>
                            <ToggleTable no_selection={true}
                                sortChange={this.getBidRecord}
                                dataSource={bidRecordList || []}
                                columns={this.bidRecord}
                                loading={bidRecordLoading}></ToggleTable>
                        </div>
                    </TabPane>
                </Tabs>
                <div data-print-hide className={["reuse_baseButtonGroup", less.options].join(' ')}>
                    {
                        defaultKey == '1' ? <Button type="primary" key="1" onClick={this.epxortGoodsList}>导出商品清单</Button> : null

                    }
                </div>
            </div>
        )
    }
    //导出商品
    epxortGoodsList = () => {
        if (!this._uuids) return;
        window.open(configs.exportUrl + '/reuse/sceneGoods/exportData?sceneId=' + this._uuids)
    }
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
    render() {
        return (
            <div className={less.scene_detail} >
                <Spin spinning={this.state.spinning}>
                    <div ref={ref => this.refs = ref} style={{ marginBottom: '80px' }}>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">场次基本信息</div>
                            {this.createSceneInfo()}
                        </Card>
                        <Card className="mt10">
                            {this.createSceneList()}
                        </Card>
                    </div>
                    <Card className="fixed_button">
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            <Button onClick={closeWin}>关闭</Button>
                            <Button type="primary" onClick={() => Util.print(this.refs)}>打印</Button>
                        </div>
                    </Card>

                    <Modal title="查看报价"
                        width={1000}
                        visible={this.state.offerViewVisible}
                        onCancel={this.offerViewClose}
                        footer={<Button key="back" type="ghost" onClick={this.offerViewClose}>关 闭</Button>}>
                        <div>
                            <Table dataSource={this.state.offerViewList}
                                columns={this.offerViewCols}
                                pagination={false} />
                        </div>
                    </Modal>

                    {/* <Modal title="报价详情"
                        width={1000}
                        visible={this.state.offerDetailVisible}
                        onCancel={this.offerDetailClose}
                        footer={<Button key="back" type="ghost" onClick={this.offerDetailClose}>关 闭</Button>}>
                        <div>
                            <Table dataSource={this.state.offerDetaillist}
                                columns={this.offerDetailCols}
                                pagination={false} />
                        </div>
                    </Modal> */}
                </Spin>
            </div>
        )
    }
}
