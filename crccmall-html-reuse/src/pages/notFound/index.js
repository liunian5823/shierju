import { Card } from 'antd';

export default class NotFound extends React.Component {

    toHome = () => {
        this.props.history.push('/home');
    }

    render() {
        return (
            <Card bordered={false}>
                404
                <a href="javascript:void(0)" onClick={this.toHome}>点击返回首页</a>
            </Card>
        )
    }
}