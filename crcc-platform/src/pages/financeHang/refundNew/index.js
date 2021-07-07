import { Card, Row, Col, Button, Table, Switch, message, Tabs, Popconfirm, Form, Input, Modal, Upload, Icon } from 'antd';
import api from '@/framework/axios';
import {getDetailsLabel, detailsLayout} from  '@/components/gaoda/Details';
import {NumberFormat} from "@/components/gaoda/Format";
import BaseDetails from '@/components/baseDetails';
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
        userInfo: {},
        upLoadStatus: false,
        approvalStatus:{},
        visible2: false,
         //发送验证码按钮状态
         phoneStatus: false,
         //验证码倒计时
        countDown: 60,
        phone:'',
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        this.getPhone();
        api.ajax("GET","@/common/phoneMsg/getUserInfo").then((r) => {
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

    handleCancel1=(e)=> {
        console.log(e);
        this.setState({
          visible2: false,
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
            console.log('gg',time);
        }, 1000)
        that.setState({
            interval: interval
        })
    }

    // financeHangDetail=(uuids)=>{
    //     return new Promise((resolve, reject)=> {
    //         api.ajax("GET", "!!/financial/financeHang/getFinanceHang", {
    //             uuids:uuids
    //         }).then((r) => {
    //             resolve(r);
    //         })
    //     })
    // }
    handleOk() {
        let _this = this;
      this.props.form.validateFields((err,values)=>{

          if (values.code == null) {
              message.error("请输入验证码")
              return;  
          }
          
          if (err) return;
          const { dataSource } = this.state
          const param = {...values}
          if(this.props.getApprovalStatus.approval == 0){
              this.props.getApprovalStatus.approval = 2
          }
          param.financeHangUuids = this.props.financeHang.uuids
          param.financeHangId = this.props.financeHang.financeId
          param.settlementUuids = this.props.selectedRow.uuids
          param.workOrdersId = this.props.financeHang.workOrdersId
          param.isTrue = this.props.getApprovalStatus.approval
          param.remark = values.remark


    axios.get("@/contend/phone/msg/provingPhoneMsg", {
      params: { phone: this.state.phone, code: values.code }
    }).then(r => {
      if (r.data == true) {
        this.setState({
          loading: true
        }, () => {
            api.ajax("GET", "@/settlement/pay/refund", {
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
                    _this.setState({
                        phoneStatus:false
                    })
                    setTimeout(()=>{
                        window.close();
                    },500)
                    _this.onCancel();
                    // _this.props.history.push("/financialCenter/financeHangNew");
                }
            }).catch((err) => {
                _this.setState({
                    loading: false,
                    phoneStatus:false
                })
                if(err.code == 40000){
                    message.error(err.msg);
                    _this.handleCancel1()
                    _this.onCancel();
                }
            })
        })
      }
      else {
        message.error(r.msg)
        _this.setState({
            phoneStatus:false
        })
      }
    }).catch(err => {
      
    });
      

      })
      
    }

    onRefundOk = ()=>{
        //_this.financeHangDetail(_this.props.financeHang.uuids).then(function(r){
       //     if(r.data.accountState != 2 || r.data.handleState != 0){
        this.props.form.validateFieldsAndScroll((errors, values) => {

            api.ajax("GET", "@/platform/config/getApprovalStatus").then((r) => {
                this.setState({
                    approvalStatus: r.data
                })
            }).then((r=>{
                if(this.state.approvalStatus.approval == 0){
                    this.setState({
                        visible2:true
                    })
                }else{
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
                    if(this.props.getApprovalStatus.approval == 0){
                        this.props.getApprovalStatus.approval = 2
                    }
                    param.financeHangUuids = this.props.financeHang.uuids
                    param.financeHangId = this.props.financeHang.financeId
                    param.settlementUuids = this.props.selectedRow.uuids
                    param.workOrdersId = this.props.financeHang.workOrdersId
                    param.isTrue = this.props.getApprovalStatus.approval
                    param.remark = values.remark
                    if(this.state.fileName){
                        param.fileName = this.state.fileName
                      }
                      if(this.state.filePath){
                        let filePath = this.state.filePath;
                        if(filePath.indexOf('?') != -1){
                          filePath = filePath.split("?")[0];
                          param.filePath = filePath
                        }
                      }
                    // if(param.fileList&&1 == param.fileList.length){
                    //     param.filePath = param.fileList[0].response.data;
                    //     param.fileName = param.fileList[0].name;
                    //     param.fileList = undefined;
                    // }
        
                    confirm({
                        title: '提示',
                        content: '由于管理员已经开启了挂账复核，本挂账将递交审核员进行审核，审核通过后将自动进行处理。',
                        onOk() {
                            api.ajax("GET", "@/settlement/pay/refund", {
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
                                    setTimeout(()=>{
                                        window.close();
                                    },500)
                                   
                                    // _this.onCancel();
                                    // _this.props.history.push("/financialCenter/financeHangNew");
                                }
                            }).catch((err) => {
                                _this.setState({
                                    loading: false
                                })
                                if(err.code == 40000){
                                    message.error(err.msg)
                                }
                            })
                        },
                        onCancel() {
                            _this.setState({
                                loading: false
                            })
                        }
                    });
                }
            }))
            /**/
        })
    }
    getPhone = () =>{
        api.ajax("GET", "@/platform/financehang/checkPhone", {
        }
        ).then((r) => {
            if(r.code == 200){
                this.setState({
                    phone:r.data
                })
            }
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
     //来款时间
     acctDate = ()=>{
        let result = undefined;
        let acctDate = this.props.selectedRow.acctDate;
        if(acctDate&&8 == acctDate.length){
            result = acctDate.substring(0,4)+"-"+acctDate.substring(4,6)+"-"+acctDate.substring(6,acctDate.length);
        }else{
            result = acctDate;
        }
        return result;
    }
    sendMobileCode() {
        console.log("ssssss", this.state.visible2)
        this.setState({
          phoneStatus: true
        }, () => {
          let tempNum = 59;
          this.phoneTimer = setInterval(() => {
            if (tempNum <= 0) {
              this.setState({
                phoneStatus: false
              });
              clearInterval(this.phoneTimer);
    
            }
            this.setState({
              countDown: tempNum
            })
            tempNum -= 1
          }, 1000);
        })
        axios.get("@/settlement/pay/sendCodes", {
          params: { phone: this.state.phone }
        }).then(r => {
          if (r.code == 200) {
            message.success('发送成功')
          }
        }).catch(err => {
          message.error(err.msg)
        });
    
      }
    render() {
        const { getFieldProps } = this.props.form;
        const phoneStr = this.state.phone ? this.state.phone.slice(0, 3) + '***' + this.state.phone.slice( this.state.phone.length - 4) : '000***0000';
        const uploadProps = {
            name: 'file',
            action: SystemConfig.systemConfigPath.axiosUrl('/common/upload/file?maxSize=5'),
            accept: 'image/jpeg,image/jpg,image/png,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf',
            multiple: true,
            onChange:(info) => {
              if (info.fileList.length <= 0) {
                this.setState({
                  upLoadStatus: false
                })
              }
              if (!info.file.response) {
                return;
              }
              if (info.file.status == 'done') {
                message.success('上传成功');
                this.setState({
                  fileName: info.file.name,
                  filePath: info.file.response.data,
                  upLoadStatus: true
                })
              } else {
                message.success(info.file.response && info.file.response.msg);
              }
            },
          };
        return(
            <Modal
                title = "退款"
                visible = {this.props.visible}
                width = "1050px"
                onOk = {this.onRefundOk}
                onCancel = {this.onCancel}
                wrapClassName = {less.refund+" refund"}
            >
                <div style={{padding:"24px"}}>
                <Row style={{marginLeft:'36px'}}>
                        {/* <div className={less.icon_img}>已选中</div> */}
                        <Col span={9}>
                            <Row className={less.rightCol}>
                                <span className={less.label}>采购公司：</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>
                                <span className={less.text}>{this.props.selectedRow.buyerCompanyName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <span className={less.label}>采购项目：</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>
                                <span className={less.text}>{this.props.selectedRow.organizationName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <BaseDetails title="采购账户">
                                {this.props.selectedRow.companyName}
                                </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="付款人">
                            {this.props.selectedRow.buyerUsername}&nbsp;&nbsp;({this.props.selectedRow.userNo})&nbsp;&nbsp;{this.props.selectedRow.buyerPhone?this.props.selectedRow.buyerPhone:'-'}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="供应商">
                            {this.props.selectedRow.sellerCompanyName}
                            </BaseDetails>
                            </Row>
                        </Col>
                        <Col span={3}>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <p>付款单金额：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>{this.props.selectedRow.amount?<NumberFormat value={this.props.selectedRow.amount}/>:"-"}</p>
                            </Row>
                            <Row>
                                <p>来款附言：</p>
                                <span className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>{this.props.selectedRow.payCode?this.props.selectedRow.payCode:"-"}</span>
                                <span style={{color:"#39c7ff",marginLeft:'44px'}} onClick={this.showModal}></span>
                                <Modal title="历史来款" visible={this.state.visible} 
                                 onCancel={this.handleCancel} footer=''>
                                    <Row>
                        <Col span={8} >
                            <Row className={less.rightCol}>
                                <span className={less.label}>来款账户</span>
                            </Row>
                            <Row className={less.rightCol} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>
                                <span className={less.text}>{this.props.selectedRow.inAcctIdName}</span>
                            </Row>
                            <Row className={less.rightCol}>
                                <BaseDetails title="来款账号">
                                {this.props.selectedRow.inAcctId}
                                </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="流水号">
                                {this.props.selectedRow.serialNumber}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="来款时间">
                                {this.acctDate()}
                            </BaseDetails>
                            </Row>
                            <Row className={less.rightCol}>
                            <BaseDetails title="来款银行">
                                {this.props.selectedRow.bankName}
                            </BaseDetails>
                            </Row>
                        </Col>
                        <Col span={5}>
                            <p style={{width:'2px',height:'300px',backgroundColor:'#ccc',marginLeft:'150px'}}></p>
                        </Col>
                        <Col span={11}>
                            <Row>
                                <p>来款金额（元）：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>{this.props.selectedRow.inAmount?<NumberFormat value={this.props.selectedRow.inAmount}/>:"-"}</p>
                            </Row>
                            <Row>
                                <p>来款附言：</p>
                                <p className={less.text} style={{color:"rgba(0,0,0,0.85)",fontWeight: "bold",fontSize:"20",paddingBottom:"16px"}}>{this.props.selectedRow.note?this.props.selectedRow.note:"-"}</p>
                            </Row>
                        </Col> 
                    </Row>
                                </Modal>
                            </Row>
                            <Row>
                                <BaseDetails title="结算单号">
                                {this.props.selectedRow.settlementNo}
                                <span style={{color:"#39c7ff",marginLeft:'44px'}}></span>
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="结算金额">
                                {this.props.selectedRow.totalAmount?<NumberFormat value={this.props.selectedRow.totalAmount}/>:'-'}
                                </BaseDetails>
                            </Row>
                            <Row>
                                <BaseDetails title="未付金额">
                                {this.props.selectedRow.restAmount?<NumberFormat value={this.props.selectedRow.restAmount}/>:'-'}
                                </BaseDetails>
                            </Row>
                        </Col>
                    </Row>
                    <div style={{marginLeft:'-27px'}}>
                    <Row>
                        <Col span={24}>
                            <FormItem className={less.upload_item} label={<span>上传附件</span>} labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
                  <Upload {...uploadProps}
                  >
                    <Button type="ghost" disabled={this.state.upLoadStatus}>
                      <Icon type="upload" /> 点击上传
                  </Button>
                  </Upload>
                  <span className={less.ant_form_text}>请上传格式为doc、xlsx、pdf、jpg、png且体积小于5MB的文件</span>

                </FormItem>
                        </Col>
                        
                    </Row>
                    </div>
                    <Row>
                    <Col span={24}>
                            <FormItem label="备注信息" {...detailsLayout}>
                                <Input maxLength={200} type="textarea" rows={4} 
                                {...getFieldProps('remark',{
                                    rules: [
                                        {
                                            required: true,
                                            message: "请填写备注信息"
                                        }
                                    ],
                                })}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                <Modal title="退款" visible={this.state.visible2}
                    onOk={this.handleOk.bind(this)} onCancel={this.handleCancel1}
                    width={480}
                    >
                    {/* <FormItem className={less.mobile_code} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>手机验证码</span>} > */}
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={<span style={{ width: '70px' }}>手机验证码</span>} >
                    <Input
                        style={{ width: '236px' }}
                        {...getFieldProps('code', {
                            rules: [
                                { required: this.state.visible2, message: '请输入手机验证码' },
                                // { validator: this.provingPhoneMsg, validateTrigger: 'onBlur' },
                            ],
                        })}
                        placeholder={phoneStr} />
                    <Button type="primary" size="large" onClick={this.sendMobileCode.bind(this)} disabled={this.state.phoneStatus}>
                        {
                        !this.state.phoneStatus ? '获取验证码' : this.state.countDown
                        }
                    </Button>
                    </FormItem>
                </Modal>
            </Modal>
        )
    }
}

export default Form.create()(refund);