import { Tabs, Modal,Icon, Upload,Popconfirm, Select, Radio, Card, Row, Col, Form, Input, Button, Table, Switch ,message} from 'antd';
import api from '@/framework/axios';
import BaseTable from '@/components/baseTable';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';
import UserDetailModal from "./userDetailModal";
import ChangeAdminModal from "./changeAdminModal";
import {NumberFormat} from "@/components/gaoda/Format";
import less from './index.less';
import jiantou from '@/static/iconfont/jiantou.png';
import Util from "@/utils/util";

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
class detailPurchaser extends React.Component{
    state = {
        purchaser: {},//采购商基本信息
        parentPathArr:[],//采购商上级数组
        parentList:[],//上级单位list
        provinceList:[],//省
        cityList:[],//市
        areaList:[],//区
        accountBank:{},//资金账户
        sumQualityRetentionPrice:"",//质保金
        dataCount:{},//数据统计
        userDetailVisible:false,//员工详情开关
        userDetailData:{},//员工详情
        changeAdminVisible:false,//变更管理员开关
        modalVisible: false,//开通资金账户开关
        companyInfo:{},
        companyId:{},
        isOpenFlag : false
    }

    _isMounted = false;

    componentWillMount(){
        this.reload()
    }
        reload=()=>{
            this._isMounted = true;
            let uuids = this.props.match.params.uuids;
            let companyId = this.props.match.params.companyId;
            this.getPurchaserDetail(uuids);//采购商详情
            this.getAccountBank(uuids,companyId);//资金账户
            this.getSumQualityRetentionPrice(uuids);//质保金
            this.getPurchaserDataCount(uuids);//数据统计
            this.getProvinceList();//省list
            this.getCityList();//事list
            this.getAreaList();//区list
            this.getParentList();//上级单位list
            this.state.companyId = companyId;
            this.getAccountBankDetail(uuids,companyId);
        }
    componentWillUnmount(){
        this._isMounted = false;
    }

    //关闭变更管理员模态框
    closeChangeAdminModal = () => {
        this.setState({
            changeAdminVisible:false
        });
    }

    //查询采购商基本信息
    getPurchaserDetail = (uuids,id)=>{
        api.ajax("GET", "!!/purchaser/purchaser/getPurchaser", {
            uuids:uuids,
            id:id
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            if(r.data){
                let parentPathArr = []
                if(r.data.parentPath){
                    parentPathArr = r.data.parentPath.split(",")
                }
                this.setState({
                    purchaser:r.data,
                    parentPathArr:parentPathArr
                })
            }
        })
    }

    //查询自己账户是否开通
    getAccountBank = (uuids,companyId)=>{
        api.ajax("GET", "!!/financial/ecFinanceInfo/checkCapitalAccount", {

            companyId:companyId
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            if(r.data){
                this.setState({
                    isOpenFlag:r.data,
                })
            }
        })
    }
    //查询资金账户详情
    getAccountBankDetail = (uuids,companyId)=>{
       /* if (this.state.isOpenFlag) {*/
            api.ajax("GET", "!!/financial/ecFinanceInfo/getCapitalInfo", {
                uuids: uuids,
                companyId: companyId
            }).then((r) => {
                if (!this._isMounted) {
                    return;
                }
                if (r.data) {
                    this.setState({
                        accountBank: r.data,
                    })
                }
            })

    }


    //资金账户:质保金
    getSumQualityRetentionPrice = (uuids)=>{
        api.ajax("GET", "!!/purchaser/purchaser/getSumQualityRetentionPrice",{
            uuids:uuids
        }).then((r)=>{
            this.setState({
                sumQualityRetentionPrice:r.data
            });
        });
    }

    //数据统计
    getPurchaserDataCount = (uuids)=>{
        api.ajax("GET", "!!/purchaser/purchaser/getPurchaserDataCount", {
            uuids:uuids
        }).then((r) => {
            if (!this._isMounted) {
                return;
            }
            if(r.data){
                this.setState({
                    dataCount:r.data,
                })
            }
        })
    }

