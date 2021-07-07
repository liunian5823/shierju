import {Select,Card, Form,Row,Table, Col,Input,Button,Icon,Radio,Divider,Steps,Timeline,Spin } from 'antd';

import BaseDetails from "@/components/baseDetails";;
import moment from "moment/moment";
import './OrderExpressInfo.css'
import {NumberFormat} from '@/components/content/Format'

const Step = Steps.Step;
class OrderExpressInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:{
                expressData:{data:[]}
            },
            loading:true
        }
    }

    componentWillMount(){
        axios.get("@/order/express/queryOrderExpressInfo",{
            params:{orderUuids:this.props.uuids}
        }).then(r=>{
            if(r != null){
                this.setState({
                    dataSource:r.data,
                    loading:false
                })
            }
        });
    };

    transportTypeToStr=(type)=>{
        if(type == "1"){
            return "快递"
        }else if(type == "4"){
            return "物流"
        }else if(type == "3"){
            return "自备车"
        }
    }


    render() {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                {this.state.dataSource.transportType =="1" ||this.state.dataSource.transportType =="4"?
                    <div>
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="物流类型">
                                    <p className="ant-form-text">{this.transportTypeToStr(this.state.dataSource.transportType)}</p>
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="发货人">
                                <span className="ant-form-text">{this.state.dataSource.userName}</span>&nbsp;&nbsp;
                                    <span className="ant-form-text">{this.state.dataSource.phone}</span>
                                </BaseDetails>
                            </Col>
                           
                        </Row>
                        <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title={this.state.dataSource.transportType =="1"?"快递单号":"物流单号"}>
                                    <p className="ant-form-text">{this.state.dataSource.expressNum}</p>
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="发货时间">
                                    <p className="ant-form-text">{this.state.dataSource.deliveryTime==null?"-":moment(this.state.dataSource.deliveryTime).format("YYYY-MM-DD HH:mm:ss")}</p>
                                </BaseDetails>
                            </Col> 
                        </Row>
                        <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title={this.state.dataSource.transportType =="1"?"快递公司":"物流公司"}>
                                    <p className="ant-form-text">{this.state.dataSource.expressCompanyName}</p>
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="备 注">
                                    <p className="ant-form-text">{this.state.dataSource.deliverRemark}</p>
                                </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                           
                        </Row>
                        <Row style={{background: '#F2F2F2',height:'264px',overflow: 'auto',paddingTop:'10px'}}>
                            <Col span={4} className="wuliu">物流信息</Col>
                            <Col span={18} style={{background: '#F2F2F2'}} className={"express_info_step"}>
                                {this.state.dataSource.expressData.data?
                                    // <Steps direction="vertical" style={{background: '#F2F2F2'}}>
                                    //     {
                                    //         this.state.dataSource.expressData.data.map((item,index) =>{
                                    //             return  <Step title={item.context} description={item.ftime} />
                                    //         })
                                    //     }
                                    // </Steps>
                                    <Timeline style={{background: '#F2F2F2'}}>
                                        {
                                            this.state.dataSource.expressData.data.map((item,index) =>{
                                                return <Row><Col span={6} style={{textAlign:'right', marginRight:'10px'}}>{item.ftime}</Col>
                                                        <Col span={17} className="time_col">
                                                        <Timeline.Item>{item.context}</Timeline.Item></Col>
                                                    </Row>
                                            })
                                        }
                                    </Timeline>
                                :this.state.dataSource.expressData.message}
                            </Col>
                        </Row>
                    </div>
                    :<div>
                        <Row {...ComponentDefine.row_}>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="物流类型">
                                    <p className="ant-form-text">{this.transportTypeToStr(this.state.dataSource.transportType)}</p>
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="发货人">
                                <span className="ant-form-text">{this.state.dataSource.userName}</span>&nbsp;&nbsp;
                                    <span className="ant-form-text">{this.state.dataSource.phone}</span>
                                </BaseDetails>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title={this.state.dataSource.transportType =="1"?"快递单号":"物流单号"}>
                                    <p className="ant-form-text">{this.state.dataSource.expressNum}</p>
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="发货时间">
                                    <p className="ant-form-text">{this.state.dataSource.deliveryTime==null?"-":moment(this.state.dataSource.deliveryTime).format("YYYY-MM-DD HH:mm:ss")}</p>
                                </BaseDetails>
                            </Col> 
                        </Row>
                        <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title={this.state.dataSource.transportType =="1"?"快递公司":"物流公司"}>
                                    <p className="ant-form-text">{this.state.dataSource.expressCompanyName}</p>
                                </BaseDetails>
                            </Col>
                            <Col span={12} className="ant-form-item-margin-bottom">
                                <BaseDetails title="备 注">
                                    <p className="ant-form-text">{this.state.dataSource.deliverRemark}</p>
                                </BaseDetails>
                            </Col>
                        </Row>
                        {/* <Row className={"margin_bottom48"}>
                            <Col span={20} className="ant-form-item-margin-bottom">
                                <BaseDetails title="签收凭证">
                                    <p className="ant-form-text">{this.state.dataSource.signName ==null?"-":<a target="_blank" href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.signPath)}>{this.state.dataSource.signName}</a>}</p>
                                </BaseDetails>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20} className="ant-form-item-margin-bottom">
                                <BaseDetails title="签收凭证">
                                    <p className="ant-form-text">{this.state.dataSource.deliverRemark}</p>
                                </BaseDetails>
                            </Col>
                        </Row> */}
                    </div>
                }
                </Spin>
            </div>
        )
    }
}

export default Form.create()(OrderExpressInfo)