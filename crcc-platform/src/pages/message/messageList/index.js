import { Card, Button, Tabs, Modal } from 'antd'
// import AuthButton from '@/components/authButton'
import Util from '@/utils/util';
import api from '@/framework/axios'//请求接口的封装
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import less from './index.less'

const TabPane = Tabs.TabPane


class MessageList extends React.Component {

  _isMounted = false
  _userInfo = null
  activeTab = "1"
  state = {
    loading: false,

    tableState1: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    tableState2: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.

    // modal
    visible: false,
    modalContent: {},

    reloadTimes: 0//当前激活的tab
  }

  // tab1和2公用的筛选
  formList = [
    {
      type: 'SELECT',
      field: 'newsType',
      label: '消息类型',
      placeholder: '请选择消息类型',
      list: [{ id: '1', value: '网站新闻' }, { id: '2', value: '系统公告' }]
    },
    {
      type: 'INPUT',
      field: 'Content',
      label: '消息内容',
      placeholder: '请输入消息内容'
    },
    {
      type: 'RANGE',
      field: 'times',
      label: '发布日期',
      placeholder: '请选择筛选时间段'
    },
  ]

  // tab1和2公用的筛选
  formList2 = [
    {
      type: 'SELECT',
      field: 'messageType',
      label: '消息类型',
      placeholder: '请选择消息类型',
      list: [{ id: '1', value: '系统通知' }, { id: '2', value: '交易提醒' }]
    },
    {
      type: 'INPUT',
      field: 'Content',
      label: '消息内容',
      placeholder: '请输入消息内容'
    },
    {
      type: 'RANGE',
      field: 'times',
      label: '发布日期',
      placeholder: '请选择筛选时间段'
    },
  ]

  importantFilter = ['newsType', 'messageType', 'Content']

