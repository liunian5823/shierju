import {
  Card,
  Form,
  Button,
  Select,
  Radio,
  Row,
  Col,
  DatePicker,
  Checkbox,
  Table,
  Badge,
  Modal,
  Alert,
  Icon, InputNumber,
CheckboxGroup
} from 'antd';
// import PrintProvider  from 'react-easy-print';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';

import less from './index.less';

import React from "react";

// import Print from "./printTemplate"


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;


class GoodsTypeDetails extends React.Component {
  state = {
    loading: false,
    id:0,
    isModify:true,
    modelDate:[],//属性列表,原始值
    chooseStr:"",//选中后转换的字符串
    value:[],//选中临时存储变量

    name:"",//
    sort:1,//排序
    remark:"",//备注
    attributeList:[],//类型关联属性
    //定义属性名称
    pKeyName:"id",
    pValueName:"name",
    submitFlag:false,
  }
  _isMounted = false;


  componentWillMount() {
    this._isMounted = true;
    this.state.id = this.props.match.params.uuids;
    if(this.state.id != "addGoodsType"){
      this.getPageData();
      // for(let index=0;index<10;index++){
      //   this.state.modelDate[index] = {};
      //   this.state.modelDate[index].id = index;
      //   this.state.modelDate[index].name = index;
      //   this.state.modelDate[index].checked = false;
      // }
      // this.initChooseAttribute(null,this.state.modelDate);
      // //写死初始化
      // this.setState({
      //   modelDate:this.state.modelDate,
      // });
    }
    else{
      this.state.isModify = false;
      this.getGoodsAttribute(null,null);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleGoBack = () => {
    this.props.history.goBack()
  }
  getGoodsAttribute = (id,arry) =>{
    let _this = this;
    _this.typeId = id;
    //公共
    api.ajax("GET", "@/merchandise/ecGoodsProperty/all", {ifSystem:1,}).then(r => {
      if (!_this._isMounted) {
        return;
      }

      if(r.data && r.data.rows){
        console.log("已获取到数据");
        _this.setState({
          modelDate: r.data.rows,
        });
        //请求当前类型的属性
        if(_this.state.isModify){

          api.ajax("GET", "@/merchandise/ecGoodsTypePropertyRef/all", {
            typeId:_this.typeId,

          }).then(r2 => {
            if (!_this._isMounted) {
              return;
            }
            console.log("获取到当前类型的关联属性");
            //
            this.initChooseAttribute(r2.data.rows,this.state.modelDate);
          })

        }
      }

    });
  }
  getPageData = (flag=null) => {
    let _this = this;
    api.ajax("GET", "@/merchandise/ecGoodsType/page", {uuid:this.state.id}).then(r => {
      if (!_this._isMounted) {
        return;
      }


      //获取商品数据
      // if(flag){
      //   this.state.goodsId = parseInt(r.data.goods.uuids);
      //   this.state.id = r.data.goods.uuids;
      // }
      if(r.data && r.data.rows.length>0){
        //获取关联属性
        this.getGoodsAttribute(r.data.rows[0].id,null);
        _this.setState(r.data.rows[0]);
      }
    })
  }
  /**
   * format:{"1":"物流货运","2":"快递"}
   * */
  getValueByName = (obj,_name,format=null) =>{
    if(!obj) return;

    //说明是拼装的方式
    let names = [];
    let val = [];
    if(_name instanceof Array){
      names = _name;
    }
    else{
      names[0] = _name;
    }
    let flag = false;
    for(var filedName in obj){
      for(var index=0;index<names.length;index++){
        //说明找到了对应的属性
        if(names[index] == filedName){
          if(format!=null){
            for(let fname in format){
              //如果需要格式化的数据值等于 obj[filedName]
              if(fname == obj[filedName]){
                flag = true;
                val[index] = (!format[fname]?"":format[fname]);
              }
            }
          }
          else{
            flag = true;
            val[index] = (!obj[filedName]?"":obj[filedName]);
          }
        }
      }
    }
    //拼装
    var valStr = "";
    if(flag==true){
      for(let index=0;index<names.length;index++){
        //此种情况说明数据不完整，直接返回空字符串
        if(val[index] == "")
          return "";
        if(val[index] != null){
          valStr = valStr+val[index];
        }
        else{
          valStr = valStr+names[index];
        }
      }
    }
    return valStr;
  }
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  chooseAttribute=()=>{

    $("#attributeList").show();
  }
  cancelAttribute=()=>{
    $("#attributeList").hide();
  }


  initChooseAttribute=(arry=null,baseData)=>{
    //测试
    if(arry == null){
      return;
    }
    else{
      console.log("=================================================");
      console.log(arry);
      console.log("=================================================");
    }
    let str = "";
    for(let i=0;i<this.state.modelDate.length;i++){
      for(let j=0;j<arry.length;j++){
        if(arry[j].propertyId == this.state.modelDate[i][this.state.pKeyName]){
          //设置选中状态
          this.state.modelDate[i].checked = true;
          //设置选中初始化值
          this.state.value[this.state.value.length] = this.state.modelDate[i][this.state.pKeyName];
          str = str + this.state.modelDate[i][this.state.pValueName]+",";
          break;
        }
      }
    }
    console.log("初始化后的关联属性值为：");
    console.log(this.state.value);
    if(str.endsWith(",")){
      str = str.substring(0,str.length-1);
      this.setState({
        chooseStr:str,//this.state.chooseStr
        modelDate:this.state.modelDate,
      });
    }
  }



  createAttribute=()=>{
    if(this.state.modelDate.length<=0) return;
    let lis = [];
    for(let index=0;index<this.state.modelDate.length;index++){
      lis[index] = (<li><Checkbox
                                  value={this.state.modelDate[index][this.state.pKeyName]}
                                  checked={this.state.modelDate[index].checked}
                                  onChange={this.handleChange}>{this.state.modelDate[index][this.state.pValueName]}</Checkbox></li>);
    }
    return lis;
  }


  handleChange=(event)=> {
    let item = event.target.value;
    console.log(event.target.value);
    let items = this.state.value.slice();
    let index = items.indexOf(item);
    if(index==-1){
      items.push(item);
    }
    else{
      items.splice(index, 1);
    }
    // index === -1 ? items.push(item) : items.splice(index, 1);
    this.state.value = items;
    let str = "";
    let flag = false;
    for(let i=0;i<this.state.modelDate.length;i++){
      flag = false;
      for(let j=0;j<items.length;j++){
        if(this.state.modelDate[i][this.state.pKeyName] == items[j]){
          str = str+this.state.modelDate[i][this.state.pValueName]+",";
          this.state.modelDate[i].checked = true;
          flag = true;
          break;
        }
      }
      if(flag==false){
        this.state.modelDate[i].checked = false;
      }
    }
    console.log("------------------  格式化完成后的");

    console.log(this.state.value);
    if(str.endsWith(",")){
      str = str.substring(0,str.length-1);
      this.setState({
        chooseStr:str,//this.state.chooseStr
      });
    }
  }

  formatChooseAttribute=()=>{
    let str = "";
    for(let index=0;index<this.state.value.length;index++){
      str  = str + this.state.value[index]+",";
    }
    if(str.endsWith(",")){
      str = str.substring(0,str.length-1)
    }
    return str;
  }

  onChange=(event,name,isNumber=null)=>{
    console.log(event.target.value);
    //进行限制
    if(isNumber){
      if(event.target.value){
        // event.target.value = event.target.value.replace(/[^\d]/g,'');
        if (event.target.value.length == 1) {
          event.target.value = event.target.value.replace(/[^1-9]/g, '');
        } else {
          event.target.value = event.target.value.replace(/\D/g, '');
        }
        if(event.target.value > 999999999)
          event.target.value = 999999999
      }
    }
    this.state[name] = event.target.value;
    this.setState(this.state);
  }
  submitData=()=>{
    console.log(this.state.submitFlag);

    let _this = this;
    this.props.form.validateFieldsAndScroll((errors, values) => {

      if(values.name == ""){
        Util.alert("类型名称不能为空");
        return ;
      }

      let url = "@/merchandise/ecGoodsType/saveGoodsType";
      //如果是修改
      let msg = "添加成功";
      let msgError = "添加失败";
      let param = {};
      if(_this.state.id && _this.state.id != "addGoodsType")
        values.id = _this.state.id;
      if(_this.state.isModify){
        url = "@/merchandise/ecGoodsType/updateGoodsType";
        msg = "修改成功";
        msgError = "修改失败";
        values.id = _this.state.id;
        param.id = _this.state.id;

      }
      else{
        values.ifSystem = 1;
      }

      // values.properties = _this.formatChooseAttribute();
      let goodsType = values;
      let properties = _this.formatChooseAttribute();
      if(!properties){
        Util.alert("关联属性不能为空");
        return;
      }
      goodsType.properties = properties;
      //param.goodsType = values;
      //param.properties = _this.formatChooseAttribute();

      //console.log(_this.formatChooseAttribute());
      //console.log(param);
      if(this.state.submitFlag){
        Util.alert("请不要重复提交");
        return false;
      }
      this.state.submitFlag = true;
      api.ajax("POST", url, {
        ...goodsType
      }).then(r => {
        if (!_this._isMounted) {
          return;
        }
        if(!_this.state.isModify)
          _this.state.id = r.data.id;
        _this.state.isModify = true;
        this.state.submitFlag = false;
        Util.alert(msg);
        //this.handleGoBack();//返回列表页面
      }).catch(r => {
        this.state.submitFlag = false;
        Util.alert(msgError);
      })
    });

  }


  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const isRequired = this.props.form.getFieldValue('approvalResult') == 1 ? false : true;

    const { allCheckArr } = this.props;

    return (
      <div >
        <Form>
          <Card title={<div className={less.xiugaibt}>{this.state.isModify==true?"修改类型":"新增类型"}</div>}	bordered={false} className={less.minheight}>
              <FormItem {...formItemLayout} label="类型名称：" required>
                <Input id="control-textarea" maxLength='50'
								 placeholder="请输入不能超过50个字符的类型名称"
                       {...getFieldProps('name',
                           {
                             rules: [
                               {
                                 required: true,
                                 message: "类型名称"
                               }
                             ],
                             onChange:(event)=>{
                               // this.state.name = event.target.value;
                               this.onChange(event,"name");
                             },
                             initialValue:this.state.name,
                           })} />
              </FormItem>
              <FormItem {...formItemLayout} label="排序：">
                <Input  type="number"  maxLength='5'
						placeholder="请填写整数，类型列表会根据整数进行由小到大的排列整数"
                       {...getFieldProps('sort',
                           {
                             onChange:(event)=>{
                               // this.state.sort = event.target.value;
                               this.onChange(event,"sort",true);
                             },
                             initialValue:this.state.sort,
                           })} />
              </FormItem>
            <FormItem {...formItemLayout} label="备注：">
              <Input type="textarea" id="control-textarea" maxLength='400' rows={5}
                     {...getFieldProps('remark',
                         {
                           onChange:(event)=>{
                             this.onChange(event,"remark");
                           },
                           initialValue:this.state.remark,
                         })} />
            </FormItem>

              <FormItem {...formItemLayout} label="选择关联属性：" required>
                  <Input placeholder="请选择您要关联的属性" disabled value={this.state.chooseStr}/>
                  <Button className={less.xuanzhepinpai} onClick={this.chooseAttribute}>选择属性</Button>
                  <div  id="attributeList" className={less.pptanc} style={{display:"none"}}>
                  		<div className={less.pingpai}>
                  				<p>所有属性:</p>
                  		</div>
						<div>
                          <ul className={less.checkboxsz}>
                            {this.createAttribute()}
                              {/*<li><Checkbox value={"1"} onChange={this.handleChange}>华中1</Checkbox></li>*/}
                              {/*<li><Checkbox value={"2"} onChange={this.handleChange}>华中2</Checkbox></li>*/}
                              {/*<li><Checkbox value={"3"} onChange={this.handleChange}>华中3</Checkbox></li>*/}
                              {/*<li><Checkbox value={"4"} onChange={this.handleChange}>华中4</Checkbox></li>*/}
                              {/*<li><Checkbox value={"5"} onChange={this.handleChange}>华中5</Checkbox></li>*/}
                              {/*<li><Checkbox value={"6"} onChange={this.handleChange}>华中6</Checkbox></li>*/}
                              {/*<li><Checkbox value={"7"} onChange={this.handleChange}>华中7</Checkbox></li>*/}
                              {/*<li><Checkbox value={"8"} onChange={this.handleChange}>华中8</Checkbox></li>*/}
                              {/*<li><Checkbox value={"9"} onChange={this.handleChange}>华中9</Checkbox></li>*/}
                              {/*<li><Checkbox value={"10"} onChange={this.handleChange}>华中10</Checkbox></li>*/}
                              {/*<li><Checkbox value={"11"} onChange={this.handleChange}>华中11</Checkbox></li>*/}
                              {/*<li><Checkbox value={"12"} onChange={this.handleChange}>华中12</Checkbox></li>*/}
                          </ul>
                        </div>
                  		<div className={less.yixuanze}>
                  			<span>
                  				<Button type="primary" onClick={this.cancelAttribute}>确定</Button>
                  			</span>
                  		</div>
                  </div>
              </FormItem>
          </Card>

          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
              onClick={this.handleGoBack}>返回</Button>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading} onClick={this.submitData}>提交</Button>
          </BaseAffix>
        </Form>
      </div>


    )
  }
}
export default Form.create()(GoodsTypeDetails);