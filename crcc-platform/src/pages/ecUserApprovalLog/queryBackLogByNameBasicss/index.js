import { Card, Form, Input, Button, Radio, Row, Col, Alert, Table, Badge ,Modal} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';

import less from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
class RCAuditForBasic extends React.Component {
  state = {
    loading: false,
    mainCommodityData: [],//主营商品数据
    id: "",
    basicAuditInfo: {},
    Clarification: [],//说明材料
    auditList: {}, //审核字典数据
    cardType: "", //证件类型
    threeInOne: "", //三证合一
    isLicenseLong: false, // 执照有效期长期标识
    isRegisteredCapital: false, // 注册资本无标识
    provinceList: [],//省数据
    cityList: [],//省下对应市数据
    areaList: [],//市下对应县数据
    clarificationDocumentHistory: []
  }
  _isMounted = false;

  auditKeyList = []; //需要审核的key数据

  componentWillMount() {
    this._isMounted = true;
    const id = this.props.match.params.uuids;
    this.setState({
      id: id
    })
    this.getAuditList(id); // 获取审核字典数据
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  getAuditList = (id) => {
    let _this = this;
    api.ajax("GET", "@/supplier/ecCompanyCheck/loadRenewCheckDate", {
      uuids: id
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        basicAuditInfo: r.data.newData,
        auditList: r.data.oldData
      })
      //查询澄清文件
      this.getClarificationData(r.data.newData.uuids);
    })
  }

  //获得澄清文件
  getClarificationData = (uuids) => {
    api.ajax('GET', '@/supplier/ecCompanyCheck/queryClarificationDocumentByCompanyCheckUuids', {
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
        title: '上传时间',
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

  initAuditModul = (key) => {
    if (this.state.auditList[key] != this.state.basicAuditInfo[key]) {
      let message = "旧数据: ";
      if (key == "factoryType") {
        //公司类型
        message += this.state.auditList.factoryType == 1 ? "生产厂家" : this.state.auditList.factoryType == 2 ? "贸易集成商" : "个体工商户";
      } else if (key == "exportQualification") {
        //出口资质
        message += this.state.auditList.exportQualification == 1 ? "有出口资质" : "无出口资质";
      } else if (key == "legalPersonIdType") {
        //证件类型
        message += this.state.auditList.legalPersonIdType == 1 ? "身份证" : "护照";
      } else if (key == "threeInOne") {
        //是否三证合一
        message += this.state.auditList.threeInOne == "1" ? "三证合一" : "非三证合一";
      } else if (key == "businessStartTime" || key == "businessEndTime") {
        //执照有效期
        message += this.getbusinessTime(this.state.auditList.businessStartTime, this.state.auditList.businessEndTime);
      } else if (key == "isRegisteredCapital" || key == "registeredCapital") {
        //注册资本
        message += this.state.auditList.isRegisteredCapital ? "无" : this.state.auditList.registeredCapital + "万";
      } else if (key == "taxPoint") {
        //税率
        message += this.state.auditList.taxPoint * 100 + "%";
      } else if (key == "legalPersonPath1" || key == "legalPersonPath2" || key == "businessLicensePath" || key == "taxRegistrationPath" || key == "organizationCertificatePath" || key == "accountPermitPath" || key == "vatPayerPath") {
        message = "图片已经改变";
      } else {
        message += this.state.auditList[key];
      }
      return (
        <Alert message={message} type="info" showIcon closable />
      )
    }
  }

  getbusinessTime = (start, end) => {
    return (
      <span>
        {'成立日期：' + moment(start).format("YYYY-MM-DD") + "营业期限：" + (end == 1 ? "长期" : moment(end).format("YYYY-MM-DD"))}
      </span>
    )
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
        <Row gutter={16} key={1}>
          <Col span={12}>
            <BaseDetails title="营业执照号">
              {this.state.basicAuditInfo.businessLicense}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessLicense", "isPass_businessLicenseCode", "phrase_businessLicenseCode")}
          </Col>
        </Row>,
        <Row gutter={16} key={111}>
          <Col span={12}>
            <BaseDetails title="公司所在地">
              {this.state.basicAuditInfo.areaStr}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("areaStr", "isPass_addressOther", "phrase_addressOther")}
          </Col>
        </Row>,
        <Row gutter={16} key={222}>
          <Col span={12}>
            <BaseDetails title="公司详细地址">
              {this.state.basicAuditInfo.address}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("address", "isPass_address", "phrase_address")}
          </Col>
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <BaseDetails title="执照有效期1">
              {this.getbusinessTime(this.state.basicAuditInfo.businessStartTime, this.state.basicAuditInfo.businessEndTime)}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessStartTime", "isPass_businessStartTime", "phrase_businessStartTime")}
          </Col>
        </Row>,
        <Row gutter={16} key={5}>
          <Col span={12}>
            <BaseDetails title="注册资本">
              {this.state.basicAuditInfo.registeredCapital == 0 ? "无" : this.state.basicAuditInfo.registeredCapital + "万"}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("registeredCapital", "isPass_registeredCapital", "phrase_registeredCapital")}
          </Col>
        </Row>,
        <Row gutter={16} key={6}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="营业执照原件" filename="businessLicensePath" imgUrl={this.state.basicAuditInfo.businessLicensePath} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessLicensePath", "isPass_businessLicensePath", "phrase_businessLicensePath")}
          </Col>
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
            <BaseDetails title="税务登记证">
              {this.state.basicAuditInfo.taxRegistrationNumber}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("taxRegistrationNumber", "isPass_taxRegistrationNumber", "phrase_taxRegistrationNumber")}
          </Col>
        </Row>,
        <Row gutter={16} key={7}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="税务登记证" filename="taxRegistrationPath" imgUrl={this.state.basicAuditInfo.taxRegistrationPath} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("taxRegistrationPath", "isPass_taxRegistrationPath", "phrase_taxRegistrationPath")}
          </Col>
        </Row>,
        <Row gutter={16} key={4}>
          <Col span={12}>
            <BaseDetails title="组织机构代码证">
              {this.state.basicAuditInfo.organizationCertificateCode}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("organizationCertificateCode", "isPass_companyOrganizationCode", "phrase_companyOrganizationCode")}
          </Col>
        </Row>,
        <Row gutter={16} key={8}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="组织机构代码证" filename="organizationCertificatePath" imgUrl={this.state.basicAuditInfo.organizationCertificatePath} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("organizationCertificatePath", "isPass_organizationCertificatePath", "phrase_organizationCertificatePath")}
          </Col>
        </Row>,
      ]
    } else {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <BaseDetails title="营业执照号">
              {this.state.basicAuditInfo.businessLicense}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessLicense", "isPass_businessLicenseCode", "phrase_businessLicenseCode")}
          </Col>
        </Row>,
        <Row gutter={16} key={111}>
          <Col span={12}>
            <BaseDetails title="公司所在地">
              {this.state.basicAuditInfo.areaStr}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("areaStr", "isPass_addressOther", "phrase_addressOther")}
          </Col>
        </Row>,
        <Row gutter={16} key={222}>
          <Col span={12}>
            <BaseDetails title="公司详细地址">
              {this.state.basicAuditInfo.address}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("address", "isPass_address", "phrase_address")}
          </Col>
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <BaseDetails title="执照有效期2">
              {this.getbusinessTime(this.state.basicAuditInfo.businessStartTime, this.state.basicAuditInfo.businessEndTime)}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessStartTime", "isPass_businessStartTime", "phrase_businessStartTime")}
          </Col>
        </Row>,
        <Row gutter={16} key={5}>
          <Col span={12}>
            <BaseDetails title="注册资本">
              {this.state.basicAuditInfo.registeredCapital == 0 ? "无" : this.state.basicAuditInfo.registeredCapital + "万"}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("registeredCapital", "isPass_registeredCapital", "phrase_registeredCapital")}
          </Col>
        </Row>,
        <Row gutter={16} key={6}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="营业执照原件" filename="businessLicensePath" imgUrl={this.state.basicAuditInfo.businessLicensePath} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("registeredCapital", "isPass_registeredCapital", "phrase_registeredCapital")}
          </Col>
        </Row>
      ]
    }
  }

  // 执照有效期长期按钮事件
  isLicenseLongChange = (e) => {
    this.props.form.resetFields(["businessEndTime"]);
    this.setState({
      isLicenseLong: e.target.checked
    })
  }
  //注册资本--无按钮事件
  isRegisteredCapitalChange = (e) => {
    this.props.form.resetFields(["registeredCapital"]);
    this.setState({
      isRegisteredCapital: e.target.checked
    })
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
  currentSubmit = (status) => {
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
        approvalType: 3,
        companyCheckId: this.state.basicAuditInfo.id,
        companyId: this.state.basicAuditInfo.companyId,
        ...values,
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

  handleGoBack = () => {
    this.props.history.goBack();
  }

  //更换证件类型
  handleChangeCardType = (e) => {
    this.setState({
      cardType: e.target.value
    })
  }
  //根据证件类型获取页面显示
  getCardPage = (index) => {
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    if (index == 1) {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <BaseDetails title="法人身份证件">
              {this.state.basicAuditInfo.legalPersonId}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonId", "isPass_legalPersonId", "phrase_legalPersonId")}
          </Col>
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <Col span={24}>
              <FormItem {...uploadFormItemLayout}>
                <UploadImg title="身份证正面" filename="legalPersonPath1" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...uploadFormItemLayout}>
                <UploadImg title="身份证反面" filename="legalPersonPath2" imgUrl={this.state.basicAuditInfo.legalPersonPath2} disabled={true} />
              </FormItem>
            </Col>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonCard", "isPass_legalPersonCard", "phrase_legalPersonCard")}
          </Col>
        </Row>
      ]
    } if (index == 2) {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <BaseDetails title="法人护照证件">
              {this.state.basicAuditInfo.legalPersonId}
            </BaseDetails>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonId", "isPass_legalPersonId", "phrase_legalPersonId")}
          </Col>
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="护照" filename="legalPersonPath1" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonCard", "isPass_legalPersonCard", "phrase_legalPersonCard")}
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
        <Col span={12}>
          {this.initAuditModul("vatPayerPath", "isPass_vatPayerPath", "phrase_vatPayerPath")}
        </Col>
      </Row>
    }
    return null
  }

  render() {
    const { getFieldProps } = this.props.form;
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const formItemLayoutClear = {
      wrapperCol: { span: 20 },
    };

    const isRequired = this.props.form.getFieldValue('result') == 1 ? false : true;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Card className="mb10" title={<span><Badge count={1} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 机构及法人信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="公司名称">
                  {this.state.basicAuditInfo.name}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("name", "isPass_name", "phrase_name")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="公司类型">
                  {this.state.basicAuditInfo.factoryType == 1 ? "生产厂家" : this.state.basicAuditInfo.factoryType == 2 ? "贸易集成商" : "个体工商户"}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("factoryType", "isPass_factoryType", "phrase_factoryType")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="出口资质">
                  {this.state.basicAuditInfo.exportQualification == 1 ? "有出口资质" : "无出口资质"}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("exportQualification", "isPass_exportQualification", "phrase_exportQualification")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="主营类目">
                  {this.state.basicAuditInfo.mainStr}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("mainStr", "isPass_mainStr", "phrase_mainStr")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="法人姓名">
                  {this.state.basicAuditInfo.legalPersonName}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("legalPersonName", "isPass_legalPersonName", "phrase_legalPersonName")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="证件类型">
                  {this.state.basicAuditInfo.legalPersonIdType == 1 ? "身份证" : this.state.basicAuditInfo.legalPersonIdType == 2 ? "护照" : ''}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("legalPersonIdType", "isPass_legalPersonIdType", "phrase_legalPersonIdType")}
              </Col>
            </Row>
            {this.getCardPage(this.state.basicAuditInfo.legalPersonIdType)}
          </Card>
          <Card className="mb10" title={<span><Badge count={2} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 企业证照信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="是否三证合一">
                  {this.state.basicAuditInfo.threeInOne == "1" ? "三证合一" : "非三证合一"}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("threeInOne", "isPass_threeInOne", "phrase_threeInOne")}
              </Col>
            </Row>

            {this.threeEvidenceContent(this.state.basicAuditInfo.threeInOne)}

          </Card>
          <Card className="mb10" title={<span><Badge count={3} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 财务及税务信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="发票类型">
                  {this.state.basicAuditInfo.taxType == 1 ? "增值税专项发票" : "增值税普通发票"}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("taxType", "isPass_taxType", "phrase_taxType")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="税率">
                  {this.state.basicAuditInfo.taxPoint * 100 + "%"}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("taxPoint", "isPass_taxPoint", "phrase_taxPoint")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="开户许可证编号">
                  {this.state.basicAuditInfo.accountPermitNumber}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("accountPermitNumber", "isPass_accountPermitNumber", "phrase_accountPermitNumber")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="机构基本账号">
                  {this.state.basicAuditInfo.companyBaseAccount}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("companyBaseAccount", "isPass_companyBaseAccount", "phrase_companyBaseAccount")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="开户银行">
                  {this.state.basicAuditInfo.institutionalBank}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("institutionalBank", "isPass_institutionalBank", "phrase_institutionalBank")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg title="开户许可证原件" filename="accountPermitPath" imgUrl={this.state.basicAuditInfo.accountPermitPath} disabled={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("accountPermitPath", "isPass_accountPermitPath", "phrase_accountPermitPath")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="纳税人属性">
                  {this.state.basicAuditInfo.taxpayerAttribute == 1 ? '一般纳税人' : '小规模纳税人'}
                </BaseDetails>
              </Col>
              <Col span={12}>
                {this.initAuditModul("taxpayerAttribute", "isPass_taxpayerAttribute", "phrase_taxpayerAttribute")}
              </Col>
            </Row>
            {this.renderVatPayerPath()}
          </Card>
          <Card className="mb10" title={<span><Badge count={4} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 说明材料</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayoutClear}>
                  {this.renderClarification()}
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("Clarification", "isPass_clarification", "phrase_clarification")}
              </Col>
            </Row>
          </Card>
          <Card className="mb10" title={<span><Badge count={5} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 申请人信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="申请人姓名">
                  {this.state.auditList.username}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="申请人手机号">
                  {this.state.auditList.contactPhone}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title={<span><Badge count={6} style={{ backgroundColor: 'rgba(255,129,0,1)' }} />审核意见</span>} bordered={false}>
            <FormItem {...formItemLayout} label="审核意见">
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
            <Button type="primary" loading={this.state.loading} onClick={(e) => (this.handleSubmit(e))}>提交</Button>
          </BaseAffix>
        </Form>
      </div>
    )
  }
}
export default Form.create()(RCAuditForBasic);