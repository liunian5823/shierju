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
  Icon, InputNumber
} from 'antd';
// import PrintProvider  from 'react-easy-print';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';

import './index.less';
import React from "react";

// import Print from "./printTemplate"


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;


class GoodsDetails extends React.Component {
  state = {
    loading: false,
    goodsId:0,//商品ID
    goodsClass:"",//商品分类
    id:0,
    goodsData: {},//商品信息
    goodsSpecification:{},//
    approvalResult:1,//审核结果
    auditMas:"",//审核内容
  }
  _isMounted = false;


  componentWillMount() {
    this._isMounted = true;
    this.state.id = this.props.match.params.uuids;
    this.state.goodsId = parseInt(this.props.match.params.uuids);

    this._getGoodsData();
    this.getGoodsData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleGoBack = () => {
    this.props.history.goBack()
  }
  //提交
  // handleSubmit=()=>{
  //   let _this = this;
  //   if(this.state.approvalResult == 0 && !this.state.auditMas){
  //     Util.alert("请填写驳回意见");
  //     return;
  //   }
  //   let d = new Date(this.state.goodsData.goods.updateTime);
  //   let times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
  //   api.ajax("POST", "@/merchandise/ecGoods/approvalRemarkGoodsById", {
  //     uuids: this.state.id,//this.state.goodsId,13441测试用
  //     companyId:this.state.goodsData.goods.companyId,
  //     storeId:this.state.goodsData.goods.storeId,//
  //     approvalFlag:(this.state.approvalResult==1?2:3),//审核状态
  //     approvalRemark:this.state.auditMas,//审核意见
  //     updateTime:times,//商品原来的修改时间
  //   }).then(r => {
  //     if (!this._isMounted) { return }
  //     Util.alert(r.msg, { type: "success" })
  //   }).catch(r => {
  //     Util.alert(r.msg, { type: "error" })
  //   })
  // }
  _getGoodsData=()=>{
    let _this = this;
    api.ajax("GET", "@/merchandise/ecGoodsSpecification/all", {
      goodsId: this.state.goodsId//this.state.goodsId,13441测试用
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        goodsSpecification: r.data,
      })
    })
  }
  getGoodsClass = (id) =>{
    let _this = this;
    api.ajax("GET", "@/merchandise/ecGoodsClass/queryClassNameIdById", {
      goodsClassById:id,
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      //直接处理数据

      let goodsClass = "";
      if(r.data[("level1Name")])
        goodsClass = r.data[("level1Name")];
      if(r.data[("level2Name")])
        goodsClass = goodsClass+" > "+r.data[("level2Name")];
      if(r.data[("level3Name")])
        goodsClass = goodsClass+" > "+r.data[("level3Name")];
      if(r.data[("level4Name")])
        goodsClass = goodsClass+" > "+r.data[("level4Name")];
      if(r.data[("level5Name")])
        goodsClass = goodsClass+" > "+r.data[("level5Name")];
      this.setState({
        goodsClass:goodsClass
      })
    })
  }
  getGoodsData = (flag=null) => {
    let _this = this;
    let param = {};
    if(!flag){
      param.uuids = this.state.id;
    }
    api.ajax("GET", "@/merchandise/ecGoods/getAuditGoodsById", param).then(r => {
      if (!_this._isMounted) {
        return;
      }

      //获取分类
      this.getGoodsClass(r.data.goods.goodsClassId);
      //
      //初始化
      //r.data.goods.goodsImgList = ["static/iconfont/success.png","static/iconfont/success.png","static/iconfont/success.png","static/iconfont/success.png","static/iconfont/success.png"];
      //获取商品数据
      if(flag){
        this.state.goodsId = parseInt(r.data.goods.uuids);
        this.state.id = r.data.goods.uuids;
        this._getGoodsData();
      }
      this.setState({
        goodsData: r.data,
      })

    })
  }
  createImg=(src)=>{
    return(
        <div className="juzuosc">
                <span>
                    <img src={src}/>
                </span>
        </div>
    )
  }
  goodsImg=()=>{
    //goodsImgList

    if(!this.state.goodsData.goods || !this.state.goodsData.goods.goodsImgList) return;

    let div = [];
    for(let index=0;index<this.state.goodsData.goods.goodsImgList.length;index++){
      div[index] = this.createImg(this.state.goodsData.goods.goodsImgList[index]);
    }

    return div;
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
  createSkuesTr=(data)=>{
          return (
              <tr>
                  <td><div dangerouslySetInnerHTML={{__html: data.attribute}} /></td>
                <td>{data.skuCode}</td>
                <td>{data.price}</td>
                <td>{data.showPrice}</td>
                <td>{data.amount}</td>
              </tr>
          )
}
  getGoodsSkues =(data)=>{

    if(!data) return;
    let trs = [];

    for(let index=0;index<data.length;index++){
      trs[index] = this.createSkuesTr(data[index]);
    }
    return trs;
  }
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  createProperties = (data) =>{
          return (
              <FormItem {...this.formItemLayout} label={data.propertyName}>
                {data.propertyValue}
              </FormItem>
          )
  }
  getGoodsProperties=(data)=>{
    if(!data) return;
    //先找出所有的row，比如说颜色、大小、尺寸
    let row = [];
    let dom = [];
    let flag = false;
    for(let i=0;i<data.length;i++){
      if(row[data[i].propertyName]){
        row[data[i].propertyName][row[data[i].propertyName].length] = data[i].propertyValue;
      }
      else{
        row[data[i].propertyName] = [];
        row[data[i].propertyName][row[data[i].propertyName].length] = data[i].propertyValue;
      }
    }
    for(let fName in row){
      let as = [];
      for(let index=0;index<row[fName].length;index++){
        as[index] = (<a>{row[fName][index]}</a>);
      }
      dom[dom.length] = (
          <Row>
            <Col span={2}>{fName}</Col>
            <Col span={20}>
              <div className="huise">
                {as}
              </div>
            </Col>
          </Row>
      );
    }
    return dom;
  }

  getGoodsSpecification= (data)=>{
    if(!data) return;
    let formItems = [];
    for(let index=0;index<data.length;index++){
      formItems[index] = (<FormItem {...this.formItemLayout} label={data[index].name}>
                          {data[index].description}
                        </FormItem>);
    }
    return formItems;
  }
getGoodstags=(_data)=>{
  if(!_data || !_data.tags) return;
  let tags = [];
  let data = _data.tags.split(",");
  for(let index=0;index<data.length;index++){
    tags[index] = (<a className="dgppai">{data[index]}</a>);
  }
  return tags;
}


  print = () => {
    let printDiv = $("#react-print").clone(true);
    printDiv.attr("id","react-print-clone");
    let children = $(window.document.body).children();
    //将所有的元素全部隐藏
    for(let index=0;index<children.length;index++){
      $(children[index]).hide();
    }
    printDiv.show();
    $(window.document.body).append(printDiv);
    window.print();
    for(let index=0;index<children.length;index++){
      $(children[index]).show();
    }
    $("#react-print-clone").remove();
  }


  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const formItemLayoutClear = {
      wrapperCol: { span: 22 },
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    }
    const otherFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }

    const isRequired = this.props.form.getFieldValue('approvalResult') == 1 ? false : true;

    return (


      <div >
        <Form>
          <div id="react-print">

          <Alert message={"当前选择分类："+this.state.goodsClass} type="info" className="currentClass-class" />
          <Card title={<div className="xiugaibt">商品基本信息<Icon type="question-circle-o" /></div>}	bordered={false} >
            <div>
              <FormItem {...formItemLayout} label="商品名称：">
                {this.getValueByName(this.state.goodsData.goods,"goodsName")}
              </FormItem>
              <FormItem {...formItemLayout} label="品牌：">
                {this.getValueByName(this.state.goodsData.goods,"customBrandName")}
              </FormItem>
              <FormItem {...formItemLayout} label="到期时间：">
                {this.getValueByName(this.state.goodsData.goods,"dueTime")}
              </FormItem>

              <FormItem {...formItemLayout} label="产品标签：">
                <div className="biaoqian" id="biaoqian">
{/*                  <a className="dgppai">商品标签1&nbsp;</a>
                  <a className="dgppai">商品标签1&nbsp;</a>
                  <a className="dgppai">商品标签1&nbsp;</a>*/}
                  {this.getGoodstags(this.state.goodsData.goods)}
                </div>
              </FormItem>
            </div>
          </Card>
          {/*model*/}
          <Card title={<div className="xiugaibt">商品规格型号<Icon type="question-circle-o" /></div>}	bordered={false} >
            <div>
              <FormItem {...formItemLayout} label="商品属性：" className="shuxing">
                <div className="rownow">
                  {this.getGoodsProperties(this.state.goodsData.properties)}
                </div>
              </FormItem>
              <table width="100%" className="table">
                <thead>
                <tr>
                  <th>规格</th>
                  <th width="170">编码</th>
                  <th width="100">供应价</th>
                  <th width="100">售价</th>
                  <th width="100">库存</th>
                </tr>
                {this.getGoodsSkues(this.state.goodsData.goodsSkues)}
                </thead>
              </table>
            </div>
          </Card>
          {/*Parameter*/}
          <Card title={<div className="xiugaibt">商品规格参数<Icon type="question-circle-o" /></div>}	bordered={false} >
            <div className="cstianjia">
              {this.getGoodsSpecification(this.state.goodsSpecification.rows)}
            </div>
          </Card>
          {/*Logistics*/}
          <Card title={<div className="xiugaibt">物流配送信息<Icon type="question-circle-o" /></div>}	bordered={false} >
            <div>
              <FormItem {...formItemLayout} label="配送方式：">
                {/*<CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={onChange}/>*/}
                {this.getValueByName(this.state.goodsData.goods,"distributionMode",{"1":"物流货运","2":"快递","3":"商家配送","4":"自提"})}
              </FormItem>
              <FormItem {...formItemLayout} label="包含运费：">
                {this.getValueByName(this.state.goodsData.goods,"mailFlag",{"0":"买家承担运费","1":"卖家承担运费"})}
              </FormItem>
              <FormItem {...formItemLayout} label="运费说明：">
                {this.getValueByName(this.state.goodsData.goods,"freight")}
              </FormItem>
              <FormItem {...formItemLayout} label="商品重量：">
                <div className="qianke">{this.getValueByName(this.state.goodsData.goods,["logisticsQuality","/KG"])}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="包装体积：">
                <div className="qianke">{this.getValueByName(this.state.goodsData.goods,["logisticsVolume","/立方米"])}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="包装规格：">
                <div className="qianke">{this.getValueByName(this.state.goodsData.goods,["specificationsCount","/","specificationsUnit"])}</div>
              </FormItem>
            </div>
          </Card>
          {/*Details*/}
          <Card title={<div className="xiugaibt">商品主图及详情<Icon type="question-circle-o" /></div>}	bordered={false} >
            <div>
              <FormItem {...formItemLayout} label="商品图片：">
                {this.goodsImg()}
              </FormItem>
              <FormItem {...formItemLayout} label="商品简介：">
                  <div dangerouslySetInnerHTML={{__html: this.getValueByName(this.state.goodsData.goods,"description")}} />
              </FormItem>
            </div>
          </Card>
          </div>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
              onClick={this.handleGoBack}>返回</Button>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                    onClick={this.print}>打印</Button>
          </BaseAffix>
        </Form>
      </div>


    )
  }
}
export default Form.create()(GoodsDetails);