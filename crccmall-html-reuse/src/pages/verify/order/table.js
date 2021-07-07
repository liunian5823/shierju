import React from 'react';
import { Spin, Row, Col, Icon, Checkbox, Pagination} from 'antd';

import AuthButton from '@/components/authButton';
import api from '@/framework/axios';
import Util from '@/utils/util';
import { configs } from '@/utils/config/systemConfig';
import less from './table.less';

export default class OrderTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: true,
            dataList: [],//数据列表
            selectKeys: [],//选中的数据
            sortData: {
                key: null,
                sort: null,
            },//排序
            filterData: {
                key: null
            },//过滤

            //分页数据
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                pageSizeOptions: ['10', '20', '50', '100', '1000']
            },
        }
    }
    _config = {
        ascending: 'asc',//升序
        descending: 'desc',//降序
        checkKey: 'code',//选中时的取值
        labelKey: 'key',//排序-过滤
        valueKey: 'value',//排序-过滤
        showTrNum: 4,//商品显示条数
    }
    _pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ['10', '20', '50', '100', '1000']
    }

    //全选
    get checkAll() {
        /**
         * 1.判断allKeys是否所有的key都存在于selectKeys中
         */
        const { checkKey = this._config.checkKey } = this.props;
        const { selectKeys, dataList } = this.state;
        const allKeys = dataList.map(v => v[checkKey]);
        let notIn = false;
        for (let i = 0; i < allKeys.length; i++) {
            notIn = selectKeys.indexOf(allKeys[i]) == -1;
            if (notIn) break;
        }

        return selectKeys.length && allKeys.length && !notIn
    }
    //全选set
    checkAllChange = (el) => {
        let { selectKeys, dataList } = this.state;
        const { checkKey = this._config.checkKey } = this.props;

        let boo = el.target.checked;
        selectKeys = boo ? dataList.map(v => v[checkKey]) : [];

        this.setState({
            selectKeys
        })
    }
    //排序
    handleSort = (sort, item) => {
        const { labelKey = this._config.labelKey } = this.props;
        let { sortData } = this.state;
        if (sortData.key == item[labelKey] && sortData.sort == sort) {
            sortData.key = null;
            sortData.sort = null;
        } else {
            sortData.key = item[labelKey];
            sortData.sort = sort;
        }

        this.setState({
            sortData
        }, () => {
            this.reset()
        })
    }
    //过滤
    handleFilter = (item) => {
        const { labelKey = this._config.labelKey } = this.props;
        let { filterData } = this.state;
        if (item[labelKey] == filterData.key) {
            filterData.key = null;
        } else {
            filterData.key = item[labelKey];
        }

        this.setState({
            filterData
        }, () => {
            this.reset()
        })
    }
    //显示隐藏切换
    toggleOrderTable = (index) => {
        const { dataList } = this.state;
        if (dataList[index]._show_trNum_ == 0) {
            dataList[index]._show_trNum_ = this._config.showTrNum
        } else {
            dataList[index]._show_trNum_ = 0
        }
        this.setState({
            dataList
        })
    }

    //头部
    createHeader = () => {
        const { sortData, filterData } = this.state;
        const {
            columns = this.props.sortColumns,
            labelKey = this._config.labelKey,
            valueKey = this._config.valueKey,
        } = this.props;
        const { ascending, descending } = this._config;

        return (
            columns.map((item, index) => {
                return (
                    <div className={less.sortItem}>
                        <span>{item[valueKey]}</span>
                        {
                            item.sort
                                ? <span className={less.sorter}>
                                    <span
                                        className={[
                                            less.sorter_icon,
                                            (sortData.key == item[labelKey] && sortData.sort == ascending) ? less.is_sort : ''
                                        ].join(' ')}
                                        onClick={() => { this.handleSort(ascending, item) }}>
                                        <Icon type="caret-up" />
                                    </span>
                                    <span
                                        className={[
                                            less.sorter_icon,
                                            (sortData.key == item[labelKey] && sortData.sort == descending) ? less.is_sort : ''
                                        ].join(' ')}
                                        onClick={() => { this.handleSort(descending, item) }}>
                                        <Icon type="caret-down" />
                                    </span>
                                </span>
                                : null
                        }
                        {
                            item.filter
                                ? <span
                                    className={[
                                        less.filter,
                                        filterData.key == item[labelKey] ? less.is_filter : ''
                                    ].join(' ')}
                                    onClick={() => { this.handleFilter(item) }}>
                                    <Icon type="filter" />
                                </span>
                                : null
                        }
                    </div>
                )
            })
        )
    }
    //总价
    get amtTotal() {
        const { dataList } = this.state;
        let total = 0;

        if (dataList.length) {
            dataList.forEach(v => {
                total += +v.amt
            })
        }
        return numeral(total).format('0,0.00')
    }
    //已选总价
    get selectAmtTotal() {
        const { labelKey = this._config.checkKey } = this.props;
        const { selectKeys, dataList } = this.state;
        let total = 0;

        if (selectKeys.length && dataList.length) {
            dataList.forEach(v => {
                if (selectKeys.indexOf(v[labelKey]) != -1) {
                    total += +v.amt
                }
            })
        }
        return numeral(total).format('0,0.00')
    }
    //tr选中
    checkItemChange = (el, tr) => {
        let { selectKeys } = this.state;
        const { checkKey = this._config.checkKey } = this.props;
        const boo = el.target.checked;
        if (boo && selectKeys.indexOf(tr[checkKey]) == -1) {
            selectKeys.push(tr[checkKey])
        } else if (!boo && selectKeys.indexOf(tr[checkKey]) != -1) {
            selectKeys.splice(selectKeys.indexOf(tr[checkKey]), 1)
        }

        this.setState({
            selectKeys
        })

    }

    createTbody = (item) => {
        const list = item.goodsList || [];
        const trNum = item._show_trNum_;
        const { bodyColumns = [] } = this.props;

        return (
            <table>
                <thead>
                    <tr>
                        {
                            bodyColumns.map((th, index) => {
                                let props = {}
                                if (th.width) {
                                    props.width = typeof th.width == 'number' ? th.width + 'px' : th.width;
                                }
                                return <th key={th.key || index} {...props}>{th.title}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map((tr, tri) => {
                            if (trNum && tri + 1 > trNum) {
                                return null;
                            }
                            let trNode = (
                                <tr key={tri}>
                                    {
                                        bodyColumns.map((td, tdi) => {
                                            let style = td.style || {};
                                            if (td.render && typeof td.render == 'function') {
                                                let children = td.render(tr[td.dataIndex], tr, tri, list, item);
                                                let { rowSpan } = children.props;
                                                if (children.children) {
                                                    children = children.children
                                                }
                                                let node = <td style={style} key={td.key || tdi}>{children}</td>;
                                                if (rowSpan) {
                                                    node = <td style={style} rowSpan={rowSpan} key={td.key || tdi}>{children}</td>;
                                                } else if (rowSpan == 0) {
                                                    node = null;
                                                }
                                                return node
                                            } else {
                                                return <td style={style} key={td.key || tdi}>{tr[td.dataIndex] || '-'}</td>
                                            }
                                        })
                                    }
                                </tr>
                            )
                            return trNode
                        })
                    }
                </tbody>
            </table>
        )
    }

    createBody = () => {
        const { dataList, selectKeys } = this.state;
        const { checkKey = this._config.checkKey } = this.props;

        return (
            dataList.map((item, index) => {
                return (
                    <div className={less.row} key={index}>
                        <Row className={less.row_head}>
                            <Col span={1}>
                                <Checkbox
                                    checked={(selectKeys.indexOf(item[checkKey]) != -1)}
                                    onChange={(boo) => { this.checkItemChange(boo, item) }}></Checkbox>
                            </Col>
                            <Col span={6} className={less.head_item}>
                                <span>订单号: </span>
                                <span>{item.code}</span>
                            </Col>
                            <Col span={10} className={less.head_item}>
                                <span>{item.confirmUserName}</span>
                                <span> - {item.sourceStr}</span>
                                <span> - {item.businessCode}</span>
                            </Col>
                            <Col span={7} className={less.head_item}>
                                <span>销售单位: </span>
                                <span title={item.saleCompanyName}>{item.saleCompanyName}</span>
                            </Col>
                        </Row>
                        <Row className={less.row_body}>
                            <div className={less.row_body_content} id={`orderTable_${index}`}>
                                {this.createTbody(item, item)}
                                {
                                    (!item.goodsList || !item.goodsList.length)
                                        ? <div className={less.not_tatalist}>亲 暂无数据哦~</div>
                                        : null
                                }
                            </div>
                            {
                                (item.goodsList && item.goodsList.length > this._config.showTrNum)
                                    ? <div className={less.open} onClick={() => { this.toggleOrderTable(index) }}>
                                        <span>查看全部{(item.goodsList && item.goodsList.length || 0)}款商品</span>
                                        <span className="reuse_link">
                                            展开
                                        <Icon className={[
                                                less.open_icon,
                                                item._show_trNum_ == 0 ? less.open_icon_up : ''
                                            ].join(' ')} type="double-right" />
                                        </span>
                                    </div>
                                    : null
                            }
                        </Row>
                    </div>
                )
            })
        )
    }

    //翻页
    pageChange = (page) => {
        const { pagination } = this.state;
        pagination.current = page;

        this.setState({
            pagination
        }, () => {
            this.getDataList()
        })
    }
    //每页条数改变
    pageSizeChange = (page, pageSize) => {
        const { pagination } = this.state;
        pagination.current = page;
        pagination.pageSize = pageSize;

        this.setState({
            pagination
        }, () => {
            this.getDataList()
        })
    }

    componentWillMount() {
        this.handleInit()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tableState == 1) {
            this.reset(nextProps.baseParams)
        } else if (nextProps.tableState == 2) {
            this.getDataList(nextProps.baseParams)
        }
    }

    //初始
    handleInit = () => {
        this.getDataList()
    }
    //重置
    reset = (obj) => {
        this.setState({
            pagination: this._pagination,
            selectKeys: [],
        }, () => {
            this.getDataList(obj)
        })
    }

    //获取列表数据
    getDataList = (obj) => {
        let { pagination } = this.state;
        if (this.props.url) {
            this.setState({
                spinning: true,
            })
            let baseParams = obj || this.props.baseParams || {};
            let params = {
                page: pagination.current,
                pageSize: pagination.pageSize,
                ...baseParams
            }
            const { sortData, filterData } = this.state;
            if (sortData.key) {
                params.orderKey = sortData.key;
                params.order = sortData.sort;
            }
            if (filterData.key) {
                params.queryState = filterData.key
            }
            api.ajax('GET', this.props.url, params)
                .then(res => {
                    if (res.data) {
                        pagination.total = res.data.total || 0;

                        this.setState({
                            spinning: false,
                            pagination,
                            dataList: (res.data.list || []).map(v => {
                                v._show_trNum_ = this._config.showTrNum;
                                return v
                            })
                        })
                    } else {
                        pagination.total = 0;
                        this.setState({
                            spinning: false,
                            pagination,
                            dataList: []
                        })
                    }
                }, error => {
                    Util.alert(error.msg, { type: 'error' })
                })
        }
    }

    //导出
    exportList = () => {
        if (!this.props.exportUrl) return;

        window.open(configs.exportUrl + this.props.exportUrl)
    }

    render() {
        const { pagination } = this.state;

        return (
            <Spin spinning={this.state.spinning}>
                <div className={less.orderTable}>
                    <div className={less.head} style={{ fontSize: '14px !important' }}>
                        <Row className={less.headTitle}>
                            <Col span={2}>
                                <Checkbox style={{ fontSize: '14px !important' }} checked={this.checkAll} onChange={this.checkAllChange}>全选</Checkbox>
                            </Col>
                            <Col span={20}>
                                <span>待审核总计：</span>
                                <span className="ml10 color_e font14">￥{this.amtTotal}</span>
                                <span className="ml20">当前已选：</span>
                                <span className="ml10 color_e font14">￥{this.selectAmtTotal}</span>
                            </Col>
                            <Col span={2}>
                                <div className="reuse_baseButtonGroup text_r">
                                    <AuthButton elmType="a" onClick={this.props.exportList}>导出</AuthButton>
                                    {/* <span className="reuse_link" onClick={this.exportList}>导出</span> */}
                                </div>
                            </Col>
                        </Row>
                        <Row className={less.headSort}>
                            {this.createHeader()}
                        </Row>
                    </div>

                    <div className={less.body}>
                        {this.createBody()}
                    </div>

                    <div className={less.footer}>
                        <div className={less.pagination}>
                            <Pagination
                                {...pagination}
                                showSizeChanger
                                showQuickJumper
                                showTotal={(total) => `共 ${total} 条`}
                                onChange={this.pageChange}
                                onShowSizeChange={this.pageSizeChange} />
                        </div>
                    </div>
                </div>
            </Spin>
        )
    }
}