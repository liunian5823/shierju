// import { Breadcrumb } from 'antd';
import React from 'react';
import less from './index.less'

class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          curLocation: ''
        };
    }
    componentWillMount() {
      this.getCurLocation()
    }
    getCurLocation () {
      let { location } = this.props
      if (location) {
        let path = location.path
        if (path.indexOf('/tw/goods') >= 0) {
          this.curLocation = '循环物资管理'
        } else if (path.indexOf('/tw/circle') >= 0) {
          this.curLocation = '物资周转管理'
        } else if (path.indexOf('/tw/rent') >= 0) {
          this.curLocation = '物资租赁管理'
        } else if (path.indexOf('/tw/logs') >= 0) {
          this.curLocation = '日志管理'
        }
      }
    }
    render () {
      return (
        <div className={less.breadcrumb}>
          <img src="./static/img/twbureau/map@2x.png" className={less.icon} />
          <span className={less.content}>当前位置：<span className={less.weight}>{this.curLocation}</span></span>
        </div>
      )
    }
}

export default Breadcrumb