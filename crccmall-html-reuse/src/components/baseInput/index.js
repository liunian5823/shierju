import { Input } from 'antd'
import less from './index.less'

class details extends React.Component {

  componentDidMount() {
    let length = this.refs.input.props.value ? this.refs.input.props.value.length : 0;
    let maxLength = this.refs.input.props.maxLength;
    if (maxLength) {
      this.refs.span.innerHTML = length + '/' + maxLength
    }
  }

  componentDidUpdate() {
    let length = this.refs.input.props.value ? this.refs.input.props.value.length : 0;
    let maxLength = this.refs.input.props.maxLength;
    if (maxLength) {
      this.refs.span.innerHTML = length + '/' + maxLength
    }
  }

  compositionstart(e) {
  }

  // 是否显示字数统计
  isShowTextLength = () => {
    if (this.props.addonAfter) {
      return false
    }
    if (this.props.disabled) {
      return false
    }
    return true
  }

  renderIcon = () => {
    return <i className="iconfont icon-gaojisousuo" />
    return null;
  }

  render() {
    let styleShowTextLength = this.isShowTextLength() ? 'block' : 'none';
    let icon = this.renderIcon();
    return (
      <div className={[less.base_group, icon,].join(' ')}>
        <Input {...this.props} ref='input' compositionstart={this.compositionstart} />

        <span style={{ display: styleShowTextLength }} className={less.length_tip} ref='span'></span>
      </div>
    )
  }
}

export default details