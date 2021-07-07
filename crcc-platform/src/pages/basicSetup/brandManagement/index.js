import {Card, Button, Switch, Modal} from 'antd';
import api from '@/framework/axios';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import Util from "@/utils/util";

const imageOrigin = SystemConfig.configs.resourceUrl;
const confirm = Modal.confirm;

class brandManagement extends React.Component {
  state = {
    loading: false,
    tableState: 0
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
      field: 'brandName',
      label: '品牌名称',
      placeholder: '品牌名称'
    },
    {
      type: 'INPUT',
      field: 'brandEname',
      label: '品牌英文名称',
      placeholder: '品牌英文名称'
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
      querysort: "sortOrder",//排序字段
      order: 'asc',
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
        title: '品牌图片标识',
        dataIndex: 'logo',
        key: 'logo',
        width: 150,
        render: (text, record) => (
          <img src={imageOrigin+record.logo} style={{ width: 50,height:50,display:record.logo?'block':'none' }}></img>
        )
      },
      {
        title: '品牌名称',
        dataIndex: 'brandName',
        key: 'brandName',
        width: 250
      },
      {
        title: '状态',
        dataIndex: 'display',
        key: 'display',
        width: 100,
        render: (text, record) => (
          <Switch checkedChildren="开" unCheckedChildren="关"
            defaultChecked={record.display == 1}
            onChange={(checked) => { this.handleSwitchToShow(record.uuids, checked) }} />
        )
      },
      {
        title: '推荐',
        dataIndex: 'recommend',
        key: 'recommend',
        width: 100,
        render: (text, record) => (
          <Switch checkedChildren="开" unCheckedChildren="关"
            defaultChecked={record.recommend == 1}
            onChange={(checked) => { this.handleSwitchToRecommend(record.uuids, checked) }} />
        )
      },
      {
        title: '排序',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        sortOrder:'ascend',
        width: 100
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        widt: 100,
        render: (text, record) => (
          <span>
            <a href="javascript:void(0);" onClick={() => { this.handleToEditor(record.uuids) }}>编辑</a>
            <span className="ant-divider"></span>
            <a href="javascript:void(0);" onClick={() => { this.handleToDelete(record.uuids) }}>删除</a>
          </span>)
      }
    ]
  }

  //显示
  handleSwitchToShow = (uuids, checked) => {
    let _this = this;
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('POST', '@/base/ecBrand/displayOff', {
      uuids,
      display: checked ? 1 : 0
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        loading: false
      })
    }).catch(r => {
      this.setState({
        loading: false
      })
      this.reloadTableData();
    })
  }
  //推荐
  handleSwitchToRecommend = (uuids, checked) => {
    let _this = this;
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('POST', '@/base/ecBrand/recommendOff', {
      uuids,
      recommend: checked ? 1 : 0
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        loading: false
      })
    }).catch(r => {
      this.setState({
        loading: false
      })
      this.reloadTableData();
    })
  }
  //编辑
  handleToEditor = (uuids) => {
    this.props.history.push('/basicSetup/addBrand' + "/" + uuids);
  }
  //添加
  handleToAdd = () => {
    this.props.history.push('/basicSetup/addBrand');
  }

  //删除
    handleToDelete=(uuids)=>{
    console.log(uuids)
        confirm({
            title: '您是否确认要删除该条记录吗？',
            onOk() {
                api.ajax('PUT', '@/merchandise/ecBrand/crccPortal/deleteByUuids',
                    [uuids]
                ).then(r => {
                  location.reload();
                }).catch(r => {
                    this.setState({
                        loading: false
                    })
                    this.reloadTableData();
                })
            },
            onCancel() {
                Util.alert('已取消操作');
            },
        });

    }

  render() {
    return (
      <div>
        <Card bordered={false}>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter}></BaseForm>
          <div className="toolbar">
            <Button type="primary" onClick={this.handleToAdd}>添加</Button>
          </div>
          <BaseTable
            url='@/merchandise/ecBrand/crccPortal/queryAllBrand'
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns()} />
        </Card>
      </div>
    )
  }
}
export default brandManagement;