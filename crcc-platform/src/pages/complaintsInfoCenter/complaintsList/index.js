import {Button, Card, Modal,Row,Col,Tooltip} from "antd";
import api from "@/framework/axios";
import Util from "@/utils/util";
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'

import less from "./index.less";

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
        querysort: "status",//排序字段
        order: 'asc',

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
        let images=this.state.images;
        if (obj.images!=null) {
            images = obj.images.split(',');
            this.setState({
                images
            })
        }else {
            this.setState({
                images:[]
            })
        }
        console.log(obj.images);
        let sendUrl = '@/portal/ecComplaintAd/crccPortal/saveComplaint';
        if (obj.status == 0) {
            obj.status =1,
                console.log(obj),
            api.ajax('post', sendUrl,
            {...obj}
            ).then(r => {
                this.setState({
                    visible: true,
                    modalContent:obj,
                })
                this.reloadTableData(2);
            }).catch(r => {
                Util.alert(r.msg, { type: 'error' })
            })
        }else{
            this.setState({
                visible: true,
                modalContent:obj,
            })
        }
    }

    //添加到收藏夹
    handleToFavorite=()=>{
        let modalContent=this.state.modalContent;
        let sendUrl = '@/portal/ecComplaintAd/crccPortal/savefavorite';
        if (modalContent.collected == 0) {
            modalContent.collected =1,
                console.log(modalContent),
                api.ajax('post', sendUrl,
                    {...modalContent}
                ).then(r => {
                    this.reloadTableData(2);
                    Util.alert('收藏成功', { type: 'success' });
                    this.setState({
                        visible: false,
                    })
                }).catch(r => {
                    Util.alert('收藏失败', { type: 'error' })
                    location.reload();
                })
        }else{
            Util.alert('已收藏，请勿重复收藏', { type: 'error' })
        }

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
        width: 100,
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
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        // sortOrder:'ascend',
        render: (text) => {
            if (text == 0) {
                return <span className={less.not_read}>未读</span>
            } else {
                return <span className={less.allready_read}>已读</span>
            }
        },
        onFilter: (value, record) => {
            if(value == record.status) {
                return true
            } else {
                return false
            }
        }
    }, {
        title: '操作',
        key: 'options',
        width: 80,
        render: (text, record) => (
            <span>
        <a type="primary" onClick={() => this.handleToDetails(record)}>查看</a>
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


    render(){
        let images = this.state.images;
        const busType=this.state.modalContent.busType;
        const { previewVisible, previewImage } = this.state;

        const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;


        return(
            <div>
                <Card bordered={false} title="投诉信息中心">
                <BaseForm formList={this.renderFormList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                    <BaseTable
                        notInit={true}
                        url="@/portal/ecComplaintAd/crccPortal/page"
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns}
                        indexkeyWidth={50}
                    />
                </Card>


                <Modal title={`详情`} visible={this.state.visible}
                       width={800}
                       onCancel={this.handleOk}
                       footer={[
                           <Button key="realod"  onClick={this.handleOff}>
                               关闭
                           </Button>,
                           <Button key="favorite" type="primary" onClick={() => this.handleToFavorite()}>
                               收藏
                           </Button>,

                       ]}
                >
                    <div className={less.ceshi}>
                        <div className={less.lab}><p>标题：</p></div>
                        <div className={less.cont}><p>{this.state.modalContent.title}</p></div>

                        <div className={less.lab}><p>投诉类型：</p></div>
                        <div className={less.cont}><p>{busType==1?'投诉':'建议'}</p></div>

                        <div className={less.lab}><p>申请时间：</p></div>
                        <div className={less.cont}><p>{moment(this.state.modalContent.updateTime).format("YYYY-MM-DD HH:mm:ss")}</p></div>

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
                                if(item!=null || item!='') {
                                    return (
                                        <img className={less.image} src={imageOrigin + item}
                                             onClick={() => this.handlePreview(imageOrigin + item)}/>
                                    )
                                }
                            })}
                            </div>
                </Modal>
            </div>

        )
    }
}
const imageOrigin = SystemConfig.configs.resourceUrl;