import {
  Card, Button, Modal, Tabs
} from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import AuthButton from '@/components/authButton'
import ModalForm from './modalForm';

import less from './index.less';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class Menu extends React.Component {

  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  activeTab = '1'//当前激活的tab
  state = {
    _loading: false,

    parentIds1: ['-1'],
    parentIds2: ['-1'],
    parentIds3: ['-1'],
	parentIds4: ['-1'],
    parentIds5: ['-1'],
    parentIds6: ['-1'],
	
    // tab1的数据
    tableState1: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    // tab2的数据
    tableState2: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    // tab3的数据
    tableState3: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
	// tab4的数据
    tableState4: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    // tab4的数据
    tableState5: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    // tab4的数据
    tableState6: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.

    // 
    modal: {
      show: false,
    },
    menuObj: {},
    menuType: '3'//所属平台
  }

  formList = [
    {
      type: 'INPUT',
      field: 'name',
      label: '菜单名',
      placeholder: '菜单名'
    }
  ]

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //预处理更新表格
  reloadTableData = (state = 1) => {
    let key = this.activeTab;
    this.handelToLoadTable(state, 'tableState' + key);
  }

  //当tab切换时
  handleTabChange = (key) => {
    this.activeTab = key;
    this['baseParams' + key].parentId = '-1';
    let menuType;
    if (key == '1') {
      menuType = '3'
    } else if (key == '2') {
      menuType = '4'
    } else if (key == '3') {
      menuType = '5'
    } else if (key == '4') {
      menuType = '10'
    } else if (key == '5') {
      menuType = '7'
    } else if (key == '6') {
      menuType = '6'
    }
    this.reloadTableData();
    this.setState({
      ['parentIds' + key]: ['-1'],
      menuType: menuType
    })
  }



  handleFilter = (params) => {
    let key = this.activeTab;
    //根据formList生成的表单输入条件过滤
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      ...params,
    }
    this.reloadTableData();
  }

  handleFilterById = (parentId) => {
    let key = this.activeTab;
    //根据id查询子菜单
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      parentId: parentId
    }
    const parentIds = [...this.state['parentIds' + key]];
    parentIds.push(parentId);
    this.setState({
      ['parentIds' + key]: parentIds
    });

    this.reloadTableData();
  }

  handleFilterBackId = () => {
    let key = this.activeTab;
    //根据id查询子菜单--返回上一级
    let parentIds = [...this.state['parentIds' + key]];
    parentIds.pop();
    const parentId = parentIds.length > 0 ? parentIds[parentIds.length - 1] : '';
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      parentId: parentId
    }
    this.reloadTableData();
    this.setState({
      ['parentIds' + key]: parentIds
    });
  }

  handleToAdd = () => {
    this.openModal(true);
    this.setState({
      menuObj: {}
    })
  }

  handleToEdit = (obj) => {
    this.openModal(true);
    this.setState({
      menuObj: obj
    })
  }

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
    api.ajax('PUT', '@/sso/ecPremes/delete', [
      uuids
    ]).then(r => {
      Util.alert(r.msg, { type: 'success' })
      this.reloadTableData(2);
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' })
    })
  }

  openModal = (ok) => {
    let show = ok ? true : false;
    this.setState({
      modal: {
        ...this.state.modal,
        show
      },
    })
  }
  modalHandle = (ok, params) => {
    if (ok) {
      // 保存
      this.setState({
        _loading: true
      })
      api.ajax('POST', '@/sso/ecPremes/save', params).then(r => {
        Util.alert(r.msg, { type: 'success' })
        this.openModal();
        this.reloadTableData();
        this.setState({
          _loading: false
        })
      }).catch(r => {
        Util.alert(r.msg, { type: 'error' })
        this.setState({
          _loading: false
        })
      })
    } else {
      this.openModal(ok)
    }
  }

  goBackBtn = () => {
    let key = this.activeTab;
    //当查询子菜单时 
    if (this.state['parentIds' + key].length > 1) {
      return <Button onClick={this.handleFilterBackId}>返回</Button>
    } else {
      return null
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
    type: '3',
    parentId: '-1',
  }
  baseParams2 = {
    type: '4',
    parentId: '-1',
  }
  baseParams3 = {
    type: '5',
    parentId: '-1',
  }
  baseParams4 = {
    type: '10',
    parentId: '-1',
  }
  baseParams5 = {
    type: '7',
    parentId: '-1',
  }
  baseParams6 = {
    type: '6',
    parentId: '-1',
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
    title: '菜单名',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    width: 240
  }, {
    title: '路径',
    dataIndex: 'url',
    key: 'url',
    sorter: true,
  }, {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    sorter: true,
    width: 150
  }, {
    title: '操作',
    width: 240,
    key: 'options',
    render: (text, record) => {
      let type;
      if (record.type == 3) {
        type = 1
      } else if (record.type == 4) {
        type = 2
      } else if (record.type == 5) {
        type = 3
      } else if (record.type == 10) {
        type = 4
      } else if (record.type == 7) {
        type = 5
      } else if (record.type == 6) {
        type = 6
      }
      if (this.state['parentIds' + type].length > 1) {
        // 这里只有二级菜单so
        return (
          <span>
            <AuthButton elmType="a" onClick={() => this.handleToEdit(record)}>修改</AuthButton>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToEdit(record)}>修改</a> */}
            <span className="ant-divider"></span>
            <AuthButton elmType="a" onClick={() => this.handleToDel(record.uuids)}>删除</AuthButton>
            {/* <a href="javascript:void(0)" onClick={() => this.handleToDel(record.uuids)}>删除</a> */}
          </span>
        )
      }
      return (
        <span>
          <a href="javascript:void(0)" onClick={() => this.handleFilterById(record.id)}>子菜单查询</a>
          <span className="ant-divider"></span>
          <AuthButton elmType="a" onClick={() => this.handleToEdit(record)}>修改</AuthButton>
          {/* <a href="javascript:void(0)" onClick={() => this.handleToEdit(record)}>修改</a> */}
          <span className="ant-divider"></span>
          <AuthButton elmType="a" onClick={() => this.handleToDel(record.uuids)}>删除</AuthButton>
          {/* <a href="javascript:void(0)" onClick={() => this.handleToDel(record.uuids)}>删除</a> */}
        </span>
      )
    }
  }]

  render() {
    return (
      <div>
        <Card bordered={false}>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
          <div className="toolbar">
            {/* Tool_Button */}
            {this.goBackBtn()}
			{/* <Button type="primary" onClick={this.handleToAdd}>新增</Button> */}
            <AuthButton authName="add" type="primary" onClick={this.handleToAdd}>新增</AuthButton>
          </div>
          <Tabs className={less.tabs} onTabClick={this.handleTabChange}>
            <TabPane tab="供应商菜单" key="1" className={less.tabplane}>
              <div className={less.tabplane}>
                <BaseTable
                  url="@/sso/ecPremes/page"
                  tableState={this.state.tableState1}
                  resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                  baseParams={this.baseParams1}
                  columns={this.columns}
                  indexkeyWidth={120}
                />
              </div>
            </TabPane>
            <TabPane tab="采购商菜单" key="2" >
              <div className={less.tabplane}>
                <BaseTable
                  url="@/sso/ecPremes/page"
                  tableState={this.state.tableState2}
                  resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                  baseParams={this.baseParams2}
                  columns={this.columns}
                  indexkeyWidth={120}
                />
              </div>
            </TabPane>
            <TabPane tab="平台菜单" key="3" >
              <div className={less.tabplane}>
                <BaseTable
                  url="@/sso/ecPremes/page"
                  tableState={this.state.tableState3}
                  resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                  baseParams={this.baseParams3}
                  columns={this.columns}
                  indexkeyWidth={120}
                />
              </div>
            </TabPane>
			<TabPane tab="个人中心菜单" key="4" >
			  <div className={less.tabplane}>
			    <BaseTable
			      url="@/sso/ecPremes/page"
			      tableState={this.state.tableState4}
			      resetTable={(state) => { this.resetTable(state, 'tableState4') }}
			      baseParams={this.baseParams4}
			      columns={this.columns}
			      indexkeyWidth={120}
			    />
			  </div>
			</TabPane>
            <TabPane tab="供应商管理菜单" key="5" >
              <div className={less.tabplane}>
                <BaseTable
                    url="@/sso/ecPremes/page"
                    tableState={this.state.tableState5}
                    resetTable={(state) => { this.resetTable(state, 'tableState5') }}
                    baseParams={this.baseParams5}
                    columns={this.columns}
                    indexkeyWidth={120}
                />
              </div>
            </TabPane>
            <TabPane tab="物资循环菜单" key="6" >
              <div className={less.tabplane}>
                <BaseTable
                    url="@/sso/ecPremes/page"
                    tableState={this.state.tableState6}
                    resetTable={(state) => { this.resetTable(state, 'tableState6') }}
                    baseParams={this.baseParams6}
                    columns={this.columns}
                    indexkeyWidth={120}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
        {/* modal */}
        <ModalForm
          title="菜单管理"
          visible={this.state.modal.show}
          onOk={this.modalHandle}
          menuObj={this.state.menuObj}
          menuType={this.state.menuType}
          loading={this.state._loading}
        />
      </div>
    )
  }
}

export default Menu