import {Select,Card,Form,Row,Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,message,Modal,DatePicker,Tabs,Checkbox,Pagination,Popconfirm,Switch,Spin} from 'antd';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import noDataList from '@/static/iconfont/noDataList.png';
import {exportFile} from "@/utils/urlUtils";
import api from "@/framework/axios";
import less from './index.less';
import './contractTemplate.css';
import {getUrlByParam} from '@/utils/urlUtils';
import ContractTemplateModal from './contractTemplateModal'

const TabPane = Tabs.TabPane;

class contractTemplate extends React.Component{
    state = {
        loading: false,
        tableState1: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState2: 0,
        tableState3: 0,

        dataSourceList:[],

        updateContractTemplateModalVisible:false,
        id:'',
    }
    activeTab = '1';//当前激活的tab
    searchCriteriaParams={};//搜索条件
    _isMounted = false;
    importantFilter = ['contractName', 'createTime'];
    formList = [
        {
            type: 'INPUT',
            field: 'contractName',
            label: '合同名称',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'contractCode',
            label: '合同编号',
            placeholder: '请输入'
        },
        {
            type: 'RANGE',
            field: 'createTime',
            label: '合同生成时间',
            placeholder: '请筛选时间段'
        },
        {
            type: 'RANGE',
            field: 'effectiveTime',
            label: '生效时间',
            placeholder: '请筛选时间段'
        }
    ]

    //修改
    updateBillingInfo=(id)=>{
        this.setState({
            updateContractTemplateModalVisible:true
            ,id:id
        })
    }

    updateContractTemplateCallback=()=>{
        this.reloadData();
        this.setState({
            updateContractTemplateModalVisible:!this.state.updateContractTemplateModalVisible
        })

    }

    updateContractTemplateModalShow=()=>{
        this.setState({
            updateContractTemplateModalVisible:false
        })
    }

    /**
     *  搜索
     * @param p
     * @param isSend
     */
    handleFilter = (p, isSend = true) => {

        if (p.createTime) {
            p.createStartDate = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD') : '';
            p.createEndDate = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD') : '';
        }else {
            p.createStartDate ="";
            p.createEndDate ="";
        }

        p.createTime=null;

        if (p.effectiveTime) {
            p.effectiveStartDate = p.effectiveTime[0] ? moment(p.effectiveTime[0]).format('YYYY-MM-DD') : '';
            p.effectiveEndDate = p.effectiveTime[1] ? moment(p.effectiveTime[1]).format('YYYY-MM-DD') : '';
        }else {
            p.effectiveStartDate ="";
            p.effectiveEndDate ="";
        }

        p.effectiveTime=null;

        let key = this.activeTab;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
        }
        this.searchCriteriaParams=p;
        this.reloadData();

