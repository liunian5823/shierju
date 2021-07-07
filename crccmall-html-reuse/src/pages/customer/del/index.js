import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin,Card ,Popconfirm,message,Radio,Upload} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import less from './index.less';
const indexJson = './index.json';

//保证金状态
const _BONDSTATUS = baseService._bondMain;
const _BONDSTATUS_OBJ = baseService._bondMain_obj;

export default class Del extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bondData: {},
            detailVisible: false,//确定
        }
    }
    config = {
        span: [5, 15],
        codeTime: 60,
    }
    columns = [
        {
            title: '操作人',
            dataIndex: 'code',
            key: 'code',
            width: 150,
        }
        ,{
            title: '操作时间',
            dataIndex: 'businessType',
            key: 'businessType',
            sorter: true,
            width: 150
        },{
            title: '具体操作',
            dataIndex: 'disposer',
            key: 'disposer',
            width: 150
        }
    ]

    componentWillMount() {
        this.handleInit()
    }
    componentDidMount() {
        // console.log(this.props.form)
        console.log(this.state.bondData)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.uuids != nextProps.uuids) {
            this.getBondData(nextProps.uuids)
        }
    }
    //初始
    handleInit = () => {
        this.getBondData()
    }
    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.tabStatus = null
            // this.setState({
            //     defaultKey: null
            // })
            this.reloadTableData();
        }
    }
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    //获取数据
    getBondData = (id) => {
        //模拟接口请求
        this.setState({//等同于 下面请求接口成功的this.setState
                bondData:{
                        "workOrder":"12345678901234567",
                        "biddingList":"12345678901234567",
                        "thisWeek":"682",
                        "thisMont":"682",
                        "approvalStatusStr":"报名中",
                        "disposerType":"成员单位",
                        "disposerName":"中国铁建电气化局集团第三十五局北方工程有限公司",
                        "disposerComName":"中国铁建电气化局集团第三十五局北方工程有限公司",
                        "creditCode":"48621452145214521452",
                        "disposerHumn":"张三 188 8888 8888",
                        "forfeitureReason":"一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三",
                        "enclosure":[
                            {
                                "businessId":"350429657306652672",
                                "createTime":null,
                                "createUserId":null,
                                "delFlag":null,
                                "fileName":"营业执照样例.jpg",
                                "filePath":"group1/M00/00/D9/wKhCZmC9ex2Ab0xWAAI93eqnJbM740.jpg?filename=营业执照样例.jpg",
                                "fileSuf":"jpg",
                                "id":null,
                                "page":1,
                                "pageSize":10,
                                "type":1,
                                "updateTime":null,
                                "updateUserId":null,
                                "uuids":"350429657346498560"
                            },{
                                "businessId":"350429657306652672",
                                "createTime":null,
                                "createUserId":null,
                                "delFlag":null,
                                "fileName":"营业执照样例.jpg",
                                "filePath":"group1/M00/00/D9/wKhCZmC9ex2Ab0xWAAI93eqnJbM740.jpg?filename=营业执照样例.jpg",
                                "fileSuf":"jpg",
                                "id":null,
                                "page":1,
                                "pageSize":10,
                                "type":1,
                                "updateTime":null,
                                "updateUserId":null,
                                "uuids":"350429657346498560"
                            }
                        ],
                        "buyerType": "非成员单位",
                        "disposerBuyerType": "阜城县瑞亨建筑工程有限公司",
                        "disposerCode": "48621452145214521452",
                        "buyerHumn": "48621452145214521452",
                        "mask": "一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三一二三",
                        "Acceptor": "4862145214",
                        "acceptorTime": "4862145214",
                        "handleTime": "4862145214",
                        "handleResult": "4862145214",
                        "handlePrice": "4862145214",
                        "enclosureFile": "4862145214",
                        "remask": "4862145214"
                },
                spinning: false
            })

        // let uuids = id || this.props.uuids;
        // if (!uuids) return;
        // this.setState({
        //     spinning: true
        // })
        // api.ajax('GET', '@/reuse/bondDeal/info', {
        //     uuids: uuids
        // }).then(res => {
        //     if (res.data) {
        //         this.setState({
        //             bondData: res.data,
        //             spinning: false
        //         })
        //     } else {
        //         this.setState({
        //             bondData: {}
        //         })
        //     }
        // }, error => {
        //     this.setState({
        //         bondData: {}
        //     })
        //     Util.alert(error.msg, { type: 'error' })
        // }).catch(rps=>{
        //     console.log(rps)
        // })
    }
    //确定
    handleToClick = () => {
        this.setState({
            detailVisible: true
        })
    }
    // 释放确定
    handleToRelease = () => {
        message.info('释放');
    }
    handleSubmit=(e)=>{
        console.log(this);
        this.hideModal();
    }

    //基本信息
    createBaseInfo = () => {
        const { bondData } = this.state;
        const { span } = this.config;
        const { bondDeal = {} } = this.state.bondData;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
          };
          const formItemMoney = {
            labelCol: { span: 6 },
            wrapperCol: { span: 3 },
          };
        return (
            <div>
                 <Card className="mb10" bordered={false}>
                     <Row claName="reuse_row" >
                         <Col span={6} style={{marginBottom:"10px"}}>
                             <Row>
                                 <Col span={6} style={{marginBottom:"10px"}}  className="reuse_label">工单号:</Col>
                                 <Col span={18} style={{marginBottom:"10px"}} >{bondData.workOrder}</Col>
                             </Row>
                             <Row>
                                 <Col span={6} style={{marginBottom:"10px"}}  className="reuse_label">竞价单</Col>
                                 <Col span={18} style={{marginBottom:"10px"}} className={`reuse_value ${less.textcolor}`} >{bondData.biddingList}</Col>
                             </Row>
                         </Col>
                         <Col span={6} style={{marginBottom:"10px"}}>
                             <span style={{color:"#000000",fontSize:"14px"}}>本周完成</span>
                             <p style={{color:"#000000",fontSize:"24px"}}>{bondData.thisWeek}家</p>
                         </Col>
                         <Col span={6} style={{marginBottom:"10px"}}>
                             <span style={{color:"#000000",fontSize:"14px"}}>本月完成</span>
                             <p style={{color:"#000000",fontSize:"24px"}}>{bondData.thisMont}家</p>
                         </Col>
                         <Col span={6} style={{marginBottom:"10px"}}>
                             <span style={{color:"#000000",fontSize:"14px"}}>状态</span>
                             <p style={{color:"#FA9B13",fontSize:"24px"}}>{bondData.approvalStatusStr}</p>
                         </Col>
                     </Row>
                 </Card>
                <Card className="mb10" bordered={false}>
                    <div className={less.flex}>
                    <div className={less.topMesage}>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方企业类型</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.disposerType}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方企业名称</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.disposerName}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方项目名称</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.disposerComName}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>统一社会信用代码</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.creditCode}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方联系人</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.disposerHumn}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>罚没理由</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.forfeitureReason}</Col>
                        </Row>
                        <Row className="reuse_row mb20">
                            <Col className="reuse_label" span={span[0]}>附件</Col>
                            <Col className={`reuse_value ${less.textcolor}`} span={span[1]} >{
                                bondData.enclosure.length>0 ? bondData.enclosure.map((item) => {
                                        return <p><a href={item.filePath}> {item.fileName}</a> <br/></p>
                                }):"暂无附件"
                            }</Col>
                        </Row>
                        <Row className="reuse_row mt20">
                            <Col className="reuse_label" span={span[0]}>买受方企业类型</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.buyerType}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方企业名称</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.disposerBuyerType}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>统一社会信用代码</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.disposerCode}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>买受方联系人</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.buyerHumn}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>情况说明</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.mask}</Col>
                        </Row>
                    </div>
                    <div className={less.rightspan}>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>受理人</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.Acceptor}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>受理时间</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.acceptorTime}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处理时间</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.handleTime}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处理结果</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.handleResult}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处理金额</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.handlePrice}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>附件</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.enclosureFile}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>备注</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.remask}</Col>
                        </Row>
                    </div>
                    </div>
                </Card>
                <div className="reuse_baseTitle"></div>
                <Card className="mb20" bordered={false} title="操作日志">
                <BaseTable
                        
                        url='@/reuse/saleScene/findPage'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={true}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
                <Card className="fixed_button">
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            <Button  onClick={this.props.callBack}>返回</Button>
                            <Popconfirm placement="topRight" title="确认释放本工单？释放后可再次受理，但原始记录将依然被保留" onConfirm={this.handleToRelease}>
                                <Button>释放</Button>
                            </Popconfirm>
                            <Popconfirm placement="topRight" title="确认受理此工单吗？" onConfirm={this.handleToClick}>
                                <Button type="primary">处理</Button>
                            </Popconfirm>
                           
                        </div>
                </Card>
                    <Modal
                    title="处理结果"
                    maskClosable={false}
                    width={1000}
                    visible={this.state.detailVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => { this.setState({ detailVisible: false }) }}
                    >
                        
                    <Form horizontal form={this.formRef} wrappedComponentRef={(inst)=>{this.formRef = inst}}>
                        <FormItem
                            {...formItemLayout}
                            label="处置方企业名称："
                            >
                        <p className="ant-form-text" id="userName" name="userName">企业名称企业名称企业名称企业名称企业名称企业名称企业名称企业名称企业名称企业名称企业名称企业名称企业名称</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="用户诉求"
                            >
                        <p className="ant-form-text" id="userSay" name="useuserSayrName">沉没 8000.00元     100%</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="*处理结果"
                            >
                        <RadioGroup>
                            <Radio value="force">强制退还</Radio>
                            <Radio value="agreement">协商一致沉没</Radio>
                        </RadioGroup>
                        </FormItem>
                        <FormItem
                            {...formItemMoney}
                            label="*金额："
                            >
                        <Input type="text" placeholder="请输入密码" className={less.inputwidth} />1
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="*案情说明："
                            >
                        <Input type="textarea" placeholder="请输入说明"  />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="*附件上传："
                            >
                        <Upload {...this.props}>
                            <Button type="ghost">
                            <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="*手机号验证码"
                            >
                        <InputGroup>
                            <Col span="8">
                                <Input />
                            </Col>
                            <Col span="4">
                                <Button type="primary">获取验证码</Button>
                            </Col>
                        </InputGroup>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }


    render() {
        const { bondDealList = [] } = this.state.bondData;

        return (
            <div className={less.bondDetail}>
                <Spin spinning={this.state.spinning}>
                    <div className={less.card}>{this.createBaseInfo()}</div>

                </Spin>
            </div>
        )
    }
}
