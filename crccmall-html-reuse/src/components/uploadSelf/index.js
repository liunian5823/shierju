import { Card, Upload, Row, Col, message } from 'antd';

import less from './index.less';

// import valueAddedTax from './valueAddedTax.png';
// import originalPermitForOpeningAnAccount from './originalPermitForOpeningAnAccount.png';
// import taxRegistrationCertificate from './taxRegistrationCertificate.png';
// import organizationCode from './organizationCode.png';
// import frontOfIdentityCard from './frontOfIdentityCard.png';
// import theReverseSideOfIdentityCard from './theReverseSideOfIdentityCard.png';

const Dragger = Upload.Dragger;

class UploadSelf extends React.Component{
  state = {
    display: 'none',
    bgImg: ''
  }
  // 0：增值税 1: 开户许可证原件 2: 税务登记证 3: 组织机构代码 4: 身份证正面 5: 身份证反面 
  imgList = ['valueAddedTax','originalPermitForOpeningAnAccount','taxRegistrationCertificate','organizationCode','frontOfIdentityCard','theReverseSideOfIdentityCard']
  imgSrc = require('./frontOfIdentityCard.png');
  componentWillMount(){
    this.props.uploadParameter.props.onChange=this.onChange(this.props.uploadParameter.IDUploadSuccess,this.props.uploadParameter.IDUploadFail)
    this.imgSrc = require(`./${this.imgList[this.props.uploadParameter.imgType]}.png`);
  }
  onChange = (success, fail) => {
    // this.props.onChange(success, fail);
    return (info) => {
      if(info.file.status !== 'uploading'){
      }
      if(info.file.status === "done"){
        message.success("上传成功！")
        this.setState = ({
          display: 'block',
          bgImg: require('./frontOfIdentityCard.png')
        })
        success(info);
      } else if(info.file.status === "error"){
        message.error("上传失败！" + info.response.msg);
        fail(info);
      }
    }
  }
  render(){
    return(
      <Dragger {...this.props.uploadParameter.props}>
        <div style={{padding: '40px 0', position: 'relative'}}>
          <Row gutter={16}>
            <Col span={24} className={less.iconBox}>
              <i className={less.icon} style={{backgroundImage: "url("+this.imgSrc+")"}}></i>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <p className={less.uploadTitle}>{this.props.uploadParameter.title}</p>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <p className={less.uploadRemark}>请上传格式为PNG|JPG文件体积小于2MB的图片</p>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <p className={less.uploadRemark}>请确认图片各项内容清晰可见以便审核</p>
            </Col>
          </Row>
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0', left: '0'}}>
            <img src={this.state.bgImg} style={{width: '100%', height: '100%', display: this.state.display}}></img>
          </div>
        </div>
      </Dragger>
    )
  }
}
export default UploadSelf;