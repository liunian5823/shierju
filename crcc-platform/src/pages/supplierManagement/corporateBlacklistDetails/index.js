import { Card, Row, Col, Table, Button } from 'antd';
import api from '@/framework/axios';
import BaseDetails from '@/components/baseDetails';
import DetailsModal from './detailsModal';
import BaseTable from '@/components/baseTable';
import Util from '@/utils/util';

class corporateBlacklistDetails extends React.Component {
  state = {
    loading: false,
    dataSouce: {},
    info: {},
    dataSource: [],
    modalData: {},
    modalShow: false,

    tableState1: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    tableState2: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
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
    if (this.state.loading) return false;
    this.setState({
      loading: true,
    })
    api.ajax('GET', '@/supplier/ecBlacklistCompany/get', {
      uuids: uuids,
      type: 1
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      this.setState({
        loading: false,
        info: r.data
      })

      this.baseParams1 = {
        ...this.baseParams1,
        legalPersonId: r.data.legalPersonId
      }
      this.handelToLoadTable(1,'tableState1');

      this.baseParams2 = {
        ...this.baseParams2,
        legalPersonId: r.data.legalPersonId
      }
      this.handelToLoadTable(2,'tableState2');
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
  baseParams1 = {
    type: 1
  }
  baseParams2 = {
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
  columns1 = () => {
    return [
      {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        render:(text)=>{
          if(text){
            return moment(text).format("YYYY-MM-DD hh:mm:ss")
          }else{
            return null
          }
        }
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
        sorter: true,
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

  columns2 = () => {
    return [
      {
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
        width: 280,
        sorter: true
      },
      {
        title: '营业执照号',
        dataIndex: 'businessLicense',
        key: 'businessLicense',
        width: 180,
        sorter: true
      },
      {
        title: '入驻时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
        sorter: true
      },
      {
        title: '供应商类型',
        dataIndex: 'factoryType',
        key: 'factoryType',
        width: 120,
        sorter: true,
        render: (text, record) => (
          <span>
            {record.factoryType == "1" ? "厂家" : record.factoryType == "2" ? "贸易集成商" : "个体户"}
          </span>
        )
      },
      {
        title: '来源信息',
        dataIndex: 'source',
        key: 'source',
        width: 120,
        sorter: true,
        render: (text, record) => (
          <span>
            {record.source == "0" ? "自主注册" : record.source == "1" ? "各局推荐" : record.source == "3" ? "后台添加" : "广联达"}
          </span>
        )
      },
    ]
  }

  handleBack = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <div>
        <Card className="mb10" title="基本信息" bordered={false}>
          <Row>
            <Col span={12}>
              <BaseDetails title="姓名">
                {this.state.info.legalPerson}
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="性别">
                {this.state.info.gender == 0 ? '男' : this.state.info.gender == 1 ? '女' : '-'}
              </BaseDetails>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <BaseDetails title="身份证/护照号">
                {Util.formatterData('idcard', this.state.info.legalPersonId)}
              </BaseDetails>
            </Col>
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
                tableState={this.state.tableState1}
                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                baseParams={this.baseParams1}
                columns={this.columns1()}
                indexkeyWidth={60}
              />
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="法人所有公司">
          <Row gutter={16}>
            <Col span={24}>
              <BaseTable
                notInit={true}
                url="@/supplier/ecCompanySupplier/queryCompanySupplierList"
                tableState={this.state.tableState2}
                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                baseParams={this.baseParams2}
                columns={this.columns2()}
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
export default corporateBlacklistDetails;