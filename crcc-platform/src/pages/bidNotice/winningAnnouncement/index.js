import {Card, Button, Table, Switch, message, Popconfirm, Modal} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {exportFile} from '@/utils/urlUtils';
import {systemConfigPath} from "@/utils/config/systemConfig";
import moment from 'moment';
import React from "react";
import ModalForm from "./noticeModalForm";

import Util from "@/utils/util";

const confirm = Modal.confirm;
export default class winningAnnouncement extends React.Component{
    state = {
        tableState: 0,
        visible: false,     //编辑公告弹窗
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    //展示的字段
    importantFilter = ['reportFlag', 'title', 'companyName' , 'bidCompanyLicense' ]

    //搜索框全字段
    formList = [
        {
            type: 'INPUT',
            field: 'bidNum',
            label: '招标编号',
            placeholder: '招标编号',
        },
        {
            type: 'INPUT',
            field: 'title',
            label: '中标公告名称',
            placeholder: '中标公告名称',
        },
        {
            type: 'INPUT',
            field: 'companyName',
            label: '发布公司',
            placeholder: '发布公司',
        },
        {
            type: 'RANGE',
            field: 'createTimeArr',
            label: '发布时间',
            placeHolder: '请筛选时间段'
        },
        {
            type: 'SELECT',
            field: 'bidCompany',
            label: '中标公司',
            placeholder: '请选择',
            list: [{ id: '1', value: '有' }, { id: '0', value: '无' }]
        },
        {
            type: 'SELECT',
            field: 'payType',
            label: '付款方式',
            placeholder: '请选择',
            list: [{ id: '1', value: '铁建银信' }, { id: '2', value: '现金支付' }]
        },
        {
            type: 'INPUT',
            field: 'bidCompanyLicense',
            label: '中标供应商',
            placeholder: '名称/统一社会信用代码',
        },
        {
            type: 'SELECT',
            field: 'reportFlag',
            label: '发布方',
            placeholder: '请选择',
            list: [{ id: '1', value: '用户' }, { id: '2', value: '平台' }]
        },
    ]

    //表单提交按钮
    handleFilter = (p, isSend = true) => {
        let creatStartTime, creatEndTime;
        if (p.createTimeArr) {
            creatStartTime = p.createTimeArr[0] ? moment(p.createTimeArr[0]).format('YYYY-MM-DD') + (' 00:00:00') : '';
            creatEndTime = p.createTimeArr[1] ? moment(p.createTimeArr[1]).format('YYYY-MM-DD') + (' 23:59:59') : '';
            delete p.createTimeArr
        }
        this.baseParams = {
            ...this.baseParams,
            ...p,
            creatStartTime,
            creatEndTime
        }
        if(isSend){
            this.handelToLoadTable();
        }
        
    }

    baseParams = {
        type: 4
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
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                sorter: false,
                width: 80,
                render: (text, record)=>(
                    <p>{text==4?"中标公告":"-"}</p>
                )
            },
            {
                title: '发布方',
                dataIndex: 'reportFlag',
                key: 'reportFlag',
                sorter: false,
                width: 80,
                render: (text, record)=>(
                    <p>{text == '2' ? '平台' : '用户' }</p>
                )
            },
            {
                title: '公告编号',
                dataIndex: 'bidNum',
                key: 'bidNum',
                sorter: false,
                width: 100
            },
            {
                title: '招标公告名称',
                dataIndex: 'title',
                key: 'title',
                sorter: false,
                width: 200
            },
            {
                title: '发布公司',
                dataIndex: 'companyName',
                key: 'companyName',
                sorter: false,
                width: 200
            },
            {
                title: '中标供应商',
                dataIndex: 'bidCompany',
                key: 'bidCompany',
                sorter: false,
                width: 150,
                render: (text, record)=> {
                    return(
                        <span>{text ? text : '-'}</span>
                    )
                }
            },
            {
                title: '发布时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                width: 120,
                render: (text, record, index) => (
                    <p>
                        <span title={text?moment(text).format("YYYY-MM-DD HH:mm:ss"):"-"}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):"-"}</span>
                    </p>
                )
            },
            {
                title: '付款方式',
                dataIndex: 'payType',
                key: 'payType',
                sorter: true,
                width: 80,
                render: (text, record, index) => (
                    <p>{text == '1' ? '铁建银信' : '现金支付'}</p>
                )
            },
            {
                title: '金额',
                dataIndex: 'orderPrice',
                key: 'orderPrice',
                sorter: true,
                width: 100,
                render: (text, record, index) => {
                    return(
                        <span>{this.handleTwoDecimals(text)}</span>
                    )
                }
            },
            {
                title: '订单编号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                sorter: false,
                width: 200,
            },

            {
                title: '操作',
                dataIndex: 'xz',
                key: 'xz',
                width: 100,
                render: (text, record)=> {
                    return(
                        <span>
                             <p>
                                <a onClick={()=>{this.showPurchaserDetail(record.uuids)}}>查看</a>
                                <span className="ant-divider"></span>
                                <a onClick={()=>{this.editPurchaser(record.uuids)}}>编辑</a>
                             </p>
                        </span>
                    )
                }
            }
        ]
    }
    //导出
    exportExcel = ()=>{
        let _this = this;
        confirm({
            title: "确认导出吗？",
            onOk() {
                exportFile("/purchaser/bidinformation/exportBidInfoList",_this.baseParams);
                setTimeout(function(){
                    Util.alert("导出成功");
                },2000)
            }
        })



    }
    //重置
    resetForm  = ()=>{
        this.props.history.push('/purchaser/addPurchaser')
    }

    //编辑
    editPurchaser = (uuids)=>{
        if(uuids){
            this.setState({
                uuids: uuids,
                visible: true
            })
        }else{
            message.error("uuids为false")
        }
    }

    //查看
    showPurchaserDetail = (uuids)=>{
        if(uuids){
            //跳转前台的公告详情页面
            window.open(systemConfigPath.jumpCrccmallPage("/webNewsNotice/"+uuids));
        }else{
            message.error("查看失败"+ uuids)
        }
    }

    //弹窗确定
    handleOk = () => {
        console.log(" handleOk ------------ ")

    }

    //关闭
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    //弹窗事件
    modalHandle = (ok, params) => {
        if (ok) {
            // 保存
            this.handelToLoadTable();
        } else {
            this.handleCancel()
        }
    }

    //处理两位小数展示
    handleTwoDecimals=( price )=>{
        if(price == null || price == '' || price == undefined || price == 'null')
            return '-';
        price+='';
        if(price.indexOf('.') == -1){     //不含小数点
            price += '.00';
        }else{
            if( price.split('.')[1].length > 2){
                price = price.split('.')[0] + '.' + price.split('.')[1].substr(0, 2);
            }else if (price.split('.')[1].length == 1){
                price += '0';
            }
        }
        return price;
    }

    //发布公告
    openContent = () =>{
        window.open(systemConfigPath.jumpPage("/bidNotice/reportBid"));
    }

    render() {
        return(
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <div className="toolbar">
                        <Button type="ghost" onClick={this.openContent}>发布公告</Button>
                        <Button type="ghost" onClick={this.exportExcel}>导出</Button>
                        {/*<AuthButton type="primary" onClick={this.resetForm}>重置</AuthButton>*/}
                    </div>
                    <BaseTable
                        url='@/purchaser/bidinformation/queryBidInfoListByType'
                        tableState={this.state.tableState}
                        resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={this.baseParams}
                        columns={this.columns()}
                        scroll={{ x: 1000 }}
                    />
                </Card>
                {/*修改当前的中标公告*/}
                <ModalForm
                    title={'编辑中标公告'}
                    visible={this.state.visible}
                    onOk={this.modalHandle}
                    uuids={this.state.uuids}
                />

            </div>
        )
    }
}