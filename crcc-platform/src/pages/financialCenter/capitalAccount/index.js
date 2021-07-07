import { Row, Col, Card, Form, Select } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseDetails from '@/components/baseDetails';

import less from './index.less';

const FormItem = Form.Item;

class CapitalAccount extends React.Component{
  _isMounted = false;
  componentWillMount(){
    this._isMounted = true;
    this.getCapitalInfo();
  }
  componentWillUnmount(){
    this._isMounted = false;
  }
  getCapitalInfo = () => {
    let _this = this;
    api.ajax('GET', '@/microservice-finance/ecFinanceInfo/get',{
    }).then(r=>{
      if(!_this._isMounted){
        return;
      }
      this.setState({
      })
    })
  }
  render(){
    return(
      <div>
        <Card bordered={false} title="平台账户信息" className="mb10"
          extra={<Select defaultValue='1'><Option value='1'>平安银行</Option><Option value='2'>其他银行</Option></Select>}>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="利息子账户">
                11111元
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="挂账子账号">
                0元
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="大账户金额">
                11111元
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="手续费子账号">
                0元
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="平台子账号信息">
          <Row gutter={16}>
            <Col span={24}>
              <span className={less.box}>总金额(元)</span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <span className={less.box}><span className={less.money}>0000</span>元</span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <BaseDetails title="冻结金额">
                ￥111
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <BaseDetails title="在途金额">
                ￥111
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <BaseDetails title="可用金额">
                ￥111
              </BaseDetails>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title=' ' className="mb10">
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="开户名称">
                  11111
                </BaseDetails>
              </Col>
              <Col span={12}>
                <BaseDetails title="开户代码">
                  02131
                </BaseDetails>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <BaseDetails title="会员代码">
                  11111
                </BaseDetails>
              </Col>
            </Row>
          </Card>
        <Card bordered={false} title={<span>对公网银账号<span className={less.remark}>&nbsp;&nbsp;平台运营对公账户用户资金的充值和转出；对公网银账号的绑定工作需后台联系系统管理员绑定和变更。</span></span>} className='mb10'>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="账户名称">
              111
              </BaseDetails>
            </Col>
            <Col span={12}>
              <BaseDetails title="银行卡号">
              111
              </BaseDetails>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <BaseDetails title="开户银行">
              111
              </BaseDetails>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
export default CapitalAccount