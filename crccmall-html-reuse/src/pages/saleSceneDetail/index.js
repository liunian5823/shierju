import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import {Card, Row, Col, Tabs, Button, Table, Icon, Modal, Form, Input, Select, Spin, Radio, Upload} from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
import { baseService, commission } from '@/utils/common';
import less from './index.less';
import FormatDate from '@/utils/date';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import { closeWin,filePathDismant } from '@/utils/dom';
import { getSearchByHistory } from '@/utils/urlUtils';
import ToggleTable from '@/components/toggleTable';
import download from "business/isViewDown";
import SaleBondManage from '../saleBondManage';
import moment from 'moment'
import Album from 'uxcore-album';
import "./detail.css"

const { Photo } = Album;
const _BONDSTATUS_OBJ = baseService._bondMain_obj;
//竞价状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;
//流标理由
const _FAILGROUP = baseService.failGroup;

/*function toFixed(num, d) {
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
}*/

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

class SaleSceneDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            waste_time: '',
            detailBzjVisible: false,
            spinning: false,
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

            systemTime: null,//系统时间
            confirmVisible: false,      //确认报名弹窗
            confirmSceneSignData: null,         //确认报名弹窗展示信息
            currentUserCompanyMember: 2,        //成员单位：1-是，2-否
            confirmResult: -1,      //确认报名选项

            selectBidVisible: false,       //择标弹窗控制
            selectBidLoading: false,       //择标加载中
            selectBidData: [],             //择标竞买人列表
            selectCompany: null,           //择标选中的公司信息
            selectFile: [],                //择标上传文件

        }
    }

    _uuids = null
    _type = null
    sceneCountDownTimer = null//场次倒计时-计时器
    config = {
        span: [3, 20],
        bondSpan: [5, 19],
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

    //竞价产品
    productsCols = [
        {
            title: '序号',
            key: 'indexkey',
            width: 60,
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: '商品类别',
            key: 'classifyName',
            dataIndex: 'classifyName',
            width: 120,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料名称',
            key: 'goodsName',
            dataIndex: 'goodsName',
            width: 120,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        {
            title: '物料描述',
            key: 'desc',
            dataIndex: 'desc',
            width: 180,
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
        // {
        //     title: '物料编码',
        //     key: 'goodsCodeSect',
        //     dataIndex: 'goodsCodeSect',
        //     width: 100,
        //     className: 'text_line4_td',
        //     render: (text) => {
        //         return <span title={text}>{text || '--'}</span>
        //     }
        // },
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
        // {
        //     title: '质量状况',
        //     key: 'quality',
        //     dataIndex: 'quality',
        //     width: 100,
        //     className: 'text_line4_td',
        //     render: (text) => {
        //         return <span title={text}>{text || '--'}</span>
        //     }
        // },
        {
            title: '销售数量',
            key: 'num',
            dataIndex: 'num',
            width: 120,
            className: 'text_right text_line1_td',
            fixed: 'right',
            render: (text, r) => {
                text = text ? text + '/' + r.unit : '--'
                return <div className='text_right reuse_money' title={text}>
                    <span>{text}</span>
                </div>
            }
        },
        {
            title: '附件',
            key: 'fileName',
            dataIndex: 'fileName',
            width: 120,
            fixed: 'right',
            className: 'text_line4_td',
            render: (text, record, index) => (
                record.filePath ? <span>
                    <a className="reuse_link text_line4"
                        href="javascript:void(0);"
                        onClick={() => download(record.fileName, systemConfigPath.fileDown(record.filePath), true)}>
                        <Icon type="paper-clip" />
                        <span title={text}>{record.fileName}</span>
                    </a>
                </span> : '无'
            )
        },
        {
            title: '品牌',
            key: 'brand',
            dataIndex: 'brand',
            width: 100,
            fixed: 'right',
            className: 'text_line4_td',
            render: (text) => {
                return <span title={text}>{text || '--'}</span>
            }
        },
    ]
    //已报名采购商
    signPurchaser = [
        {
            title: '采购商名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
            width: 100,
            className: 'text_line4_td'
        },
        {
            title: '联系方式',
            key: 'contacts',
                dataIndex: 'contacts',
            width: 90,
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
            title: '保证金状态',
            key: 'bondStatusStr',
            dataIndex: 'bondStatusStr',
            width: 70,
            className: 'text_right',
        },
        {
            title: '报价有效期',
            key: 'effectiveDate',
            dataIndex: 'effectiveDate',
            width: 90,
            className: 'text_right',
        },
        {
            title: '税额',
            key: 'taxRate',
            dataIndex: 'taxRate',
            width: 70,
            className: 'text_right',
            render: (text, record) => {
                return(
                   <span>{(this.state.bidData.biddersTaxFalg ==2 && this.state.bidData.biddersTax) ? Util.computeTax(record.offerAmt, this.state.bidData.biddersTax)  : '-'}</span>
                )
            }
        },
        {
            title: '税价合计',
            key: 'offerAmt',
            dataIndex: 'offerAmt',
            width: 70,
            className: 'text_right',
        },
        {
            title: '单位价格',
            key: 'unitPrice',
            dataIndex: 'unitPrice',
            width: 70,
            className: 'text_right',
           /* render: (text, record) => {
                return(
                    <span>{this.state.bidData.pricingMethod ==1 ? Util.computeTax(record.offerAmt, this.state.bidData.biddersTax)  : '-'}</span>
                )
            }*/
        },
        {
            title: '报名日期',
            key: 'signTime',
            dataIndex: 'signTime',
            width: 90,
            className: 'text_right',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            width: 100,
            render: (text, record) => {
                return(
                    <div>
                        <p>{record.statusStr}</p>
                        <p></p>
                    </div>
                )
            }
        },
        {
            title: '操作',
            key: 'x',
            dataIndex: 'x',
            width: 80,
            render: (text, record, index) => {
                let buttonList = [];
                buttonList.push(<span className="reuse_link" onClick={() => { this.offerView(record) }}>查看详情</span>)
                if (record.status == 20)
                    buttonList.push(<span className="reuse_link" onClick={() => { this.sceneConfirmation(record) }}>确认报名</span>)
                if (record.status == 30 && record.addStatus == 31)
                    buttonList.push(<span className="reuse_link" onClick={() => { this.showPaymentCode(record) }}>查看收款码</span>)
                return buttonList;
            }
        },
    ]

    //查看收款码
    showPaymentCode=()=>{
        console.log('查看收款码 showPaymentCode --------------------- ')
        Util.alert('暂无查看收款码功能！')
        return;
    }

    //确认报名弹窗查询
    sceneConfirmation=(record)=>{
        console.log('sceneConfirmation ----------------- ', record)
        let params = {};
        params.uuids = record.uuids;
        params.sceneId = record.sceneId;
        api.ajax(
            'GET',
            '@/reuse/buyScene/querySceneSignInfo',
            {...params}
        ).then(r=>{
            console.log('sceneConfirmation  then ---------------- ', r)
            this.setState({
                confirmVisible: true,
                confirmSceneSignData: r.data
            })
        }).catch(r=>{
            console.log('sceneConfirmation  catch ---------------- ', r)
        })
    }

    //确认报名弹窗关闭
    cancelSceneConfirmation=()=>{
        $('#confirmRemarks').val('');
        this.setState({
            confirmVisible: false,
            confirmSceneSignData: null,
            confirmResult: -1,
        })
    }



    //确认报名数据提交
    okSceneConfirmation=()=> {
        let _this = this;
        console.log('okSceneConfirmation --------------------------- ')
        let {confirmResult, confirmSceneSignData} = this.state;
        if (confirmResult == -1){
            Util.alert('请选择确认结果！');
            return;
        }
        let confirmRemarks = $('#confirmRemarks').val();
        if (!confirmRemarks){
            Util.alert('请填写备注信息！')
            return;
        }
        console.log('okSceneConfirmation 222222 ---------------------------', confirmResult, confirmRemarks)
        api.ajax(
            'POST',
            '@/reuse/buyScene/confirmSceneSign',
            {
                uuids: confirmSceneSignData.uuids,
                sceneId: confirmSceneSignData.sceneId,
                confirmResult: confirmResult,
                confirmRemarks: confirmRemarks
            }
        ).then(r=>{
            console.log('confirmSceneSign  then --------- ', r)
            //成功关闭弹窗，清除数据
            Util.alert('操作成功！');
            setTimeout(()=>{
                _this.cancelSceneConfirmation();
                //刷新报名列表
                _this.getSignPurchaser();
            }, 1000)

        }).catch(r=>{
            console.log('confirmSceneSign  catch --------- ', r)
        })

    }


    //订单信息
    bidOrder = [
        {
            title: '订单号',
            key: 'code',
            dataIndex: 'code',
            width: 140
        },
        {
            title: '下单人',
            key: 'confirmUserName',
            dataIndex: 'confirmUserName',
            render: (text, record) => {
                return `${text}（${record.confirmUserNo || '--'}）`
            }
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
            sorter: true,
            dataIndex: 'confirmTime',
            width: 90,
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
            title: '订单金额(元)',
            sorter: true,
            key: 'amt',
            className: 'text_right',
            dataIndex: 'amt',
            render: text => {
                return Util.toFixed(text, 2)
            }
        },
        {
            title: '状态',
            key: 'statusStr',
            sorter: true,
            dataIndex: 'statusStr'
        },
        {
            title: '操作',
            key: 'x',
            dataIndex: 'x',
            width: 100,
            render: (text, record, index) => {
                return (
                    <span className="reuse_link" onClick={() => {
                        this.toOrderDetail(record)
                    }}>查看订单</span>
                )
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
            title: '竞买人企业名称',
            key: 'buyerCompanyName',
            dataIndex: 'buyerCompanyName',
            width: 200,
            className: 'text_line4_td',
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
                        <p>{text ? Util.toFixed(text, 2) : '--'}</p>
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
                        <p>{text ? Util.toFixed(text, 2) : ''}</p>
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
                    <span className="reuse_link" onClick={() => {
                        this.offerDetail(record)
                    }}>报价详情</span>
                )
            }
        },
    ]
    //竞价日志
    bidJournal = [
        {
            title: '操作人',
            width: 170,
            key: 'createUserName',
            dataIndex: 'createUserName',
            render: (text, record) => {
                return `${text}（${record.userNo || '--'}）`
            }
        },
        {
            title: '操作时间',
            key: 'createTime',
            width: 90,
            className: 'text_right',
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
        },
        {
            title: '单价',
            key: 'price',
            dataIndex: 'price'
        },
        {
            title: '金额',
            key: 'sumAmt',
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
        const search = this.props.history.location.search;
        if (search) {
            let params = getSearchByHistory(search);
            if (params.type) {
                this._type = params.type
            }
        }
        this._uuids = this.props.match.params.uuids;

        this.getSystemTime().finally(() => {
            if (this._uuids) {
                this.getSceneInfo(this._uuids)
                this.queryCompanyMember();
            }
        })
    }

    //查询当前登录用户是否为成员单位
    queryCompanyMember=()=>{
        api.ajax(
            'GET',
            '@/reuse/buyScene/queryCompanyMember',
            {}
        ).then(r=>{
            console.log('queryCompanyMember  then ---------------- ', r)
            this.setState({
                currentUserCompanyMember: r.data
            })
        }).catch(r=>{
            console.log('queryCompanyMember  catch ---------------- ', r)
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
    getSceneInfo = (uuids) => {
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/saleScene/querySaleSceneInfo', {
            uuids
        }).then(res => {
            console.log('getSceneInfo  then ---------------- ', res)
            if (res.data) {
                if (res.data.status == 50) {
                    params.defaultKey = '4'
                    this.getBidRecord();
                }
                this.setState({
                    spinning: false,
                    bidData: res.data,
                    waste_time: res.data.status == 50 ? getDuration(this.state.systemTime - new Date(res.data.offerStartTime)) : getDuration(new Date(res.data.offerEndTime) - new Date(res.data.offerStartTime)),
                })
                this.setSceneCountDown(res.data.offerStartTime, res.data.offerEndTime)
            }
        }).catch(r=>{
            console.log('getSceneInfo  catch -------------------- ', r)
        })
    }
    //tab切换
    tabChange = (item) => {
        this.setState({
            defaultKey: item
        })
        if (item == '2') {
            this.getSignPurchaser()
        }
        if (item == '4') {
            this.getBidRecord()
        }
        if (item == '7') {
            this.getBidJournal()
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
    //获取竞价日志
    getBidJournal = () => {
        const uuids = this.props.match.params.uuids;
        if (!uuids) return;
        this.setState({
            bidJournalLoading: true,
        })
        api.ajax('GET', '@/reuse/sceneLog/findSceneLogs', {
            sceneId: uuids,
        }).then(res => {
            this.setState({
                bidJournalList: res.data || [],
                bidJournalLoading: false,
            })
        }).catch(res => {
            this.setState({
                bidJournalLoading: false,
            })
        })
    }

    //查看报价
    offerView = (tr) => {
        window.open(systemConfigPath.jumpPage('/sale/offer_detail/' + tr.sceneId + '?offerId=' + tr.offerId))
        return;
    }
    offerViewClose = () => {
        this.setState({
            offerViewVisible: false,
        })
    }

    //报价详情
    offerDetail = (tr) => {
        if (tr.uuids && tr.sceneId) {
            window.open(systemConfigPath.jumpPage('/sale/offer/' + tr.sceneId + '?offerId=' + tr.uuids))
            return;
        }
    }
    offerDetailClose = () => {
        this.setState({
            offerDetailVisible: false
        })
    }

    //查看订单
    toOrderDetail = (tr) => {
        if (!tr.uuids) return;
        window.open(systemConfigPath.jumpPage('/sale/sceneOrderDetail/' + tr.uuids))
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
                            <p className={less.statustitle}>竞价状态：</p>
                            <p className={less.main} style={statusStyle}>{bidData.statusStr}</p>
                            {/* <p className={less.note}>{bidData.childStatusStr}</p> */}
                            <Button type="primary" size="small" className={less.smBt} onClick={()=>{
                                window.open(systemConfigPath.jumpPage('/desk/auctionHall/' + bidData.uuids))
                            }}>竞价大厅</Button>
                        </div>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价单号</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.code || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售单位</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.saleCompanyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售部门</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.saleDeptName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>销售对象</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.saleTargetStr || '--'}</Col>
                </Row>
                {/*<Row className="reuse_row">*/}
                {/*    <Col className="reuse_label" span={span[0]}>发布人</Col>*/}
                {/*    <Col className="reuse_value" span={span[1]}>*/}
                {/*        <span>{bidData.createUserName}</span>*/}
                {/*        <span>{bidData.createUserTel}</span>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价分类</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.classifyName || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>计价方式</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.pricing_method&&bidData.pricing_method==1 ? "按批次计价" : bidData.pricing_method&&bidData.pricing_method==2 ? "按重量计价" : '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>应用领域</Col>
                    <Col className="reuse_value" span={span[1]}>{this.filterUseArea(bidData.useArea)}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价联系人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span style={{ marginRight: '10px' }}>{bidData.contacts || '--'}</span>
                        <span>{bidData.contactsTel || '--'}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>发布人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span style={{ marginRight: '10px' }}>{bidData.createUserNo || '--'}</span>
                        <span style={{ marginRight: '10px' }}>{bidData.createUserName || '--'}</span>
                        <span>{bidData.createUserPhone || '--'}</span>
                    </Col>
                </Row>
                <Row className="reuse_row" style={{marginBottom:"20px"}}>
                    <Col className="reuse_label" span={span[0]}>择标人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span style={{ marginRight: '10px' }}>{bidData.chooseUserNo || '--'}</span>
                        <span style={{ marginRight: '10px' }}>{bidData.chooseUserName || '--'}</span>
                        <span>{bidData.chooseUserPhone || '--'}</span>
                    </Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>发布日期</Col>
                    <Col className="reuse_value" span={span[1]}>{!!bidData.createTime ? bidData.createTime.substr(0,16) : "--"}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>可看货期</Col>
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
                                ? <span>{bidData.signEndTime} &nbsp; 已截止</span>
                                : <span>
                                    <span>{bidData.signEndTime || '--'}</span>
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
                    <Col className="reuse_label" span={span[0]}>中标日期</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.finishTime || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>结束自动延长</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.extend ? '开启' : '关闭'}</span>
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
        return area.join(',') || '--'
    }
    //显示图片预览
    showPicView = (picUrl) =>{
        let baseUrl = SystemConfig.configs.resourceUrl
    
        Album.show({
            photos: [
            <Photo
                src={baseUrl + picUrl}
                key={0}
            />,
            ],
        });
    }
    //其他信息
    createSceneList = () => {
        const {
            defaultKey, bidData,
            signPurchaserList,
            signPurchaserLoading,
            bidRecordList,
            bidRecordLoading,
            bidJournalList,
            bidJournalLoading,
        } = this.state;
        const { bondSpan, detailSpan } = this.config;
        const { goodsList = [], bondWhiteList = [], signList = [], fileList = [], goodsfileList = [] } = bidData;
        const order = bidData.order ? [bidData.order] : [];

        return (
            <div className={['baseTabs', less.tabs].join(' ')}>
                <Tabs activeKey={defaultKey}
                    onChange={this.tabChange}>
                    <TabPane tab="标的物清单" key="1">
                        <div style={{height:"40px"}}>
                            <p style={{"line-height": "28px",fontWeight:600,fontSize:15}}>标的物清单</p>
                            <div data-print-hide className={["reuse_baseButtonGroup", less.options].join(' ')}>
                                {
                                    defaultKey == '1' ?
                                        <Button type="primary" key="1" onClick={this.exportGoodsList}>导出清单</Button> : null
                                }
                                {/*{*/}
                                {defaultKey == '6' ? <Button type="primary" key="6" onClick={() => { this.handleToBond() }}>保证金管理</Button> : null}
                                {/*}*/}
                            </div>
                        </div>
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={goodsList}
                                columns={this.productsCols}/>
                                {/* scroll={{ x: 1000 }} */}
                        </div>
                        <div className={less.btInfo}>
                            <p className={less.btInfo1}>运费:<span className={less.redfont}>￥ 20.00</span></p>
                            <p className={less.btInfo2}>申通快递/送货至工地</p>
                            <p className={less.btInfo3}>按重量计算 合计:<span className={less.redfont}>123.45吨</span></p>
                        </div>
                    </TabPane>
                    <TabPane tab="竞买人管理" key="2">
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                sortChange={this.getSignPurchaser}
                                dataSource={signPurchaserList || []}
                                columns={this.signPurchaser}
                                loading={signPurchaserLoading}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="标的物详情" key="3">
                        <div className={less.detail}>
                            <div style={{"line-height": "28px",fontWeight:600,fontSize:15}}>标的物详情</div>
                            <div className={less.exp}>
                                <div dangerouslySetInnerHTML={{
                                    __html: bidData.remark || '--'
                                }}></div>
                            </div>
                            <div className="reuse_baseTitle mt20">竞价附件</div>
                            <Row className={less.enclosure}>
                                {
                                    fileList.length ?
                                        fileList.map((v, index) => {
                                            return (
                                                <Row span={8} key={index}>
                                                    <Icon type="paper-clip"></Icon>
                                                    <span className='text_line1' style={{ display: 'inline-block', maxWidth: '234px', 'verticalAlign': '-6px' }} title={v.fileName}>{v.fileName}</span>
                                                    <a href="javascript:void(0);"
                                                        onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath), true)}
                                                        className="reuse_link">下载</a>
                                                </Row>
                                            )
                                        })
                                        : '--'
                                }
                            </Row>
                            <div className="reuse_baseTitle mt20">标的物图片</div>
                            <div className={less.piclist}>
                                {goodsfileList.map((v,i)=>{
                                    return (
                                        <img key={i} onClick={()=>{this.showPicView(v.filePath)}} alt="标的物图片" src={v.filePath} />
                                    )
                                })}
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="竞价规则/费用要求" key="4">
                    <div className={less.detail}>
                            <div className="reuse_baseTitle">竞价规则/费用要求</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>调价方式</Col>
                                    <Col className="reuse_value" span={9}>{bidData.adjustWayStr || '--'}</Col>
                                    <Col className="reuse_label" span={3}>隐私设置</Col>
                                    <Col className="reuse_value" span={9}>{bidData.privacySetStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>增加幅度</Col>
                                    <Col className="reuse_value" span={9}>{bidData.increRange || '--'}{bidData.adjustWay == 1 ? '%' : '元'}</Col>
                                    <Col className="reuse_label" span={3}>成交公告</Col>
                                    <Col className="reuse_value" span={9}>{bidData.dealNoticeStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>开盘价格</Col>
                                    <Col className="reuse_value" span={9}>{bidData.startPrice || '--'}元</Col>
                                    <Col className="reuse_label" span={3}>结束自动延长</Col>
                                    <Col className="reuse_value" span={9}>{bidData.extend ? '开启' : '关闭'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>成交底价</Col>
                                    <Col className="reuse_value" span={9}>{bidData.basePrice || '--'}元</Col>
                                    <Col className="reuse_label" span={3}>报名费</Col>
                                    <Col className="reuse_value" span={9}>{bidData.bondTypeStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>评估参考价</Col>
                                    <Col className="reuse_value" span={9}>{bidData.evaluationPrice || '--'}元</Col>
                                    <Col className="reuse_label" span={3}>平台服务费</Col>
                                    <Col className="reuse_value" span={9}>实际交易总金额 {commission}%</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>投标人数限制</Col>
                                    <Col className="reuse_value"
                                        span={9}>{bidData.minSign == 0 ? '无限制' : `最少${bidData.minSign}家报名`}</Col>
                                    <Col className="reuse_value" span={12}> </Col>
                                </Row>




                            </div>
                            {/* <div className="reuse_baseTitle mt20">竞价及隐私信息</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>付款方式</Col>
                                    <Col className="reuse_value" span={9}>{bidData.payWayStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>货品所在地</Col>
                                    <Col className="reuse_value"
                                        span={detailSpan[1]}>{bidData.provinceName || '-'}{bidData.cityName || '-'}{bidData.countyName || '-'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>看货地址</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.khAddress || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>存储方式/时间</Col>
                                    <Col className="reuse_value"
                                        span={detailSpan[1]}>{bidData.storageWayStr || '--'}/{bidData.storageTime || '--'}天</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>付款时间</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>成交后<span
                                        className={less.payTime}> {bidData.payTime || '--'} </span>天内</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>最低参与企业数</Col>
                                    <Col className="reuse_value"
                                        span={detailSpan[1]}>{bidData.minSign == 0 ? '无限制' : bidData.minSign}</Col>
                                </Row>
                            </div> */}
                            <div className="reuse_baseTitle mt10"></div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>询价方式</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>{bidData.bidWayStr || '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={detailSpan[0]}>邀请名单</Col>
                                    <Col className="reuse_value" span={detailSpan[1]}>
                                        {
                                            signList.length ?
                                                signList.map((v, index) => {
                                                    return (
                                                        <Col span={12} key={index}>
                                                            <span
                                                                className={less.whiteList_item}>{v.buyerCompanyName}</span>
                                                        </Col>
                                                    )
                                                })
                                                : '--'
                                        }
                                    </Col>
                                </Row>
                            </div>
                            <div className="reuse_baseTitle mt20">保证金要求</div>
                            <div className={less.bond}>
                                <Row className="reuse_row">
                                    <Col span={12}>
                                        <Col className="reuse_label" span={bondSpan[0]}>保证金缴纳</Col>
                                        <Col className="reuse_value" span={bondSpan[1]}>{bidData.bondTypeStr || '--'}</Col>
                                    </Col>
                                    {
                                        bidData.bondType != 1 && <Col span={12}>
                                            <Col className="reuse_label" span={bondSpan[0]}>收款账户名</Col>
                                            <Col className="reuse_value" span={bondSpan[1]}>{bidData.account || '--'}</Col>
                                        </Col>
                                    }
                                </Row>
                                <Row className="reuse_row">
                                    {bidData.bondType != 1 && <Col span={12}>
                                        <Col className="reuse_label" span={bondSpan[0]}>保证金金额</Col>
                                        <Col className="reuse_value" span={bondSpan[1]}><span
                                            className="reuse_money">{bidData.bondAmt}</span>元</Col>
                                    </Col>}
                                    {
                                        bidData.bondType != 1 && <Col span={12}>
                                            <Col className="reuse_label" span={bondSpan[0]}>保证金收款账户</Col>
                                            <Col className="reuse_value" span={bondSpan[1]}>{bidData.accountNo || '--'}</Col>
                                        </Col>
                                    }

                                </Row>
                                {
                                    bidData.bondType != 1 &&
                                    <Row className="reuse_row">
                                        <Col span={12}></Col>
                                        <Col span={12}>
                                            <Col className="reuse_label" span={bondSpan[0]}>开户行</Col>
                                            <Col className="reuse_value" span={bondSpan[1]}>{bidData.openBank || '--'}</Col>
                                        </Col>
                                    </Row>
                                }
                                {
                                    bidData.bondType != 1 &&
                                    <Row className="reuse_row">
                                        <Col span={12}></Col>
                                        <Col span={12}>
                                            <Col className="reuse_label" span={bondSpan[0]}>来款备注</Col>
                                            <Col className="reuse_value" span={bondSpan[1]}>{bidData.bondRemark || '--'}</Col>
                                        </Col>
                                    </Row>
                                }
                                {bidData.bondType != 1 && <div className="reuse_baseTitle mt20"></div>}
                                {bidData.bondType != 1 && <Row className={less.whiteList}>
                                    <Col span={3}>保证金白名单 :</Col>
                                    <Col span={20}>
                                        {
                                            bondWhiteList.length ?
                                                bondWhiteList.map((v, index) => {
                                                    return (
                                                        <Col span={12} key={index}>
                                                            <span className={less.whiteList_item}>{v.buyerCompanyName}</span>
                                                        </Col>
                                                    )
                                                })
                                                : '--'
                                        }
                                    </Col>
                                </Row>}
                            </div>
                            {/* <div className="reuse_baseTitle mt20"></div> */}
                            
                            
                        </div>
                        {/* <div className={less.products}>
                            <div className={less.record}>
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
                        </div> */}
                    </TabPane>
                    <TabPane tab="竞买人要求" key="5">
                        {/* <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={order}
                                columns={this.bidOrder}></ToggleTable>
                        </div> */}
                        <div className="reuse_baseTitle">竞买人要求</div>
                            <div>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>付款方式</Col>
                                    <Col className="reuse_value" span={9}>{bidData.payWayStr || '--'}</Col>
                                    <Col className="reuse_label" span={3}>竞买人企业类型</Col>
                                    <Col className="reuse_value" span={9}>{bidData.biddersType == 1 ? "个体工商户" : bidData.biddersType == 2 ? "企业主体" : bidData.biddersType == 3 ? "无要求" : '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>付款时间</Col>
                                    <Col className="reuse_value" span={9}>成交后<span className={less.payTime}> {bidData.payTime || '--'} </span>天内</Col>
                                    <Col className="reuse_label" span={3}>竞买人注册资本</Col>
                                    <Col className="reuse_value" span={9}>{bidData.biddersRegistered ? `${bidData.biddersRegistered}万元` : '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>货品所在地</Col>
                                    <Col className="reuse_value" span={9}>{bidData.provinceName + "/" + bidData.cityName + "/" + bidData.countyName}</Col>
                                    <Col className="reuse_label" span={3}>竞买人经营地址</Col>
                                    <Col className="reuse_value" span={9}>{bidData.biddersProvince || "--"}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>看货地址</Col>
                                    <Col className="reuse_value" span={9}>{bidData.khAddress || '--'}</Col>
                                    <Col className="reuse_label" span={3}>竞买人资质许可</Col>
                                    <Col className="reuse_value" span={9}>{bidData.biddersQualification ? bidData.biddersQualification : bidData.biddersQualificationOther ? bidData.biddersQualificationOther : '--'}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>存储方式</Col>
                                    <Col className="reuse_value" span={9}>{bidData.evaluationPrice == 1 ? "室内" : bidData.evaluationPrice == 2 ? "室外" : bidData.evaluationPrice == 3 ? "其他" : '--'}</Col>
                                    <Col className="reuse_label" span={3}>竞买人报价税率</Col>
                                    <Col className="reuse_value" span={9}>{bidData.biddersTaxFalg == 1 ? "报价不含税" : "报价含税" + bidData.biddersTax + "%"}</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>提货时间</Col>
                                    <Col className="reuse_value" span={9}>{bidData.deliveryTime || '--'}</Col>
                                    <Col className="reuse_label" span={3}>拆卸情况</Col>
                                    <Col className="reuse_value" span={9}>{bidData.disassembleFlag==1 ? "需买方自行拆卸" : "无需拆卸可直接清运"}</Col>
                                </Row>
                                {/* <Row className="reuse_row">
                                    <Col className="reuse_label" span={3}>拆卸情况</Col>
                                    <Col className="reuse_value"
                                        span={9}>{bidData.minSign == 0 ? '无限制' : `最少${bidData.minSign}家报名`}</Col>
                                    <Col className="reuse_value" span={12}> </Col>
                                </Row> */}
                            </div>
                    </TabPane>
                    <TabPane tab="竞价记录" key="6">
                        <div className={less.products}>
                            <div className={less.record}>
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
                    <TabPane tab="审批记录" key="7">
                        <div className="reuse_baseTitle">审批记录</div>
                        TODO
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={bidJournalList || []}
                                columns={this.bidJournal}
                                loading={bidJournalLoading}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="订单信息" key="8">
                    <div className="reuse_baseTitle">订单信息</div>
                        <Row className="reuse_row">
                            <Col className="" span={12}>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={6}>订单号</Col>
                                    <Col className="reuse_value" span={18}>123456789456123</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={6}>下单时间</Col>
                                    <Col className="reuse_value" span={18}>2020/12/12  12:13</Col>
                                </Row>
                                <Row className="reuse_row">
                                    <Col className="reuse_label" span={6}>下单人</Col>
                                    <Col className="reuse_value" span={18}>王某   130 2344 5545</Col>
                                </Row>
                            </Col>
                            <Col className="reuse_value" span={5}></Col>
                            <Col className="reuse_value" span={7}>
                                <p>订单状态:</p>
                                <p>执行中</p>
                                <p>总金额:</p>
                                <p>999999999.90 元</p>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="竞价日志" key="9">
                        TODO
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={bidJournalList || []}
                                columns={this.bidJournal}
                                loading={bidJournalLoading}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="买卖协议" key="10">
                    TODO
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={bidJournalList || []}
                                columns={this.bidJournal}
                                loading={bidJournalLoading}></ToggleTable>
                        </div>
                    </TabPane>
                    <TabPane tab="发票" key="11">
                    TODO
                        <div className={less.products}>
                            <ToggleTable no_selection={true}
                                dataSource={bidJournalList || []}
                                columns={this.bidJournal}
                                loading={bidJournalLoading}></ToggleTable>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }

    //保证金管理
    handleToBond = () => {
        this.setState({
            detailBzjVisible: true
        })
    }
    //导出商品清单
    exportGoodsList = () => {
        if (!this._uuids) return;
        window.open(configs.exportUrl + '/reuse/sceneGoods/exportData?sceneId=' + this._uuids)
    }
    //场次倒计时
    setSceneCountDown = (s, e) => {
        console.log('setSceneCountDown ------------- ')
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
            console.log('setSceneCountDown 222222 ------------- ', text)
            that.setState({
                sceneCountDownText: text
            })
            console.log('setSceneCountDown 3333333 ------------- ', systemTime, end)
            if (systemTime > end) {
                this.clearSceneCountDown()
            }
        }, 1000)
    }
    //清除场次倒计时
    clearSceneCountDown = () => {
        console.log('clearSceneCountDown 0----------------- ')
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
    }

    //作废
    handleToVoid = () => {
        if (!this.state.bidData.uuids) return;
        this.props.form.resetFields();
        this.setState({
            voidVisible: true,
        })
    }
    //作废确认
    voidOk = () => {
        const bidData = this.state.bidData;
        if (!bidData.uuids) return;

        this.props.form.validateFields((errors, values) => {
            if (!errors.cancelReason) {
                api.ajax('POST', '@/reuse/saleScene/cancel', {
                    uuids: bidData.uuids,
                    cancelReason: values.cancelReason
                }).then(res => {
                    Util.alert(res.msg || '作废成功', {
                        type: 'success'
                    })
                    this.setState({
                        voidVisible: false
                    }, () => {
                        setTimeout(() => {
                            this.props.history.push('/sale/scene')
                        }, 600)
                    })
                }, error => {
                    Util.alert(error.msg || '作废失败', {
                        type: 'error'
                    })
                })
            }
        })
    }
    //流标
    handleToFail = () => {
        if (!this.state.bidData.uuids) return;
        this.props.form.resetFields();

        this.setState({
            failVisible: true
        })
    }
    //流标确认
    failOk = () => {
        const bidData = this.state.bidData;
        if (!bidData.uuids) return;

        this.props.form.validateFields((errors, values) => {
            if (!errors.failReason && !errors.failType) {
                api.ajax('POST', '@/reuse/saleScene/fail', {
                    uuids: bidData.uuids,
                    failReason: values.failReason,
                    failType: values.failType,
                }).then(res => {
                    Util.alert(res.msg || '流标成功', {
                        type: 'success'
                    })
                    this.setState({
                        failVisible: false
                    })
                    //-------------   9/7 增加，返回列表页 --------------------//
                    this.props.history.push('/sale/scene')
                    //--------------------------------------------------------//
                }, error => {
                    Util.alert(error.msg || '流标失败', {
                        type: 'error'
                    })
                })
            }
        })
    }

    //onchange事件
    valueCahnge = (el, label) => {
        let value = el;
        if (el.target) value = el.target.value;

        this.setState({
            [label]: value
        })
    }

    //企业类型展示
    showFactoryType=(type)=>{
        let factoryType = '-';
        switch (type) {
            case 1:
                factoryType = '生产厂家'; break;
            case 2:
                factoryType = '贸易商'; break;
            case 3:
                factoryType = '个体工商户'; break;
        }
        return factoryType;
    }

    //确认报名弹窗展示
    showConfirmSign=(confirmSceneSignData)=>{
        let _this = this;
        if(confirmSceneSignData != null){
            return (
                <Row span={24} className={less.modalSign}>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>竞买人企业名称:</Col>
                        <Col span={20}>{confirmSceneSignData.name}</Col>
                    </Row>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>营业执照号:</Col>
                        <Col span={20}>{confirmSceneSignData.businessLicense}</Col>
                    </Row>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>企业类型:</Col>
                        <Col span={20}>{_this.showFactoryType(confirmSceneSignData.factoryType) }</Col>
                    </Row>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>注册地址:</Col>
                        <Col span={20}>{confirmSceneSignData.address}</Col>
                    </Row>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>经营地址:</Col>
                        <Col span={20}>{Util.handleAreaToName(confirmSceneSignData.supplyArea)}</Col>
                    </Row>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>联系人及电话:</Col>
                        <Col span={20}>{confirmSceneSignData.contacts} {confirmSceneSignData.contactsTel}</Col>
                    </Row>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>计划看货日期:</Col>
                        <Col span={20}>-</Col>
                    </Row>
                    <Row span={24} className={less.firstRow}>
                        <Col span={4}>备注:</Col>
                        <Col span={20}>{confirmSceneSignData.remark}</Col>
                    </Row>
                </Row>
            )
        }
    }

    //
    changeConfirmResult=(value)=>{
        console.log('changeConfirmResult -------------- ', value)
        this.setState({
            confirmResult: value
        })
    }

    //择标下单
    handleToselect = () => {
        console.log('handleToselect ================= ')
        //查询当前数据 sceneId: confirmSceneSignData.sceneId,
        let {uuids} = this.state.bidData;
        api.ajax(
            'GET',
            '@/reuse/approvalBid/buyerCompanyList?uuids=' + uuids,
        ).then(r=>{
            console.log('handleToselect then ----------------- ')
            this.setState({
                selectBidData: r.data,
                selectBidVisible: true
            })
        }).catch(r=>{
            console.log('handleToselect catch ----------------- ')
        })
        /*let data = [
            {
                name: '供应商一',
                confirmTime: '2021-06-27',
                effectiveDate:  '2021-06-27',
                offerAmt: 999,
                status: 51,
                registeredCapital: '1000',
                factoryType:   '1', //厂家类型 1厂家 2集成商 3 个体户
                companyAddress: '供应商一的地址',
                contacts: '联系人一',
                contactsTel: '18811320371',
                uuids: '000001',
            },{
                name: '供应商二',
                confirmTime: '2021-06-28',
                effectiveDate:  '2021-06-27',
                offerAmt: 1999,
                status: 51,
                registeredCapital: '2000',
                factoryType:   '2', //厂家类型 1厂家 2集成商 3 个体户
                companyAddress: '供应商二的地址',
                contacts: '联系人二',
                contactsTel: '18811320372',
                uuids: '000002',
            },{
                name: '供应商三',
                confirmTime: '2021-06-29',
                effectiveDate:  '2021-06-29',
                offerAmt: 2999.00,
                status: 51,
                registeredCapital: '3000',
                factoryType:   '3', //厂家类型 1厂家 2集成商 3 个体户
                companyAddress: '供应商三的地址',
                contacts: '联系人三',
                contactsTel: '18811320373',
                uuids: '000003',
            }
        ]
        this.setState({
            selectBidData: data,
            selectBidVisible: true
        })*/
    }

    //返回按钮
    cancelSelectBid = () =>{
        console.log('cancelSelectBid ================= ')
        this.setState({
            selectBidVisible: false
        })
    }

    //确认按钮
    okSelectBid = () =>{
        console.log('okSelectBid ================= ', this.state)
        let _this = this;
        let {selectFile, bidData, selectCompany} = this.state;
        //selectFile: 上传附件保存
        if (!selectFile || selectFile.length == 0){
            Util.alert('请上传附件！', {type: 'warning'})
            return;
        }
        const obj = filePathDismant(selectFile[0].response.data);
        let  fileName = obj.fileName;
        let  filePath = obj.filePath;

        //竞价的uuids
        let uuids = bidData.uuids;
        //选中公司数据在selectCompany中

        api.ajax(
            'POST',
            '@/reuse/approvalBid/choseBidCompany',
            {
                uuids: uuids,
                fileName:fileName,
                filePath:filePath,
                buyerCompanyId : selectCompany.buyerCompanyId,
                buyerCompanyName :selectCompany.buyerCompanyName,
                bidAmt : selectCompany.sumAmt,
                offerContacts : selectCompany.offerUserName,
                offerContactsTel : selectCompany.offerUserTel,
            }
        ).then(r=>{
            //保存成功
            Util.alert('操作成功！', {type: 'success'})
            //关闭弹窗，刷新
            _this.cancelSelectBid();
            //重置弹窗内容
            this.setState({
                selectBidData: [],
                selectCompany: null,
                selectFile: [],
            })
            //刷新当前数据
            _this.getSceneInfo(bidData.uuids);
        }).catch(r=>{
            console.log('okSelectBid  catch -------------- ', r)
        })

    }


    //择标弹窗表头
    selectColumns = () => {
        let {biddersTaxFalg, biddersTax} = this.state.bidData;

        return [
            {
                title: '供应商名称',
                dataIndex: 'buyerCompanyName',
            },
            {
                title: '保证金到账日',
                dataIndex: 'confirmTime',
                render: (text, record) => {
                    return(
                        <span>{record.confirmTime ? record.confirmTime : '-' }</span>
                    )
                }
            },
            {
                title: '报价有效期',
                dataIndex: 'effectiveDate',
            },
           {
                title: '税额',
                dataIndex: 'taxAmt',
                render: (text, record) => {
                    return(
                        <span>{(biddersTaxFalg == 2 && biddersTax) ? Util.computeTax(record.sumAmt, biddersTax) : '-'}</span>
                    )
                }
            },
            {
               title: '税价合计',
               dataIndex: 'sumAmt',
               render: (text, record)=>{
                   return (
                       <span>{Util.toFixed(record.sumAmt, 2)}</span>
                   )
               }
           },
           {
               title: '状态',
               dataIndex: 'addStatus',
               render: (text, record) => {
                   return(
                       <span>{ record.addStatus > 44  ? '报价无效' : '报价有效'}</span>
                   )
               }
           },
           {
               title: '选择',
               dataIndex: 'select',
               render: (text, record, index) => {
                   return(
                       <input type='radio' name='selectCompany' onClick={this.selectCompanyClick.bind(this, record, index)} />
                   )
               }
           }
        ]
    }

    //选择中标人员
    selectCompanyClick=(obj, index)=>{
        console.log("selectCompanyClick ------------------ ", obj, index)
        let {biddersTaxFalg, biddersTax} = this.state.bidData;
        obj.no = index + 1;
        if (biddersTaxFalg == 2 && biddersTax && obj.sumAmt)
            obj.taxAmt = Util.computeTax(obj.sumAmt, biddersTax)
        else
            obj.taxAmt = '-';
        this.setState({
            selectCompany: obj
        })
    }




    //展示供应商信息
    showSelectCompanyInfo=(obj)=>{
        if (obj){
            return (
                <Card title={'已选择供应商信息'}>
                    <Row>
                        <Row span={24} className={less.button10}>
                            <Col span={4} className={less.nameRight}>价格排名:</Col>
                            <Col span={20}>第 {obj.no} 名</Col>
                        </Row>
                        <Row span={24} className={less.button10}>
                            <Col span={4} className={less.nameRight}>供应商名称:</Col>
                            <Col span={20}>{obj.buyerCompanyName}</Col>
                        </Row>
                        <Row span={24} className={less.button10}>
                            <Col span={4} className={less.nameRight}>注册资本:</Col>
                            <Col span={20}>{obj.registeredCapital}万元</Col>
                        </Row>
                        <Row span={24} className={less.button10}>
                            <Col span={4} className={less.nameRight}>厂家类型:</Col>
                            <Col span={20}>{obj.factoryType == 1 ? '生产厂家' : obj.factoryType == 2 ? '贸易集成商' : obj.factoryType == 3 ? '个体工商户' : '-'}</Col>
                        </Row>
                        <Row span={24} className={less.button10}>
                            <Col span={4} className={less.nameRight}>公司所在地:</Col>
                            <Col span={20}>{obj.address}</Col>
                        </Row>
                        <Row span={24} className={less.button10}>
                            <Col span={4}  className={less.nameRight}>报价联系人:</Col>
                            <Col span={20}>{obj.contacts}  {obj.offerUserName}</Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row span={24} className={less.button10}>
                            <Col span={12}>
                                <Row span={24}>
                                    <Col span={8} className={less.nameRight}>金额:</Col>
                                    <Col span={16}  className={less.redFont}>{obj.taxAmt == '-' ? Util.toFixed(obj.sumAmt, 2) : Util.toFixed((obj.sumAmt - obj.taxAmt), 2)}</Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row span={24}>
                                    <Col span={6}>税价合计:</Col>
                                    <Col span={18}  className={less.redFont}>{Util.toFixed(obj.sumAmt, 2)}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row span={24} className={less.button10}>
                            <Col span={12}>
                                <Row span={24}>
                                    <Col span={8} className={less.nameRight}>税额:</Col>
                                    <Col span={16} className={less.redFont}>{obj.taxAmt}</Col>
                                </Row>
                            </Col>
                            <Col span={12}></Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row span={24}>
                            <Col span={4} className={less.nameRight}>附件上传:</Col>
                            <Col span={8}>
                                <Upload
                                    fileList={this.state.selectFile}
                                    {...this.uploadPropsMultiple}
                                >
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            </Col>
                            <Col span={12}>
                                <p className={less.redClass}>*</p><p>支持扩展名：.pdf、.jpg、.png文件</p>
                            </Col>
                        </Row>

                    </Row>

                </Card>
            )
        }
    }

    //上传
    uploadPropsMultiple = {
        ...ComponentDefine.upload_.uploadProps,
        beforeUpload(file) {
            const fileType = [
                "pdf",
                "jpg",
                "png",
            ];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                Util.alert("只能上传pdf、jpg、png类型的文件", {type: 'warning'});
                return false;
            }
            return true;
        },
        onChange: info => {
            let fileList = info.fileList;
            /*if (fileList.length >= 6) {
              message.error("最多上传五个附件");
              return;
            }*/
            if (info.file.status === "done") {
                let isSuccess = false;
                if (info.file.response.code == '000000' ) {
                    isSuccess = true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(
                        info.file.response.data
                    );
                    Util.alert(`${info.file.name} 上传成功。`, {type: 'success'});
                } else {
                    if (info.file.response.code == "400002") {
                        Util.alert(info.file.response.msg, {type: 'error'});
                    } else {
                        Util.alert(`${info.file.name} 上传失败。`, {type: 'error'});
                    }
                }
                if (isSuccess) {
                    fileList = fileList.slice(-1);
                } else {
                    fileList = fileList.slice(0, fileList.length - 1);
                }
            } else if (info.file.status === "error") {
                if (info.file.response.code == "400002") {
                    Util.alert(info.file.response.msg, {type: 'error' });
                } else {
                    Util.alert(`${info.file.name} 上传失败。`, {type: 'error'});
                }
            }
            this.setState({
                selectFile: fileList
            })
        }
    };


    render() {
        const { bidData, cancelReason, failReason, failType, confirmVisible,
            confirmSceneSignData, currentUserCompanyMember,
            selectBidVisible, selectBidLoading, selectBidData, selectCompany} = this.state;
        const { getFieldProps } = this.props.form;
        const { autosize, maxLength } = this.config;

        return (
            <div className={less.scene_detail}>
                <Spin spinning={this.state.spinning}>
                    <Form>
                        <div ref={(ref) => this.refs = ref} style={{ marginBottom: '80px' }}>
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
                                <Button type={this._type ? null : 'primary'}
                                    onClick={() => Util.print(this.refs)}>打印</Button>
                                {
                                    this._type == 'void' ?
                                        <Button type="primary" onClick={this.handleToVoid}>作废</Button> : null
                                }
                                {
                                    this._type == 'fail' ?
                                        <Button type="primary" onClick={this.handleToFail}>确认流标</Button> : null
                                }
                                {
                                    bidData.status == 60 ?
                                        <Button type="primary" onClick={this.handleToselect}>择标下单</Button> : null
                                }
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

                        <Modal title="报价详情"
                            width={1000}
                            visible={this.state.offerDetailVisible}
                            onCancel={this.offerDetailClose}
                            footer={<Button key="back" type="ghost" onClick={this.offerDetailClose}>关 闭</Button>}>
                            <div>
                                <Table dataSource={this.state.offerDetaillist}
                                    columns={this.offerDetailCols}
                                    pagination={false} />
                            </div>
                        </Modal>

                        <Modal title="场次作废"
                            width={500}
                            visible={this.state.voidVisible}
                            onCancel={() => {
                                this.setState({ voidVisible: false })
                            }}
                            onOk={this.voidOk}>
                            <div>
                                <div>
                                    <h3 className="mb10">
                                        <Icon type="question-circle reuse_conficon_question" />
                                        确定作废该场次信息吗？
                                    </h3>
                                    <div className="pdl20 pdr20">
                                        <Row>
                                            <Col className="reuse_label" span={6}>竞价场次</Col>
                                            <Col className="reuse_value" span={18}>{bidData.code || '--'}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="reuse_label" span={6}>场次名称</Col>
                                            <Col className="reuse_value" span={18}>{bidData.title || '--'}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="reuse_label" span={6}>销售单位</Col>
                                            <Col className="reuse_value" span={18}>{bidData.saleCompanyName || '--'}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="reuse_label" span={6}>销售项目部</Col>
                                            <Col className="reuse_value" span={18}>{bidData.saleDeptName || '--'}</Col>
                                        </Row>
                                        <Row className="reuse_row mt10">
                                            <FormItem label="作废理由">
                                                <Input
                                                    type="textarea"
                                                    {...getFieldProps('cancelReason', {
                                                        initialValue: cancelReason,
                                                        rules: [
                                                            { required: true, message: '请输入作废理由' }
                                                        ],
                                                        onChange: (el) => {
                                                            this.valueCahnge(el, 'cancelReason')
                                                        }
                                                    })}
                                                    autosize={autosize}
                                                    maxLength={maxLength}></Input>
                                            </FormItem>
                                            <p className="text_r">{cancelReason ? cancelReason.length : 0}/{maxLength}</p>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Modal>


                        <Modal
                            title="保证金管理"
                            maskClosable={false}
                            width={1000}
                            visible={this.state.detailBzjVisible}
                            onOk={() => {
                                this.setState({ detailBzjVisible: false })
                            }}
                            onCancel={() => {
                                this.setState({ detailBzjVisible: false })
                            }}
                            footer={
                                <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                    <Button type="primary" onClick={() => {
                                        this.setState({ detailBzjVisible: false })
                                    }}>关闭</Button>
                                </div>
                            }>
                            <SaleBondManage uuids={this.state.bidData.uuids} manageStatus={this.state.bidData.status}>&gt;</SaleBondManage>
                        </Modal>
                        <Modal title="场次流标"
                            width={500}
                            visible={this.state.failVisible}
                            onCancel={() => {
                                this.setState({ failVisible: false })
                            }}
                            onOk={this.failOk}>
                            <div>
                                <div>
                                    <h3 className="mb10">
                                        <Icon type="question-circle reuse_conficon_question" />
                                        确定流标该场次信息吗？
                                    </h3>
                                    <div className="pdl20 pdr20">
                                        <Row>
                                            <Col className="reuse_label" span={6}>竞价场次</Col>
                                            <Col className="reuse_value" span={18}>{bidData.code || '--'}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="reuse_label" span={6}>场次名称</Col>
                                            <Col className="reuse_value" span={18}>{bidData.title || '--'}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="reuse_label" span={6}>销售单位</Col>
                                            <Col className="reuse_value" span={18}>{bidData.saleCompanyName || '--'}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="reuse_label" span={6}>销售项目部</Col>
                                            <Col className="reuse_value" span={18}>{bidData.saleDeptName || '--'}</Col>
                                        </Row>
                                        <Row className="mt10">
                                            <FormItem label="流标理由">
                                                <Select
                                                    style={{ width: '200px' }}
                                                    {...getFieldProps('failType', {
                                                        initialValue: failType,
                                                        rules: [
                                                            { required: true, message: '请选择流标理由类型' }
                                                        ],
                                                        onChange: (el) => {
                                                            this.valueCahnge(el, 'failType')
                                                        }
                                                    })}
                                                    placeholder="请选择流标理由类型">
                                                    {
                                                        _FAILGROUP.map(v => {
                                                            return <Option value={v.id} key={v.id}>{v.value}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                        </Row>
                                        <Row className="mt10" style={{ position: 'relative' }}>
                                            <FormItem>
                                                <Input
                                                    type="textarea"
                                                    {...getFieldProps('failReason', {
                                                        initialValue: failReason,
                                                        rules: [
                                                            { required: true, message: '请输入流标理由' }
                                                        ],
                                                        onChange: (el) => {
                                                            this.valueCahnge(el, 'failReason')
                                                        }
                                                    })}
                                                    autosize={autosize}
                                                    maxLength={maxLength}></Input>
                                            </FormItem>
                                            <p className="text_r" style={{
                                                position: "absolute",
                                                right: 0,
                                                bottom: 0
                                            }}>{failReason ? failReason.length : 0}/{maxLength}</p>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </Form>
                </Spin>

                {/*确认报名弹窗*/}
                <Modal title="确认报名"
                       width={800}
                       visible={confirmVisible}
                       onCancel={this.cancelSceneConfirmation}
                       footer={[
                           <Button key="back" type="ghost" onClick={this.cancelSceneConfirmation}>关 闭</Button>,
                           <Button key="confirm" type="primary" onClick={this.okSceneConfirmation}>确认报名</Button>
                       ]}
                >
                    {this.showConfirmSign(confirmSceneSignData)}
                    <Row span={24} className={less.modalSign}>
                        <Row span={24} className={less.firstRow}>
                            <Col span={4}><span style={{color: 'red' }}>*</span>确认结果:</Col>
                            <Col span={20}>
                                <Select
                                    id={'confirmResult'}
                                    style={{width: 300}}
                                    onChange={this.changeConfirmResult}
                                >
                                    <Option key={1} value={1}>允许参与本次竞价</Option>
                                    <Option key={2} value={2}>资质不符合要求不予通过</Option>
                                    <Option key={3} value={3}>该企业存在不良行为记录不予通过</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row span={24} className={less.firstRow}>
                            <Col span={4}><span style={{color: 'red'}}>*</span>备注:</Col>
                            <Col span={20}>
                                <Input id={'confirmRemarks'} type="textarea" rows={4} maxLength={300} />
                            </Col>
                        </Row>
                    </Row>
                </Modal>
                {/*择标下单页面*/}
                <Modal title="择标下单"
                       width={800}
                       visible={selectBidVisible}
                       onCancel={this.cancelSelectBid}
                       footer={[
                           <Button key="back" type="ghost" onClick={this.cancelSelectBid}>关 闭</Button>,
                           <Button key="confirm" type="primary" onClick={this.okSelectBid}>确认下单</Button>
                       ]}
                >
                    <Table
                        columns={this.selectColumns()}
                        dataSource={selectBidData}
                    >
                    </Table>
                    {this.showSelectCompanyInfo(selectCompany)}

                </Modal>
            </div>
        )
    }
}

export default Form.create()(SaleSceneDetail)
