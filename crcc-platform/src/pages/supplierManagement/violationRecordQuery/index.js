import { Row,Card, Button,Tabs,Modal,Input,Form } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
const FormItem = Form.Item;

import less from './index.less';

class violationRecordQuery extends React.Component{
  state = {
    loading: false,
    tableState1: 0,
    tableState2: 0,
    detailContent:{},
    visible:false,
    releaseVisible:false,
    uuids:""
  }
  _isMounted = false;
  activeTab = 1;
  componentWillMount(){
    this._isMounted = true;
  }
  componentWillUnmount(){
    this._isMounted = false;
  }

  //查询组件信息
  formList = [
    {
      type: 'INPUT',
      field: 'name',
      label: '公司名称',
      placeholder: '公司名称'
    },
    {
      type: 'INPUT',
      field: 'businessLicense',
      label: '营业执照号',
      placeHolder: '营业执照号'
    },
    {
      type: 'SELECT',
      field: 'isReleased',
      label: '是否解除',
      placeholder: '是否解除',
      list: [
        {
          id: '1',
          value: '未解除'
        },
        {
          id: '2',
          value: '已解除'
        }
      ]
    },
    {
      type: 'SELECT',
      field: 'punishType',
      label: '违规类别',
      placeholder: '违规类别',
      list: [
        {
          id: '1',
          value: '一类违规'
        },
        {
          id: '2',
          value: ' 二类违规'
        },
        {
          id: '3',
          value: ' 三类违规'
        }
      ]
    },

    {
      type: 'SELECT',
      field: 'punlishDegree',
      label: '违规程度',
      placeholder: '违规程度',
      list: [
        {
          id: '1',
          value: '情节较轻'
        },
        {
          id: '2',
          value: '情节一般'
        },
        {
          id: '3',
          value: '情节严重'
        },
        {
          id: '4',
          value: '情节恶劣'
        }
      ]
    },
    {
      type: 'SELECT',
      field: 'result',
      label: '处理类型',
      placeholder: '请输入处理类型',
      list: [
        {
          id: '1',
          value: '拉黑公司'
        },
        {
          id: '2',
          value: '关闭交易'
        },
        {
          id: '3',
          value: '限制提现'
        },
        {
          id: '4',
          value: '关闭店铺'
        }
      ]
    },
    {
      type: 'INPUT',
      field: 'processingPerson',
      label: '处理人',
      placeholder: '处理人'
    },
    {
      type: 'RANGE',
      field: 'createTime',
      label: '处理时间',
      placeholder: '处理时间'
    }
  ]
  importantFilter = ['name', 'factoryType']
  handleFilter = (p, isSend = true) => {
    let createStartTime, createEndTime;
    if (p.createTime) {
      createStartTime = p.createTime[0] ? moment(p.createTime[0]).format('YYYY-MM-DD 00:00:00') : '';
      createEndTime = p.createTime[1] ? moment(p.createTime[1]).format('YYYY-MM-DD 23:59:59') : '';
      p.createTime = null;
    }
    let key = this.activeTab;

    this['baseParams' + key] = {
      ...this['baseParams' + key],
      ...p,
      createStartTime,
      createEndTime
    }
    if(isSend){
      this.reloadTableData();
    }
  }


  baseParams1 = {
    tabStatus: 1,
  };

  baseParams2 = {
    tabStatus: 2,
  };

  resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  reloadTableData(state = 1) {
    let key = this.activeTab;
    this.handelToLoadTable(state, 'tableState'+ key);
  }
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }

  columns = () => {
    return [
      {
        title: '公司名称',
        width: 200,
        dataIndex: 'name',
        key: 'name',
        sorter: true
      },
      {
        title: '营业执照号',
        width: 200,
        dataIndex: 'businessLicense',
        key: 'businessLicense',
        sorter: true
      },
      {
        title: '违规类别',
        dataIndex: 'punishType',
        key: 'punishType',
        width: 150,
        sorter: true,
        render: (text, record)=>(
            <span>
            {record.punishType=="1"?"一类违规":record.punishType=="2"?"二类违规":"三 类违规"}
            </span>
        )
      },
      {
        title: '违规行为',
        dataIndex: 'punlishBehavior',
        key: 'punlishBehavior',
        sorter: true,
        width: 150,
        render: (text, record)=>(
            <span>
            {record.punlishBehavior=="1"?"资质造假":record.punlishBehavior=="2"?"知识侵权":record.punlishBehavior=="3"?"违规发布":
             record.punlishBehavior=="4"?"恶意报价":record.punlishBehavior=="5"?"围标串标":record.punlishBehavior=="6"?"扰乱秩序":
             record.punlishBehavior=="7"?"拒绝履约":record.punlishBehavior=="8"?"履约欺诈":record.punlishBehavior=="9"?"质量缺陷":
             record.punlishBehavior=="10"?"服务怠慢":"税务违规"}
            </span>
        )
      },
      {
        title: '违规程度',
        dataIndex: 'punlishDegree',
        key: 'punlishDegree',
        sorter: true,
        width: 150,
        render: (text, record)=>(
          <span>
            {record.punlishDegree=="1"?"情节较轻":record.punlishDegree=="2"?"情节较轻":record.punlishDegree=="3"?"情节严重":"情节恶劣"}
          </span>
        )
      },
      {
        title: '处罚结果',
        dataIndex: 'processingType',
        key: 'processingType',
        sorter: true,
        width: 150,
        render: (text, record)=>(
          <span>
            {record.processingType=="1"?"拉黑公司":record.processingType=="2"?"关闭交易":record.processingType=="3"?"限制提现":record.processingType=="4"?"关闭店铺":record.processingType=="5"?"限制登录":"商品关闭"}
          </span>
        )
      },
      {
        title: '处罚开始时间',
        dataIndex: 'punishStartTime',
        key: 'punishStartTime',
        width: 150,
        sorter: true
      },
      {
        title: '处理人',
        dataIndex: 'processingPerson',
        key: 'processingPerson',
        width: 150,
        sorter: true
      },
      {
        title: '处罚期限',
        dataIndex: 'punishDay',
        key: 'punishDay',
        width: 150,
        sorter: true
      },
      {
        title: '是否已解除',
        dataIndex: 'isReleased',
        key: 'isReleased',
        sorter: true,
        width: 150,
        render: (text, record)=>(
            <span>
            {record.isReleased=="1"?"未解除":"已解除"}
          </span>
        )
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
            <span>
              <AuthButton elmType="a"  onClick={() => {this.handleToDetails(record.uuids);}}>详情</AuthButton>
              {record.isReleased == '1' ?<span className="ant-divider"></span>: ''}
              {record.isReleased == '1' ?  <AuthButton elmType="a" onClick={() => {this.handleToRelease(record.uuids);}}>解除</AuthButton> : ''}
            </span>
        ),
      }
    ]
  }

    //导出
    handleToExport = () => {
   /*   let params = '';
      for(let index in this.baseParams){
        params += index + '=' + this.baseParams[index] + '&'
      }
      window.open(
        window.location.origin +
        '/api' +
        '/supplier/ecCompanyViolation/exportCompanyViolation' +
        '?' + params
      )*/
    }

  handleToDetails = (uuids) => {
    api.ajax('GET', '@/platform/ecCompanyViolation/getDetailByUUIDs', {
      UUIDs: uuids
    }).then((r) => {
          this.setState({
            visible: true,
            detailContent:r.data,
          })
    }).catch((r) => {

    });
  };

  handleToRelease= (uuids) => {
    api.ajax('GET', '@/platform/ecCompanyViolation/getDetailByUUIDs', {
      UUIDs: uuids
    }).then((r) => {
      this.setState({
        releaseVisible: true,
        detailContent:r.data,
        uuids:uuids
      })
    }).catch((r) => {

    });
  };

  handleChangeTab = (key) => {
    this.activeTab = key;
    this.reloadTableData();
  };

  handleOff = () => {
    this.setState({
      visible: false,
    })
  }

  handleReleaseOff = () => {
    this.setState({
      releaseVisible: false,
    })
  }

  /**
   *点击解除
   **/
  handleReleaseOn= () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.releaseSubmit(values)
    })
  }

  /**
   * 解除处罚
   **/
  releaseSubmit = (values) => {
    //console.log(this.state.uuids);
    let _this = this;
    api.ajax("POST", "@/platform/ecCompanyViolation/releasePunish", {
      uuids: this.state.uuids,
      ...values,
    }).then(r => {
      this.setState({
        releaseVisible: false,
      })
      _this.reloadTableData();
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }

  render(){
    const { TabPane } = Tabs;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { span: 22 },
    }
    return(
      <div>
        <Card bordered={false}>
          <Row>
            <BaseForm
              formList={this.formList}
              importantFilter={this.importantFilter}
              filterSubmit={this.handleFilter}></BaseForm>
          </Row>
          <Tabs defaultActiveKey="1" onChange={this.handleChangeTab} tabBarExtraContent={<div className="toolbar">
              <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
            </div>}>
            <TabPane tab="全部" key="1">
              <BaseTable
                url='@/platform/ecCompanyViolation/companyViolationPage'
                tableState={this.state.tableState1}
                resetTable={(state)=>{this.resetTable(state,'tableState1')}}
                baseParams={this.baseParams1}
                columns={this.columns()}
                scroll={{ x: 2000 }}/>
            </TabPane>
            <TabPane tab="处理中" key="2">
              <BaseTable
                  url='@/platform/ecCompanyViolation/companyViolationPage'
                  tableState={this.state.tableState2}
                  resetTable={(state)=>{this.resetTable(state,'tableState2')}}
                  baseParams={this.baseParams2}
                  columns={this.columns()}
                  scroll={{ x:  2000 }}/>
            </TabPane>
          </Tabs>
        </Card>


        <Modal title={`详情`} visible={this.state.visible}
               width={800}
               onCancel={this.handleOff}
               footer={[
                 <Button key="realod"  onClick={this.handleOff}>
                   关闭
                 </Button>,

               ]}
        >
          <div className={less.ceshi}>
            <div className={less.lab}><p>公司名称：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.name}</p></div>
            <div className={less.lab}><p>营业执照号：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.businessLicense}</p></div>
            <div className={less.lab}><p>处罚人：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.processingPerson}</p></div>
            <div className={less.lab}><p>开始时间：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punishStartTime?this.state.detailContent.punishStartTime:'--'}</p></div>
            <div className={less.lab}><p>处罚期限：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punlishDays?this.state.detailContent.punlishDays:'--'}天</p></div>
            <div className={less.lab}><p>违规类别：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punishType == '1'  ?'一类违规' : this.state.detailContent.punishType == '2' ? '二类违规' : '三类违规' }</p></div>
            <div className={less.lab}><p>违规行为：</p></div>
            <div className={less.cont}>
                <p>
                  {this.state.punlishBehavior=="1"?"资质造假":this.state.punlishBehavior=="2"?"知识侵权":this.state.punlishBehavior=="3"?"违规发布":
                  this.state.punlishBehavior=="4"?"恶意报价":this.state.punlishBehavior=="5"?"围标串标":this.state.punlishBehavior=="6"?"扰乱秩序":
                  this.state.punlishBehavior=="7"?"拒绝履约":this.state.punlishBehavior=="8"?"履约欺诈":this.state.punlishBehavior=="9"?"质量缺陷":
                  this.state.punlishBehavior=="10"?"服务怠慢":"税务违规"}
                </p>
            </div>
            <div className={less.lab}><p>违规程度：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punlishDegree =="1"?"情节较轻":this.state.punlishBehavior=="2"?"情节一般":this.state.punlishBehavior=="3"?"情节严重": "情节恶劣"}</p></div>
            <div className={less.lab}><p>其他行为：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.otherReason?this.state.detailContent.otherReason :'暂无'}</p></div>
            <div className={less.lab}><p>处罚理由：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.processingReasons?this.state.detailContent.processingReasons:'--'}</p></div>
            <div className={less.lab}><p>是否解除：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.isReleased == '1' ? "未解除" : "已解除"}</p></div>
            <div className={less.lab}><p>解除人员：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.isReleased == '2' && this.state.detailContent.releasePreson ? this.state.detailContent.releasePreson : "--" }</p></div>
            <div className={less.lab}><p>解除时间：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.isReleased == '2' && this.state.detailContent.releaseTime  ? this.state.detailContent.releaseTime  :  "--" }</p></div>
            <div className={less.lab}><p>解除原因：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.isReleased == '2' && this.state.detailContent.releaseReason ? this.state.detailContent.releaseReason  : "--"}</p></div>
          </div>
          {/*预览图片弹出框*/}
          <div className="clearfix"></div>
        </Modal>

        <Modal title={`解除`} visible={this.state.releaseVisible}
               width={800}
               onOk={this.handleReleaseOn}
               onCancel={this.handleReleaseOff}
               footer={[
                 <Button key="submitRelease"   type="primary"  onClick={this.handleReleaseOn}>
                   确定
                 </Button>,
                 <Button key="realod"  onClick={this.handleReleaseOff}>
                   关闭
                 </Button>,

               ]}
        >
          <div className={less.ceshi}>
            <div className={less.lab}><p>公司名称：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.name}</p></div>
            <div className={less.lab}><p>营业执照号：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.businessLicense}</p></div>
            <div className={less.lab}><p>开始时间：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punishStartTime?this.state.detailContent.punishStartTime:'--'}</p></div>
            <div className={less.lab}><p>处罚期限：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punlishDays?this.state.detailContent.punlishDays:'--'}天</p></div>
            <div className={less.lab}><p>违规类别：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punishType == '1'  ?'一类违规' : this.state.detailContent.punishType == '2' ? '二类违规' : '三类违规' }</p></div>
            <div className={less.lab}><p>违规行为：</p></div>
            <div className={less.cont}>
                <p>
                  {this.state.punlishBehavior=="1"?"资质造假":this.state.punlishBehavior=="2"?"知识侵权":this.state.punlishBehavior=="3"?"违规发布":
                  this.state.punlishBehavior=="4"?"恶意报价":this.state.punlishBehavior=="5"?"围标串标":this.state.punlishBehavior=="6"?"扰乱秩序":
                  this.state.punlishBehavior=="7"?"拒绝履约":this.state.punlishBehavior=="8"?"履约欺诈":this.state.punlishBehavior=="9"?"质量缺陷":
                  this.state.punlishBehavior=="10"?"服务怠慢":"税务违规"}
               </p>
            </div>
            <div className={less.lab}><p>违规程度：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.punlishDegree =="1"?"情节较轻":this.state.punlishBehavior=="2"?"情节一般":this.state.punlishBehavior=="3"?"情节严重": "情节恶劣"}</p></div>
            <div className={less.lab}><p>其他行为：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.otherReason?this.state.detailContent.otherReason :'暂无'}</p></div>
            <div className={less.lab}><p>处罚理由：</p></div>
            <div className={less.cont}><p>{this.state.detailContent.processingReasons?this.state.detailContent.processingReasons:'--'}</p></div>
            <div className={less.lab}><p>解除原因：</p></div>
            <div className={less.cont}>
              <Form>
                <FormItem  {...formItemLayout}>
                    <Input
                      type="textarea"
                      placeholder="解除原因"
                      rows={6}
                          {...getFieldProps('releaseReason', {
                            rules: [
                              {
                                required: true,
                                message: '请输入解除原因'
                              }
                            ]
                          })}
                       />
                </FormItem>
              </Form>
            </div>
          </div>
          {/*预览图片弹出框*/}
          <div className="clearfix"></div>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(violationRecordQuery);