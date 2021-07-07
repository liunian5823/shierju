import React from 'react';
import Util from '@/utils/util';
import api from '@/framework/axios';
import UploadItem from '../../components/upload';
import successSvg from '@/static/svg/success.svg';
import WangEditor from '@/components/gaoda/WangEditor';
import less from '@/pages/desk/publishSD/mixins/index.less';
import LazyAddress from '../../components/addressSelector';
import UploadFile from '@/components/uploadFile';
import { getSearchByHistory } from '@/utils/urlUtils';
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Alert,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Cascader,
    Icon,
    Modal
} from 'antd';

import { closeWin, filePathDismant } from '@/utils/dom';
import { phone, required } from "@/utils/validator";
import { viewImg } from "@/utils/urlUtils";
import { baseService } from '@/utils/common';
import { systemConfigPath } from '@/utils/config/systemConfig';
import download from "business/isViewDown";
import * as validatorRules from '@/utils/formCheck';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
let newSubmitDate = data => {
    // 基本信息
    let defaultData = {
        type: 1, // 类型
        noticeName: '', // 公告名称
        publishCompanyId: '',
        publishCompanyName: '',
        publishProjectId: '',//项目部id
        publishProjectName: '', //项目部名称
        creatStartDate: '-', //发布日期
        target: '', //销售/采购对象
        categoryId: '', //品类ID
        categoryName: '', // 品类名称
        useArea: '', // 应用领域
        provinceId: '', //省ID
        provinceName: '', //省名称
        cityId: '', //市ID
        cityName: '', //市名称
        countyId: '', //区ID
        countyName: '', //区名称
        goodsAddr: '', // 详细地址
        storageWay: '', // 存储方式
        otherStorageWay: '', // 其他存储方式
        storageTime: '', // 存储时长
        damage: '', // 折损程度
        effectiveDate: '', // 有效期
        isForever: 0, // 是否永久
        contacts: '', // 联系人
        contactsTel: '', // 联系方式
    };
    if (data) {
        let keys = Object.keys(defaultData);
        let newData = {}, i;
        for (i in data) {
            if (keys.indexOf(i) >= 0) {
                newData[i] = data[i]
            }
        }
        return newData
    } else {
        return defaultData
    }
};
// 物资信息
let newGoods = data => {
    // 物资信息
    let goods = {
        classifyCode: '',
        classifyName: '',
        twoClassifyCode: '',
        twoClassifyName: '',
        goodsCodeHand: '', //物料编码1
        goodsCodeSect: '', //物料编码2
        goodsName: '', // 物料名称
        spec: '', // 规格
        brand: '', //品牌
        desc: '', // 物资详情
        price: '', // 价格
        original: '', // 原价值
        stockNum: '', // 存量
        unit: '', // 单位
        isFace: 0, // 电议
        isBigNum: 0, // 电议
        goodsFileList: []
    };
    if (data) {
        let keys = Object.keys(goods);
        let newData = {}, i;
        if (data[0]) {
            for (i in data[0]) {
                if (keys.indexOf(i) >= 0) {
                    newData[i] = data[0][i]
                }
            }
        }
        return newData
    } else {
        return goods
    }
};
let wlbm,wlmc

class PublishSD extends React.Component {
    constructor(props) {
        super(props);
        let type = props.location.pathname.indexOf('/desk/supply/buy/add') > -1 ? 2 : 1;
        let submitForm = newSubmitDate();
        submitForm.contacts = '';
        submitForm.contactsTel = '';
        let goods = newGoods();
        this.state = {
            goodsCodeSectList: [],
            goodsNameList: [],
            specList: [],
            // 反馈
            result: null,
            // 驳回状态信息
            statusOBJ: null,
            //物资详情文本长度
            // materialLen: goods.desc.length,
            materialLen: goods.desc.replace(/<\/?(?!img)[a-z]+?[^>]*>/gi,"").length,
            // 商品图片
            photosList: [
                { id: '1', filePath: null },
                { id: '2', filePath: null },
                { id: '3', filePath: null },
                { id: '4', filePath: null },
                { id: '5', filePath: null }
            ],
            //主图路劲
            imgMainPath: null,
            // 附件
            fileList: [],
            // 物资信息
            goods,
            // 供求单基本信息
            submitForm: {
                ...submitForm, type
            },
            // 默认地址
            defAddress: [],
            // 分类
            defClass: [],
            // 发布项目部
            publishProjectOption: [],
            // 分类树
            classify_group: []
        }
    }

    // init-onload
    componentDidMount() {
        this.initialization();
        this.initEvents()
        const search = this.props.history.location.search;
        if (search) {
            let params = getSearchByHistory(search);
            if (params.type) {
                this._type = params.type;
            }
        }
    }
    initEvents = () => {
        wlbm = document.querySelector('.wlbm input.ant-select-search__field');
        wlbm.onblur = (e) => {
            this.searchByGoodsCodeSect(e.target.value)
        };

        wlmc = document.querySelector('.wlmc input.ant-select-search__field');
        wlmc.onblur = (e) => {
            this.searchByGoodsName(e.target.value)
        };
    }

    componentWillUnmount() {
        wlbm.onblur = null
    }


