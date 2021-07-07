import {Card,Col,Row,Icon,Tree,Button,Table,Modal,Form,InputNumber,TreeSelect,Switch,message, Transfer} from 'antd';
import Input from '@/components/baseInput';
import api from '@/framework/axios'//请求接口的封装
import BaseTable from '@/components/baseTable'
import Util from '@/utils/util'
import less from "./helpCenter.less";
import SeeModal from './helpSeeModal';
import UpdateModal from './updateForm';

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};  //左右规格
const FormItem = Form.Item;
const confirm = Modal.confirm;


export default class HelpCenter extends React.Component {
    _userInfo = null;
    constructor(props){
        super(props);
        let helpClass=this.props.match.params.helpClass=="supplier"?1:2;
       this.state = {
            tableState: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
            haveSelection:true,//列表中是否展示复选框
            helpClassAll:[], 		//保存帮助分类
            currentClickClass:"帮助内容",
           helpClass:helpClass,
            param:{
                helpType:-1,
                helpClass:helpClass,
                newsType:5,
                querysort: "sort",//排序字段
                order: 'asc',
            },
            modalvisible: false,
            //查看
            seeVisible: false,
            seeModalInfo: "",

            //修改
            updateVisible:false,
            updateModalInfo: "",
            baseParams :{
                helpType:-2,
                //BaseTable 请求的参数
            },
           uuids:'',
           classId:''
        }
    }


    componentWillMount() {
        //this._isMounted=true;
        this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
            if (this._userInfo || !obj) { return false }
            this._userInfo = obj;
            this.state.companyId = this._userInfo.companyId;
            // 获得用户基本信息后执行加载回调
            this.initDataFn();
        }.bind(this));//
        PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
    }

    componentWillUnmount() {
        //this._isMounted=false;
        PubSub.unsubscribe(this.pubsub_userInfo);
    }
    initDataFn = () => {
        //查询所有帮助分类
        this.queryHelpClassSwitch();
    }
//加载table
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
    //查询所有帮助分类
    queryHelpClassSwitch=()=>{
        let param=this.state.param;
        api.ajax("GET", "@/message/ecNews/page", {
            ...param
        }).then(r => {
            if (r.msg === "请求成功") {
                this.setState({
                    helpClassAll: r.data.rows
                })
            }

        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
        })
    }


    //刷新当前列表
    refreshHelpClass=()=>{
        //加载全部分类信息
        this.queryHelpClassSwitch();
    }

    //帮助内容删除
    handleToDel = (uuids) => {
        let _this = this;
        confirm({
            title: '您是否确认要删除该条记录吗？',
            onOk() {
                _this.delSubmit(uuids)
            },
            onCancel() {
                Util.alert('已取消操作');
            },
        });
    }

    delSubmit = (uuids) => {
        let _this = this;
        api.ajax("PUT", "@/message/ecNews/crccPortal/deleteClass", [
            uuids]
        ).then(r => {
            Util.alert('删除成功', { type: 'success' });
            location.reload();
        }).catch(r => {
            Util.alert('删除失败', { type: 'error' });
        })
    }

    // 跳转页面修改信息
    updateHelp = (uuids,helpClass) => {
        this.props.history.push(this.props.history.location.pathname + '/edit'+'/'+uuids+'/'+helpClass);
    }
    // 跳转页面发布信息
    addHelp = () => {
        let helpClass=this.state.helpClass;
        let classId=this.state.classId;
        if (classId!=''){
            this.props.history.push(this.props.history.location.pathname + '/add'+'/'+helpClass+'/'+classId);
        }else{
            Util.alert('请选择关联帮助分类');
        }

    }

    cancelSeeModal = () => {
        this.setState({
            seeVisible: false,
        })
    }
    seeInitModal = {
        onCancel: this.cancelSeeModal
    }
