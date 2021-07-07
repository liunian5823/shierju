import { Upload } from 'antd';
import Util from "@/utils/util";
import loading from './loading.svg';
import upLoading from './upLoading.svg';
import {viewImg} from "@/utils/urlUtils";
import { configs } from '@/utils/config/systemConfig'
const uploadBaseUrl = configs.uploadUrl;//根上传路径

function beforeUpload(file) {
    const isPNG = file.type === 'image/png';
    const isJPEG = file.type === 'image/jpeg';
    const isJPG = file.type === 'image/jpg';
    if (!isJPEG && !isPNG && !isJPG) {
        Util.alert('请上传png/jpg格式的图片', { type: "error" })
        return false;
    }
    if (file.size > (1048 * 1048 * 2)) {
        Util.alert('上传的照片不能大于2M，请压缩后上传', { type: "error" })
        return false;
    }
    return true;
}

class UploadImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: props.imgUrl,
            loading: false,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            imageUrl: nextProps.imgUrl
        });
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            let res = info.file.response;
            this.props.uploadSuccess(res.data, this.props.filename);
        }
    };

    render() {
        const uploadButton = (
            <div>
                <img width={30} src={this.state.loading ? loading : upLoading} alt=""/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const { imageUrl } = this.state;
        const { imgSize, name } = this.props;
        return (
            <Upload
                name="file"
                listType="picture-card"
                style={{position: 'relative'}}
                showUploadList={false}
                action={uploadBaseUrl+'/uploadImgNoWatermark'}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img  src={viewImg(imageUrl)} alt={name} style={imgSize} /> : uploadButton}
            </Upload>
        );
    }
}
export default UploadImg
