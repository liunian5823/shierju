import {Tabs, Row, Col, Button, Table, Card, Radio,Tooltip,BackTop,Icon} from 'antd';
import BaseDetails from '@/components/baseDetails';
import moment from 'moment';
import { systemConfigPath } from '@/utils/config/systemConfig';
import {NumberFormat} from "@/components/gaoda/Format";
import inquiryDetailHead1 from '@/static/iconfont/inquiryDetail_header1.png';
import inquiryDetailHead2 from '@/static/iconfont/inquiryDetail_header2.png';
import Fujian from '@/static/iconfont/fujian.png';
import less from './inquiryDetail.less';
import BaseAffix from '@/components/baseAffix';
import {exportFile} from "@/utils/urlUtils";
import SelectArea from '@/components/content/SelectArea'
import InquiryApprovalLogList from "@/pages/inquiry/inquiryApprovalLogList";
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';

class InquiryDetail extends React.Component {
    state = {
        dataSource: {},//基础数据
        options1:[],//询价产品信息(4条)
        options2:[],//询价产品信息(所有)
        options3:[],//要显示的询价产品信息
        quotations:[], //报价信息集合
        // options4:{},
        userInfo:{},
        orderList: [],
        value:"",
        mallValence:0,//供应商报价总价格(默认是0)
        tax: 0
    }
    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        let uuids = this.props.match.params.uuids;
        this.refresh(uuids);
        this.getOrderList(uuids);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getOrderList = (uuids) =>{
            const params ={};
            params.uuids =uuids;
            axios.get("@/platform/inquiry/detail/getOrderetails",{
                params:params  
            }).then(r => {
                  this.setState({
                    orderList: r.data
                  })  
              })
    }


    //刷新询价单详情数据
    refresh = (uuids)=>{
        if(uuids !=null){
            let that = this;
            const params = {};
            params.uuids =uuids;
            // axios.get("!!/inquiry/inquiryDetailController/getInquiryDetail",{
            axios.get("@/platform/inquiry/detail/getInquiryDetails",{
                params:params
            }).then(r=>{         
                // if(r.data !=null){
                if(r !=null){
                    //生成中标供应商信息
                    let value="";
                    let userInfo={};
                    // if(r.data.checkedCompanyId == 0){
                    if(r.checkedCompanyId == 0){
                        // value = r.data.quotations[0].companyId;
                        // userInfo.sellerName= r.data.quotations[0].sellerName;
                        // userInfo.email= r.data.quotations[0].email;
                        // userInfo.contactMans= r.data.quotations[0].contactMans;
                        // userInfo.contactPhone= r.data.quotations[0].contactPhone;
                        //value = r.quotations[0].companyId;
                        //userInfo.sellerName= r.quotations[0].sellerName;
                        //userInfo.email= r.quotations[0].email;
                        //userInfo.contactMans= r.quotations[0].contactMans;
                        //userInfo.contactPhone= r.quotations[0].contactPhone;
                    }else{
                        value =r.data.checkedCompanyId;
                        for(let i=0;i<r.data.quotations.length;i++){
                            if(value == r.data.quotations[i].companyId){
                                userInfo.sellerName= r.data.quotations[i].sellerName;
                                userInfo.email= r.data.quotations[i].email;
                                userInfo.contactMans= r.data.quotations[i].contactMans;
                                userInfo.contactPhone= r.data.quotations[i].contactPhone;
                                break;
                            }
                        }
                        // value =r.checkedCompanyId;
                        // for(let i=0;i<r.quotations.length;i++){
                        //     if(value == r.quotations[i].companyId){
                        //         userInfo.sellerName= r.quotations[i].sellerName;
                        //         userInfo.email= r.quotations[i].email;
                        //         userInfo.contactMans= r.quotations[i].contactMans;
                        //         userInfo.contactPhone= r.quotations[i].contactPhone;
                        //         break;
                        //     }
                        // }
                    }

                    //询价产品添加物流费+展示方式拆分
                    let options1=[];
                    let options2=[];
                    
                    if(r.data.itemList !=null){
                    // if(r.itemList !=null){
                        for(let i=0;i<r.data.itemList.length;i++){
                            r.data.itemList[i].key=i;
                        }
                        // for(let i=0;i<r.itemList.length;i++){
                        //     r.itemList[i].key=i;
                        // }
                        if(r.data.itemList.length>4){
                        // if(r.itemList.length>4){
                            options1 = r.data.itemList;
                            options2 = r.data.itemList.slice(0, 5);
                            // options1 = r.itemList;
                            // options2 = r.itemList.slice(0, 5);
                            let log = {};
                            log.productCategory = "-";
                            log.key =r.data.itemList.length;
                            // log.key =r.itemList.length;
                            log.materialName = "运费";
                            log.specifications = "-";
                            log.brand = "-";
                            log.materialDescription = "-";
                            log.count = "1";
                            log.unit = "笔";
                            log.picandfileName = "-";
                            let log2 = {};
                            log2.productCategory = "-";
                            log2.key =5;
                            log2.materialName = "运费";
                            log2.specifications = "-";
                            log2.brand = "-";
                            log2.materialDescription = "-";
                            log2.count = "1";
                            log2.unit = "笔";
                            log2.picandfileName = "-";
                            options1.push(log);
                            options2.push(log2);
                        }else{
                            options1 =r.data.itemList;
                            // options1 =r.itemList;
                            let log={};
                            log.productCategory="-";
                            log.key =r.data.itemList.length;
                            // log.key =r.itemList.length;
                            log.materialName="运费";
                            log.specifications="-";
                            log.brand="-";
                            log.materialDescription="-";
                            log.count="1";
                            log.unit="笔";
                            log.picandfileName="-";
                            options1.push(log);
                            options2 =options1;
                        }
                    }

                    //已报价供应商信息过滤
                    let quotations = [];
                    if(r.data.quotations != null){
                        for(let i=0;i<r.data.quotations.length;i++){
                            if(r.data.quotations[i].status ==1 || r.data.quotations[i].status ==2 ||r.data.quotations[i].status ==4){
                                quotations.push(r.data.quotations[i]);
                            }
                        }
                    }
                    // if(r.quotations != null){
                    //     for(let i=0;i<r.quotations.length;i++){
                    //         if(r.quotations[i].status ==1 || r.quotations[i].status ==2 ||r.quotations[i].status ==4){
                    //             quotations.push(r.quotations[i]);
                    //         }
                    //     }
                    // }

                    //数据保存
                    this.setState({
                        dataSource:r.data,
                        // dataSource:r,
                        options1:options1,
                        options2:options2,
                        options3:options2,
                        // orderList:r.data,
                        quotations:quotations,
                        value:value,
                        userInfo:userInfo
                        
                    })
                }
            })
        }else{
            //uuids为空时初始化数据结构
            this.setState({
                dataSource:{},
                options1:[],
                options2:[],
                options3:[],
                quotations:[],
                value:"",
                userInfo:{}
            })
        }
    }

