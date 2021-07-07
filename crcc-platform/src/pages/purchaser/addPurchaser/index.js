import { Popconfirm, Modal, Icon, Upload, Select, Radio, Card, Row, Col, Form, Input, Button, Table, Switch ,message} from 'antd';
import api from '@/framework/axios';
import BaseAffix from '@/components/baseAffix';
import WangEditor from '@/components/gaoda/WangEditor'
import less from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class addPurchaser extends React.Component{
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
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        this.getProvinceList();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    //省市区初始化:省
    getProvinceList = ()=>{
        axios.get("!!/purchaser/address/getProvinceList",{
            params:{}
        }).then(r=>{
            if(r.data.data != null){
                this.setState({
                    provinceList:r.data.data.rows
                })
            }
        });
    }

    //省市区初始化:市
    getCityList = (provinceCode)=>{
        this.props.form.resetFields(["cityCode"]);
        this.props.form.resetFields(["areaCode"]);
        axios.get("!!/purchaser/address/getCityList",{
            params:{provinceCode:provinceCode}
        }).then(r=>{
            if(r.data.data != null){
                this.setState({
                    cityList:r.data.data.rows,
                    areaList:[]
                })
            }
        });
    }

    //省市区初始化:区
    getAreaList = (cityCode)=>{
        this.props.form.resetFields(["areaCode"]);
        axios.get("!!/purchaser/address/getAreaList",{
            params:{cityCode:cityCode}
        }).then(r=>{
            if(r.data.data != null){
                this.setState({
                    areaList:r.data.data.rows
                })
            }
        });
    }

    //公司级别变更事件
    onChange = (e)=> {
        this.setState({
            unitLevel: e.target.value,
        });
    }

    //获取采购商2级单位list
    getPurchaserParentList2 = (parentId,boolean)=>{
        api.ajax("GET", "!!/purchaser/purchaser/getPurchaserParentList",{
            parentId:2
        }).then((r) => {
            if(r.data != null){
                this.setState({
                    parentList2:r.data,
                })
            }
            if(!boolean){
                this.setState({
                    parentList3:[],
                    parentList4:[]
                })
            }
        })
    }
    //获取采购商3级单位list
    getPurchaserParentList3 = (parentId,boolean)=>{
        api.ajax("GET", "!!/purchaser/purchaser/getPurchaserParentList",{
            parentId:parentId
        }).then((r) => {
            if(r.data != null){
                this.setState({
                    parentList3:r.data,
                })
            }
            if(!boolean){
                this.setState({
                    parentList4:[]
                })
            }
        })
    }
    //获取采购商4级单位list
    getPurchaserParentList4 = (parentId)=>{
        api.ajax("GET", "!!/purchaser/purchaser/getPurchaserParentList",{
            parentId:parentId
        }).then((r) => {
            if(r.data != null){
                this.setState({
                    parentList4:r.data
                })
            }
        })
    }

    //展示上级单位
    showParent = ()=>{
        let level = this.state.unitLevel
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        if(level==2){//二级单位
            return (
                <FormItem {...formItemLayout} label="上级单位">
                    <Select placeholder="请选择" showSearch={true} notFoundContent={this.state.notFoundContent}
                        {...getFieldProps(`parentId2_1`, {
                            rules: [{
                                required: true,
                                message: '请选择'
                            }],
                            onChange: this.getPurchaserParentList2
                        })}
                    >
                        <Option key={0} value={2}>中铁建股份有限公司</Option>
                    </Select>
                </FormItem>
            )
        }else if(level==3){//三级单位
            return (
                <FormItem {...formItemLayout} label="上级单位" required>
                    <Col span={12} className={less.paddingRight}>
                        <FormItem>
                            <Select notFoundContent={this.state.notFoundContent}
                                placeholder="请选择" showSearch={true}
                                {...getFieldProps(`parentId3_1`, {
                                    rules: [{
                                        required: true,
                                        message: '请选择'
                                    }],
                                    onChange: this.getPurchaserParentList2
                                })}
                            >
                                <Option key={0} value={2}>中铁建股份有限公司</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12} className={less.paddingLeft}>
                        <FormItem>
                            <Select notFoundContent={this.state.notFoundContent}
                                placeholder="请选择" showSearch={true}
                                {...getFieldProps(`parentId3_2`, {
                                    rules: [{
                                        required: true,
                                        message: '请选择'
                                    }],
                                    onChange: this.getPurchaserParentList3
                                })}
                            >
                                {this.state.parentList2.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.id}>{item.name}</Option>
                                    )
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                </FormItem>
            )
        }else if(level==4){//(四级单位
            return (
                <FormItem {...formItemLayout} label="上级单位">
                    <Row className={less.upRowHeight}>
                        <Col span={24}>
                            <FormItem>
                                <Select notFoundContent={this.state.notFoundContent}
                                    placeholder="请选择" showSearch={true}
                                    {...getFieldProps(`parentId4_1`, {
                                        rules: [{
                                            required: true,
                                            message: '请选择'
                                        }],
                                        onChange: this.getPurchaserParentList2
                                    })}
                                >
                                    <Option key={0} value={2}>中铁建股份有限公司</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row  className={less.downRowHeight}>
                        <Col span={12} className={less.paddingRight}>
                            <FormItem>
                                <Select notFoundContent={this.state.notFoundContent}
                                    placeholder="请选择" showSearch={true}
                                    {...getFieldProps(`parentId4_2`, {
                                        rules: [{
                                            required: true,
                                            message: '请选择'
                                        }],
                                        onChange: this.getPurchaserParentList3
                                    })}
                                >
                                    {this.state.parentList2.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.name}</Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12} className={less.paddingLeft}>
                            <FormItem>
                                <Select notFoundContent={this.state.notFoundContent}
                                    placeholder="请选择" showSearch={true}
                                    {...getFieldProps(`parentId4_3`, {
                                        rules: [{
                                            required: true,
                                            message: '请选择'
                                        }],
                                        onChange: this.getPurchaserParentList4
                                    })}
                                >
                                    {this.state.parentList3.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.name}</Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
            )
        }else if(level==5){//五级单位
            return (
                <div>
                    <FormItem {...formItemLayout} label="上级单位">
                        <Row  className={less.upRowHeight}>
                            <Col span={12} className={less.paddingRight}>
                                <FormItem>
                                    <Select notFoundContent={this.state.notFoundContent}
                                        placeholder="请选择" showSearch={true}
                                        {...getFieldProps(`parentId5_1`, {
                                            rules: [{
                                                required: true,
                                                message: '请选择'
                                            }],
                                            onChange: this.getPurchaserParentList2
                                        })}
                                    >
                                        <Option key={0} value={2}>中铁建股份有限公司</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={12} className={less.paddingLeft}>
                                <FormItem>
                                    <Select notFoundContent={this.state.notFoundContent}
                                        placeholder="请选择" showSearch={true}
                                        {...getFieldProps(`parentId5_2`, {
                                            rules: [{
                                                required: true,
                                                message: '请选择'
                                            }],
                                            onChange: this.getPurchaserParentList3
                                        })}
                                    >
                                        {this.state.parentList2.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>{item.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  className={less.downRowHeight}>
                            <Col span={12} className={less.paddingRight}>
                                <FormItem>
                                    <Select notFoundContent={this.state.notFoundContent}
                                        placeholder="请选择" showSearch={true}
                                        {...getFieldProps(`parentId5_3`, {
                                            rules: [{
                                                required: true,
                                                message: '请选择'
                                            }],
                                            onChange: this.getPurchaserParentList4
                                        })}
                                    >
                                        {this.state.parentList3.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>{item.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={12} className={less.paddingLeft}>
                                <FormItem>
                                    <Select notFoundContent={this.state.notFoundContent}
                                        placeholder="请选择" showSearch={true}
                                        {...getFieldProps(`parentId5_4`, {
                                            rules: [{
                                                required: true,
                                                message: '请选择'
                                            }],

                                        })}
                                    >
                                        {this.state.parentList4.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>{item.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                </div>
            )
        }
    }

    //新增采购商保存
    handleSubmit = ()=>{
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
            const param = {}
            //公司信息
            let unitLevel = this.state.unitLevel
            if(unitLevel==2){
                param.parentId = values["parentId2_1"]
            }else if(unitLevel==3){
                param.parentId = values["parentId3_2"]
                param.parentPath = values["parentId3_2"]
            }else if(unitLevel==4){
                param.parentId = values["parentId4_3"]
                param.parentPath = values["parentId4_2"]+","+values["parentId4_3"]
            }else if(unitLevel==5){
                param.parentId = values["parentId5_4"]
                param.parentPath = values["parentId5_2"]+","+values["parentId5_3"]+","+values["parentId5_4"]
            }
            if(values.fileListA&&values.fileListA.length==1){
                param.companyLogoPath = values.fileListA[0].response.data
            }
            param.unitLevel = this.state.unitLevel
            param.companyName = values.companyName
            param.shortName = values.shortName
            param.companyUrl = values.companyUrl
            param.provinceCode = values.provinceCode
            param.cityCode = values.cityCode
            param.areaCode = values.areaCode
            param.address = values.address
            param.companyProfile = this.state.html
            if(values.fileListB&&values.fileListB.length==1){
                param.legalAuthorizationName = values.fileListB[0].name
                param.legalAuthorizationPath = values.fileListB[0].response.data
            }
            if(values.fileListC&&values.fileListC.length==1){
                param.contractPath = values.fileListC[0].response.data
            }
            //管理员信息
            param.userName = values.userName
            param.citizenCode = values.citizenCode
            param.phone = values.phone
            param.email = values.email
            api.ajax("POST", "!!/purchaser/purchaser/insertPurchaser", {
                ...param
            }).then((r) => {
                if (!_this._isMounted) {
                    return;
                }
                this.setState({
                    loading: false
                })
                this.props.history.goBack();
                message.success("保存成功");
            }).catch((r) => {
                this.setState({
                    loading: false
                })
                message.error(r.msg)
            })
        })
    }

    //公司logo
    uploadPropsA = {
        ...ComponentDefine.upload_.uploadProps,
        listType: 'picture-card',
        beforeUpload(file) {
            const fileType = ["png","jpg","jpeg"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('请上传格式为PNG、JPG文件');
                return false
            }
            if(file.size&&file.size>1024*300){
                message.error('请上传小于300K的文件');
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
            let fileListA = fileList
            this.props.form.setFieldsValue({fileListA})
            //隐藏上传按钮
            if(fileList.length==1){//隐藏
                this.setState({
                    display_none:"display_none"
                })
            }else{//显示
                this.setState({
                    display_none:""
                })
            }
        },
        onPreview: (file) => {//展示文件的回调
            this.setState({
                priviewImage: SystemConfig.systemConfigPath.dfsPathUrl(file.response.data),
                priviewVisible: true,
            });
        }
    };
    //授权文件
    uploadPropsB = {
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
            let fileListB = fileList
            this.props.form.setFieldsValue({fileListB})
        }
    };
    //框架协议
    uploadPropsC = {
        ...ComponentDefine.upload_.uploadProps,
        beforeUpload(file) {
            const fileType =  ["pdf"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('只能上传pdf类型的文件');
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
            let fileListC = fileList
            this.props.form.setFieldsValue({fileListC})
        }
    };
    //关闭附件展示模态框
    handleCancelModal = ()=>{
        this.setState({
            priviewVisible: false,
        });
    }

    //富文本编辑器变更事件
    editChange=(html)=>{
        this.setState({
            html :html
        })
        console.log(html);
    }

    handleCancel = () => {
        this.props.history.push("/purchaser/purchaser");
    }

    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        return(
            <div className={less.addPurchaser+" nobody"}>
                <Form>
                    <Card title="公司信息" bordered={false} className={less.purchaserForm}>
                        <Form.Item {...formItemLayout}  label="公司logo"  className={this.state.display_none?less.displaynone:""}>
                            <Upload
                                {...getFieldProps('fileListA', {
                                    ...ComponentDefine.upload_.uploadForm,
                                })}
                                {...this.uploadPropsA}
                            >
                                <Icon type="plus"/>
                                <div className="ant-upload-text">上传照片</div>
                            </Upload>
                            <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancelModal}>
                                <img style={{width:"100%"}} alt="example" src={this.state.priviewImage} />
                            </Modal>
                            <div className={less.tishi}>图片要求300kb以下 300*300px</div>
                        </Form.Item>
                        <FormItem {...formItemLayout} label="企业类型">
                            <RadioGroup value={10}>
                                <Radio key="10" value={10} disabled={true}>内部企业</Radio>
                                <Radio key="20" value={20} disabled={true}>外部企业</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem {...formItemLayout} label="单位级别">
                            <RadioGroup onChange={this.onChange} value={this.state.unitLevel}>
                                <Radio key="2" value={2}>二级单位</Radio>
                                <Radio key="3" value={3}>三级单位</Radio>
                                <Radio key="4" value={4}>四级单位</Radio>
                                <Radio key="5" value={5}>五级单位</Radio>
                            </RadioGroup>
                        </FormItem>
                        {this.showParent()}
                        <FormItem {...formItemLayout} label="公司名称">
                            <Input type="text" maxLength={50}
                                   {...getFieldProps('companyName',{
                                       rules: [{
                                           required: true,
                                           message: '请输入公司名称'
                                       }],
                                   })}
                                   placeholder="请输入"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="公司简称">
                            <Input type="text" maxLength={25}
                                   {...getFieldProps('shortName')}
                                   placeholder="请输入"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="公司网址">
                            <Input type="text" maxLength={50}
                                   {...getFieldProps('companyUrl')}
                                   placeholder="请输入"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="公司地址">
                            <Row  className={less.upRowHeight}>
                                <Col span={8} style={{paddingRight:"8px"}}>
                                    <FormItem>
                                        <Select
                                            style={{ "width": "100%" }}
                                            placeholder="请选择" showSearch={true}
                                            {...getFieldProps(`provinceCode`, {
                                                // rules: [{
                                                //     required: true,
                                                //     message: '请选择'
                                                // }],
                                                onChange: this.getCityList
                                            })}
                                        >
                                            {this.state.provinceList.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item.provinceCode}>{item.provinceName}</Option>
                                                )
                                            })}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8} style={{paddingLeft:"4px",paddingRight:"4px"}}>
                                    <FormItem>
                                        <Select
                                        style={{ "width": "100%" }}
                                        placeholder="请选择" showSearch={true}
                                        {...getFieldProps(`cityCode`, {
                                            // rules: [{
                                            //     required: true,
                                            //     message: '请选择'
                                            // }],
                                            onChange: this.getAreaList
                                        })}
                                    >
                                        {this.state.cityList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.cityCode}>{item.cityName}</Option>
                                            )
                                        })}
                                    </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8} style={{paddingLeft:"8px"}}>
                                    <FormItem>
                                        <Select
                                        style={{ "width": "100%" }}
                                        placeholder="请选择" showSearch={true}
                                        {...getFieldProps(`areaCode`, {
                                            // rules: [{
                                            //     required: true,
                                            //     message: '请选择'
                                            // }]
                                        })}
                                    >
                                        {this.state.areaList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.areaCode}>{item.areaName}</Option>
                                            )
                                        })}
                                    </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row  className={less.downRowHeight} style={{height:"auto"}}>
                                <FormItem>
                                    <Input type="textarea"  maxLength={200}  style={{marginBottom: "23px"}}
                                       autosize
                                       {...getFieldProps('address',{
                                           rules: [
                                               // {
                                               //     required: true,
                                               //     message: "请输入"
                                               // }
                                           ]
                                       })}
                                       placeholder="请输入"/>
                                </FormItem>
                            </Row>
                        </FormItem>
                        <FormItem {...formItemLayout} label="公司简介">
                            <WangEditor initHtml={this.state.html} onChange={this.editChange}></WangEditor>
                        </FormItem>
                        <Form.Item {...formItemLayout} label="授权文件">
                            <Upload
                                {...getFieldProps('fileListB', {
                                    ...ComponentDefine.upload_.uploadForm,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请上传授权文件"
                                        }
                                    ],
                                })}
                                {...this.uploadPropsB}
                            >
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                                <span style={{marginLeft:"36px",lineHeight:"31px"}} className={less.FileTipCss}>上传doc、docx、pdf、jpg、png类型的文件</span>
                            </Upload>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="框架协议">
                            <Upload
                                {...getFieldProps('fileListC', {
                                    ...ComponentDefine.upload_.uploadForm,
                                    // rules: [
                                    //     {
                                    //         required: true,
                                    //         message: "请上合同附件"
                                    //     }
                                    // ],
                                })}
                                {...this.uploadPropsC}
                            >
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                                <span style={{marginLeft:"36px",lineHeight:"31px"}} className={less.FileTipCss}>上传pdf类型的文件</span>
                            </Upload>
                        </Form.Item>
                    </Card>
                    <Card title="管理员信息" bordered={false}>
                        <FormItem {...formItemLayout} label="姓名">
                            <Input type="text" maxLength={30}
                                   {...getFieldProps('userName',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请输入管理员姓名"
                                               }
                                           ]
                                       })}
                                   placeholder="请输入"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="身份证号码">
                            <Input type="text" maxLength={18}
                                   {...getFieldProps('citizenCode',
                                       {
                                           // rules: [
                                           //     {
                                           //         required: true,
                                           //         message: "请输入身份证号码"
                                           //     }
                                           // ]
                                       })}
                                   placeholder="请输入"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="手机">
                            <Input type="text" maxLength={11}
                                   {...getFieldProps('phone',
                                       {
                                           rules: [
                                               {required: true,message: "请输入管理员手机"},
                                               {pattern: /^1\d{10}$/, message: '请输入正确的手机号' }
                                           ]
                                       })}
                                   placeholder="请输入"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="电子邮箱">
                            <Input type="text" maxLength={50}
                                   {...getFieldProps('email',
                                       {
                                           rules: [
                                               {required: true,message: "请输入管理员电子邮箱"},
                                               {pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, message: '请输入正确的电子邮箱'}
                                           ]
                                       })}
                                   placeholder="请输入"/>
                        </FormItem>
                    </Card>
                    <BaseAffix>
                        <Button style={{marginRight: "10px"}} onClick={this.handleCancel}>返回</Button>
                        <Popconfirm placement="topRight" title={"确认保存吗?"} onConfirm={this.handleSubmit}>
                            <Button type="primary" loading={this.state.loading}>保存</Button>
                        </Popconfirm>
                    </BaseAffix>
                </Form>
            </div>
        )
    }
}
export default Form.create()(addPurchaser);