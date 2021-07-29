import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Icon,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Radio,
    Row,
    Select,
    Tag,
    Upload
} from "antd";

import api from '@/framework/axios'; //请求接口的封装
import moment from "moment";
import BaseInput from '@/components/baseInput'
import Util from '@/utils/util';
import SelectOrg from './SelectOrg';



import less from './index.less'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class ReleaseContract extends React.Component {
    _isMounted = false;
    state={
        companyLevel: true,                 //公司级别，true-局级，false-处级
        purCompanyList: [],        //采购公司名单
        supCompanyList: [],        //供应公司名单
        orgList:[],                //项目部列表
        selectBuyerCompanyInfo:{},      //选中的采购公司信息
        selectSellerCompanyInfo:{},      //选中的供应公司信息
        selectInputValue: '',            //输入框中的value
        range: '0',             //适用范围
        productList: [
            {key: Date.now()}
        ],                          //物料清单

        modalPurCompanyList: [],    //弹窗内的采购公司名
        modalSelectPurCompany: '',  //弹窗内选中的公司信息
        modalSelectedOrgList: [],          //弹窗确认后选中的项目部
        orgVisible: false,          //项目部弹窗控制


    }

    componentWillMount() {
        this._isMounted = true;
        this.queryPurCompanyList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //


    //采购公司列表
    queryPurCompanyList=()=>{
        /*let data1 = [
            {
                uuids: '123123123',
                name: '采购公司一',
                businessCode: '12311122111123'
            },
            {
                uuids: '2131231',
                name: '采购公司二',
                businessCode: '22221123123111'
            },
            {
                uuids: '323223232',
                name: '采购公司三',
                businessCode: '312312312312312'
            },
            {
                uuids: '42342342',
                name: '采购公司四',
                businessCode: '441231231231231'
            }
        ];
        this.setState({
            purCompanyList: data1
        })*/
        console.log('queryPurCompanyList --------------------- ')
        api.ajax(
            'GET',
            '@/platform/firsthand/dpContract/getBuyerCompanyList',
            {}
        ).then(r=>{
            console.log('queryPurCompanyList then111 ------ ', r)
            if (r.data){
                let companyLevel = false;
                if (r.data.length == 1)       //局级
                    companyLevel = true;
                if (r.data.length > 1)
                    companyLevel = false;
                this.setState({
                    purCompanyList: r.data,
                    companyLevel
                })
            }
        }).catch(r=>{
           /* Util.alert(r.msg, {type: 'error'});
            return ;*/
            console.log('queryPurCompanyList catch ------------- ', r)
        })
    }

    //供应公司列表
    querySupCompanyList=()=>{

        /*let data1 = [
            {
                uuids: '123123123',
                name: '供应公司一',
                businessCode: '444444444444'
            },
            {
                uuids: '2131231',
                name: '供应公司二',
                businessCode: '666666666666'
            },
            {
                uuids: '323223232',
                name: '供应公司三',
                businessCode: '77777777777'
            },
            {
                uuids: '42342342',
                name: '供应公司四',
                businessCode: '88888888888'
            }
        ];
        this.setState({
            supCompanyList: data1
        })*/

        /*api.ajax(
            'GET',
            '@/',
            {}
        ).then(r=>{
            this.setState({
                supCompanyList: r.data
            })
        }).catch(r=>{
            Util.alert(r.msg, {type: 'error'});
            return ;
        })*/
    }

    /**
     * 选择日期大于当前时间
     * @param current
     * @returns {*|boolean}
     */
    disabledDate = (current) => {
        return current && current.getTime() < Date.now();
    }

    /**
     * 合同结束时间校验
     * @param current
     */
    contractEndTimeSelect=(current)=>{
        let contractStartTime = this.props.form.getFieldValue('contractStartTime')
        if(contractStartTime){
            let d1 = moment(current.getTime()).format("YYYY-MM-DD")
            let d2 = moment(contractStartTime).format("YYYY-MM-DD")
            if (current) {
                if (d1 <= d2) {
                    return true;
                }
            }
        }else {
            return current && current.getTime() < Date.now();
        }
    }

    //附加上传
    uploadPropsMultiple = {
        ...ComponentDefine.upload_.uploadLimitSize(10),
        beforeUpload(file) {
            const fileType = ["pdf"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
            if (!fileType.includes(filePix)) {
                message.error('只能上传pdf类型的文件');
                return false
            }
            return true
        },
        onChange: (info) => {
            let fileList = info.fileList;
            /*if (fileList.length >= 6) {
                message.error("最多上传五个附件");
                return;
            }*/
            if (info.file.status === 'done') {
                let isSuccess = false;
                if (info.file.response.code == '000000') {
                    isSuccess = true;
                    info.file.url = SystemConfig.systemConfigPath.dfsPathUrl(info.file.response.data);
                    message.success(`${info.file.name} 上传成功。`);
                } else {
                    if (info.file.response.code == "400002") {
                        message.error(info.file.response.msg);
                    } else {
                        message.error(`${info.file.name} 上传失败。`);
                    }
                }
                if (isSuccess) {
                    fileList = fileList.slice(-1);
                } else {
                    fileList = fileList.slice(0, fileList.length - 1);
                }
            } else if (info.file.status === 'error') {
                if (info.file.response.code == "400002") {
                    message.error(info.file.response.msg);
                } else {
                    message.error(`${info.file.name} 上传失败。`);
                }
            }
            this.props.form.setFieldsValue({contractFile: fileList})
        }
    };

    //适用范围
    radioChange=(e)=>{
        this.setState({
            range: e.target.value
        })
    }

    //物料批量导入的方法
    uploadPropsMultipleProduct = {
        name: 'file',
        action: SystemConfig.systemConfigPath.axiosUrl('/firsthand/dpContract/getXLSXList'),
        showUploadList: false,
        beforeUpload(file) {
            const fileType = ["xlsx"];
            let fileName = file.name;
            let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
            if (!fileType.includes(filePix)) {
                message.error('只能上传xlsx类型的文件');
                return false
            }
            return true
        },
        onChange: (info) => {
            console.log('onChange -------------------------- ', info)
            if (info.file.status === 'done') {
                let isSuccess = false;
                if (info.file.response.code == '200') {
                    let importList = info.file.response.data;
                    if ((importList.length + this.state.productList.length) > 200 ){
                        message.warning('最多200条商品信息,请重新编辑表格再进行导入');
                        return;
                    }else{
                        this.setState({
                            productList: [...this.state.productList, ...importList]
                        })
                    }

                } else {
                    message.error(`${info.file.name} 导入失败。`);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 导入失败。`);
            }
        }
    };

    uploadProductFile = (index) => {
        let obj = {
            ...ComponentDefine.upload_.uploadProps,
            showUploadList: false,
            beforeUpload(file) {
                const fileType = ["pdf", "xlsx", "xls", "docx", "doc", "jpg", "jpeg", "png"];
                let fileName = file.name;
                let filePix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
                //const isJPG = file.type === 'image/jpeg';
                if (!fileType.includes(filePix)) {
                    message.error('只能上传doc、xlsx、pdf、jpg、png类型的文件');
                    return false
                }
                return true
            }

        }
        return obj;
    }


    //添加询单产品
    addProduct = () => {
        let {productList} = this.state;
        if (productList.length >= 200) {
            message.warning('最多200条商品信息');
            return;
        }
        productList.push({key: Date.now()});
        this.setState({
            productList
        })
    }

    //校验参数不为0
    validCount = (rule, value, callback) => {
        if (!value && value != 0) {
            callback()
        }
        if (value <= 0) {
            callback(new Error('请输入大于0的数'))
        }
        if (isNaN(value)) {
            callback(new Error('请输入数字'))
        } else if (value > 99999999.999) {
            callback(new Error('最大值为99999999.999'))
        } else {
            callback()
        }
    }

    //删除询单产品
    removeProduct = (index) => {
        let {productList} = this.state;
        console.log('removeProduct1111111 ----------- ', productList, index)
        productList.splice( productList.findIndex(v => v === productList[index]), 1 );
        console.log('removeProduct2222222 ----------- ', productList, index)

        this.setState({
            productList
        })
    }

    //项目部标签的关闭功能
    tagClose=(uuids)=>{
        let {modalSelectedOrgList} = this.state;
        modalSelectedOrgList = modalSelectedOrgList.filter(key => key.uuids != uuids);
        console.log('tagClose modalSelectedOrgList 0---------------  ', modalSelectedOrgList)
        this.setState({
            modalSelectedOrgList
        })
    }

    //项目部弹窗关闭
    orgCancel=()=>{
        this.setState({
            orgVisible: false
        })
    }

    //项目部确认
    orgOk=(selectedOrgList)=>{
        console.log('项目部确认 ------ ', selectedOrgList)
        this.setState({
            modalSelectedOrgList: selectedOrgList
        })
        this.orgCancel();
    }

    showSelectOrgList=()=>{
        this.setState({
            orgVisible: true
        })
    }

    //
    purCompanyChange=(e)=>{
        let selectBuyerCompanyInfo = {};
        let {purCompanyList} = this.state;
        purCompanyList.map((item, index)=>{
            if (item.companyUuids == e)
                selectBuyerCompanyInfo = item;
        })
        this.setState({
            selectBuyerCompanyInfo
        })
    }

    //
    supCompanyChange=(e)=>{
        console.log('supCompanyChange --------------', e)
        let {supCompanyList} = this.state;
        let selectSellerCompanyInfo = {};
        if (supCompanyList && supCompanyList.length > 0){
            supCompanyList.map((item, index)=>{
                if (item.companyName == e){
                    selectSellerCompanyInfo = item;
                }
            })
        }
        this.setState({
            selectSellerCompanyInfo,
            selectInputValue: e
        })
    }

    //保存数据 type: 1-保存， 2-提交
    saveData=(type)=>{
        if (type == 2){
            this.props.form.validateFields((errors, values) => {
                if (!!errors) {
                    return;
                }
                let {modalSelectedOrgList, selectBuyerCompanyInfo, selectSellerCompanyInfo, productList, range} = this.state;
                let params = {type};
                //选中的项目部信息
                params.contractName = values.contractName;
                params.buyerContractNo = values.buyerContractNo;
                params.sellerContractNo = values.sellerContractNo;
                params.startTime = moment(values.startTime).format('YYYY-MM-DD hh:mm:ss');
                params.endTime = moment(values.endTime).format('YYYY-MM-DD hh:mm:ss');
                params.range = range;

                //选中的项目部
                if (modalSelectedOrgList && modalSelectedOrgList.length > 0){
                    let org_id = modalSelectedOrgList.map((item)=>{
                        return item.id
                    }).join(',')
                    params.orgId = org_id;
                }

                //
                params.buyerCompanyName = selectBuyerCompanyInfo.companyName;
                params.buyerBusinessLicense = selectBuyerCompanyInfo.businessLicense;
                params.buyerCompanyId = selectBuyerCompanyInfo.companyId;
                console.log('selectSellerCompanyInfo ------------ ' , selectSellerCompanyInfo)
                if (!selectSellerCompanyInfo || !selectSellerCompanyInfo.companyName || !selectSellerCompanyInfo.businessLicense || !selectSellerCompanyInfo.companyId){
                    Util.alert('请选择供应商公司名！', {type: 'warning'})
                    return;
                }
                params.sellerCompanyName = selectSellerCompanyInfo.companyName;
                params.sellerBusinessLicense = selectSellerCompanyInfo.businessLicense;
                params.sellerCompanyId = selectSellerCompanyInfo.companyId;
                params.buyerContacts = values.buyerContacts;
                params.sellerContacts = values.sellerContacts;
                params.buyerContactsPhone = values.buyerContactsPhone;
                params.sellerContactsPhone = values.sellerContactsPhone;

                //上传文件
                if (values.contractFile && values.contractFile.length > 0){
                    params.filePath = values.contractFile[0].url;
                    params.fileName = values.contractFile[0].name;
                }

                //物料清单
                let goodsList = [];
                productList.map((item)=>{
                    let obj = {};
                    //
                    let key = item.key;
                    obj.goodsName = values['goodsName_'+key];
                    obj.brand = values['brand_'+key] ? values['brand_'+key] : '';
                    obj.spec = values['spec_'+key];
                    obj.unit = values['unit_'+key] ? values['unit_'+key] : '';
                    obj.amount = values['amount_'+key] ? values['amount_'+key] : 0.00;
                    obj.taxRate = values['taxRate_'+key] ? values['taxRate_'+key] : 0.00;
                    obj.taxAmount = values['taxAmount_'+key] ? values['taxAmount_'+key] : 0.00;
                    obj.totalPrice = values['totalPrice_'+key];
                    goodsList.push(obj)
                })
                // params.productList = JSON.stringify(goodsList);
                params.productList = goodsList;

                console.log('params --------------- ', params)
                api.ajax(
                    'POST',
                    '@/platform/firsthand/dpContract/saveDpContract',
                    {...params}
                ).then(r=>{
                    Util.alert('提交成功！', {type: 'success'})
                    setTimeout(()=>{
                        this.closePage()
                    }, 1000)


                }).catch(r=>{
                    Util.alert(r.msg, {type: 'error'})
                    return;
                })
            })
        }
    }

    //
    closePage=()=>{
        window.close();
        window.opener.location.reload();
    }

    //
    supCompanySubmit=()=> {
        let {selectInputValue} = this.state;
        console.log('supCompanySubmit  111 --------- ', selectInputValue);
        if (!selectInputValue || selectInputValue == '') return;
        api.ajax(
            'GET',
            '@/platform/firsthand/dpContract/getSCompanyList?sComapanyName=' + selectInputValue,
            {}
        ).then(r=>{
            if (r){
                this.setState({
                    supCompanyList: r.data
                })
            }else {
                Util.alert('未查询到该供应商信息，请联系该供应商注册铁建商城或开通直采专区！', {type: 'warning'});
                return;
            }
        }).catch(r=>{
            console.log('supCompanySubmit  catch ---------- ', r)
        })
    }


    render(){

        let {companyLevel, purCompanyList, supCompanyList, modalSelectedOrgList, orgVisible, selectBuyerCompanyInfo, selectSellerCompanyInfo, range, selectSellerCompanyId, selectInputValue} = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16},
        };

        const formItemLayout1 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14},
        };

        const formItemLayout2 = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20},
        };
        const { getFieldProps } = this.props.form;

        return(
            <div>
                <Form>
                    <Card title={'合同基本信息'}>
                        <Row>
                            <Row span={24}>
                                <Col span={24}>
                                    <FormItem
                                        label="合同名称"
                                        {...formItemLayout2}
                                    >
                                        <BaseInput
                                            maxLength={200}
                                            placeholder="请输入合同名称"
                                            {...getFieldProps('contractName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入合同名称'
                                                    },
                                                ],
                                            })}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <FormItem
                                        label="采方合同号"
                                        {...formItemLayout}
                                    >
                                        <BaseInput
                                            maxLength={50}
                                            placeholder="请输入..."
                                            {...getFieldProps('buyerContractNo', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入采方合同号' },
                                                ],
                                            })}
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="供方合同号"
                                        {...formItemLayout}
                                    >
                                        <BaseInput
                                            maxLength={50}
                                            placeholder="请输入..."
                                            {...getFieldProps('sellerContractNo', {})}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <FormItem
                                        label="合同生效日期"
                                        {...formItemLayout}
                                    >
                                        <DatePicker
                                            disabledDate={this.disabledDate}
                                            {...getFieldProps(`startTime`, {
                                                rules: [
                                                    {required: true, message: '请选择合同生效日期'}
                                                ]
                                            })}
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="合同结束日期"
                                        {...formItemLayout}
                                    >
                                        <DatePicker
                                            disabledDate={this.contractEndTimeSelect}
                                            {...getFieldProps(`endTime`, {
                                                rules: [
                                                    {required: true, message: '请选择合同生效日期'}
                                                ]
                                            })}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem
                                    required
                                    label="适用公司范围"
                                    {...formItemLayout2}
                                >
                                    <RadioGroup
                                        value={range}
                                        onChange={this.radioChange}
                                    >
                                        <Radio key="1" value={'0'}>仅适用于本公司及所属项目部</Radio>
                                        <Radio key="2" value={'1'} disabled={companyLevel}>可适用于本公司及下级公司所属项目部</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem
                                    label="合同适用项目部"
                                    {...formItemLayout2}
                                >
                                    {
                                        modalSelectedOrgList && modalSelectedOrgList.length > 0
                                            ?
                                            modalSelectedOrgList.map(
                                                (item, index)=>{
                                                    return (
                                                        <Tag key={item.uuids} closable afterClose={this.tagClose.bind(this, item.uuids)}>{item.organizationName}</Tag>
                                                    )
                                                }
                                            )
                                            :
                                            <a onClick={this.showSelectOrgList} >选择项目部</a>
                                    }

                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'合同法人主体信息'} className={less.marginTop10}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem
                                    label="采方公司名"
                                    {...formItemLayout}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        notFoundContent="无"
                                        {...getFieldProps(`buyerCompanyName`, {
                                            validateTrigger:"onBlur",
                                            onChange: this.purCompanyChange,
                                            rules: [
                                                {required: true, message: '请选择采方公司名'}
                                            ]
                                        })}
                                    >
                                        {
                                            purCompanyList.map(
                                                (item, index) => <Option value={item.companyUuids} key={item.companyUuids}>{item.companyName}</Option>
                                            )
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    required
                                    label="供应公司名"
                                    {...formItemLayout}
                                >
                                    <div className="ant-search-input-wrapper">
                                        <Input.Group>
                                            <Select
                                                combobox
                                                value={selectInputValue}
                                                placeholder={'请输入供应商名称或统一社会信用代码'}
                                                notFoundContent="无结果"
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onChange={this.supCompanyChange}
                                                size={'large'}
                                            >
                                                {
                                                    supCompanyList.map(
                                                        (item, index) => <Option value={item.companyName} key={item.companyUuids}>{item.companyName}</Option>
                                                    )
                                                }
                                            </Select>
                                            <div className="ant-input-group-wrap">
                                                <Button onClick={this.supCompanySubmit}>
                                                    <Icon type="search" />
                                                </Button>
                                            </div>
                                        </Input.Group>
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem
                                    label="采购纳税人识别号"
                                    {...formItemLayout1}
                                >
                                    <p>{selectBuyerCompanyInfo.businessLicense}</p>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="供应纳税人识别号"
                                    {...formItemLayout1}
                                >
                                    <p>{selectSellerCompanyInfo.businessLicense}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem
                                    label="采购联系人"
                                    {...formItemLayout}
                                >
                                    <Input
                                        maxLength={50}
                                        placeholder="请输入..."
                                        {...getFieldProps('buyerContacts', {})}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="供应联系人"
                                    {...formItemLayout}
                                >
                                    <Input
                                        maxLength={50}
                                        placeholder="请输入..."
                                        {...getFieldProps('sellerContacts', {})}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem
                                    label="采购联系人电话"
                                    {...formItemLayout}
                                >
                                    <Input
                                        maxLength={11}
                                        placeholder="请输入..."
                                        {...getFieldProps('buyerContactsPhone', {
                                            rules: [
                                                {
                                                    pattern:  /^[1][0-9]{10}$/,
                                                    message: '请输入正确的手机号'
                                                }
                                            ],
                                        })}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="供应联系人电话"
                                    {...formItemLayout}
                                >
                                    <Input
                                        maxLength={11}
                                        placeholder="请输入..."
                                        {...getFieldProps('sellerContactsPhone', {
                                            rules: [
                                                {
                                                    pattern:  /^[1][0-9]{10}$/,
                                                    message: '请输入正确的手机号'
                                                }
                                            ],
                                        })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem
                                    label="上传文件"
                                    {...formItemLayout2}
                                >
                                    <Upload
                                        {...getFieldProps('contractFile', {
                                            ...ComponentDefine.upload_.uploadForm,
                                        })}
                                        {...this.uploadPropsMultiple}
                                    >
                                        <Button type="ghost">
                                            <Icon type="upload"/> 点击上传
                                        </Button>
                                        <span style={{marginLeft: '10px'}}>仅支持扩展名：.pdf 大小在10M以内</span>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'物料清单'}
                          className={less.marginTop10}
                          extra={
                              <div>
                                  <div style={{float: 'left', display: 'inline', marginRight: '20px', marginTop: '7px'}}>
                                      <a href={SystemConfig.configs.resourceUrl + '/static/直采合同物料清单导入模板.xlsx'} target="_blank"> 下载批量导入物料清单模版.xlsx </a>
                                  </div>
                                  <div style={{float: 'right', display: 'inline'}}>
                                      <Button onClick={this.addProduct} type="primary">添加产品</Button>
                                  </div>
                                  <div  style={{float: 'right', display: 'inline', marginRight: '5px'}}>
                                      <Upload
                                          {...this.uploadPropsMultipleProduct}
                                      >
                                          <Button type="ghost">批量上传</Button>
                                      </Upload>
                                  </div>
                              </div>
                          }
                    >
                        <div >
                            <table cellSpacing="0" cellPadding="0" className="make_main">
                                <thead>
                                <tr>
                                    <th><em style={{color: 'red', marginRight: '2px'}}>*</em>商品名称</th>
                                    <th>品牌</th>
                                    <th><em style={{color: 'red', marginRight: '2px'}}>*</em>型号</th>
                                    <th>单位</th>
                                    <th>成本单价(不含税)</th>
                                    <th>税率</th>
                                    <th>税额(元)</th>
                                    <th><em style={{color: 'red', marginRight: '2px'}}>*</em>价税合计</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody className="inquiry_product_table">
                                {
                                    this.state.productList.map((item, index) => {
                                        return (
                                            <tr key={item.key}>
                                                {/*商品名称*/}
                                                <td>
                                                    <Form.Item {...ComponentDefine.form_.layout}>
                                                        <Input
                                                            maxLength={50}
                                                            style={{width: "90%"}}
                                                            placeholder="请输入商品名称"
                                                            {...getFieldProps(`goodsName_${item.key}`, {
                                                                initialValue: item.goodsName,
                                                                validateTrigger: "onBlur",
                                                                rules: [
                                                                    {required: true, message: '请输入商品名称' },
                                                                ]
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*品牌*/}
                                                <td>
                                                    <Form.Item {...ComponentDefine.form_.layout} >
                                                        <Input
                                                            maxLength={50}
                                                            placeholder="请输入品牌"
                                                            style={{width: "90%"}}
                                                            {...getFieldProps(`brand_${item.key}`, {
                                                                initialValue: item.brand,
                                                                validateTrigger: "onBlur",
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*型号*/}
                                                <td>
                                                    <Form.Item
                                                        {...ComponentDefine.form_.layout}
                                                    >
                                                        <Input
                                                            maxLength={50}
                                                            placeholder="请输入型号"
                                                            style={{width: "90%"}}
                                                            {...getFieldProps(`spec_${item.key}`, {
                                                                initialValue: item.spec,
                                                                validateTrigger: "onBlur",
                                                                rules: [
                                                                    {required: true, message: '请输入型号' },
                                                                ]
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*单位*/}
                                                <td>
                                                    <Form.Item {...ComponentDefine.form_.layout} >
                                                        <Input
                                                            maxLength={10}
                                                            placeholder="请输入单位"
                                                            style={{width: "90%"}}
                                                            {...getFieldProps(`unit_${item.key}`, {
                                                                initialValue: item.unit,
                                                                validateTrigger: "onBlur",
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*成本单价*/}
                                                <td>
                                                    <Form.Item help={""} {...ComponentDefine.form_.layout}>
                                                        <InputNumber
                                                            min={0.01}
                                                            max={99999999.999}
                                                            step={0.01}
                                                            style={{width: "90%"}}
                                                            placeholder="请输入"
                                                            {...getFieldProps(`amount_${item.key}`, {
                                                                initialValue: item.amount,
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*税率*/}
                                                <td>
                                                    <Form.Item help={""} {...ComponentDefine.form_.layout}>
                                                        <InputNumber
                                                            min={0.00}
                                                            max={1.00}
                                                            step={0.01}
                                                            placeholder="请输入"
                                                            style={{width: "90%"}}
                                                            {...getFieldProps(`taxRate_${item.key}`, {
                                                                initialValue: item.taxRate
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*税额*/}
                                                <td>
                                                    <Form.Item help={""} {...ComponentDefine.form_.layout}>
                                                        <InputNumber
                                                            min={0.01}
                                                            max={99999999.999}
                                                            step={0.01}
                                                            style={{width: "90%"}}
                                                            placeholder="请输入"
                                                            {...getFieldProps(`taxAmount_${item.key}`, {
                                                                initialValue: item.taxAmount,
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*价税合计*/}
                                                <td>
                                                    <Form.Item {...ComponentDefine.form_.layout}>
                                                        <InputNumber
                                                            min={0.01}
                                                            max={99999999.999}
                                                            step={0.01}
                                                            style={{width: "90%"}}
                                                            placeholder="请输入"
                                                            {...getFieldProps(`totalPrice_${item.key}`, {
                                                                initialValue: item.totalPrice,
                                                                rules: [
                                                                    {required: true, message: '请输入价税合计' },
                                                                ]
                                                            })}/>
                                                    </Form.Item>
                                                </td>

                                                {/*删除操作*/}
                                                <td className="make_btn_2">
                                                    {this.state.productList.length > 1 ? <a onClick={this.removeProduct.bind(this, index)}><Icon type="cross-circle-o" /></a> : ""}
                                                    <span></span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    <Card style={{textAlign: 'center', marginTop: '10px'}}>
                        {/*<Button style={{marginRight: '10px'}} type={'primary'} onClick={this.saveData.bind(this, 1)}>保存</Button>*/}
                        <Popconfirm title="确认要提交吗？" onConfirm={this.saveData.bind(this, 2)} >
                            <Button style={{marginRight: '10px'}} type={'primary'}>提交</Button>
                        </Popconfirm>
                        <Button type={'ghost'}>返回</Button>
                    </Card>
                </Form>

                {/*选择项目部*/}
                <SelectOrg selectedOrgList={modalSelectedOrgList} range={range} companyList={purCompanyList} visible={orgVisible} ok={this.orgOk} close={this.orgCancel}/>
            </div>

        )
    }
}

export default Form.create()(ReleaseContract);