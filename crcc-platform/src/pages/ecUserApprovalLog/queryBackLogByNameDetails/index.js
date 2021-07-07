import { Card, Form, Button, Row, Col, Table, Badge, Alert } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';

const FormItem = Form.Item;

class queryBackLogByNameDetails extends React.Component {
  state = {
    loading: false,
    mainCommodityData: [],//主营商品数据
    id: "",
    basicAuditInfo: {},
    Clarification: [],//说明材料
    auditList: [], //审核字典数据
    cardType: "", //证件类型
    threeInOne: "", //三证合一
    isLicenseLong: false, // 执照有效期长期标识
    isRegisteredCapital: false, // 注册资本无标识
    area: '',
    clarificationDocumentHistory: [],
    companyId: ''
  }
  _isMounted = false;

  auditKeyList = []; //需要审核的key数据

  componentWillMount() {
    this._isMounted = true;
    const id = this.props.match.params.id;
    const companyId = this.props.match.params.companyId;
    this.setState({
      id: id
    })
    this.getInfo(id); // 获取审核字典数据
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  getInfo = (id) => {
    let _this = this;
    api.ajax("GET", "@/supplier/ecCompanySupplier/getCompanyForApproval", {
      uuids: id,
      type: 1
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      //查询澄清文件
      this.getClarificationData(r.data.companyId);
      this.setState({
        basicAuditInfo: r.data
      })
      if(r.data.status==3){
        this.getBackMsg(r.data.uuids);
      }
    }).catch(r => { })
  }

  // 获得驳回数据
  getBackMsg = (uuids) => {
    api.ajax('GET', '@/supplier/ecAuditShortcutStatementCorrespond/querySupplierWordAuditList', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      let auditList = r.data.rows.filter(item => (item != null));
      this.setState({
        auditList
      })
    }).catch(r => {
      console.log(r)
    })
  }

