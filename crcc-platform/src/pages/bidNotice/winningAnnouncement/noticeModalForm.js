import {Modal, Form, Select, DatePicker, Row, Col, Button, Icon, Upload, message, Input, Radio } from 'antd';
import WangEditor from "@/components/editor/WangEditor";
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import less from './index.less';
class ModalForm extends React.Component {

  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  state = {
    _loading: false,
    modelVisible: false,
    payType: null,   //铁建银信
    bidInfo: {},  //中标公告信息
    orgList:[],   //当前中标公告发布人的公司项目部列表
    ownCompanyList:[],  //内部单位列表
    createCompany: null,    //创建公司ID
    orgUuids: null,       //创建公司项目部uuids
    showFlagDisabled: false,    //显示控制
    content: '',    //富文本内容
    fileList1:[],    //用户文件列表
    fileList:[],    //后台上传文件列表
  }

  componentWillMount() {
    this._isMounted = true;
    this.getOwnCompanyList();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate() {
    if (this.visible != this.props.visible) {
      this.visible = this.props.visible;
      if (!this.props.visible) {
        // 重置数据
        this.props.form.resetFields();
        return
      }
      //父组件传递的数据发生变化
      
      //如果是修改加载数据
      if (this.props.uuids) {
        this.getData(this.props.uuids)
      }
    }
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

  // 获得数据
  getData = (uuids) => {
    api.ajax('GET', '@/platform/ecBidInfo/queryBidInfoByUuidsTwo', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }

      let fileList1 = [];
      let fileList2 = [];
      let _data = r.data.data;
      let _orgList = r.data.orgList;
      if(_data.fileList && _data.fileList.length > 0){
        for (let i = 0; i < _data.fileList.length; i++) {
          let file = {};
          let _file = _data.fileList[i];
          file.url = SystemConfig.systemConfigPath.dfsPathUrl( _file.url );
          file.name = _file.name;
          file.status = 'done';
          file.uid = _file.id;
          if (_file.foreign_type == 3)
            fileList2.push(file);
          else
            fileList1.push(file);
        }
      }
      _data.bidFile = fileList2;
      this.props.form.setFieldsValue(_data);
      //设置state数据
      this.setState({
        showFlag: _data.showFlag,
        showFlagDisabled: _data.reportFlag == '2' ? true : false,
        payType: _data.payType,
        createCompany: _data.createCompany,
        orgUuids: _data.orgUuids,
        modelVisible: this.props.visible,
        orgList: _orgList,
        bidInfo: _data,
        fileList1: fileList1,
        fileList: fileList2
      })
    }).catch(r => {
      console.log('queryBidInfoByUuids  catch --------------- ', r)
    })
  }

