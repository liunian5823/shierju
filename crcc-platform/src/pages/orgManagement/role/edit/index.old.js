import { Card, Row, Col, Form, Input, Select, Button, Tree, Modal } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import BaseAffix from '@/components/baseAffix';
import less from './index.less'

const confirm = Modal.confirm;

const TreeNode = Tree.TreeNode;

const FormItem = Form.Item;
const Option = Select.Option;

class Edit extends React.Component {

  _isMounted = false;

  state = {
    authTree: [],
    checkedKeys: [],
  }

  flatTree = []//扁平化的权限树

  componentWillMount() {
    this._isMounted = true;
    let uuids = this.props.match.params.uuids || '';
    if (uuids) {
      this.getData(uuids)
      this.getRoleData(uuids);
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
      // to_do
      let checkedKeys = [];
      r.data.map((item) => {
        checkedKeys.push('' + item.id)
      })
      this.setState({
        checkedKeys
      })
    }).catch(r => {

    })
  }

  //当前登录角色查询权限接口	
  getTreeData = (uuids) => {
    api.ajax('GET', '@/sso/ecUser/queryAuthDataList', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return
      }

      this.flatTree = r.data;
      this.setState({
        authTree: Util.buildTree(r.data, 'id', 'parentId', 'children')
      })
    }).catch(r => {

    })
  }

  // 获得当前节点和子节点的全部id
  getChildrenId = (arr, list) => {
    if (!arr) { return null };
    arr.map((v) => {
      list.push('' + v.id);
      if (v.children && v.children.length) {
        this.getChildrenId(v.children, list);
      }
    });
  }

  getParentId = (id, list) => {
    if (id == '') {
      return
    }
    for (let i = 0; i < this.flatTree.length; i++) {
      if (this.flatTree[i].id == id) {
        list.push('' + id);
        this.getParentId(this.flatTree[i].parentId, list)
        break;
      }
    }
  }

  //获得所有的兄弟元素 并且判断都没有选中
  brotherNotChecked = (parentId, id) => {
    let brotherList = [];
    let brotherListChecked = [];
    let checkedKeys = this.state.checkedKeys;
    let authOneList = this.state.authTree;
    for (let i = 0; i < authOneList.length; i++) {
      if (parentId == authOneList[i].id) {
        brotherList = authOneList[i].children;
        break;
      }
    }
    for (let j = 0; j < brotherList.length; j++) {
      let index = checkedKeys.indexOf('' + brotherList[j].id)
      if (index > -1) {
        brotherListChecked.push(brotherList[j].id)
      }
    }
    if (brotherListChecked.length == 0) {
      return true
    }
    return false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let _this = this;

    const uuids = this.props.match.params.uuids || '';

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      let params = {
        uuids,
        ...values,
        premesIds: this.state.checkedKeys.join(",")
      }
      if (this.state.checkedKeys.length == 0) {
        confirm({
          title: '您没有未该角色设置任何权限，是否继续创建该角色？',
          onOk() {
            _this.carryOnSubmit(params)
          },
          onCancel() {
            Util.alert('已取消操作');
          },
        });
        return;
      }
      this.carryOnSubmit(params)
    })
  }

  carryOnSubmit = (params) => {
    api.ajax('POST', '@/sso/ecRole/save', {
      ...params,
      type: 5,
    }).then(r => {
      if (!this._isMounted) {
        return
      }

      Util.alert(r.msg, { type: 'success' });
      this.props.history.goBack()
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }

  handleSelect = (selectedKeys) => {
    if (this.state.checkedKeys.indexOf(selectedKeys[0]) !== -1) {
      this.changeTreeStatus(selectedKeys[0], false)
    } else {
      this.changeTreeStatus(selectedKeys[0], true)
    }
  }

  handleCheck = (checkedKeys, info) => {
    this.changeTreeStatus(info.node.props.eventKey, info.checked)
  }

  //统一处理
  changeTreeStatus = (id, checked) => {
    let checkedKeys = this.state.checkedKeys;

    // 获得该数组及其所有子元素
    let obj = {};
    for (let i = 0; i < this.flatTree.length; i++) {
      if (this.flatTree[i].id == id) {
        obj = this.flatTree[i];
        break;
      }
    }
    // 获得自身及其所有子元素
    const childList = ['' + obj.id];
    if (obj.premesType == 1) {
      this.getChildrenId(obj.children, childList)
    }
    //获得自身的父元素
    const parentList = [];
    this.getParentId(obj.parentId, parentList)

    if (checked) {
      // 如果是选中该元素，则将其所有子元素去重添加至选中数组
      checkedKeys = Array.from(new Set([...checkedKeys, ...childList, ...parentList]));
    } else {
      // 否则将其所有子元素删除
      childList.map(v => {
        let index = checkedKeys.indexOf(v);
        if (index !== -1) {
          checkedKeys.splice(index, 1);
        }
      })
      //取消二级菜单元素时检查兄弟元素父元素是否选中
      let parentId = '' + obj.parentId
      if (obj.premesType == 1 && parentId != '-1' && this.brotherNotChecked(parentId, '' + obj.id)) {
        let i = checkedKeys.indexOf(parentId)
        checkedKeys.splice(i, 1);
      }
    }

    this.setState({
      checkedKeys
    });
  }

  handleBack = (e) => {
    e.preventDefault();
    this.props.history.goBack()
  }

  renderTree = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={`${item.id}`}>
            {this.renderTree(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.name} key={`${item.id}`} />
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    // 整体栅格布局
    const formColLayout = {
      offset: 2,
      span: 16
    }
    // 表单栅格布局
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    // 表单按钮或上传等区域
    const wrapperColLayout = { wrapperCol: { span: 18, offset: 6 } }


    const treeList = this.renderTree(this.state.authTree);

    return (
      <div>
        <Card bordered={false}>
          <Form horizontal>
            <Row>
              <Col {...formColLayout}>
                <FormItem
                  {...formItemLayout}
                  label="角色名"
                >
                  <Input
                    {...getFieldProps('name', {
                      rules: [
                        { required: true, message: '请输入角色名' },
                        { max: 20, message: '请输入少于20个字符' },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col {...formColLayout}>
                <FormItem
                  {...formItemLayout}
                  label="角色权限"
                >
                  <div className={less.tree_box}>
                    <Tree
                      multiple={true}
                      checkable={true}
                      checkStrictly={true}
                      onCheck={this.handleCheck}
                      checkedKeys={this.state.checkedKeys}
                      onSelect={this.handleSelect}
                      selectedKeys={[]}
                    >
                      {treeList}
                    </Tree>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col {...formColLayout}>
                <FormItem
                  {...formItemLayout}
                  label="备注"
                >
                  <Input
                    type="textarea"
                    rows={4}
                    {...getFieldProps('remark', {
                      rules: [
                        { max: 100, message: '请输入少于100个字符' },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <BaseAffix>
          <Button type="primary" onClick={this.handleSubmit} className="mr10">保存</Button>
          <Button type="primary" onClick={this.handleBack}>返回</Button>
        </BaseAffix>
      </div>
    )
  }
}

export default Form.create()(Edit)