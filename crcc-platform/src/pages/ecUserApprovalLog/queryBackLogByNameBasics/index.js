import { Card, Form, Button, Radio, Row, Col, Table, Badge,Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';
import UploadImg from '@/components/uploadImg';
import Album from 'uxcore-album';
import Input from '@/components/baseInput';

import less from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Photo } = Album;
const confirm = Modal.confirm;

class AuditForBg extends React.Component {
  state = {
    loading: false,
    Clarification: [],//说明材料
    id: "",
    basicAuditInfo: {},
    clarificationDocumentHistory: [],
    backMsg: ''//驳回信息
  }
  _isMounted = false;
  componentWillMount() {
    this._isMounted = true;
    const id = this.props.match.params.uuids;
    this.setState({
      id: id
    })
    this.getInfo(id);
    //查询澄清文件
    this.getClarificationData(id);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  getInfo = (id) => {
    let _this = this;
    api.ajax("GET", "@/supplier/ecCompanySupplier/get", {
      uuids: id
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.getAreaStr(r.data.provinceCode, r.data.cityCode, r.data.areaCode);
      this.setState({
        basicAuditInfo: r.data,
      })
      this.getBackInfo(id);
    }).catch(r => { })
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

  //获取地址信息
  getAreaStr = (provinceCode, cityCode, areaCode) => {
    let _this = this;
    api.ajax("GET", "@/base/ecProvince/selectProCityArea", {
      provinceCode,
      cityCode,
      areaCode
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        area: r.data.rows
      })
    }).catch(r => { })
  }

