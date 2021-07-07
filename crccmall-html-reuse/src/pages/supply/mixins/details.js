import React from 'react';
import api from '@/framework/axios'
import '../style/detail.css'
import {
    Modal, Button
} from 'antd'
import notFind from '@/static/img/notFind.svg'
import { closeWin } from '@/utils/dom';
import { configs } from '@/utils/config/systemConfig';
import { viewImg } from "@/utils/urlUtils";
import Util from "@/utils/util";
import history from "@/utils/history";
import viewDown from '../../isViewDown';
import { systemConfigPath } from '@/utils/config/systemConfig';
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

let { downUrl } = configs;
const { confirm } = Modal;

// 轮播
class ReactSwiperExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
        };
    }

    switchActive = active => this.setState({ active });

    render() {
        let { data, type } = this.props;
        if (Array.isArray(data) && data.length) {
            return (
                <div className="swiper-container container-tag" content={type}>
                    <div className="swiper-container-main">
                        <img src={data.length ? viewImg(data[this.state.active].filePath) : notFind} alt="" style={{ height: '100%' }} />
                    </div>
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
            datum: null
        };
    }

    componentDidMount() {
        this.initialization()
    }

    initialization() {
        const uuids = this.props.match.params.uuids;
        if (uuids) {
            api.ajax('GET', this.initUrl, {
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

    // 按钮
    buttons = (status) => {
        let all = [30];
        if (all.indexOf(status) > -1) {
            return (
                <div className="fixed_button" style={{ textAlign: 'center', padding: '12px', background: '#fff' }}>
                    <Button type="primary" onClick={this.cancellationNotice}>撤销公告</Button>&nbsp;&nbsp;
                    <Button onClick={closeWin}>关闭</Button>
                </div>
            )
        }
        return (
            <div className="fixed_button" style={{ textAlign: 'center', padding: '12px', background: '#fff' }}>
                <Button type="primary" onClick={closeWin}>关闭</Button>
            </div>
        )
    };
    // 撤销公告
    cancellationNotice = () => {
        const uuids = this.props.match.params.uuids;
        let that = this;
        let backUrl = this.cancellationNoticeUrl === '@/reuse/supplyDemand/back' ? '/supply/sell' : '/supply/sell';
        Util.confirm('你是否真的要撤销该供求信息公告?', {
            tip: '撤销后平台将不再显示该供求信息公告',
            iconType: 'del',
            onOk() {
                if (uuids) {
                    api.ajax('POST', that.cancellationNoticeUrl, {
                        uuids
                    }).then(res => {
                        if (res.code == '000000') {
                            Util.alert(res.msg || '撤销成功', {
                                type: 'success'
                            });
                            history.push(backUrl);
                        } else {
                            Util.alert(res.msg || '撤销成功', {
                                type: 'error'
                            });
                        }

                        that.initialization()
                    }, error => {
                        Util.alert(error.msg || '撤销失败', {
                            type: 'error'
                        })
                    })
                }
            }
        })
    };

    render() {
        let { datum } = this.state;
        if (!datum) return null;
        let goods = datum.goodsList[0]
        return (
            <div className="detail-container padding-g padding-top">
                <div className="flex bottomBor padding-g padding-way">
                    <ReactSwiperExample data={goods.goodsFileList} type={datum.type == 1 ? '供应' : '求购'} />
                    <div className="flexAuto padding-g padding-left">
                        <div className="titleLarge" style={{ wordBreak: 'break-all' }}>
                            {datum.noticeName}
                        </div>
                        <div className="bgGrey padding-g margin-g margin-top relative">
                            <div className="tag">{datum.statusStr}</div>
                            <p className="listContent"><span
                                className="listLabel">联系人</span>{datum.contacts} {datum.contactsTel}</p>
                            <p className="listContent"><span className="listLabel">销售/采购对象</span>{datum.targetStr || '--'}</p>
                            {
                                datum.status == 25 ? <p className="listContent"><span
                                    className="listLabel">驳回理由</span>{datum.approvalOpinion}</p> : null
                            }
                        </div>
                        <div className="bottomBor padding-g">
                            {
                                datum.type == 1 ?
                                    <p className="listFit"><span
                                        className="listLabel">存放方式/时间</span>{datum.storageWayStr}/{datum.storageTime ? datum.storageTime + '天' : ''}
                                    </p>
                                    : null
                            }
                            {
                                datum.type == 1 ?
                                    <p className="listFit"><span className="listLabel">原价值</span>{goods.original ? toFixed(goods.original, 2) + '元' : '-'}</p>
                                    : null
                            }
                            <p className="listFit"><span className="listLabel">折损程度</span>{datum.damage || '--'} </p>
                            <p className="listFit"><span className="listLabel">单价</span>{
                                // 价格：如果isFace=1就显示电议，否则正常取值：price
                                goods.isFace ? '电议' : `${goods.price ? toFixed(goods.price, 2) : '--'} 元`
                            }</p>
                            <p className="listFit"><span className="listLabel">应用领域</span>{datum.useAreaStr || '--'}</p>
                            <p className="listFit"><span className="listLabel">{datum.type == 1 ? '存量及单位' : '求购数量及单位'}</span>
                                {
                                    goods.isBigNum ? '电议' : `${goods.stockNum || '--'} ${goods.unit || '--'}`
                                }
                            </p>
                        </div>
                        <div className="padding-g">
                            {
                                datum.type == 1 ? <p className="listFit" style={{ width: '100%' }}><span className="listLabel">货物所在地</span>{
                                    [datum.provinceName,
                                    datum.cityName,
                                    datum.countyName,
                                    datum.goodsAddr].join('')
                                }</p> : null
                            }
                            <p className="listFit"><span className="listLabel">发布日期</span>{datum.createTime || '--'}</p>
                            <p className="listFit"><span className="listLabel">信息有效日</span>{datum.effectiveDateStr || '--'}</p>
                        </div>
                    </div>
                </div>
                <div className="bottomBor padding-g">
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
                <div className="titleLittle bottomBor padding-g">
                    供求附件
                </div>
                <div className="padding-g margin-g">
                    {
                        datum.fileList.length ?
                            datum.fileList.map((value, key) => (
                                <div className="link"
                                    key={key}
                                >
                                    {value.fileName}
                                    <span
                                        className="linkButton"
                                        onClick={() => viewDown(value.fileName, systemConfigPath.fileDown(value.filePath), true)}>
                                        下载
                                </span>
                                </div>
                            ))
                            : '--'
                    }
                </div>
                <div className="cutOff" style={{ marginBottom: '40px' }} />
                {
                    this.buttons(datum.status)
                }
            </div>
        )
    }
}

export default SupplyDetail
