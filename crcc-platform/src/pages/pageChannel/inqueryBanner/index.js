import React from 'react';
import api from '@/framework/axios'//请求接口的封装
import {Carousel,Row, Col, Tabs, Modal, Button, Input, Icon, Transfer} from 'antd';
import bj1 from "../storePlatform/img/bj1.jpg";
import less from "./index.less";
import BaseTable from '@/components/baseTable';
import UploadImg from '@/components/uploadImgrh';
import Util from '@/utils/util';
import Album from "uxcore-album";

const { Photo } = Album;
const imageOrigin = SystemConfig.configs.resourceUrl;
export default class InqueryBanner  extends React.Component {

    _isMounted = false

    state = {
        bannerArr:[],
        currentEditObj:{id:"",title:"", src:"bj1", url:"",customClassId:"", customClassName:"",storeRemarks:'', type:""},
        currentFlag:'',	//当前编辑对象
        visible1:false,       	//图片、链接
        imageSize:'1920px * 450px',		//图片建议尺寸
        tableState0: 0,//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        loading0:false,			//图片、标题、链接 提交按钮
    }

    componentWillMount() {
        this._isMounted = true;
        //请求数据
        this.initData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    initData=()=>{
        //查询数据
        this.queryAllData();
    }

    //初始化查询数据
    queryAllData=()=>{
        let channel = 3;
        api.ajax(
            'GET',
            '@/portal/ecNavAdv/all',
            {channel}
        ).then(
            r=>{
                console.log("查询当前数据为：", r)
                let bannerArr = this.state.bannerArr;
                bannerArr = r.data.bannerArr;
                this.setState({
                    bannerArr
                })
            }
        ).catch(
            r=>{
                //console.log("查询当前数据失败：", r)
            }
        )

    }



    //编辑方法
    clickEdit=(id, title, src, url, type, customClassId, customClassName,storeRemarks, flag)=>{
        let currentEditObj = this.state.currentEditObj;
        let currentFlag= this.state.currentFlag;
        currentEditObj.id = id;
        currentEditObj.title = title;
        currentEditObj.src = src;
        currentEditObj.url = url;
        currentEditObj.customClassId = customClassId;
        currentEditObj.customClassName = customClassName;
        currentEditObj.type = type;
        currentFlag = flag;
        currentEditObj.storeRemarks = storeRemarks;
        this.setState({
            currentEditObj,
            currentFlag
        })

        //设置当前的参数
        this.baseParams = {
            advId:id,
            type:type
        }
        // //设置当前列
        this.setTableColumn(flag);

        this.showModal(flag);
    }
    columns = []

    setTableColumn=(flag)=>{
            this.columns = [
                {
                    title: '操作人',
                    dataIndex: 'username',
                    key: 'username',
                    //width: 100
                },{
                    title: '更新日期',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    //width: 170,
                    render: (text) => {
                        return moment(text).format("YYYY-MM-DD HH:mm:ss")
                    }
                },{
                    title: '图片查看',
                    dataIndex: 'src',
                    key: 'src',
                    //width: 170,
                    render: (text) => {
                        return <div title = {text} onClick={this.showPic.bind(this, text)}>查看</div>
                    }
                },{
                    title: '链接地址',
                    dataIndex: 'url',
                    key: 'url',
                    //width: 170
                },
            ]
            //加载数据
            this.handelToLoadTable(1, 'tableState0');

    }

    //展示图片
    showPic=(path)=>{
        let photoElm = [];
        photoElm.push(
            <Photo
                src={imageOrigin + path}
            />,
        )
        Album.show({
            photos: photoElm,
        });
    }


    //显示弹窗modal
    showModal=(type)=>{
        if(type == 'banner'){
            this.boxsize={width:"640px",height:"150px",border:"1px dashed #d9d9d9!important","margin-bottom":"20px!important","padding":"10px!important"};
            this.iconstyle={"font-size":"30px","margin-bottom":"0px","color":"#ccc",position:"absolute",top:"50px",left:"320px"};
            this.textstyle={position:"absolute",top:"90px",left:"275px", width:"120px","padding-top":"8px"}
            this.setState({
                visible1: true,
                imageSize:'1920px * 450px'
            });
        }
    }

    //返回按钮
    handleCancel=()=>{
        this.setState({
            visible1: false,
            loading0: false
        });
    }


    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }

    //加载table
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }



    //上传图片成功
    uploadSuccess = (imgUrl, filename) => {
        //赋值
        let currentEditObj = this.state.currentEditObj;
        currentEditObj.src = imgUrl;
        this.setState({
            currentEditObj
        })
    }

    //输入框的change事件
    changeInput=()=>{
        let val = $("#input_url").val();
        let currentEditObj = this.state.currentEditObj;
        currentEditObj.url = val;
        this.setState({
            currentEditObj
        })
    }


    //校验图片输入的url合法性
    checkInputUrl=()=>{
        let url = $("#input_url").val();
        if(url == '') return;
        let currentEditObj = this.state.currentEditObj;
        if(url.indexOf('crccmall.com') == -1 ){
            currentEditObj.url = '';
            $("#input_url").val('');
            Util.alert("不允许输入站外链接");
            return;
        }else{
            currentEditObj.url = url;
            this.setState({
                currentEditObj
            })
        }
    }

    //确定按钮
    handleOk=(type)=>{
        if(type == 'banner'){
            this.setState({
                loading0: true
            });
        }
        //调用保存方法
        this.submitData();
    }


    //提交数据
    submitData=()=>{
        let params = this.state.currentEditObj;
        let _type = this.state.currentFlag;
        api.ajax(
            'POST',
            '@/portal/ecNavAdv/update',
            params
        ).then(
            r=>{
                Util.alert("保存成功！");
                //更新数据
                this.queryAllData();
                //关闭弹窗
                this.setState({
                    visible1: false,
                    loading0: false
                });
                return;
            }
        ).catch(
            r=>{
                //console.log("更新失败", r)
            }
        )
    }



    render() {
        let bannerArr = this.state.bannerArr;
        let currentObj = this.state.currentEditObj;	//banner
        return(
            <div>
                <div>
                    <Modal visible={this.state.visible1}
                           onCancel={this.handleCancel.bind()}
                           width={"800px"}
                           footer={[]}
                    >
                        <div className={less.padingzhi}>
                            <div className={less.tishiyu}>
                                <strong>上传图片:</strong>
                                请上传格式为PNG/JPG文件体积小于2MB的图片请确认图片各项内容清晰以便审核;图片尺寸：{this.state.imageSize}
                            </div>
                        </div>
                        <div className={less.upimages}>
                            <div>
                                <UploadImg type="head" title="上传图片" filename={'file'} uploadSuccess={this.uploadSuccess} imgUrl={currentObj.src} custom_hide={true} uploadPath={true} boxsize={this.boxsize} iconstyle={this.iconstyle} textstyle={this.textstyle}  noWatermark={true}/>
                            </div>
                            <div className={less.lianjiedz}>
                                <span className={less.biaotidzlj}>链接地址:</span>
                                <Input id={"input_url"} placeholder={"链接地址"} onBlur={this.checkInputUrl.bind()} onChange={this.changeInput.bind()} value={currentObj.url}/>
                            </div>
                        </div>

                        <div className={less.commitibutton}>
                            <Button key="back1" type="ghost" size="large" onClick={this.handleCancel.bind()}>返 回</Button>
                            <Button key="submit1" type="primary" size="large" loading={this.state.loading0} onClick={this.handleOk}>提 交</Button>
                        </div>

                        <div className={less.fanyelei}>
                            <BaseTable
                                notInit={true}
                                url="@/portal/ecNavAdv/logPage"
                                tableState={this.state.tableState0}
                                resetTable={(state) => { this.resetTable(state, 'tableState0') }}
                                baseParams={this.baseParams}
                                columns={this.columns}
                                indexkeyWidth={60}
                            />
                        </div>

                    </Modal>
                    <Carousel className={less.banner}>
                        {
                            bannerArr.map(
                                (item, index)=>{
                                    return(
                                        <div key={`banner${index}`} onClick={this.clickEdit.bind(this, item.id, item.title, item.src, item.url, item.type, item.customClassId, item.customClassName,item.storeRemarks, 'banner')} ><h3><img src={item.src==null?bj1:imageOrigin+item.src}/></h3></div>
                                    )
                                }
                            )
                        }
                    </Carousel>
                </div>
            </div>
        )
    }
}