  //渲染单条记录
  renderBackListMsg = (key) => {
    if (!this.state.auditList.length>0) {
      return null
    }
    let list = this.state.auditList;
    for (let i = 0; i < list.length; i++) {
      if (list[i].basicAuditName == key) {
        return (<Col span={10} offset={1}><Alert message={list[i].comment} type="error" showIcon /></Col>)
      }
    }
    return null
  }
  //获得澄清文件
  getClarificationData = (companyId) => {
    api.ajax('GET', '@/supplier/ecCompanySupplier/queryClarificationDocumentByCompanyId', {
      companyId
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
    if (list && list.length > 0) {
      return <a href={SystemConfig.configs.resourceUrl + list[0].url} target="_blank" download={list[0].urlName}>{list[0].urlName}</a>
    }
    return '-'
  }

  getbusinessTime = (start, end) => {
    return (
      <span>
        {'成立日期：' + moment(start).format("YYYY-MM-DD") + " 营业期限：" + (end == 1 ? "长期" : moment(end).format("YYYY-MM-DD"))}
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
          {this.renderBackListMsg('businessLicense')}
        </Row>,
        <Row gutter={16} key={111}>
          <Col span={12}>
            <BaseDetails title="公司所在地">
              {this.state.basicAuditInfo.areaStr}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('area')}
        </Row>,
        <Row gutter={16} key={222}>
          <Col span={12}>
            <BaseDetails title="公司详细地址">
              {this.state.basicAuditInfo.address}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('address')}
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <BaseDetails title="执照有效期">
              {this.getbusinessTime(this.state.basicAuditInfo.businessStartTime, this.state.basicAuditInfo.businessEndTime)}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('businessStartTime')}
        </Row>,
        <Row gutter={16} key={5}>
          <Col span={12}>
            <BaseDetails title="注册资本">
              {this.state.basicAuditInfo.registeredCapital == 0 ? "无" : this.state.basicAuditInfo.registeredCapital + "万"}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('registeredCapital')}
        </Row>,
        <Row gutter={16} key={6}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="营业执照原件" filename="businessLicensePath" imgUrl={this.state.basicAuditInfo.businessLicensePath} disabled={true} />
            </FormItem>
          </Col>
          {this.renderBackListMsg('businessLicensePath')}
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
            <BaseDetails title="税务登记证">
              {this.state.basicAuditInfo.taxRegistrationNumber}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('taxRegistrationNumber')}
        </Row>,
        <Row gutter={16} key={7}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="税务登记证" filename="taxRegistrationPath" imgUrl={this.state.basicAuditInfo.taxRegistrationPath} disabled={true} />
            </FormItem>
          </Col>
          {this.renderBackListMsg('taxRegistrationPath')}
        </Row>,
        <Row gutter={16} key={4}>
          <Col span={12}>
            <BaseDetails title="组织机构代码证">
              {this.state.basicAuditInfo.organizationCertificateCode}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('organizationCertificateCode')}
        </Row>,
        <Row gutter={16} key={8}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="组织机构代码证" filename="organizationCertificatePath" imgUrl={this.state.basicAuditInfo.organizationCertificatePath} disabled={true} />
            </FormItem>
          </Col>
          {this.renderBackListMsg('organizationCertificatePath')}
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
          {this.renderBackListMsg('businessLicense')}
        </Row>,
        <Row gutter={16} key={111}>
          <Col span={12}>
            <BaseDetails title="公司所在地">
              {this.state.basicAuditInfo.areaStr}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('area')}
        </Row>,
        <Row gutter={16} key={222}>
          <Col span={12}>
            <BaseDetails title="公司详细地址">
              {this.state.basicAuditInfo.address}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('address')}
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <BaseDetails title="执照有效期">
              {this.getbusinessTime(this.state.basicAuditInfo.businessStartTime, this.state.basicAuditInfo.businessEndTime)}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('businessStartTime')}
        </Row>,
        <Row gutter={16} key={5}>
          <Col span={12}>
            <BaseDetails title="注册资本">
              {this.state.basicAuditInfo.registeredCapital == 0 ? "无" : this.state.basicAuditInfo.registeredCapital + "万"}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('registeredCapital')}
        </Row>,
        <Row gutter={16} key={6}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="营业执照原件" filename="businessLicensePath" imgUrl={this.state.basicAuditInfo.businessLicensePath} disabled={true} />
            </FormItem>
          </Col>
          {this.renderBackListMsg('businessLicensePath')}
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

  // 表单提交
  handleSubmit = (status) => {

    // 未完任务
    //
    // 图片上传成功后需要把地址取到保存到数据库（这一块未处理）
    // 澄清文件数据集未处理
    //
    //

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      values.status = status;

      let _this = this;
      this.setState({
        loading: true
      })
      api.ajax('POST', '@/supplier/ecUserApprovalLog/save', {
        approvalType: 3,
        companyCheckId: this.state.basicAuditInfo.id,
        companyId: this.state.basicAuditInfo.companyId,
        ...values,
      }).then(r => {
        if (!_this._isMounted) {
          return;
        }
        Util.alert(r.msg, {
          type: 'success', callback: () => {
            this.props.history.goBack()
            this.setState({
              loading: false
            })
          }
        });
      }).catch(r => {
        this.setState({
          loading: false
        })
        Util.alert(r.msg, { type: 'error' });
      })
    })
  }

  handleGoBack = () => {
    window.close();
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
          {this.renderBackListMsg('legalPersonId')}
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
              <FormItem {...uploadFormItemLayout}>
                <UploadImg title="身份证正面" filename="legalPersonPath1" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
              </FormItem>
          </Col>
          {this.renderBackListMsg('legal_person_path1')}
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
              <FormItem {...uploadFormItemLayout}>
                <UploadImg title="身份证反面" filename="legalPersonPath2" imgUrl={this.state.basicAuditInfo.legalPersonPath2} disabled={true} />
              </FormItem>
          </Col>
          {this.renderBackListMsg('legal_person_path2')}
        </Row>
      ]
    } else {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <BaseDetails title="法人护照证件">
              {this.state.basicAuditInfo.legalPersonId}
            </BaseDetails>
          </Col>
          {this.renderBackListMsg('legalPersonId')}
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="护照" filename="legalPersonPath1" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
            </FormItem>
          </Col>
          {this.renderBackListMsg('legal_person_path1')}
        </Row>
      ]
    }
  }

  //渲染纳税人资格证明
  renderVatPayerPath = () => {
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    if (this.state.basicAuditInfo.taxType == 1) {
      return <Row gutter={16}>
        <Col span={12}>
          <FormItem {...uploadFormItemLayout}>
            <UploadImg title="纳税人资格证明" filename="vatPayerPath" imgUrl={this.state.basicAuditInfo.vatPayerPath} uploadSuccess={this.uploadSuccess} disabled={true} />
          </FormItem>
        </Col>
        {this.renderBackListMsg('vatPayerPath')}
      </Row>
    } else {
      return null
    }
  }


  renderCheckResult = (result) => {
    if (result == 1) {
      return <span>审核通过</span>
    } else if (result == 0) {
      return <span>驳回</span>
    }
    return null
  }

  render() {
    const { getFieldProps } = this.props.form;
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const isBigClass=this.state.auditList.length>0?'big_details':'';

    return (
      <div className={isBigClass}>
        <Form onSubmit={this.handleSubmit}>
          <Card className="mb10" title={<span><Badge count={1} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 机构及法人信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="公司名称">
                  {this.state.basicAuditInfo.name}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('name')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="公司类型">
                  {this.state.basicAuditInfo.factoryType == 1 ? "生产厂家" : this.state.basicAuditInfo.factoryType == 2 ? "贸易集成商" : "个体工商户"}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('factoryType')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="出口资质">
                  {this.state.basicAuditInfo.exportQualification == 1 ? "有出口资质" : "无出口资质"}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('exportQualification')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="主营类目">
                  {this.state.basicAuditInfo.mainStr}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('mainBusiness')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="法人姓名">
                  {this.state.basicAuditInfo.legalPersonName}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('legalPersonName')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="证件类型">
                  {this.state.basicAuditInfo.legalPersonIdType == 1 ? "身份证" : "护照"}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('legalPersonIdType')}
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
              {this.renderBackListMsg('threeInOne')}
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
              {this.renderBackListMsg('taxType')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="税率">
                  {this.state.basicAuditInfo.taxPoint * 100 + "%"}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="开户许可证编号">
                  {this.state.basicAuditInfo.accountPermitNumber}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('accountPermitNumber')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="机构基本账号">
                  {this.state.basicAuditInfo.companyBaseAccount}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('companyBaseAccount')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="开户银行">
                  {this.state.basicAuditInfo.institutionalBank}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('institutionalBank')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg title="开户许可证原件" filename="accountPermitPath" imgUrl={this.state.basicAuditInfo.accountPermitPath} disabled={true} />
                </FormItem>
              </Col>
              {this.renderBackListMsg('accountPermitPath')}
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="纳税人属性">
                  {this.state.basicAuditInfo.taxpayerAttribute == 1 ? '一般纳税人' : '小规模纳税人'}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('taxpayerAttribute')}
            </Row>
            {this.renderVatPayerPath()}
          </Card>
          <Card className="mb10" title={<span><Badge count={4} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 说明材料</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="说明材料">
                  {this.renderClarification()}
                </BaseDetails>
              </Col>
              {this.renderBackListMsg('clarification')}
            </Row>
          </Card>
          <Card className="mb10" title={<span><Badge count={5} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 申请人信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="申请人姓名">
                  {this.state.basicAuditInfo.username}
                </BaseDetails>
              </Col>
              <Col span={12}>
                <BaseDetails title="申请人手机号">
                  {this.state.basicAuditInfo.contactPhone}
                </BaseDetails>
              </Col>
            </Row>
          </Card>
          <Card title={<span><Badge count={6} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 审核意见</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="审核结果">
                  {this.renderCheckResult(this.state.basicAuditInfo.checkResult)}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="审核意见">
                  {this.state.basicAuditInfo.checkRemarks}
                </BaseDetails>
              </Col>
            </Row>
          </Card>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>关闭</Button>
          </BaseAffix>
        </Form>
      </div>
    )
  }
}
export default Form.create()(queryBackLogByNameDetails);