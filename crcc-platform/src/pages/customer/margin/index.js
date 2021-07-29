import React from 'react';
import Qs from 'qs'
import api from '@/framework/axios';
import Util from '@/utils/util'
import {Card, Modal, Button, Icon, message, Col, Row,Tabs,Popconfirm} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
// import SaleBondManage from '../saleBondManage';
import { baseService } from '@/utils/common';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
//竞价状态
const _BID = baseService.cusetomerMargin;
const _MAINBIDOBJ = baseService._saleMainBid_obj;
const statusStyle = baseService.statusStyle
//竞价方式
const _BIDTYPE = baseService.bidType;
const _PRICINGMETHOD = baseService.pricingMethod;
const _icons = {
    save: {
        type: 'question-circle',
        style: {
            color: '#fa0',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
            verticalAlign: '-2px'
        }
    },
    del: {
        type: 'cross-circle',
        style: {
            color: '#F5222D',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
            verticalAlign: '-2px'
        }
    },
}
export default class Margin extends React.Component {
    constructor(props){
        super(props)
        this.state={
            defaultKey: sessionStorage.SaleSceneStatus || "1",
            type: {},
            item_cc: {},
            title_cc: '',
            tip_cc: '',
            visible_cc: false,
            detailVisible: false,//保证金管理
            detailUuids: null,
            job_number:'',
            formList: [],
            selectData:[{
                id:"001",
                value:'用户1'
            }],
            //处理状态：0.待受理，1.待处理（处理中），2.已完成
            // 全部
            baseParams1:{
            },
            // 待受理
            baseParams2:{
                dealStatus:'0'
            },
            // 处理中
            baseParams3:{
                dealStatus:'1'
            },
            // 已完成
            baseParams4:{
                dealStatus:'2'
            },
            activeTab:1,
            tableState1: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
            tableState2: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
            tableState3: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
            tableState4: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
       }
    }
    componentWillMount(){
        this.setState({
            formList: [
                {
                    type: 'INPUT',
                    field: 'workOrderNo',
                    label: '工单号：',
                    placeholder: '请输入工单号'
                },
                {
                    type: 'INPUT',
                    field: 'saleCompanyName',
                    label: '招标方名称：',
                    placeholder: '请输入招标方名称'
                },
                {
                    type: 'INPUT',
                    field: 'buyerCompanyName',
                    label: '投标方名称：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'INPUT',
                    field: 'contactWay',
                    label: '用户联系人：',
                    placeholder: '请输入投标方名称'
                },
                {
                    type: 'RANGE',
                    field: 'acceptTime',
                    label: '受理时间：'
                },
                {
                    type: 'RANGE',
                    field: 'dealTime',
                    label: '处理时间：'
                },
                {
                    type: 'RANGE',
                    field: 'createTime',
                    label: '创建时间：'
                },{
                    type: 'SELECT',
                    field: 'saleCompanyType',
                    label: '处置方类型：',
                    placeholder: '请选择',
                    list: [{ id: 1, value: '内部单位' },{ id: 2, value: '外部单位' }]
                }
            ]
        })
    }
    componentWillUnmount() {
        sessionStorage.SaleSceneStatus = ''
    }

    baseParams = {
        tabStatus: sessionStorage.SaleSceneStatus || null
    }
    importantFilter = ['organizationName', 'nameOrCode'];

