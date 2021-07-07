import React, { Component } from 'react';
import { Popover } from 'antd';
class CusPopover extends Component {
  render() {
    
    let content = this.props.content ? this.props.content : '';
    let contentS = ''
    let contentE = '';
    let newContent = ''
    if (content.length > 33) {
      contentS = content.slice(0, 16);
      contentE = content.slice(content.length - 16, content.length);
      newContent = contentS + '...' + contentE;
    } 
    let contentP = (
      <p style={{width: '140px'}}>{content}</p>
    )
    return (
      <div>
        { content.length < 30 ? contentP : <Popover content={contentP}>
          <p style={{width: '120px'}}>{newContent}</p>
        </Popover> }
        
      </div>
    );
  }
}

export default CusPopover;