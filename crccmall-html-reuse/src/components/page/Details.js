
/**
 * Created by zhouby on 2018/8/29/029.
 */
import {Tooltip} from 'antd';
/**
 * 通过label文本拼装为六字对齐格式
 * label长度根据业务规定只能为 3456
 * 14px字号下 六字长度为84
 * @param label
 */
let f = function(str){
    let arr=[];
    for(let i=0;i<str.length;i++){
        arr.push(str[i])
    }
    return arr;
}

let getDetailsLabel = function(label,tips){
    return (
        tips?<Tooltip placement="top" title={tips}>
                <span className={
                    "list_label_layer1 text_"+label.length
                        }>
                    {
                        f(label).map((s,index)=>{
                            return (
                                <div className={"text"+(index+1)}>{s}</div>
                            )
                        })
                    }
                </span>
            </Tooltip>:<span className={
                            "list_label_layer1 text_"+label.length
                        }>
                                    {
                                        f(label).map((s,index)=>{
                                            return (
                                                <div className={"text"+(index+1)}>{s}</div>
                                            )
                                        })
                                    }
                        </span>

        /*<span className="list_label_layer1 text_4">
        <div className="text1">1</div><div className="text2">1</div><div className="text3">1</div><div className="text4">1</div>
        </span>*/
        /*<span className="list_label_layer1 text_5">
        <div className="text1">1</div><div className="text2">1</div><div className="text3">1</div><div className="text4">1</div><div className="text5">1</div>
        </span>*/
        /*<span className="list_label_layer1 text_6">
        <div className="text1">1</div><div className="text2">1</div><div className="text3">1</div><div className="text4">1</div><div className="text5">1</div><div className="text6">1</div>
        </span>*/
    )
}
export {
    getDetailsLabel
}
