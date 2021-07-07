import { Card,Tabs,Popconfirm,message, Button, Modal, Row, Col, Form, Input} from 'antd'
import api from '@/framework/axios'//请求接口的封装
import { connect } from 'react-redux'
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import BaseTableAllItems from '@/components/baseTable/backAllItems'
import less from './index.less'
import './messagestyle.css';
import {exportFile, getUrlByParam} from '@/utils/urlUtils';
import Util from '@/utils/util';
import { utc } from 'moment'

const TabPane = Tabs.TabPane

class signatureManagementList extends React.Component {
        _clientId = null
        _clientTime = null
         state = {
             loading: false,
             tableState1: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
             tableState2: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
             tableState3: 0,//tableState3//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
             tableState4: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
             tableState5: 0,//tableState5//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
             tableState6: 0,//tableState6//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
             hasSelected: false,
             selectedItems: [],
             modalVisible: false,
             signInfo:{
                contractPhone: "",
                signUser: "",
                signComp:"中铁建金服科技（天津）有限公司",
             },
             codeTime:-1,
             codeLoading: false,
             Btloading: false,
             picUrl: "",//校验码图片url
         }
            activeTab = 1
           //控制展示的字段
            importantFilter = ['contractName', 'companyName']//name
          //公司名称,查看
             findDetails = (record,isDetails)=>{
             let url =isDetails? '/supplier/recommendedSupplier?sellerUuids='+ record.companyUuids:record.contractUrl;
             let param = {};
             window.open(SystemConfig.systemConfigPath.jumpPage(getUrlByParam(url, param)))
           }

    // 搜索所有条件
    formList = [{
        type: 'INPUT',
        field: 'contractName',
        label: '合同名称',
        placeholder: '请输入',
    }, {
        type: 'INPUT',
        field: 'companyName',
        label: '公司名称',
        placeholder: '请输入'
    }, {
        type: 'INPUT',
        field: 'contractCode',
        label: '合同编号',
        placeholder: '请输入'
    }, {
        type: 'DATEPICKER',
        field: 'createTime',
        label: '合同生成时间',
        placeholder: '请选择'
    }, {
        type: 'DATEPICKER',
        field: 'effectiveTime',
        label: '生效时间',
        placeholder: '请选择'
    }, {
        type: 'INPUT',
        field: 'supplierSigner',
        label: '签章人',
        placeholder: '请输入'
    }, {
        type: 'INPUT',
        field: 'platformSigner',
        label: '平台签章人',
        placeholder: '请输入'
      }];

