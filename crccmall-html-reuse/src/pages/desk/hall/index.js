import React from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Checkbox,
    Button,
    Icon,
    Table,
    Popover,
    Modal,
    Radio,
    Spin
} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import { connect } from 'react-redux';

import UploadFile from '@/components/uploadFile';
import less from './index.less';
import './index.css';
import Util from '@/utils/util';
import api from '@/framework/axios';
import { baseService } from '@/utils/common';
import FormatDate from '@/utils/date';
import { isNormal, filePathDismant, closeWin } from '@/utils/dom';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import * as validatorRules from '@/utils/formCheck';
import ToggleTable from '@/components/toggleTable';
import download from "business/isViewDown";
import pdf from "business/desk/hall/0002.jpg";
import {getSearchByHistory} from "@/utils/urlUtils";
// import currency from 'currency.js'

// import io from './socket'

//竞价状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;

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

function toLocaleString(str) {
    if (!str) {
        return ''
    }
    let arr = str.split('.')
    return (+arr[0]).toLocaleString() + '.' + arr[1]
}

const confirm = Modal.confirm;
class BidHall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            step: 0,
            pageNormal: true,
            systemTime: null,//系统时间
            batchPriceBtnVisible: false,
            spinning: false,
            baseInfoHeight: 70,//基本信息样式
            quoteData: {},
            bidData: {},//主数据
            panelList: [],//竞价商品列表
            rankData: {},//排名数据
            fileList: [],//附件数据

            explainLen: 0,//报价信息说明的文字长度
            bidRecordList: [],//竞价记录列表

            sumOfferAmt: 0,//总报价
            unifyPrice: 0,//统一出价
            tipVisible: true,
            ruleChecked: false,//是否勾选规则
            ruleVisible: false,

            batchVisible: false,
            batchPrice: 0,//批量设置价格
            batchPriceRatio: 0,//调价后比例
            batchPriceSum: 0,//调价后总价格
            batchPriceType: '1',//统一调价方式
        }
    }

    _type = null
    _uuids = null
    _flag = null //竞价记录只看自己 1
    sceneCountDownTimer = null//场次倒计时-计时器

    config = {
        size: 'default',
        commonStyle: {
            width: '90%'
        },
        col6: {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        },
        priceConf: {
            min: 0,
            max: 999999999999.99,
            step: '0.00',
        },
        inputPrice: {
            min: 0,
            max: 999999999999.99,
            step: 0.01,
            style: {
                width: '100%',
                height: '40px',
                lineHeight: '40px',
            }
        },//出价input框
        span: [2, 20],
        scroll: { y: 445 },//商品列表滚动高度
        explainMaxLen: 500,//报价信息说明-文字最大长度
        autosize: { minRows: 8, maxRows: 8 },//报价信息说明-高度
        decimals: 2,//小数位数
    }

    //出价面板
    bidPanel = [
        {
            title: '序号',
            key: 'indexKey',
            width: 80,
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
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
            title: '销售数量(单位)',
            key: 'num',
            dataIndex: 'num',
            className: 'text_right',
            width: 120,
            render: (text, record, index) => (
                <div className='text_right'>
                    <span className="reuse_money">{text} {record.unit}</span>
                </div>
            )
        },
        {
            title: '附件',
            key: 'filePath',
            dataIndex: 'filePath',
            width: 100,
            className: 'text_line4_td',
            render: (text, record, index) => (
                text ? <span>
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
            title: (
                <div className={less.offer} id="batchNode">
                    <div>当前报价(元)</div>
                </div>
            ),
            key: 'price',
            className: 'text_right',
            dataIndex: 'price',
            width: 100,
            render: (text, record, index) => {
                const { getFieldProps } = this.props.form;

                return (
                    <FormItem style={{ transform: 'translateY(13px)' }}>
                        <InputNumber
                            className='dqbj'
                            style={{ width: '100%' }}
                            {...this.config.priceConf}
                            {...getFieldProps(`${index}.price`, {
                                initialValue: record.price,
                                rules: [
                                    { required: this.state.bidData.status == 50, message: '请输入报价' },
                                ],
                                onChange: (el) => { this.offerChange(el, `${index}.price`) }
                            })}></InputNumber>
                    </FormItem>
                )
            }
        },
        {
            title: '总价(元)',
            key: 'sumAmt',
            className: 'text_right text_line1_td',
            dataIndex: 'sumAmt',
            width: 100,
            render: (text) => {
                return <span title={text}>{text}</span>
            }
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
            title: '参与竞价企业名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
            sorter: true
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
                    <span className="reuse_link" onClick={() => { this.toSceneOffr(record) }}>报价详情</span>
                )
            }
        },
    ]

    //统一处理 普通onChange事件
    valueChange = (el, label, propname = 'value') => {
        let quoteData = this.state.quoteData;
        let value = el;
        if (value && value.target) {
            quoteData[label] = el.target[propname]

            this.setState({
                quoteData
            })
        }
    }

    componentDidMount() {
        this._uuids = this.props.match.params.uuids;
        let fn = () => {
            if (this.props.userInfo.companyId) {
                clearTimeout(timer)
                this.initWebSocket(this._uuids, this.props.userInfo.companyId)
            } else {
                setTimeout(() => {
                    fn()
                }, 200);
            }
        }
        let timer = setTimeout(fn, 200);
        this.getSystemTime().finally(() => {
            this.handleInit()
        });
    }
    componentWillUnmount() {
        this.clearSceneCountDown()
    }

    lockReconnect = false;  //避免重复连接
    reconnect = (uuids, companyId) => {
        let _this = this;
        if (this.lockReconnect) {
            return;
        }
        this.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        this.tt = null;
        this.tt && clearTimeout(this.tt);
        this.tt = setTimeout(function () {
            _this.initWebSocket(uuids, companyId);
            _this.lockReconnect = false;
        }, 20000);
    }

    initWebSocket = (uuids, companyId) => {
        let socket;
        if (typeof (WebSocket) == "undefined") {
        } else {
        }
        let _this = this;
        let prefix = SystemConfig.systemConfigPath.jumpPlatforms('reuse/ws/') + uuids + '/' + companyId;
        socket = new WebSocket(prefix.replace('https', 'wss'), [CooKie.get('token')]);

        //连接打开事件
        socket.onopen = function () {
            socket.send(JSON.stringify({
                event: 'open'
            }));
            heartCheck.start();
        };
        //收到消息事件
        socket.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            if (data.type !== undefined) {
                if (data.type == 1) {
                    let rankData = data.rankInfo || {};
                    let bidData = _this.state.bidData;
                    let refreshUnifyPrice = toFixed(rankData.maxOffer, _this.config.decimals);
                    bidData.offerEndTime = data.offerEndTime;
                    this.setState({
                        systemTime: data.sysDate,
                        unifyPrice: refreshUnifyPrice,
                        step: bidData.adjustWay == 2 ? toFixed(bidData.increRange, this.config.decimals) : toFixed(rankData.maxOffer * bidData.increRange / 100, this.config.decimals)
                    }, () => {
                        setTimeout(() => {
                            this.setSceneCountDown();
                            this.props.form.setFieldsValue({
                                unifyPrice: refreshUnifyPrice
                            });
                            document.querySelector('.reuse_bidhall_price-input').querySelector('input.ant-input-number-input').value = refreshUnifyPrice
                        }, 100);
                    });
                    _this.setState({
                        bidData,
                        rankData,
                        ruleChecked: !!rankData.currentOffer,
                        bidRecordList: data.offerList
                    })
                } else {
                    let bidData = _this.state.bidData
                    bidData.bidStatus = data.bidStatus
                    bidData.status = data.status
                    _this.setState({
                        bidData
                    })
                }
            }
            heartCheck.start();
        };
        //连接关闭事件
        socket.onclose = function () {
            _this.reconnect(uuids, companyId);
        };
        //发生了错误事件
        socket.onerror = function () {
            _this.reconnect(uuids, companyId);
        }

        //窗口关闭时，关闭连接
        window.unload = function () {
            socket.close();
        };
        //心跳检测
        var heartCheck = {
            timeout: 50000,
            timeoutObj: null,
            serverTimeoutObj: null,
            start: function () {
                var self = this;
                this.timeoutObj && clearTimeout(this.timeoutObj);
                this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
                this.timeoutObj = setTimeout(function () {
                    //这里发送一个心跳，后端收到后，返回一个心跳消息，
                    //onmessage拿到返回的心跳就说明连接正常

                    socket.send(JSON.stringify({
                        event: 'heartbeat'
                    }));
                    self.serverTimeoutObj = setTimeout(function () {
                        //socket.close();
                    }, self.timeout);
                }, this.timeout)
            }
        }

        this.socket = socket
    }
    //初始化
    handleInit = () => {
        const search = this.props.history.location.search;
        if (search) {
            let params = getSearchByHistory(search);
            if (params.type) {
                this._type = params.type;
            }
        }
        this._uuids = this.props.match.params.uuids;
        if (this._uuids) {
            this.getBidData(this._uuids)
            this.getRankData(this._uuids)
            this.getRecordData(this._uuids)
        }
    }
    //获取系统时间
    getSystemTime = () => {
        return api.ajax('GET', '@/reuse/index/getSysDate')
            .then(res => {
                this.setState({
                    systemTime: res.data || new Date().getTime()
                }, () => {
                    //开启倒计时(不管数据过没过来都要开启倒计时)
                    this.setSceneCountDown()
                })
            }, err => {
                Util.alert(err.msg, { type: 'error' });
            })
    }
    //获取页面信息
    getBidData = (uuids) => {
        this.setState({
            spinning: true
        })
        if (!this._uuids) return;
        if (uuids) {
            api.ajax('GET', '@/reuse/sceneOffer/initBidHall', {
                sceneId: uuids
            }).then(res => {
                if (res.data) {
                    let panelList = [];
                    if (res.data.offer && res.data.offer.detailList) {
                        panelList = (res.data.offer.detailList || []).map(v => {
                            return {
                                ...v,
                                // 记录默认单价，用作后面比例结算
                                _unit: v.price || 0,
                                sumAmt: toFixed(v.sumAmt, this.config.decimals)
                            }
                        })
                    }
                    let scene = res.data.scene || {};
                    let offer = res.data.offer || {};
                    const quoteData = {
                        effectiveDate: offer.effectiveDate,
                        offerUserTel: offer.offerUserTel,
                        offerUserName: offer.offerUserName,
                        offerAmt: offer.offerAmt,
                        remark: offer.remark,
                        lastEffectiveOffer: offer.lastEffectiveOffer
                    };
                    const fileList = offer.fileList || [];
                    this.setState({
                        spinning: false,
                        bidData: scene,
                        panelList,
                        quoteData,
                        fileList,
                        explainLen: offer.remark ? offer.remark.length : 0,
                        sumOfferAmt: toFixed(offer.offerAmt, this.config.decimals),
                        step: scene.adjustWay == 2 ? toFixed(scene.increRange, this.config.decimals) : toFixed(offer.lastEffectiveOffer * scene.increRange / 100, this.config.decimals),
                    })
                    let values = {};
                    panelList.forEach((v, index) => {
                        values[`${index}.price`] = v.price
                    })
                    values = { ...values, ...quoteData };
                    this.props.form.setFieldsValue(values);
                } else {
                    this.setState({
                        spinning: false,
                        pageNormal: false
                    })
                }
            }, error => {
                this.setState({
                    spinning: false,
                    pageNormal: false
                })
                Util.alert(error.msg, { type: 'error' })
                setTimeout(() => {
                    closeWin()
                }, 1000)
            })
        }
    }
    //排名信息
    getRankData = (uuids) => {
        if (!this._uuids) return;
        let sceneId = uuids || this._uuids;
        api.ajax('GET', '@/reuse/sceneOffer/findRank', {
            sceneId
        }).then(res => {
            if (res.data) {
                let rankData = res.data || {};
                this.setState({
                    rankData,
                    ruleChecked: !!rankData.currentOffer,
                    unifyPrice: rankData.maxOffer ? toFixed(rankData.maxOffer, this.config.decimals) : toFixed(rankData.lastOfferAmt, this.config.decimals)
                }, () => {
                    setTimeout(() => {
                        document.querySelector('.reuse_bidhall_price-input').querySelector('input.ant-input-number-input').value = this.state.unifyPrice
                    }, 100);
                })
            }
        }, err => {
            Util.alert(err.msg, { type: 'error' })
        })
    }
    //竞价记录
    getRecordData = (uuids, param = {}) => {
        if (!this._uuids) return;
        let params = {
            sceneId: uuids || this._uuids,
            flag: this._flag,
            ...param
        }
        api.ajax('GET', '@/reuse/sceneOffer/offerList', params)
            .then(res => {
                if (res.data) {
                    this.setState({
                        bidRecordList: res.data
                    })
                }
            }, err => {
                Util.alert(err.msg, { type: 'error' })
            })
    }
    //报价-change
    offerChange = (el, label) => {
        const labelArr = label.split('.');
        let panelList = this.state.panelList;

        if (el && el.target) {
            panelList[labelArr[0]][labelArr[1]] = el.target.value
        } else {
            panelList[labelArr[0]][labelArr[1]] = el || 0
        }

        if (labelArr[1] === 'price') {
            panelList[labelArr[0]].sumAmt = toFixed(panelList[labelArr[0]].price * panelList[labelArr[0]].num, this.config.decimals);
        }
        this.setUnifyPrice(panelList)
        this.setState({
            panelList
        }, () => {
            setTimeout(() => {
                let inputs_dqcj = document.querySelectorAll('.dqbj')
                panelList.forEach((ele, index) => {
                    inputs_dqcj[index].querySelector('input.ant-input-number-input').value = toFixed(ele.price, 2)
                })
            }, 100);
        })
    }

    //验证
    explainValid = (rule, value, callback) => {
        if (value && value.length > this.config.explainMaxLen) {
            this.setState({
                explainLen: value.length
            })
            callback(new Error('说明信息已超出文本限制'))
        } else {
            this.setState({
                explainLen: value && value.length || 0
            })
            callback()
        }
    }

    //批量设置价格
    openBatchPrice = () => {
        this.setState({
            batchVisible: !this.state.batchVisible
        })
    }
    //批量设置价格-确认
    setBatchPrice = () => {
        const { batchPrice, batchPriceRatio, batchPriceType } = this.state;
        if (batchPriceType == '1' && !batchPrice) {
            Util.alert('请输入统一调价')
            return;
        }
        if (batchPriceType == '2' && !batchPriceRatio) {
            Util.alert('请输入统一调比例')
            return;
        }

        let panelList = this.state.panelList;
        let batchPriceSum = 0;

        panelList = panelList.map(v => {
            if (batchPriceType == '1') {
                v.price = batchPrice;
            }
            if (batchPriceType == '2') {
                v.price = toFixed(v._unit * (1 + batchPriceRatio / 100), this.config.decimals);
            }
            v.sumAmt = toFixed(v.price * v.num, this.config.decimals);
            batchPriceSum += (+v.sumAmt)
            return v
        })
        batchPriceSum = toFixed(batchPriceSum, this.config.decimals)
        this.setUnifyPrice(panelList)
        this.setState({
            panelList,
            batchVisible: false,
            batchPriceSum,
        }, () => {
            this.setPanelListView()
            Util.alert('设置成功', { type: 'success' })
        })
    }
    //批量设置价格-统一调价onchange
    batchPriceChange = (num) => {
        let batchPriceSum = 0;
        if (isNormal(num)) {
            this.state.panelList.forEach(v => {
                let sumAmt = toFixed(num * v.num, this.config.decimals)
                batchPriceSum += (+sumAmt)
                //batchPriceSum += num * v.num
            })
        }

        batchPriceSum = toFixed(batchPriceSum, this.config.decimals);

        this.setState({
            batchPrice: num,
            batchPriceSum
        })
    }
    //批量设置价格-统一调比例onchange
    batchPriceRatioChange = (num) => {
        let batchPriceSum = 0;
        if (isNormal(num)) {
            this.state.panelList.forEach(v => {
                let price = toFixed(v._unit * (1 + num / 100), this.config.decimals);
                let sumAmt = toFixed(price * v.num, this.config.decimals)
                batchPriceSum += (+sumAmt)
                //batchPriceSum += (1 + num / 100) * v._unit * v.num
            })
        }
        batchPriceSum = toFixed(batchPriceSum, this.config.decimals);

        this.setState({
            batchPriceRatio: num,
            batchPriceSum
        })
    }
    //批量设置价格type
    batchPriceTypeChange = (el) => {
        let value = el.target.value
        this.setState({
            batchPriceType: value
        })
    }

    //基本场次信息
    createBaseInfo = () => {
        const { bidData, baseInfoHeight } = this.state;
        const { span } = this.config;
        let statusStyle = {};
        if (bidData.status) {
            statusStyle = _MAINBIDOBJ[bidData.status].style;
        }
        return (
            <div>
                <div style={{ height: baseInfoHeight, overflow: 'hidden' }}>
                    <Row className={less.titleInfo}>
                        <Col span={20}>
                            <p className={less.title_text} style={{ wordBreak: 'break-all' }}>{bidData.title}</p>
                        </Col>
                        <Col span={4}>
                            <div className={less.title_status}>
                                <p className={less.main} style={statusStyle}>{bidData.bidStatus}</p>
                                <p className={less.note}>{bidData.bidStatusStr}</p>
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
                    <Row className="reuse_row">
                        <Col className="reuse_label" span={span[0]}>竞价分类</Col>
                        <Col className="reuse_value" span={span[1]}>{bidData.classifyName || '--'}</Col>
                    </Row>
                    <Row className="reuse_row">
                        <Col className="reuse_label" span={span[0]}>应用领域</Col>
                        <Col className="reuse_value" span={span[1]}>{this.filterUseArea(bidData.useArea)}</Col>
                    </Row>
                    <Row className="reuse_row">
                        <Col className="reuse_label" span={span[0]}>存储时间</Col>
                        <Col className="reuse_value" span={span[1]}>{bidData.storageWayStr}/{bidData.storageTime}天</Col>
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
                        <Col className="reuse_value" span={span[1]}>{bidData.khStartTime}<span style={{ margin: '0 10px' }}>-</span>{bidData.khEndTime}</Col>
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
                <Row className={less.open}>
                    <div className={less.more} onClick={this.baseInfoToggle}>
                        <span>
                            收起&nbsp;
                            <Icon className={baseInfoHeight ? less.open_icon : less.close_icon} type="double-right"></Icon>
                        </span>
                    </div>
                </Row>
            </div>
        )
    };
    //点击隐藏基本信息
    baseInfoToggle = () => {
        let baseInfoHeight = this.state.baseInfoHeight;
        if (baseInfoHeight) {
            this.setState({
                baseInfoHeight: null
            })
        } else {
            this.setState({
                baseInfoHeight: 70
            })
        }
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

    //出价面板
    createPanel = () => {
        const { bidData, panelList, explainLen, rankData, fileList } = this.state;
        const { scroll, size, col6, commonStyle, explainMaxLen, autosize, inputPrice } = this.config;
        const { getFieldProps } = this.props.form;

        return (
            <div>
                <Table dataSource={panelList}
                    columns={this.bidPanel}
                    scroll={scroll}
                    pagination={false} />
                <div className={less.amt}>
                    <Row gutter={20}>
                        <Col span={20}>
                            <span className={less.amt_label}>总价</span>
                        </Col>
                        <Col span={4}>
                            <div className={[less.amt_value, 'font16'].join(' ')}>￥{toLocaleString(this.state.sumOfferAmt)}</div>
                        </Col>
                    </Row>
                </div>
                <div className={less.top}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <div className="reuse_tag">
                                <p style={{ fontWeight: 'bold' }}>竞价规则</p>
                                <p>1.首次出价需高于开盘价。</p>
                                <p>2.出价金额需高于当前最高报价加最低调价幅度。</p>
                                <p>3.若已开启自动延长规则，则买方在竞价结束前2分钟出价后，竞价结束时间将会自动延时5分钟。</p>
                                <p>4.统一出价将与上方出价面板中总价金额保持一致，如手动调整统一出价，系统将自动计算出差额并将差额部分平均分配至单价中。</p>
                                <p>5.若买方在交易过程中有违规行为，销售方有权自行处置履约保证金。</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={less.currentInfo}>
                                <Row>
                                    <Col className={less.time} span={12}>
                                        <div className={less.time_text} id="countDown"></div>
                                    </Col>
                                    <Col className={less.rank} span={12}>
                                        <Col className={less.rank_label} span={16}>当前报价排名</Col>
                                        <Col className={less.rank_value} span={8}>第 {rankData.rank || '-'} 名</Col>
                                    </Col>
                                </Row>
                            </div>
                            <div className={less.price}>
                                <div className={less.price_item}>
                                    <p className={less.price_title}>当 前 最 高 价 格</p>
                                    <p className={less.price_max}>
                                        <span className="font16">￥{rankData.maxOffer ? toLocaleString(toFixed(rankData.maxOffer, this.config.decimals)) : '-'}</span>
                                    </p>
                                </div>
                                <div className={less.price_item}>
                                    <p className={less.price_title}>您 当 前 出 价</p>
                                    <p className={less.price_my}>
                                        <span className="font16">￥{rankData.currentOffer ? toLocaleString(toFixed(rankData.currentOffer, this.config.decimals)) : '-'}</span>
                                    </p>
                                </div>
                                <div className={less.price_item}>
                                    <p className={less.price_title}>出 价 差 额</p>
                                    <p>
                                        {/* <span className={less.price_diff}>{rankData.differ}</span> */}
                                        <span className={[less.price_diff_up, 'font16'].join(' ')}>{toLocaleString(toFixed(rankData.differ, this.config.decimals))}</span>
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className={less.center}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <FormItem label="报价有效期" {...col6}>
                                <DatePicker
                                    className="reuse_hallTime"
                                    style={commonStyle}
                                    {...getFieldProps('effectiveDate', {
                                        rules: [
                                            { required: this.state.bidData.status == 50, message: '请选择报价有效期' },
                                        ],
                                        onChange: (el) => { this.valueChange(el, 'effectiveDate') }
                                    })}
                                    disabledDate={this.filterEffectveDate}
                                    showToday={false}
                                    size={size}>
                                </DatePicker>
                            </FormItem>
                            <FormItem label="报价人电话" {...col6}>
                                <Input
                                    style={commonStyle}
                                    {...getFieldProps('offerUserTel', {
                                        initialValue: this.props.userInfo.phone,
                                        rules: [
                                            { required: this.state.bidData.status == 50, message: '请输入电话号码' },
                                            { validator: validatorRules.teleAndMobile },
                                        ],
                                        onChange: (el) => { this.valueChange(el, 'offerUserTel') }
                                    })}
                                    placeholder="请输入电话号码"
                                    size={size}>
                                </Input>
                            </FormItem>
                            <FormItem label="报价联系人" {...col6}>
                                <Input
                                    style={commonStyle}
                                    {...getFieldProps('offerUserName', {
                                        initialValue: this.props.userInfo.username,
                                        rules: [
                                            { required: this.state.bidData.status == 50, message: '请输入报价联系人' },
                                        ],
                                        onChange: (el) => { this.valueChange(el, 'offerUserName') }
                                    })}
                                    placeholder="请输入联系人"
                                    size={size}>
                                </Input>
                            </FormItem>

                        </Col>
                        <Col span={8}>
                            <FormItem label="报价附件" {...col6}>
                                <UploadFile
                                    uploadSuccess={this.fileListSuccess}
                                    disabled={fileList.length >= 5}>
                                    <Button disabled={fileList.length >= 5} type="ghost" icon="upload">上传附件</Button>
                                </UploadFile>
                            </FormItem>
                            <div>
                                <p className="reuse_tip">最多上传5个格式为doc、xlsx、pdf、jpg、png单个文件，体积小于5MB的文件</p>
                                <Row className={less.files}>
                                    {
                                        fileList.map((v, index) => {
                                            return (
                                                <Col span={12} key={v.filePath} className={less.files_item}>
                                                    <a className="reuse_link"
                                                        href="javascript:void(0);"
                                                        onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath))}
                                                    >
                                                        <Icon type="paper-clip" />
                                                        <span>{v.fileName}</span>
                                                    </a>
                                                    <Icon
                                                        className={less.files_del}
                                                        type="cross-circle"
                                                        onClick={() => { this.fileListDel(v, index) }} />
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </div>
                        </Col>
                        <Col span={8}>
                            <FormItem className={less.explain} label="报价信息说明" style={{ marginBottom: 0 }}>
                                <Input
                                    className={less.explain_input}
                                    type="textarea"
                                    {...getFieldProps('remark', {
                                        rules: [
                                            { required: this.state.bidData.status == 50, message: '请输入报价信息说明' },
                                            { validator: this.explainValid },
                                        ],
                                        onChange: (el) => { this.valueChange(el, 'remark') }
                                    })}
                                    autosize={autosize}
                                    size={size}
                                    maxLength={explainMaxLen}
                                    placeholder="请输入">
                                </Input>
                                <span className={less.explain_len}>{explainLen}/{explainMaxLen}</span>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                <div className={less.bottom}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Row gutter={20} className={less.range}>
                                <Col span={8} className={less.range_item}>
                                    <p>开盘价：</p>
                                    <p>￥{bidData.startPrice}</p>
                                </Col>
                                <Col span={8} className={less.range_item}>
                                    <p>最低调价幅度：</p>
                                    <p>{bidData.adjustWay == '1' ? ((bidData.increRange || '-') + '%') : ('￥' + (bidData.increRange || '-') + '/次')}</p>
                                </Col>
                                <Col span={8} className={less.range_item}>
                                    <p>报价次数：</p>
                                    <p>{rankData.offerNum}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row className={less.inputPrice}>
                                <Col span={2}></Col>
                                <Col span={6} className={less.inputPrice_label}>
                                    <div id="tipNode" style={{ position: 'relative' }}>
                                        {/* <Popover
                                            title={
                                                <span style={{ fontSize: '14px' }}>
                                                    <Icon style={{ color: '#f50' }} type="info-circle" />
                                                    <span> 提示 </span>
                                                </span>
                                            }
                                            content={
                                                <p>
                                                    首次报价请使用
                                                    <span className="reuse_link" onClick={this.toBatchPriceBtn}>批量设置</span>
                                                    价格或
                                                    <span className="reuse_link" onClick={this.toRowPrice}>逐条物资输入</span>
                                                    价格
                                                </p>
                                            }
                                            visible={this.state.tipVisible}
                                            onVisibleChange={this.tipVisibleChange}
                                            getTooltipContainer={() => { return document.querySelector('#tipNode') }}
                                            trigger="click">
                                        </Popover> */}
                                        <div>统一出价</div>
                                    </div>
                                </Col>
                                <Col span={14} className={less.inputPrice_value}>
                                    <InputNumber
                                        className="reuse_bidhall_price-input"
                                        {...inputPrice}
                                        step={this.state.step}
                                        {...getFieldProps('unifyPrice', {
                                            initialValue: this.state.unifyPrice,
                                            onChange: this.priceInputChange,
                                        })}
                                    // disabled={!rankData.currentOffer || rankData.currentOffer <= 0}
                                    ></InputNumber>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row gutter={28} className={less.priceBtn}>
                                <Col span={13}>
                                    <Checkbox checked={this.state.ruleChecked}
                                        onChange={() => { this.setState({ ruleChecked: !this.state.ruleChecked }) }}>
                                        <span>我已阅读并同意遵守</span>
                                    </Checkbox>
                                    <a href="javascript:void(0)" className={less.rules} onClick={this.openRule}>《铁建商城循环物资竞价规则》</a>
                                </Col>
                                <Col span={11}>
                                    <button type="button"
                                        id="offerPriceBtn"
                                        disabled={this.state.bidData.status > 50}
                                        className={less.btn}
                                        onClick={this.offerPrice}>出价</button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
    //打开规则
    openRule = (el) => {
        this.setState({
            ruleVisible: true,
            ruleChecked: true
        })
    }
    //无法选择的时间
    filterEffectveDate = (cur) => {
        return cur && cur.time < new Date();
    }
    //滚动到批量设置
    toBatchPriceBtn = () => {
        this.props.toScrollTop({ target: '#batchPriceBtn', offsetY: -20 }, () => {
            this.setState({
                tipVisible: false,
                batchPriceBtnVisible: true
            })
        })
    }
    //滚动到逐条输入
    toRowPrice = () => {
        this.props.toScrollTop({ target: '#batchPriceBtn', offsetY: 40 }, () => {
            this.setState({
                tipVisible: false
            })
        })
    }
    //提示框onchang
    tipVisibleChange = (tipVisible) => {
        this.setState({
            tipVisible
        })
    }
    //统一出价onchange
    priceInputChange = (val) => {
        // 初始统一出价不能小于最高有效报价
        const maxOffer = this.state.rankData.maxOffer;
        if (val < maxOffer) {
            this.setState({
                unifyPrice: maxOffer
            }, () => {
                this.props.form.setFieldsValue({
                    unifyPrice: this.state.unifyPrice
                })
            })
        } else {
            this.setGoodsPrice(val);
        }
    }
    // 求和
    sum = (arr) => {
        if (!arr.length) return 0;
        return arr.reduce(function (prev, curr) {
            return prev + curr;
        })
    };
    //计算比例并设置个每个商品
    setGoodsPrice = (num) => {
        // if (!num) return;
        const currentOffer = this.state.rankData.currentOffer || this.state.quoteData.offerAmt;//当前最大出价
        if (currentOffer) {
            let ratio = (num - currentOffer) / currentOffer;// 比例 = (输入价格 - 当前最大出价) / 当前最大出价
            // 给商品每条数据 price 按比例增加
            let panelList = this.state.panelList;
            let AllSum = 0
            panelList.forEach(v => {
                if (v.num) {
                    let price = v._unit * (1 + ratio)
                    v.price = toFixed(price, this.config.decimals);
                    v.sumAmt = toFixed(v.price * v.num, this.config.decimals);
                    AllSum += (+v.sumAmt)
                }
            })
            // let AllSum = this.sum(panelList.map(value => {
            //     return value.num * value.price
            // }));
            this.setState({
                panelList,
                unifyPrice: toFixed(AllSum, 2),
                sumOfferAmt: toFixed(AllSum, 2)
                //step: this.state.bidData.adjustWay == 2 ? this.state.step : toFixed(AllSum * this.state.bidData.increRange / 100, this.config.decimals)
            }, () => {
                this.setPanelListView()

                setTimeout(() => {
                    document.querySelector('.reuse_bidhall_price-input').querySelector('input.ant-input-number-input').value = this.state.unifyPrice
                }, 100);
            })
        } else {
            let panelList = this.state.panelList;
            let goods_num = panelList.map(ele => ele.num).reduce((total, item) => total + item)
            let price = num / goods_num
            let AllSum = 0
            panelList = panelList.map(v => {
                if (v.num) {
                    v.price = toFixed(price, 2)
                    v.sumAmt = toFixed(v.price * v.num, this.config.decimals);
                    AllSum += (+v.sumAmt)
                }
                return v
            })
            // let AllSum = this.sum(panelList.map(value => {
            //     return value.price * value.num
            // }));
            this.setState({
                panelList,
                unifyPrice: toFixed(AllSum, 2),
                sumOfferAmt: toFixed(AllSum, 2)
                //step: this.state.bidData.adjustWay == 2 ? this.state.step : toFixed(AllSum * this.state.bidData.increRange / 100, this.config.decimals)
            }, () => {
                this.setPanelListView()
                setTimeout(() => {
                    document.querySelector('.reuse_bidhall_price-input').querySelector('input.ant-input-number-input').value = this.state.unifyPrice
                }, 100);
            })
        }

    }
    //视图更新panelList
    setPanelListView = () => {
        // TO_DO（此处填坑）虽然本地数据panelList得到了更新，但是this.props.form里面的`${index}.price`数据没有得到更新
        // 这种情况会在 `${index}.price` 已存在的情况下出现，即我在商品列表的输入框有过输入改变
        // (如果没有触发改变事件 this.props.form.validateFields 得到的也会是空的)
        let priceParams = {};
        this.state.panelList.forEach((v, index) => {
            priceParams[`${index}.price`] = v.price
        })
        this.props.form.setFieldsValue({ ...priceParams, sumOfferAmt: toFixed(this.state.sumOfferAmt, this.config.decimals) })
        this.props.form.setFieldsValue({ ...priceParams, unifyPrice: toFixed(this.state.unifyPrice, this.config.decimals) })
    }

    //商品价格变化，计算总价-
    setUnifyPrice = (arr) => {
        let panelList = [...arr];
        let unifyPrice = 0;
        panelList = panelList.forEach(v => {
            if (v.price && v.num) {
                let sumAmt = toFixed(v.price * v.num, this.config.decimals)
                unifyPrice += (+sumAmt)
            }
        })
        unifyPrice = toFixed(unifyPrice, this.config.decimals)
        this.setState({
            unifyPrice,
            sumOfferAmt: unifyPrice
            //step: this.state.bidData.adjustWay == 2 ? this.state.step : toFixed(unifyPrice * this.state.bidData.increRange / 100, this.config.decimals)
        }, () => {
            this.props.form.setFieldsValue({
                unifyPrice: this.state.unifyPrice,
                sumOfferAmt: this.state.sumOfferAmt
            })
        })
    }
    //上传成功
    fileListSuccess = (file) => {
        let fileList = this.state.fileList;
        fileList.push(filePathDismant(file.response.data))
        this.setState({
            fileList
        })
    }
    //删除附件
    fileListDel = (item, index) => {
        let that = this;

        Util.confirm('删除附件', {
            tip: `确定删除附件 ${item.fileName} ?`,
            iconType: 'del',
            onOk() {
                let fileList = that.state.fileList;
                fileList.splice(index, 1)

                that.setState({
                    fileList
                })
            }
        })
    }
    //点击查看附件

    //场次倒计时
    setSceneCountDown = () => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
        let dom = document.querySelector('#countDown');
        let offerPriceBtn = document.querySelector('#offerPriceBtn');
        let systemTime = this.state.systemTime;
        this.sceneCountDownTimer = setInterval(() => {
            systemTime += 1000;

            const { bidData } = this.state;
            let start = bidData.offerStartTime;
            let end = bidData.offerEndTime;
            if (!start || !end) return;
            if (!systemTime) {
                systemTime = this.state.systemTime;
                return;
            }
            start = new Date(start).getTime();
            end = new Date(end).getTime();
            let text = '', format, saveBtn = '报价';
            if (systemTime <= start) {
                format = FormatDate.formatTimeCountDown(start - systemTime);
                text = `距离场次开始：${format.d}${format.h}时${format.m}分${format.s}秒`;
                saveBtn = '预报价';
            } else if (systemTime > start && systemTime <= end) {
                format = FormatDate.formatTimeCountDown(end - systemTime);
                text = `距离场次结束：${format.d}${format.h}时${format.m}分${format.s}秒`;
                saveBtn = '报价';
            } else if (systemTime > end) {
                text = '场次已结束'
            }
            //TO_DO（此处填坑）不用 state 里面的字段来实现实时刷新，
            //是应为倒计时，会影响InputNumber组件的onChange事件(其他组件有没有影响并未测试)
            if (dom) dom.innerHTML = text;
            if (offerPriceBtn) offerPriceBtn.innerHTML = saveBtn;
            // if(systemTime > end) {
            //     this.clearSdomceneCountDown()
            // }
        }, 1000)
    }
    //清除场次倒计时
    clearSceneCountDown = () => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
    }
    //报价参数处理
    handleOfferParams = (props) => {
        let params = {};
        params.offerUserTel = props.offerUserTel;
        params.offerUserName = props.offerUserName;
        params.remark = props.remark;
        props.effectiveDate && (params.effectiveDate = moment(props.effectiveDate).format('YYYY-MM-DD'));
        params.fileList = JSON.stringify(this.state.fileList);
        params.detailList = JSON.stringify(this.state.panelList);
        params.sceneId = this._uuids;

        return params
    }
    //报价-预报价
    offerPrice = () => {
        let _this = this;
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                //开盘价-最低调价幅度模式-最低调价值
                const { startPrice, adjustWay, increRange } = this.state.bidData;

                //当前出价-最大有效价
                const { currentOffer, maxOffer } = this.state.rankData;
                //获取商品总价
                // const priceArr = this.state.panelList.map(v => v.sumAmt || 0);
                // const priceSum = priceArr.reduce((total, num) => total + num);
                const priceSum = this.state.unifyPrice;

                //阅读都选规则
                if (!this.state.ruleChecked) {
                    //如果是第一次出价就弹出规则并勾选
                    if (!currentOffer) {
                        this.setState({
                            ruleChecked: true,
                            ruleVisible: true,
                        })
                    } else {
                        //否则就提示勾选
                        Util.alert('请勾选《铁建商城循环物资竞价规则》', { type: 'error' })
                    }
                    return;
                }

                //是否小于开盘价(startPrice = 0 是无限制)
                if (startPrice > 0 && priceSum < startPrice) {
                    Util.alert(`报价不得小于开盘价格 ${startPrice}元`, { type: 'error' })
                    return;
                }

                //第一次出价之后判断最低调价幅度
                if (currentOffer && maxOffer) {
                    //按百分百
                    if (adjustWay == '1' && ((priceSum - maxOffer) / maxOffer * 100) < increRange) {
                        Util.alert(`调价幅度不能小于 ${increRange}%`, { type: 'error' })
                        return;
                    }
                    //按固定价格
                    if (adjustWay == '2' && priceSum - maxOffer < increRange) {
                        Util.alert(`调价幅度不能小于 ${increRange}元`, { type: 'error' })
                        return;
                    }
                }
                if (priceSum < maxOffer) {
                    Util.alert(`报价不得小于当前最高价格 ${maxOffer}元`, { type: 'error' })
                    return;
                }
                let params = this.handleOfferParams(values);
                params.offerAmt = priceSum;

                //添加确认框
                confirm({
                    width: 600,
                    title: '报价确认框',
                    content: <p>您当前报价总价为<span style={{color: 'red', fontSize: '15px', fontWeight: 'bold', padding: '0 3px 0 3px'}}>{toLocaleString(priceSum)}</span>元，增幅比例为<span style={{color: 'red', fontSize: '15px', fontWeight: 'bold', padding: '0 3px 0 3px'}}>{_this.getPercent(priceSum, maxOffer)}</span> ，请确认当前报价。</p>,
                    onOk() {
                        _this.submitData(params);
                    },
                });

            } else {
                Util.alert('请填写完整的信息！')
            }
        })
    }
    //点击只看自己
    flagChange = (e) => {
        if (e.target.checked) {
            this._flag = '1'
            this.socket.send('flag=1')
        } else {
            this._flag = null
            this.socket.send('flag=0')
        }
        this.getRecordData()
    }

    //导出商品清单
    epxortGoodsList = () => {
        if (!this._uuids) return;
        window.open(configs.exportUrl + '/reuse/sceneGoods/exportData?sceneId=' + this._uuids)
    }

    //报价详情
    toSceneOffr = (tr) => {
        if (!tr.sceneId || !tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/desk/sceneOffer/' + tr.sceneId + '?offerId=' + tr.uuids))
    }

    sortChange = params => {
        this.getRecordData(this._uuids, params)
    }

    //
    submitData=(params)=>{
        api.ajax(
            'POST',
            '@/reuse/sceneOffer/offer',
            params,
            {
                headers: {
                    'Sub-Platform': this._type === 'mall' ? '0' : null
                }
            }
        ).then(
            res => {
                if (res.code == '000000') {
                    this.getRankData();
                    this.handleInit()
                }
                Util.alert(res.msg || '出价成功', { type: 'success' })
            }, error => {
                // this.handleInit();
                Util.alert(error.msg || '出价失败', { type: 'error' })
            }
        )
    }

    //计算比例
    getPercent = (num, total) => {
        if(total == undefined) return '-';
        console.log('getPercent ----------------- ', num, total)
        let round = Math.round((num-total) / total * 10000) / 100
        return round + '%';
    }

    render() {
        const { bidRecordList, bidData } = this.state;
        const colspan = {
            labelCol: {
                span: 9
            },
            wrapperCol: {
                span: 15
            },
        }
        return (
            <div className={less.bidHall} >
                <Spin spinning={this.state.spinning}>
                    <Form className="reuse_baseForm_label no-number-btn">
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价单基本信息</div>
                            <div>{this.createBaseInfo()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className={less.panel}>
                                <div className="reuse_baseTitle">
                                    <span>出价面板</span>
                                    <span className={less.titleBtn}>
                                        <div style={{ display: 'inline-block', textAlign: 'center', width: '110px' }}>
                                            <div id="batchPriceBtn"
                                                className="reuse_link"
                                                onClick={this.openBatchPrice}>批量设置价格</div>
                                            <Popover
                                                content={
                                                    <p>点击此处 <span className="color_a">批量设置价格</span></p>
                                                }
                                                visible={this.state.batchPriceBtnVisible}
                                                onVisibleChange={(boo) => this.setState({ batchPriceBtnVisible: boo })}
                                                trigger="click">
                                                <div></div>
                                            </Popover>
                                        </div>
                                        <Button type="primary" size="small" onClick={this.epxortGoodsList}>导出商品清单</Button>
                                    </span>
                                </div>
                                <div>{this.createPanel()}</div>
                            </div>
                        </Card>

                        <Card className="mt10">
                            <div className="reuse_baseTitle">
                                <span>竞价记录</span>
                                <span className={less.onlyself}>
                                    <Checkbox onChange={this.flagChange}>只看自己</Checkbox>
                                </span>
                            </div>
                            <div className={less.open}>
                                <ToggleTable no_selection={true}
                                    sortChange={this.sortChange}
                                    dataSource={bidRecordList}
                                    columns={this.bidRecord}></ToggleTable>
                            </div>
                        </Card>

                        <Modal
                            title="《铁建商城循环物资竞价规则》"
                            visible={this.state.ruleVisible}
                            width={1000}
                            maskClosable={false}
                            onOk={() => { this.setState({ ruleVisible: false, ruleChecked: true }) }}
                            onCancel={() => { this.setState({ ruleVisible: false }) }}>
                            <div>
                                <img src={pdf} width={'100%'} alt="" />
                            </div>
                        </Modal>

                        <Modal
                            title="批量设置价格"
                            visible={this.state.batchVisible}
                            onOk={this.setBatchPrice}
                            width={650}
                            maskClosable={false}
                            closable={false}
                            onCancel={() => { this.setState({ batchVisible: false }) }}>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="调价方式" {...colspan}>
                                        <RadioGroup
                                            onChange={this.batchPriceTypeChange}
                                            defaultValue={this.state.batchPriceType}>
                                            <RadioButton value="1">统一调价</RadioButton>
                                            <RadioButton value="2">统一调比例</RadioButton>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col span={12}></Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="统一调价" {...colspan} className="no-number-btn">
                                        <InputNumber
                                            min={1}
                                            disabled={this.state.batchPriceType != '1'}
                                            style={{ width: '80%' }}
                                            {...this.config.priceConf}
                                            defaultValue={this.state.batchPrice}
                                            onChange={this.batchPriceChange}
                                            size="large"></InputNumber>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="统一调比例" {...colspan} className="no-number-btn">
                                        <InputNumber
                                            min={1}
                                            disabled={this.state.batchPriceType != '2'}
                                            style={{ width: '80%' }}
                                            {...this.config.priceConf}
                                            defaultValue={this.state.batchPriceRatio}
                                            onChange={this.batchPriceRatioChange}
                                            size="large"></InputNumber>
                                        <span>%</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="最低调价幅度" {...colspan}>
                                        <span>{bidData.adjustWay == '1' ? ((bidData.increRange || '-') + '%') : ((bidData.increRange || '-') + '元')}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="调价后总价格" {...colspan}>
                                        <span>{this.state.batchPriceSum}元</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Modal>
                    </Form>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        userInfo: state.authReducer.userInfo || {}
    }
}
export default Form.create()(connect(mapStateToProps)(BidHall))
