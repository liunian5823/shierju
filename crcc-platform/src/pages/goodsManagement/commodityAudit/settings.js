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
      let uuids = "";
      for(let index=0;index<this.props.modeData.length;index++){
        uuids = uuids+this.props.modeData[index].uuids+",";
      }
      uuids = uuids.substring(0,uuids.length-1);
        console.log("统一修改库存/预警值"+uuids);
        let warning = (values.warning === undefined?0:values.warning);
        let amount = (values.amount === undefined?1:values.amount);
        api.ajax("GET", "@/merchandise/ecGoodsSku/updateAmountWarning", {
          warning:warning,
          amount:amount,
          uuids: uuids,
        }).then(r => {
          if (!this._isMounted) { return }
          this.setState({
            _loading: false,
            codeTime: -1
          })
          Util.alert("成功");
          Util.alert(r.msg, { type: "success" })
          this.props.onOk(this._modalName, false, true);
        }).catch(r => {
          Util.alert("失败");
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
              <FormItem label={'库存'}
                        required
                        {...formItemLayout}
              >
                <Row>
                  <Col span={24} className={less.code_box}>
                    <FormItem>
                      <Input
                          type="number"
                          maxLength={9}
                          placeholder={'请输入库存值'}
                          {...getFieldProps('amount', {
                            rules: [
                              {
                                required: false,
                                pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                message: '请输入库存值' },
                            ],
                            getValueFromEvent: (event) => {
                              if(event.target.value < 1)
                                event.target.value = 1;
                              else if(event.target.value > 999999999){
                                event.target.value = 999999999;
                              }
                              return event.target.value.replace(/\D/g,'')
                            },
                            initialValue:1,
                          })}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="22">
              <FormItem label={'预警值'}
                        required
                        {...formItemLayout}
              >
                <Row>
                  <Col span={24} className={less.code_box}>
                    <FormItem>
                      <Input
                          type="number"
                          maxLength={9}
                          placeholder={'请输入库存预警值'}
                          {...getFieldProps('warning', {
                            rules: [
                              {
                                required: false,
                                pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                message: '请输入库存预警值' },
                            ],
                            getValueFromEvent: (event) => {
                              if(event.target.value < 0)
                                event.target.value = 0;
                              else if(event.target.value > 999999999){
                                event.target.value = 999999999;
                              }
                              return event.target.value.replace(/\D/g,'')
                            },
                            initialValue:0,
                          })}
                      />
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