import { Table } from 'antd';
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util';


class baseTable extends React.Component {

  _isMounted = false
  _methods = "GET"
  _loadTimes = 0
  _tableUrl = ""
  _columns = []
  _params = {
    rows: 10,
    page: 1
  }
  _sortPageStatus = false;//用于排序后的页面改变

  state = {
    _loading: false,
    // 表格数据
    dataSource: {},
    selectedRowKeys: [],
    pagination: ''
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
    if (this.props.tableState == 1 && !this.state.dataSource.rows) {
      this._params = {
        ...this._params,
        ...baseParams,
      }
      this.setTableLoading();
      this.resetTable();
    }
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
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initData = () => {
    this.tableSearch();
  }

  setTableLoading = () => {
    this.props.resetTable(0);
  }

  tableSearch = () => {
    let _this = this;
    let _loadTimes = ++this._loadTimes;//加载次数
    if (this.state._loading) return false;//如果加载中退出
    this.setState({
      _loading: true,
      selectedRowKeys: [],
    })

    api.ajax(this._methods, this._tableUrl, {
      ...this._params,
    }).then(r => {
      if (!this._isMounted) {
        //如果没有被挂载 终止ajax
        return;
      }
      //当有haveSelection属性时,对父组件的数据进行同步
      if (this.props.haveSelection) {
        this.props.syncIndexCompent();
      }
      this.setState({
        _loading: false,
        dataSource: r.data,
        pagination: Util.pageination(r, this._params.page, (current) => {
          _this._params.page = current;
          if(_this._params.querysort){
            _this._sortPageStatus = true;
          }

        }, (current, rows) => {
          _this._params.page = current;
          _this._params.rows = rows;
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
      if(this._sortPageStatus){
        pageNum = pagination.current;
      }
      this._params = {
        ...this._params,
        page: pageNum,
        querysort: sorter.field,
        order: sorter.order == 'descend' ? 'desc' : 'asc'
      }
    } else {
      this._params = {
        ...this._params,
        page: pagination.current,
        querysort: '',
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
            <span>{index + ((this._params.page - 1) * this._params.rows) + 1}</span>
        ),
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

          // if (!text) {
          //   return null
          // }
          // text = '' + text;
          // if (text.length < widthTextLength) {
          //   return <span key={index}>{text}</span>
          // } else {
          //   return (
          //     <span key={index}>
          //       <span key="1" title={text}>
          //         {text.substring(0, (widthTextLength - 2))}...
          //       </span>
          //     </span>
          //   )
          // }
        }
      } else if (!item.render) {
        item.render = (text, record, index) => {
          return text = text ? text : '-';
        }
      }
    })

    return this._columns;
  }



  render() {

    const { selectedRowKeys } = this.state;
    let rowCheckSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys
        })
        //TO_DO  这里可以增加将选择项暴露给父组件
      }
    }

    if (this.props.noSelection) {
      rowCheckSelection = null
    }
    //TO_DO 统一去掉
    rowCheckSelection = null

    //当有haveSelection属性时,table展示复选框
    if (this.props.haveSelection) {
      rowCheckSelection = {
        type: 'checkbox',
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.props.setSelectedItems(selectedRows);
          this.setState({
            selectedRowKeys
          })
          //TO_DO  这里可以增加将选择项暴露给父组件
        }
      }
    }

    return (
      <div>
        <Table
          {...ComponentDefine.table_}
          loading={this.state._loading}
          pagination={this.state.pagination}
          dataSource={this.state.dataSource.rows}
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