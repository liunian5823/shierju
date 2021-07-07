import { Card, Table, Row, Col, Button, Modal, Icon, Switch, Tooltip } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util';
import {tablePagination_, btnName_}from '@/utils/config/componentDefine'
import AuthButton from '@/components/authButton'
import BaseDetails from '@/components/baseDetails'
import BaseTable from '@/components/baseTable'
import BaseAffix from '@/components/baseAffix';
import less from './index.less'
import ModalForm from '../modalForm'
const confirm = Modal.confirm;

class Details extends React.Component {

  _isMounted = false

  state = {
    _loading: false,
    // 个人信息
    personalInfo: {},
    roleList: [],
	logList:{},
    loginTime:'',
    //弹窗
    modal: {
      show: false,
      uuids: '',
      title: ''
    },
  }

  componentWillMount() {
    this._isMounted = true;
    // 进入页面加载数据
    const uuids = this.props.match.params.uuids;
    this.getData(uuids);
    this.getBaseData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //初始化数据
  getData(uuids) {
    api.ajax('GET', '@/platform/ecUser/get', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        //如果没有被挂载 终止ajax
        return;
      }

      this.setState({
        personalInfo: r.data,
        state: r.data.state
      })

      this.getLastLoginInfo(r.data.id);
	  //获取日志
	  this.searchLog(1,10,r.data.id);
    }).catch(r => {
      Util.alert(r.msg, { type: "error" })
    })
  }

  // 获取最后登录信息
  getLastLoginInfo = (id) => {
    api.ajax("POST", "@/sso/ecLoginError/queryLastLoginInfo", {
      loginUserId: id
    }).then(r => {
      if (!this._isMounted) { return }
      this.setState({
        loginTime:r.data.loginTime
      })
    }).catch(r => {
      Util.alert(r.msg, { type: "error" })
    })
  }

  //获得角色信息
  getBaseData = () => {
    api.ajax('GET', '@/sso/ecRole/page', {
      queryPurAdminFlag: 2,
      type: "5"
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        roleList: r.data.rows
      })
    }).catch(r => {
    })
  }

  searchLog =  (page,pageSize,operId, event) => {
  	let params = {};
  	params.operId=operId;
  	params.subPlatform=5;
  	params.page = page;
  	params.pageSize = pageSize==undefined?tablePagination_.defaultPageSize:pageSize;
  	params.sort="id";
  	params.dir="desc";
  	api.ajax("GET","@/common/log/page", {
  	    ...params
  	}).then(r => {
  	    this.setState({
  	        logList: r.data
  	    })
  	});	
  }
  
  handleBack = (e) => {
    e.preventDefault();
    this.props.history.goBack()
  }

  //handleToEdit
  handleToEdit = () => {
    const uuids = this.props.match.params.uuids;
    this.setState({
      modal: {
        ...this.state.modal,
        title: '修改',
        uuids: uuids,
        show: true
      }
    })
  }

  //修改状态
  handleChangeStatus = (checked) => {
    let state = checked ? 1 : 2;
    const record = this.state.personalInfo;
    let _this = this;
    let msg = state == 1 ? '该账号将恢复使用，是否确认开启？' : '关闭账号后，该账号将无法登陆，是否确认关闭？';
    confirm({
      title: '该操作将修改账户状态',
      content: msg,
      onOk() {
        _this.statusSubmit(record, state)
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }

  //修改状态提交
  statusSubmit = (record, state) => {
    api.ajax('POST', '@/sso/ecUser/changeState', {
      id:record.id,
      companyId:record.companyId,
      subPlatformId:5,
      uuids:record.uuids,
      state: state
    }).then(r => {
      Util.alert(r.msg, { type: 'success' });
      this.setState({
        state
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }


  //重置密码
  handleResetPwd = () => {
    const uuids = this.props.match.params.uuids;
    const name = this.state.personalInfo.username;
    let _this = this;
    confirm({
      title: `确定要重置'${name}'的密码吗？`,
      content: '密码将随机生成并发送至于该账号绑定的手机',
      onOk() {
        _this.resetPwdSubmit(uuids)
      },
      onCancel() {
        Util.alert('已取消操作');
      },
    });
  }

  //重置密码提交哦
  resetPwdSubmit = (uuids) => {
    api.ajax('GET', '@/sso/loginControl/resetPwd', {
      uuids
    }).then(r => {
      Util.alert(r.msg, { type: 'success' });
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }

  //打开关闭弹窗
  openModal = (ok) => {
    let show = ok ? true : false;
    this.setState({
      modal: {
        ...this.state.modal,
        show
      },
    })
  }

  //弹窗事件
  modalHandle = (ok, params) => {
    if (ok) {
      // 保存
      const uuids = this.props.match.params.uuids;
      this.getData(uuids);
    } else {
      this.openModal(ok)
    }
  }

  //card右侧按钮渲染
  extraOptions = () => {
    let check = this.state.state == 1 ? true:false;
    return (
      <div className="ant-card-extra-div" style={{display: 'flex'}}>
		<div style={{display: this.props.match.params.managerFlag == 2 ? 'block' : 'none'}}>
		<Tooltip
		  placement="top"
		  title={'提示：点击修改状态'}
		>
		  <Icon type="question-circle-o" className="mr10" />
		</Tooltip>
        {/* 启用禁用 */}
        状态：
        <AuthButton 
          className="mr10"
          elmType="switch" 
          elmName="启用" 
          checked={check} checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="cross" />}
          onChange={(checked) => { this.handleChangeStatus(checked) }}
        />
		</div>
        {/* 重置密码 */}
        <Button type="primary" className="mr10" onClick={this.handleResetPwd}>重置密码</Button>
        {/* 编辑 */}
        <AuthButton elmName="修改" type="primary" onClick={this.handleToEdit}>编辑</AuthButton>
        {/* 导出 */}
        {/* <Button type="primary">导出</Button> */}
      </div>
    )
  }

  //渲染性别
  renderGenter = (value) => {
    if (value == 1) {
      return '男'
    } else if (value == 0) {
      return '女'
    } else {
      return null
    }
  }

  //计算时间
  computedLastTime = (time) => {
    if (time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
    return null
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
  baseParams = {
  }
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }
  resetTable = (state, tableState = 'tableState') => {
    if (state != this.state[tableState]) {
      this.setState({
        [tableState]: state
      });
    }
  }
  columns = [{
    title: '登录ip',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 300,
    sorter: true,
  }, {
    title: '事件',
    dataIndex: 'content',
    key: 'content',
  	width: 400,
    sorter: true,
  }, {
    title: '操作时间',
    dataIndex: 'operTimeStr',
    key: 'operTimeStr',
    width: 280,
    sorter: true
  }]

  onChange = (page, pageSize) => {
      this.searchLog(page, pageSize,this.state.operId);
  };
  
  onShowSizeChange = (page, pageSize) => {
      this.searchLog(page, pageSize,this.state.operId);
  };

  render() {
	const logPagination = ComponentDefine.getPagination_(this.state.logList, this.onChange, this.onShowSizeChange);
    return (
      <div>
        <Card bordered={false} title="个人信息" className="mb10" extra={this.extraOptions()}>
          <Row className={less.info}>
            <Col span={12} className={less.info_left}>
              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="姓名" >
                        {this.state.personalInfo.username}
                      </BaseDetails>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="性别">
                        {this.renderGenter(this.state.personalInfo.gender)}
                      </BaseDetails>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="角色">
                        {this.state.personalInfo.roleName}
                      </BaseDetails>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="电子邮箱">
                        {this.state.personalInfo.email}
                      </BaseDetails>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="手机号码">
                        {this.state.personalInfo.phone}
                      </BaseDetails>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="创建时间" >
                        {this.state.personalInfo.createTimeStr}
                      </BaseDetails>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <BaseDetails title="最后登录">
                        {this.computedLastTime(this.state.loginTime)}
                      </BaseDetails>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={11} offset={1}>
              <div className={less.info_right}>
                <Row>
                  <BaseDetails title="备注" >
                    {this.state.personalInfo.remark}
                  </BaseDetails>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="操作日志">
          <Table rowKey="logTable" className="logTable"
                 {...ComponentDefine.table_}
                 pagination={logPagination}
                 rowSelection={null}
                 scroll={{x:380}}
                 dataSource={this.state.logList.list}
                 columns={this.columns}/>
        </Card>
        <BaseAffix>
          <Button type="primary" onClick={this.handleBack}>返回</Button>
        </BaseAffix>
        <ModalForm
          title={this.state.modal.title}
          visible={this.state.modal.show}
          onOk={this.modalHandle}
          uuids={this.state.modal.uuids}
          roleList={this.state.roleList}
        />
      </div>
    )
  }
}

export default Details