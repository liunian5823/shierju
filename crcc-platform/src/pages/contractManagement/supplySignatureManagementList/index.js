import { Card,Tabs,Popconfirm,message} from 'antd'

import api from '@/framework/axios'//请求接口的封装
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import less from './index.less'
import { connect } from 'react-redux'
import './messagestyle.css';
import {exportFile, getUrlByParam} from '@/utils/urlUtils';

const TabPane = Tabs.TabPane

class supplySignatureManagementList extends React.Component {

    state = {
        loading: false,
        tableState1: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState2: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState3: 0,//tableState3//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState4: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState5: 0,//tableState5//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState6: 0,//tableState6//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    }
    activeTab = 1
    //控制展示的字段
    importantFilter = ['contractName', 'companyName']//name
    //公司名称,查看
    findDetails = (record,isDetails)=>{
        let url =isDetails? '/supplier/recommendedSupplier?sellerUuids='+ record.companyUuids:record.contractUrl;
        let param = {};
        window.open(SystemConfig.systemConfigPath.jumpPage(getUrlByParam(url, param)))
    }

    // 搜索所有条件
    formList = [{
        type: 'INPUT',
        field: 'contractName',
        label: '合同名称',
        placeholder: '请输入',
    }, {
        type: 'INPUT',
        field: 'companyName',
        label: '公司名称',
        placeholder: '请输入'
    }, {
        type: 'INPUT',
        field: 'contractCode',
        label: '合同编号',
        placeholder: '请输入'
    }, {
        type: 'DATEPICKER',
        field: 'createTime',
        label: '合同生成时间',
        placeholder: '请选择'
    }, {
        type: 'DATEPICKER',
        field: 'effectiveTime',
        label: '生效时间',
        placeholder: '请选择'
    }, {
        type: 'INPUT',
        field: 'supplierSigner',
        label: '签章人',
        placeholder: '请输入'
    }, {
        type: 'INPUT',
        field: 'platformSigner',
        label: '平台签章人',
        placeholder: '请输入'
    }];

    handleFilter = (p, isSend = true) => {
        let createTime = p.createTime?moment(p.createTime).format("YYYY-MM-DD"):undefined;
        let effectiveTime = p.effectiveTime?moment(p.effectiveTime).format('YYYY-MM-DD'):undefined;
        let key = this.activeTab;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
            createTime,
            effectiveTime
        };
        if(isSend){
            this.reloadTableData();
        }
    };
    componentWillMount(){
        this._isMounted = true;
    };
    componentWillUnmount(){
        this._isMounted = false;
    };
    //全部
    baseParams0 =
        {

        };
    //待签章
    baseParams1 = {
        contractState: 1
    };
    //供应商未签章
    baseParams2 = {
        contractState: 0
    };
    //已生效
    baseParams3 = {
        contractState: 3
    };
    //待生效
    baseParams4 = {
        contractState: 2
    };
    //失效作废
    baseParams5 = {
        contractState: 4,
        contractState: 5
    };

    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    };

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    };

    reloadTableData =(state = 1)=> {
        let key = this.activeTab;
        this.handelToLoadTable(state, 'tableState' + key);
    }

    handleChangeTab = (key) => {
        this.activeTab = key;
        this.reloadTableData();
    };

    columns1 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 200,
        render:(text,record)=> {
            return <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 220,
        render:(text,record)=> {
            return <span style={{width: "200px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 220,
        render:(text,record)=>{
            return<a style={{width: "200px"}} className={less.plat_table_text} href="javascript:void(0);"
                     onClick={this.findDetails.bind(this,record,true)}>{text}</a>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        render: (text) => {
            return <p style={{width:"100px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        render: (text) => {
            return <p style={{width:"120px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 150,

    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 110,
    }, {
        title: '操作',
        key: 'optionfs',
        fixed: 'right',
        width:200,
        render: (text, record) =>  {
            return <p style={{width:"180px"}}>{this.html(record)}</p>
        }
    }]
    columns2 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 200,
        render:(text,record)=> {
            return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 200,
        render:(text,record)=> {
            return <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
        render:(text,record)=>{
            return<a style={{width: "180px"}} className={less.plat_table_text} href="javascript:void(0);"
                     onClick={this.findDetails.bind(this,record,true)}>{text}</a>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:100,
        render: (text) => {
            return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '操作',
        key: 'options',
        width:200,
        render: (text, record) =>  {
            return <p style={{width:"180px"}}>{this.html(record)}</p>
        }
    }]
    columns3 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 150,
        render:(text,record)=> {
            return  <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 150,
        render:(text,record)=> {
            return <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 150,
        render:(text,record)=>{
            return<a style={{width: "134px"}} className={less.plat_table_text} href="javascript:void(0);"
                     onClick={this.findDetails.bind(this,record,true)}>{text}</a>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:120,
        render: (text) => {
            return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:160,
        render: (text) => {
            return <p style={{width:"140px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 130,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:100,
        render: (text) => {
            return <p style={{width:"100px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '操作',
        key: 'optjiongs',
        fixed: 'right',
        width: 150,
        render: (text, record) =>  {
            return <p style={{width:"130px"}}>{this.html(record)}</p>
        }
    }]
    columns4 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 180,
        render:(text,record)=> {
            return <span style={{width: "160px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 180,
        render:(text,record)=> {
            return <span style={{width: "160px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 180,
        render:(text,record)=>{
            return<span style={{width: "160px"}} className={less.plat_table_text} title={text}>
                <a  href="javascript:void(0);"
                    onClick={this.findDetails.bind(this,record,true)}>{text}</a></span>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:150,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:150,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 150,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:150,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '作废原因',
        dataIndex: 'approvalReason',
        key: 'approvalReason',
        width: 150,
        render:(text,record)=> {
            return <p style={{width: "130px"}} className={less.plat_table_text}>{text}</p>
        }
    }, {
        title: '操作人',
        dataIndex: 'approveOfficerName',
        key: 'approveOfficerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'approvePhone',
        key: 'approvePhone',
        width: 130,
    }, {
        title: '操作',
        key: 'oaptiaons',
        fixed: 'right',
        width: 100,
        render: (text, record) =>  {
            return <p style={{width:"80px"}}>{this.html(record)}</p>
        }
    }]
    columns5 = [{
        title: '状态',
        dataIndex: 'contractStateStr',
        key: 'contractStateStr',
        sorter: true,
        width:100,
        render: (text,record)=>{
            let stylenum = ''
            if(record.contractState == 1){
                stylenum = 3
            }
            if(record.contractState == 0){
                stylenum = 3
            }
            if(record.contractState == 3){
                stylenum = 1
            }
            if (!(record.contractState == 2 || record.contractState == 4 || record.contractState == 5)) {
            } else {
                stylenum = 2
            }
            return( <p style={{width:"60px"}} className={'state'+ stylenum}>{text}</p>)
        }
    }, {
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width:150,
        render:(text,record)=> {
            return <span style={{width: "120px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width:150,
        render:(text,record)=> {
            return <span style={{width: "120px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width:150,
        render:(text,record)=>{
            return <span style={{width: "120px"}} className={less.plat_table_text} title={text}>
                <a onClick={this.findDetails.bind(this,record,true)}>{text}</a></span>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:130,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:130,
        render: (text,record) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):"-"}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 200,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 130,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:100,
        render: (text) => {
            return <p style={{width:"100px"}}>{text?moment(text).format("YYYY-MM-DD"):"-"}</p>
        }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '作废原因',
        dataIndex: 'approvalReason',
        key: 'approvalReason',
        width: 130,
    }, {
        title: '操作人',
        dataIndex: 'approveOfficerName',
        key: 'approveOfficerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'approvePhone',
        key: 'approvePhone',
        width: 130,
    }, {
        title: '操作',
        key: 'optiofghns',
        fixed: 'right',
        width:180,
        render: (text, record) =>  {
            return <p style={{width:"180px"}}>{this.html(record)}</p>
        }
    }]

    columns6 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 150,
        render:(text,record)=> {
            return  <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 150,
        render:(text,record)=> {
            return <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 150,
        render:(text,record)=>{
            return<a style={{width: "134px"}} className={less.plat_table_text} href="javascript:void(0);"
                     onClick={this.findDetails.bind(this,record,true)}>{text}</a>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:120,
        render: (text) => {
            return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:160,
        render: (text) => {
            return <p style={{width:"140px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 130,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:100,
        render: (text) => {
            return <p style={{width:"100px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '操作',
        key: 'optjiongs',
        fixed: 'right',
        width: 150,
        render: (text, record) =>  {
            return <p style={{width:"150px"}}>{this.html(record)}</p>
        }
    }]
    //各个列里的操作
    html = (record)=>{
        let arr = [];
        if(record.contractState==1){
            arr.push(<a onClick={this.jumpSignPage.bind(this,record.uuids)}>签章</a>)
        }
        if(record.contractState==0||record.contractState==1||record.contractState==2||
            record.contractState==3||record.contractState==4||record.contractState==5){
            arr.push(<a target="_blank"
                        onClick={()=>{
                            //window.open(SystemConfig.systemConfigPath.dfsPathUrl(record.contractUrl))
                            let params = {
                                filePath : record.contractUrl
                            }
                            exportFile("/common/upload/exportFastdfsFile",params);
                        }}
                >下载</a>
            )
        }
        if((record.contractState==0||record.contractState==3||record.contractState==2||record.contractState==1)&&record.contractId!=null){
            arr.push(<Popconfirm title="您确认要重新生成该条记录吗？" onConfirm={this.handleToRebuild.bind(this,record.contractId,record.companyId,record.uuids)}><a>重新生成</a></Popconfirm>)
        }

        let arr2 = [];
        for(let i = 0;i<arr.length;i++){
            arr2.push(arr[i]);
            if((i+1) != arr.length){
                arr2.push(<span className="ant-divider"/>)
            }
        }
        return arr2
    }

    handleToRebuild = (contractId,companyId,uuids) => {

        api.ajax('GET',"!!/common/contract/updateSupplyRebuild", {
                contractId,
                companyId,
                 uuids
        }).then(r => {
            this.reloadTableData();
        });
    }
    jumpSignPage=(uuids,record)=>{
        let that = this;
        //加实时状态校验
        api.ajax('GET',"!!/common/contract/getContractSignDetail",{
            uuids:uuids
        }).then(r =>{
            if(r.data) {
                if (r.data.contractState == 1) {
                    /*location.href = SystemConfig.systemConfigPath.axiosUrlGaoda("/common/contractSign/main?k=" + window.btoa(uuids)+"&p="+window.btoa(that.props.userInfo.id)+"&t=2");*/
                    window.open(SystemConfig.systemConfigPath.axiosUrlGaoda("/common/contractSign/main?k=" + window.btoa(uuids)+"&p="+window.btoa(that.props.userInfo.id))+"&t=2");
                   // let childWindow = window.open(SystemConfig.systemConfigPath.axiosUrlGaoda("/common/contractSign/main?k=" + window.btoa(uuids)+"&p="+window.btoa(that.props.userInfo.id)));
                  /*  childWindow.onbeforeunload =()=>{
                        this.reloadTableData();
                    }*/
                }
                else if (r.data.contractState == 2 || r.data.contractState == 3) {
                    message.error("平台已签章,请勿重复操作");
                }
            }
        });
    }


    render() {
        return (
            <Card bordered={false}>
                <BaseForm  formList={this.formList}  importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                <Tabs className={less.tabs} onTabClick={this.handleChangeTab} defaultActiveKey="1">
                    <TabPane tab="全部" key="0" >
                        <div className={less.tabplane}>
                            <BaseTable
                                notInit={true}
                                url="!!/common/contract/findSupplyContractListForPage"
                                tableState={1}
                                resetTable={(state) => { this.resetTable(state, 'tableState6') }}
                                baseParams={this.baseParams0}
                                columns={this.columns5}
                                indexkeyWidth={120}
                                scroll={{ x: 2200}}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="待签章" key="1" className={less.tabplane}>
                        <div className={less.tabplane}>
                            <BaseTable
                                url="!!/common/contract/findSupplyContractListForPage"
                                tableState={this.state.tableState1}
                                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                                baseParams={this.baseParams1}
                                columns={this.columns1}
                                indexkeyWidth={70}
                                scroll={{ x: 1500 }}

                            />
                        </div>
                    </TabPane>
                    <TabPane tab="供应商未签章" key="2" >
                        <div className={less.tabplane}>
                            <BaseTable
                                notInit={true}
                                url="!!/common/contract/findSupplyContractListForPage"
                                tableState={this.state.tableState2}
                                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                                baseParams={this.baseParams2}
                                columns={this.columns2}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="已生效" key="3" >
                        <div className={less.tabplane}>
                            <BaseTable
                                notInit={true}
                                url="!!/common/contract/findSupplyContractListForPage"
                                tableState={this.state.tableState3}
                                resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                                baseParams={this.baseParams3}
                                columns={this.columns3}
                                indexkeyWidth={130}
                                scroll={{ x: 1600 }}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="待生效" key="4" >
                        <div className={less.tabplane}>
                            <BaseTable
                                notInit={true}
                                url="!!/common/contract/findSupplyContractListForPage"
                                tableState={this.state.tableState4}
                                resetTable={(state) => { this.resetTable(state, 'tableState4') }}
                                baseParams={this.baseParams4}
                                columns={this.columns6}
                                indexkeyWidth={130}
                                scroll={{ x: 1600 }}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="作废/失效" key="5" >
                        <div className={less.tabplane}>
                            <BaseTable
                                notInit={true}
                                url="!!/common/contract/findSupplyContractListForPage"
                                tableState={this.state.tableState5}
                                resetTable={(state) => { this.resetTable(state, 'tableState5') }}
                                baseParams={this.baseParams5}
                                columns={this.columns4}
                                indexkeyWidth={130}
                                scroll={{ x: 2100 }}
                            />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    }
}
export default connect(mapStateToProps)(supplySignatureManagementList)