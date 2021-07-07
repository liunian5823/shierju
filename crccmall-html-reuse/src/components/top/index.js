import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { setToken } from '@/redux/action/index';
import { Row, Col, Button, Icon, Popover, Menu, Dropdown, Modal, message, Tooltip, Popconfirm } from 'antd';
import Auth from '@/utils/auth';
import api from '@/framework/axios'//请求接口的封装
import {systemConfigPath} from '@/utils/config/systemConfig';
import {getPlatformName} from '@/utils/urlUtils';
import Util from '@/utils/util';
import less from './index.less';
import logo from './img/logo.png';
import sanbtn from './img/qiehuan.png';
import userImg from './img/user.png';
import purchaseIco from './img/gallery_grid_view.png';
import dianIco from './img/dian.png';
import settingsIco from './img/settings.png';
import personalIco from './img/profile.png';
import bgIco from './img/bg.png';
import lrBtn from './img/lr_btn.png';
import logout from './img/logout.png';
import messageImg from './img/message.png';
import xunhuanIco from './img/xunhuan.png';
import gongyingIco from './img/gongying.png';
import xiaoshouIco from './img/xiaoshou.png';
const imageOrigin = SystemConfig.configs.resourceUrl;
const DropdownButton = Dropdown.Button;
const confirm = Modal.confirm;

const _pfIcos = {"purchase": purchaseIco,"xiaoshouIco":xiaoshouIco,"bgIco":bgIco,"xunhuanIco":xunhuanIco,"dianIco":dianIco,"gongyingIco":gongyingIco,"personalIco":personalIco,"settingsIco":settingsIco};
class Top extends React.Component {

  _isMounted = false
  state = {
    companyName: getPlatformName(),//子平台名称 
	platformIco: _pfIcos,//子平台图标
	navPlatforms: [],//导航栏子平台对象
	pfUrl: [],//子平台链接
	pfWidth: 110,//导航栏子平台宽度
	headPic: userImg,//用户头像
	companyul_onof: "none",//企业切换列表展示开关
	companyMenu: [],//当前登录用户任职的公司集合
	qhCompanyVisible: false,//是否显示切换企业对话框
	qhBtnLoading: false,//企业切换对话框按钮
	qhCompanyName: this.props.userInfo.companyName,//要切换的企业名称
	qhCompanyObj: '',//要切换的企业对象信息
	companyStatus: '',//公司状态
	companyInfo: {} ,//公司信息
	message:''
  }
  componentWillReceiveProps(){
	  let qhCompanyName = this.state.qhCompanyName;
	  if(!qhCompanyName || qhCompanyName == null){
		  this.setState({
			  qhCompanyName: this.props.userInfo.companyName
		  });
		  //获取用户头像及用户信息
		  this.getAccountInfo();
		  this.setcompanys(null);
	  }
  }
  componentWillMount() {
    this._isMounted = true;
	this.setState({
		qhCompanyName: this.props.userInfo.companyName
	});
	api.ajax("GET", "@/sub/subPlatform/querySubPlatformListByUserAndCompany?isHead=true", {
	}).then(r => {
		if(r.code == "200"){
			let pfUrl = [];
			r.data.map((pf,index) =>{
				pfUrl.push(pf.spUrl);
			});
			this.setState({
				navPlatforms: r.data,
				pfUrl: pfUrl
			},()=>{
				this.platforms = document.getElementsByClassName(less.platform);//子平台dom
				let curPfLeft = 0;
				let url = window.location.href;//当前浏览器url //"https://www.crccmall.com/static/center/#/home";
				$("."+less.platform).each(function(index,element){
					var cuurPfUrl = $(element).find("div").attr("id");
					//根据浏览器url和子平台url链接判断选中的子平台
					if(url == cuurPfUrl || url.indexOf(cuurPfUrl) > -1 ){ 
						$(element).addClass(less.active);
						curPfLeft = parseFloat(element.style.left);
					}
				});
				
				//当前子平台不在第一屏时把整体往左移，主当前子平台在第一屏最后一个
				this.setCurPlatform(curPfLeft);
				//获取用户头像及用户信息
				this.getAccountInfo();
				//获取信息列表
				this.getCompanyList();
				this.getMessage()
			});
		}
	}).catch(r => {
		Util.alert(r.msg);
	});
  }
  //获得公司信息
  getCompanyInfo = () => {
	  if(this.props.userInfo.companyId){
		  let companyId = this.props.userInfo.companyId;
		  api.ajax("GET","@/purchaser/company/getCompany", {
		    companyId
		  }).then(r => {
		  	  if (r.data) {
		  		  this.setState({
		  			  companyStatus: r.data.status,
		  			  companyInfo: r.data
		  		  });
		  	  }
		}).catch(r => {
		  console.log('==============err:',r)
		})
	  }
  }

