import { Upload, Row, Col, Icon, Tooltip } from 'antd';
import Util from '@/utils/util'
import less from './index.less';
import Album from 'uxcore-album';
import 'uxcore/assets/iconfont.css';
import 'uxcore/assets/orange.css';

const { Photo } = Album;

const uploadBaseUrl = SystemConfig.configs.uploadUrl;//根上传路径

class UploadImg extends React.Component {

  _uid = -1
  _imgUrl = ''

  state = {
    imgList: [],
  }

  getImgOrgin = () => {
    let imgOrigin = SystemConfig.configs.resourceUrl;
    return imgOrigin
  }
  componentDidMount(){
    if(this.props.boxStyle)
      $("div#uploadBox").css(this.props.boxStyle);
    if(this.props.uploadTxtStyle)
      $("div#uploadTxt").css(this.props.uploadTxtStyle);
    if(this.props.uploadImgDivStyle)
      $("div#uploadImgDiv").css(this.props.uploadImgDivStyle);

  }
  componentWillReceiveProps(nextProps) {
    this._uid++;
    if (this._imgUrl != nextProps.imgUrl) {
      this._imgUrl = nextProps.imgUrl
      if (nextProps.imgUrl) {
        let imgObj = {
          uid: this._uid,
          name: 'xxx' + this._uid,
          status: 'done',
          url: nextProps.imgUrl,
          thumbUrl: this.getImgOrgin() + nextProps.imgUrl
        }
        this.setState({
          imgList: [imgObj]
        })
      } else {
        this.setState({
          imgList: []
        })
      }
    }
  }

  handleShowImg = (url) => {
    let baseUrl = this.getImgOrgin();

    // Album.show({
    //   photos: [
    //     <Photo
    //       src={baseUrl + url}
    //       key={0}
    //     />,
    //   ],
    // });

    Album.show({ photos: [
           <Photo
             src={baseUrl + url}
             key={0}
           />,
         ],showButton:true});
    }

  renderUpload = () => {
    let propsObj = this.props;
    let title = this.props.title || '上传图片';
    let dragger_box = (this.props.type && this.props.type == 'head') ? less.head_dragger_box : '';

    if (this.props.disabled) {
      let img = this.props.imgUrl ? <img src={this.getImgOrgin() + this.props.imgUrl} alt="" onClick={() => { this.handleShowImg(this.props.imgUrl) }} title="点击查看大图" /> : null;
      return (
        <Row gutter={16}>
          <Col span={20} offset={2} className={dragger_box}>
            <div className={[less.dragger_wrapper, less.dragger_height].join(' ')} id={"uploadBox"}>
              <div className={less.combox}>
                <a href="javascript:void(0)" className={less.combox_content}>
                  {img}
                </a>
              </div>
            </div>
          </Col>
          <Col span={20} offset={2} style={{ textAlign: 'center' }} id={"uploadTxt"}>
            {title}
          </Col>
        </Row>
      )
    }
    let defaultFileList = this.state.imgList;
    const props = {
      action: propsObj.action !== undefined ? uploadBaseUrl + propsObj.action : uploadBaseUrl + '/uploadImgChar',//必选参数, 上传的地址
      name: propsObj.name !== undefined ? propsObj.name : 'file',//可选参数, 上传的文件
      data: propsObj.data !== undefined ? propsObj.data : null,//可选参数, 上传所需参数或返回上传参数的方法
      beforeUpload(file) {
        const isPNG = file.type === 'image/png';
        const isJPEG = file.type === 'image/jpeg';
        const isJPG = file.type === 'image/jpg';
        if (!isJPEG && !isPNG && !isJPG) {
          Util.alert('请上传png/jpg格式的图片', { type: "error" })
          return false;
        }
        if (file.size > (1048 * 1048 * 2)) {
          Util.alert('上传的照片不能大于2M，请压缩后上传', { type: "error" })
          return false;
        }
        return true;
      },
      accept: propsObj.accept !== undefined ? propsObj.accept : 'image/jpeg,image/jpg,image/png',//可选参数, 接受上传的文件类型,
      listType: 'picture-card',
      defaultFileList: [],
      fileList: defaultFileList,
      onChange: (info) => {
        if (info.file.status === "uploading") {
          this.setState({
            imgList: [info.file]
          })
        } else if (info.file.status === "done") {
          //上传成功

          let res = info.file.response;
          this.props.uploadSuccess(res.data, this.props.filename);
        } else {
          this.props.uploadSuccess('', this.props.filename);
        }
      },
      onPreview: (file) => {
        this.handleShowImg(file.url)
      },
      onRemove: () => {
        this.props.uploadSuccess('', this.props.filename);
      }
    };

    return (
      <Row gutter={16}>
        <Col span={12} className={dragger_box}>
          <div className={less.dragger_wrapper}>
            <Upload {...props}>
              <Icon type="plus" />
              <div className="ant-upload-text">上传照片</div>
            </Upload>
          </div>
        </Col>
        <Col span={12}>
          <div className={less.dragger_tip}>
            <h4 className={less.title}>
              {title}
              {this.renderTooltip()}
            </h4>
            <p>请上传格式为PNG/JPG文件</p>
            <p>体积小于2MB的图片</p>
            <p>请确认图片各项内容清晰可见以便审核</p>
          </div>
        </Col>
      </Row>
    )
  }

  renderTooltip = () => {
    let tooltip = this.props.tooltip;
    if (tooltip) {
      return <Tooltip
        placement="top"
        style={{ color: '#ccc' }}
        title={tooltip}
      >
        <Icon type="question-circle-o"/>
      </Tooltip>
    } else {
      return null
    }
  }

  render() {
    let otherLength = this.props.disabled ? less.padding_none : '';
    return (
      <div className={[less.dragger, otherLength].join(' ')} id={"uploadImgDiv"}>
        {this.renderUpload()}
      </div>
    )
  }
}
export default UploadImg;