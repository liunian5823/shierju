import { Table, Alert } from 'antd';
import api from '@/framework/axios'; //请求接口的封装
import Util from '@/utils/util';
class BaseTableAllItems extends React.Component {
  _isMounted = false;
  _methods = 'GET';
  _loadTimes = 0;
  _tableUrl = '';
  _columns = [];
  _params = {
    rows: 10,
    page: 1,
  };
  _sortPageStatus = false; //用于排序后的页面改变
  state = {
    _loading: false,
    // 表格数据
    total: 0, //总条数
    dataSource: {},
    selectedRowKeys: [],
    pagination: '',
  };

  componentWillMount() {
    this._isMounted = true;
    //
    this._tableUrl = this.props.url;
    this._columns = this.props.columns;
    let pagination = this.props.pagination;
    if (this.props.methods) {
      this._methods = this.props.methods;
    }
    if (this.props.baseParams) {
      this._params = {
        ...this.props.baseParams,
        ...this._params,
      };
    }
    if (!this.props.notInit) {
      this.initData();
    }
  }

  componentDidMount() {
    const baseParams = this.props.baseParams || {};
    if (this.props.tableState == 1 && !this.state.dataSource.rows) {
      this._params = {
        ...this._params,
        ...baseParams,
      };
      this.setTableLoading();
      this.resetTable();
    }
  }

  componentWillReceiveProps(nextProps) {
    const baseParams = nextProps.baseParams || {};
    if (nextProps.methods) {
      this._methods = nextProps.methods;
    }
    if (nextProps.tableState == 1) {
      this._params = {
        ...this._params,
        ...baseParams,
      };
      this.setTableLoading();
      this.resetTable();
    } else if (nextProps.tableState == 2) {
      this._params = {
        ...this._params,
        ...baseParams,
      };
      this.setTableLoading();
      this.tableSearch();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initData = () => {
    this.tableSearch();
  };

  setTableLoading = () => {
    this.props.resetTable(0);
  };

  tableSearch = () => {
    let _this = this;
    let _loadTimes = ++this._loadTimes; //加载次数
    if (this.state._loading) return false; //如果加载中退出
    this.setState({
      _loading: true,
      selectedRowKeys: [],
    });
    api
      .ajax(this._methods, this._tableUrl, {
        ...this._params,
      })
      .then((r) => {
        if (!this._isMounted) {
          //如果没有被挂载 终止ajax
          return;
        }
  
        this.props.resetData ? this.props.resetData(r.data.rows) : '';
        this.setState({
          _loading: false,
          dataSource: r.data,
          total: r.data.total,
          pagination: Util.pageination1(
            r,
            this._params.page,
            (current) => {
              _this._params.page = current;
              if (_this._params.querysort) {
                _this._sortPageStatus = true;
              }
            },
            (current, rows) => {
              _this._params.page = current;
              _this._params.rows = rows;
            },
          ),
        });
      })
      .catch((r) => {
        this.setState({
          _loading: false,
        });
      });
  };

  //重置页码
  resetTable() {
    this._params.page = 1;
    this.tableSearch();
  }

  //表格排序
  tableSort = (pagination, filters, sorter) => {
    this.props.resetSelected()
    for(var key in filters){
      this._params[key] = filters[key] ? filters[key].join(','):null;
    }
    if (sorter.field) {
      let pageNum = 1;
      if (this._sortPageStatus) {
        pageNum = pagination.current;
      }
      this._params = {
        ...this._params,
        page: pageNum,
        querysort: sorter.field,
        order: sorter.order == 'descend' ? 'desc' : 'asc',
      };
    } else {
      this._params = {
        ...this._params,
        page: pagination.current,
        querysort: '',
        order: '',
      };
    }
    this._sortPageStatus = false;
    this.tableSearch();
  };

  columns = () => {
    let indexkeyWidth = this.props.indexkeyWidth
      ? this.props.indexkeyWidth
      : 80;
    //TO_DO  这里可以选择是否启用序号
    let indexList = {
      title: '序号',
      key: 'indexkey',
      width: indexkeyWidth,
      render: (text, record, index) => (
        <span>{index + (this._params.page - 1) * this._params.rows + 1}</span>
      ),
    };
    if (this._columns[0].key != indexList.key) {
      this._columns.unshift(indexList);
    }
    //TO_DO  这里增加表头项目动态渲染

    // TO_DO 处理超出...
    this._columns.map((item) => {
      if (item.width && !item.render) {
        // 如果定宽且没有格式化结果
        let widthTextLength = parseInt((item.width - 16) / 14);

        item.render = (text, record, index) => {
          text = text ? text : '-';
          return (
            <div
              title={text}
              style={{
                width: item.width - 14,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </div>
          );
        };
      } else if (!item.render) {
        item.render = (text, record, index) => {
          return (text = text ? text : '-');
        };
      }
    });

    return this._columns;
  };

  renderAlert = () => {
    if (this.props.alertContent) {
      return (
        <Alert
          message={this.props.alertContent + ' : ' + this.state.total}
          type="info"
          showIcon
        />
      );
    }
    return null;
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { pagination } = this.state;
    let rowCheckSelection = null;
    if (this.props.selection) {
      rowCheckSelection = {
        type: 'checkbox',
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {// 跟baseTable 仅修改了 返回所有选中的选项selectedRows
          this.setState({
            selectedRowKeys,
          });
          //TO_DO  这里可以增加将选择项暴露给父组件
          console.log(selectedRowKeys);
          this.props.setSelectedItems(this, selectedRows);
        },
      };
    }
    if (this.props.haveSelection) {
      rowCheckSelection = {
        type: 'checkbox',
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.props.setSelectedItems(selectedRows);
          this.setState({
            selectedRowKeys,
          });
          //TO_DO  这里可以增加将选择项暴露给父组件
          console.log(selectedRowKeys);
        },
      };
    }
    return (
      <div>
        {this.renderAlert()}
        <Table
          //{...ComponentDefine.table_}
          loading={this.state._loading}
          pagination={this.props.pagination == false ? false : pagination}
          dataSource={
            this.state.dataSource.rows == undefined
              ? this.state.dataSource.list
              : this.state.dataSource.rows
          }
          rowSelection={rowCheckSelection}
          columns={this.columns()}
          onChange={this.tableSort}
          scroll={this.props.scroll}
        />
      </div>
    );
  }
}

export default BaseTableAllItems;
