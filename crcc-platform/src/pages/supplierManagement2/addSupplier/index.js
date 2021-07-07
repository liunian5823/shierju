import { Card, Form, Button, Select, Radio, Icon, Row, Col, DatePicker, Checkbox, Table, Upload } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class addSupplier extends React.Component {
  state = {
    loading: false,
    Clarification: [],//说明材料
    mainCommodityData: [],
    cardType: 1, //证件类型
    threeInOne: "1", //三证合一
    isLicenseLong: false, // 执照有效期长期标识
    isRegisteredCapital: false, // 注册资本无标识
    startValue: null,
    endValue: null,
    endOpen: false,
    provinceList: [],//省数据
    cityList: [],//省下对应市数据
    areaList: [],//市下对应县数据
    legalPersonPath1: '',//证件照1
    legalPersonPath2: '',//证件照2
    businessLicensePath: '',//营业执照原件
    taxRegistrationPath: '',//税务登记证
    organizationCertificatePath: '',//组织机构代码证
    accountPermitPath: '',//开户许可证原件
    vatPayerPath: '',//纳税人资格证明
    urlName: '',
    fileList: [],//说明材料
    clarificationDocumentHistory: []//澄清文件历史
  }
  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
    //获取省/市/县
    this.getProvinceList();
    //主营商品
    this.getMainCommodityData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  // 获取省数据
  getProvinceList = () => {
    let _this = this;
    api.ajax("GET", "@/base/ecProvince/selectAll").then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        provinceList: r.data.rows,
      })
    }).catch(r => { })
  }
  // 获取市数据
  getCityList = (provinceCode) => {
    this.props.form.resetFields(['cityCode', 'areaCode']);
    let _this = this;
    api.ajax("GET", "@/base/ecCity/selectProvinceCode", {
      provinceCode: provinceCode
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        cityList: r.data.rows,
        areaList: []
      })
    })
  }
  // 获取县数据
  getAreaList = (cityCode) => {
    this.props.form.resetFields(['areaCode']);
    let _this = this;
    api.ajax("GET", "@/base/ecArea/selectCityCode", {
      cityCode: cityCode
    }).then(r => {
      if (!_this._isMounted) {
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

  // 图片文件上传成功
  uploadSuccess = (value, key) => {
    this.props.form.setFieldsValue({ [key]: value })
    this.setState({
      [key]: value
    })
  }
  // 澄清文件上传前禁止提交
  beforeUpload = (file) => {
    const isZip = file.type === 'application/zip';
    const isZipW = file.type === 'application/x-zip-compressed';
    const isRar = file.type === 'application/x-rar-compressed';
    if (!isZip && !isZipW && !isRar && !(file.type == '')) {
      Util.alert('请上传zip/rar格式的文件', { type: "error" })
      return false;
    }
    if (file.size > (1048 * 1048 * 20)) {
      Util.alert('上传的文件不能大于20M，请压缩后上传', { type: "error" })
      return false;
    }

    // 澄清文件上传中禁止提交
    this.setState({
      _loading: true
    })
    return true;
  }

  //上传文件成功
  uploadProps = (info) => {
    let fileList = info.fileList;
    if (info.file.status === 'done') {
      // 澄清文件上传中禁止提交
      this.setState({
        _loading: false
      })
      let isSuccess = true;
      if (isSuccess) {
        fileList = fileList.slice(-1);
      } else {
        fileList = fileList.slice(0, fileList.length - 1);
      }
      this.setState({
        urlName: info.file.name
      })
    } else if (info.file.status === 'error') {
      Util.alert('上传失败', { type: "error" })
      this.setState({
        _loading: false
      })
    }
    this.setState({
      fileList: fileList
    })
    this.props.form.setFieldsValue({ clarificationDocumentPath: fileList })
  }

  // 执照有效期--长期按钮事件
  isLicenseLongChange = (e) => {
    this.props.form.resetFields(["businessEndTime"]);
    this.setState({
      isLicenseLong: e.target.checked
    })
  }

  // 注册资本--无按钮事件
  isRegisteredCapitalChange = (e) => {
    this.props.form.resetFields(["registeredCapital"]);
    this.setState({
      isRegisteredCapital: e.target.checked
    })
  }

  //开始时间和结束时间的关联
  disabledStartDate = (startValue) => {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  }
  disabledEndDate = (endValue) => {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.getTime() <= this.state.startValue.getTime();
  }
  onChange = (field, value) => {
    console.log(field, 'change', value);
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

  // 三证合一选项事件
  threeInOneChange = (e) => {
    let index = e.target.value;
    this.props.form.resetFields(['organizationCertificatePath', 'taxRegistrationPath'])
    this.setState({
      threeInOne: index,
      organizationCertificatePath: '',
      taxRegistrationPath: ''
    })
  }

  threeEvidenceContent = (index) => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 18, offset: 6 }
    }
    const otherFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }
    if (index == "0") {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="营业执照号">
              <Input type="text" maxLength='30'
                {...getFieldProps('businessLicense',
                  {
                    rules: [
                      { required: true, message: '请填写营业执照号' },
                    ]
                  })
                } placeholder="请输入营业执照号" />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <FormItem {...otherFormItemLayout} label="执照有效期">
              <Col span={24}>
                <Col span={12}>
                  <FormItem>
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      toggleOpen={this.handleStartToggle}
                      {...getFieldProps('businessStartTime',
                        {
                          rules: [
                            {
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
                              //required: !this.state.isLicenseLong,
                              message: '请选择执照有效期结束时间'
                            }
                          ],
                          onChange: this.onEndChange,
                          initialValue: this.state.endValue
                        })} />
                  </FormItem>
                </Col>
              </Col>
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              <Checkbox
                onChange={this.isLicenseLongChange}
                style={{ marginLeft: "10px" }}>长期</Checkbox>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={3}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="税务登记证:">
              <Input type="text" maxLength='30'
                {...getFieldProps('taxRegistrationNumber',
                  {
                    rules: [
                      { message: '请填写税务登记证' },
                    ]
                  })
                } placeholder="请输入税务登记证" />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="组织机构代码证:">
              <Input type="text" maxLength='30'
                {...getFieldProps('organizationCertificateCode',
                  {
                    rules: [
                      { message: '请填写组织机构代码证' },
                      { pattern: /^[a-zA-Z\d]{8}\-[a-zA-Z\d]$/, message: '请正确输入组织机构代码' },
                    ]
                  })
                } placeholder="请输入组织机构代码证" />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={4}>
          <Col span={12}>
            <FormItem {...otherFormItemLayout} label="注册资本:">
              <Input type="text" maxLength='10' style={{ marginRight: '10px' }} disabled={this.state.isRegisteredCapital}
                {...getFieldProps('registeredCapital',
                  {
                    rules: [
                      //{ required: !this.state.isRegisteredCapital, message: '请填写注册资本' },
                      { pattern: /^(\d{1,10}|\d{1,7}\.\d{1,3})$/, message: '请输入10位以内的金额' },
                    ]
                  }
                )} placeholder="请输入注册资本" addonAfter="万" />
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              <Checkbox
                onChange={this.isRegisteredCapitalChange}
                style={{ marginLeft: '10px' }}>无</Checkbox>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={5}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg
                title="营业执照原件"
                filename="businessLicensePath"
                imgUrl={this.state.businessLicensePath}
                uploadSuccess={this.uploadSuccess}
                {...getFieldProps('businessLicensePath', {
                  rules: [
                    { message: '请上传营业执照' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={6}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg
                title="税务登记证"
                filename="taxRegistrationPath"
                imgUrl={this.state.taxRegistrationPath}
                uploadSuccess={this.uploadSuccess}
                {...getFieldProps('taxRegistrationPath', {
                  rules: [
                    { message: '请上传税务登记证' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={7}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg
                title="组织机构代码证"
                filename="organizationCertificatePath"
                imgUrl={this.state.organizationCertificatePath}
                uploadSuccess={this.uploadSuccess}
                {...getFieldProps('organizationCertificatePath', {
                  rules: [
                    { message: '请上传组织机构代码证' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>,
      ]
    } else {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="营业执照号">
              <Input type="text" maxLength='30'
                {...getFieldProps('businessLicense',
                  {
                    rules: [
                      { required: true, message: '请填写营业执照号' },
                    ]
                  })
                } placeholder="请输入营业执照号" />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={2}>
          <Col span={12}>
            <FormItem {...otherFormItemLayout} label="执照有效期">
              <Col span={24}>
                <Col span={12}>
                  <FormItem>
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      toggleOpen={this.handleStartToggle}
                      {...getFieldProps('businessStartTime',
                        {
                          rules: [
                            {
                              required: false,
                              message: '请选择执照有效期开始时间'
                            }
                          ],
                          onChange: this.onStartChange,
                          initialValue: this.state.startValue
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
                              //required: !this.state.isLicenseLong,
                              required: false,
                              message: '请选择执照有效期结束时间'
                            }
                          ],
                          onChange: this.onEndChange,
                          initialValue: this.state.endValue
                        })} />
                  </FormItem>
                </Col>
              </Col>
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              <Checkbox
                onChange={this.isLicenseLongChange}
                style={{ marginLeft: "10px" }}>长期</Checkbox>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={4}>
          <Col span={12}>
            <FormItem {...otherFormItemLayout} label="注册资本:">
              <Input type="text" maxLength='10' style={{ marginRight: '10px' }} disabled={this.state.isRegisteredCapital}
                {...getFieldProps('registeredCapital',
                  {
                    rules: [
                      //{ required: !this.state.isRegisteredCapital, message: '请填写注册资本' },
                      { pattern: /^(\d{1,10}|\d{1,7}\.\d{1,3})$/, message: '请输入10位以内的金额' },
                    ]
                  }
                )} placeholder="请输入注册资本" addonAfter="万" />
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              <Checkbox
                onChange={this.isRegisteredCapitalChange}
                style={{ marginLeft: '10px' }}>无</Checkbox>
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={5}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg
                title="营业执照原件"
                filename="businessLicensePath"
                imgUrl={this.state.businessLicensePath}
                uploadSuccess={this.uploadSuccess}
                {...getFieldProps('businessLicensePath', {
                  rules: [
                    { message: '请上传营业执照' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>
      ]
    }
  }

  //检查营业执照号
  checkCompanybusinessLicense = (values) => {
    api.ajax('GET', '@/supplier/ecCompanySupplier/checkCompanybusinessLicense', { businessLicense: values.businessLicense }).then(r => {
      if (!this._isMounted) {
        //如果没有被挂载 终止ajax
        return;
      }
      this.realSumbit(values);
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' })
      this.setState({
        _loading: false,
      })
    })
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
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
      this.checkCompanybusinessLicense(values);
    })
  }

  //确认提交
  realSumbit = (values) => {
    //执照有效期长期按钮选中的情况下
    if (this.state.isLicenseLong) {
      values.businessEndTime = "1";
    }
    //注册资本无按钮选中的情况
    if (this.state.isRegisteredCapital) {
      values.registeredCapital = "0";
    }

    let imgObj = {
      legalPersonPath1: this.state.legalPersonPath1,//证件照1
      legalPersonPath2: this.state.legalPersonPath2,//证件照2
      businessLicensePath: this.state.businessLicensePath,//营业执照原件
      taxRegistrationPath: this.state.taxRegistrationPath,//税务登记证
      organizationCertificatePath: this.state.organizationCertificatePath,//组织机构代码证
      accountPermitPath: this.state.accountPermitPath,//开户许可证原件
      vatPayerPath: this.state.vatPayerPath,//纳税人资格证明
      urlName: this.state.urlName,//上传的说明文件的名字
    }

    //说明材料
    //处理澄清文件
    const clarificationDocumentPath = (values.clarificationDocumentPath && values.clarificationDocumentPath.fileList && values.clarificationDocumentPath.fileList.length > 0 && values.clarificationDocumentPath.fileList[0].response && values.clarificationDocumentPath.fileList[0].response.data) ? values.clarificationDocumentPath.fileList[0].response.data : '';
    values.clarificationDocumentPath = clarificationDocumentPath

    let _this = this;
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax("POST", "@/supplier/ecCompanySupplier/platformSave", {
      type: 1,
      source: 3,
      ...values,
      ...imgObj
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
      this.props.history.goBack();
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.setState({
        loading: false
      })
    })
  }

  //更换证件类型
  handleChangeCardType = (e) => {
    this.props.form.resetFields(['legalPersonId', 'legalPersonPath1', 'legalPersonPath2'])
    this.setState({
      cardType: e.target.value,
      legalPersonPath1: '',
      legalPersonPath2: ''
    })
  }
  //根据证件类型获取页面显示
  getCardPage = (index) => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 18, offset: 6 }
    }
    if (index == 1) {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="法人身份证号码:">
              <Input type="text" maxLength='18'
                {...getFieldProps('legalPersonId',
                  {
                    rules: [
                      {
                        message: "请输入法人身份证号码"
                      },
                      {
                        pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                        message: '请输入正确的身份证号码'
                      },
                    ]
                  })}
                placeholder="请输入法人身份证件号" />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={121}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg
                title="身份证正面"
                filename="legalPersonPath1"
                imgUrl={this.state.legalPersonPath1}
                uploadSuccess={this.uploadSuccess}
                {...getFieldProps('legalPersonPath1', {
                  rules: [
                    { message: '请上传身份证正面' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={122}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg
                title="身份证反面"
                filename="legalPersonPath2"
                imgUrl={this.state.legalPersonPath2}
                uploadSuccess={this.uploadSuccess}
                {...getFieldProps('legalPersonPath2', {
                  rules: [
                    { message: '请上传身份证反面' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>
      ]
    } else {
      return [
        <Row gutter={16} key={1}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="法人护照证件号:">
              <Input type="text" maxLength='30'
                {...getFieldProps('legalPersonId',
                  {
                    rules: [
                      {
                        message: "请输入法人护照证件号"
                      },
                      {
                        pattern: /^((1[45]\d{7})|(G\d{8})|(P\d{7})|(S\d{7,8}))?$/,
                        message: '请输入正确的护照号'
                      }
                    ]
                  })}
                placeholder="请输入法人护照证件号" />
            </FormItem>
          </Col>
        </Row>,
        <Row gutter={16} key={121}>
          <Col span={12}>
            <FormItem {...uploadFormItemLayout}>
              <UploadImg
                title="护照照片"
                filename="legalPersonPath1"
                imgUrl={this.state.legalPersonPath1}
                uploadSuccess={this.uploadSuccess}
                {...getFieldProps('legalPersonPath2', {
                  rules: [
                    { message: '请上传护照照片' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>
      ]
    }
  }

  //公司名称重复验证
  handleNameFocusBlur = (e) => {
    let _this = this;
    api.ajax("GET", "@/supplier/ecCompanySupplier/checkCompanyName", {
      companyName: e.target.value
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      if (r.code != "200") {
        Util.alert("公司名称重复", { type: 'error' });
        this.props.form.resetFields(["name"]);
      }
    })
  }
  //手机号是否注册
  handlePhoneFocusBlur = (e) => {
    let _this = this;
    api.ajax("GET", "@/sso/ecUser/checkPhoneRepreat", {
      phone: e.target.value
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      if (r.data) {
        Util.alert("手机号已经被注册", { type: 'error' });
        this.props.form.resetFields(["phone"]);
      }
    })
  }

  handleCancel = () => {
    this.props.history.goBack();
  }

  //违禁词校验
  contrabandVerification = () => {
    const reg = /[\u4e00-\u9fa5]+/
    let sendData = []
    for (let key in values) {
      if (reg.test(values[key])) {
        sendData.push({ [key]: values[key] });
      }
    }
    api.ajax('GET', '@/base/ecForbiddenWords/checkByforbiddenWords', { o: JSON.stringify(sendData) }).then(r => {
      if (!this._isMounted) {
        //如果没有被挂载 终止ajax
        return;
      }
      for (let key in r.data) {
        if (!r.data[key]) {
          this.props.form.setFields({
            [key]: {
              value: values[key],
              errors: [new Error('该项输入，请重新输入')],
            }
          })
          this.setState({
            _loading: false
          })
          return;
        }
      }
    })
  }

  //2、选择普票时  不需要上传
  changeTaxType = () => {
    const { getFieldProps } = this.props.form;

    const formColLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }
    const wrapperColLayout = {
      wrapperCol: { span: 18, offset: 6 }
    }

    const taxType = this.props.form.getFieldValue('taxType');

    let tooltip = <p>
      1)增值税一般纳税人资格登记表
    <br />
      2)增值税一般纳税人认定通知书
    <br />
      3)营业执照或税务登记证上有"增值税一般纳税人"鲜章
    <br />
      4)国税网络查询企业税务登记及一般纳税人资格信息截屏
    <br />
      5)提供一份近期对外开具增值税专用发票的扫描件且该专票没有"代开"字样
    </p>

    if (taxType == 1) {
      return [
        <Row key="taxType">
          <Col {...formColLayout}>
            <FormItem
              {...wrapperColLayout}
            >
              <UploadImg title="纳税人资格证明" filename="vatPayerPath" tooltip={tooltip} imgUrl={this.state.vatPayerPath} uploadSuccess={this.uploadSuccess}
                {...getFieldProps('vatPayerPath', {
                  rules: [
                    { message: '请上传纳税人资格证明' }
                  ],
                })} />
            </FormItem>
          </Col>
        </Row>
      ]
    } else {
      return null
    }
  }

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 18, offset: 6 }
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="公司名称:">
                  <Input type="text" maxLength='30'
                    onBlur={this.handleNameFocusBlur}
                    {...getFieldProps('name',
                      {
                        rules: [
                          { required: true, min: 5, message: '请输入至少5个字的公司名称' },
                        ]
                      })
                    }
                    placeholder="请输入公司名称" />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="真实姓名:">
                  <Input type="text" maxLength='20'
                    {...getFieldProps('userName',
                      {
                        rules: [
                          {  required: true,message: '请输入真实姓名' },
                        ]
                      })
                    }
                    placeholder="请输入真实姓名" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="手机号:">
                  <Input type="text" maxLength='11'
                    onBlur={this.handlePhoneFocusBlur}
                    {...getFieldProps('phone',
                      {
                        rules: [
                          { required: true, message: '请输入手机号' },
                          { pattern: /^[1][0-9]{10}$/, message: '请输入正确的手机号' },
                        ],
                      })} placeholder="请输入手机号" />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label='邮箱'>
                  <Input type="text" maxLength={50}
                    {...getFieldProps('email',
                      {
                        rules: [
                          { required: true, message: "请输入邮箱" },
                          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入格式正确的邮箱' },
                        ]
                      })} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="密码:">
                  <Input type="password" maxLength='30'
                    {...getFieldProps('password',
                      {
                        rules: [
                          { required: true, message: '请输入新密码' },
                          { pattern: /^(?!^(\d+|[a-zA-Z]+|[_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+)$)^[\w_`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]{8,32}$/, message: '密码中包含数字和大小写字母，至少8位' },
                        ]
                      })
                    } placeholder="请输入密码" />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="机构及法人信息" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="机构所在地:">
                  <Row gutter={16}>
                    <Col span={8}>
                      <FormItem>
                        <Select {...getFieldProps("provinceCode",
                          {
                            rules: [
                              {
                                message: "请选择省"
                              }
                            ],
                            onChange: (value) => (this.getCityList(value))
                          })}>
                          {Util.getOptionList(this.state.provinceList, "provinceCode", "provinceName")}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem>
                        <Select {...getFieldProps("cityCode",
                          {
                            rules: [
                              {
                                message: "请选择市"
                              }
                            ],
                            onChange: (value) => (this.getAreaList(value))
                          })}>
                          {Util.getOptionList(this.state.cityList, "cityCode", "cityName")}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem>
                        <Select {...getFieldProps("areaCode",
                          {
                            rules: [
                              {
                                message: "请选择县"
                              }
                            ]
                          })}>
                          {Util.getOptionList(this.state.areaList, "areaCode", "areaName")}
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="公司详细地址:">
                  <Input type="text" maxLength='60'
                    {...getFieldProps('address',
                      {
                        rules: [
                          { message: '请填写公司详细地址' },
                        ]
                      })
                    } placeholder="请输入公司详细地址" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="公司类型:">
                  <RadioGroup
                    {...getFieldProps('factoryType',
                      {
                        initialValue: 1,
                      })}>
                    <Radio value={1}>生产厂家</Radio>
                    <Radio value={2}>贸易集成商</Radio>
                    <Radio value={3}>个体工商户</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="出口资质:">
                  <RadioGroup
                    {...getFieldProps('exportQualification',
                      {
                        initialValue: 1,
                      })}>
                    <Radio key="a" value={1}>有出口资质</Radio>
                    <Radio key="b" value={2}>无出口资质</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="主营商品:">
                  <Select {...getFieldProps('mainBusiness',
                    {
                      rules: [
                        {
                          message: "请选择主营商品"
                        }
                      ]
                    })}>
                    {Util.getOptionList(this.state.mainCommodityData, "id", "name")}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="法人姓名:">
                  <Input type="text" maxLength='20'
                    {...getFieldProps('legalPersonName',
                      {
                        rules: [
                          { message: '请填写法人姓名' },
                        ]
                      })
                    } placeholder="请输入法人姓名" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="证件类型:">
                  <RadioGroup
                    {...getFieldProps('legalPersonIdType',
                      {
                        onChange: this.handleChangeCardType,
                        initialValue: this.state.cardType,
                        rules: [
                          //{ message: '请选择证件类型' },
                        ]
                      })}>
                    <Radio value={1}>身份证</Radio>
                    <Radio value={2}>护照</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            {this.getCardPage(this.state.cardType)}
          </Card>
          <Card title="企业证照信息" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="三证合一">
                  <RadioGroup
                    {...getFieldProps('threeInOne',
                      {
                        onChange: this.threeInOneChange,
                        initialValue: this.state.threeInOne
                      })}>
                    <Radio value="1">三证合一</Radio>
                    <Radio value="0">非三证合一</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>

            {this.threeEvidenceContent(this.state.threeInOne)}

          </Card>
          <Card title="企业税务及财务状况" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="发票类型:">
                  <RadioGroup
                    {...getFieldProps('taxType',
                      {
                        initialValue: 1,
                      })}>
                    <Radio value={1}>增值税专项发票</Radio>
                    <Radio value={2}>增值税普通发票</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="税率">
                  <Select {...getFieldProps("taxPoint",
                    {
                      rules: [
                        {
                          message: "请选择税率"
                        }
                      ]
                    })}>
                    <Option value="0.03">3%</Option>
                    <Option value="0.06">6%</Option>
                    <Option value="0.09">9%</Option>
                    <Option value="0.16">16%</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="开户许可证编号">
                  <Input type="text" maxLength='30' {...getFieldProps('accountPermitNumber',
                    {
                      rules: [
                        {
                          message: "请输入开户许可证编号"
                        }
                      ]
                    })} placeholder="请输入开户许可证编号" />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="机构基本账号">
                  <Input type="text" maxLength='30'
                    {...getFieldProps('companyBaseAccount',
                      {
                        rules: [
                          { message: '请输入机构基本账号' },
                        ]
                      })
                    } placeholder="请输入机构基本账号" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="开户银行">
                  <Input type="text" maxLength='30'
                    {...getFieldProps('institutionalBank',
                      {
                        rules: [
                          { message: '请输入开户银行' },
                        ]
                      })
                    } placeholder="请输入开户银行" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...uploadFormItemLayout}>
                  <UploadImg
                    title="开户许可证原件"
                    filename="accountPermitPath"
                    imgUrl={this.state.accountPermitPath}
                    uploadSuccess={this.uploadSuccess}
                    {...getFieldProps('accountPermitPath', {
                      rules: [
                        { message: '请上传开户许可证' }
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="纳税人资格属性">
                  <RadioGroup
                    {...getFieldProps('taxpayerAttribute',
                      {
                        initialValue: 1,
                      })}>
                    <Radio value={1}>一般纳税人</Radio>
                    <Radio value={2}>小规模纳税人</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                {this.changeTaxType()}
              </Col>
            </Row>
          </Card>
          <Card title="说明材料" bordered={false}>
            <FormItem
              {...formItemLayout}
              label="说明材料"
            >
              <Upload
                key={'up'}
                name="file"
                action={SystemConfig.configs.uploadUrl + '/uploadFile'}
                fileList={this.state.fileList}
                beforeUpload={this.beforeUpload}
                {...getFieldProps('clarificationDocumentPath', {
                  onChange: (info) => {
                    this.uploadProps(info)
                  }
                })}
              >
                <Button type="ghost" key={1}> <Icon type="upload" /> 点击上传</Button>
                <span style={{ marginLeft: 5 }} key={2}>仅支持上传压缩包rar、zip格式</span>
              </Upload>
            </FormItem>
          </Card>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading} onClick={this.handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={this.state.loading}>递交资料</Button>
          </BaseAffix>
        </Form>
      </div>
    )
  }
}
export default Form.create()(addSupplier)