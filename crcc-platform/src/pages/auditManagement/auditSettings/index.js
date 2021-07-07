import { Table, Row, Col, Tree, Button, Card, Modal } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import ModalForm from './modalForm';
import {systemConfigPath} from "@/utils/config/systemConfig";
import less from './index.less';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

class auditSettings extends React.Component {
  state = {
    loading: false,
    dataSource: [],
    TableDataSource: [],
    selectedRowKeys: [],
    checkBasicAuditItems: {
      title: "",
      id: "",
      key: ""
    },
    shortcutPhraseModal: false,
    modalData: ''
  }

  _commentId = "";//选中的快捷短语id

  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
    this.getSettingsData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getSettingsData = () => {
    let _this = this;
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('GET', '@/supplier/ecAuditShortcutStatementCorrespond/queryAuditData',
      {}).then(r => {
        if (!_this._isMounted) {
          return false;
        }
        this.setState({
          loading: false,
          dataSource: r.data,
          TableDataSource: r.data[0].data.sort((a, b) => { return a.sort - b.sort }),
          checkBasicAuditItems: {
            title: r.data[0].basicAuditName,
            id: r.data[0].id,
            key: r.data[0].basicAuditCode
          }
        })
      }).catch(r => {
        this.setState({
          loading: false
        })
      })
  }

