import { Form, Modal } from 'antd';

class ModalFormComponent extends React.Component{

  initImgList = () => {
    let imgArray = this.props.imgList;
    let htmlArray = [];
	if(imgArray){
		imgArray.forEach((o,i)=>{
		  let img = <img src={o} style={{width: '100%'}} key={i}></img>
		  htmlArray.push(img);
		})
	}
    return htmlArray;
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  render() {
    return(
      <Modal
      title={this.props.title}
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      onCancel={this.handleCancel}
      footer={(<span></span>)}>
        {this.initImgList()}
      </Modal>
    )
  }
}

export default Form.create()(ModalFormComponent);