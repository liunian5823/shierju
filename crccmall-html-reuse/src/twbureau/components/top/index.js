import less from './index.less';

class Top extends React.Component {
  state = {}
  componentWillMount() {}
  render() {
    return (
      <div className={less.top}>
        <img src="./static/img/twbureau/logo@2x.png" className={less.logo}/>
        <div className={less.spread}></div>
        <div className={less.shop}>
          <div className={less.font}>铁建商城</div>
          <div className={less.web}>CRCCMALL.COM</div>
        </div>
        <div className={less.username}>momo.zxy</div>
        <img src="" className={less.photo}/>
        <img src="./static/img/twbureau/notice@2x.png" className={less.notice}/>
      </div>
    )
  }
}
export default Top