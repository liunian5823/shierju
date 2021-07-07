import React, { Component } from 'react';
import { Card, Table } from 'antd';
import less from './index.less'


class BidTable extends Component {

  render() {
    const { extraS, extraBtn, title, children } = this.props
    
    const applicationDetailsExtra = (
      <div className={ less.app_extra }>
        <div className='app_extra_info'>
          {extraS }
        </div>
        <div className={ less.app_extra_btn }>
          {extraBtn }
        </div>
      </div>
    )
    return (
      <div className={ less.app_table_container + ' ' + (this.props.className || '') } style={this.props.style}>
        <Card title={title ? title : ''} extra={ (extraS || extraBtn) && applicationDetailsExtra}>
          {children }
        </Card>
      </div>
    );
  }
}

export default BidTable;