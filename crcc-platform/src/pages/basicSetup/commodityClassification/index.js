import { Card, Switch ,Modal,Alert,Button} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import ModalForm from './modalForm';
import AuthButton from '@/components/authButton'
import { timingSafeEqual } from 'crypto';

const confirm = Modal.confirm;
class commodityClassification extends React.Component {
  state = {
    loading: false,
    tableState: 0,
    tableSet: {
      level: 1,
      pid: [],
    },//表格三级信息
    tableNav:[],
    modalShow: false,
    modalData: {},
  }
  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  formList = [
    {
      type: 'INPUT',
      field: 'name',
      label: '分类名称',
      placeholder: '分类名称'
    }
  ]
  handleFilter = (p, isSend = true) => {
    this.baseParams = {
      ...this.baseParams,
      ...p,
    }
    if (isSend) {
      this.reloadTableData();
    }
  }
  baseParams = {
    level: this.state.tableSet.level,
    parenId: this.state.tableSet.pid[this.state.tableSet.pid.length - 1] || ""
  }

  resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  reloadTableData(state = 1) {
    this.handelToLoadTable(state, 'tableState');
  }
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }

  columns = () => {
    return [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        width:100,
        sorter: true
      },
      {
        title: '显示',
        dataIndex: 'display',
        key: 'display',
        width:100,
        sorter: true,
        render: (text, record) => (
          <Switch checkedChildren="开" unCheckedChildren="关"
            defaultChecked={record.display == '1'}
            onChange={(checked) => { this.handleSwitchToShow(checked, record.uuids) }} />
        )
      },
      {
        title: '推荐',
        dataIndex: 'recommend',
        key: 'recommend',
        width:100,
        sorter: true,
        render: (text, record) => (
          <Switch checkedChildren="开" unCheckedChildren="关"
            defaultChecked={record.recommend == "1"}
            onChange={(checked) => { this.handleSwitchToRecommend(checked, record.uuids) }} />
        )
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width:260,
        render: (text, record) => {
          if (this.state.tableSet.level === 1) {
            return (
              <span>
                <a href="javascript:void(0);" onClick={() => this.handleToNext(record)}>查看下一级</a>
                <span className="ant-divider"></span>
                <AuthButton elmType="a" onClick={() => { this.handleToEditor(record) }}>编辑</AuthButton>
                <span className="ant-divider"></span>
                <AuthButton elmType="a" onClick={() => { this.handleToDel(record.uuids) }}>删除</AuthButton>
              </span>
            )
          } else if (this.state.tableSet.level === 2) {
            return (
              <span>
                <a href="javascript:void(0);" onClick={() => this.handleToNext(record)}>查看下一级</a>
                <span className="ant-divider"></span>
                <a href="javascript:void(0);" onClick={this.handleToBack}>返回</a>
                <span className="ant-divider"></span>
                <AuthButton elmType="a" onClick={() => { this.handleToEditor(record) }}>编辑</AuthButton>
                <span className="ant-divider"></span>
                <AuthButton elmType="a" onClick={() => { this.handleToDel(record.uuids) }}>删除</AuthButton>
              </span>
            )
          } else {
            return (
              <span>
                <a href="javascript:void(0);" onClick={this.handleToBack}>返回</a>
                <span className="ant-divider"></span>
                <AuthButton elmType="a" onClick={() => { this.handleToEditor(record) }}>编辑</AuthButton>
                <span className="ant-divider"></span>
                <AuthButton elmType="a" onClick={() => { this.handleToDel(record.uuids) }}>删除</AuthButton>
              </span>
            )
          }
        }
      }
    ]
  }
  //查看下一级
  handleToNext = (record) => {
    let pid=record.id;
    let tableNav=this.state.tableNav
    tableNav.push(record.name)
    let cur = {};
    cur.pid = this.state.tableSet.pid;
    cur.pid[cur.pid.length] = pid;
    cur.level = this.state.tableSet.level;
    cur.level++;
    this.setState({
      tableSet: cur,
      tableNav
    })
    this.baseParams = {
      level: cur.level,
      parenId: cur.pid[cur.pid.length - 1] || ""
    }
    this.reloadTableData();
  }
  //返回上一级
  handleToBack = () => {
    let cur = {};
    let tableNav=this.state.tableNav
    tableNav.pop()
    cur.pid = this.state.tableSet.pid;
    cur.pid.splice(cur.pid.length - 1, 1);
    cur.level = this.state.tableSet.level;
    cur.level--;
    this.setState({
      tableSet: cur,
      tableNav
    })
    this.baseParams = {
      level: cur.level,
      parenId: cur.pid[cur.pid.length - 1] || ""
    }
    this.reloadTableData();
  }
  //编辑
  handleToEditor = (obj) => {
    obj.level = obj.level + '';
    this.setState({
      modalShow: true,
      modalData: obj
    })
  }
  //添加
  handleToAdd = () => {
    let cur = {};
    cur.level = this.state.tableSet.level + '';
    this.setState({
      modalShow: true,
      modalData: cur
    })
  }
  //删除
  handleToDel = (uuids) => {
    let _this = this;
    confirm({
      title: '是否删除该商品',
      onOk() {
        _this.delSubmit(uuids)
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }

  delSubmit = (uuids) => {
    api.ajax('PUT', '@/base/ecGoodsClass/delete', [
      uuids
    ]).then(r => {
      if (!this._isMounted) { return; }
      Util.alert(r.msg, { type: 'success' });
      this.reloadTableData();
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }

  modalOnOk = (obj) => {
    if (obj.level != '1') {
      obj.parenId = this.state.tableSet.pid[parseInt(obj.level) - 2] + '';
    } else {
      obj.parenId = '-1';
    }
    this.setState({
      loading: true
    })
    //如果返回的数据中有uuids，则是编辑
    let _this = this;
    api.ajax('POST', '@/base/ecGoodsClass/save', {
      ...obj
    }).then(r => {
      if (!_this._isMounted) { return; }
      Util.alert(r.msg, { type: 'success' });
      this.reloadTableData();
      this.setState({
        modalShow: false,
        loading: false
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.setState({
        loading: false
      })
    })
  }
  modalOnCancel = () => {
    this.setState({
      modalShow: false
    })
  }

  modalObj = {
    onOk: this.modalOnOk,
    onCancel: this.modalOnCancel
  }

  //显示
  handleSwitchToShow = (checked, uuids) => {
    let _this = this;
    api.ajax('POST', '@/base/ecGoodsClass/displayOff', {
      uuids,
      display: checked ? 1 : 0
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.reloadTableData();
    })
  }
  //推荐
  handleSwitchToRecommend = (checked, uuids) => {
    let _this = this;
    api.ajax('POST', '@/base/ecGoodsClass/recommendOff', {
      uuids,
      recommend: checked ? 1 : 0
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.reloadTableData();
    })
  }

 //刷新首页redis中的分类
  handToRefresh = () => {
    api.ajax("GET","@/newcms/indexHome/syncClass",{}).then((r)=>{
      Util.alert("刷新成功", { type: 'success' });
    }).catch(r => {
      Util.alert("刷新失败，请联系管理员", { type: 'error' });
    })
  }



  //渲染显示当前级别
  renderAlert=()=>{
    if(this.state.tableNav.length>0){
      return <Alert type="info" showIcon="true" message={'当前分类：'+this.state.tableNav.join(' > ')}/>
    }
    return <Alert type="info" showIcon="true" message={'当前分类：全部'}/>
  }

  render() {

    return (
      <div>
        <Card bordered={false}>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter}></BaseForm>
          <div className="toolbar">
            <AuthButton type="primary" onClick={this.handToRefresh}>刷新首页分类</AuthButton>
            <AuthButton type="primary" onClick={this.handleToAdd}>添加</AuthButton>
          </div>
          {this.renderAlert()}
          <BaseTable
            url='@/base/ecGoodsClass/platformPage'
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns()} />
        </Card>
        <ModalForm
          visible={this.state.modalShow}
          info={this.state.modalData}
          {...this.modalObj}
          confirmLoading={this.state.loading}></ModalForm>
      </div>
    )
  }
}
export default commodityClassification;