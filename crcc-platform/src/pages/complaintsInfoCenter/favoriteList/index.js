import {Button, Card, Modal, Row, Col, Tooltip, Icon} from "antd";
import api from "@/framework/axios";
import Util from "@/utils/util";
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import less from "./index.less";

const confirm = Modal.confirm;

export default class ComplaintsList extends React.Component{

    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
    _userInfo = null

    state = {
        loading: false,

        tableState: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        // modal
        visible: false,
        previewImage: '', // 预览图片地址
        previewVisible:false,
        selectedItems:[],//存储被选中的列表项
        haveSelection:true,//列表中是否展示复选框
        modalContent: {},
        images:[],     //图片数组
        //批量取消时,需要传入弹出框的数据
        modeData:{},

    }
    renderFormList = () => {
        return [
            {
                type: 'INPUT',
                field: 'title',
                label: '标题',
                placeholder: '请输入标题',
                maxLength:50
            },
            {
                type: 'INPUT',
                field: 'content',
                label: '内容',
                placeholder: '请输入内容',
                maxLength:50
            }, {
                type: 'SELECT',
                field: 'busType',
                label: '业务类型',
                placeholder: '请选择业务类型',
                list: [{ id: '1', value: '投诉' }, { id: '0', value: '建议' }]
            },
            {
                type: 'INPUT',
                field: 'contactName',
                label: '联系人',
                placeholder: '请输入联系人',
                maxLength:50
            },
            {
                type: 'RANGE',
                field: 'times',
                label: '申请时间',
                placeholder: '请选择筛选时间段'
            },
        ]
    }

    importantFilter = [ 'title','content','busType']

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



    initDataFn = () => {
        this.baseParams = {
            ...this.baseParams,
        }

        // 进入页面加载数据
        this.handelToLoadTable();
    }

    reloadTableData(state = 1) {
        let key = this.activeTab;
        if(this._userInfo){
            this.handelToLoadTable(state, 'tableState' + key);
        }
    }



    handleFilter = (params, isSend = true) => {
        //根据formList生成的表单输入条件过滤
        //发布时间处理
        let beginTime, endTime;
        if (params.times) {
            beginTime = params.times[0] ? moment(params.times[0]).format('YYYY-MM-DD') : '';
            endTime = params.times[1] ? moment(params.times[1]).format('YYYY-MM-DD') : '';
        }

        this.baseParams = {
            ...this.baseParams,
            ...params,
            beginTime,
            endTime,
        }
        if (isSend) {
            this.handelToLoadTable();
        }
    }