  reloadSettingsData = () => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecAuditShortcutStatementCorrespond/queryAuditData',
      {}).then(r => {
        if (!_this._isMounted) {
          return false;
        }
        let checkItem = {};
        r.data.forEach((o, i) => {
          if (o.id == this.state.checkBasicAuditItems.id) {
            checkItem = o;
          }
        })
        this.setState({
          dataSource: r.data,
          selectedRowKeys: [],
          TableDataSource: checkItem.data.sort((a, b) => { return a.sort - b.sort }),
        })
      }).catch(r => {
      })
  }

  columns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width:60,
        render: (text, record, index) => (
          <span style={{padding:'0 10px'}}>{index + 1}</span>
        ),
      },
      {
        title: '快捷短语',
        dataIndex: 'comment',
        key: 'comment',
        width:300,
      },
      {
        title: '排序操作',
        dataIndex: 'p',
        key: 'p',
        width:120,
        render: (text, record, index) => (
          <span>
            {index == 0 ? "" : <a href="javascript:void(0);" onClick={() => (this.handleUp(record.id))}><i className="iconfont icon-shangyi"></i></a>}
            {index == this.state.TableDataSource.length - 1 ? "-" : <a href="javascript:void(0);" onClick={() => (this.handleDown(record.id))}><i className="iconfont icon-xiayi"></i></a>}
          </span>
        )
      },
      {
        title: '操作',
        dataIndex: 'c',
        key: 'c',
        width:120,
        render: (text, record) => (
          <span>
            <a href="javascript:void(0);" onClick={() => { this.handleToModal(record.id) }}>修改</a>
            <span className="ant-divider"></span>
            <a href="javascript:void(0);" onClick={() => { this.handleToDel(record.uuids) }}>删除</a>
          </span>
        )
      }
    ]
  }

  handleDown = (id) => {
    let _this = this;
    let downId = "";
    let index = -1;
    this.state.TableDataSource.forEach((o, i) => {
      if (o.id == id) {
        index = i + 1;
      }
    })
    downId = this.state.TableDataSource[index].id;
    api.ajax('POST', '@/supplier/ecAuditShortcutStatement/moveDown',
      {
        id: id,
        downId: downId
      }).then(r => {
        if (!_this._isMounted) {
          return false;
        }
        this.reloadSettingsData();
        Util.alert("下移成功", { type: 'success' });
      }).catch(r => {
        Util.alert("下移失败", { type: 'error' });
      })
  }
  handleUp = (id) => {
    let _this = this;
    let upId = "";
    let index = -1;
    this.state.TableDataSource.forEach((o, i) => {
      if (o.id == id) {
        index = i - 1;
      }
    })
    upId = this.state.TableDataSource[index].id;
    api.ajax('POST', '@/supplier/ecAuditShortcutStatement/moveUp',
      {
        id: id,
        upId: upId
      }).then(r => {
        if (!_this._isMounted) {
          return false;
        }
        this.reloadSettingsData();
        Util.alert("上移成功", { type: 'success' });
      }).catch(r => {
        Util.alert("上移失败", { type: 'error' });
      })
  }

  getTree = () => {
    let TreeNodeArray = [];
    this.state.dataSource.forEach((o, i) => {
      let TREENODE = <TreeNode title={o.basicAuditName} key={o.basicAuditCode}></TreeNode>
      TreeNodeArray.push(TREENODE);
    })
    return TreeNodeArray;
  }

  handleChooseTab = (e) => {
    let TableDataSource;
    let title;
    let id;
    let key;
    this.state.dataSource.forEach((o, i) => {
      if (o.basicAuditCode == e[0]) {
        TableDataSource = o.data.sort((a, b) => { return a.sort - b.sort });
        title = o.basicAuditName;
        id = o.id;
        key = o.basicAuditCode;
      }
    })
    this.setState({
      TableDataSource: TableDataSource,
      selectedRowKeys: [],
      checkBasicAuditItems: {
        title: title,
        id: id,
        key: key
      }
    })
  }

  //修改或者添加
  handleToModal = (id) => {
    this.setState({
      modalData: ''
    })
    if (id) {//修改
      this._commentId = id;
      this.state.TableDataSource.forEach((o, i) => {
        if (o.id == id) {
          this.setState({
            modalData: o
          })
        }
      })
    } else {//新增
      this._commentId = "";
      if (!this.state.checkBasicAuditItems.id) {
        Util.alert("请选择基础审核项", { type: 'error' });
        return false;
      }
    }
    this.setState({
      shortcutPhraseModal: true
    })
  }
  //删除
  handleToDel = (id) => {
    if (!id && this.state.selectedRowKeys.length <= 0) {
      Util.alert('请选择要删除的项', { type: 'warning' });
      return false;
    }
    let _this = this;
    confirm({
      title: "您是否确认要删除这项内容",
      onOk() {
        _this.setState({
          loading: true
        })
        let uuids = '';
        if (id) {
          uuids = id;
        } else {
          uuids = _this.state.selectedRowKeys;
        }
        api.ajax("PUT", "@/supplier/ecAuditShortcutStatement/delete", {
          uuids: uuids
        }).then(r => {
          if (!_this._isMounted) {
            return false;
          }
          _this.setState({
            loading: false
          })
          _this.reloadSettingsData();
          Util.alert("删除成功", { type: 'success' });
        }).catch(r => {
          _this.setState({
            loading: false
          })
          Util.alert("删除失败", { type: 'error' });
        })
      }
    })

  }

  //弹框
  modalFormList = () => {
    return [
      {
        el: "INPUT",
        key: "comment",
        type: "text",
        label: "快捷短语",
        placeholder: "请输入快捷短语",
        value: this.state.modalData ? this.state.modalData.comment : ""
      }
    ]
  }
  saveModal = (formData) => {
    this.setState({
      loading: true
    })
    let sort = "";
    if (!this._commentId) {//新增
      if (this.state.TableDataSource && this.state.TableDataSource.length > 0) {
        let arraySort = this.state.TableDataSource.sort((a, b) => { return a.sort - b.sort; });
        sort = arraySort[arraySort.length - 1].sort + 1;
        if (arraySort.length >= 10) {
          Util.alert("快捷短语不能超过10条", { type: 'error' });
          this.setState({
            loading: false,
            shortcutPhraseModal: false
          })
          return false;
        }
      } else {
        sort = 1;
      }
    } else {
      sort = this.state.modalData.sort;
    }
    let _this = this;
    api.ajax("POST", "@/supplier/ecAuditShortcutStatement/save", {
      compayBasicAudicId: this.state.checkBasicAuditItems.id,
      ...formData,
      id: this._commentId,
      sort: sort
    }).then(r => {
      if (!_this._isMounted) {
        return false;
      }
      this.reloadSettingsData();//更新页面数据
      Util.alert("保存成功", { type: 'success' });
      this.setState({
        loading: false,
        shortcutPhraseModal: false
      })
    }).catch(r => {
      Util.alert("保存失败", { type: 'error' });
      this.setState({
        loading: false
      })
    })
  }
  cancelModal = () => {
    this.setState({
      shortcutPhraseModal: false
    })
  }
  //
  modalConfig = () => {
    return {
      title: this.state.modalData ? "修改" : "添加",
      onOk: this.saveModal,
      onCancel: this.cancelModal
    }
  }

  render() {
    let height=document.documentElement.clientHeight-235;
    const { selectedRowKeys } = this.state;
    const rowCheckSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys
        })
      }
    }
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <Card bordered={false}>
          <Row>
            <Col span={5} style={{ borderBottom: "1px solid #f1f1f1", borderRight: "1px solid #f1f1f1" }}>
              <div className={less.divContent}>基础审核项</div>
            </Col>
            <Col span={19}>
              <Col span={8} offset={1}>
                <div className={less.divContent}>{this.state.checkBasicAuditItems.title}</div>
              </Col>
              <Col span={15}>
                <div className={less.divContent}>
                  <Button type="primary" onClick={() => (this.handleToModal())} loading={this.state.loading}>添加</Button>
                  {/* <Button onClick={() => (this.handleToDel())} loading={this.state.loading}>删除</Button> */}
                </div>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col span={5} style={{ borderRight: "1px solid #f1f1f1", height: height, overflowY: 'auto' }}>
              <Tree
                selectedKeys={[this.state.checkBasicAuditItems.key]}
                onSelect={this.handleChooseTab}>
                {this.getTree()}
              </Tree>
            </Col>
            <Col span={19} style={{ borderLeft: "1px solid #f1f1f1" }}>
              <Table
                scroll={{ y: height-50 }}
                rowKey='uuids'
                pagination={false}
                dataSource={this.state.TableDataSource}
                rowSelection={false}
                columns={this.columns()} />
            </Col>
          </Row>
        </Card>
        <ModalForm
          {...this.modalConfig()}
          confirmLoading={this.state.loading}
          visible={this.state.shortcutPhraseModal}
          formList={this.modalFormList()}></ModalForm>
      </div>
    )
  }
}
export default auditSettings