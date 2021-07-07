import { Carousel, Pagination } from 'antd';
import api from '@/framework/axios';
import "../basicInfomation/index.css";
import toTop from "../img/toTop.png";
import EdsHeader from '../edsHeader';
import EdsFooter from '../edsFooter';
import ReceptionTable from "@/components/receptionTable";
import AfterPaTable from "@/components/receptionTable/afterPaTable";
import DetailModal from "@/components/receptionTable/detailModal";
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
const imageOrigin = SystemConfig.configs.resourceUrl;
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
export default class ManagementRisk extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {
            ec_token: "",
            basicInfo: {}, // 基本信息
            modalIsShow: false, // 土地抵押查看详情modal显示、隐藏
            modalIsShow2: false, // 动产抵押查看详情modal显示、隐藏
            modalIsShow3: false, // 欠税公告看详情modal显示、隐藏
            modalIsShow4: false, // 简易注销查看详情modal显示、隐藏
            modalIsShow5: false, // 公示催告查看详情modal显示、隐藏
            modalIsShow6: false, // 税收违法查看详情modal显示、隐藏
            modalIsShow7: false, // 股权出质查看详情modal显示、隐藏
            tableObj: {},
            modalTableName: ""
        }
    }
    componentWillMount() {
        this._isMounted = true;
        let companyName = getQueryString("companyName") ? getQueryString("companyName") : "中铁建金服科技（天津）有限公司";
        this.setState({
            companyName
        })
        this.getData(companyName);
    };

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        // this.scrollFloor();
    }

    // 楼层效果、吸附效果
    scrollFloor = () => {
        let main = document.getElementById('main');
        $(main).scroll(() => {
            let currentScroll = $(this).scrollTop();
        })
    }
    
    //传递给子组件的方法
	onRef = ( ref ) => {
		this.child = ref;
    }

    // 数据处理
    handleStr = ( str ) => {
        let _str = str &&  str != null &&  str != 'null'  ? str : "暂无数据";
        return _str;
    }
    // 数据处理
    handleNum = ( str ) => {
        let _str = str &&  str != null &&  str != 'null'  ? str : "0";
        return _str;
    }
    getData = ( companyName ) => {
        let url = "@/supplier/eds/getToken/getToken?keyword=" + companyName;
        api.ajax('GET', url).then(r => {
            this.setState({
                ec_token: r.data
            })
            this.getCirclesList(r.data);
            this.getTotalCount(r.data);
        }).catch(r => { })
    }

    getCirclesList = ( ec_token ) => {
        let _url = "#/edsApi/bussinessApi/getBussinessByKeyWord?" + ec_token;
        api.ajax('GET',_url).then(r => {
            this.setState({
                basicInfo: r.data,
            })
        }).catch(r => { }) 
    }

    getTotalCount = ( ec_token ) => {
        let _url = "#/edsApi/operateriskApi/getBusinessRiskCountByKeyWord?" + ec_token;
        api.ajax('GET',_url).then(r => {
            this.setState({
                totalCount: r.data.bussinessRiskCount,
            })
        }).catch(r => { })         
    }

    // close page
    closePage = () => {
        window.close();
    }

    // tab样式切换
    tabSwitch = ( type ) => {
        let { companyName } = this.state;
        if(type === "managementRisk") {
            this.props.history.push('/qualification/managementRisk?companyName=' + companyName);
        }else if(type === "lawLitigation") {
            this.props.history.push('/qualification/lawLitigation?companyName=' + companyName);
        }else if(type === "managementState") {
            this.props.history.push('/qualification/managementState?companyName=' + companyName);
        }else {
            this.props.history.push('/qualification/basicInfomation?companyName=' + companyName);
        }
    }

    // 土地抵押查看详情事件
    seeDetails = ( arr ) => {
        this.setState({
            tableObj :arr,
            modalIsShow: true
        })
    }

    //关闭查看详情modal
    closeModal = () => {
        this.setState({
            modalIsShow: false
        })
    }

    // 动产抵押查看详情事件
    seeDetails2 = ( arr ) => {
        this.setState({
            tableObj :arr,
            modalIsShow2: true
        })
    }

    //关闭查看详情modal
    closeModal2 = () => {
        this.setState({
            modalIsShow2: false
        })
    }
    // 欠税查看详情事件
    seeDetails3 = ( arr ) => {
        this.setState({
            tableObj :arr,
            modalIsShow3: true
        })
    }

    //关闭查看详情modal
    closeModal3 = () => {
        this.setState({
            modalIsShow3: false
        })
    }
    // 简易注销查看详情事件
    seeDetails4 = ( arr ) => {
        this.setState({
            tableObj :arr,
            modalIsShow4: true
        })
    }

    //关闭查看详情modal
    closeModal4 = () => {
        this.setState({
            modalIsShow4: false
        })
    }
    // 公示催告查看详情事件
    seeDetails5 = ( arr ) => {
        this.setState({
            tableObj :arr,
            modalIsShow5: true
        })
    }

    //关闭查看详情modal
    closeModal5 = () => {
        this.setState({
            modalIsShow5: false
        })
    }
    // 税收违法查看详情事件
    seeDetails6 = ( arr ) => {
        this.setState({
            tableObj :arr,
            modalIsShow6: true
        })
    }

    //关闭查看详情modal
    closeModal6 = () => {
        this.setState({
            modalIsShow6: false
        })
    }
    // 股权出质查看详情事件
    seeDetails7 = ( arr ) => {
        this.setState({
            tableObj :arr,
            modalIsShow7: true
        })
    }

    //关闭查看详情modal
    closeModal7 = () => {
        this.setState({
            modalIsShow7: false
        })
    }

    // 页面头部加载
    pageHeader = () => {
        let info = this.state.basicInfo.infomation;
        if(info) {
            return(
                <div className="conpany-item">
                    <img src={info.image_url} alt="" className="imgs1" />
                    <div className="conpany-right">
                        <div className="con-name">{info.company_name}</div>
                        <div className="con-tags">
                            <div className="conTags">{info.status}</div>
                        </div>
                        <div className="con-num">营业执照号：{info.credit_code}</div>
                        <div className="con-phones">
                            <span className="spans1">电话：{this.handleStr(info.phone_number)}</span>
                            <span className="po-right">官网： {this.handleStr(info.website_url)}</span>
                        </div>
                        <div className="con-phones">
                            <span className="spans1">邮箱：{this.handleStr(info.email)}</span>
                            <span className="po-right">地址： {this.handleStr(info.address)}</span>
                        </div>
                    </div>
                </div>  
            )
        }
    }

    // 经营风险
    basicTableList = () => {
        let { ec_token, totalCount  } = this.state;
            if(ec_token && totalCount) {
                return(
                    <div className="content-box">
                        <div className="contents-top active">
                            <div className="table-top">
                                {/* table 司法拍卖 */}
                                <AfterPaTable 
                                    column={this.column5}
                                    tableName="司法拍卖"
                                    url="#/edsApi/operateriskApi/getJudicialSaleByKeyWord?"
                                    listName="edsJudicialSaleEntities"
                                    ec_token={ec_token}
                                    totalCount={totalCount.judicial_count}
                                />
                                {/* table 土地抵押 */}
                                <AfterPaTable 
                                    column={this.column6}
                                    tableName="土地抵押"
                                    url="#/edsApi/operateriskApi/getLandMortgageByKeyWord?"
                                    listName="edsLandMortgageEntities"
                                    ec_token={ec_token}
                                    seeDetails={this.seeDetails}
                                    totalCount={totalCount.land_pledge_count}
                                />
                                {/* table 环保处罚 */}
                                <AfterPaTable 
                                    column={this.column7}
                                    tableName="环保处罚"
                                    url="#/edsApi/operateriskApi/getEnvPunishmentByKeyWord?"
                                    listName="edsEnvPunishmentEntities"
                                    ec_token={ec_token}
                                    totalCount={totalCount.env_punish_count}
                                />
                                {/* table 动产抵押 */}
                                <AfterPaTable 
                                    column={this.column8}
                                    tableName="动产抵押"
                                    url="#/edsApi/operateriskApi/getChattelMortgageByKeyWord?"
                                    listName="edsChattelMortgageEntities"
                                    ec_token={ec_token}
                                    seeDetails={this.seeDetails2}
                                    totalCount={totalCount.m_pledge_count}
                                />
                                {/* table 严重违法 */}
                                <ReceptionTable
                                    column={this.column9}
                                    tableName="严重违法"
                                    url="#/edsApi/operateriskApi/getSeriousViolationByKeyWord?"
                                    listName="edsSeriousViolationEntities"
                                    ec_token={ec_token}
                                />
                                {/* table 欠税公告 */}
                                <AfterPaTable 
                                    column={this.column10}
                                    tableName="欠税公告"
                                    url="#/edsApi/operateriskApi/getTaxOweNoticeByKeyWord?"
                                    listName="edsTaxOweNoticeEntities"
                                    seeDetails={this.seeDetails3}
                                    ec_token={ec_token}
                                    totalCount={totalCount.tax_owe_count}
                                />
                                {/* table 简易注销 */}
                                <ReceptionTable 
                                    column={this.column11}
                                    tableName="简易注销"
                                    url="#/edsApi/operateriskApi/getSimpleCancellationByKeyWord?"
                                    listName="edsTaxOweNoticeEntities"
                                    seeDetails={this.seeDetails4}
                                    ec_token={ec_token}
                                />
                                {/* table 公司催告 */}
                                <AfterPaTable 
                                    column={this.column12}
                                    tableName="公司催告"
                                    url="#/edsApi/operateriskApi/getPublishNoticeByKeyWord?"
                                    listName="edsPublishNoticeEntities"
                                    seeDetails={this.seeDetails5}
                                    ec_token={ec_token}
                                    totalCount={totalCount.anno_reminder_count}
                                />
                                {/* table 税收违法 */}
                                <AfterPaTable 
                                    column={this.column13}
                                    tableName="税收违法"
                                    url="#/edsApi/operateriskApi/getTaxIllegalByKeyWord?"
                                    listName="edsTaxillegalEntities"
                                    seeDetails={this.seeDetails6}
                                    ec_token={ec_token}
                                    totalCount={totalCount.tax_vio_count}
                                />
                                {/* table 股权出质 */}
                                <AfterPaTable 
                                    column={this.column14}
                                    tableName="股权出质"
                                    url="#/edsApi/operateriskApi/getStockPledgeByKeyWord?"
                                    listName="edsStockPledgeEntities"
                                    ec_token={ec_token}
                                    seeDetails={this.seeDetails7}
                                    totalCount={totalCount.equity_ple_count}
                                />
                                {/* table 历史行政处罚 [工商局] */}
                                <AfterPaTable 
                                    column={this.column15}
                                    tableName="历史行政处罚 [工商局]"
                                    url="#/edsApi/operateriskApi/getGsAdministrativePenaltyByKeyWord?"
                                    listName="edsAdministrativePenaltyEntities"
                                    ec_token={ec_token}
                                    totalCount={totalCount.admin_pun}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
    }

    // 经营风险-start
    // 司法拍卖
    column5 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 280
        },{
            title: '起拍价',
            dataIndex: 'yi_wu',
            key: 'yi_wu',
            width: 140
        },{
            title: '拍卖时间',
            dataIndex: 'action_remark',
            key: 'action_remark',
            width: 140
        },{
            title: '委托法院',
            dataIndex: 'execute_gov',
            key: 'execute_gov',
            width: 140
        }
    ]
    // 土地抵押
    column6 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '宗地标识',
            dataIndex: 'company_id',
            key: 'company_id',
            width: 100
        },{
            title: '宗地编号',
            dataIndex: 'land_sign',
            key: 'land_sign',
            width: 140
        },{
            title: '行政区',
            dataIndex: 'administrative_area',
            key: 'administrative_area',
            width: 140
        },{
            title: '土地面积（公顷）',
            dataIndex: 'acreage',
            key: 'acreage',
            width: 140
        },{
            title: '宗地地址',
            dataIndex: 'address',
            key: 'address',
            width: 140
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 80
        }
    ]
    // 环保处罚
    column7 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '决定书文号',
            dataIndex: 'case_no',
            key: 'case_no',
            width: 100
        },{
            title: '处罚日期',
            dataIndex: 'punish_date',
            key: 'punish_date',
            width: 140
        },{
            title: '违法类型',
            dataIndex: 'illegal_type',
            key: 'illegal_type',
            width: 140
        },{
            title: '处罚单位',
            dataIndex: 'punish_gov',
            key: 'punish_gov',
            width: 140
        }
    ]
    // 动产抵押
    column8 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '登记编号',
            dataIndex: 'register_no',
            key: 'register_no',
            width: 100
        },{
            title: '登记时间',
            dataIndex: 'register_date',
            key: 'register_date',
            width: 140
        },{
            title: '登记机关',
            dataIndex: 'register_office',
            key: 'register_office',
            width: 180
        },{
            title: '被担保债权数额',
            dataIndex: 'debt_secured_amount',
            key: 'debt_secured_amount',
            width: 140
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 80
        }
    ]
    // 严重违法
    column9 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 100
        },{
            title: '列入原因',
            dataIndex: 'add_reason',
            key: 'add_reason',
            width: 140
        },{
            title: '列入时间',
            dataIndex: 'add_date',
            key: 'add_date',
            width: 140
        },{
            title: '列入决定机关',
            dataIndex: 'add_office',
            key: 'add_office',
            width: 140
        },{
            title: '移除原因',
            dataIndex: 'remove_reason',
            key: 'remove_reason',
            width: 140
        },{
            title: '移除时间',
            dataIndex: 'remove_date',
            key: 'remove_date',
            width: 140
        },{
            title: '移除决定机关',
            dataIndex: 'remove_office',
            key: 'remove_office',
            width: 140
        }
    ]
    // 欠税公告
    column10 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 100
        },{
            title: '负责人名称',
            dataIndex: 'oper',
            key: 'oper',
            width: 140
        },{
            title: '欠税税种',
            dataIndex: 'category',
            key: 'category',
            width: 140
        },{
            title: '欠税余额',
            dataIndex: 'balance',
            key: 'balance',
            width: 140
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 140
        }
    ]
    // 简易注销
    column11 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '企业名称',
            dataIndex: 'company_name',
            key: 'company_name',
            width: 100
        },{
            title: '统一社会信用代码/注册号',
            dataIndex: 'regnoor_credit_code',
            key: 'regnoor_credit_code',
            width: 200
        },{
            title: '登记机关',
            dataIndex: 'registration',
            key: 'registration',
            width: 140
        },{
            title: '全体投资人承诺书url',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 170
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 140
        }
    ]
    // 公示催告
    column12 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '票据号',
            dataIndex: 'bill_no',
            key: 'bill_no',
            width: 100
        },{
            title: '票据类型',
            dataIndex: 'bill_type',
            key: 'bill_type',
            width: 140
        },{
            title: '票面金额',
            dataIndex: 'bill_amt',
            key: 'bill_amt',
            width: 140
        },{
            title: '出票日',
            dataIndex: 'bill_begin_date',
            key: 'bill_begin_date',
            width: 140
        },{
            title: '到期日',
            dataIndex: 'bill_end_date',
            key: 'bill_end_date',
            width: 140
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 140
        }
    ]
    // 税收违法
    column13 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '纳税人名称',
            dataIndex: 'taxpayer_name',
            key: 'taxpayer_name',
            width: 100
        },{
            title: '纳税人识别号',
            dataIndex: 'taxpayer_number',
            key: 'taxpayer_number',
            width: 140
        },{
            title: '组织机构代码',
            dataIndex: 'org_code',
            key: 'org_code',
            width: 140
        },{
            title: '注册地址',
            dataIndex: 'address',
            key: 'address',
            width: 140
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 140
        }
    ]
    // 股权出质
    column14 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '登记编号',
            dataIndex: 'regist_no',
            key: 'regist_no',
            width: 100
        },{
            title: '出质人',
            dataIndex: 'pledgorinfo_name',
            key: 'pledgorinfo_name',
            width: 150
        },{
            title: '质权人',
            dataIndex: 'pledgeeinfo_name',
            key: 'pledgeeinfo_name',
            width: 150
        },{
            title: '出质股权标的企业',
            dataIndex: 'relatedcompanyinfo_name',
            key: 'relatedcompanyinfo_name',
            width: 180
        },{
            title: '出质股权数额（万元）',
            dataIndex: 'pledged_amount',
            key: 'pledged_amount',
            width: 100
        },{
            title: '登记日期',
            dataIndex: 'reg_date',
            key: 'reg_date',
            width: 100
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 140
        }
    ]
    // 历史行政处罚 [工商局]
    column15 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '文号',
            dataIndex: 'doc_no',
            key: 'doc_no',
            width: 100
        },{
            title: '类型',
            dataIndex: 'penalty_type',
            key: 'penalty_type',
            width: 140
        },{
            title: '处罚内容',
            dataIndex: 'content',
            key: 'content',
            width: 140
        },{
            title: '决定机关',
            dataIndex: 'office_name',
            key: 'office_name',
            width: 140
        },{
            title: '决定日期',
            dataIndex: 'penalty_date',
            key: 'penalty_date',
            width: 100
        }
    ]
    // 经营风险-end

    // 土地抵押详情
    column27 = [
        [{
            title: '宗地编号',
            dataIndex: 'land_sign',
        },{
            title: '行政区域',
            dataIndex: 'administrative_area',
        }],
        [{
            title: '土地面积（公顷）',
            dataIndex: 'acreage',
        },{
            title: '宗地地址',
            dataIndex: 'address',
        }],
        [{
            title: '土地他项权利人证号',
            dataIndex: 'obligee_no',
        },{
            title: '土地使用权证号',
            dataIndex: 'usufruct_no',
        }],
        [{
            title: '土地抵押人名称',
            dataIndex: 'mortgagor_name',
        },{
            title: '土地抵押人性质',
            dataIndex: 'mortgagor_nature',
        }],
        [{
            title: '土地抵押权人',
            dataIndex: 'mortgage_people',
        },{
            title: '土地抵押用途',
            dataIndex: 'mortgage_purpose',
        }],
        [{
            title: '抵押土地权属性质与使用权类型',
            dataIndex: 'nature_and_type',
        },{
            title: '抵押面积（公顷）',
            dataIndex: 'mortgage_acreage',
        }],
        [{
            title: '评估金额（万元）',
            dataIndex: 'assessment_price',
        },{
            title: '抵押金额（万元）',
            dataIndex: 'mortgage_price',
        }],
        [{
            title: '土地抵押登记起始时间',
            dataIndex: 'onboard_start_time',
        },{
            title: '土地抵押结束时间',
            dataIndex: 'onboard_end_time',
        }]
    ]


    // 动产抵押详情
    column28 = [
        [{
            title: '登记编号',
            dataIndex: 'register_no',
        },{
            title: '注册时间',
            dataIndex: 'register_date',
        }],
        [{
            title: '公示时间',
            dataIndex: 'public_date',
        },{
            title: '登记机关',
            dataIndex: 'register_office',
        }],
        [{
            title: '被担保债权数额',
            dataIndex: 'debt_secured_amount',
        },{
            title: '状态',
            dataIndex: 'status',
        }],
        [{
            title: '被查公司名称动产抵押登记编号',
            dataIndex: 'pledge_regist_no',
        },{
            title: '被查公司名称动产抵押注册时间',
            dataIndex: 'pledge_regist_date',
        }],
        [{
            title: '被查公司名称动产抵押注册单位',
            dataIndex: 'pledge_regist_office',
        },{
            title: '被查公司名称动产抵押名称',
            dataIndex: 'pledgeelist_name',
        }],
        [{
            title: '被查公司名称动产抵押类型',
            dataIndex: 'pledgeelist_identity_type',
        },{
            title: '被查公司名称动产抵押证照',
            dataIndex: 'pledgeelist_identity_no',
        }],
        [{
            title: '被查公司名称动产抵押种类',
            dataIndex: 'secured_claim_kind',
        },{
            title: '被查公司名称动产抵押数额',
            dataIndex: 'secured_claim_amount',
        }],
        [{
            title: '被查公司名称动产抵押担保的范围',
            dataIndex: 'secured_claim_assurance_scope',
        },{
            title: '被查公司名称动产抵押债务人履行债务的期限',
            dataIndex: 'secured_claim_fulfill_obligation',
        }],
        [{
            title: '被查公司名称动产抵押担保的范围',
            dataIndex: 'secured_claim_assurance_scope',
        },{
            title: '被查公司名称动产抵押债务人履行债务的期限',
            dataIndex: 'secured_claim_fulfill_obligation',
        }],
        [{
            title: '被查公司名称动产抵押备注',
            dataIndex: 'secured_claim_remark',
        },{
            title: '抵押所有权人的名称',
            dataIndex: 'guarantee_list_name',
        }],
        [{
            title: '抵押所有权人所有权归属',
            dataIndex: 'guarantee_list_ownership',
        },{
            title: '抵押所有权人数量、质量、状况、所在地等情况',
            dataIndex: 'guarantee_list_other',
        }],
        [{
            title: '抵押所有权人备注',
            dataIndex: 'guarantee_list_remark',
        },{
            title: '抵押所有权人动产抵押登记注销时间',
            dataIndex: 'cancelInfo_cancel_date',
        }],
        [{
            title: '抵押所有权人动产抵押登记注销原因',
            dataIndex: 'cancelInfo_cancel_reason',
        },{
            title: '抵押所有权人动产抵押登记变更内容',
            dataIndex: 'changeList_change_content',
        }],
        [{
            title: '抵押所有权人动产抵押登记变更日期',
            dataIndex: 'changeList_change_date',
        },{
            title: '抵押所有权人动产抵押登记变更日期',
            dataIndex: 'changeList_change_date',
        }]
    ]


    // 欠税公告详情
    column29 = [
        [{
            title: '纳税人类型',
            dataIndex: 'type',
        },{
            title: '纳税人识别号',
            dataIndex: 'identify_no',
        }],
        [{
            title: '负责人名称',
            dataIndex: 'oper',
        },{
            title: '证件号码',
            dataIndex: 'id_no',
        }],
        [{
            title: '经营地点',
            dataIndex: 'addr',
        },{
            title: '欠税税种',
            dataIndex: 'category',
        }],
        [{
            title: '当前新发生的欠税余额',
            dataIndex: 'new_bal',
        },{
            title: '发布单位',
            dataIndex: 'issued_by',
        }],
        [{
            title: '发布日期',
            dataIndex: 'publish_date',
        },{
            title: '欠税余额',
            dataIndex: 'balance',
        }]
    ]

    // 简易注销详情
    column30 = [
        [{
            title: '企业名称',
            dataIndex: 'company_name',
        },{
            title: '统一社会信用代码/注册号',
            dataIndex: 'regnoor_credit_code',
        }],
        [{
            title: '登记机关',
            dataIndex: 'registration',
        },{
            title: '公告期',
            dataIndex: 'public_date',
        }],
        [{
            title: '全体投资人承诺书Url',
            dataIndex: 'doc_url',
        },{
            title: '异议申请人',
            dataIndex: 'dissent_person',
        }],
        [{
            title: '异议内容',
            dataIndex: 'dissent_content',
        },{
            title: '简易注销结果',
            dataIndex: 'result_content',
        }]
    ]


    // 公示催告详情
    column31 = [
        [{
            title: '票据号',
            dataIndex: 'bill_no',
        },{
            title: '票据类型',
            dataIndex: 'bill_type',
        }],
        [{
            title: '票面金额',
            dataIndex: 'bill_amt',
        },{
            title: '出票日',
            dataIndex: 'bill_begin_date',
        }],
        [{
            title: '到期日',
            dataIndex: 'bill_end_date',
        },{
            title: '申请人',
            dataIndex: 'apply_com_name',
        }],
        [{
            title: '持票人',
            dataIndex: 'owner_com_name',
        },{
            title: '付款方',
            dataIndex: 'pay_com_name',
        }],
        [{
            title: '出票人',
            dataIndex: 'draw_com_name',
        },{
            title: '公告日期',
            dataIndex: 'publish_date',
        }],
        [{
            title: '公告内容',
            dataIndex: 'info_detail',
        },{
            title: '类别',
            dataIndex: 'type',
        }]
    ]



    // 税收违法详情
    column32 = [
        [{
            title: '纳税人Id',
            dataIndex: 'taxpayer_id',
        },{
            title: '纳税人名称',
            dataIndex: 'taxpayer_name',
        }],
        [{
            title: '纳税人识别号',
            dataIndex: 'taxpayer_number',
        },{
            title: '组织机构代码',
            dataIndex: 'org_code',
        }],
        [{
            title: '注册地址',
            dataIndex: 'address',
        },{
            title: '法人Id',
            dataIndex: 'oper_id',
        }],
        [{
            title: '法人姓名',
            dataIndex: 'oper_name',
        },{
            title: '法人证件号',
            dataIndex: 'oper_cer_no',
        }],
        [{
            title: '法人性别',
            dataIndex: 'oper_gender',
        },{
            title: '法人证件类型',
            dataIndex: 'oper_cer_type',
        }],
        [{
            title: '发布时间（精确到天）',
            dataIndex: 'publish_time',
        },{
            title: '案件性质',
            dataIndex: 'case_nature',
        }],
        [{
            title: '所属税务机关',
            dataIndex: 'tax_gov',
        },{
            title: '违法事实',
            dataIndex: 'illegal_content',
        }],
        [{
            title: '财务负责人证件号',
            dataIndex: 'finance_chief_cer_no',
        },{
            title: '财务负责人性别',
            dataIndex: 'finance_chief_gender',
        }],
        [{
            title: '财务负责人名称',
            dataIndex: 'finance_chief_name',
        },{
            title: '财务负责人Id',
            dataIndex: 'finance_chief_id',
        }],
        [{
            title: '财务负责人证件类型',
            dataIndex: 'finance_chief_cer_type',
        },{
            title: '负有责任的中介人员Id',
            dataIndex: 'agency_person_id',
        }],
        [{
            title: '负有责任的中介机构名称',
            dataIndex: 'agency_company_name',
        },{
            title: '负有责任的中介KeyNo',
            dataIndex: 'agency_key_no',
        }],
        [{
            title: '负有责任的中介人员名',
            dataIndex: 'agency_person_name',
        },{
            title: '负有责任的中介证件类型',
            dataIndex: 'agency_person_cer_type',
        }],
        [{
            title: '负有责任的中介证件号',
            dataIndex: 'agency_person_cer_no',
        },{
            title: '负有责任的中介性别',
            dataIndex: 'agency_person_gender',
        }]
    ]

    // 股权出质详情
    column33 = [
        [{
            title: '质权登记编号',
            dataIndex: 'regist_no',
        },{
            title: '出质人名称',
            dataIndex: 'pledgorinfo_name',
        }],
        [{
            title: '出质人证件号',
            dataIndex: 'pledgorinfo_no',
        },{
            title: '质权人名称',
            dataIndex: 'pledgeeinfo_name',
        }],
        [{
            title: '质权人证件号',
            dataIndex: 'pledgeeinfo_no',
        },{
            title: '出质股权标的企业名称',
            dataIndex: 'relatedcompanyinfo_name',
        }],
        [{
            title: '出质股权标的企业证件号',
            dataIndex: 'relatedcompanyinfo_no',
        },{
            title: '出质股权数额',
            dataIndex: 'pledged_amount',
        }],
        [{
            title: '股权出质设立登记日期',
            dataIndex: 'reg_date',
        },{
            title: '出质状态',
            dataIndex: 'status',
        }]
    ]

    render() {
        let {modalIsShow, modalIsShow2,modalIsShow3,modalIsShow4,modalIsShow5,modalIsShow6,modalIsShow7,tableObj, modalTableName,totalCount } = this.state;
        return ( 
            <div className="all_container">
                <EdsHeader />
                <div className="basic_infomation">
                    {/* page 头部 */}
                    <div className="conpanyName">
                        { this.pageHeader() }
                    </div>
                    {/* page content */}
                    <div className="basicInfo">
                        {/* page tab切换 */}
                        <ul id="tablist">
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"basicInfomation")}>基本信息</li>
                            <li className="tabLaw" onClick={this.tabSwitch.bind(this,"managementRisk")}>经营风险</li>
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"managementState")}>经营状况</li>
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"lawLitigation")}>法律诉讼</li>
                        </ul>
                        {/* tabs 切换 */}
                        <div className="info-tags">
                            <button className='tagItem' key="0">司法拍卖{totalCount == null ? 0 : this.handleNum(totalCount.judicial_count)}</button>
                            <button className='tagItem' key="1">土地抵押{totalCount == null ? 0 : this.handleNum(totalCount.land_pledge_count)}</button>
                            <button className='tagItem' key="2">环保处罚{totalCount == null ? 0 : this.handleNum(totalCount.env_punish_count)}</button>
                            <button className='tagItem' key="3">动产抵押{totalCount == null ? 0 : this.handleNum(totalCount.m_pledge_count)}</button>
                            <button className='tagItem' key="4">严重违法{totalCount == null ? 0 : this.handleNum(totalCount.serious_count)}</button>
                            <button className='tagItem' key="5">欠税公告{totalCount == null ? 0 : this.handleNum(totalCount.tax_vio_count)}</button>
                            <button className='tagItem' key="6">简易注销{totalCount == null ? 0 : this.handleNum(totalCount.sim_cancel_count)}</button>
                            <button className='tagItem' key="7">公示催告{totalCount == null ? 0 : this.handleNum(totalCount.anno_reminder_count)}</button>
                            <button className='tagItem' key="8">税收违法{totalCount == null ? 0 : this.handleNum(totalCount.tax_vio_count)}</button>
                            <button className='tagItem' key="9">股权出质{totalCount == null ? 0 : this.handleNum(totalCount.equity_ple_count)}</button>
                            <button className='tagItem' key="10">行政处罚{totalCount == null ? 0 : this.handleNum(totalCount.admin_pun)}</button>
                        </div>
                        {/* page 法律诉讼-------- */}
                        { this.basicTableList() }
                        <div className="closeBtn" onclick={this.closePage}>关闭</div>
                        {/* 回顶部 */}
                        <div className="toTop">
                            <a href="javascript:scroll(0, 0)">
                                <img src={toTop} alt="" className="jiao_img" />
                            </a>
                        </div>
                    </div>
                </div>
                <DetailModal 
                    tableName="土地抵押详情"
                    column={this.column27}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow}
                    closeModal={this.closeModal}
                />
                <DetailModal
                    tableName="动产抵押详情"
                    column={this.column28}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow2}
                    closeModal={this.closeModal2}
                />
                <DetailModal
                    tableName="欠税公告详情"
                    column={this.column29}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow3}
                    closeModal={this.closeModal3}
                />
                <DetailModal
                    tableName="简易注销详情"
                    column={this.column30}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow4}
                    closeModal={this.closeModal4}
                />
                <DetailModal
                    tableName="公示催告详情"
                    column={this.column31}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow5}
                    closeModal={this.closeModal5}
                />
                <DetailModal
                    tableName="税收违法详情"
                    column={this.column32}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow6}
                    closeModal={this.closeModal6}
                />
                <DetailModal
                    tableName="股权出质详情"
                    column={this.column33}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow7}
                    closeModal={this.closeModal7}
                />
                <EdsFooter />
            </div>
        )
    }
}