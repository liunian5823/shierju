import {Card, Switch, Icon, Modal, Button,Form,FormItem,Input} from 'antd'
import AuthButton from '@/components/authButton'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import less from './index.less'

import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig'
import ModalSettings from './settings';
const imageOrigin = SystemConfig.configs.resourceUrl;
const confirm = Modal.confirm;

class Goods extends React.Component {

  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  _userInfo = null

  state = {
    loading: false,
    roleList: [],
    // 表格数据
    tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    //列表中是否展示复选框
    haveSelection:true,
    //统一设置
    ModalSettings:false,
    // 编辑
    ModalModify: false,
    // 下架
    ModalLowerShelf: false,
    //批量违规下架时,需要传入弹出框的数据
    modeData:[],
    modeSingleData:{},//点击每一行右侧违规下架时,输入到弹出框的数据
    //批量编辑状态
    isModifyAll:false,
    //商品分类
    goodsClassList:[],
  }

  baseParams = {
    status:0,
    // companyId:0,
    approvalFlag:2,
  }
  renderFormList = () => {
    let options = this.state.goodsClassList;
    return [
      // {
      //   type: 'RANGE',
      //   field: 'times',
      //   label: '发布时间',
      //   placeholder: '请选择筛选时间段'
      // },
      {
        type: 'INPUT',
        field: 'searchGoodsName',
        label: '商品名称',
        placeholder: '请输入商品名称',
        maxLength:50
      },
      {
        type: 'INPUT',
        field: 'goodsNo',
        label: '商品货号',
        placeholder: '请输入商品货号',
        maxLength:50
      },{
        type: 'LINKAGE',
        field: 'goodsClassId',
        label: '商品分类',
        placeholder: '请输入分类名称',
        options,
        loadData:this.loadLinkageData,
        onChange:this.linkageOnChange,
      },
      {
        type: 'RANGE',
        field: 'releaseTimes',
        label: '发布时间',
        placeholder: '请选择筛选时间段'
      },
      {
        type: 'RANGE',
        field: 'dueTimes',
        label: '到期时间',
        placeholder: '请选择筛选时间段'
      },
      // {
      //   type: 'INPUT',
      //   field: 'amount',
      //   label: '商品品牌',
      //   placeholder: '请输入商品品牌'
      // },
      // {
      //   type: 'INPUT',
      //   field: 'price',
      //   label: '价格',
      //   placeholder: '0.00 - 0.00'
      // },
      // {
      //   type: 'INPUT',
      //   field: 'warning',
      //   label: '供应商名称',
      //   placeholder: '请输入供应商名称'
      // },
    ]
  }

  linkageOnChange = (value, selectedOptions) => {
    /*if(value){
        this.baseParams = {
            ...this.baseParams,
            goodsClassId: value[value.length-1]
        }
    }*/
  }

