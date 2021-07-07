import {Modal, Button, Form, Input} from 'antd';
import BaseTable from "@/components/baseTable";
import Album from 'uxcore-album';
import {configs} from '@/utils/config/systemConfig'
import UploadImg from "./upload";
import less from "@/pages/pageChannel/crccIndex/index.less";
import api from "@/framework/axios";
import Util from "@/utils/util";

const {Photo} = Album;
const imageOrigin = configs.resourceUrl;

class EditModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: null
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        });
    }

    //展示图片
    showPic = (path) => {
        let photoElm = [];
        let paths = path.indexOf('http') === 0 ? path : imageOrigin + path;
        photoElm.push(
            <Photo
                src={paths}
            />,
        );
        Album.show({
            photos: photoElm,
        });
    };
    //上传图片成功
    uploadSuccess = (imgUrl) => {
        //赋值
        let data = this.state.data;
        data.src = imgUrl;
        this.setState({
            data
        })
    };
    handleOk = () => {
        this.setState({
            loading: true
        });
        let params = this.state.data;
        api.ajax(
            'POST',
            '**/reuse/navAdv/update',
            params
        ).then(
            r => {
                this.setState({
                    loading: false,
                });
                Util.alert("保存成功！");
                document.getElementById('channelManagement').contentWindow.postMessage(JSON.stringify({a: 'sss'}), this.props.src);
                document.getElementById('channelManagement').contentWindow.location.reload();
                this.props.closeBack(true);
            }
        ).catch(
            r => {
            }
        )
    };
    onChange = ({target: {value}}, prop) => {
        let data = this.state.data;
        data[prop] = value;
        this.setState({
            data
        })
    };

    render() {
        const {loading, data} = this.state;
        let {visible, closeBack, type: flag} = this.props;
        let columns = () => {
            if (flag === 'banner' || flag === 'fivePic') {
                return [
                    {
                        title: '操作人',
                        dataIndex: 'username',
                        key: 'username',
                        //width: 100
                    }, {
                        title: '更新日期',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        //width: 170,
                        render: (text) => {
                            return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }, {
                        title: '图片查看',
                        dataIndex: 'src',
                        key: 'src',
                        //width: 170,
                        render: (text) => {
                            return <div title={text} onClick={this.showPic.bind(this, text)}><a>查看</a></div>
                        }
                    }, {
                        title: '链接地址',
                        dataIndex: 'url',
                        key: 'url',
                        //width: 170
                    },
                ]
            }
            if (flag === 'supplier' || flag === 'pic' || flag === 'footerFour') {
                return [
                    {
                        title: '操作人',
                        dataIndex: 'username',
                        key: 'username',
                        //width: 100
                    }, {
                        title: '更新日期',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        //width: 170,
                        render: (text) => {
                            return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }, {
                        title: '图片查看',
                        dataIndex: 'src',
                        key: 'src',
                        //width: 170,
                        render: (text) => {
                            return <div title={text} onClick={this.showPic.bind(this, text)}><a>查看</a></div>
                        }
                    }
                ]
                //加载数据
                this.handelToLoadTable(1, 'tableState5');
            }
            if (flag === 'supplierInfo' || flag === 'thireePic') {
                return [
                    {
                        title: '操作人',
                        dataIndex: 'username',
                        key: 'username',
                        //width: 100
                    }, {
                        title: '更新日期',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        //width: 170,
                        render: (text) => {
                            return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }, {
                        title: '标题',
                        dataIndex: 'title',
                        key: 'title',
                        //width: 170,
                    }, {
                        title: '图片查看',
                        dataIndex: 'src',
                        key: 'src',
                        //width: 170,
                        render: (text) => {
                            return <div title={text} onClick={this.showPic.bind(this, text)}><a>查看</a></div>
                        }
                    },
                    // {
                    //     title: '链接地址',
                    //     dataIndex: 'url',
                    //     key: 'url',
                    //     //width: 170
                    // },
                ]
                //加载数据
                this.handelToLoadTable(1, 'tableState0');
            }
            if (flag === 'class') {
                return [
                    {
                        title: '操作人',
                        dataIndex: 'username',
                        key: 'username',
                        //width: 100
                    }, {
                        title: '更新日期',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        //width: 170,
                        render: (text) => {
                            return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }, {
                        title: '分类',
                        dataIndex: 'class',
                        key: 'class',
                        //width: 170,
                    }
                ]
                //加载数据
                this.handelToLoadTable(1, 'tableState4');
            }
            if (flag === 'supplierImg') {
                return [
                    {
                        title: '操作人',
                        dataIndex: 'username',
                        key: 'username',
                        //width: 100
                    }, {
                        title: '更新日期',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        //width: 170,
                        render: (text) => {
                            return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }, {
                        title: '大标题',
                        dataIndex: 'title',
                        key: 'title',
                        //width: 170,
                    }, {
                        title: '小标题',
                        dataIndex: 'storeRemarks',
                        key: 'storeRemarks',
                        //width: 170,
                    },
                    {
                        title: '图片查看',
                        dataIndex: 'src',
                        key: 'src',
                        //width: 170,
                        render: (text) => {
                            return <div title={text} onClick={this.showPic.bind(this, text)}><a>查看</a></div>
                        }
                    },
                ]
                //加载数据
                this.handelToLoadTable(1, 'tableState6');
            }
            if (flag === 'smartTitle') {
                return [
                    {
                        title: '操作人',
                        dataIndex: 'username',
                        key: 'username',
                        //width: 100
                    }, {
                        title: '更新日期',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        //width: 170,
                        render: (text) => {
                            return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }, {
                        title: '大标题',
                        dataIndex: 'title',
                        key: 'title',
                        //width: 170,
                    }
                ]
                //加载数据
                this.handelToLoadTable(1, 'tableState8');
            }
            if (flag === 'titleAndLink') {
                return [
                    {
                        title: '操作人',
                        dataIndex: 'username',
                        key: 'username',
                        //width: 100
                    }, {
                        title: '更新日期',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        //width: 170,
                        render: (text) => {
                            return moment(text).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }, {
                        title: '大标题',
                        dataIndex: 'title',
                        key: 'title',
                        //width: 170,
                    }, {
                        title: '链接地址',
                        dataIndex: 'url',
                        key: 'url',
                        //width: 170,
                    }
                ]
                //加载数据
                this.handelToLoadTable(1, 'tableState7');
            }
        };
        let content = () => {
            let boxsize, iconstyle, textstyle, imgSize;
            let layout = {
                labelCol: {span: 4},
                wrapperCol: {span: 14}
            };
            if (flag === 'supplierInfo') {
                boxsize = {
                    width: "280px",
                    height: "80px",
                    border: "1px dashed #d9d9d9!important",
                    "margin-bottom": "20px!important",
                    "padding": "10px!important"
                };
                imgSize = {
                    pic: {width: "140px", height: "140px"},
                    footerFour: {width: "140px", height: "40px"},
                    banner: {width: "750px"},
                };
                return (
                    <div className="imgBox" style={{'margin-top': '20px'}}>
                        <div className="imgBox-content">
                            <div className={less.tishiyu}>
                                <strong>上传图片:</strong>
                                请上传格式为PNG/JPG文件体积小于2MB的图片请确认图片各项内容清晰以便审核;图片尺寸：{this.state.imageSize}
                            </div>
                            <UploadImg type="head" title="上传图片"
                                       style={boxsize}
                                       imgSize={imgSize[flag]}
                                       uploadSuccess={this.uploadSuccess}
                                       imgUrl={data.src}
                                       name={data.title}
                            />
                        </div>
                        <Form
                            {...layout}>
                            <Form.Item
                                label="标题设置"
                                name="username"
                            >
                                <Input defaultValue={data.title} onChange={e => this.onChange(e, 'title')}/>
                            </Form.Item>
                            {/*<Form.Item*/}
                            {/*    label="链接地址"*/}
                            {/*    name="username"*/}
                            {/*>*/}
                            {/*    <Input defaultValue={data.url} onChange={e => this.onChange(e, 'url')}/>*/}
                            {/*</Form.Item>*/}
                        </Form>
                    </div>

                )
            }
            if (flag === 'supplier') {
                return (
                    <div className="imgBox" style={{'margin-top': '20px'}}>
                        <Form
                            {...layout}>
                            <Form.Item
                                label="标题设置"
                                name="username"
                            >
                                <Input defaultValue={data.title} onChange={e => this.onChange(e, 'title')}/>
                            </Form.Item>
                            <Form.Item
                                label="备注"
                                name="username"
                            >
                                <Input defaultValue={data.storeRemarks} onChange={e => this.onChange(e, 'storeRemarks')}/>
                            </Form.Item>
                        </Form>
                    </div>
                )
            }
            if (flag === 'supplierImg') {
                boxsize = {
                    width: "280px",
                    height: "80px",
                    border: "1px dashed #d9d9d9!important",
                    "margin-bottom": "20px!important",
                    "padding": "10px!important"
                };
                imgSize = {
                    pic: {width: "140px", height: "140px"},
                    footerFour: {width: "140px", height: "40px"},
                    banner: {width: "750px"},
                };
                return (
                    <div className="imgBox" style={{'margin-top': '20px'}}>
                        <div className="imgBox-content">
                            <div className={less.tishiyu}>
                                <strong>上传图片:</strong>
                                请上传格式为PNG/JPG文件体积小于2MB的图片请确认图片各项内容清晰以便审核;图片尺寸：{this.state.imageSize}
                            </div>
                            <UploadImg type="head" title="上传图片"
                                       style={boxsize}
                                       imgSize={imgSize[flag]}
                                       uploadSuccess={this.uploadSuccess}
                                       imgUrl={data.src||''}
                                       name={data.title}
                            />
                        </div>
                        <Form
                            {...layout}>
                            <Form.Item
                                label="标题设置"
                                name="username"
                            >
                                <Input defaultValue={data.title} onChange={e => this.onChange(e, 'title')}/>
                            </Form.Item>
                            <Form.Item
                                label="备注"
                                name="username"
                            >
                                <Input defaultValue={data.storeRemarks} onChange={e => this.onChange(e, 'storeRemarks')}/>
                            </Form.Item>
                        </Form>
                    </div>
                )
            }
            if (flag === 'smartTitle') {
                return (
                    <Form
                        {...layout}>
                        <Form.Item
                            label="标题设置"
                            name="username"
                        >
                            <Input defaultValue={data.title} onChange={e => this.onChange(e, 'title')}/>
                        </Form.Item>
                    </Form>
                )
            }
            if (flag === 'titleAndLink') {
                return (
                    <Form
                        {...layout}>
                        <Form.Item
                            label="标题设置"
                            name="username"
                        >
                            <Input defaultValue={data.title} onChange={e => this.onChange(e, 'title')}/>
                        </Form.Item>
                        <Form.Item
                            label="链接地址"
                            name="username"
                        >
                            <Input defaultValue={data.url} onChange={e => this.onChange(e, 'url')}/>
                        </Form.Item>
                    </Form>
                )
            }
            if (flag === 'footerFour' || flag === 'pic' || flag === 'banner') {
                boxsize = {
                    width: "280px",
                    height: "80px",
                    border: "1px dashed #d9d9d9!important",
                    "margin-bottom": "20px!important",
                    "padding": "10px!important"
                };
                imgSize = {
                    pic: {width: "140px", height: "140px"},
                    footerFour: {width: "140px", height: "40px"},
                    banner: {width: "750px"},
                };
                return (
                    <div className="imgBox" style={{'margin-top': '20px'}}>
                        <div className="imgBox-content">
                            <div className={less.tishiyu}>
                                <strong>上传图片:</strong>
                                请上传格式为PNG/JPG文件体积小于2MB的图片请确认图片各项内容清晰以便审核;图片尺寸：{this.state.imageSize}
                            </div>
                            <UploadImg type="head" title="上传图片"
                                       style={boxsize}
                                       imgSize={imgSize[flag]}
                                       uploadSuccess={this.uploadSuccess}
                                       imgUrl={data.src}
                                       name={data.title}
                            />
                        </div>
                        {
                            flag === 'banner' && <Form
                                {...layout}>
                                <Form.Item
                                    label="链接地址"
                                    name="username"
                                >
                                    <Input defaultValue={data.url} onChange={e => this.onChange(e, 'url')}/>
                                </Form.Item>
                            </Form>
                        }
                    </div>
                )
            }
        };
        return (
            <Modal
                title={''}
                visible={visible}
                onCancel={closeBack}
                width={"800px"}
                footer={[]}
            >
                {
                    content()
                }
                <div className={less.commitibutton} style={{
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                    'padding': '10px',
                }}>
                    <Button key="back1" type="ghost" size="large" onClick={closeBack}>返 回</Button>
                    &nbsp; &nbsp; &nbsp;<Button key="submit1" type="primary" size="large" loading={loading}
                                                onClick={this.handleOk}>提 交</Button>
                </div>
                {
                    data && <BaseTable
                        url="**/reuse/navAdv/logPage"
                        baseParams={{
                            advId: data.id,
                            type: data.type
                        }}
                        columns={columns()}
                        indexkeyWidth={60}
                    />
                }
            </Modal>
        );
    }
}

export default EditModel
