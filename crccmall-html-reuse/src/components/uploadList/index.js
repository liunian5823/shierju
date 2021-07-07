import { Upload, Row, Col, Button, Icon, message } from 'antd';
import less from './index.less';

const uploadBaseUrl = SystemConfig.configs.uploadUrl;//根上传路径

class UploadList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: props.defaultList ? props.defaultList: []
        };
        this.uploaded = this.uploaded.bind(this);
    }
    //上传组件的参数
    uploads = () => {
        let propsObj = this.props;
        return {
            headers: { "Authorization": window.reduxState.token },
            action: uploadBaseUrl,//必选参数, 上传的地址
            name: propsObj.name ? propsObj.name : 'file',//可选参数, 上传的文件
            showUploadList: true,//可选参数, 是否展示 uploadList, 默认关闭
            data: propsObj.data ? propsObj.data : null,//可选参数, 上传所需参数或返回上传参数的方法
            accept: propsObj.accept ? propsObj.accept : 'file',//可选参数, 接受上传的文件类型,
        }
    };
    //处理上传状态的变化
    uploaded = (info) => {
        let fileList = [...info.fileList];

        if (info.file.status === "done" || info.file.status === 'removed') {
            //上传成功
            let res = info.fileList;
            this.props.uploadSuccess(res);
        }
        this.setState({ fileList });
    };
    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: nextProps.defaultList
        });
    }
    render() {
        return (
            <Upload
                key={'up'}
                {...this.uploads()}
                {...this.props}
                fileList={this.state.fileList}
                onChange={this.uploaded}
            >
                <Button type="ghost" key={1}> <Icon type="upload" /> 点击上传</Button>
                <span style={{ marginLeft: 5,}} key={2}>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span>
            </Upload>
        )
    }
}
export default UploadList;