//详情查询
    handleToSee = (info) => {
        this.setState({
            seeVisible: true,
            seeModalInfo: info
        })
    }

    //点击分类展示分类下的内容
    lookSecond=(id,title)=>{
        let currentClickClass = this.state.currentClickClass;
        let classId=this.state.classId;
        currentClickClass = title;
        classId=id;
        this.setState({
            currentClickClass,
            baseParams:{
                helpType:id,
            },
            classId
        })
        this.handelToLoadTable()
    }

    columns = [{
        title: '信息标题',
        dataIndex: 'title',
        key: 'title',
        width: 150,
    }, {
            title: '信息内容',
            dataIndex: 'content',
            key: 'content',
            render: (text, record) => {
                text = text.replace(/<[^>]+>/g, "");
                if (text.length < 30) {
                    return <span>{text}</span>
                } else {
                    return <span>{text.substring(0, 30)}...</span>
                }
            },
            width: 200,
        },
        {
            title: '发布时间',
            dataIndex: 'newsTime',
            key: 'newsTime',
            sorter: true,
            render: (text, record) => (
                <span>
          {moment(record.newsTime).format("YYYY-MM-DD")}
        </span>
            ),
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'options',
            key: 'options',
            render: (text, record) => (

                <span>
                    <a type="primary" title={"修改"}  onClick={() => this.updateHelp(record.uuids,this.state.helpClass)}>修改</a>
                    <span className="ant-divider"></span>
                    {/*<a type="primary" title={"详情"}  onClick={() => this.handleToSee(record)}>详情</a>*/}
                    {/*<span className="ant-divider"></span>*/}
                    <a type="primary" title={"删除"}  onClick={() => this.handleToDel(record.uuids)}>删除</a>
        </span>
            ),
            width: 100,
        }]

    render() {
        let helpClassAll = this.state.helpClassAll;
        return(
            <div>
                <Row className={less.shop_zdyfl}>
                    <Col span={6} className={less.left_zdyfl}>
                        <Card
                            title={this.state.helpClass==1?"供应商帮助分类":"采购商帮助分类"}
                            bordered={false}
                            extra={
                                <div>
                                    <AddGoodsClass helpClassAll={this.state.helpClassAll} helpClass={this.state.helpClass} helpUuids={this.state.uuids}  refreshHelpClass={this.refreshHelpClass}/>
                                </div>
                            }
                        >
                            <ul className={less.fenleiji}>
                                {
                                    helpClassAll.map((item, index)=>{
                                        return(
                                            <li>
                                                <div>
                                                    <a className={less.name_a} id={`name1_${item.id}`} style={{display:"block"}} onClick={this.lookSecond.bind(this,item.id,item.title)} >{item.title}</a>
                                                </div>
                                                <div className={less.bianji}>
                                                    <AddGoodsClass helpClassAll={this.state.helpClassAll} helpClass={this.state.helpClass}  refreshHelpClass={this.refreshHelpClass} helpContent={item} helpUuids={item.uuids} helpClassId={item.id} tempType={'edit'}/>
                                                    <a  title={"删除"} onClick={this.handleToDel.bind(this, item.uuids, )}><Icon type="delete" /></a>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card
                            title={this.state.currentClickClass}
                            bordered={false}
                            extra={
                                <div className={less.anniuzu}>
                                    <Button disabled={this.state.buttonAble} type="primary" onClick={() => this.addHelp()}>发布信息</Button>
                                </div>
                            }
                        >
                            <div>
                                <BaseTable
                                    url="@/message/ecNews/page"
                                    tableState={this.state.tableState}
                                    resetTable={(state) => { this.resetTable(state, 'tableState') }}
                                    baseParams={this.state.baseParams}
                                    columns={this.columns}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <SeeModal
                    {...this.seeInitModal}
                    info={this.state.seeModalInfo}
                    visible={this.state.seeVisible}></SeeModal>
            </div>
        )
    }
}



class addClass extends React.Component {
    constructor(props){
        super(props);
        // this.props.form.setFieldsValue(HelpClassAll);
    }
    state = {
        loading: false,
        visible: false,
        id:'',
        helpClass:this.props.helpClass,
        uuids:this.props.helpUuids
    }


    //点击添加分类的按钮
    clickAddGoodsClass=()=>{
            this.showModal();
        this.props.form.setFieldsValue(this.props.helpContent);
    }

    showModal=()=>{
        this.setState({
            visible: true,
        });
    }

    handleOk=()=>{
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    }


    saveBulletin = (formData) => {
        let _this = this;
        this.setState({
            _loading: true
        })
        const formContent=formData;
        formContent.helpClass=this.props.helpClass;
        console.log(this.state.uuids)
        formContent.uuids=this.state.uuids;
        api.ajax("POST", "@/message/ecNews/crccPortal/saveHelpClass", {
            // uuids: this.bulletinInfo.uuids,
            ...formContent
        }).then(r => {
            if (r.msg === "请求成功") {
                Util.alert('保存成功', { type: 'success' });
                this.setState({ loading: false, visible: false });
            window.location.reload();
            }

        }).catch(r => {
            Util.alert(r.msg, { type: 'error' });
        })
    }
    submitForm = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            this.saveBulletin({ ...values});
        })
    }


    handleCancel =()=>{
        this.cleanFormValue();
        this.setState({ visible: false });
    }



    //清空当前分类填写信息
    cleanFormValue=()=>{
        this.props.form.resetFields();
    }

    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }
        return(
            <div>
                <a onClick={this.clickAddGoodsClass.bind()} className={this.props.tempType == 'edit'?less.custom_hide:less.tjflys}><Icon type="plus-square" />添加分类</a>
                <a title={"编辑"} onClick={this.clickAddGoodsClass.bind()} className={this.props.tempType == 'edit'?less.tjflys:less.custom_hide}><Icon type="edit" /></a>
                <Modal ref="modal"
                       visible={this.state.visible}
                       title={this.props.tempType == 'edit'?"编辑分类":"添加分类"} onOk={this.handleOk} onCancel={this.handleCancel}
                       footer={[
                           <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返 回</Button>,
                           <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.submitForm}>
                               保 存
                           </Button>,
                       ]}
                >
                    <Form>
                        <FormItem {...formItemLayout} label="分类名称">
                            <Input
                                maxLength={12}
                                {...getFieldProps('title', {
                                    rules: [
                                        { required: true, message: '分类不能为空' },
                                        { max:12, message:'字数达到限制'},
                                    ],
                                })} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="排序">
                            <Input
                                {...getFieldProps('sort', {
                                    rules: [
                                        { required: true, message: '排序不能为空' },

                                    ],
                                })} />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const AddGoodsClass = Form.create({})(addClass);