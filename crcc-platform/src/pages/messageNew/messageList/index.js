import { Card, Table, Button, Tabs, Modal ,message,Popconfirm,Row,Col} from 'antd'
// import AuthButton from '@/components/authButton'
import Util from '@/utils/util';
import api from '@/framework/axios'//请求接口的封装
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import BaseTableCenter from '@/components/baseTableCenter'
import less from './index.less'
const TabPane = Tabs.TabPane
const confirm = Modal.confirm;


class MessageList extends React.Component {

  _isMounted = false
  _userInfo = null
  activeTab = "1"
  state = {
    loading: false,

    tableState1: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    tableState2: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    tableState3: 0,
    tableState4: 0,
    tableState5: 0,
    tableState6: 0,
    // modal
    visible: false,
    modalContent: {},

    reloadTimes: 0,//当前激活的tab,
    haveSelection: true,
    modeData:[],
    bottom:false,
    selected:false,
    queryDetails:{},
    selectedCompanyIndex: [],

  }

  // tab1和2公用的筛选
  formList = [
    {
      type: 'SELECT',
      field: 'subId',
      label: '消息模块',
      placeholder: '请选择消息模块',
      list: [{ id: '', value: '请选择模块' }, { id: '0', value: '铁建商城' }, { id: '3', value: '物资销售' }, { id: '4', value: '物资采购' }, { id: '6', value: '物资循环' }, { id: '9', value: '招标采购' }]
    },
    {
      type: 'INPUT',
      field: 'content',
      label: '消息内容',
      placeholder: '请输入'
    },
    {
      type: 'SELECT',
      field: 'messageType',
      label: '消息类型',
      placeholder: '请选择消息类型',
      list: [{ id: '', value: '请选择类型' }, { id: '1', value: '系统消息' }, { id: '4', value: '交易消息' }]
    },
    {
      type: 'RANGE',
      field: 'times',
      label: '发布时间',
      placeholder: '请选择筛选时间段'
    },
  ]

  // tab1和2公用的筛选
  // formList2 = [
  //   {
  //     type: 'SELECT',
  //     field: 'messageType',
  //     label: '消息类型',
  //     placeholder: '请选择消息类型',
  //     list: [{ id: '', value: '请选择类型' }, { id: '1', value: '系统通知' }, { id: '2', value: '交易提醒' }]
  //   },
  //   {
  //     type: 'INPUT',
  //     field: 'Content',
  //     label: '消息内容',
  //     placeholder: '请输入消息内容'
  //   },
  //   {
  //     type: 'RANGE',
  //     field: 'times',
  //     label: '发布日期',
  //     placeholder: '请选择筛选时间段'
  //   },
  // ]

  importantFilter = ['subId', 'content']

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

  //设置被选中的列表项
  setSelectedItems = (selectedRows, selectedRowKeys) => {
    this.setState({
        modeData: selectedRows,
        selectedCompanyIndex:selectedRowKeys
    })
    // this.state.modeData = items;
    // console.log('&&&&&&&',items)
}

clear = ()=>{
  this.setState({
    modeData: [],
    selectedCompanyIndex:[],
    
  });
}
// setSelect=(select)=>{
//   console.log('hhh',select)
//   this.setState({
//     selected:select
//   })

// }
  //批量操作
  operation=()=>{
    // console.log('5555')
    this.setState({
      bottom:true
    })
    
    
  }
  
