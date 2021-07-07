import {Select,Card, Form,Row,Table, Col,Input,Button,Icon,Radio,Divider,Steps,Spin } from 'antd';

import {systemConfig,systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {getDetailsLabel} from  '@/components/page/Details';
// import {DetailsBtns, PermissionsBtn} from '@/components/content/DetailsBtns';
import moment from "moment/moment";
import BaseDetails from "@/components/baseDetails";
import './orderContractTab.css'

class OrderContractTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:{

            },
            loading:true,
            orderCreateTime:null,
        }
    }

    /**
     * 初始化
     */
    componentWillMount(){
        //订单合同
        axios.get("@/order/orderDetail/orderContractTab",{
            params:{uuids:this.props.uuids}
        }).then((r)=>{
            console.log('999',r)
            if(r){
                this.setState({
                    dataSource:r.data,
                    loading:false
                })
            }else{
                this.setState({
                    dataSource:{},
                    loading:false
                })
            }
        });
        //下单时间
        axios.get("@/order/orderDetail/orderContractTab/getOrderCreateTime",{
            params:{uuids:this.props.uuids}
        }).then((r)=>{
            if(r){
                this.setState({
                    orderNo:r.orderNo,
                    orderCreateTime:r.orderCreateTime,
                })
            }else{
                this.setState({
                    orderCreateTime:null,
                })
            }
        });
    };

    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width:40,
        render: (text, record, index) => {
            return(<p className="tableColumnWidth" style={{width:"40px"}}><span title={index+1}>{index+1}</span></p>)
        },
    },{
        title: '操作人',
        dataIndex: 'createUserName',
        key: 'createUserName',
        width:150,
        render: (text, record, index) => {
            return(<p className="tableColumnWidth" style={{width:"200px"}}><span title={text}>{text}&nbsp;&nbsp;{record.userNo}</span></p>)
        },
    }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:200,
        render: (text, record, index) => {
            return(<p className="tableColumnWidth" style={{width:"200px"}}><span title={text?moment(text).format("YYYY/MM/DD HH:mm:ss"):""}>{text?moment(text).format("YYYY/MM/DD HH:mm:ss"):""}</span></p>)
        },
    },{
        title: '事件',
        dataIndex: 'typeStr',
        key: 'typeStr',
        width:200,
        render: (text, record, index) => {
            return(<p className="tableColumnWidth" style={{width:"200px"}}><span title={text}>{text}</span></p>)
        },
    },  ];

    // getBtns = ()=>{
    //     let result = [];
    //     // let btn1 = <PermissionsBtn only><Button onClick={this.download} style={{margin:"0px 10px 0px 10px "}} type="ghost">下载</Button></PermissionsBtn>
    //     // let btn2 = <PermissionsBtn only><Button onClick={this.sign} style={{margin:"0px 10px 0px 10px "}} type="ghost">签章</Button></PermissionsBtn>
    //     // let btn3 = <PermissionsBtn only><Button onClick={this.create} style={{margin:"0px 10px 0px 10px "}} type="ghost">创建合同</Button></PermissionsBtn>
    //     // let btn4 = <PermissionsBtn only><Button onClick={this.detail} style={{margin:"0px 10px 0px 10px "}} type="ghost">查看合同</Button></PermissionsBtn>

    //     if(JSON.stringify(this.state.dataSource) != "{}"){
    //         result.push(btn1);
    //     }
    //     if(JSON.stringify(this.state.dataSource) != "{}"
    //         &&this.state.dataSource.contractState==0
    //         &&(this.state.dataSource.contractSignState==0||this.state.dataSource.contractSignState==2)){
    //         result.push(btn2);
    //     }
    //     if(JSON.stringify(this.state.dataSource) == "{}"||this.state.dataSource.contractState==1){
    //         result.push(btn3);
    //     }
    //     if(JSON.stringify(this.state.dataSource) != "{}"){
    //         result.push(btn4);
    //     }

    //     if(result.length>0){
    //         // result[result.length-1]=<PermissionsBtn only>{React.cloneElement(result[result.length-1].props.children,{type:"primary"})}</PermissionsBtn>
    //     }
    //     return result;
    // }
    download = ()=>{
        window.open(SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.contractPdfUrl));
    }
    sign = ()=>{
        let params = {};
        params.uuids = this.state.dataSource.uuids;
        window.open(systemConfigPath.jumpPage(getUrlByParam("/contract/sign",params)));
    }
    create = ()=>{
        let params = {};
        params.longFlag = "1";
        params.orderNo = this.state.orderNo;
        window.open(systemConfigPath.jumpPage(getUrlByParam("/orderContract/insertOrderContract",params)));
    }
    detail = ()=>{
        let params = {};
        params.uuids = this.state.dataSource.uuids;
        window.open(systemConfigPath.jumpPage(getUrlByParam("/orderContract/orderContractDetail",params)));
    }
    approvalType = (type) =>{
        let temp = '';
        if(type == 1){
            return temp ="铁建商城内审批"
        }else if(type == 2){
            return temp ="OA系统审批"
        }else{
            //return temp ="无需审批"
            return "-"
        }
    }

    render() {
        let approval = '-';
        let contractStatus = '未创建';
        if(this.state.dataSource){
        let approvalStatus = this.state.dataSource.approvalStatus;
        let approvalType = this.state.dataSource.approvalType;
        let contractSignState = this.state.dataSource.contractSignState;
        let contractState = this.state.dataSource.contractState;
        if(contractState != null && 1 == contractState){
            contractStatus = "作废";
        }else if(1 == approvalStatus){
            contractStatus = "审核中";
            if(1 == approvalType){
                approval = "铁建商城内部审批";
            }else if(2 == approvalType){
                approval = "OA系统审批";
            }
        }else if(3 == approvalStatus){
            contractStatus = "未通过";
            if(1 == approvalType){
                approval = "铁建商城内部审批";
            }else if(2 == approvalType){
                approval = "OA系统审批";
            }
        }else if(2 == approvalStatus){//已通过
            if(0 == contractSignState){
                contractStatus = "待签章";
            }else if(1 == contractSignState){
                contractStatus = "供应商未签章";
            }else if(2 == contractSignState){
                contractStatus = "待签章";
            }else if(3 == contractSignState){
                contractStatus = "已生效";
            }
            if(1 == approvalType){
                approval = "铁建商城内部审批";
            }else if(2 == approvalType){
                approval = "OA系统审批";
            }
        }else if(4 == approvalStatus){//无需审批
            approval = '无需审批';
            if(0 == contractSignState){
                contractStatus = "待签章";
            }else if(1 == contractSignState){
                contractStatus = "供应商未签章";
            }else if(2 == contractSignState){
                contractStatus = "待签章";
            }else if(3 == contractSignState){
                contractStatus = "已生效";
            }
        }
        }
        return (
            <div className="orderContractTab">
                <Spin spinning={this.state.loading}>
                <Row {...ComponentDefine.row_}>
                        <Col span={24}>
                            {/* <div style={{float:"right",margin:"32px 0px 16px 0px"}}> */}
                            <div style={{float:"right",margin:"0px 0px 10px 0px"}}>
                                {/* {this.getBtns()} */}
                            </div>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="合同编码"
                            >
                                <p className="ant-form-text">{this.state.dataSource? this.state.dataSource.contractNumber : '-'}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="合同生成时间"
                            >
                                <p className="ant-form-text">{this.state.dataSource ? moment(this.state.dataSource.createTime).format("YYYY-MM-DD HH:mm:ss"):'-'}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="合同状态"
                            >
                                <p className="ant-form-text">{contractStatus}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="合同生效时间"
                            >
                                <p className="ant-form-text">{this.state.dataSource.effectiveTime?moment(this.state.dataSource.effectiveTime).format("YYYY-MM-DD HH:mm:ss"):'-'}</p>
                            </BaseDetails>
                        </Col>
                        {/* <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("下单时间")}
                            >
                                <p className="ant-form-text">{this.state.orderCreateTime?moment(this.state.orderCreateTime).format("YYYY-MM-DD HH:mm:ss"):null}</p>
                            </Form.Item>
                        </Col> */}
                    </Row>
                    <Row {...ComponentDefine.row_}>
                    <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="合同审批"
                            >
                                <p className="ant-form-text">{approval}</p>
                            </BaseDetails>
                        </Col>
                    </Row>

                    
                    <Table columns={this.columns} dataSource={this.state.dataSource?this.state.dataSource.logList:[]} pagination={false}/>
                </Spin>
            </div>
        )
    }
}

export default OrderContractTab