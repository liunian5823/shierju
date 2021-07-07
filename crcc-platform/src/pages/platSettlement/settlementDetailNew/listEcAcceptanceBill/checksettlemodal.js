/* 结算所有弹窗 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Rate, Switch, Radio, Popconfirm, message, InputNumber, Tooltip, Timeline, Upload, Select, Card, Form, Row, Col,Alert, Input, Button, Icon, Table, Divider, Menu, Dropdown, Modal, DatePicker, Tabs, FormItem } from 'antd';
import less from'./settlemodal.less'
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
    
    
    
    

    componentDidMount = () => {

    }
    
    componentWillUpdate = (props) => {
        if (props.show && props.show !== this.state.show) {

            this.setState({ show: props.show, [props.show]: true })
        }
    }
    componentDidUpdate = (props) => {
    }
   
    // 要判断是不是付款结束后关闭弹窗
    onCancel = (type, closeway) => {
        const { dataSource } = this.props
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
        let upTime = draftData.upTime ? moment(draftData.upTime).format('YY年MM月DD日') : ''
        return (
            <div className={less.checksettlemodal}>
                {   /* 账户基本信息 baseModal */}
               
                <Modal
                    visible={this.props.show}
                    onCancel={() => { this.onCancel('Acceptance_of_draft') }}
                    width={1000}
                    title='承兑汇票'
                    footer=""
                >
                    <div className={less.draft}>
                    <Alert message="此汇票仅作为展示，不具备真实作用！" type="warning" showIcon />
                        
                        <Row className={less.draft_header}>
                            <Row><h2>承兑汇票</h2></Row>
                            <Row><span style={{marginRight: '230px'}}>出票日期:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日</span></Row>
                            
                        </Row>
                        <Row className={less.draft_info_one}>
                            <Col span={4}>
                                <p className={less.center}>票据号(银信/商业)</p>
                                <p className={less.center}>流水号</p>
                                <p className={less.center}>票据类型</p>
                            </Col>
                            <Col span={8}>
                                <p className={less.left,less.blue_color}>{draftData.billNo}</p>
                                <p className={less.left,less.blue_color}>{draftData.serialNumber}</p>
                                <p className={less.left,less.blue_color}>铁建银信</p>
                            </Col>
                            <Col span={3} className={less.colums}><span>收款人</span></Col>
                            <Col span={3}>
                                <p className={less.center}>全称</p>
                                <p className={less.center}>账号</p>
                                <p className={less.center}>开户银行</p>
                            </Col>
                            <Col span={8}>
                                <p>{draftData.receiveName}</p>
                                <p>{draftData.sellAcount}</p>
                                <p>{draftData.sellOpen}</p>
                            </Col>
                        </Row>
                        <Row className={less.draft_info_two}>
                            <Col span={4}><p>出票金额</p></Col>
                            <Col span={12}>
                                <p className={less.left}>
                                    <span className={less.blue_color}>人民币(大写)</span>
                                    <span className={less.blue_color} style={{marginLeft:'20px'}}>{this.tranfsormMoney(draftData.drawAmount)}</span></p>
                            </Col>
                            <Col span={8} style={{border: '1px solid #337CAF'}} className={less.blue_color}>
                                <p><span></span><span></span></p>
                                <p><span>亿</span><span></span></p>
                                <p><span>千</span><span></span></p>
                                <p><span>伯</span><span></span></p>
                                <p><span>十</span><span></span></p>
                                <p><span>万</span><span></span></p>
                                <p><span>千</span><span></span></p>
                                <p><span>百</span><span></span></p>
                                <p><span>十</span><span></span></p>
                                <p><span>元</span><span></span></p>
                                <p><span>角</span><span></span></p>
                                <p><span>分</span><span></span></p>
                            </Col>
                        </Row>
                        <Row className={less.draft_info_three}>
                            <Col span={4}>
                                <p className={less.center}>开立时间</p>
                                <p className={less.center}>承兑日期</p>
                            </Col>
                            <Col span={8}>
                            <p className={less.left, less.blue_color}>{draftData.openDate ? moment(draftData.openDate).format('YYYY年MM月DD日') : ''}</p>
                                <p className={less.left, less.blue_color}>{draftData.acceptanceTime ? moment(draftData.acceptanceTime).format('YYYY年MM月DD日') : ''}</p>
                               
                            </Col>
                            <Col span={2} className={less.draft_colums}><span>付款行</span></Col>
                            <Col span={3}>
                                <p className={less.center}>行号</p>
                                <p className={less.center}>地址</p>
                            </Col>
                            <Col span={8}>
                                <p className={less.blue_color, less.left}></p>
                                <p className={less.blue_color, less.left}>{draftData.payAccount}</p>
                            </Col>
                        </Row>
                        <Row className={less.draft_info_four}>
                            <Col span={9}>
                                <p style={{padding: '20px 15px 0 20px'}} className={less.blue_color}>本汇款请你承兑，到期无条件付款</p>
                            </Col>
                            <Col span={9} className={less.blue_color}>
                                <p style={{textAlign:'center'}}>本票已承兑，到期由本行付款</p>
                                <p style={{textAlign:'center'}}>承兑日期:&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;承兑行签章</p>
                                <p style={{margin:'10px 0 0 10px'}}>备注:</p>
                            </Col>
                            <Col span={6}>
                                <p className={less.blue_color}><span>复核</span><span>记账</span></p>
                            </Col>
                        </Row>
                    </div>

                </Modal>
            </div >
        );
    }
}
export default Form.create()(CheckSettleModal)