  delete=()=>{
    let modeDatas = this.state.modeData;
    // console.log('kkk',modeDatas)
    let params = {};
    let str = '';
    if (this.state.modeData.length <= 0) {
      Util.alert("未选中任何值");
      return;
  }else {
    confirm({
        title: '您是否确认批量删除',
        placement: "topRight",
        onOk() {
            modeDatas.map((item, index) => {
              str += item.uuids + ','
              
            })
            if(str.length > 0){
              str = str.substr(0,str.length-1)
            }
            // console.log('666',{str})
            let uuids = {str}
            params.uuids = uuids;
            api.ajax("GET", "@/platform/platformMessage/deleteListByuuids", {uuids:str}
            ).then((r) => {
                if (r.code != 200) {
                    message.error(r.msg)
                } else {
                    message.success(r.msg)
                    this.timerEnd = setTimeout(() => {
                        window.location.reload();
                    }, 500)
                }
            })
        }
    })
}
  }
  read=()=>{
    let modeDatas = this.state.modeData;
    let number = this.state.modeData.length;
    // console.log('kkk',modeDatas)
    let params = {};
    let str = '';
    if (this.state.modeData.length <= 0) {
      Util.alert("未选中任何值");
      return;
  }else {
    confirm({
        title: '您是否确认批量已读',
        placement: "topRight",
        onOk() {
            modeDatas.map((item, index) => {
              str += item.uuids + ','
              
            })
            if(str.length > 0){
              str = str.substr(0,str.length-1)
            }
            
            api.ajax("GET", "@/platform/platformMessage/readOnlyListByuuids", {uuids:str}
            ).then((r) => {
                if (r.code != 200) {
                    message.error(r.msg)
                } else {
                    message.success(`已将${number}条信息标记为已读状态`)
                    this.timerEnd = setTimeout(() => {
                        window.location.reload();
                    }, 500)
                }
            })
        }
    })
}
  }
  onCancel=()=>{
    this.setState({
      bottom:false
    })
  }

  initDataFn = () => {
    this.baseParams2 = {
      ...this.baseParams2,
      receiver: this._userInfo.id,//接受人id
      companyId: this._userInfo.companyId,//公司id
    }
    this.handelToLoadTable(1, 'tableState2');
  }

  reloadTableData(state = 1) {
    let key = this.activeTab;
    if (this._userInfo) {
      this.handelToLoadTable(state, 'tableState' + key);
    }
  }

  handleFilter = (params, isSend = true) => {
    let key = this.activeTab;
    let beginTime, endTime;
    if (params.times) {
      beginTime = params.times[0] ? moment(params.times[0]).format('YYYY-MM-DD 00:00:00') : '';
      endTime = params.times[1] ? moment(params.times[1]).format('YYYY-MM-DD 23:59:59') : '';
    }
    params.subId = 3;
    // this['baseParams' + key] = {
    //   ...this['baseParams' + key],
    //   ...params,
    //   beginTime,
    //   endTime
    // }
    this.baseParams = {
      ...this.baseParams,
      ...params,
      beginTime,
      endTime
      

    }
    if (isSend) {
      this.reloadTableData();
    }
  }


  handleTabChange = (key) => {
    // this.reloadTableData();
    // this.setState({
    //   reloadTimes: ++this.state.reloadTimes
    // })
    if (0 == key) {
      //未读
      this.baseParams.isReads = 0
      this.baseParams.subId = 10
  } else if (2 == key) {
      //已读
      this.baseParams.isReads = 1
      this.baseParams.subId = 10
  } else if (4 == key) {
      //全部
      this.baseParams.isReads = undefined
  }
  console.log('666666666666',key)
  this.activeTab = key;
  this.reloadTableData();
  }

  handleOk = () => {
    this.setState({
      visible: false
    })
  }

  handleToDetails = (record) => {
    this.setState({
      visible: true,
      
    })
    api.ajax("GET", "@/platform/platformMessage/queryByuuids", {uuids:record.uuids}
    ).then((r) => {
        if (r.code != 200) {
            message.error(r.msg)
        } else {
           this.setState({
            queryDetails:r.data,
           })
           
        }
    })
   
    if(record.isRead == 0){
      record.isRead = 1;
    }
    
    
  }

  handleToDelete=(record)=>{
    api.ajax("GET", "@/platform/platformMessage/deleteByuuids", {uuids:record.uuids}
            ).then((r) => {
                if (r.code != 200) {
                    message.error(r.msg)
                } else {
                    message.success(r.msg)
                    // this.timerEnd = setTimeout(() => {
                    //     window.location.reload();
                    // }, 500)
                    this.reloadTableData();
                }
            })

  }
  handleToRead=(record)=>{
    api.ajax("GET", "@/platform/platformMessage/readOnly", {uuids:record.uuids}
            ).then((r) => {
                if (r.code != 200) {
                    message.error(r.msg)
                } else {
                    message.success('标为已读成功')
                    this.reloadTableData();
                }
            })
  }
  cancel=()=> {
    message.error('点击了取消');
  }

