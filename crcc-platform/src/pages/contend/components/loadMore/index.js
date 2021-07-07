import React, { Component } from 'react';
import { Table, message } from 'antd';
import less from './index.less';
class LoadMore extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      dataList: []
    }
  }
  componentWillReceiveProps (nextProps) {
    let total = (this.props.total ? this.props.total : 5);
    if (nextProps.dataSource !== this.state.dataList) {
      this.initData(nextProps.dataSource.slice(0, total));
    }
  }
  componentDidMount () {
    let total = (this.props.total ? this.props.total : 5);
    this.initData(this.props.dataSource.slice(0, total));
  }
  initData (dataList) {
    this.setState({
      dataList
    })
  }
  loadMore (total = 5) {
    if (this.props.dataSource.length <= total) {
      message.warning('没有更多数据了');
      return
    }
    this.setState({
      isOpen: !this.state.isOpen
    }, () => {
      if (this.state.isOpen) {
        this.setState({
          dataList: this.props.dataSource
        })
      } else {
        this.setState({
          dataList: this.props.dataSource.slice(0, total)
        })
      }
    })


  }
  render() {
    return (
      <div>
        <Table columns={this.props.columns} dataSource={this.state.dataList} pagination={false}></Table>
        <div className={less.load_more} onClick={() => {
          if (this.props.total) {
            this.loadMore(this.props.total)
          } else {
            this.loadMore()
          }
          
        }}>
          <span>展开全部</span>
          {
            this.state.isOpen ? <i className="iconfont icon-gaojisousuo-copy"></i> : <i className="iconfont icon-gaojisousuo"></i>
          }
        </div>
      </div>

    );
  }
}

export default LoadMore;