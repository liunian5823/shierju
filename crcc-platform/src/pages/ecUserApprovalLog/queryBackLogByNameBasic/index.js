import { Card, Form, Button, Select, Radio, Row, Col, DatePicker, Checkbox, Table, Badge, Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';

import less from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class queryBackLogByNameBasic extends React.Component {
  state = {
    loading: false,
    mainCommodityData: [],//主营商品数据
    id: "",
    basicAuditInfo: {},
    Clarification: [],//说明材料
    auditList: [], //审核字典数据
    cardType: "", //证件类型
    threeInOne: "", //三证合一
    appDisabled: false,
    isLicenseLong: false, // 执照有效期长期标识
    isRegisteredCapital: false, // 注册资本无标识
    provinceList: [],//省数据
    cityList: [],//省下对应市数据
    areaList: [],//市下对应县数据
    legalPersonPath1: "",
    legalPersonPath2: "",
    businessLicensePath: "",//营业执照原件
    taxRegistrationPath: "",//税务登记证
    organizationCertificatePath: "",//组织机构代码证
    accountPermitPath: "",//开户许可证原件
    vatPayerPath: "",//纳税人资格证明
    startValue: null,
    endValue: null,
    endOpen: false,
    clarificationDocumentHistory: '',//澄清文件历史记录
    backMsg: ''//驳回信息
  }
  _isMounted = false;

  auditKeyList = []; //需要审核的key数据

  componentWillMount() {
    this._isMounted = true;
    const id = this.props.match.params.uuids;//这里id是uuids
    this.setState({
      id: id
    })
    // //获取省/市/县
    this.getProvinceList();
    //主营商品
    this.getMainCommodityData();
    this.getInfo(id);
    this.getAuditList(id); // 获取审核字典数据
    //查询澄清文件
    this.getClarificationData(id);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAuditListData = (uuids) => {
    api.ajax('GET', '@/supplier/ecAuditShortcutStatementCorrespond/querySupplierWordAuditList', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      let curObj = {};
      r.data.rows.forEach((o, i) => {
        if (o) {
          let key = o.basicAuditName;
          curObj['isPass_' + key] = o.checkStatus + '';
          curObj['phrase_' + key] = o.commentId;
        }
      })
      this.props.form.setFieldsValue(curObj);
    })
  }

  // 获取省数据
  getProvinceList = () => {
    api.ajax("GET", "@/base/ecProvince/selectAll").then(r => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        provinceList: r.data.rows,
      })
    })
  }
  // 获取市数据
  getCityList = (provinceCode, isInit = false) => {
    if (!isInit) {
      this.props.form.resetFields(['cityCode', 'areaCode']);
    }
    api.ajax("GET", "@/base/ecCity/selectProvinceCode", {
      provinceCode: provinceCode
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      if (isInit) {
        this.setState({
          cityList: r.data.rows,
        })
      } else {
        this.setState({
          cityList: r.data.rows,
          areaList: []
        })
      }
    })
  }
  // 获取县数据
  getAreaList = (cityCode, isInit = false) => {
    if (!isInit) {
      this.props.form.resetFields(['areaCode']);
    }
    api.ajax("GET", "@/base/ecArea/selectCityCode", {
      cityCode: cityCode
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        areaList: r.data.rows
      })
    })
  }

  // 获取主营商品数据信息
  getMainCommodityData = () => {
    let _this = this;
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('GET', '@/base/ecGoodsClass/all', {
      level: 1
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        loading: false,
        mainCommodityData: r.data.rows
      })
    }).catch(r => {
      this.setState({
        loading: false
      })
    })
  }

  // 文件上传成功
  uploadSuccess = (value, key) => {
    this.setState({
      [key]: value
    })
  }

  getInfo = (id) => {
    let _this = this;
    api.ajax("GET", "@/supplier/ecCompanySupplier/get", {
      uuids: id
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }

      //更换执照有效期长期按钮数据类型 / 当结束日期是1的时候长期按钮选中
      r.data.isLicenseLong = r.data.businessEndTime === '1' ? true : false;
      if (r.data.businessEndTime == '1') {
        r.data.businessEndTime = null;
      }

      //更换注册资本无按钮数据类型
      r.data.isRegisteredCapital = r.data.registeredCapital ? false : true;
      if (r.data.registeredCapital == 0) {
        r.data.registeredCapital = null;
      }

      //审核原因 （接口多用问题）
      r.data.remark = r.data.checkRemarks;
      //审核结果 （接口多用问题）
      r.data.approvalResult = r.data.checkResult ? parseInt(r.data.checkResult) : 1;

      this.setState({
        basicAuditInfo: r.data,
        legalPersonPath1: r.data.legalPersonPath1,
        legalPersonPath2: r.data.legalPersonPath2,
        businessLicensePath: r.data.businessLicensePath,//营业执照原件
        taxRegistrationPath: r.data.taxRegistrationPath,//税务登记证
        organizationCertificatePath: r.data.organizationCertificatePath,//组织机构代码证
        accountPermitPath: r.data.accountPermitPath,//开户许可证原件
        vatPayerPath: r.data.vatPayerPath,//纳税人资格证明
        cardType: r.data.legalPersonIdType, // 初始化证件类型
        threeInOne: r.data.threeInOne, // 初始化三证合一
        isLicenseLong: r.data.isLicenseLong, // 执照有效期长期
        isRegisteredCapital: r.data.isRegisteredCapital, // 注册资本无
      })

      // // 加载市县数据
      this.getCityList(r.data.provinceCode, true);
      this.getAreaList(r.data.cityCode, true);
      //渲染form表单数据
      r.data.taxPoint = r.data.taxPoint ? r.data.taxPoint.toString() : null;//select处理成字符串
      r.data.businessEndTime = (r.data.businessEndTime && r.data.businessEndTime != 1) ? r.data.businessEndTime : null;
      this.props.form.setFieldsValue(r.data);//处理时间

      this.getBackInfo(id);

      this.props.form.setFieldsValue(r.data);

    })
  }

  // 获得驳回信息
  getBackInfo = (id) => {
    api.ajax('GET', '@/supplier/ecUserApprovalLog/queryCheckResultBycompanyUUIds', {
      companyUUIds: id,
      type: 1
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        backMsg: r.data.remark
      })
    })
  }

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

  getAuditList = (id) => {
    let _this = this;
    api.ajax("GET", "@/supplier/ecAuditShortcutStatementCorrespond/queryAuditData", {
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      let list = r.data;
      list.map(item => {
        let cur = item.data;
        if (cur.length >= 2) {
          item.data = cur.sort((a, b) => { return a.sort - b.sort });
        }
      })
      this.setState({
        auditList: list
      })
      this.getAuditListData(id);
    })
  }

  formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 12 },
  };
  formItemLayoutOther = {
    wrapperCol: { span: 24 }
  }

  initAuditModul = (key, isPassKey, phrase) => {
    const { getFieldProps } = this.props.form;
    let curObj = "";
    let isHas = false;
    this.state.auditList.forEach((o, i) => {
      if (o.basicAuditCode == key) {
        curObj = o;
        isHas = true;
        if (this.auditKeyList.indexOf(key) < 0) {
          this.auditKeyList.push(key);
        }
      }
    })
    if (isHas) {
      if (this.props.form.getFieldValue(isPassKey) != 2) {
        return (
          <Col span={8} key={isPassKey}>
            <FormItem {...this.formItemLayoutOther}>
              <RadioGroup
                {...getFieldProps(isPassKey,
                  {
                    initialValue: "1",
                    rules: [
                      {
                        required: true,
                        message: "请审核"
                      }
                    ],
                    onChange: (e) => (this.handleAuditChange(e, isPassKey))
                  })}>
                <Radio value="1">审核通过</Radio>
                <Radio value="2">驳回</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        )
      }
      let initialValue = curObj.data[0].id.toString();
      return [
        <Col span={8} key={isPassKey}>
          <FormItem {...this.formItemLayoutOther}>
            <RadioGroup
              {...getFieldProps(isPassKey,
                {
                  initialValue: '1',
                  rules: [
                    {
                      required: true,
                      message: "请审核"
                    }
                  ],
                  onChange: (e) => (this.handleAuditChange(e, isPassKey))
                })}>
              <Radio value="1">审核通过</Radio>
              <Radio value="2">驳回</Radio>
            </RadioGroup>
          </FormItem>
        </Col>,
        <Col span={12} key={phrase}>
          <FormItem label="快捷短语" {...this.formItemLayout}>
            <Select
              {...getFieldProps(phrase,
                {
                  initialValue: initialValue,
                  rules: [
                    {
                      required: true,
                      message: "请选择快捷短语"
                    }
                  ]
                })}>
              {Util.getOptionList(curObj.data, "id", "comment")}
            </Select>
          </FormItem>
        </Col>
      ]
    }
  }
  handleAuditChange = (e, isPassKey) => {
    if (e.target.value == '2') {
      this.props.form.setFieldsValue({ approvalResult: 0 });
      return;
    }
    let isPassAuditKeyList = this.auditKeyList.map((item) => {
      return 'isPass_' + item;
    })
    let auditValues = this.props.form.getFieldsValue(isPassAuditKeyList);
    let isStop = false;
    for (let key in auditValues) {
      if (auditValues[key] == '2' && key != isPassKey) {
        isStop = true;
      }
    }
    if (isStop) {
      this.props.form.setFieldsValue({ approvalResult: 0 });
    } else {
      this.props.form.setFieldsValue({ approvalResult: 1 });
    }
  }

  disabledStartDate = (startValue) => {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  }
  disabledEndDate = (endValue) => {
    debugger;
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.getTime() <= this.state.startValue.getTime();
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (value) => {
    this.onChange('startValue', value);
  }
  onEndChange = (value) => {
    this.onChange('endValue', value);
  }
  handleStartToggle = ({ open }) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }
  handleEndToggle = ({ open }) => {
    this.setState({ endOpen: open });
  }

  //三证合一
  threeInOneChange = (e) => {
    this.setState({
      threeInOne: e.target.value
    })
  }

  threeEvidenceContent = (index) => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const otherFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }
    if (index == 0) {
      return [
        <Row gutter={16} key={3}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="税务登记证">
              <Input type="text" maxLength='20'
                {...getFieldProps('taxRegistrationNumber',
                  {
                    rules: [
                      {
                        required: true,
                        message: "请输入税务登记证"
                      }
                    ]
                  })}
                placeholder="请输入税务登记证" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("taxRegistrationNumber", "isPass_taxRegistrationNumber", "phrase_taxRegistrationNumber")}
          </Col>
        </Row>,
        <Row gutter={16} key={7}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="税务登记证" filename="taxRegistrationPath" imgUrl={this.state.taxRegistrationPath} uploadSuccess={this.uploadSuccess} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("taxRegistrationPath", "isPass_taxRegistrationPath", "phrase_taxRegistrationPath")}
          </Col>
        </Row>,
        <Row gutter={16} key={4}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="组织机构代码证">
              <Input type="text" maxLength='20'
                {...getFieldProps('organizationCertificateCode',
                  {
                    rules: [
                      {
                        required: true,
                        message: "请输入组织机构代码证"
                      }
                    ]
                  })}
                placeholder="请输入组织机构代码证" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("organizationCertificateCode", "isPass_companyOrganizationCode", "phrase_companyOrganizationCode")}
          </Col>
        </Row>,
        <Row gutter={16} key={8}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="组织机构代码证" filename="organizationCertificatePath" imgUrl={this.state.organizationCertificatePath} uploadSuccess={this.uploadSuccess} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("organizationCertificatePath", "isPass_organizationCertificatePath", "phrase_organizationCertificatePath")}
          </Col>
        </Row>
      ]
    } else {
      return null
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

  //获取右侧审核数据列表对象
  getAuditData = () => {
    let basicAuditJson = []
    this.auditKeyList.forEach((o, i) => {
      let curObj = {};
      let obj = this.props.form.getFieldsValue([o, "isPass_" + o, "phrase_" + o])
      curObj.basicAuditName = o;
      curObj.checkStatus = obj["isPass_" + o];
      curObj.commentId = obj["phrase_" + o];
      basicAuditJson.push(curObj);
    })
    return basicAuditJson;
  }


  //提交审核前添加确认
  handleSubmit = (status) => {
    if (status == 0) {
      //保存直接提交
      this.currentSubmit(0)
    } else {
      this.props.form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        // 提交如果校验通过弹出提示
        let _this = this;
        confirm({
          title: '是否确认提交?',
          onOk() {
            _this.currentSubmit(1)
          },
          onCancel() {
            Util.alert('已取消操作');
          },
        });

      })
    }
  }

  // 表单提交
  currentSubmit = (status) => {
    // 未完任务
    // 图片上传成功后需要把地址取到保存到数据库（这一块未处理）
    // 澄清文件数据集未处理
    //
    //
    let ary = ['name', 'provinceCode', 'cityCode', 'areaCode', 'address', 'factoryType', 'exportQualification', 'mainBusiness', 'legalPersonName', 'legalPersonIdType', 'legalPersonId', 'threeInOne', 'businessLicense', 'businessStartTime', 'businessEndTime', 'registeredCapital', 'taxType', 'taxPoint', 'accountPermitNumber', 'companyBaseAccount', 'institutionalBank', 'taxpayerAttribute']

    if (this.state.threeInOne == 0) {
      ary.push('taxRegistrationNumber');
      ary.push('organizationCertificateCode');
    }
    let isApp = this.auditKeyList.some((o, i) => {
      let obj = this.props.form.getFieldsValue([o, "isPass_" + o, "phrase_" + o])
      return obj["isPass_" + o] == 2;
    })

    if (status == 0) {//保存
      this.props.form.validateFields(ary, (errors, values) => {
        if (!!errors) {
          return;
        }
        //执照有效期长期按钮选中的情况下
        if (this.state.isLicenseLong) {
          values.businessEndTime = '1';
        }
        //注册资本无按钮选中的情况
        if (this.state.isRegisteredCapital) {
          values.registeredCapital = 0;
        }
        values.basicAuditJson = JSON.stringify(this.getAuditData());
        values.status = status;
        values.approvalResult = this.props.form.getFieldValue('approvalResult');
        values.remark = this.props.form.getFieldValue('remark');

        let imgObj = {
          legalPersonPath1: this.state.legalPersonPath1,//证件照1
          legalPersonPath2: this.state.legalPersonPath2,//证件照2
          businessLicensePath: this.state.businessLicensePath,//营业执照原件
          taxRegistrationPath: this.state.taxRegistrationPath,//税务登记证
          organizationCertificatePath: this.state.organizationCertificatePath,//组织机构代码证
          accountPermitPath: this.state.accountPermitPath,//开户许可证原件
          vatPayerPath: this.state.vatPayerPath,//纳税人资格证明
        }

        let _this = this;
        if (this.state.loading) return false;
        this.setState({
          loading: true,
        })
        if(values.approvalResult == 1 && isApp ) {
          Util.alert('请选择正确的审核结果！', { type: 'error' });
          this.setState({
            loading: false
          })
          return;
      } else {
        api.ajax('POST', '@/supplier/ecUserApprovalLog/basicAudit', {
          approvalType: 1,
          id: this.state.basicAuditInfo.id,
          companyId: this.state.basicAuditInfo.companyId,
          ...values,
          ...imgObj
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
      }
      })
    } else {
      this.props.form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        //执照有效期长期按钮选中的情况下
        if (this.state.isLicenseLong) {
          values.businessEndTime = '1';
        }
        //注册资本无按钮选中的情况
        if (this.state.isRegisteredCapital) {
          values.registeredCapital = 0;
        }
        values.basicAuditJson = JSON.stringify(this.getAuditData());
        values.status = status;
        values.approvalResult = this.props.form.getFieldValue('approvalResult');

        let imgObj = {
          legalPersonPath1: this.state.legalPersonPath1,//证件照1
          legalPersonPath2: this.state.legalPersonPath2,//证件照2
          businessLicensePath: this.state.businessLicensePath,//营业执照原件
          taxRegistrationPath: this.state.taxRegistrationPath,//税务登记证
          organizationCertificatePath: this.state.organizationCertificatePath,//组织机构代码证
          accountPermitPath: this.state.accountPermitPath,//开户许可证原件
          vatPayerPath: this.state.vatPayerPath,//纳税人资格证明
        }

        let _this = this;
        if (this.state.loading) return false;
        this.setState({
          loading: true,
        })
        if(values.approvalResult == 1 && isApp ) {
          Util.alert('请选择正确的审核结果！', { type: 'error' });
          this.setState({
            loading: false
          })
          return;
      } else {
        api.ajax('POST', '@/supplier/ecUserApprovalLog/basicAudit', {
          approvalType: 1,
          id: this.state.basicAuditInfo.id,
          companyId: this.state.basicAuditInfo.companyId,
          ...values,
          ...imgObj
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
      }
      })
    }
  }

  handleGoBack = () => {
    this.props.history.goBack()
  }

  //更换证件类型
  handleChangeCardType = (e) => {
    this.setState({
      cardType: e.target.value
    })
  }
  //根据证件类型获取页面显示
  getCardPage = (index) => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const otherFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }
    if (index == 1) {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="法人身份证:">
              <Input type="text" maxLength='18'
                {...getFieldProps('legalPersonId',
                  {
                    rules: [
                      {
                        required: true,
                        message: "请输入法人身份证件号"
                      }
                    ]
                  })}
                placeholder="请输入法人身份证件号" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonId", "isPass_legalPersonId", "phrase_legalPersonId")}
          </Col>
        </Row>,
        <Row gutter={16} key={4}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="身份证正面" filename="legalPersonPath1" imgUrl={this.state.legalPersonPath1} uploadSuccess={this.uploadSuccess} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legal_person_path1", "isPass_legal_person_path1", "phrase_legal_person_path1")}
          </Col>
        </Row>,
        <Row gutter={16} key={5}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="身份证反面" filename="legalPersonPath2" imgUrl={this.state.legalPersonPath2} uploadSuccess={this.uploadSuccess} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legal_person_path2", "isPass_legal_person_path2", "phrase_legal_person_path2")}
          </Col>
        </Row>
      ]
    } else if (index == 2) {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="法人护照证件:">
              <Input type="text" maxLength='20'
                {...getFieldProps('legalPersonId',
                  {
                    rules: [
                      {
                        required: true,
                        message: "请输入法人护照证件号"
                      }
                    ]
                  })}
                placeholder="请输入法人护照证件号" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonId", "isPass_legalPersonId", "phrase_legalPersonId")}
          </Col>
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg title="护照" filename="legalPersonPath1" imgUrl={this.state.legalPersonPath1} uploadSuccess={this.uploadSuccess} disabled={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legal_person_path1", "isPass_legal_person_path1", "phrase_legal_person_path1")}
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
      return <Row gutter={16}>
        <Col span={12}>
          <FormItem {...uploadFormItemLayout}>
            <UploadImg title="纳税人资格证明" filename="vatPayerPath" imgUrl={this.state.vatPayerPath} uploadSuccess={this.uploadSuccess} disabled={true} />
          </FormItem>
        </Col>
        <Col span={12}>
          {this.initAuditModul("vatPayerPath", "isPass_vatPayerPath", "phrase_vatPayerPath")}
        </Col>
      </Row>
    } else {
      return null
    }
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
    const formItemLayoutClear = {
      wrapperCol: { span: 22 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const otherFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }

    const isRequired = this.props.form.getFieldValue('approvalResult') == 1 ? false : true;


    return (
      <div>
        <Form>
          <Card className="mb10" title={<span><Badge count={1} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 机构及法人信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="公司名称">
                  <Input type="text" maxLength='20'
                    {...getFieldProps('name',
                      {
                        rules: [
                          {
                            required: true,
                            message: "请输入公司名称"
                          }
                        ]
                      })}
                    placeholder="请输入公司名称" />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("name", "isPass_name", "phrase_name")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="公司类型">
                  <RadioGroup
                    {...getFieldProps('factoryType')}>
                    <Radio value={1}>生产厂家</Radio>
                    <Radio value={2}>贸易集成商</Radio>
                    <Radio value={3}>个体工商户</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("factoryType", "isPass_factoryType", "phrase_factoryType")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="出口资质">
                  <RadioGroup
                    {...getFieldProps("exportQualification")}>
                    <Radio key="a" value={1}>有出口资质</Radio>
                    <Radio key="b" value={2}>无出口资质</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("exportQualification", "isPass_exportQualification", "phrase_exportQualification")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="主营类目">
                  <Select {...getFieldProps('mainBusiness',
                    {
                      rules: [
                        {
                          required: true,
                          message: "请选择主营商品"
                        }
                      ]
                    })}>
                    {Util.getOptionList(this.state.mainCommodityData, "id", "name")}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("mainBusiness", "isPass_mainBusiness", "phrase_mainBusiness")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="法人姓名">
                  <Input type="text" maxLength='50'
                    {...getFieldProps('legalPersonName',
                      {
                        rules: [
                          {
                            required: true,
                            message: "请输入法人姓名"
                          }
                        ]
                      })}
                    placeholder="请输入法人姓名" />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("legalPersonName", "isPass_legalPersonName", "phrase_legalPersonName")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="证件类型">
                  <RadioGroup
                    disabled={true}
                    {...getFieldProps('legalPersonIdType',
                      {
                        onChange: this.handleChangeCardType
                      })}>
                    <Radio value={1}>身份证</Radio>
                    <Radio value={2}>护照</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("legalPersonIdType", "isPass_legalPersonIdType", "phrase_legalPersonIdType")}
              </Col>
            </Row>
            {this.getCardPage(this.state.cardType)}
          </Card>
          <Card className="mb10" title={<span><Badge count={2} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 企业证照信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="三证合一">
                  <RadioGroup
                    disabled={true}
                    {...getFieldProps('threeInOne',
                      {
                        onChange: this.threeInOneChange
                      })}>
                    <Radio key="a" value="1">三证合一</Radio>
                    <Radio key="b" value="0">非三证合一</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("threeInOne", "isPass_threeInOne", "phrase_threeInOne")}
              </Col>
            </Row>
            <Row gutter={16} key={1}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="营业执照号">
                  <Input type="text" maxLength='20'
                    {...getFieldProps('businessLicense',
                      {
                        rules: [
                          {
                            required: true,
                            message: "请输入营业执照号"
                          }
                        ]
                      })}
                    placeholder="请输入营业执照号" />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("businessLicense", "isPass_businessLicense", "phrase_businessLicense")}
              </Col>
            </Row>
            <Row gutter={16} key="address">
              <Col span={12}>
                <FormItem {...formItemLayout} required label="机构所在地">
                  <Col span={8}>
                    <FormItem>
                      <Select {...getFieldProps("provinceCode", {
                        onChange: (value) => (this.getCityList(value))
                      })}>
                        {Util.getOptionList(this.state.provinceList, "provinceCode", "provinceName")}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Select {...getFieldProps("cityCode", {
                        onChange: (value) => (this.getAreaList(value))
                      })}>
                        {Util.getOptionList(this.state.cityList, "cityCode", "cityName")}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Select {...getFieldProps("areaCode", {
                        rules: [
                          { required: true, message: '请选择地区' },
                        ]
                      })}>
                        {Util.getOptionList(this.state.areaList, "areaCode", "areaName")}
                      </Select>
                    </FormItem>
                  </Col>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("area", "isPass_area", "phrase_area")}
              </Col>
            </Row>
            <Row gutter={16} key="address2">
              <Col span={12}>
                <FormItem {...formItemLayout} label="公司详细地址:">
                  <Input type="text" maxLength='50'
                    {...getFieldProps('address',
                      {
                        rules: [
                          {
                            required: true,
                            message: "请输入公司详细地址"
                          }
                        ]
                      })}
                    placeholder="请输入公司详细地址" />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("address", "isPass_address", "phrase_address")}
              </Col>
            </Row>
            <Row gutter={16} key={2}>
              <Col span={12}>
                <FormItem {...otherFormItemLayout} label="执照有效期">
                  <Col span={18}>
                    <Col span={12}>
                      <FormItem>
                        <DatePicker
                          disabledDate={this.disabledStartDate}
                          toggleOpen={this.handleStartToggle}
                          {...getFieldProps('businessStartTime',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择执照有效期开始时间'
                                }
                              ],
                              onChange: this.onStartChange,
                              initialValue: this.state.startValue,
                            })} />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem>
                        <DatePicker
                          disabledDate={this.disabledEndDate}
                          open={this.state.endOpen}
                          toggleOpen={this.handleEndToggle}
                          disabled={this.state.isLicenseLong}
                          {...getFieldProps('businessEndTime',
                            {
                              rules: [
                                {
                                  required: !this.state.isLicenseLong,
                                  message: '请选择执照有效期结束时间'
                                }
                              ],
                              onChange: this.onEndChange,
                              initialValue: this.state.endValue
                            })} />
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={6}>
                    <FormItem>
                      <Checkbox
                        onChange={this.isLicenseLongChange}
                        checked={this.state.isLicenseLong}
                        style={{ marginLeft: "10px" }}>长期</Checkbox>
                    </FormItem>
                  </Col>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("businessStartTime", "isPass_businessStartTime", "phrase_businessStartTime")}
              </Col>
            </Row>
            <Row gutter={16} key={5}>
              <Col span={12}>
                <FormItem {...otherFormItemLayout} label="注册资本:">
                  <Col span={17}>
                    <FormItem>
                      <Input type="text" maxLength='15' style={{ marginRight: '10px' }}
                        disabled={this.state.isRegisteredCapital}
                        {...getFieldProps('registeredCapital',
                          {
                            rules: [
                              {
                                required: !this.state.isRegisteredCapital,
                                message: "请输入注册资本"
                              },
                              { pattern: /^(\d{1,10}|\d{1,7}\.\d{1,3})$/, message: '请输入10位以内的金额' },
                            ]
                          })}
                        placeholder="请输入注册资本" addonAfter="万" />
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem>
                      <Checkbox style={{ marginLeft: '10px' }}
                        onChange={this.isRegisteredCapitalChange}
                        checked={this.state.isRegisteredCapital}>无</Checkbox>
                    </FormItem>
                  </Col>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("registeredCapital", "isPass_registeredCapital", "phrase_registeredCapital")}
              </Col>
            </Row>
            <Row gutter={16} key={6}>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg title="营业执照原件" filename="businessLicensePath" imgUrl={this.state.businessLicensePath} uploadSuccess={this.uploadSuccess} disabled={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("businessLicensePath", "isPass_businessLicensePath", "phrase_businessLicensePath")}
              </Col>
            </Row>
            {this.threeEvidenceContent(this.state.threeInOne)}
          </Card>
          <Card className="mb10" title={<span><Badge count={3} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 财务及税务信息</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="发票类型">
                  <RadioGroup
                    disabled={true}
                    {...getFieldProps('taxType')}>
                    <Radio key="a" value={1}>增值税专项发票</Radio>
                    <Radio key="b" value={2}>增值税普通发票</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("taxType", "isPass_taxType", "phrase_taxType")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="税率">
                  <Select
                    {...getFieldProps('taxPoint')}>
                    <Option value="" key=''>请选择税率</Option>
                    <Option value="0.03" key="3">3%</Option>
                    <Option value="0.06" key="6">6%</Option>
                    <Option value="0.09" key="9">9%</Option>
                    <Option value="0.16" key="16">16%</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("taxPoint", "isPass_taxPoint", "phrase_taxPoint")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="开户许可证编号:">
                  <Input type="text" maxLength='20'
                    {...getFieldProps('accountPermitNumber',
                      {
                        rules: [
                          {
                            required: true,
                            message: "请输入开户许可证"
                          }
                        ]
                      })}
                    placeholder="请输入开户许可证" />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("accountPermitNumber", "isPass_accountPermitNumber", "phrase_accountPermitNumber")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="机构基本账号">
                  <Input type="text" maxLength='20'
                    {...getFieldProps('companyBaseAccount',
                      {
                        rules: [
                          {
                            required: true,
                            message: "请输入机构基本账号"
                          }
                        ]
                      })}
                    placeholder="请输入机构基本账号" />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("companyBaseAccount", "isPass_companyBaseAccount", "phrase_companyBaseAccount")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="开户银行">
                  <Input type="text" maxLength='20'
                    {...getFieldProps('institutionalBank',
                      {
                        rules: [
                          {
                            required: true,
                            message: "请输入开户银行"
                          }
                        ]
                      })}
                    placeholder="请输入开户银行" />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("institutionalBank", "isPass_institutionalBank", "phrase_institutionalBank")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg title="开户许可证原件" filename="accountPermitPath" imgUrl={this.state.accountPermitPath} uploadSuccess={this.uploadSuccess} disabled={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                {this.initAuditModul("accountPermitPath", "isPass_accountPermitPath", "phrase_accountPermitPath")}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="纳税人资格属性">
                  <RadioGroup
                    {...getFieldProps('taxpayerAttribute')}>
                    <Radio key="a" value={1}>一般纳税人</Radio>
                    <Radio key="b" value={2}>小规模纳税人</Radio>
                  </RadioGroup>
                </FormItem>
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
                {this.initAuditModul("clarification", "isPass_clarification", "phrase_clarification")}
              </Col>
            </Row>
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
          <Card title={<span><Badge count={this.state.backMsg ? 7 : 6} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 审核意见</span>} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="审核结果">
                  <RadioGroup
                    disabled={true}
                    {...getFieldProps('approvalResult',
                      {
                        initialValue: 1,
                        rules: [
                          {
                            required: true,
                            message: "请选择审核结果"
                          }
                        ],
                        onChange: () => {
                          this.props.form.resetFields(['remark'])
                        }
                      })}>
                    <Radio key="a" value={1}>审核通过</Radio>
                    <Radio key="b" value={0}>驳回</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} required={isRequired} label="审核意见">
                  <Input type="textarea" maxLength='400' rows={5}
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
              </Col>
            </Row>
          </Card>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
              onClick={this.handleGoBack}>返回</Button>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
              onClick={() => (this.handleSubmit(0))}>保存</Button>
            <Button type="primary"
              loading={this.state.loading}
              onClick={() => (this.handleSubmit(1))}>提交</Button>
          </BaseAffix>
        </Form>
      </div>
    )
  }
}
export default Form.create()(queryBackLogByNameBasic);