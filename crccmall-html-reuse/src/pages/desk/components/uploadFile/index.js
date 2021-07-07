import { Upload, Button, Icon } from 'antd';

const uploadBaseUrl = SystemConfig.configs.uploadUrl;//根上传路径
const baseAccept = 'image/jpeg,image/png,image/jpg,application/msword,application/vnd.ms-excel,application/pdf'

class UploadFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  //上传组件的参数
  uploads = () => {
    let propsObj = this.props;
    return {
      action: this.props.action || uploadBaseUrl,
      data: this.props.data || null,
      headers: this.props.headers || null,
      fileList: this.props.fileList || [],
      multiple: this.props.multiple || false,
      accept: this.props.accept || baseAccept,
      name: propsObj.name ? propsObj.name : 'file',//可选参数, 上传的文件
      showUploadList: true,//可选参数, 是否展示 uploadList, 默认关闭
    }
  }
  //处理上传状态的变化
  uploaded = (info) => {
    if (info.file.status === "done") {
      //上传成功
      let res = info.file.response;
      this.props.uploadSucFile(res);
    }
  }

  render() {
    return (
      <Upload
        key={'up'}
        {...this.uploads()}
        {...this.props}
        onChange={this.uploaded}
      >
        {this.props.children}
      </Upload>
    )
  }
}
export default UploadFile;
