import React from 'react';
import { Card, Row, Col, Button, Icon, Modal, Form, Input, Spin } from 'antd';
const FormItem = Form.Item;

import ToggleTable from '@/components/toggleTable';
import api from '@/framework/axios';
import Util from '@/utils/util';
import FormatDate from '@/utils/date';
import { baseService } from '@/utils/common';
import { getSearchByHistory } from '@/utils/urlUtils';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import less from './approval.less';
import download from "business/isViewDown";
//竞价状态
const _MAINBIDOBJ = baseService._saleMainBid_obj;

class VerifyApproval extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bidData: {},
            approvalType: {},
            approvalVisible: false,
        }
    }
    _uuids = null
    _type = null
    //审批方式
    _approvalGroup = [
        { id: '1', status: '30', value: '审批通过', style: { color: '#43CD89' } },
        { id: '2', status: '22', value: '驳回', style: { color: '#F50F50' } },
    ]

    config = {
        span: [3, 20],
        bondSpan: [6, 18],
        detailSpan: [3, 20],
        autosize: {
            minRows: 6,
            maxRows: 6
        },
        maxLength: 200
    }
    //竞价产品
    goodsCols = [
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
                text ? <span>
                    <a className="reuse_link text_line4"
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
            title: '销售数量(单位)',
            key: 'num',
            dataIndex: 'num',
            width: 120,
            className: 'text_right text_line1_td',
            fixed: 'right',
            render(text, record) {
                text = text ? text + '/' + record.unit : '--'
                return <div className='text_right reuse_money' title={text}>
                    <span>{text}</span>
                </div>
            }
        },
    ]

    componentWillMount() {
        this.handleInit()
    }

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
            this.getSceneInfo()
        }
    }

    //获取页面数据
    getSceneInfo = () => {
        this.setState({
            spinning: true
        })
        api.ajax('GET', '@/reuse/sceneApproval/info', {
            uuids: this._uuids
        }).then(res => {
            if (res.data) {
                this.setState({
                    spinning: false,
                    bidData: res.data
                })
            }
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
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>发布人</Col>
                    <Col className="reuse_value" span={span[1]}>
                        <span>{bidData.createUserName}</span>
                        <span className="ml20">{bidData.createUserTel}</span>
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
                        <span>{bidData.contacts}</span>
                        <span className="ml20">{bidData.contactsTel}</span>
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

    //竞价要求
    createDemand = () => {
        const { bidData } = this.state;
        const { bondSpan, span } = this.config;

        return (
            <div>
                <Row className="reuse_row">
                    <Col span={12}>
                        <Col className="reuse_label" span={bondSpan[0]}>付款方式</Col>
                        <Col className="reuse_value" span={bondSpan[1]}>{bidData.payWayStr || '--'}</Col>
                    </Col>
                    <Col span={12}>
                        <Col className="reuse_label" span={bondSpan[0]}>付款时间</Col>
                        <Col className="reuse_value" span={bondSpan[1]}>成交后 <span className={less.color_red}>{bidData.payTime}</span> 天内</Col>
                    </Col>
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
                    <Col span={12}>
                        <Col className="reuse_label" span={bondSpan[0]}>存储方式</Col>
                        <Col className="reuse_value" span={bondSpan[1]}>{bidData.storageWayStr || '--'}</Col>
                    </Col>
                    <Col span={12}>
                        <Col className="reuse_label" span={bondSpan[0]}>存储时间</Col>
                        <Col className="reuse_value" span={bondSpan[1]}>{bidData.storageTime}天</Col>
                    </Col>
                </Row>
            </div>
        )
    }

    //竞价产品
    createGoods = () => {
        const { goodsList = [] } = this.state.bidData;

        return (
            <ToggleTable no_selection={true}
                dataSource={goodsList}
                columns={this.goodsCols}
                scroll={{ x: 1000 }}></ToggleTable>
        )
    }

    //竞价附件
    createFiles = () => {
        const { fileList = [] } = this.state.bidData;

        return (
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
        )
    }

    //保证金设置
    createBond = () => {
        const { bidData } = this.state;
        const { bondSpan, span } = this.config;
        const { bondWhiteList = [] } = bidData;

        return (
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
                        <Col className="reuse_value" span={bondSpan[1]}><span className="reuse_money">{bidData.bondAmt}</span>元</Col>
                    </Col>}
                    {
                        bidData.bondType != 1 && <Col span={12}>
                            <Col className="reuse_label" span={bondSpan[0]}>保证金收款账户</Col>
                            <Col className="reuse_value" span={bondSpan[1]}>{bidData.accountNo || '--'}</Col>
                        </Col>
                    }

                </Row>
                {
                    bidData.bondType != 1 && <Row className="reuse_row">
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Col className="reuse_label" span={bondSpan[0]}>开户行</Col>
                            <Col className="reuse_value" span={bondSpan[1]}>{bidData.openBank || '--'}</Col>
                        </Col>
                    </Row>
                }
                {
                    bidData.bondType != 1 && <Row className="reuse_row">
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Col className="reuse_label" span={bondSpan[0]}>来款备注</Col>
                            <Col className="reuse_value" span={bondSpan[1]}>{bidData.bondRemark || '--'}</Col>
                        </Col>
                    </Row>
                }
                <div className="reuse_baseTitle"></div>
                {bidData.bondType != 1 && <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>保证金白名单</Col>
                    <Col className="reuse_value" span={span[1]}>
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
        )
    }

    //竞价及隐私信息
    createPrivacy = () => {
        const { span } = this.config;
        const { bidData } = this.state;
        const { signList = [] } = bidData;

        return (
            <div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>隐私设置</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.privacySetStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>成交公告</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.dealNoticeStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>调价方式</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.adjustWayStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>增加幅度</Col>
                    <Col className="reuse_value" span={span[1]}><span className="reuse_money">{bidData.increRange}</span>{bidData.adjustWay == 1 ? '%' : '元'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>开盘价格</Col>
                    <Col className="reuse_value" span={span[1]}><span className="reuse_money">{bidData.startPrice}</span>元</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>成交底价</Col>
                    <Col className="reuse_value" span={span[1]}><span className="reuse_money">{bidData.basePrice}</span>元</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>最低参与企业数</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.minSign == 0 ? '无限制' : bidData.minSign}</Col>
                </Row>
                <div className="reuse_baseTitle"></div>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>竞价方式</Col>
                    <Col className="reuse_value" span={span[1]}>{bidData.bidWayStr || '--'}</Col>
                </Row>
                <Row className="reuse_row">
                    <Col className="reuse_label" span={span[0]}>邀请白名单</Col>
                    <Col className="reuse_value" span={span[1]}>
                        {
                            signList.length ?
                                signList.map((v, index) => {
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
        )
    }

    //返回
    toBack = () => {
        this.props.history.push('/verify/manage')
    }
    openApproval = (n) => {
        this.props.form.resetFields()
        this.setState({
            remark: '',
            approvalType: this._approvalGroup[n],
            approvalVisible: true,
        })
    }
    //审批确认
    toApproval = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const { approvalType } = this.state;
                //1通过，2驳回
                api.ajax('POST', '@/reuse/sceneApproval/updateSceneStatus', {
                    uuids: this._uuids,
                    status: approvalType.status,
                    approvalResult: approvalType.id,
                    remarks: values.remark,
                }).then(res => {

                    if (res.code === '000000') {
                        this.setState({
                            approvalVisible: false,
                        })
                        Util.alert(res.msg, { type: 'success' });
                        this.handleInit()
                        this.props.history.push('/verify/manage');
                    } else {
                        Util.alert(res.msg, { type: 'error' })
                    }
                }, error => {
                    Util.alert(error.msg, { type: 'error' })
                })
            }
        })
    }
    //理由onchang
    remarkChange = (el) => {
        this.setState({
            remark: el.target.value
        })
    }

    render() {
        const { bidData, approvalType, remark } = this.state;
        const { getFieldProps } = this.props.form;

        return (
            <div className={less.approval}>
                <Form>
                    <Spin spinning={this.state.spinning}>
                        <Card>
                            <div className="reuse_baseTitle">场次基本信息</div>
                            <div>{this.createSceneInfo()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价要求</div>
                            <div>{this.createDemand()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价产品</div>
                            <div>{this.createGoods()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">竞价附件</div>
                            <div>{this.createFiles()}</div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">补充说明</div>
                            <div className={less.exp}>
                                <div dangerouslySetInnerHTML={{
                                    __html: bidData.remark || '--'
                                }}></div>
                            </div>
                        </Card>
                        <Card className="mt10">
                            <div className="reuse_baseTitle">保证金设置</div>
                            <div>{this.createBond()}</div>
                        </Card>
                        <Card className="mt10" style={{ marginBottom: this._type != 'approval' ? '80px' : '' }}>
                            <div className="reuse_baseTitle">竞价及隐私信息</div>
                            <div>{this.createPrivacy()}</div>
                        </Card>
                    </Spin>
                    <Card className="mt10" className={this._type != 'approval' ? 'fixed_button' : 'mt10'}>
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            <Button onClick={this.toBack}>返回</Button>
                            {
                                (this._type == 'approval' && bidData.status == '21')
                                    ? <Button onClick={() => { this.openApproval(1) }}>驳回</Button>
                                    : null
                            }
                            {
                                (this._type == 'approval' && bidData.status == '21')
                                    ? <Button onClick={() => { this.openApproval(0) }} type="primary">通过</Button>
                                    : null
                            }
                        </div>
                    </Card>

                    <Modal
                        title="审批意见"
                        width={500}
                        visible={this.state.approvalVisible}
                        onOk={this.toApproval}
                        onCancel={() => { this.setState({ approvalVisible: false }) }}>
                        <Row className={less.modal_title}>
                            <Col className="reuse_label" span={5}>
                                <span>业务类型</span>
                            </Col>
                            <Col className="reuse_value" span={18}>
                                <span style={approvalType.style}>{approvalType.value || '--'}</span>
                            </Col>
                        </Row>
                        <FormItem>
                            <Input
                                type="textarea"
                                maxLength={200}
                                placeholder="请输入审批意见"
                                {...getFieldProps('remark', {
                                    rules: [
                                        { required: approvalType.value == '驳回', message: '请输入审批意见' }
                                    ],
                                    onChange: this.remarkChange
                                })}
                                autosize={{ minRows: 4, maxRows: 6 }}></Input>
                            <p className="text_r float_r">{remark ? remark.length : 0}/200</p>
                        </FormItem>
                    </Modal>
                </Form>
            </div>
        )
    }
}

export default Form.create()(VerifyApproval)
