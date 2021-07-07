import React from "react";
import {Button, Card, Col, Form, Modal, Row} from "antd";
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import moment from "moment";
import './index.css'

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
export default class BidOrderList extends React.Component{
    _isMounted = false;

    state = {
        tableState: 0,
        visible: false,     //
        orderInfo: {},      //当前要展示的订单详情

    }

    componentWillMount(){
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    //展示的字段
    importantFilter = ['bidNum', 'orderNo', 'supplierName']

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
            field: 'orderNo',
            label: '订单编号',
            placeholder: '订单编号',
        },
        {
            type: 'INPUT',
            field: 'supplierName',
            label: '中标供应商',
            placeholder: '中标供应商名称/统一社会信用代码',
        },
        {
            type: 'INPUT',
            field: 'buyerName',
            label: '采购单位',
            placeholder: '采购单位名称/统一社会信用代码',
        },
        {
            type: 'RANGE',
            field: 'createTimeArr',
            label: '发布时间',
            placeHolder: '请筛选时间段'
        },
        {
            type: 'INPUT',
            field: 'createUserStr',
            label: '发布人/手机号码',
            placeholder: '发布人/手机号码',
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
                title: '订单编号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                sorter: false,
                width: 200
            },
            {
                title: '公告编号',
                dataIndex: 'bidNum',
                key: 'bidNum',
                sorter: false,
                width: 100
            },
            {
                title: '付款方式',
                dataIndex: 'payType',
                key: 'payType',
                sorter: true,
                width: 80,
                render: (text, record)=>(
                    <p>{text == '1' ? '铁建银信' : '现金支付'}</p>
                )
            },
            {
                title: '采购单位',
                dataIndex: 'buyerName',
                key: 'buyerName',
                sorter: false,
                width: 150
            },
            {
                title: '中标供应商',
                dataIndex: 'supplierName',
                key: 'supplierName',
                sorter: false,
                width: 150,
            },
            {
                title: '状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                sorter: true,
                width: 60,
                render: (text, record)=>(
                    <p>{text == '20' ? '有效' : '作废'}</p>
                )
            },
            {
                title: '发布人',
                dataIndex: 'createUserStr',
                key: 'createUserStr',
                sorter: false,
                width: 150,
            },
            {
                title: '发布时间',
                dataIndex: 'createDate',
                key: 'createDate',
                sorter: true,
                width: 150,
                render: (text, record, index) => (
                    <p>
                        <span title={text?moment(text).format("YYYY-MM-DD HH:mm:ss"):"-"}>{text?moment(text).format("YYYY-MM-DD HH:mm:ss"):"-"}</span>
                    </p>
                )
            },
            {
                title: '订单金额',
                dataIndex: 'orderPrice',
                key: 'orderPrice',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    return(
                        <span>{this.handleTwoDecimals(text)}</span>
                    )
                }
            },
            {
                title: '银信开具',
                dataIndex: 'yxStatus',
                key: 'yxStatus',
                sorter: true,
                width: 80,
                render: (text, record, index) => (
                    <span>{text == '1'? '已开' : '未开'}</span>
                )
            },
            {
                title: '银信编号',
                dataIndex: 'yxNo',
                key: 'yxNo',
                sorter: false,
                width: 150,
                render: (text, record, index) => (
                    <span>{text?text:'-'}</span>
                )
            },
            {
                title: '开具金额',
                dataIndex: 'yxPrice',
                key: 'yxPrice',
                sorter: true,
                width: 120,
                render: (text, record, index) => {
                    return(
                        <span>{this.handleTwoDecimals(text)}</span>
                    )
                }
            },
            {title: '操作',
                dataIndex: 'xz',
                key: 'xz',
                width: 50,
                render: (text, record)=> {
                    return(
                        <span>
                             <p>
                                <a onClick={()=>{this.showOrderDetail(record)}}>查看</a>
                             </p>
                        </span>
                    )
                }
            }
        ]
    }

    //处理两位小数展示
    handleTwoDecimals=( price )=>{
        if(price == null || price == '' || price == undefined || price == 'null')
            return '-';
        price+='';
        if(price.indexOf('.') == -1){     //不含小数点
            price += '.00';
        }else{
            if( price.split('.')[1].length >= 2){
                price = price.split('.')[0] + price.split('.')[1].substr(0, 2);
            }else{
                price += '0';
            }
        }
        return price;
    }

    //查看按钮
    showOrderDetail=(order)=>{
        this.setState({
            visible: true,
            orderInfo: order
        })
    }

    //弹窗关闭按钮
    handleCancel=()=>{
        this.setState({
            visible: false,
            orderInfo: {}
        })
    }



    render() {
        let {visible, orderInfo, tableState} = this.state;
        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <BaseTable
                        url='@/platform/ecBidInfo/queryBidOrderListPage'
                        tableState={tableState}
                        resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={this.baseParams}
                        columns={this.columns()}
                        scroll={{ x: 1000 }}
                    />
                </Card>
                {/*修改当前的中标公告*/}
                <Modal
                    title={'订单信息'}
                    visible={visible}
                    width={800}
                    onCancel={this.handleCancel}
                    footer={<Button type="primary" onClick={this.handleCancel}>关闭</Button>}
                >
                    <Form horizontal className={'formClass'}>
                        <FormItem label="订单编号" {...formItemLayout}>
                            {orderInfo.orderNo}
                        </FormItem>
                        <FormItem label="订单金额" {...formItemLayout}>
                            {this.handleTwoDecimals(orderInfo.orderPrice)}
                        </FormItem>
                        <FormItem label="中标供应商名称" {...formItemLayout}>
                            {orderInfo.supplierName}
                        </FormItem>
                        <FormItem label="供应商统一社会信用代码" {...formItemLayout}>
                            {orderInfo.supplierLicense}
                        </FormItem>
                        <FormItem label="采购商名称" {...formItemLayout}>
                            {orderInfo.buyerName}
                        </FormItem>
                        <FormItem label="采购商统一社会信用代码" {...formItemLayout}>
                            {orderInfo.buyerLicense}
                        </FormItem>
                        <FormItem label="付款方式" {...formItemLayout}>
                            {orderInfo.payType==1 ? '铁建银信' : '现金支付'}
                        </FormItem>
                        <FormItem label="中标公告编号" {...formItemLayout}>
                            {orderInfo.bidNum}
                        </FormItem>
                        <FormItem label="中标公告UUIDS" {...formItemLayout}>
                            {orderInfo.bidInfoId}
                        </FormItem>
                        <FormItem label="创建时间" {...formItemLayout}>
                            {moment(orderInfo.createDate).format("YYYY-MM-DD HH:mm:ss")}
                        </FormItem>
                        <FormItem label="订单状态" {...formItemLayout}>
                            {orderInfo.orderStatus == '20' ? '有效' : '作废'}
                        </FormItem>
                        <FormItem label="删除状态" {...formItemLayout}>
                            {orderInfo.delFlag == 1 ? '删除' : '正常'}
                        </FormItem>
                        <FormItem label="采购方式" {...formItemLayout}>
                            {orderInfo.purchaseType == '1' ? '招标采购' : '-'}
                        </FormItem>
                        <FormItem label="银信开具状态" {...formItemLayout}>
                            {orderInfo.yxStatus == 1 ? '已开' : '未开'}
                        </FormItem>
                        <FormItem label="银信编号" {...formItemLayout}>
                            {orderInfo.yxNo}
                        </FormItem>
                        <FormItem label="银信开具金额" {...formItemLayout}>
                            {orderInfo.yxPrice}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}