    // 列表
    columns = [
        {
            title: '工单号',
            dataIndex: 'workOrderNo',
            key: 'workOrderNo',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '业务类型',
            dataIndex: 'isEntrust',
            key: 'isEntrust',
            sorter: true,
            width: 150,
        },{
            title: '处置方类型',
            dataIndex: 'saleCompanyType',
            key: 'saleCompanyType',
            sorter: true,
            width: 150,
            render: (text, record) =>{
                let showStr = "";
                //处置方类型(1:内部单位 2：外部单位)
                if (record.saleCompanyType == 1) {
                    showStr = "内部单位";
                } else if (record.saleCompanyType == 2){
                    showStr = "外部单位";
                } 
                return <span title={showStr}>{showStr}</span>
            }
        }
        ,{
            title: '状态',
            dataIndex: 'dealStatus',
            key: 'dealStatus',
            sorter: true,
            width: 150,
            render: (text, record) =>{
                let showStr = "";
                //处理状态：(0.待受理，1.待处理（处理中），2.已完成)
                if (record.dealStatus == 0) {
                    showStr = "待受理";
                } else if (record.dealStatus == 1){
                    showStr = "待处理";
                } else if (record.dealStatus == 2) {
                    showStr = "已完成";
                }
                return <span title={showStr}>{showStr}</span>
            }
        },{
            title: '处置方企业名称',
            dataIndex: 'saleCompanyName',
            key: 'saleCompanyName',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '处置方项目部',
            dataIndex: 'saleDeptId',
            key: 'saleDeptId',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '处置方联系人',
            dataIndex: 'saleCompanyContactUserName',
            key: 'saleCompanyContactUserName',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '买受企业名称',
            dataIndex: 'buyerCompanyName',
            key: 'buyerCompanyName',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '买受方联系人',
            dataIndex: 'buyerCompanyContactUserName',
            key: 'buyerCompanyContactUserName',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '保证金金额',
            dataIndex: 'amt',
            key: 'amt',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '申请罚没金额',
            dataIndex: 'occupyAmt',
            key: 'occupyAmt',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '实际罚没金额',
            dataIndex: 'actualAmt',
            key: 'actualAmt',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '受理时间',
            dataIndex: 'acceptTime',
            key: 'acceptTime',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '受理人',
            dataIndex: 'acceptUserName',
            key: 'acceptUserName',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '处理结果',
            dataIndex: 'dealResult',
            key: 'dealResult',
            sorter: true,
            width: 150,
            render: (text, record) =>{
                let showStr = "";
                //处理结果;(1.强制退还，2.沉没保证金，3.协商一致)
                if (record.dealResult == 1) {
                    showStr = "强制退还";
                } else if (record.dealResult == 2){
                    showStr = "沉没保证金";
                } else if (record.dealResult == 3) {
                    showStr = "协商一致";
                }
                return <span title={showStr}>{showStr}</span>
            }
        },{
            title: '处理时间',
            dataIndex: 'dealTime',
            key: 'dealTime',
            sorter: true,
            width: 150,
            render: (text, record, index) => {
                return <span title={text}>{text}</span>
            }
        },{
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 100,
            fixed: 'right',
            render: (text, record) => {
                if (record.dealStatus == "0" || record.dealStatus == 0 ) {
                  return (
                    <span>
                        <div><a onClick={ this.handleToDetail.bind(this,record) }>查看详情</a></div>
                        <div><a onClick={ this.handleAccept.bind(this,record.uuids) }>受理</a></div>
                    </span>
                  )
                }else if (record.dealStatus == "1" || record.dealStatus == 1 ){
                  return (
                    <span>
                        <div><a onClick={ this.handleToDetail.bind(this,record) }>查看详情</a></div>
                        <div><a onClick={ this.handleRelease.bind(this,record.uuids) }>释放</a></div>
                    </span>
                  )
                }else if (record.dealStatus == "2" || record.dealStatus == 2 ){
                    return (
                      <span>
                          <div><a onClick={ this.handleToDetail.bind(this,record) }>查看详情</a></div>
                      </span>
                    )
                  }
              }
        }
    ]

