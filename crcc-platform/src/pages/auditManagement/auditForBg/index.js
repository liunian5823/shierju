import { Card, Form, Button, Select, Radio,Tooltip, Tag, Row, Col, DatePicker, Checkbox, Table, Badge, Modal } from 'antd';
import AuthButton from '@/components/authButton'
import api from '@/framework/axios';
import ModalForm from './modalForm';
import Util from '@/utils/util';
import Album from 'uxcore-album';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';
import BaseTable from '@/components/baseTable';
import BaseWrap from '@/components/baseWrap';
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig'

import less from './index.less';


const { Photo } = Album;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;

class AuditForBg extends React.Component {
	_userInfo = null;
	legalType = null;
  state = {
	baseParams: {},//审核记录参数
    loading: false,
  companyId:"",
	recodes:[{title:"test",userinfo:"张三18888888888",audit:"审核中",uuids:"12312321"},{title:"test",userinfo:"张三18888888888",audit:"驳回",uuids:"23442"}],
    mainCommodityData: [],//主营商品数据
    id: "",
	workId: "",//工单id
	arrStr: "",
  imgModalShow: false,
  mainBusiness: '',
	companyType: null,//公司类型
    basicAuditInfo: {},
	plainOptions: [], // 专业领域
    Clarification: [],//说明材料
    auditList: [], //审核字典数据
    cardType: "", //法人证件类型
	userCardType:"",//管理员证件类型
    threeInOne: "", //三证合一
    isLicenseLong: false, // 执照有效期长期标识
    isRegisteredCapital: false, // 注册资本无标识
    provinceList: [],//省数据
    cityList: [],//省下对应市数据
    areaList: [],//市下对应县数据
	AreaList: [],
    legalPersonPath1: "",//法人证件正面
    legalPersonPath2: "",//法人证件反面
	adminCardPathOne: "",//管理员证件正面
	adminCardPathTwo: "",//管理员证件反面
    businessLicensePath: "",//营业执照原件
    taxRegistrationPath: "",//税务登记证
	taxEligibilityPath: "",//纳税人资格证明
    organizationCertificatePath: "",//组织机构代码证
    accountPermitPath: "",//开户许可证原件
    vatPayerPath: "",//纳税人资格证明
    startValue: null,
    endValue: null,
    endOpen: false,
    checkNick: true,
    stuss: false,
    clarificationDocumentHistory: [],//澄清文件历史记录
    backMsg: '',//驳回信息
	BrandUuids: 0,
	ProductUuids: 0,
	businessBrand: [],
	businessProduct: [],
	approvalResult: null,
	companyName: "",
	tableState:0,
	applicationUserPhoneNo: null,//申请人手机号
	sameCompanys: [],//同名企业
	  taxTypeData: [{value: '1', label: '增值税专项发票'},{value: '2', label: '增值税普通发票'}],//发票类型
	  taxTypeDataDefault: ['1'],
      color: "#1f1f1f",//disabled颜色
  }
  _isMounted = false;

  auditKeyList = []; //需要审核的key数据

