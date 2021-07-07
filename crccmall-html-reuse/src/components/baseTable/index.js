import { Table } from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util';
function thClick() {
    let sort = this.querySelector('.ant-table-column-sorter')
    if (sort) {
        let up = sort.querySelector('.ant-table-column-sorter-up')
        let down = sort.querySelector('.ant-table-column-sorter-down')
        if (up.classList.contains('on')) {
            down.click()
        } else {
            up.click()
        }
    }
}


class baseTable extends React.Component {
    _isMounted = false
    _methods = "GET"
    _loadTimes = 0
    _tableUrl = ""
    _columns = []
    _params = {
        pageSize: 10,
        page: 1
    }
    _sortPageStatus = false;//用于排序后的页面改变
    _uuids = 'uuids';//用来选中时选中的字段

    state = {
        _loading: false,
        // 表格数据
        dataSource: {},
        selectedRowKeys: [],
        selectedRows: [],
        pagination: '',
    }

    componentWillMount() {
        this._isMounted = true;
        //
        this._tableUrl = this.props.url;
        this._columns = this.props.columns
        if (this.props.methods) {
            this._methods = this.props.methods
        }
        if (this.props.baseParams) {
            this._params = {
                ...this.props.baseParams,
                ...this._params,
            }
        }
        if (!this.props.notInit) {
            this.initData();
        }
    }

    componentDidMount() {
        const baseParams = this.props.baseParams || {}
        if (this.props.tableState == 1 && !this.state.dataSource.list) {
            this._params = {
                ...this._params,
                ...baseParams,
            }
            this.setTableLoading();
            this.resetTable();
        }
        document.querySelectorAll('th>span').forEach(ele => {
            ele.addEventListener('click', thClick)
        })
    }

    componentWillUnmount() {
        document.querySelectorAll('th>span').forEach(ele => {
            ele.removeEventListener('click', thClick)
        })
    }