    //查看详情
    handleToDetail = (record) => {
        let url = "/customer/del/";
        this.props.history.push(url + record.uuids)

    }
    // 受理
    handleAccept = (id) => {
        if (!id) {
            Util.alert('请选择要受理的工单', { type: 'warning' });
            return false;
        }
        let _this = this;
        confirm({
            title: "确认受理本工单？",
            onOk() {
              let uuids = '';
              if (id) {
                uuids = id;
              } 
              api.ajax("get", "@/platform/reuse/bondWorkOrder/acceptWorkOrder", {
                uuids: uuids
              }).then(r => {
                if(r.data == 1){
                    Util.alert("受理成功", { type: 'success' });
                    location.reload();
                }else{
                    Util.alert(r.msg, { type: 'error' }); 
                }
                 _this.handleFilter();
              }).catch(r => {
              })
            }
          })
    }
    //释放
    handleRelease = (id) => {
        if (!id) {
            Util.alert('请选择要释放的工单', { type: 'warning' });
            return false;
        }
        let _this = this;
        confirm({
            title: "确认释放本工单？释放后可再次受理，但原始记录将依然被保留",
            onOk() {
              let uuids = '';
              if (id) {
                uuids = id;
              } 
              api.ajax("get", "@/platform/reuse/bondWorkOrder/releaseWorkOrder", {
                uuids: uuids
              }).then(r => {
                if(r.data == 1){
                  Util.alert("释放成功", { type: 'success' });
                  location.reload();
                }else{
                  Util.alert(r.msg, { type: 'error' }); 
                }
                _this.handleFilter();
              }).catch(r => {
              })
            }
          })
    }
    getAuthButton(arr, status, type = 1) {
        if (type == 1) {
            return arr.join(",").indexOf(status) != -1
        }
        if (type == 2) {
            return (status > arr[0]) && (status < arr[1])
        }
    }
    handleFilter = (params, isSend = true) => {
        let acceptStartTime, acceptEndTime, dealStartTime,dealEndTime,createStartTime,createEndTime;

        if (params.acceptTime) {
            acceptStartTime = params.acceptTime[0] ? moment(params.acceptTime[0]).format('YYYY-MM-DD') : '';
            acceptEndTime = params.acceptTime[1] ? moment(params.acceptTime[1]).format('YYYY-MM-DD') : '';
        }
        if (params.dealTime) {
            dealStartTime = params.dealTime[0] ? moment(params.dealTime[0]).format('YYYY-MM-DD') : '';
            dealEndTime = params.dealTime[1] ? moment(params.dealTime[1]).format('YYYY-MM-DD') : '';
        }

        if (params.createTime) {
            createStartTime = params.createTime[0] ? moment(params.createTime[0]).format('YYYY-MM-DD') : '';
            createEndTime = params.createTime[1] ? moment(params.createTime[1]).format('YYYY-MM-DD') : '';
        }

        delete params["acceptTime"];
        delete params["dealTime"];
        delete params["createTime"];

        let key = this.state.activeTab;

        key = 1;
        this.state['baseParams' + key] = {
            ...this.state['baseParams' + key],
            ...params,
            acceptStartTime,
            acceptEndTime,
            dealStartTime,
            dealEndTime,
            createStartTime,
            createEndTime
        }

        key = 2;
        this.state['baseParams' + key] = {
            ...this.state['baseParams' + key],
            ...params,
            acceptStartTime,
            acceptEndTime,
            dealStartTime,
            dealEndTime,
            createStartTime,
            createEndTime
        }

        key = 3;
        this.state['baseParams' + key] = {
            ...this.state['baseParams' + key],
            ...params,
            acceptStartTime,
            acceptEndTime,
            dealStartTime,
            dealEndTime,
            createStartTime,
            createEndTime
        }
        key = 4;
        this.state['baseParams' + key] = {
            ...this.state['baseParams' + key],
            ...params,
            acceptStartTime,
            acceptEndTime,
            dealStartTime,
            dealEndTime,
            createStartTime,
            createEndTime
        }
        this.state.baseParams = {
            ...this.state.baseParams,
            ...params,
        }
        if (isSend) {
            this.reloadTableData();
        }
    }
    
