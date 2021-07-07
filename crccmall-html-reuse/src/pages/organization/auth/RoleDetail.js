import { Card, Form, Row, Col, Table, Tag, Tooltip, Button } from 'antd';
import { tablePagination_ } from "@/utils/config/componentDefine"
import { getDetailsLabel } from 'components/page/Details';
import "./addRole.css"
import "./detail.css"
import moment from 'moment';
import Util from '@/utils/util'
import { session } from "@/utils/storage";
import history from "@/utils/history";
import { DetailsBtns, PermissionsBtn } from "components/content/DetailsBtns";
const FormItem = Form.Item;

class RoleDetail extends React.Component {
    /*static defaultProps = {
        uuids: session.getItem('authUuids'),
        close() {
            history.push('/organization/auth');
        }
    };*/
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            Options1: [],
            Options2: [],
            Options3: [],
            chosedOptions1Menu: [],
            chosedOptions2Menu: [],
            chosedOptions3Menu: [],
            chosedMenu: [],
            nameAndId: [],
            fisrtMenueChosed: [],
            info: [],
            PremeList: [],
            UserAuthTree: [],
            chosedMenuStr: [],
            loading: true,
            // 选择树
            treeChecked1: { checked: [], halfChecked: [] },
            treeChecked2: { checked: [], halfChecked: [] },
            treeChecked3: { checked: [], halfChecked: [] }
        }
    }
    flatTree = []//扁平化的权限树

    /**
     * 初始化
     */
    componentWillMount() {
        this.handleSearch(1, tablePagination_.defaultPageSize);
    }

    /**
     * 搜索
     * @param page
     * @param pageSize
     * @param event
     */
    handleSearch = (page, pageSize, params, event) => {
        if (params == undefined) {
            params = {}
        }
        let uuids = this.props.uuids;
        params.page = page;
        params.rows = pageSize;
        params.uuids = uuids
        axios.get("@/reuse/adminInformationController/getRoleDetail", {
            params: params
        }).then(({ data: r }) => {
            let arr = this.state.nameAndId;
            let Options1 = [];
            let UserAuthTree = r.UserAuthTree;
            this.flatTree = r.PremeList;
            let PremeList = r.PremeList;
            let treeData = Util.buildTree(PremeList, 'id', 'parentId', 'children')
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
            let AllOptionsValueStr = [];
            this.setState({
                nameAndId: arr,
                Options1: Options1,
                info: r.Info,
                chosedMenuStr: AllOptionsValueStr,
                UserAuthTree: r.UserAuthTree,
                loading: false
                // PremeList:r.PremeList
            })
        })
    }

    buildTree = (a, idStr, pidStr, chindrenStr) => {
        //将扁平化结构转化为树型结构
        let r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                let filterArr = [];
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children] = Array.from(new Set([...hashVP[children], aVal]))
            } else {
                r = Array.from(new Set([...r, aVal]))
            }
        }
        return r;
    }

    addRoleBtn = () => {

    }
    columns = [{
        title: '序号',
        dataIndex: 'inquiryNum',
        key: 'index',
        render: (text, record, index) => {
            return index + 1;
        }
    }, {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
    }, {
        title: '性别',
        dataIndex: 'genderStr',
        key: 'genderStr',
    }, {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
    }, {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    }];

    chosedMenuStyle = () => {
        let chosedMenuStr = this.state.chosedMenuStr;
        let arr = [];
        if (chosedMenuStr != null) {
            chosedMenuStr.map((item, index) => {
                let a1 = <Tag className="tag_list">{item}</Tag>
                arr.push(a1);
            })
            return arr;
        }
    }

    //根据对象id在扁平数组中循环获得当前对象
    getObjByIdFromFlatTree = (id) => {
        for (let i = 0; i < this.flatTree.length; i++) {
            if (this.flatTree[i].id == id) {

                return { ...this.flatTree[i] }
            }
        }
    }

    //根据id获得当前对象在树的层级
    getCreateDataTree = (arr, treeObj, index = 1) => {
        let treeKey = 'treeChecked' + index
        arr.map(item => {
            let id = item.id.toString();
            if (item.children && item.children.length > 0) {
                this.getCreateDataTree(item.children, treeObj, (index + 1))
            }
            let _obj = this.getObjByIdFromFlatTree(item.id);
            if (!item.children || item.children && _obj.children && (item.children.length == _obj.children.length)) {
                treeObj[treeKey].checked.push(id);
            } else if (item.children && _obj.children && (item.children.length > 0 && item.children.length < _obj.children.length)) {
                treeObj[treeKey].halfChecked.push(id);
            }
        })
        return treeObj
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
                    let id3 = o.id.toString()
                    let isIn = arr3.indexOf(id3);
                    if (isIn < 0) {
                        return
                    }
                    textArr.push(o.name)
                });
            }
            dataArr.push('(' + textArr.join('、') + ')')
        })
        return dataArr;
    }

    // 渲染只读结构
    renderAuthTreeReadonly = () => {
        let data = this.getAuthTreeReadonly();
        let renderData = [];
        data.map((item, i) => {
            let content = item.children ? this.renderAuthTreeText(item.children) : [];
            if (content.length > 0) {
                content.map((items, indexs) => {
                    renderData.push(
                        <Col span={12}>
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
            } else {
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

    onShowSizeChange = (page, pageSize) => {
        this.handleSearch(page, pageSize);
    };
    onChange = (pagination, filters, sorter) => {
        let params = {};
        if (sorter.field) {
            params.querysort = sorter.field;
        }
        if (sorter.order) {
            params.order = sorter.order.replace("end", "");
        }
        params.page = pagination.current;
        params.pageSize = pagination.pageSize;
        this.handleSearch(params.page, params.pageSize, params);
    };
    showTotal = (total) => {
        return `共 ${this.state.totals} 条`;
    }
    rqStyle = (createTime) => {
        let rq = moment(createTime).format("YYYY-MM-DD");
        return rq;
    }

    render() {
        const { getFieldProps } = this.props.form;
        const pagination = ComponentDefine.getPagination_(this.state.UserAuthTree);
        pagination.pageSizeOptions = ['5', '10', '15', '20', '50', '100']
        pagination.defaultPageSize = 5;
        return (
            <div>
                <Card loading={this.state.loading} className="card-margin-bottom" title="角色信息">
                    <Form horizontal>
                        <Row>
                            <Col span="12" className="ant-form-item-margin-bottom">
                                <FormItem label={getDetailsLabel("角色名称")} {...ComponentDefine.form_.layout}>
                                    <p className="ant-form-text">{this.state.info.name}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12" className="ant-form-item-margin-bottom">
                                <FormItem label={getDetailsLabel("创建日期")} {...ComponentDefine.form_.layout}>
                                    {(this.state.info != null && this.state.info.createTime != null) && <p className="ant-form-text">{this.rqStyle(this.state.info.createTime)}</p>
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12" className="ant-form-item-margin-bottom">
                                <FormItem label={getDetailsLabel("备注信息")} {...ComponentDefine.form_.layout}>
                                    <p className="ant-form-text">{this.state.info.remark}</p>
                                </FormItem>
                            </Col>
                        </Row>

                    </Form>
                </Card>
                <Card loading={this.state.loading} title="该角色已关联子账号" className="card-margin-bottom">
                    <Table rowKey="authorDetailId"
                        {...ComponentDefine.table_}
                        pagination={pagination}
                        rowSelection={null}
                        dataSource={this.state.UserAuthTree.rows}
                        columns={this.columns}
                        onChange={this.onChange}
                    />
                </Card>
                <Card loading={this.state.loading} style={{ marginBottom: '60px' }} className="card-margin-bottom" title="当前已选权限">
                    <Row gutter={16} className={"tree_read clearfix"}>
                        {this.renderAuthTreeReadonly()}
                    </Row>
                </Card>
                <div className='fixed_button'>
                    <DetailsBtns>
                        <PermissionsBtn noauth>
                            <Button type="back" onClick={this.props.callBack}>返回</Button>
                        </PermissionsBtn>
                    </DetailsBtns>
                </div>
            </div>
        )
    }

}
export default Form.create()(RoleDetail)