    //订单详情，跳转订单详情页
    handleToDetails = (uuids) => {
        let param = {}
        param.uuids = uuids
        param.goBackUrl = '/platInvoice/orderManagement';
        // this.props.history.push(getUrlByParam('/platInvoice/orderDetail', param));
        window.open(systemConfigPath.jumpPage(getUrlByParam('/platInvoice/orderDetailNew', param)))
    }

    columns = [{
        title: '商品类别',
        dataIndex: 'productCategory',
        key: 'productCategory',
        width:100
    }, {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        width:100
    }, {
        title: '规格',
        dataIndex: 'specifications',
        key: 'specifications',
        width:100
    },{
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width:100
    }, {
        title: '物料描述',
        dataIndex: 'materialDescription',
        key: 'materialDescription',
        width:300
    }, {
        title: '采购数量',
        dataIndex: 'count',
        key: 'count',
        width:100
    }, {
        title: '计量单位',
        dataIndex: 'unit',
        key: 'unit',
        width:100
    }, {
        title: '附件',
        dataIndex: 'picandfileName',
        key: 'picandfileName',
        width:100,
        render: (text, record) => {
            if(record !=null){
                if(record.picandfileName == "" || record.picandfileName == "—" || record.picandfileName == null){
                    return(<span><p>-</p></span>)
                }else {
                    let url="";
                    url = record.picandfilePath +"?filename="+ record.picandfileName;
                    return(<span title={record.picandfileName}><a href={SystemConfig.systemConfigPath.dfsPathUrl(url)} target="_blank">{record.picandfileName}</a></span>)
                }
            }else {
                return(<span><p>-</p></span>)
            }
        }
    }];