    reloadTableData(state = 1) {
        
        let key = this.state.activeTab;
        console.log(key)
        this.handelToLoadTable(state, 'tableState' + key);
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
//导出
exportList = () => {
    let fieldsValue = this.refs.BaseForm.getFieldsValue()
    this.handleFilter({ ...fieldsValue, is_export: '' })
    let param = Util.deleteEmptyKey({ ...this.baseParams })
    if (Object.keys(param).length) {
        window.open(configs.exportUrl + '/reuse/saleScene/exportData?' + Qs.stringify(param))
    } else {
        window.open(configs.exportUrl + '/reuse/saleScene/exportData')
    }
}
//tab切换tableData
handleChangeTab = (key) => {
    this.setState({
        activeTab: key
    });
    this.reloadTableData();
}
    render() {

        return (
            <div>
                <Card className="mb10" bordered={false}>
                    <Row claName="reuse_row" >
                        <Col span={6} style={{marginBottom:"10px",textAlign:"center"}}>
                            <span style={{color:"#FA9B13",fontSize:"14px"}}>待审核</span>
                            <p style={{color:"#FA9B13",fontSize:"24px"}}>0家</p>
                        </Col>
                        <Col span={6} style={{marginBottom:"10px",textAlign:"center"}}>
                            <span style={{color:"#000000",fontSize:"14px"}}>本周完成</span>
                            <p style={{color:"#000000",fontSize:"24px"}}>0家</p>
                        </Col>
                        <Col span={6} style={{marginBottom:"10px",textAlign:"center"}}>
                            <span style={{color:"#000000",fontSize:"14px"}}>本月完成</span>
                            <p style={{color:"#000000",fontSize:"24px"}}>0家</p>
                        </Col>
                        <Col span={6} style={{marginBottom:"10px",textAlign:"center"}}>
                            <span style={{color:"#000000",fontSize:"14px"}}>累计处理</span>
                            <p style={{color:"#000000",fontSize:"24px"}}>0家</p>
                        </Col>
                    </Row>
                </Card>
                <BaseForm ref='BaseForm' formList={this.state.formList} importantFilter={this.importantFilter}
                    filterSubmit={this.handleFilter} />
                     <Card className="mt10" bordered={false}>
                        <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
                            <TabPane tab="全部" key="1">
                                <BaseTable
                                    url="@/platform/reuse/bondWorkOrder/queryWorkOrderPage"
                                    tableState={this.state.tableState1}
                                    resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                                    baseParams={this.state.baseParams1}
                                    columns={this.columns}
                                    scroll={{ x: 2000 }}
                                />
                            </TabPane>
                            <TabPane tab="待受理" key="2">
                                <BaseTable
                                    url="@/platform/reuse/bondWorkOrder/queryWorkOrderPage"
                                    tableState={this.state.tableState2}
                                    resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                                    baseParams={this.state.baseParams2}
                                    columns={this.columns}
                                    scroll={{ x: 2000 }}
                                />
                            </TabPane>
                            <TabPane tab="处理中" key="3">
                                <BaseTable
                                    url="@/platform/reuse/bondWorkOrder/queryWorkOrderPage"
                                    tableState={this.state.tableState3}
                                    resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                                    baseParams={this.state.baseParams3}
                                    columns={this.columns}
                                    scroll={{ x: 2000 }}
                                />
                            </TabPane>
                            <TabPane tab="已完成" key="4">
                                <BaseTable
                                    url="@/platform/reuse/bondWorkOrder/queryWorkOrderPage"
                                    tableState={this.state.tableState4}
                                    resetTable={(state) => { this.resetTable(state, 'tableState4') }}
                                    baseParams={this.state.baseParams4}
                                    columns={this.columns}
                                    scroll={{ x: 2000 }}
                                />
                            </TabPane>
                        </Tabs>
                     </Card>
            </div>
        )
    }
}