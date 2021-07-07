import { Modal, Form, Input, Row, Col, Button } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import less from './index.less'

const FormItem = Form.Item;
class ModalForm extends React.Component {
  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  _visible = false
  _modalName = 'ModalSettings'
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
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      this.setState({
        _loading: true
      })
      values.warning = values.warning === undefined ? 0 : values.warning;
      //循环赋值
      let uuids = [];
      if(this.props.modeSingleData && this.props.modeSingleData["uuids"]!=undefined){
        uuids[0] = this.props.modeSingleData.uuids;
      }else{
        for(let index=0;index<this.props.modeData.length;index++){
          uuids[uuids.length] = this.props.modeData[index].uuids;
        }
      }

        let illegalShelfReason = (values.illegalShelfReason === undefined?"":values.illegalShelfReason);
        api.ajax("POST", "@/merchandise/ecGoods/updateGoodsTypeByModel", {
          illegalShelfReason:illegalShelfReason,
          status:3,
          uuidsArr: uuids,
        }).then(r => {
          if (!this._isMounted) { return }
          this.setState({
            _loading: false,
            codeTime: -1
          })
          // Util.alert("成功");
          Util.alert(r.msg, { type: "success" })
          this.props.onOk(this._modalName, false, true);
        }).catch(r => {
          // Util.alert("失败");
          Util.alert(r.msg, { type: "error" })
          this.setState({
            _loading: false
          })
        })

    });
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
          <Row gutter={16}>
            <Col span="22">
              <FormItem label={'违规下架理由'}
                        required
                        {...formItemLayout}
              >
                <Row>
                  <Col span={24}>
                    <FormItem>
                      <Input maxLength={300} {...getFieldProps('illegalShelfReason', {
                        rules: [
                          { required: true, message: '请输入违规下架理由' },
                          { pattern: /^[\s\S]*.*[^\s][\s\S]*$/, message: '请输入违规下架理由'},
                        ],
                      })} type="textarea" placeholder="请输入违规下架理由" autosize={{ minRows: 2, maxRows: 6 }} />
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)