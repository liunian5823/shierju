import { Table, Icon } from 'antd';
import less from './index.less';
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

class ToggleTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }
    _columns = []
    _loading = false
    _pagination = false
    _max = 5

    componentWillMount() {
        this._columns = this.props.columns
    }

    componentDidMount() {
        document.querySelectorAll('th>span').forEach(ele => {
            ele.addEventListener('click', thClick)
        })
    }

    componentWillUnmount() {
        document.querySelectorAll('th>span').forEach(ele => {
            ele.removeEventListener('click', thClick)
        })
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }
    setData = (dataSource) => {
        let data = [];
        const max = this.props.max || this._max;
        if (this.state.isOpen) {
            data = dataSource || []
        } else {
            data = dataSource.filter((v, index) => {
                if (index < max) {
                    return v
                }
            })
        }
        return data;
    }
    getProps = (props) => {
        let params = {
            loading: typeof props.loading === 'boolean' ? props.loading : this._loading,
            columns: props.columns || [],
            pagination: typeof props.pagination === 'boolean' ? props.pagination : this._pagination,
            scroll: props.scroll,
        }
        return params
    }

    sortChange = (pagination, filters, sorter) => {
        let params = {
            'orderKey': sorter.field,
            order: sorter.order == 'descend' ? 'desc' : 'asc'
        }
        this.props.sortChange(params)
    }

    columns = () => {
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

    render() {
        let params = this.getProps(this.props);
        if (this.props.no_selection) {
            delete ComponentDefine.table_.rowSelection
        } else {
            ComponentDefine.table_.rowSelection = {}
        }
        let data = this.setData(this.props.dataSource || []);
        const max = this.props.max || this._max;

        return (
            <div className={less.toggleTable}>
                <Table {...ComponentDefine.table_} {...params} columns={this.columns()} dataSource={data} onChange={this.sortChange} />
                {
                    (this.props.dataSource && this.props.dataSource.length) > max
                        ? <div className={less.more} onClick={this.toggle}>
                            <span>
                                <span>展开全部</span>
                                <Icon className={this.state.isOpen ? less.open_icon : less.close_icon} type="double-right"></Icon>
                            </span>
                        </div>
                        : null
                }
            </div>
        )
    }
}

export default ToggleTable