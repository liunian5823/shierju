import { Upload, Radio, Popconfirm, message, Select, Card, Form, Row, Col, Input, Button, Icon, Modal, DatePicker,Table } from 'antd';
import {tablePagination_, btnName_, default as ComponentDefine} from "@/utils/config/componentDefine";//分页等公共组件
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import "./user.css";
import RegularDefine from '@/utils/regularDefine'
import { viewImg } from "@/utils/urlUtils";
import { session } from "@/utils/storage";
import history from "@/utils/history";
import api from "@/framework/axios";
import warning_icon from '../../../static/img/warning_icon.png'

/**
 * 新增/编辑用户窗口
 * 参数描述:
 * switchShow:1,(管理员)新增员工;2,(管理员)编辑员工;3,(登录人)编辑账户信息
 * close:返回原窗口的方法
 * callback:新增或编辑成功后的回调(列:刷新原列表)
 * user:switchShow的值为2时,需要编辑的用户的信息
 * 以下为user数据结构描述
 *
 */
const Option = Select.Option;//下拉内容
const disabledDate = function (current) {
    return current && current.getTime() < Date.now();
};
class EditUser extends React.Component {
    /*static defaultProps = {
        uuids: session.getItem('userUuids'),
        switchShow: session.getItem('userShow'),
        close() {
            history.push('/organization/user');
        }
    };*/
    constructor(props) {
        super(props);
        this.state = {
            uuids:'',
            switchShow:1,
            companyId:'',
            disabled: false,
            dataSource: {

            },
            provinceList:[],
            cityList:[],
            areaList:[],
            //附件相关
            //fileStr,
            priviewImage: '',//当前模态框展示的图片
            priviewVisibleA: false,//图片模态框展示与隐藏
            priviewVisibleB: false,
            priviewVisibleC: false,
            priviewVisibleD: false,
            display_noneA: '',//上传按钮展示与隐藏
            display_noneB: '',
            display_noneC: '',
            display_noneD: '',
            loading: false,
            addressLength: 0,//通讯地址长度,
            roleSource: {
                list:[]
            },
            valid:0,
            confirmUpdate: false,
            oldData:{},
            roleList:[],//职务下拉
            currentList:[]//职务下拉可选
        }
    }

    submitFlag = false;

    //通讯地址长度变更
    changeAddress = (e) => {
        this.setState({
            addressLength: e.target.value.length,
        })
    }

    //生命周期:在渲染前调用
    componentWillMount() {
        this.setState({
            switchShow: this.props.switchShow,
            uuids:this.props.uuids,
            companyId: this.props.companyId,
        }, () => {
            //获取角色下拉
            this.getRoleList();
            this.handleSearch(1, tablePagination_.defaultPageSize);
            if (this.state.switchShow == 1) {//新增用户时初始化数据
                this.setState({
                    cardType: 0//身份证/护照切换:0,身份证;1护照.
                })
            } else if (this.props.switchShow == 2 || this.props.switchShow == 3) {//编辑用户时初始化数据
                //查询账户基本信息
                const params = {};
                params.uuids = this.props.uuids;
                axios.get("@/reuse/user/getUserDetail", {
                    params: params
                }).then(({data: r}) => {
                    this.infoInsert(r)
                });
            }
        });
        //省初始化
        this.getProvinceList();
    }
    //省市区初始化
    getProvinceList = () => {
        axios.get("@/reuse/address/getProvinceList", {
            params: {}
        }).then(r => {
            if (r.data != null) {
                this.setState({
                    provinceList: r.data.data.rows
                })
            }
        });
    };

