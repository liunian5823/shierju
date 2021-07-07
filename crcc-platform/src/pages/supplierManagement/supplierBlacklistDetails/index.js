import { Card, Row, Col, Table, Button } from 'antd';
import api from '@/framework/axios';
import BaseDetails from '@/components/baseDetails';
import DetailsModal from './detailsModal';
import BaseTable from '@/components/baseTable';
import Util from '@/utils/util';

class supplierBlacklistDetails extends React.Component {
  state = {
    loading: false,
    dataSouce: {},
    info: {},
    dataSource: [],
    modalData: {},
    modalShow: false,
  }
  _isMounted = false;

  componentWillMount() {
    this._isMounted = true;
    const uuids = this.props.match.params.uuids;
    this.getInfo(uuids);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleToDetails = (uuids) => {
    let _this = this;
    api.ajax('GET', '@/supplier/ecBlacklistCompany/get', {
      uuids: uuids,
      type: 2
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        modalData: r.data,
        modalShow: true
      })
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
    api.ajax('GET', '@/supplier/ecBlacklistCompany/get', {
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
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true
      },
      {
        title: '处理结果',
        dataIndex: 'resultType',
        key: 'resultType',
        sorter: true
      },
      {
        title: '处理人',
        dataIndex: 'removePerson',
        key: 'removePerson',
        sorter: true
      },
      {
        title: '来源',
        dataIndex: 'source',
        key: 'source',
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
        sorter: true
      },
      {
        title: '案情简述',
        dataIndex: 'remarks',
        key: 'remarks',
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
        render: (text, record) => (
          <span>
            <a href="javascript:void(0);" onClick={() => { this.handleToDetails(record.uuids) }}>查看</a>
          </span>
        )
      }
    ]
  }

  handleBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div>
        <Card className="mb10" title="基本信息" bordered={false}>
          <Row>
            <Col span={12}>
              <BaseDetails title="公司名称">
                {this.state.info.companyName}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="营业执照号">
                {this.state.info.businessLicenseNo}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="供应商类型">
                {this.state.info.factoryType == "1" ? "厂家" : this.state.info.factoryType == "2" ? "贸易集成商" : "个体户"}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="入驻时间">
                {moment(this.state.info.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="生效状态">
                {this.state.info.effective == "0" ? "生效" : "失效"}
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card className="mb10" title="历史纪录" bordered={false}>
          <Row>
            <Col span={12}>
              <BaseDetails title="操作时间">
                {moment(this.state.info.blackTime).format('YYYY-MM-DD HH:mm:ss')}
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
                {this.state.info.effective == "1" ? "失效" : this.state.info.effective == "0" ? "生效" : "拉黑"}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="来源">
                {this.state.info.souce == '1' ? '铁建商城' : '股份公司'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="评级">
                {this.state.info.rating == "0" ? '黑' : this.state.info.rating == '1' ? '灰' : '黄'}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="上报单位">
                {this.state.info.reportingCompany}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="区域">
                {this.state.info.area}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="发布年份">
                {this.state.info.yearPublished}
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
                url="@/supplier/ecBlacklistCompany/queryBlackHistory"
                tableState={this.state.tableState}
                resetTable={(state) => { this.resetTable(state, 'tableState') }}
                baseParams={this.baseParams}
                columns={this.columns()}
                indexkeyWidth={60}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={4} offset={10}>
              <Button type="primary" onClick={this.handleBack} style={{ marginTop: 10 }}>返回</Button>
            </Col>
          </Row>
        </Card>
        <DetailsModal
          visible={this.state.modalShow}
          onCancel={this.handleOnCancel}
          info={this.state.modalData}>
        </DetailsModal>
      </div>
    )
  }
}
export default supplierBlacklistDetails;