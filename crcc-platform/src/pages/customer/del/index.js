import React from 'react';
import api from '@/framework/axios';
import Util from '@/utils/util'
import { Row, Col, Table, Modal, Input, Form, Button, Icon, Spin,Card ,Popconfirm,message,Radio,Upload,InputNumber} from 'antd';
import {getDetailsLabel, detailsLayout} from  '@/components/gaoda/Details';
import download from "@/pages/reuse/utils/isViewDown";
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
import BaseTable from '@/components/baseTable';
import { baseService } from '@/utils/common';
import { getUrlByParam } from '@/utils/urlUtils';
import less from './index.less';
const indexJson = './index.json';
import {NumberFormat} from "@/components/gaoda/Format";
import { parseXML } from 'jquery';


class Del extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false,
            bondData: {},
            detailVisible: false,//确定
            baseParams:{
                uuids: this.props.match.params.uuids,
                logType:'2'
            },
            codeButtonDisabled: false,
            codeButtonText: "验证码(60s)",
            interval:null,
            serialNo:null,
            dealResult:null,
            inputmt:null,
            inputDisabled:false,
            codeVisible:false
        }
    }
    config = {
        span: [5, 15],
        codeTime: 60,
    }
    columns = [
        {
            title: '操作人',
            dataIndex: 'username',
            key: 'username',
            width: 150,
        }
        ,{
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            width: 150
        },{
            title: '具体操作',
            dataIndex: 'remark',
            key: 'remark',
        }
    ]

    componentWillMount() {
        this.handleInit();
    }
    //加载数据
    handleSearch = ()=>{
        let params = {};
        params.uuids = this.props.match.params.uuids;
        api.ajax("GET", "@/platform/reuse/bondWorkOrder/queryWorkOrderDetail", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
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
        let uuids = this.props.match.params.uuids;
        if (!uuids) return;
        this.setState({
            spinning: true
        })
        api.ajax("GET", "@/platform/reuse/bondWorkOrder/queryWorkOrderDetail", {
            uuids: uuids
        }).then(res => {
            if (res.data) {
                this.setState({
                    bondData: res.data,
                    spinning: false,
                    inputmt: res.data.occupyAmt
                })
            } else {
                this.setState({
                    bondData: {}
                })
            }
        }, error => {
            this.setState({
                bondData: {}
            })
            Util.alert(error.msg, { type: 'error' })
        }).catch(rps=>{
            console.log(rps)
        })
    }
    //确定
    handleToClick = () => {
        let uuids = this.props.match.params.uuids;
        if (!uuids) return;
        api.ajax("get", "@/platform/reuse/bondWorkOrder/acceptWorkOrder", {
            uuids: uuids
        }).then(res => {
            if(res.data == 1){
                Util.alert("受理成功", { type: 'success' });
            }else{
                Util.alert(res.msg, { type: 'error' }); 
            }
            this.getBondData();
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        }).catch(rps=>{
            console.log(rps)
        })
    }
    // 处理
    handleToReault = () => {
        this.setState({
            detailVisible: true
        }) 
    }
    // 释放确定
    handleToRelease = () => {
        let uuids = this.props.match.params.uuids;
        if (!uuids) return;
        api.ajax("GET", "@/platform/reuse/bondWorkOrder/releaseWorkOrder", {
            uuids: uuids
        }).then(res => {
            if(res.data == 1){
                Util.alert("释放成功", { type: 'success' });
            }else{
                Util.alert(res.msg, { type: 'error' }); 
            }
            this.getBondData();
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        }).catch(rps=>{
            console.log(rps)
        })
    }
    closeModal = () => {
        this.setState({
            detailVisible: false
        })
        this.props.form.resetFields();
    }
    handleSubmit=(e)=>{
        const { serialNo,bondData } = this.state;
        let uuids = this.props.match.params.uuids;
        if (!uuids) return;
        let params = {};
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if(values.dealResult == 2 && (values.actualAmt == null || values.actualAmt == '')){
                Util.alert('请输入金额', { type: 'error' })
                return;
            }
            if(values.dealResult == 2 || values.dealResult == 3){
                if(serialNo == null || serialNo == ''){
                    Util.alert('请获取手机验证码', { type: 'error' })
                    return;
                }
                params.messageCode = values.messageCode;
                params.serialNo = serialNo;
            }
            let _this = this;
            if (this.state.loading) return false;
            this.setState({
                loading: true,
            })
            if(values.fileList&&1 == values.fileList.length){
                params.dealFilePath = values.fileList[0].response.data;
                params.dealFileName = values.fileList[0].name;
            }
           {/* 处理结果;1.强制退还，2.沉没保证金，3.协商一致 */}
            params.uuids = uuids;
            params.dealResult = values.dealResult;
            params.dealDescription = values.dealDescription;
            if(values.dealResult == 2){
                params.actualAmt = values.actualAmt;
            }
            if(values.dealResult == 3 && (values.actualAmt != bondData.occupyAmt)){
                params.actualAmt = values.actualAmt;
            }
            console.log(params)
            api.ajax('GET', '@/platform/reuse/bondWorkOrder/dealWorkOrder', {
                ...params
            }).then(res => {
                Util.alert("处理成功", { type: 'success' });
                this.closeModal();
                this.getBondData();
            }, error => {
                Util.alert(error.msg, { type: 'error' })
            }).catch(rps=>{
                console.log(rps)
            })
          })
    }

    //发送手机验证码
    sendPhoneCode = ()=>{
        const { bondData } = this.state;
        this.intervalTime()
        let actualAmt = this.props.form.getFieldValue('actualAmt');
        //发送验证码
        api.ajax("GET","@/platform/reuse/bondWorkOrder/sendTransactionCode",{
          actualAmt:actualAmt || 0,
        }).then((r) => {
            message.success("短信验证码已发送");
            this.setState({
                serialNo:r.data.SerialNo
            })
        },(r)=>{
            message.error(r.message);
            this.setState({
                codeButtonDisabled: false,
            })
            clearInterval(this.state.interval);
        });
    }

    //60秒倒计时
    intervalTime = ()=>{
        this.setState({
            codeButtonDisabled: true,
            codeButtonText:"验证码(60s)"
        })
        let that = this;
        let intervalTime = 60;
        let interval = setInterval(function () {
            let time = intervalTime;
            if (time == 1) {
                that.setState({
                    codeButtonDisabled: false,
                    codeButtonText: "获取验证码"
                })
                clearInterval(interval);
            } else {
                intervalTime -= 1;
                that.setState({
                    codeButtonDisabled: true,
                    codeButtonText: "验证码("+intervalTime+"s)"
                })
            }
            console.log(time);
        }, 1000)
        that.setState({
            interval: interval
        })
    }
    uploadProps = {
        ...ComponentDefine.upload_.uploadProps,
        beforeUpload(file) {
            const fileType =  ["doc","docx","pdf","jpg","jpeg","png"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('只能上传doc、docx、pdf、jpg、png类型的文件');
                return false
            }
            if(file.size&&file.size>1024*1024*2){
                message.error('请上传小于2MB的文件');
                return false
            }
            return true
        },
        onChange:(info)=> {
            let fileList = info.fileList;
            if (info.file.status === 'done') {
                let isSuccess = false;
                if(info.file.response.code=="000000"){
                    isSuccess=true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    message.success(`${info.file.name} 上传成功。`);
                }else{
                    message.error(`${info.file.name} 上传失败。`);
                }
                if(isSuccess){
                    fileList = fileList.slice(-1);
                }else{
                    fileList = fileList.slice(0,fileList.length-1);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败。`);
            }
            this.props.form.setFieldsValue({fileList})
        }
    };
    onPayTypeChange = (e) => {
        this.setState({
            dealResult: e.target.value
        })
        const tValue = e.target.value;
        let bondData = this.state.bondData;
        console.log(tValue)
        if(tValue == 1){
            this.setState({
                inputmt:bondData.amt || 0,
                inputDisabled:true
            })
        }else if(tValue == 3){
            this.setState({
                inputmt:bondData.occupyAmt || 0,
                inputDisabled:true
            })
        }else if(tValue == 2){
            this.setState({
                inputDisabled:false,
                inputmt:'10'
            })
        }
    }
    computeRatio=(v, type)=>{
        let occupyAmtRatio = 0;
        //保证金金额
        let bondAmt = this.state.bondData.amt;
        if(type == 1){
            if (v <= 0){
                occupyAmtRatio = 0;
            }
            if (v > bondAmt){
                occupyAmtRatio = 100;
            }
            if(v >= 0 && v <= bondAmt) {
                // 百分比为occupyAmt/amt*100%
                if(bondAmt != null){
                    occupyAmtRatio = ((v*100)/bondAmt).toFixed(2);
                }
            }
        }

        this.props.form.setFieldsValue({ occupyAmtRatio: occupyAmtRatio });
    }
    // 查看详情
    seeDetails = ( uuids ) => {
        console.log(uuids)
        window.open(systemConfigPath.jumpPage(getUrlByParam("/reuse/bidManagement/details/" + uuids)));
    }
    handleGoBack = () => {
        this.props.history.goBack()
      }
    //基本信息
    createBaseInfo = () => {
        const { bondData,dealResult,inputmt,inputDisabled,codeVisible } = this.state;
        const { span } = this.config;
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
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
                                 <Col span={6} style={{marginBottom:"10px"}}  className="reuse_label">工单号</Col>
                                 <Col span={18} style={{marginBottom:"10px"}} >{bondData.workOrderNo}</Col>
                             </Row>
                             <Row>
                                 <Col span={6} style={{marginBottom:"10px"}}  className="reuse_label">竞价单</Col>
                                 <Col span={18} style={{marginBottom:"10px"}}>
                                    {bondData.sceneCode ?  <a onClick={() => this.seeDetails(bondData.sceneUuids)} style={{ color: '#61ccfa', textDecoration: 'underline', float:'left' }}>{ bondData.sceneCode}</ a> : <span>-</span>}
                                   
                                 </Col>
                             </Row>
                         </Col>
                         <Col span={6} style={{marginBottom:"10px"}}>
                             <span style={{color:"#000000",fontSize:"14px"}}>保证金金额</span>
                             <p style={{color:"#000000",fontSize:"24px"}}>
                                {bondData.amt?<span><NumberFormat value={bondData.amt}/>元</span>:<span>-</span>}
                             </p>
                         </Col>
                         <Col span={6} style={{marginBottom:"10px"}}>
                             <span style={{color:"#000000",fontSize:"14px"}}>罚没金额</span>
                             <p style={{color:"#000000",fontSize:"24px"}}>
                                {bondData.actualAmt?<span><NumberFormat value={bondData.actualAmt}/>元</span>:<span>-</span>}
                             </p>
                         </Col>
                         <Col span={6} style={{marginBottom:"10px"}}>
                             <span style={{color:"#000000",fontSize:"14px"}}>状态</span>
                             <p style={{color:"#FA9B13",fontSize:"24px"}}>
                               {
                                    bondData.dealStatus === 0 ? '待受理' :
                                    bondData.dealStatus === 1 ? '待处理' :
                                    bondData.dealStatus === 2 ? '已完成' :
                                    '-'  
                                }
                             </p>
                         </Col>
                     </Row>
                 </Card>
                <Card className="mb10" bordered={false}>
                    <div className={less.flex}>
                    <div className={less.topMesage}>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方企业类型</Col>
                            <Col className="reuse_value" span={span[1]}>
                            {
                                    bondData.saleCompanyType == 1 ? '内部单位' :
                                    bondData.saleCompanyType == 2 ? '外部单位' :
                                    '-'  
                                }
                            </Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方企业名称</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.saleCompanyName || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方项目名称</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.title || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>统一社会信用代码</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.businessLicense || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方联系人</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.saleCompanyContactUserName || '-'}</Col>
                        </Row> 
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>罚没理由</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.occupyReason || '-'}</Col>
                        </Row>
                        <Row className="reuse_row mb20">
                            <Col className="reuse_label" span={span[0]}>附件</Col>
                            <Col className="reuse_value" span={span[1]}>
                                { bondData.filePath ?
                                    <a
                                    href="javascript:void(0);"
                                    onClick={() => download(bondData.fileName, configs.downUrl + bondData.filePath, true)}
                                    className="linkButton">{bondData.fileName}</a>
                                    : <span>-</span>
                                }
                               
                            </Col>
                        </Row>
                        <Row className="reuse_row mt20">
                            <Col className="reuse_label" span={span[0]}>买受方企业类型</Col>
                            <Col className="reuse_value" span={span[1]}>
                               {
                                    bondData.buyerCompanyType == 1 ? '内部单位' :
                                    bondData.buyerCompanyType == 2 ? '外部单位' :
                                    '-'  
                                }
                            </Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处置方企业名称</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.saleCompanyName || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>统一社会信用代码</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.disposerCode || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>买受方联系人</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.buyerCompanyContactUserName || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>情况说明</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.occupyReason || '-'}</Col>
                        </Row>
                    </div>
                    <div className={less.rightspan}>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>受理人</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.acceptUserName || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>受理时间</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.acceptTime || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处理时间</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.dealTime || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处理结果</Col>
                            <Col className="reuse_value" span={span[1]}>
                                {
                                    bondData.dealResult == 1 ? '强制退还' :
                                    bondData.dealResult == 2 ? '沉没保证金' :
                                    bondData.dealResult == 3 ? '协商一致' :
                                    '-'  
                                }
                               </Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>处理金额</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.actualAmt || '-'}</Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>附件</Col>
                            <Col className="reuse_value" span={span[1]}>
                                { bondData.dealFilePath ? 
                                    <a
                                    href="javascript:void(0);"
                                    onClick={() => download(bondData.dealFileName, configs.downUrl + bondData.dealFilePath, true)}
                                    className="linkButton">{bondData.dealFileName}</a>
                                    : <span>-</span>
                                }
                            </Col>
                        </Row>
                        <Row className="reuse_row">
                            <Col className="reuse_label" span={span[0]}>备注</Col>
                            <Col className="reuse_value" span={span[1]}>{bondData.dealDescription || '-'}</Col>
                        </Row>
                    </div>
                    </div>
                </Card>
                <div className="reuse_baseTitle"></div>
                <Card className="mb20" bordered={false} title="操作日志">
                <BaseTable
                        
                        url='@/reuse/newBondDeal/queryWorkOrderLog'
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        indexkey_fixed={true}
                        baseParams={this.state.baseParams}
                        columns={this.columns} />
                </Card>
                <Card className="fixed_button">
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                                <Button  onClick={this.handleGoBack}>返回</Button>
                                {
                                    bondData.dealStatus === 0 ?  <Popconfirm placement="topRight" title="确认受理此工单吗？" onConfirm={this.handleToClick}>
                                    <Button type="primary">受理</Button>
                                   </Popconfirm> : ''
                                }
                                {
                                    bondData.dealStatus === 1 ?  <Popconfirm placement="topRight" title="确认释放本工单？释放后可再次受理，但原始记录将依然被保留" onConfirm={this.handleToRelease}>
                                    <Button style={{marginLeft:"10px"}}>释放</Button>
                                </Popconfirm> : ''  
                                }
                                {
                                   bondData.dealStatus === 1 ? 
                                   <Button onClick={this.handleToReault} type="primary">处理</Button>
                                   : ''  
                                }
                        </div>
                </Card>
                    <Modal
                    title="处理结果"
                    maskClosable={false}
                    width={650}
                    visible={this.state.detailVisible}
                    onOk={this.handleSubmit}
                    onCancel={this.closeModal}
                    >
                    <Form horizontal form={this.formRef} wrappedComponentRef={(inst)=>{this.formRef = inst}}>
                        <Row className="reuse_row">
                            <Col span={20} style={{fontWeight:"bold",fontSize:"16px",color:"#000000",marginBottom: '10px'}}>工单号:{bondData.workOrderNo}</Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                            <FormItem
                                {...detailsLayout}
                                label="处置方企业名称："
                                style={{ marginBottom: '10px' }}
                                >
                                <p className="ant-form-text" id="userName" name="userName">{bondData.saleCompanyName}</p>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <FormItem
                                    {...detailsLayout}
                                    label="用户诉求"
                                    style={{ marginBottom: '10px' }}
                                    >
                                <p className="ant-form-text" id="userSay" name="useuserSayrName">沉没 {bondData.occupyAmt || 0} 元
                                    <InputNumber
                                        className={less.nonorder}
                                        style={{width:'40px'}}
                                        disabled ={true}
                                        min={1}
                                        max={100}
                                        step={1}
                                        {...getFieldProps(`occupyAmtRatio`, {})}
                                    />%</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <FormItem
                                    {...detailsLayout}
                                    label="处理结果"
                                    >
                                    <RadioGroup
                                        {...getFieldProps("dealResult",{
                                            rules: [
                                              {
                                                required: true,
                                                message: "请选择处理结果"
                                              }
                                            ],
                                            onChange: (e) => {
                                                this.setState({
                                                    dealResult: e.target.value
                                                })
                                                let tValue = e.target.value;
                                                let bondData = this.state.bondData;
                                                if(tValue == 1){
                                                    this.setState({
                                                        inputDisabled:true,
                                                        codeVisible:false
                                                    })
                                                    this.props.form.setFieldsValue({ actualAmt: bondData.amt || 0 });
                                                    this.computeRatio(bondData.amt || 0, 1)
                                                }else if(tValue == 3){
                                                    this.setState({
                                                        inputDisabled:true,
                                                        codeVisible:true
                                                    })
                                                    this.props.form.setFieldsValue({ actualAmt: bondData.occupyAmt || 0 });
                                                    this.computeRatio(bondData.occupyAmt || 0, 1)
                                                }else if(tValue == 2){
                                                    this.setState({
                                                        inputDisabled:false,
                                                        codeVisible:true
                                                    })
                                                    this.props.form.setFieldsValue({ actualAmt: bondData.occupyAmt || 0 });
                                                    this.computeRatio(bondData.occupyAmt || 0, 1)
                                                }
                                              }
                                          })}
                                          value={dealResult}
                                          >
                                        {/* 处理结果;1.强制退还，2.沉没保证金，3.协商一致 */}
                                        <Radio key="a" value={1}>强制退还</Radio>
                                        <Radio key="b" value={3}>协商一致沉没</Radio>
                                        <Radio key="c" value={2}>强制沉没保证金</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <FormItem
                                    {...detailsLayout}
                                    label="金额："
                                    required
                                    >
                                    <InputNumber type="text" placeholder="请输入金额" 
                                        style={{width:'100px'}}
                                        min={0}
                                        max={bondData.amt}
                                        {...getFieldProps('actualAmt',{
                                            onChange: (value)=>{this.computeRatio(value, 1)}
                                        })}
                                        disabled = { inputDisabled }
                                       
                                    /><span style={{marginLeft:'10px'}}>元</span>
                                    <InputNumber
                                        className={less.nonorder}
                                        style={{width:'40px'}}
                                        disabled ={true}
                                        min={1}
                                        max={100}
                                        step={1}
                                        {...getFieldProps(`occupyAmtRatio`, {})}
                                    />%
                                </FormItem>
                             </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <FormItem
                                    {...detailsLayout}
                                    label="案情说明："
                                    >
                                    <Input type="textarea" placeholder="请输入案情说明"   
                                      {...getFieldProps('dealDescription',{
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入案情说明"
                                            }
                                        ],
                                       })}/>
                                </FormItem>
                             </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <FormItem label={"上传附件"} {...detailsLayout}>
                                    <Upload
                                        {...getFieldProps('fileList', {
                                            ...ComponentDefine.upload_.uploadForm,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请上传附件"
                                                }
                                            ],
                                        })}
                                        {...this.uploadProps}
                                    >
                                        <Button type="ghost">
                                            <Icon type="upload" /> 上传附件
                                        </Button>
                                        <span style={{marginLeft:"36px",lineHeight:"31px"}} className={less.FileTipCss}>上传doc、docx、pdf、jpg、png类型的文件</span>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                            {
                                codeVisible == true ? 
                                    <Row>
                                    <Col span={17}>
                                        <FormItem label={"手机号验证码"} {...detailsLayout}>
                                            <Input type="text" 
                                                placeholder = {this.props.phone}
                                                maxLength={6}
                                                {...getFieldProps('messageCode',{
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: "请输入手机号验证码"
                                                    }
                                                ],
                                            })}/>
                                        </FormItem>
                                    </Col>
                                    <Col span={3} className={less.codeButton} style={{lineHeight:'33px'}}>
                                        {this.state.codeButtonDisabled
                                            ?<Button type="primary" onClick={this.sendPhoneCode} disabled>{this.state.codeButtonText}</Button>
                                            :<Button type="primary" onClick={this.sendPhoneCode} >获取验证码</Button>
                                        }
                                    </Col>
                                </Row>:''
                            }
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
export default Form.create()(Del);