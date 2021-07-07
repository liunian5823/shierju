import List from '../mixins/list';
import AuthButton from '@/components/authButton'
import { exportFile } from "../utils/util";
import { baseService } from '@/utils/common';
import api from "@/framework/axios";
import { Modal, Input, message } from 'antd';
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
const serviceStyle = {
    style1: {
        color: "#5CC7F8",//蓝色
    },
    style2: {
        color: "#FB9F1D",//橙色
    },
    style3: {
        color: "#18C16E",//绿色
    },
    style4: {
        color: "#D5D5D5",//灰色
    },
    style5: {
        color: "#e96c47",//红色
    },
}
/**
 * 主状态只为提供：teb切换、搜索、列表状态的颜色;
 * 列表状态的文字显示以后台提供数据为准;
 */
//销方主状态
const saleMainBid = [
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '待发布',
        id: '10',
        style: serviceStyle.style2
    },
    {
        value: '审核中',
        id: '20',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '待审核',
        id: '21',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已驳回',
        id: '22',
        note: '',
        style: serviceStyle.style5
    },
    {
        value: '报名中',
        id: '30',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '保证金',
        id: '40',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '未确认',
        id: '41',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已确认',
        id: '42',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '竞价中',
        id: '50',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '待开标',
        id: '60',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '待确认',
        id: '61',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '待审核',
        id: '62',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已驳回',
        id: '63',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已完成',
        id: '70',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '已成交',
        id: '71',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '已流标',
        id: '72',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '失效/作废',
        id: '100',
        note: '',
        style: serviceStyle.style4
    },
    {
        value: '参与企业不足',
        id: '101',
        note: '',
        style: serviceStyle.style4
    },
    {
        value: '中止',
        id: '102',
        note: '',
        style: serviceStyle.style4
    }
]
//竞价方式
const _BIDTYPE = baseService.bidType;

function statusStyle({ status }) {
    let style = saleMainBid.find(value => value.id == status);
    return style ? style.style : {}
}
class BidManagement extends List {
    state = {
        invalidAnnouncementConfirmLoading: false,
        invalidAnnouncementVisible: false,
        invalidAnnouncementData: null,
        invalidAnnouncementText: '',
    };
    formList = () => {
        return [
            {
                type: 'INPUT',
                field: 'nameOrCode',
                label: '名称/单号',
                placeholder: '竞价名称或单号'
            },
            {
                type: 'INPUT',
                field: 'saleCompanyName',
                label: '供货单位',
                placeholder: '供货单位'
            },
            {
                type: 'INPUT',
                field: 'saleDeptName',
                label: '供货项目部',
                placeHolder: '销售项目部'
            },
            {
                type: 'INPUT',
                field: 'goodsName',
                label: '商品名称',
                placeholder: '商品名称'
            },
            {
                type: 'INPUT',
                field: 'bidCompany',
                label: '中标企业',
                placeholder: '中标企业'
            },
            {
                type: 'INPUT',
                field: 'orderNo',
                label: '订单号',
                placeholder: '订单号'
            },
            {
                type: 'RANGE',
                field: 'creatStartDate',
                label: '发布日期',
                placeHolder: '请筛选发布日期'
            },
            {
                type: 'RANGE',
                field: 'bidStartDate',
                label: '下单日期',
                placeHolder: '请筛选下单日期'
            },
            {
                type: 'RANGE',
                field: 'offerStartTimeStart',
                label: '竞价开始时间',
                placeHolder: '请筛选竞价开始时间'
            },
            {
                type: 'RANGE',
                field: 'offerEndTimeStart',
                label: '竞价结束时间',
                placeHolder: '请筛选竞价结束时间'
            },
            {
                type: 'RANGE',
                field: 'signEndTimeStart',
                label: '报名截止时间',
                placeHolder: '请筛选竞价结束时间'
            },
            {
                type: 'SELECT',
                field: 'bidWay',
                label: '竞价方式',
                list: _BIDTYPE,
                placeholder: '请选择'
            },
            {
                type: 'SELECT',
                field: 'status',
                label: '状态',
                placeholder: '请选择状态',
                list: [
                    {
                        id: '10',
                        value: '待发布'
                    },
                    {
                        id: '20',
                        value: '审核中'
                    },
                    {
                        id: '30',
                        value: '报名中'
                    }, {
                        id: '40',
                        value: '保证金'
                    }, {
                        id: '50',
                        value: '竞价中'
                    }, {
                        id: '60',
                        value: '待开标'
                    }, {
                        id: '70',
                        value: '已完成'
                    }, {
                        id: '100',
                        value: '失效/作废'
                    }
                ]
            },
        ]
    };
    initUrl = '**/reuse/scene/findPage';
    handleToExport = () => {
        exportFile('/reuse/scene/export', this.baseParams)
    };
    columns = () => {
        return [
            {
                title: '竞价编号',
                dataIndex: 'code',
                key: 'code',
                width: 150,
                sorter: true
            },
            {
                title: '公告名称',
                dataIndex: 'title',
                key: 'title',
                width: 150,
                sorter: true
            },
            {
                title: '供货单位',
                dataIndex: 'saleCompanyName',
                key: 'saleCompanyName',
                width: 200,
                sorter: true
            },
            {
                title: '供货项目部',
                dataIndex: 'saleDeptName',
                key: 'saleDeptName',
                width: 200,
                sorter: true
            },
            {
                title: '竞价方式',
                dataIndex: 'bidWayStr',
                key: 'bidWayStr',
                width: 150,
                sorter: true
            },
            {
                title: '状态',
                dataIndex: 'statusStr',
                key: 'statusStr',
                width: 150,
                sorter: true,
                render: (text, record) => {
                    let color = ''
                    color = record.status == 10 || (record.status >= 60 && record.status < 70) ? '#fa9b13' : color
                    color = record.status >= 20 && record.status < 60 ? '#2db7f5' : color
                    color = record.status >= 70 && record.status < 80 ? '#0cba5e' : color
                    color = record.status >= 100 ? '#f15557' : color
                    return (
                        <div className="service">
                            <div style={{ color }}>{record.statusStr}</div>
                            <div className="note">{record.childStatusStr}</div>
                        </div>
                    )
                }
            },
            {
                title: '报名数',
                dataIndex: 'signNum',
                key: 'signNum',
                width: 120,
                sorter: true,
            },
            {
                title: '发布时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 150,
                sorter: true,
            },
            {
                title: '报名截止时间',
                dataIndex: 'signEndTime',
                key: 'signEndTime',
                width: 150,
                sorter: true,
            },
            {
                title: '竞价开始时间',
                dataIndex: 'offerStartTime',
                key: 'offerStartTime',
                width: 150,
                sorter: true,
            },
            {
                title: '竞价结束时间',
                dataIndex: 'offerEndTime',
                key: 'offerEndTime',
                width: 150,
                sorter: true,
            },
            {
                title: '下单时间',
                dataIndex: 'bidTime',
                key: 'bidTime',
                width: 150,
                sorter: true,
            },
            {
                title: '中标单位',
                dataIndex: 'bidCompanyName',
                key: 'bidCompanyName',
                width: 200,
                sorter: true,
            },
            {
                title: '中标金额（元）',
                dataIndex: 'bidAmt',
                key: 'bidAmt',
                width: 120,
                className: 'text_right',
                sorter: true,
                render: text => {
                    return toFixed(text, 2)
                }
            },
            {
                title: '出价次数',
                dataIndex: 'offerNum',
                key: 'offerNum',
                className: 'text_right',
                width: 120,
                sorter: true,
            },
            {
                title: '出价人数',
                dataIndex: 'buyerNum',
                key: 'buyerNum',
                className: 'text_right',
                width: 120,
                sorter: true,
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'x',
                width: 80,
                fixed: 'right',
                render: (text, record) => (
                    <span>
                        <AuthButton elmType="a" onClick={() => {
                            this.handleToDetails(record.uuids)
                        }}>查看详情</AuthButton><br />{
                            record.status < 70 && <AuthButton elmType="a" onClick={() => {
                                this.switchInvalidAnnouncementModel(record)
                            }}>场次终止</AuthButton>
                        }
                    </span>)
            }
        ]
    };
    handleToDetails = (id) => {
        this.props.history.push(this.props.history.location.pathname + '/details' + '/' + id)
    };


