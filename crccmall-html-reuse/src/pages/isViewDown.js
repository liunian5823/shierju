import { Modal } from 'antd';
const confirm = Modal.confirm;
export default function download(name, path, download_atonce) {
    let isImage = ['png', 'jpg', 'jif', 'jpeg', 'bmp'];
    let resSome = isImage.some(value => {
        return value === name.substring(name.lastIndexOf('.') + 1).toLowerCase()
    });
    let link = document.createElement('a');
    link.setAttribute("download", name);
    link.setAttribute("target", '_blank');
    link.href = path;
    if (resSome && !download_atonce) {
        confirm({
            width: 550,
            closable: true,
            iconType: 'none',
            content: <div style={{ position: 'relative', left: '-20px' }}>
                <img src={path} width={'100%'} alt="" />
            </div>,
            okText: '下载图片',
            cancelText: '关闭',
            onOk() {
                link.click();
            },
        });
    } else {
        link.click();
    }
}
