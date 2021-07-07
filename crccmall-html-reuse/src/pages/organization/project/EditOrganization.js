import { Radio, Popconfirm, message, Timeline, Select, Card, InputNumber, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs, Tooltip, Checkbox, Alert } from 'antd';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import EditOrganizationUser from './EditOrganizationUser';//新增/修改组织机构编辑员工
import moment from 'moment';//时间格式转换
import search_no_project from '@/static/img/search_no_project.png';
import EditOrganizationIcon from '@/static/img/projectTitle.png';
import warning_icon from '@/static/img/warning_icon.png'
import "./organization.css";
import history from "@/utils/history";
import { session } from "@/utils/storage";

const Option = Select.Option;//下拉内容
const RangePicker = DatePicker.RangePicker;//日期组；
class EditOrganization extends React.Component {
    /*static defaultProps = {
        switchShow: session.getItem('projectShow'),
        organization: JSON.parse(session.getItem('projectOrganization')),
        close() {
            history.push('/organization/project');
        },
    };*/
    constructor(props) {
        super(props);
        this.state = {
            totalPriceForLjcg: {},
            has_pp: false,
            managerList: [],//管理员下拉
            dataSource: {},//组织机构基本信息
            userList: [],//账号员工list
            visible: false,
            disabled: true,//组织机构类型禁用标识
            type: 0,//组织机构类型
            typeArr: [
                { value: 0, text: "部门" },
                { value: 1, text: "项目" },
            ],
            projectType: null,//项目类型
            projectTypeArr: [
                { value: 1, text: "市政工程" },
                { value: 2, text: "建筑工程" },
                { value: 3, text: "轨道工程" },
                { value: 4, text: "桥梁工程" },
                { value: 5, text: "铁路工程" },
                { value: 6, text: "公路工程" },
                { value: 7, text: "隧道工程" },
            ],
            projectStatus: null,//项目状态
            projectStatusArr: [
                { value: 1, text: "筹备" },
                { value: 2, text: "实施" },
                { value: 3, text: "暂停" },
                { value: 4, text: "废止" },
            ],
            provinceList: [],//省
            cityList: [],//市
            areaList: [],//县
            provinceName: '',
            cityName: '',
            areaName: '',
            pageloading: true,
            saveLoading: false,
            organizationNameLength: 0,//组织机构名称长度
            lxFlag: this.props.organization ? this.props.organization.isApproved : 1,
            lxData: {},
            lxConfrimFlag: false,
            confirmFlag: false,
            searchNoData: false,

            jcv: false,
            jcd: null,
            ppLoa: false,
            od: false,
            matchingLy: '02',

            sbv: false,
            sbd: null,
        }
    }
    closeJcV = () => {
        this.setState(
            {
                jcv: false
            }
        )
    };
    closeSbV = () => {
        this.setState(
            {
                sbv: false
            }
        )
    };
    yesJcV = () => {
        this.getCityList(this.state.jcd.province, 1);
        this.getAreaList(this.state.jcd.city, 1);
        this.props.form.setFieldsValue({
            orgId: this.state.jcd.projectCode,
            organizationName: this.state.jcd.projectName,
            time: [moment(this.state.jcd.constructionCycle).format("YYYY/MM/DD"), moment(this.state.jcd.constructionCycleEnd).format("YYYY/MM/DD")],
            projectType: this.state.jcd.projectTypeCode ? +this.state.jcd.projectTypeCode : null,
            projectStatus: this.state.jcd.currentSituationCode ? +this.state.jcd.currentSituationCode : null,
            province: this.state.jcd.province,
            city: this.state.jcd.city,
            area: this.state.jcd.area,
            detailAddress: this.state.jcd['detail_address'],
        });
        this.setState(
            {
                has_pp: true,
                jcv: false,
                od: true,
                provinceName: this.state.jcd.provinceName,
                cityName: this.state.jcd.cityName,
                areaName: this.state.jcd.areaName,
            }
        );
    };
    //组织机构名称
    organizationNameChange = (e) => {
        this.setState({
            organizationNameLength: e.target.value.length,
        })
    };

    componentWillMount() {
        axios.get("@/reuse/organization/getManagerList").then(r => {
            this.setState({
                managerList: r.data.rows
            });
        });
        //省初始化
        this.getProvinceList();
        if (this.props.organization && this.props.organization.id) {
            this.getTotalPriceForLjcg(this.props.organization.id)
        }

        //其它数据初始化
        // const uuids = this.props.match;
        if (this.props.switchShow == '1') {//新增数据初始化
            //禁用组织类型,默认只能新增项目
            //启用立项状态单选框
            //未立项,显示立项相关提示信息;已立项,隐藏立项相关提示信息
            this.props.form.setFieldsValue({
                type: 1
            });
            this.setState({
                type: 1,
                pageloading: false
            });
        } else if (this.props.switchShow == '2') {
            this.setState({
                type: this.props.organization.type,
                dataSource: this.props.organization
            });
            if (this.props.organization.type == 1) {
                if (this.props.organization.province && this.props.organization.city) {
                    this.getCityList(this.props.organization.province, 1);
                    this.getAreaList(this.props.organization.city, 1);
                } else {
                    this.props.form.setFieldsValue({
                        ...this.props.organization,
                        time: [
                            this.props.organization.beginTime ? moment(this.props.organization.beginTime).format("YYYY/MM/DD") : "",
                            this.props.organization.endTime ? moment(this.props.organization.endTime).format("YYYY/MM/DD") : "",
                        ]
                    });
                    this.setState({
                        pageloading: false
                    })
                }
            } else {
                this.props.form.setFieldsValue({
                    ...this.props.organization
                });
                this.setState({
                    pageloading: false
                })
            }

            //查询当前部门下员工全部信息
            const params = {};
            params.uuids = this.props.organization.uuids;
            axios.get("@/reuse/organization/getUserList", {
                params: params
            }).then(r => {
                this.setState({
                    userList: r.data
                });
            });
            if (this.props.organization.organizationName) {
                this.setState({
                    organizationNameLength: this.props.organization.organizationName.length
                });
            }
        }

    };

