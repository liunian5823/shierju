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
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
const imageOrigin = SystemConfig.configs.resourceUrl;
export default class ManagementState extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {
            ec_token: "",
            basicInfo: {}, // 基本信息
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
        let _str = str &&  str != null &&  str != 'null' ? str : "暂无数据";
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
        let _url = "#/edsAPi/BusinessState/getBusinessStateCount?" + ec_token;
        api.ajax('GET',_url).then(r => {
            this.setState({
                totalCount: r.data.bussinessStateCount,
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

    // 经营状况
    basicTableList = () => {
        let { ec_token, totalCount } = this.state;
            if(ec_token && totalCount) {
                return(
                    <div className="content-box">
                    <div className="contents-top active">
                        <div className="table-top">
                            {/* table 企业业务信息 */}
                            <AfterPaTable 
                                column={this.column16}
                                tableName="企业业务信息"
                                url="#/edsAPi/BusinessState/getCompanyProducts?"
                                listName="edsCompanyProductsEntities"
                                ec_token={ec_token}
                                totalCount={totalCount.products_count}
                            />
                            {/* table 行政许可 */}
                            <AfterPaTable 
                                column={this.column17}
                                tableName="行政许可"
                                url="#/edsAPi/BusinessState/getAdministrativeLicense?"
                                listName="edsAdminIstrativeLicenseEntities"
                                ec_token={ec_token}
                                totalCount={totalCount.admin_license_count}
                            />
                            {/* table 税务信用 */}
                            <ReceptionTable 
                                column={this.column18}
                                tableName="税务信用"
                                url="#/edsAPi/BusinessState/getTaxCredit?"
                                listName="edsTaxCreditEntities"
                                ec_token={ec_token}
                            />
                            {/* table 招投标信息 */}
                            <AfterPaTable 
                                column={this.column19}
                                tableName="招投标信息"
                                url="#/edsAPi/BusinessState/getTender?"
                                listName="edsTenderEntities"
                                ec_token={ec_token}
                                totalCount={totalCount.tender_count}
                            />
                        </div>
                    </div>
                </div>
                )
            }
    }

    // 经营状况-start
    // 企业业务信息
    column16 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '产品名称',
            dataIndex: 'name',
            key: 'name',
            width: 100
        },{
            title: '产品图片',
            dataIndex: 'img_url',
            key: 'img_url',
            width: 140
        },{
            title: '融资信息',
            dataIndex: 'domain',
            key: 'domain',
            width: 140
        },{
            title: '成立日期',
            dataIndex: 'create_time',
            key: 'create_time',
            width: 140
        },{
            title: '所属地',
            dataIndex: 'category',
            key: 'category',
            width: 140
        },{
            title: '产品介绍',
            dataIndex: 'description',
            key: 'description',
            width: 140
        }
    ]
    // 行政许可
    column17 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '行政许可编号',
            dataIndex: 'licens_doc_no',
            key: 'licens_doc_no',
            width: 140
        },{
            title: '许可文件名称',
            dataIndex: 'licens_doc_name',
            key: 'licens_doc_name',
            width: 140
        },{
            title: '有效期自',
            dataIndex: 'validity_from',
            key: 'validity_from',
            width: 140
        },{
            title: '有效期至',
            dataIndex: 'validity_to',
            key: 'validity_to',
            width: 140
        },{
            title: '许可机关',
            dataIndex: 'licens_office',
            key: 'licens_office',
            width: 140
        },{
            title: '许可内容',
            dataIndex: 'licens_content',
            key: 'licens_content',
            width: 140
        }
    ]
    // 税务信用
    column18 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 100
        },
        {
            title: '评价年度',
            dataIndex: 'year',
            key: 'year',
            width: 100
        },{
            title: '纳税人识别号',
            dataIndex: 'no',
            key: 'no',
            width: 140
        },{
            title: '纳税信用等级',
            dataIndex: 'level',
            key: 'level',
            width: 140
        },{
            title: '评价单位',
            dataIndex: 'org',
            key: 'org',
            width: 140
        }
    ]
    // 招投标信息
    column19 = [
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
            width: 250
        },{
            title: '发布日期',
            dataIndex: 'pub_date',
            key: 'pub_date',
            width: 140
        },{
            title: '原文链接',
            dataIndex: 'content_url',
            key: 'content_url',
            width: 140
        },{
            title: '项目分类',
            dataIndex: 'channel_name',
            key: 'channel_name',
            width: 140
        }
    ]
    // 经营状况-end


    render() {
        let {  tableObj, modalTableName,totalCount  } = this.state;
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
                            <li className="tabLaw" onClick={this.tabSwitch.bind(this,"managementState")}>经营状况</li>
                            <li className="tabLaw_hid" onClick={this.tabSwitch.bind(this,"lawLitigation")}>法律诉讼</li>
                        </ul>
                        {/* tabs 切换 */}
                        <div className="info-tags">
                            <button className='tagItem' >企业业务信息{totalCount == null ? 0 : this.handleNum(totalCount.products_count)}</button>
                            <button className='tagItem' >行政许可{totalCount == null ? 0 : this.handleNum(totalCount.admin_license_count)}</button>
                            <button className='tagItem' >税务信用{totalCount == null ? 0 : this.handleNum(totalCount.tax_count)}</button>
                            <button className='tagItem' >招投标信息{totalCount == null ? 0 : this.handleNum(totalCount.tender_count)}</button>
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
                <EdsFooter />
            </div>
        )
    }
}