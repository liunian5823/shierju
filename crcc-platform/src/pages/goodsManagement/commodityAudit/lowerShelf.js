import { Modal, Form, Input, Row, Col, Button } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import less from './index.less'

const FormItem = Form.Item;

class ModalForm extends React.Component {
  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  _visible = false
  _modalName = 'ModalLowerShelf'
  _email = ''

  state = {
    _loading: false,
    codeLoading: false,
    codeTime: -1,
  }

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillUpdate() {
    this._visible = this.props.visible
  }

  componentDidUpdate() {
    if (this._visible != this.props.visible) {
      this.props.form.resetFields();
    }
  }



  handelSubmit = () => {
      //直接ajax提交
    // let erlen = 0;
    let uuids = [];

    for(let index=0;index<this.props.modeData.length;index++) {
      console.log(this.props.modeData[index]);
      uuids[index] = this.props.modeData[index].uuids;
    }
    console.log(uuids);
      api.ajax("POST", "@/merchandise/ecGoods/updateGoodsTypeByModel", {
        // uuids:this.props.modeData[0].uuids,
        uuidsArr:uuids,
        status:1,
        companyId:this.props._userInfo.companyId,

      }).then(r => {
        if (!this._isMounted) { return }
        this.setState({
          _loading: false,
          codeTime: -1
        })

        Util.alert(r.msg, { type: "success" })
        this.props.onOk(this._modalName, false, true);
      }).catch(r => {
        this.props.onOk(this._modalName, false, true);
        Util.alert(r.msg, { type: "error" })
        this.setState({
          _loading: false
        })
        // erlen = erlen + 1;
      })

    // if(erlen != 0 && erlen == this.props.modeData.length){
    //   Util.alert("全部更新失败");
    //   this.props.onOk(this._modalName, false, true);
    // }
    // else if(erlen == 0){
    //   Util.alert("全部更新成功");
    //   this.props.onOk(this._modalName, false, true);
    // }
    // else {
    //   Util.alert("部分更新成功");
    //   this.props.onOk(this._modalName, false, true);
    // }
  }

  handelCancle = () => {
    this.props.form.resetFields();
    this.props.onOk(this._modalName);
  }



  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
        <Modal
            title={this.props.title}
            visible={this.props.visible}
            onOk={this.handelSubmit}
            onCancel={this.handelCancle}
            confirmLoading={this.state._loading}
        >
          <Form horizontal>
            <span>确定下架？</span>
          </Form>
        </Modal>
    )
  }
}
export default Form.create({})(ModalForm)