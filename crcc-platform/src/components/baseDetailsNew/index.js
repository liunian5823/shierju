import less from './index.less'

class details extends React.Component {

  renderDetails = (type) => {
    let colon = <span className={less.details_colon}>:</span>;
    if (type == "big_money") {
      return <div className={less.details_money}>
        <div className={less.details_title}>
          {this.props.title}
          <i style={{ display: 'inline-block', width: '100%', height: 0 }}></i>
          {this.props.title ? colon : ""}
        </div>
        <div className={less.details_content}>
          <span className={less.money}>{this.props.children}</span>
          <span>元</span>
        </div>
      </div>
    }
    return (
      <div className={[less.details_box, 'details'].join(' ')}>
        <div className={[less.details_title, 'title'].join(' ')}>
          {this.props.title}
          <i style={{ display: 'inline-block', width: '100%', height: 0 }}></i>
          {this.props.title ? colon : ""}
        </div>
        <div className={less.details_content}>
          {this.props.children || '-'}
        </div>
      </div>
    )
  }

  render() {
    return this.renderDetails(this.props.type)

  }
}

export default details