    //累计采购金额
    getTotalPriceForLjcg = (id) => {
        axios.get("@/reuse/organization/getStatisticsByOrgId", {
            params: { id }
        }).then(r => {

            this.setState({
                totalPriceForLjcg: r.data
            });
        });
    };
    //省市区初始化
    getProvinceList = () => {
        axios.get("@/reuse/address/getProvinceList", {
            params: {}
        }).then(r => {
            if (r.data != null) {
                this.setState({
                    provinceList: r.data.data.rows
                });

                //初始化省名
                if (this.props.organization) {
                    let st = r.data.data.rows.find(value => value.provinceCode === this.props.organization.province);
                    if (st) {
                        this.setState({
                            provinceName: st.provinceName
                        });
                    }
                }
            }
        });
    };
    //省市区初始化
    getCityList = (provinceCode, type) => {
        this.props.form.resetFields(["city"]);
        this.props.form.resetFields(["area"]);
        axios.get("@/reuse/address/getCityList", {
            params: { provinceCode: provinceCode }
        }).then(r => {
            if (r.data != null) {
                if (type) {
                    this.setState({
                        cityList: r.data.data.rows
                    })
                } else {
                    this.setState({
                        cityList: r.data.data.rows,
                        areaList: []
                    })
                }

                //初始化市名
                if (this.props.organization) {
                    let st = r.data.data.rows.find(value => value.cityCode === this.props.organization.city);
                    if (st) {
                        this.setState({
                            cityName: st.cityName
                        });
                    }
                }
            }
        });
    };
    //省市区初始化
    getAreaList = (cityCode, type) => {
        this.props.form.resetFields(["area"]);
        axios.get("@/reuse/address/getAreaList", {
            params: { cityCode: cityCode }
        }).then(r => {
            if (r.data != null) {
                this.setState({
                    areaList: r.data.data.rows
                }, () => {
                    if (type && Object.keys(this.props.organization).length) {
                        this.props.form.setFieldsValue({
                            ...this.props.organization,
                            time: [
                                this.props.organization.beginTime ? moment(this.props.organization.beginTime).format("YYYY/MM/DD") : "",
                                this.props.organization.endTime ? moment(this.props.organization.endTime).format("YYYY/MM/DD") : "",
                            ]
                        });
                    }

                    this.setState({
                        pageloading: false
                    })

                    //初始化区名
                    if (this.props.organization) {
                        let st = this.state.areaList.find(value => value.areaCode === this.props.organization.area);
                        if (st) {
                            this.setState({
                                areaName: st.areaName
                            });
                        }
                    }
                })
            }
        });
    };
    //省市区初始化
    AreaChange = code => {
        let st = this.state.areaList.find(value => value.area === code);
        if (st) {
            this.setState({
                areaName: st.areaName
            });
        }
    };
    //确定按钮事件
    save = (isCover) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            let isApproved = this.props.form.getFieldValue('isApproved');
            if (errors != null) {
                if (isApproved == 1) {
                    delete errors["orgId"]
                } else if (isApproved == 2) {
                    delete errors["organizationName"]
                }
            }

            if (!!errors) {
                if (Object.keys(errors).length > 0) {
                    if (this.state.type == 0) {//部门验证
                        if (errors.organizationName && errors.ownUserId) {
                            //部门只验证部门名称与负责人
                            return;
                        } else {
                            //部门验证通过
                        }
                    } else if (this.state.type == 1) {//机构验证
                        return;
                    }
                }

            }
            //参数处理
            let formData = this.props.form.getFieldsValue();
            let confirmFlag = this.state.confirmFlag;

            formData.isApproved = this.state.has_pp ? (this.state.jcd.is_approved === '2' ? 2 : 1) : (this.state.lxFlag === 1 ? 1 : 2)
            if (this.props.switchShow == "1") {//新增
                if (isApproved == 2 && !this.state.jcd) {
                    message.warning("请完善并确认项目信息")
                    return;
                }
                // if(isApproved == 2){
                //     formData.organizationName = this.state.lxData.organizationName;
                //     formData.orgId = this.state.lxData.organizationNo;
                // }
            } else if (this.props.switchShow == "2") {//修改
                if (this.props.organization.isApproved == "1" && isApproved == 2 && !confirmFlag) {
                    message.warning("请完善并确认项目信息")
                    return;
                }
                // if(this.props.organization.isApproved == "1" && isApproved == 2){
                //     formData.organizationName = this.state.lxData.organizationName;
                //     formData.orgId = this.state.lxData.organizationNo;
                // }else if(this.props.organization.isApproved == "2" && isApproved == 2){
                //     formData.organizationName = this.state.dataSource.organizationName
                //     formData.orgId = this.state.dataSource.orgId;
                // }
            }

            if (this.state.saveLoading) {
                return
            }
            this.setState({
                saveLoading: true
            })

            if (this.state.type == 0) {//部门需要保存的信息
                formData = { type: formData.type, organizationName: formData.organizationName, ownUserId: formData.ownUserId }
            } else if (this.state.type == 1) {//项目需要保存的信息
                if (formData.time) {
                    formData.beginTime = moment(formData.time[0]).format("YYYY-MM-DD HH:mm:ss");
                    formData.endTime = moment(formData.time[1]).format("YYYY-MM-DD HH:mm:ss");
                    delete formData.time;
                }
            }
            let userList = this.state.userList;
            for (let i = 0; i < userList.length; i++) {
                userList[i].dispatchDate = userList[i].dispatchDate ? moment(userList[i].dispatchDate).format("YYYY/MM/DD HH:mm:ss") : ""
            }
            if (this.repeatCcheck(formData, userList)) {
                message.error("项目/部门的负责人不能关联到该项目/部门的员工里");
                this.setState({
                    saveLoading: false
                })
                return;
            }


