import {Card, Button, Modal, Tabs, Alert,Input, Radio,Form,Row, Col, Select} from 'antd';
import api from '@/framework/axios';
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import Album from 'uxcore-album';
import less from './index.less';
import '@/style/reset_antd.css';
import noAuditImg from './img/noAudit.png';
import auditedImg from './img/audited.png';
import workAuditedImg from './img/workAudited.png';
import monthAuditedImg from './img/monthAudited.png';
import Util from "@/utils/util";

const { Photo } = Album;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class auditAppeal extends React.Component {
    state = {
        loading: false,
        tableState1: 0,
        tableState2: 0,
        tableState3: 0,
        tableState4: 0,
        totalSupplierQuantity: 0,
        allNum: 0,//全部数量
        waitAcceptNum: 0,//待受理数量
        waitDealNum: 0,//待处理数量
        toDealNum: 0,//已处理数量

        visible: false,
        haveSelection: true,//列表中是否展示复选框
        modalContent: {},
        dealReason:'',
		showReturnReason:false,
		deal:false
    }

    _isMounted = false;
    activeTab = 1;

    importantFilter = ['companyName', 'userName']

    formList = () => [
        {
            type: 'INPUT',
            field: 'companyName',
            label: '企业名称',
            placeholder: '请输入企业名称',
        },
        {
            type: 'INPUT',
            field: 'userName',
            label: '申诉人',
            placeholder: '请输入申诉人',
        },
        {
            type: 'INPUT',
            field: 'phone',
            label: '手机号',
            placeholder: '请输入手机号',
        },
        {
            type: 'INPUT',
            field: 'cardNum',
            label: '证件号',
            placeholder: '请输入证件号',
        }
    ]

    handleFilter = (p, isSend = true) => {

        let createTimeStartStr, createTimeEndStr, updateTimeTimeStartStr, updateTimeEndStr, dealTimeStartStr,
            dealTimeEndStr
        if (p.createTime) {
            createTimeStartStr = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            createTimeEndStr = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            p.createTime = null;
        }

        if (p.updateTime) {
            updateTimeTimeStartStr = p.updateTime[0] ? moment(p.updateTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            updateTimeEndStr = p.updateTime[1] ? moment(p.updateTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            p.updateTime = null;
        }

        if (p.dealTime) {
            dealTimeStartStr = p.dealTime[0] ? moment(p.dealTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            dealTimeEndStr = p.dealTime[1] ? moment(p.dealTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            p.dealTime = null;
        }

        let key = this.activeTab;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
            createTimeStartStr,
            createTimeEndStr,
            updateTimeTimeStartStr,
            updateTimeEndStr,
            dealTimeStartStr,
            dealTimeEndStr
        }
        if (isSend) {
            this.reloadTableData();
        }
    }

    componentDidMount() {
    }

    componentWillMount() {
        this._isMounted = true;
        this.getStatisticNum();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    baseParams1 = {

    }
    baseParams2 = {
        dealStatus: 0
    }
    baseParams3 = {
        dealStatus: 1
    }
    baseParams4 = {
        dealStatus: 2
    }

    getStatisticNum = () => {
        api.ajax('GET', '@/supplier/appeal/getNum').then(r => {
            if (!this._isMounted) {
                return;
            }
            if (r.code == "200" || r.code == 200) {
                this.setState({
                    allNum: r.data.allNum,//全部数量
                    waitAcceptNum: r.data.waitAcceptNum,//待受理数量
                    waitDealNum: r.data.waitDealNum,//待处理数量
                    toDealNum: r.data.toDealNum//已处理数量
                });
            }
        })
    }

    columns = (params) => {
        return [{
            title: '企业名称',
            dataIndex: 'companyName',
            key: 'companyName',
            witdh: 120
        },
            {
                title: '申请人姓名',
                dataIndex: 'userName',
                key: 'userName',
                witdh: 120
            },
            {
                title: '申请人手机号',
                dataIndex: 'phone',
                key: 'phone',
                witdh: 120
            },
            {
                title: '现用电子邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 120,
            },
            {
                title: '申请时间',
                dataIndex: 'createTime',
                key: 'createTime',
                witdh: 160,
                sorter: true,
                render: (text) => {
                    return moment(text).format("YYYY-MM-DD HH:mm:ss")
                }
            },
            {
                title: '状态',
                dataIndex: 'dealStatus',
                key: 'dealStatus',
                witdh: 90,
                render: (text, record) => {
                    if (text == 0 || text == "0") {
                        return <span style={{color: '#E96C47'}}>待受理</span>;
                    } else if (text == 1 || text == "1") {
                        return <span style={{color: '#4CD91F'}}>待处理</span>;
                    } else if (text == 2 || text == "2") {
                        return <span style={{color: '#DD2F26'}}>已处理</span>;
                    }
                }
            },
            {
                title: '受理人',
                dataIndex: 'updateUser',
                key: 'updateUser',
                witdh: 120,
                render: (text, record) => {
                    if (text) {
                        return text;
                    } else {
                        return "-";
                    }
                }
            },
            {
                title: '受理时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                witdh: 160,
                sorter: true,
                render: (text, record) => {
                    if (text) {
                        return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        // return text.substr(0,10);
                    } else {
                        return "-";
                    }
                }
            },
            {
                title: '处理人',
                dataIndex: 'dealUserName',
                key: 'dealUserName',
                witdh: 120,
                render: (text, record) => {
                    if (text) {
                        return text;
                    } else {
                        return "-";
                    }
                }
            },
            {
                title: '处理时间',
                dataIndex: 'dealTime',
                key: 'dealTime',
                witdh: 160,
                sorter: true,
                render: (text, record) => {
                    if (text) {
                        return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        // return text.substr(0,10);
                    } else {
                        return "-";
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'x',
                witdh: 80,
                key: 'x',
                render: (text, record) => {
                    if (record.dealStatus == "0" || record.dealStatus == 0) {
                        return (
                          <span>
                              <a type="primary" onClick={() => this.handleToDetails(record)}>查看</a>
                              <span className="ant-divider"></span>
                              <a type="primary" onClick={() => this.handleToUpdate(record)}>受理</a>
                          </span>
                        )
                    } else if (record.dealStatus == "1" || record.dealStatus == 1){
                        return (
                            <span>
                              <a type="primary" onClick={() => this.handleToDetails(record)}>查看</a>
                              <span className="ant-divider"></span>
                              <a type="primary" onClick={() => this.handleToUpdate(record)}>处理</a>
                          </span>
                        )
                    } else {
                        return (
                            <span>
                              <a type="primary" onClick={() => this.handleToDetails(record)}>查看</a>
                          </span>
                        )
                    }
                }
            }
        ]
    }
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
        let key = this.activeTab;
        this.handelToLoadTable(state, 'tableState' + key);
    }


    //受理
    handleToUpdate = (obj) => {
		this.setState({
			visible: true,
			deal:true,
			modalContent: obj
		})
    }

    //查看
    handleToDetails = (obj) => {
		this.setState({
			visible: true,
			deal:false,
			modalContent: obj
		})
    }


    handleChangeTab = (key) => {
        this.activeTab = key;
        this.reloadTableData();
    }

    handleOff = () => {
        this.setState({
            visible: false,
        })
    }
    handleOk = () => {
        this.setState({
            visible: false
        })
    }
	handleSubmit = () => {
		this.props.form.validateFieldsAndScroll((errors, values) => {
		  if (!!errors) {
		    return;
		  }
		  let uuids = this.state.modalContent.uuids;
		  let params = {
		    uuids,
		    ...values
		  }
		  this.carryOnSubmit(params)
		})
    }
	
	//确认提交
	carryOnSubmit = (params) => {
		if (this.state.modalContent.dealStatus == 0) {
			api.ajax('post', '@/supplier/appeal/changeApprovalState',
				{...params}
			).then(r => {
				if (r.code == "200" || r.code == 200) {
					this.setState({
						visible: false
					})
					this.reloadTableData();
				}
			}).catch(r => {
				Util.alert(r.msg, {type: 'error'})
			})
		} else if(this.state.modalContent.dealStatus == 1) {
		    api.ajax('post', '@/supplier/appeal/changeDealState',
		    	{...params}
		    ).then(r => {
		    	if (r.code == "200" || r.code == 200) {
		    		this.setState({
		    			visible: false
		    		})
					this.reloadTableData();
		    	}
		    }).catch(r => {
		    	Util.alert(r.msg, {type: 'error'})
		    })
		}else{
			this.setState({
			    visible: false
			})
		}
	}
	
    renderTongJi = () => {

        return (<div className={less.tongji}>
            <div className={less.box} style={{width: '24%', marginRight: '1%'}}>
                <div className={less.tonjiIcon}><img src={noAuditImg}/></div>
                <div className={less.tonjitxt}>
                    <p><span>全部</span><a>查看报表</a></p>
                    <p><span className={less.number}>{this.state.allNum}任务</span></p>
                </div>
            </div>
            <div className={less.box} style={{width: '24%', marginRight: '1%'}}>
                <div className={less.tonjiIcon}><img src={auditedImg}/></div>
                <div className={less.tonjitxt}>
                    <p><span>待受理</span><a>查看报表</a></p>
                    <p><span className={less.number}>{this.state.waitAcceptNum}任务</span></p>
                </div>
            </div>
            <div className={less.box} style={{width: '24%', marginRight: '1%'}}>
                <div className={less.tonjiIcon}><img src={workAuditedImg}/></div>
                <div className={less.tonjitxt}>
                    <p><span>待处理</span><a>查看报表</a></p>
                    <p><span className={less.number}>{this.state.waitDealNum}任务</span></p>
                </div>
            </div>
            <div className={less.box} style={{width: '24%', marginRight: '1%'}}>
                <div className={less.tonjiIcon}><img src={monthAuditedImg}/></div>
                <div className={less.tonjitxt}>
                    <p><span>已处理</span><a>查看报表</a></p>
                    <p><span className={less.number}>{this.state.toDealNum}任务</span></p>
                </div>
            </div>
        </div>);
    }

	handleAuditChange=(e)=>{
		if(1==e.target.value){
			this.setState({
			    showReturnReason: false
			})
		}else{
			this.setState({
			    showReturnReason: true
			})
		}
	}
	
	handleShowImg = (url) => {
	
	  if (url.length == 0) {
	    Util.alert('暂无图片')
	    return;
	  }
	  let baseUrl = SystemConfig.configs.resourceUrl;
	
	  Album.show({ photos: [
	      <Photo
	          src={baseUrl + url}
	          key={0}
	      />,
	    ],showButton:true});
	}
	
	
    render() {
		const { getFieldProps } = this.props.form;
		
		const formItemLayout = {
		  labelCol: { span: 6 },
		  wrapperCol: { span: 18 }
		}
        return (
            <div className={"abc"}>
                <Card bordered={false}
                      className={[less.tongjiCard, "tongjiCard"].join(' ')}>{this.renderTongJi()}</Card>
                <Card bordered={false}>
                    <BaseForm
                        formList={this.formList()}
                        importantFilter={this.importantFilter}
                        filterSubmit={this.handleFilter}
                    ></BaseForm>
                    <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
                        <TabPane tab="全部" key="1">
                            <BaseTable
                                url='@/supplier/appeal/page'
                                tableState={this.state.tableState1}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState1')
                                }}
                                baseParams={this.baseParams1}
                                columns={this.columns("paramsOne")}/>
                        </TabPane>
                        <TabPane tab="待受理" key="2">
                            <BaseTable
                                url='@/supplier/appeal/page'
                                tableState={this.state.tableState2}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState2')
                                }}
                                baseParams={this.baseParams2}
                                columns={this.columns("paramsTwo")}/>
                        </TabPane>
                        <TabPane tab="待处理" key="3">
                            <BaseTable
                                url='@/supplier/appeal/page'
                                tableState={this.state.tableState3}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState3')
                                }}
                                baseParams={this.baseParams3}
                                columns={this.columns("paramsThree")}/>
                        </TabPane>
                        <TabPane tab="已处理" key="4">
                            <BaseTable
                                url='@/supplier/appeal/page'
                                tableState={this.state.tableState4}
                                resetTable={(state) => {
                                    this.resetTable(state, 'tableState4')
                                }}
                                baseParams={this.baseParams4}
                                columns={this.columns("paramsThree")}/>
                        </TabPane>
                    </Tabs>
                </Card>
                <Modal title={`申诉被占用`} visible={this.state.visible}
                       width={800}
                       onCancel={this.handleOk}
                       footer={this.state.deal == true ? [
                           <Button key="realod" onClick={this.handleOff}>
                               关闭
                           </Button>,
						   <Button key="accept" type="primary" onClick={this.handleSubmit}>
                               确定
                           </Button>
                       ]:[
                           <Button key="realod" onClick={this.handleOff}>
                               关闭
                           </Button>
                       ]}
                >
					<Card className={less.kapian} title={<div className={less.xiugaibt}>申诉帐号信息</div>} bordered={false}>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>申诉单位名称：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.companyName?this.state.modalContent.companyName:"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>申诉人姓名：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.userName?this.state.modalContent.userName:"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>邮箱：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.email?this.state.modalContent.email:"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>手机号：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.phone?this.state.modalContent.phone:"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>证件号码：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.cardNum?this.state.modalContent.cardNum:"-"}<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.modalContent.cardFrontEcUploadUuids]))}>点击查看影像</a></p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>申诉时间：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.createTime?moment(this.state.modalContent.createTime).format("YYYY-MM-DD HH:mm:ss"):"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>申诉理由：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.appealReason?this.state.modalContent.appealReason:"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>申诉资料：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.appealProofEcUploadUuids ? <a style={{marginLeft:"40px"}} href={SystemConfig.configs.resourceUrl + this.state.modalContent.appealProofEcUploadUuids}
								    target="_blank" download="申诉资料">下载</a> : '-'}</p>
							</div>
					</Card>
					<Card className={less.kapian} title={<div className={less.xiugaibt}>处理记录</div>} bordered={false}>
						<div className={less.ceshi}>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>受理人：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.updateUser?this.state.modalContent.updateUser:"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>受理时间：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.updateTime?moment(this.state.modalContent.updateTime).format("YYYY-MM-DD HH:mm:ss"):"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>受理意见：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.approvalReason?this.state.modalContent.approvalReason:"-"}</p>
							</div>
						    <div className={less.lab_flex}>
								<p className={less.lab_flex_title}>处理人：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.dealUserName?this.state.modalContent.dealUserName:"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>处理时间：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.dealTime?moment(this.state.modalContent.dealTime).format("YYYY-MM-DD HH:mm:ss"):"-"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>处理结果：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.approvalStatus==1?"申诉通过":this.state.modalContent.approvalStatus==2?"申诉驳回":"待处理"}</p>
							</div>
							<div className={less.lab_flex}>
								<p className={less.lab_flex_title}>处理意见：</p>
								<p className={less.lab_flex_cont}>{this.state.modalContent.dealReason?this.state.modalContent.dealReason:"-"}</p>
							</div>
						</div>
					</Card>
                    <Card className={less.kapian} title={<div className={less.xiugaibt}>备忘录</div>} bordered={false}>
						{
							this.state.modalContent.dealStatus == 0 && this.state.deal?
								// 待受理
								<div>
									<Input type="textarea" maxLength='1000' defaultValue={this.state.modalContent.dealReason}
										rows={5} {...getFieldProps('approvalReason')} placeholder="请输入备注..."
									/>
								</div>:
							this.state.modalContent.dealStatus == 1 && this.state.deal?
								// 待处理
								<div>
									<Col>
										<FormItem label="处理结果" {...this.formItemLayout}>
											<RadioGroup
											{...getFieldProps('approvalStatus',
												{
												initialValue: '1',
												rules: [
													{
													message: "请审核"
													}
												],
						                        onChange: (e) => (this.handleAuditChange(e))
												})}>
											<Radio value="1">申诉通过</Radio>
											<Radio value="2">申诉驳回</Radio>
											</RadioGroup>
										
											<Select {...getFieldProps("factoryType")} placeholder="请选择" style={{ width: "20%",display:this.state.showReturnReason?"inline-block":"none"}}>
												<Option value="1">证明材料不足</Option>
												<Option value="2">账号信息不匹配</Option>
											</Select>
										</FormItem>
									</Col>
						
									<Input type="textarea" maxLength='1000'
										rows={5} {...getFieldProps('dealReason')} placeholder="请输入备注..."
									/>
								</div>:
								// 已处理(只展示备忘录文案)
							<div><p>{this.state.modalContent.approvalReason}</p></div>
						}
					</Card>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(auditAppeal)