    //  作废公告model
    switchInvalidAnnouncementModel = (data = null) => {
        this.setState({
            invalidAnnouncementData: data,
            invalidAnnouncementVisible: !this.state.invalidAnnouncementVisible,
            invalidAnnouncementConfirmLoading: false,
            invalidAnnouncementText: '',
        })
    };
    // 作废公告
    invalidAnnouncement = () => {
        if (this.state.invalidAnnouncementText === '') {
            message.warning('请输入场次终止原因');
            return;
        };
        this.setState({
            invalidAnnouncementConfirmLoading: true,
        });
        api.ajax('post', '**/reuse/scene/stop', {
            uuids: this.state.invalidAnnouncementData.uuids,
            stopReason: this.state.invalidAnnouncementText
        }).then(data => {
            if (data.code == 200) {
                this.setState({
                    invalidAnnouncementVisible: false,
                    invalidAnnouncementConfirmLoading: false,
                });
                this.reloadTableData();
                message.success('场次终止成功');
            } else {
                message.error('场次终止失败');
            }
        }, e => {
            this.setState({
                invalidAnnouncementConfirmLoading: false,
            });
            message.error(e.msg);
        })
    };
    // 作废原因
    invalidAnnouncementChange = ({ target: { value: invalidAnnouncementText } }) => {
        this.setState({
            invalidAnnouncementText
        })
    };

    render() {
        let { invalidAnnouncementConfirmLoading, invalidAnnouncementVisible, invalidAnnouncementData: data, invalidAnnouncementText } = this.state;
        return (
            <div>
                <Modal
                    title="场次终止"
                    visible={invalidAnnouncementVisible}
                    onOk={this.invalidAnnouncement}
                    confirmLoading={invalidAnnouncementConfirmLoading}
                    onCancel={this.switchInvalidAnnouncementModel}
                >
                    <h3 style={{ display: 'flex', padding: '0 0 10px 0' }}>场次公告名称：
                        <p style={{ flex: 1, wordBreak: 'break-all' }}>{data && data.title}</p></h3>
                    <Input type="textarea"
                        maxLength='200'
                        placeholder="请输入场次终止原因"
                        rows={5}
                        value={invalidAnnouncementText}
                        onChange={this.invalidAnnouncementChange} />
                    <span style={{ position: 'absolute', right: '30px', bottom: '70px' }}>{invalidAnnouncementText.length}/200</span>
                </Modal>
                {super.render()}
            </div>
        )
    }
}

export default BidManagement;
