import {Row, Col, Icon, Card, Button, Modal} from 'antd';

import less from './index.less'
import React from "react";
import NewForm from "components/newForm";
import AuthButton from "components/authButton";
import BaseTabs from "components/baseTabs";
import SaleBondManage from "business/saleBondManage";
import BaseTable from "components/baseTable";

export default class BuildList extends React.Component {
    constructor(props){
        super(props)
        console.log(props)

    }
    state = {
        isFilterMore: 1,//0收起 1展开,
        validateStatus:'',
        help:'',
        detailVisible: false,//
        currKey:'',
    }

    componentWillMount() {
        if(this.props.listLength>5){
            this.setState({
                isFilterMore: 0
            })
        }
    }
    _this=this
    config = {
        span: [5, 15],
        codeTime: 60,
    };

    // 列表
    columns = [
        {
            title: '工单号',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 150,
        }
        ,{
            title: '来款银行',
            dataIndex: 'businessType',
            key: 'businessType',
            sorter: true,
            width: 150
        },{
            title: '流水号',
            dataIndex: 'disposer',
            key: 'disposer',
            sorter: true,
            width: 150
        },{
            title: '来款账户名',
            dataIndex: 'department',
            key: 'department',
            sorter: true,
            width: 150
        },{
            title: '来款账户号',
            dataIndex: 'person',
            key: 'person',
            sorter: true,
            width: 150
        },{
            title: '来款附言',
            dataIndex: 'buyer',
            key: 'buyer',
            sorter: true,
            width: 150
        },{
            title: '来款金额',
            dataIndex: 'buyerContact',
            key: 'buyerContact',
            sorter: true,
            width: 150
        },{
            title: '来款时间',
            dataIndex: 'depositAmount',
            key: 'depositAmount',
            sorter: true,
            width: 150
        },{
            title: '状态',
            dataIndex: 'finesAmount',
            key: 'finesAmount',
            sorter: true,
            width: 150
        },{
            title: '处理结果',
            dataIndex: 'confiscationsActual',
            key: 'confiscationsActual',
            sorter: true,
            width: 150
        },{
            title: '业务类型',
            dataIndex: 'creationTime',
            key: 'creationTime',
            sorter: true,
            width: 150
        },{
            title: '业务单号',
            dataIndex: 'acceptanceTime',
            key: 'acceptanceTime',
            sorter: true,
            width: 150
        },{
            title: '付款单号',
            dataIndex: 'Acceptor',
            key: 'Acceptor',
            sorter: true,
            width: 150
        },{
            title: '受理人',
            dataIndex: 'treatmentResults',
            key: 'treatmentResults',
            sorter: true,
            width: 150
        },{
            title: '受理时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '处理时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '复核人',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '复核时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        },{
            title: '完成时间',
            dataIndex: 'processingTime',
            key: 'processingTime',
            sorter: true,
            width: 150
        }
    ]
    showLoca(v){
        this.setState({
            detailVisible: true,
            currKey:v.compName
        })
    }


