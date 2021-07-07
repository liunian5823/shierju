import {Alert, Button, Card, Col, Form, Icon, Radio, Row, InputNumber } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseAffix from '@/components/baseAffix';
import Input from '@/components/baseInput';
import UploadImg from '@/components/uploadImg';
// import './information.css';
import less from './index.less';

import React from "react";

import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig'

const imageOrigin = SystemConfig.configs.resourceUrl;


const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class CGAudit extends React.Component {

  boxsize={height:"130px"};
  state = {
    loading: false,
    goodsId:0,//商品ID
    rgoodsId:0,//商品的真ID
    goodsClass:"",//商品分类
    id:0,
    goodsData: {},//商品信息
    goodsSpecification:{},//
    approvalResult:1,//审核结果
    auditMas:"",//审核内容
    goodsImgs:[],
    samplePriceList: [],  //梯度的list
    samplePriceLength: 0
  }
  _isMounted = false;


  componentWillMount() {
    this._isMounted = true;
    this.state.id = this.props.match.params.uuids;
    this.state.goodsId = parseInt(this.props.match.params.uuids);
    this.getAllByGoods(this.props.match.params.uuids); // 商品价格梯度查询
    // this._getGoodsData();
    this.getGoodsData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // 商品价格梯度查询
  getAllByGoods=(goodsUuids)=>{
    api.ajax(
        'GET',
        '@/merchandise/ecGoodsPriceGradient/getAllByGoods',
        {goodsUuids} // 商品uuids
    ).then(
        r=>{
            this.setState({
                samplePriceList:r.data.rows,
                samplePriceLength:r.data.rows.length
            })
            return;
        }
    ).catch(
        r=>{
            Util.alert(r.msg);
            return;
        }
    )
}

  handleGoBack = () => {
    let goodsId ;//获取商品id  用于根据id移除审核中的商品到待审核的商品信息
    if(this.state.goodsData && this.state.goodsData.goods){
      goodsId = this.state.goodsData.goods.id;
      this.addUnAuditGoodsById(goodsId);
    }
    this.props.history.goBack()
  }
  //提交
  handleSubmit=()=>{
    let _this = this;
    if(this.state.approvalResult == 0 && !this.state.auditMas){
      Util.alert("请填写驳回意见");
      return;
    }
    let d = new Date(this.state.goodsData.goods.updateTime);
    let times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
    // api.ajax("POST", "@/merchandise/ecGoods/approvalRemarkGoodsById", {
    api.ajax("POST", "@/platform/ecGoods/approvalRemarkGoodsById", {
      uuids: this.state.id,//this.state.goodsId,13441测试用
      companyId:this.state.goodsData.goods.companyId,
      storeId:this.state.goodsData.goods.storeId,//
      approvalFlag:(this.state.approvalResult==1?2:3),//审核状态
      approvalRemark:this.state.auditMas//,//审核意见
      //updateTime:times,//商品原来的修改时间
    }).then(r => {
      if (!_this._isMounted) { return }
      let msg = this.state.approvalResult==1?"操作成功，商品已上架":"操作成功，商品被驳回";
      //还原值
      _this.resetdefaultData();
      _this.sh_button();
      this.state.goodsData = null;
      //自动走下一个
      Util.alert(msg,{callback:this.toNextEvaluateGoods});

    }).catch(r => {
      Util.alert("操作失败，请稍后再试，错误代码："+r.code);
    });

  }

  //进入下一个待审核商品
  toNextEvaluateGoods = ()=>{
    var main = document.getElementById('main');
    main.scrollTop = 0;

    if(this.state.goodsData && this.state.goodsData.goods){
      let goodsId = this.state.goodsData.goods.id;
      this.getGoodsData(true);
    }else{
      this.getGoodsData(true);
    }
  }
  addUnAuditGoodsById=(goodsId)=>{
    if(goodsId){
      api.ajax("GET", "@/merchandise/ecGoods/addUnAuditGoodsById", {id:goodsId}).then(r => {

      }).catch(r => {
        console.log('toNextEvaluateGoods','根据id移除审核中的商品到待审核的商品信息失败')
      });
    }
  }
  resetdefaultData=()=>{
    console.log("重新设置值");
    this.state.auditMas = "";
    this.state.approvalResult = 1;
    this.setState({
      auditMas:"",
      approvalResult:1,
    });
  }
  sh_button=(falg=true)=>{
    if(falg == true){
      $("#handleSubmit").hide();
      $("#divauditMas").hide();
      console.log("隐藏审核模块")
    }
    else if(falg  == false){
      $("#handleSubmit").show();
      $("#divauditMas").show();
      console.log("显示审核模块")
    }

  }
  _getGoodsData=()=>{
    let _this = this;
    api.ajax("GET", "@/merchandise/ecGoodsSpecification/all", {
      goodsId: this.state.rgoodsId//this.state.goodsId,13441测试用
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        goodsSpecification: r.data,
      })
    })
  }
  ///merchandise/ecGoodsImg/all?goodsId={goodsId}
  _getGoodsImgs=()=>{
    let _this = this;
    api.ajax("GET", "@/merchandise/ecGoodsImg/all", {
      goodsId: this.state.rgoodsId//this.state.goodsId,13441测试用
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        goodsImgs: r.data.rows,
      })
      console.log(r.data);
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
    //设置是审核状态的商品
    param.approvalFlag = 1;

    let goodsId ;//获取商品id  用于根据id移除审核中的商品到待审核的商品信息
    if(this.state.goodsData && this.state.goodsData.goods){
      goodsId = this.state.goodsData.goods.id;
    }

    api.ajax("GET", "@/platform/ecGoods/getAuditGoodsById", param).then(r => {
      // console.log('r',r)
      if (!_this._isMounted) {
        return;
      }
      _this.sh_button(false);
      //获取分类
      this.getGoodsClass(r.data.goods.goodsClassId);
      //
      //初始化
      //r.data.goods.goodsImgList = ["static/iconfont/success.png","static/iconfont/success.png","static/iconfont/success.png","static/iconfont/success.png","static/iconfont/success.png"];
      //获取商品数据
      // if(flag)
      {
        this.state.goodsId = parseInt(r.data.goods.uuids);
        this.state.rgoodsId = r.data.goods.id;
        console.log(r.data.goods);
        this.state.id = r.data.goods.uuids;
        this._getGoodsData();
        this._getGoodsImgs();
      }
      this.setState({
        goodsData: r.data,
      })
      //如果goodsId存在则根据id移除审核中的商品到待审核的商品信息
      if(goodsId){
        this.addUnAuditGoodsById(goodsId);
      }
      //还原
      this.resetdefaultData();
    }).catch(r => {
      if(!r.data || r.data.length<=0){
        Util.alert(r.msg);
      }
    });
  }

  createImg=(src)=>{
    if(src && src.indexOf("http") > -1){
      return (
          <div className={less.juzuosc}>
            <img src={src} style={{"width":"130px","height":"130px"}}/>
          </div>
      )
    }else{
      return(
          <div className={less.juzuosc}>
            <UploadImg type="head" filename="goodsPhotoPath" imgUrl={src} disabled={true} boxStyle={{"height":"130px"}} uploadTxtStyle={{display:"none"}} uploadImgDivStyle={{"border-bottom":"0px solid #e9e9e9"}}/>
          </div>
      )
    }
  }
  goodsImg=()=>{
    //goodsImgList

    if(!this.state.goodsImgs || this.state.goodsImgs.length<=0) return;

    let div = [];
    for(let index=0;index<this.state.goodsImgs.length;index++){
      div[index] = this.createImg(this.state.goodsImgs[index].url);
    }
    console.log("创建的图片有："+this.state.goodsImgs.length);
    return div;
  }

  //处理税率展示 0， 0.01,0.03，0.06，0.10，0.13，0.16
  getGoodsTaxRate=(obj)=>{
    if(!obj || !obj.goodsTaxRate) return;
    let str = '';
    // if(obj.goodsTaxRate == '0') str='0%';
    // if(obj.goodsTaxRate == '0.01') str='1%';
    // if(obj.goodsTaxRate == '0.03') str='3%';
    // if(obj.goodsTaxRate == '0.06') str='6%';
    // if(obj.goodsTaxRate == '0.10') str='10%';
    // if(obj.goodsTaxRate == '0.13') str='13%';
    // if(obj.goodsTaxRate == '0.16') str='16%';
    let taxRate = obj.goodsTaxRate*100;
    return taxRate.toString()+"%";
    
  }

