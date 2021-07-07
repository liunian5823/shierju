import { Row, Col, Form, Select, Modal, Input, Tooltip, Tag, Radio, Checkbox, DatePicker, Button, Steps, Icon, Upload, Alert, Table } from 'antd';

import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import UploadImg from '@/components/uploadImg';
import less from './index.less'
import baseReg from '@/utils/baseReg';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const Step = Steps.Step;
const confirm = Modal.confirm;
const FormItem = Form.Item;

class MySuppliers extends React.Component {
  //非显示数据
  taxTypeError = false;

  state = {
    taxpayersEligibleProperties: 1,
    invoiceTypeData: [{value: '1', label: '增值税专用发票'},{value: '2', label: '增值税普通发票'}],//发票类型
    _loading: false,
    fileList: []
  }

  //当前校验的数组
  _fieldsList = ['companyName', 'enterpriseType', 'invoiceType', 'exportSupplies', 'brand', 'accountEcUploadUuids', 'generalTaxpayersEcUploadUuids', 'professionalFieldIds', 'ecGoodsClassUuid', 'authorizationEcUploadUuids', 'formItemLayout','adminCardPathTwo','bankAccount', 'adminName','phoneNo','adminEmail','cardNo','adminCardPathOne']
  _fieldsList1 = ['companyName', 'enterpriseType', 'invoiceType', 'exportSupplies', 'brand', 'accountEcUploadUuids', 'professionalFieldIds', 'ecGoodsClassUuid', 'authorizationEcUploadUuids', 'formItemLayout','adminCardPathTwo','bankAccount', 'adminName','phoneNo','adminEmail','cardNo','adminCardPathOne']

  componentWillMount() {
    this.props.form.setFieldsValue({invoiceType: '1,2'});
  }

  // 澄清文件上传前禁止提交
  beforeUpload = (file) => {
    var str = file.name;
    str.lastIndexOf('.pdf')
    if(str.slice(str.lastIndexOf('.pdf')) == '.pdf' || str.slice(str.lastIndexOf('.PDF')) == '.PDF') {
      if (file.size > (1048 * 1048 * 20)) {
        Util.alert('上传的文件不能大于20M，请压缩后上传', {
            type: 'error'
        });
        return false;
      }
      // 澄清文件上传中禁止提交
      this.setState({
          _loading: true
      });
      return true;
    } else {
      Util.alert('请上传pdf格式的文件！', {
        type: 'error'
      });
      return false;
    }
  }

  //上传文件成功
  uploadProps = (info) => {
    let fileList = info.fileList;
    if (info.file.status === 'done') {
      let isSuccess = true;
      if (isSuccess) {
        fileList = fileList.slice(-1);
      } else {
        fileList = fileList.slice(0, fileList.length - 1);
      }
      this.setState({
        _loading: false
      })
    } else if (info.file.status === 'error') {
      Util.alert('上传失败', { type: "error" });
      this.setState({
        _loading: false
      })
    }
    this.setState({
      fileList: fileList,
      _loading: false
    })
    this.props.form.setFieldsValue({ confirmFilePath: fileList })
  }

  //处理提交校验过滤form中不存在的元素
  filtterKey = (arr, obj) => {
    let validArr = []
    arr.map((item, index) => {
      if (obj.hasOwnProperty(item)) {
        validArr.push(item)
      }
    })
    return [...validArr];
  }

  handelSubmit = () => {
    let { taxpayersEligibleProperties } = this.state;
    let validList = this._fieldsList;//获得当前步骤字段
    if (taxpayersEligibleProperties == 2) {
      validList = this._fieldsList1; // 获得当前校验字段
    }
    validList = this.filtterKey(validList, this.props.form.getFieldsValue());
    this.props.form.validateFieldsAndScroll(validList, (errors, values) => {
      if (!!errors) {
        return;
      } else {
        this.setState({
          _loading: false
        })
        let values = this.deepClone(this.props.form.getFieldsValue());
        this.submit(values);
      }
    })
  }
  
