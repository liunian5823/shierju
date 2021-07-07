import { Card, Form, Button, Radio, Row, Col, Table, Badge } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import BaseDetails from '@/components/baseDetails';
import {systemConfigPath} from "@/utils/config/systemConfig";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class RCAuditDetails extends React.Component {
  state = {
    loading: false,
    id: "",
    basicAuditInfo: {},
    Clarification: [],//说明材料
    auditList: {}, //审核字典数据
    cardType: "", //证件类型
    threeInOne: "", //三证合一
    isLicenseLong: false, // 执照有效期长期标识
    isRegisteredCapital: false, // 注册资本无标识
    supplyAreaList:[], //供货区域
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
    this.areaClass(); // 供货区域
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => (
        <span>{index + ((this.params.page - 1) * this.params.rows) + 1}</span>
      )
    },
    {
      title: '文件名',
      dataIndex: 'title',
      key: 'title'
    }
  ]

  //获得澄清文件
  getClarificationData = (id) => {
    api.ajax('GET', '@/supplier/ecCompanySupplier/queryClarificationDocumentByCompanyId', {
      companyId:id
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
      this.getClarificationData(r.data.newData.id);
    }).catch(r => { })
  }

  formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 12 },
  };


  getbusinessTime = (start, end) => {
    return (
      <span>
        {moment(start).format("YYYY-MM-DD") + " ~ " + (end == 1 ? "长期" : moment(end).format("YYYY-MM-DD"))}
      </span>
    )
  }

  handleGoBack = () => {
    window.close()
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
        </Row>
      ]
    } else if (index == 2) {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <BaseDetails title="法人证件号码">
              {this.state.basicAuditInfo.legalPersonId}
            </BaseDetails>
          </Col>
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="证件号码" filename="legalPersonPath1" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
            </FormItem>
          </Col>
        </Row>
      ]
    } else if (index == 3){
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <BaseDetails title="法人其他证件号码">
              {this.state.basicAuditInfo.legalPersonId}
            </BaseDetails>
          </Col>
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="其他证件照片" filename="legalPersonPath1" imgUrl={this.state.basicAuditInfo.legalPersonPath1} disabled={true} />
            </FormItem>
          </Col>
        </Row>
      ]
    }
  }

  showTaxType = (str) =>{
    let taxType = '';
    if(str){
      if(str.toString().indexOf('1') != -1){
        taxType += " 增值税专项发票 ";
      }
      if(str.toString().indexOf('2') != -1){
        taxType += " 增值税普通发票 ";
      }
    }

    return taxType;
  }
