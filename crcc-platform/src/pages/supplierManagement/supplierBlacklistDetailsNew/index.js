import { Card, Row, Col, Table, Button, Modal } from 'antd';
import api from '@/framework/axios';
import BaseDetails from '@/components/baseDetails';
import DetailsModal from './detailsModal';
import BaseTable from '@/components/baseTable';
import { systemConfigPath } from '@/utils/config/systemConfig';

class supplierBlacklistDetails extends React.Component {
  state = {
    loading: false,
    dataSouce: {},
    info: {},
    dataSource: [],
    modalData: {},
    modalShow: false,
    visible: false,
    data: []
  }
  showModal = (name) => {
    if (name == '') {
      return
    }
    window.open(systemConfigPath.jumpCrccmallPage(`/qualification/basicInfomation?companyName=` + name))
    // this.setState({
    //   visible: true,
    // });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
    const uuids = this.props.match.params.uuids;
    this.getInfo(uuids);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleToDetails = (uuids, index) => {

    let modalData = {}
    api.ajax('GET', '@/platform/blacklist/company/findByUuids', {
      uuids: uuids,
      type: 2
    }).then(r => {
      if (!this._isMounted) {
        return;
      }
      modalData = r.data;
      modalData.createTime = this.state.data[index].createTime;
      modalData.remarks = this.state.data[index].mark;
      this.setState(
        {
          modalShow: true,
          modalData: modalData,
        }
      );
    }).catch(r => {
    })
  }

  handleOnCancel = () => {
    this.setState({
      modalShow: false
    })
  }

  getInfo = (uuids) => {
    let _this = this;
    this.setState({
      loading: true,
    })
    api.ajax('GET', '@/platform/blacklist/company/findByUuids', {
      uuids: uuids,
      type: 2
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        loading: false,
        info: r.data
      })

      this.baseParams = {
        ...this.baseParams,
        businessLicense: r.data.businessLicenseNo
      }
      this.handelToLoadTable();
    }).catch(r => {
      this.setState({
        loading: false
      })
    })
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
    type: 2
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
  columns = () => {
    return [
      {
        title: '操作时间',
        dataIndex: 'operateTime',
        key: 'operateTime',
        sorter: true,
        render: (text, record) => (
          <span>
            {moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        )
      },
      {
        title: '处理结果',
        dataIndex: 'contents',
        key: 'contents',
        sorter: true
      },
      {
        title: '处理人',
        dataIndex: 'userName',
        key: 'userName',
        sorter: true
      },
      {
        title: '上报单位',
        dataIndex: 'reportingCompany',
        key: 'reportingCompany',
        sorter: true
      },
      {
        title: '评级',
        dataIndex: 'rating',
        key: 'rating',
        sorter: true,
        render: (text, record) => {
          if (record.rating == null) {
            return <span title={text}>{"-"}</span>
          }
          if (record.rating == 0) {
            return <span>{"黑"} </span>;
          } else if (record.rating == 1) {
            return <span>{"灰"} </span>;
          } else if (record.rating == 2) {
            return <span>{"黄"} </span>;
          }
        }
      },
      {
        title: '案情简述',
        dataIndex: 'mark',
        key: 'mark',
        sorter: true,
        width: 300,
        render: (text) => {
          if (text && text.length > 20) {
            return <span title={text}>{text.substring(0, 18)}...</span>
          } else {
            return text
          }
        }
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
          <span>
            <a href="javascript:void(0);" onClick={() => { this.handleToDetails(record.blacklistUuids, index) }}>查看</a>
          </span>
        )
      }
    ]
  }

  handleBack = () => {
    this.props.history.goBack();
  }
  resetData = (data) => {
    this.setState({ data })
  }
  render() {
    const rowStyle = {

    }

    return (
      <div>
        <Card className="mb10" title="基本信息" bordered={false}>
          <Row style={rowStyle}>
            <Col span={8}>
              <BaseDetails title="公司名称">
                {this.state.info.companyName}
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="统一社会信用代码">
                {this.state.info.businessLicenseNo}
              </BaseDetails>
            </Col>
            <div>
              {/* <Button type="primary" onClick={()=>{this.showModal(company.companyName ? company.companyName : '')}}> */}
              <Button
                type="primary"
                onClick={() =>
                  this.showModal(
                    this.state.info.companyName
                      ? this.state.info.companyName
                      : '',
                  )
                }
              >
                查看资质
              </Button>
              <Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </Modal>
            </div>
          </Row>
          <Row>
            <Col span={8}>
              <BaseDetails title="法人姓名">
                {this.state.info.enterpriseLegalPerson == null
                  ? '-'
                  : this.state.info.enterpriseLegalPerson}
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="法人身份份证号">
                {this.state.info.enterpriseLegalPersonId == null
                  ? '-'
                  : this.state.info.enterpriseLegalPersonId}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <BaseDetails title="黑名单状态">
                {this.state.info.effective == '0' ? '已拉黑' : '未拉黑'}
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card className="mb10" title="历史纪录" bordered={false}>
          <Row>
            <Col span={12}>
              <BaseDetails title="操作时间">
                {moment(this.state.info.createTime).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="处理人">
                {this.state.info.processingPerson}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="处理结果">
                {this.state.info.effective == '1'
                  ? '失效'
                  : this.state.info.effective == '0'
                    ? '生效'
                    : '拉黑'}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="评级">
                {this.state.info.rating == '0'
                  ? '黑'
                  : this.state.info.rating == '1'
                    ? '灰'
                    : '黄'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="上报单位">
                {this.state.info.reportingCompany}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="发布年份">
                {this.state.info.yearPublished}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="区域">{this.state.info.area}</BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="来源">
                {this.state.info.souce == '1' ? '铁建商城' : '股份公司'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="省份">{this.state.info.province}</BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="所在地">
                {this.state.info.address}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="案情简述">
                {this.state.info.remarks}
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <BaseTable
                notInit={true}
                url="@/platform/blacklist/company/findPlatBlackHistory"
                tableState={this.state.tableState}
                resetTable={(state) => {
                  this.resetTable(state, 'tableState');
                }}
                baseParams={this.baseParams}
                columns={this.columns()}
                indexkeyWidth={60}
                resetData={this.resetData}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={4} offset={10}>
              <Button
                type="primary"
                onClick={this.handleBack}
                style={{ marginTop: 10 }}
              >
                返回
              </Button>
            </Col>
          </Row>
        </Card>
        <DetailsModal
          visible={this.state.modalShow}
          onCancel={this.handleOnCancel}
          info={this.state.modalData}
        ></DetailsModal>
      </div>
    );
  }
}
export default supplierBlacklistDetails;