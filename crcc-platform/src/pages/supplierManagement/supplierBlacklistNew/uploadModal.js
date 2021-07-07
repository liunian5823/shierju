import { Card, Form, Modal, Upload, Button, Icon } from 'antd';
import Util from '@/utils/util.js';
const FormItem = Form.Item;

class ModalFormComponent extends React.Component {
  _isUpdate = false;
  state = {
    _loading: false,
    fileList: []
  }
  componentDidUpdate() {
    if (this._isUpdate != this.props.visible) {
      this._isUpdate = this.props.visible;
      this.setState({
        fileList: ''
      })
    }
  }
  handleCancel = () => {
    this.props.onCancel();
  }

  //上传前禁止提交
  beforeUpload = (file) => {
    const isXls = file.type === 'application/x-excel';
    const isXlss = file.type === 'application/vnd.ms-excel';
    const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isXls && !isXlss && !isXlsx) {
      Util.alert('请上传xls/xlsx格式的文件', { type: "error" })
      return false;
    }
    if (file.size > (1048 * 1048 * 2)) {
      Util.alert('上传的文件不能大于2M，请拆分后上传', { type: "error" })
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
    console.log(info)
    let fileList = info.fileList;
    if (info.file.status === 'done') {
      // let isSuccess = true;
      // if (isSuccess) {
    fileList = fileList.slice(-1);
      // } else {
      //   fileList = fileList.slice(0, fileList.length - 1);
      // }
      this.setState({
        _loading: false
      })
      if(info.file.response.code == "200"){
        Util.alert('导入成功', { type: 'success' })
      }else{
        Util.alert(info.file.response.msg, { type: 'error' })
      }
      this.props.onCancel();
    } else if (info.file.status === 'error') {
      this.setState({
        _loading: false
      })
      Util.alert('导入失败', { type: 'error' })
      this.props.onCancel();
    }
    this.setState({
      fileList: fileList
    })
    this.props.form.setFieldsValue({ upload: fileList })
  }
  //导出
  handleToExport = () => {
    window.open(
      window.location.origin +
      '/api' +
      '/platform/blacklist/company/downBlackListFile'
    )
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { span: 22 },
    }
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        title='导入黑名单'
        confirmLoading={this.props.confirmLoading}
        wrapClassName="vertical-center-modal"
        visible={this.props.visible}
        onCancel={this.handleCancel}
        footer={<span></span>}>
        <Card bordered={false}>
          <Form>
            <FormItem {...formItemLayout}>
              <Upload
                key={'up'}
                disabled={this.state._loading}
                {...ComponentDefine.upload_suntray.uploadProps}
                headers={{ 'authorization': window.reduxState.token }}
                action={SystemConfig.configs.axiosUrl + '/platform/blacklist/company/platBatchBackCompany'}
                fileList={this.state.fileList}
                beforeUpload={this.beforeUpload}
                {...getFieldProps('upload', {
                  rules: [
                    {
                      required: true,
                      message: '请上传黑名单'
                    }
                  ],
                  onChange: (info) => {
                    this.uploadProps(info)
                  }
                })}>
                <Button type="ghost" key={1} loading={this.state._loading}> <Icon type="upload" /> 点击上传</Button>
                <span style={{ marginLeft: 5 }} key={2}>支持扩展名：.xls,.xlsx</span>
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout}>
              还没有模板？请点击此处下载<a href='javascript:void(0);' onClick={this.handleToExport}>铁建商城企业黑名单模板.xlsx</a>
            </FormItem>
          </Form>
        </Card>
      </Modal>
    )
  }
}

export default Form.create()(ModalFormComponent);