//专业领域数据处理
  expertise=(type)=>{
    const expList= (type || "").split(',') ;
    let exp=[];
    {expList.forEach((item,index)=>{
      if (item=='1'){
        exp.push("房建类");
      } else if (item =="2"){
        exp.push("公路类");
      } else if (item =="3"){
        exp.push("铁路类");
      }else if (item =="4"){
        exp.push("桥梁隧道类");
      }else if (item =="5"){
        exp.push("市政类");
      }
    })
    }
    return exp.join(",")
  }
  // 先查询地域 (供货区域)
  areaClass = () => {
    api.ajax('GET', '@/base/ecProvince/selectArea', {}).then(r => {
      if (r.msg === '请求成功') {
        this.setState({
          supplyAreaList: r.data.rows
        });
      }
    }).catch(r => {
    });
  }
  areaOptions = (supplyArea) => {
    var options = '';
    this.state.supplyAreaList.map((v, index) => {
      if(supplyArea && supplyArea.indexOf(v.areaCode) !==-1) {
        options = options+v.areaName+' ';
      }
    });
    return options;
  }
  render() {
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <Form>
          <Card className="mb10" title={<span><Badge count={1} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 企业信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="公司名称">
                  {this.state.basicAuditInfo.name}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="公司简称">
                  {this.state.basicAuditInfo.companyReferred}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16} key={1}>
              <Col span={12}>
                <BaseDetails title="营业执照号">
                  {this.state.basicAuditInfo.businessLicense}
                </BaseDetails>
              </Col>
            </Row>

            <Row gutter={16} key={5}>
              <Col span={12}>
                <BaseDetails title="注册资本">
                  {this.state.basicAuditInfo.registeredCapital==null || this.state.basicAuditInfo.registeredCapital == 0 ? "无" : this.state.basicAuditInfo.registeredCapital + "万"}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16} key={111}>
              <Col span={12}>
                <BaseDetails title="企业经营地址">
                  {this.state.basicAuditInfo.areaStr}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16} key={222}>
              <Col span={12}>
                <BaseDetails title="注册详细地址">
                  {this.state.basicAuditInfo.address}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16} key={2}>
              <Col span={12}>
                <BaseDetails title="营业期限">
                  {this.getbusinessTime(this.state.basicAuditInfo.businessStartTime, this.state.basicAuditInfo.businessEndTime)}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="企业官网">
                  {this.state.basicAuditInfo.companyUrl}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="企业类型">
                  {this.state.basicAuditInfo.factoryType == 1 ? "生产厂家" : this.state.basicAuditInfo.factoryType == 2 ? "贸易集成商" : "个体工商户"}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="出口资质">
                  {this.state.basicAuditInfo.exportQualification == 1 ? "有出口资质" : "无出口资质"}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16} key={6}>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg title="营业执照原件" filename="businessLicensePath" imgUrl={this.state.basicAuditInfo.businessLicensePath} disabled={true} />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card className="mb10" title={<span><Badge count={2} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 人员信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="法人姓名">
                  {this.state.basicAuditInfo.legalPersonName}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="证件类型">
                  {this.state.basicAuditInfo.legalPersonIdType == 1 ? "身份证" : this.state.basicAuditInfo.legalPersonIdType == 2 ? "护照" : this.state.basicAuditInfo.legalPersonIdType == 3 ? "其他证件" : ''}
                </BaseDetails>
              </Col>
            </Row>
            {this.getCardPage(this.state.basicAuditInfo.legalPersonIdType)}
          </Card>
          <Card className="mb10" title={<span><Badge count={3} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 财务及税务信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg title="开户许可证原件" filename="accountPermitPath" imgUrl={this.state.basicAuditInfo.accountPermitPath} disabled={true} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="机构基本账号">
                  {this.state.basicAuditInfo.companyBaseAccount}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="开户银行">
                  {this.state.basicAuditInfo.institutionalBank}
                </BaseDetails>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="纳税人属性">
                  {this.state.basicAuditInfo.taxpayerAttribute == 1 ? '一般纳税人' : '小规模纳税人'}
                </BaseDetails>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="发票类型">
                  {this.showTaxType(this.state.basicAuditInfo.taxType)}
                </BaseDetails>
              </Col>
            </Row>
            
          </Card>
          <Card className="mb10" title={<span><Badge count={4} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 说明材料</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="专业领域">
                  {this.state.basicAuditInfo.expertiseArea?this.expertise(this.state.basicAuditInfo.expertiseArea):"-"}
                </BaseDetails>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="主营品牌">
                  {this.state.basicAuditInfo.businessBrand}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="主营产品">
                  {this.state.basicAuditInfo.businessProduct}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="供货区域">
                  {this.areaOptions(this.state.basicAuditInfo.supplyArea)}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="说明材料">
                  {this.renderClarification()}
                </BaseDetails>
              </Col>
            </Row>
          </Card>
          <Card className="" title={<span><Badge count={5} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 申请人信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="申请人姓名">
                  {this.state.auditList.username}
                </BaseDetails>
              </Col>
              <Col span={12}>
                <BaseDetails title="申请人手机号">
                  {this.state.auditList.contactPhone}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                {/*<FormItem {...formItemLayout} label="申请原因">
                  {this.state.basicAuditInfo.approvalReason}
                </FormItem>*/}
                <BaseDetails title="申请原因">
                  {this.state.basicAuditInfo.approvalReason}
                </BaseDetails>
              </Col>
            </Row>
          </Card>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleGoBack}>返回</Button>
          </BaseAffix>
        </Form>
      </div>
    )
  }
}
export default Form.create()(RCAuditDetails);