    columns2 = [{
        title: '序号',
        width:80,
        render:(text,record,index)=>`${index+1}`
        
    }, {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width:150
    }, {
        title: '下单人',
        dataIndex: "userName",
        key: "userName",
        width:100,
        render:(text,record)=>{
            return <div>
                <p>{record.userName ? record.userName :''}</p>
                <p>{record.userNo?record.userNo:''}</p>
            </div>
        }
    },{
        title: '金额(元)',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width:100,
        render:(text,record)=>{
            return <p>{text ? <NumberFormat value={text}/> : '--'}</p>
        }
    }, {
        title: '下单时间',
        dataIndex: 'orderCreateTimeStr',
        key: 'orderCreateTimeStr',
        width:130
    }, {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width:100,
        render:(text,record)=>{
            let orderStatus = record.orderStatus;
            let status = "";
            if(orderStatus == 10 || orderStatus == 23){
                status ="待确认";
            }else if(orderStatus == 20){
                status ="审核中";
            }else if(orderStatus == 30){
                status ="未发货";
            }else if(orderStatus == 40){
                status ="待收货";
            }else if(orderStatus == 50){
                status ="质保中";
            }else if(orderStatus == 70){
                status ="已完成";
            }else if(orderStatus == 100){
                status ="失效";
            }
            return <p>{status}</p>
        }
    }, {
        title: '附属状态',
        dataIndex: 'statusStr',
        key: 'statusStr',
        width:200,
        render:(text,record)=>{
        let oldFlag = record.oldFlag;
        let orderStatus = record.orderStatus;
        let invoiceStatus = record.invoiceStatus;
        let buyerBalanceStatus = record.buyerBalanceStatus;
        let otherStatus = '';
        let balanceStatusStr = '';
        let orderFlagStr = '';

        if(oldFlag == 3){
            if(orderStatus == 100){
               otherStatus = '--';
            }
            if(40 == orderStatus   ||   50 == orderStatus  || 70 == orderStatus){
                if(0 == invoiceStatus){
                      otherStatus = "（未开票）";
                }else if(1 == invoiceStatus){
                      otherStatus = "（已开票）";
                }
            } 
            if(30 == orderStatus   || 40 == orderStatus   ||   50 == orderStatus  || 70 == orderStatus){
                if(1 == buyerBalanceStatus || 4 == buyerBalanceStatus){
                      balanceStatusStr = "（待结算）";
                }
                if(30 == buyerBalanceStatus){
                      balanceStatusStr = "（待结算）";
                }else if(40 == buyerBalanceStatus || 41 == buyerBalanceStatus){
                      balanceStatusStr = "（结算中）";
                }else if(60 == buyerBalanceStatus){
                       balanceStatusStr = "（已结算）";
                }
            }
            if(23 == orderStatus){
                orderFlagStr = "（已驳回）"
            }
            if(10 == orderStatus){
                orderFlagStr = "--"
            }
        }else{
            if (buyerBalanceStatus == 1) {
                  balanceStatusStr = " (待开票) ";
            } else if (buyerBalanceStatus == 4) {
                  balanceStatusStr = " (质保期) ";
            } else if (buyerBalanceStatus == 2) {
                  balanceStatusStr = " (已开票) ";
            } else if (buyerBalanceStatus == 10) {
                  balanceStatusStr = " (已完成) ";
            }
            if(23 == orderStatus){
                orderFlagStr = "（已驳回）"
            }
        }
            return <p>{otherStatus}{balanceStatusStr}{orderFlagStr}</p>
        }
    }, {
        title: '操作',
        key: 'caozuo',
        width: 100,
        render: (text, record) => (
            <span>
        <a onClick={() => this.handleToDetails(record.uuids)}>查看</a>
        {/*<a style={{marginLeft:"8px"}} onClick={() => this.stopOrder(record.uuids)}>订单终止</a>*/}
      </span>

        ),
    }];






    interestRate=(way,interestRateDays)=>{
        let con=""
        if(way !="" && interestRateDays !=""){
            con=<span><span>{way}</span><span style={{marginLeft:"24px"}}>( {interestRateDays} 天)</span></span>;
        }else if(way !="" && interestRateDays ==""){
            con= <span>{way}</span>;
        }
        return con;
    }

    columns1 = [{
        title: '供应商名称',
        dataIndex: 'sellerName',
        key: 'sellerName',
        width:100
    }, {
        title: '联系方式',
        dataIndex: 'fs',
        key: 'fs',
        width:100,
        render: (text, record) => {
            return (
                <span>
                   <p>{record.contactMans}</p>
                   <p>{record.contactPhone}</p>
                </span>
            );
        },
    }, {
        title: '报价日期',
        dataIndex: 'quotationTimeStr',
        key: 'quotationTimeStr',
        width:100
    },{
        title: '报价有效期',
        dataIndex: 'validityQuotationYMDStr',
        key: 'validityQuotationYMDStr',
        width:100
    }, {
        title: '预期到货日期',
        dataIndex: 'stockingCycle',
        key: 'stockingCycle',
        width:100,
        render: (text, record) => {
            return (
                <span><p>{record.validityQuotationYMDStr}</p></span>
            );
        },
    }, 
    // {
    //     title: '报价含税',
    //     dataIndex: 'taxPoint',
    //     key: 'taxPoint',
    //     width:100,
    //     render: (text, record) => {
    //         if(record !=null){
    //             if(record.taxPoint !=null){
    //                 return (
    //                     <span>
    //                          <p>{record.taxPoint*100}%</p>
    //                     </span>
    //                 );
    //             }
    //         }
    //     },
    // }
    {
        title: '税额',
        dataIndex: 'tax',
        key: 'tax',
        width:100,
        render: (text, record) => {
            if(record !=null){
                if(record.tax !=null){
                    return (
                        <span>
                             <p>{record.tax}</p>
                        </span>
                    );
                }
            }
        },
    }
    , {
        title: '报价总金额(元)',
        dataIndex: 'mallValence',
        key: 'mallValence',
        width:100,
        render: (text, record) => {
            return (
                <span className="ellipsistext" style={{textAlign: "right"}}>
                    {record.mallValence?<NumberFormat value={record.mallValence}/>:0.00}
                </span>
            );
        },
    }, {
        title: '状态',
        dataIndex: 'statusFlag',
        key: 'statusFlag',
        width:100,
        render: (text, record) => {
            if(record.status ==1){
                return (<span>
                    <p style={{color:"rgba(61,185,0,0.85)"}}>{record.statusStr}</p>
                </span>
                );
            }else {
                return (<span>
                    <p style={{color:"rgba(0,0,0,0.25)"}}>{record.statusStr}</p>
                </span>
                );
            }
        },
    }];

