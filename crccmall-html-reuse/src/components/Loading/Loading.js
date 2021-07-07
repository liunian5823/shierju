import { Spin, Icon } from 'antd';
export default class Loading extends React.Component {
    render() {
        const icon = <Icon type="loading" />
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}><Spin tip={icon}/></div>
        )
    }
}