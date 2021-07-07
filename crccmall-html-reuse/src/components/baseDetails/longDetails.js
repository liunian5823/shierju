import less from './index.less'

class details extends React.Component {
  render() {
    let colon = <span className={less.details_colon}>:</span>;
    return (
      <div className={[less.details_box, less.longs].join(' ')}>
        <div className={less.details_title}>
          {this.props.title}{this.props.title ? colon : ""}
        </div>
        <div className={less.details_content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default details