  columns = [
    {
      title: '序号',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) => (
        <span>{index + ((this.params.page - 1) * this.params.rows) + 1}</span>
      ),
    },
    {
      title: '文件名',
      dataIndex: 'title',
      key: 'title'
    }
  ]

  //获得澄清文件
  getClarificationData = (uuids) => {
    api.ajax('GET', '@/supplier/ecCompanySupplier/queryClarificationDocumentByCompanyUuids', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        clarificationDocumentHistory: r.data
      })
    })
  }

  // 获得驳回信息
  getBackInfo = (id) => {
    api.ajax('GET', '@/supplier/ecUserApprovalLog/queryCheckResultBycompanyUUIds', {
      companyUUIds: id,
      type: 2
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        backMsg: r.data.remark
      })
    })
  }

  //渲染澄清文件
  renderClarification = () => {
    let list = this.state.clarificationDocumentHistory;
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
        dataIndex: 'urlName',
        key: 'urlName',
        width: '40%',
        render: (text, record, index) => {
          if (text && text.length >= 15) {
            return <span title={text}>{text.substring(0, 13)}...</span>
          } else if (!text) {
            return <span>{record.url.substring(record.url.length-13)}</span>
          }
          return <span>{text}</span>
        }
      },
      {
        title: '上传日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '30%',
        render: (text, record, index) => {
          return <span>{moment(text).format("YYYY-MM-DD HH:mm")}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'url',
        key: 'url',
        width: '15%',
        render: (text, record, index) => (
          <a href={SystemConfig.configs.resourceUrl + text} target="_blank" download={record.urlName}>下载</a>
        )
      }
    ]
    return <Table key={'table'} size="middle" pagination={false} columns={columns} dataSource={this.state.clarificationDocumentHistory} />
  }

  //根据有效期结束时间的值判断显示内容
  initDate = (start, end) => {
    if (end == 1) {
      return '成立日期：' + moment(start).format("YYYY-MM-DD") + "～营业期限：长期";
    } else {
      return '成立日期：' + moment(start).format("YYYY-MM-DD") + "～营业期限：" + moment(end).format("YYYY-MM-DD");
    }
  }
  //初始化注册资本显示数据
  initMoney = (money) => {
    if (money != 0) {
      return money + "万";
    } else {
      return "无";
    }
  }

  //三证合一
  threeInOneChange = (e) => {
    this.setState({
      threeInOne: e.target.value
    })
  }

  threeEvidenceContent = (index) => {
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    if (index == 0) {
      return [
        <Row key={1}>
          <Col span={24}>
            <BaseDetails title="营业执照号">
              {this.state.basicAuditInfo.businessLicense}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={111}>
          <Col span={24}>
            <BaseDetails title="公司所在地">
              {this.state.area}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={222}>
          <Col span={24}>
            <BaseDetails title="公司详细地址">
              {this.state.basicAuditInfo.address}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={2}>
          <Col span={24}>
            <BaseDetails title="执照有效期">
              {this.initDate(this.state.basicAuditInfo.businessStartTime, this.state.basicAuditInfo.businessEndTime)}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={5}>
          <Col span={24}>
            <BaseDetails title="注册资本">
              {this.initMoney(this.state.basicAuditInfo.registeredCapital)}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={6}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="营业执照原件" imgUrl={this.state.basicAuditInfo.businessLicensePath} disabled={true} />
            </FormItem>
          </Col>
        </Row>,
        <Row key={3}>
          <Col span={24}>
            <BaseDetails title="税务登记证">
              {this.state.basicAuditInfo.taxRegistrationNumber}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={7}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="税务登记证" imgUrl={this.state.basicAuditInfo.taxRegistrationPath} disabled={true} />
            </FormItem>
          </Col>
        </Row>,
        <Row key={4}>
          <Col span={24}>
            <BaseDetails title="组织机构代码证">
              {this.state.basicAuditInfo.organizationCertificateCode}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={8}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="组织机构代码证" imgUrl={this.state.basicAuditInfo.organizationCertificatePath} disabled={true} />
            </FormItem>
          </Col>
        </Row>,
      ]
    } else {
      return [
        <Row key={1}>
          <Col span={24}>
            <BaseDetails title="营业执照号">
              {this.state.basicAuditInfo.businessLicense}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={111}>
          <Col span={24}>
            <BaseDetails title="公司所在地">
              {this.state.area}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={222}>
          <Col span={24}>
            <BaseDetails title="公司详细地址">
              {this.state.basicAuditInfo.address}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={2}>
          <Col span={24}>
            <BaseDetails title="执照有效期">
              {this.initDate(this.state.basicAuditInfo.businessStartTime, this.state.basicAuditInfo.businessEndTime)}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={5}>
          <Col span={24}>
            <BaseDetails title="注册资本">
              {this.initMoney(this.state.basicAuditInfo.registeredCapital)}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={6}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="营业执照原件" imgUrl={this.state.basicAuditInfo.businessLicensePath} disabled={true} />
            </FormItem>
          </Col>
        </Row>,
      ]
    }
  }

  handleGoBack = () => {
    this.props.history.goBack()
  }

  //提交审核前添加确认
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      // 提交如果校验通过弹出提示
      let _this = this;
      confirm({
        title: '是否确认提交?',
        onOk() {
          _this.currentSubmit()
        },
        onCancel() {
          Util.alert('已取消操作');
        },
      });
    });
  }

  // 表单提交
  currentSubmit = () => {
    
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      let _this = this;
      this.setState({
        loading: true
      })
      api.ajax('POST', '@/supplier/ecUserApprovalLog/save', {
        status: 1,
        approvalType: 2,
        companyId: this.state.basicAuditInfo.companyId,
        ...values
      }).then(r => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert(r.msg, { type: 'success', callback: () => (this.props.history.goBack()) });
      }).catch(r => {
        this.setState({
          loading: false
        })
        Util.alert(r.msg, { type: 'error' });
      })
    })
  }

  //根据证件类型获取页面显示
  getCardPage = (index) => {
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    if (index == 1) {
      return [
        <Row key={1}>
          <Col span={24}>
            <BaseDetails title="法人身份证件号">
              {this.state.basicAuditInfo.legalPersonId}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={123}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="身份证正面" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
            </FormItem>
          </Col>
        </Row>,
        <Row key={234}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="身份证反面" imgUrl={this.state.basicAuditInfo.legalPersonPath2} disabled={true} />
            </FormItem>
          </Col>
        </Row>,
      ]
    } else if (index == 2) {
      return [
        <Row key={1}>
          <Col span={24}>
            <BaseDetails title="法人护照证件号">
              {this.state.basicAuditInfo.legalPersonId}
            </BaseDetails>
          </Col>
        </Row>,
        <Row key={3}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="护照" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
            </FormItem>
          </Col>
        </Row>
      ]
    }
  }

  renderVatPayerPath = () => {
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    if (this.state.basicAuditInfo.taxType == 1) {
      return <Row>
        <Col span={12}>
          <FormItem {...uploadFormItemLayout}>
            <UploadImg title="纳税人资格证明" imgUrl={this.state.basicAuditInfo.vatPayerPath} disabled={true} />
          </FormItem>
        </Col>
      </Row>
    }
    return null
  }

  renderBackMsg = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    if (this.state.backMsg) {
      return <Card className="mb10" title={<span><Badge count={6} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 上次驳回意见</span>} bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="上次驳回意见">
              {this.state.backMsg}
            </FormItem>
          </Col>
        </Row>
      </Card>
    } else {
      return null
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const formItemLayoutClear = {
      wrapperCol: { span: 11 },
    };

    const isRequired = this.props.form.getFieldValue('result') == 1 ? false : true;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Card className="mb10" title={<span><Badge count={1} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 机构及法人信息</span>} bordered={false}>
            <Row>
              <Col span={24}>
                <BaseDetails title="公司名称">
                  {this.state.basicAuditInfo.name}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="公司类型">
                  {this.state.basicAuditInfo.factoryType == 1 ? "生产厂家" : this.state.basicAuditInfo.factoryType == 2 ? "贸易集成商" : "个体工商户"}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="出口资质">
                  {this.state.basicAuditInfo.exportQualification == 1 ? "有出口资质" : "无出口资质"}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="主营类目">
                  {this.state.basicAuditInfo.mainStr}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="法人姓名">
                  {this.state.basicAuditInfo.legalPersonName}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="证件类型">
                  {this.state.basicAuditInfo.legalPersonIdType == 1 ? "身份证" : "护照"}
                </BaseDetails>
              </Col>
            </Row>
            {this.getCardPage(this.state.basicAuditInfo.legalPersonIdType)}
          </Card>
          <Card className="mb10" title={<span><Badge count={2} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 企业证照信息</span>} bordered={false}>
            <Row>
              <Col span={24}>
                <BaseDetails title="三证合一">
                  {this.state.basicAuditInfo.threeInOne == 1 ? "三证合一" : "非三证合一"}
                </BaseDetails>
              </Col>
            </Row>
            {this.threeEvidenceContent(this.state.basicAuditInfo.threeInOne)}
          </Card>
          <Card className="mb10" title={<span><Badge count={3} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 财务及税务信息</span>} bordered={false}>
            <Row>
              <Col span={24}>
                <BaseDetails title="发票类型">
                  {this.state.basicAuditInfo.taxType == 1 ? "增值税专项发票" : "增值税普通发票"}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="税率">
                  {this.state.basicAuditInfo.taxPoint * 100 + '%'}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="开户许可证编号">
                  {this.state.basicAuditInfo.accountPermitNumber}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="机构基本账号">
                  {this.state.basicAuditInfo.companyBaseAccount}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="开户银行">
                  {this.state.basicAuditInfo.institutionalBank}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg title="开户许可证原件" imgUrl={this.state.basicAuditInfo.accountPermitPath} disabled={true} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="纳税人属性">
                  {this.state.basicAuditInfo.taxpayerAttribute == 1 ? "一般纳税人" : "小规模纳税人"}
                </BaseDetails>
              </Col>
            </Row>
            {this.renderVatPayerPath()}
          </Card>
          <Card className="mb10" title={<span><Badge count={4} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 说明材料</span>} bordered={false}>
            <FormItem {...formItemLayoutClear}>
              {this.renderClarification()}
            </FormItem>
          </Card>
          <Card className="mb10" title={<span><Badge count={5} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 申请人信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="申请人姓名">
                  {this.state.basicAuditInfo.username}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="申请人手机号">
                  {this.state.basicAuditInfo.contactPhone}
                </FormItem>
              </Col>
            </Row>
          </Card>
          {this.renderBackMsg()}
          <Card title={<span><Badge count={this.state.backMsg ? 7 : 6} style={{ backgroundColor: 'rgba(255,129,0,1)' }} />审核意见</span>} bordered={false}>
            <FormItem {...formItemLayout} label="审核结果">
              <RadioGroup
                {...getFieldProps('result',
                  {
                    initialValue: 1,
                    rules: [
                      {
                        required: true,
                        message: "请选择审核结果"
                      }
                    ],
                    onChange:()=>{
                      this.props.form.resetFields(['remark'])
                    }
                  })}>
                <Radio key="a" value={1}>审核通过</Radio>
                <Radio key="b" value={0}>驳回</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} required={isRequired} label="审核意见">
              <Input type="textarea" maxLength='400'
                {...getFieldProps('remark',
                  {
                    rules: [
                      {
                        required: isRequired,
                        message: "请输入审核意见"
                      }
                    ]
                  })} />
            </FormItem>
          </Card>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
            <Button type="primary" htmlType="submit" loading={this.state.loading}>提交</Button>
          </BaseAffix>
        </Form>
      </div>
    )
  }
}
export default Form.create()(AuditForBg);