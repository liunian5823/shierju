/**
 * Created by zhouby on 2018/8/29/029.
 */

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

let detailsLayout = {
        style: {
            display: "table",
                lineHeight: "22px"
        },
        labelCol: {
            style: {
                float: "left",
                    width: 98
            }
        },
        wrapperCol: {
            style: {
                display: "table-cell",
                    width: "100%",
                    verticalAlign: "middle"
            }
        }
    }

let getDetailsLabel = function(label){
    return (
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
    )
}
export {
    getDetailsLabel,detailsLayout
}