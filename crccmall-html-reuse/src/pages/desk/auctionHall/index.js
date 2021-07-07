import React from 'react';
import { Card, Row, Col, Form, Input, InputNumber, DatePicker, Checkbox, Button, Icon, Table, Popover, Modal, Radio, Spin } from 'antd';
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
import BaseTable from '@/components/baseTable';
import download from "business/isViewDown";
import pdf from "business/desk/hall/0002.jpg";
import { getSearchByHistory } from "@/utils/urlUtils";
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
class auctionHall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            step: 0,
            pageNormal: true,
            systemTime: null,//系统时间
            spinning: false,
            baseInfoHeight: 70,//基本信息样式
            quoteData: {},
            bidData: {},//主数据
            rankData: {},//排名数据
            bidRecordList: [],//竞价记录列表
            topLtitle:"暂无",
            topLNum:"暂无",
            N:"0",//第N次出价
            offerButtonShow:"none",
            topRtitle:"",
            sceneStartTime:"",
            sceneEndTime:"",
            signPurchaserLoading: false,//已报名采购商loading
            signPurchaserList: [],//已报名采购商数据
            bidRecordLoading: false,//竞价记录loading
            sceneCountDownText: '',//场次倒计时-显示
            sceneTotleText: '',//场次倒报价用时
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


    getSignPurchaser
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
            title: '竞买人企业名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
            sorter: true
        },
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
            title: '税额',
            key: 'taxRate',
            dataIndex: 'taxRate',
            className: 'text_right',
            sorter: true,
            render: t => <span>{toFixed(t, 2)}</span>
        },
        {
            title: '税价合计',
            key: 'offerAmt',
            dataIndex: 'offerAmt',
            className: 'text_right',
            sorter: true,
            render: t => <span>{toFixed(t, 2)}</span>
        },
        {
            title: '单位价格',
            key: 'unitPrice',
            dataIndex: 'unitPrice',
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
                    <span className="reuse_link" onClick={() => { this.toSceneOffr(record) }}>查看报价</span>
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

    baseParams = {
        sceneId:this.props.match.params.uuids,
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
            this.getSignPurchaser()
            this.getBidRecord(this._uuids)
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
        console.log(1)
        this.setState({
            spinning: true
        })
        if (!this._uuids) return;
        if (uuids) {
            api.ajax('GET', '@/reuse/saleScene/initBidHall', {
                sceneId: uuids
            }).then(res => {
                if (res.data) {
                    let scene = res.data.scene || {};
                    this.setState({
                        bidData: scene,
                        topRtitle:scene.title,
                        sceneStartTime:scene.offerStartTime,
                        sceneEndTime:scene.offerEndTime
                    })
                    if(res.data.offer){
                        let offer = res.data.offer || {};
                        this.setState({
                            topLNum :offer.offerAmt+"",
                            topLtitle:offer.buyerCompanyName,
                            N:offer.offerCount,
                            offerButtonShow:"block",
                        })
                    }
                    this.setState({
                        spinning: false,
                        pageNormal: false
                    })
                } else {
                   
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
    //获取竞价记录
    getBidRecord = (params = {}) => {
        const uuids = this.props.match.params.uuids;
        if (!uuids) return;
        this.setState({
            bidRecordLoading: true,
        })
        api.ajax('GET', '@/reuse/sceneOffer/findList', {
            sceneId: uuids,
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
                bidRecordList: res.data || [],
                bidRecordLoading: false,
                sceneTotleText,
            })
        }).catch(res => {
            this.setState({
                bidRecordLoading: false,
            })
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

    //获取已报名采购商
    getSignPurchaser = (params = {}) => {
        const uuids = this.props.match.params.uuids;
        if (!uuids) return;
        this.setState({
            signPurchaserLoading: true,
        })
        api.ajax('GET', '@/reuse/buyScene/findBidderList', {
            sceneId: uuids,
            ...params
        }).then(res => {
            this.setState({
                signPurchaserList: res.data || [],
                signPurchaserLoading: false,
            })
        }).catch(res => {
            this.setState({
                signPurchaserLoading: false,
            })
        })
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



    //场次倒计时
    setSceneCountDown = () => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
        let dom = document.querySelector('#countDown');
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
            } else if (systemTime > start && systemTime <= end) {
                format = FormatDate.formatTimeCountDown(end - systemTime);
                text = `距离场次结束：${format.d}${format.h}时${format.m}分${format.s}秒`;
            } else if (systemTime > end) {
                text = '场次已结束'
            }
            //TO_DO（此处填坑）不用 state 里面的字段来实现实时刷新，
            //是应为倒计时，会影响InputNumber组件的onChange事件(其他组件有没有影响并未测试)
            if (dom) dom.innerHTML = text;
            // if(systemTime > end) {
            //     this.clearSdomceneCountDown()
            // }
        }, 1000)
    }
    //清除场次倒计时
    clearSceneCountDown = () => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
    }



    //报价详情
    toSceneOffr = (tr) => {
        if (!tr.sceneId || !tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/desk/sceneOffer/' + tr.sceneId + '?offerId=' + tr.uuids))
    }

    sortChange = params => {
        this.getRecordData(this._uuids, params)
    }



    //金额格式化
    formatNumber = (str) => {
        let arr = [],
        count = str.length
        while (count >= 3) {
          arr.unshift(str.slice(count - 3, count))
          count -= 3
        }
        str.length % 3 && arr.unshift(str.slice(0, str.length % 3))
        return arr.toString()
      }
    //截短标题前后20个字符
    substrtitle = (str,num) => {
        let n = num*2+3
        if(str && str.length>n){
            return str.substr(0,num) + "..." + str.substr(str.length-num,str.length)
        }else{
            return str
        }
    }
    render() {
        const { bidRecordList,bidRecordLoading,signPurchaserList,signPurchaserLoading,  } = this.state;
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
                <Card className={less.topL}>
                    <div className={less.topLtitle} title={this.state.topLtitle}>{this.substrtitle(this.state.topLtitle,20)}</div>
                    <p>当前最高报价</p>
                    <p title={this.state.topLNum}>{this.formatNumber(this.state.topLNum)}</p>
                    <div className={less.chujiaBT} style={{display:this.state.offerButtonShow}} >
                        <p>第{this.state.N}次出价</p>
                        <Button size="small" type="primary" >查看报价</Button>
                    </div>
                </Card>
                <Card className={less.topR}>
                    <Row>
                        <Col span={24} className={less.title} title={this.state.topRtitle}>{this.substrtitle(this.state.topRtitle,35)}</Col>
                    </Row>
                    <Row style={{paddingBottom:15,borderBottom:"1px solid #ccc"}}>
                        <Col span={12} className={less.time1}>竞价开始时间：{this.state.sceneStartTime} </Col>
                        <Col span={12} className={less.time2}>竞价结束时间：{this.state.sceneEndTime} </Col>
                    </Row>
                    <Row>
                        <Col className={less.time} span={12}>
                            <div className={less.time_text} id="countDown"></div>
                        </Col>
                       {/* <Col span={8} className={less.timeTitle}>距离竞价结束剩余</Col>
                        <Col span={16} className={less.countTime}>
                            <span className={less.fs23}>00</span>
                            <span>天</span>
                            <span className={less.fs23}>00</span>
                            <span>时</span>
                            <span className={less.fs23}>00</span>
                            <span>分</span>
                            <span className={less.fs23}>00</span>
                            <span>秒</span>
                        </Col>*/}
                    </Row>
                </Card>
                <div className={less.clear}></div>
                <Spin spinning={this.state.spinning}>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价单基本信息</div>
                            <div>{this.createBaseInfo()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className={less.panel}>
                                <div className="reuse_baseTitle">竞买人名单</div>
                            </div>
                            <ToggleTable no_selection={true}
                                         sortChange={this.getSignPurchaser}
                                         dataSource={signPurchaserList || []}
                                         columns={this.columns}
                                         loading={signPurchaserLoading}></ToggleTable>
                            </Card>

                        <Card className="mt10">
                            <div className="reuse_baseTitle">
                                <span>竞价记录</span>
                            </div>
                            <div className={less.open}>
                                <ToggleTable no_selection={true}
                                    sortChange={this.getBidRecord}
                                    dataSource={bidRecordList || []}
                                    columns={this.bidRecord}
                                    loading={bidRecordLoading}></ToggleTable>
                            </div>
                        </Card>

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
export default Form.create()(connect(mapStateToProps)(auctionHall))