    // init-function * Promise
    initialization = async () => {
        const uuids = this.props.match.params.uuids;
        await api.ajax('GET', '@/reuse/organization/queryOrganizationList').then(({ data }) => {
            let publishProjectOption = data.map(v => {
                return {
                    id: v.id,
                    value: v.organizationName
                }
            });
            this.setState({
                publishProjectOption
            })
        });
        await api.ajax('GET', '@/reuse/goods/getGoodsClassLevelOne').then(({ data }) => {
            let classify_group = data.map(value => {
                return {
                    label: value.name,
                    value: value.id,
                    isLeaf: false,
                    loading: false
                }
            });
            this.setState({
                classify_group
            })
        });
        if (uuids) {
            let url = ''
            if (this._type == 'repub') {
                url = '@/reuse/supplyDemand/copy'
            }
            await api.ajax('GET', url || this.infoUrl, {
                uuids
            }).then(res => {
                let { classify_group } = this.state;
                if (res.data) {
                    let statusOBJ = {
                        status: res.data.status,
                        statusStr: res.data.statusStr,
                        approvalOpinion: res.data.approvalOpinion,
                    }
                    if (this.props.location.pathname.indexOf('add') > -1) {
                        delete res.data.effectiveDate
                    }
                    let submitForm = newSubmitDate(res.data);
                    let goods = newGoods(res.data.goodsList);
                    let fileList = res.data.fileList;
                    if (goods.goodsFileList && Array.isArray(goods.goodsFileList) && goods.goodsFileList.length) {
                        this.handleImgItem(goods.goodsFileList[0]);
                    }
                    let defAddress = [submitForm.provinceId, submitForm.cityId, submitForm.countyId];
                    let defClass = [+submitForm.categoryId, +goods.twoClassifyCode, +goods.classifyCode];
                    let se = classify_group.filter(v => +v.value === +submitForm.categoryId);
                    this.classLoadData(se);
                    // this.setState({ submitForm, goods, materialLen: goods.desc.length, fileList, defAddress, defClass, statusOBJ })


                    //思路：获取纯文字 在获取img 相加就可以了
                    //1.获取img标签
                    var re = /<img[^>]+>/g;
                    var ImgA = goods.desc.match(/<img[^>]+>/g);
                    let imgLen;
                    if(ImgA){
                        imgLen = ImgA.length
                      }
                      if(!ImgA){
                        imgLen = 0
                      }
                    //2.去掉除img以外的所有标签；
                    let  descLength = goods.desc.replace(/<\/?(?!img)[a-z]+?[^>]*>/gi,"");
                    let mainLength = imgLen + descLength.length;
                    this.setState({ submitForm, goods, materialLen: descLength.length, fileList, defAddress, defClass, statusOBJ })
                }
            })
        } else {
            this.setState({
                submitForm: {
                    ...this.state.submitForm,
                    contacts: this.props.userInfo.username,
                    contactsTel: this.props.userInfo.phone,
                }
            })
        }
    };
    config = {
        materialMaxLen: 10000,//物资详情长度
        min: 1,//正整数的最小值
        size: 'default',//large-default-small
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
    };
    //消息类型
    xxlxGroup = [
        { id: 1, value: '供应信息' },
        { id: 2, value: '求购信息' }
    ];
    //销售采购对象
    xscgdxGroup = baseService.saleTargetGroup;
    //应用领域
    yylyGroup = baseService.useAreaGroup;
    //单位
    dwGroup = [
        { id: '件', value: '件' },
        { id: '吨', value: '吨' },
        { id: '箱', value: '箱' },
        { id: '米', value: '米' },
        { id: '千克', value: '千克' },
    ];
    //存放方式
    cffsGroup = baseService.storageWayGroup;

