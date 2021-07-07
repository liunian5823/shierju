import { DatePicker, Tabs, Steps, Popconfirm, Modal, Icon, Upload, Select, Radio, Card, Row, Col, Form, Input, Button, Table, Switch ,message} from 'antd';
import Success from '@/static/iconfont/success.png';
import less from './index.less';
import api from '@/framework/axios';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const Step = Steps.Step;
const array = Array.apply(null, Array(3));
const steps = array.map((item, i) => ({
    title: `步骤${i + 1}`,
}));

class changeAdminModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current:0,//步骤初始化
            remarksLength:0,
            interval:"",

            sendCodeButton:true,//默认显示获取验证码标签
            sendCodeButtonHTML:"获取验证码",//手机验证码发送按钮
            imag:"",
            randomString:"",//clientId 客户端ID

            sendCodeButton2:true,//默认显示获取验证码标签
            sendCodeButtonHTML2:"获取验证码",//手机验证码发送按钮
            imag2:"",
            randomString2:"",//clientId 客户端ID
        }
    }

    componentWillReceiveProps (nextProps){
        //每次打开模态框触发
        if(!this.props.visible&&nextProps.visible){
            this.setState({
                current:0,
            })
            this.props.form.resetFields();
            // this.reloadImg();
            // this.props.form.setFieldsValue({
            //     stepPhone:this.props.phone
            // });
        }
    }

    //变更管理员保存
    next=()=>{
        let that = this;
        if(this.state.current == 0){
            this.props.form.validateFields(['stepPhone','adminUsername'],function(errors, values){
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }else{
                    api.ajax("POST", "!!/purchaser/purchaser/oldManagement",{
                            companyId:that.props.id,
                            phone:that.props.form.getFieldValue('stepPhone'),
                            username:that.props.form.getFieldValue('adminUsername'),
                    }).then((r) => {
                        that.reloadImg2();
                        that.setState({
                            current:1,
                        });
                    },(r)=>{
                        message.error(r.msg);
                    })
                }
            });
        }
        if(this.state.current == 1){
            this.props.form.validateFields(['newName','cardId','phone','picture','code','email','address','fileList'],function(errors, values){
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }else{
                    that.save();
                    return;
                }
            });
        }
        if(this.state.current == 2){
            //关闭模态框,刷新采购商详情
            this.props.parent.props.history.push("/purchaser/detailPurchaser/"+this.props.parent.props.match.params.uuids+"/"+this.props.parent.props.match.params.companyId);
        }
    }

    //初始化文件上传
    uploadProps = {
        ...ComponentDefine.upload_.uploadProps,
        onChange:(info)=> {
            let fileList = info.fileList;
            if (info.file.status === 'done') {
                let isSuccess = false;
                if(info.file.response.code=='000000'){//SystemConfig.constant.responseSuccessCode
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

    /**
     * 变更管理员-保存
     */
    save=()=>{
        let that = this;
        let compayId = that.props.id;
        let adminId = that.props.createrUser;
        let files = that.props.form.getFieldValue('fileList');
        let confirmFilePath = files[0].response.data;
        let newPhone = that.props.form.getFieldValue('phone');
        let newPhoneCode = that.props.form.getFieldValue('code');
        let citizenCode = that.props.form.getFieldValue('cardId');
        let username = that.props.form.getFieldValue('newName');
        let email = that.props.form.getFieldValue('email');
        let userType = "4";
        let gender = that.props.form.getFieldValue('sex');
        let remarks = that.props.form.getFieldValue('remark');
        if(remarks == undefined){
            remarks = "";
        }
        let address = that.props.form.getFieldValue('address');
        if(address == undefined){
            address = "";
        }
        api.ajax("POST", "!!/purchaser/purchaser/changeAdmin", {
            companyId:compayId,
            confirmFilePath:confirmFilePath,
            newPhone:newPhone,
            newPhoneCode:newPhoneCode,
            citizenCode:citizenCode,
            username:username,
            email:email,
            userType:userType,
            gender:gender,
            remarks:remarks,
            address:address,
            adminId:adminId
        }).then(r => {
            if(r != null){
                that.setState({
                    current:2,
                });
            }
        },(r)=>{
            message.error(r.msg);
        })
    }

    //64位随机字符串
    randomString = (len)=> {
        len = len || 64;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    /**
     * 加载图片验证
     */
    reloadImg=()=>{
        let rs = this.randomString();
        let imgurl = SystemConfig.systemConfigPath.axiosUrlGaoda(`/purchaser/adminInformationController/imageServelt?clientId=${rs}`);
        this.setState({
            imag:imgurl,
            randomString:rs
        })
    }

    /**
     * 加载图片验证(第二步的图片)
     */
    reloadImg2=()=>{
        let rs = this.randomString();
        let imgurl = SystemConfig.systemConfigPath.axiosUrlGaoda(`/purchaser/adminInformationController/imageServelt?clientId=${rs}`);
        this.setState({
            imag2:imgurl,
            randomString2:rs
        })
    }

    //发送手机验证码:第一步
    sendPhoneCode = ()=>{
        let that = this;
        this.props.form.validateFields(['stepPhone','stepPicture'],function(errors, values){
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                let stepPhone = that.props.form.getFieldValue('stepPhone');
                let stepPicture = that.props.form.getFieldValue('stepPicture');
                let clientId = that.state.randomString;
                const params = {};
                params.phone = stepPhone;
                params.type = "2";
                params.captchaCode = stepPicture;
                params.clientId = clientId;
                api.ajax("GET","!!/purchaser/adminInformationController/sendSmsCode", {
                    ...params
                }).then(r => {//成功
                    message.success('短信发送成功');
                    //获取验证码倒计时
                    let intervalTime = 60;
                    let interval = setInterval(function(){
                        let time = intervalTime;
                        if(time == 1){
                            that.setState({
                                sendCodeButton : true,
                                sendCodeButtonHTML : "获取验证码"
                            })
                            clearInterval(interval);
                        }else{
                            intervalTime -= 1;
                            that.setState({
                                sendCodeButton : false,
                                sendCodeButtonHTML : "验证码("+ intervalTime + ")"
                            })
                        }
                        console.log(time);
                    }, 1000)
                    that.setState({
                        interval:interval
                    })
                },(r)=>{//失败
                    message.error(r.msg)
                });
            }

        });
    };

    //检查新号码是否存在,若存在则发送新管理员手机验证码
    sendPhoneCode2 = ()=>{
        let that = this;
        this.props.form.validateFields(['phone','picture'],function(errors, values){
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                let stepPhone = that.props.form.getFieldValue('phone');
                let stepPicture = that.props.form.getFieldValue('picture');
                let clientId = that.state.randomString2;
                const params = {};
                params.companyId = that.props.id;//公司id
                params.phone = stepPhone;//电话
                params.captchaCode = stepPicture;//图片验证码
                params.clientId = clientId;//图片验证码64位随机字符串
                api.ajax("GET","!!/purchaser/purchaser/checkAdminPhoneAndExist", {
                    ...params
                }).then(r => {//成功
                    //获取验证码倒计时
                    let intervalTime = 60;
                    let interval = setInterval(function () {
                        let time = intervalTime;
                        if (time == 1) {
                            that.setState({
                                sendCodeButton2: true,
                                sendCodeButtonHTML2: "获取验证码"
                            })
                            clearInterval(interval);
                        } else {
                            intervalTime -= 1;
                            that.setState({
                                sendCodeButton2: false,
                                sendCodeButtonHTML2: "验证码(" + intervalTime + ")"
                            })
                        }
                        console.log(time);
                    }, 1000)
                    that.setState({
                        interval: interval
                    })
                    message.success('短信发送成功');
                },(r)=>{//失败
                    message.error(r.msg);
                });
            }
        });
    };

    /**
     * 备注字数提示
     * @param v
     */
    commentsChange=(v)=>{
        this.setState({
            remarksLength : v.target.value.length
        });
    }
    render(){
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        let selectAfter = (
            <Select style={{ width: 70 }}
                {...getFieldProps('sex', {
                    initialValue:"1",
                    rules: [{
                        message: '请选择性别!',
                    }]
                })}
            >
                <Option value="1">先生</Option>
                <Option value="0">女士</Option>
            </Select>
        );
        return (
            <Modal className={less.changeAdminModal} title="变更管理员" visible={this.props.visible} width="630" height="417" onCancel={this.props.onCancel}
                   footer={[
                       <Button key="submit" type="primary" size="large" onClick={this.next}>
                           {this.state.current <1 ? "下一步":"确定"}
                       </Button>,
                   ]}
            >
                <Row style={{padding:"40px"}}>
                    <Steps current={this.state.current}>
                        <Step title="验证当前管理员" />
                        <Step title="确定新管理员" />
                        <Step title="操作完成" />
                    </Steps>
                </Row>
                <Form >
                    <div style={{display:this.state.current==0?"block":"none"}}>
                        <Form.Item {...formItemLayout} label="原手机号">
                            <Input maxLength={11}
                                {...getFieldProps('stepPhone', {
                                    rules: [
                                        { required: true, message: '请填写手机号' },
                                        { pattern: /^1\d{10}$/, message: '请输入正确的手机号' }
                                    ]
                                })}/>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="姓名">
                            <Input maxLength={20}
                                {...getFieldProps('adminUsername', {
                                    rules: [
                                        { required: true, message: '请填写姓名' },
                                    ]
                                })}/>
                        </Form.Item>
                        {/*<Form.Item {...formItemLayout} label="图片验证">*/}
                            {/*<Input style={{width:"70%"}}*/}
                                {/*{...getFieldProps('stepPicture', {*/}
                                    {/*rules: [{*/}
                                        {/*required: true,*/}
                                        {/*message: '请填写图片验证',*/}
                                    {/*}],*/}
                                {/*})}*/}
                            {/*/>*/}
                            {/*<img className={less.img_code} src={this.state.imag} onClick={this.reloadImg}></img>*/}
                        {/*</Form.Item>*/}
                        {/*<Form.Item {...formItemLayout} label="验证码"*/}
                        {/*>*/}
                            {/*<Input {...getFieldProps('stepCode', {*/}
                                {/*rules: [{*/}
                                    {/*required: true,*/}
                                    {/*message: '请填写验证码',*/}
                                {/*}],*/}
                            {/*})}/>*/}
                            {/*<div className={less.code_span} style={{display:this.state.sendCodeButton?"none":"block"}}>*/}
                                {/*<span >{this.state.sendCodeButtonHTML}</span>*/}
                            {/*</div>*/}
                            {/*<div className={less.code_a} style={{display:this.state.sendCodeButton?"block":"none"}}>*/}
                                {/*<a onClick={this.sendPhoneCode}>{this.state.sendCodeButtonHTML}</a>*/}
                            {/*</div>*/}
                        {/*</Form.Item>*/}
                    </div>
                    <div style={{display:this.state.current==1?"block":"none"}}>
                        <Form.Item {...formItemLayout} label="新管理员信息">
                            <Input maxLength={20} addonAfter={selectAfter}{...getFieldProps('newName', {
                                rules: [{
                                    required: true,
                                    message: '请填写管理员信息',
                                }],
                            })} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="身份证号码">
                            <Input maxLength={18} {...getFieldProps('cardId', {
                                rules: [{
                                    required: true,
                                    message: '请填写身份证号码',
                                }],
                            })}/>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="手机号">
                            <Input maxLength={11} {...getFieldProps('phone', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写手机号码!',
                                    },
                                    {pattern:/^1\d{10}$/, message: '请输入正确的手机号!'}
                                ],
                            })}/>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="图片验证">
                            <Input maxLength={4}
                                style={{width:"70%"}}
                                {...getFieldProps('picture', {
                                    rules: [{
                                        required: true,
                                        message: '请填写图片验证!',
                                    }],
                                })}
                            />
                            <img className={less.img_code} src={this.state.imag2} onClick={this.reloadImg2}></img>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="验证码">
                            <Input maxLength={6} {...getFieldProps('code', {
                                rules: [{
                                    required: true,
                                    message: '请填写验证码!',
                                }],
                            })}/>
                            <div className={less.code_span} style={{display:this.state.sendCodeButton2?"none":"block"}}>
                                <span >{this.state.sendCodeButtonHTML2}</span>
                            </div>
                            <div className={less.code_a} style={{display:this.state.sendCodeButton2?"block":"none"}}>
                                <a onClick={this.sendPhoneCode2}>{this.state.sendCodeButtonHTML2}</a>
                            </div>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="电子邮箱">
                            <Input maxLength={40} {...getFieldProps('email', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写电子邮箱',
                                    },
                                    {pattern:/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, message: '请输入正确的邮箱地址!'}
                                ],
                            })}/>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="通讯地址">
                            <Input  maxLength={50} {...getFieldProps('address')}/>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="备注信息">
                            <Input type="textarea" rows={8} maxLength={500} size='large' {...getFieldProps('remark',{
                                    /** getFieldProps会占用onchange事件 所以在getFieldProps里写事件 */
                                    onChange: this.commentsChange,
                                    validateTrigger:"onBlur",
                                    validateFirst:true
                                }
                            )} />
                            {/*{this.state.remarksLength}/500*/}
                        </Form.Item>
                        <Form.Item  {...formItemLayout} label="授权文件">
                            <Upload {...getFieldProps('fileList', {
                                        rules: [{
                                            required: true,
                                            message: '必须上传文件',
                                        }],
                                        ...ComponentDefine.upload_.uploadForm,
                                    })}
                                    {...this.uploadProps}
                            >
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>
                        </Form.Item>
                    </div>
                    <div style={{display:this.state.current==2?"block":"none"}}>
                        <div style={{height: "233px"}}>
                            <img src={Success} style={{marginLeft: "226px",marginTop: "90px"}}/>
                            <p style={{marginLeft: "217px",fontSize: "20px!important",fontWeight: "500",color: "rgba(0,0,0,0.85)"}}>操作成功</p>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(changeAdminModal);