    /**
     * 跳转到报价详情页面(采购商)
     */
    toQuotationDetai=(id,companyId)=>{
        let params = {};
        params.companyId = companyId;
        params.id = id;
        window.open(systemConfigPath.jumpPage(getUrlByParam("/inquiryDetail/PurchasersQuotationDetail",params)));
    }

    /**
     * 询价方式及隐私设置 - 短信提醒(择标中)或自动匹配(询价中)显示
     * @returns {*}
     */
    Reminding=()=>{
        let flag =this.state.dataSource.statusFlag;
        if(flag !=undefined  && flag !=null){
            let style="";
            let sendType =this.state.dataSource.sendType;
            let message ="";
            if(sendType ==2){
                message="开启";
            }else{
                message="关闭";
            }
            if( flag ==2){
                style=
                    <Col span={12} className={less.rightCol}>
                        <BaseDetails title="短信通知">
                            {message}
                        </BaseDetails>
                    </Col>
            }else {
                style=
                    <Col span={12} className={less.rightCol}>
                        <BaseDetails title="短信通知">
                            {this.state.dataSource.sendTypeStr}
                        </BaseDetails>
                    </Col>
            }
            return style;
        }
    }

    //头部标题的图片样式
    headStyle=()=>{
        let status =this.state.dataSource.status;
        let statusFlag = this.state.dataSource.statusFlag;
        if(status ==0 || status ==1 ||status ==5 ||status ==6 || (status ==10 && statusFlag==1)){
            return inquiryDetailHead1;
        }else {
            return inquiryDetailHead2;
        }
    }

    //注册资金显示
    registeredCapitalShow=(data)=>{
        if(this.state.dataSource !=null && this.state.dataSource.registeredCapital !=null){
            return <span>{data}万元以上</span>
        }
    }

    //证件要求显示
    zjyqName=(data)=>{
        if(data !=null && data !=undefined){
            let arr = data.split(",");
            let arrs=[];
            for (let i=0;i<arr.length;i++){
                if(i==0){
                    arrs.push(<span>{arr[i]}</span>)
                }else {
                    arrs.push(<span style={{marginLeft:"24px"}}>{arr[i]}</span>)
                }

            }
            return arrs;
        }
    }

    //判断询价产品的条数
    itemLength=()=>{
        let options=[];
        if(this.state.dataSource.itemList !=undefined && this.state.dataSource.itemList.length >5){
            return true;
        }else {
            return false;
        }
    }

    //点击查看更多询价产品
    orderMore = () => {
        let dataSource = this.state.dataSource;
        if (dataSource.itemListStatus == 1) {
            dataSource.itemListStatus = undefined;
            if(this.state.dataSource.itemList !=undefined && this.state.dataSource.itemList.length >5){
                this.setState({
                    options3:this.state.options2
                    
                })
            }
        } else {
            dataSource.itemListStatus = 1;
            if(this.state.dataSource.itemList !=undefined && this.state.dataSource.itemList.length >5){
                this.setState({
                    options3:this.state.options1
                })
            }
        }
        this.setState({
            dataSource: dataSource
        })
    }

