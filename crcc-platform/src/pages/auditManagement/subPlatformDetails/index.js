import { Card, Form, Button, Select, Radio, Row, Col, DatePicker, Checkbox, Table, Badge, Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';
import BaseDetails from '@/components/baseDetails';
import BaseTable from '@/components/baseTable';
import {getUrlByParam, getQueryString, exportFile} from '@/utils/urlUtils';
import Album from 'uxcore-album';
const { Photo } = Album;
import {systemConfigPath} from "@/utils/config/systemConfig";

import less from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class AuditForBasic extends React.Component {
  baseParams = {
    spUuids: '6',
    companyId: this.props.match.params.companyId
  };

  state = {
    loading: false,
    id: "",
    dataSourceTable: [],
    tableState1: 0,
    approvalResult:2,//审核结果
    uuids: '',
	  activitUuids:'',
    companyName: '',
    alistDocumentHistory: [], // 授权书文件历史
    clarificationDocumentHistory: []//澄清文件历史记录
  }
  _isMounted = false;

  auditKeyList = []; //需要审核的key数据

  componentWillMount() {
    this._isMounted = true;
    const id = this.props.match.params.appuuids;
    const companyId = this.props.match.params.companyId;
    this.setState({
      id: id
    })
    this.getInfo(id, companyId);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getInfo = (uuids, companyId) => {
    let _this = this;
    api.ajax("GET","@/sub/subPlatformApplication/getApplyById",{uuids}).then((r) => {
      this.setState({
        dataSourceTable: r.data,
        companyName: r.data.companyName,
        uuids: r.data.uuids,
		    activitUuids: r.data.activityUuids
      })
      // 查询澄清文件
      this.getClarificationData(companyId, r.data.spUuids, r.data.applicationUserPhoneNo);
    });
    this.setState({
      loading: false
    });
  }

   //获得澄清文件
   getClarificationData = (companyId, subId, phoneNo) => {
    api.ajax('GET', '@/sub/subPlatformApplication/selectClarifcationByCompanyIdAndUserPhone', {
      companyId, subId, phoneNo
    }).then(r => {
      if(r.data) {
        this.setState({
          clarificationDocumentHistory: r.data.clist ? r.data.clist : [],
          alistDocumentHistory: r.data.alist ? r.data.alist : []
        })
      }
    })
  }

  //渲染授权书文件
  renderAlistfication = () => {
    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '15%',
        render: (text, record, index) => (
          <span>{index + 1}</span>
        )
      },
      {
        title: '文件名称',
        dataIndex: 'authorizationName',
        key: 'authorizationName',
        width: '40%',
        render: (text, record, index) => {
          if (text && text.length >= 15) {
            return <span title={text}>{text.substring(0, 13)}...</span>
          } else if (!text) {
            return <span>{record.authorizationPath.substring(record.authorizationPath.length-13)}</span>
          }
          return <span>{text}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'authorizationPath',
        key: 'authorizationPath',
        width: '15%',
        render: (text, record, index) => (
          <a href={SystemConfig.configs.resourceUrl + text} target="_blank" download={record.authorizationName}>下载</a>
        )
      }
    ]
    return <Table style={{marginBottom: '20px'}} key={'table'} size="middle" pagination={false} columns={columns}
      dataSource={this.state.alistDocumentHistory} />
  }

  //渲染澄清文件
  renderClarification = () => {
    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '15%',
        render: (text, record, index) => (
          <span>{index + 1}</span>
        )
      },
      {
        title: '文件名称',
        dataIndex: 'clarifcationName',
        key: 'clarifcationName',
        width: '40%',
        render: (text, record, index) => {
          if (text && text.length >= 15) {
            return <span title={text}>{text.substring(0, 13)}...</span>
          } else if (!text) {
            return <span>{record.clarifcationPath.substring(record.clarifcationPath.length-13)}</span>
          }
          return <span>{text}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'clarifcationPath',
        key: 'clarifcationPath',
        width: '15%',
        render: (text, record, index) => (
          <a href={SystemConfig.configs.resourceUrl + text} target="_blank" download={record.clarifcationName}>下载</a>
        )
      }
    ]
    return <Table key={'table'} size="middle" pagination={false} columns={columns} dataSource={this.state.clarificationDocumentHistory} />
  }

  //提交审核前添加确认
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      // 提交如果校验通过弹出提示
      let _this = this;
      confirm({
        title: '是否确认提交?',
        onOk() {
          _this.currentSubmit(values);
        },
        onCancel() {
          Util.alert('已取消操作');
        },
      });

    })
  }

    // 表单提交
    currentSubmit = (values) => {
      values.companyId = this.props.match.params.companyId;
      values.userId = this.state.userId;
      values.uuids = this.state.activitUuids;
	  values.subpUuids = this.state.uuids;
      api.ajax('POST', '@/platform/workOrders/changeReviewState?subUuids=6', {
        ...values
      }).then(r => {
        Util.alert(r.msg, { type: 'success', callback: () => (this.props.history.goBack()) });
      }).catch(r => {
        this.setState({
          loading: false
        })
        Util.alert(r.msg, { type: 'error' });
      })
    }
  

  tableColumns = () => {
    return [
        {
            title: '工单号',
            dataIndex: 'workOrdersCode',
            key: 'indexkey',
            width: 150,
        },
        {
            title: '申请人',
            dataIndex: 'applicationUserName',
            key: 'applicationUserName',
            width: 150
        },
        {
            title: '申请人电话',
            dataIndex: 'applicationUserPhoneNo',
            key: 'applicationUserPhoneNo',
            width: 150
        },
        {
            title: '申请时间',
            dataIndex: 'applicationTime',
            key: 'applicationTime',
            sorter:true,
            width: 150
        },
        {
            title: '审核人',
            dataIndex: 'reviewUser',
            key: 'reviewUser',
            width: 150,
			render: (text, record) => {
				if(!text || text == null || text == "null") {
				  return '-';
				} else {
				  return text
				}
			}
        },
        {
          title: '审核时间',
          dataIndex: 'reviewTime',
          key: 'reviewTime',
          sorter:true,
          width: 150
        },
        {
            title: '审核结果',
            dataIndex: 'workOrdersState',
            key: 'workOrdersState',
            width: 150,
            render: (text, record) => {
              // 1:待审核，2:通过，3:驳回，4:待受理，5.待处理，6已完成
              if(text == 1 || text == "1"){
                return <span style={{color:'#E96C47'}}>待审核</span>;
              } else if(text == 2 || text == "2") {
                return <span style={{color:'#4CD91F'}}>审核通过</span>;
              } else if(text == 3 || text == "3") {
                return <span style={{color:'#DD2F26'}}>审核驳回</span>;
              } else {
                return '-'
              }
            }
        },
        {
            title: '审核意见',
            dataIndex: 'reviewReason',
            key: 'reviewReason',
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'x',
            key: 'x',
            width: 100,
            render: (text, record)=>(
                <p style={{width:"84px"}}>
                    <a href="javascript:void(0);" onClick={
                        ()=>{
                          let openUrl = window.location.href + '?type=view'
                          window.open(openUrl);
                        }
                    }>查看详情</a>
                </p>
            )
        }
    ]
}

