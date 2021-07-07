import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Modal, Select, Input, InputNumber, DatePicker, Switch, Checkbox,
    Radio, Cascader, Button, Icon, Spin, TimePicker, Tooltip, Upload, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
import UploadFile from '@/components/uploadFile';
import UploadImg from '@/components/uploadImg';
import WangEditor from '@/components/gaoda/WangEditor';
import Purchaser from './purchaser';
import LazyAddress from '../components/addressSelector';
import less from './index.less';
import Util from '@/utils/util';
import api from '@/framework/axios';
import * as validatorRules from '@/utils/formCheck';
import { getSearchByHistory } from '@/utils/urlUtils';
import { baseService } from '@/utils/common';
import { closeWin, isNormal, filePathDismant } from '@/utils/dom';
import { configs, systemConfigPath } from '@/utils/config/systemConfig';
import download from "business/isViewDown";
import $ from 'jquery'
import DefaultImg from './img/tjtb.png';
import DefaultPreview from './img/default-preview.png'
import Album from "uxcore-album";



const _icons = {
    save: {
        type: 'question-circle',
        style: {
            color: '#fa0',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
            verticalAlign: '-2px'
        }
    },
    del: {
        type: 'cross-circle',
        style: {
            color: '#F5222D',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
            verticalAlign: '-2px'
        }
    },
}

let productTableBox


