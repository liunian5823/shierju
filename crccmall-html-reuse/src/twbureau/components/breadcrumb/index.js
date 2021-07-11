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