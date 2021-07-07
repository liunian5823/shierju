import {Upload, message, Select, Checkbox, Card, Form, Row, Col, Input, Button, Icon, Modal} from "antd";
import Util from '@/utils/util';
import api from '@/framework/axios';//请求接口的封装
import { getDetailsLabel } from "@/components/handleLabel";
import WangEditor from "@/components/editor/WangEditor";
import less from './index.less'

const FormItem = Form.Item; //表单项
const Option = Select.Option; //下拉内容
const confirm = Modal.confirm;
class ReportBidForm extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || 0;
    this.state = {
      number: 0,
      currency: value.currency || "元",
      dataSource: {
        //个人信息
      },
      sels: "",
      switchShow: 0, //其它页面
      //附件相关
      priviewImage: "", //当前模态框展示的图片
      priviewVisibleA: false, //图片模态框展示与隐藏
      display_noneA: "", //上传按钮展示与隐藏
      //省市区相关
      provinceList: [], //省
      cityList: [], //市
      areaList: [], //区
      provinceName: "",
      cityName: "",
      agreeCheck: false,
      areaName: "",
      address: "",
      winningShow: "none",
      loading: false,
      payType:  '',   //付款方式
      orgList: [],    //当前公司部门列表
      ownCompanyList: [], //当前能发布的公司列表
    };
  }

  componentWillMount() {
    //查询当前能发布的公司
    this.getOwnCompanyList();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.sels == 4 && this.state.sels !== prevState.sels) {
      this.setState({
        winningShow: "block"
      });
      return;
    }
    if (this.state.sels !== prevState.sels && this.state.sels !== 4) {
      this.setState({
        winningShow: "none"
      });
    }
  }
  handleChange = value => {
    this.setState({
      sels: value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      // 提交如果校验通过弹出提示
      let _this = this;
      confirm({
        title: "发布招标公告后无法修改或删除，如发布有误需通过澄清补遗进行更正或补充，确认发布么？",
        onOk() {
          _this.save();
        },
        onCancel() {
          Util.alert("已取消操作");
        }
      });
    });
  };
  //编辑公司信息保存
  save = () => {
    let cass = 0;
    let regs = /^\d+(\.\d{1,2})?$/;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        cass++
        return;
      }
    });
    if(cass != 0) {
        return
    }
    if (this.state.loading) {
      return;
    }
    if(!this.props.form.getFieldsValue().inquiryFile && this.state.winningShow == "block") {
      message.error("请上传中标通知书");
      return;
    }
    if(this.state.number == 0 && this.state.winningShow == "block") {
      message.error("中标金额不能为零");
      return;
    }
    if(!this.state.content) {
      message.error("公告内容不能为空");
      return;
    }
    if(!regs.test(this.state.number)) {
      message.error("中标金额为整数或小数点后两位");
      return;
    }
    if(!this.state.agreeCheck) {
      message.error("请阅读并同意《铁建商城发布招标公告须知》");
      return;
    }

    this.setState({
      loading: true
    });
    let formData = this.props.form.getFieldsValue();
    let uploadList = [];
    // const _params = { ...formData };
    const params = {};
    params.moneyOld = this.state.number;
    params.content = this.state.content;
    params.type = this.state.sels;
    params.moneyUnit = this.state.currency == "元" ? 0 : 1;
    params.title = formData.title;
    params.bidNum = formData.bidNum;
    if(formData.type == '4'){
      params.bidCompany = $('#bidCompany').val();
      params.bidCompanyLicense = formData.bidCompanyLicense;
      params.payType = formData.payType;
      params.orgUuids = formData.orgUuids;
      params.createCompany = formData.createCompany;
    }

    //params对象添加uploadList数组属性
    if(formData.inquiryFile) {
      formData.inquiryFile.forEach(item => {
      let _uploadList = {};
      let str = item.response.data;
      if(str.indexOf("?")!= -1) {
        str = str.split("?")[0];
      }
      _uploadList.fileName = item.name;
      _uploadList.url = str;
      uploadList.push(_uploadList)
    });
    }
    params.uploadList = JSON.stringify(uploadList);
    if (params.fileListA && params.fileListA.length == 1) {
      params.companyLogoPath = params.fileListA[0].response.data;
      delete params.fileListA;
    }
    // console.log('params ---------------- ', params)
    api.ajax(
        'POST',
        '@/purchaser/bidinformation/insertInformationForPlatform',
        {...params}
    ).then(r => {
      this.setState({
        loading: false
      });
      message.success("保存成功!");
      //关闭
      window.close();
      //TODO
      window.opener.location.reload();   //刷新父页面
    }).catch(r=>{
      this.setState({
        loading: false
      });
      message.success("保存失败!");
    });
  };
  //上传
  uploadPropsMultiple = {
    ...ComponentDefine.upload_.uploadLimitSize(5),
    beforeUpload(file) {
      const fileType = [
        "pdf",
        "docx",
        "doc",
        "xls",
        "xlsx",
        "jpg",
        "png",
      ];
      let fileName = file.name;
      let filePix = fileName
        .substring(fileName.lastIndexOf(".") + 1, fileName.length)
        .toLowerCase();
      if (!fileType.includes(filePix)) {
        message.error("只能上传doc 、xls、xlsx、pdf、docx、jpg、png类型的文件");
        return false;
      }
      return true;
    },
    onChange: info => {
      let fileList = info.fileList;
      /*if (fileList.length >= 6) {
        message.error("最多上传五个附件");
        return;
      }*/
      if (info.file.status === "done") {
        let isSuccess = false;
        if (info.file.response.code == '000000' ) {
          isSuccess = true;
          info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(
              info.file.response.data
          );
          message.success(`${info.file.name} 上传成功。`);
        } else {
          if (info.file.response.code == "400002") {
            message.error(info.file.response.msg);
          } else {
            message.error(`${info.file.name} 上传失败。`);
          }
        }
        if (isSuccess) {
          fileList = fileList.slice(-1);
        } else {
          fileList = fileList.slice(0, fileList.length - 1);
        }
      } else if (info.file.status === "error") {
        if (info.file.response.code == "400002") {
          message.error(info.file.response.msg);
        } else {
          message.error(`${info.file.name} 上传失败。`);
        }
      }
      this.props.form.setFieldsValue({ inquiryFile: fileList });
    }
  };
  handleCancel = () => {
    this.setState({
      priviewVisibleA: false
    });
  };

  //富文本编辑器变更事件
  editChange = html => {
    this.setState({
      content: html
    });
  };
  handleNumberChange = e => {
    const number = e.target.value || 0;
    if (!("value" in this.props)) {
      this.setState({ number });
    }
    this.triggerChange({ number });
  };

  handleCurrencyChange = currency => {
    if (!("value" in this.props)) {
      this.setState({ currency });
    }
    this.triggerChange({ currency });
  };

  triggerChange = changedValue => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  agreeCheckChange = (e) => {
        this.setState({
            agreeCheck: e.target.checked
        })
  };

  //处理付款方式
  handlePayTypeChange = (e) => {
    this.setState({
      payType: e
    })
  };


  //通过统一社会信用代码查询公司是否存在
  queryCompanyInfo = () => {
    let _this = this;
    //获取当前填写的统一社会信用代码
    let businessLicense = $('#bidCompanyLicense').val();
    if (businessLicense == null || businessLicense == '' || businessLicense == undefined){
      Util.alert("请输入中标供应商统一社会信用代码", { type: 'error' });
      return;
    }
    api.ajax(
        'GET',
        '@/supplier/ecCompanySupplier/checkCompanyBus',
        {businessLicense}
    ).then(r=>{
      if (r.data){
        //将当前的公司名称赋值给中标供应商名称
        // $('#bidCompany').val(r.data);
        _this.props.form.setFieldsValue({ 'bidCompany': r.data })
      }else{
        Util.alert("未查询到该供应商，该供应商可能未注册铁建商城。", {type: 'error'})
        return;
      }
    }).catch(r=>{
    })
  }

  //通过公司ID查询当前公司下的部门列表
  queryCompanyOrg = (companyId) => {
    api.ajax(
        'GET',
        '@/supplier/ecCompanySupplier/queryCompanyOrg?companyId=' + companyId,
        {}
    ).then(r=>{
      //清空部门
      this.props.form.resetFields(["orgUuids"]);
      this.setState({
        orgList: r.data
      })
    }).catch(r=>{
    })
  }

  //查询当前内部单位清单
  getOwnCompanyList=()=>{
    let _this = this;
    api.ajax(
        'GET',
        '@/platform/ecBidInfo/queryOwnCompanyList',{}
    ).then(r=>{
      _this.setState({
        ownCompanyList: r.data
      })
    })
  }

  //关闭当前页面
  closePage = () =>{
    window.close();
  }


  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    const { size } = this.props;
    const state = this.state;
    const { getFieldProps } = this.props.form;
    const leftSpan = 0;
    const span = 20;
    const isRequired = this.state.winningShow == "block" ? true : false;
    let {orgList, ownCompanyList} = this.state;
    return (
      <div className={less.reportBidForm}>
        <Form onSubmit={this.handleSubmit} className={'form1'}>
            <Card bordered={false}>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label={getDetailsLabel("公告类型")}
                    {...formItemLayout}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="请输入公告类型"
                      {...getFieldProps(`type`, {
                        onChange: this.handleChange,
                        rules: [
                          {
                            required: true,
                            message: "请选择公告类型"
                          }
                        ]
                      })}
                    >
                      <Option value="4">中标公示</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={12} >
                  <Form.Item
                    {...formItemLayout}
                    label={getDetailsLabel("招标编号")}
                  >
                    <Input
                      placeholder="请输入招标编号"
                      maxLength={50}
                      {...getFieldProps(`bidNum`, {
                        rules: [{ required: true, message: "请输入招标编号" }]
                      })}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/*隐藏文本域*/}
              <Row gutter={24} style={{ display: this.state.winningShow }}>
                <Col span={12} >
                  <Form.Item
                      {...formItemLayout}
                      label={getDetailsLabel("付款方式")}
                  >
                    <Select
                        defaultValue=""
                        value={state.payType}
                        placeholder={'选择付款方式'}
                        onChange={this.handlePayTypeChange}
                        {...getFieldProps(`payType`, {
                          rules: [{
                            required: isRequired,
                            message: '请选择付款方式'
                          }],

                        })}
                    >
                      <Option value="1">铁建银信</Option>
                      <Option value="2">现金支付</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12} >
                  <Form.Item
                    {...formItemLayout}
                    label={getDetailsLabel("中标金额")}
                  >
                    <Input
                      type="text"
                      size={size}
                      placeholder="请输入中标金额"
                      maxLength={20}
                      style={{ width: "65%", marginRight: "3%" }}
                      {...getFieldProps(`moneyOld`, {
                        onChange: this.handleNumberChange,
                        rules: [
                          {
                            required: isRequired,
                            message: "中标金额不能为空"
                          }
                        ]
                      })}
                    />
                    <Select
                        defaultValue="元"
                        value={state.currency}
                        size={size}
                        style={{ width: "32%" }}
                        onChange={this.handleCurrencyChange}
                    >
                      <Option value="元">元</Option>
                      {/*<Option value="万元">万元</Option>*/}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {this.props.form.getFieldValue('type') == '4' ?
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                          {...formItemLayout}
                          label={getDetailsLabel("招标公司")}
                      >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            notFoundContent="无匹配结果"
                            placeholder='请选择招标公司'

                            {...getFieldProps(`createCompany`,{
                              rules: [{
                                required: isRequired,
                                message: "请选择招标公司"
                              }],
                              onChange: (value) => (this.queryCompanyOrg(value))
                            })}
                        >
                          {
                            ownCompanyList.map((item, index)=>{
                              return (
                                  <Option key={index} value={item.id}>{item.name}</Option>
                              )
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                          {...formItemLayout}
                          label={getDetailsLabel("项目部")}
                      >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            notFoundContent="无匹配结果"
                            placeholder='请选择部门'
                            {...getFieldProps("orgUuids")}
                        >
                          {
                            orgList.map((item, index)=>{
                              return (
                                  <Option key={index} value={item.uuids}>{item.orgName}</Option>
                              )
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  : ''
              }

              {this.props.form.getFieldValue('payType') == 1 ?
                <Row gutter={24} style={{ display: this.state.winningShow }}>
                  <Col span={12}>
                    <Form.Item
                        {...formItemLayout}
                        label={"中标供应商统一社会信用代码"}
                    >
                      <Input
                          id='bidCompanyLicense'
                          type="text"
                          placeholder="请输入中标供应商统一社会信用代码"
                          maxLength={30}
                          style={{ marginRight: "3%" }}
                          {...getFieldProps(`bidCompanyLicense`, {
                            rules: [
                              { required: true, message: '请输入中标供应商统一社会信用代码' },
                              { pattern: /[0-9A-Z]{18}/, message: '请与营业执照信息保持一致' },
                            ],
                          })}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button type="primary" onClick={this.queryCompanyInfo.bind(this)}>查询</Button>
                  </Col>
                  <Col span={10} style={{color: 'red'}}>
                    <span>*请务必将中标供应商统一社会信用代码填写正确，否则将无法使用本单号开具铁建银信。</span>
                  </Col>
                </Row>
                  :
                <Row gutter={24} style={{ display: this.state.winningShow }}>
                  <Col span={12}>
                    <Form.Item
                        {...formItemLayout}
                        label={"中标供应商统一社会信用代码"}
                    >
                      <Input
                          id={'bidCompanyLicense'}
                          type="text"
                          size={size}
                          placeholder="请输入中标供应商统一社会信用代码"
                          maxLength={200}
                          style={{ marginRight: "3%" }}
                          {...getFieldProps(`bidCompanyLicense`, {
                            // onChange: this.handleNumberChange,
                            rules: [
                              {
                                required: true,
                                message: "请输入中标供应商统一社会信用代码"
                              }
                            ]
                          })}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
              }

              {this.props.form.getFieldValue('payType') == 1 ?
                <Row gutter={24} style={{ display: this.state.winningShow }}>
                  <Col span={12} >
                    <Form.Item
                        {...formItemLayout}
                        label={getDetailsLabel("中标供应商")}
                    >
                      <Input
                          id={'bidCompany'}
                          type="text"
                          size={size}
                          placeholder="请输入中标供应商名称"
                          maxLength={200}
                          readOnly
                          style={{ marginRight: "3%" }}
                          {...getFieldProps(`bidCompany`)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                  :
                <Row gutter={24} style={{ display: this.state.winningShow }}>
                  <Col span={12} >
                    <Form.Item
                        {...formItemLayout}
                        label={getDetailsLabel("中标供应商")}
                    >
                      <Input
                          id={'bidCompany'}
                          type="text"
                          size={size}
                          placeholder="请输入中标供应商名称"
                          maxLength={200}
                          style={{ marginRight: "3%" }}
                          {...getFieldProps(`bidCompany`)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
              }

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={getDetailsLabel("公告名称")}
                  >
                    <Input
                      placeholder="请输入公告名称"
                      maxLength={100}
                      {...getFieldProps(`title`, {
                        rules: [{ required: true, message: "请输入公告名称" }]
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}></Col>
              </Row>
              {/* 切换隐藏   */}
              <Row gutter={24} style={{display: this.state.winningShow}}>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={getDetailsLabel("中标通知")}
                  >
                    <Upload
                      fileList={this.state.fileList}
                      {...getFieldProps(`inquiryFile`, {
                        ...ComponentDefine.upload_.uploadForm,
                        rules: [
                          {
                            required: isRequired,
                            message: "请上传中标通知书"
                          }
                        ]
                      })}
                      {...this.uploadPropsMultiple}
                    >
                      <Button type="ghost">
                        <Icon type="upload" /> 点击上传
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <span>
                    可上传中标通知书或中标公示文件，最多上传5个格式为doc/xls/xlsx/pdf/docx/jpg/png单个文件体积小于5MB的文件
                  </span>
                </Col>
              </Row>
              <Row gutter={24} style={{display: this.state.winningShow == "block" ? "none" : "block"}}>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={getDetailsLabel("上传附件")}
                  >
                    <Upload
                      fileList={this.state.fileList}
                      {...getFieldProps(`inquiryFile`, {
                        ...ComponentDefine.upload_.uploadForm
                      })}
                      {...this.uploadPropsMultiple}
                    >
                      <Button type="ghost">
                        <Icon type="upload" /> 点击上传
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <span>
                    最多上传5个格式为doc 、xls、xlsx、pdf、docx、jpg、png单个文件体积小于5MB的文件
                  </span>
                </Col>
              </Row>
              {/*公司简介*/}
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    {...formItemLayout}
                    label={getDetailsLabel("公告内容")}
                  >
                    <div style={{ width: "700px" }}>
                      <WangEditor
                        initHtml={this.state.dataSource.content}
                        onChange={this.editChange}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card bordered={false}>
                <Row className={less.centerClass}>
                    <Col span={24}>
                      <Checkbox onChange={this.agreeCheckChange}></Checkbox>
                      我已经阅读并同意
                      <a target="_blank" href={"/inquiry/inquiryRules"}>《铁建商城发布招标公告须知》</a>
                     </Col>
                 </Row>
                <Row className={less.buttonClass} >
                  <Col span={24}>
                    <Button type="primary" loading={this.state.loading} onClick={this.handleSubmit} className={less.comfrimButton}>确认发布</Button>
                    <Button type="ghost" onClick={this.closePage}>返回</Button>
                  </Col>
                </Row>
            </Card>
        </Form>
      </div>
    );
  }
}

const ReportBidFormContent =  Form.create()(ReportBidForm);

export default class ReportBid extends React.Component {
  render(){
    return(
        <ReportBidFormContent />
    )
  }
}
