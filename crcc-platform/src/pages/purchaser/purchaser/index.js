import { Card, Button, Table, Switch, message, Popconfirm } from 'antd';
import api from '@/framework/axios';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {exportFile} from '@/utils/urlUtils';
import less from './index.less';
import AuthButton from '@/components/authButton'

class purchaser extends React.Component{
    state = {
        loading: false,
        tableState: 0,
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }

    /**
     * 搜索框三参数
     * @type {[*]}
     */
    //展示的字段
    importantFilter = ['source', 'createTimeArr']//name

    //搜索框全字段
    formList = [
        {
            type: 'SELECT',
            field: 'source',
            label: '来源',
            placeholder: '来源',
            list: [
                {
                    id: '1',
                    value: '内部企业'
                },
                {
                    id: '0',
                    value: '外部企业'
                }
            ]
        },
        {
            type: 'RANGE',
            field: 'createTimeArr',
            label: '入驻时间',
            placeHolder: '请筛选时间段'
        },
        {
            type: 'INPUT',
            field: 'name',
            label: '公司名称',
            placeholder: '公司名称',
        },
        {
            type: 'INPUT',
            field: 'phone',
            label: '手机号',
            placeholder: '手机号',
        },
        {
            type: 'INPUT',
            field: 'orgName',
            label: '项目名称',
            placeholder: '项目名称',
        }
    ]

    //表单提交按钮
    handleFilter = (p, isSend = true) => {
        let createTimeStart, createTimeEnd;
        if (p.createTimeArr) {
            createTimeStart = p.createTimeArr[0] ? moment(p.createTimeArr[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            createTimeEnd = p.createTimeArr[1] ? moment(p.createTimeArr[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            delete p.createTimeArr
        }
        this.baseParams = {
            ...this.baseParams,
            ...p,
            createTimeStart,
            createTimeEnd
        }
        if(isSend){
            this.reloadTableData();
        }
    }

    baseParams = {
    }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }

    columns = () => {
        return [
            {
                title: '来源',
                dataIndex: 'source',
                key: 'source',
                sorter: true,
                width: 150,
                render: (text, record)=>(
                    <p style={{width:"60px"}}>{text==1?"内部企业":text==0?"外部企业":"-"}</p>
                )
            },
            {
                title: '公司名称',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                width: 150
            },
            {
                title: '公司简称',
                dataIndex: 'shortName',
                key: 'shortName',
                sorter: true,
                width: 100
            },
            {
                title: '上级公司',
                dataIndex: 'parentName',
                key: 'parentName',
                sorter: true,
                width: 150
            },
            {
                title: '联系人',
                dataIndex: 'username',
                key: 'username',
                sorter: true,
                width: 150
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                sorter: true,
                width: 150
            },
            {
                title: '添加日期',
                dataIndex: 'createDate',
                key: 'createDate',
                sorter: true,
                width: 150,
                render: (text, record)=>(
                    <p style={{width:"130px"}}>{ text? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
                )
            },
            {
                title: '操作',
                dataIndex: 'xz',
                key: 'xz',
                width: 150,
                render: (text, record)=> {
                    let showTypeA = null;
                    let message =<p></p>;
                    if(record.platformSorceId == 0){
                        message = <p style={{width:"200px"}}>是否开通招投标平台?</p>
                        showTypeA = <Popconfirm title={message} onConfirm={this.openTendering.bind(this,record.uuids)}><a>开通招投标平台</a></Popconfirm>
                    }
                    return(
                        <span>
                             <p style={{width:"150px"}}>
                                <AuthButton elmType="a" onClick={()=>{this.showPurchaserDetail(record.uuids,record.id)}}>查看</AuthButton>
                                <span className="ant-divider"></span>
                                <AuthButton elmType="a" onClick={()=>{this.editPurchaser(record.uuids)}}>修改</AuthButton>
                                {showTypeA?<br/>:null}{showTypeA}
                             </p>
                            
                        </span>
                    )
                }
            }
        ]
    }
    //开通招标平台
    openTendering = (uuids) => {
        api.ajax("GET","@/platform/bidOpen/openBidding", {
            uuids:uuids
        }).then((r) => {
            // console.log(r,"是否走.then")
            //刷新列表
            this.handelToLoadTable();
            message.success("开通成功！");
        }).catch(e => {
            // console.log("openTendering  catch  -----------------")
            message.error(e.msg);
        })
    }
    handleExport = () => {
        let _this = this;
        api.ajax("GET",'@/supplier/ecCompanySupplier/export',{
            ..._this.params
        }).then(r=>{
            if(!_this._isMounted){
                return;
            }
        }).catch(r=>{})
    }

    configure  = ()=>{
        alert("配置功能未研发")
    }
    exportExcel = ()=>{
        exportFile("/purchaser/purchaser/exportExcle",this.baseParams);
    }
    addPurchaser  = ()=>{
        this.props.history.push('/purchaser/addPurchaser')
    }
    editPurchaser = (uuids)=>{
        if(uuids){
            this.props.history.push('/purchaser/editPurchaser/'+uuids);
        }else{
            message.error("uuids为false")
        }
    }
    showPurchaserDetail = (uuids,id)=>{
        if(uuids&&id){
            this.props.history.push('/purchaser/detailPurchaser/'+uuids+"/"+id);
        }else{
            message.error("uuids为false")
        }
    }

    render() {
        return(
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <div className="toolbar">
                        <Button type="ghost" onClick={this.configure} style={{display:"none"}}>配置</Button>
                        <Button type="ghost" onClick={this.exportExcel}>导出</Button>
                        <AuthButton type="primary" onClick={this.addPurchaser}>新增</AuthButton>
                    </div>
                    <BaseTable
                        url='!!/purchaser/purchaser/getListForPage'
                        tableState={this.state.tableState}
                        resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={this.baseParams}
                        columns={this.columns()}
                        scroll={{ x: 1000 }}
                    />
                </Card>
            </div>
        )
    }
}
export default purchaser;