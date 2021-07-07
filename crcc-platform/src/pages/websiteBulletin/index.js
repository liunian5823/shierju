import { Card, Table, Button, Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import ModalForm from './modalForm';
import SeeModal from './seeModal';
import {systemConfigPath} from "@/utils/config/systemConfig";

const confirm = Modal.confirm;

class WebsiteBulletin extends React.Component {
  _isMounted = false

  state = {
    _loading: false,
    modalvisible: false,
    seeVisible: false,
    seeModalInfo: ""
  }

  bulletinInfo = ""

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  formList = [
    {
      type: 'SELECT',
      field: 'newsType',
      label: '信息类型',
      placeholder: '请选择信息类型',
      list: [
        {
          id: '2',
          value: '新闻动态'
        },
        {
          id: '1',
          value: '网站公告'
        }
      ]
    },
    {
      type: 'INPUT',
      field: 'title',
      label: '信息标题',
      placeholder: '信息标题'
    },
  ]
  handleFilter = (params, isSend = true) => {
    this.baseParams = {
      ...this.baseParams,
      ...params,
    }
    if (isSend) {
      this.handelToLoadTable();
    }
  }


  handleToSee = (uuids) => {
    // this.setState({
    //   seeVisible: true,
    //   seeModalInfo: info
    // })
      let url="/webNewsDetail/"+uuids;
      window.open(systemConfigPath.jumpCrccmallPage(url))
      
  }
  handleToUpload = (info) => {
    this.initModal.title = "修改信息";
    this.initModal.info = info;
    this.bulletinInfo = info,
      this.setState({
        modalvisible: true
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
    let _this = this;
    api.ajax("PUT", "@/message/ecNews/delete", [
      uuids
    ]).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert('删除成功', { type: 'success' });
      this.handelToLoadTable(2);
    }).catch(r => {
      Util.alert('删除失败', { type: 'error' });
    })
  }

  addMessage = () => {
    this.initModal.title = "发布信息";
    this.initModal.info = "";
    this.bulletinInfo = "";
    this.setState({
      modalvisible: true
    })
  }

  cancelBulletin = () => {
    this.bulletinInfo = "";
    this.setState({
      modalvisible: false
    })
  }
  initModal = {
    onOk: this.saveBulletin,
    onCancel: this.cancelBulletin
  }
  cancelSeeModal = () => {
    this.setState({
      seeVisible: false
    })
  }
  seeInitModal = {
    onCancel: this.cancelSeeModal
  }
  // 跳转页面
  goMessage = () => {
    this.props.history.push(this.props.history.location.pathname + '/edit');
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
  columns = [
    {
      title: '信息标题',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      width: 150,
    },
    {
      title: '信息类型',
      dataIndex: 'newsType',
      key: 'newsType',
      sorter: true,
      render: (text, record) => (
        <span>
          {record.newsType == 1 ? "网站公告" : "新闻动态"}
        </span>
      ),
      width: 100,
    },
    {
      title: '信息内容',
      dataIndex: 'content',
      key: 'content',
      sorter: true,
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
          <AuthButton elmType="a" onClick={() => this.handleToSee(record.uuids)}>详情</AuthButton>
          <span className="ant-divider"></span>
          <AuthButton elmType="a" onClick={() => this.handleToDel(record.uuids)}>删除</AuthButton>
        </span>
      ),
      width: 160,
    }
  ]

  render() {
    return (
      <div>
        <Card bordered={false}>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter}></BaseForm>
          <div className="toolbar">
            <AuthButton type="parimary" onClick={this.goMessage}>发布信息</AuthButton>{/*this.addMessage*/}
          </div>
          <BaseTable
            url="@/message/ecNews/page"
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns}
          />
        </Card>
        <ModalForm
          {...this.initModal}
          loading={this.state._loading}
          visible={this.state.modalvisible}></ModalForm>
        <SeeModal
          {...this.seeInitModal}
          info={this.state.seeModalInfo}
          visible={this.state.seeVisible}></SeeModal>
      </div>
    )
  }
}
export default WebsiteBulletin;