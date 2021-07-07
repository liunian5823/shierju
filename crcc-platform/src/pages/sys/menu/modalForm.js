import { Modal, Form, Select, DatePicker, Row, Col, Table, InputNumber } from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Input from '@/components/baseInput'
import Util from '@/utils/util';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class ModalForm extends React.Component {


  //非显示数据
  _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
  uid = 1
  visible = false
  parentCode = "1234567890"//顶级菜单
  params = {}//当前的对象
  removeIds = []//删除数组的uuids
  //
  state = {
    menuList: [],
    authBtnGroup: []
  }

  componentWillMount() {
    this._isMounted = true;
    this.resetauthBtnGroup(true);
    this.baseData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  resetauthBtnGroup(isEmpty = false) {
    let authBtnGroup = isEmpty ? [] : [{ uid: 0 }];
    this.setState({
      authBtnGroup
    })
  }


  componentDidUpdate() {
    if (this.visible != this.props.visible) {
      this.visible = this.props.visible;
      if (!this.props.visible) { return }
      //父组件传递的数据发生变化
      // 重置数据
      this.props.form.resetFields();
      this.resetauthBtnGroup(true);//重置为空
      this.params = []
      this.removeIds = [];

      this.params = {
        ...this.props.menuObj,
        type: this.props.menuType,
        premesType: '1'//菜单
      }
      this.params.createTime = null;
      this.params.updateTime = null;

      this.baseData();//获得一级菜单数据

      if (this.props.menuObj.uuids && this.props.menuObj.parentId != "-1") {
        this.getChildrenList(this.props.menuObj.id);//获取子节点数据
      }

      this.params.parentId = this.params.parentId ? this.params.parentId.toString() : '-1';
      this.props.form.setFieldsValue(this.params);
    }
  }

  //获得基础数据
  baseData = () => {
    api.ajax('GET', '@/sso/ecPremes/page', {
      parentId: '-1',
      type: this.props.menuType
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      this.setState({
        menuList: r.data.rows
      })
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' })
    })
  }

  //获得子菜单按钮数据
  getChildrenList = (parentId) => {
    api.ajax('GET', '@/sso/ecPremes/page', {
      parentId: parentId,
      type: this.props.menuType
    }).then(r => {
      if (!this.props.visible) {
        return;
      }
      let authBtnList = [];
      let obj = {};
      const childList = r.data.rows || [];
      childList.map((item) => {
        item.createTime = null;
        item.updateTime = null;
        authBtnList.push({ ...item, uid: this.uid });
        obj['child' + this.uid++] = { ...item };//这里uid++
      })


      let authBtnGroup = [...authBtnList, { uid: 0 }];
      this.setState({
        authBtnGroup
      })
      this.props.form.setFieldsValue(obj);
    }).catch(r => {
    })
  }

  parentMenu = () => {
    const options = [];
    if (this.params.parentId != '-1' && this.params.uuids) {
      //如果是修改则二级菜单不允许修改未一级菜单
    } else {
      options.push(<Option value="-1" key=''>无</Option>);
    }
    function flatNavList(arr) {
      arr.map((v) => {
        options.push(<Option value={`${v.id}`} key={v.id}>{v.name}</Option>)
      });
    }
    flatNavList(this.state.menuList)
    return options
  }

  getParentCodeById = (id) => {
    for (let i = 0; i < this.state.menuList.length; i++) {
      if (id == this.state.menuList[i].id) {
        return this.state.menuList[i].parentCode;
      }
    }
  }

  computedParentCode = (obj, idName) => {
    let fieldsValue = this.props.form.getFieldsValue();
    if (obj[idName] && idName != 'id') {
      return obj[idName]
    } else if (this.params[idName]) {
      return this.params[idName]
    } else {
      if (idName == 'id') {
        return fieldsValue.parentId
      } else {
        return this.getParentCodeById(fieldsValue.parentId)
      }
    }
  }

  handelSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();
    let btnList = [];
    this.state.authBtnGroup.map((item) => {
      if (item.uid != 0) {
        const obj = { ...item, ...fieldsValue['child' + item.uid] };
        if (!obj.name) {
          //如果没有名字过滤该条记录
          return;
        }
        obj.premesType = '2';
        obj.parentId = this.computedParentCode(item, 'id');
        obj.parentCode = this.computedParentCode(item, 'parentCode');
        obj.type = this.props.menuType;
        btnList.push(obj);
      }
    })

    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      let paramsMenu = {
        ...this.params,
        ...values,
        parentCode: this.params.parentCode || this.getParentCodeById(values.parentId),
        'removeIds': this.removeIds.join(',')
      }
      paramsMenu.createTime = null;
      paramsMenu.updateTime = null;
      let paramsList = [paramsMenu, ...btnList];//提交的数组组装



      if (values.parentId != this.params.parentId && this.params.parentId != '-1') {
        let OneParentCode = this.getParentCodeById(values.parentId);
        paramsList.map(item => {
          let parentCodeArr = item.parentCode.split('_');
          parentCodeArr.shift();
          parentCodeArr.shift();
          parentCodeArr.unshift(OneParentCode);
          item.parentCode = parentCodeArr.join('_');
        })
      }

      this.props.onOk(true, paramsList);
    })
  }

  handelCancle = () => {
    this.props.form.resetFields();
    this.props.onOk(false);
  }

  handleAddLine = () => {
    let authBtnGroup = [...this.state.authBtnGroup];
    authBtnGroup.splice((authBtnGroup.length - 1), 0, { uid: this.uid++ })
    this.setState({
      authBtnGroup
    })
  }

  handleDelLine = (uid) => {
    let authBtnGroup = []
    this.state.authBtnGroup.map((item) => {
      if (uid != item.uid) {
        authBtnGroup.push(item);
      } else {
        if (item.uuids) {
          this.removeIds.push(item.uuids)
        }
      }
    })
    this.setState({
      authBtnGroup
    })
  }


  render() {
    const { getFieldProps } = this.props.form;

    const columns = [{
      title: '按钮名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        if (record.uid == 0) {
          return '-'
        }
        return <Input
          placeholder={'请输入按钮名称'}
          {...getFieldProps(`child${record.uid}.name`, {
            initialValue: text
          })}
        />;
      }
    }, {
      title: '地址',
      dataIndex: 'url',
      key: 'url',
      render: (text, record, index) => {
        if (record.uid == 0) {
          return '-'
        }
        return <Input
          placeholder={'请输入url路径'}
          {...getFieldProps(`child${record.uid}.url`, {
            initialValue: text
          })}
        />
      }
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (text, record, index) => {
        if (record.uid == 0) {
          return <a href="javascript:void(0)" onClick={() => { this.handleAddLine() }}>增加</a>
        }
        return <a href="javascript:void(0)" onClick={() => { this.handleDelLine(record.uid) }}>删除</a>
      }
    }]

    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handelSubmit}
        onCancel={this.handelCancle}
        confirmLoading={this.props.loading}
      >
        <Form horizontal>
          <Row gutter={16}>
            <Col span="24" key={'type'}>
              <FormItem label={'菜单平台'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Select
                  disabled={true}
                  {...getFieldProps('type', {
                    initialValue: '3',
                  })}
                >
                  <Option key="1" value="3">供应商</Option>
                  <Option key="2" value="4">采购商</Option>
                  <Option key="3" value="5">平台</Option>
				  <Option key="4" value="10">个人中心</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24" key={'parentId'}>
              <FormItem label={'所属菜单'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Select
                  {...getFieldProps('parentId', {
                    initialValue: '-1',
                    rules: [
                      { required: true, message: '请选择所属菜单' },
                    ],
                    onChange: (e) => {
                      if (e == '-1' && this.state.authBtnGroup.length > 0) {
                        this.resetauthBtnGroup(true);
                      } else if (this.state.authBtnGroup.length == 0) {
                        this.resetauthBtnGroup();
                      }
                    }
                  })}
                >
                  {this.parentMenu()}
                </Select>
              </FormItem>
            </Col>
            <Col span="24" key={'name'}>
              <FormItem label={'菜单名称'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input
                  placeholder={'请输入菜单名称'}
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入菜单名称' },
                      { max: 20, message: '请输入少于20个字符' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="24" key={'url'}>
              <FormItem label={'路径'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input
                  placeholder={'请输入url路径'}
                  {...getFieldProps('url', {
                    rules: [
                      { required: true, message: '请输入url路径' },
                      //{ max: 40, message: '请输入少于40个字符' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
            <Col span="24" key={'sort'}>
              <FormItem label={'排序'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <InputNumber
                  placeholder={'请输入排序'}
                  maxLength={3}
                  {...getFieldProps('sort', {
                    rules: [
                      { required: true, message: '请输入排序' },
                    ],
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} style={{ display: this.state.authBtnGroup.length > 0 ? 'block' : 'none' }}>
            <Col span="24">
              <Table rowKey="uid" columns={columns} dataSource={this.state.authBtnGroup} size="small" pagination={false} />
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default Form.create({})(ModalForm)