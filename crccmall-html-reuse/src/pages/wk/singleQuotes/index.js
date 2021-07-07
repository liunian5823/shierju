import React from 'react';
import less from './index.less';
import BaseTable from '@/components/baseTable';
import {Button} from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
export default class singleQuotes extends React.Component {
    columns = [
        {
            title: '采购商名称',
            dataIndex: 'buyerCompanyName',
            key: 'buyerCompanyName',
            sorter: true,
            width: 130,
            className: 'text_line5_td'
        },
        {
            title: '竞价编号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150,
        },
        {
            title: '公告名称',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            width: 130,
            className: 'text_line5_td'
        },
        {
            title: '销售部门',
            dataIndex: 'saleDeptName',
            key: 'saleDeptName',
            sorter: true,
            width: 130,
        },
        {
            title: '保证金状态',
            sorter: true,
            key: 'bondStatusStr',
            dataIndex: 'bondStatusStr',
            className: 'text_center',
            width: 110,
            render: (text, record, index) => {
                let color = colors[record.bondStatus]
                return (
                    <span style={{ color }}>
                        <p>{record.bondStatusStr}</p>
                    </span>
                )
            }
        },
        {
            title: '竞价状态',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            width: 110,
            render: (text, record) => {
                let item = _MAINBIDOBJ[text] || {};
                return (
                    <div style={item.style}>{record.statusStr}</div>
                )
            }
        },
        {
            title: '保证金金额(元)',
            dataIndex: 'bondAmt',
            key: 'bondAmt',
            sorter: true,
            className: 'text_right',
            width: 130,
            render: text => {
                return toFixed(text, 2)
            }
        },
        {
            title: '来款时间',
            dataIndex: 'bondPayTime',
            key: 'bondPayTime',
            sorter: true,
            className: 'text_right',
            width: 100,
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
            title: '确认时间',
            dataIndex: 'confirmTime',
            key: 'confirmTime',
            sorter: true,
            width: 100,
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
            title: '处理时间',
            dataIndex: 'occupyTime',
            key: 'occupyTime',
            sorter: true,
            width: 100,
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
            title: '竞价开始时间',
            dataIndex: 'offerStartTime',
            key: 'offerStartTime',
            sorter: true,
            width: 120,
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
            title: '竞价方式',
            dataIndex: 'bidWayStr',
            key: 'bidWayStr',
            sorter: true,
            width: 100,
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 120,
            fixed: 'right',
            render: (text, record) => (
                <span className="reuse_baseButtonGroup">
                    <AuthButton elmType="a" key="1" onClick={() => { this.handleToDetail(record) }}>查看详情</AuthButton>
                    <AuthButton elmType="a" key="2" onClick={() => { this.handleToManage(record) }}>保证金管理</AuthButton>
                </span>
            )
        }
    ];
    constructor(props) {
        super(props)
        this.state = {
            tableState:[]
        }
    }
    componentWillMount() {
    }

    render() {

        return (
            <div className={less.margin_detail_page}>
                <div className="mt10">
                    <div className={`${less.margin_detail_top} ${less.ptb24}`}>
                        <div className={`${less.title} ${less.flex}`}>
                            <div>
                                {/* 图片 */}
                            </div>
                            <div>
                               啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
                            </div>
                        </div>
                    </div>
                    <div className={`${less.margin_detail} ${less.ptb24} ${less.margin_detail_border}`}>
                        <div className={less.detail_relative}>
                            <p>竞价状态:</p>
                            <span>竞价中</span>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                竞价单号：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                销售单位：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                销售部门：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                竞价开始日期：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                竞价截止日期：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt10">
                    <div className={less.header}>
                            竞买人及报价信息
                    </div>
                    <div className={`${less.margin_detail} ${less.ptb24} ${less.margin_detail_border}`}>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                竞买人名称：
                            </div>
                            <div className={less.content}>
                                aaa
                                <span className={`${less.blue} ${less.ml24}`}>查看企业详细资质</span>
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                注册资本：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                企业类型：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                公司所在地：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                报价联系人：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                报价有效期：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                报价说明：
                            </div>
                            <div className={less.content}>
                                aaa
                            </div>
                        </div>
                        <div className={less.detail_item}>
                            <div className={less.label}>
                                报价附件：
                            </div>
                            <div className={less.content}>
                                <p>凭证名称 <span className={`${less.blue} ${less.ml16}`}>下载</span></p>
                                <p>凭证名称 <span className={`${less.blue} ${less.ml16}`}>下载</span></p>
                                <p>凭证名称 <span className={`${less.blue} ${less.ml16}`}>下载</span></p>
                                <p>凭证名称 <span className={`${less.blue} ${less.ml16}`}>下载</span></p>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt10">
                    <div className={less.header}>
                       <div>
                           标的物清单
                       </div>
                       <div>
                       <Button type="primary">导出报价</Button>
                       </div>
                    </div>
                    <BaseTable
                        scroll={{ x: 1400 }}
                        url=''
                        tableState={this.state.tableState}
                        resetTable={()=>{}}
                        baseParams={{}}
                        columns={this.columns} />
                    {/* <div className={less.quotation_totals}>
                        <div>
                            <div>

                            </div>
                            <div>

                            </div>
                        </div>

                    </div> */}
                </div>
                <div className={`${less.close_bar} mt10`}>
                    <Button>关闭</Button>
                </div>
            </div>
        )
    }
}
