import { Form } from 'antd'
import CreateOrderMixins from '../../mixins/createOrder'
function toFixed(num, d) {
    if (!num) { return '0.00' }
    var s = num + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 0) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return num + "";
}
class OrderDetails extends CreateOrderMixins {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // type
    type = 'info';
    // 详情接口
    initUrl = '@/reuse/order/info';
    // 列表
    orderInfo = [
        { label: '订单号', value: 'code' },
        { label: '订单来源', value: 'sourceStr', high: 'businessCode' },
        { label: '下单日期', value: 'createTime' },
        { label: '销售单位', value: 'saleCompanyName' },
        { label: '销售项目部', value: 'saleDeptName' },
        { label: '联系人/电话', value: ['contacts', 'contactsTel'] },
        { label: '采购单位', value: 'buyerCompanyName' },
        { label: '联系人/电话', value: ['offerContacts', 'offerContactsTel'] },
        { label: '付款方式', value: 'payWayStr' },
        { label: '付款时间', value: 'payTime' },
        { label: '货品所在地', value: 'goodsAddr' },
    ];
    columns = [
        {
            title: '物料名称', dataIndex: 'goodsName', key: 'goodsName', render: text => {
                return <div title={text}>{text}</div>
            }, className: 'text_line4_td'
        },
        {
            title: '规格', dataIndex: 'spec', key: 'spec', render: text => {
                return <div title={text}>{text}</div>
            }, className: 'text_line4_td'
        },
        {
            title: '品牌', dataIndex: 'brand', key: 'brand', render: text => {
                return <div title={text}>{text}</div>
            }, className: 'text_line4_td'
        },
        {
            title: '质量状况', dataIndex: 'quality', key: 'quality', render: text => {
                return <div title={text}>{text}</div>
            }, className: 'text_line4_td'
        },
        { title: '订单数量/单位', dataIndex: 'num', key: 'num', width: 130, className: 'text_right', render: (value, data) => <span className='reuse_money'>{`${value} ${data.unit}`}</span> },
        { title: '单价（元）', dataIndex: 'price', key: 'price', width: 130, className: 'text_right', render: (value) => <span className='reuse_money'>{toFixed(value, 2)}</span> },
    ];

    render() {
        return super.render();
    }
}

export default Form.create()(OrderDetails);
