import { Row, Col, Button, Table, Card, Form, Select, Input,DatePicker ,Divider ,message} from 'antd';
import api from '@/framework/axios';
import BaseDetails from '@/components/baseDetails';
import {NumberFormat} from '@/components/content/Format'
import less from './index.less';


class FundsAccount extends React.Component{
  state = {
      capitalInfo: {
          availAmt:0,
          frozeAmt:0,
          transitAmt:0,
          totalAmt:0,
      },// 资金账户信息
      arrayContent: [0,0,0],// 功能账户信息
      TotalBalance: 0,// 平台账户信息大账户金额
  };
  _isMounted = false;

  componentWillMount(){
      this._isMounted = true;
      this.getPlatformAccountInformation();
      this.getPlatformAccountInformationLargeAccountAmount();
      this.getUuids();
  };
  componentWillUnmount(){
    this._isMounted = false;
  };

  getUuids = () => {
      let that = this;
      api.ajax('GET', '!!/financial/capitalFlow/getFinanceInfoOne',{
      }).then((r)=>{
          this.getCompanyId().then(function(data) {
              that.getCapitalInfo(r.data, data.data);
          })
      })
  };

    /**
     * 获得平台账户信息大账户金额
     *
     * @returns
     */
    getPlatformAccountInformationLargeAccountAmount = () => {
        let that = this;
        api.ajax('GET', '!!/financial/capitalFlow/getPlatformAccountInformationLargeAccountAmount',{
        }).then((r)=>{
            if (r) {
                if ( r.data.RespCode == "000000" ){
                    that.setState({
                        TotalBalance: r.data.TotalBalance
                    })
                } else {
                    message.error(r.data.RespInfo);
                }
            } else {
                message.error("操作失败!!");
            }

        })
    };

    /**
     * 获得平台账户信息
     *
     * @returns
     */
    getPlatformAccountInformation = () => {
        let that = this;
        api.ajax('GET', '!!/financial/capitalFlow/getPlatformAccountInformation',{
        }).then((r)=>{
            if (r) {
                    that.setState({
                        arrayContent: r.data
                    })
            } else {
                message.error("操作失败!!");
            }

        })
    };

    /**
     * 获得当前用户CompanyId
     *
     * @returns
     */
    getCompanyId=()=>{

        let obj = new Promise(function(resolve, reject){
            api.ajax('GET', '!!/financial/capitalFlow/getCompanyId',{
            }).then((r)=>{
                resolve(r);
            })
        });

        return obj;
    }

  getCapitalInfo = (uuids,companyId) => {
    let _this = this;
    let params = {};
    params.uuids = uuids;
    params.companyId = companyId;
    params.actId = '3226000000011009'
    api.ajax('GET', '!!/financial/ecFinanceInfo/getCapitalInfo',{
            ...params
    }).then((r)=>{
      if(!_this._isMounted){
        return;
      }
      this.setState({
        capitalInfo: r.data
      })
    })
  };

  render(){
    return(
      <div>
        <Card bordered={false} title="平台账户信息" className="mb10"
              extra={<Select defaultValue={this.state.capitalInfo.bankName ==='平安银行' ? '1' :'2'} style={{width:"200px"}}>
                  <Option value='1'>平安银行</Option><Option value='2'>其他银行</Option></Select>}
        >
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="利息子账户">
                  <NumberFormat value={this.state.arrayContent[2]}/>元
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="挂账子账户">
                  <NumberFormat value={this.state.arrayContent[0]}/>元
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="大账户金额">
                  <NumberFormat value={this.state.TotalBalance}/>元
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="手续费子账户">
                  <NumberFormat value={this.state.arrayContent[1]}/>元
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="平台子账号信息" className="mb10">
          <Row gutter={16}>
            <Col span={24}>
              <span className={less.moneyText}>总金额(元)</span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <span className={less.totalMoney}> <NumberFormat value={this.state.capitalInfo.totalAmt}/> </span><span className={less.moneyUnit}>元</span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <BaseDetails title="冻结金额">
                ￥<NumberFormat value={this.state.capitalInfo.frozeAmt}/>
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <BaseDetails title="在途金额">
                ￥<NumberFormat value={this.state.capitalInfo.transitAmt}/>
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <BaseDetails title="可用金额">
                ￥<NumberFormat value={this.state.capitalInfo.availAmt}/>
              </BaseDetails>
            </Col>
          </Row>

          <Row gutter={16} style={{borderTop: "1px solid rgba(233,233,233,1)", paddingTop: "18px"}}>
              <Col span={12}>
                  <BaseDetails title="开户名称">
                      {this.state.capitalInfo.name}
                  </BaseDetails>
              </Col>
              <Col span={12}>
                  <BaseDetails title="会员代码">
                      {this.state.capitalInfo.thirdCustId}
                  </BaseDetails>
              </Col>
          </Row>
        </Card>
        <Card bordered={false} title={<span>对公网银账号<span className={less.remark}>&nbsp;&nbsp;平台运营对公账户用户资金的充值和转出;对公网银账号的绑定工作需后台联系系统管理员绑定和变更。</span></span>} className='mb10'>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="账户名称">
              {this.state.capitalInfo.companyName}
              </BaseDetails>
            </Col>
            <Col span={12}>
                <BaseDetails title="银行卡号">
                    {this.state.capitalInfo.bankNo}
                </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
                <BaseDetails title="开户银行">
                    {this.state.capitalInfo.bankName}
                </BaseDetails>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
export default Form.create()(FundsAccount)