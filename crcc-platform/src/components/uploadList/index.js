import { Upload, Row, Col, Button, Icon, message } from 'antd';

import less from './index.less';

const uploadBaseUrl = "http://localhost:9000";//根上传路径

class UploadList extends React.Component {

  //上传组件的参数
  uploads = () => {
    let propsObj = this.props;
    return {
      action: propsObj.action !== undefined ? uploadBaseUrl + propsObj.action : uploadBaseUrl + '/uploadabc',//必选参数, 上传的地址
      name: propsObj.name !== undefined ? propsObj.name : 'file',//可选参数, 上传的文件
      showUploadList: propsObj.showUploadList !== undefined ? propsObj.showUploadList : false,//可选参数, 是否展示 uploadList, 默认关闭
      data: propsObj.data !== undefined ? propsObj.data : null,//可选参数, 上传所需参数或返回上传参数的方法
      accept: propsObj.accept !== undefined ? propsObj.accept : 'file',//可选参数, 接受上传的文件类型,
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
        {...this.uploads()}
        onChange={this.uploaded}
      >
        <Button type="ghost">
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    )
  }
}
export default UploadList;