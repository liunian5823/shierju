import React from 'react';
import {
    Card,
    Row,
    Col,
    Icon,
} from 'antd';
import { getSearchByHistory } from '@/utils/urlUtils';

import less from './success.less';

export default class SceneJoinSuccess extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: null,
            mall: null
        }
    }
    componentDidMount() {
        this.props.toScrollTop();
        let params = getSearchByHistory(this.props.history.location.search);
        if (params.type) {
            this.setState({
                type: params.type,
                mall: params.mall || null
            })
        }
    }
    //继续发布
    toSceneAdd = () => {
        if (this.state.mall) {
            this.props.history.push('/desk/saleScene/add?type=mall')
        } else {
            this.props.history.push('/desk/saleScene/add')
        }
    }
    //返回列表
    toSaleScene = () => {
        this.props.history.push('/sale/scene')
    }

    render() {
        return (
            <Card className="mt10">
                <div className={less.success}>
                    <div>
                        <p><Icon className={less.icon_success} type="check-circle" /></p>
                        <p className={less.success_info}>
                            {
                                this.state.type == 'submit' ? '递交成功' : ''
                            }
                            {
                                this.state.type == 'save' ? '保存成功' : ''
                            }
                        </p>
                    </div>
                    <div className={less.text}>
                        {/* <p>接下来请选择一下操作，或<span className={less.back} onClick={this.back}>返回上一页</span></p> */}
                    </div>
                    {
                        this.state.type == 'submit' && <div>
                            <h3>本竞价单将递交审核员进行审核<br />审核通过后自动发布。</h3>
                        </div>
                    }
                    <div className={less.btns}>
                        <p>
                            <button
                                className="reuse_btn reuse_btn_success"
                                type="button"
                                onClick={this.toSceneAdd}>继续发布</button>
                        </p>
                        <p>
                            <button
                                className="reuse_btn reuse_btn_success reuse_btn_ghost"
                                type="button"
                                onClick={this.toSaleScene}>返回列表</button>
                        </p>
                    </div>
                </div>
            </Card>
        )
    }
}
