/**
 * Created by zhouby on 2018/10/10/010.
 */

import wangeditor from 'wangeditor'
import { message, Button } from 'antd';

class WangEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",
        }
    }
    componentWillMount() {
        this.setState({
            id:Math.random().toString().replace(".","")
        })
    };
    componentWillUpdate(nextProps){
        // 这里判断一下如果传入的值和组件内部维护的值相同,说明是由用户手动输入的 不刷新
        if(this.props.initHtml!=nextProps.initHtml&&this.html!=nextProps.initHtml){
            this.editor.txt.html(nextProps.initHtml)
        }
    }
    componentDidMount(){
        // https://www.kancloud.cn/wangfupeng/wangeditor3/448202
        let that = this;
        this.editor = new wangeditor(`#a${this.state.id}`);
        this.editor.customConfig.zIndex = 9;
        this.editor.customConfig.pasteIgnoreImg = true;
        if(this.props.uplodImg){
            this.editor.customConfig.uploadImgServer = SystemConfig.systemConfigPath.axiosUrl('/common/upload/file?maxSize=5');
            this.editor.customConfig.uploadImgMaxLength = 1;
            this.editor.customConfig.showLinkImg = false;
            this.editor.customConfig.uploadFileName = 'file';
            this.editor.customConfig.uploadImgHooks = {
                fail: function (xhr, editor, result) {
                    message.error('图片上传出错,请重试!');
                },
                error: function (xhr, editor) {
                    message.error('图片上传出错,请重试!');
                },
                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                customInsert: function (insertImg, result, editor) {
                    if(result&&!(result.code=="200"||result.code=="000000")){
                        throw "上传失败"
                    }
                    insertImg(SystemConfig.systemConfigPath.dfsPathUrl(result.data));
                }
            };
        }
        this.editor.customConfig.pasteTextHandle = function (content) {
            return content.replace(/<img[^>]*>/g,'');
        }
        this.editor.customConfig.onchange=function(html){
            let h;
            if(html.indexOf("w-e-text")>-1){
                h=html;
            }else{
                h=`<div class="wangedit_ w-e-text">${html}</div>`;
            }
            that.html = h;
            that.props.onChange(h)
        };
        let img=[];
        if(this.props.uplodImg){
            img=["image"];
        }
        this.editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            //'fontSize',  // 字号
            //'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            //'list',  // 列表
            'justify',  // 对齐方式
            'table',  // 表格
            'undo',  // 撤销
            'redo',  // 重复
            ...img
        ];
        this.editor.create();
        if(this.props.initHtml){
            this.editor.txt.html(this.props.initHtml)
        }
    }
    render() {
        return (
            <div id={"a"+this.state.id}>
            </div>
        )
    }
}

export default WangEditor;