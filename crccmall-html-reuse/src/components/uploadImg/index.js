import { Upload, Row, Col, Icon, Tooltip } from 'antd';
import Util from '@/utils/util'
import less from './index.less';
import Album from 'uxcore-album';

const { Photo } = Album;

const uploadBaseUrl = SystemConfig.configs.uploadUrl;//根上传路径

class UploadImg extends React.Component {

  _uid = -1
  _imgUrl = ''

  state = {
    imgList: [],
    showNum:0,
  }
  handleCancel() {
    this.setState({
      priviewVisible: false,
    });
  }
  getImgOrgin = () => {
    let imgOrigin = SystemConfig.configs.resourceUrl;
    return imgOrigin
  }
    //添加是为解决店铺banner回显弹窗图片不显示问题
    componentWillMount(nextProps) {
      nextProps = this.props;
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

    Album.show({
      photos: [
        <Photo
          src={baseUrl + url}
          key={0}
        />,
      ],
    });
  }

  renderUpload = () => {
    if (this.props.disabled) {
      let img = this.props.imgUrl ? <img src={this.getImgOrgin() + this.props.imgUrl} alt="" onClick={() => { this.handleShowImg(this.props.imgUrl) }} /> : null;
      return (
        <div className={less.combox}>
          <a href="javascript:void(0)" className={less.combox_content}>
            {img}
          </a>
        </div>
      )
    }
    let defaultFileList = this.state.imgList;
    let propsObj = this.props;
    let _tempUrl = '/uploadImgChar';
    if(this.props.uploadPath){
      _tempUrl = '/uploadImg';
    }
    if(this.props.noWatermark){//无水印
      _tempUrl = '/uploadImgNoWatermark';
    }
    let picSize = '2MB';
    let picNum = 1024 * 1024 * 2;
    if(this.props.photoSize){   //photoSize 传入参数单位为 M
      picSize = this.props.photoSize;
      if(picSize.indexOf('KB') > -1){
        picNum = (picSize.substring(0, picSize.length - 2) / 1000) * 1024 * 1024;
      }else{
        picNum = picSize.substring(0, picSize.length - 2) * 1024 * 1024;
      }
    }
    const props = {
      //action: propsObj.action !== undefined ? uploadBaseUrl + propsObj.action : uploadBaseUrl + _tempUrl,//必选参数, 上传的地址
      action: "/api/common/upload/file" ,//必选参数, 上传的地址
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
        if (file.size > (picNum)) {
          Util.alert('上传的照片不能大于'+picSize+'，请压缩后上传', { type: "error" })
          return false;
        }
        return true;
      },
      accept: propsObj.accept !== undefined ? propsObj.accept : 'image/jpeg,image/jpg,image/png',//可选参数, 接受上传的文件类型,
      listType: 'picture-card',
      //multiple: true,//批量上传
      //defaultFileList: [],
      //fileList: this.state.imgList,
      onChange: (info) => {
        if (info.file.status === "uploading") {
          // this.setState({
          //   imgList: info.fileList
          // })
        } else if (info.file.status === "done") {
          //上传成功
          // this.setState({
          //   imgList: info.fileList
          // })
          //let res = info.file.response;
          info.fileList.map((el)=>{
            let s = el.response.data
            //el.url = s.indexOf("?")>-1 ? s.substr(0,s.indexOf("?")): s
            el.url = s
          })
          let imgarr = []
          imgarr = info.fileList.map((el)=>{
            return el.url
          })
          this.props.uploadSuccess(imgarr);
        }else if(info.file.status === "removed"){
          let imgarr = []
          imgarr = info.fileList.map((el)=>{
            return el.url
          })
          this.props.uploadSuccess(imgarr);
        }
        //  else {
        //   this.props.uploadSuccess(info.fileList, this.props.filename);
        // }
        this.hideUpIT(info.fileList ? info.fileList.length : 0);
      },
      onPreview: (file) => {
        this.handleShowImg(file.url)
        // this.setState({
        //   priviewImage: file.response.data,
        //   priviewVisible: true,
        // });
      },
    };

    return (
      <Upload {...props}>
        <Icon type="plus" className={less.plus} id={"uploadI"}/>
        <div className="ant-upload-text" className={less.uploadtitle}>上传照片</div>
      </Upload>
    )
  }
  // imagefilter =(e) =>{
  //   let {imgList} = this.state
  //   let arr = []
  //   arr = imgList.map((el)=>{
  //     if(el.response.data != e.response.data){
  //       return el
  //     }
  //   })
  //   this.setState({
  //     imgList: arr
  //   },()=>{
  //     this.hideUpIT();
  //   })
  // }
  renderTooltip = () => {
    let tooltip = this.props.tooltip;
    if (tooltip) {
      return <Tooltip
        placement="top"
        style={{ color: '#ccc' }}
        title={tooltip}
      >
        <Icon type="question-circle-o" />
      </Tooltip>
    } else {
      return null
    }
  }
  componentDidMount(){
    this.hideUpIT();
  }

  /**
   * 控制上传文件的加号和文字的显示
   */
  hideUpIT = (n) => {
    if(n >= 5){
      $("#uploadI").parent().parent().hide();
    }else{
      $("#uploadI").parent().parent().show();
    }
      // let timesRun = 0;
      // let interval = setInterval(
      //     () => {
      //       timesRun += 1;
      //       if(timesRun === 2){
      //         clearInterval(interval);
      //       }
      //       if($("div#uploadBox") && $("div#uploadBox").find("img")){
      //         var boxLen = $("div#uploadBox").length;
      //         for(let i=0;i<boxLen;i++){
      //           var box = $("div#uploadBox")[i];
      //           $(box).find(".ant-upload.ant-upload-select-picture-card").css({"margin-right":"0px"});
      //           if($(box).find("img").length > 0){
      //             $(box).find("#uploadI").hide();//.css({display:"none"});
      //             $(box).find("#uploadT").hide();//.css({display:"none"});
      //           }else {
      //             $(box).find("#uploadI").show();//.css({display:"block"});
      //             $(box).find("#uploadT").show();//.css({display:"block"});
      //           }
      //         }
      //       }
      //     },
      //     800
      // );
  }
  render() {
    let propsObj = this.props;
    let title = this.props.title || '上传图片';
    let dragger_box = (this.props.type && this.props.type == 'head') ? less.head_dragger_box : '';
    let importTip = this.props.importTip ? <p className={less.important_color} dangerouslySetInnerHTML={{ __html: this.props.importTip.replace(/\|/g, '<br/>') }} /> : <p>请确认图片各项内容清晰以便审核</p>;
    let custom_hide = this.props.custom_hide;
    return (
      <div className={less.dragger}>
        <Row gutter={16}>
          <Col span={custom_hide==true ? 24 : 12} className={dragger_box}>
            <div id={"uploadBox"} className={less.dragger_wrapper} style={this.props.boxsize?this.props.boxsize:{}} >
              {this.renderUpload()}
            </div>
          </Col>
          <Col span={12} className={custom_hide==true?less.custom_hide:less.custom_show}>
            <div className={less.dragger_tip}>
              <h4 className={less.title}>
                {title}
                {this.renderTooltip()}
              </h4>
              <p>请上传格式为PNG/JPG文件</p>
              <p>体积小于{propsObj.photoSize == undefined?'2MB':propsObj.photoSize}的图片</p>
              {importTip}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
export default UploadImg;