  getMessage = () =>{
	api.ajax("GET", "@/message/ecMessage/selectHasNoRead", {
		uuids: this.props.userInfo.uuids
	}).then((r)=>{
		this.setState({
			message:r.data
		})
	})
  }
  
  setcompanys=(data)=>{
	  let companys = [];
  	  if(data && data.length > 0) {
  	  	data.map((item, index)=>{
  	  		//过滤当前登录的公司
  	  		if(item.ecCompanyId == this.props.userInfo.companyId){
  	  			this.setState({
  	  				qhCompanyName: item.companyName
  	  			});
  	  		}
  	  		companys.push(item);
  	  	});
  	  }
	  if(companys && companys.length < 1 && this.props.userInfo){
		  let item = {id:null,ecCompanyId:this.props.userInfo.companyId,ecUserId:this.props.userInfo.id,companyName:this.props.userInfo.companyName,approvalStatus:''};
		  companys.push(item);
		  let qhCompanyName = this.state.qhCompanyName;
		  if(!qhCompanyName || qhCompanyName == null){
			  this.setState({
				qhCompanyName: this.props.userInfo.companyName
			  });
		  }
	  }
	  if(companys != null && companys.length > 0){
	  	this.setState({
	  		companyMenu: companys
	  	});
	  }
  }
  getCompanyList=()=>{
  	  api.ajax("GET", "@/sso/companyUser/getList", {
  	  }).then(r => {
  	  	if(r.code && r.code == "200" && r.data){
  			this.setcompanys(r.data);
  	  	}else{
  			this.setcompanys(r);
  		}
  	  }).catch(r => {
  	  	this.setcompanys(null);
  	  });
  }
  componentDidMount(){
	  
  }
  //当前子平台不在第一屏时把整体往左移，主当前子平台在第一屏最后一个
  setCurPlatform = (curPfLeft) => {
	  if(curPfLeft >= 660){
	  		const platforms = this.platforms;
	  		let pfWidth = curPfLeft - 660;
			for(var i=0;i<platforms.length;i++){//把所有的子平台对象向左滚动pfWidth(子平台对象的宽度)
				 platforms[i].style.left=parseFloat(platforms[i].style.left)-pfWidth+"px";
				 platforms[i].style.transition=1+"s";
			}
	  		this.state.platforms = platforms;
	  }
  }

