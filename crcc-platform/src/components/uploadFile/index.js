import { Upload, Button, Icon } from 'antd';
import Util from '@/utils/util';
import less from './index.less';
import { systemConfigPath } from '@/utils/config/systemConfig';
import { filePathDismant } from '@/utils/dom';

const uploadBaseUrl = SystemConfig.configs.uploadUrl;//根上传路径
const baseAccept = 'image/jpeg,image/png,image/jpg,application/msword,application/vnd.ms-excel,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

class UploadFile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: []
        }
    }
    _params = { maxSize: 5 }
    //上传before钩子
    beforeUpload = (file) => {
        const { max } = this.props;

        if (this.state.fileList.length >= max) {
            Util.alert('上传文件数已达到上限！');
            return false;
        }


        if (this.props.accept && !this.props.accept.includes(file.type)) {
            Util.alert('文件格式不正确', { type: 'error' })
            return false;
        }

        let size = file.size / 1024 / 1024;
        if (size > this._params.maxSize) {
            Util.alert(`请上传文件大小小于 ${this._params.maxSize}MB 的文件！`);
            return false;
        }

        return true;
    }
    //处理上传状态的变化
    uploaded = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({
                fileList: info.fileList
            })
        } else if (info.file.status === "done") {
            //接口调用成功
            const fileList = this.filterSuccessFiles(info.fileList);

            if (info.file.response) {
                let res = info.file.response;

                if (res.code === "000000") {
                    //上传成功
                    const { uploadSuccess } = this.props;
                    if (uploadSuccess && typeof uploadSuccess === 'function') {
                        uploadSuccess(info.file, fileList);
                    }
                    Util.alert(`${info.file.name} 上传成功!`, { type: 'success' });
                } else {
                    //上传失败
                    Util.alert(res.msg, { type: 'error' })
                }
            }
            return;
        } else if (info.file.status === 'error') {
            //接口调用失败
            this.filterSuccessFiles(info.fileList);
            Util.alert(`${info.file.name} 上传失败!`, { type: 'error' });
            return;
        }
    }
    //过滤上传成功的文件
    filterSuccessFiles = (list) => {
        let fileList = list.filter(v => {
            if (v.response && v.response.code == "000000") {
                return v
            }
        })

        this.setState({
            fileList
        })
        return fileList;
    }
    //点击文件链接时的回调
    preview = (file) => {
        const { previewFile } = this.props;

        if (previewFile && typeof previewFile === 'function') {
            previewFile(file)
        } else {
            if (file && file.response && file.response.data) {
                let obj = filePathDismant(file.response.data);

                window.open(systemConfigPath.fileDown(obj.filePath))
            }
        }
    }
    //点击移除文件时的回调
    remove = (file) => {
        let that = this;

        Util.confirm('删除文件', {
            tip: `确定删除 ${file.name} ?`,
            iconType: 'del',
            onOk() {
                const { removeFile } = that.props;
                let fileList = that.state.fileList.filter(v => {
                    if (v.uid !== file.uid) {
                        return v
                    }
                })

                that.setState({
                    fileList
                })
                if (removeFile && typeof removeFile === 'function') {
                    removeFile(file, fileList)
                }
            }
        })
    }

    render() {
        const props = this.props;
        if (props.maxSize) {
            this._params.maxSize = props.maxSize
        }
        const params = {
            action: props.action || (uploadBaseUrl + '?maxSize=' + this._params.maxSize),//上传的地址
            showUploadList: props.showUploadList || false,//默认已经上传的文件列表
            multiple: props.multiple || false,//开启后按住 ctrl 可选择多个文件。
            accept: props.accept || baseAccept,//上传的文件类型
        }

        const {
            children,
            max = 1, //最大上传文件个数
            tip,//是否开启提示
            tipText//提示内容
        } = props;
        const { fileList } = this.state;
        let isDisabled = fileList.length >= max;
        if (typeof props.disabled === 'boolean') {
            isDisabled = props.disabled;
        }

        return (
            <div className={less.uploadfile} style={this.props.style}>
                <Upload
                    key={'up'}
                    {...params}
                    fileList={fileList}
                    disabled={isDisabled}
                    onChange={this.uploaded}
                    onPreview={this.preview}
                    onRemove={this.remove}
                    beforeUpload={this.beforeUpload}>
                    {children
                        ? children
                        : <Button type="ghost" disabled={isDisabled} key={1}> <Icon type="upload" /> 点击上传</Button>
                    }
                    {tip
                        ? <span className={["reuse_tip_i", less.tip].join(' ')}>
                            {tipText || '最多上传5个格式为doc、xlsx、pdf、jpg、png单个文件，体积小于5MB的文件'}
                        </span>
                        : null
                    }
                </Upload>
            </div>
        )
    }
}
export default UploadFile;
