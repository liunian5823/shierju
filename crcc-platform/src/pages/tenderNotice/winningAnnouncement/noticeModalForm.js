import {Modal, Form, Select, DatePicker, Row, Col, Button, Icon, Upload, message, Input, Radio } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

import less from './index.less';
class ModalForm extends React.Component {

  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  state = {
    _loading: false,
    modelVisible: false,
    payType: null,   //铁建银信
    bidInfo: {},  //中标公告信息
  }

  componentWillMount() {
    this._isMounted = true;
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

  // 获得数据
  getData = (uuids) => {
    api.ajax('GET', '@/platform/ecBidInfo/queryBidInfoByUuids', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      let fileList = [];
      if(r.data.url && r.data.name){
        let file = {};
        file.url = SystemConfig.systemConfigPath.dfsPathUrl(
            r.data.url
        );
        file.name = r.data.name;
        file.status = 'done';
        file.uid = -1,
        fileList.push(file);
      }
      r.data.bidFile = fileList;
      this.props.form.setFieldsValue(r.data);
      //设置state数据
      this.setState({
        content: r.data.content,
        title: r.data.title,
        showFlag: r.data.showFlag,
        bidNum: r.data.bidNum,
        bidCompanyLicense: r.data.bidCompanyLicense,
        payType: r.data.payType,
        modelVisible: this.props.visible,
      })
    }).catch(r => {
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
    api.ajax(
        'GET',
        '@/purchaser/bidinformation/addBidInfoAndFile',
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
      let fileName = file.name;
      let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
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
          // fileList = fileList.slice(-1);
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

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    return (
      <Modal
        title={this.props.title}
        visible={this.state.modelVisible}
        onOk={this.handelSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.state._loading}
        width={800}
        height={500}
      >
        <Form horizontal>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="标题"
              >
                <span>{this.state.title}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="招标编号"
              >
                <span>{this.state.bidNum}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
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
          <Row gutter={16}>
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
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="付款方式"
                  style={{display: "flex"}}
              >
                <RadioGroup onChange={this.onPayTypeChange} value={this.state.payType}>
                  <Radio key="1" value={"1"}>铁建银信</Radio>
                  <Radio key="2" value={"2"}>现金支付</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
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
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                  {...formItemLayout}
                  label="显示情况"
                  style={{display: "flex"}}
              >
                <RadioGroup onChange={this.onShowFlagChange} value={this.state.showFlag}>
                  <Radio key="a" value={1}>显示</Radio>
                  <Radio key="b" value={0}>不显示(用户端不显示)</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="中标合同"
                style={{marginBottom: "5px"}}
              >
                <Upload
                    {...getFieldProps(`bidFile`, {
                      ...ComponentDefine.upload_.uploadForm
                    })}
                    {...this.uploadPropsMultiple}
                >
                  <Button type="ghost">
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload>
              </FormItem>
              <span style={{marginLeft: "24%"}}></span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <FormItem
                {...formItemLayout}
                label="内容"
              >
                <div className={less.content} dangerouslySetInnerHTML={{__html:this.state.content}}></div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)