import { Card, Table, Button,Modal,Form } from 'antd'
import Util from '@/utils/util';
import api from '@/framework/axios'//请求接口的封装
import BaseForm from '@/components/baseForm'
import BaseTable from "@/components/baseTablePage";
import {exportFile} from "@/utils/urlUtils";
import {NumberFormat} from '@/components/content/Format'
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';

class OrderManagement extends React.Component {

    _isMounted = false
    state = {
        tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        visible:false,
        page:'',
        pageSize:''
    }

    formList = [
        {
            type: 'INPUT',
            field: 'orderNo',
            label: '订单号',
            placeholder: '请输入订单号'
        },
        {
            type: 'INPUT',
            field: 'demandNo',
            label: '来源单号',
            placeholder: '请输入来源单号'
        },
        {
            type: 'SELECT',
            field: 'source',
            label: '订单类型',
            placeholder: '请输入订单类型',
            list: [{ id: '1', value: '直接购买' }, { id: '2', value: '询价' }, { id: '3', value: '比价' }, { id: '4', value: '协议采购' }, { id: '5', value: '竞价' }]
        },

        {
            type: 'INPUT',
            field: 'purchaser',
            label: '采购商',
            placeholder: '请输入采购商'
        },
        {
            type: 'INPUT',
            field: 'sellerCompanyName',
            label: '供应商',
            placeholder: '请输入供应商'
        },
        {
            type: 'RANGE',
            field: 'payTime',
            label: '付款时间',
            placeholder: '请选择付款时间'
        },
        {
            type: 'RANGE',
            field: 'orderTime',
            label: '下单时间',
            placeholder: '请选择下单时间'
        },
        {
            type: 'CHECKBOX',
            field: 'orderStatus',
            label: '订单状态',
            placeholder: '请选择订单状态',
            span:20,
            options: [{ value: '-1023', label: '待确认' },
                { value: '-1214', label: '物流报价' },
                { value: '20', label: '审核中' },
                // { value: '25', label: '待付款' },
                { value: '28', label: '发货申请' },
                { value: '30', label: '未发货' },
                { value: '40', label: '待收货' },
                { value: '50', label: '质保中' },
                { value: '70', label: '已完成' },
                { value: '100', label: '失效' },
                // { value: '16', label: '未成交' }
                ]
        },
    ]
    columns = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 200,
        sorter: true,
    }, {
        title: '来源单号',
        dataIndex: 'demandNo',
        key: 'demandNo',
        width: 200,
        sorter: true,
    },{
        title: '订单类型',
        dataIndex: 'sourceStr',
        key: 'sourceStr',
        width: 150,
        sorter: true,
    }, {
        title: '采购商',
        dataIndex: 'buyerCompanyName',
        key: 'buyerCompanyName',
        width: 260,
        sorter: true,
        render: (text, record) => {
            if(text != null){
                if (text.length < 30) {
                    return <span>{text}</span>
                } else {
                    return <span>{text.substring(0, 30)}...</span>
                }
            }
        },
    }, {
        title: '供应商',
        dataIndex: 'sellerCompanyName',
        key: 'sellerCompanyName',
        width: 260,
        sorter: true,
        render: (text, record) => {
            if(text != null){
                if (text.length < 30) {
                    return <span>{text}</span>
                } else {
                    return <span>{text.substring(0, 30)}...</span>
                }
            }
        },
    }, {
        title: '下单时间',
        dataIndex: 'createTimeYMD',
        key: 'createTimeYMD',
        width: 170,
        sorter: true,
    }, {
        title: '订单状态',
        dataIndex: 'orderStatusStr',
        key: 'orderStatusStr',
        width: 100,
        sorter: true,
        render:(text, record)=>{
           if(record.orderStatus == 16){
               return <div>
                   <p>失效</p>
               </div>
           }else if(record.orderStatus == 28){
                return <div>
                <p>发货申请</p>
              </div>
           }else{
               return <p>{text?text:'--'}</p>
           }
         }
    },{
        title: '订单金额(元)',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width: 160,
        sorter: true,
        render:(text, record)=>{
           return <span><NumberFormat value={text} /></span>
        }
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
            <span>
        <a onClick={() => this.handleToDetails(record.uuids)}>查看</a>
        {/*<a style={{marginLeft:"8px"}} onClick={() => this.stopOrder(record.uuids)}>订单终止</a>*/}
      </span>

        ),
    }]

    importantFilter = ['orderNo', 'source'];

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
    baseParams = {
       
    };

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * 订单终止
     */
    stopOrder=()=>{
        alert("功能开发中");
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
        if(params.orderNo){
            data.orderNo = params.orderNo;
        }else {
            data.orderNo ="";
        }

        if (params.orderTime) {
            data.orderTimeStart = params.orderTime[0] ? moment(params.orderTime[0]).format('YYYY-MM-DD') : '';
            data.orderTimeEnd = params.orderTime[1] ? moment(params.orderTime[1]).format('YYYY-MM-DD') : '';
        }else {
            data.orderTimeStart ="";
            data.orderTimeEnd ="";
        }

        if (params.payTime) {
            data.payTimeStart = params.payTime[0] ? moment(params.payTime[0]).format('YYYY-MM-DD') : '';
            data.payTimeEnd = params.payTime[1] ? moment(params.payTime[1]).format('YYYY-MM-DD') : '';
        }else {
            data.payTimeStart ="";
            data.payTimeEnd ="";
        }

        if(params.demandNo){
            data.demandNo = params.demandNo;
        }else {
            data.demandNo ="";
        }

        if(params.source){
            data.source = params.source;
        }else {
            data.source ="";
        }
        if(params.orderStatus){
            console.log(params.orderStatus)
            data.state = params.orderStatus.join("_");
        }else {
            data.state ="";
        }
        if(params.purchaser){
            data.purchaser = params.purchaser;
        }else {
            data.purchaser ="";
        }
        if(params.sellerCompanyName){
            data.sellerCompanyName = params.sellerCompanyName;
        }else {
            data.sellerCompanyName ="";
        }
        if(params.inquiryNumber){
            data.inquiryNumber = params.inquiryNumber;
        }else {
            data.inquiryNumber ="";
        }
        if(params.sn){
            data.sn = params.sn;
        }else {
            data.sn ="";
        }
        this.baseParams = {
            ...data
        }
        if(isSend){
            this.handelToLoadTable();
        }
    }

    //订单详情，跳转订单详情页
    handleToDetails = (uuids) => {
        let param = {}
        param.uuids = uuids
        param.goBackUrl = '/platInvoice/orderManagement';
        this.props.history.push(getUrlByParam('/platInvoice/orderDetailNew', param));
    }

    //订单管理 - 导出
    orderExport=()=>{
        console.log('kkl8',this.baseParams)
        let params = {}
        let data=this.baseParams;
        if(data.orderNo){
            params.orderNo = data.orderNo;
        }else {
            params.orderNo ="";
        }

        if (data.orderTime) {
            params.orderTimeStart = data.orderTime[0] ? moment(data.orderTime[0]).format('YYYY-MM-DD') : '';
            params.orderTimeEnd = data.orderTime[1] ? moment(data.orderTime[1]).format('YYYY-MM-DD') : '';
        }else {
            params.orderTimeStart ="";
            params.orderTimeEnd ="";
        }

        if (data.payTime) {
            params.payTimeStart = data.payTime[0] ? moment(data.payTime[0]).format('YYYY-MM-DD') : '';
            params.payTimeEnd = data.payTime[1] ? moment(data.payTime[1]).format('YYYY-MM-DD') : '';
        }else {
            params.payTimeStart ="";
            params.payTimeEnd ="";
        }

        if(data.demandNo){
            params.demandNo = data.demandNo;
        }else {
            params.demandNo ="";
        }

        if(data.source){
            params.source = data.source;
        }else {
            params.source ="";
        }
        if(data.orderStatus){
            console.log(data.orderStatus)
            params.state = data.orderStatus.join("_");
        }else {
            params.state ="";
        }
        if(data.purchaser){
            params.purchaser = data.purchaser;
        }else {
            params.purchaser ="";
        }
        if(data.sellerCompanyName){
            params.sellName = data.sellerCompanyName;
        }else {
            params.sellName ="";
        }
        if(data.inquiryNumber){
            params.inquiryNumber = data.inquiryNumber;
        }else {
            params.inquiryNumber ="";
        }
        if(data.sn){
            params.sn = data.sn;
        }else {
            params.sn ="";
        }
        
        params.page = this.state.page ? this.state.page : 1;
        params.pageSize = this.state.pageSize ? this.state.pageSize : 10
        exportFile("/order/orderManagementController/ptExportData",params)
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
                <div style={{marginTop:"25px",marginBottom:"30px",textAlign: "right"}}>
                    {/*<Button type="ghost" onClick={this.openModal}>配置</Button>*/}
                    <Button type="primary" onClick={this.orderExport} style={{marginLeft:"8px"}}>导出</Button>
                </div>
                <div>
                    <BaseTable
                        url="@/platform/order/detail/getPtData"
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        paginationPage={this.paginationPage}
                        paginationRows={this.paginationRows}
                        columns={this.columns}
                        scroll={{ x: 1300 }}
                    />
                </div>
                <NewModal visible={this.state.visible} visibleCancle={this.visibleCancle} visibleOk={this.visibleOk}/>
            </Card>
        )
    }
}
export default OrderManagement

class OrderModal extends React.Component {
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
let NewModal = Form.create()(OrderModal);