  componentDidUpdate() {
    /* if (this.props.userInfo.userType && this.props.userInfo.userType != 3) {
      this.outLogin()
    } */
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  getAccountInfo = () => {
      api.ajax("GET", "@/sso/ecUser/get", {
          uuids: this.props.userInfo.uuids
      }).then(r => {
          let headPic = this.state.headPic;
		  console.log('user img:',r.data.userPhotoPath)
          if(r.data && this.checkDataIsNull(r.data.userPhotoPath)){
              headPic =  imageOrigin + r.data.userPhotoPath;
          }
          this.setState({
              headPic: headPic
          })
		  this.getCompanyInfo();
      }).catch(r => {
		  this.getCompanyInfo();
        //console.log("getAccountInfo fail ------ ", r)
      })
  }
  
  //判断一个值是都为空
  checkDataIsNull=(data)=>{
      if(data == null || data == undefined || data == ''){
          return false;
      }
      return true;
  }
  //点击向左滚动  滚动的效果需要css配合position: absolute
  //tnum 每次切换的个数
  leftClick = (tnum) => {
	 let num = tnum?tnum:1;//每次切换的个数 默认为1
	 let pfWidth = this.state.pfWidth;//单个子平台宽度
	 const platforms = this.platforms;
	 let endWidth = parseFloat(platforms[platforms.length-1].style.left);//必须在滚动之前获取
	 for(var i=0;i<platforms.length;i++){//把所有的子平台对象向左滚动pfWidth(子平台对象的宽度)
		 platforms[i].style.left=parseFloat(platforms[i].style.left)-pfWidth*num+"px";
		 platforms[i].style.transition=1+"s";
	 }
	 if(endWidth<=660){//最后一个的left值小于等于一组中最后一个的left值,说明滚到最左边了,重置所有的子平台对象
		for(var j=0;j<platforms.length;j++){
			 platforms[j].style.left= (pfWidth*j)+"px";
			 platforms[j].style.transition=1+"s";
		}
	 }
	 this.state.platforms = platforms;
  }
  //点击向右滚动   tnum 每次切换的个数
  rightClick = (tnum) => {
	 let num = tnum?tnum:1;//每次切换的个数 默认为1
	 let pfWidth = 110;
  	 const platforms = this.platforms;
	 let startWidth = parseFloat(platforms[0].style.left);
  	 for(var i=0;i<platforms.length;i++){//把所有的子平台对象向左滚动pfWidth(子平台对象的宽度)
  		 platforms[i].style.left=parseFloat(platforms[i].style.left)+pfWidth*num+"px";
  		 platforms[i].style.transition=1+"s";
  	 }
  	 if(startWidth>=0){//滚到最右边了,重置所有的子平台对象
  		for(var j=0;j<platforms.length;j++){
  			 platforms[j].style.left= (pfWidth*j)+"px";
  			 platforms[j].style.transition=1+"s";
  		}
  	 }
  }
  toHome = () => {
    //跳转商城首页
    window.location.href = systemConfigPath.jumpPlatforms('static/crccmall/#/home');
  }


  toMessage = () => {
	  message.info('暂未开通');
    //this.props.history.push('/message/messageList')
  }

//跳转到子平台
  toPlatform = (platform) => {
	 
  	  // 点击电子招标平台，不校验权限---jiaoxuejian
	  if(platform.spType === 9) {
		  window.location.href = systemConfigPath.jumpStagePage('home');
		  return false;
	  }
	  //---------------------------------------------------------
	  
	  console.log('=============点击子平台:',platform.spUrl);
	  let companyId = '';
	  if(this.props.userInfo && this.props.userInfo.companyId){
		  companyId = this.props.userInfo.companyId;
	  }
	  if(companyId == ''){
		  Util.alert("未获取到企业信息。", { type: "info" });
		  return ; 
	  }
	  console.log('=============this.state.companyStatus:',this.state.companyStatus);
	  
	  let {companyStatus, companyInfo} = this.state;
	 
	  if(companyStatus == 3){
		  if(platform.spType === 10) {
			  return;
		  }
		 
		confirm({
			title: '您所在的企业未通过审核，请先完善信息！',
			okText: '去完善',
			cancelText: '我知道了', 
			onOk: function() {
				if(companyInfo.type==0) {
					window.location.href= systemConfigPath.jumpPlatforms('static/crccmall/index.html#/purchaser');
				} else {
					window.location.href= systemConfigPath.jumpPlatforms('static/crccmall/index.html#/twoRegister');
				}
			}
		});
		return;
	  }

		if(companyStatus == 1 || companyStatus == 4) {
			Util.alert("企业审核中，请耐心等待。", { type: "info" });
			return;
		}
	  if(platform.spType != 10 && platform.spType != 11 && companyStatus != 2 && companyStatus != 5 && companyStatus != ''){
		  Util.alert("企业审核中，请耐心等待。", { type: "info" });
		  return; 
	  }
	  console.log('========platform:',systemConfigPath.jumpPlatforms(platform.spUrl))


	  if(platform.spType == 10){
		  window.location.href=systemConfigPath.jumpPlatforms(platform.spUrl);
		  //window.location.reload();
		  return true;
	  }

	  let subPlatformId = platform.id;
	  let params = "?companyId=" + companyId +"&subPlatformId="+subPlatformId;
	  if(companyStatus == 2) { //只有公司信息审核通过后才检验是否开通子平台和跳转
		  api.ajax("GET", "@/sub/companySubPlatform/authSubPlatformSwitch"+params, {
		  }).then(r => {
			
			  console.log('==============:::',r)
			  if(r.code == "200") {
				
				  let url = systemConfigPath.jumpPlatforms(platform.spUrl);
				  //如果子平台url包含http或https则为站外链接
				//   console.log(platform.spUrl)
				// return
				  if(platform.spUrl.indexOf("http:") != -1 || platform.spUrl.indexOf("https:") != -1){
					  url = platform.spUrl;
				  }
				  console.log("url:",url);
				  this.props.history.push('/circulation')
				// console.log(systemConfigPath.jumpPlatforms('/circulation'))
				// return
					// window.location.href = systemConfigPath.jumpPlatforms('/circulation');
				  if(url.indexOf("/center/") > 0 && subPlatformId == 11){//这个代码只能在center代码库吗，重新加载一下   渲染头部子平台选中

					window.location.reload();
				  }
			  }
		  }).catch(async r => {

		  		  let msg = r.msg;
		  		  if(r.msg && r.msg != undefined){
		  			msg = msg.replace('PLATFORMNAME',platform.spName)
		  			  console.log('============msg:',msg)
		  		  }
		  		  //您所在的公司未开通XXXXX业务！
		  		  if(r.code == "400804"){
		  			  if(subPlatformId==11) {
		  				Util.alert("公司信息审核通过后会自动为公司管理员开通!", { type: "info" });
		  				return;
		  			  }
		  			  let ismember = false;
		  			  if(subPlatformId==4) {
		  				let params= {
		  					businessLicense: this.state.companyMenu?this.state.companyMenu[0].socialCreditCode:'',
		  					companyId: this.state.companyMenu?this.state.companyMenu[0].companyId:''
		  				}
		  				try {
		  					await api.ajax('POST',
		  						'@/sub/ecmember/checkMemberExist',
		  						{...params}
		  					).then(r => {
		  					}).catch(r => {
		  						ismember = true;
		  					})
		  				} catch (err){
		  					console.log(err)
		  				}
		  			  }
		  			  if(ismember) {
		  				Util.alert("外部单位暂不允许开通物资采购业务!", { type: "info" });
		  				return;
		  			  }
		  			  let param = "&appUuids=";
		  			  let btnTxt = "开通";
		  			  let msgContent = '您是否需要去开通'+platform.spName+'业务!';
		  			  if(platform.approvalStatus != null && platform.approvalStatus == 1){//待审核
		  			  	Util.alert(platform.spName+"业务申请开通信息审核中。", { type: "info" });
		  			  	return false; 			  
		  			  }
		  			  if(platform.approvalStatus != null && platform.approvalStatus == 3){//驳回了
		  				  if(platform.applicationUserId == this.props.userInfo.id){
		  					  param += platform.appUuids;
		  					  msg = platform.spName+"业务申请被驳回";
		  					  msgContent = "您的申请信息被驳回,是否需要去完善信息?";
		  					  btnTxt = "完善";
		  				  }
		  			  }
		  			  confirm({
		  			      title: msg,
		  			      content: msgContent,
		  				  okText: '去'+btnTxt,
		  				  cancelText: '不'+btnTxt,
		  			      onOk: function() {
		  					window.location.href= systemConfigPath.jumpPlatforms(`static/crccmall/index.html#/subPlatform?spType=${platform.spType}`+param);
		  			      },
		  			      onCancel: function() {}
		  			    });
		  		  }
		  		  //您没有PLATFORMNAME业务的权限！
		  		  else if(r.code == "400904"){
		  			  if(platform.spType == 11){//重新加载一下   渲染头部子平台选中
		  			  	Util.alert("暂无权限，如需开通请联系公司管理员配置权限。", { type: "info" });
		  			  }else{
		  				  confirm({
		  					  title: msg,
		  					  content: '您是否需要去申请'+platform.spName+'业务的权限!',
		  					  okText: '去申请',
		  					  cancelText: '不需要',
		  					  onOk: function() {
		  						 let url = "static/crccmall/#/subAccount?params=C" + companyId+"P"+platform.id;
		  						window.location.href=systemConfigPath.jumpPlatforms(url);
		  					  },
		  					  onCancel: function() {}
		  					  
		  				}); 
		  			  }
		  		  }
		  		  //在此平台帐号审核中
		  		  else if(r.code == "400906"){
		  		  	Util.alert(msg, { type: "info" });
		  		  }
		  		  //在此平台帐号驳回
		  		  else if(r.code == "400908"){
		  			confirm({
		  				title: msg,
		  				content: r.data?'驳回原因：' + r.data.approval_reason:'',
		  				okText: '去申请',
		  				cancelText: '取消', 
		  				onOk: function() {
		  					window.location.href= systemConfigPath.jumpPlatforms(`static/crccmall/index.html#/subAccount?params=C${companyId}U${r.data?r.data.uuids: ''}`);
		  				}
		  			});
		  		  }
		  		  //账号在此平台被停用
		  		  else if(r.code == "400905"){
		  			  Util.alert(msg, { type: "info" });
		  		  }
		  });
	  }
  }
  
  checkPlatform = (platform)=>{
	  api.ajax("GET", "@/platform/workOrders/subPlatformApplyOrdersPage", {
			workOrdersType: 3,
			userId: this.props.userInfo.id,
			companyId: this.props.userInfo.companyId
	  }).then(r => {
	  		  console.log('==============:::',r)
	  		  if(r.code == "200") {
	  			  window.location.href=systemConfigPath.jumpPlatforms(platform.spUrl);
	  			  //window.location.reload();
	  		  }
	  }).catch(r => {
		  
	  });
  }
  
  //退出
  outLogin = () => {
      // TO-DO 这里临时设置为清除后台登录状态成功后
	  let flag = 500;
      if (Auth.hasToken()) {
          api.ajax("POST", "@/sso/loginControl/loginOut", {
          }).then(r => {
			  flag = r.code;
			  console.log('success:',r.msg)
			  const { dispatch } = this.props;
			  dispatch(setToken(''));
			  Auth.removeToken();//删除登录状态
			  //this.jumpOutLogin();
			  window.location.href=systemConfigPath.jumpPlatforms("static/crccmall/#/home");
			  window.location.reload();
          }).catch(r => {
			  console.log('error111:',flag)
			  if(flag == 200 || flag == "200"){
				  //this.jumpOutLogin();
				  window.location.href=systemConfigPath.jumpPlatforms("static/crccmall/#/home");
				  //window.location.reload();
			  }
              Util.alert(r.msg, { type: "error" })
          })
      } else {
		  console.log('没有登录:')
          this.jumpOutLogin();
      }
  }
  
  jumpOutLogin=()=>{
      //console.log("jumpOutLogin ---------------- ", SystemConfig.configs.loginUrl)
	  window.location.href=systemConfigPath.jumpPlatforms("static/crccmall/#/login");
      //this.props.history.push('/login');
      //window.location.href=SystemConfig.configs.loginUrl;   //1.0退出跳转
  }
  //企业切换列表展示
  companyQh=()=>{
	  this.setState({
		  companyul_onof: "block"
	  });
  }
  
  showQhModal=(company)=> {
      this.setState({
		qhCompanyObj: company,
        qhCompanyVisible: true
      });
    }
  qhHandleCancel=() =>{
      this.setState({ qhCompanyVisible: false });
    }
  qhHandleOk=() =>{
      this.setState({ 
		qhBtnLoading: true
	  });
	  this.changeCompany(this.state.qhCompanyObj, this.state.companyInfo);
      setTimeout(() => {
        this.setState({ qhBtnLoading: false, qhCompanyVisible: false });
      }, 1500);
    }
	//切换企业
	changeCompany=(company,companyInfo)=>{
		if(company){
			//审核未通过
			if(company.approvalStatus == 3) {
				confirm({
					title: '友情提示',
					content: (<span>您递交的企业资料未通过平台审核，请根据提示修改后再次递交。</span>),
					okText: "完善资料",
					cancelText: '关  闭',
					onCancel() {}, 
					onOk() {
						let loginIpStr = window.returnCitySN ? JSON.stringify(window.returnCitySN) : '';
						api.ajax('POST', '@/sso/companyUser/switch', {
							ecCompanyId: company.ecCompanyId,
							loginIpStr
						},{headers: {change_content_type: true}}).then(r => {
							if(companyInfo.type==0) {
								window.location.href= systemConfigPath.jumpPlatforms('static/crccmall/index.html#/purchaser');
							} else {
								window.location.href= systemConfigPath.jumpPlatforms('static/crccmall/index.html#/twoRegister');
							}
						}).catch(r => {
							Util.alert(r.msg, {type: "error"});
						})
					}       
				});
				return;
			} else if(company.approvalStatus == 2) {
				//审核通过，可以切换
				//,"ecUserId":this.props.userInfo.id,"loginIpStr": {cip:'',cid:'310000','cname':'上海市'}
				api.ajax("POST", "@/sso/companyUser/switch", {"ecCompanyId":company.ecCompanyId
				},{headers: {change_content_type: true}}).then(r => {
					if(r.code == "200"){
						window.location.href=systemConfigPath.jumpPlatforms('static/center/index.html#/home');
						window.location.reload();
						this.setState({
							qhCompanyName: this.state.qhCompanyObj.companyName
						})
					}
				}).catch(r => {
					Util.alert(r.msg, { type: "error" });
				});
			} else if(company.approvalStatus == 0 || company.approvalStatus == "0") {
				let msg = "您当前未注册公司或注册的账号未审核";
				if(company.ecCompanyId != ''){
					msg = "您注册公司信息不完善,点击去注册按钮完善信息";
				}
				confirm({
					title: '友情提示',
					content: (<span>{msg}</span>),
					okText: "完善资料",
					cancelText: '关  闭',
					onCancel() {}, 
					onOk() {
						let loginIpStr = window.returnCitySN ? JSON.stringify(window.returnCitySN) : '';
						api.ajax('POST', '@/sso/companyUser/switch', {
							ecCompanyId: company.ecCompanyId,
							loginIpStr
						},{headers: {change_content_type: true}}).then(r => {
							if(companyInfo.type==0) {
								window.location.href= systemConfigPath.jumpPlatforms('static/crccmall/index.html#/purchaser');
							} else {
								window.location.href= systemConfigPath.jumpPlatforms('static/crccmall/index.html#/twoRegister');
							}
						}).catch(r => {
							Util.alert(r.msg, {type: "error"});
						})
					}       
				});
				return;
			} else {
				// 未审核或审核中
				Util.alert("您的企业资质正在审核中，平台将尽快完成审核。", { type: "info" });
				return;
			}
		}
	}
  
  
  render() {
	  console.log('top userInfo companyId',this.props.userInfo.companyId)
	  const companyMenu = this.state.companyMenu;
	  const menu = <Menu className={less.menuul}>{companyMenu.map((item, index) => {
	  			        return (
	  			            <Menu.Item key={index}>
								<Tooltip title={item.companyName} placement="left">
	  			              		<a href="javascript:;" onClick={this.showQhModal.bind(this, item)}>{item.companyName}</a>
								</Tooltip>
	  			            </Menu.Item>
	  			        )
	  			    })
	  			}</Menu>
	const contentTitle = <div><p>点击跳转至商城首页</p></div>;
    const popover = <div><p>{this.state.qhCompanyName}</p><p>{this.props.userInfo.email}</p></div>
    return (
      <div className={less.main_top}>
        <div className={less.top_container}>
          {/*logo*/}
		  <Popover content={contentTitle} trigger="hover" placement={"bottom"}>
			<div className={less.logo} onClick={this.toHome}><img src={logo} alt="铁建商城" /></div>
		  </Popover>
          {/*左滚动按钮*/}
          <div className={less.leftbtn} onClick={this.rightClick.bind(this, 1)}><img src={lrBtn} /></div>
          {/*子平台*/}
          <div className={less.flatforms}>
			{this.state.navPlatforms.map((platform, index) => {
			        return (
			            <div key={index} className={less.platform} style={{"left":(index*this.state.pfWidth)+"px"}}>
			            	<div onClick={this.toPlatform.bind(this, platform)} id={platform.spUrl} style={{cursor: "pointer"}}>

			            		<p><img src={this.state.platformIco[platform.spIcon]}/></p><p className={less.platefrom_name}>{platform.spName}</p>
			            	</div>
			            </div>
			        )
			    })
			}
          </div>
          {/*右滚动按钮*/}
          <div className={less.rightbtn} onClick={this.leftClick.bind(this, 1)}><img src={lrBtn} /></div>
          {/*右侧信息*/}
          <div className={less.right_info}>
            {/*用户头像*/}
            <div className={less.user_img}><img src={this.state.headPic} width="42px" heigth="42px"/></div>
            <div className={less.user_info} style={{position: 'relative'}}>
              {/*用户名、消息*/}
              <div>
				<span className={less.username} title={this.props.userInfo.username}>{this.props.userInfo.username}</span>
				<span className={less.fenge} onClick={this.toMessage.bind()}><img src={messageImg} width="18px"/></span>
				{this.state.message > 0 ?
				<p style={{width:'10px',height:'10px',backgroundColor: 'red',borderRadius: '50%',position: 'absolute',right:'35px',top:'-5px'}}></p>
				:''
				}
				<Popconfirm title="确定要退出吗？" onConfirm={this.outLogin.bind()}>
					<span className={less.out}><img src={logout} width="17px"/></span>
				</Popconfirm>
			  </div>
              {/* 企业切换 */}
              <div className={less.qh_conpany}>
				<div style={{backgroundImage: "url("+sanbtn+")"}}>
					<Dropdown overlay={menu}>
					    <a className="ant-dropdown-link" href="javascript:;" style={{color: '#fff'}} title={this.state.qhCompanyName}>
						{this.state.qhCompanyName}
					    </a>
					</Dropdown>
				</div>
				<Modal ref="modal"
				   visible={this.state.qhCompanyVisible}
				   title="切换组织" onOk={this.qhHandleOk} onCancel={this.qhHandleCancel}
					footer={[
					  <Button key="back" type="ghost" size="large" onClick={this.qhHandleCancel}>取 消</Button>,
					  <Button key="submit" type="primary" size="large" loading={this.state.qhBtnLoading} onClick={this.qhHandleOk}>
						确 定
					  </Button>
					]}>
					<p style={{fontSize: "16px",fontWeight: 500}}>您是否要切换到<span style={{color: "red"}}>{this.state.qhCompanyObj.companyName}</span>进行登录?</p>
				  </Modal>
			  </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(Top))