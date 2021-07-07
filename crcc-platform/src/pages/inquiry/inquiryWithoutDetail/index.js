import { Card, Table, Button,Modal,Form,Popover,message, Popconfirm } from 'antd'
// import AuthButton from '@/components/authButton'
import Util from '@/utils/util';
import {exportFile} from '@/utils/urlUtils';
import api from '@/framework/axios'//请求接口的封装
import BaseForm from '@/components/baseForm'
import BaseTable from "@/components/baseTablePage";
import less from "./inquiry.less";


class inquiryManagementWithoutDetail extends React.Component {

    _isMounted = false
    state = {
        tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        visible:false,
        page:1,
        pageSize:10
    }

    formList = [
        {
            type: 'INPUT',
            field: 'inquiryName',
            label: '询价名称',
            placeholder: '请输入询价名称'
        },
        {
            type: 'INPUT',
            field: 'inquiryNumber',
            label: '询价单号',
            placeholder: '请输入询价单号'
        },
        {
            type: 'SELECT',
            field: 'inquiryWay',
            label: '询价方式',
            placeholder: '请选择询价方式',
            list: [{ id: '1', value: '公开询价' }, { id: '2', value: '邀请询价' }]
        },
        {
            type: 'INPUT',
            field: 'orderNo',
            label: '订 单 号 ',
            placeholder: '请输入订单号'
        },
        {
            type: 'SELECT',
            field: 'purchaseType',
            label: '采购类型',
            placeholder: '请选择采购类型',
            list: [{ id: '1', value: '单次采购' }, { id: '2', value: '协议采购' }]
        },
        {
            type: 'INPUT',
            field: 'purchaser',
            label: '采购商',
            placeholder: '请输入采购商'
        },
        {
            type: 'SELECT',
            field: 'status',
            label: '询价单状态',
            placeholder: '请选择询价单状态',
            list: [{ id: '1025', value: '已发布' }, { id: '2021', value: '下单中' } , { id: '30', value: '已结束' }]
        },
        {
            type: 'RANGE',
            field: 'publicTime',
            label: '发布时间',
            placeholder: '请选择发布时间'
        },
        {
            type: 'RANGE',
            field: 'endTime',
            label: '截止时间',
            placeholder: '请选择截止时间'
        },
    ]
    columns = [{
        title: '询价单号',
        dataIndex: 'inquiryNumber',
        key: 'inquiryNumber',
        width: 180,
        sorter: true,
        render: (text, record) => {
            text = text.replace(/<[^>]+>/g, "");
            return <span className={less.span_zh} title={text}>{text}</span>
        },
    }, {
        title: '询价名称',
        dataIndex: 'inquiryName',
        key: 'inquiryName',
        width: 220,
        sorter: true,
        render: (text, record) => {
            text = text.replace(/<[^>]+>/g, "");
                return <span className={less.span_zh} title={text}>{text}</span>
        },
    }, {
        title: '询价方式',
        dataIndex: 'inquiryObjectStr',
        key: 'inquiryObjectStr',
        width: 100,
        sorter: true,
        render: (text, record) => {
            text = text.replace(/<[^>]+>/g, "");
            return <span className={less.span_zh}title={text}>{text}</span>
        },
    }, {
        title: '采购商',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 220,
        sorter: true,
        render: (text, record) => {
            text = text.replace(/<[^>]+>/g, "");
            return <span className={less.span_zh}title={text}>{text}</span>
        },
    }, {
        title: '发布时间',
        dataIndex: 'publishTimeStr',
        key: 'publishTimeStr',
        width: 180,
        sorter: true,
    }, {
        title: '报价截止日期',
        dataIndex: 'expectValidityTimeStr',
        key: 'expectValidityTimeStr',
        width: 180,
        sorter: true,
    },{
        title: '报价数量',
        dataIndex: 'quotationCount',
        key: 'quotationCount',
        width: 150,
        sorter: true,
        render:(text,record) => {
            if(text > 0){
                /*let content = [];
                let companyName = record.quotationCompanyNames.split(",");
                let nameSet = new Set(companyName);
                nameSet.forEach((value, key) => {
                    let name = value;
                    if(name.length > 6){
                        name = name.substring(0,6) + "****";
                    }
                    content.push(<span style={{width:"110px",display:"block",float:"left",marginRight:"10px"}}>{name}</span>)
                })
                content = <div style={{width:"260px",overflow:"hidden"}}>{content}</div>
                return <Popover placement="top" title="已报价供应商" content={content} trigger="hover">
                    <a>{text}</a>
                </Popover>*/
                return <span>{text}</span>
            }else{
                return "暂无报价"
            }
        }
    }, {
        title: '状态',
        dataIndex: 'statusStr',
        key: 'statusStr',
        width: 100,
    }
    ,{
        title: '操作',
        key: 'optionss',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
            let showTypeA = null;
            let message =<p></p>;
            if(record.status==30&&record.showType==null){//未发布=>发布
                message = <p style={{width:"200px"}}>发布中标公告后，本询价单的中标结果将在本平台成交公告中公示，是否确认发布。</p>
                showTypeA = <Popconfirm title={message} onConfirm={this.showTypeFun.bind(this,record.uuids,record.showType)}><a>发布中标公告</a></Popconfirm>
            }else if(record.showType==1){//显示=>隐藏
                message = <p style={{width:"200px"}}>隐藏中标公告后，本询价单的中标结果将在本平台成交公告中隐藏，是否确认隐藏。</p>
                showTypeA = <Popconfirm title={message} onConfirm={this.showTypeFun.bind(this,record.uuids,record.showType)}><a>隐藏中标公告</a></Popconfirm>
            }else if(record.showType==2){//隐藏=>显示
                message = <p style={{width:"200px"}}>显示中标公告后，本询价单的中标结果将在本平台成交公告中公示，是否确认显示。</p>
                showTypeA = <Popconfirm title={message} onConfirm={this.showTypeFun.bind(this,record.uuids,record.showType)}><a>显示中标公告</a></Popconfirm>
            }
            return(
                <span>
                    {showTypeA?<br/>:null}{showTypeA}
                </span>
            )
        }
    }
    ]

    //中标公告开关
    showTypeFun = (uuids,showType)=>{
        if(showType==null){
            api.ajax("GET","!!/inquiry/notice/insertNoticeForPlatform", {
                uuids:uuids
            }).then((r) => {
                if(r.data){
                    //刷新列表
                    this.handelToLoadTable();
                    message.success("中标公告已发布");
                }
            });
        }else if(showType==1){
            api.ajax("GET","!!/inquiry/notice/updateNoticeShowTypeForPlatform", {
                uuids:uuids,
                showType:2
            }).then((r) => {
                if(r.data){
                    //刷新列表
                    this.handelToLoadTable();
                    message.success("中标公告已隐藏");
                }
            });
        }else if(showType==2){
            api.ajax("GET","!!/inquiry/notice/updateNoticeShowTypeForPlatform", {
                uuids:uuids,
                showType:1
            }).then((r) => {
                if(r.data){
                    //刷新列表
                    this.handelToLoadTable();
                    message.success("中标公告已显示");
                }
            });
        }

    }

    importantFilter = ['inquiryName', 'inquiryNumber'];

    /*****
     *
     * baseTable组件的相关方法
     *
     * 1.baseParams //表格参数，默认可以没有
     * 2.handelToLoadTable //
     * 3.resetTable //
     * 4.columns //表头数据
     *
     * *****/
    baseParams = {};

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * 打开配置模态框
     */
    openModal=()=>{
        this.setState({
            visible: true
        })
    }

    //配置 - 关闭模态框
    visibleCancle=(data)=> {
        this.setState({
            visible: false
        })
    }
    /**
     * 配置 - 保存
     * @param data
     */
    visibleOk=(data)=> {
        alert("功能开发中")
    }
    /**
     *  获取询价方式下拉
     */
    getInquiryWayList=()=>{
        let sendUrl =  '!!/inquiry/inquiryDetailController/getInquiryWayList';
            api.ajax('GET', sendUrl, {
            }).then(r => {
                this.reloadTableData(2);
            }).catch(r => {
                Util.alert(r.msg, { type: 'error' })
            })
    }
    /**
     * 搜索条件放入baseParams
     * @param params
     * @param isSend
     */
    handleFilter = (params, isSend = true) => {
        let data={};
        if (params.publicTime) {
            data.publishStartTime = params.publicTime[0] ? moment(params.publicTime[0]).format('YYYY-MM-DD') : '';
            data.publishEndTime = params.publicTime[1] ? moment(params.publicTime[1]).format('YYYY-MM-DD') : '';
        }else {
            data.publishStartTime ="";
            data.publishEndTime ="";
        }
        if (params.endTime) {
            data.expectValidityStartTime = params.endTime[0] ? moment(params.endTime[0]).format('YYYY-MM-DD') : '';
            data.expectValidityEndTime = params.endTime[1] ? moment(params.endTime[1]).format('YYYY-MM-DD') : '';
        }else {
            data.expectValidityStartTime ="";
            data.expectValidityEndTime ="";
        }
        if(params.inquiryName){
            data.inquiryName = params.inquiryName;
        }else {
            data.inquiryName ="";
        }
        if(params.inquiryNumber){
            data.inquiryNumber = params.inquiryNumber;
        }else {
            data.inquiryNumber ="";
        }
        if(params.inquiryWay){
            data.inquiryWay = params.inquiryWay;
        }else {
            data.inquiryWay ="";
        }
        if(params.purchaseType){
            data.purchaseType = params.purchaseType;
        }else {
            data.purchaseType ="";
        }

        if(params.orderNo){
            data.orderNo = params.orderNo;
        }else {
            data.orderNo ="";
        }

        if(params.purchaser){
            data.purchaser = params.purchaser;
        }else {
            data.purchaser ="";
        }
        if(params.status){
            data.status = params.status;
        }else {
            data.status ="";
        }
        this.baseParams = {
            ...data
        }
        if(isSend){
            this.handelToLoadTable();
        }
    }

    /**
     * 将state值改为1,刷新列表
     * @param state
     * @param tableState
     */
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }

    /**
     * 重置按钮,刷新列表
     * @param state
     * @param tableState
     */
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }

    //询价单管理 - 导出
    inquiryExport=()=>{
        let params = {}
        params.page = this.state.page ? this.state.page : 1;
        params.pageSize = this.state.pageSize ? this.state.pageSize : 10
        exportFile("/inquiry/inquiryDetailController/exportData",params)
    }
    paginationPage = (page,rows)=>{
        console.log('88k',page,rows)
        this.setState({
            page:page,
            pageSize:rows
        })
    }
    paginationRows=(page,rows)=>{
        console.log('66k',page,rows)
        this.setState({
            page:page,
            pageSize:rows
        })
    }
    render() {
        const operations = null

        const formList = this.formList;
        return (
            <Card bordered={false}>
                <BaseForm formList={formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                <div style={{marginTop:"12px",marginBottom:"30px",textAlign: "right"}}>
                    {/*<Button type="ghost" onClick={this.openModal}>配置</Button>*/}
                    <Button type="primary" onClick={this.inquiryExport} style={{marginLeft:"8px"}}>导出</Button>
                </div>
                <div>
                    <BaseTable
                        url="@/platform/inquiry/detail/page"
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        paginationPage={this.paginationPage}
                        paginationRows={this.paginationRows}
                        columns={this.columns}
                        scroll={{ x: 1600 }}/>
                </div>
                <NewModal visible={this.state.visible} visibleCancle={this.visibleCancle} visibleOk={this.visibleOk}/>
            </Card>
        )
    }
}
export default inquiryManagementWithoutDetail

class InquiryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        const {getFieldProps} = this.props.form;
        return (
            <Modal title="驳回原因" visible={this.props.visible}
                   onOk={this.props.visibleOk.bind(this,this.props.form)} onCancel={this.props.visibleCancle}
            >
                <Form >
                    <Form.Item>
                        <p>功能开发中</p>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
let NewModal = Form.create()(InquiryModal);