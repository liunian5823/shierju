import { Card, Row, Col, Form, Button, Modal, Tree, Tooltip } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import Input from '@/components/baseInput'
import BaseTable from '@/components/baseTable'

import BaseAffix from '@/components/baseAffix';
import less from './index.less'

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class Edit extends React.Component {

  _isMounted = false;

  state = {
    //
    _loading: false,

    authTree: [],
    //
    tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.

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
  }

  flatTree = []//扁平化的权限树

  componentWillMount() {
    this._isMounted = true;
    let uuids = this.props.match.params.uuids || '';
    if (uuids) {
      this.getData(uuids)
	  this.baseParams.roleId = this.props.match.params.id;
      this.baseParams.uuids = uuids;
    }
    this.getuusid();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getuusid() {
    api.ajax('POST', '@/sso/loginControl/getUserUuids').then(r => {
      this.getTreeData(r.data);
    }).catch(r => {
    })
  }

  //角色查看详情接口
  getData = (uuids) => {
    api.ajax('GET', '@/sso/ecRole/get', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return
      }
      this.props.form.setFieldsValue(r.data);
    }).catch(r => {

    })
  }
  //当前根据角色查询权限接口	
  getRoleData = (uuids) => {
    api.ajax('GET', '@/sso/ecRole/queryPremeListByRoleId', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return
      }
      let treeData = Util.buildTree(r.data, 'id', 'parentId', 'children')
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
    })
  }

  //当前登录角色查询权限接口	
  getTreeData = (uuids) => {
    api.ajax('GET', '@/sso/ecUser/queryAuthDataList', {
      uuids,
	  type: 5
    }).then(r => {
      if (!this._isMounted) {
        return
      }

      this.flatTree = r.data;
      let treeData = Util.buildTree(r.data, 'id', 'parentId', 'children')
      this.setState({
        authTree: treeData,
        tree1: treeData
      })
      let _uuids = this.props.match.params.uuids || '';
      if (_uuids) {
        this.getRoleData(_uuids);
      }
    }).catch(r => {

    })
  }

  handleBack = (e) => {
    e.preventDefault();
    this.props.history.goBack()
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const uuids = this.props.match.params.uuids || '';

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      let premesIds = Array.from(new Set([...this.state.treeChecked1.checked, ...this.state.treeChecked1.halfChecked, ...this.state.treeChecked2.checked, ...this.state.treeChecked2.halfChecked, ...this.state.treeChecked3.checked, ...this.state.treeChecked3.halfChecked])).join(",");
      let params = {
        uuids,
        ...values,
        premesIds
      }
      if (!premesIds) {
        Util.alert('请选择角色的权限', { type: 'error' });
        return;
      }
      this.carryOnSubmit(params)
    })
  }

  //确认提交
  carryOnSubmit = (params) => {
    this.setState({
      _loading:true
    })
    api.ajax('POST', '@/sso/ecRole/save', {
      ...params,
      type: 5,
    }).then(r => {
      if (!this._isMounted) {
        return
      }

      Util.alert(r.msg, {
        type: "success",
        callback: () => {
          this.setState({
            _loading: false
          })
          this.props.history.goBack()
        }
      })
    }).catch(r => {
      this.setState({
        _loading:false
      })
      Util.alert(r.msg, { type: 'error' });
    })
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
      let obj = this.getObjByIdFromFlatTree(selectId)
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
    if (e.checked) {
      this.handleSelect([e.node.props.eventKey], e, index)
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
    parentId = parentId.toString();
    let parentObj = this.getObjByIdFromFlatTree(parentId)
    let childrenAllCheck = 0
    let childrenHalfCheck = 0
    //父元素对应的树
    let treeCheckedKey = 'treeChecked' + index;
    let treeChecked = this.state[treeCheckedKey]
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
        treeList.push(this.getObjByIdFromFlatTree(item))
      }
    })
    return treeList
  }

  renderAuthTreeText = (title, arr) => {
    let dataArr = [];
    if (!arr) {
      return [{ title: title, content: title }]
    }
    arr.map((item) => {
      let textArr = []
      let arr2 = this.state.treeChecked2.checked.concat(this.state.treeChecked2.halfChecked);
      let id2 = item.id.toString()
      let isIn = arr2.indexOf(id2);
      if (isIn < 0) {
        return
      }
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
      dataArr.push({ title: title, content: '(' + item.name + ')' + textArr.join('、') })
    })
    return dataArr
  }

  // 渲染只读结构
  renderAuthTreeReadonly = () => {
    let data = this.getAuthTreeReadonly();
    let renderData = [];
    let listData = []
    data.map((item, i) => {
      let content = this.renderAuthTreeText(item.name, item.children)
      listData.push.apply(listData, content)
    });
    listData.map((item, i) => {
      renderData.push(
        <div className={less.tree_read_item} key={i}>
          <div className={less.tree_title}>{item.title}</div>
          <div className={less.tree_content}>
            <span>{item.content}</span>
          </div>
        </div>
      )
    });
    return renderData
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
  baseParams = {
	  subPlatformId:5
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
  columns = [{
    title: '姓名',
    dataIndex: 'username',
    key: 'username',
    sorter: true,
    width: 120
  }, {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    sorter: true,
    width: 100,
    render: (text, record) => {
      if (text == 1) {
        return <span>男</span>
      } else if (text == 0) {
        return <span>女</span>
      } else {
        return '-'
      }
    },
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    sorter: true,
    width: 200
  }, {
    title: '创建时间',
    dataIndex: 'createTimeStr',
    key: 'createTimeStr',
    width: 200
  }]

  render() {
    const { getFieldProps } = this.props.form;
    // 整体栅格布局
    const formColLayout = {
      offset: 0,
      span: 24
    }
    // 表单栅格布局
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 9 }
    }

    // 表单栅格布局
    const formItemLayoutLg = {
      labelCol: { span: 3 },
      wrapperCol: { span: 13 }
    }
    // 表单按钮或上传等区域
    const wrapperColLayout = { wrapperCol: { span: 18, offset: 6 } }

    const isShow = this.props.match.params.uuids ? { display: 'block' } : { display: 'none' }

    return (
      <div>
        <Card bordered={false} className="mb10" title="角色信息">
          <Form horizontal>
            <Row>
              <Col {...formColLayout}>
                <FormItem
                  {...formItemLayout}
                  label="角色名"
                >
                  <Input
                    maxLength={20}
                    {...getFieldProps('name', {
                      rules: [
                        { required: true, message: '请输入角色名' },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col {...formColLayout}>
                <FormItem
                  {...formItemLayoutLg}
                  label="备注"
                >
                  <Input
                    type="textarea"
                    maxLength={200}
                    rows={4}
                    {...getFieldProps('remark', {
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false} className="mb10" title="当前已选权限">
          <Row gutter={16} className={[less.tree_read, 'clearfix'].join(' ')}>
            {this.renderAuthTreeReadonly()}
          </Row>
        </Card>
        <Card bordered={false} className="mb10" title="角色分配">
          <Row className={less.table_area}>
            <Col span="8" className={less.table_box}>
              <h4 className={less.table_box_title}>模块</h4>
              <div className={less.table_box_list}>
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
            <Col span="8" className={less.table_box}>
              <h4 className={less.table_box_title}>功能</h4>
              <div className={less.table_box_list}>
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
            <Col span="8" className={less.table_box}>
              <h4 className={less.table_box_title}>操作</h4>
              <div className={less.table_box_list}>
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
        <Card bordered={false} title="该角色已关联子账号" style={isShow}>
          <BaseTable
            methods="POST"
            url="@/sso/ecUser/getUserListForRole"
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns}
          />
        </Card>
        <BaseAffix>
          <Button type="primary" onClick={this.handleBack}>返回</Button>
          <Button type="primary" onClick={this.handleSubmit} className="ml10" loading={this.state._loading}>保存</Button>
        </BaseAffix>
      </div>
    )
  }
}

export default Form.create()(Edit)