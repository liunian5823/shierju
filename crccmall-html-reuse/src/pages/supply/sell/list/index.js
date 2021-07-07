import List from '../../mixins/list'
import Qs from 'qs'
import { systemConfigPath } from "@/utils/config/systemConfig";
import AuthButton from '@/components/authButton';
import { baseService } from '@/utils/common';
import Util from '@/utils/util'
import BaseTabs from "components/baseTabs";
const _MAINBIDOBJ = baseService._supplyMainBid_obj;
const _SID = baseService.sellBid;

export default class SupplyDemand extends List {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        sessionStorage.SupplyStatus = ''
    }

    baseParams = {
        tabStatus: sessionStorage.SupplyStatus || null
    }

    columns = [
        {
            title: '类型',
            dataIndex: 'typeStr',
            key: 'typeStr',
            width: 70,
            sorter: true
        },
        {
            title: '供求信息单号',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            sorter: true
        },
        {
            title: '信息标题',
            dataIndex: 'noticeName',
            key: 'noticeName',
            width: 130,
            sorter: true,
            className: 'text_line5_td'
        },
        {
            title: '单位名称',
            dataIndex: 'publishCompanyName',
            key: 'publishCompanyName',
            width: 130,
            sorter: true,
            className: 'text_line5_td'
        },
        {
            title: '销售项目部',
            dataIndex: 'publishProjectName',
            key: 'publishProjectName',
            width: 130,
            sorter: true,
            className: 'text_line5_td'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            sorter: true,
            render: (text, record) => {
                let item = _MAINBIDOBJ[text] || {};
                return (
                    <div className="service" style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={item.style}>{record.statusStr}</div>
                    </div>
                )
            }
        },
        {
            title: '递交时间',
            dataIndex: 'commitTime',
            key: 'commitTime',
            width: 120,
            sorter: true,
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
            title: '截止时间',
            dataIndex: 'effectiveDateStr',
            key: 'effectiveDateStr',
            width: 120,
            sorter: true,
            className: 'text_right',
        },
        {
            title: '发布时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 120,
            sorter: true,
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
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 100,
            fixed: 'right',
            render: (text, record) => {
                return (
                    <span className="reuse_baseButtonGroup">
                        <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>详情</AuthButton><br />
                        {/*{*/}
                        {/*    record.status == 10*/}
                        {/*        ? <p><AuthButton elmType="a" onClick={() => { this.submitItem(record) }}>递交</AuthButton></p>*/}
                        {/*        : null*/}
                        {/*}*/}
                        {
                            record.status == 10
                                ? <p><AuthButton elmType="a" onClick={() => { this.edit(record) }}>编辑</AuthButton></p>
                                : null
                        }
                        {
                            record.status == 25
                                ? <p><AuthButton elmType="a" onClick={() => { this.edit(record) }}>编辑</AuthButton></p>
                                : null
                        }
                        {
                            record.status == 40
                                ? <p><AuthButton elmType="a" onClick={() => { this.republish(record) }}>再次发布</AuthButton></p>
                                : null
                        }
                        {
                            record.status == 25
                                ? <p><AuthButton elmType="a" onClick={() => { this.republish(record) }}>再次发布</AuthButton></p>
                                : null
                        }
                        {
                            record.status == 10
                                ? <p><AuthButton elmType="a" onClick={() => { this.switchDelVis(record) }}>删除</AuthButton></p>
                                : null
                        }
                        {
                            record.status == 30
                                ? <p><AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>撤销公告</AuthButton></p>
                                : null
                        }
                        {
                            (record.status == 30 || record.status == 50) && record.dealTime == null
                                ? <p> <AuthButton elmType="a" onClick={() => { this.createOrder(record) }}>生成订单</AuthButton></p>
                                : null
                        }
                        {
                            record.status == 50
                                ? <p> <AuthButton elmType="a" onClick={() => { this.republish(record) }}>再次发布</AuthButton></p>
                                : null
                        }
                        {
                            record.status == 50
                                ? <p> <AuthButton elmType="a" onClick={() => { this.viewOrderDetails(record) }}>查看订单</AuthButton></p>
                                : null
                        }
                    </span>
                )
                // switch (record.status) {
                //     case 10: //10草稿       详情、发布、删除
                //         return (
                //             <span className="reuse_baseButtonGroup">
                //                 <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>详情</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.submitItem(record) }}>发布</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.switchDelVis(record) }}>删除</AuthButton>
                //             </span>
                //         );
                //     case 20: // 20待审核     详情
                //         return (
                //             <span className="reuse_baseButtonGroup">
                //                 <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>详情</AuthButton>
                //             </span>
                //         );
                //     case 25: // 20待审核     详情
                //         return (
                //             <span className="reuse_baseButtonGroup">
                //                 <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>详情</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.submitItem(record) }}>发布</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.switchDelVis(record) }}>删除</AuthButton>
                //             </span>
                //         );
                //     case 30: // 30发布中    生成订单 详情、发布、删除
                //         return (
                //             <span className="reuse_baseButtonGroup">
                //                 <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>详情</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.createOrder(record) }}>生成订单</AuthButton>
                //                 {/* <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>撤销公告</AuthButton> */}
                //             </span>
                //         );
                //     case 40: // 40已失效  、撤销公告 生成订单 详情、发布、删除
                //         return (
                //             <span className="reuse_baseButtonGroup">
                //                 <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>详情</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>撤销公告</AuthButton>
                //             </span>
                //         );
                //     case 50: // 50已成交     再次发布 查看订单 、撤销公告 生成订单 详情、发布、删除
                //         return (
                //             <span className="reuse_baseButtonGroup">
                //                 <AuthButton elmType="a" onClick={() => { this.viewDetails(record) }}>详情</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.republish(record) }}>再次发布</AuthButton>
                //                 <AuthButton elmType="a" onClick={() => { this.viewOrderDetails(record) }}>查看订单</AuthButton>
                //             </span>
                //         );
                //     default:
                //         return null;
                // }
            }
        }
    ];

    // 列表接口
    pageUrl = '@/reuse/supplyDemand/findPage';
    // 删除接口
    delUrl = '@/reuse/supplyDemand/delete';
    // 递交接口
    submitUrl = '@/reuse/supplyDemand/commit';
    //导出
    exportUrl = '/reuse/supplyDemand/exportData';
    // 生成订单
    createOrder = data => window.open(systemConfigPath.jumpPage('/supply/sellCreateOrder/' + data.uuids));
    //供求信息发布
    addPublishSD = () => window.open(systemConfigPath.jumpPage('/desk/supply/sellOrBuy/add'));

    // 查看详情
    viewDetails = data => data.uuids && window.open(systemConfigPath.jumpPage('/supply/sellDetail/' + data.uuids));
    // 查看订单
    viewOrderDetails = (data) => {
        if (data.uuids) {
            if (data.dealTime !== null) {
                window.open(systemConfigPath.jumpPage('/supply/sellOrderDetail/' + data.uuids));
            } else {
                Util.alert('请先生成订单', { type: 'error' })
            }
        }

    }

    tabChange = (prop) => {
        this.setState({
            defaultKey: prop === '0' ? null : prop
        })
        this.baseParams.tabStatus = prop === '0' ? null : prop;
        this.reloadTableData()
    }
    // 再次发布
    republish = data => data.uuids && window.open(systemConfigPath.jumpPage('/desk/supply/sellOrBuy/add/' + data.uuids + '?type=repub'));
    edit = data => data.uuids && window.open(systemConfigPath.jumpPage('/desk/supply/sell/edit/' + data.uuids));
    buttton = (
        <BaseTabs defaultKey={this.state.defaultKey} tabsList={_SID} tabChange={this.tabChange}>
            <AuthButton onClick={this.exportList}>导出</AuthButton>
            <AuthButton type="primary" onClick={this.addPublishSD}>发布供求信息</AuthButton>
        </BaseTabs>
    )
    render() { return super.render(); }
}
