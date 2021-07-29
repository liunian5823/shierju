import {
    Card,
    Button,
    Switch,
    Modal,
    Tabs,
    Row,
    Col,
    Table,
    Form,
    Radio,
    Input,
    Icon,
    Upload,
    message,
    Popconfirm
} from 'antd';
import React from "react";
import api from '@/framework/axios';
import Util from '@/utils/util'
import BaseInput from '@/components/baseInput';
import BaseAffix from '@/components/baseAffix';




import less from "./detail.less";



const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class XhFinanceHangDetail extends React.Component {
    _isMounted = false;
    _uuids  = '';
    _clientId

    state = {
        info:{},
        sameStatement : {},
        payUuids:'',
        dataSource:[],
        suspectedPayOrder: {
            rows: []
        },      //疑似支付单
        bondPage: 1,
        bondRows: 10,
        bondTotal: 0,
        otherPage: 1,
        otherRows: 10,
        otherTotal: 0,
        selectType: '1',      //1-保证金， 2-其他
        bondOrderData: [],      //保证金列表
        otherOrderData: [],     //其他列表

        selectObject: '',     //疑似选中的数据
        handleType: '',       // 1-退款， 2-匹配
        handleVisible: false,       //处理弹窗显示
        handleLoading: false,       //

        codeName: '获取验证码',
        codeDisabled: false,
        codeInputDisabled: false,
        phone: '',      //

        loadManyType: '',       //加载更多
    }

    columns = [
        {
            title: '操作人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: 150,
            sorter: true
        },{
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            sorter: true
        },{
            title: '具体操作',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 190,
            sorter: true
        }
    ];


    componentWillMount() {
        this._isMounted = true;
        this._clientId = Util.randomString(20);
        this._uuids = this.props.match.params.uuids;
        this.getMasterData(this._uuids);
        //
        this.suspectedPayOrder();
        //
        this.getPhone();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    //1.1.7挂账详情主要数据
    getMasterData = (uuids) =>{
        if(!uuids) return
        api.ajax("GET", "@/platform/xhFinanceHang/getMasterData", {
            workUuids: this._uuids
        }).then(r => {
            this.setState({
                info: r.data,
                payUuids:r.data.payUuids,
                dataSource:r.data.flog,
            });
            this.getPayOrder(r.data.payUuids);
        }).catch(r => {
            console.log('getMasterData  catch ------ ', r)
        })
    }

    //挂账详情疑似支付单列表
    // flag = false：初次加载，flag = true: 加载更多
    suspectedPayOrder=(flag = false)=>{
        /*let data1 = {};
        data1.buyCompanyName = '测试公司1';
        data1.sceneNo = 'sceneNo12131231';
        data1.payUserName = '张三';
        data1.payUserPhone = '1989912311';
        data1.sellerCompanyName = '销售公司1231';
        data1.amount = 100.00;
        data1.payCode = 'sdfasdf';
        data1.signNo = '68674286342';
        data1.payTime = '2020-09-01';
        data1.sceneTime = '2020-09-01';
        data1.relationCount = '20';
        data1.payUuids = '123123123123'
        data1.typeStr = '业务类型1'
        let data2 = {};
        data2.buyCompanyName = '测试公司2';
        data2.sceneNo = 'sceneNo12131231';
        data2.payUserName = '张三';
        data2.payUserPhone = '1989912311';
        data2.sellerCompanyName = '销售公司1231';
        data2.amount = 100.00;
        data2.payCode = 'sdfasdf';
        data2.signNo = '68674286342';
        data2.payTime = '2020-09-01';
        data2.sceneTime = '2020-09-01';
        data2.relationCount = '20';
        data2.payUuids = '234234234234';
        data2.typeStr = '业务类型2'
        let bondOrderList =[];
        bondOrderList.push(data1);
        bondOrderList.push(data2);
        this.setState({
            bondOrderData: bondOrderList,
            bondTotal: 2
        })*/

        let{bondPage, bondRows, otherPage, otherRows, selectType, bondOrderData, otherOrderData} = this.state;
        let params = {};
        params.workUuids = this._uuids;
        params.type = selectType;
        if (flag && selectType == '1')
            bondPage += 1;

        if (flag && selectType == '2')
            otherPage += 1;

        if (selectType == '1'){
            params.page = bondPage;
            params.rows = bondRows;
        }
        if (selectType == '2'){
            params.page = otherPage;
            params.rows = otherRows;
        }
        let findName = $('#searchInput').val();
        if (findName)
            params.findName = findName;

        console.log(' suspectedPayOrder params--------', params)
        api.ajax(
            "GET",
            "@/platform/xhFinanceHangFind/suspectedPayOrder",
            {...params}
        ).then(r => {
            if (r.data && r.data.rows){
                if (selectType == '1'){
                    this.setState({
                        bondOrderData: flag ? bondOrderData.push(...r.data.rows) : r.data.rows,
                        bondPage: bondPage
                    });
                }
                if (selectType == '2'){
                    this.setState({
                        otherOrderData:  flag ? otherOrderData.push(...r.data.rows) : r.data.rows,
                        otherPage: otherPage
                    });
                }
            }
        }).catch(r => {
            Util.alert(r.msg, {type: 'error'})
            console.log('getPayOrder  catch ------ ', r)
        })
    }

    //1.1.13挂账复合审批详情陪陪支付单信息
    getPayOrder = (payUuids) =>{
        if(!payUuids) return
        api.ajax("GET", "@/platform/xhFinanceHangFind/getPayOrder", {
            payUuids: payUuids
        }).then(r => {
            this.setState({
                sameStatement: r.data
            });
        }).catch(r => {
            console.log('getPayOrder  catch ------ ', r)
        })
    }

    handleTitle = (workNo) => {
        let str = '来款信息';
        if(!workNo) return str;
        console.log("workNo!!!!!",workNo);
        return (
            str+"（工单号："+workNo+"）"
        )
    }

    /**
     * 审核弹框显示
     * @returns {*}
     */
    handApproval = () => {
    }

    //保证金和其他切换
    tabsChange=(value)=>{
        this.setState({
            selectType: value,
            selectUuids: ''
        })
    }

    //获取当前审核的手机号码
    getPhone=()=>{
        api.ajax(
            'GET',
            '@/platform/xhFinanceHang/getPhone?type=1',
            {}
        ).then(r=>{
            this.setState({
                phone: r.data
            })
        })
    }

    //获取验证码
    getCode = () => {
        let _this = this;
        let params = {};
        params.type = type;
        params.code = this._clientId;
        api.ajax(
            'GET',
            '@/platform/xhFinanceHang/sendCheckCode',
            {...params}
        ).then(r=>{
            _this.props.form.setFieldsValue({ verCode: "" });
            _this.getCodeName();
            _this.setState({
                codeInputDisabled: false
            });
        })

    };

    //验证码倒计时
    getCodeName = () => {
        this.setState({
            codeDisabled: true
        })
        let that = this;
        let intervalTime = 60;
        let interval = setInterval(function() {
            let time = intervalTime;
            if (time == 1) {
                that.setState({
                    codeName: "获取验证码",
                    codeDisabled: false
                });
                clearInterval(interval);
            } else {
                intervalTime -= 1;
                that.setState({
                    codeName: "验证码(" + intervalTime + "s)"
                });
            }
        }, 1000);
    };

    //上传
    uploadPropsMultiple = {
        ...ComponentDefine.upload_.uploadLimitSize(5),
        beforeUpload(file) {
            /*const fileType = [
                "pdf",
                "docx",
                "doc",
                "xls",
                "xlsx",
                "jpg",
                "png",
            ];
            let fileName = file.name;
            let filePix = fileName
                .substring(fileName.lastIndexOf(".") + 1, fileName.length)
                .toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error("只能上传doc 、xls、xlsx、pdf、docx、jpg、png类型的文件");
                return false;
            }*/
            return true;
        },
        onChange: info => {
            let fileList = info.fileList;
            if (info.file.status === "done") {
                let isSuccess = false;
                if (info.file.response.code == '000000' ) {
                    isSuccess = true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(
                        info.file.response.data
                    );
                    message.success(`${info.file.name} 上传成功。`);
                } else {
                    if (info.file.response.code == "400002") {
                        message.error(info.file.response.msg);
                    } else {
                        message.error(`${info.file.name} 上传失败。`);
                    }
                }
                if (isSuccess) {
                    fileList = fileList.slice(-1);
                } else {
                    fileList = fileList.slice(0, fileList.length - 1);
                }
            } else if (info.file.status === "error") {
                if (info.file.response.code == "400002") {
                    message.error(info.file.response.msg);
                } else {
                    message.error(`${info.file.name} 上传失败。`);
                }
            }
            this.props.form.setFieldsValue({ qfFile: fileList });
        }
    };


    //点击疑似订单
    paymentOptionClick(obj) {
        console.log('paymentOptionClick  uuids ==================== ')
        this.setState({
            selectObject: obj
        })
    }

    //处理按钮 1-退款， 2-匹配
    handleButtonClick=(type)=>{
        //判断当前是否选中单子
        let {selectObject} = this.state;
        if (selectObject == '') {
            Util.alert('清先选择单据！', {type: 'warning'})
            return
        }
        console.log('选中的单据信息为------------ ', selectObject)
        this.setState({
            handleType: type,
            handleVisible: true
        })


    }

    //跳转列表刷新
    toPageList=()=>{
        //关闭当前页面
        window.close();
        // window.opener.location.reload();   //刷新父页面
    }

    //提交处理结果
    saveHandle=(params)=>{
        api.ajax(
            'GET',
            '@/platform/xhFinanceHang/handleOrder',
            {...params}
        ).then(r=>{
            Util.alert(r.msg, {type: 'success'});
            //
            this.toPageList()
        }).catch(r=>{
            Util.alert(r.msg, {type: 'error'})
        })
    }

    //释放
    toSFWorks=()=>{
        //发送受理请求
        console.log(' 发送释放请求  toSFWorks -------------------- ')
        api.ajax(
            'GET',
            '@/platform/xhFinanceHang/release?workUuids=' + this._uuids,
            {}
        ).then(r=>{
            Util.alert(r.msg, {type: 'success'});
            //刷新当前页面
            this.reloadTableData();
        }).catch(r=>{
            Util.alert(r.msg, {type: 'error'});
            return;
        })
    }

    handleCancel=()=>{
        this.setState({
            handleVisible: false
        })
    }

    handleOk=()=>{
        //校验参数
        this.props.form.validateFields((errors, values)=> {
            if (!!errors) {
                return;
            }
            //加载中
            this.setState({
                handleLoading: true
            })
            //组合参数
            let{selectObject, selectType, info} = this.state;
            let params = {};
            params.workUuids = this._uuids;
            params.payUuids = selectObject.payUuids;
            params.remark = values.remark;
            params.hangUuids = info.hangUuids;
            params.type = selectType;
            params.code = this._clientId;
            params.verCode = values.verCode;
            params.fileName = values.qfFile[0].name;
            params.filePath = values.qfFile[0].url;
            console.log('params ------------------', params)
            //
            this.saveHandle(params);
        })
    }

    //
    toSearch = () =>{
        //获取当前的输入内容
        let findName = $('#searchInput').val();
        if (!findName){
            Util.alert('请输入搜索条件！', {type: 'warning'})
            return;
        }else {
            this.suspectedPayOrder();
        }
    }

    toResetSearch=()=>{
        $("#searchInput").val('');
    }

    getHistory=()=>{
        console.log('查看历史来款 ---------------- ' )
       /* api.ajax(
            'GET',
            '@'
        )*/
    }

    //加载更多
    loadManyBond=()=>{
        let{bondPage, bondRows, otherPage, otherRows, selectType} = this.state;
        let params = {};
        params.workUuids = this._uuids;
        params.type = selectType;
        if (selectType == '1'){
            params.page = bondPage;
            params.rows = bondRows;
        }
        if (selectType == '2'){
            params.page = otherPage;
            params.rows = otherRows;
        }
        if (findName != ''){
            params.findName = findName;
        }

        let findName = $('#searchInput').val();
        if (findName)
            params.findName = findName;

        api.ajax(
            "GET",
            "@/platform/xhFinanceHangFind/suspectedPayOrder",
            {...params}
        ).then(r => {
            if (selectType == '1'){
                this.setState({
                    bondOrderData: r.data
                });
            }
            if (selectType == '2'){
                this.setState({
                    otherOrderData: r.data
                });
            }

        }).catch(r => {
            Util.alert(r.msg, {type: 'error'})
            console.log('getPayOrder  catch ------ ', r)
        })
    }

    render() {
        const { info, dataSource, bondOrderData, otherOrderData, bondTotal, otherTotal, selectObject, handleVisible, handleType,
            codeInputDisabled, codeDisabled, codeName, phone, handleLoading, selectType} = this.state;
        let bondNum = '保证金(' + bondTotal + ')';
        let otherNum = '其他('+ otherTotal + ')';

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        const { getFieldProps } = this.props.form;
        //加载更多是否显示
        let showLoadMany = false;
        if (selectType == 1 && bondOrderData && bondOrderData.length < bondTotal)
            showLoadMany = true;
        if (selectType == 2 && otherOrderData && otherOrderData.length < otherTotal)
            showLoadMany = true;


        return (
            <div>
                <Card bordered={false} className="mb10" title={this.handleTitle(info.orderNo)}>
                    <Row span={24}>
                        <Col span={16}>
                            <Row span={24}>
                                <Col span={12}>
                                    <p className={less.fontWeight700}>来款账户： </p>
                                    <p className={less.fontSize18}>{info.inAcctIdName}</p>
                                    <Row span={24}>
                                        <Col span={8}>
                                            <p className={less.marginBottom10}>来款账号：</p>
                                            <p className={less.marginBottom10}>流水号：</p>
                                            <p className={less.marginBottom10}>来款时间：</p>
                                            <p className={less.marginBottom10}>来款银行：</p>
                                        </Col>
                                        <Col span={16}>
                                            <p className={less.marginBottom10}>{info.inAcctId}</p>
                                            <p className={less.marginBottom10}>{info.frontLogNo}</p>
                                            <p className={less.marginBottom10}>{info.acctDate}</p>
                                            <p className={less.marginBottom10}> {info.bankName}</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <p className={[less.fontWeight700,less.marginBottom10].join(' ')} >来款金额（元）：</p>
                                    <p className={[less.fontSize18,less.marginBottom20].join(' ')} > {info.inAmount}</p>
                                    <p className={[less.fontWeight700,less.marginBottom10].join(' ')}>来款附言</p>
                                    <p className={less.fontSize18}>{info.note}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col  span={8}>
                            <p className={[less.fontWeight700,less.marginBottom10].join(' ')}>处理状态</p>
                            <p className={[less.fontSize18,less.marginBottom20].join(' ')}>{info.workOrdersStateStr}</p>
                            <Row span={24}>
                                <Col span={8}>
                                    <p>受理人：</p>
                                    <p>受理时间：</p>
                                </Col>
                                <Col span={16}>
                                    <p> {info.acceptanceUser?info.acceptanceUser:'暂无'}</p>
                                    <p> {info.acceptanceTime?info.acceptanceTime:'暂无'}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                {/*疑似结算单*/}
                <Card  bordered={false} className="mb10" title="疑似结算单">
                    <Tabs
                        defaultActiveKey="1"
                        onChange={this.tabsChange}
                        tabBarExtraContent={
                            <div>
                                <div style={{'float': 'left'}}>
                                    <Input style={{width: "300px"}} placeholder={'结算单号/来款附言/采购商名称/项目部/支付单'} id={'searchInput'} />
                                </div>
                                <div className={less.floatRight}>
                                    <Button type='primary' onClick={this.toSearch} >搜索</Button>
                                    <Button className={less.marginLeft2} type='ghost' onClick={this.toResetSearch} >重置</Button>
                                </div>

                            </div>
                        }>
                        <TabPane tab={bondNum} key={'1'} >
                            {
                                bondOrderData.map((item, index)=>{
                                    return(
                                        <div>
                                            <div className={less.amd_pay + ' ' + (item.payUuids == selectObject.payUuids  ? less.pay_way_click_color : '')} onClick={this.paymentOptionClick.bind(this, item) }>
                                                <Row span={24} className={less.rowClass1}>
                                                    <Col span={12}>
                                                        <Row className={less.nameClass2}>买受人公司名称：</Row>
                                                        <Row className={less.nameClass1}>{item.buyCompanyName}</Row>
                                                        <Row className={[less.nameClass2, less.marginTop20].join(' ') }>竞价单号：</Row>
                                                        <Row  className={less.nameClass1}>{item.sceneNo}</Row>
                                                        <Row className={less.nameClass2}>账户号：{item.userPayAccountNo}</Row>
                                                        <Row className={less.nameClass2}>付款人：{item.payUserName} {item.payUserPhone}</Row>
                                                        <Row className={less.nameClass2}>处置方公司：{item.sellerCompanyName}</Row>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Row className={less.nameClass2}>保证金金额（元）：</Row>
                                                        <Row  className={less.nameClass1}>{item.amount ? item.amount.toFixed(2) : '0.00'}</Row>
                                                        <Row className={less.nameClass2}>附言码：</Row>
                                                        <Row  className={less.nameClass1}>{item.payCode}</Row>
                                                        <Row className={less.nameClass2}>报名编号：{item.settlementNo}</Row>
                                                        <Row className={less.nameClass2}>缴纳时间：{item.payTime}</Row>
                                                        <Row className={less.nameClass2}>竞价开始时间：{item.sceneTime}</Row>
                                                        <Row className={less.nameClass2}>支付单号：{item.payNo}</Row>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Row className={less.nameClass3}>关联：{item.relationCount}次</Row>
                                                        <Row>
                                                            <Button className={less.marginTop10} type={'primary'} onClick={this.getHistory}>查看历史来款</Button>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className={showLoadMany ? less.showClass : less.hideClass} >
                                <a onClick={this.suspectedPayOrder.bind(this, true)} >加载更多...</a>
                            </div>
                            <div className={!showLoadMany ? less.showClass : less.hideClass}>
                                <span>已经到底了...</span>
                            </div>
                        </TabPane>
                        <TabPane tab={otherNum} key={'2'}>
                            {
                                otherOrderData.map((item, index)=>{
                                    return(
                                        <div>
                                            <div className={less.amd_pay + ' ' + (item.payUuids == selectObject.payUuids  ? less.pay_way_click_color : '')} onClick={this.paymentOptionClick.bind(this, item) }>
                                                <Row span={24} className={less.rowClass1}>
                                                    <Col span={12}>
                                                        <Row>买受人公司名称：</Row>
                                                        <Row>{item.buyCompanyName}</Row>
                                                        <Row>业务类型：</Row>
                                                        <Row>{item.typeStr}</Row>
                                                        <Row>打款账户号：{item.userPayAccountNo}<spa>（用户打款时自己输入的）</spa></Row>
                                                        <Row>付款人：{item.payUserName} {item.payUserPhone}</Row>
                                                        <Row>处置方公司：{item.sellerCompanyName}</Row>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Row>支付金额（元）：</Row>
                                                        <Row>{item.amount ? item.amount.toFixed(2) : '0.00'}</Row>
                                                        <Row>附言码：</Row>
                                                        <Row>{item.payCode}</Row>
                                                        <Row>结算单号：{item.settlementNo}</Row>
                                                        <Row>付款时间：{item.payTime}</Row>
                                                        <Row>订单编号：{item.orderNo}</Row>
                                                        <Row>支付单号：{item.payNo}</Row>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Row>关联：{item.relationCount}次</Row>
                                                        <Row>
                                                            <Button type={'primary'} >查看历史来款</Button>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className={showLoadMany ? less.showClass : less.hideClass} >
                                <a onClick={this.suspectedPayOrder.bind(this, true)} >加载更多...</a>
                            </div>
                            <div className={!showLoadMany ? less.showClass : less.hideClass}>
                                <span>已经到底了...</span>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>

                {/*操作日志*/}
                <Card  bordered={false} className="mb10" title="操作日志">
                    <Table
                        dataSource={dataSource}
                        columns={this.columns}
                        loading={false}
                        scroll={{ x: 1500 }}
                    />
                </Card>

                {/*详细信息*/}
                <Card  bordered={false} className="mb10" title="详细信息">
                    <Row span={24}>
                        <Col span={8}>
                            <Row span={24} className={less.marginBottom10} >
                                <Col span={8}>受理人：</Col>
                                <Col span={16}>{info.acceptanceUser}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>受理时间：</Col>
                                <Col span={16}>{info.acceptanceTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}></Col>
                                <Col span={16}></Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>处理时间：</Col>
                                <Col span={16}>{info.handleTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>处理结果：</Col>
                                <Col span={16}>{info.typeStr}</Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>业务类型：</Col>
                                <Col span={16}>{info.businessTypeStr}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>业务单号：</Col>
                                <Col span={16}>{info.businessNo}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}></Col>
                                <Col span={16}></Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>附件：</Col>
                                <Col span={16}>{info.fileName}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>处理说明：</Col>
                                <Col span={16}>{info.refundRemak}</Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>复核人：</Col>
                                <Col span={16}>{info.complexUser}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>复核时间：</Col>
                                <Col span={16}>{info.complexTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>审批结果：</Col>
                                <Col span={16}>{info.checkStatusStr}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>完成时间：</Col>
                                <Col span={16}>{info.finishTime}</Col>
                            </Row>
                            <Row span={24} className={less.marginBottom10}>
                                <Col span={8}>复核说明：</Col>
                                <Col span={16}>{info.remak}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>

                {/*底部按钮展示*/}
                <BaseAffix>
                    <Button style={{ marginRight: "10px" }} onClick={this.handleButtonClick.bind(this, 1)}>退款</Button>
                    <Button style={{ marginRight: "10px" }} >关闭</Button>
                    <Popconfirm title={'确认释放？'} onConfirm={this.toSFWorks}>
                        <Button type="primary">释放</Button>
                    </Popconfirm>
                    <Button className={less.marginLeft10} type="primary" style={{ marginRight: "10px" }}  onClick={this.handleButtonClick.bind(this, 2)}>匹配</Button>
                </BaseAffix>

                {/*处理弹窗*/}
                <Modal
                    title='挂账处理确认'
                    visible={handleVisible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button loading={handleLoading} type={'ghost'} onClick={this.handleCancel}>关闭</Button>,
                        <Button loading={handleLoading} type={'primary'} onClick={this.handleOk}>确定</Button>
                    ]}
                >
                    <Row span={24}>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"来款账户名"}
                            >
                                {info.inAcctIdName}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"来款账户号"}
                            >
                                {info.inAcctId}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"付款人企业名称"}
                            >
                                {selectObject.buyCompanyName}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"业务类型"}
                            >
                                {selectObject.typeStr}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"来款金额"}
                            >
                                {selectObject.amount}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"处理方式"}
                            >
                                {handleType == 1 ? '退款' : '清分'}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"附件"}
                            >
                                <Upload
                                    fileList={this.state.fileList}
                                    {...getFieldProps(`qfFile`, {
                                        ...ComponentDefine.upload_.uploadForm,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请上传附件"
                                            }
                                        ]
                                    })}
                                    {...this.uploadPropsMultiple}
                                >
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"说明"}
                            >
                                <BaseInput
                                    type="textarea"
                                    rows={3}
                                    maxLength={200}
                                    {...getFieldProps(`remark`, {
                                        rules: [
                                            { required: true, message: "请输入说明" },
                                        ]
                                    })}
                                />
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label={"手机验证码"}
                            >
                                <Input
                                    placeholder={phone}
                                    maxLength={4}
                                    className={less.width210}
                                    disabled={codeInputDisabled}
                                    {...getFieldProps(`verCode`, {
                                        rules: [
                                            { required: true, message: "请输入验证码" },
                                            { pattern: /^\d{4}$/, message: "请输入验证码" }
                                        ]
                                    })}
                                />
                                <Button type="primary" onClick={this.getCode} disabled={codeDisabled} className={less.marginLeft5}>
                                    {codeName}
                                </Button>
                            </FormItem>
                        </Row>
                    </Row>
                </Modal>
            </div>
        )
    }


}
export default Form.create()(XhFinanceHangDetail);