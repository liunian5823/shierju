import { Popconfirm, Modal,Icon, Upload, Select, Radio, Card, Row, Col, Form, Input, Button, Table, Switch ,message} from 'antd';
import api from '@/framework/axios';
import BaseAffix from '@/components/baseAffix';
import WangEditor from '@/components/gaoda/WangEditor'
import less from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class editPurchaser extends React.Component{
    state = {
        loading: false,
        value:1,
        provinceList:[],
        cityList:[],
        areaList:[],
        parentList2:[],
        parentList3:[],
        parentList4:[],
        provinceName:"",
        cityName:"",
        areaName:"",
        address:"",
        notFoundContent:"没有更多单位了",
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        this.getPurchaserDetail(this.props.match.params.uuids);
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    //查询采购商基本信息
    getPurchaserDetail = (uuids)=>{
        api.ajax("GET", "!!/purchaser/purchaser/getPurchaser", {
            uuids:uuids
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            if(r.data){
                let v = r.data;
                //省初始化
                api.ajax("GET", "!!/purchaser/address/getProvinceList").then((r) => {
                    if(r.data.data != null){
                        let provinceName =
                            r.data.data.rows.map((item)=>{
                                return v.provinceCode==item.provinceCode?item.provinceName:null
                            }).join("")
                        this.setState({
                            provinceList:r.data.data.rows,
                            provinceName:provinceName

                        })
                    }
                })
                if(v.provinceCode){//市初始化
                    api.ajax("GET", "!!/purchaser/address/getCityList",{
                        provinceCode:v.provinceCode
                    }).then((r) => {
                        if(r.data.data != null){
                            let cityName =
                                r.data.data.rows.map((item)=>{
                                    return v.cityCode==item.cityCode?item.cityName:null
                                }).join("")
                            this.setState({
                                cityList:r.data.data.rows,
                                cityName:cityName
                            })
                        }
                    })
                }
                if(v.cityCode){//区初始化
                    api.ajax("GET", "!!/purchaser/address/getAreaList",{
                        cityCode:v.cityCode
                    }).then((r) => {
                        if(r.data.data != null){
                            let areaName =
                                r.data.data.rows.map((item)=>{
                                    return v.areaCode==item.areaCode?item.areaName:null
                                }).join("")
                            this.setState({
                                areaList:r.data.data.rows,
                                areaName:areaName
                            })
                        }
                    })
                }
                //单位级别与富文本
                this.setState({
                    unitLevel:v.unitLevel,
                    address:v.address,
                    html:v.companyProfile,
                })
                //附件:logo与授权文件
                let fileListA;
                if(v.companyLogoPath){
                    fileListA = [{
                        uid: -1,
                        //name: 'xxx.png',
                        url: SystemConfig.systemConfigPath.dfsPathUrl(v.companyLogoPath),
                        response:{
                            data:v.companyLogoPath
                        }
                    }];
                    this.setState({
                        display_none:"display_none"
                    })
                }
                let fileListB;
                if(v.legalAuthorizationName&&v.legalAuthorizationPath){
                    fileListB = [{
                        uid: -1,
                        name: v.legalAuthorizationName,
                        url: SystemConfig.systemConfigPath.dfsPathUrl(v.legalAuthorizationPath),
                        response:{
                            data:v.legalAuthorizationPath
                        }
                    }];
                }
                let fileListC;
                if(v.contractPath){
                    fileListC = [{
                        uid: -1,
                        name: v.contractPath.substr(v.contractPath.indexOf("?filename=")+10, v.contractPath.length),
                        url: SystemConfig.systemConfigPath.dfsPathUrl(v.contractPath),
                        response:{
                            data:v.contractPath
                        }
                    }];
                }
                //表单赋值
                this.props.form.setFieldsValue({
                    ...v,
                    fileListA:fileListA,
                    fileListB:fileListB,
                    fileListC:fileListC,
                    companyName : v.name,
                })
                //上级单位表单赋值
                let parentPath = v.parentPath.split(',');
                if(v.unitLevel==2){
                    this.props.form.setFieldsValue({
                        parentId2_1:2
                    })
                }else if(v.unitLevel==3){
                    this.getPurchaserParentList2(0,true);
                    this.props.form.setFieldsValue({
                        parentId3_1:2,
                        parentId3_2:parseInt(parentPath[0])
                    })
                }else if(v.unitLevel==4){
                    this.getPurchaserParentList2(0,true);
                    this.getPurchaserParentList3(parentPath[0],true);
                    this.props.form.setFieldsValue({
                        parentId4_1:2,
                        parentId4_2:parseInt(parentPath[0]),
                        parentId4_3:parseInt(parentPath[1])
                    })
                }else if(v.unitLevel==5){debugger
                    this.getPurchaserParentList2(0,true);
                    this.getPurchaserParentList3(parentPath[0],true);
                    this.getPurchaserParentList4(parentPath[1],true);
                    this.props.form.setFieldsValue({
                        parentId5_1:2,
                        parentId5_2:parseInt(parentPath[0]),
                        parentId5_3:parseInt(parentPath[1]),
                        parentId5_4:parseInt(parentPath[2])
                    })
                }
            }

        })
    }

    //省市区初始化:省
    getProvinceList = ()=>{
        api.ajax("GET", "!!/purchaser/address/getProvinceList").then((r) => {
            if(r.data.data != null){
                this.setState({
                    provinceList:r.data.data.rows
                })
            }
        })
    }

    //省市区初始化:市
    getCityList = (provinceCode)=>{
        this.props.form.resetFields(["cityCode"]);
        this.props.form.resetFields(["areaCode"]);
        api.ajax("GET", "!!/purchaser/address/getCityList",{
            provinceCode:provinceCode
        }).then((r) => {
            if(r.data.data != null){
                this.setState({
                    cityList:r.data.data.rows,
                    areaList:[]
                })
            }
        })
    }

    //省市区初始化:区
    getAreaList = (cityCode)=>{
        this.props.form.resetFields(["areaCode"]);
        api.ajax("GET", "!!/purchaser/address/getAreaList",{
            cityCode:cityCode
        }).then((r) => {
            if(r.data.data != null){
                this.setState({
                    areaList:r.data.data.rows
                })
            }
        })
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
                    <Select notFoundContent={this.state.notFoundContent}
                        style={{ "width": "100%" }}
                        placeholder="请选择" showSearch={true}
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
                    <Row className={less.downRowHeight}>
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
                <FormItem {...formItemLayout} label="上级单位">
                    <Row className={less.upRowHeight}>
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
                    <Row className={less.downRowHeight}>
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
            )
        }
    }

    //编辑采购商保存
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
                param.parentId = 2
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
            param.uuids = this.props.match.params.uuids;
            param.unitLevel = this.state.unitLevel;
            param.companyName = values.companyName;
            param.shortName = values.shortName;
            param.companyUrl = values.companyUrl;
            param.provinceCode = values.provinceCode;
            param.cityCode = values.cityCode;
            param.areaCode = values.areaCode;
            param.address = values.address;
            param.companyProfile = this.state.html;

            param.oldAllAddress = this.state.provinceName+this.state.cityName+this.state.areaName+this.state.address;
            param.newAllAddress =
                this.state.provinceList.map((item)=>{
                    return param.provinceCode==item.provinceCode?item.provinceName:null
                }).join('')+
                this.state.cityList.map((item)=>{
                    return param.cityCode==item.cityCode?item.cityName:null
                }).join('')+
                this.state.areaList.map((item)=>{
                    return param.areaCode==item.areaCode?item.areaName:null
                }).join('')+
                param.address
            if(values.fileListB&&values.fileListB.length==1){
                param.legalAuthorizationName = values.fileListB[0].name
                param.legalAuthorizationPath = values.fileListB[0].response.data
            }
            if(values.fileListC&&values.fileListC.length==1){
                param.legalAuthorizationName = values.fileListB[0].name
                param.contractPath = values.fileListC[0].response.data
            }
            api.ajax("POST", "!!/purchaser/purchaser/updatePurchaser", {
                ...param
            }).then((r) => {
                if (!_this._isMounted) {
                    return;
                }
                message.success("保存成功!");
                this.props.history.goBack();
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
        },
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
        },
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
            <div className={less.editPurchaser+" nobody"}>
                <Form>
                    <Card title="公司信息" bordered={false}  className={less.purchaserForm}>
                        <Form.Item {...formItemLayout}  label="公司logo" className={this.state.display_none?less.displaynone:""}>
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
                            <Row className={less.upRowHeight}>
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
                            <Row className={less.downRowHeight} style={{height:"auto"}}>
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
                                    rules: [
                                        {
                                            required: true,
                                            message: "请上传授权文件"
                                        }
                                    ],
                                    ...ComponentDefine.upload_.uploadForm,
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
                                    // rules: [
                                    //     {
                                    //         required: true,
                                    //         message: "请上传合同附件"
                                    //     }
                                    // ],
                                    ...ComponentDefine.upload_.uploadForm,
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
                    <BaseAffix>
                        <Button style={{marginRight: "10px"}} onClick={this.handleCancel}>返回</Button>
                        <Popconfirm placement="topLeft" title={"确认保存吗?"} onConfirm={this.handleSubmit}>
                            <Button type="primary" loading={this.state.loading}>保存</Button>
                        </Popconfirm>

                    </BaseAffix>
                </Form>
            </div>
        )
    }
}
export default Form.create()(editPurchaser);