    baseParams = {
        collected:1, //表示已经被收藏
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

    //查看详情
    handleToDetails = (obj) => {
        this.setState({
            visible: true,
            modalContent:obj,
        })
        if (obj.images!=null){
            let images=this.state.images;
            images=obj.images.split(',');
            this.setState({
                images
            })
        }else {
            this.setState({
                images:[]
            })
        }
    }

    //取消收藏
    handleToFavorite=(uuids)=>{
        api.ajax('get', '@/portal/ecComplaintAd/crccPortal/get',
            {uuids}
        ).then(r => {
            let modalContent=this.state.modalContent;
            modalContent=r.data;
            //根据uuids查询出来再进行修改操作
            confirm({
                title: '确认要取消收藏?',
                onOk() {
                    if (modalContent.collected == 1) {
                        modalContent.collected =0,
                            api.ajax('post', '@/portal/ecComplaintAd/crccPortal/savefavorite',
                                {...modalContent}
                            ).then(r => {
                                Util.alert('操作成功', { type: 'success' });
                                location.reload();
                            }).catch(r => {
                                Util.alert('取消收藏失败', { type: 'error' })
                                location.reload();
                            })
                    }else{
                        Util.alert('未被收藏，刷新页面试试', { type: 'error' })
                    }
                },
                onCancel() {
                    Util.alert('已取消操作');
                }
            });
        }).catch(r => {
            Util.alert('取消收藏出错', { type: 'error' })
            location.reload();
        })

    }



    //点击取消关闭弹出框
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


    setSelectedItems  = (items) =>{
       let modeData=this.state.modeData;
       modeData=items;
       this.setState({
           modeData
       })
    }
    //对象判空
    isEmpty(obj) {
        for(var name in obj) {
            if(obj.hasOwnProperty(name))
            {
                return false;
            }
        }
        return true;
    };


    //批量取消收藏
    handleToShelfAllDown=()=>{
        let modeData=this.state.modeData;
        if(this.isEmpty(modeData)){
            Util.alert("未选中任何值");
            return;
        }
            confirm({
                title: '确认要取消收藏?',
                onOk() {
                    {modeData.map((item, index) => {
                                if (item.collected == 1) {
                                    item.collected = 0,
                                        api.ajax('post', '@/portal/ecComplaintAd/crccPortal/savefavorite',
                                            {...item}
                                        ).then(r => {
                                            Util.alert('操作成功', {type: 'success'})
                                        }).catch(r => {
                                            Util.alert('取消收藏失败', {type: 'error'})
                                        })
                                } else {
                                    Util.alert('未被收藏，刷新页面试试', {type: 'error'})
                                }
                            setTimeout(()=>{location.reload()},2000);
                            }
                        )
                    }
                },
                onCancel() {
                    Util.alert('已取消操作');
                    location.reload();
                }
            });

    }
    //根据url请求,同步页面组件
    syncIndexCompent = ()=>{
        //清空被选中的列表项
        let {haveSelection,selectedItems} = this.state
        if(haveSelection && selectedItems && selectedItems.length>0){
            this.state.selectedItems = [];
        }
    }


    columns = [{
        title: '业务类型',
        dataIndex: 'busType',
        key: 'busType',
        sorter: true,
        width: 100,
        render: (text, record) => {
            switch (text) {
                case 1:
                    return <span>投诉</span>
                    break;
                case 0:
                    return <span>建议</span>
                    break;
                default:
                    return <span>-</span>
                    break;
            }
        },
    }, {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        sorter: true,
        width: 120
    }, {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        sorter: true,
        render: (text, record) => {
            text = text.replace(/<[^>]+>/g, "");
            if (text.length < 30) {
                return <Tooltip placement="bottom"  title={text}>
                    <span>{text}</span>
                </Tooltip>
            } else {
                return <Tooltip placement="bottom"  title={text}>
                    <span>{text.substring(0, 50)}...</span>
                </Tooltip>
            }
        },
    }, {
        title: '联系人',
        dataIndex: 'contactName',
        key: 'contactName',
        sorter: true,
        width: 80,
    }, {
        title: '联系电话',
        dataIndex: 'contactPhone',
        key: 'contactPhone',
        width: 100,
        render: (text) => {
            return text.substr(0,3)+"****"+text.substr(7);
        }
    }, {
        title: '申请时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        width: 120,
        render: (text) => {
            return moment(text).format("YYYY-MM-DD")
        }
    },{
        title: '操作',
        key: 'options',
        width: 200,
        render: (text, record) => (
            <span>
                <a type="primary" onClick={() => this.handleToDetails(record)}>查看 </a>

                <a type="primary" onClick={() => this.handleToFavorite(record.uuids)}>取消收藏</a>
            </span>

        ),
    }]


    //预览图片
    handlePreview = (file) => {
        this.setState({
            previewImage: file,
            previewVisible: true,
        });
    }
    //关闭预览图片
    handleCancel =()=>{
        this.setState({
            previewVisible: false,
        });
    }

    //导出
    handleToExport = () => {
        let params = '';
        for (let index in this.baseParams) {
            params += index + '=' + this.baseParams[index] + '&'
        }
        window.open(
            window.location.origin +
            '/api' +
            '/portal/ecComplaintAd/crccPortal/export'+
            '?' + params
        )
    }


    render(){
        let images = this.state.images;
        const busType=this.state.modalContent.busType;
        const { previewVisible, previewImage } = this.state;

        return(
            <div>
                <Card bordered={false} title="我的收藏">
                <BaseForm formList={this.renderFormList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                    <div className={less.butt}>
                        <Button type="primary" onClick={this.handleToShelfAllDown}>取消收藏</Button>
                        <Button type="primary" onClick={this.handleToExport}>导出</Button>
                    </div>

                    <BaseTable
                        notInit={true}
                        url="@/portal/ecComplaintAd/crccPortal/page"
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns}
                        indexkeyWidth={50}
                        haveSelection={this.state.haveSelection}
                        selection={this.state.haveSelection}
                        setSelectedItems={this.setSelectedItems}
                        syncIndexCompent={this.syncIndexCompent}
                    />
                </Card>
                <Modal title={`详情`} visible={this.state.visible}
                       width={800}
                       onCancel={this.handleOk}
                       footer={[
                           <Button key="realod"  onClick={this.handleOff}>
                               取消
                           </Button>,
                           <Button key="favorite" type="primary" onClick={() => this.handleToFavorite(this.state.modalContent.uuids)}>
                               取消收藏
                           </Button>,

                       ]}
                >
                    <div className={less.ceshi}>
                        <div className={less.lab}><p>标题：</p></div>
                        <div className={less.cont}><p>{this.state.modalContent.title}</p></div>

                        <div className={less.lab}><p>投诉类型：</p></div>
                        <div className={less.cont}><p>{busType==1?'投诉':'建议'}</p></div>

                        <div className={less.lab}><p>申请时间：</p></div>
                        <div className={less.cont}><p>{moment(this.state.modalContent.newTime).format("YYYY-MM-DD HH:mm:ss")}</p></div>

                        <div className={less.lab}><p>联系人：</p></div>
                        <div className={less.cont}><p>{this.state.modalContent.contactName}</p></div>

                        <div className={less.lab}><p>联系电话：</p></div>
                        <div className={less.cont}><p>{this.state.modalContent.contactPhone}</p></div>

                        <div className={less.lab}><p>内容：</p></div>
                        <div className={less.cont}><p>{this.state.modalContent.content}</p></div>

                    </div>

                    {/*预览图片弹出框*/}
                    <div className="clearfix">
                        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel} >
                            <img style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                    <div className={less.imageDiv}>
                        {images.map((item, index)=>{
                            return (
                                <img className={less.image} src={imageOrigin+item} onClick={() => this.handlePreview(imageOrigin+item)}  />
                            )
                        })}
                    </div>
                </Modal>
            </div>

        )
    }
}
const imageOrigin = SystemConfig.configs.resourceUrl;