  // 提交资料
  submit = (values) => {
    let clariPath = values.clarificationPath;
    let fileRightList = values.authorizationEcUploadUuids;
    if (clariPath) {
      if (clariPath.fileList && clariPath.fileList[0]) {
        // 澄清文件
        values.clarificationPath = clariPath.fileList[0].response ? clariPath.fileList[0].response.data : '';
      } else {
        values.clarificationPath = this.state.clarificationEcUploadUuids;
      }
    }
    if (fileRightList) {
      // 授权书
      if (fileRightList.fileList && fileRightList.fileList[0]) {
        values.authorizationEcUploadUuids = fileRightList.fileList[0].response ? fileRightList.fileList[0].response.data : '';
      } else {
        values.authorizationEcUploadUuids = this.state.legalAuthorizationUuids;
      }
    }
    values.authorizationEcUploadUuids = values.authorizationEcUploadUuids ? values.authorizationEcUploadUuids : this.state.legalAuthorizationUuids;
    values.clarificationPath = values.clarificationPath ? values.clarificationPath : this.state.clarificationEcUploadUuids;
    values.cardType = 0;
    values.regType = 1;
    values.invoiceType = typeof values.invoiceType == 'string' ? this.handleTaxType(values.invoiceType)
                        : values.invoiceType && values.invoiceType.constructor === Array ?
                        this.handleTaxType(values.invoiceType.join(',')) : this.state.invoiceTypeStr;
    if(values.invoiceType == ","){
      values.invoiceType = "";
    }
    let submitObj = {
      ...values,
      ...this._companyInfo
    }
    
    submitObj.professionalFieldIds = Array.isArray(submitObj.professionalFieldIds) ? submitObj.professionalFieldIds.join() : submitObj.professionalFieldIds;
    submitObj.ecGoodsClassUuid = Array.isArray(submitObj.ecGoodsClassUuid) ? submitObj.ecGoodsClassUuid.join() : submitObj.ecGoodsClassUuid;
    submitObj.legalAuthorizationName = this.state.legalAuthorizationName;
    submitObj.clarificationName = this.state.clarificationName;
    submitObj.companyId = this.props.accountInfo.companyId;
    submitObj.socialCreditCode = this.props.accountInfo.businessLicense;
    submitObj.companyName = this.props.accountInfo.name;
    submitObj.spUuids = 7;
    submitObj.regType = 2;
    api.ajax('POST', '@/sub/subPlatformApplication/save', submitObj).then(r => {
      Util.alert(r.msg, { type: 'success' });
      this.props.onOk();
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.setState({
        _loading: false
      })
    })
  }

  handleTaxType(str) {
    let newStr = [...new Set(str.split(','))]
    for (let i = 0;  i < newStr.length; i++) {
        if (newStr[i] == '') {
            newStr.splice(i, 1);
        }
    }
    return newStr.join();
  }

  handelCancle = () => {
    this.props.onOk();
  }

  //上传图片成功
  uploadSuccess = (imgUrl, filename) => {
    this.props.form.setFieldsValue({ [filename]: imgUrl })
    this.setState({
      [filename]: imgUrl
    })
  }

