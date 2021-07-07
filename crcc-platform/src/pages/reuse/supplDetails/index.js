import React from 'react';
import api from '@/framework/axios'
import './index.css'
import {
    Button, Modal, Input, Table, message,
} from 'antd'
import notFind from './notFind.svg'
import { configs } from '@/utils/config/systemConfig';
import { viewImg } from "@/utils/urlUtils";
import BaseAffix from "@/components/baseAffix";
import RcViewer from '@hanyk/rc-viewer';
import download from '../utils/isViewDown'
let { resourceUrl } = configs;
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

class ReactSwiperExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
        };
    }
    componentDidMount() {
    }
    switchActive = active => this.setState({ active });
    render() {
        let { data, type } = this.props;
        let { active } = this.state;
        if (Array.isArray(data) && data.length) {
            return (
                <div className="swiper-container container-tag" content={type}>
                    <RcViewer options={{
                        url: viewImg(data[active].filePath)
                    }}>
                        <div className="swiper-container-main">
                            <img className="img-zoomable"
                                style={{ height: '100%' }}
                                src={data.length ? viewImg(data[this.state.active].filePath) : notFind}
                                alt="" />
                        </div>
                    </RcViewer>
                    <div className="swiper-container-foot">
                        {
                            [notFind, notFind, notFind, notFind, notFind].map((value, key) => (
                                <div key={key} className={[
                                    'swiper-container-foot-item',
                                    this.state.active === key ? 'foot-item-active' : '',
                                    key < data.length ? 'foot-item-cu' : '',
                                ].join(' ')}
                                    onClick={() => key < data.length && this.switchActive(key)}
                                >
                                    <img src={data[key] ? viewImg(data[key].filePath) : value} alt="" />
                                </div>
                            ))
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <div className="swiper-container container-tag" content={type}>
                    <div className="swiper-container-main">
                        <img src={notFind} alt="" />
                    </div>
                    <div className="swiper-container-foot">
                        <div className="swiper-container-foot-item"><img src={notFind} alt="" /></div>
                        <div className="swiper-container-foot-item"><img src={notFind} alt="" /></div>
                        <div className="swiper-container-foot-item"><img src={notFind} alt="" /></div>
                        <div className="swiper-container-foot-item"><img src={notFind} alt="" /></div>
                        <div className="swiper-container-foot-item"><img src={notFind} alt="" /></div>
                    </div>
                </div>
            )
        }
    }
}

class SupplyDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datum: null,
            auditVisible: false,
            auditConfirmLoading: false,
            auditText: '',
            auditType: null,
        };
    }

    auditModelChange = (auditType = null) => {
        this.setState({
            auditType,
            auditConfirmLoading: false,
            auditVisible: !this.state.auditVisible,
            auditText: '',
        })
    };

    componentDidMount() {
        this.initialization()
    }

    initialization() {
        let search = this.props.location.pathname.split('?').length > 1 || !!this.props.location.search;
        const uuids = this.props.match.params.uuids.indexOf('?') >= 0 ? this.props.match.params.uuids.substring(0, this.props.match.params.uuids.indexOf('?')) : this.props.match.params.uuids;
        let url = search ? '**/reuse/supplyDemandManage/info' : '**/reuse/supplyDemand/info';
        if (uuids) {
            api.ajax('GET', url, {
                uuids
            }).then(res => {
                if (res.data) {
                    this.setState({
                        datum: res.data
                    });
                }
            })
        }
    };

    handleGoBack = () => {
        if (this.props.history.length > 1) {
            this.props.history.goBack();
        } else {
            window.close();
        }
    };
    // 作废公告
    auditSubmit = () => {
        if (this.state.invalidAnnouncementText === '') {
            message.warning('请输入通过/驳回理由');
            return;
        }
        if (this.state.auditType != 30 && this.state.auditText == '') {
            message.warning('请输入驳回理由');
            return;
        }
        this.setState({
            auditConfirmLoading: true,
        });
        api.ajax('post', '**/reuse/supplyDemandManage/approval', {
            uuids: this.state.datum.uuids,
            status: this.state.auditType,
            approvalOpinion: this.state.auditText,
        }).then(data => {
            if (data.code == 200) {
                this.setState({
                    auditConfirmLoading: false,
                    auditVisible: false,
                    auditText: ''
                });
                // this.initialization();
                message.success('审批成功');
                this.handleGoBack();
            } else {
                this.setState({
                    auditConfirmLoading: false,
                });
                message.error('审批失败');
            }
        }, e => {
            message.error(e.msg)
            this.setState({
                auditConfirmLoading: false,
            });
        });
    };
    auditTextChange = ({ target: { value: auditText } }) => {
        this.setState({
            auditText
        })
    };
    button = () => {
        let search = this.props.location.pathname.split('?').length > 1 || !!this.props.location.search;
        if (search && this.state.datum.status == 20) {
            return (
                <BaseAffix>
                    <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
                    <Button type="primary" style={{ marginRight: "10px" }} onClick={() => {
                        this.auditModelChange(25)
                    }}>驳回</Button>
                    <Button type="primary" style={{ marginRight: "10px" }} onClick={() => {
                        this.auditModelChange(30)
                    }}>通过</Button>
                </BaseAffix>
            )
        }
        return (
            <BaseAffix>
                <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
            </BaseAffix>
        )
    };

    columns = [
        {
            title: '审核人',
            width: 200,
            dataIndex: 'createUserName',
            key: 'createUserName',
            render(text, record) {
                return (
                    `${text}（${record.createUserId}）`
                )
            }
        },
        {
            title: '审核时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
        },
        {
            title: '审核意见',
            dataIndex: 'remark',
            key: 'remark',
        }
    ];

    render() {
        let { datum, auditConfirmLoading, auditText, auditVisible } = this.state;
        if (!datum) return null;
        let goods = datum.goodsList[0];
        return (
            <div className="detail-container padding-g padding-top">
                <Modal
                    title="审批意见"
                    visible={auditVisible}
                    onOk={this.auditSubmit}
                    confirmLoading={auditConfirmLoading}
                    onCancel={this.auditModelChange}
                >
                    <h3 className="colorGrey padding-l padding-bottom">
                        业务类型:
                        {this.state.auditType == 30 ? <span className="colorGreen">通过</span> :
                            <span className="colorRed">驳回</span>}
                    </h3>
                    <Input type="textarea"
                        maxLength='200'
                        placeholder="请输入审批意见"
                        rows={5}
                        value={this.state.auditText}
                        onChange={this.auditTextChange} />
                    <span style={{ position: 'absolute', right: '30px', bottom: '70px' }}>{auditText.length}/200</span>
                </Modal>
                <div className="flex bottomBor margin-g margin-way">
                    <ReactSwiperExample data={goods && goods.goodsFileList ? goods.goodsFileList : []} type={datum.type == 1 ? '供应' : '求购'} />
                    <div className="flexAuto padding-g padding-left">
                        <div className="titleLarge">
                            {datum.noticeName}
                        </div>
                        <div className="bgGrey padding-g margin-g margin-top relative">
                            <div className="tag">{datum.statusStr}</div>
                            <p className="listContent"><span className="listLabel">联系人</span>{datum.contacts || '--'} &nbsp; {datum.contactsTel || '--'}</p>
                            <p className="listContent"><span className="listLabel">销售/采购对象</span>{datum.targetStr || '--'}</p>
                            {
                                datum.status == 25 ? <p className="listContent"><span className="listLabel">驳回理由</span>{datum.approvalOpinion || '--'}</p> : null
                            }
                        </div>
                        <div className="bottomBor padding-g">
                            {
                                datum.type == 1 && <p className="listFit"><span
                                    className="listLabel">存放方式/时间</span>{datum.storageWayStr || '--'}/{datum.storageTime ? datum.storageTime + '天' : '--'}
                                </p>
                            }
                            {
                                datum.type == 1 && <p className="listFit"><span className="listLabel">原价值</span>{goods.original ? toFixed(goods.original, 2) + '元' : '--'}</p>
                            }
                            <p className="listFit"><span className="listLabel">折损程度</span>{datum.damage || '--'} </p>
                            <p className="listFit"><span className="listLabel">单价</span>{
                                goods.isFace ? '电议' : `${goods.price ? toFixed(goods.price, 2) : '--'} 元`
                            }</p>
                            <p className="listFit"><span className="listLabel">应用领域</span>{datum.useAreaStr || '--'}</p>
                            <p className="listFit"><span className="listLabel">{datum.type == 1 ? '存量及单位' : '求购数量及单位'}</span>{
                                goods.isBigNum ? '电议' : `${goods.stockNum || '--'} ${goods.unit || '--'}`
                            }</p>
                        </div>
                        <div className="padding-g">
                            {datum.type == 1 && <p className="listFit" style={{ width: '100%' }}><span className="listLabel">货物所在地</span>{
                                [datum.provinceName,
                                datum.cityName,
                                datum.countyName,
                                datum.goodsAddr].join('') || '--'
                            }</p>}
                            <p className="listFit"><span className="listLabel">发布日期</span>{datum.createTime || '--'}</p>
                            <p className="listFit"><span className="listLabel">信息有效日</span>{datum.effectiveDateStr || '--'}</p>
                        </div>
                    </div>
                </div>
                <div className="bottomBor padding-g margin-g margin-way">
                    <p className="listFit"><span className="listLabel">发布单位</span>{datum.publishCompanyName || '--'}</p>
                    <p className="listFit"><span className="listLabel">品类</span>{goods.classifyName || '--'}</p>
                    <p className="listFit"><span className="listLabel">发布项目部</span>{datum.publishProjectName || '--'}</p>
                    <p className="listFit"><span className="listLabel">物料编码</span>{goods.goodsCodeHand || '--'}</p>
                    <p className="listFit"><span className="listLabel">商品名称</span>{goods.goodsName || '--'}</p>
                    <p className="listFit"><span className="listLabel">品牌</span>{goods.brand || '--'}</p>
                    <p className="listFit"><span className="listLabel">规格型号</span>{goods.spec || '--'}</p>
                </div>
                <div className="cutOff" />
                <div className="titleLittle bottomBor padding-g">
                    物资详情
                </div>
                <div className="padding-g">
                    <div dangerouslySetInnerHTML={{ __html: goods.desc || '-' }} />
                </div>
                <div className="cutOff" />
                <div className="titleLittle bottomBor padding-l margin-g margin-way">
                    供求附件
                </div>
                <div className="padding-g margin-g">
                    {
                        datum.fileList.length ?
                            datum.fileList.map(value => (
                                <div className="link">
                                    {value.fileName}
                                    <a href="javascript:void(0);"
                                        onClick={() => download(value.fileName, resourceUrl + value.filePath, true)}
                                        className="linkButton">下载</a>
                                </div>
                            ))
                            : '--'
                    }
                </div>
                <div className="cutOff" />
                <div className="titleLittle bottomBor padding-l margin-g margin-way">
                    审批日志
                </div>
                <div className="padding-g margin-g margin-way">
                    <Table pagination={false} dataSource={datum.logList} columns={this.columns} />
                </div>
                <div className="cutOff" />
                {
                    datum.cancelReason ?
                    <div>
                        <div className="titleLittle bottomBor padding-l margin-g margin-way">
                            作废理由
                        </div>
                        <div className="padding-g margin-g margin-way">
                            {datum.cancelReason}
                        </div>
                        <div className="cutOff" />
                    </div>
                    : ''
                }
                {this.button()}
            </div>
        )
    }
}

export default SupplyDetail;