    //上级单位初始化
    getParentList = ()=>{
        api.ajax("GET", "!!/purchaser/purchaser/getPurchaserParentList").then((r) => {
            if(r.data != null){
                this.setState({
                    parentList:r.data,
                })
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
        api.ajax("GET", "!!/purchaser/address/getCityList").then((r) => {
            if(r.data.data != null){
                this.setState({
                    cityList:r.data.data.rows,
                })
            }
        })
    }

    //省市区初始化:区
    getAreaList = (cityCode)=>{
        api.ajax("GET", "!!/purchaser/address/getAreaList").then((r) => {
            if(r.data.data != null){
                this.setState({
                    areaList:r.data.data.rows
                })
            }
        })
    }

    //项目列表columns
    organizationColumns = () => {
        return [
            {
                title: '编号',
                dataIndex: 'organizationNo',
                key: 'organizationNo',
                width: 100,
                sorter: true,
            },
            {
                title: '项目名称',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 100,
                sorter: true,
            },
            {
              title: '类型',
              dataIndex: 'enterpriseType',
              key: 'enterpriseType',
              render: (text, record) => {
                if(text == 1 || text == "1"){
                  return "内部企业";
                } else if(text == 2 || text == "2") {
                  return "外部企业";
                } 
              }
            },
            {
                title: '负责人',
                dataIndex: 'ownUserName',
                key: 'ownUserName',
                width: 100,
                sorter: true,
            },
            {
                title: '员工',
                dataIndex: 'count',
                key: 'count',
                width: 100,
                sorter: true,
            },
            {
                title: '立项时间',
                dataIndex: 'beginTime',
                key: 'beginTime',
                width: 100,
                sorter: true,
                render: (text, record)=> {
                    if(text){
                        return(
                            <div style={{width: "100px"}}>
                                <span>{ text ? moment(text).format('YYYY-MM-DD') : ''}</span>
                            </div>
                        )
                    }else{
                        return "-"
                    }
                }
            },
            {
                title: '预计完工',
                dataIndex: 'endTime',
                key: 'endTime',
                width: 100,
                sorter: true,
                render: (text, record)=>{
                    if(text){
                        return(
                            <div style={{width:"100px"}}>
                                <span>{ text? moment(text).format('YYYY-MM-DD') : ''}</span>
                            </div>
                        )
                    }else{
                        return "-"
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'xz',
                key: 'xz',
                width: 100,
                render: (text, record)=>(
                    <div style={{width:"100px"}}>
                        <span>
                            <a href="javascript:void(0);" onClick={()=>{this.showOrganizationDetail(record.uuids)}}>查看</a>
                        </span>
                    </div>
                )
            }
        ]
    }

    //子账号列表columns
    userColumns = () => {
        return [
            {
                title: '姓名',
                dataIndex: 'username',
                key: 'username',
                sorter: true,
                width: 100,
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                sorter: true,
                width: 100,
                render: (text, record)=>(
                    <span>{text=="0"?"女士":text=="1"?"先生":"—"}</span>
                )
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                sorter: true,
                width: 100,
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                sorter: true,
                width: 100
            },
            {
                title: '角色',
                dataIndex: 'roleName',
                key: 'roleName',
                sorter: true,
                width: 100,
            },
            {
                title: '创建时间',
                dataIndex: 'createTimeStr',
                key: 'createTimeStr',
                sorter: true,
                width: 156
            },
            {
                title: '操作',
                dataIndex: 'xz',
                key: 'xz',
                width: 100,
                render: (text, record)=>(
                    <span>
                      <a href="javascript:void(0);" onClick={()=>{this.openUserDetail(record)}}>查看</a>
                    </span>
                )
            }
        ]
    }

    //信息变更记录列表columns
    purchaserChangeRecordColumns = () => {
        return [
            {
                title: '变更时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                sorter: true,
                width: 100,
                render: (text, record)=>(
                    <div style={{width:"140px"}}>
                        <span>{ text? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
                    </div>
                )
            },
            {
                title: '变更项目',
                dataIndex: 'changeField',
                key: 'changeField',
                sorter: true,
                width: 100
            },
            {
                title: '变更前',
                dataIndex: 'beforeContent',
                key: 'beforeContent',
                sorter: true,
                width: 100,
                render: (text, record)=>{
                    let result = "";
                    if(record.changeField=="公司logo"){
                        if(text){
                            result = text.substring(text.indexOf("?filename=")+10,text.length)
                        }else{
                            result = "-"
                        }
                    }else if(record.changeField=="框架协议"){
                        if(text){
                            result = text.substring(text.indexOf("?filename=")+10,text.length)
                        }else{
                            result = "-"
                        }
                    }else if(record.changeField=="单位级别"){
                        if(text==2){
                            result = "二级单位"
                        }else if(text==3){
                            result = "三级单位"
                        }else if(text==4){
                            result = "四级单位"
                        }else if(text==5){
                            result = "五级单位"
                        }else{
                            result = text
                        }
                    }else{
                        result = text
                    }
                    return result;
                }
            },
            {
                title: '变更后',
                dataIndex: 'afterContent',
                key: 'afterContent',
                sorter: true,
                width: 100,
                render: (text, record)=>{
                    let result = "";
                    if(record.changeField=="公司logo"){
                        if(text){
                            result = text.substring(text.indexOf("?filename=")+10,text.length)
                        }else{
                            result = "-"
                        }
                    }else if(record.changeField=="框架协议"){
                        if(text){
                            result = text.substring(text.indexOf("?filename=")+10,text.length)
                        }else{
                            result = "-"
                        }
                    }else if(record.changeField=="单位级别"){
                        if(text==2){
                            result = "二级单位"
                        }else if(text==3){
                            result = "三级单位"
                        }else if(text==4){
                            result = "四级单位"
                        }else if(text==5){
                            result = "五级单位"
                        }else{
                            result = text
                        }
                    }else{
                        result = text
                    }
                    return result;
                }
            }
        ]
    }

    //管理员记录列表columns
    managerColumns = () => {
        return [
            {
                title: '变更时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                width: 100,
                render: (text, record)=>(
                    <div style={{width:"140px"}}>
                        <span>{ text? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
                    </div>
                )
            },
            {
                title: '操作人',
                dataIndex: 'createUser',
                key: 'createUser',
                sorter: true,
                width: 100
            },
            {
                title: '变更前',
                dataIndex: 'beforeChange',
                key: 'beforeChange',
                sorter: true,
                width: 100,
            },
            {
                title: '变更后',
                dataIndex: 'afterChange',
                key: 'afterChange',
                sorter: true,
                width: 100
            },
            {
                title: '授权书',
                dataIndex: 'confirmFilePath',
                key: 'confirmFilePath',
                width: 100,
                render: (text, record)=>{
                    if(text){
                        return(
                            <div style={{width:"100px"}}>
                                <a href={SystemConfig.systemConfigPath.dfsPathUrl(text)} target="_blank">授权书</a>
                            </div>
                        )
                    }else{
                        return(
                            <div style={{width:"100px"}}>-</div>
                        )
                    }
                }
            }
        ]
    }

    //变更管理员
    handleResetAdmin = ()=>{
        this.setState({
            changeAdminVisible:true
        })
    }

    //重置密码
    handleResetPwd = ()=>{
        Modal.confirm({
            title: '确认重置密码吗？',
            content: "密码将随机生成并发送至于账号绑定的手机号为"
            +this.state.purchaser.phone
            +"的手机上。",
            okText: "确定",
            cancelText: '取消',
            onOk:()=>{
                if(this.state.loading){
                    return
                }
                this.setState({
                    loading:true
                })
                api.ajax("GET", "!!/purchaser/purchaser/resetPwd",{
                    uuids:this.state.purchaser.userUuids
                }).then((r) => {
                    message.success("密码已重置")
                    this.setState({
                        loading:false
                    })
                })
            },
            onCancel:()=>{
                this.setState({
                    loading:false
                })
            }
        });

    }

    //项目详情
    showOrganizationDetail = (uuids)=>{
        this.props.history.push('/purchaser/detailOrganization/'+uuids);
    }

    // 打开查看页
    openDetails = (companyId) =>{
        this.props.history.push('/financialCenter/capitalAccount/details/'+ companyId);
    };

    //打开子账号详情
    openUserDetail = (record)=>{
        this.setState({
            userDetailData:record,
        },()=>{
            this.setState({
                userDetailVisible:true,
            })
        })
    }

    //关闭子账号详情
    closeUserDetail = ()=>{
        this.setState({
            userDetailVisible:false
        })
    }

    // 开通账户
    openAccount = ()=>{
        this.setState({ openLoading: true });
        api.ajax('GET','!!/financial/ecFinanceInfo/openAccount',{
            companyId: this.state.companyId,

        }).then((r)=>{
            if (r.data) {
                Util.alert('成功开通资金账户',{type:'success'});
                this.reload()
            }
            if(!r.data){
                Util.alert("资金账户已存在",{type:'warning'});
                this.reload()
            }
        }).catch(r=>{
            Util.alert(r.msg,{type:'warning'});
            this.closeCapitalModal();
        })
    };

    handleOk =()=>{
        let _this = this;
        confirm({
            title: '是否确认为该公司开通资金账户？',
            onOk(){
                _this.openAccount();
            },
            onCancel(){
                Util.alert('已取消操作',{ type: 'warning' })
            }
        })
    };
    render() {
        return(
            <div className={less.detailPurchaser}>
                {/*顶部*/}
                <Card bordered={false} className="mb10">
                    <div className={less.infoContent}>
                        <div className={less.logoDiv}>
                            LOGO
                            {this.state.purchaser.companyLogoPath ?<img src={SystemConfig.systemConfigPath.dfsPathUrl(this.state.purchaser.companyLogoPath)}/>:""}
                        </div>
                        <div className={less.infoDiv}>
                            <span className={less.name}>{this.state.purchaser.name}<a style={{display:"none"}}>资金账户正常</a></span>
                            <div className={less.supplierSource}>
                                <span className={this.state.purchaser.unitLevel==2?less.choose:""}>二级单位</span>
                                <span className={this.state.purchaser.unitLevel==3?less.choose:""}>三级单位</span>
                                <span className={this.state.purchaser.unitLevel==4?less.choose:""}>四级单位</span>
                                <span className={this.state.purchaser.unitLevel==5?less.choose:""}>五级单位</span>
                            </div>
                        </div>
                    </div>
                </Card>
                {/*管理员信息*/}
                <Card bordered={false} className="mb10"
                      title="管理员信息"
                      extra={<div lassName="ant-card-extra-div"><Button className="mr10" onClick={this.handleResetAdmin}>修改管理员</Button><Button type="primary" loading={this.state.loading} onClick={()=>(this.handleResetPwd())}>重置密码</Button></div>}>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="管理员姓名">
                                {this.state.purchaser.username}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="手机号码">
                                {this.state.purchaser.phone}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="身份证号码">
                                {this.state.purchaser.citizenCode}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="电子邮箱">
                                {this.state.purchaser.email}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                {/*资金账户*/}
                <Card  className={less.accountBank+" mb10"} title={<span>资金账户{this.state.isOpenFlag?<im className={less.zc}>正常</im>:<im className={less.wkt}>未开通</im>}</span>} bordered={false}
                       extra= {this.state.isOpenFlag ?<div className="ant-card-extra-div"><Button type="primary" onClick={this.openDetails.bind(this,this.state.companyId)} >查看资金账户</Button></div>:<div className="ant-card-extra-div"><Button key="submit" type="primary" onClick={this.handleOk.bind(this,this.state.companyId)}>开通资金账户</Button></div>}>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <span className={less.label}>总金额(元)</span>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <span className={less.label}>质保金金额(元)</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            {this.state.accountBank.totalAmt || this.state.accountBank.totalAmt == 0 ?
                                <span className={less.money}>￥<NumberFormat value={this.state.accountBank.totalAmt}/></span>
                                :'-'
                            }
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <span className={less.money}>
                                {
                                    this.state.sumQualityRetentionPrice || this.state.sumQualityRetentionPrice == 0
                                        ?
                                    <span className={less.money}>￥<NumberFormat value={this.state.sumQualityRetentionPrice}/></span>
                                    :
                                    <NumberFormat value={0}/>
                                }
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="可提现金额">
                                {this.state.accountBank.totalAmt  || this.state.accountBank.totalAmt == 0 ?
                                    <span>￥<NumberFormat value={this.state.accountBank.totalAmt}/></span>
                                    :'-'
                                }
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                {/*公司信息*/}
                <Card title="公司信息" bordered={false} className="mb10">
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="公司名称">
                                {this.state.purchaser.name}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="企业类型">
                                内部企业
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="公司网址">
                                {this.state.purchaser.companyUrl}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="上级单位">
                                {this.state.parentPathArr.map((parent,index)=>{
                                    if(index==0){
                                        return(this.state.parentList.map((item)=>{
                                            return parent==item.id?<span className={less.parentPurchaserSpan}>{item.name}</span>:null
                                        }))
                                    }else{
                                        return(this.state.parentList.map((item)=>{
                                            return parent==item.id?<span className={less.parentPurchaserSpan}><img src={jiantou}/>{item.name}</span>:null
                                        }))
                                    }
                                })}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="公司地址">
                                {this.state.provinceList.map((item)=>{
                                    return this.state.purchaser.provinceCode==item.provinceCode?item.provinceName:null
                                })}
                                {this.state.cityList.map((item)=>{
                                    return this.state.purchaser.cityCode==item.cityCode?item.cityName:null
                                })}
                                {this.state.areaList.map((item)=>{
                                    return this.state.purchaser.areaCode==item.areaCode?item.areaName:null
                                })}
                                {this.state.purchaser.address}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="授权文件">
                                <a href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.purchaser.legalAuthorizationPath)} target="_blank">{this.state.purchaser.legalAuthorizationName}</a>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="公司简称">
                                {this.state.purchaser.shortName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="框架协议">
                                {
                                    this.state.purchaser.contractPath
                                        ?
                                        <a href={SystemConfig.systemConfigPath.dfsPathUrl(this.state.purchaser.contractPath)} target="_blank">{this.state.purchaser.contractPath.substr(this.state.purchaser.contractPath.indexOf("?filename=")+10, this.state.purchaser.contractPath.length)}</a>
                                        :
                                        null
                                }
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <BaseDetails title="公司简介">
                                <div dangerouslySetInnerHTML={{__html: this.state.purchaser.companyProfile}}></div>
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                {/*五个tab*/}
                <Card bordered={false} className="mb10">
                    <Tabs defaultActiveKey="1">
                        {/*项目信息*/}
                        <TabPane tab="项目信息" key="1">
                            <BaseTable
                                url='!!/purchaser/purchaser/getOrganizationListForPage'
                                tableState={0}
                                //resetTable={(state)=>{this.resetTable(state,'tableState')}}
                                baseParams={{uuids:this.props.match.params.uuids}}
                                columns={this.organizationColumns()}
                                scroll={{ x: 1000 }}
                            />
                        </TabPane>
                        {/*子账号信息*/}
                        <TabPane tab="子账号信息" key="2">
                            <BaseTable
                                url='!!/purchaser/purchaser/getUserListForPage'
                                tableState={0}
                                //resetTable={(state)=>{this.resetTable(state,'tableState')}}
                                baseParams={{uuids:this.props.match.params.uuids}}
                                columns={this.userColumns()}
                                scroll={{ x: 1000 }}
                            />
                        </TabPane>
                        {/*信息变更记录*/}
                        <TabPane tab="信息变更记录" key="3">
                            <BaseTable
                                url='!!/purchaser/purchaser/getEcCompanyChangeRecordForPage'
                                tableState={0}
                                //resetTable={(state)=>{this.resetTable(state,'tableState')}}
                                baseParams={{uuids:this.props.match.params.uuids}}
                                columns={this.purchaserChangeRecordColumns()}
                                scroll={{ x: 1000 }}
                            />
                        </TabPane>
                        {/*管理员记录*/}
                        <TabPane tab="管理员记录" key="4">
                            <BaseTable
                                url='!!/purchaser/purchaser/ecManagerChangeRecord'
                                tableState={0}
                                //resetTable={(state)=>{this.resetTable(state,'tableState')}}
                                baseParams={{uuids:this.props.match.params.uuids}}
                                columns={this.managerColumns()}
                                scroll={{ x: 1000 }}
                            />
                        </TabPane>
                        {/*数据统计*/}
                        <TabPane tab="数据统计" key="5">
                            <Row className={less.dataCount}>
                                <Col span="8">
                                    <span className={less.data}>累计交易金额(元)</span>
                                </Col>
                                <Col span="8">
                                    <span className={less.data}>累计交易笔数</span>
                                </Col>
                                <Col span="8">
                                    <span className={less.data}>询价单发布笔数</span>
                                </Col>
                            </Row>
                            <Row className={less.dataCount}>
                                <Col span="8">
                                    <span className={less.count}><NumberFormat value={this.state.dataCount.sumTotalPrice}/></span>
                                </Col>
                                <Col span="8">
                                    <span className={less.count}>{this.state.dataCount.orderCount}</span>
                                </Col>
                                <Col span="8">
                                    <span className={less.count}>{this.state.dataCount.inquiryCount}</span>
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>
                <UserDetailModal
                    visible={this.state.userDetailVisible}
                    onCancel={this.closeUserDetail}
                    data={this.state.userDetailData}
                />
                <ChangeAdminModal
                    visible={this.state.changeAdminVisible}//开关
                    onCancel={this.closeChangeAdminModal}//取消按钮
                    id={this.state.purchaser.id}//采购商id
                    createrUser={this.state.purchaser.createrUser}//采购商管理员id
                    phone={this.state.purchaser.phone}//管理员手机号
                    parent={this}
                />
                <BaseAffix>
                    <Button style={{marginRight: "10px"}}
                        onClick={()=>{
                            this.props.history.push("/purchaser/purchaser");
                        }}
                    >返回</Button>
                </BaseAffix>
            </div>
        )
    }
}
export default Form.create()(detailPurchaser);