import {Card,Form,Row,Col,Input,message,Popconfirm,Button,Tree,Tooltip} from 'antd';
import {DetailsBtns, PermissionsBtn} from 'components/content/DetailsBtns'
import {getDetailsLabel} from  'components/page/Details';
import "./addRole.css"
import moment from 'moment';
import './add.css';
import {session} from "@/utils/storage";
import history from "@/utils/history";
const FormItem = Form.Item;

const TreeNode = Tree.TreeNode;

class AddRole extends React.Component{
    /*static defaultProps = {
        switchShow: session.getItem('authShow'),
        id: session.getItem('authId'),
        uuids: session.getItem('authUuids'),
        close() {
            history.push('/organization/auth');
        }
    };*/
    _userInfo = null;
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            authTree: [],
            //
            tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.

            createTime: '',
            // 渲染树
            tree1: [],
            tree2: [],
            tree3: [],
            // 选择树
            treeChecked1: { checked: [], halfChecked: [] },
            treeChecked2: { checked: [], halfChecked: [] },
            treeChecked3: { checked: [], halfChecked: [] },
            treeSelect1: [],
            treeSelect2: [],
            treeSelect3: [],
            info:{},
            loading:false,
            inputLength:0,
            inputName:"",
            commentsLength:0,
            commentsName:""
        }
    }

    flatTree = []//扁平化的权限树
    /**
     * 初始化
     */
    componentWillMount (){
        this._isMounted = true;
        this.setState({
            loading:false
        })
        this.handleSearch();
    }

    /**
     * 搜索
     * @param page
     * @param pageSize
     * @param event
     */
    handleSearch =  () => {
        let id= this.props.id, uuids=this.props.uuids;
        let params = {};
        if (id && uuids) {
            params.id = id;
            params.uuid= uuids;
        }
        axios.get("@/reuse/adminInformationController/getRoleInfoForAddOrModify",{
            params:params
        }).then(({data:r})=>{
            let info = r.Info;//目标角色的用户信息
            let PremeList = r.PremeList;//目标角色的已选择的权限
            let UserAuthTree = r.UserAuthTree;//登录用户的所有权限
            let radioList= [];
            if(UserAuthTree !=null){
                this.flatTree = UserAuthTree;
                let treeData = this.buildTree(UserAuthTree, 'id', 'parentId', 'children')
                this.setState({
                    authTree: treeData,
                    tree1: treeData
                })
            }
            let checkedKeys = [];
            if(PremeList != null){
                let treeData = this.buildTree(PremeList, 'id', 'parentId', 'children');
                let treeObj = {
                    treeChecked1: { checked: [], halfChecked: [] },
                    treeChecked2: { checked: [], halfChecked: [] },
                    treeChecked3: { checked: [], halfChecked: [] },
                }
                treeObj = this.getCreateDataTree(treeData, treeObj)
                this.setState({
                    treeChecked1: treeObj.treeChecked1,
                    treeChecked2: treeObj.treeChecked2,
                    treeChecked3: treeObj.treeChecked3
                })
            }
            if(info !=null){
                this.props.form.setFieldsValue(info);
                let nameLength = 0;
                let remarkLength = 0;
                if(info.name != null){
                    nameLength = info.name.length;
                }
                if(info.remark != null){
                    remarkLength = info.remark.length;
                }
                this.setState({
                    info:info,
                    inputLength:nameLength,
                    commentsLength:remarkLength,
                })
            }
            this.setState({
                loadings:false,
                checkedKeys:checkedKeys,
                authTree:radioList
            })

        })
    }

    buildTree = (a, idStr, pidStr, chindrenStr) => {
        //将扁平化结构转化未树型结构
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                let filterArr = [];
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    }



