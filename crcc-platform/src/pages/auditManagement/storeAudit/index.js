import {Alert, Button, Card, Checkbox, Modal, Tabs} from "antd";

import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import AuthButton from '@/components/authButton';
import Util from "@/utils/util";
import less from './index.less'
import api from "@/framework/axios";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig'
import {getUrlByParam} from '@/utils/urlUtils';

const confirm = Modal.confirm;
const imageOrigin = SystemConfig.configs.resourceUrl;
const TabPane = Tabs.TabPane
export default class storeAudit extends React.Component {

    _isMounted = false; //该组件是否被挂载，用于取消ajax请求的执行
    _userInfo = null;
    activeTab = "1"
    state = {
        loading: false,

        tableState1: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState2: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState3: 0,//tableState3//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState4: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        // modal
        visible: false,
        selectedItems:[],//存储被选中的列表项
        haveSelection:false,//列表中是否展示复选框
        modalContent: {}
    }


    renderFormList = () => {
        return [
            {
                type: 'RANGE',
                field: 'times',
                label: '申请时间',
                placeholder: '请选择筛选时间段'
            },
            {
                type: 'INPUT',
                field: 'name',
                label: '公司名称',
                placeholder: '请输入公司名称',
                maxLength:50
            }
        ]
    }


    //高级查询
    importantFilter = ['times', 'name']