  //发布平台
  orderStaus = (status) => {
    // console.log('999',status)
    if (!status && status!='0') {
        return;
      }
      let tempStatus = '';
      switch (status) {
        case '0':
          tempStatus = '铁建商城';
          break;
        case '3':
          tempStatus = '物资销售';
          break;
        case '4':
          tempStatus = '物资采购';
          break;
        case '6':
          tempStatus = '物资循环';
          break;
        case '9':
            tempStatus = '招标采购';
            break;
        default:
          break;
      }
      // console.log('7777',tempStatus)
      return tempStatus;
  }

  //发布平台
  tempStaus = (status) => {
    if (!status && status!=0) {
        return;
      }
      let tempStatus = '';
      switch (status) {
        case 0:
          tempStatus = '铁建商城';
          break;
        case 3:
          tempStatus = '物资销售';
          break;
        case 4:
          tempStatus = '物资采购';
          break;
        case 6:
          tempStatus = '物资循环';
          break;
        case 9:
            tempStatus = '招标采购';
            break;
        default:
          break;
      }
      return tempStatus;
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
    subId:10,
    isReads:undefined
  }
  
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    console.log('3333',555)
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
    title: '发布平台',
    dataIndex: 'subId',
    key: 'subId',
    width: 120,
    render:(text,record)=>{
    let statusStr = this.orderStaus(text);
    return <div >
            <p>{statusStr?statusStr:'-'}</p>
      </div>
    
    }
  },{
    title: '消息类型',
    dataIndex: 'messageType',
    key: 'messageType',
    sorter: true,
    width: 100,
    render: (text, record) => {
      switch (text) {
        case 1:
          return <span>系统消息</span>
          break;
        case 4:
          return <span>交易消息</span>
          break;
        default:
          return <span>-</span>
          break;
      }
    },
  },{
    title: '发布时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    sorter: true,
    width: 160,
    render: (text) => {
      return <div>
        <p>{moment(text).format("YYYY-MM-DD")}</p>
        <p>{moment(text).format("hh:mm:ss")}</p>
      </div>
    }
  },
  //  {
  //   title: '标题',
  //   dataIndex: 'title',
  //   key: 'title',
  //   sorter: true,
  //   width: 120
  // }, 
  {
    title: '消息内容',
    dataIndex: 'content',
    key: 'content',
    sorter: true,
    render: (text, record) => {
      text = text.replace(/<[^>]+>/g, "");
      if (text.length < 20) {
        return <span>{text}</span>
      } else {
        return <span>{text.substring(0, 20)}...</span>
      }
    },
  },
  //  {
  //   title: '发送人',
  //   dataIndex: 'releaseName',
  //   key: 'releaseName',
  //   width: 80,
  //   render: (text, record) => {
  //     return <span>铁建商城</span>
  //   },
  // },  
  {
    title: '状态',
    dataIndex: 'isRead',
    key: 'isRead',
    width: 80,
    sorter: true,
    render: (text) => {
      if (text == 0) {
        return <span className={less.not_read}>未读</span>
      } else if(text == 1) {
        return <span className={less.allready_read}>已读</span>
      }else{
        return <span>-</span>
      }
    },
  }, {
    title: '操作',
    key: 'options',
    width: 80,
    render: (text, record) => {
      if(record.isRead == 0){
        return(
          <div>
            <p><a href="javascript:void(0)" onClick={() => this.handleToDetails(record)}>查看</a></p>
            {/* <Popconfirm title="您确定要删除么？" onConfirm={this.handleToDelete.bind(this,record)} onCancel={this.cancel}>
            <a href="javascript:void(0)">删除</a>
          </Popconfirm> */}
          <p>
          <Popconfirm title="您确定要标为已读么？" onConfirm={this.handleToRead.bind(this,record)} onCancel={this.cancel}>
          <a href="javascript:void(0)">标为已读</a>
          </Popconfirm>
          </p>
          </div>
        )
      }else{
        return(
          <div>
            <p><a href="javascript:void(0)" onClick={() => this.handleToDetails(record)}>查看</a></p>
            {/* <Popconfirm title="您确定要删除么？" onConfirm={this.handleToDelete.bind(this,record)} onCancel={this.cancel}>
            <a href="javascript:void(0)">删除</a>
          </Popconfirm> */}
          </div>
        )
      }
      
      
     

}
  }]


  render() {
    // const operations = <a href="javascript:void(0)" onClick={() => { this.handleChangeStatus() }}>标为已读</a>;
    const operations = null

    // const formList = this.activeTab == "1" ? this.formList : this.formList2;
    const formList = this.formList;
    let suIds = this.tempStaus(this.state.queryDetails.subId)
    // console.log('222',suIds)
    return (
      <div>
        <Card style={{marginBottom:'10px'}}>
        <BaseForm formList={formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} reloadTimes={this.state.reloadTimes} />
        </Card>
        <Card bordered={false} title="消息通知" extra={<Button type="primary" onClick={this.operation}>批量操作</Button>}>
          {/* <Tabs className={less.tabs} tabBarExtraContent={operations} onTabClick={this.handleTabChange}> */}
          <Tabs className={less.tabs} tabBarExtraContent={operations} onChange={this.handleTabChange}>
            <TabPane tab="全部" key="4" className={less.tabplane}>
              <div className={less.tabplane}>
                <BaseTableCenter
                  url="@/message/ecMessage/pageMessageList"
                  tableState={this.state.tableState1}
                  resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                  baseParams={this.baseParams}
                  haveSelection={this.state.haveSelection}
                  selectedCompanyIndex={this.state.selectedCompanyIndex}
                  setSelectedItems={this.setSelectedItems}
                  // setSelect={this.setSelect}
                  columns={this.columns1}
                  indexkeyWidth={60}
                />
              </div>
            </TabPane>
            <TabPane tab="已读" key="2">
              <div className={less.tabplane}>
                <BaseTableCenter
                  url="@/message/ecMessage/pageMessageList"
                  tableState={this.state.tableState1}
                  resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                  baseParams={this.baseParams}
                  haveSelection={this.state.haveSelection}
                  selectedCompanyIndex={this.state.selectedCompanyIndex}
                  setSelectedItems={this.setSelectedItems}
                  // setSelect={this.setSelect}
                  columns={this.columns1}
                  indexkeyWidth={60}
                />
              </div>
            </TabPane>
            <TabPane tab="未读" key="0">
              <div className={less.tabplane}>
                <BaseTableCenter
                  url="@/message/ecMessage/pageMessageList"
                  tableState={this.state.tableState1}
                  resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                  baseParams={this.baseParams}
                  haveSelection={this.state.haveSelection}
                  selectedCompanyIndex={this.state.selectedCompanyIndex}
                  setSelectedItems={this.setSelectedItems}
                  // setSelect={this.setSelect}
                  columns={this.columns1}
                  indexkeyWidth={60}
                />
              </div>
            </TabPane>
          
          </Tabs>

          <Modal title={this.state.queryDetails.messageType==1 ? '系统消息' :'交易消息'} visible={this.state.visible}
            onCancel={this.handleOk}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleOk}>
                关闭
            </Button>,
            ]}
          >
            <div className={less.titles}>
            <Row>
              <Col span={12}>
                <span>发布平台：</span>
                <span>{suIds}</span>
              </Col>
              <Col span={12}>
                <span>消息类型：</span>
                <span>{this.state.queryDetails.messageType == 1 ? '系统信息' :'交易信息'}</span>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col>
              <span>发布时间：</span>
              <span>{moment(this.state.queryDetails.sendTime).format("YYYY-MM-DD HH:mm:ss")}</span></Col>
            </Row>
            </div>
           <div style={{width:'100%',height:'1px',backgroundColor:'#e9e9e9',margin:'12px 0'}}></div>
           <div className={less.content}>消息内容：</div>
          <div className={less.contents}>{this.state.queryDetails.content}</div>
            
          </Modal>
        </Card>
        <p style={{height:'70px'}}></p>
        <Card id="btn_bottom" className={less.btns} style={{display:this.state.bottom ? 'block' :'none',position:'fixed',bottom:'0px',width:'1300px',zIndex:100}}>
            <span style={{marginRight:'10px'}}>已选{this.state.modeData.length || this.state.modeData.length==0?this.state.modeData.length:'-'}项</span><a href="javascript:void(0)" onClick={this.clear}>清空</a>
            <Button type="ghost" onClick={this.onCancel}>取消</Button>
            <Button type="primary" onClick={this.read}>标为已读</Button>
            {/* <Button className={less.red} onClick={this.delete}>删除</Button> */}
      </Card>
      </div>
    )
  }
}
export default MessageList