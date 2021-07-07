import { Card, Form, Button, Radio, Row, Col, Table, Badge, Modal } from "antd";
import api from "@/framework/axios";
import Util from "@/utils/util";
import BaseAffix from "@/components/baseAffix";
import BaseDetails from "@/components/baseDetails";
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import UploadImg from "../uploadImg";
import Album from "uxcore-album";
import Input from "@/components/baseInput";

import less from "./index.less";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Photo } = Album;
const confirm = Modal.confirm;

class AuditForBg extends React.Component {
  state = {
    loading: false,
    uuids: "",
    basicAuditInfo: {},
    userInfo: {}
  };
  _isMounted = false;
  componentWillMount() {
    this._isMounted = true;
    const uuids = this.props.match.params.id;
    this.setState({
      uuids
    });
    this.getUserInfo(uuids)
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  // 获取回显信息
  getUserInfo = (uuids) => {
      this.setState({
        loading: true
      });
      api
        .ajax("GET", "@/order/ecOrderClose/query", {
          uuids
        })
        .then(r => {
          this.setState({
            loading: false,
            userInfo: r.data
          })
        })
        .catch(r => {
          this.setState({
            loading: false
          });
        });
  }
  //提交审核前添加确认
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      // 提交如果校验通过弹出提示
      let _this = this;
      confirm({
        title: "是否确认提交?",
        onOk() {
          _this.handleAccept();
        },
        onCancel() {
          Util.alert("已取消操作");
        }
      });
    });
  };
  // 受理按钮
  handleAccept = () => {
    let uuids = this.state.uuids;
    let _this = this;
    api
        .ajax("GET", "@/order/ecOrderClose/recp", {
          uuids
        })
        .then(r => {
          if (!_this._isMounted) {
            return;
          }
          Util.alert("受理成功", {
            type: "success",
            callback: () => this.props.history.goBack()
          });
        })
        .catch(r => {
          this.setState({
            loading: false
          });
          Util.alert(r.msg, { type: "error" });
        });
  };
  //查看订单
  viewOrder = (uuids) => {
        let param = {}
        param.uuids = uuids
        param.goBackUrl = '1'
        param.flag = "2";
        this.props.history.push(getUrlByParam('/platInvoice/orderDetailNew', param));
      // this.props.history.push('/ecUserApprovalLog/querySeeModal' + '/audit' + '/' + id)
  };

  render() {
    const { getFieldProps } = this.props.form;
    const pathUrl = this.state.userInfo.fileList == null ? [] : this.state.userInfo.fileList;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 }
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    };

    return (
      <div>
        <Form style={{background: '#fff',paddingTop: '1%',paddingLeft: '1%'}} onSubmit={this.handleSubmit}>
            <Row>
              <Col span={12}>
                <BaseDetails title="订单号" >
                  <span style={{ fontSize: "14px",color:"#2db7f5",cursor:"pointer"}} onClick={() => { this.viewOrder(this.state.userInfo.orderUuids) }}>{this.state.userInfo.orderNo}</span>
                </BaseDetails>
              </Col>
              <Col span={12}>
                <span style={{ fontSize: "14px",color:"#2db7f5",cursor:"pointer"}} onClick={() => { this.viewOrder(this.state.userInfo.orderUuids) }}>查看订单</span>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="订单金额">
                  {this.state.userInfo.totalPrice == null ? "-" : <span>￥ {this.state.userInfo.totalPrice}</span>}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="订单状态">
                  {this.state.userInfo.orderStatus == 26 ? (
                        "付款中"
                      ) : this.state.userInfo.orderStatus == 30 ? (
                        "待发货"
                      ) : this.state.userInfo.orderStatus == 40 ? (
                        "待收货"
                      ) : (
                        "已收货"
                    )}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="申诉状态">
                   {this.state.userInfo.flag == 0 ? (
                    "处理完成"
                  ) : this.state.userInfo.flag == 1 ?(
                    "受理中"
                  ) : (
                    "待受理"
                    )}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="发起方">
                  {this.state.userInfo.type == 1 ? (
                    "供应商"
                  ) : (
                    "采购商"
                  )}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="申诉人">
                  {this.state.userInfo.appealUsername}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="联系电话">
                  {this.state.userInfo.appealPhone}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="案情描述">
                  {this.state.userInfo.remark}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <BaseDetails title="图片">
                {
                    pathUrl.map((item,index) => {
                      return (
                        <Col span={4} style={{height: "140px",marginBottom: "2%"}}>
                              <FormItem {...uploadFormItemLayout}>
                                <UploadImg imgUrl={item.url} disabled={true}/>
                              </FormItem>
                         </Col>
                      )
                    })
                  }
              </BaseDetails>
            </Row>
          <BaseAffix>
            <Button type="primary" style={{ marginRight: "10px" }} onClick={this.handleSubmit}>受理</Button>
          </BaseAffix>
        </Form>
      </div>
    );
  }
}
export default Form.create()(AuditForBg);