        if(isSend){
            this.reloadTableData();
        }
    }
    componentWillMount(){
        this.getListContractTemplateEffective();
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    baseParams1 = {
        companyType: 2
    };
    baseParams2 = {
        companyType: 1
    };
    baseParams3 = {};

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



    handleChangeTab = (key) => {
        this.activeTab = key;
        this.reloadData();
        this.reloadTableData();
    }


    /**
     * 获得入驻合同模板全部列表查询
     *
     * @returns
     */
    getPlatformAccountInformation = (p) => {
        let that = this;
        let conversionOfContractTypes = 1;
        api.ajax('GET', '!!/common/contractTemplate/listContractTemplateWhole',{
            conversionOfContractTypes, ...p
        }).then((r)=>{
            if (r) {
                that.setState({
                    dataSourceList: r.data
                })
            } else {
                message.error("操作失败!!");
            }

        })
    };

    /**
     * 获得入驻合同模板作废列表查询
     *
     * @returns
     */
    getListContractTemplateToVoid = (p) => {
        let that = this;
        let conversionOfContractTypes = 1;
        api.ajax('GET', '!!/common/contractTemplate/listContractTemplateToVoid',{
            conversionOfContractTypes, ...p
        }).then((r)=>{
            if (r) {
                that.setState({
                    dataSourceList: r.data
                },()=>{
                    console.log("that.state.dataSourceList====================");
                    console.log(that.state.dataSourceList);
                })
            } else {
                message.error("操作失败!!");
            }

        })
    };

    /**
     * 获得入驻合同模板有效列表查询
     *
     * @returns
     */
    getListContractTemplateEffective = (p) => {
        let that = this;
        let conversionOfContractTypes = 1;
        api.ajax('GET', '!!/common/contractTemplate/listContractTemplateEffective',{
            conversionOfContractTypes, ...p
        }).then((r)=>{
            if (r) {
                that.setState({
                    dataSourceList: r.data
                })
            } else {
                message.error("操作失败!!");
            }

        })
    };

    /**
     * 获取入驻合同模板实时数据
     * @param id 开票id
     * @returns
     */
    getCurrentBean=(id)=>{

        var obj = new Promise(function(resolve, reject){
            api.ajax('GET', '!!/common/contractTemplate/listContractTemplate',{
                id
            }).then(r => {
                resolve(r.data[0]);
            })
        });

        return obj;
    }

    /**
     * 重新加载数据
     * @returns
     */
    reloadData=()=>{
        let p = this.searchCriteriaParams;
        let key = this.activeTab;
        if (key == 1) {
            this.getListContractTemplateEffective(p);
        } else if (key == 2) {
            this.getListContractTemplateToVoid(p);
        } else if (key == 3) {
            this.getPlatformAccountInformation(p);
        }
    }

    /**
     * 入驻合同模板对应作废
     *
     * @returns
     */
    updateContractTemplateToVoid=(id)=>{
        let that = this;

        this.getCurrentBean(id).then(function(data){
            //判断是否已删除
            if (null != data && data.delFlag == 0 ) {
                if (data.conState != 3 ) {
                    that.setState({
                        updateContractTemplateModalVisible:true
                        ,id:id
                    })
                } else {
                    message.error('此模板已经作废');
                    //重新加载数据
                    that.reloadData();
                    return;
                }
            } else {
                message.error('此模板已经删除');
                //重新加载数据
                that.reloadData();
                return;
            }

        });
    }

    colLabel=(item)=> {
        let blHtml = "";
        if ( item.conState == 2 ) {
            blHtml = (
                <span className={less.yishengxiao}>已生效</span>
            );
        } else if ( item.conState == 0 ){
            blHtml = (
                <span className={less.daishengxiao}>待生效</span>
            );
        } else if ( item.conState == 1 ){
            blHtml = (
                <span className={less.daishengxiao}>预签期</span>
            );
        } else {
            blHtml = (
                <span className={less.yidaoqi}>已到期</span>
            );
        }
        let a = [<Col className={less.zuiwaicol} span={11} key={item.id}>
            <div className={less.yidiv}>
                <p className={less.woshihetongp} title={item.contractTitle+item.contractName+item.contractVersion}>{item.contractTitle}{item.contractName}{item.contractVersion}</p>
                <p className={less.hetongbianhaop}>合同编号：{item.contractCode}</p>
                    < Icon type="download"   target="_blank" className="erer"
                       onClick={()=>{
                           let params = {
                               filePath : item.contractTemplatePath
                           }
                           exportFile("/common/upload/exportFastdfsFile",params);
                       }}
                    ><div>下载</div></Icon>

            </div>
            <Card bordered={false} className={less.ieiei}>
                <Row className={less.chuangjianrow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>创建日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.createTime).format("YYYY-MM-DD")}</span></p>
                    </Col>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>创建人：</span><span
                            className={less.erduowenzivalue}>{item.founderUserName}</span></p>
                    </Col>
                </Row>
                <Row className={less.chuangjianrow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>生效日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.effectiveTime).format("YYYY-MM-DD")}</span>
                        </p>
                    </Col>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>联系电话：</span><span
                            className={less.erduowenzivalue}>{item.founderPhone}</span></p>
                    </Col>
                </Row>
                <Row className={less.chuangjianrow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>截止日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.endTime).format("YYYY-MM-DD")}</span></p>
                    </Col>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>可签订日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.signTime).format("YYYY-MM-DD")}<span style={{marginLeft:"8px"}}>{item.signInXDaysJust}天后可签</span></span></p>
                    </Col>
                </Row>
                <Row className={less.chuangjianrow}>
                    <Col span={24}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>协议类型：</span><span
                            className={less.erduowenzivalue}>{item.contractClassStr}</span></p>
                    </Col>
                </Row>
                <Row className={less.hetongzhuangtairow}>
                    <Col span={24}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>合同状态：</span>
                            {blHtml}
                        </p>
                    </Col>
                </Row>
                <Row className={less.zuofeichakanrow}>
                    <Col className={less.zuofeicol} span={12}>
                        <Popconfirm title="是否作废?" onConfirm={this.updateContractTemplateToVoid.bind(this,item.id)}><a className={less.chakanp}>作废</a></Popconfirm>
                    </Col>
                    <Col className={less.erere} span={12}>
                        <a target="_blank" className={less.chakanp} href={SystemConfig.systemConfigPath.dfsPathUrl(item.contractTemplatePathStr)} >查看</a>
                    </Col>
                </Row>
            </Card>
        </Col>
        ]
        return a;
    }

    colLabelToVoid=(item)=> {
        let a = [<Col className={less.zuiwaicol} span={11} key={item.id}>
            <div className={less.yidiv}>
                <p className={less.woshihetongp} title={item.contractTitle+item.contractName+item.contractVersion}>{item.contractTitle}{item.contractName}{item.contractVersion}</p>
                <p className={less.hetongbianhaop}>合同编号：{item.contractCode}</p>
            </div>
            <Card bordered={false} className={less.ieiei}>
                <Row className={less.chuangjianrow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>创建日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.createTime).format("YYYY-MM-DD")}</span></p>
                    </Col>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>创建人：</span><span
                            className={less.erduowenzivalue}>{item.founderUserName}</span></p>
                    </Col>
                </Row>
                <Row className={less.chuangjianrow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>生效日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.effectiveTime).format("YYYY-MM-DD")}</span>
                        </p>
                    </Col>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>联系电话：</span><span
                            className={less.erduowenzivalue}>{item.founderPhone}</span></p>
                    </Col>
                </Row>
                <Row className={less.chuangjianrow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>截止日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.endTime).format("YYYY-MM-DD")}</span></p>
                    </Col>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>废止操作人：</span><span
                            className={less.erduowenzivalue}>{item.abolishOperatorUserName}</span></p>
                    </Col>
                </Row>
                <Row className={less.chuangjianrow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>废止日期：</span><span
                            className={less.erduowenzivalue}>{moment(item.updateTime).format("YYYY-MM-DD")}</span></p>
                    </Col>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>联系电话：</span><span
                            className={less.erduowenzivalue}>{item.abolishOperatorPhone}</span></p>
                    </Col>
                </Row>
                <Row className={less.hetongzhuangtairow}>
                    <Col span={12}>
                        <p className={less.erduowenzi}><span className={less.wenziduiqi}>协议类型：</span><span
                            className={less.erduowenzivalue}>{item.contractClassStr}</span></p>
                    </Col>
                </Row>
                <Row className={less.zuofeichakanrow}>
                    <Col className={less.zuofeicol} span={24}>
                        <a className={less.chakanp} onClick={()=>{
                            window.open(SystemConfig.systemConfigPath.dfsPathUrl(getUrlByParam(item.contractTemplatePathStr)))}}>查看</a>
                    </Col>
                </Row>
            </Card>
        </Col>
        ]
        return a;
    }

    d=()=>{
        let a = [],that = this;
        for ( let i = 0; i < this.state.dataSourceList.length; i++ ) {
            a.push(<Row>{
                (function(){
                    let item = that.state.dataSourceList[i];
                    var q = []
                    if ( item.conState == 3 ){
                        q.push(that.colLabelToVoid(item));
                    } else {
                        q.push(that.colLabel(item));
                    }
                    if( i+1 < that.state.dataSourceList.length ){
                        item=that.state.dataSourceList[++i];
                        if ( item.conState == 3 ){
                            q.push(that.colLabelToVoid(item));
                        } else {
                            q.push(that.colLabel(item));
                        }
                    }
                    return q;
                })()
            }
            </Row>)
        }
        return a;
    }


    /**
     * 获取正生效截止日期
     *
     * @returns
     */
    getEffectiveDeadline = () => {
        let that = this;
        let conversionOfContractTypes = 1;
        api.ajax('GET', '!!/common/contractTemplate/listContractTemplateEffectived',{
            conversionOfContractTypes
        }).then((r)=>{
            if (r.data.length>0) {
                that.props.history.push("/contract/addContractTemplate")
            } else {
                message.error("无正生效平台协议!!");
            }

        })
    };

    render(){

        let blHtml = "";
        if (this.state.dataSourceList.length <= 0) {
            blHtml = (
                <Card  bordered={false} tyle={{width:"1692px",height:"355px",background:"rgba(255,255,255,1)"}}>
                    <Row style={{textAlign: "center",padding:"102px 0 127px 0"}}>
                        <img src={noDataList}/>
                        <p style={{marginRight:"53px"}}>暂无此协议</p>
                    </Row>
                </Card>
            );
        } else {
            blHtml = (
                <div style={{width:"1236px"}}>
                    {this.d()}
                </div>
            );
        }
        return(
            <div>
                <Card bordered={false} style={{background:"rgba(240,242,245,1)"}} className="yuyuyuy">
                    <Card bordered={false}  className="erert">
                        <BaseForm
                            formList={this.formList}
                            importantFilter={this.importantFilter}
                            filterSubmit={this.handleFilter}/>
                        <div className="contractTemplatetoolbar">
                            <Button type="primary" onClick={()=>{
                                this.props.history.push("/contract/addContractTemplate")
                            }

                            } style={{marginLeft:"8px"}}>发布次年协议</Button>
                        </div>
                        <div className="tabscla">
                            <Tabs defaultActiveKey="1"
                                  onChange={this.handleChangeTab}>
                                <TabPane tab="有效" key="1">
                                </TabPane>
                                <TabPane tab="作废" key="2">
                                </TabPane>
                                <TabPane tab="全部" key="3">
                                </TabPane>
                            </Tabs>
                        </div>
                    </Card>
                    <Card bordered={false} style={{background:"rgba(240,242,245,1)"}}>
                        {blHtml}
                    </Card>
                </Card>
                <ContractTemplateModal
                    visble={this.state.updateContractTemplateModalVisible}
                    id={this.state.id}
                    onClose={this.updateContractTemplateModalShow}
                    callback={this.updateContractTemplateCallback}
                />
            </div>
        )
    }
}
export default contractTemplate