    infoInsert = (r) => {
        // if (r.gender == null || r.gender == "") {
        //     r.gender = 1;
        // }
        if (r.cardType != 0 && r.cardType != 1) {
            r.cardType = 0
        }
        if (r.address) {
            this.setState({
                addressLength: r.address.length
            })
        }
        let display_noneA = "";
        let display_noneB = "";
        let display_noneC = "";
        let display_noneD = "";
        let fileListA = null;
        let fileListB = null;
        let fileListC = null;
        let fileListD = null;
        let validDate = "";

        if(r.validStr&&r.validStr!="2500-12-31 00:00:00"){//有效期
            validDate=r.validStr;
            this.setState({
                valid:1
            })
        }else{
            this.setState({
                valid:0
            })
        }
        if (r.userPhotoPath && r.userPhotoPath != "deleted") {//头像
            display_noneA = "display_none";
            fileListA = [{
                uid: -1,
                //name: 'xxx.png',
                url: viewImg(r.userPhotoPath),
                response: {
                    data: r.userPhotoPath
                }
            }]
        }
        if (r.cardType == 0) {//身份证
            if (r.citizenPhotoPath && r.citizenPhotoPath != "deleted") {//身份证正面
                display_noneB = "display_none";
                fileListB = [{
                    uid: -1,
                    //name: 'xxx.png',
                    url: viewImg(r.citizenPhotoPath),
                    response: {
                        data: r.citizenPhotoPath
                    }
                }]
            }

            if (r.citizenPhotoPath2 && r.citizenPhotoPath2 != "deleted") {//身份证反面
                display_noneC = "display_none";
                fileListC = [{
                    uid: -1,
                    //name: 'xxx.png',
                    url: viewImg(r.citizenPhotoPath2),
                    response: {
                        data: r.citizenPhotoPath2
                    }
                }]
            }
        } else if (r.cardType == 1) {//护照
            if (r.citizenPhotoPath && r.citizenPhotoPath != "deleted") {//护照
                display_noneD = "display_none";
                fileListD = [{
                    uid: -1,
                    //name: 'xxx.png',
                    url: viewImg(r.citizenPhotoPath),
                    response: {
                        data: r.citizenPhotoPath
                    }
                }]
            }
        }

        this.setState({
            dataSource: r,
            cardType: r.cardType,
            display_noneA: display_noneA,
            display_noneB: display_noneB,
            display_noneC: display_noneC,
            display_noneD: display_noneD,
        });

        this.props.form.setFieldsValue({
            ...r,
            fileListA: fileListA,
            fileListB: fileListB,
            fileListC: fileListC,
            fileListD: fileListD,
            province:r.provinceCode,
            city:r.cityCode,
            area:r.areaCode
        });
    }

        //获取职务下拉
        getRoleList = ()=>{
            axios.get("@/reuse/organization/getRoleList").then(r => {
                r.data.rows.unshift({'id':'','name':'-无-'})
                this.setState({
                    roleList:r.data.rows
                });
            });
            if(!this.state.uuids) {
                return;
            }
            let params = {
                subPlatformId: 6
            }
            axios.get("@/sso/ecRole/queryByCurrentUser",{ params: params }).then(r => {
                this.setState({
                    currentList:r.data
                });
            });
        }

