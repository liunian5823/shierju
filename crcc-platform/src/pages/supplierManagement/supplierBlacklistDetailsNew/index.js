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
       * baseTable?????????????????????
       *
       * 1.baseParams //?????????????????????????????????
       * 2.handelToLoadTable //
       * 3.resetTable //
       * 4.columns //????????????
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
        title: '????????????',
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
        title: '????????????',
        dataIndex: 'contents',
        key: 'contents',
        sorter: true
      },
      {
        title: '?????????',
        dataIndex: 'userName',
        key: 'userName',
        sorter: true
      },
      {
        title: '????????????',
        dataIndex: 'reportingCompany',
        key: 'reportingCompany',
        sorter: true
      },
      {
        title: '??????',
        dataIndex: 'rating',
        key: 'rating',
        sorter: true,
        render: (text, record) => {
          if (record.rating == null) {
            return <span title={text}>{"-"}</span>
          }
          if (record.rating == 0) {
            return <span>{"???"} </span>;
          } else if (record.rating == 1) {
            return <span>{"???"} </span>;
          } else if (record.rating == 2) {
            return <span>{"???"} </span>;
          }
        }
      },
      {
        title: '????????????',
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
        title: '??????',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
          <span>
            <a href="javascript:void(0);" onClick={() => { this.handleToDetails(record.blacklistUuids, index) }}>??????</a>
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
        <Card className="mb10" title="????????????" bordered={false}>
          <Row style={rowStyle}>
            <Col span={8}>
              <BaseDetails title="????????????">
                {this.state.info.companyName}
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="????????????????????????">
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
                ????????????
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
              <BaseDetails title="????????????">
                {this.state.info.enterpriseLegalPerson == null
                  ? '-'
                  : this.state.info.enterpriseLegalPerson}
              </BaseDetails>
            </Col>
            <Col span={8}>
              <BaseDetails title="?????????????????????">
                {this.state.info.enterpriseLegalPersonId == null
                  ? '-'
                  : this.state.info.enterpriseLegalPersonId}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <BaseDetails title="???????????????">
                {this.state.info.effective == '0' ? '?????????' : '?????????'}
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card className="mb10" title="????????????" bordered={false}>
          <Row>
            <Col span={12}>
              <BaseDetails title="????????????">
                {moment(this.state.info.createTime).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="?????????">
                {this.state.info.processingPerson}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="????????????">
                {this.state.info.effective == '1'
                  ? '??????'
                  : this.state.info.effective == '0'
                    ? '??????'
                    : '??????'}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="??????">
                {this.state.info.rating == '0'
                  ? '???'
                  : this.state.info.rating == '1'
                    ? '???'
                    : '???'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="????????????">
                {this.state.info.reportingCompany}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="????????????">
                {this.state.info.yearPublished}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="??????">{this.state.info.area}</BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="??????">
                {this.state.info.souce == '1' ? '????????????' : '????????????'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="??????">{this.state.info.province}</BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="?????????">
                {this.state.info.address}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BaseDetails title="????????????">
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
                ??????
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