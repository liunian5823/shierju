import { Card, Form, Input, Button, Switch, Alert, Row, Col,Upload, TreeSelect, message, InputNumber,Icon } from 'antd';
import api from '@/framework/axios';
import UploadImg from '@/components/uploadImg';
import BaseAffix from '@/components/baseAffix';
import less from './index.less'
import './index.css'
import Util from '@/utils/util';
import DefaultImg from './tjtb.png';
import util from "../../../utils/util";

const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;



class addBrand extends React.Component{
    state = {
        loading: false,
        dataSouce: [],
        tree:[],
        treeSelect:[],
        uploadImgUrl:'',//图片地址
        id:'',
    }
    _isMounted = false;
    _uuids = "";

    componentWillMount(){
        this._isMounted = true;
        const uuids = this.props.match.params.uuids;
        this._uuids = uuids;
        if(uuids){
            this.getBrandInfo(uuids);
        }
        this.getBrandLevel();
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    //修改功能，获取原数据
    getBrandInfo = (uuids) => {
        let _this = this;
        if(this.state.loading) return false;
        this.setState({
            loading: true,
        })
        api.ajax('GET','@/merchandise/ecBrand/crccPortal/getInfo',{
            uuids
        }).then(r=>{
            if(!_this._isMounted){
                return;
            }
            if (r.data.goodsClassId!=null) {
                // 由于关联分类类型不一致，进行处理（需要逻辑值，得到的是字符串）
                const ClassList = r.data.goodsClassId.split(',')
                let treeSelect = this.state.treeSelect
                {
                    ClassList.map((item) => {
                        treeSelect.push(item * 1)
                    })
                }
            }
            this.setState({
                loading: false,
                logo: r.data.logo,
                uploadImgUrl: r.data.logo,
                id:r.data.id,
            })
            r.data.display = r.data.display==1?true:false;
            r.data.recommend = r.data.recommend==1?true:false;
            this.props.form.setFieldsValue(r.data);
        }).catch(r=>{
            this.setState({
                loading: false
            })
        })
    }
    //获取关联分类
    getBrandLevel = () => {
        let _this = this;
        if(this.state.loading) return false;
        this.setState({
            loading: true,
        })
        api.ajax('GET','@/merchandise/ecGoodsClass/all',{
        }).then(r=>{
            if(!_this._isMounted){
                return;
            }
            this.initTreeNode(r.data.rows);
            this.setState({
                loading: false,
                dataSouce: r.data.rows
            })

        }).catch(r=>{
            this.setState({
                loading: false
            })
        })
    }
    initTreeNode = (data) => {
        data.map((item) => {
            item.label = item.brandName;
            item.key = item.id;
            item.value = item.id;
            if (item.children) {
                this.initTreeNode(item.children);
            }
        });
    }

    //图片上传change事件
    uploadPhotoChange = (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            let uploadImgUrl = info.file.response.data;
            console.log('上传路径', uploadImgUrl);
            this.setState({
                uploadImgUrl
            })
            //展示图片
            // this.updateGoodsPic(uploadImgUrl);
            message.success(`${info.file.name} 上传成功。`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        }
    }
//图片上传前检查
    checkGoodsPhoto = (file) => {
        if (file.size > (1048 * 1048 * 2)) {
            Util.alert('上传的照片不能大于2M，请压缩后上传', {type: "error"})
            return false;
        }
        return true;

    }

    //删除当前图片
    deleteGoodsPic =()=>{
        this.setState({
            uploadImgUrl:''
        })
    }

    handleCancel = () => {
        this.props.history.push('/basicSetup/brandManagement');
        this._Model=true;
    }


    _Model=true;
    handleSubmit = () => {
        let treeSel=this.state.treeSelect
        console.log('------------',treeSel)
        if (treeSel.length==0){
            Util.alert("请选择关联分类！");
            return;
        }
        this.props.form.validateFieldsAndScroll((errors,values)=>{
            if(!!errors){
                console.log('Errors in form!!!');
                return;
            }
            if(this._uuids){
                values.uuids = this._uuids;
            }
            values.goodsClassId = this.state.treeSelect==null?'':this.state.treeSelect.toString();
            values.display = values.display?1:0;
            values.recommend = values.recommend?1:0;
            values.logo=this.state.uploadImgUrl
            values.id=this.state.id;
            let _this = this;
            if(this.state.loading) return false;
            this.setState({
                loading: true,
            })
            if (this._Model){
                this._Model=false;
                api.ajax('POST','@/merchandise/ecBrand/crccPortal/saveBrand',{
                    ...values
                }).then(r=>{
                    if(!_this._isMounted){
                        return;
                    }
                    this.setState({
                        loading: false,
                    })
                    Util.alert('保存成功', { type: 'success' });
                    setTimeout(()=>{
                        this.props.history.push('/basicSetup/brandManagement');
                    },1000)
                }).catch(r=>{
                    Util.alert(r.msg);
                    this.setState({
                        loading: false
                    })
                    this._Model=true;
                })
            }else{
                Util.alert('请勿重复提交');
            }

        })
    }


    handleTreeSelectChange = (value) => {
        this.setState({
            treeSelect: value
        })
    }

    treeData=()=>{
        const dataSouce=this.state.dataSouce;
        const tree=[];
        // console.log(dataSouce)
        {dataSouce.map((item,key)=>{
            if (item.pid==-1){
                let name=item.name
                let id=item.id
                // console.log(name)
                let tree2= this.tree2(id);
                const tree1 = {
                    label: name,
                    value: id,
                    children:tree2
                };
                tree.push(tree1)
            }
        })}

        return tree;
    }

    //根据id查询是否有二级
    tree2=(Id)=>{
        const dataSouce=this.state.dataSouce;
        const tree=[];
        {dataSouce.map((item,index)=>{
            if (item.pid==Id){
                let name=item.name
                let id=item.id
                let tree3= this.tree3(id);
                const tree2 = {
                    label: name,
                    value: id,
                    children:tree3
                };
                tree.push(tree2)
            }
        })}
        return tree;
    }

    //根据id查询是否有三级
    tree3=(Id)=>{
        const dataSouce=this.state.dataSouce;
        const tree=[];
        {dataSouce.map((item,index)=>{
            if (item.pid==Id){
                let name=item.name
                let id=item.id
                const tree2 = {
                    label: name,
                    value: id,
                };
                tree.push(tree2)
            }
        })}
        return tree;
    }

    render(){
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        let uploadImgUrl=this.state.uploadImgUrl;
        let treeSelect= this.state.treeSelect;
        // console.log('分类',treeSelect)
        return(
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Card title="品牌信息" bordered={false}>
                        <FormItem {...formItemLayout} label="品牌名称">
                            <Input type="text"
                                   {...getFieldProps('brandName',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请输入少于25个字符的品牌名称"
                                               }
                                           ]
                                       })}
                                   placeholder="请输入少于25个字符的品牌名称"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="英文名称">
                            <Input type="text"
                                   {...getFieldProps('brandEname',
                                       {
                                           rules: [
                                               {
                                                   required: true,
                                                   message: "请输入少于50个字符的英文名称"
                                               }
                                           ]
                                       })}
                                   placeholder="请输入少于50个字符的英文名称"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="品牌网址">
                            <Input type="text"
                                   {...getFieldProps('siteUrl')}
                                   placeholder="请输入少于50个字符的品牌网址"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label={<p><span style={{color:"red"}}>*</span> 选择关联分类</p>}>
                            <div>
                                <TreeSelect
                                    {...getFieldProps('treeSelect')}
                                    treeData={this.treeData()}
                                    value={treeSelect}
                                    onChange={this.handleTreeSelectChange}
                                    dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                    multiple={true}
                                    treeCheckable={true}
                                    showCheckedStrategy={SHOW_PARENT}
                                    searchPlaceholder="选择分类">
                                </TreeSelect>
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout} label=" ">
                            <Icon type="cross-circle-o" className = { less.deleteIcon } onClick={this.deleteGoodsPic.bind(this)} />
                            <Upload
                                {...props}
                                {...getFieldProps('logo')}
                                onChange={this.uploadPhotoChange.bind(this)}
                                beforeUpload={this.checkGoodsPhoto.bind()}
                                listType="picture-card"
                                className={"uploadClass"}
                            >
                                {uploadImgUrl ? 
                                <div className={less.imgBox}>
                                    <img src={imageOrigin + uploadImgUrl} alt="avatar" className={less.tupianImg} />
                                </div>
                                :
                                <div className={less.imgBox}>
                                    <img src={DefaultImg} alt="avatar" className={less.defaultImg} />
                                    <p>上传图片</p>
                                </div>}
                            </Upload>                            
                            <div className={less.content}>
                                <h2>品牌图片</h2>
                                <p>请上传格式为PNG/JPG图片</p>
                                <p>体积小于2MB的图片</p>
                                <p>请确认图片各项内容清晰可见以便审核</p>
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout} label="显示">
                            <Switch  checkedChildren="开" unCheckedChildren="关"
                                     {...getFieldProps('display',
                                         {
                                             valuePropName: 'checked'
                                         })}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="推荐">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Switch  checkedChildren="开" unCheckedChildren="关"
                                             {...getFieldProps('recommend',
                                                 {
                                                     valuePropName: 'checked'
                                                 })}/>
                                </Col>
                                <Col span={12}>
                                    <Alert message="推荐品牌将会在首页轮换显示" type="info" showIcon />
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...formItemLayout} label="排序序号">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <InputNumber type="text"
                                                 {...getFieldProps('sortOrder')}/>
                                </Col>
                                <Col span={12}>
                                    <Alert message="序号越小显示越靠前，最大排序999" type="info" showIcon />
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...formItemLayout} label="品牌描述">
                            <Input type="textarea"
                                   {...getFieldProps('brandDesc')}/>
                        </FormItem>
                    </Card>
                    <BaseAffix>
                        <Button style={{marginRight: "10px"}} onClick={this.handleCancel}>取消</Button>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>确定</Button>
                    </BaseAffix>
                </Form>
            </div>
        )
    }
}

//上传图片
const uploadBaseUrl = SystemConfig.configs.uploadUrl;//根上传路径  https://www2.crccmall.com:8443/api/base/file
const imageOrigin = SystemConfig.configs.resourceUrl;
const props = {
    name: 'file',
    action: uploadBaseUrl + '/uploadImgNoWatermark',//必选参数, 上传的地址,
    accept: 'image/png, image/bmp, image/jpg, image/jpeg, image/gif',   //限制图片格式
    showUploadList: false,
};

export default Form.create()(addBrand);