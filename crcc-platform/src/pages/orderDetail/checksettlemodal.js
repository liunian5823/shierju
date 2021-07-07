/* 结算所有弹窗 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Rate, Switch, Radio, Popconfirm, message, InputNumber,Alert, Tooltip, Timeline, Upload, Select, Card, Form, Row, Col, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs, FormItem } from 'antd';
import { NumberFormat } from '@/components/content/Format'
// import CardInfo from '../../components/settleHeader/cardInfo';
import less from './settlemodal.less'
// import CusPopover from '../../components/cusPopover';
// import { moment } from 'moment'
// import warning from '../../../static/img/warning_icon.png'
// import info from '../../../static/img/info.png'
// import { systemConfig, systemConfigPath } from '../../util/config/systemConfig';
// import { DetailsBtns, PermissionsBtn } from "components/content/DetailsBtns";
const Option = Select.Option;
class CheckSettleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: '',
            baseModal: false,
            thaw: false,
            stoppay: false,
            voucher: false,
            accountinfo: false,
            share: false,
            capital: false,
            credit: false,
            tiejian: false,
            otherpayway: false,
            funds: false,
            remittance: false,
            sharepay: false,
            tabvoucher: false,
            invoice: false,
            //承兑汇票
            Acceptance_of_draft: false,
            codeTime: -1,
            loading: false,
            //需要有参数怕判断支付弹窗的确认按钮是否显示
            tiejianconfirm: false,
            otherconfirm: false,
            fundsconfirm: false,
            remittanceconfirm: false,
            sharepayconfirm: false,
            //是否锁死付款金额 true锁定  false放开
            lock: ''
        }
    }
    tranfsormMoney = (n) => {
        let fraction = ['角', '分'];
        var digit = [
            '零', '壹', '贰', '叁', '肆',
            '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var IsNum = Number(n);
        if (!isNaN(IsNum)) {
            var head = n < 0 ? '欠' : '';
            n = Math.abs(n);
            var s = '';
            for (var i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 100 / 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (var i = 0; i < unit[0].length && n > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整');
        }
        else {
            return "";
        }
    }
    
    
   
    countThisTime = () => {
        const { payTable } = this.props
        const type = this.state.show
        let thisMoney = 0
        if (payTable && payTable.length > 0) {
            for (let index = 0; index < payTable.length; index++) {
                thisMoney += this.props.form.getFieldValue(`thisTimePay_${type}_${index}`) ? parseFloat(this.props.form.getFieldValue(`thisTimePay_${type}_${index}`)) : 0
            }
        }
        return thisMoney
    }
   
     

    componentDidMount = () => {

    }
   
   
    
   
    componentWillUpdate = (props) => {
        if (props.show && props.show !== this.state.show) {
            console.log('uuu',props.show)

            this.setState({ show: props.show, [props.show]: true })
        }
    }
    componentDidUpdate = (props) => {
    }
    
   
    // 要判断是不是付款结束后关闭弹窗
    onCancel = (type, closeway) => {
        this.props.form.resetFields();
        this.setState({ [type]: false, show: '' })
        this.props.close ? this.props.close(closeway) : null
    }
   

    render = () => {
        const { getFieldProps, getFieldValue } = this.props.form;
        const { payTable, dataSource, voucherData, deaftData } = this.props
        const invoiceData = this.props.invoiceData || {}
        const draftData = this.props.draftData || {}
        const moment = require('moment')
        return (
            <div className={less.checksettlemodal}>
                <Modal
                    // visible={this.state.invoice}
                    visible={this.props.show}
                    onCancel={() => { this.onCancel('invoice') }}
                    width={1000}
                    title='发票详情'
                    footer=""
                >
                    <div className={less.invoice}>
                    <Alert className="alert-warings" message="发票仅作为展示，不具备电子发票功能！" type="warning" showIcon />
                        <Row>
                            <Col><span className={less.justify}>订单号:</span><span>{invoiceData.orderNo}</span></Col>
                        </Row>
                        <Row className={less.invoice_top_info}>
                            <Col span={8} ><span className={less.justify}>上传人:</span><span>{invoiceData.upUserName ? invoiceData.upUserName : ''}</span></Col>
                            <Col span={8} ><span className={less.justify}>上传时间:</span><span>{moment(invoiceData.upTime).format('YYYY-MM-DD')}</span></Col>
                            <Col span={8} ><span className={less.justify}>附件:</span><span>{invoiceData.invoiceName}</span> {invoiceData.invoicePath ? <a style={{ marginLeft: '10px' }} href={SystemConfig.systemConfigPath.dfsPathUrl(invoiceData.invoicePath)} target='_blank'>下载</a> : ''}
                            </Col>
                        </Row>
                        <Row className={less.invoice_header}>
                            <Col span={8}><span>{invoiceData.invCode}</span></Col>
                            <Col span={8}><span>发票详情</span></Col>
                            <Col span={8}>
                                <p><span>NO</span><span>{invoiceData.invNo}</span></p>
                                <span>开票日期:</span><span>{invoiceData.openInvoiceTime ?moment(invoiceData.openInvoiceTime).format('YYYY年MM月DD日'):''}</span>
                            </Col>
                        </Row>
                        <Row className={less.invoice_two}>
                            <Col className={less.invoice_two_small} span={1}>采购方</Col>
                            <Col className={less.invoice_two_big} span={16}>
                                <p><span>名称：</span><span>{invoiceData.buyCompanyName}</span></p>
                                <p><span>纳税人识别编号：</span><span>{invoiceData.buyTaxpayerNumber}</span></p>
                                <p><span>地址&nbsp;&nbsp;&nbsp;&nbsp;电话：</span><span></span></p>
                                <p><span>开户行&nbsp;&nbsp;&nbsp;&nbsp;账号：</span><span></span></p>
                            </Col>
                            <Col className={less.invoice_two_small} span={1}>密码区</Col>
                            <Col className={less.invoice_two_big} span={6}><p></p></Col>
                        </Row>
                        <Row className={less.invoice_goods}>
                        <Col span={4} className={less.padding_col}>
                                <p>商品名称</p>
                                <p className={less.col_marginBottom} style={{height:'20px'}}>{invoiceData.goodsName}</p>
                                <p style={{color:'#6396E8'}}>合计</p>
                            </Col>
                            <Col span={3} className={less.padding_col}>
                                <p>规格型号</p>
                                <p>{invoiceData.specificationsName}</p>
                            </Col>
                            <Col span={2} className={less.padding_col}>
                                <p>单位</p>
                                <p>{invoiceData.unit}</p>
                            </Col>
                            <Col span={3} className={less.padding_col}>
                                <p>数量</p>
                                <p></p>
                            </Col>
                            <Col span={2} className={less.padding_col}>
                                <p>单价</p>
                                <p>{invoiceData.salace}</p>
                            </Col>
                            <Col span={4} className={less.padding_col}>
                                <p>金额</p>
                                <p className={less.col_marginBottom} style={{height:'20px'}}>{invoiceData.amount ? <NumberFormat value={invoiceData.amount}></NumberFormat> : ''}</p>
                                <p style={{color:'#6396E8'}}>￥{invoiceData.amount ? <NumberFormat value={invoiceData.amount}></NumberFormat> : ''}</p>
                            </Col>
                            <Col span={2} className={less.padding_col}>
                                <p>税率</p>
                                <p>{invoiceData.taxRate || invoiceData.taxRate==0 ? invoiceData.taxRate*100+'%' : ''}</p>
                            </Col>
                            <Col span={4} className={less.padding_col}>
                                <p>税额</p>
                                <p className={less.col_marginBottom} style={{height:'20px'}}>{invoiceData.tax ? <NumberFormat value={invoiceData.tax}></NumberFormat> : ''}</p>
                                <p style={{color:'#6396E8'}}>￥{invoiceData.tax || invoiceData.tax == 0? <NumberFormat value={invoiceData.tax}></NumberFormat> : ''}</p>
                            </Col>
                        </Row>
                        <Row className={less.invoice_totalTaxPrice}>
                            <Col span={4}><span >价税合计(大写)</span></Col>
                            <Col span={10}><span style={{color:'#6396E8'}}>{this.tranfsormMoney(invoiceData.totalPrice)}</span></Col>
                            <Col span={1} style={{color:'#D4B467'}}>(小写)</Col>
                            <Col span={9} style={{color:'#6396E8'}}>￥{invoiceData.totalPrice?<NumberFormat value={invoiceData.totalPrice}></NumberFormat>:''}</Col>
                        </Row>
                        <Row className={less.invoice_two}>
                            <Col span={1} className={less.invoice_two_small}>销售方</Col>
                            {/* <Col span={1} className='invoice_two_small'>供应方</Col> */}
                            <Col span={16} className={less.invoice_two_big}>
                                <p><span>名称:</span><span>{invoiceData.sellCompanyName}</span></p>
                                <p><span>纳税人识别编号:</span><span>{invoiceData.sellTaxpayerNumber}</span></p>
                                <p><span>地址&nbsp;&nbsp;&nbsp;&nbsp;电话:</span><span></span></p>
                                <p><span>开户行&nbsp;&nbsp;&nbsp;&nbsp;账号:</span><span></span></p>
                            </Col>
                            <Col span={1} className={less.invoice_two_small}>备注</Col>
                            <Col span={6} className={less.invoice_two_big}><span></span></Col>
                        </Row>
                        <Row className={less.invoice_bottom}>
                            <Col span={4}><span>收款人:</span><span>{invoiceData.receivieUserName}</span></Col>
                            <Col span={4}><span>复核:</span><span></span></Col>
                            <Col span={4}><span>开票人:</span><span></span></Col>
                            <Col span={4}><span>销售方:</span><span></span></Col>
                        </Row>
                    </div>

                </Modal>
                

            </div >
        );
    }
}
export default Form.create()(CheckSettleModal)