  //渲染不同的证件类型
  changeIdType = () => {
    const { getFieldProps } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    // 表单栅格布局
    const formColLayout = {
      offset: 0,
      span: 22
    }
    
    const wrapperColLayout = {
      wrapperCol: { span: 18, offset: 6 },
    }

    const adminCardType = this.props.form.getFieldValue('adminCardType');
    if (adminCardType == '1') {
      return [<Row Key_Id>
        <Col {...formColLayout}>
          <FormItem
            {...formItemLayout}
            label="身份证号码"
          >
            <Input
                Key_Id
              maxLength={18}
              {...getFieldProps('cardNo', {
                rules: [
                  { required: true, message: '请输入身份证号码' },
                  {pattern: baseReg.cardIdReg, message: '请输入正确的身份证号'}
                ],
              })}
            />
          </FormItem></Col></Row>
        ,
      <Row Key_Id>
        <Col {...formColLayout}>
          <FormItem
            {...wrapperColLayout}
          >
            <UploadImg
                Key_Id
              title="上传身份证正面"
              typeView="frontCard" 
              filename="adminCardPathOne"
              importTip="请在身份证复印件上加盖公章并确认|图片内容清晰以便审核"
              imgUrl={this.state.adminCardPathOne}
              uploadSuccess={this.uploadSuccess}
              {...getFieldProps('adminCardPathOne', {
                rules: [
                  { required: true, message: '请上传身份证正面' }
                ],
              })}
            />
          </FormItem>
        </Col>
      </Row>
        ,
      <Row Key_Id>
        <Col {...formColLayout}>
          <FormItem
            {...wrapperColLayout}
          >
            <UploadImg
                Key_Id
              title="上传身份证反面"
              typeView="frontBackCard" 
              filename="adminCardPathTwo"
              importTip="请在身份证复印件上加盖公章并确认|图片内容清晰以便审核"
              imgUrl={this.state.adminCardPathTwo}
              uploadSuccess={this.uploadSuccess}
              {...getFieldProps('adminCardPathTwo', { 
                rules: [
                  { required: true, message: '请上传身份证反面' }
                ],
              })}
            />
          </FormItem>
        </Col>
      </Row>
      ]
    } else if (adminCardType == '2') {
      return [
        <Row Key_Id>
          <Col {...formColLayout}>
            <FormItem
              {...formItemLayout}
              label="护照号码"
            >
              <Input
                  Key_Id
                maxLength={30}
                {...getFieldProps('cardNo', {
                  rules: [
                    { required: true, min: 1, message: '请输入护照号码' },
                    {pattern: baseReg.cardNoReg, message: '请输入正确的护照号码'}
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>
        ,
        <Row Key_Id>
          <Col {...formColLayout}>
            <FormItem
              {...wrapperColLayout}
            >
              <UploadImg Key_Id
                         title="上传护照照片" typeView="passport" filename="adminCardPathOne"
                         importTip="请在护照复印件上加盖公章并确认|图片内容清晰以便审核"
                         imgUrl={this.state.adminCardPathOne} uploadSuccess={this.uploadSuccess}
                {...getFieldProps('adminCardPathOne', { 
                  rules: [
                    { required: true, message: '请上传护照照片' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>
      ]
    } else {
      return [
        <Row Key_Id>
          <Col {...formColLayout}>
            <FormItem
              {...formItemLayout}
              label="其他证件号码"
            >
              <Input
                  Key_Id
                maxLength={50}
                {...getFieldProps('cardNo', {
                  rules: [
                    { required: true, min: 1, message: '请输入其他证件号码' },
                    {pattern: baseReg.otherIdReg, message: '请输入格式正确的证件号码'}
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>
        ,
        <Row Key_Id>
          <Col {...formColLayout}>
            <FormItem
              {...wrapperColLayout}
            >
              <UploadImg
                  Key_Id
                  title="上传其他证件照片"
                  filename="adminCardPathOne"
                  importTip="请在其他证件复印件上加盖公章并确认|图片内容清晰以便审核"
                  imgUrl={this.state.adminCardPathOne}
                  uploadSuccess={this.uploadSuccess}
                {...getFieldProps('adminCardPathOne', {
                  rules: [
                    { required: true, message: '请上传其他证件照片' }
                  ],
                })}
              />
            </FormItem>
          </Col>
        </Row>
      ]
    }
  }

  //渲染步骤
  renderSteps = () => {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    // 表单栅格布局
    const formColLayout = {
      offset: 0,
      span: 22
    }
    const {
      taxpayersEligibleProperties,
	    invoiceTypeData,
    } = this.state;
    const invoiceTypes = getFieldProps('invoiceType', {
      rules: [
        { required: true, message: '请选择发票类型' },
      ],
      onChange: (e) => {
          this.taxTypeError = false;
      }
    });
    return (
      <div>
        <Row gutter={16} key={1}>
          <Col span="22">
            <FormItem label={'企业名称'}
              {...formItemLayout}
              name="companyName"
            >
              <Input
                value={this.props.accountInfo.name}
                disabled
              />
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16} key={2}>
          <Col span="22">
            <FormItem label={'统一社会信用代码'}
              {...formItemLayout}
              name="socialCreditCode"
            >
              <Input
                value={this.props.accountInfo.businessLicense}
                disabled
              />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...formColLayout}>
            <FormItem
                {...formItemLayout}
                required
                label='纳税人资格属性'
            >
              <Row gutter={16}>
                <Col span={22}>
                  <FormItem>
                    <RadioGroup
                        {...getFieldProps('taxpayersEligibleProperties', {
                          initialValue: 1,
                          value: {
                            taxpayersEligibleProperties
                          },
                          rules: [
                            {required: true, message: '请选择纳税人资格属性'}
                          ],
                          onChange: (e) => {
                            this.taxTypeError = false;
                            this.props.form.resetFields(['generalTaxpayersEcUploadUuids']);
                            if(e.target.value == 1) {
                              this.props.form.setFieldsValue({invoiceType: '1,2'});
                              this.setState({
                                invoiceTypeStr: '1,2'
                              })
                            }else{
                              this.props.form.setFieldsValue({invoiceType: ''});
                              this.setState({
                                invoiceTypeStr: ''
                              })
                            } 
                            this.setState({
                              generalTaxpayersEcUploadUuids: '',
                              taxpayersEligibleProperties: e.target.value
                            });
                          }
                        })}
                    >
                      <Radio Key_Id value={1}>一般纳税人</Radio>
                      <Radio Key_Id value={2}>小规模纳税人</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...formColLayout}>
            <FormItem
                {...formItemLayout}
                required
                label='发票类型'
                hasFeedback
            >
              <Row gutter={16}>
                <Col span={22}>
                  <FormItem>
                    <CheckboxGroup
                      options={invoiceTypeData}
                      {...invoiceTypes}
                    >
                    </CheckboxGroup>
                    <div className="ant-form-explain" style={{display: this.taxTypeError?'':'none',color: '#f50'}}>请选择发票类型</div>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...formColLayout}>
            <FormItem
                {...formItemLayout}
                label="开户银行"
            >
              <Input
                  Key_Id
                  maxLength={30} placeholder='请按开户银行填写'
                  {...getFieldProps('bank', {
                    rules: [
                      { required: true, message: '请输入开户银行' },
                    ],
                  })}
              />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...formColLayout}>
            <FormItem
                {...formItemLayout}
                label='开户许可证影像'
            >
              <UploadImg
                  Key_Id
                  title='上传开户许可证或基本存款账户信息影像'
                  filename='accountEcUploadUuids'
                  typeView='accountPermit'
                  imgUrl={this.state.accountEcUploadUuids}
                  uploadSuccess={this.uploadSuccess}
                  {...getFieldProps('accountEcUploadUuids', {
                    rules: [
                      { required: true, message: '请上传开户许可证影像' }
                    ]
                  })}/>
            </FormItem>
          </Col>
        </Row>
        {/*管理员公共模块*/}
        {this.commonModuleOfAdministrator()}

      </div>
    )
  }

  checkedType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
  }

  deepClone(obj) {
    let target = '';
    if (this.checkedType(obj) === 'Array') {
        target = [];
    }
    else if (this.checkedType(obj) === 'Object') {
        target = {};
    }
    else {
        return obj;
    }
    for (let item in obj) {
        if (typeof (obj[item]) === 'object') {
            target[item] = this.deepClone(obj[item]);
        }
        else {
            target[item] = obj[item];
        }
    }
    return target;
  }

  /*管理员公共模块*/
  commonModuleOfAdministrator=()=>{
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    // 表单栅格布局
    const formColLayout = {
      offset: 0,
      span: 22
    }
    return (
       <div>
         <Row>
           <Col {...formColLayout}>
             <FormItem
                 {...formItemLayout}
                 label="管理员姓名"
             >
               <Input
                   Key_Id
                   maxLength={30}
                   {...getFieldProps('adminName', {
                     
                     rules: [
                       { required: true, min: 1, message: '请输入管理员姓名' },
                     ],
                   })}
               />
             </FormItem>
           </Col>
         </Row>

         <Row>
           <Col {...formColLayout}>
             <FormItem
                 {...formItemLayout}
                 label="管理员电话"
             >
               <Tooltip
                   title="用于登录" placement="right"
                   {...getFieldProps('phoneNo', {
                     rules: [
                       { required: true, min: 1, message: '请输入管理员电话' },
                       { pattern: /^[1][0-9]{10}$/, message: '请输入正确的电话' },
                     ],
                   })}
               >
                 <Input
                     Key_Id
                     maxLength='11' {...getFieldProps('phoneNo', {
                   rules: [
                     { required: true, min: 1, message: '请输入管理员电话' },
                     { pattern: /^[1][0-9]{10}$/, message: '请输入正确的电话' },
                   ],
                 })}/>
               </Tooltip>
             </FormItem>
           </Col>
         </Row>

         <Row>
           <Col {...formColLayout}>
             <FormItem
                 {...formItemLayout}
                 label="管理员邮箱"
             >
               <Input
                   Key_Id
                   {...getFieldProps('adminEmail', {
                     rules: [
                       { required: true, min: 1, message: '请输入管理员邮箱' },
                       { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入格式正确的邮箱' },
                     ],
                   })}
               />
             </FormItem>
           </Col>
         </Row>
         <Row>
           <Col {...formColLayout}>
             <FormItem
                 {...formItemLayout}
                 label="证件类型"
             >
               <RadioGroup
                   {...getFieldProps('adminCardType', {
                     initialValue: 1,
                     rules: [
                       { required: true, message: '请选择证件类型' },
                     ],
                     onChange: () => {
                       this.props.form.resetFields(['adminCardPathOne', 'adminCardPathTwo','cardNo'])
                       this.setState({
                          adminCardPathOne: '',
                          adminCardPathTwo: '',
                          cardNo: ''
                       })
                     }
                   })}
               >
                 <Radio Key_Id value={1}>身份证</Radio>
                 <Radio Key_Id value={2}>护照</Radio>
                 <Radio Key_Id value={3}>其他证件</Radio>
               </RadioGroup>
             </FormItem>
           </Col>
         </Row>
         {/* 动态修改证件类型  管理员 */}
         {this.changeIdType()}
        
         <Row>
            <Col span="16">
              <FormItem
                {...formItemLayout}
                label="授权文件"
              >
                <Upload
                  key={'up'}
                  {...ComponentDefine.upload_suntray.uploadProps}
                  beforeUpload={this.beforeUpload}
                  {...getFieldProps('authorizationEcUploadUuids', {
                    onChange: (info) => {
                      this.uploadProps(info, 'authorizationEcUploadUuids')
                    }
                  })}
                >
                  <Button type="ghost" key={1}> <Icon type="upload" />上传附件</Button>
                  <span style={{ marginLeft: 5 }} key={2}>仅支持上传PDF格式的文件</span>
                </Upload>
              </FormItem>
            </Col>
          </Row>
         <Row>
            <Col span="16">
              <FormItem
                {...formItemLayout}
                label="澄清文件"
              >
                <Upload
                  key={'up'}
                  {...ComponentDefine.upload_suntray.uploadProps}
                  beforeUpload={this.beforeUpload}
                  {...getFieldProps('clarificationPath', {
                    onChange: (info) => {
                      this.uploadProps(info, 'clarificationPath')
                    }
                  })}
                >
                  <Button type="ghost" key={1}> <Icon type="upload" />上传附件</Button>
                  <span style={{ marginLeft: 5 }} key={2}>仅支持上传PDF格式的文件</span>
                </Upload>
              </FormItem>
            </Col>
          </Row>
      </div>
   )
  }

  render() {
    // 供应商管理——子账号申请
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handelSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.state._loading}
        maskClosable={false}
        width={800}
      >
        <Form horizontal>
          {this.renderSteps()}
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(MySuppliers)