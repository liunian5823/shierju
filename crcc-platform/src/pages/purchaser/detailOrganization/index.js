import { Tabs, Modal,Icon, Upload, Select, Radio, Card, Row, Col, Form, Input, Button, Table, Switch ,message} from 'antd';
import api from '@/framework/axios';
import BaseTable from '@/components/baseTable';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';
import {NumberFormat} from '@/components/content/Format'
import less from './index.less';
import ProjectTitleIcon from '@/static/iconfont/projectTitle.png';

class detailPurchaser extends React.Component{
    state = {
        organization: {},
        projectTypeArr:[
            {value:1,text:"市政工程"},
            {value:2,text:"建筑工程"},
            {value:3,text:"轨道工程"},
            {value:4,text:"桥梁工程"},
            {value:5,text:"铁路工程"},
            {value:6,text:"公路工程"},
            {value:7,text:"隧道工程"},
        ],
        projectStatusArr:[
            {value:1,text:"筹备"},
            {value:2,text:"实施"},
            {value:3,text:"暂停"},
            {value:4,text:"废止"},
        ],
        provinceList:[],//省
        cityList:[],//市
        areaList:[],//县
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        let uuids = this.props.match.params.uuids;
        this.getOrganizationDetail(uuids);
        //this.getTotalPriceForLjcg(uuids);
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    //获取项目基本信息
    getOrganizationDetail = (uuids)=>{
        api.ajax("GET", "!!/purchaser/organization/getOrganization", {
            uuids:uuids
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            if(r.data){
                //省市区初始化
                this.getProvinceList();
                if(r.data.province){
                    this.getCityList(r.data.province);
                }
                if(r.data.city){
                    this.getAreaList(r.data.city);
                }
                this.setState({
                    organization:r.data
                })
            }
        })
    }

    //累计采购金额
    // getTotalPriceForLjcg = (uuids)=>{
    //     api.ajax("GET", "!!/purchaser/organization/getTotalPriceForLjcg",{
    //         uuids:uuids
    //     }).then((r)=>{
    //         this.setState({
    //             totalPriceForLjcg:r.data
    //         });
    //     });
    // }

    //省市区初始化
    getProvinceList = ()=>{
        api.ajax("GET", "!!/purchaser/address/getProvinceList").then((r)=>{
            if(r.data.data != null){
                this.setState({
                    provinceList:r.data.data.rows
                })
            }
        });
    }
    //省市区初始化
    getCityList = (provinceCode)=>{
        api.ajax("GET", "!!/purchaser/address/getCityList",{
            provinceCode:provinceCode
        }).then(r=>{
            if(r.data.data != null){
                this.setState({
                    cityList:r.data.data.rows,
                })
            }
        });
    }
    //省市区初始化
    getAreaList = (cityCode)=>{
        api.ajax("GET", "!!/purchaser/address/getAreaList",{
            cityCode:cityCode
        }).then(r=>{
            if(r.data.data != null){
                this.setState({
                    areaList:r.data.data.rows
                })
            }
        });
    }

    handleCancel = () => {
        this.props.history.goBack();
    }

    //关联员工列表columns
    organizationColumns = () => {
        return [
            {
                title: '添加时间',
                dataIndex: 'dispatchDate',
                key: 'dispatchDate',
                width: 100,
                sorter: true,
                render: (text, record)=> {
                    return(
                        <div>
                            <span>{ text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : '-'}</span>
                        </div>
                    )
                }
            },
            {
                title: '姓名',
                dataIndex: 'userName',
                key: 'userName',
                width: 100,
                sorter: true,
            },
            {
                title: '角色',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 100,
                sorter: true,
            },
            {
                title: '联系方式',
                dataIndex: 'phone',
                key: 'phone',
                width: 100,
                sorter: true,
            },
            {
                title: '电子邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 100,
                sorter: true,
            }
        ]
    }

    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        return(
            <div className={less.orgDetail}>
                {/*顶部信息*/}
                <Card bordered={false} className="mb10">
                    <Row>
                        <Col span={24}>
                            <h2 className={less.organizationName}>
                                <img src={ProjectTitleIcon}/>
                                <em>{this.state.organization.organizationName}</em>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="组织类型">
                                {this.state.organization.typeStr}
                            </BaseDetails>
                        </Col>
                        <Col span={6}>
                            创建日期
                        </Col>
                        <Col span={6}>
                            状态
                        </Col>
                    </Row>
                    <Row  style={{marginBottom:"24px"}}>
                        <Col span={12}>
                            <BaseDetails title="项目类型">
                                {this.state.organization.projectType
                                    ?this.state.projectTypeArr.map((projectType) => {
                                        return this.state.organization.projectType==projectType.value?<p className="ant-form-text">{projectType.text}</p>:null
                                    })
                                    :<p className="ant-form-text">-</p>
                                }
                            </BaseDetails>
                        </Col>
                        <Col span={6}>
                            <span className={less.title}>{moment(this.state.organization.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                        </Col>
                        <Col span={6}>
                            <span className={less.title}>
                                {
                                    this.state.organization.projectStatus
                                    ?
                                    this.state.projectStatusArr.map((projectStatus) => {
                                        return this.state.organization.projectStatus==projectStatus.value?projectStatus.text:null
                                    })
                                    :
                                    "-"
                                }
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="项目编号">
                                {this.state.organization.organizationNo}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="项目周期">
                                    {this.state.organization.beginTime?moment(this.state.organization.beginTime).format("YYYY/MM/DD"):""}
                                    <span style={{marginLeft:"10px",marginRight:"10px"}}>-</span>
                                    {this.state.organization.endTime?moment(this.state.organization.endTime).format("YYYY/MM/DD"):""}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="项目地址">
                                {this.state.provinceList.map((item) => {
                                    return this.state.organization.province==item.provinceCode?item.provinceName:null
                                }).join("")+
                                this.state.cityList.map((item) => {
                                    return this.state.organization.city==item.cityCode?item.cityName:null
                                }).join("")+
                                this.state.areaList.map((item) => {
                                    return this.state.organization.area==item.areaCode?item.areaName:null
                                }).join("")+
                                this.state.organization.detailAddress}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="项目经理">
                                {this.state.organization.ownUserName}
                                ({this.state.organization.ownUserPhone})
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                {/*统计*/}
                <Card bordered={false} className="mb10" title="统计">
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="员工数量">
                                <p>{this.state.organization.count}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="累计采购金额">
                                ¥ <NumberFormat value={this.state.organization.sumTotalPrice} />
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="询价单数量">
                                <p>{this.state.organization.inquiryCount}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="项目可用金额">
                                ¥ <NumberFormat value={this.state.organization.account} />
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="订单数量">
                                <p>{this.state.organization.orderCount}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                {/*关联员工*/}
                <Card title="关联员工" bordered={false} className="mb10">
                    <BaseTable
                        url='!!/purchaser/organization/getUserListOfOrgForPage'
                        tableState={0}
                        //resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={{uuids:this.props.match.params.uuids}}
                        columns={this.organizationColumns()}
                        scroll={{ x: 100 }}
                    />
                </Card>
                {/*底部按钮*/}
                <BaseAffix>
                    <Button style={{marginRight: "10px"}} onClick={this.handleCancel}>返回</Button>
                </BaseAffix>
            </div>
        )
    }
}
export default Form.create()(detailPurchaser);