  loadLinkageData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let pId = targetOption.value;
    let level = targetOption.level;
    if(level<3){
      api.ajax('GET', '@/merchandise/ecGoodsClass/all', {
        pId,
        display:1
      }).then(r => {
        if (!this._isMounted) {
          return;
        }
        targetOption.loading = false;
        let goodsClassList = r.data.rows;
        if(goodsClassList!=null && goodsClassList.length>0){
          if(level==2){
            targetOption.children = Util.getLinkageOptionList(goodsClassList,"id","name","yes");
          }else{
            targetOption.children = Util.getLinkageOptionList(goodsClassList,"id","name");
          }
        }else{
          targetOption.isLeaf = true;
        }
        this.setState({
          goodsClassList: [...this.state.goodsClassList],
        });

      }).catch(r => {
      })
    }
  }


  importantFilter = [ 'searchGoodsName','goodsNo']

  componentWillMount() {
    this._isMounted = true;

    this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
      if (this._userInfo || !obj) { return false }
      this._userInfo = obj;
      // 获得用户基本信息后执行加载回调
      this.initDataFn();
    }.bind(this));//
    PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据

  }

  componentWillUnmount() {
    this._isMounted = false;
    PubSub.unsubscribe(this.pubsub_userInfo);
  }

  initDataFn = () => {
    //测试
    // this._userInfo.companyId = 635;
    this.baseParams = {
      ...this.baseParams,
      // companyId: this._userInfo.companyId,
      status:0,
    }

    this.getGoodsClassData(-1);
    // 进入页面加载数据
    this.handelToLoadTable();
  }

  //获取商品分类
  getGoodsClassData = (pId) =>(
      api.ajax('GET', '@/merchandise/ecGoodsClass/all', {
        pId,
        display:1
      }).then(r => {
        if (!this._isMounted) {
          return;
        }
        let rowsList = r.data.rows;
        let goodsClassList = [];
        if(rowsList==null || rowsList.length<=0){
          goodsClassList = Util.getLinkageOptionList(rowsList,"id","name","yes");
        }else{
          goodsClassList = Util.getLinkageOptionList(rowsList,"id","name");
        }
        this.setState({
          loading: false,
          goodsClassList,
        });
      }).catch(r => {
        this.setState({
          loading: false
        })
      })
  )

  // handleToDetails = (id) => {
  //   this.props.history.push(this.props.history.location.pathname + '/details' + '/' + id)
  // }
  handleToDetails = (uuids) => {

    if(uuids){
      /*let protocol = window.location.protocol;
      let host = window.location.host;
      let href = `${protocol}//${host}/cms/goods/showOne?goodsId=${id}`;
      window.open(href);*/
      //设置新的跳转页面
      window.open(systemConfigPath.jumpCrccmallPage("/indexPortal/goodsInfo"+"/"+uuids));
    }
  }

  handleFilter = (params, isSend = true) => {
    //根据formList生成的表单输入条件过滤
    //发布时间处理
    let releaseTimeStart, releaseTimeEnd;
    if (params.releaseTimes) {
      releaseTimeStart = params.releaseTimes[0] ? moment(params.releaseTimes[0]).format('YYYY-MM-DD') : '';
      releaseTimeEnd = params.releaseTimes[1] ? moment(params.releaseTimes[1]).format('YYYY-MM-DD') : '';
    }
    //到期时间处理
    let dueTimeStart,dueTimeEnd;
    if (params.dueTimes) {
      dueTimeStart = params.dueTimes[0] ? moment(params.dueTimes[0]).format('YYYY-MM-DD') : '';
      dueTimeEnd = params.dueTimes[1] ? moment(params.dueTimes[1]).format('YYYY-MM-DD') : '';
    }

    //商品分类处理
    if(params.goodsClassId){
      params.goodsClassId = params.goodsClassId[params.goodsClassId.length-1];
    }

    this.baseParams = {
      ...this.baseParams,
      ...params,
      status:0,
      releaseTimeStart,
      releaseTimeEnd,
      dueTimeStart,
      dueTimeEnd
    }
    if (isSend) {
      this.handelToLoadTable();
    }
  }
// 通过 rowSelection 对象表明需要行选择
  getSubtract=(maxData,minData)=>{
    for(let maxid = 0;maxid<maxData.length;maxid++){
        let flag=true;
      for(let minid = 0;minid<minData.length;minid++){
        if(maxData[maxid] == minData[minid]){
          flag = false;
        }
      }
      if(flag==true){
        return maxData[maxid];
      }
    }
  }

  //复选框点击事件
  /*setSelectedItems  = (selectedRows) =>{
    console.log("================ setSelectedItems ================", selectedRows)
    if(this.state.isModifyAll){

        let data = {};

      if(selectedRows.length<this.state.modeData.length){
        //获取差集
        data = this.getSubtract(this.state.modeData,selectedRows);
        //设置为待编辑状态
        this.changeModifyToSubmit(data,'SubmitToModifyAll');
        this.clickCancel(data,'SubmitToModifyAll');
        if(!selectedRows || selectedRows.length<=0){
          this.state.isModifyAll = false;
          this.changeModifyToSubmitAll("SubmitToModify")
          Util.alert("已全部取消");
        }
      }
      else{
        //获取差集
        data = this.getSubtract(selectedRows,this.state.modeData);
        //设置为提交状态
        this.changeModifyToSubmit(data,'ModifyToSubmitAll');
        this.clickModify(data,'ModifyToSubmitAll');
      }
    }
    this.state.modeData = [];
    this.state.modeData = selectedRows;

  };*/
  //设置被选中的列表项
  setSelectedItems = (items) =>{
    this.state.modeData = items;
  }
  //根据url请求,同步页面组件
  syncIndexCompent = ()=>{
    //清空被选中的列表项
    let {haveSelection,modeData} = this.state
    if(haveSelection && modeData && modeData.length>0){
      this.state.modeData = [];
    }
  }

  //card内容
  extraOptions = () => {
    return  (<span style={{width:"240px"}}>
              {/*<AuthButton className={less.commodityAudit_card_button} type="primary" >配置</AuthButton>*/}
              <AuthButton className={less.commodityAudit_card_button} type="primary" onClick={this.handleToShelfAllDown}>违规下架</AuthButton>
 {/*     <AuthButton className={less.commodityAudit_card_button} type="primary" onClick={this.handleToShelfAllUp}>上架</AuthButton>*/}
              {/*<AuthButton className={less.commodityAudit_card_button} type="primary" >导出</AuthButton>*/}
            </span>)
  }

