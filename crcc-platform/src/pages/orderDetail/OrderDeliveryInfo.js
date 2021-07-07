import {Select,Card, Form,Row,Table, Col,Input,Button,Icon,Radio,Divider,Steps,Spin } from 'antd';
import BaseDetails from "@/components/baseDetails";;
import moment from "moment/moment";
import {NumberFormat} from '@/components/content/Format'


const Step = Steps.Step;
class OrderDeliveryInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // dataSource:{},
            loading:true
        }
    }

    componentWillMount(){
        // axios.get("@/order/express/queryOrderDeliveryInfo",{
        //     params:{orderUuids:this.props.uuids}
        // }).then(r=>{
        //     if(r != null){
        //         this.setState({
        //             dataSource:r.data,
        //             loading:false
        //         })
        //     }
        // });
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
        let url = (this.props.dataSource.orderDeliveryVo?this.props.dataSource.orderDeliveryVo.signPath:'')
        return (
            <div>
                <div>
                    <Row>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="签收人">
                                <p className="ant-form-text">{this.props.dataSource.orderDeliveryVo.consignee}</p>
                            </BaseDetails>
                        </Col>

                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="联系电话">
                                <p className="ant-form-text">{this.props.dataSource.orderDeliveryVo.consigneePhone}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="备注信息">
                                <p className="ant-form-text">{this.props.dataSource.orderDeliveryVo.consigneeRemark}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="签收附件">
                                {/* <a href={this.state.dataSource.path} className="ant-form-text">{this.state.dataSource.pathName}</a> */}
                                <p className="ant-form-text"><a target="_blank" download={this.props.dataSource.orderDeliveryVo ? this.props.dataSource.orderDeliveryVo.signName :''} href={SystemConfig.systemConfigPath.dfsPathUrl(url)}>{this.props.dataSource.orderDeliveryVo ? this.props.dataSource.orderDeliveryVo.signName:''}</a></p>
                            </BaseDetails>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Form.create()(OrderDeliveryInfo)