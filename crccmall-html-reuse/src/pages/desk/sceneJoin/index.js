import React from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Icon,
    Table,
    Modal,
    Form,
    Input,
    Spin
} from 'antd';
const FormItem = Form.Item;

import less from './index.less';
import Util from '@/utils/util';
import api from '@/framework/axios';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import FormatDate from '@/utils/date';
import { closeWin } from '@/utils/dom';
import * as validatorRules from '@/utils/formCheck';
import ToggleTable from '@/components/toggleTable';
import DrapValidate from '@/components/drapValidate';
import download from "business/isViewDown";

//竞价状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;

class SceneJoin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bidData: {},//基本数据

            joinVisible: false,//报名Visible
            drapStatus: false,//滑动验证
            remarkLen: 0,//备注字数
            systemTime: null,//系统时间
        }
    }
    _uuids = null
    _status = [30]
    sceneCountDownTimer = null //场次倒计时

    config = {
        maxlength: 200,//备注最大长度
        span: [3, 21],
        col6: {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        }
    }

    goodsListCol = [
        {
            title: '序号',
            key: 'indexKey',
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
                    <span className="reuse_money">{text}/{record.unit}</span>
                </div>
            )
        },
    ]

    componentDidMount() {
        this.handleInit()
    }
    //初始化
    handleInit = () => {
        this._uuids = this.props.match.params.uuids;
        if (this._uuids) {
            this.getBidData(this._uuids)
        }
        this.getSystemTime()
    }
    //获取系统时间
    getSystemTime = () => {
        api.ajax('GET', '@/reuse/index/getSysDate')
            .then(res => {
                this.setState({
                    systemTime: res.data || new Date().getTime()
                })
            })
    }
    //获取页面信息
    getBidData = (uuids) => {
        this.setState({
            spinning: true,
        })
        if (uuids) {
            api.ajax('GET', '@/reuse/buyScene/join', {
                uuids
            }).then(res => {
                if (res.data) {
                    this.setState({
                        spinning: false,
                        bidData: res.data || {},
                    })
                    this.setSceneCountDown(res.data.signEndTime)
                }
            }, error => {
                Util.alert(error.msg, { type: 'error' })
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

    //基本场次信息
    createBaseInfo = () => {
        const { bidData } = this.state;
        const { span } = this.config;
        let statusStyle = {};
        if (bidData.status) {
            statusStyle = _MAINBIDOBJ[bidData.status].style;
        }

        return (
            <div>
                <div>
                    <Row className={less.titleInfo}>
                        <Col span={20}>
                            <p className={less.title_text} style={{ wordBreak: 'break-all' }}>{bidData.title}</p>
                        </Col>
                        <Col span={4}>
                            <div className={less.title_status} style={{ textAlign: 'right' }}>
                                <p className={less.main} style={statusStyle}>{bidData.statusStr}</p>
                                <p className={less.note}>{bidData.childStatusStr}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="reuse_row">
                        <Col className="reuse_label" span={span[0]}>竞价编号</Col>
                        <Col className="reuse_value" span={span[1]}>
                            <div className={less.code}>
                                <span>{bidData.code}</span>
                                <span id="countDown"
                                    className={less.countdown}
                                    style={{ float: 'right' }}>-</span>
                            </div>
                        </Col>
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
                    {/*<Row className="reuse_row">*/}
                    {/*    <Col className="reuse_label" span={span[0]}>发布人</Col>*/}
                    {/*    <Col className="reuse_value" span={span[1]}>*/}
                    {/*        <span>{bidData.createUserName} </span>*/}
                    {/*        <span> {bidData.createUserTel}</span>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
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
                            <span>{bidData.contacts}</span>
                            {
                                bidData.contactsTel
                                    ? <span id="contactsTel" style={{ marginLeft: '10px' }}>
                                        <Button type="primary" size="small" onClick={this.contactsTel}>查看电话号码</Button>
                                    </span>
                                    : null
                            }
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
            </div>
        )
    }
    //倒计时
    setSceneCountDown = (e) => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
        if (!e) return;
        let that = this;
        let end = new Date(e).getTime();
        let systemTime = this.state.systemTime;
        let dom = document.querySelector('#countDown');

        this.sceneCountDownTimer = setInterval(() => {
            if (!systemTime) {
                systemTime = this.state.systemTime;
                return;
            }
            systemTime += 1000;
            let text = '', format;

            if (systemTime <= end) {
                format = FormatDate.formatTimeCountDown(end - systemTime);
                text = `<span>报名截止剩余 <h3>${format.D}</h3> 天 <h3>${format.h}</h3> 时 <h3>${format.m}</h3> 分 <h3>${format.s}</h3> 秒</span>`;
            } else if (systemTime > end) {
                text = '报名已结束'
            }

            if (dom) dom.innerHTML = text;
            if (systemTime > end) {
                this.clearSceneCountDown()
            }
        }, 1000)
    }
    //清除场次倒计时
    clearSceneCountDown = () => {
        if (this.sceneCountDownTimer) clearInterval(this.sceneCountDownTimer);
    }
    //查看电话号码
    contactsTel = () => {
        let dom = document.querySelector('#contactsTel');
        if (dom) {
            dom.innerHTML = this.state.bidData.contactsTel || '-'
        }
    }

    //竞价要求
    createBidDemand = () => {
        const { bidData } = this.state;
        const { span } = this.config;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>付款方式</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.payWayStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>付款时间</Col>
                    <Col className="reuse_value" span={span[1]}>成交后 <span className={less.color_red}>{bidData.payTime}</span> 天内</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>货品所在地</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.provinceName}{bidData.cityName}{bidData.countyName}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>看货地址</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.khAddress || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>存储方式</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.storageWayStr}/{bidData.storageTime}天</Col>
                </Row>
            </div>
        )
    }

    //竞价附件
    createFileList = () => {
        const { fileList = [] } = this.state.bidData;

        return (
            <div className={less.fileList}>
                {
                    fileList.length ?
                        fileList.map((v, index) => {
                            return (
                                <div className={less.file_item} key={index}>
                                    <span><Icon type="paper-clip" />{v.fileName}</span>
                                    <a className={less.file_down}
                                        style={{ color: '#344fff' }}
                                        href="javascript:void(0);"
                                        onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath), true)}
                                    >下载</a>
                                </div>
                            )
                        })
                        : '--'
                }
            </div>
        )
    }

    //保证金设置
    createBond = () => {
        const { bidData } = this.state;
        const { span } = this.config;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金缴纳</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.bondTypeStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金金额</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.bondAmt || '--'}</Col>
                </Row>
            </div>
        )
    }

    //竞价及隐私信息
    createPrivacy = () => {
        const { bidData } = this.state;
        const { span } = this.config;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>调价方式</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.adjustWayStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>增价幅度</Col>
                    <Col className="reuse_value" span={span[1]}><span>{bidData.increRange}</span>{bidData.adjustWay == 1 ? '%' : '元'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>开盘价格</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.startPrice} 元</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>最低参与企业数</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.minSign == 0 ? '无限制' : bidData.minSign}</Col>
                </Row>
            </div>
        )
    }

    //导出商品清单
    epxortGoodsList = () => {
        if (this._uuids) {
            window.open(configs.exportUrl + '/reuse/sceneGoods/exportData?sceneId=' + this._uuids)
        }
    }
    //报名
    handleToJoin = () => {
        if (!this._uuids) return;

        this.setState({
            joinVisible: true,
            drapStatus: false
        })
    }

    //场次报名-确认
    joinOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                if (this._uuids) {
                    api.ajax('POST', '@/reuse/buyScene/sign', {
                        sceneId: this._uuids,
                        contacts: values.contacts,
                        contactsTel: values.contactsTel,
                        remark: values.remark
                    }).then(res => {
                        Util.alert(res.msg, { type: 'success' })
                        this.setState({
                            joinVisible: false
                        }, () => {
                            if (this._uuids) {
                                setTimeout(() => {
                                    this.props.history.push('/desk/bidJoinSuccess/' + this._uuids + `?num=${res.data}`)
                                }, 600)
                            }
                        })
                    }, error => {
                        Util.alert(error.msg || '报名失败', {
                            type: 'error'
                        })
                    })
                }
            }
        })
    }
    //滑动验证
    drapResult = (result) => {
        this.setState({
            drapStatus: result
        })
    }
    //备注-onchange
    remarkChange = (el) => {
        let remarkLen = 0;
        if (el.target.value) {
            remarkLen = el.target.value.length
        }
        this.setState({
            remarkLen
        })
    }

    render() {
        const { goodsList, status } = this.state.bidData;
        const { col6, maxlength } = this.config;
        const { getFieldProps } = this.props.form;

        return (
            <div className={less.scenejoin}>
                <Spin spinning={this.state.spinning}>
                    <div ref={(ref) => this.refs = ref}>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价单基本信息</div>
                            <div className={less.sceneInfo}>{this.createBaseInfo()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价要求</div>
                            <div>{this.createBidDemand()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">
                                <span>竞价产品</span>
                                <span data-print-hide className={less.exportBtn}>
                                    <Button type="primary" size="small" onClick={this.epxortGoodsList}>导出商品清单</Button>
                                </span>
                            </div>
                            <div>
                                <ToggleTable no_selection={true}
                                    dataSource={goodsList}
                                    columns={this.goodsListCol}></ToggleTable>
                            </div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价附件</div>
                            <div>{this.createFileList()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">保证金设置</div>
                            <div>{this.createBond()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价及隐私信息</div>
                            <div>{this.createPrivacy()}</div>
                        </Card>
                    </div>
                    <Card className="mt10">
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            {
                                this._status.indexOf(status) != -1
                                    ? <Button type="primary" onClick={this.handleToJoin}>报名参与竞价</Button>
                                    : null
                            }
                            <Button onClick={() => Util.print(this.refs)}>打印</Button>
                            <Button onClick={closeWin}>关闭</Button>
                        </div>
                    </Card>

                    <Modal title="场次报名"
                        maskClosable={false}
                        visible={this.state.joinVisible}
                        onOk={this.joinOk}
                        onCancel={() => { this.setState({ joinVisible: false }) }}
                        footer={
                            <div>
                                <Button type="ghost" size="large" onClick={() => { this.setState({ joinVisible: false }) }}>关闭</Button>
                                <Button type="primary" size="large" disabled={!this.state.drapStatus} onClick={this.joinOk}>确认报名</Button>
                            </div>
                        }>
                        <div className="reuse_baseForm_label pd20">
                            <Form>
                                <FormItem label="报价联系人" {...col6}>
                                    <Input
                                        {...getFieldProps('contacts', {
                                            rules: [
                                                { required: true, message: '请输入姓名' },
                                            ]
                                        })}
                                        placeholder="请输入姓名"></Input>
                                </FormItem>
                                <FormItem label="报价联系电话"  {...col6}>
                                    <Input
                                        {...getFieldProps('contactsTel', {
                                            rules: [
                                                { required: true, message: '请输入电话号码' },
                                                { validator: validatorRules.teleAndMobile }
                                            ]
                                        })}
                                        placeholder="请输入电话号码"></Input>
                                </FormItem>
                                <FormItem label="备注"  {...col6}>
                                    <Input
                                        className={less.remark}
                                        type="textarea"
                                        maxLength={maxlength}
                                        {...getFieldProps('remark', {
                                            onChange: this.remarkChange
                                        })}
                                        placeholder="请输入"
                                        autosize={{ minRows: 6, maxRows: 6 }}></Input>
                                    <p style={{ textAlign: 'right' }}>{this.state.remarkLen}/{maxlength}</p>
                                </FormItem>
                                <DrapValidate
                                    drapStatus={this.state.drapStatus}
                                    drapResult={this.drapResult}></DrapValidate>
                            </Form>
                        </div>
                    </Modal>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(SceneJoin)


