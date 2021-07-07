import less from './index.less';
class baseWrap extends React.Component {
  state = {
  }

  render() {
    return (
        <div className={[less.msg_wrap,
          this.props.companyType === 0 ? less.purchaser_wrap :
          this.props.companyType === 1 ? less.tworegister_wrap :
            ''].join(' ')}
              style={{display:
            this.props.companyType === 1 ||
            this.props.companyType === 0 ? 'block' : 'none' }}>
        <p>
          {this.props.companyType === 1 ? '供应商' : this.props.companyType === 0 ?'采购商':''}
        </p>
        <div>
          <span>
            {this.props.companyType === 1 ? '物资销售' : this.props.companyType === 0 ?'物资采购':''}
          </span>
        </div>
      </div>
    )
  }
}

export default baseWrap