//上传图片
const uploadBaseUrl = SystemConfig.configs.uploadUrl;
const imageOrigin = SystemConfig.configs.resourceUrl;
const props = {
    name: 'file',
    action:'/api/common/upload/file',
    accept:'image/png, image/bmp, image/jpg, image/jpeg, image/gif',   //限制图片格式
    showUploadList:false,
};
const { Photo } = Album;
class BidScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_submit: true,
            type: {},
            item_cc: {},
            title_cc: '',
            tip_cc: '',
            visible_cc: false,
            _pageType: null,//页面状态(新增-add，编辑(再次递交)-edit，发布相似-copy)
            defAddress: [],
            spinning: false,
            saleDeptGroup: [],//销售部门
            classifyGroup: [],//竞价分类
            saleTargetGroup: baseService.saleTargetGroup,//
            bondVisible: false,//保证金设置-显示采购商
            privacyVisible: false,//竞价及隐私信息-显示采购商
            explainLen: 0,//补充说明文本长度

            product: [],//竞价产品列表
            classifyCodeList: [],//商品类别-筛选
            goodsCodeSectList: [],//物料编码-筛选
            goodsNameList: [],//物料名称-筛选
            specList: [],//规格-筛选

            enclosureList: [],//上传附件
            goodsFileList: [],//上传商品图片
            onoffFlag:true,//保证金缴纳单选框禁用开关
            onoffValue:"2",
            submitForm: {
                status: null,//状态（保存10   递交21）
                //场次基本信息-start
                title: '',//竞价公告标题
                code: null,//销售单位id
                saleDeptId: null,//销售部门id
                saleDeptName: '',//销售部门
                saleTarget: '4',//销售对象
                createUserName: '',//发布人
                classifyId: '',//竞价分类id
                classifyName: '',//竞价分类
                useArea: [],//应用领域（,隔开）
                contacts: '',//竞价联系人
                contactsTel: '',//竞价联系人电话
                khrqArr: [null, null],
                khStartTime: null,//允许看货期-开始日期
                khEndTime: null,//允许看货期-结束日期
                signEndTime: null,//报名截止日期
                offerStartTime: null,
                offerEndTime: null,
                offerStartDays: 0,//竞价开始日期
                offerEndDays: 0,//竞价截止日期
                extend: true,//结束自动延长
                pricingMethod: 1,
                //场次基本信息-end

                //竞价要求-start
                payWay: ['3'],//1现金、2票据、3无要求（,隔开）
                payTime: 1,//付款时间
                provinceId: '',//省
                provinceName: '',
                cityId: '',//市
                cityName: '',
                countyId: '',//县
                countyName: '',
                khAddress: '',//看货地址
                storageWay: '1',//存储方式
                storageTime: 1,//存储时间
                biddersType: 1,//竞买人企业类型
                biddersTaxFalg:2,//竞买人是否报价税率
                //竞价要求-end

                //竞价产品-start
                goodsList: [],
                //竞价产品-end

                //竞价附件-start
                fileList: [],
                //竞价附件-end

                //补充说明-start
                remark: '',
                //补充说明-end

                //保证金设置-start
                bondType: '1',//保证金缴纳方式（,隔开）1无需缴纳、2线上、3线下
                account: '',//收款账户名
                bondAmt: 0,//保证金金额
                accountNo: '',//保证金收款账户
                openBank: '',//开户行
                bondRemark: '',//来款备注
                bondWhiteList: [],//保证金白名单
                //保证金设置-end

                //竞价及隐私信息-start
                privacySet: '1',//隐私设置
                dealNotice: '1',//成交公告
                openBid: '1',//选择成交公告
                adjustWay: '1',//调价方式
                increRange: 0,//增价幅度
                startPrice: 0,//开盘价格
                isInitPrice: false,//是否设置开盘价格
                basePrice: 0,//成交底价
                minSign: 1,//最低参与企业数
                bidWay: '1',//竞价方式
                signList: [],//隐私白名单
                //竞价及隐私信息-end
            },
            provinceList:[],//省份
            taxRates:[],    //税率
            goodsPic:[],    //保存商品图片
            preview: DefaultPreview,     //保存预览图片的路径
        }
    }

    _uuids = null;
    _type = null;
    _createUserNameDef = false;
    // 25局公司ID
    ju25 = [413, 430, 437, 556, 558, 560, 562, 563, 564, 565, 566, 568, 570, 573, 69504];
    componentWillMount() {
        this.getProvince();
        this.getTaxRate();
    }
    componentWillReceiveProps(nextProps) {
        // 设置默认createUserName
        if (!this._createUserNameDef
            && nextProps.userInfo
            && nextProps.userInfo.username
            && (!this.state.submitForm.createUserName || !this.state.submitForm.contacts)
        ) {
            this._createUserNameDef = true;
            let { submitForm } = this.state;
            submitForm.createUserName = nextProps.userInfo.username;
            submitForm.contacts = nextProps.userInfo.username;
            submitForm.contactsTel = nextProps.userInfo.phone;
            this.setState({
                submitForm
            }, () => {
                this.props.form.setFieldsValue({
                    'createUserName': this.state.submitForm.createUserName,
                    'contacts': this.state.submitForm.createUserName,
                    'contactsTel': this.state.submitForm.contactsTel,
                })
            })

        }
    }

    componentDidMount() {
        this.handleInit()
        this.initEvent()
    }

    initEvent = () => {
        productTableBox = document.querySelector('.productTableBox')
        productTableBox.addEventListener('focusout', e => {
            if ($(e.target).parents('.wlbm').length) {
                let index = $(e.target).parents('tr').index()
                this.searchByGoodsCodeSect(e.target.value, index)
            }
            if ($(e.target).parents('.wlmc').length) {
                let index = $(e.target).parents('tr').index()
                this.searchByGoodsName(e.target.value, index)
            }
        })
    }

    componentWillUnmount() {
        productTableBox.onfocusout = null
    }

    //初始
    handleInit = () => {
        this._uuids = this.props.match.params.uuids;
        const search = this.props.history.location.search;
        if (search) {
            let params = getSearchByHistory(search);
            if (params.type) {
                this._type = params.type;
                this.setState({
                    _pageType: 'copy'
                })
            }
        }
        if (!this._uuids) {
            this.setState({
                _pageType: 'add'
            });
            this.materielAdd();
        } else if (this._uuids && this._type == 'copy') {
            this.setState({
                _pageType: 'copy'
            })
        } else if (this._uuids && !this._type) {
            this.setState({
                _pageType: 'edit'
            })
        }
        if (this._uuids) {
            this.getSceneInfo(this._uuids)
        } else {
            this.fillDefaultValue()
            //插入五张默认空图片对象
            this.addNullPic();
        }
        this.getSaleDeptGroup();
        // this.getSaleTarget();
        this.getClassifyGroup();
    }

    //获取详情信息
    getSceneInfo = (uuids) => {
        this.setState({
            spinning: true
        })
        if (uuids) {
            let url = '@/reuse/saleScene/querySaleSceneInfo';
            //发布相似
            if (this._type == 'copy') {
                url = '@/reuse/saleScene/copy'
            }
            api.ajax('GET', url, {
                uuids
            }).then(res => {
                if (res.data) {
                    //如果当前数据的状态不是待编辑，自动弹窗提示并关闭
                    if (!this._type){
                        //判断当前数据是否能修改
                        if (res.data.status != 10){
                            Util.alert('当前状态的数据不允许修改！');
                            setTimeout(()=>{
                                window.close();
                            }, 2000)
                            return;
                        }
                    }
                    if (res.data.status == 10) {
                        let data = this.handleInitData(res.data);
                        if (data.classifyId) {
                            this.getClassifyCodeList(data.classifyId)
                        }

                        //图片
                        let goodsPic = this.state.goodsPic;
                        if (res.data.goodsFileList) {
                            let goodsImgList = res.data.goodsFileList;
                            let count = 5 - goodsImgList.length;
                            for (let i = 0; i < goodsImgList.length; i++) {
                                let goodsImage = {url: goodsImgList[i].filePath, upload_flag: true};
                                goodsPic.push(goodsImage);
                            }
                            //生成默认的图片
                            if (count > 0) {
                                this.addNullPic(count);
                            }
                        }

                        //如果是发布相似重置 报名截止日期
                        if (this._type == 'copy') {
                            data.signEndTime = null;
                        }
                        this.setState({
                            spinning: false,
                            enclosureList: res.data.fileList,
                            product: (res.data.goodsList || []).map(v => {
                                return {
                                    ...v,
                                    classifyCode: [v.twoClassifyCode, v.classifyCode],
                                    _selfId: v.uuids,
                                    goodsNameList: [],
                                    specList: []
                                }
                            }),
                            explainLen: res.data.remark ? res.data.remark.replace(/<\/?(?!img)[a-z]+?[^>]*>/gi, "").length : 0,
                            submitForm: {
                                ...data
                            },
                            goodsPic: goodsPic
                        }, () => {
                            this.fillDefaultValue(this.state.submitForm)
                        })
                    }
                }
            }, error => {
                this.fillDefaultValue()
                Util.alert(error.msg, {type: 'error'})
            })
        }
    }

    //初始时处理数据
    handleInitData = (obj) => {
        let params = {
            ...this.state.submitForm,
            ...obj
        };
        /**
         * 转字符串-特殊处理
         */
        //销售部门
        if (isNormal(params.saleDeptId)) {
            params.saleDeptId += ''
        }
        //隐私设置
        if (isNormal(params.privacySet)) {
            params.privacySet += ''
        }
        //成交公告
        if (isNormal(params.dealNotice)) {
            params.dealNotice += ''
        }
        //成交公告-发布
        if (isNormal(params.openBid)) {
            params.openBid += ''
        }
        //调价方式
        if (isNormal(params.adjustWay)) {
            params.adjustWay += ''
        }
        //竞价方式
        if (isNormal(params.bidWay)) {
            params.bidWay += ''
        }
        //存储方式
        if (isNormal(params.storageWay)) {
            params.storageWay += ''
        }

        //应用领域
        if (params.useArea) {
            params.useArea = params.useArea.split(',');
        } else {
            params.useArea = []
        }
        //看货日期
        params.khrqArr = [params.khStartTime, params.khEndTime];
        //截止报名日期
        if (params.signEndTime) {
            params.signEndTime = moment(params.signEndTime).format('YYYY-MM-DD HH:mm:ss');
        }
        if (params.offerStartTime) {
            params.offerStartTime = moment(params.offerStartTime).format('YYYY-MM-DD HH:mm:ss');
        }
        if (params.offerEndTime) {
            params.offerEndTime = moment(params.offerEndTime).format('YYYY-MM-DD HH:mm:ss');
        }
        //结束自动延长
        params.extend = params.extend == 1;
        //付款方式
        if (params.payWay) {
            params.payWay = params.payWay.split(',');
        }
        //保证金缴纳方式
        /*if (params.bondType) {
            params.bondType = params.bondType.split(',');
        }*/
        params.bondWhiteList = (params.bondWhiteList || []).map(v => {
            return {
                ...v,
                id: Number(v.buyerCompanyId),
                name: v.buyerCompanyName
            }
        });

        params.signList = (params.signList || []).map(v => {
            return {
                ...v,
                id: Number(v.buyerCompanyId),
                name: v.buyerCompanyName
            }
        });

        //添加竞买人经营地址
        if (params.biddersProvince) {
            params.biddersProvince = params.biddersProvince.split(',');
        } else {
            params.biddersProvince = []
        }

        if (params.goodsFileList){
            params.goodsFileList = params.goodsFileList.map(v=>{
                return {
                    fileName: v.fileName,
                    filePath: v.filePath,
                    fileSuf: v.fileSuf,
                }
            })
        }else {
            params.goodsFileList = []
        }


        return params;
    }

    /**
     * 由于FormItem的label和wrapper没发设置固定值设置比例有不好控制
     * 为了使FormItem 的label里的文字平均分布
     * 这里的labelCol其实是不起作用的，wrapperCol有用
     * /style/index.css里面写了重置样式
     * 设label为block、固定100px(防止label里的文字过长而换行的问题)、文字平均分布
     */
    config = {
        maxExplainLen: 10000,//补充说明最大长度
        size: 'default',//large-default-small
        purchNum: 20,//采购商数量上限
        numConf: {
            min: 0,
            max: 999999999999,
            step: 1,
        },
        priceConf: {
            min: 0,
            max: 999999999999,
            step: 0.001,
        },
        col2: {
            labelCol: {
                span: 2
            },
            wrapperCol: {
                span: 22
            },
        },
        col3: {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 21
            },
        },
        col4: {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
            },
        },
        col6: {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        },
        col7: {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
            },
        },
    }

    //计量单位
    _unitGroup = [
        {
            id: '1',
            value: '件'
        },
        {
            id: '2',
            value: '吨'
        },
        {
            id: '3',
            value: '箱'
        },
        {
            id: '4',
            value: '米'
        },
        {
            id: '5',
            value: '千克'
        }
    ];

    productTpl = () => {
        return {
            classifyCode: '',//三级分类名称
            classifyName: '',//三级分类名称
            twoClassifyCode: '',//二级分类名称
            twoClassifyName: '',//二级分类名称
            goodsCodeSect: '',//物料编码1
            goodsName: '',//物料名称
            spec: '',//规格
            brand: '',//品牌
            desc: '',//物料描述
            num: '',//销售数量
            unit: '',//计量单位
            quality: '',//质量状况
            fileName: null,//附件名称
            filePath: null,//附件地址
            goodsNameList: [],
            specList: []
        }
    }

    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    //无法选择的时间
    filterDisabledDate = (cur) => {
        return cur && cur.getTime() < new Date().getTime();
    }
    filterSignDisabledDate = (cur) => {
        //return cur && cur.getTime() < new Date(new Date(new Date().toLocaleDateString()).getTime());
        return cur && cur.getTime() < new Date(new Date().toLocaleDateString()).getTime();
    }
    filterSignDisabledDateTime = (cur) => {
        if (cur
            && cur.fields[1] == new Date().getFullYear()
            && cur.fields[2] == new Date().getMonth()
            && cur.fields[3] == new Date().getDate()
        ) {
            return {
                disabledHours: () => this.range(0, new Date().getHours()),
                disabledMinutes: (h) => {
                    if (h <= new Date().getHours()) {
                        return this.range(0, new Date().getMinutes())
                    } else {
                        return []
                    }
                },
                disabledSeconds: (h, m) => {
                    if (h <= new Date().getHours() && m <= new Date().getMinutes()) {
                        return this.range(0, new Date().getSeconds())
                    } else {
                        return []
                    }
                },
            }
        } else {
            return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
            }
        }
    }

    //随机数
    random(lower = 1, upper = 10000000) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }

    getOptions = (arr) => {
        let list = arr.map((item, index) => {
            return (
                <Option value={item.id} key={item.id}>{item.value}</Option>
            )
        })
        return list
    }
    getRadios = (arr) => {
        let list = arr.map((item, index) => {
            return (
                <Radio value={item.id} key={item.id}>{item.value}</Radio>
            )
        })
        return list
    }
    //统一处理 普通onChange事件
    valueChange = (el, label, propname = 'value') => {
        const submitForm = this.state.submitForm;
        if (label == 'saleTarget') {
            submitForm.signList = []
        }
        let value = el;
        if (value && value.target) {
            value = el.target[propname]
        }
        this.setState({
            submitForm: {
                ...submitForm,
                [label]: value
            }
        })
    }

    /**************************************************
     * 配置竞价开始/结束时间     add by jiangmin  2020-08-13
     */
    getStartDate = (val) => {
        const submitForm = this.state.submitForm;
        const date = this.props.form.getFieldValue('signEndTime');
        if (!date) {
            this.setState(
                {
                    submitForm: {
                        ...submitForm,
                        offerStartDays: val
                    }
                }
            );
            return;
        }
        const offerStartDateStr = this.getAfterDate(val, new Date(date));
        this.setState(
            {
                submitForm: {
                    ...submitForm,
                    offerStartDays: val,
                    offerStartTime: offerStartDateStr
                }
            }, () => {
                const endDay = this.props.form.getFieldValue('offerEndDays');
                if (endDay || endDay==0) {
                    this.getEndDate(endDay);
                }
            },
        );
    };
    getEndDate = (val) => {
        const submitForm = this.state.submitForm;
        const applyEndDate = this.props.form.getFieldValue('signEndTime');
        const date = this.state.submitForm.offerStartTime;
        if (!applyEndDate) {
            this.setState(
                {
                    submitForm: {
                        ...submitForm,
                        offerEndDays: val
                    }
                }
            );
            return;
        }
        const offerEndDateStr = this.getAfterDate(val, new Date(date));
        this.setState(
            {
                submitForm: {
                    ...submitForm,
                    offerEndDays: val,
                    offerEndTime: offerEndDateStr
                }
            }
        );
    };
    getAfterDate = (day, date) => {
        if(day==0){day = day + ""}
        if (!day || !date) return;
        const date2 = new Date(date);
        let minute = date2.getMinutes();
        if(day==0){
            date2.setDate(date2.getDate());
            minute = minute + 1;
        }else{
            date2.setDate(date2.getDate() + parseInt(day));
        }
        let month = date2.getMonth() + 1;
        let days = date2.getDate();
        let hour = date2.getHours();
       // let minute = date2.getMinutes();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (days >= 0 && days <= 9) {
            days = '0' + days;
        }
        if (hour >= 0 && hour <= 9) {
            hour = '0' + hour;
        }
        if (minute >= 0 && minute <= 9) {
            minute = '0' + minute;
        }
        return (
            date2.getFullYear() + '-' + month + '-' + days + ' ' + hour + ':' + minute
        );
    };
    getApplyEndDate = (date) => {
        const submitForm = this.state.submitForm;
        let startDay = this.props.form.getFieldValue('offerStartDays');
        if(startDay == 0){startDay =startDay+ ""}
        let endDay = this.props.form.getFieldValue('offerEndDays');
        if(endDay == 0){endDay =endDay+ ""}
        if (!startDay || !endDay) {
            return;
        }
        const offerStartDateStr = this.getAfterDate(startDay, date);
        const offerEndDateStr = this.getAfterDate(endDay, offerStartDateStr);
        this.setState({
            submitForm: {
                ...submitForm,
                signEndTime: date,
                offerStartTime: offerStartDateStr,
                offerEndTime: offerEndDateStr
            }
        });
    };


    addressChange = (arr, label) => {
        const submitForm = this.state.submitForm;

        let params = {
            provinceId: arr[0] ? arr[0].value : null,
            provinceName: arr[0] ? arr[0].label : null,
            cityId: arr[1] ? arr[1].value : null,
            cityName: arr[1] ? arr[1].label : null,
            countyId: arr[2] ? arr[2].value : null,
            countyName: arr[2] ? arr[2].label : null,
        }
        this.setState({
            submitForm: {
                ...submitForm,
                ...params
            }
        })
    }
    handleSelect = (label, value, option) => {
        let name = option.props.children;
        let submitForm = this.state.submitForm;
        submitForm[label] = name;

        this.setState({
            submitForm: {
                ...submitForm
            }
        })
        if (label == 'classifyName') {
            this.getClassifyCodeList(value)
        }
    }


    //设置form默认数据
    fillDefaultValue = (data) => {
        let form = JSON.parse(JSON.stringify(data || this.state.submitForm));
        delete form.address;
        this.setState({
            defAddress: [form.provinceId, form.cityId, form.countyId]
        });
        let is25Ju = this.ju25.indexOf(this.props.userInfo.companyId) > -1;
        if (is25Ju) {
            form.minSign = 3;
            form.bidWay = '1';
            this.setState({
                submitForm: {
                    ...form,
                    minSign: 3,
                    bidWay: '1'
                },
            })
        }
        this.props.form.setFieldsValue({
            ...form
        });
    }
    //获取销售部门
    getSaleDeptGroup = function () {
        api.ajax('GET', '@/reuse/organization/queryOrganizationList')
            .then(res => {
                if (res.data) {
                    const saleDeptGroup = (res.data || []).map(v => {
                        return { id: isNormal(v.id) ? (v.id + '') : v.id, value: v.organizationName }
                    })
                    this.setState({
                        saleDeptGroup
                    })
                }
            })
    }
    //获取应用领域
    getSaleTarget = function () {
        api.ajax('GET', '@/platform/ecProfessionalField/getProfessionalFields')
            .then(res => {
                if (res.data) {
                    const saleTargetGroup = (res.data || []).map(v => {
                        return { id: isNormal(v.id) ? (v.id + '') : v.id, value: v.pfName }
                    })
                    this.setState({
                        saleTargetGroup
                    })
                }
            })
    }

    //获取竞价分类
    getClassifyGroup = () => {
        api.ajax('GET', '@/reuse/goods/getGoodsClassLevelOne')
            .then(res => {
                if (res.data) {
                    const classifyGroup = (res.data || []).map(v => {
                        return { id: isNormal(v.id) ? (v.id + '') : v.id, value: v.name }
                    })

                    this.setState({
                        classifyGroup
                    })
                }
            })
    }

    //获取省份信息
    getProvince = () =>{
        api.ajax('GET', '@/reuse/address/getProvinceList').then(res => {
            this.setState({
                provinceList:res.data.data.rows
            })
        })
    }

    //获取税率下拉框数据
    getTaxRate() {
        axios.get('@/inquiry/tax/rate/findAll', {}).then(r => {
            if (r.code == '000000') {
                this.setState({
                    taxRates: r.data
                })
            }
        })
    }

    // 基本信息
    createBaseInfo = () => {
        const { col2, size } = this.config;
        const { getFieldProps } = this.props.form;
        const { userInfo } = this.props;
        const { title, code } = this.state.submitForm;
        const { useAreaGroup,pricingMethodGroup } = baseService;
        const saleTargetGroup = this.state.saleTargetGroup;
        //竞价公告标题字数统计
        const numTotal = (
            <span>{(title && title.length) ? title.length : 0}/150</span>
        )
        return (
            <div className={less.base}>
                <Row>
                    <FormItem label="竞价公告标题" {...col2}>
                        <Input
                            {...getFieldProps('title', {
                                rules: [
                                    { required: true, message: '请输入竞价公告标题' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'title')
                                }
                            })}
                            addonAfter={numTotal}
                            maxLength={150}
                            size={size}
                            placeholder="请在此输入竞价标题 例：XXXX公司xxxx项目关于xxxx的竞价"></Input>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞价编号" {...col2}>
                        <span>{code || '----'}</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="销售单位" {...col2}>
                        <span>{userInfo.companyName}</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="销售部门" {...col2}>
                        <Select
                            className={less.w488}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            {...getFieldProps('saleDeptId', {
                                rules: [
                                    { required: true, message: '请选择销售部门' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'saleDeptId')
                                },
                            })}
                            onSelect={(...prop) => {
                                this.handleSelect('saleDeptName', ...prop)
                            }}
                            size={size}
                            placeholder="请选择销售部门">
                            {this.getOptions(this.state.saleDeptGroup)}
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="销售对象" {...col2}>
                        <Select
                            className={less.w288}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            {...getFieldProps('saleTarget', {
                                rules: [
                                    { required: true, message: '请选择销售对象' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'saleTarget')
                                }
                            })}
                            size={size}
                            placeholder="请选择销售对象">
                            {this.getOptions(saleTargetGroup)}
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="发布人" {...col2}>
                        {this.props.userInfo.username}
                        <Input
                            style={{ display: 'none' }}
                            className={less.w288}
                            {...getFieldProps('createUserName', {
                                rules: [
                                    { required: true, message: '请输入发布人' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'createUserName')
                                }
                            })}
                            size={size}
                            readOnly
                            placeholder="请输入发布人"></Input>
                    </FormItem>
                </Row>
                <Row>
                    <div id="firstClassCodeId">
                        <FormItem label="竞价分类" {...col2}>
                            <Select
                                className={less.w288}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                {...getFieldProps('classifyId', {
                                    rules: [
                                        { required: true, message: '请选择竞价分类' },
                                    ],
                                    onChange: (el) => {
                                        this.valueChange(el, 'classifyId')
                                    }
                                })}
                                onSelect={(...prop) => {
                                    this.handleSelect('classifyName', ...prop)
                                }}
                                size={size}
                                placeholder="请选择竞价分类">
                                {this.getOptions(this.state.classifyGroup)}
                            </Select>
                        </FormItem>
                    </div>
                </Row>
                <Row>
                    <FormItem label="应用领域" {...col2}>
                        <Select
                            className={less.w288}
                            {...getFieldProps('useArea', {
                                rules: [
                                    { required: true, message: '请选择应用领域' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'useArea')
                                }
                            })}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            multiple
                            size={size}
                            placeholder="请选择应用领域">
                            {this.getOptions(useAreaGroup)}
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="竞价联系人" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                            <Input
                                className={less.w288}
                                {...getFieldProps('contacts', {
                                    rules: [
                                        { required: true, message: '请输入竞价联系人' },
                                    ],
                                    onChange: (el) => {
                                        this.valueChange(el, 'contacts')
                                    }
                                })}
                                size={size}
                                maxLength={50}
                                placeholder="请输入联系人姓名" />
                        </FormItem>
                    </Col>
                    <Col span="8" pull={1} style={{ right: " -0.833333%" }}>
                        <FormItem {...col2}>
                            <Input
                                className={less.w188}
                                {...getFieldProps('contactsTel', {
                                    rules: [
                                        { required: true, message: '请输入竞价联系人电话' },
                                        { validator: validatorRules.teleAndMobile },
                                    ],
                                    onChange: (el) => {
                                        this.valueChange(el, 'contactsTel')
                                    }
                                })}
                                size={size}
                                maxLength={30}
                                placeholder="请输入联系人电话" />
                        </FormItem>
                    </Col>
                </Row>
                <Row id="CalendarM">
                    <FormItem label="允许看货期" {...col2} >
                        <RangePicker
                            getCalendarContainer={()=>document.getElementById("CalendarM")}
                            style={{ width: '205px' }}
                            {...getFieldProps('khrqArr', {
                                rules: [
                                    { required: true, message: '请选择允许看货期' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'khrqArr')
                                }
                            })}
                            disabledDate={this.filterDisabledDate}
                            size={size}></RangePicker>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="报名截止日期" {...col2}>
                        <DatePicker
                            style={{ width: '205px' }}
                            {...getFieldProps('signEndTime', {
                                rules: [
                                    { required: true, message: '请选择报名截止日期' },
                                ],
                                onChange: (el) => {
                                    this.getApplyEndDate(el)
                                }
                            })}
                            disabledDate={this.filterSignDisabledDate}
                            // disabledTime={this.filterSignDisabledDateTime}
                            format="YYYY-MM-dd HH:mm"
                            showTime
                            size={size}></DatePicker>
                        <span className={less.tip}>采购商无法在此时间后报名参与竞价，已报名采购商可继续在竞价开始时间前缴纳保证金</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞价开始日期" {...col2}>
                        <span>报名截止后 </span>
                        <InputNumber
                            className={less.w108}
                            {...getFieldProps('offerStartDays', {
                                rules: [
                                    { required: true, message: '请输入竞价开始日期' },
                                ],
                                onChange: (el) => {
                                    this.getStartDate(el)
                                }
                            })}
                            {...this.config.numConf}
                            min={0}
                            max={999}
                            step={1}
                            size={size}></InputNumber>
                        {/* <span> 天开始竞价&nbsp;{this.state.submitForm.signEndTime && `(${moment(new Date(new Date(this.state.submitForm.signEndTime).getTime() + (86400000 * this.state.submitForm.offerStartDays))).format('YYYY-MM-DD')})`} </span> */}
                        <span >
                            天开始竞价&nbsp;&nbsp;(&nbsp;&nbsp;
                            {this.state.submitForm.offerStartTime == undefined ? (
                                '0000-00-00 00:00'
                            ) : (
                                <span>
                              {this.state.submitForm.offerStartTime !== null ? this.state.submitForm.offerStartTime.substring(0, 10) : '0000-00-00'}
                                    <TimePicker
                                        defaultValue="12:00:00"
                                        value={
                                            this.state.submitForm.offerStartTime !== null ?
                                            this.state.submitForm.offerStartTime.substring(11, this.state.submitForm.offerStartTime.length)+':00'
                                             : '12:00:00'
                                        }
                                        onChange={(time, times) => {
                                            const submitForm = this.state.submitForm;
                                            let newtime = this.state.submitForm.offerEndTime !== null ? this.state.submitForm.offerStartTime.substring(0, 10) : '0000-00-00';
                                            newtime += ' ' + times;
                                            this.setState({
                                                submitForm: {
                                                    ...submitForm,
                                                    offerStartTime: newtime
                                                }
                                            });
                                        }}
                                    />
                            </span>
                            )}
                            &nbsp;&nbsp;)
                      </span>
                        <span className={less.tip}>竞价开始时采购未缴纳保证金或销售方未确认保证金到账视为报名无效，无法参与竞价</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞价截止日期" {...col2}>
                        <span>竞价开始后 </span>
                        <InputNumber
                            className={less.w108}
                            {...getFieldProps('offerEndDays', {
                                rules: [
                                    { required: true, message: '请输入竞价截止日期' },
                                ],
                                onChange: (el) => {
                                    this.getEndDate(el)
                                }
                            })}
                            {...this.config.numConf}
                            min={0}
                            step={1}
                            max={999}
                            size={size}></InputNumber>
                        {/* <span> 天竞价截止&nbsp;{this.state.submitForm.signEndTime && `(${moment(new Date(new Date(this.state.submitForm.signEndTime).getTime() + (86400000 * this.state.submitForm.offerStartDays)).getTime() + (this.state.submitForm.offerEndDays * 86400000)).format('YYYY-MM-DD')})`}</span> */}
                        <span >
                            天竞价截止&nbsp;&nbsp;(&nbsp;&nbsp;
                            {this.state.submitForm.offerEndTime == undefined ? (
                                '0000-00-00 00:00'
                            ) : (
                                <span>
                                {/* {this.state.offerEndDateStr.substring(0, 10)} */}
                                {this.state.submitForm.offerEndTime !== null ? this.state.submitForm.offerEndTime.substring(0, 10) : '0000-00-00'}
                                    <TimePicker
                                        defaultValue="12:00:00"
                                        value={
                                            this.state.submitForm.offerEndTime !== null ?
                                            this.state.submitForm.offerEndTime.substring(11, this.state.submitForm.offerEndTime.length) +':00'
                                             : '12:00:00'
                                        }

                                        onChange={(time, times) => {
                                            const submitForm = this.state.submitForm;
                                            let newtime = this.state.submitForm.offerEndTime !== null ? this.state.submitForm.offerEndTime.substring(0, 10) : '0000-00-00';
                                            newtime += ' ' + times;

                                            this.setState({
                                                submitForm: {
                                                    ...submitForm,
                                                    offerEndTime: newtime
                                                }
                                            });
                                        }}
                                    />
                              </span>
                            )}
                            &nbsp;&nbsp;)
                      </span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="处置/计价方式" {...col2}>
                        <RadioGroup
                            {...getFieldProps('pricingMethod', {
                                rules: [
                                    { required: true, message: '请选择处置/计价方式' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'pricingMethod')
                                }
                            })}>
                            {this.getRadios(pricingMethodGroup)}
                            <span className={less.tip}>计重销售的商品建议选择按重量计价，按重量计价将锁定商品的单位以便换算每单位重量的价格</span>
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="结束自动延长" {...col2}>
                        <Switch
                            {...getFieldProps('extend', {
                                valuePropName: 'checked',
                                onChange: (el) => {
                                    this.valueChange(el, 'extend', 'checked')
                                }
                            })}
                            size={size}></Switch>
                        <span className={less.tip}>如果竞价结束前2分钟出价，竞价结束时间会自动延时5分钟</span>
                    </FormItem>
                </Row>
            </div>
        )
    }

    //竞价要求
    createAsk = () => {
        const { col2, col4, col7, size } = this.config;
        const { getFieldProps } = this.props.form;
        const { storageWayGroup,biddersTypeGroup,biddersTaxFlagGroup,biddersTaxGroup,disassembleFlagGroup } = baseService;
        const pwGroup = baseService.payWayGroup.map(v => {
            return { label: v.value, value: v.id }
        });
        const bQGroup = baseService.biddersQualificationGroup.map(v => {
            return { label: v.value, value: v.id }
        });
        const { submitForm, address } = this.state;
        const { biddersTaxFalg } = this.state.submitForm
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <FormItem label="付款方式" {...col4}>
                            <CheckboxGroup
                                {...getFieldProps('payWay', {
                                    rules: [
                                        { required: true, message: '请选择付款方式' },
                                    ],
                                    getValueFromEvent: this.payWayFromEvent,
                                })}
                                options={pwGroup}></CheckboxGroup>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="付款时间" {...col4}>
                            <span>成交后 </span>
                            <InputNumber
                                className={less.w288}
                                {...getFieldProps('payTime', {
                                    rules: [
                                        { required: true, message: '请输入付款时间' },
                                    ],
                                    onChange: (el) => {
                                        this.valueChange(el, 'payTime')
                                    }
                                })}
                                {...this.config.numConf}
                                min={1}
                                max={999999}
                                step={1}
                                size={size}></InputNumber>
                            <span> 日内</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label="货品所在地" {...col2}>
                        <LazyAddress className={less.w288}
                            {...getFieldProps('address', {
                                initialValue: this.state.defAddress,
                                rules: [
                                    { required: true, message: '请选择货品所在地' },
                                ],
                                onChange: (el, arr) => {
                                    this.addressChange(arr, 'address')
                                }
                            })}
                            placeholder="请选择"
                            size={size} />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="看货地址" {...col2}>
                        <Input
                            {...getFieldProps('khAddress', {
                                rules: [
                                    { required: true, message: '请输入看货地址' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'khAddress')
                                }
                            })}
                            size={size}
                            maxLength={150}
                            placeholder="请输入看货地址">
                        </Input>
                    </FormItem>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="存储方式" {...col4}>
                            <Select
                                className={less.w288}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                {...getFieldProps('storageWay', {
                                    rules: [
                                        { required: true, message: '请选择存储方式' },
                                    ],
                                    onChange: (el) => {
                                        this.valueChange(el, 'storageWay')
                                    }
                                })}
                                size={size}
                                placeholder="请选择存储方式">
                                {this.getOptions(storageWayGroup)}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="存储时间" {...col4}>
                            <InputNumber
                                className={less.w288}
                                {...getFieldProps('storageTime', {
                                    rules: [
                                        { required: true, message: '请输入存储时间' },
                                    ],
                                    onChange: (el) => {
                                        this.valueChange(el, 'storageTime')
                                    }
                                })}
                                {...this.config.numConf}
                                min={1}
                                step={1}
                                max={9999999999}
                                size={size}>
                            </InputNumber>
                            <span> 天</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label="提货日期" {...col2}>
                        <DatePicker
                            style={{ width: '205px' }}
                            {...getFieldProps('deliveryTime')}
                            format="yyyy-MM-dd HH:mm:ss"
                            showTime
                            size={size}></DatePicker>
                        <span className={less.tip}>此日期前完成清运（未输入默认不限制）</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞买人企业类型" {...col2}>
                        <RadioGroup
                            {...getFieldProps('biddersType', {
                                rules: [
                                    { required: true, message: '请选择竞买人企业类型' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'biddersType')
                                }
                            })}>
                            {this.getRadios(biddersTypeGroup)}
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞买人注册资本" {...col2}>
                        <InputNumber
                            className={less.w288}
                            {...getFieldProps('biddersRegistered', {
                                    onChange: (el) => {
                                        this.valueChange(el, 'biddersRegistered')
                                    }
                                })
                            }
                            {...this.config.priceConf}
                            min={0}
                            max={9999999999}
                            size={size}>
                        </InputNumber>
                        <span> 万元</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞买人经营地址" {...col2}>
                        <Select
                            className={less.w288}
                            {...getFieldProps('biddersProvince',{
                                onChange: (el) => {
                                    this.valueChange(el, 'biddersProvince')
                                }
                            })}
                            size={size}
                            multiple= {true}
                            filterOption= {false}
                            placeholder="请选择竞买人经营地址">
                            {this.state.provinceList ? this.state.provinceList.map((item, index) => {
                                return (
                                    <Option key={item.provinceCode} value={item.provinceCode}>
                                        {item.provinceName}
                                    </Option>
                                )
                            }) : ""}
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞买人资质许可" {...col2}>
                        <div style={{display:'inline-flex'}}>
                            <CheckboxGroup
                                {...getFieldProps('biddersQualification')}
                                options={bQGroup} />
                            <Input
                                className={less.w108}
                                {...getFieldProps('biddersQualificationOther', {
                                    onChange: (el) => {
                                        this.valueChange(el, 'biddersQualificationOther')
                                    }
                                })}
                                size={size}>
                            </Input>
                        </div>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="竞买人报价税率" {...col2}>
                        <RadioGroup
                            {...getFieldProps('biddersTaxFalg', {
                                rules: [
                                    { required: true, message: '请选择竞买人报价税率' },
                                ],
                                onChange: this.valueChangeBidderFlag
                            })}>
                            {this.getRadios(biddersTaxFlagGroup)}
                        </RadioGroup>
                        {
                            biddersTaxFalg == 2 ?
                                <Select
                                    className={less.w288}
                                    {...getFieldProps('biddersTax', {
                                        rules: [
                                            { required: true, message: '请选择竞买人报价税率' },
                                        ],
                                        onChange: (el) => {
                                            this.valueChange(el, 'biddersTax')
                                        }
                                    })}
                                    size={size}
                                    placeholder="请选择报价税率">
                                    {this.state.taxRates ? this.state.taxRates.map((item, index) => {
                                        return (
                                            <Option key={item.value} value={item.percent}>
                                                {item.percent}%
                                            </Option>
                                        )
                                    }) : ""}
                                </Select>: null
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="拆卸情况" {...col2}>
                        <RadioGroup
                            {...getFieldProps('disassembleFlag', {
                                rules: [
                                    { required: true, message: '请选择拆卸情况' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'disassembleFlag')
                                }
                            })}>
                            {this.getRadios(disassembleFlagGroup)}
                        </RadioGroup>
                    </FormItem>
                </Row>
            </div>
        )
    }
    //付款方式-(校验取值)
    payWayFromEvent = (data) => {
        let prop = data;
        let submitForm = this.state.submitForm;
        const old = submitForm.payWay;

        if (!old) {
            prop = data;
        } else if (prop.length && old.length) {
            if (old.indexOf('3') === -1 && prop.indexOf('3') !== -1) {
                prop = ['3']
            }
            if (prop.indexOf('1') !== -1 || prop.indexOf('2') !== -1) {
                prop = prop.filter(v => {
                    if (v !== '3') {
                        return v
                    }
                })
            }
        } else {
            prop = null
        }

        this.setState({
            submitForm: {
                ...submitForm,
                payWay: prop
            }
        })
        return prop
    }

    //竞价产品
    createProduct = () => {
        const { size } = this.config;
        const { product } = this.state;
        const { getFieldProps } = this.props.form;
        return (
            <div className={less.productTableBox}>
                <table className={["reuse_baseTable", less.productTable].join(' ')}>
                    <thead>
                        <tr>
                            <th width="40px">操作</th>
                            <th width="100px">商品类别</th>
                            <th width="100px">物料编码</th>
                            <th width="100px"><span className={less.required}>物料名称</span></th>
                            <th width="100px"><span className={less.required}>规格</span></th>
                            <th width="100px">品牌</th>
                            <th width="100px">物料描述</th>
                            <th width="100px"><span className={less.required}>销售数量</span></th>
                            <th width="100px"><span className={less.required}>计量单位</span></th>
                            <th width="100px">质量状况</th>
                            <th width="100px">附件</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((tr, index) => {
                            return (
                                <tr key={`product[${tr._selfId}]`}>
                                    <td>
                                        <FormItem>
                                            <Icon className={less.productDel} onClick={(e) => {
                                                this.productDel(e, tr, index)
                                            }} type="minus-circle"></Icon>
                                        </FormItem>
                                    </td>
                                    <td title={tr.classifyName}  >
                                        <FormItem>
                                            <Cascader
                                                {...getFieldProps(`product[${index}].classifyCode`, {
                                                    initialValue: tr.classifyCode,
                                                    // rules: [
                                                    //     { required: true, message: '请选择商品类别'}
                                                    // ],
                                                    onChange: (el) => {
                                                        this.classifyCodeChange(el, index, tr)
                                                    },
                                                 })}
                                                 changeOnSelect
                                                 options={this.state.classifyCodeList}
                                                 size={size}
                                                placeholder="请选择" />
                                         </FormItem>
                                     </td>
                                     <td title={tr.goodsCodeSect}>
                                         <FormItem>
                                             <Select
                                                 className='wlbm'
                                                 combobox
                                                 value={tr.goodsCodeSect}
                                                 onSearch={(el) => {
                                                     this.productSearch(el, index, 'goodsCodeSect')
                                                 }}
                                                 onSelect={(el) => {
                                                     this.productSelect(el, index, 'goodsCodeSect')
                                                 }}
                                                 size={size}
                                                 maxLength={50}>
                                                 {this.getProductOptions(this.state.goodsCodeSectList, 'goodsCode')}
                                             </Select>
                                         </FormItem>
                                     </td>
                                     <td title={tr.goodsName}>
                                         <FormItem>
                                             <Select
                                                 className='wlmc'
                                                 combobox
                                                 {...getFieldProps(`product[${index}].goodsName`, {
                                                     initialValue: tr.goodsName,
                                                     rules: [
                                                         { required: true, message: '请输入物料名称' }
                                                     ]
                                                 })}
                                                 onSearch={(el) => {
                                                     this.productSearch(el, index, 'goodsName')
                                                 }}
                                                 onSelect={(el) => {
                                                     this.productSelect(el, index, 'goodsName')
                                                 }}
                                                 size={size}
                                                 maxLength={200}>
                                                 {this.getProductOptions(product[index].goodsNameList, 'goodsName')}
                                             </Select>
                                         </FormItem>
                                     </td>
                                     <td title={tr.spec}>
                                         <FormItem>
                                             <Select
                                                 combobox
                                                 {...getFieldProps(`product[${index}].spec`, {
                                                     initialValue: tr.spec,
                                                     rules: [
                                                         { required: true, message: '请输入规格' }
                                                     ]
                                                 })}
                                                 onSearch={(el) => {
                                                     this.productSearch(el, index, 'spec')
                                                 }}
                                                 onSelect={(el) => {
                                                     this.productSelect(el, index, 'spec')
                                                 }}
                                                 size={size}
                                                 maxLength={50}>
                                                 {
                                                     product[index].specList.map(ele => <Option value={ele} key={ele}>{ele}</Option>)
                                                 }
                                             </Select>
                                         </FormItem>
                                     </td>
                                     <td title={tr.brand}>
                                         <FormItem>
                                             <Input
                                                 {...getFieldProps(`product[${tr._selfId}].brand`, {
                                                     initialValue: tr.brand,
                                                     rules: [
                                                         { validator: this.productValid }
                                                     ],
                                                     onChange: (el) => {
                                                         this.productChange(el, index, 'brand')
                                                     }
                                                 })}
                                                 size={size}
                                                 maxLength={50}
                                                 placeholder="请输入"></Input>
                                         </FormItem>
                                     </td>
                                     <td title={tr.desc}>
                                         <FormItem>
                                             <Input
                                                 type="textarea"
                                                 {...getFieldProps(`product[${tr._selfId}].desc`, {
                                                     initialValue: tr.desc,
                                                     rules: [
                                                         { validator: this.productValid }
                                                     ],
                                                     onChange: (el) => {
                                                         this.productChange(el, index, 'desc')
                                                     }
                                                 })}
                                                 size={size}
                                                 autosize={{ maxRows: 5 }}
                                                 maxLength={500}
                                                 placeholder="请输入"></Input>
                                         </FormItem>
                                     </td>
                                     <td title={tr.num}>
                                         <FormItem>
                                             <InputNumber
                                                 {...getFieldProps(`product[${tr._selfId}].num`, {
                                                     initialValue: tr.num,
                                                     rules: [
                                                         { validator: this.productValid }
                                                     ],
                                                     onChange: (el) => {
                                                         this.productChange(el, index, 'num')
                                                     }
                                                 })}
                                                 size={size}
                                                 min={0.001}
                                                 max={9999999999999.999}
                                                 step={0.001}
                                                 placeholder="请输入"></InputNumber>
                                         </FormItem>
                                     </td>
                                     <td title={tr.unit}>
                                         <FormItem>
                                             <Select
                                                 {...getFieldProps(`product[${index}].unit`, {
                                                     initialValue: tr.unit,
                                                     rules: [
                                                         { validator: this.productValid }
                                                     ],
                                                     onChange: (el) => {
                                                         this.productChange(el, index, 'unit')
                                                     }
                                                 })}
                                                 combobox
                                                 size={size}
                                                 maxLength={10}>
                                                 {this.getProductOptions(this._unitGroup)}
                                             </Select>
                                         </FormItem>
                                     </td>
                                     <td title={tr.quality}>
                                         <FormItem>
                                             <Input
                                                 {...getFieldProps(`product[${tr._selfId}].quality`, {
                                                     initialValue: tr.quality,
                                                     rules: [
                                                         { validator: this.productValid }
                                                     ],
                                                     onChange: (el) => {
                                                         this.productChange(el, index, 'quality')
                                                     }
                                                 })}
                                                 size={size}
                                                 maxLength={40}
                                                 placeholder="请输入"></Input>
                                         </FormItem>
                                     </td>
                                     <td>
                                         <FormItem>
                                             {
                                                 tr.filePath
                                                     ? <div className={less.product_file}>
                                                         <a className="reuse_link text_line4"
                                                             title={tr.fileName}
                                                             style={{ lineHeight: '14px', width: '80px' }}
                                                             href="javascript:void(0);"
                                                             onClick={() => download(tr.fileName, systemConfigPath.fileDown(tr.filePath))}
                                                         >
                                                             <Icon type="paper-clip" />
                                                             <span>{tr.fileName}</span>
                                                         </a>
                                                         <Icon className={less.close}
                                                             onClick={() => {
                                                                 this.productFileDel(tr, index)
                                                             }}
                                                             type="cross" />
                                                     </div>
                                                     : <UploadFile
                                                         uploadSuccess={(...props) => this.uploadSucFile(...props, tr)}>
                                                         <div className={less.linkBtn}>上传</div>
                                                     </UploadFile>
                                             }
                                         </FormItem>
                                     </td>
                                 </tr>
                             )
                         })}
                     </tbody>
                 </table>
             </div>
         )
     }
     getProductOptions = (arr, key = 'value') => {
         let options = arr.map(v => v[key]);
         return options.map((item, index) => <Option value={item} key={index}>{item}</Option>)
     }
     //获取竞价分类-商品类别
     getClassifyCodeList = (pid) => {
         if (!pid) return;
         api.ajax('GET', '@/reuse/goods/getGoodsClassLevelTwo', {
             pid
         }).then(res => {
             if (res.data) {
                 this.setState({
                     classifyCodeList: res.data || []
                 })
             }
         })
     }
     //按商品类别搜索
     searchByClassifyCode = (id, index) => {
         if (!id) return;
         api.ajax('GET', '@/reuse/goods/queryByLastClassify', {
             classifyCode: id
         }).then(res => {
             if (res.data) {
                 let { product } = this.state;
                 //const { goodsCode, goodsName } = res.data;
                 // if (goodsCode) {
                 //     product[index].goodsCodeSect = goodsCode
                 // }
                 // if (goodsName) {
                 //     product[index].goodsName = goodsName
                 // }
                 product[index].goodsNameList = res.data
                 this.setState({
                     product
                 })
             }
         })
     }
     //按物料编码搜索
     searchByGoodsCodeSect = (id, index) => {
         if (!id || document.activeElement === document.querySelectorAll('.wlbm input.ant-select-search__field')[index]) {
             return
         }
         api.ajax('GET', '@/reuse/goods/queryBySkuCode', {
             skuCode: id
         }).then(res => {
             if (res.data) {
                 let data = res.data || []
                 let { product } = this.state
                 product[index].goodsNameList = data.map(ele => {
                     product[index].brand = ele.brand;
                     product[index].unit = ele.unit;
                     if (!product[index].classifyCode) {
                         product[index].classifyCode= [ele.parentCode, ele.lastClsCode];
                         product[index].classifyName= ele.lastClsName;
                     }
                     this.searchSpecsByGoodsName(ele.goodsName, index);
                     return { goodsName: ele.goodsName };
                 });
                 this.setState({
                     product,
                     //goodsCodeSectList: data
                 })
             }
         })
     }
     //按物料名称搜索
     searchByGoodsName = (id, index) => {
         if (document.activeElement === document.querySelectorAll('.wlmc input.ant-select-search__field')[index]) {
             return
         }
         let { product } = this.state;
         let classifyCodes = product[index].classifyCode;
         if (!id && !classifyCodes) {
             return
         }
         api.ajax('GET', '@/reuse/goods/getSpecsByGoods', {
             name: id
         }).then(res => {
             if (res.data) {
                 product[index].specList = res.data || []
                 this.setState({
                     product
                 })
             }
         });

         api.ajax('GET', '@/reuse/goods/queryByGoodsName', {
             name: id,
             classifyCode: classifyCodes[classifyCodes.length - 1]
         }).then(res => {
             if (res.data) {
                 product[index].goodsNameList = res.data || []
                 this.setState({
                     product
                 })
             }
         })
     }
     //根据物料名称获取规格
     searchSpecsByGoodsName = (id, index) => {
         api.ajax('GET', '@/reuse/goods/getSpecsByGoods', {
             name: id
         }).then(res => {
             if (res.data) {
                 let { product } = this.state
                 product[index].specList = res.data || []
                 product[index].spec = '';
                 this.setState({
                     product
                 })
             }
         })
     }

     classifyCodeClick = (el, index, tr) => {
         alert(el);
     }

     //商品类别-onChange
     classifyCodeChange = (el, index, tr) => {
         const { classifyCodeList } = this.state;
         let product = this.state.product;
         product[index].classifyCode = el;
         let name = null;
         if (el.length) {
             if (el.length == 1) {
                 for (let i = 0; i < classifyCodeList.length; i++) {
                     if (classifyCodeList[i].value == el[0]) {
                         name = classifyCodeList[i].label;
                         break;
                     }
                     if (name) {
                         break;
                     }
                 }
             } else if(el.length == 2) {
                 for (let i = 0; i < classifyCodeList.length; i++) {
                     let child = classifyCodeList[i].children;
                     if (child) {
                         for (let j = 0; j < child.length; j++) {
                             if (child[j].value == el[1]) {
                                 name = child[j].label;
                                 break;
                             }
                         }
                     }
                     if (name) {
                         break;
                     }
                 }
             }
         }
         product[index].classifyName = name;

         this.setState({
             product
         }, () => {
             this.searchByClassifyCode(el[el.length - 1], index)
         })
     }
     //竞价产品-onChange
     productChange = (el, index, label, key = 'value') => {
         let product = this.state.product;
         let value = el;
         if (value && value.target) {
             value = value.target[key]
         }
         product[index][label] = value;

         this.setState({
             product
         })
     }
     //竞价产品-onSearch
     productSearch = (el, index, label) => {
         let product = this.state.product;
         product[index][label] = el;
         let maxLength = {
             'goodsCodeSect': 50,
             'goodsName': 200,
             'spec': 50
         }
         if (el.length > maxLength[label]) {
             product[index][label] = el.substr(0, maxLength[label]);
             this.setState({
                 product
             })
             return
         }
         this.setState({
             product
         })
         if (label == 'goodsCodeSect') {
             clearTimeout(this.searchByGoodsCodeSect.timer)
             this.searchByGoodsCodeSect.timer = setTimeout(() => {
                 this.searchByGoodsCodeSect(el, index)
             }, 300);
         }
         if (label == 'goodsName' && el) {
             this.searchByGoodsName(el, index)
         }
     }
     //竞价产品-onSelect
     productSelect = (el, index, label) => {
         let product = this.state.product;
         const { goodsCodeSectList } = this.state;
         let { goodsNameList } = this.state.product[index]
         if (label == 'goodsCodeSect') {
             /*let curGoodsCodeSectList = goodsCodeSectList.filter(v => {
                 if (v.goodsCode == el) {
                     return v;
                 }
             })
             if (curGoodsCodeSectList[0]) {
                 product[index].goodsCodeSect = curGoodsCodeSectList[0].goodsCode;
                 product[index].goodsName = curGoodsCodeSectList[0].goodsName;
                 product[index].brand = curGoodsCodeSectList[0].brand;
                 product[index].unit = curGoodsCodeSectList[0].unit;
                 if (!product[index].classifyCode) {
                     product[index].classifyCode= [curGoodsCodeSectList[0].parentCode, curGoodsCodeSectList[0].lastClsCode];
                     product[index].classifyName= curGoodsCodeSectList[0].lastClsName;
                 }
             }
             this.searchSpecsByGoodsName(product[index].goodsName, index)
             this.setState({
                 product
             })*/
        } else if (label == 'goodsName') {
            let curGoodsNameList = goodsNameList.filter(v => {
                if (v.goodsName == el) {
                    if (v.classifyList) {
                        v.classifyList.filter(fl => {
                            if(this.state.submitForm.classifyId === fl.ancestorClassifyCode) {
                                product[index].classifyCode= [fl.parentCode, fl.classifyCode];
                                product[index].classifyName= fl.classifyName;
                            }
                        })
                    }
                    return v;
                }
            })
            if (curGoodsNameList[0]) {
                product[index].goodsName = curGoodsNameList[0].goodsName;
            }
            this.searchSpecsByGoodsName(product[index].goodsName, index)
            this.setState({
                product
            })
        } else {
            product[index][label] = el;
            this.setState({
                product
            })
        }
    }
    //删除文件
    productFileDel = (tr, index) => {
        let that = this;

        Util.confirm('删除附件', {
            tip: `确定删除 ${tr.fileName} ?`,
            iconType: 'del',
            onOk() {
                const product = that.state.product;
                product.forEach(v => {
                    if (v._selfId === tr._selfId) {
                        v.filePath = null;
                        v.fileName = null;
                    }
                })
                that.setState({
                    product
                })
            }
        })
    }
    //上传成功
    uploadSucFile = (file, fileList, tr) => {
        const product = this.state.product;
        const obj = filePathDismant(file.response.data);

        product.forEach(v => {
            if (v._selfId === tr._selfId) {
                v.fileName = obj.fileName,
                    v.filePath = obj.filePath
            }
        })

        this.setState({
            product
        })
    }
    //删除产品
    productDel = (e, tr) => {
        let that = this;
        Util.confirm('删除产品', {
            tip: `确定删除 ${tr.goodsName} ?`,
            iconType: 'del',
            onOk() {
                let product = that.state.product.filter(v => {
                    if (tr._selfId !== v._selfId) {
                        return v
                    }
                });
                that.setState({
                    product: []
                }, () => {
                    that.setState({
                        product
                    })
                    Util.alert('删除成功', { type: 'success' })
                })
            }
        })
    }
    //添加物料
    materielAdd = () => {
        // if(!this.state.submitForm.classifyId || !this.state.classifyCodeList.length) {
        //     this.props.toScrollTop({
        //         target: document.querySelector('#firstClassCodeId'),
        //         offsetY: -20
        //     });
        //     Util.alert('请选择竞价分类')
        //     return;
        // }
        let product = this.state.product;
        let productKeys = [];
        if (product && product.length) {
            productKeys = product.map(v => v._selfId)
        }
        let selfId = this.random();
        while (productKeys.indexOf(selfId) !== -1) {
            selfId = this.random();
        }
        product.push({
            _selfId: selfId,
            ...this.productTpl()
        });

        this.setState({
            product
        })
    }
    //竞价产品-验证
    productValid = (rule, value, callback) => {
        const fields = rule.field.split('.')

        if (this.state.is_submit) {
            if (!value) {
                if (fields[1] === 'goodsName') {
                    callback(new Error('请输入名称'))
                } else if (fields[1] === 'spec') {
                    callback(new Error('请输入规格'))
                } else if (fields[1] === 'num') {
                    callback(new Error('请输入数量'))
                } else if (fields[1] === 'unit') {
                    callback(new Error('请输入单位'))
                } else {
                    callback()
                }
            } else {
                if (fields[1] === 'classifyCode' && !value.length) {
                    callback(new Error('请选择商品类别'))
                } else {
                    callback()
                }
            }
        } else {
            callback()
        }
    }

    //竞价附件-上传成功
    enclosureSucFile = (file, fileList) => {
        let enclosureList = this.state.enclosureList;
        enclosureList.push(filePathDismant(file.response.data))
        this.setState({
            enclosureList
        })
    }
    //商品图片-上传成功goodsPicList
    goodsPicListSuc = (fileList) => {
        let newimgarr = []
        fileList.map((el)=>{
            newimgarr = [...newimgarr ,filePathDismant(el)]
        })
        this.setState({
            goodsFileList : newimgarr
        })
    }
    //竞价附件-点击删除
    fileListDel = (item, index) => {
        let that = this;

        Util.confirm('删除附件', {
            tip: `确定删除 ${item.fileName} ?`,
            iconType: 'del',
            onOk() {
                let enclosureList = that.state.enclosureList;
                enclosureList.splice(index, 1)
                that.setState({
                    enclosureList
                })
            }
        })
    }

    //补充说明-change
    editorChange = (html, text) => {
        const { submitForm } = this.state;
        this.setState({
            explainLen:  text.replace(/<\/?(?!img)[a-z]+?[^>]*>/gi,"").length,
            submitForm: {
                ...submitForm,
                remark: html
            }
        })
    }

    //线上线下保证金单选框
    // onoffChange = (e) =>{
    //     this.setState({
    //         onoffValue: e.target.value,
    //     });
    // }

    //保证金设置
    createBond = () => {
        const { col4, size, purchNum } = this.config;
        const { getFieldProps } = this.props.form;
        const { bondType, bondWhiteList } = this.state.submitForm;
        /*const btGroup = baseService.bondTypeGroup.map(v => {
            return { label: v.value, value: v.id, disabled: v.id == '2' }
        })*/
        // const isNeed = bondType && bondType == '1';

        const createWhiteList = () => {
            let list = bondWhiteList.map((item, index) => {
                return (
                    <div key={index} className={less.bond_item}>
                        <div className={less.bond_whitelist}>
                            {item.name}
                            <Icon className={less.bond_del} type="cross-circle"
                                onClick={() => {
                                    this.bondWhiteListDel(item, index)
                                }}></Icon>
                        </div>
                    </div>
                )
            })
            return list
        }
        return (
            <div className={less.bond}>
                <Row>
                    <Col span={12}>
                        <FormItem label="保证金缴纳" {...col4}>
                            {/*<CheckboxGroup
                                {...getFieldProps('bondType', {
                                    rules: [
                                        { required: true, message: '请选择付款方式' },
                                    ],
                                    getValueFromEvent: this.bondTypeFromEvent,
                                })}
                                options={btGroup}></CheckboxGroup>*/}
                            <RadioGroup
                                value={bondType}
                                {...getFieldProps('bondType', {
                                    rules: [
                                        { required: true, message: '请选择付款方式' },
                                    ],
                                    onChange: (value)=>{this.bondTypeFromEvent(value)}
                                })}
                            >
                                <Radio key="1" value={'1'}>无需缴纳保证金</Radio>
                                <Radio key="2" value={'2'}>线上缴纳</Radio>
                                <Radio key="3" value={'3'}>线下缴纳</Radio>
                            </RadioGroup>

                        </FormItem>
                    </Col>
                    <Col span={12}>
                        {
                            this.props.form.getFieldValue('bondType') == '3'
                                ?
                                <FormItem label="收款账户名" {...col4}>
                                    <Input
                                        className={less.w288}
                                        {...getFieldProps('account', {
                                            rules: [
                                                { required: true, message: '请输入保证金收款账户名' },
                                            ],
                                            onChange: (el) => {
                                                this.valueChange(el, 'account')
                                            }
                                        })}
                                        size={size}
                                        maxLength={50}
                                        placeholder="请输入保证金收款账户名"></Input>
                                </FormItem>
                                : null
                        }
                    </Col>
                </Row>
                {
                    (this.props.form.getFieldValue('bondType') == '2' || this.props.form.getFieldValue('bondType') == '3')
                        ?
                        (<Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="保证金金额" {...col4}>
                                        <InputNumber
                                            className={less.w288}
                                            {...getFieldProps('bondAmt', {
                                                rules: [
                                                    { required: true, message: '请输入正整数保证金金额' },
                                                ],
                                                onChange: (el) => {
                                                    this.valueChange(el, 'bondAmt')
                                                }
                                            })}
                                            min={0.01}
                                            max={9999999999.99}
                                            step={0.01}
                                            size={size}
                                            placeholder="请输入正整数保证金金额"></InputNumber>
                                        <span> 元</span>
                                    </FormItem>
                                </Col>
                                {(this.props.form.getFieldValue('bondType') == '3') && <Col span={12}>
                                    <FormItem label="保证金收款账户" {...col4}>
                                        <Input
                                            className={less.w288}
                                            {...getFieldProps('accountNo', {
                                                rules: [
                                                    { required: true, message: '请输入保证金收款账户' },
                                                ],
                                                onChange: (el) => {
                                                    this.valueChange(el, 'accountNo')
                                                }
                                            })}
                                            size={size}
                                            maxLength={30}
                                            placeholder="请输入保证金收款账户"></Input>
                                    </FormItem>
                                </Col>}
                            </Row>
                            <Row>
                                <Col span={11}>
                                    <p>
                                        <span className={less.tip} style={{marginLeft: "0px"}}>保证金：是为了保障双方利益不受伤害，用户在参与竞价采购的时候提前缴纳的一部分费用；</span>
                                    </p>
                                    <br/>
                                    <p>
                                        <span className={less.tip} style={{marginLeft: "0px"}}>线上缴费：转账汇款，通过财务共享中心或其它支付通道向平台指定账号付款;资金账户余额，使用所属单位的资金账户可用余额直接付款；</span>
                                    </p>
                                    <br/>
                                    <p>
                                        <span className={less.tip} style={{marginLeft: "0px"}}>线下缴费，实体支付，通过邮局汇款、银行转账向平台指定账号付款；</span>
                                    </p>
                                    <br/>
                                </Col>
                                {this.props.form.getFieldValue('bondType') == '3' && <Col span={12} offset={1}>
                                    <FormItem label="开户行" {...col4}>
                                        <Input
                                            className={less.w288}
                                            {...getFieldProps('openBank', {
                                                rules: [
                                                    { required: true, message: '请输入保证金账户开户行' },
                                                ],
                                                onChange: (el) => {
                                                    this.valueChange(el, 'openBank')
                                                }
                                            })}
                                            size={size}
                                            maxLength={30}
                                            placeholder="请输入保证金账户开户行"></Input>
                                    </FormItem>
                                    <FormItem label="来款备注" {...col4}>
                                        <Input
                                            type="textarea"
                                            className={less.w288}
                                            {...getFieldProps('bondRemark', {
                                                rules: [
                                                    { required: true, message: '请输入来款备注(自己用途)' },
                                                ],
                                                onChange: (el) => {
                                                    this.valueChange(el, 'bondRemark')
                                                }
                                            })}
                                            size={size}
                                            maxLength={100}
                                            placeholder="请输入来款备注(自己用途)"></Input>
                                    </FormItem>
                                </Col>}
                            </Row>
                            {/* <Row>
                                <Col span={12}></Col>
                                {(this.state.onoffValue == "3") && <Col span={12}>
                                    <FormItem label="来款备注" {...col4}>
                                        <Input
                                            type="textarea"
                                            className={less.w288}
                                            {...getFieldProps('bondRemark', {
                                                rules: [
                                                    { required: true, message: '请输入来款备注(自己用途)' },
                                                ],
                                                onChange: (el) => {
                                                    this.valueChange(el, 'bondRemark')
                                                }
                                            })}
                                            size={size}
                                            maxLength={100}
                                            placeholder="请输入来款备注(自己用途)"></Input>
                                    </FormItem>
                                </Col>}
                            </Row> */}
                        </Row>)
                        : null
                }
                <Row>
                    <div className={less.line}></div>
                    <Col span={2}>
                        <FormItem label="保证金白名单" labelCol={{ span: 24 }} wrapperCol={{ span: 0 }}></FormItem>
                    </Col>
                    <Col span={16}>
                        <div className={less.bond_btn}>
                            <Button type="primary"
                                size={size}
                                disabled={this.props.form.getFieldValue('bondType') == '1'}
                                onClick={this.bondWhiteListAdd}>添加采购商</Button>
                            <span className={less.tip}>最多{purchNum}家</span>
                        </div>
                        {createWhiteList()}
                    </Col>
                </Row>
            </div>
        )
    }
    //保证金缴纳方式
    bondTypeFromEvent = (data) => {
        let bondType = data.target.value;
        // let prop = data;
        /*const old = submitForm.bondType;

        if (!old) {
            prop = data;
        } else if (prop.length && old.length) {
            if (old.indexOf('1') === -1 && prop.indexOf('1') !== -1) {
                prop = ['1']
            }
            if (prop.indexOf('2') !== -1 || prop.indexOf('3') !== -1) {
                prop = prop.filter(v => {
                    if (v !== '1') {
                        return v
                    }
                })
            }
        } else {
            prop = null
        }*/
        let {submitForm} = this.state;
        submitForm.bondType = bondType;
        if (bondType == '1') {
            submitForm.bondWhiteList = []
        }

        this.setState({
            submitForm: {
                ...submitForm,
            }
        })
        // return data
    }
    //保证金设置-添加采购商
    bondWhiteListAdd = () => {
        const { purchNum } = this.config;
        if (this.state.submitForm.bondWhiteList.length < purchNum) {
            this.setState({
                bondVisible: true
            })
        } else {
            Util.alert(`采购商已有 ${purchNum} 个！`)
        }
    }
    //保证金设置-采购商删除
    bondWhiteListDel = (item, index) => {
        let that = this;

        Util.confirm('删除采购商', {
            tip: `确定删除 ${item.name} ?`,
            iconType: 'del',
            onOk() {
                const submitForm = that.state.submitForm;
                let bondWhiteList = submitForm.bondWhiteList;
                bondWhiteList.splice(index, 1);

                that.setState({
                    submitForm: {
                        ...submitForm,
                        bondWhiteList
                    }
                }, () => {
                    Util.alert('删除成功', { type: 'success' })
                })
            }
        })
    }
    //保证金设置-采购商确定
    bondPurchaserOk = (arr) => {
        let submitForm = this.state.submitForm;
        this.setState({
            bondVisible: false,
            submitForm: {
                ...submitForm,
                bondWhiteList: arr || []
            }
        }, () => {
            Util.alert('选择成功', {
                type: 'success'
            })
        })
    }

    //竞价及隐私信息
    createPrivacy = () => {
        const { col2, size, purchNum } = this.config;
        const { getFieldProps } = this.props.form;
        const { adjustWay, dealNotice, bidWay, isInitPrice, signList } = this.state.submitForm;
        const { noticeGroup, privacyGroup, modifyPriceGroup, bidTypeGroup, noticeListGroup } = baseService;

        const createWhiteList = () => {
            let list = (signList || []).map((item, index) => {
                return (
                    <div key={index} className={less.bond_item}>
                        <div className={less.bond_whitelist}>
                            {item.name}
                            <Icon className={less.bond_del} type="cross-circle"
                                onClick={() => {
                                    this.signListDel(item, index)
                                }}></Icon>
                        </div>
                    </div>
                )
            })
            return list
        }
        let { userInfo } = this.props;
        let is25Ju = this.ju25.indexOf(userInfo.companyId) > -1;
        return (
            <div className={less.privacy}>
                <Row>
                    <FormItem label="隐私设置" {...col2}>
                        <RadioGroup
                            {...getFieldProps('privacySet', {
                                rules: [
                                    { required: true, message: '请选择隐私设置' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'privacySet')
                                }
                            })}>
                            {this.getRadios(privacyGroup)}
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="成交公告" {...col2}>
                        <RadioGroup
                            {...getFieldProps('dealNotice', {
                                rules: [
                                    { required: true, message: '请选择成交公告' },
                                ],
                                onChange: this.privacyNoticeChange
                            })}>
                            {this.getRadios(noticeGroup)}
                        </RadioGroup>
                        {
                            dealNotice === '1' ?
                                <FormItem style={{ display: 'inline-block', verticalAlign: 'top' }}>
                                    <Select
                                        className={less.w288}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        {...getFieldProps('openBid', {
                                            rules: [
                                                { required: true, message: '请选择存成交公告' },
                                            ],
                                            onChange: (el) => {
                                                this.valueChange(el, 'openBid')
                                            }
                                        })}
                                        size={size}
                                        placeholder="请选择存成交公告">
                                        {this.getOptions(noticeListGroup)}
                                    </Select>
                                </FormItem> : null
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="调价方式" {...col2}>
                        <RadioGroup
                            {...getFieldProps('adjustWay', {
                                rules: [
                                    { required: true, message: '请选择调价方式' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'adjustWay')
                                }
                            })}>
                            {this.getRadios(modifyPriceGroup)}
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={
                        <span>
                            增价幅度
                            <Tooltip title="基于竞价中的当前最高总价，出价方需增加的幅度或金额。">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    } {...col2}>
                        <InputNumber
                            className={less.w288}
                            {...getFieldProps('increRange', {
                                rules: [
                                    { required: true, message: '请输入增加幅度' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'increRange')
                                }
                            })}
                            min={0.01}
                            max={99999999.99}
                            step={0.01}
                            size={size} />
                        {
                            adjustWay == '1' ? <span>%</span> : <span>元</span>
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={
                        <span>
                            开盘价格
                            <Tooltip title="起拍的所有商品总价，出价方首次出价需大于该价格。">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    } {...col2}>
                        <InputNumber
                            className={less.w288}
                            {...getFieldProps('startPrice', {
                                rules: [
                                    { required: true, message: '请输入开盘价格' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'startPrice')
                                }
                            })}
                            size={size}
                            disabled={isInitPrice}
                            min={0.01}
                            max={999999999999.99}
                            step={0.01}
                            placeholder="请输入开盘价格">
                        </InputNumber>
                        <span> 元</span>
                        <span className={less.privacy_isinitprice}>
                            <Checkbox checked={isInitPrice} onChange={this.isInitPriceChange}>不设置开盘价格</Checkbox>
                        </span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={
                        <span>
                            成交底价
                            <Tooltip title="期望的最低成交总价，竞价结束后总价低于该价格竞价单将自动流标。">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    } {...col2}>
                        <InputNumber
                            className={less.w288}
                            {...getFieldProps('basePrice', {
                                rules: [
                                    { required: true, message: '请输入成交底价' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'basePrice')
                                }
                            })}
                            size={size}
                            min={0.01}
                            max={999999999999.99}
                            step={0.01}
                            placeholder="请输入成交底价">
                        </InputNumber>
                        <span> 元</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={
                        <span>
                            估价参考值
                        </span>
                    } {...col2}>
                        <InputNumber
                            className={less.w288}
                            {...getFieldProps('evaluationPrice', {
                                onChange: (el) => {
                                    this.valueChange(el, 'evaluationPrice')
                                }
                            })}
                            size={size}
                            min={0.01}
                            max={999999999999.99}
                            step={0.01}
                            placeholder="请输入估价参考值">
                        </InputNumber>
                        <span> 元</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem className={less.w115} label="投标人数限制" {...col2}>
                        最少
                        <InputNumber
                            style={{"margin-left": "11px"}}
                            className={less.w250}
                            disabled={is25Ju}
                            {...getFieldProps('minSign', {
                                rules: [
                                    { required: true, message: '请输入投标人数' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'minSign')
                                }
                            })}
                            {...this.config.numConf}
                            size={size}
                            min={is25Ju ? 3 : 1}
                            placeholder="请输入投标人数">
                        </InputNumber>
                        <span>家</span>
                        <span className={less.tip}> 竞价截止后少于参与供应商人数则本次竞价无效</span>
                    </FormItem>
                </Row>
                <div className={less.line}></div>
                <Row>
                    <FormItem label="竞价方式" {...col2}>
                        <RadioGroup
                            disabled={is25Ju}
                            {...getFieldProps('bidWay', {
                                rules: [
                                    { required: true, message: '请选择竞价方式' },
                                ],
                                onChange: (el) => {
                                    this.valueChange(el, 'bidWay')
                                }
                            })}>
                            {this.getRadios(bidTypeGroup)}
                        </RadioGroup>
                    </FormItem>
                </Row>
                {
                    bidWay === '2' ? 
                    <Row className={less.bond}>
                        <Col span={2}>
                            <FormItem label="邀请名单" labelCol={{ span: 24 }} wrapperCol={{ span: 0 }}></FormItem>
                        </Col>
                        <Col span={16}>
                            <div className={less.bond_btn}>
                                <Button type="primary" size={size} onClick={this.signListAdd}>添加采购商</Button>
                                <span className={less.tip}>至少3家,最多{purchNum}家</span>
                            </div>
                            {createWhiteList()}
                        </Col>
                    </Row> : null
                }
            </div>
        )
    }
    //成交公告-change
    privacyNoticeChange = (el) => {
        const { submitForm } = this.state;
        let value = (el && el.target) ? el.target.value : el;

        this.setState({
            submitForm: {
                ...submitForm,
                dealNotice: value
            }
        }, () => {
            this.fillDefaultValue({
                openBid: submitForm.openBid
            })
        })
    }
    //竞买人报价税率
    valueChangeBidderFlag= (el) => {
        let { submitForm } = this.state;
        let value = el.target.value;
        submitForm.biddersTaxFalg = value
        this.setState({
            submitForm
        }, () => {
            this.fillDefaultValue({
                biddersTaxFalg: submitForm.biddersTaxFalg
            })
        })
    }

    //是否设置开盘价格-change
    isInitPriceChange = () => {
        let submitForm = this.state.submitForm;
        this.setState({
            submitForm: {
                ...submitForm,
                startPrice: 0,
                isInitPrice: !submitForm.isInitPrice
            }
        }, () => {
            this.fillDefaultValue({
                startPrice: this.state.submitForm.startPrice
            })
        })
    }
    //竞价及隐私信息-添加采购商
    signListAdd = () => {
        const { purchNum } = this.config;
        if (this.state.submitForm.signList.length < purchNum) {
            this.setState({
                privacyVisible: true
            })
        } else {
            Util.alert(`采购商已有 ${purchNum} 个！`)
        }
    }
    //竞价及隐私信息-采购商删除
    signListDel = (item, index) => {
        let that = this;

        Util.confirm('删除邀请名单', {
            tip: `确定删除 ${item.name} ?`,
            iconType: 'del',
            onOk() {
                const submitForm = that.state.submitForm;
                let signList = submitForm.signList;
                signList.splice(index, 1);

                that.setState({
                    submitForm: {
                        ...submitForm,
                        signList
                    }
                }, () => {
                    Util.alert('删除成功', { type: 'success' })
                })
            }
        })
    }
    //竞价及隐私信息-交易商确定
    privacyPurchaserOk = (arr) => {
        if (arr.length < 3) {
            Util.alert(`最低邀请3家采购商`)
            return;
        }
        let submitForm = this.state.submitForm;
        this.setState({
            privacyVisible: false,
            submitForm: {
                ...submitForm,
                signList: arr || []
            }
        }, () => {
            Util.alert('选择成功', {
                type: 'success'
            })
        })
    }

    //提交时处理数据
    handleParams = (obj) => {
        console.log('handleParams  obj ------------ ', obj)
        const productList = JSON.parse(JSON.stringify(this.state.product));
        let product = productList.map(v => {
            let codes = [...v.classifyCode];
            v.classifyCode = codes[codes.length - 1];
            v.twoClassifyCode = codes[0];
            v = Util.deleteEmptyKey(v);
            v.goodsNameList = [];
            v.specList = [];
            return v;
        })

        //校验商品图片
        let _goodsPic = this.state.goodsPic;
        let _goodsPicArr = [];
        for (let i=0;i<_goodsPic.length;i++){
            if(_goodsPic[i].upload_flag == true){
                _goodsPicArr.push(_goodsPic[i].url);
            }
        }
        if(_goodsPicArr.length == 0){
            $("#photoError").show();
            message.warning("至少上传一张商品图片");
            return;
        }
        let goodsFileList = [];
        //处理下商品图片
        _goodsPicArr.map((el)=>{
            goodsFileList = [...goodsFileList ,filePathDismant(el)]
        })

        let params = {
            ...obj,
            goodsList: JSON.stringify(product),//商品列表
            signList: JSON.stringify(obj.signList),//竞价邀请
            bondWhiteList: JSON.stringify(obj.bondWhiteList),//白名单
            fileList: JSON.stringify(this.state.enclosureList),//竞价附件
            goodsFileList: JSON.stringify(goodsFileList),//商品照片
        };
        //应用领域
        if (params.useArea) {
            params.useArea = params.useArea.join(',');
        }
        //竞买人经营地址
        if (params.biddersProvince) {
            params.biddersProvince = params.biddersProvince.join(',');
        }
        //竞买人资质许可
        if (params.biddersQualification && typeof params.biddersQualification == 'object') {
            params.biddersQualification = params.biddersQualification.join(',');
        }
        //看货日期
        if (params.khrqArr && params.khrqArr.length && params.khrqArr.some(value => !!value)) {
            params.khStartTime = moment(params.khrqArr[0]).format('YYYY-MM-DD');
            params.khEndTime = moment(params.khrqArr[1]).format('YYYY-MM-DD');
        }
        //报名截止日期
        if (params.signEndTime) {
            params.signEndTime = moment(params.signEndTime).format('YYYY-MM-DD HH:mm:ss');
        }
        if (params.offerStartTime) {
            params.offerStartTime = moment(params.offerStartTime).format('YYYY-MM-DD HH:mm:ss');
        }
        if (params.offerEndTime) {
            params.offerEndTime = moment(params.offerEndTime).format('YYYY-MM-DD HH:mm:ss');
        }
        //结束自动延长
        params.extend = params.extend ? 1 : 0;

        //付款方式
        if (params.payWay) {
            params.payWay = params.payWay.join(',');
        }
        //保证金缴纳方式

        if (params.bondType) {
            if (params.bondType == 1) {
                params.account = ''
                params.bondAmt = ''
                params.accountNo = ''
                params.openBank = ''
                params.bondre = ''
            }
            // params.bondType = params.bondType.join(',');
        }
        //删除khrqArr、address
        delete params.khrqArr;
        delete params.address;
        return params
    }
    bidAjax = (data, mode) => {
        const params = {
            ...data
        }
        const uuids = this.props.match.params.uuids;
        let url = '@/reuse/saleScene/insert';
        //编辑
        if (uuids) {
            url = '@/reuse/saleScene/update';
            params.uuids = uuids
        }
        //发布相似
        if (this._type == 'copy') {
            url = '@/reuse/saleScene/insert';
            delete params.uuids
        }

        if (this.uuids_) {
            params.uuids = this.uuids_
        }

        api.ajax('POST', url, params, {
            headers: {  //频道页点进来的不带子平台id
                'Sub-Platform': this._type === 'mall' ? '0' : null
            }
        }).then(res => {
            this.uuids_ = res.data
            this.setState({
                visible_cc: false
            })
            Util.alert(res.msg, { type: 'success' })
            if (mode === 'submit') {
                let forwardUrl = '/desk/saleScene/success?type=' + mode;
                if (this._type === 'mall') {  //频道页点进来的
                    forwardUrl += '&mall=1';
                }
                //TODO
                //this.props.history.push(forwardUrl)
            }
            if (window.opener && window.opener.location.href.endsWith('#/sale/scene')) {
                //关闭当前页面
                window.close();
                //TODO
                window.opener.location.reload();   //刷新父页面
            }
        }).catch(res => {
            Util.alert(res.msg, { type: 'error' })
        })
    }
    //递交
    bidSubmit = () => {
        let that = this;
        this.setState({
            is_submit: true
        }, () => {
            const { userInfo } = this.props;
            if (this.state.submitForm.bidWay == '2' && this.state.submitForm.signList.length < 3) {
                Util.alert('邀请名单至少3家');
                return;
            }
            if (this.state.submitForm.bidWay == '2' && this.state.submitForm.signList.length > 20) {
                Util.alert('邀请名单最多20家');
                return;
            }
            this.props.form.validateFields((errors, values) => {
                if (errors){
                    Util.alert('请填写完整场次信息！');
                    return;
                }
                if (!errors) {
                    if (values.deliveryTime){
                        values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD HH:mm:ss');
                    }
                    if (this.state.explainLen > this.config.maxExplainLen){
                        Util.alert('补充说明文本长度已超出限制长度！')
                        return;
                    }
                    let data = {
                        ...values,
                        ...this.state.submitForm,
                    }
                    let params = that.handleParams(data);
                    params.status = 21;

                    let item_cc = {
                        code: params.code,
                        title: params.title,
                        companyName: params.companyName,
                        saleDeptName: params.saleDeptName,
                    }
                    item_cc.cb = () => {
                        that.bidAjax(params, 'submit')
                    }
                    this.setState({
                        type: _icons.save,
                        item_cc,
                        visible_cc: true,
                        title_cc: '递交场次',
                        tip_cc: '确定递交该场次信息吗？'
                    })
                }
            });
        })
    }
    //保存
    bidSave = () => {
        this.setState({
            is_submit: false
        }, () => {
            if (this.state.explainLen <= this.config.maxExplainLen) {
                let values = this.props.form.getFieldsValue()
                console.log('form values ---------------- ', values)
                if (!!values.deliveryTime){
                    values.deliveryTime = moment(values.deliveryTime).format('YYYY-MM-DD HH:mm:ss');
                }
                let that = this;
                let data = {
                    ...values,
                    ...this.state.submitForm,
                }
                let params = this.handleParams(data);
                params.status = 10;
                //提交
                that.bidAjax(params, 'save')
            } else {
                Util.alert('补充说明文本长度已超出限制长度！')
            }
        })
    }
    //关闭
    bidClose = () => {
        closeWin()
    }

    //批量上传
    tplUploadSucFile = (file) => {
        if (!file.response.data) {
            Util.alert('文件上传失败!', { type: 'error' })
            return;
        }
        api.ajax('GET', '@/reuse/saleScene/getImportContent', {
            url: file.response.data
        }).then(res => {
            if (res.data) {
                Util.alert('导入成功!', { type: 'success' })
                let productKeys = [];
                let product = (res.data || []).map(v => {
                    let selfId = this.random();
                    while (productKeys.indexOf(selfId) !== -1) {
                        selfId = this.random();
                    }
                    productKeys.push(selfId)
                    return {
                        ...v,
                        goodsNameList: [],
                        specList: [],
                        _selfId: selfId
                    }
                });
                this.setState({
                    product: []
                }, () => {
                    this.setState({
                        product
                    })
                })
            }
        }, err => {
            Util.alert(err.msg, { type: 'error' })
        })
    }

    //默认添加五张空图片
    addNullPic=(num)=>{
        let goodsPic = this.state.goodsPic;
        if (num){
            for (let i=0;i<num;i++) {
                let goodsPicObj = {id:"",url:'',upload_flag:false};
                goodsPic.push(goodsPicObj);
            }
        }else{
            for (let i=0;i<5;i++) {
                let goodsPicObj = {id:"",url:'',upload_flag:false};
                goodsPic.push(goodsPicObj);
            }
            this.setState({
                goodsPic
            })
        }
    }


    //图片上传change事件
    uploadPhotoChange=(info)=>{
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
            let uploadImgUrl = info.file.response.data;
            //展示图片
            this.updateGoodsPic(uploadImgUrl);
            message.success(`${info.file.name} 上传成功。`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        }
    }

    //图片上传前检查
    checkGoodsPhoto=(file)=>{
        //检测已上传图片数量
        let goodsImages = this.state.goodsPic;
        let count = 0;
        for (let img of goodsImages){
            if(img.upload_flag == true){
                count++
            }
        }
        if(count == 5){
            Util.alert("商品图片最多上传五张");
            return false;
        }else{
            if (file.size > (1048 * 1048 * 5)) {
                Util.alert('上传的照片不能大于5M，请压缩后上传', { type: "error" })
                return false;
            }
            return true;
        }

    }

    //更新图片的list goodsPic
    updateGoodsPic = (picUrl) =>{
        //隐藏无图片提示
        $("#photoError").hide();
        let goodsPic = this.state.goodsPic;
        for (let i = 0; i < goodsPic.length; i++){
            if(goodsPic[i].upload_flag==false){
                goodsPic[i].url = picUrl;
                goodsPic[i].upload_flag = true;
                break;
            }
        }
        this.setState({
            goodsPic
        })
    }

    //删除当前图片
    deleteGoodsPic =(index)=>{
        //删除当前index对应的对象
        let goodsPic = this.state.goodsPic;
        goodsPic[index].url = '';
        goodsPic[index].upload_flag = false;
        this.setState({
            goodsPic
        })
    }

    //商品图片的预览
    clickImgToPreview=(path, flag)=>{
        if (flag){
            Album.show({
                photos: [
                    <Photo
                        src={path}
                        key={0}
                    />,
                ],
            });
        }
    }

    //商品图片移动
    clickMoveImage=(flag, index)=> {
        let goodsPic = this.state.goodsPic;
        if(goodsPic[index].upload_flag == false)
            return ;
        if (flag == 'left' && index == 0)
            return;
        if (flag == 'right' && index == 5)
            return;
        //右移动，需要判断下一张图片是否是已经上传的图片
        if(flag == 'right' && goodsPic[index+1].upload_flag){
            //调换位置
            let goodsImg = goodsPic[index+1];
            goodsPic[index+1] = goodsPic[index];
            goodsPic[index] = goodsImg;
            this.setState({
                goodsPic
            })
        }
        //左移动
        if(flag == 'left' && goodsPic[index-1].upload_flag){
            //调换位置
            let goodsImg = goodsPic[index-1];
            goodsPic[index-1] = goodsPic[index];
            goodsPic[index] = goodsImg;
            this.setState({
                goodsPic
            })
        }
    }



    render() {
        const { size, maxExplainLen } = this.config;
        const { submitForm, explainLen, bondVisible, privacyVisible, enclosureList, goodsPic} = this.state;
        return (
            <div className={less.scene}>
                <Modal
                    title={this.state.title_cc}
                    visible={this.state.visible_cc}
                    onOk={this.state.item_cc.cb}
                    onCancel={() => { this.setState({ visible_cc: false }) }}
                >
                    <h3 className="mb20" style={{ wordBreak: 'break-all' }}><Icon type={this.state.type.type} style={this.state.type.style} />{this.state.tip_cc}</h3>
                    <div style={{ paddingLeft: '34px' }}>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>竞价场次：<span className='text_top'>{this.state.item_cc.code || '--'}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>场次名称：<span className='text_top'>{this.state.item_cc.title}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>销售单位：<span className='text_top'>{this.props.userInfo.companyName}</span></p>
                        <p style={{ wordBreak: 'break-all', marginBottom: '10px', lineHeight: '14px' }}>销售部门：<span className='text_top'>{this.state.item_cc.saleDeptName}</span></p>
                    </div>
                </Modal>
                <Spin spinning={this.state.spinning}>
                    <Form className="reuse_baseForm no-number-btn">
                        <Card className={less.main_card}
                            title="场次基本信息">
                            <div>{this.createBaseInfo()}</div>
                        </Card>
                        <Card className={less.main_card}
                            title="竞价要求">
                            <div>{this.createAsk()}</div>
                        </Card>
                        <Card className={less.main_card}
                            title="竞价产品"
                            extra={
                                <div className="reuse_baseButtonGroup">
                                    <a target="_block"
                                        href={configs.exportUrl + '/reuse/sceneGoods/exportGoodsTemplate'}
                                        className={less.exportBtn}>批量导入模板.xlxs</a>
                                    <UploadFile
                                        style={{ display: 'inline-block', marginRight: '10px' }}
                                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        disabled={false}
                                        uploadSuccess={this.tplUploadSucFile}>
                                        <Button type="ghost" size={size}>批量上传</Button>
                                    </UploadFile>
                                    <Button type="primary" onClick={this.materielAdd} size={size}>添加产品</Button>
                                </div>
                            }>
                            <div className='productTableBox'>{this.createProduct()}</div>
                            <div className={less.product_materiel}>
                                <div className={less.linkBtn} onClick={this.materielAdd}>
                                    <Icon type="plus"></Icon>
                                    <span> 添加物料 </span>
                                </div>
                            </div>
                        </Card>
                        {/*<Card className={less.main_card}
                            title="商品图片上传"
                            extra={
                                <div className="sceneUploadImg" style={{"font-size":"12px","color":"#8E8E8E"}}><span style={{"color":"red"}}>*</span>最多上传5个格式为jpg、png 单个文件体积小于5MB的图片</div>
                            }>
                                <UploadImg
                                    defaultFileList={defaultGoodsFileList}
                                    boxsize={{"width":"100%","height":"160px","display": "inline-flex","align-items": "center","justify-content": "center"}}
                                    uploadSuccess={this.goodsPicListSuc}
                                    title="上传商品图片"
                                    photoSize="15MB"
                                    custom_hide></UploadImg>
                        </Card>*/}
                        <Card title="商品图片" >
                            <div id="photoError" className={less.diverror}>
                                <span className={less.spanerror}>至少上传一张商品图片</span>
                            </div>
                            <div className={less.fangshi}>
                                <Row>
                                    <Col span={12}>
                                        <div className={less.sctpdianji}>
                                            {goodsPic.map((item, index)=>{
                                                if(item.upload_flag){
                                                    return (
                                                        <div className={less.juzuosc}>
                                                            <div onClick={this.deleteGoodsPic.bind(this, index)} className={less.tpdjgbi}>
                                                                <Icon className={item.upload_flag==true?less["del-pic-true"]:less["del-pic-false"]} type="cross-circle-o" />
                                                            </div>
                                                            <div className={less.zydjdw}>
                                                                <a className={less.zuodian}><Icon type="caret-left" onClick={this.clickMoveImage.bind(this, 'left', index)} /></a>
                                                                <span className={less.tupian}>
                                                            <img src={item.url==''?DefaultImg:imageOrigin+item.url} onClick={this.clickImgToPreview.bind(this, imageOrigin+item.url, item.url==''?false:true)}/>
                                                            </span>
                                                                <Upload {...props}
                                                                    onChange={this.uploadPhotoChange.bind(this)}
                                                                    beforeUpload={this.checkGoodsPhoto.bind()}
                                                                >
                                                                    <Button type="ghost" className={less.shangchuan}>
                                                                        点击上传
                                                                    </Button>
                                                                </Upload>
                                                                <a className={less.youdian}><Icon type="caret-right" onClick={this.clickMoveImage.bind(this, 'right', index)} /></a>
                                                            </div>
                                                        </div>
                                                    )

                                                }else{
                                                    return (
                                                        <div className={less.juzuosc}>
                                                            <div onClick={this.deleteGoodsPic.bind(this, index)} className={less.tpdjgbi}>
                                                                <Icon className={item.upload_flag==true?less["del-pic-true"]:less["del-pic-false"]} type="cross-circle-o" />
                                                            </div>
                                                            <div className={less.zydjdw}>
                                                                <a className={less.zuodian}><Icon type="caret-left" onClick={this.clickMoveImage.bind(this, 'left', index)} /></a>
                                                                <Upload {...props}
                                                                    key={'up'}
                                                                    onChange={this.uploadPhotoChange.bind(this)}
                                                                    beforeUpload={this.checkGoodsPhoto.bind()}
                                                                >
                                                                    <span className={less.tupian}>
                                                                        <img src={item.url==''?DefaultImg:imageOrigin+item.url} onClick={this.clickImgToPreview.bind(this, imageOrigin+item.url, item.url==''?false:true)}/>
                                                                    </span>
                                                                    <Button type="ghost" className={less.shangchuan}>
                                                                        点击上传
                                                                    </Button>
                                                                </Upload>
                                                                <a className={less.youdian}><Icon type="caret-right" onClick={this.clickMoveImage.bind(this, 'right', index)} /></a>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={less.fabutupian}>
                                            <strong>最多可发布5张商品图片，选择递交时，至少上传一张商品图片</strong>
                                            支持.PNG .BMP .JPG .GIF格式上传,建议尺寸500X500以上,文件大小5M内的图片
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                        <Card className={less.main_card}
                            title="竞价附件">
                            <div className={less.product_appendix}>
                                <UploadFile
                                    uploadSuccess={this.enclosureSucFile}
                                    tip
                                    disabled={enclosureList.length >= 5}></UploadFile>
                                <div className={less.files}>
                                    {
                                        enclosureList.map((v, index) => {
                                            return (
                                                <div className={less.fileitem} key={index}>
                                                    <a className="reuse_link"
                                                        style={{ maxWidth: '400px' }}
                                                        href="javascript:void(0);"
                                                        onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath), true)}>
                                                        <Icon type="paper-clip" />
                                                        <span>{v.fileName}</span>
                                                    </a>
                                                    <Icon className={less.close}
                                                        onClick={() => {
                                                            this.fileListDel(v, index)
                                                        }}
                                                        type="cross-circle" />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Card>
                        <Card className={less.main_card}
                            title="补充说明">
                            <div className={less.explain}>
                                <WangEditor uplodImg={true} initHtml={submitForm.remark} maxLength={10000} onChange={this.editorChange}></WangEditor>
                                <div className={less.explain_length}>
                                    {
                                        explainLen > maxExplainLen ?
                                            <span className={less.explain_tip}>(已超出文本限制)</span> : null
                                    }
                                    <span>
                                        {
                                            explainLen > maxExplainLen ?
                                                <span className={less.explain_warning}>{explainLen}</span> : explainLen
                                        }/{maxExplainLen}
                                    </span>
                                </div>
                            </div>
                        </Card>
                        <Card className={less.main_card}
                            title="保证金设置">
                            <div>{this.createBond()}</div>
                        </Card>
                        <Card className={less.main_card}
                            style={{ marginBottom: '80px' }}
                            title="竞价及隐私信息">
                            <div>{this.createPrivacy()}</div>
                        </Card>

                        <div className='fixed_button' style={{ width: '1200px' }}>
                            <Card className={less.main_card}>
                                <div className={["reuse_baseButtonGroup", less.saveBtn].join(' ')}>
                                    <Button onClick={this.bidClose}>关闭</Button>
                                    {
                                        (this.state._pageType === 'edit' && submitForm.status == 22)
                                            ? null
                                            : <Button onClick={this.bidSave}>保存</Button>
                                    }
                                    <Button type="primary" onClick={this.bidSubmit}>递交</Button>
                                </div>
                            </Card>
                        </div>
                    </Form>

                    <Purchaser
                        visible={bondVisible}
                        selectionList={this.state.submitForm.bondWhiteList}
                        onOk={this.bondPurchaserOk}
                        onCancel={() => {
                            this.setState({ bondVisible: false })
                        }}></Purchaser>
                    <Purchaser
                        visible={privacyVisible}
                        selectionList={this.state.submitForm.signList}
                        onOk={this.privacyPurchaserOk}
                        saleTarget={this.state.submitForm.saleTarget}
                        onCancel={() => {
                            this.setState({ privacyVisible: false })
                        }}></Purchaser>
                </Spin>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.authReducer.userInfo || {}
    }
}

export default Form.create()(connect(mapStateToProps)(BidScene))