  componentWillMount() {
    this._isMounted = true;
	const companyUUIds = this.props.match.params.cuuids;
	const workUUIds = this.props.match.params.wuuids;
	this.setState({
	  id: companyUUIds
	})
    // //获取省/市/县
    this.getProvinceList();
    //主营商品
    this.getMainCommodityData();
    //查询澄清文件
    this.getClarificationData(companyUUIds);
	//专业领域
	this.getProfessionalFields();
	//获取工单信息
	this.getWorkInfo(workUUIds,companyUUIds)
	// 获取审核字典数据
    this.getAuditList(companyUUIds); 
	this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
	  if (this._userInfo || !obj) { return false }
	  this._userInfo = obj;
	}.bind(this));//
	PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
  }
  
  getWorkInfo = (uuids,companyUUIds) => {
	  api.ajax('GET', '@/platform/workOrders/getWorkOrderById?uuids='+uuids).then(r => {
		  if(r.data){
			r.data.remark = r.data.reviewReason;
			this.props.form.setFieldsValue(r.data);
			this.props.form.setFieldsValue({ approvalResult: r.data.workOrdersState });
			this.setState({
				workId: r.data.id,
				applicationUserPhoneNo: r.data.applicationUserPhoneNo,
				approvalResult: r.data.workOrdersState
			},()=>{
				this.getCompanyInfo(companyUUIds,uuids);
			});
		  }
	  })
  }
  componentDidMount() {
	  this.areaClass();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAuditListData = (uuids) => {
    api.ajax('GET', '@/supplier/ecAuditShortcutStatementCorrespond/querySupplierWordAuditList', {
      uuids,
      type: 'review'
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      let curObj = {};
	  if(r.data && r.data.rows.forEach){
		  r.data.rows.forEach((o, i) => {
			if (o) {
			  let key = o.basicAuditName;
			  curObj['isPass_' + key] = o.checkStatus + '';
			  curObj['phrase_' + key] = o.commentId;
			}
		  })
		  this.props.form.setFieldsValue(curObj);
	  }
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
  
  strTArr=(str)=>{
	  if(str) {
	    let arr = str.toString().split(",");
		let arrs = new Array();
		let index = 0;
		arr.forEach(i => {
		  index = index+1;
		  arrs.push({"key":index,"name":i});
		})
	    return arrs;
	  }
	  return null;
  }

  getCompanyInfo = (id,workUuids) => {
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
	  //企业类型
	  if(r.data.isMember){
		  r.data.memberTxt = r.data.isMember == 1 ? "内部单位":"外部单位";
	  }else {
		  r.data.memberTxt = "-";
	  }
	  //企业级别
	  if(r.data.level){
	  	r.data.levelTxt = r.data.level == 1 ? "股份公司":r.data.level == 2 ? "局级公司":"处级公司";
	  }else {
	  	r.data.levelTxt = "-";
	  }
	  r.data.pname = r.data.pName == null ? "-":r.data.pName;
      //更换注册资本无按钮数据类型 
      r.data.isRegisteredCapital = r.data.registeredCapital ? false : true;
      if (r.data.registeredCapital == 0) {
        r.data.registeredCapital = null;
      }
      //审核原因 （接口多用问题）
      r.data.remark = r.data.checkRemarks;
      //审核结果 （接口多用问题）
      r.data.approvalResult = r.data.checkResult ? parseInt(r.data.checkResult) : 1;
	  r.data.approvalResult = this.state.approvalResult;
	  r.data.supplyArea = r.data.supplyArea?r.data.supplyArea.split(","):[];
	  r.data.expertiseArea = r.data.expertiseArea?r.data.expertiseArea.split(","):[];


	  let businessProducts= this.strTArr(r.data.businessProduct);
	  let businessBrands=this.strTArr(r.data.businessBrand);
    this.legalType= r.data.legalType;
      this.setState({
		baseParams: {workOrdersType: 5, workOrdersTypeTwo: 6, companyId: r.data.companyId, workUuids: workUuids, license : r.data.businessLicense},
    companyType:r.data.type,
    mainBusiness: r.data.mainBusiness,
    companyId: r.data.companyId,
		companyUrl: r.data.companyUrl,
		businessProduct: businessProducts,
		businessBrand: businessBrands,
		companyName: r.data.name,
        basicAuditInfo: r.data,
        legalPersonPath1: r.data.legalPersonPath1,
        legalPersonPath2: r.data.legalPersonPath2,
        businessLicensePath: r.data.businessLicensePath,//营业执照原件
        taxRegistrationPath: r.data.taxRegistrationPath,//税务登记证
		taxEligibilityPath: r.data.taxEligibilityPath,//纳税人资格证明
        organizationCertificatePath: r.data.organizationCertificatePath,//组织机构代码证
        accountPermitPath: r.data.accountPermitPath,//开户许可证原件
		adminCardPathOne: r.data.adminCardPathOne,
		adminCardPathTwo: r.data.adminCardPathTwo,
        vatPayerPath: r.data.vatPayerPath,//纳税人资格证明
        cardType: r.data.legalPersonIdType, //法人初始化证件类型
		userCardType: r.data.adminCardType,//管理员证件类型
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
	  this.handelToLoadTable();
      this.props.form.setFieldsValue(r.data);
      this.props.form.setFieldsValue({remark: ''});
	  
	  //加载同名企业数据
	  this.getSameCompanyData(workUuids, r.data.name);
    })
  }
  //加载table
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }
  resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
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
          if (text) {
            return <span title={text}>{text}</span>
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
      let initialValue = curObj.data[0].id?curObj.data[0].id.toString():null;
      return [
        <Col span={8} key={isPassKey}>
          <FormItem {...this.formItemLayoutOther}>
            <RadioGroup
              {...getFieldProps(isPassKey,
                {
                  initialValue: '1',
                  rules: [
                    {
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
      this.setState({
        checkNick: false,
        stuss: true
    }, () => {
      this.props.form.validateFields(['remark','address','legalPersonName','legalPersonId','institutionalBank','companyBaseAccount'], { force: true });
    });
      return;
    }else {
      this.setState({
        checkNick: true,
        stuss: false
    }, () => {
      this.props.form.validateFields(['remark','address','legalPersonName','legalPersonId','institutionalBank','companyBaseAccount'], { force: true });
    });
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
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.taxRegistrationPath]))}>点击查看影像</a>
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
            <FormItem {...formItemLayout}>
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.organizationCertificatePath]))}>点击查看影像</a>
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

	arrToStr=(arr,key)=>{
		if(arr && arr != null && arr !== undefined && arr != ""){
			this.state.arrStr = "";
			if(key){
				arr.map((k, index) => {
				  return (
					this.state.arrStr += k.name+","
				  );
				});
			}else{
				arr.map((k, index) => {
				  return (
					this.state.arrStr += k+","
				  );
				});
			}
			let str = this.state.arrStr;
			return str.substr(0,str.length-1);
		}
		return "";
	}
	
  // 表单提交
  currentSubmit = (status) => {
    // 未完任务
    // 图片上传成功后需要把地址取到保存到数据库（这一块未处理）
    // 澄清文件数据集未处理
    //
    //
    let ary = ['name']
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
		values.reviewType = "review";
        values.approvalResult = this.props.form.getFieldValue('approvalResult');
		values.result = this.props.form.getFieldValue('approvalResult');
		values.remark = this.props.form.getFieldValue('remark');//审核建意

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
        api.ajax('POST', '@/supplier/ecUserApprovalLog/save?workOrdersId='+this.state.workId, {
          approvalType: 2,
          id: this.state.basicAuditInfo.id,
          companyId: this.state.basicAuditInfo.companyId,
          ...values
        }).then(r => {
          if (!_this._isMounted) {
            return;
          }
          Util.alert(r.msg, { type: 'success'});/* , callback: () => (this.props.history.goBack())  */
      this.setState({
        loading: false,
      })
        }).catch(r => {
          this.setState({
            loading: false
          })
          Util.alert(r.msg, { type: 'error' });
        })
      }

	  })
    } else {
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
			values.reviewType = "review";
			values.approvalResult = this.props.form.getFieldValue('approvalResult');
			values.result = this.props.form.getFieldValue('approvalResult');
			values.remarks = this.props.form.getFieldValue('remarks');//公司简介
			values.remark = this.props.form.getFieldValue('remark');//审核建意
			values.mainBusiness = this.state.mainBusiness;
			values.companyUrl = this.props.form.getFieldValue('companyUrl');
			
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
			//id: this.state.basicAuditInfo.id,
			api.ajax('POST', '@/supplier/ecUserApprovalLog/save?workOrdersId='+this.state.workId, {
			  approvalType: 2,
			  type:this.state.companyType,
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
  //根据法人证件类型获取页面显示
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
    const _isRequired = this.props.form.getFieldValue('approvalResult') == 1 ? true : false;
    if (index == 1) {
      return [
        <Row gutter={16} style={{display: this.legalType == 1 ? 'none' : ''}} key={"legalPersonId"}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="法人身份证:">
              <Input type="text" maxLength='18' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('legalPersonId')}
                placeholder="请输入法人身份证件号" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonId", "isPass_legalPersonId", "phrase_legalPersonId")}
          </Col>
        </Row>,
        <Row gutter={16} style={{display: this.legalType == 1 ? 'none' : ''}} key={4}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="证件影像">
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.legalPersonPath1]))} style={{marginRight: "20px"}}>点击查看正面影像</a>
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.legalPersonPath2]))}>点击查看反面影像</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legal_person_path1", "isPass_legal_person_path1", "phrase_legal_person_path1")}
          </Col>
        </Row>,
      ]
    } else if (index == 2 || index == 3) {
      return [
        <Row gutter={16} style={{display: this.legalType == 1 ? 'none' : ''}} key={"legalPersonId"}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="法人证件号码:">
              <Input type="text" maxLength='20' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('legalPersonId',
                  {
                    rules: [
                      {
                        message: "请输入法人证件号码"
                      }
                    ]
                  })}
                placeholder="请输入法人证件号码" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonId", "isPass_legalPersonId", "phrase_legalPersonId")}
          </Col>
        </Row>,
        <Row gutter={16} style={{display: this.legalType == 1 ? 'none' : ''}} key={3}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="证件影像">
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.legalPersonPath1]))}>点击查看影像</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legal_person_path1", "isPass_legal_person_path1", "phrase_legal_person_path1")}
          </Col>
        </Row>
      ]
    }
  }
