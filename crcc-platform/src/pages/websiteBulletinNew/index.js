import { Card, Table,Input, Button, Modal,Tabs,Switch ,Form,Radio,message} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import AuthButton from '@/components/authButton'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable'
import ModalForm from './modalForm';
import SeeModal from './seeModal';
import {systemConfigPath} from "@/utils/config/systemConfig";
import { getUrlByParam, getQueryString } from '@/utils/urlUtils';

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class WebsiteBulletin extends React.Component {
  _userInfo = null
  _isMounted = false

  state = {
    _loading: false,
    modalvisible: false,
    seeVisible: false,
    seeModalInfo: "",
    draftVisible:false,
    sortVisible:false,
    value2:1,
    uuids:'',
    checked:false
  }

  bulletinInfo = ""
  activeTab = 1;

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  /**查询条件 */
  importantFilter = ['newType', 'releaseTime']
  formList = [
    {
      type: 'SELECT',
      field: 'newType',
      label: '公告类型',
      placeholder: '请选择信息类型',
      list: [
        {
          id: '1',
          value: '网站公告'
        },
        {
          id: '2',
          value: '新闻动态'
        },
        {
          id: '7',
          value: '维护公告'
        },
        {
          id: '8',
          value: '招募公告'
        },
        {
          id: '9',
          value: '通报公告'
        }
      ]
    },
    {
      type: 'RANGE',
      field: 'releaseTime',
      label: '发布时间',
      placeHolder: '请选择'
  },
  {
    type: 'SELECT',
    field: 'showFlag',
    label: '展示状态',
    placeholder: '请选择展示状态',
    list: [{ id: 0, value: '否' }, { id: 1, value: '是' }],
},
    {
      type: 'INPUT',
      field: 'title',
      label: '公告标题',
      placeholder: '请输入公告标题'
    },
    {
      type: 'INPUT',
      field: 'content',
      label: '公告内容',
      placeholder: '请输入内容'
    },{
      type: 'INPUT',
      field: 'releaseName',
      label: '发布人',
      placeholder: '请输入发布人或工号'
    }
  ]
  handleFilter = (params, isSend = true) => {
    let beginTime,endTime
    if (params.releaseTime) {
      params.beginTime = params.releaseTime[0] ? moment(params.releaseTime[0]).format('YYYY-MM-DD 00:00:00') : '';
      params.endTime = params.releaseTime[1] ? moment(params.releaseTime[1]).format('YYYY-MM-DD 23:59:59') : '';
  } 

  delete params["releaseTime"];

  let key = this.activeTab;
  key = 1;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...params,
            beginTime,
            endTime,
        }

    this.baseParams = {
      ...this.baseParams,
      ...params,
    }
    if (isSend) {
      this.handelToLoadTable();
    }
  }

  reloadTableData(state = 1) {
    let key = this.activeTab;
    if (this._userInfo) {
      this.handelToLoadTable(state, 'tableState' + key);
    }
  }

  handleTabChange = (key) => {
    if (1 == key) {
      //网站公告
      this.baseParams.newsType = 1
  } else if (2 == key) {
      //新闻动态
      this.baseParams.newsType = 2
  } else if (7 == key) {
      //维护公告
      this.baseParams.newsType = 7
  } else if (8 == key) {
      // 招募公告
      this.baseParams.newsType = 8
  } else if (9 == key) {
      //通报公告
      this.baseParams.newsType = 9
  }else if (0 == key) {
      //全部
      this.baseParams.newsType = undefined
  }
  this.activeTab = key;
  this.reloadTableData();
  }


  handleToSee = (uuids) => {
    // this.setState({
    //   seeVisible: true,
    //   seeModalInfo: info
    // })
      let url="/webNewsDetail/"+uuids;
      window.open(systemConfigPath.jumpCrccmallPage(url))
      
  }
  handleDraft = (uuids)=>{
    let url ="/websiteBulletin/websiteBulletinNew/draft/"+uuids;
    window.open(systemConfigPath.jumpPage(getUrlByParam(url)));
    // this.props.history.push("/websiteBulletin/websiteBulletinNew/draft/"+uuids)

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
    api.ajax("GET", "@/platform/platformNews/deleteByuuids", {
      uuids:uuids
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert('删除成功', { type: 'success' });
      this.handelToLoadTable(1);
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
    window.open(systemConfigPath.jumpPage(getUrlByParam(this.props.history.location.pathname + '/edit')));
    // this.props.history.push(this.props.history.location.pathname + '/edit');
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
  typeStaus = (status)=>{
    if (!status) {
      return;
    }
    let tempStatus = '';
    switch (status) {
      case 1:
        tempStatus = '网站公告';
        break;
      case 2:
        tempStatus = '新闻动态';
        break;
      case 7:
        tempStatus = '维护公告';
        break;
      case 8:
        tempStatus = '招募公告';
        break;
      case 9:
          tempStatus = '通报公告';
          break;
      default:
        break;
    }
    return tempStatus;
  }
  

  showModal=()=> {
    this.setState({
      draftVisible: true,
    });
  }
  showModalSort=(uuids)=>{
    this.setState({
      sortVisible:true,
      uuids
    });
  }

  handleCancel=(e)=> {
    this.setState({
      draftVisible: false,
    });
  }

  handleCancelSort=(e)=> {
    this.setState({
      sortVisible: false,
    });
  }

  handleOk = ()=>{
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
          return;
      }
      this.sortForm({ ...values});
         
  })
  
  }


  switchChangeAll = (e) => {
        let _this = this;
        let type = 1;

        let showDefault = e;
        let msg = "确定要关闭吗？";
        let isEnable = 0;
        if (showDefault) {
            isEnable = 1;
            msg = "是否将此公告展示到前台页面";
        }

        Modal.confirm({
            title: msg,
            //content:msg,
            okText: '确定',
            cancelText: '取消',
            // onOk() {
            //     let params = {};
            //     params.type = type;
            //     params.isEnable = isEnable;

            //     axios.post("@/common/approval/set/upd", params).then((r, err) => {
            //         if (r >= 0) {
            //             _this.handleSearch(1, tablePagination_.defaultPageSize);
            //             message.success("保存成功!");
            //             _this.setState({
            //                 showDefault: showDefault
            //             });
            //         } else {
            //             message.error("保存失败!");
            //         }
            //     });
            // }
        });
    }

  sortForm= (params) =>{
    params.uuids = this.state.uuids
    api.ajax('GET','@/platform/platformNews/topRanking',{
        ...params
    }).then(r=>{
        if(r.code == 200){
            message.success(r.msg);
            this.setState({
              sortVisible: false,
            })
            this.handelToLoadTable(1);
        }
       
    }).catch(err=>{
        
    })
    
}
  columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      sorter: true,
      width: 80,
    },
    {
      title: '公告类型',
      dataIndex: 'newsType',
      key: 'newsType',
      sorter: true,
      width: 100,
      render: (text, record) => {
        if(!text){
          return '--'
      }
      let statusStr = this.typeStaus(text);
      return <div >
                    <p>{statusStr?statusStr:'-'}</p>
             </div>
      }
      
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      width: 150,
    },
    {
      title: '公告内容',
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
    },{
      title: '显示状态',
      dataIndex: 'showFlag',
      key: 'showFlag',
      sorter: true,
      render: (text, record) => (
        <span>
          <Switch checked={text == 0 ? false: true} onChange={this.switchChangeAll}  checkedChildren="是" unCheckedChildren="否"/>
        </span>
      ),
      width: 120,
    },{
      title: '发布人',
      dataIndex: 'releaseName',
      key: 'releaseName',
      sorter: true,
      render: (text, record) => {
        return <div>
          <p>{text ? text :'--'}</p>
          <p>{record.userNo ? record.userNo :''}</p>
        </div>
      },
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'newsTime',
      key: 'newsTime',
      sorter: true,
      render: (text, record) => (
        <div>
          <span>
          {moment(record.newsTime).format("YYYY/MM/DD")}
        </span>
        <p>{moment(record.newsTime).format("HH:mm:ss")}</p>
        </div>
      ),
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render: (text, record) => (
        <div>
          <p>
          <span>
          <AuthButton elmType="a" onClick={() => this.handleToSee(record.uuids)}>查看</AuthButton>
          <span className="ant-divider"></span>
          <AuthButton elmType="a" onClick={() => this.showModalSort(record.uuids)}>排序</AuthButton>
        </span>
          </p>
          <p>
          <span>
          <AuthButton elmType="a" onClick={() => this.handleDraft(record.uuids)}>编辑</AuthButton>
          <span className="ant-divider"></span>
          <AuthButton elmType="a" onClick={() => this.handleToDel(record.uuids)}>删除</AuthButton>
        </span>
          </p>
        </div>
      ),
      width: 160,
    }
  ]
  columns2 = [
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      width: 150,
    },
    {
      title: '公告类型',
      dataIndex: 'newsType',
      key: 'newsType',
      sorter: true,
      width: 100,
      render: (text, record) => {
        if(!text){
          return '--'
      }
      let statusStr = this.typeStaus(text);
      return <div >
                    <p>{statusStr?statusStr:'-'}</p>
             </div>
      }
      
    },
   {
      title: '保存人',
      dataIndex: 'releaseName',
      key: 'releaseName',
      sorter: true,
      render: (text, record) => {
        return <div>
          <p>{text ? text :'--'}</p>
          <p>{record.userNo ? record.userNo :''}</p>
        </div>
      },
      width: 100,
    },
    {
      title: '保存时间',
      dataIndex: 'newsTime',
      key: 'newsTime',
      sorter: true,
      render: (text, record) => (
        <div>
          <span>
          {moment(record.newsTime).format("YYYY/MM/DD")}
        </span>
        <p>{moment(record.newsTime).format("HH:mm:ss")}</p>
        </div>
      ),
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render: (text, record) => (
        <AuthButton elmType="a" onClick={() => this.handleDraft(record.uuids)}>编辑</AuthButton>
      ),
      width: 160,
    }
  ]

  

  render() {
    const operations = null
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
  }
    return (
      <div>
        <Card style={{marginBottom:'10px'}}>
        <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
        </Card>
        <Card bordered={false} title="公告管理" extra={<div><Button type="primary" onClick={this.showModal}>草稿箱</Button><Button type="primary" onClick={this.goMessage} style={{marginLeft:'10px'}}>发布公告</Button></div>}>
          
          {/* <div className="toolbar">
            <AuthButton type="parimary" onClick={this.goMessage}>发布信息</AuthButton>
          </div> */}
          <Tabs className="tabs" tabBarExtraContent={operations} onChange={this.handleTabChange}>
            <TabPane tab="全部" key="0" className="tabplane">
              <div className="tabplane">
              <BaseTable
                url="@/platform/platformNews/pageForNewsList"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns}
              />
              </div>
            </TabPane>
            <TabPane tab="网站公告" key="1" >
              <div className="tabplane">
              <BaseTable
                url="@/platform/platformNews/pageForNewsList"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns}
              />
              </div>
            </TabPane>
            <TabPane tab="维护公告" key="7" >
              <div className="tabplane">
              <BaseTable
                url="@/platform/platformNews/pageForNewsList"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns}
              />
              </div>
            </TabPane>
            <TabPane tab="招募公告" key="8" >
              <div className="tabplane">
              <BaseTable
                url="@/platform/platformNews/pageForNewsList"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns}
              />
              </div>
            </TabPane>
            <TabPane tab="通报公告" key="9" >
              <div className="tabplane">
              <BaseTable
                url="@/platform/platformNews/pageForNewsList"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns}
              />
              </div>
            </TabPane>
            <TabPane tab="新闻动态" key="2" >
              <div className="tabplane">
              <BaseTable
                url="@/platform/platformNews/pageForNewsList"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns}
              />
              </div>
            </TabPane>
            
            
            
          </Tabs>
          {/* <BaseTable
            url="@/platform/platformNews/pageForNewsList"
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns}
          /> */}
        </Card>
        <ModalForm
          {...this.initModal}
          loading={this.state._loading}
          visible={this.state.modalvisible}></ModalForm>
        <SeeModal
          {...this.seeInitModal}
          info={this.state.seeModalInfo}
          visible={this.state.seeVisible}></SeeModal>

        <Modal title="草稿箱" visible={this.state.draftVisible}
        width={666}
        onCancel={this.handleCancel}
        footer={[
          <Button type="primary" size="large" onClick={this.handleCancel}>
            确定
          </Button>,
        ]}
        >
          <BaseTable
                url="@/platform/platformNews/drafts"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                type={1}
                columns={this.columns2}
              />
        </Modal>
        <Modal title="置顶排序" visible={this.state.sortVisible}
         onCancel={this.handleCancelSort}
          footer={[
            <Button type="primary" size="large" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <FormItem {...formItemLayout} label="排序设置">
                            <RadioGroup value={this.state.value2}
                                {...getFieldProps("topFlag", {
                                    initialValue: 1,
                                    onChange: this.topChange,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择是否置顶"
                                        }
                                    ]
                                })}
                                placeholder="请选择是否置顶">
                                <Radio key="0" value={0}>不置顶</Radio>
                                <Radio key="1" value={1}>置顶</Radio>
                                
                                
                            </RadioGroup>
                        </FormItem>
                        <FormItem {...formItemLayout} label="置顶排序">
                            <Input type="text" {...getFieldProps("sort", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入排序数值"
                                    }
                                ]
                            })}
                            placeholder="请输入排序数值"
                            ></Input>
                        </FormItem>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(WebsiteBulletin);