            const params = { ...formData };
            params.userListStr = JSON.stringify(userList);
            params.isCover = isCover;
            params.dataSource = this.state.matchingLy;
            params.provinceName = this.state.provinceName;
            params.cityName = this.state.cityName;
            params.areaName = this.state.areaName
            //新增与修改的区分
            if (this.props.switchShow == '1') {//新增保存
                axios.post("@/reuse/organization/insertOrganization", {
                    ...params
                }).then(r => {//返回处理
                    this.setState({
                        saveLoading: false
                    })
                    if (r.code == '000000') {
                        this.closeSbV();
                        message.success("保存成功!");
                        this.props.callback();
                    } else {
                        message.error(r.msg || '保存失败！');
                    }
                }, (r) => {
                    this.setState({
                        saveLoading: false
                    })
                    message.error(r.msg || '保存失败！');
                })
            } else if (this.props.switchShow == '2') {//修改保存
                params.uuids = this.state.dataSource.uuids;
                axios.post("@/reuse/organization/updateOrganization", {
                    ...params
                }).then(r => {//返回处理
                    if (r.code == '000000') {
                        this.closeSbV();
                        message.success("保存成功!");
                        this.props.callback();
                    } else {
                        message.error(r.msg || '保存失败！');
                    }
                    this.setState({
                        loading: false
                    })
                }, (r) => {
                    message.error(r.msg || '保存失败！');
                    this.setState({
                        saveLoading: false
                    })
                })
            }
        });
    };
    checkSave = () => {
        if (this.state.jcd) {
            this.props.form.validateFieldsAndScroll((errors, values) => {
                if (errors) {
                    return;
                }
                //参数处理
                let formData = this.props.form.getFieldsValue();

                if (formData.time) {
                    formData.beginTime = moment(formData.time[0]).format("YYYY-MM-DD HH:mm:ss");
                    formData.endTime = moment(formData.time[1]).format("YYYY-MM-DD HH:mm:ss");
                    delete formData.time;
                }
                let userList = this.state.userList;
                for (let i = 0; i < userList.length; i++) {
                    userList[i].dispatchDate = userList[i].dispatchDate ? moment(userList[i].dispatchDate).format("YYYY/MM/DD HH:mm:ss") : ""
                }
                if (this.repeatCcheck(formData, userList)) {
                    message.error("项目/部门的负责人不能关联到该项目/部门的员工里");
                    return;
                }
                formData.projectTypeName = this.state.projectTypeArr.find(value => value.value == formData.projectType).text;
                formData.projectLocation = this.state.provinceName + this.state.cityName + this.state.areaName + formData.detailAddress;
                let ter = this.state.projectStatusArr.find(value => value.value == formData.projectStatus);
                formData.projectStatus = ter ? ter.text : formData.projectStatus;
                this.setState({
                    sbv: true,
                    sbd: formData
                })
            })
        } else {
            this.save(0);
        }
    };
    //确定按钮事件
    insertSave = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            let isApproved = this.props.form.getFieldValue('isApproved');
            if (errors != null) {
                if (isApproved == 1) {
                    delete errors["orgId"]
                } else if (isApproved == 2) {
                    delete errors["organizationName"]
                }
            }

            if (!!errors) {
                if (Object.keys(errors).length > 0) {
                    if (this.state.type == 0) {//部门验证
                        if (errors.organizationName && errors.ownUserId) {
                            //部门只验证部门名称与负责人
                            return;
                        } else {
                            //部门验证通过
                        }
                    } else if (this.state.type == 1) {//机构验证
                        return;
                    }
                }

            }
            //参数处理
            let formData = this.props.form.getFieldsValue();
            let confirmFlag = this.state.confirmFlag;

            formData.isApproved = isApproved;
            if (this.props.switchShow == "1") {//新增
                if (isApproved == 2 && !confirmFlag) {
                    message.warning("请完善并确认项目信息")
                    return;
                }
                if (isApproved == 2) {
                    formData.organizationName = this.state.lxData.organizationName;
                    formData.organizationNo = this.state.lxData.organizationNo;
                }
            } else if (this.props.switchShow == "2") {//修改
                if (this.props.organization.isApproved == "1" && isApproved == 2 && !confirmFlag) {
                    message.warning("请完善并确认项目信息")
                    return;
                }
                if (this.props.organization.isApproved == "1" && isApproved == 2) {
                    formData.organizationName = this.state.lxData.organizationName;
                    formData.organizationNo = this.state.lxData.organizationNo;
                } else if (this.props.organization.isApproved == "2" && isApproved == 2) {
                    formData.organizationName = this.state.dataSource.organizationName
                    formData.organizationNo = this.state.dataSource.organizationNo;
                }
            }

            if (this.state.saveLoading) {
                return
            }
            this.setState({
                saveLoading: true
            })

            if (this.state.type == 0) {//部门需要保存的信息
                formData = { type: formData.type, organizationName: formData.organizationName, ownUserId: formData.ownUserId }
            } else if (this.state.type == 1) {//项目需要保存的信息
                if (formData.time) {
                    formData.beginTime = moment(formData.time[0]).format("YYYY-MM-DD HH:mm:ss");
                    formData.endTime = moment(formData.time[1]).format("YYYY-MM-DD HH:mm:ss");
                    delete formData.time;
                }
            }
            let userList = this.state.userList;
            for (let i = 0; i < userList.length; i++) {
                userList[i].dispatchDate = userList[i].dispatchDate ? moment(userList[i].dispatchDate).format("YYYY/MM/DD HH:mm:ss") : ""
            }
            if (this.repeatCcheck(formData, userList)) {
                message.error("项目/部门的负责人不能关联到该项目/部门的员工里");
                this.setState({
                    saveLoading: false
                })
                return;
            }
            //新增与修改的区分
            if (this.props.switchShow == '1') {//新增保存
                const params = { ...formData };
                params.userListStr = JSON.stringify(userList);
                axios.post("@/reuse/organization/insertOrganization", {
                    ...params
                }).then(r => {//返回处理
                    if (r) {
                        this.setState({
                            saveLoading: false
                        })
                        message.success("保存成功!");
                    }
                    this.props.callback();
                }, () => {
                    this.setState({
                        saveLoading: false
                    })
                })
            } else if (this.props.switchShow == '2') {//修改保存
                const params = { ...formData };
                params.userListStr = JSON.stringify(userList);
                params.uuids = this.state.dataSource.uuids;
                axios.post("@/reuse/organization/updateOrganization", {
                    ...params
                }).then(r => {//返回处理
                    if (r) {
                        this.setState({
                            loading: false
                        })
                        message.success("保存成功!");
                    }
                    this.props.callback();
                }, () => {
                    this.setState({
                        saveLoading: false
                    })
                })
            }

        });
    }
    //确定按钮事件
    updateSave = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            let isApproved = this.props.form.getFieldValue('isApproved');
            if (errors != null) {
                if (isApproved == 1) {
                    delete errors["orgId"]
                } else if (isApproved == 2) {
                    delete errors["organizationName"]
                }
            }

            if (!!errors) {
                if (Object.keys(errors).length > 0) {
                    if (this.state.type == 0) {//部门验证
                        if (errors.organizationName && errors.ownUserId) {
                            //部门只验证部门名称与负责人
                            return;
                        } else {
                            //部门验证通过
                        }
                    } else if (this.state.type == 1) {//机构验证
                        return;
                    }
                }

            }
            //参数处理
            let formData = this.props.form.getFieldsValue();
            let confirmFlag = this.state.confirmFlag;

            formData.isApproved = isApproved;
            if (this.props.switchShow == "1") {//新增
                if (isApproved == 2 && !confirmFlag) {
                    message.warning("请完善并确认项目信息")
                    return;
                }
                if (isApproved == 2) {
                    formData.organizationName = this.state.lxData.organizationName;
                    formData.organizationNo = this.state.lxData.organizationNo;
                }
            } else if (this.props.switchShow == "2") {//修改
                if (this.props.organization.isApproved == "1" && isApproved == 2 && !confirmFlag) {
                    message.warning("请完善并确认项目信息")
                    return;
                }
                if (this.props.organization.isApproved == "1" && isApproved == 2) {
                    formData.organizationName = this.state.lxData.organizationName;
                    formData.organizationNo = this.state.lxData.organizationNo;
                } else if (this.props.organization.isApproved == "2" && isApproved == 2) {
                    formData.organizationName = this.state.dataSource.organizationName
                    formData.organizationNo = this.state.dataSource.organizationNo;
                }
            }

            if (this.state.saveLoading) {
                return
            }
            this.setState({
                saveLoading: true
            })

            if (this.state.type == 0) {//部门需要保存的信息
                formData = { type: formData.type, organizationName: formData.organizationName, ownUserId: formData.ownUserId }
            } else if (this.state.type == 1) {//项目需要保存的信息
                if (formData.time) {
                    formData.beginTime = moment(formData.time[0]).format("YYYY-MM-DD HH:mm:ss");
                    formData.endTime = moment(formData.time[1]).format("YYYY-MM-DD HH:mm:ss");
                    delete formData.time;
                }
            }
            let userList = this.state.userList;
            for (let i = 0; i < userList.length; i++) {
                userList[i].dispatchDate = userList[i].dispatchDate ? moment(userList[i].dispatchDate).format("YYYY/MM/DD HH:mm:ss") : ""
            }
            if (this.repeatCcheck(formData, userList)) {
                message.error("项目/部门的负责人不能关联到该项目/部门的员工里");
                this.setState({
                    saveLoading: false
                })
                return;
            }
            //新增与修改的区分
            if (this.props.switchShow == '1') {//新增保存
                const params = { ...formData };
                params.userListStr = JSON.stringify(userList);
                axios.post("@/reuse/organization/insertOrganization", {
                    ...params
                }).then(r => {//返回处理
                    if (r) {
                        this.setState({
                            saveLoading: false
                        })
                        message.success("保存成功!");
                    }
                    this.props.callback();
                }, () => {
                    this.setState({
                        saveLoading: false
                    })
                })
            } else if (this.props.switchShow == '2') {//修改保存
                const params = { ...formData };
                params.userListStr = JSON.stringify(userList);
                params.uuids = this.state.dataSource.uuids;
                axios.post("@/reuse/organization/updateOrganization", {
                    ...params
                }).then(r => {//返回处理
                    if (r) {
                        this.setState({
                            loading: false
                        })
                        message.success("保存成功!");
                    }
                    this.props.callback();
                }, () => {
                    this.setState({
                        saveLoading: false
                    })
                })
            }

        });
    }

    //管理员与员工重复校验
    repeatCcheck = (formData, userList) => {
        let result = false;
        let ownUserId = formData.ownUserId;
        let arr = userList;
        for (let i = 0; i < arr.length; i++) {
            if (ownUserId == arr[i].userId) {
                result = true;
            }
        }
        return result;
    }

    //项目与部门radio切换事件
    onChange = (e) => {
        this.setState({
            type: e.target.value
        });
    };

    //地区选择
    handleSelect = (label, value, option) => {
        let state = this.state;
        state[label] = option.props.children;
        this.setState({
            ...state
        })
    }

    columns = [{
        title: '添加时间',
        dataIndex: 'dispatchDate',
        className: 'text_right',
        key: 'dispatchDate',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "140px" }}><span>{text ? moment(text).format("YYYY/MM/DD HH:mm:ss") : ""}</span></p>
        },
    }, {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record, index) => (
            <span>
                <Popconfirm title="删除员工后,该员工将无法选择本项目下单,是否确定删除?" onConfirm={this.removeUesr.bind(this, record.userId)}>
                    <a>删除</a>
                </Popconfirm>
            </span>
        )
    }];

    //默认部门展示columns
    columnsDefault = [{
        title: '添加时间',
        dataIndex: 'dispatchDate',
        key: 'dispatchDate',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "140px" }}><span>{text ? moment(text).format("YYYY/MM/DD HH:mm:ss") : ""}</span></p>
        },
    }, {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }, {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{ width: "100px" }}><span title={text}>{text}</span></p>
        },
    }];

    //移除下方列表指定员工
    removeUesr = (userId) => {
        let rows = this.state.userList;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].userId == userId) {
                rows.splice(i, 1);
            }
        }
        this.setState({
            userList: rows
        })
    }

    //打开编辑员工模态框
    openEditUser = () => {
        this.setState({
            visible: true
        })
    }

    //关闭编辑员工模态框
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    //保存编辑员工模态框
    saveEditUser = (userList) => {
        this.setState({
            userList: userList
        })
        this.handleCancel();
    }

    lxChange = (v) => {
        this.setState({
            has_pp: false,
            lxFlag: v.target.value,
            jcd: null
        });

        /* if(v.target.value == 1){
             this.props.form.validateFields(['projectCode'], { force: false })
         }*/
        //this.props.form.validateFields(['projectCode'], { force: false })
    }
    confirmChange = (v) => {
        this.setState({
            confirmFlag: v.target.checked
        });
    }

    searchProjectInfo = () => {
        this.props.form.validateFields(["orgId"], (err, fieldsValue) => {
            if (err) {
                return;
            } else {
                this.setState({
                    ppLoa: true
                })
                // isApproved       1:未立项  2:已立项
                // nameOrCode      项目名称或项目编号
                let isApproved = this.props.form.getFieldValue('isApproved');
                let nameOrCode = isApproved === 2 ? this.props.form.getFieldValue('orgId') : this.props.form.getFieldValue('organizationName');
                axios.get("@/reuse/organization/matching", {
                    params: { isApproved, nameOrCode }
                }).then(({ data }) => {
                    let msg = isApproved === 2 ? '未找到与编号匹配的项目，请核对项目编号是否填写正确' : '未找到与名称匹配的项目，请核对项目名称是否填写正确';
                    if (data === null || JSON.stringify(data) === "{}") {
                        message.warning(msg);
                        this.setState(
                            {
                                ppLoa: false,
                            }
                        )
                    } else {
                        let province = this.state.provinceList.find(value => value.provinceCode === data.province)
                        let provinceName = province ? province.provinceName : ''
                        let cityName = '';
                        let areaName = '';
                        if (data.province) {
                            axios.get("@/reuse/address/getCityList", {
                                params: { provinceCode: data.province }
                            }).then(r => {
                                let city = r.data.data.rows.find(v => v.cityCode === data.city)
                                cityName = city ? city.cityName : '';
                                if (data.city) {
                                    axios.get("@/reuse/address/getAreaList", {
                                        params: { cityCode: data.city }
                                    }).then(a => {
                                        let area = a.data.data.rows.find(av => av.areaCode === data.area)
                                        areaName = area ? area.areaName : '';
                                        let site = provinceName + cityName + areaName + data['detail_address'];
                                        this.setState(
                                            {
                                                ppLoa: false,
                                                jcv: true,
                                                jcd: { ...data, site, projectLocation: site, provinceName, cityName, areaName }
                                            }
                                        )
                                    })
                                } else {
                                    this.setState(
                                        {
                                            ppLoa: false,
                                            jcv: true,
                                            jcd: { ...data, site: '', projectLocation: '', provinceName, cityName, areaName }
                                        }
                                    )
                                }
                            });
                        } else {
                            this.setState(
                                {
                                    ppLoa: false,
                                    jcv: true,
                                    jcd: { ...data, site: '', projectLocation: '', provinceName, cityName, areaName }
                                }
                            )
                        }
                    }
                });
            }
        })
    }

    timeChange = (value, dateString) => {
        if (value) {
            if (value[0] == null && value[1] == null) {
                this.props.form.setFieldsValue({
                    time: undefined
                });

            }
        }
    }

    //项目产值
    //设置默value值
    setDefaultValue = e => {
        //通过正则判断如果输入的内容小数点后面超过4位，只取4位(\d{1,4})--->4代表4位，如果需要更多，可以直接更改数字
        //  e.target.value = e.target.value.replace(/^(-)*(\d+)\.(\d{1,4}).*$/, '$1$2.$3')
        e.target.value = e.target.value.replace(/^(-)*(\d+)\.(\d{1,2}).*$/, '$1$2.$3')
        //  console.log(e.target.value)
        //  console.log(e.target.value.length)
        this.setState({
            defaultValue: e.target.value,
        })
    }

    render() {
        //组件数据
        const pagination = ComponentDefine.getPagination_(this.state.dataSource, this.onChange, this.onShowSizeChange);
        const { getFieldProps } = this.props.form;
        //样式数据
        let span = 15;//新增修改基础信息部分表单宽度占比
        //拼图数据(组织机构类型):组织机构类型切换时动态切换展示(项目/部门)
        let typeStr = null;
        for (let i = 0; i < this.state.typeArr.length; i++) {
            if (this.state.type == this.state.typeArr[i].value) {
                typeStr = this.state.typeArr[i].text
            }
        }

        const limitDecimals = (value: string | number): string => {
            const reg = /^(\-)*(\d+)\.(\d\d).*$/;
            // const reg = /^(-)*(\d+)\.(\d{1,2}).*$/;
            // console.log(value);
            if(typeof value === 'string') {
                return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
            } else if (typeof value === 'number') {
                return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
            } else {
                return ''
            }
        };

        return (
            <div className="editOrganization">
                {/*信息展示:新增时没有*/}
                <Card className="card-margin-bottom" style={{ display: this.props.switchShow == "1" ? "none" : "block" }}>
                    <Row>
                        <Col span={12}>
                            <h2 className="order_con_title">
                                <img src={EditOrganizationIcon} />
                                <em>项目编号：</em>
                                <em>{this.state.dataSource.organizationNo}</em>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Row {...ComponentDefine.row_} className="margin_top18">
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("员工数量")}
                                    >
                                        {this.state.dataSource.count}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("订单数量")}
                                    >
                                        <p className="ant-form-text">{this.state.totalPriceForLjcg.orderCount}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("竞价数量")}
                                    >
                                        <p className="ant-form-text">{this.state.totalPriceForLjcg.sceneCount}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={14} style={{ position: "relative", top: "18px" }}>
                            <Row>
                                <Col span="12" className="order_con_layer2">
                                    <p>创建日期</p>
                                    <span>{moment(this.state.dataSource.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                                </Col>
                                <Col span="12" className="order_con_layer2">
                                    <p>项目可用资金</p>
                                    <span>¥ {this.state.dataSource.account}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                {/*新增,修改信息*/}
                <Card className="card-margin-bottom">
                    {/*组织机构类型*/}
                    <Row {...ComponentDefine.row_}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("组织类型")}
                            >
                                <Radio.Group
                                    {...getFieldProps(`type`, {
                                        onChange: this.onChange,
                                    })}
                                >
                                    {this.state.typeArr.map((type) => {
                                        return (
                                            <Radio disabled={this.state.disabled} value={type.value}>
                                                {type.text}
                                                {/*
                                                <Tooltip className="padding_left8" title={type.text}><Icon style={{marginLeft:"9px"}} type="question-circle-o"/></Tooltip>
*/}
                                            </Radio>
                                        )
                                    }
                                    )}
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("立项状态")}
                            >
                                <Radio.Group
                                    disabled={this.props.switchShow == 2 && this.props.organization.isApproved == 2}
                                    {...getFieldProps(`isApproved`, {
                                        initialValue: this.state.lxFlag,
                                        onChange: this.lxChange
                                    })}>
                                    <Radio value={1}>未在共享中心立项</Radio>
                                    <Radio value={2}>已在共享中心立项</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* 未立项 */}
                    <Row {...ComponentDefine.row_} style={{ display: (this.state.lxFlag == 2) || (this.props.switchShow == 2 && this.props.organization.isApproved == 2) ? "none" : "block" }}>
                        <Col span={24} >
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                            >
                                <div className="tishi">
                                    <em><img src={warning_icon} /></em>
                                    <span>未在财务共享中心立项的项目，将在下单时无法使用共享中心或银信付款方式付款</span>
                                    <a href="http://58.213.100.34:8003/" target="_blank">点击申请立项</a>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* 已立项 */}
                    <Row style={{ display: this.state.lxFlag == 2 ? "block" : "none" }}>
                        <Row >
                            <Col span={span} >
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("立项项目编号")}>

                                    <Input {...getFieldProps(`orgId`, {
                                        rules: [
                                            { required: this.state.lxFlag == 2, message: "请输入项目编号" }
                                        ]
                                    })} style={{ "width": "450px" }} />
                                    <p className="ant-form-text">{this.state.lxData.orgId ? this.state.lxData.orgId : ""}</p>
                                </Form.Item>
                            </Col>
                            <Col span={3} style={{ marginLeft: "-8px" }}>
                                <Button loading={this.state.ppLoa} type="primary" onClick={this.searchProjectInfo}>匹配</Button>
                            </Col>
                        </Row>
                        <Row style={{ display: this.state.lxConfrimFlag ? "block" : "none" }}>
                            <Col span={span} >
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("项目名称")}>

                                    <p className="ant-form-text">{this.state.lxData.organizationName ? this.state.lxData.organizationName : "-"}</p>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ display: this.state.lxConfrimFlag ? "block" : "none" }}>
                            <Col span={span} >
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("项目别称")}>

                                    <p className="ant-form-text">{this.state.lxData.nickName ? this.state.lxData.nickName : "-"}</p>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ display: this.state.lxConfrimFlag ? "block" : "none" }}>
                            <Col span={span} >
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("立项项目编号")}>
                                    <p className="ant-form-text">{this.state.lxData.orgId ? this.state.lxData.orgId : ""}</p>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className={"org_confirm"} style={{ display: this.state.lxConfrimFlag ? "block" : "none" }}>
                            <Col span={3}></Col>
                            <Col span={10}>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}>
                                    <Checkbox onChange={this.confirmChange}>确认</Checkbox>
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row style={{ display: this.state.searchNoData ? "block" : "none" }}>
                            <Col span={17} style={{ textAlign: "center" }}>
                                <img src={search_no_project} />
                                <p style={{ marginBottom: "30px" }}>未找到与编号匹配的项目，请核对项目编号是否填写正确</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <span className="editOrganization_hr"></span>
                            </Col>
                        </Row>
                    </Row>
                    {(() => {//修改组织机构并且已立项时,展示立项项目编号
                        if (this.props.switchShow == 2 && this.state.dataSource.type == 1 && this.state.dataSource.isApproved == 2) {
                            return (
                                <Row>
                                    <Col span={span} >
                                        <Form.Item
                                            {...ComponentDefine.form_.layout}
                                            label={getDetailsLabel("立项项目编号")}>
                                            <p className="ant-form-text">{this.state.dataSource.orgId}</p>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )
                        }
                    })()}
                    <Row {...ComponentDefine.row_} >
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel(typeStr + "名称")}>
                                <Input placeholder="请输入" maxLength={100} style={{ paddingRight: "68px" }}
                                    disabled={this.state.dataSource.isApproved == 2 || (this.props.switchShow == 2 && this.props.organization.isDefault == 1) ? true : false}
                                    {...getFieldProps(`organizationName`, {
                                        rules: [
                                            { required: this.state.lxFlag == 1 ? true : false, message: "请输入" + typeStr + "名称" }
                                        ],
                                        onChange: this.organizationNameChange,
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2} style={{ position: "absolute", transform: 'translateY(-5px)', width: '90px', bottom: "28px", left: "53%", display: this.props.switchShow == 2 && this.props.organization.isDefault == 1 ? "none" : "block" }}>
                            {this.state.organizationNameLength}/100
                        </Col>
                        {
                            (this.state.lxFlag === 1 && this.props.switchShow == "1") && <Col span={3} style={{ marginLeft: "-8px" }}>
                                <Button loading={this.state.ppLoa} type="primary" onClick={this.searchProjectInfo}>匹配</Button>
                            </Col>
                        }
                    </Row>
                    {
                        this.state.lxFlag === 1 && <Row>
                            <Col>
                                <span className="editOrganization_hr"></span>
                            </Col>
                        </Row>
                    }

                    <Row {...ComponentDefine.row_}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel(typeStr + "别称")}>
                                <Input placeholder="请输入" maxLength={100} style={{ paddingRight: "68px" }}
                                    disabled={this.state.dataSource.isApproved == 2 || (this.props.switchShow == 2 && this.props.organization.isDefault == 1) ? true : false}
                                    {...getFieldProps(`nickName`, {
                                        // onChange: this.organizationNameChange,
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目周期")}
                            >
                                <RangePicker
                                    {...getFieldProps(`time`, {
                                        onChange: this.timeChange,
                                        rules: [
                                            { required: true, message: '请选择项目周期' }
                                        ]
                                    })}
                                    style={{ "width": "100%" }}
                                    format="yyyy/MM/dd"

                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*组织机构负责人*/}
                    <Row {...ComponentDefine.row_}>
                        <Col span={span}>
                            <Form.Item
                                className={this.state.type == 1 ? "ant-form-item-tips" : ""}
                                {...ComponentDefine.form_.layout}
                                required
                                label={this.state.type == 1 ? getDetailsLabel(typeStr + "管理员", "商城平台“项目经理”为本项目网采管理员，非实际项目经理") : getDetailsLabel(typeStr + "负责人")}>
                                <Select showSearch disabled={this.props.switchShow == 2 && this.props.organization.isDefault == 1 ? true : false}
                                    style={{ "width": "100%" }}
                                    placeholder={this.state.type == 1 ? "请选择" + typeStr + "经理" : "请选择" + typeStr + "负责人"}
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    {...getFieldProps(`ownUserId`, {
                                        rules: [
                                            { required: true, message: this.state.type == 1 ? "请选择" + typeStr + "经理" : "请选择" + typeStr + "负责人" }
                                        ]
                                    })}
                                >
                                    {this.state.managerList.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.username + "(" + item.phone + ")"}</Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/*项目类型*/}
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("项目类型")}>
                                <Select
                                    style={{ "width": "100%" }}
                                    placeholder="请选择项目类型"
                                    {...getFieldProps(`projectType`, {
                                        rules: [
                                            { required: true, message: '请选择项目类型' }
                                        ]
                                    })}
                                >
                                    {this.state.projectTypeArr.map((projectType) => { return (<Option value={projectType.value}>{projectType.text}</Option>) })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*项目状态*/}
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目状态")}
                            >
                                <Select
                                    style={{ "width": "100%" }}
                                    placeholder="请选择项目状态"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    {...getFieldProps(`projectStatus`, {
                                        rules: [
                                            { required: true, message: '请选择项目状态' }
                                        ]
                                    })}
                                >
                                    {this.state.projectStatusArr.map((projectStatus) => { return (<Option value={projectStatus.value}>{projectStatus.text}</Option>) })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*项目进度*/}
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span} >
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目进度")}>

                                <Input
                                    {...getFieldProps(`projectProgress`, {
                                        rules: [{ required: true, message: "请输入项目进度" }]
                                    })}
                                    type="input"
                                    maxLength={50}
                                    placeholder="请输入项目进度"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*项目产值*/}
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span} >
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目产值")}>

                                {/* <Input
                                    {...getFieldProps(`projectValue`, {
                                        rules: [{ required: true, message: "请输入项目产值" }]
                                    })}
                                    type="input"
                                    placeholder="请输入项目产值"
                                /> */}
                                {/* <Input
                                    {...getFieldProps(`projectValue`, {
                                        // value:this.props.defaultValue,
                                        // onChange:this.setDefaultValue,
                                        rules: [{ required: true, message: "请输入项目产值" }],
                                        getValueFromEvent: (event) => {
                                             return event.target.value.replace(/^(-)*(\d+)\.(\d{1,2}).*$/, '$1$2.$3')
                                        },
                                    })}
                                    type="number"
                                    placeholder="请输入项目产值"
                                /> */}
                                <InputNumber
                                    // className="w418"
                                    style={{ "width": "418px", }}
                                    {...getFieldProps('projectValue', {
                                        rules: [
                                            { required: true, message: '请输入项目产值' },
                                        ],
                                    })}
                                    min={0.00}
                                    max={9999999999.99}
                                    step={0.01}
                                    formatter={limitDecimals}
                                    parser={limitDecimals}
                                    placeholder="请输入项目产值"></InputNumber>
                            </Form.Item>
                        </Col>
                        <Col span={2} style={{ position: "absolute", bottom: "28px", left: "54%" }}>
                            万元
                        </Col>
                    </Row>
                    {/*立项状态*/}
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("立项状态")}
                            >
                                {this.state.has_pp ? (this.state.jcd.is_approved === '2' ? '已立项' : '未立项') : (this.state.lxFlag === 1 ? '未立项' : '已立项')}
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*项目地址*/}
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none", height: '100px' }}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("项目地址")}>
                                <Row className="height55" style={{ height: '55px' }}>
                                    <Col span={8} style={{ paddingRight: "6px" }}>
                                        <Form.Item>
                                            <Select
                                                style={{ "width": "100%" }}
                                                placeholder="请选择" showSearch={true}
                                                {...getFieldProps(`province`, {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择'
                                                    }],
                                                    onChange: this.getCityList
                                                })}
                                                onSelect={(...prop) => {
                                                    this.handleSelect('provinceName', ...prop)
                                                }}
                                            >
                                                {this.state.provinceList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.provinceCode}>{item.provinceName}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingLeft: "3px", paddingRight: "3px" }}>
                                        <Form.Item>
                                            <Select
                                                style={{ "width": "100%" }}
                                                placeholder="请选择" showSearch={true}
                                                {...getFieldProps(`city`, {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择'
                                                    }],
                                                    onChange: this.getAreaList
                                                })}
                                                onSelect={(...prop) => {
                                                    this.handleSelect('cityName', ...prop)
                                                }}
                                            >
                                                {this.state.cityList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.cityCode}>{item.cityName}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingLeft: "6px" }}>
                                        <Form.Item>
                                            <Select
                                                style={{ "width": "100%" }}
                                                placeholder="请选择" showSearch={true}
                                                {...getFieldProps(`area`, {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择'
                                                    }],
                                                    onChange: this.AreaChange
                                                })}
                                                onSelect={(...prop) => {
                                                    this.handleSelect('areaName', ...prop)
                                                }}
                                            >
                                                {this.state.areaList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.areaCode}>{item.areaName}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ height: '55px' }}>
                                    <Form.Item>
                                        <Input maxLength={200}
                                            {...getFieldProps(`detailAddress`, {
                                                rules: [
                                                    { required: true, message: "请输入详细地址" }
                                                ]
                                            })}
                                            type="textarea"
                                            rows={2}
                                            placeholder="请输入详细地址"
                                        />
                                    </Form.Item>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*备注*/}
                    <p>&nbsp;</p>
                    <Row {...ComponentDefine.row_} style={{ display: this.state.type == "1" ? "block" : "none" }}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label="备注">
                                <Input {...getFieldProps(`remark`)}
                                    type="textarea" rows={4}
                                    placeholder="备注"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                </Card>
                {/*已选择/关联员工列表*/}
                <Card className="card-margin-bottom ant-card-extra-top-8" title="关联员工" extra={<Button type="primary" onClick={this.openEditUser.bind(this)} style={{ display: this.props.switchShow == 2 && this.props.organization.isDefault == 1 ? "none" : "block" }}>管理员工</Button>}>
                    <Table rowKey="ecasdasdasdasdasdOrganization"
                        {...ComponentDefine.table_}
                        rowSelection={null}
                        pagination={false}
                        columns={this.props.switchShow == 2 && this.props.organization.isDefault == 1 ? this.columnsDefault : this.columns}
                        dataSource={this.state.userList} />
                </Card>
                {/*操作按钮*/}
                <DetailsBtns>
                    <PermissionsBtn noauth>
                        <Button loading={this.state.saveLoading} type="back" onClick={this.props.callback}>返回</Button>
                        <Popconfirm placement="topLeft" title={"确认保存吗?"} onConfirm={this.checkSave}>
                            <Button type="primary" loading={this.state.saveLoading}>保存</Button>
                        </Popconfirm>
                    </PermissionsBtn>
                </DetailsBtns>
                {/*编辑员工模态框*/}
                <EditOrganizationUser
                    userList={this.state.userList}
                    visible={this.state.visible}
                    handleOk={this.saveEditUser}
                    handleCancel={this.handleCancel}
                />
                <Modal ref="modal"
                    visible={this.state.jcv}
                    title="项目信息匹配结果"
                    onOk={this.closeJcV}
                    onCancel={this.closeJcV}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.closeJcV}>信息不一致</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.yesJcV}>信息一致</Button>,
                    ]}
                >
                    <div>
                        <Alert
                            message="请核对下方的查询结果，是否为当前项目。如与当前查询的项目不一致请点击不一致并完善项目信息。如与当前项目一致请点击确认引用本项目。"
                            type="warning"
                            showIcon
                        />
                        {this.state.jcd && <Form>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="项目名称">
                                <p className="ant-form-text">{this.state.jcd.projectName}</p>
                            </Form.Item>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="立项项目编码">
                                <p className="ant-form-text">{this.state.jcd.projectCode}</p>
                            </Form.Item>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="组织周期开始时间">
                                <p className="ant-form-text">{this.state.jcd.constructionCycle}</p>
                            </Form.Item>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="组织周期结束时间">
                                <p className="ant-form-text">{this.state.jcd.constructionCycleEnd}</p>
                            </Form.Item>
                            <Form.Item


                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="项目状态">
                                <p className="ant-form-text">{this.state.jcd.currentSituationName}</p>
                            </Form.Item>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="工程类型">
                                <p className="ant-form-text">{this.state.jcd.projectTypeName}</p>
                            </Form.Item>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="立项状态">
                                <p className="ant-form-text">{this.state.jcd.is_approved === '2' ? '已立项' : '未立项'}</p>
                            </Form.Item>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                labelCol={
                                    {
                                        style: {
                                            float: "left",
                                            width: 128
                                        }
                                    }
                                }
                                style={{ marginBottom: 0 }}
                                label="项目地址">
                                <p className="ant-form-text">{this.state.jcd.site}</p>
                            </Form.Item>
                        </Form>}
                    </div>
                </Modal>
                <Modal ref="modal"
                    width={1000}
                    visible={this.state.sbv}
                    title="项目信息匹配结果"
                    onCancel={this.closeSbV}
                    footer={[
                        <Button key="back" type="ghost" loading={this.state.saveLoading} size="large" onClick={this.save.bind(this, 0)}>不覆盖</Button>,
                        <Button key="submit" type="primary" loading={this.state.saveLoading} size="large" onClick={this.save.bind(this, 1)}>覆盖</Button>,
                    ]}
                >
                    <div>
                        <Alert
                            message="如项目信息有更改，请核对下方项目信息是否填写正确。保存后将覆盖项目信息主数据， 请确保项目信息无误后覆盖或保存。"
                            type="warning"
                            showIcon
                        />
                        <div className="modelFlex">
                            {this.state.jcd && <Form style={{ flex: 1 }}>
                                <h3>原项目信息</h3>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="项目名称">
                                    <p className="ant-form-text">{this.state.jcd.projectName}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="立项项目编码">
                                    <p className="ant-form-text">{this.state.jcd.projectCode}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="组织周期开始时间">
                                    <p className="ant-form-text">{this.state.jcd.constructionCycle}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="组织周期结束时间">
                                    <p className="ant-form-text">{this.state.jcd.constructionCycleEnd}</p>
                                </Form.Item>
                                <Form.Item


                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="项目状态">
                                    <p className="ant-form-text">{this.state.jcd.currentSituationName}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="工程类型">
                                    <p className="ant-form-text">{this.state.jcd.projectTypeName}</p>
                                </Form.Item>
                                {/*<Form.Item*/}
                                {/*    {...ComponentDefine.form_.layout}*/}
                                {/*    labelCol=  {*/}
                                {/*        {*/}
                                {/*            style: {*/}
                                {/*                float: "left",*/}
                                {/*                width: 128}*/}
                                {/*        }*/}
                                {/*    }*/}
                                {/*    style={{marginBottom: 0}}*/}
                                {/*    label="立项状态">*/}
                                {/*    <p className="ant-form-text">{this.state.jcd.dataSource == '02' ? '已立项' : '未立项'}</p>*/}
                                {/*</Form.Item>*/}
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="项目地址">
                                    <p className="ant-form-text">{this.state.jcd.projectLocation}</p>
                                </Form.Item>
                            </Form>}
                            {this.state.sbd && <Form style={{ flex: 1 }}>
                                <h3>变更为</h3>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="项目名称">
                                    <p className="ant-form-text">{this.state.sbd.organizationName}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="立项项目编码">
                                    <p className="ant-form-text">{this.state.sbd.orgId}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="组织周期开始时间">
                                    <p className="ant-form-text">{this.state.sbd.beginTime}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="组织周期结束时间">
                                    <p className="ant-form-text">{this.state.sbd.endTime}</p>
                                </Form.Item>
                                <Form.Item


                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="项目状态">
                                    <p className="ant-form-text">{this.state.sbd.projectStatus}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="工程类型">
                                    <p className="ant-form-text">{this.state.sbd.projectTypeName}</p>
                                </Form.Item>
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    labelCol={
                                        {
                                            style: {
                                                float: "left",
                                                'text-align-last': 'justify',
                                                width: 128
                                            }
                                        }
                                    }
                                    style={{ marginBottom: 0 }}
                                    label="项目地址">
                                    <p className="ant-form-text">{this.state.sbd.projectLocation}</p>
                                </Form.Item>
                            </Form>}
                            {
                                this.state.sbd && <div>
                                    <h3>&nbsp;</h3>
                                    <h3 className="ant-form-res" style={{ color: this.state.jcd.projectName == this.state.sbd.organizationName ? '#02cb09' : '#ed332a' }}>{this.state.jcd.projectName == this.state.sbd.organizationName ? '未变更' : '已变更'}</h3>
                                    <h3 className="ant-form-res" style={{ color: this.state.jcd.projectCode == this.state.sbd.orgId ? '#02cb09' : '#ed332a' }}>{this.state.jcd.projectCode == this.state.sbd.orgId ? '未变更' : '已变更'}</h3>
                                    <h3 className="ant-form-res" style={{ color: this.state.jcd.constructionCycle == this.state.sbd.beginTime ? '#02cb09' : '#ed332a' }}>{this.state.jcd.constructionCycle == this.state.sbd.beginTime ? '未变更' : '已变更'}</h3>
                                    <h3 className="ant-form-res" style={{ color: this.state.jcd.constructionCycleEnd == this.state.sbd.endTime ? '#02cb09' : '#ed332a' }}>{this.state.jcd.constructionCycleEnd == this.state.sbd.endTime ? '未变更' : '已变更'}</h3>
                                    <h3 className="ant-form-res" style={{ color: this.state.jcd.currentSituationName == this.state.sbd.projectStatus ? '#02cb09' : '#ed332a' }}>{this.state.jcd.currentSituationName == this.state.sbd.projectStatus ? '未变更' : '已变更'}</h3>
                                    <h3 className="ant-form-res" style={{ color: this.state.jcd.projectTypeName == this.state.sbd.projectTypeName ? '#02cb09' : '#ed332a' }}>{this.state.jcd.projectTypeName == this.state.sbd.projectTypeName ? '未变更' : '已变更'}</h3>
                                    <h3 className="ant-form-res" style={{ color: this.state.jcd.projectLocation == this.state.sbd.projectLocation ? '#02cb09' : '#ed332a' }}>{this.state.jcd.projectLocation == this.state.sbd.projectLocation ? '未变更' : '已变更'}</h3>
                                </div>}
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(EditOrganization)
