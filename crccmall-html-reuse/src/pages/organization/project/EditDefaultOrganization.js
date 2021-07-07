import {Radio,Popconfirm,message,Timeline,Select,Card, Form,Row, Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,Modal,DatePicker,Tabs,Tooltip,Checkbox } from 'antd';
import {getDetailsLabel} from  'components/page/Details';
import {DetailsBtns, PermissionsBtn} from 'components/content/DetailsBtns';
import moment from 'moment';//时间格式转换
import EditOrganizationIcon from '@/static/img/projectTitle.png';
import warning_icon from '@/static/img/warning_icon.png'
import "./organization.css";

const Option = Select.Option;//下拉内容
const RangePicker = DatePicker.RangePicker;//日期组件
class EditOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            managerList:[],//管理员下拉
            dataSource: {},//组织机构基本信息
            userList:[],//账号员工list
            roleList:[],//角色list
            visible:false,
            pageloading:false,
            record:{}//当前操作员工
        }
    }

    componentWillMount(){
        axios.get("@/purchaser/organization/getRoleList").then(r => {
            this.setState({
                roleList:r.data.data.rows
            });
        });
        axios.get("@/reuse/organization/getManagerList").then(r => {
            this.setState({
                managerList:r.data.rows
            });
        });
        this.setState({
            dataSource:this.props.organization
        });
        this.props.form.setFieldsValue({
            ...this.props.organization
        });
        const params = {};
        params.uuids = this.props.organization.uuids;
        axios.get("@/reuse/organization/getUserList", {
            params: params
        }).then(r => {
            this.setState({
                userList:r.data
            });
        });
    }

    columns = [{
        title: '添加时间',
        dataIndex: 'dispatchDate',
        key: 'dispatchDate',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{width: "140px"}}><span>{text?moment(text).format("YYYY/MM/DD HH:mm:ss"):""}</span></p>
        },
    }, {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{width: "100px"}}><span title={text}>{text}</span></p>
        },
    }, {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{width: "100px"}}><span title={text}>{text}</span></p>
        },
    }, {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{width: "100px"}}><span title={text}>{text}</span></p>
        },
    }, {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        render: (text, record, index) => {
            return <p className="organization-tableColumnWidth" style={{width: "100px"}}><span title={text}>{text}</span></p>
        },
    }, {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record,index) => (
            <span>
                <a onClick={this.onOpenChangeRole.bind(this,record)}>变更角色</a>
            </span>
        )
    }];

    onOpenChangeRole = (record)=>{
        this.setState({
            visible:true,
            record:record
        })
        this.props.form.setFieldsValue({
            roleId:record.roleId
        })
    }
    onCancelChangeRole = ()=>{
        this.setState({
            visible:false
        })
    }
    onOkChangeRole = ()=>{
        this.props.form.validateFields(["roleId"],(errors, values) => {
            if (!!errors) {
                return;
            }else{
                let params = {}
                params.refId = this.state.record.refId
                params.roleId = values.roleId
                axios.get("@/reuse/organization/changeRoleForDefaultOrganization",{
                    params:params
                }).then(r=>{
                    if(r){
                        message.success("保存成功");
                        this.onCancelChangeRole();
                        //刷新下方list
                        const params = {};
                        params.uuids = this.props.organization.uuids;
                        axios.get("@/reuse/organization/getUserList", {
                            params: params
                        }).then(r => {
                            this.setState({
                                userList:r.data
                            });
                        });
                    }else{
                        message.success("保存失败")
                    }
                });
            }
        });
    }

    render() {
        const pagination = ComponentDefine.getPagination_(this.state.dataSource,this.onChange,this.onShowSizeChange);
        const {getFieldProps} = this.props.form;
        let span = 15;

        return (
            <div className="editOrganization">
                <Card loading={this.state.pageloading} className="card-margin-bottom">
                    <Row>
                        <Col span={12}>
                            <h2 className="order_con_title">
                                <img src={EditOrganizationIcon}/>
                                <em>项目编号：</em>
                                <em>{this.state.dataSource.organizationNo}</em>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Row {...ComponentDefine.row_}  className="margin_top18">
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
                                        <p className="ant-form-text">{this.state.dataSource.orderCount}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row {...ComponentDefine.row_}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <Form.Item
                                        {...ComponentDefine.form_.layout}
                                        label={getDetailsLabel("竞价数量")}
                                    >
                                        <p className="ant-form-text">{this.state.dataSource.inquiryCount}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={14} style={{position:"relative",top:"18px"}}>
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
                <Card loading={this.state.pageloading} className="card-margin-bottom">
                    <Row {...ComponentDefine.row_}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("组织类型")}
                            >
                                <Radio.Group {...getFieldProps(`type`)}>
                                    <Radio disabled="true" value={0}>部门</Radio>
                                    <Radio disabled="true" value={1}>项目</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={24} >
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                            >
                                <div className="tishi">
                                    <em><img src={warning_icon}/></em>
                                    <span>未在财务共享中心立项的项目，将在下单时无法使用共享中心或银信付款方式付款</span>
                                    <a href="http://58.213.100.34:8003/" target="_blank">点击申请立项</a>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("部门名称")}>
                                <Input placeholder="请输入" maxLength={50}
                                       disabled="true"
                                       {...getFieldProps(`organizationName`, {
                                           rules: [
                                               {required: this.state.lxFlag==1?true:false, message: "请输入部门名称"}
                                           ]
                                       })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={span}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                required
                                label={getDetailsLabel("部门负责人")}>
                                <Select disabled="true"
                                    style={{ "width": "100%" }}
                                    placeholder="请选择部门负责人"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    {...getFieldProps(`ownUserId`, {
                                        rules: [
                                            {required: true, message: "请选择部门负责人"}
                                        ]
                                    })}
                                >
                                    {this.state.managerList.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.username+"("+item.phone+")"}</Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card loading={this.state.pageloading} className="card-margin-bottom ant-card-extra-top-8" title="关联员工">
                    <Table
                       {...ComponentDefine.table_}
                       rowSelection={null}
                       pagination={false}
                       columns={this.columns}
                       dataSource={this.state.userList}
                    />
                </Card>
                <DetailsBtns>
                    <PermissionsBtn noauth>
                        <Button type="back" onClick={this.props.callback}>返回</Button>
                    </PermissionsBtn>
                </DetailsBtns>
                {/*变更管理员modal*/}
                <Modal
                   title="变更角色"
                   visible={this.state.visible}
                   width="30%"
                   onOk={this.onOkChangeRole}
                   onCancel={this.onCancelChangeRole}
                >
                    <div style={{margin:"0px 15px 0px 15px"}}>
                        <Row {...ComponentDefine.row_}>
                            <Col span="24">
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("员工姓名")}>
                                    <p className="ant-form-text">{this.state.record.userName}</p>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span="24">
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("员工手机")}>
                                    <p>{this.state.record.phone}</p>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row {...ComponentDefine.row_}>
                            <Col span="24">
                                <Form.Item
                                    {...ComponentDefine.form_.layout}
                                    label={getDetailsLabel("员工角色")}>
                                    <Select
                                        style={{ "width": "100%" }}
                                        placeholder={"请选择"}
                                        {...getFieldProps("roleId", {
                                            rules: [
                                                {required: true, message: '请选择'}
                                            ]
                                        })}
                                    >
                                        {this.state.roleList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>{item.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(EditOrganization)
