import React from 'react';
import {
    Card,
    Row,
    Col,
    Icon,
} from 'antd';
import { configs } from '@/utils/config/systemConfig';
import less from './success.less';

export default class SceneJoinSuccess extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            num: location.href.split('num=')[1]
        }
    }

    componentDidMount() {
        this.props.toScrollTop()
    }

    //缴纳保证金
    toBond = () => {
        let uuids = this.props.match.params.uuids;
        if (this.state.num == 22) {
            // api.ajax('get', '@/reuse/sceneOffer/offerCheck', {
            //     sceneId: uuids
            // }).then(res => {
            //     this.props.history.push('/desk/bidHall/' + uuids)
            // })
            this.props.history.push('/desk/bidHall/' + uuids)
        } else {
            if (uuids) {
                this.props.history.push('/buy/sceneBond/' + uuids)
            }
        }

        // this.props.history.push('/buy/scene')
    }
    //继续参加其他竞价场次
    toSceneJoin = () => {
        window.open(configs.channelUrl + '/reuse/home', '_self')
    }
    //返回上一页
    back = () => {
        this.props.history.goBack()
    }

    render() {
        return (
            <Card className="mt10">
                <div className={less.joinsuccess}>
                    <div>
                        <p><Icon className={less.icon_success} type="check-circle" /></p>
                        <p className={less.success}>报名成功</p>
                    </div>
                    <div className={less.text}>
                        <p>接下来请选择一下操作，或<span className={less.back} onClick={this.back}>返回上一页</span></p>
                    </div>
                    <div className={less.btns}>
                        <p>
                            <button
                                className="reuse_btn reuse_btn_success"
                                type="button"
                                onClick={this.toBond}>{this.state.num == 22 ? '预报价' : '立即缴纳保证金'}</button>
                        </p>
                        <p>
                            <button
                                className="reuse_btn reuse_btn_success reuse_btn_ghost"
                                type="button"
                                onClick={this.toSceneJoin}>继续参加其他竞价场次</button>
                        </p>
                    </div>
                </div>
            </Card>
        )
    }
}



