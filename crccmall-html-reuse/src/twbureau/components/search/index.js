import React from 'react';
import { Button } from 'antd';
import less from './index.less'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className={less.search}>
        <div className={less.children}>
          {this.props.children}
        </div>
        <div className={less.btn_box}>
          <Button className={less.btn} type="primary">搜索</Button>
          <Button className={less.btn}>重置</Button>
        </div>
        <div className={less.super}>
          <span>高级搜索</span>
          <img src="./static/img/twbureau/search@2x.png" className={less.img}/>
        </div>
      </div>
    )
  }
}
export default Search