    // itemLength=()=>{
    //     let options=[];
    //     if(this.state.dataSource.itemList !=undefined && this.state.dataSource.itemList.length >5){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    quotationsLength=()=>{
        let options=[];
        if(this.state.dataSource.quotations !=undefined && this.state.dataSource.quotations.length >5){
            return true;
        }else {
            return false;
        }
    };

    //点击查看更多报价信息
    quotationsMore = () => {
        let quotations=[];
        let dataSource = this.state.dataSource;
        if (dataSource.quotationsStatus == 1) {
            dataSource.quotationsStatus = undefined;
            if(this.state.dataSource.quotations !=undefined && this.state.dataSource.quotations.length >5){
                quotations=this.state.dataSource.quotations.slice(0,5);
                this.setState({
                    quotations:quotations
                })
            }
        } else {
            dataSource.quotationsStatus = 1;
            if(this.state.dataSource.quotations !=undefined && this.state.dataSource.quotations.length >5){
                quotations=this.state.dataSource.quotations
                this.setState({
                    quotations:quotations
                })
            }
        }
        this.setState({
            dataSource: dataSource
        })
    }

    //询价单详情 - 导出
    erxporData=(id)=>{
        let params = {};
        let uuids = this.props.match.params.uuids;
        params.uuids = uuids;
        exportFile("/inquiry/inquiryDetailController/quotationNewExportData",params)
    }

    //报价详情的title显示
    bjxqTitle=(flag)=>{
        if(this.state.dataSource.quotations !=undefined && this.state.dataSource.quotations.length >0){
            let num = 0;
            let data =this.state.dataSource.quotations;
            for(let i=0;i<this.state.dataSource.quotations.length;i++){
                if(data[i].status ==1){
                    num++;
                }
            }
            return <span> 报价详情<small style={{marginLeft: "18px",color:"rgba(0,0,0,0.45)"}}>收到报价({num})</small></span>
        }else{
            return <span> 报价详情<small style={{marginLeft: "18px",color:"rgba(0,0,0,0.45)"}}>收到报价(0)</small></span>
        }
    }

    
    //根据询价单状态判断怎么显示报价信息
    statusStyle=()=>{
        let status = this.state.dataSource.status;
        if(status ==1 || status ==5 ||status ==6){//1:草稿，5待审核6驳回
            return;
        }else if(status ==10){//10已发布待（询价中，择标中）
            let statusFlag = this.state.dataSource.statusFlag;
            if(statusFlag ==1){//询价中
                let result =
                    <Card bordered={false} className="mb10" style={{height:"484px"}} title={this.bjxqTitle()} extra={<Button  type="ghost" disabled>导出报价</Button>}>
                        <Table pagination={false} dataSource={[]} columns={this.columns1}/>
                        <div className={less.baojia_text}>
                            <span className={less.baojia_text_span}>
                                <em className={less.baojia_text_span_em}>询价单将在</em>
                                <em className={less.baojia_text_span_em} style={{marginLeft:"4px"}}>{this.state.dataSource.stopDays}</em>
                                <em className={less.baojia_text_span_em} style={{marginLeft:"4px"}}>天后截止</em>
                            </span>
                        </div>
                    </Card>
                return result;
            }else{//择标中
                let result =
                    <Card bordered={false} className="mb10" title={this.bjxqTitle()} extra={<Button type="primary" onClick={this.erxporData.bind(this,this.state.id)}>导出报价</Button>} >
                        <Table pagination={false} dataSource={this.state.quotations} columns={this.columns1} scroll={{ x: 1000 }}/>
                    </Card>
                return result;
            }
        }else{
            let result=
                <Card  bordered={false} className="mb10" title={this.bjxqTitle()} extra={<Button type="primary" onClick={this.erxporData.bind(this,this.state.id)}>导出报价</Button>}>
                    <Table pagination={false} dataSource={this.state.quotations} columns={this.columns1} scroll={{ x: 1000 }}/>
                </Card>
            return result;
        };
    }

    
    //比价方式的TIPS显示
    tipsStyle=(compareWay)=>{
        if(compareWay ==1){//非密封比价
            return "询价单截止前可随时查看报价详情（不建议使用）";
        }else if(compareWay==2){//密封比价
            return "询价单截止前不允许查看报价详情";
        }
    }

    //询价方式的TIPS显示
    inquiryObjectStyle=(inquiryObject)=>{
        if(inquiryObject ==1){//公开询价
            return "询价单在铁建商城中公开发布，任意符合报价条件的供应商均可报价";
        }else if(inquiryObject){//邀请询价
            return "邀请询价的询价单不公开展示询价信息，仅限邀请报价的供应商可参与报价";
        }
    }

    /**
     * 询价方式及隐私设置
     */
    ysStyle=()=>{
        let status = this.state.dataSource.status;
        let inquiryObject=this.state.dataSource.inquiryObject;
        let st= <Card title="询价方式及隐私设置" bordered={false} className="mb10">
            <Row>
                <Col span={12} className="ant-form-item-margin-bottom">
                    <BaseDetails title="询价联系人">
                        <p className="ant-form-text">{this.state.dataSource.contactMan}</p>
                    </BaseDetails>
                </Col>
                <Col span={12} className={less.rightCol}>
                    <BaseDetails title="比价方式">
                        <p className="ant-form-text">{this.state.dataSource.compareWayStr}<Tooltip className="padding_left8" title={this.tipsStyle(this.state.dataSource.compareWay)}><Icon style={{marginLeft:"9px"}} type="question-circle-o"/></Tooltip></p>
                    </BaseDetails>
                </Col>
                <Col span={12} className="ant-form-item-margin-bottom">
                    <BaseDetails title="联系人电话">
                        <p className="ant-form-text">{this.state.dataSource.tel}</p>
                    </BaseDetails>
                </Col>
                <Col span={12} className={less.rightCol}>
                    <BaseDetails title="自动匹配">
                        <p className="ant-form-text">{this.state.dataSource.sendTypeStr}</p>
                    </BaseDetails>
                </Col>
                <Col span={12} className="ant-form-item-margin-bottom">
                    <BaseDetails title="隐私设置">
                        <p className="ant-form-text">{this.state.dataSource.contactWayStr}</p>
                    </BaseDetails>
                </Col>
                <Col span={12} className={less.rightCol}>
                    <BaseDetails title="询价方式">
                        <p className="ant-form-text">{this.state.dataSource.inquiryObjectStr}<Tooltip className="padding_left8"  title={this.inquiryObjectStyle(this.state.dataSource.inquiryObject)}><Icon style={{marginLeft:"9px"}} type="question-circle-o"/></Tooltip></p>
                    </BaseDetails>
                </Col>
            </Row>
            {
                this.state.quotations !=undefined && inquiryObject =="2"?<Row style={{marginTop:"48px"}}>
                        <Col span={24} className="ant-form-item-margin-bottom">
                            <BaseDetails title="供应商信息">
                                 <span>
                            {
                                this.state.quotations.map((item,index)=>{
                                    if(index == 0){
                                        if (item.status == 0) {
                                            return <p>
                                                <span className={less.ellipips} title={item.sellerName}>{item.sellerName}</span>
                                                <span className="ant-form-text" style={{color: "rgba(250,173,20,1)"}}>未报价</span>
                                            </p>
                                        } else if (item.status == 1) {
                                            return <p>
                                                <span className={less.ellipips} title={item.sellerName}>{item.sellerName}</span>
                                                <span className="ant-form-text" style={{color: "rgba(61,185,0,0.85)"}}>报价有效</span>
                                            </p>
                                        }
                                    }else {
                                        if (item.status == 0) {
                                            return <p style={{marginTop:"8px"}}>
                                                <span className={less.ellipips} title={item.sellerName}>{item.sellerName}</span>
                                                <span className="ant-form-text" style={{color: "rgba(250,173,20,1)"}}>未报价</span>
                                            </p>
                                        } else if (item.status == 1) {
                                            return <p style={{marginTop:"8px"}}>
                                                <span className={less.ellipips} title={item.sellerName}>{item.sellerName}</span>
                                                <span className="ant-form-text" style={{color: "rgba(61,185,0,0.85)"}}>报价有效</span>
                                            </p>
                                        }
                                    }
                                })
                            }
                            </span>
                            </BaseDetails>
                        </Col></Row>
                    :<Row style={{marginTop:"48px"}}>
                        <Col span={24} className="ant-form-item-margin-bottom">
                        <BaseDetails title="已报价供应商">
                             <span>
                            {
                                this.state.quotations.map((item,index)=>{
                                    if(item.status == 1){
                                        let name="";
                                        if(item.sellerName.length>6){
                                            name = item.sellerName.substring(0,6) +"****";
                                        }else {
                                            name = item.sellerName
                                        }
                                        return  <span className="ant-form-text">{name}</span>
                                    }
                                })
                            }
                            </span>
                        </BaseDetails>
                    </Col>
                    </Row>
            }
        </Card>

        let result = null;
        if(status ==10 || status ==25){//已发布(询价中,择标中),重新择标(择标中)
            result =
                <Card title="询价方式及隐私设置" bordered={false} className="mb10">
                    <Row>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="询价联系人">
                                <p className="ant-form-text">{this.state.dataSource.contactMan}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="比价方式">
                                <p className="ant-form-text">{this.state.dataSource.compareWayStr}<Tooltip className="padding_left8" title={this.tipsStyle(this.state.dataSource.compareWay)}><Icon style={{marginLeft:"9px"}} type="question-circle-o"/></Tooltip></p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="联系人电话">
                                <p className="ant-form-text">{this.state.dataSource.tel}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="自动匹配">
                                <p className="ant-form-text">{this.state.dataSource.sendTypeStr}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="隐私设置">
                                <p className="ant-form-text">{this.state.dataSource.contactWayStr}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="询价方式">
                                <p className="ant-form-text">{this.state.dataSource.inquiryObjectStr}<Tooltip className="padding_left8"  title={this.inquiryObjectStyle(this.state.dataSource.inquiryObject)}><Icon style={{marginLeft:"9px"}} type="question-circle-o"/></Tooltip></p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    {this.state.dataSource.quotations?
                        inquiryObject =="2"?
                            <Row style={{marginTop:"48px"}}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="供应商信息">
                                        <span>
                                            {this.state.dataSource.quotations.map((item,index)=>{
                                                if (item.status == 1) {
                                                    return <p style={{marginBottom:"8px"}}>
                                                        <span className={less.ellipips} title={item.sellerName}>{item.sellerName}</span>
                                                        <span className="ant-form-text" style={{color: "rgba(61,185,0,0.85)"}}>报价有效</span>
                                                    </p>
                                                }else if (item.status == 2) {
                                                    return <p style={{marginBottom:"8px"}}>
                                                        <span className={less.ellipips} title={item.sellerName}>{item.sellerName}</span>
                                                        <span className="ant-form-text" style={{color: "rgba(250,173,20,1)"}}>报价作废</span>
                                                    </p>
                                                }else if (item.status == 4) {
                                                    return <p style={{marginBottom:"8px"}}>
                                                        <span className={less.ellipips} title={item.sellerName}>{item.sellerName}</span>
                                                        <span className="ant-form-text" style={{color: "rgba(61,185,0,0.85)"}}>未中标</span>
                                                    </p>
                                                }
                                            })}
                                        </span>
                                    </BaseDetails>
                                </Col>
                            </Row>
                            :
                            <Row style={{marginTop:"48px"}}>
                                <Col span={24} className="ant-form-item-margin-bottom">
                                    <BaseDetails title="已报价供应商">
                                        <span>
                                            {this.state.dataSource.quotations.map((item,index)=>{
                                                if(item.status == 1 || item.status == 2){
                                                    let name="";
                                                    if(item.sellerName.length>6){
                                                        name = item.sellerName.substring(0,6) +"****";
                                                    }else {
                                                        name = item.sellerName
                                                    }
                                                    return  <span className="ant-form-text">{name}</span>
                                                }
                                            })}
                                        </span>
                                    </BaseDetails>
                                </Col>
                            </Row>
                    :null}
                </Card>
        }else{
            result =
                <Card title="询价方式及隐私设置"  bordered={false} className="mb10">
                    <Row>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="比价方式">
                                <p className="ant-form-text">{this.state.dataSource.compareWayStr}<Tooltip className="padding_left8" title={this.tipsStyle(this.state.dataSource.compareWay)}><Icon style={{marginLeft:"9px"}} type="question-circle-o"/></Tooltip></p>
                            </BaseDetails>
                        </Col>
                        {this.Reminding()}
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="隐私设置">
                                <p className="ant-form-text">{this.state.dataSource.contactWayStr}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="询价方式">
                                <p className="ant-form-text">{this.state.dataSource.inquiryObjectStr}<Tooltip className="padding_left8"  title={this.inquiryObjectStyle(this.state.dataSource.inquiryObject)}><Icon style={{marginLeft:"9px"}} type="question-circle-o"/></Tooltip></p>
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
        }
        return result;
    };

    handleCancel = () => {
        this.props.history.push('/platInvoice/inquiryManagement');
        //this.props.history.push('/inquiry/inquiryWithoutDetail');
    }

    render() {
        console.log('kkk',this.state.options3)
        return(
            <div>
                <Card bordered={false} className="mb10">
                    <Row style={{marginBottom: "18px"}}>
                        <Col span="24">
                            <h2 className={less.order_con_title}>
                                <img style={{marginLeft:"8px"}} src={this.headStyle()}></img>
                                <em className={less.em} title={this.state.dataSource.inquiryName}>{this.state.dataSource.inquiryName}</em>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <Row>
                                <Col span={24}>
                                    <BaseDetails title="采购单位">
                                        {this.state.dataSource.projectName}
                                    </BaseDetails>
                                </Col>
                                <Col span={24}>
                                    <BaseDetails title="采购部门">
                                        {this.state.dataSource.companyName}
                                    </BaseDetails>
                                </Col>
                            </Row>
                        </Col>
                        <Col span="12">
                            <Row>
                                <Col span="8" className={less.rightCol}>
                                    <p className={less.order_con_layer1_p}>询价单状态</p>
                                    <span className={less.order_con_layer1_span}>{this.state.dataSource.statusStr}</span>
                                </Col>
                                <Col span="12" style={{textAlign: "center"}}>
                                    <p className={less.order_con_layer2_p}>采购人</p>
                                    <p className={less.order_con_layer1_span}>{this.state.dataSource.purchasePerson}{(this.state.dataSource.purchasePersonPhone !="" && this.state.dataSource.purchasePersonPhone !=undefined) &&
                                    "("+this.state.dataSource.purchasePersonPhone +")"
                                    }</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginTop:"48px"}}>
                        <Col span={12}>
                            <BaseDetails title="应用领域">
                            {this.state.dataSource.majorName ? this.state.dataSource.majorName : '-'}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="询价单分类">
                                {this.state.dataSource.inquiryMaterialsType}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="截止日期">
                                {moment(this.state.dataSource.expectValidityTime).format("YYYY-MM-DD HH:mm")}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className="ant-form-item-margin-bottom">
                            <BaseDetails title="询价类型">
                                {this.state.dataSource.inquiryCategoryStr}
                            </BaseDetails>
                        </Col>
                        <Col span={12}  className={less.rightCol}>
                            <BaseDetails title="发布日期">
                                {this.state.dataSource.publishTimeStr}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10"
                      title="采购要求"
                >
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="付款方式">
                                {this.interestRate(this.state.dataSource.payWayStr,this.state.dataSource.interestRateDays)}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="采购类型">
                                {this.state.dataSource.purchaseTypeStr}
                            </BaseDetails>
                        </Col>
                    </Row>
                    {
                        this.state.dataSource.payWay == 2
                        &&
                        <Row><Col span={12}>
                            <BaseDetails title="贴息利率">
                                <span>{this.state.dataSource.interestRate}</span>
                            </BaseDetails>
                        </Col></Row>
                    }
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="协议有效期">
                                {this.state.dataSource.agreementStartDateYMDStr&&this.state.dataSource.agreementEndDateYMDStr
                                    ?
                                    this.state.dataSource.agreementStartDateYMDStr+"~"+this.state.dataSource.agreementEndDateYMDStr
                                    :
                                    "-"
                                }
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="预计付款时间">
                                {this.state.dataSource.advancePaymentDateYMDStr}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="期望到货日">
                                {this.state.dataSource.expectReceiptDateYMDStr}{this.state.dataSource.expectReceiptDateYMDStr !=null &&
                            "  前"
                            }
                            </BaseDetails>
                        </Col>
                        <Col span={12}  className={less.rightCol}>
                            <BaseDetails title="发票要求">
                                {this.state.dataSource.invoiceStr}
                            </BaseDetails>
                        </Col>
                        {
                            this.state.dataSource.purchaseType == 1 &&
                            <Col span={24}>
                                <BaseDetails title="发货要求">
                                    {this.state.dataSource.deliveryTypeStr}
                                </BaseDetails>
                            </Col>
                        }
                        
                            <Col span={12}>
                                <BaseDetails title="质保金收取">
                                {this.state.dataSource.warranty == null ? '-'
                                                : this.state.dataSource.warranty == 1 ? "收取" : "不收取"}
                                </BaseDetails>       
                            </Col>
                            <Col span={12} className={less.rightCol}>
                                <BaseDetails title="质保金比例">
                                        {
                                        this.state.dataSource.warrantyRatio == null ? '-'
                                        : '订单额 ' + this.state.dataSource.warrantyRatio + '%'
                                        }
                                </BaseDetails>
                            </Col>
                            <Col span={12}>
                                <BaseDetails title="质保金时长">
                                         {
                                            this.state.dataSource.warrantyDay == null ? '-'
                                            : '收货后 '+this.state.dataSource.warrantyDay+'天'
                                        }
                                </BaseDetails>
                            </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10"
                      title="收货地址"
                >
                    <Row>
                        <Col span={12} className={less.leftCol}>
                            <BaseDetails title="收货人">
                                {this.state.dataSource.contacterName}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="联系电话">
                                {this.state.dataSource.consigneeTel}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <BaseDetails title="收货地址">
                                {this.state.dataSource.address}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10"
                      title="供应商要求"
                >
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="注册资金">
                                {this.registeredCapitalShow(this.state.dataSource.registeredCapital)}
                            </BaseDetails>
                        </Col>
                        <Col span={12} className={less.rightCol}>
                            <BaseDetails title="报价要求">
                                {this.state.dataSource.quoteRequestsStr}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <BaseDetails title="证件要求">
                                {this.zjyqName(this.state.dataSource.documentClaimStr)}
                            </BaseDetails>
                        </Col>
                        <Col span={24}>
                            <BaseDetails title="经营地址">
                                {
                                    this.state.dataSource.areaRes !="" &&
                                    <p><SelectArea  type={"detail"} areaData={this.state.dataSource.areaRes}/></p>
                                }
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10" title="询价产品">
                    <Table pagination={false} dataSource={this.state.options3} columns={this.columns} scroll={{ x: 1000 }}/>
                    {
                        this.itemLength() &&
                        <div className={less.table_main_more}>
                            <span>查看全部{this.state.dataSource.itemList.length-1}款  商品</span>
                            <a style={{marginLeft: "10px"}} onClick={this.orderMore.bind()}>{this.state.dataSource.itemListStatus == undefined ? '展开' : '收起'}
                                <Icon type={this.state.dataSource.itemListStatus == undefined ? 'down' : 'up'}/>
                            </a>
                        </div>
                    }
                </Card>

                {this.statusStyle()}

                <Card bordered={false} className="mb10" title="订单详情">
                    <Table pagination={false} dataSource={this.state.orderList} columns={this.columns2} scroll={{ x: 1000 }}/>
                    {/* {
                        this.itemLength() &&
                        <div className={less.table_main_more}>
                            <span>查看全部{this.state.dataSource.itemList.length-1}款  商品</span>
                            <a style={{marginLeft: "10px"}} onClick={this.orderMore.bind()}>{this.state.dataSource.itemListStatus == undefined ? '展开' : '收起'}
                                <Icon type={this.state.dataSource.itemListStatus == undefined ? 'down' : 'up'}/>
                            </a>
                        </div>
                    } */}
                </Card>
                <InquiryApprovalLogList inquiryUuids = {this.props.match.params.uuids}/>
                <Card title="补充说明" bordered={false} className="mb10">
                    <Row>
                        <Col span={24} className="ant-form-item-margin-bottom">
                            <div dangerouslySetInnerHTML={{__html: this.state.dataSource.purchaseSupplement}}></div>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10" title="询价附件">
                    <Row>
                        <Col span={12}>
                            { this.state.dataSource.fileList !=undefined &&
                            this.state.dataSource.fileList.map((item,index)=>{
                                let url = item.fileUrl +"?filename=" + item.fileName;
                                return <p><img src={Fujian} /><a href= {SystemConfig.systemConfigPath.dfsPathUrl(url)} style={{marginLeft:"8px"}} target="_blank">{item.fileName}</a></p>
                            })
                            }
                        </Col>
                    </Row>
                </Card>
                {this.ysStyle()}
                <BackTop className="backtop"/>
                <BaseAffix>
                    <Button style={{marginRight: "10px"}} onClick={this.handleCancel}>关闭</Button>
                </BaseAffix>

            </div>
        )
    }
}
export default InquiryDetail;
