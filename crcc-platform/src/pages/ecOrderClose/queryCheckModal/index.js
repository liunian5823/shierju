import { Card, Form, Button, Radio, Row, Col, Table, Badge, Modal } from "antd";
import api from "@/framework/axios";
import Util from "@/utils/util";
import BaseAffix from "@/components/baseAffix";
import BaseDetails from "@/components/baseDetails";
import UploadImg from "../uploadImg";
import Album from "uxcore-album";
import Input from "@/components/baseInput";
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import less from "./index.less";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Photo } = Album;
const confirm = Modal.confirm;

class AuditForBg extends React.Component {
  state = {
    loading: false,
    uuids: "",
    userInfo: {},
    backMsg: "", //驳回信息
  };
  _isMounted = false;
  componentWillMount() {
    this._isMounted = true;
    const uuids = this.props.match.params.id;
    this.setState({
      uuids
    });
  }
  componentDidMount() {
    this.getUserInfo()
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  // 获取回显信息
  getUserInfo = () => {
    let uuids = this.state.uuids;
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
          _this.currentSubmit();
        },
        onCancel() {
          Util.alert("已取消操作");
        }
      });
    });
  };

  // 表单提交
  currentSubmit = () => {
    let uuids = this.state.uuids;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      console.log(...values,99)
      if (!!errors) {
        return;
      }
      let _this = this;
      this.setState({
        loading: true
      });
      api
        .ajax("POST", "@/order/ecOrderClose/solution", {
          uuids,
          ...values
        })
        .then(r => {
          if (!_this._isMounted) {
            return;
          }
          Util.alert("处理成功", {
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
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 }
    };
    const isRequired =
      this.props.form.getFieldValue("result") == 1 ? false : true;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Card
            className="mb10"
            title={
              <span>
                <Badge
                  count={1}
                  style={{ backgroundColor: "rgba(255,129,0,1)" }}
                />{" "}
                订单号及申诉人信息
              </span>
            }
            bordered={false}
          >
            <Row>
              <Col span={12}>
                <BaseDetails title="订单号">
                  <span style={{ fontSize: "14px",color:"#2db7f5",cursor:"pointer"}} onClick={() => { this.viewOrder(this.state.userInfo.orderUuids) }}>{this.state.userInfo.orderNo}</span>
                </BaseDetails>
              </Col>
              <Col span={12}>
                <span style={{ fontSize: "14px",color:"#2db7f5",cursor:"pointer",letterSpacing: '2px'}} onClick={() => { this.viewOrder(this.state.userInfo.orderUuids) }}>查看订单</span>
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
                  {this.state.userInfo.orderStatus == 26 ? "付款中" : this.state.userInfo.orderStatus == 30 ? "待发货" : this.state.userInfo.orderStatus == 40 ? "待收货" : "已收货"}
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
          </Card>
          <Card
            className="mb10"
            title={
              <span>
                <Badge
                  count={2}
                  style={{ backgroundColor: "rgba(255,129,0,1)" }}
                />{" "}
                处理信息及结果
              </span>
            }
            bordered={false}
          >
            <Row>
              <Col span={24}>
                <BaseDetails title="处理人">
                  {this.state.userInfo.loginUsername}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="受理时间">
                  {this.state.userInfo.recpTime == null ? "-" : moment(this.state.userInfo.recpTime).format('YYYY-MM-DD HH:mm:ss')}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="处理时间">
                  {this.state.userInfo.nowTime == null ? "-" : moment(this.state.userInfo.nowTime).format('YYYY-MM-DD HH:mm:ss')}
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={17}>
                <FormItem
                  {...formItemLayout}
                  required={isRequired}
                  label="处理结果"
                >
                  <Input
                    type="textarea"
                    maxLength="500"
                    rows={3}
                    //style={{marginTop: '2%'}}
                    {...getFieldProps("solutionRemark", {
                      rules: [
                        {
                          required: isRequired,
                          message: "请输入处理结果"
                        }
                      ]
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          {/*{this.renderBackMsg()}*/}
          <BaseAffix>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={this.handleSubmit}
            >
              处理
            </Button>
          </BaseAffix>
        </Form>
      </div>
    );
  }
}
export default Form.create()(AuditForBg);
