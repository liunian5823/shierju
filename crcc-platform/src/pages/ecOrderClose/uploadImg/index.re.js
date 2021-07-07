import { Upload, Row, Col, Icon } from 'antd';
import Util from '@/utils/util'
import less from './index.less';

const Dragger = Upload.Dragger;

const uploadBaseUrl = SystemConfig.configs.uploadUrl;//根上传路径

class UploadImg extends React.Component {

  //是否上传图片
  draggerContent = () => {
    let imgUrl = this.props.imgUrl || "";
    let imgOrigin = SystemConfig.configs.resourceUrl;
    if (imgUrl) {
      return (
        <img src={imgOrigin + imgUrl} style={{ width: '100%', height: '120px' }} />
      )
    } else {
      return (<div>
        <Icon type="plus" />
        <p>上传照片</p>
      </div>)
    }
  }

  //上传组件的参数
  darggers = () => {
    let propsObj = this.props;
    return {
      // headers: { "Authorization": window.reduxState.token },
      action: propsObj.action !== undefined ? uploadBaseUrl + propsObj.action : uploadBaseUrl + '/uploadImgChar',//必选参数, 上传的地址
      name: propsObj.name !== undefined ? propsObj.name : 'file',//可选参数, 上传的文件
      showUploadList: propsObj.showUploadList !== undefined ? propsObj.showUploadList : false,//可选参数, 是否展示 uploadList, 默认关闭
      data: propsObj.data !== undefined ? propsObj.data : null,//可选参数, 上传所需参数或返回上传参数的方法
      accept: propsObj.accept !== undefined ? propsObj.accept : 'image/jpeg,image/jpg,image/png',//可选参数, 接受上传的文件类型,
      beforeUpload(file) {
        if (file.size > (1048 * 1048 * 2)) {
          Util.alert('上传的照片不能大于2M，请压缩后上传', { type: "error" })
          return false;
        }
        return true;
      },
    }
  }

  //处理上传状态的变化
  uploaded = (info) => {
    if (info.file.status === "done") {
      //上传成功
      let res = info.file.response;
      this.props.uploadSuccess(res.data, this.props.filename);
    }
  }

  render() {
    let title = this.props.title || '上传图片';
    let dragger_box = (this.props.type && this.props.type == 'head') ? less.head_dragger_box : ''

    return (
      <div className={less.dragger}>
        <Row gutter={16}>
          <Col span={12} className={dragger_box}>
            <div className={less.dragger_wrapper}>
              <Dragger
                {...this.darggers()}
                onChange={this.uploaded}
              >
                {this.draggerContent()}
              </Dragger>
            </div>
          </Col>
          <Col span={12}>
            <div className={less.dragger_tip}>
              <h4 className={less.title}>{title}</h4>
              <p>请上传格式为PNG/JPG文件</p>
              <p>体积小于2MB的图片</p>
              <p>请确认图片各项内容清晰可见以便审核</p>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
export default UploadImg;