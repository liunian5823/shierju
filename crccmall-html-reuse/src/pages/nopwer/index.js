import React from 'react'
import { Button } from 'antd'
import src from './nopower.png'
import { withRouter } from 'react-router-dom'
class NoPower extends React.Component {
    close() {
        this.props.history.push('/home')
    }
    render() {

        return (
            <div style={{ textAlign: 'center', paddingTop: '150px' }}>
                <div style={{ display: 'inline-block', position: 'relative' }}>
                    <img src={src} alt="" />
                    <Button onClick={this.close.bind(this)} type='primary' style={{
                        position: 'absolute', left: '320px',
                        bottom: '20px'
                    }}>返回首页</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(NoPower)