import React, { Component } from 'react';
import { Popover } from 'antd';
class CusPopover extends Component {
  render() {

    let content = this.props.content ? this.props.content : '';
    let contentS = ''
    let contentE = '';
    let newContent = ''
    if (content.length > (this.props.strLength ? this.props.strLength : 33)) {
      contentS = content.slice(0, (this.props.strLength ? this.props.strLength / 2 : 16));
      contentE = content.slice(content.length - (this.props.strLength ? this.props.strLength / 2 : this.props.strLength ? this.props.strLength / 2 : 16), content.length);
      newContent = contentS + '...' + contentE;
    }
    let contentP = (
      <p style={{ width: this.props.width ? this.props.width : '140' }}>{content}</p>
    )
    return (
      <div style={{display:'inline-block'}}>
        { content.length <= (this.props.strLength ? this.props.strLength : 33) ? contentP : <Popover content={contentP}>
          <p style={{ width: this.props.width ? this.props.width : '120',display:'inline-block' }}>{newContent}</p>
        </Popover>}

      </div>
    );
  }
}

export default CusPopover;