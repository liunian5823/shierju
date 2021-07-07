import React from 'react';
import { Form, Input, Select } from 'antd'
import CreateOrderMixins from '../../mixins/createOrder'
import { number, phone, price, required } from "@/utils/validator";
const FormItem = Form.Item;
const Option = Select.Option;
class CreateOrder extends CreateOrderMixins {
    constructor(props) {
        super(props);
        this.state = {};
    }
    getFieldProps = this.props.form.getFieldProps;
    listRouter = '/supply/buy';
    deRouter = '/supply/buyOrderDetail/';
    // 初始化接口
    initUrl = '@/reuse/supplyDemand/initOrder';
    // 提交接口
    submitUrl = '@/reuse/supplyDemand/commitOrder';
    // 列表
    orderInfo = [
        { label: '订单号', value: 'code' },
        { label: '订单来源', value: 'sourceStr', high: 'businessCode' },
        { label: '下单日期', value: 'bidTime' },
        { label: '销售单位', value: { value: 'saleCompanyName', span: 8, prop: 'saleCompanyName', hint: '请输入销售单位', type: 'input', rules: [required('请输入销售单位')] }, edit: true, required: true },
        { label: '销售项目部', value: { value: 'saleDeptName', span: 8, prop: 'saleDeptName', type: 'input' }, edit: true },
        // { label: '销售项目部', value: 'saleDeptName'},
        {
            label: '联系人/电话', value: [
                { value: 'contacts', span: 8, prop: 'contacts', hint: '请输入联系人', type: 'input', rules: [required('请输入联系人')] },
                { value: 'contactsTel', span: 12, prop: 'contactsTel', hint: '请输入电话', type: 'number', rules: [required('请输入电话'), phone] }
            ], edit: true, required: true
        },
        { label: '采购单位', value: 'buyerCompanyName' },
        { label: '联系人/电话', value: ['offerContacts', 'offerContactsTel'] },
        { label: '付款方式', value: 'payWayStr' },
        { label: '付款时间', value: 'payTime' },
        { label: '货品所在地', value: 'goodsAddr' },
    ];

    columns = [
        { title: '物料名称', dataIndex: 'goodsName', key: 'goodsName' },
        { title: '规格', dataIndex: 'spec', key: 'spec' },
        { title: '品牌', dataIndex: 'brand', key: 'brand' },
        { title: '质量状况', dataIndex: 'quality', key: 'quality' },
        {
            title: '订单数量/单位', dataIndex: 'num', key: 'num', width: '180', render: (value, data, key) => {
                let selectAfter = (
                    <span>{data.unit}</span>
                );
                return (
                    <FormItem
                        noStyle
                    >
                        <Input addonAfter={selectAfter} {...this.getFieldProps(`goodsList[${key}].num`, {
                            initialValue: value,
                            rules: [required("订单数量不能为空"), number],
                            onChange: (el) => { this.goodListValueChange(el, `goodsList[${key}].num`) }
                        })} placeholder="请输入订单数量" />
                    </FormItem>
                )
            }
        },
        {
            title: '单价（元）', dataIndex: 'price', key: 'price', width: 150, render: (value, data, key) => {
                return (
                    <FormItem
                        noStyle
                    >
                        <Input {...this.getFieldProps(`goodsList[${key}].price`, {
                            initialValue: value,
                            rules: [required("单价不能为空"), price],
                            onChange: (el) => { this.goodListValueChange(el, `goodsList[${key}].price`) }
                        })
                        } placeholder="请输入订单数量" />
                    </FormItem>
                )
            }
        },
    ];

    render() {
        return super.render();
    }
}

export default Form.create()(CreateOrder);
