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
export default class LawLitigation extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {
            ec_token: "",
            basicInfo: {}, // 基本信息
            modalIsShow: false, // 开庭公告详情
            modalIsShow2: false, // 法院公告详情
            modalIsShow3: false, // 失信详情
            modalIsShow4: false, // 股权冻结
            modalIsShow5: false, // 立案信息
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
        let _url = "#/edsApi/lawsuitApi/getLegalProcCountByKeyWord?" + ec_token;
        api.ajax('GET',_url).then(r => {
            this.setState({
                totalCount: r.data.legalProcCount,
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

    // 开庭公告查看详情事件
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
    //法院公告查看
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
    //失信详情查看
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
    //股权冻结详情查看
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
    //立案信息详情查看
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

    // 法律诉讼
    basicTableList = () => {
        let { ec_token, totalCount } = this.state;
            if(ec_token && totalCount) {
                return(
                    <div className="content-box">
                        <div className="contents-top active">
                            <div className="table-top">
                                {/* table 开庭公告 */}
                                <AfterPaTable 
                                    column={this.column20}
                                    tableName="开庭公告"
                                    url="#/edsApi/lawsuitApi/getCourtNoticeByKeyWord?"
                                    listName="courtNoticeList"
                                    ec_token={ec_token}
                                    seeDetails={this.seeDetails}
                                    totalCount={totalCount.court_anno_count}
                                />
                                {/* table 裁判文书 */}
                                <AfterPaTable 
                                    column={this.column21}
                                    tableName="裁判文书"
                                    url="#/edsApi/lawsuitApi/getJudgmentDocByKeyWord?"
                                    listName="judgmentDocList"
                                    ec_token={ec_token}
                                    totalCount={totalCount.judge_count}
                                />
                                {/* table 法院公告 */}
                                <AfterPaTable 
                                    column={this.column22}
                                    tableName="法院公告"
                                    url="#/edsApi/lawsuitApi/getCourtAnnouncementByKeyWord?"
                                    listName="courtAnnouncementList"
                                    ec_token={ec_token}
                                    seeDetails={this.seeDetails2}
                                    totalCount={totalCount.court_noti_count}
                                />
                                {/* table 被执行人信息 */}
                                <AfterPaTable 
                                    column={this.column23}
                                    tableName="被执行人信息"
                                    url="#/edsApi/lawsuitApi/getZhixingByKeyWord?"
                                    listName="zhixing"
                                    ec_token={ec_token}
                                    totalCount={totalCount.zx_count}
                                />
                                {/* table 失信被执行人 */}
                                <AfterPaTable 
                                    column={this.column24}
                                    tableName="失信被执行人"
                                    url="#/edsApi/lawsuitApi/getShixinByKeyWord?"
                                    listName="shixinList"
                                    ec_token={ec_token}
                                    seeDetails={this.seeDetails3}
                                    totalCount={totalCount.sx_count}
                                />
                                {/* table 股权冻结 */}
                                <ReceptionTable
                                    column={this.column25}
                                    tableName="股权冻结"
                                    url="#/edsApi/lawsuitApi/getJudicialAssistanceByKeyWord?"
                                    listName="judicialAssistanceList"
                                    ec_token={ec_token}
                                    seeDetails={this.seeDetails4}
                                />
                                {/* table 立案信息 */}
                                <AfterPaTable 
                                    column={this.column26}
                                    tableName="立案信息"
                                    url="#/edsApi/lawsuitApi/getLianByKeyWord?"
                                    listName="caseList"
                                    ec_token={ec_token}
                                    totalCount={totalCount.case_filing_count}
                                    seeDetails={this.seeDetails5}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
    }

    // 法律诉讼-start
    // 开庭公告
    column20 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80
        },
        {
            title: '案号',
            dataIndex: 'case_no',
            key: 'case_no',
            width: 150
        },{
            title: '开庭时间',
            dataIndex: 'lian_date',
            key: 'lian_date',
            width: 140
        },{
            title: '案由',
            dataIndex: 'case_reason',
            key: 'case_reason',
            width: 140
        },{
            title: '上诉人',
            dataIndex: 'prosecutor_list',
            key: 'prosecutor_list',
            width: 160
        },{
            title: '被上诉人',
            dataIndex: 'defendant_list',
            key: 'defendant_list',
            width: 160
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 80
        }
    ]
    // 裁判文书
    column21 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80
        },
        {
            title: '案件名称',
            dataIndex: 'case_name',
            key: 'case_name',
            width: 180
        },{
            title: '涉案金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 100
        },{
            title: '案件编号',
            dataIndex: 'case_no',
            key: 'case_no',
            width: 140
        },{
            title: '案由',
            dataIndex: 'case_reason',
            key: 'case_reason',
            width: 140
        },{
            title: '发布时间',
            dataIndex: 'submit_date',
            key: 'submit_date',
            width: 140
        },{
            title: '案件身份',
            dataIndex: 'case_role_list',
            key: 'case_role_list',
            width: 260
        },{
            title: '执行法院',
            dataIndex: 'court',
            key: 'court',
            width: 140
        },{
            title: '案件关系人',
            dataIndex: 'is_prosecutor',
            key: 'is_prosecutor',
            width: 90
        }
    ]
    // 法院公告
    column22 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80
        },
        {
            title: '上诉人',
            dataIndex: 'prosecutor_name',
            key: 'prosecutor_name',
            width: 200
        },{
            title: '被上诉人',
            dataIndex: 'defendant_name',
            key: 'defendant_name',
            width: 200
        },{
            title: '公告类型',
            dataIndex: 'category',
            key: 'category',
            width: 100
        },{
            title: '公告人',
            dataIndex: 'party',
            key: 'party',
            width: 150
        },{
            title: '刊登日期',
            dataIndex: 'publish_date',
            key: 'publish_date',
            width: 100
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 100
        }
    ]
    // 被执行人信息
    column23 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80
        },
        {
            title: '案号',
            dataIndex: 'anno',
            key: 'anno',
            width: 251
        },{
            title: '立案日期',
            dataIndex: 'lian_date',
            key: 'lian_date',
            width: 140
        },{
            title: '执行法院',
            dataIndex: 'execute_gov',
            key: 'execute_gov',
            width: 140
        },{
            title: '执行标地',
            dataIndex: 'biaodi',
            key: 'biaodi',
            width: 140
        },{
            title: '组织机构代码/身份证号码',
            dataIndex: 'party_card_num',
            key: 'party_card_num',
            width: 180
        }
    ]
    // 失信被执行人
    column24 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80
        },
        {
            title: '案号',
            dataIndex: 'an_no',
            key: 'an_no',
            width: 251
        },{
            title: '发布日期',
            dataIndex: 'public_date',
            key: 'public_date',
            width: 140
        },{
            title: '执行法院',
            dataIndex: 'execute_gov',
            key: 'execute_gov',
            width: 140
        },{
            title: '立案日期',
            dataIndex: 'lian_date',
            key: 'lian_date',
            width: 140
        },{
            title: '省份',
            dataIndex: 'province',
            key: 'province',
            width: 140
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 100
        }
    ]
    // 股权冻结
    column25 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80
        },
        {
            title: '被执行人',
            dataIndex: 'executed_by',
            key: 'executed_by',
            width: 180
        },{
            title: '股权数额',
            dataIndex: 'equity_amount',
            key: 'equity_amount',
            width: 140
        },{
            title: '执行法院',
            dataIndex: 'enforcement_court',
            key: 'enforcement_court',
            width: 180
        },{
            title: '执行通知书文号',
            dataIndex: 'execution_notice_num',
            key: 'execution_notice_num',
            width: 150
        },{
            title: '类型 /状态',
            dataIndex: 'status',
            key: 'status',
            width: 140
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 100
        }
    ]
    // 立案信息
    column26 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80
        },
        {
            title: '案号',
            dataIndex: 'case_no',
            key: 'case_no',
            width: 140
        },{
            title: '立案日期',
            dataIndex: 'regist_date',
            key: 'regist_date',
            width: 140
        },{
            title: '公诉人/原告/上诉人/申请人',
            dataIndex: 'prosecutor_list_name',
            key: 'prosecutor_list_name',
            width: 200
        },{
            title: '被告人/被告/被上诉人/被申请人',
            dataIndex: 'defendant_list_name',
            key: 'defendant_list_name',
            width: 200
        },{
            title: '操作',
            dataIndex: 'seeDetail',
            key: 'seeDetail',
            width: 100
        }
    ]
    // 法律诉讼-end

    // 开庭公告详情表格
    column27 = [
        [{
            title: '案由',
            dataIndex: 'case_reason',
        },{
            title: '案号',
            dataIndex: 'case_no',
        }],
        [{
            title: '开庭时间',
            dataIndex: 'lian_date',
        },{
            title: '法庭',
            dataIndex: 'execute_unite',
        }],
        [{
            title: '排期日期',
            dataIndex: 'schedule_time',
        },{
            title: '承办部门',
            dataIndex: 'undertake_department',
        }],
        [{
            title: '审判长/主审人',
            dataIndex: 'chief_judge',
        },{
            title: '上诉人',
            dataIndex: 'prosecutor_list',
        }],
        [{
            title: '被上诉人',
            dataIndex: 'defendant_list',
        },{
            title: '法院',
            dataIndex: 'execute_gov',
        }]
    ]


    // 法院公告详情表格
    column28 = [
        [{
            title: '上诉人',
            dataIndex: 'prosecutor_name',
        },{
            title: '被上诉人',
            dataIndex: 'defendant_name',
        }],
        [{
            title: '公告类型',
            dataIndex: 'category',
        },{
            title: '执行法院',
            dataIndex: 'court',
        }],
        [{
            title: '当事人',
            dataIndex: 'party',
        },{
            title: '公告人',
            dataIndex: 'undertake_department',
        }],
        [{
            title: '公布日期',
            dataIndex: 'published_date',
        },{
            title: '内容',
            dataIndex: 'content',
        }]
    ]

    // 失信详情表格
    column29 = [
        [{
            title: '被执行人姓名/名称',
            dataIndex: 'name',
        },{
            title: '立案时间',
            dataIndex: 'lian_date',
        }],
        [{
            title: '案号',
            dataIndex: 'an_no',
        },{
            title: '身份证号码/组织机构代码',
            dataIndex: 'org_no',
        }],
        [{
            title: '法定代表人或者负责人姓名',
            dataIndex: 'owner_name',
        },{
            title: '执行法院',
            dataIndex: 'execute_gov',
        }],
        [{
            title: '做出执行依据单位',
            dataIndex: 'execute_unite',
        },{
            title: '生效法律文书确定的义务',
            dataIndex: 'yiwu',
        }],
        [{
            title: '被执行人的履行情况',
            dataIndex: 'execute_status',
        },{
            title: '失信被执行人行为具体情形',
            dataIndex: 'action_remark',
        }],
        [{
            title: '发布时间',
            dataIndex: 'public_date',
        },{
            title: '执行依据文号',
            dataIndex: 'execute_no',
        }]
    ]

    // 股权冻结详情表格
    column30 = [
        [{
            title: '被执行人',
            dataIndex: 'executed_by',
        },{
            title: '股权数额',
            dataIndex: 'equity_amount',
        }],
        [{
            title: '执行法院',
            dataIndex: 'enforcement_court',
        },{
            title: '执行通知书文号',
            dataIndex: 'execution_notice_num',
        }],
        [{
            title: '股权冻结执行事项',
            dataIndex: 'execution_freeze_matters',
        },{
            title: '股权冻结执行文书文号',
            dataIndex: 'execution_freeze_doc_num',
        }],
        [{
            title: '股权冻结执行裁定书文号',
            dataIndex: 'execution_freeze_verdict_num',
        },{
            title: '股权冻结被执行人证件种类',
            dataIndex: 'executed_person_freeze_doc_type',
        }],
        [{
            title: '股权冻结被执行人证件号码',
            dataIndex: 'executed_person_freeze_doc_num',
        },{
            title: '股权冻结开始日期',
            dataIndex: 'freeze_start_date',
        }],
        [{
            title: '股权冻结结束日期',
            dataIndex: 'freeze_end_date',
        },{
            title: '股权冻结期限',
            dataIndex: 'freeze_term',
        }],
        [{
            title: '股权冻结公示日期',
            dataIndex: 'freeze_public_date',
        },{
            title: '解除冻结执行事项',
            dataIndex: 'execution_unfreeze_matters',
        }],
        [{
            title: '解除冻结执行裁定书文号',
            dataIndex: 'execution_unfreeze_verdict_num',
        },{
            title: '解除冻结执行文书文号',
            dataIndex: 'execution_unfreeze_doc_num',
        }],
        [{
            title: '解除冻结被执行人证件种类',
            dataIndex: 'executed_person_unfreeze_doc_type',
        },{
            title: '解除冻结被执行人证件号码',
            dataIndex: 'executed_person_unfreeze_doc_num',
        }],
        [{
            title: '解除冻结日期',
            dataIndex: 'unfreeze_date',
        },{
            title: '解除冻结公示日期',
            dataIndex: 'unfreeze_public_date',
        }],
        [{
            title: '解冻机关',
            dataIndex: 'thaw_organ',
        },{
            title: '解冻文书号',
            dataIndex: 'thaw_doc_no',
        }],
        [{
            title: '股东变更执行事项',
            dataIndex: 'execution_change_matters',
        },{
            title: '股东变更执行裁定书文号',
            dataIndex: 'execution_change_verdict_num',
        }],
        [{
            title: '股东变更被执行人证件种类',
            dataIndex: 'executed_person_doc_type',
        },{
            title: '股东变更被执行人证件号码',
            dataIndex: 'executed_person_doc_num',
        }],
        [{
            title: '股东变更受让人',
            dataIndex: 'assignee',
        },{
            title: '股东变更协助执行日期',
            dataIndex: 'assist_exec_date',
        }],
        [{
            title: '股东变更协助执行日期',
            dataIndex: 'assist_exec_date',
        },{
            title: '股东变更受让人证件种类',
            dataIndex: 'assignee_doc_kind',
        }],
        [{
            title: '股东变更受让人证件号码',
            dataIndex: 'assignee_reg_no',
        },{
            title: '股东变更股权所在公司名称',
            dataIndex: 'stock_company_name',
        }]
    ]
    //立案信息详情

    column31 = [
        [{
            title: '案号',
            dataIndex: 'case_no',
        },{
            title: '法院',
            dataIndex: 'court',
        }],
        [{
            title: '承办部门',
            dataIndex: 'department',
        },{
            title: '承办法官',
            dataIndex: 'judger',
        }],
        [{
            title: '法官助理',
            dataIndex: 'assistant',
        },{
            title: '立案日期',
            dataIndex: 'regist_date',
        }],
        [{
            title: '开庭时间',
            dataIndex: 'hold_date',
        },{
            title: '结束日期',
            dataIndex: 'finish_date',
        }],
        [{
            title: '案件状态',
            dataIndex: 'case_status',
        },{
            title: '案件类型',
            dataIndex: 'case_type',
        }],
        [{
            title: '案由',
            dataIndex: 'reason',
        },{
            title: '公诉人/原告/上诉人/申请人名称',
            dataIndex: 'prosecutor_list_name',
        }],
        [{
            title: '被告人/被告/被上诉人/被申请人名称',
            dataIndex: 'prosecutor_list_name',
        }]
    ]

    render() {
        let { tags4, modalIsShow,modalIsShow2,modalIsShow3, modalIsShow4,modalIsShow5,tableObj, modalTableName,totalCount } = this.state;
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
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"managementRisk")}>经营风险</li>
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"managementState")}>经营状况</li>
                            <li className="tabLaw" onClick={this.tabSwitch.bind(this,"lawLitigation")}>法律诉讼</li>
                        </ul>
                        {/* tabs 切换 */}
                        <div className="info-tags">
                            <button className='tagItem' >开庭公告{totalCount == null ? 0 : this.handleNum(totalCount.court_anno_count)}</button>
                            <button className='tagItem' >裁判文书{totalCount == null ? 0 : this.handleNum(totalCount.judge_count)}</button>
                            <button className='tagItem' >法院公告{totalCount == null ? 0 : this.handleNum(totalCount.court_noti_count)}</button>
                            <button className='tagItem' >被执行人信息{totalCount == null ? 0 : this.handleNum(totalCount.zx_count)}</button>
                            <button className='tagItem' >失信被执行人{totalCount == null ? 0 : this.handleNum(totalCount.sx_count)}</button>
                            <button className='tagItem' >股权冻结{totalCount == null ? 0 : this.handleNum(totalCount.judicial_ass_count)}</button>
                            <button className='tagItem' >立案信息{totalCount == null ? 0 : this.handleNum(totalCount.case_filing_count)}</button>
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
                    tableName="开庭公告详情"
                    column={this.column27}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow}
                    closeModal={this.closeModal}
                />
                <DetailModal
                    tableName="法院公告详情"
                    column={this.column28}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow2}
                    closeModal={this.closeModal2}
                />
                <DetailModal
                    tableName="失信被执行人详情"
                    column={this.column29}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow3}
                    closeModal={this.closeModal3}
                />
                <DetailModal
                    tableName="股权冻结详情"
                    column={this.column30}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow4}
                    closeModal={this.closeModal4}
                />
                <DetailModal
                    tableName="立案信息详情"
                    column={this.column31}
                    tableObj={tableObj}
                    modalIsShow={modalIsShow5}
                    closeModal={this.closeModal5}
                />

                <EdsFooter />
            </div>
        )
    }
}