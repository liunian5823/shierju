import {Button, Card, Col, Row, Table} from "antd";
import {getQueryString} from '@/utils/urlUtils';
import api from '@/framework/axios/index';
import Util from '@/utils/util';


import less from './index.less'
export default class Index extends React.Component{

    _uuids = '';
    state={
        contractInfo: {},   //合同信息
        goodsList: [],      //物料清单
        page: 1,            //
        pageSize: 10,       //
        total: 0,           //总数
        loading: true,      //加载中
    }

    componentWillMount() {
        this._isMounted = true;
        let uuids = getQueryString("uuids");
        console.log('componentWillMount  uuids ------------ ', uuids)
        if (uuids){
            this._uuids = uuids;
            this.queryContractInfo(uuids);
            this.queryContractGoods(uuids);
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //查询合同信息
    queryContractInfo=(uuids)=>{
        //做数据
        /*let data = {
            contractName: '合同名称',
            buyerContractNo: '采方合同编号',
            sellerContractNo: '供方合同编号',
            startTime: Date.now(),
            endTime: Date.now(),
            contractNo: '平台合同编号',
            createCompanyId: 123,
            createUser: '张三',
            createUserTel: '18811320370',
            range: '0',     //0本公司 1本公司及下属公司
            orgNames: '项目部一，项目部二，项目部三',
            buyerCompanyName: '采访公司名',
            sellerCompanyName: '供方公司名',
            buyerBusinessLicense: '采访统一社会信用代码',
            sellerBusinessLicense: '供方统一社会信用代码',
            buyerContacts: '采方联系人',
            sellerContacts: '供方联系人',
            buyerContactsPhone: '采方联系人电话',
            sellerContactsPhone: '供方联系人电话',
            fileName: '合同附件.png',
            filePath: '/group/sssssd.png',
            status: '30'
        };

        this.setState({
            contractInfo: data
        })*/

        api.ajax(
            'GET',
            '@/platform/firsthand/dpContract/getOneDpContract?uuids=' + uuids,
            {}
        ).then(r=>{
            this.setState({
                contractInfo: r.data
            })
        }).catch(r=>{
            console.log('queryContractInfo catch ========== ', r)
        })
    }

    //查询合同商品
    queryContractGoods=(uuids, flag= false)=>{
        if (!uuids)
            uuids = this._uuids;
        let {page, pageSize, goodsList} = this.state;

        api.ajax(
            'GET',
            '@/platform/firsthand/dpContract/getContractGoodList',
            {
                uuids,
                page,
                pageSize
            }
        ).then(r=>{
            if (r.data){
                if (page == 1){
                    this.setState({
                        goodsList: r.data.rows,
                        loading: false,
                        total: r.data.total
                    })
                }else{
                    goodsList.push(r.data.rows);
                    this.setState({
                        goodsList,
                        loading: false,
                        total: r.data.total
                    })
                }
            }
        }).catch(r=>{
            console.log('queryContractGoods catch --------- ', r)
        })
    }

    columns = () => {
        return[
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
    }

    //
    queryMoreGoods=()=>{
        let {loading, page} = this.state;
        if (!loading){
            page = page++;
            this.setState({
                loading: true,
                page: page
            },()=>{
                this.queryContractGoods(this._uuids, true);
            })
        }
    }

    //
    closePage=()=>{
        window.close();
        window.opener.location.reload();
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

    render(){
        let {contractInfo, goodsList, total, loading} = this.state;
        //加载更多是否显示
        let showLoadMany = false;
        if (total > 0 && goodsList && goodsList.length < total)
            showLoadMany = true;
        console.log('render ------------- ', this.state)
        return(
            <div>
                <Card title={'合同基本信息'}>
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
                </Card>

                <Card title={'合同法人主体信息'}>
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
                </Card>

                <Card title={'物料清单'}>
                    <Table
                        dataSource={goodsList}
                        columns={this.columns()}
                        pagination={false}
                        loading={loading}
                    />
                    <div className={showLoadMany ? less.showClass : less.hideClass} >
                        <a onClick={this.queryMoreGoods} >点击加载更多...</a>
                    </div>
                    <div className={!showLoadMany ? less.showClass : less.hideClass}>
                        <span>已经到底了...</span>
                    </div>
                </Card>

                <Card className={less.buttonClass}>
                    <Button style={{marginRight: '10px'}} type={'ghost'} onClick={this.closePage}>关闭</Button>
                </Card>

            </div>
        )
    }
}