//"1":"物流货运","2":"快递","3":"商家配送","4":"自提"
  getDelivery=(obj)=>{
    if(!obj || !obj.delivery) return;
    let str = obj.delivery.replace("1","物流货运,").replace("2","快递,").replace("3","商家配送,").replace("4","自提,");
    str = str.replace(/,,/g,",");
    if(str.endsWith(",")){
      str = str.substring(0,str.length-1);
    }
    return str;
    // return obj.delivery.replace("1","物流货运,").replace("2","快递,").replace("3","商家配送,").replace("4","自提,")
  }
  /**
   * format:{"1":"物流货运","2":"快递"}
   * */
  getValueByName = (obj,_name,format=null,split=null) =>{
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
    let tmp = "";
    for(var filedName in obj){
      for(var index=0;index<names.length;index++){
          {
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
                <td>{data.showTax}</td>
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
gblen = (str) =>{
    var lenZ = 0;
    var lenN = 0;
    for (var i=0; i<str.length; i++) {
      if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
        lenZ += 1;
      } else {
        lenN += 1;
      }
    }
    if(lenZ!=0 && (lenZ/2+1)>(lenN/2)){
      return lenZ;
    }
    else if(lenZ!=0 && (lenZ/2+1)<=(lenN/2)){
      return lenZ/2+lenN/2;
    }
    else if(lenZ==0){
      return lenN/2;
    }
    return 2;
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
            <Col span={this.gblen(fName)}>{fName}</Col>
            <Col span={22-this.gblen(fName)}>
              <div className={less.huise}>
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
    tags[index] = (<a className={less.dgppai}>{data[index]}</a>);
  }
  return tags;
}

getCustomBrandName=(data)=>{
    if(!data) return;
    if(!data.brandEname){
      return data.customBrandName;
    }
    else{
      return data.brandEname;
    }
}
getSpecifications=(data)=>{
    if(!data) return;
    let str =  data.specificationsCount+data.measurementUnitId+"/"+data.specificationsUnit;
  str = str.replace("//","/");
  return str;
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

  onChange=(event,name,isNumber=null)=>{
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
  onChangeApprovalResult=(event)=>{
    this.onChange(event,"approvalResult");
    this.state[name] = event.target.value;
    this.setState(this.state);
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const formPhoto = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const isRequired = this.props.form.getFieldValue('approvalResult') == 1 ? false : true;

    return (

      <div>
        <Form>
          <div id="react-print">
          <Alert message={"当前选择分类："+this.state.goodsClass} type="info" className={less.currentClass_class} />
          <Card className={less.kapian} title={<div className={less.xiugaibt}>商品基本信息<Icon type="question-circle-o" className={less.iconwen} /></div>}	bordered={false} >
            <div>
              <FormItem {...formItemLayout} label="商品名称：" className={less.ylbt}>
                <div className={less.wkbmcheng}>{this.getValueByName(this.state.goodsData.goods,"goodsName")}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="供应商：" className={less.ylbt}>
                <div className={less.wkbmcheng}>{this.getValueByName(this.state.goodsData.goods,"companyName")}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="品牌：" className={less.ylbt}>
                <div className={less.wkbmcheng}>{this.getCustomBrandName(this.state.goodsData.goods)}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="到期时间：" className={less.ylbt}>
                <div className={less.wkbmcheng}>{this.getValueByName(this.state.goodsData.goods,"dueTime")}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="商品单位：" className={less.ylbt}>
                <div className={less.wkbmcheng}>{this.getValueByName(this.state.goodsData.goods,"measurementUnitId")}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="商品税率：" className={less.ylbt}>
                <div className={less.wkbmcheng}>{this.getGoodsTaxRate(this.state.goodsData.goods)}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="产品标签：" className={less.ylbt}>
                <div className={less.biaoqian} id="biaoqian">
{/*                  <a className="dgppai">商品标签1&nbsp;</a>
                  <a className="dgppai">商品标签1&nbsp;</a>
                  <a className="dgppai">商品标签1&nbsp;</a>*/}
                  {this.getGoodstags(this.state.goodsData.goods)}
                </div>
              </FormItem>
            </div>
          </Card>
          {/*model*/}
          <Card className={less.kapian} title={<div className={less.xiugaibt}>商品规格型号<Icon type="question-circle-o"  className={less.iconwen}/></div>}	bordered={false} >
            <div>
              <FormItem {...formItemLayout} label="商品属性：" className={less.shuxing}>
                <div className={less.rownow}>
                  {this.getGoodsProperties(this.state.goodsData.properties)}
                </div>
              </FormItem>
              <table width="100%" className={less.table}>
                <thead>
                <tr>
                  <th width="200" style={{textAlign: 'left'}}>规格</th>
                  <th width="120" style={{textAlign: 'left'}}>编码</th>
                  <th width="110" style={{textAlign: 'left'}}>进货成本价</th>
                  <th width="110" style={{textAlign: 'left'}}>展示销售价</th>
                  <th width="110" style={{textAlign: 'left'}}>展示销售税额</th>
                  <th width="110" style={{textAlign: 'left'}}>库存</th>
                </tr>
                {this.getGoodsSkues(this.state.goodsData.goodsSkues)}
                </thead>
              </table>
            </div>
          </Card>
          {/*Parameter*/}
          <Card className={less.kapian} title={<div className={less.xiugaibt}>商品规格参数<Icon type="question-circle-o"  className={less.iconwen}/></div>}	bordered={false} >
            <div className={less.cstianjia}>
              <div className={less.shenheguigecs}>{this.getGoodsSpecification(this.state.goodsSpecification.rows)}</div>
            </div>
          </Card>

          {/*commodity_gradient*/}
          <Card title={
              <div className={less.gradient_title}>
                  <div>
                      商品梯度价&nbsp;<Icon className={less.iconwen} type="question-circle-o" title="商品梯度价"/>
                  </div>
              </div>} bordered={false} className={less.kapian}>
              {this.state.samplePriceList.length>0 ? 
                  <div className={less.gradient_list}>
                      {this.state.samplePriceList.map((item,index) => {
                          return (
                              <div style={{display: this.state.samplePriceList.length >= index+1 ? 'flex':'none'}}>
                                  <div style={{display: 'flex', alignItems: 'center'}}>
                                      <InputNumber
                                          disabled
                                          defaultValue={index==0?1:this.state.samplePriceList[index-1].goodsNumber+1}/>
                                      <b></b>
                                      <InputNumber
                                          disabled
                                          defaultValue={item.goodsNumber}/>
                                      个
                                  </div>
                                  <div style={{display: 'flex', alignItems: 'center'}}>
                                      <InputNumber
                                          disabled step='0.5' defaultValue={item.discount?item.discount:item.discount}
                                          mountNode/> 折
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              : ''}
              <div style={{textAlign: 'center',display: this.state.samplePriceList.length>0?'none':'block'}}>不设置梯度价格</div>
          </Card>

          {/*Logistics*/}
          <Card className={less.kapian} title={<div className={less.xiugaibt}>物流配送信息<Icon type="question-circle-o"  className={less.iconwen}/></div>}	bordered={false} >
            <div>
              <FormItem {...formItemLayout} label="配送方式：">
                {/*<CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={onChange}/>*/}
                <div className={less.wkbmcheng}>{this.getDelivery(this.state.goodsData.goods)}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="包含运费：">
                <div className={less.wkbmcheng}>{this.getValueByName(this.state.goodsData.goods,"mailFlag",{"1":"卖家承担运费","0":"买家承担运费"})}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="运费说明：">
                <div className={less.wkbmcheng}>{this.getValueByName(this.state.goodsData.goods,"freight")}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="商品重量：">
                <div className={less.wkbmcheng}><div className={less.qianke}>{this.getValueByName(this.state.goodsData.goods,["logisticsQuality","KG"])}</div></div>
              </FormItem>
              <FormItem {...formItemLayout} label="包装体积：">
                <div className={less.wkbmcheng}><div className={less.qianke}>{this.getValueByName(this.state.goodsData.goods,["logisticsVolume","立方米"])}</div></div>
              </FormItem>
              <FormItem {...formItemLayout} label="包装规格：">
                <div className={less.wkbmcheng}><div className={less.qianke}>{this.getSpecifications(this.state.goodsData.goods)}</div></div>
              </FormItem>
            </div>
          </Card>
          {/*Details*/}
          <Card title={<div className={less.xiugaibt}>商品主图及详情<Icon type="question-circle-o"  className={less.iconwen}/></div>}	bordered={false} >
            <div>
              <FormItem {...formPhoto} label="商品图片：">
                {this.goodsImg()}
              </FormItem>
              <FormItem {...formPhoto} label="商品简介：">
                <div dangerouslySetInnerHTML={{__html: this.getValueByName(this.state.goodsData.goods,"description")}} />
              </FormItem>
            </div>
          </Card>
          </div>
          <div id="divauditMas">
					<Card className={less.kapian} title="审核意见"	bordered={false} >
						<div>
                          <FormItem {...formItemLayout} label="审核结果">
                            {/*<RadioGroup id="approvalResult-radio"*/}
                                {/*disabled={false}*/}
                                        {/*selectedValue={this.state.approvalResult}*/}
                                {/*onChange={(e)=>this.onChangeApprovalResult(e)}*/}
                                {/*>*/}
                              <Radio key="a" value={1} checked={this.state.approvalResult==1?true:false} onChange={(e)=>this.onChangeApprovalResult(e)}>审核通过</Radio>
                              <Radio key="b" value={0} checked={this.state.approvalResult==0?true:false} onChange={(e)=>this.onChangeApprovalResult(e)}>驳回</Radio>
                            {/*</RadioGroup>*/}
                          </FormItem>
                          <FormItem   {...formItemLayout} required={this.state.approvalResult==1?false:true} label="审核意见">
                            <Input  type="textarea" maxLength='400' rows={5} value={this.state.auditMas} onChange={(e)=>this.onChange(e,"auditMas")}/>
                          </FormItem>
						</div>
					</Card>
          </div>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
              onClick={this.handleGoBack}>返回</Button>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                    onClick={this.print}>打印</Button>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                    onClick={() => (this.getGoodsData(true))}>上一个</Button>
            <Button id="handleSubmit" type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                    onClick={() => (this.handleSubmit(1))}>提交</Button>
            <Button type="primary" style={{ marginRight: "10px" }} loading={this.state.loading}
                    onClick={() => (this.toNextEvaluateGoods())}>下一个</Button>
          </BaseAffix>
        </Form>
      </div>


    )
  }
}
export default Form.create()(CGAudit);