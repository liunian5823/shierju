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
    backMsg: "", //驳回信息
    userInfo: {}
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

  // 获取信息
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

  handleGoBack = () => {
    this.props.history.goBack();
  };

  //查看订单
  viewOrder = (uuids) => {
        let param = {};
        param.uuids = uuids;
        param.goBackUrl = '1'
        param.flag = "2";
        this.props.history.push(getUrlByParam('/platInvoice/orderDetailNew', param));
      // this.props.history.push('/ecUserApprovalLog/querySeeModal' + '/audit' + '/' + id)
  };

  renderBackMsg = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    if (this.state.backMsg) {
      return (
        <Card
          className="mb10"
          title={
            <span>
              <Badge
                count={6}
                style={{ backgroundColor: "rgba(255,129,0,1)" }}
              />{" "}
              上次驳回意见
            </span>
          }
          bordered={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formItemLayout} label="上次驳回意见">
                {this.state.backMsg}
              </FormItem>
            </Col>
          </Row>
        </Card>
      );
    } else {
      return null;
    }
  };

  render() {
    const { getFieldProps } = this.props.form;
    const pathUrl = this.state.userInfo.fileList == null ? [] : this.state.userInfo.fileList;
    //const pathUrl = [{name: "32",url: "rewrew"},{name: "132",url: "https://demo.crccmall.com/group1/M00/00/2E/wKhCZlzZXa-AeDOEAAAT7WZ_Spw767.jpg?filename=ftico.jpg"}]
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 }
    };
    const uploadFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    };

    return (
      <div>
        <Form>
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
                  {this.state.userInfo.orderStatus == 26 ? "付款中" : this.state.userInfo.orderStatus == 30 ? "待发货" : this.state.userInfo.orderStatus == 40 ? "待收货" : "已收货"}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="申诉状态">
                   {this.state.userInfo.flag == 0 ? (
                    "已完成"
                  ) : this.state.userInfo.flag == 1 ?(
                    "待完成"
                  ) : (
                    "未完成"
                    )}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="发起方">
                  {this.state.userInfo.type == 1 ? (
                    "卖方"
                  ) : (
                    "买方"
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
                        <Col span={4} style={{height: "140px"}}>
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
                  {this.state.userInfo.solutionUsername}
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
                  {this.state.userInfo.solutionTime == null ? "-" : moment(this.state.userInfo.solutionTime).format('YYYY-MM-DD HH:mm:ss')}
                </BaseDetails>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BaseDetails title="处理结果">
                  {this.state.userInfo.solutionRemark}
                </BaseDetails>
              </Col>
            </Row>
          </Card>
          {this.renderBackMsg()}
          <BaseAffix>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={this.handleGoBack}
            >
              返回
            </Button>
          </BaseAffix>
        </Form>
      </div>
    );
  }
}
export default Form.create()(AuditForBg);
