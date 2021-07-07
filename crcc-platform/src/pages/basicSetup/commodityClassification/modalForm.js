import { Form, Select, Modal, InputNumber, Switch } from 'antd';
import Util from '@/utils/util';
import Input from '@/components/baseInput';

const FormItem = Form.Item;

class ModalFormComponent extends React.Component{
  visible = false;
  state={
  }

  componentDidUpdate(){
    if(this.visible != this.props.visible){
      this.visible = this.props.visible;
      this.props.form.resetFields();
      this.props.info.display = this.props.info.display==1?true:false;
      this.props.info.recommend = this.props.info.recommend==1?true:false;
      this.props.form.setFieldsValue(this.props.info);
    }
  }

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors,values)=>{
      if(!!errors){
        console.log('Errors in form!!!');
        return;
      }
      values.display = values.display?1:0;
      values.recommend = values.recommend?1:0;
      values.materialCode = this.props.info.materialCode||'';
      values.uuids = this.props.info.uuids||'';

      console.log(values);
      this.props.onOk(values);
    })
  }
  handleCancel = () => {
    this.props.onCancel();
  }

  initList = (info) => {
    let level = info.level;
    let ary = [];
    if(level==1){
      ary = [
        {
          id: 1,
          value: '上级分类一'
        }
      ]
    }
    if(level==2){
      ary = [
        {
          id: 1,
          value: '上级分类一'
        },
        {
          id: 2,
          value: '上级分类二'
        }
      ]
    }
    if(level==3){
      ary = [
        {
          id: 1,
          value: '上级分类一'
        },
        {
          id: 2,
          value: '上级分类二'
        },
        {
          id: 3,
          value: '上级分类三'
        }
      ]
    }
    return ary;
  }
  handleGetlabel = (info) => {
    if(info.id){
      return '编辑';
    }else{
      return '新建';
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return(
      <Modal
      title={this.handleGetlabel(this.props.info)}
      confirmLoading={this.props.confirmLoading}
      wrapClassName="vertical-center-modal"
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}>
        <Form horizontal>
          <FormItem
            label='分类名称'
            {...formItemLayout}>
            <Input maxLength='50'
              placeholder='请输入少于50字的分类名称'
              {...getFieldProps('name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入分类名称'
                  }
                ]
              })}/>
          </FormItem>
          <FormItem
            label='上级分类'
            {...formItemLayout}>
            <Select
              placeholder='请选择上级分类'
              {...getFieldProps('level',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择上级分类'
                  }
                ]
              })}>
              {Util.getOptionList(this.initList(this.props.info))}  
            </Select>
          </FormItem>
          <FormItem
            label='排序序号'
            {...formItemLayout}>
            <InputNumber
              min={1}
              {...getFieldProps('sort',{
                rules: [
                  {
                    required: true,
                    message: '请输入排序序号'
                  }
                ]
              })}/>
          </FormItem>
          <FormItem
            label='显示'
            {...formItemLayout}>
            <Switch checkedChildren="开" unCheckedChildren="关" 
              {...getFieldProps('display',{
                valuePropName: 'checked'
              })}
              />
          </FormItem>
          <FormItem
            label='推荐'
            {...formItemLayout}>
            <Switch checkedChildren="开" unCheckedChildren="关" 
              {...getFieldProps('recommend',{
                valuePropName: 'checked'
              })}/>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalFormComponent);