import { Card, Row, Col, Button, Table, Switch, message, Tabs, Popconfirm, Form, Input, Modal, Upload, Icon } from 'antd';
import api from '@/framework/axios';
import {getDetailsLabel, detailsLayout} from  '@/components/gaoda/Details';
import {NumberFormat} from "@/components/gaoda/Format";
import {exportFile} from '@/utils/urlUtils';
import {getUrlByParam, getQueryString} from '@/utils/urlUtils';
import imgRefund from '@/static/iconfont/refund.png';
import moment from 'moment';
import less from './index.less';
import './index.css';

const confirm = Modal.confirm;
const FormItem = Form.Item;
class refund extends React.Component{
    state = {
        codeButtonDisabled: false,
        codeButtonText: "验证码(60s)",
        interval:null,
        loading: false,
        userInfo: {}
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        api.ajax("GET","!!/common/phoneMsg/getUserInfo").then((r) => {
            console.log(r)
            this.setState({
                userInfo:r.data,
            })
        },(r)=>{

        });
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentWillReceiveProps(props){
        //打开
        if(!this.props.visible&&props.visible){
            this.setState({
                codeButtonDisabled: false,
                codeButtonText: "验证码(60s)",
                interval:null,
                loading: false,
            })
        }
        //关闭
        if(this.props.visible&&!props.visible){

        }
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

    //发送手机验证码
    sendPhoneCode = ()=>{
        this.intervalTime()
        //发送验证码
        api.ajax("GET","!!/financial/financeHang/getRefundCode").then((r) => {
            message.success("短信验证码已发送");
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

    financeHangDetail=(uuids)=>{
        return new Promise((resolve, reject)=> {
            api.ajax("GET", "!!/financial/financeHang/getFinanceHang", {
                uuids:uuids
            }).then((r) => {
                resolve(r);
            })
        })
    }

    onRefundOk = ()=>{
        //_this.financeHangDetail(_this.props.financeHang.uuids).then(function(r){
       //     if(r.data.accountState != 2 || r.data.handleState != 0){
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            let _this = this;
            if (this.state.loading) return false;
            this.setState({
                loading: true,
            })
            const param = {...values}
            param.financeHangUuids = this.props.financeHang.uuids
            param.orderUuids = this.props.selectedRow.uuids
            if(param.fileList&&1 == param.fileList.length){
                param.filePath = param.fileList[0].response.data;
                param.fileName = param.fileList[0].name;
                param.fileList = undefined;
            }

            confirm({
                title: '退款',
                content: '是否确认退款',
                onOk() {
                    api.ajax("GET", "!!/financial/financeHang/refund", {
                        ...param
                    }).then((r) => {
                        if (!_this._isMounted) {
                            return;
                        }
                        _this.setState({
                            loading: false
                        })
                        if(r){
                            message.success("退款成功");
                            _this.onCancel();
                            _this.props.history.push("/financialCenter/financeHang");
                        }
                    }).catch((r) => {
                        _this.setState({
                            loading: false
                        })
                        message.error(r.msg)
                    })
                },
                onCancel() {
                    _this.setState({
                        loading: false
                    })
                }
            });
            /**/
        })
    }

    //关闭模态框
    onCancel = ()=>{
        let interval = this.state.interval;
        if(interval){
            clearInterval(interval);
        }
        this.props.onCancel();
    }

    render() {
        const { getFieldProps } = this.props.form;

        return(
            <Modal
                title = "退款"
                visible = {this.props.visible}
                width = "935px"
                onOk = {this.onRefundOk}
                onCancel = {this.onCancel}
                wrapClassName = {less.refund+" refund"}
            >
                <div style={{padding:"24px"}}>
                    <Row  className={less.title}>
                        <Col span={10} className={less.imgTitle}>
                            <img src={imgRefund}/>
                            <Row className={less.label}>
                                采购单位
                            </Row>
                            <Row className={less.text}>
                                {this.props.selectedRow.buyerCompanyName}
                            </Row>
                        </Col>
                        <Col span={10}>
                            <Row className={less.label}>
                                采购部门
                            </Row>
                            <Row className={less.text}>
                                {this.props.selectedRow.organizationName}
                            </Row>
                        </Col>
                        <Col span={4}>
                            <Row className={less.label}>
                                退款金额
                            </Row>
                            <Row className={less.text}>
                                {this.props.financeHang.inAmount?<span>¥ <NumberFormat value={this.props.financeHang.inAmount}/></span>:null}
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10} className={less.mb0}>
                            <FormItem label={"下单人"} {...detailsLayout}>
                                <p>{this.props.selectedRow.username}</p>
                            </FormItem>
                        </Col>
                        <Col span={10} className={less.mb0}>
                            <FormItem label={"来款账户名"} {...detailsLayout}>
                                <p>{this.props.financeHang.inAcctIdName}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10} className={less.mb0}>
                            <FormItem label={"下单日期"} {...detailsLayout}>
                                <p>{this.props.selectedRow.createTime?moment(this.props.selectedRow.createTime).format("YYYY-MM-DD HH:mm:ss"):null}</p>
                            </FormItem>
                        </Col>
                        <Col span={10} className={less.mb0}>
                            <FormItem label={"来款账号"} {...detailsLayout}>
                                <p>{this.props.financeHang.inAcctId}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <FormItem label={"联系电话"} {...detailsLayout}>
                                <p>{this.props.selectedRow.phone}</p>
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label={"来款金额"} {...detailsLayout}>
                                <p>{this.props.financeHang.inAmount?<span>¥ <NumberFormat value={this.props.financeHang.inAmount}/></span>:null}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={less.mb0}>
                            <FormItem label={"订单金额"} {...detailsLayout}>
                                <p>{this.props.selectedRow.totalPrice?<span>¥ <NumberFormat value={this.props.selectedRow.totalPrice}/></span>:null}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label={"订单编号"} {...detailsLayout}>
                                <p>{this.props.selectedRow.orderNo}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
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
                    <Row>
                        <Col span={24}>
                            <FormItem label={"备注信息"} {...detailsLayout}>
                                <Input maxLength={200} type="textarea" rows={4} {...getFieldProps('remark',{
                                    rules: [
                                        {
                                            required: true,
                                            message: "请填写备注信息"
                                        }
                                    ],
                                })}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label={"手机号码"} {...detailsLayout}>
                                <Input type="text" disabled value={this.props.financeHang.ledgerPhone}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={21}>
                            <FormItem label={"短信验证"} {...detailsLayout}>
                                <Input type="text" {...getFieldProps('code',{
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入验证码"
                                        }
                                    ],
                                })}/>
                            </FormItem>
                        </Col>
                        <Col span={3} className={less.codeButton}>
                            {this.state.codeButtonDisabled
                                ?<Button type="primary" onClick={this.sendPhoneCode} disabled>{this.state.codeButtonText}</Button>
                                :<Button type="primary" onClick={this.sendPhoneCode} >获取验证码</Button>
                            }
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default Form.create()(refund);