import { Upload, message, Button, Icon } from 'antd';
import { configs } from '@/utils/config/systemConfig';
import './index.css';
import img_item from '../../publishSD/img/add.png';

const uploadBaseUrl = configs.uploadUrl + '?maxSize=5';//根上传路径
import { viewImg } from "@/utils/urlUtils";

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/gif';
    if (!isJpgOrPng) {
        message.error('您只能上传JPG/PNG/BMP/GIF文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
        message.error('上传图片不能大于5兆');
    }
    return isJpgOrPng && isLt2M;
}

class UploadItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.props.uploadSuccess(info.file.response);
        }
    };

    sortLeft = (e) => {
        e.stopPropagation()
        this.props.sortLeft(this.props.index_up)
    }

    sortRight = (e) => {
        e.stopPropagation()
        this.props.sortRight(this.props.index_up)
    }

    render() {
        let data = this.props.data;
        let imgEvent = this.props.imgEvent;
        let imageUrl = data.filePath ? viewImg(data.filePath) : null;
        return (
            <div className="uploaitem">
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} onClick={imgEvent} /> : <img src={img_item} alt="avatar" onClick={function (e) { e.target.nextSibling.children[0].children[0].click() }} style={{ width: '100%', cursor: 'pointer' }} />}
                <Upload
                    headers={{ Authorization: CooKie.get('token') }}
                    showUploadList={false}
                    action={uploadBaseUrl}
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                    <Icon type="caret-left" className='link_anticon' onClick={this.sortLeft} /><span style={{ margin: '4px' }} className="reuse_link1">点击上传</span><Icon onClick={this.sortRight} type="caret-right" className='link_anticon' />
                </Upload>
                <Icon type="cross-circle-o" onClick={this.props.delImg} />
            </div>
        );
    }
}
export default UploadItem
