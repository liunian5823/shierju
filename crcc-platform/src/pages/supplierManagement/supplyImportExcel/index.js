import { Card, Form, Modal, Upload, Button, Icon, Row, Col, } from 'antd';
import Util from '@/utils/util';
const FormItem = Form.Item;
class supplierImportExcel extends React.Component{
  _isUpdate = false;
  state = {
    _loading: false,
    fileList: []
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
      return true;
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
            Util.alert('上传失败', { type: "error" })
            this.setState({
                _loading: false
            })
        }
        this.setState({
            fileList: fileList
        })
        this.props.form.setFieldsValue({ filePath: fileList })
    }

  render(){
    const { getFieldProps } = this.props.form;
    return(
      <div>
        <Card bordered={false}>
          <Form horizontal>
            <Upload
                key={'up'}
                disabled={this.state._loading}
                headers={{ 'authorization': window.reduxState.token }}
                action={SystemConfig.configs.axiosUrl + '/supplier/ecCompanyTool/batchNoCheckCompany'}
                fileList={this.state.fileList}
                beforeUpload={this.beforeUpload}
                {...getFieldProps('filePath', {
                  rules: [
                      { required: true, message: '请上传表格' }
                  ],
                  onChange: (info) => {
                      this.uploadProps(info)
                  }
              })}
              >
                <Button type="ghost" key={1} loading={this.state._loading}> <Icon type="upload" /> 点击上传</Button>
                <span style={{ marginLeft: 5 }} key={2}>支持扩展名：.xls,.xlsx</span>
              </Upload>
            </Form>
        </Card>
      </div>
    )
  }
}
export default Form.create({})(supplierImportExcel)