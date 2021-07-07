import { Card } from 'antd';
export default class Home extends React.Component {

  render() {
    return (
      <Card bordered={false}>
        <h3 style={{ padding: '160px', textAlign: 'center', fontSize: 18 }}>
          商城平台管理系统
        </h3>
      </Card>
    )
  }
}