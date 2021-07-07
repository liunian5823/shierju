import { Affix } from 'antd'
class Aff extends React.Component {
  render() {
    return (
      <Affix offsetBottom={0} target={() => document.getElementById('main')}>
        <div className="affix_bottom">
          {/*  */}
          {this.props.children}
        </div>
      </Affix>
    )
  }
}

export default Aff