resetTable = (state, tableState = 'tableState') => {
  if (state != this.state[tableState]) {
    this.setState({
      [tableState]: state
    });
  }
}

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <div className={less.sub_platform_audit}>
        <Form>
            <Card title="基础信息" bordered={false} className="mb10">
              <Row>
                  <Col span={13} style={{marginRight: '20px'}}>
                      <BaseDetails title="企业名称">
                          <p>{this.state.dataSourceTable.companyName ? this.state.dataSourceTable.companyName : '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="统一社会信用代码">
                          <p>{this.state.dataSourceTable.businessLicense ? <span>{this.state.dataSourceTable.businessLicense} 
                          <a style={{marginLeft: "40px"}} href="javascript:void(0)"
                            onClick={this.companyInfomation}
                          >
                            企业资质
                          </a></span>: '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="企业类型">
                          <p>{
                            this.state.dataSourceTable.isMember === 1 ? '成员单位' :
                            this.state.dataSourceTable.isMember === 2 ? '非成员单位' :
                            '-'  
                          }</p>
                      </BaseDetails>
                      <BaseDetails title="注册渠道">
                          <p>
                          {
                            this.state.dataSourceTable.regType === 1 ? '自主注册' :
                            this.state.dataSourceTable.regType === 2 ? '管理员开通' :
                            '-'  
                          }
                          </p>
                      </BaseDetails>
                      <BaseDetails title="开户行">
                          <p>{this.state.dataSourceTable.bank ? this.state.dataSourceTable.bank : '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="澄清文件">
                        {this.renderClarification()}
                      </BaseDetails>
                  </Col>
                  <Col span={10}>
                      <BaseDetails title="管理员">
                          <p>{this.state.dataSourceTable.adminName ? this.state.dataSourceTable.adminName : '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="证件号码">
                          <p>{this.state.dataSourceTable.cardNo ? <div>
							              {this.state.dataSourceTable.cardNo}

                            {
                              this.state.dataSourceTable.adminCardType ==1 ?
                              <div>
                                <a style={{marginLeft:"40px"}} href="javascript:void(0);"
                                onClick={() => (this.handleShowImg([this.state.dataSourceTable.adminCardPathOne]))}>正面影像</a>
                                {this.state.dataSourceTable.adminCardPathTwo?<a href="javascript:void(0);"
                                onClick={() => (this.handleShowImg([this.state.dataSourceTable.adminCardPathTwo]))}>背面影像</a>:""}
                              </div> : <a style={{marginLeft:"40px"}} href="javascript:void(0);"
                                onClick={() => (this.handleShowImg([this.state.dataSourceTable.adminCardPathOne]))}>查看影像</a>
                            }
                          </div>: '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="管理员手机号">
                          <p>{this.state.dataSourceTable.phoneNo ? this.state.dataSourceTable.phoneNo : '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="管理员邮箱">
                          <p>{this.state.dataSourceTable.adminEmail ? this.state.dataSourceTable.adminEmail : '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="银行基本账号">
                          <p>{this.state.dataSourceTable.bankAccount ? this.state.dataSourceTable.bankAccount : '-'}</p>
                      </BaseDetails>
                      <BaseDetails title="授权书">
                        {this.renderAlistfication()}
                      </BaseDetails>
                  </Col>
              </Row>
          </Card>
          <Card bordered={false} title="审核记录" className="mb10">
            <BaseTable
                url='@/sub/subPlatformApplication/getApplyListBySubIdAcompanyId'
                tableState={this.state.tableState1}
                resetTable={(state)=>{this.resetTable(state,'tableState1')}}
                baseParams={this.baseParams}
                columns={this.tableColumns()}
                pagination={ false }
                scroll={{ x: 1500 }}
            />
          </Card>
          <Card
            style={{display: this.props.match.params.types == 'preview'
              || window.location.href.indexOf('type=view') !=-1 ? 'none': ''}}
            title={<span><Badge style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 审核意见</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} required label="审核结果">
                  <RadioGroup
                    {...getFieldProps('workOrdersState',
                      {
                        initialValue: 2,
                        rules: [
                          {
                            required: true,
                            message: "请选择审核结果"
                          }
                        ],
                        onChange: (e) => {
                          this.setState({
                            approvalResult: e.target.value
                          })
                          this.props.form.resetFields(['reviewReason'])
                        }
                      })}>
                    <Radio key="a" value={2}>审核通过</Radio>
                    <Radio key="b" value={3}>驳回</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="审核意见" required={this.state.approvalResult==2?false:true}>
                  <Input type="textarea" maxLength='1000' rows={5}
                    {...getFieldProps('reviewReason',
                      {
                        rules: [
                          {
                            required: this.state.approvalResult==2?false:true,
                            message: "请输入审核意见"
                          }
                        ]
                      })} />
                </FormItem>
              </Col>
            </Row>
          </Card>

          <BaseAffix>
            <Button style={{ marginRight: "10px" }} loading={this.state.loading}
              onClick={this.handleGoBack}>返回</Button>
            <Button type="primary"
              style={{display: this.props.match.params.types == 'preview' ||
               window.location.href.indexOf('type=view') !=-1 ? 'none': ''}}
              loading={this.state.loading}
              onClick={this.handleSubmit}>递交</Button>
            <Button
              loading={this.state.loading}
              style={{float: "right"}}
              onClick={this.companyInfomation}>查看企业资质
              </Button>
          </BaseAffix>
        </Form>
      </div>
    )
  }
  handleGoBack = () => {
    if(this.props.match.params.types == 'preview'
      ||window.location.href.indexOf('type=view') !=-1) {
      window.close();
    } else {
      this.props.history.goBack()
    }
  }

  //展示图片
  handleShowImg = (imgList) => {
    if (imgList.length == 0) {
      Util.alert('暂无图片')
      return;
    }
    let photoElm = []

    let baseUrl = SystemConfig.configs.resourceUrl;
    imgList.map((item, i) => {
      photoElm.push(
        <Photo
          src={baseUrl + item}
          key={i}
        />,
      )
    })
    Album.show({
      photos: photoElm,
    });
  }

  companyInfomation = () => {
    window.open(systemConfigPath.jumpCrccmallPage('/qualification/basicInfomation?companyName='+this.state.companyName));
  }

}
export default Form.create()(AuditForBasic);