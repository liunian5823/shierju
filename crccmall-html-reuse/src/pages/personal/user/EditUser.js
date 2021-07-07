import { Upload, Radio, Popconfirm, message, Select, Card, Form, Row, Col, Input, Button, Icon, Modal } from 'antd';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import "./user.css";
import RegularDefine from '@/utils/regularDefine'
import { viewImg } from "@/utils/urlUtils";
import { session } from "@/utils/storage";
import history from "@/utils/history";
import { connect } from 'react-redux';
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
class EditUser extends React.Component {
    static defaultProps = {
        uuids: session.getItem('userUuids'),
        switchShow: session.getItem('userShow'),
        close() {
            history.push('/organization/user');
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            dataSource: {

            },
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
            addressLength: 0//通讯地址长度,

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
        if (this.props.switchShow == 1) {//新增用户时初始化数据
            this.setState({
                cardType: 0//身份证/护照切换:0,身份证;1护照.
            })
        } else if (this.props.switchShow == 2 || this.props.switchShow == 3) {//编辑用户时初始化数据
            //查询账户基本信息
            const params = {};
            params.uuids = this.props.uuids;
            params.companyId = this.props.userInfo.companyId;
            axios.get("@/reuse/personal/getUser", {
                params: params
            }).then(({ data: r }) => {
                this.infoInsert(r)
            });
        }
    };

    infoInsert = (r) => {
        if (r.gender == null || r.gender == "") {
            r.gender = 1;
        }
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
                        onOk: this.save,
                        onCancel: () => {
                            this.setState({
                                loading: false
                            })
                        }
                    });
                } else if (this.props.switchShow == 2) {//(管理员)编辑员工信息
                    this.save();
                } else if (this.props.switchShow == 3) {//(登录人)保存个人信息
                    this.save();
                }
            }
        });
    }


    //新增修改员工保存confirmqueen回调
    save = () => {
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
            url = "@/reuse/personal/updateUser"
            params.uuids = this.props.uuids//修改时有主键
            params.userType = this.props.userInfo.userType//修改时有主键
        }
        params.username = formData.username//真实姓名
        if (formData.phone) {//电话
            params.phone = formData.phone;
        }
        if (formData.email) {//邮箱
            params.email = formData.email
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
                    window.close();
                    window.close()
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

    closeW() {
        window.close()
        window.close()
    }

    render() {
        const { getFieldProps } = this.props.form;
        const leftSpan = 5;
        const span = 14
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
                    </Form>
                </Card>
                <div>
                    <DetailsBtns>
                        <PermissionsBtn noauth>
                            {this.props.switchShow == 1 ? <Button type="primary" onClick={this.confirm} loading={this.state.loading}>保存</Button> : <none></none>}
                            {this.props.switchShow == 2 ?
                                <Popconfirm placement="topLeft" title={"确认保存吗?"} onConfirm={this.confirm}>
                                    <Button type="primary" loading={this.state.loading}>保存</Button>
                                </Popconfirm>
                                : <none></none>}
                            <Button type="ghost" onClick={this.closeW}>返回</Button>
                        </PermissionsBtn>
                    </DetailsBtns>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.authReducer.userInfo || {}
    }
}

export default Form.create()(connect(mapStateToProps)(EditUser))