    handleFilter = (p, isSend = true) => {
        let createTime = p.createTime?moment(p.createTime).format("YYYY-MM-DD"):undefined;
        let effectiveTime = p.effectiveTime?moment(p.effectiveTime).format('YYYY-MM-DD'):undefined;
        let key = this.activeTab;
        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
            createTime,
            effectiveTime
        };
        if(isSend){
            this.reloadTableData();
        }
        };
    componentWillMount(){
        this._isMounted = true;
        this._clientId = Util.randomString(64)
        // 每10分钟刷新一次
        this._clientTime = setInterval(() => {
        this._clientId = Util.randomString(64)
            //this.getImg();
            this.forceUpdate();
        }, 60000)
        };
    componentWillUnmount(){
        this._isMounted = false;
        };
        //全部
        baseParams0 =
        {

        };
        //待签章
        baseParams1 = {
        contractState: 1
        };
        //供应商未签章
        baseParams2 = {
        contractState: 0
        };
        //已生效
        baseParams3 = {
        contractState: 3
        };
        //待生效
        baseParams4 = {
        contractState: 2
        };
        //失效作废
        baseParams5 = {
        contractState: 4,
        contractState: 5
      };

      handelToLoadTable = (state = 1, tableState = 'tableState') => {
          this.setState({
              [tableState]: state
          })
      };

      resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
      };

      reloadTableData =(state = 1)=> {
          let key = this.activeTab;
          this.handelToLoadTable(state, 'tableState' + key);
      }

      handleChangeTab = (key) => {
          this.activeTab = key;
          this.reloadTableData();
          if(key==1){
              this.setState({
                hasSelected: false,
                selectedItems: [],
              })
          }
      };

    columns1 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 220,
        render:(text,record)=> {
            return <span style={{width: "220px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 220,
        render:(text,record)=> {
            return <span style={{width: "220px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 220,
        render:(text,record)=>{
            return<a style={{width: "220px"}} className={less.plat_table_text} href="javascript:void(0);"
                     onClick={this.findDetails.bind(this,record,true)}>{text}</a>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        render: (text) => {
            return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        render: (text) => {
            return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 150,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 130,
    }, {
        title: '操作',
        key: 'optionfs',
        fixed: 'right',
        width:200,
        render: (text, record) =>  {
            return <p style={{width:"180px"}}>{this.html(record)}</p>
        }
    }]
    columns2 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 200,
        render:(text,record)=> {
              return  <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
          }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 200,
        render:(text,record)=> {
                  return <span style={{width: "180px"}} className={less.plat_table_text} title={text}>{text}</span>
              }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
        render:(text,record)=>{
                  return<a style={{width: "180px"}} className={less.plat_table_text} href="javascript:void(0);"
                           onClick={this.findDetails.bind(this,record,true)}>{text}</a>
              }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:100,
        render: (text) => {
                  return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
              }
    }, {
        title: '操作',
        key: 'options',
        width:200,
        render: (text, record) =>  {
            return <p style={{width:"180px"}}>{this.html(record)}</p>
        }
      }]

    columns3 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 150,
        render:(text,record)=> {
            return  <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 150,
        render:(text,record)=> {
            return <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 150,
        render:(text,record)=>{
            return<a style={{width: "134px"}} className={less.plat_table_text} href="javascript:void(0);"
                     onClick={this.findDetails.bind(this,record,true)}>{text}</a>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:120,
        render: (text) => {
            return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:160,
        render: (text) => {
            return <p style={{width:"140px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 130,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:100,
        render: (text) => {
            return <p style={{width:"100px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '操作',
        key: 'optjiongs',
        fixed: 'right',
        width: 150,
        render: (text, record) =>  {
            return <p style={{width:"150px"}}>{this.html(record)}</p>
        }
    }]
    columns4 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 180,
        render:(text,record)=> {
            return <span style={{width: "160px"}} className={less.plat_table_text} title={text}>{text}</span>
              }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 180,
        render:(text,record)=> {
            return <span style={{width: "160px"}} className={less.plat_table_text} title={text}>{text}</span>
                }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 180,
        render:(text,record)=>{
            return<span style={{width: "160px"}} className={less.plat_table_text} title={text}>
                <a  href="javascript:void(0);"
                    onClick={this.findDetails.bind(this,record,true)}>{text}</a></span>
            }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:150,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
                }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:150,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
                }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 150,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:150,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
                }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '作废原因',
        dataIndex: 'approvalReason',
        key: 'approvalReason',
        width: 150,
        render:(text,record)=> {
            return <p style={{width: "130px"}} className={less.plat_table_text}>{text}</p>
                }
    }, {
        title: '操作人',
        dataIndex: 'approveOfficerName',
        key: 'approveOfficerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'approvePhone',
        key: 'approvePhone',
        width: 130,
    }, {
        title: '操作',
        key: 'oaptiaons',
        fixed: 'right',
        width: 100,
        render: (text, record) =>  {
            return <p style={{width:"80px"}}>{this.html(record)}</p>
        }
        }]
    columns5 = [{
        title: '状态',
        dataIndex: 'contractStateStr',
        key: 'contractStateStr',
        sorter: true,
        width:100,
        render: (text,record)=>{
              let stylenum = ''
                if(record.contractState == 1){
                    stylenum = 3
                }
                if(record.contractState == 0){
                    stylenum = 3
                }
                if(record.contractState == 3){
                    stylenum = 1
                }
                if (!(record.contractState == 2 || record.contractState == 4 || record.contractState == 5)) {
                } else {
                    stylenum = 2
                }
                return( <p style={{width:"60px"}} className={'state'+ stylenum}>{text}</p>)
            }
    }, {
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width:150,
        render:(text,record)=> {
            return <span style={{width: "120px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width:150,
        render:(text,record)=> {
            return <span style={{width: "120px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width:150,
        render:(text,record)=>{
            return <span style={{width: "120px"}} className={less.plat_table_text} title={text}>
                <a onClick={this.findDetails.bind(this,record,true)}>{text}</a></span>
            }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:130,
        render: (text) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:130,
        render: (text,record) => {
            return <p style={{width:"130px"}}>{text?moment(text).format("YYYY-MM-DD"):"-"}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 150,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 130,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:100,
        render: (text) => {
            return <p style={{width:"100px"}}>{text?moment(text).format("YYYY-MM-DD"):"-"}</p>
        }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '作废原因',
        dataIndex: 'approvalReason',
        key: 'approvalReason',
        width: 150,
    }, {
        title: '操作人',
        dataIndex: 'approveOfficerName',
        key: 'approveOfficerName',
        width: 180,
    }, {
        title: '联系电话',
        dataIndex: 'approvePhone',
        key: 'approvePhone',
        width: 130,
    }, {
        title: '操作',
        key: 'optiofghns',
        fixed: 'right',
        width:180,
        render: (text, record) =>  {
            return <p style={{width:"180px"}}>{this.html(record)}</p>
        }
    }]

    columns6 = [{
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        sorter: true,
        width: 150,
        render:(text,record)=> {
            return  <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: 150,
        render:(text,record)=> {
            return <span style={{width: "134px"}} className={less.plat_table_text} title={text}>{text}</span>
        }
    }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 150,
        render:(text,record)=>{
            return<a style={{width: "134px"}} className={less.plat_table_text} href="javascript:void(0);"
                     onClick={this.findDetails.bind(this,record,true)}>{text}</a>
        }
    }, {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width:120,
        render: (text) => {
            return <p style={{width:"80px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '供应商签章时间',
        dataIndex: 'supplierSignatureTime',
        key: 'supplierSignatureTime',
        sorter: true,
        width:160,
        render: (text) => {
            return <p style={{width:"140px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '签章人',
        dataIndex: 'supplierSignerName',
        key: 'supplierSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'supplierPhone',
        key: 'supplierPhone',
        width: 130,
    }, {
        title: '生效时间',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        sorter: true,
        width:100,
        render: (text) => {
            return <p style={{width:"100px"}}>{text?moment(text).format("YYYY-MM-DD"):undefined}</p>
        }
    }, {
        title: '平台签章人',
        dataIndex: 'platformSignerName',
        key: 'platformSignerName',
        width: 130,
    }, {
        title: '联系电话',
        dataIndex: 'platformPhone',
        key: 'platformPhone',
        width: 130,
    }, {
        title: '操作',
        key: 'optjiongs',
        fixed: 'right',
        width: 150,
        render: (text, record) =>  {
            return <p style={{width:"150px"}}>{this.html(record)}</p>
        }
    }]
    //各个列里的操作
    html = (record)=>{
        let arr = [];
        if(record.contractState==1){
            arr.push(<a onClick={this.jumpSignPage.bind(this,record.uuids)}>签章</a>)
        }
        if(record.contractState==0||record.contractState==1||record.contractState==2||
            record.contractState==3||record.contractState==4||record.contractState==5){
            arr.push(<a target="_blank"
            onClick={()=>{
                //window.open(SystemConfig.systemConfigPath.dfsPathUrl(record.contractUrl))
                let params = {
                    filePath : record.contractUrl
                }
                exportFile("/common/upload/exportFastdfsFile",params);
            }}
        >下载</a>
            )
        }
        if((record.contractState==0||record.contractState==3||record.contractState==2||record.contractState==1)&&record.contractId!=null){
            arr.push(<Popconfirm title="您确认要重新生成该条记录吗？" onConfirm={this.handleToRebuild.bind(this,record.contractId,record.companyId,record.uuids)}><a>重新生成</a></Popconfirm>)
        }

        let arr2 = [];
        for(let i = 0;i<arr.length;i++){
            arr2.push(arr[i]);
            if((i+1) != arr.length){
                arr2.push(<span className="ant-divider"/>)
            }
        }
        return arr2
    }

    handleToRebuild = (contractId,companyId,uuids) => {
        api.ajax('GET',"!!/common/contract/updateRebuild", {
                contractId,
                companyId,
                uuids
        }).then(r => {
            this.reloadTableData();
        });
    }
    //跳转签章页面
    jumpSignPage=(uuids,record)=>{
        let that = this;
        //加实时状态校验
        api.ajax('GET',"!!/common/contract/getContractSignDetail",{
                uuids:uuids
        }).then(r =>{
          if(r.data) {
              if (r.data.contractState == 1) {
                  /*location.href = SystemConfig.systemConfigPath.axiosUrlGaoda("/common/contractSign/main?k=" + window.btoa(uuids)+"&p="+window.btoa(that.props.userInfo.id)+"&t=1");*//*
                  let childWindow = window.open(SystemConfig.systemConfigPath.axiosUrlGaoda("/common/contractSign/main?k=" + window.btoa(uuids)+"&p="+window.btoa(that.props.userInfo.id)));
                  childWindow.onbeforeunload =()=>{
                      this.reloadTableData();
                  }*/
                  window.open(SystemConfig.systemConfigPath.axiosUrlGaoda("/common/contractSign/main?k=" + window.btoa(uuids)+"&p="+window.btoa(that.props.userInfo.id))+"&t=1");
              }
              else if (r.data.contractState == 2 || r.data.contractState == 3) {
                  message.error("平台已签章,请勿重复操作");
              }
          }
        });
    }

    setSelectedItems = (el, value) =>{
        console.log(value)
        let hasSelected = 0
        hasSelected = !!value.length
        this.setState({
            hasSelected,
            selectedItems:value
        })
    }
    //批量签章对话框表单提交
    handleSubmit =(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
          if (!!errors) {
            return;
          }
          //console.log(values);
          this.setState({
            Btloading: true
          },()=>{
            this.validateImg()
          })
        });
    }
    //验证图片验证码
    validateImg = () => {
        this.props.form.validateFields(['captchaCode'], (errors, values) => {
        if (!!errors) {
            this.setState({Btloading: false})
            return;
        }
        api.ajax('POST', '@/sso/ecCaptchaController/validateCaptchaCode', {
            ...values,
            clientId: this._clientId
        }).then(r => {
            console.log(r)
            this.provingPhoneMsg()
        }).catch(e => {
            this.setState({
                Btloading: false
              })
            Util.alert(e.msg, { type: 'error' })
            this.props.form.resetFields(['captchaCode'])
            this.getImg()
        })
        })
    }
    smsCodeBtn = () => {
        if (this.state.codeTime >= 0) {
          return <Button disabled={true} className={less.sms_btn} >短信验证码({this.state.codeTime})</Button>
        } else {
          return <Button type="primary" className={less.sms_btn} onClick={this.sendPhoneCode} loading={this.state.codeLoading}>发送短信验证码</Button>
        }
    }
     /**
     * 发送手机验证码
     */
    sendPhoneCode = () => {
        if (!!this.state.codeLoading) {
            return;
        } else {
            this.setState({
                codeLoading: true
            })
        }
        let params = {};
        params.scene = 'CONTRACTSIGN';
        params.phone = this.state.signInfo.contractPhone
        //发送验证码
        api.ajax("GET", "@/common/phoneMsg/sendSimpleSms", {
            ...params
        }).then(r => {
            this.setState({
                codeLoading: false
            })
            this.toTiming(1);
            message.success(`短信验证码已发送至${this.state.signInfo.contractPhone}`);
        }).catch(e=>{
            this.setState({
                codeLoading: false
            })
            message.error(e.msg);
        });
    }
    // 校验短信验证码
    provingPhoneMsg = () => {
        this.props.form.validateFields(['smsCode'], (errors, values) => {
            if (!!errors) {
                this.setState({Btloading: false})
                return;
            }
            let code = values.smsCode
            api.ajax("GET", `@/common/phoneMsg/provingPhoneMsg?phone=${this.state.signInfo.contractPhone}&code=${code}&scene=CONTRACTSIGN`, {}
            ).then(r => {
                //console.log(r)
                if(r.data){
                    this.sign() 
                }else{
                    this.setState({
                        Btloading: false
                      })
                    message.error("短信验证码校验失败")
                }
            }).catch(e =>{
                //console.log(e)
                this.setState({
                    Btloading: false
                  })
                message.error(e.message)
            })
        })
    }
    //批量签章
    sign = () =>{
        ///api/common/contractSign/signList?contractIdListStr=12,23,23
        let { selectedItems } = this.state
        let contractIdList = []
        selectedItems.forEach(el => {
            contractIdList = [...contractIdList, el.contractSignId]
        });
        let contractIdListStr = contractIdList.join(",")
        api.ajax("GET", `@/common/contract/signList?contractIdListStr=${contractIdListStr}`, {
        }).then(r => {
            console.log(r)
            this.setState({
                Btloading: false
              })
            this.setModalVisible(false) //关闭签章对话框
            this.handleChangeTab(1) // 刷新tab下的data
            this.toTiming(0)// 重置短信验证码获取按钮
            Modal.success({
                title: '批量签章',
                content: (
                    <div>
                        <p>已进行批量处理,处理时间过长</p>
                        <p>批量签章结束后将通过短信、邮件通知签章负责人</p>
                    </div>
                ),
            });
            
        }).catch(e =>{
            //console.log(e)
            this.setState({
                Btloading: false
              })
            Modal.error({
                title: '批量签章',
                content: e.msg ? e.msg : e.message ? e.message : "未知错误",
            });
        })
    }
    //timer = setTimeout(() => { this.toTiming() }, 1000)
    //开始计时
    toTiming = (reset) => {
        if (!this._isMounted) { return }
        let time = this.state.codeTime;
        if (reset == 1) {
            time = 61
        }else if(reset == 0){
            //clearInterval(this.timer);
            this.setState({
                codeTime: -1
            })
            time = -1
        }
        if (time >= 0) {
            this.setState({
                codeTime: --time
            })
            //this.timer
            setTimeout(() => { this.toTiming(-1) }, 1000)
        }
    }
    // 获得图形验证码
    getImg = () => {
        //let elmImg = document.getElementById('img');
        this.setState({
            picUrl: SystemConfig.configs.ecCaptchaUrl + '/sso/ecCaptchaController/ecCaptcha' + '?' + 'clientId=' + this._clientId + '&_=' + Math.random()
        })
        //elmImg.src =  SystemConfig.configs.ecCaptchaUrl + '/sso/ecCaptchaController/ecCaptcha' + '?' + 'clientId=' + this._clientId + '&_=' + Math.random();
    }
    //对话框内容
    modalContent = () =>{
        let {selectedItems ,signInfo} = this.state
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          };
        return (<div>
            <Row key={1} className={less.modalRow} type="flex" align="middle">
                <Col className={less.c1} span={8}>待签章合同数：</Col>
                <Col className={less.c2} span={16}>{selectedItems.length}份</Col>
            </Row>
            <Row key={2} className={less.modalRow} type="flex" align="middle">
                <Col className={less.c1} span={8}>签章人：</Col>
                <Col className={less.c2} span={16}>{signInfo.signUser}</Col>
            </Row>
            <Row key={3} className={less.modalRow} type="flex" align="middle">
                <Col className={less.c1} span={8}>联系方式：</Col>
                <Col className={less.c2} span={16}>{signInfo.contractPhone}</Col>
            </Row>
            <Row key={4} className={less.modalRow} type="flex" align="middle">
                <Col className={less.c1} span={8}>签章信息：</Col>
                <Col className={less.c2} span={16}>{signInfo.signComp}</Col>
            </Row>
            <Form.Item style={{marginTop:"5px"}} {...formItemLayout} label={"短信验证码："} key={5}>
                <Input placeholder="请输入短信验证码"
                    maxLength={6}
                    {...getFieldProps('smsCode', {
                    rules: [
                        { required: true, message: '请输入短信验证码' },
                    ],
                    })}
                    style={{"width":"127px"}}
                />
                {this.smsCodeBtn()}
            </Form.Item>
            <Row className={less.modalRow} type="flex" align="top" style={{"margin-bottom": "15px"}}>
                <Col className={less.jym} span={8} style={{"line-height": "32px"}}>校验码：</Col>
                <Col span={6}>
                    <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label={""} key={6} >
                        <Input type="text" placeholder="图形验证码"
                            {...getFieldProps('captchaCode', {
                                rules: [
                                    { required: true, message: '请输入图形验证码' },
                                ]
                            })}
                            style={{ "width": "100%" }}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <div className={less.validate_img} onClick={this.getImg}>
                        <img src={this.state.picUrl} alt="" />
                    </div>
                </Col>
            </Row>

        </div>)
    }
    //对话框显示隐藏
    setModalVisible = (modalVisible) =>{
        this.props.form.resetFields(['captchaCode', 'smsCode'])
        this.setState({ modalVisible });
    }
    footerHtml =() =>{
        return (
            <Form.Item>
                <Button style={{ marginRight: 8 }} onClick={()=>this.setModalVisible(false)}>取消</Button>
                <Button type="primary" loading={this.state.Btloading} onClick={this.handleSubmit}>提交</Button>
            </Form.Item>)
    }
    //获取签章人等基本信息
    getSignInfo = ()=>{
        // setTimeout(() => {
        //     //this.props.form.resetFields(['captchaCode', 'smsCode'])
        //     this.getImg()
        // }, 1000);
        this.getImg()
        api.ajax('GET',"!!/common/contract/querySignListInfo",{})
            .then(res=>{
                if(!res.data){return}
                let {signInfo} = this.state
                signInfo.contractPhone =  res.data.contractPhone
                signInfo.signUser = res.data.signUser
                this.setState({
                    signInfo
                },()=>
                    this.setModalVisible(true)
                )
            },_err=>{
                message.error('获取签章信息失败');
            })
    }
    //切换页码后重置选中项
    resetSelected = ()=>{
        this.setState({
            hasSelected: false,
            selectedItems: [],
        })
    }
  render() {
    let { selectedItems, hasSelected} = this.state
    return (
        <Card bordered={false}>
            <BaseForm  formList={this.formList}  importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
            <Tabs className={less.tabs} onTabClick={this.handleChangeTab} defaultActiveKey="1">
                <TabPane tab="全部" key="0" >
                    <div className={less.tabplane}>
                        <BaseTable
                            notInit={true}
                            url="!!/common/contract/findContractListForPage"
                            tableState={1}
                            resetTable={(state) => { this.resetTable(state, 'tableState6') }}
                            baseParams={this.baseParams0}
                            columns={this.columns5}
                            indexkeyWidth={120}
                            scroll={{ x: 2200}}
                        />
                    </div>
                </TabPane>
                <TabPane tab="待签章" key="1" className={less.tabplane}>
                    <Button type="primary" style={{"margin-bottom": "10px"}} onClick={()=>this.getSignInfo()} disabled={!hasSelected}>{selectedItems.length > 0 ? `批量签章(${selectedItems.length})`:'批量签章'}</Button>
                    <div className={less.tabplane}>
                        {/* <Form horizontal onSubmit={this.handleSubmit}> */}
                        <Form horizontal>
                            <Modal
                                title="批量签章"
                                wrapClassName="vertical-center-modal"
                                visible={this.state.modalVisible}
                                // onOk={()=>this.handleSubmit}
                                onCancel={() => this.setModalVisible(false)}
                                footer={this.footerHtml()}
                                >
                                {this.modalContent()}
                            </Modal>
                        </Form>
                        <BaseTableAllItems
                            url="!!/common/contract/findContractListForPage"
                            tableState={this.state.tableState1}
                            resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                            baseParams={this.baseParams1}
                            columns={this.columns1}
                            indexkeyWidth={70}
                            scroll={{ x: 1500 }}
                            selection={true}
                            setSelectedItems = {this.setSelectedItems}
                            resetSelected = {this.resetSelected}
                        />
                    </div>
                </TabPane>
                <TabPane tab="供应商未签章" key="2" >
                    <div className={less.tabplane}>
                        <BaseTable
                            notInit={true}
                            url="!!/common/contract/findContractListForPage"
                            tableState={this.state.tableState2}
                            resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                            baseParams={this.baseParams2}
                            columns={this.columns2}
                        />
                    </div>
                </TabPane>
                <TabPane tab="已生效" key="3" >
                    <div className={less.tabplane}>
                        <BaseTable
                            notInit={true}
                            url="!!/common/contract/findContractListForPage"
                            tableState={this.state.tableState3}
                            resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                            baseParams={this.baseParams3}
                            columns={this.columns3}
                            indexkeyWidth={130}
                            scroll={{ x: 1600 }}
                        />
                    </div>
                </TabPane>
                <TabPane tab="待生效" key="4" >
                    <div className={less.tabplane}>
                        <BaseTable
                            notInit={true}
                            url="!!/common/contract/findContractListForPage"
                            tableState={this.state.tableState4}
                            resetTable={(state) => { this.resetTable(state, 'tableState4') }}
                            baseParams={this.baseParams4}
                            columns={this.columns6}
                            indexkeyWidth={130}
                            scroll={{ x: 1600 }}
                        />
                    </div>
                </TabPane>
                <TabPane tab="作废/失效" key="5" >
                    <div className={less.tabplane}>
                        <BaseTable
                            notInit={true}
                            url="!!/common/contract/findContractListForPage"
                            tableState={this.state.tableState5}
                            resetTable={(state) => { this.resetTable(state, 'tableState5') }}
                            baseParams={this.baseParams5}
                            columns={this.columns4}
                            indexkeyWidth={130}
                            scroll={{ x: 2100 }}
                        />
                    </div>
                </TabPane>
            </Tabs>
        </Card>
    )
  }
}
//获取当前登录用户
const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    }
}
export default connect(mapStateToProps)(Form.create()(signatureManagementList))