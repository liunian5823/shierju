/**
 * Created by zhouby on 2018/11/10/010.
 */

// import SockJS from 'socket.io-client'
// let Stomp = require("stompjs/lib/stomp.js").Stomp;

function parseJsonObject(str){
    return JSON.parse(Base64.decode(str),"utf-8");
}

function im(user1,toUser1,config){
    let that = this;
    this.user = user1;
    this.toUser = toUser1;
    this.encodeUser = Base64.encode(JSON.stringify(this.user));
    this.encodeToUser = Base64.encode(JSON.stringify(this.toUser));
    this.unreadMessages = config.unreadMessages;
    /**
     * 初始化建立socket连接
     */
    this.connect=function() {
        this.connectGeneral(this.socketSubscribe(this.user,this.toUser,this.unreadMessages));
    }
    /**
     * 订阅未读消息数量
     */
    this.socketSubscribe=function(user,toUser,unreadMessages){
        return function(){
            //获取未读消息,这个必须优先订阅,因为下面异步请求会触发后台发送未读消息
            window.stompClient.subscribe('/topic/'+ toUser.id + "_" + user.id + '_unreadMessageCount', function(r) {
                if(r.body!=0){
                    unreadMessages(r.body,toUser.id);
                }else{
                    unreadMessages("",toUser.id);
                }
            });
            //第一次查询未读消息
            window.stompClient.send("/app/unreadMessageCount", {},
                JSON.stringify({
                    user : user,
                    toUser : toUser
                })
            );
        }
    };
    /**
     * 打开聊天窗口
     */
    this.openSessionWin = function(){
        window.open(SystemConfig.configs.gaodaIm+'/im/message?encodeUser='+this.encodeUser+"&encodeToUser="+this.encodeToUser+"&r="+Math.random(),new Date().getTime());
    };

    /**
     * 一个页面只建立一个socket链接
     */
    this.connectGeneral = function(fn){
        //初始化完并且已经连上了
        if(window.stompClient&&window.stompClient.connected){
            fn();
        }
        //初始化完了但是还没连上,把所有订阅回调加入数组里等连上了执行
        if(window.stompClient&&!window.stompClient.connected){
            !window.stompSocketSubscribeList?window.stompSocketSubscribeList=[]:""
            window.stompSocketSubscribeList.push(fn);
        }
        //没初始化呢都
        if(window.stompClient===undefined){
            //如果没有建立过连接
            var socket = new SockJS(SystemConfig.configs.gaodaIm+'/im/gs-guide-websocket?user='+this.encodeUser+'&toUser='+this.encodeToUser);
            window.stompClient = Stomp.over(socket);
            window.stompClient.connect({
                toUserId : this.toUser.id,
                type : 'client'
            }, function() {
                fn();
                if(window.stompSocketSubscribeList){
                    window.stompSocketSubscribeList.map(item=>item())
                }
            });
        }
    }
}
export {
    im
}