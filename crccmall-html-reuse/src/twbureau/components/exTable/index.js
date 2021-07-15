import './index.css';
import React from 'react';
import { Checkbox, Pagination, Icon } from 'antd';

export default class ExTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultRowSpan: 2
        };
    }
    componentWillMount() {
        if (this.hadThChild()) {
            this.setState({ defaultRowSpan: 2 });
        }
    }
    hadThChild() {//检查是否有表头分组
        let { columns } = this.props, flag = false;
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].children && columns[i].children.length > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    renderChild(col, colIndex, record, index, trKey) {//渲染表格数据每格
        let child = col.render
            ? col.render(record[col.dataIndex], record, index)
            : record[col.dataIndex];
        return <td key={trKey + colIndex}>{child}</td>;
    }
    isChecked(value) {//表格勾选
        let { selectedRowKeys } = this.props.rowSelection, flag = false;
        for (let i = 0; i < selectedRowKeys.length; i++) {
            if (selectedRowKeys[i] === value) {
                flag = true;
            }
        }
        return flag;
    }
    render() {
        let { columns, dataSource, rowKey, pagination, onRow, rowSelection } = this.props, { defaultRowSpan } = this.state;
        return <div className="exTable">
            <div className="ant-table ant-table-bordered">
                <div className="ant-table-body">
                    <table>
                        <thead className="ant-table-thead">
                            <tr>
                                {rowSelection && <th rowSpan={defaultRowSpan} style={{ width: 60 }} />}
                                {columns.map((parent) =>
                                    <th colSpan={parent.children && parent.children.length > 0 ? parent.children.length : 1}
                                        rowSpan={parent.children && parent.children.length > 0 ? 1 : defaultRowSpan}
                                        key={parent.dataIndex} style={{ width: parent.width }} >
                                        {parent.title}
                                    </th>
                                )}
                            </tr>
                            {defaultRowSpan === 2 && <tr>
                                {columns.map((parent) => {
                                    if (parent.children && parent.children.length > 0) {
                                        return parent.children.map((child) =>
                                            <th key={child.dataIndex} style={{ width: child.width }}>{child.title}</th>);
                                    }
                                })}
                            </tr>}
                        </thead>
                        {dataSource.length > 0 &&
                            <tbody className="ant-table-tbody">
                                {dataSource.map((item, index) => {
                                    let trKey = rowKey ? rowKey(item) : index;
                                    return (
                                        <tr key={trKey} className="ant-table-row" onClick={() => onRow && onRow(trKey, item)}>
                                            {rowSelection && <td>
                                                <Checkbox checked={this.isChecked(trKey)} key={`checkbox${trKey}`}
                                                    onChange={(e) => {
                                                        if (rowSelection.type === 'checkbox') {//多选
                                                            let keys = Object.assign([], rowSelection.selectedRowKeys);
                                                            console.log('check', e.target.checked)
                                                            if (e.target.checked) {
                                                                keys.push(trKey);
                                                            } else {
                                                                keys.pop();
                                                            }
                                                            rowSelection.onChange(keys);
                                                        } else {//单选
                                                            rowSelection.onChange(new Array(trKey));
                                                        }
                                                    }}
                                                />
                                            </td>}
                                            {columns.map((col, colIndex) => {
                                                if (col.children && col.children.length > 0) {
                                                    return col.children.map(
                                                        (colChild, colChildIndex) => this.renderChild(colChild, colChildIndex, item, index, trKey)
                                                    );
                                                } else {
                                                    return this.renderChild(col, colIndex, item, index, trKey);
                                                }
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>}
                    </table>
                    {dataSource.length === 0 &&
                        <div className="txt-c" style={{ borderBottom: '1px solid #e9e9e9', height: '100px', lineHeight: '100px', fontSize: '12px', color: '#999' }}>
                            <Icon type="frown" />
                            <sapn style={{ paddingLeft: '4px' }}>暂无数据</sapn>
                        </div>
                    }
                </div>
            </div>
            {dataSource.length > 0 && pagination && <div className="exTable-footer">
                <Pagination {...pagination} size="small" />
            </div>}
            <p className="clear" />
        </div>
    }
}