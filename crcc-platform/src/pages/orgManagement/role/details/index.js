import { Card, Table, Row, Col, Button, Tooltip } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import BaseDetails from '@/components/baseDetails'
import BaseTable from '@/components/baseTable'
import BaseAffix from '@/components/baseAffix';
import Util from '@/utils/util';
import less from './index.less'

class Details extends React.Component {

  _isMounted = false

  state = {
    loading: false,
    // 个人信息
    roleInfo: {},
    // 权限列表
    dataSourceRole: [],
    authTree: [],

    tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.

    // 选择树
    treeChecked1: { checked: [], halfChecked: [] },
    treeChecked2: { checked: [], halfChecked: [] },
    treeChecked3: { checked: [], halfChecked: [] },
  }

  flatTree = []//扁平化的权限树

  componentWillMount() {
    this._isMounted = true;
    // 进入页面加载数据
    const uuids = this.props.match.params.uuids;
	this.baseParams.roleId = this.props.match.params.id;
    this.baseParams.uuids = uuids;
    this.getData(uuids);
    this.getuusid();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //角色查看详情接口
  getData = (uuids) => {
    api.ajax('GET', '@/sso/ecRole/get', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return
      }
      this.setState({
        roleInfo: r.data
      })
    }).catch(r => {

    })
  }

  getuusid() {
    api.ajax('POST', '@/sso/loginControl/getUserUuids').then(r => {
      this.getTreeData(r.data);
    }).catch(r => {
    })
  }

  //当前登录角色查询权限接口	
  getTreeData = (uuids) => {
	  var type=5;
    api.ajax('GET', '@/sso/ecUser/queryAuthDataList', {
      uuids,type
    }).then(r => {
      if (!this._isMounted) {
        return
      }

      this.flatTree = r.data;
      let treeData = Util.buildTree(r.data, 'id', 'parentId', 'children')
      this.setState({
        authTree: treeData,
      })
      let _uuids = this.props.match.params.uuids || '';
      this.getRoleData(_uuids);
    }).catch(r => {

    })
  }

  handleBack = (e) => {
    e.preventDefault();
    this.props.history.goBack()
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

  // 导出使用该角色的子账户明细接口
  exportExcel = () => {
    window.open(
      window.location.origin +
      '/api' +
      '/sso/ecRole/exportUserListByRoleId' +
      '?' + 'uuids=' + this.props.match.params.uuids
    )
  }

  toEdit = () => {
    this.props.history.push('/orgManagement/role/edit/' + this.state.roleInfo.uuids+'/'+this.state.roleInfo.id);
  }

  extraOptions = (type) => {
    if (type == 1) {
      if(this.state.roleInfo.roleFlag==1){
        return <span></span>
      }
      return (
        <div className="ant-card-extra-div">
          
        </div>
      )
    } else if (type == 2) {
      return (
        <div className="ant-card-extra-div">
        </div>
      )
    }
    else { return null }
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
      listData.push.apply(listData,content)
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
    sorter: true,
    width: 200
  }]

  render() {
    return (
      <div>
        <Card bordered={false} className="mb10" title="角色信息" extra={this.extraOptions(1)}>
          <Row gutter={16}>
            <Col span={24}>
              <Row >
                <Col span={24}>
                  <BaseDetails title="角色名称" >
                    {this.state.roleInfo.name}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <BaseDetails title="创建时间" >
                    {this.state.roleInfo.createTime ? moment(this.state.roleInfo.createTime).format('YYYY-MM-DD hh:mm:ss') : ''}
                  </BaseDetails>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <BaseDetails title="备注" >
                    {this.state.roleInfo.remark}
                  </BaseDetails>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} className="mb10" title="权限展示">
          <Row gutter={16} className={[less.tree_read, 'clearfix'].join(' ')}>
            {this.renderAuthTreeReadonly()}
          </Row>
        </Card>
        <Card bordered={false} title="使用该角色的子账号清单" extra={this.extraOptions(2)}>
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
        </BaseAffix>
      </div>
    )
  }
}

export default Details