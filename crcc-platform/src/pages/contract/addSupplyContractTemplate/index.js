import { Popconfirm, Modal, Icon, Upload, Select, Radio, Card, Row, Col, Form, Input, Button, Table, Switch ,message ,DatePicker} from 'antd';
import api from '@/framework/axios';
import BaseAffix from '@/components/baseAffix';
import WangEditor from '@/components/gaoda/WangEditor';
import less from './index.less';
import "./addContractTemplate.css"
import yinzhang from '@/static/iconfont/yinzhang.png';
import {getUrlByParam} from "@/utils/urlUtils";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;


class addSupplyContractTemplate extends React.Component{
    state = {
        loading: false,
        unitLevel:2,
        provinceList:[],
        cityList:[],
        areaList:[],
        parentList2:[],
        parentList3:[],
        parentList4:[],
        notFoundContent:"没有更多单位了",
        contractName:"",
        signTime:"",
        signTimeStr:"",
        endTimeStr:"",
        startValue: null,
        endValue: null,
        endOpen: false,
        // 合同编号
        contractCode : "",
        contractNameOne : "铁建商城",
        contractNameTwo : "",
        contractVersion : "",
    }
    _isMounted = false;



    componentWillMount(){
        this.getEffective();
        this.getContractTemplateCodeSelfIncreasing();
        this.getEffectiveDeadline();
    };

    componentWillUnmount(){
    };


    /**
     * 获取合同编号
     *
     * @returns
     */
    getContractTemplateCodeSelfIncreasing = (p) => {
        let that = this;
        let conversionOfContractTypes = 2;
        api.ajax('GET', '!!/common/contractTemplate/contractNumber',{
            conversionOfContractTypes, ...p
        }).then((r)=>{
            if (r) {
                that.setState({
                    contractCode: r.data
                })
            } else {
                message.error("操作失败!!");
            }

        })
    };

    /**
     * 获取正生效截止日期
     *
     * @returns
     */
    getEffectiveDeadline = (p) => {
        let that = this;
        let conversionOfContractTypes = 1;
        api.ajax('GET', '!!/common/contractTemplate/listContractTemplateEffectived',{
            conversionOfContractTypes, ...p
        }).then((r)=>{
            if (r) {
                that.setState({
                    endTimeStr: moment(new Date(r.data[0].endTime)).format('YYYY-MM-DD'),
                    endValue: r.data[0].endTime
                })
            } else {
                message.error("操作失败!!");
            }

        })
    };

    /**
     * 获取正生效截止日期
     *
     * @returns
     */
    getEffective = () => {
        let that = this;
        let conversionOfContractTypes = 1;
        api.ajax('GET', '!!/common/contractTemplate/listContractTemplateEffectived',{
            conversionOfContractTypes
        }).then((r)=>{
            if (r.data.length>0) {
            } else {
                message.error("无正生效平台协议!!");
                that.props.history.push("/contract/supplyContractTemplate");
            }

        })
    };



    /**
     * 补充说明
     * @param html
     */
    editChange=(html)=>{
        this.setState({html:html})
    }

    /**
     * 获取作废以外列表查询
     * @param id 开票id
     * @returns
     */
    getCurrentBean=()=>{
        let contractCode = this.state.contractCode;
        let conversionOfContractTypes = 2;
        var obj = new Promise(function(resolve, reject){
            api.ajax('GET', '!!/common/contractTemplate/listContractTemplateEffectiveNoToVoid',{
                contractCode,conversionOfContractTypes
            }).then(r => {
                resolve(r.data);
            })
        });

        return obj;
    }

