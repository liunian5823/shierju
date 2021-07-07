import { Card, Form, Row, Col, Button, Table } from 'antd';
import { getDetailsLabel } from 'components/page/Details';
import { DetailsBtns, PermissionsBtn } from 'components/content/DetailsBtns';
import moment from 'moment';//时间格式转换
import EditOrganizationIcon from '@/static/img/projectTitle.png';
import "./organization.css";
import { NumberFormat } from 'components/content/Format'
import history from '@/utils/history'
import { session } from "@/utils/storage";

class OrganizationDetail extends React.Component {
   /* static defaultProps = {
        switchShow: session.getItem('projectShow'),
        organization: JSON.parse(session.getItem('projectOrganization')),
        close() {
            history.push('/organization/project');
        }
    };*/
    constructor(props) {
        super(props);
        this.state = {
            totalPriceForLjcg: {},
            managerList: [],//管理员下拉
            dataSource: {},//组织机构基本信息
            addressDataStr: "",
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
            loading: false,
            organizationNameLength: 0//组织机构名称长度

        }
    }

    componentWillMount() {
        this.setState({
            type: this.props.organization.type,
            dataSource: this.props.organization
        });
        this.getTotalPriceForLjcg(this.props.organization.id);
        axios.get("@/reuse/organization/getManagerList").then(r => {
            this.setState({
                managerList: r.data.rows
            });
        });
        this.getProvinceList();
        if (this.props.organization.province) {
            this.getCityList(this.props.organization.province);
        }
        if (this.props.organization.city) {
            this.getAreaList(this.props.organization.city);
        }
        const params = {};
        params.uuids = this.props.organization.uuids;
        params.sub_platform_id = 6;
        axios.get("@/reuse/organization/getUserList", {
            params: params
        }).then(r => {
            this.setState({
                userList: r.data
            });
        });
    }

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
                })
            }
        });
    }
    //省市区初始化
    getCityList = (provinceCode) => {
        axios.get("@/reuse/address/getCityList", {
            params: { provinceCode: provinceCode }
        }).then(r => {
            if (r.data != null) {
                this.setState({
                    cityList: r.data.data.rows
                })
            }
        });
    }
    //省市区初始化
    getAreaList = (cityCode) => {
        axios.get("@/reuse/address/getAreaList", {
            params: { cityCode: cityCode }
        }).then(r => {
            if (r.data != null) {
                this.setState({
                    areaList: r.data.data.rows
                })
            }
        });
    }

    columns = [{
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




    render() {
        const { getFieldProps } = this.props.form;
        //组件数据
        //样式数据
        let span = 15;//新增修改基础信息部分表单宽度占比
        //拼图数据(组织机构类型):组织机构类型切换时动态切换展示(项目/部门)
        let typeStr = null;
        for (let i = 0; i < this.state.typeArr.length; i++) {
            if (this.state.type == this.state.typeArr[i].value) {
                typeStr = this.state.typeArr[i].text
            }
        }

        return (
            <div className="rganizationDetail">
                {/*头*/}
                <Card className="card-margin-bottom">
                    <Row {...ComponentDefine.row_}>
                        <Col span={24}>
                            <h2 className="order_con_title">
                                <img src={EditOrganizationIcon} style={{ float: "left" }} />
                                <em style={{ whiteSpace: "normal" }}>{this.state.dataSource.organizationName}</em>
                            </h2>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span="12" className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("组织类型")}
                            >
                                {this.state.dataSource.typeStr}
                            </Form.Item>
                        </Col>
                        <Col span="6">
                            <p>创建日期</p>
                        </Col>
                        <Col span="6" className="ant-form-item-margin-bottom order_con_layer2">
                            <p>状态</p>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_} className="margin_bottom24">
                        <Col span="12" className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目类型")}
                            >
                                {this.state.dataSource.projectType
                                    ? this.state.projectTypeArr.map((projectType) => {
                                        return this.state.dataSource.projectType == projectType.value ? <p className="ant-form-text">{projectType.text}</p> : null
                                    })
                                    : <p className="ant-form-text">-</p>
                                }
                            </Form.Item>
                        </Col>
                        <Col span="6" className="ant-form-item-margin-bottom order_con_layer2"
                            style={{
                                textAlign: "left"
                            }}
                        >
                            <span>{moment(this.state.dataSource.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                        </Col>
                        <Col span="6" className="ant-form-item-margin-bottom order_con_layer2">
                            {this.state.dataSource.projectStatus
                                ? this.state.projectStatusArr.map((projectStatus) => {
                                    return this.state.dataSource.projectStatus == projectStatus.value ? <span>{projectStatus.text}</span> : null
                                })
                                : <span>-</span>
                            }
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目编号")}
                            >
                                <p className="ant-form-text">{this.state.dataSource.organizationNo ? this.state.dataSource.organizationNo : "-"}</p>
                            </Form.Item>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目周期")}
                            >
                                <p className="ant-form-text">
                                    {this.state.dataSource.beginTime ? moment(this.state.dataSource.beginTime).format("YYYY/MM/DD") : ""}
                                    <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>
                                    {this.state.dataSource.endTime ? moment(this.state.dataSource.endTime).format("YYYY/MM/DD") : ""}
                                </p>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目地址")}
                            >
                                <p className="ant-form-text">
                                    {this.state.provinceList.length && this.state.provinceList.map((item) => {
                                        return this.state.dataSource.province == item.provinceCode ? item.provinceName : null
                                    })}
                                    {this.state.cityList.length && this.state.cityList.map((item) => {
                                        return this.state.dataSource.city == item.cityCode ? item.cityName : null
                                    })}
                                    {this.state.areaList.length && this.state.areaList.map((item) => {
                                        return this.state.dataSource.area == item.areaCode ? item.areaName : null
                                    })}
                                    {this.state.dataSource.detailAddress}
                                </p>
                            </Form.Item>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目管理员")}
                            >
                                {this.state.managerList.map((item, index) => {
                                    return this.state.dataSource.ownUserId == item.id ? <p className="ant-form-text">{item.username + "(" + item.phone + ")"}</p> : null
                                })}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("立项项目编号")}
                            >
                                <p className="ant-form-text">{this.state.dataSource.orgId}</p>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                {/*统计*/}
                <Card title="统计" className="card-margin-bottom">
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("员工数量")}
                            >
                                {this.state.dataSource.count}
                            </Form.Item>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("累计订单金额")}
                            >
                                <p className="ant-form-text"><span>¥ <NumberFormat value={this.state.totalPriceForLjcg.orderAmt} /></span></p>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("竞价数量")}
                            >
                                <p className="ant-form-text">{this.state.totalPriceForLjcg.sceneCount}</p>
                            </Form.Item>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("项目可用金额")}
                            >
                                <p className="ant-form-text"><span>¥ <NumberFormat value={this.state.dataSource.account} /></span></p>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...ComponentDefine.row_}>
                        <Col span="12" className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("订单数量")}
                            >
                                <p className="ant-form-text">{this.state.totalPriceForLjcg.orderCount}</p>
                            </Form.Item>
                        </Col>
                        <Col span="12" className="ant-form-item-margin-bottom">
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("供求数量")}
                            >
                                <p className="ant-form-text">{this.state.totalPriceForLjcg.supplyDemandCount}</p>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                {/*成员信息*/}
                <Card style={{ marginBottom: '60px' }} className="card-margin-bottom ant-card-extra-top-8" title="关联员工" >
                    <Table rowKey="org_detail_table"
                        {...ComponentDefine.table_}
                        rowSelection={null}
                        pagination={false}
                        columns={this.columns}
                        dataSource={this.state.userList} />
                </Card>
                <div className="fixed_button">
                    <DetailsBtns>
                        <PermissionsBtn noauth>
                            <Button onClick={this.props.close}>返回</Button>
                        </PermissionsBtn>
                    </DetailsBtns>
                </div>

            </div>
        )
    }
}

export default Form.create()(OrganizationDetail)