    componentWillMount() {
        this._isMounted = true;

        this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
            if (this._userInfo || !obj) { return false }
            this._userInfo = obj;
            // 获得用户基本信息后执行加载回调
            this.initDataFn();
        }.bind(this));//
        PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
    }

    componentWillUnmount() {
        this._isMounted = false;
        PubSub.unsubscribe(this.pubsub_userInfo);
    }

    //初始化
    initDataFn = () => {
        this.baseParams1 = {
            ...this.baseParams1
        }
        this.baseParams2 = {
            ...this.baseParams2
        }
        this.baseParams3 = {
            ...this.baseParams3
        }
        this.baseParams4 = {
            ...this.baseParams4
        }
        // 进入页面加载数据
        this.handelToLoadTable(1, 'tableState1');
    }



    //表单过滤和更新列表数据
    handleFilter = (params, isSend = true) => {
        let key = this.activeTab;
        //根据formList生成的表单输入条件过滤

        let updateTimeStart, updateTimeEnd;
        if (params.times) {
            updateTimeStart = params.times[0] ? moment(params.times[0]).format('YYYY-MM-DD') : '';
            updateTimeEnd = params.times[1] ? moment(params.times[1]).format('YYYY-MM-DD') : '';
            params.times = null;
        }

        key = 1;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            updateTimeStart,
            updateTimeEnd
        }
        key = 2;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            updateTimeStart,
            updateTimeEnd
        }
        key = 3;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            updateTimeStart,
            updateTimeEnd
        }
        key = 4;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            updateTimeStart,
            updateTimeEnd
        }

        if (isSend) {
            this.reloadTableData();
        }
    }

    //切换tab页时
    handleTabChange = (key) => {
        this.activeTab = key;
        this.reloadTableData();
       /* this.setState({
            reloadTimes: ++this.state.reloadTimes
        })*/
    }


    handleOk = () => {
        this.setState({
            visible: false
        })
    }


    //商品编辑
    handleToEdit = (uuids) => {
        let params = {};
        params.uuids = uuids;
        window.open(systemConfigPath.jumpPage(getUrlByParam("/goodsManagement/goodsReleased/edit",params)));
    }


    //设置被选中的列表项
    setSelectedItems = (items) =>{
        this.state.selectedItems = items;
    }
    //根据url请求,同步页面组件
    syncIndexCompent = ()=>{
        //清空被选中的列表项
        let {haveSelection,selectedItems} = this.state
        if(haveSelection && selectedItems && selectedItems.length>0){
            this.state.selectedItems = [];
        }
    }

    /*****
     *
     * baseTable组件的相关方法
     *
     * 1.baseParams //表格参数，默认可以没有
     * 2.handelToLoadTable //
     * 3.resetTable //
     * 4.columns //表头数据
     *
     * *****/
    baseParams1 = {
        status:1 //待审核
    }

    baseParams2 = {
        status: 2 //已通过
    }
    baseParams3 = {
        status: 3 //驳回
    }
    //全部
    baseParams4 = {
        // 'statusArr[0]':1,
        // 'statusArr[1]':2,
        // 'statusArr[2]':3,
        // 'statusArr[3]':4 //已过期
        status: -2 //全部
    }

    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }

    //
    handleToPreview=(id)=>{
        let url = "/portal/"+id+"/homeStore";
        window.open(window.location.href.split('#/')[0]+'#' + url);
    }
    reloadTableData(state = 1) {
        let key = this.activeTab;
        if (this._userInfo) {
            this.handelToLoadTable(state, 'tableState' + key);
        }
    }

    toAudit=(uuids)=>{
        api.ajax("GET", "@/portal/ecPortal/checkAuditPortalByUuids", {
            uuids:uuids
        }).then(r => {
            if (!this._isMounted) { return }

            this.handleToAudit(uuids);
        }).catch(r => {

            if(r.code=="90038"){//没有需要审核的portal
                Util.alert(r.msg)
            }else if(r.code=="90040"){//portal正在审核中,系统为您分配其它待审portal
                Util.alert(r.msg, {callback:this.waitTimeHandleToAudit(uuids)})
            }else{
                Util.alert(r.msg, { type: "error" })
            }
        })
    }

    waitTimeHandleToAudit = (uuids)=>{
        setTimeout(()=>{
            this.handleToAudit(uuids)
        },2000)
    }

    handleToAudit = (uuids) => {
        this.props.history.push(this.props.history.location.pathname + '/audit' + '/' + uuids)
    }


    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }


    columns = [{
        title: '发布人',
        dataIndex: 'showUserName',
        key: 'showUserName',
        width: 150
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 150
    }, {
        title: '递交日期',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        width: 170,
        render: (text) => {
            if(text){
                return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }else{
                return (<div>--</div>)
            }
        }
    }, {
        title: '审核日期',
        dataIndex: 'auditTime',
        key: 'auditTime',
        sorter: true,
        width: 170,
        render: (text) => {
            if(text){
                return moment(text).format("YYYY-MM-DD HH:mm:ss")
            }else{
                return (<div>--</div>)
            }
        }
    }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 140
    },{
        title: '发布状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (text, record) => {
            if(record.status==1){//待审核
                return (
                    <span>
                        审核中
                    </span>
                )
            }else if(record.status==3){//发布失败
                return (
                    <span>
                        发布失败
                    </span>
                )
            }else if(record.status==2){//发布中
                return (
                    <span>
                        发布中
                    </span>
                )
            }else if(record.status===4){//已过期
                return (
                    <span>
                        已过期
                    </span>
                )
            }
        }
    }, {
        title: '操作',
        key: 'options',
        width: 120,
        render: (text, record) => {

            if(record.status==1){//待审核
                return (
                    <span>
                        <AuthButton elmType="a" onClick={() => this.toAudit(record.uuids)}>审核</AuthButton>
                        <span className="ant-divider"></span>
                        <AuthButton elmType="a" onClick={() => this.handleToPreview(record.uuids)}>预览</AuthButton>
                    </span>
                )
            }else{
                return (
                    <span>
                        <AuthButton elmType="a" onClick={() => this.handleToPreview(record.uuids)}>预览</AuthButton>
                    </span>
                )
            }
        }
    }]



    render(){
        return(
            <div>
                <BaseForm formList={this.renderFormList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}/>
                <Card bordered={false}>
                    <Tabs className={less.tabs} onTabClick={this.handleTabChange}>
                        <TabPane tab="待审核" key="1" className={less.tabplane} >
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecPortal/page"
                                tableState={this.state.tableState1}
                                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                                baseParams={this.baseParams1}
                                columns={this.columns}
                                haveSelection={this.state.haveSelection}
                                indexkeyWidth={60}
                                setSelectedItems={this.setSelectedItems}
                                syncIndexCompent={this.syncIndexCompent}
                            />
                        </TabPane>
                        <TabPane tab="已通过" key="2" >
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecPortal/page"
                                tableState={this.state.tableState2}
                                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                                baseParams={this.baseParams2}
                                columns={this.columns}
                                haveSelection={false}
                                indexkeyWidth={60}
                                setSelectedItems={this.setSelectedItems}
                                syncIndexCompent={this.syncIndexCompent}
                            />
                        </TabPane>
                        <TabPane tab="已驳回" key="3" >
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecPortal/page"
                                tableState={this.state.tableState3}
                                resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                                baseParams={this.baseParams3}
                                columns={this.columns}
                                haveSelection={false}
                                indexkeyWidth={60}
                                setSelectedItems={this.setSelectedItems}
                                syncIndexCompent={this.syncIndexCompent}
                            />
                        </TabPane>
                        <TabPane tab="全部" key="4" >
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecPortal/page"
                                tableState={this.state.tableState4}
                                resetTable={(state) => { this.resetTable(state, 'tableState4') }}
                                baseParams={this.baseParams4}
                                columns={this.columns}
                                haveSelection={false}
                                indexkeyWidth={60}
                                setSelectedItems={this.setSelectedItems}
                                syncIndexCompent={this.syncIndexCompent}
                            />
                        </TabPane>
                    </Tabs>


                    <Modal title={this.state.modalContent.title} visible={this.state.visible}
                           onCancel={this.handleOk}
                           footer={[
                               <Button key="submit" type="primary" onClick={this.handleOk}>
                                   确定
                               </Button>,
                           ]}
                    >
                        <div dangerouslySetInnerHTML={{ __html: this.state.modalContent.content }} />
                        <div className={less.news_time}>{moment(this.state.modalContent.newTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                    </Modal>
                </Card>
            </div>
        )
    }
}