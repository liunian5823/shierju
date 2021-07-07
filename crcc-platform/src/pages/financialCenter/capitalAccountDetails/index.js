import { Row, Col, Button, Spin, Card, Form, Select, Input,DatePicker } from 'antd';
import api from '@/framework/axios';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';
import {NumberFormat} from '@/components/content/Format';
import BaseTable from '@/components/baseTable';
import moment from "moment";
const RangePicker = DatePicker.RangePicker;
import less from './index.less';
import './index.css';
import {exportFile} from "@/utils/urlUtils";
const FormItem = Form.Item;
class CapitalAccountDetails extends React.Component{
    state = {
        capitalInfo: {
            availAmt:0,
            frozeAmt:0,
            transitAmt:0,
            totalAmt:0,
            type:0
        },// 资金账户信息
        tableData: [],
        laoding:false,
    };
    params={};
    componentWillMount(){
        this.params.companyId = this.props.match.params.companyId;
        this.getCapitalInfo();
    };

    onCancel =() =>{
        this.props.form.resetFields();
    };

    //card右侧渲染
    extraOptions = () => {
        const { getFieldProps } = this.props.form;
        return[
            <Form inline>
                    <FormItem>
                        <DatePicker placeholder="请选择操作时间" {...getFieldProps('time')}/>
                    </FormItem>
                    <FormItem>
                        <Input placeholder="用途/流水号"{...getFieldProps('bankHtId')}/>
                    </FormItem>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                    <Button type="ghost " className='ml10' onClick={this.onCancel}>重置</Button>
                    <Button type="primary" onClick={this.handleExport} className='details_export'>导出</Button>
            </Form>
        ]
    };
    // 资金信息获取
    getCapitalInfo = () => {
        this.setState({laoding:true});
        api.ajax('GET', '!!/financial/ecFinanceInfo/getCapitalInfo',this.params
        ).then((r)=>{
            this.setState({
                capitalInfo: r.data,
                loading:false
            })
        })
    };
    // 返回
    handleGoBack = () => {
        this.props.history.goBack()
    };
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
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    }
    // 查询
    handleSearch = () => {
        let time = this.props.form.getFieldValue('time');
        let createStartDate;
        if (time) {
            createStartDate =  moment(time).format('YYYY-MM-DD');
        }
        this.params.createStartDate = createStartDate;
        this.params.bankHtId = this.props.form.getFieldValue('bankHtId');
        this.reloadTableData();
    };
    tableFilter = (value)=>{
        this.params.filterValue = value;
        this.reloadTableData();
    };

    handleExport = () => {
        exportFile("/financial/ecFinanceInfo/exportDataOfCapitalLog",this.params)
    };

    columns = () => {
        let { filteredInfo } = this.state;
        return [
            {
                title: '序号',
                key: 'indexkey',
                render: (text,record,index)=>{
                    return(<p className={less.nowrap2} style={{width:"50px"}}><span title={index +1 }>{index +1}</span></p>)
                },
            },
            {
                title: '流水号',
                dataIndex: 'bankHtId',
                key: 'bankHtId',
                render: (text)=>{
                    text = text ? text : '-';
                    return(<p className={less.nowrap2} style={{width:"150px"}}><span title={text}>{text}</span></p>)
                },
            },
            {
                title: '打款时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text)=>{
                    text = text ? text : '-';
                    let time = moment(text).format("YYYY-MM-DD")
                    return(<p className={less.nowrap2} style={{width:"100px"}}><span title={time}>{time}</span></p>)
                },
                sorter: true
            },
            {
                title: '付款单位',
                dataIndex: 'payer',
                key: 'payer',
                render: (text)=>{
                    text = text ? text : '-';
                    return(<p className={less.nowrap2} style={{width:"180px"}}><span title={text}>{text}</span></p>)
                },
            },
            {
                title: '收款单位',
                dataIndex: 'payee',
                key: 'payee',
                render: (text)=>{
                    text = text ? text : '-';
                    return(<p className={less.nowrap2} style={{width:"180px"}}><span title={text}>{text}</span></p>)
                },
            },
            {
                title: '类型',
                dataIndex: 'transactionTypeStr',
                key: 'transactionTypeStr',
                render: (text)=>{
                    text = text ? text : '-';
                    return(<p className={less.nowrap2} style={{width:"56px"}}><span title={text}>{text}</span></p>)
                },
                filters: [
                    { text: '解冻', value: '解冻' },
                    { text: '冻结', value: '冻结' },
                    { text: '提现', value: '提现' },
                    { text: '充值', value: '充值' },
                    { text: '付款', value: '付款' },
                    { text: '收款', value: '收款' },
                ],
               onFilter: (value, record) =>  record.transactionTypeStr.includes(value),
            },
            {
                title: '资金用途',
                dataIndex: 'purpose',
                key: 'purpose',
                sorter: true,
                render: (text)=>{
                    text = text ? text : '-';
                    return(<p className={less.nowrap2} style={{width:"300px"}}><span title={text}>{text}</span></p>)
                },
            },
            {
                title: '金额（元）',
                dataIndex: 'transactionMonery',
                className:'text_align_right',
                key: 'transactionMonery',
                render: (text,record)=>{
                    let direction = record.direction
                    let color = direction == 2 ? 'red' : direction == 1 ? 'green' : 'gray';
                    let money = text > 0 || text < 0 ?  <NumberFormat value={text}/> :'-';
                    let prefix = direction == 1 ?  '-' : '';
                    return(<p className={less.nowrap2} style={{width:"120px"}}><span className={less['money_color_' + color]}>{prefix}{money}</span></p>)
                },
                sorter: true,
            }
        ]};
    render(){
        const { getFieldProps } = this.props.form;
        return(
            <Spin spinning={this.state.loading}>
                <Card bordered={false} title="公司信息" className="mb10">
                    <Row gutter={16}>
                        <Col span={12}>
                            <BaseDetails title="公司名称">
                                {this.state.capitalInfo.name}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="开通时间">
                                {this.state.capitalInfo.createTime}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <BaseDetails title="社会信用代码">
                                {this.state.capitalInfo.businessLicense}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="手机号码">
                                {this.state.capitalInfo.telPhone}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <BaseDetails title="管理信息员">
                                {this.state.capitalInfo.adminName}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="电子邮箱">
                                {this.state.capitalInfo.email}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Form>
                    <Card bordered={false} title="账户余额" className="mb10"
                          extra={<Select defaultValue='1'><Option value='1'>平安银行</Option></Select>}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <span className={less.moneyText}>总金额(元)</span>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <span className={less.totalMoney}> <NumberFormat value={this.state.capitalInfo.totalAmt}/> </span><span className={less.moneyUnit}>元</span>
                            </Col>
                        </Row>
                        {this.state.capitalInfo.type == "供应商" ?
                            <Row gutter={16}>
                                <Col span={24}>
                                    <BaseDetails title="冻结金额">
                                        ￥<NumberFormat value={this.state.capitalInfo.frozeAmt}/>
                                    </BaseDetails>
                                </Col>
                            </Row>
                            : "" }
                        {this.state.capitalInfo.type == "供应商" ?
                            <Row gutter={16}>
                                <Col span={24}>
                                    <BaseDetails title="在途金额">
                                        ￥<NumberFormat value={this.state.capitalInfo.transitAmt}/>
                                    </BaseDetails>
                                </Col>
                            </Row>
                            : ""}
                        <Row gutter={16}>
                            <Col span={24}>
                                <BaseDetails title="可提现金额">
                                    ￥<NumberFormat value={this.state.capitalInfo.availAmt}/>
                                </BaseDetails>
                            </Col>
                        </Row>
                    </Card>
                </Form>
                <Card bordered={false} title="账户信息" className="mb10">
                    <Row gutter={16}>
                        <Col span={12}>
                            <BaseDetails title="开户名称">
                                {this.state.capitalInfo.name}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="会员子账号">
                                {this.state.capitalInfo.actId}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <BaseDetails title="开户代码">
                                {this.state.capitalInfo.thirdCustId}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} title={<span>银行卡信息<span className={less.remark}>本银行卡用于资金的充值与转出</span></span>} className='mb10'>
                    <Row gutter={16}>
                        <Col span={12}>
                            <BaseDetails title="账户名称">
                                {this.state.capitalInfo.companyName}
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="开户银行">
                                {this.state.capitalInfo.bankName}
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <BaseDetails title="银行卡号">
                                {this.state.capitalInfo.bankNo}
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false}
                      title="出入金明细"
                      className={'details'}
                      extra={this.extraOptions()
                         }>
                    <BaseTable
                        url='!!/financial/ecFinanceInfo/getCapitalLog'
                        tableState={this.state.tableState}
                        resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={this.params}
                        columns={this.columns()}
                        scroll={{x: 960 } }
                    />
                </Card>
                <BaseAffix>
                    <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
                </BaseAffix>
            </Spin>
        )
    }
}
export default Form.create()(CapitalAccountDetails)