//新增和修改角色保存方法
    addRoleBtn=(params)=>{
        if(this.flag){
            return
        }
        this.flag=true;
        let that = this;
                this.setState({
                    loading:true
                })
                if(this.props.uuids == undefined){
                    params.uuids = "";
                }else{
                    params.uuids  = this.props.uuids;
                }
                if(this.props.id == undefined){
                    params.id = "";
                }else {
                    params.id = this.props.id ;
                }
                params.type = 4;
                if (params.premesIds !=null && params.premesIds !=undefined) {
                axios.post("@/reuse/adminInformationController/saveRole", {
                    ...params
                }).then((r, err) => {
                    if (r.data >= 0) {
                        message.success('操作成功');
                        that.props.callBack();
                        this.forceUpdate(function(){
                            this.setState({
                                loading:false
                            })
                        })
                    }
                },()=>{
                    this.flag=false;
                    this.setState({
                        loading:false
                    })
                })
            }else {
                    message.error("请选择该角色的权限");
                    this.setState({
                        loading:false
                    })
                    return;
                }
    }



    //备注字数校验
    remarkChange=(v,v2)=>{
        this.setState({
            commentsLength : v.target.value.length,
            commentsName:v.target.value
        })
    }

    //角色名称字数校验
    inputChange=(v,v2)=>{
        this.setState({
            inputLength : v.target.value.length,
            inputName:v.target.value
        })
    }

    rqStyle=(createTime)=>{
        let rq = moment(createTime).format("YYYY-MM-DD");
        return rq;
    }


    handleBack = (e) => {
        this.props.history.goBack()
    }

    handleSubmit = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            let premesIds = Array.from(new Set([...this.state.treeChecked1.checked, ...this.state.treeChecked1.halfChecked, ...this.state.treeChecked2.checked, ...this.state.treeChecked2.halfChecked, ...this.state.treeChecked3.checked, ...this.state.treeChecked3.halfChecked])).join(",");
            let params = {
                ...values,
                premesIds
            }
            if (!premesIds) {
                this.alert('请选择角色的权限', { type: 'error' });
                return
            }
            this.addRoleBtn(params)
        })
    }
    /**
     * 提示信息
     * @param msg
     * @param options
     */
    alert =(msg, options = {})=> {
        msg = msg ? msg : '系统错误!请重试,或联系管理员.';
        const type = options.type || 'info';
        const duration = options.duration || 1.5;
        message.config({
            top: 300,
        })
        message[type](msg, duration)
        if (options.callback) {
            setTimeout(() => {
                options.callback();
            }, (duration * 1000));
        }
    }

    //根据对象id在扁平数组中循环获得当前对象
    getObjByIdFromFlatTree = (id) => {
        let three = [],
            runs = (arr) => {
                arr.forEach(v => {
                    three.push(v);
                    if (v.children.length) {
                        runs(v.children);
                    }
                })
            };
        runs(this.flatTree);
        return three.find(value => value.id == id);
    };
    //根据id获得当前对象在树的层级
    getCreateDataTree = (arr, treeObj, index = 1) => {
        let treeKey = 'treeChecked' + index
        arr && arr.map(item => {
            try {
                let id = item.id.toString();
                if (item.children && item.children.length > 0) {
                    this.getCreateDataTree(item.children, treeObj, (index + 1))
                }
                let _obj = this.getObjByIdFromFlatTree(item.id);
                if (!item.children || !!item.children && _obj.children && (item.children.length == _obj.children.length)) {
                    treeObj[treeKey].checked.push(id);
                } else if (item.children && _obj.children && (item.children.length > 0 && item.children.length < _obj.children.length)) {
                    treeObj[treeKey].halfChecked.push(id);
                }
            }catch (e) {
            }
        });
        return treeObj
    };
    // 当点击文字时加载他后面的key
    handleSelect = (selectedKeys, e, index) => {
        let dataKey = 'treeSelect' + index;
        // 判断当前选中一个，或与当前选中相同
        let selectId = selectedKeys[0] || this.state[dataKey];
        if (selectedKeys.length > 0 && this.state[dataKey] != selectedKeys) {
            this.setState({
                [dataKey]: selectedKeys
            })

            this.resetTree(index)
            let obj = this.getObjByIdFromFlatTree(selectId);
            if (obj.premesType != 2 && obj.children) {
                // 如果不是按钮并且含有子集
                let treeKey = 'tree' + (index + 1);
                this.setState({
                    [treeKey]: obj.children
                })
            }
        }
    }


    // 当点击选中控件时
    handleCheck = (checkedKeys, e, index) => {
        if(e.checked){
            this.handleSelect([e.node.props.eventKey],e,index)
        }
        this.changeTreeStatus(e.node.props.eventKey, e.checked, index)
    }

    //
    //统一处理    *这里增加个isInit判断,默认运行，如果是通过递归调用的则不运行父元素判断
    changeTreeStatus = (id, checked, index, isInit = true) => {
        id = id.toString();
        let treeCheckedKey = 'treeChecked' + index;
        let treeChecked = this.state[treeCheckedKey]
        // 首先如果半选中有他则删除
        let halfIndex = treeChecked.halfChecked.indexOf(id)
        if (halfIndex > -1) {
            treeChecked.halfChecked.splice(halfIndex, 1);
        }
        if (checked) {
            // 将该元素去重添加到当前选中列表
            treeChecked.checked = Array.from(new Set([...treeChecked.checked, id]));
        } else {
            let checkedIndex = treeChecked.checked.indexOf(id)
            if (checkedIndex > -1) {
                treeChecked.checked.splice(checkedIndex, 1);
            }
        }
        this.setState({
            [treeCheckedKey]: treeChecked
        })
        //在树中获得当前对象
        let obj = this.getObjByIdFromFlatTree(id)
        //处理所有子集
        if (obj.children && obj.children.length > 0) {
            this.changeTreeChildStatus(obj.children, checked, (index + 1))
        }
        // // 处理父元素
        if (isInit && index > 1) {
            this.changeTreeParentStatus(obj.parentId, checked, (index - 1))
        }
    }

    // 递归控制子元素
    changeTreeChildStatus = (arr, checked, index) => {
        arr.map((item, i) => {
            this.changeTreeStatus(item.id, checked, index, false);
        })
    }

    //判断元素改变父元素      ***如果是递归过程中改currentId处理中间元素不会呗选中问题
    changeTreeParentStatus = (parentId, checked, index, currentId = '') => {
        let parentObj = this.getObjByIdFromFlatTree(parentId);
        if (!parentObj)return;
        let childrenAllCheck = 0;
        let childrenHalfCheck = 0;
        //父元素对应的树
        let treeCheckedKey = 'treeChecked' + index;
        let treeChecked = this.state[treeCheckedKey];
        //子元素对应的树
        let treeCheckedKeyChild = 'treeChecked' + (index + 1);
        let treeCheckedChild = this.state[treeCheckedKeyChild]
        parentObj.children.map(item => {
            let itemId = item.id.toString()
            let itemInArrIndex = treeCheckedChild.checked.indexOf(itemId);
            let itemInArrHalfIndex = treeCheckedChild.halfChecked.indexOf(itemId);
            if (itemInArrIndex > -1 || (itemId == currentId && checked)) {
                // 当前一次执行的parentId将要被js设置未选中，但是由于setState的异步过程而未执行时
                ++childrenAllCheck;
            } else if (itemInArrHalfIndex > -1) {
                ++childrenHalfCheck;
            }
        })

        //先去掉再添加，从半选和全选中去掉
        let halfIndex = treeChecked.halfChecked.indexOf(parentId)
        if (halfIndex > -1) {
            treeChecked.halfChecked.splice(halfIndex, 1);
        }
        let checkedIndex = treeChecked.checked.indexOf(parentId)
        if (checkedIndex > -1) {
            treeChecked.checked.splice(checkedIndex, 1);
        }

        if (childrenAllCheck == parentObj.children.length) {
            //如果子元素全部选中
            treeChecked.checked = Array.from(new Set([...treeChecked.checked, parentId]));
        } else if (childrenAllCheck > 0 && childrenAllCheck < parentObj.children.length || childrenHalfCheck > 0) {
            //如果子元素部分选中
            treeChecked.halfChecked = Array.from(new Set([...treeChecked.halfChecked, parentId]));
        }
        this.setState({
            [treeCheckedKey]: treeChecked,
        })
        if (index > 1) {
            this.changeTreeParentStatus(parentObj.parentId, checked, (index - 1), parentObj.id)
        }
    }

    //重置树的渲染
    resetTree = (index) => {
        do {
            ++index
            let treeKey = 'tree' + index;
            this.setState({
                [treeKey]: []
            })
        } while (index < 3);
    }

    // 渲染树
    renderTree = (data) => {
        return data.map((item) => {
            return <TreeNode title={item.name} key={item.id} />
        });
    }

    //获取树
    getAuthTreeReadonly = () => {
        let treeList = []
        let classData = this.state.treeChecked1.checked.concat(this.state.treeChecked1.halfChecked);

        classData.map(item => {
            let obj = this.getObjByIdFromFlatTree(item);
            if (obj) {
                treeList.push(obj)
            }
        })
        return treeList
    }

    renderAuthTreeText = (arr) => {
        let dataArr = [];
        if(arr != undefined || arr != null){
        arr.map((item) => {
            let textArr = []
            let arr2 = this.state.treeChecked2.checked.concat(this.state.treeChecked2.halfChecked);
            let id2 = item.id.toString()
            let isIn = arr2.indexOf(id2);
            if (isIn < 0) {
                return
            }
            textArr.push(item.name)
            if (item.children) {
                item.children.map((o) => {
                    let arr3 = this.state.treeChecked3.checked.concat(this.state.treeChecked3.halfChecked);
                    let id3 = o.id.toString();
                    let isIn = arr3.indexOf(id3);
                    if (isIn < 0) {
                        return
                    }
                    textArr.push(o.name)
                });
            }
            dataArr.push('(' + textArr.join('、') + ')')
        })
        }
        return dataArr
    }

    // 渲染只读结构
    renderAuthTreeReadonly = () => {
        let data = this.getAuthTreeReadonly();
        let renderData = [];
        data.map((item, i) => {
            let result = [];
            let content = item.children ? this.renderAuthTreeText(item.children) :  [];
            if(content.length>0){
            content.map((items,indexs)=>{
                renderData.push(
                    <Col span={12} >
                        <div className="tree_read_item">
                            <Tooltip title={item.name}>
                            <div className="tree_title">{item.name}</div>
                            </Tooltip>
                            <div className="tree_content">
                                <Tooltip title={items}>
                                    <span>{items}</span>
                                </Tooltip>
                            </div>
                        </div>
                    </Col>
                )
            })
            }else {
                renderData.push(
                    <Col span={12} >
                        <div className="tree_read_item">
                            <Tooltip title={item.name}>
                            <div className="tree_title">{item.name}</div>
                            </Tooltip>
                            <div className="tree_content">

                            </div>
                        </div>
                    </Col>
                )
            }
        });
        return renderData
    }

    //
    renderTime = () => {
        if (!this.state.createTime) {
            return null
        }
        // 表单栅格布局
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 9 }
        }
        return (
            <FormItem
                {...formItemLayout}
                label="创建时间"
            >
                {moment(this.state.createTime).format('YYYY-MM-DD hh:mm:ss')}
            </FormItem>
        )
    }


    render(){
        const {getFieldProps} = this.props.form;
        const pagination = ComponentDefine.getPagination_(this.state.dataSource,  this.onChange,this.onShowSizeChange);
        const treeList = this.renderTree(this.state.authTree);
        return(
            <div>
                <Form horizontal>
                    <Card loading={this.state.loadings} className="card-margin-bottom" title="角色信息">
                    <Row>

                        <Col span="15">
                            <FormItem
                                required
                                label={getDetailsLabel("角色名称")} {...ComponentDefine.form_.layout}>
                                <Input maxLength={20} {...getFieldProps('name',{
                                    rules: [
                                        {required: true, message: '请输入角色名称'}
                                    ],
                                    onChange: this.inputChange,
                                    validateTrigger: "onBlur",
                                    validateFirst: true
                                })} placeholder="请输入"/>
                            </FormItem>
                        </Col>
                        <Col span={2} style={{position: "absolute",bottom: "28px",left: "59%"}}>
                            {this.state.inputLength}/20
                        </Col>
                    </Row>
                    {this.props.id != "" &&
                    <Row>
                        <Col span="15" className="ant-form-item-margin-bottom ant-form-item-margin-bottom-24">
                            <FormItem label={getDetailsLabel("创建日期")} {...ComponentDefine.form_.layout}>
                                {(this.state.info != null && this.state.info.createTime != null) && <p>{this.rqStyle(this.state.info.createTime)}</p>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    }
                    <Row>
                        <Col span={15}>
                            <Form.Item
                                {...ComponentDefine.form_.layout}
                                label={getDetailsLabel("备注信息")}
                            >
                                <Input type="textarea" rows={4} maxLength={200} size='large' {...getFieldProps('remark',{
                                        /** getFieldProps会占用onchange事件 所以在getFieldProps里写事件 */
                                        onChange: this.remarkChange,
                                        validateTrigger:"onBlur",
                                        validateFirst:true
                                    }
                                )} placeholder="请输入" />
                            </Form.Item>
                        </Col>
                        <Col span={2} style={{position: "absolute",bottom: "26px",left: "56%"}}>
                            {this.state.commentsLength}/200
                        </Col>
                    </Row>
                </Card>
                <Card loading={this.state.loadings} className="card-margin-bottom" title="角色分配">
                    <Row className="table_area">
                        <Col span="8" className="table_box">
                            <h4 className="table_box_title">模块</h4>
                            <div className="table_box_list">
                                <Tree
                                    checkable={true}
                                    checkStrictly={true}
                                    onCheck={(checkedKeys, e) => { this.handleCheck(checkedKeys, e, 1) }}
                                    checkedKeys={this.state.treeChecked1}
                                    onSelect={(selectedKeys, e) => { this.handleSelect(selectedKeys, e, 1) }}
                                    selectedKeys={this.state.treeSelect1}
                                >
                                    {this.renderTree(this.state.tree1)}
                                </Tree>
                            </div>
                        </Col>
                        <Col span="8" className="table_box">
                            <h4 className="table_box_title">功能</h4>
                            <div className="table_box_list">
                                <Tree
                                    checkable={true}
                                    checkStrictly={true}
                                    onCheck={(checkedKeys, e) => { this.handleCheck(checkedKeys, e, 2) }}
                                    checkedKeys={this.state.treeChecked2}
                                    onSelect={(selectedKeys, e) => { this.handleSelect(selectedKeys, e, 2) }}
                                    selectedKeys={this.state.treeSelect2}
                                >
                                    {this.renderTree(this.state.tree2)}
                                </Tree>
                            </div>
                        </Col>
                        <Col span="8" className="table_box">
                            <h4 className="table_box_title">操作</h4>
                            <div className="table_box_list">
                                <Tree
                                    checkable={true}
                                    checkStrictly={true}
                                    onCheck={(checkedKeys, e) => { this.handleCheck(checkedKeys, e, 3) }}
                                    checkedKeys={this.state.treeChecked3}
                                    onSelect={(selectedKeys, e) => { this.handleSelect(selectedKeys, e, 3) }}
                                    selectedKeys={this.state.treeSelect3}
                                >
                                    {this.renderTree(this.state.tree3)}
                                </Tree>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card loading={this.state.loadings} className="card-margin-bottom" title="当前已选权限">
                    <Row gutter={16} className={"tree_read clearfix"}>
                        {this.renderAuthTreeReadonly()}
                    </Row>
                </Card>
                </Form>
                <DetailsBtns>
                    <PermissionsBtn noauth>
                        <Button type="back" onClick={this.props.callBack}>返回</Button>
                        <Popconfirm title="确定同意保存?" onConfirm={this.handleSubmit}><Button type="primary" loading={this.state.loading}>保存</Button></Popconfirm>
                    </PermissionsBtn>
                </DetailsBtns>
            </div>
        )
    }
}
export default Form.create()(AddRole)