  componentWillMount() {
    this._isMounted = true;

    this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
      if (this._userInfo || !obj) { return false }
      this._userInfo = obj;
      // 获得用户基本信息后执行加载回调
      this.initDataFn();
    }.bind(this));//
    PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
  }

  componentWillUnmount() {
    this._isMounted = false;
    PubSub.unsubscribe(this.pubsub_userInfo);
  }

  initDataFn = () => {
    this.baseParams2 = {
      ...this.baseParams2,
      receiver: this._userInfo.id,//接受人id
      companyId: 0,//公司id
    }
    this.handelToLoadTable(1, 'tableState2');
  }

  reloadTableData(state = 1) {
    let key = this.activeTab;
    if(this._userInfo){
      this.handelToLoadTable(state, 'tableState' + key);
    }
  }

  handleFilter = (params, isSend = true) => {
    let key = this.activeTab;
    let beginTime, endTime;
    if (params.times) {
      beginTime = params.times[0] ? moment(params.times[0]).format('YYYY-MM-DD') : '';
      endTime = params.times[1] ? moment(params.times[1]).format('YYYY-MM-DD') : '';
    }
    this['baseParams' + key] = {
      ...this['baseParams' + key],
      ...params,
      beginTime,
      endTime
    }
    if (isSend) {
      this.reloadTableData();
    }
  }


  handleTabChange = (key) => {
    this.activeTab = key;
    this.reloadTableData();
    this.setState({
      reloadTimes: ++this.state.reloadTimes
    })
  }

  handleOk = () => {
    this.setState({
      visible: false
    })
  }

  handleToDetails = (type, obj) => {
    // this.props.history.push('/message/messageList/details/' + id);
    this.setState({
      visible: true,
      modalContent: {
        title: obj.title || obj.tittle,
        content: obj.content,
        newTime: obj.newsTime || obj.sendTime
      }
    })
    let sendUrl = type == 1 ? '@/message/ecNews/get' : '@/message/ecMessage/get';
    if (obj.readDisplay == "未读") {
      api.ajax('GET', sendUrl, {
        uuids: obj.uuids
      }).then(r => {
        this.reloadTableData(2);
      }).catch(r => {
        Util.alert(r.msg, { type: 'error' })
      })
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
  baseParams1 = {}
  baseParams2 = {}
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
  columns1 = [{
    title: '消息类型',
    dataIndex: 'newsType',
    key: 'newsType',
    sorter: true,
    width: 100,
    render: (text, record) => {
      switch (text) {
        case 1:
          return <span>网站新闻</span>
          break;
        case 2:
          return <span>系统公告</span>
          break;
        default:
          return <span>-</span>
          break;
      }
    },
  }, {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    width: 120
  }, {
    title: '内容',
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
  }, {
    title: '发送人',
    dataIndex: 'releaseName',
    key: 'releaseName',
    width: 80,
    render: (text, record) => {
      return <span>铁建商城</span>
    },
  }, {
    title: '发布日期',
    dataIndex: 'newsTime',
    key: 'newsTime',
    sorter: true,
    width: 160,
    render: (text) => {
      return moment(text).format("YYYY-MM-DD")
    }
  }, {
    title: '状态',
    dataIndex: 'readDisplay',
    key: 'readDisplay',
    width: 80,
    render: (text) => {
      if (text == "未读") {
        return <span className={less.not_read}>未读</span>
      } else {
        return <span className={less.allready_read}>已读</span>
      }
    },
    filters: [{
      text: '已读',
      value: '已读',
    }, {
      text: '未读',
      value: '未读',
    }],
    onFilter: (value, record) => {
      if (value == record.readDisplay) {
        return true
      } else {
        return false
      }
    }
  }, {
    title: '操作',
    key: 'options',
    width: 80,
    render: (text, record) => (
      <span>
        <a href="javascript:void(0)" onClick={() => this.handleToDetails(1, record)}>查看</a>
      </span>

    ),
  }]
  columns2 = [{
    title: '消息类型',
    dataIndex: 'messageType',
    key: 'messageType',
    sorter: true,
    width: 100,
    render: (text, record) => {
      switch (text) {
        case 1:
          return <span>系统通知</span>
          break;
        case 2:
          return <span>交易提醒</span>
          break;
        default:
          return <span>-</span>
          break;
      }
    },
  }, {
    title: '标题',
    dataIndex: 'tittle',
    key: 'tittle',
    sorter: true,
    width: 120
  }, {
    title: '内容',
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
  }, {
    title: '发送人',
    dataIndex: 'desUserName',
    key: 'desUserName',
    sorter: true,
    width: 80,
  }, {
    title: '发布日期',
    dataIndex: 'sendTime',
    key: 'sendTime',
    sorter: true,
    width: 160,
    render: (text) => {
      return moment(text).format("YYYY-MM-DD")
    }
  }, {
    title: '状态',
    dataIndex: 'readDisplay',
    key: 'readDisplay',
    width: 80,
    render: (text) => {
      if (text == "未读") {
        return <span className={less.not_read}>未读</span>
      } else {
        return <span className={less.allready_read}>已读</span>
      }
    },
    filters: [{
      text: '已读',
      value: '已读',
    }, {
      text: '未读',
      value: '未读',
    }],
    onFilter: (value, record) => {
      if (value == record.readDisplay) {
        return true
      } else {
        return false
      }
    }
  }, {
    title: '操作',
    key: 'options',
    width: 80,
    render: (text, record) => (
      <span>
        <AuthButton elmType="a" onClick={() => this.handleToDetails(2, record)}>查看</AuthButton>
      </span>
    ),
  }]

  render() {
    // const operations = <a href="javascript:void(0)" onClick={() => { this.handleChangeStatus() }}>标为已读</a>;
    const operations = null

    const formList = this.activeTab == "1" ? this.formList : this.formList2;
    return (
      <Card bordered={false}>
        <BaseForm showMore={true} formList={formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} reloadTimes={this.state.reloadTimes} />
        <Tabs className={less.tabs} tabBarExtraContent={operations} onTabClick={this.handleTabChange}>
          <TabPane tab="网站公告" key="1" className={less.tabplane}>
            <div className={less.tabplane}>
              <BaseTable
                url="@/message/ecNews/page"
                tableState={this.state.tableState1}
                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                baseParams={this.baseParams1}
                columns={this.columns1}
              />
            </div>
          </TabPane>
          <TabPane tab="系统消息" key="2" >
            <div className={less.tabplane}>
              <BaseTable
                notInit={true}
                url="@/message/ecMessage/page"
                tableState={this.state.tableState2}
                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                baseParams={this.baseParams2}
                columns={this.columns2}
              />
            </div>
          </TabPane>
        </Tabs>

        <Modal title={this.state.modalContent.title} visible={this.state.visible}
          onCancel={this.handleOk}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <div dangerouslySetInnerHTML={{ __html: this.state.modalContent.content }} />
          <div className={less.news_time}>{moment(this.state.modalContent.newTime).format("YYYY-MM-DD HH:mm:ss")}</div>
        </Modal>
      </Card>
    )
  }
}
export default MessageList