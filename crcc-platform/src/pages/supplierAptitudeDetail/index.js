import { Select,Card,Form,Row,Col,Input,Button, Icon, Table, Divider, Menu, Dropdown, Modal, message, DatePicker, Tabs,Checkbox, Pagination,Popconfirm } from 'antd';
import {getDetailsLabel} from  '@/components/gaoda/Details';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns'
import {getUrlByParam, getQueryString} from '@/utils/urlUtils';
import BaseDetails from '@/components/baseDetails';
import BaseAffix from '@/components/baseAffix';
import api from '@/framework/axios';
import less from './index.less';
import noFucPic from '@/static/iconfont/noFucPic.png';

const TabPane = Tabs.TabPane;
class SupplierAptitudeDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sellerUuids:"",//供应商uuids
            dataSource: {

            },
            searchForm: {
                state: 1
            }
        }
    };

    componentWillMount() {
        let sellerUuids = getQueryString("sellerUuids");
        this.setState({
            sellerUuids:sellerUuids,
        },()=>{
            this.loadData();
        });
    };

    //加载数据
    loadData=()=>{
        let params = {};
        params.sellerUuids = this.state.sellerUuids;
        api.ajax("GET","!!/purchaser/supplierAptitudeController/getSupplierAptitudeDetail", {
            ...params
        }).then((r) => {
            this.setState({
                dataSource: r.data
            })
        });
    }

    //注册资金显示
    registeredCapitalShow=(registeredCapital)=>{
        if (registeredCapital != undefined && registeredCapital != null) {
            return <span>{registeredCapital}万元</span>
        } else {
            return <span></span>
        }
    }

    /**
     * 关闭页面
     */
    closeWindow=()=>{
        window.close();
    }

    /**
     * tab 切换事件
     * @param key
     */
    tabsChange = (key) => {
        this.setState({
            searchForm: {
                state: key
            }
        })
    }

    //open 页面
    openBigPic=(src)=>{
        window.open(src);
    }

    render() {
        let picHtml;
        //threeInOne : 三证合一 0：否， 1：是
        let threeInOne = this.state.dataSource.threeInOne;
        if (threeInOne == 0) {      //三证合一 0：否
            picHtml = (
                <Row>
                    <Col span={6} >
                        <div className={less.pic_four_div}>
                            <img src={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.businessLicensePath)} onClick={this.openBigPic.bind(this, SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.businessLicensePath))} className={less.pic_four_img}/>
                        </div>
                        <div className={less.picFont}>
                            营业执照
                        </div>
                    </Col>
                    <Col span={6} >
                        <div className={less.pic_four_div}>
                            <img src={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.taxRegistrationPath)} onClick={this.openBigPic.bind(this, SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.taxRegistrationPath))} className={less.pic_four_img} />
                        </div>
                        <div className={less.picFont}>
                            税务登记证
                        </div>
                    </Col>
                    <Col span={6} >
                        <div className={less.pic_four_div}>
                            <img src={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.organizationCertificatePath)} onClick={this.openBigPic.bind(this, SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.organizationCertificatePath))} className={less.pic_four_img} />
                        </div>
                        <div className={less.picFont}>
                            组织机构代码证
                        </div>
                    </Col>
                    <Col span={6} >
                        <div className={less.pic_four_div}>
                            <img src={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.accountPermitPath)} onClick={this.openBigPic.bind(this, SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.accountPermitPath))} className={less.pic_four_img} />
                        </div>
                        <div className={less.picFont}>
                            开户许可证
                        </div>
                    </Col>
                </Row>
            );
        } else if (threeInOne == 1) {   //三证合一  1：是
            picHtml = (
                <Row>
                    <Col span={6} >
                        <div className={less.pic_four_div}>
                            <img src={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.businessLicensePath)} onClick={this.openBigPic.bind(this, SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.businessLicensePath))} className={less.pic_four_img} />
                        </div>
                        <div className={less.picFont}>
                            营业执照
                        </div>
                    </Col>
                    <Col span={6} >
                        <div className={less.pic_four_div}>
                            <img src={SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.accountPermitPath)} onClick={this.openBigPic.bind(this, SystemConfig.systemConfigPath.dfsPathUrl(this.state.dataSource.accountPermitPath))} className={less.pic_four_img} />
                        </div>
                        <div className={less.picFont}>
                            开户许可证
                        </div>
                    </Col>
                    <Col span={6} >

                    </Col>
                    <Col span={6} >
                        
                    </Col>
                </Row>
            );
        }

        //执照有效期
        let zzyxq;
            let businessEndTimeStr = this.state.dataSource.businessEndTimeStr;
            let businessStartTimeStr =  this.state.dataSource.businessStartTimeStr;
            zzyxq =businessStartTimeStr + " - " + businessEndTimeStr;

        return (
            <div>
                <Card title="企业/法人信息" bordered={false} className="mb10">
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="企业名称">
                                <p>{this.state.dataSource.name}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="营业执照号">
                                <p>{this.state.dataSource.businessLicense}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="企业类型">
                                <p>{this.state.dataSource.factoryTypeStr}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="主营项目">
                                <p>{this.state.dataSource.mainBusinessStr}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="出口资质">
                                <p>{this.state.dataSource.exportQualificationStr}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="法人姓名">
                                <p>{this.state.dataSource.legalPersonName}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <BaseDetails title="执照有效期">
                                <p>{zzyxq}</p>
                            </BaseDetails>
                        </Col>
                        <Col span={12}>
                            <BaseDetails title="注册资本">
                                <p>{this.registeredCapitalShow(this.state.dataSource.registeredCapital)}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <BaseDetails title="公司所在地">
                                <p>{this.state.dataSource.name}</p>
                            </BaseDetails>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} className="mb10">
                    <Tabs onChange={this.tabsChange}>
                        <TabPane tab="基本信息" key="1">
                            {picHtml}
                        </TabPane>
                        <TabPane tab="法律诉讼" key="2" >
                            <div style={{textAlign:"center"}}>
                                <img src={noFucPic}/>
                            </div>
                        </TabPane>
                        <TabPane tab="经营情况" key="3">
                            <div style={{textAlign:"center"}}>
                                <img src={noFucPic}/>
                            </div>
                        </TabPane>
                        <TabPane tab="征信情况" key="4">
                            <div style={{textAlign:"center"}}>
                                <img src={noFucPic}/>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
                <BaseAffix>
                    <Button type="primary" onClick={this.closeWindow}>关闭</Button>
                </BaseAffix>
            </div>
        );
    }
}

export default SupplierAptitudeDetail