    componentWillReceiveProps(nextProps) {
        const baseParams = nextProps.baseParams || {}
        if (nextProps.methods) {
            this._methods = nextProps.methods
        }
        if (nextProps.tableState == 1) {
            this._params = {
                ...this._params,
                ...baseParams,
            }
            this.setTableLoading();
            this.resetTable();
        } else if (nextProps.tableState == 2) {
            this._params = {
                ...this._params,
                ...baseParams,
            }
            this.setTableLoading();
            this.tableSearch();
        } else if (nextProps.tableState == 3) {
            if (nextProps.haveSelection && nextProps.selectedList) {
                // let obj = this.setSelectRows(nextProps.selectedList);
                let uuids = this.props.rowKey || this._uuids;
                this.setState({
                    selectedRowKeys: nextProps.selectedList.map(v => v[uuids]),
                    selectedRows: nextProps.selectedList
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    initData = () => {
        this.tableSearch();
    }

    setTableLoading = () => {
        if (this.props.resetTable) {
            this.props.resetTable(0);
        }
    }

    tableSearch = () => {
        let _this = this;
        let _loadTimes = ++this._loadTimes;//加载次数
        if (this.state._loading) return false;//如果加载中退出

        this.setState({
            _loading: true
        })

        api.ajax(this._methods, this._tableUrl, {
            ...this._params,
        }).then(r => {
            if (!this._isMounted) {
                //如果没有被挂载 终止ajax
                return;
            }
            this.setState({
                _loading: false,
                dataSource: r.data,
                pagination: Util.pageination(r, this._params.page, (current) => {
                    _this._params.page = current;
                    if (_this._params[this.props.sort_key || 'orderKey']) {
                        _this._sortPageStatus = true;
                    }

                }, (current, pageSize) => {
                    _this._params.page = current;
                    _this._params.pageSize = pageSize;
                })
            })
        }).catch(r => {
            this.setState({
                _loading: true,
            })
        })
    }

    //重置页码
    resetTable() {
        this._params.page = 1;
        this.tableSearch();
    }

    //表格排序
    tableSort = (pagination, filters, sorter) => {
        if (sorter.field) {
            let pageNum = 1;
            if (this._sortPageStatus) {
                pageNum = pagination.current;
            }
            this._params = {
                ...this._params,
                page: pageNum,
                [this.props.sort_key || 'orderKey']: sorter.field,
                order: sorter.order == 'descend' ? 'desc' : 'asc'
            }
        } else {
            this._params = {
                ...this._params,
                page: pagination.current,
                [this.props.sort_key || 'orderKey']: '',
                order: ''
            }
        }
        this._sortPageStatus = false;
        this.tableSearch();
    }

    columns = () => {
        //当有haveSelection属性时,table展示复选框
        if (!this.props.haveSelection) {
            let indexkeyWidth = this.props.indexkeyWidth ? this.props.indexkeyWidth : 80;
            //TO_DO  这里可以选择是否启用序号
            let indexList = {
                title: '序号',
                key: 'indexkey',
                width: indexkeyWidth,
                render: (text, record, index) => (
                    <span>{index + ((this._params.page - 1) * this._params.pageSize) + 1}</span>
                ),
            }
            if (this.props.indexkey_fixed) {
                indexList.fixed = 'left'
            }
            if (this._columns[0].key != indexList.key) {
                this._columns.unshift(indexList);
            }
        }

        //TO_DO  这里增加表头项目动态渲染


        // TO_DO 处理超出...
        this._columns.map(item => {
            if (item.width && !item.render) {
                // 如果定宽且没有格式化结果
                let widthTextLength = parseInt((item.width - 16) / 14)

                item.render = (text, record, index) => {
                    text = text ? text : '-';
                    return (
                        <div
                            title={text}
                            style={{
                                width: (item.width - 14),
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                // whiteSpace: 'nowrap'
                            }}
                        >
                            {text}</div>
                    )
                }
            } else if (!item.render) {
                item.render = (text, record, index) => {
                    return text = text ? text : '--';
                }
            }
        })

        return this._columns;
    }

    setSelectRows = (selectedList) => {
        let uuids = this.props.rowKey || this._uuids;
        let { selectedRows } = this.state;
        let selectedKeys = selectedRows.map(v => v[uuids]);

        let list = [...selectedRows];
        selectedList.forEach((v, index) => {
            if (selectedKeys.indexOf(v[uuids]) == -1) {
                list.push(v)
            }
        })
        return {
            keys: list.map(v => v[uuids]),
            list: list
        };
    }
    getSelectRows = (arr) => {
        let uuids = this.props.rowKey || this._uuids;
        let rows = [], keys = [];
        arr.forEach(v => {
            rows = [...arr];
            keys = rows.map(v => v[uuids])
        })
        return { rows, keys };
    }

    setSelect = (record, selected, rows) => {
        let { selectedRows } = this.state;
        let uuids = this.props.rowKey || this._uuids;
        if (selectedRows) {
            let keys = selectedRows.map(v => v[uuids])
            if (selected) {
                rows.forEach(v => {
                    if (keys.indexOf(v[uuids]) == -1) {
                        selectedRows.push(v)
                    }
                })
            } else {
                if (keys.indexOf(record[uuids]) != -1) {
                    selectedRows.splice(keys.indexOf(record[uuids]), 1)
                }
            }
        }

        let obj = this.getSelectRows(selectedRows);
        const selectedRowKeys = obj.keys;
        this.props.setSelectedItems(obj, selectedRows);

        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }
    setSelectAll = (selected, rows, changeRows) => {
        let { selectedRows } = this.state;
        let uuids = this.props.rowKey || this._uuids;
        if (selectedRows) {
            if (selected) {
                let keys = selectedRows.map(v => v[uuids])
                changeRows.forEach(v => {
                    if (keys.indexOf(v[uuids]) == -1) {
                        selectedRows.push(v)
                    }
                })
            } else {
                let changeKeys = changeRows.map(v => v[uuids]);
                let list = [];
                selectedRows.forEach(v => {
                    if (changeKeys.indexOf(v[uuids]) == -1) {
                        list.push(v)
                    }
                })
                selectedRows = list;
            }
        }

        let obj = this.getSelectRows(selectedRows);
        const selectedRowKeys = obj.keys;
        this.props.setSelectedItems(obj, selectedRows);

        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }

    render() {
        let { selectedRowKeys, selectedRows, pagination } = this.state;

        let rowCheckSelection = null;
        if (this.props.haveSelection) {
            rowCheckSelection = {
                type: 'checkbox',
                selectedRowKeys,
                // onChange: (rowKeys, rows) => {
                //     selectedRows[pagination.current] = rows;
                //     let obj = this.getSelectRows(selectedRows);
                //     selectedRowKeys = obj.keys;
                //     this.props.setSelectedItems(obj, selectedRows, pagination.current);

                //     this.setState({
                //         selectedRowKeys,
                //         selectedRows
                //     })
                // },
                onSelect: (record, selected, rows) => {
                    this.setSelect(record, selected, rows)
                },
                onSelectAll: (selected, rows, changeRows) => {
                    this.setSelectAll(selected, rows, changeRows)
                }
            }
        }

        const params = {};
        if (this.props.rowKey) {
            params.rowKey = this.props.rowKey
        }
        return (
            <div>
                <Table
                    {...params}
                    {...ComponentDefine.table_}
                    loading={this.state._loading}
                    pagination={this.state.pagination}
                    dataSource={this.state.dataSource[this.props.res_key || 'list']}
                    rowSelection={rowCheckSelection}
                    columns={this.columns()}
                    onChange={this.tableSort}
                    scroll={this.props.scroll}
                />
            </div>
        )
    }
}

export default baseTable