    /**
     * 发布协议
     */
    handleSubmit=()=>{
        let that = this;
        that.getCurrentBean().then(function(data) {
            that.props.form.validateFieldsAndScroll((errors, values) => {
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }
                if (that.state.loading) return false;
                if (data.length<=0) {
                    that.setState({
                        loading: true,
                    })
                    const param = {};
                    param.contractTitle = that.state.contractNameOne;
                    param.contractName = that.state.contractNameTwo;
                    param.contractVersion = values.contractVersion;
                    param.contractCode = that.state.contractCode;
                    param.companyProfile = that.state.html;
                    param.partyA = values.partyA;
                    param.partyASocialCreditCode = values.partyASocialCreditCode;
                    param.partyAAddress = values.partyAAddress;
                    param.partyABank = values.partyABank;
                    param.partyAAccount = values.partyAAccount;
                    param.partyALegalPerson = values.partyALegalPerson;
                    param.partyALegalPersonPhone = values.partyALegalPersonPhone;
                    param.partyAAuthorizer = values.partyAAuthorizer;
                    param.effectiveTimeStr = moment(new Date(that.state.startValue.getTime())).format('YYYY-MM-DD');
                    param.endTimeStr = that.state.endTimeStr;
                    param.signTimeStr = that.state.signTimeStr;
                    param.delFlag = 0;
                    param.contractClass = 2;
                    param.contractState = 0;

                    console.log("param==========", param);
                    api.ajax("POST", "!!/common/contractTemplate/insertContractTemplate", {
                        ...param
                    }).then((r) => {
                        that.setState({
                            loading: false
                        })
                        message.success("发布成功");
                        that.props.history.push("/contract/supplyContractTemplate");
                    }).catch((r) => {
                        that.setState({
                            loading: false
                        })
                        message.error(r.msg);
                    })
                } else {
                    message.error("合同编号重复");
                    that.getContractTemplateCodeSelfIncreasing();
                    that.props.form.resetFields(["effectiveTime","endTime"]);
                    that.getEffectiveDeadline();
                }
            })
        })
    }

    /**
     * 预览
     */
    preview=()=>{
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if (this.state.loading) return false;
            this.setState({
                loading: true,
            })
            const param = {};
            param.contractTitle = this.state.contractNameOne
            param.contractName = this.state.contractNameTwo;
            param.contractVersion = values.contractVersion;
            param.contractCode = this.state.contractCode;
            param.companyProfile = this.state.html;
            param.partyA = values.partyA;
            param.partyASocialCreditCode = values.partyASocialCreditCode;
            param.partyAAddress = values.partyAAddress;
            param.partyABank = values.partyABank;
            param.partyAAccount = values.partyAAccount;
            param.partyALegalPerson = values.partyALegalPerson;
            param.partyALegalPersonPhone = values.partyALegalPersonPhone;
            param.partyAAuthorizer = values.partyAAuthorizer;
            param.effectiveTimeStr = moment(new Date(this.state.startValue.getTime())).format('YYYY-MM-DD');
            param.endTimeStr = this.state.endTimeStr;
            param.signTimeStr = this.state.signTimeStr;
            param.delFlag = 0;
            param.contractClass = 2;
            param.contractState = 0;
            param.type = 1;//预览

            console.log("param==========", param);
            api.ajax("POST", "!!/common/contractTemplate/insertContractTemplate", {
                ...param
            }).then((r) => {
                this.setState({
                    loading: false
                })
                if(r){
                    window.open(SystemConfig.systemConfigPath.dfsPathUrl(getUrlByParam(r.data)));
                }
            }).catch((r) => {
                this.setState({
                    loading: false
                })
                message.error(r.msg);
            })
        })
    }

    /**
     * 协议名改变
     */
    contractNameOneChange=(s,a,t)=>{
        let that = this;
        that.setState({
            contractNameOne : s.currentTarget.value,
        })
    }

    /**
     * 协议名改变
     */
    contractNameTwoChange=(s,a,t)=>{
        let that = this;
        that.setState({
            contractNameTwo : s.currentTarget.value,
        })
    }

    /**
     * 协议名改变
     */
    contractVersionChange=(s,a,t)=>{
        let that = this;
        that.setState({
            contractVersion : s.currentTarget.value,
        })
    }

    disabledStartDate=(startValue)=> {
        let now = new Date();
        now.setDate(now.getDate()-1);
        if (!startValue || !this.state.endValue) {
            return startValue.getTime() < now;
        }
        let endValue = new Date(this.state.endValue);
        endValue.setDate(endValue.getDate()+1)
        let endValueTime = endValue.getTime() - endValue.getTime() % 86400000
        let nowValueTime = now.getTime() - now.getTime() % 86400000
        let startValueTime = startValue.getTime() - startValue.getTime() % 86400000
        return endValueTime < startValueTime || startValueTime <= nowValueTime;
    };

    onStartChange=(value)=> {
        if(value){
            let signTime = new Date(value.getTime());
            signTime.setDate(signTime.getDate()-15);
            let signTimeStr = moment(signTime).format('YYYY-MM-DD');

            this.setState({
                startValue : value,
                signTimeStr : signTimeStr,
                signTime : signTime,
            })
        }
    }


    render(){
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        return(
            <div>
                <Card bordered={false} title="发布补充协议">
                <Form>
                    <Card bordered={false} className="addContractTemplate_main margin_top10">

                        <span className={less.contractName}>{this.state.contractNameOne}{this.state.contractNameTwo}</span>
                        <span className={less.contractName} style={{marginLeft:"24px"}}>{this.state.contractVersion}</span>
                        <Row gutter={16} style={{marginTop: "192px",height:"80px"}}>
                            <Col span="8" key={'contractNameOne'} className="sdfsdf">
                                <FormItem >
                                    <Input
                                        maxLength={50}
                                        placeholder={'请输入平台名称'}
                                        {...getFieldProps('contractNameOne', {
                                            rules: [
                                                { required: true, message: '请输入平台名称' },
                                            ],
                                            initialValue: '铁建商城' ,
                                            onChange:this.contractNameOneChange,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="12" key={'contractNameTwo'} className="contractNameTwo">
                                <FormItem >
                                    <Input
                                        maxLength={100}
                                        placeholder={'请输入协议名'}
                                        {...getFieldProps('contractNameTwo', {
                                            rules: [
                                                { required: true, message: '请输入协议名' },
                                            ],
                                            onChange:this.contractNameTwoChange,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="8" key={'contractVersion'} className="contractVersionClass">
                                <FormItem >
                                    <Input
                                        maxLength={32}
                                        placeholder={'请输入合同版本号'}
                                        {...getFieldProps('contractVersion', {
                                            rules: [
                                                { required: true, message: '请输入合同版本号' },
                                            ],
                                            onChange:this.contractVersionChange,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <p className={less.contractCode}>合同编号：{this.state.contractCode}</p>
                    </Card>
                    <Card bordered={false} className="addContractTemplate_main1">
                            <p style={{paddingBottom:"9px"}}>协议说明</p>
                            <WangEditor  initHtml={this.state.html} onChange={this.editChange}></WangEditor>
                    </Card>
                    <Card bordered={false} className="addContractTemplate_main3 ">
                        <Row gutter={16} style={{marginTop: "53px"}}>
                            <Col span="24" key={'partyA'}>
                                <FormItem label={'甲方公司名'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={60}
                                        placeholder={'请输入甲方公司名'}
                                        {...getFieldProps('partyA', {
                                            rules: [
                                                { required: true, message: '请输入甲方公司名' },
                                            ],
                                             initialValue: '中铁建金服科技（天津）有限公司' ,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'partyASocialCreditCode'}>
                                <FormItem label={'统一社会信用代码'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={32}
                                        placeholder={'请输入统一社会信用代码'}
                                        {...getFieldProps('partyASocialCreditCode', {
                                            rules: [
                                                {required: true,message: "请输入统一社会信用代码"},
                                                {pattern: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g , message: '请输入正确的统一社会信用代码' }
                                            ],
                                            initialValue: '91120118MA06D7YC71' ,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'partyAAddress'}>
                                <FormItem label={'联系地址'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={100}
                                        placeholder={'请输入联系地址'}
                                        {...getFieldProps('partyAAddress', {
                                            rules: [
                                                { required: true, message: '请输入联系地址' },
                                            ],
                                            initialValue: '天津市自贸试验区（东疆保税港区区）乐山道200号铭海中心2号楼-5、6-603' ,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'partyABank'}>
                                <FormItem label={'开户行'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={50}
                                        placeholder={'请输入开户行'}
                                        {...getFieldProps('partyABank', {
                                            rules: [
                                                { required: true, message: '请输入开户行' },
                                            ],
                                            initialValue: '平安银行天津分行营业部' ,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'partyAAccount'}>
                                <FormItem label={'账号'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={50}
                                        placeholder={'请输入账号'}
                                        {...getFieldProps('partyAAccount', {
                                            rules: [
                                                {required: true,message: "请输入账号"},
                                                {pattern: /^([1-9]{1})(\d{9,29})$/ , message: '请输入正确的账号' }
                                            ],
                                            initialValue: '15000091380762' ,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'partyALegalPerson'}>
                                <FormItem label={'法定代表人'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={20}
                                        placeholder={'请输入法定代表人'}
                                        {...getFieldProps('partyALegalPerson', {
                                            rules: [
                                                { required: true, message: '请输入法定代表人' },
                                            ],
                                            initialValue: '徐政志' ,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'partyALegalPersonPhone'}>
                                <FormItem label={'联系方式'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={30}
                                           {...getFieldProps('partyALegalPersonPhone',
                                               {
                                                   rules: [
                                                       {required: true,message: "请输入联系方式"},
                                                       {pattern: /^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/ , message: '请输入正确的手机号' }
                                                   ],
                                                   initialValue: '400-607-2808' ,
                                               })}
                                           placeholder="请输入联系方式"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'partyAAuthorizer'}>
                                <FormItem label={'授权代理人'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <Input
                                        maxLength={20}
                                        placeholder={'请输入授权代理人'}
                                        {...getFieldProps('partyAAuthorizer', {
                                            rules: [
                                                { required: true, message: '请输入授权代理人' },
                                            ],
                                            initialValue: '徐靖鹏、张曦' ,
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" className={less.colqian}>
                                <FormItem label={'签章处'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <img src={yinzhang}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24">
                                <FormItem label={'签订日期'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <p ><span style={{marginLeft:"40px"}}>年</span><span style={{marginLeft:"40px"}}>月</span><span style={{marginLeft:"40px"}}>日</span></p>
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card bordered={false} className="addContractTemplate_main4">
                        <Row gutter={16}>
                            <Col span="24" style={{marginTop:"48px"}}>
                                <FormItem label={'预计可签订日期'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 14 }}
                                >
                                    <p style={{marginLeft: "7px"}} >{this.state.signTimeStr}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'effectiveTime'}>
                                <FormItem label={'合同生效日期'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 17 }}
                                >
                                    <DatePicker
                                        disabledDate={this.disabledStartDate.bind(this)}
                                        {...getFieldProps('effectiveTime',
                                            {
                                                rules: [
                                                    { required: true, message: '请选择合同生效日期' },
                                                ],
                                                onChange: this.onStartChange.bind(this),
                                            })} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span="24" key={'endTime'}>
                                <FormItem label={'合同截止日期'}
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 17 }}
                                >
                                    <DatePicker
                                        disabled
                                        {...getFieldProps('endTime',
                                            {
                                                rules: [
                                                    { required: true, message: '请选择合同截止日期' },
                                                ],
                                                initialValue:this.state.endTimeStr
                                            })} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <BaseAffix>
                        <Popconfirm title={"确认发布吗?"} onConfirm={this.handleSubmit}>
                            <Button style={{marginRight: "10px"}} type="primary" loading={this.state.loading}>发布协议</Button>
                        </Popconfirm>
                        <Button style={{backgroundColor: "#FFF",marginRight: "10px"}} loading={this.state.loading} onClick={this.preview}>预 览</Button>
                        <Button style={{backgroundColor: "#FFF",marginRight: "10px"}} onClick={()=>{
                            this.props.history.push("/contract/supplyContractTemplate");
                        }}>返 回</Button>
                    </BaseAffix>
                </Form>
                </Card>
            </div>
        )
    }
}
export default Form.create()(addSupplyContractTemplate)