        //新增修改员工保存confirm
    confirm = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            } else {
                this.setState({
                    loading: true
                })
                if (this.state.disabled) {
                    return this.save()
                }
                if (this.props.switchShow == 1) {//(管理员)新增员工
                    Modal.confirm({
                        title: '确认保存吗？',
                        content: '添加账号后生成随机密码将以短信的形式发送至该员工的手机。',
                        okText: "确定",
                        cancelText: '取消',
                        onOk: this.save.bind(this,this.state.roleSource.list),
                        onCancel: () => {
                            this.setState({
                                loading: false
                            })
                        }
                    });
                } else if (this.props.switchShow == 2) {//(管理员)编辑员工信息
                    this.save(this.state.roleSource.list);
                } else if (this.props.switchShow == 3) {//(登录人)保存个人信息
                    this.save();
                }
            }
        });
    }

    provinceChange=(provinceCode)=>{
        this.setState({loading:true})
        this.props.form.resetFields(["city"]);
        this.props.form.resetFields(["area"]);
        axios.get("@/reuse/address/getCityList",{
            params:{provinceCode:provinceCode}
        }).then(r=>{
            if(r.data != null){
                this.setState({
                    cityList:r.data.data.rows,
                    areaList:[],
                    loading:false
                })
            }else{
                this.setState({
                    loading:false
                })
            }
        });
    }

    cityChange=(cityCode)=>{
        this.setState({loading:true})
        this.props.form.resetFields(["area"]);
        axios.get("@/reuse/address/getAreaList",{
            params:{cityCode:cityCode}
        }).then(r=>{
            if(r.data != null){
                this.setState({
                    areaList:r.data.data.rows,
                    loading:false
                })
            }else{
                this.setState({
                    loading:false
                })
            }
        });
    }

    //新增修改员工保存confirmqueen回调
    save = (list) => {
        if (this.submitFlag) {
            return;
        }
        this.submitFlag = true;
        let type = this.props.switchShow;
        let formData = this.props.form.getFieldsValue();
        const params = {};
        let url = "@/reuse/user/insertUser"
        if (type == 1) {
            params.flag = this.state.disabled ? 1 : 0
            if (this.state.disabled) {
                params.uuids = this.state.uuids
            }
        } else if (type == 2 || type == 3) {
            url = "@/reuse/user/updateUser"
            params.uuids = this.props.uuids//修改时有主键
        }
        params.username = formData.username//真实姓名
        if (formData.phone) {//电话
            params.phone = formData.phone;
        }
        if (formData.email) {//邮箱
            params.email = formData.email
        }
        if(formData.valid==1&&formData.validDate){
            params.valid = moment(formData.validDate).format('YYYY-MM-DD HH:mm:ss');
        }else{
            params.valid = "2500-12-31 00:00:00";
        }
        params.gender = formData.gender//性别
        if (formData.fileListA && formData.fileListA.length == 1) {
            params.userPhotoPath = formData.fileListA[0].response.data;//头像位置
        } else {
            params.userPhotoPath = "";
        }
        params.address = formData.address//详细联系地址
        //if(formData.citizenCode){
        params.citizenCode = formData.citizenCode//证件号码
        //}
        params.cardType = formData.cardType//证件类型
        if (formData.cardType == 0) {//身份证
            if (formData.fileListB && formData.fileListB.length == 1) {
                params.citizenPhotoPath = formData.fileListB[0].response.data;//身份证正面
            } else {
                params.citizenPhotoPath = "";
            }
            if (formData.fileListC && formData.fileListC.length == 1) {
                params.citizenPhotoPath2 = formData.fileListC[0].response.data;//身份证反面
            } else {
                params.citizenPhotoPath2 = "";
            }
        } else if (formData.cardType == 1) {//护照
            if (formData.fileListD && formData.fileListD.length == 1) {
                params.citizenPhotoPath = formData.fileListD[0].response.data;//护照
            } else {
                params.citizenPhotoPath = "";
            }
        }

        params.areaCode = formData.area;
        let proCode = formData.province;
        let cityCode = formData.city;
        this.state.provinceList.map((item, index) => {
            if(proCode == item.provinceCode){
                params.provinceCode = item.provinceName;
            }
        })
        this.state.cityList.map((item, index) => {
            if(cityCode == item.cityCode){
                params.cityCode = item.cityName;
            }
        })

        if (list) {
            let num = 0;
            let arr = [];
            for(let i=0;i<list.length;i++){
                if(formData["uuids"+list[i]["uuids"]] != undefined){
                    if(list[i]["roleName"]!=formData["uuids"+list[i]["uuids"]]){
                        list[i]["roleId"]=formData["uuids"+list[i]["uuids"]];
                    }
                    arr.push(list[i]);
                    num++;
                }
                if(list[i]["isDefault"] == 1 || list[i]["isDefault"] == '1'  ){
                    let defaultOriRole = list[i]["roleId"]
                    if(defaultOriRole== "" || defaultOriRole==null || defaultOriRole == undefined){
                        message.error('请填写默认部门中的角色');
                        this.setState({
                            loading:false
                        })
                        this.submitFlag = false;
                        return
                    }
                }
            }
            arr.forEach(item => {
                if(item.roleId == "游客") {
                    item.roleId = "43310";
                }
            })
            params.orgListStr = JSON.stringify(arr);
        }

        axios.post(url, {
            ...params
        }).then(r => {
            if (r) {
                this.setState({
                    loading: false
                });
                this.submitFlag = false;
                if (r.code === '000000') {
                    message.success(r.msg || "保存成功");
                    this.props.callback();
                } else {
                    message.error(r.msg || "保存失败");
                }
            }
        }, (e) => {
            message.error(e.msg || "保存失败");
            this.setState({
                loading: false,
            })
            this.submitFlag = false;
        });
    }

    //附件上传:头像
    uploadPropsA = {
        ...ComponentDefine.upload_.uploadProps,
        listType: 'picture-card',
        beforeUpload(file) {
            const fileType = ["png", "jpg"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('请上传格式为PNG、JPG文件');
                return false
            }
            if (file.size && file.size > 1024 * 1024 * 2) {
                message.error('请上传小于2MB的文件');
                return false
            }
            return true
        },
        onChange: (info) => {
            let fileList = info.fileList;
            if (info.file.status === 'done') {
                let isSuccess = false;
                if (info.file.response.code == SystemConfig.constant.responseSuccessCode) {
                    isSuccess = true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // let fileStr = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // this.setState({
                    //     fileStr:fileStr
                    // });
                    message.success(`${info.file.name} 上传成功。`);
                } else {
                    message.error(`${info.file.name} 上传失败。`);
                }
                if (isSuccess) {
                    fileList = fileList.slice(-1);
                } else {
                    fileList = fileList.slice(0, fileList.length - 1);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败。`);
            }
            let fileListA = fileList
            this.props.form.setFieldsValue({ fileListA })
            //隐藏上传按钮
            if (fileList.length == 1) {//隐藏
                this.setState({
                    display_noneA: "display_none"
                })
            } else {//显示
                this.setState({
                    display_noneA: ""
                })
            }
        },
        onPreview: (file) => {//展示文件的回调
            this.setState({
                priviewImage: SystemConfig.systemConfigPath.dfsPathUrl(file.response.data),
                priviewVisibleA: true,
            });
        }
    };
    //附件上传:身份证正面
    uploadPropsB = {
        ...ComponentDefine.upload_.uploadProps,
        listType: 'picture-card',
        beforeUpload(file) {
            const fileType = ["png", "jpg"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('请上传格式为PNG、JPG文件');
                return false
            }
            if (file.size && file.size > 1024 * 1024 * 2) {
                message.error('请上传小于2MB的文件');
                return false
            }
            return true
        },
        onChange: (info) => {
            let fileList = info.fileList;
            if (info.file.status === 'done') {
                let isSuccess = false;
                if (info.file.response.code == SystemConfig.constant.responseSuccessCode) {
                    isSuccess = true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // let fileStr = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // this.setState({
                    //     fileStr:fileStr
                    // });
                    message.success(`${info.file.name} 上传成功。`);
                } else {
                    message.error(`${info.file.name} 上传失败。`);
                }
                if (isSuccess) {
                    fileListB = fileList.slice(-1);
                } else {
                    fileListB = fileList.slice(0, fileList.length - 1);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败。`);
            }
            let fileListB = fileList
            this.props.form.setFieldsValue({ fileListB })
            //隐藏上传按钮
            if (fileList.length == 1) {//隐藏
                this.setState({
                    display_noneB: "display_none"
                })
            } else {//显示
                this.setState({
                    display_noneB: ""
                })
            }
        },
        onPreview: (file) => {//展示文件的回调
            this.setState({
                priviewImage: SystemConfig.systemConfigPath.dfsPathUrl(file.response.data),
                priviewVisibleB: true,
            });
        }
    };
    //附件上传:身份证反面
    uploadPropsC = {
        ...ComponentDefine.upload_.uploadProps,
        listType: 'picture-card',
        beforeUpload(file) {
            const fileType = ["png", "jpg"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('请上传格式为PNG、JPG文件');
                return false
            }
            if (file.size && file.size > 1024 * 1024 * 2) {
                message.error('请上传小于2MB的文件');
                return false
            }
            return true
        },
        onChange: (info) => {
            let fileList = info.fileList;
            if (info.file.status === 'done') {
                let isSuccess = false;
                if (info.file.response.code == SystemConfig.constant.responseSuccessCode) {
                    isSuccess = true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // let fileStr = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // this.setState({
                    //     fileStr:fileStr
                    // });
                    message.success(`${info.file.name} 上传成功。`);
                } else {
                    message.error(`${info.file.name} 上传失败。`);
                }
                if (isSuccess) {
                    fileList = fileList.slice(-1);
                } else {
                    fileList = fileList.slice(0, fileList.length - 1);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败。`);
            }
            let fileListC = fileList
            this.props.form.setFieldsValue({ fileListC })
            //隐藏上传按钮
            if (fileList.length == 1) {//隐藏
                this.setState({
                    display_noneC: "display_none"
                })
            } else {//显示
                this.setState({
                    display_noneC: ""
                })
            }
        },
        onPreview: (file) => {//展示文件的回调
            this.setState({
                priviewImage: SystemConfig.systemConfigPath.dfsPathUrl(file.response.data),
                priviewVisibleC: true,
            });
        }
    };
    //附件上传:护照
    uploadPropsD = {
        ...ComponentDefine.upload_.uploadProps,
        beforeUpload(file) {
            const fileType = ["png", "jpg"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('请上传格式为PNG、JPG文件');
                return false
            }
            if (file.size && file.size > 1024 * 1024 * 2) {
                message.error('请上传小于2MB的文件');
                return false
            }
            return true
        },
        listType: 'picture-card',
        onChange: (info) => {
            let fileList = info.fileList;
            if (info.file.status === 'done') {
                let isSuccess = false;
                if (info.file.response.code == SystemConfig.constant.responseSuccessCode) {
                    isSuccess = true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // let fileStr = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    // this.setState({
                    //     fileStr:fileStr
                    // });
                    message.success(`${info.file.name} 上传成功。`);
                } else {
                    message.error(`${info.file.name} 上传失败。`);
                }
                if (isSuccess) {
                    fileList = fileList.slice(-1);
                } else {
                    fileList = fileList.slice(0, fileList.length - 1);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败。`);
            }
            let fileListD = fileList
            this.props.form.setFieldsValue({ fileListD })
            //隐藏上传按钮
            if (fileList.length == 1) {//隐藏
                this.setState({
                    display_noneD: "display_none"
                })
            } else {//显示
                this.setState({
                    display_noneD: ""
                })
            }
        },
        onPreview: (file) => {//展示文件的回调
            this.setState({
                priviewImage: SystemConfig.systemConfigPath.dfsPathUrl(file.response.data),
                priviewVisibleD: true,
            });
        }
    };

    //关闭展示附件模态框
    handleCancel = () => {
        this.setState({
            priviewVisibleA: false,
            priviewVisibleB: false,
            priviewVisibleC: false,
            priviewVisibleD: false,
        });
    };

    onChangeValid = (e)=>{
        this.setState({
            valid:e.target.value
        });
    }

    //护照,身份证切换事件
    onChangeCardType = (e) => {
        this.setState({
            cardType: e.target.value,
            display_noneB: "",
            display_noneC: "",
            display_noneD: ""
        });
        this.props.form.resetFields(["citizenCode"]);
    }

    //身份证与护照显示切换
    showCardType = () => {
        const { getFieldProps } = this.props.form;
        const leftSpan = 5;
        const span = 14
        if (this.state.cardType == 0) {//身份证
            return (
                <div>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("身份证号")}>
                                <Input placeholder="请输入"
                                    disabled={this.state.disabled}
                                    maxLength={18}
                                    {...getFieldProps(`citizenCode`, {
                                        rules: [
                                            { required: true, message: "请输入身份证号" }
                                        ]
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="upload_file_layer1">
                        <div className={"clearfix " + this.state.display_noneB}>
                            <Form.Item>
                                <Upload
                                    disabled={this.state.disabled}
                                    {...getFieldProps('fileListB', {
                                        ...ComponentDefine.upload_.uploadForm,
                                    })}
                                    {...this.uploadPropsB}
                                >
                                    <Icon type="plus" />
                                    <div className="ant-upload-text">上传照片</div>
                                </Upload>
                            </Form.Item>
                            <Modal visible={this.state.priviewVisibleB} footer={null} onCancel={this.handleCancel}>
                                <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                            </Modal>
                        </div>
                        <div className="upload_file_layer1_con">
                            <h2>上传身份证正面</h2>
                            <div className="upload_file_layer1_con_text"><span>请上传格式为PNG、JPG文件</span> <span>体积小于2MB的图片</span> <span>请确认图片各项内容清晰可见以便审核</span></div>
                        </div>
                    </Row>
                    <Row className="upload_file_layer1">
                        <div className={"clearfix " + this.state.display_noneC}>
                            <Form.Item>
                                <Upload
                                    disabled={this.state.disabled}
                                    {...getFieldProps('fileListC', {
                                        ...ComponentDefine.upload_.uploadForm,
                                    })}
                                    {...this.uploadPropsC}
                                >
                                    <Icon type="plus" />
                                    <div className="ant-upload-text">上传照片</div>
                                </Upload>
                            </Form.Item>
                            <Modal visible={this.state.priviewVisibleC} footer={null} onCancel={this.handleCancel}>
                                <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                            </Modal>
                        </div>
                        <div className="upload_file_layer1_con">
                            <h2>上传身份证反面</h2>
                            <div className="upload_file_layer1_con_text"><span>请上传格式为PNG、JPG文件</span> <span>体积小于2MB的图片</span> <span>请确认图片各项内容清晰可见以便审核</span></div>
                        </div>
                    </Row>
                </div>)
        } else if (this.state.cardType == 1) {//护照
            return (
                <div>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                disabled={this.state.disabled}
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("护照号码")}>
                                <Input placeholder="请输入"
                                    maxLength={50}
                                    {...getFieldProps(`citizenCode`)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="upload_file_layer1">
                        <div className={"clearfix " + this.state.display_noneD}>
                            <Form.Item>
                                <Upload
                                    {...getFieldProps('fileListD', {
                                        ...ComponentDefine.upload_.uploadForm,
                                    })}
                                    {...this.uploadPropsD}
                                >
                                    <Icon type="plus" />
                                    <div className="ant-upload-text">上传照片</div>
                                </Upload>
                            </Form.Item>
                            <Modal visible={this.state.priviewVisibleD} footer={null} onCancel={this.handleCancel}>
                                <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                            </Modal>
                        </div>
                        <div className="upload_file_layer1_con">
                            <h2>上传护照</h2>
                            <div className="upload_file_layer1_con_text"><span>请上传格式为PNG、JPG文件</span> <span>体积小于2MB的图片</span> <span>请确认图片各项内容清晰可见以便审核</span></div>
                        </div>
                    </Row>
                </div>)
        }
    }

    phoneBlur = e => {
        let phone = e.target.value
        let reg = new RegExp("^1\\d{10}$")
        if (reg.test(phone)) {
            axios.get("@/reuse/user/matchingUserByPhone", {
                params: {
                    phone
                }
            }).then(({ data: r }) => {
                if (!r) { return }
                this.setState({
                    disabled: true,
                    uuids: r.uuids
                })
                this.infoInsert(r)
            })
        }
    }
    //手机与邮箱显示切换
    phoneAndEmailShow = () => {
        if (this.props.switchShow == 1) {//(管理员)添加或修改员工
            const { getFieldProps } = this.props.form;
            const leftSpan = 5;
            const span = 14;
            return (
                <div>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("手机号码")}>
                                <Input placeholder="请输入"
                                    disabled={this.state.disabled}
                                    maxLength={11}
                                    {...getFieldProps(`phone`, {
                                        rules: [
                                            { required: true, message: "请输入手机号" },
                                            { pattern: RegularDefine.telephone(), message: '请输入正确的手机号' }
                                        ]
                                    })}
                                    onBlur={this.phoneBlur}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("电子邮箱")}>
                                <Input placeholder="请输添加账号的电子邮箱"
                                    disabled={this.state.disabled}
                                    maxLength={40}
                                    {...getFieldProps(`email`, {
                                        rules: [
                                            { required: true, message: "请输添加账号的电子邮箱" },
                                            { pattern: RegularDefine.isEmail(), message: '请输入正确的电子邮箱' }
                                        ]
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            )
        } else if (this.props.switchShow == 2) {
            const { getFieldProps } = this.props.form;
            const leftSpan = 5;
            const span = 14;
            return (
                <div>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("手机号码")}>
                                <Input placeholder="请输入"
                                    maxLength={11} disabled={true}
                                    {...getFieldProps(`phone`, {
                                        rules: [
                                            { required: true, message: "请输入名称" },
                                            { pattern: RegularDefine.telephone(), message: '请输入正确的手机号' }
                                        ]
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={leftSpan} />
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("电子邮箱")}>
                                <Input placeholder="请输添加账号的电子邮箱"
                                    maxLength={40} disabled={true}
                                    {...getFieldProps(`email`, {
                                        rules: [
                                            { required: true, message: "请输添加账号的电子邮箱" },
                                            { pattern: RegularDefine.isEmail(), message: '请输入正确的电子邮箱' }
                                        ]
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            )
        }
    }

    roleColumn = [
        {
            title: '项目编号',
            dataIndex: 'id',
            key: 'id',
            width:"25%",
            render: (text, record, index) =>{
                return <span title={text}>{text}</span>
            }
        },{
            title: '项目名称',
            dataIndex: 'organizationName',
            key: 'organizationName',
            width:"30%",
            render: (text, record, index) =>{
                return <span title={text}>{text}</span>
            }
        }, {
            title: '选择角色',
            dataIndex: 'roleName',
            key: 'roleName',
            width:"40%",
            render: (text, record, index) => {
                const uuids = "uuids" + record.uuids
                const {getFieldProps} = this.props.form;
                let roleData = [];
                if(this.state.uuids) {
                    let {currentList} = this.state;
                    let currentData = currentList?currentList.filter((item, index)=> {
                        return item.orgUuids == record.uuids;
                    }) : [];
                    let currentArr = currentData?currentData[0]?currentData[0].roleIds?currentData[0].roleIds.split(','):[]:[]:[];
                    this.state.roleList.forEach((item, index)=> {
                        if(currentArr.indexOf(item.id+'') != -1) {
                            roleData.push({
                                id: item.id,
                                name: item.name
                            })
                        }
                    })
                    if(roleData.length>0) {
                        roleData.unshift({'id':'43310','name':'游客'})
                        roleData.unshift({'id':'','name':'-无-'})
                    }else {
                        roleData = this.state.roleList;
                    }
                } else {
                    roleData = this.state.roleList;
                }

                return (
                    <Form.Item style={{ "width": "150px","height":"20px" }}>
                        <Select
                            style={{ "width": "150px","margin-top":"10px" }}
                            placeholder={"请选择"}
                            disabled={this.state.disabled}
                            // defaultValue={defaultV}
                            {...getFieldProps(uuids, {
                                initialValue: text,
                                onChange:this.roleChange,
                            })}
                        >
                            {roleData.map((item, index) => {
                                return (
                                    <Option key={index} value={item.id}>{item.name}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                )
            },
        }
    ];

    //列表相关
    handleSearch = (page, pageSize, event)=>{
        const params = {};
        params.page = page;
        params.pageSize = pageSize>10?pageSize:10;
        params.uuids = this.state.uuids;
        params.subPlatformId = 6;
        console.log(this.state.switchShow);
        if(this.state.switchShow == 1){//新增用户时初始化数据
            //岗位信息列表
            api.ajax("GET","@/reuse/organization/queryOrganizationListForPage", {
                ...params
            }).then(r => {
                this.setState({
                    roleSource: r.data
                },()=>{

                })
            });
        }else if(this.state.switchShow == 2 || this.state.switchShow == 3){//编辑用户时初始化数据
            //岗位信息列表
            axios.get("@/reuse/orgRoleListController/queryOrgRoleListForPage", {
                params: params
            }).then(r => {
                this.setState({
                    roleSource: r.data
                },()=>{

                })
            });
        }
    };

    closeDetail=()=>{
        this.setState({
            confirmUpdate:false,
            uuids:''
        });
        this.props.form.setFieldsValue({
            phone:""
        });
        this.getRoleList();
    }

    onChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };

    onShowSizeChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };

    render() {
        const { getFieldProps } = this.props.form;
        const leftSpan = 5;
        const span = 14;
        const rolePagination = ComponentDefine.getPagination_(this.state.roleSource,this.onChange,this.onShowSizeChange);
        const selectAfter = (
            <Select style={{ width: 80 }}
                disabled={this.state.disabled}
                {...getFieldProps(`gender`, {
                    initialValue: 1,
                    rules: [
                        { required: true, message: "请选择性别" }
                    ]
                })}
            >
                <Option value={1}>先生</Option>
                <Option value={0}>女士</Option>
            </Select>
        );
        return (
            <div className="editUser">
                <Card>
                    <Form>
                        <Row {...ComponentDefine.row_} style={{ marginBottom: "12px" }}>
                            <Col span={leftSpan} />
                            <Col span={span}>
                                <div className={"clearfix upload_file upload_file_close " + this.state.display_noneA}>
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("人员头像")}>
                                        <Upload
                                            disabled={this.state.disabled}
                                            {...getFieldProps('fileListA', {
                                                ...ComponentDefine.upload_.uploadForm,
                                            })}
                                            {...this.uploadPropsA}
                                        >
                                            <Icon type="plus" />
                                            <div className="ant-upload-text">上传照片</div>
                                        </Upload>
                                    </Form.Item>
                                    <Modal visible={this.state.priviewVisibleA} footer={null} onCancel={this.handleCancel}>
                                        <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                                    </Modal>
                                    <div>
                                        <div className="upload_h2">上传个人头像</div>
                                        <div className="upload_text"><span>请上传格式为PNG、JPG文件</span><span>体积小于2MB的图片</span><span>请确认图片各项内容清晰可见以便审核</span></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span={leftSpan} />
                            <Col span={span}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    required
                                    label={getDetailsLabel("真实姓名")}>
                                    <Input placeholder="请输入与身份证一致的真实姓名"
                                        disabled={this.state.disabled}
                                        maxLength={30} addonAfter={selectAfter}
                                        {...getFieldProps(`username`, {
                                            rules: [
                                                { required: true, message: "请输入名称" }
                                            ]
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {/*手机号码有邮箱*/}
                        {this.phoneAndEmailShow()}
                        <Row {...ComponentDefine.row_}>
                            <Col span={leftSpan}/>
                            <Col span={span}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    required
                                    label={getDetailsLabel("通信地址")}
                                >
                                    <Row className="height35" style={{ height: '35px' }}>
                                        <Col span={8} style={{paddingLeft:"3px",paddingRight:"3px"}}>
                                            <Form.Item>
                                                <Select placeholder="请选择" showSearch={true}
                                                        disabled={this.state.disabled}
                                                        {...getFieldProps(`province`, {
                                                            validateTrigger:"onBlur",
                                                            onChange:this.provinceChange,
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择'
                                                            }]
                                                        })}
                                                >
                                                    {
                                                        this.state.provinceList.map((item, index) => {
                                                            return (
                                                                <Option key={index}
                                                                        value={item.provinceCode}>{item.provinceName}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} style={{paddingRight:"6px"}}>
                                            <Form.Item>
                                                <Select placeholder="请选择" showSearch={true}
                                                        disabled={this.state.disabled}
                                                        {...getFieldProps(`city`, {
                                                            validateTrigger:"onBlur",
                                                            onChange:this.cityChange,
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择'
                                                            }]
                                                        })}
                                                >
                                                    {
                                                        this.state.cityList.map((item, index) => {
                                                            return (
                                                                <Option key={index}
                                                                        value={item.cityCode}>{item.cityName}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} style={{paddingLeft:"6px"}}>
                                            <Form.Item>
                                                <Select placeholder="请选择" showSearch={true}
                                                        disabled={this.state.disabled}
                                                        {...getFieldProps(`area`, {
                                                            validateTrigger:"onBlur",
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择'
                                                            }]
                                                        })}
                                                >
                                                    {
                                                        this.state.areaList.map((item, index) => {
                                                            return (
                                                                <Option key={index}
                                                                        value={item.areaName}>{item.areaName}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/*通讯地址*/}
                        <Row {...ComponentDefine.row_}>
                            <Col span={leftSpan} />
                            <Col span={span}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    required
                                    label={getDetailsLabel("通讯地址")}>
                                    <Input placeholder="请输入您的地址以便邮寄文件"
                                        disabled={this.state.disabled}
                                        maxLength={60}
                                        style={{ paddingRight: "49px" }}
                                        {...getFieldProps(`address`, {
                                            rules: [
                                                { required: true, message: "请输入您的地址" }
                                            ],
                                            onChange: this.changeAddress
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2} style={{ position: "absolute", bottom: "29px", left: "71%" }}>
                                {this.state.addressLength}/60
                            </Col>
                        </Row>
                        {/*证件类型*/}
                        <Row {...ComponentDefine.row_}>
                            <Col span={leftSpan} />
                            <Col span={span}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("证件类型")}>
                                    <Radio.Group
                                        disabled={this.state.disabled}
                                        {...getFieldProps(`cardType`, {
                                            onChange: this.onChangeCardType,
                                            initialValue: this.state.cardType
                                        })}
                                    >
                                        <Radio value={0}>身份证</Radio>
                                        <Radio value={1}>护照</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/*证件号码与附件*/}
                        {this.showCardType()}
                        <Row {...ComponentDefine.row_}>
                            <Col span={leftSpan}/>
                            <Col span={span}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("账号期限")}>
                                    <Radio.Group disabled={this.state.switchShow==2 || this.state.disabled ? true : false}
                                                 {...getFieldProps(`valid`,{
                                                     onChange:this.onChangeValid,
                                                     initialValue:this.state.valid
                                                 })}
                                    >
                                        <Radio  value={0}>永久有效</Radio>
                                        <Radio  value={1}>设置有效期</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}  style={{display:(this.state.switchShow==1&&this.state.valid=="1")?"block":"none"}}>
                            <Col span={leftSpan}/>
                            <Col span={span}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("有效期限")}
                                >
                                    <DatePicker
                                        disabled={this.state.disabled}
                                        disabledDate={disabledDate}
                                        {...getFieldProps(`validDate`, {
                                            onChange:this.timeChange
                                        })}
                                        style={{ "width": "100%" }}
                                        format="yyyy/MM/dd"

                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}  style={{display:(this.state.switchShow==2&&this.state.valid=="1")?"block":"none"}}>
                            <Col span={leftSpan}/>
                            <Col span={span}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("有效期限")}>
                                    <Input placeholder="请添加账号的有效期限"
                                           maxLength={40} disabled={true}
                                           {...getFieldProps(`validStr`)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card className="card-margin-bottom ant-card-extra-top-8"  title="权限配置">
                    <Table
                        rowKey={record => record.uuids}
                        rowClassName={(record, index) => record.isDefault  === 1 ? 'department' : ''}
                        {...ComponentDefine.table_}
                        pagination={rolePagination}
                        columns={this.roleColumn}
                        scroll={{ x: 950}}
                        rowSelection={null}
                        dataSource={this.state.roleSource.list}
                    />
                </Card>
                <div>
                    <DetailsBtns>
                        <PermissionsBtn noauth>
                            <Button type="back" onClick={this.props.callback}>返回</Button>
                            {this.props.switchShow == 1 ? <Button type="primary" onClick={this.confirm} loading={this.state.loading}>保存</Button> : <none></none>}
                            {this.props.switchShow == 2 ?
                                <Popconfirm placement="topLeft" title={"确认保存吗?"} onConfirm={this.confirm}>
                                    <Button type="primary" loading={this.state.loading}>保存</Button>
                                </Popconfirm>
                                : <none></none>}
                        </PermissionsBtn>
                    </DetailsBtns>
                </div>
            </div>
        )
    }
}

export default Form.create()(EditUser)