    //随机数
    random(lower = 1, upper = 10000000) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }

    getOptions = (arr, value = 'id', label = 'value') => {
        let list = arr.map((item) => {
            return (
                <Option value={item[value]} key={item[value]}>{item[label]}</Option>
            )
        });
        return list
    };
    getRadios = (arr, value = 'id', label = 'value') => {
        let list = arr.map((item) => {
            return (
                <Radio value={item[value]} key={item[value]}>{item[label]}</Radio>
            )
        });
        return list
    };
    //统一处理 普通onChange事件
    infoValueChange = (el, label, propname = 'value') => {
        const submitForm = this.state.submitForm;
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
    };
    //统一处理 普通onChange事件
    goodsValueChange = (el, label, propname = 'value') => {
        const goods = this.state.goods;
        let value = el;
        if (value && value.target) {
            value = el.target[propname]
        }

        this.setState({
            goods: {
                ...goods,
                [label]: value
            }
        })
    };

    getProductOptions = (arr, key = 'value') => {
        let options = arr.map(v => v[key]);
        return options.map((item, index) => <Option value={item} key={index}>{item}</Option>)
    }
    // 供求基本信息

    sceneBaseInfo = () => {
        const { col2, size } = this.config;
        const { getFieldProps } = this.props.form;
        const { noticeName, publishCompanyName, creatStartDate } = this.state.submitForm;
        let { submitForm } = this.state;
        //竞价公告标题字数统计
        const numTotal = (<span>{(!!noticeName && noticeName.length) ? noticeName.length : 0}/200</span>);

        const yylyGroup = this.yylyGroup.map(v => {
            return { label: v.value, value: v.id }
        });

        const closeEffectiveDate = (el) => {
            if (el.target['checked']) {
                this.props.form.setFieldsValue({
                    effectiveDate: ''
                });
                this.setState({
                    submitForm: {
                        ...this.state.submitForm,
                        effectiveDate: ''
                    }
                })
            }
        };
        return (
            <div className={less.base}>
                <Row>
                    <FormItem label="消息类型" {...col2} style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <RadioGroup
                            {...getFieldProps('type', {
                                rules: [
                                    { required: true, message: '请选择消息类型' },
                                ],
                                initialValue: submitForm.type,
                                onChange: (el) => {
                                    this.infoValueChange(el, 'type',)
                                }
                            })}
                            size={size}>
                            {
                                this.xxlxGroup.map(item => {
                                    return <Radio style={{
                                        position: 'relative',
                                        width: 190,
                                        height: 45,
                                        display: 'inline-block'
                                    }} value={item.id}
                                        key={item.id}>
                                        <div
                                            className={this.state.submitForm.type === item.id ? less.radioActive : less.radioItem}>
                                            {item.value}
                                        </div>
                                    </Radio>;
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="公告名称" {...col2}>
                        <Input {
                            ...getFieldProps('noticeName', {
                                initialValue: submitForm.noticeName,
                                rules: [required('请输入公告名称')], onChange: (el) => {
                                    this.infoValueChange(el, 'noticeName')
                                }
                            })
                        }
                            addonAfter={numTotal}
                            maxLength={200}
                            size={size}
                            placeholder="请输入公告名称" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="发布单位" {...col2}>
                        <span>{this.props.userInfo.companyName}</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="发布项目部" {...col2}>
                        <Select
                            className={less.w488}
                            {...getFieldProps('publishProjectId', {
                                initialValue: submitForm.publishProjectId,
                                rules: [
                                    required('请选择发布项目部')
                                ],
                                placeholder: "请选择发布项目部",
                                onChange: (el) => {
                                    this.infoValueChange(el, 'publishProjectId')
                                }
                            })}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            style={{ width: '688px' }}
                            size={size}
                            placeholder="请选择发布项目部"
                        >
                            {this.getOptions(this.state.publishProjectOption)}
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={submitForm.type === 1 ? "销售对象" : "采购对象"} {...col2}>
                        <RadioGroup
                            {...getFieldProps('target', {
                                initialValue: submitForm.target,
                                rules: [
                                    { required: true, message: '请选择' },
                                ],
                                onChange: (el) => {
                                    this.infoValueChange(el, 'target')
                                }
                            })}
                            size={size}>
                            {this.getRadios(this.xscgdxGroup)}
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="应用领域" {...col2}>
                        <CheckboxGroup
                            options={yylyGroup}
                            {...getFieldProps('useArea', {
                                initialValue: submitForm.useArea,
                                rules: [
                                    { required: true, message: '请选择应用领域' },
                                ],
                                onChange: (el) => {
                                    this.infoValueChange(el, 'useArea')
                                }
                            })}
                            size={size}>
                        </CheckboxGroup>
                    </FormItem>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="联系人" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                            <Input
                                className={less.w288}
                                {...getFieldProps('contacts', {
                                    initialValue: submitForm.contacts,
                                    rules: [
                                        { required: true, message: '请输入联系人' },
                                    ],
                                    onChange: (el) => {
                                        this.infoValueChange(el, 'contacts')
                                    }
                                })}
                                size={size}
                                maxLength={50}
                                placeholder="请输入联系人" />
                        </FormItem>
                    </Col>
                    <Col span="8" pull={1} style={{ right: " -0.833333%" }}>
                        <FormItem {...col2}>
                            <Input
                                className={less.w188}
                                {...getFieldProps('contactsTel', {
                                    initialValue: submitForm.contactsTel,
                                    rules: [
                                        { required: true, message: '请输入联系电话' },
                                        { validator: validatorRules.teleAndMobile },
                                    ],
                                    onChange: (el) => {
                                        this.infoValueChange(el, 'contactsTel')
                                    }
                                })}
                                size={size}
                                maxLength={30}
                                placeholder="请输入联系电话" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label="信息有效期" {...col2}>
                        {submitForm.isForever == 1 ? <DatePicker className={less.w288}
                            disabled
                            {...getFieldProps('effectiveDate', {
                                initialValue: submitForm.effectiveDate,
                                onChange: (el) => {
                                    this.infoValueChange(el, 'effectiveDate')
                                }
                            })}
                            disabledDate={this.filterEffectveDate}
                            size={size}
                            getCalendarContainer={triggerNode => triggerNode.parentNode}>
                        </DatePicker> : <DatePicker className={less.w288}
                            disabled={submitForm.isForever}
                            {...getFieldProps('effectiveDate', {
                                initialValue: submitForm.effectiveDate,
                                rules: [
                                    { required: true, message: '请选择信息有效期' },
                                ],
                                onChange: (el) => {
                                    this.infoValueChange(el, 'effectiveDate')
                                }
                            })}
                            disabledDate={this.filterEffectveDate}
                            size={size}>
                            </DatePicker>}
                        <span className="ml10">
                            <Checkbox checked={submitForm.isForever} onChange={(el) => {
                                closeEffectiveDate(el);
                                this.infoValueChange(el, 'isForever', 'checked')
                            }}>长期有效</Checkbox>
                        </span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="发布日期" {...col2}>
                        <span>{creatStartDate}</span>
                    </FormItem>
                </Row>
            </div>
        )
    };

    filterEffectveDate = (cur) => {
        return cur && cur.time < new Date();
    };

    classLoadData = (selectedOptions) => {
        if (selectedOptions.length >= 3) return;
        let isCity = selectedOptions.length == 1;
        if (!isCity) return;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        api.ajax("GET", '@/reuse/goods/getGoodsClassLevelTwo', { pid: targetOption.value })
            .then(({ data }) => {
                let children = data.map(value => {
                    let valueChildren = value.children.map(ir => {
                        return {
                            label: ir.label,
                            value: +ir.value,
                        }
                    });
                    return {
                        value: +value.id,
                        label: value.label,
                        children: valueChildren
                    }
                });
                targetOption.loading = false;
                targetOption.children = children;
                this.setState({
                    classify_group: [...this.state.classify_group],
                });
            })

    };

    //按商品类别搜索
    searchByClassifyCode = (id) => {
        if (!id) return;
        api.ajax('GET', '@/reuse/goods/queryByLastClassify', {
            classifyCode: id
        }).then(res => {
            if (res.data) {
                this.setState({
                    goodsNameList: res.data || []
                })
            }
        })
    }

    onPopupVisibleChange = (val) => {
        if (!val) {
            if (!this.state.goods.classifyCode) {
                document.querySelector('.gqsplb').querySelector('.ant-cascader-picker-label').textContent = ''
            }
        }
    }

    classValueChange = (options) => {
        const submitForm = this.state.submitForm;
        const goods = this.state.goods;
        if (options.length && options.length > 1) {
            this.searchByClassifyCode(options[options.length - 1])
            let [category, twoClassify, classify] = options;
            let { classify_group } = this.state;
            let { label: categoryName, children: categoryChildren } = classify_group.find(v => v.value === category);
            let classifyName;
            if (options.length === 2) {
                classifyName = categoryChildren.find(v => v.value === twoClassify).label;
                classify = twoClassify;
            }
            if (options.length === 3) {
                let { children: twoClassifyChildren} = categoryChildren.find(v => v.value === twoClassify);
                classifyName = twoClassifyChildren.find(v => v.value === classify).label;
            }
            //let { children: twoClassifyChildren, label: classifyName} = categoryChildren.find(v => v.value === twoClassify);
           //let { label: classifyName } = twoClassifyChildren.find(v => v.value === classify);
            this.setState({
                submitForm: {
                    ...submitForm,
                    categoryId: category,
                    categoryName
                },
                goods: {
                    ...goods,
                    classifyCode: classify,
                    classifyName
                }
            });
        } else {
            this.setState({
                submitForm: {
                    ...submitForm,
                    categoryId: null,
                    categoryName: null
                },
                goods: {
                    ...goods,
                    classifyCode: null,
                    classifyName: null
                }
            });
        }

    };

    get allAmt() {
        return (this.state.goods.stockNum && this.state.goods.price) ? (this.state.goods.price * this.state.goods.stockNum).toFixed(2) : 0;
    }

    //竞价产品-onSearch
    productSearch = (el, label) => {
        let goods = this.state.goods
        this.setState({
            goods: {
                ...goods,
                [label]: el
            }
        })
        if (label == 'goodsCodeHand') {
            // clearTimeout(this.searchByGoodsCodeSect.timer)
            // this.searchByGoodsCodeSect.timer = setTimeout(() => {
            //     this.searchByGoodsCodeSect(el)
            // }, 300);
            this.searchByGoodsCodeSect(el)
        }
        if (label == 'goodsName' && el) {
            this.searchByGoodsName(el)
        }
    }

    //按物料编码搜索
    searchByGoodsCodeSect = (id) => {
        if (!id || document.activeElement === wlbm) {
            return
        }
        api.ajax('GET', '@/reuse/goods/queryBySkuCode', {
            skuCode: id
        }).then(res => {
            if (res.data) {
                let data = res.data || []
                let goodsNameList = data.map(ele => {
                    return { goodsName: ele.goodsName }
                })
                this.setState({
                    goodsNameList,
                    goodsCodeSectList: data
                })
            }
        })
    }

    //按物料名称搜索
    searchByGoodsName = (id) => {
        if (document.activeElement === wlmc) {
            return;
        }
        if (!id && !this.state.goods.classifyCode) {
            return;
        }
        api.ajax('GET', '@/reuse/goods/getSpecsByGoods', {
            name: id
        }).then(res => {
            if (res.data) {
                this.setState({
                    specList: res.data || []
                })
            }
        });

        api.ajax('GET', '@/reuse/goods/queryByGoodsName', {
            name: id,
            classifyCode: this.state.goods.classifyCode
        }).then(res => {
            if (res.data) {
                this.setState({
                    goodsNameList: res.data || []
                })
            }
        })
    }
    //竞价产品-onSelect
    productSelect = (el, label) => {
        const { goodsCodeSectList, goodsNameList, goods } = this.state;
        if (label == 'goodsCodeHand') {
            let curGoodsCodeSectList = goodsCodeSectList.filter(v => {
                if (v.goodsCode == el) {
                    return v;
                }
            })
            if (curGoodsCodeSectList[0]) {
                let { classify_group } = this.state;
                goods.goodsCodeHand = curGoodsCodeSectList[0].goodsCode;
                goods.goodsName = curGoodsCodeSectList[0].goodsName;
                goods.brand = curGoodsCodeSectList[0].brand;
                goods.unit = curGoodsCodeSectList[0].unit;
                this.state.submitForm.categoryId= curGoodsCodeSectList[0].primaryClsCode;
                let se = classify_group.filter(v => +v.value === +curGoodsCodeSectList[0].primaryClsCode);
                this.classLoadData(se);
                let defClass = [+curGoodsCodeSectList[0].primaryClsCode, +curGoodsCodeSectList[0].parentCode, +curGoodsCodeSectList[0].lastClsCode];
                this.setState({  defClass })
                goods.classifyCode = curGoodsCodeSectList[0].lastClsCode;
                goods.classifyName = curGoodsCodeSectList[0].lastClsName;
            }
            this.searchSpecsByGoodsName(goods.goodsName)
            this.setState({
                goods
            })
        } else if (label == 'goodsName') {
            let curGoodsNameList = goodsNameList.filter(v => {
                if (v.goodsName == el) {
                    return v;
                }
            })
            if (curGoodsNameList[0]) {
                goods.goodsName = curGoodsNameList[0].goodsName;
                //goods.goodsCodeHand = curGoodsNameList[0].goodsCode;
            }
            this.searchSpecsByGoodsName(goods.goodsName)
            this.setState({
                goods
            })
        } else {
            goods[label] = el;
            this.setState({
                goods
            })
        }
    }

    //根据物料名称获取规格
    searchSpecsByGoodsName = (id) => {
        api.ajax('GET', '@/reuse/goods/getSpecsByGoods', {
            name: id
        }).then(res => {
            if (res.data) {
                let { goods } = this.state
                goods.spec = '';
                this.setState({
                    goods,
                    specList: res.data || []
                })
            }
        })
    }

    //物资基本信息
    materialBaseInfo = () => {
        const { col2, size, min } = this.config,
            { getFieldProps } = this.props.form,
            { submitForm, goods, classify_group, defClass } = this.state;

        const closePrice = (el) => {
            if (el.target['checked']) {
                this.props.form.setFieldsValue({
                    price: '',
                });
                this.setState({
                    goods: {
                        ...goods,
                        price: ''
                    }
                })
            }
        };

        const closeStockNum = (el) => {
            if (el.target['checked']) {
                this.props.form.setFieldsValue({
                    stockNum: '',
                    unit: '',
                });
                this.setState({
                    goods: {
                        ...goods,
                        stockNum: '',
                        unit: '',
                    }
                })
            }
        };
        let { storageWay } = submitForm;
        return (
            <div className="no-number-btn">
                <Row>
                    <FormItem label="品类" {...col2}>
                        <Cascader
                            className={['gqsplb', less.w288].join(' ')}
                            placeholder="请选择品类"
                            options={classify_group}
                            {...getFieldProps('categoryId', {
                                rules: [
                                    { required: true, message: '请选择品类' },
                                ],
                                initialValue: defClass,
                                onChange: (el) => {
                                    this.classValueChange(el)
                                },
                            })}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            loadData={this.classLoadData}
                            changeOnSelect
                            onPopupVisibleChange={this.onPopupVisibleChange}
                        />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="物料名称" {...col2}
                    >
                        {/* <Input
                            {...getFieldProps('goodsName', {
                                initialValue: goods.goodsName,
                                rules: [
                                    { required: true, message: '请输入物料名称' },
                                ],
                                onChange: (el) => {
                                    this.goodsValueChange(el, 'goodsName')
                                }
                            })}
                            size={size}
                            maxLength={200}
                            addonAfter={<span>{`${goods.goodsName ? goods.goodsName.length : 0}/200`}</span>}
                            placeholder="请输入物料名称">
                        </Input> */}
                        <Select
                            style={{ width: '288px' }}
                            className='wlmc'
                            combobox
                            {...getFieldProps(`goodsName`, {
                                initialValue: goods.goodsName,
                                rules: [
                                    { required: true, message: '请输入物料名称' }
                                ]
                            })}
                            onSearch={(el) => {
                                this.productSearch(el, 'goodsName')
                            }}
                            onSelect={(el) => {
                                this.productSelect(el, 'goodsName')
                            }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            size={size}
                            maxLength={200}>
                            {this.getProductOptions(this.state.goodsNameList, 'goodsName')}
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="物料编码" {...col2}>
                        <Select
                            style={{ width: '288px' }}
                            className='wlbm'
                            combobox
                            value={goods.goodsCodeHand}
                            onSearch={(el) => {
                                this.productSearch(el, 'goodsCodeHand')
                            }}
                            onSelect={(el) => {
                                this.productSelect(el, 'goodsCodeHand')
                            }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            size={size}
                            maxLength={50}>
                            {this.getProductOptions(this.state.goodsCodeSectList, 'goodsCode')}
                        </Select>
                        <span className={less.tip}>请输入您所属企业业务或财务系统中，为该物资定义的物料编码。如多个建议分开发布。</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="规格型号" {...col2}>
                        {/* <Input
                            className={less.w288}
                            {...getFieldProps('spec', {
                                initialValue: goods.spec,
                                rules: [
                                    { required: true, message: '请输入规格型号' },
                                ],
                                onChange: (el) => {
                                    this.goodsValueChange(el, 'spec')
                                }
                            })}
                            size={size}
                            maxLength={50}
                            placeholder="请输入规格型号">
                        </Input> */}
                        <Select
                            style={{ width: '288px' }}
                            combobox
                            {...getFieldProps(`spec`, {
                                initialValue: goods.spec,
                                rules: [
                                    { required: true, message: '请输入规格' }
                                ]
                            })}
                            onSearch={(el) => {
                                this.productSearch(el, 'spec')
                            }}
                            onSelect={(el) => {
                                this.productSelect(el, 'spec')
                            }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            size={size}
                            maxLength={50}>
                            {
                                this.state.specList.map(ele => <Option value={ele} key={ele}>{ele}</Option>)
                            }
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="品牌" {...col2}>
                        <Input
                            className={less.w288}
                            {...getFieldProps('brand', {
                                initialValue: goods.brand,
                                rules: [
                                    { required: true, message: '请输入品牌' },
                                ],
                                onChange: (el) => {
                                    this.goodsValueChange(el, 'brand')
                                }
                            })}
                            size={size}
                            maxLength={50}
                            placeholder="请输入品牌">
                        </Input>
                    </FormItem>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label={submitForm.type === 1 ? "存量及单位" : "求购数量及单位"} labelCol={{ span: 6 }}
                            wrapperCol={{ span: 12 }}>
                            <InputNumber
                                className={less.w288}
                                disabled={goods.isBigNum}
                                {...getFieldProps('stockNum', {
                                    initialValue: goods.stockNum,
                                    disabled: goods.isBigNum,
                                    rules: [
                                        {
                                            required: !goods.isBigNum,
                                            message: `${submitForm.type === 1 ? "请输入存量" : '请输入求购数量'}`
                                        },
                                    ],
                                    onChange: (el) => {
                                        this.goodsValueChange(el, 'stockNum')
                                    }
                                })}
                                size={size}
                                min={0.001}
                                max={9999999999999.999}
                                step={0.001}
                                placeholder={submitForm.type === 1 ? "请输入存量" : '请输入求购数量'} />
                        </FormItem>
                    </Col>
                    <Col span="10" pull={1} style={{ right: " -0.833333%" }}>
                        <FormItem {...col2}>
                            <Select
                                disabled={goods.isBigNum}
                                combobox
                                className={less.w188}
                                {...getFieldProps('unit', {
                                    initialValue: goods.unit,
                                    rules: [
                                        { required: !goods.isBigNum, message: '请输入或选择单位' },
                                    ],
                                    onChange: (el) => {
                                        this.goodsValueChange(el, 'unit')
                                    }
                                })}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                size={size}
                                maxLength={10}
                                placeholder="请输入或选择单位">
                                {this.getOptions(this.dwGroup)}
                            </Select>
                            <span className="ml10">
                                <Checkbox checked={goods.isBigNum} onChange={(el) => {
                                    closeStockNum(el);
                                    this.goodsValueChange(el, 'isBigNum', 'checked')
                                }}>电议</Checkbox>
                            </span>
                        </FormItem>
                    </Col>
                </Row>
                {
                    submitForm.type !== 2 && <Row>
                        <FormItem label="原价值" {...col2}>
                            <InputNumber
                                className={less.w288}
                                {...getFieldProps('original', {
                                    initialValue: goods.original,
                                    onChange: (el) => {
                                        this.goodsValueChange(el, 'original')
                                    }
                                })}
                                size={size}
                                min={min}
                                max={9999999999999.999}
                                step={0.001}
                                placeholder="请输入原价值">
                            </InputNumber>
                            <span> 元</span>
                            <span className={less.tip}>采购该批次物资时的原始价格。</span>
                        </FormItem>
                    </Row>
                }
                <Row>
                    <FormItem label="单价" {...col2}>
                        <InputNumber
                            disabled={goods.isFace}
                            className={less.w288}
                            {...getFieldProps('price', {
                                initialValue: goods.price,
                                rules: [
                                    { required: !this.state.goods.isFace, message: '请输入单价' },
                                ],
                                onChange: (el) => {
                                    this.goodsValueChange(el, 'price')
                                }
                            })}
                            size={size}
                            min={0.001}
                            max={9999999999999.999}
                            step={0.001}
                            placeholder="请输入单价">
                        </InputNumber>
                        <span> 元</span>
                        <span className="ml10">
                            <Checkbox checked={goods.isFace} onChange={(el) => {
                                closePrice(el);
                                this.goodsValueChange(el, 'isFace', 'checked')
                            }}>电议</Checkbox>
                        </span>
                        <span className={less.tip}>现{submitForm.type == 1 ? '销售总价' : '采购总价'}：{goods.isFace ? 0 : this.allAmt}元</span>
                    </FormItem>
                </Row>
                {
                    submitForm.type !== 2 && <Row>
                        <FormItem label="存放时长" {...col2}>
                            <InputNumber
                                className={less.w288}
                                {...getFieldProps('storageTime', {
                                    initialValue: submitForm.storageTime,
                                    rules: [
                                        { required: true, message: '请输入存放时长' },
                                    ],
                                    onChange: (el) => {
                                        this.infoValueChange(el, 'storageTime')
                                    }
                                })}
                                size={size}
                                min={min}
                                max={999999999}
                                step={0}
                                placeholder="请输入存放时长">
                            </InputNumber>
                            <span> 天</span>
                        </FormItem>
                    </Row>
                }
                {
                    submitForm.type !== 2 && <Row>
                        <Col span="8">
                            <FormItem label="存放方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                                <RadioGroup
                                    {...getFieldProps('storageWay', {
                                        initialValue: submitForm.storageWay + '',
                                        rules: [
                                            { required: true, message: '请选择存放方式' },
                                        ],
                                        onChange: (el) => {
                                            this.infoValueChange(el, 'storageWay')
                                        }
                                    })}
                                    size={size}>
                                    {this.getRadios(this.cffsGroup)}
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="8" pull={1}>
                            {
                                +storageWay === 3 ? <FormItem {...col2}>
                                    <Input
                                        className={less.w288}
                                        {...getFieldProps('otherStorageWay', {
                                            initialValue: submitForm.otherStorageWay,
                                            rules: [
                                                { required: true, message: '请输入其它存放方式' },
                                            ],
                                            onChange: (el) => {
                                                this.infoValueChange(el, 'otherStorageWay')
                                            }
                                        })}
                                        size={size}
                                        placeholder="请输入其它存放方式">
                                    </Input>
                                </FormItem> : null
                            }
                        </Col>
                    </Row>
                }
                <Row>
                    <FormItem label="折损程度" {...col2}>
                        <Input
                            className={less.w288}
                            {...getFieldProps('damage', {
                                initialValue: submitForm.damage,
                                rules: [
                                    { required: true, message: '请输入折损程度' },
                                ],
                                onChange: (el) => {
                                    this.infoValueChange(el, 'damage')
                                }
                            })}
                            size={size}
                            maxLength={30}
                            placeholder="请输入折损程度">
                        </Input>
                    </FormItem>
                </Row>
                {
                    submitForm.type !== 2 && <Row>
                        <FormItem label="货物所在地" {...col2}>
                            <LazyAddress className={less.w288}
                                placeholder="请选择货物所在地"
                                {...getFieldProps('address', {
                                    rules: [
                                        { required: true, message: '货物所在地' },
                                    ],
                                    initialValue: this.state.defAddress,
                                    onChange: (el, arr) => {
                                        this.infoValueChange(arr, 'address')
                                    }
                                })} size={size} />
                        </FormItem>
                    </Row>
                }
                {
                    submitForm.type !== 2 && <Row>
                        <Col span={2}>
                        </Col>
                        <Col span={15}>
                            <FormItem {...col2}>
                                <Input
                                    type="textarea"
                                    {...getFieldProps('goodsAddr', {
                                        initialValue: submitForm.goodsAddr,
                                        rules: [
                                            { required: true, message: '请输入详细地址' },
                                        ],
                                        onChange: (el) => {
                                            this.infoValueChange(el, 'goodsAddr')
                                        }
                                    })}
                                    maxLength={150}
                                    size={size}
                                    placeholder="请输入详细地址">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                }
            </div>
        )
    };

    photosListSucFile = (response, key) => {
        const goods = this.state.goods;
        goods.goodsFileList = goods.goodsFileList ? goods.goodsFileList : [];
        let obj = filePathDismant(response.data);
        goods.goodsFileList[key] = obj
        this.setState({
            goods
        })
        if (!this.state.imgMainPath) {
            this.setState({
                imgMainPath: viewImg(obj.filePath)
            })
        }
    };

    delImg = index => {
        const goods = this.state.goods;
        if (this.state.imgMainPath == viewImg(goods.goodsFileList[index].filePath)) {
            this.setState({
                imgMainPath: null
            })
        }
        goods.goodsFileList[index] = {}
        this.setState({
            goods
        })
    }

    sortLeft = (index) => {
        const goods = this.state.goods;
        if (index == 0 || !goods.goodsFileList[index - 1] || !goods.goodsFileList[index - 1].filePath) {
            return
        }
        [goods.goodsFileList[index - 1], goods.goodsFileList[index]] = [goods.goodsFileList[index], goods.goodsFileList[index - 1]]
        this.setState({
            goods
        })
    }

    sortRight = (index) => {
        const goods = this.state.goods;
        if (index == 4 || !goods.goodsFileList[index + 1] || !goods.goodsFileList[index + 1].filePath) {
            return
        }
        [goods.goodsFileList[index + 1], goods.goodsFileList[index]] = [goods.goodsFileList[index], goods.goodsFileList[index + 1]]
        this.setState({
            goods
        })
    }
    //物资主图及详情
    materialMain = () => {
        const { col2, materialMaxLen } = this.config;
        const { goods, materialLen } = this.state;
        const { photosList, imgMainPath } = this.state;
        const { goodsFileList } = goods;
        return (
            <div className={less.explain}>
                <Row>
                    <FormItem label="商品图片" required {...col2}>
                        <Col className={less.img_main} span={6}>
                            <img src={imgMainPath} onClick={this.handleImgMain} style={{ height: '100%' }}></img>
                        </Col>
                        <Col className={less.img_list} span={18}>
                            <div className={less.img_exp}>
                                <p>最多可发布5张商品主图，选择商品发布时，至少传一张商品图片</p>
                                <p>支持.PNG.BMP.JPG.GIF格式上传，建议尺寸500*500以上，文件大小2M内的图片</p>
                            </div>
                            <div className={less.img_listbox}>
                                {
                                    photosList.map((item, key) => {
                                        let value = goodsFileList && goodsFileList[key] ? goodsFileList[key] : item;
                                        return (
                                            <UploadItem data={value}
                                                index_up={key}
                                                delImg={() => this.delImg(key)}
                                                sortLeft={this.sortLeft}
                                                sortRight={this.sortRight}
                                                uploadSuccess={response => this.photosListSucFile(response, key)}
                                                imgEvent={() => {
                                                    this.handleImgItem(value)
                                                }} />
                                        )
                                    })
                                }
                            </div>
                        </Col>
                    </FormItem>
                </Row>
                <Row className="mt10">
                    <FormItem label="物资详情" {...col2}>
                        <WangEditor uplodImg={true} initHtml={goods.desc} maxLength={10000} onChange={this.editorChange}></WangEditor>
                        <div className={less.explain_length}>
                            {
                                materialLen > materialMaxLen ?
                                    <span className={less.explain_tip}>(已超出文本限制)</span> : null
                            }
                            <span>
                                {
                                    materialLen > materialMaxLen ?
                                        <span className={less.explain_warning}>{materialLen}</span> : materialLen
                                }/{materialMaxLen}
                            </span>
                        </div>
                    </FormItem>
                </Row>
            </div>
        )
    };
    //主图点击
    handleImgMain = (el) => {
        // if(el.target && el.target.src) {
        //     window.open(el.target.src,'_blank')
        // }
    };
    //点击图片
    handleImgItem = (item) => {
        this.setState({
            imgMainPath: viewImg(item.filePath)
        })
    };
    //上传成功
    uploadSucFile = (file) => {
        // let fileList = file.map(value => {
        //     let item = filePathDismant(value.response ? value.response.data : value.url);
        //     return item
        // });
        let { fileList } = this.state;
        if (fileList.length < 5) {
            fileList.push(filePathDismant(file.response.data))
            this.setState({
                fileList
            })
        } else {
            Util.alert('最多上传5个')
        }
    };

    //竞价附件-点击删除
    fileListDel = (item, index) => {
        let that = this;

        Util.confirm('删除附件', {
            tip: `确定删除 ${item.fileName} ?`,
            iconType: 'del',
            onOk() {
                let fileList = that.state.fileList;
                fileList.splice(index, 1)

                that.setState({
                    fileList
                })
            }
        })
    }

    //补充说明-change
    editorChange = (html, text) => {
        const { goods } = this.state;
        this.setState({
            // materialLen: text.length,
            materialLen:  text.replace(/<\/?(?!img)[a-z]+?[^>]*>/gi,"").length,
            goods: {
                ...goods,
                desc: html
            }
        })
    };

    //提交时处理数据
    handleParams = () => {
        let { submitForm: submitForms, goods, fileList } = this.state;
        let submitForm = JSON.parse(JSON.stringify(submitForms));
        let address = submitForm.address ? JSON.parse(JSON.stringify(submitForm.address)) : [];
        delete submitForm.address;
        if (address.length) {
            submitForm.provinceId = address[0].value;
            submitForm.provinceName = address[0].label;
            submitForm.cityId = address[1].value;
            submitForm.cityName = address[1].label;
            submitForm.countyId = address[2].value;
            submitForm.countyName = address[2].label;
        }
        submitForm.isForever = submitForm.isForever ? 1 : 0
        submitForm.effectiveDate = submitForm.isForever ? '' : submitForm.effectiveDate
        // // 项目部名称 publishProjectName
        let pro = this.state.publishProjectOption.filter(value => value.id === submitForm.publishProjectId);
        submitForm.publishProjectName = (pro && pro[0] && pro[0].value) ? pro[0].value : null;

        if (Array.isArray(submitForm.useArea)) {
            submitForm.useArea = submitForm.useArea.join(',');
        }
        if (submitForm.effectiveDate) {
            submitForm.effectiveDate = moment(submitForm.effectiveDate).format('YYYY-MM-DD');
        }
        if (Array.isArray(goods.goodsFileList)) {
            goods.goodsFileList = goods.goodsFileList.filter(value => !!value);
        }
        goods = [goods].map(v => {
            if (v.isFace) {
                v.price = null;
                v.isFace = 1;
            }
            if (v.isBigNum) {
                v.stockNum = null;
                v.unit = null;
                v.isBigNum = 1;
            }
            if (v.isForever) {
                v.isForever = 1;
            }
            if (submitForm.type == 2) {
                delete v.original
            }
            v = Util.deleteEmptyKey(v)
            return v;
        });
        const uuids = this.props.match.params.uuids;
        if (uuids) {
            submitForm.uuids = uuids;
        }
        if (submitForm.type == 2) {
            delete submitForm.storageTime
            delete submitForm.storageWay
            delete submitForm.otherStorageWay
            delete submitForm.provinceId
            delete submitForm.provinceName
            delete submitForm.cityId
            delete submitForm.countyId
            delete submitForm.cityName
            delete submitForm.countyName
            delete submitForm.goodsAddr
        }
        return { ...submitForm, goodsList: JSON.stringify(goods), fileList: JSON.stringify(fileList) }
    };

    bidAjax = (data) => {
        let params = {
            ...data
        };
        params.publishCompanyId = this.props.userInfo.companyId;
        params.publishCompanyName = this.props.userInfo.companyName;
        let url;
        if (params.uuids) {
            url = this.submitUrl;
        } else {
            url = params.type == 1 ? this.sellSubmitUrl : this.buySubmitUrl;
        }
        api.ajax('POST', url, params, {
            headers: {
                'Sub-Platform': this._type === 'mall' ? '0' : null
            }
        })
            .then(res => {
                if (res.code === "000000") {
                    this.uuids_ = res.data
                    if (data.status === 20) {
                        this.setState({
                            result: 'submit'
                        })
                    } else {
                        Modal.confirm({
                            title: '保存成功, 是否返回列表',
                            content: '留在此页继续编辑或返回列表',
                            okText: '返回列表',
                            cancelText: '留在此页',
                            onOk: this.returnsList,
                            onCancel() {
                            },
                        });
                    }
                    if (window.opener && window.opener.location.href.endsWith('#/supply/sell')) {
                        window.opener.location.reload();  //刷新父页面
                    }
                }
            }, e => Util.alert(e.msg, { type: 'error' })).catch(res => {
                Util.alert(res.msg, { type: 'error' })
            })
    };
    //递交
    bidSubmit = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                Util.alert('请将信息填写完整！')
                setTimeout(() => {
                    let ant_form_explain = document.querySelector('.ant-form-explain')
                    ant_form_explain.offsetParent.scrollIntoView()
                }, 100);
                return;
            }
            if (this.state.goods.goodsFileList.length <= 0) {
                Util.alert('至少上传一张商品图片！');
                return;
            }
            if (!errors) {
                if (this.state.materialLen <= this.config.materialMaxLen) {
                    let params = this.handleParams();
                    params.status = 20;
                    if (this.uuids_) {
                        params.uuids = this.uuids_
                    } else if (this._type == 'repub') {
                        delete params.uuids
                    }
                    this.bidAjax(params)
                } else {
                    Util.alert('补充说明文本长度已超出限制长度！')
                }
            }
        });
    };
    //保存
    bidSave = () => {
        if (this.state.materialLen <= this.config.materialMaxLen) {
            let params = this.handleParams();
            params.status = 10;
            if (this.uuids_) {
                params.uuids = this.uuids_
            } else if (this._type == 'repub') {
                delete params.uuids
            }
            this.bidAjax(params)
        } else {
            Util.alert('补充说明文本长度已超出限制长度！')
        }
        return;
    };
    //关闭
    bidClose = () => {
        Util.confirm('确定离开？', {
            iconType: 'save',
            tip: "填写的数据不会保存！！",
            onOk() {
                closeWin()
            }
        })
    };
    // 继续发布
    release = () => {
        this.setState({
            result: null,
        })
        if (this._type === 'mall') {  //频道页点进来的
            window.open(systemConfigPath.jumpPage('/desk/supply/sellOrBuy/add?uuids=&type=mall'), '_self')
        } else {
            window.open(systemConfigPath.jumpPage('/desk/supply/sellOrBuy/add?uuids='), '_self')
        }
    };
    // 递交中间页
    middlePage = () => {
        return (
            <div className={less.result_success}>
                <img src={successSvg} width={85} height={85} alt="" />
                <h1>递交成功</h1>
                <h3>平台将在2个工作日内由客服人员进行审核</h3>
                <p>审核结果将通过站内信方式发送，请注意查收！！</p>
                <div className={less.substanceBtn} onClick={this.release}>继续发布</div>
                <div className={less.borderBtn} onClick={this.returnsList}>返回列表</div>
            </div>
        )
    };

    render() {
        let result = this.state.result;
        let { fileList } = this.state;
        let defaultFileList = fileList.map((v, k) => {
            return {
                uid: ++k,
                name: v.fileName,
                status: 'done',
                url: v.filePath,
            }
        });
        switch (result) {
            case "submit":
                return this.middlePage();
            default:
                return (
                    <div className={less.scene}>
                        <Form className="reuse_baseForm" style={{ paddingTop: '10px' }}>
                            {
                                (this.state.statusOBJ && this.state.statusOBJ.status == 25) && <Alert
                                    message={this.state.statusOBJ.statusStr}
                                    style={{ marginTop: '10px' }}
                                    description={'驳回理由:' + this.state.statusOBJ.approvalOpinion}
                                    type="warning"
                                    showIcon
                                    closable
                                />
                            }
                            <Card className={less.main_card} title="供求基本信息">
                                <div>{this.sceneBaseInfo()}</div>
                            </Card>
                            <Card className={less.main_card} title="物资基本信息">
                                <div>{this.materialBaseInfo()}</div>
                            </Card>
                            <Card className={less.main_card} title="物资主图及详情">
                                <div>{this.materialMain()}</div>
                            </Card>
                            <Card className={less.main_card} title="供求附件" style={{ marginBottom: '80px' }}>
                                <div className={less.product_appendix}>
                                    {/* <UploadList defaultList={defaultFileList} uploadSuccess={this.uploadSucFile}/> */}
                                    <UploadFile
                                        max={100}
                                        tip
                                        disabled={this.state.fileList.length >= 5}
                                        uploadSuccess={(...props) => this.uploadSucFile(...props)}></UploadFile>
                                    <div className={less.files}>
                                        {
                                            (this.state.fileList || []).map((v, index) => {
                                                return (
                                                    <div className={less.fileitem} key={index}>
                                                        <a className="reuse_link"
                                                            style={{ maxWidth: '120px' }}
                                                            title={v.fileName}
                                                            href="javascript:void(0);"
                                                            onClick={() => download(v.fileName, systemConfigPath.fileDown(v.filePath), true)}
                                                        >
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
                            <Card className='fixed_button' style={{ width: '1200px' }}>
                                <div className={["reuse_baseButtonGroup", less.saveBtn].join(' ')}>
                                    <Button onClick={this.bidClose}>关闭</Button>
                                    <Button onClick={this.bidSave}>保存</Button>
                                    <Button type="primary" onClick={this.bidSubmit}>递交</Button>
                                </div>
                            </Card>
                        </Form>
                    </div>
                )
        }
    };
}

export default PublishSD