    initBuildList = () => {
        const buildList = this.props.buildList;
        const buildItemList = [];
        const { span } = this.config;
        if (buildList && buildList.length > 0) {
                buildList.forEach((item, i) => {
                        const list= <Card className="mb20"  style={{backgroundColor:"#FAFEFF",borderColor:"#B0E9FF"}}>
                            <Row className="reuse_row" key={item.id}>
                                <Col span={11} className="reuse_value">
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={7} style={{fontWeight:"bold"}}>买受人公司名称</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_value" span={24} style={{fontWeight:"bold",fontSize:"20px",color:"#000000"}}>{item.compName}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={7} style={{fontWeight:"bold"}}>业务类型</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_value" span={24} style={{fontWeight:"bold",fontSize:"20px",color:"#000000"}}>{item.djMain}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>打款账户号</Col>
                                        <Col className="reuse_value" span={span[1]}>{item.payBuild}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>付款人</Col>
                                        <Col className="reuse_value" span={span[1]}>{item.payMan}</Col>
                                    </Row>
                                    <Row className="reuse_row">
                                        <Col className="reuse_label" span={span[0]}>处置方公司</Col>
                                        <Col className="reuse_value" span={span[1]}>{item.comp}</Col>
                                    </Row>
                                </Col>
                                <Col className="reuse_value" span={13}>
                                    <Row className="reuse_row">
                                        <Col span={16}>
                                            <Row className="reuse_row">
                                                <Col span={24}>
                                                    <div className={less.title_status}>
                                                        <p className={less.main} >支付金额（元）:</p>
                                                        <p className={less.notedetal}>{item.payAmount}</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="reuse_row">
                                                <Col span={24}>
                                                    <div className={less.title_status}>
                                                        <p className={less.main} >附言码:</p>
                                                        <p className={less.notedetal}>{item.mckCode}</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="reuse_row">
                                                <Col span={7} className="reuse_label">结算单号</Col>
                                                <Col span={16} className="reuse_value" className={less.textcolor}>{item.thb}</Col>
                                            </Row>
                                            <Row className="reuse_row">
                                                <Col span={7} className="reuse_label">付款时间</Col>
                                                <Col span={16} className="reuse_value" >{item.tht}</Col>
                                            </Row>
                                            <Row className="reuse_row">
                                                <Col span={7} className="reuse_label">订单编号</Col>
                                                <Col span={16} className="reuse_value" className={less.textcolor}>{item.thd}</Col>
                                            </Row>
                                            <Row className="reuse_row">
                                                <Col span={7} className="reuse_label">支付单号</Col>
                                                <Col span={16} className="reuse_value" className={less.textcolor}>{item.thp}</Col>
                                            </Row>
                                        </Col>
                                        <Col span={8}>
                                            <Row className="reuse_row">
                                                <Col span={24} style={{marginBottom:"50px"}}>
                                                    <Col className="reuse_label" span={8}>关联</Col>
                                                    <Col className="reuse_value" span={span[1]}>{item.allTon}次</Col>
                                                </Col>
                                                <Col span={24}>
                                                    <Button type="primary" size="small" onClick={()=>this.showLoca(item)} >查看历史来款</Button>
                                                </Col>
                                                <Col span={24}>
                                                    <NewForm ref='topForm'  formList={this.state.textarea}  wrappedComponentRef={(inst)=>{this.codelForm = inst}}/>
                                                </Col>
                                            </Row>
                                        </Col>
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


    render() {
        const isFilterMore = this.state.isFilterMore;

        return (
            <div >
                <Row className="baseForm-row" >
                    <Col span={isFilterMore ? 24 : 24} key={1} style={{  height: isFilterMore ? '' : '1500px' ,overflow:"hidden"}}>
                        <Card bordered={false} >
                            {this.initBuildList()}
                        </Card>
                    </Col>
                </Row>
                {/*{this.isShow()}*/}

                <Modal
                    title="历史来款"
                    maskClosable={false}
                    width={1000}
                    visible={this.state.detailVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => { this.setState({ detailVisible: false }) }}
                    footer={[
                        <Button  type="primary" onClick={this.hideModal} >
                            确认
                        </Button>
                    ]}
                    >
                    {/*{this.state.currKey}*/}
                    <Card className="mb10" bordered={false} >
                                <Row className="reuse_row">
                                    <Col className="reuse_value" span={12}>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={6} style={{fontWeight:"bold"}}>来款账户</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_value" span={24} style={{fontWeight:"bold",fontSize:"20px",color:"#000000"}}>一二三四五六七八九十一二三四五六七八九十</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={5}>来款账号</Col>
                                            <Col className={less.textcolor} span={15}>1234567890123456789</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={5}>流水号</Col>
                                            <Col className="reuse_value" span={15}>2021-11-01 14:24:20</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={5}>来款时间</Col>
                                            <Col className="reuse_value" span={15}>2021-01-20 15:25:23</Col>
                                        </Row>
                                        <Row className="reuse_row">
                                            <Col className="reuse_label" span={5}>来款银行：</Col>
                                            <Col className="reuse_value" span={15}>费县利君板材厂</Col>
                                        </Row>
                                    </Col>
                                    <Col span={12} className="reuse_value">
                                            <Row className="reuse_row">
                                                <Col span={24}>
                                                    <Row className="reuse_row">
                                                        <Col span={24}>
                                                            <p className={less.main} >来款金额（元）:</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="reuse_row">
                                                        <Col span={24}>
                                                            <p className={less.note} style={{color:"black",fontSize:"22px",fontWeight:"bold"}}>99999999.00</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="reuse_row">
                                                        <Col span={24}>
                                                            <p className={less.main} >来款附言</p>
                                                        </Col>
                                                        <Col span={24}>
                                                            <p style={{color:"black",fontSize:"22px",fontWeight:"bold"}}>GX0201212121299</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                    </Col>
                                </Row>
                        <Row>
                            <BaseTable
                                scroll={{ x: 1900 }}
                                url='@/reuse/saleScene/findPage'
                                tableState={this.state.tableState}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState')
                                }}
                                indexkey_fixed={true}
                                baseParams={this.baseParams}
                                columns={this.columns} />
                        </Row>
                            {/*</div>*/}
                        {/*</div>*/}
                    </Card>
                </Modal>
            </div>
        )
    }
}

