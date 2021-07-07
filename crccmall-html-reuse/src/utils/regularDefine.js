/**
 * 正则表达式
 * Created by zhouby on 2018/9/28/028.
 */

let phone=function(text){
    return true;
}

/**
 * 联系电话正则表达式(只支持手机号码)
 * @returns {RegExp}
 */
let telephone=function(){
    return RegExp("^1\\d{10}$");
    //return /^1[34578]\d{9}$/;
}

let mobileAndPhone = function(){
    return RegExp("^1[0-9]\\d{9}$|^0\\d{2,3}-?\\d{7,8}$")
    //return RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^0\d{2,3}-?\d{7,8}$")
}

/**
 * 匹配 汉字、字符和数字
 * @param length  最大输入长度
 * @returns {RegExp}
 */
let lengthStrInput=function(length){
    return RegExp("^\\S{1," + length + "}$");
    //return /^[a-zA-Z0-9\u4E00-\u9FA5]{0,200}$/;
}

let lengthStrInput2=function(length){
    return RegExp("^.{0,"+length+"}$");
    //return /^[a-zA-Z0-9\u4E00-\u9FA5]{0,200}$/;
}

/**
 * 密码强度校验
 * @returns {*}
 */
let password = function(){
    //return RegExp("^(?!^(\\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\\w~!@#$%^&*?]{8,32}$");
    return RegExp('^(?!^(\\d+|[a-zA-Z]+|[_`~!@#$%^&*()+=|{}\':;\',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+)$)^[\\w_`~!@#$%^&*()+=|{}\':;\',.<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]{8,32}$');
}

/**
 * 邮箱校验
 * @returns {RegExp}
 */
let isEmail = function() {
    return RegExp("^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$");
}

/**
 * 身份证校验
 * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
 * @returns {RegExp}
 */
let isCardId = function() {
    return RegExp("(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x))$");
}


module.exports = {
    phone,telephone,lengthStrInput,password,isEmail,isCardId,mobileAndPhone,lengthStrInput2
}