//根据管理员证件类型获取页面显示
  getUserCardPage = (index) => {
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
    const _isRequired = this.props.form.getFieldValue('approvalResult') == 1 ? true : false;
    if (index == 1) {
      return [
        <Row gutter={16} key={4}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="证件影像">
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.adminCardPathOne]))} style={{marginRight: "20px"}}>点击查看正面影像</a>
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.adminCardPathTwo]))}>点击查看反面影像</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("userCertificate", "isPass_userCertificate", "phrase_userCertificate")}
          </Col>
        </Row>,
      ]
    } else if (index == 2 || index == 3) {
      return [
        <Row gutter={16} key={3}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="证件影像">
				<a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.adminCardPathOne]))} style={{marginRight: "20px"}}>点击查看影像</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("userCertificate", "isPass_userCertificate", "phrase_userCertificate")}
          </Col>
        </Row>
      ]
    }
  }
  
  //  ??
  renderBackMsg = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    if (this.state.backMsg) {
      return <Card className="mb10" title={<span><Badge count={6} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 上次驳回意见</span>} bordered={false}>
        <Row gutter={16}>
          <Col span={24}>
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

// 获取专业领域
  getProfessionalFields = () => {
    let _this = this;
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('GET', '@/platform/ecProfessionalField/getProfessionalFields').then(r => {
      const plainOptions = (r.data || []).map(v => {
          return {value: v.id ? v.id + '' : v.id, label: v.pfName, key: v.id}
        })
        this.setState({
          plainOptions
      })
    }).catch(r => {
      this.setState({
        loading: false
      })
    })
  }
  
  //先查询地域
  areaClass = () => {
    api.ajax("GET", "@/base/ecProvince/selectArea", {}).then(r => {
      if (r.msg === "请求成功") {
        this.setState({
            AreaList: r.data.rows,
        })
      }
    }).catch(r => {
      Util.alert(r.msg, {type: 'error'});
    })
  }
  areaOptions = () => {
    const options = [];
    options.push(<Option value="全国" key=''>全国</Option>);
    this.state.AreaList.map((v, index) => {
      options.push(<Option value={`${v.areaCode}`} key={index}>{v.areaName}</Option>)
    });
  
    return options;
  }
  mainOptions = () => {
    const options = [];
    this.state.mainCommodityData.map((v, index) => {
      options.push(<Option value={`${v.id}`} key={index}>{v.name}</Option>)
    });
  
    return options;
  }
  // 添加经营品牌或产品
  addLabel = (type) => {
    const { getFieldValue } = this.props.form;
    if (type === 'businessBrand') {
      // 经营品牌
      const addLabel = getFieldValue('businessBrandKeys').map((k, index) => {
        return (
          <p key={index} className={less.label_tags_item}>
            {k}
            <span key={index} onClick={this.deleteLabelTags(k, type)}>×</span>
          </p>
        );
      });
      return addLabel;
    } else {
      const addLabel = getFieldValue('businessProduct').map((k, index) => {
        return (
          <p key={index} className={less.label_tags_item}>
            {k}
            <span key={index} onClick={this.deleteLabelTags(k, type)}>×</span>
          </p>
        );
      });
      return addLabel;
    }
  }
  deleteLabelTags = (item, type) => {
    console.log(item, 'deleteLabelTags');
    if (type === 'businessBrand') {
      // 经营品牌_删除
      this.state.BrandUuids--;
    } else {
      // 经营产品_删除
      this.state.ProductUuids--;
    }
  }
  brandInputEvent = (e, type) => {
    if (type === 'businessBrand') {
      this.setState({
        brandVal: e.target.value
      }, () => {
        console.log(this.state.brand);
      });
    }
  
    if (type === 'businessProduct') {
      this.setState({
        productVal: e.target.value
      }, () => {
        console.log(this.state.brand);
      });
    }
  }
  
  pressEnterEvent = (e, type) => {
    this.addLabelTags(type);
  } 
  
  handleCloseTag = (key, type) => {
    const brandTags = [...this.state[type]].filter(tag => (tag.key !== key) && tag);
    if (type === 'businessBrand') {
        this.setState({
            businessBrand: brandTags
        });
    }
    else if (type === 'businessProduct') {
        this.setState({
            businessProduct: brandTags
        });
    }
  }
  addLabelTags(type) {
    let brandTags = [...this.state[type]];
    if (type === 'businessBrand') {
        if (!this.state.brandVal) {
            return;
        }
  
        brandTags.push({key: (new Date()).valueOf(), name: this.state.brandVal});
        this.setState({
            businessBrand: brandTags
        });
        this.setState({
            brandVal: ''
        });
    }
    else if (type === 'businessProduct') {
        if (!this.state.productVal) {
            return;
        }
  
        brandTags.push({key: (new Date()).valueOf(), name: this.state.productVal});
        this.setState({
            businessProduct: brandTags
        });
        this.setState({
            productVal: ''
        });
    }
  }
  
  getOptions = (arr) => {
    let list = arr.map((item, index) => {
		let value = item.value ? item.value:item.pfName
        return (
            <Option value={item.id} key={item.id}>{value}</Option>
        )
    })
    return list
  }
  

  handleShowImg = (url) => {

    if (url.length == 0) {
      Util.alert('暂无图片')
      return;
    }
    let baseUrl = SystemConfig.configs.resourceUrl;

    Album.show({ photos: [
        <Photo
            src={baseUrl + url}
            key={0}
        />,
      ],showButton:true});
  }

  
  cancelImgModal = () => {
    this.setState({
      imgModalShow: false
    })
  }
  
  imgModal = {
    onCancel: this.cancelImgModal
  }
  handleToDetails = (record) => {
    // workOrdersType为1或2时是初审，5、6是复审
    if(record.workOrdersType==1||record.workOrdersType==2) {
      window.open(window.location.href.split('#/')[0]+'#/auditManagement/basicAudit/details/' + record.companyUuids + '/' + record.workOrdersState);
    } else if(record.workOrdersType==5||record.workOrdersType==6) {
      window.open(window.location.href.split('#/')[0]+'#/auditManagement/backgroundAudit/details/'+record.companyUuids);
    }
  }
  
  companyInfomation=()=>{

      let url = '#/qualification/basicInfomation?companyName='+this.state.companyName;
      window.open(url);
	  //window.open(systemConfigPath.jumpCrccmallPage('/qualification/basicInfomation?companyName='+this.state.companyName));
  }
  
    
    columns = (params) => {
        return [
          {
            title: '工单号',
            dataIndex: 'workOrdersCode',
            key: 'indexkey',
            witdh: 110
          },
  		{
  		  title: '申请人姓名',
  		  dataIndex: 'applicationUserName',
  		  key: 'applicationUserName',
  		  witdh: 120
  		},
  		{
  		  title: '申请人手机号',
  		  dataIndex: 'applicationUserPhoneNo',
  		  key: 'applicationUserPhoneNo',
  		  witdh: 120
  		},
          {
            title: '申请时间',
            dataIndex: 'applicationTime',
            key: 'applicationTime',
            witdh: 130,
            sorter: true,
            render: (text, record) => {
              return text.substring(0, 19);
            }
          },
          {
            title: '审核人',
            dataIndex: 'reviewUser',
            key: 'reviewUser',
            witdh: 120,
  		  render: (text, record) => {
  			if(text){
  				return text;
  			} else {
  				return "-";
  			}
  		  }
          },
          {
            title: '审核时间',
            dataIndex: 'reviewTime',
            key: 'reviewTime',
            witdh: 130,
            sorter: true,
  		  render: (text, record) => {
  			if(text){
  				return text.substring(0,10);
  			} else {
  				return "-";
  			}
  		  }
          },
  		{
  		  title: '状态',
  		  dataIndex: 'workOrdersState',
  		  key: 'workOrdersState',
  		  witdh: 90,
  		  render: (text, record) => {
  			if(text == 1 || text == "1"){
  				return <span style={{color:'#E96C47'}}>待审核</span>;
  			} else if(text == 2 || text == "2") {
  				return <span style={{color:'#4CD91F'}}>通过</span>;
  			} else if(text == 3 || text == "3") {
  				return <span style={{color:'#DD2F26'}}>驳回</span>;
  			}
  		  }
  		},
  		{
  		  title: '审核意见',
  		  dataIndex: 'reviewReason',
  		  key: 'reviewReason',
  		  witdh: 160,
  		  render: (text, record) => {
  			if(text){
  				return <span title={text}>{text.substring(0,100)}{text.length > 100?'...':''}</span>;
  			} else {
  				return "-";
  			}
  		  }
  		},
          {
            title: '操作',
            dataIndex: 'x',
            witdh: 80,
            key: 'x',
            render: (text, record) => {
  			    return (
  			      <span>
  			        <AuthButton elmType="a" onClick={() => { this.handleToDetails(record) }}>详情</AuthButton>
  			      </span>
  			    )
            }
          }
        ]
    }
	
	//同名企业
	getSameCompanyData = (uuids, workTitle) => {
		let applicationUserPhoneNo = this.state.applicationUserPhoneNo;
	  api.ajax('GET', '@/platform/workOrders/getEcCompanyWorkOrdersByPage', {
		  workOrdersTitle: workTitle
	  }).then(r => {
	    if (!this._isMounted) {
	      return;
	    }
		let workes = [];
		if(r.data && r.data.rows){
			r.data.rows.map(item => {
			  if (item.applicationUserPhoneNo != applicationUserPhoneNo) {
			    workes.push(item);
			  }
			})
		}
	    this.setState({
	      sameCompanys: workes
	    })
	  })
	}
	handleToDetailsOpen = (record) => {
    // workOrdersType为1或2时是初审，5、6是复审
    if(record.workOrdersType==1||record.workOrdersType==2) {
      window.open(window.location.href.split('#/')[0]+'#auditManagement/basicAudit/details/' + record.companyUuids + '/' + record.workOrdersState);
    } else if(record.workOrdersType==5||record.workOrdersType==6) {
      window.open(window.location.href.split('#/')[0]+'#/auditManagement/backgroundAudit/details/' + record.companyUuids);
    }
	}
	//同名企业
	renderSameCompany = () => {
	  let list = this.state.sameCompanys;
	  let columns = [
	    {
	      title: '企业名称',
	      dataIndex: 'workOrdersTitle',
	      key: 'workOrdersTitle',
	      width: '45%',
	      render: (text, record, index) => {
	        if (text && text.length >= 14) {
	          return <span title={text}>{text.substring(0, 13)}...</span>
	        }
	        return <span>{text}</span>
	      }
	    },
	    {
	      title: '申请人',
	      dataIndex: 'applicationUserName',
	      key: 'applicationUserName',
	      width: '25%',
	      render: (text, record, index) => {
	        return <span><p title={text}>{text?text.substring(0, 6):''}</p><p>{record.applicationUserPhoneNo}</p></span>
	      }
	    },
	    {
	      title: '状态',
	      dataIndex: 'workOrdersState',
	      key: 'workOrdersState',
	      witdh: 90,
	      render: (text, record) => {
			  let auditTxt = "";
			  if(record.workOrdersType==1 || record.workOrdersType==2){
				  auditTxt = "初审";
			  }else{
				  auditTxt = "复审";
			  }
				if(text == 1 || text == "1"){
					return <span style={{color:'#E96C47'}}>{auditTxt}审核中</span>;
				} else if(text == 2 || text == "2") {
					return <span style={{color:'#4CD91F'}}>{auditTxt}通过</span>;
				} else if(text == 3 || text == "3") {
					return <span style={{color:'#DD2F26'}}>{auditTxt}驳回</span>;
				}
	      }
	    },
	    {
	      title: '操作',
	      dataIndex: 'x',
	      witdh: 80,
	      key: 'x',
	      render: (text, record) => {
	          return <AuthButton elmType="a" onClick={() => { this.handleToDetailsOpen(record) }}>详情</AuthButton>
	      }
	    }
	  ]
	  return <Table key={'table'} size="small" pagination={false} columns={columns} dataSource={this.state.sameCompanys} />
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
	const {plainOptions,
		taxTypeData,
		taxTypeDataDefault
      } = this.state;
	const taxTypes = getFieldProps('taxType', {});
    const isRequired = this.props.form.getFieldValue('approvalResult') == 1 ? true : false;
    const isRequireds = this.props.form.getFieldValue('approvalResult') == 1 ? false : true;
      return (
        <div>
          <Form>
            <Card className="mb10" title={<span><Badge count={1} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 企业信息</span>} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="企业类型">
                    <Input disabled type="text" maxLength='30' style={{color: this.state.color}}
                      {...getFieldProps('memberTxt')}
                      placeholder="请输入企业类型" />
            <Input disabled type="text" style={{display: "none"}} maxLength='30'
              {...getFieldProps('isMember')}
              placeholder="请输入企业类型" />
                  </FormItem>
                  <FormItem {...formItemLayout} label="企业级别">
              <Input disabled type="text" style={{display: "none"}}
                {...getFieldProps('level')}
                placeholder="请输入公司级别" />
            <Input disabled type="text" maxLength='30' style={{color: this.state.color}}
              {...getFieldProps('levelTxt')}
              placeholder="请输入公司级别" />
            </FormItem>
            <FormItem {...formItemLayout} label="上级单位">
              <Input disabled type="text" maxLength='30' style={{color: this.state.color}}
                {...getFieldProps('pname')}
                placeholder="请输入公司名称" />
            </FormItem>
            <FormItem {...formItemLayout} label="公司名称">
                    <Input disabled type="text" maxLength='30' style={{color: this.state.color}}
                      {...getFieldProps('name')}
                      placeholder="请输入公司名称" />
                  </FormItem>
                  <FormItem {...formItemLayout} label="统一社会信用代码">
              <Input disabled type="text" maxLength='20' style={{color: this.state.color}}
                {...getFieldProps('businessLicense',
                  {
                    rules: [
                      {
                        message: "请输入营业执照号"
                      }
                    ]
                  })}
                placeholder="请输入营业执照号" />
            </FormItem>
                </Col>
                <Col span={12}>
                  <BaseWrap companyType={this.state.companyType}/>
                </Col>
              </Row>
        <Row gutter={16} key="address">
          <Col span={12}>
            <FormItem {...formItemLayout} label="机构所在地">
              <Col span={8}>
                <FormItem>
                  <Select disabled={true} style={{color: this.state.color}} {...getFieldProps("provinceCode", {
                    onChange: (value) => (this.getCityList(value))
                  })}>
                    {Util.getOptionList(this.state.provinceList, "provinceCode", "provinceName")}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Select disabled={true} style={{color: this.state.color}} {...getFieldProps("cityCode", {
                    onChange: (value) => (this.getAreaList(value))
                  })}>
                    {Util.getOptionList(this.state.cityList, "cityCode", "cityName")}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Select disabled={true} style={{color: this.state.color}} {...getFieldProps("areaCode", {
                    rules: [
                      { message: '请选择地区' },
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
            <FormItem {...formItemLayout} label="经营地址:">
              <Input disabled={true} style={{color: this.state.color}} type="text" maxLength='50'
                {...getFieldProps('address',
                  {
                    rules: [
                      {
                        message: "请输入公司经营地址"
                      }
                    ]
                  })}
                placeholder="请输入公司经营地址" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("address", "isPass_address", "phrase_address")}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="出口资质">
              <RadioGroup disabled={true} style={{color: this.state.color}}
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
              <Row gutter={16} style={{display: this.state.companyType==1 ? 'block' : 'none'}}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="公司类型">
                    <RadioGroup disabled={true} style={{color: this.state.color}}
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
        <Row gutter={16} key={2}>
          <Col span={12}>
            <FormItem {...otherFormItemLayout} label="执照有效期">
              <Col span={18}>
                <Col span={12}>
                  <FormItem>
                    <DatePicker disabled={true} style={{color: this.state.color}}
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
                      open={this.state.endOpen}
                      toggleOpen={this.handleEndToggle}
                      disabled={true} style={{color: this.state.color}}
                      {...getFieldProps('businessEndTime',
                        {
                          rules: [
                            {
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
                  <Checkbox disabled={true} style={{color: this.state.color}}
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
            <FormItem {...otherFormItemLayout} label="注册资金:">
              <Col span={17}>
                <FormItem>
                  <Input disabled={true} style={{marginRight: '10px',color: this.state.color}} type="text" maxLength='15'
                    {...getFieldProps('registeredCapital')}
                    placeholder="请输入注册资本" addonAfter="万" />
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem>
                  <Checkbox style={{ marginLeft: '10px',color: this.state.color }} disabled={true}
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
        <Row gutter={16} key="companyUrl">
          <Col span={12}>
            <FormItem {...formItemLayout} label="企业官网:">
              <a href={this.state.companyUrl} target="_blank">{this.state.companyUrl?this.state.companyUrl:"-"}</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("companyUrl", "isPass_companyUrl", "phrase_companyUrl")}
          </Col>
        </Row>
        <Row gutter={16} key={"businessLicensePath"}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="营业执照影像:">
          <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.businessLicensePath]))}>点击查看影像</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessLicensePath", "isPass_businessLicensePath", "phrase_businessLicensePath")}
          </Col>
        </Row>
            </Card>
        
        
            <Card className="mb10" title={<span><Badge count={2} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 人员信息</span>} bordered={false}>
        <Row gutter={16} style={{display: "none"}}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="管理员id" >
              <Input type="text" maxLength='50'
                {...getFieldProps('creater_user')}/>
          <Input type="text" maxLength='50'
            {...getFieldProps('type')}/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="管理员姓名">
              <Input type="text" maxLength='50' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('adminName',
                  {
                    rules: [
                      {
                        message: "请输入管理员姓名"
                      }
                    ]
                  })}
                placeholder="请输入管理员姓名" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("userPersonName", "isPass_userPersonName", "phrase_userPersonName")}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="管理员手机号">
              <Input type="text" maxLength='11' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('phoneNo',
                  {
                    rules: [
                      {
                        message: "请输入管理员手机号"
                      }
                    ]
                  })}
                placeholder="请输入管理员手机号" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("userPhone", "isPass_userPhone", "phrase_userPhone")}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="管理员邮箱">
              <Input type="text" maxLength='11' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('adminEmail',
                  {
                    rules: [
                      {
                        message: "请输入管理员邮箱"
                      }
                    ]
                  })}
                placeholder="请输入管理员邮箱" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("userEmail", "isPass_userEmail", "phrase_userEmail")}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="管理员QQ号码">
              <Input type="text" maxLength='11' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('qqNo')}
                placeholder="请输入管理员QQ号码" />
            </FormItem>
          </Col>
        </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="证件类型">
                    <RadioGroup
                      disabled={true} style={{color: this.state.color}}
                      {...getFieldProps('adminCardType')}>
                      <Radio value={1}>身份证</Radio>
                      <Radio value={2}>护照</Radio>
            <Radio value={3}>其它</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span={12}>
                  {this.initAuditModul("userPersonIdType", "isPass_userPersonIdType", "phrase_userPersonIdType")}
                </Col>
              </Row>
        <Row gutter={16} key={"adminCardNo"}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="管理员证件号码:">
              <Input type="text" maxLength='20' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('cardNo')}
                placeholder="请输入管理员证件号码" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("userPersonId", "isPass_userPersonId", "phrase_userPersonId")}
          </Col>
        </Row>
        {this.getUserCardPage(this.state.userCardType)}
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="管理员是企业法人">
              <RadioGroup
                disabled={true} style={{color: this.state.color}}
                {...getFieldProps('legalType')}>
                <Radio value={1}>管理员是企业法人</Radio>
                <Radio value={2}>管理员不是企业法人</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16} style={{display: this.legalType == 1 ? 'none' : ''}}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="证件类型">
              <RadioGroup
                disabled={true} style={{color: this.state.color}}
                {...getFieldProps('legalPersonIdType')}>
                <Radio value={1}>身份证</Radio>
                <Radio value={2}>护照</Radio>
            <Radio value={3}>其它</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("legalPersonIdType", "isPass_legalPersonIdType", "phrase_legalPersonIdType")}
          </Col>
        </Row>
        <Row gutter={16} style={{display: this.legalType == 1 ? 'none' : ''}} key={"legalPersonName"}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="法人姓名:">
              <Input type="text" maxLength='18' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('legalPersonName',
                  {
                    rules: [
                      {
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
              {this.getCardPage(this.state.cardType)}
              
              
            </Card>
            <Card className="mb10" style={{display: this.state.companyType==1 ? 'block' : 'none' }} 
             title={<span><Badge count={3} style={{ backgroundColor: 'rgba(255,129,0,1)'}} /> 财务及税务信息</span>} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="银行基本账号">
                    <Input type="text" maxLength='20' disabled={true} style={{color: this.state.color}}
                      {...getFieldProps('companyBaseAccount',
                        {
                          rules: [
                            {
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
                    <Input type="text" maxLength='20' disabled={true} style={{color: this.state.color}}
                      {...getFieldProps('institutionalBank',
                        {
                          rules: [
                            {
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
			      <FormItem {...formItemLayout} label="纳税人资格属性">
			        <RadioGroup disabled={true} style={{color: this.state.color}}
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
        <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="发票类型">
                    <CheckboxGroup disabled={true} style={{color: this.state.color}}
                      options={taxTypeData}
                      defaultValue={taxTypeDataDefault}
                      {...taxTypes}
                    >
                    </CheckboxGroup>
                  </FormItem>
                </Col>
                <Col span={12}>
                  {this.initAuditModul("taxType", "isPass_taxType", "phrase_taxType")}
                </Col>
              </Row>
              
        <Row gutter={16} style={{display: "none"}}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="开户许可证编号:">
              <Input type="text" maxLength='20' disabled={true} style={{color: this.state.color}}
                {...getFieldProps('accountPermitNumber')}
                placeholder="请输入开户许可证" />
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("accountPermitNumber", "isPass_accountPermitNumber", "phrase_accountPermitNumber")}
          </Col>
        </Row>
        {/* <Row gutter={16} style={{display: "none"}}>
          <Col span={12}>
            <FormItem {...formItemLayout}  label="纳税人证明影像:">
              <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.taxEligibilityPath]))}>点击查看影像</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("taxEligibilityPath", "isPass_taxEligibilityPath", "phrase_taxEligibilityPath")}
          </Col>
        </Row> */}
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemLayout}  label="开户许可证影像:">
              <a href="javascript:void(0);" onClick={() => (this.handleShowImg([this.state.accountPermitPath]))}>点击查看影像</a>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("accountPermitPath", "isPass_accountPermitPath", "phrase_accountPermitPath")}
          </Col>
        </Row>
            </Card>
            <Card className="mb10" title={<span><Badge count={this.state.companyType==1 ? 4 : 3} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 经营信息</span>} bordered={false}>
              <Row gutter={16} key="mainBusiness" style={{display: this.state.companyType==1 ? 'block' : 'none'}}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="主营类目">
                    <Input type="textarea" rows={5} disabled style={{color: this.state.color}}
                      placeholder="-" {...getFieldProps('mainStr')}/>
                  </FormItem>
                </Col>
                <Col span={12}>
                  {this.initAuditModul("mainBusiness", "isPass_mainBusiness", "phrase_mainBusiness")}
                </Col>
              </Row>
              <Row gutter={16} key="remarks">
                <Col span={12}>
                  <FormItem {...formItemLayout}  label="企业简介:">
                    <Input disabled={true} type="textarea" maxLength='1000' rows={5} style={{color: this.state.color}}
                      {...getFieldProps('remarks')}
                      placeholder="请输入企业简介" />
                  </FormItem>
                </Col>
                <Col span={12}>
                  {this.initAuditModul("remarks", "isPass_remarks", "phrase_remarks")}
                </Col>
              </Row>
        <Row gutter={16} key="expertiseArea">
          {/* expertiseArea 专业领域*/}
          <Col span={12}>
            <FormItem {...formItemLayout}
              label="专业领域">
              <CheckboxGroup disabled={true} style={{color: this.state.color}}
                {...getFieldProps('expertiseArea')}
                options={plainOptions}
              >
              </CheckboxGroup>
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("expertiseArea", "isPass_expertiseArea", "phrase_expertiseArea")}
          </Col>
        </Row>
        <Row gutter={16} key="areaArrStr" style={{display: this.state.companyType==1 ? 'block' : 'none'}}>
          <Col span={12}>
          <FormItem {...formItemLayout} label="供货区域">
            <Select disabled={true} style={{color: this.state.color}}
                {...getFieldProps("supplyArea")}
                multiple={true}
                placeholder="请选择供货区域"
            >
                {this.areaOptions()}
            </Select>
          </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("supplyArea", "isPass_supplyArea", "phrase_supplyArea")}
          </Col>
        </Row>
        <Row gutter={16} key="businessBrand" style={{display: this.state.companyType==1 ? 'block' : 'none'}}>
        {/* businessBrand */ }
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='经营品牌'
              // businessBrand
            >
              <div style={{display: "none"}}
                className={less.fullname_wrap}>
                <Input placeholder='请输入经营品牌名称按回车或点击右侧按钮添加' disabled={true} style={{color: this.state.color}}
                  value={this.state.brandVal}
                  onInput={(e) => this.brandInputEvent(e, 'businessBrand')}
                  onPressEnter={e => this.pressEnterEvent(e, 'businessBrand')}/>
                <Button type='primary' htmlType='submit' onClick={() => this.addLabelTags('businessBrand')}>
                  添加
                </Button>
              </div>
              {
                this.state.businessBrand != null ? <div className={less.add_label_wrap} style={{display: this.state.businessBrand.length ? 'block' : 'none'}}>
                {this.state.businessBrand.map(tag => <Tag color='#95d0f7' key={tag.key} >
                    {tag.name}
                  </Tag>
                )}
              </div> : "" 
              }
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessBrand", "isPass_businessBrand", "phrase_businessBrand")}
          </Col>
        </Row>
                        
        <Row gutter={16} key="businessProduct" style={{display: this.state.companyType==1 ? 'block' : 'none'}}>
        { /* businessProduct */ }
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='经营产品'
              >
              <div className={less.fullname_wrap}  style={{display: "none"}}>
                <Input placeholder='请输入经营产品名称按回车或点击右侧按钮添加' disabled={true} style={{color: this.state.color}}
                  value={this.state.productVal}
                  onInput={e => this.brandInputEvent(e, 'businessProduct')}
                  onPressEnter={e => this.pressEnterEvent(e, 'businessProduct')}/>
                  <Tooltip title="产品标签最多添加15个" placement="right">
                    <Button type='primary' htmlType='submit' onClick={() => this.addLabelTags('businessProduct')}>
                        添加
                    </Button>
                  </Tooltip>
              </div> 
              {this.state.businessProduct?<div className={less.add_label_wrap} >
                {this.state.businessProduct.slice(0,15).map(tag => <Tag color='#95d0f7' key={tag.key} >
                  {tag.name}
                </Tag>)}
              </div> : ""}
            </FormItem>
          </Col>
          <Col span={12}>
            {this.initAuditModul("businessProduct", "isPass_businessProduct", "phrase_businessProduct")}
          </Col>
        </Row>
        <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="澄清说明材料">
                    {this.renderClarification()}
                  </FormItem>
                </Col>
                <Col span={12}>
                  {this.initAuditModul("clarification", "isPass_clarification", "phrase_clarification")}
                </Col>
              </Row>
            </Card>
        
        <Card className="mb10" title={<span><Badge count={this.state.companyType==1 ? 5 : 4} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 审核记录</span>} bordered={false}>
          <BaseTable
            notInit={true}
            pagination={false} 
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            url='@/platform/workOrders/getWorkOrdersByCompanyId'
            baseParams={this.state.baseParams}
            columns={this.columns()} />
            
        </Card>
        
            <Card className="mb10" title={<span><Badge count={this.state.companyType==1 ? 6 : 5} style={{ backgroundColor: 'rgba(255,129,0,1)' }} /> 审核信息</span>} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="申请时间">
                    <Input disabled={true} style={{color: this.state.color}}
                      {...getFieldProps('applicationTime')}/>
                  </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label="工单号">
                      <Input disabled={true} style={{color: this.state.color}}
                        {...getFieldProps('workOrdersCode')} />
                    </FormItem>
                </Col>
              </Row>
        <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="申请人姓名">
                    <Input disabled={true} style={{color: this.state.color}}
                      {...getFieldProps('applicationUserName')}/>
                  </FormItem>
                </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="审核人">
              <Input disabled={true} style={{color: this.state.color}} value={this._userInfo?this._userInfo.username:""}/>
            </FormItem>
          </Col>
              </Row>
        <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="申请人手机号">
                    <Input disabled={true} style={{color: this.state.color}}
                      {...getFieldProps('applicationUserPhoneNo')}/>
                  </FormItem>
                </Col>
          <Col span={12}>
          <FormItem {...formItemLayout} label="审核结果">
            <RadioGroup
              {...getFieldProps('approvalResult',
                {
                  initialValue: 1,
                  onChange: () => {
                    this.props.form.resetFields(['remarks'])
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
                  <FormItem {...formItemLayout} label="同名企业">
                    {this.renderSameCompany()}
                  </FormItem>
                </Col>
          <Col span={12}>
          <FormItem {...formItemLayout} label="审核意见">
            <Input type="textarea" required={isRequireds} maxLength='1000' rows={5}
              {...getFieldProps('remark')} />
          </FormItem>
          </Col>
              </Row>
            </Card>
        <ModalForm
          title="图片展示"
          {...this.imgModal}
          visible={this.state.imgModalShow}
          imgList={this.state.imgList}>
        </ModalForm>
            <BaseAffix>
              <Button loading={this.state.loading} style={{ marginRight: "10px" }}
                onClick={this.handleGoBack}>关闭</Button>
              <Button style={{ marginRight: "10px" }} loading={this.state.loading}
                onClick={() => (this.handleSubmit(0))}>保存</Button>
              <Button type="primary"
                loading={this.state.loading}
                onClick={() => (this.handleSubmit(1))}>提交</Button>
        <Button 
          loading={this.state.loading}
          onClick={() => (this.companyInfomation())} style={{float: "right",marginRight: "100px"}}>查看企业资质</Button>
            </BaseAffix>
          </Form>
        </div>
      )
  }
}
export default Form.create()(AuditForBg);