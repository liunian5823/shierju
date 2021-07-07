import { Card, Row, Col, Form, Input, Button, Modal, Checkbox } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import BaseAffix from '@/components/baseAffix';
import less from './index.less'

const confirm = Modal.confirm;

const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;

class Edit extends React.Component {

  _isMounted = false;

  state = {
    authTree: [],
    checkedKeys: [],
    nameAndId: [],
    chosedMenu:[],
    OptionsValue1:[],
    OptionsValue2:[],
    OptionsValue3:[]
  }

  flatTree = []//扁平化的权限树

  componentWillMount() {
    this._isMounted = true;
    let uuids = this.props.match.params.uuids || '';
    if (uuids) {
      this.getData(uuids)
      this.getRoleData(uuids);
    }
    this.getuusid();
    this.handleSearch()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getuusid() {
    api.ajax('POST', '@/sso/loginControl/getUserUuids').then(r => {
      this.getTreeData(r.data);
    }).catch(r => {
    })
  }

  //角色查看详情接口
  getData = (uuids) => {
    api.ajax('GET', '@/sso/ecRole/get', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return
      }
      this.props.form.setFieldsValue(r.data);
    }).catch(r => {

    })
  }
  //当前根据角色查询权限接口	
  getRoleData = (uuids) => {
    api.ajax('GET', '@/sso/ecRole/queryPremeListByRoleId', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return
      }
      // to_do
      let checkedKeys = [];
      r.data.map((item) => {
        checkedKeys.push('' + item.id)
      })
      this.setState({
        checkedKeys
      })
    }).catch(r => {

    })
  }

  //当前登录角色查询权限接口	
  getTreeData = (uuids) => {
    api.ajax('GET', '@/sso/ecUser/queryAuthDataList', {
      uuids
    }).then(r => {
      if (!this._isMounted) {
        return
      }

      this.flatTree = r.data;
      this.setState({
        authTree: Util.buildTree(r.data, 'id', 'parentId', 'children')
      })
    }).catch(r => {

    })
  }

  handleBack = (e) => {
    e.preventDefault();
    this.props.history.goBack()
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let _this = this;

    const uuids = this.props.match.params.uuids || '';

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      let params = {
        uuids,
        ...values,
        premesIds: this.state.checkedKeys.join(",")
      }
      if (this.state.checkedKeys.length == 0) {
        confirm({
          title: '您没有未该角色设置任何权限，是否继续创建该角色？',
          onOk() {
            _this.carryOnSubmit(params)
          },
          onCancel() {
            Util.alert('已取消操作');
          },
        });
        return;
      }
      this.carryOnSubmit(params)
    })
  }

  carryOnSubmit = (params) => {
    api.ajax('POST', '@/sso/ecRole/save', {
      ...params,
      type: 5,
    }).then(r => {
      if (!this._isMounted) {
        return
      }

      Util.alert(r.msg, { type: 'success' });
      this.props.history.goBack()
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
    })
  }

  handleSearch = () => {
    // let id = this.props.id;
    const datas = {
      "rows": [{
        "id": 1406,
        "name": "公司管理"
      },
      {
        "id": 1408,
        "name": "业务员"
      }, {
        "id": 14081,
        "name": "业务员1"
      }, {
        "id": 14082,
        "name": "业务员2"
      }, {
        "id": 14083,
        "name": "业务员3"
      }
      ]
    }
    let data = datas.rows
    let arr = this.state.nameAndId;
    let Options1 = [];
    data.map((item, index) => {
      arr["name_id_" + item.id] = item.name
      arr["parentId_" + item.id] = 0;
      let list = {};
      list.value = item.id;
      list.label = item.name;
      Options1.push(list);
    })
    this.setState({
      nameAndId: arr,
      Options1: Options1
    })
  }

  onChange1 = (checkedValues) => {
    if (checkedValues.length > 0) {
      let arr = this.state.nameAndId;
      let arrys = [];
      let arry1 = this.state.chosedMenu;
      let chosedMenu = [];
      for (let j = 0; j < checkedValues.length; j++) {
        let list = {};
        let num = 0;
        for (let i = 0; i < arry1.length; i++) {
          if (checkedValues[j] == arry1[i].id) {
            let value = arry1[i];
            arrys.push(value);
          } else {
            num++;
          }
        }
        if (num == arry1.length) {
          list.id = checkedValues[j];
          list.name = "[" + arr["name_id_" + checkedValues[j]] + "]"
          arrys.push(list);
        }
      }
      const data = {
        "rows": [{
          "id": 14,
          "name": "a公司1",
          "pId": 1406
        },
        {
          "id": 15,
          "name": "a业务2",
          "pId": 1406
        }, {
          "id": 16,
          "name": "a业务3",
          "pId": 1406
        }, {
          "id": 17,
          "name": "a业务4",
          "pId": 1406
        }, {
          "id": 18,
          "name": "a业务5",
          "pId": 1406
        }, {
          "id": 19,
          "name": "b公司1",
          "pId": 1408
        },
        {
          "id": 20,
          "name": "b业务2",
          "pId": 1408
        }, {
          "id": 21,
          "name": "b业务3",
          "pId": 14081
        }, {
          "id": 22,
          "name": "b业务4",
          "pId": 14081
        }, {
          "id": 23,
          "name": "b业务5",
          "pId": 14082
        }
        ]
      }
      let datas = data.rows;
      let Options2 = [];
      datas.map((item, index) => {
        arr["name_id_" + item.id] = item.name;
        arr["parentId_" + item.id] = item.pId;
      })
      datas.map((item, index) => {
        for (let i = 0; i < checkedValues.length; i++) {
          if (item.pId == checkedValues[i]) {
            let list = {};
            list.value = item.id;
            list.label = item.name;
            Options2.push(list);
          }
        }


      })
      let optionsValue2 = this.state.OptionsValue2;
      for (let i = 0; i < optionsValue2.length; i++) {
        let el = arr["parentId_" + optionsValue2[i]]
        let number = checkedValues.indexOf(el);
        if (number < 0) {
          optionsValue2.remove(i);
        }
      }
      let optionsValue3 = this.state.OptionsValue3;
      for (let i = 0; i < optionsValue3.length; i++) {
        let el = arr["parentId_" + optionsValue3[i]]
        let number = checkedValues.indexOf(el);
        if (number < 0) {
          optionsValue3.remove(i);
        }
      }

      this.setState({
        chosedMenu: arrys,
        Options2: Options2,
        nameAndId: arr,
        fisrtMenueChosed: arrys,
        OptionsValue1: checkedValues,
        OptionsValue2: optionsValue2,
        OptionsValue3: optionsValue3
      })
      // let params = {};
      // params.id=checkedValues
      // event&&event.preventDefault();
      // axios.get("https://easy-mock.com/mock/5ba0a98e2e49497b37162e7f/order/order/orderManagementController/getAuthorityData1",{
      //     // axios.get("@/order/orderManagementController/getAuthorityData",{
      //     params:params
      // }).then(r=>{
      //     let data =r.rows;
      //     let Options2=[];
      //     data.map((item,index)=>{
      //         arr["name_id_"+ item.id]=item.name;
      //         arr["parentId_"+ item.id]=item.pId;
      //         let list={};
      //         list.value=item.id;
      //         list.label=item.name;
      //         Options2.push(list);
      //     })
      //
      //     console.log(r)
      //     this.setState({
      //         chosedMenu:arrys,
      //         Options2:Options2,
      //         nameAndId:arr
      //     })
      // })
    } else {
      this.setState({
        Options2: [],
        chosedMenu: [],
        Options3: [],
        OptionsValue1: checkedValues,
        OptionsValue2: [],
        OptionsValue3: []
      })
    }

  }


  onChange2 = (checkedValues) => {
    let arry1 = this.state.chosedMenu;
    if (checkedValues.length > 0) {
      let arrys = [];
      let arr = this.state.nameAndId;


      let chosedMenu = [];
      for (let j = 0; j < checkedValues.length; j++) {
        let list = {};
        let num = 0;
        let name = "";
        let id = "";
        let ids = arr["parentId_" + checkedValues[j]];
        for (let i = 0; i < arry1.length; i++) {
          if (checkedValues[j] == arry1[i].pId) {
            let value = arry1[i];
            arrys.push(value);
          } else {
            num++;
          }
        }
        if (num == arry1.length) {
          list.id = ids;
          list.name = "[" + arr["name_id_" + ids] + "]"
          list.pId = checkedValues[j];
          list.pName = " (" + arr["name_id_" + checkedValues[j]] + ")"
          arrys.push(list);
        }
      }
      let oldData = this.state.fisrtMenueChosed;
      for (let k = 0; k < oldData.length; k++) {
        for (let i = 0; i < arrys.length; i++) {
          if (oldData[k].id == arrys[i].id) {
            break
          } else {
            if (i == (arrys.length - 1)) {
              arrys.push(oldData[k]);
            }
          }
        }
      }
      const data = {
        "rows": [{
          "id": 140,
          "name": "a1按钮1",
          "pId": 14
        },
        {
          "id": 150,
          "name": "a1按钮2",
          "pId": 14
        }, {
          "id": 160,
          "name": "a1按钮3",
          "pId": 14
        }, {
          "id": 170,
          "name": "a2按钮1",
          "pId": 15
        }, {
          "id": 180,
          "name": "a2按钮2",
          "pId": 15
        }, {
          "id": 181,
          "name": "a3按钮1",
          "pId": 16
        },
        {
          "id": 182,
          "name": "a3按钮2",
          "pId": 16
        }, {
          "id": 183,
          "name": "a4按钮1",
          "pId": 17
        }, {
          "id": 184,
          "name": "a4按钮2",
          "pId": 17
        }, {
          "id": 185,
          "name": "a5按钮1",
          "pId": 18
        }
        ]
      }
      let datas = data.rows;
      let Options3 = [];
      datas.map((item, index) => {
        arr["name_id_" + item.id] = item.name;
        arr["parentId_" + item.id] = item.pId;
      })
      datas.map((item, index) => {
        for (let i = 0; i < checkedValues.length; i++) {
          if (item.pId == checkedValues[i]) {
            let list = {};
            list.value = item.id;
            list.label = item.name;
            Options3.push(list);
          }
        }


      })

      let optionsValue3 = this.state.OptionsValue3;
      for (let i = 0; i < optionsValue3.length; i++) {
        let el = arr["parentId_" + optionsValue3[i]]
        let number = checkedValues.indexOf(el);
        if (number < 0) {
          optionsValue3.remove(i);
        }
      }
      this.setState({
        nameAndId: arr,
        Options3: Options3,
        chosedMenu: arrys,
        OptionsValue2: checkedValues,
        OptionsValue3: optionsValue3
      })

    } else {
      this.state.fisrtMenueChosed.map((item, index) => {
        item.pId = "";
        item.pName = "";
        if (item.list != undefined) {
          item.list = [];
        }
      })
      this.setState({
        Options3: [],
        chosedMenu: this.state.fisrtMenueChosed,
        OptionsValue2: checkedValues,
        OptionsValue3: []
      })
    }
  }

  onChange3 = (checkedValues) => {
    let arry1 = this.state.chosedMenu;
    if (checkedValues.length > 0) {
      let arr = this.state.nameAndId;
      let arrys = [];
      let chosedMenu = [];
      for (let i = 0; i < arry1.length; i++) {
        arry1[i].list = [];
        for (let j = 0; j < checkedValues.length; j++) {
          let ids = arr["parentId_" + checkedValues[j]];
          let list = {};
          let num = 0;
          let name = "";
          let id = "";
          if (ids == arry1[i].pId) {
            list.p2Id = checkedValues[j];
            list.p2Name = "、" + arr["name_id_" + checkedValues[j]];
            arry1[i].list.push(list);
          }


        }
      }
      this.setState({
        chosedMenu: arry1,
        OptionsValue3: checkedValues
      })
    } else {
      arry1.map((item, index) => {
        if (arry1[index].list != undefined) {
          arry1[index].list.map((lastItem, lastIndex) => {
            lastItem.p2Id = "";
            lastItem.p2Name = "";
          })
        }
      })
      this.setState({
        chosedMenu: arry1,
        OptionsValue3: checkedValues
      })
    }
  }


  render() {
    const { getFieldProps } = this.props.form;
    // 整体栅格布局
    const formColLayout = {
      offset: 2,
      span: 16
    }
    // 表单栅格布局
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    // 表单按钮或上传等区域
    const wrapperColLayout = { wrapperCol: { span: 18, offset: 6 } }

    return (
      <div>
        <Card bordered={false}>
          <Form horizontal>
            <Row>
              <Col {...formColLayout}>
                <FormItem
                  {...formItemLayout}
                  label="角色名"
                >
                  <Input
                    {...getFieldProps('name', {
                      rules: [
                        { required: true, message: '请输入角色名' },
                        { max: 20, message: '请输入少于20个字符' },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col {...formColLayout}>
                <FormItem
                  {...formItemLayout}
                  label="备注"
                >
                  <Input
                    type="textarea"
                    rows={4}
                    {...getFieldProps('remark', {
                      rules: [
                        { max: 100, message: '请输入少于100个字符' },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false}>
          <Row className="table_list">
            <Col span="8" className="table_list2">
              <Card title="模块" bordered={false} style={{ height: 265, width: 326 }}>
                <CheckboxGroup value={this.state.OptionsValue1} options={this.state.Options1} onChange={this.onChange1} />
              </Card>
            </Col>
            <Col span="8" className="table_list2">
              <Card title="功能" bordered={false} style={{ height: 265, width: 326 }}>
                <CheckboxGroup value={this.state.OptionsValue2} options={this.state.Options2} onChange={this.onChange2} />
              </Card>
            </Col>
            <Col span="8" className="table_list2">
              <Card title="操作" bordered={false} style={{ height: 265, width: 326 }}>
                <CheckboxGroup value={this.state.OptionsValue3} options={this.state.Options3} onChange={this.onChange3} />
              </Card>
            </Col>
          </Row>
        </Card>
        <BaseAffix>
          <Button type="primary" onClick={this.handleSubmit} className="mr10">保存</Button>
          <Button type="primary" onClick={this.handleBack}>返回</Button>
        </BaseAffix>
      </div>
    )
  }
}

export default Form.create()(Edit)