//下架
  handleToShelfAllDown=()=>{
    if(this.state.modeData.length<=0){
      Util.alert("未选中任何值");
      return;
    }
    this.state.modeSingleData={};
    this.state.isModifyAll = true;
    // this.handleToShelf(this.state.modeData,0);

    this.openModal('ModalSettings', true);
  }
  //上架
  handleToShelfAllUp=()=>{
    if(this.state.modeData.length<=0){
      Util.alert("未选中任何值");
      return;
    }
    this.state.isModifyAll = true;
    this.handleToShelf(this.state.modeData,1);
  }

  openModal = (modalName, show = false, isSuccess = false) => {
    if (isSuccess) {
      //刷新页面
      // this.getaccountInfo();
      //设置为待编辑状态
      // this.toCacelAll();
      //刷新表格数据
      this.handelToLoadTable(2);
    }
    this.setState({
      [modalName]: show
    })
  }
  toModifySettings= () => {
    if(this.state.modeData.length<=0){
      Util.alert("未选中任何值");
      return;
    }
    this.openModal('ModalSettings', true);
  }
  toModifyAllSubmit=()=>{
    //批量获取所有改变的值
    let erlen = 0;
    for(let index=0;index<this.state.modeData.length;index++){
      if(!this.state.modeData[index].valChenged)
      {
        erlen = erlen + 1;
      }
    }
    if(erlen == this.state.modeData.length){
      Util.alert("未提交：所有值均未被修改");
      return;
    }
    this.openModal('ModalModify', true);
  }
  toModify = (data=null) => {
      //单个保存
      if(data!=null){
          //判断是否需要提交到后端
          // if(this.getAmountNumber(data) == data.amount && this.getWarningNumber(data) == data.warning)
        if(!data.valChenged)
          {
              Util.alert("未提交：值未被修改");
              return;
          }
          this.state.modeData[0] = data;
      }
        this.openModal('ModalModify', true);
  }
  /*****
   * 
   * baseTable组件的相关方法
   * 
   * 1.baseParams //表格参数，默认可以没有
   * 2.handelToLoadTable //
   * 3.resetTable //
   * 4.columns //表头数据
   * 
   * *****/


  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }
  handleChange = (param1=null,param2=null,param3=null) =>{
    //设置为待编辑状态
    this.toCacelAll();
  }
      resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  //商品设置为自营
  handleToSetSelf=(uuids,selfFlag)=>{
    let _this = this;
    let title = "该操作将设置商品为自营";
    let content = "是否确认设置为自营";
    if(selfFlag == 1){
      title = "该操作将设置商品为非自营";
      content = "是否确认设置为非自营";
    }
    confirm({
      title: title,
      content: content,
      onOk() {
        _this.setSelfSubmit(uuids,selfFlag);
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }
  //商品设置为自营
  setSelfSubmit = (uuids,selfFlag) => {
    let _uuids = [];
    if(uuids instanceof  Array){
      _uuids = uuids;
      if(isArray==true){
        this.state.modeData = [];
      }
    }
    else{
      _uuids[0] = uuids;
    }
    //改变原状态
    let _selfFlag = (selfFlag==0?1:0);
    let len = 0;
    for(let index=0;index<_uuids.length;index++){
      api.ajax('POST', '@/merchandise/ecGoods/updateGoodsSelfTypeById', {uuids:_uuids[index],selfFlag:_selfFlag})
          .then(r => {
            Util.alert("设置成功", { type: 'success' })
            len = len+1;
            this.handelToLoadTable();
          }).catch(r => {
        Util.alert("设置失败", { type: 'error' })
      })
    }
    if(len>= _uuids.length){
      Util.alert("设置成功", { type: 'success' })
    }
    this.setState({isModifyAll:this.state.isModifyAll})

  }
  //商品下架、上架，默然是下架操作
  handleToShelf = (uuids,status=0) => {
    var modeSingleData = {uuids,status};
    this.state.modeSingleData = modeSingleData;

    this.state.isModifyAll = true;
    // this.handleToShelf(this.state.modeData,0);

    this.openModal('ModalSettings', true);
  }
  //商品下架提交
  shelfSubmit = (uuids,status) => {
    let params = {
      "uuidsArr":[],"status":1,"approvalFlag":this.baseParams.approvalFlag,//"companyId": this._userInfo.companyId,
    };

    let isArray = false;
    if(uuids instanceof  Array){
      params["uuidsArr"] = uuids;
      isArray = true;
    }
    else{
      params["uuidsArr"][0] = uuids;
    }
    let str = "下架成功";
    let str2 = "下架失败";
    if(status == 1){
      str = "上架成功"
      str2 = "上架失败";
    }
    params["status"] = (status^1);//异或取反


    api.ajax('POST', '@/merchandise/ecGoods/updateGoodsTypeByModel', params)
        .then(r => {
          Util.alert(str, { type: 'success' })

          //修改总商品数量
          // let {totalCount} = this.state
          // if(1<=totalCount){
          //   totalCount -=1;
          // }else{
          //   totalCount = 0;
          // }
          // this.setState({totalCount})
          if(isArray==true){
            this.state.modeData = [];
          }

          this.handelToLoadTable();
        }).catch(r => {
      Util.alert(str2, { type: 'error' })
    })
  }

  //批量操作
  toModifyAll=()=>{
    if(!this.state.modeData || this.state.modeData.length<=0){
      Util.alert("未选中任何值");
    }
    else{
      //设置选中项为可编辑状态
      this.changeModifyToSubmit(this.state.modeData,'ModifyToSubmitAll');
      this.clickModify(this.state.modeData,'ModifyToSubmitAll');
      this.changeModifyToSubmitAll("ModifyToSubmit");
      this.state.isModifyAll = true;
    }

  }
  toCacelAll=()=>{
    this.changeModifyToSubmit(this.state.modeData,'SubmitToModifyAll');
    this.changeModifyToSubmitAll("SubmitToModify")
    this.clickCancel(this.state.modeData,'SubmitToModifyAll');
    this.state.isModifyAll = false;
  }
  toSubmitAll=()=>{
    this.changeModifyToSubmitAll("SubmitToModify")
  }
  changeModifyToSubmitAll=(flag)=>{
    if(flag == 'SubmitToModify'){
      // $('#modifyAll').css('display','block');
      $('#submitAll').css('display','none');
      $('#cancelAll').css('display','none');

      $('#modifyAll').removeAttr('style');
    }
    else if(flag == 'ModifyToSubmit'){
      $('#modifyAll').css('display','none');
      // $('#submitAll').css('display','block');
      // $('#cancelAll').css('display','block');

      $('#submitAll').removeAttr('style');
      $('#cancelAll').removeAttr('style');
    }
  }
  /***
   * 表格操作
   ***/
  clickModify = (records,flag=null) =>{
    if(records instanceof Array)
    {
      for(let id=0;id<records.length;id++){
        this.doubleClickByName(records[id],["test1","test2"],flag);
      }
    }
    else {
      this.doubleClickByName(records,["test1","test2"],flag);
    }
  }

  /***
   * 取消
   ***/
  clickCancel = (record,flag=null)=>{
    if(record instanceof  Array){
      for(let id=0;id<record.length;id++){
        this.changeSubmitOrModifyState(record[id],flag!=null?flag:'SubmitToModify');
        this.cancelClickByName(record[id],["test1","test2"]);
      }
    }else{
      this.changeSubmitOrModifyState(record,flag!=null?flag:'SubmitToModify');
      this.cancelClickByName(record,["test1","test2"]);
    }
  }
  //----------------------------------------------------------------------------
  //通用部分 ,保留
  doubleClickByName = (record,name,flag=null) =>{
    if(!name){
      return;
    }
    // if(name instanceof Array){
    //   for(let index=0;index<name.length;index++){
    //     $('#'+name[index]+'id_'+record.id).find('input').css('display','block');
    //     $('#'+name[index]+'id_'+record.id).find('a').css('display','none');
    //   }
    // }
    // else{
    //   $('#'+name+'id_'+record.id).find('input').css('display','block');
    //   $('#'+name+'id_'+record.id).find('a').css('display','none');
    // }
    this.changeModifyToSubmit(record,flag);
  }
  //通过名称做取消操作name不能为空  ,保留
  cancelClickByName = (record,name) =>{
    if(!name){
      return;
    }
    if(name instanceof Array){
      for(let index=0;index<name.length;index++){
        $('#'+name[index]+'id_'+record.id).find('input').css('display','none');
        $('#'+name[index]+'id_'+record.id).find('a').css('display','block');
        //还原值
        if(record[("_"+name[index])]){
          record[(name[index])] = record[("_"+name[index])];
        }
        record[("_"+name[index])] = null;
      }
    }else{
      $('#'+name+'id_'+record.id).find('input').css('display','none');
      $('#'+name+'id_'+record.id).find('a').css('display','block');
      //还原值
      if(record[("_"+name)] != null){
        record[(name)] = record[("_"+name)];
      }
      record[("_"+name)] = null;
    }
    this.setState(record);
  }
  //----------------------------------------------------------------------------
  /***
   * 改变按钮显示形态
   * ***/
  changeModifyToSubmit=(record,flag=null)=>{
    if(record instanceof  Array){
      for(let id=0;id<record.length;id++){
        this.changeSubmitOrModifyState(record[id],flag!=null?flag:'ModifyToSubmit');
      }
    }else {
      this.changeSubmitOrModifyState(record,flag!=null?flag:'ModifyToSubmit');
    }
  }
  /***
   * 改变按钮显示形态,保留
   * ***/
changeSubmitOrModifyState=(record,flag)=>{
    // if(flag == 'SubmitToModify'){
    //   $('#public_lowerShelf_'+record.id).css('display','none');
    //   $('#public_show_'+record.id).removeAttr("style");
    // }
    // else if(flag == 'ModifyToSubmit'){
    //   $('#public_show_'+record.id).css('display','none');
    //   $('#public_lowerShelf_'+record.id).removeAttr("style");
    // }
    // else if(flag == 'SubmitToModifyAll'){
    //   $('#public_show_'+record.id).removeAttr("style");
    //   $('#public_lowerShelf_'+record.id).css('display','none');
    // }
    // else if(flag == 'ModifyToSubmitAll'){
    //   $('#public_show_'+record.id).css('display','none');
    //   $('#public_lowerShelf_'+record.id).css('display','block');
    // }
}

  columns = [
    {
      title: '商品图片',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      width: 150,
      render: (text, record, index) => {
        if(text){
            return (
                <img className={less["show-img"]} src={text.indexOf("http")>-1 ? text : imageOrigin + text} />
            )
        }
      }
    },{
      title: '商品名称/货号',
      dataIndex: 'goodsNo',
      key: 'goodsNo',
      sorter: true,
      render: (text, record, index) => (
          <div>
            <span>{record.goodsName}</span><br/>
            <span>{record.goodsNo}</span>
          </div>
      )
    }, {
      title: '类型',
      dataIndex: 'selfFlag',
      key: 'selfFlag',
      sorter: true,
      width: 100,
      render: (text, record, index) =>{
        if(record.selfFlag == 0){
          return (<span>非自营</span>)
        }
        else{
          return (<span>自营</span>)
        }
      }
    }, {
      title: '发布时间',
      dataIndex: 'releaseTime',
      key: 'releaseTime',
      sorter: true,
      width: 180,
        render: (text) => {
          if(text){
            return moment(text).format("YYYY-MM-DD HH:mm:ss")
          }else{
            return (<div>--</div>)
          }
        }
    }, {
      title: '到期时间',
      dataIndex: 'dueTimeDate',
      key: 'dueTimeDate',
      sorter: true,
      width: 110,
      render: (text) => {
        if(text){
          return moment(text).format("YYYY-MM-DD HH:mm:ss")
        }else{
          if(text==null){
            return (<div>永久有效</div>)
          }else{
            return (<div>--</div>)
          }
        }
      }
    }, {
      title: '价格',
      dataIndex: 'minShowPrice',
      key: 'minShowPrice',
      width: 150,
      render: (text, record, index) => (
            <div>
              <span style={{color:"red"}}>￥</span>
              <span style={{color:"red"}}>{record.minShowPrice==null?0.00:record.minShowPrice}</span>
              <span style={{color:"red"}}>  -  </span>
              <span style={{color:"red"}}>￥</span>
              <span style={{color:"red"}}>{record.maxShowPrice==null?0.00:record.maxShowPrice}</span>
            </div>
      )
    }, {
      title: '操作',
      key: 'options',
      width: 120,
      render: (text, record) => {
        let button = {};
        if(record.selfFlag != 0){
          button = (<AuthButton  elmType="a"  id={'public_selfSupport_'+record.id} type="primary" onClick={() => this.handleToSetSelf(record.uuids,record.selfFlag)}>取消自营</AuthButton>);
        }
        else{
          button = (<AuthButton  elmType="a"  id={'public_selfSupport_'+record.id} type="primary" onClick={() => this.handleToSetSelf(record.uuids,record.selfFlag)}>设为自营</AuthButton>);
        }
        let str = "违规下架";
        let disable = false;
        // let show = "";
        // if(record.status == 1){
        //   str = "上架";
        // }
        // else if(record.status == 2){
        //   str = "草稿箱/撤回";
        //   disable = true;
        //   show = "none";
        // }
        // else if(record.status == 3){
        //   str = "违规下架";
        //   disable = true;
        //   show = "none";
        //
        // }
          return (
            <span>
              <AuthButton  elmType="a"  id={'public_show_'+record.id} type="primary" onClick={() => this.handleToDetails(record.uuids)}>查看</AuthButton>
              <span className="ant-divider"></span>
              <AuthButton disabled={disable}  elmType="a"  id={'public_lowerShelf_'+record.id} type="primary" onClick={() => this.handleToShelf(record.uuids,record.status)}>{str}</AuthButton>
              <span  className="ant-divider"></span>
              {button}
            </span>
          )

      }
    }
  ]



  render() {
    const modeData = this.state.modeData;
    const modeSingleData = this.state.modeSingleData;
    let tip = "统一违规下架";
    if(modeSingleData && modeSingleData["uuids"]!=undefined){
      tip="违规下架"
    }
    const { selectedRowKeys } = this.state;
    const rowCheckSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys)=>{
        this.setState({
          selectedRowKeys
        })
      }
    }
    return (
      <div>
        <BaseForm formList={this.renderFormList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
        <Card bordered={false} title="商品管理" extra={this.extraOptions()}>
          <BaseTable
            notInit={true}
            url="@/merchandise/ecGoods/page"
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns}
            indexkeyWidth={50}
            haveSelection={this.state.haveSelection}
            setSelectedItems={this.setSelectedItems}
            syncIndexCompent={this.syncIndexCompent}
            onChange={this.handleChange}
          />
        </Card>

        {/* 统一违规下架 */}
        <ModalSettings
            title={tip}
            visible={this.state.ModalSettings}
            onOk={this.openModal}
            modeData={modeData}
            modeSingleData={modeSingleData}
        />
      </div>
    )
  }
}

export default Goods