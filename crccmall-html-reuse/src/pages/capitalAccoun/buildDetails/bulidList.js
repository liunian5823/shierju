import { Form, Input, Select, Button, DatePicker, Row, Col, Icon, Card, Cascader, Radio } from 'antd';

import less from './index.less'
import React from "react";


export default class BuildList extends React.Component {
    constructor(props){
        super(props)
        console.log(props)
    }
    state = {
        isFilterMore: 1,//0收起 1展开,
        validateStatus:'',
        help:'',

    }

    componentWillMount() {
        if(this.props.listLength>5){
            this.setState({
                isFilterMore: 0
            })
        }
    }
    getFileList=(data)=>{
        var fileList=[];
        data.forEach(v=>{
            fileList.push(<a href={'javascript:;'} className={less.textcolor}>{v.value}</a>)
        })
        return fileList;
    }
    initBuildList = () => {
        const buildList = this.props.buildList;
        const buildItemList = [];

        if (buildList && buildList.length > 0) {
                buildList.forEach((item, i) => {
                        const list= <Card className="mb20"  style={{backgroundColor:"#FAFEFF",borderColor:"#B0E9FF"}}>
                            <Row className="reuse_row">
                                <Col span={14} className="reuse_value">
                                     <Row className="reuse_row">
                                         <Col className="reuse_label" span={4}>提货单编号</Col>
                                         <Col className="reuse_value" span={18}>{item.buildNum}</Col>
                                     </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={4}>登记人</Col>
                                            <Col className="reuse_value" span={18}>{item.djMain}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={4}>登记时间</Col>
                                            <Col className="reuse_value" span={18}>{item.time}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={4}>提货人</Col>
                                            <Col className="reuse_value" span={18}>{item.thr}</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={4}>附件</Col>
                                            <Col className="reuse_value" span={18}>
                                                {this.getFileList(item.file)}
                                            </Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={4}>备注信息</Col>
                                            <Col className="reuse_value" span={18}>{item.mack}</Col>
                                        </Row>
                                </Col>
                                <Col className="reuse_value" span={9}>
                                    <div className={less.borderbottom}>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span="12">提货数量/净重合计</Col>
                                            <Col className={less.colorbottred} span="10" style={{fontSize:"16px",color:"#FA6400"}}>9999.00吨</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span="12" style={{fontSize:"16px"}}>（扣量 0.5%）扣量合计</Col>
                                            <Col className={less.colorbottred} span="10">-12吨</Col>
                                        </Row>
                                    </div>
                                    <Row className='reuse_row'>
                                        <Col className={less.fonts20} span="8">结算重量:</Col>
                                        <Col className={less.fontsred20} span="12">9999.00吨</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                        buildItemList.push(list)
                }
            );
        }
        return buildItemList;
    }


    handelReset = (type) => {
        if (type == 2) {
            this.props.form.resetFields();
            this.handleSubmit()
        } else {
            this.setState({
                isFilterMore: type
            })
        }

    }
    isShow = () => {
        if(this.props.listLength>5){
            if (this.state.isFilterMore === 0) {
                return <div type="primary" className="showBtn" onClick={() => {
                    this.handelReset(1)
                }}>展开
                    <Icon type="double-right" style={{ marginLeft: '4px', transform: 'rotateZ(90deg)' }}></Icon>
                </div>

            } else if (this.state.isFilterMore === 1) {
                return <div type="primary" className="showBtn" onClick={() => {
                    this.handelReset(0)
                }}>收起
                    <Icon type="double-right" style={{ marginLeft: '4px', transform: 'rotateZ(-90deg)' }}></Icon>
                </div>
            } else {
                return null
            }
        }
    }

    render() {
        const isFilterMore = this.state.isFilterMore;

        return (
            <div  className={less.mb100}>
                <Row className="baseForm-row" >
                    <Col span={isFilterMore ? 24 : 24} key={1} style={{  height: isFilterMore ? '' : '1500px' ,overflow:"hidden"}}>
                        <Card bordered={false} title="提货单信息">
                            {this.initBuildList()}
                        </Card>
                    </Col>
                </Row>
                {this.isShow()}
            </div>
        )
    }
}