  //ok
  handelSubmit = () => {
    let count = 0;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        count ++;
        message.warning('请完善表单内容');
        return;
      }
      if(count > 0)return;
      let _this = this;
      confirm({
        title: '确认保存吗？',
        onOk() {
          _this.toSubmit(values);
        },
        onCancel() {
          Util.alert('已取消操作');
        },
      });
    })
  }

  toSubmit = (values) => {
    let {bidInfo, content} = this.state;
    const params = {};  //提交参数
    const uuids = this.props.uuids || '';
    /*this.setState({
      _loading: true
    })*/
    //处理下文件
    let formData = this.props.form.getFieldsValue();
    params.uuids = this.props.uuids;
    params.bidCompany = formData.bidCompany;
    params.money = formData.money;
    params.showFlag = this.state.showFlag;
    params.payType = this.state.payType;
    params.bidCompanyLicense = formData.bidCompanyLicense;
    let file = {};
    if(formData.bidFile){
      formData.bidFile.forEach(item => {
        let str = '';
        if(item.response){
           str = item.response.data;
          if(str.indexOf("?")!= -1) {
            str = str.split("?")[0];
          }
        }else{
          str = item.url;
        }
        file.fileName = item.name;
        file.url = str;
      });
    }
    params.file = file;
    if (bidInfo.reportFlag == 2){
      params.createCompany = formData.createCompany;
      params.orgUuids = formData.orgUuids;
      params.content = content;
      params.title = formData.title;
      params.bidNum = formData.bidNum;
    }
    //添加公司和项目部,内容


    api.ajax(
        'GET',
        '@/purchaser/bidinformation/addBidInfoAndFileTwo',
        params
     ).then(r => {
      this.setState({
        _loading: false
      })
      Util.alert(r.msg, { type: 'success' })
      this.setState({
        modelVisible: false
      })
      this.props.onOk(false, 'success');
    }).catch(r => {
      this.setState({
        _loading: false
      })
      Util.alert(r.msg, { type: 'error' })
    })
  }

  //cancle
  handelCancle = () => {
    this.setState({
      modelVisible: false
    })
    this.props.form.resetFields();
    this.props.onOk(false);
  }

  //中标合同上传
  //上传
  uploadPropsMultiple = {
    ...ComponentDefine.upload_.uploadLimitSize(50),
    beforeUpload(file) {
      /*const fileType = [
        "doc",
        "docx",
        "pdf",
        "jpg",
        "png"
      ];*/
      // let fileName = file.name;
      // let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
      /*if (!fileType.includes(filePix)) {
        message.error("只能上传doc、docx、pdf、docx、jpg、png类型的文件");
        return false;
      }*/
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
        if (info.file.response.code == '000000') {
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
          fileList = fileList.slice(-1);    //只保存最后一个文件
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
      this.setState({
        fileList
      })
      this.props.form.setFieldsValue({ bidFile: fileList });
    }
  };

  //显示
  onShowFlagChange = (e) => {
     this.setState({
       showFlag: e.target.value
     })
  }

  //付款方式
  onPayTypeChange = (e) => {
    this.setState({
      payType: e.target.value
    })
  }

  //通过公司ID查询当前公司下的部门列表
  queryCompanyOrg = (companyId) => {
    api.ajax(
        'GET',
        '@/supplier/ecCompanySupplier/queryCompanyOrg?companyId=' + companyId,
        {}
    ).then(r=>{
      this.setState({
        orgList: r.data,
        orgUuids: ''
      })
    }).catch(r=>{
      Util.alert("查询公司下的项目部失败,请联系开发人员(zbc)！", {type: 'error'});
    })
  }

  //项目部变更
  handleOrgChange = (v) => {
    this.setState({
      orgUuids: v
    })
  }

  //富文本编辑器变更事件
  editChange = html => {
    this.setState({
      content: html
    });
  };

  //
  showContentText=()=>{
    let {bidInfo} = this.state;
    let _this = this;
    if (bidInfo && bidInfo.reportFlag && bidInfo.reportFlag == '2'){
      return (
          <div style={{ width: "700px" }}>
            <WangEditor
                initHtml={bidInfo.content}
                onChange={_this.editChange}
            />
          </div>
      )
    }else {
        return (
            <div className={less.content} dangerouslySetInnerHTML={{__html:bidInfo.content}}></div>
        )
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    let {bidInfo, orgList, showFlag, payType, ownCompanyList, createCompany, orgUuids, showFlagDisabled, fileList1, fileList} = this.state;
    return (
      <Modal
        title={this.props.title}
        visible={this.state.modelVisible}
        onOk={this.handelSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.state._loading}
        width={1200}
        height={500}
      >
        <Form horizontal>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="发布方"
              >
                <span>{bidInfo.reportFlag == '2' ? '平台' : '用户'}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="标题"
              >
                {
                  bidInfo.reportFlag == '2'
                      ?
                      <Input
                          maxLength={100}
                          {...getFieldProps(`title`, {
                            rules: [{ required: true, message: "请输入公告名称" }]
                          })}
                      />
                      :
                      <span>{bidInfo.title}</span>
                }

              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="招标编号"
              >
                {
                  bidInfo.reportFlag == '2'
                      ?
                      <Input
                          maxLength={50}
                          {...getFieldProps(`bidNum`, {
                            rules: [{ required: true, message: "请输入招标编号" }]
                          })}
                      />
                      :
                      <span>{bidInfo.bidNum}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="招标方公司"
              >
                <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无匹配结果"
                    placeholder='请选择招标方公司'
                    defaultValue={createCompany}
                    disabled={bidInfo.reportFlag == '2'? false: true}
                    {...getFieldProps("createCompany", {
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
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="招标方项目部"
              >
                <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无匹配结果"
                    placeholder='请选择项目部'
                    disabled={bidInfo.reportFlag == '2'? false: true}
                    value={orgUuids}
                    {...getFieldProps("orgUuids",{
                      onChange: (value) => (this.handleOrgChange(value))
                    })}
                >
                  {
                    orgList.map((item, index)=>{
                      return (
                          <Option key={index} value={item.uuids}>{item.orgName}</Option>
                      )
                    })
                  }
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="中标供应商"
              >
                <Input
                  maxLength={100}
                  {...getFieldProps('bidCompany', {})}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="中标供应商统一社会信用代码"
              >
                <Input
                    maxLength={100}
                    {...getFieldProps('bidCompanyLicense', {})}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="付款方式"
                  style={{display: "flex"}}
              >
                <RadioGroup onChange={this.onPayTypeChange} value={payType}>
                  <Radio key="1" value={"1"}>铁建银信</Radio>
                  <Radio key="2" value={"2"}>现金支付</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="中标金额"
                style={{display: "flex"}}
              >
                <Input
                  maxLength={11}
                  style={{width: "94%"}}
                  {...getFieldProps('money', {
                    rules: [
                      { required: true, message: '请输入中标金额' },
                      { pattern: /^[1-9]\d{0,9}(\.\d{1,2})?$|^0(\.\d{1,2})?$/, message: '请输入0~9999999999.999范围的中标金额' },
                    ],
                  })}
                /><span style={{position: "absolute",right: "0"}}>元</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="显示情况"
                  style={{display: "flex"}}
              >
                <RadioGroup onChange={this.onShowFlagChange} value={showFlag} disabled={showFlagDisabled}>
                  <Radio key="a" value={1}>显示</Radio>
                  <Radio key="b" value={0}>不显示(用户端不显示)</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="中标合同"
                style={{marginBottom: "5px"}}
              >
                <Upload
                    fileList={fileList}
                    {...getFieldProps(`bidFile`, {
                      ...ComponentDefine.upload_.uploadForm
                    })}
                    {...this.uploadPropsMultiple}
                >
                  <Button type="ghost">
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload>
                {
                  fileList1.map(item => {
                    return <a href={SystemConfig.configs.resourceUrl + item.url} style={{marginLeft:"8px",color:"#2db7f5"}} download={item.name}>{item.name}</a>
                  })
                }
              </FormItem>
              <span style={{marginLeft: "24%"}}></span>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="内容"
              >
                {this.showContentText()}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)