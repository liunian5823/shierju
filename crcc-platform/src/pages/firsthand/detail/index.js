import {Button, Card, Col, Form, Input, Radio, Row, Table, Tabs, Popconfirm} from "antd";
import api from '@/framework/axios'
import {getQueryString} from '@/utils/urlUtils';
import Util from '@/utils/util';


import less from "./index.less";
import defaultGoodsImg from "../img/defaultGoodsImg.png";

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const imageOrigin = SystemConfig.configs.resourceUrl;
class ContractApprovalDetail extends React.Component{
    _uuids = '';
    _approvalStatus = false;
    state={
        selectTab: '1',
        goodsList: [],
        contractInfo: {},
        goodsTab: '1',
        goodsInfo: {},
        imgUrl: '',
        status: '40',       //审核结果

    }

    componentWillMount() {
        this._isMounted = true;
        let uuids = getQueryString("uuids");
        let status = getQueryString("status");
        if (status == 30){
            this._approvalStatus = true;
        }
        console.log('componentWillMount  uuids ------------ ', uuids)
        if (uuids){
            this._uuids = uuids;
            this.queryBindGoodsInfo(uuids);
            this.queryContractInfo(uuids);
            this.queryGoodsInfo(uuids);
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //查询合同基本信息
    queryContractInfo=(uuids)=>{
        api.ajax(
            'GET',
            '@/firsthand/dpContract/getOneDpContract?uuids=' + uuids,
            {}
        ).then(r=>{
            this.setState({
                contractInfo: r.data
            })
        }).catch(r=>{
            console.log('queryContractInfo catch ========== ', r)
        })
    }

    //查询物料信息
    queryBindGoodsInfo=(uuids)=>{
        api.ajax(
            'GET',
            '@/firsthand/contractGoodsRelation/queryContractGoodsDetailByUuids?uuids=' + uuids,
            {}
        ).then(r=>{
            console.log('queryBindGoodsInfo then ----------------- ', r)
            if (r.data){
                let data = r.data;
                //
                let goodsList = [
                    {
                        goodsName: data.goodsName,
                        brand: data.brand,
                        spec: data.spec,
                        unit: data.unit,
                        taxRate: data.taxRate,
                        amount: data.amount,
                        taxAmount: data.taxAmount,
                        totalPrice: data.totalPrice
                    }
                ]

                this.setState({
                    goodsList: goodsList
                })
            }
        }).catch(r=>{
            console.log('queryBindGoodsInfo catch ----------------- ', r)
        })
    }

    //商品详情信息查询
    queryGoodsInfo=(uuids)=>{
        api.ajax(
            'GET',
            '@/firsthand/dpContractGoods/getContractEcGoodDetail?cgUUIds=' + uuids,
        ).then(r=>{
            if (r.data){
                let mainImg = '';
                //处理下商品主图
                if (data.imgList && data.imgList.length > 0)
                    mainImg = data.imgList[0].url;
                this.setState({
                    goodsInfo: r.data,
                    mainImg
                })
            }
        }).catch(r=>{
            console.log('getGoodsInfo  catch ---------- ', r)
        })
    }


    //物料表头
    goodsColumns=[
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width: 150,
        },{
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
            width: 100,
        },{
            title: '型号',
            dataIndex: 'spec',
            key: 'spec',
            width: 150,
        },{
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 100,
        },{
            title: '成本单价',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            render: (text, record)=>{
                return <span>{text ? text.toFixed(2) : ''}</span>
            }
        },{
            title: '税率',
            dataIndex: 'taxRate',
            key: 'taxRate',
            width: 100,
            render: (text, record)=>{
                if (text)
                    return <span>{(text * 100).toFixed(0)}%</span>
                else
                    return '';
            }
        },{
            title: '税额',
            dataIndex: 'taxAmount',
            key: 'taxAmount',
            width: 100,
            render: (text, record)=>{
                return <span>{text ? text.toFixed(2) : ''}</span>
            }
        },{
            title: '价税合计',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100,
            render: (text, record)=>{
                return <span>{text ? text.toFixed(2) : ''}</span>
            }
        }
    ]


    tabChange=(v)=>{
        this.setState({
            selectTab: v
        })
    }

    //
    showContractInfo=()=>{
        let {selectTab, goodsList, contractInfo} = this.state;
        if (selectTab == '1'){
            return (
                <Table
                    dataSource={goodsList}
                    columns={this.goodsColumns}
                    pagination={false}
                />
            )
        }
        if (selectTab == '2'){
            return (
                <div>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>合同名称：</Col>
                        <Col span={20}>{contractInfo.contractName}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>采方合同号：</Col>
                        <Col span={8}>{contractInfo.buyerContractNo}</Col>
                        <Col span={4} className={less.textRight}>合同生效日期：</Col>
                        <Col span={8}>{moment(contractInfo.startTime).format("YYYY-MM-DD")}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>供方合同号：</Col>
                        <Col span={8}>{contractInfo.sellerContractNo}</Col>
                        <Col span={4} className={less.textRight}>合同结束日期：</Col>
                        <Col span={8}>{moment(contractInfo.endTime).format("YYYY-MM-DD")}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>平台合同号：</Col>
                        <Col span={20}>{contractInfo.contractNo}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>录入方：</Col>
                        <Col span={20}>{contractInfo.createCompanyId == 0 ? '平台' : '用户'}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>录入用户：</Col>
                        <Col span={20}>{contractInfo.createUser} {contractInfo.createUserTel}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>合同适用公司范围：</Col>
                        <Col span={20}>{contractInfo.range == '0' ? '仅适用于本公司及所属项目部' : '可适用于本公司及下级公司所属项目部'}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>合同适用项目部：</Col>
                        <Col span={20}>{this.showOrgList(contractInfo.orgList)}</Col>
                    </Row>
                </div>
            )
        }

        if (selectTab == '3'){
            return (
                <div>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>采方公司名：</Col>
                        <Col span={8}>{contractInfo.buyerCompanyName}</Col>
                        <Col span={4} className={less.textRight}>供方公司名：</Col>
                        <Col span={8}>{contractInfo.sellerCompanyName}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>统一社会信用代码：</Col>
                        <Col span={8}>{contractInfo.buyerBusinessLicense}</Col>
                        <Col span={4} className={less.textRight}>统一社会信用代码：</Col>
                        <Col span={8}>{contractInfo.sellerBusinessLicense}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>采购联系人：</Col>
                        <Col span={8}>{contractInfo.buyerContacts}</Col>
                        <Col span={4} className={less.textRight}>供应联系人：</Col>
                        <Col span={8}>{contractInfo.sellerContacts}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>采购联系电话：</Col>
                        <Col span={8}>{contractInfo.buyerContactsPhone}</Col>
                        <Col span={4} className={less.textRight}>供应联系电话：</Col>
                        <Col span={8}>{contractInfo.sellerContactsPhone}</Col>
                    </Row>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>合同附件：</Col>
                        <Col span={20}>
                            <a download={contractInfo.filePath}>{contractInfo.fileName}</a>
                        </Col>
                    </Row>
                </div>
            )
        }
    }

    //项目表头
    orgColumn=[
        {
            title: '公司名',
            dataIndex: 'companyName',
            key: 'companyName',
            width: 150,
        },{
            title: '项目名',
            dataIndex: 'organizationName',
            key: 'organizationName',
            width: 150,
        }
    ]

    //项目部展示
    showOrgList=(orgList)=>{
        return (
            <Table
                dataSource={orgList}
                columns={this.orgColumn}
                pagination={false}
            />
        )
    }

    //
    goodsTabChange=(v)=>{
        this.setState({
            goodsTab: v
        })
    }

    //
    clickImg=(url)=>{
        this.setState({
            mainImg: url
        })
    }

    //
    showGoodsInfo=()=>{
        let {goodsInfo, goodsTab, imgUrl} = this.state;
        let imgList = goodsInfo && goodsInfo.imgList ? goodsInfo.imgList : [];
        imgList = [
            {
                url: 'url1',
            },{
                url: 'url2',
            },{
                url: 'url3',
            }
        ]
        if (goodsTab == '1'){
            return (
                <div>
                    <Row span={24}>
                        <Col span={8}>
                            <Row >
                                <img className={less.mainImg} src={imgUrl ? imageOrigin + imgUrl : defaultGoodsImg}/>
                            </Row>
                            <Row span={24} className={less.imgShowClass}>
                                {
                                    imgList.map((item, index)=>{
                                        if (item.url)
                                            return(
                                                <a onClick={this.clickImg.bind(this, item.url)}>
                                                    <img className={less.imgClass} src={imageOrigin + item.url} />
                                                </a>
                                            )
                                    })
                                }
                            </Row>
                        </Col>
                        <Col span={16}>
                            <Row span={24} className={less.rowClass1} style={{marginTop: '20px'}}>
                                <Col span={4} className={less.textRight}>商品名称：</Col>
                                <Col span={8}>{goodsInfo.goodsName}</Col>
                                <Col span={4} className={less.textRight}>税率：</Col>
                                <Col span={8}>{goodsInfo.taxRate}</Col>
                            </Row>
                            <Row span={24} className={less.rowClass1}>
                                <Col span={4} className={less.textRight}>品牌：</Col>
                                <Col span={8}>{goodsInfo.brand}</Col>
                                <Col span={4} className={less.textRight}>到期时间：</Col>
                                <Col span={8}>长期有效</Col>
                            </Row>
                            <Row span={24} className={less.rowClass1}>
                                <Col span={4} className={less.textRight}>商品单位：</Col>
                                <Col span={8}>{goodsInfo.unit}</Col>
                                <Col span={4} className={less.textRight}>商品分类：</Col>
                                <Col span={8}>{goodsInfo.className}</Col>
                            </Row>
                            <Row span={24} className={less.rowClass1}>
                                <Col span={4} className={less.textRight}>规格：</Col>
                                <Col span={8}>{goodsInfo.attribute}</Col>
                                <Col span={4} className={less.textRight}>进货成本价：</Col>
                                <Col span={8}>{goodsInfo.price}</Col>
                            </Row>
                            <Row span={24} className={less.rowClass1}>
                                <Col span={4} className={less.textRight}>编码：</Col>
                                <Col span={8}>{goodsInfo.skuCode}</Col>
                                <Col span={4} className={less.textRight}>展示销售价：</Col>
                                <Col span={8}>{goodsInfo.showPrice}</Col>
                            </Row>
                            <Row span={24} className={less.rowClass1}>
                                <Col span={4} className={less.textRight}>库存：</Col>
                                <Col span={8}>{goodsInfo.amount}</Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            )
        }

        if (goodsTab == '2'){
            return(
                <div dangerouslySetInnerHTML={{__html: goodsInfo.description}}></div>
            )
        }
    }

    //
    statusChange=(e)=>{
        this.setState({
            status: e.target.value,
        });
    }

    //
    closePage=()=>{
        window.close()
    }

    //
    submitApproval=()=>{
        //审核意见
        let remarks = $('#remarks').val();
        let {status} = this.state;
        api.ajax(
            'GET',
            '@/platform/firsthand/goods/auditRelationGoods',
            {
                uuids: this._uuids,
                status: status,
                remarks: remarks
            }
        ).then(r=>{
            Util.alert('提交成功！', {type: 'success'});
        })
    }

    render(){
        let {selectTab, goodsTab, status} = this.state;
        let approvalStatus = this._approvalStatus;
        return(
            <div>
                <Card title={'关联直采合同信息'}  className={less.marginTop10}>
                    <Tabs activeKey={selectTab} onChange={this.tabChange}>
                        <TabPane tab="物料清单" key="1"></TabPane>
                        <TabPane tab="合同基本信息" key="2"></TabPane>
                        <TabPane tab="合同法人主体信息" key="3"></TabPane>
                    </Tabs>
                    {this.showContractInfo()}
                </Card>

                {/*商品详情*/}
                <Card title={'商品详情'}  className={less.marginTop10}>
                    <Tabs activeKey={goodsTab} onChange={this.goodsTabChange}>
                        <TabPane tab="物料清单" key="1"></TabPane>
                        <TabPane tab="合同基本信息" key="2"></TabPane>
                    </Tabs>
                    {this.showGoodsInfo()}
                </Card>

                {/*审核*/}
                <Card title={'审核'} className={less.marginTop10} style={{display: approvalStatus ? 'block' : 'none' }}>
                    <Row span={24} className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>审核结果：</Col>
                        <Col span={20}>
                            <RadioGroup onChange={this.statusChange} value={status}>
                                <Radio key="1" value={'40'}>通过</Radio>
                                <Radio key="2" value={'50'}>驳回</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row className={less.rowClass1}>
                        <Col span={4} className={less.textRight}>审核意见：</Col>
                        <Col span={20}>
                            <Input id={'remarks'} type={'textarea'} rows={3} maxLength={200} style={{width: '600px'}}></Input>
                        </Col>
                    </Row>
                </Card>

                <Card style={{textAlign: 'center'}} className={less.marginTop10} >
                    <Button className={less.marginRight10} type={'ghost'} onClick={this.closePage} >返回</Button>
                    <Popconfirm title="是否确认提交此审核结果？" onConfirm={this.submitApproval} >
                        <Button type={'primary'} style={{display: approvalStatus ? '' : 'none' }} >提交审核</Button>
                    </Popconfirm>
                </Card>
            </div>
        )
    }
}

export default Form.create()(ContractApprovalDetail);