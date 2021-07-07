import api from '@/framework/axios';
import "./index.css";
import toTop from "../img/toTop.png";
import EdsHeader from '../edsHeader';
import EdsFooter from '../edsFooter';
import ReceptionTable from "@/components/receptionTable";
import DetailModal from "@/components/receptionTable/detailModal";
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
const imageOrigin = SystemConfig.configs.resourceUrl;
export default class BasicInfomation extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {
            ec_token: "",
            basicInfo: {}, // 基本信息
            creditCode:{},
            tags: [
                {name: "工商信息",id: 0},
                {name: "股东信息",id: 1},
                {name: "分支机构",id: 2},
                {name: "变更信息",id: 3},
                {name: "曾用名称",id: 5},
                {name: "主要人员",id: 4},
            ],
            modalIsShow: false, // 查看详情modal显示、隐藏
            tableObj: {},
            ciCount:{},
            modalTableName: ""
        }
    }
    componentWillMount() {
        this._isMounted = true;
        let companyName = getQueryString("companyName") ? getQueryString("companyName") : "中铁建金服科技（天津）有限公司";
        console.log(companyName,"companyName---")
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
            this.getCreditCode(r.data);
            this.getCiCount(r.data);
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

    getCreditCode = ( ec_token ) => {
        let _url = "#/edsApi/bussinessApi/getCreditCodeNew?" + ec_token;
        api.ajax('GET',_url).then(r => {
            this.setState({
                creditCode: r.data,
            })
        }).catch(r => { })
    }

    getCiCount =  ( ec_token ) => {
        let _url = "#/edsApi/bussinessApi/getCiCount?" + ec_token;
        api.ajax('GET',_url).then(r => {
            this.setState({
                ciCount: r.data.edsCiCount,
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
    // 纵向表格查看详情事件
    seeDetails = ( arr ) => {
        this.setState({
            modalIsShow: true,
            jiaoArr: arr
        })
    }

    //关闭查看详情modal
    closeModal = () => {
        this.setState({
            modalIsShow: false
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
                            <span className="po-right">官网：{this.handleStr(info.website_url)}</span>
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

    // 基本信息
    basicTableList = () => {
        let { infomation } = this.state.basicInfo;
        let credit = this.state.creditCode.creditCode;
        let { ec_token } = this.state;
        if(infomation && ec_token) {
            return(
                <div className="content-box">
                    <div className="contents-top actives2">
                        <div className="table-top">
                            {/* table 工商信息 */}
                            <div className="table-top-title">
                                <span className="topItem1">工商信息</span>
                            </div>
                            <div className="cesjio">
                                <div className="typical-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>法人</td>
                                                <td>{this.handleStr(infomation.oper_name)}</td>
                                                <td>注册资本</td>
                                                <td>{this.handleStr(infomation.regist_code)}</td>
                                            </tr>
                                            <tr>
                                                <td>实缴资本</td>
                                                <td>{this.handleStr(infomation.rec_cap)}</td>
                                                <td>企业状态</td>
                                                <td>{this.handleStr(infomation.status)}</td>
                                            </tr>
                                            <tr>
                                                <td>成立日期</td>
                                                <td>{this.handleStr(infomation.create_time)}</td>
                                                <td>企业类型</td>
                                                <td>{this.handleStr(infomation.econ_code)}</td>
                                            </tr>
                                            <tr>
                                                <td>组织机构代码</td>
                                                <td>{this.handleStr(infomation.org_no)}</td>
                                                <td>社会信用代码</td>
                                                <td>{this.handleStr(infomation.credit_code)}</td>
                                            </tr>
                                            <tr>
                                                <td>英文名</td>
                                                <td>{this.handleStr(infomation.english_name)}</td>
                                                <td>所属地区</td>
                                                <td>{this.handleStr(infomation.province)}</td>
                                            </tr>
                                            <tr>
                                                <td>开户行</td>
                                                <td> {this.handleStr(credit.bank)}</td>
                                                <td>开户行帐号</td>
                                                <td>{this.handleStr(credit.bank_account)}</td>
                                            </tr>
                                            <tr>
                                                <td>人员规模</td>
                                                <td>{this.handleStr(infomation.person_scope)}</td>
                                                <td>参保人员</td>
                                                <td>{this.handleStr(infomation.insured_count)}</td>
                                            </tr>
                                            <tr>
                                                <td>营业开始时间</td>
                                                <td>{this.handleStr(infomation.term_start)}</td>
                                                <td>营业结束时间</td>
                                                <td>{this.handleStr(infomation.term_end)}</td>
                                            </tr>
                                            <tr>
                                                <td>所属地区</td>
                                                <td colSpan="3">{this.handleStr(infomation.city)}</td>
                                            </tr>
                                            <tr>
                                                <td>企业地址</td>
                                                <td colSpan="3">{this.handleStr(infomation.address)}</td>
                                            </tr>
                                            <tr>
                                                <td>经营范围</td>
                                                <td colSpan="3">{this.handleStr(infomation.scope)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* table 股东信息 */}
                            <ReceptionTable 
                                column={this.column1}
                                tableName="股东信息"
                                url="#/edsApi/bussinessApi/getBussinessByKeyWord?"
                                listName="stockholderList"
                                seeDetails={this.seeDetails}
                                ec_token={ec_token}
                            />
                            {/* table 分支机构 */}
                            <ReceptionTable 
                                column={this.column2}
                                tableName="分支机构"
                                url="#/edsApi/bussinessApi/getBussinessByKeyWord?"
                                listName="branchesList"
                                ec_token={ec_token}
                            />
                            {/* table 变更信息 */}
                            <ReceptionTable 
                                column={this.column3}
                                tableName="变更信息"
                                url="#/edsApi/bussinessApi/getBussinessByKeyWord?"
                                listName="changeRecordsList"
                                ec_token={ec_token}
                            />

                            {/* table 曾用名称 */}
                            <ReceptionTable
                                column={this.column5}
                                tableName="曾用名称"
                                url="#/edsApi/bussinessApi/getBussinessByKeyWord?"
                                listName="originalList"
                                ec_token={ec_token}
                            />


                            {/* table 主要人员 */}
                            <ReceptionTable 
                                column={this.column4}
                                tableName="主要人员"
                                url="#/edsApi/bussinessApi/getBussinessByKeyWord?"
                                listName="employeeList"
                                ec_token={ec_token}
                            />
                        </div>
                    </div>
                </div>
            )
        }
    }

    // 基本信息-start
    // 股东信息
    column1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '股东姓名',
            dataIndex: 'stock_name',
            key: 'stock_name',
            width: 120
        },{
            title: '出资比例',
            dataIndex: 'stock_percen',
            key: 'stock_percen',
            width: 140
        },{
            title: '认缴出资额',
            dataIndex: 'should_capi',
            key: 'should_capi',
            width: 200
        },{
            title: '认缴出资时间',
            dataIndex: 'shoud_date',
            key: 'shoud_date',
            width: 200
        }
    ]
    // 分支机构
    column2 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '机构名称',
            dataIndex: 'name',
            key: 'name',
            width: 120
        },{
            title: '登记机关',
            dataIndex: 'belong_org',
            key: 'belong_org',
            width: 140
        }
    ]
    // 变更信息
    column3 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '变更项目',
            dataIndex: 'project_name',
            key: 'project_name',
            width: 120
        },{
            title: '变更前',
            dataIndex: 'before_conte',
            key: 'before_conte',
            width: 140
        },{
            title: '变更后',
            dataIndex: 'after_conten',
            key: 'after_conten',
            width: 140
        },{
            title: '变更日期',
            dataIndex: 'change_date',
            key: 'change_date',
            width: 140
        }
    ]
    // 主要人员
    column4 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '人员姓名',
            dataIndex: 'employee_name',
            key: 'employee_name',
            width: 120
        },{
            title: '人员职位',
            dataIndex: 'employee_position',
            key: 'employee_position',
            width: 140
        }
    ]
    // 曾用名称
    column5 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '曾用名称',
            dataIndex: 'original_name',
            key: 'original_name',
            width: 120
        },{
            title: '变更时间',
            dataIndex: 'change_date',
            key: 'change_date',
            width: 140
        }
    ]


    // 纵向表格
    column27 = [
        [{
            title: '法人',
            dataIndex: 'create_time',
        },{
            title: '注册资本',
            dataIndex: 'del_flag',
        }],
        [{
            title: '实缴资本',
            dataIndex: 'invest_name',
        },{
            title: '实缴资本',
            dataIndex: 'invest_type',
        }],
        [{
            title: '成立日期',
            dataIndex: 'shoud_date',
        },{
            title: '企业类型',
            dataIndex: 'should_capi',
        }],
        [{
            title: '组织机构代码',
            dataIndex: 'stock_name',
        },{
            title: '社会信用代码',
            dataIndex: 'stock_type',
        }]
    ]

    render() {
        let { tags, modalIsShow, jiaoArr, modalTableName,ciCount } = this.state;
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
                            <li className="tabLaw" onClick={this.tabSwitch.bind(this,"basicInfomation")} onClick={this.tabSwitch.bind(this,"basicInfomation")}>基本信息</li>
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"managementRisk")}>经营风险</li>
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"managementState")}>经营状况</li>
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"lawLitigation")}>法律诉讼</li>
                        </ul>
                        {/* tabs 切换 */}
                        <div className="info-tags">

                            <button className='tagItem'>工商信息</button>
                            <button className='tagItem'>股东信息{ciCount == null ? 0 : this.handleNum(ciCount.stock_holder_count)}</button>
                            <button className='tagItem'>分支机构{ciCount == null? 0 : this.handleNum(ciCount.branch_count)}</button>
                            <button className='tagItem'>变更信息{ciCount == null ? 0 : this.handleNum(ciCount.change_count)}</button>
                            <button className='tagItem'>曾用名称</button>
                            <button className='tagItem'>主要人员{ciCount == null ? 0 : this.handleNum(ciCount.major_count)}</button>

                        </div>
                        {/* page 基本信息-------- */}
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
                    tableObj={jiaoArr}
                    modalIsShow={modalIsShow}
                    closeModal={this.closeModal}
                />
                <EdsFooter />
            </div>
        )
    }
}